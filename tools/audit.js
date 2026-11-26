// Measured audit for an explainer (so Claude never grades its own work by eye). Brian, Nov 26 2026.
// Usage: node tools/audit.js <slug>      -> prints a PASS/WARN/FAIL table and writes videos/<slug>/audit-measured.md
// Measures (all from the real files): the voice, the search phrase, the re-hook position, the length, the gaps between on-screen changes,
// the longest hold on one painting, static camera shots, voice-file duplicates, and the required notes/sources/post files.
// It does NOT judge comprehension: that is the follow-through gate (notes.md) and Brian's ear.
const { fs, path, ROOT, vdir, ScriptParser, ffmpegPath, spawnSync, ffprobeDuration } = require('./lib');
const crypto = require('crypto');
const slug = process.argv[2]; if (!slug) { console.error('usage: node tools/audit.js <slug>'); process.exit(1); }
const dir = vdir(slug), rows = []; const add = (area, check, status, detail) => rows.push({ area, check, status, detail });
const need = f => fs.existsSync(path.join(dir, f));
const cueName = c => { const m = /^([\w-]+)([+-][\d.]+)?$/.exec(String(c)); return m ? m[1] : null; };
const cueOff = c => { const m = /^([\w-]+)([+-][\d.]+)?$/.exec(String(c)); return m && m[2] ? parseFloat(m[2]) : 0; };
if (!need('data.js') || !need('beats.json')) { console.error('need data.js (tools/align.js) and beats.json'); process.exit(1); }
global.window = {}; eval(fs.readFileSync(path.join(dir, 'data.js'), 'utf8'));
const D = window.VIDEO_DATA, B = JSON.parse(fs.readFileSync(path.join(dir, 'beats.json'), 'utf8')), W = D.words, tail = B.tail === undefined ? 1 : B.tail;
const C = {}; { let wi = 0, pend = []; for (const tk of ScriptParser.parse(D.script)) { if (tk.cue) { pend.push(tk.cue); continue; } const w = W[Math.min(wi, W.length - 1)]; pend.forEach(c => C[c] = w.start); pend = []; wi += tk.n; } pend.forEach(c => C[c] = D.audioLength); }
const T = c => C[cueName(c)] + cueOff(c);
const mmss = s => `${Math.floor(s / 60)}:${String(Math.round(s % 60)).padStart(2, '0')}`;

// voice
add('voice', 'voice starts at frame 0', W[0].start <= 0.15 ? 'PASS' : 'FAIL', `first word at ${W[0].start.toFixed(2)} s`);
if (B.searchPhrase) { const ws = B.searchPhrase.toLowerCase().split(' '); const norm = x => x.toLowerCase().replace(/[^a-z]/g, ''); let t = null; for (let i = 0; i + ws.length <= Math.min(W.length, 30); i++) if (ws.every((w, k) => norm(W[i + k].w) === w)) { t = W[i + ws.length - 1].end; break; }
  add('voice', 'search phrase spoken in the first 3 s', t === null ? 'WARN' : t <= 3 ? 'PASS' : 'WARN', t === null ? `"${B.searchPhrase}" not found in the first words` : `"${B.searchPhrase}" finished at ${t.toFixed(2)} s`); }
// duplicate voice files
{ const md5 = f => crypto.createHash('md5').update(fs.readFileSync(f)).digest('hex'); const mine = ['voice_raw.mp3', 'voice.mp3'].map(f => path.join(dir, f)).filter(fs.existsSync); const dups = [];
  for (const v of fs.readdirSync(path.join(ROOT, 'videos'))) { if (v === slug) continue; for (const f of ['voice_raw.mp3', 'voice.mp3']) { const o = path.join(ROOT, 'videos', v, f); if (fs.existsSync(o)) for (const m of mine) if (path.basename(m) === f && md5(m) === md5(o)) dups.push(`${f} == videos/${v}/${f}`); } }
  add('voice', 'voice file is not a copy of another video\'s', dups.length ? 'FAIL' : 'PASS', dups.join('; ') || 'checksum unique'); }
