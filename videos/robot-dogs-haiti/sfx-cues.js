// Sound effects for robot-dogs-haiti (synthesized by tools/sfx.py). Build: node tools/sfx.js robot-dogs-haiti
// Robot footsteps follow the scene's walk timing (trot: a pair of feet lands every half gait cycle).
module.exports = ({ T, word }) => {
  const ev = [];
  const steps = (t0, speed, from, to, g0, g1 = g0) => { const a = T(from), b = T(to);
    for (let k = 1; ; k++) { const t = T(t0) + k * .5 / speed; if (t >= b) break; if (t > a + .02) ev.push({ at: t, sfx: 'step', gain: g0 + (g1 - g0) * (t - a) / (b - a) }); } };
  // soft whoosh on every change of place
  for (const c of ['theory', 'salvador', 'fight', 'video', 'robots', 'stadium', 'see', 'never', 'what', 'operator', 'send',
    'brother', 'mount', 'unknown', 'callback', 'end', 'roomba', 'ask'])
    ev.push({ at: T(c) - .12, sfx: 'whoosh', gain: .22 });
  // robot walking
  steps(T('q') - 1, 1.1, 'q', 'theory', .2);              // inside the phone: quiet
  steps('robots', 1, 'robots', 'stadium', .45, .7);         // walking toward camera: louder
  steps(T('operator') - .5, 1, 'operator', 'send', .2);     // on the controller screen
  steps('send', 1.1, 'send', 'brother', .5, .25);           // walking away up the stairs
  steps('callback', .8, 'callback', 'first', .55, .7);      // "watch the feet"
  steps('first', 1.3, 'first', 'next', .55, .2);            // goes first, away from us
  ev.push({ at: 'never+0.05', sfx: 'servo', gain: .4 });    // robot settles; it never fires
  ev.push({ at: 'eyes+0.15', sfx: 'beep', gain: .6 });      // cameras switch on
  ev.push({ at: 'eyes+0.5', sfx: 'servo', gain: .5 }, { at: 'eyes+1.4', sfx: 'servo', gain: .45 }); // head scans
  ev.push({ at: 'mount+0.3', sfx: 'servo', gain: .3 });
  ev.push({ at: 'salvador', sfx: 'plane', gain: .7 });
  ev.push({ at: 'video+0.95', sfx: 'tap', gain: .8 });      // the President taps "post"
  ev.push({ at: 'brother+1.2', sfx: 'pop', gain: .6 });     // helmet camera pops on
  ev.push({ at: word('dark', 'end'), sfx: 'clunk', gain: .8 });
  ev.push({ at: 'roomba', sfx: 'hum', gain: .7 }, { at: 'roomba+0.1', sfx: 'beep', gain: .35 });
  ev.push({ at: 'cta+0.3', sfx: 'pop', gain: .5 }, { at: 'cta+1.8', sfx: 'click', gain: .9 });
  return ev;
};
