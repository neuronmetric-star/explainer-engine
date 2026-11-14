# Explainer Engine — rules for Claude Code (read fully before any work)

This repo makes **premium vertical teaching videos** (TikTok / Reels / Shorts): money, history, science,
"how things really work." Owner: Brian (NeuronMetric). Brand: **@coonknows** — every video shows it as a
moving watermark + on the end card (`K.BRAND` in engine/kit.js). Never ship a video without it.

**Two brands — read `docs/HANDOFF.md` first.** Sections 1–4 below are for @coonknows Shorts. **Babytopia** (16:9 long-form,
"explained like you're 5", no Coon, no @coonknows watermark) has its own rules in `docs/HANDOFF.md` + `docs/longform/`.

These rules are permanent. They apply to every session and every new video automatically.
Never change finished videos unless Brian asks — always move forward with new ones.

## Working with Brian
- He's on his phone: short messages, previews before renders, ask before spending credits (OpenArt etc.).
- He may say "wait" — stop a render immediately.
- He makes all images in **ChatGPT** and the voice in **OpenArt**; Claude writes every prompt and the voice text.
- With each final video, give: title, caption (no swears), hashtags, pinned-sources comment.
- Commit + push after every meaningful step (other sessions start from GitHub — anything not pushed is lost).

## 1. Script formula — "WHY THE F*CK…?" (every video)
Final length **75–80 s** after speed-up (~200–215 spoken words; must stay over 60 s for TikTok Creator Rewards).
1. **Cold open** (0–1.2 s, no words): the most dramatic frame, mid-action, with sound (drill, crash, scream…).
2. **Hook** — ALWAYS a question word + "the fuck": "**Why / How / When / Where / What the fuck** ___?"
3. **Bridge**, by topic: default "Well, let me explain." / "Let me show you." — spicy for light, playful topics
   (incl. everyday hygiene): "Let me explain, you **stupid/dirty** fuck." (insult fits the topic).
   NEVER spicy on tragedies, deaths, victims, serious illness or real people's suffering.
4. **Story**: a character the viewer follows (e.g. Tim) + Coon narrating. Story beats > fact lists.
   Hyper-educational: name the real things (bacteria species, glands, laws…) and what each does, simply.
5. **Real numbers** shown on screen (counter, gauge, card), every one sourced.
6. **Twist / payoff** — the part most people get wrong.
7. **Ending** — ALWAYS: "**And that's why the fuck** ___." + "**Share this with** <someone relevant>."
   (e.g. "Share this with the friend whose breath could kill a plant.") FOLLOW button shows on screen.
Rules: max 3 swears (hook, spicy bridge, ending). Captions mask them: `{F*CK|fuck}`. NEVER a swear in the post
caption, title, hashtags or thumbnail. Short sentences, no filler, no unasked advice lines, stay on the question.
Facts: every number from a source in `sources.md`. History: no myths as fact ("historians think").
Real people: attribute claims, never show their face (silhouette / from behind). No personalized financial,
legal or medical advice — explain how things work.
Alternative structure to A/B test: "story mode" in `docs/ricks-clips-study.md`.

## 2. The look — the Coonverse (every video)
- **Mature anthropomorphic animals, rich digital painting** (NOT cute/chibi). Full bible: `docs/characters/coonverse.md`.
- **Coon** (raccoon, black three-piece suit, gold tie, gold pocket-watch chain, amber eyes) is the host.
  Format: Coon is an **invisible narrator inside the scene** — the other characters can't see or hear him;
  he leans on things, waves a paw in their face, shrinks down to tour micro-worlds. Show it, never say it.
- Approved references (attach to EVERY ChatGPT prompt): `docs/characters/ref/coon-main.webp`, `coon-sheet.webp`,
  plus the sheet of every other character in the scene (`tim-sheet.webp`, `doc-sheet.webp`, …).
- **Coon poses** are reusable transparent PNGs in `docs/characters/ref/poses/` (intro, lean, wave, tour, point).
  New poses: ChatGPT on a **pure #00FF00 green background** → `python3 tools/keygreen.py in out.png`.
