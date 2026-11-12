// Speed up (or slow down) a voiceover without changing its pitch, then re-run exact alignment.
// Usage: node tools/voice.js <slug> 1.15     (keeps the untouched original as voice-original.mp3)
const { fs, path, vdir, ffmpegPath, spawnSync } = require('./lib');
const [slug, sp] = process.argv.slice(2); const speed = parseFloat(sp || '1.15');
if (!slug || !(speed > 0.5 && speed < 2)) { console.error('usage: node tools/voice.js <slug> <speed 0.5-2, e.g. 1.15>'); process.exit(1); }
const dir = vdir(slug), voice = path.join(dir, 'voice.mp3'), orig = path.join(dir, 'voice-original.mp3');
if (!fs.existsSync(orig)) { if (!fs.existsSync(voice)) { console.error('missing ' + voice); process.exit(1); } fs.copyFileSync(voice, orig); }
const r = spawnSync(ffmpegPath(), ['-y', '-loglevel', 'error', '-i', orig, '-af', `atempo=${speed}`, '-c:a', 'libmp3lame', '-q:a', '2', voice], { stdio: 'inherit' });
if (r.status) process.exit(r.status);
console.log(`voice.mp3 = voice-original.mp3 at ${speed}x`);
spawnSync('node', [path.join(__dirname, 'align.js'), slug], { stdio: 'inherit' });
