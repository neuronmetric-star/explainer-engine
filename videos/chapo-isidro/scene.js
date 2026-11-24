// chapo-isidro: "Who the heck is El Chapo Isidro, the Sinaloa cartel leader they just caught?" (True story, short).
// Plates + props + Doug, Gary (fictional viewers) + Chapo Isidro (outfit 'isidro', real person: silent, never armed).
// Three OpenArt Wan inserts play as clip plates (V1 door spins, V2 Guasave fire, V3 plane takes off). Plan: shotlist.md.
// Every word and number on screen is K.text / K.line (the paintings carry none).
(function () {
  const PI = Math.PI;
  const face = (ch, name, t, off = 0) => ch.face(((t + off) % 4.1) < .12 && name !== 'happy' ? 'blink' : name);
  const popIn = (K, t, from, dur = .35) => K.pop(K.clamp01((t - from) / dur));
  const WORDS = window.VIDEO_DATA.words, norm = w => w.toLowerCase().replace(/[^a-z0-9]/g, '');
  const wordAt = (K, w, cue) => { const t0 = K.T(cue); const x = WORDS.find(o => o.start >= t0 - .01 && norm(o.w) === w); return x ? x.start : t0; };

  const L = {
    room: { key: [0x9fc4ff, 1.5, [2, 6, -10]], hemi: [0x7080d0, 0x5a3a2a, .85], front: [0xffcf9a, 1.0], shadow: [0x10142a, .45] },
    farm: { key: [0xffb870, 2.6, [-12, 4, -4]], hemi: [0xffc0d0, 0xc08060, .8], front: [0xffe0c8, 1.0], shadow: [0x5a2a6a, .42] },
    office: { key: [0xffc070, 2.0, [-8, 6, 4]], hemi: [0x6070b0, 0x403040, .85], front: [0xd8d8ff, .95], shadow: [0x101830, .45] },
    noon: { key: [0xfff2dc, 3.0, [-8, 12, 3]], hemi: [0xbfe0ff, 0xd8c8a8, .8], front: [0xfff4e8, 1.0], shadow: [0x3a4a7a, .40] },
    dawn: { key: [0xa8c0ff, 1.6, [-10, 6, 2]], hemi: [0x8090c8, 0x404858, .9], front: [0xc8d0ff, .95], shadow: [0x101830, .45] },
    morning: { key: [0xffcf96, 2.6, [-12, 5, 3]], hemi: [0xbcd4ff, 0xb09070, .75], front: [0xfff0e2, 1.05], shadow: [0x2a3a6a, .42] },
  };

  // ---- the corkboard (05): index cards with words, strings between them (painting px) ----
  const card = (K, t, ix, iy, txt, o = {}) => { const p = K.img(ix, iy), s = K.imgScale(), k = o.from === undefined ? 1 : popIn(K, t, o.from);
    if (k <= 0) return p; K.prop('P03', { x: p.x, y: p.y, w: (o.w || 200) * s * k, rot: o.rot || 0, layer: 'back' });
    if (k > .6) K.text(txt, { x: p.x, y: p.y + 10 * s, size: (o.size || 24) * s * 1.2, color: o.color || '#1c2a4a', stroke: 0, shadow: false, rot: o.rot || 0, w: 600 });
    return p; };
  const string = (K, a, b, color = '#c8202a', o = {}) => { const s = K.imgScale(), pa = K.img(a[0], a[1]), pb = K.img(b[0], b[1]);
    K.line(pa.x, pa.y, pb.x, pb.y, Object.assign({ color, width: 4 * s }, o)); };
  const stamp = (K, t, ix, iy, txt, from, o = {}) => { const p = K.img(ix, iy), s = K.imgScale(), k = popIn(K, t, from, .25); if (k <= 0) return;
    K.text(txt, { x: p.x, y: p.y, size: (o.size || 30) * s, color: '#d1121f', stroke: 0, shadow: false, rot: -.18, scale: 1.6 - .6 * k, a: Math.min(1, k * 1.5),
      border: `${Math.max(3, 3 * s)}px solid #d1121f`, w: o.w || 260 * s }); };
  const CH = [300, 450], BL = [680, 450], IS = [680, 640];          // card spots: El Chapo, the brothers, Isidro

  // ---- the map (06) ----
  const SIN = [262, 770];                                           // Sinaloa on the painted map
  const arrow = (K, a, b, u, color = '#d1121f') => { if (u <= 0) return; const s = K.imgScale(), pa = K.img(a[0], a[1]), pb0 = K.img(b[0], b[1]);
    const pb = { x: K.lerp(pa.x, pb0.x, u), y: K.lerp(pa.y, pb0.y, u) }; K.line(pa.x, pa.y, pb.x, pb.y, { color, width: 9 * s });
    const ang = Math.atan2(pb.y - pa.y, pb.x - pa.x); K.text('▲', { x: pb.x, y: pb.y, size: 40 * s, color, stroke: 0, shadow: false, rot: ang + PI / 2 }); };

  window.SCENE = {
    plates: {
      '01': { img: '01_living_room_night.png', hz: .4, vx: .5, fov0: 55, camH: 1.75, light: L.room },
      '04': { img: '04_farm_town_street.png', hz: .46, vx: .52, fov0: 55, camH: 1.6, light: L.farm },
      '05': { img: '05_war_room_board.png', hz: .48, vx: .58, fov0: 55, camH: 1.5, light: L.office },
      '06': { img: '06_map_table.png', light: 'interior' },
      '07': { img: '07_police_station_revolving_door.png', hz: .42, vx: .5, fov0: 55, camH: 1.45, light: L.noon },
      '09': { img: '09_guasave_night_street.png', light: 'night' },
      '10': { img: '10_airstrip_dawn.png', hz: .42, vx: .5, fov0: 55, camH: 1.7, light: L.dawn },
      '11': { img: '11_street_morning_sky.png', hz: .56, vx: .45, fov0: 55, camH: 1.45, light: L.morning },
      V1: { clip: '../clips/V1_door/', n: 75, fps: 15, light: L.noon },
      V2: { clip: '../clips/V2_fire/', n: 75, fps: 15, light: 'night' },
      V3: { clip: '../clips/V3_plane/', n: 75, fps: 15, light: L.dawn },
    },
    props: { P01: 'P01_wanted_poster.png', P02: 'P02_magnifying_glass.png', P03: 'P03_index_card.png', P04: 'P04_isidro_photo.png', H01: 'H01_helicopter.png' },
    cast: { doug: 'hoodie', gary: 'oxford', isidro: 'isidro' },
    shots: [
      { at: 'q', plate: '01', zoom: [1.0, 1.12], focus: [[.5, .5], [.5, .45]] },
      { at: 'doug', plate: '01', zoom: [1.3, 1.36], focus: [[.6, .55], [.6, .55]] },
      { at: 'gary', plate: '01', zoom: [1.35, 1.42], focus: [[.36, .54], [.36, .54]] },
      { at: 'real', plate: '05', zoom: [1.55, 1.7], focus: [[.33, .29], [.33, .29]] },
      { at: 'life', plate: '05', zoom: [1.85, 1.9], focus: [[.33, .29], [.33, .29]] },
      { at: 'card', plate: '04', zoom: [1.0, 1.08], focus: [[.5, .55], [.5, .58]] },
      { at: 'town', plate: '04', zoom: [1.1, 1.1], focus: [[.42, .5], [.6, .5]] },
      { at: 'teen', plate: '04', zoom: [1.2, 1.3], focus: [[.5, .62], [.5, .64]] },
      { at: 'define', plate: '05', zoom: [1.3, 1.36], focus: [[.52, .33], [.52, .33]] },
      { at: 'brothers', plate: '05', zoom: [1.45, 1.45], focus: [[.45, .31], [.6, .32]] },
      { at: 'split', plate: '05', zoom: [1.6, 1.68], focus: [[.72, .27], [.72, .27]] },
      { at: 'war', plate: '05', zoom: [1.4, 1.4], focus: [[.52, .3], [.52, .3]] },
      { at: 'side', plate: '05', zoom: [1.05, 1.1], focus: [[.6, .5], [.62, .5]] },
      { at: 'own', plate: '06', zoom: [1.3, 1.45], focus: [[.3, .46], [.28, .46]] },
      { at: 'usa', plate: '06', zoom: [1.3, 1.3], focus: [[.3, .44], [.38, .34]] },
      { at: 'bet', plate: '06', zoom: [1.05, 1.08], focus: [[.5, .45], [.5, .45]] },
      { at: 'caught', plate: '07', zoom: [1.25, 1.25], focus: [[.5, .5], [.5, .5]] },
      { at: 'free', plate: '07', zoom: [1.05, 1.1], focus: [[.5, .58], [.5, .6]] },
      { at: '2014', plate: '07', zoom: [1.3, 1.3], focus: [[.5, .5], [.5, .5]] },
      { at: 'free2', plate: '07', zoom: [1.05, 1.1], focus: [[.5, .58], [.5, .6]] },
      { at: '2015', plate: '07', zoom: [1.35, 1.35], focus: [[.5, .5], [.5, .5]] },
      { at: 'free3', plate: '07', zoom: [1.05, 1.12], focus: [[.5, .58], [.5, .6]] },
      { at: 'door', plate: '01', zoom: [1.35, 1.42], focus: [[.36, .54], [.36, .54]] },
      { at: 'spin', plate: 'V1', zoom: [1.7, 1.8], focus: [[.5, .43], [.5, .43]], clipFrom: 1 },
      { at: 'reward', plate: '05', zoom: [1.45, 1.6], focus: [[.52, .32], [.52, .31]] },
      { at: 'friday', plate: '09', zoom: [1.0, 1.1], focus: [[.5, .45], [.55, .45]] },
      { at: 'fight', plate: 'V2', zoom: [1.0, 1.06], focus: [[.5, .45], [.5, .45]], clipFrom: .3 },
      { at: 'dead', plate: 'V2', zoom: [1.06, 1.12], focus: [[.5, .45], [.5, .45]], clipFrom: 2.2 },
      { at: 'plane', plate: '10', zoom: [1.05, 1.12], focus: [[.45, .55], [.42, .55]] },
      { at: 'takeoff', plate: 'V3', zoom: [1.0, 1.0], focus: [[.5, .5], [.5, .5]], clipFrom: 3.0 },
      { at: 'mirror', plate: 'V1', zoom: [1.5, 1.6], focus: [[.5, .45], [.5, .45]], clipFrom: 2.4 },
      { at: 'air', plate: '11', zoom: [1.05, 1.05], focus: [[.48, .5], [.48, .5]] },
      { at: 'ask', plate: '11', zoom: [1.05, 1.1], focus: [[.48, .5], [.48, .52]] },
      { at: 'cta', plate: '11', zoom: [1.1, 1.1], focus: [[.48, .52], [.48, .52]] },
    ],
    shakes: [['life', .25, .4], ['war', .25, .45], ['caught', .15, .25], ['2014', .15, .25], ['2015', .15, .25]],
    flashes: [],
    follow: { from: 'cta+0.3' },
    tail: 1.4,

    update(t, K) {
      const id = K.shot.id, Lc = K.shot.local, at = c => K.T(c), s = K.imgScale();
      const D = K.cast.doug, G = K.cast.gary, I = K.cast.isidro;
      const room = () => { K.placeAt('gary', 330, 1000, .35); K.placeAt('doug', 590, 1040, -.35); };
      const wordPop = (str, y, from, o = {}) => K.text(str, Object.assign({ y, size: 84, scale: popIn(K, t, from) }, o));
      switch (id) {
        // ---------------- Doug's living room: the news ----------------
        case 'q': { K.placeAt('gary', 330, 1000, PI - .35); K.placeAt('doug', 590, 1040, PI + .35);
          face(G, 'flat', t, 1); G.pose({ t }); face(D, 'smile', t); D.pose({ t, nod: -.05 });
          const tv = K.img(462, 488); K.text('BREAKING', { x: tv.x, y: tv.y - 70 * s, size: 44 * s, color: '#fff', stroke: 0, shadow: false, border: 'none', w: 700 });
          K.line(tv.x - 190 * s, tv.y - 10 * s, tv.x + 190 * s, tv.y - 10 * s, { color: '#d1121f', width: 64 * s });
          K.text('SINALOA CARTEL LEADER CAUGHT', { x: tv.x, y: tv.y - 10 * s, size: 21 * s, color: '#fff', stroke: 0, shadow: false, w: 800 });
          const a = K.clamp01((at('doug') - t) / .2);
          K.text('EL CHAPO ISIDRO', { y: 290, size: 100, a, scale: .8 + .2 * popIn(K, t, at('q')) });
          K.text('SINALOA CARTEL LEADER CAUGHT', { y: 400, size: 62, color: 'gold', a, scale: .8 + .2 * popIn(K, t, at('q') + .5) }); break; }
        case 'doug': { room(); face(D, Lc < .4 ? 'smile' : 'surprised', t); D.pose({ t, gesture: 'point', gw: K.ease((Lc - .3) / .35), lean: .05, look: .15 });
          face(G, 'flat', t, 1); G.pose({ t, look: .3 }); wordPop('EL CHAPO?!', 300, at('doug') + .4, { color: 'gold' }); break; }
        case 'gary': case 'door': { room(); face(G, id === 'door' ? 'smirk' : 'flat', t, 1);
          if (id === 'gary') G.pose({ t, look: .25 + .15 * Math.sin(Lc * 9) * (1 - K.clamp01((Lc - .6) / .3)), gesture: 'cross', gw: K.ease((Lc - .7) / .35) });
          else G.pose({ t, gesture: 'point', gw: K.ease(Lc / .35), look: .2 });
          face(D, id === 'door' ? 'surprised' : 'blink', t); D.pose({ t, look: -.3 });
          if (id === 'gary') wordPop('DIFFERENT CHAPO', 300, wordAt(K, 'different', 'gary'));
          else wordPop('REVOLVING DOOR', 300, at('door') + 1.2, { color: 'red' }); break; }
        // ---------------- the corkboard ----------------
        case 'real': case 'life': { card(K, t, CH[0], CH[1], 'EL CHAPO', { from: id === 'real' ? at('real') : undefined, size: 28 });
          if (id === 'life') stamp(K, t, CH[0], CH[1] + 62, 'LIFE IN PRISON', at('life') + .1, { size: 24, w: 230 * s });
          if (id === 'real') K.text('THE REAL ONE', { y: 300, size: 80, scale: popIn(K, t, at('real') + .5) }); break; }
        case 'define': { const T0 = at('define');
          const B = [490, 420], M1 = [370, 545], M2 = [610, 545], W1 = [300, 670], W2 = [490, 670], W3 = [680, 670];
          [[B, M1, .3], [B, M2, .3], [M1, W1, .6], [M2, W2, .6], [M2, W3, .6]].forEach(([a, b, d]) => { if (t > T0 + d) string(K, a, b, '#2a2a2a', { width: 3 * s }); });
          card(K, t, B[0], B[1], 'BOSS', { from: T0, size: 30 }); card(K, t, M1[0], M1[1], 'MANAGERS', { from: T0 + .3, size: 20 }); card(K, t, M2[0], M2[1], 'MANAGERS', { from: T0 + .35, size: 20 });
          card(K, t, W1[0], W1[1], 'WORKERS', { from: T0 + .6, size: 20 }); card(K, t, W2[0], W2[1], 'WORKERS', { from: T0 + .65, size: 20 }); card(K, t, W3[0], W3[1], 'WORKERS', { from: T0 + .7, size: 20 });
          K.text('CARTEL', { y: 280, size: 100, scale: popIn(K, t, T0) }); K.text('= DRUG GANG, RUN LIKE A COMPANY', { y: 380, size: 50, color: 'gold', scale: popIn(K, t, wordAt(K, 'company', 'define') - .4) }); break; }
        case 'brothers': case 'split': case 'war': case 'side': case 'reward': {
          const T0 = at('brothers'), broken = id !== 'brothers' && id !== 'split' && (id !== 'war' || t > wordAt(K, 'enemies', 'war'));
          if (id !== 'reward') {
            if (!broken) { string(K, CH, BL, '#1f9a3a'); const m = K.img((CH[0] + BL[0]) / 2, CH[1] - 26);
              K.text('PARTNERS', { x: m.x, y: m.y, size: 20 * s, color: '#1f9a3a', stroke: 0, shadow: false, scale: id === 'brothers' ? popIn(K, t, wordAt(K, 'partners', 'brothers')) : 1 }); }
            else { const u = id === 'war' ? K.easeOut((t - wordAt(K, 'enemies', 'war')) / .5) : 1, mid = [(CH[0] + BL[0]) / 2, CH[1]];
              string(K, CH, [mid[0] - 20, mid[1] + 60 * u], '#d1121f'); string(K, BL, [mid[0] + 20, mid[1] + 60 * u], '#d1121f');
              const m = K.img(mid[0], CH[1] - 30); K.text('ENEMIES', { x: m.x, y: m.y, size: 24 * s, color: '#d1121f', stroke: 0, shadow: false, scale: id === 'war' ? popIn(K, t, wordAt(K, 'enemies', 'war')) : 1 }); }
            card(K, t, CH[0], CH[1], 'EL CHAPO', { size: 28 }); stamp(K, t, CH[0], CH[1] + 58, 'LIFE IN PRISON', -99, { size: 20, w: 200 * s });
            card(K, t, BL[0], BL[1], 'BELTRÁN LEYVA\nBROTHERS', { from: id === 'brothers' ? T0 : undefined, size: 18 });
            const side = id === 'side' ? K.easeOut((Lc - .3) / .6) : 0;                     // Isidro's card slides under the brothers
            string(K, BL, [IS[0], IS[1]], '#c8202a', { a: id === 'brothers' ? K.clamp01((t - T0 - .9) / .3) : 1 });
            card(K, t, IS[0], IS[1], 'ISIDRO', { from: id === 'brothers' ? T0 + .9 : undefined, size: 28, rot: -.04 + .04 * side });
            if (id === 'split' || id === 'war') stamp(K, t, BL[0], BL[1] + 6, 'ARRESTED', id === 'split' ? wordAt(K, 'arrested', 'split') : -99, { size: 22 });
            if (id === 'split') K.text('2008', { y: 290, size: 110, color: 'gold', scale: popIn(K, t, at('split')) });
            if (id === 'split') { const b = wordAt(K, 'blamed', 'split'); if (t > b) K.text('"EL CHAPO TIPPED THEM OFF"', { y: 400, size: 48, scale: popIn(K, t, b) }); }
          }
          if (id === 'side') { K.placeAt('isidro', 740, 1200, -.3); face(I, 'smirk', t, 2); I.pose({ t, look: .45 - .3 * K.ease((Lc - 1) / .4), gesture: 'cross', gw: K.ease((Lc - .2) / .4) });
            K.text('HE PICKED THE BROTHERS', { y: 290, size: 70, scale: popIn(K, t, wordAt(K, 'picked', 'side')) }); }
          if (id === 'reward') { const T1 = at('reward'), k = popIn(K, t, T1 + .1, .4), pc = K.img(490, 545), pw = 330 * s * k, ph = pw * 1409 / 1116;
            K.prop('P01', { x: pc.x, y: pc.y, w: pw, layer: 'back', rot: .02 });
            if (k > .9) { const ph0 = K.img(490, 506); K.prop('P04', { x: ph0.x, y: ph0.y, w: 217 * s, rot: .02 });
              K.text('WANTED', { x: pc.x, y: pc.y - ph * .37, size: 54 * s, color: '#b3121f', stroke: 0, shadow: false, rot: .02 });
              K.text('BY THE FBI', { x: pc.x, y: pc.y + ph * .2, size: 30 * s, color: '#1c1c1c', stroke: 0, shadow: false, rot: .02 });
              K.text('CHAPO ISIDRO', { x: pc.x, y: pc.y + ph * .32, size: 26 * s, color: '#1c1c1c', stroke: 0, shadow: false, rot: .02 }); }
            K.text('FBI TEN MOST WANTED', { y: 290, size: 76, color: 'gold', scale: popIn(K, t, wordAt(K, 'ten', 'reward')) });
            K.text('2025 · $5,000,000 REWARD', { y: 390, size: 48, scale: popIn(K, t, wordAt(K, 'list', 'reward') + .2) }); }
          break; }
        // ---------------- his hometown ----------------
        case 'card': { const u = K.clamp01(Lc / 2.2), [x0, z0] = K.floorAt(480, 1020), [x1, z1] = K.floorAt(470, 1180);
          K.place('isidro', K.lerp(x0, x1, u), 0, K.lerp(z0, z1, u), 0); face(I, 'flat', t, 2); I.pose({ t, walk: Lc * 1.25, walkAmt: 1 - K.ease((Lc - 2) / .3), look: Lc > 2.3 ? .1 : 0 });
          K.text('FAUSTO ISIDRO', { y: 280, size: 86, scale: popIn(K, t, at('card') + .5) }); K.text('MEZA FLORES', { y: 380, size: 86, color: 'gold', scale: popIn(K, t, at('card') + .8) }); break; }
        case 'town': { K.placeAt('isidro', 470, 1180, 0); face(I, 'smile', t, 2); I.pose({ t, look: .5 * Math.sin(Lc * 1.2) });
          K.text('BAMOA, SINALOA', { y: 280, size: 80, scale: popIn(K, t, wordAt(K, 'farm', 'town')) }); K.text('MEXICO', { y: 380, size: 70, color: 'gold', scale: popIn(K, t, wordAt(K, 'mexico', 'town')) }); break; }
        case 'teen': { const u = K.clamp01(Lc / 1.8), [x0, z0] = K.floorAt(470, 1180), [x1, z1] = K.floorAt(520, 1040);
          K.place('isidro', K.lerp(x0, x1, u), 0, K.lerp(z0, z1, u), PI - .1, .85); face(I, 'smile', t, 2); I.pose({ t, walk: Lc * 1.3, walkAmt: 1 });
          K.text('1990s · A TEENAGER', { y: 290, size: 72, scale: popIn(K, t, at('teen') + .2) }); break; }
        // ---------------- the map ----------------
        case 'own': case 'usa': case 'bet': { const p = K.img(SIN[0], SIN[1]), k = id === 'own' ? popIn(K, t, at('own') + .3) : 1;
          K.text('●', { x: p.x, y: p.y, size: 54 * s * k, color: '#d1121f', stroke: Math.round(6 * s), shadow: false });
          if (id === 'own') K.text('HIS OWN CARTEL', { y: 290, size: 84, color: 'gold', scale: popIn(K, t, wordAt(K, 'own', 'own')) });
          if (id !== 'own') { const u = id === 'usa' ? K.ease((Lc - .2) / 1.2) : 1;
            arrow(K, SIN, [250, 430], u); arrow(K, SIN, [420, 440], K.ease(u * 1.3 - .15)); arrow(K, SIN, [580, 520], K.ease(u * 1.3 - .3)); }
          if (id === 'usa') K.text('→ AMERICA', { y: 290, size: 84, scale: popIn(K, t, wordAt(K, 'america', 'usa')) });
          if (id === 'bet') { const u = Lc / Math.max(.5, K.shot.t1 - K.shot.t0), mx = K.lerp(160, 820, u), my = 700 + 160 * Math.sin(u * PI * 2), mp = K.img(mx, my);
            K.prop('P02', { x: mp.x, y: mp.y, w: 420, rot: -.2 + .25 * Math.sin(u * PI * 3) });
            K.text('WHERE IS HE?', { y: 290, size: 84, scale: popIn(K, t, at('bet') + .5) }); }
          break; }
        // ---------------- the revolving door ----------------
        case 'caught': case '2014': case '2015': { K.placeAt('isidro', 470, 965, 0, 1.15); face(I, 'flat', t, 2); I.pose({ t, gesture: 'cuffed', gw: 1, cuffs: true });
          const yr = id === 'caught' ? '2011' : id === '2014' ? '2014 ×2' : '2015'; K.text('CAUGHT · ' + yr, { y: 290, size: 92, color: 'red', scale: popIn(K, t, at(id)) }); break; }
        case 'free': case 'free2': case 'free3': { const n = id === 'free' ? 1 : id === 'free2' ? 2 : 3, sp = 1 + .25 * n;
          const u = K.clamp01(Lc * sp / 1.6), [x0, z0] = K.floorAt(470, 1160), [x1, z1] = K.floorAt(470, 1330);
          K.place('isidro', K.lerp(x0, x1, u), 0, K.lerp(z0, z1, u), 0); face(I, n === 1 ? 'smile' : 'smirk', t, 2);
          I.pose({ t, walk: Lc * 1.3 * sp, walkAmt: 1 - K.ease((u - .9) / .1), gesture: n === 3 && u > .95 ? 'hips' : undefined, gw: K.ease((Lc * sp - 1.6) / .3) });
          K.text('FREE', { y: 290, size: 120, color: 'gold', scale: popIn(K, t, at(id) + .1) });
          for (let i = 0; i < n; i++) K.text('I', { x: 80 + i * 40, y: 180, size: 70, color: 'gold' }); break; }
        case 'spin': { K.text('REVOLVING DOOR', { y: 290, size: 84, color: 'red', scale: popIn(K, t, at('spin')) }); break; }
        // ---------------- Friday in Guasave ----------------
        case 'friday': { K.text('FRIDAY · GUASAVE', { y: 290, size: 80, scale: popIn(K, t, at('friday') + .1) });
          K.text('ARREST #5', { y: 400, size: 96, color: 'gold', scale: popIn(K, t, wordAt(K, 'five', 'friday')) }); break; }
        case 'fight': { K.text('ALL NIGHT', { y: 290, size: 84, scale: popIn(K, t, wordAt(K, 'night', 'fight')) }); break; }
        case 'dead': { K.text('11 DEAD', { y: 300, size: 120, color: 'red', a: K.clamp01((t - at('dead') - .15) / .25) }); break; }
        case 'plane': { const u = K.clamp01(Lc / 1.1), [x0, z0] = K.floorAt(560, 1180), [x1, z1] = K.floorAt(480, 1030);
          K.place('isidro', K.lerp(x0, x1, u), 0, K.lerp(z0, z1, u), PI + .35); face(I, 'flat', t, 2);
          I.pose({ t, walk: Lc * 1.1, walkAmt: .7, gesture: 'cuffed', gw: 1, cuffs: true, nod: .25 });
          K.text('NO WALKING OUT', { y: 290, size: 80, color: 'red', scale: popIn(K, t, at('plane') + .2) }); break; }
        case 'takeoff': { K.text('→ MEXICO CITY', { y: 300, size: 84, color: 'gold', scale: popIn(K, t, at('takeoff')) }); break; }
        case 'mirror': { K.text('IIII', { y: 290, size: 110, color: 'gold', scale: popIn(K, t, at('mirror') + .2) }); break; }
        // ---------------- next morning: the helicopter ending ----------------
        case 'air': case 'ask': case 'cta': {
          K.placeAt('doug', 380, 1300, .3); K.placeAt('gary', 610, 1280, -.3);
          // THE HELICOPTER ENDING (PLAYBOOK §1.12a): crosses on the mirror line's payoff ("he flew"); Doug looks up
          const hu = K.helicopter(t, 'air', { y: 260, w: 540 }), up = hu < 0 ? 0 : Math.sin(PI * K.clamp01((hu - .05) / .85));
          face(D, up > .3 ? 'flat' : id === 'ask' ? 'worried' : 'smile', t); face(G, up > .5 ? 'surprised' : id === 'cta' ? 'smirk' : 'flat', t, 1);
          D.pose({ t, nod: -.4 * up, look: .1 * up, gesture: id === 'ask' ? 'shrug' : undefined, gw: id === 'ask' ? K.ease(Lc / .4) : 0 });
          G.pose({ t, nod: -.3 * up, gesture: id === 'ask' ? 'think' : id === 'cta' ? 'point' : undefined, gw: id === 'ask' || id === 'cta' ? K.ease((Lc - .2) / .35) : 0 });
          if (id === 'ask') { K.text('MEXICO', { y: 280, size: 100, color: 'gold', scale: popIn(K, t, wordAt(K, 'mexico', 'ask')) });
            K.text('or', { y: 370, size: 60, scale: popIn(K, t, wordAt(K, 'mexico', 'ask') + .3) });
            K.text('AMERICA?', { y: 450, size: 100, color: 'gold', scale: popIn(K, t, wordAt(K, 'america', 'ask')) }); }
          break; }
      }
    },
  };
})();
