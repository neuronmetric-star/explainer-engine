---
name: script
description: Use when writing or reviewing a video script's structure — open loops, the "Perfect!… Except…" fix-and-problem ladder, the final flip, the mid-video re-hook, the ending, and length (must stay over 61 s). Use before showing Brian any narration.
---

# Script lane: structure, open loops, flip, length

Scope: educational and ad-safe only. Take structure and technique, never a creator's script. Never invent numbers; if a stat wasn't reported, write "not reported".
Evidence key: `[@handle, plays]`. **TEST** = weak or conflicting evidence, run as an experiment.
Big winners (1M+): @thebuildingbox 20.3M (67 s), @unnecessaryengineering 14.8M (71 s), @justrichit 4.9M (66 s).

Web-research tags: OFFICIAL = the platform itself; VENDOR = tool/agency blog, usually no stated method (the Emplifi numbers come from Facebook Reels brand accounts, sample size not reported, text and tables partly disagree); CREATOR = a coach's teaching. Source: `docs/creators/How educator creators go viral.md`.

## Rules

### The ladder (explainer mode)
1. **Use the "Perfect!… Except…" ladder.** Each fix causes the next problem. 5–7 rungs in about 70 s.
   - [@unnecessaryengineering, 14.8M: about 5 rungs: long coat → wheels → dome → windshield → full 4x4 car]; [@thebuildingbox, 20.3M: about 7 rungs: overflow → no exit → heat scorches plants → can't cross → nowhere to sit → waterfall → paths].
   - Every answer opens the next question [@thebuildingbox, 20.3M].
2. **End with one final flip that undoes everything.** Example: you reach the destination and get soaked anyway.
   - [@unnecessaryengineering, 14.8M: irony flip at the end]. This maps onto our "flip" beat [house: CLAUDE.md story rules].
   - Note: [@thebuildingbox, 20.3M] ended on a wide reveal ("Congratulations!"), not an undoing flip. So the flip is evidenced by one 1M+ video; **TEST** it on topics that don't suit irony.
3. **Escalate the fixes to something absurd, then flip.** [@unnecessaryengineering, 14.8M].
4. **Keep it a story, not steps.** Never "Step one / Step two" [house rule: CLAUDE.md]. The ladder is cause → effect inside a story, so it's compatible.

### The re-hook
5. **Put a spoken re-hook question at about the halfway mark** ("But what happens when…?").
   - [@justrichit, 4.9M: re-hook at 0:31 of 66 s, "But what happens when everyone shows up?"]; [@null.monolith, 19.6K: "But didn't Tom just lose everything? No."].
   - Only one 1M+ video shows it, so **TEST** the exact placement. The re-hook should reopen the question the first half answered.

### Loops and clarity
6. **Close each loop before opening the next.** [@mr.benny.tv, 17.5K: three loops, each closed first]; [@cardboard_cinema, 110.3K: two loops, opened ~0:04 / ~0:37, paid off ~0:54 / ~1:00]. **TEST:** both are sub-1M.
7. **Round, concrete numbers on screen and in voice** (200 seats vs 210 tickets) [@justrichit, 4.9M]. Each number gets a yardstick and a cause [house rule].
8. **End the explanation on one physical metaphor** (a balance scale) instead of a sentence [@justrichit, 4.9M: "A FEW PAYOUTS" vs "EMPTY SEATS"].
9. **Stop once the answer lands.** [@sciepro, 3.7K: paradox solved mid-video, then ~40 s more textbook detail; the study calls the stall an inference, not measured]; [@smart.doctor, 620.7K: 20 s]. **TEST** for our 65 s format: after the payoff, only the flip, the mirror line and the ending.
10. **Back the strange claim with a real, sourced fact** (year + sample size) [@cardboard_cinema: 2011, 70 dogs, 7,000 potty breaks]. Sources in `sources.md` [house rule].
11. **Don't copy claim style from unverified videos** [@mr.benny.tv £800K: unverified; @null.monolith tax claims: flagged misleading].

### Length
12. **Final length stays over 61 s.** [platform rule: TikTok Creator Rewards only pays on videos over 1 minute]. Winners ran 66–71 s [@justrichit 66 s, @thebuildingbox 67 s, @unnecessaryengineering 71 s].
13. **Target ≈ 1:05–1:15, never under 1:02, never over 1:15. Length is set by the tempo, not a word cap:** ≈ 175–255 story words + CTA, voice sped 1.2–1.4× (`node tools/tighten.js <slug>` picks it; at 1.3× ≈ 235 words, at 1.4× ≈ 255). Never cut a "because" to hit a word count. [house: Brian Nov 26 2026: "longer texts are okay, we can just 1.2 or 1.4x it"; CLAUDE.md, PLAYBOOK §1.11]
14. **Longer isn't better.** [@sciepro 88 s: 3.7K]; [@mr.benny.tv 104 s: 17.5K]; [@sketchedpsychology 118 s: 246.3K, a sub-1M exception]. Don't pad to reach the 61 s line.
15. **A 20 s clip is a different format** (Body lane, see `visual`). It's under the payout line, so don't use it for the daily explainer [platform rule: Creator Rewards; @smart.doctor, 620.7K, 20 s].

### Endings (full detail in `growth`)
16. **Last line mirrors a line from the middle** [house rule]. A callback to the opening image works [@mr.benny.tv, 17.5K: "He was still drinking his one coffee."]; **TEST** at 1M+.

### Added from the web research [source: How educator creators go viral.md]
17. **Don't answer the main question in the first half.** Reopen curiosity with spoken re-hooks ("here's the weird part") placed as script beats [CREATOR, Kallaway, via Uploading]. Answer a smaller sub-question early and open a new one. Best payoff position: not reported.
18. **TEST: re-hooks at about 15 s and 30 s** [VENDOR heuristic, ttcalculator]. Compare with our halfway re-hook (rule 5); log which holds better.
19. **Web template:** hook (stakes + question) → one line of context → beat 1 → re-hook → beat 2 → twist → payoff → a closing line that loops or asks for a share. Ours (ladder + flip) fits it.
20. **Rotate skeletons, keep the loop logic** (case study, listicle, what-if, ladder). Running one skeleton every time adds to template risk [platform rule: YouTube inauthentic-content policy, July 2025]. See `growth`.
21. **Money scripts: one concrete worked example with round numbers** ("Imagine 1,000 drivers…"), then a closing line that reframes the opener. These came from banned-API transcripts, so recheck by watching before relying on it. **TEST.**
22. **Plain words, short sentences, "you", one idea per sentence** so each line gets its own visual. Word count and reading level: not reported by any reliable source; time a read at our own voice pace.
23. **One question per video; write the title as a hook, not a label.** [CREATOR anecdote, Rusnok]. **TEST.**
24. **Length evidence is thin.** [Galloway, ~5,400 Shorts, 2023, older]: 50–60 s Shorts averaged the most views. [VENDOR, Fluxnote]: 60–90 s suggested for history. No 2025–26 dataset for educational Shorts: not reported. TikTok Creator Rewards pays only for originals over 1 minute, and length alone doesn't raise the payout [OFFICIAL, TikTok Newsroom; Buffer].
25. **TEST: platform-specific cuts.** The research suggests a 61 s+ TikTok cut and a ~60 s-or-shorter Shorts/Reels cut when the story is done (Instagram now recommends Reels up to 3 minutes). Our house rule is one 1:05–1:12 cut; Brian decides.

### Follow-through gate (added Nov 26 2026, after Brian: "what is missing from our explanations? why aren't scripts clear follow-through?")
Run this BEFORE the lessons scorecard and write the result into a comment block at the top of `script.txt`. A "no" is fixed first, by cutting a joke or a side rung, never a "because".
26. **Promise ledger.** List every promise the hook and every "See, X had a problem" makes (each obvious answer killed, each question asked), with the line that pays it off. An unpaid promise is cut from the hook or paid off. [house failure: yawn v2 killed "not just tired" and never paid it off.]
27. **Causal chain.** Write the explanation as "A, because B, so C" and check that every link is SPOKEN. Test: after each sentence a 10-year-old can ask "why?" and the next line answers it. [house failures: ears v2 never said a climbing plane's air pushes less; yawn v2 gave the 160-people result with no "hot air can't cool you".] Facts you can't link plainly are cut or hedged.
28. **Every analogy is bridged out loud** ("a climbing plane does the same"): never leave "your ear works the same way" to do the work alone.
29. **The character's problem is resolved or explicitly left open** with a line. [yawn v2 opened "Doug had a problem" and never closed it.]
30. **The ladder is only for real attempts** (fix → new problem). Facts, evidence and theories are a cause-effect chain, not "Perfect!". [house failure: "Perfect!" on a theory.]
31. **Budget:** if a causal link doesn't fit the word budget, cut a joke or a side rung first. Never cut a "because". Never cut the line that mirrors the hook.
32. **Retell test, written out.** Put the 3-sentence retell (who wanted what → what went wrong → the surprising why) in the script file. If you can't write it from the narration alone, the script isn't done.

## Pre-publish checklist
- [ ] Does the middle have 5–7 fix → new-problem rungs, each one caused by the last?
- [ ] Does one final flip undo the whole ladder?
- [ ] Is there a spoken re-hook question at about the halfway mark?
- [ ] Is the final length between 1:02 and 1:15 (aim 1:05–1:12), with no padding after the payoff?
- [ ] Does every number have a round value, a yardstick and a source in `sources.md`?
- [ ] Follow-through gate passed: promise ledger (every promise paid off), every "because" spoken, every analogy bridged, the character's problem resolved?
- [ ] Does the last line mirror a middle line and end on one visual metaphor or reveal?
- [ ] Is the 3-sentence retell written out in `script.txt`, and did the lessons scorecard pass?

## Sources
- `docs/creators/study-science-2026-11-25.md` (ladder, flip)
- `docs/creators/study-money-2026-11-25.md` (re-hook, balance scale, numbers)
- `docs/creators/study-body-2026-11-25.md` (stop at the answer)
- `docs/creators/study-general-2026-11-25.md`
- `docs/creators/study-summary-2026-11-25.md` (length)
- `docs/creators/How educator creators go viral.md` (Creator Rewards: TikTok Newsroom; length data; re-hook heuristics)
