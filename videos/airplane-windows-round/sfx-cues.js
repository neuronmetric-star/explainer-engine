// Sound effects for airplane-windows-round (synthesized by tools/sfx.py). Build: node tools/sfx.js airplane-windows-round
module.exports = ({ T, word }) => {
  const ev = [];
  const steps = (from, dur, rate, g) => { for (let t = T(from) + .15; t < T(from) + dur; t += 1 / rate) ev.push({ at: t, sfx: 'step', gain: g }); };
  for (const c of ['look', 'card', 'remember', 'pull', 'real', 'count', 'mirror', 'question']) ev.push({ at: T(c) - .05, sfx: 'whoosh', gain: .3 });
  // THE HOOK: a hit, a whoosh on the crash-zoom, a sting as Doug jumps
  ev.push({ at: 0, sfx: 'clunk', gain: .7 }, { at: 0.25, sfx: 'whoosh', gain: .5 }, { at: 0.3, sfx: 'click', gain: .8 }, { at: 0.32, sfx: 'pop', gain: .6 });
  ev.push({ at: 'q+0.4', sfx: 'pop', gain: .4 }, { at: 'scary', sfx: 'clunk', gain: .35 });
  steps('card', 1.6, 2.6, .4); ev.push({ at: 'living', sfx: 'pop', gain: .45 });
  ev.push({ at: 'puff', sfx: 'hum', gain: .3 }, { at: 'shrink', sfx: 'hum', gain: .25 });
  ev.push({ at: 'hard', sfx: 'tap', gain: .5 }, { at: 'notch', sfx: 'click', gain: .6 }, { at: 'rip', sfx: 'whoosh', gain: .55 }, { at: 'rip+0.05', sfx: 'tap', gain: .6 });
  ev.push({ at: 'crowd', sfx: 'pop', gain: .45 }, { at: 'comet', sfx: 'pop', gain: .3 }, { at: 'pump', sfx: 'hum', gain: .4 });
  ev.push({ at: 'crack', sfx: 'click', gain: .9 }, { at: 'crack+0.08', sfx: 'clunk', gain: .55 });
  ev.push({ at: 'round+0.2', sfx: 'beep', gain: .4 }, { at: 'porthole', sfx: 'pop', gain: .4 });
  // the signature goodbye (PLAYBOOK §1.12a)
  ev.push({ at: 'question', sfx: 'helicopter', gain: .6 });
  ev.push({ at: 'cta+0.3', sfx: 'pop', gain: .5 }, { at: 'cta+1.8', sfx: 'click', gain: .9 });
  return ev;
};
