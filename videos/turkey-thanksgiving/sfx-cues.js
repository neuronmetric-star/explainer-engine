// Sound effects for turkey-thanksgiving (synthesized by tools/sfx.py). Build: node tools/sfx.js turkey-thanksgiving
module.exports = ({ T, word }) => {
  const ev = [];
  const steps = (from, dur, rate, g) => { for (let t = T(from) + .15; t < T(from) + dur; t += 1 / rate) ev.push({ at: t, sfx: 'step', gain: g }); };
  // whoosh on every change of place
  for (const c of ['card', 'ground', 'bet', 'winslow', 'birds', 'deer', 'notice', 'doubt', 'editor', 'lincoln', 'big', 'end'])
    ev.push({ at: T(c) - .12, sfx: 'whoosh', gain: .25 });
  ev.push({ at: 'q', sfx: 'pop', gain: .5 }, { at: 'q+0.9', sfx: 'pop', gain: .45 });
  steps('card', 1.6, 2.8, .4); steps('letter', 1.6, 2.8, .4); steps('heli', 1.0, 2.8, .4);
  ev.push({ at: 'ground', sfx: 'pop', gain: .5 }, { at: word('pilgrims', 'feast'), sfx: 'pop', gain: .4 }, { at: 'feast+1.8', sfx: 'pop', gain: .4 }, { at: word('threeday', 'feast'), sfx: 'pop', gain: .5 });
  ev.push({ at: word('turkey', 'bet'), sfx: 'clunk', gain: .6 });
  ev.push({ at: word('fowling', 'fowling'), sfx: 'pop', gain: .5 });
  for (const w of ['ducks', 'geese', 'turkey']) ev.push({ at: word(w, 'birds'), sfx: 'pop', gain: .45 });
  for (let i = 0; i < 5; i++) ev.push({ at: T('deer') + .3 + i * .28, sfx: 'pop', gain: .35 });
  ev.push({ at: 'notice', sfx: 'whoosh', gain: .2 }, { at: word('not', 'notice'), sfx: 'beep', gain: .45 });
  ev.push({ at: word('sarah', 'editor'), sfx: 'pop', gain: .45 }, { at: 'novel', sfx: 'pop', gain: .5 });
  for (let i = 0; i < 5; i++) ev.push({ at: word('five', 'letters') + i * .3, sfx: 'whoosh', gain: .15 });
  ev.push({ at: word('yes', 'lincoln'), sfx: 'clunk', gain: .7 });
  ev.push({ at: word('turkeys', 'eggs') - .1, sfx: 'pop', gain: .45 }, { at: word('cheap', 'eggs'), sfx: 'pop', gain: .5 });
  for (let i = 0; i < 10; i++) ev.push({ at: T('today') + .15 + i * .12, sfx: 'tap', gain: .3 });
  ev.push({ at: word('served', 'deerplate'), sfx: 'clunk', gain: .5 }, { at: word('turkey', 'heli') - .15, sfx: 'clunk', gain: .5 });
  ev.push({ at: 'heli', sfx: 'helicopter', gain: .6 });   // the helicopter ending (PLAYBOOK §1.12a)
  ev.push({ at: 'cta+0.3', sfx: 'pop', gain: .5 }, { at: 'cta+1.8', sfx: 'click', gain: .6 });
  return ev;
};
