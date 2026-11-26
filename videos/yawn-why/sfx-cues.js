// Sound effects for yawn-why v4 (synthesized by tools/sfx.py). Build: node tools/sfx.js yawn-why
module.exports = ({ T, word }) => {
  const ev = [];
  for (const c of ['belief', 'people', 'rats', 'doug']) ev.push({ at: T(c) - .05, sfx: 'whoosh', gain: .35 });
  ev.push({ at: 0, sfx: 'clunk', gain: .6 }, { at: 0.25, sfx: 'whoosh', gain: .5 }, { at: 0.3, sfx: 'click', gain: .8 }, { at: 0.32, sfx: 'pop', gain: .6 });
  ev.push({ at: 'card', sfx: 'tap', gain: .4 }, { at: 'kept', sfx: 'pop', gain: .45 });
  ev.push({ at: 'belief', sfx: 'hum', gain: .25 }, { at: 'bet', sfx: 'tap', gain: .35 });
  ev.push({ at: 'tested', sfx: 'click', gain: .7 }, { at: 'o2', sfx: 'pop', gain: .5 }, { at: 'laps', sfx: 'tap', gain: .4 }, { at: 'laps+0.5', sfx: 'tap', gain: .3 }, { at: 'laps+1.0', sfx: 'tap', gain: .3 });
  ev.push({ at: 'same', sfx: 'clunk', gain: .5 }, { at: 'notair', sfx: 'tap', gain: .45 });
  ev.push({ at: 'rehook', sfx: 'pop', gain: .55 }, { at: 'idea', sfx: 'clunk', gain: .5 }, { at: 'laptop', sfx: 'pop', gain: .45 }, { at: 'warm', sfx: 'hum', gain: .3 }, { at: 'fan', sfx: 'pop', gain: .5 });
  ev.push({ at: 'pull', sfx: 'whoosh', gain: .4 }, { at: 'pull+0.1', sfx: 'hum', gain: .3 }, { at: 'nodis', sfx: 'tap', gain: .3 });
  ev.push({ at: 'people', sfx: 'tap', gain: .4 }, { at: 'people+0.8', sfx: 'tap', gain: .3 }, { at: 'people+1.6', sfx: 'tap', gain: .3 }, { at: 'hot', sfx: 'clunk', gain: .35 }, { at: 'hot+1.5', sfx: 'tap', gain: .4 }, { at: 'fits', sfx: 'pop', gain: .4 });
  ev.push({ at: 'rats', sfx: 'pop', gain: .45 }, { at: 'rats+1.7', sfx: 'click', gain: .5 }, { at: 'drop', sfx: 'whoosh', gain: .3 });
  ev.push({ at: 'mystery', sfx: 'pop', gain: .45 }, { at: 'spread', sfx: 'tap', gain: .35 }, { at: 'why', sfx: 'clunk', gain: .5 });
  ev.push({ at: 'mirror', sfx: 'pop', gain: .4 }, { at: 'best', sfx: 'pop', gain: .4 }, { at: 'idk', sfx: 'tap', gain: .35 });
  ev.push({ at: 'doug', sfx: 'pop', gain: .4 }, { at: 'probably', sfx: 'pop', gain: .45 }, { at: 'probably+0.1', sfx: 'hum', gain: .3 }, { at: 'diy', sfx: 'pop', gain: .35 });
  return ev;
};
