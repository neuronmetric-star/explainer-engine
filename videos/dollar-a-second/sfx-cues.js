// Sound effects for dollar-a-second (synthesized by tools/sfx.py). Build: node tools/sfx.js dollar-a-second
// The phone ticks once a second whenever we see the counter running: that tick is the clue you can hear.
module.exports = ({ T, word }) => {
  const ev = [];
  const ticks = (from, to, g) => { for (let t = T(from); t < T(to) - .05; t += 1) ev.push({ at: t, sfx: 'click', gain: g }); };
  const steps = (from, dur, rate, g) => { for (let t = T(from) + .2; t < T(from) + dur; t += 1 / rate) ev.push({ at: t, sfx: 'step', gain: g }); };
  // soft whoosh on every change of place
  for (const c of ['phone', 'boat', 'day12', 'million', 'math', 'wait', 'reveal', 'end'])
    ev.push({ at: T(c) - .12, sfx: 'whoosh', gain: .22 });
  ev.push({ at: word("gary's", 'end') - .1, sfx: 'whoosh', gain: .3 });       // hard cut to the yacht
  // opening title + the two choices
  ev.push({ at: 'q', sfx: 'pop', gain: .5 }, { at: 'q+1.5', sfx: 'pop', gain: .45 }, { at: 'q+1.9', sfx: 'pop', gain: .4 });
  ev.push({ at: word('grabbed', 'grab'), sfx: 'whoosh', gain: .35 }, { at: word('grabbed', 'grab') + .45, sfx: 'clunk', gain: .6 });
  ev.push({ at: 'gary+0.2', sfx: 'pop', gain: .45 }, { at: word('bag', 'bet'), sfx: 'pop', gain: .5 });
  // the phone counter: one tick a second
  ticks('phone', 'day1', .35);
  ev.push({ at: word('eightysix', 'day1'), sfx: 'beep', gain: .5 });
  ev.push({ at: 'seconds', sfx: 'pop', gain: .45 }, { at: 'seconds+0.3', sfx: 'tap', gain: .5 });
  ev.push({ at: word('one', 'million'), sfx: 'beep', gain: .6 });
  // Doug walks in on day twelve, and into the bank
  steps('day12', 1.3, 2.8, .4);
  steps('wait', 2.0, 2.8, .45);
  // the whiteboard math: a marker tap per term
  for (const [w, c] of [['sixty', 'chain'], ['sixty', 'chain+1.0'], ['twentyfour', 'chain'], ['three', 'chain']]) ev.push({ at: word(w, c), sfx: 'tap', gain: .55 });
  ev.push({ at: 'total', sfx: 'pop', gain: .6 }, { at: 'ahead+0.5', sfx: 'pop', gain: .5 });
  // bank
  ev.push({ at: word('four', 'interest'), sfx: 'pop', gain: .5 }, { at: word('interest', 'interest'), sfx: 'pop', gain: .4 });
  ev.push({ at: word('one', 'dougbank'), sfx: 'pop', gain: .5 });
  for (let t = T('gary2'); t < T('reveal') - .1; t += .5) ev.push({ at: t + .4, sfx: 'tap', gain: .18 });   // dollars landing in the vault
  ev.push({ at: 'close+0.2', sfx: 'pop', gain: .45 }, { at: word('million', 'close'), sfx: 'pop', gain: .55 });
  // the reveal: the phone ticks up to a year of seconds
  { const e = word('seconds', 'reveal'); for (let t = e - 1; t > T('reveal'); t -= 1) ev.push({ at: t, sfx: 'click', gain: .35 }); }   // counter ticks land on these
  ev.push({ at: word('seconds', 'reveal'), sfx: 'beep', gain: .6 });
  // the helicopter ending (PLAYBOOK §1.12a)
  ev.push({ at: 'end+1.79', sfx: 'helicopter', gain: .6 });
  // follow CTA
  ev.push({ at: 'cta+0.3', sfx: 'pop', gain: .5 }, { at: 'cta+1.8', sfx: 'click', gain: .9 });
  return ev;
};
