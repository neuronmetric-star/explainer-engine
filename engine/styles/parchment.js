// PARCHMENT look — history. Warm low-poly dioramas, lit like a lantern-lit map room.
// Solid flat-shaded models with dark ink outlines, sepia fog, warm dust, gentle bloom.
// Colour meaning stays fixed: GOLD = key term/win, RED = danger/loss, WHITE = neutral, BLUE = ordinary world, GREEN = cash.
window.STYLES = window.STYLES || {};
window.STYLES.parchment = {
  bg: 0x24170c, fogColor: 0x2c1d0f, fog: [30, 95],
  ambient: [0xffe2b8, .28], key: [0xffd49a, 1.05], hemi: [0xffe9c4, 0x3a2412, .32], linear: true,
  bloom: [.32, .45, .93],
  floor: { color: 0x6b4a2a, lit: true },
  guide: null, dust: [0xffcf8a, .5, .06],
  palette: { GOLD: 0xe0a83a, RED: 0xc8432b, WHITE: 0xf1e3c4, BLUE: 0x6f8fae, GREEN: 0x8aa35a, SILVER: 0xb9ad98,
    STONE: 0xbfa57f, EARTH: 0x8a6a45, WOOD: 0x7a4f2c, INK: 0x2a1a0d, FIRE: 0xffa63a, GRASS: 0x7d8a45 },
  ink: 'STONE', solid: true,
  fill: c => c,                       // bodies take the colour itself, lit by the lantern
  outline: () => 0x2a1a0d, outlineWidth: 2.2,
  lineWidth: 3,
  person: [0xe9d8b4, 0x1c120a], tie: [0xe0a83a, 0x5a3a08],
  tubeColor: 0xe0a83a,
};
