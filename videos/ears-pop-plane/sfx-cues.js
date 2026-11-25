// Sound effects for ears-pop-plane (synthesized by tools/sfx.py). Build: node tools/sfx.js ears-pop-plane
module.exports = ({ T, word }) => {
  const ev = [];
  const steps = (from, dur, rate, g) => { for (let t = T(from) + .15; t < T(from) + dur; t += 1 / rate) ev.push({ at: t, sfx: 'step', gain: g }); };
  for (const c of ['card', 'bag', 'same', 'perfect', 'more', 'squeeze', 'asleep', 'cabin', 'small', 'diy']) ev.push({ at: T(c) - .05, sfx: 'whoosh', gain: .3 });
  // THE HOOK: a hit, a whoosh on the crash-zoom, a sting as Gary jumps in
  ev.push({ at: 0, sfx: 'clunk', gain: .7 }, { at: 0.25, sfx: 'whoosh', gain: .5 }, { at: 0.3, sfx: 'click', gain: .8 }, { at: 0.32, sfx: 'pop', gain: .6 });
  ev.push({ at: 'notbroken', sfx: 'tap', gain: .4 }, { at: 'door', sfx: 'click', gain: .5 }, { at: 'shut', sfx: 'clunk', gain: .4 });
  steps('card', 1.2, 2.6, .35); ev.push({ at: 'gary', sfx: 'pop', gain: .45 });
  ev.push({ at: 'less', sfx: 'pop', gain: .5 }, { at: 'less+0.1', sfx: 'hum', gain: .3 });
  ev.push({ at: 'pop', sfx: 'pop', gain: .9 }, { at: 'pop+0.04', sfx: 'click', gain: .6 });
  ev.push({ at: 'perfect', sfx: 'pop', gain: .4 }, { at: 'except', sfx: 'clunk', gain: .35 });
  ev.push({ at: 'more', sfx: 'hum', gain: .35 }, { at: 'squeeze', sfx: 'tap', gain: .5 }, { at: 'stuck', sfx: 'clunk', gain: .5 }, { at: 'ouch', sfx: 'pop', gain: .55 });
  ev.push({ at: 'swallow', sfx: 'tap', gain: .5 }, { at: 'swallow+0.6', sfx: 'tap', gain: .4 }, { at: 'perfect2', sfx: 'pop', gain: .4 });
  ev.push({ at: 'gum', sfx: 'tap', gain: .45 }, { at: 'gum+1.8', sfx: 'tap', gain: .3 }, { at: 'gum+2.2', sfx: 'tap', gain: .3 });
  ev.push({ at: 'pump', sfx: 'hum', gain: .4 }, { at: 'notsky', sfx: 'pop', gain: .35 });
  ev.push({ at: 'flip', sfx: 'pop', gain: .4 });
  return ev;
};