- **Scenes never contain Coon** — he is added on top as a moving depth layer. Every scene prompt ends with
  "no raccoon in this image" and leaves empty space where he'll stand.
- **Mood by topic**: historic (history, before ~1950) · bright (modern money/science) · night/horror (crime,
  mysteries, scary settings). Coon and the painted style never change, only light and palette.
- Recurring characters get a model sheet first (front/3-quarter/side/back + 4 expressions), approved by Brian.

## 3. Pipeline (always in this order)
1. **Research** (web search) → `videos/<slug>/sources.md` (title + URL + the fact it supports).
2. **Script** → `videos/<slug>/script.txt` (formula above + markup below). Show Brian; **wait for "approved"**.
3. **Prompts** → `videos/<slug>/image-prompts.md`: character sheets (if new), Coon poses (if new), ~16 scenes.
   Give them to Brian inline in copy-paste code blocks, full text each (no "[STYLE LINE]" shortcuts).
4. **Voice text**: print with `node -e "console.log(require('./engine/script.js').spokenText(require('fs').readFileSync('videos/<slug>/script.txt','utf8')))"`.
   Brian records at normal speed → `voice.mp3` → `node tools/voice.js <slug> 1.15 --pad 1.2`
   (speeds up without pitch change, adds the cold open, keeps voice-original.mp3, runs exact alignment).
5. **Scene** → `videos/<slug>/scene.js` with image `panels`, Coon `layers`, `cards`, `sfx`, `autoWhoosh: true`,
   `shakes`, `flashes`, `follow`. Reference: `videos/lottery-every-ticket/scene.js` + `videos/engine-demo/scene.js`.
6. **Preview**: `node tools/render.js <slug> --preview $(node tools/cues.js <slug> cue+0.5 …)` → Read the image.
   Fix crops, overlaps, cut-off text; check @coonknows is visible. Send Brian the preview.
7. **Render**: `node tools/render.js <slug>` (image videos ≈ 3–4 min). Check frames, send the mp4, post copy, push.

## 4. Visual + sound rules (the quality bar)
- Something changes every 2–3 s: camera move, layer slide, card pop, counter, light change.
- Hook frame = the most striking image, already moving at frame 1. No fade-in.
- **Sound design on every video**: whoosh on every scene change (`autoWhoosh`), plus hits on key moments
  (topic SFX: drill/suction/scrape/clink for dentists, cash for money, tick for time, slam/hit for drama).
- Cards: max 2 on screen; keep out of the caption zone (y 1250–1450) and inside x 28–1052. Big numbers `cls:'big'`.
- Colors: gold = win/key term · red = danger/loss · white = neutral · green = cash · blue = ordinary world.
- Safe zone: nothing important in the top 140 px or bottom 380 px.
- Captions are automatic (one word at a time); never put other text at the caption position.
- Old 3D looks (gold-noir / parchment / blueprint, Quaternius characters) are legacy — only on request.

## Script markup (`script.txt`)
`*word` gold · `!word` red · `{shown|spoken}` e.g. `{$23.8%|twenty-three point eight percent}` ·
`[#cue]` invisible sync point used by scene.js · lines starting `#` are comments.
Write numbers as words in the spoken part. Put a `[#cue]` before every sentence that changes the picture.

## Engine reference (engine/kit.js, available as `K` in scene.js)
- Time: `K.at('cue')`, `K.T('cue+0.4')`, `K.prog(t,'cue',dur)` (0→1), `K.ease/easeOut/pop/clamp01`.
- Build: `box(w,h,d,x,y,z,parent,color)`, `cyl(r,h,x,y,z,parent,color)`, `bar(w,d,x,z,parent,color)` +
  `setBar(bar,height)`, `roof(w,h,d,x,y,z,parent,color)`, `extrude([[x,y]...],depth,x,y,z,parent,color)`,
  `tube([[x,y,z]...],color,radius,parent)` + `drawTube(tube,0..1)`, `ring(r,x,z)`, `group(x,y,z)`,
  `person(x,z,{tie:true,scale,color})`, `fly(obj,t,start,dur,fromVec,toVec)`, `hop(obj,t,'cue')`.
