// Voice drama pass (Brian, Nov 24 2026: "the what the heck needs to be louder… slowed down, faster in other places… for drama").
// Usage: node tools/voice_drama.js <slug>      (after align.js; then run align.js again, then render)
// Reads videos/<slug>/voice-drama.json, cuts the tightened voice.mp3 at script cues (word starts from data.js), and per segment
// changes the speed (tempo), loudness (gain, with a limiter so nothing clips), punch (compression for the shouted hook) and adds pauses.
// Keeps the input as voice_plain.mp3 (first run only), writes voice.mp3. Prints the new length (must stay 1:05–1:15 with the tail).
//
// voice-drama.json: { "segments": [ { "from": "scream", "to": "q", "gain": 9, "punch": true },
//                                   { "from": "look", "to": "card", "tempo": 0.88, "pauseAfter": 0.25 }, ... ] }
//   from/to = script cues (to = the next segment's start; omit "to" for "until the next listed segment / the end").
//   Gaps between listed segments play unchanged. tempo < 1 = slower (drama), > 1 = faster (setup). pauseBefore/pauseAfter in seconds.
const { fs, path, vdir, ScriptParser, ffmpegPath, spawnSync, ffprobeDuration } = require('./lib');
const slug = process.argv[2]; if (!slug) { console.error('usage: node tools/voice_drama.js <slug>'); process.exit(1); }
const dir = vdir(slug), planFile = path.join(dir, 'voice-drama.json');
if (!fs.existsSync(planFile)) { console.error('missing ' + planFile); process.exit(1); }
global.window = {}; eval(fs.readFileSync(path.join(dir, 'data.js'), 'utf8'));
const D = window.VIDEO_DATA, W = D.words, C = {};
{ let wi = 0, pend = []; for (const tk of ScriptParser.parse(D.script)) { if (tk.cue) { pend.push(tk.cue); continue; }
  const w = W[Math.min(wi, W.length - 1)]; pend.forEach(c => C[c] = w.start); pend = []; wi += tk.n; } pend.forEach(c => C[c] = D.audioLength); }
const T = c => { if (typeof c === 'number') return c; if (!(c in C)) throw new Error('unknown cue ' + c); return C[c]; };
const plain = path.join(dir, 'voice_plain.mp3'), voice = path.join(dir, 'voice.mp3');
if (!fs.existsSync(plain)) fs.copyFileSync(voice, plain);
const len = ffprobeDuration(plain), lead = .06;   // cut a hair before each word starts, inside the gap before it
const plan = JSON.parse(fs.readFileSync(planFile, 'utf8')).segments.map(s => ({ ...s, a: Math.max(0, T(s.from) - (T(s.from) > 0 ? lead : 0)) }))
  .sort((x, y) => x.a - y.a);
plan.forEach((s, i) => { s.b = s.to !== undefined ? Math.max(0, T(s.to) - lead) : (plan[i + 1] ? plan[i + 1].a : len); });
// build the full list of pieces: listed segments + untouched gaps
const pieces = []; let cur = 0;
for (const s of plan) { if (s.a > cur + .01) pieces.push({ a: cur, b: s.a }); pieces.push(s); cur = s.b; }
if (cur < len - .01) pieces.push({ a: cur, b: len });
const parts = [], labels = [];
pieces.forEach((p, i) => {
  const f = [`[0:a]atrim=${p.a.toFixed(3)}:${p.b.toFixed(3)},asetpts=PTS-STARTPTS`];
  if (p.tempo && Math.abs(p.tempo - 1) > .005) f.push(`atempo=${p.tempo}`);
  if (p.punch) f.push('acompressor=threshold=-20dB:ratio=6:attack=3:release=60:makeup=2');
  if (p.gain) f.push(`volume=${p.gain}dB`);
  if (p.pauseBefore) f.push(`adelay=${Math.round(p.pauseBefore * 1000)}:all=1`);
  if (p.pauseAfter) f.push(`apad=pad_dur=${p.pauseAfter}`);
  parts.push(f.join(',') + `[p${i}]`); labels.push(`[p${i}]`);
});
const graph = parts.join(';') + ';' + labels.join('') + `concat=n=${labels.length}:v=0:a=1,alimiter=limit=0.97[out]`;
const r = spawnSync(ffmpegPath(), ['-y', '-loglevel', 'error', '-i', plain, '-filter_complex', graph, '-map', '[out]', '-q:a', '2', voice], { stdio: 'inherit' });
if (r.status) process.exit(r.status);
const out = ffprobeDuration(voice);
console.log(`voice drama -> ${path.relative(process.cwd(), voice)}  ${len.toFixed(2)}s -> ${out.toFixed(2)}s (${pieces.length} pieces). Now run: node tools/align.js ${slug}`);
