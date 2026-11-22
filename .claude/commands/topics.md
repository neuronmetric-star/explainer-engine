---
description: Today's trending topics for the channel (reads today's trend sheet; runs the scrape first if there isn't one)
argument-hint: [optional: "refresh" to re-scrape even if today's sheet exists]
---
Give me today's topics. $ARGUMENTS

1. Today's date in US Eastern time → look for `docs/trends/<YYYY-MM-DD>.md`. Also check the remote:
   `git fetch origin` and look on `main` and on any `claude/trends-*` branch for today's file.
2. If it exists (and I didn't say "refresh"), answer from it. If not, run the trend scrape exactly as in
   `docs/PLAYBOOK.md` §6c step 1, including the trend-ride pass (Scrape Creators, ≈ 20–25 credits), write `docs/trends/<today>.md` in the format of
   the latest sheet, commit and push it.
3. Skip topics we already made (`videos/*/`) and mark ones still open from earlier sheets ("carried over, post by …").
4. Reply short, for a phone: **the trend rides first** (meme + catchphrase, its bridge to a topic, search phrase, post-by;
   PLAYBOOK §1.13 Trend ride is the daily default), then the timely topics (with post-by dates), then any-time topics, each with its exact
   **search phrase** and a one-line payoff; then the best stitch link; then your pick and why (one line).
   Every topic is short form and ends with the helicopter (PLAYBOOK §1.12a). Then ask which one to make.
