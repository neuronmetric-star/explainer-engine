// =====================================================================
//  CHARACTERS — glossy sphere-head cast, built in code (no model files)
//  CHAR.make({outfit:'oxford'|'polo'|'suit'|'hoodie'|'zuck'|'gates', glasses, envMap}) -> character
//    zuck  = 2004 Zuckerberg look (gray zip hoodie, jeans, slide sandals, short curly hair)
//    gates = 1975 Gates look (big square glasses, sandy mop + bangs, sweater over collared shirt, khakis)
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
    zuck:   { shirt: 0x8b8e94, pants: 0x2c3c5c, shoes: 0x111214, sleeves: 'long', build: 'slim', hoodie: true, zip: true, slides: true, hair: 'curly', hairColor: 0x4a2f1c },
    gates:  { shirt: 0x34466e, collar: 0xd6e4f4, pants: 0xb89c6c, shoes: 0x5a3519, sleeves: 'long', build: 'slim', sweater: true, glasses: 'big', hair: 'mop', hairColor: 0xa47c4c },
  };

  C.make = function (opts = {}) {
    const o = Object.assign({}, OUTFITS[opts.outfit || 'oxford'], opts), env = opts.envMap;
    const B = o.build === 'stocky'
      ? { w: .36, d: .29, th: .66, leg: .78, lr: .135, ar: .088, R: .36, hand: .115 }
      : o.hoodie ? { w: .3, d: .22, th: .62, leg: .9, lr: .108, ar: .082, R: .34, hand: .1 }
      : { w: .26, d: .18, th: .62, leg: .9, lr: .1, ar: .068, R: .34, hand: .1 };
    const shirtM = o.hoodie ? Object.assign(cloth(o.shirt, .97), { bumpScale: .009 }) : cloth(o.shirt), pantsM = cloth(o.pants), whiteM = glossy(0xf2f2f4, env, .24), blackM = new THREE.MeshStandardMaterial({ color: 0x151515, roughness: .45 });
    const shoeM = o.sneakers ? cloth(o.shoes, .8) : Object.assign(glossy(o.shoes, env, .5), { envMapIntensity: .3, clearcoat: .5 }), soleM = new THREE.MeshStandardMaterial({ color: o.sneakers ? 0xf0f0f0 : o.slides ? 0x151515 : 0x1a120c, roughness: .7 });
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
      const toe = mesh(new THREE.SphereGeometry(1, 24, 12, 0, TAU, 0, Math.PI / 2), o.slides ? whiteM : shoeM, ankle, 0, -shoeH + .02, .06); toe.scale.set(B.lr * 1.15, .11, .21);
      const sole = mesh(new THREE.BoxGeometry(B.lr * 2.2, .03, .44), soleM, ankle, 0, -shoeH + .02, .06); sole.geometry.translate(0, 0, 0);
      if (o.slides) { // slide sandal: one wide black strap over the foot, three white stripes
        const strap = mesh(new THREE.SphereGeometry(1, 24, 12, 0, TAU, 0, Math.PI / 2), shoeM, ankle, 0, -shoeH + .02, .1); strap.scale.set(B.lr * 1.24, .125, .12);
        const stripeM = new THREE.MeshStandardMaterial({ color: 0xf4f4f4, roughness: .6 });
        for (const k of [-1, 0, 1]) mesh(new THREE.BoxGeometry(.012, .02, .2), stripeM, ankle, k * .04, -shoeH + .02 + .105, .1); }
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
      if (o.zip) { // zip-up: two pocket halves, a metal zipper and a gray tee peeking at the neck
        for (const sx of [-1, 1]) { const pk = mesh(plate([[0, 0], [sx * .15, 0], [sx * .12, .15], [0, .15]], .02), rib, spine, sx * .012, .07, B.d * 1.0); pk.rotation.x = .05; }
        const zipM = metal(0xb9bcc2, env);
        for (let i = 0; i < 8; i++) { const y = .05 + i * .065; mesh(new THREE.BoxGeometry(.016, .05, .012), zipM, spine, 0, y, B.d * (y > .45 ? .97 : 1.02) + .008); }
        mesh(new THREE.BoxGeometry(.03, .05, .02), zipM, spine, 0, B.th - .14, B.d * .95 + .02);
        const tee = mesh(new THREE.CylinderGeometry(.09, .1, .06, 20), cloth(0x6d7077), spine, 0, B.th - .04, .02); tee.scale.z = .9;
      } else { const pocket = mesh(plate([[-.15, 0], [.15, 0], [.12, .15], [-.12, .15]], .02), rib, spine, 0, .07, B.d * 1.0); pocket.rotation.x = .05; }
      const cord = new THREE.MeshStandardMaterial({ color: 0xf2efe6, roughness: .6 }), tip = metal(0xcfcfcf, env);
      for (const s of [-1, 1]) { mesh(new THREE.CylinderGeometry(.008, .008, .17, 6), cord, spine, s * (o.zip ? .065 : .045), B.th - .13, B.d * .92 + .02);
        mesh(new THREE.CylinderGeometry(.011, .011, .03, 6), tip, spine, s * (o.zip ? .065 : .045), B.th - .23, B.d * .92 + .02); }
    } else if (o.sweater) { // V-neck sweater over a light collared shirt
      const colM = cloth(o.collar, .75);
      const v = mesh(plate([[-.11, 0], [.11, 0], [0, -.22]], .03), colM, spine, 0, B.th - .04, chestZ * .74); v.rotation.x = -.22;
      for (const s of [-1, 1]) { const f = mesh(plate([[0, 0], [s * .12, .005], [s * .065, -.1]], .014), colM, spine, s * .015, B.th - .02, chestZ * .6); f.rotation.x = -.5; f.rotation.y = s * .25; }
      const hem = mesh(new THREE.CylinderGeometry(B.w * .93, B.w * .92, .06, 32), cloth(new THREE.Color(o.shirt).multiplyScalar(.85), .95), spine, 0, .02, 0); hem.scale.z = B.d / B.w;
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
    if (o.hair) { // stylized hair cap that stays above the brows; curly = bumps, mop = bangs + side volume
      const R = B.R, hm = new THREE.MeshPhysicalMaterial({ color: o.hairColor, roughness: .6, clearcoat: .3, clearcoatRoughness: .5, envMap: env, envMapIntensity: .3 });
      const cap = mesh(new THREE.SphereGeometry(R * 1.035, 48, 24, 0, TAU, 0, Math.PI * (o.hair === 'mop' ? .4 : .34)), hm, head); cap.rotation.x = -.42;
      if (o.hair === 'curly') {
        let k = 0; const rnd = () => { k++; const x = Math.sin(k * 12.9898) * 43758.5453; return x - Math.floor(x); };
        for (let i = 0; i < 70; i++) { const th = (.05 + .32 * Math.sqrt(rnd())) * Math.PI, ph = rnd() * TAU;
          const dir = new THREE.Vector3(Math.sin(th) * Math.cos(ph), Math.cos(th), Math.sin(th) * Math.sin(ph)).applyAxisAngle(new THREE.Vector3(1, 0, 0), -.42);
          const b = mesh(new THREE.SphereGeometry(R * (.1 + .05 * rnd()), 10, 8), hm, head); b.position.copy(dir.multiplyScalar(R * 1.03)); }
      } else {
        const bang = mesh(new THREE.SphereGeometry(R * .62, 32, 16, 0, TAU, 0, Math.PI / 2), hm, head, -R * .1, R * .58, R * .5); bang.scale.set(1.25, .42, .62); bang.rotation.set(.75, 0, .18);
        for (const s of [-1, 1]) { const side = mesh(new THREE.SphereGeometry(R * .42, 20, 14), hm, head, s * R * .8, R * .28, -R * .12); side.scale.set(.42, .9, .95); }
      }
    }
    if (o.glasses) {
      const big = o.glasses === 'big', gm = big ? Object.assign(glossy(0x3b2a1c, env, .35), { envMapIntensity: .4 }) : metal(0xa9adb3, env), R = B.R, t = big ? .02 : .012;
      for (const s of [-1, 1]) {
        const lens = grp(head, s * R * (big ? .36 : .34), R * (big ? .0 : .03), R * .93); lens.rotation.y = s * .36;
        const w = R * (big ? .6 : .5), h = R * (big ? .5 : .3);
        mesh(new THREE.BoxGeometry(w, t, t), gm, lens, 0, h / 2, 0); mesh(new THREE.BoxGeometry(w, t, t), gm, lens, 0, -h / 2, 0);
        mesh(new THREE.BoxGeometry(t, h, t), gm, lens, -w / 2, 0, 0); mesh(new THREE.BoxGeometry(t, h, t), gm, lens, w / 2, 0, 0);
        if (big) { const glass = mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshPhysicalMaterial({ color: 0xc8b48a, transparent: true, opacity: .12, roughness: .05, envMap: env }), lens, 0, 0, -.002); glass.castShadow = false; }
        const arm = mesh(new THREE.BoxGeometry(t, t, R * .9), gm, head, s * R * .9, R * .1, R * .1); arm.rotation.y = -s * .25;
      }
      mesh(new THREE.BoxGeometry(R * .14, t, t), gm, head, 0, R * (big ? .12 : .1), R * .99);
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
})();
