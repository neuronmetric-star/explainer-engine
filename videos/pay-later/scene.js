// pay-later: living room / kitchen / store plates + Wan 3.0 480p clip plates + Doug (pay later), Gary (jar), cashier.
// Ends on the helicopter branding outro under the follow CTA. Plan: shotlist.md.
(function () {
  const PI = Math.PI;
  const face = (ch, name, t, off = 0) => ch.face(((t + off) % 4.1) < .12 && name !== 'happy' ? 'blink' : name);
  const L = {
    day: { key: [0xffd0a0, 2.2, [-14, 6, 2]], hemi: [0xd0c8f0, 0x9a6a50, .9], front: [0xffe8d8, 1.05], shadow: [0x4a3050, .3] },
    night: { key: [0xffb070, 1.6, [12, 6, 2]], hemi: [0x6878d8, 0x503050, 1.0], front: [0xa8b0ff, .9], shadow: [0x101030, .4] },
    store: { key: [0xfff0d8, 2.0, [-12, 8, 2]], hemi: [0xd8e8ff, 0xa0a0b0, 1.0], front: [0xfff4ec, 1.0], shadow: [0x404060, .28] },
  };
  const P = (img, o) => Object.assign({ img, hz: .42, vx: .5, fov0: 55, camH: 1.5, light: L.day }, o || {});

  window.SCENE = {
    plates: {
      '01': P('01_living_room_day.png', { hz: .4 }),
      '02': P('02_kitchen_jar.png', { hz: .45 }),
      '02c': P('02_kitchen_jar.png', { hz: .45, clip: { dir: 'clips/jar', n: 150, fps: 30, loop: 'hold' } }),
      '03': P('03_living_room_friday.png', { hz: .4, light: L.night }),
      '03c': P('03_living_room_friday.png', { hz: .4, light: L.night, clip: { dir: 'clips/buzz', n: 150, fps: 30 } }),
      '04': P('04_store_aisle.png', { hz: .42, light: L.store }),
      '05': P('05_federal_reserve.png', { hz: .5 }),
      'heli': P('X01_heli_first.png', { clip: { dir: 'clips/heli', n: 150, fps: 30, loop: 'hold' } }),
    },
    props: { R01: 'R01_console.png', R04: 'R04_price_tag.png', P01: 'P01_phone_paylater.png', P02: 'P02_headphones.png',
      P03: 'P03_jacket.png', P04: 'P04_pizza_box.png', P05: 'P05_phone_late.png', P06: 'P06_hundred.cut.png' },
    cast: { doug: 'hoodie', gary: 'oxford', cashier: 'polo' },
    shots: [
      { at: 'q', plate: '01', zoom: [1.0, 1.12], focus: [[.5, .5], [.4, .5]] },
      { at: 'doug', plate: '01', zoom: [1.1, 1.1], focus: [[.5, .6], [.5, .6]] },
      { at: 'hundred', plate: '01', zoom: [1.5, 1.55], focus: [[.5, .55], [.5, .55]] },
      { at: 'button', plate: '01', zoom: [1.5, 1.5], focus: [[.5, .55], [.5, .55]] },
      { at: 'today', plate: '01', zoom: [1.3, 1.35], focus: [[.5, .58], [.5, .58]] },
      { at: 'every', plate: '01', zoom: [1.3, 1.2], focus: [[.5, .58], [.5, .58]] },
      { at: 'scary', plate: '01', zoom: [1.6, 1.6], focus: [[.5, .55], [.5, .55]] },
      { at: 'easy', plate: '01', zoom: [1.6, 1.6], focus: [[.5, .55], [.5, .55]] },
      { at: 'username', plate: '01', zoom: [1.2, 1.3], focus: [[.4, .5], [.35, .5]] },
      { at: 'gary', plate: '02', zoom: [1.0, 1.06], focus: [[.5, .55], [.5, .55]] },
      { at: 'jar', plate: '02c', zoom: [1.2, 1.35], focus: [[.5, .45], [.5, .43]] },
      { at: 'bet', plate: '01', zoom: [1.1, 1.15], focus: [[.5, .6], [.5, .6]] },
      { at: 'playing', plate: '01', zoom: [1.3, 1.35], focus: [[.45, .55], [.45, .55]] },
      { at: 'gotjar', plate: '02', zoom: [1.4, 1.5], focus: [[.55, .5], [.55, .48]] },
      { at: 'again', plate: '01', zoom: [1.4, 1.45], focus: [[.5, .55], [.5, .55]] },
      { at: 'headphones', plate: '01', zoom: [1.5, 1.5], focus: [[.48, .55], [.48, .55]] },
      { at: 'jacket', plate: '01', zoom: [1.65, 1.65], focus: [[.52, .55], [.52, .55]] },
      { at: 'pizza', plate: '01', zoom: [1.8, 1.8], focus: [[.5, .55], [.5, .55]] },
      { at: 'aside', plate: '01', zoom: [1.6, 1.7], focus: [[.5, .52], [.5, .5]] },
      { at: 'think', plate: '01', zoom: [1.5, 1.55], focus: [[.5, .55], [.5, .55]] },
      { at: 'barely', plate: '01', zoom: [1.55, 1.3], focus: [[.5, .55], [.5, .58]] },
      { at: 'research', plate: '04', zoom: [1.0, 1.12], focus: [[.5, .5], [.5, .45]] },
      { at: 'store', plate: '04', zoom: [1.35, 1.35], focus: [[.25, .5], [.75, .5]] },
      { at: 'friday', plate: '03c', zoom: [1.0, 1.1], focus: [[.5, .5], [.6, .55]] },
      { at: 'console', plate: '03', zoom: [1.3, 1.35], focus: [[.45, .58], [.45, .58]] },
      { at: 'plus', plate: '03', zoom: [1.3, 1.3], focus: [[.6, .65], [.6, .65]] },
      { at: 'ate', plate: '03', zoom: [1.8, 1.9], focus: [[.25, .82], [.25, .82]] },
      { at: 'cover', plate: '03', zoom: [1.4, 1.55], focus: [[.45, .58], [.45, .56]] },
      { at: 'late', plate: '03', zoom: [1.55, 1.6], focus: [[.45, .56], [.45, .56]] },
      { at: 'fed', plate: '05', zoom: [1.0, 1.12], focus: [[.5, .5], [.5, .45]] },
      { at: 'garyend', plate: '02', zoom: [1.1, 1.15], focus: [[.55, .55], [.55, .55]] },
      { at: 'empties', plate: '02c', zoom: [1.3, 1.3], focus: [[.5, .45], [.5, .45]], clipFrom: 4.9 },
      { at: 'end', plate: '04', zoom: [1.35, 1.45], focus: [[.5, .5], [.5, .48]] },
      { at: 'times', plate: '03', zoom: [1.25, 1.3], focus: [[.45, .58], [.45, .58]] },
      { at: 'question', plate: '01', zoom: [1.3, 1.35], focus: [[.5, .55], [.5, .55]] },
      { at: 'orjar', plate: '02', zoom: [1.2, 1.25], focus: [[.6, .55], [.6, .55]] },
      { at: 'cta', plate: 'heli', zoom: [1.0, 1.0], focus: [[.5, .5], [.5, .5]] },
    ],
    shakes: [['late', .3, .7], ['times', .2, .4]],
    flashes: [['late', .1, .3]],
    follow: { from: 'cta+0.4', y: 260 },
    tail: 2.0,

    update(t, K) {
      const id = K.shot.id, Lc = K.shot.local, at = c => K.T(c), e = K.ease, pop = (from, d = .3) => K.pop(K.clamp01((t - K.T(from)) / d));
      const D = K.cast.doug, G = K.cast.gary, C = K.cast.cashier;
      const dougRoom = (ry = 0, ix = 470, iy = 1120) => K.placeAt('doug', ix, iy, ry, .72);
      const garyKitchen = (ry = -.3) => K.placeAt('gary', 700, 1320, ry, .62);
      const head = ch => K.screenOf(ch.head);
      const beside = (ch, k, w, dx = 250, dy = 60, a = 1, rot = 0) => { const h = head(ch); K.prop(k, { x: h.x + dx, y: h.y + dy, w, a, rot }); };
      switch (id) {
        case 'q': { const d = dougRoom(-.5, 600, 1120); face(d, Lc < .8 ? 'surprised' : 'happy', t); d.pose({ t, look: -.5, lean: .1 });
          const c = K.img(270, 610); K.prop('R04', { x: c.x, y: c.y, w: 200 * pop('q+0.5'), rot: .1 + Math.sin(t * 3) * .05 }); break; }
        case 'doug': { const d = dougRoom(-.3); face(d, 'happy', t); d.pose({ t, gesture: 'point', gw: e(Lc / .3), look: -.4 }); break; }
        case 'hundred': { const d = dougRoom(); face(d, 'worried', t); d.pose({ t, gesture: 'shrug', gw: e(Lc / .3) }); beside(d, 'P06', 300 * pop('hundred'), 0, 330); break; }
        case 'button': case 'bnpl': { const d = dougRoom(); face(d, 'surprised', t); d.pose({ t });
          K.prop('P01', { x: 540, y: 820, w: 640 * (id === 'button' ? pop('button') : 1 + .04 * Math.sin(Lc * 8)) }); break; }
        case 'today': { const d = dougRoom(); face(d, 'smile', t); d.pose({ t, armR: { raise: .4 } }); const u = e(Lc / .7);
          beside(d, 'P06', 280, 200 + 300 * u, 200 - 260 * u, 1 - u * .6, u * .5); break; }
        case 'every': { const d = dougRoom(); face(d, 'flat', t, 0); d.pose({ t, gesture: 'think', gw: e(Lc / .3) });
          for (let k = 0; k < 3; k++) { const a = pop('every+' + (.5 + k * .8)); K.prop('P06', { x: 220 + k * 320, y: 1500, w: 280 * a, a: .75 * a }); } break; }
        case 'scary': { const d = dougRoom(); face(d, 'worried', t); d.pose({ t, lean: -.1 }); beside(d, 'R04', 360 * pop('scary'), 260, 60, 1, .1); break; }
        case 'easy': { const d = dougRoom(); face(d, 'happy', t); d.pose({ t, gesture: 'hips', gw: 1 }); beside(d, 'P06', 300 * pop('easy'), 260, 120); break; }
        case 'username': { const d = dougRoom(-.6); face(d, 'happy', t); d.pose({ t, gesture: 'tada', gw: e(Lc / .3), look: -.4 }); break; }
        case 'gary': { const g = garyKitchen(); face(g, 'flat', t, 1); g.pose({ t, look: -.4 }); break; }
        case 'jar': break;   // the jar filling (clip)
        case 'bet': case 'playing': { const d = dougRoom(-.2, 470, 1120); face(d, 'happy', t); d.pose({ t, gesture: id === 'playing' ? 'tada' : 'wave', gw: e(Lc / .3), look: -.2 }); break; }
        case 'gotjar': { const g = garyKitchen(-.5); face(g, 'flat', t, 1); g.pose({ t, look: -.5, nod: .1 }); break; }
        case 'again': { const d = dougRoom(); face(d, 'smirk', t); d.pose({ t, armR: { raise: .4 } }); beside(d, 'P01', 300, 260, 180); break; }
        case 'headphones': case 'jacket': case 'pizza': { const d = dougRoom(); face(d, 'happy', t); d.pose({ t, gesture: id === 'pizza' ? 'tada' : null, gw: id === 'pizza' ? 1 : 0, armR: { raise: .5 } });
          const k = { headphones: 'P02', jacket: 'P03', pizza: 'P04' }[id]; beside(d, k, 330 * pop(id), 270, 40, 1, Math.sin(t * 5) * .05); break; }
        case 'aside': { const d = dougRoom(); face(d, Lc < .3 ? 'blink' : 'flat', t); d.pose({ t }); break; }
        case 'think': { const d = dougRoom(); face(d, Lc > 1.6 ? 'smile' : 'flat', t); d.pose({ t, gesture: 'think', gw: e(Lc / .3) * (1 - e((Lc - 2.2) / .3)), nod: Lc > 2.4 ? .15 * Math.sin(t * 10) : 0 });
          beside(d, 'P06', 280, 270, 60); break; }
        case 'barely': { const d = dougRoom(); face(d, 'smile', t); d.pose({ t });
          for (let k = 0; k < 3; k++) { const a = 1 - K.clamp01((Lc - .3 - k * .4) / .6); K.prop('P06', { x: 220 + k * 320, y: 1500 + 40 * (1 - a), w: 280, a: .75 * a }); } break; }
        case 'research': case 'store': case 'fed': break;
        case 'friday': break;   // phone buzzing (clip)
        case 'console': { const d = dougRoom(.1, 470, 1130); face(d, 'worried', t); d.pose({ t }); beside(d, 'P06', 280 * pop('console+0.3'), 260, 80); break; }
        case 'plus': { const d = dougRoom(.1, 470, 1130); face(d, 'worried', t); d.pose({ t, lean: -.05 });
          beside(d, 'P02', 260 * pop('plus+0.2'), -260, 40); beside(d, 'P03', 260 * pop('plus+0.9'), 260, 40); break; }
        case 'ate': break;   // the painted empty pizza box
        case 'cover': { const d = dougRoom(.1, 470, 1130); face(d, 'worried', t); d.pose({ t, gesture: 'facepalm', gw: e((Lc - .3) / .3) }); break; }
        case 'late': { const d = dougRoom(.1, 470, 1130); face(d, 'surprised', t); d.pose({ t, lean: -.1 }); beside(d, 'P05', 330 * pop('late'), 290, 120, 1, .08); break; }
        case 'garyend': { const g = garyKitchen(); face(g, 'smile', t, 1); g.pose({ t, gesture: 'point', gw: e(Lc / .3), look: -.4 }); break; }
        case 'empties': break;
        case 'end': { const g = K.placeAt('gary', 420, 900, .4, .75), c = K.placeAt('cashier', 620, 880, -.5, .75);
          face(g, 'smile', t, 1); g.pose({ t, armR: { raise: .35 } }); face(c, 'smile', t, 2); c.pose({ t, nod: Math.sin(t * 4) * .05 });
          const h = head(g); K.prop('R01', { x: h.x + 90, y: h.y + 230, w: 150 * pop('end+0.4') }); break; }
        case 'times': { const d = dougRoom(.1, 470, 1130); face(d, 'flat', t); d.pose({ t, gesture: 'shrug', gw: e(Lc / .3) }); break; }
        case 'question': { const d = dougRoom(); face(d, 'smirk', t); d.pose({ t }); beside(d, 'P01', 260, 260, 180); break; }
        case 'orjar': { const g = garyKitchen(-.2); face(g, 'smirk', t, 1); g.pose({ t, gesture: 'hips', gw: e(Lc / .3) }); break; }
        case 'cta': break;
      }
    },
  };
})();
