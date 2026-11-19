// Render a video to MP4 (or quick preview stills).
// Usage:
//   node tools/render.js <slug> --preview          -> videos/<slug>/preview.jpg  (12 stills, ~1 min)
//   node tools/render.js <slug> --preview 3,10,25   -> stills at those seconds
//   node tools/render.js <slug>                     -> videos/<slug>/final.mp4 (with voice.mp3 mixed in)
// Options: --fps 30   --gpu (use real GPU instead of software rendering; much faster on a desktop)
// Env:     CHROME_PATH=/path/to/chrome  (optional; otherwise Playwright's Chromium)
const { fs, path, ROOT, vdir, ffmpegPath, spawnSync } = require('./lib');
const { spawn } = require('child_process');
const { chromium } = require('playwright');

const args = process.argv.slice(2);
const slug = args[0]; if (!slug) { console.error('usage: node tools/render.js <slug> [--preview [t1,t2,...]] [--fps 30] [--gpu]'); process.exit(1); }
const flag = n => args.indexOf(n);
const FPS = flag('--fps') > -1 ? +args[flag('--fps') + 1] : 30;
const preview = flag('--preview') > -1;
const pList = preview && args[flag('--preview') + 1] && /^[\d.,]+$/.test(args[flag('--preview') + 1]) ? args[flag('--preview') + 1].split(',').map(Number) : null;
const dir = vdir(slug);
if (!fs.existsSync(path.join(dir, 'data.js'))) { console.error('missing data.js — run tools/tts.js or tools/align.js first'); process.exit(1); }

