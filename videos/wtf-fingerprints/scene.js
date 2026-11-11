// Scene template — see videos/buy-borrow-die/scene.js for a full example and CLAUDE.md for the API.
window.SCENE = {
  distance: 1.5,                       // camera distance multiplier (bigger = wider)
  build(K) {
    const S = this.s = {};
    // set 1 at x=0: hook image
    S.host = K.person(2, 1.5, { tie: true }); K.ring(1.3, 2, 1.5);
    S.tower = K.bar(1.2, 1.2, -1.5, -1);
    // set 2 at x=20, set 3 at x=40 ...
  },
  shots: [
    // [cue or seconds, [camera x,y,z], [look-at x,y,z], dolly drift]
    [0, [5, 3, 11], [0.5, 2, -0.5], 1.2],
    ['step1', [24, 3.5, 11], [20, 2.4, -1], 1.0],
  ],
  cards: [
    // { l:'Label', v:'Value', cls:'red|white|green|big|tag', a:[x,y,z], t0:'cue', t1:'cue+2', count:[from,to,'cue',secs] }
    { l: 'Example', v: '$0', a: [0, 6, -1], t0: 'hook+1', t1: 'step1', count: [0, 1000000, 'hook+1', 1.5] },
  ],
  steps: { title: 'THE TRICK', labels: ['ONE', 'TWO'], marks: ['step1', 'step2'], from: 'step1', to: 'catch' },
  receipt: { from: 'punch', to: 'cta', title: 'THE MATH', rows: [['ROW', '$0'], ['GOOD', '$0', 'g'], ['BAD', 'TAXED', 'k']] },
  follow: { from: 'cta+0.2', title: 'MORE TRICKS OF THE RICH' },
  shakes: [], flashes: [],
  update(t, K) {
    const S = this.s;
    K.setBar(S.tower, 0.2 + 5 * K.easeOut(K.prog(t, 'setup', 1.4)));
  },
};
