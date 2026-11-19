// archery-gates: Brian's script + Brian's paintings. 3D Doug (waits) + Gary (shoots) at the shooting line; arrows fly down the lane
// (02) through the gates; the hits are Brian's painted close-ups (post, second gate, blue ring, bullseye) with a burst + shake on impact.
(function () {
  let K;
  const E = x => Math.max(0, Math.min(1, x)), S = x => { x = E(x); return x * x * (3 - 2 * x); };
  const blinkFace = (ch, name, t, off = 0) => ch.face(((t + off) % 4.3) < .12 && name !== 'happy' ? 'blink' : name);
  const G = {};
  const gp = (plate, ix, iy) => { const k = plate + ':' + ix + ':' + iy; return G[k] || (G[k] = K.ground(plate, ix, iy)); };
  const put = (n, plate, ix, iy, ry) => { const g = gp(plate, ix, iy); return K.place(n, g.x, 0, g.z, ry); };
  const pxPerM = ch => { const p = ch.root.position, a = K.worldToScreen(p.x, 0, p.z), b = K.worldToScreen(p.x, 1, p.z); return Math.abs(a.y - b.y); };

  // ---- lane (plate 02) arrow flights, painting px: [time, x, y, width of the fletching seen from behind] ----
  let FLIGHTS, QV;
  function flight(f, t) { const k = f.keys; if (t < k[0][0] || t > k[k.length - 1][0] + .08) return null;
    for (let i = 0; i < k.length - 1; i++) if (t <= k[i + 1][0]) { const u = (t - k[i][0]) / (k[i + 1][0] - k[i][0]), a = k[i], b = k[i + 1];
      return { x: a[1] + (b[1] - a[1]) * u, y: a[2] + (b[2] - a[2]) * u, w: a[3] * Math.pow(b[3] / a[3], u) }; }
    const l = k[k.length - 1]; return { x: l[1], y: l[2], w: l[3] }; }

  // ---- bow in hand: drawn (arrow on the string) or lowered; a released arrow flies off to the right ----
  function bow(ch, drawn, t, shotAt) {
    ch.root.updateMatrixWorld(true);
    const h = K.screenOf(ch.arm[1].wr), m = pxPerM(ch), sz = m * 1.35;
    K.prop('P01', { x: h.x, y: h.y - (drawn ? 0 : sz * .05), w: sz, rot: drawn ? 0 : -.35 });
    if (drawn && (shotAt === undefined || t < shotAt)) K.prop('P02', { x: h.x - sz * .12, y: h.y, w: sz * .78 });
    if (shotAt !== undefined && t >= shotAt && t < shotAt + .45) { const u = (t - shotAt) / .45; K.prop('P02', { x: h.x + u * 1300, y: h.y - u * 90, w: sz * .78 * (1 - .5 * u) }); }
  }

  // ---- wind: leaves blowing across the frame ----
  function leaves(t, amt) { if (amt <= 0) return;
    for (let i = 0; i < 14; i++) { const ph = (t * (.45 + (i % 5) * .08) + i * .37) % 1, y0 = 120 + ((i * 397) % 1500);
      K.prop('leaf', { x: -120 + ph * 1320, y: y0 + Math.sin(t * 3 + i) * 60 + ph * 180, w: (60 + (i % 4) * 22) * (.6 + .4 * amt), rot: t * (2 + i % 3) + i, a: amt }); } }

  // ---- text canvases (made lazily after the font loads) ----
  const made = {};
  function textProp(key, lines, opt = {}) {
    if (made[key]) return key;
    const c = document.createElement('canvas'), W = opt.w || 1000, H = opt.h || 220; c.width = W; c.height = H; const g = c.getContext('2d');
    if (opt.bg) { g.fillStyle = opt.bg; g.beginPath(); g.roundRect(6, 6, W - 12, H - 12, 36); g.fill(); g.lineWidth = 8; g.strokeStyle = '#000'; g.stroke(); }
    g.textAlign = 'center'; g.textBaseline = 'middle';
    for (const L of lines) { g.font = `900 ${L.size}px IN, Arial Black, sans-serif`; g.lineJoin = 'round';
      g.lineWidth = L.size * .2; g.strokeStyle = '#000'; g.strokeText(L.txt, L.x || W / 2, L.y); g.fillStyle = L.col || '#fff'; g.fillText(L.txt, L.x || W / 2, L.y); }
    K.addProp(key, c); made[key] = 1; return key;
  }
  let SCORE;
  function board(t) {
    const tS = K.T('gary') - .3, tE = K.T('buzzer') + .4, secs = Math.max(0, Math.ceil(60 * (1 - E((t - tS) / (tE - tS)))));
    const d = SCORE.doug.filter(x => x <= t).length, g = SCORE.gary.filter(x => x <= t).length, clk = '0:' + String(secs).padStart(2, '0');
    const key = textProp(`b_${d}_${g}_${secs}`, [
      { txt: 'DOUG', size: 54, x: 170, y: 70, col: '#ffd23a' }, { txt: String(d), size: 120, x: 170, y: 168 },
      { txt: 'GARY', size: 54, x: 730, y: 70, col: '#9fd3ff' }, { txt: String(g), size: 120, x: 730, y: 168 },
      { txt: clk, size: 96, x: 450, y: 105, col: secs <= 5 ? '#ff4d3d' : '#7dff7a' }, { txt: 'BULLSEYES', size: 40, x: 450, y: 195, col: '#ddd' } ],
      { w: 900, h: 250, bg: 'rgba(18,22,40,.88)' });
    const a = E((t - K.T('rules') - .3) / .25) * (1 - E((t - K.T('buzzer') - 1.2) / .3));
    if (a > 0) K.prop(key, { x: 540, y: 205, w: 700 * (.9 + .1 * K.pop(E((t - K.T('rules') - .3) / .3))), a });
  }
  function card(t, at, key, lines, y, opt = { w: 1000, h: 200 }) {
    const t0 = K.T(at); if (t < t0) return; textProp(key, lines, opt);
    K.prop(key, { x: 540, y, w: opt.w * .95 * (.6 + .4 * K.pop(E((t - t0) / .3))) });
  }

  window.SCENE = {
    plates: {
      '01': { img: '01_range_side_day.png', hz: .5, vx: .5, fov0: 55, camH: 1.3, light: 'day' },
      '07': { img: '07_range_side_dusk.png', hz: .5, vx: .5, fov0: 55, camH: 1.3, light: 'dawn' },
      '02': { img: '02_down_the_lane.png', hz: .51, vx: .5, fov0: 55, camH: 1.3, light: 'day' },
      '03a': { img: '03a_target_blue.png', light: 'day' }, '03b': { img: '03b_target_bullseye.png', light: 'day' }, '03c': { img: '03c_target_bullseye_doug.png', light: 'day' },
      '04': { img: '04_post_arrow.png', light: 'day' }, '05': { img: '05_trees_wind.png', light: 'day' }, '06': { img: '06_lane_clip_second.png', light: 'day' },
    },
    props: { P01: 'P01_bow.png', P02: 'P02_arrow_side.png', P03: 'P03_arrow_back.png', P04: 'P04_quiver_full.png', P04e: 'P04e_quiver_empty.png', P06: 'P06_impact_burst.png' },
    cast: { doug: 'hoodie', gary: 'oxford' },
    shots: [
      { at: 'q', plate: '02', zoom: [1.0, 1.15], focus: [[.5, .52], [.5, .52]] },
      { at: 'meet', plate: '01', zoom: [1.35, 1.45], focus: [[.4, .55], [.42, .55]] },
      { at: 'target', plate: '02', zoom: [3.2, 3.4], focus: [[.5, .513], [.5, .513]] },
      { at: 'gates', plate: '02', zoom: [1.05, 1.0], focus: [[.5, .5], [.5, .5]] },
      { at: 'arrows', plate: '01', zoom: [1.6, 1.7], focus: [[.4, .62], [.4, .62]] },
      { at: 'rules', plate: '01', zoom: [1.0, 1.08], focus: [[.5, .5], [.52, .5]] },
      { at: 'raise', plate: '01', zoom: [1.8, 1.95], focus: [[.25, .55], [.26, .55]] },
      { at: 'aim', plate: '02', zoom: [1.1, 1.25], focus: [[.5, .52], [.5, .52]] },
      { at: 'wind', plate: '05', zoom: [1.0, 1.08], focus: [[.5, .45], [.5, .45]] },
      { at: 'lower', plate: '01', zoom: [1.9, 2.0], focus: [[.25, .55], [.25, .54]] },
      { at: 'gary', plate: '01', zoom: [1.8, 1.6], focus: [[.6, .58], [.66, .55]] },
      { at: 'thunk', plate: '04', zoom: [1.0, 1.05], focus: [[.4, .5], [.35, .52]] },
      { at: 'bet', plate: '01', zoom: [1.9, 2.05], focus: [[.25, .55], [.25, .54]] },
      { at: 'sees', plate: '04', zoom: [1.4, 1.6], focus: [[.3, .55], [.25, .55]] },
      { at: 'right', plate: '01', zoom: [1.8, 1.6], focus: [[.6, .58], [.66, .55]] },
      { at: 'clears', plate: '02', zoom: [1.0, 1.2], focus: [[.5, .55], [.55, .54]] },
      { at: 'clips', plate: '06', zoom: [1.1, 1.2], focus: [[.6, .54], [.7, .54]] },
      { at: 'again', plate: '01', zoom: [1.8, 1.6], focus: [[.6, .58], [.66, .55]] },
      { at: 'through', plate: '02', zoom: [1.0, 1.55], focus: [[.5, .55], [.5, .52]] },
      { at: 'blue', plate: '03a', zoom: [1.0, 1.06], focus: [[.5, .55], [.5, .58]] },
      { at: 'higher', plate: '01', zoom: [1.8, 1.65], focus: [[.6, .58], [.66, .55]] },
      { at: 'bull1', plate: '03b', zoom: [1.05, 1.15], focus: [[.5, .5], [.5, .48]] },
      { at: 'meanwhile', plate: '01', zoom: [1.3, 1.45], focus: [[.35, .55], [.3, .55]] },
      { at: 'steady', plate: '01', zoom: [1.9, 2.1], focus: [[.25, .55], [.25, .54]] },
      { at: 'bull2', plate: '03c', zoom: [1.05, 1.15], focus: [[.5, .5], [.5, .48]] },
      { at: 'leaves', plate: '05', zoom: [1.05, 1.0], focus: [[.5, .45], [.5, .45]] },
      { at: 'lower2', plate: '01', zoom: [1.9, 2.0], focus: [[.25, .55], [.25, .54]] },
      { at: 'buzzer', plate: '07', zoom: [1.7, 1.8], focus: [[.25, .47], [.25, .47]] },
      { at: 'garyscore', plate: '07', zoom: [1.7, 1.8], focus: [[.6, .47], [.6, .47]] },
      { at: 'looks', plate: '07', zoom: [1.9, 2.1], focus: [[.25, .55], [.22, .6]] },
      { at: 'twenty', plate: '07', zoom: [1.9, 2.1], focus: [[.17, .55], [.15, .58]] },
      { at: 'cta', plate: '07', zoom: [1.0, 1.1], focus: [[.42, .5], [.42, .5]] },
      { at: 'or', plate: '07', zoom: [1.8, 1.9], focus: [[.6, .55], [.6, .55]] },
    ],
    shakes: [['thunk', .35, .55], ['clips+0.05', .3, .4], ['blue', .3, .4], ['bull1', .35, .5], ['bull2', .35, .5], ['buzzer+0.4', .3, .3]],
    flashes: [],
    tail: 2.4,

    build(k) {
      K = k; const T = c => K.T(c);
      // a leaf sprite (Brian's set has no leaf prop)
      const c = document.createElement('canvas'); c.width = 120; c.height = 80; const g = c.getContext('2d');
      g.fillStyle = '#9cc63a'; g.beginPath(); g.ellipse(60, 40, 52, 26, 0, 0, 7); g.fill(); g.strokeStyle = '#5f8a1e'; g.lineWidth = 4; g.beginPath(); g.moveTo(10, 40); g.lineTo(112, 40); g.stroke();
      K.addProp('leaf', c);
      // Gary's lane flights (02): start below the frame, through gate 1 (y≈960), gate 2 (≈915), gate 3 (≈895), target centre (468, 858)
      FLIGHTS = [
        { keys: [[T('clears') + .15, 520, 1700, 320], [T('clears') + .65, 470, 975, 58], [T('clips') + .02, 655, 905, 30]] },                  // through 1, clips gate 2 (right post)
        { keys: [[T('through') + .05, 520, 1700, 320], [T('through') + .5, 470, 975, 58], [T('through') + .9, 468, 918, 32], [T('through') + 1.25, 468, 898, 21], [T('blue') - .02, 468, 893, 12]] },
        { keys: [[T('aim') + .6, 470, 1700, 320], [T('aim') + .9, 360, 1100, 120]] },  // (unused flourish guard)
      ].slice(0, 2);
      // opening volley (hook): arrows from both archers thunk into the gate posts and the target
      const H = [[136, 620, 58, 'post'], [804, 760, 58, 'post'], [278, 820, 32, 'post'], [468, 858, 12, 'target'], [660, 700, 32, 'post'], [136, 980, 58, 'post'],
                 [356, 880, 22, 'post'], [804, 520, 58, 'post'], [582, 830, 22, 'post'], [478, 866, 12, 'target'], [278, 690, 32, 'post'], [660, 950, 32, 'post']];
      QV = H.map(([x, y, w, kind], i) => { const t1 = .35 + i * .23; return { t0: t1 - .4, t1, x0: 300 + (i * 173) % 400, x, y, w, kind }; });
      window.__QV = QV.map(v => +v.t1.toFixed(2));
      SCORE = { gary: [T('bull1'), 43.6, 44.6, 45.5, T('buzzer') + .4, T('buzzer') + .4], doug: [T('bull2'), 45.2, T('buzzer') + .4] };
    },

    update(t, k) {
      K = k;
      const D = K.cast.doug, Gy = K.cast.gary, id = K.shot.id, L = K.shot.local, at = c => K.T(c);
      const P = window.SCENE.shots.find(s => s.at === id).plate;

      if (P === '01' || P === '07') {
        const shooting = ['raise', 'steady', 'gary', 'right', 'again', 'higher'].includes(id);
        put('doug', P, 235, 1110, ['raise', 'steady'].includes(id) ? 1.0 : ['looks', 'twenty'].includes(id) ? -.2 : .55); put('gary', P, 560, 1165, ['gary', 'right', 'again', 'higher'].includes(id) ? 1.0 : .55);
        const dusk = P === '07';
        // quivers on the ground beside each man (Gary's is empty at the end)
        for (const [who, ix, iy] of [['doug', 120, 1150], ['gary', 440, 1205]]) {
          const g0 = gp(P, ix, iy), a = K.worldToScreen(g0.x, 0, g0.z), b = K.worldToScreen(g0.x, 1, g0.z), m = Math.abs(a.y - b.y), w = m * .75;
          K.prop(who === 'gary' && dusk ? 'P04e' : 'P04', { x: a.x, y: a.y - w * .48, w, layer: 'back' }); }
        // Doug: draws on "raises" and "steady"; lowers on "lower"/"lower2"
        const dDrawn = (t > at('raise') + .3 && t < at('lower') + .35) || (t > at('steady') + .2 && t < at('bull2') - .2);
        const dShot = t > at('steady') ? at('bull2') - .35 : undefined;
        const df = { meet: 'smirk', arrows: 'smile', rules: 'smile', raise: 'flat', lower: 'flat', gary: 'flat', bet: 'smirk', meanwhile: 'smile', steady: 'flat',
          lower2: 'worried', buzzer: 'worried', garyscore: 'worried', looks: 'surprised', twenty: 'worried', cta: 'flat', or: 'flat' }[id] || 'flat';
        blinkFace(D, df, t);
        const dGest = dDrawn ? 'point' : id === 'bet' ? 'shrug' : null;
        D.pose({ t, look: id === 'lower' ? .2 : id === 'bet' ? .35 : 0, nod: ['looks', 'twenty'].includes(id) ? .55 : id === 'lower' ? -.18 : 0, tilt: id === 'lower2' ? .1 : 0,
          gesture: dGest, gw: dGest === 'shrug' ? S(L / .3) : dDrawn ? S((t - (t < at('lower') ? at('raise') : at('steady')) - .3) / .4) : 1 });
        bow(D, dDrawn, t, dShot);
        // Gary: shoots on "shoots", "right", "again", "higher"
        const rel = [at('thunk') - .35, at('clears') + .1, at('through') - .1, at('bull1') - .35];
        const gDrawn = ['gary', 'right', 'again', 'higher'].includes(id);
        const shotAt = rel.find(r => r > K.shot.t0 - .1 && r < K.shot.t1 + .1);
        const gf = { meet: 'smile', gary: 'smile', right: 'smirk', again: 'flat', higher: 'smirk', meanwhile: 'smile', buzzer: 'smile', garyscore: 'happy', looks: 'smile', cta: 'happy', or: 'smile' }[id] || 'smile';
        blinkFace(Gy, gf, t, 1.3);
        const gGest = id === 'garyscore' ? 'tada' : id === 'cta' ? 'wave' : id === 'bet' ? null : gDrawn ? 'point' : null;
        Gy.pose({ t, look: id === 'bet' ? -.4 : 0, lean: id === 'higher' ? -.05 : 0, nod: id === 'higher' ? -.08 : 0, gesture: gGest, gw: gGest === 'point' ? S(L / .35) : gGest ? S(L / .3) : 0 });
        if (gGest !== 'tada' && gGest !== 'wave') bow(Gy, gDrawn && L > .3, t, shotAt);
        if (['right', 'higher'].includes(id)) Gy.root.rotation.y += id === 'right' ? .15 * S(L / .6) : 0;
        leaves(t, id === 'lower' ? 1 : id === 'lower2' ? 1 : id === 'meanwhile' || id === 'steady' ? 0 : 0);
        if (dusk) {
          if (id === 'buzzer') { const u = (t - at('buzzer') - .4) / .5; if (u > 0 && u < 1) K.prop('P06', { x: 540, y: 205, w: 800 * (.6 + .5 * u), a: 1 - u });
            card(t, 'buzzer+1.35', 'cd10', [{ txt: 'DOUG: 10 ARROWS', size: 84, y: 100 }], 250);
            card(t, 'buzzer+2.7', 'cd3', [{ txt: '3 BULLSEYES', size: 96, y: 100, col: '#ffd23a' }], 410); }
          if (id === 'garyscore') { card(t, 'garyscore+1.2', 'cg30', [{ txt: 'GARY: 30 ARROWS', size: 84, y: 100 }], 250);
            card(t, 'garyscore+2.15', 'cg6', [{ txt: '6 BULLSEYES', size: 96, y: 100, col: '#ffd23a' }], 410); }
          if (id === 'twenty') card(t, 'twenty+0.7', 'c20', [{ txt: '20 ARROWS LEFT', size: 90, y: 100, col: '#ff4d3d' }], 260);
        }
      } else if (P === '02') {
        const sc = K.imgScale();
        for (const f of FLIGHTS) { const p = flight(f, t); if (!p) continue; const q = K.img(p.x, p.y); K.prop('P03', { x: q.x, y: q.y, w: p.w * sc * 1.1, rot: t * 9 }); }
        if (id === 'q') for (const v of QV) {
          if (t < v.t0) continue; const u = E((t - v.t0) / (v.t1 - v.t0));
          const x = v.x0 + (v.x - v.x0) * u, y = 1750 + (v.y - 1750) * u, w = 300 * Math.pow(v.w / 300, u), q = K.img(x, y);
          K.prop('P03', { x: q.x, y: q.y, w: w * sc * (1.1 + 1.3 * u), rot: u < 1 ? t * 9 : v.x });
          const b = (t - v.t1) / .3; if (b > 0 && b < 1) K.prop('P06', { x: q.x, y: q.y, w: v.w * sc * 9 * (.6 + .6 * b), a: 1 - b * b }); }
      } else if (P === '05') {
        leaves(t, 1);
      }
      // impact bursts on the painted hits
      const burst = (cue, ix, iy, w) => { const u = (t - at(cue)) / .4; if (u < 0 || u > 1) return; const q = K.img(ix, iy); K.prop('P06', { x: q.x, y: q.y, w: w * K.imgScale() * (.6 + .6 * K.easeOut(u)), a: 1 - u * u }); };
      if (P === '04') burst('thunk', 175, 905, 420);
      if (P === '06') burst('clips', 760, 905, 360);
      if (P === '03a') burst('blue', 440, 1390, 420);
      if (P === '03b') burst('bull1', 455, 780, 520);
      if (P === '03c') burst('bull2', 486, 780, 520);
      if (t < at('buzzer') + 1.6) board(t);
    },
  };
})();
