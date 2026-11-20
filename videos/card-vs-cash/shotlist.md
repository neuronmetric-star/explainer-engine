# Shot list: "Why the heck would you bid sixty bucks for tickets you'd only pay thirty for in cash?" (short)

**Cast (3D, silent, mouths still):** **Doug** = `hoodie` (pays by card) · **Gary** = `oxford` (pays cash) ·
**Victor** = `suit` (the auctioneer at the podium).
**Art:** 4 object references + 5 backgrounds + 5 props = **14 images**, in ChatGPT from `art-prompts.md` (4 batches, references first).
Save as named into `videos/card-vs-cash/art/`. Bills are green-ish: run `python3 tools/cutout.py` on `R02` if the key eats them.
**OpenArt video (Wan 3.0, 480p, with audio, 100 credits each; after the art arrives; clip 1 is the test):** static-camera clips as moving plates:
1. `OPENART-1` (test) from `05_arena_tipoff.png`: crowd roars, lights flash, the ball goes up at center court (cue `tipoff`).
2. `OPENART-2` from `04_brain_scan_room.png`: the scanner hums, its ring lights pulse, the monitor's brain picture glows (cues `scan`, `reward`).
Total ≈ 200 credits. **Outro:** the helicopter clip (`docs/brand/heli_outro.mp4`) under the follow CTA (cue `cta`), no credits.
**The clue:** Gary's **wince** while counting three tens (cue `wince`), explained at `how` / `bills`.

## Images
| # | File | What |
|---|---|---|
| R01 | `R01_credit_card.png` | Doug's credit card: bright blue, gold chip, rounded corners, no text (reference + cut-out) |
| R02 | `R02_three_tens.png` | Three cartoon ten-dollar bills fanned out, big "10" on each (reference + cut-out) |
| R03 | `R03_tickets.png` | A pair of green basketball game tickets with a basketball icon, no words (reference + cut-out) |
| R04 | `R04_bid_box.png` | A wooden bid box with a slot on top (reference + cut-out) |
| 01 | `01_auction_hall_wide.png` | Small community auction hall: podium, easel showing R03 tickets, rows of chairs, open floor |
| 02 | `02_bid_table_medium.png` | Bidding table: R04 bid box, blank paper slips, pencils, open floor in front |
| 03 | `03_mit_classroom.png` | University lecture hall with a big blank chalkboard (the researchers) |
| 04 | `04_brain_scan_room.png` | Hospital brain-scanner room (MRI) with a monitor showing a cartoon brain |
| 05 | `05_arena_tipoff.png` | Basketball arena at tip-off: center court, ball in the air, packed blurry stands |
| P01 | `P01_slip_30.png` | Paper bid slip with "$30" in pencil |
| P02 | `P02_slip_60.png` | Paper bid slip with "$60" in pencil |
| P03 | `P03_bar_chart.png` | Two bars on a card: a short green one (cash) and a tall gold one (card), no text |
| P04 | `P04_brain_glow.png` | Cartoon brain with one glowing gold spot in the middle |
| P05 | `P05_fries.png` | Red carton of golden fries with steam |

## Shot plan (picture · camera · acting)
| Cue | Picture | Camera | Acting |
|---|---|---|---|
| q | 01 hall wide + P02 "$60" and P01 "$30" pop in side by side | low push-in | Doug (left) `happy`; Gary (right) `worried` |
| careful | 01 zoom on Doug | hard cut | Doug `smirk`, `hips`, nod |
| auction | 01 wide, Victor at the podium | pull back | Victor `tada` toward the easel with the tickets |
| write | 02 bid table | cut | Doug & Gary at the table, `look` down |
| highest | 01 zoom on the easel (R03 tickets) | push-in | none |
| catch | 02, R02 three tens pop in over Gary | hard cut | Gary `flat` |
| card | 02, R01 card pops in over Doug | hard cut | Doug `happy`, `point` at it |
| count | 02 zoom on Gary + R02 bills fanning (one by one) | push-in | Gary `look` down, `nod` per bill |
| wince | 02 zoom 1.8 on Gary's face | hard cut, **hold** (the plant) | Gary `worried`, `tilt` .15 |
| thirty | 02 + P01 "$30" slides into the bid box | cut | Gary `flat` |
| look | 02 zoom on Doug + R01 card glints | push-in | Doug `smile`, `look` down |
| sixty | 02 + P02 "$60" slides into the bid box | hard cut | Doug `smirk` |
| bet | 01 wide | cut | Doug `wave` (Celtics fan joy), Gary `cross` |
| mit | 03 classroom | cut, push-in | none (the researchers) |
| cashavg | 03 + P03 bar chart pops, green bar grows | insert | none |
| cardavg | 03 + P03, gold bar shoots up | hard cut | none |
| double | 03 zoom on the bars | push-in | none |
| same | 01 zoom on R03 tickets | hard cut | none |
| how | 02 zoom on Gary | cut | Gary `worried` (callback to the wince) |
| bills | 02 + R02 bills drift out of frame one by one | slow | Gary `look` after them |
| pain | 02 zoom 1.7 on Gary | push-in | Gary `worried`, `facepalm` |
| tap | 02 + R01 card tap → back in pocket | hard cut | Doug `smile`, `armR` raise |
| later | 02 | hold | Doug `shrug` |
| gas | 04 scanner room (still) | cut | none |
| scan | `OPENART-2` clip on 04 | push-in | none |
| reward | 04 + P04 brain glow pops center | insert | none |
| fries | P05 fries over 01 (blurred) | insert | Doug `happy`, leaning in |
| bite | P05 + Doug | hold | Doug `tilt`, longing |
| tens | 02 Gary + R02 | hard cut | Gary `flat` |
| tipoff | `OPENART-1` clip (arena, ball up) | hard cut | Doug courtside `happy`, arms up |
| question | 01 wide | cut | both `look` to camera |
| would | 02 + R02 bills vs R01 card side by side | insert | none |
| cta | **heli outro** clip + **+ FOLLOW** → **✓ FOLLOWING** (button in the sky) | static | none |
