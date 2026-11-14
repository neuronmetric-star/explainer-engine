// Draft word timings WITHOUT a voiceover, so scenes can be built and previewed before audio exists.
// Usage:  node tools/draft.js <video-slug> [--wps 2.9]
// Writes videos/<slug>/data.js with estimated timings (~2.9 spoken words/sec, pauses at punctuation).
// When the real voice.mp3 arrives, run tools/align.js (or tools/tts.js) and it overwrites data.js.
const { fs, path, vdir, readScript, writeData, ScriptParser } = require('./lib');

const args = process.argv.slice(2);
const slug = args[0]; if (!slug) { console.error('usage: node tools/draft.js <video-slug> [--wps 2.9]'); process.exit(1); }
if (fs.existsSync(path.join(vdir(slug), 'voice.mp3'))) console.warn('NOTE: voice.mp3 exists — tools/align.js gives real timing.');
const wps = args.indexOf('--wps') > -1 ? +args[args.indexOf('--wps') + 1] : 2.9;
const script = readScript(slug);
const words = ScriptParser.spokenText(script).split(' ').map(w => ({ w }));
const wt = words.map(x => x.w.replace(/[^\w$%]/g, '').length + 1.5);
const avg = wt.reduce((a, b) => a + b, 0) / wt.length;
let t = 0.15;
for (let i = 0; i < words.length; i++) {
  const d = (wt[i] / avg) / wps;
  words[i].start = +t.toFixed(3); words[i].end = +(t + d).toFixed(3); t += d;
  if (/[.?!]$/.test(words[i].w)) t += 0.28; else if (/[,:;]$/.test(words[i].w)) t += 0.12;
}
writeData(slug, script, words, t + 0.3);
