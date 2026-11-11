// Why the fuck did an asteroid wipe out the dinosaurs? — BLUEPRINT look (science)
// Sets: Cretaceous valley x=0 | Earth + asteroid x=40 | crater cutaway x=80 | burning forest x=110
//       dying fern x=140 | food chain x=170 | species grid x=200 | birds x=230 | burrow x=260 | pigeon x=290
window.SCENE = {
  style: 'blueprint',
  distance: 1,
  build(K) {
    const { box, cyl, group, wire, glow, solid, line, GOLD, RED, WHITE, BLUE, GREEN, CYAN, SILVER } = K;
    const S = this.s = {};
    const cone = (r, h, x, y, z, p, c, seg = 6) => { const g = wire(new THREE.ConeGeometry(r, h, seg), c, p); g.position.set(x, y, z); return g; };
    const ball = (r, x, y, z, p, c, d = 0) => { const g = wire(new THREE.IcosahedronGeometry(r, d), c, p); g.position.set(x, y, z); return g; };
    const fern = (x, z, p, s = 1, c = GREEN) => { const g = group(x, 0, z, p); g.scale.setScalar(s); for (let i = 0; i < 5; i++) { const l = cone(.18, 1.6, 0, .7, 0, g, c, 4); l.rotation.z = (i - 2) * .38; l.rotation.x = (i % 2 ? .3 : -.3); } return g; };
    const tree = (x, z, p, s = 1) => { const g = group(x, 0, z, p); g.scale.setScalar(s); cyl(.15, 1.6, 0, .8, 0, g, SILVER, 6); cone(.9, 2.2, 0, 2.6, 0, g, GREEN); cone(.7, 1.6, 0, 3.5, 0, g, GREEN); return g; };
    // ---- dinosaurs ----
    function trike(x, z, p, s = 1, c = CYAN) {
      const g = group(x, 0, z, p); g.scale.setScalar(s); const b = group(0, 0, 0, g); g.userData.body = b;
      box(2.6, 1.4, 1.4, 0, 1.6, 0, b, c); cone(.55, 1.6, -1.95, 1.6, 0, b, c, 5).rotation.z = Math.PI / 2;
      const h = group(1.4, 1.7, 0, b); g.userData.head = h;
      box(1.1, .8, .8, .55, -.15, 0, h, c);
      const fr = []; for (let a = 0; a <= 10; a++) fr.push([Math.cos(a / 10 * Math.PI) * 1.05, Math.sin(a / 10 * Math.PI) * 1.05]);
      K.extrude(fr, .12, .05, -.2, 0, h, c).rotation.y = Math.PI / 2;
      cone(.1, .9, .55, .55, .22, h, WHITE, 4).rotation.z = -.5; cone(.1, .9, .55, .55, -.22, h, WHITE, 4).rotation.z = -.5; cone(.08, .4, 1.15, .15, 0, h, WHITE, 4).rotation.z = -.9;
      g.userData.legs = [[-.85, -.45], [-.85, .45], [.85, -.45], [.85, .45]].map(([a, d]) => { const l = group(a, 1.0, d, g); box(.38, 1.0, .38, 0, -.5, 0, l, c); return l; });
      return g;
    }
    function rex(x, z, p, s = 1, c = CYAN) {
      const g = group(x, 0, z, p); g.scale.setScalar(s); const b = group(0, 0, 0, g); g.userData.body = b;
      const bd = box(2.4, 1.3, 1.1, 0, 2.6, 0, b, c); bd.rotation.z = .25;
      cone(.55, 2.6, -2.2, 2.2, 0, b, c, 5).rotation.z = Math.PI / 2 + .2;
      const nk = box(.8, 1.0, .8, 1.25, 3.4, 0, b, c); nk.rotation.z = -.4;
      const h = group(1.7, 3.95, 0, b); g.userData.head = h;
      box(1.5, .7, .8, .5, .1, 0, h, c); const jaw = group(0, -.25, 0, h); box(1.3, .25, .7, .6, -.15, 0, jaw, c); g.userData.jaw = jaw;
      box(.35, .12, .12, .9, 2.4, .5, b, c).rotation.z = -.7; box(.35, .12, .12, .9, 2.4, -.5, b, c).rotation.z = -.7;
      g.userData.legs = [-.35, .35].map(d => { const l = group(-.2, 2.1, d, g); box(.5, 2.1, .45, 0, -1.05, 0, l, c); box(.8, .18, .5, .2, -2.05, 0, l, c); return l; });
      return g;
    }
    S.trike = trike; S.rex = rex;

    // ---------- SET 1 (x=0): Cretaceous valley + incoming fireball ----------
    const V = group(0, 0, 0);
    for (let i = 0; i < 9; i++) fern(-6 + i * 1.6 + Math.sin(i) * .6, -1 - (i % 3) * 2.2, V, .9 + (i % 3) * .2);
    for (let i = 0; i < 6; i++) tree(-9 + i * 3.6, -9 - (i % 2) * 3, V, 1.1 + (i % 3) * .3);
    for (let i = 0; i < 5; i++) cone(5 + i, 9 + (i % 3) * 3, -18 + i * 10, 4.5, -32, V, BLUE, 5);
    S.tina = trike(-1.2, 1.2, V, 1); S.tina.rotation.y = .5;
    S.rexA = rex(4.2, -3.5, V, .95); S.rexA.rotation.y = -.6;
    S.sun = glow(new THREE.CircleGeometry(3, 40), 0xffe39a, undefined, 1, 10, 15, -40);
    S.ast = group(0, 0, 0); ball(1.1, 0, 0, 0, S.ast, RED, 0);
    S.astGlow = glow(new THREE.SphereGeometry(1.3, 16, 12), 0xff8a3a, S.ast, .55);
    S.trail = []; for (let i = 0; i < 22; i++) S.trail.push(glow(new THREE.SphereGeometry(1.15 * (1 - i / 26), 10, 8), i < 6 ? 0xffd08a : 0xff8a3a, undefined, .55 * (1 - i / 22)));
    S.clouds = []; for (let i = 0; i < 14; i++) { const c = glow(new THREE.IcosahedronGeometry(3 + (i % 3), 0), 0x151c2a, undefined, .9, -20 + i * 3.4, 13 + (i % 3) * 2, -24 - (i % 4) * 3); c.visible = false; S.clouds.push(c); }

    // ---------- SET 2 (x=40): Earth + asteroid ----------
    const E = group(40, 6, -6); S.earth = E;
    wire(new THREE.IcosahedronGeometry(5, 2), CYAN, E, { angle: 1 });
    const ll = []; for (let a = 0; a <= 64; a++) ll.push([Math.cos(a / 64 * Math.PI * 2) * 5.05, 0, Math.sin(a / 64 * Math.PI * 2) * 5.05]);
    line(ll, BLUE, E, 2); const eq2 = line(ll, BLUE, E, 2); eq2.rotation.x = Math.PI / 2;
    S.yuc = group(0, 0, 0, E); S.yuc.position.set(2.2, 1.4, 4.3);
    S.yucRing = glow(new THREE.RingGeometry(.25, .42, 24), RED, S.yuc, 1); S.yuc.lookAt(new THREE.Vector3(2.2, 1.4, 4.3).multiplyScalar(2));
    S.ast2 = group(0, 0, 0); ball(.55, 0, 0, 0, S.ast2, RED, 0); glow(new THREE.SphereGeometry(.7, 12, 10), 0xff8a3a, S.ast2, .5);
    const t2 = glow(new THREE.ConeGeometry(.55, 7, 12, 1, true), 0xffb050, S.ast2, .3); t2.rotation.z = Math.PI / 2 + .45; t2.position.set(3.2, 1.5, 0);
    S.flashBall = glow(new THREE.SphereGeometry(1, 20, 14), 0xfff0c0, undefined, .9); S.flashBall.visible = false;
    // Everest comparison
    S.everest = group(52.5, 0, -2); cone(1.6, 3.5, 0, 1.75, 0, S.everest, WHITE, 4); S.astBar = group(55.5, 0, -2); box(.5, 4.0, .5, 0, 2, 0, S.astBar, RED);

    // ---------- SET 3 (x=80): crater cutaway ----------
    const C = group(80, 0, -2);
    const prof = []; for (let i = 0; i <= 30; i++) { const u = i / 30 * 2 - 1; const d = Math.abs(u) < .75 ? -1.6 * Math.cos(u / .75 * Math.PI / 2) : (1 - Math.abs(u)) * 1.2; prof.push([u * 8, d]); }
    S.craterLine = line(prof.map(p => [p[0] + 80, p[1] + 2.2, -2]), GOLD, undefined, 5);
    box(18, 2.2, 3, 0, 1.1, -1.8, C, BLUE);
    S.waves = [0, 1, 2].map(i => { const r = glow(new THREE.RingGeometry(1, 1.15, 64), GOLD, undefined, .8, 80, 2.25, -2); r.rotation.x = -Math.PI / 2; return r; });
    S.ejecta = []; for (let i = 0; i < 26; i++) { const e = ball(.18 + (i % 3) * .08, 0, 0, 0, undefined, (i % 4) ? 0xff9a4a : RED, 0); e.visible = false; S.ejecta.push(e); }

    // ---------- SET 4 (x=110): forest burns under falling debris ----------
    S.trees = []; S.flames = [];
    for (let i = 0; i < 14; i++) { const x = 104 + (i % 7) * 2, z = -2 - Math.floor(i / 7) * 3 + (i % 2) * .6; S.trees.push(tree(x, z, undefined, .9 + (i % 3) * .15));
      const f = glow(new THREE.ConeGeometry(.7, 2.2, 7), i % 2 ? 0xff7a2a : 0xffb347, undefined, .9, x, 2.6, z + .3); f.visible = false; S.flames.push(f); }
    S.streaks = []; for (let i = 0; i < 18; i++) { const s = glow(new THREE.CylinderGeometry(.05, .12, 3.5, 6), 0xffb050, undefined, .8); s.rotation.z = .5; s.visible = false; S.streaks.push(s); }

    // ---------- SET 5 (x=140): the last fern + sun meter ----------
    S.bigFern = fern(140, 0, undefined, 2.4);
    S.sun5 = glow(new THREE.CircleGeometry(1.6, 40), 0xffe39a, undefined, 1, 145, 9.5, -6);
    S.soot = []; for (let i = 0; i < 16; i++) { const c = glow(new THREE.IcosahedronGeometry(1.2 + (i % 3) * .5, 0), 0x1b2333, undefined, .95, 138 + (i % 8) * 1.8, 10 + Math.floor(i / 8) * 1.2, -5 + (i % 2)); c.visible = false; S.soot.push(c); }
    S.rays = []; for (let i = 0; i < 4; i++) { const r = glow(new THREE.CylinderGeometry(.04, .04, 9, 4), 0xffe39a, undefined, .55); r.position.set(143.5 - i * .6, 5, -3 + i * .5); r.rotation.z = -.35; S.rays.push(r); }

    // ---------- SET 6 (x=170): food chain dominoes ----------
    S.links = [];
    const ped = (x, lbl) => { const g = group(x, 0, 0); box(2.8, .5, 2.4, 0, .25, 0, g, BLUE); return g; };
    const p1 = ped(164.7), p2 = ped(168.9), p3 = ped(173.1), p4 = ped(177.3);
    S.sun6 = glow(new THREE.IcosahedronGeometry(.9, 1), 0xffe39a, p1, 1, 0, 1.8, 0);
    S.chainFern = fern(0, 0, p2, 1.5); S.chainFern.position.y = .5;
    S.chainTina = trike(0, 0, p3, .62); S.chainTina.rotation.y = .4; S.chainTina.position.y = .5;
    S.chainRex = rex(0, 0, p4, .55); S.chainRex.rotation.y = .4; S.chainRex.position.y = .5;
    S.arrows = [166.8, 171, 175.2].map(x => { const a = group(x, 1.8, 0); box(.5, .12, .12, 0, 0, 0, a, GOLD); cone(.2, .4, .4, 0, 0, a, GOLD, 4).rotation.z = -Math.PI / 2; return a; });

    // ---------- SET 7 (x=200): 100 species, 75 vanish ----------
    S.species = [];
    for (let i = 0; i < 100; i++) { const x = 195.5 + (i % 10) * 1, z = -5 + Math.floor(i / 10) * 1; const kind = i % 4;
      const g = kind === 0 ? cone(.28, .7, x, .35, z, undefined, GREEN, 5) : kind === 1 ? box(.5, .5, .5, x, .25, z, undefined, CYAN) : kind === 2 ? ball(.3, x, .3, z, undefined, BLUE, 0) : cyl(.22, .6, x, .3, z, undefined, SILVER, 6);
      S.species.push(g); }
    // deterministic pick of 75 that die (keep a scattered 25)
    S.dies = S.species.map((_, i) => ((i * 37 + 11) % 100) >= 25);

    // ---------- SET 8 (x=230): birds made it ----------
    S.birds = [];
    for (let i = 0; i < 3; i++) { const b = group(228 + i * 2.4, 0, -1 + (i % 2) * 1.6); const body = group(0, 0, 0, b);
      wire(new THREE.SphereGeometry(.5, 8, 6), WHITE, body).scale.set(1.3, .9, .9); body.children[0].position.y = .9;
      ball(.32, .6, 1.45, 0, body, WHITE, 0); cone(.12, .45, .98, 1.42, 0, body, GOLD, 4).rotation.z = -Math.PI / 2;
      cone(.3, .8, -.85, 1.0, 0, body, WHITE, 4).rotation.z = Math.PI / 2;
      const wl = group(0, 1.05, .35, body), wr = group(0, 1.05, -.35, body);
      K.extrude([[-.5, 0], [.4, 0], [-.1, .9]], .04, 0, 0, 0, wl, WHITE).rotation.x = Math.PI / 2; K.extrude([[-.5, 0], [.4, 0], [-.1, .9]], .04, 0, 0, 0, wr, WHITE).rotation.x = -Math.PI / 2;
      box(.06, .55, .06, 0, .28, .15, b, GOLD); box(.06, .55, .06, 0, .28, -.15, b, GOLD);
      b.userData = { body, wl, wr }; S.birds.push(b); }
    S.seeds = []; for (let i = 0; i < 14; i++) S.seeds.push(glow(new THREE.SphereGeometry(.09, 6, 4), GOLD, undefined, 1, 227 + (i * 0.53) % 7, .1, -1.5 + (i * .37) % 3));
    S.toothSkull = group(236, 0, 2.2);

    // ---------- SET 9 (x=260): burrow cutaway with our ancestor ----------
    const B = group(260, 0, -1);
    box(14, 5, 3, 0, -2.5 + 2.5, 0, B, BLUE);
    const tun = []; for (let i = 0; i <= 20; i++) { const u = i / 20; tun.push([257 + u * 7, 4.8 - Math.sin(u * Math.PI * .9) * 3.4, .6]); }
    line(tun, GOLD, undefined, 6);
    S.mammal = group(262.3, 1.3, .6); const mb = wire(new THREE.SphereGeometry(.55, 8, 6), WHITE, S.mammal); mb.scale.set(1.5, .8, .8);
    ball(.32, .8, .15, 0, S.mammal, WHITE, 0); cone(.12, .3, 1.15, .1, 0, S.mammal, WHITE, 4).rotation.z = -Math.PI / 2;
    S.mTail = line([[-.8, 0, 0], [-1.3, .2, 0], [-1.7, .1, 0]], WHITE, S.mammal, 3);
    const hand = []; for (let i = 0; i < 12; i++) hand.push([266.5 + Math.sin(i) * .1, 6.5 + i * .2, .6]);

    // ---------- SET 10 (x=290): pigeon on a window sill ----------
    const P = group(290, 0, -1.5);
    box(6, 7, .4, 0, 3.5, -.3, P, BLUE); box(3.4, 3.6, .1, 0, 4.0, 0, P, 0x2a4f8a); box(.12, 3.6, .14, 0, 4.0, .05, P, BLUE); box(3.4, .12, .14, 0, 4.0, .05, P, BLUE);
    box(4.2, .3, 1.2, 0, 2.05, .5, P, WHITE);
    S.pigeon = group(289.6, 2.2, -.9); const pb = group(0, 0, 0, S.pigeon);
    wire(new THREE.SphereGeometry(.45, 8, 6), SILVER, pb).scale.set(1.3, .9, .9); pb.children[0].position.y = .5;
    ball(.28, .5, 1.0, 0, pb, SILVER, 0); cone(.08, .25, .82, .98, 0, pb, GOLD, 4).rotation.z = -Math.PI / 2; cone(.25, .7, -.75, .55, 0, pb, SILVER, 4).rotation.z = Math.PI / 2 + .3;
    S.pigeonHead = pb;
  },

  shots: [
    [0,          [-8, 2.2, 14],   [2, 6.5, -8],    2],
    ['setup',    [-6, 3.6, 10.5], [-.4, 2, -.5],   1],
    ['rock',     [40, 6, 20],     [40, 6, -6],     4],
    ['crater',   [80, 9, 13],     [80, 1.8, -2],   1.5],
    ['step1',    [110, 6.5, 13],  [110, 3.2, -3],  1.5],
    ['step2',    [140, 5.5, 13],  [141.5, 4.6, -2],1],
    ['step3',    [171, 7.5, 30],  [171, 2.2, 0],   2],
    ['math',     [200, 13, 9],    [200, 0, -1.2],  1],
    ['catch',    [231, 3.2, 8.5], [230.4, 1.4, -.5],1],
    ['contrast', [260, 4, 13],    [260.5, 2.2, -1],1],
    ['punch',    [-8, 2.2, 14],   [2, 6.5, -8],    1.2],
    ['pigeon',   [290, 3.6, 10],  [290, 3.0, -1],  1.2],
  ],

  cards: [
    { l: 'Incoming', v: 'ASTEROID', cls: 'red', a: [2, 11.6, -10], t0: 0, t1: 'reframe' },
    { l: 'The hit', v: 'NOT IT ✕', cls: 'white', a: [3, 10.5, -8], t0: 'reframe', t1: 'reframe+1.3' },
    { l: 'The killer', v: 'DARKNESS', cls: 'red big', a: [3, 10.5, -8], t0: 'reframe+1.3', t1: 'setup' },
    { l: '66 million years ago', v: 'TINA', cls: 'white', a: [-1, 4.6, 1.2], t0: 'setup+0.2', t1: 'rock' },
    { l: 'Width', v: '10 KM', cls: 'red', a: [40, 13.5, -6], t0: 'rock+0.6', t1: 'impact' },
    { v: 'TALLER THAN EVEREST', cls: 'white', a: [40, 11.9, -6], t0: 'rock+1.6', t1: 'impact' },
    { l: 'Speed', v: '0 KM/H', cls: 'red big', a: [40, 13, -6], t0: 'impact', t1: 'crater', count: [0, 72000, 'impact', 1.4], fmt: n => Math.round(n).toLocaleString('en-US') + ' KM/H' },
    { v: 'MEXICO', cls: 'tag', a: [40, 2.5, 0], t0: 'impact+0.6', t1: 'crater' },
    { l: 'Crater', v: '180 KM WIDE', a: [80, 7.4, -2], t0: 'crater+0.4', t1: 'step1' },
    { l: 'Debris falls back', v: 'SKY HEATS UP', cls: 'red', a: [110, 5.4, 0], t0: 'fire+0.3', t1: 'step2' },
    { l: 'Sunlight for plants', v: '100%', cls: 'big', a: [138, 8.2, -2], t0: 'photo', t1: 'step3', count: [100, 1, 'photo+0.2', 1.6], fmt: n => (n < 1.5 ? '<1' : Math.round(n)) + '%' },
    { v: 'FOR 1+ YEAR', cls: 'red', a: [138, 6.6, -2], t0: 'photo+1.8', t1: 'step3' },
    { v: 'SUN', cls: 'tag', a: [164.7, 4.2, 0], t0: 'step3', t1: 'math' },
    { v: 'PLANTS', cls: 'tag', a: [168.9, 4.2, 0], t0: 'step3+0.2', t1: 'math' },
    { v: 'TINA', cls: 'tag', a: [173.1, 4.2, 0], t0: 'step3+0.4', t1: 'math' },
    { v: 'T. REX', cls: 'tag', a: [177.3, 4.6, 0], t0: 'step3+0.6', t1: 'math' },
    { l: 'Species lost', v: '0%', cls: 'red big', a: [200, 6.8, -1.2], t0: 'math+0.2', t1: 'catch', count: [0, 75, 'gone', 1.2], fmt: n => Math.round(n) + '%' },
    { l: 'Survivors', v: 'BIRDS', a: [230.4, 4.6, -.5], t0: 'birds', t1: 'contrast' },
    { v: 'BEAKS → SEEDS', cls: 'white', a: [230.4, 3.4, 1], t0: 'beaks+0.3', t1: 'contrast' },
    { l: 'Also survived', v: 'TINY MAMMALS', cls: 'white', a: [260.5, 7, -1], t0: 'contrast+0.3', t1: 'us' },
    { l: 'That\'s', v: 'OUR ANCESTORS', a: [260.5, 7, -1], t0: 'us', t1: 'punch' },
    { l: 'Pigeon', v: 'STILL A DINOSAUR', a: [290, 6.6, -1], t0: 'dino', t1: 'cta+0.1' },
  ],

  steps: { title: 'HOW IT KILLED', labels: ['FIRE', 'DARK', 'STARVE'], marks: ['step1', 'step2', 'step3'], from: 'step1', to: 'math' },
  receipt: { from: 'punch', to: 'pigeon', title: 'THE EXTINCTION', rows: [
    ['ASTEROID', '10 KM'], ['SPEED', '72,000 KM/H'], ['CRATER', '180 KM'], ['LIGHT FOR PLANTS', '<1%'], ['SURVIVORS', 'BIRDS + MAMMALS', 'g'], ['SPECIES LOST', '75%', 'k']] },
  follow: { from: 'cta+0.2', title: 'MORE WHY THE F*CK SCIENCE' },
  shakes: [['impact+1.2', 1.0, .22], ['crater', .8, .15]],
  flashes: [['impact+1.2', .5, .3]],

  update(t, K) {
    const { at, T, ease, easeOut, clamp01 } = K, S = this.s;
    const v3 = (x, y, z) => new THREE.Vector3(x, y, z);
    // darkness: the whole world dims after "dark" and stays dim, lifts for the birds/mammals, dims again on the punch
    const dk = Math.max(ease(clamp01((t - at('dark')) / 1.5)) * (1 - ease(clamp01((t - at('catch')) / .6))), ease(clamp01((t - at('punch')) / .8)) * (1 - ease(clamp01((t - at('pigeon')) / .4))));
    const bg = K.col(0x061630).lerp(K.col(0x010308), dk); K.scene.background.copy(bg); K.scene.fog.color.copy(bg);
    K.keyLight.intensity = .8 * (1 - .7 * dk);
    // hook: fireball streaks across the sky toward the horizon
    const u = clamp01(t / 5.5), p0 = v3(-3, 13.5, -15), p1 = v3(14, 3, -40);
    S.ast.position.lerpVectors(p0, p1, u); S.ast.visible = t < at('setup'); S.ast.rotation.set(t * 1.3, t * .9, 0);
    S.trail.forEach((g, i) => { const uu = u - (i + 1) * .018; g.visible = S.ast.visible; g.position.lerpVectors(p0, p1, uu); g.position.y += Math.sin(t * 30 + i) * .05; });
    S.astGlow.scale.setScalar(1 + .12 * Math.sin(t * 22));
    S.sun.material.opacity = 1 - dk; S.clouds.forEach((c, i) => { c.visible = dk > .02; c.material.opacity = .9 * dk; });
    // Tina grazes, T. rex looks up
    S.tina.userData.head.rotation.z = -.35 + Math.sin(t * 2.4) * .2;
    S.rexA.userData.head.rotation.z = t < at('setup') ? .35 : .1 * Math.sin(t * 1.5); S.rexA.userData.jaw.rotation.z = -.15 - .15 * Math.sin(t * 3);
    // earth + asteroid
    S.earth.rotation.y = .3 + t * .05;
    const ia = at('impact') + 1.2, ua = clamp01((t - at('rock')) / (ia - at('rock')));
    const tgt = new THREE.Vector3(); S.yuc.getWorldPosition(tgt);
    S.ast2.position.lerpVectors(v3(58, 16, 2), tgt, ease(ua)); S.ast2.visible = t > at('rock') - .5 && t < ia; S.ast2.rotation.set(t * 2, t, 0);
    S.flashBall.visible = t > ia && t < ia + 1.2; if (S.flashBall.visible) { const q = (t - ia) / 1.2; S.flashBall.position.copy(tgt); S.flashBall.scale.setScalar(.5 + q * 4); S.flashBall.material.opacity = .9 * (1 - q); }
    S.yucRing.scale.setScalar(1 + .3 * Math.sin(t * 8));
    const ev = ease(clamp01((t - at('rock') - 1.6) / .6)); S.everest.scale.setScalar(Math.max(.001, ev)); S.astBar.scale.set(1, Math.max(.001, ev), 1);
    // crater: shock rings + ejecta
    S.waves.forEach((w, i) => { const q = clamp01((t - at('crater') - i * .35) / 1.6); w.visible = q > 0 && q < 1; w.scale.setScalar(1 + q * 9); w.material.opacity = .8 * (1 - q); });
    K.setLine(S.craterLine, easeOut(clamp01((t - at('crater')) / .6)));
    S.ejecta.forEach((e, i) => { const q = (t - at('crater') - (i % 5) * .08) / 1.8; e.visible = q > 0 && q < 1; if (!e.visible) return;
      const ang = (i / 26) * Math.PI * 2, sp = 3 + (i % 4); e.position.set(80 + Math.cos(ang) * sp * q * 2, 2.2 + 9 * q - 9 * q * q * 1.1 + .4, -2 + Math.sin(ang) * sp * q * .6); });
    // burning forest
    S.streaks.forEach((s, i) => { const st = at('step1') + .1 + (i % 9) * .25, q = (t - st) / .7; s.visible = q > 0 && q < 1 && t < at('step2');
      s.position.set(102 + (i * 1.7) % 16 + 3 - q * 3, 12 - q * 10, -2 - (i % 3) * 2); });
    S.flames.forEach((f, i) => { const on = t > at('fire') + .2 + (i % 7) * .18 && t < at('step3'); f.visible = on; f.scale.set(1, .8 + .3 * Math.sin(t * 17 + i), 1); });
    S.trees.forEach((tr, i) => { tr.rotation.z = t > at('fire') + 1.6 + (i % 5) * .2 ? Math.min(.4, (t - at('fire') - 1.6 - (i % 5) * .2) * .4) * (i % 2 ? 1 : -1) : 0; });
    // last fern: sun hidden by soot, fern wilts
    const sd = ease(clamp01((t - at('dark') - .2) / 1.4));
    S.soot.forEach((c, i) => { c.visible = sd > 0; c.position.x = 138 + (i % 8) * 1.8 - (1 - sd) * 12 + i * .1; });
    S.sun5.material.opacity = 1 - .97 * sd; S.rays.forEach(r => { r.material.opacity = .55 * (1 - sd); r.visible = sd < .98; });
    const wilt = ease(clamp01((t - at('photo') - .4) / 2)); S.bigFern.children.forEach((l, i) => l.rotation.z = (i - 2) * (.38 + wilt * .7)); S.bigFern.scale.y = 2.4 * (1 - .35 * wilt);
    // food chain dominoes
    S.sun6.scale.setScalar(Math.max(.05, 1 - ease(clamp01((t - at('chain')) / .5))));
    const fall = (o, cue, dir = 1) => { o.rotation.z = -dir * 1.45 * ease(clamp01((t - T(cue)) / .5)); };
    fall(S.chainFern, 'chain+0.6'); fall(S.chainTina, 'chain2+0.4'); fall(S.chainRex, 'chain3+0.4');
    // 75 of 100 species vanish
    S.species.forEach((g, i) => { if (!S.dies[i]) return; const q = ease(clamp01((t - at('gone') - (i % 10) * .05 - Math.floor(i / 10) * .03) / .5));
      g.scale.setScalar(Math.max(.001, 1 - q)); g.position.y = .3 - q * .3; });
    // birds hop and peck, wings flap
    S.birds.forEach((b, i) => { const ph = t * 3 + i * 1.7, peck = Math.max(0, Math.sin(ph)); b.userData.body.rotation.z = -peck * .5;
      b.position.y = Math.max(0, Math.sin(t * 5 + i * 2)) * .25 * (i === 1 ? 1 : 0);
      const fl = i === 1 && t > at('birds') + .4 && t < at('beaks') ? Math.sin(t * 22) * .8 : 0; b.userData.wl.rotation.x = fl; b.userData.wr.rotation.x = -fl; });
    S.seeds.forEach((sd2, i) => { sd2.visible = t < at('beaks') + 1 + (i % 7) * .25; });
    // mammal sniffs
    S.mammal.rotation.z = Math.sin(t * 6) * .05; S.mammal.position.x = 262.3 + Math.sin(t * 1.2) * .3;
    // pigeon bob
    S.pigeonHead.position.x = Math.max(0, Math.sin(t * 4)) * .18; S.pigeon.rotation.y = Math.sin(t * .8) * .25;
  },
};
