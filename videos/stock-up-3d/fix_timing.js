// Pins the final phrases to pauses measured in voice.mp3 (align.js drifted by one pause after "water").
// Run after: node tools/align.js stock-up-3d
const fs = require('fs'), path = require('path');
const f = path.join(__dirname, 'data.js'); global.window = {}; eval(fs.readFileSync(f, 'utf8')); const d = window.VIDEO_DATA;
const segs = [[58.77, 60.28, 3], [60.58, 62.20, 2], [62.59, 63.09, 1], [63.39, 63.98, 2], [64.58, 66.11, 6], [66.61, 68.40, 6], [69.16, 71.95, 9]];
const total = segs.reduce((a, s) => a + s[2], 0); let i = d.words.length - total;
if (!/water/i.test(d.words[i].w)) throw new Error('expected "water" at word ' + i + ', got ' + d.words[i].w);
for (const [a, b, n] of segs) {
  const ws = d.words.slice(i, i + n), L = ws.map(w => w.w.replace(/[^\w]/g, '').length + 1.5), T = L.reduce((x, y) => x + y, 0); let t = a;
  ws.forEach((w, k) => { w.start = +t.toFixed(3); t += (b - a) * L[k] / T; w.end = +t.toFixed(3); }); i += n;
}
fs.writeFileSync(f, 'window.VIDEO_DATA = ' + JSON.stringify(d) + ';\n'); console.log('pinned last', total, 'words');
