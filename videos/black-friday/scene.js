// black-friday: are Black Friday deals worth it? Plates + props + Doug, Gary, 2 shoppers. Plan: shotlist.md.
// World units: feet at y=0, camera at (0, camH, 0) looking down -z. Props + text in screen px (y down).
// Every price, timer and word on screen is K.text (the paintings carry no text).
(function () {
  const PI = Math.PI;
  const face = (ch, name, t, off = 0) => ch.face(((t + off) % 4.1) < .12 && name !== 'happy' ? 'blink' : name);
  const popIn = (K, t, from, dur = .35) => K.pop(K.clamp01((t - from) / dur));
  const WORDS = window.VIDEO_DATA.words, norm = w => w.toLowerCase().replace(/[^a-z0-9]/g, '');
  const wordAt = (K, w, cue) => { const t0 = K.T(cue); const x = WORDS.find(o => o.start >= t0 - .01 && norm(o.w) === w); return x ? x.start : t0; };
  const RED = '#e8352b', GOLD = 'gold';

  const L = {
    store: { key: [0xffc08a, 2.2, [-12, 6, 2]], hemi: [0xb8b0ff, 0x8070a0, .85], front: [0xffe4d8, 1.0], shadow: [0x3a2a6a, .38] },
    desk: { key: [0xffb060, 1.9, [10, 5, 3]], hemi: [0x7a70d0, 0x5a3830, .8], front: [0xffcfa8, .85], shadow: [0x1c1038, .45] },
    dusk: { key: [0xff9a60, 1.9, [-12, 5, -4]], hemi: [0xb080e0, 0x503060, .85], front: [0xffc8b0, .95], shadow: [0x2a1040, .45] },
  };

  // the yellow tag: body center sits ~9% of its height below the image center
  function tag(K, x, y, w, lines, o = {}) {
    const h = w * 1.5; K.prop('P01', { x, y, w, rot: o.rot || 0 });
    lines.forEach(([str, col, size, dy, strike]) => {
      const ty = y + h * .09 + dy * w;
      K.text(str, { x, y: ty, size: size * w / 400, color: col || '#1c1c22', stroke: col === GOLD || col === RED ? Math.round(size * w / 400 * .14) : 0, shadow: false, w: w * 1.2, rot: o.rot || 0 });
      if (strike) K.text('━━━━━', { x, y: ty, size: size * w / 400, color: RED, stroke: 0, shadow: false, w: w * 1.2, rot: (o.rot || 0) - .12 });
    });
  }
  const WAS = (s = 52) => ['WAS $800', RED, s, -.08, true];
  const NOW = (s = 60) => ['NOW $500', GOLD, s, .15];
  // countdown that really ticks: 03:59:59 at the "site" cue
  const clock = (K, t) => { const left = Math.max(0, 4 * 3600 - 1 - Math.floor(t - K.T('site'))), h = Math.floor(left / 3600), m = Math.floor(left / 60) % 60, s = left % 60;
    return [h, m, s].map(v => String(v).padStart(2, '0')).join(':'); };

  window.SCENE = {
    plates: {
      '01': { img: '01_electronics_aisle.png', hz: .47, vx: .52, fov0: 55, camH: 1.5, light: L.store },
      '02': { img: '02_home_desk_night.png', hz: .46, vx: .5, fov0: 55, camH: 1.45, light: L.desk },
      '03': { img: '03_store_parking_dusk.png', hz: .55, vx: .5, fov0: 55, camH: 1.7, light: L.dusk },
      '04': { img: '04_electronics_aisle_empty.png', hz: .47, vx: .52, fov0: 55, camH: 1.5, light: L.store },
    },
    props: { P01: 'P01_price_tag.png', P02: 'P02_anchor.png', P03: 'P03_tv_box.png', P04: 'P04_price_chart.png', P05: 'P05_sale_sign.png',
      R01: 'R01_calendar_page.png', R03: 'R03_phone_blank.png', H01: 'H01_helicopter.png' },
    cast: { doug: 'hoodie', gary: 'oxford', e1: 'polo', e2: { outfit: 'polo', shirt: 0x8a2c3a, pants: 0x3a3f4a } },
    shots: [
      { at: 'q', plate: '01', zoom: [1.0, 1.15], focus: [[.5, .52], [.52, .5]] },
      { at: 'tv', plate: '01', zoom: [1.3, 1.4], focus: [[.55, .5], [.56, .5]] },
      { at: 'was', plate: '01', zoom: [1.9, 1.95], focus: [[.6, .45], [.6, .45]] },
      { at: 'now', plate: '01', zoom: [2.0, 2.1], focus: [[.6, .46], [.6, .46]] },
      { at: 'saving', plate: '01', zoom: [1.35, 1.4], focus: [[.42, .6], [.42, .6]] },
      { at: 'gary', plate: '01', zoom: [1.15, 1.2], focus: [[.55, .6], [.58, .6]] },
      { at: 'really', plate: '01', zoom: [1.12, 1.2], focus: [[.55, .58], [.56, .57]] },
      { at: 'trick', plate: '01', zoom: [1.05, 1.12], focus: [[.5, .58], [.5, .57]] },
      { at: 'anchor', plate: '01', zoom: [1.9, 1.95], focus: [[.6, .45], [.6, .45]] },
      { at: 'feels', plate: '01', zoom: [2.0, 2.2], focus: [[.6, .46], [.6, .46]] },
      { at: 'usual', plate: '01', zoom: [1.3, 1.35], focus: [[.45, .6], [.45, .6]] },
      { at: 'site', plate: '02', zoom: [1.1, 1.2], focus: [[.5, .58], [.55, .56]] },
      { at: 'tonight', plate: '02', zoom: [2.4, 2.6], focus: [[.74, .44], [.74, .44]] },
      { at: 'rushed', plate: '02', zoom: [1.35, 1.45], focus: [[.42, .6], [.42, .58]] },
      { at: 'back', plate: '02', zoom: [1.45, 1.5], focus: [[.42, .58], [.42, .58]] },
      { at: 'everyone', plate: '04', zoom: [1.0, 1.0], focus: [[.48, .58], [.52, .58]] },
      { at: 'countdown', plate: '02', zoom: [1.0, 1.08], focus: [[.5, .5], [.5, .5]] },
      { at: 'notplanning', plate: '02', zoom: [1.35, 1.4], focus: [[.42, .6], [.42, .6]] },
      { at: 'catch', plate: '01', zoom: [1.15, 1.2], focus: [[.55, .6], [.55, .58]] },
      { at: 'prove', plate: '01', zoom: [1.9, 2.0], focus: [[.6, .45], [.6, .45]] },
      { at: 'rule', plate: '01', zoom: [1.1, 1.2], focus: [[.55, .6], [.55, .58]] },
      { at: 'tag', plate: '01', zoom: [1.0, 1.05], focus: [[.5, .5], [.5, .5]] },
      { at: 'other', plate: '01', zoom: [1.15, 1.2], focus: [[.45, .6], [.48, .6]] },
      { at: 'check', plate: '02', zoom: [1.0, 1.06], focus: [[.55, .58], [.55, .57]] },
      { at: 'compare', plate: '02', zoom: [1.05, 1.05], focus: [[.5, .55], [.5, .55]] },
      { at: 'good', plate: '02', zoom: [1.25, 1.35], focus: [[.5, .58], [.5, .57]] },
      { at: 'end', plate: '03', zoom: [1.1, 1.15], focus: [[.45, .62], [.5, .6]] },
      { at: 'heli', plate: '03', zoom: [1.0, 1.02], focus: [[.5, .5], [.5, .5]] },
      { at: 'tip', plate: '03', zoom: [1.02, 1.08], focus: [[.5, .52], [.5, .52]] },
      { at: 'ask', plate: '03', zoom: [1.1, 1.15], focus: [[.5, .55], [.5, .55]] },
      { at: 'cta', plate: '03', zoom: [1.05, 1.05], focus: [[.5, .5], [.5, .5]] },
    ],
    shakes: [['anchor+0.35', .3, .7], ['now', .2, .3]],
    flashes: [],
    follow: { from: 'cta+0.3' },
    tail: 1.6,

    update(t, K) {
      const id = K.shot.id, Lc = K.shot.local, at = c => K.T(c), S = K.imgScale();
      const D = K.cast.doug, G = K.cast.gary;
      // the big TV on its stand (painting px): tag hangs off its right edge
      const tvTag = (lines, w = 170) => { const p = K.img(640, 720); tag(K, p.x, p.y, w * S, lines, { rot: Math.sin(t * 1.3) * .04 }); };
      const aisle = (dx = 0) => { K.placeAt('doug', 300 + dx, 1090, .45); };
      const garyAisle = (walkFrom) => { if (walkFrom === undefined) return K.placeAt('gary', 870, 1090, -.45);
        const u = K.clamp01((t - walkFrom) / 1.2), [x0, z0] = K.floorAt(1020, 1080), [x1, z1] = K.floorAt(870, 1090);
        const g = K.place('gary', K.lerp(x0, x1, u), 0, K.lerp(z0, z1, u), u < 1 ? -PI / 2 : -.45); G.pose({ t, walk: (t - walkFrom) * 1.4, walkAmt: 1 - u }); return g; };
      const desk = () => K.placeAt('doug', 330, 1150, .45);
      switch (id) {
        case 'q': { aisle(); face(D, 'flat', t); D.pose({ t, look: .25, nod: -.08 }); tvTag([WAS(), NOW()]);
          const a = K.clamp01((at('tv') - t) / .2);
          K.text('ARE BLACK FRIDAY', { y: 290, size: 96, a, scale: .8 + .2 * popIn(K, t, at('q')) });
          K.text('DEALS WORTH IT?', { y: 400, size: 104, color: GOLD, a, scale: .8 + .2 * popIn(K, t, at('q') + .9) }); break; }
        case 'tv': { aisle(); face(D, 'surprised', t); D.pose({ t, look: .3, lean: .06 }); tvTag([WAS(), NOW()]); break; }
        case 'was': { tag(K, 540, 700, 700, [WAS()], { rot: Math.sin(t * 1.3) * .03 }); break; }
        case 'now': { tag(K, 540, 700, 700 * (1 + .05 * Math.max(0, 1 - Lc / .25)), [WAS(), NOW()], { rot: Math.sin(t * 1.3) * .03 }); break; }
        case 'saving': { aisle(); face(D, 'happy', t); D.pose({ t, gesture: 'tada', gw: K.ease(Lc / .35) }); break; }
        case 'gary': { aisle(); face(D, 'happy', t); D.pose({ t, gesture: 'hips', gw: 1 }); garyAisle(at('gary') - .2); face(G, 'flat', t, 1); tvTag([WAS(), NOW()]); break; }
        case 'really': { aisle(); garyAisle(); face(G, 'flat', t, 1); G.pose({ t, gesture: 'point', gw: K.ease(Lc / .3), look: .5 });
          face(D, Lc > 1 ? 'worried' : 'happy', t); D.pose({ t, look: -.4 }); tvTag([WAS(), NOW()], 150 * (1 + .08 * Math.sin(t * 8) * (Lc > .8 ? 1 : 0))); break; }
        case 'trick': { aisle(); garyAisle(); face(D, 'flat', t); D.pose({ t, tilt: .18 * K.ease(Lc / .5) }); face(G, 'flat', t, 1); G.pose({ t, gesture: 'cross', gw: 1 }); tvTag([WAS(), NOW()]); break; }
        case 'anchor': { const u = K.clamp01(Lc / .35);
          tag(K, 540, 700, 700, [WAS(), NOW()], { rot: u >= 1 ? Math.sin((Lc - .35) * 20) * .05 * Math.max(0, 1 - (Lc - .35)) : 0 });
          K.prop('P02', { x: 540, y: K.lerp(-300, 560, u * u), w: 300, rot: -.08 });
          if (u >= 1) K.text('ANCHOR', { y: 300, size: 92, color: GOLD, scale: popIn(K, t, at('anchor') + .35) }); break; }
        case 'feels': { tag(K, 540, 700, 700, [WAS(), ['NOW $500', GOLD, 60 * (1 + .25 * K.ease(Lc / 1.2)), .15]]);
          K.prop('P02', { x: 540, y: 560, w: 300, rot: -.08 });
          if (t > wordAt(K, 'bargain', 'feels')) K.text('BARGAIN!', { y: 300, size: 96, color: GOLD, scale: popIn(K, t, wordAt(K, 'bargain', 'feels')) }); break; }
        case 'usual': { aisle(); face(D, 'flat', t); D.pose({ t, gesture: 'shrug', gw: K.ease(Lc / .35) });
          const h = K.screenOf(D.head); K.text('usual price: ???', { x: Math.max(330, h.x), y: h.y - 240, size: 76, scale: popIn(K, t, at('usual') + .2), w: 800 }); break; }
        case 'site': { desk(); face(D, 'flat', t); D.pose({ t, look: -.45, lean: .05 }); break; }
        case 'tonight': { const p = K.img(762, 672);
          K.text('DEAL ENDS TONIGHT!', { x: p.x, y: p.y - 60 * K.imgScale() / 2.5, size: 40 * K.imgScale() / 2.5, color: RED, stroke: 0, shadow: false, w: 900, scale: popIn(K, t, at('tonight')) });
          K.text(clock(K, t), { x: p.x, y: p.y + 35 * K.imgScale() / 2.5, size: 72 * K.imgScale() / 2.5, color: '#14325a', stroke: 0, shadow: false, w: 900 }); break; }
        case 'rushed': case 'back': case 'notplanning': { desk(); const worried = id !== 'notplanning' || Lc < 1.2;
          face(D, worried ? 'worried' : 'flat', t); D.pose({ t, look: -.3, lean: id === 'rushed' ? .1 * K.ease(Lc / .5) : .05,
            gesture: id === 'notplanning' ? (Lc < 1.2 ? 'think' : 'facepalm') : undefined, gw: K.ease((Lc - (Lc < 1.2 ? 0 : 1.2)) / .35) });
          if (id === 'back') { const h = K.screenOf(D.head); K.text('$500 → $800?', { x: h.x + 120, y: h.y - 230, size: 70, color: RED, scale: popIn(K, t, wordAt(K, 'back', 'back')), w: 900 }); }
          if (id === 'rushed') { const h = K.screenOf(D.head); K.text(clock(K, t), { x: h.x + 120, y: h.y - 220, size: 66, color: RED, w: 600 }); }
          break; }
        case 'everyone': { // two shoppers hurry off with the last TV boxes
          [['e1', 0, .0], ['e2', 1, .2]].forEach(([n, i, d]) => { const s = Math.max(0, Lc - d), [x, z] = K.floorAt(i ? 760 : 320, i ? 1040 : 1110);
            const c = K.place(n, x + s * 2.2 * (i ? -1 : 1), 0, z, i ? -PI / 2 : PI / 2); face(c, 'happy', t, i); c.pose({ t, walk: s * 1.8, walkAmt: 1, armR: { raise: .5 }, armL: { raise: .5 } });
            const f = K.screenOf(c.root); K.prop('P03', { x: f.x + (i ? -40 : 40), y: f.y - 215, w: 170, layer: 'front' }); }); break; }
        case 'countdown': { K.prop('R03', { x: 540, y: 820, w: 1000 });
          K.text('DEAL ENDS TONIGHT', { x: 540, y: 690, size: 54, color: RED, stroke: 0, shadow: false });
          K.text(clock(K, t), { x: 540, y: 820, size: 104, color: '#14325a', stroke: 0, shadow: false }); break; }
        case 'catch': case 'rule': { aisle(); garyAisle(); face(G, id === 'catch' ? 'smile' : 'flat', t, 1); G.pose({ t, nod: id === 'catch' ? .15 * Math.sin(Math.min(1, Lc / .6) * PI) : 0, gesture: id === 'rule' ? 'point' : undefined, gw: K.ease(Lc / .3) });
          face(D, 'flat', t); D.pose({ t, look: -.3 }); tvTag([WAS(), NOW()]);
          if (id === 'catch') { const tw = wordAt(K, 'real', 'catch'); K.text('✓ SOME DEALS ARE REAL', { y: 300, size: 74, color: GOLD, scale: popIn(K, t, tw) }); }
          else { K.text('the "WAS" price', { y: 270, size: 66, scale: popIn(K, t, at('rule') + .3) }); K.text('should be REAL', { y: 360, size: 80, color: GOLD, scale: popIn(K, t, wordAt(K, 'comparison', 'rule')) }); }
          break; }
        case 'prove': { tag(K, 540, 700, 700, [WAS(), NOW()], { rot: Math.sin(t * 9) * .03 * K.clamp01((Lc - 1) / .3) });
          if (t > wordAt(K, 'prove', 'prove')) K.text('= PROOF?', { y: 300, size: 92, color: RED, scale: popIn(K, t, wordAt(K, 'prove', 'prove')) }); break; }
        case 'tag': { K.prop('R01', { x: 540, y: 820, w: 760 * popIn(K, t, at('tag')) });
          if (t > wordAt(K, 'last', 'tag') - .2) K.text('LAST WEEK: $???', { x: 540, y: 860, size: 80, color: '#1c2a4a', stroke: 0, shadow: false, scale: popIn(K, t, wordAt(K, 'last', 'tag') - .2) }); break; }
        case 'other': { aisle(); face(D, 'flat', t); D.pose({ t, gesture: 'shrug', gw: K.ease(Lc / .35) });
          [['STORE A', 260], ['STORE B', 540], ['STORE C', 820]].forEach(([n, x], i) => tag(K, x, 300, 200 * popIn(K, t, at('other') + .2 + i * .15), [[n, '#1c1c22', 50, -.13], ['$???', '#1c1c22', 70, .12]], { rot: Math.sin(t * 1.3 + i) * .05 })); break; }
        case 'check': { K.placeAt('gary', 330, 1150, .45); face(G, 'flat', t, 1); G.pose({ t, gesture: 'think', gw: K.ease(Lc / .4), look: -.4 });
          const s = popIn(K, t, at('check') + .3); K.prop('P04', { x: 560, y: 400, w: 700 * s });
          if (s > .95) { K.text('PRICE HISTORY', { y: 205, size: 64, color: GOLD }); K.text('last month', { x: 330, y: 600, size: 38, stroke: 6 }); K.text('today', { x: 800, y: 600, size: 38, stroke: 6 }); } break; }
        case 'compare': { [['$549', 220, '#1c1c22'], ['$529', 540, '#1c1c22'], ['$500', 860, GOLD]].forEach(([p, x, c], i) => {
            const tw = at('compare') + .3 + i * .45; tag(K, x, 760, 260 * popIn(K, t, tw), [[['STORE A', 'STORE B', 'THIS ONE'][i], '#1c1c22', 46, -.13], [p, c, 72, .12]], { rot: Math.sin(t * 1.3 + i) * .05 }); }); break; }
        case 'good': { K.placeAt('gary', 330, 1150, .45); K.placeAt('doug', 600, 1170, -.3); face(G, 'smile', t, 1); G.pose({ t, gesture: 'point', gw: K.ease(Lc / .3), look: .4 });
          face(D, 'happy', t); D.pose({ t, gesture: 'tada', gw: K.ease((Lc - .3) / .35) });
          K.text('$500 = GOOD PRICE ✓', { y: 330, size: 84, color: GOLD, scale: popIn(K, t, wordAt(K, 'good', 'good')) }); break; }
        case 'end': case 'heli': case 'tip': case 'ask': case 'cta': {
          // Doug walks out of the store with his TV, then stops in the lot
          const u = K.clamp01((t - at('end')) / 1.6), [x0, z0] = K.floorAt(300, 1000), [x1, z1] = K.floorAt(520, 1190);
          const d = K.place('doug', K.lerp(x0, x1, u), 0, K.lerp(z0, z1, u), u < 1 ? .35 : .1);
          // THE HELICOPTER ENDING (PLAYBOOK §1.12a): it crosses the dusk sky on "and keeps the money..."; Doug looks up
          const hu = K.helicopter(t, 'heli', { y: 300 }), up = hu < 0 ? 0 : Math.sin(PI * K.clamp01((hu - .05) / .85));
          face(D, up > .4 ? 'flat' : (id === 'ask' ? 'flat' : 'happy'), t);
          D.pose({ t, walk: (t - at('end')) * 1.4, walkAmt: 1 - u, nod: -.5 * up, armR: { raise: .55 }, armL: { raise: .55 }, gesture: id === 'cta' ? 'shrug' : undefined, gw: K.ease(Lc / .4) });
          const f = K.screenOf(d.root); if (id !== 'cta') K.prop('P03', { x: f.x + 10, y: f.y - 300 * K.lerp(.85, 1, u), w: 200 * K.lerp(.85, 1, u), layer: 'front' });
          if (id === 'ask' || id === 'cta') { const g = K.placeAt('gary', 800, 1170, -.35); face(G, 'smirk', t, 1); G.pose({ t, gesture: id === 'cta' ? 'point' : 'cross', gw: K.ease(Lc / .35) }); }
          if (id === 'tip') { K.text('✓ price history', { y: 300, size: 74, color: GOLD, scale: popIn(K, t, wordAt(K, 'price', 'tip')) });
            K.text('✓ same model, other stores', { y: 400, size: 62, scale: popIn(K, t, wordAt(K, 'compare', 'tip')), w: 1040 }); }
          if (id === 'ask') { const s = popIn(K, t, at('ask') + .2); K.prop('P05', { x: 540, y: 380, w: 520 * s }); if (s > .9) K.text('SALE?', { y: 470, size: 120, color: '#fff' }); }
          break; }
      }
    },
  };
})();
