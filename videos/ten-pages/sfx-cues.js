// ten-pages sound effects: whooshes on cuts, pops on props, footsteps, the timer.
module.exports = ({ T, word }) => {
  const cuts = ['tonight', 'notfifty', 'week', 'month', 'year', 'total', 'books', 'how', 'promise', 'five', 'phone', 'across', 'pick', 'give', 'halfway', 'next', 'turn', 'three', 'bookmark', 'four', 'pressure', 'trick', 'cta'];
  const ev = cuts.map(c => ({ at: c, sfx: 'whoosh', gain: .35 }));
  ev.push({ at: 'tonight+0.05', sfx: 'pop', gain: .6 });
  ev.push({ at: word('hundred', 'notfifty'), sfx: 'clunk', gain: .9 }, { at: word('fifty', 'notfifty'), sfx: 'clunk', gain: .5 }, { at: word('ten', 'notfifty'), sfx: 'pop', gain: .7 });
  for (let i = 0; i < 7; i++) ev.push({ at: T('week') + .25 + i * .3, sfx: 'tap', gain: .5 });
  ev.push({ at: word('book', 'month'), sfx: 'pop', gain: .7 });
  for (let i = 0; i < 13; i++) ev.push({ at: T('total') + i * .18, sfx: 'tap', gain: .35 });
  ev.push({ at: 'books+0.05', sfx: 'pop', gain: .8 });
  for (let i = 0; i < 4; i++) ev.push({ at: T('how') + i * .32, sfx: 'step', gain: .45 });
  ev.push({ at: 'five', sfx: 'pop', gain: .6 }, { at: 'five+0.4', sfx: 'click', gain: .5 });
  ev.push({ at: 'phone+0.6', sfx: 'click', gain: .6 });
  for (let i = 0; i < 3; i++) ev.push({ at: T('leave') + .25 + i * .3, sfx: 'step', gain: .45 });
  for (let i = 0; i < 6; i++) ev.push({ at: T('across') + i * .3, sfx: 'step', gain: .4 });
  ev.push({ at: 'give+0.3', sfx: 'pop', gain: .4 });
  ev.push({ at: 'next+0.1', sfx: 'beep', gain: .7 }, { at: 'next+0.45', sfx: 'beep', gain: .7 }, { at: 'next+0.8', sfx: 'beep', gain: .7 });
  ev.push({ at: 'bookmark+0.6', sfx: 'tap', gain: .6 });
  ev.push({ at: 'pressure+0.4', sfx: 'whoosh', gain: .6 });
  ev.push({ at: 'cta+0.3', sfx: 'pop', gain: .7 }, { at: 'cta+1.8', sfx: 'click', gain: .8 });
  return ev;
};
