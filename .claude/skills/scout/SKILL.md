---
name: scout
description: Use when finding creators and topics to study, setting up or rerunning a TikTok AI app study, vetting a lead before adding it to a config, or deciding which accounts to exclude. Covers the 1M+ filter, on-topic checks and banned sources.
---

# Scout lane: finding creators and topics to study

Scope: educational and ad-safe only. Take structure and technique only; never copy a creator's script or art. Never invent numbers; if a stat wasn't reported, write "not reported".
Evidence key: `[@handle, plays]`. **TEST** = weak evidence.
The last run (2026-11-25) analyzed 13 videos; only 3 cleared 1M plays [study-summary].

Web-research tags: OFFICIAL = the platform itself; VENDOR = tool/agency blog, usually no stated method (the Emplifi numbers come from Facebook Reels brand accounts, sample size not reported, text and tables partly disagree); CREATOR = a coach's teaching. Source: `docs/creators/How educator creators go viral.md`.

## Rules

### Who to study
1. **Only study accounts with a 1M+ view video.** Set the app's min plays to 1.0M and **check the Settings line says "min 1.0M plays" before running.** [study-summary: the filter didn't work in either run; both logged "min 0 plays" or picked sub-1M videos; study-general: none of its 4 videos reached 1M].
2. **Treat sub-1M videos as low-weight examples.** Weight patterns toward the 1M+ videos [@thebuildingbox 20.3M, @unnecessaryengineering 14.8M, @justrichit 4.9M].
3. **Check the lead's 3 latest posts are still on-topic before adding it.** [@medical.explain3d: the lead turned out to be a game trailer ad, 11.1K plays, 3 saves; the account changed what it posts]; [@daily.amazing: no posts in 90 days].
4. **Skip accounts built on borrowed characters or IP.** [@null.monolith: Tom & Jerry; @dailyunfunfact: Mameshiba reposts]. Exclude them from scouting. Don't "study the format" from them.
5. **Prefer faceless/animated educational accounts close to our format.** [study-money scout note: other @justrichit "how X makes money" videos are the closest fit]. For body: [study-body scout note: need men-vs-women body leads; ask Brian for handles or do a manual TikTok search].

### Tools and data
6. **Scrape Creators is allowed and encouraged (Brian, Nov 26 2026: "use scrape to the max of your ability"; this reverses the earlier ban).** Use it for the daily trend sheet, 1M+ explainer-lane discovery, transcripts (1 credit each; `use_ai_as_fallback` for videos ≤ 120 s) and creator profiles. Check `v1_account_credit_balance` (free) first, report credits spent after each pass, and write big results to a file and extract fields with a script, because raw search output is 1M+ characters. Other paid scrapers still need Brian's OK. [house: Brian Nov 26 2026]
7. **Stats come from the app's scrape; cuts/min are Gemini estimates, not measured.** Label them "est." wherever you reuse them [study headers].
8. **Typical config:** max 10 videos, Top K 1, 30-day lookback (General used 90-day) [study headers].

### What to extract (structure and technique only)
9. **Tag each finding by lane:** `[Hook]` `[Script]` `[Visual]` `[Character emotion]` `[Growth]` `[Scout]`, each with one "Steal this" rule [study format].
10. **Record what's unsafe to copy.** Unverified claims [@mr.benny.tv £800K in 8 months], misleading claims [@null.monolith tax story], borrowed IP. Flag them in the study file [study-money, study-general].
11. **Note the length and the plays side by side** so the over-61 s payout line is visible [platform rule: TikTok Creator Rewards]. All 3 science videos ran 67–95 s [study-science scout note].
12. **Choose topics from the morning trend sheet** `docs/trends/<date>.md` with the topic's search phrase [house: CLAUDE.md, PLAYBOOK §6c]. Creator studies feed the method, not the daily topic.
13. **Save each run** as `docs/creators/study-<lane>-<date>.md` plus a summary, unedited, as source evidence. Derived rules go into the skills, not into the study files.
14. **Never fabricate leads.** If the web-research file's creator leads aren't loaded, say "not reported" rather than guessing handles.

