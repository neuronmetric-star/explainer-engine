// tractor-vs-ferrari: Brian's script. Plates + props + Ferruccio (polo), Enzo (suit), the mechanic (oxford). See shotlist.md.
// DRAFT written before the art arrived: plate presets (hz/camH), painting positions and car-window anchors are first
// guesses, to be calibrated against Brian's paintings with preview stills.
(function () {
  const PI = Math.PI;
  let K;
  const blinkFace = (ch, name, t, off = 0) => ch.face(((t + off) % 4.3) < .12 && name !== 'happy' ? 'blink' : name);
  const E = x => Math.max(0, Math.min(1, x)), S = x => { x = E(x); return x * x * (3 - 2 * x); };
  const G = {};
  const gp = (plate, ix, iy) => { const k = plate + ':' + ix + ':' + iy; return G[k] || (G[k] = K.ground(plate, ix, iy)); };
  function put(n, plate, ix, iy, ry = 0, dz = 0) { const g = gp(plate, ix, iy); return K.place(n, g.x, 0, g.z + dz, ry); }
  function walkTo(n, plate, A, B, t, t0, dur, stride = .9) {
    const a = gp(plate, ...A), b = gp(plate, ...B), u = S((t - t0) / dur), x = K.lerp(a.x, b.x, u), z = K.lerp(a.z, b.z, u);
    const dist = Math.hypot(b.x - a.x, b.z - a.z) * u, ry = Math.atan2(b.x - a.x, b.z - a.z);
    K.place(n, x, 0, z, ry); const moving = t > t0 && t < t0 + dur; return { walk: dist / stride, amt: moving ? Math.min(1, Math.sin(PI * E((t - t0) / dur)) * 2.5) : 0 };
  }
  const popW = (t, t0, w, d = .3) => w * K.pop(E((t - t0) / d));
  // side-view car prop on the road plate (02) driven by Ferruccio: he sits in 3D (legs hidden) at world x, and the car
  // prop is anchored so its green window opening sits on his head. WIN = window centre as a fraction of the prop image.
  const WIN = { P01: [.47, .33], P06: [.5, .38] };
  const legs = (ch, v) => { ch.leg[1].hip.visible = v; ch.leg[-1].hip.visible = v; };
  function carSide(t, prop, x, opts = {}) {
    const z = gp('02', 512, 1000).z, info = K.propInfo(prop), shake = (opts.shake || 0) * Math.sin(t * 70) * .012;
    if (opts.driver === false) { // parked, no driver: place by world x using a stand-in head height
      const p = K.worldToScreen(x, 1.2, z), top = K.worldToScreen(x, 1.54, z), hr = Math.abs(p.y - top.y), w = 2 * hr * 8.2;
      K.prop(prop, { x: p.x, y: p.y, w, anchor: WIN[prop] }); return { x: p.x, y: p.y, w }; }
    const F = K.cast.ferruccio; K.place('ferruccio', x, shake, z, PI / 2); F.blob.visible = false; legs(F, false);
    blinkFace(F, opts.face || 'happy', t); F.pose({ t, look: -1.1 });
    const hc = K.screenOf(F.head), top = K.worldToScreen(x, F.head.getWorldPosition(new THREE.Vector3()).y + F.B.R, z), hr = Math.abs(hc.y - top.y), w = 2 * hr * 8.2;
    K.prop(prop, { x: hc.x, y: hc.y + hr * .3, w, anchor: WIN[prop] });
    if (opts.puffs) K.puffs(t, hc.x - w * (WIN[prop][0] + .02), hc.y + hr * 2.2, opts.puffs, -1, 6);
    return { x: hc.x, y: hc.y, w };
  }

  window.SCENE = {
    plates: {
      '01': { img: '01_tractor_yard_day.png', hz: .45, vx: .5, fov0: 55, camH: 1.95, light: 'day' },
      '02': { img: '02_country_road_side.png', hz: .55, vx: .5, fov0: 55, camH: 1.6, light: 'day' },
      '03': { img: '03_workshop_day.png', hz: .32, vx: .5, fov0: 55, camH: 1.95, light: 'interior' },
      '04': { img: '04_workbench_closeup.png', hz: .2, vx: .5, fov0: 55, camH: 1.95, light: 'interior' },
      '05': { img: '05_enzo_office_day.png', hz: .32, vx: .5, fov0: 55, camH: 1.95, light: 'interior' },
      '06': { img: '06_new_factory_1963.png', hz: .45, vx: .5, fov0: 55, camH: 1.95, light: 'day' },
      '07': { img: '07_trattoria_evening.png', hz: .45, vx: .5, fov0: 55, camH: 1.95, light: 'day' },
      '08': { img: '08_miura_cutaway.png', hz: .5, vx: .5, fov0: 55, camH: 1.95, light: 'night' },
    },
    props: { P01: 'P01_ferrari_side.png', P02: 'P02_clutch_disc.png', P03: 'P03_price_tag.png', P04: 'P04_horse_badge.png', P05: 'P05_bull_badge.png', P06: 'P06_miura_side.png' },
    cast: { ferruccio: 'polo', enzo: 'suit', mechanic: 'oxford' },
    shots: [
      { at: 'q', plate: '07', zoom: [1.0, 1.1], focus: [[.5, .6], [.48, .62]] },
      { at: 'want', plate: '07', zoom: [1.15, 1.25], focus: [[.42, .62], [.42, .62]] },
      { at: 'before', plate: '01', zoom: [1.0, 1.08], focus: [[.5, .6], [.5, .62]] },
      { at: 'tractors', plate: '01', zoom: [1.1, 1.15], focus: [[.5, .6], [.5, .6]] },
      { at: 'fortune', plate: '01', zoom: [1.35, 1.5], focus: [[.5, .6], [.5, .6]] },
      { at: 'ferraris', plate: '02', zoom: [1.0, 1.0], focus: [[.5, .6], [.5, .6]] },
      { at: 'slip', plate: '02', zoom: [1.15, 1.2], focus: [[.5, .62], [.5, .62]] },
      { at: 'define', plate: '04', zoom: [1.0, 1.15], focus: [[.5, .5], [.5, .5]] },
      { at: 'louder', plate: '02', zoom: [1.3, 1.35], focus: [[.5, .62], [.5, .62]] },
      { at: 'barely', plate: '02', zoom: [1.0, 1.0], focus: [[.5, .6], [.5, .6]] },
      { at: 'shop', plate: '03', zoom: [1.0, 1.1], focus: [[.5, .58], [.48, .6]] },
      { at: 'driver', plate: '03', zoom: [1.35, 1.45], focus: [[.55, .58], [.55, .58]] },
      { at: 'same', plate: '04', zoom: [1.0, 1.05], focus: [[.5, .5], [.5, .5]] },
      { at: 'charged', plate: '04', zoom: [1.05, 1.1], focus: [[.5, .5], [.5, .5]] },
      { at: 'bet', plate: '03', zoom: [1.4, 1.5], focus: [[.45, .58], [.45, .58]] },
      { at: 'enzo', plate: '05', zoom: [1.0, 1.08], focus: [[.5, .58], [.5, .6]] },
      { at: 'tells', plate: '05', zoom: [1.3, 1.35], focus: [[.55, .55], [.55, .55]] },
      { at: 'insult', plate: '05', zoom: [1.7, 1.85], focus: [[.55, .5], [.55, .5]] },
      { at: 'aside', plate: '05', zoom: [1.6, 1.7], focus: [[.35, .55], [.35, .55]] },
      { at: 'fix', plate: '03', zoom: [1.15, 1.2], focus: [[.5, .6], [.5, .6]] },
      { at: 'company', plate: '06', zoom: [1.0, 1.12], focus: [[.5, .6], [.5, .62]] },
      { at: 'horse', plate: '04', zoom: [1.0, 1.0], focus: [[.5, .5], [.5, .5]] },
      { at: 'bull', plate: '04', zoom: [1.0, 1.0], focus: [[.5, .5], [.5, .5]] },
      { at: 'taurus', plate: '04', zoom: [1.0, 1.12], focus: [[.5, .5], [.6, .5]] },
      { at: 'miura', plate: '07', zoom: [1.0, 1.05], focus: [[.45, .62], [.45, .62]] },
      { at: 'low', plate: '07', zoom: [1.4, 1.55], focus: [[.4, .66], [.4, .68]] },
      { at: 'engine', plate: '08', zoom: [1.0, 1.35], focus: [[.5, .5], [.42, .5]] },
      { at: 'dinner', plate: '07', zoom: [1.05, 1.1], focus: [[.5, .6], [.5, .6]] },
      { at: 'appeal', plate: '07', zoom: [1.4, 1.5], focus: [[.6, .6], [.6, .6]] },
      { at: 'hear', plate: '02', zoom: [1.0, 1.0], focus: [[.5, .6], [.5, .6]] },
      { at: 'neighborhood', plate: '02', zoom: [1.1, 1.15], focus: [[.5, .6], [.5, .6]] },
      { at: 'end', plate: '05', zoom: [1.3, 1.45], focus: [[.55, .52], [.55, .52]] },
      { at: 'mirror', plate: '07', zoom: [1.0, 1.1], focus: [[.5, .62], [.5, .62]] },
      { at: 'cta', plate: '02', zoom: [1.0, 1.0], focus: [[.5, .6], [.5, .6]] },
      { at: 'pick', plate: '02', zoom: [1.0, 1.0], focus: [[.5, .6], [.5, .6]] },
    ],
    shakes: [['louder+0.1', .9, .25], ['bull+0.15', .3, .4], ['charged+0.4', .25, .3]],
    flashes: [],
    tail: 2.4,

    build(k) {
      K = k;
      for (const [n, txt] of [['lblF', 'FERRARI?'], ['lblL', 'LAMBORGHINI?']]) {
        const cv = document.createElement('canvas'); cv.width = 900; cv.height = 150; const x = cv.getContext('2d');
        x.font = '900 100px IN, sans-serif'; x.textAlign = 'center'; x.textBaseline = 'middle'; x.lineJoin = 'round';
        x.lineWidth = 24; x.strokeStyle = '#000'; x.strokeText(txt, 450, 78); x.fillStyle = '#ffd23a'; x.fillText(txt, 450, 78); K.addProp(n, cv); }
    },

    update(t, k) {
      K = k;
      const F = K.cast.ferruccio, En = K.cast.enzo, M = K.cast.mechanic, id = K.shot.id, L = K.shot.local, at = c => K.T(c);
      legs(F, true); F.blob.visible = true;
      switch (id) {
        // ---------- the Miura outside the trattoria ----------
        case 'q': case 'want': case 'miura': case 'low': case 'dinner': case 'appeal': case 'mirror': {
          put('ferruccio', '07', 700, 1130, -.4);
          const fx = { q: ['smirk', 'hips'], want: ['happy', 'tada'], miura: ['happy', null], low: ['smile', null], dinner: ['happy', 'wave'], appeal: ['smirk', null], mirror: ['smirk', 'cross'] }[id];
          blinkFace(F, fx[0], t); F.pose({ t, look: -.3, gesture: fx[1], gw: S((L - .2) / .35) }); break; }
        // ---------- tractor yard ----------
        case 'before': case 'tractors': case 'fortune': {
          if (id === 'before') { const w = walkTo('ferruccio', '01', [300, 1300], [480, 1120], t, at('before'), 1.6, .8); blinkFace(F, 'smile', t); F.pose({ t, walk: w.walk, walkAmt: w.amt }); }
          else { put('ferruccio', '01', 480, 1120, .1); blinkFace(F, id === 'fortune' ? 'happy' : 'smile', t);
            F.pose({ t, look: id === 'tractors' ? -.6 : 0, nod: id === 'fortune' ? .15 : 0, gesture: id === 'tractors' ? 'point' : null, gw: S((L - .2) / .3) }); }
          break; }
        // ---------- the Ferrari on the road ----------
        case 'ferraris': { const x = K.lerp(-9, 0, K.easeOut(E(L / 2.2))); carSide(t, 'P01', x, { face: 'happy', puffs: .5 }); break; }
        case 'slip': { carSide(t, 'P01', L * .25, { face: 'worried', shake: .6, puffs: .8 }); break; }
        case 'louder': { carSide(t, 'P01', .4 + L * .12, { face: 'surprised', shake: 1.4, puffs: 1.2 }); break; }
        case 'barely': { carSide(t, 'P01', .55 + L * .08, { face: 'flat', shake: .5, puffs: .6 }); break; }
        case 'hear': { const x = K.lerp(-10, 12, E(L / 1.6)); carSide(t, 'P06', x, { face: 'happy', shake: .3, puffs: .4 }); break; }
        case 'neighborhood': { carSide(t, 'P06', Math.sin(t * 2) * .05, { face: 'happy', shake: .25 }); break; }
        case 'cta': case 'pick': {
          carSide(t, 'P01', -2.3, { driver: false }); carSide(t, 'P06', 2.3, { driver: false });
          K.prop('lblF', { x: 300, y: 720, w: popW(t, at('pick'), 420) }); K.prop('lblL', { x: 790, y: 640, w: popW(t, at('pick') + .3, 520) }); break; }
        // ---------- the workbench: clutch discs, price tags, badges ----------
        case 'define': { const c = K.img(512, 760); K.prop('P02', { x: c.x, y: c.y, w: popW(t, at('define') + .2, 520), rot: (t - at('define')) * 1.5 }); break; }
        case 'same': case 'charged': {
          for (const [i, dx] of [[0, -230], [1, 230]]) { const c = K.img(512, 760); K.prop('P02', { x: c.x + dx, y: c.y - 60, w: popW(t, at('same') + i * .25, 380) }); }
          if (id === 'charged') { const c = K.img(512, 760);
            K.prop('P03', { x: c.x - 230, y: c.y + 230, w: popW(t, at('charged'), 90), rot: -.1 });
            K.prop('P03', { x: c.x + 230, y: c.y + 260, w: popW(t, at('charged') + .4, 360), rot: .12 }); }
          break; }
        case 'horse': case 'bull': case 'taurus': {
          const c = K.img(512, 760);
          K.prop('P04', { x: c.x - 220, y: c.y, w: popW(t, at('horse'), 380) });
          if (id !== 'horse') K.prop('P05', { x: c.x + 220, y: c.y, w: popW(t, at('bull'), 380) * (id === 'taurus' ? 1 + .25 * S(L / 1.2) : 1) });
          break; }
        // ---------- the workshop ----------
        case 'shop': case 'driver': case 'bet': case 'fix': {
          if (id === 'shop') { const w = walkTo('ferruccio', '03', [600, 1350], [560, 1150], t, at('shop'), 1.4, .8); blinkFace(F, 'worried', t); F.pose({ t, walk: w.walk, walkAmt: w.amt });
            const w2 = walkTo('mechanic', '03', [800, 1350], [740, 1140], t, at('shop') + .3, 1.4, .8); blinkFace(M, 'smile', t, 1); M.pose({ t, walk: w2.walk, walkAmt: w2.amt }); }
          else { put('ferruccio', '03', 560, 1150, -.3); put('mechanic', '03', 740, 1140, -.4);
            blinkFace(F, { driver: 'worried', bet: 'flat', fix: 'smirk' }[id], t); F.pose({ t, look: -.3, gesture: id === 'bet' ? 'cross' : id === 'fix' ? 'hips' : null, gw: S(L / .35) });
            blinkFace(M, { driver: 'surprised', bet: 'smirk', fix: 'happy' }[id], t, 1); M.pose({ t, look: -.4, gesture: id === 'driver' ? 'think' : null, gw: S(L / .35) }); }
          break; }
        // ---------- Enzo's office ----------
        case 'enzo': case 'tells': case 'insult': case 'aside': case 'end': {
          put('enzo', '05', 560, 1000, 0);
          if (id !== 'end') {
            if (id === 'enzo') { const w = walkTo('ferruccio', '05', [250, 1400], [330, 1180], t, at('enzo') + .2, 1.4, .8); blinkFace(F, 'flat', t); F.pose({ t, walk: w.walk, walkAmt: w.amt }); }
            else { put('ferruccio', '05', 330, 1180, .6); blinkFace(F, id === 'aside' ? (L > .8 ? 'smirk' : 'flat') : 'worried', t); F.pose({ t, look: .2 }); } }
          const ef = { enzo: 'smirk', tells: 'flat', insult: 'smirk', aside: 'flat', end: 'worried' }[id];
          blinkFace(En, ef, t, 1.5); En.pose({ t, look: id === 'end' ? .2 : -.35, tilt: id === 'tells' ? .1 : 0, gesture: id === 'insult' ? 'point' : null, gw: S((L - .3) / .3) });
          break; }
        // ---------- the new factory ----------
        case 'company': { const w = walkTo('ferruccio', '06', [350, 1300], [500, 1130], t, at('company'), 1.5, .8);
          blinkFace(F, 'happy', t); F.pose({ t, walk: w.walk, walkAmt: w.amt, gesture: L > 1.6 ? 'tada' : null, gw: S((L - 1.6) / .3) }); break; }
        // ---------- Miura cutaway ----------
        case 'engine': break;
      }
    },
  };
})();
