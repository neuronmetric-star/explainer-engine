# Lessons log: how every video makes the next one better

Brian, Nov 24 2026: "make sure to always have scripts that make sense and are easy, an attention-grabber hook visual and a voice
attention-grabber. Also, how can we always have continuous improvements?" This file is the answer. Claude reads it **before every
script**, runs the scorecard on every script and shot plan, and adds to it after every video.

## The loop (every video)
1. **Before writing:** read this file. Every past note below is a rule now; none may come back.
2. **Before showing Brian a script:** run the scorecard. Fix every "no" first. Show the scorecard under the narration.
3. **Before the full render:** run the visual half of the scorecard on preview stills.
4. **When Brian gives a note:** fix it, then add a row to "Brian's notes" below with the rule it became (and put the rule in
   the scorecard or the playbook).
5. **After posting (Sunday weekly check, `docs/posting-schedule.md`):** add the video's numbers to "Results" below.
   The best video and the worst video of the week each produce one new rule. If people leave in the first 3 s, fix the hook;
   if they leave in the middle, fix the pacing; if they don't share or save, fix the ending (do-it-yourself check, surprise).
6. **Keep studying winners:** each week, run 2–3 new viral videos in our lanes through the TikTok AI app (`/run` in the app),
   save the lessons in `docs/creators/`, and steal one thing into the scorecard.

