// burger-1955: what's in a McDonald's cheeseburger (Brian's script). Plates + props + Doug and Gary. Plan: shotlist.md.
// World units: feet at y=0, camera at (0, camH, 0) looking down -z. Props + text in screen px (y down).
// Every label and number on screen is K.text (the paintings carry no text, no logos).
(function () {
  const PI = Math.PI;
  const face = (ch, name, t, off = 0) => ch.face(((t + off) % 4.1) < .12 && name !== 'happy' ? 'blink' : name);
  const popIn = (K, t, from, dur = .35) => K.pop(K.clamp01((t - from) / dur));
  const WORDS = window.VIDEO_DATA.words, norm = w => w.toLowerCase().replace(/[^a-z0-9]/g, '');
  const wordAt = (K, w, cue) => { const t0 = K.T(cue); const x = WORDS.find(o => o.start >= t0 - .01 && norm(o.w) === w); return x ? x.start : t0; };
  const RED = '#e8352b', GOLD = 'gold';

  const L = {
    diner: { key: [0xffd0a0, 2.2, [-12, 6, 2]], hemi: [0xa8e0e0, 0x806060, .85], front: [0xffe8dc, 1.0], shadow: [0x2a3a50, .38] },
    dusk: { key: [0xff9a60, 1.9, [-12, 5, -4]], hemi: [0xb080e0, 0x503060, .85], front: [0xffc8b0, .95], shadow: [0x2a1040, .45] },
  };
  // the 7 bowls in 02_ingredient_bowls_topdown.png (painting px) → [x, y] and the shot focus that frames each
  const BOWL = { beef: [135, 605], bun: [395, 605], cheese: [645, 605], ketchup: [890, 605], mustard: [230, 935], pickles: [510, 935], onions: [790, 935] };
  const F = k => [BOWL[k][0] / 1024, BOWL[k][1] / 1536];
  // nutrition card P02 (image 1024×1536): row centers in image px
  const ROW = { title: 212, cal: 469, protein: 607, carbs: 741, fat: 874, sat: 1006, sodium: 1138, sugar: 1270, fiber: 1387 };
  function card(K, t, rows, o = {}) { const w = o.w || 900, x = 540, y = o.y || 900, s = w / 1024;
    K.prop('P02', { x, y, w });
    K.text('Nutrition Facts', { x, y: y + (ROW.title - 768) * s - 10, size: 74 * s / .879, color: '#111', stroke: 0, shadow: false, w });
    rows.forEach(([k, label, val, from, col]) => { if (t < from) return; const ry = y + (ROW[k] - 768) * s - 14 * s, sc = popIn(K, t, from, .25);
      K.text(label, { x: x - 170 * s, y: ry, size: 60 * s / .879, color: '#111', stroke: 0, shadow: false, w: 560 * s, scale: sc });
      K.text(val, { x: x + 250 * s, y: ry, size: 64 * s / .879, color: col || '#111', stroke: 0, shadow: false, w: 380 * s, scale: sc }); }); }
  const chips = (K, t, items, y0, size = 64) => items.forEach(([s, from, col], i) => { if (t < from) return;
    K.text(s, { y: y0 + i * size * 1.25, size, color: col || '#fff', scale: popIn(K, t, from), w: 1040 }); });

  window.SCENE = {
    plates: {
      '01': { img: '01_diner_booth.png', hz: .48, vx: .62, fov0: 55, camH: 1.5, light: L.diner },
      '02': { img: '02_ingredient_bowls_topdown.png', hz: .5, vx: .5, fov0: 55, camH: 1.5, light: L.diner },
      'R1': { img: 'R01_parking_dusk.png', hz: .55, vx: .5, fov0: 55, camH: 1.7, light: L.dusk },
    },
    props: { P01: 'P01_cheeseburger.cut.png', P02: 'P02_label_card.png', P03: 'P03_salt_shaker.cut.png', P04: 'P04_chemistry_set.png', H01: 'H01_helicopter.png' },
    cast: { doug: 'hoodie', gary: 'oxford' },
    shots: [
      { at: 'q', plate: '01', zoom: [1.0, 1.1], focus: [[.45, .55], [.4, .55]] },
      { at: 'cal', plate: '01', zoom: [1.6, 1.7], focus: [[.2, .5], [.2, .5]] },
      { at: 'card', plate: '01', zoom: [1.15, 1.2], focus: [[.45, .58], [.45, .58]] },
      { at: 'chem', plate: '01', zoom: [1.2, 1.25], focus: [[.4, .56], [.4, .56]] },
      { at: 'gary', plate: '01', zoom: [1.05, 1.1], focus: [[.55, .6], [.58, .6]] },
      { at: 'beef', plate: '02', zoom: [1.8, 2.0], focus: [F('beef'), F('beef')] },
      { at: 'bun', plate: '02', zoom: [1.8, 1.9], focus: [F('bun'), F('bun')] },
      { at: 'vit', plate: '02', zoom: [1.3, 1.35], focus: [F('bun'), F('bun')] },
      { at: 'dough', plate: '02', zoom: [1.35, 1.4], focus: [F('bun'), F('bun')] },
      { at: 'cheese', plate: '02', zoom: [1.8, 1.9], focus: [F('cheese'), F('cheese')] },
      { at: 'melt', plate: '01', zoom: [1.0, 1.05], focus: [[.5, .5], [.5, .5]] },          // burger close-up on top
      { at: 'ketchup', plate: '02', zoom: [1.8, 1.9], focus: [F('ketchup'), F('ketchup')] },
      { at: 'hfcs', plate: '02', zoom: [1.4, 1.45], focus: [F('ketchup'), F('ketchup')] },
      { at: 'mustard', plate: '02', zoom: [1.8, 1.9], focus: [F('mustard'), F('mustard')] },
      { at: 'pickles', plate: '02', zoom: [1.5, 1.6], focus: [[.64, .61], [.64, .61]] },
      { at: 'sorbate', plate: '02', zoom: [1.8, 1.9], focus: [F('pickles'), F('pickles')] },
      { at: 'numbers', plate: '01', zoom: [1.0, 1.0], focus: [[.5, .5], [.5, .5]] },        // nutrition card on top
      { at: 'sodium', plate: '01', zoom: [1.0, 1.0], focus: [[.5, .5], [.5, .5]] },
      { at: 'dv', plate: '01', zoom: [1.0, 1.0], focus: [[.5, .5], [.5, .5]] },
      { at: 'sugar', plate: '01', zoom: [1.0, 1.0], focus: [[.5, .5], [.5, .5]] },
      { at: 'end', plate: 'R1', zoom: [1.1, 1.15], focus: [[.48, .6], [.5, .58]] },
      { at: 'heli', plate: 'R1', zoom: [1.0, 1.02], focus: [[.5, .52], [.5, .52]] },
      { at: 'ask', plate: 'R1', zoom: [1.05, 1.1], focus: [[.5, .55], [.5, .55]] },
      { at: 'cta', plate: 'R1', zoom: [1.0, 1.0], focus: [[.5, .5], [.5, .5]] },
    ],
    shakes: [['chem', .25, .5], ['sodium', .3, .6]],
    flashes: [],
    // THE HELICOPTER CLIP (PLAYBOOK §1.12a): the original OpenArt clip plays full screen under the follow CTA
    clips: [{ at: 'cta', file: 'H00_helicopter_clip_openart.mp4', from: 'assets' }],
    follow: { from: 'cta+1.4' },
    tail: 1.6,

    update(t, K) {
      const id = K.shot.id, Lc = K.shot.local, at = c => K.T(c), S = K.imgScale();
      const D = K.cast.doug, G = K.cast.gary;
      const burgerOnTable = (w = 230) => { const p = K.img(185, 735); K.prop('P01', { x: p.x, y: p.y, w: w * S / 1.25 }); };
      const booth = () => K.placeAt('doug', 560, 1110, -.35);
      const label = (s, o = {}) => K.text(s, Object.assign({ y: 300, size: 76, color: GOLD }, o));
      switch (id) {
        case 'q': { booth(); face(D, 'flat', t); D.pose({ t, look: -.45, nod: .1 }); burgerOnTable();
          const a = K.clamp01((at('cal') - t) / .2);
          K.text("WHAT'S IN A McDONALD'S", { y: 290, size: 76, a, scale: .8 + .2 * popIn(K, t, at('q')) });
          K.text('CHEESEBURGER?', { y: 390, size: 104, color: GOLD, a, scale: .8 + .2 * popIn(K, t, at('q') + .6) }); break; }
        case 'cal': { K.prop('P01', { x: 540, y: 820, w: 900 }); label('300 CALORIES', { y: 360, size: 104, scale: popIn(K, t, wordAt(K, 'three', 'cal')) }); break; }
        case 'card': { booth(); face(D, 'worried', t); D.pose({ t, look: -.4 }); burgerOnTable(); break; }
        case 'chem': { booth(); face(D, 'surprised', t); D.pose({ t, gesture: 'shrug', gw: K.ease(Lc / .35), look: -.3 });
          const p = K.img(190, 700); K.prop('P04', { x: p.x, y: p.y, w: 520 * S / 1.25 * popIn(K, t, wordAt(K, 'chemistry', 'chem')) });
          label('"A CHEMISTRY SET"', { y: 300, size: 72, color: '#fff', scale: popIn(K, t, wordAt(K, 'chemistry', 'chem')) }); break; }
        case 'gary': { booth(); face(D, 'worried', t); D.pose({ t, look: .4 }); burgerOnTable();
          const u = K.clamp01(Lc / 1.0), [x0, z0] = K.floorAt(1020, 1180), [x1, z1] = K.floorAt(840, 1160);
          K.place('gary', K.lerp(x0, x1, u), 0, K.lerp(z0, z1, u), u < 1 ? -PI / 2 : -.4); face(G, 'flat', t, 1);
          G.pose({ t, walk: Lc * 1.4, walkAmt: 1 - u, gesture: u >= 1 ? 'point' : undefined, gw: K.ease((Lc - 1) / .3) });
          if (t > wordAt(K, 'break', 'gary')) label("LET'S BREAK IT DOWN", { y: 300, size: 70, scale: popIn(K, t, wordAt(K, 'break', 'gary')) }); break; }
        case 'beef': { label('100% BEEF', { y: 280, size: 100, scale: popIn(K, t, wordAt(K, 'one', 'beef')) });
          chips(K, t, [['+ salt', wordAt(K, 'salt', 'beef')], ['+ pepper', wordAt(K, 'pepper', 'beef')]], 400, 72); break; }
        case 'bun': { label('THE BUN', { y: 270, size: 96 });
          chips(K, t, [['enriched wheat flour', wordAt(K, 'enriched', 'bun')], ['water · sugar', wordAt(K, 'water', 'bun')], ['yeast · soybean oil', wordAt(K, 'yeast', 'bun')]], 400, 72); break; }
        case 'vit': { const items = ['niacin', 'iron', 'thiamine', 'riboflavin', 'folic acid'];
          items.forEach((s, i) => { const tw = wordAt(K, s.split(' ')[0], 'vit'); if (t < tw) return;
            K.text(s, { x: i === 4 ? 540 : i % 2 ? 760 : 320, y: 250 + Math.floor(i / 2) * 110, size: 76, scale: popIn(K, t, tw), w: 500 }); });
          if (t > wordAt(K, 'vitamins', 'vit')) K.text('= VITAMINS & MINERALS', { y: 620, size: 76, color: GOLD, scale: popIn(K, t, wordAt(K, 'vitamins', 'vit')), w: 1060 }); break; }
        case 'dough': { label('+ small amounts of', { y: 280, size: 66, color: '#fff', scale: popIn(K, t, wordAt(K, 'small', 'dough')) });
          label('DOUGH HELPERS', { y: 380, size: 92, scale: popIn(K, t, wordAt(K, 'make', 'dough')) }); break; }
        case 'cheese': { label('THE CHEESE', { y: 270, size: 96 });
          chips(K, t, [['milk · cream', wordAt(K, 'milk', 'cheese')], ['+ sodium citrate', wordAt(K, 'sodium', 'cheese'), GOLD]], 400, 72); break; }
        case 'melt': { K.prop('P01', { x: 540, y: 820, w: 900 });
          label('sodium citrate =', { y: 280, size: 70, color: '#fff' }); label('a salt that helps it MELT', { y: 380, size: 70, scale: popIn(K, t, wordAt(K, 'melt', 'melt')), w: 1060 }); break; }
        case 'ketchup': { label('THE KETCHUP', { y: 270, size: 96 });
          chips(K, t, [['tomatoes · vinegar', wordAt(K, 'tomatoes', 'ketchup')], ['+ 2 corn sweeteners', wordAt(K, 'two', 'ketchup'), GOLD]], 400, 72); break; }
        case 'hfcs': { chips(K, t, [['high-fructose corn syrup', wordAt(K, 'highfructose', 'hfcs')], ['+ corn syrup', wordAt(K, 'corn', 'hfcs') + .9]], 270, 64); break; }
        case 'mustard': { label('THE MUSTARD', { y: 270, size: 96 });
          chips(K, t, [['vinegar · water', wordAt(K, 'vinegar', 'mustard')], ['mustard seed', wordAt(K, 'seed', 'mustard') - .3]], 400, 72); break; }
        case 'pickles': { label('PICKLES + ONIONS', { y: 270, size: 92, scale: popIn(K, t, wordAt(K, 'pickles', 'pickles')) }); break; }
        case 'sorbate': { label('potassium sorbate', { y: 270, size: 80, scale: popIn(K, t, wordAt(K, 'potassium', 'sorbate')) });
          if (t > wordAt(K, 'preservative', 'sorbate')) label('= keeps them FRESH', { y: 380, size: 76, color: '#fff', scale: popIn(K, t, wordAt(K, 'preservative', 'sorbate')) }); break; }
        case 'numbers': case 'sodium': case 'dv': case 'sugar': {
          const rows = [['cal', 'Calories', '300', wordAt(K, 'three', 'numbers')], ['protein', 'Protein', '15g', wordAt(K, 'fifteen', 'numbers')],
            ['carbs', 'Carbs', '31g', wordAt(K, 'thirtyone', 'numbers')], ['fat', 'Fat', '13g', wordAt(K, 'thirteen', 'numbers')],
            ['sat', 'Sat. fat', '6g', wordAt(K, 'six', 'numbers')], ['sodium', 'Sodium', '710mg', at('sodium') + .6, RED],
            ['sugar', 'Sugar', '6g', wordAt(K, 'sugar', 'sugar') - .4], ['fiber', 'Fiber', '2g', wordAt(K, 'fiber', 'sugar') - .3]];
          if (id !== 'dv') card(K, t, rows, { w: id === 'sodium' ? 740 : 700, y: 720 });
          if (id === 'sodium') { const s = popIn(K, t, at('sodium') + .3); K.prop('P03', { x: 920, y: 1010, w: 260 * s, rot: .08 }); }
          if (id === 'dv') { K.prop('P03', { x: 540, y: 860, w: 520, rot: Math.sin(t * 6) * .03 }); K.text('710 mg sodium', { y: 1130, size: 76, color: RED });
            K.text('≈ 31%', { x: 540, y: 290, size: 150, color: RED, scale: popIn(K, t, wordAt(K, 'thirtyone', 'dv')) });
            K.text('of the Daily Value', { y: 420, size: 60, scale: popIn(K, t, wordAt(K, 'daily', 'dv')) }); }
          break; }
        case 'end': case 'heli': case 'ask': case 'cta': {
          const d = K.placeAt('doug', 420, 1180, .2), g = K.placeAt('gary', 760, 1170, -.35);
          // THE HELICOPTER ENDING (PLAYBOOK §1.12a): it crosses the dusk sky on Gary's line; Doug looks up
          const hu = K.helicopter(t, 'heli', { y: 300 }), up = hu < 0 ? 0 : Math.sin(PI * K.clamp01((hu - .05) / .85));
          face(D, up > .4 ? 'flat' : id === 'end' ? 'think' : 'worried', t); D.pose({ t, nod: -.5 * up, gesture: id === 'end' ? 'think' : id === 'ask' ? 'shrug' : undefined, gw: K.ease(Lc / .4) });
          face(G, 'smirk', t, 1); G.pose({ t, gesture: id === 'heli' || id === 'ask' ? 'point' : 'cross', gw: K.ease(Lc / .35), look: -.2 });
          if (id === 'heli' || id === 'ask') { const h = K.screenOf(g.head); K.prop('P03', { x: h.x + 40, y: h.y - 260, w: 170 * popIn(K, t, wordAt(K, 'sodium', 'heli')), rot: .1 });
            if (t > wordAt(K, 'number', 'heli')) K.text('710mg', { x: Math.min(860, h.x + 40), y: h.y - 420, size: 76, color: RED, scale: popIn(K, t, wordAt(K, 'number', 'heli')) }); }
          break; }
      }
    },
  };
})();
