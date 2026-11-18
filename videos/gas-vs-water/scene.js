// gas-vs-water: plates + props + Doug & Gary. See shotlist.md for the plan.
// Positions are in plate world units (feet at y=0); props in screen px; painting coords via K.img(ix,iy).
(function () {
  const PI = Math.PI;
  // blink every ~4 s unless a scene asks for a specific frame
  const face = (ch, name, t, off = 0) => ch.face(((t + off) % 4.1) < .12 && name !== 'happy' ? 'blink' : name);

  // Doug inside the side-view car: place him in 3D, then fit the car sprite around his head
  function carDoug(K, t, x, z, puff, opts = {}) {
    const d = K.place('doug', x, 0, z, PI / 2); d.blob.visible = false; legs(d, false);
    face(d, opts.face || 'happy', t);
    d.pose({ t, look: -1.0, gesture: opts.wave ? 'wave' : null, gw: opts.wave ? 1 : 0 });
    const hc = K.screenOf(d.head), top = K.worldToScreen(d.root.position.x, d.head.getWorldPosition(new THREE.Vector3()).y + d.B.R, z);
    const hr = Math.abs(hc.y - top.y), s = (2 * hr * 1.25) / 170, w = 1024 * s;
    const cx = hc.x, cy = hc.y + hr * .3;
    K.prop('P01', { x: cx, y: cy, w, anchor: [590 / 1024, 680 / 1536] });
    K.puffs(t, cx + (25 - 590) * s, cy + (1030 - 680) * s, puff * s * 4.2, -1, 6);
    return { cx, cy, s };
  }
  const legs = (ch, v) => { ch.leg[1].hip.visible = v; ch.leg[-1].hip.visible = v; };
  // water drop loop from a painting point
  function drip(K, t, ix, iy, fall, w, period = .9) {
    const u = (t % period) / period, p0 = K.img(ix, iy), k = K.imgScale();
    K.prop('P03', { x: p0.x, y: p0.y + u * fall * k, w: w * k * (u < .15 ? u / .15 : 1), a: u > .85 ? (1 - u) / .15 : 1 });
  }

  window.SCENE = {
    plates: {
      '01': { img: '01_street_wide_morning.png', hz: .30, vx: .48, fov0: 55, camH: 2.3, light: 'day' },
      '02': { img: '02_driveway_rear_morning.png', hz: .27, vx: .5, fov0: 55, camH: 2.4, light: 'day' },
      '03': { img: '03_driveway_hose_day.png', hz: .27, vx: .5, fov0: 55, camH: 2.4, light: 'day' },
      '04': { img: '04_porch_medium_day.png', hz: .40, vx: .5, fov0: 55, camH: 1.7, light: 'day' },
      '05': { img: '05_intersection_wide_day.png', hz: .46, vx: .5, fov0: 55, camH: 1.9, light: 'day' },
      '06': { img: '06_engine_cutaway.png', light: 'interior' },
      '07': { img: '07_campsite_night.png', hz: .44, vx: .5, fov0: 55, camH: 1.9, light: 'night' },
      '08': { img: '08_garage_interior_day.png', hz: .48, vx: .5, fov0: 55, camH: 1.8, light: 'interior' },
    },
    props: { P01: 'P01_car_side.png', P02: 'P02_tow_truck.png', P03: 'P03_water_drop.png', P04: 'P04_gas_drop.png', P05: 'P05_piston.png',
      P06: 'P06_crankshaft.png', P07: 'P07_explosion.png', P08: 'P08_gas_can.png', P09: 'P09_water_jug.png', P10: 'P10_fish_bucket.png',
      P11: 'P11_electrolysis_gag.png', P12: 'P12_lit_match.png' },
    cast: { doug: 'hoodie', gary: 'oxford' },
    shots: [
      { at: 'q', plate: '02', zoom: [1.0, 1.15], focus: [[.5, .5], [.55, .5]] },
      { at: 'problem', plate: '01', zoom: [1.0, 1.1], focus: [[.5, .5], [.42, .55]] },
      { at: 'drip', plate: '02', zoom: [1.6, 1.75], focus: [[.625, .47], [.625, .47]] },
      { at: 'logic', plate: '01', zoom: [1.3, 1.42], focus: [[.42, .45], [.42, .47]] },
      { at: 'gary', plate: '04', zoom: [1.15, 1.2], focus: [[.5, .55], [.5, .55]] },
      { at: 'yes', plate: '01', zoom: [1.45, 1.5], focus: [[.42, .46], [.42, .46]] },
      { at: 'hose', plate: '03', zoom: [1.0, 1.12], focus: [[.5, .5], [.55, .48]] },
      { at: 'start', plate: '01', zoom: [1.0, 1.05], focus: [[.5, .5], [.5, .5]] },
      { at: 'bet', plate: '04', zoom: [1.1, 1.1], focus: [[.5, .55], [.5, .55]] },
      { at: 'watch', plate: '04', zoom: [1.1, 1.3], focus: [[.5, .55], [.5, .5]] },
      { at: 'small', plate: '05', zoom: [1.0, 1.08], focus: [[.5, .55], [.5, .55]] },
      { at: 'aside', plate: '06', zoom: [1.0, 1.1], focus: [[.5, .45], [.5, .4]] },
      { at: 'piston', plate: '06', zoom: [1.1, 1.0], focus: [[.5, .4], [.5, .5]] },
      { at: 'gallon', plate: '04', zoom: [1.1, 1.15], focus: [[.5, .55], [.5, .55]] },
      { at: 'callback', plate: '02', zoom: [1.6, 1.7], focus: [[.625, .47], [.625, .47]] },
      { at: 'ash', plate: '07', zoom: [1.1, 1.25], focus: [[.45, .55], [.4, .6]] },
      { at: 'split', plate: '08', zoom: [1.05, 1.12], focus: [[.5, .55], [.55, .55]] },
      { at: 'tow', plate: '05', zoom: [1.0, 1.0], focus: [[.5, .55], [.5, .55]] },
      { at: 'tow+1.6', plate: '08', zoom: [1.1, 1.15], focus: [[.5, .6], [.5, .6]] },
      { at: 'end', plate: '04', zoom: [1.0, 1.05], focus: [[.5, .5], [.5, .5]] },
    ],
    shakes: [['bang', .5, 1]],
    flashes: [['bang', .3, .55]],
    follow: { from: 'cta+0.3' },
    tail: 2.6,

    update(t, K) {
      const D = K.cast.doug, G = K.cast.gary, id = K.shot.id, L = K.shot.local, at = c => K.T(c);
      legs(D, true); D.blob.visible = true;
      switch (id) {
        case 'q': { // Doug stares at the drip
          K.place('doug', -.7, 0, -6.3, .55); face(D, 'flat', t); D.pose({ t, look: .35, tilt: .15, nod: -.12 });
          drip(K, t, 641, 700, 70, 26); break; }
        case 'problem': {
          K.place('doug', -1.4, 0, -8, .25); face(D, 'smile', t);
          D.pose({ t, gesture: 'hips', gw: K.ease((t - at('problem') - 2.5) / .4) }); break; }
        case 'drip': drip(K, t, 641, 700, 70, 26, 1.1); break;
        case 'logic': {
          K.place('doug', -1.4, 0, -8, .25);
          const pt = t > at('logic') + 2.6; face(D, t > at('logic') + 4.2 ? 'smirk' : 'smile', t);
          D.pose({ t, gesture: pt ? 'point' : 'think', gw: 1, look: pt ? 0 : .2 }); break; }
        case 'gary': case 'bet': case 'watch': case 'gallon': {
          K.place('gary', .3, 0, -6, -.25);
          if (id === 'gary') { face(G, 'flat', t); G.pose({ t, gesture: 'cross', look: Math.sin(L * 9) * .12 }); }
          if (id === 'bet') { face(G, 'flat', t, 1); G.pose({ t, gesture: 'cross', look: .3 }); }
          if (id === 'watch') { face(G, L > 2.5 ? 'worried' : 'flat', t); G.pose({ t, lean: .1, look: .55, tilt: .1, gesture: 'think', gw: K.ease(L / .5) }); }
          if (id === 'gallon') { face(G, 'smirk', t); G.pose({ t, gesture: 'point', gw: K.ease(L / .4), look: .3 });
            const p = K.pop(K.clamp01(L / .35)), q = K.pop(K.clamp01((L - .8) / .35));
            K.prop('P08', { x: 300, y: 1000, w: 300 * p, layer: 'front' }); K.prop('P09', { x: 790, y: 1000, w: 300 * q, layer: 'front' }); }
          break; }
        case 'yes': K.place('doug', -1.4, 0, -8, .25); face(D, 'smirk', t); D.pose({ t, gesture: 'hips' }); break;
        case 'hose': K.place('doug', -.6, 0, -5.6, .7); face(D, 'happy', t); D.pose({ t, gesture: 'tada', gw: K.ease(L / .4), look: .4 }); break;
        case 'start': { // drive across the street, big puffs, wave once rolling
          const u = (t - at('start')) / (at('bet') - at('start'));
          carDoug(K, t, -3.6 + 7 * K.ease(u), -11, 1, { wave: t > at('wave'), face: 'happy' }); break; }
        case 'small': { // into the intersection, puffs shrinking, stops on "stall"
          const stopT = at('stall'), u = K.clamp01((t - at('small')) / (stopT - at('small')));
          const x = -9 + 9 * (1 - Math.pow(1 - u, 2)), puff = t < at('until') ? 1 - .7 * K.clamp01((t - at('small')) / (at('until') - at('small'))) : .3 * (1 - K.clamp01((t - at('until')) / 2.5));
          carDoug(K, t, x, -15, puff, { face: t > stopT + .35 ? 'worried' : t > stopT ? 'blink' : 'smile' }); break; }
        case 'aside': case 'piston': { engine(K, t); break; }
        case 'callback': drip(K, t, 641, 700, 70, 26, 1.1); break;
        case 'ash': { // Doug tries to light the ashes
          K.place('doug', .25, 0, -6.6, -.5); face(D, L > 6 ? 'worried' : 'smile', t);
          D.pose({ t, armR: { raise: .25, fwd: -.9 }, look: -.2, nod: -.15 });
          const h = K.screenOf(D.arm[1].wr), drop = K.clamp01((L - 7) / .6);
          K.prop('P12', { x: h.x + 10, y: h.y - 40 + drop * 260, w: 120, rot: .3 + drop * 1.8 + Math.sin(L * 5) * .05, a: 1 - drop * .6 }); break; }
        case 'split': {
          K.place('gary', -1.3, 0, -6.5, .35); face(G, 'flat', t); G.pose({ t, gesture: 'shrug', gw: K.ease((L - 1.5) / .4) });
          K.prop('P11', { x: 760, y: 1160, w: 380 * K.pop(K.clamp01(L / .35)), layer: 'back' }); break; }
        case 'tow': { // stalled car, tow truck rolls in from the right
          carDoug(K, t, 0, -15, 0, { face: 'worried' });
          K.prop('P02', { x: 1250 - 520 * K.easeOut(L / 1.2), y: 1000, w: 520, layer: 'front' }); break; }
        case 'tow+1.6': {
          K.place('doug', -1.2, 0, -6, .4); face(D, 'worried', t); D.pose({ t, gesture: 'facepalm', gw: K.ease((L - .3) / .4) });
          K.prop('P10', { x: 720, y: 1180, w: 340 * K.pop(K.clamp01(L / .3)), layer: 'back' }); break; }
        case 'end': { // over-the-shoulder: Doug in front, Gary smug on the porch, then CTA
          K.place('gary', .5, 0, -7, -.3); K.place('doug', -.85, 0, -3.4, PI - .65);
          const cta = t > at('cta') + .9; face(G, 'smirk', t); G.pose({ t, gesture: cta ? 'point' : 'cross', look: cta ? -.25 : -.2 });
          face(D, 'worried', t); D.pose({ t, gesture: cta ? 'shrug' : null, gw: 1, look: .3 }); break; }
      }
    },
  };

  // ---- the engine cutaway: drop → mist → squeeze → spark → BOOM → piston/crank loop → exhaust ----
  function engine(K, t) {
    const at = c => K.T(c), k = K.imgScale();
    const tSpark = at('spark'), tBang = at('bang'), tRate = at('rate'), tLeft = at('leftovers');
    // crank angle: idle at BDC until the spark, rise to TDC at the bang, slam down, then keep spinning
    let th;
    if (t < tSpark) th = PI;
    else if (t < tBang) th = PI + PI * K.ease((t - tSpark) / (tBang - tSpark));
    else if (t < tBang + .45) th = 2 * PI + PI * K.easeOut((t - tBang) / .45);
    else { const s = t - tBang - .45, w = t < tRate ? 2.2 : 2.2 + Math.min(1, (t - tRate) / 1.5) * 4.5; th = 3 * PI + s * w * PI; }
    const top = 540 + 170 * (1 - Math.cos(th)), sp = .55, pis = K.img(510, top);
    K.prop('P05', { x: pis.x, y: pis.y, w: 1024 * sp * k, anchor: [512 / 1024, 50 / 1536], layer: 'front' });
    const cc = K.img(512, 1403);
    K.prop('P06', { x: cc.x, y: cc.y, w: 2 * 312 * k, rot: th, layer: 'front' });
    // the gas drop travels in through the injector, then becomes mist
    if (t < tSpark + .4 && t > at('boom') + 1.2) {
      const u = K.clamp01((t - at('boom') - 1.2) / 1.6), a = K.img(80, 420), b = K.img(325, 492);
      K.prop('P04', { x: K.lerp(a.x, b.x, u), y: K.lerp(a.y, b.y, u), w: 70 * k * (t < tSpark ? 1 : 1 - (t - tSpark) / .4), layer: 'front' }); }
    if (t > tSpark && t < tBang + .1) { const sq = K.ease((t - tSpark) / (tBang - tSpark));
      for (let i = 0; i < 16; i++) { const ang = i * 2.4, r = (1 - .55 * sq) * (60 + (i * 37) % 90), p = K.img(510 + Math.cos(ang) * r * 1.4, 460 + Math.sin(ang) * r * .7 + 60 * (1 - sq));
        K.prop('P04', { x: p.x, y: p.y, w: 22 * k, a: K.clamp01((t - tSpark) / .3), layer: 'front' }); } }
    // spark flicker just before the bang, then the explosion
    if (t > tBang - .35 && t < tBang) { const p = K.img(528, 368); K.prop('P07', { x: p.x, y: p.y, w: (40 + 30 * Math.sin(t * 80)) * k, layer: 'front' }); }
    if (t >= tBang && t < tBang + .7) { const u = (t - tBang) / .7, p = K.img(510, 470); K.prop('P07', { x: p.x, y: p.y, w: 520 * k * K.pop(K.clamp01(u / .25)), a: 1 - K.clamp01((u - .5) / .5), layer: 'front' }); }
    // later firings: small burst each time the piston reaches the top
    if (t > tBang + .7) { const ph = ((th / (2 * PI)) % 1 + 1) % 1; if (ph < .12) { const p = K.img(510, 470); K.prop('P07', { x: p.x, y: p.y, w: 300 * k * (1 - ph / .12), a: 1 - ph / .12, layer: 'front' }); } }
    // leftovers: exhaust puffs + water drops out of the exhaust port
    if (t > tLeft - .3) { const e = K.img(790, 432); K.puffs(t, e.x, e.y, 1.9, 1, 5);
      for (let i = 0; i < 3; i++) { const u = ((t - tLeft) * .9 + i / 3) % 1; K.prop('P03', { x: e.x + u * 170, y: e.y + 10 + u * 90, w: 40 * k, a: 1 - u, layer: 'front' }); } }
  }
})();
