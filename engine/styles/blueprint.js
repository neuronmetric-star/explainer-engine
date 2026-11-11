// BLUEPRINT look — science / how-it-works. Glowing cyan linework on deep navy, drafting grid floor,
// cutaways and exploded views. Colour meaning stays fixed (gold key term, red danger, white neutral...).
window.STYLES = window.STYLES || {};
window.STYLES.blueprint = {
  bg: 0x061630, fogColor: 0x061630, fog: [28, 80],
  ambient: [0xcfe6ff, .55], key: [0xffffff, .8],
  bloom: [.95, .45, .55], linear: true,
  floor: { color: 0x071a38, grid: [0x3d84cf, 2], gridOpacity: .38 },
  guide: null, dust: [0x8fdcff, .45, .045],
  palette: { GOLD: 0xffc548, RED: 0xff4b3a, WHITE: 0xeaf6ff, BLUE: 0x5cc8ff, GREEN: 0x8dffb5, SILVER: 0xbcd3ea,
    CYAN: 0x6fe3ff, NAVY: 0x0a2350, PINK: 0xff8fb3, VIOLET: 0xb59cff },
  ink: 'CYAN', solid: false,
  fill: () => 0x081d40,               // dark navy bodies, edges carry the colour
  outline: null, lineWidth: 3,
  person: [0xcfe3f7, 0x0c1a2c], tie: [0xffc548, 0xb07a10],
  tubeColor: 0x6fe3ff,
};
