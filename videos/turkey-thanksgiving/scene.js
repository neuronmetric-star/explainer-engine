// turkey-thanksgiving: why we eat turkey on Thanksgiving. Plates + props + Doug, Gary (cast look v2). Plan: shotlist.md.
// World units: feet at y=0. Props + text in screen px (y down). Every word/number on screen is K.text (paintings carry none).
(function () {
  const PI = Math.PI;
  const face = (ch, name, t, off = 0) => ch.face(((t + off) % 4.1) < .12 && name !== 'happy' ? 'blink' : name);
  const popIn = (K, t, from, dur = .35) => K.pop(K.clamp01((t - from) / dur));
  const WORDS = window.VIDEO_DATA.words, norm = w => w.toLowerCase().replace(/[^a-z0-9]/g, '');
  const wordAt = (K, w, cue) => { const t0 = K.T(cue); const x = WORDS.find(o => o.start >= t0 - .01 && norm(o.w) === w); return x ? x.start : t0; };
  const INK = '#4a2a12';

  const L = {
    dining: { key: [0xffc07a, 2.3, [-12, 6, 3]], hemi: [0xd8c0ff, 0xc08050, .85], front: [0xffe2cc, 1.0], shadow: [0x4a2a2a, .38] },
    dusk: { key: [0xffa860, 2.4, [-14, 4, -4]], hemi: [0xc8a0ff, 0x8a6a30, .85], front: [0xffd8c8, 1.05], shadow: [0x4a2a5a, .42] },
  };

  // painted spots (painting px)
  const DTABLE = { ix: 470, iy: 760 };          // 01: middle of the table runner
  const BTABLE = [{ ix: 462, iy: 878 }, { ix: 612, iy: 878 }];   // 05: the two empty platter spots (venison, turkey)

  window.SCENE = {
    plates: {
      '01': { img: '01_dining_room_day.png', hz: .28, vx: .5, fov0: 55, camH: 3.4, light: L.dining },
      '02': { img: '02_plymouth_harvest_1621.png', hz: .38, vx: .5, fov0: 55, camH: 1.6, light: 'day' },
      '03': { img: '03_editor_office_1800s.png', hz: .55, vx: .5, fov0: 55, camH: 1.6, light: 'interior' },
      '04': { img: '04_lincoln_desk_1863.png', hz: .5, vx: .5, fov0: 55, camH: 1.6, light: 'interior' },
      '05': { img: '05_backyard_feast_dusk.png', hz: .53, vx: .5, fov0: 55, camH: 1.3, light: L.dusk },
    },
    props: { P01: 'P01_roast_turkey.png', P02: 'P02_winslow_letter.png', P03: 'P03_duck.png', P04: 'P04_goose.png', P05: 'P05_wild_turkey.png',
      P06: 'P06_deer.png', P07: 'P07_novel_open.png', P08: 'P08_envelope.png', P09: 'P09_proclamation.png', P10: 'P10_roast_venison.png', H01: 'H01_helicopter.png' },
    cast: { doug: 'hoodie', gary: 'oxford', garyp: { outfit: 'oxford', phone: true } },
    shots: [
      { at: 'q', plate: '01', zoom: [1.55, 1.7], focus: [[.5, .43], [.5, .43]] },
      { at: 'card', plate: '01', zoom: [1.0, 1.08], focus: [[.5, .55], [.5, .57]] },
      { at: 'ground', plate: '02', zoom: [1.0, 1.1], focus: [[.5, .4], [.5, .38]] },
      { at: 'feast', plate: '02', zoom: [1.45, 1.5], focus: [[.18, .3], [.24, .3]] },
      { at: 'feast+1.8', plate: '02', zoom: [1.45, 1.5], focus: [[.8, .3], [.76, .31]] },
      { at: 'feast+3.8', plate: '02', zoom: [1.15, 1.22], focus: [[.5, .42], [.5, .43]] },
      { at: 'bet', plate: '01', zoom: [1.3, 1.3], focus: [[.32, .58], [.32, .58]] },
      { at: 'bet+1.57', plate: '01', zoom: [1.45, 1.58], focus: [[.3, .6], [.3, .6]] },
      { at: 'letter', plate: '01', zoom: [1.05, 1.05], focus: [[.5, .57], [.5, .57]] },
      { at: 'winslow', plate: '01', zoom: [1.7, 1.75], focus: [[.5, .35], [.5, .35]] },
      { at: 'fowling', plate: '01', zoom: [1.75, 1.8], focus: [[.5, .35], [.5, .35]] },
      { at: 'birds', plate: '02', zoom: [1.3, 1.36], focus: [[.55, .5], [.6, .5]] },
      { at: 'deer', plate: '02', zoom: [1.12, 1.18], focus: [[.5, .52], [.5, .52]] },
      { at: 'notice', plate: '01', zoom: [1.8, 1.8], focus: [[.5, .35], [.5, .35]] },
      { at: 'doubt', plate: '01', zoom: [1.15, 1.2], focus: [[.5, .58], [.5, .58]] },
      { at: 'hale', plate: '01', zoom: [1.3, 1.6], focus: [[.5, .5], [.5, .46]] },
      { at: 'editor', plate: '03', zoom: [1.0, 1.12], focus: [[.5, .3], [.5, .26]] },
      { at: 'novel', plate: '03', zoom: [1.15, 1.2], focus: [[.5, .6], [.5, .6]] },
      { at: 'letters', plate: '03', zoom: [1.1, 1.14], focus: [[.5, .55], [.5, .55]] },
      { at: 'lincoln', plate: '04', zoom: [1.0, 1.1], focus: [[.5, .5], [.5, .52]] },
      { at: 'big', plate: '01', zoom: [1.12, 1.0], focus: [[.5, .56], [.5, .56]] },
      { at: 'eggs', plate: '01', zoom: [1.3, 1.36], focus: [[.5, .5], [.5, .5]] },
      { at: 'today', plate: '01', zoom: [1.05, 1.08], focus: [[.5, .6], [.5, .6]] },
      { at: 'end', plate: '05', zoom: [1.0, 1.06], focus: [[.5, .55], [.5, .56]] },
      { at: 'deerplate', plate: '05', zoom: [1.22, 1.28], focus: [[.42, .6], [.42, .6]] },
      { at: 'heli', plate: '05', zoom: [1.0, 1.0], focus: [[.5, .55], [.5, .55]] },
      { at: 'cta', plate: '05', zoom: [1.0, 1.0], focus: [[.5, .55], [.5, .55]] },
    ],
    shakes: [['lincoln+2.4', .25, .5], ['bet+0.92', .2, .35]],
    flashes: [],
    follow: { from: 'cta+0.3' },
    tail: 1.6,

    update(t, K) {
      const id = K.shot.id, Lc = K.shot.local, at = c => K.T(c), S = K.imgScale();
      const D = K.cast.doug, G = K.cast.gary, GP = K.cast.garyp;
      const turkey01 = (s = 1, a = 1) => { const p = K.img(DTABLE.ix, DTABLE.iy); K.prop('P01', { x: p.x, y: p.y, w: 300 * S * s, anchor: [.5, .85], a, layer: 'back' }); };
      // the letter insert, centered in the safe area (P02 is 1086x1448; its blank band is at ~49% height)
      const letter = (o = {}) => { const w = 640 * (o.s || 1), y = (o.y || 730); K.prop('P02', { x: 540, y, w, rot: o.rot || -.015 }); return { w, y, band: y + (.49 - .5) * w * 1448 / 1086 }; };
      const dining2 = () => { K.placeAt('doug', 205, 1300, .25); K.placeAt('gary', 745, 1300, -.25); };
      switch (id) {
        case 'q': { turkey01(1);
          const a = K.clamp01((at('card') - t) / .2);
          K.text('WHY DO WE EAT TURKEY', { y: 280, size: 84, a, scale: .8 + .2 * popIn(K, t, at('q')) });
          K.text('ON THANKSGIVING?', { y: 390, size: 84, color: 'gold', a, scale: .8 + .2 * popIn(K, t, at('q') + .9) }); break; }
        case 'card': { const u = K.clamp01(Lc / 1.6), [x0, z0] = K.floorAt(-120, 1320), [x1, z1] = K.floorAt(300, 1320);
          K.place('doug', K.lerp(x0, x1, u), 0, K.lerp(z0, z1, u), u < 1 ? PI / 2 : .15);
          const te = wordAt(K, 'exactly', 'card'); face(D, t > te ? 'smirk' : 'smile', t);
          D.pose({ t, walk: Lc * 1.5, walkAmt: 1 - K.ease((u - .85) / .15), gesture: t > te - .2 ? 'hips' : undefined, gw: K.ease((t - te + .2) / .35) }); break; }
        case 'ground': {
          K.text('1621', { y: 270, size: 120, color: 'gold', scale: popIn(K, t, at('ground')) });
          K.text('≈ 405 YEARS AGO', { y: 380, size: 54, scale: popIn(K, t, at('ground') + .35) }); break; }
        case 'feast': { K.text('PILGRIMS', { y: 260, size: 86, scale: popIn(K, t, wordAt(K, 'pilgrims', 'feast')) });
          K.text('= English settlers', { y: 355, size: 50, color: 'gold', scale: popIn(K, t, wordAt(K, 'pilgrims', 'feast') + .2) }); break; }
        case 'feast+1.8': { K.text('WAMPANOAG', { y: 260, size: 86, scale: popIn(K, t, at('feast+1.8')) });
          K.text('= already living here', { y: 355, size: 50, color: 'gold', scale: popIn(K, t, wordAt(K, 'native', 'feast')) }); break; }
        case 'feast+3.8': { K.text('3 DAYS', { y: 300, size: 110, color: 'gold', scale: popIn(K, t, wordAt(K, 'threeday', 'feast')) });
          if (t > wordAt(K, 'harvest', 'feast')) K.text('HARVEST FEAST', { y: 410, size: 62, scale: popIn(K, t, wordAt(K, 'harvest', 'feast')) }); break; }
        case 'bet': case 'bet+1.57': {
          K.placeAt('doug', 230, 1290, .3);
          const tt = wordAt(K, 'turkey', 'bet'), drop = K.clamp01((t - (tt - .25)) / .3);
          if (t > tt - .25) { const p = K.img(DTABLE.ix, DTABLE.iy); K.prop('P01', { x: p.x, y: p.y - (1 - drop) * (1 - drop) * 500, w: 300 * S, anchor: [.5, .85], layer: 'back' }); }
          if (id === 'bet') { face(D, t > tt ? 'happy' : 'smile', t); D.pose({ t, gesture: 'tada', gw: K.ease((t - tt) / .3), look: .2 }); }
          else { face(D, 'smirk', t); D.pose({ t, nod: .12 * Math.sin(K.clamp01((t - wordAt(K, 'bet', 'bet+1.57')) / .5) * PI), gesture: 'hips', gw: 1 }); }
          break; }
        case 'letter': { turkey01();
          K.placeAt('doug', 230, 1290, .3);
          const u = K.clamp01(Lc / 1.6), [x0, z0] = K.floorAt(1100, 1310), [x1, z1] = K.floorAt(740, 1300);
          K.place('garyp', K.lerp(x0, x1, u), 0, K.lerp(z0, z1, u), u < 1 ? -PI / 2 : -.3);
          face(GP, 'flat', t, 1); GP.pose({ t, walk: Lc * 1.5, walkAmt: 1 - K.ease((u - .85) / .15), armR: { raise: .45 }, nod: .15 });
          face(D, t > at('letter') + 1.0 ? 'surprised' : 'smile', t); D.pose({ t, look: -.55 * K.ease((Lc - .3) / .4) }); break; }
        case 'winslow': { const sl = K.easeOut(K.clamp01(Lc / .4)); K.prop('P02', { x: 540, y: 730 + (1 - sl) * 1200, w: 640, rot: -.015 });
          K.text('EDWARD WINSLOW, 1621', { y: 190, size: 60, color: 'gold', scale: popIn(K, t, wordAt(K, 'edward', 'winslow')) });
          K.text('THE ONLY EYEWITNESS LETTER', { y: 262, size: 40, scale: popIn(K, t, at('winslow') + .15) }); break; }
        case 'fowling': { const s = 1 + .12 * K.ease(Lc / 1.8), L2 = letter({ s, y: 730 });
          K.text('"...our governor sent', { y: L2.band - 45 * s, size: 48 * s, color: INK, font: 'marker' });
          K.text('four men on fowling..."', { y: L2.band + 25 * s, size: 48 * s, color: INK, font: 'marker' });
          const tf = wordAt(K, 'fowling', 'fowling'); if (t > tf) K.text('FOWLING', { y: L2.band + 130 * s, size: 96, color: 'gold', scale: popIn(K, t, tf) }); break; }
        case 'birds': { const g = K.img(0, 0), base = 1060;
          [['P03', 'ducks', 230, 230], ['P04', 'geese', 540, 270], ['P05', 'turkey', 850, 300]].forEach(([k, w, x, wd]) => { const tw = wordAt(K, w, 'birds');
            if (t > tw - .05) K.prop(k, { x, y: base, w: wd * popIn(K, t, tw - .05) * 1.15, anchor: [.5, .92] }); });
          K.text('HUNTING BIRDS', { y: 280, size: 80, scale: popIn(K, t, wordAt(K, 'hunting', 'birds')) });
          const tm = wordAt(K, 'maybe', 'birds'); if (t > tm) K.text('?', { x: 870, y: 720, size: 150, color: 'gold', scale: popIn(K, t, tm) }); break; }
        case 'deer': { for (let i = 0; i < 5; i++) { const ti = at('deer') + .3 + i * .28;
            if (t > ti) K.prop('P06', { x: 150 + i * 195, y: 1080 - (i % 2) * 70, w: 240 * popIn(K, t, ti), anchor: [.5, .95] }); }
          const tf = wordAt(K, 'five', 'deer'); if (t > tf) K.text('5 DEER', { y: 300, size: 110, color: 'gold', scale: popIn(K, t, tf) }); break; }
        case 'notice': { const L2 = letter({ s: 1.12 });
          const sc = K.clamp01(Lc / .9); K.text('━━━━━━━━━━', { y: K.lerp(L2.y - 430, L2.y + 400, sc), size: 60, color: 'gold', a: sc < 1 ? .85 : 0, stroke: 0, shadow: false });
          const tn = wordAt(K, 'not', 'notice'); if (t > tn) { K.text('TURKEY', { y: L2.band, size: 110, color: 'red', scale: popIn(K, t, tn) }); K.text('━━━━━━━', { y: L2.band - 2, size: 64, color: 'red', stroke: 5, scale: K.clamp01((t - tn - .15) / .2) }); }
          break; }
        case 'doubt': { turkey01(); dining2();
          face(D, 'worried', t); D.pose({ t, look: -.45, nod: .25 }); face(G, 'smirk', t, 1); G.pose({ t, gesture: 'cross', gw: K.ease(Lc / .4), look: .3 }); break; }
        case 'hale': { turkey01(); dining2();
          face(D, 'flat', t); D.pose({ t, look: -.45, nod: .2, gesture: 'think', gw: K.ease(Lc / .4) }); face(G, 'flat', t, 1); G.pose({ t, look: .45, nod: .2 }); break; }
        case 'editor': { const ts = wordAt(K, 'sarah', 'editor'), te = wordAt(K, 'editor', 'editor');
          K.text('MAGAZINE EDITOR', { y: 1060, size: 54, scale: popIn(K, t, te) });
          if (t > ts) K.text('SARAH JOSEPHA HALE', { y: 970, size: 76, color: 'gold', scale: popIn(K, t, ts), w: 1060 }); break; }
        case 'novel': { const u = K.ease((t - wordAt(K, 'roast', 'novel')) / 1.2);
          K.prop('P07', { x: K.lerp(540, 300, u), y: K.lerp(820, 780, u), w: K.lerp(900, 1500, u) * popIn(K, t, at('novel'), .3), rot: -.02 });
          K.text('NORTHWOOD', { y: 270, size: 96, color: 'gold', scale: popIn(K, t, wordAt(K, 'novel', 'novel')) });
          K.text('A NOVEL, 1827', { y: 370, size: 52, scale: popIn(K, t, wordAt(K, 'novel', 'novel') + .2) });
          if (t < wordAt(K, 'novel', 'novel')) K.text('206 YEARS LATER', { y: 300, size: 70, scale: popIn(K, t, at('novel')) }); break; }
        case 'letters': { const t5 = wordAt(K, 'five', 'letters'); let n = 0;
          for (let i = 0; i < 5; i++) { const ti = t5 + i * .3, ph = K.clamp01((t - ti) / .8); if (t < ti) continue; n = i + 1;
            K.prop('P08', { x: K.lerp(540, 220 + i * 160, ph), y: K.lerp(980, 560 + (i % 2) * 120, K.easeOut(ph)), w: 240, rot: (i - 2) * .12 * ph }); }
          if (n) K.text(n + (n === 1 ? ' PRESIDENT' : ' PRESIDENTS'), { y: 280, size: 90, color: 'gold' });
          const tn = wordAt(K, 'national', 'letters'); if (t > tn) K.text('"MAKE IT A NATIONAL HOLIDAY"', { y: 380, size: 46, scale: popIn(K, t, tn), w: 1060 }); break; }
        case 'lincoln': { const ty = wordAt(K, 'yes', 'lincoln'), ta = wordAt(K, 'abraham', 'lincoln');
          K.text('1863', { y: 260, size: 120, color: 'gold', scale: popIn(K, t, at('lincoln')) });
          if (t > ta) { K.text('ABRAHAM LINCOLN', { y: 370, size: 72, scale: popIn(K, t, ta) }); K.text('16th U.S. President', { y: 445, size: 44, color: 'gold', scale: popIn(K, t, ta + .2) }); }
          if (t > ty - .2) { const d = K.easeOut(K.clamp01((t - ty + .2) / .22));
            K.prop('P09', { x: 600, y: K.lerp(-400, 860, d), w: 470, rot: .04 });
            K.text('THANKSGIVING', { x: 600, y: K.lerp(-400, 860, d) - 215, size: 54, color: INK, stroke: 0, shadow: false, rot: .04 });
            if (t > ty) K.text('YES.', { x: 600, y: 1090, size: 120, color: 'gold', scale: popIn(K, t, ty) }); }
          break; }
        case 'big': { dining2(); const tb = wordAt(K, 'big', 'big'), g = 1 + .55 * K.ease((t - tb) / .9);
          turkey01(g); face(D, 'happy', t); D.pose({ t, gesture: 'tada', gw: K.ease((t - tb) / .35) }); face(G, 'flat', t, 1); G.pose({ t, look: .4 });
          const tc = wordAt(K, 'crowd', 'big'); if (t > tc) K.text('FEEDS A CROWD', { y: 280, size: 80, color: 'gold', scale: popIn(K, t, tc) }); break; }
        case 'eggs': { turkey01(1.2); dining2();
          const tk = wordAt(K, 'turkeys', 'eggs'), te = wordAt(K, 'eggs', 'eggs'), tc = wordAt(K, 'cheap', 'eggs');
          if (t > tk - .1) { const p = K.img(DTABLE.ix + 250, DTABLE.iy + 20); K.prop('P05', { x: p.x, y: p.y, w: 290 * S * popIn(K, t, tk - .1), anchor: [.5, .9], layer: 'back' }); }
          if (t > te) { K.text('EGGS', { y: 270, size: 96, scale: popIn(K, t, te) }); K.text('━━━━━', { y: 268, size: 56, color: 'red', stroke: 5, scale: K.clamp01((t - te - .12) / .2) }); }
          if (t > tc) K.text('= CHEAP', { y: 400, size: 96, color: 'gold', scale: popIn(K, t, tc) });
          face(G, 'flat', t, 1); G.pose({ t, gesture: 'shrug', gw: K.ease((t - te) / .35) }); face(D, t > tk && t < tk + .5 ? 'blink' : 'surprised', t); D.pose({ t, look: -.4, lean: -.06 }); break; }
        case 'today': { turkey01(); dining2(); const tn = wordAt(K, 'nine', 'today');
          for (let i = 0; i < 10; i++) { const ti = at('today') + .15 + i * .12, x = 160 + (i % 5) * 190, y = 300 + Math.floor(i / 5) * 160;
            if (t > ti) K.prop(i < 9 ? 'P01' : 'P10', { x, y, w: 170 * popIn(K, t, ti) }); }
          if (t > tn) K.text('9 IN 10 AMERICANS', { y: 520, size: 74, color: 'gold', scale: popIn(K, t, tn) });
          face(D, 'smile', t); D.pose({ t, nod: .1 * Math.sin(t * 4) }); face(G, 'smile', t, 1); G.pose({ t, look: .2 }); break; }
        case 'end': { K.placeAt('doug', 330, 1215, .15); const te = wordAt(K, 'exactly', 'end');
          face(D, t > te ? 'smirk' : 'smile', t); D.pose({ t, gesture: 'hips', gw: K.ease((t - te + .2) / .35) }); break; }
        case 'deerplate': { K.placeAt('doug', 235, 1225, .2); const ts = wordAt(K, 'served', 'deerplate');
          if (t > ts) { const p = K.img(BTABLE[0].ix, BTABLE[0].iy); K.prop('P10', { x: p.x, y: p.y, w: 210 * S * popIn(K, t, ts), anchor: [.5, .8], layer: 'back' }); }
          face(D, 'happy', t); D.pose({ t, gesture: 'tada', gw: K.ease((t - ts) / .35) });
          if (t > wordAt(K, 'deer', 'deerplate')) K.text('DEER.', { y: 300, size: 110, color: 'gold', scale: popIn(K, t, wordAt(K, 'deer', 'deerplate')) }); break; }
        case 'heli': case 'cta': {
          { const p = K.img(BTABLE[0].ix, BTABLE[0].iy); K.prop('P10', { x: p.x, y: p.y, w: 210 * S, anchor: [.5, .8], layer: 'back' }); }
          K.placeAt('doug', 330, 1215, .15);
          const tg = at('heli'), u = K.clamp01((t - tg) / 1.0), [x0, z0] = K.floorAt(1150, 1230), [x1, z1] = K.floorAt(780, 1215);
          K.place('gary', K.lerp(x0, x1, u), 0, K.lerp(z0, z1, u), u < 1 ? -PI / 2 : -.2);
          const tt = wordAt(K, 'turkey', 'heli');
          if (t > tt - .15) { const p = K.img(BTABLE[1].ix, BTABLE[1].iy); K.prop('P01', { x: p.x, y: p.y, w: 230 * S * popIn(K, t, tt - .15), anchor: [.5, .85], layer: 'back' }); }
          // THE HELICOPTER ENDING (PLAYBOOK §1.12a): crosses the sky on the last story line; Gary, the winner, looks up
          const hu = K.helicopter(t, 'heli', { y: 280, w: 520 }), up = hu < 0 ? 0 : Math.sin(PI * K.clamp01((hu - .1) / .85));
          face(G, up > .4 ? 'flat' : 'smirk', t, 1);
          G.pose({ t, walk: (t - tg) * 1.5, walkAmt: 1 - K.ease((u - .8) / .2), nod: -.38 * up, gesture: id === 'cta' ? 'point' : undefined, gw: K.ease((Lc - .3) / .35) * (1 - up * .7) });
          face(D, id === 'cta' ? 'flat' : t > tt ? 'worried' : 'happy', t);
          D.pose({ t, look: -.4, nod: -.12 * up, gesture: id === 'cta' ? 'shrug' : 'tada', gw: id === 'cta' ? K.ease((Lc - .2) / .4) : 1 - K.ease((t - tt) / .3) }); break; }
      }
    },
  };
})();
