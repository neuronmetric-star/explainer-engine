# Explainer Engine — rules for Claude Code

This repo makes **story-driven vertical explainer videos** (TikTok / Reels / Shorts) about *anything*:
science, money, history, "how things really work." Owner: Brian (NeuronMetric).
He works mostly from his phone — keep messages short, show previews, ask before spending credits.

**The full method is `docs/PLAYBOOK.md`. Read it before starting any video and follow it.**
Worked example: `videos/gas-vs-water/` (short form; `videos/why-cars-need-gas/` is an older draft).

## The format (every video)
- **One narrator** (dry, sarcastic, talking to one friend). Characters never speak; mouths stay still.
- **Flat illustrated 2D world** painted by Brian in ChatGPT from our prompts (`docs/prompt-pack.md`), always.
  Optional OpenArt image-to-video inserts for physics-heavy shots (PLAYBOOK §4.1).
- **Silent 3D sphere-head cast, look v2** (`engine/characters.js`; Brian's approved sheets in `docs/cast/ref/` are the target for
  every video: ivory heads, bold faces, puffy gloves, rich outfit colors; check with `node tools/cast-sheet.js` → `docs/cast/`): Doug (hoodie), Gary (oxford + glasses),
  Victor (suit), polo guy, the President (`president`: cap, bomber, sash), gang member (`gang`: hoodie, beanie, bandana; never armed). They act with gaze, posture, gestures, faces and timing.
- **Camera always moving**: push-ins, tracking walk-ins, hard cuts on reveal words; on paintings only
  zoom/pan (feet stay planted). Something changes every 2–3 s. No fades.
- **Captions**: one word at a time, white with thick black outline, y≈1270 of 1920. Gold = key/win, red = loss.
- **Every video is short form** (Brian, Nov 21 2026; don't ask about length): ≈ 1:05–1:12 final, 175–190 story words + CTA,
  just over TikTok's 1-minute payout line, never under 1:02, never over 1:15; hook → middle → end (PLAYBOOK §1.11).
  Ray's skeleton + Xevi's narrator personality, compressed (`docs/creators/ray-xevi-study.md`). Long form is retired.
- **One narrator** performs everyone's lines Xevi-style; silent characters gesture on their lines.
- **The helicopter ending, every video, no matter what** (PLAYBOOK §1.12a): on the last story line the Lamborghini
  helicopter (`docs/assets/H01_helicopter.png`) flies across the sky via `K.helicopter(t, cue)`, the winner looks up,
  then the follow CTA. The last background always has open sky in its top third.

## Daily topics (`/topics`)
When Brian asks for today's topics / trending topics: read `docs/trends/<today>.md` (US Eastern date; it's written every
morning at 6:43 ET by the scheduled trend scrape, PLAYBOOK §6c). If it isn't there, run the scrape first, save the sheet,
commit and push. Answer from the sheet, never from memory. Trend sheets and finished work go to `main` so every session sees them.

## The pipeline (always in this order)
0. **Length:** always short form (≈ 1:05–1:12, PLAYBOOK §1.11). Never ask; long form is retired (Brian, Nov 21 2026).
1. **Payoff → topic → mode.** Pick topics from the morning trend sheet `docs/trends/<date>.md` (PLAYBOOK §6c) and
   note the topic's **search phrase** (the exact words people type; it goes in caption line 1, on-screen text in the
   first 2 s, and the first spoken sentence). Write the one-sentence answer the viewer will discover, then pick the script mode the
   topic deserves (PLAYBOOK §1.13): **Explainer** (how a thing works), **True story** (a real event/person), or
   **Lesson chain** (human behavior: chain of people + refrain "But what he doesn't know is that…" + flip + moral +
   comment question). Tell Brian the mode in one line. Lesson chains need no research unless they state facts.
2. **Research** with web search; every claim sourced in `videos/<slug>/sources.md` (title + URL + fact).
   Label invented characters and reconstructions.
3. **Script** → `videos/<slug>/script.txt` (PLAYBOOK §1). Show Brian the narration in one copyable
   block (timing, direction, sources outside it) and **wait for approval**.
4. **Shot list** → `videos/<slug>/shotlist.md` (PLAYBOOK §5): background + prop prompts and a shot
   plan with camera and acting per cue. **Images: always Brian in ChatGPT.** For big sets, write the batch file
   `videos/<slug>/art-prompts.md` (prompt-pack "Batch file") → `videos/<slug>/art/`.
   **OpenArt = video inserts only** (PLAYBOOK §4.1): when a shot looks better as AI video or the engine can't do it
   (water, fire, crowds, crashes). Image-to-video from Brian's painting, no cast in clips, one test clip first,
   report credits spent. Brian pre-approved this.
5. **Voice**: if `ELEVENLABS_API_KEY` is set, `node tools/tts.js <slug>`; otherwise Brian records it in
   ElevenLabs/OpenArt from the spoken text, saves `videos/<slug>/voice.mp3`, then `node tools/align.js <slug>`.
   Print spoken text with
   `node -e "console.log(require('./engine/script.js').spokenText(require('fs').readFileSync('videos/<slug>/script.txt','utf8')))"`.
