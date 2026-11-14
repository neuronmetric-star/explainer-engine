// US nationwide ground stop (Nov 13, 2026) — photos from ChatGPT animated in code + gold-noir 3D sets.
// Photos: hook map, freeze (planes held), radar, routers, landing, copper, america (videos/us-ground-stop/images/).
// 3D sets: lock x=0 | server racks x=20 | canceled-flights board x=40 | clock x=52 | timeline x=70
const SEGS = [ // [photo, from cue, to cue]  — while one is on, the 3D scene is hidden
  ['hook', 'hook', 'every'], ['freeze', 'every', 'radar'], ['radar', 'radar', 'routers'], ['routers', 'routers', 'air'],
  ['landing', 'air', 'nohack'], ['copper', 'copper', 'question'], ['freeze', 'right', 'bigger'], ['hook', 'bigger', 'math'],
  ['america', 'america', 'ask'], ['hook', 'ask', 999],
];
const CY = 1075; // card row just above the captions
window.SCENE = {
  distance: 1.5,
  build(K) {
    const { box, cyl, group, tube, GOLD, RED, WHITE } = K;
    const S = this.s = {};
    // ---- photos ----
    const P = S.P = {
      hook: K.photo('images/hook.png', { slices: 10 }), freeze: K.photo('images/freeze.png', { slices: 8 }),
      radar: K.photo('images/radar.png', { slices: 14 }), routers: K.photo('images/routers.png', { slices: 12 }),
      landing: K.photo('images/landing.png'), copper: K.photo('images/copper.png', { slices: 6 }),
      america: K.photo('images/america.png'),
    };
    // lights that live on the photos (x%, y% of the image)
    S.cities = [[65.5, 28.8], [34, 32], [47.5, 47], [74, 42], [22, 41], [57, 23], [84, 36], [44, 31]].map(([x, y]) => P.hook.glow(x, y, 150, 'rgba(255,200,90,.95)'));
    S.beacons = [[73, 29.8], [47.5, 27.6], [36, 26.2], [30.5, 26.4], [74, 44.6], [24.5, 26.5]].map(([x, y]) => P.freeze.glow(x, y, 130, 'rgba(255,40,30,1)'));
    S.screen = P.radar.glow(50.5, 27.5, 700, 'rgba(60,255,120,.55)');
    S.alarm = P.routers.glow(69, 6.3, 560, 'rgba(255,30,20,1)');
    S.beam = P.routers.glow(69, 6.3, 1300, 'transparent');
    S.beam.style.background = 'conic-gradient(from 0deg, rgba(255,40,30,.55), transparent 14%, transparent 50%, rgba(255,40,30,.55) 50%, transparent 64%)';
    S.beam.style.borderRadius = '50%';
    S.landLights = [[75, 33.2], [46, 34], [61.5, 35.5]].map(([x, y]) => P.landing.glow(x, y, 260, 'rgba(255,230,170,1)'));
    S.shaft = P.copper.glow(84, 4, 900, 'rgba(255,190,80,.8)');
    S.spark = P.copper.glow(52, 42, 520, 'rgba(255,240,200,1)');
    S.tower = [[62.3, 3.7], [47, 22], [86.5, 22]].map(([x, y]) => P.america.glow(x, y, 160, 'rgba(255,190,80,1)'));

    // ---- 3D: padlock + magnifier (no cyberattack / investigation) ----
    const Lk = group(0, 0, 0);
    S.lock = group(0, 0, 0, Lk);
    box(3, 2.4, 1, 0, 1.9, 0, S.lock);
    const arc = []; for (let i = 0; i <= 24; i++) { const a = Math.PI * i / 24; arc.push([Math.cos(a) * 1.0, 3.1 + Math.sin(a) * 1.15, 0]); }
    arc.unshift([1.0, 2.9, 0]); arc.push([-1.0, 2.9, 0]); S.shackle = tube(arc, 0xffd15a, .13, S.lock);
    cyl(.22, .2, 0, 2.1, .52, S.lock, RED, 12).rotation.x = Math.PI / 2; box(.16, .5, .1, 0, 1.75, .52, S.lock, RED);
    S.mag = group(0, 0, 0);
    const ring = []; for (let i = 0; i <= 40; i++) { const a = Math.PI * 2 * i / 40; ring.push([Math.cos(a) * .7, Math.sin(a) * .7, 0]); }
    tube(ring, 0xffffff, .09, S.mag); const h = box(.22, 1.1, .22, .78, -.78, 0, S.mag, WHITE); h.rotation.z = Math.PI / 4;
    K.ring(2.6, 0, 0);

    // ---- 3D: server racks (plan for failure) ----
    S.racks = [];
    for (let i = 0; i < 3; i++) {
      const piv = group(20 + (i - 1) * 2.3 + .8, 0, 0);
      const mk = (c) => { const g = group(-.8, 0, 0, piv); box(1.6, 4.4, 1.4, 0, 2.2, 0, g, c);
        for (let r = 0; r < 6; r++) box(1.2, .3, .1, 0, .7 + r * .6, .72, g, c); return g; };
      const gold = mk(GOLD), red = i === 1 ? mk(RED) : null; if (red) red.visible = false;
      S.racks.push({ piv, gold, red });
    }
    K.ring(3.6, 20, 0);

    // ---- 3D: canceled-flights board (60 tiles x 110 flights = 6,600) ----
    S.tiles = [];
    for (let r = 0; r < 10; r++) for (let c = 0; c < 6; c++) {
      const x = 40 + (c - 2.5) * 1.05, y = 1.0 + r * .62;
      const g = box(.8, .38, .12, x, y, 0, undefined, GOLD), rd = box(.8, .38, .12, x, y, 0, undefined, RED); rd.visible = false;
      S.tiles.push({ g, rd, order: K.hash(r, c) });
    }
    S.tiles.sort((a, b) => a.order - b.order);

    // ---- 3D: clock (4+ hours) ----
    const cl = []; for (let i = 0; i <= 64; i++) { const a = Math.PI / 2 - Math.PI * 2 * i / 64; cl.push([52 + Math.cos(a) * 2.3, 3.4 + Math.sin(a) * 2.3, 0]); }
    S.clock = tube(cl, 0xffd15a, .1);
    for (let i = 0; i < 12; i++) { const a = Math.PI * 2 * i / 12; const m = box(.12, .4, .12, 52 + Math.cos(a) * 1.9, 3.4 + Math.sin(a) * 1.9, 0, undefined, WHITE); m.rotation.z = a + Math.PI / 2; }
    S.hand = group(52, 3.4, .2); box(.14, 1.7, .14, 0, .85, 0, S.hand, WHITE);
    S.hand2 = group(52, 3.4, .25); box(.18, 1.1, .18, 0, .55, 0, S.hand2, GOLD);

    // ---- 3D: timeline (fix after vs get ahead) ----
    S.lineRed = tube([[66, 2, 0], [68, 2, 0], [69.4, 2.1, 0], [70, 1.1, 0], [70.6, 2.0, 0], [72, 2, 0], [74, 2, 0]], 0xff3a2c, .09);
    S.lineGold = tube([[66, 4.2, 0], [68, 4.3, 0], [70, 4.5, 0], [72, 4.8, 0], [73.6, 5.2, 0]], 0xffd15a, .09);
    S.arrow = new THREE.Mesh(new THREE.ConeGeometry(.3, .7, 4), new THREE.MeshBasicMaterial({ color: 0xffd15a }));
    S.arrow.position.set(73.8, 5.25, 0); S.arrow.rotation.z = -Math.PI / 2 + .25; K.scene.add(S.arrow);
    S.xMark = group(70, 1.1, .3); box(1.2, .18, .18, 0, 0, 0, S.xMark, RED).rotation.z = Math.PI / 4; box(1.2, .18, .18, 0, 0, 0, S.xMark, RED).rotation.z = -Math.PI / 4;
  },

  covered(t) { const K = window.KIT; return SEGS.some(([, a, b]) => t >= K.T(a) && t < K.T(b)); },

  shots: [
    [0,          [0, 3, 9],       [0, 2.2, 0],  .8],
    ['nohack',   [1.6, 3.4, 8],   [0, 2.4, 0], 1.2],
    ['question', [23.5, 3.8, 9.5],[20, 2.4, 0], 1.2],
    ['fail',     [21.5, 3, 8],    [20, 2.0, 0],  .8],
    ['math',     [41, 4.2, 9],    [40, 3.8, 0],  .8],
    ['hours',    [53, 3.4, 9],    [52, 2.6, 0],  .8],
    ['after',    [70.5, 2.2, 10], [70, 1.5, 0], 1.0],
  ],

  cards: [
    // hook
    { l: 'Still running on', v: '1980s TECH?', cls: 'big', s: [540, CY - 40], t0: 'tech', t1: 'freeze' },
    { l: 'Friday', v: '3:54 PM', cls: 'white big', s: [540, CY - 40], t0: 'freeze', t1: 'every' },
    { l: 'All departures', v: 'STOPPED', cls: 'red big', s: [540, CY - 40], t0: 'every+0.5', t1: 'radar' },
    { l: 'Control centers', v: 'RADAR + RADIO', cls: 'red', s: [540, CY], t0: 'radar+0.5', t1: 'routers' },
    { l: 'Switches & routers', v: 'OVERLOADED', cls: 'red big', s: [540, CY - 40], t0: 'routers+1.6', t1: 'data' },
    { v: 'INCONSISTENT DATA', cls: 'red', s: [540, CY], t0: 'data', t1: 'air' },
    { l: 'Planes in the air', v: '0', cls: 'big', s: [540, CY - 40], t0: 'air+0.2', t1: 'landed', count: [0, 3500, 'air+0.2', 1.6], fmt: n => Math.round(n).toLocaleString('en-US') + '+' },
    { l: 'Planes in the air', v: 'CLEARED TO LAND ✓', s: [540, CY], t0: 'landed', t1: 'nohack' },
    { l: 'Sign of a cyberattack', v: 'NONE FOUND', cls: 'white', s: [540, 330], t0: 'nohack+1.2', t1: 'nohack+2.94' },
    { l: 'Investigation', v: 'STILL GOING', s: [540, 330], t0: 'nohack+2.94', t1: 'copper' },
    { v: 'TRANSPORTATION SECRETARY', cls: 'tag white', s: [540, 300], t0: 'copper+0.4', t1: 'question' },
    { l: 'Copper lines from the', v: '1980s', cls: 'red big', s: [540, CY - 40], t0: 'eighties', t1: 'question' },
    { v: 'QUICK QUESTION', cls: 'tag', s: [540, 300], t0: 'question', t1: 'fail' },
    { l: 'Your job', v: 'KEEP PLANES MOVING', cls: 'white', s: [540, CY], t0: 'job+0.3', t1: 'fail' },
    { l: 'Did they', v: 'PLAN FOR FAILURE?', cls: 'red', s: [540, 330], t0: 'fail+0.3', t1: 'right' },
    { l: 'Stopping flights', v: 'RIGHT CALL ✓', s: [540, CY], t0: 'right+0.6', t1: 'baddata' },
    { l: 'Bad data', v: 'DANGEROUS', cls: 'red big', s: [540, CY - 40], t0: 'baddata', t1: 'bigger' },
    { l: 'One overload', v: 'WHOLE COUNTRY', cls: 'red', s: [540, CY], t0: 'bigger+1.4', t1: 'math' },
    { l: 'Flights canceled', v: '0', cls: 'red big', s: [540, 300], t0: 'math', t1: 'hours', count: [0, 6600, 'math', 2.2], fmt: n => Math.round(n).toLocaleString('en-US') + '+' },
    { l: 'Departures frozen', v: '4+ HOURS', cls: 'big', s: [540, 300], t0: 'hours', t1: 'after' },
    { l: 'Fixing it', v: 'AFTER ✕', cls: 'red', s: [540, 330], t0: 'breakdown', t1: 'ahead' },
    { l: 'Getting', v: 'AHEAD ✓', s: [540, 330], t0: 'ahead', t1: 'america' },
    { l: 'This is', v: 'AMERICA', cls: 'big', s: [540, CY - 40], t0: 'america+0.15', t1: 'need' },
    { l: 'So', v: 'WHAT DO YOU THINK?', s: [540, 420], t0: 'ask', t1: 'unavoidable' },
    { l: 'Unavoidable', v: 'EMERGENCY?', cls: 'white', s: [540, 520], t0: 'unavoidable', t1: 'cta' },
    { l: 'Or a', v: 'WARNING?', cls: 'red big', s: [540, 880], t0: 'warning', t1: 'cta' },
    { l: 'Love you', v: 'BESTIE', cls: 'big', s: [540, 900], t0: 'bestie', t1: 999 },
  ],

  steps: { title: 'WHAT IT NEEDS', labels: ['GEAR', 'BACKUP', 'PLAN'], marks: ['gear', 'backup', 'plan'], from: 'need', to: 'ask' },
  follow: { from: 'cta+0.1', title: 'TELL ME IN THE COMMENTS' },
  shakes: [['hook+0.45', .5, .14], ['every', .5, .12], ['data', 1.0, .1], ['eighties', .4, .1], ['fail+0.3', .6, .16], ['stopc', .7, .16], ['america', .4, .08], ['warning', .4, .1]],
  flashes: [['hook+0.45', .35, .35], ['every', .3, .25], ['data+0.2', .25, .2], ['fail+0.3', .3, .25], ['stopc', .35, .3]],

  sfx: [
    ['hook', 'whoosh', .5], ['hook+0.45', 'hit', .9], ['tech', 'thud', .6],
    ['freeze', 'tick', .55], ['every', 'whoosh', .5], ['every', 'hit', .8], ['every+0.6', 'alarm', .25],
    ['radar', 'whoosh', .45], ['radar+0.1', 'static', .3], ['radar+1.4', 'glitch', .35],
    ['routers', 'whoosh', .45], ['routers', 'buzz', .3], ['routers+1.6', 'thud', .6], ['data', 'glitch', .45], ['data+0.6', 'beep', .35],
    ['air', 'whoosh', .4], ['air', 'jet', .45], ['air+0.2', 'count', .35], ['landed+0.4', 'ding', .4],
    ['nohack', 'whoosh', .45], ['nohack+1.2', 'pop', .5], ['nohack+2.94', 'pop', .5],
    ['copper', 'whoosh', .45], ['copper+0.2', 'buzz', .15], ['eighties', 'hit', .7],
    ['question', 'whoosh', .45], ['question', 'pop', .5], ['job+0.3', 'pop', .45], ['fail+0.3', 'hit', .8], ['fail+0.4', 'beep', .35],
    ['right', 'whoosh', .45], ['right+0.6', 'ding', .45], ['baddata', 'glitch', .45],
    ['bigger', 'whoosh', .45], ['bigger+1.4', 'thud', .55], ['stopc', 'hit', .85],
    ['math', 'whoosh', .4], ['math', 'count', .4], ['math+0.1', 'thud', .55], ['hours', 'tick', .55],
    ['after', 'whoosh', .4], ['breakdown', 'beep', .4], ['ahead', 'ding', .45],
    ['america-1.5', 'riser', .45], ['america', 'hit', .8], ['gear', 'pop', .5], ['backup', 'pop', .5], ['plan', 'pop', .5], ['plan+0.5', 'ding', .4],
    ['ask', 'whoosh', .45], ['ask', 'pop', .5], ['unavoidable', 'pop', .5], ['warning', 'hit', .6],
    ['cta+0.1', 'pop', .5], ['cta+1.7', 'click', .7], ['bestie', 'ding', .5],
  ],

  update(t, K) {
    const { T, ease, easeOut, clamp01, hash } = K, S = this.s, P = S.P;
    const seg = (a, b) => (t >= T(a) && t < T(b)) ? t - T(a) : -1;
    const shk = K.shakeAmp(t) * 260, sx = Math.sin(t * 61) * shk, sy = Math.cos(t * 47) * shk;
    const punch = lt => .08 * (1 - easeOut(clamp01(lt / .4)));          // little zoom kick on every cut
    const pulse = (c, w = .5) => Math.exp(-Math.pow((t - T(c)) / w, 2)); // bump around a cue
    const fr = Math.floor(t * 24);
    let noise = 0, wash = 0, washC = '#ff2a1a';

    // HOOK map: push in, cities twinkle; turns red on "Friday" (freeze) ; reused for "bigger" and the question
    let lt, d;
    if ((lt = seg('hook', 'every')) >= 0) {
      const red = ease(clamp01((t - T('freeze')) / 1.4));
      P.hook.set({ s: 1.2 + .3 * easeOut(lt / 9) + punch(lt + .4), x: -140 - 70 * lt / 9 + sx, y: 260 + 40 * lt / 9 + sy,
        f: `hue-rotate(${-40 * red}deg) saturate(${1 + .7 * red}) brightness(${1.05 - .2 * red})`, glitch: .5 * pulse('hook+0.5', .15) }, t);
      S.cities.forEach((g, i) => { g.style.opacity = (.35 + .65 * Math.abs(Math.sin(t * 2.2 + i * 1.7))) * (1 - red * .4); });
    } else if ((lt = seg('bigger', 'math')) >= 0) {
      d = T('math') - T('bigger');
      P.hook.set({ s: 1.75 - .55 * easeOut(lt / d) + punch(lt), x: -200 + 120 * easeOut(lt / d) + sx, y: 420 - 200 * easeOut(lt / d) + sy,
        f: `hue-rotate(-40deg) saturate(1.7) brightness(${.85 + .5 * pulse('stopc', .3)})`, glitch: .6 * pulse('stopc', .25) }, t);
      S.cities.forEach((g, i) => { g.style.opacity = .3 + .7 * Math.abs(Math.sin(t * 7 + i)); });
      wash = .25 * pulse('stopc', .4);
    } else if ((lt = seg('ask', 999)) >= 0) {
      P.hook.set({ s: 1.25 + .1 * lt / 10, x: -170, y: 300, f: 'blur(6px) brightness(.4)' }, t);
      S.cities.forEach((g, i) => { g.style.opacity = .25 + .3 * Math.abs(Math.sin(t * 1.5 + i)); });
    } else P.hook.set({ op: 0 });

    // FREEZE: planes held at the runway, red beacons pulse ; reused for "right call / bad data"
    if ((lt = seg('every', 'radar')) >= 0) {
      d = T('radar') - T('every');
      P.freeze.set({ s: 1.12 + .12 * lt / d + punch(lt), x: 50 - 90 * lt / d + sx, y: 90 + sy }, t);
      S.beacons.forEach((g, i) => { g.style.opacity = Math.pow(Math.abs(Math.sin(t * 3.4 + i * .9)), 3); });
    } else if ((lt = seg('right', 'bigger')) >= 0) {
      d = T('bigger') - T('right');
      const bad = clamp01((t - T('baddata')) / .2);
      P.freeze.set({ s: 1.32 - .16 * easeOut(lt / d) + punch(lt), x: -70 + 120 * lt / d + sx, y: 120 + sy,
        f: bad > 0 ? `saturate(${1 - .5 * bad}) brightness(${.9})` : 'none', glitch: .7 * pulse('baddata+0.15', .25) + .12 * bad }, t);
      S.beacons.forEach((g, i) => { g.style.opacity = Math.pow(Math.abs(Math.sin(t * 3.4 + i * .9)), 3); });
      noise = .1 * bad;
    } else P.freeze.set({ op: 0 });

    // RADAR: screens glitch and fall into static
    if ((lt = seg('radar', 'routers')) >= 0) {
      d = T('routers') - T('radar');
      P.radar.set({ s: 1.12 + .2 * easeOut(lt / d) + punch(lt), x: sx, y: 230 + 60 * lt / d + sy,
        f: `brightness(${.9 + .3 * hash(1, fr)})`, glitch: .15 + .5 * clamp01(lt / d) + .6 * pulse('radar+1.4', .3) }, t);
      S.screen.style.opacity = .3 + .5 * hash(2, fr);
      noise = .06 + .22 * clamp01(lt / d);
    } else P.radar.set({ op: 0 });

    // ROUTERS: lights flicker, red alarm spins, data tears
    if ((lt = seg('routers', 'air')) >= 0) {
      d = T('air') - T('routers');
      const dt_ = clamp01((t - T('data')) / .3);
      P.routers.set({ s: 1.1 + .25 * easeOut(lt / d) + punch(lt), x: -40 + sx, y: 140 + sy, r: -1 + 2 * lt / d,
        f: `brightness(${.8 + .45 * hash(3, fr)}) contrast(1.1)`, glitch: .55 * dt_ * (.5 + .5 * hash(4, Math.floor(t * 6))) }, t);
      S.alarm.style.opacity = .55 + .45 * Math.abs(Math.sin(t * 7));
      S.beam.style.opacity = .9; S.beam.style.transform = `translate(-50%,-50%) rotate(${t * 260}deg)`;
      wash = .12 * Math.pow(Math.abs(Math.sin(t * 7)), 4);
      noise = .1 * dt_;
    } else P.routers.set({ op: 0 });

    // LANDING: plane drifts down onto the runway
    if ((lt = seg('air', 'nohack')) >= 0) {
      d = T('nohack') - T('air');
      P.landing.set({ s: 1.08 + .14 * lt / d + punch(lt), x: 30 - 60 * lt / d + sx, y: 60 + 120 * ease(lt / d) + sy }, t);
      S.landLights.forEach((g, i) => { g.style.opacity = .6 + .4 * Math.abs(Math.sin(t * 5 + i)); });
      wash = .2 * pulse('landed+0.3', .35); washC = '#ffc548';
    } else P.landing.set({ op: 0 });

    // COPPER: slow push, dust light, spark on "1980s"
    if ((lt = seg('copper', 'question')) >= 0) {
      d = T('question') - T('copper');
      P.copper.set({ s: 1.12 + .25 * ease(lt / d) + punch(lt), x: -20 + sx, y: 80 + sy, r: -1.5 + 3 * lt / d,
        glitch: .4 * pulse('eighties+0.1', .2) }, t);
      S.shaft.style.opacity = .45 + .25 * Math.sin(t * 2.3);
      S.spark.style.opacity = Math.max(pulse('eighties+0.1', .12), .7 * pulse('copper+2.2', .08) * (hash(5, fr) > .5 ? 1 : 0));
    } else P.copper.set({ op: 0 });

    // AMERICA: low angle tilt up, tower lights blink
    if ((lt = seg('america', 'ask')) >= 0) {
      d = T('ask') - T('america');
      P.america.set({ s: 1.06 + .2 * easeOut(lt / d) + punch(lt), x: 20 + sx, y: 120 - 220 * ease(lt / d) + sy }, t);
      S.tower.forEach((g, i) => { g.style.opacity = Math.pow(Math.abs(Math.sin(t * 2.5 + i * 1.3)), 2); });
      wash = .3 * pulse('america+0.1', .35); washC = '#ffc548';
    } else P.america.set({ op: 0 });

    K.noise(noise, t); K.wash(washC, wash);

    // ---- 3D ----
    // lock spins slowly, shackle snaps shut; magnifier circles during "investigation"
    S.lock.rotation.y = Math.sin(t * .8) * .35;
    S.shackle.position.y = .45 * (1 - easeOut(clamp01((t - T('nohack') - 1.2) / .35)));
    const mi = clamp01((t - T('nohack') - 2.9) / .4);
    S.mag.visible = mi > 0; S.mag.scale.setScalar(.01 + .99 * K.pop(mi));
    S.mag.position.set(Math.cos(t * 2.2) * .9 + .3, 2.1 + Math.sin(t * 2.2) * .6, 1.4);
    // racks: middle one turns red and tips over on "fail"
    const fk = clamp01((t - T('fail') - .3) / .7);
    const m = S.racks[1]; m.gold.visible = fk <= 0; m.red.visible = fk > 0; m.piv.rotation.z = -1.35 * fk * fk;
    S.racks.forEach((r, i) => { r.piv.position.y = i === 1 ? 0 : Math.max(0, Math.sin(clamp01((t - T('question') - i * .2) / .4) * Math.PI)) * .25; });
    // board: tiles flip to red in sync with the 6,600 counter
    const nRed = Math.floor(60 * easeOut(clamp01((t - T('math')) / 2.2)) + .0001);
    S.tiles.forEach((tl, i) => { tl.rd.visible = i < nRed; tl.g.visible = i >= nRed; });
    // clock draws, hands spin through 4 hours
    const ck = easeOut(clamp01((t - T('hours')) / 1.4)); K.drawTube(S.clock, ck);
    S.hand.rotation.z = -Math.PI * 2 * 4 * ease(clamp01((t - T('hours') - .2) / 2.4)); S.hand2.rotation.z = -Math.PI * 2 / 3 * ease(clamp01((t - T('hours') - .2) / 2.4));
    // timeline: red line breaks, gold line gets ahead
    K.drawTube(S.lineRed, easeOut(clamp01((t - T('after') - .1) / 1.6)));
    const xk = clamp01((t - T('breakdown')) / .3); S.xMark.visible = xk > 0; S.xMark.scale.setScalar(.01 + .99 * K.pop(xk));
    const gk = easeOut(clamp01((t - T('ahead')) / 1.0)); K.drawTube(S.lineGold, gk); S.arrow.visible = gk > .95;
  },
};
