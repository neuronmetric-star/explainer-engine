// Sound effects for high-conversation (synthesized by tools/sfx.py). Build: node tools/sfx.js high-conversation
module.exports = ({ T }) => {
  const ev = [];
  // THE HOOK: hit + whoosh on the crash-zoom, pop as Gary screams
  ev.push({ at: 0, sfx: 'clunk', gain: .6 }, { at: 0.2, sfx: 'whoosh', gain: .5 }, { at: 0.3, sfx: 'pop', gain: .6 }, { at: 'smacked+0.4', sfx: 'pop', gain: .35 });
  ev.push({ at: 'true+0.5', sfx: 'click', gain: .7 }, { at: 'couch', sfx: 'tap', gain: .35 });
  // whip-pans between places
  for (const c of ['cleo+1.6', 'noway', 'crack1', 'better1', 'mam2', 'better2', 'trex2', 'crack2', 'stars', 'cards', 'yours', 'sorry', 'crack3', 'roof']) ev.push({ at: c, sfx: 'whoosh', gain: .28 });
  // the fact road: each object pops in; TRUE stamps click
  ev.push({ at: 'cleo+1.7', sfx: 'pop', gain: .4 }, { at: 'cleo+2.5', sfx: 'pop', gain: .4 }, { at: 'cleo+3.4', sfx: 'pop', gain: .4 });
  ev.push({ at: 'way', sfx: 'click', gain: .7 }, { at: 'mam2+0.6', sfx: 'step', gain: .5 }, { at: 'mam2+1.0', sfx: 'step', gain: .5 }, { at: 'mam2+1.4', sfx: 'step', gain: .5 });
  ev.push({ at: 'trex2+0.6', sfx: 'pop', gain: .4 }, { at: 'trex2+1.4', sfx: 'pop', gain: .4 });
  for (const c of ['true2', 'true3', 'true5', 'true6']) ev.push({ at: c, sfx: 'click', gain: .75 });
  ev.push({ at: 'true5+0.3', sfx: 'pop', gain: .4 });
  // cards shuffling: a quick run of taps
  for (let i = 0; i < 10; i++) ev.push({ at: T('cards') + .2 + i * .06, sfx: 'tap', gain: .3 });
  // they crack up (synthesized laughs, under the narrator)
  ev.push({ at: 'crack1+0.15', sfx: 'laugh', gain: .55 }, { at: 'crack2+0.15', sfx: 'laugh', gain: .55 }, { at: 'crack3+0.1', sfx: 'laugh', gain: .7 });
  ev.push({ at: 'sorry', sfx: 'clunk', gain: .35 });
  // the signature goodbye (PLAYBOOK §1.12a)
  ev.push({ at: 'heli', sfx: 'helicopter', gain: .6 }, { at: 'mirror+1.6', sfx: 'pop', gain: .4 }, { at: 'way2', sfx: 'click', gain: .6 });
  ev.push({ at: 'question+0.1', sfx: 'pop', gain: .45 }, { at: 'cta+0.3', sfx: 'pop', gain: .5 }, { at: 'cta+1.8', sfx: 'click', gain: .9 });
  return ev;
};
