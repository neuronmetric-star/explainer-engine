// Sound effects for huss-neighbor (synthesized by tools/sfx.py). Build: node tools/sfx.js huss-neighbor
module.exports = ({ T, word }) => {
  const ev = [];
  const steps = (from, dur, rate, g) => { for (let t = T(from) + .15; t < T(from) + dur; t += 1 / rate) ev.push({ at: t, sfx: 'step', gain: g }); };
  const words = require('fs').readFileSync(require('path').join(__dirname, 'data.js'), 'utf8');
  const W = JSON.parse(words.replace(/^window\.VIDEO_DATA = /, '').replace(/;\s*$/, '')).words;
  for (const w of W) if (w.w.toLowerCase().replace(/[^a-z]/g, '') === 'huss') ev.push({ at: w.start, sfx: 'clunk', gain: .28 });   // wall thump on every huss
  for (const c of ['doug', 'morning', 'shower', 'sleep', 'march', 'door', 'home', 'over']) ev.push({ at: T(c) - .12, sfx: 'whoosh', gain: .2 });
  ev.push({ at: 'q', sfx: 'pop', gain: .5 });
  steps('march', 2.2, 2.8, .4);
  for (const d of [0, .22, .44]) ev.push({ at: T('door') - .9 + d, sfx: 'tap', gain: .6 });   // knock knock knock
  ev.push({ at: 'door+0.2', sfx: 'click', gain: .5 });
  ev.push({ at: 'heard', sfx: 'pop', gain: .35 }, { at: 'course', sfx: 'pop', gain: .45 });
  steps('home', 1.6, 2.6, .35);
  ev.push({ at: 'popup', sfx: 'beep', gain: .45 }, { at: 'one', sfx: 'tap', gain: .4 }, { at: 'another', sfx: 'tap', gain: .4 });
  steps('over', 1.8, 2.8, .4);
  ev.push({ at: 'mirror', sfx: 'helicopter', gain: .6 });
  ev.push({ at: 'ask+0.1', sfx: 'pop', gain: .5 });
  ev.push({ at: 'cta+0.3', sfx: 'pop', gain: .5 }, { at: 'cta+1.8', sfx: 'click', gain: .9 });
  return ev;
};