6. **Scene**: plates + cast + acting + camera per the shot plan (PLAYBOOK §2–3).
7. **Preview** stills → Read them yourself → fix (feet planted, light matches painting, faces readable,
   caption band clear, clue visible before it's explained) → send Brian the preview.
8. **Sound effects**: write `videos/<slug>/sfx-cues.js`, run `node tools/sfx.js <slug>` → `sfx.wav` (whooshes on cuts, footsteps, gadgets).
   **Render** 30 fps with voice + `sfx.wav` (and quiet `music.mp3` if present) → `final.mp4`. Commit (not huge mp4s), tell Brian the path.
9. **Cover + caption**: `node tools/cover.js <slug> <seconds> "LINE 1|LINE 2|LINE 3"` → `cover.jpg`. **The cover always shows
   the character** (a real frame with the cast and a clear, expressive face; no captions), headline in the top quarter.
   Write `post.md` (TikTok/Reels caption + hashtags, YouTube Shorts title) and send both to Brian.
   Caption line 1 = the search phrase; 3–5 niche hashtags, never only "#fyp", no swearing (PLAYBOOK §6b).
   Post slot per `docs/posting-schedule.md`: ≥ 3 h apart, a different topic every post, every post ≥ 1:02.

## Story rules (short version of PLAYBOOK §1)
- Choose the question word from the payoff: Why (reason) / Who (identity) / When (moment) /
  What (object/event) / How (process). Coon style opens "How the heck…": always "heck",
  never "f*ck" (spoken and captioned; ad-safe).
- Subject on screen during the question. Action starts in sentence two.
- Middle = a choice with a reason to expect success → apparent success → someone notices a detail we
  already saw → consequence back to someone we know. For mechanisms, track one object.
- **Zero-knowledge viewer** (PLAYBOOK §1.6a): assume they've never heard of the topic. Set up what the thing is
  before the twist; explain every term, name and number in plain words the first time; no skipped steps.
  Once a term is named ("thumbnail"), use that exact word every time after: no synonyms.
  Mechanism as an if-then example; say the surprise out loud; every number gets a yardstick and a cause.
- No side bets between characters (the disagreement is the stakes). Last line mirrors a line from the middle.
- "How does X work" topics: the mechanism is the video, explained simply INSIDE the story as it happens
  (cause → effect). **Never "Step one / Step two" or "three steps".** The story is a broken or surprising version
  of the thing; the clue is the part that behaves unexpectedly. No side trivia.
- Narrator bets early, changes their mind with us, voices the listener's question when it arises.
- Specific numbers, a joke/simile ~every 10 s, everyday analogy for the science, explanation held to
  ~60–75%, dry last line, then the **follow CTA** (PLAYBOOK §1.12, rotate A–E, default C: "Still here? Then that means you enjoyed the video. So follow and like for more.") No filler. Every sentence picturable.
- Never give personalized financial/legal/medical advice — explain how things work. History: no myths as fact.

## Script markup (`script.txt`)
`*word` gold · `!word` red · `{shown|spoken}` e.g. `{*$40|forty bucks}` · `[#cue]` invisible sync point
before every picture change · lines starting `#` are comments. Numbers as words in the spoken part.

## Engine reference
- **Cast** `engine/characters.js`: `CHAR.make({outfit:'hoodie'|'oxford'|'suit'|'polo'|'president'|'gang', phone, mask, beanie, envMap})` →
  `ch.root` (feet at y=0, faces +z), `ch.face('smile'|'happy'|'surprised'|'smirk'|'worried'|'flat'|'blink')`,
  `ch.pose({t, walk, walkAmt, look, nod, tilt, lean, armR:{raise}, armL:{raise}, gesture, gw})`;
  gestures `point|wave|shrug|cross|think|facepalm|hips|tada`. Pure functions of time.
  **Robot dog** `CHAR.robodog({envMap, rifle})` → `pose({t, walk, walkAmt, look, tilt, nod, pitch, crouch})` (trot gait, IK legs;
  scene cast entry `{outfit:'robodog'}`). Scene cast entries can be objects (`{outfit:'president', phone:true}`); plate `light` can be a preset name or a custom object.
- **Plates** `engine/lab/plate-lab.html`: `usePlate(name, zoom, panX, panY)` matches the 3D camera to a
  painting; plant feet with `K.placeAt(name, ix, iy)` on a painted floor pixel (presets: `hz` horizon fraction, `vx` vanishing x, `fov0`, `camH`, light preset) via
  `setViewOffset`; shadow catcher + blob shadows; convert material colors sRGB→linear.
- **Test renders** `node engine/lab/render-lab.js <outDir> --page plate-lab.html [--clip]`
  (Chromium needs `--allow-file-access-from-files`).
- **Legacy** gold-noir engine (`engine/kit.js`, `stage.html`, `tools/render.js`, `videos/buy-borrow-die`)
  still renders the old wireframe look. Wiring plates + cast into `scene.js`/`render.js` is the next
  build step (do it with `gas-vs-water`). Everything in `update` must be a pure function of `t`.
