// Demo: real 3D characters (Quaternius, CC0) — marching knight army + king & queen in front of a village.
window.SCENE = {
  distance: 1.5,
  models: {
    knight: 'quaternius/characters/Knight.glb', helmet: 'quaternius/weapons/Helmet1.glb',
    king: 'quaternius/characters/Man_King.glb',
    queen: 'quaternius/characters/Woman_Medieval.glb',
    tower: 'quaternius/village/Bell_Tower.glb', house: 'quaternius/village/House_2.glb', house2: 'quaternius/village/Inn.glb',
    tree: 'quaternius/nature/CommonTree_1.glb', pine: 'quaternius/nature/PineTree_2.glb',
  },
  build(K) {
    const S = this.s = {};
    K.model('tower', { size: 6, x: -4.5, z: -9 }); K.model('house2', { size: 5, x: 3.5, z: -10, rotY: -.4 }); K.model('house', { size: 4, x: 9, z: -8, rotY: -.8 });
    for (const [x, z, k] of [[-9, -6, 'tree'], [-7.5, -11, 'pine'], [7, -13, 'pine'], [11, -4, 'tree'], [-11, -2, 'pine']]) K.model(k, { size: 3.5 + (x % 2), x, z });
    // army: 6 columns x 5 rows of knights marching toward the camera
    S.army = []; for (let r = 0; r < 4; r++) for (let c = 0; c < 8; c++) { const k = K.model('knight', { height: 1.7, rotY: Math.PI / 2 }); k.userData.x0 = -12 + c * 1.15; k.position.z = -4.6 + r * 1.05; S.army.push(k); }
    // king & queen on a platform
    const plat = K.solid(new THREE.CylinderGeometry(1.9, 2.1, .4, 40), 0xcfa86a, undefined, { rough: .8, metal: 0 }); plat.position.set(0, .2, 3.2);
    S.king = K.model('king', { height: 2.1, x: -.75, z: 3.2, rotY: .25 }); S.king.position.y = .4;
    S.queen = K.model('queen', { height: 1.95, x: .8, z: 3.2, rotY: -.25 }); S.queen.position.y = .4;
    S.kCrown = K.crown(.34); S.qCrown = K.crown(.28, 0xf7c84a);
    S.helmets = S.army.map(() => K.model('helmet', { size: .42 }));
  },
  shots: [[0, [2.0, 2.2, 9.5], [-1.5, 1.6, -3], 1.2], ['king', [1.6, 2.4, 8.5], [0, 1.9, 3.2], .6], ['march', [9, 2.6, 4], [4, 1.2, -3.5], 1.2]],
  cards: [{ v: 'KING', cls: 'tag', a: [-.75, 3.0, 3.2], t0: 'king', t1: 'march' }, { v: 'QUEEN', cls: 'tag', a: [.8, 2.85, 3.2], t0: 'queen', t1: 'march' }],
  follow: { from: 'cta+0.2', title: 'WHY THE F*CK? · EXPLAINED' },
  update(t, K) { const S = this.s;
    S.army.forEach((k, i) => { K.anim(k, 'Walking', t + i * .07); k.position.x = k.userData.x0 + t * .75; });
    K.anim(S.king, t > K.at('king') ? 'Wave' : 'Idle_Neutral', t);
    K.anim(S.queen, 'Idle_Neutral', t + .4);
    K.stick(S.kCrown, S.king, 'Head', [0, .13, 0]); K.stick(S.qCrown, S.queen, 'Head', [0, .16, 0]);
    S.army.forEach((k, i) => K.stick(S.helmets[i], k, 'Head', [0, .02, 0]));
  },
};
