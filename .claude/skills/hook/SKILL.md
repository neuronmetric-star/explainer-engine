---
name: hook
description: Use when writing, reviewing or A/B-testing the first 3 seconds of an explainer (the spoken line, the on-screen text and the opening picture), or when a script's opener needs a second option. Covers second-person scenario openers, killing the obvious answer in line 2, and the visual hook.
---

# Hook lane: the first 3 seconds (picture + words)

Scope: educational and ad-safe only. Take structure and technique from the studies, never a creator's script or art.
Evidence key: `[@handle, plays]`. Plays are from the app's scrape. Anything marked **TEST** is weak or conflicting evidence: run it as an experiment, don't state it as fact.
Big winners (1M+): @thebuildingbox 20.3M, @unnecessaryengineering 14.8M, @justrichit 4.9M. Everything else is low-weight.

Web-research tags: OFFICIAL = the platform itself; VENDOR = tool/agency blog, usually no stated method (the Emplifi numbers come from Facebook Reels brand accounts, sample size not reported, text and tables partly disagree); CREATOR = a coach's teaching. Source: `docs/creators/How educator creators go viral.md`.

## Rules

### Words
1. **TEST: second-person "You…" scenario opener vs our "Why the heck…".** Run both, compare 3-second hold in the lessons table.
   - For: [@thebuildingbox, 20.3M: "You dig a downhill trench from a volcano's lava spill to your backyard…", a statement, not a question]; [@justrichit, 4.9M: "…and they do it on purpose", statement]; money lane 3 of 3 opened with a statement.
   - Against / caveat: [@unnecessaryengineering, 14.8M] opened with a *question* ("Why do raincoats keep your body dry, but leave your legs soaking wet? Let's fix that."). So the data does **not** show "no 14M+ video opened with a question". What both 14M+ videos share is second-person stakes ("you", "your legs") plus a promise ("Let's fix that").
   - Why TEST: n = 2 at 14M+, different topics, different hook forms.
2. **Kill the obvious answer in line 2.** Template: "Not X. It's something far stranger." / "It has nothing to do with Y."
   - [@cardboard_cinema, 110.3K: "Not to find a perfect spot. It's doing something far more bizarre."]; [@null.monolith, 19.6K: "it has nothing to do with flexing"]; [@sketchedpsychology, 246.3K: "It goes deeper than that."]. Summary counts 4 videos across 3 niches.
   - **TEST** on strength: none of the four cleared 1M.
   - The "stranger" answer must be real and paid off; back it with a sourced fact [@cardboard_cinema backed it with a real study: year + sample size].
3. **Put the full hook sentence on screen as text too.** [@justrichit, 4.9M: hook shown in full as on-screen text]; [@unnecessaryengineering, 14.8M: question shown as on-screen text].
4. **Use the topic's search phrase in the first spoken sentence and in on-screen text in the first 2 s.** [house rule: CLAUDE.md pipeline step 1, PLAYBOOK §6b]; [@sketchedpsychology and @unnecessaryengineering hooks were written around a searchable phrase].
5. **TEST: audience callout in the first 3 words** ("If you're 17…") when the topic has a clear audience. [@finance_with_stickman, 37.8K plays, 805 saves; 4 comments]. It is a sub-1M example.
6. **Plain words, kid level, the surprise stated out loud.** [house rule: CLAUDE.md "Easy to understand + the HOOK"].

### Picture
7. **The strange thing is huge in frame 1; the camera is already moving.** [@smart.doctor, 620.7K: extreme close-up of something unnamed, then pull back to reveal it]; [@thebuildingbox, 20.3M: excavator digging from an erupting volcano in frame 1]. Matches our crash-zoom-out visual hook [house: CLAUDE.md].
8. **Paradox or mystery visuals can replace a spoken question in anatomy.** [@smart.doctor, 620.7K: no spoken words]. **TEST:** [@sciepro, 3.7K: "blue artery, red vein" paradox] underperformed, so the picture hook alone didn't carry it.
9. **Show the stakes visibly: the problem in the picture.** [@unnecessaryengineering, 14.8M: soaked legs in frame 1]; [@justrichit, 4.9M: more passengers than seats].
10. **A cast member reacts in the hook (scream, shake, sting).** [house rule: CLAUDE.md `K.hookReact`]. See `character-emotion`.

