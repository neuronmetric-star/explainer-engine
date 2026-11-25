---
description: Deep-research any subject (history, science, money, health, tech, anything that teaches) and return story-ready, sourced facts
argument-hint: <subject, question, or "find me" + a field, e.g. "Roman concrete" or "find me 5 surprising money facts">
---
Research: **$ARGUMENTS**

Goal: find stories, facts and lessons that are **true, surprising, teachable in plain words, and picturable**, and hand them over
sourced and ready to become a video (`/make-video`) or a topic pick. Brian works from his phone: short replies, no walls of text.

## 0. Frame (30 seconds, no questions unless truly stuck)
- Read `docs/lessons.md` (scorecard) and skim `docs/series.md` + `videos/*/` names so you never repeat a made topic.
- Decide the mode from the request:
  - **Specific subject** ("Roman concrete") → *Deep dive*: find the best story and mechanism inside it.
  - **Open request** ("find me 5 facts about money", "something from history") → *Hunt*: scan the field, return a ranked shortlist.
- Write the **one-sentence answer the viewer will discover** (the payoff) and the **search phrase** people would type. For a
  Hunt, do this per candidate.

## 1. Search wide, then deep
- Use WebSearch (start "standard"; use "extended" for niche or very recent facts). Run independent searches in parallel.
- Look in 3 or more different places per claim: primary or official source, a reputable explainer/encyclopedia, and a second
  independent confirmation. Prefer, in order:
  1. Primary: papers, government/agency pages (NASA, NIH, DOE, BLS, SEC, Library of Congress, national archives), court records, original documents, museum pages.
  2. Quality secondary: major newspapers, university pages, Britannica, Smithsonian, peer-reviewed review articles.
  3. Wikipedia only as a map to the sources it cites, never as the final source.
  4. Social posts/YouTube only for "what people believe or ask", never for facts.
- Pull the **numbers** (dates, sizes, costs, counts) and give each a yardstick ("a football field", "a month of rent").
- Pull the **mechanism** as cause → effect in everyday words, and a **10-year-old comparison** for each hard step.
- Look for the **human story**: who did what, what they expected, what actually happened, what it cost them. A person or object we can
  follow beats a list of facts.
- Check demand: `docs/trends/<latest>.md` and, if useful and cheap, TikTok/YouTube search suggestions (Scrape Creators, a few credits; say the credits spent).

## 2. Verify (never skip)
- **Myth check:** is the popular version actually true? ("Napoleon was short", "we use 10% of our brains".) If the story is a common
  myth, the *myth vs. truth* is often the better video; say so. History: no myths stated as fact.
- Every claim needs ≥ 1 solid source; every number or surprising claim needs 2. If you can't confirm, mark it **UNVERIFIED** and keep it out of the script.
- Separate clearly: **Verified fact / Our calculation (show the math) / Disputed (who says what) / Invented or reconstructed (label it).**
- Medical, legal, financial subjects: explain how things work only; no personal advice. Note the safe wording.
- Note anything sensitive (real living people, tragedies, graphic content) and a safer framing for an ad-safe, kind video.

## 3. Score each story (scorecard, 1–5 each; keep 20+ of 30)
Surprise · Clarity in plain words (zero-knowledge viewer) · Picturable in painted scenes · Human stakes · "Wait, what?" hook line available in 5 seconds · Fits the series/audience (curious people on TikTok/Reels/Shorts).
Drop anything that needs jargon, side trivia, or more than ~190 story words to land.

## 4. Deliver
- **Deep dive:** save `videos/<slug>/research.md` and `videos/<slug>/sources.md` (create the folder; slug = short kebab-case). Format:
  - `research.md`: Payoff (one sentence) · Search phrase · Suggested mode (Explainer / True story / Lesson chain, PLAYBOOK §1.13) ·
    Hook candidates (3) · The story beats in order (cause → effect, with numbers + yardsticks) · Everyday comparisons · The twist / surprising takeaway ·
    A do-it-yourself last line idea · Myths to avoid · What's UNVERIFIED.
  - `sources.md`: same table style as `videos/gas-vs-water/sources.md` (claim → title + URL + the fact), invented/reconstructed items labeled.
- **Hunt:** save `docs/research/<YYYY-MM-DD>-<field>.md` with the ranked shortlist (each: payoff, search phrase, 3 sourced facts with URLs, score, myth flag, mode). Create the folder if needed.
- Commit the files (not huge binaries) and push to the working branch.
- **Reply to Brian short, phone-friendly:** the top pick + why in one line, then up to 5 candidates as
  `title — one-line payoff — score — mode`, then "Say a number and I'll run `/make-video` on it." Do not start scripting until he picks.

## Rules
- Never invent a fact, quote, statistic or URL. If a search didn't confirm it, say so.
- Plain words, short sentences. Explain every term the first time.
- Quote sparingly; paraphrase and cite. Never paste long text from a source.
- Use exact source titles and working URLs; open pages you cite rather than trusting snippets.
- Keep scope to what the video can teach in about a minute: one idea, one story, one takeaway.
