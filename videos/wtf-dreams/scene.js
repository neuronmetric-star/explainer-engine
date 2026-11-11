// Why the fuck do we dream, and why do we forget them? — BLUEPRINT look (science)
// Sets: bed + dreaming brain x=0 | hypnogram x=30 | memory sorting x=60 | threat chase x=90 | mouse study x=120
//       hippocampus + noradrenaline x=150 | waking up x=180 | laptop x=210
window.SCENE = {
  style: 'blueprint',
  distance: 1,
  build(K) {
    const { box, cyl, group, wire, glow, line, GOLD, RED, WHITE, BLUE, CYAN, SILVER, PINK, VIOLET } = K;
    const S = this.s = {};
    const brain = (x, y, z, s = 1, c = PINK) => { const g = group(x, y, z); g.scale.setScalar(s);
      for (let i = 0; i < 2; i++) { const h = wire(new THREE.SphereGeometry(1.1, 14, 10), c, g, { angle: 10 }); h.scale.set(1.35, .95, 1); h.position.set(0, 0, i ? .55 : -.55); }
      for (let k = 0; k < 5; k++) { const p = []; for (let a = 0; a <= 30; a++) { const u = a / 30 * Math.PI; p.push([Math.cos(u) * 1.45, Math.sin(u) * (.95 - k * .1) + .05 + .06 * Math.sin(a * 1.7 + k), (k - 2) * .38]); } line(p, c, g, 2); }
      wire(new THREE.CylinderGeometry(.2, .14, .9, 8), c, g).position.set(.3, -1.1, 0); return g; };
    const bed = (x, z, p) => { const g = group(x, 0, z, p); box(5, .5, 2.6, 0, .6, 0, g, SILVER); box(4.8, .4, 2.4, 0, 1.05, 0, g, WHITE);
      box(.3, 2, 2.6, -2.5, 1, 0, g, SILVER); box(.3, 1.3, 2.6, 2.5, .65, 0, g, SILVER); box(1, .35, 1.6, -1.8, 1.4, 0, g, WHITE); return g; };
    const sleeper = (x, z, p, sitting) => { const pp = K.person(0, 0, { scale: .75 }); const g = group(x, 1.3, z, p); g.add(pp);
      if (!sitting) { pp.rotation.z = Math.PI / 2; pp.position.set(-.3, .45, 0); } else { pp.position.set(-1.6, 0, 0); }
      return g; };
    S.brain = brain;

    // ---------- SET 1 (x=0): Jay asleep, brain dreaming above ----------
    bed(0, 0); S.jay = sleeper(.6, 0, undefined, false);
    S.blanket = box(3.2, .3, 2.5, .9, 1.42, 0, undefined, BLUE);
    S.b1 = brain(0, 6.2, 0, 1.3);
    S.bub = []; for (let i = 0; i < 7; i++) { const b = group(0, 0, 0); wire(new THREE.IcosahedronGeometry(.55, 1), i % 2 ? CYAN : VIOLET, b);
      const k = i % 3; if (k === 0) box(.3, .3, .3, 0, 0, 0, b, GOLD); else if (k === 1) wire(new THREE.ConeGeometry(.22, .4, 4), GOLD, b); else wire(new THREE.TorusGeometry(.18, .06, 6, 12), GOLD, b);
      S.bub.push(b); }
    S.pops = S.bub.map(() => { const r = glow(new THREE.RingGeometry(.5, .62, 24), RED, undefined, 1); r.visible = false; return r; });
    S.moon = glow(new THREE.CircleGeometry(.9, 32), 0xfff1b8, undefined, 1, 4.5, 10, -6);
    S.zz = [0, 1, 2].map(i => { const z = line([[0, 0, 0], [.4, 0, 0], [0, -.4, 0], [.4, -.4, 0]], WHITE, undefined, 3); return z; });

    // ---------- SET 2 (x=30): hypnogram (sleep stages across 8 hours) ----------
    // stage levels: 0 = awake, 1 = REM, 2 = light, 3 = deep
    const H = [[0, 0], [.2, 2], [.5, 3], [1.1, 3], [1.3, 2], [1.4, 1], [1.6, 1], [1.8, 2], [2.1, 3], [2.6, 3], [2.8, 2], [3.0, 1], [3.35, 1], [3.6, 2], [4.0, 3], [4.3, 2], [4.5, 1], [5.0, 1], [5.3, 2], [5.9, 2], [6.0, 1], [6.6, 1], [6.8, 2], [7.2, 2], [7.3, 1], [7.85, 1], [8, 0]];
    const hx = h => 30 - 6 + h * 1.5, hy = st => 7 - st * 1.3;
    const hp = []; H.forEach(([h, st], i) => { if (i) hp.push([hx(h), hy(H[i - 1][1]), 0]); hp.push([hx(h), hy(st), 0]); });
    S.hyp = line(hp, CYAN, undefined, 4);
    S.remBars = []; for (let i = 0; i < H.length - 1; i++) if (H[i][1] === 1) { const w = (H[i + 1][0] - H[i][0]) * 1.5; S.remBars.push(glow(new THREE.PlaneGeometry(w, 4.2), GOLD, undefined, .35, hx(H[i][0]) + w / 2, hy(1.6), -.1)); }
    for (let h = 0; h <= 8; h += 2) box(.05, .3, .05, hx(h), 2.6, 0, undefined, WHITE);
    box(12, .05, .05, 30, 2.5, 0, undefined, SILVER);
    S.hypLabels = [['AWAKE', 0], ['REM', 1], ['LIGHT', 2], ['DEEP', 3]];

    // ---------- SET 3 (x=60): replay — memories sorted into keep / bin ----------
    S.b3 = brain(60, 6.8, -1, 1.15);
    S.cabinet = group(63.2, 0, -1); box(2, 3.4, 1.6, 0, 1.7, 0, S.cabinet, CYAN); for (let i = 0; i < 3; i++) box(1.6, .9, .1, 0, .7 + i * 1.05, .82, S.cabinet, CYAN);
    S.bin = group(56.8, 0, -1); wire(new THREE.CylinderGeometry(.9, .7, 1.8, 12, 1, true), RED, S.bin).position.y = .9;
    S.mems = []; for (let i = 0; i < 8; i++) { const m = box(.8, .55, .06, 0, 0, 0, undefined, i % 3 === 2 ? SILVER : GOLD); m.userData.keep = i % 3 !== 2; m.visible = false; S.mems.push(m); }

    // ---------- SET 4 (x=90): threat simulation — a dream chase ----------
    S.runner = K.person(91, 0, { scale: .9, color: 0x9fb8d6 });
    S.legs = [];
    S.monster = group(86.5, 0, -.5);
    const mb = wire(new THREE.IcosahedronGeometry(1.6, 0), RED, S.monster); mb.position.y = 2.4;
    for (let i = 0; i < 6; i++) { const sp = wire(new THREE.ConeGeometry(.25, 1.2, 4), RED, S.monster); const a = i / 6 * Math.PI * 2; sp.position.set(Math.cos(a) * 1.6, 2.4 + Math.sin(a) * 1.6, 0); sp.rotation.z = a - Math.PI / 2; }
    glow(new THREE.SphereGeometry(.2, 8, 6), 0xffe39a, S.monster, 1, .9, 2.8, 1.2); glow(new THREE.SphereGeometry(.2, 8, 6), 0xffe39a, S.monster, 1, .1, 2.8, 1.4);
    S.dreamFrame = line([[83, .1, 1.6], [97, .1, 1.6]], VIOLET, undefined, 3);
    S.trackLines = []; for (let i = 0; i < 8; i++) S.trackLines.push(box(1.2, .04, .08, 0, .05, 1.2, undefined, VIOLET));

    // ---------- SET 5 (x=120): 2019 mouse study ----------
    S.mouse = group(118, 0, 0); const mbody = wire(new THREE.SphereGeometry(.9, 10, 8), WHITE, S.mouse, { angle: 10 }); mbody.scale.set(1.6, .85, .9); mbody.position.y = .9;
    wire(new THREE.SphereGeometry(.5, 10, 8), WHITE, S.mouse, { angle: 10 }).position.set(1.55, 1.15, 0);
    wire(new THREE.ConeGeometry(.2, .5, 6), WHITE, S.mouse).position.set(2.1, 1.1, 0);
    for (const z of [-.35, .35]) wire(new THREE.CircleGeometry(.35, 10), PINK, S.mouse).position.set(1.35, 1.65, z);
    line([[-1.4, .8, 0], [-2.2, .5, 0], [-2.9, .9, 0], [-3.4, .6, 0]], PINK, S.mouse, 3);
    S.mb = brain(122.4, 4.6, -1, .9);
    S.neurons = []; for (let i = 0; i < 6; i++) { const n = glow(new THREE.IcosahedronGeometry(.16, 0), 0xb59cff, undefined, 1); n.position.set(121.4 + (i % 3) * .9, 4.2 + Math.floor(i / 3) * .7, .1); S.neurons.push(n); }
    S.delCards = []; for (let i = 0; i < 5; i++) { const c = box(.7, .45, .06, 124.6 + (i % 2) * .9, 6.2 - i * .55, 0, undefined, GOLD); S.delCards.push(c); }

    // ---------- SET 6 (x=150): hippocampus (the saver) + noradrenaline meter ----------
    S.b6 = brain(150, 5.4, -1, 2.0, BLUE);
    const sea = []; for (let a = 0; a <= 40; a++) { const u = a / 40; const ang = u * Math.PI * 1.6; sea.push([150 - .2 + Math.cos(ang) * (1.1 - u * .55) * 1.2, 4.8 - u * .8 + Math.sin(ang) * (1.1 - u * .55) * .9, 2.6]); }
    S.hippo = line(sea, GOLD, undefined, 9);
    S.hippoGlow = glow(new THREE.SphereGeometry(.9, 14, 10), GOLD, undefined, .0, 149.8, 4.4, 2.5);
    S.zzz = [0, 1, 2].map(i => line([[0, 0, 0], [.3, 0, 0], [0, -.3, 0], [.3, -.3, 0]], GOLD, undefined, 3));
    S.meter = group(156.6, 1.2, -1); box(1.1, 5, .8, 0, 2.5, 0, S.meter, SILVER);
    S.meterFill = K.bar(.8, .6, 156.6, -1, undefined, RED); S.meterFill.position.y = 1.2;

    // ---------- SET 7 (x=180): waking up — short-term box, save path blocked ----------
    bed(178.4, 0); S.jay7 = sleeper(178.4, 0, undefined, true);
    S.stm = group(181.2, 5.6, 0); box(2.6, 1.8, .8, 0, 0, 0, S.stm, CYAN);
    S.dreamB = group(181.2, 5.6, .2); wire(new THREE.IcosahedronGeometry(.6, 1), VIOLET, S.dreamB); wire(new THREE.ConeGeometry(.22, .4, 4), GOLD, S.dreamB);
    S.ltm = group(185.4, 5.6, 0); box(2.6, 1.8, .8, 0, 0, 0, S.ltm, SILVER);
    S.arrow = line([[182.6, 5.6, 0], [184, 5.6, 0]], SILVER, undefined, 5);
    S.xMark = [line([[183, 6.1, .3], [183.8, 5.1, .3]], RED, undefined, 7), line([[183, 5.1, .3], [183.8, 6.1, .3]], RED, undefined, 7)];
    S.dust = []; for (let i = 0; i < 18; i++) { const d = glow(new THREE.TetrahedronGeometry(.1, 0), 0xb59cff, undefined, 1); d.visible = false; S.dust.push(d); }

    // ---------- SET 8 (x=210): laptop, autosave off ----------
    const L = group(210, 1.0, 0); box(5, .25, 3.2, 0, 0, 0, L, SILVER);
    S.lid = group(0, .12, -1.55, L); box(5, 3.3, .15, 0, 1.65, 0, S.lid, SILVER);
    S.screen = glow(new THREE.PlaneGeometry(4.6, 2.9), 0x6f93bd, S.lid, 1, 0, 1.68, .09);
    S.textLines = []; for (let i = 0; i < 7; i++) { const w = 3.6 - (i * 37 % 5) * .3; const tl = glow(new THREE.PlaneGeometry(w, .14), 0x0b1e3d, S.lid, 1, -1.9 + w / 2, 2.75 - i * .3, .1); S.textLines.push(tl); }
    S.toggle = glow(new THREE.PlaneGeometry(1.0, .38), RED, S.lid, 1, 1.6, .5, .11);
    box(10, .6, 4.5, 210, .35, 0, undefined, BLUE); // desk
    S.stand = K.person(204.8, 1.4, { scale: .75 });
  },

  shots: [
    [0,          [3.5, 5.2, 14],   [0, 4.8, 0],     1.5],
    ['setup',    [30, 5.2, 25],    [30, 4.8, 0],    1.5],
    ['step1',    [60, 5.2, 17],    [60, 4.6, -1],   1.2],
    ['step2',    [89, 4, 14],      [89, 2.6, 0],    1.2],
    ['step3',    [120.5, 4, 15],   [120.5, 3, -.5], 1.2],
    ['catch',    [152, 5.4, 19],   [152, 4.8, -1],  1.5],
    ['wake',     [182, 5, 17.5],   [182, 4.4, 0],   1.2],
    ['contrast', [210, 4.4, 14],   [210, 3, -1],    1.2],
    ['punch',    [3.5, 5.2, 14],   [0, 4.8, 0],     1.2],
  ],

  cards: [
    { l: 'Every night', v: 'YOU DREAM', cls: 'white', a: [0, 9.6, 0], t0: 0, t1: 'forget' },
    { l: 'By breakfast', v: 'GONE', cls: 'red big', a: [0, 9.6, 0], t0: 'forget+0.3', t1: 'reframe' },
    { l: 'Not random', v: 'NIGHT SHIFT', a: [0, 9.6, 0], t0: 'shift', t1: 'setup' },
    { l: 'Jay sleeps', v: '8 HOURS', cls: 'white', a: [30, 9.6, 0], t0: 'setup+0.2', t1: 'twohours' },
    { l: 'Dreaming', v: '≈ 2 HOURS', cls: 'big', a: [30, 9.6, 0], t0: 'twohours+0.2', t1: 'step1' },
    { v: 'REM', cls: 'tag', a: [23.2, hy1(), 0], t0: 'twohours+0.6', t1: 'step1' },
    { v: 'DEEP', cls: 'tag white', a: [23.2, 3.1, 0], t0: 'setup+0.6', t1: 'step1' },
    { l: 'Replay the day', v: 'SORT + SAVE', a: [60, 3.0, .5], t0: 'replay+0.2', t1: 'step2' },
    { l: 'Theory', v: 'THREAT SIMULATION', cls: 'red', a: [89, 6.0, 0], t0: 'threat+0.2', t1: 'practice' },
    { l: 'Safe practice', v: 'ESCAPE', a: [89, 6.0, 0], t0: 'practice', t1: 'step3' },
    { l: '2019 mouse study', v: 'FORGET NEURONS', cls: 'white', a: [120.5, 7.0, -.5], t0: 'mice+0.3', t1: 'catch' },
    { l: 'Memory saver', v: 'HIPPOCAMPUS', a: [151.5, 8.6, -1], t0: 'hippo+0.2', t1: 'nor' },
    { l: 'Named for its shape:', v: 'SEAHORSE', cls: 'white', a: [147.4, 7.4, -1], t0: 'hippo+1.2', t1: 'hippo+2.4' },
    { l: 'Last to', v: 'WAKE UP', cls: 'red', a: [151.5, 8.6, -1], t0: 'hippo+2.4', t1: 'nor' },
    { l: 'Memory glue', v: 'NORADRENALINE', cls: 'white', a: [152, 8.6, -1], t0: 'nor+0.2', t1: 'wake' },
    { l: 'During REM', v: 'LOW', cls: 'red big', a: [156.6, 4.0, 1], t0: 'nor+1.2', t1: 'wake' },
    { v: 'SHORT-TERM', cls: 'tag', a: [181.2, 7.2, 0], t0: 'wake+0.3', t1: 'contrast' },
    { v: 'LONG-TERM', cls: 'tag white', a: [185.4, 7.2, 0], t0: 'wake+0.3', t1: 'contrast' },
    { l: 'Seconds later', v: 'GONE', cls: 'red big', a: [182.4, 8.6, 0], t0: 'seconds+0.3', t1: 'contrast' },
    { l: 'Autosave', v: 'OFF', cls: 'red', a: [207.6, 6.6, -1], t0: 'contrast+0.4', t1: 'punch' },
    { l: 'Laptop', v: 'DIED', cls: 'red big', a: [211.8, 6.6, -1], t0: 'crash+0.3', t1: 'punch' },
  ],

  steps: { title: 'THE NIGHT SHIFT', labels: ['REPLAY', 'REHEARSE', 'DELETE'], marks: ['step1', 'step2', 'step3'], from: 'step1', to: 'catch' },
  receipt: { from: 'punch', to: 'cta', title: 'WHY DREAMS VANISH', rows: [
    ['DREAM TIME', '≈ 2 HRS / NIGHT'], ['NIGHT SHIFT', 'SORT MEMORIES', 'g'], ['HIPPOCAMPUS', 'LAST TO WAKE', 'k'], ['NORADRENALINE', 'LOW IN REM', 'k'], ['RESULT', 'NEVER SAVED', 'k']] },
  follow: { from: 'cta+0.2', title: 'MORE WHY THE F*CK SCIENCE' },
  shakes: [['crash+0.2', .7, .14]],
  flashes: [['forget+0.2', .3, .12], ['crash+0.2', .35, .18]],

  update(t, K) {
    const { at, T, ease, easeOut, clamp01 } = K, S = this.s;
    // dream bubbles rise from the brain, pop on "forget"
    const popT = at('forget') + .2;
    S.bub.forEach((b, i) => { const q = ((t * .35 + i / 7) % 1); const ang = i * 2.1 + t * .3;
      b.position.set(Math.cos(ang) * (1.6 + q * 1.8), 6.4 + q * 3.2, Math.sin(ang) * 1.2); b.rotation.set(t, t * .7, 0);
      const popped = t > popT + i * .08 && t < at('punch'); b.visible = !popped; b.scale.setScalar(.6 + .6 * Math.sin(q * Math.PI));
      const r = S.pops[i], rq = (t - popT - i * .08) / .5; r.visible = rq > 0 && rq < 1; if (r.visible) { r.position.copy(b.position); r.scale.setScalar(.6 + rq * .9); r.material.opacity = 1 - rq; } });
    S.b1.rotation.y = Math.sin(t * .5) * .4; S.b1.scale.setScalar(1.3 * (1 + (t > at('shift') ? .05 * Math.max(0, Math.sin(t * 7)) : 0)));
    S.jay.position.y = 1.3 + Math.sin(t * 1.4) * .03;
    S.zz.forEach((z, i) => { const q = ((t * .4 + i / 3) % 1); z.position.set(-1.8 + q * .8, 2.4 + q * 2, .5); z.scale.setScalar(.6 + q * .8); });
    // hypnogram draws; REM bars glow on "twohours"
    K.setLine(S.hyp, easeOut(clamp01((t - at('setup')) / 1.6)));
    S.remBars.forEach((b, i) => { b.visible = t > at('twohours') + i * .12; b.material.opacity = .25 + .15 * Math.sin(t * 4 + i); });
    // memory cards fly from brain into cabinet (keep) or bin (toss)
    S.mems.forEach((m, i) => K.fly(m, t, at('replay') + .1 + i * .32, .8, new THREE.Vector3(60, 5.8, -1), m.userData.keep ? new THREE.Vector3(63.2, 2.2, -.2) : new THREE.Vector3(56.8, 1.4, -1), 1.4));
    S.b3.rotation.y = Math.sin(t * .6) * .3;
    // the chase: dream treadmill (runner stays put, world scrolls)
    const run = t * 9; S.runner.children.forEach((c, i) => { }); S.runner.position.y = Math.abs(Math.sin(run)) * .22; S.runner.rotation.z = -.12;
    S.monster.position.x = 86.5 + Math.sin(t * 1.3) * .6 - (t > at('practice') ? 1.5 * ease(clamp01((t - at('practice')) / 1)) : 0);
    S.monster.rotation.y = t * .8; S.monster.position.y = Math.abs(Math.sin(t * 4)) * .3;
    S.trackLines.forEach((l, i) => { l.position.x = 83 + ((i * 2 - t * 6) % 16 + 16) % 16; });
    // mouse study: neurons fire, cards dissolve
    S.neurons.forEach((n, i) => { n.scale.setScalar(1 + .6 * Math.max(0, Math.sin(t * 6 + i))); });
    S.delCards.forEach((c, i) => { const q = ease(clamp01((t - at('mice') - .6 - i * .3) / .5)); c.scale.setScalar(Math.max(.001, 1 - q)); });
    S.mouse.position.y = Math.abs(Math.sin(t * 3)) * .05;
    // hippocampus: dim and sleepy; noradrenaline meter drops
    const h = clamp01((t - at('hippo')) / .6); K.setLine(S.hippo, easeOut(h));
    S.hippoGlow.material.opacity = h * (.15 + .1 * Math.sin(t * 2));
    S.zzz.forEach((z, i) => { const q = ((t * .4 + i / 3) % 1); z.visible = t > at('hippo') + .6 && t < at('wake'); z.position.set(150.6 + q * .9, 5.4 + q * 2.2, 2.8); z.scale.setScalar(.6 + q); });
    K.setBar(S.meterFill, 4.6 - 3.9 * ease(clamp01((t - at('nor') - .4) / 1.2))); S.meterFill.position.y += 1.2;
    // waking: dream sits in short-term, save path X'd, dream crumbles
    const ok = t > at('nobody'); S.xMark.forEach(l => K.setLine(l, easeOut(clamp01((t - at('nobody')) / .3))));
    const crumble = clamp01((t - at('seconds') - .2) / 1.0);
    S.dreamB.visible = crumble < .2; S.dreamB.rotation.y = t; S.dreamB.position.y = 5.6 + Math.sin(t * 3) * .08;
    S.dust.forEach((d, i) => { d.visible = crumble > 0 && crumble < 1; const a = i / 18 * Math.PI * 2; d.position.set(181.2 + Math.cos(a) * crumble * 1.6, 5.6 + Math.sin(a) * crumble * 1.2 - crumble * crumble * 2, .3); d.material.opacity = 1 - crumble; });
    S.jay7.rotation.z = Math.sin(t * .8) * .03;
    // laptop: typing, then it dies
    const dead = t > at('crash') + .2;
    S.textLines.forEach((l, i) => { l.visible = !dead && t > at('contrast') + i * .25; });
    S.screen.material.color.copy(K.col(dead ? 0x02040a : 0x6f93bd)); S.toggle.visible = !dead;
    S.lid.rotation.x = dead ? -.08 * ease(clamp01((t - at('crash') - .2) / .3)) : 0;
  },
};
function hy1() { return 7 - 1 * 1.3; }