(async () => {
  const launch = { args: flag('--gpu') > -1 ? ['--ignore-gpu-blocklist', '--enable-gpu-rasterization'] : ['--use-gl=swiftshader', '--enable-webgl', '--ignore-gpu-blocklist'] };
  launch.args.push('--allow-file-access-from-files');   // plates/props load from disk
  const sysChrome = ['/usr/bin/google-chrome', '/usr/bin/chromium', '/usr/bin/chromium-browser', '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', '/opt/pw-browsers/chromium'].find(p => fs.existsSync(p));
  if (process.env.CHROME_PATH) launch.executablePath = process.env.CHROME_PATH;
  else if (sysChrome) launch.executablePath = sysChrome;   // use installed Chrome if there is one
  const browser = await chromium.launch(launch);
  const page = await browser.newPage({ viewport: { width: 1080, height: 1920 }, deviceScaleFactor: 1 });
  const errors = []; page.on('pageerror', e => errors.push(String(e))); page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
  const stage = fs.existsSync(path.join(dir, 'art')) ? 'plate-stage.html' : 'stage.html';   // new format = has art/
  await page.goto('file://' + path.join(ROOT, 'engine', stage) + '?v=' + encodeURIComponent(slug));
  await page.waitForFunction('window.ready===true || window.loadError', null, { timeout: 60000 });
  const le = await page.evaluate('window.loadError'); if (le) throw new Error(le + '\n' + errors.join('\n'));
  await page.evaluate('document.fonts.ready.then(()=>1)');
  const L = await page.evaluate('window.VIDEO_LENGTH');
  const ff = ffmpegPath();

  if (preview) {
    const times = pList || Array.from({ length: 12 }, (_, i) => +(0.8 + i * (L - 1.6) / 11).toFixed(2));
    const tmp = path.join(dir, '.preview'); fs.rmSync(tmp, { recursive: true, force: true }); fs.mkdirSync(tmp, { recursive: true });
    let prev = 0;
    for (let i = 0; i < times.length; i++) {
      await page.evaluate(`window.step(${Math.max(1, Math.round((times[i] - prev) * FPS))},${1 / FPS})`); prev = times[i];
      await page.screenshot({ path: path.join(tmp, `p${String(i).padStart(2, '0')}.jpg`), type: 'jpeg', quality: 75, timeout: 180000 });
    }
    const cols = Math.min(6, times.length), rows = Math.ceil(times.length / cols);
    spawnSync(ff, ['-y', '-loglevel', 'error', '-i', path.join(tmp, 'p%02d.jpg'), '-vf', `scale=270:480,tile=${cols}x${rows}`, '-frames:v', '1', path.join(dir, 'preview.jpg')]);
    console.log('preview at', times.join(', '), 's ->', path.relative(ROOT, path.join(dir, 'preview.jpg')));
  } else {
    const n = Math.round(L * FPS), silent = path.join(dir, '.silent.mp4');
    const enc = spawn(ff, ['-y', '-loglevel', 'error', '-f', 'image2pipe', '-framerate', String(FPS), '-c:v', 'mjpeg', '-i', '-',
      '-c:v', 'libx264', '-preset', 'veryfast', '-crf', '18', '-pix_fmt', 'yuv420p', '-movflags', '+faststart', silent], { stdio: ['pipe', 'inherit', 'inherit'] });
    const t0 = Date.now();
    for (let i = 0; i < n; i++) {
      await page.evaluate(`window.step(1,${1 / FPS})`);
      const buf = await page.screenshot({ type: 'jpeg', quality: 92, timeout: 180000 });
      if (!enc.stdin.write(buf)) await new Promise(r => enc.stdin.once('drain', r));
      if (i % 150 === 0) { const el = (Date.now() - t0) / 1000; console.log(`frame ${i}/${n}  ${el.toFixed(0)}s elapsed, ~${((n - i) * el / Math.max(1, i) / 60).toFixed(1)} min left`); }
    }
    enc.stdin.end(); await new Promise(r => enc.on('close', r));
    const out = path.join(dir, 'final.mp4'), voice = path.join(dir, 'voice.mp3');
    const music = path.join(dir, 'music.mp3'); // optional quiet music bed: always under the voice and ducked while he speaks (mix rule)
    // MIX RULE: the voice always wins. Voice -16 LUFS; sound effects (sfx.wav, made by tools/sfx.py) and music sit under it
    // and are sidechain-ducked while he speaks. SFX_LEVEL / music level as in tools/assemble.js.
    const sfx = path.join(dir, 'sfx.wav'), beds = [];
    if (fs.existsSync(sfx)) beds.push({ file: sfx, vol: 0.5, loop: false });
    if (fs.existsSync(music)) beds.push({ file: music, vol: 0.08, loop: true });
    let mux;
    if (fs.existsSync(voice)) {
      const ins = ['-i', silent, '-i', voice]; beds.forEach(b => { if (b.loop) ins.push('-stream_loop', '-1'); ins.push('-i', b.file); });
      const duck = 'sidechaincompress=threshold=0.015:ratio=12:attack=15:release=350';
      let f = `[1:a]loudnorm=I=-16:TP=-1.5:LRA=11,aresample=44100,apad,asplit=${beds.length + 1}[v]` + beds.map((_, i) => `[k${i}]`).join('') + ';';
      beds.forEach((b, i) => { f += `[${i + 2}:a]aresample=44100,volume=${b.vol},apad[b${i}];[b${i}][k${i}]${duck}[d${i}];`; });
      f += `[v]${beds.map((_, i) => `[d${i}]`).join('')}amix=inputs=${beds.length + 1}:duration=first:normalize=0,alimiter=limit=0.95[a]`;
      mux = ['-y', '-loglevel', 'error', ...ins, '-filter_complex', f, '-map', '0:v', '-map', '[a]', '-c:v', 'copy', '-c:a', 'aac', '-b:a', '192k', '-t', L.toFixed(3)];
    } else mux = ['-y', '-loglevel', 'error', '-i', silent, '-c', 'copy'];
    mux.push('-movflags', '+faststart', out);
    spawnSync(ff, mux, { stdio: 'inherit' }); fs.rmSync(silent, { force: true });
    console.log('done ->', path.relative(ROOT, out), `(${L.toFixed(1)}s, ${((Date.now() - t0) / 60000).toFixed(1)} min)`);
  }
  if (errors.length) console.warn('page errors:\n' + errors.slice(0, 5).join('\n'));
  await browser.close();
})().catch(e => { console.error(e.message || e); process.exit(1); });
