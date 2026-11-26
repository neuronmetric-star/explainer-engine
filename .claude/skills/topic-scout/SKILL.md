---
name: topic-scout
description: Use when Brian asks for topic ideas for a niche (science/body, money, history, how-things-work, kitchen, holidays) or "what should we make next". Scrapes TikTok with Scrape Creators for each niche, ranks topics with evidence, and writes docs/trends/<date>.md. Different from `scout`, which studies creators.
---

# Topic-scout lane: topics per niche, from live data

Scope: educational and ad-safe only. Never invent numbers; "not reported" if missing. Scrape Creators is allowed (Brian, Nov 26 2026); report credits spent.

## Niches (ours, from CLAUDE.md / series.md)
Body (anatomy, sleep, senses) · Science / how things work · Money · History · Kitchen and holidays (calendar) · Everyday objects.

## Procedure (≈ 20–40 credits)
1. `v1_account_credit_balance` (free). Note it.
2. Per niche, run `v1_tiktok_search_top` with `sort_by: most-liked`, `publish_time: this-week` (and `this-month` for the build format), `trim: true`, using 2 queries each, e.g. Body: "how your body", "why do we"; Science: "how it works explained", "how a becomes your"; Money: "money explained"; Holiday: the current holiday + "why". Output is 1M+ characters: it is saved to a file, so extract id, plays, likes, shares, saves, author, duration, desc with a script. Never paste raw output.
3. `v1_tiktok_search_suggestions` for the search phrase of each shortlisted topic (what people actually type).
4. `v1_tiktok_video_transcript` (1 credit) on the top 1–2 videos per niche over 1M plays; learn structure only, never copy.
5. Rank: plays and shares of the best video in the niche, how small the posting account is (small account + big plays = topic worked, not the account), gap (was the topic's best video weak?), our fit (can we explain it with an everyday comparison?), source availability (can Brian's claim be sourced? ad-safe?).
6. Output per niche: 3 topics with search phrase, evidence line `[@handle, plays, length]`, the format (why-explainer, build ladder, true story), and the open question. Mark single weak signals **TEST**.
7. Write `docs/trends/<date>.md` (format of `docs/trends/2026-11-26.md`), save useful transcripts to `docs/creators/`, record credits spent.
8. Rotate formats (growth skill rule 18): don't propose three of the same skeleton in a row.

## Checklist
- [ ] Credits checked first and spent credits reported?
- [ ] Every niche has 3 topics with a search phrase and an evidence line?
- [ ] Each topic names a format and an everyday comparison?
- [ ] Ad-safe, sourceable, no breaking-news health alerts?
- [ ] Sheet saved; weak signals marked TEST; nothing committed unless Brian says?
