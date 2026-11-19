// Render a pet character sheet: node engine/lab/render-sheet.js dog|cat [out.jpg]
const path = require('path'), fs = require('fs');
const { chromium } = require('playwright');
const kind = process.argv[2] || 'dog', out = path.resolve(process.argv[3] || path.join(__dirname, 'out', `sheet_${kind}.jpg`));
fs.mkdirSync(path.dirname(out), { recursive: true });
(async () => {
  const exe = ['/opt/pw-browsers/chromium', '/usr/bin/google-chrome', '/usr/bin/chromium'].find(p => fs.existsSync(p) && fs.statSync(p).isFile());
  const browser = await chromium.launch({ executablePath: exe, args: ['--use-gl=swiftshader', '--enable-webgl', '--ignore-gpu-blocklist', '--allow-file-access-from-files'] });
  const page = await browser.newPage({ viewport: { width: 1620, height: 2340 }, deviceScaleFactor: 1 });
  const errs = []; page.on('pageerror', e => errs.push(String(e))); page.on('console', m => m.type() === 'error' && errs.push(m.text()));
  await page.goto('file://' + path.join(__dirname, 'pet-sheet.html') + '?pet=' + kind);
  await page.waitForFunction('window.ready===true', null, { timeout: 300000 }).catch(() => { throw new Error(errs.join('\n') || 'timeout'); });
  await page.screenshot({ path: out, type: 'jpeg', quality: 92, timeout: 300000 });
  if (errs.length) console.log('page errors:\n' + errs.join('\n'));
  await browser.close(); console.log('sheet ->', out);
})();
