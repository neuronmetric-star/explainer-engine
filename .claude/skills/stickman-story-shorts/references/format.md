# What makes these shorts work

This file is evidence-based where marked. The source is `research/creator-study-ricks-clips-crayon-capital.md` (Scrape Creators data, Nov 2026): 26 Rick's Clips Shorts and 27 Crayon Capital videos, with 14 transcripts. Correlation is not causation. Treat these as defaults to test, not laws.

## The shape (55-65 s)

| Time | Beat | Why |
|---|---|---|
| 0-2 s | **Hook:** the strangest true moment, shown in progress | Rick's top videos all open on an odd action already happening ("He poured cooking oil into the sea…"). |
| 2-8 s | **Stakes:** what's at risk, plus who doubts it | A skeptic or crowd gives the viewer a side to take. |
| 8-40 s | **2-3 steps**, each a visible change; the threat escalates | One mechanism, shown, not listed. |
| 40-52 s | **Visible payoff:** the moment that proves it (collapse, wave, reveal) | Present in 4 of Rick's top 4 (3.0-3.6× median). |
| 52-58 s | **The mechanism**, in 2-3 plain sentences | Rick explains only at the end; Crayon front-loads numbers. Combine them: a concrete number in the hook, the "why" at the end. |
| 58-62 s | **One-line image ending** (+ optional 2-4-word CTA) | The strongest endings are one picture: "on paper, nobody gambled." |

Best length in the sample: **58-67 s with a single mechanism**. The 31-35 s question-led clips were the weakest (0.01-0.03× median).

## Hook rules

0. **Shorts always open with a question word, when the story allows it:** Why / Who / What / When / How. This is the channel rule. Make the question concrete, then put the scene right behind it in the same breath. The research shows that a bare, abstract question with no character underperforms ("How do painkillers know where the pain is?" got 323K views), while a Why/How title with an odd concrete moment wins.
   - Good: "Why does every quarter have 119 ridges? Because 300 years ago, people shaved money."
   - Good: "How did one island keep its fortune at the bottom of the sea?"
   - Bad: "Why is money important?" It is abstract, with nothing to show in frame 1.

   If no question word fits naturally, say so to the user and use a scene opener instead.
1. The first line is a **scene**, not a bare question: a concrete noun and a contradiction in at most 14 words.
   - Weak: "How do painkillers know where the pain is?" (323K views)
   - Strong: "He put a bronze ball in a dragon's mouth…" (34.7M)
2. Use a number when it's real and striking (Crayon: "only served 22 months").
3. It must be visible in frame 1. Frame 1 = the most striking image, already moving.
4. No "Did you know", "In today's video", or filler.
5. Never invent events to make a hook. Pull the most absurd true moment that is already in the script.

## Story rules

- **One protagonist the viewer follows**: a faceless stickman, named or "he/she". Essays and topics with no protagonist underperformed for both creators (Crayon: 0.22×).
- **A doubter → persistence → vindication** arc works. Vary it: a rival, a rule, nature, a crowd, a clock. Don't clone Rick's "mocked inventor" beat for beat.
- **Real systems and loopholes in 2nd person** ("You win a bucket of balls… the counter won't give you a yen") did well: 1.6-1.9×, and Japan job drew 11K comments.
- **Pure fiction or world-building and list-style "it gets worse" escalation** underperformed. Keep it a real mechanism.
- **Present tense, short clauses, ~2.7 words/s.** Name the science term at most once, at the reveal.
- **Humanise with one tiny acted moment** (one line of dialogue in the narration), as Crayon does with childhood scenes. The narrator voices it; the characters never lip-sync.

## Titles (for the upload, not on screen)

4-8 words in Title Case: an object + a mystery verb. "The Coin That Sank and Still Counted." Avoid borrowed templates such as "Explained Like You're 5".

## Visual rules

- Something changes every 2-3 s. Inside one clip, the camera move or the character's action does this.
- One idea per shot. Max 2 text elements on screen. Keep the caption band (y 1250-1450) clear of other text.
- Safe zone: nothing important in the top 140 px or the bottom 380 px.
- Color meaning (repo-wide): gold = wealth/key, red = danger/loss, white = neutral, green = cash, blue = ordinary person.
- End on the proof image (a receipt, a number, a before/after).

## What to avoid copying

- Rick's Clips: the "You see," pivot, the exact mocked-inventor template, unlabelled dramatised history.
- Crayon Capital: "Explained Like You're 5", the crayon look, long-form density.

## Series names (long-form)

The long-form series promises "explained so a 5-year-old gets it" without copying Crayon Capital's exact title template ("X Explained Like You're 5"). Use the series name the user chose. It is stored in `assets/channel.json` → `"eli5_title"`. If it isn't set, ask once and save the answer.

## Long-form ("Explained Like I'm 5" type)

- **Structure** (adapted from the Crayon Capital study):
  1. A cold open with stakes and a real number.
  2. A Why/How question.
  3. A small human scene, voiced by the narrator.
  4. 3-5 chapters, each opening on a mini-hook, because the viewer replay graph peaks at chapter starts.
  5. A turning point.
  6. Today.
  7. A one-line moral or proof.
- **Pace:** ~150 words per minute. One idea per scene, with a simple analogy for every hard concept ("like you're 5" = show it with everyday objects).
- **Budget, hybrid method.** Animating every shot of a 10-minute video costs far more than one account can cover. So:
  1. Make keyframes for every scene.
  2. Animate only the key moments (the hook, the chapter openers and the payoffs) with PixVerse.
  3. Show the rest as stills with a slow camera move. Put the image path as `clip` in `plan.json`; `assemble.py` adds the push-in automatically.

  Quote the split (stills vs. clips) before production.
- **Format:** 16:9 (`"width": 1920, "height": 1080` in `plan.json`) and 16:9 keyframes.
