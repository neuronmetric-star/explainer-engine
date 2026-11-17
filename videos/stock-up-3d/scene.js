// 17 Countries Are Telling People to Stock Up — 3D scene (gold-noir engine).
// Sets (x): flags+calendar 0 | EU crowd 20 | 72h + supplies 34 | Sweden houses 50 | days bars 70 |
//           why-now 92 | rumour 115 | grids 135 | closet 155 | date vs week 175
// The first ~6.1 s (hook) is replaced by the supermarket clips in finish.py.
window.SCENE = {
  distance: 1.0,
  build(K) {
    const { box, cyl, roof, group, ring, person, bar, tube, wire, GOLD, RED, BLUE, GREEN, SILVER, WHITE } = K;
    const S = this.s = { tex: [] };
    // ---------- canvas textures (redrawn once the Inter font is ready) ----------
    const texture = (w, h, draw) => { const c = document.createElement('canvas'); c.width = w; c.height = h;
      const t = new THREE.CanvasTexture(c); t.encoding = THREE.sRGBEncoding; t.anisotropy = 4;
      const redraw = () => { const g = c.getContext('2d'); g.clearRect(0, 0, w, h); draw(g, w, h); t.needsUpdate = true; };
      redraw(); S.tex.push(redraw); return t; };
    const panel = (t, w, h, x, y, z, parent, frame = GOLD, tint = 0xb4b4b4) => {
      const g = group(x, y, z, parent);
      const m = new THREE.Mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshBasicMaterial({ map: t, color: tint, transparent: true, side: THREE.DoubleSide }));
      g.add(m); g.userData.mat = m.material;
      if (frame !== null) { const f = wire(new THREE.PlaneGeometry(w * 1.05, h * 1.05), frame, g); f.children[0].visible = false; f.position.z = -.01; }
      return g; };
    const txt = (s, color = '#fff', bg = null, font = 900) => texture(512, 256, (g, w, h) => {
      if (bg) { g.fillStyle = bg; g.fillRect(0, 0, w, h); }
      g.fillStyle = color; g.textAlign = 'center'; g.textBaseline = 'middle';
      let size = 150; g.font = `${font} ${size}px IN, sans-serif`; while (g.measureText(s).width > w * .9) { size -= 6; g.font = `${font} ${size}px IN, sans-serif`; }
      g.fillText(s, w / 2, h / 2 + 6); });
    // flags drawn in 2D (3:2)
    const FL = {
      GB: g => { g.fillStyle = '#012169'; g.fillRect(0, 0, 300, 200); g.lineWidth = 40; g.strokeStyle = '#fff'; diag(g); g.lineWidth = 14; g.strokeStyle = '#C8102E'; diag(g);
        g.fillStyle = '#fff'; g.fillRect(125, 0, 50, 200); g.fillRect(0, 75, 300, 50); g.fillStyle = '#C8102E'; g.fillRect(135, 0, 30, 200); g.fillRect(0, 85, 300, 30); },
      IE: g => vb(g, '#169B62', '#fff', '#FF883E'), FR: g => vb(g, '#0055A4', '#fff', '#EF4135'), DE: g => hb(g, '#000', '#DD0000', '#FFCE00'),
      NL: g => hb(g, '#AE1C28', '#fff', '#21468B'), DK: g => nordic(g, '#C8102E', '#fff'), NO: g => nordic(g, '#BA0C2F', '#fff', '#00205B'),
      SE: g => nordic(g, '#006AA7', '#FECC00'), FI: g => nordic(g, '#fff', '#002F6C'), EE: g => hb(g, '#0072CE', '#000', '#fff'),
      LV: g => { hb(g, '#9E3039', '#fff', '#9E3039'); g.fillStyle = '#9E3039'; g.fillRect(0, 0, 300, 80); g.fillRect(0, 120, 300, 80); },
      LT: g => hb(g, '#FDB913', '#006A44', '#C1272D'), PL: g => hb(g, '#fff', '#DC143C'),
      CZ: g => { hb(g, '#fff', '#D7141A'); g.fillStyle = '#11457E'; g.beginPath(); g.moveTo(0, 0); g.lineTo(150, 100); g.lineTo(0, 200); g.fill(); },
      AT: g => hb(g, '#C8102E', '#fff', '#C8102E'),
      CH: g => { g.fillStyle = '#DA291C'; g.fillRect(0, 0, 300, 200); g.fillStyle = '#fff'; g.fillRect(132, 40, 36, 120); g.fillRect(90, 82, 120, 36); },
      HR: g => { hb(g, '#FF0000', '#fff', '#171796'); for (let i = 0; i < 5; i++) for (let j = 0; j < 5; j++) { g.fillStyle = (i + j) % 2 ? '#fff' : '#FF0000'; g.fillRect(125 + i * 10, 75 + j * 10, 10, 10); } },
      UA: g => hb(g, '#0057B7', '#FFD700'),
      EU: g => { g.fillStyle = '#003399'; g.fillRect(0, 0, 300, 200); g.fillStyle = '#FFCC00';
        for (let k = 0; k < 12; k++) { const a = k * Math.PI / 6; star(g, 150 + 62 * Math.cos(a), 100 + 62 * Math.sin(a), 9); } },
    };
    function diag(g) { g.beginPath(); g.moveTo(0, 0); g.lineTo(300, 200); g.moveTo(300, 0); g.lineTo(0, 200); g.stroke(); }
    function hb(g, ...c) { c.forEach((col, i) => { g.fillStyle = col; g.fillRect(0, i * 200 / c.length, 300, 200 / c.length + 1); }); }
    function vb(g, ...c) { c.forEach((col, i) => { g.fillStyle = col; g.fillRect(i * 300 / c.length, 0, 300 / c.length + 1, 200); }); }
    function nordic(g, bg, cr, inner) { g.fillStyle = bg; g.fillRect(0, 0, 300, 200); g.fillStyle = cr; g.fillRect(84, 0, 44, 200); g.fillRect(0, 78, 300, 44);
      if (inner) { g.fillStyle = inner; g.fillRect(95, 0, 22, 200); g.fillRect(0, 89, 300, 22); } }
    function star(g, x, y, r) { g.beginPath(); for (let i = 0; i < 10; i++) { const a = -Math.PI / 2 + i * Math.PI / 5, rr = i % 2 ? r * .45 : r; g.lineTo(x + rr * Math.cos(a), y + rr * Math.sin(a)); } g.fill(); }
    const flagTex = code => texture(300, 200, g => FL[code](g));
    const flag = (code, w, x, y, z, parent) => panel(flagTex(code), w, w / 1.5, x, y, z, parent, GOLD, 0xa8a8a8);

    // ---------- HOOK: 3D supermarket panic with stick people (x=-40) ----------
    const X0 = -40;
    S.stickMat = new THREE.MeshLambertMaterial({ color: 0x7c7c7c });
    S.girlMat = new THREE.MeshLambertMaterial({ color: 0x9a6d78 });
    const Y = new THREE.Vector3(0, 1, 0);
    S.mkStick = (x, z, girl) => {
      const g = group(x, 0, z), mat = girl ? S.girlMat : S.stickMat, P = {};
      const seg = r => { const m = new THREE.Mesh(new THREE.CylinderGeometry(r, r, 1, 8), mat); g.add(m); return m; };
      const jnt = r => { const m = new THREE.Mesh(new THREE.SphereGeometry(r, 10, 8), mat); g.add(m); return m; };
      P.torso = seg(.075); P.head = jnt(.27);
      ['uaL', 'faL', 'uaR', 'faR', 'thL', 'shL', 'thR', 'shR'].forEach(k => P[k] = seg(.055));
      ['hdL', 'hdR', 'ftL', 'ftR', 'elL', 'elR', 'knL', 'knR'].forEach(k => P[k] = jnt(.07));
      if (girl) { P.skirt = new THREE.Mesh(new THREE.ConeGeometry(.42, .62, 14, 1, true), mat); g.add(P.skirt);
        P.tail = jnt(.13); }
      return { g, P, girl };
    };
    const limb = (m, a, b) => { m.position.copy(a).add(b).multiplyScalar(.5); const d = b.clone().sub(a); m.scale.set(1, d.length(), 1); m.quaternion.setFromUnitVectors(Y, d.normalize()); };
    // pose: {bob, lean, aL:[pitch,abduct,elbow], aR:[...], lL:[pitch,knee], lR:[...]}
    S.pose = (F, o) => {
      const P = F.P, V = (x, y, z) => new THREE.Vector3(x, y, z);
      const hip = V(0, 1.0 + (o.bob || 0), 0), lean = o.lean || 0;
      const neck = hip.clone().add(V(0, .85 * Math.cos(lean), .85 * Math.sin(lean)));
      limb(P.torso, hip, neck); P.head.position.copy(neck).add(V(0, .36 * Math.cos(lean), .36 * Math.sin(lean)));
      const arm = (side, [a, c, b], ua, fa, el, hd) => {
        const sh = neck.clone().add(V(side * .24, -.06, 0));
        const d1 = V(side * Math.sin(c), -Math.cos(a) * Math.cos(c), Math.sin(a) * Math.cos(c));
        const e = sh.clone().add(d1.multiplyScalar(.46));
        const a2 = a + b, c2 = c * (o.inward ? -1.4 : .6);
        const d2 = V(side * Math.sin(c2), -Math.cos(a2) * Math.cos(c2), Math.sin(a2) * Math.cos(c2));
        const h = e.clone().add(d2.multiplyScalar(.42)); limb(ua, sh, e); limb(fa, e, h); el.position.copy(e); hd.position.copy(h); return h; };
      F.hL = arm(-1, o.aL, P.uaL, P.faL, P.elL, P.hdL); F.hR = arm(1, o.aR, P.uaR, P.faR, P.elR, P.hdR);
      const leg = (side, [p, k], th, shn, kn, ft) => {
        const hp = hip.clone().add(V(side * .14, 0, 0)); const kk = hp.clone().add(V(0, -Math.cos(p) * .5, Math.sin(p) * .5));
        const f = kk.clone().add(V(0, -Math.cos(p - k) * .52, Math.sin(p - k) * .52)); limb(th, hp, kk); limb(shn, kk, f); kn.position.copy(kk); ft.position.copy(f); };
      leg(-1, o.lL, P.thL, P.shL, P.knL, P.ftL); leg(1, o.lR, P.thR, P.shR, P.knR, P.ftR);
      if (P.skirt) { P.skirt.position.copy(hip).add(V(0, -.12, 0)); P.tail.position.copy(P.head.position).add(V(0, -.05, -.3)); }
    };
    S.run = (t, sp = 9, off = 0) => { const f = t * sp + off, s1 = Math.sin(f);
      return { bob: .07 * Math.abs(Math.cos(f)), lean: .22, aL: [-.8 * s1, .15, 1.4], aR: [.8 * s1, .15, 1.4],
        lL: [.75 * s1, .3 + .7 * Math.max(0, Math.cos(f + .4))], lR: [-.75 * s1, .3 + .7 * Math.max(0, -Math.cos(f + .4))] }; };
    // aisle: two shelving runs, products (instanced), ceiling lights
    S.prod = []; const pg = new THREE.BoxGeometry(.28, .34, .26);
    const pm2 = new THREE.MeshBasicMaterial({ color: 0xffffff });
    const slots = []; [-1, 1].forEach(side => { const sx = X0 + side * 2.1;
      box(.12, 2.9, 17, sx + side * .55, 1.45, -5.5, undefined, SILVER);
      [.45, 1.25, 2.05, 2.85].forEach(y => box(1.05, .06, 17, sx, y, -5.5, undefined, SILVER));
      for (const y of [.45, 1.25, 2.05]) for (let z = 2.6; z > -13.6; z -= .36) slots.push([sx + (Math.random() - .5) * .3, y + .2, z]); });
    S.products = new THREE.InstancedMesh(pg, pm2, slots.length); K.scene.add(S.products);
    const pal = [0xffc548, 0x6fa8ff, 0xff5a4a, 0x9dffb9, 0xe8e8e8, 0xffffff];
    S.slots = slots.map((p, i) => { S.products.setColorAt(i, new THREE.Color(pal[i % pal.length]).multiplyScalar(.55));
      return { p, gone: Math.random() < .45 ? -1 : Math.random() * 5.5 }; });
    S.lights = [-1, -5, -9, -13].map(z => { const m = new THREE.Mesh(new THREE.BoxGeometry(.25, .08, 2.6), new THREE.MeshBasicMaterial({ color: 0xeef6ff })); m.position.set(X0, 4.3, z); K.scene.add(m); return m; });
    // cart full of water
    const mkCart = (x, z) => { const g = group(x, 0, z); box(.95, .6, 1.25, 0, .85, 0, g, SILVER); box(.7, .04, 1.1, 0, .35, 0, g, SILVER);
      [[-.4, .5], [.4, .5], [-.4, -.5], [.4, -.5]].forEach(([wx, wz]) => cyl(.09, .06, wx, .09, wz, g, SILVER, 10).rotation.z = Math.PI / 2);
      for (let i = 0; i < 6; i++) cyl(.11, .45, -.25 + (i % 3) * .25, 1.15 + Math.floor(i / 3) * .12, -.25 + Math.floor(i / 3) * .4, g, BLUE, 8);
      cyl(.06, .9, 0, 1.2, -.65, g, SILVER, 6).rotation.z = Math.PI / 2; return g; };
    // cast
    S.cast = {
      cartGuy: S.mkStick(X0 - .4, -10, false), cart: mkCart(X0 - .4, -9),
      reachGirl: S.mkStick(X0 - 1.15, -4.2, true), panicGirl: S.mkStick(X0 + .3, -7.5, true),
      tugA: S.mkStick(X0 - .75, -2.0, false), tugB: S.mkStick(X0 + .85, -2.0, true),
      runner: S.mkStick(X0 - 3, -12.2, false), runner2: S.mkStick(X0 + .6, -5.5, false),
    };
    S.grab = new THREE.Mesh(new THREE.BoxGeometry(.28, .34, .26), new THREE.MeshBasicMaterial({ color: 0xffc548 })); K.scene.add(S.grab);
    S.water = group(0, 0, 0); box(.5, .32, .34, 0, 0, 0, S.water, BLUE);
    for (let i = 0; i < 6; i++) cyl(.07, .3, -.17 + (i % 3) * .17, .02, -.08 + Math.floor(i / 3) * .16, S.water, BLUE, 8);
    S.boxes2 = [0, 1, 2].map(() => { const m = new THREE.Mesh(new THREE.BoxGeometry(.26, .3, .24), new THREE.MeshBasicMaterial({ color: 0x9dffb9 })); K.scene.add(m); return m; });

    // ---------- A: 17 flags + "Nov 17" calendar (x=0) ----------
    const codes = ['GB', 'IE', 'FR', 'DE', 'NL', 'DK', 'NO', 'SE', 'FI', 'EE', 'LV', 'LT', 'PL', 'CZ', 'AT', 'CH', 'HR'];
    S.flags = codes.map((c, i) => { const row = Math.floor(i / 6), k = i % 6, n = row < 2 ? 6 : 5;
      const x = (k - (n - 1) / 2) * 1.85, z = -3 - Math.abs(x) * .18; const f = flag(c, 1.6, x, 0, z); f.rotation.y = -x * .05;
      f.userData.y = 4.6 - row * 1.35; f.userData.d = i * .07; return f; });
    ring(5.2, 0, -3);
    S.cal = group(0, 2.7, 3.2);
    box(2.6, 3.0, .3, 0, 0, 0, S.cal, WHITE);
    panel(texture(400, 460, (g, w, h) => { g.fillStyle = '#f3f1ea'; g.fillRect(0, 0, w, h); g.fillStyle = '#d32f2f'; g.fillRect(0, 0, w, 110);
      g.fillStyle = '#fff'; g.font = '900 78px IN, sans-serif'; g.textAlign = 'center'; g.fillText('NOV', w / 2, 82);
      g.fillStyle = '#1a1a1a'; g.font = '900 250px IN, sans-serif'; g.fillText('17', w / 2, 380); }), 2.4, 2.76, 0, 0, .16, S.cal, null, 0x8c8c8c);
    S.calX = group(0, 0, .35, S.cal); box(3.4, .28, .1, 0, 0, 0, S.calX, RED).rotation.z = .8; box(3.4, .28, .1, 0, 0, 0, S.calX, RED).rotation.z = -.8;

    // ---------- B: EU crowd of 450M (x=20) ----------
    const NX = 34, NZ = 18; S.crowdN = NX * NZ;
    const pm = new THREE.MeshLambertMaterial({ color: 0x3c3c3c });
    S.body = new THREE.InstancedMesh(new THREE.CylinderGeometry(.13, .15, .5, 8), pm, S.crowdN);
    S.head = new THREE.InstancedMesh(new THREE.SphereGeometry(.12, 10, 8), pm, S.crowdN);
    K.scene.add(S.body, S.head); S.crowd = [];
    for (let i = 0; i < NX; i++) for (let j = 0; j < NZ; j++) { const x = 20 + (i - NX / 2) * .46 + (Math.random() - .5) * .14, z = -10 + j * .55 + (Math.random() - .5) * .14;
      S.crowd.push({ x, z, d: Math.hypot(x - 20, (z + 5) * 1.4) * .09 + Math.random() * .15 }); }
    S.euStars = group(20, 6.2, -7);
    for (let k = 0; k < 12; k++) { const a = k * Math.PI / 6; const pts = []; for (let i = 0; i < 10; i++) { const b = -Math.PI / 2 + i * Math.PI / 5, r = i % 2 ? .13 : .3; pts.push([Math.cos(b) * r, Math.sin(b) * r]); }
      K.extrude(pts, .08, Math.cos(a) * 2.4, Math.sin(a) * 2.4, 0, S.euStars, GOLD); }
    S.euFlag = flag('EU', 1.5, 20, 6.2, -7.2);

    // ---------- B2: 72 hours + supplies (x=34) ----------
    const circ = []; for (let i = 0; i <= 64; i++) { const a = Math.PI / 2 - i / 64 * Math.PI * 2; circ.push([34 + Math.cos(a) * 2.5, 4.4 + Math.sin(a) * 2.5, -2]); }
    S.clock = tube(circ, 0xffd15a, .09);
    for (let i = 0; i < 12; i++) { const a = i / 12 * Math.PI * 2; const tk = box(.08, .4, .08, 34 + Math.sin(a) * 2.1, 4.4 + Math.cos(a) * 2.1, -2); tk.rotation.z = -a; }
    S.hand = group(34, 4.4, -1.9); box(.12, 2, .12, 0, 1, 0, S.hand, GOLD);
    S.shelfB = box(5, .15, 1.2, 34, .9, 1.2, undefined, SILVER);
    S.supplies = [];
    const mkWater = (x, y, z, p) => { const g = group(x, y, z, p); cyl(.2, .8, 0, .4, 0, g, BLUE, 12); cyl(.08, .14, 0, .87, 0, g, BLUE, 8); return g; };
    const mkCan = (x, y, z, p) => { const g = group(x, y, z, p); cyl(.2, .34, 0, .17, 0, g, SILVER, 14); return g; };
    const crossTex = texture(256, 256, (g, w, h) => { g.fillStyle = '#f2f2f2'; g.fillRect(0, 0, w, h); g.fillStyle = '#d32f2f'; g.fillRect(98, 40, 60, 176); g.fillRect(40, 98, 176, 60); });
    const mkMeds = (x, y, z, p) => { const g = group(x, y, z, p); box(.62, .46, .36, 0, .23, 0, g, WHITE); panel(crossTex, .34, .34, 0, .23, .19, g, null, 0xb0b0b0); return g; };
    [[-1.9, mkWater], [-1.3, mkWater], [-.6, mkCan], [-.1, mkCan], [.4, mkCan], [1.2, mkMeds], [1.9, mkWater]].forEach(([dx, fn], i) => {
      const g = fn(34 + dx, 0, 1.2); g.userData.d = i * .22; S.supplies.push(g); });

    // ---------- C: Sweden, booklet to every household (x=50) ----------
    S.houses = [];
    for (let i = 0; i < 5; i++) { const hx = 44 + i * 3; const H_ = group(hx, 0, -4);
      box(2, 1.6, 2, 0, .8, 0, H_, BLUE); roof(2.3, 1.1, 2.1, 0, 1.6, 0, H_, BLUE); box(.5, .9, .06, 0, .45, 1.02, H_, BLUE); S.houses.push(hx); }
    const bookTex = texture(320, 440, (g, w, h) => { g.fillStyle = '#0a4f8f'; g.fillRect(0, 0, w, h); g.fillStyle = '#FECC00'; g.fillRect(0, 300, w, 34);
      g.fillStyle = '#fff'; g.textAlign = 'center'; g.font = '900 46px IN, sans-serif';
      ['IF CRISIS', 'OR WAR', 'COMES'].forEach((s, i) => g.fillText(s, w / 2, 110 + i * 62)); g.font = '600 26px IN, sans-serif'; g.fillText('SWEDEN · 2024', w / 2, 400); });
    S.books = []; for (let i = 0; i < 5; i++) { const b = group(0, 0, 0); box(.5, .68, .05, 0, 0, 0, b, GOLD); panel(bookTex, .46, .64, 0, 0, .03, b, null, 0xc0c0c0); b.visible = false; S.books.push(b); }
    S.hero = group(50, 3, 2.2); box(1.6, 2.2, .14, 0, 0, 0, S.hero, GOLD); panel(bookTex, 1.5, 2.06, 0, 0, .08, S.hero, null, 0xc8c8c8);
    S.seFlag = flag('SE', 1.4, 50, 5.9, -4.5);

    // ---------- D: how many days (x=70) ----------
    S.dayBars = [['EU', 3, '3 DAYS'], ['NO', 7, '1 WEEK'], ['SE', 7, '1 WEEK'], ['DE', 10, '10 DAYS']].map(([c, d, lab], i) => {
      const x = 67 + i * 2; const b = bar(1.3, 1.3, x, -1, undefined, d >= 7 ? GOLD : WHITE); b.userData = { d, x };
      flag(c, 1.3, x, .55, .6); const L = panel(txt(lab, d >= 7 ? '#ffd15a' : '#ffffff'), 1.9, .95, x, 0, -1, undefined, null, 0xd0d0d0); b.userData.label = L; return b; });

    // ---------- E: why now (x=92) ----------
    const P1 = group(88, 0, -1); box(1.8, .4, 1.8, 0, .2, 0, P1, SILVER); S.missile = group(0, 0, 0, P1);
    cyl(.22, 2.2, 0, 1.1, 0, S.missile, RED, 12); const nose = wire(new THREE.ConeGeometry(.22, .6, 12), RED, S.missile); nose.position.y = 2.5;
    for (let k = 0; k < 4; k++) { const fin = box(.04, .5, .4, Math.cos(k * Math.PI / 2) * .26, .3, Math.sin(k * Math.PI / 2) * .26, S.missile, RED); fin.rotation.y = k * Math.PI / 2; }
    S.flame = new THREE.Mesh(new THREE.ConeGeometry(.2, .9, 10), new THREE.MeshBasicMaterial({ color: 0xffa020 })); S.flame.rotation.x = Math.PI; S.flame.position.y = -.4; S.missile.add(S.flame);
    flag('UA', 1.5, 88, 5.4, -2.6);
    const P2 = group(92, 0, -1); box(1.8, 1, 1.8, 0, .5, 0, P2, SILVER); box(1.7, .07, 1.1, 0, 1.04, .1, P2, SILVER);
    S.screen = panel(texture(480, 320, (g, w, h) => { g.fillStyle = '#1a0000'; g.fillRect(0, 0, w, h); g.strokeStyle = '#ff3a2c'; g.lineWidth = 3;
      for (let y = 20; y < h; y += 18) { g.globalAlpha = .25; g.beginPath(); g.moveTo(0, y); g.lineTo(w, y); g.stroke(); } g.globalAlpha = 1;
      g.fillStyle = '#ff3a2c'; g.textAlign = 'center'; g.font = '900 110px IN, sans-serif'; g.fillText('⚠', w / 2, 140); g.font = '900 54px IN, sans-serif'; g.fillText('ACCESS DENIED', w / 2, 240); }),
      1.6, 1.05, 0, 1.62, -.42, P2, RED, 0xffffff); S.screen.rotation.x = -.18;
    const P3 = group(96, 0, -1); S.pylon = group(0, 0, 0, P3);
    const leg = (x0, x1) => { const l = box(.1, 4.6, .1, (x0 + x1) / 2, 2.3, 0, S.pylon, SILVER); l.rotation.z = Math.atan2(x0 - x1, 4.6); };
    leg(-.9, -.25); leg(.9, .25); [1.2, 2.3, 3.4].forEach(y => box(1.6 - y * .28, .08, .08, 0, y, 0, S.pylon, SILVER)); box(2.6, .1, .1, 0, 4.1, 0, S.pylon, SILVER);
    S.wires = tube([[-1.3, 4.05, 0], [-2, 3.4, -.5], [-3.2, 3.9, -1]], 0x999999, .03, S.pylon); S.wires2 = tube([[1.3, 4.05, 0], [2, 3.4, -.5], [3.2, 3.9, -1]], 0x999999, .03, S.pylon);
    S.cloud = group(96, 6.4, -1.6); [[0, 0, .9], [.9, -.1, .7], [-.9, -.15, .7], [.4, .4, .65], [-.4, .35, .6]].forEach(([x, y, r]) => { const s = wire(new THREE.SphereGeometry(r, 10, 7), 0x8fa3b8, S.cloud); s.position.set(x, y, 0); });
    S.bolt = tube([[96.2, 5.6, -1.4], [95.7, 4.9, -1.2], [96.3, 4.4, -1.1], [95.8, 3.6, -1], [96.1, 2.9, -.9]], 0xfff2a0, .07);

    // ---------- F: where "Nov 17" came from (x=115) ----------
    const R = group(111, 0, -4); box(1.3, 3.2, 1, 0, 1.6, 0, R, GOLD); for (let i = 0; i < 6; i++) box(1.1, .05, .05, 0, .5 + i * .45, .52, R, GOLD);
    S.leds = []; for (let i = 0; i < 6; i++) { const m = new THREE.Mesh(new THREE.SphereGeometry(.05, 8, 6), new THREE.MeshBasicMaterial({ color: 0x44ff88 })); m.position.set(111.45, .7 + i * .45, -3.45); K.scene.add(m); S.leds.push(m); }
    const phone = (x, y, z, w, scr) => { const g = group(x, y, z); box(w, w * 2, .12, 0, 0, 0, g, SILVER); panel(scr, w * .88, w * 1.8, 0, 0, .07, g, null, 0xffffff); return g; };
    phone(115, 2.3, -4, 1.0, texture(300, 600, (g, w, h) => { g.fillStyle = '#2a0503'; g.fillRect(0, 0, w, h); g.fillStyle = '#ff3a2c'; g.textAlign = 'center';
      g.font = '900 120px IN, sans-serif'; g.fillText('⚠', w / 2, 230); g.font = '900 44px IN, sans-serif'; g.fillText('EMERGENCY', w / 2, 330); g.fillText('ALERT', w / 2, 385);
      g.font = '600 32px IN, sans-serif'; g.fillStyle = '#ffb3ad'; g.fillText('THIS IS A TEST', w / 2, 460); }));
    panel(txt('72 HRS', '#ffd15a'), 2, 1, 119, 2.4, -4);
    S.viral = phone(115, 3.1, 1.6, 1.25, texture(300, 600, (g, w, h) => { g.fillStyle = '#111'; g.fillRect(0, 0, w, h); g.fillStyle = '#2a2a2a'; g.fillRect(20, 30, w - 40, 70);
      g.fillStyle = '#ff3a2c'; g.textAlign = 'center'; g.font = '900 52px IN, sans-serif'; ['NOV 17', 'GRID', 'SHUTDOWN', '?!'].forEach((s, i) => g.fillText(s, w / 2, 210 + i * 80));
      g.fillStyle = '#888'; g.font = '600 26px IN, sans-serif'; g.fillText('♥ 1.2M   ↻ 400K', w / 2, 560); }));
    S.stitches = [[111, 3.3, -3.5], [115, 3.4, -3.9], [119, 2.9, -3.9]].map(p => tube([p, [(p[0] + 115) / 2, 4.6, -1.2], [115, 3.9, 1.5]], 0xff3a2c, .05));

    // ---------- G: no world grid (x=135) ----------
    S.grids = [[131, -4], [135.5, -7], [139.5, -3.5], [132.5, 0], [138, .8]].map(([x, z], i) => {
      const g = group(x, 0, z); const rg = ring(1.5, x, z); const tops = [];
      for (let k = 0; k < 3; k++) { const a = k / 3 * Math.PI * 2 + i; const px = Math.cos(a) * 1, pz = Math.sin(a) * 1; box(.08, 1.3, .08, px, .65, pz, g, SILVER); tops.push([x + px, 1.3, z + pz]); }
      tube([...tops, tops[0]], 0xffd15a, .03); return { g, rg }; });
    S.master = group(135, 5.2, -2); box(1.6, 2.2, .4, 0, 0, 0, S.master, RED); S.lever = group(0, -.2, .25, S.master); cyl(.06, 1.1, 0, .55, 0, S.lever, RED, 8);
    S.masterX = group(0, 0, .4, S.master); box(2.6, .22, .08, 0, 0, 0, S.masterX, RED).rotation.z = .8; box(2.6, .22, .08, 0, 0, 0, S.masterX, RED).rotation.z = -.8;

    // ---------- H: what goes in your closet (x=155) ----------
    const C = group(155, 0, -1.5); box(4.6, 4.8, 1.4, 0, 2.4, 0, C, SILVER).children[0].visible = false; [1.25, 2.6, 3.95].forEach(y => box(4.4, .1, 1.3, 0, y - .05, 0, C, SILVER));
    const mkRadio = (x, y, z) => { const g = group(x, y, z); box(1, .6, .4, 0, .3, 0, g, GOLD); cyl(.18, .05, -.2, .3, .21, g, GOLD, 14).rotation.x = Math.PI / 2; const a = cyl(.02, .9, .35, 1.0, 0, g, GOLD, 6); a.rotation.z = -.3; return g; };
    const mkTorch = (x, y, z) => { const g = group(x, y, z); const b = cyl(.12, .8, 0, .15, 0, g, GOLD, 12); b.rotation.z = Math.PI / 2; const hd = cyl(.2, .25, .5, .15, 0, g, GOLD, 12); hd.rotation.z = Math.PI / 2;
      const beam = new THREE.Mesh(new THREE.ConeGeometry(.9, 2.6, 24, 1, true), new THREE.MeshBasicMaterial({ color: 0xfff1b0, transparent: true, opacity: .14, side: THREE.DoubleSide, depthWrite: false }));
      beam.rotation.z = Math.PI / 2; beam.position.x = 1.9; beam.position.y = .15; g.add(beam); g.userData.beam = beam; return g; };
    const mkCash = (x, y, z) => { const g = group(x, y, z); for (let k = 0; k < 3; k++) box(.9, .14, .45, k * .08, .07 + k * .15, 0, g, GREEN); return g; };
    const sh = (dx, y) => [155 + dx, y, -1.3];
    S.items = [
      ['water', [mkWater(...sh(-1.6, 1.25)), mkWater(...sh(-1.1, 1.25)), mkWater(...sh(-.6, 1.25))]],
      ['cans', [mkCan(...sh(.4, 1.25)), mkCan(...sh(.9, 1.25)), mkCan(...sh(1.4, 1.25)), mkCan(...sh(.9, 1.6))]],
      ['radio', [mkRadio(...sh(-1.1, 2.6))]],
      ['flash', [mkTorch(...sh(.4, 2.6))]],
      ['cash', [mkCash(...sh(-1.3, 3.95))]],
      ['meds', [mkMeds(...sh(.7, 3.95)), mkMeds(...sh(1.4, 3.95))]],
    ];
    S.items.forEach(([, objs]) => objs.forEach((o, k) => { o.userData.y = o.position.y; o.userData.d = k * .12; }));

    // ---------- I: a date vs a bad week (x=175) ----------
    S.cal2 = group(175, 3.2, 1.2); box(2.6, 3.0, .3, 0, 0, 0, S.cal2, WHITE);
    panel(S.cal.children[1].children[0].material.map, 2.4, 2.76, 0, 0, .16, S.cal2, null, 0x8c8c8c);
    S.cal2X = group(0, 0, .35, S.cal2); box(3.4, .28, .1, 0, 0, 0, S.cal2X, RED).rotation.z = .8; box(3.4, .28, .1, 0, 0, 0, S.cal2X, RED).rotation.z = -.8;
    S.days = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'].map((d, i) => { const p = panel(txt(d, '#ffffff', '#151515'), 1.05, .55, 171.4 + i * 1.2, 1.6, -1, undefined, GOLD, 0x555555); return p; });
  },

  shots: [
    [0,          [-40, 2.2, 6.2],  [-40, 1.4, -6],  2.6],
    ['prep',     [-39.95, 2.2, 3.4], [-39.95, 1.45, -2.0], .9],
    ['real',     [0, 3.4, 18.5],   [0, 2.7, -2.5],  2.6],
    ['not',      [1.3, 3.2, 12.5], [0, 2.8, 2],     1.4],
    ['how',      [11, 6.5, 17],    [20, 3, -3],     1.8],
    ['eu',       [20, 12.5, 13.5], [20, 1.2, -5.5], 1.6],
    ['keep',     [34, 3.6, 13.5],  [34, 3.0, -1],   1.4],
    ['sweden',   [50, 4.6, 15.5],  [50, 2.2, -2],   1.6],
    ['title',    [50.7, 3.3, 8.6], [50, 3.0, 2],    .8],
    ['germany',  [70, 3.9, 15.5],  [70, 2.7, -1],   1.4],
    ['norway',   [70, 3.6, 14.5],  [70, 2.6, -1],   .8],
    ['why',      [92, 4.4, 17.5],  [92, 2.6, -1],   1.4],
    ['war',      [88.7, 3, 10],    [88, 2.4, -1],   .8],
    ['cyber',    [92.4, 2.8, 8.4], [92, 1.7, -1],   .8],
    ['storms',   [96.8, 3.6, 11.5],[96, 3.1, -1],   .8],
    ['where',    [115, 4.4, 17.5], [115, 2.6, -2.5],1.6],
    ['wef',      [111.8, 3, 9.6],  [111, 1.8, -4],  .8],
    ['alert',    [115.5, 3, 9.2],  [115, 2.3, -4],  .8],
    ['advice',   [119.5, 3, 9.2],  [119, 2.4, -4],  .8],
    ['stitch',   [115, 3.8, 13.5], [115, 2.5, -1],  1.4],
    ['nogrid',   [135, 8.5, 14.5], [135, 2.6, -2.2],1.6],
    ['own',      [135, 10.5, 10],  [135, .4, -2.4], 1.0],
    ['closet',   [155, 3.0, 15.5], [155, 2.5, -1.4],1.4],
    ['cash',     [155.4, 3.8, 12.5],[155, 3.0, -1.4],.8],
    ['date',     [175, 3.3, 10.5], [175, 3.0, .8],  .8],
    ['week',     [175, 3.6, 14.5], [175, 2.1, -1],  1.2],
    ['cta',      [175, 4.4, 17.5], [175, 2.8, -1],  1.6],
  ],

  cards: [
    { v: '0 COUNTRIES', cls: 'big', a: [-40, 3.7, -6], t0: 'hook+0.5', t1: 'prep', count: [0, 17, 'hook+0.7', 1.3], fmt: n => Math.round(n) + ' COUNTRIES' },
    { v: 'PREPARING FOR WHAT?', cls: 'red', a: [-39.95, 2.85, -2], t0: 'prep+0.25', t1: 'real' },
    { v: 'NO EVIDENCE', cls: 'red', a: [0, 5.4, 3.2], t0: 'not+1.1', t1: 'how' },
    { l: 'People told to prepare', v: '0', a: [20, 3.4, -1], t0: 'eu+0.6', t1: 'keep', count: [0, 450000000, 'eu+1.0', 2.4], fmt: n => Math.round(n).toLocaleString('en-US') },
    { v: '0 HOURS', cls: 'big', a: [34, 7.9, -2], t0: 'keep', t1: 'sweden', count: [0, 72, 'keep+0.1', 1.6], fmt: n => Math.round(n) + ' HOURS' },
    { v: 'EVERY HOUSEHOLD', cls: 'tag white', a: [50, 3.9, -4], t0: 'sweden+0.9', t1: 'title' },
    { l: 'Sweden', v: 'IF CRISIS OR WAR COMES', cls: 'white', a: [50, 4.9, 2.2], t0: 'title+0.2', t1: 'germany' },
    { v: 'WEF CYBER DRILL', cls: 'tag', a: [111, 4.0, -4], t0: 'wef+0.2', t1: 'alert' },
    { v: 'PHONE ALERT TEST', cls: 'tag', a: [115, 4.4, -4], t0: 'alert+0.2', t1: 'advice' },
    { v: '72-HOUR ADVICE', cls: 'tag', a: [119, 3.6, -4], t0: 'advice+0.2', t1: 'stitch' },
    { v: 'ONE VIRAL POST', cls: 'red', a: [115, 5.2, 1.6], t0: 'stitch+0.6', t1: 'nogrid' },
    { v: 'NO MASTER SWITCH', cls: 'red', a: [135, 7.1, -2], t0: 'nogrid+1.0', t1: 'own' },
    { l: 'Every country', v: 'ITS OWN GRID', a: [135, 4.6, -2], t0: 'own+0.3', t1: 'closet' },
    { v: 'WATER', cls: 'tag white', a: [153.7, 2.25, -.6], t0: 'water', t1: 'radio' },
    { v: 'CANNED FOOD', cls: 'tag white', a: [156.5, 2.25, -.6], t0: 'cans', t1: 'flash' },
    { v: 'RADIO', cls: 'tag white', a: [153.5, 3.65, -.6], t0: 'radio', t1: 'cash' },
    { v: 'FLASHLIGHT', cls: 'tag white', a: [156.4, 3.65, -.6], t0: 'flash', t1: 'meds' },
    { v: 'CASH', cls: 'tag', a: [153.9, 4.95, -.6], t0: 'cash', t1: 'date' },
    { v: 'YOUR MEDS', cls: 'tag white', a: [156.1, 4.95, -.6], t0: 'meds', t1: 'date' },
    { v: 'NOT A DATE', cls: 'red', a: [175, 5.4, 1.2], t0: 'date+0.7', t1: 'week' },
    { v: 'A BAD WEEK', cls: 'big', a: [175, 4.4, -1], t0: 'week+0.9', t1: 'week+2.6' },
  ],

  steps: { title: 'WHY NOW', labels: ['WAR', 'CYBER', 'STORMS'], marks: ['war', 'cyber', 'storms'], from: 'three', to: 'where' },
  receipt: { from: 'week+2.6', to: 'cta+1.4', title: 'WHAT THEY ACTUALLY SAID', rows: [
    ['EU', '72 HOURS'], ['SWEDEN / NORWAY', '~1 WEEK'], ['GERMANY', '10 DAYS'], ['STOCK UP', 'WATER · FOOD · MEDS', 'g'], ['NOV 17 SHUTDOWN', 'NO SOURCE', 'k']] },
  follow: { from: 'cta+1.4', title: "WHAT'S REALLY BEHIND THE HEADLINES" },
  shakes: [[0, 4.6, .035], ['prep', 1.7, .04], ['not+0.6', .5, .12], ['storms+0.7', .8, .15], ['stitch+0.4', .5, .1], ['date+0.5', .4, .1]],
  flashes: [['not+0.6', .35, .22], ['storms+0.7', .3, .3], ['date+0.5', .3, .18]],

  update(t, K) {
    const { at, ease, easeOut, pop, clamp01, setBar, fly, drawTube } = K, S = this.s;
    if (!S.fontsDone && document.fonts && document.fonts.check('900 100px IN')) { S.tex.forEach(f => f()); S.fontsDone = true; }
    // HOOK: shelves empty, lights flicker, stick people panic
    S.slots.forEach((sl, i) => { const on = sl.gone >= 0 && t < sl.gone; const m = new THREE.Matrix4();
      m.compose(new THREE.Vector3(...sl.p), new THREE.Quaternion(), new THREE.Vector3(on ? 1 : .001, on ? 1 : .001, on ? 1 : .001)); S.products.setMatrixAt(i, m); });
    S.products.instanceMatrix.needsUpdate = true;
    S.lights.forEach((l, i) => l.material.color.setHex(i === 1 && Math.sin(t * 23) > .6 ? 0x333333 : 0xeef6ff));
    const C = S.cast, X0 = -40;
    if (t < 7) {
      // cart guy sprints toward camera pushing an overflowing cart
      const cz = -10 + t * 2.0; C.cartGuy.g.position.set(X0 - .4, 0, cz); C.cart.position.set(X0 - .4, 0, cz + 1.0);
      const r = S.run(t, 10); r.aL = [1.25, .1, .25]; r.aR = [1.25, .1, .25]; r.lean = .35; S.pose(C.cartGuy, r);
      // woman stretches for the top shelf, grabs, pulls it down, repeats
      const ph = (t * .9) % 1, up = Math.sin(Math.min(ph, .5) * 2 * Math.PI / 2);
      C.reachGirl.g.rotation.y = -Math.PI / 2; S.pose(C.reachGirl, { bob: 0, lean: .05, aL: [.4, .2, .5], aR: [1.2 + 1.6 * up, .1, .2 - .2 * up], lL: [0, 0], lR: [.1, .1], inward: false });
      const hand = C.reachGirl.hR.clone().applyMatrix4(C.reachGirl.g.matrixWorld.clone().makeRotationY(-Math.PI / 2)).add(C.reachGirl.g.position);
      S.grab.position.copy(hand); S.grab.visible = ph > .35;
      // woman in the middle panics: hands on head, turning side to side
      C.panicGirl.g.rotation.y = Math.sin(t * 2.4) * .9;
      S.pose(C.panicGirl, { bob: .04 * Math.abs(Math.sin(t * 7)), lean: -.1, aL: [2.75, .75, 2.1], aR: [2.75, .75, 2.1], lL: [.15 * Math.sin(t * 7), .1], lR: [-.15 * Math.sin(t * 7), .1], inward: true });
      // tug of war over the last pack of water
      const tug = Math.sin(t * 5) * .18;
      C.tugA.g.rotation.y = Math.PI / 2; C.tugB.g.rotation.y = -Math.PI / 2;
      C.tugA.g.position.x = X0 - .75 + tug; C.tugB.g.position.x = X0 + .85 + tug;
      S.pose(C.tugA, { lean: -.32, aL: [1.5, .05, 0], aR: [1.5, .05, 0], lL: [.35, .2], lR: [-.25, .15] });
      S.pose(C.tugB, { lean: -.32, aL: [1.5, .05, 0], aR: [1.5, .05, 0], lL: [.35, .2], lR: [-.25, .15] });
      S.water.position.set(X0 + .05 + tug, 1.55, -2.0);
      // runners: one crosses the far end of the aisle, one carries boxes away
      C.runner.g.position.set(X0 - 3 + ((t * 2.6) % 7), 0, -12.2); C.runner.g.rotation.y = Math.PI / 2; S.pose(C.runner, S.run(t, 11, 1));
      const r2 = S.run(t, 10, 2); r2.aL = [1.4, .1, .9]; r2.aR = [1.4, .1, .9]; C.runner2.g.rotation.y = Math.PI; C.runner2.g.position.z = -5.5 - t * 1.6; S.pose(C.runner2, r2);
      S.boxes2.forEach((b, i) => { b.position.set(X0 + .6, 1.45 + i * .3, C.runner2.g.position.z - .55); });
    }

    // A: flags rise, calendar slams in and gets crossed out
    S.flags.forEach((f, i) => { const u = pop(clamp01((t - at('real') + 1.0 - f.userData.d * .6) / .5)); f.position.y = -1 + (f.userData.y + 1) * u; f.visible = u > .01;
      f.rotation.x = Math.sin(t * 1.3 + i) * .04; });
    const cu = easeOut(clamp01((t - at('not')) / .45)); S.cal.position.z = 3.2 + (1 - cu) * 9; S.cal.rotation.y = (1 - cu) * .9; S.cal.visible = t >= at('not');
    S.calX.scale.setScalar(pop(clamp01((t - at('not') - .6) / .3)));
    // B: crowd waves in, counter, EU stars spin
    const m = new THREE.Matrix4(), q = new THREE.Quaternion(), e = new THREE.Euler();
    S.crowd.forEach((c, i) => { const u = pop(clamp01((t - at('eu') - .4 - c.d) / .4)); const s = Math.max(.001, u);
      const bob = Math.abs(Math.sin(t * 3 + i)) * .04 * u;
      m.compose(new THREE.Vector3(c.x, .25 * s + bob, c.z), q, new THREE.Vector3(s, s, s)); S.body.setMatrixAt(i, m);
      m.compose(new THREE.Vector3(c.x, (.5 + .13) * s + bob, c.z), q, new THREE.Vector3(s, s, s)); S.head.setMatrixAt(i, m); });
    S.body.instanceMatrix.needsUpdate = true; S.head.instanceMatrix.needsUpdate = true;
    S.euStars.rotation.z = t * .25; S.euStars.scale.setScalar(.3 + .7 * pop(clamp01((t - at('eu') - .2) / .6)));
    // B2: 72h clock — ring draws, hand sweeps three times; supplies drop on the shelf
    drawTube(S.clock, easeOut(clamp01((t - at('keep')) / 1.2)));
    S.hand.rotation.z = -Math.PI * 2 * 3 * easeOut(clamp01((t - at('keep') - .1) / 1.6));
    S.supplies.forEach(g => { const u = clamp01((t - at('keep') - 1.4 - g.userData.d) / .45); g.position.y = .98 + (1 - easeOut(u)) * 5 + (u > 0 && u < 1 ? 0 : 0); g.visible = u > 0; });
    // C: booklets fly into every house; hero booklet turns
    const sky = new THREE.Vector3(50, 7.5, 6);
    S.books.forEach((b, i) => { fly(b, t, at('sweden') + .2 + i * .3, .9, sky, new THREE.Vector3(S.houses[i], .9, -2.9), 1.5); });
    const hb = easeOut(clamp01((t - at('title') + .3) / .8)); S.hero.visible = t > at('title') - .3; S.hero.rotation.y = (1 - hb) * Math.PI + Math.sin(t * .8) * .12; S.hero.scale.setScalar(.4 + .6 * hb);
    // D: day bars (EU first, then Germany, then Norway + Sweden)
    S.dayBars.forEach((b, i) => { const start = i === 0 ? at('germany') - .1 : i === 3 ? at('germany') + .2 : at('norway') + (i - 1) * .25;
      const u = easeOut(clamp01((t - start) / .9)); const h = b.userData.d * .5 * u; setBar(b, h);
      const L = b.userData.label; L.position.y = h + .75; L.visible = u > .4; L.userData.mat.opacity = clamp01((u - .4) / .3); });
    // E: missile rises, screen glitches, storm knocks the pylon over
    const mu = easeOut(clamp01((t - at('war') - .1) / 1.2)); S.missile.position.y = .4 + mu * 1.2; S.flame.scale.y = .6 + .4 * Math.abs(Math.sin(t * 40)); S.flame.visible = mu > 0 && mu < 1;
    const gl = t > at('cyber') ? (Math.sin(t * 37) > .55 ? .35 : 1) : .25; S.screen.userData.mat.opacity = gl; S.screen.position.x = t > at('cyber') && Math.sin(t * 53) > .8 ? .04 : 0;
    const st = at('storms'); drawTube(S.bolt, t > st + .6 && t < st + 1.0 ? 1 : 0);
    const fall = easeOut(clamp01((t - st - .8) / 1)); S.pylon.rotation.z = -fall * 1.25; S.pylon.position.y = 0;
    S.cloud.position.x = 96 + Math.sin(t * .5) * .3;
    // F: rack LEDs blink, three sources get stitched into one viral phone
    S.leds.forEach((l, i) => l.material.color.setHex(Math.sin(t * 6 + i * 1.7) > 0 ? 0x44ff88 : 0x0b2a14));
    S.stitches.forEach((s, i) => drawTube(s, easeOut(clamp01((t - at('stitch') - i * .15) / .8))));
    const vu = pop(clamp01((t - at('stitch') - .5) / .5)); S.viral.scale.setScalar(Math.max(.001, vu)); S.viral.visible = vu > .01; S.viral.rotation.y = Math.sin(t * 1.2) * .15;
    // G: master switch crossed out; each grid lights on its own
    S.masterX.scale.setScalar(pop(clamp01((t - at('nogrid') - .9) / .3)));
    S.master.position.y = 5.2 + (t > at('nogrid') + 1.4 ? -easeOut(clamp01((t - at('nogrid') - 1.4) / 1.2)) * 7 : 0);
    S.lever.rotation.z = Math.sin(t * 2) * .3;
    S.grids.forEach((g, i) => { const p = clamp01((t - at('own') - i * .25) / .5); g.rg.material.color.setHex(p > 0 ? 0xffd15a : 0x3a3020); g.rg.scale.setScalar(1 + .25 * Math.sin(clamp01(p) * Math.PI)); });
    // H: items drop onto the closet shelves on their words
    S.items.forEach(([cue, objs]) => objs.forEach(o => { const u = clamp01((t - at(cue) - o.userData.d) / .4); o.visible = u > 0;
      o.position.y = o.userData.y + (1 - easeOut(u)) * 4 + Math.sin(clamp01((t - at(cue) - o.userData.d - .4) / .25) * Math.PI) * .12;
      if (o.userData.beam) o.userData.beam.material.opacity = .14 * clamp01((t - at(cue) - .5) / .3); }));
    // I: the date gets crossed out and falls; seven days light up one by one
    const c2 = easeOut(clamp01((t - at('date')) / .4)); S.cal2.visible = t >= at('date'); S.cal2.position.z = 1.2 + (1 - c2) * 6;
    S.cal2X.scale.setScalar(pop(clamp01((t - at('date') - .5) / .3)));
    const fallC = easeOut(clamp01((t - at('week') - .1) / .8)); S.cal2.rotation.x = -fallC * .6; S.cal2.position.y = 3.2 - fallC * 7; if (fallC >= 1) S.cal2.visible = false;
    S.days.forEach((d, i) => { const on = t > at('week') + .25 + i * .12; d.userData.mat.color.setHex(on ? 0xffd27a : 0x555555); d.position.y = 1.6 + (on ? .15 * Math.sin(clamp01((t - at('week') - .25 - i * .12) / .3) * Math.PI) : 0); });
  },
};