- Scene object: `build(K)`, `shots`, `cards`, `steps`, `receipt`, `follow`, `shakes`, `flashes`, `update(t,K)`.
- **Image panels** (2D cartoon story videos, images from ChatGPT in `videos/<slug>/img/`):
  `panels: [{ img:'img/01.png', at:'cue', origin:[50,30], move:{zoom:[1.4,1.05], x:[0,-40], y:[0,20]}, fx:'pulse|flicker|dark', parts:{n:22,speed:.8}, fade:.25 }]`.
  One panel per beat, crossfades to the next; cards take `s:[x,y]` (screen px) instead of `a`; `shakes`/`flashes`/cards/captions/watermark work on top. No `build` = no WebGL (renders ~5x faster).
- **Depth layers** (premium parallax): a panel can carry `layers: [{ img:'img/coon-point.png', s:[x,y], w:520, depth:1.8, bob:10, in:['cue',600,.5], flip }]`
  — transparent PNG sprites (characters from ChatGPT on transparent background) placed at s/w when the shot starts, drifting depth× vs the background.
- **Green-screen characters**: ChatGPT poses on pure #00FF00 → `python3 tools/keygreen.py in.webp out.png` (transparent PNG, despilled, cropped). Reusable poses live in `docs/characters/ref/poses/`.
- **Sound effects**: `sfx: [['cue+0.2','cash',0.8], …]` with `engine/sfx/{whoosh,hit,slam,tick,cash,riser,pop,shutter,rumble,drill,suction,scrape,clink,drone,flicker}.wav`; `autoWhoosh: true` adds a whoosh on every panel change. Mixed by tools/render.js.
- **Voice pace**: target 75–80 s. `node tools/voice.js <slug> 1.15 [--pad 1.2]` speeds voice.mp3 without pitch change, optionally adds a silent cold open (mid-action start before the first word), keeps voice-original.mp3 and re-aligns.
- **Long-form / Babytopia** (`docs/longform/`): `format:'wide'` = 1920×1080 (render.js detects it), subtitle lines at the bottom
  with the current word highlighted, character lines in italics. Script `[@NAME]` tags mark who speaks (N = narrator; one
  narrator voices everyone). Talking characters: a layer with `talk:'img/x-open.png', who:'ZUCK'` flaps its mouth while
  that speaker's words play. `chapters: [{at:'ch1', n:'CHAPTER 1', title:'…', dur:2.4}]` = title cards.
  `brand:'@handle'` sets the watermark (`''` hides it; default @coonknows).
- Everything in `update` must be a pure function of `t` (no accumulating state) so renders are exact.

## Looks (styles)
Pick one with `style: '<name>'` at the top of `window.SCENE` (default **gold-noir**).
- **gold-noir** (black void, glowing gold wireframes, reflective floor) — finance/wealth.
- **parchment** (`engine/styles/parchment.*`) — history: lit low-poly dioramas with ink outlines, Cinzel cards, paper grain. Extra colours: `K.STONE, EARTH, WOOD, FIRE, INK`.
- **blueprint** (`engine/styles/blueprint.*`) — science: cyan lines on navy, drafting grid. Extra colours: `K.CYAN, PINK, VIOLET, NAVY`; card class `blue`.
- Planned: **chalk** (math: white lines on dark green).
Extra kit helpers: `K.glow(geo,color,parent,opacity,x,y,z)` (unlit: fire, beams, screens), `K.solid(...)`,
`K.line(pts,color,parent,width)` + `K.setLine(line,0..1)`, `K.col(hex)`, `K.wire(geo,color,parent,{angle})` (angle 1 = show all edges).
Tools: `node tools/draft.js <slug>` = estimated timing so scenes can be built/previewed before the voice exists;
`node tools/cues.js <slug> [cue+0.5 ...]` prints cue times (pipe into `--preview`);
`tools/look.sh <slug> "<times>" [cols]` = larger review montage in $SCRATCH. Keep the same card, caption and step systems across looks so the brand stays recognizable.
