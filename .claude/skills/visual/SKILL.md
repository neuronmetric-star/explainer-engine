---
name: visual
description: Use when planning or reviewing a video's look and motion — pacing (a change every 2–3 s), on-screen numbers and counters, caption style and chunk size, camera movement, sound effects and art style. Use when writing a shot list or testing captions.
---

# Visual lane: pacing, art style, captions, camera

Scope: educational and ad-safe only. Take technique, never a creator's art. Our painted-plate + 3D sphere-head cast stays; don't switch to low-poly 3D or stick figures.
Evidence key: `[@handle, plays]`. Cuts per minute in the studies are Gemini **estimates**, not measured. **TEST** = weak or conflicting evidence.
Big winners (1M+): @thebuildingbox 20.3M, @unnecessaryengineering 14.8M, @justrichit 4.9M.

Web-research tags: OFFICIAL = the platform itself; VENDOR = tool/agency blog, usually no stated method (the Emplifi numbers come from Facebook Reels brand accounts, sample size not reported, text and tables partly disagree); CREATOR = a coach's teaching. Source: `docs/creators/How educator creators go viral.md`.

## Rules

### Pacing and camera
1. **Something changes every 2–3 s.** [@justrichit, 4.9M: every 2–3 s, est.]; [@thebuildingbox, 20.3M: new element every 2–4 s, est.]; [@unnecessaryengineering, 14.8M: every 2–4 s, est.]. Studied range is 2–4 s, so 2–3 s is our target and 4 s is the ceiling.
2. **The camera never stops** (sweeps, zooms, push-ins) [@justrichit, 4.9M]. On paintings only zoom/pan, feet planted [house rule: CLAUDE.md].
3. **Cut on action words** (dig, line, build) [@thebuildingbox, 20.3M]. Place `[#cue]` at those words [house: script markup].
4. **Parts snap into place as the story builds.** [@thebuildingbox, 20.3M; @unnecessaryengineering, 14.8M: snap-in assembly]. For us: growing sets, props that appear on the painting [house: PLAYBOOK §3.5]. Take the technique only; the low-poly 3D look is not our art standard v2.
5. **Don't use fades** [house rule: CLAUDE.md].

### Numbers on screen
6. **Keep numbers on screen as live objects.** Live counters (TICKETS SOLD 201 → 210, voucher $ rising) [@justrichit, 4.9M]; day counters (Day 1 → 3 → 7 → 39 → 91) [@nolledge, 85.4K]; status cards (OFFICES CONTACTED, MONEY LOST) [@mr.benny.tv, 17.5K].
   - Evidence is strongest for counters ([@justrichit, 4.9M]); day counters and status cards are sub-1M, so **TEST**.
7. **Color-code the numbers.** Studies used green = win, red = loss [@mr.benny.tv, 17.5K]. **Keep our code** (gold = key/win, red = loss, light blue = water, white = air/force [house: PLAYBOOK §3.5]). Don't switch to green.
8. **A different physical metaphor for the payoff** (balance scale) [@justrichit, 4.9M].

### Captions
9. **TEST: captions in 2–4 word chunks, replacing our one-word-at-a-time captions.**
   - Evidence: every winner showed 1–6 word chunks, most often 2–4, none single words [summary file]. [@thebuildingbox, 20.3M: 1–3 words]; [@unnecessaryengineering, 14.8M: 3–6 words]; [@justrichit, 4.9M: 1–3 words, key words in yellow].
   - Current house rule is one word at a time [CLAUDE.md]. That rule stays until Brian approves the change.
   - Test design: the same style on 3 videos, then compare 3-second hold and watch-to-end in the lessons table.
10. **Position: lower third / bottom-center** [@thebuildingbox, @unnecessaryengineering, @justrichit]. Ours y≈1270 of 1920 is consistent.
11. **White, bold, black outline; key words highlighted** [@thebuildingbox, 20.3M: black stroke]; [@justrichit, 4.9M: key words yellow]. Matches our gold key words.
12. **Caption chunks sync to the voice** [@thebuildingbox, 20.3M].

