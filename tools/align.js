// Estimate per-word timings for a voiceover you made elsewhere (e.g. OpenArt / ElevenLabs website).
// Usage:  put the MP3 at videos/<slug>/voice.mp3, then:  node tools/align.js <video-slug> [--debug]
// How:    finds every pause in the audio, then picks which pauses are the sentence/comma breaks so that
//         the speaking speed (syllables per second) stays as even as possible across the whole voiceover
//         (dynamic programming). Words are spread by syllables inside each stretch of speech.
//         Good to ~0.1-0.2s. For exact timing use tools/tts.js (ElevenLabs API).
const { fs, path, vdir, readScript, writeData, ScriptParser, ffmpegPath, spawnSync, ffprobeDuration } = require('./lib');

const slug = process.argv[2]; if (!slug) { console.error('usage: node tools/align.js <video-slug>'); process.exit(1); }
const DEBUG = process.argv.includes('--debug');
const mp3 = path.join(vdir(slug), 'voice.mp3'); if (!fs.existsSync(mp3)) { console.error('missing ' + mp3); process.exit(1); }
const script = readScript(slug);
const words = ScriptParser.spokenText(script).split(' ').map(w => ({ w }));
const dur = ffprobeDuration(mp3);

// syllables per word (rough English rule; abbreviations like U.S. / S&P are spelled out)
const syl = w => { const c = w.replace(/[^A-Za-z&.]/g, '');
  if (/^[A-Z.&]+$/.test(c) && c.replace(/[.&]/g, '').length <= 4) return Math.max(1, c.replace(/[.]/g, '').length);
  const s = w.toLowerCase().replace(/[^a-z]/g, ''); if (!s) return 1;
  let n = (s.match(/[aeiouy]+/g) || []).length; if (/[^l]e$/.test(s) && n > 1) n--; if (/le$/.test(s) && s.length > 2 && !/[aeiouy]le$/.test(s)) n = Math.max(n, 2);
  return Math.max(1, n); };
const S = words.map(x => syl(x.w));

// 1) pauses
const r = spawnSync(ffmpegPath(), ['-hide_banner', '-i', mp3, '-af', 'silencedetect=noise=-33dB:d=0.12', '-f', 'null', '-'], { encoding: 'utf8' });
let gaps = []; let s0 = null;
for (const line of r.stderr.split('\n')) {
  let m = /silence_start: ([\d.]+)/.exec(line); if (m) s0 = parseFloat(m[1]);
  m = /silence_end: ([\d.]+)/.exec(line); if (m && s0 !== null) { gaps.push([s0, parseFloat(m[1])]); s0 = null; }
}
let speechStart = 0, speechEnd = dur;
if (gaps.length && gaps[0][0] < 0.05) speechStart = gaps.shift()[1];
if (s0 !== null) speechEnd = s0; else if (gaps.length && gaps[gaps.length - 1][1] > dur - 0.05) speechEnd = gaps.pop()[0];

