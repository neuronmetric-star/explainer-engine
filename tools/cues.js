// Print cue times for a video (from its data.js). Usage: node tools/cues.js <slug> [cue+0.5 ...]
// With extra args, prints a comma list of those times (handy for --preview).
const { fs, path, vdir, ScriptParser } = require('./lib');
const slug = process.argv[2]; const src = fs.readFileSync(path.join(vdir(slug), 'data.js'), 'utf8');
const D = JSON.parse(src.slice(src.indexOf('{'), src.lastIndexOf('}') + 1));
const C = {}; let wi = 0, pend = [];
for (const tk of ScriptParser.parse(D.script)) { if (tk.cue) { pend.push(tk.cue); continue; } pend.forEach(c => C[c] = D.words[Math.min(wi, D.words.length - 1)].start); pend = []; wi += tk.n; }
pend.forEach(c => C[c] = D.audioLength);
const want = process.argv.slice(3);
if (!want.length) { for (const k in C) console.log(k.padEnd(12), C[k].toFixed(2)); console.log('END'.padEnd(12), D.audioLength.toFixed(2)); }
else console.log(want.map(x => { const m = /^(.+?)([+-]\d*\.?\d+)?$/.exec(x); return isNaN(+x) ? (C[m[1]] + (m[2] ? +m[2] : 0)).toFixed(2) : x; }).join(','));
