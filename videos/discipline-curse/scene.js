// discipline-curse: lesson chain through time. Plates + props + Gary (disciplined) and Doug (pizza box). Plan: shotlist.md.
// World units: feet at y=0, camera at (0, camH, 0) looking down -z. Props in screen px (y down).
(function () {
  const PI = Math.PI;
  const face = (ch, name, t, off = 0) => ch.face(((t + off) % 4.1) < .12 && name !== 'happy' && name !== 'blink' ? 'blink' : name);
  const popIn = (K, t, from, dur = .35) => K.pop(K.clamp01((t - from) / dur));
  const WORDS = window.VIDEO_DATA.words, norm = w => w.toLowerCase().replace(/[^a-z0-9]/g, '');
  const wordAt = (K, w, cue) => { const t0 = K.T(cue); const x = WORDS.find(o => o.start >= t0 - .01 && norm(o.w) === w); return x ? x.start : t0; };

  // light presets matched to each painting
  const L = {
    street: { key: [0xffb46a, 2.6, [-14, 5, -4]], hemi: [0xc0a8ff, 0xa08050, .8], front: [0xffdcc8, 1.0], shadow: [0x4a2a6a, .42] },
    bedroom: { key: [0xffb060, 1.7, [10, 4, 2]], hemi: [0x6a78e0, 0x7a4828, .9], front: [0xd8d0ff, .9], shadow: [0x141040, .45] },
    kitchen: { key: [0xffd08a, 2.4, [-12, 6, 0]], hemi: [0xd8d0ff, 0xc0a080, .85], front: [0xffeadc, 1.0], shadow: [0x4a3a6a, .32] },
    office: { key: [0xfff0dc, 1.8, [-6, 8, -12]], hemi: [0xc8d8ff, 0x7088b0, .95], front: [0xffe8d8, 1.0], shadow: [0x2a3a6a, .32] },
    party: { key: [0xff4ad0, 1.6, [-6, 8, -4]], hemi: [0x40c8ff, 0x6a2a8a, 1.0], front: [0xd0a0ff, .95], shadow: [0x200a40, .5] },
    after: { key: [0xffb060, 1.2, [-10, 4, -2]], hemi: [0x6a68c8, 0x3a2850, .9], front: [0xb0a8f0, .85], shadow: [0x100a30, .5] },
    dream: { key: [0xffd8a0, 2.8, [12, 7, -4]], hemi: [0xb8d8ff, 0xe0a070, .8], front: [0xffe8dc, 1.1], shadow: [0x6a3a6a, .35] },
  };

  // street (plate 01) spots, in painting pixels on the sidewalk
  const SW = 1005;                       // sidewalk centre line (painting y)
  const DOUG_SPOT = [770, 1012];         // in front of Doug's yellow house, the mirror spot
  // Gary jogging along the sidewalk: x in painting px over time
  function garyRun(K, t, t0, ix0, speedPx, run = 1) {
    const G = K.cast.gary, ix = ix0 + (t - t0) * speedPx;
    K.placeAt('gary', ix, SW, speedPx >= 0 ? PI / 2 : -PI / 2);
    G.pose({ t, walk: (t - t0) * 2.1 * run, walkAmt: 1, lean: .12 * run });
    return G;
  }
  function jogInPlace(K, t, ry = 0) { K.cast.gary.pose({ t, walk: t * 1.9, walkAmt: .7, lean: .08 }); }
  const douggy = (K, on) => { K.cast.doug.pizza.visible = on; return K.cast.doug; };

  window.SCENE = {
    plates: {
      '01': { img: '01_street_sunrise.png', hz: .50, vx: .48, fov0: 55, camH: 1.7, light: L.street, video: 'clips/01', frames: 192, vfps: 24 },
      '01y': { img: '01_street_sunrise.png', hz: .50, vx: .48, fov0: 55, camH: 1.7, light: L.street, video: 'clips/yr', frames: 192, fit: true }, // a year of seasons played across the shot
      '02': { img: '02_gary_bedroom_dawn.png', hz: .44, vx: .45, fov0: 55, camH: 1.6, light: L.bedroom, video: 'clips/02', frames: 192, vfps: 24 },
      '03': { img: '03_gary_kitchen_morning.png', hz: .40, vx: .5, fov0: 55, camH: 1.7, light: L.kitchen, video: 'clips/03', frames: 192, vfps: 24 },
      '04': { img: '04_office_day.png', hz: .42, vx: .5, fov0: 55, camH: 1.6, light: L.office, video: 'clips/04', frames: 192, vfps: 24, vseq: [[136, 191]] }, // clouds drift indoors mid-clip: use the clean end
      '05': { img: '05_doug_party_night.png', hz: .40, vx: .5, fov0: 55, camH: 1.7, light: L.party, video: 'clips/05', frames: 192, vfps: 24 },
      '06': { img: '06_doug_room_afternoon.png', hz: .40, vx: .5, fov0: 55, camH: 1.7, light: L.after, video: 'clips/06', frames: 192, vfps: 24, vseq: [[150, 191]] }, // the chair pops mid-clip
      '07': { img: '07_dream_life.png', hz: .37, vx: .5, fov0: 55, camH: 1.6, light: L.dream, video: 'clips/07', frames: 192, vfps: 24, vseq: [[176, 191], [0, 22]] }, // the pool floods the deck mid-clip
    },
    props: { P01: 'P01_alarm_6am.png', P02: 'P02_oatmeal.png', P03: 'P03_pizza_box.png', P04: 'P04_calendar_monday.png',
      P05: 'P05_calendar_newyear.png', P06: 'P06_ring_box.png', P07: 'P07_nameplate.png' },
    cast: { gary: 'oxford', doug: { outfit: 'hoodie', pizza: true } },
    shots: [
      { at: 'q', plate: '02', zoom: [1.0, 1.15], focus: [[.5, .55], [.5, .6]] },
      { at: 'problem', plate: '02', zoom: [1.4, 1.5], focus: [[.5, .55], [.5, .55]] },
      { at: 'did', plate: '01', zoom: [1.25, 1.35], focus: [[.2, .62], [.55, .62]] },
      { at: 'define', plate: '01', zoom: [1.5, 1.6], focus: [[.42, .62], [.5, .62]] },
      { at: 'same', plate: '02', zoom: [1.0, 1.0], focus: [[.5, .55], [.5, .55]] },
      { at: 'alarm', plate: '02', zoom: [1.6, 1.75], focus: [[.85, .5], [.85, .5]] },
      { at: 'run', plate: '01', zoom: [1.3, 1.3], focus: [[.45, .62], [.45, .62]] },
      { at: 'oat', plate: '03', zoom: [1.15, 1.25], focus: [[.45, .6], [.45, .6]] },
      { at: 'work', plate: '04', zoom: [1.1, 1.2], focus: [[.5, .55], [.5, .55]] },
      { at: 'bed', plate: '02', zoom: [1.1, 1.25], focus: [[.5, .55], [.5, .55]] },
      { at: 'doug', plate: '01', zoom: [1.0, 1.06], focus: [[.4, .55], [.6, .55]] },
      { at: 'pizza', plate: '01', zoom: [1.55, 1.7], focus: [[.75, .6], [.75, .58]] },
      { at: 'wish1', plate: '01', zoom: [1.7, 1.95], focus: [[.4, .58], [.4, .56]] },
      { at: 'aside', plate: '05', zoom: [1.1, 1.2], focus: [[.5, .58], [.5, .58]] },
      { at: 'tuesday', plate: '06', zoom: [1.1, 1.3], focus: [[.45, .45], [.45, .52]] },
      { at: 'link1', plate: '01', zoom: [1.6, 1.85], focus: [[.75, .58], [.75, .56]] },
      { at: 'monday', plate: '01', zoom: [2.0, 2.1], focus: [[.75, .55], [.75, .55]] },
      { at: 'last', plate: '01', zoom: [1.8, 1.8], focus: [[.75, .5], [.75, .5]] },
      { at: 'newyear', plate: '01', zoom: [1.8, 1.9], focus: [[.75, .5], [.75, .5]] },
      { at: 'fake', plate: '05', zoom: [1.25, 1.3], focus: [[.5, .55], [.5, .55]] },
      { at: 'mirror', plate: '07', zoom: [1.0, 1.12], focus: [[.5, .55], [.5, .58]] },
      { at: 'picture', plate: '07', zoom: [1.15, 1.25], focus: [[.5, .6], [.5, .6]] },
      { at: 'starting', plate: '06', zoom: [1.2, 1.3], focus: [[.5, .55], [.5, .55]] },
      { at: 'yearlater', plate: '01y', zoom: [1.0, 1.0], focus: [[.5, .55], [.5, .55]] },
      { at: 'gary2', plate: '01', zoom: [1.1, 1.2], focus: [[.4, .6], [.55, .6]] },
      { at: 'promo', plate: '04', zoom: [1.3, 1.4], focus: [[.5, .5], [.5, .5]] },
      { at: 'ring', plate: '02', zoom: [1.25, 1.35], focus: [[.5, .6], [.5, .6]] },
      { at: 'sees', plate: '01', zoom: [1.6, 1.85], focus: [[.75, .58], [.75, .56]] },
      { at: 'missed', plate: '02', zoom: [1.05, 1.25], focus: [[.5, .55], [.5, .58]] },
      { at: 'doug2', plate: '01', zoom: [1.55, 1.55], focus: [[.75, .6], [.75, .6]] },
      { at: 'same2', plate: '01', zoom: [2.0, 2.15], focus: [[.75, .55], [.75, .55]] },
      { at: 'moral', plate: '01', zoom: [1.6, 1.75], focus: [[.3, .6], [.3, .58]] },
      { at: 'moral2', plate: '01', zoom: [1.6, 1.7], focus: [[.75, .5], [.75, .5]] },
      { at: 'ask', plate: '01', zoom: [1.35, 1.45], focus: [[.55, .63], [.55, .63]] },
      { at: 'cta', plate: '01', zoom: [1.45, 1.45], focus: [[.55, .63], [.55, .63]] },
    ],
    shakes: [['alarm', .3, 1], ['newyear', .25, .7], ['ring', .2, .5]],
    flashes: [['ring', .15, .5]],
    follow: { from: 'cta+0.3' },
    tail: 2.6,

    update(t, K) {
      const id = K.shot.id, Lc = K.shot.local, at = c => K.T(c);
      const G = K.cast.gary, D = K.cast.doug;
      const gin = (d = .3) => K.ease((Lc - d) / .3);
      // bedroom: Gary on the floor in front of the bed; alarm clock on the nightstand
      const garyBed = (ry = 0) => K.placeAt('gary', 470, 1130, ry);
      const alarmOnStand = (s = 1, a = 1) => { const p = K.img(915, 655); K.prop('P01', { x: p.x, y: p.y - 40 * K.imgScale() * s, w: 110 * K.imgScale() * s, a }); };
      const dougAtSpot = (ry = -.35) => K.placeAt('doug', DOUG_SPOT[0], DOUG_SPOT[1], ry);
      switch (id) {
        case 'q': { garyBed(); alarmOnStand(); face(G, Lc > 2.2 ? 'flat' : 'smile', t); G.pose({ t, tilt: .05 }); break; }
        case 'problem': { garyBed(); alarmOnStand(); face(G, 'flat', t, 1); G.pose({ t, tilt: K.ease(Lc / .4) * .1 }); break; }
        case 'did': { garyRun(K, t, at('did'), 150, 100); face(G, 'smile', t); break; }
        case 'define': { garyRun(K, t, at('define'), 380, 90); face(G, 'smile', t); break; }
        case 'same': { garyBed(); alarmOnStand(); face(G, 'flat', t, 2); G.pose({ t }); break; }
        case 'alarm': { const s = 1 + .04 * Math.sin(t * 60);
          K.prop('P01', { x: 540, y: 760, w: 640 * popIn(K, t, at('alarm'), .25) * s, rot: Math.sin(t * 50) * .04 }); break; }
        case 'run': { garyRun(K, t, at('run'), 330, 300); face(G, 'flat', t); break; }
        case 'oat': { K.placeAt('gary', 250, 1060, .45); face(G, 'flat', t, 1); G.pose({ t, nod: .2, look: .35 });
          const p = K.img(500, 680); K.prop('P02', { x: p.x, y: p.y - 40 * K.imgScale(), w: 150 * K.imgScale() * popIn(K, t, at('oat')), layer: 'back' }); break; }
        case 'work': { K.placeAt('gary', 540, 960, 0); face(G, 'flat', t, 2); G.pose({ t, gesture: 'think', gw: gin(.1) }); break; }
        case 'bed': { garyBed(-.3); face(G, Lc < .3 ? 'blink' : 'flat', t); G.pose({ t, nod: .08, lean: -.03 }); alarmOnStand(); break; }
        case 'doug': { // wide: Gary jogs in from the left, Doug shuffles home from the right with the box
          garyRun(K, t, at('doug'), 80, 140); face(G, 'smile', t);
          const dx = K.lerp(980, DOUG_SPOT[0], K.ease(Lc / 2.2)); douggy(K, true); K.placeAt('doug', dx, DOUG_SPOT[1], -PI / 2 * (1 - K.ease((Lc - 1.6) / .5)) - .35 * K.ease((Lc - 1.6) / .5));
          face(D, 'happy', t); D.pose({ t, walk: Lc * 1.2, walkAmt: 1 - K.ease((Lc - 1.8) / .5), tilt: .18, armL: { fwd: -.35 } }); break; }
        case 'pizza': { douggy(K, true); dougAtSpot(); face(D, 'happy', t); D.pose({ t, gesture: 'wave', gw: gin(.2), tilt: .12, armL: { fwd: -.35 } });
          K.placeAt('gary', 470, SW, PI / 2.6); jogInPlace(K, t); face(G, 'smile', t); break; }
        case 'wish1': { K.placeAt('gary', 400, SW, .45); jogInPlace(K, t); douggy(K, true); dougAtSpot(); D.pose({ t, armL: { fwd: -.35 } }); face(D, 'happy', t);
          const look = K.ease((Lc - .2) / .3); G.pose({ t, walk: t * 1.9, walkAmt: .7 * (1 - look), look: .5 * look, tilt: .08 * look });
          face(G, Lc > .6 ? 'worried' : 'smile', t); break; }
        case 'aside': { K.placeAt('doug', 520, 1000, 0); douggy(K, false); face(D, 'happy', t);
          D.pose({ t, gesture: 'tada', gw: gin(.1), nod: Math.sin(t * 9) * .12 }); break; }
        case 'tuesday': { K.placeAt('doug', 660, 960, -.4); douggy(K, false); face(D, 'blink', t);
          D.pose({ t, tilt: .45 * K.ease(Lc / .6), lean: -.1, nod: .25 }); break; }
        case 'link1': { K.placeAt('gary', 300, SW, PI / 2); jogInPlace(K, t); face(G, 'smile', t);
          douggy(K, true); dougAtSpot(-.75); const look = K.ease((Lc - .2) / .3);
          D.pose({ t, look: -.45 * look, armL: { fwd: -.35 } }); face(D, Lc > .6 ? 'worried' : 'flat', t); break; }
        case 'monday': { douggy(K, true); dougAtSpot(-.2); face(D, 'smile', t); D.pose({ t, nod: .1 * Math.sin(Lc * 6) * (Lc < 1 ? 1 : 0), armL: { fwd: -.35 }, armR: { raise: .0 } }); break; }
        case 'last': { douggy(K, true); dougAtSpot(-.2); face(D, 'smile', t); D.pose({ t, armL: { fwd: -.35 } });
          // a MONDAY page tears off (flies away), another drops in
          const u = K.clamp01(Lc / .7); K.prop('P04', { x: 540 + 600 * K.easeOut(K.clamp01((Lc - .8) / .5)), y: 330, w: 360, rot: .5 * K.clamp01((Lc - .8) / .5), a: 1 });
          if (Lc > .9) K.prop('P04', { x: 540, y: 330 - 300 * (1 - K.easeOut(K.clamp01((Lc - .9) / .3))), w: 380, a: K.clamp01((Lc - .9) / .1) });
          void u; break; }
        case 'newyear': { douggy(K, true); dougAtSpot(-.2); face(D, 'smile', t); D.pose({ t, armL: { fwd: -.35 } });
          K.prop('P05', { x: 540, y: 330, w: 380 * popIn(K, t, at('newyear')), rot: -.05 }); break; }
        case 'fake': { K.placeAt('doug', 520, 1000, 0); douggy(K, false); face(D, 'happy', t);
          D.pose({ t, gesture: 'tada', gw: 1, nod: Math.sin(t * 9) * .12 }); break; }
        case 'mirror': { K.placeAt('doug', 512, 1130, -.2); douggy(K, false); face(D, 'happy', t); D.pose({ t, gesture: 'tada', gw: gin(.3) }); break; }
        case 'picture': { K.placeAt('doug', 512, 1000, -.1); douggy(K, false); face(D, 'smile', t); D.pose({ t, gesture: 'think', gw: gin(.1), tilt: -.1 }); break; }
        case 'starting': { K.placeAt('doug', 560, 920, 0); douggy(K, false); face(D, 'flat', t); D.pose({ t, gesture: 'shrug', gw: gin(.4) }); break; }
        case 'yearlater': break; // empty street (OpenArt seasons insert can drop in here)
        case 'gary2': { garyRun(K, t, at('gary2'), 60, 330, 1.5); face(G, 'happy', t);
          douggy(K, true); dougAtSpot(); face(D, 'flat', t, 1); D.pose({ t, armL: { fwd: -.35 }, look: -.3 }); break; }
        case 'promo': { K.placeAt('gary', 380, 960, .25); face(G, 'smile', t); G.pose({ t, gesture: 'hips', gw: gin(.2) });
          const p = K.img(600, 630); K.prop('P07', { x: p.x, y: p.y - 30 * K.imgScale(), w: 230 * K.imgScale() * popIn(K, t, at('promo') + .2) }); break; }
        case 'ring': { garyBed(); face(G, 'happy', t); G.pose({ t, gesture: 'tada', gw: gin(.4) });
          K.prop('P06', { x: 760, y: 430, w: 330 * popIn(K, t, at('ring')), rot: Math.sin(t * 3) * .03 }); break; }
        case 'sees': { K.placeAt('gary', 330, SW, PI / 2); G.pose({ t, walk: t * 2.4, walkAmt: 1, lean: .15 }); face(G, 'happy', t);
          douggy(K, true); dougAtSpot(-.75); const look = K.ease((Lc - .1) / .3), s = K.ease((Lc - .4) / .3);
          face(D, s > .5 ? 'surprised' : 'flat', t); D.pose({ t, look: -.45 * look, lean: -.08 * s, armL: { fwd: -.35 } }); break; }
        case 'missed': { // a dark morning: Gary at the edge of the bed, not wanting to get up, then he does
          garyBed(.15); const up = K.ease((Lc - 2.6) / .6); face(G, up > .5 ? 'flat' : 'worried', t);
          G.pose({ t, tilt: .22 * (1 - up), nod: .2 * (1 - up), lean: .12 * (1 - up) });
          alarmOnStand(1.1); break; }
        case 'doug2': { douggy(K, true); dougAtSpot(); face(D, 'happy', t); D.pose({ t, tilt: .12, armL: { fwd: -.35 } }); break; }
        case 'same2': { douggy(K, true); dougAtSpot(-.2); face(D, Lc > 1.6 ? 'blink' : 'smile', t); D.pose({ t, gesture: 'hips', gw: 0, nod: .1 * Math.sin(Lc * 6) * (Lc < 1 ? 1 : 0), armL: { fwd: -.35 } }); break; }
        case 'moral': { K.placeAt('gary', 300, SW, PI / 2.4); G.pose({ t, walk: t * 2.1, walkAmt: 1, lean: .12 }); face(G, 'smile', t); break; }
        case 'moral2': { douggy(K, true); dougAtSpot(-.2); face(D, 'flat', t); D.pose({ t, armL: { fwd: -.35 } });
          const k = Math.floor(Lc / .55) % 2; K.prop(k ? 'P05' : 'P04', { x: 540, y: 320, w: 340, rot: k ? -.05 : .04 }); break; }
        case 'ask': case 'cta': {
          K.placeAt('gary', 420, SW + 15, .35); K.placeAt('doug', DOUG_SPOT[0] - 60, DOUG_SPOT[1] + 10, -.35); douggy(K, true);
          if (id === 'ask') { face(G, 'smirk', t); G.pose({ t, gesture: 'point', gw: gin(.3) }); face(D, 'flat', t, 1); D.pose({ t, gesture: 'shrug', gw: gin(.6), armL: {} }); }
          else { face(G, 'smirk', t); G.pose({ t, gesture: 'point', gw: gin(.3), look: .2 }); face(D, Lc > 1.8 ? 'blink' : 'flat', t, 1); D.pose({ t, gesture: 'facepalm', gw: K.ease((Lc - 1.8) / .3), armL: { fwd: -.35 } }); }
          break; }
      }
    },
  };
})();
