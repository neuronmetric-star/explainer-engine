// Sound effects for printer-how-it-works (synthesized by tools/sfx.py). Build: node tools/sfx.js printer-how-it-works
module.exports = ({ T, word }) => {
  const ev = [];
  for (const c of ['boils', 'look', 'print', 'head', 'zap', 'inks', 'row', 'real', 'catch', 'mirror', 'question']) ev.push({ at: T(c) - .05, sfx: 'whoosh', gain: .3 });
  // THE HOOK: a hit on the dots, a whoosh on the crash-zoom out, the sting as Doug jumps back on "It boils ink"
  ev.push({ at: 0, sfx: 'clunk', gain: .7 }, { at: 0.15, sfx: 'whoosh', gain: .55 }, { at: 'boils+0.28', sfx: 'click', gain: .9 }, { at: 'boils+0.3', sfx: 'pop', gain: .6 });
  ev.push({ at: 'only', sfx: 'pop', gain: .45 }, { at: 'print', sfx: 'click', gain: .6 }, { at: 'map', sfx: 'beep', gain: .35 });
  ev.push({ at: 'rollers', sfx: 'hum', gain: .4 }, { at: 'head', sfx: 'hum', gain: .35 });
  for (let i = 0; i < 6; i++) ev.push({ at: T('head') + .4 + i * .7, sfx: 'tap', gain: .3 });   // the head clicking along its rail
  ev.push({ at: 'holes', sfx: 'pop', gain: .35 }, { at: 'heater', sfx: 'pop', gain: .35 });
  // the nozzle: ZAP, the bubble pops, drops tick faster and faster
  ev.push({ at: 'zap', sfx: 'click', gain: .9 }, { at: 'zap+0.05', sfx: 'clunk', gain: .5 }, { at: 'bubble', sfx: 'pop', gain: .5 }, { at: 'kettle', sfx: 'hum', gain: .3 });
  for (let i = 0; i < 10; i++) ev.push({ at: T('again') + i * (0.5 - i * .04), sfx: 'tap', gain: .35 });
  for (let i = 0; i < 4; i++) ev.push({ at: T('inks') + .5 + i * .45, sfx: 'pop', gain: .35 });
  for (let i = 0; i < 9; i++) ev.push({ at: T('row') + i * .6, sfx: 'tap', gain: .3 });
  ev.push({ at: 'shot', sfx: 'whoosh', gain: .45 }, { at: 'idea', sfx: 'pop', gain: .4 });
  ev.push({ at: 'ketchup', sfx: 'pop', gain: .4 }, { at: 'stripes', sfx: 'clunk', gain: .5 }, { at: 'mirror+0.3', sfx: 'pop', gain: .4 });
  // the signature goodbye (PLAYBOOK §1.12a)
  ev.push({ at: 'question', sfx: 'helicopter', gain: .6 });
  ev.push({ at: 'cta+0.3', sfx: 'pop', gain: .5 }, { at: 'cta+1.8', sfx: 'click', gain: .9 });
  return ev;
};
