# Explainer Engine — rules for Claude Code

This repo makes **extreme-quality vertical teaching videos** (TikTok / Instagram Reels / YouTube Shorts)
with Three.js: finance, history, science, "how things really work." Owner: Brian (NeuronMetric).
He works mostly from his phone — keep messages short, show previews, ask before spending credits.

## The pipeline (always in this order)
1. **Research** the topic. Use web search. Every number and claim must come from a source.
   Save sources to `videos/<slug>/sources.md` (title + URL + the fact it supports).
2. **Script** → `videos/<slug>/script.txt` using the formula below. Show Brian the script and
   **wait for approval** before making audio (audio costs money).
3. **Voice**:
   - If `ELEVENLABS_API_KEY` is set: `node tools/tts.js <slug>` (exact word timing).
   - Otherwise: ask Brian to make the voiceover in OpenArt/ElevenLabs with the *spoken* text
     (print it with `node -e "console.log(require('./engine/script.js').spokenText(require('fs').readFileSync('videos/<slug>/script.txt','utf8')))"`),
     save it as `videos/<slug>/voice.mp3`, then run `node tools/align.js <slug>`.
4. **Scene** → `videos/<slug>/scene.js`. Copy `videos/_template/` and study `videos/buy-borrow-die/scene.js`.
5. **Preview**: `node tools/render.js <slug> --preview` → look at `videos/<slug>/preview.jpg` yourself
   (Read the image). Fix overlaps, cut-off cards, empty frames, unreadable text. Repeat until clean.
6. **Render**: `node tools/render.js <slug>` → `videos/<slug>/final.mp4` (voice mixed in; `music.mp3`
   in the folder is mixed in quietly if present). Software rendering takes ~10–15 min per minute of video.
7. Commit the folder (not the mp4s if they're huge) and tell Brian where the video is.

## Script formula (55–70 seconds, ~150–175 spoken words)
1. **Hook question** (first 2 s): a curiosity gap about something everyone sees.
   "Why does every rich person drive a G-Wagon?" / "Why didn't medieval people shower?"
2. **Reframe**: "It's not X. It's Y." + "Here's how it works."
3. **Setup with a character** — a named, faceless character the viewer follows (e.g. Victor).
4. **Numbered steps** — 2–4 steps, each one sentence of setup + one of payoff. Use the step tracker.
5. **The catch**: "There's just one rule / one risk…" (honesty builds trust).
6. **The math / proof**: real numbers, shown on a receipt or chart.
7. **Relatable contrast**: a normal person (teacher, nurse, firefighter) in the same situation.
8. **Punchline** (one short line that reframes everything) + **CTA**: "Follow for more ___."
Rules: short sentences. Concrete numbers. No filler ("so basically", "in today's video").
Every sentence must be visualizable. Never give personalized financial/legal/medical advice;
explain how things work. History: no myths stated as fact — say "historians think" when unsure.

## Script markup (`script.txt`)
`*word` gold · `!word` red · `{shown|spoken}` e.g. `{$23.8%|twenty-three point eight percent}` ·
`[#cue]` invisible sync point used by scene.js · lines starting `#` are comments.
Write numbers as words in the spoken part so the voice reads them right.
Put a `[#cue]` before every sentence that should change the picture.

## Visual rules (the quality bar)
- **Something changes every 2–3 seconds**: camera move, card pop, counter, object growing.
- **One idea per shot.** Each set lives at its own x position (0, 20, 40, 60…); shots jump between them.
- Hook frame = the most striking image in the video, already moving at frame 1. No fade-ins.
- Cards: max 2 on screen at once (plus the step tracker). Keep cards out of the caption zone
  (screen y 1250–1450) and inside x 28–1052. Big numbers = `cls:'big'`.
- Color meaning is fixed: **gold** = wealth/win/key term, **red** = tax/loss/danger,
  **white** = neutral facts/people, **green** = cash, **blue** = ordinary-person world.
- Captions are automatic (one word at a time). Never put other text at the caption position.
- Safe zone: nothing important in the top 140 px or bottom 380 px (app UI covers it).
- End on the receipt / summary, then the FOLLOW button.
- Always check the preview image before a full render.

## Engine reference (engine/kit.js, available as `K` in scene.js)
- Time: `K.at('cue')`, `K.T('cue+0.4')`, `K.prog(t,'cue',dur)` (0→1), `K.ease/easeOut/pop/clamp01`.
- Build: `box(w,h,d,x,y,z,parent,color)`, `cyl(r,h,x,y,z,parent,color)`, `bar(w,d,x,z,parent,color)` +
  `setBar(bar,height)`, `roof(w,h,d,x,y,z,parent,color)`, `extrude([[x,y]...],depth,x,y,z,parent,color)`,
  `tube([[x,y,z]...],color,radius,parent)` + `drawTube(tube,0..1)`, `ring(r,x,z)`, `group(x,y,z)`,
  `person(x,z,{tie:true,scale,color})`, `fly(obj,t,start,dur,fromVec,toVec)`, `hop(obj,t,'cue')`.
- Scene object: `build(K)`, `shots`, `cards`, `steps`, `receipt`, `follow`, `shakes`, `flashes`, `update(t,K)`.
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
