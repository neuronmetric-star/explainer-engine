// Sound effects for ozempic (synthesized by tools/sfx.py). Build: node tools/sfx.js ozempic
module.exports = ({ T, word }) => {
  const ev = [];
  const steps = (from, dur, rate, g) => { for (let t = T(from) + .15; t < T(from) + dur; t += 1 / rate) ev.push({ at: t, sfx: 'step', gain: g }); };
  for (const c of ['card', 'burger', 'gut', 'lizard', 'chunky', 'venom', 'week', 'stomach', 'sink', 'clue', 'study', 'queasy', 'stop', 'mirror'])
    ev.push({ at: T(c) - .12, sfx: 'whoosh', gain: .22 });
  ev.push({ at: 'q', sfx: 'pop', gain: .5 }, { at: 'q+0.5', sfx: 'pop', gain: .45 });
  steps('card', 1.3, 2.6, .35);
  for (let i = 0; i < 8; i++) ev.push({ at: T('shot') + i * .06, sfx: 'tap', gain: .3 });
  ev.push({ at: word('eight', 'shot'), sfx: 'beep', gain: .4 });
  ev.push({ at: word('melts', 'melt'), sfx: 'pop', gain: .5 });
  ev.push({ at: word('g', 'gut'), sfx: 'pop', gain: .45 });
  ev.push({ at: 'full', sfx: 'whoosh', gain: .3 }, { at: 'full+1.1', sfx: 'beep', gain: .5 });   // the text lands: ding
  ev.push({ at: 'delete+0.2', sfx: 'click', gain: .5 }, { at: word('minutes', 'delete') + .25, sfx: 'clunk', gain: .45 });
  ev.push({ at: 'lizard+0.2', sfx: 'pop', gain: .4 }, { at: word('four', 'chunky'), sfx: 'pop', gain: .45 });
  ev.push({ at: word('hours', 'venom'), sfx: 'beep', gain: .45 });
  ev.push({ at: 'week', sfx: 'hum', gain: .25 });
  for (let i = 0; i < 7; i++) ev.push({ at: word('week', 'week') + i * .12, sfx: 'tap', gain: .35 });
  ev.push({ at: 'ozempic+0.1', sfx: 'pop', gain: .5 });
  ev.push({ at: 'sink+0.3', sfx: 'pop', gain: .3 });
  for (let i = 0; i < 6; i++) ev.push({ at: T('brain') + .15 + i * .45, sfx: 'beep', gain: .25 });
  ev.push({ at: 'clue+0.3', sfx: 'pop', gain: .5 }, { at: 'nomelt+0.4', sfx: 'clunk', gain: .5 });
  ev.push({ at: word('fifteen', 'study'), sfx: 'clunk', gain: .5 }, { at: 'pounds+0.1', sfx: 'pop', gain: .45 });
  ev.push({ at: 'queasy+0.1', sfx: 'pop', gain: .45 }, { at: 'stop+0.2', sfx: 'clunk', gain: .5 });
  ev.push({ at: 'back+0.2', sfx: 'servo', gain: .3 }, { at: 'back+0.2', sfx: 'pop', gain: .45 });
  ev.push({ at: word('texting', 'mirror'), sfx: 'beep', gain: .45 });
  // the helicopter ending (PLAYBOOK §1.12a)
  ev.push({ at: 'mirror', sfx: 'helicopter', gain: .6 });
  ev.push({ at: 'ask', sfx: 'pop', gain: .4 }, { at: 'ask+0.3', sfx: 'pop', gain: .4 });
  // follow CTA
  ev.push({ at: 'cta+0.3', sfx: 'pop', gain: .5 }, { at: 'cta+1.8', sfx: 'click', gain: .9 });
  return ev;
};
