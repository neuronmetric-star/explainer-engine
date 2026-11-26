// yawn-why v4 · Body Heck ep. 2: "Why do we yawn?" (Brian, Nov 26 2026: "just say why do we yawn and jump into an explainer. Doug only at the beginning,
// to bring the problem. Then images, no more Doug.")  Structure: B08 bedroom (Doug lying in bed, mid-yawn: the problem) → explainer on images only
// (B07 yawning head + brain, B06 hot street, props: oxygen tank, laptop fan, a drawn probe wire) → the signature city-sunset goodbye.
// Skills applied: hook (frame 1 = the giant yawn, crash-zoom 0.55 s, title from 0.25 s, voice at 0 s), visual (a change ≤ 3 s, live counters, 2-4 word caption
// chunks TEST, a moving camera in every shot), character-emotion (body = a yawn stretch), growth (send line, no follow button), script (follow-through gate).
// Color code: red = hot/no/danger, light blue/white = cool air, gold = the answer. The science is NOT settled: labels say so.
(function () {
  const PI = Math.PI;
  const face = (ch, name, t, off = 0) => ch.face(((t + off) % 4.1) < .12 && !['happy', 'blink', 'scream', 'surprised'].includes(name) ? 'blink' : name);
  const popIn = (K, t, from, dur = .35) => K.pop(K.clamp01((t - from) / dur));
  const ENDING = 'E01_city_sunset_ending.png';
  const GOLD = '#ffd23f', RED = '#ff3b30', COOL = '#8fd8ff';
  const L = {
    night: { key: [0xffc27a, 1.7, [10, 5, 4]], hemi: [0x7c88e0, 0x4a3a5a, .95], front: [0xb0b4ff, .75], shadow: [0x10103a, .42] },
    brain: { key: [0xffb080, 1.8, [0, 6, 6]], hemi: [0xffd8c0, 0x8a5a50, .9], front: [0xfff0e0, 1.0], shadow: [0x5a2a3a, .35] },
    hot: { key: [0xfff0c0, 2.4, [10, 8, 4]], hemi: [0xffe0b0, 0xb08060, .95], front: [0xfff4e0, 1.0], shadow: [0x2a6a7a, .35] },
    sunset: { key: [0xffb070, 2.6, [-12, 3, 2]], hemi: [0xffc8b0, 0x8a6a80, .8], front: [0xffe8dc, 1.0], shadow: [0x4a2a5a, .42] },
  };
  // Doug lies on HIS bed (B08, right bed): placement solved against the plate camera (hz .2, camH 2.5), scaled to 85% on Brian's note ("a tiny bit smaller").
  const DOUG = { x: 4.1351, z: -9.6684, sc: 1.1388, ry: -0.7, y: .9 };

  window.SCENE = {
    banner: 'THE HECK?',
    whip: true,
    captionChunk: 3,   // TEST (creator research): 2-4 word chunks
    plates: {
      B08: { img: 'B08_two_beds_bedroom.png', hz: .2, vx: .72, fov0: 55, camH: 2.5, light: L.night },
      B07: { img: 'B07_brain_hot_yawn.png', hz: .5, vx: .5, fov0: 55, camH: 1.5, light: L.brain },
      B06: { img: 'B06_hot_street_summer.png', hz: .45, vx: .5, fov0: 55, camH: 1.6, light: L.hot },
      B09: { img: 'B09_classroom_chalkboard.png', hz: .42, vx: .5, fov0: 55, camH: 1.6, light: 'day' },     // "what most people say: extra air"
      B10: { img: 'B10_lab_1987_oxygen.png', hz: .44, vx: .5, fov0: 55, camH: 1.6, light: 'interior' },    // the 1987 oxygen test
      B11: { img: 'B11_treadmill_lab.png', hz: .45, vx: .5, fov0: 55, camH: 1.6, light: 'day' },          // then they exercised
      B12: { img: 'B12_laptop_desk_hot.png', hz: .4, vx: .5, fov0: 55, camH: 1.6, light: 'interior' },    // think of your brain like a laptop
      B13: { img: 'B13_winter_summer_split.png', hz: .45, vx: .5, fov0: 55, camH: 1.6, light: 'day' },     // 160 people, winter and summer
      B14: { img: 'B14_rat_lab_bench.png', hz: .45, vx: .5, fov0: 55, camH: 1.6, light: 'day' },          // in rats, tiny probes
      B15: { img: 'B15_waiting_room_chairs.png', hz: .45, vx: .5, fov0: 55, camH: 1.6, light: 'interior' }, // yawns spread
      E: { img: ENDING, hz: .45, vx: .5, fov0: 55, camH: 2.0, light: L.sunset },
    },
    props: { P08: 'P08_lab_rat.cut.png', H01: 'H01_helicopter.png' },   // the tank and the laptop fan are now painted into B10 / B12
    cast: { doug: { outfit: 'hoodie' }, gary: 'oxford' },
    shots: [
      { at: 'hook', plate: 'B08', zoom: [5.0, 1.3], focus: [[.66, .34], [.62, .4]] },             // THE HOOK: Doug's giant yawn → crash-zoom out in 0.55 s
      { at: 'hook+0.55', plate: 'B08', zoom: [1.3, 1.8], focus: [[.62, .4], [.64, .36]] },
      { at: 'card', plate: 'B08', zoom: [1.8, 2.1], focus: [[.64, .36], [.66, .34]] },
      { at: 'kept', plate: 'B08', zoom: [2.1, 1.5], focus: [[.66, .34], [.6, .4]] },
      { at: 'belief', plate: 'B09', zoom: [1.0, 1.4], focus: [[.5, .55], [.53, .3]] },            // from here: images only, no cast (one painting per idea)
      { at: 'bet', plate: 'B09', zoom: [1.4, 1.1], focus: [[.53, .3], [.5, .5]] },
      { at: 'tested', plate: 'B10', zoom: [1.0, 1.25], focus: [[.5, .5], [.25, .55]] },
      { at: 'o2', plate: 'B10', zoom: [1.25, 1.4], focus: [[.25, .55], [.17, .62]] },
      { at: 'laps', plate: 'B11', zoom: [1.0, 1.3], focus: [[.5, .5], [.4, .5]] },
      { at: 'same', plate: 'B11', zoom: [1.3, 1.1], focus: [[.4, .5], [.5, .5]] },
      { at: 'rehook', plate: 'B07', zoom: [1.1, 1.25], focus: [[.5, .5], [.6, .36]] },
      { at: 'idea', plate: 'B07', zoom: [1.25, 1.1], focus: [[.6, .36], [.5, .5]] },
      { at: 'laptop', plate: 'B12', zoom: [1.0, 1.35], focus: [[.5, .5], [.5, .34]] },
      { at: 'fan', plate: 'B07', zoom: [1.0, 1.2], focus: [[.5, .5], [.35, .62]] },
      { at: 'pull', plate: 'B07', zoom: [1.2, 1.1], focus: [[.35, .62], [.5, .5]] },
      { at: 'nodis', plate: 'B07', zoom: [1.1, 1.0], focus: [[.5, .5], [.5, .5]] },
      { at: 'people', plate: 'B13', zoom: [1.0, 1.2], focus: [[.5, .55], [.5, .5]] },
      { at: 'hot', plate: 'B06', zoom: [1.0, 1.3], focus: [[.5, .55], [.75, .45]] },
      { at: 'rats', plate: 'B14', zoom: [1.0, 1.25], focus: [[.5, .55], [.5, .68]] },
      { at: 'drop', plate: 'B14', zoom: [1.25, 1.0], focus: [[.5, .68], [.5, .55]] },
      { at: 'mystery', plate: 'B15', zoom: [1.0, 1.2], focus: [[.5, .5], [.4, .55]] },
      { at: 'why', plate: 'B15', zoom: [1.2, 1.1], focus: [[.4, .55], [.5, .5]] },
      { at: 'mirror', plate: 'B07', zoom: [1.1, 1.25], focus: [[.5, .5], [.55, .4]] },
      { at: 'idk', plate: 'B07', zoom: [1.25, 1.1], focus: [[.55, .4], [.5, .5]] },
      { at: 'doug', plate: 'E', zoom: [1.04, 1.12], focus: [[.5, .53], [.5, .5]] },                // THE SIGNATURE GOODBYE (the cast's only other appearance)
      { at: 'diy', plate: 'E', zoom: [1.12, 1.2], focus: [[.5, .5], [.5, .48]] },
      { at: 'cta', plate: 'E', zoom: [1.2, 1.3], focus: [[.5, .48], [.5, .47]] },
    ],
    shakes: [['hook+0.3', .45, .7]],
    flashes: [['hook+0.28', .22, .7]],
    tail: 1.0,

    update(t, K) {
      const id = K.shot.id.split('+')[0], Lc = K.shot.local, at = c => K.T(c), s = () => K.imgScale();
      const D = K.cast.doug, G = K.cast.gary, lerp = K.lerp, cl = K.clamp01, ease = K.ease;
      const sway = (k = 1) => ({ look: .06 * k * Math.sin(t * .7), tilt: .04 * k * Math.sin(t * .9 + 1) });
      const yawnPose = (ch, k, o = {}) => { ch.face(k > .25 ? 'surprised' : 'flat'); ch.pose(Object.assign({ t, nod: -.4 * k, lean: -.1 * k, armR: { raise: .95 * k }, armL: { raise: .95 * k }, handR: 'open', handL: 'open' }, o)); };
      const yawnK = (t0, dur = 1.8) => { const u = (t - t0) / dur; return u < 0 || u > 1 ? 0 : Math.sin(u * PI) ** .6; };
      const gauge = (lv, a = 1) => { const x = 950, y0 = 1700, y1 = 1330, h = (y0 - y1) * lv, col = lv > .55 ? RED : lv > .3 ? '#ffb347' : COOL;
        K.line(x, y0, x, y1, { color: '#1c2a4a', width: 52, a: .75 * a }); K.line(x, y0, x, y0 - Math.max(2, h), { color: col, width: 36, a });
        K.text('BRAIN HEAT', { x: x - 50, y: y0 + 55, size: 40, a, color: 'white' }); };
      const airIn = (k, color = COOL, w = 12, rows = 3) => {   // air streaming in through the open mouth and up the channel to the brain
        for (let i = 0; i < rows; i++) { const a = K.img(20, 960 + i * 50), b = K.img(250, 990 + i * 40); K.flow(t, a.x, a.y, b.x, b.y, { width: w, color, a: k, ph: i * .25 }); }
        for (let i = 0; i < 2; i++) { const a = K.img(360 + i * 40, 940), b = K.img(560 + i * 40, 770); K.flow(t, a.x, a.y, b.x, b.y, { width: w, color, a: k, ph: i * .35 }); } };
      D.root.rotation.set(0, 0, 0);
      const hideCast = () => { D.root.visible = false; G.root.visible = false; };

      switch (id) {
        case 'hook': case 'card': case 'kept': {   // B08: Doug lies in bed and can't stop yawning (the problem). Gary's bed is empty.
          G.root.visible = false;
          const yk = id === 'hook' ? 1 - cl((t - 1.4) / 1.0) : id === 'card' ? yawnK(at('card') + .5, 1.6) : yawnK(at('kept') + .1, 1.4) + yawnK(at('kept') + 1.9, 1.2);
          if (yk > .02) yawnPose(D, Math.min(1, yk)); else { face(D, id === 'kept' ? 'worried' : 'flat', t); D.pose(Object.assign({ t, look: -.3, armR: { raise: 0 } }, sway(.6))); }
          D.root.position.set(DOUG.x, DOUG.y, DOUG.z); D.root.rotation.set(0, DOUG.ry, PI / 2); D.root.scale.setScalar(DOUG.sc); D.root.visible = true; D.root.updateMatrixWorld(true); if (D.blob) D.blob.visible = false;
          if (id === 'hook') { const a = cl(t / .25), out = cl((at('card') + 1.2 - t) / .3); K.text('WHY DO WE', { y: 250, size: 90, a: a * out, scale: .9 + .1 * popIn(K, t, 0) });
            K.text('YAWN?', { y: 370, size: 150, color: 'gold', a: a * out, scale: .9 + .1 * popIn(K, t, .15) }); }
          if (id === 'card' && t > at('card') + 1.2) K.text('DOUG\'S PROBLEM', { y: 300, size: 96, color: 'gold', scale: popIn(K, t, at('card') + 1.2) });
          if (id === 'kept') { K.text('KEPT YAWNING', { y: 300, size: 100, color: 'gold', scale: popIn(K, t, at('kept')) });
            if (t > at('kept') + 1.6) K.text('WORRIED', { y: 420, size: 80, color: 'white', scale: popIn(K, t, at('kept') + 1.6), rot: -.03 }); }
          break; }
        case 'belief': case 'bet': {   // the answer most people give: extra air
          hideCast();
          if (id === 'belief') K.text('EXTRA AIR?', { y: 300, size: 120, color: 'red', scale: popIn(K, t, at('belief')) });
          else K.text('"I BELIEVED IT TOO"', { y: 300, size: 70, color: 'white', scale: popIn(K, t, at('bet')) });
          if (id === 'belief' && t > at('belief') + 1.6) K.text('MOST PEOPLE SAY', { y: 430, size: 62, color: 'gold', scale: popIn(K, t, at('belief') + 1.6) });
          break; }
        case 'tested': case 'o2': case 'laps': case 'same': {   // the 1987 test: pure oxygen, then exercise: no change
          hideCast(); const to = at('o2'), tl = at('laps'), ts = at('same'), tn = at('notair');
          if (id === 'tested') K.text('1987', { y: 290, size: 150, color: 'gold', scale: popIn(K, t, at('tested')) });
          if (id === 'o2') { K.text('100% OXYGEN', { y: 300, size: 100, color: 'gold', scale: popIn(K, t, to) }); if (t > to + 1.7) K.text('STILL YAWNING', { y: 430, size: 80, color: 'red', scale: popIn(K, t, to + 1.7), rot: -.03 }); }
          if (id === 'laps') { const n = 1 + Math.min(1, ease((t - tl) / 1.3)); K.text('BREATHS ×' + (n < 1.5 ? '1' : '2'), { y: 300, size: 100, color: 'gold', scale: popIn(K, t, tl) });
            for (let i = 0; i < 4; i++) { const ph = (t * 1.2 + i / 4) % 1; K.text('●', { x: 640 + i * 40, y: 640 + ph * 120, size: 22, color: COOL, stroke: 0, shadow: false, a: 1 - ph }); } }
          if (id === 'same') { K.text('SAME YAWNS', { y: 300, size: 110, color: 'red', scale: popIn(K, t, ts), rot: -.03 });
            if (t >= tn) K.text('✖ NOT AIR', { y: 430, size: 90, color: 'red', scale: popIn(K, t, tn) }); }
          break; }
        case 'rehook': {   // the question beat
          hideCast();
          K.text('?', { y: 330, size: 260, color: 'gold', scale: popIn(K, t, at('rehook')) * (1 + .04 * Math.sin(t * 5)), rot: -.06 });
          K.text('WHAT IS IT?', { y: 470, size: 100, scale: popIn(K, t, at('rehook') + .3) });
          break; }
        case 'idea': case 'laptop': case 'fan': case 'pull': case 'nodis': {   // best idea: heat, a laptop and its fan; a yawn may cool the brain
          hideCast(); const tw = at('warm'), tf = at('fan'), tp = at('pull'), tn = at('nodis');
          const lv = t < tw ? lerp(.2, .4, cl((t - at('idea')) / 3.5)) : t < tp ? lerp(.4, .95, ease((t - tw) / (tp - tw))) : lerp(.95, .22, ease((t - tp) / 2.4));
          gauge(lv);
          if (id === 'idea') K.text('HEAT', { y: 290, size: 170, color: 'red', scale: popIn(K, t, at('idea')) });
          if (id === 'laptop') { if (t < tw) K.text('YOUR BRAIN = A LAPTOP', { y: 300, size: 66, scale: popIn(K, t, at('laptop')) }); else K.text('WARM WHEN IT WORKS', { y: 300, size: 76, color: 'red', scale: popIn(K, t, tw) });
            if (t > tw + 1.6) K.text('A FAN COOLS IT', { y: 420, size: 70, color: COOL, scale: popIn(K, t, tw + 1.6) }); }
          if (id === 'fan') K.text('A YAWN = A FAN', { y: 300, size: 100, color: 'gold', scale: popIn(K, t, tf) });
          if (id === 'pull') { airIn(cl((t - tp) / .4), COOL, 13); K.text('COOL AIR IN', { y: 300, size: 100, color: COOL, scale: popIn(K, t, tp) }); }
          if (id === 'nodis') { airIn(.5, COOL, 9); K.text('NOT EVERY SCIENTIST AGREES', { y: 300, size: 54, color: 'white', scale: popIn(K, t, tn) }); }
          break; }
        case 'people': case 'hot': {   // B06: 160 people; hotter air than their bodies → they yawned less
          hideCast(); const th = at('hot'), tf = at('fits'), n = Math.round(160 * ease((t - at('people')) / 2.4));
          if (id === 'people') { K.text(n + ' PEOPLE', { y: 300, size: 130, color: 'gold', a: cl((t - at('people')) / .3) }); if (t > at('people') + 1.5) K.text('WINTER + SUMMER', { y: 430, size: 70, color: 'white', scale: popIn(K, t, at('people') + 1.5) }); }
          if (id === 'hot') { K.text('160 PEOPLE', { y: 290, size: 100, color: 'gold' });
            if (t < tf) K.text('AIR HOTTER THAN BODY', { x: 420, y: 420, size: 54, color: 'red', scale: popIn(K, t, th) });
            const tb = th + 1.5; if (t > tb) { const k = ease((t - tb) / .8), x0 = 200, y = 700; K.line(x0, y, x0 + 400, y, { color: '#1c2a4a', width: 46, a: .75 });
              K.line(x0, y, x0 + 400 * (1 - .6 * k), y, { color: GOLD, width: 30 }); K.text('YAWNS', { x: x0 + 60, y: y - 56, size: 44 }); K.text('↓', { x: x0 + 400 * (1 - .6 * k) + 40, y: y, size: 60, color: 'red', a: k }); }
            if (t >= tf) K.text('HOT AIR CAN\'T COOL YOU', { x: 480, y: 430, size: 56, color: 'gold', scale: popIn(K, t, tf) });
            if (t >= tf + 1.8) K.text('IT FITS', { y: 560, size: 90, color: 'gold', scale: popIn(K, t, tf + 1.8), rot: -.03 }); }
          break; }
        case 'rats': case 'drop': {   // B07: a probe: the brain heats before a yawn and cools after
          hideCast(); const td = at('drop'), lv = t < td ? lerp(.25, .98, ease((t - at('rats')) / 2.8)) : lerp(.98, .22, ease((t - td) / 1.8));
          gauge(lv);
          { const k = K.easeOut(cl((t - at('rats')) / .5)), fade = cl((td + 2.2 - t) / .6), p = K.img(520, 1060), w = 400 * s() * (.7 + .3 * k);   // the rat stands on the bench, its probe wire on its head
            K.prop('P08', { x: p.x, y: p.y, w, a: k * fade });
            if (t > at('rats') + 1.7 && t < td + 2) K.text('PROBE', { x: p.x + .42 * w, y: p.y - .5 * w, size: 64, color: 'gold', a: fade, scale: popIn(K, t, at('rats') + 1.7) }); }
          if (t < td) K.text('BEFORE A YAWN', { y: 300, size: 96, color: 'red', scale: popIn(K, t, at('rats')) });
          else K.text('AFTER: COOLER', { y: 300, size: 96, color: COOL, scale: popIn(K, t, td) });
          if (t < td && t > at('rats') + 1.4) K.text('IN RATS', { y: 420, size: 70, color: 'white', scale: popIn(K, t, at('rats') + 1.4) });
          break; }
        case 'mystery': case 'why': {   // yawns spread: nobody knows why
          hideCast();
          { const seats = [[110, 760], [850, 690], [190, 650], [790, 610], [240, 610], [735, 575], [280, 585], [705, 555]], t0 = at('spread');   // near rows first, then farther: the yawn travels
            seats.forEach((q, i) => { const u = (t - t0 - i * .35) / .9; if (u > 0 && u < 1) { const p = K.img(q[0], q[1] - 120); K.text('AAAH', { x: p.x, y: p.y - 60 * u, size: 70 + 14 * Math.sin(u * PI), color: u < .5 ? '#ffffff' : GOLD, a: Math.sin(u * PI), rot: (i % 2 ? .08 : -.08) }); } }); } K.text('?', { y: 300, size: 200, color: 'gold', scale: popIn(K, t, at('mystery')) * (1 + .04 * Math.sin(t * 5)), rot: .06 });
          if (id === 'mystery') { K.text('STILL A MYSTERY', { y: 540, size: 90, color: 'white', scale: popIn(K, t, at('mystery') + .3) });
            if (t > at('spread')) K.text('YAWNS SPREAD', { y: 660, size: 80, color: 'gold', scale: popIn(K, t, at('spread')) });
            if (t > at('spread') + 1.8) K.text('YOU YAWN TOO', { y: 780, size: 76, color: 'white', scale: popIn(K, t, at('spread') + 1.8), rot: .03 }); }
          if (id === 'why') K.text('NOBODY KNOWS WHY', { y: 540, size: 90, color: 'red', scale: popIn(K, t, at('why')) });
          break; }
        case 'mirror': case 'idk': {   // the answer
          hideCast(); gauge(lerp(.9, .22, ease((t - at('mirror')) / 2.0)), .9);
          airIn(.55, COOL, 10);
          if (id === 'mirror') { K.text('WHY DO WE YAWN?', { y: 290, size: 84, scale: popIn(K, t, at('mirror')) }); if (t > at('best')) K.text('TO COOL A WARM BRAIN', { y: 420, size: 64, color: 'gold', scale: popIn(K, t, at('best')) }); }
          else K.text('NOBODY\'S SURE', { y: 300, size: 100, color: 'white', scale: popIn(K, t, at('idk')) });
          break; }
        case 'doug': case 'diy': case 'cta': {   // THE SIGNATURE GOODBYE (Doug's problem closes: a yawn isn't a flaw); both friends yawn as the helicopter crosses
          K.placeAt('doug', 360, 1270, .3); K.placeAt('gary', 680, 1240, -.3);
          const hu = K.helicopter(t, 'probably', { y: 360, w: 520, dur: 4.2 }), up = hu < 0 ? 0 : Math.sin(PI * cl((hu - .05) / .85));
          const kd = yawnK(at('doug') + 1.2, 2.2), kg = yawnK(at('doug') + 1.7, 2.2);
          if (kd > .05) yawnPose(D, Math.min(1, kd)); else { face(D, up > .3 ? 'flat' : 'smile', t); D.pose(Object.assign({ t, nod: -.38 * up, gesture: id === 'cta' ? 'point' : 'hips', gw: id === 'cta' ? ease((Lc - .3) / .4) : 1 - up }, sway(1 - up))); }
          if (kg > .05) yawnPose(G, Math.min(1, kg)); else { face(G, 'smile', t, 1); G.pose(Object.assign({ t, nod: -.25 * up }, sway(1 - up))); }
          if (id === 'doug') { if (t < at('doug') + 2.8) K.text('A YAWN ISN\'T A FLAW', { y: 300, size: 80, color: 'gold', scale: popIn(K, t, at('doug') + .2) }); else if (t < at('probably')) K.text('JUST YOUR BRAIN\'S FAN', { y: 300, size: 70, color: COOL, scale: popIn(K, t, at('doug') + 2.8) }); else K.text('PROBABLY', { y: 300, size: 120, color: 'gold', scale: popIn(K, t, at('probably')), rot: -.04 }); }
          if (id === 'diy') K.text('FEEL THE COOL AIR', { y: 480, size: 92, color: 'gold', scale: popIn(K, t, at('diy')) });
          break; }
      }
    },
  };
})();
