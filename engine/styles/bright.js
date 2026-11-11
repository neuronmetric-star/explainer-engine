// BRIGHT look (default from Nov 2026): sunny sky gradient, warm matte floor, solid toy-like shapes with soft shadows.
// No outlines anywhere: K.box / K.cyl / K.bar / K.extrude all become solid shaded objects.
window.STYLE = {
  name: 'bright',
  bg: 0xfff3df, sky: [0x5fb4ff, 0xa9d8ff, 0xfff3df], fog: [45, 120],
  floorMode: 'matte', floor: 0xe6cfa6, dust: null,
  ink: 0x3d7bf0, solidAll: true, shadows: true, rig: 'bright',
  bloom: [.25, .3, .95],
  css: `
body.look-bright, html{background:#a9d8ff}
.look-bright #vig{background:radial-gradient(ellipse at 50% 45%,transparent 60%,rgba(20,40,80,.18) 100%)}
.look-bright #cap{color:#fff;text-shadow:0 0 2px #000,0 0 2px #000,3px 3px 0 #000,-3px 3px 0 #000,3px -3px 0 #000,-3px -3px 0 #000,0 6px 14px rgba(0,0,0,.45)}
.look-bright #cap.gold{color:#ffc21a;text-shadow:3px 3px 0 #000,-3px 3px 0 #000,3px -3px 0 #000,-3px -3px 0 #000,0 6px 14px rgba(0,0,0,.45)}
.look-bright #cap.red{color:#ff4433;text-shadow:3px 3px 0 #000,-3px 3px 0 #000,3px -3px 0 #000,-3px -3px 0 #000,0 6px 14px rgba(0,0,0,.45)}
.look-bright .card{background:rgba(255,255,255,.94);border:4px solid #f0a800;box-shadow:0 10px 26px rgba(20,30,60,.25)}
.look-bright .card .l{color:#5b6475} .look-bright .card .v{color:#d48a00;text-shadow:none}
.look-bright .card.red{border-color:#e8352a;box-shadow:0 10px 26px rgba(20,30,60,.25)} .look-bright .card.red .l{color:#8a4a45} .look-bright .card.red .v{color:#e0261b;text-shadow:none}
.look-bright .card.white{border-color:#1d2330} .look-bright .card.white .v{color:#1d2330;text-shadow:none}
.look-bright .card.green{border-color:#16a34a} .look-bright .card.green .v{color:#12913f;text-shadow:none}
.look-bright .card.blue{border-color:#2f6fd6} .look-bright .card.blue .l{color:#4a5f86} .look-bright .card.blue .v{color:#2f6fd6;text-shadow:none}
.look-bright .card.cyan{border-color:#0ea5c6} .look-bright .card.cyan .v{color:#0b8fb0;text-shadow:none}
.look-bright .card.tag{background:#1d2330;border-color:#1d2330} .look-bright .card.tag .v{color:#fff}
.look-bright #steps .t{color:#1d2330;text-shadow:0 1px 0 rgba(255,255,255,.7)}
.look-bright .sc{background:#fff;border-color:#1d2330;color:#1d2330} .look-bright .sc.done{border-color:#d48a00;color:#d48a00}
.look-bright .sl{background:rgba(29,35,48,.35)} .look-bright #steps .labs span{color:rgba(29,35,48,.6)} .look-bright #steps .labs span.on{color:#d48a00}
.look-bright #ftitle{color:#1d2330}
.look-bright #follow{background:#fff;color:#e0261b;border-color:#e0261b;box-shadow:0 10px 26px rgba(20,30,60,.25)} .look-bright #follow.on{background:#e0261b;color:#fff}
.look-bright #fhandle{color:#fff;text-shadow:3px 3px 0 #000,-3px 3px 0 #000,3px -3px 0 #000,-3px -3px 0 #000}
.look-bright #wm{color:#fff;text-shadow:0 0 4px #000,2px 2px 0 #000,-2px 2px 0 #000,2px -2px 0 #000,-2px -2px 0 #000}
.look-bright .co{background:rgba(255,255,255,.95);border-color:#1d2330} .look-bright .co span{color:#1d2330} .look-bright .col{stroke:#1d2330}
`,
};
