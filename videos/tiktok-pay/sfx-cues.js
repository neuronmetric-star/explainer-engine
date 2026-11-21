// Sound effects for tiktok-pay (synthesized by tools/sfx.py). Build: node tools/sfx.js tiktok-pay
module.exports = ({ T, word }) => {
  const ev = [];
  const steps = (from, dur, rate, g) => { for (let t = T(from) + .2; t < T(from) + dur; t += 1 / rate) ev.push({ at: t, sfx: 'step', gain: g }); };
  for (const c of ['card', 'car', 'gary', 'zero', 'join', 'had', 'clue', 'minute', 'short', 'qualified', 'fyp', 'real', 'rate', 'million', 'phone', 'wink', 'end'])
    ev.push({ at: T(c) - .12, sfx: 'whoosh', gain: .2 });
  ev.push({ at: 'q', sfx: 'pop', gain: .5 }, { at: 'q+0.7', sfx: 'pop', gain: .45 });
  ev.push({ at: 'card', sfx: 'beep', gain: .45 });                                   // notification: a million views
  ev.push({ at: word('zero', 'zero'), sfx: 'clunk', gain: .9 });                     // $0.00
  ev.push({ at: word('creator', 'program'), sfx: 'pop', gain: .45 });
  for (const w of ['eighteen', 'followers', 'days']) ev.push({ at: word(w, 'join') - .1, sfx: 'tap', gain: .6 });   // ticks
  steps('had', .9, 2.8, .35);
  ev.push({ at: word('fiftyeight', 'timer'), sfx: 'beep', gain: .6 });
  ev.push({ at: word('minute', 'minute'), sfx: 'pop', gain: .5 }, { at: word('two', 'short'), sfx: 'clunk', gain: .5 });
  ev.push({ at: 'qualified+0.3', sfx: 'pop', gain: .5 }, { at: word('real', 'real'), sfx: 'pop', gain: .4 }, { at: word('person', 'real'), sfx: 'pop', gain: .4 });
  ev.push({ at: word('forty', 'rate'), sfx: 'pop', gain: .5 }, { at: word('four', 'million'), sfx: 'beep', gain: .5 });
  ev.push({ at: 'phone', sfx: 'pop', gain: .45 }, { at: word('not', 'phone'), sfx: 'clunk', gain: .45 });
  ev.push({ at: word('video', 'wink'), sfx: 'pop', gain: .5 }, { at: word('one', 'end'), sfx: 'beep', gain: .5 });
  // the helicopter ending + the helicopter clip under the follow CTA (PLAYBOOK §1.12a)
  ev.push({ at: 'heli', sfx: 'helicopter', gain: .6 }, { at: 'cta', sfx: 'helicopter', gain: .55 });
  ev.push({ at: 'cta+1.4', sfx: 'pop', gain: .5 }, { at: 'cta+2.9', sfx: 'click', gain: .9 });
  return ev;
};
