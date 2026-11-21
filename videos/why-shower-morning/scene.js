// Why the f*ck do we shower in the morning? — bright look, real 3D sleeper + toy-like bacteria.
// Sets: bedroom x=0 | skin cutaway (sweat glands) x=20 | dust mite on pillow x=40 | skin surface + bacteria x=60 | two showers x=80
window.SCENE = {
  distance: 1.5,
  models: { guy: 'quaternius/characters/Man_Casual.glb' },

  build(K) {
    const S = this.s = {};
    const M = (geo, c, p, o = {}) => K.solid(geo, c, p, Object.assign({ metal: 0, rough: .7 }, o));
    const B = (w, h, d, x, y, z, c, p, o) => { const m = M(new THREE.BoxGeometry(w, h, d), c, p, o); m.position.set(x, y, z); return m; };
    const SP = (r, x, y, z, c, p, o) => { const m = M(new THREE.SphereGeometry(r, 24, 16), c, p, o); m.position.set(x, y, z); return m; };
    const CY = (r, h, x, y, z, c, p, o) => { const m = M(new THREE.CylinderGeometry(r, r, h, 24), c, p, o); m.position.set(x, y, z); return m; };
    const eyes = (p, r, y, z, dx = r * .55) => { for (const sx of [-1, 1]) { SP(r * .32, sx * dx, y, z, 0xffffff, p, { rough: .3 }); SP(r * .16, sx * dx, y, z + r * .22, 0x111111, p, { rough: .3 }); } };
    S.eyes = eyes;

    // ---------- A: bedroom (night → sunrise) ----------
    B(12, .06, 9, 0, .01, .4, 0xb4845a, undefined, { rough: .8 });                           // wooden floor
    B(12, 6, .3, 0, 3, -3.0, 0x9aa6d8);                                                      // back wall
    B(.3, 6, 9, -5.0, 3, 1.4, 0xa9b3e0);                                                     // side wall
    // window with the sky outside (night: moon + stars, morning: sunrise)
    const skyCanvas = (night) => { const cv = document.createElement('canvas'); cv.width = 512; cv.height = 384; const c = cv.getContext('2d');
      const g = c.createLinearGradient(0, 0, 0, 384); (night ? ['#070b26', '#18225a', '#2f3a7a'] : ['#6fb6ff', '#ffc98a', '#ffe9c9']).forEach((col, i) => g.addColorStop(i / 2, col));
      c.fillStyle = g; c.fillRect(0, 0, 512, 384);
      if (night) { let r = 7; for (let i = 0; i < 90; i++) { r = (r * 9301 + 49297) % 233280; const x = r / 233280 * 512; r = (r * 9301 + 49297) % 233280; const y = r / 233280 * 300;
          c.fillStyle = 'rgba(255,255,255,' + (.4 + (i % 5) * .12) + ')'; c.beginPath(); c.arc(x, y, (i % 7 === 0) ? 2.2 : 1.1, 0, 7); c.fill(); }
        const mg = c.createRadialGradient(360, 110, 10, 360, 110, 120); mg.addColorStop(0, 'rgba(255,250,220,.55)'); mg.addColorStop(1, 'rgba(255,250,220,0)'); c.fillStyle = mg; c.fillRect(200, 0, 312, 260);
        c.fillStyle = '#fff6d8'; c.beginPath(); c.arc(360, 110, 46, 0, 7); c.fill(); c.fillStyle = '#e9dfbf'; [[345, 98, 9], [378, 125, 7], [355, 132, 5]].forEach(([x, y, rr]) => { c.beginPath(); c.arc(x, y, rr, 0, 7); c.fill(); });
      } else { const sg = c.createRadialGradient(256, 330, 10, 256, 330, 160); sg.addColorStop(0, 'rgba(255,240,180,1)'); sg.addColorStop(1, 'rgba(255,200,120,0)'); c.fillStyle = sg; c.fillRect(0, 150, 512, 234); }
      const tx = new THREE.CanvasTexture(cv); tx.encoding = THREE.sRGBEncoding; return tx; };
    S.skyNight = skyCanvas(true); S.skyMorning = skyCanvas(false);
    S.windowSky = new THREE.Mesh(new THREE.PlaneGeometry(2.6, 1.95), new THREE.MeshBasicMaterial({ map: S.skyNight, fog: false })); S.windowSky.position.set(-1.6, 3.6, -2.84); K.scene.add(S.windowSky);
    for (const [w, h, x, y] of [[2.9, .14, -1.6, 4.62], [2.9, .14, -1.6, 2.58], [.14, 2.1, -3.0, 3.6], [.14, 2.1, -.2, 3.6], [.08, 1.95, -1.6, 3.6], [2.6, .07, -1.6, 3.6]]) B(w, h, .14, x, y, -2.8, 0xf4f1ea);
    B(3.2, .16, .5, -1.6, 2.45, -2.65, 0xf4f1ea);                                            // sill
    for (const sx of [-3.45, .25]) for (let k = 0; k < 3; k++) B(.22, 3.4, .14, sx + (k - 1) * .2, 3.3, -2.7 + k * .03, 0x6f5fc9, undefined, { rough: .95 });   // curtains
    B(1.3, .9, .06, 1.4, 3.4, -2.83, 0xf4f1ea); B(1.15, .75, .03, 1.4, 3.4, -2.8, 0x5b8fe8);                                // little framed picture
    // moonbeam through the window + floating dust motes
    const beam = new THREE.Mesh(new THREE.CylinderGeometry(1.1, 2.2, 4.4, 4, 1, true), new THREE.MeshBasicMaterial({ color: 0xaecbff, transparent: true, opacity: .1, blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide }));
    beam.position.set(-.9, 2.3, -1.4); beam.rotation.set(.75, .78, .35); K.scene.add(beam); S.beam = beam;
    S.motes = []; for (let i = 0; i < 40; i++) { const m = new THREE.Mesh(new THREE.SphereGeometry(.018, 6, 4), new THREE.MeshBasicMaterial({ color: 0xdbe8ff, transparent: true, opacity: .8 })); K.scene.add(m); S.motes.push(m); }
    B(5.2, .05, 4.2, 0, .05, .6, 0x5a63b8, undefined, { rough: .95 });                       // rug
    B(2.8, .45, 4.6, 0, .25, 0, 0x7a5236);                                                   // bed frame
    B(2.8, 1.6, .25, 0, .8, -2.35, 0x6b4630);                                                // headboard
    B(2.6, .35, 4.3, 0, .62, 0, 0xffffff, undefined, { rough: .9 });                          // mattress
    S.pillow = B(1.6, .28, .8, 0, .93, -1.75, 0xf7f7ff, undefined, { rough: .95 });
    S.blanket = B(2.7, .3, 2.1, 0, .92, 1.08, 0x4762c9, undefined, { rough: .9 });
    B(2.72, .06, .3, 0, 1.06, .1, 0xe9ecff, undefined, { rough: .9 });                        // folded sheet edge
    B(.9, .9, .8, 2.05, .45, -1.9, 0x8a5a3a);                                                 // nightstand
    S.clock = B(.55, .3, .25, 2.05, 1.05, -1.95, 0x1a1e26, undefined, { rough: .4 });
    B(.42, .16, .02, 2.05, 1.06, -1.82, 0x7dff9a, undefined, { glow: 1.2 });
    S.glass = B(.22, 1, .22, 1.75, .9, -1.55, 0x7ec8ff, undefined, { rough: .1, glow: .15 });
    // bedside lamp: base + glowing shade + warm light
    CY(.1, .45, 2.3, 1.12, -2.15, 0xd9c7a0); S.shade = M(new THREE.CylinderGeometry(.18, .3, .34, 24, 1, true), 0xffd59a, undefined, { glow: .9 });
    S.shade.position.set(2.3, 1.5, -2.15); S.shade.children[0].material.side = THREE.DoubleSide;
    S.lampLight = new THREE.PointLight(0xffb066, 1.3, 7, 2); S.lampLight.position.set(2.3, 1.45, -2.0); K.scene.add(S.lampLight);
    S.daySky = K.scene.background; S.nightSky = K.skyTexture([0x070b26, 0x141c48, 0x232a5a]); S.sunriseSky = K.skyTexture([0x7cbcff, 0xffc98a, 0xffe2b8]);
    // sleeper: lying on his back, head on the pillow
    S.sleepRig = K.group(0, 1.0, 1.5);
    S.guy = K.model('guy', { height: 3.25, parent: S.sleepRig }); S.guy.rotation.x = -Math.PI / 2;
    // teaser bacteria orbiting the bed (hook) and returning at 7 AM
    S.orbit = [];
    const bcol = [0x4b8df8, 0xff6fb5, 0x55d66b, 0x4b8df8, 0x55d66b, 0xff6fb5, 0x4b8df8, 0x55d66b];
    for (let i = 0; i < 8; i++) { const g = K.group(0, 0, 0); const n = 4 + (i % 3);
      for (let k = 0; k < n; k++) SP(.16, Math.cos(k * 2.4) * .16, Math.sin(k * 1.7) * .14, Math.sin(k * 2.4) * .16, bcol[i], g, { rough: .4 });
      eyes(g, .3, .05, .2); S.orbit.push(g); }
    // sparkles (clean), heat bubbles, sweat drops, skin flakes
    S.sparkles = []; for (let i = 0; i < 10; i++) { const s = M(new THREE.OctahedronGeometry(.09), 0xfff3a0, undefined, { glow: 1 }); s.userData.p = [(i % 5 - 2) * .35, 1.25 + (i % 3) * .15, -1.4 + (i % 4) * .35]; S.sparkles.push(s); }
    S.heat = []; for (let i = 0; i < 12; i++) { const h = SP(.12, 0, 0, 0, 0xff9a3c, undefined, { glow: .6 }); h.children[0].material.transparent = true; S.heat.push(h); }
    const drop = (c, s) => { const g = K.group(0, 0, 0); SP(.09 * s, 0, 0, 0, c, g, { rough: .1, glow: .2 }); const tip = M(new THREE.ConeGeometry(.085 * s, .16 * s, 16), c, g, { rough: .1, glow: .2 }); tip.position.y = .1 * s; return g; };
    S.drop = drop;
    S.sweat = []; for (let i = 0; i < 10; i++) S.sweat.push(drop(0x6cc8ff, 1));
    S.flakes = []; for (let i = 0; i < 26; i++) S.flakes.push(B(.07, .012, .06, 0, 0, 0, i % 2 ? 0xffe6d2 : 0xffffff));

    // ---------- B: skin cutaway with two sweat glands ----------
    const SK = K.group(20, 0, -1);
    B(7, .45, 3, 0, 3.75, 0, 0xf5c9ad, SK);           // epidermis
    B(7, 2.0, 3, 0, 2.52, 0, 0xf2a6a0, SK);            // dermis
    B(7, 1.5, 3, 0, .75, 0, 0xffe39a, SK);             // fat layer
    for (let i = 0; i < 9; i++) SP(.38, -3 + i * .75, .9 + (i % 2) * .3, 1.35, 0xffd768, SK);   // fat lobules
    S.ecc = M(new THREE.TorusKnotGeometry(.32, .1, 80, 10, 2, 3), 0x3f8ff5, SK, { rough: .35 }); S.ecc.position.set(-1.6, 1.95, 1.75);
    CY(.08, 1.9, -1.6, 2.95, 1.75, 0x3f8ff5, SK);
    S.apo = M(new THREE.TorusKnotGeometry(.48, .15, 90, 12, 2, 3), 0xf2b51d, SK, { rough: .35 }); S.apo.position.set(1.7, 1.15, 1.75);
    CY(.11, 1.3, 1.95, 2.0, 1.75, 0xf2b51d, SK);
    CY(.2, 2.4, 2.25, 2.9, 1.75, 0x8c5a3c, SK); CY(.05, 1.6, 2.25, 4.6, 1.75, 0x5a3a28, SK);   // hair follicle + hair
    S.eDrops = []; for (let i = 0; i < 4; i++) S.eDrops.push(drop(0x7fd3ff, 1.6));
    S.aDrops = []; for (let i = 0; i < 3; i++) S.aDrops.push(drop(0xf5c542, 2.0));

    // ---------- C: dust mite on pillow fabric ----------
    const PF = K.group(40, 0, -1);
    B(9, .4, 6, 0, .2, 0, 0xfafafa, PF, { rough: 1 });
    for (let i = 0; i < 12; i++) B(.35, .1, 6, -4 + i * .72, .45, 0, 0xeef0f4, PF, { rough: 1 });   // weave
    S.mite = K.group(40, .55, 0);
    const mb = SP(.9, 0, .55, 0, 0xe8cfa8, S.mite, { rough: .6 }); mb.scale.set(1, .7, 1.25);
    const mh = SP(.38, 0, .5, 1.1, 0xd9b98a, S.mite); eyes(S.mite, .5, .62, 1.38, .17);
    S.legs = []; for (let i = 0; i < 8; i++) { const side = i < 4 ? -1 : 1, k = i % 4; const l = CY(.06, 1.0, side * .95, .35, -.7 + k * .45, 0xd2b07c, S.mite); l.rotation.z = side * 1.0; S.legs.push(l); }
    S.mFlakes = []; for (let i = 0; i < 12; i++) S.mFlakes.push(B(.38, .05, .3, 40 - 3 + (i % 4) * 2, .6, -2 + Math.floor(i / 4) * 1.6, 0xfff0e2, undefined, { rough: 1 }));

    // ---------- D: skin surface + the bacteria ----------
    const SF = K.group(60, 0, -1);
    B(14, .5, 10, 0, .25, 0, 0xf3b9a6, SF, { rough: .9 });
    for (let i = 0; i < 40; i++) { const b = SP(.5 + (i % 3) * .15, -6 + (i * 1.37) % 12, .35, -4 + (i * 2.31) % 8, 0xf6c3b1, SF, { rough: .9 }); b.scale.y = .35; }
    S.pore = CY(.75, .06, 61.2, .52, -.2, 0x9e4f4f); CY(.55, .07, 61.2, .53, -.2, 0x5e2a2a);
    for (let i = 0; i < 5; i++) { const h = CY(.05, 2.2, 56.5 + i * 2.1, 1.4, -4 + (i % 2), 0x5a3a28); h.rotation.z = .3 - i * .12; }
    S.crowd = []; const cc = [0x4b8df8, 0xff6fb5, 0x55d66b, 0xffb44a];
    for (let i = 0; i < 46; i++) { const g = K.group(60 - 6 + (i * 2.71) % 12, .65, -4.6 + (i * 1.93) % 6.4); const c = cc[i % 4];
      if (i % 4 === 1) { CY(.1, .45, 0, 0, 0, c, g).rotation.z = Math.PI / 2; SP(.1, .22, 0, 0, c, g); SP(.1, -.22, 0, 0, c, g); }
      else for (let k = 0; k < 4; k++) SP(.12, Math.cos(k * 2.4) * .12, Math.sin(k * 1.7) * .1, Math.sin(k * 2.4) * .12, c, g);
      g.userData.ph = i * .7; S.crowd.push(g); }
    // hero 1: Staph epidermidis (blue grape-cluster, with a shield)
    S.epi = K.group(57.6, 1.0, .6); for (let k = 0; k < 9; k++) SP(.28, Math.cos(k * 2.4) * .3, Math.sin(k * 1.3) * .25, Math.sin(k * 2.4) * .3, 0x3f84f5, S.epi, { rough: .35 });
    eyes(S.epi, .7, .12, .45, .2); const sh = M(new THREE.CylinderGeometry(.42, .42, .08, 6), 0xf2b51d, S.epi, { metal: .6, rough: .3 }); sh.rotation.x = Math.PI / 2; sh.position.set(.62, -.05, .2);
    // hero 2: Cutibacterium acnes (pink rods peeking from the oily pore)
    S.acnes = K.group(61.2, .2, -.2); for (let k = 0; k < 3; k++) { const r = K.group((k - 1) * .32, 0, 0, S.acnes); CY(.15, .7, 0, .35, 0, 0xff6fb5, r, { rough: .35 }); SP(.15, 0, .7, 0, 0xff6fb5, r); r.rotation.z = (k - 1) * .3; }
    eyes(S.acnes, .45, .78, .14, .13);
    S.oil = SP(.28, 61.9, .62, .4, 0xfff0a0, undefined, { rough: .05, glow: .2 });
    // hero 3: Staph hominis (green grinning cluster) + the sweat drop it eats + sulfur gas
    S.hom = K.group(60.2, 1.0, 1.9); for (let k = 0; k < 9; k++) SP(.28, Math.cos(k * 2.4) * .3, Math.sin(k * 1.3) * .25, Math.sin(k * 2.4) * .3, 0x48c95a, S.hom, { rough: .35 });
    eyes(S.hom, .7, .12, .45, .2); const mouth = M(new THREE.TorusGeometry(.16, .04, 8, 16, Math.PI), 0x1a3a1a, S.hom); mouth.position.set(0, -.12, .5); mouth.rotation.z = Math.PI;
    S.food = drop(0xf5c542, 2.4);
    S.gas = []; for (let i = 0; i < 7; i++) { const g = SP(.3, 0, 0, 0, 0xc9e04a, undefined, { rough: 1, glow: .25, shadow: false }); g.children[0].material.transparent = true; S.gas.push(g); }

    // ---------- E: two showers ----------
    const shower = (x, col) => { const g = K.group(x, 0, -1);
      B(2.2, .2, 2.2, 0, .1, 0, 0xffffff, g); B(2.2, 4.2, .12, 0, 2.2, -1.05, col, g); B(.12, 4.2, 2.2, -1.05, 2.2, 0, col, g);
      CY(.06, 1.0, .2, 3.9, -.7, 0xc0c6cc, g, { metal: .8, rough: .3 }); const head = CY(.32, .08, .2, 3.45, -.3, 0xc0c6cc, g, { metal: .8, rough: .3 });
      const streams = []; for (let i = 0; i < 9; i++) { const s = CY(.025, 3.2, .2 + (i % 3 - 1) * .16, 1.8, -.3 + (Math.floor(i / 3) - 1) * .16, 0x8fd6ff, g, { glow: .5, shadow: false }); streams.push(s); }
      return streams; };
    S.showerN = shower(78.3, 0x9bb7ff); S.showerM = shower(81.7, 0xffd98a);
    S.moon = SP(.35, 78.3, 5.2, -1, 0xd6dcff, undefined, { glow: .6 }); S.sun = SP(.4, 81.7, 5.2, -1, 0xffc43a, undefined, { glow: .8 });
  },

  shots: [
    [0,            [3.0, 3.4, 4.2],  [0, 1.2, -.6],  1.2],
    ['t11',        [2.6, 3.0, 3.2],  [0, 1.0, -1.2], .6],
    ['t12',        [3.4, 3.4, 3.8],  [0, 1.1, -.6],  .8],
    ['sweat',      [.6, 3.6, .4],    [0, 1.3, -1.1], .4],
    ['glands',     [20, 2.6, 9.5],   [20, 2.2, .5],  .8],
    ['apocrine',   [21.4, 2.0, 7.4], [21.0, 1.6, .7], .6],
    ['t2',         [2.4, 3.0, -.3],  [0, 1.2, -1.6], .4],
    ['mites',      [42.6, 3.2, 5.4], [40, 1.1, 0],   .8],
    ['t4',         [64, 4.8, 9],     [60, .8, -1],   1.2],
    ['epi',        [58.6, 2.2, 4.4], [57.6, 1.0, .6], .4],
    ['acnes',      [62.4, 2.0, 2.8], [61.2, .7, -.2], .4],
    ['hominis',    [61.4, 2.2, 5.2], [60.2, 1.1, 1.9], .5],
    ['bo',         [62.5, 3.0, 6.5], [60.4, 1.2, 1.2], .6],
    ['t7',         [3.2, 3.2, 3.8],  [0.4, 1.2, -.8], .8],
    ['wash',       [80, 3.8, 10.0],  [80, 3.1, -1],  .8],
    ['cta',        [3.6, 3.2, 5.4],  [0, 1.4, -.3],  .8],
  ],

  cards: [
    // clock (bedroom only)
    { v: '11:00 PM', cls: 'tag', a: [2.05, 1.55, -1.95], t0: 't11', t1: 't12' },
    { v: '12:00 AM', cls: 'tag', a: [2.05, 1.55, -1.95], t0: 't12', t1: 'glands' },
    { v: '2:00 AM', cls: 'tag', a: [2.05, 1.55, -1.95], t0: 't2', t1: 'mites' },
    { v: '7:00 AM ⏰', cls: 'tag', a: [2.05, 1.55, -1.95], t0: 't7', t1: 'wash' },
    // hook + 11 PM
    { l: 'Your bed, tonight', v: '100 BILLION GUESTS', cls: 'red', a: [0, 3.4, -1], t0: 'hook+1.0', t1: 't11' },
    { v: 'SQUEAKY CLEAN ✨', a: [0, 2.6, -1.4], t0: 't11+0.3', t1: 'think' },
    { v: '…YOU THINK', cls: 'red big', a: [0, 2.6, -1.4], t0: 'think', t1: 't12' },
    // midnight
    { l: 'Body cools down to sleep', v: 'HEAT OUT THROUGH SKIN', cls: 'red', a: [0, 2.3, -1], t0: 'heat', t1: 'glands' },
    // glands
    { v: 'YOUR SKIN, ZOOMED IN', cls: 'tag', a: [20, 5.6, -1], t0: 'glands', t1: 'eccrine' },
    // shedding + mite
    { l: 'Dead skin cells shed', v: '', a: [0.6, 1.25, -.9], t0: 'cells', t1: 'mites', count: [0, 40000, 'cells', 2.0], fmt: n => Math.round(n).toLocaleString('en-US') + ' / MIN' },
    { l: 'Tiny bed roommate', v: 'DUST MITE', cls: 'white', a: [40, 3.6, 0], t0: 'mites+0.3', t1: 't4' },
    // bacteria
    { l: 'Living on your skin', v: '', cls: 'big', a: [60, 4.4, -1], t0: 'bugs', t1: 'epi', count: [0, 100, 'bugs', 2.2], fmt: n => Math.round(n) + ' BILLION' },
    { v: 'MEET YOUR ROOMMATES', cls: 'tag', a: [60, 3.6, -1], t0: 't4+0.2', t1: 'bugs' },
    { l: 'Staph epidermidis', v: 'THE GOOD GUY 🛡️', cls: 'blue', a: [57.6, 2.4, .6], t0: 'epi+0.2', t1: 'acnes' },
    { l: 'Cutibacterium acnes', v: 'LIVES IN OILY PORES', a: [61.2, 1.9, -.2], t0: 'acnes+0.2', t1: 'hominis' },
    { l: 'Staph hominis', v: 'THE STINKER', cls: 'red', a: [60.2, 2.4, 1.9], t0: 'hominis+0.2', t1: 'gas' },
    { v: 'SULFUR GAS 🤢', cls: 'red big', a: [61.2, 2.3, 1.6], t0: 'gas+0.3', t1: 'bo' },
    { l: 'Sweat', v: 'ODORLESS ✓', cls: 'white', a: [59.2, 3.4, 1.2], t0: 'bo', t1: 't7' },
    { l: 'Bacteria eating it', v: 'STINK ✗', cls: 'red', a: [61.8, 1.6, 2.2], t0: 'bo+1.2', t1: 't7' },
    // 7 AM
    { l: 'Water lost overnight', v: '≈ 1 CUP', cls: 'blue', a: [0.4, 3.0, -1], t0: 'cup', t1: 'covered' },
    { l: 'You wake up with', v: '100 BILLION ROOMMATES', cls: 'red', a: [0.4, 3.0, -1], t0: 'covered', t1: 'wash' },
    // showers
    { l: 'Night shower', v: 'WASHES OFF YOUR DAY', cls: 'blue', a: [78.3, 7.2, -1], t0: 'wash+0.2', t1: 'cta' },
    { l: 'Morning shower', v: 'WASHES OFF YOUR NIGHT', a: [81.7, 5.6, -1], t0: 'washnight+0.2', t1: 'cta' },
    // CTA
    { l: 'Knowing this…', v: 'MORNING SHOWERS? 🚿', a: [0, 3.4, -1], t0: 'cta+0.2', t1: 'share' },
    { l: 'Send this to your', v: 'STINKY PARTNER 👉', cls: 'red', a: [0, 3.4, -1], t0: 'share', t1: 'share+1.5' },
  ],
  callouts: [
    { n: 1, l: 'Eccrine · 99% water', cls: 'cyan', a: [18.4, 1.95, .75], at: [300, 470], t0: 'eccrine', t1: 't2' },
    { n: 2, l: 'Apocrine · fats + proteins', cls: 'gold', a: [21.7, 1.15, .75], at: [700, 400], t0: 'apocrine', t1: 't2' },
  ],
  steps: { title: 'YOUR NIGHT', labels: ['11 PM', '12 AM', '2 AM', '4 AM', '7 AM'], marks: ['t11', 't12', 't2', 't4', 't7'], from: 't11', to: 'wash' },
  follow: { from: 'share+1.5', title: 'WHY THE F*CK? · EXPLAINED' },
  shakes: [['t7', .5, .06], ['think', .3, .05]],
  flashes: [],

  update(t, K) {
    const { at, T, ease, easeOut, clamp01, prog, pop } = K, S = this.s;
    // ---- time of day: night in the bedroom, sunrise at 7 AM, plain daylight inside the micro-world sets ----
    const inRoom = K.camera.position.x < 12, morning = ease(prog(t, 't7', 1.6)), night = inRoom ? 1 - morning : 0;
    const L = K.lights; if (L.hemi) {
      const mix = (a, b, k) => a + (b - a) * k, day = !inRoom;
      L.key.intensity = day ? .78 : mix(.3, .95, morning); L.key.color.setHex(day ? 0xfff1dc : morning > .5 ? 0xffd2a0 : 0x6f8cff);
      K.keyOffset.set(day ? 6 : -5, day ? 14 : 9, day ? 9 : -8);
      L.hemi.intensity = day ? .42 : mix(.16, .45, morning); L.hemi.color.setHex(day ? 0xdcecff : morning > .5 ? 0xffe6c8 : 0x3a4aa8);
      L.hemi.groundColor.setHex(day ? 0x8a7458 : 0x120e26); L.amb.intensity = day ? .08 : mix(0, .08, morning);
      K.scene.background = day ? S.daySky : (morning > .5 ? S.sunriseSky : S.nightSky);
      K.scene.fog.color.setHex(day ? 0xfff3df : morning > .5 ? 0xffe2b8 : 0x0b1030);
      K.bloom.threshold = day ? .95 : mix(.72, .92, morning); K.bloom.strength = day ? .25 : mix(.6, .3, morning);
    }
    S.lampLight.intensity = inRoom ? 1.0 * (1 - morning) : 0; S.shade.children[0].material.emissiveIntensity = .2 + .6 * (1 - morning);
    S.windowSky.material.map = morning > .5 ? S.skyMorning : S.skyNight;
    S.beam.material.opacity = .045 * (1 - morning) + .03 * morning; S.beam.material.color.setHex(morning > .5 ? 0xffd9a0 : 0xaecbff);
    S.motes.forEach((m, i) => { const u = (t * .05 + i * .137) % 1; m.position.set(-1.9 + 1.6 * u + .2 * Math.sin(i), 1.2 + ((i * .61) % 1) * 2.4 + .1 * Math.sin(t + i), -2.4 + 1.8 * u); m.visible = inRoom; });
    // sleeper: breathing idle, tosses at midnight and 2 AM, sits up at 7 AM
    K.anim(S.guy, 'Idle_Neutral', t);
    const toss = .18 * Math.sin(clamp01((t - at('sweat')) / 1.6) * Math.PI) - .15 * Math.sin(clamp01((t - at('t2')) / 1.4) * Math.PI);
    const wake = .12 * Math.sin(clamp01((t - at('t7')) / .8) * Math.PI * 3);
    S.sleepRig.rotation.z = toss + wake;
    // orbiting bacteria: during the hook, and again on "covered"
    const orbOn = (t < at('t11') - .2) || (t > at('covered') && t < at('wash'));
    S.orbit.forEach((g, i) => { const a = t * .8 + i * Math.PI / 4, r = 2.2 + .3 * Math.sin(t + i); g.visible = orbOn;
      g.position.set(Math.cos(a) * r, 1.6 + .5 * Math.sin(t * 1.7 + i), -.2 + Math.sin(a) * r * .9); g.rotation.y = -a; g.scale.setScalar(1 + .08 * Math.sin(t * 6 + i)); });
    // sparkles 11 PM → vanish on "think"
    S.sparkles.forEach((s, i) => { const p = s.userData.p; s.visible = t > at('t11') && t < at('think') + .25; const k = pop(prog(t, 't11+' + (i * .08), .3)) * (t > at('think') ? 1 - prog(t, 'think', .25) : 1);
      s.position.set(p[0], p[1] + .08 * Math.sin(t * 3 + i), p[2]); s.rotation.y = t * 2 + i; s.scale.setScalar(Math.max(.01, k)); });
    // heat bubbles rise off him from "heat" to "glands"
    S.heat.forEach((h, i) => { const on = t > at('heat') && t < at('glands'); h.visible = on; if (!on) return;
      const u = ((t - at('heat')) * .45 + i / 12) % 1; h.position.set(-.9 + (i % 6) * .36, 1.05 + u * 2.2, -1.3 + (i % 4) * .7); h.scale.setScalar(.6 + u);
      h.children[0].material.opacity = .55 * (1 - u); });
    // sweat beads pop out and slide
    S.sweat.forEach((d, i) => { const st = T('sweat') + i * .12, on = t > st && t < at('glands') || (t > at('covered') && t < at('wash')); d.visible = on; if (!on) return;
      const u = clamp01((t - st) / 2.2); d.position.set(-.5 + (i % 5) * .25, 1.42 - u * .14, -1.15 + Math.floor(i / 5) * .55 + u * .05); d.scale.setScalar(pop(clamp01((t - st) / .3))); });
    // skin flakes snow onto the pillow at 2 AM
    S.flakes.forEach((f, i) => { const on = t > at('t2') && t < at('mites') || (t > at('covered') && t < at('wash')); f.visible = on; if (!on) return;
      const u = ((t - at('t2')) * .5 + i / 26) % 1; f.position.set(-.7 + (i * .37) % 1.4, 1.5 - u * .45, -1.95 + (i * .23) % .6); f.rotation.set(t * 2 + i, t + i, 0); });
    // sweat glands: blue drops from eccrine, thick yellow drops from apocrine, rising to the surface
    S.eDrops.forEach((d, i) => { const st = T('eccrine+0.6') + i * .7, on = t > st && t < at('t2'); d.visible = on; if (!on) return;
      const u = ((t - st) * .45) % 1; d.position.set(18.4, 2.0 + u * 2.2, .75); d.scale.setScalar(.7 + .5 * u); });
    S.aDrops.forEach((d, i) => { const st = T('fats') + i * .9, on = t > st && t < at('t2'); d.visible = on; if (!on) return;
      const u = ((t - st) * .32) % 1; d.position.set(21.95, 1.4 + u * 2.8, .75); d.scale.setScalar(.7 + .5 * u); });
    S.ecc.rotation.y = t * .6; S.apo.rotation.y = -t * .5;
    // dust mite munching flakes
    S.mite.position.y = .55 + .05 * Math.abs(Math.sin(t * 5)); S.mite.rotation.y = .5 * Math.sin(t * .7);
    S.legs.forEach((l, i) => { l.rotation.x = .35 * Math.sin(t * 8 + i); });
    S.mFlakes.forEach((f, i) => { const near = i === 5 || i === 6; f.scale.setScalar(near ? Math.max(.05, 1 - .9 * ((t * .4 + i * .3) % 1)) : 1); });
    // crowd wiggles + pops in on "bugs"
    S.crowd.forEach((g, i) => { const k = pop(clamp01((t - at('bugs') - i * .03) / .35)); g.scale.setScalar(Math.max(.01, k * (1 + .08 * Math.sin(t * 7 + g.userData.ph))));
      g.rotation.y = t * .8 + g.userData.ph; g.position.y = .65 + .08 * Math.sin(t * 3 + g.userData.ph); });
    // heroes
    const bob = (g, base, ph) => { g.position.y = base + .1 * Math.sin(t * 3 + ph); g.rotation.y = .35 * Math.sin(t * 1.2 + ph); };
    bob(S.epi, 1.0, 0); S.epi.scale.setScalar(Math.max(.01, pop(prog(t, 'epi-0.4', .5))));
    S.acnes.position.y = .2 + .25 * easeOut(prog(t, 'acnes', .6)) + .05 * Math.sin(t * 4); S.acnes.scale.setScalar(Math.max(.01, pop(prog(t, 'acnes-0.3', .5))));
    S.oil.scale.setScalar(1 + .15 * Math.sin(t * 3));
    bob(S.hom, 1.0, 1); S.hom.scale.setScalar(Math.max(.01, pop(prog(t, 'hominis-0.4', .5))) * (1 + .12 * Math.sin(clamp01((t - at('eats') - 1) / .4) * Math.PI)));
    // hominis eats the sweat drop, then burps sulfur gas
    const ep = ease(prog(t, 'eats', 1.2)); S.food.visible = t > at('hominis') && ep < 1;
    S.food.position.set(61.6 - 1.4 * ep, 1.1, 2.3 - .4 * ep); S.food.scale.setScalar(Math.max(.01, 1 - .7 * ep));
    S.gas.forEach((g, i) => { const st = T('gas') + i * .18, on = t > st && t < at('t7'); g.visible = on; if (!on) return;
      const u = clamp01((t - st) / 2.4); g.position.set(60.2 + .35 * Math.sin(i * 2.1) + u * .4, 1.4 + u * 1.6 + i * .08, 2.1 + .3 * Math.cos(i * 1.7)); g.scale.setScalar(.6 + u * 1.6);
      g.children[0].material.opacity = .85 * (1 - .6 * u); });
    // water glass drains on "cup"
    K.setBar(S.glass, .02 + .5 * (1 - ease(prog(t, 'cup', 1.2)))); S.glass.position.y += .82;
    // showers run one after the other
    const run = (arr, on) => arr.forEach((s, i) => { s.visible = on; s.scale.y = .85 + .15 * Math.sin(t * 20 + i); });
    run(S.showerN, t > at('wash')); run(S.showerM, t > at('washnight'));
    S.moon.scale.setScalar(Math.max(.01, pop(prog(t, 'wash', .4)))); S.sun.scale.setScalar(Math.max(.01, pop(prog(t, 'washnight', .4))));
  },
};
