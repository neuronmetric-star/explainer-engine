// harvard-dropouts: plates + props + Gates & Zuckerberg look-alikes. See shotlist.md for the plan.
// Characters are placed by PAINTING PIXEL (where their feet touch the painted floor): feet(name, ix, iy, ry).
// Props are drawn in screen px; painting coords via K.img(ix, iy).
(function () {
  const PI = Math.PI;
  const face = (ch, name, t, off = 0) => ch.face(((t + off) % 4.1) < .12 && name !== 'happy' ? 'blink' : name);
  const popIn = (K, t, from, dur = .35) => K.pop(K.clamp01((t - from) / dur));
  // TODO: 03 / 04 / 05 are stand-ins until Brian sends 03_dorm_1975_night, 04_mainframe_room, 05_workshop_desert.
  const ART = {
    '03': '06_dorm_2004_night.png',   // → 03_dorm_1975_night.png
    '04': '08_records_archive.png',   // → 04_mainframe_room.png
    '05': '09_chalkboard.png',        // → 05_workshop_desert.png
  };

  // ---- ground picking: painting pixel → world point on the floor (y = 0) ----
  const ray = new THREE.Raycaster(), ndc = new THREE.Vector2(), hit = new THREE.Vector3(), floor = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
  function ground(K, ix, iy) { const p = K.img(ix, iy); ndc.set(p.x / K.W * 2 - 1, -(p.y / K.H * 2 - 1)); ray.setFromCamera(ndc, K.camera); ray.ray.intersectPlane(floor, hit); return hit.clone(); }
  function feet(K, n, ix, iy, ry = 0) { const g = ground(K, ix, iy); return K.place(n, g.x, 0, g.z, ry); }
  // walk from painting px A to B between times t0..t1 (eases to a stop), facing the direction of travel
  function walk(K, n, t, t0, t1, A, B, extra = {}) {
    const a = ground(K, A[0], A[1]), b = ground(K, B[0], B[1]), u = K.clamp01((t - t0) / (t1 - t0)), e = 1 - Math.pow(1 - u, 2);
    const x = K.lerp(a.x, b.x, e), z = K.lerp(a.z, b.z, e), d = Math.hypot(b.x - a.x, b.z - a.z) * e;
    const ry = Math.atan2(b.x - a.x, b.z - a.z), ch = K.place(n, x, 0, z, extra.ry === undefined ? ry : extra.ry);
    ch.pose(Object.assign({ t, walk: d / 1.35, walkAmt: 1 - K.ease((u - .85) / .15) }, extra.pose || {}));
    return ch;
  }

  // ---- DOM labels (counter, year cards, ✕) : pure functions of t ----
  const LAB = {};
  function label(id, txt, o) { let el = LAB[id];
    if (!el) { el = LAB[id] = document.createElement('div'); el.style.cssText = 'position:absolute;transform-origin:50% 50%;font-family:IN,sans-serif;font-weight:900;text-align:center;white-space:nowrap;-webkit-text-stroke:12px #000;paint-order:stroke fill;'; document.getElementById('ui').insertBefore(el, document.getElementById('cap')); }
    el.textContent = txt; el.style.left = o.x + 'px'; el.style.top = o.y + 'px'; el.style.fontSize = (o.size || 90) + 'px'; el.style.color = o.color || '#fff';
    el.style.transform = `translate(-50%,-50%) scale(${o.s === undefined ? 1 : o.s})`; el.style.opacity = o.a === undefined ? 1 : o.a; el.style.display = 'block'; LAB._used[id] = 1; }
  LAB._used = {};
  const labelsBegin = () => { LAB._used = {}; };
  const labelsEnd = () => { for (const k in LAB) if (k !== '_used' && !LAB._used[k]) LAB[k].style.display = 'none'; };
  const fmt = n => Math.round(n).toLocaleString('en-US');

  window.SCENE = {
    plates: {
      '01': { img: '01_harvard_yard_day.png', hz: .49, vx: .52, fov0: 55, camH: 1.6, light: 'day' },
      '02': { img: '02_college_gate.png', hz: .56, vx: .5, fov0: 55, camH: 1.6, light: 'day' },
      '03': { img: ART['03'], hz: .45, vx: .5, fov0: 55, camH: 1.7, light: 'night' },
      '04': { img: ART['04'], hz: .64, vx: .5, fov0: 55, camH: 1.7, light: 'interior' },
      '05': { img: ART['05'], hz: .45, vx: .5, fov0: 55, camH: 1.7, light: 'day' },
      '06': { img: '06_dorm_2004_night.png', hz: .45, vx: .5, fov0: 55, camH: 1.7, light: 'night' },
      // OpenArt clip (PixVerse V6, from 07): frames 40–120 of clips/stadium_fill.mp4, every 2nd → clips/stadium/f01–f41.jpg
      '07': { img: '07_stadium_empty.png', hz: .54, vx: .5, fov0: 55, camH: 1.6, light: 'day',
        seq: { files: Array.from({ length: 41 }, (_, i) => '../clips/stadium/f' + String(i + 1).padStart(2, '0') + '.jpg'), fps: 22 } },
      '08': { img: '08_records_archive.png', hz: .64, vx: .5, fov0: 55, camH: 1.7, light: 'interior' },
      '09': { img: '09_chalkboard.png', hz: .45, vx: .5, fov0: 55, camH: 2.6, light: 'interior' },
      '10': { img: '10_commencement_stage.png', hz: .53, vx: .5, fov0: 55, camH: .65, light: 'day' },
    },
    props: { P01: 'P01_altair.png', P02: 'P02_magazine.png', P03: 'P03_toaster.png', P04: 'P04_contract_check.png',
      P05: 'P05_paper_tape.png', P06: 'P06_laptop_2004.png', P07: 'P07_diploma.png', P08: 'P08_cake_45.png', P09: 'P09_grad_cap.png',
      T07: 'T07_stadium_thumb.cut.png', T02: 'T02_gate_thumb.cut.png' },
    cast: { gates: 'gates', zuck: 'zuck' },
    shots: [
      { at: 'q', plate: '01', zoom: [1.0, 1.12], focus: [[.5, .5], [.5, .55]] },
      { at: 'gates0', plate: '02', zoom: [1.05, 1.15], focus: [[.5, .55], [.5, .6]] },
      { at: 'zuck0', plate: '02', zoom: [1.15, 1.05], focus: [[.5, .6], [.5, .55]] },
      { at: 'two', plate: '01', zoom: [1.1, 1.22], focus: [[.5, .6], [.5, .62]] },
      { at: 'bet', plate: '01', zoom: [1.3, 1.36], focus: [[.5, .62], [.52, .62]] },
      { at: 'altair', plate: '03', zoom: [1.0, 1.15], focus: [[.55, .55], [.6, .55]] },
      { at: 'switches', plate: '03', zoom: [1.2, 1.3], focus: [[.5, .5], [.5, .5]] },
      { at: 'toaster', plate: '03', zoom: [1.3, 1.3], focus: [[.5, .5], [.5, .5]] },
      { at: 'allen', plate: '04', zoom: [1.0, 1.08], focus: [[.45, .55], [.55, .55]] },
      { at: 'never', plate: '04', zoom: [1.1, 1.12], focus: [[.5, .55], [.5, .55]] },
      { at: 'mainframe', plate: '04', zoom: [1.1, 1.3], focus: [[.5, .5], [.5, .45]] },
      { at: 'works', plate: '05', zoom: [1.0, 1.2], focus: [[.5, .5], [.5, .45]] },
      { at: 'deal', plate: '05', zoom: [1.2, 1.25], focus: [[.5, .45], [.5, .45]] },
      { at: 'left1', plate: '02', zoom: [1.05, 1.15], focus: [[.5, .55], [.5, .6]] },
      { at: 'zuck', plate: '06', zoom: [1.0, 1.12], focus: [[.45, .55], [.4, .55]] },
      { at: 'half', plate: '06', zoom: [1.2, 1.2], focus: [[.4, .5], [.4, .5]] },
      { at: 'users', plate: '06', zoom: [1.2, 1.2], focus: [[.4, .5], [.4, .5]] },
      { at: 'stadium', plate: '07', zoom: [1.0, 1.15], focus: [[.5, .45], [.5, .42]] },
      { at: 'left2', plate: '02', zoom: [1.05, 1.15], focus: [[.5, .55], [.5, .6]] },
      { at: 'order', plate: '09', zoom: [1.0, 1.0], focus: [[.5, .5], [.5, .5]] },
      { at: 'reveal', plate: '01', zoom: [1.15, 1.3], focus: [[.5, .6], [.5, .62]] },
      { at: 'lucky', plate: '01', zoom: [1.4, 1.45], focus: [[.45, .6], [.45, .6]] },
      { at: 'study', plate: '08', zoom: [1.0, 1.2], focus: [[.5, .55], [.5, .58]] },
      { at: 'twice', plate: '08', zoom: [1.2, 1.25], focus: [[.5, .6], [.5, .6]] },
      { at: 'why', plate: '08', zoom: [1.25, 1.35], focus: [[.5, .6], [.5, .6]] },
      { at: 'degree', plate: '09', zoom: [1.0, 1.05], focus: [[.5, .5], [.5, .5]] },
      { at: 'honor', plate: '10', zoom: [1.0, 1.08], focus: [[.5, .55], [.5, .55]] },
      { at: 'gates2', plate: '10', zoom: [1.2, 1.32], focus: [[.42, .55], [.4, .55]] },
      { at: 'zuck2', plate: '10', zoom: [1.32, 1.4], focus: [[.6, .55], [.62, .55]] },
      { at: 'mirror', plate: '02', zoom: [1.15, 1.0], focus: [[.5, .6], [.5, .55]] },
      { at: 'ask', plate: '01', zoom: [1.1, 1.22], focus: [[.5, .6], [.5, .62]] },
      { at: 'cta', plate: '01', zoom: [1.0, 1.04], focus: [[.5, .5], [.5, .52]] },
    ],
    shakes: [['deal+0.5', .25, .4], ['order', .2, .3], ['order2', .2, .3], ['order3', .2, .3], ['twice', .25, .35]],
    flashes: [['left1-0.7', .25, .35]],
    follow: { from: 'cta+0.3' },
    tail: 2.6,

    update(t, K) {
      const G = K.cast.gates, Z = K.cast.zuck, id = K.shot.id, L = K.shot.local, at = c => K.T(c);
      const gw = (from, d = .3) => K.ease((L - from) / d);
      labelsBegin();
      switch (id) {
        case 'q': { feet(K, 'gates', 330, 1290, PI * .9 - (L > 2.2 ? PI * .9 * gw(2.2, .4) : 0)); feet(K, 'zuck', 700, 1290, -PI * .9 + (L > 2.4 ? PI * .9 * gw(2.4, .4) : 0));
          face(G, 'flat', t); face(Z, 'flat', t, 1.3); G.pose({ t, look: 0 }); Z.pose({ t, look: 0 }); break; }
        case 'gates0': { const ch = walk(K, 'gates', t, at('gates0'), at('gates0') + 2.6, [512, 900], [500, 1330]); face(ch, L > 2.4 ? 'smirk' : 'smile', t); break; }
        case 'zuck0': { const ch = walk(K, 'zuck', t, at('zuck0'), at('zuck0') + 2.6, [512, 900], [520, 1330]);
          face(ch, L > 2.4 ? 'happy' : 'smile', t); if (L > 2.6) ch.pose({ t, gesture: 'wave', gw: gw(2.6) }); break; }
        case 'two': { feet(K, 'gates', 340, 1300, .25); feet(K, 'zuck', 690, 1300, -.25); face(G, 'smile', t); face(Z, 'smile', t, 1.7);
          G.pose({ t, gesture: 'tada', gw: gw(.2) }); Z.pose({ t, gesture: 'hips', gw: gw(.6) }); break; }
        case 'bet': { feet(K, 'gates', 370, 1300, .15); feet(K, 'zuck', 660, 1300, -.15); face(G, 'flat', t); face(Z, 'flat', t, 2);
          G.pose({ t, gesture: 'shrug', gw: gw(.4) }); Z.pose({ t, gesture: 'shrug', gw: gw(.7) }); break; }
        case 'altair': { feet(K, 'gates', 700, 1250, -.35); face(G, L > .9 ? 'surprised' : 'smile', t); G.pose({ t, look: -.2, nod: .25, lean: L > .9 ? .08 : 0 });
          K.prop('P02', { x: 300, y: 980, w: 460 * popIn(K, t, at('altair') + .3), rot: -.08 + Math.sin(t * 1.5) * .02 }); break; }
        case 'switches': K.prop('P01', { x: 540, y: 820, w: 1000 * (1 + .04 * L), a: 1 }); break;
        case 'toaster': { K.prop('P01', { x: 540, y: 560, w: 900 }); K.prop('P03', { x: 560, y: 1000, w: 760 * popIn(K, t, at('toaster')), rot: Math.sin(t * 4) * .04 }); break; }
        case 'allen': { feet(K, 'gates', 512, 1280, 0); face(G, 'smile', t); G.pose({ t, gesture: 'think', gw: gw(.3) }); break; }
        case 'never': { feet(K, 'gates', 512, 1280, 0); face(G, 'flat', t); G.pose({ t, gesture: 'shrug', gw: gw(.3) });
          const s = popIn(K, t, at('never') + .1); K.prop('P01', { x: 540, y: 520, w: 560 * s, a: .45 }); label('x', '✕', { x: 540, y: 520, size: 320, color: '#ff4a3d', s }); break; }
        case 'mainframe': { feet(K, 'gates', 600, 1280, -.3); face(G, 'smirk', t); G.pose({ t, gesture: 'point', gw: gw(.4), look: -.3 }); break; }
        case 'works': { const p = K.img(512, 620); K.prop('P01', { x: p.x, y: p.y, w: 640 * K.imgScale() }); K.prop('P05', { x: 300, y: 1050, w: 520 * popIn(K, t, at('works') + .2), rot: -.1 }); break; }
        case 'deal': { const p = K.img(512, 620); K.prop('P01', { x: p.x, y: p.y, w: 640 * K.imgScale() });
          K.prop('P04', { x: 560 + 500 * (1 - K.easeOut(L / .45)), y: 820, w: 620, rot: .06 }); break; }
        case 'left1': { const ch = walk(K, 'gates', t, at('left1'), at('left1') + 2.6, [512, 900], [500, 1330]); face(ch, L > 2.2 ? 'happy' : 'smile', t);
          if (L > 2.6) ch.pose({ t, armR: { raise: K.ease((L - 2.6) / .3) } }); break; }
        case 'zuck': { feet(K, 'zuck', 560, 1260, -.6); face(Z, 'smile', t); Z.pose({ t, look: -.45, nod: .1 }); break; }
        case 'half': case 'users': { // laptop close-up; counter on the green screen
          const s = 1; K.prop('P06', { x: 540, y: 900, w: 1000 * s }); const scr = { x: 540, y: 900 - 1000 * (1536 - 2 * 560) / 1024 / 2 * 0 };
          const sy = 900 + (565 - 768) / 1024 * 1000, sx = 540 + (533 - 512) / 1024 * 1000;
          if (id === 'half') { const u = K.ease(L / 1.6); label('bar', 'HARVARD SIGN-UPS', { x: sx, y: sy - 120, size: 50, color: '#cfe0ff' });
            label('pct', Math.round(55 * u) + '%', { x: sx, y: sy + 40, size: 170, color: u > .9 ? '#ffd23a' : '#fff' }); }
          else { const u = K.easeOut(L / 1.8); label('cnt', fmt(100000 * u) + (u > .98 ? '+' : ''), { x: sx, y: sy, size: 150, color: u > .98 ? '#ffd23a' : '#fff' });
            label('lab', 'STUDENTS', { x: sx, y: sy + 130, size: 56, color: '#cfe0ff' }); }
          break; }
        case 'stadium': break; // the OpenArt clip plays as the plate (seq)
        case 'left2': { const ch = walk(K, 'zuck', t, at('left2'), at('left2') + 2.6, [512, 900], [520, 1330]); face(ch, L > 2.2 ? 'smirk' : 'smile', t); break; }
        case 'order': { // chalkboard frames (painting px): 250/550/850, y 580, 225 wide
          const k = K.imgScale(), f = (ix, key, from) => { const p = K.img(ix, 580), s = popIn(K, t, from); K.prop(key, { x: p.x, y: p.y, w: 205 * k * s }); };
          f(250, 'P04', at('order')); if (t >= at('order2')) f(550, 'T07', at('order2')); if (t >= at('order3')) f(850, 'T02', at('order3'));
          feet(K, 'gates', 330, 1420, .2); feet(K, 'zuck', 690, 1420, -.2); face(G, 'smile', t); face(Z, 'smile', t, 1);
          G.pose({ t, gesture: 'point', gw: K.ease((t - at('order') - .3) / .3), look: -.2 }); Z.pose({ t, look: .4, nod: .05 }); break; }
        case 'reveal': { feet(K, 'gates', 360, 1300, .15); feet(K, 'zuck', 670, 1300, -.15); face(G, 'smirk', t); face(Z, 'smirk', t, 2);
          G.pose({ t }); Z.pose({ t, gesture: 'cross', gw: gw(.5) }); break; }
        case 'lucky': { feet(K, 'gates', 390, 1300, 0); feet(K, 'zuck', 650, 1300, -.1); face(G, L < .3 ? 'blink' : 'flat', t); face(Z, 'smirk', t, 2); G.pose({ t }); Z.pose({ t, gesture: 'cross', gw: 1 }); break; }
        case 'study': { feet(K, 'gates', 470, 1180, .1); feet(K, 'zuck', 560, 1180, -.1); face(G, 'surprised', t); face(Z, 'surprised', t, 1.5);
          G.pose({ t, nod: -.3 }); Z.pose({ t, nod: -.3 });
          if (t > K.T('study') + 2.5) K.prop('P08', { x: 540, y: 600, w: 420 * popIn(K, t, K.T('study') + 2.5) }); break; }
        case 'twice': case 'why': { feet(K, 'gates', 300, 1310, .3); feet(K, 'zuck', 740, 1310, -.3);
          K.prop('P08', { x: 530, y: 560, w: 500 * (id === 'twice' ? popIn(K, t, at('twice'), .3) : 1), layer: 'back' });
          if (id === 'twice') { face(G, 'surprised', t); face(Z, 'surprised', t, 1); G.pose({ t, lean: -.1 * gw(.2), look: .3 }); Z.pose({ t, lean: -.1 * gw(.2), look: -.3 }); }
          else { face(G, 'smile', t); face(Z, 'smile', t, 1); G.pose({ t, gesture: 'think', gw: gw(.3) }); Z.pose({ t, nod: .15 * Math.sin(L * 4) }); }
          break; }
        case 'degree': { // ten caps: nine pop in bright, the tenth stays faint (that's these two)
          const k = K.imgScale();
          for (let i = 0; i < 10; i++) { const r = i < 5 ? 0 : 1, c = i % 5, p = K.img(200 + c * 155, 470 + r * 190), s = popIn(K, t, at('degree') + .15 * i, .3);
            K.prop('P09', { x: p.x, y: p.y, w: 175 * k * s, a: i === 9 ? .28 : 1 }); }
          feet(K, 'gates', 330, 1420, .2); feet(K, 'zuck', 690, 1420, -.2); face(G, 'flat', t); face(Z, 'flat', t, 1);
          G.pose({ t, gesture: 'shrug', gw: gw(1.6) }); Z.pose({ t, gesture: 'shrug', gw: gw(1.8) }); break; }
        case 'honor': { feet(K, 'gates', 330, 950, .2); feet(K, 'zuck', 700, 950, -.2); face(G, 'happy', t); face(Z, 'happy', t);
          G.pose({ t }); Z.pose({ t }); const p = K.img(512, 760); K.prop('P07', { x: p.x, y: p.y - 40, w: 260 * K.imgScale() * popIn(K, t, at('honor') + .3), rot: .5 }); break; }
        case 'gates2': { feet(K, 'gates', 330, 950, .2); feet(K, 'zuck', 700, 950, -.2); face(G, 'happy', t); face(Z, 'smile', t);
          G.pose({ t, gesture: 'tada', gw: gw(.3) }); Z.pose({ t, look: -.4 }); label('yr', '1975 → 2007', { x: 540, y: 230, size: 110, color: '#ffd23a', s: popIn(K, t, at('gates2') + .2) }); break; }
        case 'zuck2': { feet(K, 'gates', 330, 950, .2); feet(K, 'zuck', 700, 950, -.2); face(G, 'smile', t); face(Z, 'happy', t);
          G.pose({ t, look: .4 }); Z.pose({ t, gesture: 'wave', gw: gw(.3) }); label('yr', '2004 → 2017', { x: 540, y: 230, size: 110, color: '#ffd23a', s: popIn(K, t, at('zuck2') + .2) }); break; }
        case 'mirror': { // both walk back IN through the gate
          const t0 = at('mirror'), t1 = t0 + 3.2;
          const g = walk(K, 'gates', t, t0, t1, [470, 1330], [490, 930]), z = walk(K, 'zuck', t, t0 + .2, t1 + .2, [570, 1330], [540, 930]);
          face(g, 'smirk', t); face(z, 'smile', t, 1); break; }
        case 'ask': { feet(K, 'gates', 340, 1300, .15); feet(K, 'zuck', 690, 1300, -.15); face(G, 'smirk', t); face(Z, 'smirk', t, 1.4);
          G.pose({ t, gesture: 'point', gw: gw(.5), look: .2 }); Z.pose({ t, gesture: 'point', gw: gw(1.4), look: -.2 }); break; }
        case 'cta': { feet(K, 'gates', 420, 1045, .1); feet(K, 'zuck', 610, 1045, -.1); face(G, 'smirk', t); face(Z, 'happy', t);
          G.pose({ t, gesture: 'cross', gw: gw(.3) }); Z.pose({ t, gesture: 'point', gw: gw(.6), look: -.1, nod: -.2 }); break; }
      }
      labelsEnd();
    },
  };
})();
