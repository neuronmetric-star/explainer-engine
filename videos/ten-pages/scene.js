// ten-pages: Doug's bedroom plates + book props + Doug. See shotlist.md for the plan.
// Positions: feet via K.placeAt(painting px); props in screen px (y down); painting coords via K.img(ix,iy).
(function () {
  const face = (ch, name, t, off = 0) => ch.face(((t + off) % 4.1) < .12 && name !== 'happy' ? 'blink' : name);
  const WORDS = window.VIDEO_DATA.words;
  const norm = w => w.toLowerCase().replace(/[^a-z0-9]/g, '');
  const wordAt = (K, w, cue) => { const t0 = K.T(cue); const x = WORDS.find(o => o.start >= t0 - .01 && norm(o.w) === w); return x ? x.start : t0; };
  const popIn = (K, t, from, dur = .35) => K.pop(K.clamp01((t - from) / dur));
  // a prop held in both hands, in front of the chest
  function held(K, ch, key, w, dy = 0) { const a = K.screenOf(ch.arm[1].wr), b = K.screenOf(ch.arm[-1].wr);
    K.prop(key, { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 + dy, w, layer: 'front' }); }
  // a prop standing on the painted floor next to a point (anchor at its bottom)
  function onFloor(K, key, ix, iy, wImg, s = 1, o = {}) { const p = K.img(ix, iy);
    K.prop(key, Object.assign({ x: p.x, y: p.y, w: wImg * K.imgScale() * s, anchor: [.5, .86] }, o)); }

  const ROOM = { key: [0xffc888, 2.0, [12, 6, 4]], hemi: [0x9c90e8, 0x6a4a5a, 1.0], front: [0xe0d4ff, 1.0], shadow: [0x24164a, .42] };
  const MORN = { key: [0xffd49a, 2.6, [12, 7, -2]], hemi: [0xd0c8ff, 0xd09a70, .9], front: [0xffeadb, 1.05], shadow: [0x4a2a5a, .38] };

  window.SCENE = {
    plates: {
      '01': { img: '01_bedroom_wide_night.png', hz: .22, vx: .5, fov0: 55, camH: 2.6, light: ROOM },
      '02': { img: '02_dresser_charger_night.png', hz: .30, vx: .5, fov0: 55, camH: 2.2, light: ROOM },
      '03': { img: '03_reading_chair_night.png', hz: .30, vx: .5, fov0: 55, camH: 2.3, light: ROOM },
      '04': { img: '04_bookshelf_night.png', hz: .32, vx: .5, fov0: 55, camH: 2.2, light: ROOM },
      '05': { img: '05_bedroom_wide_morning.png', hz: .22, vx: .5, fov0: 55, camH: 2.6, light: MORN },
      '06': { img: '06_desk_top_day.png', light: 'interior' },
    },
    props: { P01: 'P01_book_closed.png', P02: 'P02_book_open.png', P03: 'P03_bookmark.png', P04: 'P04_book_stack_12.png',
      P05: 'P05_giant_book.png', P06: 'P06_timer_5min.png', P07: 'P07_calendar_grid.png', P08: 'P08_page_stack.png' },
    cast: { doug: 'hoodie' },
    shots: [
      { at: 'q', plate: '01', zoom: [1.0, 1.12], focus: [[.5, .58], [.46, .62]] },
      { at: 'tonight', plate: '06', zoom: [1.0, 1.08], focus: [[.5, .55], [.5, .55]] },
      { at: 'notfifty', plate: '01', zoom: [1.25, 1.3], focus: [[.58, .62], [.58, .62]] },
      { at: 'week', plate: '06', zoom: [1.05, 1.05], focus: [[.4, .55], [.6, .55]] },
      { at: 'month', plate: '06', zoom: [1.0, 1.12], focus: [[.5, .55], [.5, .52]] },
      { at: 'year', plate: '05', zoom: [1.0, 1.08], focus: [[.45, .55], [.55, .55]] },
      { at: 'total', plate: '06', zoom: [1.0, 1.0], focus: [[.5, .55], [.5, .55]] },
      { at: 'books', plate: '01', zoom: [1.2, 1.25], focus: [[.58, .6], [.58, .6]] },
      { at: 'how', plate: '03', zoom: [1.0, 1.08], focus: [[.5, .6], [.48, .62]] },
      { at: 'promise', plate: '03', zoom: [1.35, 1.45], focus: [[.42, .55], [.42, .53]] },
      { at: 'five', plate: '06', zoom: [1.0, 1.06], focus: [[.5, .55], [.5, .55]] },
      { at: 'phone', plate: '02', zoom: [1.1, 1.18], focus: [[.5, .6], [.52, .6]] },
      { at: 'leave', plate: '02', zoom: [1.18, 1.18], focus: [[.52, .6], [.42, .6]] },
      { at: 'across', plate: '01', zoom: [1.12, 1.0], focus: [[.55, .5], [.5, .5]] },
      { at: 'pick', plate: '04', zoom: [1.0, 1.15], focus: [[.5, .5], [.5, .45]] },
      { at: 'give', plate: '03', zoom: [1.1, 1.18], focus: [[.48, .58], [.46, .58]] },
      { at: 'halfway', plate: '03', zoom: [1.4, 1.5], focus: [[.42, .56], [.42, .55]] },
      { at: 'next', plate: '06', zoom: [1.1, 1.1], focus: [[.5, .55], [.5, .55]] },
      { at: 'turn', plate: '03', zoom: [1.45, 1.5], focus: [[.42, .56], [.42, .56]] },
      { at: 'three', plate: '03', zoom: [1.15, 1.2], focus: [[.46, .58], [.46, .58]] },
      { at: 'bookmark', plate: '06', zoom: [1.0, 1.1], focus: [[.5, .55], [.5, .52]] },
      { at: 'four', plate: '05', zoom: [1.0, 1.06], focus: [[.45, .62], [.42, .64]] },
      { at: 'pressure', plate: '06', zoom: [1.05, 1.05], focus: [[.5, .55], [.55, .55]] },
      { at: 'trick', plate: '01', zoom: [1.05, 1.22], focus: [[.45, .62], [.35, .68]] },
      { at: 'cta', plate: '01', zoom: [1.0, 1.04], focus: [[.5, .5], [.5, .5]] },
    ],
    shakes: [['notfifty+0.25', .3, .5], ['next+0.2', .5, .35], ['books+0.1', .2, .25]],
    flashes: [],
    follow: { from: 'cta+0.3', top: 300 },
    tail: 2.6,

    update(t, K) {
      const D = K.cast.doug, id = K.shot.id, L = K.shot.local, at = c => K.T(c);
      const W = K.W, H = K.H;
      switch (id) {
        case 'q': { K.placeAt('doug', 640, 950, -.35); face(D, 'worried', t); D.pose({ t, look: -.55, nod: .18, tilt: K.ease((L - 1.5) / .5) * .15 }); break; }
        case 'tonight': K.prop('P01', { x: W / 2, y: H * .5, w: 620 * popIn(K, t, at('tonight')) }); break;
        case 'notfifty': {
          K.placeAt('doug', 560, 1060, .25);
          const th = wordAt(K, 'hundred', 'notfifty'), tf = wordAt(K, 'fifty', 'notfifty'), tt = wordAt(K, 'ten', 'notfifty');
          if (t < tt) { const s = t < tf ? 1 : .62; onFloor(K, 'P05', 790, 1085, 430, s * popIn(K, t, t < tf ? th : tf, .25)); }
          else onFloor(K, 'P01', 790, 1085, 190, popIn(K, t, tt));
          face(D, t < tt ? 'surprised' : 'smirk', t); D.pose({ t, look: .6, lean: t < tt ? -.08 : 0, gesture: t < tt ? null : 'point', gw: K.ease((t - tt - .2) / .3) }); break; }
        case 'week': { // seven nights, seven little stacks
          for (let i = 0; i < 7; i++) { const tp = at('week') + .25 + i * .3, r = i < 4 ? 0 : 1, c = i < 4 ? i : i - 4;
            K.prop('P08', { x: 210 + c * 220 + r * 110, y: 760 + r * 330, w: 300 * popIn(K, t, tp) }); } break; }
        case 'month': {
          const t0 = at('month'), tb = wordAt(K, 'book', 'month'), cw = 860, ch = cw * K.propInfo('P07').ih / K.propInfo('P07').iw;
          K.prop('P07', { x: W / 2, y: H * .5, w: cw * popIn(K, t, t0) });
          // grid: 6 cols x 5 rows inside the paper (image px 82..942 x 525..1135 of 1024x1536)
          const sx = cw / 1024, gx = W / 2 - cw / 2, gy = H * .5 - ch / 2;
          for (let i = 0; i < 30; i++) { const c = i % 6, r = Math.floor(i / 6), tp = t0 + .3 + i * ((tb - t0 - .5) / 30);
            K.prop('P08', { x: gx + (82 + 143 * (c + .5)) * sx, y: gy + (525 + 122 * (r + .5)) * sx, w: 120 * popIn(K, t, tp, .2) }); }
          K.prop('P01', { x: W / 2, y: H * .5, w: 520 * popIn(K, t, tb, .3) }); break; }
        case 'year': { K.placeAt('doug', 640, 940, -.2); face(D, 'smile', t); D.pose({ t, gesture: 'think', gw: K.ease((L - .2) / .4), look: .3 }); break; }
        case 'total': { // pages pile into a tower
          const n = Math.floor(K.clamp01(L / 2.3) * 26);
          for (let i = 0; i <= n; i++) K.prop('P08', { x: W / 2 + Math.sin(i * 1.7) * 18, y: 1130 - i * 32, w: 380 });
          break; }
        case 'books': {
          K.placeAt('doug', 560, 1080, .2); onFloor(K, 'P04', 800, 1080, 330, popIn(K, t, at('books') + .05, .3));
          face(D, 'happy', t); D.pose({ t, gesture: 'tada', gw: K.ease((L - .25) / .3) }); break; }
        case 'how': { const u = K.easeOut(K.clamp01(L / 1.6)), ix = K.lerp(-60, 330, u);
          K.placeAt('doug', ix, 950, u < 1 ? 1.3 * (1 - u) : 0); face(D, 'flat', t);
          D.pose({ t, walk: L * 1.6, walkAmt: 1 - K.ease((L - 1.2) / .4), gesture: 'shrug', gw: K.ease((L - 2.0) / .3) }); break; }
        case 'promise': { K.placeAt('doug', 330, 950, .15); face(D, L < .8 ? 'flat' : 'smile', t); D.pose({ t, nod: L > .8 ? Math.sin((L - .8) * 9) * .08 * (1 - K.clamp01((L - 1.6) / .5)) : 0 }); break; }
        case 'five': { const tp = at('five'); K.prop('P06', { x: W / 2, y: H * .5, w: 640 * popIn(K, t, tp), rot: Math.sin(t * 14) * .02 }); break; }
        case 'phone': { K.placeAt('doug', 700, 1000, -.6); face(D, 'flat', t);
          D.pose({ t, look: -.35, nod: .25, armL: { raise: .9 * K.ease((L - .3) / .5) } }); break; }
        case 'leave': { const u = K.clamp01((L - .25) / .75); K.placeAt('doug', K.lerp(700, 200, u), 1000, -1.4 * K.ease(L / .3)); face(D, 'smirk', t);
          D.pose({ t, walk: L * 1.7, walkAmt: K.ease(L / .3) }); break; }
        case 'across': { const u = K.clamp01(L / 2.1); K.placeAt('doug', K.lerp(450, 700, u), K.lerp(840, 920, u), 1.0); face(D, 'smile', t);
          D.pose({ t, walk: L * 1.7, walkAmt: 1 - K.ease((L - 1.9) / .3) }); break; }
        case 'pick': { K.placeAt('doug', 330, 1290, .55); face(D, 'smile', t);
          const tu = wordAt(K, 'understand', 'pick');
          D.pose({ t, look: .35, nod: -.15, gesture: t < tu ? 'point' : null, gw: K.ease((L - .3) / .3), armR: t < tu ? null : { raise: .8 } }); break; }
        case 'give': { K.placeAt('doug', 360, 950, .15); face(D, 'smile', t); D.pose({ t, gesture: 'hold', gw: 1, nod: .25 });
          held(K, D, 'P02', 230); onFloor(K, 'P06', 890, 742, 110, popIn(K, t, at('give') + .3)); break; }
        case 'halfway': { K.placeAt('doug', 360, 950, .15); face(D, 'surprised', t); D.pose({ t, gesture: 'hold', gw: 1, nod: .3, lean: .1 * K.ease(L / 1.5) }); held(K, D, 'P02', 230); break; }
        case 'next': { const ring = Math.sin(t * 60) * .06; K.prop('P06', { x: W / 2, y: H * .5, w: 640, rot: ring }); break; }
        case 'turn': { K.placeAt('doug', 360, 950, .15); face(D, 'smirk', t); D.pose({ t, gesture: 'hold', gw: 1, nod: .3 }); held(K, D, 'P02', 230); break; }
        case 'three': { K.placeAt('doug', 360, 950, .15); face(D, L < 1.0 ? 'blink' : 'flat', t); D.pose({ t, gesture: 'hold', gw: 1, nod: .3, tilt: .14 * K.ease((L - .4) / .5) }); held(K, D, 'P02', 230); break; }
        case 'bookmark': { const t0 = at('bookmark'), u = K.easeOut(K.clamp01((t - t0 - .15) / .7));
          K.prop('P02', { x: W / 2, y: H * .55, w: 900 });
          K.prop('P03', { x: W / 2 + 230, y: K.lerp(-300, H * .55 - 40, u), w: 330, rot: .1 }); break; }
        case 'four': { K.placeAt('doug', 560, 940, -.9); face(D, 'smile', t); D.pose({ t, look: 0, nod: .2, gesture: 'point', gw: K.ease((L - .4) / .3) }); break; }
        case 'pressure': { const u = K.ease(K.clamp01((L - .4) / 1.4)); K.prop('P05', { x: W / 2 + u * 1100, y: H * .52, w: 700, rot: u * .3 }); break; }
        case 'trick': { K.placeAt('doug', 600, 1070, -.35); face(D, 'smirk', t); D.pose({ t, gesture: 'cross', gw: K.ease((L - .3) / .4), look: -.2 }); break; }
        case 'cta': { K.placeAt('doug', 600, 950, .1); face(D, 'smirk', t); D.pose({ t, look: 0, nod: -.3, armR: { raise: .95 * K.ease((L - .6) / .3) } }); break; }
      }
    },
  };
})();
