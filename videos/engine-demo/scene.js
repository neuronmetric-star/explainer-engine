window.SCENE = {
  autoWhoosh: true,
  panels: [
    { img: 'img/01.jpg', at: 0, fade: 0, origin: [50, 22], move: { zoom: [1.9, 1.04], y: [40, 0] }, fx: 'pulse', parts: { n: 22, speed: .8 },
      layers: [{ img: 'img/ticket.png', s: [800, 1000], w: 300, depth: 2.2, bob: 18, in: ['hook+1.9', 500, .45] }] },
    { img: 'img/02.jpg', at: 'feb', origin: [50, 28], move: { zoom: [1.18, 1.04] } },
    { img: 'img/03.jpg', at: 'strange', origin: [48, 30], move: { zoom: [1.4, 1.55] } },
    { img: 'img/04.jpg', at: 'blocks', origin: [55, 40], move: { zoom: [1.12, 1.32], x: [0, -30] }, parts: { n: 14, speed: 1.2 } },
    { img: 'img/05.jpg', at: 'grocery', origin: [50, 18], move: { zoom: [1.7, 1.9], x: [30, -30] } },
  ],
  cards: [
    { l: 'ONE DRAWING', v: '5,000,000', cls: 'big', s: [540, 980], t0: 'hook+1.9', t1: 'feb', count: [0, 5000000, 'hook+1.9', .9], fmt: n => Math.round(n).toLocaleString('en-US') },
  ],
  sfx: [['hook+1.9', 'riser', .6], ['one', 'hit', .9], ['feb+1.6', 'cash', .8], ['strange', 'tick', 1], ['strange+0.5', 'tick', 1], ['blocks+0.3', 'pop', .8]],
  shakes: [['one', .35, .25]],
};
