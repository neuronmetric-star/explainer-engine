// printer-how-it-works · one-off: "How does your printer work?"
// Follow one photo from "print" to paper. Viewer-first narration ("you"); Doug acts it out silently. No shouted opener (test, Nov 24 2026).
// Tools (PLAYBOOK §8): crash-zoom hook on the dot photo, K.hookReact + K.slam, K.flow (ink = light blue, push = white), SCENE.whip.
(function () {
  const PI = Math.PI;
  const face = (ch, name, t, off = 0) => ch.face(((t + off) % 4.1) < .12 && !['happy', 'scream', 'blink'].includes(name) ? 'blink' : name);
  const popIn = (K, t, from, dur = .35) => K.pop(K.clamp01((t - from) / dur));
  const ENDING = 'E01_city_sunset_ending.png';   // the signature goodbye (docs/assets)
  const INK = '#7fd4ff';   // light blue = ink (color code)
  const L = {
    desk: { key: [0xffc888, 2.0, [-10, 6, 4]], hemi: [0xc8c0ff, 0x8a6a58, .85], front: [0xffe6d6, 1.0], shadow: [0x3a2a4a, .38] },
    sunset: { key: [0xffb070, 2.6, [-12, 3, 2]], hemi: [0xffc8b0, 0x8a6a80, .8], front: [0xffe8dc, 1.0], shadow: [0x4a2a5a, .42] },
  };
  // image px
  const LAPTOP = [285, 560], PRINTER = [790, 560], TRAY = [830, 440], HEAD = [512, 690], RAIL = [190, 835];
  const HEATER = [512, 770], NOZZLE = [512, 935], PAPER_Y = 1352, NEEDLE = [655, 628];

  window.SCENE = {
    banner: 'THE HECK?',
    whip: true,
    plates: {
      B01: { img: 'B01_home_desk_printer.png', hz: .42, vx: .5, fov0: 55, camH: 1.6, light: L.desk },
      B02: { img: 'B02_printer_cutaway.png', hz: .5, vx: .5, fov0: 55, camH: 1.6, light: 'interior' },
      B03: { img: 'B03_nozzle_macro.png', hz: .5, vx: .5, fov0: 55, camH: 1.6, light: 'interior' },
      B04: { img: 'B04_lab_1977.png', hz: .45, vx: .5, fov0: 55, camH: 1.6, light: 'interior' },
      B05: { img: 'B05_photo_dots_closeup.png', hz: .5, vx: .5, fov0: 55, camH: 1.6, light: 'interior' },
      E: { img: ENDING, hz: .45, vx: .5, fov0: 55, camH: 2.0, light: L.sunset },
    },
    props: { DOG: 'P01_dog_photo.png', STRIPED: 'P02_dog_photo_striped.png', KETCHUP: 'P03_ketchup_cap_crusty.png', KETTLE: 'P04_kettle_spitting.png', H01: 'H01_helicopter.png' },
    cast: { doug: 'hoodie', gary: 'oxford' },
    shots: [
      { at: 'q', plate: 'B05', zoom: [5.0, 1.0], focus: [[.41, .17], [.5, .5]] },          // THE HOOK: only dots → crash-zoom out → it's a dog
      { at: 'boils', plate: 'B01', zoom: [1.3, 1.25], focus: [[.4, .52], [.4, .52]] },      // Doug reacts big
      { at: 'look', plate: 'B05', zoom: [1.0, 3.2], focus: [[.5, .5], [.78, .72]] },       // push into the magnifier: dots
      { at: 'print', plate: 'B01', zoom: [1.3, 1.4], focus: [[.45, .55], [.5, .52]] },
      { at: 'rollers', plate: 'B01', zoom: [1.4, 2.3], focus: [[.53, .52], [.79, .33]] },
      { at: 'head', plate: 'B02', zoom: [1.0, 1.3], focus: [[.5, .5], [.5, .46]] },
      { at: 'holes', plate: 'B02', zoom: [1.3, 2.4], focus: [[.5, .46], [.5, .46]] },
      { at: 'zap', plate: 'B03', zoom: [1.0, 1.15], focus: [[.5, .45], [.5, .5]] },
      { at: 'kettle', plate: 'B03', zoom: [1.15, 1.05], focus: [[.5, .5], [.5, .52]] },
      { at: 'again', plate: 'B03', zoom: [1.05, 1.2], focus: [[.5, .52], [.5, .5]] },
      { at: 'inks', plate: 'B05', zoom: [2.6, 1.0], focus: [[.4, .3], [.5, .5]] },
      { at: 'eyes', plate: 'B05', zoom: [1.0, 1.08], focus: [[.5, .5], [.5, .48]] },
      { at: 'row', plate: 'B02', zoom: [1.0, 1.05], focus: [[.5, .5], [.5, .5]] },
      { at: 'real', plate: 'B04', zoom: [1.0, 1.2], focus: [[.5, .5], [.6, .42]] },
      { at: 'catch', plate: 'B01', zoom: [1.3, 1.5], focus: [[.5, .55], [.55, .5]] },
      { at: 'stripes', plate: 'B01', zoom: [1.5, 1.45], focus: [[.55, .5], [.55, .52]] },
      { at: 'mirror', plate: 'B03', zoom: [1.1, 1.25], focus: [[.5, .5], [.5, .48]] },
      { at: 'question', plate: 'E', zoom: [1.04, 1.1], focus: [[.5, .53], [.5, .5]] },
      { at: 'cta', plate: 'E', zoom: [1.1, 1.1], focus: [[.5, .5], [.5, .48]] },
    ],
    shakes: [['boils+0.28', .45, .7], ['zap', .2, .3], ['stripes', .25, .3]],
    flashes: [['boils+0.28', .16, .5], ['zap', .1, .35]],
    tail: 1.0,

    update(t, K) {
      const id = K.shot.id.split('+')[0], Lc = K.shot.local, at = c => K.T(c), s = () => K.imgScale();
      const D = K.cast.doug, G = K.cast.gary;
      const sway = (k = 1) => ({ look: .06 * k * Math.sin(t * .7), tilt: .04 * k * Math.sin(t * .9 + 1) });
      const ring = (x, y, r, color, w = 8, a = 1, ry = r) => { const N = 40; let prev = null;
        for (let k = 0; k <= N; k++) { const g = k / N * 2 * PI, q = { x: x + Math.cos(g) * r, y: y + Math.sin(g) * ry }; if (prev) K.line(prev.x, prev.y, q.x, q.y, { color, width: w, a }); prev = q; } };
      const disc = (x, y, d, color, a = 1) => K.text('●', { x, y: y + d * .06, size: d * 1.3, color, stroke: 0, shadow: false, a });
      const dougAtDesk = () => K.placeAt('doug', 360, 1190, .3);
      // the bubble cycle in one nozzle (B03): heater glows → bubble grows → a drop flies to the paper; period p seconds
      const fire = (t0, p = 1.2) => { const u = ((t - t0) % p) / p, h = K.img(...HEATER), n = K.img(...NOZZLE), py = K.img(0, PAPER_Y).y;
        const glow = u < .45 ? Math.sin(u / .45 * PI) : 0;
        K.line(K.img(368, 0).x, h.y + 6 * s(), K.img(658, 0).x, h.y + 6 * s(), { color: '#ffb020', width: 26 * s(), a: glow }); disc(h.x, h.y + 6 * s(), 300 * s(), 'rgba(255,90,40,.35)', glow);
        if (u > .08 && u < .6) { const b = Math.sin((u - .08) / .52 * PI); disc(h.x, h.y - 120 * s() * b, 420 * s() * b, 'rgba(255,255,255,.9)'); }
        if (u > .3) { const v = K.easeIn ? K.easeIn(K.clamp01((u - .3) / .45)) : K.clamp01((u - .3) / .45) ** 2; disc(n.x, K.lerp(n.y + 20 * s(), py - 30 * s(), v), 110 * s(), '#2f7dff', u < .8 ? 1 : 0); }
        return u; };

      switch (id) {
        case 'q': {   // THE HOOK: the dots, crash-zoom out → a photo of a dog
          const a = K.clamp01((at('boils') + .1 - t) / .25);
          K.text('HOW DOES YOUR', { y: 290, size: 70, a, scale: .8 + .2 * popIn(K, t, .5) });
          K.text('PRINTER WORK?', { y: 385, size: 104, color: 'gold', a, scale: .8 + .2 * popIn(K, t, .75) });
          break; }
        case 'boils': {   // "It boils ink." Doug jumps back from his printer
          dougAtDesk(); K.hookReact(D, t, 'boils');
          K.slam('IT BOILS INK', t, 'boils+0.25', { y: 320, size: 110, color: 'red' });
          break; }
        case 'look': case 'inks': case 'eyes': {   // the photo is dots; four inks; your eyes blend them
          if (id === 'look' && t > at('only')) K.text('DOTS', { y: 300, size: 130, color: 'gold', scale: popIn(K, t, at('only')) });
          if (id === 'inks' || id === 'eyes') { const cols = ['#33b9f0', '#ff3fa4', '#ffd23a', '#222'];
            cols.forEach((c, i) => { const k = popIn(K, t, at('inks') + .5 + i * .45); disc(540 + (i - 1.5) * 150, 430, 110 * k, c); });
            if (id === 'eyes') K.text('YOUR EYES MIX THEM', { y: 290, size: 72, color: 'gold', scale: popIn(K, t, at('eyes')) }); }
          break; }
        case 'print': case 'rollers': {   // you hit print: the photo becomes a map of dots, flowing from the laptop to the printer
          dougAtDesk(); face(D, 'happy', t);
          D.pose(Object.assign({ t, gesture: 'point', gw: K.ease((t - at('print')) / .4), look: -.35 }, sway(.4)));
          const l = K.img(...LAPTOP), p = K.img(...PRINTER);
          if (t > at('map') && id === 'print') for (let i = 0; i < 3; i++) K.flow(t, l.x + 60, l.y - 40 + i * 30, p.x - 140, p.y - 40 + i * 30, { color: INK, width: 10, ph: i * .3, a: K.clamp01((t - at('map')) / .4) });
          if (t > at('map') && t < at('rollers')) K.text('A MAP OF DOTS', { y: 300, size: 80, color: 'gold', scale: popIn(K, t, at('map') + .2) });
          if (id === 'rollers') { const tr = K.img(...TRAY); for (let i = 0; i < 3; i++) K.flow(t, tr.x - 80 + i * 80, tr.y - 120, tr.x - 80 + i * 80, tr.y + 60, { width: 12, ph: i * .25 }); }
          break; }
        case 'head': case 'holes': {   // inside: the box slides on its belt; hundreds of holes; a heater behind each
          const h = K.img(...HEAD), r0 = K.img(RAIL[0], HEAD[1]), r1 = K.img(RAIL[1], HEAD[1]);
          const sx = Math.sin(t * 2.2);
          if (id === 'head') { K.flow(t, h.x + 90 * s(), h.y + 30 * s(), r1.x - 30, h.y + 30 * s(), { width: 12, a: Math.max(0, sx) });
            K.flow(t, h.x - 90 * s(), h.y + 30 * s(), r0.x + 30, h.y + 30 * s(), { width: 12, a: Math.max(0, -sx) });
            K.text('THE PRINT HEAD', { y: 300, size: 80, color: 'gold', scale: popIn(K, t, at('head') + .3) }); }
          else { const b = K.img(512, 822); ring(b.x, b.y, 120 * s(), 'gold', 10, 1, 60 * s());
            for (let i = 0; i < 9; i++) disc(b.x + (i - 4) * 22 * s(), b.y, 9 * s(), '#111');
            K.text(t < at('heater') ? 'HOLES THINNER THAN A HAIR' : 'A TINY HEATER IN EACH', { y: 300, size: 64, color: 'gold', scale: popIn(K, t, t < at('heater') ? at('holes') : at('heater')) }); }
          break; }
        case 'zap': case 'kettle': case 'again': case 'mirror': {   // one nozzle: zap → boil → bubble → drop (faster and faster on "thousands")
          const per = id === 'again' ? K.lerp(1.0, .12, K.clamp01((t - at('again')) / 1.5)) : 1.25;
          fire(id === 'again' ? at('again') : at('zap'), per);
          if (id === 'zap') { if (t < at('boil') + .2) K.text('ZAP!', { y: 300, size: 140, color: 'red', scale: popIn(K, t, at('zap')), rot: -.06 });
            else if (t < at('bubble')) K.text('IT BOILS', { y: 300, size: 110, color: 'red', scale: popIn(K, t, at('boil')) });
            else K.text('BUBBLE → DROP', { y: 300, size: 90, color: 'gold', scale: popIn(K, t, at('bubble')) }); }
          if (id === 'kettle') { const k = popIn(K, t, at('kettle')); K.prop('KETTLE', { x: 250, y: 1230, w: 440 * k, rot: -.08 });
            if (t > at('refill')) { const f = K.img(130, 290), c = K.img(330, 300); K.flow(t, f.x, f.y, c.x, c.y, { color: INK, width: 12 }); K.text('REFILL', { y: 300, size: 90, color: 'gold', scale: popIn(K, t, at('refill')) }); } }
          if (id === 'again') K.text('THOUSANDS A SECOND', { y: 300, size: 76, color: 'gold', scale: popIn(K, t, at('again') + .2) });
          if (id === 'mirror') K.text('A TINY, ANGRY KETTLE', { y: 300, size: 80, color: 'gold', scale: popIn(K, t, at('mirror') + .3) });
          break; }
        case 'row': {   // row after row until your photo appears (the head bar sweeps; the paper moves up a hair)
          const W = 640, x = 540, y0 = 560, ph = W * 1536 / 1024, rows = 9, u = K.clamp01((t - at('row')) / (at('real') - at('row') - .6));
          K.prop('DOG', { x, y: y0 + ph / 2 - 80, w: W });
          const done = Math.floor(u * rows), within = (u * rows) % 1, yTop = y0 - 80 + ph * .1, rowH = ph * .8 / rows;
          const cover = yTop + (done + (within > .5 ? 1 : 0)) * rowH;   // white paper below the printed rows
          for (let yy = cover; yy < yTop + ph * .82; yy += 14) K.line(x - W * .42, yy, x + W * .42, yy, { color: '#f3f3f5', width: 16 });
          const hx = x + Math.sin(within * PI * 2 - PI / 2) * W * .36;   // the head sweeping across the current row
          if (u < 1) { K.line(hx - 70, cover - 4, hx + 70, cover - 4, { color: '#d9d9de', width: 46 }); for (let i = 0; i < 4; i++) disc(hx - 45 + i * 30, cover - 4, 18, ['#33b9f0', '#ff3fa4', '#ffd23a', '#222'][i]); }
          K.text(u < 1 ? 'ROW AFTER ROW' : 'YOUR PHOTO', { y: 300, size: 90, color: 'gold', scale: popIn(K, t, u < 1 ? at('row') : at('dog') + 1) });
          break; }
        case 'real': {   // 1977, Canon: a hot soldering iron touches a syringe of ink. The ink shoots out.
          if (t < at('shot')) K.text('1977', { y: 300, size: 130, scale: popIn(K, t, at('real') + .3) });
          if (t > at('shot')) { const n = K.img(...NEEDLE); for (let i = 0; i < 3; i++) K.flow(t, n.x, n.y, n.x + 260 * s() + i * 30, n.y - 70 * s() - i * 40, { color: INK, width: 11, ph: i * .3, speed: 1.6 });
            K.text(t < at('idea') ? 'THE INK SHOT OUT' : "THAT'S YOUR PRINTER", { y: 300, size: 80, color: 'gold', scale: popIn(K, t, t < at('idea') ? at('shot') : at('idea')) }); }
          break; }
        case 'catch': case 'stripes': {   // leave it for months: the ink dries in the holes (ketchup cap) → stripes
          dougAtDesk();
          if (id === 'catch') { face(D, 'worried', t); D.pose(Object.assign({ t, gesture: 'think', gw: 1, look: -.35 }, sway(.4)));
            K.text('MONTHS LATER…', { y: 300, size: 80, scale: popIn(K, t, at('catch') + .2) });
            if (t > at('ketchup')) K.prop('KETCHUP', { x: 820, y: 1020, w: 440 * popIn(K, t, at('ketchup')), rot: .12 }); }
          else { face(D, 'surprised', t); D.pose(Object.assign({ t, gesture: 'facepalm', gw: K.ease(Lc / .4) }, sway(.3)));
            K.prop('STRIPED', { x: 780, y: 860 + 30 * (1 - popIn(K, t, at('stripes'))), w: 480, rot: .05 });
            K.text('STRIPES', { y: 300, size: 120, color: 'red', scale: popIn(K, t, at('stripes')) }); }
          break; }
        case 'question': case 'cta': {   // THE SIGNATURE GOODBYE: city sunset, the helicopter crosses, Doug looks up
          K.placeAt('doug', 360, 1270, .3); K.placeAt('gary', 680, 1240, -.3);
          const hu = t < at('cta') ? K.helicopter(t, 'question', { y: 360, w: 520 }) : -1, up = hu < 0 ? 0 : Math.sin(PI * K.clamp01((hu - .05) / .85));
          face(D, up > .3 ? 'flat' : id === 'cta' ? 'smirk' : 'smile', t); D.pose(Object.assign({ t, nod: -.38 * up, gesture: id === 'cta' ? 'point' : 'hips', gw: id === 'cta' ? K.ease((Lc - .3) / .4) : 1 - up }, sway(1 - up)));
          face(G, id === 'cta' ? 'happy' : 'smile', t, 1); G.pose(Object.assign({ t, nod: -.2 * up }, sway(1 - up)));
          if (id === 'question') K.text('ZOOM IN TONIGHT', { y: 430, size: 84, color: 'gold', scale: popIn(K, t, at('question') + .2) });
          break; }
      }
    },
  };
})();
