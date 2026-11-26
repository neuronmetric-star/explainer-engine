// Tighten Brian's raw voice into voice.mp3: trim silences, then speed it up so the final lands in the target length.
// Brian, Nov 26 2026: "longer texts are okay, we can just speed it 1.2 or 1.4x". So the script length is no longer capped at 175-190 words;
// the tempo is chosen per video: tempo = (silence-trimmed length) / target, clamped to 1.2-1.4 (never above 1.4: it stops sounding natural).
// Usage: node tools/tighten.js <slug> [targetVoiceSeconds=68] [--dry]     (then: node tools/align.js <slug>, voice_drama, align again)
// Target 68 s voice = ~1:12 final after the drama pass (+~3 s) and the 1 s tail. Keeps the original as voice_raw.mp3.
const { fs, path, vdir, ffmpegPath, spawnSync, ffprobeDuration } = require('./lib');
const slug = process.argv[2], target = parseFloat(process.argv[3]) || 68, dry = process.argv.includes('--dry');
if (!slug) { console.error('usage: node tools/tighten.js <slug> [targetVoiceSeconds=68] [--dry]'); process.exit(1); }
const dir = vdir(slug), raw = path.join(dir, 'voice_raw.mp3'), out = path.join(dir, 'voice.mp3'), ff = ffmpegPath();
if (!fs.existsSync(raw)) { console.error('missing ' + raw); process.exit(1); }
const SR = 'silenceremove=start_periods=1:start_threshold=-40dB:stop_periods=-1:stop_duration=0.25:stop_threshold=-40dB:stop_silence=0.16';
const tmp = path.join(dir, '.tighten_probe.mp3');
spawnSync(ff, ['-y', '-loglevel', 'error', '-i', raw, '-af', SR, '-q:a', '2', tmp]);
const base = ffprobeDuration(tmp); fs.rmSync(tmp, { force: true });
const raw_t = target * 1, tempo = Math.min(1.4, Math.max(1.2, +(base / raw_t).toFixed(3)));
const final = base / tempo, total = final + 3 + 1;   // + drama pass + tail
console.log(`raw ${ffprobeDuration(raw).toFixed(1)} s, silence-trimmed ${base.toFixed(1)} s -> tempo ${tempo}x -> voice ${final.toFixed(1)} s, final ~${Math.floor(total / 60)}:${String(Math.round(total % 60)).padStart(2, '0')}`);
if (total > 75.5) console.log('WARNING: still over 1:15 even at 1.4x: cut words (cut a joke or side rung, never a "because").');
if (tempo >= 1.4) console.log('NOTE: at 1.4x the voice is fast; fine per Brian, but check it by ear.');
if (!dry) { spawnSync(ff, ['-y', '-loglevel', 'error', '-i', raw, '-af', `${SR},atempo=${tempo}`, '-q:a', '2', out]); console.log('wrote ' + path.relative(process.cwd(), out)); }
