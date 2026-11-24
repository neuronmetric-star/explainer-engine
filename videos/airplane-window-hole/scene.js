// airplane-window-hole v3: "Why the heck do airplane windows have a tiny hole?" (plain-words script, Nov 24 2026)
// Smoothness pass (Brian, Nov 24: "not smooth enough"): whip-pans between places instead of hard cuts (SCENE.whip),
// shots on the same plate continue the camera, the cutaway (04) is animated (air streams, drifting wet air, growing frost),
// eased acting, and only a few words on screen. New: the DOOR shot (Doug and Gary push one door from both sides).
// Visual rules v3 (PLAYBOOK §3.5): cutaway plate that grows, color code (white = air, light blue = wet air, red = crack,
// gold = the hole / the spare), THE HECK? banner, helicopter ending. v1 scene kept in v1/scene.js.
(function () {
  const PI = Math.PI;
  const face = (ch, name, t, off = 0) => ch.face(((t + off) % 4.1) < .12 && name !== 'happy' ? 'blink' : name);
  const popIn = (K, t, from, dur = .35) => K.pop(K.clamp01((t - from) / dur));
  const WORDS = window.VIDEO_DATA.words, norm = w => w.toLowerCase().replace(/[^a-z0-9]/g, '');
  const wordAt = (K, w, cue) => { const t0 = K.T(cue); const x = WORDS.find(o => o.start >= t0 - .01 && norm(o.w) === w); return x ? x.start : t0; };

  const L = {
    shop: { key: [0xffcf90, 2.2, [-10, 8, 3]], hemi: [0xdfe8ff, 0x9a8070, .8], front: [0xfff0e2, 1.0], shadow: [0x3a3050, .38] },
    seat: { key: [0xfff0d8, 1.6, [-10, 4, 4]], hemi: [0xdfeaff, 0x7a8aa0, .9], front: [0xfff4ea, 1.1], shadow: [0x2a3050, .3] },
    frost: { key: [0xd8e4f4, 1.1, [-10, 4, 4]], hemi: [0xc8d4e8, 0x5a6478, .95], front: [0xe8eef8, 1.0], shadow: [0x1a2030, .3] },
    sunset: { key: [0xffb070, 2.6, [-12, 3, 2]], hemi: [0xffc8b0, 0x8a6a80, .8], front: [0xffe8dc, 1.0], shadow: [0x4a2a5a, .42] },
  };

  // ---------- the cutaway (04): image px. Cabin LEFT, sky RIGHT; the two layers stand in the slot, edge-on ----------
  const CUT = { top: 440, bot: 1000, outX: 588, inX: 452, holeY: 900 };
  const AIR = '#ffffff', WET = '#8fd3ff', GOLD = '#ffd23a', RED = '#ff3b30';
  function arrowHead(K, x1, y1, a, c, w, al) { const h = w * 2.6;
    K.line(x1, y1, x1 - h * Math.cos(a - .55), y1 - h * Math.sin(a - .55), { color: c, width: w, a: al });
    K.line(x1, y1, x1 - h * Math.cos(a + .55), y1 - h * Math.sin(a + .55), { color: c, width: w, a: al }); }
  // a FLOWING arrow: faint shaft + head + bright dots streaming along it (reads as moving air, not a slide graphic)
  function flow(K, t, x0, y0, x1, y1, o = {}) {
    const c = o.color || AIR, w = o.width || 10, al = o.a === undefined ? 1 : o.a, a = Math.atan2(y1 - y0, x1 - x0), sp = o.speed || 1.1;
    if (al <= .01) return;
    K.line(x0, y0, x1, y1, { color: c, width: w * .45, a: al * .55 }); arrowHead(K, x1, y1, a, c, w, al);
    for (let k = 0; k < 4; k++) { const u = ((t * sp + k / 4 + (o.ph || 0)) % 1); K.text('●', { x: K.lerp(x0, x1, u), y: K.lerp(y0, y1, u), size: w * 2.2, color: c, stroke: 0, shadow: false, a: al * Math.sin(u * PI) }); }
  }
  // st: { out: 0..1 (outside layer drops in), inn: 0..1 (inside layer slides in), hole: 0..1, crack: 0..1, glow: 0..1 }
  function layers(K, st) {
    const s = K.imgScale(), P = (ix, iy) => K.img(ix, iy);
    if (st.out > 0) { const dy = (1 - K.easeOut(st.out)) * -600, a = P(CUT.outX, CUT.top), b = P(CUT.outX, CUT.bot);
      K.line(a.x, a.y + dy, b.x, b.y + dy, { color: 'rgba(140,205,255,.92)', width: 30 * s / 1.25 });
      K.line(a.x - 8 * s, a.y + dy + 20, b.x - 8 * s, b.y + dy - 20, { color: 'rgba(255,255,255,.75)', width: 5 * s / 1.25 }); }
    if (st.inn > 0) { const x = K.lerp(CUT.inX - 300, CUT.inX, K.easeOut(st.inn)), a = P(x, CUT.top), b = P(x, CUT.bot), w = 18 * s / 1.25;
      const g = st.glow || 0, col = g > 0 ? `rgba(${Math.round(170 + 85 * g)},${Math.round(220 - 10 * g)},${Math.round(255 - 197 * g)},.92)` : 'rgba(170,220,255,.9)';
      const hh = 22 * (st.hole || 0);
      if (hh > 1) { const h0 = P(x, CUT.holeY - hh), h1 = P(x, CUT.holeY + hh); K.line(a.x, a.y, h0.x, h0.y, { color: col, width: w }); K.line(h1.x, h1.y, b.x, b.y, { color: col, width: w }); }
      else K.line(a.x, a.y, b.x, b.y, { color: col, width: w }); }
    if (st.crack > 0) { const pts = [[0, 560], [-14, 610], [12, 660], [-10, 720], [14, 780], [-6, 840]], n = Math.ceil(pts.length * st.crack);
      for (let i = 1; i < n; i++) { const p0 = P(CUT.outX + pts[i - 1][0], pts[i - 1][1]), p1 = P(CUT.outX + pts[i][0], pts[i][1]); K.line(p0.x, p0.y, p1.x, p1.y, { color: RED, width: 8 }); } }
  }
  const holeRing = (K, t, p, r = 26, a = 1) => { if (a > .01) K.text('◯', { x: p.x, y: p.y, size: r * 2.4 * (1 + .08 * Math.sin(t * 6)), color: GOLD, stroke: 6, a }); };
  const label = (K, str, ix, iy, o = {}) => { const p = K.img(ix, iy); return K.text(str, Object.assign({ x: p.x, y: p.y, size: 50, w: 520 }, o)); };
  // wet air: light-blue dots drifting in the gap; leave 0..1 = they squeeze out through the hole to the cabin side
  function wet(K, t, amt, leave = 0) {
    for (let i = 0; i < 16; i++) { const gx = K.lerp(CUT.inX + 24, CUT.outX - 26, (i * .37) % 1), gy = K.lerp(CUT.top + 40, CUT.bot - 40, (i * .61 + t * .05) % 1);
      let ix = gx + Math.sin(t * 1.3 + i) * 12, iy = gy + Math.cos(t * .9 + i * 2) * 10;
      if (leave > 0) { const u = K.clamp01(leave * 1.6 - i * .05); ix = K.lerp(ix, CUT.inX - 140 - i * 6, K.ease(u)); iy = K.lerp(iy, CUT.holeY + (i % 5 - 2) * 18, K.ease(Math.min(1, u * 1.4))); }
      const p = K.img(ix, iy); K.text('●', { x: p.x, y: p.y, size: 40, color: WET, stroke: 3, shadow: false, a: amt * (leave > 0 ? 1 - K.clamp01(leave * 1.2 - .6) : 1) }); }
  }
  function frost(K, amt) { if (amt <= .01) return; for (let i = 0; i < 9; i++) { const p = K.img(CUT.outX - 22, K.lerp(CUT.top + 50, CUT.bot - 50, i / 8));
      K.text('✱', { x: p.x, y: p.y, size: 34 + 12 * (i % 3), color: '#ffffff', stroke: 3, a: amt, scale: amt }); } }

  // window glass in 05/06 (image px): the hole near the bottom of the glass
  const WIN = { cx: 178, cy: 430, hole: [178, 650] };
  let DOOR = null;

  window.SCENE = {
    banner: 'THE HECK?',
    whip: true,
    plates: {
      '02': { img: '02_window_workshop.png', hz: .42, vx: .55, fov0: 55, camH: 1.4, light: L.shop },
      '03': { img: '03_sky_altitude_side.png', hz: .5, vx: .5, fov0: 55, camH: 1.5, light: 'day' },
      '04': { img: '04_window_cutaway.png', hz: .5, vx: .5, fov0: 55, camH: 1.5, light: 'interior' },
      '05': { img: '05_window_seat_clear.png', hz: .42, vx: .5, fov0: 55, camH: 1.25, light: L.seat },
      '06': { img: '06_window_seat_frosted.png', hz: .42, vx: .5, fov0: 55, camH: 1.25, light: L.frost },
      '07': { img: '07_tarmac_sunset.png', hz: .55, vx: .45, fov0: 55, camH: 1.3, light: L.sunset },
    },
    props: { TRAY5: '05_tray_front.cut.png', TRAY6: '06_tray_front.cut.png', P03: 'P03_frost_overlay.png', P04: 'P04_milk_jug.png',
      P01: 'P01_outside_pane.png', P07: 'P07_sealant_gun.png', P08: 'P08_airliner_side.png', H01: 'H01_helicopter.png' },
    cast: { doug: { outfit: 'hoodie', hat: 'hard', holdR: 'drill' }, gary: 'oxford' },
    // fewer, longer shots; same-plate neighbors continue the camera (each start = the previous end)
    shots: [
      { at: 'q', plate: '05', zoom: [1.02, 1.45], focus: [[.42, .5], [.24, .42]] },          // q → mistake: one slow push to the hole
      { at: 'card', plate: '02', zoom: [1.0, 1.1], focus: [[.5, .55], [.52, .58]] },
      { at: 'sky', plate: '03', zoom: [1.2, 1.0], focus: [[.5, .45], [.5, .5]] },            // sky → balloon: one pull-back
      { at: 'balloon', plate: '03', zoom: [1.0, 1.1], focus: [[.5, .5], [.5, .46]] },
      { at: 'push', plate: '04', zoom: [1.0, 1.12], focus: [[.45, .48], [.47, .49]] },        // push → tire: the cutaway builds
      { at: 'layers', plate: '04', zoom: [1.12, 1.25], focus: [[.47, .49], [.5, .5]] },
      { at: 'seal', plate: '02', zoom: [3.0, 2.4], focus: [[.6, .24], [.6, .28]] },           // seal → bet: one pull-back from the window
      { at: 'bet', plate: '02', zoom: [2.4, 1.15], focus: [[.6, .28], [.5, .55]] },
      { at: 'fog', plate: '05', zoom: [1.05, 1.12], focus: [[.42, .48], [.42, .46]] },
      { at: 'frost', plate: '06', zoom: [1.12, 1.18], focus: [[.42, .46], [.44, .46]] },      // same framing: the painting just gets colder
      { at: 'fault', plate: '04', zoom: [1.2, 1.35], focus: [[.5, .48], [.53, .48]] },        // fault → cold
      { at: 'drill', plate: '02', zoom: [1.25, 1.32], focus: [[.45, .5], [.45, .5]] },
      { at: 'clear', plate: '04', zoom: [1.35, 1.5], focus: [[.48, .54], [.45, .57]] },       // clear → same: hole, then the push both ways
      { at: 'same', plate: '04', zoom: [1.5, 1.25], focus: [[.45, .57], [.47, .5]] },
      { at: 'door', plate: '02', zoom: [1.4, 1.5], focus: [[.53, .54], [.53, .53]] },          // the door comparison
      { at: 'outer', plate: '04', zoom: [1.25, 1.4], focus: [[.52, .5], [.56, .49]] },        // outer → takeover: crack, the spare glows
      { at: 'crack', plate: '04', zoom: [1.4, 1.2], focus: [[.56, .49], [.5, .5]] },
      { at: 'mirror', plate: '07', zoom: [1.12, 1.18], focus: [[.42, .5], [.42, .5]] },
      { at: 'cta', plate: '07', zoom: [1.18, 1.2], focus: [[.42, .5], [.42, .5]] },
    ],
    shakes: [['milk+0.5', .25, .3], ['crack', .3, .45]],
    flashes: [],
    follow: { from: 'cta+0.3' },
    tail: 1.4,

    build(K) {   // the door for the comparison shot: a plain wooden door in a frame, standing on the workshop floor
      const g = new THREE.Group(), wood = new THREE.MeshStandardMaterial({ color: new THREE.Color(0xb07a48).convertSRGBToLinear(), roughness: .7 });
      const trim = new THREE.MeshStandardMaterial({ color: new THREE.Color(0xf2ead8).convertSRGBToLinear(), roughness: .6 });
      const brass = new THREE.MeshStandardMaterial({ color: new THREE.Color(0xd4a83a).convertSRGBToLinear(), roughness: .3, metalness: 1, envMap: K.env });
      const m = (geo, mat, x, y, z) => { const o = new THREE.Mesh(geo, mat); o.position.set(x, y, z); o.castShadow = o.receiveShadow = true; g.add(o); return o; };
      m(new THREE.BoxGeometry(.09, 2.3, 1.06), wood, 0, 1.15, 0);                                   // the door (edge toward the camera)
      for (const z of [-.6, .6]) m(new THREE.BoxGeometry(.16, 2.42, .12), trim, 0, 1.21, z);        // frame posts
      m(new THREE.BoxGeometry(.16, .12, 1.32), trim, 0, 2.38, 0);                                    // frame top
      for (const x of [-.07, .07]) m(new THREE.SphereGeometry(.05, 14, 10), brass, x, 1.05, .38);   // knobs, both sides
      g.visible = false; K.scene3D.add(g); DOOR = g;
    },

    update(t, K) {
      const id = K.shot.id, Lc = K.shot.local, at = c => K.T(c);
      const D = K.cast.doug, G = K.cast.gary;
      D.held[1].visible = id === 'drill'; if (DOOR) DOOR.visible = id === 'door';
      const sit = ch => { for (const k of [-1, 1]) { ch.leg[k].hip.rotation.x = -1.5; ch.leg[k].knee.rotation.x = 1.55; ch.leg[k].ankle.rotation.x = 0; } };
      const seated = () => K.place('gary', .27, -.55, -3.4, -.4);
      const tray = plate => { const p = K.img(400, 1160 + 188); K.prop(plate === '06' ? 'TRAY6' : 'TRAY5', { x: p.x, y: p.y, w: 800 * K.imgScale() }); };
      const sway = (k = 1) => ({ look: .06 * k * Math.sin(t * .7), tilt: .04 * k * Math.sin(t * .9 + 1) });   // idle life
      switch (id) {
        case 'q': { // one slow push from Gary to the hole; the hole lights up on "A tiny hole"
          seated(); const td = at('dot'), tm = at('mistake');
          face(G, t > tm ? 'smirk' : t > td ? 'surprised' : 'flat', t);
          G.pose({ t, look: -.55 + .1 * K.ease((t - tm) / .5), lean: .06 * K.ease((t - at('look')) / .6), tilt: .12 });
          sit(G); tray('05');
          const h = K.img(...WIN.hole); K.text('●', { x: h.x, y: h.y, size: 26, color: '#1a2230', stroke: 0, shadow: false }); holeRing(K, t, h, 26, K.ease((t - td) / .4));
          const a = K.clamp01((at('look') + .4 - t) / .3);
          K.text('WHY DO AIRPLANE WINDOWS', { y: 290, size: 66, a, scale: .8 + .2 * popIn(K, t, at('q')) });
          K.text('HAVE A HOLE?', { y: 380, size: 92, color: 'gold', a, scale: .8 + .2 * popIn(K, t, at('q') + .5) }); break; }
        case 'card': { const u = K.clamp01(Lc / 1.6), [x0, z0] = K.floorAt(220, 1180), [x1, z1] = K.floorAt(470, 1060);
          K.place('doug', K.lerp(x0, x1, u), 0, K.lerp(z0, z1, u), K.lerp(.9, .25, K.ease((Lc - 1.2) / .6)));
          face(D, t > wordAt(K, 'break', 'job') ? 'worried' : 'smile', t);
          D.pose(Object.assign({ t, walk: Lc * 1.3, walkAmt: 1 - K.ease((Lc - 1.3) / .5), gesture: 'hips', gw: K.ease((Lc - 1.8) / .5) }, sway())); break; }
        case 'sky': case 'balloon': {
          const u = K.easeOut(K.clamp01((t - at('sky')) / 1.6)), s = K.imgScale();
          const p = K.img(K.lerp(-220, 512, u), 640), sw = 1 + .1 * K.ease((t - at('balloon') - .2) / .8) + .015 * Math.sin(t * 4) * K.clamp01(t - at('balloon'));
          K.prop('P08', { x: p.x, y: p.y + 8 * Math.sin(t * 1.4), w: 900 * s / 1.25 * sw, rot: -.03 + .01 * Math.sin(t * 1.1) });
          if (t < at('thin') + 1.2) K.text('7 MILES UP', { y: 300, size: 92, a: K.clamp01((at('thin') + 1.2 - t) / .3), scale: popIn(K, t, at('sky') + .6) });
          // thin air: a few drifting dots up high, many down low
          const ta = K.ease((t - at('thin')) / .6) * (1 - K.ease((t - at('balloon') - .4) / .6));
          for (let i = 0; i < 42; i++) { const low = i < 32, iy = low ? K.lerp(1060, 1200, (i * .37) % 1) : K.lerp(300, 900, (i * .29) % 1);
            const fx = (((i * .618 + t * .01 * (i % 3 - 1)) % 1) + 1) % 1, q = K.img(fx * 1024, iy + 8 * Math.sin(t + i));
            K.text('●', { x: q.x, y: q.y, size: low ? 32 : 28, color: '#e8f6ff', stroke: 4, shadow: false, a: ta }); }
          if (id === 'balloon') { const k = K.ease((Lc - .3) / .6);
            for (let i = 0; i < 8; i++) { const a = i / 8 * 2 * PI, r0 = 300, r1 = r0 + 130; flow(K, t, p.x + Math.cos(a) * r0, p.y + Math.sin(a) * r0 * .45, p.x + Math.cos(a) * r1, p.y + Math.sin(a) * r1 * .45, { width: 11, a: k, ph: i * .13 }); } }
          break; }
        case 'push': case 'layers': {
          // the push: air streams from the cabin to the window slot (it presses on whatever stands there)
          const k = K.ease((t - at('push')) / .5), stop = t > at('layers') ? K.lerp(760, CUT.outX - 26, K.ease((t - at('layers') - .2) / .4)) : 760;
          for (let i = 0; i < 4; i++) { const iy = K.lerp(520, 920, i / 3), a = K.img(130, iy), b = K.img(K.lerp(160, stop, k), iy); flow(K, t, a.x, a.y, b.x, b.y, { width: 13, ph: i * .21 }); }
          if (t > at('milk') && t < at('layers') + .6) { const s = K.imgScale(), fade = 1 - K.ease((t - at('layers') - .1) / .5);
            [[400, 560], [540, 560], [400, 760], [540, 760], [400, 960], [540, 960]].forEach(([ix, iy], i) => { const q = K.img(ix, iy), kk = popIn(K, t, at('milk') + .1 + i * .09);
              K.prop('P04', { x: q.x, y: q.y - (1 - kk) * 300, w: 150 * s / 1.25, a: kk * fade }); });
            const q = K.img(470, 560); K.text('≈ 8 LB', { x: q.x, y: q.y - 150, size: 60, color: 'gold', a: fade, scale: popIn(K, t, at('milk') + .7) }); }
          if (id === 'layers') { layers(K, { out: K.clamp01((t - at('layers') - .2) / .6), inn: K.clamp01((t - at('spare') - .3) / .8) });
            if (t > at('tire') - .2) label(K, 'SPARE', CUT.inX - 70, 400, { size: 60, color: 'gold', scale: popIn(K, t, at('tire') - .2) }); }
          break; }
        case 'seal': case 'bet': {
          const c = K.img(612, 372), s = K.imgScale(), u = K.clamp01((t - at('seal')) / 1.5), a = -PI / 2 + u * 2 * PI, rx = 34 * s, ry = 52 * s;
          K.prop('P01', { x: c.x, y: c.y, w: 70 * s, a: .9 });
          for (let i = 0; i < 40 * u; i++) { const b = -PI / 2 + i / 40 * 2 * PI; K.text('●', { x: c.x + Math.cos(b) * rx, y: c.y + Math.sin(b) * ry, size: Math.max(6, 4 * s), color: '#fff', stroke: 1, shadow: false }); }
          if (u < 1) K.prop('P07', { x: c.x + Math.cos(a) * rx + 34 * s, y: c.y + Math.sin(a) * ry + 6 * s, w: 90 * s, rot: -.25 });
          if (id === 'bet') { K.placeAt('doug', 470, 1060, .25); face(D, 'happy', t); D.pose(Object.assign({ t, gesture: 'tada', gw: K.ease((Lc - .3) / .5) }, sway())); }
          break; }
        case 'fog': case 'frost': { // one framing; the painted window goes from foggy (overlay) to frozen (plate 06)
          seated(); const tp = at('paid');
          face(G, t < tp ? 'surprised' : id === 'frost' ? 'worried' : 'flat', t);
          G.pose({ t, look: t > tp && t < tp + 1.2 ? -.05 : -.55, lean: .1, armR: id === 'frost' ? { raise: .7 + .15 * Math.sin(t * 9), fwd: -.6 } : undefined, handR: id === 'frost' ? 'open' : undefined });
          sit(G); if (id === 'fog') { const c = K.img(WIN.cx, WIN.cy), s = K.imgScale(); K.prop('P03', { x: c.x, y: c.y, w: 445 * s, a: .8 * K.ease(Lc / 1.2) }); }
          tray(id === 'frost' ? '06' : '05'); break; }
        case 'fault': { const k = K.ease(Lc / .5); layers(K, { out: 1, inn: 1 }); wet(K, t, k);
          frost(K, K.ease((t - at('cold') - .3) / 1.4));
          if (t > at('cold') + .2) label(K, '−67°F', 700, 640, { size: 84, color: '#ffffff', scale: popIn(K, t, at('cold') + .2) }); break; }
        case 'drill': { const [x, z] = K.floorAt(420, 1000); K.place('doug', x, 0, z, 1.2); face(D, Lc < .6 ? 'smile' : 'smirk', t);
          const reach = K.ease((Lc - .2) / .5); D.pose({ t, armR: { fwd: -1.5 * reach, raise: .05 }, look: -.6 * reach, lean: .06 * reach });
          D.root.position.x += .008 * Math.sin(t * 40) * K.clamp01((Lc - .8) * 3); break; }
        case 'clear': case 'same': {
          const hk = K.ease((t - at('clear') + .1) / .5), lv = K.clamp01((t - at('clear')) / 1.8);
          layers(K, { out: 1, inn: 1, hole: hk }); if (id === 'clear') { wet(K, t, 1, lv); frost(K, 1 - lv); }
          holeRing(K, t, K.img(CUT.inX, CUT.holeY), 24, hk); if (id === 'clear') label(K, 'HOLE', CUT.inX - 130, CUT.holeY + 70, { size: 58, color: 'gold', scale: popIn(K, t, at('clear')) });
          if (id === 'same') { const k = K.ease(Lc / .8);
            for (let i = 0; i < 3; i++) { const iy = K.lerp(560, 840, i / 2), a0 = K.img(CUT.inX - 170, iy), a1 = K.img(CUT.inX - 24, iy), b0 = K.img(CUT.inX + 120, iy), b1 = K.img(CUT.inX + 24, iy);
              flow(K, t, a0.x, a0.y, a1.x, a1.y, { width: 10, a: k, ph: i * .3 }); flow(K, t, b0.x, b0.y, b1.x, b1.y, { width: 10, a: k, ph: i * .3 + .5 }); } }
          break; }
        case 'door': { // two people push one door from opposite sides: it doesn't move
          const [dx, dz] = K.floorAt(560, 900); DOOR.position.set(dx, 0, dz); DOOR.rotation.y = -.35;
          const lean = K.ease((Lc - .2) / .6), strain = Math.sin(t * 7) * .02 * lean;
          const side = k => { const ang = DOOR.rotation.y, r = .62 + .05 * (1 - lean); return [dx + k * Math.cos(ang) * r, dz - k * Math.sin(ang) * r]; };
          { const [x, z] = side(-1); K.place('doug', x, 0, z, PI / 2 - .35); face(D, t > at('still') ? 'worried' : 'flat', t);
            D.pose({ t, lean: .28 * lean + strain, armR: { fwd: -1.35 * lean, raise: .05 }, armL: { fwd: -1.35 * lean, raise: .05 }, handR: 'open', handL: 'open' }); }
          { const [x, z] = side(1); K.place('gary', x, 0, z, -PI / 2 - .35); face(G, t > at('still') ? 'surprised' : 'flat', t, 1);
            G.pose({ t, lean: .28 * lean - strain, armR: { fwd: -1.35 * lean, raise: .05 }, armL: { fwd: -1.35 * lean, raise: .05 }, handR: 'open', handL: 'open' }); }
          { const [x0] = side(-1), [x1] = side(1), y = 1.3, k = K.ease((Lc - .4) / .5);   // the two pushes meet at the door
            const a0 = K.worldToScreen(x0, y, dz), d0 = K.worldToScreen(dx - .08, y, dz), a1 = K.worldToScreen(x1, y, dz), d1 = K.worldToScreen(dx + .08, y, dz);
            if (k > .01) { flow(K, t, a0.x - 140, a0.y, d0.x - 6, d0.y, { width: 12, a: k }); flow(K, t, a1.x + 140, a1.y, d1.x + 6, d1.y, { width: 12, a: k, ph: .5 }); } }
          break; }
        case 'outer': case 'crack': {
          const tc = at('crack'), cr = K.clamp01((t - tc) / .5), gl = K.ease((t - at('takeover') + .1) / .6);
          layers(K, { out: 1, inn: 1, hole: 1, crack: cr, glow: gl });
          // before the crack: the push lands on the outside layer; after it: on the inside layer (the spare), a trickle through the hole
          const toOut = 1 - K.ease((t - tc) / .4), toIn = K.ease((t - at('trickle')) / .5);
          for (let i = 0; i < 5; i++) { const iy = K.lerp(500, 940, i / 4), a0 = K.img(CUT.inX + 30, iy), a1 = K.img(CUT.outX - 24, iy), k = K.ease(K.clamp01((t - at('outer') - i * .06) / .5));
            flow(K, t, a0.x, a0.y, a0.x + (a1.x - a0.x) * k, a1.y, { width: 13, a: toOut, ph: i * .2 }); }
          for (let i = 0; i < 3; i++) { const iy = K.lerp(560, 840, i / 2), a0 = K.img(CUT.inX - 180, iy), a1 = K.img(CUT.inX - 24, iy); flow(K, t, a0.x, a0.y, a1.x, a1.y, { width: 13, a: toIn, ph: i * .3 }); }
          { const h = K.img(CUT.inX, CUT.holeY), ph = (t * .5) % 1; if (toIn > .01) K.text('●', { x: h.x + ph * 90, y: h.y, size: 16, color: AIR, stroke: 0, shadow: false, a: toIn * (1 - ph) }); }
          holeRing(K, t, K.img(CUT.inX, CUT.holeY), 22);
          if (t > at('takeover')) label(K, 'SPARE', CUT.inX - 70, 400, { size: 64, color: 'gold', scale: popIn(K, t, at('takeover')) });
          break; }
        case 'mirror': case 'cta': {
          K.placeAt('doug', 300, 1110, .3); K.placeAt('gary', 640, 1090, -.3);
          // THE HELICOPTER ENDING (PLAYBOOK §1.12a): crosses on the mirror line; Doug, whose window worked, looks up
          const hu = t < at('question') ? K.helicopter(t, 'mirror', { y: 360, w: 520 }) : -1, up = hu < 0 ? 0 : Math.sin(PI * K.clamp01((hu - .05) / .85));
          face(D, up > .3 ? 'flat' : id === 'cta' ? 'smirk' : 'smile', t);
          D.pose(Object.assign({ t, nod: -.38 * up, gesture: id === 'cta' ? 'point' : 'hips', gw: id === 'cta' ? K.ease((Lc - .3) / .4) : 1 - up }, sway(1 - up)));
          const tq = at('question'); face(G, 'smile', t, 1);
          G.pose(Object.assign({ t, nod: -.25 * up, gesture: t > tq && id !== 'cta' ? 'point' : undefined, gw: K.ease((t - tq) / .4) }, sway(1 - up), { look: t > tq ? -.25 : 0 }));
          const tb = wordAt(K, 'backup', 'mirror'); if (t > tb - .1 && t < tq) K.text('BACKUP PLAN', { y: 430, size: 86, color: 'gold', scale: popIn(K, t, tb) });
          if (t > tq) K.text('WINDOW OR AISLE?', { y: 300, size: 86, color: 'gold', scale: popIn(K, t, tq + .3) });
          break; }
      }
    },
  };
})();
