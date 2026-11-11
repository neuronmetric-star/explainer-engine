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
  const sysChrome = ['/usr/bin/google-chrome', '/usr/bin/chromium', '/usr/bin/chromium-browser', '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'].find(p => fs.existsSync(p));
  if (process.env.CHROME_PATH) launch.executablePath = process.env.CHROME_PATH;
  else if (sysChrome) launch.executablePath = sysChrome;   // use installed Chrome if there is one
  const browser = await chromium.launch(launch);
  const page = await browser.newPage({ viewport: { width: 1080, height: 1920 }, deviceScaleFactor: 1 });
  const errors = []; page.on('pageerror', e => errors.push(String(e))); page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
  await page.goto('file://' + path.join(ROOT, 'engine', 'stage.html') + '?v=' + encodeURIComponent(slug));
  await page.waitForFunction('window.ready===true || window.loadError', null, { timeout: 60000 });
  const le = await page.evaluate('window.loadError'); if (le) throw new Error(le + '\n' + errors.join('\n'));
  await page.evaluate('document.fonts.ready.then(()=>1)');
  const L = await page.evaluate('window.VIDEO_LENGTH');
  const ff = ffmpegPath();

  if (preview) {
    const times = pList || Array.from({ length: 12 }, (_, i) => +(0.8 + i * (L - 1.6) / 11).toFixed(2));
    const tmp = path.join(dir, '.preview'); fs.mkdirSync(tmp, { recursive: true });
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
    const music = path.join(dir, 'music.mp3'); // optional quiet music bed
    let mux;
    if (fs.existsSync(voice) && fs.existsSync(music))
      mux = ['-y', '-loglevel', 'error', '-i', silent, '-i', voice, '-stream_loop', '-1', '-i', music,
        '-filter_complex', '[1:a]apad[v];[2:a]volume=0.12[m];[v][m]amix=inputs=2:duration=first:normalize=0[a]',
        '-map', '0:v', '-map', '[a]', '-c:v', 'copy', '-c:a', 'aac', '-b:a', '192k', '-t', L.toFixed(3)];
    else if (fs.existsSync(voice))
      mux = ['-y', '-loglevel', 'error', '-i', silent, '-i', voice, '-map', '0:v', '-map', '1:a', '-c:v', 'copy', '-c:a', 'aac', '-b:a', '192k', '-af', 'apad', '-t', L.toFixed(3)];
    else mux = ['-y', '-loglevel', 'error', '-i', silent, '-c', 'copy'];
    mux.push('-movflags', '+faststart', out);
    spawnSync(ff, mux, { stdio: 'inherit' }); fs.rmSync(silent, { force: true });
    console.log('done ->', path.relative(ROOT, out), `(${L.toFixed(1)}s, ${((Date.now() - t0) / 60000).toFixed(1)} min)`);
  }
  if (errors.length) console.warn('page errors:\n' + errors.slice(0, 5).join('\n'));
  await browser.close();
})().catch(e => { console.error(e.message || e); process.exit(1); });
