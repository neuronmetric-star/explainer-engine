// =====================================================================
//  CAST — the recurring 3D characters, built in code so every video can use them.
//  Glossy ball head + drawn face, black neck stick, clothes, cartoon hands, shoes.
//  Rigged (shoulders/elbows/hips/knees/neck/spine) and posable as a pure function of t.
//
//  In scene.js:
//    const maya = K.char('maya', x, z)          // a preset from CAST below (or pass a spec object)
//    K.pose(maya, K.poses.walk(t))              // also: idle, run, point, pump, panic, shrug, talk, reach, wave, sit
//    K.face(maya, 'surprised')                  // smile | happy | surprised | smug | worried | scream | talk | blink
//    maya.root.position / rotation.y            // place + turn the whole character
// =====================================================================
(function () {
  const K = window.KIT;
  const V = (x, y, z) => new THREE.Vector3(x, y, z);

  // ---------- skin tones for the ball heads (and bare hands/forearms) ----------
  K.SKIN = { porcelain: 0xf4f4f6, light: 0xf1d3bf, tan: 0xd7a37c, brown: 0xa86f48, deep: 0x6b4128, ebony: 0x45291a };

  // ---------- the cast: 5 original designs + a diverse extended cast ----------
  // top: hoodie | sweater | coverall | suit | jacket | cardigan | tee     hair: none | messy | afro | curls | locs | braids | bun | hijab | short
  const CAST = K.CAST = {
    // from the character sheets
    hoodie:  { skin: 'porcelain', top: 'hoodie',   topColor: 0xe3a52b, pants: 0x3c5f9c, shoes: 'sneaker', shoeColor: 0xf2f2f2, hands: 'glove' },
    sam:     { skin: 'porcelain', top: 'sweater',  topColor: 0x2f5f5c, pants: 0xa4502f, shoes: 'sneaker', shoeColor: 0xeee6d6, hands: 'glove', hair: 'messy', hairColor: 0x5b3219 },
    sweater: { skin: 'porcelain', top: 'sweater',  topColor: 0x2f5f5c, pants: 0xa4502f, shoes: 'sneaker', shoeColor: 0xeee6d6, hands: 'glove' },
    worker:  { skin: 'porcelain', top: 'coverall', topColor: 0x8b8e92, pants: 0x8b8e92, shoes: 'boot', shoeColor: 0x1e1e1e, hands: 'blackglove', goggles: true },
    boss:    { skin: 'porcelain', top: 'suit',     topColor: 0x1f2a50, pants: 0x1f2a50, shoes: 'dress', shoeColor: 0x111111, hands: 'glove', tie: 0xc0182f, watch: true, build: 1.25 },
    // extended, diverse cast (same style, different skin tones and hair)
    maya:    { skin: 'deep',  top: 'hoodie',   topColor: 0x7b4fc0, pants: 0x2b2b33, shoes: 'sneaker', shoeColor: 0xf2f2f2, hands: 'skin', hair: 'afro', hairColor: 0x1c120c, gender: 'f' },
    leo:     { skin: 'brown', top: 'jacket',   topColor: 0xe0662a, pants: 0x3c5f9c, shoes: 'sneaker', shoeColor: 0xf2f2f2, hands: 'skin', hair: 'curls', hairColor: 0x1d130d },
    amira:   { skin: 'tan',   top: 'cardigan', topColor: 0x3e8e6a, pants: 0x4a4e5a, shoes: 'sneaker', shoeColor: 0xeee6d6, hands: 'skin', hair: 'hijab', hairColor: 0xd9b27c, gender: 'f' },
    kenji:   { skin: 'light', top: 'tee',      topColor: 0x2b6cb0, pants: 0x2f2f35, shoes: 'sneaker', shoeColor: 0xf2f2f2, hands: 'skin', hair: 'short', hairColor: 0x111111 },
    zara:    { skin: 'ebony', top: 'sweater',  topColor: 0xd6403a, pants: 0x3c5f9c, shoes: 'sneaker', shoeColor: 0xf2f2f2, hands: 'skin', hair: 'braids', hairColor: 0x140c08, gender: 'f' },
    marcus:  { skin: 'deep',  top: 'suit',     topColor: 0x3a3d44, pants: 0x3a3d44, shoes: 'dress', shoeColor: 0x111111, hands: 'skin', tie: 0xe3a52b, watch: true, hair: 'short', hairColor: 0x111111 },
    rosa:    { skin: 'tan',   top: 'cardigan', topColor: 0xb7869f, pants: 0x5b5f6a, shoes: 'sneaker', shoeColor: 0xeee6d6, hands: 'skin', hair: 'bun', hairColor: 0xb9b9b9, gender: 'f' },
    dev:     { skin: 'brown', top: 'coverall', topColor: 0x3d6fa8, pants: 0x3d6fa8, shoes: 'boot', shoeColor: 0x1e1e1e, hands: 'blackglove', goggles: true, hair: 'short', hairColor: 0x111111 },
    nia:     { skin: 'deep',  top: 'tee',      topColor: 0xf0c419, pants: 0x2f2f35, shoes: 'sneaker', shoeColor: 0xf2f2f2, hands: 'skin', hair: 'locs', hairColor: 0x1a110b, gender: 'f' },
  };

  // ---------- materials (cached) ----------
  const mats = {};
  const mat = (c, rough = .8, extra = {}) => { const k = c + ':' + rough + JSON.stringify(extra); if (mats[k]) return mats[k];
    const m = new THREE.MeshStandardMaterial(Object.assign({ color: c, roughness: rough }, extra)); m.color.convertSRGBToLinear(); return (mats[k] = m); };
  K.tmat = (c, rough = .85) => mat(c, rough);   // toy-world material with correct colour
  const gloss = c => mat(c, .18, { metalness: .02 });
  const BLACK = mat(0x111111, .5);
  function mesh(geo, m, parent, x = 0, y = 0, z = 0) { const o = new THREE.Mesh(geo, m); o.position.set(x, y, z); o.castShadow = true; o.receiveShadow = true; parent.add(o); return o; }
  const lathe = (pts, seg = 28) => new THREE.LatheGeometry(pts.map(([r, y]) => new THREE.Vector2(r, y)), seg);
  const cylY = (r0, r1, h, seg = 18) => new THREE.CylinderGeometry(r1, r0, h, seg);   // r0 bottom, r1 top
  const sph = (r, ws = 22, hs = 16) => new THREE.SphereGeometry(r, ws, hs);

  // ---------- faces (canvas textures on a spherical cap) ----------
  const faceCache = {};
  function faceTex(expr) {
    if (faceCache[expr]) return faceCache[expr];
    const c = document.createElement('canvas'); c.width = c.height = 512; const g = c.getContext('2d');
    g.strokeStyle = g.fillStyle = '#111'; g.lineCap = 'round'; g.lineJoin = 'round'; g.lineWidth = 13;
    const eyes = (h = 1) => { [196, 316].forEach(x => { g.beginPath(); g.ellipse(x, 262, 13, 19 * h, 0, 0, Math.PI * 2); g.fill(); }); };
    const brows = (lift = 0, angle = 0) => { [[196, -1], [316, 1]].forEach(([x, s]) => { g.beginPath(); g.ellipse(x, 212 - lift, 38, 16, s * angle, Math.PI * 1.15, Math.PI * 1.85); g.stroke(); }); };
    const arc = (cx, cy, r, a0, a1) => { g.beginPath(); g.arc(cx, cy, r, a0, a1); g.stroke(); };
    switch (expr) {
      case 'happy': [196, 316].forEach(x => arc(x, 278, 26, Math.PI * 1.1, Math.PI * 1.9)); brows(14);
        g.beginPath(); g.moveTo(206, 330); g.quadraticCurveTo(256, 420, 306, 330); g.closePath(); g.stroke(); break;
      case 'surprised': eyes(1.1); brows(26); g.beginPath(); g.ellipse(256, 360, 22, 32, 0, 0, Math.PI * 2); g.stroke(); break;
      case 'scream': eyes(.8); brows(30); g.beginPath(); g.ellipse(256, 368, 30, 46, 0, 0, Math.PI * 2); g.fill(); break;
      case 'smug': eyes(); g.lineWidth = 14; [[196, 1], [316, -1]].forEach(([x, s]) => { g.beginPath(); g.moveTo(x - 36, 214 - s * 14); g.lineTo(x + 36, 214 + s * 14); g.stroke(); });
        g.beginPath(); g.moveTo(222, 352); g.quadraticCurveTo(270, 376, 306, 338); g.stroke(); break;
      case 'worried': eyes(); g.lineWidth = 12; [[196, -1], [316, 1]].forEach(([x, s]) => { g.beginPath(); g.moveTo(x - 34, 210 + s * 12); g.lineTo(x + 34, 210 - s * 12); g.stroke(); });
        g.beginPath(); g.moveTo(222, 362); g.quadraticCurveTo(256, 340, 290, 362); g.stroke(); break;
      case 'talk': eyes(); brows(4); g.beginPath(); g.ellipse(256, 352, 26, 16, 0, 0, Math.PI * 2); g.fill(); break;
      case 'blink': [196, 316].forEach(x => { g.beginPath(); g.moveTo(x - 16, 264); g.lineTo(x + 16, 264); g.stroke(); }); brows(); arc(256, 300, 52, Math.PI * .28, Math.PI * .72); break;
      default: eyes(); brows(); arc(256, 300, 52, Math.PI * .28, Math.PI * .72);   // smile
    }
    const t = new THREE.CanvasTexture(c); t.encoding = THREE.sRGBEncoding; t.anisotropy = 4; return (faceCache[expr] = t);
  }
  const HEAD_R = .44;
  const faceGeo = new THREE.SphereGeometry(HEAD_R * 1.006, 40, 30, Math.PI / 2 - .95, 1.9, Math.PI / 2 - .95, 1.9);

  // ---------- body parts ----------
  function handMesh(parent, kind, skin) {
    const m = kind === 'glove' ? gloss(0xf5f5f5) : kind === 'blackglove' ? mat(0x1b1b1b, .6) : gloss(skin);
    const h = new THREE.Group(); parent.add(h);
    const palm = mesh(sph(.105), m, h, 0, -.1, 0); palm.scale.set(1, 1.15, .72);
    const thumb = mesh(sph(.045), m, h, .07, -.07, .05); thumb.scale.set(1, 1.6, 1);
    if (kind === 'glove') { const cuff = mesh(new THREE.TorusGeometry(.085, .03, 8, 18), m, h, 0, -.005, 0); cuff.rotation.x = Math.PI / 2; }
    return h;
  }
  function shoeMesh(parent, kind, color) {
    const g = new THREE.Group(); parent.add(g); const m = kind === 'dress' ? gloss(color) : mat(color, kind === 'boot' ? .5 : .6);
    if (kind === 'boot') { mesh(cylY(.14, .13, .26), m, g, 0, -.02, .01); const toe = mesh(sph(.15), m, g, 0, -.1, .12); toe.scale.set(1, .62, 1.35);
      mesh(new THREE.BoxGeometry(.3, .06, .48), mat(0x0c0c0c, .7), g, 0, -.17, .07); }
    else { const toe = mesh(sph(.14), m, g, 0, -.1, .1); toe.scale.set(1, .6, 1.6);
      mesh(new THREE.BoxGeometry(.27, .05, .46), mat(kind === 'dress' ? 0x0b0b0b : 0xdcd6c8, .8), g, 0, -.17, .08);
      if (kind === 'sneaker') for (let i = 0; i < 3; i++) mesh(new THREE.BoxGeometry(.12, .015, .02), mat(0xffffff, .6), g, 0, -.03 + i * -.0, .2 - i * .06); }
    return g;
  }
  function hairMesh(head, spec) {
    const style = spec.hair; if (!style || style === 'none') return;
    const hm = mat(spec.hairColor || 0x2a1a10, style === 'hijab' ? .85 : .65), R = HEAD_R;
    const blob = (r, x, y, z, sx = 1, sy = 1, sz = 1) => { const o = mesh(sph(r, 16, 12), hm, head, x, y, z); o.scale.set(sx, sy, sz); return o; };
    if (style === 'messy') { blob(R * 1.02, 0, .06, -.06, 1.02, .78, 1); for (let i = 0; i < 9; i++) { const a = -1.3 + i * .32; blob(.13, Math.sin(a) * .36, .3 + Math.cos(a) * .05, .16 + Math.cos(a) * .12, 1.2, .6, 1.4).rotation.z = a * .5; } }
    else if (style === 'short') { blob(R * 1.025, 0, .07, -.04, 1, .72, 1.02); }
    else if (style === 'afro') { blob(R * 1.4, 0, .3, -.3, 1.08, .95, 1); blob(R * 1.02, 0, .14, -.06, 1.02, .7, 1); }
    else if (style === 'curls') { blob(R * 1.02, 0, .08, -.06, 1.02, .76, 1); for (let i = 0; i < 26; i++) { const a = i * 2.39, r = .18 + (i % 4) * .07; blob(.075, Math.cos(a) * r, .36 + (i % 3) * .03, Math.sin(a) * r - .02); } }
    else if (style === 'locs') { blob(R * 1.03, 0, .07, -.05, 1.02, .76, 1.02); for (let i = 0; i < 14; i++) { const a = Math.PI * .15 + i / 13 * Math.PI * 1.7;
        const l = mesh(new THREE.CylinderGeometry(.035, .03, .62, 8), hm, head, Math.cos(a) * .42, -.2, -Math.abs(Math.sin(a)) * .36 - .02); l.rotation.z = Math.cos(a) * .15; } }
    else if (style === 'braids') { blob(R * 1.03, 0, .07, -.05, 1.02, .76, 1.02); [-1, 1].forEach(s => { for (let k = 0; k < 6; k++) blob(.07, s * .36, -.08 - k * .11, -.18, 1, 1.1, 1); }); }
    else if (style === 'bun') { blob(R * 1.025, 0, .07, -.05, 1, .74, 1.02); blob(.17, 0, .4, -.22); }
    else if (style === 'hijab') { const h = blob(R * 1.12, 0, .02, -.04, 1.04, 1.06, 1.04);
      const drape = mesh(cylY(.36, .26, .42), hm, head, 0, -.46, -.03); drape.scale.z = .85;
      // open the face: a skin-coloured cap sits in front of the scarf
      const fm = gloss(K.SKIN[spec.skin] || spec.skin); mesh(new THREE.SphereGeometry(HEAD_R * 1.002, 30, 22, Math.PI / 2 - .78, 1.56, Math.PI / 2 - .78, 1.56), fm, head);
    }
  }

  // ---------- build one character ----------
  K.char = function (spec, x = 0, z = 0, parent) {
    if (typeof spec === 'string') { if (!CAST[spec]) throw new Error('unknown cast member: ' + spec); spec = Object.assign({ name: spec }, CAST[spec]); }
    const skin = K.SKIN[spec.skin] != null ? K.SKIN[spec.skin] : (spec.skin || 0xf4f4f6), B = spec.build || 1;
    const topM = mat(spec.topColor, spec.top === 'suit' ? .7 : .9), pantM = mat(spec.pants, .85);
    const C = { spec, bones: {} }, b = C.bones;
    const root = C.root = new THREE.Group(); root.position.set(x, 0, z); (parent || K.scene).add(root);
    const LEG = 1.02;
    b.hips = new THREE.Group(); b.hips.position.y = LEG; root.add(b.hips);
    b.spine = new THREE.Group(); b.hips.add(b.spine);
    // torso (lathe profile, flattened front-to-back)
    const tw = (spec.top === 'suit' ? .5 : .43) * B;
    const torso = mesh(lathe([[0, -.05], [tw * .92, -.05], [tw, .1], [tw * 1.04, .45], [tw * .98, .72], [tw * .82, .86], [tw * .38, .95], [0, .97]]), topM, b.spine);
    torso.scale.z = .72;
    // pelvis (pants) fills the hip gap
    const pel = mesh(cylY(.36 * B, .4 * B, .22), pantM, b.hips, 0, -.06, 0); pel.scale.z = .72;
    // clothing details
    const top = spec.top;
    if (top === 'hoodie' || top === 'sweater' || top === 'cardigan' || top === 'tee') {
      const band = mesh(cylY(tw * .95, tw * .95, .1), mat(spec.topColor, .95), b.spine, 0, 0, 0); band.scale.z = .74;
    }
    if (top === 'hoodie') {
      const hood = mesh(new THREE.TorusGeometry(.2, .1, 10, 22), topM, b.spine, 0, .9, -.08); hood.rotation.x = Math.PI / 2 - .5;
      const back = mesh(sph(.23), topM, b.spine, 0, .78, -.24); back.scale.set(1.25, .8, .6);
      const pocket = mesh(new THREE.BoxGeometry(.5, .2, .04), mat(spec.topColor, .95), b.spine, 0, .26, tw * .72); pocket.rotation.x = -.06;
      [-.07, .07].forEach(s => { mesh(new THREE.CylinderGeometry(.01, .01, .3, 6), mat(0xf4f1ea, .7), b.spine, s, .72, tw * .74);
        mesh(new THREE.CylinderGeometry(.016, .016, .05, 6), mat(0xc9c9c9, .3, { metalness: .6 }), b.spine, s, .56, tw * .74); });
    }
    if (top === 'sweater' || top === 'tee') { const nk = mesh(new THREE.TorusGeometry(.16, .035, 8, 20), mat(spec.topColor, .95), b.spine, 0, .93, 0); nk.rotation.x = Math.PI / 2; }
    if (top === 'cardigan') { mesh(new THREE.BoxGeometry(.06, .9, .02), mat(0xf2efe8, .8), b.spine, 0, .45, tw * .73); for (let i = 0; i < 4; i++) mesh(sph(.022, 8, 6), mat(0xe8e2d0, .5), b.spine, .05, .2 + i * .17, tw * .74); }
    if (top === 'jacket') { mesh(new THREE.BoxGeometry(.03, .88, .02), mat(0xcfcfcf, .3, { metalness: .6 }), b.spine, 0, .46, tw * .73);
      const col = mesh(new THREE.TorusGeometry(.18, .06, 8, 20), topM, b.spine, 0, .92, 0); col.rotation.x = Math.PI / 2; }
    if (top === 'coverall') {
      mesh(new THREE.BoxGeometry(.025, .78, .02), mat(0xbfbfbf, .3, { metalness: .7 }), b.spine, 0, .5, tw * .73);
      const belt = mesh(cylY(tw * 1.0, tw * 1.0, .07), mat(0x6f7276, .8), b.spine, 0, .12, 0); belt.scale.z = .74;
      [-1, 1].forEach(s => { mesh(new THREE.BoxGeometry(.16, .14, .03), topM, b.spine, s * .17, .62, tw * .72);
        const c = mesh(new THREE.BoxGeometry(.18, .1, .03), topM, b.spine, s * .1, .93, .14); c.rotation.z = -s * .5; });
    }
    if (top === 'suit') {
      const shirt = mesh(new THREE.ShapeGeometry(new THREE.Shape([V(-.15, .95), V(.15, .95), V(0, .45)].map(v => new THREE.Vector2(v.x, v.y)))), mat(0xf7f7f7, .6), b.spine, 0, 0, tw * .725);
      if (spec.tie) mesh(new THREE.ShapeGeometry(new THREE.Shape([[-.035, .92], [.035, .92], [.06, .55], [0, .46], [-.06, .55]].map(([a, c]) => new THREE.Vector2(a, c)))), mat(spec.tie, .5), b.spine, 0, 0, tw * .73);
      [-1, 1].forEach(s => { const lap = mesh(new THREE.ShapeGeometry(new THREE.Shape([[0, .95], [s * .16, .9], [s * .08, .48]].map(([a, c]) => new THREE.Vector2(a, c)))), mat(spec.topColor, .55), b.spine, 0, 0, tw * .735);
        mesh(new THREE.BoxGeometry(.16, .025, .03), topM, b.spine, s * .24, .3, tw * .7); });
      for (let i = 0; i < 2; i++) mesh(sph(.02, 8, 6), BLACK, b.spine, 0, .38 - i * .13, tw * .73);
    }
    // neck + head
    b.neck = new THREE.Group(); b.neck.position.y = .94; b.spine.add(b.neck);
    mesh(new THREE.CylinderGeometry(.045, .045, .26, 10), BLACK, b.neck, 0, .1, 0);
    b.head = new THREE.Group(); b.head.position.y = .2 + HEAD_R; b.neck.add(b.head);
    mesh(sph(HEAD_R, 40, 30), gloss(skin), b.head);
    C.faceMat = new THREE.MeshBasicMaterial({ map: faceTex('smile'), transparent: true, depthWrite: false, polygonOffset: true, polygonOffsetFactor: -2 });
    const fm = new THREE.Mesh(faceGeo, C.faceMat); b.head.add(fm); C.expr = 'smile';
    hairMesh(b.head, spec);
    if (spec.goggles) { const strap = mesh(new THREE.TorusGeometry(HEAD_R * 1.02, .03, 8, 40), mat(0xc7222a, .5), b.head, 0, .2, 0); strap.rotation.x = Math.PI / 2 - .35;
      [-1, 1].forEach(s => { const fr = mesh(new THREE.BoxGeometry(.24, .13, .07), mat(0xd42a30, .4), b.head, s * .13, .3, .32); fr.rotation.x = -.6;
        const ln = mesh(new THREE.BoxGeometry(.2, .1, .02), new THREE.MeshStandardMaterial({ color: 0xdff2ff, roughness: .05, transparent: true, opacity: .55 }), b.head, s * .13, .31, .36); ln.rotation.x = -.6; }); }
    // arms
    const sleeveR = (top === 'hoodie' ? .13 : top === 'suit' ? .13 : .115) * Math.sqrt(B);
    ['L', 'R'].forEach(sd => { const s = sd === 'L' ? -1 : 1;
      const sh = b['sh' + sd] = new THREE.Group(); sh.position.set(s * (tw + .02), .8, 0); b.spine.add(sh);
      mesh(sph(sleeveR), topM, sh);
      mesh(cylY(sleeveR * .92, sleeveR, .44), topM, sh, 0, -.22, 0);
      const el = b['el' + sd] = new THREE.Group(); el.position.y = -.44; sh.add(el);
      mesh(sph(sleeveR * .92), topM, el);
      const bare = top === 'coverall' || top === 'tee';
      const foreM = bare ? gloss(skin) : topM, fr = bare ? .075 : sleeveR * .88;
      if (top === 'coverall') { const roll = mesh(cylY(sleeveR * 1.05, sleeveR * 1.05, .1), topM, el, 0, -.02, 0); }
      mesh(cylY(fr * .95, fr, .4), foreM, el, 0, -.2, 0);
      if (!bare) mesh(cylY(fr * .9, fr * .9, .06), mat(spec.topColor, .95), el, 0, -.38, 0);
      if (spec.watch && sd === 'L') { const w = mesh(new THREE.TorusGeometry(fr * 1.02, .022, 8, 20), mat(0xd4a83a, .25, { metalness: .9 }), el, 0, -.36, 0); w.rotation.x = Math.PI / 2; }
      const hd = b['hd' + sd] = new THREE.Group(); hd.position.y = -.42; el.add(hd); handMesh(hd, spec.hands || 'glove', skin);
      if (s === -1) hd.scale.x = -1;
    });
    // legs
    ['L', 'R'].forEach(sd => { const s = sd === 'L' ? -1 : 1;
      const hp = b['hp' + sd] = new THREE.Group(); hp.position.set(s * .17 * B, 0, 0); b.hips.add(hp);
      mesh(cylY(.15, .17, .52), pantM, hp, 0, -.26, 0);
      const kn = b['kn' + sd] = new THREE.Group(); kn.position.y = -.52; hp.add(kn); mesh(sph(.15), pantM, kn);
      mesh(cylY(.145, .15, .44), pantM, kn, 0, -.22, 0); mesh(cylY(.15, .15, .06), mat(spec.pants, .95), kn, 0, -.43, 0);
      const an = b['an' + sd] = new THREE.Group(); an.position.y = -.48; kn.add(an); shoeMesh(an, spec.shoes || 'sneaker', spec.shoeColor || 0xf2f2f2);
    });
    if (spec.gender === 'f' && !spec.noSkirt && false) {}
    K.pose(C, K.poses.idle(0));
    return C;
  };

  // ---------- posing ----------
  // pose = { y, lean, twist, nod, turn, tilt, aL:[fwd,out,elbow], aR, lL:[fwd,knee], lR }
  K.pose = function (C, p) {
    const b = C.bones;
    b.hips.position.y = 1.02 + (p.y || 0); b.hips.rotation.y = p.hipTwist || 0;
    b.spine.rotation.set(p.lean || 0, p.twist || 0, p.side || 0);
    b.neck.rotation.set(p.nod || 0, p.turn || 0, p.tilt || 0);
    [['L', -1, p.aL || [0, .08, .15]], ['R', 1, p.aR || [0, .08, .15]]].forEach(([sd, s, [f, o, e]]) => {
      b['sh' + sd].rotation.set(-f, 0, s * o); b['el' + sd].rotation.set(-e, 0, 0); });
    [['L', p.lL || [0, 0]], ['R', p.lR || [0, 0]]].forEach(([sd, [f, k]]) => {
      b['hp' + sd].rotation.set(-f, 0, 0); b['kn' + sd].rotation.set(k, 0, 0); b['an' + sd].rotation.set(f - k, 0, 0); });
  };
  K.face = function (C, expr) { if (C.expr === expr) return; C.faceMat.map = faceTex(expr); C.faceMat.needsUpdate = true; C.expr = expr; };
  // talking face: alternates mouth shapes while t is inside [t0, t1]
  K.talkFace = (C, t, t0, t1, rest = 'smile') => K.face(C, t >= t0 && t < t1 && Math.sin(t * 22) > 0 ? 'talk' : rest);

  // ---------- pose library (all pure functions of t) ----------
  const P = K.poses = {
    idle: (t, o = 0) => ({ y: .01 * Math.sin(t * 2 + o), nod: .03 * Math.sin(t * 1.3 + o), aL: [.02, .1, .18], aR: [.02, .1, .18] }),
    walk: (t, sp = 6, o = 0) => { const f = t * sp + o, s = Math.sin(f);
      return { y: .035 * Math.abs(Math.cos(f)), lean: .05, twist: .06 * s, aL: [-.45 * s, .1, .35], aR: [.45 * s, .1, .35],
        lL: [.42 * s, .15 + .55 * Math.max(0, Math.sin(f + 1.6))], lR: [-.42 * s, .15 + .55 * Math.max(0, Math.sin(f + 1.6 + Math.PI))] }; },
    run: (t, sp = 10, o = 0) => { const f = t * sp + o, s = Math.sin(f);
      return { y: .08 * Math.abs(Math.cos(f)), lean: .22, twist: .1 * s, aL: [-.9 * s, .15, 1.5], aR: [.9 * s, .15, 1.5],
        lL: [.8 * s, .35 + 1.0 * Math.max(0, Math.sin(f + 1.6))], lR: [-.8 * s, .35 + 1.0 * Math.max(0, Math.sin(f + 1.6 + Math.PI))] }; },
    point: (t) => ({ lean: .02, turn: -.15, aR: [1.45, .25, .05], aL: [.1, .12, .3], lL: [.1, .05], lR: [-.12, .05] }),
    pump: (t) => { const k = Math.abs(Math.sin(t * 6)); return { y: .03 * k, aR: [2.7, .25, 1.6 + .3 * k], aL: [.3, .3, 1.3], lL: [.25, .2], lR: [-.25, .1] }; },
    panic: (t) => ({ y: .03 * Math.abs(Math.sin(t * 9)), turn: .35 * Math.sin(t * 3), lean: -.08, aL: [2.75, .55, 2.25], aR: [2.75, .55, 2.25],
      lL: [.12 * Math.sin(t * 9), .1], lR: [-.12 * Math.sin(t * 9), .1] }),
    shrug: (t) => { const k = .5 + .5 * Math.sin(t * 3); return { tilt: .18, aL: [.55, .45 + .1 * k, 1.5], aR: [.55, .45 + .1 * k, 1.5], y: .02 * k }; },
    talk: (t, o = 0) => ({ nod: .06 * Math.sin(t * 7 + o), turn: .08 * Math.sin(t * 1.7 + o), aR: [.55 + .2 * Math.sin(t * 3 + o), .2, 1.3], aL: [.1, .1, .3] }),
    reach: (t, up = 1) => ({ lean: -.05, turn: .2, aR: [1.4 + 1.4 * up, .1, .2], aL: [.2, .15, .4], lR: [.05, 0], lL: [-.05, 0], y: .04 * up }),
    wave: (t) => ({ tilt: .1, aR: [2.4, .55, .5 + .45 * Math.sin(t * 9)], aL: [.05, .1, .2] }),
    sit: (t) => ({ y: -.5, lean: -.05, lL: [1.5, 1.5], lR: [1.5, 1.5], aL: [.6, .15, .8], aR: [.6, .15, .8] }),
  };
})();
