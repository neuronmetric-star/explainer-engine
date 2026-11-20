// Sound effects for card-vs-cash. Build: node tools/sfx.js card-vs-cash
// Synth sounds (tools/sfx.py) + the Wan 3.0 clips' own audio (scanner hum, arena crowd) + the helicopter outro.
module.exports = ({ T, word }) => {
  const ev = [];
  // whoosh on every change of place
  for (const c of ['careful', 'auction', 'write', 'highest', 'catch', 'card', 'bet', 'mit', 'same', 'how', 'tap', 'gas',
    'fries', 'tens', 'tipoff', 'question', 'would', 'cta'])
    ev.push({ at: T(c) - .1, sfx: 'whoosh', gain: .22 });
  // bids and money
  ev.push({ at: 'q+0.4', sfx: 'pop', gain: .45 }, { at: 'q+0.9', sfx: 'pop', gain: .45 });   // $60 / $30 slips
  ev.push({ at: 'catch+0.3', sfx: 'pop', gain: .4 }, { at: 'card+0.2', sfx: 'pop', gain: .4 });
  for (let k = 0; k < 3; k++) ev.push({ at: T('count') + .1 + k * .5, sfx: 'tap', gain: .45 });   // counting three tens
  ev.push({ at: 'thirty+0.95', sfx: 'click', gain: .7 }, { at: 'sixty+0.75', sfx: 'click', gain: .7 }); // slips drop in the box
  ev.push({ at: 'look+0.2', sfx: 'beep', gain: .15 });                       // the card glints
  ev.push({ at: 'cashavg', sfx: 'pop', gain: .5 }, { at: 'cardavg', sfx: 'clunk', gain: .55 });
  ev.push({ at: 'tap+0.3', sfx: 'beep', gain: .35 }, { at: 'tap+0.32', sfx: 'tap', gain: .5 });   // contactless "beep"
  ev.push({ at: 'reward', sfx: 'ring', gain: .25 });
  ev.push({ at: 'fries', sfx: 'pop', gain: .45 });
  ev.push({ at: 'would', sfx: 'pop', gain: .4 }, { at: 'would+0.3', sfx: 'pop', gain: .4 });
  ev.push({ at: 'cta+0.4', sfx: 'pop', gain: .5 }, { at: 'cta+1.9', sfx: 'click', gain: .9 });
  // Wan clip audio, matched to what each shot shows
  const clip = (file, at, from, dur, gain) => ev.push({ at, file, from, dur, gain, fade: .05 });
  clip('clips/scan.wav', 'scan', 0, T('fries') - T('scan'), .45);
  clip('clips/arena.wav', 'tipoff', 0, T('question') - T('tipoff'), .8);
  // outro: the helicopter flies away
  ev.push({ at: 'cta', sfx: 'heli', gain: .55 });
  return ev;
};
