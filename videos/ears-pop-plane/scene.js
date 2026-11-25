// ears-pop-plane · Plane Heck ep. 3: "Why do your ears pop on a plane?"
// Built with the explainer tools (PLAYBOOK §8) + the creator-research visual rules (.claude/skills/visual):
// a change every ~2-3 s, live counters/labels, emotion in bodies and props (no dialogue), 2-4 word caption chunks (TEST),
// no shouted "WHAT THE HECK?!" (A/B), no follow button (send-to-a-friend line is the CTA). Ending: the signature city sunset (E01).
// Color code: white = air/push, red = squeezed/shut, gold = the door opens / the answer.
(function () {
  const PI = Math.PI;
  const face = (ch, name, t, off = 0) => ch.face(((t + off) % 4.1) < .12 && name !== 'happy' && name !== 'blink' ? 'blink' : name);
  const popIn = (K, t, from, dur = .35) => K.pop(K.clamp01((t - from) / dur));
  const WORDS = window.VIDEO_DATA.words, norm = w => w.toLowerCase().replace(/[^a-z0-9]/g, '');
  const wordAt = (K, w, cue) => { const t0 = K.T(cue); const x = WORDS.find(o => o.start >= t0 - .01 && norm(o.w) === w); return x ? x.start : t0; };
  const ENDING = 'E01_city_sunset_ending.png';   // the series' signature goodbye (docs/assets)
  const GOLD = '#ffd23f', RED = '#ff3b30';

  const L = {
    seat: { key: [0xfff0d8, 1.6, [-10, 4, 4]], hemi: [0xdfeaff, 0x7a8aa0, .9], front: [0xfff4ea, 1.1], shadow: [0x2a3050, .3] },
    cabin: { key: [0xffe0b0, 1.7, [8, 6, 4]], hemi: [0xdfe4ff, 0x6a6a90, .85], front: [0xfff2e4, 1.0], shadow: [0x2a3050, .3] },
    ear: { key: [0xffd8c8, 1.7, [-8, 6, 5]], hemi: [0xffe6dc, 0xc08090, .9], front: [0xfff0ea, 1.1], shadow: [0x6a3050, .3] },
    sunset: { key: [0xffb070, 2.6, [-12, 3, 2]], hemi: [0xffc8b0, 0x8a6a80, .8], front: [0xffe8dc, 1.0], shadow: [0x4a2a5a, .42] },
  };
  // 11 ear cutaway (image px, 1024x1536)
  const DRUM = { cx: 365, cy: 690, rx: 70, ry: 150 }, POCKET = [505, 650], DOOR = { cx: 862, cy: 868, r: 120 };
  const TUBE = [[560, 760], [640, 860], [745, 925]];

  window.SCENE = {
    banner: 'THE HECK?',
    whip: true,
    captionChunk: 3,   // TEST (creator research): 2-4 word chunks instead of one word at a time
    plates: {
      '11': { img: '11_ear_cutaway.png', hz: .52, vx: .5, fov0: 55, camH: 1.6, light: L.ear },
      '12': { img: '12_mountain_road.png', hz: .42, vx: .62, fov0: 55, camH: 1.5, light: 'day' },
      '01': { img: '01_cabin_aisle_morning.png', hz: .31, vx: .76, fov0: 55, camH: 2.6, light: L.cabin },
      '05': { img: '05_window_seat_clear.png', hz: .42, vx: .5, fov0: 55, camH: 1.25, light: L.seat },
      '03': { img: '03_sky_altitude_side.png', hz: .5, vx: .5, fov0: 55, camH: 1.5, light: 'day' },
      'E': { img: ENDING, hz: .45, vx: .5, fov0: 55, camH: 2.0, light: L.sunset },
    },
    props: { TRAY5: '05_tray_front.cut.png', P08: 'P08_airliner_side.png', P12: 'P12_chip_bag_flat.png', P13: 'P13_chip_bag_puffed.png', P14: 'P14_gum_pack.cut.png', H01: 'H01_helicopter.png' },
    cast: { doug: { outfit: 'hoodie', hat: 'hard' }, gary: 'oxford' },
    shots: [
      { at: 'hook', plate: '11', zoom: [4.6, 1.15], focus: [[.357, .45], [.5, .5]] },          // THE HOOK: the giant drum bulging → crash-zoom out in 0.55 s
      { at: 'hook+0.55', plate: '11', zoom: [1.15, 1.2], focus: [[.5, .5], [.5, .5]] },       // hold the two-shot: Gary whole and screaming
      { at: 'notbroken', plate: '11', zoom: [1.2, 1.35], focus: [[.5, .5], [.4, .46]] },
      { at: 'door', plate: '11', zoom: [1.35, 2.1], focus: [[.4, .46], [.84, .56]] },
      { at: 'drum', plate: '11', zoom: [2.1, 1.05], focus: [[.84, .56], [.5, .5]] },
      { at: 'tube', plate: '11', zoom: [1.05, 1.5], focus: [[.5, .5], [.72, .58]] },
      { at: 'card', plate: '01', zoom: [1.0, 1.12], focus: [[.4, .6], [.4, .6]] },
      { at: 'bag', plate: '12', zoom: [1.0, 1.15], focus: [[.5, .62], [.5, .66]] },
      { at: 'same', plate: '11', zoom: [1.2, 1.3], focus: [[.4, .47], [.68, .55]] },
      { at: 'perfect', plate: '01', zoom: [1.12, 1.2], focus: [[.4, .6], [.35, .62]] },
      { at: 'more', plate: '03', zoom: [1.12, 1.0], focus: [[.5, .45], [.5, .5]] },
      { at: 'squeeze', plate: '11', zoom: [1.3, 1.45], focus: [[.45, .5], [.55, .53]] },
      { at: 'swallow', plate: '11', zoom: [1.5, 2.0], focus: [[.5, .52], [.84, .56]] },
      { at: 'asleep', plate: '05', zoom: [1.0, 1.12], focus: [[.5, .48], [.4, .48]] },
      { at: 'gum', plate: '05', zoom: [1.12, 1.25], focus: [[.4, .48], [.5, .52]] },
      { at: 'cabin', plate: '03', zoom: [1.15, 1.0], focus: [[.5, .45], [.5, .48]] },
      { at: 'small', plate: '11', zoom: [1.0, 1.5], focus: [[.5, .5], [.42, .5]] },
      { at: 'diy', plate: 'E', zoom: [1.04, 1.1], focus: [[.5, .53], [.5, .5]] },
      { at: 'cta', plate: 'E', zoom: [1.1, 1.1], focus: [[.5, .5], [.5, .48]] },
    ],
    shakes: [['hook+0.3', .45, .7], ['pop', .22, .35], ['ouch', .25, .4]],
    flashes: [['hook+0.28', .22, .7], ['pop', .15, .45]],
    tail: 1.0,

    update(t, K) {
      const id = K.shot.id === 'hook+0.55' ? 'hook' : K.shot.id, Lc = K.shot.local, at = c => K.T(c);
      const D = K.cast.doug, G = K.cast.gary, s = () => K.imgScale();
      const sway = (k = 1) => ({ look: .06 * k * Math.sin(t * .7), tilt: .04 * k * Math.sin(t * .9 + 1) });
      const ring = (cx, cy, rx, ry, color, k = 1, w = 14, a = .9) => { const N = 44; let prev = null; const pul = 1 + .02 * Math.sin(t * 4);
        for (let i = 0; i <= N * k; i++) { const an = i / N * 2 * PI - PI / 2, q = K.img(cx + Math.cos(an) * rx * pul, cy + Math.sin(an) * ry * pul); if (prev) K.line(prev.x, prev.y, q.x, q.y, { color, width: w, a }); prev = q; } };
      const burst = (cx, cy, t0, color = GOLD) => { const u = K.clamp01((t - t0) / .5); if (u <= 0 || u >= 1) return; const c = K.img(cx, cy);
        for (let i = 0; i < 10; i++) { const an = i / 10 * 2 * PI + .2, r0 = (70 + 40 * u) * s(), r1 = (150 + 130 * u) * s();
          K.line(c.x + Math.cos(an) * r0, c.y + Math.sin(an) * r0, c.x + Math.cos(an) * r1, c.y + Math.sin(an) * r1, { color, width: 12, a: 1 - u }); } };
      const seatedGary = (fc, o = {}) => { K.place('gary', .27, -.55, -3.4, -.4); face(G, fc, t, 1); G.pose(Object.assign({ t, look: -.2, lean: .06 }, o)); K.sit(G, 'cross');
        const p = K.img(512, 1268); K.prop('TRAY5', { x: p.x, y: p.y, w: 1024 * s() }); };
      const earPlate = () => {   // overlays that live on the ear painting; staged by cue
        const tPop = at('pop'), tSame = at('same'), tPerfect = at('perfect');
        if (id === 'hook' || id === 'notbroken') {   // title in the first 2 s, then NOT BROKEN
          const a = id === 'hook' ? 1 : K.clamp01((at('door') - t) / .3);
          if (id === 'hook') { K.text('WHY DO YOUR EARS', { y: 250, size: 74, a: K.clamp01(t / .25), scale: .9 + .1 * popIn(K, t, 0) });
            K.text('POP ON A PLANE?', { y: 350, size: 100, color: 'gold', a: K.clamp01(t / .25), scale: .9 + .1 * popIn(K, t, .15) }); }
          else { K.text('NOT BROKEN', { y: 300, size: 110, color: 'gold', a, scale: popIn(K, t, at('notbroken')) });
            const c = K.img(DRUM.cx + 150, DRUM.cy - 160); K.text('✖', { x: c.x, y: c.y, size: 120, color: 'red', a: a * K.clamp01((t - at('notbroken') - .3) / .2) }); }
        }
        if (id === 'door') { ring(DOOR.cx, DOOR.cy, DOOR.r, DOOR.r * 1.05, GOLD, K.ease(Lc / .5));
          K.text('THE DOOR', { y: 300, size: 110, color: 'gold', scale: popIn(K, t, at('door')) });
          if (t > at('shut')) K.text('SHUT', { y: 420, size: 120, color: 'red', scale: popIn(K, t, at('shut')), rot: -.04 }); }
        if (id === 'drum') { const k = K.ease(Lc / .4);
          { const c = K.img(DRUM.cx, DRUM.cy - 190); K.text('DRUM', { x: c.x, y: c.y - 30, size: 76, a: k }); }
          { const c = K.img(POCKET[0] + 30, POCKET[1] - 150); K.text('AIR', { x: c.x, y: c.y, size: 76, color: '#bfe8ff', a: k * K.clamp01((t - at('drum') - .8) / .3) }); }
          for (let i = 0; i < 3; i++) { const a = K.img(POCKET[0] - 20, POCKET[1] - 40 + i * 70), b = K.img(POCKET[0] + 40, POCKET[1] - 40 + i * 70); K.flow(t, a.x, a.y, b.x, b.y, { width: 8, a: .8, ph: i * .3, speed: .7 }); } }
        if (id === 'tube') { const k = K.ease(Lc / .4), a = K.img(TUBE[0][0], TUBE[0][1]), b = K.img(TUBE[2][0], TUBE[2][1]);
          K.flow(t, a.x, a.y, b.x, b.y, { width: 9, a: .85, speed: .6 });
          K.text('TO YOUR THROAT', { x: 440, y: 520, size: 66, a: k }); ring(DOOR.cx, DOOR.cy, DOOR.r, DOOR.r * 1.05, GOLD, 1, 12, .8); }
        if (id === 'same') {   // the air behind the drum pushes it out; then the door opens: POP
          const push = K.clamp01((tPop - t) / .6 + 0) * 1, k = K.ease(Lc / .4);
          for (let i = 0; i < 3; i++) { const a = K.img(POCKET[0] + 30, POCKET[1] - 60 + i * 70), b = K.img(DRUM.cx + 45, POCKET[1] - 60 + i * 70); K.flow(t, a.x, a.y, b.x, b.y, { width: 12, a: k * (t < tPop ? 1 : .2), ph: i * .25 }); }
          if (t < tPop) K.text('PUSHES OUT', { y: 300, size: 100, scale: popIn(K, t, tSame + .3) });
          if (t >= tPop - .05) { ring(DOOR.cx, DOOR.cy, DOOR.r, DOOR.r * 1.05, GOLD, 1, 14, .95); burst(DOOR.cx, DOOR.cy, tPop - .05);
            K.text('POP', { y: 360, size: 190, color: 'gold', scale: popIn(K, t, tPop - .05, .25), rot: -.06 }); } }
        if (id === 'squeeze') {   // outside pushes MORE: red arrows squeeze the drum in; the door stays shut
          const k = K.ease(Lc / .4), tStuck = at('stuck');
          for (let i = 0; i < 3; i++) { const a = K.img(DRUM.cx - 250, DRUM.cy - 100 + i * 100), b = K.img(DRUM.cx - 50, DRUM.cy - 100 + i * 100); K.flow(t, a.x, a.y, b.x, b.y, { width: 15, color: RED, a: k, ph: i * .3 }); }
          if (t < tStuck) K.text('SQUEEZED IN', { y: 300, size: 100, color: 'red', scale: popIn(K, t, at('squeeze') + .2) });
          else { ring(DOOR.cx, DOOR.cy, DOOR.r, DOOR.r * 1.05, RED, 1, 14, .95); K.text('STILL SHUT', { y: 300, size: 100, color: 'red', scale: popIn(K, t, tStuck) }); }
          if (t > at('ouch') - .1) { K.placeAt('gary', 600 + 6 * Math.sin(t * 40) * K.clamp01(1 - (t - at('ouch')) / .6), 1260, .1); K.hookReact(G, t, at('ouch') - .28); K.text('OUCH', { y: 440, size: 130, color: 'red', rot: .05, scale: popIn(K, t, at('ouch')) }); } }
        if (id === 'swallow') {   // each swallow tugs the door open a crack (gold)
          const k = K.ease(Lc / .4), tug = .5 + .5 * Math.sin(t * 6); ring(DOOR.cx, DOOR.cy, DOOR.r, DOOR.r * 1.05, GOLD, 1, 12, .85);
          { const a = K.img(DOOR.cx + 70, DOOR.cy - 30), b = K.img(DOOR.cx + 150 + 25 * tug, DOOR.cy - 90 - 10 * tug); K.flow(t, a.x, a.y, b.x, b.y, { width: 12, color: GOLD, a: k, speed: 1.2 }); }
          K.line(...(() => { const a = K.img(DOOR.cx - 78, DOOR.cy - 70), b = K.img(DOOR.cx - 78, DOOR.cy + 70); return [a.x, a.y, b.x, b.y]; })(), { color: GOLD, width: 10 + 8 * tug, a: .55 * k });
          K.text('SWALLOW', { y: 300, size: 120, color: 'gold', scale: popIn(K, t, at('swallow')) });
          if (t > at('perfect2')) K.text('PERFECT!', { y: 430, size: 110, color: 'gold', scale: popIn(K, t, at('perfect2')), rot: -.04 }); }
        if (id === 'small') {   // without the pumped-up cabin the squeeze would be far bigger; the pop you feel is the small version
          const tm = at('mirror'), tf = at('flip');
          if (t < tf) { const g = K.ease((t - at('small') - .2) / .6), fade = 1 - K.clamp01((t - tm) / .6) * .6; ring(DRUM.cx, DRUM.cy, DRUM.rx * (1 + .9 * g), DRUM.ry * (1 + .9 * g), RED, g, 18, .85 * fade);
            if (t < tm) K.text('FAR BIGGER', { y: 300, size: 108, color: 'red', scale: popIn(K, t, at('small') + .3) }); }
          if (t > tm - .1 && t < tf + 3) { const c = K.img(DOOR.cx, DOOR.cy - 10); if (t >= tf - .05) { burst(DOOR.cx, DOOR.cy, tf - .05); K.text('SMALL', { y: 300, size: 150, color: 'gold', scale: popIn(K, t, tf - .05, .3) }); } }
          if (t >= tf - .05) ring(DOOR.cx, DOOR.cy, DOOR.r * .8, DOOR.r * .84, GOLD, 1, 10, .8); }
      };
      switch (id) {
        case 'hook': case 'notbroken': case 'door': case 'drum': case 'tube': case 'same': case 'squeeze': case 'swallow': case 'small': {
          // cast on the ear plate: Gary jumps in at the hook, worried at "not broken"; the swallow shot shows him gulping
          K.cast.doug.root.visible = false;
          if (id === 'hook') { K.placeAt('gary', K.lerp(1200, 650, K.easeOut(K.clamp01((t - .1) / .3))), 1230, -.12); K.hookReact(G, t, 'hook'); }
          else if (id === 'notbroken') { K.placeAt('gary', 650, 1230, -.12); face(G, 'worried', t); G.pose(Object.assign({ t, look: -.25, armR: { raise: .45 }, handR: 'open' }, sway())); }
          else if (id === 'swallow') { K.cast.gary.root.visible = false; }
          else if (id !== 'squeeze') { K.cast.gary.root.visible = false; }
          earPlate(); break; }
        case 'card': {   // passengers grab their ears on every flight; Doug has a problem
          const u = K.clamp01(Lc / 1.2), [x0, z0] = K.floorAt(150, 1290), [x1, z1] = K.floorAt(260, 1200);
          K.place('doug', K.lerp(x0, x1, u), 0, K.lerp(z0, z1, u), .35); face(D, t > at('grab') - .3 ? 'worried' : 'smile', t);
          D.pose(Object.assign({ t, walk: Lc * 1.3, walkAmt: 1 - K.ease((Lc - 1) / .5) }, t > at('grab') ? sway() : {}));
          if (t > at('grab')) { K.placeAt('gary', 600, 1170, -.3); K.cast.gary.root.visible = true; face(G, t > at('gary') ? 'scream' : 'worried', t);
            G.pose({ t, armR: { raise: .8 }, armL: { raise: .8 }, handR: 'open', handL: 'open', lean: -.1, nod: .1 * Math.sin(t * 9) }); }
          else K.cast.gary.root.visible = false;
          if (t > at('gary')) K.text('OW!', { y: 300, size: 150, color: 'red', rot: -.06, scale: popIn(K, t, at('gary')) });
          else if (t > at('grab')) K.text('EARS!', { y: 300, size: 120, color: 'gold', scale: popIn(K, t, at('grab')) });
          break; }
        case 'bag': {   // a chip bag on a mountain puffs up because the air outside pushes less
          const tl = at('less'), u = K.ease((t - at('bag') - .5) / 2.2), n = Math.round(K.lerp(1000, 8000, u) / 100) * 100, p = K.img(512, 1130);
          const puff = K.easeOut(K.clamp01((t - tl) / .6)), w = 330 * s();
          if (t < tl + .2) K.prop('P12', { x: p.x, y: p.y, w, a: 1 - puff, rot: -.03 + .02 * Math.sin(t * 3) });
          K.prop('P13', { x: p.x, y: p.y - 25 * puff * s(), w: w * (1.08 + .12 * puff), a: puff, rot: -.03 + .02 * Math.sin(t * 3) });
          K.text(n.toLocaleString('en-US') + ' FT', { y: 290, size: 118, color: 'gold', a: K.clamp01((t - at('bag')) / .3) });
          if (t > tl - .2) { for (let i = 0; i < 3; i++) { const side = i - 1, a = K.img(512 + side * 330, 880 + 60 * Math.abs(side)), b = K.img(512 + side * 250, 930 + 60 * Math.abs(side));
              K.flow(t, a.x, a.y, b.x, b.y, { width: 6, a: .75 * K.clamp01((t - tl + .2) / .3), ph: i * .2 }); }
            for (let i = 0; i < 4; i++) { const an = -PI / 2 + (i - 1.5) * .7, c = K.img(512, 1105), r0 = 190 * s(), r1 = 300 * s();
              K.flow(t, c.x + Math.cos(an) * r0, c.y + Math.sin(an) * r0, c.x + Math.cos(an) * r1, c.y + Math.sin(an) * r1, { width: 13, a: puff, ph: i * .2 }); }
            K.text('PUSHES LESS', { y: 420, size: 104, scale: popIn(K, t, tl) }); }
          K.cast.gary.root.visible = false; K.cast.doug.root.visible = false; break; }
        case 'perfect': {   // "Perfect!" ... "Except…": Doug's smile drops
          const ex = at('except'); K.place('doug', ...(() => { const [x, z] = K.floorAt(300, 1210); return [x, 0, z]; })(), .3);
          face(D, t > ex ? 'worried' : 'happy', t); D.pose(Object.assign({ t, gesture: t < ex ? 'tada' : 'shrug', gw: K.ease(Lc / .4) }, sway()));
          K.cast.gary.root.visible = false;
          if (t < ex) K.text('PERFECT!', { y: 300, size: 130, color: 'gold', scale: popIn(K, t, at('perfect')), rot: -.04 });
          else K.text('EXCEPT…', { y: 300, size: 130, color: 'red', scale: popIn(K, t, ex), rot: .04 });
          break; }
        case 'more': {   // coming down: the air outside pushes MORE (strong arrows into the plane)
          const p = K.img(512, 640 + 40 * K.clamp01(Lc / 3)), k = K.ease(Lc / .5);
          K.prop('P08', { x: p.x, y: p.y + 6 * Math.sin(t * 1.4), w: 720 * s(), rot: .06 * K.clamp01(Lc / 1.5) });
          for (let i = 0; i < 6; i++) { const an = i / 6 * 2 * PI + .3, c = p, r0 = 470 * s(), r1 = 300 * s();
            K.flow(t, c.x + Math.cos(an) * r0, c.y + Math.sin(an) * r0 * .5, c.x + Math.cos(an) * r1, c.y + Math.sin(an) * r1 * .5, { width: 16, a: k, ph: i * .17 }); }
          K.text('PUSHES MORE', { y: 300, size: 118, color: 'red', scale: popIn(K, t, at('more')) });
          K.cast.gary.root.visible = false; K.cast.doug.root.visible = false; break; }
        case 'asleep': case 'gum': {   // Gary falls asleep (no swallowing); Doug hands out gum
          const asleep = id === 'asleep' || t < at('gum') + 1.6;
          seatedGary(asleep ? 'blink' : 'smile', asleep ? { nod: .55, tilt: .22, look: 0 } : { nod: .1 * Math.max(0, Math.sin(t * 9)), look: -.3 });
          K.cast.doug.root.visible = false;
          if (id === 'asleep') { for (let i = 0; i < 3; i++) { const ph = ((t * .5 + i / 3) % 1), q = K.img(330 + i * 36, 620 - ph * 140); K.text('Z', { x: q.x, y: q.y, size: 70 + i * 20, color: '#cfe6ff', a: Math.sin(ph * PI) }); }
            if (t > at('nosw')) K.text('NO SWALLOWING', { y: 300, size: 94, color: 'red', scale: popIn(K, t, at('nosw')) });
            else K.text('ASLEEP', { y: 300, size: 120, color: 'gold', scale: popIn(K, t, at('asleep')) }); }
          else { const k = K.easeOut(K.clamp01(Lc / .5)), p = K.img(K.lerp(1300, 800, k), 1010); K.prop('P14', { x: p.x, y: p.y + 10 * Math.sin(t * 3), w: 260 * s(), rot: -.12 });
            if (t > at('gum') + 1.6) K.text('CHEW = SWALLOW', { y: 300, size: 90, color: 'gold', scale: popIn(K, t, at('gum') + 1.6) }); }
          break; }
        case 'cabin': {   // the plane pumps itself full of air: up to 8,000 ft, like a mountain town, not the top of the sky
          const tp = at('pump'), tn = at('notsky'), p = K.img(512, 640), puff = 1 + .05 * K.ease((t - tp) / .8);
          K.prop('P08', { x: p.x, y: p.y + 6 * Math.sin(t * 1.4), w: 720 * s() * puff });
          if (t > tp - .1) for (let i = 0; i < 6; i++) { const an = i / 6 * 2 * PI + .3, r0 = 470 * s(), r1 = 300 * s();
            K.flow(t, p.x + Math.cos(an) * r1, p.y + Math.sin(an) * r1 * .5, p.x + Math.cos(an) * r0, p.y + Math.sin(an) * r0 * .5, { width: 12, a: K.clamp01((t - tp) / .4), ph: i * .17 }); }
          K.text('THE CABIN', { y: 290, size: 110, a: t < tp ? 1 : 0 });
          if (t >= tp) K.text('UP TO 8,000 FT', { y: 290, size: 108, color: 'gold', scale: popIn(K, t, tp) });
          if (t >= tn) K.text('LIKE A MOUNTAIN TOWN', { y: 410, size: 66, scale: popIn(K, t, tn) });
          K.cast.gary.root.visible = false; K.cast.doug.root.visible = false; break; }
        case 'diy': case 'cta': {   // THE SIGNATURE GOODBYE: the city sunset, the helicopter crosses, the winner looks up
          K.placeAt('doug', 360, 1270, .3); K.placeAt('gary', 680, 1240, -.3);
          const hu = K.helicopter(t, 'diy', { y: 360, w: 520, dur: 3.9 }), up = hu < 0 ? 0 : Math.sin(PI * K.clamp01((hu - .05) / .85));
          face(D, up > .3 ? 'flat' : 'smirk', t);
          D.pose(Object.assign({ t, nod: -.38 * up, gesture: id === 'cta' ? 'point' : 'hips', gw: id === 'cta' ? K.ease((Lc - .3) / .4) : 1 - up }, sway(1 - up)));
          const sw = wordAt(K, 'swallow', 'diy'); face(G, 'smile', t, 1);
          G.pose(Object.assign({ t, nod: -.25 * up + .14 * Math.max(0, Math.sin((t - sw) * 7)) * (t > sw && t < sw + 1.3 ? 1 : 0) }, sway(1 - up)));
          if (id === 'diy' && t > sw) K.text('SWALLOW ON THE WAY DOWN', { y: 470, size: 66, color: 'gold', scale: popIn(K, t, sw) });
          break; }
      }
    },
  };
})();
