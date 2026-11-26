// Nvidia CEO scandal — first "solid shapes" video (gold-noir colors, shaded solid objects).
// Sets: chip x=0 | Denny's x=20 | value tower x=40 | newspaper x=60 | memo x=80 | stock chart x=100 |
//       twist x=120 | Congress x=140 | nurse x=160
// Real person: faceless figure only, every allegation worded as reported (see script + sources.md).
window.SCENE = {
  distance: 1.5,
  tone: false,          // no filmic tone mapping: keep gold/red saturated
  build(K) {
    const { solid, group, person, ring } = K;
    const S = this.s = {};
    const B = (w, h, d, x, y, z, c, p, o) => { const m = solid(new THREE.BoxGeometry(w, h, d), c, p, o); m.position.set(x, y, z); return m; };
    const C = (r, h, x, y, z, c, p, o, seg = 32) => { const m = solid(new THREE.CylinderGeometry(r, r, h, seg), c, p, o); m.position.set(x, y, z); return m; };
    const GOLD = 0xc98f1c, BLACK = 0x15171a, RED = 0xc4140c, WHITE = 0xd8d8d4, BLUE = 0x5a86d0;
    S.chipFn = (p, s = 1) => { const g = group(0, 0, 0, p); g.scale.setScalar(s);
      B(3.2, .22, 3.2, 0, 0, 0, 0x2a7a3a, g, { metal: .2 });                       // green board
      B(2.4, .22, 2.4, 0, .22, 0, BLACK, g, { metal: .6, rough: .35 });              // package
      B(1.3, .08, 1.3, 0, .37, 0, GOLD, g, { metal: .9, rough: .25, glow: .25 });   // die
      for (let i = 0; i < 10; i++) for (const [sx, sz, rx] of [[1, 0, 0], [-1, 0, 0], [0, 1, 1], [0, -1, 1]]) {
        const pin = B(rx ? .1 : .3, .05, rx ? .3 : .1, sx ? sx * 1.32 : -1.05 + i * .233, .16, sz ? sz * 1.32 : -1.05 + i * .233, GOLD, g, { metal: .9, rough: .3 }); }
      return g; };

    // --- A: hero chip + Jensen ---
    S.chip = S.chipFn(group(0, 3.4, -1), 1.6); S.chipG = S.chip.parent;
    S.jensen = person(2.6, 1.6, { color: 0x2b2b2e }); S.jensen.visible = false; ring(1.2, 2.6, 1.6);

    // --- B: Denny's: dish station (age 15) + booth (age 30) ---
    const D = group(20, 0, -1);
    B(2.2, 1.0, 1.0, -2.6, .5, -.6, 0x9aa3ab, D, { metal: .6 });                     // sink counter
    S.plates = []; for (let i = 0; i < 6; i++) S.plates.push(C(.32, .05, -2.9 + (i % 2) * .6, 1.05 + Math.floor(i / 2) * .07, -.6, WHITE, D));
    S.teen = person(17.4, 0.2, { scale: .82 });
    B(2.6, .08, 1.3, 2.0, 1.0, -.4, 0xf2e8d0, D); C(.08, 1.0, 2.0, .5, -.4, 0x8a8f96, D, { metal: .7 });   // table
    for (const z of [-1.4, .6]) { B(2.6, .5, .7, 2.0, .25, z, 0xb3322a, D, { rough: .4 }); B(2.6, 1.1, .25, 2.0, .8, z + (z < 0 ? -.3 : .3), 0xb3322a, D, { rough: .4 }); }
    C(.12, .2, 1.4, 1.14, -.3, WHITE, D); C(.3, .03, 2.3, 1.06, -.5, WHITE, D);    // mug + plate
    S.founders = [person(21.2, -1.0, { scale: .8 }), person(22.8, -1.0, { scale: .8 }), person(22.0, 0.9, { scale: .8, color: 0x2b2b2e })];
    S.boothChip = S.chipFn(group(22.0, 1.14, -.4), .42); S.boothChip.parent.visible = false;

    // --- C: value tower ---
    S.tower = solid(new THREE.BoxGeometry(2.2, 1, 2.2), GOLD, undefined, { metal: .7, rough: .3, glow: .1 }); S.tower.position.set(40, .5, -1.5);
    S.towerChip = S.chipFn(group(40, 1, -1.5), .7);

    // --- D: newspaper + red arrow toward "China" ---
    S.paper = group(60, 3.2, -1);
    B(3.0, 4.0, .06, 0, 0, 0, WHITE, S.paper, { rough: .9 });
    B(2.6, .45, .02, 0, 1.55, .04, 0x222222, S.paper);
    for (let i = 0; i < 9; i++) B(i % 3 === 2 ? 1.6 : 2.6, .1, .02, i % 3 === 2 ? -.5 : 0, .9 - i * .3, .04, 0x777777, S.paper);
    S.arrow = group(60, 1.0, .6); B(2.2, .25, .25, 0, 0, 0, RED, S.arrow, { glow: .3 });
    const ah = solid(new THREE.ConeGeometry(.35, .6, 24), RED, S.arrow, { glow: .3 }); ah.rotation.z = -Math.PI / 2; ah.position.x = 1.3;
    S.miniChip = S.chipFn(group(57.6, 1.0, .6), .25);

    // --- E: memo + Jensen ---
    S.memo = group(80.8, 3.0, -1.2); B(2.4, 3.2, .05, 0, 0, 0, WHITE, S.memo, { rough: .9 });
    for (let i = 0; i < 8; i++) B(i === 7 ? 1.0 : 1.9, .08, .02, i === 7 ? -.45 : 0, 1.1 - i * .3, .03, 0x666666, S.memo);
    S.jensenE = person(78.2, 1.0, { color: 0x2b2b2e }); ring(1.2, 78.2, 1.0);
    S.boardTable = group(80.8, 0, -4.4); B(4.0, .12, 1.4, 0, 1.0, 0, 0x3a2a1e, S.boardTable); for (let i = 0; i < 5; i++) person(78.8 + i, -5.4, { scale: .7 });

    // --- F: stock chart (solid bars) + $4T line ---
    const P = [5.1, 5.3, 5.2, 5.6, 5.5, 5.8, 6.0, 5.95, 5.69, 5.38];             // last two = Mon −4.3%, Tue −5.5% (scaled)
    S.bars = P.map((h, i) => { const b = solid(new THREE.BoxGeometry(.5, 1, .5), i < 8 ? GOLD : RED, undefined, { metal: .6, rough: .35, glow: i < 8 ? .05 : .25 }); b.position.set(97.3 + i * .6, 0, -1); b.userData.h = h; return b; });
    S.line4T = B(6.6, .05, .05, 100.0, 5.55, -.7, RED, undefined, { glow: .8 });

    // --- G: the twist: chip + giant question mark ---
    S.qChip = S.chipFn(group(120, .4, -1), .9);
    S.q = group(120, 3.6, -1);
    const arc = solid(new THREE.TorusGeometry(.75, .2, 16, 48, Math.PI * 1.5), RED, S.q, { glow: .35 }); arc.rotation.z = -Math.PI / 2; arc.position.y = 1.0;
    C(.2, .7, 0, -.05, 0, RED, S.q, { glow: .35 }); const dot = solid(new THREE.SphereGeometry(.24, 24, 16), RED, S.q, { glow: .35 }); dot.position.y = -.85;

    // --- H: Congress dome + gavel ---
    const H = group(140, 0, -2.6);
    B(5.2, .5, 2.6, 0, .25, 0, WHITE, H); B(4.6, .3, 2.2, 0, .65, 0, WHITE, H);
    for (let i = 0; i < 6; i++) C(.14, 1.8, -1.9 + i * .76, 1.7, .9, WHITE, H, {}, 16);
    B(4.8, .35, 2.2, 0, 2.75, 0, WHITE, H); C(1.0, .6, 0, 3.2, 0, WHITE, H);
    const dome = solid(new THREE.SphereGeometry(1.0, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2), WHITE, H); dome.position.y = 3.5;
    C(.08, .6, 0, 4.8, 0, WHITE, H, {}, 12);
    S.gavel = group(142.4, 1.1, 1.0); const head = C(.28, .9, 0, 0, 0, 0x6b3f22, S.gavel); head.rotation.z = Math.PI / 2;
    const handle = C(.07, 1.6, 0, -.8, 0, 0x6b3f22, S.gavel); S.block = C(.5, .2, 142.4, .1, 1.0, 0x4a2c18);

    // --- I: nurse + index-fund pie (blue world) ---
    S.nurse = person(157.2, 1.2, { color: BLUE }); ring(1.2, 157.2, 1.2, 0x7fa6e0);
    S.pie = group(161.0, 2.6, -1); S.pie.rotation.x = Math.PI / 2 - .5;
    const cols = [0x1f4f9a, 0x2c64b8, 0x173e7c, 0x3a74c8, 0x24579f];
    let a0 = .5; for (let i = 0; i < 5; i++) { const len = (Math.PI * 2 - .5) / 5; const w = solid(new THREE.CylinderGeometry(1.6, 1.6, .35, 40, 1, false, a0, len), cols[i], S.pie, { rough: .5 }); a0 += len; }
    S.slice = solid(new THREE.CylinderGeometry(1.6, 1.6, .45, 16, 1, false, 0, .5), GOLD, S.pie, { metal: .6, glow: .15 });
  },

  shots: [
    [0,           [4.5, 5.2, 8.5],  [0, 3.6, -1],    1.4],
    ['reframe',   [4.6, 3.8, 9.5],  [1.6, 3.0, -.5], 1.0],
    ['rise',      [18.6, 3.0, 7.5], [17.6, 1.6, -1], 0.8],
    ['booth',     [23.4, 3.6, 7.5], [22.0, 1.4, -1], 0.8],
    ['top',       [42.5, 2.2, 11],  [40, 5.5, -1.5], 1.0],
    ['step1',     [61, 3.8, 8.5],   [60, 3.0, -1],   1.0],
    ['goal',      [60.5, 2.6, 7],   [59.6, 1.6, 0],  0.8],
    ['step2',     [80, 3.4, 9],     [79.8, 2.8, -1.5], 1.0],
    ['step3',     [100.4, 3.6, 10.5],[100, 3.6, -1],  1.0],
    ['catch',     [121, 3.6, 9.5],  [120, 3.0, -1],  1.0],
    ['next',      [141.4, 2.8, 10.5],[140.6, 1.6, -1.5], 1.0],
    ['contrast',  [160, 3.4, 9.5],  [159.4, 2.4, -1], 1.0],
    ['punch',     [23.6, 3.0, 6.5], [22.0, 1.4, -.6], 0.8],
  ],

  cards: [
    { l: 'Value wiped out', v: '$0', cls: 'red big', a: [0, 6.6, -1], t0: 0.1, t1: 'reframe', count: [0, 430, 0.2, 2.8], fmt: n => '−$' + Math.round(n) + 'B' },
    { v: 'JENSEN HUANG', cls: 'tag white', a: [2.6, 3.4, 1.6], t0: 'reframe+0.3', t1: 'rise' },
    { l: 'CEO since', v: '1993', cls: 'white', a: [2.6, 4.8, 1.6], t0: 'reframe+1.2', t1: 'rise' },
    { l: 'Age 15', v: 'DISHWASHER', cls: 'white', a: [17.6, 3.6, -1], t0: 'rise+0.6', t1: 'booth' },
    { l: 'Age 30 · 1993', v: 'NVIDIA IS BORN', a: [22.0, 3.4, -1], t0: 'booth+1.0', t1: 'top' },
    { l: 'Value at its peak', v: '', cls: 'big', a: [40, 9.6, -1.5], t0: 'top+0.3', t1: 'step1', count: [0, 4, 'top+0.3', 2.2], fmt: n => '≈ $' + n.toFixed(1) + 'T' },
    { l: 'New York Times', v: 'REPORT', cls: 'white', a: [60, 6.0, -1], t0: 'nyt', t1: 'nyt+3.8' },
    { l: 'U.S. intelligence believes', v: 'ALLEGED SPY', cls: 'red', a: [60, 6.0, -1], t0: 'nyt+3.8', t1: 'goal' },
    { l: 'Reportedly sent to push for', v: 'CHIPS IN CHINA', cls: 'red', a: [60, 3.8, 0], t0: 'goal+0.3', t1: 'step2' },
    { l: 'Memo to employees', v: 'AFFAIR ADMITTED', cls: 'white', a: [80.8, 5.6, -1.2], t0: 'memo', t1: 'resp' },
    { v: '“FULL RESPONSIBILITY”', a: [80.8, 5.6, -1.2], t0: 'resp', t1: 'step3' },
    { l: 'Mon −4.3% · Tue −5.5%', v: '≈ −10%', cls: 'red', a: [98.6, 7.6, -1], t0: 'drop', t1: 'gone' },
    { l: 'Value lost', v: '$0', cls: 'red big', a: [100, 7.8, -1], t0: 'gone', t1: 'catch', count: [0, 430, 'gone', 1.6], fmt: n => '−$' + Math.round(n) + 'B' },
    { v: 'THE TWIST', cls: 'red big', a: [120, 7.2, -1], t0: 'catch', t1: 'board' },
    { l: 'Nvidia board', v: 'NO SIGN OF LEAKS', cls: 'white', a: [120, 7.0, -1], t0: 'board', t1: 'trump' },
    { l: 'China', v: 'DENIES IT', cls: 'white', a: [120, 1.6, 1.2], t0: 'china', t1: 'trump' },
    { l: 'President Trump', v: '“AN HONORABLE GUY”', a: [120, 7.0, -1], t0: 'trump', t1: 'next' },
    { l: 'Congress', v: 'WANTS A BRIEFING', cls: 'white', a: [140, 7.0, -2.6], t0: 'next', t1: 'contrast' },
    { l: 'Shareholders', v: 'SUING', cls: 'red', a: [143.6, 4.6, 1], t0: 'suit+0.3', t1: 'contrast' },
    { v: 'NURSE', cls: 'tag white', a: [157.2, 3.3, 1.2], t0: 'contrast+0.6', t1: 'punch' },
    { l: 'S&P 500 index fund', v: 'NVIDIA SLICE', cls: 'blue', a: [161, 5.4, -1], t0: 'contrast+2.4', t1: 'punch' },
    { v: '30 YEARS TO BUILD', a: [22.0, 4.2, -1], t0: 'punch', t1: 'weekend' },
    { v: '1 WEEKEND TO SHAKE', cls: 'red', a: [22.0, 4.2, -1], t0: 'weekend', t1: 'cta' },
  ],

  steps: { title: 'THE WEEKEND', labels: ['FRIDAY', 'SUNDAY', 'MON–TUE'], marks: ['step1', 'step2', 'step3'], from: 'step1', to: 'catch' },
  follow: { from: 'cta+0.2', title: 'MORE MONEY STORIES' },
  shakes: [['gone', .6, .12]],
  flashes: [['gone+0.1', .35, .2]],

  update(t, K) {
    const { at, T, ease, easeOut, clamp01, prog, setBar } = K, S = this.s;
    // A: chip spins in, Jensen appears on "reframe"
    S.chipG.rotation.set(.75 + .1 * Math.sin(t * .7), t * .35, .08 * Math.sin(t * .5));
    S.chipG.position.y = 3.4 + .12 * Math.sin(t * 1.3);
    S.jensen.visible = t > at('reframe');
    // B: teen at the sink, then founders at the booth; chip appears on the table for the punchline
    S.plates.forEach((p, i) => { p.position.y = 1.05 + Math.floor(i / 2) * .07 + (t > at('rise') ? .05 * Math.sin(t * 6 + i) : 0); });
    S.teen.visible = t < at('booth') + .2;
    S.founders.forEach((f, i) => { f.visible = t > T('booth+0.2'); K.hop(f, t, 'booth+' + (0.3 + i * .2)); });
    S.boothChip.parent.visible = t > at('punch'); S.boothChip.parent.rotation.y = t * .8;
    S.boothChip.parent.position.y = 1.14 + .9 * easeOut(prog(t, 'punch', .8)); S.boothChip.parent.rotation.x = .6;
    // C: tower rises to "$4T"
    const th = .2 + 7.0 * easeOut(prog(t, 'top+0.2', 2.2)); setBar(S.tower, th);
    S.towerChip.parent.position.y = th + .1; S.towerChip.parent.rotation.y = t * .5;
    // D: newspaper drops in spinning; arrow + chip slide toward "China" on "goal"
    const pp = easeOut(prog(t, 'step1', 1.0)); S.paper.position.y = 3.2 + 6 * (1 - pp); S.paper.rotation.z = (1 - pp) * 2.5; S.paper.rotation.y = -.15;
    const gp = easeOut(prog(t, 'goal+0.2', 1.4)); S.arrow.visible = S.miniChip.parent.visible = t > at('goal');
    S.arrow.scale.x = Math.max(.01, gp); S.arrow.position.x = 60 - 1.1 * (1 - gp);
    S.miniChip.parent.position.x = 57.6 + 4.2 * ease(prog(t, 'goal+0.8', 1.6)); S.miniChip.parent.rotation.y = t;
    // E: memo slides up; Jensen bows his head on "resp"
    S.memo.position.y = 3.0 - 3.5 * (1 - easeOut(prog(t, 'memo-0.6', .8))); S.memo.rotation.y = -.25;
    S.jensenE.rotation.x = .12 * ease(prog(t, 'resp', .6));
    // F: bars grow left to right, last two drop red; $4T line
    S.bars.forEach((b, i) => { const k = easeOut(clamp01((t - T('step3') - i * .1) / .5));
      const drop = i === 8 ? easeOut(prog(t, 'drop', .6)) : i === 9 ? easeOut(prog(t, 'drop+0.6', .6)) : 1;
      b.visible = k > 0 && (i < 8 || t > at('drop') + (i === 9 ? .6 : 0)); setBar(b, b.userData.h * k * (i < 8 ? 1 : drop)); });
    // G: question mark pops and wobbles
    const qk = K.pop(prog(t, 'catch', .5)); S.q.scale.setScalar(Math.max(.01, qk)); S.q.rotation.y = .4 * Math.sin(t * 1.5); S.qChip.parent.rotation.y = t * .4;
    // H: gavel swings down on "suit"
    const gs = prog(t, 'suit', .35), back = prog(t, 'suit+0.35', .3);
    S.gavel.rotation.z = .9 - 1.2 * easeOut(gs) + .5 * ease(back);
    // I: Nvidia slice shrinks and turns red on "felt"
    const f = ease(prog(t, 'felt', .8)); S.slice.scale.set(1 - .12 * f, 1, 1 - .12 * f);
    S.slice.children[0].material.color.setHex(f > .5 ? 0xc4140c : 0xc98f1c);
    S.pie.rotation.z = t * .15;
  },
};
