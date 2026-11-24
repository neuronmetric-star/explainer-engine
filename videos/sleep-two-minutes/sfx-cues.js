// Sound effects for sleep-two-minutes (synthesized by tools/sfx.py). Build: node tools/sfx.js sleep-two-minutes
module.exports = ({ T, word }) => {
  const ev = [];
  for (const c of ['guard', 'real', 'melt', 'picture', 'down', 'weeks', 'mirror', 'question']) ev.push({ at: T(c) - .05, sfx: 'whoosh', gain: .3 });
  // THE HOOK: a hit, a whoosh on the crash-zoom, the sting + flash as Doug screams
  ev.push({ at: 0, sfx: 'clunk', gain: .75 }, { at: 0.22, sfx: 'whoosh', gain: .55 }, { at: 0.28, sfx: 'click', gain: .9 }, { at: 0.3, sfx: 'pop', gain: .65 });
  ev.push({ at: 'q+0.4', sfx: 'pop', gain: .4 }, { at: 'out', sfx: 'pop', gain: .35 }, { at: 'stare', sfx: 'tap', gain: .35 });
  // counting sheep (three hops), checking the time, flipping the pillow
  for (let i = 0; i < 3; i++) ev.push({ at: T('sheep') - .2 + i * .35 + .45, sfx: 'pop', gain: .35 });
  ev.push({ at: 'phone', sfx: 'beep', gain: .35 }, { at: 'flip', sfx: 'whoosh', gain: .25 }, { at: 'flip+0.35', sfx: 'whoosh', gain: .25 });
  ev.push({ at: 'wrong', sfx: 'clunk', gain: .5 });
  // the guard dog: alarm beeps, barking gets faster on "trying hard"
  ev.push({ at: 'tight', sfx: 'beep', gain: .45 }, { at: 'tight+0.5', sfx: 'beep', gain: .45 }, { at: 'bark', sfx: 'beep', gain: .5 }, { at: 'bark+0.3', sfx: 'beep', gain: .5 });
  for (let i = 0; i < 4; i++) ev.push({ at: T('harder') + i * .22, sfx: 'beep', gain: .5 });
  ev.push({ at: 'ww2', sfx: 'pop', gain: .3 }, { at: 'tired', sfx: 'hum', gain: .45 }, { at: 'tired+0.3', sfx: 'clunk', gain: .4 });
  // the melt: soft pops, no harsh sounds
  for (const c of ['face', 'shoulders', 'arms', 'breathe', 'legs']) ev.push({ at: c, sfx: 'pop', gain: .25 });
  ev.push({ at: 'canoe', sfx: 'hum', gain: .2 }, { at: 'down+0.2', sfx: 'pop', gain: .35 });
  ev.push({ at: 'weeks+0.3', sfx: 'pop', gain: .4 }, { at: 'help', sfx: 'pop', gain: .35 }, { at: 'gary', sfx: 'pop', gain: .35 });
  // the signature goodbye (PLAYBOOK §1.12a)
  ev.push({ at: 'question', sfx: 'helicopter', gain: .6 });
  ev.push({ at: 'cta+0.3', sfx: 'pop', gain: .5 }, { at: 'cta+1.8', sfx: 'click', gain: .9 });
  return ev;
};
