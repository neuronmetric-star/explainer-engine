// Why the fuck is the ocean blue if water is clear? — BLUEPRINT look (science)
// Sets: glass vs ocean x=0 | H2O molecule x=30 | prism x=60 | water column x=90 | diver x=120 | coast x=150 | glass vs depth x=180
window.SCENE = {
  style: 'blueprint',
  distance: 1,
  build(K) {
    const { box, cyl, group, wire, glow, line, GOLD, RED, WHITE, BLUE, CYAN, SILVER } = K;
    const S = this.s = {};
    const SPEC = [0xff3b30, 0xff9500, 0xffd60a, 0x34c759, 0x2f8bff];
    S.SPEC = SPEC;
    const waves = (w, d, x, y, z, segX = 40, segZ = 16, col = CYAN) => {
      const geo = new THREE.PlaneGeometry(w, d, segX, segZ); geo.rotateX(-Math.PI / 2);
      const m = new THREE.Mesh(geo, new THREE.MeshBasicMaterial({ color: K.col(col), wireframe: true, transparent: true, opacity: .75 }));
      m.position.set(x, y, z); K.scene.add(m); m.userData.base = Float32Array.from(geo.attributes.position.array); return m; };
    S.waveMeshes = [];
    const glass = (x, y, z, s = 1) => { const g = group(x, y, z); g.scale.setScalar(s);
      wire(new THREE.CylinderGeometry(1, .82, 2.6, 28, 1, true), WHITE, g); glow(new THREE.CylinderGeometry(.95, .8, 1.9, 28), 0xbfe6ff, g, .16, 0, -.3, 0);
      const top = []; for (let a = 0; a <= 40; a++) top.push([Math.cos(a / 40 * 6.283) * .94, .65, Math.sin(a / 40 * 6.283) * .94]); line(top, 0xbfe6ff, g, 2);
      return g; };

    // ---------- SET 1 (x=0): a clear glass in front of a deep blue ocean block ----------
    S.glass1 = glass(-1.6, 1.3, 3, 1.15);
    const O = group(2.5, 0, -4);
    const layers = 10; for (let i = 0; i < layers; i++) { const c = new THREE.Color(0x2f9bff).lerp(new THREE.Color(0x020a24), i / (layers - 1));
      glow(new THREE.BoxGeometry(12, 7 / layers, 6), c.getHex(), O, .9, 0, 7 - (i + .5) * 7 / layers, 0); }
    box(12, 7, 6, 0, 3.5, 0, O, CYAN);
    S.waveMeshes.push(waves(12, 6, 2.5, 7.05, -4));
    S.sun1 = glow(new THREE.CircleGeometry(1.4, 32), 0xfff1b8, undefined, 1, 8, 12, -14);

    // ---------- SET 2 (x=30): the water molecule ----------
    S.mol = group(30, 5, -1);
    const O2 = wire(new THREE.IcosahedronGeometry(1.4, 1), RED, S.mol);
    S.H = [-1, 1].map(sx => { const h = wire(new THREE.IcosahedronGeometry(.8, 1), WHITE, S.mol); h.position.set(sx * 1.55, -1.25, 0); return h; });
    S.bonds = [-1, 1].map(sx => line([[0, 0, 0], [sx * 1.55, -1.25, 0]], SILVER, S.mol, 6));
    S.molGlow = glow(new THREE.SphereGeometry(3.4, 24, 16), 0x2f8bff, S.mol, .12);

    // ---------- SET 3 (x=60): white light splits into colours ----------
    S.sun3 = glow(new THREE.IcosahedronGeometry(1.2, 2), 0xfff1b8, undefined, 1, 53.5, 9, -1);
    const pr = new THREE.CylinderGeometry(1.3, 1.3, 1.6, 3); pr.rotateX(Math.PI / 2);
    S.prism = wire(pr, WHITE); S.prism.position.set(59, 6, -1);
    const pts = (a, b, n = 24) => Array.from({ length: n }, (_, i) => [a[0] + (b[0] - a[0]) * i / (n - 1), a[1] + (b[1] - a[1]) * i / (n - 1), a[2]]);
    S.white = line(pts([54.5, 8.6, -1], [58.4, 6.3, -1]), WHITE, undefined, 8);
    S.split = SPEC.map((c, i) => line(pts([59.6, 5.9, -1], [64.5, 7.8 - i * 1.15, -1]), c, undefined, 8));

    // ---------- SET 4 (x=90): the water column (depth is not to scale) ----------
    const W = group(90, 0, -1); const L4 = 14;
    for (let i = 0; i < L4; i++) { const c = new THREE.Color(0x2a8cff).lerp(new THREE.Color(0x01040e), Math.pow(i / (L4 - 1), .8));
      glow(new THREE.BoxGeometry(6, 12 / L4, 3), c.getHex(), W, .55, 0, 12 - (i + .5) * 12 / L4, 0); }
    box(6, 12, 3, 0, 6, 0, W, CYAN);
    S.waveMeshes.push(waves(6, 3, 90, 12.05, -1, 24, 10));
    S.BEAM_L = [1.4, 2.6, 4.0, 6.0, 10.6];
    S.beams = SPEC.map((c, i) => { const b = glow(new THREE.BoxGeometry(.42, 1, .42), c, undefined, .9); b.position.set(87.9 + i * 1.05, 12, .95); return b; });
    S.beamsIn = SPEC.map((c, i) => { const b = glow(new THREE.BoxGeometry(.42, 1, .42), c, undefined, .9); b.position.set(87.9 + i * 1.05, 12.8, .95); b.scale.y = 1.6; return b; });
    // depth ruler
    const ruler = [[11.0, '5 M'], [5.5, '200 M'], [1.4, '1,000 M']];
    S.ticks = ruler.map(([y]) => box(.8, .08, .08, 86.2, y, .6, undefined, WHITE));
    S.rulerY = ruler;
    // scatter particles for blue
    S.scat = []; for (let i = 0; i < 26; i++) { const p = glow(new THREE.SphereGeometry(.09, 6, 4), 0x6fb8ff, undefined, 1); p.visible = false; S.scat.push(p); }
    // the eye above the surface
    S.eye = group(94.5, 15.6, -1); wire(new THREE.SphereGeometry(.7, 14, 10), WHITE, S.eye, { angle: 10 });
    glow(new THREE.CircleGeometry(.35, 24), 0x2f8bff, S.eye, 1, 0, 0, .71); glow(new THREE.CircleGeometry(.15, 16), 0x000000, S.eye, 1, 0, 0, .72);
    S.ray = line(pts([92.1, 4.5, 1.1], [94.3, 15, -1], 30), 0x6fb8ff, undefined, 6);

    // ---------- SET 5 (x=120): Sam the diver ----------
    for (let i = 0; i < 8; i++) { const c = new THREE.Color(0x2a8cff).lerp(new THREE.Color(0x0a3a8a), i / 7); glow(new THREE.PlaneGeometry(16, 1.4), c.getHex(), undefined, .9, 120, 11 - i * 1.4, -4); }
    S.waveMeshes.push(waves(16, 6, 120, 11.7, -2, 40, 12));
    S.sam = group(120, 4.6, 0); S.sam.rotation.z = -Math.PI / 2 + .15;
    const body = K.person(0, 0, { scale: .9, color: 0x5d7fa6 }); S.sam.add(body); body.position.set(0, -1.3, 0);
    box(.6, 1.2, .5, -.0, .2, -.55, S.sam, SILVER);
    S.fins = [-.22, .22].map(z => { const f = glow(new THREE.BoxGeometry(.5, 1.4, .12), SPEC[0], S.sam, 1); f.position.set(0, -2.1, z + .1); f.rotation.x = Math.PI / 2; return f; });
    S.bubbles = []; for (let i = 0; i < 10; i++) { const b = wire(new THREE.IcosahedronGeometry(.1 + (i % 3) * .05, 0), WHITE); S.bubbles.push(b); }
    S.redCard = glow(new THREE.PlaneGeometry(1.2, .7), SPEC[0], undefined, 1, 115, 9.4, -2);

    // ---------- SET 6 (x=150): coastal water ----------
    const shore = [[-8, 0], [8, 0], [8, 1.2], [2, 3.2], [-8, 3.2]];
    K.extrude(shore, 4, 157, 0, -3, undefined, GOLD);
    for (let i = 0; i < 6; i++) { const c = new THREE.Color(0x2f9b6a).lerp(new THREE.Color(0x6b5a2a), i / 5); glow(new THREE.BoxGeometry(2.2, 3.2, 4), c.getHex(), undefined, .55, 141.6 + i * 1.4, 1.6, -1); }
    S.waveMeshes.push(waves(9, 4, 145.5, 3.25, -1, 24, 10, 0x7fe0b0));
    S.plank = []; for (let i = 0; i < 40; i++) { const p = glow(new THREE.SphereGeometry(.07 + (i % 3) * .03, 6, 4), i % 3 ? 0x5dff9a : 0xc9a46a, undefined, 1); S.plank.push(p); }

    // ---------- SET 7 (x=180): a glass vs the ocean's average depth ----------
    S.glass7 = glass(178.4, 1.3, 0, .8);
    S.depthBar = box(1.6, 1, 1.6, 181.5, 0, 0, undefined, BLUE); S.depthBar.userData.body.material = S.depthBar.userData.body.material.clone(); S.depthBar.userData.body.material.color.set(K.col(0x0c3a8a));
    S.pers = K.person(176, 1, { scale: .7 });
  },

  shots: [
    [0,          [-2, 4.6, 15.5],  [1, 3.8, -2],    2.5],
    ['blue',     [30, 5, 11],      [30, 4.6, -1],   1.5],
    ['setup',    [59.5, 6.5, 13.5],[59.5, 6.3, -1], 1],
    ['step1',    [91, 8.4, 20],    [90.5, 8.2, -1], 1.5],
    ['sam',      [119, 6.5, 12],   [119, 5.6, -1],  1.2],
    ['step2',    [91, 8, 20],      [90.5, 7.6, -1], 1.5],
    ['eye',      [92, 11.5, 13],   [92.5, 10.5, -1],1],
    ['catch',    [148, 5.5, 16],   [148, 3, -1],    1.5],
    ['math',     [89, 6.4, 17],    [90, 5.6, -1],   1.5],
    ['contrast', [179, 2.6, 9],    [179.5, 1.8, 0], 1],
    ['ocean',    [184, 30, 72],    [181, 22, 0],    6],
    ['punch',    [-2, 5, 18],      [1, 4, -2],      1.5],
  ],

  cards: [
    { l: 'Glass of water', v: 'CLEAR', cls: 'white', a: [-1.6, 6.2, 3], t0: 0, t1: 'reframe' },
    { l: 'The ocean', v: 'BLUE', cls: 'blue big', a: [3.6, 9.4, -4], t0: 0.4, t1: 'reframe' },
    { l: 'Reflecting the sky?', v: 'NO ✕', cls: 'red', a: [2.5, 9.4, -4], t0: 'reframe', t1: 'blue' },
    { l: 'H₂O itself is', v: 'SLIGHTLY BLUE', cls: 'blue', a: [30, 9.2, -1], t0: 'blue+0.3', t1: 'setup' },
    { l: 'Sunlight', v: 'ALL COLOURS', cls: 'white', a: [59.5, 10.6, -1], t0: 'setup+0.3', t1: 'step1' },
    { l: 'Water absorbs', v: 'RED FIRST', cls: 'red', a: [90.5, 6.5, 2], t0: 'absorb+0.3', t1: 'sam' },
    { v: 'SAM', cls: 'tag white', a: [121.8, 6.6, 0], t0: 'sam', t1: 'step2' },
    { l: 'At 5 m', v: '−90% RED', cls: 'red', a: [116.6, 8.0, 1], t0: '5m+0.4', t1: 'step2' },
    { l: 'His red fins look', v: 'BROWN', cls: 'white', a: [119, 2.0, 1], t0: 'brown+0.2', t1: 'step2' },
    { v: 'ORANGE → YELLOW → GREEN', cls: 'white', a: [90, 2.6, 2], t0: 'fade+0.4', t1: 'step3' },
    { l: 'Travels farthest', v: 'BLUE', cls: 'blue big', a: [90, 2.6, 2], t0: 'step3+0.3', t1: 'eye' },
    { l: 'Near the coast', v: 'PLANKTON + MUD', cls: 'white', a: [148, 7.6, -1], t0: 'coast', t1: 'math' },
    { v: '200 M', cls: 'tag white', a: [85.2, 5.5, .6], t0: 'math', t1: 'contrast' },
    { l: 'Below 200 m', v: 'HARDLY ANY LIGHT', cls: 'white', a: [91, 8.4, 1.6], t0: 'math+0.2', t1: 'dark' },
    { v: '1,000 M', cls: 'tag', a: [85.2, 1.4, .6], t0: 'dark', t1: 'contrast' },
    { l: 'Below 1,000 m', v: 'TOTAL DARKNESS', cls: 'red', a: [91, 8.4, 1.6], t0: 'dark+0.2', t1: 'contrast' },
    { l: 'Your glass', v: '10 CM', cls: 'white', a: [178.4, 4.4, 0], t0: 'contrast+0.2', t1: 'ocean' },
    { l: 'Average ocean depth', v: '0 M', cls: 'blue big', a: [181, 28, 0], t0: 'ocean+0.3', t1: 'punch', count: [0, 3700, 'ocean+0.3', 1.4], fmt: n => Math.round(n).toLocaleString('en-US') + ' M' },
    { v: '37,000× DEEPER', cls: 'white', a: [181, 17, 0], t0: 'ocean+1.8', t1: 'punch' },
  ],

  steps: { title: 'WHERE THE COLOURS GO', labels: ['RED', 'FADE', 'BLUE'], marks: ['step1', 'step2', 'step3'], from: 'step1', to: 'catch' },
  receipt: { from: 'punch', to: 'cta', title: 'WHY IT LOOKS BLUE', rows: [
    ['SUNLIGHT', 'ALL COLOURS'], ['RED AT 5 M', '−90%', 'k'], ['LAST ONE LEFT', 'BLUE', 'g'], ['DARK BELOW', '1,000 M'], ['YOUR GLASS', '10 CM'], ['AVG OCEAN', '3,700 M', 'g']] },
  follow: { from: 'cta+0.2', title: 'MORE WHY THE F*CK SCIENCE' },
  shakes: [], flashes: [],

  update(t, K) {
    const { at, T, ease, easeOut, clamp01 } = K, S = this.s;
    // animated wave surfaces (pure function of t)
    S.waveMeshes.forEach((m, k) => { const p = m.geometry.attributes.position, b = m.userData.base;
      for (let i = 0; i < p.count; i++) { const x = b[i * 3], z = b[i * 3 + 2]; p.array[i * 3 + 1] = .14 * Math.sin(x * 1.3 + t * 2.2 + k) + .1 * Math.sin(z * 2.1 - t * 1.7) + .05 * Math.sin((x + z) * 3 + t * 3); }
      p.needsUpdate = true; });
    // molecule wobbles (it absorbs red by vibrating)
    S.mol.rotation.y = Math.sin(t * .8) * .6; S.H.forEach((h, i) => { const s = i ? 1 : -1; h.position.set(s * (1.55 + .08 * Math.sin(t * 9)), -1.25 + .06 * Math.sin(t * 9 + i), 0); });
    S.bonds.forEach((l, i) => { const s = i ? 1 : -1; l.geometry.setPositions([0, 0, 0, s * (1.55 + .08 * Math.sin(t * 9)), -1.25 + .06 * Math.sin(t * 9 + i), 0]); });
    // prism: white beam, then colours fan out as they are named
    K.setLine(S.white, easeOut(clamp01((t - at('setup')) / .6)));
    S.split.forEach((l, i) => K.setLine(l, easeOut(clamp01((t - at('rainbow') - i * .32) / .5))));
    S.prism.rotation.z = Math.sin(t * .7) * .06;
    // water column: beams descend, then get cut off colour by colour
    const enter = easeOut(clamp01((t - at('step1') + .2) / 1.4));
    S.beams.forEach((b, i) => {
      let L = S.BEAM_L[4] * enter;
      if (i === 0) L = Math.min(L, S.BEAM_L[4] - (S.BEAM_L[4] - S.BEAM_L[0]) * ease(clamp01((t - at('absorb') - .2) / .8)));
      if (i >= 1 && i <= 3) L = Math.min(L, S.BEAM_L[4] - (S.BEAM_L[4] - S.BEAM_L[i]) * ease(clamp01((t - at('fade') - (i - 1) * .45) / .7)));
      b.scale.y = Math.max(.01, L); b.position.y = 12 - L / 2; b.visible = t > at('step1') - .2;
    });
    S.beamsIn.forEach(b => b.visible = t > at('step1') - .2);
    // blue scatters around and bounces up to the eye
    S.scat.forEach((p, i) => { const q = ((t - at('bounce')) * .7 + i / 26) % 1; p.visible = t > at('bounce') && t < at('catch');
      const a = i * 2.4; p.position.set(92.1 + Math.cos(a) * q * 2.4, 4 + Math.sin(a * 1.3) * q * 3, 1.1 + Math.sin(a) * .3); });
    K.setLine(S.ray, easeOut(clamp01((t - at('eye')) / .7)));
    S.eye.scale.setScalar(1 + .12 * Math.max(0, Math.sin((t - at('eye')) * 6)) * (t > at('eye') ? 1 : 0));
    // diver: swims, red fins turn brown on '5m'/'brown'
    S.sam.position.x = 120 + Math.sin(t * .6) * .8; S.sam.position.y = 4.6 + Math.sin(t * 1.1) * .25;
    const br = ease(clamp01((t - at('5m') - .4) / 1.6)); const fc = new THREE.Color(0xff3b30).lerp(new THREE.Color(0x4a3426), br);
    S.fins.forEach((f, i) => { f.material.color.copy(K.col(fc.getHex())); f.rotation.z = Math.sin(t * 6 + i * Math.PI) * .35; });
    S.redCard.material.color.copy(K.col(new THREE.Color(0xff3b30).lerp(new THREE.Color(0x4a3426), br * .5 + .5 * ease(clamp01((t - at('5m') - .4) / 1.6))).getHex()));
    S.redCard.position.y = 11.2 - 6 * ease(clamp01((t - at('5m') + .4) / 1.4)); S.redCard.visible = t > at('sam') + .2;
    S.bubbles.forEach((b, i) => { const q = ((t * .5 + i / 10) % 1); b.position.set(S.sam.position.x + .6 + Math.sin(i * 3 + t * 2) * .2, S.sam.position.y + .5 + q * 6.5, .2); b.visible = q < .97; });
    // coast particles drift
    S.plank.forEach((p, i) => { p.position.set(141 + (i * 1.37) % 8.5 + Math.sin(t * .7 + i) * .2, .3 + (i * .71) % 2.8 + Math.sin(t + i * 2) * .1, 1.2 + (i * .53) % .6); });
    // glass vs ocean: the depth bar shoots up
    const h = 1 + 33 * easeOut(clamp01((t - at('ocean')) / 1.6)); K.setBar(S.depthBar, h);
  },
};
