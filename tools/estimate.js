// Placeholder word timings so a scene can be built and previewed BEFORE the voiceover exists.
// Usage: node tools/estimate.js <slug> [wpm=205]
// Writes videos/<slug>/data.js (marked estimated). Replace later with tools/align.js or tools/tts.js.
const { readScript, writeData, ScriptParser } = require('./lib');
const slug = process.argv[2]; if (!slug) { console.error('usage: node tools/estimate.js <slug> [wpm]'); process.exit(1); }
const wpm = +(process.argv[3] || 205);
const script = readScript(slug);
const words = ScriptParser.spokenText(script).split(' ');
const per = 60 / wpm, out = [];
let t = 0.15;
for (const w of words) {
  const len = per * (0.55 + 0.45 * Math.min(2, w.replace(/[^\w]/g, '').length / 5));
  out.push({ w, start: +t.toFixed(3), end: +(t + len).toFixed(3) });
  t += len + (/[.?!]["”]?$/.test(w) ? 0.28 : /[,;:]$/.test(w) ? 0.12 : 0.02);
}
writeData(slug, script, out, t + 0.3);
console.log('ESTIMATED timing at', wpm, 'wpm. Replace with align.js once voice.mp3 exists.');
