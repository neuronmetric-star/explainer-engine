// light-switch: plates + props + Doug & Gary. See shotlist.md for the plan.
// Positions are in plate world units (feet at y=0); props in screen px (y down); painting coords via K.img(ix,iy).
(function () {
  const PI = Math.PI;
  const face = (ch, name, t, off = 0) => ch.face(((t + off) % 4.1) < .12 && name !== 'happy' ? 'blink' : name);
  const WORDS = window.VIDEO_DATA.words;
  const norm = w => w.toLowerCase().replace(/[^a-z0-9]/g, '');
  // start times of every spoken word matching `w` between two cues
  const wordsAt = (K, w, from, to) => { const a = K.T(from), b = to ? K.T(to) : 1e9; return WORDS.filter(o => o.start >= a - .01 && o.start < b && norm(o.w) === w).map(o => o.start); };
  const wordAt = (K, w, cue) => { const x = wordsAt(K, w, cue)[0]; return x === undefined ? K.T(cue) : x; };
  const popIn = (K, t, from, dur = .35) => K.pop(K.clamp01((t - from) / dur));
  const last = (arr, t) => { let r = -1e9; for (const x of arr) if (x <= t) r = x; return r; };

  // the hanging bulb on plate 01/01b: base tucked into the painted socket (image px 731, 622), hanging upside down
  const SOCKET = [731, 622];
  function ceilingBulb(K, key, extraRot = 0) {
    const p = K.img(SOCKET[0], SOCKET[1]);
    K.prop(key, { x: p.x, y: p.y, w: 129 * K.imgScale(), anchor: [.5, 1100 / 1536], rot: PI + extraRot, layer: 'back' });
  }
  function handBulb(K, ch, key, t, shake = 0) {
    const h = K.screenOf(ch.arm[1].wr);
    K.prop(key, { x: h.x, y: h.y - 55, w: 210, rot: Math.sin(t * 38) * .25 * shake });
  }

  // the wire loop in plate 06, as percent of the painting (traced from the art)
  const LOOP = [[27, 66], [29.5, 62.5], [30, 53], [32, 51], [62, 51], [88, 51], [90, 53.5], [90, 78], [88, 80.5], [23, 80.5], [21, 78], [21, 70], [23.5, 67], [27, 66]];
  const FEED = [[2, 32], [9, 32.5], [10.3, 35], [10.3, 63], [13, 66], [22, 66], [27, 66]];
  function poly(P) { const seg = []; let L = 0; for (let i = 0; i < P.length - 1; i++) { const d = Math.hypot(P[i + 1][0] - P[i][0], (P[i + 1][1] - P[i][1]) * 1.5); seg.push([L, d]); L += d; }
    return s => { s = ((s % 1) + 1) % 1; let d = s * L; for (let i = 0; i < seg.length; i++) { if (d <= seg[i][1] || i === seg.length - 1) { const u = d / seg[i][1]; return [P[i][0] + (P[i + 1][0] - P[i][0]) * u, P[i][1] + (P[i + 1][1] - P[i][1]) * u]; } d -= seg[i][1]; } }; }
  const loopAt = poly(LOOP), feedAt = poly(FEED);
  function electrons(K, t, march) { // march: distance travelled along the loop (0 = sitting still)
    const k = K.imgScale(), N = 30;
    for (let i = 0; i < N; i++) { const s = i / N + march + .003 * Math.sin(t * 9 + i * 1.7), [px, py] = loopAt(s), p = K.img(px * 10.24, py * 15.36);
      K.prop('P03', { x: p.x, y: p.y, w: 120 * k }); }
    for (let i = 0; i < 7; i++) { const s = i / 7 + march * 2.4 + .004 * Math.sin(t * 9 + i), [px, py] = feedAt(s), p = K.img(px * 10.24, py * 15.36);
      K.prop('P03', { x: p.x, y: p.y, w: 120 * k }); }
  }

  window.SCENE = {
    plates: {
      '01': { img: '01_living_room_dark.png', hz: .41, vx: .55, fov0: 55, camH: 1.6, light: 'night' },
      '01b': { img: '01b_living_room_nobulb.png', hz: .41, vx: .55, fov0: 55, camH: 1.6, light: 'night' },
      '02': { img: '02_living_room_lit.png', hz: .41, vx: .55, fov0: 55, camH: 1.6, light: 'interior' },
      '03': { img: '03_switch_closeup.png', hz: .5, vx: .5, fov0: 55, camH: 1.6, light: 'night' },
      '04': { img: '04_switch_inside_off.png', hz: .5, vx: .5, fov0: 55, camH: 1.6, light: 'night' },
      '05': { img: '05_switch_inside_on.png', hz: .5, vx: .5, fov0: 55, camH: 1.6, light: 'night' },
      '06': { img: '06_house_loop_cutaway.png', hz: .5, vx: .5, fov0: 55, camH: 1.6, light: 'night' },
      '07': { img: '07_bulb_closeup_off.png', hz: .5, vx: .5, fov0: 55, camH: 1.6, light: 'night' },
      '08': { img: '08_bulb_closeup_glowing.png', hz: .5, vx: .5, fov0: 55, camH: 1.6, light: 'night' },
      '09': { img: '09_bulb_closeup_broken.png', hz: .5, vx: .5, fov0: 55, camH: 1.6, light: 'night' },
    },
    props: { P01: 'P01_bulb_broken.png', P02: 'P02_bulb_new.png', P03: 'P03_electron.png', P04: 'P04_oven.png',
      P05: 'P05_thermometer.png', P06: 'P06_led_bulb.png' },
    cast: { doug: 'hoodie', gary: 'oxford' },
    shots: [
      { at: 'q', plate: '03', zoom: [1.0, 1.15], focus: [[.5, .5], [.48, .5]] },
      { at: 'card', plate: '01', zoom: [1.0, 1.45], focus: [[.5, .5], [.7, .44]] },
      { at: 'flip', plate: '03', zoom: [1.1, 1.1], focus: [[.48, .5], [.48, .5]] },
      { at: 'clicks', plate: '01', zoom: [1.05, 1.1], focus: [[.45, .52], [.45, .52]] },
      { at: 'fifty', plate: '01', zoom: [1.1, 1.3], focus: [[.45, .52], [.43, .52]] },
      { at: 'gary', plate: '01', zoom: [1.0, 1.05], focus: [[.55, .5], [.57, .5]] },
      { at: 'rattle', plate: '01b', zoom: [1.25, 1.3], focus: [[.62, .5], [.62, .5]] },
      { at: 'bet', plate: '01b', zoom: [1.1, 1.15], focus: [[.5, .52], [.5, .52]] },
      { at: 'aside', plate: '06', zoom: [1.0, 1.12], focus: [[.5, .5], [.5, .55]] },
      { at: 'step1', plate: '03', zoom: [1.0, 1.2], focus: [[.5, .5], [.48, .5]] },
      { at: 'off', plate: '04', zoom: [1.05, 1.3], focus: [[.5, .5], [.58, .47]] },
      { at: 'on', plate: '05', zoom: [1.3, 1.35], focus: [[.58, .47], [.58, .47]] },
      { at: 'step2', plate: '06', zoom: [1.35, 1.0], focus: [[.2, .45], [.5, .55]] },
      { at: 'electrons', plate: '06', zoom: [1.5, 1.6], focus: [[.3, .7], [.32, .7]] },
      { at: 'rule', plate: '06', zoom: [1.7, 1.9], focus: [[.27, .66], [.27, .66]] },
      { at: 'closed', plate: '06', zoom: [1.1, 1.0], focus: [[.5, .6], [.5, .55]] },
      { at: 'step3', plate: '07', zoom: [1.0, 1.25], focus: [[.5, .5], [.5, .4]] },
      { at: 'crash', plate: '07', zoom: [1.3, 1.45], focus: [[.5, .38], [.5, .33]] },
      { at: 'oven', plate: '07', zoom: [1.0, 1.0], focus: [[.5, .5], [.5, .5]] },
      { at: 'glow', plate: '08', zoom: [1.15, 1.3], focus: [[.5, .45], [.5, .4]] },
      { at: 'led', plate: '08', zoom: [1.0, 1.0], focus: [[.5, .5], [.5, .5]] },
      { at: 'reveal', plate: '09', zoom: [1.1, 1.4], focus: [[.5, .45], [.5, .33]] },
      { at: 'snapped', plate: '09', zoom: [1.7, 1.8], focus: [[.5, .3], [.5, .3]] },
      { at: 'callback', plate: '01b', zoom: [1.0, 1.1], focus: [[.5, .52], [.5, .52]] },
      { at: 'fix', plate: '01b', zoom: [1.15, 1.2], focus: [[.62, .46], [.62, .46]] },
      { at: 'light', plate: '02', zoom: [1.0, 1.05], focus: [[.5, .5], [.5, .5]] },
      { at: 'end', plate: '02', zoom: [1.05, 1.15], focus: [[.5, .52], [.48, .52]] },
      { at: 'cta', plate: '02', zoom: [1.3, 1.3], focus: [[.5, .3], [.5, .3]] },
    ],
    shakes: [['rule+1.6', .3, .5], ['crash+0.4', 2.5, .25], ['light', .3, .5], ...WORDS.filter(o => norm(o.w) === 'click').map(o => [o.start, .16, .4])],
    flashes: [['glow', .25, .6], ['light', .25, .5]],
    follow: { from: 'cta+0.3' },
    tail: 2.6,

    update(t, K) {
      const D = K.cast.doug, G = K.cast.gary, id = K.shot.id, L = K.shot.local, at = c => K.T(c);
      const clicks = wordsAt(K, 'click', 'flip', 'gary'), lastClick = last(clicks, t), clickPulse = Math.max(0, 1 - (t - lastClick) / .18);
      switch (id) {
        case 'q': case 'flip': case 'step1': break; // switch close-up; the shake on clicks comes from zoom jolts below
        case 'card': { // dead room, the snapped bulb hangs right there
          ceilingBulb(K, 'P01');
          K.place('doug', -.2, 0, -5.3, -.35); face(D, 'worried', t);
          D.pose({ t, gesture: 'point', gw: K.ease((L - 1.2) / .4), look: -.45 }); break; }
        case 'clicks': case 'fifty': {
          ceilingBulb(K, 'P01');
          K.place('doug', -.2, 0, -5.3, -.35); const fifty = id === 'fifty';
          face(D, fifty ? (L > 1.5 ? 'worried' : 'flat') : 'flat', t);
          D.pose({ t, look: -.5, nod: -clickPulse * .15, armR: fifty && L > 1.2 ? undefined : { raise: .55 + clickPulse * .15, fwd: -.4 },
            gesture: fifty && L > 1.2 ? 'hips' : null, gw: K.ease((L - 1.2) / .4) }); break; }
        case 'gary': { // Gary walks to the bulb, reaches up, unscrews it
          ceilingBulb(K, 'P01');
          K.place('doug', -.6, 0, -5.3, .2); face(D, 'flat', t); D.pose({ t, gesture: 'cross', gw: 1, look: .4 });
          const wx = K.lerp(2.2, .75, K.easeOut(L / 1.2));
          K.place('gary', wx, 0, -5.6, -.2); face(G, 'flat', t); G.pose({ t, walk: Math.max(0, 1.2 - L), walkAmt: L < 1.2 ? 1 : 0, armR: { raise: K.ease((L - 1.1) / .5) * 1.0, fwd: -.2 } }); break; }
        case 'rattle': {
          K.place('doug', -.6, 0, -5.3, .2); face(D, 'surprised', t); D.pose({ t, look: .4 });
          K.place('gary', .8, 0, -5.6, -.2); face(G, 'flat', t); G.pose({ t, armR: { raise: .45, fwd: -.6 }, look: -.1 });
          handBulb(K, G, 'P01', t, 1); break; }
        case 'bet':
          K.place('doug', -.6, 0, -5.3, .2); face(D, 'flat', t); D.pose({ t, gesture: 'shrug', gw: K.ease(L / .4) });
          K.place('gary', .8, 0, -5.6, -.2); face(G, 'flat', t); G.pose({ t, armR: { raise: .45, fwd: -.6 } }); handBulb(K, G, 'P01', t, 0); break;
        case 'aside': break;
        case 'off': { // the gap pulses
          if (L > 1.2) { const p = K.img(612, 722); K.prop('P03', { x: p.x, y: p.y, w: 160 * K.imgScale() * (.6 + .4 * Math.sin(t * 6)), a: .55 }); } break; }
        case 'on': break;
        case 'step2': case 'aside2': break;
        case 'electrons': electrons(K, t, 0); break;
        case 'rule': electrons(K, t, 0); break;
        case 'closed': { const tf = wordAt(K, 'touches', 'closed') - .1; electrons(K, t, t > tf ? (t - tf) * .22 : 0); break; }
        case 'step3': break;
        case 'crash': { // electrons climb the support wires into the filament and bounce around
          const k = K.imgScale();
          for (let i = 0; i < 14; i++) { const ph = ((L * .9 + i / 14) % 1), side = i % 2 ? 1 : -1;
            let ix, iy; if (ph < .5) { const u = ph / .5; ix = 512 + side * K.lerp(55, 175, u); iy = K.lerp(1080, 500, u); }
            else { const u = (ph - .5) / .5; ix = 512 + side * 175 - side * u * 350 + Math.sin(t * 40 + i) * 12; iy = 470 + Math.sin(t * 33 + i * 2) * 18; }
            const p = K.img(ix, iy); K.prop('P03', { x: p.x, y: p.y, w: 110 * k }); } break; }
        case 'oven': { // "eight times hotter than your oven": thermometer bursts, oven pops
          const tt = wordAt(K, 'four', 'crash'), to = at('oven');
          K.prop('P05', { x: 780, y: 760, w: 330 * popIn(K, t, to + .05), rot: .08 + Math.sin(t * 20) * .03 });
          K.prop('P04', { x: 320, y: 900, w: 420 * popIn(K, t, wordAt(K, 'oven', 'oven')), rot: -.05 }); break; }
        case 'glow': break;
        case 'led': K.prop('P06', { x: 760, y: 900, w: 380 * popIn(K, t, wordAt(K, 'leds', 'led') - .1), rot: .06 }); break;
        case 'reveal': case 'snapped': break;
        case 'callback': { // Doug keeps clicking; Gary holds the dead bulb
          K.place('doug', -.2, 0, -5.3, -.35); face(D, 'flat', t);
          const c = Math.max(0, 1 - ((t * 2.2) % 1) / .2);
          D.pose({ t, look: -.5, nod: -c * .12, armR: { raise: .55 + c * .15, fwd: -.4 } });
          K.place('gary', .8, 0, -5.6, -.2); face(G, 'flat', t); G.pose({ t, armR: { raise: .45, fwd: -.6 } }); handBulb(K, G, 'P01', t, 0); break; }
        case 'fix': { // Gary screws in the new bulb
          K.place('doug', -.6, 0, -5.3, .2); face(D, 'flat', t); D.pose({ t, look: .4, gesture: 'cross', gw: 1 });
          K.place('gary', .8, 0, -5.6, -.2); face(G, 'smile', t); G.pose({ t, armR: { raise: 1.0, fwd: -.2 } });
          const u = K.ease(L / 1.0), h = K.screenOf(G.arm[1].wr), s = K.img(SOCKET[0], SOCKET[1]);
          if (u < 1) K.prop('P02', { x: K.lerp(h.x, s.x, u), y: K.lerp(h.y - 40, s.y + 70, u), w: K.lerp(150, 129 * K.imgScale(), u), rot: PI * u + Math.sin(L * 14) * .1 * u });
          else ceilingBulb(K, 'P02', Math.sin(L * 14) * .05 * Math.max(0, 1 - (L - 1))); break; }
        case 'light': case 'end': case 'cta': {
          K.place('doug', -.55, 0, -5.3, -.1); K.place('gary', .75, 0, -5.6, -.25);
          if (id === 'light') { face(D, 'happy', t); D.pose({ t, gesture: 'tada', gw: K.ease(L / .3) }); face(G, 'flat', t); G.pose({ t, look: -.3 }); }
          if (id === 'end') { face(D, 'smirk', t); D.pose({ t, gesture: 'point', gw: K.ease(L / .4), look: -.5 });
            face(G, 'flat', t); G.pose({ t, gesture: L > 2.2 ? 'facepalm' : null, gw: K.ease((L - 2.2) / .4), look: -.3 }); }
          if (id === 'cta') { face(D, 'smirk', t); D.pose({ t, gesture: 'shrug', gw: K.ease((L - .8) / .4) });
            face(G, 'smile', t, 1.3); G.pose({ t, gesture: 'point', gw: K.ease((L - .3) / .4), look: -.2, tilt: .1 }); }
          break; }
      }
    },
  };
})();
