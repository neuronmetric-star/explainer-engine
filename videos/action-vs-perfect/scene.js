// action-vs-perfect: pottery studio plates + Wan 3.0 480p clip plates + Doug, Gary, Victor. Plan: shotlist.md.
// Ends on the OpenArt helicopter-flying-away clip (branding outro) under the follow CTA.
(function () {
  const PI = Math.PI;
  const face = (ch, name, t, off = 0) => ch.face(((t + off) % 4.1) < .12 && name !== 'happy' ? 'blink' : name);
  const L = {
    studio: { key: [0xffd0a0, 2.2, [-14, 7, 2]], hemi: [0xe0c8f0, 0x9a7088, .9], front: [0xffeadc, 1.05], shadow: [0x5a3a6a, .3] },
    gold: { key: [0xffb870, 2.4, [-14, 6, 2]], hemi: [0xf0c0d8, 0x9a6070, .85], front: [0xffe0c8, 1.0], shadow: [0x5a305a, .3] },
  };
  const ST = { hz: .15, vx: .55, fov0: 55, camH: 1.6, light: L.studio };
  const S = (img, o = {}) => Object.assign({ img }, ST, o);

  window.SCENE = {
    plates: {
      '01': S('01_studio_wide_day.png'),
      '02': S('02_wheel_medium.png', { hz: .1 }),
      '02c': S('02_wheel_medium.png', { hz: .1, clip: { dir: 'clips/spin', n: 150, fps: 30 } }),
      '03': S('03_gary_table_medium.png', { hz: .12 }),
      '04': S('04_shelf_week3.png'),
      '05': S('05_studio_end_golden.png', { light: L.gold }),
      '06': S('06_wheel_pot_closeup.png'),
      '06f': S('06_wheel_pot_closeup.png', { clip: { dir: 'clips/fold', n: 150, fps: 30, loop: 'hold' } }),
      '06s': S('06_wheel_pot_closeup.png', { clip: { dir: 'clips/stand', n: 150, fps: 30 } }),
      'heli': S('X01_heli_first.png', { clip: { dir: 'clips/heli', n: 150, fps: 30, loop: 'hold' } }),
    },
    props: { P01: 'P01_dogfood_bag.png', P02: 'P02_scale_pots.png', P03: 'P03_pencil.png',
      R02: 'R02_potato_pot.png', R03: 'R03_sketchbook.png', R04: 'R04_best_pot.png' },
    cast: { doug: 'hoodie', gary: 'oxford', victor: 'suit' },
    shots: [
      { at: 'q', plate: '01', zoom: [1.0, 1.1], focus: [[.5, .55], [.5, .58]] },
      { at: 'meet', plate: '01', zoom: [1.1, 1.14], focus: [[.5, .58], [.5, .58]] },
      { at: 'doug', plate: '01', zoom: [1.7, 1.78], focus: [[.36, .5], [.36, .5]] },
      { at: 'gary', plate: '01', zoom: [1.7, 1.78], focus: [[.64, .52], [.64, .52]] },
      { at: 'class', plate: '01', zoom: [1.25, 1.0], focus: [[.55, .55], [.5, .55]] },
      { at: 'book', plate: '01', zoom: [1.0, 1.06], focus: [[.5, .6], [.5, .62]] },
      { at: 'split', plate: '01', zoom: [1.06, 1.1], focus: [[.5, .62], [.5, .62]] },
      { at: 'dougside', plate: '02', zoom: [1.0, 1.08], focus: [[.5, .5], [.55, .5]] },
      { at: 'dogfood', plate: '02', zoom: [1.08, 1.12], focus: [[.55, .5], [.55, .5]] },
      { at: 'garyside', plate: '03', zoom: [1.0, 1.06], focus: [[.55, .55], [.6, .55]] },
      { at: 'perfect', plate: '03', zoom: [1.7, 1.85], focus: [[.2, .48], [.2, .48]] },
      { at: 'sketch', plate: '03', zoom: [1.1, 1.1], focus: [[.5, .5], [.5, .5]] },
      { at: 'erase', plate: '03', zoom: [1.2, 1.2], focus: [[.5, .5], [.5, .5]] },
      { at: 'grab', plate: '02c', zoom: [1.0, 1.1], focus: [[.5, .5], [.52, .48]] },
      { at: 'potato', plate: '02', zoom: [1.6, 1.7], focus: [[.5, .42], [.5, .42]] },
      { at: 'bet', plate: '01', zoom: [1.0, 1.05], focus: [[.5, .58], [.5, .58]] },
      { at: 'plan', plate: '03', zoom: [1.15, 1.2], focus: [[.45, .55], [.45, .55]] },
      { at: 'hasPotato', plate: '02', zoom: [1.3, 1.35], focus: [[.55, .45], [.55, .45]] },
      { at: 'shelf', plate: '04', zoom: [1.15, 1.2], focus: [[.3, .5], [.7, .5]] },
      { at: 'early', plate: '04', zoom: [1.9, 2.0], focus: [[.4, .15], [.36, .15]] },
      { at: 'lean', plate: '04', zoom: [2.6, 2.7], focus: [[.3, .15], [.3, .15]] },
      { at: 'end', plate: '05', zoom: [1.0, 1.06], focus: [[.5, .6], [.5, .6]] },
      { at: 'reveal', plate: '05', zoom: [1.45, 1.5], focus: [[.5, .68], [.5, .68]] },
      { at: 'garypot', plate: '03', zoom: [1.9, 2.0], focus: [[.18, .48], [.18, .48]] },
      { at: 'lump', plate: '03', zoom: [1.5, 1.05], focus: [[.3, .5], [.6, .55]] },
      { at: 'aside', plate: '06', zoom: [1.0, 1.1], focus: [[.5, .5], [.5, .45]] },
      { at: 'see', plate: '06f', zoom: [1.0, 1.0], focus: [[.5, .5], [.5, .5]] },
      { at: 'thicker', plate: '06s', zoom: [1.0, 1.04], focus: [[.5, .5], [.5, .48]] },
      { at: 'stood', plate: '06s', zoom: [1.12, 1.2], focus: [[.5, .42], [.5, .4]], clipFrom: 2.5 },
      { at: 'drawing', plate: '03', zoom: [1.05, 1.1], focus: [[.58, .55], [.6, .55]] },
      { at: 'paper', plate: '03', zoom: [1.7, 1.85], focus: [[.52, .5], [.52, .5]] },
      { at: 'callback', plate: '02', zoom: [1.6, 1.65], focus: [[.5, .42], [.5, .42]] },
      { at: 'learned', plate: '03', zoom: [1.1, 1.15], focus: [[.58, .55], [.6, .55]] },
      { at: 'question', plate: '01', zoom: [1.0, 1.06], focus: [[.5, .58], [.5, .58]] },
      { at: 'garyfix', plate: '03', zoom: [1.2, 1.3], focus: [[.6, .55], [.62, .55]] },
      { at: 'dougclay', plate: '02c', zoom: [1.05, 1.1], focus: [[.52, .5], [.52, .5]], clipFrom: 1.0 },
      { at: 'cta', plate: 'heli', zoom: [1.0, 1.0], focus: [[.5, .5], [.5, .5]] },
    ],
    shakes: [['potato', .2, .5], ['reveal', .25, .6]],
    flashes: [['reveal', .1, .3]],
    follow: { from: 'cta+0.4', y: 260 },
    tail: 2.0,

    update(t, K) {
      const id = K.shot.id, Lc = K.shot.local, at = c => K.T(c), e = K.ease, pop = (from, d = .3) => K.pop(K.clamp01((t - K.T(from)) / d));
      const D = K.cast.doug, G = K.cast.gary, V = K.cast.victor;
      // studio spots (painting px): Doug beside the wheel, Gary in front of his table
      const dougWheel = (ry = .25, s = .6) => K.placeAt('doug', 370, 1090, ry, s);
      const garyTable = (ry = -.3, s = .6) => K.placeAt('gary', 660, 1170, ry, s);
      // medium plates
      const dougAt02 = (ry = -.4) => K.placeAt('doug', 770, 830, ry, .8);
      const garyAt03 = (ry = -.45) => K.placeAt('gary', 790, 1400, ry, .6);
      const potatoOnWheel = (s = 1) => { const p = K.img(372, 655); K.prop('R02', { x: p.x, y: p.y, w: 300 * K.imgScale() * s, anchor: [.5, .72] }); };
      // Gary's sketchbook, drawn exactly over the painted one (03: x 290-750, y 600-910), optionally enlarged
      const sketchOver = (m = 1, rot = 0) => { const p = K.img(520, 760); K.prop('R03', { x: p.x, y: p.y, w: 470 / .93 * K.imgScale() * m, rot }); };
      switch (id) {
        case 'q': { const d = dougWheel(); face(d, 'happy', t); d.pose({ t, armR: { raise: e(Lc / .4) }, armL: { raise: e(Lc / .4) } });
          const g = garyTable(); face(g, 'flat', t, 1); g.pose({ t, gesture: 'think', gw: e(Lc / .4) }); break; }
        case 'meet': { const d = dougWheel(.1); face(d, 'smile', t); d.pose({ t }); const g = garyTable(-.15); face(g, 'flat', t, 1); g.pose({ t, gesture: 'cross', gw: 1 }); break; }
        case 'doug': { const d = dougWheel(.1); face(d, 'happy', t); d.pose({ t, gesture: 'wave', gw: e(Lc / .3) }); garyTable(); G.pose({ t }); break; }
        case 'gary': { dougWheel(); D.pose({ t }); const g = garyTable(-.1); face(g, Lc < .3 ? 'blink' : 'flat', t, 1); g.pose({ t, gesture: 'think', gw: e(Lc / .3) }); break; }
        case 'class': { const d = dougWheel(.6); face(d, 'smile', t); d.pose({ t, look: .3 }); const g = garyTable(-.7); face(g, 'flat', t, 1); g.pose({ t, look: -.3 }); break; }
        case 'book': case 'split': { const v = K.placeAt('victor', 525, 1250, 0, .55); face(v, 'smile', t);
          v.pose({ t, gesture: id === 'split' ? 'tada' : null, gw: id === 'split' ? e(Lc / .3) : 0, nod: id === 'book' ? Math.sin(t * 3) * .05 : 0 });
          const d = K.placeAt('doug', 230, 1180, .4, .6); face(d, 'smile', t); d.pose({ t, look: .3 }); const g = K.placeAt('gary', 830, 1230, -.5, .6); face(g, 'flat', t, 1); g.pose({ t, look: -.2 }); break; }
        case 'dougside': { const d = dougAt02(); face(d, 'happy', t); d.pose({ t, gesture: 'point', gw: e((Lc - .4) / .3), look: .3 });
          K.prop('P02', { x: 260, y: 1350, w: 360 * pop('dougside+0.2') }); break; }
        case 'dogfood': { const d = dougAt02(); face(d, Lc < .2 ? 'blink' : 'smirk', t); d.pose({ t, gesture: 'shrug', gw: e((Lc - .3) / .3) });
          K.prop('P02', { x: 260, y: 1350, w: 360 }); K.prop('P01', { x: 560, y: 1450, w: 280 * pop('dogfood+0.1') }); break; }
        case 'garyside': { const g = garyAt03(-.2); face(g, 'smirk', t, 1); g.pose({ t, gesture: 'hips', gw: e(Lc / .3) }); break; }
        case 'perfect': break;   // the lump of clay
        case 'sketch': case 'erase': { const g = garyAt03(-.6); face(g, id === 'erase' ? (Lc < .8 ? 'worried' : 'smile') : 'flat', t, 1);
          g.pose({ t, lean: .2, look: -.4, nod: .25 });
          const wig = id === 'erase' ? Math.sin(Lc * 30) * .03 * (1 - K.clamp01((Lc - .8) / .2)) : 0;
          sketchOver(id === 'sketch' ? 1 + .25 * pop('sketch') : 1.25, wig); break; }
        case 'grab': case 'dougclay': { const d = dougAt02(-.6); face(d, 'happy', t); d.pose({ t, look: -.3, lean: .15, armR: { raise: .25, fwd: -.8 }, armL: { raise: .25, fwd: -.8 } }); break; }
        case 'potato': { potatoOnWheel(pop('potato', .35)); break; }
        case 'bet': { const d = dougWheel(); face(d, 'happy', t); d.pose({ t }); const g = garyTable(-.2); face(g, 'smirk', t, 1); g.pose({ t, gesture: 'cross', gw: e(Lc / .3) }); break; }
        case 'plan': { const g = garyAt03(-.5); face(g, 'smile', t, 1); g.pose({ t, gesture: 'point', gw: e(Lc / .3), look: -.3 }); sketchOver(1.1); break; }
        case 'hasPotato': { const d = dougAt02(-.3); face(d, 'happy', t); d.pose({ t, gesture: 'tada', gw: e(Lc / .3) }); potatoOnWheel(); break; }
        case 'shelf': { const d = K.placeAt('doug', 520, 840, 0, .8); face(d, 'smile', t); d.pose({ t, gesture: 'hips', gw: e(Lc / .3) }); break; }
        case 'early': case 'lean': break;   // the plant: early pots
        case 'end': { const v = K.placeAt('victor', 60 + 90 * K.clamp01(Lc / 2), 1330, PI / 2, .8); face(v, 'flat', t); v.pose({ t, walk: Lc * 1.2, walkAmt: 1 - e((Lc - 1.6) / .4), look: -.6 }); break; }
        case 'reveal': { const d = K.placeAt('doug', 905, 1300, -.3, .8); face(d, 'happy', t); d.pose({ t, gesture: 'tada', gw: e(Lc / .25) }); break; }
        case 'garypot': break;
        case 'lump': { const g = garyAt03(-.3); face(g, 'worried', t, 1); g.pose({ t, gesture: 'shrug', gw: e((Lc - .5) / .3) }); break; }
        case 'aside': case 'see': case 'thicker': case 'stood': break;   // the pot on the wheel (clips)
        case 'drawing': { const g = garyAt03(-.6); face(g, 'flat', t, 1); g.pose({ t, gesture: 'think', gw: 1, lean: .1, look: -.3 }); break; }
        case 'paper': break;
        case 'callback': { potatoOnWheel(); break; }
        case 'learned': { const g = garyAt03(-.5); face(g, 'worried', t, 1); g.pose({ t, gesture: 'think', gw: e(Lc / .3), look: -.3 });
          K.prop('P03', { x: 430, y: 640, w: 300 * pop('learned+0.4'), rot: Math.sin(t * 9) * .15 }); break; }
        case 'question': { const d = dougWheel(.2); face(d, 'smile', t); d.pose({ t, gesture: 'point', gw: e((Lc - .8) / .3) }); const g = garyTable(-.2); face(g, 'flat', t, 1); g.pose({ t, gesture: 'think', gw: e(Lc / .3) }); break; }
        case 'garyfix': { const g = garyAt03(-.6); face(g, 'worried', t, 1); g.pose({ t, lean: .25, look: -.4, nod: .3 }); sketchOver(1.1); break; }
        case 'cta': break;     // helicopter flies away (OpenArt clip) + follow button
      }
    },
  };
})();
