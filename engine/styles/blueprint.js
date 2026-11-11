// BLUEPRINT look — science / engineering: cyan ink lines on navy drafting paper, cutaways, exploded views.
// Color meanings stay the same (gold = key term, red = danger, white = people/facts); default line ink is cyan.
window.STYLE = {
  name: 'blueprint',
  bg: 0x010812, fog: [30, 80],
  floor: 0x2a5578, dim: 0x010812, dimOpacity: .84,
  grid: 0x0f3050, dust: 0x9fe8ff,
  ink: 0x5fe3ff, body: 0x020c1a,
  bloom: [.95, .35, .55],
  backGrid: { z: -14, step: 1.5, color: 0x0a2440 },
  css: `
body.look-blueprint, html{background:#04142a}
.look-blueprint #vig{background:radial-gradient(ellipse at 50% 45%,transparent 50%,rgba(2,10,24,.7) 100%)}
.look-blueprint .card.cyan{border-color:rgba(95,227,255,.95);box-shadow:0 0 22px rgba(95,227,255,.5),inset 0 0 18px rgba(95,227,255,.15)}
.look-blueprint .card.cyan .l{color:rgba(170,240,255,.9)} .look-blueprint .card.cyan .v{color:#8ff0ff;text-shadow:0 0 16px rgba(95,227,255,.8)}
.look-blueprint .card{background:rgba(4,18,40,.78)}
.look-blueprint .card.tag{background:rgba(4,18,40,.85);border-color:rgba(95,227,255,.9);box-shadow:0 0 14px rgba(95,227,255,.4)}
.look-blueprint #steps .t{color:rgba(150,235,255,.9)}
.look-blueprint #receipt{background:#0a2647;color:#cfefff;border:3px solid #5fe3ff;box-shadow:0 0 40px rgba(95,227,255,.35)}
.look-blueprint #receipt:after{display:none}
.look-blueprint #receipt h3{color:#8ff0ff} .look-blueprint #receipt .r{color:#cfefff} .look-blueprint #receipt .r.k{border-top-color:#2f6fa3;color:#fff}
.look-blueprint #receipt .r.k b{color:#ffd15a} .look-blueprint #receipt .r.g b{color:#7dffb0}
.look-blueprint .sc{background:#04142a}
.look-blueprint #ftitle{color:rgba(150,235,255,.9)}
`,
};
