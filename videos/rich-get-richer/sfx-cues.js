// Sound effects for rich-get-richer (synthesized by tools/sfx.py). Build: node tools/sfx.js rich-get-richer
module.exports = ({ T, word }) => {
  const ev = [];
  for (const c of ['card', 'car', 'victor', 'where', 'reveal', 'pays', 'diy']) ev.push({ at: T(c) - .05, sfx: 'whoosh', gain: .3 });
  // THE HOOK: a hit on the dollar, whoosh on the crash-zoom, sting + flash as Doug screams; the dollar zips up the pipe
  ev.push({ at: 0, sfx: 'clunk', gain: .75 }, { at: 0.12, sfx: 'whoosh', gain: .55 }, { at: 0.28, sfx: 'click', gain: .9 }, { at: 0.3, sfx: 'pop', gain: .65 });
  ev.push({ at: 'q+0.5', sfx: 'whoosh', gain: .35 }, { at: 'uphill', sfx: 'pop', gain: .45 });
  // coffee shop: $3, $5, tap, beep approved, the fee slam, $2 short, $40
  ev.push({ at: 'three', sfx: 'tap', gain: .4 }, { at: 'coffee+0.2', sfx: 'pop', gain: .4 }, { at: 'tap+0.4', sfx: 'tap', gain: .5 });
  ev.push({ at: 'beep', sfx: 'beep', gain: .55 }, { at: 'bet+0.3', sfx: 'pop', gain: .35 }, { at: 'fee', sfx: 'clunk', gain: .7 }, { at: 'fee+0.1', sfx: 'click', gain: .6 });
  ev.push({ at: 'short', sfx: 'pop', gain: .35 }, { at: 'what', sfx: 'pop', gain: .35 }, { at: 'now', sfx: 'clunk', gain: .55 }, { at: 'good', sfx: 'tap', gain: .3 });
  // the car: hiss + card swipe, the debt ticking
  ev.push({ at: 'car', sfx: 'hum', gain: .3 }, { at: 'nosave', sfx: 'whoosh', gain: .35 }, { at: 'interest', sfx: 'pop', gain: .35 });
  for (let i = 0; i < 5; i++) ev.push({ at: T('fifth') + i * .3, sfx: 'tap', gain: .3 });
  // Victor: no fee
  ev.push({ at: 'savings', sfx: 'pop', gain: .4 }, { at: 'nofee', sfx: 'click', gain: .7 });
  // the dollar's trip up the pipe, the pie slice, the 10 dots
  ev.push({ at: 'where+0.3', sfx: 'whoosh', gain: .3 }, { at: 'bank', sfx: 'clunk', gain: .45 }, { at: 'owners', sfx: 'whoosh', gain: .35 });
  ev.push({ at: 'piece', sfx: 'pop', gain: .4 }, { at: 'piece+0.5', sfx: 'click', gain: .5 });
  for (let i = 0; i < 10; i++) ev.push({ at: T('most') + i * .05, sfx: 'tap', gain: .25 });
  ev.push({ at: 'payday', sfx: 'click', gain: .9 }, { at: 'payday+0.05', sfx: 'pop', gain: .6 });
  ev.push({ at: 'pays', sfx: 'pop', gain: .35 }, { at: 'owns', sfx: 'pop', gain: .4 }, { at: 'debt', sfx: 'hum', gain: .3 }, { at: 'grows', sfx: 'pop', gain: .4 });
  ev.push({ at: 'mirror', sfx: 'pop', gain: .35 }, { at: 'bought', sfx: 'pop', gain: .45 });
  // the signature goodbye (PLAYBOOK §1.12a)
  ev.push({ at: 'diy', sfx: 'helicopter', gain: .6 }, { at: 'diy+0.2', sfx: 'pop', gain: .35 }, { at: 'question', sfx: 'pop', gain: .4 });
  ev.push({ at: 'cta+0.3', sfx: 'pop', gain: .5 }, { at: 'cta+1.8', sfx: 'click', gain: .9 });
  return ev;
};
