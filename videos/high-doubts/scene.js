// high-doubts · couch talks ep. 2: "Have you ever had a high conversation with your best friend?" (2 a.m. doubts → "Yo bro, that's true" + proof)
// Same world as videos/high-conversation (den, low angle, fact road, sunset roof), red-eyed chill Doug + Gary.
// Who talks: Moon (Doug asks, Gary proves) · pyramids (Gary asks, Doug) · dinosaurs (Doug asks, Gary) · round Earth (Gary asks, Doug) · roof (Doug asks, Gary).
(function () {
  const PI = Math.PI;
  const face = (ch, name, t, off = 0) => ch.face(((t + off) % 4.3) < .12 && !['giggle', 'blink', 'scream', 'zoned', 'chill'].includes(name) ? 'blink' : name);
  const popIn = (K, t, from, dur = .35) => K.pop(K.clamp01((t - from) / dur));
  const L = {
    den: { key: [0xffb46a, 1.9, [8, 6, 5]], hemi: [0xc890e8, 0x5a3048, .95], front: [0xffd2c0, .8], shadow: [0x2a1030, .45] },
    road: { key: [0xffd890, 1.8, [-8, 7, 6]], hemi: [0xb8a0ff, 0x6a4a8a, 1.0], front: [0xfff0e0, .9], shadow: [0x2a1850, .35] },
    sunset: { key: [0xffb070, 2.6, [-12, 3, 2]], hemi: [0xffc8b0, 0x8a6a80, .8], front: [0xffe8dc, 1.0], shadow: [0x4a2a5a, .42] },
  };
  const DSEAT = [440, 812], GSEAT = [712, 812], SEAT_DY = -.47, DSEAT2 = [330, 1130], GSEAT2 = [650, 1110];
  const P1 = [218, 935], P2 = [605, 735], P3 = [930, 572];
  const blurred = new Set();
  // B02 close-ups: who is in focus
  const ON_D = [[.33, .55], [.33, .54]], ON_G = [[.62, .55], [.62, .54]];

  window.SCENE = {
    banner: 'THE HECK?',
    whip: true,
    follow: { from: 'cta+0.3' },
    plates: {
      B01: { img: 'B01_den_wide.png', hz: .40, vx: .5, fov0: 55, camH: 1.25, light: L.den },
      B02: { img: 'B02_couch_low_angle.png', hz: .58, vx: .55, fov0: 55, camH: .75, light: L.den },
      B03: { img: 'B03_fan_pov.png', hz: .5, vx: .5, fov0: 55, camH: 1.5, light: L.den },
      B04: { img: 'B04_brain_timeline.png', hz: .36, vx: .9, fov0: 55, camH: 2.2, light: L.road },
      E: { img: 'E01_city_sunset_ending.png', hz: .45, vx: .5, fov0: 55, camH: 2.0, light: L.sunset },
    },
    props: { PYR: 'P02_pyramid.png', MOON: 'P04_moon_lander.png', TREX: 'P06_trex.png', CHICK: 'P10_chicken.png', PAPY: 'P11_merer_papyrus.png',
      STICK: 'P12_stick_shadow.png', H01: 'H01_helicopter.png' },
    cast: { doug: 'chilldoug', gary: 'chillgary' },
    shots: [
      { at: 'q', plate: 'B01', zoom: [5.2, 1.75], focus: [[.42, .36], [.55, .44]] },          // THE HOOK: Doug's red-eyed face huge → crash-zoom out
      { at: 'q+0.55', plate: 'B01', zoom: [1.75, 1.6], focus: [[.55, .44], [.55, .45]] },
      { at: 'smacked', plate: 'B01', zoom: [1.6, 1.85], focus: [[.55, .45], [.55, .44]] },
      { at: 'couch', plate: 'B01', zoom: [1.45, 1.6], focus: [[.5, .47], [.55, .46]] },
      { at: 'moon', plate: 'B02', zoom: [1.6, 1.75], focus: ON_D },
      { at: 'true1', plate: 'B02', zoom: [1.6, 1.75], focus: ON_G },
      { at: 'mirrors', plate: 'B04', zoom: [1.0, 1.06], focus: [[.6, .5], [.6, .48]] },
      { at: 'crack1', plate: 'B01', zoom: [1.6, 1.7], focus: [[.55, .45], [.55, .45]] },
      { at: 'better1', plate: 'B02', zoom: [1.6, 1.75], focus: ON_G },
      { at: 'giants', plate: 'B04', zoom: [1.3, 1.4], focus: [[.25, .55], [.28, .55]] },
      { at: 'true2', plate: 'B02', zoom: [1.6, 1.75], focus: ON_D },
      { at: 'diary', plate: 'B04', zoom: [1.3, 1.4], focus: [[.28, .55], [.32, .55]] },
      { at: 'sand', plate: 'B04', zoom: [1.4, 1.5], focus: [[.32, .55], [.36, .56]] },
      { at: 'better2', plate: 'B02', zoom: [1.6, 1.75], focus: ON_D },
      { at: 'dinos', plate: 'B04', zoom: [1.0, 1.06], focus: [[.6, .5], [.6, .49]] },
      { at: 'true3', plate: 'B02', zoom: [1.6, 1.75], focus: ON_G },
      { at: 'chicken', plate: 'B04', zoom: [1.06, 1.12], focus: [[.6, .49], [.6, .5]] },
      { at: 'ate', plate: 'B01', zoom: [2.0, 2.2], focus: [[.55, .43], [.55, .43]] },
      { at: 'crack3', plate: 'B01', zoom: [1.5, 1.65], focus: [[.55, .45], [.55, .45]] },
      { at: 'better3', plate: 'B02', zoom: [1.6, 1.75], focus: ON_G },
      { at: 'round', plate: 'B03', zoom: [1.0, 1.12], focus: [[.5, .45], [.5, .45]] },
      { at: 'true5', plate: 'B02', zoom: [1.6, 1.75], focus: ON_D },
      { at: 'sticks', plate: 'B04', zoom: [1.3, 1.4], focus: [[.3, .55], [.34, .55]] },
      { at: 'roof', plate: 'E', zoom: [1.0, 1.06], focus: [[.5, .5], [.5, .5]] },
      { at: 'mirror', plate: 'E', zoom: [1.06, 1.12], focus: [[.5, .5], [.5, .5]] },
      { at: 'question', plate: 'E', zoom: [1.12, 1.12], focus: [[.5, .5], [.5, .49]] },
    ],
    shakes: [['q+0.3', .45, .8], ['crack1', .5, .25], ['crack3', .7, .35], ['crack4', .5, .25], ['chick2', .3, .3]],
    flashes: [['q+0.3', .16, .5]],
    tail: 1.2,

    update(t, K) {
      blurred.forEach(e => e.style.filter = 'none'); blurred.clear();
      const txt = (s, o) => { const e = K.text(s, o); if (o.blur) { e.style.filter = `blur(${o.blur}px)`; blurred.add(e); } return e; };
      const id = K.shot.id.split('+')[0], Lc = K.shot.local, at = c => K.T(c), s = () => K.imgScale();
      const D = K.cast.doug, G = K.cast.gary;
      const sway = (k = 1, ph = 0) => ({ look: .07 * k * Math.sin(t * .6 + ph), tilt: .06 * k * Math.sin(t * .8 + 1 + ph) });
      const seat = (n, [ix, iy], ry) => { const [x, z] = K.floorAt(ix, iy); return K.place(n, x, SEAT_DY, z, ry); };
      const legs = ch => { for (const k of [-1, 1]) { ch.leg[k].hip.rotation.set(-1.35, 0, k * .12); ch.leg[k].knee.rotation.x = 1.35; } };
      const laugh = (ch, ph = 0, k = 1) => { const b = Math.abs(Math.sin(t * 13 + ph)); ch.face('giggle');
        ch.pose({ t, lean: (ph ? -.16 : .2) * k + .05 * b, nod: -.18 - .06 * b, tilt: .12 * Math.sin(t * 3 + ph), armR: { raise: .15 }, armL: { raise: .1 }, gesture: ph ? 'facepalm' : undefined, gw: .6 });
        ch.root.position.y += .02 * b; };
      const has = haha => { const h1 = K.screenOf(D.head), h2 = K.screenOf(G.head);
        for (const [h, k] of [[h1, 0], [h2, 1]]) for (let i = 0; i < 2; i++) { const ph = (t * 1.6 + i * .5 + k * .25) % 1;
          txt('HA', { x: h.x + (k ? 70 : -70) + (k ? 1 : -1) * ph * 80, y: h.y - 140 - ph * 120, size: 58 + 20 * ph, color: '#fff', a: Math.sin(ph * PI), rot: (k ? .2 : -.2) }); } };
      const stamp = (str, from, color = 'gold', y = 300, size = 110) => txt(str, { y, size, color, scale: 1.4 - .4 * popIn(K, t, from, .25), a: K.clamp01((t - from) / .12), rot: -.06 });
      const couch = (where = 'B01') => { if (where === 'B01') { seat('doug', DSEAT, .25); seat('gary', GSEAT, -.25); } else { seat('doug', DSEAT2, .55); seat('gary', GSEAT2, .2); } };
      const chill = (ch, ph, k = 1, f = 'chill', p = {}) => { face(ch, f, t, ph); ch.pose(Object.assign({ t, lean: -.08 }, sway(k, ph), p)); legs(ch); };
      // the doubter squints and leans back, arms crossed; the prover leans in and points
      const doubt = (ch, ph) => chill(ch, ph, .4, 'zoned', { lean: -.12, gesture: 'cross', gw: 1 });
      const prove = (ch, ph, from) => chill(ch, ph, .3, 'smirk', { lean: .14, gesture: 'point', gw: K.ease((t - from) / .4) });
      const qmarks = (h, k = 1) => { for (let i = 0; i < 3; i++) { const ph = (t * .7 + i / 3) % 1; txt('?', { x: h.x + (i - 1) * 110 * k, y: h.y - 160 - ph * 140, size: 90, color: '#ff4a3d', a: Math.sin(ph * PI), rot: (i - 1) * .2 }); } };
      const p1 = () => K.img(...P1), p2 = () => K.img(...P2), p3 = () => K.img(...P3);
      const quote = (str, from, color = '#fff', size = 66) => txt(str, { y: 300, size, color, scale: popIn(K, t, from), w: 1000 });

      switch (id) {
        case 'q': case 'smacked': case 'doubt': case 'couch': {
          couch();
          if (id === 'q' && Lc < 3.5) {
            D.face(t < .3 ? 'zoned' : 'surprised'); D.pose(Object.assign({ t, lean: -.05, armR: { raise: .55 } }, sway(.3))); legs(D);
            K.hookReact(G, t, 'q'); legs(G); if (t > 1.1) { laugh(G, 1, .6); legs(G); }
            const a = K.clamp01((at('smacked') - .1 - t) / .3);
            txt('HIGH CONVERSATIONS', { y: 300, size: 86, color: 'gold', a, scale: popIn(K, t, .3) });
            txt('WITH YOUR BEST FRIEND', { y: 390, size: 56, a, scale: popIn(K, t, .7) });
          } else {
            const dbt = t > at('doubt');
            chill(D, 0, 1, dbt ? 'worried' : 'chill'); chill(G, 2, 1, dbt ? 'zoned' : 'chill');
            if (id === 'smacked' || id === 'q') { if (!dbt) txt('SMACKED', { y: 320, size: 110, color: 'red', scale: popIn(K, t, at('smacked') + .3), rot: -.05 });
              else { txt('YOU DOUBT EVERYTHING', { y: 320, size: 76, color: 'red', scale: popIn(K, t, at('doubt')) }); qmarks(K.screenOf(D.head)); qmarks(K.screenOf(G.head)); } }
            if (id === 'couch') txt('2:00 AM', { y: 300, size: 70, w: 340, color: '#fff', stroke: 0, shadow: false, bg: 'rgba(18,20,30,.85)', scale: popIn(K, t, at('couch')) });
          }
          break; }

        // ---------- B02 close-ups: the question and the "Yo bro, that's true" ----------
        case 'moon': couch('B02'); doubt(D, 0); chill(G, 2, .4, 'chill'); quote('"DID WE GO TO THE MOON?"', at('moon') + .2); if (t > at('moon') + 2.2) stamp('CAP.', at('moon') + 2.2, 'red', 400, 90); break;
        case 'true1': couch('B02'); prove(G, 2, at('true1')); chill(D, 0, .4, 'zoned'); stamp("YO BRO, THAT'S TRUE", at('true1') + .1, 'gold', 300, 74); break;
        case 'better1': couch('B02'); chill(G, 2, .4, 'smirk', { lean: .15, gesture: 'tada', gw: K.ease(Lc / .4) }); chill(D, 0, .5, 'chill'); quote('"OH NO. I GOT A BETTER ONE."', at('better1') + .1, 'gold', 64); break;
        case 'true2': couch('B02'); prove(D, 0, at('true2')); chill(G, 2, .4, 'zoned'); stamp("YO BRO, THAT'S TRUE", at('true2'), 'gold', 300, 74);
          if (t > at('true2') + 1) txt('REGULAR WORKERS BUILT THEM', { y: 400, size: 54, scale: popIn(K, t, at('true2') + 1) }); break;
        case 'better2': couch('B02'); chill(D, 0, .4, 'smirk', { lean: .15, gesture: 'wave', gw: K.ease(Lc / .4) }); chill(G, 2, .5, 'chill'); quote('"NAH, NAH. I GOT A BETTER ONE."', at('better2') + .1, 'gold', 60); break;
        case 'true3': couch('B02'); prove(G, 2, at('true3')); doubt(D, 0); stamp("YO BRO, THEY'RE REAL", at('true3'), 'gold', 300, 74); break;
        case 'better3': couch('B02'); chill(G, 2, .4, 'smirk', { lean: .1 }); chill(D, 0, .5, 'chill'); quote('"OKAY, OKAY. LAST ONE."', at('better3') + .1, 'gold', 64); break;
        case 'true5': couch('B02'); prove(D, 0, at('true5')); chill(G, 2, .4, 'zoned'); stamp("YO BRO, THAT'S TRUE", at('true5'), 'gold', 300, 74);
          if (t > at('true5') + 1) txt('A GREEK GUY MEASURED IT', { y: 400, size: 54, scale: popIn(K, t, at('true5') + 1) }); break;

        case 'crack1': case 'crack3': {   // they crack up
          couch(); laugh(D, 0, id === 'crack3' ? 1.3 : 1); legs(D); laugh(G, 1.7, id === 'crack3' ? 1.4 : 1); legs(G);
          if (id === 'crack3') { G.root.rotation.x = -.12; D.root.rotation.z = .1 * Math.sin(t * 9); }
          has(); break; }
        case 'ate': {   // "You ate a dinosaur today." Doug looks at his chicken-flavored chips in horror
          couch(); chill(G, 2, .3, 'smirk', { gesture: 'point', gw: 1 }); face(D, 'surprised', t); D.pose({ t, lean: -.2, armR: { raise: .45 }, armL: { raise: .45 }, handR: 'open', handL: 'open' }); legs(D);
          quote('YOU ATE A DINOSAUR TODAY', at('ate') + .1, 'gold', 64); break; }

        // ---------- the fact road: the proof ----------
        case 'mirrors': {   // a laser from Earth (bottom-left) to the mirrors by the lander, and back
          const m = p3(), sc = s(); K.prop('MOON', { x: m.x - 40 * sc, y: m.y - 90 * sc, w: 300 * sc });
          const ex = 120, ey = 1500, tl = at('lasers');
          txt('MIRRORS ON THE MOON', { y: 300, size: 72, color: '#fff', scale: popIn(K, t, at('mirrors') + .2) });
          if (t > tl) { const u = ((t - tl) * .9) % 1, out = u < .5, v = out ? u * 2 : (1 - u) * 2, tx = m.x - 40 * sc, ty = m.y - 60 * sc;
            K.line(ex, ey, K.lerp(ex, tx, out ? v : 1), K.lerp(ey, ty, out ? v : 1), { color: '#ff3b30', width: 8, a: .9 });
            if (!out) K.line(tx, ty, K.lerp(ex, tx, v), K.lerp(ey, ty, v), { color: '#ff9a90', width: 6, a: .9 });
            txt('LASERS. TODAY.', { y: 400, size: 70, color: 'gold', scale: popIn(K, t, tl + .2) }); }
          break; }
        case 'giants': {   // a giant? no: the pyramid, with a huge red "?" shadow
          const a = p1(), sc = s(); K.prop('PYR', { x: a.x + 70 * sc, y: a.y - 140 * sc, w: 320 * sc });
          txt('GIANTS?', { y: 300, size: 120, color: 'red', scale: popIn(K, t, at('giants') + .2), rot: -.05 }); qmarks({ x: a.x + 70 * sc, y: a.y - 200 * sc }, 1.4); break; }
        case 'diary': case 'sand': {
          const a = p1(), sc = s(); K.prop('PYR', { x: a.x + 70 * sc, y: a.y - 140 * sc, w: 320 * sc });
          if (id === 'diary') { K.prop('PAPY', { x: a.x + 300 * sc, y: a.y - 260 * sc, w: 300 * sc * K.pop(K.clamp01((t - at('diary') - .2) / .35)), rot: .05 });
            txt("MERER'S DIARY", { y: 300, size: 84, color: 'gold', scale: popIn(K, t, at('diary') + .2) });
            if (t > at('merer')) txt('4,500 YEARS OLD', { y: 400, size: 58, scale: popIn(K, t, at('merer') + .2) }); }
          else { for (let i = 0; i < 3; i++) K.flow(t, a.x - 120 * sc, a.y - 60 * sc + i * 40 * sc, a.x + 300 * sc, a.y - 60 * sc + i * 40 * sc, { color: '#9fd8ff', width: 16, ph: i * .3, speed: .9 });
            txt('WET SAND', { y: 300, size: 96, color: '#9fd8ff', scale: popIn(K, t, at('sand') + .2) });
            txt('= HALF THE PULL', { y: 400, size: 66, color: 'gold', scale: popIn(K, t, at('sand') + 1.2) }); }
          break; }
        case 'dinos': {
          const b = p2(), sc = s(); K.prop('TREX', { x: b.x - 40 * sc, y: b.y - 140 * sc, w: 480 * sc });
          txt('DID DINOSAURS EXIST?', { y: 300, size: 76, color: 'red', scale: popIn(K, t, at('dinos') + .2) }); qmarks({ x: b.x, y: b.y - 150 * sc }, 1.2);
          if (t > at('dinos') + 2) txt('"MAYBE THE BONES ARE FAKE"', { y: 400, size: 50, scale: popIn(K, t, at('dinos') + 2) });
          break; }
        case 'chicken': {   // T. rex and the chicken: cousins
          const a = p1(), b = p2(), sc = s(); K.prop('TREX', { x: a.x + 60 * sc, y: a.y - 110 * sc, w: 380 * sc });
          const u = K.pop(K.clamp01((t - at('chick2')) / .35)); if (u > 0) K.prop('CHICK', { x: b.x, y: b.y - 90 * sc - 10 * Math.abs(Math.sin(t * 7)), w: 230 * sc * u });
          txt("T. REX'S CLOSEST LIVING COUSIN…", { y: 300, size: 54, scale: popIn(K, t, at('chicken') + .1) });
          if (t > at('chick2')) { stamp('THE CHICKEN', at('chick2'), 'gold', 400, 100);
            const N = 26; let prev = null; const A = { x: a.x + 120 * sc, y: a.y - 260 * sc }, B = { x: b.x, y: b.y - 200 * sc };
            for (let k = 0; k <= N * K.ease((t - at('chick2') - .3) / .6); k++) { const v = k / N, q = { x: K.lerp(A.x, B.x, v), y: K.lerp(A.y, B.y, v) - Math.sin(v * PI) * 120 * sc }; if (prev) K.line(prev.x, prev.y, q.x, q.y, { color: 'gold', width: 9 }); prev = q; } }
          break; }
        case 'round': {   // looking up: is the Earth even round?
          txt('IS EARTH EVEN ROUND?', { y: 300, size: 80, color: 'red', scale: popIn(K, t, at('round') + .2) });
          qmarks({ x: 540, y: 900 }, 1.6); break; }
        case 'sticks': {   // two sticks, two different shadows → the Earth curves
          const a = p1(), b = p2(), sc = s(); K.prop('STICK', { x: a.x + 80 * sc, y: a.y - 80 * sc, w: 280 * sc });
          if (t > at('sticks') + .8) K.prop('STICK', { x: b.x, y: b.y - 60 * sc, w: 200 * sc * K.pop(K.clamp01((t - at('sticks') - .8) / .3)), flip: true });
          txt('STICKS + SHADOWS', { y: 300, size: 84, color: 'gold', scale: popIn(K, t, at('sticks') + .1) });
          if (t > at('bc')) txt('≈ 240 BC', { y: 400, size: 70, color: '#fff', scale: popIn(K, t, at('bc') + .1) });
          break; }

        case 'roof': case 'mirror': case 'question': {   // THE SIGNATURE GOODBYE
          K.placeAt('doug', 360, 1270, .3); K.placeAt('gary', 680, 1240, -.3);
          const hu = K.helicopter(t, 'heli', { y: 330, w: 520 }), up = hu < 0 ? 0 : Math.sin(PI * K.clamp01((hu - .05) / .85));
          if (t > at('crack4') && t < at('question')) { laugh(D, 0, .7); laugh(G, 1.7, .7); has(); }
          else {
            face(D, up > .3 ? 'zoned' : t > at('mirror') && t < at('true4') ? 'worried' : id === 'question' ? 'smile' : 'chill', t);
            D.pose(Object.assign({ t, nod: -.38 * up, gesture: t > at('mirror') && t < at('true4') ? 'point' : undefined, gw: 1, armR: t > at('mirror') && t < at('true4') ? { raise: .9 } : undefined }, sway(1 - up)));
            face(G, t > at('true4') ? 'smirk' : up > .3 ? 'zoned' : 'chill', t, 1);
            G.pose(Object.assign({ t, nod: -.3 * up, gesture: id === 'question' ? 'point' : t > at('true4') ? 'shrug' : undefined, gw: id === 'question' ? K.ease((t - at('question')) / .4) : 1 }, sway(1 - up, 2)));
          }
          if (id === 'roof' && t < at('heli')) txt('SUNRISE', { y: 300, size: 80, color: 'gold', scale: popIn(K, t, at('roof') + .2) });
          if (t > at('mirror') && t < at('true4')) txt('"IS THAT THING EVEN REAL?"', { y: 460, size: 58, scale: popIn(K, t, at('mirror') + .1) });
          if (t > at('true4') && t < at('crack4')) stamp("YO BRO… THAT'S TRUE", at('true4'), 'gold', 460, 70);
          if (id === 'question') { txt('WHICH ONE DID YOU', { y: 330, size: 70, color: 'gold', scale: popIn(K, t, at('question') + .1), a: K.clamp01((at('cta') - t) / .3) });
            txt('USED TO DOUBT? 👇', { y: 420, size: 70, color: 'gold', scale: popIn(K, t, at('question') + .5), a: K.clamp01((at('cta') - t) / .3) }); }
          break; }
      }
    },
  };
})();
