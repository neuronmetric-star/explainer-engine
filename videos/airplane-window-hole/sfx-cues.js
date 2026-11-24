// Sound effects for airplane-window-hole v3 (synthesized by tools/sfx.py). Build: node tools/sfx.js airplane-window-hole
// Whooshes only on the whip-pans (place changes); same-place shots flow without one.
module.exports = ({ T, word }) => {
  const ev = [];
  const steps = (from, dur, rate, g) => { for (let t = T(from) + .15; t < T(from) + dur; t += 1 / rate) ev.push({ at: t, sfx: 'step', gain: g }); };
  for (const c of ['card', 'sky', 'push', 'seal', 'fog', 'fault', 'drill', 'clear', 'door', 'outer', 'mirror']) ev.push({ at: T(c) - .05, sfx: 'whoosh', gain: .3 });
  // THE HOOK: a hit on frame 1, a whoosh on the crash-zoom, a sting as Gary jumps
  ev.push({ at: 0, sfx: 'clunk', gain: .7 }, { at: 0.25, sfx: 'whoosh', gain: .5 }, { at: 0.3, sfx: 'click', gain: .8 }, { at: 0.32, sfx: 'pop', gain: .6 });
  ev.push({ at: 'q', sfx: 'pop', gain: .4 }, { at: 'dot', sfx: 'beep', gain: .3 });
  steps('card', 1.6, 2.6, .4);
  ev.push({ at: 'sky', sfx: 'plane', gain: .35 }, { at: 'sky+0.6', sfx: 'pop', gain: .35 }, { at: 'balloon+0.3', sfx: 'hum', gain: .3 });
  for (let i = 0; i < 6; i++) ev.push({ at: T('milk') + .1 + i * .09 + .3, sfx: 'clunk', gain: .32 });
  ev.push({ at: 'layers+0.6', sfx: 'tap', gain: .5 }, { at: 'spare+0.9', sfx: 'servo', gain: .3 }, { at: T('tire') - .2, sfx: 'pop', gain: .45 });
  ev.push({ at: 'seal', sfx: 'servo', gain: .25 }, { at: 'bet+0.3', sfx: 'pop', gain: .35 });
  ev.push({ at: 'fog+0.2', sfx: 'hum', gain: .2 }, { at: 'frost', sfx: 'clunk', gain: .4 });
  ev.push({ at: 'cold+0.2', sfx: 'pop', gain: .4 });
  ev.push({ at: 'drill+0.8', sfx: 'hum', gain: .55 }, { at: 'clear', sfx: 'pop', gain: .45 });
  ev.push({ at: 'still', sfx: 'clunk', gain: .35 }, { at: 'nothing', sfx: 'pop', gain: .35 });
  ev.push({ at: 'crack', sfx: 'click', gain: .9 }, { at: 'crack+0.1', sfx: 'clunk', gain: .5 }, { at: 'takeover', sfx: 'beep', gain: .4 });
  // the helicopter ending (PLAYBOOK §1.12a)
  ev.push({ at: 'mirror', sfx: 'helicopter', gain: .6 }, { at: word('backup', 'mirror'), sfx: 'pop', gain: .4 }, { at: 'question+0.3', sfx: 'pop', gain: .4 });
  // follow CTA
  ev.push({ at: 'cta+0.3', sfx: 'pop', gain: .5 }, { at: 'cta+1.8', sfx: 'click', gain: .9 });
  return ev;
};
