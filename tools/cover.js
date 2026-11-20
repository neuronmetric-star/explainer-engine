// Make a posting cover: a real frame from the video (cast included, no captions / follow button) + headline.
// Usage: node tools/cover.js <slug> <seconds> "LINE 1|LINE 2|LINE 3"   ->  videos/<slug>/cover.jpg
// Pick a moment where the character is on screen with a clear, expressive face (PLAYBOOK: covers always show the cast).
const { fs, path, ROOT, vdir, spawnSync } = require('./lib');
const { chromium } = require('playwright');
const [slug, sec, text] = process.argv.slice(2);
if (!slug || !sec || !text) { console.error('usage: node tools/cover.js <slug> <seconds> "LINE 1|LINE 2|LINE 3"'); process.exit(1); }
const dir = vdir(slug), FPS = 30;
(async () => {
  const launch = { args: ['--use-gl=swiftshader', '--enable-webgl', '--ignore-gpu-blocklist', '--allow-file-access-from-files'] };
  const sysChrome = ['/usr/bin/google-chrome', '/usr/bin/chromium', '/opt/pw-browsers/chromium'].find(p => fs.existsSync(p));
  if (process.env.CHROME_PATH) launch.executablePath = process.env.CHROME_PATH; else if (sysChrome) launch.executablePath = sysChrome;
  const browser = await chromium.launch(launch);
  const page = await browser.newPage({ viewport: { width: 1080, height: 1920 }, deviceScaleFactor: 1 });
  await page.goto('file://' + path.join(ROOT, 'engine', 'plate-stage.html') + '?v=' + encodeURIComponent(slug));
  await page.waitForFunction('window.ready===true || window.loadError', null, { timeout: 60000 });
  const le = await page.evaluate('window.loadError'); if (le) throw new Error(le);
  await page.evaluate(`window.step(${Math.max(1, Math.round(+sec * FPS))},${1 / FPS})`);
  await page.addStyleTag({ content: '#cap,#follow,#cursor,#flash{display:none!important}' });
  const frame = path.join(dir, '.cover_frame.png');
  await page.screenshot({ path: frame, type: 'png' });
  await browser.close();
  const r = spawnSync('python3', [path.join(ROOT, 'tools', 'cover_text.py'), frame, path.join(dir, 'cover.jpg'), text], { stdio: 'inherit' });
  fs.rmSync(frame, { force: true });
  if (r.status) process.exit(r.status);
  console.log('cover ->', path.relative(ROOT, path.join(dir, 'cover.jpg')));
})();
