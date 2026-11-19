// archery-misses: Brian's script. 3D Doug + Gary on Brian's range paintings; barrier panels and arrows animated here.
// Story timing (sliding gaps line up exactly when the narration says so) is all in EV below, in cue-relative seconds.
(function () {
  const PI = Math.PI;
  let K;
  const blinkFace = (ch, name, t, off = 0) => ch.face(((t + off) % 4.3) < .12 && name !== 'happy' ? 'blink' : name);
  const E = x => Math.max(0, Math.min(1, x)), S = x => { x = E(x); return x * x * (3 - 2 * x); };
  const G = {};
  const gp = (plate, ix, iy) => { const k = plate + ':' + ix + ':' + iy; return G[k] || (G[k] = K.ground(plate, ix, iy)); };
  const put = (n, plate, ix, iy, ry) => { const g = gp(plate, ix, iy); return K.place(n, g.x, 0, g.z, ry); };

  // ---- plate 02 (down the lane) geometry, painting px: the three gate openings and the target ----
  const GATE = [ { x0: 225, x1: 725, top: 470, bot: 965, per: 2.6 },   // near
                 { x0: 318, x1: 628, top: 600, bot: 890, per: 2.1 },   // middle
                 { x0: 372, x1: 570, top: 685, bot: 860, per: 1.7 } ]; // far
  const CX = 473, TARGET = { x: 473, y: 783 };
  // arrow (seen from behind) at depth d: 0 = leaving the bow, 1..3 = gates, 4 = target. [y, fletching width]
  const DEPTH = [[1250, 240], [752, 46], [765, 28], [785, 18], [783, 9]];
  const atDepth = d => { const i = Math.min(3, Math.floor(d)), f = d - i, a = DEPTH[i], b = DEPTH[i + 1]; return { y: a[0] + (b[0] - a[0]) * f, w: a[1] + (b[1] - a[1]) * f }; };

  // ---- events (filled in build from cue times) ----
  let EV;
  // shots: list of { launch, keys: [[t, depth]...], stop: {gate, t} | null, target: t | null }
  function arrowDepth(sh, t) { const k = sh.keys; if (t <= k[0][0]) return null;
    for (let i = 0; i < k.length - 1; i++) if (t <= k[i + 1][0]) return k[i][1] + (k[i + 1][1] - k[i][1]) * (t - k[i][0]) / (k[i + 1][0] - k[i][0]);
    return k[k.length - 1][1]; }
  // slot offset of gate g at time t (0 = slot centred on the arrow line). Phase is chosen per story moment.
  function slotDx(g, t) { const A = (GATE[g].x1 - GATE[g].x0) * .55, w = 2 * PI / GATE[g].per;
    // the latest "align" or "block" instruction before t sets the phase
    // the next instruction (or the one that just happened) sets the phase, so the slot is exactly there on time
    const ev = EV.gates[g], e = ev.find(x => x.t >= t - .6) || ev[ev.length - 1];
    return A * Math.sin(w * (t - e.t) + (e.block ? PI / 2 : 0)); }

  function drawLane(t, opts = {}) {
    const k = K.imgScale();
    for (let g = 2; g >= 0; g--) {      // far to near
      const G0 = GATE[g], dx = slotDx(g, t), wOpen = G0.x1 - G0.x0, h = G0.bot - G0.top;
      const c = K.img(CX + dx, atDepth(g + 1).y);              // board centred on the arrow's height
      K.prop('panel', { x: c.x, y: c.y, w: wOpen * 1.55 * k });
      // arrows stuck in this panel ride along with it
      for (const s of EV.stuck) if (s.gate === g && t >= s.t) { const p = K.img(CX + dx + s.ox, atDepth(g + 1).y); K.prop('P03', { x: p.x, y: p.y, w: atDepth(g + 1).w / .26 * k }); }
    }
    // the flying arrow (one per shot window)
    for (const sh of EV.shots) { if (t < sh.keys[0][0] || t > sh.keys[sh.keys.length - 1][0] + .05) continue;
      const d = arrowDepth(sh, t); if (d === null) continue; const a = atDepth(d), p = K.img(CX, a.y);
      K.prop('P03', { x: p.x, y: p.y, w: a.w / .26 * k, rot: t * 8 }); }
    for (const b of EV.bursts) { const u = (t - b.t) / .35; if (u < 0 || u > 1) continue; const a = atDepth(b.gate + 1), p = K.img(CX + (b.ox || 0), a.y);
      K.prop('P05', { x: p.x, y: p.y, w: a.w * 9 * k * (0.6 + 0.6 * K.easeOut(u)), a: 1 - u * u }); }
  }

  // bow + arrow in a character's hand on plate 01
  function bow(ch, drawn, t, shotAt) {
    const h = K.screenOf(ch.arm[1].wr), top = K.screenOf(ch.head), sz = Math.abs(h.y - top.y) * 1.25;
    K.prop('P04', { x: h.x + sz * .05, y: h.y, w: sz * 1024 / 1536 * 1.0, rot: drawn ? .08 : -.25 });
    if (drawn && (shotAt === undefined || t < shotAt)) K.prop('P02', { x: h.x - sz * .05, y: h.y, w: sz * 1.1 });
    if (shotAt !== undefined && t >= shotAt && t < shotAt + .5) { const u = (t - shotAt) / .5; K.prop('P02', { x: h.x + u * 1400, y: h.y - u * 60, w: sz * 1.1 }); }
  }

  window.SCENE = {
    plates: {
      '01': { img: '01_range_wide_day.png', hz: .50, vx: .5, fov0: 55, camH: 1.95, light: 'day' },
      '02': { img: '02_down_the_lane.png', hz: .45, vx: .5, fov0: 55, camH: 1.95, light: 'day' },
      '03': { img: '03_target_closeup.png', hz: .5, vx: .5, fov0: 55, camH: 1.95, light: 'day' },
      '04': { img: '04_barrier_arrows.png', hz: .5, vx: .5, fov0: 55, camH: 1.95, light: 'day' },
    },
    props: { P02: 'P02_arrow_side.png', P03: 'P03_arrow_back.png', P04: 'P04_bow.png', P05: 'P05_impact_burst.png' },
    cast: { doug: 'hoodie', gary: 'oxford' },
    shots: [
      { at: 'q', plate: '02', zoom: [1.0, 1.08], focus: [[.5, .5], [.5, .48]] },
      { at: 'problem', plate: '01', zoom: [1.0, 1.06], focus: [[.4, .62], [.4, .62]] },
      { at: 'barriers', plate: '02', zoom: [1.05, 1.25], focus: [[.5, .48], [.5, .46]] },
      { at: 'waits', plate: '01', zoom: [1.45, 1.6], focus: [[.33, .62], [.33, .6]] },
      { at: 'gap1', plate: '02', zoom: [1.3, 1.4], focus: [[.5, .46], [.5, .46]] },
      { at: 'gap2', plate: '02', zoom: [1.5, 1.5], focus: [[.5, .46], [.5, .46]] },
      { at: 'almost', plate: '01', zoom: [1.55, 1.6], focus: [[.33, .6], [.33, .6]] },
      { at: 'gary', plate: '01', zoom: [1.15, 1.2], focus: [[.5, .63], [.52, .63]] },
      { at: 'clank', plate: '02', zoom: [1.2, 1.32], focus: [[.5, .46], [.5, .46]] },
      { at: 'bet', plate: '01', zoom: [1.45, 1.55], focus: [[.33, .6], [.33, .6]] },
      { at: 'tell', plate: '01', zoom: [1.4, 1.45], focus: [[.66, .62], [.66, .62]] },
      { at: 'early', plate: '02', zoom: [1.15, 1.25], focus: [[.5, .47], [.5, .46]] },
      { at: 'wait2', plate: '01', zoom: [1.4, 1.5], focus: [[.66, .62], [.66, .61]] },
      { at: 'through1', plate: '02', zoom: [1.1, 1.3], focus: [[.5, .48], [.5, .46]] },
      { at: 'hit2', plate: '02', zoom: [1.5, 1.6], focus: [[.5, .46], [.5, .46]] },
      { at: 'knows', plate: '01', zoom: [1.45, 1.55], focus: [[.66, .62], [.66, .61]] },
      { at: 'aim', plate: '01', zoom: [1.2, 1.3], focus: [[.6, .62], [.6, .62]] },
      { at: 'slips', plate: '02', zoom: [1.0, 1.45], focus: [[.5, .5], [.5, .47]] },
      { at: 'bullseye', plate: '03', zoom: [1.0, 1.12], focus: [[.5, .46], [.5, .45]] },
      { at: 'doug', plate: '01', zoom: [1.2, 1.25], focus: [[.48, .62], [.48, .62]] },
      { at: 'which', plate: '01', zoom: [1.45, 1.45], focus: [[.66, .62], [.66, .62]] },
      { at: 'which+0.9', plate: '04', zoom: [1.0, 1.06], focus: [[.5, .5], [.5, .5]] },
      { at: 'which+1.9', plate: '01', zoom: [1.45, 1.5], focus: [[.66, .62], [.66, .62]] },
      { at: 'cta', plate: '01', zoom: [1.0, 1.08], focus: [[.45, .62], [.45, .62]] },
      { at: 'holding', plate: '01', zoom: [1.5, 1.65], focus: [[.33, .6], [.33, .58]] },
    ],
    shakes: [['clank+0.05', .3, .5], ['hit2+0.17', .25, .35], ['bullseye+0.02', .3, .45]],
    flashes: [],
    tail: 2.6,

    build(k) {
      K = k; const T = c => K.T(c);
      // barrier panel: brown planks, green frame, one vertical slot (transparent) in the middle
      const c = document.createElement('canvas'); c.width = 880; c.height = 400; const g = c.getContext('2d');
      g.fillStyle = '#3f6b2e'; g.fillRect(0, 0, 880, 400);
      for (let i = 0; i < 5; i++) { const y = 18 + i * 73; g.fillStyle = i % 2 ? '#b8743c' : '#c6824a'; g.fillRect(18, y, 844, 70);
        g.fillStyle = 'rgba(80,40,10,.35)'; g.fillRect(18, y + 66, 844, 4); for (let k2 = 0; k2 < 6; k2++) { g.fillStyle = 'rgba(90,50,20,.18)'; g.fillRect(40 + k2 * 140 + (i * 37) % 60, y + 20, 90, 3); } }
      g.fillStyle = '#d9a24a'; for (const [x, y] of [[30, 30], [850, 30], [30, 370], [850, 370]]) { g.beginPath(); g.arc(x, y, 9, 0, 7); g.fill(); }
      g.clearRect(440 - 72, 0, 144, 400);                       // the slot
      g.fillStyle = '#2f5222'; g.fillRect(440 - 78, 0, 6, 400); g.fillRect(440 + 72, 0, 6, 400);
      K.addProp('panel', c);
      // story events
      const shotA = { keys: [[T('clank') - .2, 0], [T('clank') + .05, 1]] };                         // 1st arrow -> barrier 1
      const shotA2 = { keys: [[T('early') + .45, 0], [T('early') + .7, 1]] };                        // replay of it
      const shotB = { keys: [[T('through1') + .15, 0], [T('through1') + .75, 1], [T('hit2') + .17, 2]] }; // through 1 -> barrier 2
      const shotC = { keys: [[T('slips') + .1, 0], [T('slips') + .9, 1], [T('slips') + 1.7, 2], [T('slips') + 2.5, 3], [T('bullseye') - .05, 4]] };
      EV = {
        shots: [shotA, shotA2, shotB, shotC],
        stuck: [{ gate: 0, t: T('clank') + .05, ox: 0 }, { gate: 0, t: T('early') + .7, ox: 0 }, { gate: 1, t: T('hit2') + .17, ox: 0 }],
        bursts: [{ gate: 0, t: T('clank') + .05 }, { gate: 0, t: T('early') + .7 }, { gate: 1, t: T('hit2') + .17 }],
        gates: [
          // gate 1: opens on "first gap opens", blocked for shot A, slot arrives just AFTER the replay hit ("too early"), open for B and C
          [{ t: 0, block: false }, { t: T('gap1') + .55, block: false }, { t: T('clank') + .05, block: true }, { t: T('early') + .95, block: false },
           { t: T('through1') + .75, block: false }, { t: T('slips') + .9, block: false }],
          // gate 2: closes on "second one closes"; blocks B; open for C
          [{ t: 0, block: false }, { t: T('gap2') + .6, block: true }, { t: T('hit2') + .17, block: true }, { t: T('slips') + 1.7, block: false }],
          // gate 3: open for C
          [{ t: 0, block: false }, { t: T('slips') + 2.5, block: false }],
        ],
      };
      // a stuck arrow keeps its offset inside the panel (it hit where the panel was, then rides along)
      for (const s of EV.stuck) s.ox = 0;
      window.__ARCHERY_EVENTS = { clank: T('clank') + .05, early: T('early') + .7, hit2: T('hit2') + .17, bullseye: T('bullseye') - .05 };
    },

    update(t, k) {
      K = k;
      const D = K.cast.doug, Gy = K.cast.gary, id = K.shot.id, L = K.shot.local, at = c => K.T(c), P = K.shot && window.SCENE.shots.find(s => s.at === id).plate;
      if (P === '02') { drawLane(t); return; }
      if (P === '03') { // the bullseye: arrow lands, wobbles
        const tb = at('bullseye') - .05, u = t - tb, c = K.img(468, 758), k2 = K.imgScale();
        if (u >= 0) { K.prop('P03', { x: c.x, y: c.y, w: (u < .12 ? 900 - 4000 * u : 420) * k2, rot: Math.sin(u * 30) * .12 * Math.exp(-u * 3) });
          const v = u / .35; if (v < 1) K.prop('P05', { x: c.x, y: c.y, w: 700 * k2 * (.6 + .6 * v), a: 1 - v * v }); }
        return; }
      if (P === '04') return;
      // plate 01: Doug (left) and Gary (right) on the shooting line, facing down the lane
      put('doug', '01', 300, 1330, .95); put('gary', '01', 660, 1420, .95);
      const dougDrawn = ['waits', 'almost', 'gary', 'bet', 'holding', 'cta'].includes(id) || (t > at('waits') && t < at('doug'));
      const df = { problem: 'worried', waits: 'flat', almost: 'worried', gary: 'flat', bet: 'smirk', tell: 'flat', wait2: 'flat', knows: 'worried', aim: 'worried', doug: 'surprised', 'which+1.9': 'flat', cta: 'flat', holding: 'flat' }[id] || 'smile';
      blinkFace(D, df, t); D.pose({ t, look: id === 'doug' ? -.7 : id === 'bet' ? -.5 : 0, gesture: dougDrawn ? 'point' : (id === 'bet' ? 'shrug' : null), gw: 1, tilt: id === 'almost' ? .1 : 0 });
      bow(D, dougDrawn, t);
      const gf = { problem: 'smile', gary: 'smile', tell: 'think', wait2: 'flat', knows: 'smirk', aim: 'smirk', doug: 'smile', 'which+1.9': 'smirk', cta: 'happy', holding: 'smile' }[id] || 'smile';
      const shots = { gary: at('gary') + 1.6, wait2: at('wait2') + 2.0, aim: at('aim') + 2.4 };
      const gDrawn = ['gary', 'wait2', 'aim'].includes(id);
      const gGest = id === 'tell' ? 'think' : id === 'which+1.9' ? 'shrug' : id === 'cta' ? 'wave' : gDrawn ? 'point' : null;
      blinkFace(Gy, gf, t, 1.3); Gy.pose({ t, look: id === 'which+1.9' || id === 'which' || id === 'doug' ? -.6 : 0, nod: id === 'knows' ? .15 * Math.sin(t * 6) : 0, gesture: gGest, gw: gGest === 'shrug' || gGest === 'wave' ? S(L / .3) : 1 });
      bow(Gy, gDrawn, t, shots[id]);
      if (id === 'holding') { /* Doug still holding: slight tremble */ D.root.position.x += Math.sin(t * 40) * .004; }
    },
  };
})();
