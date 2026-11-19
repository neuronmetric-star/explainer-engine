// basketball-misses: Brian's script. 3D Doug (waits) + Gary (shoots) on Brian's court paintings.
// The ball, racks, net overlays (ball passes BEHIND the front rim + net), scoreboard, shower knob and stat cards are drawn here.
// Every shot is one entry in SHOTS_ (release time + outcome); the ball is simulated as a pure function of t on whatever plate is on screen.
(function () {
  let K;
  const E = x => Math.max(0, Math.min(1, x)), S = x => { x = E(x); return x * x * (3 - 2 * x); };
  const blinkFace = (ch, name, t, off = 0, noBlink) => ch.face(!noBlink && ((t + off) % 4.3) < .12 && name !== 'happy' ? 'blink' : name);
  const G = {};
  const gp = (plate, ix, iy) => { const k = plate + ':' + ix + ':' + iy; return G[k] || (G[k] = K.ground(plate, ix, iy)); };
  const put = (n, plate, ix, iy, ry) => { const g = gp(plate, ix, iy); return K.place(n, g.x, 0, g.z, ry); };

  // ---- hoop geometry per plate (painting px): rim centre, rim half-width, ball diameter at the rim, backboard hit point, floor ----
  const HOOP = {
    '01': { c: [888, 432], rw: 56, bd: 52, bb: [948, 352], fy: 960, toShooter: -1, grow: 0 },
    '04': { c: [888, 432], rw: 56, bd: 52, bb: [948, 352], fy: 960, toShooter: -1, grow: 0 },
    '02': { c: [470, 424], rw: 64, bd: 62, bb: [505, 352], fy: 1010, toShooter: 0, grow: 1 },
    '03': { c: [468, 640], rw: 343, bd: 320, bb: [560, 360], fy: 2600, toShooter: 0, grow: .8 },
  };
  const NET = { '01': 'X01', '04': 'X04', '02': 'X02', '03': 'X03' };
  // where each outcome first touches (relative to the rim centre, in rim half-widths) and how it leaves (rw/s)
  const HIT = { in: [0, -.25], short: [-.25, 2.3], long: null, left: [-.95, -.05], right: [.95, -.05], clank: [-.55, -.15] };
  const OUT = { in: [0, 2.6], short: [.3, 2.5], long: [-1.2, -1.6], left: [-2.6, -3.2], right: [2.6, -3.2], clank: [-2.2, -4.2] };

  let SHOTS_, MADE;                         // filled in build
  const DUR = .82;                          // release -> rim

  // ball position after it touches the rim/board: tiny deterministic physics in painting px (floor bounces)
  function afterHit(P, kind, dt) {
    const h = HOOP[P], rw = h.rw, g = 15 * rw, o = OUT[kind];
    let vx = o[0] * rw * (kind === 'long' && h.toShooter === 0 ? .3 : 1), vy = o[1] * rw;
    const hp = kind === 'long' ? h.bb : [h.c[0] + HIT[kind][0] * rw, h.c[1] + HIT[kind][1] * rw];
    let x = hp[0], y = hp[1], t = 0; const st = 1 / 240;
    while (t < dt) { const s = Math.min(st, dt - t); vy += g * s; x += vx * s; y += vy * s; t += s;
      if (y > h.fy && vy > 0 && kind !== 'in') { y = h.fy; vy *= -.5; vx *= .8; } }
    if (kind === 'in' && y > h.fy) y = h.fy;
    return { x, y, grow: 1 + h.grow * Math.min(1, dt / 1.1) };
  }

  // screen pos + size of a shot's ball at time t on the plate on screen (null = not visible)
  function shotBall(sh, t, P, start) {
    const h = HOOP[P]; if (!h) return null; const u = (t - sh.r) / sh.dur; if (u < 0) return null;
    const k = K.imgScale(), bdS = h.bd * k;
    if (u <= 1) {
      const hp = sh.kind === 'long' ? h.bb : [h.c[0] + HIT[sh.kind][0] * h.rw, h.c[1] + HIT[sh.kind][1] * h.rw];
      const e = K.img(hp[0], hp[1]);
      const s0 = start ? start : P === '03' ? { ...K.img(160, 2000), s: bdS * 1.6 } : { ...K.img(h.c[0] - 900, h.c[1] + 900), s: bdS * 2 };
      const arcH = Math.max(160, Math.hypot(e.x - s0.x, e.y - s0.y) * .45) * (sh.kind === 'short' ? .55 : 1);
      return { x: K.lerp(s0.x, e.x, u), y: K.lerp(s0.y, e.y, u) - 4 * arcH * u * (1 - u), s: K.lerp(s0.s, bdS, u), rot: t * 7, behind: false };
    }
    const dt = t - sh.r - sh.dur; if (dt > (P === '03' ? 2.2 : sh.kind === 'in' ? .7 : sh.kind === 'long' ? 2.0 : 1.0)) return null;
    const p = afterHit(P, sh.kind, dt), q = K.img(p.x, p.y);
    return { x: q.x, y: q.y, s: bdS * p.grow, rot: t * 7, behindNet: sh.kind === 'in' && dt < .5 };
  }

  // ---- arms: hold the ball at the chest / set it above the head / follow-through ----
  function arms(ch, mode, w = 1) {
    for (const s of [-1, 1]) { const A = ch.arm[s];
      const T = mode === 'hold' ? [-1.05, 0, -s * .42, -1.05, 0] : mode === 'set' ? [-2.55, 0, -s * .28, -1.25, 0] : [-2.85, 0, -s * .12, -.15, 0];
      A.sh.rotation.x += (T[0] - A.sh.rotation.x) * w; A.sh.rotation.y += (T[1] - A.sh.rotation.y) * w; A.sh.rotation.z += (T[2] - A.sh.rotation.z) * w;
      A.el.rotation.x += (T[3] - A.el.rotation.x) * w; A.el.rotation.z += (T[4] - A.el.rotation.z) * w; }
  }
  const handsOf = ch => { ch.root.updateMatrixWorld(true); const a = K.screenOf(ch.arm[1].wr), b = K.screenOf(ch.arm[-1].wr); return { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 }; };
  const pxPerM = ch => { const p = ch.root.position, a = K.worldToScreen(p.x, 0, p.z), b = K.worldToScreen(p.x, 1, p.z); return Math.abs(a.y - b.y); };
  // shooter state at t from his release times: mode + whether the ball is in his hands
  function shooter(rel, t) {
    let mode = 'hold', w = 1, ball = true;
    for (const r of rel) {
      if (t >= r - .5 && t < r) { mode = 'set'; w = S((t - (r - .5)) / .3); }
      else if (t >= r && t < r + .45) { mode = 'follow'; w = 1; ball = false; }
      else if (t >= r + .45 && t < r + .75) { mode = 'hold'; w = S((t - r - .45) / .3); ball = t > r + .6; }
    }
    return { mode, w, ball };
  }

  // ---- text canvases (made lazily, after the font has loaded) ----
  const made = {};
  function textProp(key, lines, opt = {}) {
    if (made[key]) return key;
    const c = document.createElement('canvas'), W = opt.w || 900, H = opt.h || 240; c.width = W; c.height = H; const g = c.getContext('2d');
    if (opt.bg) { g.fillStyle = opt.bg; g.beginPath(); g.roundRect(6, 6, W - 12, H - 12, 36); g.fill(); g.lineWidth = 8; g.strokeStyle = opt.border || '#000'; g.stroke(); }
    g.textAlign = 'center'; g.textBaseline = 'middle';
    for (const L of lines) { g.font = `900 ${L.size}px IN, Arial Black, sans-serif`; g.lineJoin = 'round';
      if (L.stroke !== false) { g.lineWidth = L.size * .2; g.strokeStyle = '#000'; g.strokeText(L.txt, L.x || W / 2, L.y); }
      g.fillStyle = L.col || '#fff'; g.fillText(L.txt, L.x || W / 2, L.y); }
    K.addProp(key, c); made[key] = 1; return key;
  }
  function board(t) {
    const tStart = K.T('gary') + .7, tEnd = K.T('buzzer') + .47, secs = Math.max(0, Math.ceil(60 * (1 - E((t - tStart) / (tEnd - tStart)))));
    const g = MADE.filter(x => x <= t).length, clk = '0:' + String(secs).padStart(2, '0');
    const key = textProp(`b_${g}_${secs}`, [
      { txt: 'GARY', size: 54, x: 170, y: 70, col: '#ffd23a' }, { txt: String(g), size: 120, x: 170, y: 168, col: '#fff' },
      { txt: 'DOUG', size: 54, x: 730, y: 70, col: '#9fd3ff' }, { txt: '0', size: 120, x: 730, y: 168, col: '#fff' },
      { txt: clk, size: 96, x: 450, y: 130, col: secs <= 5 ? '#ff4d3d' : '#7dff7a' } ], { w: 900, h: 250, bg: 'rgba(18,22,40,.88)', border: '#000' });
    const a = E((t - K.T('rules') - .4) / .25) * (1 - E((t - K.T('score') + .2) / .3));
    if (a > 0) K.prop(key, { x: 540, y: 205, w: 700 * (.9 + .1 * K.pop(E((t - K.T('rules') - .4) / .3))), a });
  }
  function card(t, at, key, lines, y, opt) {
    const t0 = K.T(at); if (t < t0) return; textProp(key, lines, opt);
    K.prop(key, { x: 540, y, w: (opt && opt.w || 900) * .95 * (.6 + .4 * K.pop(E((t - t0) / .3))) });
  }
  function knob(t) {   // shower knob: cold (left) -> hot (right) -> just right
    if (!made.knob) { const c = document.createElement('canvas'); c.width = c.height = 520; const g = c.getContext('2d');
      g.fillStyle = 'rgba(18,22,40,.9)'; g.beginPath(); g.arc(260, 260, 250, 0, 7); g.fill(); g.lineWidth = 10; g.strokeStyle = '#000'; g.stroke();
      for (let i = 0; i < 60; i++) { const a0 = Math.PI * (1 + i / 60), a1 = Math.PI * (1 + (i + 1.2) / 60); g.strokeStyle = `hsl(${220 - 220 * i / 59},90%,55%)`; g.lineWidth = 46; g.beginPath(); g.arc(260, 260, 190, a0, a1); g.stroke(); }
      g.font = '900 52px IN, sans-serif'; g.textAlign = 'center'; g.lineWidth = 10; g.strokeStyle = '#000';
      for (const [tx, x, col] of [['COLD', 120, '#6fb6ff'], ['HOT', 400, '#ff5a4a']]) { g.strokeText(tx, x, 330); g.fillStyle = col; g.fillText(tx, x, 330); }
      g.fillStyle = '#ddd'; g.beginPath(); g.arc(260, 260, 48, 0, 7); g.fill(); K.addProp('knob', c);
      const n = document.createElement('canvas'); n.width = 60; n.height = 240; const h = n.getContext('2d'); h.fillStyle = '#fff'; h.strokeStyle = '#000'; h.lineWidth = 6;
      h.beginPath(); h.moveTo(30, 6); h.lineTo(52, 220); h.lineTo(8, 220); h.closePath(); h.fill(); h.stroke(); K.addProp('needle', n); made.knob = 1; }
    const a = K.T('cold'), b = K.T('cold') + .7, c2 = K.T('cold') + 1.3;
    const ang = t < b ? K.lerp(0, -1.25, S((t - a + .1) / .3)) : t < c2 ? K.lerp(-1.25, 1.25, S((t - b) / .3)) : K.lerp(1.25, 0, S((t - c2) / .35));
    const pop = K.pop(E((t - K.T('shower')) / .3)); if (pop <= 0) return;
    K.prop('knob', { x: 540, y: 560, w: 440 * pop });
    K.prop('needle', { x: 540, y: 560, w: 44 * pop, rot: ang, anchor: [.5, .92] });
  }

  // rack with n balls left, standing on the ground at painting px (ix, iy)
  function rack(P, ix, iy, n) {
    const g = gp(P, ix, iy), a = K.worldToScreen(g.x, 0, g.z), b = K.worldToScreen(g.x, 1, g.z), m = Math.abs(a.y - b.y);
    const w = 1.45 * m, info = K.propInfo('P02e'), sc = w / info.iw, h = info.ih * sc;
    K.prop('P02e', { x: a.x, y: a.y - h / 2, w, layer: 'back' });
    const C = [[262, 378], [465, 378], [667, 378], [870, 378], [1072, 378], [1275, 378], [262, 642], [465, 642], [667, 642], [870, 642], [1072, 642], [1275, 642]];
    for (let i = 0; i < Math.min(12, n); i++) { const [cx, cy] = C[11 - i]; K.prop('P01', { x: a.x - w / 2 + cx * sc, y: a.y - h + cy * sc, w: 205 * sc * 1.05, rot: i * 1.3, layer: 'back' }); }
  }

  window.SCENE = {
    plates: {
      '01': { img: '01_court_side_day.png', hz: .443, vx: .5, fov0: 55, camH: 2.4, light: 'day' },
      '04': { img: '04_court_dusk.png', hz: .443, vx: .5, fov0: 55, camH: 2.4, light: 'dawn' },
      '02': { img: '02_behind_shooter.png', hz: .386, vx: .5, fov0: 55, camH: 2.4, light: 'day' },
      '03': { img: '03_hoop_closeup.png', hz: .5, vx: .5, fov0: 55, camH: 2.4, light: 'day' },
    },
    props: { P01: 'P01_basketball.png', P02e: 'P02e_rack_empty.png', P03: 'P03_impact_burst.png', X01: 'X01_net.png', X02: 'X02_net.png', X03: 'X03_net.png', X04: 'X04_net.png' },
    cast: { doug: 'hoodie', gary: 'oxford' },
    shots: [
      { at: 'q', plate: '01', zoom: [1.0, 1.08], focus: [[.45, .6], [.42, .6]] },
      { at: 'meet', plate: '01', zoom: [1.45, 1.55], focus: [[.4, .6], [.4, .6]] },
      { at: 'rules', plate: '01', zoom: [1.5, 1.6], focus: [[.8, .32], [.8, .33]] },
      { at: 'rack', plate: '01', zoom: [1.25, 1.35], focus: [[.45, .66], [.45, .66]] },
      { at: 'whoever', plate: '02', zoom: [1.0, 1.12], focus: [[.5, .45], [.5, .4]] },
      { at: 'doug', plate: '01', zoom: [1.8, 1.9], focus: [[.2, .6], [.21, .6]] },
      { at: 'holds', plate: '02', zoom: [1.05, 1.15], focus: [[.5, .55], [.5, .5]] },
      { at: 'perfect', plate: '01', zoom: [2.0, 2.15], focus: [[.23, .6], [.23, .59]] },
      { at: 'stare', plate: '01', zoom: [2.8, 3.0], focus: [[.24, .56], [.24, .56]] },
      { at: 'gary', plate: '01', zoom: [1.8, 1.5], focus: [[.55, .6], [.62, .52]] },
      { at: 'short', plate: '02', zoom: [1.1, 1.15], focus: [[.5, .5], [.5, .5]] },
      { at: 'bet', plate: '01', zoom: [2.0, 2.15], focus: [[.23, .6], [.23, .59]] },
      { at: 'power', plate: '01', zoom: [1.9, 1.6], focus: [[.55, .6], [.62, .52]] },
      { at: 'bang', plate: '03', zoom: [1.0, 1.08], focus: [[.5, .4], [.5, .4]] },
      { at: 'far', plate: '02', zoom: [1.1, 1.0], focus: [[.5, .5], [.5, .52]] },
      { at: 'less', plate: '01', zoom: [1.9, 2.0], focus: [[.55, .6], [.55, .59]] },
      { at: 'shower', plate: '01', zoom: [1.7, 1.75], focus: [[.55, .62], [.55, .62]] },
      { at: 'third', plate: '02', zoom: [1.1, 1.2], focus: [[.5, .5], [.5, .45]] },
      { at: 'swish', plate: '03', zoom: [1.0, 1.04], focus: [[.5, .45], [.5, .47]] },
      { at: 'straight', plate: '03', zoom: [1.12, 1.2], focus: [[.5, .55], [.5, .58]] },
      { at: 'thinking', plate: '01', zoom: [1.05, 1.15], focus: [[.45, .6], [.5, .58]] },
      { at: 'still', plate: '02', zoom: [1.0, 1.05], focus: [[.5, .45], [.5, .45]] },
      { at: 'left', plate: '02', zoom: [1.35, 1.45], focus: [[.5, .3], [.5, .3]] },
      { at: 'change', plate: '01', zoom: [1.9, 2.0], focus: [[.55, .6], [.55, .59]] },
      { at: 'aimright', plate: '02', zoom: [1.25, 1.35], focus: [[.5, .38], [.5, .35]] },
      { at: 'morepower', plate: '02', zoom: [1.25, 1.35], focus: [[.5, .38], [.5, .35]] },
      { at: 'dougstill', plate: '01', zoom: [2.0, 2.15], focus: [[.23, .6], [.23, .59]] },
      { at: 'nothing', plate: '01', zoom: [2.8, 3.0], focus: [[.24, .56], [.24, .56]] },
      { at: 'buzzer', plate: '01', zoom: [1.1, 1.2], focus: [[.42, .6], [.45, .58]] },
      { at: 'clank', plate: '03', zoom: [1.0, 1.06], focus: [[.5, .4], [.5, .4]] },
      { at: 'score', plate: '04', zoom: [1.8, 1.9], focus: [[.55, .5], [.55, .5]] },
      { at: 'doug1', plate: '04', zoom: [1.8, 1.9], focus: [[.23, .5], [.23, .5]] },
      { at: 'final', plate: '04', zoom: [1.2, 1.28], focus: [[.4, .6], [.4, .6]] },
      { at: 'ask', plate: '04', zoom: [1.6, 1.7], focus: [[.35, .6], [.35, .6]] },
      { at: 'answer', plate: '04', zoom: [2.0, 2.15], focus: [[.55, .6], [.55, .59]] },
      { at: 'cta', plate: '04', zoom: [1.0, 1.1], focus: [[.42, .6], [.42, .6]] },
      { at: 'or', plate: '04', zoom: [1.9, 2.0], focus: [[.55, .6], [.55, .6]] },
    ],
    shakes: [['bang+0.05', .3, .45], ['clank+0.05', .35, .55], ['buzzer+0.47', .3, .3]],
    flashes: [],
    tail: 2.4,

    build(k) {
      K = k; const T = c => K.T(c);
      // Gary's shots: [release, outcome]. The hit lands DUR later; story beats are pinned to the words.
      const hitAt = (tHit, kind, dur = DUR) => ({ r: tHit - dur, dur, kind, who: 'gary' });
      const list = [
        hitAt(16.86, 'short'),               // "drops short" (word "short" 16.90)
        hitAt(T('bang') + .05, 'long'),      // "Bang. Off the backboard."
        hitAt(T('swish') + .05, 'in'),       // third ball: "Swish."
        hitAt(38.22, 'left', .62), hitAt(38.85, 'right', .62), hitAt(39.3, 'short', .62),   // "Left. Right. Short."
        hitAt(42.15, 'left', .7), hitAt(43.3, 'in', .7),                                   // "Miss left? Aim a little more to the right."
        hitAt(43.92, 'short', .6), hitAt(45.0, 'in', .7),                                  // "Fall short? Give it a little more power."
      ];
      // filler shots so the minute looks busy (and Gary ends on 12 made): during "thinking" and Doug's close-ups
      const fill = [[34.9, 'in'], [35.8, 'right'], [36.6, 'in'], [37.35, 'clank'], [40.2, 'in'], [41.0, 'left'], [45.9, 'in'], [46.7, 'in'], [47.5, 'in'],
        [48.2, 'in'], [48.9, 'clank'], [41.6, 'in'], [36.0, 'in']];
      for (const [h, kind] of fill) list.push(hitAt(h, kind, .7));
      SHOTS_ = list.sort((a, b) => a.r - b.r);
      // Doug's one shot at the buzzer -> clank (the "Clank." cut to the close-up)
      SHOTS_.push({ r: T('clank') + .05 - 1.0, dur: 1.0, kind: 'clank', who: 'doug' });
      MADE = SHOTS_.filter(s => s.who === 'gary' && s.kind === 'in').map(s => s.r + s.dur);
      window.__BB = { made: MADE.length, shots: SHOTS_.filter(s => s.who === 'gary').length };
    },

    update(t, k) {
      K = k;
      const D = K.cast.doug, Gy = K.cast.gary, id = K.shot.id, L = K.shot.local, at = c => K.T(c);
      const P = window.SCENE.shots.find(s => s.at === id).plate, h = HOOP[P];
      const gRel = SHOTS_.filter(s => s.who === 'gary').map(s => s.r), dRel = SHOTS_.filter(s => s.who === 'doug').map(s => s.r);
      const gSt = shooter(gRel, t), dSt = t < at('doug') + .4 ? { mode: 'hold', w: 1, ball: false } : shooter(dRel, t);
      const balls = [];      // {x,y,s,rot,layer}
      const shooterOnPlate = {};

      if (P === '01' || P === '04') {
        put('doug', P, 250, 1080, .85); put('gary', P, 600, 1050, .95);
        const ending = P === '04';
        // faces + acting
        const df = { q: 'smirk', meet: 'smile', rules: 'smile', rack: 'smile', doug: 'flat', perfect: 'flat', stare: 'surprised', gary: 'flat', bet: 'smirk', thinking: 'flat',
          change: 'worried', dougstill: 'flat', nothing: 'worried', buzzer: 'surprised', score: 'worried', doug1: 'worried', final: 'worried', ask: 'surprised', answer: 'worried', cta: 'flat', or: 'flat' }[id] || 'flat';
        const gf = { q: 'smile', meet: 'happy', rules: 'smile', gary: 'smile', power: 'smirk', less: 'think', shower: 'smirk', thinking: 'smile', change: 'smirk', buzzer: 'happy',
          score: 'happy', made: 'happy', final: 'happy', ask: 'smile', answer: 'smirk', cta: 'happy', or: 'smile' }[id] || 'smile';
        blinkFace(D, df, t, 0, id === 'stare' || id === 'nothing'); blinkFace(Gy, gf === 'think' ? 'flat' : gf, t, 1.3);
        const dLook = ['ask', 'final', 'gary', 'score'].includes(id) ? .55 : id === 'stare' || id === 'nothing' ? .25 : 0;
        D.pose({ t, look: dLook, tilt: id === 'nothing' ? .12 : 0, lean: id === 'stare' ? .06 : 0, nod: id === 'stare' ? -.12 : 0 });
        const gGest = id === 'meet' ? 'wave' : id === 'answer' ? 'shrug' : id === 'cta' ? 'wave' : id === 'final' || id === 'made' ? 'tada' : id === 'less' ? 'think' : null;
        Gy.pose({ t, look: ['ask', 'answer'].includes(id) ? -.6 : 0, nod: id === 'change' ? .15 * Math.sin(t * 6) : 0, lean: id === 'power' ? -.06 : 0, gesture: gGest, gw: gGest ? S(L / .3) : 0 });
        // arms + balls in hands
        if (!gGest) arms(Gy, ending ? 'hold' : gSt.mode, ending ? 1 : gSt.w);
        arms(D, ending ? 'hold' : t < at('doug') + .4 ? 'hold' : dSt.mode, ending ? 1 : dSt.w);
        if (t < at('doug') + .4 && !ending) { D.arm[1].sh.rotation.set(0, 0, .1); D.arm[-1].sh.rotation.set(0, 0, -.1); D.arm[1].el.rotation.set(-.3, 0, 0); D.arm[-1].el.rotation.set(-.3, 0, 0); }
        const mD = pxPerM(D), mG = pxPerM(Gy);
        // Doug picks up his ball from his rack on "Doug picks up a ball"
        const pick = E((t - at('doug') - .25) / .5), dougHas = ending ? true : t >= at('doug') + .4 ? dSt.ball : false;
        if (dougHas) { const p = handsOf(D); balls.push({ x: p.x, y: p.y - (dSt.mode === 'set' ? mD * .1 : 0), s: mD * .34, rot: 0 }); }
        else if (pick > 0 && pick < 1 && !ending) { const p = handsOf(D), r0 = K.worldToScreen(gp(P, 90, 1030).x, .7, gp(P, 90, 1030).z); balls.push({ x: K.lerp(r0.x, p.x, S(pick)), y: K.lerp(r0.y, p.y, S(pick)) - 80 * Math.sin(Math.PI * pick), s: mD * .34, rot: 0 }); }
        const garyHas = ending ? ['score', 'made', 'cta', 'or', 'ask'].includes(id) : gSt.ball && !gGest;
        if (garyHas) { const p = handsOf(Gy); balls.push({ x: p.x, y: p.y - (gSt.mode === 'set' ? mG * .1 : 0), s: mG * .34, rot: 0 }); }
        shooterOnPlate.gary = { ...handsOf(Gy), s: mG * .34 }; shooterOnPlate.doug = { ...handsOf(D), s: mD * .34 };
        // racks: Doug's stays full, Gary's empties as he shoots
        const nG = SHOTS_.filter(s => s.who === 'gary' && s.r < t).length;
        rack(P, 90, 1030, t < at('doug') + .4 ? 12 : 11); rack(P, 800, 1010, ending ? 1 : Math.max(1, 12 - Math.round(nG * 11 / 23)));
        if (id === 'stare' || id === 'nothing') D.root.position.x += Math.sin(t * 30) * .003;
      } else if (P === '02') {
        // seen from behind the shooter at the free-throw line (Doug in "holds", Gary otherwise)
        const who = id === 'holds' ? 'doug' : id === 'whoever' ? null : 'gary';
        if (who) { const ch = K.cast[who]; put(who, '02', 250, 1380, Math.PI + .3);
          blinkFace(ch, 'flat', t); ch.pose({ t, look: 0 });
          const st = who === 'doug' ? { mode: 'set', w: 1, ball: true } : gSt; arms(ch, st.mode, st.w);
          const m = pxPerM(ch), p = handsOf(ch); shooterOnPlate[who] = { ...p, s: m * .34 };
          if (st.ball) balls.push({ x: p.x, y: p.y - m * .12, s: m * .34, rot: 0, layer: st.mode === 'hold' ? 'back' : 'front' }); }
      }

      // flying / bouncing balls of every shot that is live right now
      for (const sh of SHOTS_) {
        const st = shooterOnPlate[sh.who], u = (t - sh.r) / sh.dur; if (u < 0) continue;
        const b = shotBall(sh, t, P, st && (P === '01' || P === '04' || P === '02') ? { x: st.x, y: st.y, s: st.s } : null);
        if (!b) continue; balls.push(b);
        // impact burst on rim/board contacts (big story beats only)
        const dt = t - sh.r - sh.dur;
        if (dt >= 0 && dt < .35 && sh.kind !== 'in' && sh.kind !== 'short') { const hp = sh.kind === 'long' ? h.bb : [h.c[0] + HIT[sh.kind][0] * h.rw, h.c[1] + HIT[sh.kind][1] * h.rw], q = K.img(hp[0], hp[1]);
          K.prop('P03', { x: q.x, y: q.y, w: h.bd * K.imgScale() * 2.6 * (.6 + .6 * K.easeOut(dt / .35)), a: 1 - (dt / .35) ** 2 }); }
      }
      // balls that drop through the hoop go behind the front rim + net
      for (const b of balls.filter(b => b.behindNet)) K.prop('P01', { x: b.x, y: b.y, w: b.s, rot: b.rot });
      if (NET[P]) { const o = K.img(0, 0), info = K.propInfo(NET[P]); K.prop(NET[P], { x: o.x, y: o.y, w: info.iw * K.imgScale(), anchor: [0, 0] }); }
      for (const b of balls.filter(b => !b.behindNet)) K.prop('P01', { x: b.x, y: b.y, w: b.s, rot: b.rot, layer: b.layer });

      // overlays
      if (t < at('score')) board(t);
      if (id === 'shower' || (id === 'less' && false)) knob(t);
      if (P === '04') {
        const B = { w: 900, h: 220 };
        if (['score', 'made'].includes(id)) {
          card(t, 'score+0.6', 'c30', [{ txt: '30 SHOTS', size: 130, y: 115 }], 330, B);
          card(t, 'missed+0.25', 'c18', [{ txt: '18 MISSED', size: 130, y: 115, col: '#ff4d3d' }], 520, B);
          card(t, 'made+0.55', 'c12', [{ txt: '12 MADE', size: 130, y: 115, col: '#ffd23a' }], 710, B);
        }
        if (['doug1', 'dzero'].includes(id)) {
          card(t, 'doug1+0.45', 'c1', [{ txt: '1 SHOT', size: 130, y: 115 }], 380, B);
          card(t, 'dzero+0.3', 'c0', [{ txt: '0 MADE', size: 130, y: 115, col: '#ff4d3d' }], 570, B);
        }
        if (id === 'final') card(t, 'final', 'cfin', [{ txt: '12', size: 210, x: 250, y: 140, col: '#ffd23a' }, { txt: '–', size: 170, x: 450, y: 140 }, { txt: '0', size: 210, x: 650, y: 140, col: '#ff4d3d' }], 420, { w: 900, h: 280 });
      }
      if (id === 'buzzer') { const u = (t - at('buzzer') - .47) / .5; if (u > 0 && u < 1) K.prop('P03', { x: 540, y: 205, w: 900 * (.6 + .5 * u), a: (1 - u) * .8 }); }
    },
  };
})();
