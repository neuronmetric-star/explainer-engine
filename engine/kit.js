// =====================================================================
//  KIT — the shared Three.js explainer engine ("gold-noir" style)
//  A scene file (videos/<slug>/scene.js) sets window.SCENE and uses KIT.
//  Everything is a pure function of time, so renders are frame-exact.
// =====================================================================
(function () {
  // deterministic randomness -> identical renders every time
  let _s = 777; Math.random = function () { _s |= 0; _s = _s + 0x6D2B79F5 | 0; let t = Math.imul(_s ^ _s >>> 15, 1 | _s); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; };

  const K = window.KIT = {};
  const W = 1080, H = 1920; K.W = W; K.H = H;
  const DATA = window.VIDEO_DATA;   // from videos/<slug>/data.js (made by tools/tts.js or tools/align.js)
  if (!DATA) throw new Error('VIDEO_DATA missing: run tools/tts.js or tools/align.js first');

  // ---------------- timing: script tokens <-> spoken words ----------------
  const TOK = ScriptParser.parse(DATA.script);
  const WORDS = DATA.words;               // [{w,start,end}]
  const CUES = {};
  const CAPS = [];                        // [{t, end, txt, cls}]
  (function align() {
    let wi = 0; const pending = [];
    for (const tk of TOK) {
      if (tk.cue) { pending.push(tk.cue); continue; }
      const w0 = WORDS[Math.min(wi, WORDS.length - 1)], w1 = WORDS[Math.min(wi + tk.n - 1, WORDS.length - 1)];
      pending.forEach(c => CUES[c] = w0.start); pending.length = 0;
      CAPS.push({ t: w0.start, end: w1.end, txt: tk.disp, cls: tk.cls });
      wi += tk.n;
    }
    pending.forEach(c => CUES[c] = DATA.audioLength);
    if (wi !== WORDS.length) console.warn('word count mismatch: script', wi, 'audio', WORDS.length);
  })();
  K.cues = CUES;
  K.at = function (cue) { if (!(cue in CUES)) throw new Error('Unknown cue [#' + cue + '] — add it to script.txt'); return CUES[cue]; };
  // T('cue'), T('cue+0.4'), T('cue-0.2'), T(12.5)
  K.T = function (x) { if (typeof x === 'number') return x; const m = /^(.+?)([+-]\d*\.?\d+)?$/.exec(x); return K.at(m[1]) + (m[2] ? parseFloat(m[2]) : 0); };
  K.END = DATA.audioLength;
  window.VIDEO_LENGTH = DATA.audioLength + 1.2;

  // ---------------- math helpers ----------------
  K.clamp01 = x => Math.max(0, Math.min(1, x));
  K.ease = x => x <= 0 ? 0 : x >= 1 ? 1 : x * x * (3 - 2 * x);
  K.easeOut = x => x <= 0 ? 0 : x >= 1 ? 1 : 1 - Math.pow(1 - x, 3);
  K.pop = x => { if (x <= 0) return 0; if (x >= 1) return 1; const c = 1.70158; return 1 + (c + 1) * Math.pow(x - 1, 3) + c * Math.pow(x - 1, 2); };
  K.prog = (t, from, dur) => K.clamp01((t - K.T(from)) / dur);     // 0..1 progress after a cue
  K.v3 = (x, y, z) => new THREE.Vector3(x, y, z);
  const { clamp01, ease, easeOut, pop } = K;

  // ---------------- look (style) ----------------
  // Default = gold-noir. A video picks another look with videos/<slug>/look.js -> window.LOOK = 'blueprint',
  // and engine/styles/<look>.js fills window.STYLE (colors + extra CSS). Cards/captions/steps stay the same.
  const ST = K.STYLE = Object.assign({ name: 'gold-noir', bg: 0x000000, fog: [26, 70], floor: 0x8a8a8a, dim: 0x000000, dimOpacity: .74,
    grid: 0x2a2a2a, dust: 0xffd27a, ink: 0xffc548, body: 0x020100, bloom: [1.15, .4, .52], backGrid: null, css: '' }, window.STYLE || {});
  if (ST.css) document.head.insertAdjacentHTML('beforeend', '<style>' + ST.css + '</style>');
  document.body.classList.add('look-' + ST.name);

  // ---------------- renderer ----------------
  const canvas = document.getElementById('c');
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
  renderer.setPixelRatio(1); renderer.setSize(W, H, false);
  renderer.outputEncoding = THREE.sRGBEncoding;
  renderer.localClippingEnabled = true;   // needed for cutaways (K.cutaway)
  const scene = K.scene = new THREE.Scene(); scene.background = new THREE.Color(ST.bg);
  if (ST.sky) { // vertical gradient sky (bright look): top color -> horizon color
    const cv = document.createElement('canvas'); cv.width = 4; cv.height = 512; const cx = cv.getContext('2d'), gr = cx.createLinearGradient(0, 0, 0, 512);
    ST.sky.forEach((c, i) => gr.addColorStop(i / (ST.sky.length - 1), '#' + c.toString(16).padStart(6, '0'))); cx.fillStyle = gr; cx.fillRect(0, 0, 4, 512);
    const tx = new THREE.CanvasTexture(cv); tx.encoding = THREE.sRGBEncoding; scene.background = tx; }
  if (ST.shadows) { renderer.shadowMap.enabled = true; renderer.shadowMap.type = THREE.PCFSoftShadowMap; }
  scene.fog = new THREE.Fog(ST.bg, ST.fog[0], ST.fog[1]);
  const camera = K.camera = new THREE.PerspectiveCamera(50, W / H, .1, 400);
  const amb = new THREE.AmbientLight(0xffffff, .35); scene.add(amb);
  const key = new THREE.DirectionalLight(0xffffff, .9); key.position.set(5, 10, 8); scene.add(key);
  const composer = new THREE.EffectComposer(renderer);
  composer.addPass(new THREE.RenderPass(scene, camera));
  const bloomPass = K.bloom = new THREE.UnrealBloomPass(new THREE.Vector2(W / 2, H / 2), ...ST.bloom); composer.addPass(bloomPass);

  // floor: reflective (noir/blueprint) or matte with soft shadows (bright)
  const FLOOR_W = 600;
  if (ST.floorMode === 'matte') {
    const fl = new THREE.Mesh(new THREE.PlaneGeometry(FLOOR_W, 120), new THREE.MeshStandardMaterial({ color: ST.floor, roughness: .95, metalness: 0 }));
    fl.rotation.x = -Math.PI / 2; fl.position.set(200, 0, -20); fl.receiveShadow = true; scene.add(fl); K.floor = fl;
  } else {
  const refl = new THREE.Reflector(new THREE.PlaneGeometry(FLOOR_W, 80), { textureWidth: 540, textureHeight: 960, color: ST.floor });
  refl.rotation.x = -Math.PI / 2; refl.position.set(200, 0, 0); scene.add(refl);
  const dim = new THREE.Mesh(new THREE.PlaneGeometry(FLOOR_W, 80), new THREE.MeshBasicMaterial({ color: ST.dim, transparent: true, opacity: ST.dimOpacity }));
  dim.rotation.x = -Math.PI / 2; dim.position.set(200, .005, 0); scene.add(dim);
  const origBR = refl.onBeforeRender;
  refl.onBeforeRender = function () { dim.visible = false; origBR.apply(this, arguments); dim.visible = true; };
  { const g = new THREE.BufferGeometry(); const p = []; for (let i = -2; i <= 2; i++) p.push(-100, .01, i * 6, 500, .01, i * 6);
    g.setAttribute('position', new THREE.Float32BufferAttribute(p, 3)); scene.add(new THREE.LineSegments(g, new THREE.LineBasicMaterial({ color: ST.grid }))); }
  }
  if (ST.backGrid) { // blueprint paper: a big gridded wall far behind every set
    const g = new THREE.BufferGeometry(), p = [], z = ST.backGrid.z, step = ST.backGrid.step;
    for (let x = -60; x <= 520; x += step) p.push(x, 0, z, x, 60, z);
    for (let y = 0; y <= 60; y += step) p.push(-60, y, z, 520, y, z);
    g.setAttribute('position', new THREE.Float32BufferAttribute(p, 3)); scene.add(new THREE.LineSegments(g, new THREE.LineBasicMaterial({ color: ST.backGrid.color }))); }
  if (ST.dust) { const n = 2400, p = new Float32Array(n * 3); for (let i = 0; i < n; i++) { p[i * 3] = -40 + Math.random() * 480; p[i * 3 + 1] = Math.random() * 16; p[i * 3 + 2] = -16 + Math.random() * 24; }
    const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.BufferAttribute(p, 3));
    scene.add(new THREE.Points(g, new THREE.PointsMaterial({ color: ST.dust, size: .05, transparent: true, opacity: .55 }))); }

  // ---------------- builders ----------------
  K.INK = ST.ink; K.CYAN = 0x5fe3ff; K.GOLD = 0xffc548; K.RED = 0xff3a2c; K.WHITE = 0xffffff; K.BLUE = 0xbfd7ff; K.GREEN = 0x9dffb9; K.SILVER = 0xdedede;
  const lineMats = {};
  function lm(c) { if (!lineMats[c]) { const m = new THREE.LineMaterial({ color: c, linewidth: 3.2 }); m.resolution.set(W, H); lineMats[c] = m; } return lineMats[c]; }
  // wire(geometry, color, parent): glowing edge outline over a near-black body
  K.wire = function (geo, color = K.INK, parent) {
    if (ST.solidAll) return K.solid(geo, color, parent);   // bright look: no outlines, every shape is solid
    const g = new THREE.Group();
    const m = new THREE.Mesh(geo, new THREE.MeshBasicMaterial({ color: ST.body, polygonOffset: true, polygonOffsetFactor: 1, polygonOffsetUnits: 1 }));
    const lg = new THREE.LineSegmentsGeometry().fromEdgesGeometry(new THREE.EdgesGeometry(geo, 20));
    const l = new THREE.LineSegments2(lg, lm(color)); l.computeLineDistances();
    g.add(m, l); (parent || scene).add(g); return g;
  };
  K.group = (x, y, z, parent) => { const g = new THREE.Group(); g.position.set(x, y, z); (parent || scene).add(g); return g; };
  K.box = (w, h, d, x, y, z, parent, color) => { const g = K.wire(new THREE.BoxGeometry(w, h, d), color, parent); g.position.set(x, y, z); return g; };
  K.cyl = (r, h, x, y, z, parent, color, seg = 10) => { const g = K.wire(new THREE.CylinderGeometry(r, r, h, seg), color, parent); g.position.set(x, y, z); return g; };
  // bar(): unit-height box you grow with K.setBar(bar, height)
  K.bar = (w, d, x, z, parent, color) => K.box(w, 1, d, x, 0, z, parent, color);
  K.setBar = (b, h) => { b.scale.y = Math.max(.02, h); b.position.y = b.scale.y / 2; };
  // extrude(shape points [[x,y],...], depth): for roofs, signs, gravestones, arrows, maps
  K.extrude = (pts, depth, x, y, z, parent, color) => { const sh = new THREE.Shape(); sh.moveTo(pts[0][0], pts[0][1]); pts.slice(1).forEach(p => sh.lineTo(p[0], p[1])); sh.lineTo(pts[0][0], pts[0][1]);
    const g = K.wire(new THREE.ExtrudeGeometry(sh, { depth, bevelEnabled: false }), color, parent); g.position.set(x, y, z); return g; };
  K.roof = (w, h, d, x, y, z, parent, color) => K.extrude([[-w / 2, 0], [w / 2, 0], [0, h]], d, x, y, z - d / 2, parent, color);
  K.ring = (r, x, z, color = K.INK) => { const g = new THREE.Mesh(new THREE.RingGeometry(r, r + .06, 64), new THREE.MeshBasicMaterial({ color, side: THREE.DoubleSide })); g.rotation.x = -Math.PI / 2; g.position.set(x, .02, z); scene.add(g); return g; };
  // tube line through points — charts, paths, money flows. Animate with K.drawTube(t, 0..1)
  K.tube = (pts, color = 0xffd15a, r = .07, parent) => { const curve = new THREE.CatmullRomCurve3(pts.map(p => new THREE.Vector3(...p)), false, 'catmullrom', .1);
    const geo = new THREE.TubeGeometry(curve, Math.max(60, pts.length * 10), r, 6, false); const m = new THREE.Mesh(geo, new THREE.MeshBasicMaterial({ color })); (parent || scene).add(m); m.userData.n = geo.index.count; return m; };
  K.drawTube = (m, f) => { m.geometry.setDrawRange(0, Math.floor(clamp01(f) * m.userData.n / 6) * 6); m.visible = f > .005; };
  // faceless presenter figure (tie=true -> the "rich"/host character)
  const figMat = new THREE.MeshStandardMaterial({ color: 0xcfcfcf, emissive: 0x151515, roughness: .5, metalness: .05 });
  const tieMat = new THREE.MeshStandardMaterial({ color: 0xffc548, emissive: 0xb07a10, roughness: .3 });
  K.person = function (x, z, opts = {}) {
    const s = (opts.scale || 1) * .82, g = K.group(x, 0, z); g.scale.setScalar(s);
    if (ST.rig) solidLights();
    const mat = opts.color ? new THREE.MeshStandardMaterial({ color: opts.color, emissive: 0x111111, roughness: .5 }) : figMat;
    const add = (geo, y, m = mat) => { const o = new THREE.Mesh(geo, m); o.position.y = y; o.castShadow = !!ST.shadows; g.add(o); return o; };
    add(new THREE.CylinderGeometry(.55, .62, 1.7, 28), .95);
    add(new THREE.SphereGeometry(.55, 28, 16, 0, Math.PI * 2, 0, Math.PI / 2), 1.8);
    add(new THREE.SphereGeometry(.42, 28, 20), 2.65);
    add(new THREE.SphereGeometry(.62, 28, 10, 0, Math.PI * 2, Math.PI / 2, Math.PI / 2), .1);
    if (opts.tie) { const t = add(new THREE.ConeGeometry(.11, .9, 4), 1.75, tieMat); t.rotation.x = Math.PI; t.position.z = .56;
      const k = add(new THREE.BoxGeometry(.16, .12, .08), 2.18, tieMat); k.position.z = .54; }
    return g;
  };
  // flying object along an arc between two points (cash, coins, documents)
  K.fly = (obj, t, start, dur, from, to, height = 2.2) => { const u = clamp01((t - start) / dur); obj.visible = u > 0 && u < 1;
    if (!obj.visible) return; const e = ease(u); obj.position.lerpVectors(from, to, e); obj.position.y += Math.sin(e * Math.PI) * height; obj.rotation.y = e * 3; };
  K.hop = (obj, t, at, h = .25) => { obj.position.y = Math.max(0, Math.sin(clamp01((t - K.T(at)) / .4) * Math.PI)) * h; };

  // ---------------- solid models + cutaways (technical-illustration look) ----------------
  // Solid shaded parts for machines (subs, jets, engines). Extra studio lights are added the first time
  // K.solid is used, so older wireframe-only videos render exactly as before.
  let solidLit = false;
  function solidLights() { if (solidLit) return; solidLit = true;
    if (ST.rig === 'bright') { // sunny studio: sky fill + warm sun with soft shadows that follow the camera
      scene.add(new THREE.HemisphereLight(0xdcecff, 0x8a7458, .42)); amb.intensity = .08; key.intensity = .78; key.color.set(0xfff1dc);
      key.castShadow = true; key.shadow.mapSize.set(2048, 2048); const sc = key.shadow.camera; sc.left = sc.bottom = -14; sc.right = sc.top = 14; sc.near = 1; sc.far = 60;
      key.shadow.bias = -.0006; key.shadow.normalBias = .02; scene.add(key.target);
      bloomPass.threshold = .95; bloomPass.strength = .25; return; }
    const hemi = new THREE.HemisphereLight(0xdfefff, 0x101418, .22); scene.add(hemi);
    const rim = new THREE.DirectionalLight(0x9fd8ff, .5); rim.position.set(-6, 6, -8); scene.add(rim);
    // solids are lit, not glowing: raise the bloom threshold so only emissive parts (reactor, screens) bloom
    bloomPass.threshold = .82; bloomPass.strength = .8;
    // filmic tone mapping keeps close-ups from blowing out to white
    amb.intensity = .2; key.intensity = .8;
    if ((window.SCENE || {}).tone !== false) { renderer.toneMapping = THREE.ACESFilmicToneMapping; renderer.toneMappingExposure = .95; } }  // scene.tone=false keeps colors punchier
  // cutaway: a box-shaped "bite" removed from every solid that uses it: x0 < x < x1 AND z > zCut (front half)
  // and optionally y > yCut. Animate the opening with K.setCut(cut, x0, x1).
  K.cutaway = function (o = {}) {
    const c = { planes: [new THREE.Plane(new THREE.Vector3(-1, 0, 0), 0), new THREE.Plane(new THREE.Vector3(1, 0, 0), 0), new THREE.Plane(new THREE.Vector3(0, 0, -1), o.z || 0)] };
    if (o.y !== undefined) c.planes.push(new THREE.Plane(new THREE.Vector3(0, -1, 0), o.y));
    K.setCut(c, o.x0 || 0, o.x1 || 0); return c; };
  K.setCut = (c, x0, x1) => { c.planes[0].constant = x0; c.planes[1].constant = -Math.max(x0, x1); };   // x1 <= x0 -> closed
  // solid(geo, color, parent, {cut, rough, metal, inner}) -> shaded mesh; with a cut, the inside wall shows in 'inner' color
  K.solid = function (geo, color = 0x5d6b78, parent, o = {}) {
    solidLights();
    const mk = (side, col) => { const m = new THREE.MeshStandardMaterial({ color: col, roughness: o.rough ?? .55, metalness: o.metal ?? .25, side,
      emissive: o.glow ? col : 0x000000, emissiveIntensity: o.glow || 0 });
      if (o.cut) { m.clippingPlanes = o.cut.planes; m.clipIntersection = true; } return m; };
    const g = new THREE.Group(); const fm = new THREE.Mesh(geo, mk(THREE.FrontSide, color)); g.add(fm);
    if (ST.shadows) { fm.castShadow = o.shadow !== false; fm.receiveShadow = true; }
    if (o.cut) g.add(new THREE.Mesh(geo, mk(THREE.BackSide, o.inner ?? 0x2a3138)));
    (parent || scene).add(g); return g;
  };
  // hull(profile [[x, radius], ...], color, parent, opts): a smooth body of revolution along the x axis
  K.hull = function (prof, color, parent, o = {}) {
    const pts = prof.map(([x, r]) => new THREE.Vector2(Math.max(.001, r), x));
    const geo = new THREE.LatheGeometry(pts, o.seg || 48); geo.rotateZ(-Math.PI / 2); geo.computeVertexNormals();
    return K.solid(geo, color, parent, o);
  };

  // ---------------- UI (DOM overlays, crisp text) ----------------
  const $ = id => document.getElementById(id);
  const ui = $('ui');
  ui.insertAdjacentHTML('beforeend', `
    <svg id="colines" width="1080" height="1920"></svg><div id="callouts"></div>
    <div id="cards"></div>
    <div id="steps" style="opacity:0"><div class="t"></div><div class="row"></div><div class="labs"></div></div>
    <div id="receipt" style="opacity:0"></div>
    <div id="ftitle" style="opacity:0"></div><div id="follow" style="opacity:0">+ FOLLOW</div>
    <svg id="cursor" viewBox="0 0 24 24" style="opacity:0"><path d="M3 2l17 9-7 2-3 7z" fill="#fff" stroke="#000" stroke-width="1.2"/></svg>
    <div id="cap"></div><div id="wm"></div><div id="fhandle"></div><div id="flash"></div>`);
  const cardsEl = $('cards'), cap = $('cap'), flash = $('flash');
  const CARDS = [];
  // card({l:'label', v:'value', cls:'red|white|big|tag', a:[x,y,z] anchor, t0:'cue', t1:'cue', count:[from,to,'cue',seconds], neg, flip:['cue','new value']})
  K.card = function (o) {
    const el = document.createElement('div'); el.className = 'card ' + (o.cls || '');
    el.innerHTML = (o.l ? `<div class="l">${o.l}</div>` : '') + `<div class="v">${o.v || ''}</div>`;
    cardsEl.appendChild(el); o.el = el; o.vEl = el.querySelector('.v');
    o.anchor = Array.isArray(o.a) ? new THREE.Vector3(...o.a) : o.a; o._t0 = K.T(o.t0); o._t1 = K.T(o.t1);
    if (o.count) { o._cs = K.T(o.count[2]); o._ce = o._cs + (o.count[3] || 1.2); }
    if (o.flip) o._ft = K.T(o.flip[0]);
    o.orig = o.v; CARDS.push(o); return o;
  };
  const fmt = n => '$' + Math.round(n).toLocaleString('en-US'); K.fmt = fmt;
  // callout({n:1, l:'Reactor', a:[x,y,z] anchor, at:[screenX, screenY] label position, t0, t1, cls:'red|gold|cyan'})
  // -> numbered dot on the part + leader line + label box, like a cutaway poster. Pops in at t0.
  const CALLS = [], coSvg = () => $('colines');
  K.callout = function (o) {
    const el = document.createElement('div'); el.className = 'co ' + (o.cls || '');
    el.innerHTML = `<b>${o.n ?? ''}</b><span>${o.l}</span>`; $('callouts').appendChild(el);
    const dot = document.createElement('div'); dot.className = 'cod ' + (o.cls || ''); dot.textContent = o.n ?? ''; $('callouts').appendChild(dot);
    const ln = document.createElementNS('http://www.w3.org/2000/svg', 'line'); ln.setAttribute('class', 'col ' + (o.cls || '')); coSvg().appendChild(ln);
    Object.assign(o, { el, dot, ln, anchor: new THREE.Vector3(...o.a), _t0: K.T(o.t0), _t1: K.T(o.t1) }); CALLS.push(o); return o; };
  const cv = new THREE.Vector3();
  function updateCallouts(t) {
    for (const c of CALLS) {
      const on = t >= c._t0 && t < c._t1; c.el.style.display = on ? 'flex' : 'none'; c.dot.style.display = on ? 'grid' : 'none'; c.ln.style.display = on ? '' : 'none'; if (!on) continue;
      cv.copy(c.anchor).project(camera); const ax = (cv.x * .5 + .5) * W, ay = (-cv.y * .5 + .5) * H;
      if (cv.z > 1 || ax < 0 || ax > W || ay < 140 || ay > H - 380) { c.el.style.display = c.dot.style.display = 'none'; c.ln.style.display = 'none'; continue; }
      const k = pop(clamp01((t - c._t0) / .35)), out = clamp01((c._t1 - t) / .2), lineK = clamp01((t - c._t0 - .1) / .3);
      c.dot.style.left = ax + 'px'; c.dot.style.top = ay + 'px'; c.dot.style.transform = `translate(-50%,-50%) scale(${k})`; c.dot.style.opacity = out;
      const r = c.el.getBoundingClientRect(), lx = Math.max(28, Math.min(W - 28 - r.width, c.at[0] - r.width / 2)), ly = c.at[1];
      c.el.style.left = lx + 'px'; c.el.style.top = (ly - r.height / 2) + 'px'; c.el.style.opacity = Math.min(out, clamp01((t - c._t0 - .2) / .2));
      c.el.style.transform = `scale(${.7 + .3 * pop(clamp01((t - c._t0 - .2) / .3))})`;
      const ex = lx + r.width / 2 + (ax < lx ? -r.width / 2 : ax > lx + r.width ? r.width / 2 : 0), ey = ly;
      c.ln.setAttribute('x1', ax); c.ln.setAttribute('y1', ay); c.ln.setAttribute('x2', ax + (ex - ax) * lineK); c.ln.setAttribute('y2', ay + (ey - ay) * lineK); c.ln.style.opacity = out;
    }
  }
  const pv = new THREE.Vector3();
  function updateCards(t) {
    for (const c of CARDS) {
      if (t < c._t0 || t >= c._t1) { c.el.style.display = 'none'; continue; }
      c.el.style.display = 'block';
      const k = pop(clamp01((t - c._t0) / .32)), out = clamp01((c._t1 - t) / .18);
      pv.copy(c.anchor).project(camera);
      const x = (pv.x * .5 + .5) * W, y = (-pv.y * .5 + .5) * H, r = c.el.getBoundingClientRect();
      c.el.style.left = Math.max(28, Math.min(W - 28 - r.width, x - r.width / 2)) + 'px'; c.el.style.top = (y - r.height / 2) + 'px';
      c.el.style.transform = `scale(${(.6 + .4 * k) * (.92 + .08 * out)})`; c.el.style.opacity = Math.min(clamp01((t - c._t0) / .15), out);
      if (c.count) { const [a, b] = c.count; const u = easeOut(clamp01((t - c._cs) / (c._ce - c._cs))); c.vEl.textContent = (c.neg ? '-' : '') + (c.fmt || fmt)(a + (b - a) * u); }
      if (c.flip && t >= c._ft) { const z = clamp01((t - c._ft) / .25); c.vEl.style.transform = `scaleY(${Math.abs(Math.cos(z * Math.PI))})`; c.vEl.textContent = z < .5 ? c.orig : c.flip[1]; }
    }
  }

  // ---------------- camera shots ----------------
  // shots: [[when, [camX,camY,camZ], [lookX,lookY,lookZ], drift]] ; when = seconds or 'cue' / 'cue+0.3'
  let SHOTS = [];
  const camPos = new THREE.Vector3(), camTgt = new THREE.Vector3();
  function cameraAt(t, dist) {
    let i = 0; for (let k = 0; k < SHOTS.length; k++) if (t >= SHOTS[k].t) i = k;
    const sh = SHOTS[i], nx = SHOTS[i + 1]; const dur = (nx ? nx.t : window.VIDEO_LENGTH) - sh.t;
    const u = clamp01((t - sh.t) / dur);
    const p = sh.p.clone().addScaledVector(sh.q.clone().sub(sh.p).normalize(), sh.d * u).add(new THREE.Vector3(Math.sin(t * .35) * .12, 0, 0));
    const q = sh.q.clone();
    if (i > 0) { const pv_ = SHOTS[i - 1]; const pp = pv_.p.clone().addScaledVector(pv_.q.clone().sub(pv_.p).normalize(), pv_.d);
      const k = easeOut(clamp01((t - sh.t) / .55)); p.lerpVectors(pp, p, k); q.lerpVectors(pv_.q, q, k); }
    p.sub(q).multiplyScalar(dist).add(q); camPos.copy(p); camTgt.copy(q);
  }

  // ---------------- frame loop ----------------
  let time = 0, SC;
  const shakeAmp = t => { let a = 0; for (const [s, d, amp] of SC._shakes) if (t > s && t < s + d) a = Math.max(a, (1 - (t - s) / d) * amp); return a; };
  const flashAmp = t => { let a = 0; for (const [s, d, amp] of SC._flashes) if (t > s && t < s + d) a = Math.max(a, (1 - (t - s) / d) * amp); return a; };
  function frame(dt, doRender) {
    time += dt; const t = time;
    SC.update && SC.update(t, K);
    cameraAt(t, SC.distance || 1.5);
    const sh = shakeAmp(t);
    camera.position.copy(camPos).add(new THREE.Vector3(Math.sin(t * 61) * sh, Math.cos(t * 47) * sh, 0));
    camera.lookAt(camTgt); camera.updateMatrixWorld();
    if (ST.shadows) { key.position.copy(camTgt).add(new THREE.Vector3(6, 14, 9)); key.target.position.copy(camTgt); key.target.updateMatrixWorld(); }
    updateCards(t); updateCallouts(t);
    // captions: one word/token at a time
    let c = null; for (const x of CAPS) { if (x.t <= t) c = x; else break; }
    if (c && t <= c.end + .45) { if (cap.textContent !== c.txt) cap.textContent = c.txt; cap.className = c.cls;
      cap.style.transform = `scale(${.85 + .15 * clamp01((t - c.t) / .12)})`; cap.style.opacity = 1; } else cap.style.opacity = 0;
    // step tracker
    if (SC.steps) { const s = SC.steps, el = $('steps'); const on = t >= s._from && t < s._to; el.style.opacity = on ? Math.min(1, (t - s._from) / .3) : 0;
      let st = 0; s._marks.forEach((m, i) => { if (t >= m) st = i + 1; });
      s._sc.forEach((d, i) => d.className = 'sc' + (i + 1 === st ? ' on' : (i + 1 < st ? ' done' : '')));
      s._lb.forEach((d, i) => d.className = (i + 1 === st ? 'on' : '')); s._ln.forEach((d, i) => d.className = 'sl' + (st > i + 1 ? ' done' : '')); }
    // receipt
    if (SC.receipt) { const r = SC.receipt, el = $('receipt'); const on = t >= r._from && t < r._to; el.style.opacity = on ? 1 : 0;
      if (on) el.style.transform = `translateY(${(1 - easeOut(clamp01((t - r._from) / .5))) * -500}px)`; }
    // follow CTA
    if (SC.follow) { const f = SC.follow, fo = $('follow'), cu = $('cursor'); const on = t >= f._from; fo.style.opacity = on ? 1 : 0; $('ftitle').style.opacity = on ? 1 : 0;
      if (on) { const ct = t - f._from; fo.style.transform = `translateX(-50%) scale(${.6 + .4 * pop(clamp01(ct / .35))})`; const clicked = ct > 1.6;
        fo.className = clicked ? 'on' : ''; fo.textContent = clicked ? '✓ FOLLOWING' : '+ FOLLOW'; cu.style.opacity = ct > .5 ? 1 : 0;
        const u = easeOut(clamp01((ct - .5) / 1)); cu.style.left = (760 - 150 * u) + 'px'; cu.style.top = (620 - 160 * u + (clicked && ct < 1.8 ? 6 : 0)) + 'px'; } else cu.style.opacity = 0; }
    // brand watermark: hops between 4 safe corners every 5 s (hard to crop or blur out), hidden under the end card
    { const wm = $('wm'), P = [[44, 160, 0], [44, 1478, 0], [1036, 160, 1], [1036, 1478, 1]];
      const seg = 5, i = Math.floor(t / seg), u = t - i * seg, p = P[(i * 3 + 1) % 4];
      const endOn = SC.follow && t >= SC.follow._from - .3;
      wm.style.top = p[1] + 'px'; wm.style.left = p[2] ? 'auto' : p[0] + 'px'; wm.style.right = p[2] ? (1080 - p[0]) + 'px' : 'auto';
      wm.style.opacity = endOn ? 0 : .55 * Math.min(clamp01(u / .3), clamp01((seg - u) / .3)); }
    if (SC.follow) { const on = t >= SC.follow._from; $('fhandle').style.opacity = on ? clamp01((t - SC.follow._from - .2) / .3) : 0; }
    flash.style.opacity = flashAmp(t);
    if (doRender) composer.render();
  }

  // ---------------- start: called after scene.js defines window.SCENE ----------------
  K.BRAND = '@coonknows';   // TikTok / socials handle shown as watermark + on the end card
  K.start = function () {
    SC = window.SCENE; if (!SC) throw new Error('scene.js must set window.SCENE');
    SC.build && SC.build(K);
    SHOTS = (SC.shots || []).map(s => ({ t: K.T(s[0]), p: new THREE.Vector3(...s[1]), q: new THREE.Vector3(...s[2]), d: s[3] || 1 })).sort((a, b) => a.t - b.t);
    (SC.cards || []).forEach(o => K.card(o));
    (SC.callouts || []).forEach(o => K.callout(o));
    SC._shakes = (SC.shakes || []).map(([a, d, amp]) => [K.T(a), d, amp]);
    SC._flashes = (SC.flashes || []).map(([a, d, amp]) => [K.T(a), d, amp]);
    if (SC.steps) { const s = SC.steps, el = $('steps'); el.querySelector('.t').textContent = s.title || 'THE TRICK';
      el.querySelector('.row').innerHTML = s.labels.map((_, i) => (i ? '<div class="sl"></div>' : '') + `<div class="sc">${i + 1}</div>`).join('');
      el.querySelector('.labs').innerHTML = s.labels.map(l => `<span>${l}</span>`).join('');
      s._sc = [...el.querySelectorAll('.sc')]; s._ln = [...el.querySelectorAll('.sl')]; s._lb = [...el.querySelectorAll('.labs span')];
      s._from = K.T(s.from); s._to = K.T(s.to); s._marks = s.marks.map(K.T); }
    if (SC.receipt) { const r = SC.receipt; r._from = K.T(r.from); r._to = K.T(r.to);
      $('receipt').innerHTML = `<h3>${r.title || 'THE MATH'}</h3>` + r.rows.map(([a, b, cls]) => `<div class="r ${cls || ''}"><span>${a}</span><b>${b}</b></div>`).join(''); }
    if (SC.follow) { SC.follow._from = K.T(SC.follow.from); $('ftitle').textContent = SC.follow.title || ''; }
    $('wm').textContent = SC.brand || K.BRAND; $('fhandle').textContent = SC.brand || K.BRAND;
    window.step = (n, dt) => { for (let i = 0; i < n; i++) frame(dt, i === n - 1); };
    window.ready = true;
  };
})();
