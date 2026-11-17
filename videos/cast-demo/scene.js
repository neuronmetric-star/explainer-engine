// Cast + world demo for the 'toy' look. Sets: originals x=0 | extended cast x=20 | faces x=40 | town x=60
window.SCENE = {
  style: 'toy', distance: 1.0,
  build(K) {
    const S = this.s = {};
    // A: the 5 characters from the sheets
    S.orig = ['hoodie', 'sam', 'sweater', 'worker', 'boss'].map((n, i) => K.char(n, -3.4 + i * 1.7, 0));
    // B: diverse extended cast
    S.ext = ['maya', 'leo', 'amira', 'kenji', 'zara', 'marcus', 'rosa', 'dev', 'nia'].map((n, i) => K.char(n, 20 - 5.6 + i * 1.4, (i % 2) * -1.0));
    // C: faces
    S.faces = ['maya', 'boss', 'leo'].map((n, i) => K.char(n, 40 - 1.3 + i * 1.3, 0));
    // D: a small town street
    const T = 60, mt = (c, r = .9) => K.tmat(c, r);
    const add = (geo, m, x, y, z, ry = 0) => { const o = new THREE.Mesh(geo, m); o.position.set(x, y, z); o.rotation.y = ry; o.castShadow = o.receiveShadow = true; K.scene.add(o); return o; };
    add(new THREE.BoxGeometry(40, .02, 4), mt(0x55595f), T, .01, 1.5);                                   // road
    for (let i = -9; i <= 9; i++) add(new THREE.BoxGeometry(1, .025, .12), mt(0xf2f2f2), T + i * 2, .02, 1.5);
    add(new THREE.BoxGeometry(40, .14, 2.4), mt(0xd9d5cc), T, .07, -1.7);                                  // sidewalk
    const houses = [[0xf2b8a0, 0x9e4a3a], [0xa8d0e6, 0x3a5f7e], [0xf4e1a1, 0x8a6a2e], [0xb9e0c4, 0x3e7a55], [0xe8c2dc, 0x7e4a6e]];
    houses.forEach(([wall, roofc], i) => { const hx = T - 10 + i * 5;
      add(new THREE.BoxGeometry(3.6, 3, 3), mt(wall), hx, 1.5, -5);
      const roof = add(new THREE.ConeGeometry(2.8, 1.6, 4), mt(roofc), hx, 3.8, -5, Math.PI / 4); roof.scale.z = .85;
      add(new THREE.BoxGeometry(.8, 1.5, .1), mt(0x6b4a35), hx, .75, -3.47);
      [-1, 1].forEach(s => add(new THREE.BoxGeometry(.7, .7, .08), mt(0xdff2ff, .2), hx + s * 1.05, 1.9, -3.47)); });
    const market = add(new THREE.BoxGeometry(6, 3.4, 3.2), mt(0xf5f3ee), T + 15, 1.7, -5);
    { const c = document.createElement('canvas'); c.width = 512; c.height = 128; const g = c.getContext('2d'); g.fillStyle = '#d6403a'; g.fillRect(0, 0, 512, 128);
      g.fillStyle = '#fff'; g.font = '900 84px sans-serif'; g.textAlign = 'center'; g.fillText('MARKET', 256, 96);
      const tx = new THREE.CanvasTexture(c); tx.encoding = THREE.sRGBEncoding; add(new THREE.PlaneGeometry(4, 1), new THREE.MeshBasicMaterial({ map: tx }), T + 15, 2.9, -3.38); }
    for (let i = 0; i < 6; i++) { const tx = T - 12 + i * 4.8; add(new THREE.CylinderGeometry(.12, .15, 1.4, 10), mt(0x7a5236), tx, .7, -1.2);
      add(new THREE.SphereGeometry(.75, 16, 12), mt(0x5fae5a), tx, 1.9, -1.2); }
    S.walkers = [['hoodie', -1.4, 1.5, 1], ['maya', 2.0, .9, -1], ['leo', -5.5, 2.1, 1], ['rosa', 5.0, -1.4, -1]].map(([n, x0, z, dir]) => { const c = K.char(n, T + x0, z); c.root.rotation.y = dir * Math.PI / 2; return { c, x0, dir }; });
    S.pointer = K.char('worker', T + 6.5, -1.6); S.waver = K.char('sam', T - 6.5, -1.7); S.panicker = K.char('zara', T + 9.5, -1.6); S.bossT = K.char('boss', T + 11.5, -1.4);
  },
  shots: [
    [0,   [0, 2.3, 14.5],  [0, 1.6, 0],   1.2],
    ['b', [20, 2.6, 21],   [20, 1.5, -.5], 1.6],
    ['c', [40, 2.6, 5.6],  [40, 2.45, 0],  .5],
    ['d', [60, 4.2, 15],   [60, 1.8, -1.5], 2.0],
  ],
  cards: [
    { v: 'THE ORIGINALS', cls: 'tag white', a: [0, 3.6, 0], t0: 'a+0.2', t1: 'b' },
    { v: 'THE EXTENDED CAST', cls: 'tag white', a: [20, 3.6, -.5], t0: 'b+0.2', t1: 'c' },
  ],
  update(t, K) {
    const S = this.s, { poses: P, pose, face } = K;
    // originals: turn around one by one, then wave
    S.orig.forEach((c, i) => { c.root.rotation.y = t < 2.4 ? Math.sin(Math.min(1, Math.max(0, (t - .3 - i * .25) / 1.2)) * Math.PI) * 1.2 : 0;
      pose(c, t > 2.2 ? (i % 2 ? P.wave(t + i) : P.pump(t + i)) : P.idle(t, i)); face(c, t > 2.2 ? (i % 2 ? 'happy' : 'smug') : 'smile'); });
    // extended cast: idle, then each reacts
    const R = ['wave', 'pump', 'shrug', 'point', 'wave', 'talk', 'wave', 'pump', 'shrug'], F = ['happy', 'smug', 'smile', 'surprised', 'happy', 'talk', 'happy', 'smug', 'worried'];
    S.ext.forEach((c, i) => { const on = t > 3.4 + i * .12; pose(c, on ? P[R[i]](t + i) : P.idle(t, i)); face(c, on ? F[i] : (Math.sin(t * 2 + i) > .97 ? 'blink' : 'smile')); });
    // faces: cycle expressions
    const E = ['smile', 'happy', 'surprised', 'smug', 'worried', 'scream'];
    S.faces.forEach((c, i) => { face(c, E[Math.floor(Math.max(0, t - 6) * 2.2 + i * 2) % E.length]); pose(c, P.talk(t, i)); });
    // town: walkers, a runner, pointer, waver, panic
    S.walkers.forEach(({ c, x0, dir }, i) => { const sp = i === 2 ? 3.2 : 1.1; c.root.position.x = 60 + x0 + dir * sp * Math.max(0, t - 8); pose(c, i === 2 ? P.run(t, 10, i) : P.walk(t, 6, i)); face(c, i === 2 ? 'worried' : 'smile'); });
    pose(S.pointer, P.point(t)); face(S.pointer, 'surprised'); pose(S.waver, P.wave(t)); face(S.waver, 'happy');
    pose(S.panicker, P.panic(t)); face(S.panicker, 'scream'); pose(S.bossT, P.shrug(t)); face(S.bossT, 'smug');
  },
};
