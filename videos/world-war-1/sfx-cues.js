// Sound effects for world-war-1 (synthesized by tools/sfx.py), on top of the Wan clips' own ambience
// (rain in the trench, street, lamp-lit room… laid under each shot by render.js). Build: node tools/sfx.js world-war-1
module.exports = ({ T, word }) => {
  const ev = [];
  const steps = (from, dur, rate, g) => { for (let t = T(from) + .15; t < T(from) + dur; t += 1 / rate) ev.push({ at: t, sfx: 'step', gain: g }); };
  // whoosh on every change of place
  for (const c of ['card', 'ground', 'christmas', 'trench', 'world', 'great', 'wells', 'rep', 'first', 'wait', 'why', 'rude', 'ends', '1939', 'ww2', 'end'])
    ev.push({ at: T(c) - .12, sfx: 'whoosh', gain: .22 });
  // opening title, dates
  ev.push({ at: 'q', sfx: 'pop', gain: .5 }, { at: 'q+0.5', sfx: 'pop', gain: .45 }, { at: 'card+0.2', sfx: 'pop', gain: .4 });
  steps('card', 1.5, 2.8, .4);
  ev.push({ at: 'sign', sfx: 'pop', gain: .35 });
  // the shot in Sarajevo (a dull thud, no gunshot), then the pins
  ev.push({ at: word('shot', 'ground'), sfx: 'clunk', gain: .7 });
  for (let i = 1; i < 4; i++) ev.push({ at: T('sides') + .25 * i, sfx: 'tap', gain: .5 });
  for (let i = 0; i < 4; i++) ev.push({ at: T('sides') + .9 + .25 * i, sfx: 'tap', gain: .5 });
  ev.push({ at: word('christmas', 'christmas'), sfx: 'pop', gain: .45 });
  ev.push({ at: 'trench+0.3', sfx: 'pop', gain: .35 });                      // the sad little tree
  for (let i = 0; i < 4; i++) ev.push({ at: T('years') + .42 * i, sfx: 'tap', gain: .45 });   // calendar flips
  for (let i = 0; i < 8; i++) ev.push({ at: T('world') + .5 + .14 * i, sfx: 'tap', gain: .4 });
  ev.push({ at: word('great', 'great'), sfx: 'pop', gain: .5 });
  ev.push({ at: 'wells+0.5', sfx: 'clunk', gain: .35 });                     // the book lands
  steps('rep', 1.6, 2.8, .4);
  for (let i = 0; i < 9; i++) ev.push({ at: T('first') + i * .11, sfx: 'tap', gain: .22 });   // pen scratching
  ev.push({ at: 'wait', sfx: 'pop', gain: .5 });
  ev.push({ at: 'why+0.3', sfx: 'tap', gain: .4 }, { at: 'why+0.65', sfx: 'tap', gain: .4 });
  ev.push({ at: word('wars', 'why'), sfx: 'pop', gain: .45 }, { at: word('correct', 'rude'), sfx: 'pop', gain: .4 });
  ev.push({ at: 'ends+0.1', sfx: 'pop', gain: .5 });
  steps('ends', 1.4, 2.8, .4); steps('home', 1.1, 2.8, .3);
  ev.push({ at: word('magazine', '1939'), sfx: 'whoosh', gain: .3 }, { at: word('magazine', '1939') + .2, sfx: 'tap', gain: .5 });
  ev.push({ at: word('world', 'number'), sfx: 'pop', gain: .55 });
  ev.push({ at: 'ww2+0.1', sfx: 'clunk', gain: .75 }, { at: word('world', 'ww2'), sfx: 'pop', gain: .4 });
  // the helicopter ending (PLAYBOOK §1.12a)
  ev.push({ at: 'heli', sfx: 'helicopter', gain: .6 });
  // follow CTA
  ev.push({ at: 'cta+0.3', sfx: 'pop', gain: .5 }, { at: 'cta+1.8', sfx: 'click', gain: .9 });
  return ev;
};