// 2) phrases = runs of words ending in punctuation
const abbrev = w => /^([A-Za-z]\.){2,}$/.test(w) || /^(Mr|Mrs|Ms|Dr|St|vs|etc)\.$/i.test(w);   // U.S. / Dr. don't end a phrase
const ends = []; words.forEach((x, i) => { if ((/[,.?!:;]["”)]?$/.test(x.w) && !abbrev(x.w)) || i === words.length - 1) ends.push(i); });
const U = ends.length, P = gaps.length;
const phSyl = ends.map((e, j) => S.slice(j ? ends[j - 1] + 1 : 0, e + 1).reduce((a, b) => a + b, 0));
const strong = ends.map(e => /[.?!:]["”)]?$/.test(words[e].w));
// speech time between time a and b, not counting pauses inside
const speechBetween = (a, b) => { let t = b - a; for (const g of gaps) { const x0 = Math.max(a, g[0]), x1 = Math.min(b, g[1]); if (x1 > x0) t -= x1 - x0; } return Math.max(.01, t); };

function solve(rate) {
  // f[j][k]: best cost with phrase j ending right before pause k (k = P means end of speech)
  const INF = 1e18, f = Array.from({ length: U }, () => new Float64Array(P + 1).fill(INF)), from = Array.from({ length: U }, () => new Int32Array(P + 1).fill(-2)), fromK = Array.from({ length: U }, () => new Int32Array(P + 1).fill(-2));
  const t0k = k => k < 0 ? speechStart : gaps[k][1], t1k = k => k === P ? speechEnd : gaps[k][0];
  const segCost = (j0, j1, k0, k1) => {            // phrases j0..j1 spoken between end of pause k0 and start of pause k1
    if (t1k(k1) <= t0k(k0)) return INF;
    let sy = 0, pen = 0; for (let j = j0; j <= j1; j++) { sy += phSyl[j]; if (j < j1) pen += strong[j] ? 5 : 0.6; }
    for (let k = k0 + 1; k < k1; k++) { const L = gaps[k][1] - gaps[k][0]; pen += L > .35 ? 6 * L : 1.2 * L; }   // long unused pauses are suspicious
    const d = speechBetween(t0k(k0), t1k(k1)), e = sy / rate, z = (d - e) / (.18 * e + .25);
    return z * z + pen; };
  for (let j1 = 0; j1 < U; j1++) for (let k1 = 0; k1 <= P; k1++) {
    if ((k1 === P) !== (j1 === U - 1) && k1 === P) continue;
    for (let j0 = j1; j0 >= 0 && j1 - j0 < 6; j0--) {
      if (j0 === 0) { const c = segCost(0, j1, -1, k1); if (c < f[j1][k1]) { f[j1][k1] = c; from[j1][k1] = -1; fromK[j1][k1] = -1; } continue; }
      for (let k0 = k1 - 1; k0 >= 0 && k1 - k0 < 14; k0--) { const prev = f[j0 - 1][k0]; if (prev >= INF) continue;
        const c = prev + segCost(j0, j1, k0, k1); if (c < f[j1][k1]) { f[j1][k1] = c; from[j1][k1] = j0 - 1; fromK[j1][k1] = k0; } } }
  }
  const segs = []; let j = U - 1, k = P;
  if (f[j][k] >= INF) return null;
  while (j >= 0) { const pj = from[j][k], pk = fromK[j][k]; segs.unshift({ w0: pj < 0 ? 0 : ends[pj] + 1, w1: ends[j], t0: pk < 0 ? speechStart : gaps[pk][1], t1: k === P ? speechEnd : gaps[k][0] }); j = pj; k = pk; }
  return { segs, cost: f[U - 1][P] };
}

// 3) solve, re-estimate the speaking rate from the answer, solve again
const totalSyl = S.reduce((a, b) => a + b, 0);
let rate = totalSyl / speechBetween(speechStart, speechEnd), best = null;
for (let it = 0; it < 4; it++) { const sol = solve(rate); if (!sol) break; best = sol;
  rate = totalSyl / sol.segs.reduce((a, s) => a + speechBetween(s.t0, s.t1), 0); }
if (!best) { console.error('alignment failed'); process.exit(1); }

// 4) spread words by syllables over the speech inside each segment (skipping pauses inside it)
for (const sg of best.segs) {
  const inner = []; let t = sg.t0; for (const g of gaps) if (g[0] >= sg.t0 && g[1] <= sg.t1) { inner.push([t, g[0]]); t = g[1]; } inner.push([t, sg.t1]);
  const sp = inner.reduce((a, x) => a + x[1] - x[0], 0), ws = S.slice(sg.w0, sg.w1 + 1), tot = ws.reduce((a, b) => a + b, 0) + .35 * ws.length;
  const at = u => { let left = u * sp; for (const [a, b] of inner) { if (left <= b - a) return a + left; left -= b - a; } return sg.t1; };
  let acc = 0; for (let i = sg.w0; i <= sg.w1; i++) { const st = at(acc / tot); acc += S[i] + .35; words[i].start = +st.toFixed(3); words[i].end = +at(acc / tot).toFixed(3); }
  if (DEBUG) console.log(sg.t0.toFixed(2), '-', sg.t1.toFixed(2), (S.slice(sg.w0, sg.w1 + 1).reduce((a, b) => a + b, 0) / speechBetween(sg.t0, sg.t1)).toFixed(1) + ' syl/s', '|', words.slice(sg.w0, sg.w1 + 1).map(x => x.w).join(' '));
}
console.log(`found ${gaps.length} pauses, ${best.segs.length} speech segments, ${rate.toFixed(2)} syllables/s`);
writeData(slug, script, words, dur);
