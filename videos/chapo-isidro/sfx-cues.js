// Sound effects for chapo-isidro (synthesized by tools/sfx.py). Build: node tools/sfx.js chapo-isidro
// No gunfire sounds: the firefight gets a low hum only, read straight.
module.exports = ({ T, word }) => {
  const ev = [];
  const steps = (from, dur, rate, g) => { for (let t = T(from) + .1; t < T(from) + dur; t += 1 / rate) ev.push({ at: t, sfx: 'step', gain: g }); };
  for (const c of ['doug', 'real', 'card', 'define', 'own', 'caught', 'door', 'spin', 'reward', 'friday', 'plane', 'takeoff', 'mirror', 'air'])
    ev.push({ at: T(c) - .12, sfx: 'whoosh', gain: .22 });
  ev.push({ at: 'q', sfx: 'pop', gain: .5 }, { at: 'q+0.5', sfx: 'pop', gain: .45 }, { at: 'doug+0.4', sfx: 'pop', gain: .45 });
  ev.push({ at: word('different', 'gary'), sfx: 'pop', gain: .45 });
  // corkboard: pins and stamps
  ev.push({ at: 'real', sfx: 'tap', gain: .6 }, { at: 'life+0.1', sfx: 'clunk', gain: .6 });
  steps('card', 2.2, 2.4, .35);
  ev.push({ at: word('farm', 'town'), sfx: 'pop', gain: .4 }, { at: 'teen+0.2', sfx: 'pop', gain: .4 }); steps('teen', 1.8, 2.6, .3);
  for (const d of [0, .3, .35, .6, .65, .7]) ev.push({ at: T('define') + d, sfx: 'tap', gain: .45 });
  ev.push({ at: 'brothers', sfx: 'tap', gain: .55 }, { at: 'brothers+0.9', sfx: 'tap', gain: .5 }, { at: word('partners', 'brothers'), sfx: 'pop', gain: .4 });
  ev.push({ at: 'split', sfx: 'pop', gain: .45 }, { at: word('arrested', 'split'), sfx: 'clunk', gain: .6 });
  ev.push({ at: word('enemies', 'war'), sfx: 'pop', gain: .7 }, { at: word('enemies', 'war') + .05, sfx: 'clunk', gain: .5 });
  ev.push({ at: 'side+0.3', sfx: 'tap', gain: .45 });
  // map
  ev.push({ at: 'own+0.3', sfx: 'tap', gain: .55 }, { at: 'usa+0.2', sfx: 'whoosh', gain: .3 }, { at: 'bet+0.5', sfx: 'pop', gain: .4 });
  // the revolving door: cuffs click, walk out, faster each time
  for (const c of ['caught', '2014', '2015']) ev.push({ at: T(c) + .05, sfx: 'click', gain: .9 }, { at: T(c) + .12, sfx: 'click', gain: .7 });
  for (const [c, r] of [['free', 2.6], ['free2', 3.1], ['free3', 3.6]]) { ev.push({ at: T(c) + .1, sfx: 'pop', gain: .45 }); steps(c, .8, r, .35); }
  ev.push({ at: 'spin', sfx: 'servo', gain: .3 }, { at: 'mirror', sfx: 'servo', gain: .25 });
  // wanted poster
  ev.push({ at: 'reward+0.1', sfx: 'tap', gain: .6 }, { at: word('ten', 'reward'), sfx: 'pop', gain: .45 });
  // Friday night: low hum under the fire, no gunfire
  ev.push({ at: word('five', 'friday'), sfx: 'pop', gain: .4 }, { at: 'fight', sfx: 'hum', gain: .25 }, { at: 'dead', sfx: 'hum', gain: .2 });
  // the plane
  for (const c of ['plane']) ev.push({ at: T(c) + .05, sfx: 'click', gain: .6 }); steps('plane', 1.1, 2.2, .3);
  ev.push({ at: 'takeoff-0.2', sfx: 'plane', gain: .5 });
  // the helicopter ending (PLAYBOOK §1.12a)
  ev.push({ at: 'air', sfx: 'helicopter', gain: .6 });
  ev.push({ at: word('mexico', 'ask'), sfx: 'pop', gain: .45 }, { at: word('america', 'ask'), sfx: 'pop', gain: .45 });
  // follow CTA
  ev.push({ at: 'cta+0.3', sfx: 'pop', gain: .5 }, { at: 'cta+1.8', sfx: 'click', gain: .9 });
  return ev;
};