### Added from the web research [source: How educator creators go viral.md]
15. **The web lead list is a hand-check queue, not a benchmark.** Many handles came from the banned Scrape Creators API, whose counts were removed ("not reported"); the history counts likely came from it too and were removed. Nobody watched the videos except @theinfographicsshow. Check each lead by hand in the TikTok app and record real follower count, style and originality. Pull hooks from watching top videos, not from a banned API.
16. **Studied leads vs. list status.** Studied in the TikTok AI app: @thebuildingbox, @unnecessaryengineering, @cardboard_cinema, @justrichit, @mr.benny.tv, @finance_with_stickman, @sketchedpsychology, @dailyunfunfact, @medical.explain3d (dead lead). Don't re-study them without a new reason.
17. **Verified on the web:** @primateeconomics (TikTok ~91K followers but dormant ~1 year; study the YouTube side, ~576K); Crayon Capital (YouTube only; 321K subscribers, 27.2M views, 35 videos; per-video 1M+ plays: not reported, so check before studying). @theinfographicsshow has a verified badge but is not a fast grower; filter out military and war content.
18. **Fan pages and re-uploads: study the original source channel** (e.g. the YouTube channel "Animated History" for @animatedhistoryy0).
19. **Excluded:** @global.map.animat (geopolitics/war, possibly propaganda), true-crime accounts (@truecrimeanimated, @truecrimestoriesus), lookalikes (@simplehistory, @weirdhistory, @knowledgia, @timetravellerpov, @povlab, @history_on_maps), accounts with no active official account (@kurzgesagt, @teded, @psych2go, @jaredowen).
20. **Ad-safety flags to check before studying:** @simplysimulated (provocative premise), @medical.explain3d (anatomy credibility), @strangesstories (drifts into crime/gore), @_baddlad_ (possible war topics), @zodiax122 (dark psychology), @wealth.explained2 (borderline educational), @unndrstand (AI-persona risk). History AI "POV" videos have accuracy criticism.
21. **Expect copycats.** The 3D "How X becomes Y" cluster resembles the 2022–24 "Unhinged Home Design" wave. Study the originator; weigh the cluster lightly.
22. **Pick topics from search:** TikTok search suggestions, Creative Center Keyword Insights, YouTube autocomplete. Proven frames in the notes: science "what happens inside / what if"; history obscure events (VENDOR); money "[famous collapse/company] Explained Like You're 5".
23. **TEST: topic choice over volume.** Low-post accounts with high likes per video outperformed a high-volume map account. The research calls this an inference from counts that came from the banned API.
24. **What's unknown.** No controlled tests exist for question vs. statement hooks, word-by-word vs. phrase captions, 2D vs. 3D, character emotion, twist placement or cadence. "Fast growth" is unconfirmed for every TikTok-only lead.

## Vetting a lead (fill in before adding to a config)
- Handle: ____
- Biggest video plays (≥ 1M?): ____
- Last 3 posts on-topic? (y/n each): ____
- Original characters and art? (y/n): ____
- Faceless/animated educational? (y/n): ____
- Closest lane: Science / Money / Body / General

## Pre-publish checklist
- [ ] Does the study's Settings line show "min 1.0M plays"?
- [ ] Does every account have a 1M+ video, or is it labelled low-weight?
- [ ] Were each lead's 3 latest posts checked as on-topic?
- [ ] Are borrowed-IP, reposting, war/true-crime and other ad-unsafe accounts excluded, and was each web-list lead hand-checked in the app?
- [ ] Were credits checked first and the credits spent reported (Scrape Creators is allowed; TikTok AI app still good for video-level study)?
- [ ] Does each finding carry a lane tag and one "Steal this" rule, structure only, with estimates marked "est." and missing stats "not reported"?
- [ ] Is the output saved unedited in `docs/creators/` with unverified claims flagged?

## Sources
- `docs/creators/study-summary-2026-11-25.md` (housekeeping, filter problem)
- `docs/creators/study-science-2026-11-25.md`
- `docs/creators/study-money-2026-11-25.md`
- `docs/creators/study-body-2026-11-25.md` (dead lead)
- `docs/creators/study-general-2026-11-25.md` (borrowed IP)
- `docs/creators/How educator creators go viral.md` (lead list, exclusions, ad-safety flags)
