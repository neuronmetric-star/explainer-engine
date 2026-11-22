// Sound effects for full-price (synthesized by tools/sfx.py). Build: node tools/sfx.js full-price
// The SNL clip (snl..bet) carries its own sound, so it gets almost nothing on top.
module.exports = ({ T, word }) => {
  const ev = [];
  const steps = (from, dur, rate, g) => { for (let t = T(from) + .15; t < T(from) + dur; t += 1 / rate) ev.push({ at: t, sfx: 'step', gain: g }); };
  for (const c of ['tv', 'plan', 'sticker', 'october', 'why', 'jcp', 'drop', 'back', 'brain', 'end']) ev.push({ at: T(c) - .12, sfx: 'whoosh', gain: .22 });
  ev.push({ at: 'q', sfx: 'pop', gain: .5 }, { at: 'q+0.6', sfx: 'pop', gain: .45 });
  ev.push({ at: word('crossed', 'tv'), sfx: 'tap', gain: .55 }, { at: word('crossed', 'tv') + .15, sfx: 'pop', gain: .45 });
  ev.push({ at: 'plan+0.2', sfx: 'pop', gain: .4 }, { at: 'plan+0.5', sfx: 'beep', gain: .35 });
  ev.push({ at: 'bet+0.5', sfx: 'pop', gain: .45 });
  ev.push({ at: 'sticker+0.6', sfx: 'servo', gain: .25 }, { at: 'peel+0.5', sfx: 'clunk', gain: .5 });
  ev.push({ at: 'october+0.3', sfx: 'pop', gain: .5 }, { at: 'why+0.3', sfx: 'pop', gain: .45 });
  steps('jcp', 1.8, 2.6, .4);
  ev.push({ at: word('twenty', 'jcp'), sfx: 'pop', gain: .45 });
  ev.push({ at: 'honest', sfx: 'pop', gain: .45 }, { at: 'honest+0.3', sfx: 'clunk', gain: .45 });
  ev.push({ at: word('coupons', 'honest'), sfx: 'pop', gain: .45 }, { at: word('coupons', 'honest') + .3, sfx: 'clunk', gain: .45 });
  ev.push({ at: word('one', 'honest'), sfx: 'pop', gain: .5 }, { at: 'bet2+0.3', sfx: 'pop', gain: .45 });
  ev.push({ at: word('quarter', 'drop'), sfx: 'clunk', gain: .55 }, { at: 'billion', sfx: 'clunk', gain: .6 });
  ev.push({ at: 'fired+0.1', sfx: 'clunk', gain: .65 }); steps('fired+0.4', 1.2, 2.6, .4);
  for (const d of [0, .225, .45, .675]) ev.push({ at: T('back') + d * .9, sfx: 'pop', gain: .4 });
  ev.push({ at: word('first', 'brain'), sfx: 'pop', gain: .5 }, { at: '599+0.2', sfx: 'tap', gain: .5 }, { at: '599+0.8', sfx: 'pop', gain: .5 });
  ev.push({ at: word('win', '599'), sfx: 'beep', gain: .5 }, { at: word('tv', '299'), sfx: 'pop', gain: .35 });
  steps('end', 1.3, 2.6, .35);
  // the helicopter ending (PLAYBOOK §1.12a)
  ev.push({ at: 'mirror', sfx: 'helicopter', gain: .6 });
  // follow CTA
  ev.push({ at: 'cta+0.3', sfx: 'pop', gain: .5 }, { at: 'cta+1.8', sfx: 'click', gain: .9 });
  return ev;
};
