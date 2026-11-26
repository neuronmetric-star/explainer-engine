// explainer-scene.js: the GENERIC scene runner for "Why do we X?" explainers (Brian, Nov 26 2026: "make the system, replicate on any new chat").
// It is not loaded directly. `node tools/make-scene.js <slug>` writes videos/<slug>/scene.js = `window.BEATS = <videos/<slug>/beats.json>;` + this file,
// so the existing stage (plate-stage.html + plate-kit.js) runs it unchanged. Everything in update() is a pure function of t.
// The beats file describes the video; see docs/explainer-system.md and docs/templates/beats.example.json (the yawn video, fully worked).
//
// beats.json (all cues are script.txt [#cues]; "cue+1.5" = 1.5 s after the cue):
//   banner, captionChunk, tail, lights{name:{key,hemi,front,shadow}}, plates{name:{img,hz,vx,fov0,camH,light}}, props{key:file}, cast{name:outfit|{...}}
//   shots[{at, plate, zoom:[a,b], focus:[[x,y],[x,y]]}]          one painting per idea; the camera moves in EVERY shot (zoom a != b)
//   shakes/flashes [[cue,dur,mag]]
//   actors[{who, from, to, placement:{type:'lying',x,y,z,ry,sc,pose?} (headOnly:true hides everything but the head; tilt = extra roll in radians, + lowers the head; or ix,iy = painted FLOOR pixel under the FEET + dx,dz offsets in metres, so a bed can be solved in pixels) | {type:'stand',ix,iy,ry}, idle:{face,look,tilt}, events:[{at,do,...}]}]
//        events: {do:'yawn', at, dur=1.6, hold?}  {do:'face', at, to, face}  {do:'gesture', at, to, gesture}  {do:'lookUp', at, to}
//   helicopter {at, y, w, dur}                                    the signature goodbye (K.helicopter); actors with lookUp look up while it crosses
//   overlays[{type, at, to?, ...}]  (to defaults to the end of the shot that contains `at`)
//        text     {text, size, color, x, y, rot, scale}
//        title    {lines:[{text,size,color,y}]}                    big title lines, fade in
//        counter  {start, value, dur, format:'{n} PEOPLE', size, color, y}   (start/value are numbers; `to` stays the end CUE)
//        steps    {items:['A','B'], times:[0,1.3], size, color, y}
//        flow     {rows:[[ix0,iy0,ix1,iy1],..], color, width, a}   flowing arrows between painting pixels
//        prop     {prop, pos:[ix,iy], w, pop, fadeAfter}           a green-screen prop placed on the painting (w in painting px)
//        bar      {x,y,len,label,keys:[[sec,frac],..], color, arrow}
//        ripple   {seats:[[ix,iy],..], text, step, life, size}     a text burst passing from seat to seat
//        gauge    {id}                                             draws gauges[id] (keyframes below)
//   gauges{id:{label,x,y0,y1,keys:[[cue,level],..]}}               level 0..1: red when hot, light blue when cool
(function () {
  const PI = Math.PI, B = window.BEATS;
  const COL = { gold: '#ffd23f', red: '#ff3b30', cool: '#8fd8ff', white: '#ffffff', ink: '#1c2a4a' };
  const colr = c => COL[c] || c || '#ffffff';
  const PRESET = { sunset: { key: [0xffb070, 2.6, [-12, 3, 2]], hemi: [0xffc8b0, 0x8a6a80, .8], front: [0xffe8dc, 1.0], shadow: [0x4a2a5a, .42] } };
  const plates = {};
  for (const [n, p] of Object.entries(B.plates)) plates[n] = Object.assign({ hz: .45, vx: .5, fov0: 55, camH: 1.6, light: 'day' }, p, { light: (B.lights && B.lights[p.light]) || PRESET[p.light] || p.light || 'day' });
  const cast = {}; for (const [n, v] of Object.entries(B.cast || {})) cast[n] = v;
  let shotEnds = null;   // computed once cue times exist

  window.SCENE = {
    banner: B.banner === undefined ? 'THE HECK?' : B.banner,
    whip: true,
    captionChunk: B.captionChunk === undefined ? 3 : B.captionChunk,
    plates, props: Object.assign({ H01: 'H01_helicopter.png' }, B.props || {}), cast,
    shots: B.shots.map(s => ({ at: s.at, plate: s.plate, zoom: s.zoom, focus: s.focus })),
    shakes: B.shakes || [], flashes: B.flashes || [], tail: B.tail === undefined ? 1.0 : B.tail,

    update(t, K) {
      const at = c => K.T(c), cl = K.clamp01, ease = K.ease, lerp = K.lerp, s = () => K.imgScale();
      const popIn = (from, dur = .35) => K.pop(cl((t - at(from)) / dur));
      if (!shotEnds) { const ts = B.shots.map(x => at(x.at)).sort((a, b) => a - b); shotEnds = x => { for (const v of ts) if (v > x + .001) return v; return 1e9; }; }
      Object.values(K.cast).forEach(c => c.root.rotation.set(0, 0, 0));
      const yawnPose = (ch, k, o = {}) => { ch.face(k > .25 ? 'surprised' : 'flat'); ch.pose(Object.assign({ t, nod: -.4 * k, lean: -.1 * k, armR: { raise: .95 * k }, armL: { raise: .95 * k }, handR: 'open', handL: 'open' }, o)); };
      const sway = k => ({ look: .06 * k * Math.sin(t * .7), tilt: .04 * k * Math.sin(t * .9 + 1) });

      // ---------------- the signature helicopter (drives the actors' look-up) ----------------
      let heliU = -1;
      if (B.helicopter) { heliU = K.helicopter(t, B.helicopter.at, { y: B.helicopter.y || 360, w: B.helicopter.w || 520, dur: B.helicopter.dur || 4.2 }); }
      const up = heliU < 0 ? 0 : Math.sin(PI * cl((heliU - .05) / .85));

      // ---------------- actors ----------------
      for (const a of B.actors || []) {
        const t0 = at(a.from), t1 = a.to ? at(a.to) : 1e9; if (t < t0 || t >= t1) continue;
        const ch = K.cast[a.who]; if (!ch) continue;
        const idle = a.idle || {}; let yk = 0, face = idle.face || 'flat', gesture = null, look = false;
        for (const e of a.events || []) {
          const e0 = at(e.at), e1 = e.to ? at(e.to) : e0 + (e.dur || 1.6);
          if (e.do === 'yawn') { const dur = e.dur || 1.6, u = (t - e0) / dur; if (e.hold) { const h = e.hold; yk = Math.max(yk, t < e0 ? 0 : t < e0 + h ? 1 : 1 - cl((t - e0 - h) / (e.fade || 1))); } else if (u >= 0 && u <= 1) yk = Math.max(yk, Math.sin(u * PI) ** .6); }
          else if (t >= e0 && t < e1) { if (e.do === 'face') face = e.face; else if (e.do === 'gesture') gesture = { g: e.gesture, w: ease((t - e0) / .4) }; else if (e.do === 'lookUp') look = true; }
        }
        const pl = a.placement || { type: 'stand', ix: 360, iy: 1270, ry: 0 };
        if (yk > .05) yawnPose(ch, Math.min(1, yk));
        else { ch.face(face); ch.pose(Object.assign({ t, nod: look ? -.38 * up : 0, look: idle.look || 0 }, gesture ? { gesture: gesture.g, gw: gesture.w * (1 - (look ? up : 0)) } : {}, sway(1 - (look ? up : 0) * .8))); }
        { const hide = pl.type === 'lying' && pl.headOnly;   // headOnly: the body is under a blanket, only the head shows (Brian, Nov 26: "whole body under the blanket, only head showing")
          ch.root.traverse(m => { if (!m.isMesh && !m.isSprite && !m.isLine) return; if (m.userData.v0 === undefined) m.userData.v0 = m.visible;
            let q = m, inHead = false; while (q) { if (q === ch.head) { inHead = true; break; } q = q.parent; }
            m.visible = hide ? (inHead && m.userData.v0) : m.userData.v0; }); }
        if (pl.type === 'lying') { let lx = pl.x, lz = pl.z; if (pl.ix !== undefined) { const fl = K.floorAt(pl.ix, pl.iy); lx = fl[0] + (pl.dx || 0); lz = fl[1] + (pl.dz || 0); } ch.root.position.set(lx, pl.y === undefined ? .9 : pl.y, lz); ch.root.rotation.set(0, pl.ry || 0, PI / 2 + (pl.tilt || 0)); ch.root.scale.setScalar(pl.sc || 1); ch.root.visible = true; ch.root.updateMatrixWorld(true); if (ch.blob) ch.blob.visible = false; }
        else K.placeAt(a.who, pl.ix, pl.iy, pl.ry || 0, pl.sc || 1);
      }

      // ---------------- gauges (heat gauge etc.) ----------------
      const gaugeLevel = g => { const ks = g.keys.map(k => [at(k[0]), k[1]]).sort((p, q) => p[0] - q[0]); if (t <= ks[0][0]) return ks[0][1]; for (let i = 1; i < ks.length; i++) if (t <= ks[i][0]) { const u = ease((t - ks[i - 1][0]) / (ks[i][0] - ks[i - 1][0])); return lerp(ks[i - 1][1], ks[i][1], u); } return ks[ks.length - 1][1]; };
      const drawGauge = g => { const lv = gaugeLevel(g), x = g.x || 950, y0 = g.y0 || 1700, y1 = g.y1 || 1330, h = (y0 - y1) * lv, col = lv > .55 ? COL.red : lv > .3 ? '#ffb347' : COL.cool;
        K.line(x, y0, x, y1, { color: COL.ink, width: 52, a: .75 }); K.line(x, y0, x, y0 - Math.max(2, h), { color: col, width: 36 });
        K.text(g.label || '', { x: x - 50, y: y0 + 55, size: 40, color: 'white' }); };

      // ---------------- overlays ----------------
      for (const o of B.overlays || []) {
        const t0 = at(o.at), t1 = o.to ? at(o.to) : shotEnds(t0); if (t < t0 || t >= t1) continue;
        const u = t - t0, sc = popIn(o.at);
        switch (o.type) {
          case 'text': K.text(o.text, { x: o.x, y: o.y || 300, size: o.size || 100, color: colr(o.color), rot: o.rot || 0, scale: sc, a: o.fade ? cl((t1 - t) / .3) : 1 }); break;
          case 'title': { const a = cl(u / .25) * cl((t1 - t) / .3); (o.lines || []).forEach((ln, i) => K.text(ln.text, { y: ln.y || 250 + i * 120, size: ln.size || 100, color: colr(ln.color), a, scale: .9 + .1 * K.pop(cl((u - i * .15) / .35)) })); break; }
          case 'counter': { const n = Math.round(lerp(o.start || 0, o.value, ease(u / (o.dur || 2.4)))); K.text((o.format || '{n}').replace('{n}', n.toLocaleString('en-US')), { y: o.y || 300, size: o.size || 120, color: colr(o.color), a: cl(u / .3) }); break; }
          case 'steps': { let i = 0; (o.times || []).forEach((tt, k) => { if (u >= tt) i = k; }); K.text(o.items[i], { y: o.y || 300, size: o.size || 100, color: colr(o.color), scale: sc }); break; }
          case 'flow': { const k = cl(u / .4) * (o.a === undefined ? 1 : o.a); (o.rows || []).forEach((r, i) => { const a = K.img(r[0], r[1]), b = K.img(r[2], r[3]); K.flow(t, a.x, a.y, b.x, b.y, { width: o.width || 12, color: colr(o.color || 'cool'), a: k, ph: i * .25 }); }); break; }
          case 'prop': { const k = K.easeOut(cl(u / (o.pop || .5))), fade = o.fadeAfter ? cl((t1 + o.fadeAfter - t) / .6) : 1, p = K.img(o.pos[0], o.pos[1]); K.prop(o.prop, { x: p.x, y: p.y, w: (o.w || 400) * s() * (.7 + .3 * k), a: k * fade, rot: o.rot || 0 }); break; }
          case 'bar': { const x0 = o.x || 200, y = o.y || 700, len = o.len || 400, ks = o.keys || [[0, 1]]; let f = ks[0][1]; for (let i = 1; i < ks.length; i++) if (u >= ks[i][0]) f = lerp(ks[i - 1][1], ks[i][1], ease((u - ks[i][0]) / (o.dur || .8))) ; K.line(x0, y, x0 + len, y, { color: COL.ink, width: 46, a: .75 }); K.line(x0, y, x0 + len * f, y, { color: colr(o.color || 'gold'), width: 30 });
            K.text(o.label || '', { x: x0 + 60, y: y - 56, size: 44 }); if (o.arrow) K.text(o.arrow, { x: x0 + len * f + 40, y, size: 60, color: 'red' }); break; }
          case 'ripple': (o.seats || []).forEach((q, i) => { const w = (t - t0 - i * (o.step || .35)) / (o.life || .9); if (w > 0 && w < 1) { const p = K.img(q[0], q[1] - 120); K.text(o.text || 'AAAH', { x: p.x, y: p.y - 60 * w, size: (o.size || 70) + 14 * Math.sin(w * PI), color: w < .5 ? '#ffffff' : COL.gold, a: Math.sin(w * PI), rot: (i % 2 ? .08 : -.08) }); } }); break;
          case 'gauge': drawGauge(B.gauges[o.id]); break;
        }
      }
    },
  };
})();
