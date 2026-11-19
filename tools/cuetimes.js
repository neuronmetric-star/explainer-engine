// Print cue start times of a video as JSON {cue: seconds, _end: audioLength}: node tools/cuetimes.js <slug>
const fs = require('fs'), path = require('path');
const { parse } = require('../engine/script.js');
const dir = path.join(__dirname, '..', 'videos', process.argv[2]); global.window = {};
eval(fs.readFileSync(path.join(dir, 'data.js'), 'utf8')); const D = window.VIDEO_DATA, W = D.words, C = {};
let wi = 0, pend = [];
for (const tk of parse(D.script)) { if (tk.cue) { pend.push(tk.cue); continue; } const w0 = W[Math.min(wi, W.length - 1)]; pend.forEach(c => C[c] = w0.start); pend = []; wi += tk.n; }
pend.forEach(c => C[c] = D.audioLength); C._end = D.audioLength;
console.log(JSON.stringify(C));
