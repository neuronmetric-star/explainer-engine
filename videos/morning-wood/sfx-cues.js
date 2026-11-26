// Sound effects for morning-wood. Build: node tools/sfx.js morning-wood
module.exports = ({ T, word }) => {
  const ev = [];
  for (const c of ['belief', 'tested', 'age', 'idea', 'count', 'stamps', 'oxy', 'mirror']) ev.push({ at: T(c) - .05, sfx: 'whoosh', gain: .35 });
  ev.push({ at: 0, sfx: 'clunk', gain: .6 }, { at: 0.25, sfx: 'whoosh', gain: .5 }, { at: 0.3, sfx: 'click', gain: .8 }, { at: 0.32, sfx: 'pop', gain: .6 });
  ev.push({ at: 'card', sfx: 'tap', gain: .4 }, { at: 'kept', sfx: 'pop', gain: .45 });
  ev.push({ at: 'belief', sfx: 'hum', gain: .25 }, { at: 'bet', sfx: 'tap', gain: .35 });
  ev.push({ at: 'tested', sfx: 'click', gain: .7 }, { at: 'watch', sfx: 'tap', gain: .4 }, { at: 'age', sfx: 'pop', gain: .5 }, { at: 'notdream', sfx: 'clunk', gain: .5 });
  ev.push({ at: 'rehook', sfx: 'pop', gain: .55 }, { at: 'idea', sfx: 'clunk', gain: .55 }, { at: 'hose', sfx: 'tap', gain: .4 }, { at: 'rem', sfx: 'whoosh', gain: .45 }, { at: 'rem+0.2', sfx: 'hum', gain: .3 }, { at: 'nodis', sfx: 'tap', gain: .3 });
  ev.push({ at: 'count', sfx: 'pop', gain: .45 }, { at: 'count+0.6', sfx: 'tap', gain: .3 }, { at: 'count+1.2', sfx: 'tap', gain: .3 }, { at: 'people', sfx: 'tap', gain: .4 }, { at: 'people+1.6', sfx: 'tap', gain: .35 }, { at: 'fits', sfx: 'pop', gain: .45 });
  ev.push({ at: 'stamps', sfx: 'click', gain: .6 }, { at: 'torn', sfx: 'whoosh', gain: .5 }, { at: 'torn+0.05', sfx: 'click', gain: .7 }, { at: 'results', sfx: 'tap', gain: .4 }, { at: 'results+1.8', sfx: 'clunk', gain: .35 });
  ev.push({ at: 'oxy', sfx: 'pop', gain: .45 }, { at: 'oxy+1.8', sfx: 'pop', gain: .4 });
  ev.push({ at: 'mirror', sfx: 'pop', gain: .4 }, { at: 'best', sfx: 'pop', gain: .4 }, { at: 'idk', sfx: 'clunk', gain: .45 });
  ev.push({ at: 'doug', sfx: 'pop', gain: .4 }, { at: 'probably', sfx: 'pop', gain: .45 }, { at: 'probably+0.1', sfx: 'hum', gain: .3 }, { at: 'diy', sfx: 'pop', gain: .35 });
  return ev;
};
