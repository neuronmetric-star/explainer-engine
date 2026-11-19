// cats-vs-dogs: Brian's pet-swap script. Plates + props + Doug, Gary, Biscuit (dog), Kevin (cat). See shotlist.md.
// Positions are painting pixels (1024x1536) turned into ground points with K.ground(plate, ix, iy).
(function () {
  const PI = Math.PI;
  let K;
  const blinkFace = (ch, name, t, off = 0) => ch.face(((t + off) % 4.3) < .12 && name !== 'happy' && name !== 'sleepy' ? 'blink' : name);
  const E = x => Math.max(0, Math.min(1, x)), S = x => { x = E(x); return x * x * (3 - 2 * x); };
  const G = {};                                   // cached ground points per plate/position
  const gp = (plate, ix, iy) => { const k = plate + ':' + ix + ':' + iy; return G[k] || (G[k] = K.ground(plate, ix, iy)); };
  // put a cast member at a painting position on a plate
  function put(n, plate, ix, iy, ry = 0, dz = 0, y = 0) { const g = gp(plate, ix, iy); return K.place(n, g.x, y, g.z + dz, ry); }
  // walk a cast member from painting point A to B over [t0, t0+dur]; returns {u, phase}
  function walkTo(n, plate, A, B, t, t0, dur, stride = .9, y = 0) {
    const a = gp(plate, ...A), b = gp(plate, ...B), u = S((t - t0) / dur), x = K.lerp(a.x, b.x, u), z = K.lerp(a.z, b.z, u);
    const dist = Math.hypot(b.x - a.x, b.z - a.z) * u, ry = Math.atan2(b.x - a.x, b.z - a.z);
    K.place(n, x, y, z, ry); const moving = t > t0 && t < t0 + dur; return { u, walk: dist / stride, amt: moving ? Math.min(1, Math.sin(PI * E((t - t0) / dur)) * 2.5) : 0, ry };
  }
  // human sitting on a painted couch: hips at seat height, thighs forward, shins down
  function sitPose(ch, seatY) { ch.hips.position.y = seatY + .06;
    for (const s of [-1, 1]) { ch.leg[s].hip.rotation.x = -1.45; ch.leg[s].knee.rotation.x = 1.45; ch.leg[s].ankle.rotation.x = 0; } }
  // rain streaks inside a painting rectangle [x0,y0,x1,y1]
  function rain(t, rect, n = 60, speed = 1.6, size = 1) {
    const a = K.img(rect[0], rect[1]), b = K.img(rect[2], rect[3]), w = b.x - a.x, h = b.y - a.y, k = K.imgScale();
    for (let i = 0; i < n; i++) { const fx = (i * .6180339) % 1, ph = (t * speed + i * .3711) % 1;
      K.prop('streak', { x: a.x + fx * w + ph * 24 * k, y: a.y + ph * h, w: 5 * k * size, rot: -.12, a: .55 * Math.min(1, ph * 6, (1 - ph) * 6), layer: 'back' }); }
  }
  const popW = (t, t0, w, d = .3) => w * K.pop(E((t - t0) / d));
  const hideAll = () => {};

  window.SCENE = {
    plates: {
      '01': { img: '01_two_houses_day.png', hz: .43, vx: .5, fov0: 55, camH: 1.95, light: 'day' },
      '02': { img: '02_gary_hallway_dawn.png', hz: .30, vx: .55, fov0: 55, camH: 1.95, light: 'night' },
      '03': { img: '03_gary_porch_rain.png', hz: .35, vx: .45, fov0: 55, camH: 1.95, light: 'night' },
      '04': { img: '04_doug_living_room_day.png', hz: .30, vx: .5, fov0: 55, camH: 1.95, light: 'interior' },
      '05': { img: '05_doug_living_room_night.png', hz: .30, vx: .5, fov0: 55, camH: 1.95, light: 'night' },
      '06': { img: '06_doug_bedroom_morning.png', hz: .27, vx: .5, fov0: 55, camH: 1.95, light: 'interior' },
      '07': { img: '07_gary_kitchen_rain.png', hz: .295, vx: .5, fov0: 55, camH: 1.95, light: 'interior' },
      '08': { img: '08_two_houses_evening.png', hz: .43, vx: .5, fov0: 55, camH: 1.95, light: 'day' },
      '09': { img: '09_gary_living_room_evening.png', hz: .31, vx: .5, fov0: 55, camH: 1.95, light: 'interior' },
    },
    props: { P01: 'P01_sandwich.png', P02: 'P02_cat_station.png', P03: 'P03_phone.png', P04: 'P04_alarm_clock.png', P05: 'P05_raindrop.png' },
    cast: { doug: 'hoodie', gary: 'oxford', biscuit: 'dog', kevin: 'cat' },
    shots: [
      { at: 'q', plate: '01', zoom: [1.0, 1.1], focus: [[.5, .6], [.5, .64]] },
      { at: 'argue', plate: '01', zoom: [1.12, 1.2], focus: [[.5, .64], [.5, .66]] },
      { at: 'doug', plate: '01', zoom: [1.55, 1.65], focus: [[.32, .64], [.33, .65]] },
      { at: 'gary', plate: '01', zoom: [1.55, 1.65], focus: [[.68, .64], [.67, .65]] },
      { at: 'switch', plate: '01', zoom: [1.2, 1.08], focus: [[.5, .66], [.5, .64]] },
      { at: 'six', plate: '02', zoom: [1.0, 1.08], focus: [[.5, .55], [.52, .57]] },
      { at: 'pee', plate: '02', zoom: [1.3, 1.42], focus: [[.52, .55], [.54, .56]] },
      { at: 'rain', plate: '03', zoom: [1.0, 1.12], focus: [[.62, .5], [.66, .52]] },
      { at: 'leash', plate: '02', zoom: [1.2, 1.28], focus: [[.62, .55], [.65, .55]] },
      { at: 'porch', plate: '03', zoom: [1.05, 1.15], focus: [[.42, .6], [.45, .62]] },
      { at: 'drop', plate: '03', zoom: [1.7, 1.85], focus: [[.5, .6], [.5, .6]] },
      { at: 'back', plate: '03', zoom: [1.25, 1.25], focus: [[.42, .62], [.4, .62]] },
      { at: 'again', plate: '02', zoom: [1.25, 1.35], focus: [[.55, .58], [.57, .6]] },
      { at: 'ten', plate: '06', zoom: [1.0, 1.1], focus: [[.5, .55], [.55, .55]] },
      { at: 'bowl', plate: '04', zoom: [1.35, 1.45], focus: [[.72, .66], [.74, .67]] },
      { at: 'easy', plate: '04', zoom: [1.25, 1.38], focus: [[.48, .56], [.48, .55]] },
      { at: 'couch', plate: '04', zoom: [1.12, 1.18], focus: [[.5, .58], [.5, .58]] },
      { at: 'looks', plate: '04', zoom: [1.9, 2.1], focus: [[.74, .66], [.74, .66]] },
      { at: 'walks', plate: '04', zoom: [1.12, 1.12], focus: [[.55, .6], [.55, .6]] },
      { at: 'lunch', plate: '07', zoom: [1.0, 1.1], focus: [[.5, .6], [.5, .62]] },
      { at: 'soaked', plate: '07', zoom: [1.3, 1.42], focus: [[.6, .52], [.61, .5]] },
      { at: 'sandwich', plate: '07', zoom: [1.4, 1.52], focus: [[.6, .5], [.61, .49]] },
      { at: 'drops', plate: '07', zoom: [1.25, 1.25], focus: [[.5, .62], [.5, .62]] },
      { at: 'look1', plate: '07', zoom: [1.6, 1.7], focus: [[.44, .67], [.44, .67]] },
      { at: 'look2', plate: '07', zoom: [1.15, 1.2], focus: [[.5, .54], [.5, .54]] },
      { at: 'eats', plate: '07', zoom: [1.3, 1.35], focus: [[.48, .63], [.48, .63]] },
      { at: 'laugh', plate: '07', zoom: [1.3, 1.45], focus: [[.6, .52], [.6, .5]] },
      { at: 'night', plate: '05', zoom: [1.0, 1.1], focus: [[.5, .55], [.48, .55]] },
      { at: 'givenup', plate: '05', zoom: [1.65, 1.72], focus: [[.44, .5], [.44, .5]] },
      { at: 'hop', plate: '05', zoom: [1.35, 1.4], focus: [[.52, .52], [.52, .52]] },
      { at: 'lap', plate: '05', zoom: [1.7, 2.0], focus: [[.45, .49], [.45, .48]] },
      { at: 'phone', plate: '05', zoom: [2.4, 2.6], focus: [[.12, .43], [.12, .43]] },
      { at: 'forty', plate: '05', zoom: [1.75, 1.9], focus: [[.45, .49], [.45, .48]] },
      { at: 'swapback', plate: '08', zoom: [1.0, 1.08], focus: [[.5, .62], [.5, .64]] },
      { at: 'missed', plate: '08', zoom: [1.55, 1.65], focus: [[.33, .64], [.33, .64]] },
      { at: 'greet', plate: '08', zoom: [1.3, 1.45], focus: [[.36, .65], [.35, .66]] },
      { at: 'garyhome', plate: '09', zoom: [1.0, 1.08], focus: [[.45, .58], [.45, .6]] },
      { at: 'nolook', plate: '09', zoom: [1.8, 1.95], focus: [[.64, .55], [.64, .55]] },
      { at: 'room', plate: '09', zoom: [1.5, 1.2], focus: [[.55, .56], [.5, .58]] },
      { at: 'cta', plate: '08', zoom: [1.15, 1.15], focus: [[.5, .65], [.5, .65]] },
      { at: 'teams', plate: '08', zoom: [1.15, 1.2], focus: [[.5, .65], [.5, .65]] },
    ],
    shakes: [['drops+0.2', .25, .35]],
    flashes: [],
    tail: 2.4,

    build(k) {
      K = k;
      // rain streak sprite
      const c = document.createElement('canvas'); c.width = 8; c.height = 160; const g = c.getContext('2d');
      const gr = g.createLinearGradient(0, 0, 0, 160); gr.addColorStop(0, 'rgba(220,235,255,0)'); gr.addColorStop(1, 'rgba(235,245,255,.95)');
      g.fillStyle = gr; g.fillRect(2, 0, 4, 160); K.addProp('streak', c);
      // TEAM labels
      for (const [n, txt] of [['teamB', 'TEAM BISCUIT'], ['teamK', 'TEAM KEVIN']]) {
        const cv = document.createElement('canvas'); cv.width = 760; cv.height = 150; const x = cv.getContext('2d');
        x.font = '900 92px IN, sans-serif'; x.textAlign = 'center'; x.textBaseline = 'middle'; x.lineJoin = 'round';
        x.lineWidth = 22; x.strokeStyle = '#000'; x.strokeText(txt, 380, 78); x.fillStyle = '#ffd23a'; x.fillText(txt, 380, 78); K.addProp(n, cv); }
      // pets: smaller blob shadows
      K.cast.biscuit.blob.scale.set(.75, 1, .9); K.cast.kevin.blob.scale.set(.5, 1, .6);
    },

    update(t, k) {
      K = k;
      const D = K.cast.doug, Gy = K.cast.gary, B = K.cast.biscuit, C = K.cast.kevin, id = K.shot.id, L = K.shot.local, at = c => K.T(c);
      const P = K.shot.id && window.SCENE.shots.find(s => s.at === id).plate;
      [D, Gy].forEach(h => { h.blob.visible = true; });
      // ---------- outside: two houses ----------
      const lawn = (pl, mood) => {
        put('doug', pl, 300, 1110, .35); put('biscuit', pl, 425, 1160, .25); put('gary', pl, 735, 1110, -.35); put('kevin', pl, 615, 1160, -.3);
      };
      switch (id) {
        case 'q': { lawn('01'); blinkFace(D, 'smirk', t); D.pose({ t, look: .2 }); blinkFace(Gy, 'flat', t, 1.3); Gy.pose({ t, look: -.2, gesture: 'cross' });
          B.face('happy'); B.pose({ t, wag: 1, look: .3 }); C.face('sleepy'); C.pose({ t, sit: 1, look: -.4 }); break; }
        case 'argue': { lawn('01'); blinkFace(D, 'smirk', t); D.pose({ t, look: .35, gesture: 'point', gw: S(L / .3) }); blinkFace(Gy, 'flat', t, 1.3);
          Gy.pose({ t, look: -.35, gesture: 'cross' }); B.face('smile'); B.pose({ t, wag: .8, look: .4 }); C.face('flat'); C.pose({ t, sit: 1, look: -.6 }); break; }
        case 'doug': { lawn('01'); blinkFace(D, 'happy', t); D.pose({ t, look: .5, nod: .25, gesture: 'tada', gw: S((L - .3) / .4) });
          blinkFace(Gy, 'flat', t); Gy.pose({ t, gesture: 'cross' }); B.face('happy'); B.pose({ t, wag: 1, gesture: 'paw', gw: S((L - .6) / .3), look: -.4 }); C.face('sleepy'); C.pose({ t, sit: 1 }); break; }
        case 'gary': { lawn('01'); blinkFace(Gy, 'smirk', t); Gy.pose({ t, look: -.2, gesture: 'hips', gw: S(L / .4) }); blinkFace(D, 'flat', t);
          D.pose({ t, look: .4 }); B.face('smile'); B.pose({ t, wag: .6 }); C.face('flat'); C.pose({ t, sit: 1, look: .9 }); break; }
        case 'switch': { put('doug', '01', 300, 1110, .35); put('gary', '01', 735, 1110, -.35);
          blinkFace(D, 'smile', t); D.pose({ t, look: .3 }); blinkFace(Gy, 'smile', t, 1); Gy.pose({ t, look: -.3 });
          const t0 = at('switch') + .2, d = Math.max(1.2, at('six') - t0 - .3);
          const b = walkTo('biscuit', '01', [425, 1160], [640, 1175], t, t0, d, .45); B.face('happy'); B.pose({ t, walk: b.walk, walkAmt: b.amt, wag: 1 });
          const c = walkTo('kevin', '01', [615, 1160], [420, 1175], t, t0 + .3, d - .3, .32); C.face('flat'); C.pose({ t, walk: c.walk, walkAmt: c.amt }); break; }
        // ---------- Gary's hallway, dawn ----------
        case 'six': case 'pee': case 'leash': case 'again': {
          const scratching = id === 'pee' || id === 'again' || id === 'six';
          put('biscuit', '02', 600, 975, PI + .15); B.face(id === 'again' ? 'worried' : 'smile'); B.pose({ t, wag: .7, gesture: scratching ? 'paw' : null, gw: 1, look: id === 'pee' ? -.6 : 0 });
          if (id === 'six') { const w = walkTo('gary', '02', [230, 1180], [380, 1060], t, at('six') + .6, 1.6, .8); blinkFace(Gy, 'worried', t); Gy.pose({ t, walk: w.walk, walkAmt: w.amt, look: .2 }); }
          else if (id === 'leash') { put('gary', '02', 760, 1040, -.5); blinkFace(Gy, 'flat', t); Gy.pose({ t, look: -.2, armR: { raise: S((L - .6) / .3) * .9 }, gesture: L < .8 ? 'facepalm' : null, gw: 1 - S((L - .5) / .3) }); }
          else { put('gary', '02', 380, 1060, .35); blinkFace(Gy, id === 'again' ? 'flat' : 'worried', t); Gy.pose({ t, look: .25, lean: id === 'again' ? .18 : 0, nod: id === 'again' ? .2 : 0 }); }
          rain(t, [200, 340, 420, 670], 26, 1.8, .6); break; }
        // ---------- porch in the rain ----------
        case 'rain': rain(t, [560, 250, 1024, 1250], 110, 1.7); break;
        case 'porch': case 'drop': case 'back': {
          rain(t, [560, 250, 1024, 1250], 110, 1.7);
          put('gary', '03', 300, 1040, .55); blinkFace(Gy, id === 'back' ? 'flat' : 'worried', t); Gy.pose({ t, look: .3, gesture: id === 'back' ? 'facepalm' : null, gw: S((L - .5) / .3) });
          if (id === 'porch') { const w = walkTo('biscuit', '03', [330, 1080], [520, 960], t, at('porch'), 1.6, .45); B.face('happy'); B.pose({ t, walk: w.walk, walkAmt: w.amt, wag: 1 }); }
          else if (id === 'drop') { put('biscuit', '03', 520, 960, .9); B.face(L > .5 ? 'surprised' : 'smile'); B.pose({ t, ears: L > .5 ? -1 : .3, wag: L > .5 ? 0 : .8, look: .2 });
            const h = K.screenOf(B.head), y0 = -100; K.prop('P05', { x: h.x, y: K.lerp(y0, h.y - 120, S(L / .5)), w: 70, a: L < .55 ? 1 : 1 - E((L - .55) / .2) }); }
          else { const w = walkTo('biscuit', '03', [520, 960], [300, 1090], t, at('back') + .2, 1.8, .45); B.face('flat'); B.pose({ t, walk: w.walk, walkAmt: w.amt, wag: 0, ears: -.5 }); }
          break; }
        // ---------- Doug's bedroom ----------
        case 'ten': { put('doug', '06', 520, 1060, .1); blinkFace(D, 'sleepy', t); D.pose({ t, gesture: 'tada', gw: S((L - .6) / .5) * .7, nod: -.1 });
          const p = K.img(785, 530); K.prop('P04', { x: p.x, y: p.y - 40 * K.imgScale(), w: popW(t, at('ten') + .3, 230 * K.imgScale()) }); break; }
        // ---------- Doug's living room, day ----------
        case 'bowl': case 'easy': case 'couch': case 'looks': case 'walks': {
          const cs = K.img(800, 1095); K.prop('P02', { x: cs.x, y: cs.y, w: 520 * K.imgScale(), layer: 'back' });
          if (id === 'walks') { const w = walkTo('kevin', '04', [720, 1020], [1060, 1000], t, at('walks') + .25, 1.8, .32); C.face('flat'); C.pose({ t, walk: w.walk, walkAmt: w.amt }); }
          else { put('kevin', '04', 720, 1020, id === 'looks' ? -.7 : -.2); C.face(id === 'looks' ? 'flat' : 'sleepy'); C.pose({ t, sit: 1, look: id === 'looks' ? -.3 : 0 }); }
          if (id === 'couch' || id === 'looks' || id === 'walks') { const g = gp('04', 420, 805), seat = K.heightAt('04', g, 700); K.place('doug', g.x, 0, g.z - .2, .45);
            blinkFace(D, id === 'walks' ? 'worried' : 'smile', t); D.pose({ t, look: .45, gesture: id === 'couch' ? 'wave' : null, gw: S((L - .3) / .3) }); sitPose(D, seat); D.blob.visible = false; }
          else { put('doug', '04', 470, 1000, .2); blinkFace(D, id === 'easy' ? 'happy' : 'smile', t); D.pose({ t, look: .3, gesture: id === 'easy' ? 'hips' : null, gw: S(L / .4) }); }
          break; }
        // ---------- Gary's kitchen, lunch ----------
        case 'lunch': case 'soaked': case 'sandwich': case 'drops': case 'look1': case 'look2': case 'eats': case 'laugh': {
          rain(t, [325, 250, 735, 590], 40, 1.8, .7);
          put('gary', '07', 640, 1030, -.25); put('biscuit', '07', 400, 1060, .5);
          const gf = { lunch: 'worried', soaked: 'flat', sandwich: 'smile', drops: 'surprised', look1: 'surprised', look2: 'worried', eats: 'surprised', laugh: 'happy' }[id];
          blinkFace(Gy, gf, t); Gy.pose({ t, look: id === 'drops' || id === 'eats' ? .5 : .1, nod: id === 'drops' ? .3 : 0, gesture: id === 'soaked' ? 'shrug' : id === 'laugh' ? 'tada' : null, gw: S(L / .3) * (id === 'laugh' ? .6 : 1), lean: id === 'laugh' ? -.12 : 0,
            armR: { raise: id === 'sandwich' ? .35 : 0 } });
          const bf = { lunch: 'happy', look1: 'smile', look2: 'smile', eats: 'happy' }[id] || 'smile';
          const bLook = id === 'look2' ? .7 : 0, bNod = id === 'look1' ? .45 : id === 'eats' ? .6 * Math.abs(Math.sin(L * 5)) * (L < 1.4 ? 1 : 0) : 0;
          B.face(bf); B.pose({ t, wag: id === 'eats' || id === 'lunch' ? 1 : .4, look: bLook, nod: bNod });
          // the sandwich: in Gary's hand -> falls -> on the floor -> eaten
          const hand = K.screenOf(Gy.arm[1].wr), floor = K.worldToScreen(gp('07', 450, 1080).x + .25, 0, gp('07', 450, 1080).z + .3), sw = 120 * K.imgScale();
          if (id === 'sandwich') K.prop('P01', { x: hand.x, y: hand.y - 20, w: popW(t, at('sandwich') + .4, sw) });
          else if (id === 'drops') { const u = E((L - .1) / .45); K.prop('P01', { x: K.lerp(hand.x, floor.x, u), y: K.lerp(hand.y - 20, floor.y, u * u), w: sw, rot: u * 2.2 }); }
          else if (id === 'look1' || id === 'look2') K.prop('P01', { x: floor.x, y: floor.y, w: sw, rot: 2.2 });
          else if (id === 'eats') K.prop('P01', { x: floor.x, y: floor.y, w: sw * (1 - E((L - .3) / 1.1)), rot: 2.2 });
          break; }
        // ---------- Doug's living room, night ----------
        case 'night': case 'givenup': case 'hop': case 'lap': case 'phone': case 'forty': {
          const g = gp('05', 420, 805), seat = K.heightAt('05', g, 700); K.place('doug', g.x, 0, g.z - .2, .45); D.blob.visible = false;
          const df = { night: 'flat', givenup: 'sleepy', hop: 'surprised', lap: L < .6 ? 'surprised' : 'happy', phone: 'worried', forty: 'smile' }[id];
          blinkFace(D, df, t); D.pose({ t, look: id === 'phone' ? -.7 : id === 'hop' ? .4 : id === 'lap' ? .1 : .3, nod: id === 'lap' || id === 'forty' ? .25 : 0, lean: id === 'givenup' ? -.1 : 0 }); sitPose(D, seat);
          const lap = { x: g.x + .16, y: seat + .1, z: g.z - .2 + .42 };
          if (id === 'hop') { const s0 = gp('05', 740, 830), u = S((L - .5) / .7), y = Math.sin(PI * u) * .5 + K.lerp(0, seat, u);
            K.place('kevin', K.lerp(s0.x, g.x + .9, u), y, K.lerp(s0.z, g.z - .1, u), -PI / 2); C.face('flat'); C.pose({ t, gesture: u > 0 && u < 1 ? 'bow' : null, gw: .6 }); }
          else if (id === 'lap' || id === 'forty' || id === 'phone') { const u = id === 'lap' ? S(L / .8) : 1, s1 = { x: g.x + .9, y: seat, z: g.z - .1 };
            K.place('kevin', K.lerp(s1.x, lap.x, u), K.lerp(s1.y, lap.y, u) + Math.sin(PI * u) * .15, K.lerp(s1.z, lap.z, u), -PI / 2 + .3); C.face(u > .8 ? 'sleepy' : 'flat'); C.pose({ t, lie: u, wag: 0 }); C.blob.visible = false; }
          else { put('kevin', '05', 820, 1010, -PI / 2 - .4); C.face('flat'); C.pose({ t, sit: 1 }); }
          if (id === 'phone') { const p = K.img(118, 652); K.prop('P03', { x: p.x, y: p.y - 4 * K.imgScale(), w: 46 * K.imgScale(), rot: .5 }); }
          break; }
        // ---------- swap back, evening ----------
        case 'swapback': case 'missed': case 'greet': case 'cta': case 'teams': {
          put('doug', '08', 300, 1110, .35); put('gary', '08', 735, 1110, -.35);
          if (id === 'greet') { const w = walkTo('biscuit', '08', [640, 1175], [410, 1165], t, at('greet') + .1, 1.0, .45);
            B.face('happy'); B.pose({ t, walk: w.walk, walkAmt: w.amt, wag: 1, gesture: L > 1.2 ? 'beg' : null, gw: S((L - 1.2) / .3) });
            blinkFace(D, 'happy', t); D.pose({ t, look: .3, nod: .3, gesture: L > 1.2 ? 'tada' : null, gw: S((L - 1.2) / .3) }); }
          else if (id === 'cta' || id === 'teams') { put('biscuit', '08', 430, 1170, .3); put('kevin', '08', 600, 1170, -.3);
            B.face('happy'); B.pose({ t, wag: 1 }); C.face('flat'); C.pose({ t, sit: 1 });
            blinkFace(D, 'smile', t); D.pose({ t, look: .2, gesture: id === 'teams' ? 'point' : null, gw: S(L / .3) }); blinkFace(Gy, 'smirk', t, 1); Gy.pose({ t, look: -.2, gesture: id === 'teams' ? 'point' : null, gw: S(L / .3) });
            const bh = K.screenOf(B.head), kh = K.screenOf(C.head), tt = at('teams');
            K.prop('teamB', { x: Math.max(260, bh.x - 60), y: bh.y - 330, w: popW(t, tt, 470) }); K.prop('teamK', { x: Math.min(820, kh.x + 80), y: kh.y - 230, w: popW(t, tt + .35, 420) }); }
          else { put('biscuit', '08', 640, 1175, -.3); put('kevin', '08', 420, 1175, .3); B.face('happy'); B.pose({ t, wag: 1, look: .4 }); C.face('sleepy'); C.pose({ t, sit: 1 }); }
          if (id === 'swapback') { blinkFace(Gy, 'flat', t); Gy.pose({ t, look: -.2, gesture: 'shrug', gw: S((L - .8) / .3) }); blinkFace(D, 'smile', t, 1); D.pose({ t, look: .3 }); }
          if (id === 'missed') { blinkFace(D, 'smile', t); D.pose({ t, look: .2, gesture: 'shrug', gw: S((L - .4) / .3), tilt: .08 }); blinkFace(Gy, 'flat', t); Gy.pose({ t, look: -.3 }); }
          if (id === 'greet') { blinkFace(Gy, 'smile', t); Gy.pose({ t, look: -.4 }); }
          break; }
        // ---------- Gary's living room ----------
        case 'garyhome': case 'nolook': case 'room': {
          const g = gp('09', 650, 910), seat = K.heightAt('09', g, 790);
          const ks = id === 'room' ? S((L - .3) / .8) : 0;
          K.place('kevin', g.x + .35 * ks, seat, g.z - .2, -.3); C.face('sleepy'); C.pose({ t, lie: 1 - ks * .0, wag: 0 }); C.blob.visible = false;
          if (id === 'garyhome') { const w = walkTo('gary', '09', [180, 1160], [330, 1060], t, at('garyhome'), 1.2, .8); blinkFace(Gy, 'smile', t);
            Gy.pose({ t, walk: w.walk, walkAmt: w.amt, gesture: L > 1.2 ? 'wave' : null, gw: S((L - 1.2) / .3) }); }
          else if (id === 'nolook') { put('gary', '09', 330, 1060, .4); blinkFace(Gy, 'flat', t); Gy.pose({ t, look: .3 }); }
          else { const sg = gp('09', 420, 910), sSeat = K.heightAt('09', sg, 790), u = S((L - 1.2) / .6);
            if (u <= 0) { put('gary', '09', 330, 1060, .4); blinkFace(Gy, 'surprised', t); Gy.pose({ t, look: .3 }); }
            else { K.place('gary', sg.x, 0, sg.z - .2, .4); blinkFace(Gy, 'happy', t); Gy.pose({ t, look: .5 }); sitPose(Gy, sSeat); Gy.blob.visible = false; } }
          break; }
      }
    },
  };
})();
