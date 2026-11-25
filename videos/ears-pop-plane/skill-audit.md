# Skill audit: ears-pop-plane (run Nov 25 2026 with all six lane skills loaded)

Measured on the real files (`data.js`, `scene.js`, `final.mp4`), not eyeballed, unless marked "by eye".
Legend: ✅ pass · ⚠️ partial · ❌ fail · ➖ not applicable / not run

## hook
| Check | Result |
|---|---|
| Voice starts at frame 0, search phrase in line 1 and on screen within 2 s | ✅ first word at 0.00 s; title on screen from 0.25 s |
| Line 1 puts the viewer in the scene | ✅ "Why do YOUR ears pop on a plane?" |
| Line 2 kills the obvious answer, promises something stranger | ⚠️ "They're not broken" kills the worry, but the "stranger" answer (a tiny door) arrives in line 3 |
| Strange thing huge in frame 1, camera already moving | ✅ giant eardrum, crash-zoom 4.6 → 1.15 in 0.55 s |
| Surprise clear by 3 s in plain words | ✅ "tiny door inside your head" at ~2.5 s |
| Every number in the hook sourced | ✅ the hook has no number |
| Hook form logged for the A/B | ✅ lessons Results row |
| No borrowed IP / copied lines / unsafe words | ✅ |

## script
| Check | Result |
|---|---|
| 5–7 fix → new-problem rungs | ❌ 4 (house 1:15 cap). Known; flagged in lessons |
| One final flip that undoes the ladder | ⚠️ the flip ("the pop is the small version") reframes; it does not undo the ladder |
| Spoken re-hook near halfway | ✅ "what about coming down?" at 29.9 s = 45% |
| Length 1:02–1:15, no padding after the payoff | ✅ 1:06.7; 5.3 s after the payoff (diy + CTA) |
| Every number has a round value, yardstick and source | ⚠️ "8,000 FT" is sourced (FAA); the 1,000 → 8,000 FT counter on the mountain is illustrative and wasn't labelled in `sources.md` (now fixed) |
| Each loop closes before the next; no "Step one/two" | ✅ |
| Last line mirrors a middle line, ends on one visual metaphor | ❌ the last spoken line is the send line; the "door" from the hook doesn't come back (cut to save words) |
| Passed the `docs/lessons.md` scorecard | ❌ no narrator bet and no joke about every 10 s: the dry narrator personality is missing. I told Brian the scorecard was checked; it was not fully |

## visual
| Check | Result |
|---|---|
| Something changes every ≤ 3 s | ⚠️ avg 2.0 s between changes; 4 gaps are 3.0–3.7 s (22.7, 39.2, 8.8, 17.5 s) |
| Camera moves in every shot, feet planted | ⚠️ 1 static shot: `cta` (zoom 1.1 → 1.1, 2.7 s) |
| A live counter / day counter / status card | ✅ ALTITUDE counter 1,000 → 8,000 FT, `UP TO 8,000 FT` |
| Colors follow our code | ✅ white push, red squeeze/shut, gold door/answer |
| Caption style logged (chunks TEST) | ✅ |
| SFX placed on cuts, key effect synced | ⚠️ `sfx.wav` built with 40 events on cues; not listened to (no audio playback here) |
| Paintings pass the PLAYBOOK §4 gate | ✅ by eye (no text, clear floor zones, calm band) |
| No borrowed IP / copied art | ✅ |

## character-emotion
| Check | Result |
|---|---|
| Every emotional beat has a body or prop action | ✅ hands on ears, slump, Z's, icons, POP burst |
| Cast silent, mouths still | ✅ (static scream face only) |
| At least one physical consequence beat | ✅ the squeeze → Gary's "OUCH" jump |
| The final flip lands on a body/prop reaction | ❌ the "SMALL" flip is a label on the ear painting; no character reacts |
| Wins gold and losses red on the object AND the character | ⚠️ colors are on labels only; the characters' bodies carry no color signal |
| Outfits unchanged | ✅ |
| Every reaction is in `engine/characters.js` or a painted prop | ✅ |
| No borrowed characters / weapons / unsafe content | ✅ |
| Simplified beat | ⚠️ "Doug hands out gum": the gum pack slides in; Doug isn't on screen |

## growth
| Check | Result |
|---|---|
| Last 5 s end on irony flip / wide reveal / one visual metaphor | ✅ wide reveal: city sunset + helicopter (my inference) |
| CTA decision made on purpose and logged | ✅ send-to-a-friend line, no follow button |
| A spoken viewer question where we want comments | ❌ none spoken; the pinned comment asks one in the caption only (the skill says that pulls fewer replies) |
| Share reason holds up | ✅ plausible (a useful tip + "the friend who grabs their ears") |
| Caption line 1 = search phrase, 3–5 niche hashtags | ✅ |
| ≥ 1:02, ≥ 3 h from the last post, different topic | ⚠️ length ✅; the slot isn't confirmed yet |
| Differs from the last 3 posts in hook form, ladder shape, ending | ⚠️ hook form ✅ and ladder shape ✅ (new); the ending is the signature on purpose |
| Numbers row ready for the Sunday table | ✅ |

## scout
➖ Not run: no new creator study this time and no trend sheet exists for Nov 25 (the scrape tool is banned). The topic came from the series list.

## Open decisions for Brian (not changed in CLAUDE.md)
1. Follow CTA (CLAUDE.md, PLAYBOOK §1.12) vs the send-to-a-friend line (growth skill). The video used the send line.
2. One-word-at-a-time captions (CLAUDE.md) vs 2–4 word chunks (visual skill). The video used chunks (engine option `captionChunk`).

## Fix list if we re-render (v2)
1. Add a narrator bet + 1–2 dry jokes (needs a re-record: ~2 lines).
2. Bring the door back in the ending ("…and feel the door open") so the last line mirrors the hook.
3. Give the flip a character reaction (Gary relaxes / Doug tada at "small").
4. Fill the 3.0–3.7 s gaps (a new overlay at 24.5, 41.2, 10.3 and 19 s) and move the camera on the `cta` shot.
5. A spoken one-word viewer question OR keep the send line and accept fewer comments (a choice).
