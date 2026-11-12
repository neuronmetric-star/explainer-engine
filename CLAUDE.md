# Explainer Engine — rules for Claude Code

This repo makes **extreme-quality vertical teaching videos** (TikTok / Instagram Reels / YouTube Shorts)
with Three.js: finance, history, science, "how things really work." Owner: Brian (NeuronMetric).
Brand handle (TikTok + socials): **@coonknows** — the engine shows it as a moving watermark and on the
end card (`K.BRAND` in engine/kit.js). He works mostly from his phone — keep messages short, show previews, ask before spending credits.

## Brian's preferences (learned while making the first videos — follow these)
- Stay on the question. Cut anything that doesn't answer it (e.g. no morning-breath tangent in a shower video).
- Hyper-educational: name the real things (glands, bacteria species, parts) and explain what each does, simply.
- Story beats > fact lists: e.g. "your night, hour by hour" with a ticking clock tracker.
- Premium, cinematic sets: mood lighting (night room with moon + lamp, sunrise), real 3D characters
  (Quaternius) at believable scale — a person should fill their bed, not look like a toy on it.
- Characters fit the topic: soldiers look like soldiers, kings/queens wear crowns (K.crown), etc.
- CTA is a question + share bait, e.g. "Knowing this, will you start taking morning showers? Send this to your stinky partner."
- Remove "advice" lines that aren't asked for (e.g. "keep it quick and lukewarm").
- Real people/news: allegations always attributed, never name private people, faceless figures only.
- Brian records the voiceover in OpenArt; then run `node tools/align.js <slug>` (exact forced alignment via PocketSphinx — `pip install pocketsphinx` if missing; it bundles its model) and check cues.
- Show a preview before every full render; he may say "wait" — stop the render immediately.
- **Characters = the Coonverse** (from Nov 2026): mature anthropomorphic animals in a rich painted style (NOT cute/chibi), Coon the raccoon in a black suit + gold tie is the host; reference image `docs/characters/ref/coon-main.webp`. **Mood by topic**: historic (history), bright (modern money/science), night (crime/mysteries) — table in coonverse.md. Cast + ChatGPT prompts in `docs/characters/coonverse.md`. Images come from ChatGPT (Claude writes the prompts).
- Keep messages short (he's on his phone). Post caption + hashtags + pinned-sources comment with each final video.


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

## Script formula — "WHY THE F*CK…?" format (from Nov 2026, any topic humans wonder about)
Length **61–75 s** (~170–200 spoken words). Must be over 60 s: TikTok Creator Rewards only pays on videos >1 min.
1. **Hook (0–3 s)**: "Why the fuck did/does/is ___?" + bridge: "Give me a minute, I'll show you." /
   "Let me explain." Exactly ONE swear, only in the hook. Caption shows it masked: `{F*CK|fuck}`.
   Never put the swear in the TikTok caption text, title, hashtags or thumbnail.
2. **Short answer** (one line, surprising) → "But the real reason is wilder."
3. **Deep, simple explanation**: 3–4 numbered steps. Each = one concrete picture + one real number.
   Explain like to a smart 12-year-old. Every sentence must be visualizable.
4. **Twist / catch**: the part most people get wrong ("Here's what nobody tells you…").
5. **Proof**: real numbers on a receipt, chart or comparison.
6. **"You" moment**: tie it to the viewer's life ("That's why YOUR ___ …").
7. **Punchline** (one short line) + **CTA**: "Follow — I explain one of these every day." Optional share bait:
   "Send this to someone who …".
Rules: short sentences, concrete numbers, no filler. Every fact from a source. History: no myths stated as
fact ("historians think"). Real people/news: attribute every claim, never present allegations as fact.
Never give personalized financial/legal/medical advice. See docs/growth-plan.md for monetization rules.


Also see `docs/ricks-clips-study.md` — a "story mode" formula (cold open → doubters → disaster → "You see…") to A/B test.

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
- Always check the preview image before a full render — including that the **@coonknows** watermark is visible.

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
