// =====================================================================
//  CHARACTERS v2 — sphere-head cast, built in code (no model files)
//  Look reference: docs/characters/*_ref.png (Brian, Nov 22 2026): matte porcelain heads, big expressive drawn faces
//  with eye highlights, big round white mitt hands (a finger only to point), real clothes (collars, cuffs, pockets, seams, rolled
//  jeans, laced sneakers, dress shoes). Model sheets: node engine/lab/render-lab.js <out> --page cast-sheet.html
//
//  CHAR.make({outfit:'oxford'|'polo'|'suit'|'hoodie'|'president'|'gang'|'isidro', glasses, phone, mask, beanie, shirt, pants, envMap,
//             hat:'hard'|'inspector'|'pilot'|'chef'|'top'|'bucket', hatColor, holdR/holdL:'clipboard'|'drill'|'magnifier'})
//    ch.root            THREE.Group, feet at y=0, faces +z
//    ch.face('smile')   smile | happy | surprised | scream | smirk | blink | worried | flat | chill | zoned | giggle
//    ch.pose({t, walk, walkAmt, armR:{raise}, armL:{raise}, look, nod, tilt, lean, gesture, gw, handR, handL})
//    gestures: point | wave | shrug | cross | think | facepalm | hips | tada | cuffed   (gw = blend 0..1; pose({cuffs:true}) shows handcuffs)
//    hands (round mitts): 'fist' | 'relaxed' | 'open' | 'point' (set by the gesture; override with handR/handL)
//  Everything is a pure function of the pose values, so renders stay frame-exact.
//  Kept for scenes: ch.head, ch.neck, ch.spine, ch.hips, ch.B.R, ch.leg[±1].{hip,knee,ankle}, ch.arm[±1].{sh,el,wr}.
// =====================================================================
(function () {
  const C = window.CHAR = {};
  const TAU = Math.PI * 2;

  // ---------- fabric bump textures (procedural, cached) ----------
  const TEX = {};
  function fabric(kind) {
    if (TEX[kind]) return TEX[kind];
    const N = 256, c = document.createElement('canvas'); c.width = c.height = N; const g = c.getContext('2d'), id = g.createImageData(N, N);
    for (let y = 0; y < N; y++) for (let x = 0; x < N; x++) {
      const n = ((x * 7919 + y * 104729) % 41) - 20; let v = 128;
      if (kind === 'knit') v += 46 * Math.sin(x * TAU / 8) + (Math.sin(y * TAU / 6) * 10);          // vertical ribs
      else if (kind === 'denim') v += ((x + y) % 8 < 4 ? 30 : -30) + (y % 2 ? 6 : -6);             // diagonal twill
      else if (kind === 'fine') v += ((x >> 1) % 2 ^ (y >> 1) % 2) ? 12 : -12;                      // suiting / oxford
      else v += ((x >> 1) % 2 ^ (y >> 1) % 2) ? 22 : -22;                                            // plain weave
      v += n * .6; const i = (y * N + x) * 4; id.data[i] = id.data[i + 1] = id.data[i + 2] = Math.max(0, Math.min(255, v)); id.data[i + 3] = 255;
    }
    g.putImageData(id, 0, 0); const t = new THREE.CanvasTexture(c); t.wrapS = t.wrapT = THREE.RepeatWrapping;
    t.repeat.set(kind === 'knit' ? 10 : 7, kind === 'knit' ? 10 : 7); return (TEX[kind] = t);
  }
  // buffalo-check color map (two colors; where a dark band crosses a light one it's a mix, crossings are darkest)
  function plaid(c1, c2) {
    const key = 'plaid' + c1 + '_' + c2; if (TEX[key]) return TEX[key];
    const N = 128, c = document.createElement('canvas'); c.width = c.height = N; const g = c.getContext('2d');
    const A = new THREE.Color(c1), Bc = new THREE.Color(c2), M = A.clone().lerp(Bc, .5), css = k => '#' + k.getHexString();
    g.fillStyle = css(A); g.fillRect(0, 0, N, N); g.fillStyle = css(M); g.fillRect(N / 2, 0, N / 2, N); g.fillRect(0, N / 2, N, N / 2);
    g.fillStyle = css(Bc); g.fillRect(N / 2, N / 2, N / 2, N / 2);
    g.globalAlpha = .12; g.fillStyle = '#000'; for (let i = 0; i < N; i += 4) { g.fillRect(i, 0, 1, N); g.fillRect(0, i, N, 1); }   // weave lines
    const t = new THREE.CanvasTexture(c); t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(8, 8); t.encoding = THREE.sRGBEncoding;
    return (TEX[key] = t);
  }
  // tie-dye: concentric wavy rings of bright colors (Gary's chill tee, Nov 24 2026)
  function tiedye(cols) {
    const key = 'tiedye' + cols.join('_'); if (TEX[key]) return TEX[key];
    const N = 256, c = document.createElement('canvas'); c.width = c.height = N; const g = c.getContext('2d'), css = k => '#' + new THREE.Color(k).getHexString();
    const img = g.createImageData(N, N), C3 = cols.map(k => new THREE.Color(k));
    for (let y = 0; y < N; y++) for (let x = 0; x < N; x++) { const dx = x - N / 2, dy = y - N / 2, r = Math.hypot(dx, dy) / N, a = Math.atan2(dy, dx);
      const v = (((r * 9 + Math.sin(a * 5 + r * 14) * .35) % C3.length) + C3.length) % C3.length, i0 = Math.floor(v), f = v - i0, A = C3[i0 % C3.length], Bc = C3[(i0 + 1) % C3.length];
      const sm = f < .7 ? 0 : (f - .7) / .3, o = (y * N + x) * 4;
      img.data[o] = (A.r + (Bc.r - A.r) * sm) * 255; img.data[o + 1] = (A.g + (Bc.g - A.g) * sm) * 255; img.data[o + 2] = (A.b + (Bc.b - A.b) * sm) * 255; img.data[o + 3] = 255; }
    g.putImageData(img, 0, 0);
    const t = new THREE.CanvasTexture(c); t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(2, 2); t.encoding = THREE.sRGBEncoding;
    return (TEX[key] = t);
  }
  const cloth = (color, kind = 'weave', rough = .9, bump = .006) => new THREE.MeshStandardMaterial({ color, roughness: rough, metalness: 0, bumpMap: fabric(kind), bumpScale: bump });
  const glossy = (color, env, rough = .2) => new THREE.MeshPhysicalMaterial({ color, roughness: rough, metalness: 0, clearcoat: 1, clearcoatRoughness: .05, envMap: env, envMapIntensity: .9 });
  const porcelain = (env, rough = .4, coat = .35) => new THREE.MeshPhysicalMaterial({ color: 0xf7f2ec, roughness: rough, metalness: 0, clearcoat: coat, clearcoatRoughness: .35, envMap: env, envMapIntensity: .55 });
  const metal = (color, env, rough = .25) => new THREE.MeshStandardMaterial({ color, roughness: rough, metalness: 1, envMap: env, envMapIntensity: 1.2 });
  const plain = (color, rough = .6) => new THREE.MeshStandardMaterial({ color, roughness: rough });
  const shade = (hex, k) => new THREE.Color(hex).multiplyScalar(k).getHex();

  // ---------- faces: drawn on an equirect canvas; front of the sphere is u=0.25 ----------
  // v2: bigger features, oval eyes with a catchlight, thinner arched brows, warm near-black ink (matches the ref sheets).
  const FACE_CACHE = {};
  function faceTex(name, mustache) {
    const key = name + (mustache ? '|m' : '');
    if (FACE_CACHE[key]) return FACE_CACHE[key];
    const W = 2048, H = 1024, c = document.createElement('canvas'); c.width = W; c.height = H;
    const g = c.getContext('2d'); g.fillStyle = '#ffffff'; g.fillRect(0, 0, W, H);
    // eyes ±140 px from the center ≈ 42% of the head width apart (the ref sheets), mouth ≈ a quarter of the head wide
    const cx = W * .25, cy = H * .5, ex = 140, ey = -8, INK = '#1d1612', MOUTH = '#3a1712', TONGUE = '#e8706a';
    g.strokeStyle = g.fillStyle = INK; g.lineCap = 'round'; g.lineJoin = 'round';
    const eye = (x, y, rx = 24, ry = 34) => { g.fillStyle = INK; g.beginPath(); g.ellipse(x, y, rx, ry, 0, 0, TAU); g.fill();
      g.fillStyle = '#ffffff'; g.beginPath(); g.arc(x - rx * .32, y - ry * .45, Math.min(rx, ry) * .17, 0, TAU); g.fill(); g.fillStyle = INK; };
    const eyes = (rx, ry) => { for (const s of [-1, 1]) eye(cx + s * ex, cy + ey, rx, ry); };
    const arc = (x, y, r, a0, a1, w = 11) => { g.lineWidth = w; g.beginPath(); g.arc(x, y, r, a0, a1); g.stroke(); };
    const line = (x0, y0, x1, y1, w = 11) => { g.lineWidth = w; g.beginPath(); g.moveTo(x0, y0); g.lineTo(x1, y1); g.stroke(); };
    const brows = (lift = 0) => { for (const s of [-1, 1]) arc(cx + s * ex, cy - 40 - lift, 52, -Math.PI * .72, -Math.PI * .28, 12); };
    const smile = () => arc(cx, cy - 14, 140, Math.PI * .33, Math.PI * .67, 12);
    switch (name) {
      case 'happy': brows(10); for (const s of [-1, 1]) arc(cx + s * ex, cy + ey + 22, 32, -Math.PI * .88, -Math.PI * .12, 12);
        { const mouth = () => { g.beginPath(); g.moveTo(cx - 96, cy + 70); g.lineTo(cx + 96, cy + 70); g.quadraticCurveTo(cx + 92, cy + 190, cx, cy + 192); g.quadraticCurveTo(cx - 92, cy + 190, cx - 96, cy + 70); g.closePath(); };
          mouth(); g.fillStyle = MOUTH; g.fill(); g.save(); mouth(); g.clip(); g.fillStyle = TONGUE; g.beginPath(); g.ellipse(cx, cy + 196, 64, 46, 0, 0, TAU); g.fill(); g.restore();
          mouth(); g.lineWidth = 11; g.strokeStyle = INK; g.stroke(); }   // stroke the MOUTH outline (was stroking the tongue ellipse -> black ring under the mouth)
        break;
      case 'scream': { brows(34); eyes(28, 44);   // the hook reaction: brows way up, big eyes, a tall open mouth (Nov 24 2026)
        g.fillStyle = MOUTH; g.beginPath(); g.ellipse(cx, cy + 150, 62, 88, 0, 0, TAU); g.fill();
        g.save(); g.beginPath(); g.ellipse(cx, cy + 150, 62, 88, 0, 0, TAU); g.clip(); g.fillStyle = TONGUE; g.beginPath(); g.ellipse(cx, cy + 232, 50, 40, 0, 0, TAU); g.fill(); g.restore();
        g.lineWidth = 11; g.strokeStyle = INK; g.beginPath(); g.ellipse(cx, cy + 150, 62, 88, 0, 0, TAU); g.stroke(); break; }
      case 'surprised': brows(20); eyes(26, 38); g.lineWidth = 11; g.beginPath(); g.ellipse(cx, cy + 124, 20, 27, 0, 0, TAU); g.stroke(); break;   // hollow 'o' like the ref sheets
      case 'smirk': for (const s of [-1, 1]) line(cx + s * (ex + 58), cy - 100, cx + s * (ex - 40), cy - 66, 12); eyes(23, 27);
        g.lineWidth = 12; g.beginPath(); g.moveTo(cx - 86, cy + 98); g.quadraticCurveTo(cx + 10, cy + 140, cx + 96, cy + 80); g.stroke(); break;
      case 'worried': for (const s of [-1, 1]) line(cx + s * (ex + 54), cy - 66, cx + s * (ex - 46), cy - 100, 11); eyes(23, 31);
        g.lineWidth = 11; g.beginPath(); g.moveTo(cx - 60, cy + 124); g.quadraticCurveTo(cx - 28, cy + 102, cx, cy + 118); g.quadraticCurveTo(cx + 28, cy + 134, cx + 60, cy + 112); g.stroke(); break;
      // stoned-chill faces (Nov 24 2026, high-conversation): heavy lids cover the top of each eye; never red eyes
      case 'chill': case 'zoned': case 'giggle': {
        const lid = (x, y, rx, ry, k) => { eye(x, y, rx, ry); g.fillStyle = '#ffffff'; g.fillRect(x - rx - 8, y - ry - 12, rx * 2 + 16, ry * k + 12);
          g.fillStyle = INK; line(x - rx - 14, y - ry + ry * k, x + rx + 14, y - ry + ry * k + 4, 12); };
        if (name === 'giggle') { for (const s of [-1, 1]) arc(cx + s * ex, cy + ey + 26, 30, -Math.PI * .85, -Math.PI * .15, 12); brows(4);
          g.fillStyle = MOUTH; g.beginPath(); g.ellipse(cx, cy + 118, 70, 46, 0, 0, Math.PI); g.fill(); g.lineWidth = 11; g.strokeStyle = INK; g.stroke(); line(cx - 70, cy + 118, cx + 70, cy + 118, 11); break; }
        for (const s of [-1, 1]) lid(cx + s * ex, cy + ey + 6, 25, 32, 1.05);
        for (const s of [-1, 1]) line(cx + s * ex - 40, cy - 64, cx + s * ex + 40, cy - 60 - s * 4, 10);   // relaxed, low brows
        if (name === 'chill') { g.lineWidth = 12; g.beginPath(); g.moveTo(cx - 70, cy + 104); g.quadraticCurveTo(cx + 10, cy + 136, cx + 82, cy + 96); g.stroke(); }
        else { g.fillStyle = MOUTH; g.beginPath(); g.ellipse(cx, cy + 124, 30, 20, 0, 0, TAU); g.fill(); g.lineWidth = 10; g.strokeStyle = INK; g.stroke(); }
        break; }
      case 'blink': brows(); for (const s of [-1, 1]) line(cx + s * ex - 28, cy + ey, cx + s * ex + 28, cy + ey, 12); smile(); break;
      case 'flat': for (const s of [-1, 1]) line(cx + s * ex - 38, cy - 80, cx + s * ex + 38, cy - 80, 10); eyes(23, 30); line(cx - 54, cy + 118, cx + 54, cy + 118, 12); break;
      default: /* smile */ brows(); eyes(); smile();
    }
    if (mustache) { // short neat mustache, sits just above the mouth (higher when the mouth opens wide)
      const my = cy + (name === 'happy' ? 44 : name === 'surprised' ? 70 : 78); g.fillStyle = INK; g.beginPath();
      g.moveTo(cx, my - 26); g.bezierCurveTo(cx + 36, my - 46, cx + 92, my - 34, cx + 104, my + 14); g.bezierCurveTo(cx + 70, my + 14, cx + 34, my + 16, cx, my + 12);
      g.bezierCurveTo(cx - 34, my + 16, cx - 70, my + 14, cx - 104, my + 14); g.bezierCurveTo(cx - 92, my - 34, cx - 36, my - 46, cx, my - 26); g.fill(); }
    const t = new THREE.CanvasTexture(c); t.encoding = THREE.sRGBEncoding; t.anisotropy = 8; FACE_CACHE[key] = t; return t;
  }
  C.faceTex = faceTex;

  // ---------- geometry helpers ----------
  const mesh = (geo, mat, parent, x = 0, y = 0, z = 0) => { const m = new THREE.Mesh(geo, mat); m.position.set(x, y, z); m.castShadow = true; m.receiveShadow = true; parent.add(m); return m; };
  const grp = (parent, x = 0, y = 0, z = 0) => { const g = new THREE.Group(); g.position.set(x, y, z); parent.add(g); return g; };
  const lathe = (pts, seg = 40) => new THREE.LatheGeometry(pts.map(p => new THREE.Vector2(Math.max(p[0], 1e-4), p[1])), seg);
  const plate = (pts, depth, bev = .3) => { const s = new THREE.Shape(); s.moveTo(pts[0][0], pts[0][1]); pts.slice(1).forEach(p => s.lineTo(p[0], p[1])); s.closePath(); return new THREE.ExtrudeGeometry(s, { depth, bevelEnabled: true, bevelThickness: depth * bev, bevelSize: depth * bev, bevelSegments: 2 }); };
  const rrect = (w, h, r) => { const s = new THREE.Shape(), x = -w / 2, y = -h / 2; s.moveTo(x + r, y); s.lineTo(x + w - r, y); s.quadraticCurveTo(x + w, y, x + w, y + r); s.lineTo(x + w, y + h - r); s.quadraticCurveTo(x + w, y + h, x + w - r, y + h); s.lineTo(x + r, y + h); s.quadraticCurveTo(x, y + h, x, y + h - r); s.lineTo(x, y + r); s.quadraticCurveTo(x, y, x + r, y); return s; };
  const slab = (w, h, d, r) => new THREE.ExtrudeGeometry(rrect(w, h, r), { depth: d, bevelEnabled: true, bevelThickness: d * .4, bevelSize: Math.min(r, d) * .6, bevelSegments: 3 });
  // capsule hanging from y=0 down to y=-len (finger segments, toggles)
  const capsule = (r, len, seg = 14) => { const p = [], n = 6; for (let i = 0; i <= n; i++) { const a = -Math.PI / 2 + i / n * Math.PI / 2; p.push([Math.cos(a) * r, -len + r + Math.sin(a) * r]); }
    for (let i = 1; i <= n; i++) { const a = i / n * Math.PI / 2; p.push([Math.cos(a) * r, -r + Math.sin(a) * r]); } return lathe(p, seg); };
  // tube with soft ends from y=0 down to -len, radius r0 at the top, r1 at the bottom (sleeves, trouser legs)
  const tube = (r0, r1, len, hem = true, seg = 24) => lathe(hem ? [[r1 * .82, -len], [r1, -len + .012], [r1, -len + .03], [r0, 0]] : [[r1, -len], [r0, 0]], seg);

  const OUTFITS = {
    oxford: { shirt: 0x7f9fd6, pants: 0xbf9861, shoes: 0x6e3a1c, belt: 0x5a3418, sleeves: 'long', glasses: true, build: 'slim', collar: 'oxford', crease: true },
    polo:   { shirt: 0x5b6b2e, pants: 0xcdb98e, shoes: 0x8a8a90, sleeves: 'short', watch: 0x222222, build: 'slim', sneakers: true, collar: 'polo', belt: 0x3a2a1c, crease: true },
    hoodie: { shirt: 0xd98a14, pants: 0x253a66, shoes: 0xf4f4f2, sleeves: 'long', build: 'hoodie', sneakers: true, hoodie: true, jeans: true, cuffs: true },
    // president: black bomber jacket over a white tee, backwards black cap, blue-white-blue presidential sash
    president: { shirt: 0x222228, pants: 0x2b2e36, shoes: 0x121214, sleeves: 'long', build: 'slim', bomber: true, tee: 0xf4f4f4, cap: 0x1a1a1f, sash: [0x2456c8, 0xf4f4f4], watch: 0x222222, boots: true },
    // gang: dark hoodie, black jeans, beanie, bandana over the lower face (no weapons). Vary with {shirt, mask}.
    gang: { shirt: 0x2f2b2a, pants: 0x1f1f23, shoes: 0x222226, sleeves: 'long', build: 'hoodie', sneakers: true, hoodie: true, jeans: true, stitch: 0x8a7a62, mask: 0xa81c24, beanie: 0x1c1c1f },
    // isidro (Chapo Isidro, real person; ref docs/characters/isidro_ref.png): navy cap worn forward, mustache, red-black buffalo-plaid
    // western shirt (pearl snaps, two flap pockets), dark indigo jeans, big oval silver buckle, brown boots. Never armed. pose({cuffs:true}).
    isidro: { shirt: 0xffffff, plaid: [0xb3262a, 0x1d1718], pants: 0x222c46, shoes: 0x6e3b1c, belt: 0x4e2c15, buckle: 'big', sleeves: 'long', build: 'medium',
              jeans: true, boots: true, capFwd: 0x1d2440, mustache: true, collar: 'western', western: true },
    // chill looks (Nov 24 2026, high-conversation): Doug = his mustard hoodie + slouchy olive beanie + gray sweatpants;
    // Gary = glasses + tie-dye tee + bucket hat + loose sage sweatpants. Use with faces chill | zoned | giggle.
    chilldoug: { shirt: 0xd98a14, pants: 0x8b8d94, shoes: 0xf4f4f2, sleeves: 'long', build: 'hoodie', sneakers: true, hoodie: true, beanie: 0x5d6b3a },
    chillgary: { shirt: 0xffffff, tiedye: [0xe8463c, 0xf5a623, 0xf7e04a, 0x3fb56b, 0x3a7bd5, 0x8e4fc4], pants: 0x9aa58a, shoes: 0xe9e6dc, sleeves: 'short',
                 build: 'slim', crew: true, sneakers: true, glasses: true, hat: 'bucket', hatColor: 0x2f4a3a },
    suit:   { shirt: 0x1e2a55, pants: 0x1e2a55, shoes: 0x0e0e10, sleeves: 'long', tie: 0xc4182e, watch: 0xd4a83a, gold: true, build: 'stocky', jacket: true },
  };

  C.make = function (opts = {}) {
    const o = Object.assign({}, OUTFITS[opts.outfit || 'oxford'], opts), env = opts.envMap;
    const B = o.build === 'stocky' ? { w: .37, d: .29, th: .57, leg: .7, lr: .14, ar: .1, R: .35, hand: .15 }
      : o.build === 'medium' ? { w: .305, d: .225, th: .55, leg: .68, lr: .12, ar: .094, R: .34, hand: .145 }
      : o.build === 'hoodie' ? { w: .315, d: .24, th: .55, leg: .74, lr: .118, ar: .098, R: .34, hand: .145 }
      : { w: .285, d: .2, th: .55, leg: .74, lr: .112, ar: .088, R: .34, hand: .14 };
    const shirtKind = o.hoodie || o.bomber ? 'knit' : o.jacket || o.collar === 'oxford' ? 'fine' : 'weave';
    const shirtM = cloth(o.shirt, shirtKind, o.hoodie ? .97 : .88, o.hoodie ? .008 : .005); if (o.plaid) { shirtM.map = plaid(o.plaid[0], o.plaid[1]); shirtM.color.set(0xffffff); } if (o.tiedye) { shirtM.map = tiedye(o.tiedye); shirtM.color.set(0xffffff); }
    const ribM = cloth(shade(o.shirt, .82), 'knit', .97, .012);
    const pantsM = o.jeans ? cloth(o.pants, 'denim', .9, .009) : cloth(o.pants, o.jacket ? 'fine' : 'weave', .88);
    const skinM = porcelain(env, .5, .12), blackM = plain(0x151515, .45), whiteM = plain(0xf2f0ea, .7);
    const root = new THREE.Group(), ch = { root, opts: o, B };
    const AH = .1, L1 = B.leg * .5, L2 = B.leg * .5, hipY = AH + L1 + L2 + .08;    // ankle AH above the ground at rest
    const hips = ch.hips = grp(root, 0, hipY, 0);

    // ---------- pelvis, belt ----------
    const pelvis = mesh(lathe([[B.w * .8, -.16], [B.w * .92, -.1], [B.w * .95, 0], [B.w * .93, .05], [0, .06]]), pantsM, hips, 0, -.02, 0); pelvis.scale.z = B.d / B.w;
    if (o.belt && !o.jacket && !o.hoodie && !o.bomber) {
      const belt = mesh(new THREE.CylinderGeometry(B.w * .97, B.w * .97, .05, 40, 1, true), cloth(o.belt, 'fine', .45), hips, 0, .035, 0); belt.scale.z = B.d / B.w * 1.03;
      if (o.buckle === 'big') { const bk = mesh(new THREE.CylinderGeometry(.052, .052, .016, 32).rotateX(Math.PI / 2), metal(0xd4d4d8, env, .18), hips, 0, .035, B.d * 1.02); bk.scale.set(1.25, .9, 1);
        const rim = mesh(new THREE.TorusGeometry(.05, .006, 8, 32), metal(0xb0b0b6, env, .3), hips, 0, .035, B.d * 1.02 + .009); rim.scale.set(1.25, .9, 1); }
      else mesh(slab(.07, .05, .012, .008), metal(0xc9c9c9, env), hips, 0, .035, B.d * 1.0); }
    if (o.jeans) for (const s of [-1, 1]) { // back pockets with contrast stitching
      const bp = mesh(slab(.11, .1, .006, .02), cloth(shade(o.pants, .9), 'denim', .9, .009), hips, s * B.w * .42, -.07, -B.d * .96); bp.rotation.y = Math.PI + s * .25; }

    // ---------- legs + shoes ----------
    ch.leg = {};
    const shoeM = o.sneakers ? cloth(o.shoes, 'weave', .7, .004) : Object.assign(glossy(o.shoes, env, .35), { envMapIntensity: .45, clearcoat: .7 });
    const soleM = plain(o.sneakers ? 0xf6f4ee : 0x2a1a10, .7), laceM = plain(o.sneakers ? 0xffffff : 0x1a120c, .6);
    for (const s of [-1, 1]) {
      const hip = grp(hips, s * B.w * .47, -.08, 0);
      mesh(tube(B.lr * 1.04, B.lr, L1 + .05, false), pantsM, hip, 0, .04, 0);
      const knee = grp(hip, 0, -L1, 0); mesh(new THREE.SphereGeometry(B.lr * .99, 18, 12), pantsM, knee);
      mesh(tube(B.lr * .98, B.lr * 1.07, L2 - .01), pantsM, knee, 0, 0, 0);                       // hem flares a touch
      if (o.crease) mesh(new THREE.BoxGeometry(.006, L1 + L2 - .1, .006), cloth(shade(o.pants, .8)), hip, 0, -(L1 + L2) / 2 + .02, B.lr * .99);
      if (o.jeans) { // seam + rolled cuff
        mesh(new THREE.BoxGeometry(.006, L2 - .06, .006), plain(o.stitch || shade(o.pants, 1.5), .8), knee, s * B.lr * 1.02, -L2 / 2, 0);
        if (o.cuffs !== false && o.cuffs) mesh(new THREE.CylinderGeometry(B.lr * 1.14, B.lr * 1.12, .05, 24), cloth(shade(o.pants, 1.25), 'denim', .9, .009), knee, 0, -L2 + .045, 0); }
      const ankle = grp(knee, 0, -L2, 0);
      // shoe: thick rounded sole + domed upper + toe cap + laces (+ heel block for dress shoes)
      const SW = B.lr * (o.sneakers ? 1.05 : .9), SL = o.sneakers ? .19 : .18, ST = o.sneakers ? .05 : .028, Z = .05;
      const shoe = grp(ankle, 0, -AH, Z);
      const sole = mesh(new THREE.CylinderGeometry(1, 1, ST, 36), soleM, shoe, 0, ST / 2, 0); sole.scale.set(SW, 1, SL);
      if (o.sneakers) { const band = mesh(new THREE.CylinderGeometry(1, 1, .008, 36, 1, true), plain(shade(o.shoes === 0xf4f4f2 ? 0xd9d6ce : o.shoes, .75)), shoe, 0, ST * .55, 0); band.scale.set(SW * 1.005, 1, SL * 1.005); }
      const up = mesh(new THREE.SphereGeometry(1, 32, 16, 0, TAU, 0, Math.PI / 2), shoeM, shoe, 0, ST - .004, -.004); up.scale.set(SW * .93, o.boots ? .14 : o.sneakers ? .1 : .085, SL * .94);
      const toe = mesh(new THREE.SphereGeometry(1, 24, 12, 0, TAU, 0, Math.PI / 2), o.sneakers ? soleM : shoeM, shoe, 0, ST - .006, SL * .45); toe.scale.set(SW * .7, .045, SL * .42);
      for (let i = 0; i < 3; i++) { const l = mesh(new THREE.BoxGeometry(SW * .9, .007, .012), laceM, shoe, 0, ST + .06 - i * .012, .015 + i * .035); l.rotation.x = -.5 - i * .15; }
      mesh(new THREE.CylinderGeometry(B.lr * .78, B.lr * .82, .06, 20), shoeM, ankle, 0, -AH + ST + .045, 0);   // collar around the ankle
      ch.leg[s] = { hip, knee, ankle };
    }

    // ---------- torso ----------
    const spine = ch.spine = grp(hips, 0, .02, 0);
    const torsoPts = o.build === 'stocky'
      ? [[B.w * .93, 0], [B.w * 1.02, B.th * .19], [B.w * 1.06, B.th * .47], [B.w * 1.03, B.th * .72], [B.w * .94, B.th * .88], [B.w * .62, B.th * .975], [0, B.th]]
      : [[B.w * .9, 0], [B.w * .94, B.th * .16], [B.w * .99, B.th * .48], [B.w * 1.04, B.th * .74], [B.w * .97, B.th * .89], [B.w * .58, B.th * .975], [0, B.th]];
    const torso = mesh(lathe(torsoPts, 48), shirtM, spine); torso.scale.z = B.d / B.w;
    const chestZ = B.d * 1.02, Fz = y => B.d * (y > B.th * .8 ? .93 : 1.0) * 1.03;   // front surface z at height y (approx.)
    const neck = ch.neck = grp(spine, 0, B.th - .02, 0);   // no neck (Brian, Nov 2026): invisible pivot for look/nod/tilt

    if (o.hoodie) {
      const hem = mesh(new THREE.CylinderGeometry(B.w * .93, B.w * .91, .08, 40), ribM, spine, 0, .03, 0); hem.scale.z = B.d / B.w;
      const hood = mesh(new THREE.TorusGeometry(.15, .075, 14, 32), shirtM, spine, 0, B.th - .005, -.035); hood.rotation.x = Math.PI / 2 - .25; hood.scale.set(1.2, 1, 1);
      const back = mesh(new THREE.SphereGeometry(1, 24, 16), shirtM, spine, 0, B.th - .07, -B.d * .82); back.scale.set(.21, .19, .1);
      const pocket = mesh(plate([[-.17, 0], [.17, 0], [.13, .16], [-.13, .16]], .022, .4), shirtM, spine, 0, .07, B.d * .99); pocket.scale.z = 1;
      for (const s of [-1, 1]) mesh(new THREE.BoxGeometry(.008, .14, .006), ribM, spine, s * .15, .15, B.d * 1.06).rotation.z = s * -.24;
      const cord = plain(0xf2efe6, .6), tip = metal(0xcfcfcf, env);
      for (const s of [-1, 1]) { mesh(new THREE.CylinderGeometry(.009, .009, .22, 8), cord, spine, s * .05, B.th - .17, B.d * .95);
        mesh(new THREE.CylinderGeometry(.012, .012, .035, 8), tip, spine, s * .05, B.th - .29, B.d * .95); }
    } else if (o.jacket) {
      const skirt = mesh(new THREE.CylinderGeometry(B.w * 1.0, B.w * 1.05, .24, 40, 1, true), Object.assign(shirtM.clone(), { side: THREE.DoubleSide }), spine, 0, -.1, 0); skirt.scale.z = B.d / B.w * 1.03;
      const v = mesh(plate([[-.13, 0], [.13, 0], [0, -.27]], .05), cloth(0xf6f6f6, 'fine', .7), spine, 0, B.th - .03, chestZ * .76); v.rotation.x = -.2;
      const knot = mesh(new THREE.SphereGeometry(.03, 12, 10), cloth(o.tie, 'fine', .5), spine, 0, B.th - .06, chestZ * .78 + .085); knot.scale.set(1.2, 1, .7);
      const tie = mesh(plate([[-.03, 0], [.03, 0], [.05, -.07], [.025, -.3], [0, -.335], [-.025, -.3], [-.05, -.07]], .012), cloth(o.tie, 'fine', .5), spine, 0, B.th - .075, chestZ * .78 + .07); tie.rotation.x = -.2;
      const lapM = cloth(shade(o.shirt, .78), 'fine', .75);
      for (const s of [-1, 1]) { const lap = mesh(plate([[0, 0], [s * .16, -.02], [s * .11, -.08], [s * .03, -.34]], .03), lapM, spine, s * .045, B.th - .04, chestZ * .78); lap.rotation.x = -.18;
        mesh(slab(.11, .025, .012, .006), lapM, spine, s * B.w * .55, -.02, B.d * 1.06).rotation.y = s * .35; }      // pocket flaps
      for (const y of [B.th * .4, B.th * .24, B.th * .08]) mesh(new THREE.CylinderGeometry(.017, .017, .012, 14).rotateX(Math.PI / 2), blackM, spine, .018, y, Fz(y) + .01);
      const col = mesh(new THREE.TorusGeometry(.11, .022, 10, 28, Math.PI * 1.3), cloth(0xf6f6f6, 'fine', .7), spine, 0, B.th - .02, .02); col.rotation.set(Math.PI / 2, 0, Math.PI * .85);
    } else if (o.bomber) {
      const tee = mesh(plate([[-.07, 0], [.07, 0], [.05, -.34], [-.05, -.34]], .006), cloth(o.tee, 'knit', .9), spine, 0, B.th - .04, chestZ * .84); tee.rotation.x = -.14;
      const col = mesh(new THREE.TorusGeometry(.12, .034, 12, 28), ribM, spine, 0, B.th - .01, -.01); col.rotation.x = Math.PI / 2; col.scale.set(1.22, 1, 1);
      const hem = mesh(new THREE.CylinderGeometry(B.w * .92, B.w * .9, .07, 40), ribM, spine, 0, .03, 0); hem.scale.z = B.d / B.w;
      for (const s of [-1, 1]) mesh(new THREE.BoxGeometry(.014, .38, .014), metal(0xb8b8b8, env), spine, s * .085, B.th - .25, chestZ * .94);
      mesh(new THREE.BoxGeometry(.03, .05, .012), metal(0xb8b8b8, env), spine, .085, B.th - .1, chestZ * .96);       // zipper pull
    } else if (o.crew) {   // plain crew-neck tee (Gary's tie-dye): ribbed neck, no collar, no buttons
      const col = mesh(new THREE.TorusGeometry(.112, .022, 10, 28), o.tiedye ? cloth(0xf2efe6, 'knit', .95) : ribM, spine, 0, B.th - .012, -.005); col.rotation.x = Math.PI / 2; col.scale.set(1.15, 1, 1);
    } else {
      const darker = cloth(shade(o.shirt, .9), shirtKind, .88); if (o.plaid) { darker.map = shirtM.map; darker.color.set(0xd6d6d6); }
      // collar: band around the neck + two pointed wings
      const band = mesh(new THREE.TorusGeometry(.115, .026, 10, 28), shirtM, spine, 0, B.th - .015, -.005); band.rotation.x = Math.PI / 2; band.scale.set(1.15, 1, 1);
      for (const s of [-1, 1]) { const f = mesh(plate([[0, 0], [s * .135, .02], [s * .085, -.125]], .016), shirtM, spine, s * .01, B.th + .005, chestZ * .6); f.rotation.x = -.5; f.rotation.y = s * .32; }
      const nB = o.collar === 'polo' ? 2 : 6, step = o.collar === 'polo' ? .065 : .085;
      mesh(new THREE.BoxGeometry(.045, nB * step + .03, .008), darker, spine, 0, B.th - .08 - (nB - 1) * step / 2, Fz(.4) + .004);   // placket
      for (let i = 0; i < nB; i++) { const y = B.th - .09 - i * step; mesh(new THREE.CylinderGeometry(.011, .011, .008, 12).rotateX(Math.PI / 2), whiteM, spine, 0, y, Fz(y) + .01); }
      if (o.collar === 'oxford') { const pk = mesh(slab(.085, .095, .006, .008), darker, spine, .115, B.th * .66, chestZ * .97); pk.rotation.y = .28; }
      if (o.western) for (const sx of [-1, 1]) {   // two chest pockets with pointed flaps + a pearl snap each
        const pk = mesh(slab(.09, .1, .006, .01), shirtM, spine, sx * .12, B.th * .62, chestZ * .965); pk.rotation.y = sx * .3;
        const fl = mesh(plate([[-.05, 0], [.05, 0], [.05, -.025], [0, -.05], [-.05, -.025]], .008), darker, spine, sx * .12, B.th * .73, chestZ * .985); fl.rotation.y = sx * .3;
        mesh(new THREE.SphereGeometry(.011, 10, 8), whiteM, spine, sx * .12, B.th * .69, chestZ * 1.01 + .006); }
      if (o.shirtHem !== false && o.collar === 'polo') { const hem = mesh(new THREE.CylinderGeometry(B.w * .92, B.w * .92, .03, 40, 1, true), darker, spine, 0, .015, 0); hem.scale.z = B.d / B.w * 1.02; }
    }

    // ---------- arms + glove hands ----------
    ch.arm = {}; ch.hand = {};
    const UA = .29, FA = .27;
    for (const s of [-1, 1]) {
      const sh = grp(spine, s * B.w * .95, B.th * .83, 0);
      mesh(new THREE.SphereGeometry(B.ar * 1.04, 18, 14), shirtM, sh);
      if (o.sleeves === 'short') {
        mesh(tube(B.ar * 1.3, B.ar * 1.32, .15, false), shirtM, sh, 0, 0, 0); mesh(new THREE.CylinderGeometry(B.ar * 1.33, B.ar * 1.33, .03, 18), ribM, sh, 0, -.14, 0);
        mesh(tube(B.ar * .62, B.ar * .6, UA, false), skinM, sh, 0, 0, 0);
      } else mesh(tube(B.ar * 1.02, B.ar * .98, UA + .02, false), shirtM, sh, 0, .01, 0);
      const el = grp(sh, 0, -UA, 0);
      if (o.sleeves === 'short') { mesh(new THREE.SphereGeometry(B.ar * .62, 12, 10), skinM, el); mesh(tube(B.ar * .6, B.ar * .56, FA, false), skinM, el); }
      else { mesh(new THREE.SphereGeometry(B.ar * .98, 16, 12), shirtM, el); mesh(tube(B.ar * .98, B.ar * .95, FA - .02, false), shirtM, el);
        const cuffM = o.jacket ? cloth(0xf6f6f6, 'fine', .7) : (o.hoodie || o.bomber) ? ribM : o.plaid ? shirtM : cloth(shade(o.shirt, .93), shirtKind, .88);
        mesh(new THREE.CylinderGeometry(B.ar * (o.hoodie || o.bomber ? .86 : 1.0), B.ar * (o.hoodie || o.bomber ? .84 : 1.0), o.hoodie || o.bomber ? .07 : .05, 20), cuffM, el, 0, -FA + .03, 0);
        if (o.collar === 'oxford') mesh(new THREE.CylinderGeometry(.01, .01, .008, 10).rotateZ(Math.PI / 2), whiteM, el, s * B.ar * 1.0, -FA + .03, 0); }
      const wr = grp(el, 0, -FA, 0);
      // glove (Brian, Nov 22 2026: "first image is how we need our hands"): one big, smooth, round white mitt + a thumb bump,
      // like the v1 cast, bigger. A single index finger slides out only for 'point'.
      const hand = grp(wr, 0, -.005, 0), k = B.hand / .118; hand.scale.setScalar(k);
      const mitt = mesh(new THREE.SphereGeometry(1, 32, 24), skinM, hand, 0, -.092, 0); mitt.scale.set(.088, .1, .08);
      mesh(new THREE.CylinderGeometry(.055, .06, .03, 24), skinM, hand, 0, -.008, 0).scale.z = 1.15;      // glove cuff
      const th = grp(hand, -s * .03, -.07, .06), thumb = mesh(new THREE.SphereGeometry(.04, 20, 16), skinM, th); thumb.scale.set(1, 1.35, 1);
      const idx = grp(hand, -s * .004, -.15, .045); mesh(capsule(.03, .085), skinM, idx); idx.visible = false;
      ch.hand[s] = { mitt, th, idx, s };
      if (o.watch && s === -1) { mesh(new THREE.TorusGeometry(B.ar * .8, .02, 8, 24).rotateX(Math.PI / 2), o.gold ? metal(o.watch, env) : blackM, wr, 0, .035, 0);
        mesh(new THREE.CylinderGeometry(.03, .03, .014, 16).rotateZ(Math.PI / 2), o.gold ? metal(o.watch, env) : blackM, wr, s * B.ar * .82, .035, 0); }
      ch.arm[s] = { sh, el, wr };
    }
    // hand shapes on the mitt: fist (rounder, thumb tucked) | relaxed | open (thumb out) | point (index finger out)
    const HANDS = { fist: [.9, 1, 0], relaxed: [1, .4, 0], open: [1.06, -.4, 0], point: [.92, 1, 1] };   // [mitt length, thumb tuck, finger]
    function setHand(s, a, b, w) { const H = ch.hand[s], A = HANDS[a] || HANDS.relaxed, Bh = HANDS[b] || A, m = i => A[i] + (Bh[i] - A[i]) * w;
      H.mitt.scale.y = .1 * m(0); H.th.rotation.set(-.35 - m(1) * .2, 0, -s * (.25 + m(1) * .35));
      const f = m(2); H.idx.visible = f > .02; H.idx.scale.set(1, Math.max(.02, f), 1); }

    // ---------- head ----------
    const head = ch.head = grp(neck, 0, B.R * .9 - .01, 0);
    const headMat = porcelain(env, .4, .35); headMat.map = faceTex('smile');
    mesh(new THREE.SphereGeometry(B.R, 72, 54), headMat, head);
    ch.headMat = headMat;
    if (o.glasses) {
      const gm = metal(0xb0b4ba, env, .3), R = B.R;
      const frame = (() => { const s = rrect(R * .54, R * .38, R * .09), h = new THREE.Path(), w = R * .54 - .03, hh = R * .38 - .03, r = R * .07, x = -w / 2, y = -hh / 2;
        h.moveTo(x + r, y); h.lineTo(x + w - r, y); h.quadraticCurveTo(x + w, y, x + w, y + r); h.lineTo(x + w, y + hh - r); h.quadraticCurveTo(x + w, y + hh, x + w - r, y + hh); h.lineTo(x + r, y + hh); h.quadraticCurveTo(x, y + hh, x, y + hh - r); h.lineTo(x, y + r); h.quadraticCurveTo(x, y, x + r, y);
        s.holes.push(h); return new THREE.ExtrudeGeometry(s, { depth: .012, bevelEnabled: false }); })();
      const EA = .43;   // eye angle (matches ex = 140 px on the face texture)
      for (const s of [-1, 1]) {
        const lens = grp(head, s * R * Math.sin(EA) * 1.03, -R * .02, R * Math.cos(EA) * 1.03); lens.rotation.y = s * EA; mesh(frame, gm, lens, 0, 0, -.006);
        const p0 = new THREE.Vector3(s * R * .74, R * .02, R * .7), p1 = new THREE.Vector3(s * R * .985, R * .02, -R * .05), mid = p0.clone().add(p1).multiplyScalar(.5);
        const arm = mesh(new THREE.BoxGeometry(.012, .012, p0.distanceTo(p1)), gm, head, mid.x, mid.y, mid.z); arm.rotation.set(0, Math.atan2(p1.x - p0.x, p1.z - p0.z), 0);
      }
      mesh(new THREE.BoxGeometry(R * .2, .012, .012), gm, head, 0, R * .0, R * 1.0);
    }
    if (o.sash) { // diagonal blue-white-blue band, shoulder to hip
      const sg = grp(spine, 0, B.th * .53, 0); sg.rotation.z = -.55; sg.scale.z = B.d / B.w;
      [[o.sash[0], .044], [o.sash[1], 0], [o.sash[0], -.044]].forEach(([c, y]) => { const m = cloth(c, 'fine', .6); m.side = THREE.DoubleSide;
        mesh(new THREE.CylinderGeometry(B.w * 1.15, B.w * 1.15, .045, 56, 1, true), m, sg, 0, y, 0); });
    }
    if (o.cap) { // baseball cap worn backwards: crown with panel seams + button, brim over the back of the head
      const R = B.R, cm = cloth(o.cap, 'weave', .8); cm.side = THREE.DoubleSide;
      mesh(new THREE.SphereGeometry(R * 1.04, 48, 18, 0, TAU, 0, Math.PI * .32), cm, head);
      const brim = mesh(new THREE.CylinderGeometry(R * .64, R * .64, .028, 32, 1, false, Math.PI / 2, Math.PI), cm, head, 0, R * .52, -R * .72); brim.rotation.x = .3;
      mesh(new THREE.SphereGeometry(R * .075, 12, 8), cm, head, 0, R * 1.035, 0);
      mesh(new THREE.TorusGeometry(R * .12, .012, 6, 16, Math.PI), plain(shade(o.cap, .6)), head, 0, R * .66, -R * .76).rotation.x = .9;  // strap gap
    }
    if (o.capFwd) { // baseball cap worn forward: crown hugging the head down to just above the brows, curved brim, button, strap gap at the back
      const R = B.R, cm = cloth(o.capFwd, 'weave', .8); cm.side = THREE.DoubleSide;
      const crown = mesh(new THREE.SphereGeometry(R * 1.02, 48, 20, 0, TAU, 0, Math.PI * .4), cm, head, 0, -R * .02, 0); crown.scale.set(1, 1.08, 1);
      const band = mesh(new THREE.CylinderGeometry(R * .975, R * .975, R * .06, 48, 1, true), plain(shade(o.capFwd, .75), .8), head, 0, R * .33, 0);
      const brim = mesh(new THREE.CylinderGeometry(R * .72, R * .72, .028, 36, 1, false, -Math.PI / 2, Math.PI), cm, head, 0, R * .32, R * .56); brim.rotation.x = .1;
      mesh(new THREE.SphereGeometry(R * .07, 12, 8), cm, head, 0, R * 1.1, 0);
      mesh(new THREE.TorusGeometry(R * .12, .012, 6, 16, Math.PI), plain(shade(o.capFwd, .6)), head, 0, R * .42, -R * .93).rotation.x = -.5;
    }
    if (o.mask) { // bandana over nose and mouth (eyes stay visible), triangle point + knot at the back
      const mm = cloth(o.mask, 'weave', .85); mm.side = THREE.DoubleSide; const R = B.R;
      mesh(new THREE.SphereGeometry(R * 1.03, 56, 18, 0, TAU, Math.PI * .575, Math.PI * .25), mm, head);               // wraps all the way round
      const flap = mesh(plate([[-R * .62, 0], [R * .62, 0], [0, -R * .55]], .01), mm, head, 0, -R * .6, R * .8); flap.rotation.x = -.42;   // triangle over the chest
      mesh(new THREE.SphereGeometry(R * .1, 12, 10), mm, head, 0, -R * .45, -R * .92);                                  // knot
    }
    if (o.beanie) { const bm = cloth(o.beanie, 'knit', .97, .012); bm.side = THREE.DoubleSide; const R = B.R;
      mesh(new THREE.SphereGeometry(R * 1.045, 48, 18, 0, TAU, 0, Math.PI * .34), bm, head);
      mesh(new THREE.CylinderGeometry(R * .88, R * .985, R * .24, 48, 1, true), bm, head, 0, R * .43, 0);       // folded cuff, down to the brows
      mesh(new THREE.SphereGeometry(R * .1, 10, 8), bm, head, 0, R * 1.04, 0); }
    if (o.phone) { // phone held in the right hand, screen toward the face
      const ph = mesh(new THREE.BoxGeometry(.075, .15, .012), blackM, ch.arm[1].wr, 0, -B.hand * 1.1, B.hand * .75); ph.rotation.x = -.5;
      mesh(new THREE.PlaneGeometry(.065, .135), new THREE.MeshStandardMaterial({ color: 0x9fd0ff, emissive: 0x5aa0ff, emissiveIntensity: .8 }), ph, 0, 0, -.007).rotation.y = Math.PI;
    }
    // ---------- role hats (Nov 23 2026): CHAR.make({hat:'hard'|'inspector'|'pilot'|'chef'|'top', hatColor}) ----------
    // Sit above the brows; same matte/glossy materials as the rest of the cast so the look stays consistent.
    if (o.hat) { const R = B.R, k = o.hat; ch.hat = grp(head);
      if (k === 'hard') {             // construction hard hat: glossy dome, brim all round (longer in front), ridge front to back
        const hm = new THREE.MeshStandardMaterial({ color: o.hatColor || 0xf2b705, roughness: .38, metalness: 0, envMap: env, envMapIntensity: .35 }); hm.side = THREE.DoubleSide;
        const dome = mesh(new THREE.SphereGeometry(R * 1.08, 48, 20, 0, TAU, 0, Math.PI * .36), hm, ch.hat, 0, R * .02, 0); dome.scale.y = 1.06;
        const brim = mesh(new THREE.CylinderGeometry(R * 1.2, R * 1.22, .024, 56), hm, ch.hat, 0, R * .47, R * .1); brim.scale.z = 1.1;
        const rg = new THREE.TorusGeometry(R * 1.1, R * .055, 10, 40, Math.PI * .6); rg.rotateZ(Math.PI * .2); rg.rotateY(Math.PI / 2);
        mesh(rg, hm, ch.hat, 0, R * .03, 0);
      } else if (k === 'inspector' || k === 'pilot') {   // peaked cap: stiff crown wider at the top, dark band, shiny black visor, gold badge
        const top = o.hatColor || (k === 'pilot' ? 0xf4f2ec : 0x2b3a67);
        mesh(new THREE.CylinderGeometry(R * 1.12, R * .97, R * .4, 56), cloth(top, 'fine', .8), ch.hat, 0, R * .74, 0);
        mesh(new THREE.CylinderGeometry(R * .985, R * .985, R * .17, 56, 1, true), plain(0x16161a, .6), ch.hat, 0, R * .58, 0);
        const visor = mesh(new THREE.CylinderGeometry(R * .66, R * .66, .024, 36, 1, false, -Math.PI / 2, Math.PI), glossy(0x111114, env, .15), ch.hat, 0, R * .5, R * .58); visor.rotation.x = .28;
        const gold = metal(0xd4a83a, env, .3);
        if (k === 'pilot') { mesh(new THREE.BoxGeometry(R * .42, R * .07, .02), gold, ch.hat, 0, R * .78, R * 1.0); mesh(new THREE.SphereGeometry(R * .07, 12, 10), gold, ch.hat, 0, R * .78, R * 1.01); }
        else mesh(new THREE.CylinderGeometry(R * .1, R * .1, .02, 20).rotateX(Math.PI / 2), gold, ch.hat, 0, R * .78, R * 1.0);
      } else if (k === 'chef') {      // white toque: pleated band + puffy top
        const wm = cloth(o.hatColor || 0xfbfaf6, 'weave', .95);
        mesh(new THREE.CylinderGeometry(R * .99, R * .98, R * .42, 48, 1, true), wm, ch.hat, 0, R * .66, 0);
        for (let i = 0; i < 5; i++) { const a = i / 5 * TAU; mesh(new THREE.SphereGeometry(R * .48, 24, 18), wm, ch.hat, Math.sin(a) * R * .45, R * 1.12, Math.cos(a) * R * .45); }
        mesh(new THREE.SphereGeometry(R * .55, 24, 18), wm, ch.hat, 0, R * 1.28, 0);
      } else if (k === 'bucket') {    // soft bucket hat: rounded crown, wide brim sloping down all round
        const bm = cloth(o.hatColor || 0x2f4a3a, 'weave', .95, .01); bm.side = THREE.DoubleSide;
        const crown = mesh(new THREE.SphereGeometry(R * 1.05, 48, 18, 0, TAU, 0, Math.PI * .42), bm, ch.hat, 0, R * .16, 0); crown.scale.y = 1.12;
        mesh(new THREE.CylinderGeometry(R * 1.04, R * 1.04, R * .14, 48, 1, true), cloth(shade(o.hatColor || 0x2f4a3a, .7), 'weave', .95), ch.hat, 0, R * .5, 0);   // band
        mesh(new THREE.CylinderGeometry(R * 1.05, R * 1.3, R * .2, 56, 1, true), bm, ch.hat, 0, R * .36, 0);                                                     // short drooping brim
      } else if (k === 'top') {       // black top hat with a red band
        const bm = cloth(o.hatColor || 0x17171b, 'fine', .55);
        mesh(new THREE.CylinderGeometry(R * 1.08, R * 1.08, .022, 56), bm, ch.hat, 0, R * .62, 0);
        mesh(new THREE.CylinderGeometry(R * .7, R * .66, R * 1.0, 48), bm, ch.hat, 0, R * 1.12, 0);
        mesh(new THREE.CylinderGeometry(R * .672, R * .668, R * .16, 48, 1, true), cloth(0xb3202c, 'fine', .6), ch.hat, 0, R * .72, 0);
      }
    }
    // ---------- held props (Nov 23 2026): CHAR.make({holdR, holdL}) 'clipboard'|'drill'|'magnifier' ----------
    // Gripped in the mitt (that hand defaults to 'fist'). ch.held[±1] is the prop group; toggle .visible from a scene.
    ch.held = {};
    for (const s of [-1, 1]) { const what = s === 1 ? o.holdR : o.holdL; if (!what) continue;
      const g = ch.held[s] = grp(ch.arm[s].wr, 0, -B.hand * .78, 0), H = B.hand;
      if (what === 'clipboard') {     // carried at the side: board flat along the leg, held by its top edge
        const bd = grp(g, 0, -H * .2, H * .25); bd.rotation.x = .12;
        mesh(new THREE.BoxGeometry(.014, .34, .25), plain(0x9a6a3c, .7), bd, 0, -.17, 0);
        const pp = mesh(new THREE.PlaneGeometry(.21, .28), plain(0xf7f5ee, .9), bd, s * .009, -.19, 0); pp.rotation.y = s * Math.PI / 2;
        for (let i = 0; i < 5; i++) { const ln = mesh(new THREE.PlaneGeometry(.15, .008), plain(0x9aa7c4, .9), bd, s * .0095, -.1 - i * .045, .02); ln.rotation.y = s * Math.PI / 2; }
        mesh(new THREE.BoxGeometry(.03, .035, .1), metal(0xc8cad0, env, .25), bd, 0, -.012, 0);
      } else if (what === 'drill') {  // mitt = the grip; body runs past the fist along the forearm line, bit at the tip (points where the fist points)
        const ym = glossy(0xe39a10, env, .45), km = plain(0x1d1d20, .6);
        const body = grp(g, 0, 0, H * .55); g.scale.setScalar(1.5);
        mesh(new THREE.CylinderGeometry(.06, .065, .3, 22), ym, body, 0, -.12, 0);                         // motor body
        mesh(new THREE.CylinderGeometry(.068, .068, .05, 22), km, body, 0, -.02, 0);                       // vent ring
        mesh(new THREE.CylinderGeometry(.04, .03, .07, 18), km, body, 0, -.3, 0);                          // chuck
        mesh(new THREE.CylinderGeometry(.009, .009, .14, 8), metal(0xbfc3c9, env, .2), body, 0, -.4, 0);   // bit
        mesh(new THREE.BoxGeometry(.09, .1, .12), ym, g, 0, H * .15, -H * .05);                           // battery pack behind the fist
      } else if (what === 'magnifier') { // handle in the fist, lens ring beyond the hand
        mesh(new THREE.CylinderGeometry(.024, .028, .22, 12), plain(0x5a3418, .6), g, 0, -.08, 0);
        const ring = grp(g, 0, -.34, 0); mesh(new THREE.TorusGeometry(.14, .018, 12, 40), metal(0xd4a83a, env, .3), ring);
        const lens = mesh(new THREE.CircleGeometry(.14, 40), new THREE.MeshPhysicalMaterial({ color: 0xd8eeff, roughness: .05, transmission: .6, transparent: true, opacity: .45, envMap: env }), ring); lens.material.side = THREE.DoubleSide;
      }
    }
    ch.face = name => { headMat.map = faceTex(name, o.mustache); };
    ch.face('smile');
    // handcuffs: a steel ring on each wrist + a short chain; shown with pose({cuffs:true}) (use with gesture 'cuffed')
    const cuffM = metal(0xc8cad0, env, .22), cuffs = [];
    for (const s of [-1, 1]) { const r = mesh(new THREE.TorusGeometry(B.ar * .74, .018, 8, 24).rotateX(Math.PI / 2), cuffM, ch.arm[s].wr, 0, .015, 0); r.visible = false; cuffs.push(r); }
    const chain = mesh(new THREE.CylinderGeometry(.006, .006, 1, 6), cuffM, root); chain.visible = false; cuffs.push(chain);
    const _a = new THREE.Vector3(), _b = new THREE.Vector3();

    // Gestures: silent characters act with their hands. pose({gesture:'cross', gw:0..1}) blends one in.
    // Arm "R" = ch.arm[1], arm "L" = ch.arm[-1] (screen right/left when facing camera). [shX, shY, shZ, elX, elZ]
    const G = {
      point:    { 1: [-1.45, 0, .12, -.1, 0], hand: { 1: 'point' } },
      wave:     { 1: [-.15, 0, 2.5, null, 0], hand: { 1: 'open' } },
      shrug:    { 1: [-.3, 0, .35, -1.35, .7], [-1]: [-.3, 0, -.35, -1.35, -.7], up: .05, tilt: .12, hand: { 1: 'open', [-1]: 'open' } },
      cross:    { 1: [-.62, .25, -.18, -1.95, -1.1], [-1]: [-.55, -.25, .18, -1.85, 1.1], hand: { 1: 'fist', [-1]: 'fist' } },
      think:    { 1: [-.55, .3, -.25, -2.45, -.45], [-1]: [-.4, -.2, .2, -1.55, .95], nod: .1, tilt: -.08, hand: { 1: 'fist', [-1]: 'fist' } },
      facepalm: { 1: [-.95, .3, -.32, -2.5, -.35], nod: .32, hand: { 1: 'open' } },
      hips:     { 1: [.15, 0, .75, -1.35, -1.25], [-1]: [.15, 0, -.75, -1.35, 1.25], hand: { 1: 'fist', [-1]: 'fist' } },
      tada:     { 1: [-.7, 0, 1.0, -.25, 0], [-1]: [-.7, 0, -1.0, -.25, 0], hand: { 1: 'open', [-1]: 'open' } },
      cuffed:   { 1: [-.42, .2, -.2, -.85, -.55], [-1]: [-.42, -.2, .2, -.85, .55], nod: .18, hand: { 1: 'fist', [-1]: 'fist' } },   // wrists together in front of the belt
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
        A.sh.position.y = B.th * .83 + (g && g.up ? g.up * gw : 0);
        const own = s === 1 ? p.handR : p.handL, gh = g && g.hand && g.hand[s];
        const base = ch.held[s] ? 'fist' : rz > .5 ? 'open' : 'relaxed';
        if (own) setHand(s, own, own, 0); else setHand(s, base, gh || base, gh ? gw : 0);
      }
      hips.position.y = hipY - .02 * a + .035 * a * Math.abs(Math.cos(ph)) + Math.sin(t * 2.1) * .004;
      spine.rotation.y = sw * .07 * a; spine.rotation.x = (p.lean || 0) + .03 * a;
      neck.rotation.y = -sw * .05 * a + (p.look || 0); neck.rotation.x = (p.nod || 0) + (g && g.nod ? g.nod * gw : 0) + Math.sin(t * 2.1 + 1) * .01;
      neck.rotation.z = (p.tilt || 0) + (g && g.tilt ? g.tilt * gw : 0);
      const cf = !!p.cuffs; cuffs.forEach(c => c.visible = cf);
      if (cf) { root.updateMatrixWorld(true); ch.arm[-1].wr.localToWorld(_a.set(0, .015, 0)); ch.arm[1].wr.localToWorld(_b.set(0, .015, 0));
        root.worldToLocal(_a); root.worldToLocal(_b); const L = _a.distanceTo(_b);
        chain.position.copy(_a).add(_b).multiplyScalar(.5); chain.scale.set(1, Math.max(.01, L), 1);
        chain.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), _b.clone().sub(_a).normalize()); }
    };
    ch.pose({});
    return ch;
  };

  // ---------- ROBOT DOG: four-legged robot with a camera head and a mounted rifle (never fires) ----------
  //  CHAR.robodog({envMap, rifle:true}) -> { root (feet at y=0, faces +z), head, lens, pose({t, walk, walkAmt, look, tilt, crouch}) }
  //  walk = gait phase in cycles (trot: diagonal legs move together). Pure function of the pose values.
  C.robodog = function (opts = {}) {
    const env = opts.envMap, root = new THREE.Group(), rd = { root };
    const bodyM = Object.assign(glossy(0x8d939c, env, .38), { clearcoat: .3 }), darkM = new THREE.MeshStandardMaterial({ color: 0x2a2d33, roughness: .55, metalness: .3 });
    const jointM = new THREE.MeshStandardMaterial({ color: 0x1c1e22, roughness: .5, metalness: .4 }), yellowM = new THREE.MeshStandardMaterial({ color: 0xf2b230, roughness: .5 });
    const BL = 1.0, BW = .4, BH = .27, HIP = .6, UL = .32, LL = .34;
    const body = rd.body = grp(root, 0, HIP, 0);
    mesh(new THREE.BoxGeometry(BW, BH, BL), bodyM, body);
    mesh(new THREE.BoxGeometry(BW * .82, .05, BL * .7), darkM, body, 0, BH / 2 + .02, 0);           // top rail
    for (const s of [-1, 1]) mesh(new THREE.BoxGeometry(.01, .06, BL * .5), yellowM, body, s * (BW / 2 + .005), 0, 0); // side stripes
    // head: camera block at the front
    const head = rd.head = grp(body, 0, .03, BL / 2 + .02);
    mesh(new THREE.BoxGeometry(BW * .86, BH * .9, .2), darkM, head, 0, 0, .08);
    const lensM = new THREE.MeshStandardMaterial({ color: 0x9fd8ff, emissive: 0x58b8ff, emissiveIntensity: 1.6, roughness: .2 });
    for (const s of [-1, 1]) { mesh(new THREE.CylinderGeometry(.045, .045, .03, 20).rotateX(Math.PI / 2), jointM, head, s * .075, .01, .185);
      rd.lens = mesh(new THREE.CylinderGeometry(.03, .03, .035, 20).rotateX(Math.PI / 2), lensM, head, s * .075, .01, .19); }
    mesh(new THREE.BoxGeometry(.05, .02, .02), lensM, head, 0, -.06, .185);                                   // sensor strip
    // rifle on a mount (dark, simple shapes; never animated firing)
    if (opts.rifle !== false) { const gun = rd.rifle = grp(body, 0, BH / 2 + .05, .02);
      mesh(new THREE.BoxGeometry(.06, .1, .06), jointM, gun, 0, 0, 0);                                       // mount post
      mesh(new THREE.BoxGeometry(.07, .08, .42), darkM, gun, 0, .09, .02);                                    // receiver + stock
      mesh(new THREE.CylinderGeometry(.018, .018, .5, 12).rotateX(Math.PI / 2), jointM, gun, 0, .1, .47);    // barrel
      mesh(new THREE.BoxGeometry(.04, .1, .06), jointM, gun, 0, .02, .12);                                    // magazine
      mesh(new THREE.BoxGeometry(.04, .04, .12), jointM, gun, 0, .155, .06); }                                // sight
    // legs: hip -> thigh -> knee (bends backward) -> shin -> foot
    rd.legs = [];
    for (const [fx, fz] of [[1, 1], [-1, 1], [1, -1], [-1, -1]]) {
      const hip = grp(body, fx * (BW / 2 + .05), -.02, fz * (BL / 2 - .1));
      mesh(new THREE.SphereGeometry(.07, 16, 12), jointM, hip);
      mesh(new THREE.BoxGeometry(.1, UL, .13), bodyM, hip, 0, -UL / 2, 0);
      const knee = grp(hip, 0, -UL, 0); mesh(new THREE.SphereGeometry(.055, 14, 10), jointM, knee);
      mesh(new THREE.CylinderGeometry(.045, .035, LL, 12), darkM, knee, 0, -LL / 2, 0);
      const foot = mesh(new THREE.SphereGeometry(.05, 14, 10), jointM, knee, 0, -LL, 0); foot.scale.y = .8;
      rd.legs.push({ hip, knee, fz, ph: (fx === fz) ? 0 : .5 });                                             // trot: diagonal pairs
    }
    // two-bone IK: place each foot at (0, -y, z) relative to the hip, knee bending backward
    function ik(L, fy, fzOff) { const d = Math.min(UL + LL - .001, Math.hypot(fy, fzOff));
      const a = Math.acos((UL * UL + d * d - LL * LL) / (2 * UL * d)), base = Math.atan2(fzOff, fy);
      L.hip.rotation.x = -(base - a); L.knee.rotation.x = -Math.acos((UL * UL + LL * LL - d * d) / (2 * UL * LL)) + Math.PI; L.knee.rotation.x *= -1; }
    rd.pose = function (p = {}) {
      const a = p.walkAmt || 0, t = p.t || 0, crouch = p.crouch || 0, stand = HIP - .02 - crouch * .18;
      body.position.y = stand + a * .015 * Math.abs(Math.sin((p.walk || 0) * Math.PI * 4)) + Math.sin(t * 2.3) * .004;
      body.rotation.x = (p.pitch || 0); body.rotation.z = Math.sin((p.walk || 0) * Math.PI * 2) * .02 * a;
      for (const L of rd.legs) { const ph = ((p.walk || 0) + L.ph) % 1, swing = ph < .5;
        const u = swing ? ph / .5 : (ph - .5) / .5, stride = .3 * a;
        const z = swing ? -stride / 2 + stride * (u * u * (3 - 2 * u)) : stride / 2 - stride * u, lift = swing ? Math.sin(u * Math.PI) * .12 * a : 0;
        ik(L, body.position.y - .02 - lift, z); }
      head.rotation.y = p.look || 0; head.rotation.z = p.tilt || 0; head.rotation.x = p.nod || 0;
    };
    rd.pose({}); return rd;
  };
})();
