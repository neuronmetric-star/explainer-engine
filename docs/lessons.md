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
- [ ] **The retell test:** a viewer could retell the story in 3 sentences (who wanted what → what went wrong → the surprising why).
- [ ] **Voice drama planned:** `voice-direction.md` marks where to slow down, speed up, pause and SHOUT; `voice-drama.json` set.
- [ ] **The problem is a problem:** "See, Doug had a problem." is followed by the problem itself, not his job title.
- [ ] Build → break → fix ("So… / But…"); the character's own mistake causes the break.
- [ ] A narrator bet ("Honestly? Looks perfect."), a joke about every 10 s, one open loop ("…was never the real reason").
- [ ] Names locked once defined (same word every time); the last line echoes the first; a do-it-yourself last line ("Next flight, find it.").
- [ ] Length: the final lands 1:05–1:15 (check after tightening the voice).

**Visual**
- [ ] **Visual hook:** frame 1 = the strange thing huge (5×); crash-zoom out within 0.55 s; a cast member reacts big (`scream`), whole and in frame by 0.6 s; white flash + shake + sting; `WHAT THE HECK?!` on screen.
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

## Results (fill in on the Sunday check)
| Video | Posted | Views (7 days) | 3-s hold | Watched to end | Shares | Saves | What it teaches |
|---|---|---|---|---|---|---|---|
| airplane-window-hole (v4) | | | | | | | |
