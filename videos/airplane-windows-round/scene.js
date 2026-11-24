// airplane-windows-round · Plane Heck ep. 2: "Why are airplane windows round?"
// Built with the explainer tools (PLAYBOOK §8): K.hookReact + K.slam (the hook), K.flow (the pull), K.sit + tray occluder (Gary),
// SCENE.whip (whip-pans), continuous camera on same-plate shots, color code (white = the pull, red = the crack, gold = round).
// The 1954 Comet crashes are stated plainly with no jokes and no wreckage on screen. Ending: the signature city sunset (E01).
(function () {
  const PI = Math.PI;
  const face = (ch, name, t, off = 0) => ch.face(((t + off) % 4.1) < .12 && name !== 'happy' ? 'blink' : name);
  const popIn = (K, t, from, dur = .35) => K.pop(K.clamp01((t - from) / dur));
  const WORDS = window.VIDEO_DATA.words, norm = w => w.toLowerCase().replace(/[^a-z0-9]/g, '');
  const wordAt = (K, w, cue) => { const t0 = K.T(cue); const x = WORDS.find(o => o.start >= t0 - .01 && norm(o.w) === w); return x ? x.start : t0; };
  const ENDING = 'E01_PLACEHOLDER_tarmac.png';   // swap to 'E01_city_sunset_ending.png' when Brian paints it (docs/assets)

  const L = {
    shop: { key: [0xffc888, 2.3, [-10, 7, 3]], hemi: [0xe8d8ff, 0x9a7060, .8], front: [0xfff0e2, 1.0], shadow: [0x3a2a4a, .38] },
    seat: { key: [0xfff0d8, 1.6, [-10, 4, 4]], hemi: [0xdfeaff, 0x7a8aa0, .9], front: [0xfff4ea, 1.1], shadow: [0x2a3050, .3] },
    sunset: { key: [0xffb070, 2.6, [-12, 3, 2]], hemi: [0xffc8b0, 0x8a6a80, .8], front: [0xffe8dc, 1.0], shadow: [0x4a2a5a, .42] },
  };
  // 10 panel (image px): the square hole and its cracked top-right corner, the oval below
  const SQ = { x0: 325, y0: 245, x1: 692, y1: 588 }, CORNER = [692, 245], OV = { cx: 512, cy: 995, rx: 140, ry: 225 };
  const WIN = { cx: 178, cy: 430 };   // the window glass in 05

  window.SCENE = {
    banner: 'THE HECK?',
    whip: true,
    plates: {
      '08': { img: '08_workshop_1950s_square.png', hz: .39, vx: .42, fov0: 55, camH: 1.35, light: L.shop },
      '09': { img: '09_water_tank_test.png', hz: .45, vx: .5, fov0: 55, camH: 1.6, light: 'interior' },
      '10': { img: '10_panel_square_vs_round.png', hz: .5, vx: .5, fov0: 55, camH: 1.5, light: 'interior' },
      '05': { img: '05_window_seat_clear.png', hz: .42, vx: .5, fov0: 55, camH: 1.25, light: L.seat },
      '03': { img: '03_sky_altitude_side.png', hz: .5, vx: .5, fov0: 55, camH: 1.5, light: 'day' },
      'E': { img: ENDING, hz: .55, vx: .45, fov0: 55, camH: 1.3, light: L.sunset },
    },
    props: { TRAY5: '05_tray_front.cut.png', P08: 'P08_airliner_side.png', P10: 'P10_paper_cut.png', P11: 'P11_paper_torn.png', H01: 'H01_helicopter.png' },
    cast: { doug: { outfit: 'hoodie', hat: 'hard' }, gary: 'oxford' },
    shots: [
      { at: 'scream', plate: '08', zoom: [4.6, 1.15], focus: [[.645, .205], [.55, .42]] },     // THE HOOK: crash-zoom out from the square corner
      { at: 'q', plate: '08', zoom: [1.15, 1.35], focus: [[.55, .42], [.55, .32]] },
      { at: 'look', plate: '05', zoom: [1.05, 1.25], focus: [[.44, .47], [.32, .42]] },
      { at: 'card', plate: '08', zoom: [1.0, 1.08], focus: [[.5, .55], [.52, .55]] },
      { at: 'bet', plate: '08', zoom: [1.08, 1.18], focus: [[.52, .55], [.55, .55]] },
      { at: 'remember', plate: '03', zoom: [1.15, 1.0], focus: [[.5, .45], [.5, .48]] },
      { at: 'pull', plate: '10', zoom: [1.0, 1.08], focus: [[.5, .5], [.5, .5]] },
      { at: 'paper', plate: '10', zoom: [1.08, 1.15], focus: [[.5, .5], [.5, .48]] },
      { at: 'corner', plate: '10', zoom: [1.15, 1.7], focus: [[.5, .48], [.62, .2]] },
      { at: 'real', plate: '09', zoom: [1.0, 1.12], focus: [[.5, .5], [.5, .52]] },
      { at: 'count', plate: '10', zoom: [1.7, 2.1], focus: [[.62, .2], [.66, .17]] },
      { at: 'round', plate: '10', zoom: [2.1, 1.3], focus: [[.66, .17], [.5, .63]] },
      { at: 'spread', plate: '10', zoom: [1.3, 1.18], focus: [[.5, .63], [.5, .6]] },
      { at: 'mirror', plate: '05', zoom: [1.0, 1.08], focus: [[.5, .48], [.54, .48]] },
      { at: 'question', plate: 'E', zoom: [1.12, 1.18], focus: [[.42, .5], [.42, .5]] },
      { at: 'cta', plate: 'E', zoom: [1.18, 1.2], focus: [[.42, .5], [.42, .5]] },
    ],
    shakes: [['scream+0.3', .45, .7], ['rip', .2, .3], ['crack', .3, .45]],
    flashes: [],
    follow: { from: 'cta+0.3' },
    tail: 1.0,

    update(t, K) {
      const id = K.shot.id, Lc = K.shot.local, at = c => K.T(c);
      const D = K.cast.doug, G = K.cast.gary, s = () => K.imgScale();
      const seated = (look = -.55, fc = 'smile') => { K.place('gary', .27, -.55, -3.4, -.4); face(G, fc, t, 1); G.pose({ t, look, lean: .06 }); K.sit(G, 'cross');
        const p = K.img(512, 1268); K.prop('TRAY5', { x: p.x, y: p.y, w: 1024 * s() }); };
      const sway = (k = 1) => ({ look: .06 * k * Math.sin(t * .7), tilt: .04 * k * Math.sin(t * .9 + 1) });
      const corner = () => K.img(...CORNER);
      switch (id) {
        case 'scream': case 'q': {   // THE HOOK: the cracked square corner huge → crash-zoom out → Doug screams
          const c = K.img(664, 306), k = K.ease(K.clamp01((t + .15) / .5));   // the top-right corner of the square window painted in 08
          for (let i = 0; i < 6; i++) { const a = -.6 + i * .12, len = (60 + 30 * i) * k * s() / 1.25; K.line(c.x, c.y, c.x + Math.cos(a) * len, c.y + Math.sin(a) * len * .6 - 4 * i, { color: '#ff3b30', width: 9, a: .95 * (id === 'scream' ? K.clamp01((.55 - t) / .2) : 0) }); }
          // frame 1 = the cracked window alone; Doug jumps in from the left as the camera pulls out
          K.placeAt('doug', id === 'scream' ? K.lerp(-500, 600, K.easeOut(K.clamp01((t - .25) / .3))) : 600, 1130, -.25);
          if (id === 'scream') { K.hookReact(D, t, 'scream'); K.slam('WHAT THE HECK?!', t, 'scream'); }
          else { face(D, 'worried', t); D.pose(Object.assign({ t, look: .35 }, sway()));
            const a = K.clamp01((at('look') + .2 - t) / .3);
            K.text('WHY ARE AIRPLANE WINDOWS', { y: 290, size: 64, a, scale: .8 + .2 * popIn(K, t, at('q')) });
            K.text('ROUND?', { y: 385, size: 110, color: 'gold', a, scale: .8 + .2 * popIn(K, t, at('q') + .4) }); }
          break; }
        case 'look': {   // the oval window, Gary turns to camera on "You haven't"
          const tn = at('never'); seated(t > tn ? -.05 : -.55, t > at('scary') ? 'worried' : t > tn ? 'flat' : 'smile'); break; }
        case 'card': case 'bet': {
          const u = K.clamp01((t - at('card')) / 1.6), [x0, z0] = K.floorAt(330, 1300), [x1, z1] = K.floorAt(640, 1130);
          K.place('doug', K.lerp(x0, x1, u), 0, K.lerp(z0, z1, u), u < 1 ? .8 : -.25);
          const tl = at('living'), happy = t > at('square') + .4;
          face(D, id === 'bet' ? 'happy' : happy ? 'happy' : 'smile', t);
          D.pose(Object.assign({ t, walk: (t - at('card')) * 1.3, walkAmt: 1 - K.ease((t - at('card') - 1.3) / .5), gesture: t > at('square') ? 'tada' : undefined, gw: K.ease((t - at('square')) / .5), look: t > at('square') ? .4 : 0 }));
          if (t > tl - .1 && id === 'card') K.text('LIKE A LIVING ROOM', { y: 300, size: 76, color: 'gold', scale: popIn(K, t, tl) });
          break; }
        case 'remember': {   // the plane puffs up and shrinks back, twice (series nod to ep. 1)
          const p = K.img(512, 640), ph = Math.sin((t - at('puff')) * PI / 1.4), on = t > at('puff') ? 1 : 0, sw = 1 + .09 * Math.max(0, ph) * on;
          K.prop('P08', { x: p.x, y: p.y + 6 * Math.sin(t * 1.4), w: 900 * s() / 1.25 * sw });
          if (on) for (let i = 0; i < 8; i++) { const a = i / 8 * 2 * PI, out = ph > 0, r0 = out ? 300 : 430, r1 = out ? 430 : 300;
            K.flow(t, p.x + Math.cos(a) * r0, p.y + Math.sin(a) * r0 * .45, p.x + Math.cos(a) * r1, p.y + Math.sin(a) * r1 * .45, { width: 11, a: Math.abs(ph), ph: i * .13 }); }
          if (t < at('puff')) K.text('LIKE A BALLOON', { y: 300, size: 80, color: 'gold', scale: popIn(K, t, at('remember') + .6) });
          break; }
        case 'pull': case 'paper': case 'corner': {
          // the pull: white streams pulling outward around both holes; at the corner they bunch up red
          const k = id === 'pull' ? K.ease(Lc / .6) : 1, pa = id === 'paper' ? .25 : 1;
          const sq = [[SQ.x0 - 120, SQ.y0 + 170, SQ.x0 - 10, SQ.y0 + 170], [SQ.x1 + 120, SQ.y0 + 170, SQ.x1 + 10, SQ.y0 + 170], [(SQ.x0 + SQ.x1) / 2, SQ.y0 - 140, (SQ.x0 + SQ.x1) / 2, SQ.y0 - 10]];
          sq.forEach(([a, b, c, d], i) => { const p0 = K.img(a, b), p1 = K.img(c, d); K.flow(t, p1.x, p1.y, p0.x, p0.y, { width: 11, a: k * pa, ph: i * .3 }); });
          for (let i = 0; i < 4; i++) { const ang = i / 4 * 2 * PI + .4, p1 = K.img(OV.cx + Math.cos(ang) * (OV.rx + 15), OV.cy + Math.sin(ang) * (OV.ry + 15)), p0 = K.img(OV.cx + Math.cos(ang) * (OV.rx + 130), OV.cy + Math.sin(ang) * (OV.ry + 130));
            K.flow(t, p1.x, p1.y, p0.x, p0.y, { width: 11, a: k * pa, ph: i * .25 }); }
          if (id === 'paper') {   // the paper: hard to rip... a tiny cut... it rips easy
            const tr = at('rip'), tn = at('notch'), p = K.img(512, 780), w = 640 * s() / 1.25, torn = t > tr;
            if (!torn) { K.prop('P10', { x: p.x + 6 * Math.sin(t * 30) * K.clamp01((at('notch') - t) * (t > at('hard') ? 1 : 0)), y: p.y, w, rot: -.03 });
              if (t > tn) { const n = { x: p.x, y: p.y - w * 1.5 * .5 * .88 }; K.text('◯', { x: n.x, y: n.y + 30, size: 90, color: 'gold', stroke: 6, scale: popIn(K, t, tn) }); } }
            else { const g = K.easeOut(K.clamp01((t - tr) / .4)) * 26; K.prop('P11', { x: p.x, y: p.y, w: w * (1 + g / 400), rot: -.03 + .03 * K.clamp01((t - tr) / .4) });
              K.text('EASY', { y: 300, size: 110, color: 'red', scale: popIn(K, t, tr + .1) }); }
            if (t > at('hard') && t < tn) K.text('HARD', { y: 300, size: 110, scale: popIn(K, t, at('hard')) }); }
          if (id === 'corner') {   // the pull piles into the sharp corner (red), the oval's flow stays smooth
            const c = corner(), kk = K.ease((t - at('crowd') + .3) / .6);
            for (let i = 0; i < 5; i++) { const a = PI + .5 + i * .28, r = 180 * s() / 1.25; K.flow(t, c.x + Math.cos(a) * r, c.y - Math.sin(a) * r * -1, c.x - 8, c.y + 8, { width: 10, color: '#ff3b30', a: kk, ph: i * .2, speed: 1.4 }); }
            K.text('THE CORNER', { y: 300, size: 92, color: 'red', scale: popIn(K, t, at('crowd')) }); }
          break; }
        case 'real': {   // the true story, plainly: the year, then the tank test with a counter of flights
          const tc = at('comet'), tt = at('tank');
          if (t > tc - .2 && t < tt) K.text('1954', { y: 300, size: 120, scale: popIn(K, t, tc - .2) });
          if (t > tt) { const n = Math.round(3000 * K.clamp01((t - at('pump')) / 2.6)); K.text(n.toLocaleString('en-US') + ' FLIGHTS', { y: 300, size: 92, color: 'gold', a: K.clamp01((t - at('pump')) / .3) });
            for (let i = 0; i < 10; i++) { const ph = (t * .4 + i * .1) % 1, q = K.img(200 + i * 70, 600 + 10 * Math.sin(t * 2 + i)); K.text('●', { x: q.x, y: q.y - ph * 30, size: 14, color: '#bff0ff', stroke: 0, shadow: false, a: (1 - ph) * .8 }); } }
          break; }
        case 'count': {   // it cracked, right at the corner (the crack grows red along the painted one)
          const c = corner(), g = K.easeOut(K.clamp01((t - at('crack')) / .6)), pts = [[0, 0], [30, -22], [58, -26], [80, -48], [110, -60], [142, -86], [160, -105]];
          for (let i = 1; i < pts.length * g; i++) { const a = K.img(CORNER[0] + pts[i - 1][0], CORNER[1] + pts[i - 1][1]), b = K.img(CORNER[0] + pts[i][0], CORNER[1] + pts[i][1]); K.line(a.x, a.y, b.x, b.y, { color: '#ff3b30', width: 9 }); }
          if (t > at('crack')) K.text('CRACK', { y: 300, size: 120, color: 'red', scale: popIn(K, t, at('crack')), rot: -.05 });
          break; }
        case 'round': case 'spread': {   // round: the pull flows smoothly around the oval, nowhere for a crack to start
          const k = K.ease((t - at('round') - .6) / .6), o = K.img(OV.cx, OV.cy);
          for (let i = 0; i < 6; i++) { const ang = i / 6 * 2 * PI, p1 = K.img(OV.cx + Math.cos(ang) * (OV.rx + 15), OV.cy + Math.sin(ang) * (OV.ry + 15)), p0 = K.img(OV.cx + Math.cos(ang) * (OV.rx + 140), OV.cy + Math.sin(ang) * (OV.ry + 140));
            K.flow(t, p1.x, p1.y, p0.x, p0.y, { width: 11, a: k, ph: i * .17 }); }
          { const pul = 1 + .02 * Math.sin(t * 4), N = 48; let prev = null;   // a gold ring hugging the oval
            for (let i = 0; i <= N * k; i++) { const a = i / N * 2 * PI - PI / 2, q = K.img(OV.cx + Math.cos(a) * (OV.rx + 28) * pul, OV.cy + Math.sin(a) * (OV.ry + 28) * pul);
              if (prev) K.line(prev.x, prev.y, q.x, q.y, { color: '#ffd23f', width: 16, a: .9 }); prev = q; } }
          if (t > at('round') + .2) K.text('ROUND', { y: 300, size: 120, color: 'gold', scale: popIn(K, t, at('round') + .2) });
          break; }
        case 'mirror': {   // a window like a living room... he got one like a fishbowl
          seated(t > at('porthole') ? -.55 : -.2, t > at('porthole') ? 'smirk' : 'smile');
          if (t > at('porthole')) K.text('LIKE A FISHBOWL', { y: 300, size: 80, color: 'gold', scale: popIn(K, t, at('porthole')) });
          break; }
        case 'question': case 'cta': {   // THE SIGNATURE GOODBYE: the city sunset, the helicopter crosses, Doug looks up
          K.placeAt('doug', 300, 1110, .3); K.placeAt('gary', 640, 1090, -.3);
          const hu = t < at('cta') ? K.helicopter(t, 'question', { y: 360, w: 520 }) : -1, up = hu < 0 ? 0 : Math.sin(PI * K.clamp01((hu - .05) / .85));
          face(D, up > .3 ? 'flat' : id === 'cta' ? 'smirk' : 'smile', t);
          D.pose(Object.assign({ t, nod: -.38 * up, gesture: id === 'cta' ? 'point' : 'hips', gw: id === 'cta' ? K.ease((Lc - .3) / .4) : 1 - up }, sway(1 - up)));
          face(G, 'smile', t, 1); G.pose(Object.assign({ t, nod: -.25 * up }, sway(1 - up)));
          if (id === 'question' && t > wordAt(K, 'there', 'question')) K.text("THERE AREN'T ANY", { y: 430, size: 80, color: 'gold', scale: popIn(K, t, wordAt(K, 'there', 'question')) });
          break; }
      }
    },
  };
})();
