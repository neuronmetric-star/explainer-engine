// huss-neighbor: Brian's "huss huss huss" neighbor skit, told by Gary. Plates + Doug (phone) + Gary. Plan: shotlist.md.
// Doug grooves to his phone the whole time; Gary is annoyed until he catches it; at the end both huss together.
(function () {
  const PI = Math.PI;
  const face = (ch, name, t, off = 0) => ch.face(((t + off) % 4.1) < .12 && name !== 'happy' ? 'blink' : name);
  const popIn = (K, t, from, dur = .35) => K.pop(K.clamp01((t - from) / dur));
  const WORDS = window.VIDEO_DATA.words, norm = w => w.toLowerCase().replace(/[^a-z0-9]/g, '');
  const HUSS = WORDS.filter(o => norm(o.w) === 'huss').map(o => o.start);
  // 0..1 kick right after each spoken "huss" (wall thumps, phone waves, fist pumps)
  const huss = t => { let k = 0; for (const h of HUSS) if (t >= h && t < h + .45) k = Math.max(k, 1 - (t - h) / .45); return k; };

  const L = {
    morning: { key: [0xffcf8a, 2.3, [-10, 6, 3]], hemi: [0xfff0dc, 0xb08060, .85], front: [0xfff0e0, 1.0], shadow: [0x5a3a2a, .35] },
    night: { key: [0x8e9cff, 1.2, [-8, 7, 3]], hemi: [0x6a70d8, 0x40304a, .9], front: [0xc0a8ff, .95], shadow: [0x0e0a30, .45] },
    bath: { key: [0xfff2d8, 1.8, [0, 9, 3]], hemi: [0xd8fff8, 0x80a8a0, .95], front: [0xf0fffc, 1.0], shadow: [0x2a4a50, .3] },
    porch: { key: [0xffc070, 2.0, [3, 8, 4]], hemi: [0xb090ff, 0x806040, .85], front: [0xffe0c8, 1.0], shadow: [0x2a1a3a, .42] },
    dusk: { key: [0xffa868, 2.4, [-12, 5, 2]], hemi: [0xa8a0ff, 0xb07850, .8], front: [0xffe2d2, 1.05], shadow: [0x2a1a4a, .42] },
    night2: { key: [0x9aa8ff, 1.3, [-10, 8, 2]], hemi: [0x6a74d0, 0x3a3050, .85], front: [0xffd8b0, .9], shadow: [0x0a0a28, .5] },
  };
  const BEAT = 2.1;
  function dance(ch, t, ph = 0, amt = 1, hands = 'open') {
    const b = (t + ph) * BEAT * PI;
    ch.pose({ t, walk: (t + ph) * BEAT * .5, walkAmt: .45 * amt, armR: { raise: amt * (.55 + .35 * Math.sin(b)) }, armL: { raise: amt * (.55 + .35 * Math.sin(b + PI)) },
      lean: amt * .07 * Math.sin(b * .5), tilt: amt * .2 * Math.sin(b), nod: amt * .12 * Math.sin(2 * b), look: amt * .25 * Math.sin(b * .5), handR: hands, handL: 'open' });
    ch.root.position.y += amt * .05 * Math.abs(Math.sin(b)); ch.root.rotation.y += amt * .28 * Math.sin(b * .5);
  }
  // Doug grooving to his phone (phone in the right hand, little bounce)
  function groove(ch, t, amt = 1) { const b = t * BEAT * PI;
    ch.pose({ t, armR: { raise: .55, fwd: -.6 }, nod: .1 * Math.sin(2 * b) * amt - .12, tilt: .12 * Math.sin(b) * amt, look: .1 * Math.sin(b * .5), lean: .04 });
    ch.root.position.y += .03 * amt * Math.abs(Math.sin(b)); }
  // blasting phone: waves sprite pulsing at a screen point
  const waves = (K, x, y, w, t) => K.prop('P01', { x, y, w: w * (1 + .12 * Math.abs(Math.sin(t * BEAT * PI)) + .25 * huss(t)), rot: .05 * Math.sin(t * 3) });

  window.SCENE = {
    plates: {
      '01': { img: '01_gary_bedroom_morning.png', hz: .4, vx: .5, fov0: 55, camH: 1.5, light: L.morning },
      '02': { img: '02_gary_bedroom_night.png', hz: .4, vx: .5, fov0: 55, camH: 1.5, light: L.night },
      '03': { img: '03_bathroom_steam.png', hz: .44, vx: .5, fov0: 55, camH: 1.5, light: L.bath },
      '04': { img: '04_doug_front_door.png', hz: .42, vx: .55, fov0: 55, camH: 1.25, light: L.porch },
      '05': { img: '05_two_houses_dusk.png', hz: .53, vx: .55, fov0: 55, camH: 1.0, light: L.dusk },
      // same painting at night (Brian: Gary walks over at night): darkened + blue, moonlit cast light
      '06': { img: '05_two_houses_dusk.png', hz: .53, vx: .55, fov0: 55, camH: 1.0, light: L.night2, tint: 0x1e2a5c },
    },
    props: { P01: 'P01_phone_loud.png', H01: 'H01_helicopter.png' },
    cast: { doug: { outfit: 'hoodie', phone: true }, gary: 'oxford', garyP: { outfit: 'oxford', phone: true } },
    shots: [
      { at: 'q', plate: '02', zoom: [1.0, 1.08], focus: [[.6, .58], [.6, .58]] },
      { at: 'doug', plate: '05', zoom: [1.1, 1.16], focus: [[.6, .62], [.6, .62]] },
      { at: 'morning', plate: '01', zoom: [1.0, 1.06], focus: [[.62, .58], [.62, .58]] },
      { at: 'shower', plate: '03', zoom: [1.15, 1.2], focus: [[.5, .58], [.5, .58]] },
      { at: 'sleep', plate: '02', zoom: [1.12, 1.18], focus: [[.64, .57], [.64, .57]] },
      { at: 'enough', plate: '02', zoom: [1.25, 1.25], focus: [[.66, .55], [.66, .55]] },
      { at: 'march', plate: '06', zoom: [1.1, 1.15], focus: [[.45, .6], [.6, .6]] },
      { at: 'door', plate: '04', zoom: [1.0, 1.06], focus: [[.5, .58], [.5, .56]] },
      { at: 'hi', plate: '04', zoom: [1.35, 1.42], focus: [[.56, .52], [.56, .52]] },
      { at: 'stare', plate: '04', zoom: [1.05, 1.08], focus: [[.48, .6], [.48, .6]] },
      { at: 'heard', plate: '04', zoom: [1.1, 1.15], focus: [[.46, .6], [.46, .6]] },
      { at: 'course', plate: '04', zoom: [1.4, 1.45], focus: [[.56, .52], [.56, .52]] },
      { at: 'home', plate: '02', zoom: [1.0, 1.05], focus: [[.6, .58], [.6, .58]] },
      { at: 'popup', plate: '02', zoom: [1.2, 1.28], focus: [[.66, .55], [.66, .55]] },
      { at: 'repeat', plate: '02', zoom: [1.15, 1.2], focus: [[.65, .56], [.65, .56]] },
      { at: 'gary', plate: '02', zoom: [1.02, 1.08], focus: [[.62, .57], [.62, .57]] },
      { at: 'over', plate: '06', zoom: [1.1, 1.15], focus: [[.58, .6], [.56, .6]] },
      { at: 'both', plate: '06', zoom: [1.05, 1.1], focus: [[.52, .58], [.52, .57]] },
      { at: 'mirror', plate: '06', zoom: [1.0, 1.0], focus: [[.52, .55], [.52, .55]] },
      { at: 'ask', plate: '06', zoom: [1.0, 1.0], focus: [[.52, .55], [.52, .55]] },
      { at: 'cta', plate: '06', zoom: [1.0, 1.0], focus: [[.52, .55], [.52, .55]] },
    ],
    shakes: HUSS.filter(h => h < 20).map(h => [h, .16, .3]).concat([['enough', .25, .4]]),
    flashes: [],
    follow: { from: 'cta+0.3' },
    tail: 1.4,

    update(t, K) {
      const id = K.shot.id, Lc = K.shot.local, at = c => K.T(c);
      const D = K.cast.doug, G = K.cast.gary, GP = K.cast.garyP;
      switch (id) {
        case 'q': case 'sleep': case 'enough': {
          K.placeAt('gary', 700, 1010, -.25);
          if (id === 'enough') { face(G, 'flat', t, 1); G.pose({ t, gesture: 'hips', gw: K.ease(Lc / .3), lean: .05 }); }
          else { face(G, 'worried', t, 1); G.pose({ t, gesture: 'facepalm', gw: K.ease(Lc / .4), tilt: .1 * huss(t) }); }
          if (id === 'q') { const a = K.clamp01((at('doug') - t) / .2);
            K.text('HUSS HUSS HUSS', { y: 300, size: 110, color: 'gold', a, scale: (.8 + .2 * popIn(K, t, at('q'))) * (1 + .08 * huss(t)) }); }
          break; }
        case 'doug': { const d = K.placeAt('doug', 680, 1080, -.25); face(D, 'happy', t); groove(D, t);
          const h = K.screenOf(d.arm[1].wr); waves(K, h.x, h.y - 40, 170, t); break; }
        case 'morning': { K.placeAt('gary', 700, 1020, -.3); face(G, Lc < .5 ? 'blink' : 'flat', t, 1); G.pose({ t, nod: .15 * huss(t), lean: -.04 }); break; }
        case 'shower': { K.placeAt('gary', 560, 1200, 0); face(G, 'flat', t, 1); G.pose({ t, look: .25 });
          const v = K.img(205, 830); waves(K, v.x, v.y, 210, t); break; }
        case 'march': { const u = K.clamp01(Lc / 2.2), [x0, z0] = K.floorAt(260, 1150), [x1, z1] = K.floorAt(820, 1000);
          K.place('gary', K.lerp(x0, x1, u), 0, K.lerp(z0, z1, u), u < 1 ? PI / 2 - .2 : -.3); face(G, 'flat', t, 1);
          G.pose({ t, walk: Lc * 1.5, walkAmt: u < 1 ? 1 : 0, lean: .08 }); break; }
        case 'door': case 'hi': case 'stare': case 'heard': case 'course': {
          const d = K.placeAt('doug', 590, 900, 0), g = K.placeAt('gary', 330, 1160, PI - .7);
          const ud = id === 'door' ? K.ease((Lc - .3) / .5) : 1;
          face(D, id === 'course' ? 'smile' : 'happy', t);
          if (id === 'hi') D.pose({ t, gesture: 'wave', gw: K.ease(Lc / .3), armR: { raise: .5 } });
          else if (id === 'course') D.pose({ t, armL: { raise: .95 }, armR: { raise: .5 }, nod: .15 * Math.sin(K.clamp01(Lc / .5) * PI), handL: 'fist' });
          else groove(D, t, ud);
          if (id === 'stare') { face(G, 'flat', t, 1); G.pose({ t, lean: .03 }); }
          else if (id === 'heard') { face(G, 'worried', t, 1); G.pose({ t, gesture: t > at('down') - .3 ? 'point' : 'hips', gw: 1 }); }
          else { face(G, 'flat', t, 1); G.pose({ t }); }
          if (id !== 'course') { const h = K.screenOf(d.arm[1].wr); waves(K, h.x, h.y - 30, 120, t); }
          break; }
        case 'home': { const u = K.clamp01(Lc / 1.6), [x0, z0] = K.floorAt(980, 1250), [x1, z1] = K.floorAt(700, 1010);
          K.place('gary', K.lerp(x0, x1, u), 0, K.lerp(z0, z1, u), u < 1 ? -PI / 2 : -.25); face(G, 'flat', t, 1);
          G.pose({ t, walk: Lc * 1.4, walkAmt: u < 1 ? 1 : 0 }); break; }
        case 'popup': case 'repeat': case 'gary': {
          const g = K.placeAt('garyP', 700, 1010, -.25);
          if (id === 'popup') { const tw = K.T('another'); face(GP, t < K.T('one') ? 'flat' : t < tw ? 'smile' : 'smirk', t, 1);
            GP.pose({ t, armR: { raise: .6, fwd: -.7 }, nod: -.18, tilt: .08 * Math.sin(t * 2) }); }
          else if (id === 'repeat') { face(GP, 'smirk', t, 1); groove(GP, t, .5); }
          else { face(GP, 'happy', t); dance(GP, t, 0, 1, 'fist'); }
          break; }
        case 'over': { const u = K.clamp01(Lc / 1.8), [x0, z0] = K.floorAt(960, 950), [x1, z1] = K.floorAt(690, 1120);
          const d = K.place('doug', K.lerp(x0, x1, u), 0, K.lerp(z0, z1, u), u < 1 ? -PI / 2 + .3 : -.2);
          face(D, Lc < 1 ? 'surprised' : 'happy', t); D.pose({ t, walk: Lc * 1.5, walkAmt: u < 1 ? 1 : 0, armR: { raise: .4 } });
          K.placeAt('garyP', 360, 1120, .3); face(GP, 'happy', t); dance(GP, t, 0, .8, 'fist'); break; }
        case 'both': case 'mirror': case 'ask': case 'cta': {
          if (id === 'cta') { const u = K.ease(Lc / .5); K.placeAt('doug', K.lerp(690, 840, u), 1120, -.35); K.placeAt('garyP', K.lerp(360, 200, u), 1120, .35); }
          else { K.placeAt('doug', 690, 1120, -.25); K.placeAt('garyP', 360, 1120, .3); }
          // THE HELICOPTER ENDING (PLAYBOOK §1.12a): crosses the sky on the last story line; both look up mid-huss
          const hu = id === 'both' ? -1 : K.helicopter(t, 'mirror', { y: 260, w: 540 }), up = hu < 0 ? 0 : Math.sin(PI * K.clamp01((hu - .05) / .85));
          if (id === 'ask' || id === 'cta') {
            face(D, 'smirk', t); D.pose({ t, gesture: 'point', gw: K.ease(Lc / .35), look: id === 'ask' ? .4 : 0, nod: -.3 * up });
            face(GP, id === 'ask' ? 'flat' : 'smile', t, 1); GP.pose({ t, gesture: id === 'ask' ? 'shrug' : 'point', gw: K.ease((Lc - .2) / .35), nod: -.3 * up });
            if (id === 'ask') K.text("Who's the Doug\non your street?", { y: 230, size: 84, color: 'gold', scale: popIn(K, t, at('ask') + .1) });
          } else {
            face(D, up > .3 ? 'surprised' : 'happy', t); dance(D, t, .24, 1 - .6 * up); D.root.rotation.x = 0;
            face(GP, up > .3 ? 'surprised' : 'happy', t); dance(GP, t, 0, 1 - .6 * up, 'fist');
            if (up > 0) { D.neck.rotation.x -= .4 * up; GP.neck.rotation.x -= .4 * up; }
          }
          break; }
      }
    },
  };
})();