## The scorecard (all "yes" before Brian sees it)
**Script**
- [ ] **Voice hook:** the first spoken line is about the VIEWER ("How does YOUR printer work?") + the surprise. The shouted "WHAT THE HECK?!" opener is on test (dropped on printer-how-it-works, Nov 24): decide by 3-s hold vs sleep-two-minutes.
- [ ] **Hook line = YOU + the object + the surprise** (creator studies Nov 22–23: storm drain 10.9M, cutting board 6.4M, hay hole 9.2M). Best types, in order:
      (1) reverse a habit the viewer has ("If you never print to save ink, you're wasting it" / "those gray lines are not just knife marks"),
      (2) a "what if you…" scenario with action in second 0 ("If you cut a hole in your street…"), (3) the whole absurd outcome in one sentence (Ray).
      Doug and Gary come in at line 2–3, never as the hook (a stranger's name in second 3 is a speed bump).
- [ ] **The mystery is shown in the first 5 s** ("Look closely. A tiny hole. Looks like a mistake. It's not.").
- [ ] **A 10-year-old understands every line.** No jargon. If a word needs Google, swap it (pane → layer, pressure → push).
- [ ] **One idea per sentence**; every "it" clearly points to one thing ("His window fogs up", not "It fogs").
- [ ] **No number without a picture:** say the plain version ("way above the clouds"); the number goes on screen only.
- [ ] **Every step has an everyday comparison** (balloon, milk jug, spare tire, breath on a cold window, a door pushed from both sides).
- [ ] **Follow-through gate (Nov 26 2026, `.claude/skills/script`):** a promise ledger (every promise the hook/loops make is paid off), the causal chain written "A because B so C" with every link SPOKEN, every analogy bridged aloud, the character's problem resolved, "Perfect! Except…" only for real attempts. Never cut a "because" to save words.
- [ ] **The retell test:** a viewer could retell the story in 3 sentences (who wanted what → what went wrong → the surprising why).
- [ ] **Voice drama planned:** `voice-direction.md` marks where to slow down, speed up, pause and SHOUT; `voice-drama.json` set.
- [ ] **The problem is a problem:** "See, Doug had a problem." is followed by the problem itself, not his job title.
- [ ] Build → break → fix ("So… / But…"); the character's own mistake causes the break.
- [ ] **Ladder + re-hook (creator research Nov 25, `.claude/skills/script`):** "Perfect! Except…" rungs (each fix causes the next problem), one final flip that undoes it, a spoken re-hook ("what about coming down?") near the halfway mark. Winners 14.8M / 20.3M used 5–7 rungs; ours had 4 because of the 1:15 cap.
- [ ] A narrator bet ("Honestly? Looks perfect."), a joke about every 10 s, one open loop ("…was never the real reason").
- [ ] Names locked once defined (same word every time); the last line echoes the first; a do-it-yourself last line ("Next flight, find it.").
- [ ] Length: the final lands 1:05–1:15 (check after tightening the voice).

**Visual**
- [ ] **Visual hook:** frame 1 = the strange thing huge (5×); crash-zoom out within 0.55 s; a cast member reacts big (`scream`), whole and in frame by 0.6 s; white flash + shake + sting; `WHAT THE HECK?!` on screen.
- [ ] **Live numbers + body emotion (creator research Nov 25):** a counter or label that changes on screen (`8,000 FT`), emotion in bodies and props only; captions in 2–4 word chunks are a TEST (`SCENE.captionChunk = 3`; default is one word at a time).
- [ ] Smooth: whip-pans between places (`SCENE.whip`), same-place shots continue the camera, ~15–20 shots, no 2-s choppy cuts.
- [ ] Diagrams move (flowing arrows, drifting particles); one cutaway plate that grows; the color code.
- [ ] Few words on screen: hook title, key numbers, 1–2 labels, the final idea. Nothing in the caption band.
- [ ] Every key comparison is a picture (e.g. the door shot).
- [ ] Bodies are never cut by a straight line: cover with the real outline of a painted object, or reframe.
- [ ] **Seated cast sits ON the seat** (bed, chair, bench): hips over the cushion, feet on the floor, checked in the WIDE shot.
- [ ] Faces readable, nobody cropped at the frame edge, the follow button clear of heads.
- [ ] **The signature goodbye:** the last story line whip-pans to the city-sunset rooftop (`E01`), the helicopter crosses, the winner looks up, then the CTA.

## Brian's notes → the rule they became
| Date | Video | Brian said | What we changed | Rule now |
|---|---|---|---|---|
| Nov 23 | airplane-window-hole | "this is not good" (cabin art) | redo: front of cabin, wide floor, strong sun beams | art: open floor + strong light every background (playbook §4) |
| Nov 24 | airplane-window-hole | "Planes fly seven miles up… I don't understand" | "Planes fly way above the clouds"; number on screen only | no number without a picture |
| Nov 24 | airplane-window-hole | "He builds airplane windows (what does this even mean)" | "His job: build a plane window that won't break" | the problem must be a problem |
| Nov 24 | airplane-window-hole | "not the best explainer… not smooth enough" | v3: plain words, door comparison, whip-pans, flowing diagram, less text | playbook §3.5 #9–11 |
| Nov 24 | airplane-window-hole | "create another script that anyone can understand" | v2/v3 plain-words script | the 10-year-old test |
| Nov 24 | airplane-window-hole | "use what we worked on" | v3 applies every creator-study lesson | read `docs/creators/` before scripting |
| Nov 24 | airplane-window-hole | "create a visual hook… and the what the heck screamed out" | v4: shouted hook + crash-zoom/scream | playbook §3.5 #12, scorecard line 1 |
| Nov 24 | airplane-window-hole | "he is cut off his feet. that does not look good" | tray cut to its real outline; Gary sits cross-legged | no straight-line cut-offs |
| Nov 24 | airplane-window-hole | "the what the heck needs to be louder… slowed down, faster in other places… for drama" | `tools/voice_drama.js`: hook +9 dB with punch, slow reveals, quick setup; `voice-direction.md` for recording | every video: voice direction + drama pass |
| Nov 24 | airplane-windows-round | "our helicopter ending with the city background… it is a signature goodbye" | `E01_city_sunset_ending.png` in `docs/assets/` (painted once, matches the original clip); playbook §1.12a | every video ends on the city sunset |
| Nov 24 | airplane-windows-round | "Remove tags. My voice recorder does not understand them" | a CLEAN copy with drama by punctuation only (`…`, `!`, short lines, no CAPS, no brackets) | every voice-direction.md ends with a clean, tag-free copy |
| Nov 24 | airplane-windows-round | "always develop a strong story any viewer can follow" | the retell test added to the scorecard | retell in 3 sentences |
| Nov 24 | sleep-two-minutes | "Make sure visual hook is very strong" | frame 1 = the strange thing at 5× (sleeping Gary + giant Z's), crash-zoom out in 0.55 s, white flash + shake + sting on the scream, then HOLD a two-shot with the screamer fully in frame | hook check on stills: at 0.05 s the strange thing fills the frame; at 0.6 s the screamer is whole, big and mid-scream (`flashes` + `shakes` on scream+0.28) |
| Nov 24 | sleep-two-minutes | "They are not on the bed. Or chair." | measured the painting on a pixel grid: hips placed over the seat (not the feet in front of it), root height = seat height − 0.92 (bed ≈ .71 m → −.21, armchair ≈ .45 m → −.47), thighs sloped on tall seats so feet touch the floor | seated cast: grid the painting, put the hips ON the seat, check the wide shot before the close-up |
| Nov 24 | sleep-two-minutes | "Put Gary in the bed and the other one on the chair, that makes more sense" | the sleeper is IN the bed (head on the pillow, the painted duvet cut out with `tools/occluder.py` and drawn over him, body hidden), the one who can't sleep sits up in the chair | staging must match the story: whoever sleeps is in the bed; check "does this make sense?" on every set before building |
| Nov 24 | sleep-two-minutes | "Make Gary lay flat on the bed… his whole body flat, sized normal… no sheets, eyes closed" | lying pose: the standing pose laid on its side (`rotation.set(0, ry, PI/2)`), head solved onto the pillow pixel and scaled so the feet reach the far end of the bed; no occluder | a sleeping character lies flat ON the bed, whole body visible, normal size, eyes closed |
| Nov 24 | printer-how-it-works | "Make it more viewer based, like how does YOUR printer work… is the why/what the heck helping us? If not, remove it" | the viewer is the main character ("you", "your dog"), Doug acts it out silently; the shouted opener dropped for this video as a test | viewer-first lines; the shout stays only if the 3-s hold says it helps |
| Nov 24 | printer-how-it-works | "No, I just wanna explain a video on how a printer works" | dropped the ink-saving twist; follow one photo from "print" to paper (map of dots → rollers → sliding box → heater boils a bubble → dots → next row), one short true-story beat, one practical catch | when Brian asks for "how X works", the mechanism IS the video; no added twist he didn't ask for |
| Nov 24 | high-conversation | "I want the setting to be a chill place and Doug and Gary to look the part" | chill den set (couch, lava lamp, string lights); `chilldoug` / `chillgary` outfits + `chill`/`zoned`/`giggle` faces in `engine/characters.js` | the set AND the cast's clothes/faces match the video's vibe; new looks get a cast-sheet preview before any art |
| Nov 24 | high-conversation | "the other ones don't make sense… make more points like Cleopatra… stupid true facts that are real" | dropped the nonsense lines (who invented hands, cereal soup); every line is a sourced mind-blowing fact, each one leading to the next | in a skit, every "crazy" line is a TRUE fact the viewer can repeat; no filler jokes in the characters' mouths |
| Nov 24 | high-conversation | "I got a better one for you… they cracked up" | one-upping refrain ("Okay… I got a better one") + "They crack up." beats with laugh SFX | conversations escalate (each line tops the last) and the cast reacts like real friends between beats |
| Nov 24 | high-conversation | "Can you make their eyes red" | `redEyes: true` option in `engine/characters.js` (pink-red whites + veins; on by default in `chilldoug`/`chillgary`) | Brian decides the vibe vs reach trade-off; Claude flags the risk once, then does it |
| Nov 25 | all | "use all the research and the six skills to make a video" | 13 top videos + web research became six skills in `.claude/skills/` (scout, hook, script, visual, character-emotion, growth) and the ears-pop-plane video applies them | read the lane skill before each step; every rule carries evidence and TEST marks |
| Nov 25 | ears-pop-plane | "keep the helicopter ending, it's our signature; keep Doug and Gary; update visuals as needed" | helicopter + city sunset kept; ladder, counters and chunked captions added; no shouted hook; send-to-a-friend last line, no follow button | tests logged in Results: no-shout hook, caption chunks, send line. Judge by 3-s hold, watch-to-end and shares |
| Nov 25 | ears-pop-plane | (build) the hook crash-zoom was stretched over the whole 2 s shot, and cabin cast was too big (camH) | split the hook into `hook` (0.55 s zoom) + `hook+0.55` hold; plate `01` camH 2.6 | a crash-zoom shot must last 0.55 s (add a `cue+0.55` shot); set a new plate's `camH` so the cast reads ~45% of the frame |
| Nov 26 | yawn-why | "we need a new bedroom. two beds, one for Gary and one for Doug; they need to clearly lay on bed" | new two-bed room B08; both lie flat on their own beds (fit solved against the plate camera, hz .2 / camH 2.5); Doug stands only for the laps | a "who sleeps where" set gets one bed per character, both clearly lying, checked in a WIDE preview before any close-up; judge size/fit at zoom ~1.0, then zoom in |
| Nov 26 | yawn-why | "we need a new brain room, I don't like it at all" → sent a brain painting | the brain painting (B07) replaced the "control room"; a drawn probe wire replaced the rat prop | a concept must read at phone size: show the thing itself (a glowing brain), not a metaphor room |
| Nov 26 | yawn-why | (build) I saved the wrong file as the rat prop (an inline image wasn't saved) | deleted it; the scene skips the rat | after saving images, view each file once; never use an image that didn't arrive as a file |
| Nov 26 | yawn-why | (build) an MP3 arrived that was byte-identical to the previous video's voice | detected by size/checksum and discarded | checksum every voice file against previous episodes before using it |
| Nov 26 | ears-pop-plane, yawn-why | "what is missing from our explanations? why aren't you able to have clear follow-through scripts?" | v2 scripts skipped causal links (plane = mountain; why descent hurts; hot air can't cool you), left a hook promise unpaid ("not just tired") and the character's problem unresolved; I had marked the scorecard passed without writing the retell | follow-through gate added to the script skill + this scorecard; v3 scripts written against it; retell must be written out |
| Nov 26 | all | "longer texts are okay, we can just 1.2 or 1.4x it" | the 175–190 word cap is gone; `tools/tighten.js` picks a 1.2–1.4× tempo so a longer script lands at 1:05–1:15; the follow-through lines I had cut are restored | never cut a "because" for a word count; fit length with the tempo (≤ 1.4×) |
| Nov 26 | yawn-why | "forget the scientist hook: just say why do we yawn and jump into an explainer; Doug only at the beginning, with images, no more Doug" → "this does not make any sense, rewrite the full script correctly" | v4: opens "Why do we yawn?", Doug's problem in 5 s, then images only; the belief is stated BEFORE the narrator's bet; every idea introduced before it is used; the fan idea says why; Doug's problem closes with a reason | introduce an idea before you refer to it ("the air thing" needs the air claim first); an explainer chain (claim → test → so → best idea → evidence → open question) can replace the ladder; the cast appears only where the story needs it |
| Nov 26 | yawn-why | "you didn't include the rat image and I would like more different images following the script" | the rat painting never reached my files (it was pasted inline): ask for attached files; BATCH 4 = seven new paintings, one per idea; the head painting is kept only for the answer | one painting per idea, never one picture for > ~12 s; plan the beat → image table before asking Brian to paint; verify every image Brian sends exists as a file before saying it's used. Done: v4.2 uses 11 paintings, longest hold 6.7 s (+ the 10.1 s signature ending) |

## Results (fill in on the Sunday check)
| Video | Posted | Views (7 days) | 3-s hold | Watched to end | Shares | Saves | What it teaches |
|---|---|---|---|---|---|---|---|
| airplane-window-hole (v4) | | | | | | | |
| ears-pop-plane (1:06.7) | | | | | | | TESTS: no-shout "Why do YOUR…" hook, 2–4 word caption chunks, send-to-a-friend last line (no follow button); compare 3-s hold with sleep-two-minutes (no-shout) and the shouted ep. 1–2 |
| yawn-why v4 (≈1:12) | | | | | | | TESTS: plain "Why do we yawn?" opener + Doug problem then images only (no cast), 2–4 word caption chunks, send-to-a-friend last line (no follow button); compare 3-s hold and watch-to-end with ears-pop-plane and the shouted ep. 1–2 |
