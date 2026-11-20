// motivation-vs-discipline: plates (+ 3 Wan 3.0 480p clip plates) + Doug, Gary, Victor. Plan: shotlist.md.
// World units: feet at y=0, camera at (0, camH, 0) looking down -z. Props in screen px (y down).
(function () {
  const PI = Math.PI;
  const face = (ch, name, t, off = 0) => ch.face(((t + off) % 4.1) < .12 && name !== 'happy' ? 'blink' : name);
  const WORDS = window.VIDEO_DATA.words, norm = w => w.toLowerCase().replace(/[^a-z0-9]/g, '');
  // start time of a spoken word, searching from a word index (used for sub-cuts inside long lines)
  const wordT = (w, after = 0) => { const x = WORDS.find(o => o.start >= after - .01 && norm(o.w) === w); if (!x) throw new Error('word ' + w); return x.start; };

  const L = {
    dawn: { key: [0xffb27a, 2.2, [2, 6, -30]], hemi: [0xffb0c8, 0x8a5a70, .95], front: [0xffd6c4, 1.15], shadow: [0x5a2a5a, .22] },
    rain: { key: [0xa8b8d8, .9, [-10, 12, 2]], hemi: [0x8090b0, 0x2a3040, 1.0], front: [0xb8c4e0, .95], shadow: [0x101828, .35] },
    room: { key: [0xffb060, 2.3, [-14, 6, 0]], hemi: [0xffd0a0, 0x8a4a20, .8], front: [0xffe0c8, 1.0], shadow: [0x5a2a10, .38] },
    roomRain: { key: [0x90a4d0, 1.0, [-14, 6, 0]], hemi: [0x7080a8, 0x302a30, 1.0], front: [0xa8b4d8, .9], shadow: [0x101020, .4] },
    entry: { key: [0xffc88a, 2.0, [-10, 8, 2]], hemi: [0xffe0c0, 0x8a5a30, .85], front: [0xffe6d4, 1.0], shadow: [0x4a2a18, .36] },
    night: { key: [0xffb060, 1.6, [10, 8, 2]], hemi: [0x5a6098, 0x5a3418, .8], front: [0xffc890, .85], shadow: [0x1a0c08, .45] },
    sun: { key: [0xffc060, 2.6, [0, 5, -30]], hemi: [0xffa060, 0x6a7a30, .9], front: [0xffc8a0, 1.1], shadow: [0x5a3a10, .25] },
    bath: { key: [0xffd8a0, 2.0, [-12, 7, 2]], hemi: [0xd8e4ff, 0xc0a080, .9], front: [0xfff0e0, 1.0], shadow: [0x5a4a50, .32] },
  };

  // sub-cut times (numbers are seconds; the kit accepts both)
  const T = c => { const D = window.VIDEO_DATA, S = ScriptParser.parse(D.script); let wi = 0; for (const tk of S) { if (tk.cue === c) return D.words[wi].start; if (!tk.cue) wi += tk.n; } throw new Error(c); };
  const tOr = wordT('or', T('choice'));
  const tPuts = wordT('puts', T('loop')), tHeads = wordT('heads', T('loop'));
  const tAnyway = wordT('goes', T('hates'));
  const tLast = wordT('last', T('callback'));

  window.SCENE = {
    plates: {
      '01': { img: '01_street_wide_dawn.png', hz: .374, vx: .5, fov0: 55, camH: 1.5, light: L.dawn },
      '02': { img: '02_entry_shoes_morning.png', hz: .26, vx: .5, fov0: 55, camH: 1.5, light: L.entry },
      '03': { img: '03_bedroom_dawn.png', hz: .29, vx: .5, fov0: 55, camH: 1.45, light: L.room },
      '04': { img: '04_hill_sunrise.png', hz: .37, vx: .5, fov0: 55, camH: 1.7, light: L.sun, clip: { dir: 'clips/sunrise', n: 150, fps: 30 } },
      '05': { img: '05_street_wide_rain.png', hz: .374, vx: .5, fov0: 55, camH: 1.5, light: L.rain, clip: { dir: 'clips/rain', n: 150, fps: 30 } },
      '06': { img: '06_bedroom_rain.png', hz: .29, vx: .5, fov0: 55, camH: 1.45, light: L.roomRain, clip: { dir: 'clips/bedroom', n: 150, fps: 30 } },
      '07': { img: '07_entry_shoes_night.png', hz: .26, vx: .5, fov0: 55, camH: 1.5, light: L.night },
      '08': { img: '08_bathroom_sink_morning.png', hz: .25, vx: .5, fov0: 55, camH: 1.5, light: L.bath },
    },
    props: { P01: 'P01_shoes.png', P02: 'P02_toothbrush.png', P03: 'P03_alarm_clock.png', P04: 'P04_chart_card.png' },
    cast: { doug: 'hoodie', gary: { outfit: 'oxford', shoes: 0xff7a1a, sneakers: true }, garyIn: { outfit: 'oxford', shoes: 0xf2f2f2, sneakers: true }, victor: 'suit' },
    shots: [
      { at: 'q', plate: '01', zoom: [1.0, 1.12], focus: [[.5, .55], [.5, .58]] },
      { at: 'problem', plate: '01', zoom: [1.6, 1.68], focus: [[.35, .47], [.35, .46]] },
      { at: 'wake', plate: '03', zoom: [1.0, 1.1], focus: [[.5, .5], [.46, .48]] },
      { at: 'sunrise', plate: '04', zoom: [1.0, 1.1], focus: [[.5, .5], [.5, .48]] },
      { at: 'motiv', plate: '04', zoom: [1.6, 1.7], focus: [[.5, .5], [.5, .49]], clipFrom: 3.76 },
      { at: 'plan', plate: '03', zoom: [1.35, 1.45], focus: [[.45, .4], [.45, .39]] },
      { at: 'gary', plate: '01', zoom: [1.6, 1.7], focus: [[.78, .55], [.8, .55]] },
      { at: 'shoes', plate: '02', zoom: [1.0, 1.25], focus: [[.5, .6], [.5, .66]] },
      { at: 'six', plate: '02', zoom: [1.0, 1.06], focus: [[.5, .6], [.5, .6]] },
      { at: 'hates', plate: '01', zoom: [1.15, 1.25], focus: [[.6, .6], [.55, .55]] },
      { at: tAnyway, plate: '01', zoom: [1.2, 1.28], focus: [[.55, .5], [.55, .48]] },
      { at: 'disc', plate: '01', zoom: [1.0, 1.08], focus: [[.5, .55], [.5, .52]] },
      { at: 'bet', plate: '01', zoom: [1.1, 1.15], focus: [[.45, .6], [.5, .6]] },
      { at: 'dentist', plate: '01', zoom: [1.9, 2.0], focus: [[.6, .42], [.6, .41]] },
      { at: 'week', plate: '01', zoom: [1.2, 1.25], focus: [[.4, .5], [.4, .5]] },
      { at: 'week+0.6', plate: '01', zoom: [1.45, 1.5], focus: [[.6, .5], [.6, .5]] },
      { at: 'week+1.2', plate: '01', zoom: [1.1, 1.1], focus: [[.5, .55], [.5, .55]] },
      { at: 'week+1.8', plate: '01', zoom: [1.6, 1.65], focus: [[.45, .48], [.45, .48]] },
      { at: 'rain', plate: '05', zoom: [1.0, 1.06], focus: [[.5, .5], [.5, .5]] },
      { at: 'check', plate: '06', zoom: [1.15, 1.3], focus: [[.35, .45], [.33, .42]] },
      { at: 'bed', plate: '06', zoom: [1.4, 1.5], focus: [[.75, .55], [.75, .55]], clipFrom: 2.85 },
      { at: 'soaked', plate: '05', zoom: [1.1, 1.15], focus: [[.5, .6], [.5, .58]], clipFrom: 1.3 },
      { at: 'wrong', plate: '05', zoom: [1.6, 1.7], focus: [[.5, .45], [.5, .44]], clipFrom: 3.4 },
      { at: 'aside', plate: '02', zoom: [1.2, 1.5], focus: [[.5, .62], [.5, .66]] },
      { at: 'loop', plate: '02', zoom: [1.6, 1.6], focus: [[.5, .68], [.5, .68]] },
      { at: tPuts, plate: '02', zoom: [1.1, 1.15], focus: [[.6, .6], [.6, .6]] },
      { at: tHeads, plate: '01', zoom: [1.2, 1.3], focus: [[.72, .55], [.7, .55]] },
      { at: 'enough', plate: '02', zoom: [1.0, 1.0], focus: [[.5, .6], [.5, .6]] },
      { at: 'enough+1.0', plate: '02', zoom: [1.1, 1.1], focus: [[.52, .6], [.52, .6]] },
      { at: 'enough+2.0', plate: '02', zoom: [1.22, 1.22], focus: [[.54, .6], [.54, .6]] },
      { at: 'habit', plate: '02', zoom: [1.8, 1.9], focus: [[.5, .68], [.5, .68]] },
      { at: 'teeth', plate: '08', zoom: [1.0, 1.1], focus: [[.42, .45], [.4, .44]] },
      { at: 'pep', plate: '08', zoom: [1.0, 1.0], focus: [[.5, .6], [.5, .6]] },
      { at: 'study', plate: '03', zoom: [1.0, 1.0], focus: [[.5, .5], [.5, .5]] },
      { at: 'longer', plate: '03', zoom: [1.0, 1.0], focus: [[.5, .5], [.5, .5]] },
      { at: 'callback', plate: '07', zoom: [1.0, 1.15], focus: [[.5, .6], [.5, .64]] },
      { at: tLast, plate: '07', zoom: [1.5, 1.6], focus: [[.5, .66], [.5, .66]] },
      { at: 'laces', plate: '02', zoom: [1.1, 1.2], focus: [[.6, .55], [.6, .56]] },
      { at: 'end', plate: '06', zoom: [1.0, 1.08], focus: [[.5, .55], [.55, .55]] },
      { at: 'zero', plate: '06', zoom: [1.6, 1.7], focus: [[.78, .55], [.78, .55]] },
      { at: 'question', plate: '01', zoom: [1.0, 1.08], focus: [[.5, .6], [.5, .6]] },
      { at: 'choice', plate: '06', zoom: [1.15, 1.2], focus: [[.38, .42], [.38, .42]] },
      { at: tOr, plate: '02', zoom: [1.1, 1.18], focus: [[.6, .5], [.58, .52]] },
      { at: 'cta', plate: '01', zoom: [1.05, 1.05], focus: [[.5, .6], [.5, .6]] },
    ],
    shakes: [['wake', .25, .5], ['motiv', .3, .7]],
    flashes: [['motiv', .12, .35]],
    follow: { from: 'cta+0.3', y: 220 },
    tail: 2.6,

    update(t, K) {
      const id = K.shot.id, Lc = K.shot.local, at = c => K.T(c), e = K.ease;
      const D = K.cast.doug, G = K.cast.gary, Gi = K.cast.garyIn, V = K.cast.victor;
      // runner: placed at painting px, then moves dz per second (negative = away), walk phase rate r
      const run = (n, ix, iy, ry, t0, speed, rate = 1.7, amt = 1) => { const [x, z] = K.floorAt(ix, iy), s = Math.max(0, t - t0);
        const c = K.place(n, x + Math.sin(ry) * speed * s, 0, z + Math.cos(ry) * speed * s, ry); c.pose({ t, walk: s * rate, walkAmt: amt }); return c; };
      const clock = (x, y, w, from) => K.prop('P03', { x, y, w: w * K.pop(K.clamp01((t - from) / .3)), rot: Math.sin(t * 40) * .05 * (t - from < .6 ? 1 : 0) });
      // entry hall: Gary beside the mat, turned toward the shoes
      const garyHall = (ry = -.6) => K.placeAt('garyIn', 760, 1100, ry, .85);   // painted door is small: scale to it
      const S = typeof id === 'number' ? (id === tAnyway ? 'anyway' : id === tPuts ? 'puts' : id === tHeads ? 'heads' : id === tLast ? 'last' : id === tOr ? 'or' : '') : id;
      switch (S) {
        case 'q': { // Doug pumped on the left, Gary trudging out on the right
          const d = K.placeAt('doug', 320, 960, .35); face(d, 'happy', t); d.pose({ t, gesture: 'tada', gw: e(Lc / .3), nod: Math.sin(t * 9) * .06 });
          const g = run('gary', 650, 900, PI + .15, at('q') + .6, 1.1, 1.3, e((Lc - .6) / .4)); face(g, 'flat', t, 1); break; }
        case 'problem': { const d = K.placeAt('doug', 330, 960, .3); face(d, 'smile', t); d.pose({ t, gesture: 'hips', gw: e(Lc / .3), nod: e((Lc - .5) / .2) * .08 }); break; }
        case 'wake': { const d = K.placeAt('doug', 430, 1030, .15); const up = e(Lc / .35);
          face(d, Lc < .25 ? 'blink' : 'happy', t); d.pose({ t, armR: { raise: up }, armL: { raise: up * .3 }, nod: -.1 * up }); break; }
        case 'sunrise': { const v = K.placeAt('victor', 470, 1060, PI); v.pose({ t, gesture: 'tada', gw: e((Lc - .6) / .3), nod: Math.sin(t * 7) * .05 }); face(v, 'happy', t); break; }
        case 'motiv': { const v = K.placeAt('victor', 470, 1060, PI * (1 - e(Lc / .25))); face(v, 'happy', t);
          v.pose({ t, armR: { raise: 1 }, armL: { raise: 1 }, nod: Math.sin(t * 12) * .1 }); break; }
        case 'plan': { const d = K.placeAt('doug', 430, 1030, .15); face(d, 'smirk', t); d.pose({ t, gesture: 'point', gw: e(Lc / .3), nod: Lc > 1.6 ? Math.sin(t * 8) * .05 : 0 }); break; }
        case 'gary': { const g = K.placeAt('gary', 745, 870, -.2); face(g, 'flat', t, 1); g.pose({ t, gesture: 'cross', gw: e(Lc / .3) }); break; }
        case 'shoes': break;   // the plant: just the shoes
        case 'six': { clock(540, 430, 330, at('six'));
          const g = garyHall(); face(g, Lc < .5 ? 'blink' : 'flat', t, 1); g.pose({ t, look: -.35 * e((Lc - .6) / .3), nod: .25 * e((Lc - .6) / .3) }); break; }
        case 'hates': { const g = run('gary', 600, 1000, PI, at('hates'), 1.5, 1.6); face(g, 'worried', t, 1); break; }
        case 'anyway': { const g = run('gary', 540, 1060, PI + .05, at(tAnyway) - .3, 1.4, 1.6); face(g, 'flat', t, 1); break; }
        case 'disc': { const g = run('gary', 520, 1000, PI, at('disc') - 1.2, 1.4, 1.6); face(g, 'flat', t, 1); break; }
        case 'bet': { // Doug jogging toward us, waving; Gary trudging away
          const d = run('doug', 340, 880, .05, at('bet'), 1.6, 1.8); face(d, 'happy', t); d.pose({ t, walk: (t - at('bet')) * 1.8, walkAmt: 1, gesture: 'wave', gw: e(Lc / .3) });
          const g = run('gary', 620, 1000, PI, at('bet'), 1.0, 1.3); face(g, 'flat', t, 1); break; }
        case 'dentist': { const g = run('gary', 560, 950, .15, at('dentist'), .35, .9, .7); face(g, 'flat', t, 1); g.pose({ t, walk: Lc * .9, walkAmt: .7, tilt: .15 * e(Lc / .4), nod: .12 }); break; }
        case 'week': case 'week+0.6': case 'week+1.2': case 'week+1.8': { // montage: Doug running, a different flourish each cut
          const k = ['week', 'week+0.6', 'week+1.2', 'week+1.8'].indexOf(S), ges = ['wave', 'tada', null, 'point'][k];
          const d = run('doug', [330, 590, 470, 420][k], [930, 960, 860, 960][k], [.4, -.4, 0, .2][k], K.shot.t0, 1.4, 1.8);
          face(d, 'happy', t); d.pose({ t, walk: Lc * 1.8, walkAmt: 1, gesture: ges, gw: ges ? 1 : 0, armR: ges ? undefined : { raise: 1 } });
          clock(900, 330, 200, K.shot.t0); break; }
        case 'rain': break;    // Wan clip, no cast
        case 'check': { const d = K.placeAt('doug', 330, 1030, -.25); const hold = Lc > 1.6;
          face(d, hold ? 'flat' : Lc < .2 ? 'blink' : 'worried', t); d.pose({ t, look: -.45 + .35 * e((Lc - 1.6) / .3), gesture: 'think', gw: e((Lc - .3) / .3) * (1 - e((Lc - 1.7) / .3)), lean: .05 }); break; }
        case 'bed': break;     // the blanket lump is Doug
        case 'soaked': { const g = run('gary', 470, 960, PI, at('soaked') - .4, 1.3, 1.6); face(g, 'flat', t, 1); break; }
        case 'wrong': { const g = run('gary', 470, 980, .0, at('wrong'), .9, 1.6); face(g, 'flat', t, 1); break; }
        case 'aside': break;
        case 'loop': { clock(780, 420, 220, at('loop')); break; }     // 6 a.m.: the shoes
        case 'puts': { const g = garyHall(-.4 + .3 * e(Lc / .6)); face(g, 'flat', t, 1); g.pose({ t, look: -.3, nod: .3, lean: .25 * e(Lc / .4) }); break; }
        case 'heads': { const g = run('gary', 760, 900, PI - .5, at(tHeads), 1.2, 1.5, e(Lc / .3)); face(g, 'flat', t, 1); break; }
        case 'enough': case 'enough+1.0': case 'enough+2.0': { // jump cuts, quicker each time: look, go
          const k = ['enough', 'enough+1.0', 'enough+2.0'].indexOf(S), go = [.6, .35, .12][k];
          const turn = e((Lc - go) / .2), g = garyHall(-.6 + turn * (PI + .6 - .3));
          face(g, 'flat', t, 1); g.pose({ t, look: -.3 * (1 - turn), nod: .25 * (1 - turn), walk: Math.max(0, Lc - go) * 1.5, walkAmt: turn });
          clock(860, 330, 170, K.shot.t0); break; }
        case 'habit': break;
        case 'teeth': { const d = K.placeAt('doug', 330, 1030, .35, .9); face(d, 'flat', t); d.pose({ t, armR: { raise: .55 + .06 * Math.sin(t * 22) } });
          const h = K.screenOf(d.arm[1].wr); K.prop('P02', { x: h.x - 20, y: h.y - 10, w: 210, rot: -.6 + .1 * Math.sin(t * 22) }); break; }
        case 'pep': { const d = K.placeAt('doug', 330, 1030, .35 + .4 * e((Lc - .8) / .3), .9); face(d, Lc > 1.0 && Lc < 1.15 ? 'blink' : 'flat', t);
          d.pose({ t, armR: { raise: .55 }, look: .45 * e((Lc - .8) / .3) });
          const h = K.screenOf(d.arm[1].wr); K.prop('P02', { x: h.x - 20, y: h.y - 10, w: 210, rot: -.6 });
          const v = K.placeAt('victor', 770, 1050, -.4); v.root.scale.setScalar(K.pop(K.clamp01(Lc / .3)) || .001);
          face(v, 'happy', t); v.pose({ t, gesture: 'tada', gw: 1, nod: Math.sin(t * 10) * .08 }); break; }
        case 'study': case 'longer': { // the clipboard: the shoes ride the line until it levels off (= automatic)
          const s = K.clamp01((t - at('study')) / 4.2), pop = K.pop(K.clamp01((t - at('study')) / .35));
          const cw = 1000 * pop, cx = 540, cy = 760; K.prop('P04', { x: cx, y: cy, w: cw });
          // curve in card px (1536x1024): x 395->1140, y = smooth s-curve 815 -> 385
          const u = S === 'longer' ? 1 : s, ix = 395 + 745 * u, f = 1 / (1 + Math.exp(-9 * (u * 1.25 - .35))), iy = 815 - 430 * Math.min(1, f * 1.02);
          const k = cw / 1536; K.prop('P01', { x: cx + (ix - 768) * k, y: cy + (iy - 512) * k - 38, w: 170 * pop });
          if (S === 'longer') { const g = K.placeAt('garyIn', 790, 1060, -.4); face(g, 'flat', t, 1); g.pose({ t, gesture: 'shrug', gw: e(Lc / .3) }); }
          break; }
        case 'callback': { const g = garyHall(-.5); const set = e((Lc - .5) / .4); face(g, set > .9 ? 'smirk' : 'flat', t, 1);
          g.pose({ t, lean: .3 * (1 - set) + .05, look: -.35, nod: .2 + .08 * Math.sin(Lc > 1.6 ? t * 6 : 0) }); break; }
        case 'last': break;
        case 'laces': { const g = K.placeAt('gary', 700, 1130, -.7, .85); face(g, 'flat', t, 1);
          g.pose({ t, lean: .5, nod: .45, look: -.2, armR: { raise: .1 + .06 * Math.sin(t * 14), fwd: -.7 }, armL: { raise: .1 + .06 * Math.sin(t * 14 + 1), fwd: -.7 } }); break; }
        case 'end': break;
        case 'zero': break;
        case 'question': { const d = K.placeAt('doug', 330, 980, .3), g = K.placeAt('gary', 620, 980, -.3);
          face(d, 'worried', t); d.pose({ t, gesture: 'think', gw: e(Lc / .3) }); face(g, 'flat', t, 1); g.pose({ t, gesture: 'hips', gw: e(Lc / .3) }); break; }
        case 'choice': { const d = K.placeAt('doug', 330, 1030, -.25); face(d, 'worried', t); d.pose({ t, look: -.3, gesture: 'think', gw: e(Lc / .3) }); break; }
        case 'or': { const g = garyHall(-.6); face(g, 'smile', t, 1); g.pose({ t, lean: .3 * e((Lc - .4) / .4), nod: .25, look: -.35, armR: { raise: .2, fwd: -.5 * e((Lc - .4) / .4) } }); break; }
        case 'cta': { const d = K.placeAt('doug', 330, 990, .3), g = K.placeAt('gary', 620, 990, -.3);
          face(g, 'smirk', t, 1); g.pose({ t, gesture: 'point', gw: e((Lc - .3) / .3) });
          face(d, Lc > 2 ? 'smile' : 'flat', t); d.pose({ t, gesture: 'shrug', gw: e((Lc - 1.6) / .3) }); break; }
      }
    },
  };
})();
