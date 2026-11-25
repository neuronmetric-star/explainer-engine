// Sound effects for high-doubts (synthesized by tools/sfx.py). Build: node tools/sfx.js high-doubts
module.exports = ({ T }) => {
  const ev = [];
  ev.push({ at: 0, sfx: 'clunk', gain: .6 }, { at: 0.2, sfx: 'whoosh', gain: .5 }, { at: 0.3, sfx: 'pop', gain: .6 }, { at: 'smacked+0.3', sfx: 'pop', gain: .35 }, { at: 'doubt', sfx: 'beep', gain: .3 });
  ev.push({ at: 'couch', sfx: 'tap', gain: .35 });
  for (const c of ['moon', 'true1', 'mirrors', 'crack1', 'better1', 'giants', 'true2', 'diary', 'better2', 'dinos', 'true3', 'chicken', 'ate', 'crack3', 'better3', 'round', 'true5', 'sticks', 'roof']) ev.push({ at: c, sfx: 'whoosh', gain: .26 });
  // every "Yo bro, that's true" lands with a click (the proof)
  for (const c of ['true1', 'true2', 'true3', 'true5', 'true4']) ev.push({ at: c + '+0.1', sfx: 'click', gain: .75 });
  ev.push({ at: 'moon+2.2', sfx: 'clunk', gain: .4 });
  // the laser: beeps out and back
  for (let i = 0; i < 4; i++) ev.push({ at: T('lasers') + i * 1.1, sfx: 'beep', gain: .3 });
  ev.push({ at: 'giants+0.2', sfx: 'clunk', gain: .45 }, { at: 'diary+0.2', sfx: 'pop', gain: .45 }, { at: 'merer+0.2', sfx: 'pop', gain: .35 });
  for (let i = 0; i < 3; i++) ev.push({ at: T('sand') + .4 + i * .5, sfx: 'whoosh', gain: .18 });
  ev.push({ at: 'dinos+0.2', sfx: 'step', gain: .6 }, { at: 'dinos+0.7', sfx: 'step', gain: .6 }, { at: 'chick2', sfx: 'pop', gain: .6 }, { at: 'ate+0.1', sfx: 'clunk', gain: .4 });
  ev.push({ at: 'sticks+0.1', sfx: 'tap', gain: .4 }, { at: 'sticks+0.8', sfx: 'tap', gain: .4 }, { at: 'bc+0.1', sfx: 'pop', gain: .35 });
  // they crack up (synthesized laughs)
  ev.push({ at: 'crack1+0.15', sfx: 'laugh', gain: .55 }, { at: 'crack3+0.1', sfx: 'laugh', gain: .7 }, { at: 'crack4+0.1', sfx: 'laugh', gain: .6 });
  // the signature goodbye
  ev.push({ at: 'heli', sfx: 'helicopter', gain: .6 }, { at: 'question+0.1', sfx: 'pop', gain: .45 }, { at: 'cta+0.3', sfx: 'pop', gain: .5 }, { at: 'cta+1.8', sfx: 'click', gain: .9 });
  return ev;
};
