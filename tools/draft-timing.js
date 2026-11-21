// Draft word timing with no audio — lets you build and preview a scene before the voiceover exists.
// Usage: node tools/draft-timing.js <slug> [wordsPerSecond=2.4]   (re-run tools/align.js once voice.mp3 arrives)
const { readScript, writeData, ScriptParser } = require('./lib');
const slug = process.argv[2]; if (!slug) { console.error('usage: node tools/draft-timing.js <slug> [wps]'); process.exit(1); }
const wps = +(process.argv[3] || 2.4), script = readScript(slug);
let t = 0.2; const words = [];
for (const w of ScriptParser.spokenText(script).split(' ')) { const d = (w.length + 2) / (7 * wps) * 1.6; words.push({ w, start: +t.toFixed(3), end: +(t + d).toFixed(3) }); t += d + (/[.,?!:;]$/.test(w) ? .3 : .04); }
writeData(slug, script, words, t + .3);
