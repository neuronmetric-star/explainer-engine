// Assemble a video from AI clips (e.g. OpenArt) instead of the 3D engine.
// Usage: node tools/assemble.js <slug> [--preview] [--no-voice]
//   --no-voice: leave the narration out (Brian adds voice/music in CapCut); the clips' own sound effects are kept.
// Reads videos/<slug>/clips.json: [{ "from": "<cue>", "file": "clips/c01.mp4", "ss": 0, "speed": 1 }, ...] in order.
//   Each clip fills the time from its cue to the next clip's cue (the last one to the end of the voice + tail),
//   starting `ss` seconds into the clip file; if the clip is too short, its last frame is held (or set "speed" < 1).
// Adds voice.mp3 (+ quiet music.mp3 if present) and burns the one-word captions from script.txt + data.js
// (white, thick black outline, gold/red per script markup, centred at y≈1270 of 1920). Output: final.mp4 (or preview.mp4).
const { fs, path, ROOT, vdir, ffmpegPath, spawnSync, ffprobeDuration } = require('./lib');
const { ScriptParser } = require('../engine/script.js').parse ? { ScriptParser: require('../engine/script.js') } : require('../engine/script.js');

const slug = process.argv[2]; if (!slug) { console.error('usage: node tools/assemble.js <slug> [--preview]'); process.exit(1); }
const preview = process.argv.includes('--preview'), noVoice = process.argv.includes('--no-voice');
const dir = vdir(slug), ff = ffmpegPath(), TAIL = 2.0, W = 1080, H = 1920, FPS = 30;
global.window = {}; eval(fs.readFileSync(path.join(dir, 'data.js'), 'utf8')); const DATA = window.VIDEO_DATA;
const clips = JSON.parse(fs.readFileSync(path.join(dir, 'clips.json'), 'utf8'));

// ---- cue times + caption tokens (same rules as the plate kit) ----
const TOK = ScriptParser.parse(DATA.script), WORDS = DATA.words, CUES = {}, CAPS = [];
{ let wi = 0; const pend = [];
  for (const tk of TOK) { if (tk.cue) { pend.push(tk.cue); continue; }
    const w0 = WORDS[Math.min(wi, WORDS.length - 1)], w1 = WORDS[Math.min(wi + tk.n - 1, WORDS.length - 1)];
    pend.forEach(c => CUES[c] = w0.start); pend.length = 0; CAPS.push({ t: w0.start, end: w1.end, txt: tk.disp, cls: tk.cls }); wi += tk.n; }
  pend.forEach(c => CUES[c] = DATA.audioLength); }
const total = DATA.audioLength + TAIL;
const at = c => { if (!(c in CUES)) throw new Error('unknown cue ' + c); return CUES[c]; };

// ---- 1) cut each clip to its slot, scaled to 1080x1920 ----
const tmp = path.join(dir, '.assemble'); fs.rmSync(tmp, { recursive: true, force: true }); fs.mkdirSync(tmp, { recursive: true });
const parts = [];
clips.forEach((c, i) => {
  const t0 = i === 0 ? 0 : at(c.from), t1 = i + 1 < clips.length ? at(clips[i + 1].from) : total, dur = +(t1 - t0).toFixed(3);
  const src = path.join(dir, c.file), out = path.join(tmp, `p${String(i).padStart(2, '0')}.mp4`), sp = c.speed || 1;
  const vf = [`setpts=PTS/${sp}`, `scale=${W}:${H}:force_original_aspect_ratio=increase`, `crop=${W}:${H}`, `fps=${FPS}`, `tpad=stop_mode=clone:stop_duration=${dur + 1}`].join(',');
  // keep the clip's own audio (sound effects) if it has any, else silence, so every part has the same audio format
  const hasAudio = /Audio:/.test(spawnSync(ff, ['-hide_banner', '-i', src], { encoding: 'utf8' }).stderr || '');
  const af = `[${hasAudio ? 0 : 1}:a]aresample=44100,aformat=channel_layouts=stereo,apad,atrim=0:${dur}[a]`;
  const r = spawnSync(ff, ['-y', '-loglevel', 'error', '-ss', String(c.ss || 0), '-i', src, '-f', 'lavfi', '-i', 'anullsrc=r=44100:cl=stereo',
    '-filter_complex', `[0:v]${vf}[v];${af}`, '-map', '[v]', '-map', '[a]', '-t', String(dur),
    '-c:v', 'libx264', '-preset', preview ? 'ultrafast' : 'medium', '-crf', '18', '-pix_fmt', 'yuv420p', '-c:a', 'aac', '-b:a', '192k', out], { stdio: 'inherit' });
  if (r.status) process.exit(r.status);
  parts.push(out); console.log(`clip ${i + 1}/${clips.length} ${c.file}  ${t0.toFixed(2)}-${t1.toFixed(2)}s`);
});
fs.writeFileSync(path.join(tmp, 'list.txt'), parts.map(p => `file '${p}'`).join('\n'));

