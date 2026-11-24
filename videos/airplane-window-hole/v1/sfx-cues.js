// Sound effects for airplane-window-hole (synthesized by tools/sfx.py). Build: node tools/sfx.js airplane-window-hole
module.exports = ({ T, word }) => {
  const ev = [];
  const steps = (from, dur, rate, g) => { for (let t = T(from) + .15; t < T(from) + dur; t += 1 / rate) ev.push({ at: t, sfx: 'step', gain: g }); };
  // whoosh on every picture change
  for (const c of ['card', 'sky', 'push', 'pane1', 'victor', 'pane2', 'backup', 'seal', 'bet', 'takeoff', 'fog', 'frost', 'why', 'drill', 'clear', 'job', 'same', 'outer', 'mirror'])
    ev.push({ at: T(c) - .12, sfx: 'whoosh', gain: .22 });
  ev.push({ at: 'q', sfx: 'pop', gain: .5 }, { at: 'q+0.5', sfx: 'pop', gain: .45 });
  steps('card', 1.3, 2.6, .4); ev.push({ at: word('break', 'card'), sfx: 'clunk', gain: .5 });
  ev.push({ at: 'sky', sfx: 'plane', gain: .35 }, { at: 'sky+0.9', sfx: 'pop', gain: .4 });
  ev.push({ at: 'thin+0.5', sfx: 'pop', gain: .4 }, { at: 'balloon+0.3', sfx: 'pop', gain: .55 });
  ev.push({ at: 'push+0.3', sfx: 'pop', gain: .45 });
  for (let i = 0; i < 6; i++) ev.push({ at: T('milk') + .15 + i * .1 + .3, sfx: 'clunk', gain: .35 });
  ev.push({ at: word('pane', 'pane1'), sfx: 'pop', gain: .5 });
  steps('victor', 1.0, 2.6, .4); ev.push({ at: word('cracks', 'victor') - .5, sfx: 'pop', gain: .45 });
  ev.push({ at: 'pane2+0.4', sfx: 'servo', gain: .3 }, { at: 'pane2+0.9', sfx: 'tap', gain: .5 });
  ev.push({ at: 'backup+0.3', sfx: 'pop', gain: .4 }, { at: 'seal', sfx: 'servo', gain: .25 }, { at: 'seal+0.6', sfx: 'pop', gain: .45 });
  ev.push({ at: 'bet+0.3', sfx: 'pop', gain: .4 });
  steps('takeoff', 1.2, 2.6, .35); ev.push({ at: 'takeoff', sfx: 'hum', gain: .25 });
  ev.push({ at: 'fog+0.2', sfx: 'pop', gain: .35 }, { at: 'frost', sfx: 'clunk', gain: .45 });
  ev.push({ at: 'why+0.3', sfx: 'pop', gain: .4 }, { at: 'cold+0.4', sfx: 'pop', gain: .45 });
  ev.push({ at: 'drill+0.4', sfx: 'hum', gain: .55 }, { at: word('hole', 'drill'), sfx: 'pop', gain: .45 });
  ev.push({ at: 'clear+1.2', sfx: 'pop', gain: .4 }, { at: 'job+0.5', sfx: 'pop', gain: .45 });
  ev.push({ at: word('nothing', 'same'), sfx: 'pop', gain: .45 }, { at: 'outer+0.3', sfx: 'pop', gain: .45 });
  ev.push({ at: 'crack', sfx: 'click', gain: .9 }, { at: 'crack+0.1', sfx: 'clunk', gain: .5 }, { at: 'crack+2.2', sfx: 'beep', gain: .4 });
  // the helicopter ending (PLAYBOOK §1.12a)
  ev.push({ at: 'mirror', sfx: 'helicopter', gain: .6 }, { at: word('hole', 'mirror'), sfx: 'pop', gain: .4 });
  ev.push({ at: 'question+0.4', sfx: 'pop', gain: .45 });
  // follow CTA
  ev.push({ at: 'cta+0.3', sfx: 'pop', gain: .5 }, { at: 'cta+1.8', sfx: 'click', gain: .9 });
  return ev;
};
