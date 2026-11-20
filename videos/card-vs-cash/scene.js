// card-vs-cash: auction-hall plates + Wan 3.0 480p clip plates + Doug (card), Gary (cash), Victor (auctioneer).
// Ends on the helicopter branding outro under the follow CTA. Plan: shotlist.md.
(function () {
  const PI = Math.PI;
  const face = (ch, name, t, off = 0) => ch.face(((t + off) % 4.1) < .12 && name !== 'happy' ? 'blink' : name);
  const L = {
    hall: { key: [0xffc080, 2.2, [-14, 6, 2]], hemi: [0xd8a8e0, 0x8a5040, .9], front: [0xffe0c8, 1.05], shadow: [0x4a2030, .32] },
    lab: { key: [0xffd8a8, 2.0, [-14, 7, 2]], hemi: [0xb8c0f0, 0x8a6a50, .9], front: [0xffeedd, 1.0], shadow: [0x3a3050, .3] },
    scan: { key: [0xd8e8ff, 1.6, [-10, 8, 4]], hemi: [0xb0c8ff, 0x7080a0, 1.0], front: [0xe8f0ff, 1.0], shadow: [0x203050, .28] },
    arena: { key: [0xfff0d0, 2.4, [0, 12, -20]], hemi: [0xa0b0ff, 0x8a6030, .9], front: [0xffe8d0, 1.1], shadow: [0x302010, .35] },
  };
  const P = (img, o) => Object.assign({ img, hz: .44, vx: .5, fov0: 55, camH: 1.6, light: L.hall }, o || {});

  window.SCENE = {
    plates: {
      '01': P('01_auction_hall_wide.png', { hz: .45 }),
      '02': P('02_bid_table_medium.png', { hz: .42 }),
      '03': P('03_mit_classroom.png', { hz: .47, light: L.lab }),
      '04': P('04_brain_scan_room.png', { hz: .44, light: L.scan }),
      '04c': P('04_brain_scan_room.png', { hz: .44, light: L.scan, clip: { dir: 'clips/scan', n: 150, fps: 30 } }),
      '05c': P('05_arena_tipoff.png', { hz: .54, light: L.arena, clip: { dir: 'clips/arena', n: 150, fps: 30, loop: 'hold' } }),
      'heli': P('X01_heli_first.png', { clip: { dir: 'clips/heli', n: 150, fps: 30, loop: 'hold' } }),
    },
    props: { R01: 'R01_credit_card.png', R02: 'R02_three_tens.cut.png', R03: 'R03_tickets.cut.png',
      P01: 'P01_slip_30.png', P02: 'P02_slip_60.png', P03: 'P03_bar_chart.cut.png', P04: 'P04_brain_glow.png', P05: 'P05_fries.png' },
    cast: { doug: 'hoodie', gary: 'oxford', victor: 'suit' },
    shots: [
      { at: 'q', plate: '01', zoom: [1.0, 1.1], focus: [[.5, .6], [.5, .6]] },
      { at: 'careful', plate: '01', zoom: [1.6, 1.68], focus: [[.38, .52], [.38, .52]] },
      { at: 'auction', plate: '01', zoom: [1.2, 1.0], focus: [[.6, .5], [.5, .55]] },
      { at: 'write', plate: '02', zoom: [1.0, 1.05], focus: [[.5, .55], [.5, .55]] },
      { at: 'highest', plate: '01', zoom: [2.2, 2.35], focus: [[.8, .33], [.8, .33]] },
      { at: 'catch', plate: '02', zoom: [1.5, 1.55], focus: [[.2, .55], [.2, .55]] },
      { at: 'card', plate: '02', zoom: [1.5, 1.55], focus: [[.8, .55], [.8, .55]] },
      { at: 'count', plate: '02', zoom: [1.5, 1.65], focus: [[.22, .55], [.22, .52]] },
      { at: 'wince', plate: '02', zoom: [2.2, 2.3], focus: [[.15, .45], [.15, .45]] },
      { at: 'thirty', plate: '02', zoom: [1.5, 1.55], focus: [[.45, .5], [.45, .5]] },
      { at: 'look', plate: '02', zoom: [1.5, 1.65], focus: [[.8, .52], [.8, .5]] },
      { at: 'sixty', plate: '02', zoom: [1.5, 1.55], focus: [[.55, .5], [.55, .5]] },
      { at: 'bet', plate: '01', zoom: [1.05, 1.1], focus: [[.5, .6], [.5, .6]] },
      { at: 'mit', plate: '03', zoom: [1.0, 1.12], focus: [[.5, .5], [.5, .45]] },
      { at: 'cashavg', plate: '03', zoom: [1.12, 1.12], focus: [[.5, .45], [.5, .45]] },
      { at: 'cardavg', plate: '03', zoom: [1.12, 1.18], focus: [[.5, .45], [.5, .45]] },
      { at: 'double', plate: '03', zoom: [1.35, 1.45], focus: [[.55, .42], [.55, .42]] },
      { at: 'same', plate: '01', zoom: [2.2, 2.3], focus: [[.8, .33], [.8, .33]] },
      { at: 'how', plate: '02', zoom: [1.5, 1.6], focus: [[.2, .52], [.2, .5]] },
      { at: 'bills', plate: '02', zoom: [1.6, 1.6], focus: [[.22, .5], [.22, .5]] },
      { at: 'pain', plate: '02', zoom: [1.9, 2.1], focus: [[.17, .45], [.17, .45]] },
      { at: 'tap', plate: '02', zoom: [1.5, 1.55], focus: [[.8, .52], [.8, .52]] },
      { at: 'later', plate: '02', zoom: [1.55, 1.6], focus: [[.8, .52], [.8, .52]] },
      { at: 'gas', plate: '04', zoom: [1.0, 1.08], focus: [[.5, .5], [.5, .48]] },
      { at: 'scan', plate: '04c', zoom: [1.08, 1.2], focus: [[.4, .4], [.4, .38]] },
      { at: 'reward', plate: '04c', zoom: [1.2, 1.25], focus: [[.5, .4], [.5, .4]], clipFrom: 3.1 },
      { at: 'fries', plate: '01', zoom: [1.6, 1.7], focus: [[.38, .52], [.38, .5]] },
      { at: 'bite', plate: '01', zoom: [1.75, 1.85], focus: [[.38, .48], [.38, .48]] },
      { at: 'tens', plate: '02', zoom: [1.5, 1.55], focus: [[.2, .52], [.2, .52]] },
      { at: 'tipoff', plate: '05c', zoom: [1.0, 1.06], focus: [[.5, .5], [.5, .48]] },
      { at: 'question', plate: '01', zoom: [1.05, 1.12], focus: [[.5, .6], [.5, .6]] },
      { at: 'would', plate: '02', zoom: [1.2, 1.25], focus: [[.5, .5], [.5, .5]] },
      { at: 'cta', plate: 'heli', zoom: [1.0, 1.0], focus: [[.5, .5], [.5, .5]] },
    ],
    shakes: [['sixty', .2, .4], ['cardavg', .25, .6]],
    flashes: [['cardavg', .12, .35], ['reward', .1, .25]],
    follow: { from: 'cta+0.4', y: 260 },
    tail: 2.0,

    update(t, K) {
      const id = K.shot.id, Lc = K.shot.local, at = c => K.T(c), e = K.ease, pop = (from, d = .3) => K.pop(K.clamp01((t - K.T(from)) / d));
      const D = K.cast.doug, G = K.cast.gary, V = K.cast.victor;
      // 01 aisle: Doug left, Gary right; 02 table: Gary left side, Doug right side
      const dougHall = (ry = .2) => K.placeAt('doug', 400, 1080, ry, .75), garyHall = (ry = -.2) => K.placeAt('gary', 640, 1080, ry, .75);
      const garyTab = (ry = .35) => K.placeAt('gary', 120, 1320, ry, .65), dougTab = (ry = -.35) => K.placeAt('doug', 905, 1320, ry, .65);
      const head = ch => K.screenOf(ch.head);
      const box = () => K.img(510, 760);   // slot of the bid box in 02
      switch (id) {
        case 'q': { const d = dougHall(); face(d, 'happy', t); d.pose({ t, gesture: 'tada', gw: e(Lc / .3) });
          const g = garyHall(); face(g, 'worried', t, 1); g.pose({ t, gesture: 'think', gw: e(Lc / .3) });
          const hd = head(d), hg = head(g);
          K.prop('P02', { x: hd.x, y: hd.y - 210, w: 300 * pop('q+0.4'), rot: -.06 }); K.prop('P01', { x: hg.x, y: hg.y - 210, w: 300 * pop('q+0.9'), rot: .06 }); break; }
        case 'careful': { const d = dougHall(.1); face(d, 'smirk', t); d.pose({ t, gesture: 'hips', gw: e(Lc / .3), nod: Math.sin(t * 6) * .04 }); garyHall(); G.pose({ t }); break; }
        case 'auction': { const v = K.placeAt('victor', 520, 1010, -.3, .75); face(v, 'smile', t); v.pose({ t, gesture: 'point', gw: e((Lc - .4) / .3), look: .5 });
          const d = K.placeAt('doug', 300, 1130, .5, .75); face(d, 'smile', t); d.pose({ t, look: .3 }); const g = K.placeAt('gary', 740, 1130, -.4, .75); face(g, 'flat', t, 1); g.pose({ t, look: -.2 }); break; }
        case 'write': { const g = garyTab(.6); face(g, 'flat', t, 1); g.pose({ t, look: .4, nod: .25 }); const d = dougTab(-.6); face(d, 'smile', t); d.pose({ t, look: -.4, nod: .25 }); break; }
        case 'highest': case 'same': break;   // the tickets on the easel
        case 'catch': { const g = garyTab(); face(g, 'flat', t, 1); g.pose({ t, armR: { raise: .3 } }); const h = head(g); K.prop('R02', { x: h.x + 260, y: h.y + 300, w: 380 * pop('catch+0.3') }); break; }
        case 'card': { const d = dougTab(); face(d, 'happy', t); d.pose({ t, gesture: 'point', gw: e((Lc - .3) / .3), look: .3 });
          const h = head(d); K.prop('R01', { x: h.x - 280, y: h.y + 300, w: 360 * pop('card+0.2'), rot: -.1 }); break; }
        case 'count': { const g = garyTab(); face(g, 'flat', t, 1); const n = Math.min(3, 1 + Math.floor(Lc / .5)); g.pose({ t, look: .3, nod: .25 + .06 * Math.sin(Lc * 12) });
          const h = head(g); K.prop('R02', { x: h.x + 260, y: h.y + 330, w: 330 + 30 * n, rot: .05 * n }); break; }
        case 'wince': { const g = garyTab(); face(g, Lc < .15 ? 'blink' : 'worried', t, 1); g.pose({ t, tilt: .15 * e(Lc / .3), lean: -.05 }); break; }
        case 'thirty': { const g = garyTab(.6); face(g, 'flat', t, 1); g.pose({ t, look: .4 });
          const b = box(), u = e((Lc - .3) / .7); K.prop('P01', { x: b.x, y: b.y - 260 + 230 * u, w: 280 * (1 - .6 * u), a: 1 - K.clamp01((Lc - 1.0) / .2) }); break; }
        case 'look': { const d = dougTab(); face(d, 'smile', t); d.pose({ t, look: .25, nod: .2 });
          const h = head(d); K.prop('R01', { x: h.x - 260, y: h.y + 320, w: 360, rot: -.1 + .04 * Math.sin(t * 4) }); break; }
        case 'sixty': { const d = dougTab(-.6); face(d, 'smirk', t); d.pose({ t, look: -.4 });
          const b = box(), u = e((Lc - .2) / .6); K.prop('P02', { x: b.x, y: b.y - 260 + 230 * u, w: 280 * (1 - .6 * u), a: 1 - K.clamp01((Lc - .8) / .15) }); break; }
        case 'bet': { const d = dougHall(); face(d, 'happy', t); d.pose({ t, gesture: 'wave', gw: e(Lc / .3) }); const g = garyHall(); face(g, 'flat', t, 1); g.pose({ t, gesture: 'cross', gw: e(Lc / .3) }); break; }
        case 'mit': break;
        case 'cashavg': case 'cardavg': case 'double': { const p = K.img(512, 560), k = K.imgScale();
          K.prop('P03', { x: p.x, y: p.y, w: 520 * k * (id === 'cashavg' ? pop('cashavg') : 1) * (id === 'cardavg' ? 1 + .06 * Math.max(0, 1 - Lc / .4) : 1) }); break; }
        case 'how': { const g = garyTab(); face(g, 'worried', t, 1); g.pose({ t, tilt: .12 }); break; }
        case 'bills': { const g = garyTab(); face(g, 'worried', t, 1); g.pose({ t, look: .5 * e(Lc / 1.5), lean: .05 });
          const h = head(g), u = e(Lc / 2.2); K.prop('R02', { x: h.x + 260 + 420 * u, y: h.y + 330 - 380 * u, w: 380 * (1 - .5 * u), rot: u * .8, a: 1 - K.clamp01((u - .8) / .2) }); break; }
        case 'pain': { const g = garyTab(); face(g, 'worried', t, 1); g.pose({ t, gesture: 'facepalm', gw: e((Lc - .5) / .3) }); break; }
        case 'tap': { const d = dougTab(); face(d, 'smile', t); const tap = Math.sin(K.clamp01(Lc / .6) * PI);
          d.pose({ t, armR: { raise: .3 + .3 * tap } }); const h = head(d); K.prop('R01', { x: h.x - 260 - 120 * tap, y: h.y + 320, w: 360, rot: -.1 - .3 * tap, a: Lc > 1.4 ? 1 - K.clamp01((Lc - 1.4) / .3) : 1 }); break; }
        case 'later': { const d = dougTab(); face(d, 'smirk', t); d.pose({ t, gesture: 'shrug', gw: e(Lc / .3) }); break; }
        case 'gas': case 'scan': break;
        case 'reward': { const p = K.img(512, 620); K.prop('P04', { x: p.x, y: p.y, w: 560 * K.imgScale() * pop('reward'), rot: Math.sin(t * 3) * .03 }); break; }
        case 'fries': case 'bite': { const d = dougHall(.2); face(d, 'happy', t); d.pose({ t, lean: .15, tilt: id === 'bite' ? .15 : 0, nod: -.1 });
          const h = head(d); K.prop('P05', { x: h.x + 230, y: h.y + 140 + 8 * Math.sin(t * 2), w: 300 * (id === 'fries' ? pop('fries') : 1) }); break; }
        case 'tens': { const g = garyTab(); face(g, 'flat', t, 1); g.pose({ t, look: .3, nod: .2 }); const h = head(g); K.prop('R02', { x: h.x + 260, y: h.y + 330, w: 380 }); break; }
        case 'tipoff': { const d = K.placeAt('doug', 260, 1330, .35, .7); face(d, 'happy', t); d.pose({ t, armR: { raise: 1 }, armL: { raise: 1 }, nod: Math.sin(t * 9) * .05 }); break; }
        case 'question': { const d = dougHall(.1); face(d, 'smile', t); d.pose({ t }); const g = garyHall(-.1); face(g, 'flat', t, 1); g.pose({ t, gesture: 'cross', gw: e(Lc / .3) }); break; }
        case 'would': { const b = box(); K.prop('R02', { x: b.x - 200, y: b.y + 40, w: 360 * pop('would'), rot: -.08 }); K.prop('R01', { x: b.x + 210, y: b.y + 40, w: 340 * pop('would+0.3'), rot: .08 }); break; }
        case 'cta': break;
      }
    },
  };
})();
