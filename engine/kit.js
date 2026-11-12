// =====================================================================
//  KIT — the shared Three.js explainer engine ("gold-noir" style)
//  A scene file (videos/<slug>/scene.js) sets window.SCENE and uses KIT.
//  Everything is a pure function of time, so renders are frame-exact.
// =====================================================================
(function () {
  // deterministic randomness -> identical renders every time
  let _s = 777; Math.random = function () { _s |= 0; _s = _s + 0x6D2B79F5 | 0; let t = Math.imul(_s ^ _s >>> 15, 1 | _s); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; };

  const K = window.KIT = {};
  // ---------------- style ("look") ----------------
  // gold-noir is the default; other looks live in engine/styles/<name>.js and override any of these.
  const GOLD_NOIR = {
    bg: 0x000000, fog: [26, 70], ambient: [0xffffff, .35], key: [0xffffff, .9],
    bloom: [1.15, .4, .52], floor: 'reflector', dust: [0xffd27a, .55, .05], guide: 0x2a2a2a,
    palette: { GOLD: 0xffc548, RED: 0xff3a2c, WHITE: 0xffffff, BLUE: 0xbfd7ff, GREEN: 0x9dffb9, SILVER: 0xdedede },
    ink: 'GOLD', fill: () => 0x020100, solid: false, outline: null, lineWidth: 3.2,
    person: [0xcfcfcf, 0x151515], tie: [0xffc548, 0xb07a10],
  };
  const STYLE_NAME = (window.SCENE && window.SCENE.style) || 'gold-noir';
  const ST = K.style = Object.assign({}, GOLD_NOIR, (window.STYLES || {})[STYLE_NAME] || {});
  ST.palette = Object.assign({}, GOLD_NOIR.palette, ST.palette); K.styleName = STYLE_NAME;
  // col(hex): colour for LIT materials. Looks with linear:true author colours in sRGB (what you see in a colour picker)
  K.col = c => ST.linear ? new THREE.Color(c).convertSRGBToLinear() : new THREE.Color(c);
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

  // ---------------- renderer + look ----------------
  const canvas = document.getElementById('c');
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
  renderer.setPixelRatio(1); renderer.setSize(W, H, false);
  renderer.outputEncoding = THREE.sRGBEncoding;
  const scene = K.scene = new THREE.Scene(); scene.background = K.col(ST.bg);
  scene.fog = new THREE.Fog(K.col(ST.fogColor !== undefined ? ST.fogColor : ST.bg), ST.fog[0], ST.fog[1]);
  const camera = K.camera = new THREE.PerspectiveCamera(50, W / H, .1, 400);
  scene.add(new THREE.AmbientLight(ST.ambient[0], ST.ambient[1]));
  const key = K.keyLight = new THREE.DirectionalLight(ST.key[0], ST.key[1]); key.position.set(5, 10, 8); scene.add(key);
  if (ST.hemi) scene.add(new THREE.HemisphereLight(ST.hemi[0], ST.hemi[1], ST.hemi[2]));
  const composer = new THREE.EffectComposer(renderer);
  composer.addPass(new THREE.RenderPass(scene, camera));
  composer.addPass(new THREE.UnrealBloomPass(new THREE.Vector2(W / 2, H / 2), ST.bloom[0], ST.bloom[1], ST.bloom[2]));

  // reflective floor + dimmer + guide lines + dust
  const FLOOR_W = 600;
  if (ST.floor === 'reflector') {
  const refl = new THREE.Reflector(new THREE.PlaneGeometry(FLOOR_W, 80), { textureWidth: 540, textureHeight: 960, color: 0x8a8a8a });
  refl.rotation.x = -Math.PI / 2; refl.position.set(200, 0, 0); scene.add(refl);
  const dim = new THREE.Mesh(new THREE.PlaneGeometry(FLOOR_W, 80), new THREE.MeshBasicMaterial({ color: 0, transparent: true, opacity: .74 }));
  dim.rotation.x = -Math.PI / 2; dim.position.set(200, .005, 0); scene.add(dim);
  const origBR = refl.onBeforeRender;
  refl.onBeforeRender = function () { dim.visible = false; origBR.apply(this, arguments); dim.visible = true; };
  } else if (ST.floor) {          // plain floor: {color, grid:[color, step], opacity}
    const fl = new THREE.Mesh(new THREE.PlaneGeometry(FLOOR_W, 120), ST.floor.lit
      ? new THREE.MeshStandardMaterial({ color: K.col(ST.floor.color), roughness: 1 }) : new THREE.MeshBasicMaterial({ color: K.col(ST.floor.color) }));
    fl.rotation.x = -Math.PI / 2; fl.position.set(200, 0, 0); scene.add(fl); K.floorMesh = fl;
    if (ST.floor.grid) { const [gc, step] = ST.floor.grid, g = new THREE.BufferGeometry(), p = [];
      for (let x = -100; x <= 500; x += step) p.push(x, .01, -60, x, .01, 60);
      for (let z = -60; z <= 60; z += step) p.push(-100, .01, z, 500, .01, z);
      g.setAttribute('position', new THREE.Float32BufferAttribute(p, 3));
      scene.add(new THREE.LineSegments(g, new THREE.LineBasicMaterial({ color: K.col(gc), transparent: true, opacity: ST.floor.gridOpacity || .5 }))); }
  }
  if (ST.guide) { const g = new THREE.BufferGeometry(); const p = []; for (let i = -2; i <= 2; i++) p.push(-100, .01, i * 6, 500, .01, i * 6);
    g.setAttribute('position', new THREE.Float32BufferAttribute(p, 3)); scene.add(new THREE.LineSegments(g, new THREE.LineBasicMaterial({ color: ST.guide }))); }
  { const n = 2400, p = new Float32Array(n * 3); for (let i = 0; i < n; i++) { p[i * 3] = -40 + Math.random() * 480; p[i * 3 + 1] = Math.random() * 16; p[i * 3 + 2] = -16 + Math.random() * 24; }
    const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.BufferAttribute(p, 3));
    scene.add(new THREE.Points(g, new THREE.PointsMaterial({ color: ST.dust[0], size: ST.dust[2], transparent: true, opacity: ST.dust[1] }))); }

  // ---------------- builders ----------------
  Object.assign(K, ST.palette); K.INK = ST.palette[ST.ink] !== undefined ? ST.palette[ST.ink] : ST.ink;
  const lineMats = {};
  function lm(c, w = ST.lineWidth) { const k = c + ':' + w; if (!lineMats[k]) { const m = new THREE.LineMaterial({ color: c, linewidth: w }); m.resolution.set(W, H); lineMats[k] = m; } return lineMats[k]; }
  K.lineMat = lm;
  const fillMats = {};
  function fm(c) { const f = ST.fill(c); const k = f + (ST.solid ? 's' : 'b'); if (!fillMats[k]) fillMats[k] = ST.solid
      ? new THREE.MeshStandardMaterial({ color: K.col(f), flatShading: true, roughness: .92, metalness: 0, polygonOffset: true, polygonOffsetFactor: 1, polygonOffsetUnits: 1 })
      : new THREE.MeshBasicMaterial({ color: f, polygonOffset: true, polygonOffsetFactor: 1, polygonOffsetUnits: 1 });
    return fillMats[k]; }
  // wire(geometry, color, parent): gold-noir/blueprint = glowing edges over a dark body; parchment = lit low-poly solid with ink edges
  K.wire = function (geo, color = K.INK, parent, opts = {}) {
    const g = new THREE.Group();
    const m = new THREE.Mesh(geo, opts.fill !== undefined ? fm(opts.fill) : fm(color));
    const lg = new THREE.LineSegmentsGeometry().fromEdgesGeometry(new THREE.EdgesGeometry(geo, opts.angle || 20));
    const l = new THREE.LineSegments2(lg, ST.outline !== null && ST.outline !== undefined ? lm(ST.outline(color), ST.outlineWidth || 2) : lm(color)); l.computeLineDistances();
    g.add(m, l); (parent || scene).add(g); g.userData.body = m; g.userData.edges = l; return g;
  };
  // glow(geometry, color, parent, opacity): unlit, self-coloured mesh (fire, light beams, screens, energy)
  K.glow = (geo, color, parent, opacity = 1, x = 0, y = 0, z = 0) => { const m = new THREE.Mesh(geo, new THREE.MeshBasicMaterial({ color: K.col(color), transparent: opacity < 1, opacity, depthWrite: opacity >= 1, side: THREE.DoubleSide }));
    m.position.set(x, y, z); (parent || scene).add(m); return m; };
  // solid(geometry, color, parent): plain lit mesh (no outline)
  K.solid = (geo, color, parent, x = 0, y = 0, z = 0, opts = {}) => { const m = new THREE.Mesh(geo, new THREE.MeshStandardMaterial(Object.assign({ color: K.col(color), roughness: .8, flatShading: true }, opts)));
    m.position.set(x, y, z); (parent || scene).add(m); return m; };
  // line(points, color, parent, width): crisp polyline (maps, ridges, rays). setLine(line, 0..1) reveals it.
  K.line = (pts, color = K.INK, parent, width) => { const geo = new THREE.LineGeometry(); geo.setPositions(pts.flat());
    const l = new THREE.Line2(geo, lm(color, width || ST.lineWidth)); l.computeLineDistances(); (parent || scene).add(l); l.userData.n = pts.length; return l; };
  K.setLine = (l, f) => { const n = Math.max(0, Math.floor(clamp01(f) * (l.userData.n - 1))); l.geometry.instanceCount = n; l.visible = n > 0; };
  // fade(obj, opacity): set opacity on every material under obj (clones materials once so shared ones aren't affected)
  K.fade = (obj, o) => { obj.visible = o > .01; obj.traverse(c => { if (!c.material) return; if (!c.userData._own) { c.material = c.material.clone(); c.userData._own = 1; if (c.material.resolution) c.material.resolution.set(W, H); }
    c.material.transparent = true; c.material.opacity = o; }); };
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
  K.ring = (r, x, z, color = K.GOLD) => { const g = new THREE.Mesh(new THREE.RingGeometry(r, r + .06, 64), new THREE.MeshBasicMaterial({ color, side: THREE.DoubleSide })); g.rotation.x = -Math.PI / 2; g.position.set(x, .02, z); scene.add(g); return g; };
  // tube line through points — charts, paths, money flows. Animate with K.drawTube(t, 0..1)
  K.tube = (pts, color = ST.tubeColor || 0xffd15a, r = .07, parent) => { const curve = new THREE.CatmullRomCurve3(pts.map(p => new THREE.Vector3(...p)), false, 'catmullrom', .1);
    const geo = new THREE.TubeGeometry(curve, Math.max(60, pts.length * 10), r, 6, false); const m = new THREE.Mesh(geo, new THREE.MeshBasicMaterial({ color })); (parent || scene).add(m); m.userData.n = geo.index.count; return m; };
  K.drawTube = (m, f) => { m.geometry.setDrawRange(0, Math.floor(clamp01(f) * m.userData.n / 6) * 6); m.visible = f > .005; };
  // faceless presenter figure (tie=true -> the "rich"/host character)
  const figMat = new THREE.MeshStandardMaterial({ color: K.col(ST.person[0]), emissive: K.col(ST.person[1]), roughness: .5, metalness: .05 });
  const tieMat = new THREE.MeshStandardMaterial({ color: K.col(ST.tie[0]), emissive: K.col(ST.tie[1]), roughness: .3 });
  K.person = function (x, z, opts = {}) {
    const s = (opts.scale || 1) * .82, g = K.group(x, 0, z); g.scale.setScalar(s);
    const mat = opts.color ? new THREE.MeshStandardMaterial({ color: K.col(opts.color), emissive: 0x111111, roughness: .5 }) : figMat;
    const add = (geo, y, m = mat) => { const o = new THREE.Mesh(geo, m); o.position.y = y; g.add(o); return o; };
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

  // ---------------- UI (DOM overlays, crisp text) ----------------
  const $ = id => document.getElementById(id);
  const ui = $('ui');
  ui.insertAdjacentHTML('afterbegin', '<div id="panels"></div>');
  ui.insertAdjacentHTML('beforeend', `
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
    o.anchor = Array.isArray(o.a) ? new THREE.Vector3(...o.a) : (o.a || new THREE.Vector3()); o._t0 = K.T(o.t0); o._t1 = K.T(o.t1);
    if (o.count) { o._cs = K.T(o.count[2]); o._ce = o._cs + (o.count[3] || 1.2); }
    if (o.flip) o._ft = K.T(o.flip[0]);
    o.orig = o.v; CARDS.push(o); return o;
  };
  const fmt = n => '$' + Math.round(n).toLocaleString('en-US'); K.fmt = fmt;
  const pv = new THREE.Vector3();
  function updateCards(t) {
    for (const c of CARDS) {
      if (t < c._t0 || t >= c._t1) { c.el.style.display = 'none'; continue; }
      c.el.style.display = 'block';
      const k = pop(clamp01((t - c._t0) / .32)), out = clamp01((c._t1 - t) / .18);
      let x, y; if (c.s) { x = c.s[0]; y = c.s[1]; } else { pv.copy(c.anchor).project(camera); x = (pv.x * .5 + .5) * W; y = (-pv.y * .5 + .5) * H; }
      const r = c.el.getBoundingClientRect();
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
    updatePanels(t, sh);
    updateCards(t);
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
    if (doRender && !SC._no3d) composer.render();
  }

  // ---------------- image panels (2D cartoon stories) ----------------
  // panels: [{ img:'img/01.png', at:'cue', move:{zoom:[1.05,1.18], x:[0,-40], y:[0,30]}, fx:'flicker'|'pulse', fade:.25 }]
  // Each panel covers the whole 1080x1920 frame from `at` until the next panel (crossfade). x/y in px; zoom about `origin` ([%,%]).
  // Pure function of t; global shakes also shake the panels.
  const PANELS = [];
  function updatePanels(t, sh) {
    if (!PANELS.length) return;
    let cur = -1; for (let i = 0; i < PANELS.length; i++) if (t >= PANELS[i]._t) cur = i;
    updateParts(t, PANELS[cur]);
    PANELS.forEach((p, i) => {
      const end = i + 1 < PANELS.length ? PANELS[i + 1]._t : VIDEO_LEN();
      const vis = i === cur || (i === cur - 1 && t < PANELS[cur]._t + PANELS[cur].fade);
      if (!vis) { p._el.style.opacity = 0; (p.layers || []).forEach(L => L._el.style.opacity = 0); return; }
      const span = Math.max(.1, end - p._t + (p.fade || 0)), u = clamp01((t - p._t) / span), e = p.ease === 'linear' ? u : ease(u);
      const m = p.move || {}, L = (r, d) => r ? r[0] + (r[1] - r[0]) * e : d;
      const z = L(m.zoom, 1.06), x = L(m.x, 0) + Math.sin(t * 61) * sh * 40, y = L(m.y, 0) + Math.cos(t * 47) * sh * 40;
      const op = i === cur ? (p.fade ? clamp01((t - p._t) / p.fade) : 1) : 1;
      let f = '';
      if (p.fx === 'flicker') f = `brightness(${1 + .12 * Math.sin(t * 23) * Math.sin(t * 7.3)})`;
      if (p.fx === 'pulse') f = `brightness(${1 + .08 * Math.sin(t * 4)})`;
      if (p.fx === 'dark') f = `brightness(${1 - .35 * ease(u)})`;
      p._el.style.opacity = op; p._el.style.zIndex = i === cur ? 10 : 5; p._el.style.filter = f;
      p._el.style.transform = `translate(${x}px,${y}px) scale(${z})`;
      // depth layers: sprites in front of the background that move MORE than it (parallax), bob, and can slide in
      (p.layers || []).forEach(L => {
        // s:[x,y] + w = sprite centre/width on screen when the shot starts; afterwards it drifts d× as much as the background (parallax)
        const d = L.depth || 1.6, ox = (p.origin || [50, 45])[0] / 100 * 1080, oy = (p.origin || [50, 45])[1] / 100 * 1920;
        const z0 = m.zoom ? m.zoom[0] : 1.06, x0 = m.x ? m.x[0] : 0, y0 = m.y ? m.y[0] : 0, rz = z / z0;
        const w = L.w || 600, cx = L.s ? L.s[0] : 540, cy = L.s ? L.s[1] : 1100, lz = Math.pow(rz, 1 + (d - 1) * .5);
        const px = cx + (cx - ox) * (rz - 1) * d + (x - x0) * d, py = cy + (cy - oy) * (rz - 1) * d + (y - y0) * d;
        const bob = (L.bob || 0) * Math.sin((t - p._t) * (L.bobSpeed || 2.2));
        const inU = L.in ? easeOut(clamp01((t - K.T(L.in[0])) / (L.in[2] || .5))) : 1, slide = L.in ? (1 - inU) * L.in[1] : 0;
        L._el.style.width = w * lz + 'px'; L._el.style.zIndex = i === cur ? 11 : 6; L._el.style.opacity = op * (L.in ? clamp01(inU * 3) : 1); L._el.style.filter = (f ? f + ' ' : '') + 'drop-shadow(0 18px 24px rgba(0,0,0,.45))';
        L._el.style.transform = `translate(${px - w * lz / 2 + slide}px,${py - L._el.naturalHeight / L._el.naturalWidth * w * lz / 2 + bob}px)${L.flip ? ' scaleX(-1)' : ''}`;
      });
    });
  }
  const VIDEO_LEN = () => window.VIDEO_LENGTH || 1e9;
  // falling paper in front of a panel (pure function of t): panel.parts = { n: 26, speed: 1, size: 1 }
  let PARTS = null;
  function updateParts(t, p) {
    if (!PARTS) { PARTS = document.createElement('div'); PARTS.style.cssText = 'position:absolute;inset:0;z-index:20'; $('panels').appendChild(PARTS);
      for (let i = 0; i < 40; i++) { const d = document.createElement('div'); d.className = 'pt'; PARTS.appendChild(d); } }
    const cfg = p && p.parts; PARTS.style.display = cfg ? 'block' : 'none'; if (!cfg) return;
    const n = cfg.n || 26, sp = cfg.speed || 1, sz = cfg.size || 1;
    [...PARTS.children].forEach((d, i) => { if (i >= n) { d.style.display = 'none'; return; } d.style.display = 'block';
      const r1 = (Math.sin(i * 12.9898) * 43758.5453) % 1, r2 = (Math.sin(i * 78.233) * 12345.678) % 1, a = Math.abs(r1), b = Math.abs(r2);
      const depth = .5 + b * 1.1, fall = (t * 260 * sp * depth + a * 2400) % 2300 - 200;
      const x = a * 1080 + Math.sin(t * (1 + b) + i) * 60, rot = t * (90 + 140 * b) * (i % 2 ? 1 : -1) + i * 37;
      d.style.transform = `translate(${x}px,${fall}px) rotate(${rot}deg) rotateX(${rot * 1.7}deg) scale(${sz * depth})`;
      d.style.opacity = .9; d.style.filter = depth < .8 ? 'blur(2px)' : ''; });
  }

  // ---------------- start: called after scene.js defines window.SCENE ----------------
  K.BRAND = '@coonknows';   // TikTok / socials handle shown as watermark + on the end card
  K.start = function () {
    SC = window.SCENE; if (!SC) throw new Error('scene.js must set window.SCENE');
    SC.build && SC.build(K);
    SHOTS = (SC.shots || []).map(s => ({ t: K.T(s[0]), p: new THREE.Vector3(...s[1]), q: new THREE.Vector3(...s[2]), d: s[3] || 1 })).sort((a, b) => a.t - b.t);
    if (!SHOTS.length) SHOTS.push({ t: 0, p: new THREE.Vector3(0, 3, 12), q: new THREE.Vector3(0, 2, 0), d: 1 });
    SC._no3d = !!SC.panels && !SC.build;   // pure image-panel video: skip the WebGL render
    (SC.cards || []).forEach(o => K.card(o));
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
    const loads = (SC.panels || []).map(p => { p._t = K.T(p.at); if (p.fade === undefined) p.fade = .25;
      const el = p._el = document.createElement('img'); el.className = 'panel'; el.style.transformOrigin = (p.origin || [50, 45]).map(v => v + '%').join(' ');
      $('panels').appendChild(el); PANELS.push(p);
      const layerLoads = (p.layers || []).map(L => { const le = L._el = document.createElement('img'); le.className = 'layer'; $('panels').appendChild(le);
        return new Promise((res, rej) => { le.onload = res; le.onerror = () => rej(new Error('missing image ' + L.img)); le.src = '../videos/' + new URLSearchParams(location.search).get('v') + '/' + L.img; }); });
      return new Promise((res, rej) => { el.onload = res; el.onerror = () => rej(new Error('missing image ' + p.img)); el.src = '../videos/' + new URLSearchParams(location.search).get('v') + '/' + p.img; }).then(() => Promise.all(layerLoads)); });
    PANELS.sort((a, b) => a._t - b._t);
    // sound effects: sfx: [['cue+0.2', 'cash', 0.8], ...]; autoWhoosh: true adds a whoosh at every panel change. Read by tools/render.js.
    const SFX = (SC.sfx || []).map(([at, name, vol]) => [+K.T(at).toFixed(3), name, vol === undefined ? 1 : vol]);
    if (SC.autoWhoosh) PANELS.forEach((p, i) => { if (i > 0) SFX.push([+Math.max(0, p._t - .25).toFixed(3), 'whoosh', SC.autoWhoosh === true ? .55 : SC.autoWhoosh]); });
    window.SFX_LIST = SFX;
    Promise.all(loads).then(() => { window.ready = true; }, e => { window.loadError = String(e); });
  };
})();
