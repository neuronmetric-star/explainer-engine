window.SCENE = {
  panels: [
    // start tight on the man in the hat, pull back to reveal the mountain of tickets
    { img: 'img/01.png', at: 0, fade: 0, origin: [50, 22], move: { zoom: [1.9, 1.04], y: [40, 0] }, fx: 'pulse', parts: { n: 22, speed: .8 } },
  ],
  shakes: [['one', .35, .25]],
  flashes: [],
  cards: [],
};
