# Ricks Clips (@RicksClips3000) — what to steal for @coonknows
Scraped 2026-11-11 · 170K subs · ~95 shorts pulled · 6 transcripts read in full.

## The numbers that matter
| Format | Length | Typical views |
|---|---|---|
| **Story-mystery shorts** (Oct 2026 →) e.g. "The Ancient Jar That Warned an Empire" | 56–67 s | **5M – 33M** |
| Comic voiceovers (other artists' comics, he only voices) | 6–20 s | 2M – 10M |
| **Plain explainers** — "How Painkillers Actually Work", "The Science Behind Slot Machines" | 31–35 s | **130K – 316K** |

Same channel, same month, same voice. The "How X works" titles did **~50× worse** than the story titles.
That's the lesson: **the topic is the same, the framing is the difference.**

Top 8: Ancient Jar 33.5M · Perfect Railroads 28.1M · Job Nobody Wants in Japan 17.7M · Storm Oil 15.8M ·
Brain's Secret Idea Zone 15.6M · Japan Gambling Window 15.4M · Grave Bell 12.7M · Pink Prison Cell 9.8M.
All of them are auto-dubbed into 7 languages (German, Spanish, French, Hindi, Indonesian, Italian, Portuguese).

## The story formula (same in every hit)
1. **Cold open, mid-action, weird act** — no question. "He put a bronze ball in a dragon's mouth…" /
   "He poured cooking oil into the sea…" / "He saw gaps into a railroad every 39 feet."
   Pronoun, no name, the strange thing + the stakes in sentence one.
2. **Someone laughs at him.** "The whole court burst out laughing." / "You're making soup?" / "His face goes purple."
3. **The doubters seem right.** Rival railroad finishes first. A ball falls and nothing happens.
4. **Time ticks** — "Weeks later", "In May… by July", "5 minutes go by, then 10". Clocks/calendars on screen.
5. **Disaster hits the doubters** (palace in rubble, rail kicks sideways, wave lands on the pirates).
6. **"You see…"** — the science arrives only at ~45–50 s, 10–15 seconds long, with one everyday analogy
   ("Ever blown on a bowl of soup?").
7. **Ends on the final image.** No spoken CTA, often cut mid-line → people rewatch → loop.

Titles: object + mystery, never "how X works". "The ___ That ___", "Why ___ Don't Work", "What the ___ Really Meant".
Zero swearing — so a swear is not what drives the views.

## Visuals (note: thumbnails/frames were blocked from this machine, so this comes from the narration and titles, not from frames)
- **One hero object** the whole video hangs on (the jar, the rail gap, the oil, the steel balls).
- **Two sides on screen at once** — his gappy rail vs the perfect rail, his ship vs the pirate ship.
- **Reaction characters** — laughing courtiers, purple-faced boss, guards mocking. Big, simple emotions.
- **Time-skip beats** — calendar, clock, day→night.
- **The X-ray reveal** — at "You see…" the camera goes *inside* the object (pendulum inside the jar).
- Mood swings by lighting: calm court → stormy night → morning rubble.

We don't copy their art or comics — we copy the **structure**, and build our own 3D versions.

## How we use it in our engine (all doable with what we have)
| Their move | Our version |
|---|---|
| Hero object, mid-action at frame 1 | Already a rule. Make the hero *do the weird thing* in frame 1, not just sit there. |
| Laughing doubter | 2nd `K.person()` + `K.hop()` for laughing, + a speech card (`cls:'tag'`, white) e.g. "YOU'RE WRECKING MY RAILROAD" |
| Rival side-by-side | Two sets at x=0 and x=8, wide shot, then push in on the loser |
| Time skips | Card with `flip:['cue','JULY']` — "MAY → JULY", or a day/night light change |
| X-ray reveal | Blueprint look cutaway: walls go transparent, the mechanism glows gold |
| Ends on the image | Keep the FOLLOW button visual; end the *voice* on the payoff line |

## Proposed "story mode" script formula (to test next to our WTF format)
```
[#hook]   He <did a weird thing>, and <stakes>.            (0–3 s, no question)
[#doubt]  <Someone> laughed / said "<insult>".              (3–8 s)
[#rival]  <The normal way> looked smarter. <It wins at first>.
[#time]   <Weeks later / By July>, <tension grows>.
[#flip]   Then <disaster hits the doubters>.                (~40 s)
[#yousee] You see, <real mechanism>, like <everyday analogy>. (45–58 s, real numbers here)
[#end]    <Final image line>.                               (no spoken CTA)
```
Still 61+ s for TikTok rewards. Still sourced. History: "historians think" still applies — the story is a
dramatization, so the "You see, in real life…" line must state the real fact plainly (Rick does this:
"in real life, lotteries noticed…").

### Example — our Great Wall video, story mode
> "A general held the strongest wall on Earth… and he opened the gate himself. For two thousand years,
> nomad horsemen couldn't get through…"  → ends on the gate swinging open in 1644, *then* "You see…" explains
> beacons, gates and the 21,196 km. Same facts, story order.

## Quick wins
1. **Titles**: rename next uploads story-style ("The Wall That Was Opened From the Inside").
2. **Turn on YouTube auto-dubbing** — every one of Rick's hits has it.
3. **A/B one video**: same topic, WTF version vs story-mode version. Keep whichever wins.
