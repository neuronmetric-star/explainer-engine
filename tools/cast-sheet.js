// Render one model sheet per cast member (turnaround, gestures, faces).
// Usage: node tools/cast-sheet.js [outDir] [doug,gary,...]   (default docs/cast/, all cast)
const path = require('path'), fs = require('fs');
const { chromium } = require('playwright');
const out = path.resolve(process.argv[2] || path.join(__dirname, '..', 'docs', 'cast')); fs.mkdirSync(out, { recursive: true });
(async () => {
  const exe = ['/opt/pw-browsers/chromium', '/usr/bin/google-chrome', '/usr/bin/chromium'].find(p => fs.existsSync(p) && fs.statSync(p).isFile());
  const browser = await chromium.launch({ executablePath: exe, args: ['--use-gl=swiftshader', '--enable-webgl', '--ignore-gpu-blocklist', '--allow-file-access-from-files'] });
  const page = await browser.newPage({ viewport: { width: 2400, height: 2160 }, deviceScaleFactor: 1 });
  const errs = []; page.on('pageerror', e => errs.push(String(e))); page.on('console', m => m.type() === 'error' && errs.push(m.text()));
  await page.goto('file://' + path.join(__dirname, '..', 'engine', 'lab', 'cast-sheet.html'));
  await page.waitForFunction('window.ready===true', null, { timeout: 120000 }).catch(() => { throw new Error(errs.join('\n')); });
  await page.evaluate('document.fonts.ready.then(()=>1)');
  const ids = process.argv[3] ? process.argv[3].split(',') : await page.evaluate('window.SHEETS');
  for (const id of ids) {
    await page.evaluate(`window.renderSheet(${JSON.stringify(id)})`);
    const f = path.join(out, `${id}.png`); await page.screenshot({ path: f, timeout: 300000 }); console.log('sheet ->', f);
  }
  if (errs.length) console.log('page errors:\n' + errs.join('\n'));
  await browser.close();
})();
