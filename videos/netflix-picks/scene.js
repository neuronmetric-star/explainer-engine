// netflix-picks: plates + props + Doug & Gary. See shotlist.md for the plan.
// Positions are in plate world units (feet at y=0); props in screen px (y down); painting coords via K.img(ix,iy).
(function () {
  const PI = Math.PI;
  const face = (ch, name, t, off = 0) => ch.face(((t + off) % 4.1) < .12 && name !== 'happy' ? 'blink' : name);
  // start time of the first spoken word matching `w` at/after a cue
  const WORDS = window.VIDEO_DATA.words;
  const wordAt = (K, w, cue) => { const t0 = K.T(cue); const x = WORDS.find(o => o.start >= t0 - .01 && o.w.toLowerCase().replace(/[^a-z0-9]/g, '') === w); return x ? x.start : t0; };
  // phone held in the right hand (screen left), small
  function holdPhone(K, ch, key, w = 70) { const h = K.screenOf(ch.arm[1].wr); K.prop(key, { x: h.x + 6, y: h.y - w * .55, w, rot: -.12 }); }
  // the NETFLIX word sitting on Doug's TV (painting coords of the TV screen)
  const onTV = (K, a = 1) => { const p = K.img(100, 440); K.prop('P10', { x: p.x, y: p.y, w: 170 * K.imgScale(), a, layer: 'back' }); };
  const popIn = (K, t, from, dur = .35) => K.pop(K.clamp01((t - from) / dur));

  window.SCENE = {
    plates: {
      '01': { img: '01_doug_living_room_night.png', hz: .42, vx: .5, fov0: 55, camH: 1.7, light: 'night' },
      '02': { img: '02_gary_living_room_night.png', hz: .42, vx: .5, fov0: 55, camH: 1.7, light: 'night' },
      '03': { img: '03_control_room.png', hz: .47, vx: .55, fov0: 55, camH: 1.7, light: 'night' },
    },
    props: { P01: 'P01_phone_comedy.png', P02: 'P02_phone_romance.png', P03: 'P03_poster_stack.png', P04: 'P04_stopwatch.png',
      P05: 'P05_donut_80.png', P06: 'P06_money_pile.png', P07: 'P07_romcom_tower.png', P08: 'P08_five_dollar_bill.cut.png',
      P09: 'P09_popcorn.png', P10: 'P10_netflix_word.png' },
    cast: { doug: 'hoodie', gary: 'oxford' },
    shots: [
      { at: 'q', plate: '01', zoom: [1.0, 1.15], focus: [[.5, .5], [.5, .55]] },
      { at: 'problem', plate: '01', zoom: [1.3, 1.36], focus: [[.45, .55], [.45, .56]] },
      { at: 'doug', plate: '01', zoom: [1.15, 1.3], focus: [[.45, .55], [.45, .56]] },
      { at: 'gary', plate: '02', zoom: [1.1, 1.25], focus: [[.55, .55], [.55, .56]] },
      { at: 'bet', plate: '01', zoom: [1.25, 1.3], focus: [[.45, .55], [.45, .55]] },
      { at: 'phones', plate: '01', zoom: [1.6, 1.65], focus: [[.5, .45], [.5, .45]] },
      { at: 'bet2', plate: '02', zoom: [1.35, 1.45], focus: [[.55, .55], [.55, .55]] },
      { at: 'aside', plate: '03', zoom: [1.0, 1.15], focus: [[.5, .5], [.55, .48]] },
      { at: 'stack', plate: '03', zoom: [1.15, 1.25], focus: [[.5, .45], [.5, .45]] },
      { at: 'pick', plate: '03', zoom: [1.0, 1.05], focus: [[.5, .55], [.5, .55]] },
      { at: 'example', plate: '03', zoom: [1.3, 1.4], focus: [[.5, .4], [.5, .38]] },
      { at: 'why', plate: '01', zoom: [1.2, 1.35], focus: [[.45, .55], [.45, .56]] },
      { at: 'eighty', plate: '03', zoom: [1.1, 1.2], focus: [[.45, .45], [.5, .45]] },
      { at: 'billion', plate: '03', zoom: [1.2, 1.1], focus: [[.5, .45], [.5, .5]] },
      { at: 'callback', plate: '02', zoom: [1.1, 1.4], focus: [[.55, .55], [.6, .56]] },
      { at: 'exposed', plate: '02', zoom: [1.2, 1.25], focus: [[.55, .55], [.55, .55]] },
      { at: 'end', plate: '01', zoom: [1.0, 1.08], focus: [[.5, .55], [.5, .55]] },
      { at: 'netflix', plate: '03', zoom: [1.2, 1.3], focus: [[.5, .42], [.5, .4]] },
      { at: 'cta', plate: '01', zoom: [1.3, 1.3], focus: [[.5, .4], [.5, .4]] },
    ],
    shakes: [['reveal', .35, .6], ['billion+0.35', .5, 1]],
    flashes: [],
    follow: { from: 'cta+0.3' },
    tail: 2.6,

    update(t, K) {
      const D = K.cast.doug, G = K.cast.gary, id = K.shot.id, L = K.shot.local, at = c => K.T(c);
      switch (id) {
        case 'q': { // Doug scrolling his phone; NETFLIX slams in on the word, then shrinks onto the TV
          K.place('doug', -.3, 0, -6.2, .2); face(D, 'flat', t); D.pose({ t, nod: -.2, armR: { raise: .3, fwd: -.9 } });
          holdPhone(K, D, 'P01');
          const tn = wordAt(K, 'netflix', 'q'), u = K.ease((t - tn - 1.1) / .6), tv = K.img(100, 440);
          if (t >= tn) K.prop('P10', { x: K.lerp(540, tv.x, u), y: K.lerp(300, tv.y, u), w: K.lerp(860, 170 * K.imgScale(), u) * popIn(K, t, tn, .3), layer: u >= 1 ? 'back' : 'front' });
          break; }
        case 'problem': onTV(K);
          K.place('doug', -.3, 0, -6.2, .2); face(D, 'happy', t); D.pose({ t, gesture: 'tada', gw: K.ease((L - .2) / .4) }); break;
        case 'doug': {
          K.place('doug', -.9, 0, -6.2, .35); face(D, L > 1.5 ? 'smirk' : 'smile', t);
          D.pose({ t, gesture: 'point', gw: K.ease((L - .3) / .4), look: -.35 });
          K.prop('P01', { x: 760, y: 720, w: 420 * popIn(K, t, at('doug') + .15), rot: .06 + Math.sin(L * 3) * .02 }); break; }
        case 'gary': {
          K.place('gary', .9, 0, -6.2, -.35); const pt = L > 2.6; face(G, 'flat', t);
          G.pose({ t, gesture: pt ? 'point' : 'cross', gw: pt ? K.ease((L - 2.6) / .4) : 1, look: pt ? .35 : 0 });
          K.prop('P02', { x: 320, y: 720, w: 420 * popIn(K, t, at('gary') + 2.6), rot: -.06 + Math.sin(L * 3) * .02 }); break; }
        case 'bet': {
          K.place('doug', -.6, 0, -6.2, .25); face(D, 'smirk', t); D.pose({ t, gesture: 'hips', gw: K.ease(L / .4) });
          const tf = wordAt(K, 'five', 'bet'), s = popIn(K, t, tf, .5);
          if (t >= tf) K.prop('P08', { x: 720, y: 640, w: 520 * s * Math.max(.15, Math.abs(Math.cos(L * 4))), rot: Math.sin(L * 2) * .15 }); break; }
        case 'phones': { // both phones side by side; they wiggle on "both right"
          const wig = t > at('reveal') ? Math.sin((t - at('reveal')) * 22) * .08 * Math.max(0, 1 - (t - at('reveal')) / 1.2) : 0;
          K.prop('P01', { x: 300, y: 800, w: 440 * popIn(K, t, at('phones') + .2), rot: -.08 + wig });
          K.prop('P02', { x: 780, y: 800, w: 440 * popIn(K, t, at('phones') + .7), rot: .08 - wig }); break; }
        case 'bet2': {
          K.place('gary', .4, 0, -6.2, -.15); face(G, 'worried', t);
          G.pose({ t, gesture: 'think', gw: K.ease(L / .4), lean: .1, look: .25, tilt: .1, nod: -.1 }); break; }
        case 'aside': break;
        case 'stack': { // the stack fans in, one poster set spinning up from nothing
          const s = popIn(K, t, at('stack') + .9, .5);
          K.prop('P03', { x: 540, y: 760, w: 760 * s, rot: (1 - s) * -.6 }); break; }
        case 'pick': { // Doug left, Gary right; their posters fly out of the stack to each of them
          K.place('doug', -.95, 0, -6, .35); K.place('gary', .95, 0, -6, -.35);
          face(D, 'happy', t); face(G, 'surprised', t, 1);
          D.pose({ t, armR: { raise: .3, fwd: -.9 }, look: .1 }); G.pose({ t, armL: { raise: .3, fwd: -.9 }, look: -.1 });
          const u = K.easeOut((L - .4) / .9), hd = K.screenOf(D.arm[1].wr), hg = K.screenOf(G.arm[-1].wr);
          K.prop('P03', { x: 540, y: 560, w: 520, a: 1 - K.clamp01((L - .2) / .5) });
          K.prop('P01', { x: K.lerp(540, hd.x, u), y: K.lerp(560, hd.y - 45, u), w: K.lerp(300, 90, u) });
          K.prop('P02', { x: K.lerp(540, hg.x, u), y: K.lerp(560, hg.y - 45, u), w: K.lerp(300, 90, u) }); break; }
        case 'example': { // the real case: romance fans got the couple, comedy fans got the laugh
          K.prop('P03', { x: 540, y: 640, w: 900, a: .55 });
          K.prop('P02', { x: 760, y: 700, w: 400 * popIn(K, t, wordAt(K, 'romance', 'example')), rot: .07 });
          K.prop('P01', { x: 320, y: 700, w: 400 * popIn(K, t, wordAt(K, 'comedy', 'example')), rot: -.07 }); break; }
        case 'why': {
          K.place('doug', -.5, 0, -6.2, .2); const fp = t > at('eighty') - 1.1;
          face(D, 'worried', t); D.pose({ t, nod: fp ? 0 : -.2, armR: fp ? undefined : { raise: .3, fwd: -.9 }, gesture: fp ? 'facepalm' : null, gw: K.ease((t - at('eighty') + 1.1) / .4) });
          if (!fp) holdPhone(K, D, 'P01');
          const ts = wordAt(K, 'sixty', 'why'); if (t >= ts) K.prop('P04', { x: 780, y: 560, w: 380 * popIn(K, t, ts), rot: Math.sin(t * PI * 2) > 0 ? .04 : -.04 }); break; }
        case 'eighty': { // donut spins into place
          const s = popIn(K, t, at('eighty') + .4, .6); K.prop('P05', { x: 540, y: 720, w: 760 * s, rot: (1 - s) * -2.5 }); break; }
        case 'billion': { // money pile drops from the top and lands with a shake
          const u = K.clamp01((L - .05) / .3), y = K.lerp(-500, 820, u * u);
          K.prop('P06', { x: 540, y, w: 720 }); break; }
        case 'callback':
          K.place('gary', .4, 0, -6.2, -.15); face(G, L > 1.4 ? 'worried' : 'smile', t); G.pose({ t, look: L > 1.4 ? .25 : 0, gesture: 'cross', gw: 1 }); break;
        case 'exposed': {
          K.place('gary', -.6, 0, -6.2, .2); face(G, 'worried', t); G.pose({ t, gesture: 'facepalm', gw: K.ease((L - .3) / .4) });
          const s = popIn(K, t, at('exposed') + .1, .4);
          K.prop('P07', { x: 800, y: 1200, w: 470 * s, anchor: [.5, 1], rot: Math.sin(L * 3.5) * .05, layer: 'back' }); break; }
        case 'end': {
          K.place('doug', -1.0, 0, -6.6, .45); K.place('gary', .9, 0, -6.6, -.2);
          face(D, 'flat', t); face(G, 'flat', t, 1.3);
          D.pose({ t, look: -.5, nod: -.05 }); G.pose({ t, look: -.6, gesture: L > 3 ? 'shrug' : 'cross', gw: 1 });
          K.prop('P09', { x: 540, y: 1080, w: 260 * popIn(K, t, at('end') + .2), layer: 'front' }); break; }
        case 'netflix': { // the five bucks fly into the wall; NETFLIX slams in
          const u = K.ease(L / .9);
          K.prop('P08', { x: K.lerp(540, 560, u), y: K.lerp(1000, 520, u), w: K.lerp(520, 30, u), rot: u * 6, a: 1 - K.clamp01((u - .85) / .15) });
          K.prop('P10', { x: 540, y: 400, w: 860 * popIn(K, t, at('netflix') + .15, .3) }); break; }
        case 'cta': {
          K.place('doug', -1.0, 0, -6.6, .3); K.place('gary', 1.0, 0, -6.6, -.3);
          face(D, 'smirk', t); face(G, 'smile', t, 1.3);
          D.pose({ t, gesture: 'shrug', gw: K.ease((L - .8) / .4) }); G.pose({ t, gesture: 'point', gw: K.ease((L - .3) / .4), look: -.2, tilt: .1 }); break; }
      }
    },
  };
})();
