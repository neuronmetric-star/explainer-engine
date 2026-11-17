// Renders clean stills (no captions/cards/UI) for thumbnails: node videos/stock-up-3d/clean_frames.js 3.3 8.3
const path = require('path'), fs = require('fs'); const { chromium } = require('playwright');
const ROOT = path.join(__dirname, '..', '..'), times = process.argv.slice(2).map(Number);
(async () => {
  const b = await chromium.launch({ args: ['--use-gl=swiftshader', '--enable-webgl', '--ignore-gpu-blocklist'] });
  const p = await b.newPage({ viewport: { width: 1080, height: 1920 } });
  await p.goto('file://' + path.join(ROOT, 'engine', 'stage.html') + '?v=stock-up-3d');
  await p.waitForFunction('window.ready===true'); await p.evaluate('document.fonts.ready.then(()=>1)');
  await p.addStyleTag({ content: '#cap,#cards,#steps,#receipt,#follow,#ftitle,#cursor{display:none!important}' });
  let prev = 0; fs.mkdirSync(path.join(__dirname, 'covers'), { recursive: true });
  for (const t of times) { await p.evaluate(`window.step(${Math.round((t - prev) * 30)},${1 / 30})`); prev = t;
    await p.screenshot({ path: path.join(__dirname, 'covers', `clean_${t}.png`) }); console.log('clean', t); }
  await b.close();
})();
