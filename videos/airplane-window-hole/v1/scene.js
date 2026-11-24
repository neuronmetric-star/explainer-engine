// airplane-window-hole: "Why the heck do airplane windows have a tiny hole?"
// Explainer, build-break-fix chain (PLAYBOOK §1.7a) + visual rules v3 (§3.5): one cutaway plate (04) that GROWS,
// the color code (white = air push, light blue = damp air, red = crack, gold = the hole/answer), the THE HECK? banner.
// Plan: shotlist.md. Doug (hard hat, drill), Victor (inspector cap, clipboard), Gary (passenger).
// Panes in the cutaway are drawn edge-on as strips (K.line); every number and word is K.text (no text in the paintings).
(function () {
  const PI = Math.PI;
  const face = (ch, name, t, off = 0) => ch.face(((t + off) % 4.1) < .12 && name !== 'happy' ? 'blink' : name);
  const popIn = (K, t, from, dur = .35) => K.pop(K.clamp01((t - from) / dur));
  const WORDS = window.VIDEO_DATA.words, norm = w => w.toLowerCase().replace(/[^a-z0-9]/g, '');
  const wordAt = (K, w, cue) => { const t0 = K.T(cue); const x = WORDS.find(o => o.start >= t0 - .01 && norm(o.w) === w); return x ? x.start : t0; };

  const L = {
    cabin: { key: [0xffd09a, 2.0, [-12, 4, 2]], hemi: [0xfff2e0, 0x8a90c0, .85], front: [0xfff0e2, 1.05], shadow: [0x2a2a5a, .34] },
    shop: { key: [0xffcf90, 2.2, [-10, 8, 3]], hemi: [0xdfe8ff, 0x9a8070, .8], front: [0xfff0e2, 1.0], shadow: [0x3a3050, .38] },
    seat: { key: [0xfff0d8, 1.6, [-10, 4, 4]], hemi: [0xdfeaff, 0x7a8aa0, .9], front: [0xfff4ea, 1.1], shadow: [0x2a3050, .3] },
    frost: { key: [0xd8e4f4, 1.1, [-10, 4, 4]], hemi: [0xc8d4e8, 0x5a6478, .95], front: [0xe8eef8, 1.0], shadow: [0x1a2030, .3] },
    sunset: { key: [0xffb070, 2.6, [-12, 3, 2]], hemi: [0xffc8b0, 0x8a6a80, .8], front: [0xffe8dc, 1.0], shadow: [0x4a2a5a, .42] },
  };

  // ---------- the cutaway (04): image px. Cabin LEFT, sky RIGHT; the panes stand in the slot, edge-on ----------
  const CUT = { top: 440, bot: 1000, outX: 588, bakX: 452, holeY: 900 };
  const AIR = '#ffffff', DAMP = '#8fd3ff', GOLD = '#ffd23a', RED = '#ff3b30';
  function arrow(K, x0, y0, x1, y1, o = {}) {   // screen px, white by default
    const c = o.color || AIR, w = o.width || 12, a = Math.atan2(y1 - y0, x1 - x0), h = o.head || w * 2.6;
    K.line(x0, y0, x1, y1, { color: c, width: w, a: o.a });
    K.line(x1, y1, x1 - h * Math.cos(a - .55), y1 - h * Math.sin(a - .55), { color: c, width: w, a: o.a });
    K.line(x1, y1, x1 - h * Math.cos(a + .55), y1 - h * Math.sin(a + .55), { color: c, width: w, a: o.a });
  }
  // state: { out: 0..1 (outside pane in), bak: 0..1 (backup slides in), hole: bool, crack: 0..1 }
  function panes(K, st) {
    const s = K.imgScale(), P = (ix, iy) => K.img(ix, iy);
    if (st.out > 0) { const a = P(CUT.outX, CUT.top), b = P(CUT.outX, CUT.bot); const dy = (1 - K.easeOut(st.out)) * -500;
      K.line(a.x, a.y + dy, b.x, b.y + dy, { color: 'rgba(140,205,255,.92)', width: 30 * s / 1.25 });
      K.line(a.x - 8 * s, a.y + dy + 20, b.x - 8 * s, b.y + dy - 20, { color: 'rgba(255,255,255,.75)', width: 5 * s / 1.25 }); }
    if (st.bak > 0) { const x = K.lerp(CUT.bakX - 260, CUT.bakX, K.easeOut(st.bak)), a = P(x, CUT.top), b = P(x, CUT.bot), w = 18 * s / 1.25, col = st.glow ? `rgba(255,210,58,${.55 + .4 * st.glow})` : 'rgba(170,220,255,.9)';
      if (st.hole) { const h0 = P(x, CUT.holeY - 22), h1 = P(x, CUT.holeY + 22);
        K.line(a.x, a.y, h0.x, h0.y, { color: col, width: w }); K.line(h1.x, h1.y, b.x, b.y, { color: col, width: w }); }
      else K.line(a.x, a.y, b.x, b.y, { color: col, width: w }); }
    if (st.crack > 0) { const pts = [[0, 560], [-14, 610], [12, 660], [-10, 720], [14, 780], [-6, 840]], n = Math.ceil(pts.length * st.crack);
      for (let i = 1; i < n; i++) { const p0 = P(CUT.outX + pts[i - 1][0], pts[i - 1][1]), p1 = P(CUT.outX + pts[i][0], pts[i][1]); K.line(p0.x, p0.y, p1.x, p1.y, { color: RED, width: 8 }); } }
  }
  const holeRing = (K, t, p, r = 30) => { K.text('◯', { x: p.x, y: p.y, size: r * 2.4 * (1 + .08 * Math.sin(t * 6)), color: GOLD, stroke: 6 }); };
  const label = (K, str, ix, iy, o = {}) => { const p = K.img(ix, iy); return K.text(str, Object.assign({ x: p.x, y: p.y, size: 44, w: 520 }, o)); };
  // damp air wisps (light blue dots) drifting inside the gap between the panes; dir: 0 = swirl, -1 = leaving left through the hole
  function damp(K, t, amt, leave = 0) {
    for (let i = 0; i < 14; i++) { const ph = (t * .35 + i * .071) % 1, gx = K.lerp(CUT.bakX + 20, CUT.outX - 24, (i * .37) % 1), gy = K.lerp(CUT.top + 40, CUT.bot - 40, (i * .61 + ph * .3) % 1);
      let ix = gx + Math.sin(t * 1.3 + i) * 10, iy = gy;
      if (leave > 0) { const u = K.clamp01(leave * 1.6 - i * .05); ix = K.lerp(ix, CUT.bakX - 120 - i * 6, K.ease(u)); iy = K.lerp(iy, CUT.holeY + (i % 5 - 2) * 18, K.ease(Math.min(1, u * 1.4))); }
      const p = K.img(ix, iy); K.text('●', { x: p.x, y: p.y, size: 40, color: DAMP, stroke: 3, shadow: false, a: amt * (leave > 0 ? 1 - K.clamp01(leave * 1.2 - .6) : 1) }); }
  }
  function frost(K, amt) { for (let i = 0; i < 9; i++) { const p = K.img(CUT.outX - 22, K.lerp(CUT.top + 50, CUT.bot - 50, i / 8));
      K.text('✱', { x: p.x, y: p.y, size: 34 + 12 * (i % 3), color: '#ffffff', stroke: 3, a: amt, scale: amt }); } }

  // window glass in 05/06 (image px): the hole near the bottom of the glass
  const WIN = { cx: 178, cy: 430, hole: [178, 650] };

  window.SCENE = {
    banner: 'THE HECK?',
    plates: {
      '01': { img: '01_cabin_aisle_morning.png', hz: .33, vx: .79, fov0: 55, camH: 1.7, light: L.cabin },
      '02': { img: '02_window_workshop.png', hz: .42, vx: .55, fov0: 55, camH: 1.4, light: L.shop },
      '03': { img: '03_sky_altitude_side.png', hz: .5, vx: .5, fov0: 55, camH: 1.5, light: 'day' },
      '04': { img: '04_window_cutaway.png', hz: .5, vx: .5, fov0: 55, camH: 1.5, light: 'interior' },
      '05': { img: '05_window_seat_clear.png', hz: .42, vx: .5, fov0: 55, camH: 1.25, light: L.seat },
      '06': { img: '06_window_seat_frosted.png', hz: .42, vx: .5, fov0: 55, camH: 1.25, light: L.frost },
      '07': { img: '07_tarmac_sunset.png', hz: .55, vx: .45, fov0: 55, camH: 1.3, light: L.sunset },
    },
    props: { TRAY5: '05_tray_front.cut.png', TRAY6: '06_tray_front.cut.png', P01: 'P01_outside_pane.png', P03: 'P03_frost_overlay.png', P04: 'P04_milk_jug.png', P07: 'P07_sealant_gun.png',
      P08: 'P08_airliner_side.png', H01: 'H01_helicopter.png' },
    cast: { doug: { outfit: 'hoodie', hat: 'hard', holdR: 'drill' }, victor: { outfit: 'suit', hat: 'inspector', holdL: 'clipboard' }, gary: 'oxford' },
    shots: [
      { at: 'q', plate: '05', zoom: [1.02, 1.3], focus: [[.42, .5], [.28, .42]] },
      { at: 'card', plate: '02', zoom: [1.0, 1.1], focus: [[.5, .55], [.52, .58]] },
      { at: 'sky', plate: '03', zoom: [1.15, 1.0], focus: [[.5, .45], [.5, .5]] },
      { at: 'thin', plate: '03', zoom: [1.0, 1.12], focus: [[.5, .5], [.5, .45]] },
      { at: 'balloon', plate: '03', zoom: [1.05, 1.12], focus: [[.5, .45], [.5, .45]] },
      { at: 'push', plate: '04', zoom: [1.0, 1.1], focus: [[.45, .48], [.47, .48]] },
      { at: 'milk', plate: '04', zoom: [1.15, 1.25], focus: [[.45, .48], [.47, .5]] },
      { at: 'pane1', plate: '02', zoom: [1.2, 1.3], focus: [[.48, .6], [.48, .6]] },
      { at: 'victor', plate: '02', zoom: [1.1, 1.18], focus: [[.6, .6], [.6, .6]] },
      { at: 'pane2', plate: '04', zoom: [1.15, 1.2], focus: [[.5, .48], [.52, .48]] },
      { at: 'backup', plate: '02', zoom: [1.12, 1.18], focus: [[.6, .5], [.6, .5]] },
      { at: 'seal', plate: '02', zoom: [3.0, 3.2], focus: [[.6, .24], [.6, .24]] },
      { at: 'bet', plate: '02', zoom: [1.05, 1.0], focus: [[.55, .58], [.55, .56]] },
      { at: 'takeoff', plate: '01', zoom: [1.1, 1.2], focus: [[.55, .55], [.5, .58]] },
      { at: 'fog', plate: '05', zoom: [1.05, 1.12], focus: [[.4, .48], [.38, .46]] },
      { at: 'frost', plate: '06', zoom: [1.12, 1.18], focus: [[.46, .46], [.46, .46]] },
      { at: 'why', plate: '04', zoom: [1.2, 1.35], focus: [[.5, .48], [.51, .5]] },
      { at: 'cold', plate: '04', zoom: [1.35, 1.45], focus: [[.53, .48], [.55, .48]] },
      { at: 'drill', plate: '02', zoom: [1.25, 1.32], focus: [[.45, .5], [.45, .5]] },
      { at: 'clear', plate: '04', zoom: [1.4, 1.6], focus: [[.45, .55], [.44, .58]] },
      { at: 'job', plate: '05', zoom: [1.1, 1.22], focus: [[.44, .46], [.38, .44]] },
      { at: 'same', plate: '04', zoom: [1.15, 1.3], focus: [[.48, .5], [.48, .5]] },
      { at: 'outer', plate: '04', zoom: [1.3, 1.45], focus: [[.55, .48], [.57, .48]] },
      { at: 'crack', plate: '04', zoom: [1.45, 1.2], focus: [[.55, .5], [.5, .5]] },
      { at: 'mirror', plate: '07', zoom: [1.12, 1.18], focus: [[.42, .6], [.42, .6]] },
      { at: 'question', plate: '07', zoom: [1.18, 1.2], focus: [[.42, .6], [.42, .6]] },
      { at: 'cta', plate: '07', zoom: [1.2, 1.2], focus: [[.42, .6], [.42, .6]] },
    ],
    shakes: [['milk+0.4', .25, .35], ['crack', .3, .45], ['frost', .2, .25]],
    flashes: [],
    follow: { from: 'cta+0.3' },
    tail: 1.4,

    update(t, K) {
      const id = K.shot.id, Lc = K.shot.local, at = c => K.T(c);
      const D = K.cast.doug, V = K.cast.victor, G = K.cast.gary;
      D.held[1].visible = id === 'drill';
      // Gary seated by the window (05/06): sunk so the frame cuts him at the chest, turned toward the window
      const sit = ch => { for (const k of [-1, 1]) { ch.leg[k].hip.rotation.x = -1.5; ch.leg[k].knee.rotation.x = 1.55; ch.leg[k].ankle.rotation.x = 0; } };
      // Gary seated by the window (05/06): real sitting pose (thighs forward, shins down), hips on the painted cushion
      const seated = (look = -.6) => K.place('gary', .27, -.55, -3.4, -.4);
      // the painted tray table sits IN FRONT of Gary: redraw that strip of the painting over the 3D layer
      const tray = (plate) => { const p = K.img(400, 1160 + 188); K.prop(plate === '06' ? 'TRAY6' : 'TRAY5', { x: p.x, y: p.y, w: 800 * K.imgScale() }); };
      // workshop spots
      const shopDoug = (ix = 470, iy = 1060, ry = .25) => K.placeAt('doug', ix, iy, ry);
      switch (id) {
        case 'q': { seated(-.55); face(G, 'flat', t); G.pose({ t, look: -.55, tilt: .18 });
          holeRing(K, t, K.img(...WIN.hole), 26); K.text('●', Object.assign(K.img(...WIN.hole), { size: 26, color: '#1a2230', stroke: 0, shadow: false }));
          const a = K.clamp01((at('card') - t) / .2);
          K.text('WHY DO AIRPLANE WINDOWS', { y: 290, size: 66, a, scale: .8 + .2 * popIn(K, t, at('q')) });
          K.text('HAVE A HOLE?', { y: 380, size: 92, color: 'gold', a, scale: .8 + .2 * popIn(K, t, at('q') + .5) }); sit(G); tray(K.shot.id === 'frost' ? '06' : '05'); break; }
        case 'card': { const u = K.clamp01(Lc / 1.4), [x0, z0] = K.floorAt(220, 1180), [x1, z1] = K.floorAt(470, 1060);
          K.place('doug', K.lerp(x0, x1, u), 0, K.lerp(z0, z1, u), u < 1 ? .9 : .25); face(D, 'smile', t);
          D.pose({ t, walk: Lc * 1.3, walkAmt: 1 - K.ease((Lc - 1.1) / .4), gesture: Lc > 1.6 ? 'hips' : undefined, gw: K.ease((Lc - 1.6) / .4) });
          const tb = wordAt(K, 'break', 'card'); if (t > tb - .1) K.text("WON'T BREAK", { y: 300, size: 92, color: 'red', scale: popIn(K, t, tb) }); break; }
        case 'sky': case 'thin': case 'balloon': {
          const u = id === 'sky' ? K.easeOut(K.clamp01(Lc / 1.4)) : 1, s = K.imgScale();
          const p = K.img(K.lerp(-200, 512, u), 640), swell = id === 'balloon' ? 1 + .1 * K.pop(K.clamp01((Lc - .3) / .5)) + .02 * Math.sin(t * 5) : 1;
          K.prop('P08', { x: p.x, y: p.y, w: 900 * s / 1.25 * swell, rot: -.03 });
          if (id === 'sky') { const g = K.img(512, 1250); K.line(p.x, p.y + 60, g.x, g.y, { color: '#fff', width: 6, dash: 18, a: K.clamp01((Lc - 1) / .3) });
            K.text('7 MILES UP', { y: 300, size: 96, scale: popIn(K, t, at('sky') + .9) }); }
          if (id === 'thin') { // air dots: thick near the ground, a few up at the plane
            for (let i = 0; i < 46; i++) { const fx = (i * .618) % 1, low = i < 34, iy = low ? K.lerp(1060, 1200, (i * .37) % 1) : K.lerp(300, 900, (i * .29) % 1);
              const q = K.img(fx * 1024, iy); K.text('●', { x: q.x, y: q.y, size: low ? 34 : 30, color: '#e8f6ff', stroke: 4, shadow: false, a: popIn(K, t, at('thin') + i * .02) }); }
            K.text('TOO THIN TO BREATHE', { y: 300, size: 78, color: 'red', scale: popIn(K, t, at('thin') + .5) }); }
          if (id === 'balloon') { const k = K.clamp01((Lc - .3) / .5);
            for (let i = 0; i < 8; i++) { const a = i / 8 * 2 * PI, r0 = 300, r1 = r0 + 130 * k; arrow(K, p.x + Math.cos(a) * r0, p.y + Math.sin(a) * r0 * .45, p.x + Math.cos(a) * r1, p.y + Math.sin(a) * r1 * .45, { width: 13, a: k }); }
            K.text('PUMPED FULL OF AIR', { y: 300, size: 80, color: 'gold', scale: popIn(K, t, at('balloon') + .4) }); }
          break; }
        case 'push': case 'milk': {
          // empty slot: the push goes straight out to the sky
          for (let i = 0; i < 4; i++) { const iy = K.lerp(520, 920, i / 3), k = K.ease(K.clamp01((Lc - i * .12) / .5)), a = K.img(130, iy), b = K.img(K.lerp(160, 760, k), iy); arrow(K, a.x, a.y, b.x, b.y, { width: 14, a: .95 }); }
          if (id === 'push') K.text('PUSH', { y: 300, size: 110, scale: popIn(K, t, at('push') + .3) });
          if (id === 'milk') { const s = K.imgScale();
            [[400, 560], [540, 560], [400, 760], [540, 760], [400, 960], [540, 960]].forEach(([ix, iy], i) => { const q = K.img(ix, iy), k = popIn(K, t, at('milk') + .15 + i * .1);
              K.prop('P04', { x: q.x, y: q.y - (1 - k) * 300, w: 150 * s / 1.25, a: k }); });
            const q = K.img(470, 560); K.text('≈ 8 LB', { x: q.x, y: q.y - 150, size: 60, color: 'gold', scale: popIn(K, t, at('milk') + .8) });
            K.text('ON EVERY SQUARE INCH', { y: 300, size: 70, scale: popIn(K, t, at('milk') + .9) }); }
          break; }
        case 'pane1': { shopDoug(); face(D, 'happy', t); D.pose({ t, gesture: 'tada', gw: K.ease((Lc - .3) / .4) });
          const p = K.img(690, 820), s = K.imgScale(), k = popIn(K, t, wordAt(K, 'pane', 'pane1'));
          K.prop('P01', { x: p.x, y: p.y + Math.sin(t * 2) * 8, w: 260 * s / 1.25 * k, rot: .08 });
          K.text('ONE THICK PANE', { y: 300, size: 84, color: 'gold', scale: popIn(K, t, wordAt(K, 'pane', 'pane1')) });
          K.text('(CLEAR PLASTIC)', { y: 395, size: 54, scale: popIn(K, t, wordAt(K, 'sheet', 'pane1')) }); break; }
        case 'victor': { shopDoug(); const u = K.clamp01(Lc / 1.0), [x0, z0] = K.floorAt(1020, 1250), [x1, z1] = K.floorAt(800, 1120);
          K.place('victor', K.lerp(x0, x1, u), 0, K.lerp(z0, z1, u), u < 1 ? -1.1 : -.5);
          face(V, 'flat', t, 2); V.pose({ t, walk: Lc * 1.3, walkAmt: 1 - K.ease((Lc - .8) / .3), gesture: Lc > 1 ? 'point' : undefined, gw: K.ease((Lc - 1) / .35), tilt: .15 * K.ease((Lc - 1.2) / .4) });
          face(D, Lc < 1.4 ? 'smile' : 'worried', t); D.pose({ t, look: .4 });
          const tc = wordAt(K, 'cracks', 'victor'); K.text('"AND IF IT CRACKS?"', { y: 300, size: 76, color: 'red', scale: popIn(K, t, tc - .5) }); break; }
        case 'pane2': { panes(K, { out: 1, bak: K.clamp01((Lc - .2) / .7) }); label(K, 'OUTSIDE PANE', CUT.outX + 40, 1060, { size: 46 });
          label(K, 'BACKUP PANE', CUT.bakX - 60, 400, { size: 50, color: 'gold', scale: popIn(K, t, at('pane2') + .6) }); break; }
        case 'backup': { shopDoug(); K.placeAt('victor', 800, 1120, -.5); face(V, 'smirk', t, 2); V.pose({ t, nod: .12 * Math.sin(K.clamp01(Lc / .6) * PI) });
          face(D, 'smile', t); D.pose({ t, gesture: 'hips', gw: 1, look: .35 });
          K.text('EVERY PLAN NEEDS', { y: 290, size: 70, scale: popIn(K, t, at('backup')) }); K.text('A BACKUP', { y: 380, size: 92, color: 'gold', scale: popIn(K, t, at('backup') + .3) }); break; }
        case 'seal': { const c = K.img(612, 372), s = K.imgScale(), u = K.clamp01(Lc / 1.6);
          K.prop('P01', { x: c.x, y: c.y, w: 70 * s, a: .9 });
          const a = -PI / 2 + u * 2 * PI, rx = 34 * s, ry = 52 * s;
          for (let i = 0; i < 40 * u; i++) { const b = -PI / 2 + i / 40 * 2 * PI; K.text('●', { x: c.x + Math.cos(b) * rx, y: c.y + Math.sin(b) * ry, size: 18, color: '#fff', stroke: 2, shadow: false }); }
          K.prop('P07', { x: c.x + Math.cos(a) * rx + 120, y: c.y + Math.sin(a) * ry + 20, w: 300, rot: -.25 });
          K.text('AIRTIGHT', { y: 300, size: 100, color: 'gold', scale: popIn(K, t, at('seal') + .6) }); break; }
        case 'bet': { shopDoug(); K.placeAt('victor', 800, 1120, -.5); face(D, 'happy', t); D.pose({ t, gesture: 'tada', gw: 1 }); face(V, 'flat', t, 2); V.pose({ t, gesture: 'cross', gw: 1 });
          K.text("I'D FLY ON IT", { y: 300, size: 88, color: 'gold', scale: popIn(K, t, at('bet') + .3) }); break; }
        case 'takeoff': { const u = K.clamp01(Lc / 1.2), [x0, z0] = K.floorAt(720, 760), [x1, z1] = K.floorAt(500, 1000);
          K.place('gary', K.lerp(x0, x1, u), 0, K.lerp(z0, z1, u), u < 1 ? .35 : -.4); face(G, 'smile', t);
          G.pose({ t, walk: Lc * 1.3, walkAmt: 1 - K.ease((Lc - 1) / .3), look: u >= 1 ? -.4 : 0 });
          K.text('WINDOW SEAT', { y: 300, size: 90, color: 'gold', scale: popIn(K, t, at('takeoff') + .3) }); break; }
        case 'fog': { seated(-.6); face(G, Lc < .4 ? 'smile' : 'surprised', t); G.pose({ t, look: -.6, lean: .05 });
          const c = K.img(WIN.cx, WIN.cy), s = K.imgScale(); K.prop('P03', { x: c.x, y: c.y, w: 445 * s, a: .7 * K.ease(Lc / .6) });
          K.text('FOG', { y: 300, size: 120, color: '#cfe8ff', scale: popIn(K, t, at('fog') + .2) }); sit(G); tray(K.shot.id === 'frost' ? '06' : '05'); break; }
        case 'frost': { seated(-.55); face(G, 'worried', t); G.pose({ t, look: -.55, lean: .12, armR: { raise: .7 + .15 * Math.sin(t * 9), fwd: -.6 }, handR: 'open' });
          K.text('FROST', { y: 300, size: 120, color: '#ffffff', scale: popIn(K, t, at('frost') + .1) }); sit(G); tray(K.shot.id === 'frost' ? '06' : '05'); break; }
        case 'why': case 'cold': { panes(K, { out: 1, bak: 1 }); damp(K, t, 1);
          label(K, 'DAMP AIR', 520, 1065, { size: 54, color: DAMP, scale: popIn(K, t, at('why') + .3) });
          if (id === 'cold') { frost(K, K.ease(K.clamp01((Lc - .8) / 1.2))); label(K, '−67°F', 700, 640, { size: 84, color: '#ffffff', scale: popIn(K, t, at('cold') + .4) });
            K.text('COLDER THAN A FREEZER', { y: 300, size: 70, scale: popIn(K, t, at('cold') + .3) }); }
          break; }
        case 'drill': { const [x, z] = K.floorAt(420, 1000); K.place('doug', x, 0, z, 1.2); face(D, 'smirk', t);
          D.pose({ t, armR: { fwd: -1.5, raise: .05 }, look: -.6 }); D.root.position.x += .01 * Math.sin(t * 40) * K.clamp01(Lc - .4);
          K.text('ONE TINY HOLE', { y: 300, size: 90, color: 'gold', scale: popIn(K, t, wordAt(K, 'hole', 'drill')) }); break; }
        case 'clear': { const u = K.clamp01(Lc / 1.8); panes(K, { out: 1, bak: 1, hole: true }); damp(K, t, 1, u); frost(K, 1 - u);
          holeRing(K, t, K.img(CUT.bakX, CUT.holeY), 26); label(K, 'HOLE', CUT.bakX - 120, CUT.holeY + 80, { size: 56, color: 'gold' });
          if (Lc > 1.2) K.text("FOG'S GONE", { y: 300, size: 96, scale: popIn(K, t, at('clear') + 1.2) }); break; }
        case 'job': { seated(-.5); face(G, 'smile', t); G.pose({ t, look: -.5, gesture: 'think', gw: K.ease(Lc / .4) });
          holeRing(K, t, K.img(...WIN.hole), 26); K.text('●', Object.assign(K.img(...WIN.hole), { size: 26, color: '#1a2230', stroke: 0, shadow: false }));
          K.text('A BIGGER JOB', { y: 300, size: 96, color: 'gold', scale: popIn(K, t, at('job') + .5) }); sit(G); tray(K.shot.id === 'frost' ? '06' : '05'); break; }
        case 'same': { panes(K, { out: 1, bak: 1, hole: true }); const k = K.ease(K.clamp01(Lc / .8));
          for (let i = 0; i < 3; i++) { const iy = K.lerp(560, 840, i / 2), a0 = K.img(CUT.bakX - 150, iy), a1 = K.img(CUT.bakX - 24, iy), b0 = K.img(CUT.bakX + 110, iy), b1 = K.img(CUT.bakX + 24, iy);
            arrow(K, a0.x, a0.y, a0.x + (a1.x - a0.x) * k, a1.y, { width: 10 }); arrow(K, b0.x, b0.y, b0.x + (b1.x - b0.x) * k, b1.y, { width: 10 }); }
          holeRing(K, t, K.img(CUT.bakX, CUT.holeY), 22);
          label(K, 'BACKUP PANE', CUT.bakX - 60, 400, { size: 50, color: 'gold' });
          const tn = wordAt(K, 'nothing', 'same'); if (t > tn - .1) K.text('FEELS NOTHING', { y: 300, size: 92, color: 'gold', scale: popIn(K, t, tn) }); break; }
        case 'outer': { panes(K, { out: 1, bak: 1, hole: true });
          for (let i = 0; i < 5; i++) { const iy = K.lerp(500, 940, i / 4), a0 = K.img(CUT.bakX + 30, iy), a1 = K.img(CUT.outX - 24, iy), k = K.ease(K.clamp01((Lc - i * .06) / .5));
            arrow(K, a0.x, a0.y, a0.x + (a1.x - a0.x) * k, a1.y, { width: 14 }); }
          label(K, 'OUTSIDE PANE', CUT.outX, 1060, { size: 50, color: 'gold' });
          K.text('TAKES ALL OF IT', { y: 300, size: 88, scale: popIn(K, t, at('outer') + .3) }); break; }
        case 'crack': { const tc = at('crack'), u = K.clamp01((t - tc) / .5); panes(K, { out: 1, bak: 1, hole: true, crack: u, glow: K.ease(K.clamp01((Lc - 1.6) / .6)) });
          // the push now lands on the backup pane; only a trickle squeezes through the tiny hole
          for (let i = 0; i < 3; i++) { const iy = K.lerp(560, 840, i / 2), a0 = K.img(CUT.bakX - 170, iy), a1 = K.img(CUT.bakX - 24, iy); arrow(K, a0.x, a0.y, a1.x, a1.y, { width: 14, a: K.clamp01((Lc - 1.4) / .4) }); }
          { const h = K.img(CUT.bakX, CUT.holeY), ph = (t * .8) % 1; K.text('●', { x: h.x + ph * 90, y: h.y, size: 18, color: AIR, stroke: 0, shadow: false, a: K.clamp01((Lc - 1.4) / .4) }); }
          holeRing(K, t, K.img(CUT.bakX, CUT.holeY), 22);
          K.text('CRACK!', { y: 300, size: 110, color: 'red', scale: popIn(K, t, tc + .1), rot: -.06 });
          if (Lc > 2.2) K.text('BACKUP TAKES OVER', { y: 410, size: 70, color: 'gold', scale: popIn(K, t, tc + 2.2) }); break; }
        case 'mirror': case 'question': case 'cta': {
          K.placeAt('doug', 250, 1110, .35); K.placeAt('victor', 470, 1060, .05); K.placeAt('gary', 700, 1100, -.35);
          // THE HELICOPTER ENDING (PLAYBOOK §1.12a): crosses on the mirror line; Doug, whose window worked, looks up
          const hu = id === 'mirror' ? K.helicopter(t, 'mirror', { y: 360, w: 520 }) : -1, up = hu < 0 ? 0 : Math.sin(PI * K.clamp01((hu - .05) / .85));
          face(D, up > .3 ? 'flat' : id === 'cta' ? 'smirk' : 'smile', t); D.pose({ t, nod: -.38 * up, gesture: id === 'cta' ? 'point' : up > .3 ? undefined : 'hips', gw: id === 'cta' ? K.ease((Lc - .3) / .35) : 1 - up });
          face(V, id === 'cta' ? 'smirk' : 'flat', t, 2); V.pose({ t, nod: -.2 * up, gesture: id === 'cta' ? 'cross' : undefined, gw: K.ease(Lc / .4) });
          face(G, 'smile', t, 1); G.pose({ t, nod: -.25 * up, gesture: id === 'question' ? 'point' : undefined, gw: K.ease(Lc / .35), look: id === 'question' ? -.3 : 0 });
          if (id === 'mirror') { const th = wordAt(K, 'hole', 'mirror'); if (t > th - .1) K.text('THIS ONE NEEDED A HOLE', { y: 430, size: 66, color: 'gold', scale: popIn(K, t, th) }); }
          if (id !== 'mirror') K.text('WINDOW OR AISLE?', { y: 300, size: 86, color: 'gold', scale: popIn(K, t, at('question') + .4) });
          break; }
      }
    },
  };
})();
