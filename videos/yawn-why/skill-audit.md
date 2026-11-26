# Skill audit: yawn-why (Body Heck ep. 2) · STAGE 1: SCRIPT (run Nov 25 2026, lane skills loaded with the Skill tool)

Legend: ✅ pass · ⚠️ partial / decide · ❌ fail · ➖ not run or not yet measurable. Later stages (shot list, preview, final) append their own tables below.

## scout — ➖ not run (Brian chose "skip, use the research we have")
- No new creator was added, so the 1M+ filter / 3-latest-posts / borrowed-IP checks don't apply. Logged: "scout: not run".
- Topic source: the series list (`docs/series.md`, Body Heck #2); no trend sheet exists for Nov 25 and the scrape tool is banned.
- Body-lane gap from the research (nobody pairs a silent cast with anatomy) is the reason for this pick.

## hook (worksheet, filled)
| Field | Value |
|---|---|
| Search phrase | why do we yawn |
| Line 1 (you + object + surprise) | "You've yawned today, and scientists still can't agree why we yawn." |
| Line 2 (kills the obvious answer) | "It's not for air. And it's not just being tired." (kills two: air = Provine 1987; "just tired" = Princeton) |
| Frame 1 picture | Gary's open-mouthed yawn at 5× fills the frame → crash-zoom out in 0.55 s → Doug whole, mid-stretch |
| On-screen text, first 2 s | `WHY DO WE YAWN?` |
| Variant B for the A/B | question form "Why do we yawn? It's not for air…" (ep. 3 used the question form; this one is the statement/second-person form) |

| Hook check | Result |
|---|---|
| Voice at frame 0, search phrase in the first sentence | ✅ first word at 0 s; "why we yawn" lands ~2.5 s inside sentence 1 (confirm on the recording) |
| Line 1 puts the viewer in the scene | ✅ |
| Line 2 kills the obvious answer, promises stranger | ✅ |
| Strange thing huge in frame 1, camera moving | ➖ planned (shot list) |
| Surprise clear by 3 s | ✅ "scientists still can't agree" |
| Numbers in the hook sourced | ✅ none |
| Hook form logged for the A/B | ⚠️ to log in `docs/lessons.md` Results when the video is built |
| No borrowed IP / unsafe words | ✅ |

## script
| Check | Result |
|---|---|
| 5–7 fix → new-problem rungs | ✅ 5 rungs: pure oxygen → laps → "brain fan" idea (+ 160-people evidence, rats evidence) → contagion. Only 3 are spoken "Perfect! Except…"; the others are evidence beats |
| One final flip that undoes the ladder | ✅ "Doug yawns too … nobody knows why … I'd bet you just yawned … nobody's sure" undoes the "best idea so far" |
| Spoken re-hook near halfway | ✅ "So if it's not air … what is it?" at word 90/198 = 45% |
| Length 1:02–1:15, no padding after the payoff | ⚠️ est. 64.5 s from word count (198 words ≈ 3.12 w/s); measure after the voice. Payoff at 88%; 5 s after |
| Every number has a round value and a source | ✅ 1987 (Provine), 160 people (Gallup & Eldakar), "twice as fast" (exercise doubled breathing, Provine) |
| Loops close before the next opens, no "Step one/two" | ✅ |
| Last line mirrors a middle line | ✅ "So, why do we yawn?" echoes the hook |
| `docs/lessons.md` scorecard | ✅ narrator bet ("Honestly? I believed the air thing too."), jokes (pigeon, "Gary slept right through it"), the problem is a problem ("couldn't stop yawning"), names locked (air thing / laptop / fan), do-it-yourself last line ("feel the cool air"), retell test (3 sentences: tried air, then heat, nobody knows) |
| Science stated honestly | ✅ "best idea so far", "may pull", "nobody's sure" (brain cooling is the leading idea, still debated) |

## growth (plan)
| Check | Result |
|---|---|
| Last 5 s: flip / wide reveal / one metaphor | ✅ planned: city-sunset reveal + helicopter, both friends yawn (body flip) |
| CTA decision made on purpose and logged | ✅ send-to-a-friend line again (test #2, no follow button); different wording from ep. 3 |
| Spoken viewer question | ⚠️ none spoken ("I'd bet you just yawned" is a challenge, not a question); the pinned comment asks one. By design, to keep the send-line test clean |
| Share reason holds | ✅ "send this to someone who's yawning": the contagion makes it self-proving |
| Caption line 1 = search phrase, 3–5 niche hashtags | ➖ at the post kit |
| ≥ 1:02, ≥ 3 h after the last post, different topic | ⚠️ length est.; Fri Nov 27 is a day after ep. 3 (Thu Nov 26) ✅; topic differs ✅ |
| Differs from the last 3 posts in hook form, ladder, ending | ⚠️ hook form ✅ (statement, not question); but the "Perfect! Except…" ladder and the sunset ending repeat ep. 3's skeleton: **template-sameness risk** (growth rule 18). Kept because the ladder is the research's top script pattern and the ending is the signature. Brian can ask for a different skeleton next time |

## character-emotion (plan, acting notes)
| Cue | Body beat | Prop / icon | Face |
|---|---|---|---|
| hook | Gary's giant yawn; Doug jumps in mid-stretch, arms up | giant open mouth, `Z` | open mouth (`scream`/`surprised` as a static yawn) |
| card / joke | Doug yawns wide, head back; a pigeon perches near his mouth | pigeon prop | `surprised` |
| o2 / perfect / except | breathes from a tank, smiles, then slumps and yawns again | oxygen tank | `smile` → `worried` |
| laps | runs in place, still yawns | sweat drops | `worried` |
| cool / warm / pull | Doug fanned by a tiny fan icon, head cooling from red to light blue | thermometer, fan | `smile` |
| catch / doug2 | Gary yawns, Doug copies Gary's stretch one beat later | arrows between them | `blink` → open mouth |
| flip / ending | both yawn on the sunset roof as the helicopter crosses (final flip = body reaction) | helicopter | open mouth |
- Checks: every beat has a body/prop action ✅ · cast silent ✅ · a consequence beat (pigeon, slump) ✅ · final flip is a body reaction ✅ · outfits unchanged ✅.
- ⚠️ To check at the shot-list stage: `engine/characters.js` has no `yawn` face. Use `surprised`/`scream` as a static open mouth, or ask Brian before adding a face.

## visual (plan; measured at preview)
- Live numbers planned: `1987` stamp, `160 PEOPLE` counter climbing, a brain-temperature gauge (red → light blue), `TWICE AS FAST` breath counter. Our color code: red = hot/danger, light blue/white = cool air, gold = answer.
- Chunked captions (2–4 words) again as the TEST; ≤ 3 s between on-screen changes and a moving camera in every shot, including the last, will be measured on `scene.js` at the preview stage.
- ➖ Art: reuse B01 bedroom + E01 sunset + H01 helicopter; new art needed (brain/head cutaway, hot street, oxygen tank prop, pigeon prop); `art-prompts.md` after the script is approved.

---
# STAGE 2: SHOT LIST + ART PLAN (run Nov 25 2026 after "approved")

## visual (on the plan, estimated cue times)
| Check | Result |
|---|---|
| Something changes at least every 3 s | ✅ planned: 38 changes, avg 1.65 s; the first plan had 3 gaps over 3 s (3.4 s @46, 3.3 s @43, 3.0 s @37 and @0.6), fixed with ➕ beats (`joke`, `hot+1.5`, `rats+1.7`) and a hold on `hook+0.55`. **To re-measure on the real voice at the preview stage** |
| Camera moves in every shot, feet planted | ✅ every shot has a zoom/pan range, including the last (ep. 3's static `cta` shot is fixed) |
| A live counter / status | ✅ `100% OXYGEN`, `BREATHS ×2`, `1987`, `160 PEOPLE`, brain-heat gauge |
| Colors follow our code | ✅ red = hot/danger/no; light blue/white = cool air; gold = the answer |
| Caption style logged (chunks TEST) | ✅ `SCENE.captionChunk = 3` (TEST #2 for the chunk captions; no change in the engine) |
| SFX on cuts, key effect synced | ➖ at build (`sfx-cues.js`) |
| Paintings pass the PLAYBOOK §4 gate | ➖ when Brian sends the images |
| No borrowed IP / copied art | ✅ (own cast; B02-style head cutaway is our own series art) |

## character-emotion (acting notes in the table above)
| Check | Result |
|---|---|
| Every emotional beat has a body or prop action | ✅ stretch + head back, slump, running, Gary→Doug copy, pigeon gag |
| Cast silent, mouths still | ✅ (static hollow-`o` for the yawn) |
| A physical consequence beat | ✅ Doug yawns mid-run; the pigeon perches in his open mouth |
| The final flip lands on a body reaction | ✅ both friends yawn on the sunset roof |
| Wins gold / losses red on the object AND the character | ⚠️ gold/red are on labels and the gauge; the characters' bodies carry no color. Known gap; kept the cast's outfits fixed |
| Every reaction is in `engine/characters.js` or a painted prop | ✅ no new face; yawn = `surprised` + `nod` + arms up |
| Unsafe content | ⚠️ the "rats, tiny probes" line is the only animal-research mention (cartoon, gentle). Brian can cut that 1 line if he'd rather; it's marked in the script |

## growth
- ✅ ending plan (wide reveal + body flip), send-line test #2 · ⚠️ template-sameness risk (same ladder + signature ending as ep. 3) still open for Brian.

## hook
- ✅ frame 1 plan: Doug's giant yawn, crash-zoom 0.55 s, a separate `hook+0.55` hold shot, title from 0.25 s; the A/B form logged for the build stage.

## scout
- ➖ not run (Brian's choice).

---
# STAGE 3: FINAL RENDER (run Nov 26 2026; measured on `data.js`, `scene.js`, `final.mp4`; 1:10.2, 1080×1920, 30 fps)

## hook
| Check | Result |
|---|---|
| Voice at frame 0; search phrase in the first sentence | ⚠️ first word 0.00 s ✅; the title `WHY DO WE YAWN?` is on screen from 0.25 s ✅; but the spoken "…why we yawn" lands at 3.3 s (inside sentence 1, just past the 3 s mark). Fix next time: put the phrase earlier in line 1 |
| Strange thing huge in frame 1, camera moving | ✅ Doug's yawn fills the frame (5×), crash-zoom out in 0.55 s, flash + shake |
| Line 2 kills the obvious answers | ✅ "It's not for air. And it's not just being tired." |
| Hook form logged for the A/B | ✅ lessons Results row |

## script
| Check | Result |
|---|---|
| 5–7 rungs, a flip that undoes the ladder | ✅ oxygen → laps → brain fan (+160 people, +probe) → contagion → "nobody knows" |
| Re-hook near halfway | ✅ "So if it's not air … what is it?" at 49% |
| Length 1:02–1:15 | ✅ 1:10.2 (voice 69.2 s + 1.0 s tail); 5 s after the payoff |
| Numbers sourced | ✅ 1987, 160 people, "twice as fast" |
| Last line mirrors the hook, scorecard (bet, jokes, retell) | ✅ |

## visual (measured from the real cue times)
| Check | Result |
|---|---|
| Something changes at least every 3 s | ⚠️ 44 planned changes, avg 1.58 s; longest gap 3.1 s (@23.9 s, after the "1987" stamp), next 2.9 s. Marginal |
| Camera moves in every shot | ✅ 0 shots with equal start/end zoom (ep. 3's static `cta` is fixed) |
| Live counter / status | ✅ `100% OXYGEN`, `BREATHS ×2`, `1987`, `160 PEOPLE`, `YAWNS ↓`, brain-heat gauge |
| Colors follow our code | ✅ |
| Captions (chunks TEST #2) | ✅ logged |
| SFX | ⚠️ `sfx.wav` 57 events on cues; not listened to (no audio playback here) |
| Paintings pass the §4 gate | ✅ by eye: B08 two beds, B07 brain, B06 street; the first brain room was rejected and replaced |

## character-emotion
| Check | Result |
|---|---|
| Both friends clearly lie on their own beds | ✅ Gary (left, green bed) and Doug (right, navy bed), head on the pillow; Doug stands only for the laps |
| Body/prop emotion, silent cast | ✅ yawn = hollow-`o` + stretch, pigeon gag, running, Gary → Doug copy |
| Final flip is a body reaction | ✅ both yawn at the sunset |
| Gold/red on the character as well as the label | ⚠️ labels and the gauge only (known gap) |
| Placement quality | ⚠️ the lying poses are fitted by a hand-tuned solver against the painting (hz .2, camH 2.5); the bodies hover slightly above the mattresses and look stiff. Fine at phone size, not perfect |
| Unsafe content | ✅ no rat on screen; a drawn probe wire only |

## growth
| Check | Result |
|---|---|
| Last 5 s: wide reveal + body flip | ✅ sunset + helicopter, both friends yawn |
| CTA decision logged | ✅ send-to-a-friend line (test #2); no follow button |
| Spoken viewer question | ⚠️ none spoken; the pinned comment asks one |
| Template sameness vs ep. 3 | ⚠️ same ladder + sunset ending; hook form and send-line wording differ |
| Caption line 1 = search phrase; 3–5 niche hashtags | ✅ (`post.md`) |
| ≥ 1:02, ≥ 3 h after the last post, a different topic | ✅ (slot: Fri Nov 27) |

## Open items
- Lab rat painting (P08): not delivered; skipped on purpose (see `post.md`).
- Engine note: `K.rayPoint` added to `engine/plate-kit.js` (unused after the fit was simplified; harmless).

## Revision Nov 26 (Brian: "make them a tiny bit smaller")
- The two lying figures were scaled to 85% (Gary 1.527 → 1.297, Doug 1.340 → 1.139) and re-solved so each head stays on its pillow (residual 0 px). Standing shots (laps, sunset) are unchanged (they must read ≥ 40% of the frame height). Re-rendered: 1:10.2.

---
# v4 EXPLAINER CUT (Nov 26 2026): final render ≈ 1:12 (72.0 s), 1080×1920, 30 fps; measured on `data.js`, `scene.js`, `final.mp4`
Brian's direction: "just say why do we yawn and jump into an explainer; Doug only at the beginning, to bring the problem; then images, no more Doug."
The v2 render and files are archived in `v2_archive/` (do not post).

## follow-through gate (script skill, rules 26–32)
| Check | Result |
|---|---|
| Promise ledger: every promise paid off | ✅ `notes.md`: "Why do we yawn?" → the mirror; Doug's problem → "A yawn isn't a flaw… Nothing's wrong with him. Probably."; "extra air" → the 1987 test; "Then what is it?" → heat/fan; "Does it fit?" → 160 people + rats; "still a mystery" left open on purpose |
| Causal chain, every link spoken; analogies bridged | ✅ belief stated BEFORE the bet; laptop → "a laptop uses a fan to cool down" → "a yawn may be your brain's fan"; "hot air can't cool you off" bridges the 160-people result |
| Character problem resolved | ✅ |
| Retell written out | ✅ (in the notes). Not tested on a real viewer: that is the next step |

## hook
| Check | Result |
|---|---|
| Voice at frame 0; search phrase in the first sentence | ✅ first word at 0.00 s; "Why do we yawn?" fully spoken by 0.75 s (v2 was 3.3 s); title on screen from 0.25 s |
| Strange thing huge in frame 1, camera moving | ✅ Doug's giant yawn, crash-zoom out in 0.55 s, flash + shake |
| Line 2 kills the obvious answer | ⚠️ by design: Brian asked for a plain "Why do we yawn?" opener. The belief is killed later, with the 1987 test |

## script
| Check | Result |
|---|---|
| Re-hook near halfway | ⚠️ "Then what is it?" at 30%: early, because that is where the question genuinely arises |
| Flip that undoes the ladder | ⚠️ not a ladder any more: an explainer chain that ends open ("nobody's sure") + Doug's relief. By design |
| Length 1:02–1:15 | ✅ voice 71.0 s (raw 96.5 s, tempo 1.33× chosen by `tools/tighten.js`) + 1 s tail = 72.0 s; 5.8 s after the payoff |
| Numbers sourced | ✅ 1987, 160 people, "twice as fast" (sources.md) |
| Hedges | ✅ "best idea so far", "may", "not every scientist agrees", "nobody's sure" |

## visual (measured on the real cue times)
| Check | Result |
|---|---|
| Something changes at least every 3 s | ✅ 47 changes, avg 1.50 s, longest gap 2.4 s (the four 3.1–3.6 s gaps found on the first pass were filled) |
| Camera moves in every shot | ✅ 0 shots with equal start/end zoom |
| Live counter / status | ✅ `1987`, `100% OXYGEN`, `BREATHS ×2`, `160 PEOPLE`, `YAWNS ↓`, brain-heat gauge |
| Colors follow our code | ✅ |
| Captions | ✅ 2–4 word chunks (TEST #3) |
| SFX | ⚠️ `sfx.wav` 46 events on cues; not listened to (no audio playback here) |
| Paintings | ✅ B08 bedroom, B07 yawning head, B06 hot street (all chosen by Brian) |

## character-emotion
| Check | Result |
|---|---|
| Doug only in the opening, then images only | ✅ Doug lies on his bed, mid-yawn, in the first ~5 s; Gary's bed is empty; 5–58 s is images only |
| The cast's other appearance | ⚠️ the signature city-sunset goodbye (house rule) shows Doug and Gary yawning with the helicopter; Brian can drop it |
| Body emotion, silent | ✅ the yawn = hollow-`o` + stretch |

## growth
| Check | Result |
|---|---|
| Last 5 s: wide reveal | ✅ sunset + helicopter |
| CTA | ✅ send-to-a-friend line (test #2/#3); no follow button |
| Spoken viewer question | ⚠️ none; the pinned comment asks one |
| Template sameness vs ep. 3 | ✅ different structure (explainer chain, not the ladder); same signature ending |
| Caption line 1 = the search phrase; hashtags | ✅ (`post.md`) |

---
# v4.2: A DIFFERENT PAINTING FOR EACH IDEA (Nov 26 2026; Brian: "more different images following the script" + the rat). Final render 72.0 s.
New paintings: B09 classroom, B10 1987 lab, B11 treadmill lab, B12 laptop desk, B13 winter/summer street, B14 rat bench + the rat prop (P08), B15 waiting room. The oxygen-tank and laptop props are now painted into B10 / B12.

## visual (new rule 27: one painting per idea, never one picture for more than ~12 s)
| Check | Result |
|---|---|
| Distinct paintings | ✅ 11 (was 6): bedroom, classroom, 1987 lab, treadmill lab, head/brain, laptop desk, split street, hot street, rat bench, waiting room, sunset |
| Longest time on one painting | ✅ 6.7 s (the hot street); the sunset goodbye holds 10.1 s (signature, with the helicopter) |
| Each idea has its own picture | ✅ extra air → classroom · 1987 oxygen → lab · exercise → treadmill · laptop → desk · 160 people → winter/summer + hot street · rats → bench + rat · yawns spread → waiting room (a ripple of "AAAH") · answer → head |
| Rat | ✅ Brian's rat painting is the prop on the bench; no drawn wire needed; the rat is a cartoon (no research on screen beyond the probe wire) |
| Pace, camera, counters | ✅ unchanged from v4 (every shot moves; avg change 1.5 s; the longest gap was 2.4 s before the "AAAH" ripple was added) |
| Not checked | ⚠️ sfx not listened to; the finished file with sound not watched end to end |
