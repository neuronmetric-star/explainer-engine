// Cutaway demo: solid shaded submarine, front of the hull peels away, numbered callouts, camera flies inside.
// Pattern to copy for any machine: K.hull/K.solid with {cut}, parts inside (no cut), K.setCut in update, callouts[].
window.SCENE = {
  distance: 1.5,
  build(K) {
    const { solid, hull, group } = K;
    const S = this.s = {};
    const Y = 3.2, R = .66;
    const cut = S.cut = K.cutaway({ z: 0, x0: -3.7, x1: -3.7 });           // starts closed
    const HULL = 0x1c252e, sub = S.sub = group(0, Y, 0);
    // pressure hull + nose + tail as one body of revolution (x, radius)
    hull([[-7.4, .05], [-7.0, .32], [-6.0, .56], [-5.2, R], [4.9, R], [5.7, .62], [6.3, .5], [6.75, .32], [7.0, .12], [7.06, 0]], HULL, sub, { cut, inner: 0x222b33, metal: .35, rough: .5 });
    // sail, planes, rudders, pumpjet
    const sail = new THREE.Shape(); sail.moveTo(-.75, 0); sail.lineTo(.75, 0); sail.quadraticCurveTo(.9, .7, .55, 1.05); sail.lineTo(-.6, 1.05); sail.quadraticCurveTo(-.9, .5, -.75, 0);
    const sg = new THREE.ExtrudeGeometry(sail, { depth: .34, bevelEnabled: true, bevelSize: .05, bevelThickness: .05, bevelSegments: 3 }); sg.translate(0, 0, -.17);
    solid(sg, HULL, sub).position.set(3.4, R - .08, 0);
    solid(new THREE.BoxGeometry(.5, .05, 1.6), HULL, sub).position.set(3.5, R + .6, 0);
    solid(new THREE.BoxGeometry(.8, 1.5, .06), HULL, sub).position.set(-6.4, 0, 0);
    solid(new THREE.BoxGeometry(.8, .06, 1.5), HULL, sub).position.set(-6.4, 0, 0);
    const pj = solid(new THREE.CylinderGeometry(.42, .36, .6, 32, 1, true), 0x2a333c, sub, { metal: .5 }); pj.rotation.z = Math.PI / 2; pj.position.x = -7.1;

    // ---- inside (not clipped): decks + compartments, x from aft (-) to bow (+) ----
    const box = (w, h, d, x, y, z, c, o) => { const m = solid(new THREE.BoxGeometry(w, h, d), c, sub, o); m.position.set(x, y, z); return m; };
    const cy = (r, h, x, y, z, c, o, horiz) => { const m = solid(new THREE.CylinderGeometry(r, r, h, 28), c, sub, o); m.position.set(x, y, z); if (horiz) m.rotation.z = Math.PI / 2; return m; };
    box(8.2, .04, 1.1, .4, -.32, -.02, 0x56606a); box(5.6, .04, 1.0, 1.7, .18, -.02, 0x606a74);              // decks
    for (let x = -3.5; x < 4.7; x += .55) { const f = solid(new THREE.TorusGeometry(R * .92, .013, 8, 48), 0x5b6874, sub); f.rotation.y = Math.PI / 2; f.position.x = x; }   // hull frames
    // reactor compartment (orange, glowing)
    cy(.36, .8, -2.85, -.05, -.1, 0xff3a00, { glow: .12, metal: .1 });
    cy(.13, .7, -3.35, -.05, -.1, 0xd2501a, { glow: .15 }); cy(.13, .7, -2.35, -.05, -.1, 0xd2501a, { glow: .15 });
    // missile tubes (VPM): 4 vertical tubes
    for (let i = 0; i < 4; i++) cy(.17, 1.15, -1.55 + i * .45, 0, -.1, 0xb8461a, { metal: .3 });
    // crew bunks: stacked white racks
    for (let i = 0; i < 4; i++) for (let j = 0; j < 2; j++) box(.38, .07, .55, .3 + i * .5, -.18 + j * .18, -.2, 0xaeb4ba);
    for (let i = 0; i < 4; i++) box(.38, .07, .55, .3 + i * .5, .32, -.2, 0xa3a9b0);
    // control room: consoles + screens
    for (let i = 0; i < 3; i++) { box(.3, .3, .2, 2.75 + i * .4, .35, -.35, 0x5d7a99); box(.26, .16, .02, 2.75 + i * .4, .5, -.24, 0x7fe8ff, { glow: .8 }); }
    // torpedo room: racks of green torpedoes
    for (let i = 0; i < 3; i++) for (let j = 0; j < 2; j++) cy(.08, 1.2, 4.6, -.2 + j * .2, -.35 + i * .2, 0x6f9a4c, {}, true);
  },

  shots: [
    [0,            [6.5, 5.6, 10.5], [0.2, 3.2, 0],   1.6],
    ['open',       [1.0, 5.0, 12.0], [0.4, 3.2, 0],   0.8],
    ['c1',         [-1.6, 4.4, 6.5], [-2.0, 3.1, 0],  0.6],
    ['c3',         [2.0, 4.4, 6.5],  [1.6, 3.1, 0],   0.6],
    ['c5',         [4.4, 4.4, 6.5],  [3.6, 3.1, 0],   0.6],
    ['fly',        [4.8, 3.7, 2.3],  [3.4, 3.15, -.2], 0.5],
    ['fly+2.5',    [1.4, 3.7, 2.3],  [0.0, 3.15, -.2], 0.5],
    ['fly+5',      [-1.8, 3.7, 2.3], [-3.0, 3.15, -.2], 0.5],
    ['cta',        [6.5, 5.6, 10.5], [0.2, 3.4, 0],   1.0],
  ],

  // numbered callouts: dot on the part, label at a screen position
  callouts: [
    { n: 1, l: 'Nuclear reactor', cls: 'red', a: [-2.85, 3.6, -.1], at: [330, 520], t0: 'c1', t1: 'c3' },
    { n: 2, l: 'Missile tubes', cls: 'gold', a: [-1.0, 3.75, -.1], at: [760, 430], t0: 'c2', t1: 'c3' },
    { n: 3, l: 'Crew bunks', a: [1.05, 3.1, -.2], at: [330, 520], t0: 'c3', t1: 'c5' },
    { n: 4, l: 'Control room', cls: 'cyan', a: [3.15, 3.65, -.3], at: [760, 430], t0: 'c4', t1: 'c5' },
    { n: 5, l: 'Torpedo room', a: [4.6, 3.1, -.3], at: [400, 520], t0: 'c5', t1: 'fly' },
  ],
  follow: { from: 'cta+0.2', title: 'MORE HOW IT\'S BUILT' },

  update(t, K) {
    const S = this.s;
    // peel the hull open from stern to bow over 1.6 s, close again for the ending
    const open = K.easeOut(K.prog(t, 'open', 1.6)) * (1 - K.ease(K.prog(t, 'cta', 1.0)));
    K.setCut(S.cut, -3.7, -3.7 + (4.75 + 3.7) * open);
    S.sub.position.y = 3.2 + Math.sin(t * .8) * .04;
  },
};
