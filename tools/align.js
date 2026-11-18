// Estimate per-word timings for a voiceover you made elsewhere (e.g. OpenArt / ElevenLabs website).
// Usage:  put the MP3 at videos/<slug>/voice.mp3, then:  node tools/align.js <video-slug>
// How:    finds the pauses in the audio, pins sentence/comma ends to them, spreads words by length in between.
//         Good to ~0.1-0.2s. For exact timing use tools/tts.js (ElevenLabs API).
const { fs, path, vdir, readScript, writeData, ScriptParser, ffmpegPath, spawnSync, ffprobeDuration } = require('./lib');

const slug = process.argv[2]; if (!slug) { console.error('usage: node tools/align.js <video-slug>'); process.exit(1); }
const mp3 = path.join(vdir(slug), 'voice.mp3'); if (!fs.existsSync(mp3)) { console.error('missing ' + mp3); process.exit(1); }
const script = readScript(slug);
const words = ScriptParser.spokenText(script).split(' ').map(w => ({ w }));
const dur = ffprobeDuration(mp3);

// 1) silences
const r = spawnSync(ffmpegPath(), ['-hide_banner', '-i', mp3, '-af', 'silencedetect=noise=-35dB:d=0.18', '-f', 'null', '-'], { encoding: 'utf8' });
const gaps = []; let s0 = null;
for (const line of r.stderr.split('\n')) {
  let m = /silence_start: ([\d.]+)/.exec(line); if (m) s0 = parseFloat(m[1]);
  m = /silence_end: ([\d.]+)/.exec(line); if (m && s0 !== null) { gaps.push([s0, parseFloat(m[1])]); s0 = null; }
}
let speechStart = 0, speechEnd = dur;
if (gaps.length && gaps[0][0] < 0.05) speechStart = gaps.shift()[1];
if (s0 !== null) speechEnd = s0; else if (gaps.length && gaps[gaps.length - 1][1] > dur - 0.05) speechEnd = gaps.pop()[0];

// 2) first pass: spread words by length over speech time (skipping gaps)
const wt = words.map(x => x.w.replace(/[^\w$%]/g, '').length + 1.5);
const total = wt.reduce((a, b) => a + b, 0);
const segs = []; { let t = speechStart; for (const g of gaps) { if (g[0] > t) segs.push([t, g[0]]); t = g[1]; } segs.push([t, speechEnd]); }
const speech = segs.reduce((a, s) => a + s[1] - s[0], 0);
const toReal = x => { let left = x * speech; for (const s of segs) { const d = s[1] - s[0]; if (left <= d) return s[0] + left; left -= d; } return speechEnd; };
let acc = 0; const est = words.map((_, i) => { const st = toReal(acc / total); acc += wt[i]; return [st, toReal(acc / total)]; });

// 3) match pauses to word boundaries with dynamic programming (global best fit, not greedy):
//    a pause usually follows punctuation, and the speaking rate between matched pauses should stay steady.
//    One stray pause can no longer shift every caption after it.
const B = words.length, K = gaps.length;
const CW = [0]; wt.forEach(x => CW.push(CW[CW.length - 1] + x));
const str = j => /[.?!]["\u201d]?$/.test(words[j].w) ? 2 : /[,;:]["\u201d]?$/.test(words[j].w) ? 1 : 0;
const S2 = [0]; for (let j = 0; j < B; j++) S2.push(S2[j] + (str(j) === 2 ? 1 : 0));
const R = total / speech;
const pEnd = k => k < 0 ? speechStart : gaps[k][1], pStart = k => k >= K ? speechEnd : gaps[k][0];
const punct = j => j >= B - 1 ? 0 : [2.5, 0, -0.5][str(j)];
const skip = k => 1 + 4 * Math.max(0, gaps[k][1] - gaps[k][0] - .25);
const INF = 1e18, dp = [], from = [];
for (let k = -1; k <= K; k++) { dp[k + 1] = new Float64Array(B + 1).fill(INF); from[k + 1] = new Int32Array((B + 1) * 2).fill(-1); }
dp[0][0] = 0;   // virtual start: pause -1 at boundary -1
for (let k = 0; k <= K; k++) for (let j = 0; j < B; j++) {
  if (k === K && j !== B - 1) continue;   // virtual end pause sits after the last word
  if (k < K && j === B - 1) continue;
  for (let kp = Math.max(-1, k - 4); kp < k; kp++) {
    let sk = 0; for (let q = kp + 1; q < k; q++) sk += skip(q);
    for (let jp = Math.max(-1, j - 45); jp < j; jp++) {
      const base = dp[kp + 1][jp + 1]; if (base >= INF) continue;
      let inner = 0; for (let q = kp + 1; q < k; q++) inner += gaps[q][1] - gaps[q][0];
      const dur = pStart(k) - pEnd(kp) - inner; if (dur <= .05) continue;
      const rate = (CW[j + 1] - CW[jp + 1]) / dur;
      const missed = S2[j] - S2[jp + 1];   // sentence ends inside the segment with no pause
      const c = base + 4 * Math.log(rate / R) ** 2 + sk + punct(j) + .4 * missed;
      if (c < dp[k + 1][j + 1]) { dp[k + 1][j + 1] = c; from[k + 1][(j + 1) * 2] = kp; from[k + 1][(j + 1) * 2 + 1] = jp; }
    } }
}
const chain = []; { let k = K, j = B - 1; while (k >= 0) { chain.push([k, j]); const kp = from[k + 1][(j + 1) * 2], jp = from[k + 1][(j + 1) * 2 + 1]; k = kp; j = jp; } }
chain.reverse();
const anchors = [[0, speechStart]];
for (const [k, j] of chain) if (k < K) anchors.push([j + 1, gaps[k][1], gaps[k][0]]);
anchors.push([words.length, speechEnd]);

// 4) spread words by length between anchors
for (let a = 0; a < anchors.length - 1; a++) {
  const [k0, t0] = anchors[a], [k1, , pauseStart] = anchors[a + 1];
  const t1 = a + 1 === anchors.length - 1 ? speechEnd : pauseStart;
  const tot = wt.slice(k0, k1).reduce((x, y) => x + y, 0); let t = t0;
  for (let k = k0; k < k1; k++) { const d = wt[k] / tot * (t1 - t0); words[k].start = +t.toFixed(3); words[k].end = +(t + d).toFixed(3); t += d; }
}
console.log(`found ${gaps.length} pauses, pinned ${anchors.length - 2} of them to punctuation`);
writeData(slug, script, words, dur);
