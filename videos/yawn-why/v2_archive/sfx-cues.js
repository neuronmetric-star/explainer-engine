// Sound effects for yawn-why (synthesized by tools/sfx.py). Build: node tools/sfx.js yawn-why
module.exports = ({ T, word }) => {
  const ev = [];
  const steps = (from, dur, rate, g) => { for (let t = T(from) + .15; t < T(from) + dur; t += 1 / rate) ev.push({ at: t, sfx: 'step', gain: g }); };
  for (const c of ['notair', 'card', 'bet', 'o2', 'laps', 'rehook', 'cool', 'people', 'rats', 'perfect3', 'catch', 'flip', 'diy']) ev.push({ at: T(c) - .05, sfx: 'whoosh', gain: .3 });
  // THE HOOK: a hit, a whoosh on the crash-zoom, a sting as the flash lands
  ev.push({ at: 0, sfx: 'clunk', gain: .6 }, { at: 0.25, sfx: 'whoosh', gain: .5 }, { at: 0.3, sfx: 'click', gain: .8 }, { at: 0.32, sfx: 'pop', gain: .6 });
  ev.push({ at: 'notair', sfx: 'clunk', gain: .4 }, { at: 'nottired', sfx: 'tap', gain: .4 });
  ev.push({ at: 'joke', sfx: 'pop', gain: .5 }, { at: 'gary', sfx: 'hum', gain: .25 });
  ev.push({ at: 'o2', sfx: 'pop', gain: .45 }, { at: 'perfect', sfx: 'pop', gain: .4 }, { at: 'except', sfx: 'clunk', gain: .4 }, { at: 'tested', sfx: 'click', gain: .7 });
  steps('laps', 2.6, 3.4, .3); ev.push({ at: 'except2', sfx: 'clunk', gain: .4 }, { at: 'same', sfx: 'tap', gain: .4 });
  ev.push({ at: 'rehook', sfx: 'pop', gain: .5 }, { at: 'warm', sfx: 'hum', gain: .3 }, { at: 'laptop', sfx: 'pop', gain: .45 }, { at: 'pull', sfx: 'whoosh', gain: .4 }, { at: 'pull+0.1', sfx: 'hum', gain: .3 });
  ev.push({ at: 'people', sfx: 'tap', gain: .4 }, { at: 'people+0.8', sfx: 'tap', gain: .3 }, { at: 'people+1.6', sfx: 'tap', gain: .3 }, { at: 'hot', sfx: 'clunk', gain: .35 }, { at: 'hot+1.5', sfx: 'tap', gain: .4 });
  ev.push({ at: 'rats', sfx: 'pop', gain: .45 }, { at: 'rats+1.7', sfx: 'click', gain: .5 }, { at: 'drop', sfx: 'whoosh', gain: .3 });
  ev.push({ at: 'perfect3', sfx: 'pop', gain: .4 }, { at: 'except3', sfx: 'clunk', gain: .4 }, { at: 'catch', sfx: 'tap', gain: .5 }, { at: 'doug2', sfx: 'pop', gain: .45 }, { at: 'why', sfx: 'clunk', gain: .5 });
  ev.push({ at: 'flip', sfx: 'pop', gain: .4 }, { at: 'mirror', sfx: 'hum', gain: .3 }, { at: 'diy', sfx: 'pop', gain: .35 });
  return ev;
};
