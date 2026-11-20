// Build videos/<slug>/sfx.wav from videos/<slug>/sfx-cues.js (sound effects synced to script cues and words).
// Usage: node tools/sfx.js <slug>      (render.js mixes sfx.wav under the voice automatically when it exists)
// sfx-cues.js:  module.exports = ({ T, word }) => [ { at: 'robots+0.2', sfx: 'step', gain: .5 }, { at: word('dark'), sfx: 'clunk' }, ... ]
//   recorded audio: { at: 'rain', file: 'clips/rain.wav', from: 0, dur: 1.2, gain: .6 } (path relative to the video folder)
//   T('cue+0.3') -> seconds; word('dark', 'end') -> start time of that spoken word (searching from a cue). Library: tools/sfx.py.
const { fs, path, vdir, ROOT, ScriptParser, spawnSync } = require('./lib');
const slug = process.argv[2]; if (!slug) { console.error('usage: node tools/sfx.js <slug>'); process.exit(1); }
const dir = vdir(slug), cueFile = path.join(dir, 'sfx-cues.js');
if (!fs.existsSync(cueFile)) { console.error('missing ' + cueFile); process.exit(1); }
global.window = {}; eval(fs.readFileSync(path.join(dir, 'data.js'), 'utf8'));
const D = window.VIDEO_DATA, W = D.words, C = {};
{ let wi = 0, pend = []; for (const tk of ScriptParser.parse(D.script)) { if (tk.cue) { pend.push(tk.cue); continue; }
  const w = W[Math.min(wi, W.length - 1)]; pend.forEach(c => C[c] = w.start); pend = []; wi += tk.n; } pend.forEach(c => C[c] = D.audioLength); }
const T = x => { if (typeof x === 'number') return x; const m = /^([\w-]+)([+-][\d.]+)?$/.exec(x); if (!m || !(m[1] in C)) throw new Error('bad cue ' + x); return C[m[1]] + (m[2] ? parseFloat(m[2]) : 0); };
const norm = w => w.toLowerCase().replace(/[^a-z0-9]/g, '');
const word = (w, from) => { const t0 = from ? T(from) : 0, x = W.find(o => o.start >= t0 - .01 && norm(o.w) === norm(w)); if (!x) throw new Error('word not found: ' + w); return x.start; };
delete require.cache[cueFile];
const events = require(cueFile)({ T, word, cues: C }).map(e => Object.assign({}, e, { at: undefined, t: T(e.at), gain: e.gain === undefined ? 1 : e.gain, file: e.file && path.resolve(dir, e.file) }));
const tail = 2.6, len = D.audioLength + tail; // matches the scene tail
const tmp = path.join(dir, '.sfx-events.json'); fs.writeFileSync(tmp, JSON.stringify(events));
const r = spawnSync('python3', [path.join(ROOT, 'tools', 'sfx.py'), tmp, path.join(dir, 'sfx.wav'), String(len)], { stdio: 'inherit' });
fs.rmSync(tmp, { force: true }); process.exit(r.status || 0);
