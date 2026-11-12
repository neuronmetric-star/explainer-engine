// Prepare the voiceover: speed it up without changing pitch and/or add a silent cold-open before the first word, then re-align.
// Usage: node tools/voice.js <slug> [speed=1.15] [--pad 1.2]   (keeps the untouched original as voice-original.mp3)
const { fs, path, vdir, ffmpegPath, spawnSync } = require('./lib');
const a = process.argv.slice(2), slug = a[0];
const pi = a.indexOf('--pad'), pad = pi > -1 ? parseFloat(a[pi + 1]) : 0;
const speed = parseFloat(a.find((x, i) => i > 0 && !x.startsWith('--') && a[i - 1] !== '--pad') || '1.15');
if (!slug || !(speed > 0.5 && speed < 2) || !(pad >= 0 && pad < 10)) { console.error('usage: node tools/voice.js <slug> [speed 0.5-2] [--pad seconds]'); process.exit(1); }
const dir = vdir(slug), voice = path.join(dir, 'voice.mp3'), orig = path.join(dir, 'voice-original.mp3');
if (!fs.existsSync(orig)) { if (!fs.existsSync(voice)) { console.error('missing ' + voice); process.exit(1); } fs.copyFileSync(voice, orig); }
const ms = Math.round(pad * 1000), af = `atempo=${speed}` + (ms ? `,adelay=${ms}|${ms}` : '');
const r = spawnSync(ffmpegPath(), ['-y', '-loglevel', 'error', '-i', orig, '-af', af, '-c:a', 'libmp3lame', '-q:a', '2', voice], { stdio: 'inherit' });
if (r.status) process.exit(r.status);
console.log(`voice.mp3 = voice-original.mp3 at ${speed}x` + (pad ? ` with ${pad}s cold open` : ''));
spawnSync('node', [path.join(__dirname, 'align.js'), slug], { stdio: 'inherit' });
