// Manual phrase timing for voice.mp3 (from silence analysis). Run: node videos/us-ground-stop/align-manual.js
const { readScript, writeData, ScriptParser, ffprobeDuration, path, vdir } = require('../../tools/lib');
const slug = 'us-ground-stop';
const P = [ // [number of words, start, end]
  [14, 0.00, 5.36], [1, 6.23, 6.72], [3, 7.13, 8.37], [5, 9.09, 11.64], [7, 12.22, 14.74],
  [11, 15.25, 19.81], [9, 20.38, 23.49], [5, 23.98, 25.11], [8, 25.67, 28.18], [5, 28.61, 30.25],
  [13, 30.79, 35.53], [2, 36.14, 36.75], [8, 37.30, 39.75], [7, 40.13, 42.07], [6, 42.70, 44.52],
  [4, 45.03, 46.50], [12, 47.07, 51.12], [4, 51.74, 54.15], [5, 54.67, 56.81], [13, 57.48, 60.79],
  [3, 61.45, 62.61], [14, 63.08, 68.01], [5, 68.61, 69.80], [3, 70.30, 71.69], [11, 71.95, 74.91],
  [5, 75.50, 76.39], [5, 76.74, 78.39], [3, 78.94, 79.75]];
const script = readScript(slug), words = ScriptParser.spokenText(script).split(' ');
const n = P.reduce((a, p) => a + p[0], 0); if (n !== words.length) throw new Error(`phrases ${n} != words ${words.length}`);
const out = []; let i = 0;
for (const [k, s, e] of P) {
  const ws = words.slice(i, i + k), wt = ws.map(w => w.replace(/[^\w]/g, '').length + 2), tot = wt.reduce((a, b) => a + b, 0);
  let acc = 0; ws.forEach((w, j) => { const a = s + (e - s) * acc / tot; acc += wt[j]; out.push({ w, start: +a.toFixed(3), end: +(s + (e - s) * acc / tot).toFixed(3) }); });
  i += k;
}
writeData(slug, script, out, ffprobeDuration(path.join(vdir(slug), 'voice.mp3')));
