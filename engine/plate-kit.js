// =====================================================================
//  PLATE KIT: production engine for the current format
//  2D ChatGPT paintings (plates) + green-screen props + silent 3D cast + camera + captions + CTA.
//  A scene (videos/<slug>/scene.js) sets window.SCENE; this file exposes window.PK.
//  Everything is a pure function of time t, so renders are frame-exact.
// =====================================================================
(function () {
  let _s = 777; Math.random = function () { _s |= 0; _s = _s + 0x6D2B79F5 | 0; let t = Math.imul(_s ^ _s >>> 15, 1 | _s); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; };
  const K = window.PK = {};
  const W = 1080, H = 1920; K.W = W; K.H = H;
  const DATA = window.VIDEO_DATA; if (!DATA) throw new Error('VIDEO_DATA missing: run tools/estimate.js, align.js or tts.js');
  const SLUG = new URLSearchParams(location.search).get('v'), ART = '../videos/' + SLUG + '/art/';

  // ---------------- timing (same rules as the legacy kit) ----------------
  const TOK = ScriptParser.parse(DATA.script), WORDS = DATA.words, CUES = {}, CAPS = [];
  (function () { let wi = 0; const pend = [];
    for (const tk of TOK) { if (tk.cue) { pend.push(tk.cue); continue; }
      const w0 = WORDS[Math.min(wi, WORDS.length - 1)], w1 = WORDS[Math.min(wi + tk.n - 1, WORDS.length - 1)];
      pend.forEach(c => CUES[c] = w0.start); pend.length = 0; CAPS.push({ t: w0.start, end: w1.end, txt: tk.disp, cls: tk.cls }); wi += tk.n; }
    pend.forEach(c => CUES[c] = DATA.audioLength); })();
  K.cues = CUES;
  K.at = c => { if (!(c in CUES)) throw new Error('Unknown cue [#' + c + ']'); return CUES[c]; };
  K.T = x => { if (typeof x === 'number') return x; const m = /^([\w-]+)([+-][\d.]+)?$/.exec(x); return K.at(m[1]) + (m[2] ? parseFloat(m[2]) : 0); };
  K.clamp01 = x => Math.max(0, Math.min(1, x));
  K.ease = x => { x = K.clamp01(x); return x * x * (3 - 2 * x); };
  K.easeOut = x => { x = K.clamp01(x); return 1 - Math.pow(1 - x, 3); };
  K.pop = x => { if (x <= 0) return 0; if (x >= 1) return 1; const c = 1.70158; return 1 + (c + 1) * Math.pow(x - 1, 3) + c * Math.pow(x - 1, 2); };
  K.prog = (t, from, dur) => K.clamp01((t - K.T(from)) / dur);
  K.lerp = (a, b, u) => a + (b - a) * u;

  // ---------------- renderer ----------------
  const renderer = new THREE.WebGLRenderer({ canvas: document.getElementById('c'), antialias: true });
  renderer.setPixelRatio(1); renderer.setSize(W, H, false); renderer.autoClear = false;
  renderer.outputEncoding = THREE.sRGBEncoding; renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.shadowMap.enabled = true; renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  const env = new THREE.PMREMGenerator(renderer).fromScene(new THREE.RoomEnvironment(), .04).texture;
  const lin = c => new THREE.Color(c).convertSRGBToLinear();
  const loader = new THREE.TextureLoader();
  const loadTex = (file, srgb) => new Promise((res, rej) => loader.load(ART + file, t => { if (srgb) t.encoding = THREE.sRGBEncoding; t.anisotropy = 8; res(t); }, undefined, () => rej(new Error('missing art ' + file))));

  // plate layer
  const bgScene = new THREE.Scene(), bgCam = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
  const bgMat = new THREE.MeshBasicMaterial({ toneMapped: false, depthTest: false, depthWrite: false });
  bgScene.add(new THREE.Mesh(new THREE.PlaneGeometry(2, 2), bgMat));
  // prop layers (screen pixels, y down)
  const propCam = new THREE.OrthographicCamera(0, W, 0, -H, -10, 10);
  const propBack = new THREE.Scene(), propFront = new THREE.Scene();
  const keyVS = 'varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix*modelViewMatrix*vec4(position,1.); }';
  const keyFS = `varying vec2 vUv; uniform sampler2D map; uniform float opacity; uniform float keyed;
    void main(){ vec4 c = texture2D(map, vUv); float g = (c.g - max(c.r, c.b)) * keyed;
      float a = c.a * (1.0 - smoothstep(0.16, 0.42, g)) * opacity;
      c.g = mix(c.g, max(c.r, c.b), smoothstep(0.10, 0.42, g));
      if (a < 0.004) discard; gl_FragColor = vec4(c.rgb, a); }`;
  // 3D layer
  const scene = new THREE.Scene(), camera = new THREE.PerspectiveCamera(55, W / H, .1, 500);
  camera.rotation.order = 'YXZ';
  const catcher = new THREE.Mesh(new THREE.PlaneGeometry(300, 300).rotateX(-Math.PI / 2), new THREE.ShadowMaterial({ opacity: .42 }));
  catcher.receiveShadow = true; scene.add(catcher);
  const key = new THREE.DirectionalLight(0xffffff, 2.6); key.castShadow = true; key.shadow.mapSize.set(2048, 2048); key.shadow.bias = -.0004; key.shadow.normalBias = .02;
  Object.assign(key.shadow.camera, { left: -16, right: 16, top: 16, bottom: -16, near: 1, far: 90 }); key.shadow.radius = 3;
  const hemi = new THREE.HemisphereLight(0xffffff, 0xffffff, .6), front = new THREE.DirectionalLight(0xffffff, 1);
  front.position.set(3, 4, 12); scene.add(key, key.target, hemi, front);
  const LIGHTS = {
    day: { key: [0xffc888, 2.7, [-12, 7, -6]], hemi: [0xc8b8ff, 0xe8a070, .7], front: [0xffe6d6, 1.1], shadow: [0x4a2a6a, .40] },
    night: { key: [0x9aaeff, 1.1, [-12, 9, -6]], hemi: [0x6878d8, 0x403058, .9], front: [0x8a90ff, .8], shadow: [0x0a0a30, .50] },
    interior: { key: [0xffc888, 2.2, [-12, 5, 2]], hemi: [0xd0c8ff, 0xc09070, .8], front: [0xffe6d6, 1.0], shadow: [0x3a2a4a, .38] },
  };
  function setLight(n) { const L = typeof n === 'object' ? n : (LIGHTS[n] || LIGHTS.day);
    key.color.copy(lin(L.key[0])); key.intensity = L.key[1]; key.position.set(...L.key[2]);
    hemi.color.copy(lin(L.hemi[0])); hemi.groundColor.copy(lin(L.hemi[1])); hemi.intensity = L.hemi[2];
    front.color.copy(lin(L.front[0])); front.intensity = L.front[1];
    catcher.material.color.copy(lin(L.shadow[0])); catcher.material.opacity = L.shadow[1]; }

  // ---------------- plates: camera matched to the painting ----------------
  // plate preset: { img, hz (horizon, fraction from top), vx (vanishing x), fov0, camH, light }
  let SC, PLATES = {}, cur = null;
  function usePlate(name, zoom, fx, fy, sx, sy) {
    const P = PLATES[name]; if (!P) throw new Error('unknown plate ' + name); setLight(P.light);
    const tex = P.tex, FH = H * zoom, FW = FH * tex.image.width / tex.image.height;
    const ox = Math.max(0, Math.min(FW - W, fx * FW - W / 2)) + sx, oy = Math.max(0, Math.min(FH - H, fy * FH - H / 2)) + sy;
    camera.fov = P.fov0; camera.aspect = FW / FH; camera.setViewOffset(FW, FH, ox, oy, W, H); camera.updateProjectionMatrix();
    const tH = Math.tan(THREE.MathUtils.degToRad(P.fov0 / 2));
    camera.position.set(0, P.camH, 0);
    camera.rotation.x = -Math.atan((.5 - P.hz) * 2 * tH); camera.rotation.y = -Math.atan((P.vx - .5) * 2 * tH * FW / FH);
    camera.updateMatrixWorld();
    bgMat.map = tex; tex.repeat.set(W / FW, H / FH); tex.offset.set(ox / FW, 1 - (oy + H) / FH); bgMat.needsUpdate = true;
    cur = { name, FW, FH, ox, oy, iw: tex.image.width, ih: tex.image.height };
  }
  // painting pixel (image coords) -> screen pixel, and image px -> screen px scale
  K.img = (ix, iy) => ({ x: ix / cur.iw * cur.FW - cur.ox, y: iy / cur.ih * cur.FH - cur.oy });
  K.imgScale = () => cur.FH / cur.ih;
  // painting pixel on the painted floor -> world [x, z] on the floor plane y=0 (raycast through the matched camera).
  // Use it to plant feet exactly where the painting has floor.
  const rc = new THREE.Raycaster(), floorPlane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0), hit = new THREE.Vector3();
  K.floorAt = (ix, iy) => { const p = K.img(ix, iy); rc.setFromCamera({ x: p.x / W * 2 - 1, y: -(p.y / H * 2 - 1) }, camera);
    if (!rc.ray.intersectPlane(floorPlane, hit)) throw new Error('floorAt: point is above the horizon ' + ix + ',' + iy); return [hit.x, hit.z]; };
  K.placeAt = (n, ix, iy, ry = 0, scale = 1) => { const [x, z] = K.floorAt(ix, iy); return K.place(n, x, 0, z, ry, scale); };
  const pv = new THREE.Vector3();
  K.screenOf = obj => { obj.getWorldPosition(pv); pv.project(camera); return { x: (pv.x * .5 + .5) * W, y: (-pv.y * .5 + .5) * H }; };
  K.worldToScreen = (x, y, z) => { pv.set(x, y, z).project(camera); return { x: (pv.x * .5 + .5) * W, y: (-pv.y * .5 + .5) * H }; };

  // ---------------- props (green-screen sprites) ----------------
  const PROPS = {}, POOL = [];
  function sprite() { const m = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), new THREE.ShaderMaterial({ uniforms: { map: { value: null }, opacity: { value: 1 }, keyed: { value: 1 } }, vertexShader: keyVS, fragmentShader: keyFS, transparent: true, depthTest: false, depthWrite: false })); m.visible = false; POOL.push(m); return m; }
  let poolI = 0;
  // K.prop('P01', {x, y, w, rot, a, layer:'front'|'back', anchor:[ax,ay] (0..1 of the image), flip}): draw one sprite this frame
  K.prop = function (k, o) { const P = PROPS[k]; if (!P) throw new Error('unknown prop ' + k);
    const m = POOL[poolI] || sprite(); poolI++;
    const w = o.w, h = w * P.ih / P.iw, ax = o.anchor ? o.anchor[0] : .5, ay = o.anchor ? o.anchor[1] : .5;
    m.material.uniforms.map.value = P.tex; m.material.uniforms.keyed.value = P.cut ? 0 : 1; m.material.uniforms.opacity.value = o.a === undefined ? 1 : o.a;
    m.scale.set(o.flip ? -w : w, h, 1); m.rotation.z = -(o.rot || 0);
    // anchor: rotate around the anchor point
    const dx = (.5 - ax) * w, dy = (ay - .5) * h, c = Math.cos(-(o.rot || 0)), s = Math.sin(-(o.rot || 0));
    m.position.set(o.x + dx * c - dy * s, -(o.y) + dx * s + dy * c, 0);
    (o.layer === 'back' ? propBack : propFront).add(m); m.visible = true; return m; };
  K.propInfo = k => PROPS[k];
  // soft puff texture for exhaust (generated)
  function puffTex() { const c = document.createElement('canvas'); c.width = c.height = 128; const g = c.getContext('2d');
    const gr = g.createRadialGradient(64, 64, 6, 64, 64, 62); gr.addColorStop(0, 'rgba(235,232,240,.95)'); gr.addColorStop(.6, 'rgba(215,210,228,.6)'); gr.addColorStop(1, 'rgba(200,196,220,0)');
    g.fillStyle = gr; g.fillRect(0, 0, 128, 128); return new THREE.CanvasTexture(c); }
  // exhaust puffs from a screen point, drifting backward (dir -1 = left); size 0..1 shrinks them
  K.puffs = function (t, x, y, size, dir = -1, rate = 5) {
    if (size <= .02) return; for (let i = 0; i < 6; i++) { const ph = ((t * rate / 6 + i / 6) % 1);
      K.prop('puff', { x: x + dir * ph * 160 * size, y: y - ph * 70 * size, w: (40 + ph * 120) * size, a: (1 - ph) * .85 }); } };

  // ---------------- cast ----------------
  const blobTex = (() => { const c = document.createElement('canvas'); c.width = c.height = 128; const g = c.getContext('2d'); const gr = g.createRadialGradient(64, 64, 4, 64, 64, 62);
    gr.addColorStop(0, 'rgba(0,0,0,.55)'); gr.addColorStop(1, 'rgba(0,0,0,0)'); g.fillStyle = gr; g.fillRect(0, 0, 128, 128); return new THREE.CanvasTexture(c); })();
  K.cast = {};
  // cast entry: 'hoodie' | {outfit:'president', phone:true} | 'robodog'
  function makeCast(def) { for (const [n, spec] of Object.entries(def)) {
    const o = typeof spec === 'string' ? { outfit: spec } : spec;
    const ch = o.outfit === 'robodog' ? CHAR.robodog(Object.assign({ envMap: env }, o)) : CHAR.make(Object.assign({ envMap: env }, o)); scene.add(ch.root);
    const b = new THREE.Mesh(new THREE.PlaneGeometry(1.1, .8).rotateX(-Math.PI / 2), new THREE.MeshBasicMaterial({ map: blobTex, transparent: true, depthWrite: false })); b.position.y = .01; ch.root.add(b); ch.blob = b;
    ch.root.traverse(o => { if (o.material) [].concat(o.material).forEach(m => { if (m.__lin) return; m.__lin = 1; if (m.color) m.color.convertSRGBToLinear(); }); });
    K.cast[n] = ch; } }
  K.place = (n, x, y, z, ry = 0, scale = 1) => { const c = K.cast[n]; c.root.position.set(x, y, z); c.root.rotation.y = ry; c.root.scale.setScalar(scale); c.root.visible = true; return c; };

  // ---------------- DOM overlays ----------------
  const $ = id => document.getElementById(id);
  const cap = $('cap'), flash = $('flash'), fol = $('follow'), cur_ = $('cursor');

  // ---------------- frame ----------------
  let time = 0, SHOTS = [];
  const amp = (arr, t) => { let a = 0; for (const [s, d, m] of arr) if (t > s && t < s + d) a = Math.max(a, (1 - (t - s) / d) * m); return a; };
  function frame(dt, doRender) {
    time += dt; const t = time;
    Object.values(K.cast).forEach(c => c.root.visible = false); POOL.forEach(m => { m.visible = false; if (m.parent) m.parent.remove(m); }); poolI = 0;
    let i = 0; for (let k = 0; k < SHOTS.length; k++) if (t >= SHOTS[k].t) i = k;
    const sh = SHOTS[i], end = SHOTS[i + 1] ? SHOTS[i + 1].t : window.VIDEO_LENGTH, u = K.ease((t - sh.t) / Math.max(.01, end - sh.t));
    const z = K.lerp(sh.zoom[0], sh.zoom[1], u), fx = K.lerp(sh.focus[0][0], sh.focus[1][0], u), fy = K.lerp(sh.focus[0][1], sh.focus[1][1], u);
    const sk = amp(SC._shakes, t) * 18;
    usePlate(sh.plate, z, fx, fy, Math.sin(t * 61) * sk, Math.cos(t * 47) * sk);
    K.shot = { i, id: sh.id, u, t0: sh.t, t1: end, local: t - sh.t };
    SC.update && SC.update(t, K);
    // captions
    let c = null; for (const x of CAPS) { if (x.t <= t) c = x; else break; }
    if (c && t <= c.end + .45) { if (cap.textContent !== c.txt) cap.textContent = c.txt; cap.className = c.cls; cap.style.transform = `scale(${.85 + .15 * K.clamp01((t - c.t) / .12)})`; cap.style.opacity = 1; } else cap.style.opacity = 0;
    flash.style.opacity = amp(SC._flashes, t);
    // follow CTA
    if (SC.follow) { const ft = t - SC._followAt, on = ft >= 0; fol.style.opacity = on ? 1 : 0;
      if (on) { fol.style.transform = `translateX(-50%) scale(${.6 + .4 * K.pop(K.clamp01(ft / .35))})`; const clicked = ft > 1.5;
        fol.className = clicked ? 'on' : ''; fol.textContent = clicked ? '✓ FOLLOWING' : '+ FOLLOW'; cur_.style.opacity = ft > .45 ? 1 : 0;
        const v = K.easeOut(K.clamp01((ft - .45) / .9)); cur_.style.left = (780 - 170 * v) + 'px'; cur_.style.top = (760 - 150 * v + (clicked && ft < 1.7 ? 6 : 0) + ((SC.follow.top || 560) - 560)) + 'px'; }
      else cur_.style.opacity = 0; }
    if (doRender) { renderer.clear(); renderer.render(bgScene, bgCam); renderer.render(propBack, propCam); renderer.clearDepth(); renderer.render(scene, camera); renderer.render(propFront, propCam); }
  }

  K.start = async function () {
    SC = window.SCENE; if (!SC) throw new Error('scene.js must set window.SCENE');
    await Promise.all(Object.entries(SC.plates).map(async ([n, p]) => { PLATES[n] = Object.assign({ hz: .45, vx: .5, fov0: 55, camH: 1.9, light: 'day' }, p); PLATES[n].tex = await loadTex(p.img, true); }));
    await Promise.all(Object.entries(SC.props || {}).map(async ([n, f]) => { const tex = await loadTex(f, false); PROPS[n] = { tex, iw: tex.image.width, ih: tex.image.height, cut: /\.cut\.png$/.test(f) }; }));
    { const tex = puffTex(); PROPS.puff = { tex, iw: 128, ih: 128 }; }
    makeCast(SC.cast || {});
    SHOTS = SC.shots.map(s => ({ id: s.at, t: K.T(s.at), plate: s.plate, zoom: s.zoom || [1, 1], focus: s.focus || [[.5, .5], [.5, .5]] })).sort((a, b) => a.t - b.t);
    window.VIDEO_LENGTH = DATA.audioLength + (SC.tail || 1.6);
    SC._shakes = (SC.shakes || []).map(([a, d, m]) => [K.T(a), d, m]);
    SC._flashes = (SC.flashes || []).map(([a, d, m]) => [K.T(a), d, m]);
    if (SC.follow) { SC._followAt = K.T(SC.follow.from); if (SC.follow.top) fol.style.top = SC.follow.top + 'px'; }   // follow.top: move the button up/down (px)
    SC.build && SC.build(K);
    window.step = (n, dt) => { for (let k = 0; k < n; k++) frame(dt, k === n - 1); };
    window.ready = true;
  };
})();