### Sound
13. **Sound effects carry the jokes and the physics** (rain, click, splash, wiper squeak, engine) [@unnecessaryengineering, 14.8M]; coin and ping effects [@justrichit, 4.9M]. Use `sfx-cues.js` [house: pipeline step 8].
14. **One effect synced 1:1 with the motion** [@smart.doctor, 620.7K, 20 s, silent loop]. A 20 s clip is under the payout line, so this is a **TEST** idea for beats only.

### Art
15. **Keep the art standard v2** (rich, cinematic, lived-in; clear floor zone, calm caption band) [house: CLAUDE.md]. Cheap black-background line art [@nolledge 85.4K, @sketchedpsychology 246.3K] is sub-1M and off-brand; don't adopt it.
16. **Body lane TEST:** realistic organ visuals, one continuous camera, one synced effect [@smart.doctor, 620.7K, 20 s, ~0 cuts]. The summary flags it as the opposite of our narrated, cut-heavy style. It may need its own format, which would run under 61 s, so it can't be a daily payout video.
17. **Never copy a creator's art or use borrowed IP** [@null.monolith: Tom & Jerry; @dailyunfunfact: Mameshiba].

### Added from the web research: counter-evidence, so read before relying on rules 1–2 and 9 [source: How educator creators go viral.md]
18. **TEST: constant camera motion.** [VENDOR, Emplifi]: pacing had minimal impact, and slower-paced videos did +7.8% better at 30 s. The "cut every 2–4 s" figure has no stated method behind it [Opus]. Rules 1–2 rest on the 1M+ winners and our house style; the web research says a slow drift may be enough. Compare a drift-only video against a full-motion one.
19. **Change the picture on each new idea, following script beats rather than a stopwatch.** [web research, Visual lane].
20. **TEST: overlay text with voiceover.** [VENDOR, Emplifi]: text overlays slightly hurt retention (−6% at 10 s, −4.5% at 30 s). This measures overlay text in general, not our caption style. It adds to the caption TEST in rule 9.
21. **Word-by-word captions are unproven; so is any chunk size.** Opus recommends word-by-word without data; CapCut argues comprehension matters more. Best words per chunk: not reported. TikTok gives 5–10 words per second as a rate [OFFICIAL, TikTok Ads Help]. A/B 2–4 word chunks against single words [web research, contradictions table].
22. **Captions large, high-contrast, inside the safe zone, keyword in the first chunk.** [web research, Visual lane].
23. **Shoot 9:16 full-frame.** [VENDOR, Emplifi: vertical got +20.9% reach and +38.5% 30-second retention]. Ours already is.
24. **Show concepts literally: cutaways, x-ray views, before/after.** [web research, Visual lane]. Matches our one cutaway painting per explainer.
25. **One consistent style and character across the channel.** No study ranks 2D, 3D or stick-figure styles: not reported.
26. **Avoid generic AI stock looks and scenes repeated across videos.** Export clean, without watermarks. [platform rule: YouTube inauthentic-content policy, July 2025; Instagram favors originals].

## Pre-publish checklist
- [ ] Does something change on screen at least every 3 s (no static stretch over 4 s)?
- [ ] Does the camera move in every shot, feet planted on paintings?
- [ ] Is at least one number shown as a live counter, day counter or status card?
- [ ] Do colors follow our code (gold win, red loss, light blue water, white air/force)?
- [ ] Are captions in the style being tested (2–4 word chunks or one word), logged, white with black outline, caption band clear?
- [ ] Are sound effects placed on cuts, with the key effect synced to its motion?
- [ ] Does every painting pass the PLAYBOOK §4 quality gate (v2 recipe)?
- [ ] Is there no borrowed IP and no copied art?

## Sources
- `docs/creators/study-science-2026-11-25.md`
- `docs/creators/study-money-2026-11-25.md`
- `docs/creators/study-body-2026-11-25.md`
- `docs/creators/study-general-2026-11-25.md`
- `docs/creators/study-summary-2026-11-25.md`
- `docs/creators/How educator creators go viral.md` (counter-evidence on pacing and captions)
