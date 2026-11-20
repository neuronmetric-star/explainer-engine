// Sound effects for pay-later. Build: node tools/sfx.js pay-later
// Synth sounds (tools/sfx.py) + the Wan 3.0 clips' own audio (bills into the jar, phone buzzing) + the helicopter outro.
module.exports = ({ T, word }) => {
  const ev = [];
  // whoosh on every change of place
  for (const c of ['doug', 'gary', 'bet', 'gotjar', 'again', 'research', 'friday', 'fed', 'garyend', 'end', 'times', 'question', 'orjar', 'cta'])
    ev.push({ at: T(c) - .1, sfx: 'whoosh', gain: .22 });
  ev.push({ at: 'q+0.5', sfx: 'pop', gain: .4 });                                  // $400 tag
  ev.push({ at: 'hundred', sfx: 'pop', gain: .4 });
  ev.push({ at: 'button', sfx: 'pop', gain: .5 }, { at: 'bnpl+0.4', sfx: 'click', gain: .7 });   // the button
  ev.push({ at: 'today+0.1', sfx: 'whoosh', gain: .3 });                           // a hundred flies off
  for (let k = 0; k < 3; k++) ev.push({ at: T('every') + .5 + k * .8, sfx: 'pop', gain: .3 });   // three more payments
  ev.push({ at: 'scary', sfx: 'clunk', gain: .4 }, { at: 'easy', sfx: 'pop', gain: .45 });
  for (const c of ['headphones', 'jacket', 'pizza']) ev.push({ at: c, sfx: 'pop', gain: .5 }, { at: T(c) + .25, sfx: 'click', gain: .5 });
  ev.push({ at: 'barely+0.3', sfx: 'whoosh', gain: .2 });
  ev.push({ at: 'plus+0.2', sfx: 'pop', gain: .4 }, { at: 'plus+0.9', sfx: 'pop', gain: .4 });
  ev.push({ at: 'late', sfx: 'beep', gain: .6 }, { at: 'late+0.25', sfx: 'beep', gain: .6 }, { at: 'late', sfx: 'clunk', gain: .5 });
  ev.push({ at: 'end+0.4', sfx: 'beep', gain: .4 });                              // register beep
  ev.push({ at: 'times', sfx: 'clunk', gain: .4 });
  ev.push({ at: 'cta+0.4', sfx: 'pop', gain: .5 }, { at: 'cta+1.9', sfx: 'click', gain: .9 });
  // Wan clip audio
  const clip = (file, at, from, dur, gain) => ev.push({ at, file, from, dur, gain, fade: .05 });
  clip('clips/jar.wav', 'jar', 0, T('bet') - T('jar'), .6);
  clip('clips/buzz.wav', 'friday', 0, T('console') - T('friday'), .7);
  clip('clips/jar.wav', 'empties', 4.0, T('end') - T('empties'), .5);
  ev.push({ at: 'cta', sfx: 'heli', gain: .55 });
  return ev;
};
