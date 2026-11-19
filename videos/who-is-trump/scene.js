// who-is-trump: plates + props + the President (silent). See shotlist.md for the plan.
// Positions are in plate world units (feet at y=0); props in screen px; painting coords via K.img(ix,iy).
(function () {
  const PI = Math.PI;
  const face = (ch, name, t, off = 0) => ch.face(((t + off) % 4.1) < .12 && name !== 'happy' ? 'blink' : name);
  const hash = i => { const x = Math.sin(i * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); };
  // a pop-in overlay: scale overshoot over .3 s from time t0
  const popIn = (K, t, t0, d = .3) => K.pop(K.clamp01((t - t0) / d));
  // year tag, top centre
  const year = (K, t, key, t0) => { const p = popIn(K, t, t0); if (p > 0) K.prop(key, { x: 540, y: 300, w: 360 * p, layer: 'front' }); };
  // falling confetti in front of everything
  function confetti(K, t, t0, n = 46, a = 1) {
    if (t < t0) return; const cols = ['C_red', 'C_white', 'C_blue', 'C_gold'];
    for (let i = 0; i < n; i++) { const sp = 260 + hash(i) * 260, y = ((t - t0) * sp + hash(i + 50) * 2200) % 2200 - 140, x = hash(i + 9) * 1080 + Math.sin(t * 2 + i) * 40;
      K.prop(cols[i % 4], { x, y, w: 30 + hash(i + 3) * 20, rot: t * (2 + hash(i + 7) * 4) + i, a, layer: 'front' }); }
  }
  // glints on the tower glass
  const glints = (K, t, pts, k = 1) => pts.forEach(([ix, iy], i) => { const ph = ((t * .8 + i * .37) % 1), s = Math.sin(ph * PI); if (ph < 1) { const p = K.img(ix, iy); K.prop('T_spark', { x: p.x, y: p.y, w: 90 * s * k, rot: t, a: s, layer: 'front' }); } });
  const dim = (K, a) => K.prop('T_dark', { x: 540, y: 960, w: 2400, a, layer: 'back' });
  // gold TRUMP letters fitted to a painting rectangle (image px: centre x,y + width)
  const letters = (K, ix, iy, iw, opts = {}) => { const p = K.img(ix, iy), k = K.imgScale(); K.prop('P01', Object.assign({ x: p.x, y: p.y, w: iw * k, layer: 'back' }, opts)); };

  window.SCENE = {
    plates: {
      '01': { img: '01_white_house_day.png', hz: .42, vx: .5, fov0: 55, camH: 1.7, light: 'day' },
      '02': { img: '02_queens_street_1950s.png', hz: .48, vx: .22, fov0: 55, camH: 1.7, light: 'day' },
      '03': { img: '03_skyline_across_river.png', hz: .37, vx: .5, fov0: 55, camH: 1.8, light: 'day' },
      '04': { img: '04_fifth_avenue_tower.png', hz: .72, vx: .5, fov0: 55, camH: 1.6, light: 'day' },
      '05': { img: '05_boardwalk_casino_night.png', hz: .46, vx: .42, fov0: 55, camH: 1.7, light: 'night' },
      '06': { img: '06_tv_boardroom_studio.png', hz: .45, vx: .5, fov0: 55, camH: 1.5, light: 'interior' },
      '07': { img: '07_election_stage_night.png', hz: .58, vx: .5, fov0: 55, camH: .6, light: 'night' },
    },
    props: { P01: 'P01_gold_letters.png', P02: 'P02_casino_chips.png', P03: 'P03_unpaid_bills.png', P04: 'P04_tv_set.png', P05: 'P05_ballot_box.png', P06: 'P06_old_portrait.png',
      T_org: 'T_org.cut.png', T_cleveland: 'T_cleveland.cut.png', T_forrent: 'T_forrent.cut.png', T_apprentice: 'T_apprentice.cut.png', T_bankrupt: 'T_bankrupt.cut.png',
      T_1946: 'T_1946.cut.png', T_1983: 'T_1983.cut.png', T_2016: 'T_2016.cut.png', T_2020: 'T_2020.cut.png', T_2024: 'T_2024.cut.png', T_45: 'T_45.cut.png', T_47: 'T_47.cut.png',
      T_bubble: 'T_bubble.cut.png', T_card: 'T_card.cut.png', T_spark: 'T_spark.cut.png', T_dark: 'T_dark.cut.png',
      C_red: 'C_red.cut.png', C_white: 'C_white.cut.png', C_blue: 'C_blue.cut.png', C_gold: 'C_gold.cut.png' },
    cast: { p: 'president' },
    shots: [
      { at: 'q', plate: '01', zoom: [1.0, 1.18], focus: [[.5, .5], [.5, .56]] },
      { at: 'prez', plate: '01', zoom: [1.35, 1.42], focus: [[.5, .6], [.5, .6]] },
      { at: 'boss', plate: '01', zoom: [1.18, 1.12], focus: [[.42, .55], [.58, .55]] },
      { at: 'born', plate: '02', zoom: [1.0, 1.1], focus: [[.5, .5], [.45, .5]] },
      { at: 'dad', plate: '02', zoom: [1.55, 1.65], focus: [[.85, .42], [.78, .42]] },
      { at: 'sky', plate: '03', zoom: [1.0, 1.08], focus: [[.5, .55], [.5, .5]] },
      { at: '1971', plate: '02', zoom: [1.2, 1.32], focus: [[.4, .6], [.4, .6]] },
      { at: '1983', plate: '04', zoom: [1.0, 1.0], focus: [[.5, .5], [.5, .5]] },
      { at: '1983+2.45', plate: '04', zoom: [1.35, 1.35], focus: [[.5, .62], [.5, .3]] },
      { at: 'jewel', plate: '04', zoom: [1.45, 1.6], focus: [[.5, .45], [.5, .42]] },
      { at: 'everywhere', plate: '04', zoom: [1.1, 1.1], focus: [[.5, .6], [.5, .6]] },
      { at: 'everywhere+2.2', plate: '05', zoom: [1.0, 1.06], focus: [[.5, .5], [.5, .5]] },
      { at: 'broke', plate: '05', zoom: [1.05, 1.25], focus: [[.45, .55], [.45, .58]] },
      { at: 'bet', plate: '05', zoom: [1.15, 1.0], focus: [[.45, .55], [.5, .5]] },
      { at: 'weird', plate: '03', zoom: [1.25, 1.3], focus: [[.4, .3], [.6, .3]] },
      { at: 'license', plate: '03', zoom: [1.1, 1.2], focus: [[.5, .45], [.5, .45]] },
      { at: 'show', plate: '06', zoom: [1.0, 1.1], focus: [[.45, .5], [.55, .5]] },
      { at: 'fired', plate: '06', zoom: [1.55, 1.6], focus: [[.5, .55], [.5, .55]] },
      { at: '2016', plate: '07', zoom: [1.0, 1.12], focus: [[.5, .5], [.42, .5]] },
      { at: 'won', plate: '07', zoom: [1.3, 1.35], focus: [[.45, .55], [.45, .55]] },
      { at: '2020', plate: '07', zoom: [1.3, 1.1], focus: [[.45, .55], [.5, .52]] },
      { at: '2024', plate: '07', zoom: [1.2, 1.32], focus: [[.45, .55], [.45, .55]] },
      { at: 'cleveland', plate: '01', zoom: [1.25, 1.3], focus: [[.5, .6], [.5, .6]] },
      { at: 'end', plate: '04', zoom: [1.1, 1.18], focus: [[.5, .6], [.5, .58]] },
      { at: 'end+1.9', plate: '05', zoom: [1.1, 1.15], focus: [[.5, .5], [.5, .5]] },
      { at: 'mirror', plate: '04', zoom: [1.18, 1.1], focus: [[.5, .55], [.5, .6]] },
      { at: 'ask', plate: '04', zoom: [1.1, 1.1], focus: [[.5, .6], [.5, .6]] },
    ],
    shakes: [['broke+3.85', .45, 1], ['fired+1.45', .3, .6], ['end+3.2', .4, .7]],
    flashes: [['won', .2, .35], ['2024+1.1', .2, .35]],
    follow: { from: 'ask+4.3' },
    tail: 2.6,

    update(t, K) {
      const P = K.cast.p, id = K.shot.id, L = K.shot.local, at = c => K.T(c);
      switch (id) {
        case 'q': { // on the White House path, turns to camera on "Trump?"
          K.place('p', 0, 0, -6.4, 0); face(P, 'smile', t);
          P.pose({ t, nod: Math.sin(t * 3) * .03, look: .35 * (1 - K.ease((t - 1.0) / .3)) }); break; }
        case 'prez': K.place('p', 0, 0, -6.4, 0); face(P, 'happy', t); P.pose({ t, gesture: 'tada', gw: K.ease(L / .35) }); break;
        case 'boss': K.place('p', .2, 0, -6.4, -.2); face(P, 'smirk', t); P.pose({ t, gesture: 'hips', gw: K.ease(L / .3), look: .1 }); break;
        case 'born': year(K, t, 'T_1946', at('born') + 1.5); break;
        case 'dad': { const s = K.img(945, 605), k = K.imgScale(), p = popIn(K, t, at('dad') + .3);
          K.prop('T_forrent', { x: s.x, y: s.y, w: 70 * k * p, layer: 'back' }); break; }
        case 'sky': { // on the Queens rooftop, looking across at Manhattan
          K.place('p', -.9, 0, -7.2, .95); face(P, 'smile', t);
          P.pose({ t, gesture: 'point', gw: K.ease((L - .5) / .4), look: -.15 }); break; }
        case '1971': { // takes over: the plaque pops above him
          K.place('p', -1.3, 0, -5.6, .5); face(P, L > 1.6 ? 'smirk' : 'smile', t);
          P.pose({ t, gesture: 'thumbsup', gw: K.ease((L - 1.9) / .3) });
          const p = popIn(K, t, at('1971') + 1.9); K.prop('T_org', { x: 540, y: 270, w: 900 * p, layer: 'front' }); break; }
        case '1983': { // letters drop onto the gold band
          const u = K.easeOut(K.clamp01((t - at('1983') - .9) / .5)); letters(K, 520, 905 - 400 * (1 - u), 440, { a: K.clamp01(u * 3) });
          K.place('p', 0, 0, -7, 0); face(P, 'happy', t); P.pose({ t, gesture: 'tada', gw: K.ease((L - 1.3) / .3) });
          year(K, t, 'T_1983', at('1983') + .2); break; }
        case '1983+2.45': letters(K, 520, 905, 440); glints(K, t, [[360, 520], [700, 700], [520, 300]]); break;
        case 'jewel': letters(K, 520, 905, 440); glints(K, t, [[330, 640], [690, 560], [480, 420], [600, 820]], 1.2); break;
        case 'everywhere': letters(K, 520, 905, 440); K.place('p', -.9, 0, -7, .35); face(P, 'smile', t); P.pose({ t, gesture: 'wave' }); break;
        case 'everywhere+2.2': { const u = popIn(K, t, at('everywhere') + 2.5); letters(K, 520, 470, 300 * u);
          K.place('p', -1.3, 0, -6, .4); face(P, 'happy', t); P.pose({ t, gesture: 'tada', gw: K.ease(L / .3) }); break; }
        case 'broke': { // bills pile up, chips topple, BANKRUPT slams on "bankruptcy"
          letters(K, 520, 470, 300);
          K.place('p', -1.0, 0, -5.8, .3); const late = t > at('broke') + 3.0;
          face(P, late ? 'worried' : 'flat', t); P.pose({ t, gesture: late ? 'facepalm' : null, gw: K.ease((L - 3.1) / .3), look: late ? 0 : .35 });
          const grow = K.easeOut(K.clamp01(L / 2.6)); K.prop('P03', { x: 790, y: 1560 - 180 * grow, w: 180 + 300 * grow, anchor: [.5, .95], layer: 'front' });
          const fall = K.clamp01((L - 2.2) / .7); K.prop('P02', { x: 270 - fall * 40, y: 1330 + fall * 40, w: 300, rot: -fall * 1.1, anchor: [.3, .95], layer: 'front' });
          const s = K.clamp01((t - at('broke') - 3.85) / .18); if (s > 0) K.prop('T_bankrupt', { x: 540, y: 330, w: 900 * (1.6 - .6 * s), a: s, layer: 'front' }); break; }
        case 'bet': { // the lights go out
          letters(K, 520, 470, 300, { a: 1 - K.clamp01(L / 1.5) * .7 }); dim(K, .55 * K.clamp01(L / 1.6));
          K.place('p', -1.0, 0, -5.8, .3); face(P, 'flat', t); P.pose({ t, nod: .08 });
          K.prop('T_bankrupt', { x: 540, y: 330, w: 900, a: 1 - K.clamp01(L / 1.0) * .5, layer: 'front' }); break; }
        case 'weird': { // TRUMP pops onto other builders' towers
          [[330, 430, 0.4], [548, 420, 1.0], [690, 330, 1.6]].forEach(([ix, iy, d]) => { const p = popIn(K, t, at('weird') + d); if (p > 0) letters(K, ix, iy, 150 * p); }); break; }
        case 'license': {
          [[330, 430], [548, 420], [690, 330]].forEach(([ix, iy]) => letters(K, ix, iy, 150));
          K.place('p', .5, 0, -5.0, -.5); face(P, 'smirk', t); P.pose({ t, gesture: 'point', gw: K.ease((L - .3) / .3), look: .2 }); break; }
        case 'show': { // the boardroom set + the TV title
          K.place('p', 0, 0, -6.2, 0); face(P, 'flat', t); P.pose({ t, gesture: 'cross', gw: K.ease((L - .4) / .3) });
          const p = popIn(K, t, at('show') + .2); K.prop('P04', { x: 540, y: 430, w: 780 * p, layer: 'front' }); K.prop('T_apprentice', { x: 540, y: 412, w: 575 * p, layer: 'front' }); break; }
        case 'fired': { // close-up: "You're fired."
          K.place('p', 0, 0, -6.2, .45); const go = t > at('fired') + 1.25;
          face(P, go ? 'flat' : 'smile', t); P.pose({ t, gesture: go ? 'fired' : 'cross', gw: go ? K.ease((t - at('fired') - 1.25) / .2) : 1, look: -.35 }); break; }
        case '2016': {
          K.place('p', .6, 0, -6.4, -.25); face(P, 'smile', t); P.pose({ t, gesture: 'present', gw: K.ease((L - 1.5) / .3) });
          year(K, t, 'T_2016', at('2016') + .2); break; }
        case 'won': {
          K.place('p', .6, 0, -6.4, -.25); face(P, 'happy', t); P.pose({ t, gesture: L < .55 ? 'tada' : 'thumbsup', gw: 1 });
          confetti(K, t, at('won')); const p = popIn(K, t, at('won') + .2); K.prop('T_45', { x: 230, y: 420, w: 300 * p, rot: -.15, layer: 'front' }); break; }
        case '2020': {
          dim(K, .5 * K.clamp01(L / .8)); K.place('p', .6, 0, -6.4, -.25); face(P, L > .9 ? 'worried' : 'flat', t); P.pose({ t, nod: .18 * K.ease((L - .9) / .5), look: .15 });
          year(K, t, 'T_2020', at('2020') + .2); break; }
        case '2024': {
          K.place('p', .6, 0, -6.4, -.25); const won = t > at('2024') + 2.15; face(P, won ? 'happy' : 'smirk', t);
          P.pose({ t, gesture: won ? 'thumbsup' : 'hips', gw: 1 }); year(K, t, 'T_2024', at('2024') + .2);
          const b = popIn(K, t, at('2024') + 1.0); if (b > 0) K.prop('P05', { x: 230, y: 1420, w: 420 * b, layer: 'front' });
          if (won) { confetti(K, t, at('2024') + 2.15); const p = popIn(K, t, at('2024') + 2.3); K.prop('T_47', { x: 230, y: 420, w: 300 * p, rot: -.15, layer: 'front' }); } break; }
        case 'cleveland': { // the one other comeback president
          K.place('p', .75, 0, -6.4, -.5); face(P, L > 2.4 ? 'smirk' : 'surprised', t); P.pose({ t, gesture: 'point', gw: K.ease((L - .9) / .3), look: .35 });
          const s = K.easeOut(K.clamp01(L / .6)); K.prop('P06', { x: -300 + 640 * s, y: 760, w: 520, rot: -.05, layer: 'front' });
          const n = popIn(K, t, at('cleveland') + 2.0); if (n > 0) K.prop('T_cleveland', { x: 340, y: 1060, w: 520 * n, layer: 'front' }); break; }
        case 'end': letters(K, 520, 905, 440); glints(K, t, [[360, 520], [700, 700]]);
          K.place('p', 1.45, 0, -7.5, -.35); face(P, 'smirk', t); P.pose({ t, gesture: 'hips', gw: K.ease(L / .3) }); break;
        case 'end+1.9': { dim(K, .55); letters(K, 520, 470, 300, { a: .35 });
          const s = K.clamp01((t - at('end') - 3.2) / .18); if (s > 0) K.prop('T_bankrupt', { x: 540, y: 560, w: 900 * (1.6 - .6 * s), a: s, layer: 'front' }); break; }
        case 'mirror': { letters(K, 520, 905, 440); glints(K, t, [[520, 905], [380, 900], [660, 910], [360, 520], [700, 700]], 1.3);
          K.place('p', 1.45, 0, -7.5, -.35); face(P, L > .55 ? 'smirk' : 'smile', t); P.pose({ t, gesture: 'thumbsup', gw: K.ease((L - .6) / .3) }); break; }
        case 'ask': { letters(K, 520, 905, 440); glints(K, t, [[360, 520], [700, 700]]);
          K.place('p', 1.45, 0, -7.5, -.35); const pt = t > at('ask') + 3.3;
          face(P, pt ? 'smile' : 'flat', t); P.pose({ t, gesture: pt ? 'point' : 'shrug', gw: K.ease(pt ? (t - at('ask') - 3.3) / .3 : (L - 1.6) / .3), look: pt ? -.2 : 0 });
          const c = popIn(K, t, at('ask') + 1.6); if (c > 0) K.prop('T_card', { x: 540, y: 330, w: 940 * c, layer: 'front' });
          const b = popIn(K, t, at('ask') + 3.4); if (b > 0) K.prop('T_bubble', { x: 290, y: 1020, w: 500 * b, layer: 'front' }); break; }
      }
    },
  };
})();
