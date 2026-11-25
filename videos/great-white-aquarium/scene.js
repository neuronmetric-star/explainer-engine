// great-white-aquarium · one-off · true story: "Why are there no great white sharks in aquariums?"
// Doug = the keeper (invented stand-in), Gary = the scientist who found the buzz, Victor = the boss. Sharks are 2D props (never painted).
// Tools (PLAYBOOK §8): crash-zoom hook out of the sign's jaws, K.hookReact + flash/shake, K.flow (water = light blue, buzz = white,
// danger = red, answer = gold), SCENE.whip, growing set (B01: empty tank → shark + tank mates → tank mates gone), helicopter ending.
(function () {
  const PI = Math.PI;
  const face = (ch, name, t, off = 0) => ch.face(((t + off) % 4.1) < .12 && !['happy', 'scream', 'blink'].includes(name) ? 'blink' : name);
  const popIn = (K, t, from, dur = .35) => K.pop(K.clamp01((t - from) / dur));
  const ENDING = 'E01_city_sunset_ending.png';   // the signature goodbye (docs/assets)
  const WATER = '#7fd4ff';   // light blue = water (color code)
  const L = {
    aqua: { key: [0xffd8a0, 1.7, [10, 7, 5]], hemi: [0x8fe0ff, 0x2a3a6a, .95], front: [0xc8ecff, .95], shadow: [0x0a2040, .40] },
    retro: { key: [0xf0ffe0, 1.5, [-5, 8, 4]], hemi: [0xa8e0c8, 0x3a4038, .9], front: [0xe0ffe8, .85], shadow: [0x102018, .42] },
    lab: { key: [0xfff0d8, 1.8, [8, 6, 5]], hemi: [0xd8e4ff, 0x8090a8, .9], front: [0xe8f0ff, 1.0], shadow: [0x203050, .35] },
    deck: { key: [0xffb070, 2.4, [12, 3, 3]], hemi: [0xffc8b0, 0x6a5a80, .85], front: [0xffe8dc, 1.0], shadow: [0x3a2050, .42] },
    sunset: { key: [0xffb070, 2.6, [-12, 3, 2]], hemi: [0xffc8b0, 0x8a6a80, .8], front: [0xffe8dc, 1.0], shadow: [0x4a2a5a, .42] },
  };
  // image px (all paintings 1024 × 1536)
  const SIGN = [790, 770, 330];          // B01: the exhibit sign (center x, y, width) over the painted brass stand
  const TANK = [560, 470];               // B01: middle of the empty tank
  const SEAM = [662, 772];               // B02: the riveted seam on the round tank (the clue spot)
  const BOX = [507, 492, 540];           // B03: the cutaway diagram on the lightbox (center x, y, width)
  const AFRICA = [205, 640], AUS = [770, 610];   // B04: the trip

  window.SCENE = {
    banner: 'THE HECK?',
    whip: true,
    plates: {
      B01: { img: 'B01_aquarium_hall.png', hz: .42, vx: .52, fov0: 55, camH: 1.9, light: L.aqua },
      B02: { img: 'B02_round_tank_1980.png', hz: .38, vx: .5, fov0: 55, camH: 2.2, light: L.retro },
      B02D: { img: 'B02_round_tank_1980.png', hz: .38, vx: .5, fov0: 55, camH: 2.2, light: L.retro, tint: 0x30385a },
      B03: { img: 'B03_lab_lightbox.png', hz: .45, vx: .48, fov0: 55, camH: 2.1, light: L.lab },
      B04: { img: 'B04_ocean_map.png', hz: .5, vx: .5, fov0: 55, camH: 1.6, light: 'interior' },
      B05: { img: 'B05_boat_deck_sea.png', hz: .37, vx: .55, fov0: 55, camH: 2.0, light: L.deck },
      E: { img: ENDING, hz: .45, vx: .5, fov0: 55, camH: 2.0, light: L.sunset },
    },
    props: { SIGN: 'P08_great_white_sign.png', GW: 'P01_great_white_swim.png', GWH: 'P02_great_white_hungry.png', SOUP: 'P03_soupfin_shark.png',
      CUT: 'P04_shark_cutaway.png', METER: 'P05_voltmeter.png', BIKE: 'P06_bicycle.png', PHONE: 'P07_phone_buzzing.png', CLOSET: 'P09_closet.png', H01: 'H01_helicopter.png' },
    cast: { doug: 'hoodie', gary: 'oxford', boss: 'suit' },
    shots: [
      { at: 'q', plate: 'B01', zoom: [5.0, 1.6], focus: [[.77, .47], [.62, .58]] },          // THE HOOK: the sign's jaws huge → crash-zoom out
      { at: 'q+0.55', plate: 'B01', zoom: [1.6, 1.45], focus: [[.62, .58], [.6, .56]] },    // Gary jumps back screaming: the tank is EMPTY
      { at: 'glass', plate: 'B01', zoom: [1.45, 1.5], focus: [[.6, .56], [.55, .42]] },     // push into the empty tank
      { at: 'card', plate: 'B01', zoom: [1.2, 1.25], focus: [[.42, .55], [.42, .55]] },          // Victor + Doug
      { at: 'easy', plate: 'B01', zoom: [1.25, 1.4], focus: [[.42, .55], [.42, .55]] },
      { at: 'swim', plate: 'B03', zoom: [1.15, 1.3], focus: [[.45, .45], [.55, .4]] },       // the cutaway: breathes by swimming
      { at: 'bike', plate: 'B03', zoom: [1.3, 1.2], focus: [[.55, .42], [.5, .5]] },
      { at: 'round', plate: 'B02', zoom: [1.15, 1.25], focus: [[.47, .55], [.52, .55]] },    // 1980, the round tank, Sandy circles
      { at: 'bonk', plate: 'B02', zoom: [1.25, 1.6], focus: [[.52, .55], [.62, .52]] },      // push to the seam
      { at: 'gary', plate: 'B02', zoom: [1.6, 1.5], focus: [[.62, .55], [.62, .58]] },       // Gary + meter: the buzz
      { at: 'nose', plate: 'B03', zoom: [1.3, 2.0], focus: [[.55, .4], [.66, .33]] },        // push to the snout
      { at: 'phone', plate: 'B02D', zoom: [1.6, 1.75], focus: [[.62, .52], [.64, .5]] },     // the dark room, the buzzing phone
      { at: 'free1', plate: 'B05', zoom: [1.15, 1.25], focus: [[.55, .6], [.6, .58]] },      // let her go
      { at: 'big', plate: 'B01', zoom: [1.15, 1.25], focus: [[.5, .5], [.52, .48]] },        // 2004: the growing set (shark + tank mates)
      { at: 'crowd', plate: 'B01', zoom: [1.25, 1.15], focus: [[.52, .48], [.5, .52]] },
      { at: 'but', plate: 'B01', zoom: [1.15, 1.5], focus: [[.5, .52], [.55, .4]] },          // she grows; the buffet
      { at: 'two', plate: 'B01', zoom: [1.5, 1.3], focus: [[.55, .4], [.45, .52]] },
      { at: 'free2', plate: 'B05', zoom: [1.25, 1.15], focus: [[.6, .58], [.55, .6]] },
      { at: 'roam', plate: 'B04', zoom: [1.35, 1.05], focus: [[.3, .42], [.5, .45]] },       // the map: Africa → Australia → back
      { at: 'closet', plate: 'B04', zoom: [1.05, 1.1], focus: [[.5, .45], [.5, .47]] },
      { at: 'mirror', plate: 'B04', zoom: [1.6, 1.0], focus: [[.82, .73], [.5, .5]] },       // from the tiny tank icon out to the whole ocean
      { at: 'diy', plate: 'E', zoom: [1.04, 1.1], focus: [[.5, .53], [.5, .5]] },            // the signature goodbye
      { at: 'cta', plate: 'E', zoom: [1.1, 1.1], focus: [[.5, .5], [.5, .48]] },
    ],
    shakes: [['q+0.28', .5, .8], ['bonk+0.55', .2, .3], ['spot+0.45', .2, .3], ['buzz', .25, .35], ['two', .25, .3]],
    flashes: [['q+0.28', .18, .55]],
    follow: { from: 'cta+0.3' },
    tail: 1.0,

    update(t, K) {
      const id = K.shot.id.split('+')[0], Lc = K.shot.local, at = c => K.T(c), s = () => K.imgScale();
      const D = K.cast.doug, G = K.cast.gary, V = K.cast.boss;
      const sway = (k = 1) => ({ look: .06 * k * Math.sin(t * .7), tilt: .04 * k * Math.sin(t * .9 + 1) });
      // a prop placed in IMAGE px (follows the camera): k = prop key, w = width in image px
      const ip = (k, ix, iy, w, o = {}) => { const p = K.img(ix, iy); return K.prop(k, Object.assign({ x: p.x, y: p.y, w: w * s() }, o)); };
      const ring = (x, y, r, color, w = 8, a = 1) => { const N = 36; let prev = null;
        for (let k = 0; k <= N; k++) { const g = k / N * 2 * PI, q = { x: x + Math.cos(g) * r, y: y + Math.sin(g) * r }; if (prev) K.line(prev.x, prev.y, q.x, q.y, { color, width: w, a }); prev = q; } };
      const zig = (x, y, len, ang, color = '#fff', a = 1, ph = 0) => { const n = 5, seg = len / n; let px = x, py = y;   // an electric zigzag
        for (let k = 0; k < n; k++) { const off = (k % 2 ? 1 : -1) * seg * .45 * (1 + .3 * Math.sin(t * 30 + ph + k)), nx = px + Math.cos(ang) * seg - Math.sin(ang) * off, ny = py + Math.sin(ang) * seg + Math.cos(ang) * off;
          K.line(px, py, nx, ny, { color, width: 7, a }); px = nx; py = ny; } };
      const title = (str, from, color = 'gold', y = 300, size = 84) => K.text(str, { y, size, color, scale: popIn(K, t, from) });
      // the great white swimming (side view): bob + tail wiggle (skew via tiny rotation), flip = facing left
      const shark = (k, ix, iy, w, o = {}) => ip(k, ix, iy + Math.sin(t * 2.4 + (o.ph || 0)) * 6, w, Object.assign({ rot: .03 * Math.sin(t * 3.1 + (o.ph || 0)) }, o));

      switch (id) {
        case 'q': {   // THE HOOK: the sign's jaws → crash-zoom out → the giant tank is EMPTY; Gary (a visitor) jumps back screaming
          ip('SIGN', SIGN[0], SIGN[1], SIGN[2]);
          K.placeAt('gary', 520, 1000, -.25); K.hookReact(G, t, 'q');
          if (t > at('q') + .4) { K.text('WHY ARE THERE NO', { y: 300, size: 70, scale: popIn(K, t, at('q') + .4) });
            K.text('GREAT WHITE SHARKS', { y: 385, size: 84, color: 'gold', scale: popIn(K, t, at('q') + .6) });
            K.text('IN AQUARIUMS?', { y: 470, size: 84, color: 'gold', scale: popIn(K, t, at('q') + .8) }); }
          break; }
        case 'glass': {   // "You've seen sharks behind the glass. But never this one. And it's not because nobody tried."
          ip('SIGN', SIGN[0], SIGN[1], SIGN[2]);
          if (t > at('never') && t < at('tried')) { const b = .55 + .2 * Math.sin((t - at('never')) * 9); shark('GW', TANK[0], TANK[1], 520, { a: b }); title('NEVER THIS ONE', at('never'), 'red'); }
          if (t > at('tried')) { const yrs = ['1955', '1980', '2004', '2016']; yrs.forEach((y, i) => K.text(y, { x: 220 + i * 215, y: 330, size: 70, color: 'gold', scale: popIn(K, t, at('tried') + .15 + i * .2) })); }
          break; }
        case 'card': case 'easy': {   // Doug's boss wants a great white. "It's just a big fish." "Honestly? I'd have bet on Doug."
          ip('SIGN', SIGN[0], SIGN[1], SIGN[2]);
          K.placeAt('boss', 300, 1010, .35); K.placeAt('doug', 500, 1040, -.2);
          if (id === 'card') { face(V, 'smirk', t); V.pose(Object.assign({ t, gesture: t > at('boss') ? 'point' : 'hips', gw: K.ease((t - at('boss')) / .4), look: .3 }, sway(.4)));
            face(D, t > at('boss') ? 'surprised' : 'smile', t, 1); D.pose(Object.assign({ t, look: -.3 }, sway(.6)));
            if (t > at('boss')) { shark('GW', TANK[0] + 60, TANK[1], 420, { a: .3 }); title('THE BOSS WANTS ONE', at('boss') + .2); } }
          else { const bet = t > at('bet');
            face(V, 'smile', t); V.pose(Object.assign({ t, gesture: 'hips', look: .3 }, sway(.4)));
            face(D, bet ? 'happy' : 'smirk', t, 1); D.pose(Object.assign({ t, gesture: bet ? 'tada' : 'shrug', gw: K.ease((Lc - .2) / .4) }, sway(.5)));
            K.text('JUST A BIG FISH', { y: 300, size: 92, scale: popIn(K, t, at('easy') + .1) });
            if (bet) K.text('I’D BET ON DOUG', { y: 400, size: 64, color: 'gold', scale: popIn(K, t, at('bet') + .3) }); }
          break; }
        case 'swim': case 'bike': {   // the cutaway: water rushes in the mouth and over the gills; stop swimming = no water = can't breathe
          const stopped = t > at('stop'), bob = stopped ? 0 : Math.sin(t * 2.6) * 5;
          ip('CUT', BOX[0], BOX[1] + bob, BOX[2]);
          K.placeAt('doug', 330, 1130, .35); face(D, stopped ? 'worried' : 'smile', t); D.pose(Object.assign({ t, gesture: 'point', gw: K.ease((t - at('swim')) / .4), look: .35 }, sway(.4)));
          const c = (px, py) => K.img(BOX[0] + (px / 1024 - .5) * BOX[2], BOX[1] + bob + (py / 1536 - .5) * BOX[2] * 1.5);
          const in0 = c(1080, 800), mouth = c(900, 800), gill = c(640, 770), out = c(560, 830), fl = stopped ? Math.max(.15, 1 - (t - at('stop')) / .8) : 1;
          const col = stopped ? '#ff4a3d' : WATER;
          K.flow(t, in0.x + 60, in0.y, mouth.x, mouth.y, { color: col, width: 14, speed: 1.2 * fl });
          K.flow(t, mouth.x, mouth.y, gill.x, gill.y, { color: col, width: 14, speed: 1.2 * fl, ph: .3 });
          K.flow(t, gill.x, gill.y + 20, out.x - 40, out.y + 60, { color: col, width: 12, speed: 1.2 * fl, ph: .6 });
          if (!stopped) title('BREATHES BY SWIMMING', at('swim') + .2);
          else title(t < at('bike') ? 'STOP = NO AIR' : 'LIKE A BIKE', t < at('bike') ? at('stop') : at('bike'), t < at('bike') ? 'red' : 'gold');
          if (id === 'bike') { const fall = K.ease((t - at('bike') - 1.0) / .45);
            K.prop('BIKE', { x: 760, y: 1200, w: 520 * popIn(K, t, at('bike')), rot: .1 + 1.25 * fall, anchor: [.8, .76] });
            if (fall > .9) K.text('FALL OVER', { x: 760, y: 1000, size: 70, color: 'red', scale: popIn(K, t, at('bike') + 1.45) }); }
          break; }
        case 'round': case 'bonk': case 'gary': {   // 1980: a round tank and young Sandy. She keeps ramming the same spot. Gary finds a buzz there.
          const seam = K.img(...SEAM);
          if (id === 'round') { const u = ((t - at('round')) * .28) % 1, dir = u < .5 ? 1 : -1, x = u < .5 ? K.lerp(170, 860, u * 2) : K.lerp(860, 170, (u - .5) * 2);
            shark('GW', x, 790, 260, { flip: dir < 0, layer: 'back' });
            title('1980', at('round') + .1, 'white', 300, 110); if (t > at('sandy')) K.text('SANDY', { y: 410, size: 72, color: 'gold', scale: popIn(K, t, at('sandy') + .2) });
            K.placeAt('doug', 740, 1190, -.45); face(D, 'happy', t); D.pose(Object.assign({ t, gesture: 'hips' }, sway(.5))); }
          else { // ram, back off, ram again (bump at local .55 and 1.4)
            // ram → bounce back → ram again: contact at the middle of every period (≈ bonk+0.55, spot+0.45 line up with the shakes)
            const per = id === 'gary' ? 1.6 : 1.0, u = ((t - at('bonk') + .45) % per) / per, reach = u < .5 ? K.easeOut(u / .5) ** 2 : 1 - K.ease((u - .5) / .5);
            const nose = K.lerp(420, SEAM[0], reach);
            shark('GW', nose - 125, SEAM[1] + 8, 260, { layer: 'back', rot: reach > .97 ? .08 : 0 });
            const pulse = .5 + .5 * Math.sin(t * 7);
            if (t > at('spot') - .1) ring(seam.x, seam.y, (46 + 10 * pulse) * s(), '#ff4a3d', 8, .9);
            if (id === 'bonk') title(t < at('spot') ? 'BONK' : 'SAME SPOT', t < at('spot') ? at('bonk') + .5 : at('spot') + .3, 'red', 300, 100);
            // Doug stays out of the ramming shots so Sandy and the spot read clearly
            if (id === 'gary') { K.placeAt('gary', 800, 1040, -.35); face(G, t > at('buzz') ? 'surprised' : 'flat', t, 1); G.pose(Object.assign({ t, gesture: 'point', gw: K.ease(Lc / .4), look: -.2 }, sway(.3)));
              const m = ip('METER', 560, 975, 150, { rot: -.08 }); const tip = K.img(600, 950);
              K.line(tip.x, tip.y, seam.x - 6 * s(), seam.y + 20 * s(), { color: '#d22', width: 5 });
              if (t > at('gary') + .6) for (let k = 0; k < 4; k++) zig(seam.x, seam.y, 90 * s(), -PI / 2 + (k - 1.5) * .7, '#fff', .9, k);
              if (t > at('buzz') - .3) K.slam('BUZZ!', t, at('buzz') - .3, { y: 320, size: 130, color: 'red' });
              else title('A TINY ELECTRIC…', at('gary') + .3, 'white', 320, 70); } }
          break; }
        case 'nose': {   // great whites feel electricity with their noses
          ip('CUT', BOX[0], BOX[1], BOX[2]);
          const n = K.img(BOX[0] + (960 / 1024 - .5) * BOX[2], BOX[1] + (770 / 1536 - .5) * BOX[2] * 1.5);
          for (let k = 0; k < 3; k++) zig(n.x + 230, n.y - 60 + k * 60, 200, PI + (k - 1) * .2, '#fff', .9, k);
          K.text('●', { x: n.x, y: n.y, size: 120 * (1 + .15 * Math.sin(t * 8)), color: 'rgba(255,210,58,.55)', stroke: 0, shadow: false });
          title('ITS NOSE FEELS', at('nose') + .3, 'white', 300, 70); K.text('ELECTRICITY', { y: 390, size: 96, color: 'gold', scale: popIn(K, t, at('nose') + .5) });
          break; }
        case 'phone': {   // to Sandy, that wall was a phone buzzing in a dark room
          const p = K.img(SEAM[0], SEAM[1]), j = Math.sin(t * 60) * 6;
          K.prop('PHONE', { x: p.x + j, y: p.y - 40, w: 300, rot: -.1 + Math.sin(t * 50) * .03 });
          K.text('●', { x: p.x, y: p.y - 40, size: 700, color: 'rgba(160,220,255,.18)', stroke: 0, shadow: false });
          if (t > at('free1') - .9) title('3 DAYS', at('free1') - .9, 'red', 300, 110);
          break; }
        case 'free1': case 'free2': {   // let her go: the shark slides down the ramp into the sea
          const second = id === 'free2', t0 = at(id) + .4, u = K.clamp01((t - t0) / 1.3);
          K.placeAt('doug', 430, 1060, .1); K.placeAt('gary', 620, 1040, -.15);
          face(D, second ? 'flat' : 'smile', t); D.pose(Object.assign({ t, look: .35, nod: .1 }, sway(.5)));
          face(G, 'smile', t, 1); G.pose(Object.assign({ t, look: .2 }, sway(.6)));
          if (u < 1) ip('GW', K.lerp(760, 960, u), K.lerp(800, 880, u), second ? 330 : 240, { rot: .35, a: 1 - K.clamp01((u - .7) / .3), layer: 'back' });
          if (!second) title('3 DAYS', at('free1'), 'red', 300, 110); else title('LET GO', at('free2') + .2, 'gold', 300, 100);
          break; }
        case 'big': case 'crowd': case 'but': case 'two': {   // 2004, the giant tank in California: she eats, swims, a record crowd… then she grows
          const grow = id === 'but' || id === 'two' ? 1 + .45 * K.ease((t - at('but')) / 1.2) : 1, hungry = t > at('buffet');
          const sx = K.lerp(330, 760, (Math.sin(t * .45) + 1) / 2), face_r = Math.cos(t * .45) > 0;
          shark(hungry ? 'GWH' : 'GW', hungry ? 600 : sx, 440, 330 * grow, { flip: !hungry && !face_r, layer: 'back' });
          const gone = id === 'two' ? K.clamp01((t - at('two') - .5) / .6) : 0;
          [[300, 640, 0], [790, 560, 1.7]].forEach(([x, y, ph], i) => { const xx = x + Math.sin(t * (hungry ? 1.6 : .7) + ph) * (hungry ? 120 : 70);
            if (gone < 1) shark('SOUP', xx, y, 230, { flip: Math.cos(t * (hungry ? 1.6 : .7) + ph) < 0, layer: 'back', a: 1 - gone, ph });
            if (id === 'two' && t > at('two') + .1) { const q = K.img(xx, y), k = popIn(K, t, at('two') + .1 + i * .2); K.line(q.x - 60 * k, q.y - 60 * k, q.x + 60 * k, q.y + 60 * k, { color: '#ff4a3d', width: 14 }); K.line(q.x + 60 * k, q.y - 60 * k, q.x - 60 * k, q.y + 60 * k, { color: '#ff4a3d', width: 14 }); } });
          K.placeAt('doug', 480, 1020, -.1);
          if (id === 'big') { face(D, 'happy', t); D.pose(Object.assign({ t, gesture: 'tada', gw: K.ease((t - at('her')) / .4), look: .1 }, sway(.5))); title('2004', at('big') + .1, 'white', 300, 110);
            if (t > at('her')) K.text('CALIFORNIA', { y: 410, size: 70, color: 'gold', scale: popIn(K, t, at('her')) }); }
          if (id === 'crowd') { face(D, 'happy', t); D.pose(Object.assign({ t, gesture: 'tada', gw: 1 }, sway(.5)));
            const n = Math.round(990000 * K.easeOut(K.clamp01((t - at('crowd')) / 1.6)) / 1000) * 1000;
            K.text(t < at('record') ? n.toLocaleString('en-US') + ' PEOPLE' : '198 DAYS', { y: 300, size: 88, color: 'gold', scale: t < at('record') ? 1 : popIn(K, t, at('record')) });
            if (t > at('record')) K.text('A RECORD', { y: 400, size: 70, scale: popIn(K, t, at('record') + .2) }); }
          if (id === 'but') { face(D, hungry ? 'worried' : 'smile', t); D.pose(Object.assign({ t, look: .15, gesture: hungry ? 'think' : undefined, gw: 1 }, sway(.4)));
            title(hungry ? 'BUFFET' : 'SHE KEPT GROWING', hungry ? at('buffet') : at('but') + .2, hungry ? 'red' : 'white'); }
          if (id === 'two') { face(D, 'worried', t); D.pose(Object.assign({ t, gesture: 'facepalm', gw: K.ease((t - at('two') - .3) / .4) }, sway(.3)));
            title('TWO DIDN’T MAKE IT', at('two') + .3, 'red', 300, 76); }
          break; }
        case 'roam': case 'closet': case 'mirror': {   // built to swim far: Africa → Australia → back. A tank is a closet. A big fish that needs the whole ocean.
          const a = K.img(...AFRICA), b = K.img(...AUS), pt = (u, back) => { const yb = back ? 90 : -70; return { x: K.lerp(a.x, b.x, u), y: K.lerp(a.y, b.y, u) + Math.sin(u * PI) * yb * s() }; };
          const draw = id === 'roam' ? K.clamp01((t - at('trip')) / (at('closet') - at('trip') - .3)) : 1;
          const N = 40; for (let k = 0; k < N; k++) { const g = k / N * 2; if (g > draw * 2) break; const back = g > 1, q = pt(back ? 2 - g : g, back);
            K.text('●', { x: q.x, y: q.y, size: 26, color: '#ffd23a', stroke: 0, shadow: false }); }
          if (id === 'roam') { if (draw > 0 && draw < 1) { const g = draw * 2, back = g > 1, q = pt(back ? 2 - g : g, back); K.prop('GW', { x: q.x, y: q.y, w: 180, flip: back }); }
            title(t < at('trip') + .3 ? 'BUILT TO SWIM FAR' : '20,000 KM', t < at('trip') + .3 ? at('roam') + .1 : at('trip') + .3);
            if (t > at('trip') + .3) K.text('IN 9 MONTHS', { y: 400, size: 66, scale: popIn(K, t, at('trip') + .6) }); }
          if (id === 'closet') { const k = popIn(K, t, at('closet'));
            K.prop('CLOSET', { x: 540, y: 1000, w: 620 * k });
            K.prop('GW', { x: 560, y: 1000, w: 640 * k, rot: -PI / 2 + .12 });
            title('A TANK = A CLOSET', at('closet') + .2, 'red', 300, 84); }
          if (id === 'mirror') { if (t < at('ocean')) title('JUST A BIG FISH?', at('mirror') + .1, 'white', 300, 92);
            else { K.text('A BIG FISH THAT NEEDS', { y: 300, size: 70, scale: popIn(K, t, at('ocean') - .3) }); K.text('THE WHOLE OCEAN', { y: 395, size: 100, color: 'gold', scale: popIn(K, t, at('ocean')) }); } }
          break; }
        case 'diy': case 'cta': {   // THE SIGNATURE GOODBYE: city sunset, the helicopter crosses, Doug looks up; then the follow CTA
          K.placeAt('doug', 360, 1270, .3); K.placeAt('gary', 680, 1240, -.3);
          const hu = t < at('cta') ? K.helicopter(t, 'diy', { y: 360, w: 520 }) : -1, up = hu < 0 ? 0 : Math.sin(PI * K.clamp01((hu - .05) / .85));
          face(D, up > .3 ? 'flat' : id === 'cta' ? 'smirk' : 'smile', t); D.pose(Object.assign({ t, nod: -.38 * up, gesture: id === 'cta' ? 'point' : 'hips', gw: id === 'cta' ? K.ease((Lc - .3) / .4) : 1 - up }, sway(1 - up)));
          face(G, id === 'cta' ? 'happy' : 'smile', t, 1); G.pose(Object.assign({ t, nod: -.2 * up }, sway(1 - up)));
          if (id === 'diy') { if (t < at('question')) title('NEXT AQUARIUM TRIP: LOOK', at('diy') + .2, 'gold', 520, 66);
            else { K.text('WOULD YOU SWIM', { y: 400, size: 76, scale: popIn(K, t, at('question')) }); K.text('WITH ONE?', { y: 485, size: 90, color: 'gold', scale: popIn(K, t, at('question') + .15) }); } }
          break; }
      }
    },
  };
})();
