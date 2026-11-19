// =====================================================================
//  CHARACTERS — glossy sphere-head cast, built in code (no model files)
//  CHAR.make({outfit:'oxford'|'polo'|'suit'|'hoodie'|'dog'|'cat', glasses, envMap}) -> character  (pets: see PETS below)
//    ch.root            THREE.Group, feet at y=0, faces +z
//    ch.face('smile')   smile | happy | surprised | smirk | blink | worried | flat
//    ch.pose({t, walk, walkAmt, armR:{raise}, armL:{raise}, look, nod, tilt, lean, gesture, gw})
//    gestures: point | wave | shrug | cross | think | facepalm | hips | tada   (gw = blend 0..1)
//  Everything is a pure function of the pose values, so renders stay frame-exact.
// =====================================================================
(function () {
  const C = window.CHAR = {};
  const TAU = Math.PI * 2;

  // ---------- materials ----------
  function weave(scale) { // subtle fabric bump texture
    const c = document.createElement('canvas'); c.width = c.height = 128; const g = c.getContext('2d');
    const id = g.createImageData(128, 128);
    for (let y = 0; y < 128; y++) for (let x = 0; x < 128; x++) {
      const w = ((x >> 1) % 2) ^ ((y >> 1) % 2), v = 128 + (w ? 22 : -22) + ((x * 7919 + y * 104729) % 37) - 18, i = (y * 128 + x) * 4;
      id.data[i] = id.data[i + 1] = id.data[i + 2] = v; id.data[i + 3] = 255;
    }
    g.putImageData(id, 0, 0); const t = new THREE.CanvasTexture(c); t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(scale, scale); return t;
  }
  const WEAVE = { a: null };
  const cloth = (color, rough = .88) => new THREE.MeshStandardMaterial({ color, roughness: rough, metalness: 0, bumpMap: WEAVE.a || (WEAVE.a = weave(6)), bumpScale: .005 });
  const glossy = (color, env, rough = .2) => new THREE.MeshPhysicalMaterial({ color, roughness: rough, metalness: 0, clearcoat: 1, clearcoatRoughness: .05, envMap: env, envMapIntensity: .9 });
  const metal = (color, env) => new THREE.MeshStandardMaterial({ color, roughness: .25, metalness: 1, envMap: env, envMapIntensity: 1.2 });

  // ---------- faces: drawn on an equirect canvas; front of the sphere is u=0.25 ----------
  const FACE_CACHE = {};
  function faceTex(name) {
    if (FACE_CACHE[name]) return FACE_CACHE[name];
    const W = 2048, H = 1024, c = document.createElement('canvas'); c.width = W; c.height = H;
    const g = c.getContext('2d'); g.fillStyle = '#f2f2f4'; g.fillRect(0, 0, W, H);
    const cx = W * .25, cy = H * .5, ex = 118, ey = -10;
    g.strokeStyle = g.fillStyle = '#141414'; g.lineCap = 'round'; g.lineJoin = 'round'; g.lineWidth = 12;
    const dot = (x, y, r = 19) => { g.beginPath(); g.ellipse(x, y, r * .82, r, 0, 0, TAU); g.fill(); };
    const arc = (x, y, r, a0, a1) => { g.beginPath(); g.arc(x, y, r, a0, a1); g.stroke(); };
    const line = (x0, y0, x1, y1) => { g.beginPath(); g.moveTo(x0, y0); g.lineTo(x1, y1); g.stroke(); };
    const brows = (lift = 0) => { for (const s of [-1, 1]) arc(cx + s * ex, cy - 60 - lift, 58, -Math.PI * .8, -Math.PI * .2); };
    const eyes = r => { for (const s of [-1, 1]) dot(cx + s * ex, cy + ey, r); };
    switch (name) {
      case 'happy': brows(14); for (const s of [-1, 1]) arc(cx + s * ex, cy + ey + 16, 34, -Math.PI * .85, -Math.PI * .15);
        g.beginPath(); g.moveTo(cx - 78, cy + 62); g.lineTo(cx + 78, cy + 62); g.quadraticCurveTo(cx + 74, cy + 160, cx, cy + 162); g.quadraticCurveTo(cx - 74, cy + 160, cx - 78, cy + 62); g.closePath(); g.stroke(); break;
      case 'surprised': brows(26); eyes(22); g.beginPath(); g.ellipse(cx, cy + 112, 30, 42, 0, 0, TAU); g.stroke(); break;
      case 'smirk': for (const s of [-1, 1]) line(cx + s * (ex + 62), cy - 92, cx + s * (ex - 40), cy - 56); eyes(19);
        g.beginPath(); g.moveTo(cx - 64, cy + 92); g.quadraticCurveTo(cx + 10, cy + 128, cx + 74, cy + 78); g.stroke(); break;
      case 'worried': for (const s of [-1, 1]) line(cx + s * (ex + 50), cy - 66, cx + s * (ex - 46), cy - 96); eyes(18);
        g.beginPath(); g.moveTo(cx - 50, cy + 110); g.quadraticCurveTo(cx - 20, cy + 92, cx, cy + 108); g.quadraticCurveTo(cx + 22, cy + 124, cx + 50, cy + 104); g.stroke(); break;
      case 'blink': brows(); for (const s of [-1, 1]) line(cx + s * ex - 22, cy + ey, cx + s * ex + 22, cy + ey); arc(cx, cy + 30, 72, Math.PI * .28, Math.PI * .72); break;
      case 'flat': brows(-6); eyes(18); line(cx - 44, cy + 104, cx + 44, cy + 104); break;
      default: /* smile */ brows(); eyes(19); arc(cx, cy + 30, 72, Math.PI * .28, Math.PI * .72);
    }
    const t = new THREE.CanvasTexture(c); t.encoding = THREE.sRGBEncoding; t.anisotropy = 8; FACE_CACHE[name] = t; return t;
  }
  C.faceTex = faceTex;

  // ---------- small geometry helpers ----------
  const mesh = (geo, mat, parent, x = 0, y = 0, z = 0) => { const m = new THREE.Mesh(geo, mat); m.position.set(x, y, z); m.castShadow = true; m.receiveShadow = true; parent.add(m); return m; };
  const grp = (parent, x = 0, y = 0, z = 0) => { const g = new THREE.Group(); g.position.set(x, y, z); parent.add(g); return g; };
  const lathe = (pts, seg = 40) => new THREE.LatheGeometry(pts.map(p => new THREE.Vector2(p[0], p[1])), seg);
  const plate = (pts, depth) => { const s = new THREE.Shape(); s.moveTo(pts[0][0], pts[0][1]); pts.slice(1).forEach(p => s.lineTo(p[0], p[1])); s.closePath(); return new THREE.ExtrudeGeometry(s, { depth, bevelEnabled: true, bevelThickness: depth * .3, bevelSize: depth * .3, bevelSegments: 2 }); };

  const OUTFITS = {
    oxford: { shirt: 0x8fb3e6, pants: 0xc8ac7c, shoes: 0x6b3a1e, belt: 0x5a3418, sleeves: 'long', glasses: true, build: 'slim' },
    polo:   { shirt: 0x5b6b2e, pants: 0xcdb98e, shoes: 0x6e6e72, sleeves: 'short', watch: 0x222222, build: 'slim', sneakers: true },
    hoodie: { shirt: 0xe3a52a, pants: 0x34558f, shoes: 0xf4f4f4, sleeves: 'long', build: 'slim', sneakers: true, hoodie: true },
    suit:   { shirt: 0x1d2550, pants: 0x1d2550, shoes: 0x0e0e10, sleeves: 'long', tie: 0xc0182e, watch: 0xd4a83a, gold: true, build: 'stocky', jacket: true },
  };

  C.make = function (opts = {}) {
    if (PETS[opts.outfit]) return makePet(opts.outfit, opts.envMap);
    const o = Object.assign({}, OUTFITS[opts.outfit || 'oxford'], opts), env = opts.envMap;
    const B = o.build === 'stocky'
      ? { w: .36, d: .29, th: .66, leg: .78, lr: .135, ar: .088, R: .36, hand: .115 }
      : o.hoodie ? { w: .3, d: .22, th: .62, leg: .9, lr: .108, ar: .082, R: .34, hand: .1 }
      : { w: .26, d: .18, th: .62, leg: .9, lr: .1, ar: .068, R: .34, hand: .1 };
    const shirtM = o.hoodie ? Object.assign(cloth(o.shirt, .97), { bumpScale: .009 }) : cloth(o.shirt), pantsM = cloth(o.pants), whiteM = glossy(0xf2f2f4, env, .24), blackM = new THREE.MeshStandardMaterial({ color: 0x151515, roughness: .45 });
    const shoeM = o.sneakers ? cloth(o.shoes, .8) : Object.assign(glossy(o.shoes, env, .5), { envMapIntensity: .3, clearcoat: .5 }), soleM = new THREE.MeshStandardMaterial({ color: o.sneakers ? 0xf0f0f0 : 0x1a120c, roughness: .7 });
    const root = new THREE.Group(), ch = { root, opts: o, B };
    const shoeH = .1, L1 = B.leg * .5, L2 = B.leg * .5, hipY = shoeH + L1 + L2;
    const hips = ch.hips = grp(root, 0, hipY, 0);

    // pelvis / trousers top
    const pelvis = mesh(new THREE.CylinderGeometry(B.w * .94, B.w * .86, .2, 32), pantsM, hips, 0, -.06, 0); pelvis.scale.z = B.d / B.w;
    // belt
    if (o.belt) { const belt = mesh(new THREE.CylinderGeometry(B.w * .96, B.w * .96, .055, 32, 1, true), cloth(o.belt, .5), hips, 0, .045, 0); belt.scale.z = B.d / B.w * 1.02;
      mesh(new THREE.BoxGeometry(.075, .05, .015), metal(0xc9c9c9, env), hips, 0, .045, B.d * .99); }

    // legs
    ch.leg = {};
    for (const s of [-1, 1]) {
      const hip = grp(hips, s * B.w * .48, -.08, 0);
      mesh(new THREE.CylinderGeometry(B.lr, B.lr * .95, L1 + .06, 20), pantsM, hip, 0, -L1 / 2, 0);
      const knee = grp(hip, 0, -L1, 0); mesh(new THREE.SphereGeometry(B.lr * .96, 16, 12), pantsM, knee);
      mesh(new THREE.CylinderGeometry(B.lr * .95, B.lr * 1.02, L2 + .02, 20), pantsM, knee, 0, -L2 / 2, 0);
      const ankle = grp(knee, 0, -L2 + .02, 0);
      const toe = mesh(new THREE.SphereGeometry(1, 24, 12, 0, TAU, 0, Math.PI / 2), shoeM, ankle, 0, -shoeH + .02, .06); toe.scale.set(B.lr * 1.15, .11, .21);
      const sole = mesh(new THREE.BoxGeometry(B.lr * 2.2, .03, .44), soleM, ankle, 0, -shoeH + .02, .06); sole.geometry.translate(0, 0, 0);
      ch.leg[s] = { hip, knee, ankle };
    }

    // spine / torso
    const spine = ch.spine = grp(hips, 0, .02, 0);
    const torsoPts = o.build === 'stocky'
      ? [[0, 0], [B.w * .95, 0], [B.w * 1.04, .14], [B.w * 1.06, .34], [B.w * 1.0, .5], [B.w * .9, .6], [B.w * .5, B.th * .985], [0, B.th]]
      : [[0, 0], [B.w * .9, 0], [B.w * .95, .12], [B.w * 1.0, .34], [B.w * 1.06, .48], [B.w * .98, .56], [B.w * .55, B.th * .985], [0, B.th]];
    const torso = mesh(lathe(torsoPts), shirtM, spine); torso.scale.z = B.d / B.w;
    const chestZ = B.d * 1.02;
    // neck
    const neck = ch.neck = grp(spine, 0, B.th - .02, 0);
    mesh(new THREE.CylinderGeometry(.035, .04, .16, 12), blackM, neck, 0, .06, 0);
    // collar
    if (o.hoodie) {
      const rib = cloth(new THREE.Color(o.shirt).multiplyScalar(.86), .97);
      const hem = mesh(new THREE.CylinderGeometry(B.w * .93, B.w * .92, .07, 32), rib, spine, 0, .02, 0); hem.scale.z = B.d / B.w;
      const hood = mesh(new THREE.TorusGeometry(.13, .07, 12, 24), shirtM, spine, 0, B.th + .01, -.02); hood.rotation.x = Math.PI / 2; hood.scale.set(1.15, 1, 1);
      const back = mesh(new THREE.SphereGeometry(1, 20, 14), shirtM, spine, 0, B.th - .03, -B.d * .75); back.scale.set(.2, .15, .12);
      const pocket = mesh(plate([[-.15, 0], [.15, 0], [.12, .15], [-.12, .15]], .02), rib, spine, 0, .07, B.d * 1.0); pocket.rotation.x = .05;
      const cord = new THREE.MeshStandardMaterial({ color: 0xf2efe6, roughness: .6 }), tip = metal(0xcfcfcf, env);
      for (const s of [-1, 1]) { mesh(new THREE.CylinderGeometry(.008, .008, .17, 6), cord, spine, s * .045, B.th - .13, B.d * .92 + .02);
        mesh(new THREE.CylinderGeometry(.011, .011, .03, 6), tip, spine, s * .045, B.th - .23, B.d * .92 + .02); }
    } else if (o.jacket) {
      const v = mesh(plate([[-.13, 0], [.13, 0], [0, -.26]], .06), cloth(0xf4f4f4, .7), spine, 0, B.th - .04, chestZ * .78); v.rotation.x = -.2;
      const tie = mesh(plate([[-.03, 0], [.03, 0], [.045, -.06], [.02, -.3], [0, -.33], [-.02, -.3], [-.045, -.06]], .012), cloth(o.tie, .55), spine, 0, B.th - .06, chestZ * .78 + .07); tie.rotation.x = -.2;
      for (const s of [-1, 1]) { const lap = mesh(plate([[0, 0], [s * .15, -.02], [s * .02, -.32]], .05), cloth(0x161c40), spine, s * .05, B.th - .05, chestZ * .8); lap.rotation.x = -.2; }
      for (const y of [.18, .08]) mesh(new THREE.CylinderGeometry(.016, .016, .01, 12).rotateX(Math.PI / 2), blackM, spine, 0, y, chestZ * 1.0);
    } else {
      for (const s of [-1, 1]) { const f = mesh(plate([[0, 0], [s * .11, .005], [s * .06, -.09]], .012), shirtM, spine, s * .015, B.th - .03, chestZ * .55); f.rotation.x = -.5; f.rotation.y = s * .25; }
      const btnM = new THREE.MeshStandardMaterial({ color: 0xf0f0f0, roughness: .4 });
      const nB = o.sleeves === 'short' ? 2 : 5;
      for (let i = 0; i < nB; i++) { const y = B.th - .1 - i * .1; mesh(new THREE.CylinderGeometry(.011, .011, .008, 10).rotateX(Math.PI / 2), btnM, spine, 0, y, B.d * (y > .45 ? .98 : 1.0) * 1.03); }
      if (o.sleeves === 'long') { const pk = mesh(new THREE.BoxGeometry(.09, .1, .008), cloth(new THREE.Color(o.shirt).multiplyScalar(.92)), spine, .11, .42, chestZ * .99); pk.rotation.y = .3; }
    }

    // arms
    ch.arm = {};
    const UA = .3, FA = .28;
    for (const s of [-1, 1]) {
      const sh = grp(spine, s * B.w * 1.02, B.th * .84, 0);
      mesh(new THREE.SphereGeometry(B.ar * 1.15, 16, 12), o.sleeves === 'short' ? shirtM : shirtM, sh);
      if (o.sleeves === 'short') { mesh(new THREE.CylinderGeometry(B.ar * 1.3, B.ar * 1.25, .14, 16), shirtM, sh, 0, -.07, 0); mesh(new THREE.CylinderGeometry(B.ar * .62, B.ar * .62, UA, 14), whiteM, sh, 0, -UA / 2, 0); }
      else mesh(new THREE.CylinderGeometry(B.ar, B.ar * .95, UA, 16), shirtM, sh, 0, -UA / 2, 0);
      const el = grp(sh, 0, -UA, 0);
      if (o.sleeves === 'short') { mesh(new THREE.SphereGeometry(B.ar * .62, 12, 10), whiteM, el); mesh(new THREE.CylinderGeometry(B.ar * .6, B.ar * .58, FA, 14), whiteM, el, 0, -FA / 2, 0); }
      else { mesh(new THREE.SphereGeometry(B.ar * .95, 14, 10), shirtM, el); mesh(new THREE.CylinderGeometry(B.ar * .95, B.ar * .9, FA, 16), shirtM, el, 0, -FA / 2, 0);
        mesh(new THREE.CylinderGeometry(B.ar * (o.hoodie ? .85 : .93), B.ar * (o.hoodie ? .85 : .93), o.hoodie ? .07 : .04, 16), o.jacket ? cloth(0xf4f4f4, .7) : o.hoodie ? cloth(new THREE.Color(o.shirt).multiplyScalar(.86), .97) : shirtM, el, 0, -FA + .02, 0); }
      const wr = grp(el, 0, -FA, 0);
      const palm = mesh(new THREE.SphereGeometry(B.hand, 20, 16), whiteM, wr, 0, -B.hand * .85, 0); palm.scale.set(.95, 1, .8);
      const thumb = mesh(new THREE.SphereGeometry(B.hand * .38, 12, 10), whiteM, wr, s * -B.hand * .2, -B.hand * .55, B.hand * .62); thumb.scale.set(1, 1.3, 1);
      mesh(new THREE.TorusGeometry(B.ar * .8, .018, 8, 20).rotateX(Math.PI / 2), whiteM, wr, 0, -.02, 0);
      if (o.watch && s === -1) { mesh(new THREE.TorusGeometry(B.ar * .78, .022, 8, 20).rotateX(Math.PI / 2), o.gold ? metal(o.watch, env) : blackM, wr, 0, .03, 0);
        mesh(new THREE.BoxGeometry(.05, .016, .05), o.gold ? metal(o.watch, env) : blackM, wr, s * B.ar * .78, .03, 0); }
      ch.arm[s] = { sh, el, wr };
    }

    // head
    const head = ch.head = grp(neck, 0, .12 + B.R * .92, 0);
    const headMat = glossy(0xffffff, env, .16); headMat.map = faceTex('smile');
    const ball = mesh(new THREE.SphereGeometry(B.R, 64, 48), headMat, head); ball.castShadow = true;
    ch.headMat = headMat;
    if (o.glasses) {
      const gm = metal(0xa9adb3, env), R = B.R, t = .012;
      for (const s of [-1, 1]) {
        const lens = grp(head, s * R * .34, R * .03, R * .93); lens.rotation.y = s * .36;
        const w = R * .5, h = R * .3;
        mesh(new THREE.BoxGeometry(w, t, t), gm, lens, 0, h / 2, 0); mesh(new THREE.BoxGeometry(w, t, t), gm, lens, 0, -h / 2, 0);
        mesh(new THREE.BoxGeometry(t, h, t), gm, lens, -w / 2, 0, 0); mesh(new THREE.BoxGeometry(t, h, t), gm, lens, w / 2, 0, 0);
        const arm = mesh(new THREE.BoxGeometry(t, t, R * .9), gm, head, s * R * .9, R * .1, R * .1); arm.rotation.y = -s * .25;
      }
      mesh(new THREE.BoxGeometry(R * .14, t, t), gm, head, 0, R * .1, R * .99);
    }

    ch.face = name => { headMat.map = faceTex(name); };
    // Gestures: silent characters act with their hands. pose({gesture:'cross', gw:0..1}) blends one in.
    // Arm "R" = ch.arm[1], arm "L" = ch.arm[-1] (screen right/left when facing camera).
    const G = {
      point:    { 1: [-1.45, 0, .12, -.1, 0] },
      wave:     { 1: [-.15, 0, 2.5, null, 0] },
      shrug:    { 1: [-.3, 0, .35, -1.35, .7], [-1]: [-.3, 0, -.35, -1.35, -.7], up: .05, tilt: .12 },
      cross:    { 1: [-.62, .25, -.18, -1.95, -1.1], [-1]: [-.55, -.25, .18, -1.85, 1.1] },
      think:    { 1: [-.55, .3, -.25, -2.45, -.45], [-1]: [-.4, -.2, .2, -1.55, .95], nod: .1, tilt: -.08 },
      facepalm: { 1: [-.95, .3, -.32, -2.5, -.35], nod: .32 },
      hips:     { 1: [.15, 0, .75, -1.35, -1.25], [-1]: [.15, 0, -.75, -1.35, 1.25] },
      tada:     { 1: [-.7, 0, 1.0, -.25, 0], [-1]: [-.7, 0, -1.0, -.25, 0] },
    };
    ch.gestures = Object.keys(G);
    ch.pose = function (p = {}) {
      const ph = (p.walk || 0) * TAU, a = p.walkAmt || 0, sw = Math.sin(ph), t = p.t || 0;
      const g = G[p.gesture] || null, gw = g ? (p.gw === undefined ? 1 : p.gw) : 0, mix = (x, y) => y === null || y === undefined ? x : x + (y - x) * gw;
      for (const s of [-1, 1]) {
        const L = ch.leg[s], legPh = s === -1 ? sw : -sw;
        L.hip.rotation.x = -legPh * .5 * a;
        const swing = Math.max(0, Math.cos(ph + (s === -1 ? 0 : Math.PI)));
        L.knee.rotation.x = (swing * .85 + .08) * a;
        L.ankle.rotation.x = -(L.hip.rotation.x + L.knee.rotation.x) * .55;
        const A = ch.arm[s], ar = (s === 1 ? p.armR : p.armL) || {}, rz = ar.raise || 0;
        let sx = legPh * .42 * a - rz * .5 + (ar.fwd || 0), sy = 0, sz = s * (.1 + rz * 1.15), ex = -(.22 + .18 * a) - rz * 1.9, ez = -s * rz * .3;
        const tg = g && g[s];
        if (tg) { sx = mix(sx, tg[0]); sy = mix(sy, tg[1]); sz = mix(sz, tg[2]); ex = mix(ex, tg[3] === null ? -.35 - .55 * (.5 + .5 * Math.sin(t * 11)) : tg[3]); ez = mix(ez, tg[4]); }
        A.sh.rotation.set(sx, sy, sz); A.el.rotation.set(ex, 0, ez);
        A.sh.position.y = B.th * .84 + (g && g.up ? g.up * gw : 0);
      }
      hips.position.y = hipY - .02 * a + .035 * a * Math.abs(Math.cos(ph)) + Math.sin(t * 2.1) * .004;
      spine.rotation.y = sw * .07 * a; spine.rotation.x = (p.lean || 0) + .03 * a;
      neck.rotation.y = -sw * .05 * a + (p.look || 0); neck.rotation.x = (p.nod || 0) + (g && g.nod ? g.nod * gw : 0) + Math.sin(t * 2.1 + 1) * .01;
      neck.rotation.z = (p.tilt || 0) + (g && g.tilt ? g.tilt * gw : 0);
    };
    ch.pose({});
    return ch;
  };

  // =====================================================================
  //  PETS — same family look (glossy sphere head, drawn face, matte plush body), on four legs.
  //  CHAR.make({outfit:'dog'|'cat', envMap}) -> pet   (works anywhere a cast member does, e.g. SCENE.cast)
  //    ch.face(name)  smile | happy | surprised | smirk | worried | flat | blink | sleepy
  //    ch.pose({t, walk, walkAmt, look, nod, tilt, sit, lie, wag, ears, gesture, gw})
  //      sit / lie 0..1 · wag 0..1 tail energy · ears -1 (pinned back) .. 1 (perked)
  //      gestures: paw (raise + wave a front paw) | beg (dog: sit up, paws up) | bow (play bow / stretch) | arch (scared cat)
  //  Feet at y=0, faces +z, pure functions of the pose values.
  // =====================================================================
  const PETS = {
    dog: { fur: '#bd7c33', light: '#f5e2bf', dark: '#141414', ear: 0x7a4520, collar: 0xc0182e, tag: 0xd4a83a,
           R: .27, bL: .66, bR: .18, legL: .32, legR: .062, paw: .078, tailN: 5, tailSeg: .075, tailR: .042 },
    cat: { fur: '#727a88', light: '#f4f4f6', dark: '#141414', stripe: '#474d59', inner: 0xf2a2b4, nose: '#ef8aa0', collar: 0x16a596, tag: 0xe0b440,
           R: .22, bL: .52, bR: .13, legL: .21, legR: .043, paw: .056, tailN: 9, tailSeg: .052, tailR: .028 },
  };
  const PET_FACE = {};
  function petFaceTex(kind, name) {
    const key = kind + ':' + name; if (PET_FACE[key]) return PET_FACE[key];
    const P = PETS[kind], dog = kind === 'dog', W = 2048, H = 1024, c = document.createElement('canvas'); c.width = W; c.height = H;
    const g = c.getContext('2d'); g.fillStyle = P.fur; g.fillRect(0, 0, W, H);
    const cx = W * .25, cy = H * .5, ex = dog ? 112 : 104, ey = -18;
    // markings
    g.fillStyle = P.light;
    if (dog) { g.beginPath(); g.ellipse(cx, cy + 96, 150, 104, 0, 0, TAU); g.fill();                      // muzzle
      g.beginPath(); g.ellipse(cx, cy - 120, 46, 120, 0, 0, TAU); g.fill(); }                              // blaze
    else { for (const s of [-1, 1]) { g.beginPath(); g.ellipse(cx + s * 62, cy + 92, 92, 70, 0, 0, TAU); g.fill(); }
      g.beginPath(); g.ellipse(cx, cy + 150, 70, 60, 0, 0, TAU); g.fill();
      g.strokeStyle = P.stripe; g.lineCap = 'round'; g.lineWidth = 22;                                     // tabby forehead "M"
      for (const [x, l] of [[-70, 90], [0, 120], [70, 90]]) { g.beginPath(); g.moveTo(cx + x, cy - 250); g.lineTo(cx + x * .8, cy - 250 + l); g.stroke(); }
      for (const s of [-1, 1]) for (const y of [-40, 20]) { g.beginPath(); g.moveTo(cx + s * 330, cy + y); g.lineTo(cx + s * 250, cy + y + 14); g.stroke(); } }
    g.strokeStyle = g.fillStyle = P.dark; g.lineCap = 'round'; g.lineJoin = 'round'; g.lineWidth = 12;
    const dot = (x, y, r = 21) => { g.fillStyle = P.dark; g.beginPath(); g.ellipse(x, y, r * .84, r, 0, 0, TAU); g.fill();
      g.fillStyle = '#ffffff'; g.beginPath(); g.arc(x + r * .3, y - r * .38, r * .28, 0, TAU); g.fill(); g.fillStyle = P.dark; };
    const arc = (x, y, r, a0, a1) => { g.beginPath(); g.arc(x, y, r, a0, a1); g.stroke(); };
    const line = (x0, y0, x1, y1) => { g.beginPath(); g.moveTo(x0, y0); g.lineTo(x1, y1); g.stroke(); };
    const brows = (lift = 0) => { for (const s of [-1, 1]) arc(cx + s * ex, cy - 62 - lift, 48, -Math.PI * .78, -Math.PI * .22); };
    const eyes = r => { for (const s of [-1, 1]) dot(cx + s * ex, cy + ey, r); };
    const lids = (y) => { g.fillStyle = P.fur; for (const s of [-1, 1]) g.fillRect(cx + s * ex - 32, cy + ey - 40, 64, 40 + y); g.fillStyle = P.dark;
      for (const s of [-1, 1]) line(cx + s * ex - 26, cy + ey + y, cx + s * ex + 26, cy + ey + y); };
    // nose + mouth anchor (dog nose is a 3D bump at about cy+64; cat nose is drawn)
    const my = dog ? cy + 112 : cy + 92;
    if (!dog) { g.fillStyle = P.nose; g.beginPath(); g.moveTo(cx - 30, cy + 50); g.lineTo(cx + 30, cy + 50); g.lineTo(cx, cy + 76); g.closePath(); g.fill(); g.fillStyle = P.dark;
    }
    const wmouth = (open) => { line(cx, my - 26, cx, my); arc(cx - 26, my, 26, 0, Math.PI * .95); arc(cx + 26, my, 26, Math.PI * .05, Math.PI);
      if (open) { g.fillStyle = '#7a2230'; g.beginPath(); g.moveTo(cx - 50, my + 10); g.quadraticCurveTo(cx, my + 110, cx + 50, my + 10); g.closePath(); g.fill();
        g.fillStyle = '#f07a8c'; g.beginPath(); g.ellipse(cx, my + 58, 26, 22, 0, 0, TAU); g.fill(); g.fillStyle = P.dark; } };
    switch (name) {
      case 'happy': brows(16); for (const s of [-1, 1]) arc(cx + s * ex, cy + ey + 14, 30, -Math.PI * .85, -Math.PI * .15); wmouth(true); break;
      case 'surprised': brows(30); eyes(27); g.beginPath(); g.ellipse(cx, my + 30, 22, 30, 0, 0, TAU); g.stroke(); if (dog) line(cx, my - 26, cx, my - 2); break;
      case 'smirk': for (const s of [-1, 1]) line(cx + s * (ex + 54), cy - 96, cx + s * (ex - 34), cy - 62); eyes(20);
        line(cx, my - 26, cx, my - 4); g.beginPath(); g.moveTo(cx - 40, my + 6); g.quadraticCurveTo(cx + 20, my + 34, cx + 64, my - 6); g.stroke(); break;
      case 'worried': for (const s of [-1, 1]) line(cx + s * (ex + 44), cy - 66, cx + s * (ex - 40), cy - 98); eyes(19);
        line(cx, my - 26, cx, my - 4); g.beginPath(); g.moveTo(cx - 44, my + 28); g.quadraticCurveTo(cx - 20, my + 10, cx, my + 24); g.quadraticCurveTo(cx + 22, my + 40, cx + 44, my + 20); g.stroke(); break;
      case 'blink': brows(); for (const s of [-1, 1]) line(cx + s * ex - 22, cy + ey, cx + s * ex + 22, cy + ey); wmouth(false); break;
      case 'flat': for (const s of [-1, 1]) line(cx + s * (ex + 46), cy - 66, cx + s * (ex - 40), cy - 66); eyes(20); lids(-2); line(cx, my - 26, cx, my - 4); line(cx - 36, my + 8, cx + 36, my + 8); break;
      case 'sleepy': brows(-4); eyes(18); lids(6); wmouth(false); break;
      default: /* smile */ brows(); eyes(21); wmouth(false);
    }
    const t = new THREE.CanvasTexture(c); t.encoding = THREE.sRGBEncoding; t.anisotropy = 8; PET_FACE[key] = t; return t;
  }
  C.petFaceTex = petFaceTex;

  function makePet(kind, env) {
    const P = PETS[kind], dog = kind === 'dog', furC = new THREE.Color(P.fur), lightC = new THREE.Color(P.light);
    const furM = Object.assign(cloth(furC.getHex(), .96), { bumpScale: .012 }), lightM = Object.assign(cloth(lightC.getHex(), .96), { bumpScale: .012 });
    const darkFurM = Object.assign(cloth(new THREE.Color(P.stripe || P.fur).getHex(), .96), { bumpScale: .012 });
    const root = new THREE.Group(), ch = { root, kind, opts: { outfit: kind }, B: { R: P.R } };
    const { R, bL, bR, legL, legR, paw } = P, zf = bL * .3, zr = -bL * .3, yb = legL + bR * .78, legX = bR * .58;
    // trunk pivots at the rear leg joint, so sitting = tip the trunk up around the haunches
    const trunk = ch.hips = ch.trunk = grp(root, 0, legL, zr);
    const bodyG = grp(trunk, 0, yb - legL, -zr);
    const body = mesh(new THREE.SphereGeometry(1, 40, 28), furM, bodyG); body.scale.set(bR * 1.05, bR, bL * .52);
    const belly = mesh(new THREE.SphereGeometry(1, 28, 20), lightM, bodyG, 0, -bR * .22, bL * .2); belly.scale.set(bR * .78, bR * .8, bL * .3);
    const chest = mesh(new THREE.SphereGeometry(1, 28, 20), lightM, bodyG, 0, bR * .05, bL * .36); chest.scale.set(bR * .7, bR * .82, bR * .55);
    const hump = mesh(new THREE.SphereGeometry(1, 28, 20), furM, bodyG, 0, bR * .5, -bL * .04); hump.visible = false;
    ch.body = bodyG;
    // legs: [front?, side]
    ch.legs = {};
    const pawM = dog ? furM : lightM;
    for (const [nm, fz, s] of [['FR', 1, 1], ['FL', 1, -1], ['RR', 0, 1], ['RL', 0, -1]]) {
      const j = grp(trunk, s * legX, 0, fz ? zf - zr : 0);
      if (!fz) { const th = mesh(new THREE.SphereGeometry(1, 20, 14), furM, j, s * bR * .12, bR * .38, -bL * .02); th.scale.set(bR * .5, bR * .72, bR * .82); }
      const leg = grp(j);
      if (fz) mesh(new THREE.SphereGeometry(legR * 1.18, 14, 10), furM, leg, 0, .005, 0);
      mesh(new THREE.CylinderGeometry(legR * 1.15, legR, legL - paw * .5 + .02, 14), furM, leg, 0, -(legL - paw * .5) / 2 + .01, 0);
      const pw = mesh(new THREE.SphereGeometry(paw, 18, 12), pawM, leg, 0, -legL + paw * .62, paw * .25); pw.scale.set(1, .72, 1.25);
      ch.legs[nm] = { j, leg };
    }
    ch.leg = { 1: { hip: ch.legs.FR.leg }, [-1]: { hip: ch.legs.FL.leg } };
    // neck + head
    const neck = ch.neck = grp(trunk, 0, yb - legL + bR * .55, zf - zr + bL * .1);
    mesh(new THREE.CylinderGeometry(R * .34, bR * .62, R * .55, 18), furM, neck, 0, R * .18, 0);
    const collar = mesh(new THREE.TorusGeometry(bR * .7, R * .085, 12, 32), cloth(P.collar, .55), neck, 0, -R * .12, bR * .05); collar.rotation.x = Math.PI / 2 + .3;
    const tag = dog ? mesh(new THREE.CylinderGeometry(R * .13, R * .13, .014, 20).rotateX(Math.PI / 2), metal(P.tag, env), neck, 0, -R * .42, bR * .78)
                    : mesh(new THREE.SphereGeometry(R * .13, 16, 12), metal(P.tag, env), neck, 0, -R * .36, bR * .78);
    const head = ch.head = grp(neck, 0, R * .78, R * .32);
    const headMat = Object.assign(glossy(0xffffff, env, .34), { clearcoat: .55 }); headMat.map = petFaceTex(kind, 'smile'); ch.headMat = headMat;
    mesh(new THREE.SphereGeometry(R, 64, 48), headMat, head);
    const onHead = (lon, lat, r = R) => [r * Math.sin(lon) * Math.cos(lat), r * Math.sin(lat), r * Math.cos(lon) * Math.cos(lat)];
    if (dog) { const n = mesh(new THREE.SphereGeometry(R * .14, 20, 14), Object.assign(glossy(0x161616, env, .25), { envMapIntensity: .6 }), head, ...onHead(0, -.2, R * 1.02)); n.scale.set(1.35, .9, .8); }
    else { const wm = new THREE.MeshStandardMaterial({ color: 0x3a3a3a, roughness: .6 });
      for (const s of [-1, 1]) for (const k of [-1, 0, 1]) { const w = grp(head, ...onHead(s * .32, -.2, R * .98));
        const m = mesh(new THREE.CylinderGeometry(.004, .004, R * .75, 5), wm, w, s * R * .37, 0, 0); m.rotation.z = Math.PI / 2 + s * k * .16; w.rotation.y = s * .45; } }
    // ears
    ch.ears = {};
    for (const s of [-1, 1]) {
      const e = grp(head, ...onHead(s * (dog ? .95 : .55), dog ? .62 : .78, R * .96));
      if (dog) { const flap = mesh(new THREE.SphereGeometry(1, 20, 14), cloth(P.ear, .96), e, s * R * .08, -R * .36, 0); flap.scale.set(R * .14, R * .48, R * .3); e.rotation.y = s * .25; }
      else { const outer = mesh(new THREE.ConeGeometry(R * .32, R * .62, 24), furM, e, 0, R * .2, 0); outer.scale.z = .45;
        const inner = mesh(new THREE.ConeGeometry(R * .2, R * .42, 20), cloth(P.inner, .9), e, 0, R * .15, R * .07); inner.scale.z = .3;
        e.rotation.z = -s * .3; e.rotation.y = s * .25; }
      ch.ears[s] = e;
    }
    // tail: a chain of segments
    const tailBase = grp(bodyG, 0, bR * .35, -bL * .48); ch.tail = [];
    let par = tailBase;
    for (let i = 0; i < P.tailN; i++) {
      const sg = grp(par, 0, i ? P.tailSeg : 0, 0), r = P.tailR * (1 - i / P.tailN * (dog ? .55 : .25));
      const m = (!dog && i % 2) ? darkFurM : furM;
      mesh(new THREE.CylinderGeometry(r * .9, r, P.tailSeg * 1.05, 10), m, sg, 0, P.tailSeg / 2, 0); mesh(new THREE.SphereGeometry(r, 10, 8), m, sg);
      if (i === P.tailN - 1) mesh(new THREE.SphereGeometry(r * .9, 10, 8), m, sg, 0, P.tailSeg, 0);
      ch.tail.push(sg); par = sg;
    }
    ch.tailBase = tailBase;

    let faceName = 'smile';
    ch.face = name => { faceName = name; headMat.map = petFaceTex(kind, name); };
    ch.gestures = ['paw', 'beg', 'bow', 'arch'];
    const lerp = (a, b, u) => a + (b - a) * u;
    ch.pose = function (p = {}) {
      const t = p.t || 0, a = p.walkAmt || 0, ph = (p.walk || 0) * TAU, g = p.gesture, gw = g ? (p.gw === undefined ? 1 : p.gw) : 0;
      let sit = p.sit || 0, lie = p.lie || 0;
      if (g === 'beg') sit = Math.max(sit, gw);
      // trunk height + pitch
      const hs = bR * .5, d = legL - hs, aSit = Math.asin(Math.min(.95, d / (zf - zr)));
      let pitch = -aSit * sit, py = legL - d * sit;
      if (g === 'beg') pitch -= .5 * gw;
      if (g === 'bow') { pitch += .42 * gw; py += .02 * gw; }
      const lieY = bR * .95 - (yb - legL); py = lerp(py, lieY, lie); pitch *= (1 - lie);
      py += .022 * a * Math.abs(Math.cos(ph)) - .012 * a + Math.sin(t * 2.1) * .003;
      trunk.position.y = py; trunk.rotation.x = pitch;
      // arched back (cat): taller body, tail straight up
      const arch = g === 'arch' ? gw : 0;
      bodyG.position.y = yb - legL + arch * bR * .35; body.scale.y = bR * (1 + arch * .3); trunk.position.y += arch * legL * .14;
      hump.visible = arch > .01; hump.scale.set(bR * .95, bR * (.25 + .75 * arch), bL * .27);
      // legs
      const swingL = { FR: Math.PI, FL: 0, RR: 0, RL: Math.PI };
      for (const nm of ['FR', 'FL', 'RR', 'RL']) {
        const L = ch.legs[nm].leg, front = nm[0] === 'F';
        let rx = Math.sin(ph + swingL[nm]) * .5 * a;
        if (front) { rx -= pitch; if (lie) rx = lerp(rx, -1.42, lie); }
        else { const sitRx = aSit - Math.acos(Math.min(1, hs / legL)); rx = lerp(rx, sitRx, sit * (1 - lie)); if (lie) rx = lerp(rx, -1.45, lie); }
        let sy = 1;
        if (g === 'beg' && front) { rx = lerp(rx, -pitch - 1.75 + Math.sin(t * 6) * .08, gw); sy = lerp(1, .62, gw); }
        if (g === 'bow' && front) { rx = lerp(rx, -pitch - 1.15, gw); }
        if (g === 'paw' && nm === 'FR') { rx = lerp(rx, -1.25 - pitch + Math.sin(t * 9) * .22, gw); sy = lerp(1, .85, gw); }
        if (lie && !front) sy = lerp(1, dog ? .8 : .55, lie); if (lie && front && !dog) sy = lerp(1, .6, lie);
        L.rotation.x = rx; L.scale.y = sy * (1 + arch * .14);
      }
      // neck / head: stays level when the trunk tips
      neck.rotation.x = -pitch * .85 + (p.nod || 0) + Math.sin(t * 2.1 + 1) * .01 + (lie ? .15 * lie : 0) + (g === 'bow' ? -.25 * gw : 0);
      neck.rotation.y = (p.look || 0) - Math.sin(ph) * .05 * a; neck.rotation.z = p.tilt || 0;
      // ears
      const ea = p.ears === undefined ? ((faceName === 'worried' || faceName === 'flat') ? -.4 : faceName === 'surprised' ? .8 : 0) - arch * 1 : p.ears;
      for (const s of [-1, 1]) { const e = ch.ears[s];
        if (dog) { e.rotation.z = s * (.18 + ea * .35) + Math.sin(t * 9 + s) * .05 * a; e.rotation.x = -ea * .15; }
        else { e.rotation.x = -Math.max(0, -ea) * .55; e.rotation.z = -s * (.3 + Math.max(0, -ea) * .5 - Math.max(0, ea) * .12); } }
      // tail
      const wag = p.wag === undefined ? (dog ? .35 : .2) : p.wag;
      const down = Math.max(sit * (1 - lie), lie);          // 0 standing .. 1 tail resting on the floor
      let tb = dog ? -.75 : -1.25;
      tb = lerp(tb, (sit > lie ? -1.66 - pitch : -1.62), down);
      if (g === 'bow') tb -= .25 * gw;
      tb = lerp(tb, -.12, arch);
      tailBase.rotation.x = tb;
      ch.tail.forEach((sg, i) => {
        if (!i) { sg.rotation.z = dog ? Math.sin(t * 15) * (.15 + .5 * wag) : Math.sin(t * 1.7) * (.1 + .2 * wag); return; }
        const curl = dog ? .14 * (1 - down * .8) : lerp(lerp(.17, .02, down), .0, arch);
        const side = dog ? 0 : down * .2;                    // cats wrap the tail around themselves
        sg.rotation.x = curl; sg.rotation.z = side + (dog ? Math.sin(t * 15 - i * .6) * .12 * (.3 + wag) : Math.sin(t * 1.7 - i * .45) * (.05 + .12 * wag));
      });
    };
    ch.pose({});
    return ch;
  }
})();
