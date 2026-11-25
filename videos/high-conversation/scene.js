// high-conversation · one-off relatable skit: "Have you ever had a high conversation with your best friend?"
// Every line is a real fact (sources.md). Doug + Gary in their chill looks (outfits 'chilldoug' / 'chillgary', faces chill/zoned/giggle).
// Places: B01 den wide (the couch), B02 low angle (close-ups), B03 fan POV (the stars), B04 the fact road (every fact lands on it),
// E01 the signature sunset rooftop + helicopter. Nothing on screen shows a drug.
(function () {
  const PI = Math.PI;
  const face = (ch, name, t, off = 0) => ch.face(((t + off) % 4.3) < .12 && !['giggle', 'blink', 'scream', 'zoned', 'chill'].includes(name) ? 'blink' : name);
  const popIn = (K, t, from, dur = .35) => K.pop(K.clamp01((t - from) / dur));
  const ENDING = 'E01_city_sunset_ending.png';
  const L = {
    den: { key: [0xffb46a, 1.9, [8, 6, 5]], hemi: [0xc890e8, 0x5a3048, .95], front: [0xffd2c0, .8], shadow: [0x2a1030, .45] },
    road: { key: [0xffd890, 1.8, [-8, 7, 6]], hemi: [0xb8a0ff, 0x6a4a8a, 1.0], front: [0xfff0e0, .9], shadow: [0x2a1850, .35] },
    sunset: { key: [0xffb070, 2.6, [-12, 3, 2]], hemi: [0xffc8b0, 0x8a6a80, .8], front: [0xffe8dc, 1.0], shadow: [0x4a2a5a, .42] },
  };
  // B01 (den wide, 1024x1536): floor pixels under the hips on the couch seat (left cushion = Doug, right cushion = Gary)
  const DSEAT = [440, 812], GSEAT = [712, 812], SEAT_DY = -.47;
  // B02 (low angle): couch seat spots
  const DSEAT2 = [330, 1130], GSEAT2 = [650, 1110];
  // B04 fact road platforms (image px, top surface centers)
  const P1 = [218, 935], P2 = [605, 735], P3 = [930, 572];
  const blurred = new Set();

  window.SCENE = {
    banner: 'THE HECK?',
    whip: true,
    follow: { from: 'cta+0.3' },
    plates: {
      B01: { img: 'B01_den_wide.png', hz: .40, vx: .5, fov0: 55, camH: 1.25, light: L.den },
      B02: { img: 'B02_couch_low_angle.png', hz: .58, vx: .55, fov0: 55, camH: .75, light: L.den },
      B03: { img: 'B03_fan_pov.png', hz: .5, vx: .5, fov0: 55, camH: 1.5, light: L.den },
      B04: { img: 'B04_brain_timeline.png', hz: .36, vx: .9, fov0: 55, camH: 2.2, light: L.road },
      E: { img: ENDING, hz: .45, vx: .5, fov0: 55, camH: 2.0, light: L.sunset },
    },
    props: { CARDS: 'P01_cards_deck.png', PYR: 'P02_pyramid.png', CROWN: 'P03_cleopatra_crown.png', MOON: 'P04_moon_lander.png',
      MAM: 'P05_mammoth.png', TREX: 'P06_trex.png', STEG: 'P07_stegosaurus.png', TG: 'P08_tree_and_galaxy.png', DV: 'P09_davinci_sketch.png', H01: 'H01_helicopter.png' },
    cast: { doug: 'chilldoug', gary: 'chillgary' },
    shots: [
      { at: 'q', plate: 'B01', zoom: [5.2, 1.75], focus: [[.42, .36], [.55, .44]] },          // THE HOOK: Doug's zoned face huge → crash-zoom out
      { at: 'q+0.55', plate: 'B01', zoom: [1.75, 1.6], focus: [[.55, .44], [.55, .45]] },
      { at: 'smacked', plate: 'B01', zoom: [1.6, 1.85], focus: [[.55, .45], [.55, .44]] },
      { at: 'true', plate: 'B01', zoom: [2.2, 2.3], focus: [[.6, .42], [.6, .42]] },
      { at: 'couch', plate: 'B01', zoom: [1.45, 1.6], focus: [[.5, .47], [.55, .46]] },
      { at: 'cleo', plate: 'B02', zoom: [1.5, 1.7], focus: [[.33, .55], [.33, .55]] },
      { at: 'cleo+1.6', plate: 'B04', zoom: [1.0, 1.04], focus: [[.6, .5], [.6, .5]] },
      { at: 'noway', plate: 'B02', zoom: [1.7, 1.8], focus: [[.62, .55], [.62, .55]] },
      { at: 'crack1', plate: 'B01', zoom: [1.6, 1.7], focus: [[.55, .45], [.55, .45]] },
      { at: 'better1', plate: 'B02', zoom: [1.6, 1.75], focus: [[.6, .55], [.6, .54]] },
      { at: 'mam2', plate: 'B04', zoom: [1.3, 1.4], focus: [[.25, .55], [.3, .55]] },
      { at: 'better2', plate: 'B02', zoom: [1.6, 1.75], focus: [[.33, .55], [.33, .54]] },
      { at: 'trex2', plate: 'B04', zoom: [1.0, 1.04], focus: [[.6, .5], [.6, .5]] },
      { at: 'crack2', plate: 'B01', zoom: [1.5, 1.65], focus: [[.55, .45], [.55, .45]] },
      { at: 'stars', plate: 'B03', zoom: [1.0, 1.15], focus: [[.5, .45], [.5, .45]] },
      { at: 'true5', plate: 'B03', zoom: [1.15, 1.15], focus: [[.5, .45], [.5, .45]] },
      { at: 'cards', plate: 'B02', zoom: [1.5, 1.9], focus: [[.6, .56], [.62, .6]] },
      { at: 'true6', plate: 'B02', zoom: [1.9, 2.0], focus: [[.62, .6], [.62, .6]] },
      { at: 'quiet', plate: 'B02', zoom: [1.8, 2.3], focus: [[.62, .55], [.63, .52]] },
      { at: 'yours', plate: 'B01', zoom: [1.55, 1.6], focus: [[.55, .46], [.55, .46]] },
      { at: 'sorry', plate: 'B02', zoom: [2.1, 2.2], focus: [[.33, .52], [.33, .52]] },
      { at: 'crack3', plate: 'B01', zoom: [1.45, 1.55], focus: [[.55, .45], [.55, .45]] },
      { at: 'roof', plate: 'E', zoom: [1.0, 1.06], focus: [[.5, .5], [.5, .5]] },
      { at: 'mirror', plate: 'E', zoom: [1.06, 1.12], focus: [[.5, .5], [.5, .5]] },
      { at: 'question', plate: 'E', zoom: [1.12, 1.12], focus: [[.5, .5], [.5, .49]] },
    ],
    shakes: [['q+0.3', .45, .8], ['crack1', .5, .25], ['crack2', .5, .25], ['crack3', .7, .35], ['true6', .3, .2]],
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
      // a laugh: bent forward, shoulders bouncing, giggle face
      const laugh = (ch, ph = 0, k = 1) => { const b = Math.abs(Math.sin(t * 13 + ph)); ch.face('giggle');
        ch.pose({ t, lean: (ph ? -.16 : .2) * k + .05 * b, nod: -.18 - .06 * b, tilt: .12 * Math.sin(t * 3 + ph), armR: { raise: .15 }, armL: { raise: .1 }, gesture: ph ? 'facepalm' : undefined, gw: .6 });
        ch.root.position.y += .02 * b; };
      const stamp = (str, from, color = 'gold', y = 300) => txt(str, { y, size: 120, color, scale: 1.4 - .4 * popIn(K, t, from, .25), a: K.clamp01((t - from) / .12), rot: -.06 });
      const couch = (where = 'B01') => {   // both on the couch; Doug left, Gary right
        if (where === 'B01') { seat('doug', DSEAT, .25); seat('gary', GSEAT, -.25); }
        else { seat('doug', DSEAT2, .55); seat('gary', GSEAT2, .2); } };
      const chillPose = (ch, ph, k = 1, extra = {}) => { face(ch, extra.face || 'chill', t, ph); ch.pose(Object.assign({ t, lean: -.08 }, sway(k, ph), extra.p || {})); legs(ch); };

      const sid = K.shot.id === 'cleo+1.6' ? 'road' : id;
      switch (sid) {
        case 'q': case 'smacked': case 'true': case 'couch': {   // the hook + the setup on the couch
          couch();
          if (id === 'q' && Lc < 3.5) {
            D.face(t < .3 ? 'zoned' : 'surprised'); D.pose(Object.assign({ t, lean: -.05, armR: { raise: .55 } }, sway(.3))); legs(D);   // staring at his own hand
            K.hookReact(G, t, 'q'); legs(G); if (t > 1.1) { laugh(G, 1, .6); legs(G); }
            const a = K.clamp01((at('smacked') - .1 - t) / .3);
            txt('HIGH CONVERSATIONS', { y: 300, size: 86, color: 'gold', a, scale: popIn(K, t, .3) });
            txt('WITH YOUR BEST FRIEND', { y: 390, size: 56, a, scale: popIn(K, t, .7) });
          } else {
            chillPose(D, 0, 1, { face: id === 'true' ? 'smirk' : 'chill' }); chillPose(G, 2, 1, { face: id === 'true' ? 'smirk' : 'zoned' });
            if (id === 'smacked') txt('SMACKED', { y: 320, size: 110, color: 'red', scale: popIn(K, t, at('smacked') + .4), rot: -.05 });
            if (id === 'true') stamp('TRUE?', at('true') + .5);
            if (id === 'couch') txt('2:00 AM', { y: 300, size: 70, w: 340, color: '#fff', stroke: 0, shadow: false, bg: 'rgba(18,20,30,.85)', scale: popIn(K, t, at('couch')) });
          }
          break; }

        case 'cleo': case 'noway': case 'better1': case 'better2': case 'cards': case 'true6': case 'quiet': case 'sorry': {   // B02 close-ups on the couch
          couch('B02');
          if (id === 'cleo') { chillPose(D, 0, .6, { face: 'zoned', p: { gesture: 'think', gw: 1 } }); chillPose(G, 2, .6, { face: 'chill' });
            txt('"BRO…"', { y: 300, size: 80, color: '#fff', scale: popIn(K, t, at('cleo')) }); }
          if (id === 'noway') { if (t < at('way')) { face(G, 'surprised', t); G.pose({ t, lean: -.2, armR: { raise: .5 }, armL: { raise: .5 }, handR: 'open', handL: 'open' }); legs(G); chillPose(D, 0, .5, { face: 'smirk' });
              txt('NO WAY.', { y: 300, size: 110, color: '#fff', scale: popIn(K, t, at('noway')) }); }
            else { chillPose(D, 0, .5, { face: 'smirk', p: { gesture: 'point', gw: 1 } }); face(G, 'surprised', t); G.pose({ t, lean: -.2 }); legs(G); txt('WAY.', { y: 300, size: 120, color: 'gold', scale: popIn(K, t, at('way')) }); } }
          if (id === 'better1') { chillPose(G, 2, .4, { face: 'smirk', p: { lean: .15, gesture: 'point', gw: K.ease(Lc / .4) } }); chillPose(D, 0, .5, { face: 'zoned' });
            txt('"I GOT A BETTER ONE."', { y: 300, size: 70, color: 'gold', scale: popIn(K, t, at('better1') + .1) }); }
          if (id === 'better2') { chillPose(D, 0, .4, { face: 'smirk', p: { lean: .15, gesture: 'wave', gw: K.ease(Lc / .4) } }); chillPose(G, 2, .5, { face: 'chill' });
            txt('"NAH. I GOT A BETTER ONE."', { y: 300, size: 62, color: 'gold', scale: popIn(K, t, at('better2') + .1) }); }
          if (id === 'cards' || id === 'true6') {   // Gary shuffles: the deck arcs between his hands
            chillPose(D, 0, .5, { face: id === 'true6' ? 'surprised' : 'chill' });
            face(G, t > at('cards2') ? 'zoned' : 'chill', t, 2); G.pose({ t, lean: .12, armR: { raise: .38 }, armL: { raise: .38 }, handR: 'open', handL: 'open', nod: .2 }); legs(G);
            const hR = K.screenOf(G.arm[1].wr), hL = K.screenOf(G.arm[-1].wr), mx = (hR.x + hL.x) / 2, my = (hR.y + hL.y) / 2;
            K.prop('CARDS', { x: mx, y: my - 40 - 18 * Math.abs(Math.sin(t * 6)), w: Math.max(300, Math.abs(hR.x - hL.x) * 1.6), rot: .06 * Math.sin(t * 6) });
            if (id === 'cards' && t > at('cards2')) txt('NEVER EXISTED. EVER.', { y: 300, size: 76, color: '#fff', scale: popIn(K, t, at('cards2') + 1.2) });
            if (id === 'true6') { stamp('TRUE', at('true6'));
              const big = '80,658,175,170,943,878,571,660,636,856,403,766,975,289,505,440,883,277,824,000,000,000,000';
              txt(big, { x: 540 + 1400 - (t - at('true6')) * 620, y: 1150, size: 56, color: 'gold', w: 4200 });
              txt('WAYS TO MIX A DECK', { y: 1060, size: 50, scale: popIn(K, t, at('true6') + .6), a: K.clamp01((at('true6') + 1.4 - t) / .2) });
              txt('MORE THAN ATOMS ON EARTH', { y: 1060, size: 56, color: 'gold', scale: popIn(K, t, at('true6') + 1.4) }); } }
          if (id === 'quiet') { const down = K.ease((t - at('nose')) / .5);
            chillPose(D, 0, .4, { face: t > at('nose') + 1 ? 'surprised' : 'chill' });
            face(G, 'zoned', t); G.pose({ t, nod: .35 * down, look: 0, lean: .02 }); legs(G);
          }
          if (id === 'sorry') { chillPose(D, 0, .2, { face: 'flat' }); chillPose(G, 2, .3, { face: 'zoned' });
            txt('SORRY.', { y: 300, size: 110, color: '#fff', scale: popIn(K, t, at('sorry')) }); }
          break; }

        case 'crack1': case 'crack2': case 'crack3': {   // they crack up
          couch(); laugh(D, 0, id === 'crack3' ? 1.3 : 1); legs(D); laugh(G, 1.7, id === 'crack3' ? 1.4 : 1); legs(G);
          if (id === 'crack2') G.root.rotation.z = -.18 * K.ease(Lc / .6);
          if (id === 'crack3') { G.root.rotation.x = -.12; D.root.rotation.z = .1 * Math.sin(t * 9); }
          const h1 = K.screenOf(D.head), h2 = K.screenOf(G.head);
          for (const [h, k] of [[h1, 0], [h2, 1]]) for (let i = 0; i < 2; i++) { const ph = (t * 1.6 + i * .5 + k * .25) % 1;
            txt('HA', { x: h.x + (k ? 70 : -70) + (k ? 1 : -1) * ph * 80, y: h.y - 140 - ph * 120, size: 58 + 20 * ph, color: '#fff', a: Math.sin(ph * PI), rot: (k ? .2 : -.2) }); }
          break; }

        case 'yours': {   // POV: the viewer's own nose shows up at the bottom of the frame
          couch(); chillPose(D, 0, .3, { face: 'chill' }); chillPose(G, 2, .3, { face: 'zoned' });
          const u = K.ease((t - at('yours')) / .9);
          txt('●', { x: 540, y: 2100 - 640 * u, size: 1150, color: '#f09a80', stroke: 0, shadow: false, a: u, blur: 38 });
          txt('AND NOW… YOU CAN SEE YOURS', { y: 300, size: 54, color: '#fff', scale: popIn(K, t, at('yours') + .4) });
          break; }

        default: {
          if (sid === 'road' || id === 'mam2' || id === 'trex2') {   // THE FACT ROAD
            const p1 = K.img(...P1), p2 = K.img(...P2), p3 = K.img(...P3), sc = s();
            const arc = (a, b, label, color, from, lift = 120) => { const u = K.ease((t - from) / .7); if (u <= 0) return; const N = 30; let prev = null;
              for (let k = 0; k <= N * u; k++) { const v = k / N, q = { x: K.lerp(a.x, b.x, v), y: K.lerp(a.y, b.y, v) - Math.sin(v * PI) * lift * sc }; if (prev) K.line(prev.x, prev.y, q.x, q.y, { color, width: 9 }); prev = q; }
              if (u > .9) txt(label, { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 - lift * sc - 50, size: 48, color, scale: popIn(K, t, from + .6) }); };
            if (id !== 'mam2' && id !== 'trex2') {   // Cleopatra: pyramid (near) … crown (middle) … Moon (far)
              const c0 = at('cleo') + 1.6;
              K.prop('PYR', { x: p1.x + 70 * sc, y: p1.y - 140 * sc, w: 320 * sc, a: K.clamp01((t - c0) / .2) });
              if (t > c0 + .9) K.prop('CROWN', { x: p2.x, y: p2.y - 110 * sc - 6 * Math.sin(t * 2), w: 230 * sc * K.pop(K.clamp01((t - c0 - .9) / .3)) });
              if (t > c0 + 1.8) K.prop('MOON', { x: p3.x, y: p3.y - 80 * sc, w: 230 * sc * K.pop(K.clamp01((t - c0 - 1.8) / .3)) });
              arc(K.img(P1[0] + 60, P1[1] - 200), K.img(P2[0] - 20, P2[1] - 150), '2,500 YEARS', '#fff', c0 + 2.4, 140);
              arc(K.img(P2[0] + 40, P2[1] - 150), K.img(P3[0] - 10, P3[1] - 110), '2,000 YEARS', 'gold', c0 + 3.1, 90);
              txt('CLEOPATRA', { x: p2.x, y: p2.y + 40 * sc, size: 44, scale: popIn(K, t, c0 + 1) });
            } else if (id === 'mam2') {
              K.prop('PYR', { x: p1.x + 60 * sc, y: p1.y - 150 * sc, w: 360 * sc });
              const u = K.easeOut((t - at('mam2') - .6) / 1.4); if (u > 0) K.prop('MAM', { x: K.lerp(p1.x - 500 * sc, p1.x - 170 * sc, u), y: p1.y - 110 * sc - 10 * Math.abs(Math.sin(t * 6)) * (u < 1 ? 1 : 0), w: 330 * sc });
              txt('PYRAMIDS + MAMMOTHS', { y: 300, size: 70, color: '#fff', scale: popIn(K, t, at('mam2') + 1.6), a: K.clamp01((at('true2') - t) / .2) });
              if (t > at('true2')) { stamp('TRUE', at('true2')); txt('LAST ONES: A FROZEN ISLAND', { y: 420, size: 50, scale: popIn(K, t, at('true2') + 1) }); }
            } else {   // T. rex is closer to US than to Stegosaurus
              K.prop('STEG', { x: p1.x + 90 * sc, y: p1.y - 100 * sc, w: 340 * sc });
              if (t > at('trex2') + .6) K.prop('TREX', { x: p2.x, y: p2.y - 100 * sc, w: 300 * sc * K.pop(K.clamp01((t - at('trex2') - .6) / .3)) });
              if (t > at('trex2') + 1.4) txt('US', { x: p3.x, y: p3.y - 70 * sc, size: 70, color: 'gold', scale: popIn(K, t, at('trex2') + 1.4) });
              arc(K.img(P1[0] + 80, P1[1] - 200), K.img(P2[0] - 30, P2[1] - 170), '83 MILLION YEARS', '#fff', at('trex2') + 1.8, 140);
              arc(K.img(P2[0] + 50, P2[1] - 170), K.img(P3[0] - 10, P3[1] - 100), '66 MILLION', 'gold', at('trex2') + 2.4, 90);
              if (t > at('true3')) stamp('TRUE', at('true3'));
            }
            break;
          }
          if (id === 'stars' || id === 'true5') {   // looking up at the fan: the ceiling turns into a galaxy; trees vs stars
            if (id === 'stars') { txt('MORE TREES ON EARTH', { y: 300, size: 70, scale: popIn(K, t, at('stars') + .4) }); txt('THAN STARS IN OUR GALAXY', { y: 390, size: 60, color: 'gold', scale: popIn(K, t, at('stars') + 1.6) }); }
            else { stamp('TRUE', at('true5'), 'gold', 280);
              K.prop('TG', { x: 540, y: 900, w: 1000 * K.pop(K.clamp01((t - at('true5') - .3) / .4)) });
              txt('3,000,000,000,000', { x: 270, y: 1130, size: 40, color: 'gold', scale: popIn(K, t, at('true5') + 1) }); txt('TREES', { x: 270, y: 1180, size: 46, color: 'gold', scale: popIn(K, t, at('true5') + 1) });
              txt('400,000,000,000', { x: 810, y: 1130, size: 40, scale: popIn(K, t, at('true5') + 1.8) }); txt('STARS', { x: 810, y: 1180, size: 46, scale: popIn(K, t, at('true5') + 1.8) }); }
            break;
          }
          if (id === 'roof' || id === 'mirror' || id === 'question' || id === 'cta') {   // THE SIGNATURE GOODBYE
            K.placeAt('doug', 360, 1270, .3); K.placeAt('gary', 680, 1240, -.3);
            const hu = K.helicopter(t, 'heli', { y: 330, w: 520 }), up = hu < 0 ? 0 : Math.sin(PI * K.clamp01((hu - .05) / .85));
            face(D, up > .3 ? 'zoned' : id === 'question' ? 'smile' : 'chill', t); D.pose(Object.assign({ t, nod: -.38 * up, gesture: t > at('mirror') && t < at('noway2') ? 'point' : undefined, gw: 1 }, sway(1 - up)));
            const gf = t > at('way2') ? 'giggle' : t > at('noway2') ? 'surprised' : up > .3 ? 'zoned' : 'chill';
            face(G, gf, t, 1); G.pose(Object.assign({ t, nod: -.3 * up, gesture: id === 'question' ? 'point' : undefined, gw: id === 'question' ? K.ease((t - at('question')) / .4) : 0 }, sway(1 - up, 2)));
            if (t > at('mirror') + 1.6 && t < at('question')) { K.prop('DV', { x: 780, y: 520, w: 360 * K.pop(K.clamp01((t - at('mirror') - 1.6) / .35)), rot: .06 });
              txt('500 YEARS AGO', { x: 780, y: 760, size: 56, color: 'gold', scale: popIn(K, t, at('mirror') + 2.4) }); }
            if (t > at('noway2') && t < at('question')) txt(t < at('way2') ? 'NO WAY.' : 'WAY.', { y: 300, size: 110, color: t < at('way2') ? '#fff' : 'gold', scale: popIn(K, t, t < at('way2') ? at('noway2') : at('way2')) });
            if (id === 'roof' && t < at('heli')) txt('SUNRISE', { y: 300, size: 80, color: 'gold', scale: popIn(K, t, at('roof') + .2) });
            if (id === 'question') { txt('TAG YOUR GARY 👇', { y: 330, size: 76, color: 'gold', scale: popIn(K, t, at('question') + .1), a: K.clamp01((at('cta') - t) / .3) });
              txt('WHICH ONE BROKE YOUR BRAIN?', { y: 420, size: 52, scale: popIn(K, t, at('question') + 1), a: K.clamp01((at('cta') - t) / .3) }); }
            break;
          }
        }
      }
    },
  };
})();
