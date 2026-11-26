// yawn-why · Body Heck ep. 2: "Why do we yawn?"
// Built with the six lane skills (hook, script, visual, character-emotion, growth + scout: not run):
// frame 1 = Doug's giant yawn (5×) → crash-zoom out in 0.55 s (a separate hook+0.55 hold), no shouted opener, a change every ≤ 3 s,
// live numbers (100% OXYGEN, BREATHS ×2, 1987, 160 PEOPLE, a brain-heat gauge), emotion in bodies and props (stretch + head back, the
// pigeon, Gary → Doug copy), 2-4 word caption chunks (TEST), the send line + no follow button, the signature sunset ending with a body flip.
// Color code: red = hot/danger/no, light blue/white = cool air, gold = the answer. The science is NOT settled: labels say so.
(function () {
  const PI = Math.PI;
  const face = (ch, name, t, off = 0) => ch.face(((t + off) % 4.1) < .12 && !['happy', 'blink', 'scream', 'surprised'].includes(name) ? 'blink' : name);
  const popIn = (K, t, from, dur = .35) => K.pop(K.clamp01((t - from) / dur));
  const WORDS = window.VIDEO_DATA.words, norm = w => w.toLowerCase().replace(/[^a-z0-9]/g, '');
  const wordAt = (K, w, cue) => { const t0 = K.T(cue); const x = WORDS.find(o => o.start >= t0 - .01 && norm(o.w) === w); return x ? x.start : t0; };
  const ENDING = 'E01_city_sunset_ending.png';
  const HAVE_RAT = false;   // flip to true once art/P08_lab_rat.png (+ .cut.png via tools/cutout.py) exists
  const GOLD = '#ffd23f', RED = '#ff3b30', COOL = '#8fd8ff';

  const L = {
    night: { key: [0xffc27a, 1.7, [10, 5, 4]], hemi: [0x7c88e0, 0x4a3a5a, .95], front: [0xb0b4ff, .75], shadow: [0x10103a, .42] },
    brain: { key: [0xffb080, 1.8, [0, 6, 6]], hemi: [0xffd8c0, 0x8a5a50, .9], front: [0xfff0e0, 1.0], shadow: [0x5a2a3a, .35] },
    hot: { key: [0xfff0c0, 2.4, [10, 8, 4]], hemi: [0xffe0b0, 0xb08060, .95], front: [0xfff4e0, 1.0], shadow: [0x2a6a7a, .35] },
    sunset: { key: [0xffb070, 2.6, [-12, 3, 2]], hemi: [0xffc8b0, 0x8a6a80, .8], front: [0xffe8dc, 1.0], shadow: [0x4a2a5a, .42] },
  };
  // B01 spots (image px), same staging as ep. 1: Doug in the armchair, Gary flat on the bed
  const PILLOW = [215, 560], FEET = [500, 815], DPILLOW = [650, 525], DFEET = [885, 665];   // B08: Gary lies on his bed (left), Doug on his (right); head on the pillow, feet at the footboard
  // B05 brain room (image px)
  const TUNNEL = [130, 1080], CONSOLE = [595, 560], FANHOLE = [210, 310];

  window.SCENE = {
    banner: 'THE HECK?',
    whip: true,
    captionChunk: 3,   // TEST (creator research): 2-4 word chunks
    plates: {
      B01: { img: 'B08_two_beds_bedroom.png', hz: .2, vx: .72, fov0: 55, camH: 2.5, light: L.night },   // the new two-bed bedroom (Doug's bed right, Gary's bed left)
      B05: { img: 'B07_brain_hot_yawn.png', hz: .5, vx: .5, fov0: 55, camH: 1.5, light: L.brain },   // the brain painting (replaced the rejected 'brain room' B05)
      B06: { img: 'B06_hot_street_summer.png', hz: .45, vx: .5, fov0: 55, camH: 1.6, light: L.hot },
      E: { img: ENDING, hz: .45, vx: .5, fov0: 55, camH: 2.0, light: L.sunset },
    },
    props: Object.assign({ P05: 'P05_oxygen_tank.cut.png', P06: 'P06_pigeon.cut.png', P07: 'P07_laptop_fan.cut.png', H01: 'H01_helicopter.png' }, HAVE_RAT ? { P08: 'P08_lab_rat.cut.png' } : {}),
    cast: { doug: 'hoodie', gary: 'oxford' },
    shots: [
      { at: 'hook', plate: 'B01', zoom: [5.0, 1.3], focus: [[.66, .34], [.5, .42]] },            // THE HOOK: Doug's giant yawn on his pillow → crash-zoom out to BOTH beds in 0.55 s
      { at: 'hook+0.55', plate: 'B01', zoom: [1.3, 1.5], focus: [[.5, .42], [.5, .4]] },          // hold: both friends lying in their own beds, Doug mid-yawn
      { at: 'notair', plate: 'B01', zoom: [1.5, 2.2], focus: [[.5, .4], [.66, .34]] },
      { at: 'nottired', plate: 'B01', zoom: [2.2, 1.8], focus: [[.66, .34], [.24, .38]] },
      { at: 'card', plate: 'B01', zoom: [1.8, 2.1], focus: [[.24, .38], [.66, .34]] },
      { at: 'gary', plate: 'B01', zoom: [2.1, 1.6], focus: [[.66, .34], [.3, .4]] },
      { at: 'bet', plate: 'B01', zoom: [1.6, 2.1], focus: [[.3, .4], [.66, .34]] },
      { at: 'o2', plate: 'B01', zoom: [2.1, 1.7], focus: [[.66, .34], [.6, .42]] },
      { at: 'laps', plate: 'B01', zoom: [1.1, 1.25], focus: [[.4, .62], [.6, .62]] },
      { at: 'rehook', plate: 'B05', zoom: [1.0, 1.1], focus: [[.5, .5], [.5, .48]] },
      { at: 'cool', plate: 'B05', zoom: [1.1, 1.25], focus: [[.5, .48], [.6, .42]] },
      { at: 'laptop', plate: 'B05', zoom: [1.25, 1.0], focus: [[.6, .42], [.5, .5]] },
      { at: 'people', plate: 'B06', zoom: [1.0, 1.2], focus: [[.5, .55], [.6, .5]] },
      { at: 'rats', plate: 'B05', zoom: [1.0, 1.25], focus: [[.5, .5], [.6, .36]] },
      { at: 'drop', plate: 'B05', zoom: [1.25, 1.0], focus: [[.6, .36], [.5, .5]] },
      { at: 'perfect3', plate: 'B01', zoom: [1.1, 1.3], focus: [[.5, .5], [.4, .42]] },
      { at: 'catch', plate: 'B01', zoom: [1.3, 1.9], focus: [[.4, .42], [.24, .38]] },
      { at: 'doug2', plate: 'B01', zoom: [1.5, 1.9], focus: [[.42, .4], [.66, .35]] },
      { at: 'flip', plate: 'E', zoom: [1.04, 1.12], focus: [[.5, .53], [.5, .5]] },
      { at: 'diy', plate: 'E', zoom: [1.12, 1.2], focus: [[.5, .5], [.5, .48]] },
      { at: 'cta', plate: 'E', zoom: [1.2, 1.3], focus: [[.5, .48], [.5, .47]] },
    ],
    shakes: [['hook+0.3', .45, .7], ['catch', .2, .3]],
    flashes: [['hook+0.28', .22, .7]],
    tail: 1.0,

    update(t, K) {
      const id = K.shot.id.split('+')[0], Lc = K.shot.local, at = c => K.T(c), s = () => K.imgScale();
      const D = K.cast.doug, G = K.cast.gary;
      const sway = (k = 1) => ({ look: .06 * k * Math.sin(t * .7), tilt: .04 * k * Math.sin(t * .9 + 1) });
      const seat = (n, [ix, iy], dy, ry) => { const [x, z] = K.floorAt(ix, iy); return K.place(n, x, dy, z, ry); };
      const zzz = (ch, k = 1) => { const h = K.screenOf(ch.head); for (let i = 0; i < 3; i++) { const ph = (t * .45 + i / 3) % 1;
        K.text('Z', { x: h.x + 60 * k + ph * 120 * k, y: h.y - 90 * k - ph * 200 * k, size: (50 + 50 * ph) * k, color: '#cfe0ff', stroke: Math.round(8 * k), a: Math.sin(ph * PI) }); } };
      // Gary flat on the bed (staging from ep. 1): head on the pillow, feet toward the far end of the duvet
      // Both friends LIE on their own beds (B08: two diagonal beds). The pose is applied each frame; the root placement is solved ONCE per character
      // (search over the bed's yaw + damped Newton: head on the pillow, feet at the footboard) and cached in window.__FITS.
      // Solved once at a neutral camera (plate hz .2, camH 2.5), then shrunk 15% on Brian's note ("a tiny bit smaller") with the heads re-solved onto the pillows; hardcoded so they never depend on the first frame's zoom. Re-solve if the painting or camera numbers change.
      const FITS = window.__FITS = window.__FITS || { gary: { x: 1.3106, z: -7.4618, sc: 1.2970, ry: -0.7 }, doug: { x: 4.1351, z: -9.6684, sc: 1.1388, ry: -0.7 } };
      const lie = (name, ch, PIL, FT) => { const y = .9, put = (x, z, sc, ry) => { K.place(name, x, y, z, 0, sc); ch.root.rotation.set(0, ry, PI / 2); ch.root.updateMatrixWorld(true); };
        let F = FITS[name];
        if (!F) { const tg = K.img(...PIL), tf = K.img(...FT); let best = null;
          for (let ry = -.7; ry <= .71; ry += .05) { let [x, z] = K.floorAt(PIL[0] + 150, Math.min(1500, PIL[1] + 220)), sc = 1.5, ok = true;
            for (let it = 0; it < 6 && ok; it++) {
              for (let k = 0; k < 3; k++) { put(x, z, sc, ry); const a0 = K.screenOf(ch.head); put(x + .05, z, sc, ry); const b0 = K.screenOf(ch.head); put(x, z + .05, sc, ry); const c0 = K.screenOf(ch.head);
                const j11 = (b0.x - a0.x) / .05, j21 = (b0.y - a0.y) / .05, j12 = (c0.x - a0.x) / .05, j22 = (c0.y - a0.y) / .05, det = j11 * j22 - j12 * j21, ex = tg.x - a0.x, ey = tg.y - a0.y;
                if (!isFinite(det) || Math.abs(det) < 1e-4) { ok = false; break; }
                const dx = (j22 * ex - j12 * ey) / det, dz = (-j21 * ex + j11 * ey) / det; x += Math.max(-2, Math.min(2, dx)); z += Math.max(-2, Math.min(2, dz)); }
              if (!ok) break; put(x, z, sc, ry); const h = K.screenOf(ch.head), f = K.screenOf(ch.leg[1].ankle), ns = sc * Math.hypot(tf.x - tg.x, tf.y - tg.y) / Math.max(1, Math.hypot(f.x - h.x, f.y - h.y));
              if (!isFinite(ns)) { ok = false; break; } sc = Math.min(8, Math.max(.6, ns)); }
            if (!ok || !isFinite(x) || !isFinite(z)) continue; put(x, z, sc, ry); const h = K.screenOf(ch.head), f = K.screenOf(ch.leg[1].ankle), err = Math.hypot(h.x - tg.x, h.y - tg.y) + Math.hypot(f.x - tf.x, f.y - tf.y);
            if (isFinite(err) && sc < 7.9 && (!best || err < best.err)) best = { x, z, sc, ry, err }; }
          F = FITS[name] = best || { x: 0, z: -10, sc: 1.5, ry: 0, err: -1 }; console.log('FIT ' + name, JSON.stringify(F)); }
        put(F.x, F.z, F.sc, F.ry); if (ch.blob) ch.blob.visible = false; };
      const garyAsleep = (fc = 'blink', o = {}) => { G.face(fc); G.pose(Object.assign({ t, tilt: -.45, nod: .05, armR: { raise: .05 }, armL: { raise: .05 } }, o)); lie('gary', G, PILLOW, FEET); };
      const dougLying = () => lie('doug', D, DPILLOW, DFEET);
      const HEADSET = new Set(); G.head.traverse(o => HEADSET.add(o));
      const bodyVis = on => { G.root.traverse(o => { if (o.isMesh) o.visible = on || HEADSET.has(o); }); if (G.blob) G.blob.visible = on; };
      D.root.rotation.set(0, 0, 0); bodyVis(true); G.root.rotation.set(0, 0, 0); if (G.blob) G.blob.visible = true;   // reset the lying pose every frame
      // THE YAWN (a body beat, no engine face): hollow-o mouth, head back, both arms stretching up. k = 0..1
      const yawnPose = (ch, k, o = {}) => { ch.face(k > .25 ? 'surprised' : 'flat'); ch.pose(Object.assign({ t, nod: -.4 * k, lean: -.1 * k, armR: { raise: .95 * k }, armL: { raise: .95 * k }, handR: 'open', handL: 'open' }, o)); };
      const yawnK = (t0, dur = 1.8) => { const u = (t - t0) / dur; return u < 0 || u > 1 ? 0 : Math.sin(u * PI) ** .6; };
      const hd = ch => K.screenOf(ch.head);
      // the brain-heat gauge (a bar at the left): level 0..1, red when hot, light blue when cool
      const gauge = (lv, a = 1) => { const x = 950, y0 = 1700, y1 = 1330, h = (y0 - y1) * lv, col = lv > .55 ? RED : lv > .3 ? '#ffb347' : COOL;
        K.line(x, y0, x, y1, { color: '#1c2a4a', width: 52, a: .75 * a }); K.line(x, y0, x, y0 - Math.max(2, h), { color: col, width: 36, a });
        K.text('BRAIN HEAT', { x: x - 50, y: y0 + 55, size: 40, a, color: 'white' }); };
      const lerp = K.lerp, cl = K.clamp01, ease = K.ease;

      switch (id) {
        case 'hook': case 'notair': case 'nottired': case 'card': case 'gary': case 'bet': case 'o2': case 'perfect3': case 'catch': case 'doug2': {
          // ---- B01: Doug in the armchair, Gary asleep in bed
          const tYawn = id === 'hook' ? 0 : null;
          let dk = 0, gk = 0, gface = 'blink';
          if (id === 'hook') dk = 1 - cl((t - 1.6) / 1.0);                                          // frame 1: Doug fully mid-yawn (arms up, head back), eased out after the hold
          else if (id === 'notair') dk = Math.max(0, 1 - Lc / 1.6) * .8;
          else if (id === 'card') dk = yawnK(at('card') + .4, 1.6) + yawnK(at('grab') + .2, 1.4);
          else if (id === 'gary') dk = yawnK(at('gary') + .3, 1.6);
          else if (id === 'bet') dk = 0;
          else if (id === 'o2') dk = t > at('perfect') + .6 && t < at('perfect') + .6 ? 1 : 0;
          else if (id === 'catch') dk = 0;
          else if (id === 'doug2') dk = yawnK(at('doug2') - .1, 2.2);
          if (id === 'catch' || id === 'doug2') { gk = yawnK(at('catch') + .2, 2.4); gface = gk > .3 ? 'surprised' : 'blink'; }
          if (dk > .02) yawnPose(D, Math.min(1, dk)); else { face(D, id === 'perfect3' || id === 'o2' && t > at('except') ? 'worried' : 'flat', t); D.pose(Object.assign({ t, look: -.3, armR: { raise: .0 } }, sway(.6))); }
          if (id === 'o2' && t > at('perfect') && t < at('except')) { face(D, 'happy', t); D.pose({ t, gesture: 'tada', gw: ease((t - at('perfect')) / .4) }); }
          if (id === 'perfect3') { const ex = at('except3'); if (t < ex) { face(D, 'happy', t); D.pose({ t, gesture: 'tada', gw: ease((t - at('perfect3')) / .4) }); } }
          dougLying();
          if (gk > .02) { garyAsleep(gface, { armR: { raise: .05 + .6 * gk }, armL: { raise: .05 + .6 * gk }, nod: .05 - .25 * gk }); } else garyAsleep('blink');
          // overlays
          if (id === 'hook') { const a = cl(t / .25); K.text('WHY DO WE', { y: 250, size: 90, a: a * cl((at('notair') - t) / .3), scale: .9 + .1 * popIn(K, t, 0) });
            K.text('YAWN?', { y: 370, size: 150, color: 'gold', a: a * cl((at('notair') - t) / .3), scale: .9 + .1 * popIn(K, t, .15) }); }
          if (id === 'hook' && t > at('nobody')) { const h = hd(D); K.text('?', { x: h.x + 150, y: h.y - 190, size: 170, color: 'gold', scale: popIn(K, t, at('nobody')) * (1 + .05 * Math.sin(t * 6)), rot: .08 }); }
          if (id === 'notair') { const h = hd(D); const k = ease(Lc / .4);
            for (let i = 0; i < 3; i++) K.flow(t, h.x + 280 + i * 20, h.y - 40 + i * 50, h.x + 70, h.y + 10 + i * 24, { width: 8, a: .8 * k * (t < at('nottired') ? 1 : 0), ph: i * .3 });
            K.text('NOT FOR AIR', { y: 300, size: 110, color: 'red', scale: popIn(K, t, at('notair')) });
            if (Lc > .5) K.text('✖', { x: h.x + 170, y: h.y + 10, size: 150, color: 'red', a: cl((Lc - .5) / .2) * .95 }); }
          if (id === 'nottired') { K.text('NOT JUST TIRED', { y: 300, size: 96, color: 'gold', scale: popIn(K, t, at('nottired')) }); zzz(G, 1); }
          if (id === 'card') { const tj = at('joke'); if (t > at('grab')) { /* Doug yawns, wipes his eyes */ }
            if (t > tj) { const h = hd(D), k = K.easeOut(cl((t - tj) / .4)); K.prop('P06', { x: h.x + 150, y: h.y - 140 - 140 * (1 - k) + 6 * Math.sin(t * 5), w: 230 * s() / 1.3, rot: -.1 }); }
            if (t > at('grab') && t < tj) K.text('CAN\'T STOP', { y: 300, size: 96, color: 'gold', scale: popIn(K, t, at('grab')) });
            if (t >= tj && t < tj + 1.6) K.text('ONE WIDE YAWN', { y: 300, size: 92, color: 'gold', scale: popIn(K, t, tj) });
            if (t >= tj + 1.6) K.text('VACANCY?', { y: 300, size: 110, color: 'white', scale: popIn(K, t, tj + 1.6), rot: -.04 }); }
          if (id === 'gary') { const tj = at('joke'); if (t < at('gary') + .6) { const h = hd(D); K.prop('P06', { x: h.x + 150, y: h.y - 140, w: 230 * s() / 1.3, rot: -.1 }); }
            zzz(G, 1); if (t > at('gary')) K.text('GARY: ASLEEP', { y: 300, size: 90, scale: popIn(K, t, at('gary')) }); }
          if (id === 'bet') { const h = hd(D), tI = at('idea');
            K.text('THE AIR THING', { y: 300, size: 100, scale: popIn(K, t, at('bet')) });
            if (t > tI) for (let i = 0; i < 3; i++) K.flow(t, h.x + 300, h.y - 20 + i * 60, h.x + 80, h.y + 20 + i * 30, { width: 9, a: cl((t - tI) / .3), ph: i * .3 }); }
          if (id === 'o2') { const h = hd(D), to = at('o2'), tt = at('tested'), k = K.easeOut(cl((t - to) / .45));
            K.prop('P05', { x: h.x + 330 - 40 * (1 - k), y: h.y + 400, w: 330 * s() / 1.3, a: k, rot: .05 });
            K.text('100% OXYGEN', { y: 300, size: 100, color: 'gold', a: t < at('perfect') ? 1 : 0, scale: popIn(K, t, to) });
            if (t > at('perfect') && t < at('except')) K.text('PERFECT!', { y: 300, size: 130, color: 'gold', scale: popIn(K, t, at('perfect')), rot: -.04 });
            if (t >= at('except') && t < tt) K.text('EXCEPT…', { y: 300, size: 130, color: 'red', scale: popIn(K, t, at('except')), rot: .04 });
            if (t >= tt) { K.text('1987', { y: 290, size: 140, color: 'gold', scale: popIn(K, t, tt) });
              const tn = wordAt(K, 'nothing', 'tested'); if (t >= tn - .1) K.text('NO CHANGE', { y: 420, size: 100, color: 'red', scale: popIn(K, t, tn - .1), rot: -.03 }); } }
          if (id === 'perfect3') { const ex = at('except3'); K.text(t < ex ? 'PERFECT!' : 'EXCEPT…', { y: 300, size: 130, color: t < ex ? 'gold' : 'red', scale: popIn(K, t, t < ex ? at('perfect3') : ex), rot: t < ex ? -.04 : .04 }); }
          if (id === 'catch') { const h = hd(G); if (gk > .1) K.text('GARY YAWNS', { y: 300, size: 100, color: 'gold', scale: popIn(K, t, at('catch') + .2) }); }
          if (id === 'doug2') { const hg = hd(G), hdg = hd(D), tw = at('why');
            if (t > at('doug2')) for (let i = 0; i < 3; i++) K.flow(t, hg.x + 80, hg.y - 20 + i * 40, hdg.x - 120, hdg.y + i * 30, { width: 9, color: COOL, a: .85 * cl((t - at('doug2')) / .3), ph: i * .3 });
            if (t < tw) K.text('DOUG YAWNS TOO', { y: 300, size: 90, color: 'gold', scale: popIn(K, t, at('doug2')) });
            else K.text('WHY?', { y: 300, size: 170, color: 'red', scale: popIn(K, t, tw), rot: -.05 }); }
          break; }
        case 'laps': {   // Doug runs in place on the bedroom floor; a BREATHS ×2 counter; same result
          const tp = at('perfect2'), te = at('except2'), ts = at('same');
          const [x, z] = K.floorAt(520, 1010); K.place('doug', x, 0, z, .0);
          const k = t >= te ? yawnK(te + .2, 1.6) : 0;
          if (k > .05) { yawnPose(D, Math.min(1, k), { walk: t * 2.4, walkAmt: .6 }); } else { face(D, t < tp ? 'worried' : 'happy', t); D.pose(Object.assign({ t, walk: t * 2.4, walkAmt: 1 }, {})); }
          garyAsleep('blink');
          for (let i = 0; i < 4; i++) { const ph = (t * 1.1 + i / 4) % 1, h = hd(D); K.text('●', { x: h.x + 70 + i * 22, y: h.y - 40 + ph * 90, size: 22, color: COOL, stroke: 0, shadow: false, a: 1 - ph }); }
          if (t < tp) K.text('BREATHS ×2', { y: 300, size: 110, color: 'gold', scale: popIn(K, t, at('laps')) });
          else if (t < te) K.text('PERFECT!', { y: 300, size: 130, color: 'gold', scale: popIn(K, t, tp), rot: -.04 });
          else if (t < ts) K.text('EXCEPT…', { y: 300, size: 130, color: 'red', scale: popIn(K, t, te), rot: .04 });
          else K.text('SAME RESULT', { y: 300, size: 110, color: 'red', scale: popIn(K, t, ts) });
          break; }
        case 'rehook': {   // B05: the question beat
          K.text('?', { y: 330, size: 260, color: 'gold', scale: popIn(K, t, at('rehook')) * (1 + .04 * Math.sin(t * 5)), rot: -.06 });
          K.text('WHAT IS IT?', { y: 470, size: 100, scale: popIn(K, t, at('rehook') + .3) });
          if (t > at('rehook') + 1.7) { const kk = cl((t - at('rehook') - 1.7) / .4); for (let i = 0; i < 3; i++) { const a = K.img(20, 960 + i * 50), b = K.img(250, 990 + i * 40); K.flow(t, a.x, a.y, b.x, b.y, { width: 10, color: COOL, a: .7 * kk, ph: i * .25 }); } }
          K.cast.doug.root.visible = false; K.cast.gary.root.visible = false; break; }
        case 'cool': case 'laptop': {   // B05: the brain runs warm; a laptop; a yawn pulls in cool air, like a little fan
          const tw = at('warm'), tpl = at('pull');
          const lv = t < tw ? lerp(.25, .5, cl((t - at('cool')) / 1.5)) : t < tpl ? lerp(.5, .95, ease((t - tw) / 1.6)) : lerp(.95, .22, ease((t - tpl) / 2.2));
          gauge(lv);
          if (t > at('laptop')) { const k = K.easeOut(cl((t - at('laptop')) / .45)); K.prop('P07', { x: 300, y: 1530 + 6 * Math.sin(t * 2.2), w: 460 * (.6 + .4 * k), a: k, rot: -.03 }); }
          if (t < tw) K.text('YOUR BRAIN', { y: 300, size: 100, scale: popIn(K, t, at('cool')) });
          else if (t < tpl) K.text('RUNS WARM', { y: 300, size: 110, color: 'red', scale: popIn(K, t, tw) });
          if (t >= tpl - .2) { const kk = cl((t - tpl + .2) / .4);
            for (let i = 0; i < 3; i++) { const a = K.img(20, 960 + i * 50), b = K.img(250, 990 + i * 40); K.flow(t, a.x, a.y, b.x, b.y, { width: 12, color: COOL, a: kk, ph: i * .25 }); }
            for (let i = 0; i < 2; i++) { const a = K.img(360 + i * 40, 940), b = K.img(560 + i * 40, 770); K.flow(t, a.x, a.y, b.x, b.y, { width: 12, color: COOL, a: kk, ph: i * .35 }); }
            K.text('A LITTLE FAN', { y: 300, size: 100, color: 'gold', scale: popIn(K, t, tpl) }); }
          K.cast.doug.root.visible = false; K.cast.gary.root.visible = false; break; }
        case 'people': {   // B06: 160 people, hotter than their bodies → they yawned less
          const th = at('hot'), n = Math.round(160 * ease((t - at('people')) / 2.2));
          K.text(n + ' PEOPLE', { y: 300, size: 130, color: 'gold', a: cl((t - at('people')) / .3) });
          if (t >= th) { K.text('AIR HOTTER THAN BODY', { x: 420, y: 430, size: 54, color: 'red', scale: popIn(K, t, th) });
            const tb = th + 1.5; if (t > tb) { const k = ease((t - tb) / .8), x0 = 200, y = 700; K.line(x0, y, x0 + 400, y, { color: '#1c2a4a', width: 46, a: .75 });
              K.line(x0, y, x0 + 400 * (1 - .6 * k), y, { color: GOLD, width: 30 }); K.text('YAWNS', { x: x0 + 60, y: y - 56, size: 44 }); K.text('↓', { x: x0 + 400 * (1 - .6 * k) + 40, y: y, size: 60, color: 'red', a: k }); } }
          K.cast.doug.root.visible = false; K.cast.gary.root.visible = false; break; }
        case 'rats': case 'drop': {   // B05: a rat with a probe: the brain heats up before a yawn and cools after
          const td = at('drop'), lv = t < td ? lerp(.3, .98, ease((t - at('rats')) / 2.6)) : lerp(.98, .22, ease((t - td) / 1.6));
          gauge(lv);
          const k = K.easeOut(cl((t - at('rats')) / .45)), p = K.img(560, 1130); if (HAVE_RAT) K.prop('P08', { x: p.x, y: p.y, w: 420 * s() * (.7 + .3 * k), a: k * (t < td + 1.4 ? 1 : cl((td + 2 - t) / .6)) });
          { const a = K.img(600, 330), b = K.img(640, 90), kp = ease((t - at('rats') - .3) / .6); if (!HAVE_RAT && kp > 0) { K.line(a.x, a.y, a.x + (b.x - a.x) * kp, a.y + (b.y - a.y) * kp, { color: '#cfd6e6', width: 7 }); K.text('●', { x: a.x, y: a.y, size: 36, color: GOLD, stroke: 0, shadow: false, a: kp }); }
            if (t > at('rats') + 1.7 && t < td) K.text('PROBE', { x: b.x + 120, y: b.y + 40, size: 64, color: 'gold', scale: popIn(K, t, at('rats') + 1.7) }); }
          if (t < td) K.text('BEFORE A YAWN', { y: 300, size: 96, color: 'red', scale: popIn(K, t, at('rats')) });
          else K.text('AFTER: COOLER', { y: 300, size: 96, color: COOL, scale: popIn(K, t, td) });
          K.cast.doug.root.visible = false; K.cast.gary.root.visible = false; break; }
        case 'flip': case 'diy': case 'cta': {   // THE SIGNATURE GOODBYE: the city sunset, the helicopter crosses; BOTH friends yawn (the body flip)
          K.placeAt('doug', 360, 1270, .3); K.placeAt('gary', 680, 1240, -.3);
          const hu = K.helicopter(t, 'mirror', { y: 360, w: 520, dur: 4.2 }), up = hu < 0 ? 0 : Math.sin(PI * K.clamp01((hu - .05) / .85));
          const kd = yawnK(at('flip') + .2, 2.2), kg = yawnK(at('flip') + .6, 2.2);
          if (kd > .05) yawnPose(D, Math.min(1, kd)); else { face(D, up > .3 ? 'flat' : 'smirk', t); D.pose(Object.assign({ t, nod: -.38 * up, gesture: id === 'cta' ? 'point' : 'hips', gw: id === 'cta' ? ease((Lc - .3) / .4) : 1 - up }, sway(1 - up))); }
          if (kg > .05) yawnPose(G, Math.min(1, kg)); else { face(G, 'smile', t, 1); G.pose(Object.assign({ t, nod: -.25 * up }, sway(1 - up))); }
          if (id === 'flip' && t > at('flip')) K.text('I\'D BET YOU YAWNED', { y: 300, size: 80, color: 'gold', scale: popIn(K, t, at('flip')) });
          if (id === 'diy') K.text('FEEL THE COOL AIR', { y: 480, size: 92, color: 'gold', scale: popIn(K, t, at('diy')) });
          break; }
      }
    },
  };
})();