// ---- 2) captions as ASS (one word at a time) ----
const ts = s => { s = Math.max(0, s); const h = Math.floor(s / 3600), m = Math.floor(s / 60) % 60, x = (s % 60).toFixed(2).padStart(5, '0'); return `${h}:${String(m).padStart(2, '0')}:${x}`; };
const col = { gold: '&H003AD2FF', red: '&H003D4AFF' };   // ASS colours are &HAABBGGRR
let ass = `[Script Info]\nScriptType: v4.00+\nPlayResX: ${W}\nPlayResY: ${H}\nWrapStyle: 2\n\n[V4+ Styles]\n` +
  'Format: Name, Fontname, Fontsize, PrimaryColour, SecondaryColour, OutlineColour, BackColour, Bold, Italic, Underline, StrikeOut, ScaleX, ScaleY, Spacing, Angle, BorderStyle, Outline, Shadow, Alignment, MarginL, MarginR, MarginV, Encoding\n' +
  'Style: Cap,Inter,92,&H00FFFFFF,&H00FFFFFF,&H00000000,&H8C000000,-1,0,0,0,100,100,0,0,1,9,4,5,40,40,0,1\n\n[Events]\nFormat: Layer, Start, End, Style, Name, MarginL, MarginR, MarginV, Effect, Text\n';
CAPS.forEach((c, i) => { const end = Math.min(c.end + .45, CAPS[i + 1] ? CAPS[i + 1].t : c.end + .45); const pre = col[c.cls] ? `{\\c${col[c.cls]}}` : '';
  ass += `Dialogue: 0,${ts(c.t)},${ts(end)},Cap,,0,0,0,,{\\pos(${W / 2},1270)\\fscx85\\fscy85\\t(0,120,\\fscx100\\fscy100)}${pre}${c.txt.replace(/[{}]/g, '')}\n`; });
fs.writeFileSync(path.join(tmp, 'caps.ass'), ass);

// ---- 3) join + voice (+ music) + captions ----
const fontsdir = path.join(ROOT, 'node_modules', '@fontsource', 'inter', 'files');
const fontTmp = path.join(tmp, 'fonts'); fs.mkdirSync(fontTmp);   // libass needs a real font file (ttf/otf/woff2 not always): copy what's there
for (const f of fs.readdirSync(fontsdir)) if (/latin-900-normal\.woff2?$/.test(f)) fs.copyFileSync(path.join(fontsdir, f), path.join(fontTmp, f));
const music = path.join(dir, 'music.mp3'), hasMusic = fs.existsSync(music);
const out = path.join(dir, (preview ? 'preview' : 'final') + (noVoice ? '-novoice' : '') + '.mp4');
const args = ['-y', '-loglevel', 'error', '-f', 'concat', '-safe', '0', '-i', path.join(tmp, 'list.txt'), '-i', path.join(dir, 'voice.mp3')];
if (hasMusic) args.push('-stream_loop', '-1', '-i', music);
// clip sound effects ([0:a]) sit under the voice; with --no-voice they are the whole soundtrack
const afilter = noVoice ? `[0:a]apad[a]`
  : hasMusic ? `[1:a]apad[v];[2:a]volume=0.12[m];[0:a]volume=0.35[s];[v][m][s]amix=inputs=3:duration=first:normalize=0[a]`
  : `[1:a]apad[v];[0:a]volume=0.35[s];[v][s]amix=inputs=2:duration=first:normalize=0[a]`;
args.push('-filter_complex', `[0:v]subtitles=${path.join(tmp, 'caps.ass')}:fontsdir=${fontTmp}[vo];${afilter}`, '-map', '[vo]', '-map', '[a]',
  '-t', String(total), '-c:v', 'libx264', '-preset', preview ? 'veryfast' : 'medium', '-crf', '18', '-pix_fmt', 'yuv420p', '-c:a', 'aac', '-b:a', '192k', '-movflags', '+faststart', out);
const r = spawnSync(ff, args, { stdio: 'inherit' }); if (r.status) process.exit(r.status);
console.log('done ->', path.relative(ROOT, out), `(${total.toFixed(1)}s)`);
