// How a US nuclear submarine is built (Virginia-class) — blueprint look (see look.js).
// Sets: hero sub x=0 | slices x=20 | fill + barge x=40 | join x=60 | depth x=80 | crew x=100 | deployment x=120 | reactor + supplies x=140
window.SCENE = {
  distance: 1.5,
  build(K) {
    const { box, cyl, group, wire, ring, tube, INK, GOLD, RED, WHITE, CYAN } = K;
    const S = this.s = {};
    const R = .62;                                        // hull radius (34 ft wide / 377 ft long ≈ 1 : 11)

    // ---- reusable submarine: 10 hull slices + nose + tail + sail + fins, axis along x ----
    function makeSub(x, y, z, sc = 1) {
      const G = group(x, y, z); G.scale.setScalar(sc);
      const sub = { G, slices: [], parts: [] };
      for (let i = 0; i < 10; i++) {
        const s = wire(new THREE.CylinderGeometry(R, R, .98, 24, 1), INK, G); s.rotation.z = Math.PI / 2; s.position.x = -4.5 + i; s.userData.x0 = s.position.x;
        sub.slices.push(s); sub.parts.push(s);
      }
      const prof = []; for (let k = 0; k <= 8; k++) { const a = k / 8 * Math.PI / 2; prof.push(new THREE.Vector2(Math.max(.001, R * Math.cos(a)), 1.25 * Math.sin(a))); }
      const nose = wire(new THREE.LatheGeometry(prof, 10), INK, G); nose.rotation.z = -Math.PI / 2; nose.position.x = 5; sub.nose = nose; sub.parts.push(nose);
      const tail = wire(new THREE.ConeGeometry(R, 2.4, 10, 1, true), INK, G); tail.rotation.z = Math.PI / 2; tail.position.x = -6.2; sub.tail = tail; sub.parts.push(tail);
      const T = group(0, 0, 0, G); sub.tailGrp = T;
      box(.9, 1.7, .06, -6.6, 0, 0, T, INK); box(.9, .06, 1.7, -6.6, 0, 0, T, INK); cyl(.32, .3, -7.4, 0, 0, T, INK, 10).rotation.z = Math.PI / 2;
      const sail = box(1.3, .85, .32, 3.0, R + .38, 0, G, INK); sub.sail = sail; sub.parts.push(sail);
      // outer skin: 8 lines along the hull so a finished sub reads as one smooth tube (hidden while it's in slices)
      const skin = wire(new THREE.CylinderGeometry(R * 1.01, R * 1.01, 10, 8, 1, true), INK, G); skin.rotation.z = Math.PI / 2; skin.children[0].visible = false; sub.skin = skin;
      box(.2, .04, 1.3, 3.1, R + .45, 0, G, INK);
      return sub;
    }
    const xray = (sub, on) => sub.parts.forEach(p => { p.children[0].visible = !on; });
    S.xray = xray;
    const fig = (color, parent, s = 1) => { const g = new THREE.Group(); const m = new THREE.MeshBasicMaterial({ color });
      const b = new THREE.Mesh(new THREE.CylinderGeometry(.08 * s, .1 * s, .32 * s, 8), m); b.position.y = .16 * s;
      const h = new THREE.Mesh(new THREE.SphereGeometry(.08 * s, 10, 8), m); h.position.y = .42 * s; g.add(b, h); (parent || K.scene).add(g); return g; };

    // --- A: hero sub (hook / missions / punch) ---
    S.A = makeSub(0, 3.2, -1);
    { const C = group(0, 0, 0, S.A.G);                      // interior "city" seen when x-rayed
      box(9.4, .04, .9, -.2, -.18, 0, C, WHITE); box(7, .04, .8, .6, .22, 0, C, WHITE);
      for (let i = 0; i < 7; i++) box(.6, .3, .5, -3.6 + i * 1.2, .0, 0, C, i % 2 ? CYAN : WHITE);
      S.reactorA = cyl(.32, .7, -2.6, 0, 0, C, GOLD, 12); S.reactorA.rotation.z = Math.PI / 2;
      S.cityA = C; C.visible = false; }
    S.dimLine = tube([[-6.2, 1.9, 1.2], [5.9, 1.9, 1.2]], 0x8ff0ff, .03);
    S.enemy = makeSub(-4.5, 6.6, -6, .32); S.enemy.parts.forEach(p => p.children[1].material = K.wire(new THREE.BoxGeometry(.01, .01, .01), RED).children[1].material);
    S.target = new THREE.Mesh(new THREE.RingGeometry(1.0, 1.08, 48), new THREE.MeshBasicMaterial({ color: RED, side: THREE.DoubleSide })); S.target.position.set(-4.5, 6.6, -5.8); K.scene.add(S.target);
    S.missile = group(0, 0, 0); cyl(.12, .9, 0, 0, 0, S.missile, GOLD, 8); const mc = wire(new THREE.ConeGeometry(.12, .3, 8), GOLD, S.missile); mc.position.y = .6;
    S.mast = cyl(.06, 1.2, 3.0, 0, -1, undefined, INK, 8);
    S.eye = new THREE.Mesh(new THREE.RingGeometry(.25, .3, 32), new THREE.MeshBasicMaterial({ color: WHITE, side: THREE.DoubleSide })); K.scene.add(S.eye);
    S.diver = fig(0x4a6482, undefined, 1.1);

    // --- B: slices ---
    S.B = makeSub(20, 3.2, -1);
    S.widthLine = tube([[25.6, 3.2 - R, -1 + 0.01], [25.6, 3.2 + R, -1 + 0.01]], 0xffd15a, .035);

    // --- C: fill one slice, then barge it ---
    S.ringC = group(40, 2.5, -1);
    { const s = wire(new THREE.CylinderGeometry(2.0, 2.0, 1.8, 32, 1, true), INK, S.ringC); s.rotation.x = Math.PI / 2; s.children[0].material = new THREE.MeshBasicMaterial({ color: 0x05162c, side: THREE.BackSide }); }
    S.payload = [];
    const P = (o, tx, ty) => { o.userData.t = [tx, ty]; S.payload.push(o); return o; };
    for (let i = 0; i < 3; i++) P(cyl(.09, 1.7, 0, 0, 0, S.ringC, CYAN, 8), -1.1 + i * .35, 1.25).rotation.x = Math.PI / 2;
    for (let i = 0; i < 3; i++) P(cyl(.05, 1.7, 0, 0, 0, S.ringC, GOLD, 6), .7 + i * .25, 1.35).rotation.x = Math.PI / 2;
    for (let i = 0; i < 3; i++) P(box(1.1, .16, 1.5, 0, 0, 0, S.ringC, WHITE), -.8, -.9 + i * .45);
    for (let i = 0; i < 3; i++) P(box(1.1, .16, 1.5, 0, 0, 0, S.ringC, WHITE), .8, -.9 + i * .45);
    P(box(3.4, .06, 1.7, 0, 0, 0, S.ringC, INK), 0, -1.3);
    S.payload.forEach(o => { o.position.set(o.userData.t[0], o.userData.t[1], 0); });
    S.barge = box(3.4, .35, 2.2, 0, 0, 0, undefined, INK);
    S.yardA = group(35.2, 0, -2.4); box(1.6, 3.2, 1.6, 0, 1.6, 0, S.yardA, INK); box(3.2, .2, .2, .9, 3.3, 0, S.yardA, INK);
    S.yardB = group(46.6, 0, -2.4); box(1.6, 3.2, 1.6, 0, 1.6, 0, S.yardB, INK); box(3.2, .2, .2, -.9, 3.3, 0, S.yardB, INK);
    S.water = tube(Array.from({ length: 30 }, (_, i) => [33 + i * .5, .35 + Math.sin(i * .9) * .05, .8]), 0x3aa8ff, .03);

    // --- D: join ---
    S.D = makeSub(60, 3.2, -1);
    S.sparks = []; for (let i = 0; i < 9; i++) { const m = new THREE.Mesh(new THREE.SphereGeometry(.11, 8, 6), new THREE.MeshBasicMaterial({ color: 0xffe08a })); m.position.set(60 - 4 + i, 3.2 + R, -1 + R * .3); K.scene.add(m); S.sparks.push(m); }

    // --- E: depth ---
    S.E = makeSub(80, 9, -1, .42);
    S.surface = tube(Array.from({ length: 40 }, (_, i) => [74 + i * .3, 10.2 + Math.sin(i * .8) * .07, -1]), 0x8ff0ff, .035);
    S.ruler = tube([[83.6, 10.2, -1], [83.6, 1.2, -1]], 0x8ff0ff, .025);
    for (let i = 0; i <= 8; i++) box(i % 4 === 0 ? .5 : .25, .04, .04, 83.6, 10.2 - i * 1.125, -1, undefined, CYAN);
    S.arrows = []; for (let i = 0; i < 8; i++) { const a = wire(new THREE.ConeGeometry(.18, .5, 6), RED); a.userData.a = i / 8 * Math.PI * 2; S.arrows.push(a); }

    // --- F: crew formation + SEALs ---
    S.F = makeSub(100, 1.0, -4.6, .8); S.F.G.rotation.y = .12;
    S.crew = [];
    for (let r = 0; r < 9; r++) for (let c = 0; c < 15; c++) { const f = fig(r === 0 ? 0x9a7420 : 0x4a6482); f.position.set(100 - 2.66 + c * .38, 0, -2.6 + (8 - r) * .44 - 1.2 + 1.4); S.crew.push(f); }
    S.crew.sort((a, b) => a.position.z - b.position.z || a.position.x - b.position.x);  // back rows first... front row (officers) last
    S.seals = []; for (let i = 0; i < 9; i++) S.seals.push(fig(0x2f8fae, undefined, 1.2));
    S.hatch = new THREE.Vector3(100 + 1.2, 1.0 + R * .8 + .1, -4.6);

    // --- G: deployment months ---
    S.months = []; for (let i = 0; i < 6; i++) { const b = box(.9, .9, .9, 117.75 + (i % 3) * 1.25, 0, -1, undefined, i < 6 ? GOLD : INK); b.userData.y = i < 3 ? 5.0 : 3.7; S.months.push(b); }
    S.calFrame = box(4.2, 3.0, .2, 119, 4.35, -1.7, undefined, INK);

    // --- H: reactor + supplies ---
    S.vessel = cyl(1.1, 2.6, 138.4, 2.6, -1, undefined, INK, 14);
    S.core = cyl(.55, 1.8, 138.4, 2.6, -1, undefined, GOLD, 12);
    S.water2 = K.bar(.9, .9, 141.6, -1, undefined, CYAN);
    S.oxy = K.bar(.9, .9, 142.9, -1, undefined, CYAN);
    S.food = K.bar(.9, .9, 144.2, -1, undefined, GOLD);
    S.foodRed = K.bar(.9, .9, 144.2, -1, undefined, RED);
  },

  shots: [
    [0,            [9, 5.0, 8.5],     [0.2, 3.2, -1],   1.6],
    ['reframe+0.8',[7, 4.8, 8],       [0.2, 3.2, -1],   1.0],
    ['setup',      [1.0, 4.0, 13.5],  [0.0, 3.4, -1],   1.0],
    ['job',        [1.0, 4.8, 11.5],  [-0.8, 4.6, -2],   .8],
    ['step1',      [26.5, 4.4, 6.5],  [20.8, 3.2, -1],  1.4],
    ['cut',        [22.5, 4.8, 10.5], [20.2, 3.2, -1],  1.0],
    ['step2',      [40.6, 3.0, 9.5],  [40, 2.6, -1],    1.2],
    ['barge',      [41.2, 3.4, 12],   [41, 2.4, -1],    1.0],
    ['step3',      [66.5, 4.2, 6.5],  [60.6, 3.2, -1],  1.2],
    ['catch',      [80.6, 6.2, 12.5], [80.8, 5.8, -1],   .8],
    ['crew',       [100, 8.6, 5.6],   [100, -1.8, -3.2], 1.0],
    ['team',       [102.6, 3.4, 6.5], [101.2, 2.6, -4], 1.0],
    ['deploy',     [119, 4.4, 10.5],  [119, 4.3, -1],   1.0],
    ['reactor',    [139, 3.4, 10.5],  [138.6, 3.0, -1], 1.0],
    ['make',       [143.2, 3.4, 10.5],[142.9, 3.0, -1], 1.0],
    ['punch',      [9, 5.4, 8.5],     [0.2, 3.8, -1],   1.0],
  ],

  cards: [
    { l: 'Price of one sub', v: '$0', a: [0.5, 7.4, -1], t0: 0.15, t1: 'reframe+0.8', count: [0, 5000000000, 0.3, 3.2] },
    { v: 'NUCLEAR CITY', cls: 'big', a: [0.5, 7.4, -1], t0: 'reframe+0.8', t1: 'setup' },
    { v: 'VIRGINIA-CLASS', cls: 'tag', a: [2.6, 6.2, -1], t0: 'setup', t1: 'job' },
    { l: 'Length', v: '377 FT', cls: 'cyan', a: [-2.4, 5.6, -1], t0: 'size', t1: 'job' },
    { v: 'HUNT SUBS', cls: 'red', a: [-1.2, 8.6, -4], t0: 'job', t1: 'strike' },
    { v: 'LAUNCH MISSILES', a: [-1.2, 8.6, -4], t0: 'strike', t1: 'spy' },
    { v: 'SPY', cls: 'white', a: [-1.2, 8.6, -4], t0: 'spy', t1: 'seals' },
    { v: 'SPECIAL FORCES', cls: 'cyan', a: [-1.2, 8.6, -4], t0: 'seals', t1: 'step1' },
    // slices
    { l: 'Hull width', v: '34 FT', a: [25.6, 5.0, -1], t0: 'tube+0.4', t1: 'cut' },
    { v: '10 SLICES', cls: 'cyan', a: [20.2, 5.6, -1], t0: 'cut+0.6', t1: 'step2' },
    // fill + barge
    { l: 'Packed in', v: 'PIPES · WIRES · BUNKS', cls: 'cyan', a: [40, 5.4, -1], t0: 'fill+0.4', t1: 'barge' },
    { v: 'ELECTRIC BOAT', cls: 'tag', a: [35.2, 4.3, -2.4], t0: 'barge', t1: 'step3' },
    { v: 'NEWPORT NEWS', cls: 'tag', a: [46.6, 4.3, -2.4], t0: 'barge+0.3', t1: 'step3' },
    // join
    { v: 'ONE SEALED HULL', cls: 'cyan', a: [60.4, 5.6, -1], t0: 'join+1.0', t1: 'years' },
    { l: 'Start to finish', v: '', cls: 'red big', a: [60.4, 6.0, -1], t0: 'years', t1: 'catch', count: [0, 9, 'years', 1.4], fmt: n => '≈ ' + Math.round(n) + ' YRS' },
    // depth
    { l: 'Depth', v: '', cls: 'cyan', a: [86.4, 9.0, -1], t0: 'deep', t1: 'crew', count: [0, 800, 'deep', 1.8], fmt: n => Math.round(n) + (n > 799 ? '+' : '') + ' FT' },
    { l: 'Water pressure', v: '25×', cls: 'red big', a: [80.0, 6.0, 1], t0: 'pressure+0.4', t1: 'crew' },
    // crew
    { l: 'Sailors', v: '', cls: 'big', a: [100, 4.6, -1], t0: 'crew+0.2', t1: 'ranks', count: [0, 135, 'crew+0.4', 3.2], fmt: n => String(Math.round(n)) },
    { l: 'Officers', v: '15', a: [97.0, 3.6, 0.6], t0: 'ranks', t1: 'team' },
    { l: 'Enlisted', v: '120', cls: 'white', a: [102.6, 3.6, -1.5], t0: 'ranks+1.2', t1: 'team' },
    { v: 'NAVY SEALS', cls: 'tag', a: [101.2, 5.4, -4.6], t0: 'team', t1: 'deploy' },
    { l: 'Airlock', v: '9 AT A TIME', cls: 'cyan', a: [101.2, 6.3, -4.6], t0: 'lockout+0.4', t1: 'deploy' },
    // deployment
    { l: 'One deployment', v: '≈ 6 MONTHS', a: [119, 7.0, -1], t0: 'deploy+0.3', t1: 'reactor' },
    // reactor + supplies
    { l: 'Reactor · no refueling', v: '', a: [138.4, 6.4, -1], t0: 'reactor+0.2', t1: 'make', count: [0, 33, 'reactor+0.4', 1.8], fmt: n => Math.round(n) + ' YEARS' },
    { v: 'WATER ✓   OXYGEN ✓', cls: 'cyan', a: [142.3, 5.6, -1], t0: 'make+0.3', t1: 'punch' },
    { l: 'Food runs out', v: '≈ 90 DAYS', cls: 'red', a: [143.4, 4.0, 1], t0: 'food+0.4', t1: 'punch' },
  ],

  steps: { title: 'HOW IT\'S BUILT', labels: ['SLICES', 'FILL', 'JOIN'], marks: ['step1', 'step2', 'step3'], from: 'step1', to: 'catch' },
  receipt: { from: 'punch', to: 'cta', title: 'SPEC SHEET', rows: [
    ['LENGTH', '377 FT'], ['WIDTH', '34 FT'], ['COST', '≈ $5 BILLION'], ['BUILD TIME', '≈ 9 YEARS'],
    ['CREW', '135 + SEALS'], ['DEPTH', '800+ FT'], ['REAL LIMIT', 'LUNCH', 'k']] },
  follow: { from: 'cta+0.2', title: 'MORE HOW IT\'S BUILT' },
  shakes: [['pressure+0.3', .6, .06]],
  flashes: [],

  update(t, K) {
    const { at, T, ease, easeOut, clamp01, prog, fly } = K, S = this.s;
    // A: hero glide + x-ray city
    S.A.G.position.x = -0.6 + t * .08 * (t < at('punch') ? 1 : 0) + (t >= at('punch') ? 0 : 0); S.A.G.position.y = 3.2 + Math.sin(t * .9) * .08;
    const xa = t > T('reframe+0.8') && t < at('step1'); S.xray(S.A, xa); S.cityA.visible = xa;
    S.reactorA.children[1].material.color.setHex(Math.sin(t * 6) > 0 ? 0xffe08a : 0xffc548);
    K.drawTube(S.dimLine, prog(t, 'size', 1.0) * (t < at('job') ? 1 : 0));
    const onJob = t > at('job') && t < at('step1');
    S.enemy.G.visible = S.target.visible = onJob; S.target.scale.setScalar(1 + .15 * Math.sin(t * 8)); S.target.lookAt(K.camera.position);
    const mp = prog(t, 'strike', 1.0); S.missile.visible = mp > 0 && mp < 1 && onJob;
    S.missile.position.set(S.A.G.position.x + 1.5, 3.8 + mp * 6, -1);
    S.mast.position.set(S.A.G.position.x + 3.0, 3.2 + R_(0) + .4 + .9 * easeOut(prog(t, 'spy', .5)), -1); S.mast.visible = onJob && t > at('spy');
    S.eye.visible = onJob && t > T('spy+0.3'); S.eye.position.set(S.mast.position.x, S.mast.position.y + .9, -0.9); S.eye.lookAt(K.camera.position); S.eye.scale.setScalar(1 + .3 * Math.sin(t * 7));
    const dp = prog(t, 'seals', 1.6); S.diver.visible = onJob && dp > 0;
    S.diver.position.set(S.A.G.position.x + 1.2 + dp * .8, 3.2 + .6 + dp * 1.2, -1 + dp * .6);
    function R_() { return .62; }
    // skins: hero/depth/crew subs always smooth; slices set never; join set once welded
    S.A.skin.visible = !xa; S.E.skin.visible = S.F.skin.visible = true; S.B.skin.visible = false;
    S.D.skin.visible = t > T('join+2.2');
    // B: slices spread apart on "cut"
    const sp = easeOut(prog(t, 'cut', 1.4)) - easeOut(prog(t, 'step2', .6)) * 0;
    S.B.slices.forEach((s, i) => { s.position.x = s.userData.x0 + (i - 4.5) * .55 * sp; s.position.y = Math.sin(i * 1.7) * .25 * sp; });
    S.B.nose.position.x = 5 + 5 * .55 * sp; S.B.tail.position.x = -6.2 - 5 * .55 * sp; S.B.tailGrp.position.x = -5 * .55 * sp; S.B.sail.position.x = 3.0 + 2.5 * .55 * sp;
    K.drawTube(S.widthLine, prog(t, 'tube', .6));
    // C: payload flies into the ring, then the ring rides a barge between yards
    S.payload.forEach((o, i) => { const u = easeOut(clamp01((t - at('fill') - i * .12) / .5)); o.visible = u > 0;
      o.position.set(o.userData.t[0] * u + (1 - u) * (i % 2 ? 4 : -4), o.userData.t[1] + (1 - u) * 3, 0); });
    const bp = ease(prog(t, 'barge+0.4', 2.4)), onB = t > at('barge');
    S.barge.visible = onB; S.water.visible = onB;
    if (onB) { S.ringC.scale.setScalar(.55); S.ringC.position.set(36.6 + 8.6 * bp, .35 + .18 + 2.0 * .55, -.2); S.barge.position.set(36.6 + 8.6 * bp, .2, -.2); }
    else { S.ringC.scale.setScalar(1); S.ringC.position.set(40, 2.5, -1); }
    S.yardA.visible = S.yardB.visible = onB;
    // D: slices slide together, welds spark
    const jp = easeOut(prog(t, 'join', 2.2));
    S.D.slices.forEach((s, i) => { s.position.x = s.userData.x0 + (i - 4.5) * .55 * (1 - jp); });
    S.D.nose.position.x = 5 + 2.75 * (1 - jp); S.D.tail.position.x = -6.2 - 2.75 * (1 - jp); S.D.tailGrp.position.x = -2.75 * (1 - jp); S.D.sail.position.x = 3.0 + 1.4 * (1 - jp);
    S.sparks.forEach((m, i) => { const k = clamp01((t - T('join+1.6') - i * .12) / .5); m.visible = k > 0 && k < 1; m.scale.setScalar(1 + 2 * Math.sin(k * Math.PI)); });
    // E: dive
    const dv = ease(prog(t, 'deep', 1.8)); S.E.G.position.y = 9 - 4.8 * dv;
    const pr = prog(t, 'pressure', .6);
    S.arrows.forEach(a => { const r = 1.5 - .4 * Math.abs(Math.sin(t * 4)) * pr; a.visible = pr > 0;
      a.position.set(80 + Math.cos(a.userData.a) * r * 1.4, S.E.G.position.y + Math.sin(a.userData.a) * r, -1); a.rotation.z = a.userData.a + Math.PI / 2; });
    // F: crew pops in by count, then SEALs leave through the hatch
    const n = Math.round(135 * easeOut(clamp01((t - T('crew+0.4')) / 3.2)));
    S.crew.forEach((f, i) => { f.visible = i < n && t < at('team'); f.scale.setScalar(1 + (t > at('ranks') && t < T('ranks+1.2') && i >= 120 ? .25 * Math.abs(Math.sin(t * 6)) : 0)); });
    S.seals.forEach((f, i) => { const st = T('lockout+0.2') + i * .35; if (t < at('team')) { f.visible = false; return; }
      if (t < st) { f.visible = true; f.position.copy(S.hatch).add(new THREE.Vector3(-.5 + (i % 5) * .25, -.2 - Math.floor(i / 5) * .0, 0)); f.visible = false; return; }
      fly(f, t, st, 1.2, S.hatch, new THREE.Vector3(S.hatch.x - 2.4 + i * .6, 5.0 + (i % 3) * .3, -3.4), .8); if (t > st + 1.2) { f.visible = true; f.position.set(S.hatch.x - 2.4 + i * .6, 5.0 + (i % 3) * .3, -3.4); } });
    // G: months fill
    S.months.forEach((b, i) => { const k = K.pop(clamp01((t - T('deploy+0.5') - i * .2) / .35)); b.visible = k > 0; b.scale.setScalar(Math.max(.01, k)); b.position.y = b.userData.y; });
    // H: reactor glow, tanks fill, food drains
    S.core.scale.y = 1 + .04 * Math.sin(t * 5);
    const wf = easeOut(prog(t, 'make', 1.2)); S.water2.visible = S.oxy.visible = t > at('make');
    K.setBar(S.water2, .2 + 2.6 * wf); K.setBar(S.oxy, .2 + 2.6 * easeOut(prog(t, 'make+0.4', 1.2)));
    const fd = 2.8 - 2.4 * ease(prog(t, 'food+0.2', 2.6)); K.setBar(S.food, fd); K.setBar(S.foodRed, fd);
    S.food.visible = t < T('food+1.4'); S.foodRed.visible = !S.food.visible;
  },
};
