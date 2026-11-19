# Shot list: "Why the heck does the guy who misses the most make the most shots?" (basketball, 3D engine)

**Script:** `script.txt` (176 story words + CTA). **No obstacles:** just Doug vs Gary, same hoop, one minute.
**Cast (3D, silent):** **Doug** = `hoodie` (holds the ball, waits) · **Gary** = `oxford` (shoots and shoots).
**Art:** 7 images (4 backgrounds + 3 props) from `art-prompts.md` → `videos/basketball-misses/art/`.
**Engine animation:** ball (P01) arcs from Gary's hands to the hoop: clank off the rim, short, long off the backboard, swish
(net wiggle); burst (P03) on "Clank" and "Buzzer"; engine-drawn shot counter in the corner (Gary 0→30 / Doug 0) and a
60 → 0 clock; ball rack (P02) by Gary empties as he shoots, Doug's single ball stays in his hands.
**Sound (sfx.json):** bounce, rim clank, backboard bang, swish, buzzer, light crowd/street ambience (new `tools/sfx.py` types).
**The plant:** Gary's first shot clanks off the rim (`clank`). **Mirror:** "Every miss tells him something" → "I missed eighteen times."

## Images
| # | File | What |
|---|---|---|
| 01 | `01_court_side_day.png` | Outdoor court, side view, hoop at right, open floor for 2 people |
| 02 | `02_behind_shooter.png` | From behind the free-throw line looking at the hoop |
| 03 | `03_hoop_closeup.png` | Rim + net + backboard close-up |
| 04 | `04_court_dusk.png` | Same as 01 at dusk (after the buzzer) |
| P01 | `P01_basketball.png` | One basketball |
| P02 | `P02_ball_rack.png` | Ball rack with ~12 balls |
| P03 | `P03_impact_burst.png` | Comic impact burst |

## Shot plan (picture · camera · acting)
| Cue | Picture | Camera | Acting |
|---|---|---|---|
| q | 01 wide: Doug + Gary at the line, ball rack | slow push-in | Doug `smirk` holding ball, Gary `smile` |
| problem | 01 on Doug | cut | Doug `worried` |
| contest | 01 two-shot, clock "60" appears | push | Doug `point` at Gary; Gary `nod` |
| holds | 02 behind Doug | push toward hoop | Doug raises the ball, `flat` |
| form | 03 → 02 quick cuts on "Feet / Elbow / Breath" | hard cuts | Doug `think`, deep-breath lean |
| almost | 01 on Doug | cut | Doug `worried`, still holding |
| gary | 01 two-shot | cut | Gary steps up, shoots (`armR raise`), `smile` |
| clank | 03 ball hits rim + burst + shake | hard cut | none |
| bet | 01 on Doug | push | Doug `smirk`, `shrug` |
| tell | 01 on Gary | hold | Gary `think` |
| short | 03 ball drops short of the rim | cut | none |
| harder | 01 on Gary | push | Gary `flat`, shoots harder |
| long | 03 ball bangs off backboard | hard cut + shake | none |
| between | 01 on Gary | push | Gary `nod`, `smirk` |
| swish | 03 ball drops clean through, net wiggles | hard cut, small zoom | none |
| every | 02 rapid shots (counter climbs) | quick pushes | Gary shooting loop |
| nothing | 01 on Doug | cut | Doug `blink`, holding the ball |
| jordan | 02 slow push on the hoop, counter "9,000+" on screen | slow push | none |
| buzzer | 04 dusk + burst, clock "0" | hard cut + shake | both freeze |
| score | 04, counter Gary 30 / 12 made | push | Gary `tada` |
| doug1 | 04 on Doug | cut | Doug shoots once |
| missed | 03 ball off the rim | hard cut | none |
| ask | 04 two-shot | cut | Doug `surprised`, turns to Gary |
| answer | 04 on Gary | push | Gary `smirk`, `shrug` |
| cta | 04 wide | slow push | Doug `flat` looking at his ball; Gary `wave` |
| holding | 04 on Doug | push-in | Doug still holding the ball, `blink` |
