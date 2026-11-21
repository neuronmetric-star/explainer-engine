// tiktok-pay: how does TikTok pay you? Plates + props + Doug (creator, phone) and Gary. Plan: shotlist.md.
// World units: feet at y=0, camera at (0, camH, 0) looking down -z. Props + text in screen px (y down).
// Every number and word on screen is K.text (the paintings carry no text).
(function () {
  const PI = Math.PI;
  const face = (ch, name, t, off = 0) => ch.face(((t + off) % 4.1) < .12 && name !== 'happy' ? 'blink' : name);
  const popIn = (K, t, from, dur = .35) => K.pop(K.clamp01((t - from) / dur));
  const WORDS = window.VIDEO_DATA.words, norm = w => w.toLowerCase().replace(/[^a-z0-9]/g, '');
  const wordAt = (K, w, cue) => { const t0 = K.T(cue); const x = WORDS.find(o => o.start >= t0 - .01 && norm(o.w) === w); return x ? x.start : t0; };
  const RED = '#e8352b', GOLD = 'gold', INK = '#14325a';

  const L = {
    room: { key: [0xffb070, 2.0, [-10, 5, 3]], hemi: [0xc090ff, 0x804860, .85], front: [0xffd0c8, .95], shadow: [0x2c1040, .42] },
    show: { key: [0xfff0dd, 2.2, [-12, 7, 2]], hemi: [0xd8e4ff, 0xb0a8c0, .9], front: [0xffffff, 1.0], shadow: [0x404870, .35] },
    desk: { key: [0xffb060, 1.9, [10, 5, 3]], hemi: [0x7a70d0, 0x5a3830, .8], front: [0xffcfa8, .85], shadow: [0x1c1038, .45] },
    dusk: { key: [0xff9a60, 1.9, [-12, 5, -4]], hemi: [0xb080e0, 0x503060, .85], front: [0xffc8b0, .95], shadow: [0x2a1040, .45] },
  };
  // the big phone (R03) as a full-frame screen: [text, y offset (fraction of phone width), size, color]
  function phone(K, w, lines, o = {}) { const x = o.x || 540, y = o.y || 860; K.prop('R03', { x, y, w });
    lines.forEach(([s, dy, size, col, extra]) => K.text(s, Object.assign({ x, y: y + dy * w, size: size * w / 700, color: col || INK, stroke: 0, shadow: false, w: w * .9 }, extra || {}))); }

  window.SCENE = {
    plates: {
      '01': { img: '01_creator_bedroom.png', hz: .47, vx: .45, fov0: 55, camH: 1.5, light: L.room },
      '02': { img: 'R02_home_desk_night.png', hz: .46, vx: .5, fov0: 55, camH: 1.45, light: L.desk },
      '03': { img: '03_car_dealership.png', hz: .47, vx: .55, fov0: 55, camH: 1.55, light: L.show },
      '05': { img: '05_rooftop_dusk.png', hz: .55, vx: .5, fov0: 55, camH: 1.6, light: L.dusk },
    },
    props: { P01: 'P01_clipboard.png', P02: 'P02_eye_badge.cut.png', R03: 'R03_phone_blank.png', R04: 'R04_dollar_bill.cut.png', H01: 'H01_helicopter.png' },
    cast: { doug: { outfit: 'hoodie', phone: true }, gary: 'oxford' },
    shots: [
      { at: 'q', plate: '01', zoom: [1.0, 1.12], focus: [[.45, .55], [.42, .55]] },
      { at: 'card', plate: '01', zoom: [1.0, 1.04], focus: [[.5, .5], [.5, .5]] },          // phone close-up on top
      { at: 'car', plate: '03', zoom: [1.1, 1.2], focus: [[.42, .58], [.45, .57]] },
      { at: 'gary', plate: '02', zoom: [1.15, 1.25], focus: [[.5, .58], [.58, .55]] },
      { at: 'zero', plate: '02', zoom: [2.4, 2.6], focus: [[.74, .44], [.74, .44]] },
      { at: 'program', plate: '02', zoom: [1.0, 1.06], focus: [[.48, .6], [.48, .6]] },
      { at: 'join', plate: '02', zoom: [1.0, 1.05], focus: [[.5, .55], [.5, .55]] },        // clipboard on top
      { at: 'had', plate: '02', zoom: [1.05, 1.1], focus: [[.5, .6], [.5, .6]] },
      { at: 'clue', plate: '01', zoom: [1.0, 1.04], focus: [[.5, .5], [.5, .5]] },          // phone again
      { at: 'timer', plate: '01', zoom: [1.0, 1.0], focus: [[.5, .5], [.5, .5]] },
      { at: 'minute', plate: '01', zoom: [1.1, 1.2], focus: [[.45, .55], [.45, .55]] },
      { at: 'short', plate: '02', zoom: [1.05, 1.12], focus: [[.5, .6], [.5, .58]] },
      { at: 'qualified', plate: '01', zoom: [1.15, 1.25], focus: [[.4, .55], [.42, .55]] },
      { at: 'fyp', plate: '01', zoom: [1.0, 1.04], focus: [[.5, .5], [.5, .5]] },
      { at: 'real', plate: '01', zoom: [1.2, 1.3], focus: [[.45, .55], [.45, .55]] },
      { at: 'rate', plate: '02', zoom: [1.1, 1.2], focus: [[.5, .55], [.5, .55]] },
      { at: 'million', plate: '03', zoom: [1.05, 1.15], focus: [[.5, .55], [.5, .55]] },
      { at: 'phone', plate: '03', zoom: [1.2, 1.3], focus: [[.4, .58], [.4, .58]] },
      { at: 'wink', plate: '01', zoom: [1.05, 1.1], focus: [[.5, .56], [.5, .55]] },
      { at: 'end', plate: '05', zoom: [1.1, 1.15], focus: [[.5, .6], [.5, .58]] },
      { at: 'heli', plate: '05', zoom: [1.0, 1.02], focus: [[.5, .52], [.5, .52]] },
      { at: 'cta', plate: '05', zoom: [1.0, 1.0], focus: [[.5, .5], [.5, .5]] },
    ],
    shakes: [['zero', .25, .5], ['timer', .25, .5]],
    flashes: [],
    // THE HELICOPTER CLIP (PLAYBOOK §1.12a): the original OpenArt clip plays full screen under the follow CTA
    clips: [{ at: 'cta', file: 'H00_helicopter_clip_openart.mp4', from: 'assets' }],
    follow: { from: 'cta+1.4' },
    tail: 1.6,

    update(t, K) {
      const id = K.shot.id, Lc = K.shot.local, at = c => K.T(c);
      const D = K.cast.doug, G = K.cast.gary;
      const filming = () => { const d = K.placeAt('doug', 560, 1060, -.75); face(D, 'smile', t); D.pose({ t, look: -.2, armR: { raise: .3 } }); return d; };
      const desk = (who = 'gary') => K.placeAt(who, 330, 1150, .45);
      const views = ['1,000,000 views', -.08, 46, GOLD, { stroke: 8 }], len = (sz = 30, col = INK) => ['0:58', .3, sz, col];
      switch (id) {
        case 'q': { filming(); const a = K.clamp01((at('card') - t) / .2);
          K.text('HOW DOES TIKTOK', { y: 290, size: 98, a, scale: .8 + .2 * popIn(K, t, at('q')) });
          K.text('PAY YOU?', { y: 400, size: 112, color: GOLD, a, scale: .8 + .2 * popIn(K, t, at('q') + .7) }); break; }
        case 'card': case 'car': {
          if (id === 'card') { phone(K, 1100, [views, len()]); break; }
          const d = K.placeAt('doug', 300, 1080, .35); face(D, 'happy', t); D.pose({ t, gesture: 'tada', gw: K.ease(Lc / .35) });
          break; }
        case 'gary': { desk(); face(G, 'flat', t, 1); G.pose({ t, look: -.45, lean: .05 }); break; }
        case 'zero': { const p = K.img(762, 672), k = K.imgScale() / 2.5;
          K.text('EARNINGS', { x: p.x, y: p.y - 55 * k, size: 40 * k, color: INK, stroke: 0, shadow: false, w: 900 });
          K.text('$0.00', { x: p.x, y: p.y + 30 * k, size: 100 * k, color: RED, stroke: 0, shadow: false, w: 900, scale: popIn(K, t, wordAt(K, 'zero', 'zero')) }); break; }
        case 'program': { desk(); face(G, 'flat', t, 1); G.pose({ t, gesture: 'think', gw: K.ease(Lc / .4) });
          K.text('CREATOR', { y: 280, size: 84, color: GOLD, scale: popIn(K, t, wordAt(K, 'creator', 'program')) });
          K.text('REWARDS PROGRAM', { y: 380, size: 76, color: GOLD, scale: popIn(K, t, wordAt(K, 'creator', 'program') + .2) }); break; }
        case 'join': { K.prop('P01', { x: 540, y: 820, w: 900 * popIn(K, t, at('join')) });
          [['18+', 'eighteen'], ['10,000 followers', 'followers'], ['100,000 views / 30 days', 'days']].forEach(([s, w], i) => {
            const tw = wordAt(K, w, 'join'), y = 820 + ([575, 820, 1065][i] - 768) * 900 / 1024; if (t < tw - .1) return;
            K.text('✓', { x: 305, y: y - 8, size: 104, color: '#1f9d55', stroke: 0, shadow: false, w: 200, scale: popIn(K, t, tw - .1) });
            K.text(s, { x: 610, y: y - 26, size: i === 2 ? 40 : 52, color: '#1c1c22', stroke: 0, shadow: false, w: 620 }); }); break; }
        case 'had': { desk(); const u = K.clamp01(Lc / .9), [x0, z0] = K.floorAt(1000, 1180), [x1, z1] = K.floorAt(700, 1170);
          K.place('doug', K.lerp(x0, x1, u), 0, K.lerp(z0, z1, u), u < 1 ? -PI / 2 : -.35); face(D, 'smirk', t);
          D.pose({ t, walk: Lc * 1.4, walkAmt: 1 - u, gesture: u >= 1 ? 'shrug' : undefined, gw: K.ease((Lc - .9) / .3) });
          face(G, 'flat', t, 1); G.pose({ t, look: .4 }); break; }
        case 'clue': { phone(K, 1100, [views, len(30 * (1 + 1.4 * K.ease(Lc / 1.2)), RED)]); break; }
        case 'timer': { phone(K, 1100, [['0:58', 0, 170, RED, { scale: popIn(K, t, wordAt(K, 'fiftyeight', 'timer')) }]]); break; }
        case 'minute': { filming(); K.text('PAYS ONLY FOR VIDEOS', { y: 280, size: 70, scale: popIn(K, t, at('minute') + .2) });
          K.text('OVER 1:00', { y: 390, size: 110, color: GOLD, scale: popIn(K, t, wordAt(K, 'minute', 'minute')) }); break; }
        case 'short': { desk(); K.placeAt('doug', 700, 1170, -.35); face(D, 'worried', t); D.pose({ t, gesture: 'facepalm', gw: K.ease((Lc - .3) / .4) });
          face(G, 'smirk', t, 1); G.pose({ t, gesture: 'point', gw: K.ease(Lc / .3), look: .45 });
          K.text('0:58 → 1:00', { y: 290, size: 92, scale: popIn(K, t, at('short')) });
          K.text('2 SECONDS SHORT', { y: 400, size: 76, color: RED, scale: popIn(K, t, wordAt(K, 'two', 'short')) }); break; }
        case 'qualified': { filming(); K.prop('P02', { x: 380, y: 480, w: 360 * popIn(K, t, at('qualified') + .3) });
          if (t > wordAt(K, 'qualified', 'qualified')) K.text('QUALIFIED VIEWS', { y: 260, size: 84, color: GOLD, scale: popIn(K, t, wordAt(K, 'qualified', 'qualified')) }); break; }
        case 'fyp': { phone(K, 1100, [['For You', -.4, 48, '#1c1c22', { stroke: 0 }], ['▶', -.02, 150, '#ffffff', { stroke: 0 }], ['the feed TikTok', .28, 36, INK], ['picks for you', .35, 36, INK]]); break; }
        case 'real': { filming(); K.text('✓ real accounts', { y: 280, size: 80, color: GOLD, scale: popIn(K, t, wordAt(K, 'real', 'real')) });
          K.text('✓ each person counted once', { y: 380, size: 62, scale: popIn(K, t, wordAt(K, 'person', 'real')), w: 1040 }); break; }
        case 'rate': { desk(); face(G, 'flat', t, 1); G.pose({ t, gesture: 'think', gw: 1 });
          K.prop('R04', { x: 780, y: 580, w: 400 * popIn(K, t, at('rate') + .2), rot: -.05 });
          K.text('≈ $0.40 – $1.00', { y: 260, size: 92, color: GOLD, scale: popIn(K, t, wordAt(K, 'forty', 'rate')) });
          K.text('per 1,000 qualified views', { y: 360, size: 54, scale: popIn(K, t, wordAt(K, 'thousand', 'rate')), w: 1040 }); break; }
        case 'million': { K.text('1,000,000', { y: 520, size: 120, scale: popIn(K, t, at('million')) }); K.text('qualified views', { y: 630, size: 60 });
          K.text('≈ $400 – $1,000', { y: 780, size: 104, color: GOLD, scale: popIn(K, t, wordAt(K, 'four', 'million')) }); break; }
        case 'phone': { const d = K.placeAt('doug', 300, 1080, .35); face(D, Lc < 1 ? 'flat' : 'worried', t); D.pose({ t, armR: { raise: .9 }, look: .15 });
          K.text('A NICE PHONE.', { y: 280, size: 84, color: GOLD, scale: popIn(K, t, at('phone')) });
          if (t > wordAt(K, 'not', 'phone')) K.text('NOT A CAR.', { y: 380, size: 84, color: RED, scale: popIn(K, t, wordAt(K, 'not', 'phone')) }); break; }
        case 'wink': { filming(); K.placeAt('gary', 840, 1100, -.45); face(G, 'smirk', t, 1); G.pose({ t, gesture: 'cross', gw: 1 });
          K.text('THIS VIDEO: 1:05 ✓', { y: 300, size: 84, color: GOLD, scale: popIn(K, t, wordAt(K, 'video', 'wink')) }); break; }
        case 'end': case 'heli': case 'cta': {
          const d = K.placeAt('doug', 520, 1180, .1);
          // THE HELICOPTER ENDING (PLAYBOOK §1.12a): it crosses the dusk sky on "Two seconds longer…"; Doug looks up
          const hu = K.helicopter(t, 'heli', { y: 300 }), up = hu < 0 ? 0 : Math.sin(PI * K.clamp01((hu - .05) / .85));
          face(D, up > .4 ? 'flat' : 'happy', t); D.pose({ t, nod: -.5 * up, armR: { raise: .75 * (1 - up) }, look: .1 });
          if (id === 'end') { const h = K.screenOf(D.head); K.text('1:02 ✓', { x: h.x + 170, y: h.y - 130, size: 88, color: GOLD, scale: popIn(K, t, wordAt(K, 'one', 'end')) }); }
          break; }
      }
    },
  };
})();
