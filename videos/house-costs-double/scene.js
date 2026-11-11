// Why a $400,000 house costs over $860,000 — mortgage interest explained.
// Sets: hook tower x=0 | Maya + loan x=20 | payment split x=40 | balance x=60 | amortization x=80 | totals x=100 | nurse x=120
// Loan math: $320,000, 30y fixed, 7.18% -> $2,167.79/mo, $460,405 total interest (see sources.md).
window.SCENE = {
  distance: 1.5,
  build(K) {
    const { box, cyl, roof, group, ring, person, bar, tube, GOLD, RED, BLUE, GREEN, WHITE } = K;
    const S = this.s = {};
    // ---- amortization schedule (yearly) ----
    const L = 320000, r = .0718 / 12, pay = L * r / (1 - Math.pow(1 + r, -360));
    let b = L; S.bal = [L]; S.yi = []; S.yp = [];
    for (let y = 0; y < 30; y++) { let I = 0, P = 0; for (let m = 0; m < 12; m++) { const i = b * r; I += i; P += pay - i; b -= pay - i; } S.yi.push(I); S.yp.push(P); S.bal.push(Math.max(0, b)); }

    // --- hook: house + price tower ---
    const A = group(0, 0, -1);
    box(3.2, 2.2, 3, -2.2, 1.1, 0, A); roof(3.8, 1.6, 3.2, -2.2, 2.2, 0, A);
    box(.8, 1.3, .08, -2.2, .65, 1.52, A); box(.6, .6, .08, -3.2, 1.3, 1.52, A); box(.6, .6, .08, -1.2, 1.3, 1.52, A);
    S.priceBar = bar(1.6, 1.6, 1.9, 0, A, GOLD);
    S.intBar = bar(1.6, 1.6, 1.9, 0, A, RED);
    ring(2.2, 1.9, -1, GOLD);

    // --- Maya buys ---
    const B = group(20, 0, -1.5);
    box(2.6, 1.8, 2.4, 1.2, .9, 0, B); roof(3.1, 1.3, 2.6, 1.2, 1.8, 0, B); box(.7, 1.1, .08, 1.2, .55, 1.22, B);
    S.maya = person(17.2, 1.2); ring(1.1, 17.2, 1.2, WHITE);
    S.cashB = []; for (let i = 0; i < 4; i++) S.cashB.push(box(.9, .3, .5, 17.2 + 1.0, .15 + i * .32, 1.6, undefined, GREEN));
    S.loanBar = bar(1.1, 1.1, 3.4, -1.6, B, GOLD);

    // --- payment + split ---
    const C = group(42.6, 0, -3.2);
    box(5, .3, 2.6, 0, .15, 0, C); for (let i = 0; i < 4; i++) cyl(.2, 2.6, -1.8 + i * 1.2, 1.6, .9, C, GOLD, 10);
    box(5.2, .35, 2.6, 0, 3.05, 0, C); roof(5.4, 1.1, 2.6, 0, 3.22, 0, C); box(4.4, 2.6, 1.4, 0, 1.6, -.4, C);
    S.mayaC = person(37.4, 1.4); ring(1.1, 37.4, 1.4, WHITE);
    S.coins = []; for (let i = 0; i < 10; i++) { const c = cyl(.32, .09, 0, 0, 0, undefined, GOLD, 16); c.rotation.x = Math.PI / 2; c.visible = false; S.coins.push(c); }
    S.splitI = bar(1.4, 1.4, 39.4, 1.6, undefined, RED);
    S.splitP = bar(1.4, 1.4, 41.4, 1.6, undefined, GOLD);

    // --- balance over the years ---
    S.balBars = []; for (let y = 0; y < 30; y++) S.balBars.push(bar(.2, .5, 56.1 + y * .27, -1, undefined, y < 10 ? RED : GOLD));
    S.yearMark = box(.04, 6.6, .04, 56.1 + 9.5 * .27, 3.3, -1, undefined, WHITE); S.yearMark.visible = false;

    // --- amortization: interest vs principal per year ---
    S.amI = []; S.amP = [];
    for (let y = 0; y < 30; y++) { S.amI.push(bar(.2, .5, 76.1 + y * .27, -1, undefined, RED)); S.amP.push(bar(.2, .5, 76.1 + y * .27, -1, undefined, GOLD)); }

    // --- totals: borrowed vs paid back ---
    S.tBorrow = bar(1.6, 1.6, 98.2, -1, undefined, GOLD);
    S.tBase = bar(1.6, 1.6, 101.6, -1, undefined, GOLD);
    S.tInt = bar(1.6, 1.6, 101.6, -1, undefined, RED);
    ring(3.2, 99.9, -1, GOLD);

    // --- nurse (blue world) ---
    const N = group(122.4, 0, -2.4);
    box(2.6, 1.8, 2.4, 0, .9, 0, N, BLUE); roof(3.1, 1.3, 2.6, 0, 1.8, 0, N, BLUE); box(.7, 1.1, .08, 0, .55, 1.22, N, BLUE);
    S.nurse = person(118.2, 1.2, { color: 0xbfd7ff }); ring(1.1, 118.2, 1.2, BLUE);
    S.lineMaya = box(1, .32, .32, 0, 0, 0, undefined, GOLD);
    S.lineNurse = box(1, .32, .32, 0, 0, 0, undefined, BLUE);
  },

  shots: [
    [0,           [2.6, 3.0, 11.5],  [0.0, 3.0, -1],   1.4],
    ['reframe+1', [2.4, 3.8, 10.5],  [0.8, 3.6, -1],    .8],
    ['setup',     [21.0, 2.8, 11.0], [20.2, 2.2, -1],  1.2],
    ['step1',     [40.2, 3.2, 11.5], [40, 2.4, -1.5],  1.2],
    ['split',     [40.0, 2.6, 11.5], [39.8, 2.4, 0],    .8],
    ['step3',     [60.2, 3.6, 11.5], [60.2, 3.4, -1],   .8],
    ['catch',     [80.2, 3.8, 11.5], [80.2, 3.6, -1],   .8],
    ['math',      [100.0, 3.4, 12],  [99.9, 3.4, -1],   .8],
    ['contrast',  [120.4, 3.4, 11.5],[120.2, 3.2, -1], 1.0],
    ['punch',     [1.4, 2.4, 12.5],  [-0.2, 2.8, -1],   .8],
  ],

  cards: [
    // hook
    { l: 'House price', v: '$400,000', a: [1.9, 4.5, 0], t0: 0.25, t1: 'hook+2.6' },
    { l: 'What you really pay', v: '$400,000', cls: 'red big', a: [1.9, 8.9, -1], t0: 'hook+2.6', t1: 'reframe+1', count: [400000, 860405, 'hook+2.7', 2.2] },
    { v: 'NOT THE HOUSE', cls: 'white', a: [-2.2, 5.2, -1], t0: 'reframe', t1: 'how' },
    { l: 'Interest', v: '$460,405', cls: 'red', a: [1.9, 8.6, -1], t0: 'reframe+1', t1: 'setup' },
    // Maya
    { v: 'MAYA', cls: 'tag white', a: [17.2, 3.0, 1.2], t0: 'setup', t1: 'loan' },
    { l: 'Down payment', v: '$80,000', cls: 'green', a: [18.3, 4.6, 1.6], t0: 'down', t1: 'loan' },
    { l: 'Loan', v: '$320,000', a: [23.4, 5.4, -3], t0: 'loan+0.3', t1: 'step1' },
    { l: '30 years at', v: '7.18%', cls: 'red', a: [17.6, 4.3, 1.2], t0: 'loan+2.2', t1: 'step1' },
    // payment + split
    { l: 'Every month', v: '$2,168', cls: 'big', a: [40, 6.6, -1], t0: 'pay', t1: 'split' },
    { l: 'Interest', v: '$1,915', cls: 'red', a: [39.4, 5.2, 1.6], t0: 'split+0.3', t1: 'step3' },
    { l: 'Your house', v: '$253', a: [42.2, 2.2, 1.6], t0: 'principal', t1: 'step3' },
    // balance
    { l: 'Balance owed', v: '$320,000', a: [58.8, 7.2, -1], t0: 'step3+0.3', t1: 'catch', count: [320000, 275751, 'tenyears', 1.6] },
    { l: 'After 10 years', v: 'STILL OWES', cls: 'red', a: [61.2, 4.2, 1], t0: 'owes', t1: 'catch' },
    // amortization
    { v: 'THE CATCH', cls: 'red big', a: [80.2, 8.6, -1], t0: 'catch', t1: 'why+1' },
    { l: 'Early years', v: 'INTEREST', cls: 'red', a: [77.8, 8.0, -1], t0: 'why+2.2', t1: 'math' },
    { l: 'Late years', v: 'PRINCIPAL', a: [83.4, 4.0, 1], t0: 'why+3.6', t1: 'math' },
    // totals
    { l: 'Borrowed', v: '$320,000', cls: 'white', a: [98.2, 3.9, 0], t0: 'math+0.4', t1: 'contrast' },
    { l: '360 payments', v: '$0', a: [101.6, 8.6, -1], t0: 'total', t1: 'interest', count: [0, 780405, 'total', 1.6] },
    { l: 'Pure interest', v: '$460,405', cls: 'red big', a: [100.6, 8.6, -1], t0: 'interest', t1: 'contrast' },
    // nurse
    { v: 'NURSE', cls: 'tag white', a: [118.2, 3.0, 1.2], t0: 'contrast', t1: 'saves' },
    { l: 'Extra each month', v: '+$200', cls: 'blue', a: [121.8, 3.6, 0], t0: 'contrast+2.2', t1: 'saves' },
    { v: 'MAYA · 30 YRS', cls: 'tag white', a: [119.6, 6.95, -1], t0: 'contrast+1.4', t1: 'punch' },
    { v: 'NURSE · 23 YRS', cls: 'tag', a: [119.4, 4.75, -1], t0: 'saves+0.6', t1: 'punch' },
    { l: 'Interest saved', v: '$124,089', cls: 'big', a: [120.2, 3.4, 1], t0: 'saves+1.6', t1: 'punch' },
    // punch
    { v: 'IT RENTED YOU MONEY', cls: 'red', a: [0.4, 1.2, 1], t0: 'rent', t1: 'cta' },
  ],

  steps: { title: 'HOW IT WORKS', labels: ['PAYMENT', 'SPLIT', 'BALANCE'], marks: ['step1', 'step2', 'step3'], from: 'step1', to: 'catch' },
  receipt: { from: 'punch', to: 'cta', title: 'THE MATH', rows: [
    ['HOUSE PRICE', '$400,000'], ['DOWN PAYMENT', '$80,000'], ['BORROWED', '$320,000'],
    ['360 PAYMENTS', '$780,405'], ['INTEREST', '$460,405'], ['TOTAL COST', '$860,405', 'k']] },
  follow: { from: 'cta+0.2', title: 'MORE MONEY MATH' },
  shakes: [['reframe+1', .4, .08]],
  flashes: [['reframe+1', .35, .18], ['saves+1.6', .35, .15]],

  update(t, K) {
    const { at, T, ease, easeOut, clamp01, setBar, fly, hop } = K, S = this.s;
    const U = 1 / 110000;                                   // dollars -> height for towers (hook & totals)
    // hook tower: gold price rises immediately, red interest stacks on top
    setBar(S.priceBar, .3 + (400000 * U - .3) * easeOut(clamp01(t / 1.4)));
    const ih = 460405 * U * easeOut(clamp01((t - T('hook+2.7')) / 2.2));
    S.intBar.scale.y = Math.max(.02, ih); S.intBar.position.y = 400000 * U + S.intBar.scale.y / 2; S.intBar.visible = ih > .03;
    // Maya: cash flies to house on "down", loan bar grows on "loan"
    const home = new THREE.Vector3(21.2, .4, 0);
    S.cashB.forEach((c, i) => { const st = at('down') + .3 + i * .25; if (t < st) { c.visible = true; c.position.set(18.2, .15 + i * .32, 1.6); } else fly(c, t, st, .8, new THREE.Vector3(18.2, .15 + i * .32, 1.6), home, 1.6); });
    setBar(S.loanBar, 320000 * U * 1.6 * easeOut(clamp01((t - T('loan+0.2')) / 1.2)));
    hop(S.maya, t, 'setup+0.1');
    // coins: monthly payments flying to the bank
    const from = new THREE.Vector3(37.6, 1.6, 1.4), to = new THREE.Vector3(42.6, 1.2, -1.8);
    S.coins.forEach((c, i) => { const st = at('pay') + i * .55; fly(c, t, st, .9, from, to, 1.8); if (t > at('split') - .1) c.visible = false; c.rotation.x = Math.PI / 2; });
    // split bars
    const sp = easeOut(clamp01((t - T('split+0.2')) / 1.0));
    setBar(S.splitI, 1915 / 550 * sp); setBar(S.splitP, 253 / 550 * easeOut(clamp01((t - at('principal')) / .6)));
    S.splitI.visible = t > at('split'); S.splitP.visible = t > at('principal');
    // balance bars: years appear one by one, first 10 before "owes", the rest during "catch"
    const shown = 10 * clamp01((t - T('step3+0.3')) / 3.6);
    S.balBars.forEach((bb, y) => { const k = clamp01(shown - y); setBar(bb, S.bal[y + 1] / 50000 * easeOut(k)); bb.visible = k > 0; });
    S.yearMark.visible = t > at('owes');
    // amortization chart sweeps left to right during "why"
    const sw = 30 * clamp01((t - T('catch+0.4')) / 6.5);
    for (let y = 0; y < 30; y++) { const k = easeOut(clamp01(sw - y)); const hi = S.yi[y] / 4500 * k, hp = S.yp[y] / 4500 * k;
      setBar(S.amI[y], hi); S.amP[y].scale.y = Math.max(.02, hp); S.amP[y].position.y = Math.max(.02, hi) + S.amP[y].scale.y / 2;
      S.amI[y].visible = S.amP[y].visible = k > 0; }
    // totals
    setBar(S.tBorrow, 320000 * U * easeOut(clamp01((t - T('math+0.3')) / 1)));
    setBar(S.tBase, 320000 * U * easeOut(clamp01((t - at('total')) / 1)));
    const ti = 460405 * U * easeOut(clamp01((t - T('total+0.8')) / 1.6));
    S.tInt.scale.y = Math.max(.02, ti); S.tInt.position.y = S.tBase.scale.y + S.tInt.scale.y / 2; S.tInt.visible = ti > .03;
    // nurse: two timelines — 30 years vs 23.2 years
    const LEN = 7.2, gm = easeOut(clamp01((t - T('contrast+0.6')) / 1.6)), gn = easeOut(clamp01((t - at('saves')) / 1.4));
    S.lineMaya.scale.x = Math.max(.02, LEN * gm); S.lineMaya.position.set(116.6 + S.lineMaya.scale.x / 2, 6.2, -1); S.lineMaya.visible = gm > 0;
    S.lineNurse.scale.x = Math.max(.02, LEN * 23.2 / 30 * gn); S.lineNurse.position.set(116.6 + S.lineNurse.scale.x / 2, 5.5, -1); S.lineNurse.visible = gn > 0;
    hop(S.nurse, t, 'saves+1.6');
  },
};
