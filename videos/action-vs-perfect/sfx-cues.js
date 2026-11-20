// Sound effects for action-vs-perfect. Build: node tools/sfx.js action-vs-perfect
// Synth sounds (tools/sfx.py) + the Wan 3.0 clips' own audio (wheel hum, wet clay) + the helicopter outro.
module.exports = ({ T, word }) => {
  const ev = [];
  // whoosh on every change of place
  for (const c of ['meet', 'class', 'dougside', 'garyside', 'sketch', 'grab', 'bet', 'plan', 'hasPotato', 'shelf', 'end', 'garypot',
    'aside', 'drawing', 'callback', 'learned', 'question', 'garyfix', 'dougclay', 'cta'])
    ev.push({ at: T(c) - .1, sfx: 'whoosh', gain: .22 });
  // gags and props
  ev.push({ at: 'doug', sfx: 'pop', gain: .35 }, { at: 'gary', sfx: 'pop', gain: .35 });
  ev.push({ at: 'split', sfx: 'whoosh', gain: .3 });                    // the teacher splits the room
  ev.push({ at: 'dougside+0.2', sfx: 'clunk', gain: .5 });              // heap of pots lands on the scale
  ev.push({ at: 'dogfood+0.1', sfx: 'pop', gain: .55 });
  ev.push({ at: 'sketch', sfx: 'pop', gain: .4 });
  for (let k = 0; k < 6; k++) ev.push({ at: T('erase') + .1 + k * .1, sfx: 'tap', gain: .35 });   // rubbing out the handle
  ev.push({ at: 'potato', sfx: 'clunk', gain: .6 }, { at: 'callback', sfx: 'pop', gain: .4 });
  ev.push({ at: 'reveal', sfx: 'ring', gain: .25 });                   // a little "ding" for the winners
  ev.push({ at: 'lean', sfx: 'tap', gain: .3 });
  ev.push({ at: 'learned+0.4', sfx: 'pop', gain: .45 });               // the pencil
  ev.push({ at: 'cta+0.4', sfx: 'pop', gain: .5 }, { at: 'cta+1.9', sfx: 'click', gain: .9 });
  // Wan clip audio, matched to what each shot shows (scene.js shots / clipFrom)
  const clip = (file, at, from, dur, gain) => ev.push({ at, file, from, dur, gain, fade: .04 });
  clip('clips/spin.wav', 'grab', 0, T('potato') - T('grab'), .7);
  clip('clips/fold.wav', 'see', 0, T('thicker') - T('see'), .8);
  clip('clips/stand.wav', 'thicker', 0, T('drawing') - T('thicker'), .6);
  clip('clips/spin.wav', 'dougclay', 1.0, T('cta') - T('dougclay'), .6);
  // outro: the helicopter flies away
  ev.push({ at: 'cta', sfx: 'heli', gain: .55 });
  return ev;
};
