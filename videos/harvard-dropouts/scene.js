// harvard-dropouts: plates + props + Gates & Zuckerberg look-alikes. See shotlist.md for the plan.
// Characters are placed by PAINTING PIXEL (where their feet touch the painted floor): feet(name, ix, iy, ry).
// Props are drawn in screen px; painting coords via K.img(ix, iy).
(function () {
  const PI = Math.PI;
  const face = (ch, name, t, off = 0) => ch.face(((t + off) % 4.1) < .12 && name !== 'happy' ? 'blink' : name);
  const popIn = (K, t, from, dur = .35) => K.pop(K.clamp01((t - from) / dur));
  // every in-shot action is keyed to the exact spoken word: w(K, 'forty-five', 'study') = start time of that word after the cue
  const norm = x => x.toLowerCase().replace(/[^a-z0-9]/g, '');
  const w = (K, word, cue) => { const t0 = K.T(cue), n = norm(word), x = window.VIDEO_DATA.words.find(o => o.start >= t0 - .01 && norm(o.w) === n); if (!x) throw new Error('word "' + word + '" not found after [#' + cue + ']'); return x.start; };
  const on = (K, t, word, cue, d = .3) => K.ease((t - w(K, word, cue)) / d);   // 0→1 blend starting on the word

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
      '03': { img: '03_dorm_1975_night.png', hz: .5, vx: .5, fov0: 55, camH: 1.7, light: 'interior' },
      '04': { img: '04_mainframe_room.png', hz: .56, vx: .55, fov0: 55, camH: 1.7, light: 'interior' },
      '05': { img: '05_workshop_desert.png', hz: .45, vx: .5, fov0: 55, camH: 1.7, light: 'day' },
      '06': { img: '06_dorm_2004_night.png', hz: .45, vx: .5, fov0: 55, camH: 1.7, light: 'night' },
      // OpenArt clip (PixVerse V6, from 07; already paid, Brian OK'd using it): frames 40–120 of clips/stadium_fill.mp4, every 2nd
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
      { at: 'mainframe', plate: '04', zoom: [1.05, 1.22], focus: [[.5, .5], [.5, .45]] },
      { at: 'works', plate: '05', zoom: [1.1, 1.45], focus: [[.5, .45], [.5, .44]] },
      { at: 'deal', plate: '05', zoom: [1.45, 1.5], focus: [[.5, .44], [.5, .44]] },
      { at: 'left1', plate: '02', zoom: [1.05, 1.15], focus: [[.5, .55], [.5, .6]] },
      { at: 'zuck', plate: '06', zoom: [1.0, 1.12], focus: [[.45, .55], [.4, .55]] },
      { at: 'half', plate: '06', zoom: [1.2, 1.2], focus: [[.4, .5], [.4, .5]] },
      { at: 'users', plate: '06', zoom: [1.2, 1.2], focus: [[.4, .5], [.4, .5]] },
      { at: 'stadium', plate: '07', zoom: [1.0, 1.12], focus: [[.5, .45], [.5, .42]] },
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
    shakes: [],
    flashes: [],
    build(K) { // shakes + flashes keyed to words (plate-kit calls build() after reading the cue-based lists)
      const S = window.SCENE;
      S._flashes = [[w(K, 'works', 'works'), .2, .3], [w(K, 'customer', 'deal'), .25, .35]];
      S._shakes = [[w(K, 'pay', 'deal') + .45, .25, .4], [w(K, 'customer', 'order'), .2, .3], [w(K, 'stadium', 'order2'), .2, .3],
        [w(K, 'dropping', 'order3'), .2, .3], [w(K, 'forty-five', 'study'), .2, .3], [w(K, 'twice', 'twice'), .25, .35]];
    },
    follow: { from: 'cta+0.3' },
    tail: 2.6,

    update(t, K) {
      const G = K.cast.gates, Z = K.cast.zuck, id = K.shot.id, L = K.shot.local, at = c => K.T(c);
      const gw = (from, d = .3) => K.ease((L - from) / d);
      labelsBegin();
      const W = (word, cue = id) => w(K, word, cue), ON = (word, cue = id, d) => on(K, t, word, cue, d);
      switch (id) {
        case 'q': { // backs to us looking at Harvard, both turn to camera on "Harvard"
          const turn = ON('harvard', 'q', .45);
          feet(K, 'gates', 330, 1290, PI * .9 * (1 - turn)); feet(K, 'zuck', 700, 1290, -PI * .9 * (1 - turn));
          face(G, 'flat', t); face(Z, 'flat', t, 1.3); G.pose({ t }); Z.pose({ t }); break; }
        case 'gates0': { // walks out of the gate on "left Harvard", stops by "graduating", smirk + tada on "Microsoft"
          const ch = walk(K, 'gates', t, W('left'), W('graduating') + .3, [512, 900], [500, 1330]);
          face(ch, t > W('microsoft') ? 'smirk' : 'smile', t); if (t > W('microsoft')) ch.pose({ t, gesture: 'tada', gw: ON('microsoft') }); break; }
        case 'zuck0': {
          const ch = walk(K, 'zuck', t, W('left'), W('graduating') + .3, [512, 900], [520, 1330]);
          face(ch, t > W('facebook') ? 'happy' : 'smile', t); if (t > W('facebook')) ch.pose({ t, gesture: 'wave', gw: ON('facebook') }); break; }
        case 'two': { // "Two dropouts." → Gates tada; "Two famous companies." → Zuck hips
          const second = window.VIDEO_DATA.words.find(o => o.start > W('dropouts') && norm(o.w) === 'two').start;
          feet(K, 'gates', 340, 1300, .25); feet(K, 'zuck', 690, 1300, -.25); face(G, 'smile', t); face(Z, 'smile', t, 1.7);
          G.pose({ t, gesture: 'tada', gw: ON('two') }); Z.pose({ t, gesture: 'hips', gw: K.ease((t - second) / .3) }); break; }
        case 'bet': { feet(K, 'gates', 370, 1300, .15); feet(K, 'zuck', 660, 1300, -.15); face(G, 'flat', t); face(Z, 'flat', t, 2);
          G.pose({ t, gesture: 'shrug', gw: ON('lucky') }); Z.pose({ t, gesture: 'shrug', gw: ON('lucky', id, .45) }); break; }
        case 'altair': { // magazine pops on "magazine", surprised on "Altair"
          feet(K, 'gates', 640, 1330, -.35); const sur = t > W('altair'); face(G, sur ? 'surprised' : 'smile', t);
          G.pose({ t, look: -.2 * ON('magazine'), nod: .25 * ON('magazine'), lean: sur ? .08 : 0 });
          K.prop('P02', { x: 250, y: 1000, w: 420 * popIn(K, t, W('magazine')), rot: -.08 + Math.sin(t * 1.5) * .02 }); break; }
        case 'switches': { const z = 1 + .12 * ON('switches', id, .8); K.prop('P01', { x: 540, y: 820, w: 1000 * z }); break; }
        case 'toaster': { K.prop('P01', { x: 540, y: 560, w: 900 }); K.prop('P03', { x: 560, y: 1000, w: 760 * popIn(K, t, W('toaster')), rot: Math.sin(t * 4) * .04 }); break; }
        case 'allen': { feet(K, 'gates', 560, 1300, 0); face(G, 'smile', t); G.pose({ t, gesture: 'think', gw: ON('write') }); break; }
        case 'never': { feet(K, 'gates', 560, 1300, 0); face(G, t > W('touched') ? 'flat' : 'smile', t); G.pose({ t, gesture: 'shrug', gw: ON('touched') });
          const s = popIn(K, t, W('never')); K.prop('P01', { x: 540, y: 520, w: 560 * s, a: .45 }); label('x', '✕', { x: 540, y: 520, size: 320, color: '#ff4a3d', s: popIn(K, t, W('touched')) }); break; }
        case 'mainframe': { feet(K, 'gates', 600, 1300, .3); face(G, t > W('pretends') ? 'smirk' : 'smile', t); G.pose({ t, gesture: 'point', gw: ON('big'), look: -.3 * ON('big') }); break; }
        case 'works': break; // the Altair is painted on the bench in 05: push-in + flash on "works"
        case 'deal': K.prop('P04', { x: 560 + 600 * (1 - K.easeOut((t - W('pay')) / .45)), y: 1000, w: 620, rot: .06, a: t < W('pay') ? 0 : 1 }); break;
        case 'left1': { // walks out on "leaves Harvard", fist pump on "Microsoft"
          const ch = walk(K, 'gates', t, W('leaves'), W('microsoft'), [512, 900], [500, 1330]); face(ch, t > W('microsoft') ? 'happy' : 'smile', t);
          if (t > W('microsoft')) ch.pose({ t, armR: { raise: ON('microsoft') } }); break; }
        case 'zuck': { feet(K, 'zuck', 560, 1260, -.6); face(Z, t > W('builds') ? 'happy' : 'smile', t); Z.pose({ t, look: -.45 * ON('builds'), nod: .1 }); break; }
        case 'half': case 'users': { // laptop close-up; numbers count on the words
          K.prop('P06', { x: 540, y: 900, w: 1000 });
          const sy = 900 + (565 - 768) / 1024 * 1000, sx = 540 + (533 - 512) / 1024 * 1000;
          if (id === 'half') { const u = K.clamp01((t - W('half')) / Math.max(.3, W('signs') - W('half') + .3)); label('bar', 'HARVARD SIGN-UPS', { x: sx, y: sy - 120, size: 50, color: '#cfe0ff' });
            label('pct', Math.round(55 * K.ease(u)) + '%', { x: sx, y: sy + 40, size: 170, color: u >= 1 ? '#ffd23a' : '#fff' }); }
          else { const u = K.clamp01((t - W('over')) / Math.max(.3, W('thousand') - W('over') + .25)); const done = u >= 1;
            label('cnt', fmt(100000 * K.easeOut(u)) + (done ? '+' : ''), { x: sx, y: sy, size: 150, color: done ? '#ffd23a' : '#fff' });
            label('lab', 'STUDENTS', { x: sx, y: sy + 130, size: 56, color: '#cfe0ff' }); }
          break; }
        case 'stadium': break; // the OpenArt clip plays as the plate (seq)
        case 'left2': { const ch = walk(K, 'zuck', t, W('leaves'), W('focus'), [512, 900], [520, 1330]); face(ch, t > W('facebook') ? 'smirk' : 'smile', t); break; }
        case 'order': { // chalkboard frames fill on "Customer", "Stadium", "Dropping"
          const k = K.imgScale(), f = (ix, key, from) => { if (t < from) return; const p = K.img(ix, 580); K.prop(key, { x: p.x, y: p.y, w: 205 * k * popIn(K, t, from) }); };
          f(250, 'P04', W('customer', 'order')); f(550, 'T07', W('stadium', 'order2')); f(850, 'T02', W('dropping', 'order3'));
          feet(K, 'gates', 330, 1420, .2); feet(K, 'zuck', 690, 1420, -.2); face(G, 'smile', t); face(Z, t > W('last', 'order3') ? 'smirk' : 'smile', t, 1);
          G.pose({ t, gesture: 'point', gw: ON('customer', 'order'), look: -.2 }); Z.pose({ t, look: .4, nod: .05 }); break; }
        case 'reveal': { feet(K, 'gates', 360, 1300, .15); feet(K, 'zuck', 670, 1300, -.15); face(G, t > W('already') ? 'smirk' : 'flat', t); face(Z, t > W('already') ? 'smirk' : 'flat', t, 2);
          G.pose({ t, nod: .12 * ON('already') }); Z.pose({ t, gesture: 'cross', gw: ON('already') }); break; }
        case 'lucky': { feet(K, 'gates', 390, 1300, 0); feet(K, 'zuck', 650, 1300, -.1); face(G, t > W('lucky') && t < W('lucky') + .14 ? 'blink' : 'flat', t); face(Z, 'smirk', t, 2); G.pose({ t }); Z.pose({ t, gesture: 'cross', gw: 1 }); break; }
        case 'study': { // tiny in the archive, looking up; the 45 cake pops exactly on "forty-five"
          feet(K, 'gates', 470, 1180, .1); feet(K, 'zuck', 560, 1180, -.1); const hit = t > W('forty-five');
          face(G, hit ? 'surprised' : 'flat', t); face(Z, hit ? 'surprised' : 'flat', t, 1.5); G.pose({ t, nod: -.3 }); Z.pose({ t, nod: -.3 });
          if (hit) K.prop('P08', { x: 540, y: 600, w: 420 * popIn(K, t, W('forty-five')) }); break; }
        case 'twice': case 'why': { feet(K, 'gates', 300, 1310, .3); feet(K, 'zuck', 740, 1310, -.3); K.prop('P08', { x: 530, y: 560, w: 500, layer: 'back' });
          if (id === 'twice') { face(G, 'surprised', t); face(Z, 'surprised', t, 1); const b = ON('twice', id, .25); G.pose({ t, lean: -.1 * b, look: .3 }); Z.pose({ t, lean: -.1 * b, look: -.3 }); }
          else { face(G, 'smile', t); face(Z, 'smile', t, 1); G.pose({ t, gesture: 'think', gw: ON('know') }); Z.pose({ t, nod: .15 * ON('pay') * Math.sin((t - W('pay')) * 8) }); }
          break; }
        case 'degree': { // nine caps pop fast on "nine", the tenth (faint) on "ten"; both shrug on "degrees"
          const k = K.imgScale(), tn = W('nine'), tt = W('ten');
          for (let i = 0; i < 10; i++) { const from = i < 9 ? tn + .06 * i : tt; if (t < from) continue;
            const r = i < 5 ? 0 : 1, c = i % 5, p = K.img(200 + c * 155, 470 + r * 190); K.prop('P09', { x: p.x, y: p.y, w: 175 * k * popIn(K, t, from, .25), a: i === 9 ? .28 : 1 }); }
          feet(K, 'gates', 330, 1420, .2); feet(K, 'zuck', 690, 1420, -.2); face(G, t > W('degrees') ? 'flat' : 'smile', t); face(Z, t > W('degrees') ? 'flat' : 'smile', t, 1);
          G.pose({ t, gesture: 'shrug', gw: ON('degrees') }); Z.pose({ t, gesture: 'shrug', gw: ON('degrees', id, .45) }); break; }
        case 'honor': { feet(K, 'gates', 330, 950, .2); feet(K, 'zuck', 700, 950, -.2); face(G, 'happy', t); face(Z, 'happy', t); G.pose({ t }); Z.pose({ t });
          if (t > W('honorary')) { const p = K.img(512, 760); K.prop('P07', { x: p.x, y: p.y - 40, w: 260 * K.imgScale() * popIn(K, t, W('honorary')), rot: .5 }); } break; }
        case 'gates2': { feet(K, 'gates', 330, 950, .2); feet(K, 'zuck', 700, 950, -.2); face(G, 'happy', t); face(Z, 'smile', t);
          G.pose({ t, gesture: 'tada', gw: ON('thirty-two') }); Z.pose({ t, look: -.4 });
          if (t > W('thirty-two')) label('yr', '1975 → 2007', { x: 540, y: 230, size: 110, color: '#ffd23a', s: popIn(K, t, W('thirty-two')) }); break; }
        case 'zuck2': { feet(K, 'gates', 330, 950, .2); feet(K, 'zuck', 700, 950, -.2); face(G, 'smile', t); face(Z, 'happy', t);
          G.pose({ t, look: .4 }); Z.pose({ t, gesture: 'wave', gw: ON('thirteen') });
          if (t > W('thirteen')) label('yr', '2004 → 2017', { x: 540, y: 230, size: 110, color: '#ffd23a', s: popIn(K, t, W('thirteen')) }); break; }
        case 'mirror': { // "Build it first." facing us at the gate; "School can wait." they turn and walk back IN
          const ts = W('school'), te = W('apparently') + .5;
          if (t < ts) { feet(K, 'gates', 470, 1330, 0); feet(K, 'zuck', 570, 1330, 0); face(G, 'smirk', t); face(Z, 'smile', t, 1); G.pose({ t, gesture: 'point', gw: ON('build') }); Z.pose({ t }); }
          else { const g = walk(K, 'gates', t, ts, te, [470, 1330], [490, 930]), z = walk(K, 'zuck', t, ts + .15, te + .15, [570, 1330], [540, 930]); face(g, 'smirk', t); face(z, 'smile', t, 1); }
          break; }
        case 'ask': { feet(K, 'gates', 340, 1300, .15); feet(K, 'zuck', 690, 1300, -.15); face(G, 'smirk', t); face(Z, 'smirk', t, 1.4);
          G.pose({ t, gesture: 'point', gw: ON('leave'), look: .2 }); Z.pose({ t, gesture: 'point', gw: ON('stay'), look: -.2 }); break; }
        case 'cta': { feet(K, 'gates', 420, 1045, .1); feet(K, 'zuck', 610, 1045, -.1); face(G, 'smirk', t); face(Z, 'happy', t);
          G.pose({ t, gesture: 'cross', gw: ON('enjoyed') }); Z.pose({ t, gesture: 'point', gw: ON('follow'), look: -.1, nod: -.2 }); break; }
      }
      labelsEnd();
    },
  };
})();
