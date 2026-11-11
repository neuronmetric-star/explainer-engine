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

// 3) pin punctuation-ending words to the nearest pause (in order)
const anchors = [[0, speechStart]]; let lastIdx = -1;
for (const g of gaps) {
  let best = -1, bd = 1e9;
  for (let i = lastIdx + 1; i < words.length - 1; i++) {
    if (!/[,.?!:;]$/.test(words[i].w)) continue;
    const d = Math.abs(est[i][1] - g[0]); if (d < bd) { bd = d; best = i; }
    if (est[i][1] > g[0] + 3) break;
  }
  if (best >= 0 && bd < 2.5) { anchors.push([best + 1, g[1], g[0]]); lastIdx = best; }
}
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
