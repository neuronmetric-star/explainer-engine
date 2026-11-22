// full-price: "Why the heck do stores even need Black Friday deals?" + the SNL "He wanna pay full price" sound.
// Plates + props + Doug, Gary (the sales guy), Victor (stand-in for JCPenney's boss). Plan: shotlist.md.
// The SNL clip plays from [#snl] to [#bet]: the narrator is silent, Doug and Gary act it out, then both DANCE on the chant.
// Every price on screen is K.text (the paintings carry no numbers).
(function () {
  const PI = Math.PI;
  const face = (ch, name, t, off = 0) => ch.face(((t + off) % 4.1) < .12 && name !== 'happy' ? 'blink' : name);
  const popIn = (K, t, from, dur = .35) => K.pop(K.clamp01((t - from) / dur));
  const WORDS = window.VIDEO_DATA.words, norm = w => w.toLowerCase().replace(/[^a-z0-9]/g, '');
  const wordAt = (K, w, cue) => { const t0 = K.T(cue); const x = WORDS.find(o => o.start >= t0 - .01 && norm(o.w) === w); return x ? x.start : t0; };

  const L = {
    store: { key: [0xffd6a8, 1.9, [-10, 6, 4]], hemi: [0x9fb2ff, 0x5a4a6a, .9], front: [0xe8eeff, 1.05], shadow: [0x14183a, .42] },
    mall: { key: [0xffd28e, 2.2, [-10, 8, 2]], hemi: [0xfff0d8, 0xc09070, .85], front: [0xfff0e0, 1.0], shadow: [0x5a3a30, .33] },
    dead: { key: [0xd8e6d8, 1.4, [-8, 8, 2]], hemi: [0xb8c8c0, 0x6a6a5a, .85], front: [0xdfe8e0, .9], shadow: [0x283030, .42] },
    lot: { key: [0xffcf96, 2.6, [-12, 5, 3]], hemi: [0xbcd4ff, 0xb09070, .75], front: [0xfff0e2, 1.05], shadow: [0x2a3a6a, .42] },
  };

  // the dance (SNL chant): stepping in place, hands up and shimmying, head bobbing. Pure function of t.
  const BEAT = 2.1;   // beats per second
  function dance(ch, t, ph = 0, amt = 1) {
    const b = (t + ph) * BEAT * PI;
    ch.pose({ t, walk: (t + ph) * BEAT * .5, walkAmt: .45 * amt, armR: { raise: amt * (.55 + .35 * Math.sin(b)) }, armL: { raise: amt * (.55 + .35 * Math.sin(b + PI)) },
      lean: amt * .07 * Math.sin(b * .5), tilt: amt * .2 * Math.sin(b), nod: amt * .12 * Math.sin(2 * b), look: amt * .25 * Math.sin(b * .5), handR: 'open', handL: 'open' });
    ch.root.position.y += amt * .05 * Math.abs(Math.sin(b)); ch.root.rotation.y += amt * .28 * Math.sin(b * .5);
  }
  // prices drawn on the yellow sticker in 02 (painting px): center + size
  const STK = { ix: 790, iy: 470 };
  function stickerPrice(K, t, state) {   // state: 'was' | 'cross' | number 0..1 strike progress
    const p = K.img(STK.ix, STK.iy), s = K.imgScale() / 1.25;
    const u = typeof state === 'number' ? state : state === 'cross' ? 1 : 0;
    K.text('$599', { x: p.x, y: p.y - (u ? 46 : 0) * s, size: (u ? 70 : 104) * s, color: '#b3121f', stroke: 0, shadow: false, rot: -.12 });
    if (u > 0) { K.text('—', { x: p.x, y: p.y - 50 * s, size: 150 * s * u, color: '#b3121f', stroke: 0, shadow: false, rot: -.32 });
      K.text('$299', { x: p.x + 4 * s, y: p.y + 40 * s, size: 92 * s, color: '#14284f', stroke: 0, shadow: false, rot: -.12, scale: popIn(K, t, K.shot.t0 + .1) }); }
  }
  // the giant tag in 05 (painting px)
  const TAG = { ix: 525, iy: 760 };
  const tagText = (K, str, dy, o = {}) => { const p = K.img(TAG.ix, TAG.iy + dy), s = K.imgScale() / 1.25;
    return K.text(str, Object.assign({ x: p.x, y: p.y, color: '#1c2a4a', stroke: 0, shadow: false, w: 1000 }, o, { size: (o.size || 120) * s })); };

  window.SCENE = {
    plates: {
      '01': { img: '01_tv_store_counter_dawn.png', hz: .4, vx: .5, fov0: 55, camH: 1.6, light: L.store },
      '02': { img: '02_counter_closeup.png', hz: .5, vx: .5, fov0: 55, camH: 1.5, light: L.store },
      '03': { img: '03_dept_store_busy.png', hz: .35, vx: .66, fov0: 55, camH: 2.1, light: L.mall },
      '04': { img: '04_dept_store_empty.png', hz: .35, vx: .66, fov0: 55, camH: 2.1, light: L.dead },
      '05': { img: '05_price_tag_board.png', hz: .5, vx: .5, fov0: 55, camH: 1.5, light: 'interior' },
      '06': { img: '06_store_front_parking_morning.png', hz: .52, vx: .5, fov0: 55, camH: 1.2, light: L.lot },
    },
    props: { P01: 'P01_tv_box.png', P02: 'P02_payment_card.png', P03: 'P03_sale_sticker.png', P04: 'P04_old_price_tag.png',
      P06: 'P06_coupon.png', P08: 'P08_office_box.png', H01: 'H01_helicopter.png' },
    cast: { doug: 'hoodie', gary: 'oxford', victor: 'suit' },
    shots: [
      { at: 'q', plate: '01', zoom: [1.0, 1.1], focus: [[.5, .5], [.5, .52]] },
      { at: 'card', plate: '01', zoom: [1.2, 1.28], focus: [[.6, .62], [.6, .62]] },
      { at: 'tv', plate: '02', zoom: [1.0, 1.18], focus: [[.5, .45], [.66, .36]] },
      { at: 'plan', plate: '01', zoom: [1.08, 1.14], focus: [[.48, .6], [.48, .6]] },
      { at: 'snl', plate: '01', zoom: [1.2, 1.28], focus: [[.38, .6], [.38, .6]] },
      { at: 'doug', plate: '01', zoom: [1.25, 1.32], focus: [[.6, .62], [.6, .62]] },
      { at: 'gary', plate: '01', zoom: [1.45, 1.45], focus: [[.35, .56], [.35, .56]] },     // hard cut on "Ah"
      { at: 'papi', plate: '01', zoom: [1.3, 1.38], focus: [[.42, .58], [.4, .58]] },
      { at: 'best', plate: '01', zoom: [1.15, 1.2], focus: [[.45, .6], [.45, .6]] },
      { at: 'dance', plate: '01', zoom: [1.0, 1.05], focus: [[.5, .55], [.5, .55]] },
      { at: 'chant', plate: '01', zoom: [1.12, 1.22], focus: [[.5, .6], [.5, .6]] },
      { at: 'bet', plate: '01', zoom: [1.2, 1.25], focus: [[.6, .62], [.6, .62]] },
      { at: 'sticker', plate: '02', zoom: [1.35, 1.55], focus: [[.75, .33], [.77, .31]] },
      { at: 'peel', plate: '02', zoom: [1.6, 1.6], focus: [[.77, .31], [.77, .31]] },
      { at: 'october', plate: '01', zoom: [1.25, 1.32], focus: [[.6, .62], [.6, .61]] },
      { at: 'why', plate: '05', zoom: [1.0, 1.08], focus: [[.5, .5], [.5, .5]] },
      { at: 'jcp', plate: '03', zoom: [1.0, 1.1], focus: [[.55, .55], [.58, .55]] },
      { at: 'honest', plate: '03', zoom: [1.2, 1.28], focus: [[.5, .55], [.5, .55]] },
      { at: 'bet2', plate: '03', zoom: [1.45, 1.5], focus: [[.4, .6], [.4, .6]] },
      { at: 'drop', plate: '04', zoom: [1.0, 1.08], focus: [[.55, .55], [.55, .55]] },
      { at: 'billion', plate: '04', zoom: [1.25, 1.35], focus: [[.5, .55], [.5, .55]] },
      { at: 'fired', plate: '04', zoom: [1.1, 1.1], focus: [[.5, .55], [.55, .55]] },
      { at: 'back', plate: '03', zoom: [1.0, 1.06], focus: [[.5, .5], [.5, .5]] },
      { at: 'brain', plate: '05', zoom: [1.0, 1.06], focus: [[.5, .5], [.5, .5]] },
      { at: '599', plate: '05', zoom: [1.08, 1.14], focus: [[.5, .5], [.5, .5]] },
      { at: '299', plate: '05', zoom: [1.1, 1.02], focus: [[.5, .5], [.5, .5]] },
      { at: 'end', plate: '06', zoom: [1.3, 1.4], focus: [[.45, .6], [.45, .6]] },
      { at: 'mirror', plate: '06', zoom: [1.15, 1.15], focus: [[.48, .57], [.48, .57]] },
      { at: 'cta', plate: '06', zoom: [1.15, 1.15], focus: [[.48, .57], [.48, .57]] },
    ],
    shakes: [['gary', .25, .4], ['dance', .2, .35], ['billion', .25, .45], ['fired', .2, .3]],
    flashes: [],
    follow: { from: 'cta+0.3' },
    tail: 1.4,

    update(t, K) {
      const id = K.shot.id, Lc = K.shot.local, at = c => K.T(c);
      const D = K.cast.doug, G = K.cast.gary, V = K.cast.victor;
      // store spots: Gary at the left end of the counter, Doug on the floor facing him
      const store = () => { K.placeAt('gary', 360, 960, .45); K.placeAt('doug', 650, 1100, -.55); };
      const card = (a = 1) => { const p = K.img(470, 612); K.prop('P02', { x: p.x, y: p.y, w: 190 * K.imgScale() * a, rot: -.04 });
        if (a > .9) K.text('4 EASY PAYMENTS', { x: p.x, y: p.y - 34 * K.imgScale(), size: 14 * K.imgScale(), color: '#0f4f52', stroke: 0, shadow: false, rot: -.04, w: 600 }); };
      switch (id) {
        case 'q': { store(); face(G, 'smile', t, 1); G.pose({ t, gesture: 'hips', gw: 1 }); face(D, 'smile', t); D.pose({ t, look: .35 });
          const a = K.clamp01((at('card') - t) / .2);
          K.text('BLACK FRIDAY DEALS', { y: 300, size: 96, a, scale: .8 + .2 * popIn(K, t, at('q')) });
          K.text('HE WANNA PAY FULL PRICE', { y: 410, size: 74, color: 'gold', a, scale: .8 + .2 * popIn(K, t, at('q') + .6) }); break; }
        case 'card': { store(); face(D, 'flat', t); D.pose({ t, gesture: 'think', gw: K.ease(Lc / .4), look: .2 }); face(G, 'smile', t, 1); G.pose({ t }); break; }
        case 'tv': { const tc = wordAt(K, 'crossed', 'tv'); stickerPrice(K, t, K.ease((t - tc) / .35)); break; }
        case 'plan': case 'snl': { store(); card(popIn(K, t, at('plan') + .2));
          face(G, 'smile', t, 1); G.pose({ t, gesture: 'point', gw: K.ease(Lc / .35), look: .2 });
          face(D, id === 'snl' ? 'flat' : 'smile', t); D.pose({ t, look: .15, gesture: id === 'snl' ? 'cross' : undefined, gw: K.ease((Lc - .6) / .4) });
          if (id === 'snl') K.text('4 × $74.99', { y: 300, size: 84, color: 'gold', scale: popIn(K, t, at('snl') + .9) }); break; }
        case 'doug': { store(); card(1); face(D, 'smirk', t); D.pose({ t, gesture: 'shrug', gw: K.ease((t - wordAt(K, 'if', 'doug')) / .35), armR: { raise: .3 }, look: .1 });
          face(G, 'smile', t, 1); G.pose({ t, look: .3 }); break; }
        case 'gary': { store(); face(G, 'surprised', t, 1); G.pose({ t, lean: -.12 * K.ease(Lc / .3), look: .35, armL: { raise: .35 }, armR: { raise: .35 } }); face(D, 'smirk', t); D.pose({ t }); break; }
        case 'papi': { store(); face(G, 'smile', t, 1); G.pose({ t, gesture: 'point', gw: K.ease(Lc / .3), look: .35, nod: .08 * Math.sin(Lc * 6) }); face(D, 'smile', t); D.pose({ t, look: .2 }); break; }
        case 'best': { store(); face(G, 'happy', t); G.pose({ t, gesture: 'tada', gw: K.ease(Lc / .35), look: .2 }); face(D, 'smile', t); D.pose({ t, look: .25 }); break; }
        case 'dance': case 'chant': { store(); face(G, 'happy', t); dance(G, t, 0); face(D, Lc < .6 && id === 'dance' ? 'surprised' : 'happy', t);
          dance(D, t, .24, id === 'dance' ? K.ease((Lc - .5) / .6) : 1);
          K.text('HE WANNA PAY FULL PRICE', { y: 300, size: 74, color: 'gold', scale: 1 + .06 * Math.abs(Math.sin(t * BEAT * PI)), a: id === 'chant' ? 1 : popIn(K, t, at('dance')) }); break; }
        case 'bet': { store(); face(G, 'happy', t); dance(G, t, 0, .7); face(D, 'smile', t); D.pose({ t, nod: .12 * Math.sin(K.clamp01(Lc / .6) * PI), look: -.1, gesture: 'hips', gw: K.ease((Lc - .8) / .4) });
          K.text('50% OFF?', { y: 300, size: 90, color: 'gold', scale: popIn(K, t, at('bet') + .5) }); break; }
        case 'sticker': case 'peel': {
          // the painted sticker gets covered by the old white tag; the sticker prop (with the sale price) peels off the corner
          const p = K.img(STK.ix, STK.iy), s = K.imgScale(), u = id === 'peel' ? 1 : K.ease((Lc - .6) / 1.4);
          K.prop('P04', { x: p.x, y: p.y + 14 * s, w: 580 * s, layer: 'back' });
          if (id === 'peel' || u > .95) K.text('$299', { x: p.x, y: p.y + 4 * s, size: 78 * s, color: '#b3121f', stroke: 0, shadow: false, rot: -.03, scale: id === 'peel' ? popIn(K, t, at('peel') + .5) : 1 });
          if (u < 1) { const sx = p.x + u * 520, sy = p.y - u * 300, rot = -.12 + u * 1.4;
            K.prop('P03', { x: sx, y: sy, w: 330 * s * (1 - .25 * u), rot });
            K.text('$599', { x: sx, y: sy - 30 * s, size: 50 * s * (1 - .25 * u), color: '#b3121f', stroke: 0, shadow: false, rot });
            K.text('$299', { x: sx, y: sy + 30 * s, size: 62 * s * (1 - .25 * u), color: '#14284f', stroke: 0, shadow: false, rot }); }
          break; }
        case 'october': { store(); face(D, Lc < .5 ? 'surprised' : 'worried', t); D.pose({ t, look: .1, nod: .25, lean: -.05 }); face(G, 'happy', t); dance(G, t, 0, .5);
          K.text('OCTOBER: $299', { y: 300, size: 84, color: 'red', scale: popIn(K, t, at('october') + .3) }); break; }
        case 'why': { tagText(K, '$599', -150, { size: 130, color: '#b3121f' }); tagText(K, '—', -150, { size: 240, color: '#b3121f', a: 1 });
          tagText(K, '$299', 80, { size: 170, scale: popIn(K, t, at('why') + .3) }); K.text('FAKE DEAL?', { y: 250, size: 90, scale: popIn(K, t, at('why') + .4) }); break; }
        case 'jcp': case 'honest': {
          const u = id === 'jcp' ? K.clamp01(Lc / 1.8) : 1, [x0, z0] = K.floorAt(300, 1180), [x1, z1] = K.floorAt(500, 1020);
          K.place('victor', K.lerp(x0, x1, u), 0, K.lerp(z0, z1, u), u < 1 ? .6 : 0);
          if (id === 'jcp') { face(V, 'smile', t, 2); V.pose({ t, walk: Lc * 1.3, walkAmt: 1 - K.ease((Lc - 1.5) / .4), gesture: Lc > 2 ? 'hips' : undefined, gw: K.ease((Lc - 2) / .4) });
            K.text('JCPenney', { y: 260, size: 100, scale: popIn(K, t, at('jcp') + .4) }); K.text('2012', { y: 370, size: 80, color: 'gold', scale: popIn(K, t, wordAt(K, 'twenty', 'jcp')) }); }
          else { const tS = at('honest'), tC = wordAt(K, 'coupons', 'honest'), tO = wordAt(K, 'one', 'honest');
            face(V, t < tO ? 'smirk' : 'happy', t, 2); V.pose({ t, gesture: t < tO ? 'point' : 'tada', gw: 1, look: t < tO ? -.25 : 0 });
            if (t < tC) { K.text('SALES', { y: 300, size: 110, scale: popIn(K, t, tS) }); K.text('✕', { y: 300, size: 220, color: 'red', scale: popIn(K, t, tS + .3) }); }
            else if (t < tO) { K.prop('P06', { x: 540, y: 330, w: 460 * popIn(K, t, tC), rot: -.05 }); K.text('✕', { y: 330, size: 240, color: 'red', scale: popIn(K, t, tC + .3) }); }
            else { K.text('ONE FAIR PRICE', { y: 270, size: 90, color: 'gold', scale: popIn(K, t, tO) }); K.text('EVERY DAY', { y: 380, size: 80, scale: popIn(K, t, tO + .4) }); } }
          break; }
        case 'bet2': { K.placeAt('doug', 470, 1060, .3); face(D, 'happy', t); D.pose({ t, nod: .15 * Math.sin(K.clamp01(Lc / .5) * PI), gesture: 'tada', gw: K.ease((Lc - .3) / .35) });
          K.text('$20 = $20', { y: 290, size: 100, color: 'gold', scale: popIn(K, t, at('bet2') + .3) }); break; }
        case 'drop': case 'billion': {
          K.placeAt('victor', 500, 1020, 0); face(V, 'worried', t, 2);
          V.pose({ t, look: id === 'drop' ? .35 * Math.sin(Lc * 1.6) : 0, gesture: id === 'billion' ? 'facepalm' : undefined, gw: K.ease((Lc - .2) / .4) });
          K.text('SALES −25%', { y: 270, size: 100, color: 'red', scale: popIn(K, t, wordAt(K, 'quarter', 'drop')) });
          if (id === 'billion') K.text('$4 BILLION GONE', { y: 390, size: 84, color: 'red', scale: popIn(K, t, at('billion')) }); break; }
        case 'fired': { const u = K.clamp01((Lc - .4) / 1.2), [x0, z0] = K.floorAt(500, 1020), [x1, z1] = K.floorAt(1040, 1060);
          const v = K.place('victor', K.lerp(x0, x1, u), 0, K.lerp(z0, z1, u), u > 0 ? PI / 2 : 0); face(V, 'flat', t, 2);
          V.pose({ t, walk: Math.max(0, Lc - .4) * 1.2, walkAmt: u > 0 && u < 1 ? 1 : 0, armR: { raise: .25, fwd: -.9 }, armL: { raise: .25, fwd: -.9 }, handR: 'open', handL: 'open' });
          const h = K.screenOf(v.arm[1].wr), s = K.imgScale(); K.prop('P08', { x: h.x - 40, y: h.y + 60 * s / 1.25, w: 260 * s / 1.25 });
          K.text('FIRED', { y: 300, size: 130, color: 'red', scale: popIn(K, t, at('fired') + .1), rot: -.06 }); break; }
        case 'back': { const s = K.imgScale();
          [[260, 520, .0], [700, 470, .25], [470, 860, .5], [860, 780, .75]].forEach(([ix, iy, d]) => { const p = K.img(ix, iy), k = popIn(K, t, at('back') + d * .9);
            K.prop('P03', { x: p.x, y: p.y, w: 220 * s * k, rot: -.1 + d * .2 }); if (k > .5) K.text('50%\nOFF', { x: p.x, y: p.y + 4, size: 46 * s * k, color: '#b3121f', stroke: 0, shadow: false, rot: -.1 + d * .2 }); });
          K.text('THE SALES CAME BACK', { y: 250, size: 78, color: 'gold', scale: popIn(K, t, at('back') + .2) }); break; }
        case 'brain': { const t2 = wordAt(K, 'first', 'brain');
          if (t < t2) tagText(K, '1st number?', -60, { size: 90, a: .8, scale: popIn(K, t, at('brain') + .2) });
          else tagText(K, '$599', -120, { size: 190, scale: popIn(K, t, t2) }); break; }
        case '599': { const tw = wordAt(K, 'win', '599');
          tagText(K, '$599', -170, { size: 120, color: '#b3121f' }); tagText(K, '—', -170, { size: 230, color: '#b3121f', scale: popIn(K, t, at('599') + .2) });
          tagText(K, '$299', 60, { size: 180, color: '#c58a00', scale: popIn(K, t, at('599') + .8) });
          if (t > tw) K.text('WIN!', { y: 260, size: 120, color: 'gold', scale: popIn(K, t, tw), rot: -.08 }); break; }
        case '299': { tagText(K, '$299', 0, { size: 190, color: '#6a6a6a', scale: 1 - .03 * K.ease(Lc / 2) });
          K.text('...just a TV', { y: 260, size: 84, scale: popIn(K, t, wordAt(K, 'tv', '299')) }); break; }
        case 'end': case 'mirror': case 'cta': {
          // outside: Gary still dancing by the balloons, Doug walks out with the TV box and stops
          K.placeAt('gary', 720, 1010, -.2); face(G, 'happy', t); dance(G, t, 0, id === 'cta' ? .6 : 1);
          const u = id === 'end' ? K.clamp01(Lc / 1.3) : 1, [x0, z0] = K.floorAt(470, 900), [x1, z1] = K.floorAt(330, 1020);
          const d = K.place('doug', K.lerp(x0, x1, u), 0, K.lerp(z0, z1, u), u < 1 ? -.3 : .35);
          // THE HELICOPTER ENDING (PLAYBOOK §1.12a): crosses the sky on the mirror line; Doug, who "won" his deal, looks up
          const hu = id === 'end' ? -1 : K.helicopter(t, 'mirror', { y: 260, w: 540 }), up = hu < 0 ? 0 : Math.sin(PI * K.clamp01((hu - .05) / .85));
          face(D, up > .3 ? 'flat' : id === 'cta' ? 'smirk' : 'smile', t);
          D.pose({ t, walk: Lc * 1.3, walkAmt: id === 'end' ? 1 - u : 0, nod: -.4 * up, armR: { raise: .2, fwd: -.85 }, armL: { raise: .2, fwd: -.85 }, handR: 'open', handL: 'open',
            gesture: id === 'cta' && up < .2 ? 'shrug' : undefined, gw: id === 'cta' ? K.ease(Lc / .4) * (1 - up) : 0 });
          if (!(id === 'cta' && up < .2 && Lc > .3)) { const h = K.screenOf(d.arm[1].wr), s = K.imgScale(); K.prop('P01', { x: h.x - 35, y: h.y + 10, w: 190 * s / 1.25 }); }
          if (id === 'cta') { G.pose({ t, gesture: 'point', gw: K.ease((Lc - .3) / .35) }); face(G, 'smirk', t, 1); }
          break; }
      }
    },
  };
})();
