// rich-get-richer · Money Heck: "Why do the poor get poorer and the rich get richer?"
// Explainer, track one object: THE DOLLAR (R01 bill, gold glow) from Doug's overdraft to the bank to Victor's payday.
// Tools (PLAYBOOK §8): crash-zoom hook on the money tower (B03, the cutaway that grows), K.hookReact, K.flow (money = gold, loss = red),
// SCENE.whip, helicopter ending with Victor (the winner) looking up. Not advice: the words describe how money moves.
(function () {
  const PI = Math.PI;
  const face = (ch, name, t, off = 0) => ch.face(((t + off) % 4.1) < .12 && !['happy', 'scream', 'blink'].includes(name) ? 'blink' : name);
  const popIn = (K, t, from, dur = .35) => K.pop(K.clamp01((t - from) / dur));
  const ENDING = 'E01_city_sunset_ending.png';   // the signature goodbye (docs/assets)
  const GOLD = '#ffd23a', RED = '#ff4a3d';
  const L = {
    cafe: { key: [0xffc888, 2.2, [-12, 6, 4]], hemi: [0xffd8b0, 0x8a5a40, .85], front: [0xffe6d6, 1.0], shadow: [0x4a2a3a, .38] },
    rain: { key: [0x9ab0ff, 1.2, [-6, 9, 4]], hemi: [0x7080c8, 0x403050, .95], front: [0xffb070, .7], shadow: [0x0a1030, .45] },
    tower: { key: [0xffd8b0, 1.8, [-8, 6, 6]], hemi: [0xd8c8ff, 0x6a5a70, .9], front: [0xffe8dc, 1.0], shadow: [0x2a2040, .35] },
    gold: { key: [0xffb070, 2.4, [4, 5, -8]], hemi: [0xffd0a8, 0x7a5a50, .9], front: [0xffe8d8, 1.1], shadow: [0x4a2a3a, .4] },
    sunset: { key: [0xffb070, 2.6, [-12, 3, 2]], hemi: [0xffc8b0, 0x8a6a80, .8], front: [0xffe8dc, 1.0], shadow: [0x4a2a5a, .42] },
  };
  // B03 money tower (image px): the pipe path from the street-level ATM up through the vault to the penthouse
  const PIPE = [[820, 1150], [862, 1064], [930, 1000], [930, 790], [900, 764], [930, 730], [930, 300], [880, 224], [800, 250]];
  const ATM = [820, 1144], VAULT = [650, 770], PENT = [520, 420], STREET = [300, 1300];
  const READER = [560, 735];   // B01: the card reader on the counter

  // a point along a polyline at u (0..1)
  const along = (P, u) => { const seg = []; let tot = 0; for (let i = 1; i < P.length; i++) { const d = Math.hypot(P[i][0] - P[i - 1][0], P[i][1] - P[i - 1][1]); seg.push(d); tot += d; }
    let L0 = u * tot; for (let i = 0; i < seg.length; i++) { if (L0 <= seg[i]) { const k = L0 / seg[i]; return [P[i][0] + (P[i + 1][0] - P[i][0]) * k, P[i][1] + (P[i + 1][1] - P[i][1]) * k]; } L0 -= seg[i]; }
    return P[P.length - 1]; };

  window.SCENE = {
    banner: 'THE HECK?',
    whip: true,
    plates: {
      B01: { img: 'B01_coffee_shop.png', hz: .42, vx: .45, fov0: 55, camH: 2.4, light: L.cafe },
      B02: { img: 'B02_roadside_rain.png', hz: .32, vx: .62, fov0: 55, camH: 1.8, light: L.rain },
      B03: { img: 'B03_money_tower_cutaway.png', hz: .2, vx: .5, fov0: 55, camH: 1.6, light: L.tower },
      B04: { img: 'B04_penthouse_golden.png', hz: .38, vx: .55, fov0: 55, camH: 1.9, light: L.gold },
      E: { img: ENDING, hz: .45, vx: .5, fov0: 55, camH: 2.0, light: L.sunset },
    },
    props: { BILL: 'R01_dollar_bill.cut.png', CASH: 'R02_cash_pile.png', PHONE: 'R03_phone_blank.png', CUP: 'P01_coffee_cup.png', READER: 'P02_card_reader.png',
      RECEIPT: 'P03_receipt.png', CARD: 'P04_credit_card.png', SNOW: 'P05_snowball.png', H01: 'H01_helicopter.png' },
    cast: { doug: 'hoodie', victor: 'suit' },
    shots: [
      { at: 'q', plate: 'B03', zoom: [5.0, 1.0], focus: [[.8, .745], [.5, .5]] },            // THE HOOK: the dollar huge at the ATM → crash-zoom out: the whole tower
      { at: 'q+0.55', plate: 'B03', zoom: [1.0, 1.0], focus: [[.5, .5], [.5, .5]] },
      { at: 'follow', plate: 'B03', zoom: [1.0, 1.3], focus: [[.5, .5], [.55, .3]] },        // tilt up with the dollar to the penthouse
      { at: 'card', plate: 'B01', zoom: [1.15, 1.2], focus: [[.4, .58], [.42, .57]] },         // the coffee shop
      { at: 'tap', plate: 'B01', zoom: [1.2, 1.45], focus: [[.42, .57], [.48, .52]] },
      { at: 'fee', plate: 'B01', zoom: [1.45, 1.3], focus: [[.48, .52], [.45, .56]] },
      { at: 'forty', plate: 'B01', zoom: [1.3, 1.2], focus: [[.45, .56], [.42, .57]] },
      { at: 'car', plate: 'B02', zoom: [1.1, 1.3], focus: [[.6, .5], [.6, .55]] },           // the rainy roadside
      { at: 'victor', plate: 'B04', zoom: [1.25, 1.35], focus: [[.45, .55], [.47, .56]] },   // the penthouse
      { at: 'where', plate: 'B03', zoom: [1.5, 1.5], focus: [[.65, .82], [.65, .5]] },       // follow the $35 up the pipe into the bank
      { at: 'stock', plate: 'B03', zoom: [1.5, 1.6], focus: [[.65, .5], [.6, .5]] },
      { at: 'reveal', plate: 'B04', zoom: [1.3, 1.55], focus: [[.47, .56], [.47, .55]] },    // payday
      { at: 'pays', plate: 'B03', zoom: [1.0, 1.0], focus: [[.5, .5], [.5, .5]] },           // the whole tower
      { at: 'snow', plate: 'B03', zoom: [1.0, 1.06], focus: [[.5, .5], [.5, .5]] },
      { at: 'mirror', plate: 'B03', zoom: [1.06, 1.0], focus: [[.5, .5], [.5, .5]] },
      { at: 'diy', plate: 'E', zoom: [1.04, 1.1], focus: [[.5, .53], [.5, .5]] },            // the signature goodbye
      { at: 'cta', plate: 'E', zoom: [1.1, 1.1], focus: [[.5, .5], [.5, .48]] },
    ],
    shakes: [['q+0.28', .5, .8], ['fee', .3, .4], ['now', .25, .3], ['payday', .3, .4]],
    flashes: [['q+0.28', .18, .55], ['payday', .12, .4]],
    follow: { from: 'cta+0.3' },
    tail: 1.0,

    update(t, K) {
      const id = K.shot.id.split('+')[0], Lc = K.shot.local, at = c => K.T(c), s = () => K.imgScale();
      const D = K.cast.doug, V = K.cast.victor;
      const sway = (k = 1) => ({ look: .06 * k * Math.sin(t * .7), tilt: .04 * k * Math.sin(t * .9 + 1) });
      const ip = (k, ix, iy, w, o = {}) => { const p = K.img(ix, iy); return K.prop(k, Object.assign({ x: p.x, y: p.y, w: w * s() }, o)); };
      const title = (str, from, color = 'gold', y = 300, size = 84) => K.text(str, { y, size, color, scale: popIn(K, t, from) });
      const chip = (str, x, y, color, from, size = 60) => K.text(str, { x, y, size, color, scale: popIn(K, t, from) });
      // the tracked dollar: the bill with a gold glow
      const bill = (x, y, w, rot = 0, a = 1) => { K.text('●', { x, y, size: w * 1.25, color: 'rgba(255,210,58,.35)', stroke: 0, shadow: false, a });
        K.prop('BILL', { x, y, w, rot, a }); };
      // the dollar riding the pipe (u 0..1 along PIPE, image px)
      const billOnPipe = (u, w = 150) => { const [x, y] = along(PIPE, u), p = K.img(x, y); bill(p.x, p.y, w * s(), Math.sin(t * 8) * .1); return p; };
      const pipeGlow = (u0, u1, color = GOLD) => { for (let k = 0; k < 18; k++) { const u = u0 + (u1 - u0) * (((t * .9 + k / 18) % 1)); const [x, y] = along(PIPE, u), p = K.img(x, y);
        K.text('●', { x: p.x, y: p.y, size: 20 * s() * 1.4, color, stroke: 0, shadow: false, a: .85 }); } };
      // tower cast: tiny people on the cutaway floors (straight-on drawing: placeAt + scale)
      const dougStreet = () => K.placeAt('doug', 290, 1395, .2, .24);
      const victorTop = () => K.placeAt('victor', 360, 540, .2, .85);
      const pie = (x, y, r, from) => { const k = popIn(K, t, from), out = 22 * K.ease((t - from - .5) / .4);   // a whole "company" pie with one slice pulled out
        for (let a = .25; a < 2 * PI; a += .045) K.line(x, y, x + Math.cos(a) * r * k, y + Math.sin(a) * r * k, { color: '#2f9e5a', width: 9 });
        for (let a = -.02; a < .25; a += .045) { const cx = x + Math.cos(.12) * out, cy = y + Math.sin(.12) * out; K.line(cx, cy, cx + Math.cos(a) * r * k, cy + Math.sin(a) * r * k, { color: GOLD, width: 9 }); } };

      switch (id) {
        case 'q': case 'follow': {   // THE HOOK: the dollar at the ATM → crash-zoom out → it rolls UP the pipe to the penthouse; Doug screams at street level
          dougStreet(); victorTop();
          if (id === 'q') K.hookReact(D, t, 'q', { look: .4 });
          else { face(D, 'worried', t); D.pose(Object.assign({ t, look: .4, nod: -.25 }, sway(.3))); }
          face(V, t > at('uphill') ? 'happy' : 'smirk', t, 1); V.pose(Object.assign({ t, gesture: t > at('uphill') ? 'tada' : 'hips', gw: 1 }, sway(.4)));
          const u = K.clamp01((t - at('q') - .35) / (at('uphill') + .6 - at('q') - .35));
          if (u < 1) { if (t < at('q') + .35) { const p = K.img(...ATM); bill(p.x, p.y, 150 * s()); } else billOnPipe(u); pipeGlow(0, u); }
          else { const p = K.img(PENT[0] + 120, PENT[1] + 60); bill(p.x, p.y, 150 * s(), -.1); }
          if (t > at('q') + .4 && t < at('uphill')) { K.text('WHY DO THE POOR GET POORER', { y: 300, size: 58, scale: popIn(K, t, at('q') + .4) });
            K.text('AND THE RICH GET RICHER?', { y: 380, size: 66, color: 'gold', scale: popIn(K, t, at('q') + .7) }); }
          if (t > at('uphill')) title('IT ROLLS UPHILL', at('uphill'), 'gold', 300, 96);
          break; }
        case 'card': case 'tap': case 'fee': case 'forty': {   // the coffee shop: $3 in the bank, a $5 coffee, tap, approved… then the $35 fee
          K.placeAt('doug', 300, 1180, .35);
          const cup = K.img(470, 700);
          if (id === 'card') { face(D, t > at('three') ? 'worried' : 'smile', t); D.pose(Object.assign({ t, look: .3 }, sway(.5)));
            if (t > at('three')) chip('BANK: $3', 300, 420, 'red', at('three'));
            if (t > at('coffee')) { K.prop('CUP', { x: cup.x + 40, y: cup.y - 40, w: 300 * popIn(K, t, at('coffee')) }); chip('$5', cup.x - 60, cup.y + 40, 'gold', at('coffee') + .2, 64); }
            title('DOUG', at('card') + .1, 'white', 300, 80); }
          if (id === 'tap') { const ok = t > at('beep'), r = K.img(...READER);
            face(D, t > at('bet') ? 'happy' : 'smile', t); D.pose(Object.assign({ t, gesture: t > at('bet') ? 'tada' : 'point', gw: K.ease((Lc - .1) / .4), look: .35 }, sway(.4)));
            K.prop('READER', { x: r.x, y: r.y - 50 * s(), w: 170 * s() });
            K.text(ok ? 'APPROVED' : '…', { x: r.x + 3 * s(), y: r.y - 77 * s(), size: 19 * s(), color: ok ? '#1d9e4a' : '#333', stroke: 0, shadow: false });
            if (ok) title('APPROVED!', at('beep'), 'gold', 300, 96);
            if (t > at('bet')) K.text('LOOKS LIKE A WIN', { y: 400, size: 60, scale: popIn(K, t, at('bet') + .3) }); }
          if (id === 'fee') { face(D, 'surprised', t); D.pose(Object.assign({ t, lean: -.08, armR: { raise: .5 }, armL: { raise: .5 }, handR: 'open', handL: 'open' }, sway(.3)));
            const pull = K.easeOut(K.clamp01((t - at('fee')) / .6)), r = K.img(...READER);
            K.prop('RECEIPT', { x: r.x + 60 * s(), y: r.y - 40 * s() + 180 * pull, w: 300 * s(), rot: .06 });
            K.text('−$35 FEE', { x: r.x + 60 * s(), y: r.y - 40 * s() + 110 * pull, size: 30 * s(), color: RED, stroke: 6, rot: .06, a: pull });
            K.slam('$35 FEE', t, at('fee'), { y: 300, size: 110, color: 'red' });
            if (t > at('short')) chip('FOR BEING $2 SHORT', 540, 400, 'white', at('short'), 56);
            if (t > at('what')) { chip('OVERDRAFT FEE', 540, 480, 'gold', at('what'), 66); } }
          if (id === 'forty') { const flip = t > at('now');
            face(D, flip ? 'worried' : 'flat', t); D.pose(Object.assign({ t, gesture: flip ? 'facepalm' : undefined, gw: K.ease((t - at('now') - .2) / .4) }, sway(.3)));
            K.prop('CUP', { x: cup.x + 40, y: cup.y - 40, w: 300 });
            K.text(flip ? '$40' : '$5', { x: cup.x - 60, y: cup.y + 40, size: flip ? 110 : 64, color: flip ? 'red' : 'gold', scale: flip ? popIn(K, t, at('now')) : 1 });
            title('SAME COFFEE', at('forty'), 'white', 300, 84);
            if (t > at('good')) K.text('GREAT COFFEE, THOUGH?', { y: 400, size: 56, scale: popIn(K, t, at('good')) }); }
          break; }
        case 'car': {   // the car breaks; no savings → credit card; interest = rent on borrowed money; about a fifth extra a year
          K.placeAt('doug', 560, 1040, -.3); face(D, 'worried', t); D.pose(Object.assign({ t, look: -.4, gesture: t > at('nosave') ? 'shrug' : 'think', gw: 1 }, sway(.3)));
          for (let k = 0; k < 14; k++) { const x = ((k * 97 + t * 40) % 1080), y = ((k * 211 + t * 1500) % 1920); K.line(x, y, x - 8, y + 50, { color: 'rgba(200,215,255,.45)', width: 3 }); }
          title('CAR BROKE', at('car') + .1, 'red', 300, 96);
          if (t > at('nosave')) { const k = popIn(K, t, at('nosave')); K.prop('CARD', { x: 820, y: 560, w: 360 * k, rot: -.12 }); K.text('NO SAVINGS', { y: 400, size: 62, scale: k }); }
          if (t > at('interest')) { chip('INTEREST = RENT ON MONEY', 540, 1450, 'gold', at('interest'), 56); }
          if (t > at('fifth')) { const g = K.clamp01((t - at('fifth')) / 1.6), d = Math.round(1000 + 220 * g);
            K.text('$' + d.toLocaleString('en-US'), { x: 820, y: 720, size: 76, color: 'red', scale: popIn(K, t, at('fifth')) });
            chip('+ A FIFTH A YEAR', 820, 800, 'red', at('fifth') + .2, 44); }
          break; }
        case 'victor': case 'reveal': {   // Victor pays from savings: no fee · later: Doug's fee became Victor's payday
          K.placeAt('victor', 470, 1010, .1);
          if (id === 'victor') { face(V, 'smirk', t); V.pose(Object.assign({ t, gesture: t > at('nofee') ? 'cross' : 'hips', gw: 1 }, sway(.4)));
            title('VICTOR', at('victor') + .1, 'white', 300, 80);
            if (t > at('savings')) { const k = popIn(K, t, at('savings')); ip('CASH', 760, 860, 380 * k); chip('SAVINGS', 540, 400, 'gold', at('savings'), 62); }
            if (t > at('nofee')) K.slam('NO FEE', t, at('nofee'), { y: 480, size: 100, color: 'gold' }); }
          else { const land = K.easeOut(K.clamp01((t - at('payday') + .4) / .7));
            face(V, t > at('payday') ? 'happy' : 'smile', t); V.pose(Object.assign({ t, gesture: t > at('payday') ? 'tada' : 'hips', gw: K.ease((t - at('payday')) / .3) }, sway(.4)));
            const p = K.img(610, 760); bill(p.x, K.lerp(-100, p.y, land), 220, Math.sin(t * 5) * .15 * (1 - land));
            title('PEOPLE LIKE VICTOR', at('reveal') + .1, 'white', 300, 70);
            if (t > at('payday')) K.slam('PAYDAY', t, at('payday'), { y: 400, size: 130, color: 'gold' }); }
          break; }
        case 'where': case 'stock': {   // where did the $35 go? up the pipe into the bank; the bank pays its owners; stock = a tiny piece; most stock → richest 10%
          dougStreet(); face(D, 'worried', t); D.pose(Object.assign({ t, look: .3, nod: -.2 }, sway(.3)));
          if (id === 'where') { const u = K.clamp01((t - at('where') - .3) / (at('owners') - at('where') - .3)) * .55;
            if (t < at('owners')) { billOnPipe(u, 180); pipeGlow(0, u); }
            else { const v = .55 + .45 * K.clamp01((t - at('owners')) / 1.2); billOnPipe(v, 180); pipeGlow(.55, v); }
            title(t < at('bank') ? 'WHERE DID THE $35 GO?' : t < at('owners') ? 'THE BANK' : 'THE BANK PAYS ITS OWNERS', t < at('bank') ? at('where') : t < at('owners') ? at('bank') : at('owners'), t < at('bank') ? 'white' : 'gold', 300, t < at('owners') ? 84 : 64); }
          else { const v = K.img(...VAULT);
            pie(v.x - 40, v.y - 20, 130, at('piece'));
            if (t > at('piece') + .5) chip('STOCK = A TINY PIECE', 540, 300, 'gold', at('piece') + .5, 64);
            if (t > at('most')) { for (let i = 0; i < 10; i++) { const x = 540 + (i - 4.5) * 86; K.text('●', { x, y: 1580, size: 110, color: i === 9 ? GOLD : '#d8d8e0', stroke: 8, scale: popIn(K, t, at('most') + i * .05) }); }
              chip('RICHEST 10% OWN MOST STOCK', 540, 1470, 'gold', at('most') + .4, 54); }
            else title('WHO OWNS A BANK?', at('stock'), 'white', 300, 84); }
          break; }
        case 'pays': case 'snow': case 'mirror': {   // the whole tower: Doug pays the fees, Victor owns the collector; it snowballs both ways; coffee vs a piece of the bank
          dougStreet(); victorTop(); pipeGlow(0, 1);
          const dp = K.img(STREET[0] + 160, STREET[1] - 80), vp = K.img(PENT[0] + 180, PENT[1] + 20);
          if (id === 'pays') { face(D, 'worried', t); D.pose(Object.assign({ t, look: .3 }, sway(.3))); face(V, 'smirk', t, 1); V.pose(Object.assign({ t, gesture: 'hips', gw: 1 }, sway(.4)));
            chip('PAYS THE FEES', dp.x + 200, dp.y - 60, 'red', at('pays'), 52); if (t > at('owns')) { chip('OWNS THE', 790, vp.y - 140, 'gold', at('owns'), 52); chip('COLLECTOR', 790, vp.y - 80, 'gold', at('owns') + .1, 52); } }
          if (id === 'snow') { const g = K.clamp01((t - at('debt')) / 2.5);
            face(D, 'worried', t); D.pose(Object.assign({ t, gesture: 'facepalm', gw: K.ease((t - at('debt')) / .4) }, sway(.3))); face(V, 'happy', t, 1); V.pose(Object.assign({ t, gesture: 'tada', gw: K.ease((t - at('grows')) / .4) }, sway(.4)));
            title('IT SNOWBALLS', at('snow'), 'white', 300, 90);
            if (t > at('debt')) { K.prop('SNOW', { x: dp.x + 40, y: dp.y - 30 * g, w: (160 + 260 * g), rot: t * 1.5 }); chip('DEBT', dp.x + 40, dp.y + 90, 'red', at('debt'), 50); }
            if (t > at('grows')) { const k = K.clamp01((t - at('grows')) / 2); K.prop('CASH', { x: vp.x, y: vp.y - 60 * k, w: 180 + 200 * k }); chip('~10% A YEAR (AVG)', 540, 400, 'gold', at('grows') + .3, 52); } }
          if (id === 'mirror') { face(D, 'flat', t); D.pose(Object.assign({ t }, sway(.3))); face(V, 'smirk', t, 1); V.pose(Object.assign({ t, gesture: 'cross', gw: 1 }, sway(.4)));
            K.prop('CUP', { x: dp.x + 30, y: dp.y - 20, w: 200 * popIn(K, t, at('mirror')) });
            if (t > at('bought')) { const v = K.img(...VAULT); pie(v.x - 40, v.y - 20, 120, at('bought')); chip('A PIECE OF THE BANK', 540, 300, 'gold', at('bought') + .2, 70); }
            else title('A COFFEE', at('mirror') + .1, 'white', 300, 90); }
          break; }
        case 'diy': case 'cta': {   // THE SIGNATURE GOODBYE: city sunset, the helicopter crosses, Victor (the winner) looks up; then the follow CTA
          K.placeAt('doug', 360, 1270, .3); K.placeAt('victor', 680, 1240, -.3);
          const hu = t < at('cta') ? K.helicopter(t, 'diy', { y: 360, w: 520 }) : -1, up = hu < 0 ? 0 : Math.sin(PI * K.clamp01((hu - .05) / .85));
          face(V, up > .3 ? 'flat' : id === 'cta' ? 'smirk' : 'smile', t, 1); V.pose(Object.assign({ t, nod: -.38 * up, gesture: id === 'cta' ? 'cross' : 'hips', gw: id === 'cta' ? 1 : 1 - up }, sway(1 - up)));
          face(D, id === 'cta' ? 'happy' : 'smile', t); D.pose(Object.assign({ t, nod: -.2 * up, gesture: id === 'cta' ? 'point' : undefined, gw: K.ease((Lc - .3) / .4) }, sway(1 - up)));
          if (id === 'diy') { const k = popIn(K, t, at('diy') + .2); K.prop('PHONE', { x: 540, y: 1030, w: 170 * k, rot: -.05 });
            K.text('SEARCH:\n"FEE"', { x: 540, y: 1000, size: 30, color: '#1c2a4a', stroke: 0, shadow: false, scale: k, rot: -.05 });
            if (t > at('question')) { K.text('HOW MANY?', { y: 480, size: 84, scale: popIn(K, t, at('question')) }); K.text('ONE NUMBER', { y: 565, size: 66, color: 'gold', scale: popIn(K, t, at('question') + .2) }); } }
          break; }
      }
    },
  };
})();
