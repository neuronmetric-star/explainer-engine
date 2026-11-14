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

  // ---------------- renderer + look ----------------
  const canvas = document.getElementById('c');
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
  renderer.setPixelRatio(1); renderer.setSize(W, H, false);
  renderer.outputEncoding = THREE.sRGBEncoding;
  const scene = K.scene = new THREE.Scene(); scene.background = new THREE.Color(0x000000);
  scene.fog = new THREE.Fog(0x000000, 26, 70);
  const camera = K.camera = new THREE.PerspectiveCamera(50, W / H, .1, 400);
  scene.add(new THREE.AmbientLight(0xffffff, .35));
  const key = new THREE.DirectionalLight(0xffffff, .9); key.position.set(5, 10, 8); scene.add(key);
  const composer = new THREE.EffectComposer(renderer);
  composer.addPass(new THREE.RenderPass(scene, camera));
  composer.addPass(new THREE.UnrealBloomPass(new THREE.Vector2(W / 2, H / 2), 1.15, .4, .52));

  // reflective floor + dimmer + guide lines + dust
  const FLOOR_W = 600;
  const refl = new THREE.Reflector(new THREE.PlaneGeometry(FLOOR_W, 80), { textureWidth: 540, textureHeight: 960, color: 0x8a8a8a });
  refl.rotation.x = -Math.PI / 2; refl.position.set(200, 0, 0); scene.add(refl);
  const dim = new THREE.Mesh(new THREE.PlaneGeometry(FLOOR_W, 80), new THREE.MeshBasicMaterial({ color: 0, transparent: true, opacity: .74 }));
  dim.rotation.x = -Math.PI / 2; dim.position.set(200, .005, 0); scene.add(dim);
  const origBR = refl.onBeforeRender;
  refl.onBeforeRender = function () { dim.visible = false; origBR.apply(this, arguments); dim.visible = true; };
  { const g = new THREE.BufferGeometry(); const p = []; for (let i = -2; i <= 2; i++) p.push(-100, .01, i * 6, 500, .01, i * 6);
    g.setAttribute('position', new THREE.Float32BufferAttribute(p, 3)); scene.add(new THREE.LineSegments(g, new THREE.LineBasicMaterial({ color: 0x2a2a2a }))); }
  { const n = 2400, p = new Float32Array(n * 3); for (let i = 0; i < n; i++) { p[i * 3] = -40 + Math.random() * 480; p[i * 3 + 1] = Math.random() * 16; p[i * 3 + 2] = -16 + Math.random() * 24; }
    const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.BufferAttribute(p, 3));
    scene.add(new THREE.Points(g, new THREE.PointsMaterial({ color: 0xffd27a, size: .05, transparent: true, opacity: .55 }))); }

  // ---------------- builders ----------------
  K.GOLD = 0xffc548; K.RED = 0xff3a2c; K.WHITE = 0xffffff; K.BLUE = 0xbfd7ff; K.GREEN = 0x9dffb9; K.SILVER = 0xdedede;
  const lineMats = {};
  function lm(c) { if (!lineMats[c]) { const m = new THREE.LineMaterial({ color: c, linewidth: 3.2 }); m.resolution.set(W, H); lineMats[c] = m; } return lineMats[c]; }
  // wire(geometry, color, parent): glowing edge outline over a near-black body
  K.wire = function (geo, color = K.GOLD, parent) {
    const g = new THREE.Group();
    const m = new THREE.Mesh(geo, new THREE.MeshBasicMaterial({ color: 0x020100, polygonOffset: true, polygonOffsetFactor: 1, polygonOffsetUnits: 1 }));
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
  K.ring = (r, x, z, color = K.GOLD) => { const g = new THREE.Mesh(new THREE.RingGeometry(r, r + .06, 64), new THREE.MeshBasicMaterial({ color, side: THREE.DoubleSide })); g.rotation.x = -Math.PI / 2; g.position.set(x, .02, z); scene.add(g); return g; };
  // tube line through points — charts, paths, money flows. Animate with K.drawTube(t, 0..1)
  K.tube = (pts, color = 0xffd15a, r = .07, parent) => { const curve = new THREE.CatmullRomCurve3(pts.map(p => new THREE.Vector3(...p)), false, 'catmullrom', .1);
    const geo = new THREE.TubeGeometry(curve, Math.max(60, pts.length * 10), r, 6, false); const m = new THREE.Mesh(geo, new THREE.MeshBasicMaterial({ color })); (parent || scene).add(m); m.userData.n = geo.index.count; return m; };
  K.drawTube = (m, f) => { m.geometry.setDrawRange(0, Math.floor(clamp01(f) * m.userData.n / 6) * 6); m.visible = f > .005; };
  // faceless presenter figure (tie=true -> the "rich"/host character)
  const figMat = new THREE.MeshStandardMaterial({ color: 0xcfcfcf, emissive: 0x151515, roughness: .5, metalness: .05 });
  const tieMat = new THREE.MeshStandardMaterial({ color: 0xffc548, emissive: 0xb07a10, roughness: .3 });
  K.person = function (x, z, opts = {}) {
    const s = (opts.scale || 1) * .82, g = K.group(x, 0, z); g.scale.setScalar(s);
    const mat = opts.color ? new THREE.MeshStandardMaterial({ color: opts.color, emissive: 0x111111, roughness: .5 }) : figMat;
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
  ui.insertAdjacentHTML('beforeend', `
    <div id="cards"></div>
    <div id="steps" style="opacity:0"><div class="t"></div><div class="row"></div><div class="labs"></div></div>
    <div id="receipt" style="opacity:0"></div>
    <div id="ftitle" style="opacity:0"></div><div id="follow" style="opacity:0">+ FOLLOW</div>
    <svg id="cursor" viewBox="0 0 24 24" style="opacity:0"><path d="M3 2l17 9-7 2-3 7z" fill="#fff" stroke="#000" stroke-width="1.2"/></svg>
    <div id="cap"></div><div id="flash"></div>`);
  const cardsEl = $('cards'), cap = $('cap'), flash = $('flash');

  // ---------------- photo layers (still images animated in code) ----------------
  // L = K.photo('images/x.png', {slices: 12}) ; in update(): L.set({op, s, x, y, r, f, glitch}, t)
  //   op opacity, s scale (1 = cover the frame), x/y offset px, r rotation deg, f CSS filter, glitch 0..1 (tears slices)
  //   L.glow(xPct, yPct, sizePx, color) -> overlay light that moves with the photo; set .style.opacity yourself
  const SLUG = K.slug = new URLSearchParams(location.search).get('v');
  const photoRoot = document.createElement('div'); photoRoot.id = 'photos'; ui.insertBefore(photoRoot, ui.firstChild);
  const LOADS = []; K.photos = [];
  const hash = (a, b) => { const x = Math.sin(a * 127.1 + b * 311.7) * 43758.5453; return x - Math.floor(x); }; K.hash = hash;
  K.photo = function (src, opts = {}) {
    const el = document.createElement('div'); el.className = 'ph'; el.style.opacity = 0;
    const wrap = document.createElement('div'); wrap.className = 'pw'; el.appendChild(wrap);
    const url = '../videos/' + SLUG + '/' + src;
    const im = new Image(); im.src = url; wrap.appendChild(im);
    const L = { el, wrap, im, slices: [], glows: [] };
    const n = opts.slices || 0;
    for (let i = 0; i < n; i++) { const d = document.createElement('div'); d.className = 'slc'; const c = new Image(); c.src = url; d.appendChild(c);
      d.style.clipPath = `inset(${(i * 100 / n).toFixed(2)}% 0 ${(100 - (i + 1) * 100 / n).toFixed(2)}% 0)`; d.style.display = 'none'; wrap.appendChild(d); L.slices.push(d); }
    LOADS.push(im.decode().then(() => { const k = Math.max(W / im.naturalWidth, H / im.naturalHeight);
      wrap.style.width = im.naturalWidth * k + 'px'; wrap.style.height = im.naturalHeight * k + 'px'; }).catch(() => { throw new Error('missing image ' + src); }));
    L.glow = (xp, yp, size, color) => { const g = document.createElement('div'); g.className = 'glow';
      g.style.cssText = `left:${xp}%;top:${yp}%;width:${size}px;height:${size}px;background:radial-gradient(circle,${color} 0%,transparent 65%);opacity:0`; wrap.appendChild(g); L.glows.push(g); return g; };
    L.set = function (o, t = 0) {
      const op = o.op === undefined ? 1 : o.op; el.style.opacity = op; el.style.display = op <= 0.001 ? 'none' : 'block'; if (op <= 0.001) return;
      wrap.style.transform = `translate(-50%,-50%) translate(${o.x || 0}px,${o.y || 0}px) scale(${o.s || 1}) rotate(${o.r || 0}deg)`;
      wrap.style.filter = o.f || 'none';
      const gl = o.glitch || 0, fr = Math.floor(t * 24);
      L.slices.forEach((d, i) => { const on = gl > .04 && hash(i, fr) < .25 + gl * .6; d.style.display = on ? 'block' : 'none';
        if (on) { d.style.transform = `translateX(${((hash(i + 9, fr) - .5) * 220 * gl).toFixed(1)}px)`; d.style.filter = hash(i + 3, fr) < .5 ? 'hue-rotate(90deg) saturate(2)' : 'brightness(1.6)'; } });
    };
    photoRoot.appendChild(el); K.photos.push(L); return L;
  };
  // full-frame overlays: TV static and a colored wash
  const noise = document.createElement('canvas'); noise.id = 'noise'; noise.width = 180; noise.height = 320; ui.insertBefore(noise, $('cards'));
  const nctx = noise.getContext('2d'), nimg = nctx.createImageData(180, 320);
  K.noise = function (amount, t) { noise.style.opacity = amount; if (amount <= 0) return; const fr = Math.floor(t * 30);
    for (let i = 0; i < nimg.data.length; i += 4) { const v = hash(i * .013, fr) * 255; nimg.data[i] = nimg.data[i + 1] = nimg.data[i + 2] = v; nimg.data[i + 3] = 255; }
    nctx.putImageData(nimg, 0, 0); };
  const wash = document.createElement('div'); wash.id = 'wash'; ui.insertBefore(wash, $('cards'));
  K.wash = function (color, amount) { wash.style.background = color; wash.style.opacity = amount; };
  const CARDS = [];
  // o.s = [screenX, screenY] (px) instead of a: pins the card on screen (for cards over photos)
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
  K.shakeAmp = t => SC ? shakeAmp(t) : 0;
  const flashAmp = t => { let a = 0; for (const [s, d, amp] of SC._flashes) if (t > s && t < s + d) a = Math.max(a, (1 - (t - s) / d) * amp); return a; };
  function frame(dt, doRender) {
    time += dt; const t = time;
    SC.update && SC.update(t, K);
    cameraAt(t, SC.distance || 1.5);
    const sh = shakeAmp(t);
    camera.position.copy(camPos).add(new THREE.Vector3(Math.sin(t * 61) * sh, Math.cos(t * 47) * sh, 0));
    camera.lookAt(camTgt); camera.updateMatrixWorld();
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
    flash.style.opacity = flashAmp(t);
    if (doRender && !(SC.covered && SC.covered(t))) composer.render();
  }

  // ---------------- start: called after scene.js defines window.SCENE ----------------
  K.start = function () {
    SC = window.SCENE; if (!SC) throw new Error('scene.js must set window.SCENE');
    SC.build && SC.build(K);
    SHOTS = (SC.shots || []).map(s => ({ t: K.T(s[0]), p: new THREE.Vector3(...s[1]), q: new THREE.Vector3(...s[2]), d: s[3] || 1 })).sort((a, b) => a.t - b.t);
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
    // sound effects: [[cue, name, volume]] -> window.SFX for tools/render.js (files in engine/sfx/<name>.wav)
    window.SFX = (SC.sfx || []).map(([c, name, vol]) => ({ t: K.T(c), name, vol: vol === undefined ? .5 : vol }));
    window.step = (n, dt) => { for (let i = 0; i < n; i++) frame(dt, i === n - 1); };
    Promise.all(LOADS).then(() => { window.ready = true; }, e => { window.loadError = String(e); });
  };
})();