### Don'ts
11. Don't delay the fact. **TEST:** [@dailyunfunfact, 161.6K: fact arrived at ~0:09, repost format]. Evidence is only that a late fact sits in a mid-tier video.
12. Don't borrow characters or IP for the hook [@null.monolith used Tom & Jerry; @dailyunfunfact reposted Mameshiba]. Format only.
13. Don't state unverified numbers in the hook [@mr.benny.tv "£800,000": study flags it as unverified]. Every number is sourced in `sources.md` [house rule].

### Added from the web research [source: How educator creators go viral.md]
14. **Voice starts at frame 0.** No music-only intro, logo or greeting. [VENDOR, Emplifi: speech-led videos beat music-only by +11.7% on 3-second retention and +24.7% on 10-second retention].
15. **Make the topic obvious in 1–2 s, with picture and words agreeing.** [OFFICIAL, TikTok Ads Help: core proposition in the first 3 s]; [CREATOR, Kallaway: delay and confusion kill hooks].
16. **Say the literal search phrase and vary the frame** (paradox, outcome first, POV). A "Why the heck…" opener on every upload may read as templated, and people probably search "why does X", not "why the heck" (the research marks this as inference). **TEST.** [platform rule: YouTube inauthentic-content policy, July 2025]. Frames seen, all low-confidence (their quotes came from a banned API and need rechecking by watching): paradox [@justrichit insurance video], outcome first [@storyisland01, accuracy red flag], "POV: you wake up as…" [accuracy criticised]. Take the frame, never the line.
17. **Something moves in the first second.** [VENDOR, NestScale].
18. **TEST: the character is in frame at 0 s, mid-action.** [VENDOR, Emplifi: person on screen +3.6% at 3 s, +10.1% at 10 s, but −2.4% at 30 s]. Untested for animated characters.
19. **Keep on-screen hook text short.** Best word count: not reported. Keep text at or under 5–10 words per second [OFFICIAL, TikTok Ads Help]. **TEST against rule 3:** the 14M+ winners showed the full sentence, but Emplifi found overlay text with voiceover slightly hurt retention (−6% at 10 s, −4.5% at 30 s).
20. **Diagnose with the drop point.** A sharp drop at ~2 s = hook problem; at ~15 s = content problem [VENDOR heuristic, ttcalculator]. Benchmarks for a "good" 3-second hold contradict each other (70% vs 40%), so set no target: not reported.

## Hook worksheet (fill before Brian sees a script)
- Search phrase: ____
- Line 1 (second-person + object + surprise): ____
- Line 2 (kills the obvious answer): ____
- Frame 1 picture (what is huge): ____
- On-screen text (first 2 s): ____
- Variant B for the A/B ("Why the heck…" or "You…"): ____

## Pre-publish checklist
- [ ] Does the voice start at frame 0, with the search phrase in line 1 and in on-screen text within 2 s?
- [ ] Does line 1 put the viewer ("you"/"your") or a visible problem in the scene?
- [ ] Does line 2 kill the obvious answer and promise something stranger?
- [ ] Is the strange thing huge in frame 1, with the camera already moving?
- [ ] Is the surprise clear by 3 s in plain words a 10-year-old follows?
- [ ] Is every number in the hook sourced in `sources.md`?
- [ ] Is the hook form (You… vs Why the heck…) logged for the A/B?
- [ ] Is the hook free of borrowed characters, copied lines and unsafe words?

## Sources
- `docs/creators/study-science-2026-11-25.md`
- `docs/creators/study-money-2026-11-25.md`
- `docs/creators/study-body-2026-11-25.md`
- `docs/creators/study-general-2026-11-25.md`
- `docs/creators/study-summary-2026-11-25.md`
- `docs/creators/How educator creators go viral.md` (platform rules, lane checklists, leads)
