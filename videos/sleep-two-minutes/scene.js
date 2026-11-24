// sleep-two-minutes · Body Heck ep. 1: "How do you fall asleep in 2 minutes?"
// Explainer tools (PLAYBOOK §8): K.hookReact + K.slam + flash (the hook), K.sit (Doug on the bed, Gary in the armchair),
// SCENE.whip, continuous camera on same-plate shots, color code (red = the alarm/danger, gold = the trick, white = breath).
// Bud Winter and the cadet are labeled reconstructions (invented likenesses). "Two minutes was never proven" is on screen too.
(function () {
  const PI = Math.PI;
  const face = (ch, name, t, off = 0) => ch.face(((t + off) % 4.1) < .12 && !['happy', 'blink', 'scream'].includes(name) ? 'blink' : name);
  const popIn = (K, t, from, dur = .35) => K.pop(K.clamp01((t - from) / dur));
  const ENDING = 'E01_city_sunset_ending.png';   // the series' signature goodbye (docs/assets)

  const L = {
    night: { key: [0xffc27a, 1.7, [10, 5, 4]], hemi: [0x7c88e0, 0x4a3a5a, .95], front: [0xb0b4ff, .75], shadow: [0x10103a, .42] },
    barracks: { key: [0xffc888, 1.6, [10, 6, 4]], hemi: [0xb8b0e8, 0x6a5650, .9], front: [0xffe6d6, .9], shadow: [0x2a2040, .38] },
    sunset: { key: [0xffb070, 2.6, [-12, 3, 2]], hemi: [0xffc8b0, 0x8a6a80, .8], front: [0xffe8dc, 1.0], shadow: [0x4a2a5a, .42] },
  };
  // B01 spots (image px): Doug on the bed edge, Gary in the armchair (feet on the floor in front of each seat)
  const DOUG = [285, 876], GARY = [776, 776], BELL = [300, 318], DOGBED = [540, 705];   // measured: bed edge floor line + mattress top ≈ .71 m; armchair seat ≈ .45 m

  window.SCENE = {
    banner: 'THE HECK?',
    whip: true,
    plates: {
      B01: { img: 'B01_bedroom_night.png', hz: .36, vx: .45, fov0: 55, camH: 1.6, light: L.night },
      B02: { img: 'B02_head_cutaway.png', hz: .5, vx: .5, fov0: 55, camH: 1.5, light: L.night },
      B03: { img: 'B03_navy_barracks_1943.png', hz: .38, vx: .5, fov0: 55, camH: 1.6, light: L.barracks },
      B04: { img: 'B04_calm_lake_canoe.png', hz: .5, vx: .5, fov0: 55, camH: 1.5, light: 'night' },
      E: { img: ENDING, hz: .45, vx: .5, fov0: 55, camH: 2.0, light: L.sunset },
    },
    props: { DOG: 'P01_guard_dog_awake.png', DOGZ: 'P02_guard_dog_asleep.png', SHEEP: 'P03_sheep.png', PLANE: 'P04_navy_biplane_1943.png', H01: 'H01_helicopter.png' },
    cast: { doug: 'hoodie', gary: 'oxford', coach: { outfit: 'polo', holdR: 'clipboard' }, cadet: { outfit: 'oxford', hat: 'pilot' } },
    shots: [
      { at: 'scream', plate: 'B01', zoom: [5.0, 1.25], focus: [[.775, .37], [.52, .47]] },     // THE HOOK: Gary's sleeping face huge → crash-zoom out
      { at: 'scream+0.55', plate: 'B01', zoom: [1.25, 1.22], focus: [[.52, .47], [.52, .48]] },  // hold the two-shot: Doug screams
      { at: 'q', plate: 'B01', zoom: [1.22, 1.3], focus: [[.52, .48], [.55, .5]] },
      { at: 'look', plate: 'B01', zoom: [1.3, 1.75], focus: [[.55, .5], [.76, .47]] },
      { at: 'doug', plate: 'B01', zoom: [1.75, 1.6], focus: [[.76, .47], [.3, .5]] },
      { at: 'doug+0.8', plate: 'B01', zoom: [1.6, 1.6], focus: [[.3, .5], [.3, .5]] },
      { at: 'card', plate: 'B01', zoom: [1.6, 1.7], focus: [[.3, .5], [.3, .48]] },
      { at: 'bet', plate: 'B01', zoom: [1.7, 1.9], focus: [[.3, .48], [.3, .47]] },
      { at: 'guard', plate: 'B02', zoom: [1.0, 1.25], focus: [[.5, .45], [.5, .43]] },
      { at: 'real', plate: 'B03', zoom: [1.05, 1.15], focus: [[.5, .5], [.5, .5]] },
      { at: 'melt', plate: 'B01', zoom: [1.9, 2.0], focus: [[.3, .42], [.3, .56]] },
      { at: 'picture', plate: 'B04', zoom: [1.0, 1.1], focus: [[.5, .45], [.5, .46]] },
      { at: 'down', plate: 'B02', zoom: [1.25, 1.35], focus: [[.5, .43], [.53, .45]] },
      { at: 'weeks', plate: 'B03', zoom: [1.15, 1.05], focus: [[.5, .5], [.5, .49]] },
      { at: 'mirror', plate: 'B01', zoom: [1.15, 1.22], focus: [[.52, .52], [.52, .52]] },
      { at: 'question', plate: 'E', zoom: [1.04, 1.1], focus: [[.5, .53], [.5, .5]] },
      { at: 'cta', plate: 'E', zoom: [1.1, 1.1], focus: [[.5, .5], [.5, .48]] },
    ],
    shakes: [['scream+0.28', .5, .8], ['wrong', .25, .3], ['tired+0.3', .3, .35]],
    flashes: [['scream+0.28', .18, .55]],
    tail: 1.0,

    update(t, K) {
      const id = K.shot.id.split('+')[0], Lc = K.shot.local, at = c => K.T(c), s = () => K.imgScale();
      const D = K.cast.doug, G = K.cast.gary;
      const sway = (k = 1) => ({ look: .06 * k * Math.sin(t * .7), tilt: .04 * k * Math.sin(t * .9 + 1) });
      const seat = (n, [ix, iy], dy, ry) => { const [x, z] = K.floorAt(ix, iy); return K.place(n, x, dy, z, ry); };
      const zzz = (ch, k = 1) => { const h = K.screenOf(ch.head); for (let i = 0; i < 3; i++) { const ph = (t * .45 + i / 3) % 1;
        K.text('Z', { x: h.x + 60 * k + ph * 120 * k, y: h.y - 90 * k - ph * 200 * k, size: (50 + 50 * ph) * k, color: '#cfe0ff', stroke: Math.round(8 * k), a: Math.sin(ph * PI) }); } };
      const garyAsleep = (fc = 'blink') => { seat('gary', GARY, -.47, -.6); G.face(fc);
        G.pose({ t, tilt: .22, nod: .14 + .02 * Math.sin(t * 1.3), lean: -.05 }); K.sit(G, 'down');
        for (const k of [-1, 1]) { G.leg[k].hip.rotation.set(-1.3, 0, 0); G.leg[k].knee.rotation.x = 1.3; } };   // feet down to the floor
      const dougOnBed = () => seat('doug', DOUG, -.21, .4);
      // Doug sits on the tall bed: thighs slope down so his feet reach the floor
      const dsit = () => { K.sit(D, 'down'); for (const k of [-1, 1]) { D.leg[k].hip.rotation.set(-1.0, 0, 0); D.leg[k].knee.rotation.x = 1.0; } };
      const clock = (str, color, from) => K.text(str, { y: 300, size: 64, color, w: 360, stroke: 0, shadow: false, bg: 'rgba(18,20,30,.85)', scale: popIn(K, t, from) });

      switch (id) {
        case 'scream': case 'q': case 'look': case 'doug': case 'card': case 'bet': case 'mirror': {
          garyAsleep();
          zzz(G, id === 'scream' && t < .35 ? 2.2 : 1);
          dougOnBed();
          if (id === 'scream') { K.hookReact(D, t, 'scream'); dsit(); K.slam('WHAT THE HECK?!', t, 'scream', { y: 330, size: 104, color: 'red' }); }
          else if (id === 'q') { face(D, 'surprised', t); D.pose(Object.assign({ t, look: -.45, armR: { raise: .25 }, gesture: 'point', gw: 1 }, sway(.5))); dsit();
            const a = K.clamp01((at('look') + .2 - t) / .3);
            K.text('HOW DO YOU FALL ASLEEP', { y: 290, size: 66, a, scale: .8 + .2 * popIn(K, t, at('q')) });
            K.text('IN 2 MINUTES?', { y: 385, size: 112, color: 'gold', a, scale: .8 + .2 * popIn(K, t, at('q') + .4) }); }
          else if (id === 'look') { face(D, 'flat', t); D.pose(Object.assign({ t, look: -.5 }, sway(.3))); dsit();
            if (t > at('out')) K.text('OUT COLD', { y: 300, size: 92, color: 'gold', scale: popIn(K, t, at('out')) }); }
          else if (id === 'doug') { D.face('flat'); D.pose({ t, nod: -.45, look: .05 }); dsit();   // wide awake, staring at the ceiling
            if (t > at('stare')) { clock('1:04 AM', '#fff', at('stare')); } }
          else if (id === 'card') { const ts = at('sheep'), tp = at('phone'), tf = at('flip');
            face(D, 'worried', t); D.pose(Object.assign({ t, gesture: t < ts ? 'think' : undefined, gw: 1, nod: t > tp && t < tf ? .25 : -.05,
              look: t > tf ? .35 * Math.sin((t - tf) * 9) * K.clamp01((at('bet') - t) / .3) : 0 }, sway(.4))); dsit();
            if (t > ts - .2 && t < tp + .6) { const h = K.screenOf(D.head);   // sheep hop over Doug's head, counted
              for (let i = 0; i < 3; i++) { const u = (t - ts + .2 - i * .35) / .9; if (u < 0 || u > 1) continue;
                K.prop('SHEEP', { x: K.lerp(h.x - 420, h.x + 420, u), y: h.y - 90 - 170 * Math.sin(u * PI), w: 400 });
                if (u > .5) K.text(String(i + 1), { x: h.x + 300, y: h.y - 300, size: 110, color: '#fff', a: K.clamp01((1 - u) * 4) }); } }
            if (t > tp - .1) clock('3:07 AM', 'red', tp - .1); }
          else if (id === 'bet') { face(D, t > at('wrong') ? 'worried' : 'smirk', t); D.pose(Object.assign({ t, gesture: t > at('wrong') ? 'facepalm' : 'shrug', gw: K.ease((Lc - .2) / .4) }, sway(.3))); dsit();
            if (t > at('wrong')) K.text('THE MISTAKE', { y: 300, size: 104, color: 'red', scale: popIn(K, t, at('wrong')), rot: -.04 }); }
          else if (id === 'mirror') { const tg = at('gary');
            face(D, 'worried', t); D.pose(Object.assign({ t, gesture: 'think', gw: 1 }, sway(.6))); dsit();
            if (t < tg) K.text('TRIED HARD', { y: 300, size: 92, color: 'red', scale: popIn(K, t, at('mirror') + .2) });
            else K.text('DID NOTHING', { y: 300, size: 92, color: 'gold', scale: popIn(K, t, tg) }); }
          break; }

        case 'guard': case 'down': {   // inside the head: the guard dog (awake = red alarm; asleep = calm gold)
          const b = K.img(...BELL), p = K.img(...DOGBED);
          if (id === 'guard') {
            const harder = t > at('harder'), barkT = t > at('bark') ? 3.2 : 2, hop = Math.abs(Math.sin(t * PI * barkT)) * (t > at('tight') ? 1 : .3);
            for (let i = 0; i < (harder ? 5 : 3); i++) { const ph = (t * (harder ? 1.6 : .9) + i / (harder ? 5 : 3)) % 1, r = (40 + ph * (harder ? 380 : 220)) * s();
              const N = 28; let prev = null; for (let k = 0; k <= N; k++) { const a = k / N * 2 * PI, q = { x: b.x + Math.cos(a) * r, y: b.y + Math.sin(a) * r };
                if (prev) K.line(prev.x, prev.y, q.x, q.y, { color: '#ff4a3d', width: 7, a: (1 - ph) * .85 }); prev = q; } }
            K.prop('DOG', { x: p.x, y: p.y - 70 * s() - 26 * hop * s(), w: 380 * s(), rot: .05 * Math.sin(t * 20) * (t > at('bark') ? 1 : 0) });
            if (t > at('tight') && t < at('harder')) K.text('DANGER!', { y: 300, size: 110, color: 'red', scale: popIn(K, t, at('tight')), rot: -.05 + .02 * Math.sin(t * 30) });
            if (harder) K.text('TRYING HARD = TIGHTER', { y: 300, size: 70, color: 'red', scale: popIn(K, t, at('harder')) });
          } else {
            const k = K.clamp01((t - at('down')) / 1.2);
            K.prop('DOGZ', { x: p.x, y: p.y - 20 * s() + 4 * Math.sin(t * 1.6), w: 420 * s() * (1 + .015 * Math.sin(t * 1.6)) });
            K.text('z', { x: p.x + 150 * s(), y: p.y - 150 * s() - ((t * 30) % 60), size: 60, color: '#cfe0ff', a: .8 });
            K.text('CALM', { y: 300, size: 110, color: 'gold', scale: popIn(K, t, at('down') + .2) });
          }
          break; }

        case 'real': case 'weeks': {   // WWII Navy pre-flight school (labeled reconstruction): the coach and a cadet
          const C = K.cast.coach, Cd = K.cast.cadet;
          K.placeAt('coach', 360, 1080, .5); K.placeAt('cadet', 700, 1050, -.5);
          if (id === 'real') {
            face(C, t > at('tired') ? 'worried' : 'flat', t); C.pose(Object.assign({ t, gesture: t > at('ww2') + 1.5 ? 'point' : undefined, gw: K.ease((t - at('ww2') - 1.5) / .4), look: .3 }, sway(.4)));
            face(Cd, 'worried', t, 1.3); Cd.pose(Object.assign({ t, look: -.3, lean: .04 }, sway(.6)));
            if (t > at('ww2') && t < at('ww2') + 2.2) K.text('WORLD WAR 2', { y: 300, size: 90, scale: popIn(K, t, at('ww2')) });
            if (t > at('ww2') + 2.2 && t < at('tired')) K.text('COACH BUD WINTER', { y: 300, size: 80, color: 'gold', scale: popIn(K, t, at('ww2') + 2.2) });
            if (t > at('tired')) { const u = (t - at('tired')) / 1.9; if (u < 1) K.prop('PLANE', { x: K.lerp(1300, -300, u), y: 470 + 50 * Math.sin(u * PI * 3), w: 400, rot: .25 * Math.sin(u * PI * 3) });
              K.text('TIRED PILOTS CRASH', { y: 300, size: 80, color: 'red', scale: popIn(K, t, at('tired') + .1) }); }
          } else {
            face(C, 'smile', t); C.pose(Object.assign({ t, gesture: 'tada', gw: K.ease(Lc / .5) }, sway(.4)));
            face(Cd, t > at('help') ? 'happy' : 'smile', t, 1.3); Cd.pose(Object.assign({ t, look: -.3 }, sway(.6)));
            if (t < at('proof')) { K.text('6 WEEKS', { y: 285, size: 112, color: 'gold', scale: popIn(K, t, at('weeks') + .3) });
              K.text('96% (HIS BOOK)', { y: 385, size: 52, color: '#fff', scale: popIn(K, t, at('weeks') + 1.6) }); }
            else if (t < at('help')) K.text('2 MINUTES? NOT PROVEN', { y: 300, size: 66, scale: popIn(K, t, at('proof')) });
            else K.text('A LOOSE BODY HELPS', { y: 300, size: 74, color: 'gold', scale: popIn(K, t, at('help')) });
          }
          break; }

        case 'melt': {   // THE TRICK: a gold glow walks down Doug's body; each part goes loose as it passes
          garyAsleep(); dougOnBed();
          const tf = at('face'), ts = at('shoulders'), ta = at('arms'), tb = at('breathe'), tl = at('legs');
          const loose = k => K.ease(K.clamp01((t - k) / .8));
          D.face(t > tf ? (t > tb ? 'blink' : 'smile') : 'flat');
          D.pose({ t, nod: .12 * loose(tf) + .08 * loose(tb), tilt: .1 * loose(tf), lean: .06 * loose(ts), armR: { raise: -.05 * loose(ta) }, armL: { raise: -.05 * loose(ta) }, handR: 'relaxed', handL: 'relaxed' });
          D.root.position.y -= .05 * loose(ts);   // shoulders drop
          dsit();
          const part = t < ts ? D.head : t < ta ? D.neck : t < tl ? D.arm[1].el : D.leg[1].knee, h = K.screenOf(part), g = t < tf ? 0 : 1;
          for (let r = 0; r < 3; r++) { const N = 36, rad = (part === D.head ? 150 : 95) + r * 26 + 8 * Math.sin(t * 5); let prev = null;   // a pulsing gold halo on the part that melts now
            for (let k = 0; k <= N; k++) { const a = k / N * 2 * PI, q = { x: h.x + Math.cos(a) * rad, y: h.y + Math.sin(a) * rad * .8 }; if (prev) K.line(prev.x, prev.y, q.x, q.y, { color: 'gold', width: 8 - r * 2, a: g * (.85 - r * .25) }); prev = q; } }
          const lab = t < tf ? 'MELT, TOP TO BOTTOM' : t < ts ? 'FACE' : t < ta ? 'SHOULDERS' : t < tb ? 'ARMS' : t < tl ? 'BREATHE OUT' : 'LEGS';
          const lt = t < tf ? at('melt') : t < ts ? tf : t < ta ? ts : t < tb ? ta : t < tl ? tb : tl;
          K.text(lab, { y: 300, size: lab.length > 12 ? 70 : 104, color: 'gold', scale: popIn(K, t, lt) });
          if (t > tb && t < tl + .5) { const m = K.screenOf(D.head); for (let i = 0; i < 3; i++) K.flow(t, m.x + 70, m.y + 30 + i * 20, m.x + 300, m.y + 60 + i * 50, { width: 9, a: .8 * K.clamp01((t - tb) / .4), ph: i * .3, speed: .6 }); }
          break; }

        case 'picture': {   // one boring picture: nothing moves but the water (and a 10-second ring fills)
          const c = K.img(560, 790);
          for (let i = 0; i < 3; i++) { const ph = (t * .25 + i / 3) % 1, rx = (120 + ph * 260) * s(), ry = rx * .18; let prev = null;
            for (let k = 0; k <= 30; k++) { const a = k / 30 * 2 * PI, q = { x: c.x + Math.cos(a) * rx, y: c.y + 40 * s() + Math.sin(a) * ry }; if (prev) K.line(prev.x, prev.y, q.x, q.y, { color: '#e8e4ff', width: 3, a: (1 - ph) * .5 }); prev = q; } }
          if (t > at('canoe')) { const u = K.clamp01((t - at('canoe')) / 2.6), N = 40; let prev = null;
            for (let k = 0; k <= N * u; k++) { const a = k / N * 2 * PI - PI / 2, q = { x: 540 + Math.cos(a) * 70, y: 420 + Math.sin(a) * 70 }; if (prev) K.line(prev.x, prev.y, q.x, q.y, { color: 'gold', width: 12 }); prev = q; }
            K.text('10 SEC', { y: 420, size: 40, color: '#fff', stroke: 6 }); }
          K.text('ONE BORING PICTURE', { y: 300, size: 74, color: 'gold', scale: popIn(K, t, at('picture') + .2), a: K.clamp01((at('canoe') - t) / .3) });
          break; }

        case 'question': case 'cta': {   // THE SIGNATURE GOODBYE: the city sunset, the helicopter crosses, Gary (the winner) looks up
          K.placeAt('doug', 360, 1270, .3); K.placeAt('gary', 680, 1240, -.3);
          const hu = t < at('cta') ? K.helicopter(t, 'question', { y: 360, w: 520 }) : -1, up = hu < 0 ? 0 : Math.sin(PI * K.clamp01((hu - .05) / .85));
          face(G, up > .3 ? 'flat' : id === 'cta' ? 'smirk' : 'smile', t, 1); G.pose(Object.assign({ t, nod: -.38 * up, gesture: id === 'cta' ? 'point' : 'hips', gw: id === 'cta' ? K.ease((Lc - .3) / .4) : 1 - up }, sway(1 - up)));
          face(D, id === 'cta' ? 'happy' : 'smile', t); D.pose(Object.assign({ t, nod: -.2 * up }, sway(1 - up)));
          if (id === 'question') K.text('TONIGHT, TRY IT', { y: 430, size: 84, color: 'gold', scale: popIn(K, t, at('question') + .2) });
          break; }
      }
    },
  };
})();
