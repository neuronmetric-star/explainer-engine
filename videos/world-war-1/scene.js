// world-war-1: Why is it called World War 1? Plates (moving: OpenArt Wan 3.0 clips) + props + Doug, Gary (as Repington).
// Plan: shotlist.md. World units: feet at y=0, camera at (0, camH, 0) looking down -z. Props + text in screen px (y down).
// Every word or number on screen is K.text (the paintings carry no text, except the Wells book cover P01).
(function () {
  const PI = Math.PI;
  const face = (ch, name, t, off = 0) => ch.face(((t + off) % 4.1) < .12 && name !== 'happy' ? 'blink' : name);
  const popIn = (K, t, from, dur = .35) => K.pop(K.clamp01((t - from) / dur));
  const WORDS = window.VIDEO_DATA.words, norm = w => w.toLowerCase().replace(/[^a-z0-9]/g, '');
  const wordAt = (K, w, cue) => { const t0 = K.T(cue); const x = WORDS.find(o => o.start >= t0 - .01 && norm(o.w) === w); return x ? x.start : t0; };
  const CLIPS = window.CLIPS || {}, clip = n => (CLIPS[n] ? n : undefined);   // moving painting if tools/clips.js made it

  const L = {
    trench: { key: [0xdfe4f0, 1.7, [-10, 9, -2]], hemi: [0xb8c4e0, 0x6a5040, .95], front: [0xe8e4f0, 1.0], shadow: [0x2a2a40, .32] },
    night: { key: [0xffb060, 2.0, [-8, 5, 2]], hemi: [0x5a68c8, 0x3a2830, .85], front: [0xffc8a0, .85], shadow: [0x10102a, .5] },
    golden: { key: [0xffb070, 2.6, [-12, 4, -4]], hemi: [0xc0b0ff, 0x8a7040, .75], front: [0xffe0c8, 1.0], shadow: [0x4a2a5a, .42] },
  };
  // map pins (painting px on 02_world_map_wall.png)
  const RED = [[480, 690], [462, 658], [490, 670], [515, 706]];                 // Sarajevo first, then Germany, Austria-Hungary, Ottoman side
  const BLUE = [[430, 676], [420, 646], [545, 630], [458, 697]];                 // France, Britain, Russia, Italy
  const WORLD = [[205, 700], [270, 905], [490, 860], [700, 720], [800, 690], [800, 945], [650, 770], [560, 900]];

  window.SCENE = {
    plates: {
      '01': { img: '01_town_street_1914.png', clip: clip('01_town_street_1914'), hz: .53, vx: .5, fov0: 55, camH: 1.6, light: 'day' },
      '02': { img: '02_world_map_wall.png', clip: clip('02_world_map_wall'), hz: .5, vx: .5, fov0: 55, camH: 1.6, light: 'interior' },
      '03': { img: '03_trench_day.png', clip: clip('03_trench_day'), hz: .44, vx: .62, fov0: 55, camH: 1.55, light: L.trench },
      '04': { img: '04_reporter_office_night.png', clip: clip('04_reporter_office_night'), hz: .47, vx: .5, fov0: 55, camH: 1.6, light: L.night },
      '05': { img: '05_diary_closeup.png', clip: clip('05_diary_closeup'), hz: .5, vx: .5, fov0: 55, camH: 1.6, light: L.night },
      '06': { img: '06_newsstand_1939.png', clip: clip('06_newsstand_1939'), hz: .5, vx: .5, fov0: 55, camH: 1.6, light: 'day' },
      '07': { img: '07_hilltop_poppies.png', clip: clip('07_hilltop_poppies'), hz: .455, vx: .5, fov0: 55, camH: 1.55, light: L.golden },
    },
    props: { P01: 'P01_wells_book.png', P02: 'P02_pin_red.png', P03: 'P03_pin_blue.png', P04: 'P04_tiny_tree.png',
      P05: 'P05_magazine_open.png', P06: 'P06_calendar_page.png', H01: 'H01_helicopter.png' },
    cast: { doug: 'hoodie', gary: 'oxford' },
    shots: [
      { at: 'q', plate: '03', zoom: [1.0, 1.1], focus: [[.5, .55], [.5, .58]] },
      { at: 'card', plate: '01', zoom: [1.0, 1.06], focus: [[.5, .55], [.5, .57]] },
      { at: 'sign', plate: '01', zoom: [1.15, 1.28], focus: [[.38, .6], [.36, .62]] },
      { at: 'ground', plate: '02', zoom: [2.3, 2.5], focus: [[.505, .405], [.508, .41]] },
      { at: 'sides', plate: '02', zoom: [2.4, 2.1], focus: [[.508, .4], [.51, .4]] },
      { at: 'christmas', plate: '01', zoom: [1.3, 1.36], focus: [[.5, .66], [.5, .66]] },
      { at: 'bet', plate: '01', zoom: [1.45, 1.6], focus: [[.5, .67], [.5, .68]] },
      { at: 'trench', plate: '03', zoom: [1.12, 1.22], focus: [[.5, .68], [.5, .7]] },
      { at: 'years', plate: '03', zoom: [1.0, 1.06], focus: [[.5, .58], [.5, .6]] },
      { at: 'world', plate: '02', zoom: [1.6, 1.0], focus: [[.5, .45], [.5, .47]] },
      { at: 'great', plate: '03', zoom: [1.06, 1.14], focus: [[.5, .62], [.5, .64]] },
      { at: 'wells', plate: '02', zoom: [1.1, 1.18], focus: [[.5, .45], [.5, .45]] },
      { at: 'endwar', plate: '02', zoom: [1.18, 1.22], focus: [[.5, .45], [.5, .45]] },
      { at: 'rep', plate: '04', zoom: [1.0, 1.08], focus: [[.5, .6], [.5, .62]] },
      { at: 'diary', plate: '04', zoom: [1.2, 1.32], focus: [[.5, .55], [.5, .52]] },
      { at: 'first', plate: '05', zoom: [1.0, 1.08], focus: [[.5, .5], [.62, .5]] },
      { at: 'wait', plate: '04', zoom: [1.25, 1.3], focus: [[.55, .6], [.55, .6]] },
      { at: 'why', plate: '05', zoom: [1.15, 1.35], focus: [[.65, .48], [.7, .47]] },
      { at: 'rude', plate: '04', zoom: [1.18, 1.24], focus: [[.55, .6], [.55, .6]] },
      { at: 'ends', plate: '01', zoom: [1.1, 1.14], focus: [[.5, .6], [.5, .6]] },
      { at: 'home', plate: '01', zoom: [1.14, 1.0], focus: [[.5, .6], [.5, .55]] },
      { at: '1939', plate: '06', zoom: [1.0, 1.08], focus: [[.4, .55], [.38, .56]] },
      { at: 'number', plate: '06', zoom: [1.25, 1.3], focus: [[.3, .5], [.3, .5]] },
      { at: 'ww2', plate: '06', zoom: [1.0, 1.04], focus: [[.5, .5], [.5, .5]] },
      { at: 'end', plate: '07', zoom: [1.0, 1.06], focus: [[.5, .55], [.5, .55]] },
      { at: 'heli', plate: '07', zoom: [1.06, 1.06], focus: [[.5, .55], [.5, .55]] },
      { at: 'cta', plate: '07', zoom: [1.06, 1.06], focus: [[.5, .55], [.5, .55]] },
    ],
    shakes: [['ground+0.9', .3, .6], ['ww2+0.1', .45, .7]],
    flashes: [['ground+0.9', .18, .8], ['ww2+0.1', .2, .7]],
    follow: { from: 'cta+0.3' },
    tail: 1.6,

    update(t, K) {
      const id = K.shot.id, Lc = K.shot.local, at = c => K.T(c);
      const D = K.cast.doug, G = K.cast.gary;
      const pin = (k, ix, iy, from, w = 110) => { const p = K.img(ix, iy); K.prop(k, { x: p.x, y: p.y - 40 * (1 - K.clamp01((t - from) / .2)), w: w * popIn(K, t, from, .3), anchor: [.28, .92] }); };
      const snow = (n, a = .85) => { for (let i = 0; i < n; i++) { const x = (i * 137.5 + Math.sin(t * .8 + i) * 30) % 1080, y = ((t * 70 + i * 97) % 2000) - 40;
        K.prop('puff', { x, y, w: 10 + (i % 3) * 5, a }); } };
      const trenchDoug = () => K.placeAt('doug', 480, 1230, 0);
      const garyDesk = () => K.placeAt('gary', 470, 1330, 0);
      switch (id) {
        case 'q': { trenchDoug(); face(D, 'worried', t); D.pose({ t, nod: -.25, look: .1 });
          const a = K.clamp01((at('card') - t) / .2);
          K.text('WHY IS IT CALLED', { y: 290, size: 96, a, scale: .8 + .2 * popIn(K, t, at('q')) });
          K.text('WORLD WAR 1?', { y: 410, size: 128, color: 'gold', a, scale: .8 + .2 * popIn(K, t, at('q') + .5) }); break; }
        case 'card': { const u = K.clamp01(Lc / 1.5), [x0, z0] = K.floorAt(180, 1250), [x1, z1] = K.floorAt(450, 1200);
          K.place('doug', K.lerp(x0, x1, u), 0, K.lerp(z0, z1, u), u < 1 ? PI / 2 - .25 : 0); face(D, 'smile', t);
          D.pose({ t, walk: Lc * 1.4, walkAmt: 1 - u });
          K.text('1914', { y: 250, size: 110, color: 'gold', scale: popIn(K, t, at('card') + .2) }); break; }
        case 'sign': { K.placeAt('doug', 450, 1200, .2); face(D, 'happy', t); D.pose({ t, gesture: 'tada', gw: K.ease(Lc / .35) });
          K.text('1914', { y: 250, size: 110, color: 'gold' }); break; }
        case 'ground': { pin('P02', ...RED[0], wordAt(K, 'shot', 'ground'), 300);
          K.text("AUSTRIA'S FUTURE EMPEROR", { y: 260, size: 58, scale: popIn(K, t, at('ground') + .1) }); break; }
        case 'sides': { pin('P02', ...RED[0], -9, 260);
          for (let i = 1; i < 4; i++) pin('P02', ...RED[i], at('sides') + .25 * i, 240);
          for (let i = 0; i < 4; i++) pin('P03', ...BLUE[i], at('sides') + .9 + .25 * i, 240); break; }
        case 'christmas': case 'bet': { K.placeAt('doug', 470, 1200, 0); face(D, 'smile', t);
          D.pose({ t, gesture: id === 'christmas' ? 'hips' : 'cross', gw: K.ease(Lc / .35), nod: .1 * Math.sin(K.clamp01(Lc / .6) * PI) });
          if (id === 'christmas') K.text('OVER BY CHRISTMAS?', { y: 260, size: 76, color: 'gold', scale: popIn(K, t, wordAt(K, 'christmas', 'christmas')) }); break; }
        case 'trench': { const d = K.placeAt('doug', 440, 1250, .15), f = K.screenOf(d.root);
          K.prop('P04', { x: f.x + 230, y: f.y + 5, w: 440 * popIn(K, t, at('trench') + .3), anchor: [.5, .95] }); snow(60);
          const lk = K.clamp01((Lc - .4) / .4); face(D, Lc < 1.4 ? 'flat' : 'worried', t); D.pose({ t, look: -.45 * lk, nod: .2 * lk }); break; }
        case 'years': { trenchDoug(); face(D, 'worried', t); D.pose({ t, gesture: 'facepalm', gw: K.ease((t - wordAt(K, 'four', 'years')) / .35) });
          const n = Math.min(4, 1 + Math.floor(Lc / .42)), flip = (Lc % .42) / .42;
          K.prop('P06', { x: 220, y: 330, w: 340 * popIn(K, t, at('years')), rot: -.04 + (flip < .15 ? .05 : 0) });
          K.text(String(1914 + n), { x: 220, y: 345, size: 92, color: 'red', scale: 1 + .15 * Math.max(0, 1 - flip / .15) }); break; }
        case 'world': { RED.forEach(([x, y]) => pin('P02', x, y, -9, 150)); BLUE.forEach(([x, y]) => pin('P03', x, y, -9, 150));
          WORLD.forEach(([x, y], i) => pin(i % 2 ? 'P02' : 'P03', x, y, at('world') + .5 + .14 * i, 170)); break; }
        case 'great': { K.placeAt('doug', 480, 1230, 0); face(D, 'flat', t);
          D.pose({ t, gesture: 'shrug', gw: K.ease((t - wordAt(K, 'not', 'great')) / .3) });
          K.text('THE GREAT WAR', { y: 270, size: 104, color: 'gold', scale: popIn(K, t, wordAt(K, 'great', 'great')) });
          const tg = wordAt(K, 'great', 'great+0.6'), tn = wordAt(K, 'not', 'great');
          if (t > tg + .3) K.text(t < tn ? 'great = huge' : 'great ≠ fun', { y: 390, size: 76, scale: popIn(K, t, t < tn ? tg + .3 : tn) }); break; }
        case 'wells': case 'endwar': { const s = id === 'wells' ? popIn(K, t, at('wells') + .5) : 1;
          K.prop('P01', { x: 540, y: 760, w: 560 * s * (id === 'endwar' ? 1 + .04 * K.ease(Lc / 1.5) : 1), rot: -.03 });
          if (id === 'wells') K.text('H. G. WELLS, 1914', { y: 250, size: 64, scale: popIn(K, t, at('wells') + .2) });
          else K.text('"…WILL END WAR"', { y: 250, size: 70, color: 'gold', scale: popIn(K, t, at('endwar')) }); break; }
        case 'rep': { const u = K.clamp01(Lc / 1.6), [x0, z0] = K.floorAt(880, 1300), [x1, z1] = K.floorAt(560, 1250);
          K.place('gary', K.lerp(x0, x1, u), 0, K.lerp(z0, z1, u), u < 1 ? -PI / 2 + .2 : -.15); face(G, u < 1 ? 'flat' : 'smirk', t, 1);
          G.pose({ t, walk: Lc * 1.4, walkAmt: 1 - u, gesture: u >= 1 ? 'cross' : undefined, gw: K.ease((Lc - 1.6) / .35) });
          K.text('CHARLES REPINGTON', { y: 250, size: 66, scale: popIn(K, t, wordAt(K, 'charles', 'rep')) });
          if (t > wordAt(K, 'charles', 'rep')) K.text('war reporter', { y: 340, size: 54, color: 'gold' }); break; }
        case 'diary': { K.placeAt('gary', 560, 1250, -.15); face(G, Lc < 1.2 ? 'smirk' : 'flat', t, 1);
          G.pose({ t, gesture: Lc < 1.2 ? 'think' : undefined, gw: K.ease(Lc / .35) * (1 - K.ease((Lc - 1.1) / .3)), look: Lc > 1.2 ? .35 : 0, nod: Lc > 1.2 ? .35 : 0 });
          K.text('1918', { y: 250, size: 110, color: 'gold', scale: popIn(K, t, at('diary') + .2) }); break; }
        case 'first': case 'why': {   // the diary page: Repington's words, in ink
          const p = K.img(700, 800), s = K.imgScale() / 1.1;
          const words = [['The', 0], ['First', .3], ['World War.', .65]];
          words.forEach(([w, d], i) => { const tw = at('first') + d; if (t < tw) return;
            K.text(w, { x: p.x, y: p.y + (i - 1) * 125 * s, size: 96 * s, w: 700, font: 'marker', color: w === 'First' ? '#8b1a1a' : '#1c2a4a', a: K.clamp01((t - tw) / .2), rot: -.04 }); });
          if (id === 'why') for (let k = 0; k < 2; k++) { const tu = at('why') + .3 + .35 * k;
            if (t > tu) K.text('━━━', { x: p.x, y: p.y + (45 + 20 * k) * s, size: 80 * s, font: 'marker', color: '#8b1a1a', rot: -.04, scale: K.easeOut((t - tu) / .25) }); }
          if (id === 'why') K.text('a warning:', { y: 250, size: 64, scale: popIn(K, t, wordAt(K, 'warning', 'why')) });
          if (id === 'why' && t > wordAt(K, 'wars', 'why')) K.text('WARS KEEP COMING', { y: 345, size: 76, color: 'red', scale: popIn(K, t, wordAt(K, 'wars', 'why')) });
          break; }
        case 'wait': case 'rude': { K.placeAt('gary', 560, 1250, -.15);
          if (id === 'wait') { face(G, 'smirk', t, 1); G.pose({ t, look: -.15, gesture: 'shrug', gw: K.ease((Lc - .3) / .3) }); }
          else { face(G, 'smirk', t, 1); G.pose({ t, gesture: 'cross', gw: K.ease(Lc / .3), nod: .18 * Math.sin(K.clamp01((t - wordAt(K, 'correct', 'rude')) / .5) * PI) }); }
          if (id === 'wait') K.text('FIRST?', { y: 270, size: 120, color: 'gold', scale: popIn(K, t, at('wait')) }); break; }
        case 'ends': case 'home': {
          if (id === 'ends') { const u = K.clamp01(Lc / 1.4), [x0, z0] = K.floorAt(800, 1260), [x1, z1] = K.floorAt(500, 1200);
            K.place('doug', K.lerp(x0, x1, u), 0, K.lerp(z0, z1, u), u < 1 ? -PI / 2 + .25 : 0); face(D, 'happy', t); D.pose({ t, walk: Lc * 1.4, walkAmt: 1 - u, armR: { raise: .9 * u } });
            K.text('NOV 11, 1918', { y: 250, size: 90, color: 'gold', scale: popIn(K, t, at('ends') + .1) }); }
          else { const u = K.clamp01(Lc / 1.1), [x0, z0] = K.floorAt(500, 1200), [x1, z1] = K.floorAt(470, 1000);
            K.place('doug', K.lerp(x0, x1, u), 0, K.lerp(z0, z1, u), PI); face(D, 'happy', t); D.pose({ t, walk: Lc * 1.4, walkAmt: 1, gesture: 'wave', gw: .8 }); }
          const C = ['#ff4a3d', '#ffd23a', '#3a8bff', '#fff', '#3ad07a'];   // confetti
          for (let i = 0; i < 40; i++) { const x = (i * 211.3) % 1080 + Math.sin(t * 2 + i) * 25, y = ((t - at('ends')) * (180 + i % 5 * 40) + i * 53) % 1900 - 60;
            K.text('■', { x, y, size: 22 + i % 3 * 8, color: C[i % 5], stroke: 0, shadow: false, rot: t * 3 + i }); }
          break; }
        case '1939': { K.text('1939', { y: 250, size: 110, color: 'gold', scale: popIn(K, t, at('1939') + .1) });
          K.text('TIME MAGAZINE', { y: 360, size: 60, scale: popIn(K, t, wordAt(K, 'time', '1939')) });
          K.prop('P05', { x: 540, y: 900, w: 960 * popIn(K, t, wordAt(K, 'magazine', '1939')), rot: .03 }); break; }
        case 'number': { const w = 1500, x = 540 - (1100 - 768) / 1536 * w, y = 760 - (185 - 512) / 1024 * w * 1024 / 1536;   // headline strip centered near y 760
          K.prop('P05', { x, y, w });
          const tw = wordAt(K, 'world', 'number');
          if (t > tw) K.text('WORLD WAR I', { x: 540, y: 760, size: 96, color: '#1c2a4a', stroke: 0, shadow: false, scale: 1 + .12 * Math.max(0, 1 - (t - tw) / .3) });
          if (t > tw) K.text('JUNE 1939', { y: 300, size: 76, color: 'gold', scale: popIn(K, t, tw) }); break; }
        case 'ww2': { K.text('SEPT 1939', { y: 250, size: 80, scale: popIn(K, t, at('ww2') + .1) });
          K.text('WORLD WAR II', { y: 370, size: 112, color: 'red', scale: popIn(K, t, wordAt(K, 'world', 'ww2')) }); break; }
        case 'end': case 'heli': case 'cta': {
          K.placeAt('doug', 330, 1200, .3); K.placeAt('gary', 620, 1190, -.3);
          // THE HELICOPTER ENDING (PLAYBOOK §1.12a): crosses on "Turns out it was just the first"; Gary (Repington, who was right) looks up
          const hu = K.helicopter(t, 'heli', { y: 300, w: 520 }), up = hu < 0 ? 0 : Math.sin(PI * K.clamp01((hu - .05) / .85));
          face(D, 'worried', t); D.pose({ t, look: -.45 * (1 - up), nod: -.2 * up, gesture: id === 'cta' ? 'shrug' : undefined, gw: K.ease(Lc / .4) });
          face(G, up > .4 ? 'flat' : 'smirk', t, 1); G.pose({ t, nod: -.38 * up, gesture: id === 'cta' ? 'point' : 'cross', gw: K.ease((Lc - .2) / .35) * (1 - up * .7) });
          if (id === 'end') K.text('"THE WAR THAT WILL END WAR"', { y: 300, size: 54, scale: popIn(K, t, at('end')) });
          break; }
      }
    },
  };
})();
