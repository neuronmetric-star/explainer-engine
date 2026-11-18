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
- **Silent 3D sphere-head cast** (`engine/characters.js`): Doug (hoodie), Gary (oxford + glasses),
  Victor (suit), polo guy. They act with gaze, posture, gestures, faces and timing.
- **Camera always moving**: push-ins, tracking walk-ins, hard cuts on reveal words; on paintings only
  zoom/pan (feet stay planted). Something changes every 2–3 s. No fades.
- **Captions**: one word at a time, white with thick black outline, y≈1270 of 1920. Gold = key/win, red = loss.
- **Two lengths, one format**: long form 8:00–9:30 (1,300–1,500 words) and short form ≈ 1:05
  (175–190 story words + CTA; just over TikTok's 1-minute payout line, never under 1:02; hook → middle → end). Both use Ray's skeleton + Xevi's narrator personality (PLAYBOOK §1.9–1.11,
  `docs/creators/ray-xevi-study.md`); short form is the same format compressed (§1.11).
- **One narrator** performs everyone's lines Xevi-style; silent characters gesture on their lines.

## The pipeline (always in this order)
0. **Length first:** if Brian didn't say "long" or "short", ASK him (long ≈ 8–9.5 min or short ≈ 1:05) before any research, script or other work. There is no default.
1. **Payoff → topic.** Write the one-sentence answer the viewer will discover.
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
8. **Render** 30 fps with voice (and quiet `music.mp3` if present) → `final.mp4`. Commit (not huge mp4s), tell Brian the path.

## Story rules (short version of PLAYBOOK §1)
- Choose the question word from the payoff: Why (reason) / Who (identity) / When (moment) /
  What (object/event) / How (process). Coon style opens "How the f*ck…" — captions show "f*ck";
  offer a clean version ("How the heck") if Brian wants ad-safe openings.
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
- **Cast** `engine/characters.js`: `CHAR.make({outfit:'hoodie'|'oxford'|'suit'|'polo', envMap})` →
  `ch.root` (feet at y=0, faces +z), `ch.face('smile'|'happy'|'surprised'|'smirk'|'worried'|'flat'|'blink')`,
  `ch.pose({t, walk, walkAmt, look, nod, tilt, lean, armR:{raise}, armL:{raise}, gesture, gw})`;
  gestures `point|wave|shrug|cross|think|facepalm|hips|tada`. Pure functions of time.
- **Plates** `engine/lab/plate-lab.html`: `usePlate(name, zoom, panX, panY)` matches the 3D camera to a
  painting (presets: `hz` horizon fraction, `vx` vanishing x, `fov0`, `camH`, light preset) via
  `setViewOffset`; shadow catcher + blob shadows; convert material colors sRGB→linear.
- **Test renders** `node engine/lab/render-lab.js <outDir> --page plate-lab.html [--clip]`
  (Chromium needs `--allow-file-access-from-files`).
- **Legacy** gold-noir engine (`engine/kit.js`, `stage.html`, `tools/render.js`, `videos/buy-borrow-die`)
  still renders the old wireframe look. Wiring plates + cast into `scene.js`/`render.js` is the next
  build step (do it with `gas-vs-water`). Everything in `update` must be a pure function of `t`.