// structure
if (C.rehook !== undefined) { const p = C.rehook / D.audioLength * 100; add('script', 're-hook ("rehook" cue) between 25% and 60%', p >= 25 && p <= 60 ? 'PASS' : 'WARN', `at ${p.toFixed(0)}%`); } else add('script', 'a [#rehook] cue exists', 'WARN', 'no cue named rehook');
const words = require(path.join(ROOT, 'engine', 'script.js')).spokenText(D.script).split(/\s+/).filter(Boolean).length;
const total = fs.existsSync(path.join(dir, 'final.mp4')) ? ffprobeDuration(path.join(dir, 'final.mp4')) : D.audioLength + tail;
add('script', 'final length 1:02 to 1:15', total >= 62 && total <= 75.5 ? 'PASS' : 'FAIL', `${mmss(total)} (${total.toFixed(1)} s), ${words} words${fs.existsSync(path.join(dir, 'final.mp4')) ? '' : ', estimated (no final.mp4 yet)'}`);
// on-screen change gaps
{ const ev = []; (B.shots || []).forEach(s => ev.push(T(s.at))); (B.overlays || []).forEach(o => { if (o.type !== 'gauge') ev.push(T(o.at)); }); (B.actors || []).forEach(a => (a.events || []).forEach(e => ev.push(T(e.at))));
  const e = [...new Set(ev.map(x => +x.toFixed(2)))].sort((a, b) => a - b), g = []; for (let i = 1; i < e.length; i++) g.push([e[i] - e[i - 1], e[i - 1]]); g.sort((a, b) => b[0] - a[0]);
  add('visual', 'something changes on screen at least every 3 s', g[0][0] <= 3.05 ? 'PASS' : 'WARN', `${e.length} changes, avg ${((e[e.length - 1] - e[0]) / (e.length - 1)).toFixed(2)} s, longest gap ${g[0][0].toFixed(1)} s at ${g[0][1].toFixed(1)} s`); }
// painting holds
{ const runs = []; (B.shots || []).forEach(s => { if (!runs.length || runs[runs.length - 1].plate !== s.plate) runs.push({ plate: s.plate, t: T(s.at) }); }); runs.forEach((r, i) => r.d = (i + 1 < runs.length ? runs[i + 1].t : D.audioLength + tail) - r.t);
  const body = runs.filter(r => r.plate !== (B.endingPlate || 'E')), longest = body.reduce((a, b) => b.d > a.d ? b : a, { d: 0 });
  add('visual', 'one painting per idea: no painting held > 12 s (ending excluded)', longest.d <= 12.5 ? 'PASS' : 'WARN', `${new Set(runs.map(r => r.plate)).size} distinct paintings; longest hold ${longest.d.toFixed(1)} s (${longest.plate})`); }
add('visual', 'the camera moves in every shot', (B.shots || []).every(s => s.zoom[0] !== s.zoom[1]) ? 'PASS' : 'FAIL', `${(B.shots || []).filter(s => s.zoom[0] === s.zoom[1]).length} static shots`);
add('visual', 'caption chunks (TEST) setting', 'INFO', `captionChunk = ${B.captionChunk === undefined ? 3 : B.captionChunk} (0/1 = one word at a time)`);
// files
const notes = fs.readdirSync(dir).filter(f => /notes\.md$/.test(f)); let notesOk = false; if (notes.length) { const t = fs.readFileSync(path.join(dir, notes[0]), 'utf8'); notesOk = /promise ledger/i.test(t) && /causal chain/i.test(t) && /retell/i.test(t); }
add('follow-through', 'notes file has a promise ledger, a causal chain and a written retell', notesOk ? 'PASS' : 'FAIL', notes[0] || 'no *notes.md file');
if (need('sources.md')) { const urls = (fs.readFileSync(path.join(dir, 'sources.md'), 'utf8').match(/https?:\/\/\S+/g) || []).length; add('facts', 'sources.md has at least 3 source links', urls >= 3 ? 'PASS' : 'FAIL', `${urls} links`); } else add('facts', 'sources.md exists', 'FAIL', 'missing');
add('post', 'cover.jpg and post.md exist', need('cover.jpg') && need('post.md') ? 'PASS' : 'WARN', `${need('cover.jpg') ? 'cover ok' : 'no cover'}, ${need('post.md') ? 'post.md ok' : 'no post.md'}`);
add('audio', 'sound effects file built', need('sfx.wav') ? 'PASS' : 'WARN', need('sfx.wav') ? 'sfx.wav present (not listened to)' : 'no sfx.wav');
const icon = { PASS: '✅', WARN: '⚠️', FAIL: '❌', INFO: 'ℹ️' };
const md = `# Measured audit: ${slug} (generated by tools/audit.js)\n\n| Area | Check | Result | Measured |\n|---|---|---|---|\n${rows.map(r => `| ${r.area} | ${r.check} | ${icon[r.status]} ${r.status} | ${r.detail} |`).join('\n')}\n\nThis measures; it does not judge comprehension. Brian's ear and the follow-through notes do that.\n`;
fs.writeFileSync(path.join(dir, 'audit-measured.md'), md);
rows.forEach(r => console.log(`${icon[r.status]} ${r.area}: ${r.check} :: ${r.detail}`));
const f = rows.filter(r => r.status === 'FAIL').length, w = rows.filter(r => r.status === 'WARN').length; console.log(`\n${f} fail, ${w} warn -> videos/${slug}/audit-measured.md`); process.exit(f ? 1 : 0);
