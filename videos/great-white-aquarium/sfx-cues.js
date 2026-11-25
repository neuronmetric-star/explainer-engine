// Sound effects for great-white-aquarium (synthesized by tools/sfx.py). Build: node tools/sfx.js great-white-aquarium
module.exports = ({ T, word }) => {
  const ev = [];
  // whooshes on every change of place (whip-pans)
  for (const c of ['swim', 'round', 'nose', 'phone', 'free1', 'big', 'free2', 'roam', 'diy']) ev.push({ at: T(c) - .05, sfx: 'whoosh', gain: .3 });
  // THE HOOK: a hit on the jaws, a whoosh on the crash-zoom out, the sting + flash as Gary screams
  ev.push({ at: 0, sfx: 'clunk', gain: .75 }, { at: 0.12, sfx: 'whoosh', gain: .55 }, { at: 0.28, sfx: 'click', gain: .9 }, { at: 0.3, sfx: 'pop', gain: .65 });
  ev.push({ at: 'q+0.6', sfx: 'pop', gain: .35 }, { at: 'never', sfx: 'pop', gain: .35 });
  for (let i = 0; i < 4; i++) ev.push({ at: T('tried') + .15 + i * .2, sfx: 'tap', gain: .4 });   // the four years
  ev.push({ at: 'boss+0.2', sfx: 'pop', gain: .35 }, { at: 'easy+0.1', sfx: 'pop', gain: .35 }, { at: 'bet+0.3', sfx: 'tap', gain: .35 });
  // breathing by swimming: bubbles, then the stop; the bike tips over
  ev.push({ at: 'swim+0.2', sfx: 'pop', gain: .3 }, { at: 'stop', sfx: 'clunk', gain: .4 }, { at: 'bike', sfx: 'pop', gain: .35 }, { at: 'bike+1.0', sfx: 'clunk', gain: .5 });
  // Sandy rams the wall (contacts line up with the scene's ram period), the buzz
  ev.push({ at: 'round+0.1', sfx: 'pop', gain: .35 });
  for (let k = 0; ; k++) { const at = T('bonk') + .05 + k * 1.0; if (at > T('gary')) break; ev.push({ at, sfx: 'clunk', gain: .55 }); }
  ev.push({ at: 'gary+0.6', sfx: 'hum', gain: .3 }, { at: T('buzz') - .3, sfx: 'beep', gain: .5 }, { at: 'nose+0.3', sfx: 'hum', gain: .25 });
  ev.push({ at: 'phone', sfx: 'beep', gain: .35 }, { at: 'phone+0.4', sfx: 'beep', gain: .35 }, { at: 'phone+0.8', sfx: 'beep', gain: .35 });
  // let her go (splash = whoosh + pop), the record crowd, the buffet
  ev.push({ at: 'free1+1.3', sfx: 'whoosh', gain: .45 }, { at: 'free1+1.5', sfx: 'pop', gain: .4 }, { at: 'big+0.1', sfx: 'pop', gain: .35 });
  for (let i = 0; i < 6; i++) ev.push({ at: T('crowd') + i * .25, sfx: 'tap', gain: .3 });
  ev.push({ at: 'record', sfx: 'pop', gain: .5 }, { at: 'buffet', sfx: 'clunk', gain: .45 }, { at: 'two+0.1', sfx: 'click', gain: .7 }, { at: 'two+0.3', sfx: 'click', gain: .7 });
  ev.push({ at: 'free2+1.3', sfx: 'whoosh', gain: .45 }, { at: 'free2+1.5', sfx: 'pop', gain: .4 });
  // the map trip, the closet slam, the mirror
  ev.push({ at: 'trip+0.3', sfx: 'pop', gain: .4 }, { at: 'closet', sfx: 'clunk', gain: .55 }, { at: 'ocean', sfx: 'pop', gain: .45 });
  // the signature goodbye (PLAYBOOK §1.12a)
  ev.push({ at: 'diy', sfx: 'helicopter', gain: .6 }, { at: 'question', sfx: 'pop', gain: .4 });
  ev.push({ at: 'cta+0.3', sfx: 'pop', gain: .5 }, { at: 'cta+1.8', sfx: 'click', gain: .9 });
  return ev;
};
