// dollar-a-second: $30M now vs $1 every second for a year. Plates + props + Doug, Gary, Victor. Plan: shotlist.md.
// World units: feet at y=0, camera at (0, camH, 0) looking down -z. Props + text in screen px (y down).
// Every number on screen is K.text (the paintings carry no text).
(function () {
  const PI = Math.PI;
  const face = (ch, name, t, off = 0) => ch.face(((t + off) % 4.1) < .12 && name !== 'happy' ? 'blink' : name);
  const popIn = (K, t, from, dur = .35) => K.pop(K.clamp01((t - from) / dur));
  const WORDS = window.VIDEO_DATA.words, norm = w => w.toLowerCase().replace(/[^a-z0-9]/g, '');
  const wordAt = (K, w, cue) => { const t0 = K.T(cue); const x = WORDS.find(o => o.start >= t0 - .01 && norm(o.w) === w); return x ? x.start : t0; };
  const money = n => '$' + Math.floor(n).toLocaleString('en-US');

  const L = {
    office: { key: [0xffc080, 2.3, [-12, 6, 2]], hemi: [0xc8b4ff, 0x805060, .8], front: [0xffe2d2, 1.0], shadow: [0x3a2050, .4] },
    room: { key: [0xffb070, 2.1, [-10, 5, 3]], hemi: [0x9a88e0, 0x804830, .85], front: [0xffd8c8, .95], shadow: [0x2c1838, .42] },
    bank: { key: [0xffc27a, 2.1, [-12, 6, 1]], hemi: [0xb0a0e8, 0x705060, .85], front: [0xffe0d0, .95], shadow: [0x2a1a48, .42] },
  };

  // Gary's phone screen in 05_phone_table_closeup.png (painting px): center, and the screen's lean (skew)
  const SCREEN = { ix: 515, iy: 755, skew: 12 };
  function phoneCounter(K, value, o = {}) {
    const p = K.img(SCREEN.ix, SCREEN.iy), s = K.imgScale() / 1.25;
    const big = money(value);
    K.text(big, { x: p.x, y: p.y - 30 * s, size: (big.length > 11 ? 92 : big.length > 9 ? 108 : 128) * s * (o.punch || 1), color: o.color || '#14325a', stroke: 0, shadow: false, skewX: SCREEN.skew, w: 900 });
    K.text('+ $1 every second', { x: p.x + 40 * s, y: p.y + 120 * s, size: 44 * s, color: '#14325a', stroke: 0, shadow: false, skewX: SCREEN.skew, a: .75, w: 900 });
  }
  // whiteboard in 04_apartment_whiteboard.png: inner area x 485..990, y 345..680
  const BOARD = { ix: 737, iy: 512 };
  const boardText = (K, str, dy, o = {}) => { const p = K.img(BOARD.ix, BOARD.iy + dy), s = K.imgScale() / 1.25;
    return K.text(str, Object.assign({ x: p.x, y: p.y, size: 58 * s, color: '#1c2a4a', font: 'marker', w: 1000 }, o, { size: (o.size || 58) * s })); };

  window.SCENE = {
    plates: {
      '01': { img: '01_penthouse_office_day.png', hz: .42, vx: .5, fov0: 55, camH: 1.6, light: L.office },
      '02': { img: '02_marina_dock_day.png', hz: .455, vx: .5, fov0: 55, camH: 1.55, light: 'day' },
      '03': { img: '03_marina_dock_yacht.png', hz: .455, vx: .5, fov0: 55, camH: 1.55, light: 'day' },
      '04': { img: '04_apartment_whiteboard.png', hz: .43, vx: .55, fov0: 55, camH: 1.5, light: L.room },
      '05': { img: '05_phone_table_closeup.png', hz: .5, vx: .5, fov0: 55, camH: 1.5, light: L.room },
      '06': { img: '06_bank_lobby_day.png', hz: .47, vx: .5, fov0: 55, camH: 1.7, light: L.bank },
    },
    props: { P01: 'P01_phone_blank.png', P02: 'P02_cash_pile.cut.png', P03: 'P03_dollar_bill.cut.png', P04: 'P04_chips_bag.png',
      P05: 'P05_wall_clock.png', P06: 'P06_calendar_page.png', H01: 'H01_helicopter.png' },
    cast: { doug: 'hoodie', gary: { outfit: 'oxford', phone: true }, victor: 'suit' },
    shots: [
      { at: 'q', plate: '01', zoom: [1.0, 1.12], focus: [[.5, .5], [.5, .53]] },
      { at: 'card', plate: '01', zoom: [1.55, 1.65], focus: [[.33, .6], [.33, .6]] },
      { at: 'victor', plate: '01', zoom: [1.6, 1.6], focus: [[.56, .52], [.6, .52]] },
      { at: 'grab', plate: '01', zoom: [1.3, 1.38], focus: [[.38, .58], [.36, .58]] },
      { at: 'gary', plate: '01', zoom: [1.55, 1.62], focus: [[.7, .58], [.7, .57]] },
      { at: 'bet', plate: '01', zoom: [1.3, 1.4], focus: [[.6, .5], [.62, .5]] },
      { at: 'phone', plate: '05', zoom: [1.0, 1.1], focus: [[.5, .5], [.5, .49]] },
      { at: 'day1', plate: '05', zoom: [1.15, 1.25], focus: [[.5, .48], [.5, .48]] },
      { at: 'seconds', plate: '05', zoom: [1.05, 1.0], focus: [[.5, .5], [.5, .5]] },
      { at: 'boat', plate: '02', zoom: [1.15, 1.25], focus: [[.45, .6], [.47, .6]] },
      { at: 'day12', plate: '04', zoom: [1.0, 1.1], focus: [[.5, .6], [.58, .6]] },
      { at: 'million', plate: '05', zoom: [1.25, 1.4], focus: [[.5, .48], [.5, .48]] },
      { at: 'math', plate: '04', zoom: [1.15, 1.3], focus: [[.6, .5], [.66, .45]] },
      { at: 'chain', plate: '04', zoom: [1.25, 1.32], focus: [[.66, .38], [.7, .37]] },
      { at: 'total', plate: '04', zoom: [1.3, 1.38], focus: [[.7, .38], [.7, .37]] },
      { at: 'ahead', plate: '04', zoom: [1.05, 1.12], focus: [[.6, .6], [.6, .6]] },
      { at: 'wait', plate: '06', zoom: [1.0, 1.1], focus: [[.45, .6], [.5, .6]] },
      { at: 'interest', plate: '06', zoom: [1.2, 1.3], focus: [[.45, .62], [.45, .6]] },
      { at: 'dougbank', plate: '06', zoom: [1.12, 1.18], focus: [[.42, .64], [.42, .64]] },
      { at: 'gary2', plate: '06', zoom: [1.1, 1.15], focus: [[.52, .58], [.5, .57]] },
      { at: 'close', plate: '06', zoom: [1.05, 1.15], focus: [[.5, .62], [.5, .6]] },
      { at: 'reveal', plate: '05', zoom: [1.0, 1.15], focus: [[.5, .5], [.5, .48]] },
      { at: 'end', plate: '02', zoom: [1.2, 1.3], focus: [[.4, .6], [.5, .6]] },
      { at: 'end+1.79', plate: '03', zoom: [1.0, 1.04], focus: [[.55, .47], [.55, .47]] },   // hard cut on "Gary's is bigger"
      { at: 'cta', plate: '03', zoom: [1.04, 1.04], focus: [[.55, .47], [.55, .47]] },
    ],
    shakes: [['grab', .25, .5], ['million', .25, .45], ['total', .25, .4]],
    flashes: [],
    follow: { from: 'cta+0.3' },
    tail: 1.6,

    update(t, K) {
      const id = K.shot.id, Lc = K.shot.local, at = c => K.T(c);
      const D = K.cast.doug, G = K.cast.gary, V = K.cast.victor;
      // office spots: Victor in front of the desk, Doug left, Gary right
      const office = () => { K.placeAt('victor', 530, 880, 0); K.placeAt('doug', 340, 985, .35); K.placeAt('gary', 720, 985, -.35); };
      const cashOffice = (u = 0) => { const a = K.img(K.lerp(235, 215, u), K.lerp(880, 1000, u)); K.prop('P02', { x: a.x, y: a.y, w: 230 * K.imgScale() * K.lerp(.8, 1, u), anchor: [.5, 1], layer: u > .5 ? 'front' : 'back' }); };
      switch (id) {
        case 'q': { office(); cashOffice(0);
          face(V, 'smirk', t, 2); V.pose({ t, gesture: 'hips', gw: 1 });
          face(D, 'flat', t); D.pose({ t, look: .25 }); face(G, 'flat', t, 1); G.pose({ t, look: -.25, armR: { raise: .45 } });
          { const p = K.img(780, 860); K.prop('P01', { x: p.x, y: p.y, w: 170 * K.imgScale() * popIn(K, t, at('q') + 1.9) });
            if (t > at('q') + 2.0) K.text('$1', { x: p.x, y: p.y, size: 70, color: '#14325a', stroke: 0, shadow: false }); }
          const a = K.clamp01((at('card') - t) / .2);
          K.text('$30 MILLION NOW', { y: 300, size: 100, a, scale: .8 + .2 * popIn(K, t, at('q')) });
          K.text('or $1 EVERY SECOND?', { y: 420, size: 86, color: 'gold', a, scale: .8 + .2 * popIn(K, t, at('q') + 1.5) });
          break; }
        case 'card': { office(); cashOffice(0); face(D, 'worried', t); D.pose({ t, gesture: 'think', gw: K.ease(Lc / .4) }); V.pose({ t }); G.pose({ t }); break; }
        case 'victor': { office(); cashOffice(0); face(V, 'smirk', t, 2);
          const side = Lc < 1.0 ? 0 : 1; V.pose({ t, gesture: 'point', gw: 1, look: side ? -.45 : .45 }); D.pose({ t, look: .3 }); G.pose({ t, look: -.3 }); break; }
        case 'grab': { office(); const u = K.easeOut((t - wordAt(K, 'grabbed', 'grab')) / .5); cashOffice(u);
          face(D, 'happy', t); D.pose({ t, armR: { raise: .9 * u }, lean: .08 * u }); face(V, 'smirk', t, 2); V.pose({ t }); G.pose({ t }); break; }
        case 'gary': { office(); cashOffice(1); face(G, 'flat', t, 1); G.pose({ t, nod: .15 * Math.sin(K.clamp01(Lc / .5) * PI), armR: { raise: .45 } });
          const h = K.screenOf(G.head); K.prop('P03', { x: h.x, y: h.y - 270, w: 230 * popIn(K, t, at('gary') + .2), rot: -.06 }); face(D, 'smirk', t); D.pose({ t }); break; }
        case 'bet': { office(); cashOffice(1); face(G, 'blink', t); G.pose({ t, armR: { raise: .45 } }); face(D, 'smirk', t); D.pose({ t, gesture: 'hips', gw: 1 });
          K.prop('P03', { x: 380, y: 330, w: 300, rot: -.06 }); K.prop('P04', { x: 740, y: 330, w: 250 * popIn(K, t, wordAt(K, 'bag', 'bet')), rot: .05 });
          if (t > wordAt(K, 'bag', 'bet')) K.text('=', { x: 565, y: 330, size: 120 }); break; }
        case 'phone': { const n = 1 + Math.floor(Lc); phoneCounter(K, n, { color: (Lc % 1) < .18 ? '#b8860b' : undefined, punch: 1 + .06 * Math.max(0, 1 - (Lc % 1) / .18) }); break; }
        case 'day1': { const tl = wordAt(K, 'eightysix', 'day1'), u = K.clamp01((t - at('day1')) / Math.max(.3, tl - at('day1')));
          phoneCounter(K, u < 1 ? 86400 * u * u : 86400, { color: u >= 1 ? '#b8860b' : undefined, punch: u >= 1 ? 1 + .1 * Math.max(0, 1 - (t - tl) / .3) : 1 }); break; }
        case 'seconds': { phoneCounter(K, 86400, { color: '#b8860b' });
          K.prop('P05', { x: 250, y: 330, w: 300 * popIn(K, t, at('seconds')), rot: Math.sin(Lc * 9) * .04 });
          K.text('86,400 seconds', { x: 690, y: 290, size: 72, color: 'gold', scale: popIn(K, t, at('seconds') + .3) });
          K.text('= 1 day', { x: 690, y: 380, size: 72, scale: popIn(K, t, at('seconds') + .6) }); break; }
        case 'boat': { const d = K.placeAt('doug', 560, 1045, -.2); face(D, 'happy', t); D.pose({ t, gesture: 'tada', gw: K.ease(Lc / .35) });
          K.text('DAY 1', { x: 540, y: 250, size: 70, a: .9 }); break; }
        case 'day12': { K.placeAt('gary', 880, 1080, -.45); face(G, 'flat', t, 1); G.pose({ t, armR: { raise: .5 }, nod: .25 });
          const u = K.clamp01(Lc / 1.3), [x0, z0] = K.floorAt(330, 1060), [x1, z1] = K.floorAt(600, 1080);
          K.place('doug', K.lerp(x0, x1, u), 0, K.lerp(z0, z1, u), u < 1 ? PI / 2 - .3 : -.5);
          face(D, u < 1 ? 'flat' : 'smile', t); D.pose({ t, walk: Lc * 1.4, walkAmt: 1 - u, lean: u >= 1 ? .1 : 0, look: u >= 1 ? -.3 : 0 });
          K.text('DAY 12', { x: 540, y: 250, size: 70, a: .9 }); break; }
        case 'million': { const tl = wordAt(K, 'one', 'million'); phoneCounter(K, t < tl ? 999990 + Math.floor((t - at('million')) * 30) : 1000000, { color: t >= tl ? '#b8860b' : undefined, punch: t >= tl ? 1 + .1 * Math.max(0, 1 - (t - tl) / .3) : 1 }); break; }
        case 'math': case 'chain': case 'total': {
          K.placeAt('doug', 420, 1030, .7); face(D, id === 'total' ? 'surprised' : 'flat', t);
          D.pose({ t, gesture: id === 'math' ? 'think' : id === 'chain' ? 'point' : 'shrug', gw: K.ease((t - at(id)) / .35), look: id === 'total' ? -.3 : .2 });
          const terms = [['60', 'sixty', 'chain'], ['× 60', 'sixty', 'chain+1.0'], ['× 24', 'twentyfour', 'chain'], ['× 365', 'three', 'chain']];
          let line = '';
          terms.forEach(([s, w, c], i) => { const tw = i === 1 ? wordAt(K, 'sixty', 'chain+1.0') : wordAt(K, w, c); if (t >= tw) line += (line ? ' ' : '') + s; });
          if (line) boardText(K, line, -70);
          const sub = []; if (t >= wordAt(K, 'seconds', 'chain')) sub.push('sec'); if (t >= wordAt(K, 'minutes', 'chain')) sub.push('min'); if (t >= wordAt(K, 'hours', 'chain')) sub.push('hrs'); if (t >= wordAt(K, 'days', 'chain')) sub.push('days');
          if (sub.length) boardText(K, sub.join('    '), 5, { size: 36, a: .7 });
          if (id === 'chain') { const tc = wordAt(K, 'seconds', 'chain'), tk = wordAt(K, 'days', 'chain');
            K.prop('P05', { x: 150, y: 330, w: 210 * popIn(K, t, tc), rot: -.05 }); if (t > tk - .4) K.prop('P06', { x: 160, y: 560, w: 280 * popIn(K, t, tk - .4), rot: .05 }); }
          if (id === 'total') boardText(K, '= 31,536,000', 95, { size: 74, color: 'gold', font: 'sans', stroke: 10, scale: .7 + .3 * popIn(K, t, at('total')) });
          break; }
        case 'ahead': { K.placeAt('gary', 880, 1080, -.45); K.placeAt('doug', 560, 1070, .5);
          face(G, 'smirk', t, 1); G.pose({ t, gesture: 'cross', gw: K.ease(Lc / .4) }); face(D, 'worried', t); D.pose({ t, gesture: 'facepalm', gw: K.ease((Lc - .3) / .4) });
          const p = K.screenOf(G.head); K.text('+$1.5 MILLION', { x: Math.min(700, p.x), y: p.y - 200, size: 70, color: 'gold', scale: popIn(K, t, at('ahead') + .5) }); break; }
        case 'wait': { const u = K.clamp01(Lc / 2.0), [x0, z0] = K.floorAt(80, 1150), [x1, z1] = K.floorAt(420, 1150);
          K.place('doug', K.lerp(x0, x1, u), 0, K.lerp(z0, z1, u), u < 1 ? PI / 2 : .2); face(D, 'smile', t); D.pose({ t, walk: Lc * 1.4, walkAmt: 1 - u });
          const f = K.screenOf(D.root); K.prop('P02', { x: f.x + 150, y: f.y, w: 260, anchor: [.5, 1] }); break; }
        case 'interest': case 'dougbank': {
          const dg = K.placeAt('doug', 420, 1150, .2), f = K.screenOf(dg.root), grow = id === 'dougbank' ? 1 + .12 * K.ease((Lc - .6) / .8) : 1;
          K.prop('P02', { x: f.x + 150, y: f.y, w: 260 * grow, anchor: [.5, 1] });
          face(D, id === 'interest' ? 'happy' : 'happy', t); D.pose({ t, gesture: id === 'dougbank' ? 'tada' : undefined, gw: K.ease(Lc / .35), nod: id === 'interest' ? .15 : 0 });
          if (id === 'interest') { const tw = wordAt(K, 'interest', 'interest'); K.text('4% a year', { y: 240, size: 96, color: 'gold', scale: popIn(K, t, wordAt(K, 'four', 'interest')) });
            if (t > tw) K.text('= INTEREST', { y: 345, size: 70, scale: popIn(K, t, tw) }); }
          else { K.text('DOUG', { y: 220, size: 60 }); K.text('$30M → $31.2M', { y: 320, size: 92, scale: popIn(K, t, wordAt(K, 'one', 'dougbank')) }); }
          break; }
        case 'gary2': case 'close': {
          const dg = K.placeAt('doug', 330, 1170, .25), gy = K.placeAt('gary', 690, 1120, -.3), f = K.screenOf(dg.root);
          K.prop('P02', { x: f.x + 150, y: f.y, w: 260 * 1.12, anchor: [.5, 1] });
          face(G, id === 'close' ? 'smirk' : 'flat', t, 1); G.pose({ t, armR: { raise: .5 }, nod: .1 * Math.sin(t * 3) });
          face(D, id === 'close' ? 'worried' : 'flat', t); D.pose({ t, look: -.35 });
          // dollars fly from Gary's phone into the vault, two a second
          const h = K.screenOf(gy.head), v = K.img(512, 640);
          for (let k = 0; k < 4; k++) { const ph = ((t * 2 + k / 4 * 2) % 2) / 2; if (ph > .99) continue;
            K.prop('P03', { x: K.lerp(h.x + 110, v.x, ph), y: K.lerp(h.y + 260, v.y, ph) - Math.sin(ph * PI) * 50, w: 120 * (1 - .5 * ph), rot: ph * 4 + k, a: 1 - Math.max(0, ph - .8) * 5 }); }
          if (id === 'close') { const s = popIn(K, t, at('close') + .2);
            K.text('DOUG  $31.2M', { x: 290, y: 260, size: 64, scale: s, w: 600 });
            K.text('GARY  $32.2M', { x: 780, y: 260, size: 64, color: 'gold', scale: popIn(K, t, wordAt(K, 'million', 'close')), w: 600 }); }
          break; }
        case 'reveal': { const end = wordAt(K, 'seconds', 'reveal'); phoneCounter(K, 31536000 - Math.max(0, Math.ceil(end - t)),
            { color: t >= end ? '#b8860b' : undefined, punch: t >= end ? 1 + .1 * Math.max(0, 1 - (t - end) / .3) : 1 }); break; }
        case 'end': { K.placeAt('doug', 560, 1045, -.2); face(D, 'smile', t); D.pose({ t, gesture: 'hips', gw: 1 }); break; }
        case 'end+1.79': case 'cta': {
          K.placeAt('doug', 270, 1050, .3); K.placeAt('gary', 820, 1040, -.35);
          // THE HELICOPTER ENDING (PLAYBOOK §1.12a): it crosses the sky on "Gary's is bigger"; Gary, the winner, looks up
          const hu = K.helicopter(t, 'end+1.79', { y: 280, w: 420 }), up = hu < 0 ? 0 : Math.sin(Math.PI * K.clamp01((hu - .05) / .85));
          face(D, 'flat', t); D.pose({ t, look: -.5, nod: -.15 * up, gesture: id === 'cta' ? 'shrug' : undefined, gw: K.ease(Lc / .4) });
          face(G, up > .4 ? 'flat' : 'smirk', t, 1); G.pose({ t, nod: -.5 * up, gesture: id === 'cta' ? 'point' : 'wave', gw: K.ease((Lc - .2) / .35) * (1 - up * .7) }); break; }
      }
    },
  };
})();
