// Sound effects for discipline-curse (synthesized by tools/sfx.py). Build: node tools/sfx.js discipline-curse
// Footsteps follow Gary's run cycle in scene.js (walk = 2.1 cycles/s → a step every 1/4.2 s).
module.exports = ({ T, word }) => {
  const ev = [];
  const steps = (from, to, rate, g) => { for (let t = T(from) + .1; t < T(to); t += 1 / rate) ev.push({ at: t, sfx: 'shoe', gain: g }); };
  // whoosh on every change of place (hard cuts)
  for (const c of ['did', 'same', 'run', 'oat', 'work', 'bed', 'doug', 'aside', 'tuesday', 'link1', 'fake', 'mirror', 'starting',
    'yearlater', 'promo', 'sees', 'missed', 'doug2', 'moral', 'moral2', 'ask'])
    ev.push({ at: T(c) - .1, sfx: 'whoosh', gain: .2 });
  ev.push({ at: 'q+0.4', sfx: 'alarm', gain: .25 });                 // the bedroom, alarm in the background
  ev.push({ at: 'alarm', sfx: 'alarm', gain: .7 });                  // "Alarm at six."
  steps('did', 'same', 4.2, .35); steps('run', 'oat', 4.2, .4);      // Gary running
  steps('doug', 'pizza', 4.2, .3);
  steps('gary2', 'promo', 6.3, .45);                                 // a year later: faster
  ev.push({ at: 'oat+0.1', sfx: 'tap', gain: .5 });                  // spoon on the bowl
  ev.push({ at: 'last+0.8', sfx: 'tear', gain: .9 }, { at: 'last+0.9', sfx: 'pop', gain: .35 }); // MONDAY tears off, a new one drops
  ev.push({ at: 'newyear', sfx: 'pop', gain: .6 });                  // JAN 1
  ev.push({ at: 'promo+0.2', sfx: 'pop', gain: .4 });                // nameplate
  ev.push({ at: 'ring', sfx: 'sparkle', gain: .8 });                 // ring box
  ev.push({ at: 'missed+0.3', sfx: 'alarm', gain: .4 });             // the dark morning he wanted to stay in bed
  ev.push({ at: 'cta+0.3', sfx: 'pop', gain: .5 }, { at: 'cta+1.8', sfx: 'click', gain: .9 });
  return ev;
};
