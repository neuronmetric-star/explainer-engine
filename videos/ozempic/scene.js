// ozempic: "What the heck does Ozempic do to your body?" Plates + props + Doug (on the shot), Gary (stand-in for Dr. John Eng,
// 1992 lab, a reconstruction), polo guy (coworker / at the food truck). Plan: shotlist.md.
// Running gag: the teal "We're full." text bubble (drawn here, never painted). Every number is K.text.
(function () {
  const PI = Math.PI;
  const face = (ch, name, t, off = 0) => ch.face(((t + off) % 4.1) < .12 && name !== 'happy' ? 'blink' : name);
  const popIn = (K, t, from, dur = .35) => K.pop(K.clamp01((t - from) / dur));
  const WORDS = window.VIDEO_DATA.words, norm = w => w.toLowerCase().replace(/[^a-z0-9]/g, '');
  const wordAt = (K, w, cue) => { const t0 = K.T(cue); const x = WORDS.find(o => o.start >= t0 - .01 && norm(o.w) === w); return x ? x.start : t0; };

  // text helpers: K.text elements are pooled, so every call resets the bubble styling
  const txt = (K, s, o) => { const e = K.text(s, o); e.style.background = 'none'; e.style.borderRadius = '0'; return e; };
  const TEAL = '#14a89a';
  // the "We're full." text bubble (iMessage-style). x, y = center (screen px); k = pop scale; a = opacity; tail: 'l' | 'r'
  function bubble(K, s, x, y, o = {}) {
    const size = o.size || 54, w = o.w || Math.round(size * .56 * s.length + size * 1.2);
    const e = K.text(s, { x, y, size, w, color: '#fff', stroke: 0, shadow: false, scale: o.k === undefined ? 1 : o.k, a: o.a, rot: o.rot || 0, border: '0 solid transparent' });
    e.style.background = o.bg || TEAL; e.style.borderRadius = (o.tail === 'r' ? '.7em .7em .15em .7em' : '.7em .7em .7em .15em');
    e.style.padding = '.22em .4em'; e.style.marginTop = -(size * .78) + 'px'; e.style.boxShadow = '0 6px 0 rgba(0,0,0,.25)'; e.style.lineHeight = '1.15';
    return e;
  }

  const L = {
    office: { key: [0xfff0dc, 2.0, [-10, 7, 4]], hemi: [0xcfe0ff, 0x8a7a6a, .9], front: [0xfff2e6, 1.05], shadow: [0x2a3a5a, .38] },
    lab92: { key: [0xffc070, 2.2, [-10, 6, 3]], hemi: [0xb0d0c0, 0x6a5a40, .85], front: [0xffe8d0, 1.0], shadow: [0x1e3a30, .42] },
    park: { key: [0xfff0d0, 2.6, [-10, 12, 2]], hemi: [0xbcd8ff, 0x90a070, .8], front: [0xfff4e6, 1.05], shadow: [0x2a4a7a, .40] },
  };

  // diagram plate 03 (painting px): stomach in the lower glow, brain in the upper glow, path between
  const STOM = { ix: 512, iy: 960 }, BRAIN = { ix: 512, iy: 390 };
  const stomach = (K, o = {}) => { const p = K.img(STOM.ix, STOM.iy), s = K.imgScale(); return K.prop('P03', Object.assign({ x: p.x, y: p.y, w: 330 * s }, o)); };
  const brain = (K, glow = 0, o = {}) => { const p = K.img(BRAIN.ix, BRAIN.iy), s = K.imgScale();
    if (glow > 0) txt(K, '●', { x: p.x, y: p.y + 10 * s, size: 520 * s, color: '#fff6c8', stroke: 0, shadow: false, a: .35 * glow });
    return K.prop('P04', Object.assign({ x: p.x, y: p.y, w: 400 * s }, o)); };
  // a point along the path from the stomach (u=0) up to the brain (u=1), with a gentle S like the painted dots
  const pathAt = (K, u) => { const p0 = K.img(STOM.ix, STOM.iy - 170), p1 = K.img(BRAIN.ix, BRAIN.iy + 150);
    return { x: K.lerp(p0.x, p1.x, u) + 46 * K.imgScale() * Math.sin(u * 2 * PI), y: K.lerp(p0.y, p1.y, u) }; };
  // the scale (P06) on the diagram plate, needle angle in radians (0 = straight up)
  function scale(K, ang, labels) {
    const s = K.imgScale(), p = K.img(512, 930); K.prop('P06', { x: p.x, y: p.y, w: 560 * s, layer: 'back' });
    // dial center in the prop image: (512, 410) of 1024x1536 -> offset from prop center
    const w = 560 * s, cx = p.x + (512 / 1024 - .5) * w, cy = p.y + (410 / 1536 - .5) * w * 1.5, r = 150 * w / 1024 * 1.5;
    // the painted needle points up; cover it with a white disk and draw our own
    txt(K, '●', { x: cx, y: cy + r * .06, size: r * 2.25, color: '#fbfbf6', stroke: 0, shadow: false });
    for (let i = -4; i <= 4; i++) { const a = i * .3; K.line(cx + Math.sin(a) * r * .82, cy - Math.cos(a) * r * .82, cx + Math.sin(a) * r * .95, cy - Math.cos(a) * r * .95, { color: '#333', width: 5 }); }
    K.line(cx, cy, cx + Math.sin(ang) * r * .8, cy - Math.cos(ang) * r * .8, { color: '#d21f1f', width: 12 });
    txt(K, '●', { x: cx, y: cy, size: 70, color: '#c01818', stroke: 0, shadow: false });
    if (labels) labels(cx, cy, r);
  }

  window.SCENE = {
    plates: {
      '01': { img: '01_office_breakroom_noon.png', hz: .37, vx: .5, fov0: 55, camH: 1.55, light: L.office },
      '02': { img: '02_counter_lunch_closeup.png', hz: .35, vx: .5, fov0: 55, camH: 1.2, light: L.office },
      '03': { img: '03_inside_body_diagram.png', hz: .5, vx: .5, fov0: 55, camH: 1.5, light: 'interior' },
      '04': { img: '04_desert_sunset.png', hz: .28, vx: .5, fov0: 55, camH: .5, light: 'day' },
      '05': { img: '05_lab_1992.png', hz: .3, vx: .45, fov0: 55, camH: 2.2, light: L.lab92 },
      '06': { img: '06_drug_lab_modern.png', hz: .3, vx: .5, fov0: 55, camH: 2.6, light: 'interior' },
      '07': { img: '07_food_truck_park_noon.png', hz: .52, vx: .5, fov0: 55, camH: 1.1, light: L.park },
    },
    props: { P01: 'P01_injector_pen.png', P02: 'P02_burger_half.cut.png', P03: 'P03_stomach.png', P04: 'P04_brain.png', P05: 'P05_gila_monster.png',
      P06: 'P06_bathroom_scale.png', P07: 'P07_clogged_sink.png', P08: 'P08_venom_vial.png', P09: 'P09_melting_butter.cut.png', H01: 'H01_helicopter.png' },
    cast: { doug: 'hoodie', gary: 'oxford', polo: 'polo' },
    shots: [
      { at: 'q', plate: '02', zoom: [1.0, 1.12], focus: [[.5, .55], [.55, .58]] },
      { at: 'card', plate: '01', zoom: [1.0, 1.04], focus: [[.5, .5], [.5, .5]] },
      { at: 'shot', plate: '01', zoom: [1.06, 1.1], focus: [[.5, .48], [.5, .48]] },
      { at: 'melt', plate: '01', zoom: [1.25, 1.3], focus: [[.5, .47], [.5, .47]] },
      { at: 'burger', plate: '02', zoom: [1.15, 1.35], focus: [[.5, .56], [.46, .56]] },
      { at: 'bet', plate: '01', zoom: [1.22, 1.26], focus: [[.5, .47], [.5, .47]] },
      { at: 'gut', plate: '03', zoom: [1.0, 1.06], focus: [[.5, .55], [.5, .52]] },
      { at: 'full', plate: '03', zoom: [1.06, 1.14], focus: [[.5, .5], [.5, .4]] },
      { at: 'delete', plate: '03', zoom: [1.14, 1.14], focus: [[.5, .45], [.5, .45]] },
      { at: 'lizard', plate: '05', zoom: [1.06, 1.1], focus: [[.42, .52], [.48, .52]] },
      { at: 'chunky', plate: '04', zoom: [1.0, 1.12], focus: [[.5, .55], [.5, .55]] },
      { at: 'venom', plate: '05', zoom: [1.2, 1.3], focus: [[.55, .5], [.58, .5]] },
      { at: 'week', plate: '06', zoom: [1.0, 1.1], focus: [[.5, .5], [.5, .48]] },
      { at: 'ozempic', plate: '06', zoom: [1.3, 1.38], focus: [[.5, .45], [.5, .45]] },
      { at: 'stomach', plate: '03', zoom: [1.1, 1.2], focus: [[.5, .62], [.5, .62]] },
      { at: 'sink', plate: '03', zoom: [1.0, 1.06], focus: [[.5, .5], [.5, .5]] },
      { at: 'brain', plate: '03', zoom: [1.1, 1.15], focus: [[.5, .45], [.5, .38]] },
      { at: 'clue', plate: '02', zoom: [1.3, 1.3], focus: [[.48, .56], [.48, .56]] },
      { at: 'nomelt', plate: '01', zoom: [1.25, 1.3], focus: [[.5, .47], [.5, .47]] },
      { at: 'study', plate: '03', zoom: [1.0, 1.06], focus: [[.5, .55], [.5, .55]] },
      { at: 'pounds', plate: '03', zoom: [1.15, 1.2], focus: [[.5, .5], [.5, .5]] },
      { at: 'queasy', plate: '01', zoom: [1.25, 1.32], focus: [[.5, .47], [.5, .47]] },
      { at: 'stop', plate: '03', zoom: [1.06, 1.06], focus: [[.5, .5], [.5, .5]] },
      { at: 'back', plate: '03', zoom: [1.15, 1.22], focus: [[.5, .5], [.5, .5]] },
      { at: 'mirror', plate: '07', zoom: [1.05, 1.1], focus: [[.5, .43], [.5, .43]] },
      { at: 'ask', plate: '07', zoom: [1.1, 1.12], focus: [[.5, .43], [.5, .43]] },
      { at: 'cta', plate: '07', zoom: [1.12, 1.12], focus: [[.5, .43], [.5, .43]] },
    ],
    shakes: [['delete', .2, .3], ['clue', .2, .3], ['back', .2, .3]],
    flashes: [],
    follow: { from: 'cta+0.3' },
    tail: 1.4,

    update(t, K) {
      const id = K.shot.id, Lc = K.shot.local, at = c => K.T(c), s = K.imgScale();
      const D = K.cast.doug, G = K.cast.gary, P = K.cast.polo;
      // break room: Doug on the open floor in front of the counter; the coworker by the fridge in the back
      const room = (pol = true) => { const d = K.placeAt('doug', 520, 1030, 0);
        if (pol) { K.placeAt('polo', 270, 800, .7); face(P, 'smile', t, 2); P.pose({ t, look: .3, armR: { raise: .25, fwd: -.6 }, handR: 'fist', nod: .06 * Math.sin(t * .8) }); }
        return d; };
      const burgerOnCounter = (k = 1) => { const p = K.img(470, 612); K.prop('P02', { x: p.x, y: p.y - 40 * s, w: 170 * s * k, layer: 'back' }); };
      switch (id) {
        case 'q': { const pb = K.img(470, 830), pp = K.img(770, 930);
          K.prop('P02', { x: pb.x, y: pb.y, w: 560 * s });
          K.prop('P01', { x: pp.x, y: pp.y, w: 520 * s, rot: -.05, a: 1 });
          const a = K.clamp01((at('card') - t) / .2);
          txt(K, 'WHAT DOES OZEMPIC', { y: 300, size: 86, a, scale: .8 + .2 * popIn(K, t, at('q')) });
          txt(K, 'DO TO YOUR BODY?', { y: 405, size: 86, color: 'gold', a, scale: .8 + .2 * popIn(K, t, at('q') + .5) }); break; }
        case 'card': { burgerOnCounter(); const u = K.clamp01(Lc / 1.4), [x0, z0] = K.floorAt(760, 1400), [x1, z1] = K.floorAt(520, 1030);
          room(true); K.place('doug', K.lerp(x0, x1, u), 0, K.lerp(z0, z1, u), u < 1 ? -.6 : 0);
          face(D, 'smile', t); D.pose({ t, walk: Lc * 1.4, walkAmt: 1 - K.ease((Lc - 1.1) / .3) }); break; }
        case 'shot': { burgerOnCounter(); room(); face(D, 'smile', t); D.pose({ t, nod: .1 * Math.sin(K.clamp01(Lc / .6) * PI), gesture: 'hips', gw: K.ease((Lc - .4) / .4) });
          // 1 in 8: eight little people, one turns gold
          const tg = wordAt(K, 'eight', 'shot');
          for (let i = 0; i < 8; i++) { const x = 540 + (i - 3.5) * 112, gold = i === 5 && t > tg, k = popIn(K, t, at('shot') + i * .06), c = gold ? '#ffd23a' : '#ffffff';
            K.line(x, 262, x, 262 + 84 * k, { color: '#000', width: 66 }); K.line(x, 266, x, 262 + 78 * k, { color: c, width: 50 });
            txt(K, '●', { x, y: 228, size: 76 * k, color: c, stroke: 10 }); }
          if (t > tg) txt(K, '1 IN 8 U.S. ADULTS', { y: 420, size: 70, color: 'gold', scale: popIn(K, t, tg) }); break; }
        case 'melt': case 'nomelt': { burgerOnCounter(); room(false);
          const tf = id === 'melt' ? wordAt(K, 'melts', 'melt') : at('nomelt'), bk = popIn(K, t, tf);
          if (id === 'melt') { face(D, 'smirk', t); D.pose({ t, gesture: 'hips', gw: 1, nod: -.05 }); }
          else { face(D, Lc < .7 ? 'surprised' : 'flat', t); D.pose({ t, lean: -.08 * K.ease(Lc / .3), gesture: Lc > 1 ? 'think' : undefined, gw: K.ease((Lc - 1) / .4) }); }
          K.prop('P09', { x: 880, y: 640, w: 330 * bk, rot: .08 });
          if (id === 'melt') txt(K, 'MELTS FAT?', { y: 300, size: 90, color: 'gold', scale: popIn(K, t, tf + .2) });
          else { txt(K, '✕', { x: 880, y: 650, size: 260, color: 'red', scale: popIn(K, t, at('nomelt') + .4) }); txt(K, 'TURNS HUNGER DOWN', { y: 290, size: 74, color: 'gold', scale: popIn(K, t, wordAt(K, 'hunger', 'nomelt')) }); }
          break; }
        case 'burger': case 'clue': { const pb = K.img(470, 830); K.prop('P02', { x: pb.x, y: pb.y, w: 560 * s });
          if (id === 'clue') txt(K, 'HALF EATEN', { y: 300, size: 96, color: 'gold', scale: popIn(K, t, at('clue') + .3), rot: -.04 }); break; }
        case 'bet': { burgerOnCounter(); room(false); face(D, 'happy', t); D.pose({ t, gesture: 'tada', gw: K.ease(Lc / .4), nod: .1 * Math.sin(K.clamp01(Lc / .6) * PI) }); break; }
        case 'gut': case 'full': case 'delete': {
          stomach(K); const tf = id === 'gut' ? wordAt(K, 'were', 'gut') : at('full');   // bubble leaves when "We're full." starts
          let u = id === 'gut' ? 0 : K.ease((t - at('full')) / 1.1); if (id === 'delete') u = 1;
          brain(K, id === 'gut' ? 0 : K.clamp01((u - .9) * 10));
          if (id === 'gut') { const p = pathAt(K, 0); bubble(K, 'GLP-1', p.x, p.y - 20, { size: 64, k: popIn(K, t, wordAt(K, 'g', 'gut')) });
          }
          else if (id === 'full') { const p = pathAt(K, u); bubble(K, "We're full.", p.x, p.y, { size: 60 }); }
          else { const tm = at('delete'), tmw = wordAt(K, 'minutes', 'delete'), dk = K.clamp01((t - tm - .2) / Math.max(.6, tmw + .3 - tm - .2)), p = pathAt(K, 1), gone = t > wordAt(K, 'minutes', 'delete') + .25;
            if (!gone) bubble(K, "We're full.", p.x, p.y, { size: 60 });
            else bubble(K, "We're full.", p.x, p.y + 60 * K.clamp01((t - wordAt(K, 'minutes', 'delete') - .25) / .5), { size: 60, a: 1 - K.clamp01((t - wordAt(K, 'minutes', 'delete') - .25) / .5), bg: '#888' });
            const secs = Math.round(120 * (1 - dk)), mm = Math.floor(secs / 60), ss = String(secs % 60).padStart(2, '0');
            txt(K, `${mm}:${ss}`, { y: 300, size: 120, color: dk >= 1 ? 'red' : 'white', scale: popIn(K, t, tm) });
            if (gone) txt(K, 'DELETED', { y: 430, size: 70, color: 'red', scale: popIn(K, t, wordAt(K, 'minutes', 'delete') + .25), rot: -.05 }); }
          break; }
        case 'lizard': case 'venom': {
          const pl = K.img(890, 598); K.prop('P05', { x: pl.x, y: pl.y, w: 260 * s, layer: 'back' });
          K.placeAt('gary', 460, 1150, .7);
          if (id === 'lizard') { face(G, Lc < 1.6 ? 'flat' : 'smile', t, 1); G.pose({ t, look: .35, gesture: 'think', gw: K.ease((Lc - .4) / .4), lean: .06 });
            txt(K, '1992', { y: 290, size: 110, color: 'gold', scale: popIn(K, t, at('lizard') + .2) });
            txt(K, 'DR. JOHN ENG', { y: 400, size: 64, scale: popIn(K, t, wordAt(K, 'doctor', 'lizard')) }); }
          else { const pv = K.img(705, 575), gk = .6 + .4 * Math.sin(t * 5);
            txt(K, '●', { x: pv.x, y: pv.y, size: 300 * s, color: '#ffc040', stroke: 0, shadow: false, a: .35 * gk });
            K.prop('P08', { x: pv.x, y: pv.y, w: 190 * s, layer: 'back' });
            face(G, 'surprised', t, 1); G.pose({ t, lean: -.1 * K.ease(Lc / .3), look: .3, armR: { raise: .35 }, armL: { raise: .35 }, handR: 'open', handL: 'open' });
            txt(K, '⏱ HOURS', { y: 300, size: 100, color: 'gold', scale: popIn(K, t, wordAt(K, 'hours', 'venom')) }); }
          break; }
        case 'chunky': { const pr = K.img(540, 820); K.prop('P05', { x: pr.x, y: pr.y, w: 600 * s, anchor: [.5, .6] });
          txt(K, '≈ 4 MEALS', { y: 290, size: 100, color: 'gold', scale: popIn(K, t, wordAt(K, 'four', 'chunky')) });
          txt(K, 'A YEAR', { y: 400, size: 80, scale: popIn(K, t, wordAt(K, 'four', 'chunky') + .3) }); break; }
        case 'week': case 'ozempic': {
          const pp = K.img(512, 590); K.prop('P01', { x: pp.x, y: pp.y, w: 430 * s, rot: -.02 });
          const days = ['M', 'T', 'W', 'T', 'F', 'S', 'S'], tw = id === 'week' ? wordAt(K, 'week', 'week') : 0;
          for (let i = 0; i < 7; i++) { const on = id === 'ozempic' || t > tw + i * .12, x = 540 + (i - 3) * 118;
            txt(K, days[i], { x, y: 300, size: 76, color: on ? '#14284f' : '#fff', stroke: 0, shadow: false, w: 100, border: '6px solid #000' }).style.background = on ? '#ffd23a' : 'rgba(0,0,0,.35)'; }
          txt(K, '1 SHOT = 1 WEEK', { y: 420, size: 66, color: 'gold', scale: popIn(K, t, tw + .9), a: id === 'week' && t < tw + .9 ? 0 : 1 });
          if (id === 'ozempic') { txt(K, 'OZEMPIC', { x: pp.x, y: pp.y + 150 * s, size: 96, scale: popIn(K, t, at('ozempic') + .1) }); }
          break; }
        case 'stomach': case 'sink': {
          if (id === 'stomach') { const sq = 1 + .03 * Math.sin(t * 1.2); stomach(K, { w: 400 * s * sq });
            const p = K.img(STOM.ix, STOM.iy + 40); txt(K, '🍔', { x: p.x + 30 * Math.sin(t * .6), y: p.y, size: 110, stroke: 0, shadow: false });
            txt(K, 'EMPTIES SLOWER', { y: 300, size: 80, color: 'gold', scale: popIn(K, t, wordAt(K, 'slower', 'stomach')) }); }
          else { const p = K.img(512, 760); K.prop('P07', { x: p.x, y: p.y + 4 * Math.sin(t * 3), w: 900 * s }); }
          break; }
        case 'brain': { brain(K, 1); const tb = at('brain');
          for (let i = 0; i < 6; i++) { const tt = tb + .15 + i * .45; if (t < tt) break; const k = popIn(K, t, tt), p = K.img(BRAIN.ix, BRAIN.iy + 300 + i * 70);
            bubble(K, "We're full.", p.x + (i % 2 ? 110 : -110), p.y, { size: 56, k, tail: i % 2 ? 'r' : 'l' }); }
          break; }
        case 'study': case 'pounds': case 'back': {
          const tdrop = id === 'study' ? wordAt(K, 'fifteen', 'study') : 0;
          let ang = id === 'study' ? -.6 * K.ease((t - tdrop) / .6) : -.6;
          if (id === 'back') ang = -.6 + .4 * K.easeOut((Lc - .2) / 1.2);
          scale(K, ang);
          if (id === 'study') txt(K, '−15%', { y: 300, size: 140, color: 'gold', scale: popIn(K, t, tdrop) });
          if (id === 'pounds') { txt(K, '200 LB → 170 LB', { y: 300, size: 92, color: 'gold', scale: popIn(K, t, at('pounds') + .1) }); }
          if (id === 'back') txt(K, '2/3 CAME BACK', { y: 300, size: 100, color: 'red', scale: popIn(K, t, at('back') + .2) });
          break; }
        case 'queasy': { burgerOnCounter(); room(false); const sw = Math.sin(t * 2.2);
          face(D, 'worried', t); D.pose({ t, tilt: .12 * sw, lean: .04 * sw, armR: { raise: .2, fwd: -.75 }, handR: 'open', nod: .08 });
          txt(K, '4 IN 10', { y: 290, size: 120, color: 'red', scale: popIn(K, t, at('queasy') + .1) });
          txt(K, 'FELT QUEASY', { y: 410, size: 76, scale: popIn(K, t, wordAt(K, 'queasy', 'queasy')) }); break; }
        case 'stop': { stomach(K); brain(K, 0, { a: .55 }); const p = pathAt(K, .5), k = 1 - K.clamp01((Lc - .3) / .6);
          if (k > 0) bubble(K, "We're full.", p.x, p.y, { size: 60, a: k, bg: '#888' });
          txt(K, 'SHOT STOPPED', { y: 300, size: 92, color: 'red', scale: popIn(K, t, at('stop') + .2) }); break; }
        case 'mirror': case 'ask': case 'cta': {
          K.placeAt('polo', 800, 985, -.45); face(P, 'smile', t, 2); P.pose({ t, look: -.2 });
          const d = K.placeAt('doug', 430, 1060, .25);
          // THE HELICOPTER ENDING (PLAYBOOK §1.12a): it crosses the sky on the mirror line; Doug looks up
          const hu = id === 'mirror' ? K.helicopter(t, 'mirror', { y: 300, w: 540 }) : id === 'ask' ? K.helicopter(t, 'mirror', { y: 300, w: 540 }) : -1;
          const up = hu < 0 ? 0 : Math.sin(PI * K.clamp01((hu - .05) / .85));
          face(D, up > .3 ? 'flat' : id === 'cta' ? 'smirk' : id === 'ask' ? 'smile' : 'smile', t);
          D.pose({ t, nod: -.38 * up, armR: { raise: .2, fwd: -.85 }, armL: { raise: .2, fwd: -.85 }, handR: 'open', handL: 'open',
            gesture: id === 'ask' && up < .2 ? 'shrug' : id === 'cta' ? 'point' : undefined, gw: id === 'mirror' ? 0 : K.ease(Lc / .4) * (1 - up) });
          P.pose({ t, nod: -.3 * up, look: -.2 });
          if (id === 'mirror') { const h = K.screenOf(d.arm[1].wr); K.prop('P02', { x: h.x - 30, y: h.y - 10, w: 200 * s });
            const hd = K.screenOf(D.root); bubble(K, "We're full.", hd.x + 40, hd.y - 560 * s / 1.25, { size: 52, k: popIn(K, t, wordAt(K, 'texting', 'mirror')), a: wordAt(K, 'texting', 'mirror') < t ? 1 : 0 }); }
          if (id === 'ask') { txt(K, 'WOULD YOU TAKE A DRUG', { y: 400, size: 66, scale: popIn(K, t, at('ask')) });
            txt(K, 'FROM A LIZARD?', { y: 490, size: 80, color: 'gold', scale: popIn(K, t, at('ask') + .3) });
            txt(K, 'YES / NO', { y: 590, size: 60, scale: popIn(K, t, at('ask') + .6) }); }
          break; }
      }
    },
  };
})();
