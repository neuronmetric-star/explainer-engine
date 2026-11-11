// Buy, Borrow, Die — scene for the gold-noir engine.
// Each "set" lives at its own x position; camera shots jump between sets on cues.
// Sets: mansion x=0 | portfolio x=20 | tax x=40 | bank x=60 | heirs x=80 | crash x=100 | teacher x=120
window.SCENE = {
  distance: 1.5,
  build(K) {
    const { box, cyl, roof, extrude, group, ring, person, bar, tube, GOLD, RED, BLUE, GREEN, SILVER } = K;
    const S = this.s = {};
    // --- mansion (hook) ---
    const M = group(0, 0, -4);
    box(9, 3.2, 4, 0, 1.6, 0, M); roof(9.8, 1.8, 4.4, 0, 3.2, 0, M);
    for (let i = 0; i < 4; i++) cyl(.18, 3.1, -2.4 + i * 1.6, 1.55, 2.4, M, GOLD, 8);
    box(5.6, .18, .8, 0, 3.2, 2.4, M); box(1.1, 1.9, .1, 0, .95, 2.02, M);
    for (const sx of [-3.6, -2.6, 2.6, 3.6]) for (const sy of [1, 2.3]) box(.6, .75, .08, sx, sy, 2.03, M);
    box(10, .25, 5.4, 0, .12, .4, M);
    person(3.4, 2.2, { tie: true }); ring(1.3, 3.4, 2.2);
    // --- portfolio tower ---
    const P = group(20, 0, -2.5);
    S.BH = [1.2, 1.9, 2.4, 3.3, 4.1, 5.2, 6.4];
    S.bars = S.BH.map((h, i) => bar(.75, .75, -3 + i, 0, P));
    S.chartGeo = new THREE.BufferGeometry(); P.add(new THREE.Line(S.chartGeo, new THREE.LineBasicMaterial({ color: 0xffe9a8 })));
    S.arrow = new THREE.Mesh(new THREE.ConeGeometry(.22, .5, 4), new THREE.MeshBasicMaterial({ color: 0xffe9a8 })); P.add(S.arrow);
    ring(4.4, 20, -2.5);
    S.vP = person(15.9, 1.3, { tie: true });
    // --- tax bars ---
    const T = group(40, 0, -1);
    S.gainBar = bar(1.8, 1.8, -1.6, 0, T); S.taxBar = bar(1.8, 1.8, 1.6, 0, T, RED); ring(3.3, 40, -1);
    // --- bank ---
    const B = group(58, 0, -3);
    box(7.4, .3, 3.6, 0, .15, 0, B); box(6.8, .3, 3.2, 0, .45, 0, B);
    for (let i = 0; i < 5; i++) cyl(.24, 3, -2.8 + i * 1.4, 2.1, 1.1, B, GOLD, 10);
    box(7, .45, 3.2, 0, 3.82, 0, B); roof(7.4, 1.4, 3.2, 0, 4.05, 0, B); box(5.8, 3, 2, 0, 2.1, -.4, B);
    S.vB = person(63.2, 1.2, { tie: true });
    S.cash = []; for (let i = 0; i < 6; i++) { const c = box(.9, .32, .5, 0, 0, 0, undefined, GREEN); c.visible = false; S.cash.push(c); }
    // --- heirs ---
    const D = group(78.4, 0, -1.2);
    const pts = [[-1, 0], [1, 0], [1, 1.8]]; for (let a = 0; a <= 16; a++) pts.push([Math.cos(a / 16 * Math.PI), 1.8 + Math.sin(a / 16 * Math.PI)]); pts.push([-1, 1.8]);
    extrude(pts, .35, 0, 0, 0, D, SILVER); box(2.6, .2, .9, 0, .1, .2, D, SILVER);
    person(81.4, 1.2, { scale: .62 }); person(82.5, 1.6, { scale: .55 });
    const D2 = group(85, 0, -2.6); S.dBars = [1.4, 2.4, 3.4, 4.6].map((h, i) => { const b = bar(.6, .6, -1.2 + i * .8, 0, D2); b.userData.h = h; return b; });
    // --- crash chart ---
    const C = group(100, 0, -2); const cp = [];
    for (let i = 0; i <= 40; i++) { let y = 1.2 + i * .11 + Math.sin(i * 1.3) * .25; if (i > 28) y = 1.2 + 28 * .11 - (i - 28) * .38 + Math.sin(i * 2.1) * .15; cp.push([-5 + i * .25, Math.max(.3, y), 0]); }
    S.crash = tube(cp, 0xffd15a, .07, C);
    { const g = new THREE.BufferGeometry(); const p = []; for (let i = 0; i < 6; i++) p.push(-5, i * 1.1 + .3, 0, 5, i * 1.1 + .3, 0); g.setAttribute('position', new THREE.Float32BufferAttribute(p, 3)); C.add(new THREE.LineSegments(g, new THREE.LineBasicMaterial({ color: 0x2b2416 }))); }
    S.vC = person(101.8, 2.2, { tie: true });
    // --- teacher ---
    const R = group(122.6, 0, -2.4);
    box(3.6, 2.2, 3, 0, 1.1, 0, R, BLUE); roof(4.2, 1.6, 3.2, 0, 2.2, 0, R, BLUE); box(.8, 1.3, .08, 0, .65, 1.52, R, BLUE);
    const hole = box(1.1, .08, 1.1, .9, 3.05, .2, R, RED); hole.rotation.z = -.65;
    S.teacher = person(118.6, 1.4);
  },

  // [cue, camera position, look-at target, dolly drift]
  shots: [
    [0,          [6.2, 3.0, 11.5],  [1.4, 2.2, -.5], 1.2],
    ['dontsell', [4.8, 2.6, 8.6],   [2.4, 2.0, 0],    .8],
    ['how',      [22.5, 4.4, 13.5], [18.6, 3, -1.2], 1.4],
    ['sells',    [40, 3.8, 11],     [40, 2.6, -1],   1.0],
    ['step1',    [21, 3.2, 9.5],    [18.2, 2.6, -.8],1.2],
    ['step2',    [65, 3.8, 12.5],   [60.6, 2.2, -1], 1.2],
    ['interest', [19.5, 3.6, 10.5], [18.5, 3.0, -1], 1.0],
    ['step3',    [83, 3.2, 10.5],   [80.8, 1.8, -.6],1.0],
    ['repeat',   [60, 4.2, 13],     [60.5, 2, -1],    .8],
    ['risk',     [100.4, 3.2, 10.5],[100, 2.4, -1.5],1.0],
    ['teacher',  [121.4, 3.0, 10.5],[120.6, 1.9, -1],1.0],
    ['math',     [21.5, 2.2, 14],   [18.5, 4.2, -1],  .6],
    ['cta',      [19.5, 3.2, 12],   [17.8, 3.4, -1],  .8],
  ],

  // floating info cards: anchored to a 3D point, shown between two cues
  cards: [
    { l: 'Income tax paid', v: 'BARELY ANY', cls: 'red', a: [3.4, 4.3, 2.2], t0: 'hook+1.4', t1: 'dontsell' },
    { v: 'SELL ✕', cls: 'red big', a: [2.6, 3.8, 1], t0: 'dontsell', t1: 'borrow' },
    { v: 'BORROW ✓', cls: 'big', a: [2.6, 3.8, 1], t0: 'borrow', t1: 'how+0.2' },
    { v: 'VICTOR', cls: 'tag white', a: [15.9, 3.1, 1.3], t0: 'owns', t1: 'sells' },
    { l: 'Portfolio', v: '$0', a: [20, 8.2, -2.5], t0: 'how+0.3', t1: 'sells', count: [0, 100000000, 'owns', 1.6] },
    { l: 'He paid', v: '$1,000,000', cls: 'white', a: [16.2, 5.6, -1], t0: 'paid+0.2', t1: 'sells' },
    { l: 'Gain', v: '$99,000,000', a: [38.4, 7.6, -1], t0: 'sells+0.4', t1: 'step1' },
    { l: 'Federal rate', v: '23.8%', cls: 'red', a: [42.4, 7.4, -1], t0: 'rate', t1: 'step1' },
    { l: 'Tax bill', v: '$0', cls: 'red big', a: [40, 5.0, 1.5], t0: 'gone', t1: 'step1', count: [0, 23562000, 'gone', 1.2], neg: true },
    { v: 'VICTOR', cls: 'tag white', a: [15.9, 3.1, 1.3], t0: 'step1+0.2', t1: 'step2' },
    { l: 'Shares sold', v: '0', cls: 'big', a: [20, 8.6, -2.5], t0: 'never+1.0', t1: 'step2' },
    { v: 'BANK', cls: 'tag', a: [58, 6.2, -3], t0: 'step2+0.2', t1: 'notax+0.6' },
    { l: 'Loan', v: '$10,000,000', a: [63.2, 4.4, 1.2], t0: 'lends+0.8', t1: 'interest' },
    { l: 'Tax on loan', v: '$0', cls: 'big', a: [58.6, 6.3, -1], t0: 'notax+0.6', t1: 'interest' },
    { l: 'Interest', v: 'A FEW %', cls: 'white', a: [15.4, 4.6, 1.3], t0: 'interest+0.2', t1: 'step3' },
    { l: 'Portfolio', v: '', a: [20.5, 7.4, -2.5], t0: 'interest+0.2', t1: 'step3', count: [100000000, 140000000, 'interest+0.2', 2.6] },
    { v: 'R.I.P. VICTOR', cls: 'tag white', a: [78.4, 4.1, -1.2], t0: 'dies', t1: 'basis' },
    { v: 'HEIRS', cls: 'tag', a: [82, 3.0, 1.4], t0: 'dies+1.2', t1: 'repeat' },
    { l: 'Cost basis', v: '$1,000,000', a: [85, 5.4, -2.6], t0: 'basis', t1: 'decades+0.2', flip: ['basis+1.1', '$140,000,000'] },
    { l: 'Tax on decades of gains', v: '$0', cls: 'big', a: [81, 5.2, -1], t0: 'decades', t1: 'repeat' },
    { l: 'Loan', v: 'PAID OFF', a: [60.6, 7.4, -1], t0: 'repeat+0.6', t1: 'repeat+3.0' },
    { v: '↻ REPEAT', cls: 'big', a: [60.6, 7.4, -1], t0: 'repeat+3.0', t1: 'risk' },
    { v: 'ONE RISK', cls: 'red big', a: [100, 6.8, -2], t0: 'risk', t1: 'crash' },
    { l: 'Bank', v: 'MARGIN CALL', cls: 'red', a: [100, 6.6, -2], t0: 'crash+1.2', t1: 'teacher' },
    { v: 'TEACHER', cls: 'tag white', a: [118.6, 3.55, 1.4], t0: 'teacher', t1: 'math' },
    { l: 'Sells', v: '$5,000', cls: 'white', a: [118.6, 5.1, 1.4], t0: 'sells5k', t1: 'math' },
    { l: 'Tax on her gain', v: 'TAXED', cls: 'red', a: [122.6, 6.6, -2.4], t0: 'ttax', t1: 'math' },
  ],

  steps: { title: 'THE TRICK', labels: ['BUY', 'BORROW', 'DIE'], marks: ['step1', 'step2', 'step3'], from: 'step1', to: 'risk' },
  receipt: { from: 'math', to: 'cta', title: 'THE MATH', rows: [
    ['STOCK OWNED', '$100,000,000'], ['SHARES SOLD', '0'], ['CASH BORROWED', '$10,000,000'],
    ['TAX ON LOAN', '$0', 'g'], ['TAX ON GAINS', '$0', 'g'], ["TEACHER'S $5K SALE", 'TAXED', 'k']] },
  follow: { from: 'cta+0.2', title: 'MORE TRICKS OF THE RICH' },
  shakes: [['gone', .5, .12], ['crash+0.6', 1.2, .18]],
  flashes: [['gone+0.1', .4, .22], ['crash+0.6', .5, .25]],

  update(t, K) {
    const { at, ease, easeOut, clamp01, setBar, fly, hop, drawTube } = K, S = this.s;
    // portfolio grows on "owns", grows more during "interest"
    const g0 = easeOut(clamp01((t - at('owns')) / 1.4));
    const more = 1 + .28 * ease(clamp01((t - at('interest')) / 2.8)) + .06 * ease(clamp01((t - at('never')) / 2));
    const hs = S.BH.map((h, i) => h * ease(clamp01(g0 * 1.6 - i * .09)) * more);
    S.bars.forEach((b, i) => setBar(b, hs[i]));
    const pts = hs.map((h, i) => new THREE.Vector3(-3 + i, Math.max(.02, h) + .35, 0)); S.chartGeo.setFromPoints(pts);
    const a = pts[6], b = pts[5]; S.arrow.position.copy(a).add(new THREE.Vector3(.25, .2, 0)); S.arrow.rotation.z = -Math.atan2(a.x - b.x, a.y - b.y); S.arrow.visible = g0 > .8;
    // tax bars
    setBar(S.gainBar, easeOut(clamp01((t - at('sells') - .2) / 1)) * 6.4);
    setBar(S.taxBar, easeOut(clamp01((t - at('rate')) / 1)) * 6.4 * .238 + easeOut(clamp01((t - at('gone')) / .6)) * .6);
    // cash: bank -> Victor on "lends", back on "repeat"
    const bank = new THREE.Vector3(58, 1.2, -1.2), vic = new THREE.Vector3(63.2, 1.1, 1.6);
    for (let i = 0; i < 4; i++) fly(S.cash[i], t, at('lends') + .3 + i * .35, .9, bank, vic);
    for (let i = 4; i < 6; i++) fly(S.cash[i], t, at('repeat') + .8 + (i - 4) * .4, .9, vic, bank);
    // heirs' portfolio
    S.dBars.forEach((b, i) => setBar(b, easeOut(clamp01((t - at('dies') - .8 - i * .12) / .8)) * b.userData.h));
    // crash chart: draws up on "risk", plunges on "crash"
    const f = t < at('risk') ? 0 : t < at('crash') ? .72 * easeOut(clamp01((t - at('risk')) / 1.6)) : .72 + .28 * easeOut(clamp01((t - at('crash') - .3) / 1));
    drawTube(S.crash, f); S.crash.material.color.setHex(t > at('crash') + .6 ? 0xff3a2c : 0xffd15a);
    // little reactions
    hop(S.vP, t, 'owns+1.6'); hop(S.vB, t, 'lends+1.8');
    S.vC.rotation.z = t > at('crash') + .6 ? Math.sin(t * 30) * .04 * clamp01(1 - (t - at('crash') - .6) / 1.2) : 0;
    S.teacher.rotation.z = -.08 * ease(clamp01((t - at('ttax')) / .4));
  },
};
