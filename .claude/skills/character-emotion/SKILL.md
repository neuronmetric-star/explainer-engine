---
name: character-emotion
description: Use when planning how the silent cast (Doug, Gary, Victor, etc.) shows feeling in a shot plan or scene — body, props, icons and overreactions, never dialogue. Use when writing acting notes per cue or fixing a flat scene.
---

# Character-emotion lane: how the silent cast shows feeling

Scope: educational and ad-safe only. The cast stays silent: mouths still, the narrator performs the lines [house rule: CLAUDE.md]. Take technique only, never a creator's characters.
Evidence key: `[@handle, plays]`. **TEST** = weak evidence.
Big winners (1M+): @thebuildingbox 20.3M, @unnecessaryengineering 14.8M, @justrichit 4.9M.

Web-research tags: OFFICIAL = the platform itself; VENDOR = tool/agency blog, usually no stated method (the Emplifi numbers come from Facebook Reels brand accounts, sample size not reported, text and tables partly disagree); CREATOR = a coach's teaching. Source: `docs/creators/How educator creators go viral.md`.

## Rules

1. **Emotion lives in bodies and props, never in dialogue.** [@unnecessaryengineering, 14.8M: dot-featured mannequin; emotion is waddling, getting sprayed, getting soaked; no facial expressions]; [@justrichit, 4.9M: faces barely act]. The summary says this is no contradiction with our cast.
2. **Use icons and stamps over heads.** Clock, thermometer, calendar icons and a "DENIED" stamp [@justrichit, 4.9M].
3. **Physical consequence = the joke.** Soaked legs, sprayed, soaked again at the end [@unnecessaryengineering, 14.8M]. Plan the body beat first, then the face.
4. **TEST: overreaction to a misread fact as a gag.** A silent character misunderstands the fact and reacts big (anger, then a thrown-out back) [@dailyunfunfact, 161.6K]. Only the structure, not the characters or the series, which is borrowed IP.
5. **TEST: visible loss and idea signals.** Head turns red and steams on a money loss; a lightbulb for the idea [@mr.benny.tv, 17.5K]. Check `engine/characters.js` for support first. If the cast can't do it, paint it as a prop or overlay. Don't invent an engine feature.
6. **TEST: props and eyes carry small reactions.** Googly eyes wobble, a shrug, a lightbulb over the head [@cardboard_cinema, 110.3K]. For us: use gestures `shrug|think|facepalm|tada` and faces `worried|surprised|smirk` that already exist [house: CLAUDE.md engine reference].
7. **One recurring character with a fixed costume and signature prop.** [@mr.benny.tv, 17.5K: top hat and vest]. We already have fixed outfits (hoodie, oxford + glasses, suit); keep them fixed, never change a costume between episodes [house rule].
8. **Show each win or loss twice: on the status object and on the character.** [@mr.benny.tv, 17.5K]. **TEST** at 1M+. Use our color code: gold win, red loss [house rule].
9. **TEST: make the viewer the "you" character.** Both 14M+ videos make the viewer the lead ("You dig…", "your legs"); [@thebuildingbox, 20.3M] has no characters at all. Try Doug as the "you" stand-in whose body takes the consequence. Not a measured result.
10. **Reactions land on the beat, not on the explanation.** Gaze, posture, then gesture on the cue word [house rule: cast acts with gaze, posture, gestures, faces, timing]. [@thebuildingbox, 20.3M: cuts on action verbs].
11. **Characters read big** (≥ 40% of frame height in wides, 55–70% in mediums) [house rule: PLAYBOOK §3.1].
12. **Body lane gap: a silent cast reacting to what a body does.** Neither anatomy account uses characters [study-body lane rules]. This is an opportunity, so **TEST** it as a first Body video.
13. **The hook has a reaction.** Scream/shake/sting on the reveal [house: `K.hookReact`, `K.slam`]. See `hook`.
14. **Keep reactions ad-safe.** No weapons (gang member is never armed), no gore, no real people [house rule].

### Added from the web research [source: How educator creators go viral.md]
15. **No study covers how a silent animated character's emotion affects retention.** Retention effect: not reported. The web rules below are standard animation practice, not data.
16. **Make emotion readable at phone size: big full-body poses** (recoil, slump, jump), not subtle faces. [animation practice]. Fits our gestures and body leans.
17. **Hold the key reaction briefly and pair it with a sound effect.** Best hold length: not reported. [animation practice]. Use `sfx-cues.js`.
18. **The character stands in for the "you" in the script** and reacts to whatever stakes the narrator names [web research, Character lane]. This supports rule 9. It's still **TEST**: no retention data.
19. **A consistent, exaggerated personality with recurring situations builds familiarity.** [Duolingo's Duo gained 6M+ followers in a year, 2023, older; Fast Company]. A recurring character or prop can carry a brand [Primate Economics' bananas; @mr.benny.tv, 17.5K].
20. **TEST: character in frame at 0 s.** [VENDOR, Emplifi: person on screen +3.6% at 3 s, +10.1% at 10 s, −2.4% at 30 s]. Untested for animation. See `hook`.

## Acting-notes template (per cue)
- Cue: ____
- Who: ____ (outfit fixed)
- Body beat (posture/gesture/consequence): ____
- Prop or icon: ____
- Face (from the existing list): ____
- Color tag: gold win / red loss / none

## Pre-publish checklist
- [ ] Does every emotional beat have a body or prop action, not just a face?
- [ ] Do all characters stay silent, with mouths still?
- [ ] Is there at least one physical consequence beat (soaked, sprayed, thrown back)?
- [ ] Does the final flip land on a body or prop reaction?
- [ ] Do wins show in gold and losses in red, on both the status object and the character?
- [ ] Are outfits and signature props unchanged from the model sheets?
- [ ] Is every reaction something `engine/characters.js` can do, or painted as a prop or overlay?
- [ ] Is it free of borrowed characters, weapons and unsafe content?

## Sources
- `docs/creators/study-science-2026-11-25.md`
- `docs/creators/study-money-2026-11-25.md`
- `docs/creators/study-general-2026-11-25.md`
- `docs/creators/study-body-2026-11-25.md`
- `docs/creators/study-summary-2026-11-25.md`
- `docs/creators/How educator creators go viral.md` (Character lane: practice, not data)
