// Sound effects for motivation-vs-discipline. Build: node tools/sfx.js motivation-vs-discipline
// Synth sounds (tools/sfx.py) + the Wan 3.0 clips' own audio (rain, wind) under the shots that use those clips.
module.exports = ({ T, word }) => {
  const ev = [];
  const W = (w, from) => word(w, from);
  // footsteps: `rate` gait cycles/s -> two steps per cycle
  const steps = (from, to, rate, g0, g1 = g0) => { const a = T(from), b = T(to);
    for (let t = a + .08; t < b - .05; t += .5 / rate) ev.push({ at: t, sfx: 'tap', gain: g0 + (g1 - g0) * (t - a) / (b - a) }); };
  // whoosh on every change of place
  for (const c of ['wake', 'sunrise', 'plan', 'gary', 'shoes', 'hates', 'rain', 'check', 'soaked', 'aside',
    'teeth', 'study', 'callback', 'laces', 'end', 'question', 'choice', 'cta'])
    ev.push({ at: T(c) - .1, sfx: 'whoosh', gain: .22 });
  ev.push({ at: W('heads', 'loop') - .1, sfx: 'whoosh', gain: .18 }, { at: W('or', 'choice') - .1, sfx: 'whoosh', gain: .18 });

  // alarm clock at 6:00
  for (const c of ['six', 'loop', 'enough']) ev.push({ at: c, sfx: 'pop', gain: .5 }, { at: T(c) + .05, sfx: 'ring', gain: .5 });
  for (const d of [0, .6, 1.2, 1.8]) ev.push({ at: T('week') + d, sfx: 'pop', gain: .35 });   // montage: a clock per morning
  ev.push({ at: 'wake', sfx: 'ring', gain: .45 });   // Doug's alarm, January first

  // running
  steps('q+0.6', 'problem', 1.3, .25);
  steps('hates', 'bet', 1.6, .35);
  steps('bet', 'dentist', 1.8, .4);
  steps('dentist', 'week', .9, .3);
  steps('week', 'rain', 1.8, .4);
  steps('soaked', 'aside', 1.6, .45);            // splashy steps in the rain
  steps(W('heads', 'loop'), 'enough', 1.5, .3);

  // props and gags
  ev.push({ at: 'study', sfx: 'pop', gain: .55 });
  ev.push({ at: 'pep', sfx: 'pop', gain: .6 });          // Victor pops in
  ev.push({ at: 'motiv', sfx: 'clunk', gain: .35 });     // hit on "motivation"
  ev.push({ at: 'zero', sfx: 'clunk', gain: .4 });
  ev.push({ at: 'cta+0.3', sfx: 'pop', gain: .5 }, { at: 'cta+1.8', sfx: 'click', gain: .9 });

  // Wan clip audio, matched to the clip time each shot shows (see scene.js shots/clipFrom)
  const clip = (file, at, from, dur, gain) => ev.push({ at, file, from, dur, gain, fade: .04 });
  clip('clips/sunrise_hill.wav', 'sunrise', 0, T('plan') - T('sunrise'), .55);
  clip('clips/rain_street.wav', 'rain', 0, T('check') - T('rain'), .7);
  clip('clips/bedroom_rain.wav', 'check', 0, T('soaked') - T('check'), .5);
  clip('clips/rain_street.wav', 'soaked', 1.3, T('aside') - T('soaked'), .7);
  clip('clips/bedroom_rain.wav', 'end', 0, T('question') - T('end'), .45);
  clip('clips/bedroom_rain.wav', 'choice', 0, W('or', 'choice') - T('choice'), .4);
  return ev;
};
