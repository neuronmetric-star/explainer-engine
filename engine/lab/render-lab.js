// Render the character-lab shots to stills + a contact sheet.
// Usage: node engine/lab/render-lab.js [outDir] [--page plate-lab.html] [--clip]
const path = require('path'), fs = require('fs');
const { spawnSync } = require('child_process');
const { chromium } = require('playwright');
const out = path.resolve(process.argv.slice(2).find((a, i, arr) => !a.startsWith('--') && arr[i - 1] !== '--page') || path.join(__dirname, 'out')); fs.mkdirSync(out, { recursive: true });
(async () => {
  const exe = ['/opt/pw-browsers/chromium', '/usr/bin/google-chrome', '/usr/bin/chromium'].find(p => fs.existsSync(p) && fs.statSync(p).isFile());
  const browser = await chromium.launch({ executablePath: exe, args: ['--use-gl=swiftshader', '--enable-webgl', '--ignore-gpu-blocklist', '--allow-file-access-from-files'] });
  const page = await browser.newPage({ viewport: { width: 1080, height: 1920 }, deviceScaleFactor: 1 });
  const errs = []; page.on('pageerror', e => errs.push(String(e))); page.on('console', m => m.type() === 'error' && errs.push(m.text()));
  const pi = process.argv.indexOf('--page'), pageFile = pi > -1 ? process.argv[pi + 1] : 'char-lab.html';
  await page.goto('file://' + path.join(__dirname, pageFile));
  await page.waitForFunction('window.ready===true', null, { timeout: 120000 }).catch(() => { throw new Error(errs.join('\n')); });
  await page.evaluate('document.fonts.ready.then(()=>1)');
  if (process.argv.includes('--clip')) {   // 30 fps motion test -> clip.mp4
    const L = await page.evaluate('window.CLIP_LEN'), FPS = 30, N = Math.round(L * FPS);
    const ffc = (() => { try { return require('ffmpeg-static'); } catch (e) { return 'ffmpeg'; } })();
    const enc = require('child_process').spawn(ffc, ['-y', '-loglevel', 'error', '-f', 'image2pipe', '-framerate', '30', '-c:v', 'mjpeg', '-i', '-', '-c:v', 'libx264', '-crf', '18', '-pix_fmt', 'yuv420p', '-movflags', '+faststart', path.join(out, 'clip.mp4')], { stdio: ['pipe', 'inherit', 'inherit'] });
    for (let i = 0; i < N; i++) { await page.evaluate(`window.renderAt(${i / FPS})`); const b = await page.screenshot({ type: 'jpeg', quality: 90 }); if (!enc.stdin.write(b)) await new Promise(r => enc.stdin.once('drain', r)); }
    enc.stdin.end(); await new Promise(r => enc.on('close', r)); await browser.close(); console.log('clip ->', path.join(out, 'clip.mp4'), N, 'frames'); if (errs.length) console.log(errs.join('\n')); return;
  }
  const n = await page.evaluate('window.SHOT_COUNT'), files = [];
  for (let i = 0; i < n; i++) {
    await page.evaluate(`window.renderShot(${i})`);
    const f = path.join(out, `shot${i}.jpg`); await page.screenshot({ path: f, type: 'jpeg', quality: 90, timeout: 300000 }); files.push(f); console.log('rendered', f);
  }
  if (errs.length) console.log('page errors:\n' + errs.join('\n'));
  await browser.close();
  const ff = (() => { try { return require('ffmpeg-static'); } catch (e) { return 'ffmpeg'; } })();
  spawnSync(ff, ['-y', '-loglevel', 'error', ...files.flatMap(f => ['-i', f]), '-filter_complex',
    files.map((_, i) => `[${i}]scale=540:960[s${i}]`).join(';') + ';' + files.map((_, i) => `[s${i}]`).join('') + `hstack=${files.length}`, path.join(out, 'sheet.jpg')], { stdio: 'inherit' });
  console.log('sheet ->', path.join(out, 'sheet.jpg'));
})();
