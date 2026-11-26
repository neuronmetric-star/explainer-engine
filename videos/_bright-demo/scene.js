// Bright-look demo: sunny sky, matte ground, solid toy-like shapes with soft shadows.
window.SCENE = {
  distance: 1.5,
  build(K) {
    const { solid, group, person } = K; const S = this.s = {};
    const B = (w, h, d, x, y, z, c, p, o) => { const m = solid(new THREE.BoxGeometry(w, h, d), c, p, o); m.position.set(x, y, z); return m; };
    // rolling green hills
    for (const [x, z, r, h, c] of [[-6, -9, 5, 3.2, 0x6cc46a], [3, -11, 6, 4.2, 0x5bb45c], [9, -8, 4, 2.6, 0x7fd27a], [-1, -6, 3.5, 1.6, 0x86d983]]) {
      const m = solid(new THREE.SphereGeometry(r, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2), c, undefined, { rough: .9, metal: 0 }); m.position.set(x, 0, z); m.scale.y = h / r; }
    // the wall: blocks along a winding path, with crenellations
    S.wall = [];
    for (let i = 0; i < 42; i++) {
      const u = i / 41, x = -9 + u * 18, z = -1.5 - 2.6 * Math.sin(u * 5.2), y = .9 + .5 * Math.sin(u * 7);
      const g = group(x, 0, z); g.rotation.y = -Math.atan2(-2.6 * 5.2 * Math.cos(u * 5.2) / 18, 1);
      B(.5, y, .9, 0, y / 2, 0, 0xc9a77c, g, { rough: .85, metal: 0 });
      if (i % 2 === 0) { B(.18, .25, .18, 0, y + .12, .36, 0xb8946a, g, { rough: .85, metal: 0 }); B(.18, .25, .18, 0, y + .12, -.36, 0xb8946a, g, { rough: .85, metal: 0 }); }
      if (i % 10 === 5) { B(1.0, 1.2, 1.1, 0, y + .6, 0, 0xb8946a, g, { rough: .85, metal: 0 }); B(1.2, .2, 1.3, 0, y + 1.3, 0, 0xa0603a, g, { rough: .7, metal: 0 }); }
      S.wall.push(g); }
    // mascot
    S.guy = person(2.2, 2.6, { color: 0xff7a1a });
    // clouds
    S.clouds = []; for (let i = 0; i < 4; i++) { const c = group(-8 + i * 5.5, 7.5 + (i % 2), -10); for (let k = 0; k < 3; k++) { const s = solid(new THREE.SphereGeometry(.9 - k * .15, 20, 14), 0xffffff, c, { rough: 1, metal: 0, shadow: false }); s.position.x = k * .9 - .9; } S.clouds.push(c); }
  },
  shots: [[0, [2.5, 4.2, 12], [0.5, 2.0, -2], 1.4]],
  cards: [{ l: 'Great Wall of China', v: 'THOUSANDS OF MILES', a: [0.5, 6.2, -2], t0: 'hook+1.2', t1: 'cta' }],
  follow: { from: 'cta+0.2', title: 'WHY THE F*CK? · EXPLAINED' },
  update(t, K) { const S = this.s;
    S.wall.forEach((g, i) => { const k = K.easeOut(K.clamp01((t - i * .03) / .4)); g.scale.y = Math.max(.01, k); });
    S.clouds.forEach((c, i) => { c.position.x += 0; c.position.x = -8 + i * 5.5 + t * .3; });
    K.hop(S.guy, t, 'explain'); }
};
