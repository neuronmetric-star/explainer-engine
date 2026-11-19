// robot-dogs-haiti: plates + props + Doug, Gary, the President, Little Brother and the robot dog. Plan: shotlist.md.
// World units: feet at y=0, camera at (0, camH, 0) looking down -z. Props in screen px (y down).
(function () {
  const PI = Math.PI;
  const face = (ch, name, t, off = 0) => ch.face(((t + off) % 4.1) < .12 && name !== 'happy' ? 'blink' : name);
  const popIn = (K, t, from, dur = .35) => K.pop(K.clamp01((t - from) / dur));
  const STRIDE = .6; // robot travel per gait cycle at walkAmt 1

  // light presets matched to each painting
  const L = {
    room: { key: [0xffb070, 1.9, [-10, 5, 3]], hemi: [0x7a88e0, 0x804830, .85], front: [0xffd8c8, .95], shadow: [0x1c1038, .45] },
    hall: { key: [0xffc27a, 1.8, [0, 7, -30]], hemi: [0x7088d0, 0x2a3050, .95], front: [0xa8b4ff, .75], shadow: [0x0c1030, .5] },
    office: { key: [0xffc080, 2.4, [-12, 6, 2]], hemi: [0xc8b4ff, 0x805060, .75], front: [0xffe2d2, 1.0], shadow: [0x3a2050, .4] },
    door: { key: [0xffb468, 1.9, [-6, 9, 4]], hemi: [0x6a78d8, 0x5a3020, .85], front: [0xffd0b8, .9], shadow: [0x1a1030, .45] },
  };

  // robot walking along z (dir +1 toward camera, -1 away), from z0 at time t0
  function robotWalk(K, t, t0, x, z0, dir, amt = 1, speed = 1) {
    const R = K.cast.robot, d = Math.max(0, t - t0) * speed * STRIDE * amt;
    K.place('robot', x, 0, z0 + dir * d, dir > 0 ? 0 : PI);
    R.pose({ t, walk: Math.max(0, t - t0) * speed, walkAmt: amt });
    return R;
  }

  window.SCENE = {
    plates: {
      '01': { img: '01_living_room_night.png', hz: .33, vx: .5, fov0: 55, camH: 1.4, light: L.room },
      '02': { img: '02_portauprince_wide_day.png', hz: .32, vx: .5, fov0: 55, camH: 1.9, light: 'day' },
      '03': { img: '03_stadium_outside_day.png', hz: .5, vx: .42, fov0: 55, camH: 1.6, light: 'day' },
      '04': { img: '04_stadium_hallway_dim.png', hz: .495, vx: .5, fov0: 55, camH: .75, light: L.hall },
      '05': { img: '05_stadium_stairs_dim.png', hz: .40, vx: .5, fov0: 55, camH: 1.1, light: L.hall },
      '06': { img: '06_president_office_day.png', hz: .40, vx: .5, fov0: 55, camH: 1.6, light: L.office },
      '07': { img: '07_basement_door_night.png', hz: .40, vx: .5, fov0: 55, camH: 1.6, light: L.door },
      '08': { img: '08_basement_dark_night.png', hz: .45, vx: .5, fov0: 55, camH: 1.2, light: 'night' },
    },
    props: { P03: 'P03_roomba.png', P04: 'P04_cargo_plane.png', P05: 'P05_helmet_camera.png',
      X01: 'X01_phone_in_room.png', X02: 'X02_controller_outside.png' },
    cast: { doug: 'hoodie', gary: 'oxford', pres: { outfit: 'president', phone: true }, bro: 'polo', robot: { outfit: 'robodog' } },
    shots: [
      { at: 'q', plate: '04', zoom: [1.0, 1.0], focus: [[.5, .5], [.5, .5]] },          // inside the phone (X01 on top)
      { at: 'theory', plate: '01', zoom: [1.0, 1.1], focus: [[.5, .5], [.48, .45]] },
      { at: 'gary', plate: '01', zoom: [1.9, 2.0], focus: [[.86, .42], [.86, .42]] },
      { at: 'salvador', plate: '02', zoom: [1.0, 1.08], focus: [[.45, .5], [.55, .5]] },
      { at: 'fight', plate: '03', zoom: [1.0, 1.15], focus: [[.45, .55], [.4, .52]] },
      { at: 'video', plate: '06', zoom: [1.15, 1.3], focus: [[.5, .55], [.5, .52]] },
      { at: 'robots', plate: '04', zoom: [1.25, 1.1], focus: [[.5, .62], [.5, .6]] },
      { at: 'stadium', plate: '03', zoom: [1.25, 1.4], focus: [[.4, .52], [.38, .5]] },
      { at: 'see', plate: '01', zoom: [1.05, 1.12], focus: [[.48, .45], [.48, .42]] },
      { at: 'never', plate: '04', zoom: [1.55, 1.65], focus: [[.5, .55], [.5, .53]] },
      { at: 'what', plate: '01', zoom: [1.35, 1.45], focus: [[.48, .3], [.48, .28]] },
      { at: 'eyes', plate: '04', zoom: [1.7, 1.95], focus: [[.5, .57], [.5, .56]] },
      { at: 'operator', plate: '04', zoom: [1.0, 1.06], focus: [[.5, .5], [.5, .5]] },  // inside the controller (X02 on top)
      { at: 'send', plate: '05', zoom: [1.0, 1.12], focus: [[.5, .6], [.5, .5]] },
      { at: 'brother', plate: '07', zoom: [1.1, 1.2], focus: [[.45, .6], [.5, .6]] },
      { at: 'mount', plate: '04', zoom: [1.3, 1.3], focus: [[.44, .58], [.56, .58]] },
      { at: 'unknown', plate: '01', zoom: [1.7, 1.85], focus: [[.84, .42], [.85, .42]] },
      { at: 'callback', plate: '04', zoom: [1.5, 1.55], focus: [[.5, .68], [.5, .68]] },
      { at: 'first', plate: '04', zoom: [1.0, 1.05], focus: [[.5, .55], [.5, .52]] },
      { at: 'next', plate: '04', zoom: [1.0, 1.35], focus: [[.5, .5], [.5, .48]] },
      { at: 'end', plate: '07', zoom: [1.2, 1.3], focus: [[.55, .6], [.6, .6]] },
      { at: 'roomba', plate: '08', zoom: [1.05, 1.2], focus: [[.55, .6], [.5, .62]] },
      { at: 'ask', plate: '04', zoom: [1.0, 1.08], focus: [[.5, .6], [.5, .58]] },
      { at: 'cta', plate: '04', zoom: [1.2, 1.2], focus: [[.5, .38], [.5, .38]] },
    ],
    shakes: [],
    flashes: [],
    follow: { from: 'cta+0.3' },
    tail: 2.6,

    update(t, K) {
      const id = K.shot.id, Lc = K.shot.local, at = c => K.T(c);
      const D = K.cast.doug, G = K.cast.gary, P = K.cast.pres, B = K.cast.bro, R = K.cast.robot;
      // living room spots: Doug on the rug, Gary in the hallway doorway
      const dougRoom = (ry = 0) => K.place('doug', -.2, 0, -4.4, ry);
      const garyDoor = (ry = -.25) => K.place('gary', 3.55, 0, -14.5, ry);
      switch (id) {
        case 'q': { robotWalk(K, t, at('q') - 1, 0, -15, 1, 1, 1.1); R.pose({ t, walk: (t - at('q') + 1) * 1.1, walkAmt: 1 });
          K.prop('X01', { x: 540, y: 960, w: 1080 }); break; }
        case 'theory': { dougRoom(); garyDoor(); face(G, 'flat', t, 1);  G.pose({ t, gesture: 'cross', gw: 1 });
          const big = t > at('theory') + 1.6; face(D, big ? 'smirk' : 'happy', t);
          D.pose({ t, gesture: big ? 'hips' : 'tada', gw: K.ease(Lc / .3) }); break; }
        case 'gary': { dougRoom(); garyDoor(-.15); face(G, Lc > .8 ? 'smirk' : 'flat', t, 1); G.pose({ t, gesture: 'cross', gw: 1, tilt: K.ease((Lc - 1) / .3) * .12 }); D.pose({ t }); break; }
        case 'salvador': { const u = K.clamp01(Lc / 3.2); K.prop('P04', { x: K.lerp(-300, 1300, u), y: 330 - 60 * u, w: 620, rot: -.04 }); break; }
        case 'fight': break;
        case 'video': { K.place('pres', 0, 0, -5.2, 0); const tap = K.clamp01((Lc - .9) / .25) * (1 - K.clamp01((Lc - 1.5) / .25));
          face(P, Lc > 1.6 ? 'smirk' : 'smile', t); P.pose({ t, armR: { raise: .55 }, look: Lc > 1.6 ? 0 : .25, nod: Lc > 1.6 ? 0 : .22 - tap * .05 }); break; }
        case 'robots': robotWalk(K, t, at('robots'), .15, -8.5, 1); break;
        case 'stadium': break;
        case 'see': { dougRoom(-.2); garyDoor(); face(D, 'smirk', t); D.pose({ t, gesture: 'point', gw: K.ease(Lc / .3) }); face(G, 'flat', t, 1); G.pose({ t, gesture: 'cross', gw: 1 }); break; }
        case 'never': { K.place('robot', .1, 0, -4.2, 0); R.pose({ t, walkAmt: 0, look: Math.sin(Lc * .8) * .05 }); break; }
        case 'what': { dougRoom(); face(D, Lc < .5 ? 'blink' : 'flat', t); D.pose({ t, gesture: 'think', gw: K.ease((Lc - .4) / .4) }); break; }
        case 'eyes': { K.place('robot', 0, 0, -3.2, 0); R.pose({ t, walkAmt: 0, look: Math.sin(Lc * 1.6) * .5 }); break; }
        case 'operator': { robotWalk(K, t, at('operator') - .5, 0, -12, 1, .9);
          K.prop('X02', { x: 540, y: 960, w: 1080, rot: Math.sin(t * .9) * .008 }); break; }
        case 'send': { // walks away from camera toward the stairs, then climbs
          const s = Math.max(0, t - at('send')), z = -4.5 - s * STRIDE * 1.1, zs = -9.5; // stairs start
          K.place('robot', 0, z < zs ? (zs - z) * .55 : 0, z, PI); R.pose({ t, walk: s * 1.1, walkAmt: 1, pitch: z < zs ? -.35 : 0 }); break; }
        case 'brother': { const d = K.place('doug', -1.15, 0, -6.6, .35), b = K.place('bro', .25, 0, -6.4, PI * .82, .72);
          face(D, 'smirk', t); D.pose({ t, gesture: 'point', gw: K.ease((Lc - .3) / .3), look: -.2 });
          face(b, 'worried', t, 2); b.pose({ t, look: 1.1 * K.ease((Lc - .6) / .3) });
          const h = K.screenOf(b.head), tp = at('brother') + 1.2;
          K.prop('P05', { x: h.x, y: h.y - 34, w: 150 * popIn(K, t, tp), rot: .08 }); break; }
        case 'mount': { K.place('robot', 0, 0, -4.6, PI / 2); R.pose({ t, walkAmt: 0 }); break; }
        case 'unknown': { garyDoor(-.1); face(G, 'flat', t, 1); G.pose({ t, gesture: 'shrug', gw: K.ease((Lc - .3) / .3) }); break; }
        case 'callback': robotWalk(K, t, at('callback'), .15, -7.5, 1, 1, .8); break;
        case 'first': robotWalk(K, t, at('first'), 0, -3.5, -1, 1, 1.3); break;
        case 'next': break;
        case 'end': { K.place('doug', .3, 0, -6.2, .5); face(D, Lc < .3 ? 'blink' : 'worried', t); D.pose({ t, lean: -.08 * K.ease(Lc / .4), look: .4 }); break; }
        case 'roomba': { const u = K.clamp01(Lc / 2.4), p = K.img(K.lerp(740, 480, u), K.lerp(930, 1000, u));
          K.prop('P03', { x: p.x, y: p.y, w: 330 * K.imgScale() * K.lerp(.75, 1, u) }); break; }
        case 'ask': case 'cta': { K.place('robot', -1.3, 0, -8.2, .35); R.pose({ t, walkAmt: 0, tilt: id === 'ask' ? Math.sin(Lc * 2) * .12 : 0, look: id === 'cta' ? .35 : 0 });
          K.place('gary', 1.35, 0, -9.0, -.3); face(G, id === 'cta' ? 'smirk' : 'flat', t, 1);
          G.pose({ t, gesture: id === 'cta' ? 'point' : 'shrug', gw: K.ease((Lc - .3) / .3) }); break; }
      }
    },
  };
})();
