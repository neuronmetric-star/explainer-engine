# Shot list: "Why the heck do 'four easy payments' make you spend more?" (short, ~1:18)

**Cast (3D, silent, mouths still):** **Doug** = `hoodie` (pays later) · **Gary** = `oxford` (saves in a jar) ·
**Polo guy** = `polo` (store cashier, end).
**Art:** 4 object references + 5 backgrounds + 6 props = **15 images**, in ChatGPT from `art-prompts.md` (4 batches, references first).
Save as named into `videos/pay-later/art/`. Bills are green-ish: run `python3 tools/cutout.py` on `P06` if the key eats them.
**OpenArt video (Wan 3.0, 480p, with audio, 100 credits each; after the art arrives; clip 1 is the test):** static-camera clips as moving plates:
1. `OPENART-1` (test) from `02_kitchen_jar.png`: bills drift down into the glass jar and it slowly fills (cues `jar`, `empties`).
2. `OPENART-2` from `03_living_room_friday.png`: the phone on the coffee table buzzes and lights up again and again, TV glow flickers (cues `friday` → `late`).
Total ≈ 200 credits. **Outro:** the helicopter clip (`docs/brand/heli_outro.mp4`) under the follow CTA (cue `cta`), no credits.
**The clue:** "The other three hundred barely crosses his mind" (cue `barely`: three ghost payments fade away), paid off on **Friday**.

## Images
| # | File | What |
|---|---|---|
| R01 | `R01_console.png` | THE CONSOLE: white-and-teal game console + one controller, no logos (reference + cut-out) |
| R02 | `R02_jar.png` | THE JAR: big glass jar with a cork lid and a paper tag, empty (reference + cut-out) |
| R03 | `R03_phone.png` | DOUG'S PHONE: chunky orange phone, blank glowing screen (reference + cut-out) |
| R04 | `R04_price_tag.png` | THE PRICE TAG: hanging tag with exact text "$400" (reference + cut-out) |
| 01 | `01_living_room_day.png` | Doug's living room, day: couch, TV, coffee table, open floor |
| 02 | `02_kitchen_jar.png` | Gary's kitchen counter with R02 jar half full of bills |
| 03 | `03_living_room_friday.png` | Same as 01 at night: boxes piled (console box, headphones box, jacket bag, empty pizza box), R03 phone glowing on the table |
| 04 | `04_store_aisle.png` | Big-box store electronics aisle; R01 console boxes on the shelf with R04 tags; checkout counter at the end |
| 05 | `05_federal_reserve.png` | Grand stone government building with columns and wide steps, flag, no text |
| P01 | `P01_phone_paylater.png` | R03 phone, screen: big button with exact text "BUY NOW, PAY LATER" |
| P02 | `P02_headphones.png` | Chunky over-ear headphones |
| P03 | `P03_jacket.png` | Puffy jacket |
| P04 | `P04_pizza_box.png` | Open pizza box with one crust left |
| P05 | `P05_phone_late.png` | R03 phone, screen: red banner with exact text "PAYMENT LATE" |
| P06 | `P06_hundred.png` | One cartoon hundred-dollar bill, "100" in the corners, empty portrait oval |

## Shot plan (picture · camera · acting)
| Cue | Picture | Camera | Acting |
|---|---|---|---|
| q | 01 + R01 console with R04 "$400" tag | low push-in | Doug `surprised`, looking at it |
| doug | 01 | cut wide | Doug `happy`, `point` at console |
| hundred | 01 + P06 one bill pops in Doug's hand | hard cut zoom | Doug `worried`, `shrug` |
| button | P01 phone fills frame over 01 (blurred) | insert pop | none |
| bnpl | P01 hold, button pulses | push-in | none |
| today | 01 + P06 bill flies off ("a hundred today") | cut | Doug `smile` |
| every | 01 + three ghost bills on a timeline (2-week ticks) | slow pan | Doug `think` |
| scary | 01 + R04 "$400" tag big | hard cut | Doug `worried` |
| easy | 01 + P06 one bill | hard cut | Doug `happy` |
| username | 01 + R01 console | push-in | Doug `happy`, `tada` |
| gary | 02 kitchen | cut | Gary `flat`, beside the jar |
| jar | `OPENART-1` jar filling | push-in | Gary `nod` |
| bet | 01 | cut | Doug `happy`, controller (R01) |
| playing | 01 | hold | Doug `tada` |
| gotjar | 02 | hard cut | Gary `flat`, `look` at jar |
| again | 01 + P01 phone | cut | Doug `smirk` |
| headphones | 01 + P02 pops | quick cut | Doug `happy` |
| jacket | 01 + P03 pops | quick cut | Doug `happy` |
| pizza | 01 + P04 pops | quick cut | Doug `happy`, `tada` |
| aside | 01 zoom on Doug | push-in | Doug `blink` |
| think | 01 + P06 bill | hold | Doug `think` → `nod` |
| barely | 01, three ghost bills fade away | slow | Doug `smile` (the plant) |
| research | 04 store aisle (empty) | cut, push-in | none |
| store | 04, R04 tags | pan | none |
| friday | `OPENART-2` phone buzzing, night | hard cut | none |
| console | 03 + R01 + P06 | cut | Doug `worried` |
| plus | 03 + P02, P03 pop | quick cuts | Doug `worried` |
| ate | 03 + P04 empty pizza box | hard cut | Doug `facepalm` |
| cover | 03 | push-in | Doug `worried` |
| late | P05 "PAYMENT LATE" phone | hard cut, shake | Doug `surprised` |
| fed | 05 building | cut, slow push-in | none |
| garyend | 02 jar full | cut | Gary `smile` |
| empties | `OPENART-1` (reversed: the jar is full) / 02 | hold | Gary `nod`, `point` at jar |
| end | 04 checkout, polo cashier | cut | Gary hands over cash; cashier `smile` |
| times | 03 Doug + boxes | hard cut | Doug `flat`, `shrug` |
| question | 01 | cut | Doug `look` to camera |
| orjar | 02 | hard cut | Gary `smirk` |
| cta | **heli outro** + **+ FOLLOW** → **✓ FOLLOWING** (button in the sky) | static | none |
