# Explainer Engine — rules for Claude Code

This repo makes **extreme-quality vertical teaching videos** (TikTok / Instagram Reels / YouTube Shorts)
with Three.js: finance, history, science, "how things really work." Owner: Brian (NeuronMetric).
Brand handle (TikTok + socials): **@coonknows** — the engine shows it as a moving watermark and on the
end card (`K.BRAND` in engine/kit.js). He works mostly from his phone — keep messages short, show previews, ask before spending credits.

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

## Script markup (`script.txt`)
`*word` gold · `!word` red · `{shown|spoken}` e.g. `{$23.8%|twenty-three point eight percent}` ·
`[#cue]` invisible sync point used by scene.js · lines starting `#` are comments.
Write numbers as words in the spoken part so the voice reads them right.
Put a `[#cue]` before every sentence that should change the picture.

## Visual rules (the quality bar)
- **Default look = bright** (sunny sky, warm ground, solid toy-like shapes, soft shadows, NO outlines).
  New videos get it automatically. Old videos pin theirs in `look.js` (gold-noir / blueprint).
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
- **Cutaways (solid machines)**: `K.solid(geo,color,parent,{cut,inner,glow,metal,rough})`, `K.hull([[x,r]...],color,parent,opts)`
  (body of revolution along x), `K.cutaway({z,x0,x1})` + `K.setCut(cut,x0,x1)` to peel the front open,
  and `callouts:[{n,l,cls,a:[x,y,z],at:[screenX,screenY],t0,t1}]` for numbered labels. Show ≤2 callouts at once.
  Full example: `videos/_cutaway-demo/scene.js`. Use our own models only — never copy someone's cutaway art.
- Looks: no `look.js` = **bright** (engine/styles/bright.js). `window.LOOK = 'gold-noir' | 'blueprint'` in
  `videos/<slug>/look.js` for the old styles. In bright, box/cyl/bar/extrude are solid automatically.
  Bright example: `videos/_bright-demo/scene.js`.
- No voice yet? `node tools/draft-timing.js <slug>` makes placeholder timing so you can preview a scene early.
- Everything in `update` must be a pure function of `t` (no accumulating state) so renders are exact.

## Looks (styles)
Default: **bright** (sunny, solid, shadows). Also available: **gold-noir** (black void, glowing gold
wireframes) and **blueprint** (cyan lines on navy).
Planned looks to add as `engine/styles/*` when a topic needs them: **parchment** (history: warm
low-poly dioramas, maps, lantern light), **blueprint** (science/engineering: cyan lines on navy,
cutaways and exploded views), **chalk** (math: white lines on dark green). Keep the same card,
caption and step systems across looks so the brand stays recognizable.
