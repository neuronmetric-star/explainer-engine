// Prepare OpenArt clips (moving paintings, PLAYBOOK §4.1) for the plate engine.
// Usage: node tools/clips.js <slug>
// Input:  videos/<slug>/clips/<plate-image-name>.mp4   e.g. clips/03_trench_day.mp4 animates art/03_trench_day.png
// Output: clips/<name>/f0001.jpg…  30 fps frames at the painting's exact size (feet + K.img coords stay valid)
//         clips/<name>.wav         the clip's own sound (Wan 3.0 makes ambience); render.js lays it under each shot
//         clips/clips.js           window.CLIPS = { name: { n, fps, audio } }  (loaded by plate-stage.html)
// In scene.js give the plate clip:'<name>'. Frames are rebuilt here, so only the mp4s are committed.
const { fs, path, vdir, ffmpegPath, spawnSync } = require('./lib');
const slug = process.argv[2]; if (!slug) { console.error('usage: node tools/clips.js <slug>'); process.exit(1); }
const dir = path.join(vdir(slug), 'clips'), art = path.join(vdir(slug), 'art'), FPS = 30, out = {};
for (const f of fs.readdirSync(dir).filter(f => f.endsWith('.mp4')).sort()) {
  const name = f.replace(/\.mp4$/, ''), png = path.join(art, name + '.png');
  if (!fs.existsSync(png)) { console.warn('skip', f, '(no art/' + name + '.png)'); continue; }
  const dim = spawnSync('python3', ['-c', `from PIL import Image;print(*Image.open(${JSON.stringify(png)}).size)`], { encoding: 'utf8' }).stdout.trim().split(' ').map(Number);
  const fd = path.join(dir, name); fs.rmSync(fd, { recursive: true, force: true }); fs.mkdirSync(fd);
  spawnSync(ffmpegPath(), ['-y', '-loglevel', 'error', '-i', path.join(dir, f), '-vf', `fps=${FPS},scale=${dim[0]}:${dim[1]}:flags=lanczos`, '-q:v', '3', path.join(fd, 'f%04d.jpg')], { stdio: 'inherit' });
  const wav = path.join(dir, name + '.wav');
  const a = spawnSync(ffmpegPath(), ['-y', '-loglevel', 'error', '-i', path.join(dir, f), '-vn', '-ac', '1', '-ar', '44100', wav]);
  const n = fs.readdirSync(fd).filter(x => x.endsWith('.jpg')).length;
  out[name] = { n, fps: FPS, audio: a.status === 0 && fs.existsSync(wav) };
  console.log(name, n, 'frames', dim.join('x'), out[name].audio ? '+ audio' : '(no audio)');
}
fs.writeFileSync(path.join(dir, 'clips.js'), 'window.CLIPS = ' + JSON.stringify(out) + ';\n');
