// Why the fuck do we have fingerprints? — BLUEPRINT look (science)
// Sets: giant print x=0 | Maya's finger x=30 | ridge cross-section x=55 | grip test x=80 | robot finger + sensor x=110
//       record needle x=140 | womb timeline x=170 | twins x=200 | cop vs brain x=230
window.SCENE = {
  style: 'blueprint',
  distance: 1,
  build(K) {
    const { box, cyl, group, wire, glow, line, extrude, GOLD, RED, WHITE, BLUE, CYAN, SILVER, PINK } = K;
    const S = this.s = {};
    // ---- procedural fingerprint (whorl core + loops + arches), returns array of Line2 ----
    function print(cx, cy, cz, scale, seed, color, parent, width = 3) {
      const g = group(cx, cy, cz, parent); g.scale.setScalar(scale); const L = [];
      const rnd = k => Math.sin(seed * 12.9898 + k * 78.233) * .5 + .5;
      for (let k = 1; k <= 13; k++) {
        const r = .16 * k, gap = .35 + rnd(k) * .5, a0 = rnd(k + 50) * 6.28, pts = [];
        for (let i = 0; i <= 90; i++) { const a = a0 + gap / 2 + (i / 90) * (Math.PI * 2 - gap);
          const w = 1 + .07 * Math.sin(3 * a + seed) + .05 * Math.sin(5 * a + seed * 2), sq = 1 + .25 * Math.max(0, Math.sin(a));
          pts.push([Math.cos(a) * r * w * .82, Math.sin(a) * r * w * sq + (seed % 2 ? .02 : -.02) * k, 0]); }
        L.push(line(pts, color, g, width));
      }
      for (let k = 0; k < 10; k++) {           // arches above + below the core
        const R = 2.3 + k * .16, pts = [], pts2 = [];
        for (let i = 0; i <= 60; i++) { const a = Math.PI * (.12 + .76 * i / 60);
          pts.push([Math.cos(a) * R * .9, Math.sin(a) * R * .95 - .3 + .06 * Math.sin(a * 6 + seed + k), 0]);
          pts2.push([Math.cos(a) * R * .95, -Math.sin(a) * R * .55 - .2 + .05 * Math.sin(a * 5 + seed * 3 + k), 0]); }
        L.push(line(pts, color, g, width)); if (k < 6) L.push(line(pts2, color, g, width));
      }
      g.userData.lines = L; return g;
    }
    S.print = print;

    // ---------- SET 1 (x=0): giant fingerprint ----------
    S.big = print(0, 6.2, -2, 1.55, 3, CYAN, undefined, 4);
    S.scan = glow(new THREE.PlaneGeometry(9, .08), WHITE, undefined, .8, 0, 6, -1.9);

    // ---------- SET 2 (x=30): Maya's finger slides over a table ----------
    S.table = box(12, .5, 5, 30, 1.6, -1, undefined, BLUE);
    S.finger = group(30, 2.7, -1);
    const fg = group(0, 0, 0, S.finger); fg.rotation.z = -.35;
    cyl(.55, 4.5, -2.3, 0, 0, fg, WHITE, 14).rotation.z = Math.PI / 2;
    wire(new THREE.SphereGeometry(.55, 14, 10), WHITE, fg, { angle: 8 }).position.set(-.05, 0, 0);
    box(.55, .08, .7, -.6, .52, 0, fg, SILVER); // nail
    S.fingerGlow = glow(new THREE.CircleGeometry(.6, 24), GOLD, undefined, .7, 30, 1.87, -1); S.fingerGlow.rotation.x = -Math.PI / 2;

    // ---------- SET 3 (x=55): ridge cross-section ----------
    const prof = [[-6, -1.4]]; for (let i = 0; i <= 120; i++) { const x = -6 + i * .1; prof.push([x, .3 * Math.abs(Math.sin(x * 2.6)) ]); } prof.push([6, -1.4]);
    S.skin = extrude(prof, 2, 55, 3, -2, undefined, PINK);
    S.ridgeLabel = line([[50.5, 4.4, 0], [50.5, 3.55, 0]], GOLD, undefined, 3);

    // ---------- SET 4 (x=80): grip test — contact bars ----------
    S.gSmooth = K.bar(1.6, 1.6, 78, -1, undefined, WHITE);
    S.gRidge = K.bar(1.6, 1.6, 82, -1, undefined, RED);
    box(9, .1, 4, 80, .05, -1, undefined, CYAN);   // glass
    S.pads = [78, 82].map((x, i) => { const g = group(x, 0, 1.8); if (i === 0) box(1.6, .1, 1.2, 0, .06, 0, g, GOLD);
      else for (let k = 0; k < 5; k++) box(.2, .1, 1.2, -.64 + k * .32, .06, 0, g, GOLD); return g; });

    // ---------- SET 5 (x=110): robot finger, buzz, Pacinian corpuscle ----------
    S.slide = box(10, .3, 3, 108, .9, -1, undefined, CYAN);
    for (let i = 0; i < 24; i++) box(.06, .05, 2.8, 103.4 + i * .4, 1.08, -1, undefined, BLUE);
    S.robot = group(106, 1.6, -1);
    box(.9, .5, .9, 0, .3, 0, S.robot, SILVER); box(.6, 1.6, .6, 0, 1.3, 0, S.robot, SILVER); box(.5, 1.4, .5, 0, 2.8, 0, S.robot, SILVER);
    cyl(.35, .4, 0, 2.1, 0, S.robot, GOLD, 10).rotation.x = Math.PI / 2;
    for (let i = 0; i < 4; i++) box(.85, .04, .9, 0, .03 - i * .0, 0, S.robot, GOLD).position.y = .06 + i * .11;
    // oscilloscope wave
    S.wavePts = 160; S.wave = line(Array.from({ length: S.wavePts }, (_, i) => [104 + i * .05, 6.4, -1]), GOLD, undefined, 4);
    box(8.6, 2.6, .1, 108, 6.4, -1.15, undefined, BLUE);
    // the onion-layered sensor (Pacinian corpuscle)
    S.onion = group(115, 3.6, -1);
    for (let i = 0; i < 6; i++) { const e = wire(new THREE.SphereGeometry(.25 + i * .2, 12, 8), i % 2 ? CYAN : WHITE, S.onion, { angle: 10 }); e.scale.set(1, 1.7, 1); }
    line([[0, -1.9, 0], [0, -3.4, 0], [-.6, -4.2, 0]], GOLD, S.onion, 4);

    // ---------- SET 6 (x=140): record + needle ----------
    const R = group(140, 0, -1);
    box(8, .6, 6, 0, .3, 0, R, BLUE);
    S.disc = group(-.8, .75, 0, R); cyl(2.5, .08, 0, 0, 0, S.disc, CYAN, 48);
    for (let i = 0; i < 9; i++) { const pts = []; const rr = .7 + i * .2; for (let a = 0; a <= 48; a++) pts.push([Math.cos(a / 48 * 6.283) * rr, .06, Math.sin(a / 48 * 6.283) * rr]); line(pts, BLUE, S.disc, 1.5); }
    cyl(.6, .1, 0, .04, 0, S.disc, GOLD, 24);
    S.arm = group(2.6, 1.4, -1.8, R); cyl(.3, .8, 0, -.3, 0, S.arm, SILVER, 10);
    box(3.4, .12, .12, -1.7, 0, 0, S.arm, SILVER).rotation.y = -.5; S.needle = box(.12, .5, .12, -3.0, -.25, .8, S.arm, GOLD);
    S.notes = []; for (let i = 0; i < 5; i++) { const n = glow(new THREE.TorusGeometry(.3 + i * .25, .03, 6, 32), GOLD, undefined, .7); n.position.set(140, 2.4, -1); n.rotation.x = Math.PI / 2; S.notes.push(n); }

    // ---------- SET 7 (x=170): womb timeline ----------
    const TL = group(170, 3, -1);
    box(12, .3, .3, 0, 0, 0, TL, SILVER);
    for (let w = 0; w <= 40; w += 10) box(.06, .6, .3, -6 + w * .3, 0, 0, TL, WHITE);
    S.window = box(.3 * 6, .5, .5, -6 + 16 * .3, 0, 0, TL, GOLD);
    S.fetus = group(170, 5.2, -1.5);
    const fr = []; for (let a = 0; a <= 40; a++) { const u = a / 40 * Math.PI * 1.6 + .6; fr.push([Math.cos(u) * 1.1, Math.sin(u) * 1.4, 0]); } line(fr, PINK, S.fetus, 4);
    wire(new THREE.SphereGeometry(.75, 12, 8), PINK, S.fetus, { angle: 10 }).position.set(.2, 1.1, 0);
    S.womb = glow(new THREE.CircleGeometry(2.6, 48), 0x3a1630, undefined, .55, 170, 5.4, -2);
    S.mini = print(171.6, 4.6, -1.3, .22, 7, GOLD, undefined, 2);

    // ---------- SET 8 (x=200): twins ----------
    S.twinA = print(197.4, 4.6, -1, .82, 11, CYAN, undefined, 3);
    S.twinB = print(202.6, 4.6, -1, .82, 4, GOLD, undefined, 3);
    S.dnaA = []; S.dnaB = [];
    for (const [arr, x] of [[S.dnaA, 197.4], [S.dnaB, 202.6]]) { const p1 = [], p2 = []; for (let i = 0; i <= 50; i++) { const y = 8.4 + (i / 50) * 2.6 - 1.3, a = i / 50 * Math.PI * 4; p1.push([x + Math.sin(a) * .5, y, -1]); p2.push([x - Math.sin(a) * .5, y, -1]); }
      arr.push(line(p1, WHITE, undefined, 3), line(p2, WHITE, undefined, 3)); }
    S.diffRings = [[196.6, 5.2], [203.2, 4.1], [198.2, 3.7]].map(([x, y]) => { const r = glow(new THREE.RingGeometry(.42, .52, 32), RED, undefined, 1, x, y, -.9); return r; });

    // ---------- SET 9 (x=230): cop scanner vs brain ----------
    const C = group(228, 0, -1);
    box(3, 3.4, 2, 0, 1.7, 0, C, BLUE); box(2.2, .1, 1.6, 0, 3.45, .1, C, CYAN);
    S.copPrint = print(228, 3.6, -.8, .22, 3, BLUE, undefined, 2); S.copPrint.rotation.x = -Math.PI / 2;
    S.brain = group(232.6, 3.2, -1);
    for (let i = 0; i < 2; i++) { const h = wire(new THREE.SphereGeometry(1.1, 12, 9), PINK, S.brain, { angle: 10 }); h.scale.set(1.35, .95, 1); h.position.set(0, 0, i ? .55 : -.55); }
    S.pulse = glow(new THREE.SphereGeometry(.25, 10, 8), GOLD, undefined, 1);
  },

  shots: [
    [0,          [0, 6.6, 13.5],  [0, 6.6, -2],    2.2],
    ['setup',    [29, 4.6, 12.5], [30, 2.6, -1],   1.2],
    ['ridges',   [54.5, 4.4, 7.5],[55, 3.2, -1],   1],
    ['step1',    [80, 5, 15],     [80, 3.4, -.5],  1.2],
    ['step2',    [108, 4.4, 15],  [108, 4.2, -1],  1.2],
    ['sensor',   [114, 3.8, 9],   [114.6, 3.6, -1], 1],
    ['step3',    [140, 7, 11],    [139.5, 2.2, -1],1],
    ['catch',    [0, 6.6, 13],    [0, 6.6, -2],    1],
    ['womb',     [170, 5, 12],    [170, 4.4, -1],  1.2],
    ['twins',    [200, 6.4, 19],  [200, 6.2, -1],  1.5],
    ['contrast', [230.2, 4.6, 15.5],[230.2, 3.4, -1],1.2],
    ['punch',    [0, 6.6, 13.5],  [0, 6.6, -2],    1.5],
  ],

  cards: [
    { v: 'WHY DO WE HAVE THESE?', cls: 'white', a: [0, 11.4, -2], t0: 0, t1: 'reframe' },
    { l: 'For grip?', v: 'NOPE ✕', cls: 'red', a: [0, 11.4, -2], t0: 'reframe', t1: 'reframe+1.2' },
    { l: 'For', v: 'FEELING', cls: 'big', a: [0, 11.2, -2], t0: 'reframe+1.2', t1: 'setup' },
    { v: 'MAYA', cls: 'tag white', a: [26.5, 4.6, -1], t0: 'setup+0.2', t1: 'ridges' },
    { l: 'Cross-section', v: 'RIDGES', a: [55, 5.4, -1], t0: 'ridges+0.3', t1: 'step1' },
    { l: 'Manchester', v: 'GRIP TEST', cls: 'white', a: [80, 7.0, -1], t0: 'manchester', t1: 'third' },
    { l: 'Skin contact', v: '−⅓', cls: 'red big', a: [80, 7.0, -1], t0: 'third+0.2', t1: 'step2' },
    { v: 'SMOOTH', cls: 'tag', a: [78, 5.2, -1], t0: 'step1+0.3', t1: 'step2' },
    { v: 'RIDGED', cls: 'tag', a: [82, 5.2, -1], t0: 'step1+0.3', t1: 'step2' },
    { l: 'Paris', v: 'ROBOT FINGERTIP', cls: 'white', a: [108, 3.0, 1.5], t0: 'paris+0.3', t1: 'buzz' },
    { l: 'Ridges make it', v: 'BUZZ', cls: 'big', a: [108, 3.0, 1.5], t0: 'buzz+0.2', t1: 'sensor' },
    { l: 'Deep-touch sensor', v: 'PACINIAN', a: [111.8, 5.0, 1], t0: 'sensor+0.2', t1: 'step3' },
    { l: 'Shaped like an', v: 'ONION', cls: 'white', a: [111.8, 3.7, 1], t0: 'sensor+1.2', t1: 'step3' },
    { l: 'Like a', v: 'RECORD NEEDLE', a: [140, 5.0, -2], t0: 'record+0.2', t1: 'catch' },
    { v: 'TEXTURE → BUZZ → BRAIN', cls: 'white', a: [140, 3.8, -2], t0: 'record+1.6', t1: 'catch' },
    { l: 'One mystery', v: 'WHY UNIQUE?', cls: 'red', a: [0, 11.4, -2], t0: 'catch+0.3', t1: 'womb' },
    { l: 'Ridges form', v: 'WEEKS 13–19', a: [170, 9.2, -1], t0: 'womb+0.3', t1: 'twins' },
    { v: 'WEEK 0', cls: 'tag', a: [164, 3.8, -1], t0: 'womb+0.3', t1: 'twins' },
    { v: 'BIRTH', cls: 'tag', a: [176, 3.8, -1], t0: 'womb+0.3', t1: 'twins' },
    { v: 'TWIN A', cls: 'tag white', a: [197.4, 7.6, -1], t0: 'twins+0.4', t1: 'contrast' },
    { v: 'TWIN B', cls: 'tag', a: [202.6, 7.6, -1], t0: 'twins+0.4', t1: 'contrast' },
    { v: 'SAME DNA', cls: 'white', a: [200, 10.8, -1], t0: 'math', t1: 'contrast' },
    { v: 'DIFFERENT PRINTS', cls: 'red', a: [200, 4.6, 1], t0: 'diff', t1: 'contrast' },
    { l: 'A cop sees', v: 'AN ID', cls: 'blue', a: [228, 6.2, -1], t0: 'contrast+0.2', t1: 'punch' },
    { l: 'Your brain sees', v: 'A SCANNER', a: [232.6, 6.2, -1], t0: 'brain', t1: 'punch' },
  ],

  steps: { title: 'THE EXPERIMENTS', labels: ['GRIP', 'ROBOT', 'AMPLIFY'], marks: ['step1', 'step2', 'step3'], from: 'step1', to: 'catch' },
  receipt: { from: 'punch', to: 'cta', title: 'YOUR FINGERPRINTS', rows: [
    ['GRIP', 'WORSE (−⅓)', 'k'], ['TOUCH', 'AMPLIFIED', 'g'], ['SENSOR', 'PACINIAN'], ['FORMED', 'WEEKS 13–19'], ['IDENTICAL TWINS', 'DIFFERENT'], ['REAL JOB', 'FEELING', 'g']] },
  follow: { from: 'cta+0.2', title: 'MORE WHY THE F*CK SCIENCE' },
  shakes: [['buzz+0.2', .6, .05]],
  flashes: [],

  update(t, K) {
    const { at, T, ease, easeOut, clamp01 } = K, S = this.s;
    // giant print draws itself from the core outward; scanner bar sweeps
    S.big.userData.lines.forEach((l, i) => K.setLine(l, easeOut(clamp01((t + .6 - i * .07) / 1.0))));
    S.big.rotation.z = Math.sin(t * .4) * .04;
    const sp = (t * .55) % 1; S.scan.position.y = 6.2 + 4.6 - sp * 9.2; S.scan.visible = t < at('setup') || (t > at('catch') && t < at('womb')) || t > at('punch');
    // Maya's finger slides back and forth; contact glow follows
    const sx = 30 + Math.sin((t - at('setup')) * 1.6) * 3; S.finger.position.x = sx; S.fingerGlow.position.x = sx;
    S.fingerGlow.material.opacity = .4 + .3 * Math.abs(Math.sin(t * 9));
    // ridge cross-section: tick marks
    // grip bars
    K.setBar(S.gSmooth, 4.5 * easeOut(clamp01((t - at('manchester')) / .8)));
    K.setBar(S.gRidge, 4.5 * easeOut(clamp01((t - at('manchester')) / .8)) * (1 - .33 * ease(clamp01((t - at('third')) / .6))));
    // robot finger slides, wave goes from flat to buzzing
    const rs = clamp01((t - at('paris')) / 3); S.robot.position.x = 104.5 + ((t - at('paris')) * 1.4 % 7 + 7) % 7 * (t > at('paris') ? 1 : 0);
    const amp = .9 * ease(clamp01((t - at('buzz')) / .4));
    const g = S.wave.geometry, arr = []; for (let i = 0; i < S.wavePts; i++) { const x = 104 + i * .05; const env = Math.sin(i / S.wavePts * Math.PI);
      arr.push(x, 6.4 + amp * env * Math.sin(i * .9 - t * 40) * (.6 + .4 * Math.sin(i * .13 + t * 3)), -1); }
    g.setPositions(arr);
    S.onion.visible = t > at('sensor'); S.onion.scale.setScalar(easeOut(clamp01((t - at('sensor')) / .5)) * (1 + .05 * Math.sin(t * 30) * (amp > .1 ? 1 : 0)));
    // record spins, needle bobs, rings ripple out
    S.disc.rotation.y = -t * 3.5; S.needle.position.y = -.25 + Math.sin(t * 50) * .02;
    S.notes.forEach((n, i) => { const q = ((t - at('record')) * .6 + i / 5) % 1; n.visible = t > at('record'); n.scale.setScalar(.4 + q * 2); n.material.opacity = .7 * (1 - q); n.position.set(138.6, 1.2 + q * 2.5, -1.3); });
    // womb: window glows, mini print draws
    S.window.scale.x = Math.max(.01, easeOut(clamp01((t - at('womb') - .3) / .6)));
    S.mini.userData.lines.forEach((l, i) => K.setLine(l, easeOut(clamp01((t - at('womb') - .5 - i * .05) / .6))));
    S.fetus.rotation.z = Math.sin(t * 1.3) * .06;
    // twins: prints draw, DNA identical, difference rings pulse
    [S.twinA, S.twinB].forEach((p, k) => p.userData.lines.forEach((l, i) => K.setLine(l, easeOut(clamp01((t - at('twins') - k * .25 - i * .03) / .7)))));
    [...S.dnaA, ...S.dnaB].forEach(l => K.setLine(l, easeOut(clamp01((t - at('math')) / .6))));
    S.diffRings.forEach((r, i) => { const q = t - at('diff') - i * .25; r.visible = q > 0 && t < at('contrast'); r.scale.setScalar(1 + .15 * Math.sin(t * 8)); });
    // brain pulses travel up from the finger
    const q = ((t - at('brain')) % 1 + 1) % 1; S.pulse.visible = t > at('brain') && t < at('punch'); S.pulse.position.set(228.8 + q * 3, 3.6 + Math.sin(q * Math.PI) * 1.2, -1);
    S.brain.scale.setScalar(1 + (t > at('brain') ? .06 * Math.max(0, Math.sin(t * 6)) : 0));
    // final: print redraws
    if (t > at('punch')) S.big.userData.lines.forEach((l, i) => K.setLine(l, easeOut(clamp01((t - at('punch') - i * .04) / .8))));
  },
};
