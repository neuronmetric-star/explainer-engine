// electric-car: plates + props + Doug. See shotlist.md for the plan.
// Positions are in plate world units (feet at y=0); props in screen px (y down); painting coords via K.img(ix,iy).
(function () {
  const PI = Math.PI;
  const face = (ch, name, t, off = 0) => ch.face(((t + off) % 4.1) < .12 && name !== 'happy' ? 'blink' : name);
  const WORDS = window.VIDEO_DATA.words;
  const norm = w => w.toLowerCase().replace(/[^a-z0-9]/g, '');
  const wordAt = (K, w, cue) => { const t0 = K.T(cue); const x = WORDS.find(o => o.start >= t0 - .01 && norm(o.w) === w); return x ? x.start : t0; };
  const popIn = (K, t, from, dur = .35) => K.pop(K.clamp01((t - from) / dur));
  const legs = (ch, v) => { ch.leg[1].hip.visible = v; ch.leg[-1].hip.visible = v; };

  // a polyline in painting px; returns point at fraction s (0..1)
  function poly(P) { const seg = []; let L = 0; for (let i = 0; i < P.length - 1; i++) { const d = Math.hypot(P[i + 1][0] - P[i][0], P[i + 1][1] - P[i][1]); seg.push(d); L += d; }
    return s => { s = Math.min(1, Math.max(0, s)); let d = s * L; for (let i = 0; i < seg.length; i++) { if (d <= seg[i] || i === seg.length - 1) { const u = seg[i] ? d / seg[i] : 0; return [P[i][0] + (P[i + 1][0] - P[i][0]) * u, P[i][1] + (P[i + 1][1] - P[i][1]) * u]; } d -= seg[i]; } }; }
  // battery (03) → cables → motor at the rear wheel
  const TO_MOTOR = poly([[560, 900], [330, 962], [230, 968], [195, 905], [115, 878]]);
  // wall charger (04) → cable → car
  const CHARGE = poly([[942, 760], [940, 950], [905, 1010], [865, 985], [845, 920], [812, 890]]);
  function dots(K, t, path, n, speed, dir = 1, size = 70) {
    const k = K.imgScale();
    for (let i = 0; i < n; i++) { let u = ((t * speed + i / n) % 1 + 1) % 1; if (dir < 0) u = 1 - u;
      const [x, y] = path(u), p = K.img(x, y); K.prop('P03', { x: p.x, y: p.y, w: size * k, a: Math.min(1, Math.min(u, 1 - u) * 8) }); } }
  function batteryGlow(K, t) { const k = K.imgScale();
    for (let r = 0; r < 2; r++) for (let c = 0; c < 8; c++) { const p = K.img(330 + c * 60, 868 + r * 50); K.prop('P03', { x: p.x, y: p.y, w: (60 + 14 * Math.sin(t * 4 + c + r * 2)) * k, a: .8 }); } }
  // the rotor spinning inside the motor's empty middle (06)
  function rotor(K, ang) { const p = K.img(532, 652); K.prop('P05', { x: p.x, y: p.y, w: 462 * K.imgScale(), rot: ang }); }

  // Doug inside the side-view car (P04, 1774×887; front window ≈ x 720–1000, y 200–360)
  function carDoug(K, t, x, z, opts = {}) {
    const d = K.place('doug', x, 0, z, PI / 2); d.blob.visible = false; legs(d, false);
    face(d, opts.face || 'happy', t); d.pose({ t, look: -1.0 });
    const hc = K.screenOf(d.head), top = K.worldToScreen(d.root.position.x, d.head.getWorldPosition(new THREE.Vector3()).y + d.B.R, z);
    const hr = Math.abs(hc.y - top.y), s = (2 * hr * 1.3) / 160;
    K.prop('P04', { x: hc.x, y: hc.y + hr * .35, w: 1774 * s, anchor: [880 / 1774, 300 / 887] });
    return { x: hc.x, y: hc.y, s };
  }

  window.SCENE = {
    plates: {
      '01': { img: '01_driveway_ev_day.png', hz: .44, vx: .5, fov0: 55, camH: 1.6, light: 'day' },
      '02': { img: '02_frunk_closeup.png', hz: .5, vx: .5, fov0: 55, camH: 1.6, light: 'day' },
      '03': { img: '03_ev_cutaway_side.png', hz: .5, vx: .5, fov0: 55, camH: 1.6, light: 'day' },
      '04': { img: '04_garage_charging.png', hz: .45, vx: .5, fov0: 55, camH: 1.6, light: 'interior' },
      '05': { img: '05_pedal_closeup.png', hz: .5, vx: .5, fov0: 55, camH: 1.6, light: 'interior' },
      '06': { img: '06_motor_cutaway_front.png', hz: .5, vx: .5, fov0: 55, camH: 1.6, light: 'night' },
      '07': { img: '07_gas_engine_cutaway.png', hz: .5, vx: .5, fov0: 55, camH: 1.6, light: 'interior' },
      '08': { img: '08_street_wide_morning.png', hz: .30, vx: .48, fov0: 55, camH: 2.3, light: 'day' },
    },
    props: { P01: 'P01_security_camera.png', P02: 'P02_little_computer.png', P03: 'P03_electron.png', P04: 'P04_ev_side.png',
      P05: 'P05_rotor.png', P06: 'P06_explosion.png', P07: 'P07_charge_bolt.png' },
    cast: { doug: 'hoodie' },
    shots: [
      { at: 'q', plate: '01', zoom: [1.0, 1.15], focus: [[.5, .5], [.45, .5]] },
      { at: 'card', plate: '01', zoom: [1.2, 1.3], focus: [[.55, .5], [.55, .5]] },
      { at: 'hood', plate: '02', zoom: [1.0, 1.2], focus: [[.5, .5], [.5, .55]] },
      { at: 'steal', plate: '01', zoom: [1.3, 1.35], focus: [[.65, .52], [.65, .52]] },
      { at: 'bet', plate: '01', zoom: [1.15, 1.2], focus: [[.6, .5], [.6, .5]] },
      { at: 'gas', plate: '07', zoom: [1.0, 1.1], focus: [[.5, .45], [.5, .42]] },
      { at: 'battery', plate: '03', zoom: [1.1, 1.5], focus: [[.5, .5], [.53, .58]] },
      { at: 'plug', plate: '04', zoom: [1.1, 1.3], focus: [[.6, .5], [.75, .55]] },
      { at: 'pedal', plate: '05', zoom: [1.0, 1.15], focus: [[.5, .5], [.5, .5]] },
      { at: 'computer', plate: '03', zoom: [1.1, 1.15], focus: [[.5, .5], [.5, .5]] },
      { at: 'flow', plate: '03', zoom: [1.3, 1.6], focus: [[.45, .57], [.25, .58]] },
      { at: 'magnets', plate: '06', zoom: [1.0, 1.2], focus: [[.5, .45], [.52, .42]] },
      { at: 'gearbox', plate: '08', zoom: [1.25, 1.3], focus: [[.5, .42], [.5, .42]] },
      { at: 'trip', plate: '03', zoom: [1.0, 1.05], focus: [[.5, .5], [.5, .52]] },
      { at: 'regen', plate: '03', zoom: [1.3, 1.4], focus: [[.35, .57], [.4, .57]] },
      { at: 'refill', plate: '08', zoom: [1.25, 1.3], focus: [[.5, .42], [.5, .42]] },
      { at: 'reveal', plate: '06', zoom: [1.0, 1.25], focus: [[.5, .45], [.52, .42]] },
      { at: 'end', plate: '08', zoom: [1.3, 1.35], focus: [[.5, .45], [.5, .45]] },
      { at: 'cta', plate: '01', zoom: [1.35, 1.35], focus: [[.6, .3], [.6, .3]] },
    ],
    shakes: [['pedal+0.6', .3, .5], ['gas+0.3', .25, .3]],
    flashes: [],
    follow: { from: 'cta+0.3' },
    tail: 2.6,

    update(t, K) {
      const D = K.cast.doug, id = K.shot.id, L = K.shot.local, at = c => K.T(c);
      legs(D, true); D.blob.visible = true;
      const stand = (ry = -.5) => K.place('doug', 1.0, 0, -6.6, ry);
      switch (id) {
        case 'q': stand(-.8); face(D, 'flat', t); D.pose({ t, look: -.6, nod: -.15 }); break;
        case 'card': stand(-.6); face(D, 'worried', t); D.pose({ t, gesture: 'hips', gw: K.ease((L - .3) / .4), look: -.5 }); break;
        case 'hood': break;
        case 'steal': stand(-.2); face(D, 'surprised', t); D.pose({ t, gesture: 'shrug', gw: K.ease(L / .3) }); break;
        case 'bet': { stand(-.2); face(D, 'worried', t); D.pose({ t, gesture: 'think', gw: K.ease(L / .4), look: .3, tilt: .1 });
          K.prop('P01', { x: 860, y: 330, w: 300 * popIn(K, t, at('bet') + .5), rot: Math.sin(t * 2) * .15, flip: true }); break; }
        case 'gas': { const p = K.img(510, 470), k = K.imgScale(), ph = (t * 2.2) % 1;
          K.prop('P06', { x: p.x, y: p.y, w: 420 * k * K.pop(K.clamp01(ph / .25)), a: 1 - K.clamp01((ph - .45) / .4) }); break; }
        case 'battery': batteryGlow(K, t); break;
        case 'plug': { dots(K, t, CHARGE, 6, .55, 1, 60); const tp = wordAt(K, 'plug', 'plug');
          K.prop('P07', { x: K.img(870, 640).x, y: K.img(870, 640).y, w: 180 * K.imgScale() * popIn(K, t, tp), a: .9 }); break; }
        case 'pedal': break;
        case 'computer': { batteryGlow(K, t); const p = K.img(512, 560);
          K.prop('P02', { x: p.x, y: p.y, w: 430 * K.imgScale() * popIn(K, t, at('computer') + .2), rot: Math.sin(t * 3) * .03 }); break; }
        case 'flow': batteryGlow(K, t); dots(K, t, TO_MOTOR, 7, .6); break;
        case 'magnets': rotor(K, (t - at('magnets')) * 3.2); break;
        case 'gearbox': { // the car rolls in: gentle, then harder
          const t0 = at('gearbox'), tg = at('gentle'), th = at('harder'), tt = at('trip');
          const x = t < tg ? K.lerp(-4.5, -2.8, (t - t0) / (tg - t0)) : t < th ? K.lerp(-2.8, -1.8, (t - tg) / (th - tg)) : K.lerp(-1.8, 5, Math.pow(K.clamp01((t - th) / (tt - th)), 1.4));
          carDoug(K, t, x, -22, { face: t > th ? 'happy' : 'smile' }); break; }
        case 'trip': batteryGlow(K, t); dots(K, t, TO_MOTOR, 9, .7); break;
        case 'regen': { batteryGlow(K, t); dots(K, t, TO_MOTOR, 7, .45, -1); break; }
        case 'refill': { // the car slows to a stop; a little bolt pops over it
          const u = K.clamp01(L / 2.2), x = -3.5 + 3.5 * (1 - Math.pow(1 - u, 2));
          const c = carDoug(K, t, x, -22, { face: 'smirk' }); K.prop('P07', { x: c.x, y: c.y - 110, w: 120 * popIn(K, t, wordAt(K, 'refill', 'refill')), a: .95 }); break; }
        case 'reveal': rotor(K, (t - at('reveal')) * 4); break;
        case 'end': carDoug(K, t, 0, -16, { face: 'happy' }); break;
        case 'cta': stand(-.15); face(D, 'smirk', t); D.pose({ t, gesture: 'shrug', gw: K.ease((L - .8) / .4) }); break;
      }
    },
  };
})();
