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
