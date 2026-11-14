// Why the fuck did China build the Great Wall? — PARCHMENT look (history)
// Sets: ridge diorama x=0 | scattered walls x=80 | Li vs raiders x=110 | beacon towers x=140
//       gate + caravan x=170 | map table x=200 | Shanhai Pass x=232 | front door x=264
window.SCENE = {
  style: 'parchment',
  distance: 1,
  build(K) {
    const { box, cyl, roof, group, person, solid, glow, line, extrude, STONE, EARTH, WOOD, RED, GOLD, WHITE, BLUE, INK, FIRE } = K;
    const S = this.s = {};
    const ZW = x => -6 + 3 * Math.sin(x * .09) + 1.6 * Math.sin(x * .23 + 1);
    const edge = (x, z) => K.clamp01((34 - Math.abs(x)) / 6) * K.clamp01((z + 30) / 6) * K.clamp01((14 - z) / 6);
    const H = (x, z) => { const r = Math.exp(-((z - ZW(x)) ** 2) / 30) * 5.2;
      const n = 1.3 * Math.sin(x * .21 + z * .13) + 1.0 * Math.cos(z * .27 - x * .09) + .5 * Math.sin(x * .5 + z * .4);
      return Math.max(0, (r + 1.4 + n * .8) * edge(x, z)); };
    S.H = H; S.ZW = ZW;

    // ---------- crenellated wall piece along a direction ----------
    function wallPiece(x, y, z, ang, len, parent, h = 1.3, col = STONE) {
      const g = group(x, y, z, parent); g.rotation.y = ang;
      box(len, h, 1.1, 0, h / 2 - .35, 0, g, col);
      for (let k = 0; k < 2; k++) { box(len * .32, .32, .2, -len * .25 + k * len * .5, h - .19, .45, g, col); box(len * .32, .32, .2, -len * .25 + k * len * .5, h - .19, -.45, g, col); }
      return g;
    }
    function gatehouse(parent, y) {   // two-tier hall with flared roofs
      box(5.0, 1.5, 2.6, 0, y + .75, 0, parent, 0x9b3a26);
      extrude([[-3.4, 0], [3.4, 0], [2.4, .9], [-2.4, .9]], 3.6, 0, y + 1.5, -1.8, parent, 0x4a2a1a);
      box(3.2, .9, 1.8, 0, y + 2.85, 0, parent, 0x9b3a26);
      extrude([[-2.4, 0], [2.4, 0], [1.3, .8], [-1.3, .8]], 2.6, 0, y + 3.3, -1.3, parent, 0x4a2a1a);
      for (let i = 0; i < 4; i++) box(.18, 1.5, .18, -2.2 + i * 1.47, y + .75, 1.36, parent, 0x5a2014);
    }
    function tower(x, y, z, parent, s = 1, col = STONE) {
      const g = group(x, y, z, parent); g.scale.setScalar(s);
      box(1.7, 2.3, 1.7, 0, .9, 0, g, col); box(2.0, .3, 2.0, 0, 2.15, 0, g, col);
      for (const [a, b] of [[-.8, -.8], [.8, -.8], [-.8, .8], [.8, .8]]) box(.32, .38, .32, a, 2.45, b, g, col);
      box(.4, .6, .06, 0, 1.1, .86, g, INK);
      return g;
    }

    // ---------- SET 1 (x=0): mountain ridge diorama ----------
    const geo = new THREE.PlaneGeometry(70, 44, 90, 56); geo.rotateX(-Math.PI / 2); geo.translate(0, 0, -8);
    const pos = geo.attributes.position, cols = [];
    const cLow = K.col(0x6e7a3c), cHigh = K.col(0xa88758), cTop = K.col(0xc9ae84);
    for (let i = 0; i < pos.count; i++) { const x = pos.getX(i), z = pos.getZ(i), y = H(x, z); pos.setY(i, y);
      const c = cLow.clone().lerp(cHigh, K.clamp01(y / 5)).lerp(cTop, K.clamp01((y - 5) / 2)); cols.push(c.r, c.g, c.b); }
    geo.setAttribute('color', new THREE.Float32BufferAttribute(cols, 3)); geo.computeVertexNormals();
    K.scene.add(new THREE.Mesh(geo, new THREE.MeshStandardMaterial({ vertexColors: true, flatShading: true, roughness: 1 })));
    S.hookWall = [];
    let k = 0;
    for (let x = -31; x < 31; x += .9, k++) {
      const z = ZW(x), z2 = ZW(x + .9), y = Math.min(H(x, z), H(x + .9, z2));
      const ang = -Math.atan2(z2 - z, .9);
      if (k % 9 === 4) S.hookWall.push(tower(x + .45, y - .2, (z + z2) / 2, undefined, .9));
      else S.hookWall.push(wallPiece(x + .45, y, (z + z2) / 2, ang, 1.05));
    }
    // low evening sun behind the range
    glow(new THREE.CircleGeometry(7, 40), 0xffc77a, undefined, 1, 14, 9, -60); glow(new THREE.CircleGeometry(11, 40), 0xb5763a, undefined, .35, 14, 9, -60.5);
    // far mountains for depth
    for (let i = 0; i < 16; i++) { const c = solid(new THREE.ConeGeometry(4 + (i % 4) * 1.5, 6 + (i * 7 % 5) * 1.6, 5), i % 2 ? 0x5a4630 : 0x4a3a28, undefined, -40 + i * 6, 3, -34 - (i % 3) * 3); c.rotation.y = i; }
    S.raidersHook = []; for (let i = 0; i < 5; i++) S.raidersHook.push(horse(6 + i * 2.2, -20 - (i % 2) * 2, undefined, .8));

    // ---------- horse + rider ----------
    function horse(x, z, parent, s = 1, riderCol) {
      const g = group(x, 0, z, parent); g.scale.setScalar(s); const b = group(0, 0, 0, g); g.userData.body = b;
      box(1.7, .7, .6, 0, 1.25, 0, b, WOOD); box(.35, .9, .35, .85, 1.75, 0, b, WOOD).rotation.z = -.5; box(.7, .32, .32, 1.25, 2.15, 0, b, WOOD);
      box(.2, .5, .5, -.95, 1.45, 0, b, INK).rotation.z = .6;
      g.userData.legs = [[-.6, -.2], [-.6, .2], [.6, -.2], [.6, .2]].map(([a, c]) => { const l = group(a, 1.0, c, g); box(.16, 1.0, .16, 0, -.5, 0, l, WOOD); return l; });
      const r = person(0, 0, { scale: .55, color: riderCol || 0x8a3a24 }); r.position.set(-.1, 1.5, 0); b.add(r);
      g.rotation.y = Math.PI / 2;   // faces +z (toward camera / the wall)
      return g;
    }
    S.horse = horse;

    // ---------- SET 2 (x=80): thousands of walls ----------
    S.pieces = [];
    const kinds = [STONE, EARTH, 0xa08a62, 0x8f7350];
    for (let i = 0; i < 18; i++) {
      const tx = 70 + i * 1.2, tz = -2 + Math.sin(i * .5) * 1.2;              // final joined position
      const sx = 72 + ((i * 37) % 17) - 1, sz = -9 + ((i * 53) % 13);          // scattered start
      const p = wallPiece(0, 0, 0, 0, 1.25, undefined, 1.3, kinds[i % 4]); p.userData.s = [sx, sz, (i * 1.7) % 3]; p.userData.e = [tx, tz, 0]; S.pieces.push(p);
    }

    // ---------- SET 3 (x=110): Li on the wall, raiders charge ----------
    const L = group(110, 0, 0);
    box(20, 2.6, 1.8, 0, 1.3, 0, L, STONE); for (let i = 0; i < 20; i++) box(.55, .45, .25, -9.5 + i, 2.82, -.78, L, STONE);
    box(20, .12, 1.4, 0, 2.66, 0, L, 0x9a8462);
    tower(-8, 0, 0, L, 1.4); tower(8, 0, 0, L, 1.4);
    S.li = person(108.2, 0, { scale: .8, color: 0xe9d8b4 }); S.li.position.y = 2.7; S.li.position.z = .1;
    cyl(.04, 2.6, .55, 1.6, 0, S.li, WOOD); solid(new THREE.ConeGeometry(.1, .35, 4), 0xd8d0c0, S.li, .55, 3.05, 0);
    S.raiders = []; for (let i = 0; i < 7; i++) S.raiders.push(horse(102.5 + i * 2.5, -30, undefined, 1.25));

    // ---------- SET 4 (x=140): beacon towers along a ridge ----------
    S.beacons = [];
    for (let i = 0; i < 6; i++) {
      const bx = 136 + i * 2.6, bz = -1 - i * 5.5, by = i * .5;
      if (i) box(2.6, .9, 5.5, bx - 1.3, by - .2, bz + 2.75, undefined, EARTH).rotation.y = -Math.atan2(5.5, 2.6) + Math.PI / 2;
      tower(bx, by, bz, undefined, 1.2);
      const fire = glow(new THREE.ConeGeometry(.45, 1.1, 6), FIRE, undefined, 1, bx, by + 3.5, bz);
      const smoke = []; for (let s = 0; s < 5; s++) smoke.push(glow(new THREE.IcosahedronGeometry(.6, 0), 0xcfc2ac, undefined, .4, bx, by + 4, bz));
      S.beacons.push({ fire, smoke, x: bx, y: by + 3.6, z: bz });
    }
    box(30, .3, 40, 145, -.1, -14, undefined, 0x6b4a2a);

    // ---------- SET 5 (x=170): the gate + Silk Road caravan ----------
    const G = group(170, 0, -2);
    box(8, 3.2, 2, -5.5, 1.6, 0, G); box(8, 3.2, 2, 5.5, 1.6, 0, G);
    box(3.2, 1.0, 2.2, 0, 3.2, 0, G); gatehouse(G, 3.7);
    box(.9, 3.2, 2.2, -1.95, 1.6, 0, G); box(.9, 3.2, 2.2, 1.95, 1.6, 0, G);
    S.chest = box(1.2, .8, .8, 3.4, .4, 2.2, undefined, WOOD); S.chest.position.x = 173.4;
    box(1.25, .2, .85, 173.4, .9, 2.2, undefined, GOLD);
    S.guard = person(171.9, 1.9, { scale: .7, color: 0xe9d8b4 });
    S.caravan = [];
    for (let i = 0; i < 4; i++) { const c = group(170, 0, -14 - i * 3.2); const b = group(0, 0, 0, c); c.userData.body = b;
      box(1.6, .8, .7, 0, 1.4, 0, b, 0xc49a5c); solid(new THREE.SphereGeometry(.42, 6, 4), 0xc49a5c, b, -.1, 1.9, 0);
      box(.3, 1.0, .3, .8, 1.9, 0, b, 0xc49a5c); box(.6, .3, .3, 1.0, 2.4, 0, b, 0xc49a5c);
      box(.7, .5, .9, -.5, 2.0, 0, b, i % 2 ? 0x8a3a24 : 0x3f5e7a);
      c.userData.legs = [[-.55, -.22], [-.55, .22], [.55, -.22], [.55, .22]].map(([a, z]) => { const l = group(a, 1.05, z, c); box(.14, 1.05, .14, 0, -.52, 0, l, 0xc49a5c); return l; });
      c.rotation.y = -Math.PI / 2; S.caravan.push(c); }
    S.coins = []; for (let i = 0; i < 6; i++) { const c = cyl(.22, .07, 0, 0, 0, undefined, GOLD, 12); c.visible = false; S.coins.push(c); }

    // ---------- SET 6 (x=200): the map table ----------
    const M = group(200, 0, 0);
    box(15, .5, 10, 0, .25, 0, M, 0xcdb07a);
    box(15.6, .3, 10.6, 0, .05, 0, M, WOOD);
    const coast = [[6.2, .52, 4.6], [5.4, .52, 2.6], [6.0, .52, .8], [5.2, .52, -.6], [6.6, .52, -2.4], [6.9, .52, -4.6]];
    line(coast.map(p => [p[0] + 200, p[1], p[2]]), BLUE, undefined, 3);
    line([[195, .52, 4.4], [197.2, .52, 2.6], [199.5, .52, 3.2], [202.8, .52, 1.8], [205.2, .52, 2.4]], 0x6f8fae, undefined, 2); // river
    const mk = (pts, c, w) => line(pts.map(p => [p[0] + 200, .56, p[1]]), c, undefined, w);
    S.old = [mk([[-6.2, -.4], [-4.4, -1.4], [-2.8, -.9]], RED, 8), mk([[-1.6, -1.6], [-.2, -2.2], [1.1, -1.8]], RED, 8), mk([[2.4, -2.4], [3.8, -3.0], [5.2, -2.6]], RED, 8)];
    S.join = [mk([[-2.8, -.9], [-1.6, -1.6]], 0x8a4a10, 10), mk([[1.1, -1.8], [2.4, -2.4]], 0x8a4a10, 10)];
    const mingPts = []; for (let i = 0; i <= 40; i++) { const u = i / 40; mingPts.push([-7.0 + u * 12.6, -.1 - u * 1.2 + Math.sin(u * 11) * .45 - Math.sin(u * 3) * .9]); }
    S.ming = mk(mingPts, 0x8a4a10, 14);

    // ---------- SET 7 (x=232): Shanhai Pass, where the wall meets the sea ----------
    const P = group(232, 0, -2);
    box(10, 3, 2, -6, 1.5, 0, P); box(8, 3, 2, 5, 1.5, 0, P);
    for (let i = 0; i < 9; i++) { box(.5, .45, .25, -10.5 + i * 1.1, 3.2, .85, P); box(.5, .45, .25, 1.4 + (i % 7) * 1.1, 3.2, .85, P); }
    box(2.4, 1.0, 2.2, 0, 3.4, 0, P); gatehouse(P, 3.5);
    box(.8, 3, 2.2, -1.6, 1.5, 0, P); box(.8, 3, 2.2, 1.6, 1.5, 0, P);
    S.doorL = group(-1.2, 0, .95, P); box(1.2, 2.9, .15, .6, 1.45, 0, S.doorL, RED);
    S.doorR = group(1.2, 0, .95, P); box(1.2, 2.9, .15, -.6, 1.45, 0, S.doorR, RED);
    glow(new THREE.PlaneGeometry(10, 40), 0x2f5a78, undefined, 1, 245, .06, -8).rotation.x = -Math.PI / 2;
    S.guards = [-7, -4.5, 4.5, 7].map(gx => { const p = person(232 + gx, -2, { scale: .62, color: 0xe9d8b4 }); p.position.y = 3; return p; });
    S.army = []; for (let i = 0; i < 26; i++) { const h = horse(0, 0, undefined, .62, 0x2f3d55); S.army.push(h); }

    // ---------- SET 8 (x=264): your front door ----------
    const D = group(264, 0, -2);
    box(8, 5, .6, 0, 2.5, 0, D, BLUE); box(2.0, 3.6, .2, 0, 1.8, .38, D, 0x47637e); roof(9, 2, 1.4, 0, 5, 0, D, 0x3d536b);
    box(.36, .5, .14, .65, 1.8, .55, D, GOLD); S.shackle = new THREE.Mesh(new THREE.TorusGeometry(.15, .045, 6, 12, Math.PI), new THREE.MeshStandardMaterial({ color: K.col(GOLD) }));
    S.shackle.position.set(.65, 2.05, .55); D.add(S.shackle);
    S.thief = person(259, 1.2, { scale: .8, color: 0x3a3a46 });
  },

  // [cue, camera position, look-at, dolly drift]
  shots: [
    [0,          [-45, 17, -1],   [0, 3.5, -8],    10],
    ['reframe',  [79.5, 6.2, 13], [79.5, 1.2, -3], 1.5],
    ['setup',    [102, 6.5, 11],  [108, 3.6, -1],  1],
    ['threat',   [110, 7.5, 9],   [110, 1, -14],   1.5],
    ['slow',     [113, 7, -20],   [110, 2.2, -1],  1.5],
    ['step2',    [122, 9, 14],    [142, 4, -14],   2.5],
    ['step3',    [179, 5.5, 13],  [170, 2.6, -2],  1.5],
    ['qin',      [200, 23, 6],    [200, 0, -.8],   1.2],
    ['ming',     [200, 22, 4.5],  [200, 0, -.8],   1],
    ['catch',    [222, 8, 19],    [233, 3.2, -2],  1.5],
    ['1644',     [232, 6, 17],    [232, 2.6, -4],  1.5],
    ['math',     [-6, 30, 26],    [0, 2, -8],      4],
    ['contrast', [266, 3.8, 13],  [264, 2.6, -2],  1.5],
    ['punch',    [-45, 17, -1],   [0, 3.5, -8],    8],
  ],

  cards: [
    { l: 'Length', v: '0', cls: 'big', a: [0, 13.5, -6], t0: 0, t1: 'reframe', count: [0, 13171, 0, 2.4], fmt: n => Math.round(n).toLocaleString('en-US') + ' MI' },
    { v: 'NOT ONE WALL', cls: 'red', a: [79.5, 6.3, -3], t0: 'reframe', t1: 'how' },
    { l: 'Built over', v: '2,000+ YEARS', a: [79.5, 6.3, -3], t0: 'how', t1: 'setup' },
    { v: 'LI', cls: 'tag white', a: [108.2, 5.4, .1], t0: 'setup+0.2', t1: 'step2' },
    { l: 'Northern nomads', v: 'MOUNTED RAIDERS', cls: 'red', a: [110, 7.4, -14], t0: 'threat+0.3', t1: 'step1' },
    { v: 'STOPPED', cls: 'big', a: [110, 6.5, -1], t0: 'slow+0.8', t1: 'step2' },
    { v: '1 SMOKE ≈ 100 RAIDERS', cls: 'white', a: [140, 10.4, -10], t0: 'towers+1.2', t1: 'step3' },
    { v: '3 SMOKES = 1,000+', cls: 'red', a: [140, 8.4, -10], t0: 'towers+2.2', t1: 'step3' },
    { l: 'Silk Road', v: 'TAX AT THE GATE', a: [174.5, 3.6, 2.2], t0: 'gates', t1: 'qin' },
    { v: 'YAN', cls: 'tag white', a: [195.4, 1, -.3], t0: 'qin+0.3', t1: 'ming' },
    { v: 'ZHAO', cls: 'tag white', a: [199.8, 1, -1.2], t0: 'qin+0.55', t1: 'ming' },
    { v: 'QIN', cls: 'tag white', a: [203.8, 1, -1.9], t0: 'qin+0.8', t1: 'ming' },
    { l: '~214 BC', v: 'QIN LINKS THE WALLS', a: [200, 4.2, -3.6], t0: 'qin+0.5', t1: 'ming' },
    { l: 'Ming dynasty', v: '1368 – 1644', a: [200, 4.4, -4], t0: 'ming+0.3', t1: 'catch' },
    { v: 'ONE WEAKNESS', cls: 'red big', a: [232, 8.4, -2], t0: 'catch', t1: 'people' },
    { l: 'Shanhai Pass', v: 'THE GUARDS', cls: 'white', a: [232, 8.6, -2], t0: 'people', t1: '1644' },
    { l: '1644', v: 'GATE OPENED', cls: 'red big', a: [232, 8.2, -2], t0: '1644+0.3', t1: 'math' },
    { l: 'Every dynasty', v: '0 KM', cls: 'big', a: [0, 8, -8], t0: 'total', t1: 'contrast', count: [0, 21196, 'total', 1.6], fmt: n => Math.round(n).toLocaleString('en-US') + ' KM' },
    { v: '½ WAY AROUND EARTH', cls: 'white', a: [0, 2.5, -8], t0: 'total+1.8', t1: 'contrast' },
    { v: 'YOUR FRONT DOOR', cls: 'tag', a: [264, 6.6, -2], t0: 'contrast', t1: 'lock' },
    { l: 'Stops a pro?', v: 'NO', cls: 'red', a: [261, 6.4, -2], t0: 'lock', t1: 'lock+1.4' },
    { l: 'Buys you', v: 'TIME', cls: 'big', a: [264, 6.4, -2], t0: 'lock+1.4', t1: 'punch' },
  ],

  steps: { title: 'WHY BUILD IT', labels: ['SLOW', 'SIGNAL', 'CONTROL'], marks: ['step1', 'step2', 'step3'], from: 'step1', to: 'qin' },
  receipt: { from: 'punch', to: 'cta', title: 'THE GREAT WALL', rows: [
    ['TOTAL LENGTH', '21,196 KM'], ['BUILT OVER', '~2,000 YRS'], ['JOB 1', 'SLOW RAIDERS', 'g'], ['JOB 2', 'SMOKE ALARM', 'g'], ['JOB 3', 'TAX TRADE', 'g'], ['BROKEN BY', '1 OPEN GATE', 'k']] },
  follow: { from: 'cta+0.2', title: 'MORE WHY THE F*CK HISTORY' },
  shakes: [['1644+0.3', .9, .14], ['manchu', 1.2, .1]],
  flashes: [['1644+0.3', .35, .18]],

  update(t, K) {
    const { at, T, ease, easeOut, clamp01 } = K, S = this.s;
    const gallop = (h, ph, speed) => { const s = Math.sin(t * 14 + ph) * speed; h.userData.legs.forEach((l, i) => l.rotation.z = (i % 2 ? s : -s) * .6); h.userData.body.position.y = Math.abs(Math.sin(t * 14 + ph)) * .15 * speed; };
    // hook: raiders gallop toward the wall on the ridge
    S.raidersHook.forEach((h, i) => { h.position.z = -26 + (i % 2) * 2 + Math.min(t, 6) * 1.6; gallop(h, i, 1); });
    // scattered walls slide together
    const j = ease(clamp01((t - T('reframe+0.6')) / 2.2));
    S.pieces.forEach((p, i) => { const [sx, sz, sr] = p.userData.s, [ex, ez] = p.userData.e, u = ease(clamp01(j * 1.4 - i * .02));
      p.position.set(sx + (ex - sx) * u, 0, sz + (ez - sz) * u); p.rotation.y = sr * (1 - u); });
    // raiders charge at Li's wall and stop
    const tc = t - at('threat'), stop = at('slow') - at('threat') + .6;
    S.raiders.forEach((h, i) => { const run = Math.min(Math.max(0, tc), stop); h.position.z = Math.min(-3.6 - (i % 3) * .7, -30 + run * 9 + (i % 3) * .8);
      const moving = tc > 0 && tc < stop; gallop(h, i * 1.3, moving ? 1 : .0);
      h.userData.body.rotation.z = tc > stop && tc < stop + .8 ? Math.sin((tc - stop) / .8 * Math.PI) * .35 : 0; });
    K.hop(S.li, t, 'threat+0.4', .2); S.li.position.y += 2.7;
    // beacons light one after another
    S.beacons.forEach((b, i) => { const lt = at('towers') + i * .45, on = t > lt;
      b.fire.visible = on; b.fire.scale.setScalar(on ? .8 + .25 * Math.sin(t * 20 + i) : 0);
      b.smoke.forEach((s, k) => { const age = (t - lt - k * .35); s.visible = age > 0; if (age <= 0) return; const u = (age % 2.4) / 2.4;
        s.position.set(b.x + Math.sin(k + u * 3) * .3, b.y + .6 + u * 5, b.z); s.scale.setScalar(.4 + u * 1.1); }); });
    // caravan walks through the gate, coins fly to the chest
    S.caravan.forEach((c, i) => { const w = Math.max(0, t - at('step3') + .2); c.position.z = Math.min(9, -14 - i * 3.2 + w * 2.6);
      const s = Math.sin(t * 8 + i); c.userData.legs.forEach((l, k) => l.rotation.z = (k % 2 ? s : -s) * .35); });
    S.coins.forEach((c, i) => K.fly(c, t, at('gates') + .3 + i * .35, .7, new THREE.Vector3(170.6, 2.2, -.5), new THREE.Vector3(173.4, 1, 2.2), 1.6));
    // map: old walls draw, then join, then the Ming wall
    S.old.forEach((l, i) => K.setLine(l, easeOut(clamp01((t - at('qin') + .2 - i * .25) / .7))));
    S.join.forEach((l, i) => K.setLine(l, easeOut(clamp01((t - at('qin') - 1.2 - i * .3) / .5))));
    K.setLine(S.ming, easeOut(clamp01((t - at('ming') - .2) / 1.6)));
    // Shanhai Pass: guards hop, gate swings open, army pours through
    S.guards.forEach((g, i) => K.hop(g, t, T('people+0.1') + i * .12, .25)); S.guards.forEach(g => g.position.y += 3);
    const o = easeOut(clamp01((t - at('1644') - .3) / .9));
    S.doorL.rotation.y = -o * 1.9; S.doorR.rotation.y = o * 1.9;
    S.army.forEach((h, i) => { const st = at('manchu') + (i % 13) * .18 + Math.floor(i / 13) * .1, u = Math.max(0, t - st);
      const z = -24 + u * 9; h.visible = t > at('1644') - .5; const lane = (i % 2 ? .5 : -.5);
      const x = z < -4 ? 232 + lane * 3 + ((i * 7) % 5 - 2) * .9 * clamp01((-4 - z) / 10) : 232 + lane;
      h.position.set(x, 0, Math.min(z, 12 + i * .2)); gallop(h, i, 1); });
    // front door: thief walks up, rattles, gives up
    const tw = clamp01((t - at('contrast') - .3) / 1.2);
    S.thief.position.x = 258 + tw * 4.6; S.thief.rotation.z = t > at('lock') && t < at('lock') + 1.4 ? Math.sin(t * 28) * .05 : 0;
    S.shackle.rotation.z = t > at('lock') && t < at('lock') + 1.4 ? Math.sin(t * 34) * .08 : 0;
    // final: wall on the ridge again, raiders halted
    if (t > at('punch')) S.raidersHook.forEach((h, i) => { h.position.z = Math.min(S.ZW(h.position.x) - 2.5, -14); });
  },
};
