// Sound effects for black-friday (synthesized by tools/sfx.py). Build: node tools/sfx.js black-friday
module.exports = ({ T, word }) => {
  const ev = [];
  const steps = (from, dur, rate, g) => { for (let t = T(from) + .2; t < T(from) + dur; t += 1 / rate) ev.push({ at: t, sfx: 'step', gain: g }); };
  // soft whoosh on every change of place
  for (const c of ['was', 'saving', 'anchor', 'usual', 'site', 'tonight', 'rushed', 'everyone', 'countdown', 'notplanning', 'catch', 'prove', 'rule', 'tag', 'other', 'check', 'compare', 'good', 'end'])
    ev.push({ at: T(c) - .12, sfx: 'whoosh', gain: .2 });
  ev.push({ at: 'q', sfx: 'pop', gain: .5 }, { at: 'q+0.9', sfx: 'pop', gain: .45 });
  ev.push({ at: 'now', sfx: 'pop', gain: .6 });                                        // NOW $500 lands
  steps(T('gary') - .2, 1.2, 2.8, .35);                                                // Gary walks in
  ev.push({ at: 'anchor+0.35', sfx: 'clunk', gain: 1 });                               // the anchor hits the $800
  ev.push({ at: word('bargain', 'feels'), sfx: 'pop', gain: .5 });
  ev.push({ at: 'usual+0.2', sfx: 'pop', gain: .35 });
  for (let t = T('tonight'); t < T('rushed') + 1.5; t += 1) ev.push({ at: t, sfx: 'click', gain: .3 });   // the countdown ticks
  ev.push({ at: 'tonight', sfx: 'beep', gain: .55 });
  ev.push({ at: word('back', 'back'), sfx: 'pop', gain: .45 });
  steps('everyone', 2.2, 4, .35);                                                      // shoppers hurrying off
  for (let t = T('countdown'); t < T('notplanning'); t += 1) ev.push({ at: t, sfx: 'click', gain: .35 });
  ev.push({ at: word('real', 'catch'), sfx: 'pop', gain: .5 }, { at: word('prove', 'prove'), sfx: 'beep', gain: .4 });
  ev.push({ at: 'rule+0.3', sfx: 'pop', gain: .4 }, { at: word('comparison', 'rule'), sfx: 'pop', gain: .45 });
  ev.push({ at: 'tag', sfx: 'pop', gain: .45 }, { at: word('last', 'tag') - .2, sfx: 'tap', gain: .5 });
  for (let i = 0; i < 3; i++) ev.push({ at: T('other') + .2 + i * .15, sfx: 'pop', gain: .35 });
  ev.push({ at: 'check+0.3', sfx: 'pop', gain: .5 });
  for (let i = 0; i < 3; i++) ev.push({ at: T('compare') + .3 + i * .45, sfx: 'pop', gain: .45 });
  ev.push({ at: word('good', 'good'), sfx: 'beep', gain: .6 });
  steps('end', 1.6, 2.8, .4);                                                          // Doug walks out with his TV
  // the helicopter ending (PLAYBOOK §1.12a)
  ev.push({ at: 'heli', sfx: 'helicopter', gain: .6 });
  ev.push({ at: word('price', 'tip'), sfx: 'pop', gain: .45 }, { at: word('compare', 'tip'), sfx: 'pop', gain: .45 });
  ev.push({ at: 'ask+0.2', sfx: 'clunk', gain: .5 });
  ev.push({ at: 'cta+0.3', sfx: 'pop', gain: .5 }, { at: 'cta+1.8', sfx: 'click', gain: .9 });
  return ev;
};
