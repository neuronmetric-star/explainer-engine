# Long-form format: "So Simple a 5-Year-Old Gets It" (6-10 min, 16:9)

This structure is adapted from studying Crayon Capital, whose sampled videos run 11-21 min with a median of 313K views and outliers of 3-14× that median. It keeps their storytelling mechanics and drops their wording, titles and look.

## What the research showed (Crayon Capital, 27 videos, 4 transcripts)

- **Cold open = stakes + a real number + the twist**, all in 2-3 sentences. Example from their top video: lied about a $1 stock → made millions → only 22 months in jail → Hollywood made a movie. The whole arc is compressed into the first 10 seconds.
- **Then the promise**: "But how did it actually happen?"
- **A small human scene early**: a childhood or origin moment with 2-3 lines of narrated dialogue. This makes a famous name feel like a person.
- **Chronological rise → crisis → today**, in 3-5 chapters of about 4 min each in their 15-min videos.
- **The most-replayed spikes sit at the opening and at chapter starts.** Every chapter must open on its own mini-hook.
- **Ending: a one-line moral or a real quote.** "We wanted to be him." "A principle isn't a principle until it costs you money."
- **Pace**: about 150 words/minute, dense with dates and dollar figures.
- **Topics that won**: famous scandals and crises (Wolf of Wall Street, Great Depression, 2008), huge brands explained simply (NVIDIA, Palantir), and superlatives ("First Confirmed Billionaire").
- **Topics that lost**: abstract essays with no protagonist (0.22× median).

## Our structure (target 6-8 min ≈ 900-1,200 spoken words ≈ 80-110 scenes)

| Part | Time | Job | Scene pace |
|---|---|---|---|
| **1. Cold open** | 0:00-0:25 | The most extreme true moment, stakes and one striking number. End on the contradiction. | a cut every 2-3 s |
| **2. Promise** | 0:25-0:40 | The question the video answers: "How did ___ actually ___?" Then "It starts with…" | |
| **3. Origin scene** | 0:40-1:30 | One small human moment, place and year on screen, 2-3 short narrated lines of dramatised dialogue (clearly scene-setting, never fake quotes) | a cut every 4-5 s |
| **4. Chapters 1-3 (or 4)** | ~1:30 each | Each **opens on a mini-hook** (a question, a reversal or a number). Middle: what happened, with one simple everyday analogy for the hard idea. Each **ends on a turn** that sets up the next chapter. | a cut every 4-5 s |
| **5. Turning point / crisis** | ~1:00 | The moment it breaks or flips, with the biggest number in the video | a cut every 3 s |
| **6. Today** | ~0:40 | Where it stands now, with a current, sourced number | |
| **7. Payoff** | ~0:20 | One line that reframes the whole story, or a sourced quote | |
| **8. CTA** | 0:05 | "Follow for more money, so simple a 5-year-old gets it." | |

**Chapter cards:** at each chapter start, put a 1.5 s title card on a still image: the chapter number plus 2-4 words. The card is added in the edit (a still scene with the chapter title in `plan.json` text), never generated inside an image.

## The "5-year-old" promise (our distinct angle)

- Every hard concept gets **one physical analogy** shown on screen. Examples:
  - leverage = a seesaw;
  - inflation = a shrinking grocery bag;
  - a bank run = a line at one water tap.
- Use no jargon without an instant plain translation in the same sentence.
- Numbers are always concrete and comparable: "$4.3 million: about 70 years of an average salary". The comparison must be sourced too.

## Script rules

- Sentences of 6-16 words, in present tense for story scenes.
- One scene line = one picture. If the line needs two pictures, split it.
- No filler ("In today's video", "basically", "let's dive in").
- Hedge legends ("the story goes…"), and label dramatised moments by how they're narrated.
- Every chapter opener has a source-backed fact in it.

## Animation budget (720p PixVerse)

Animate **15-20 scenes**: the cold open (3-4), each chapter opener (1 each), the turning point (2-3), the payoff (1) and the last shot (1). Everything else is a 4K still with a camera move. At about 14 credits/s (no sound effects) that's roughly **1,100-1,500 credits** per episode at 4-5 s per clip, plus about 15% for redos.

## Topic filter (pass at least 3 of 4)

1. Is there a famous name, brand or event people already search for?
2. Is there a protagonist (a person or company) with a rise, a fall or a twist?
3. Is there a "how did that even happen?" question?
4. Can the key mechanism be shown with an everyday object?
