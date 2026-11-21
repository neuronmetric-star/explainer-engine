# Shot list: "Why do we eat turkey on Thanksgiving?" (short, ≈ 1:08)

**Script:** locked (`script.txt`, ≈ 196 story words + CTA C; Brian sent the narration as-is on Nov 21 2026).
**Mode:** True story (a disputed account: attribute the claim, then follow the evidence).
**Search phrase:** "why do we eat turkey on thanksgiving". First spoken sentence, **on-screen title for the first 2 s**
(`WHY DO WE EAT TURKEY` / `ON THANKSGIVING?`, white + gold, top band, engine overlay), and caption line 1.
**Cast (3D, silent, mouths still):** **Doug** = `hoodie` (the host who wants it "exactly like the first one") ·
**Gary** = `{outfit:'oxford', phone:true}` (finds the letter on his phone; the winner). Real people (Winslow, Hale,
Lincoln) are **never played by the cast**: they're shown through their places and objects (Hale's office with a
silhouette portrait, Lincoln's desk and hat) plus name labels.
**The clue:** Winslow's letter (P02). It's on screen at `winslow`, the narrator reads "fowling" and "five deer" off it,
and at `notice` the engine searches it for "TURKEY" and finds nothing. The deer pay off at the end ("So he served deer").
**All words and numbers are engine overlays** (`K.text`), never painted: the letter quotes, NORTHWOOD, 1621, 1863,
PROCLAMATION, 9 IN 10. Letter quotes are Winslow's words in modern spelling (*Mourt's Relation*, 1622:
"our governor sent four men on fowling" · "they went out and killed five deer").
**Art:** **15 new images** (5 backgrounds + 10 props) from `art-prompts.md` → `art/`, plus the helicopter
`H01_helicopter.png` (already copied from `docs/assets/`).
**OpenArt video inserts:** one, optional (recommended), marked `OPENART` at `ground`. Generated only after the art
arrives, one test clip, credits reported.

## Images
| # | File | What |
|---|---|---|
| 01 | `01_dining_room_day.png` | Doug's modern dining room: long Thanksgiving table, empty spot in the middle for the platter, window on the left, open floor in front |
| 02 | `02_plymouth_harvest_1621.png` | Plymouth, autumn 1621: little thatched wooden houses (left), the old ship in the bay, long trestle tables with corn and squash, cooking fires, forest (right). No people |
| 03 | `03_editor_office_1800s.png` | Hale's 1800s editor's office: desk with quill, stacks of magazines, a black oval **silhouette portrait** of a woman with ringlet curls on the wall |
| 04 | `04_lincoln_desk_1863.png` | An 1860s president's office: wooden desk, inkwell, **black stovepipe top hat** on the desk corner, old flag, tall window |
| 05 | `05_backyard_feast_dusk.png` | Doug's backyard at golden hour: long outdoor table set for Thanksgiving, empty platter spots, string lights, **open sky in the top third** (helicopter) |
| P01 | `P01_roast_turkey.png` | Golden roast turkey on a white oval platter (the one turkey, used everywhere) |
| P02 | `P02_winslow_letter.png` | Old 1600s letter: aged paper, brown scribble handwriting, wax seal, a clean blank band across the middle |
| P03 | `P03_duck.png` | Brown duck, standing, side view facing right (no green feathers) |
| P04 | `P04_goose.png` | Canada-style goose, standing, side view facing right |
| P05 | `P05_wild_turkey.png` | Live wild turkey, bronze feathers, tail fanned, side view facing right |
| P06 | `P06_deer.png` | White-tailed deer (doe), standing, side view facing right |
| P07 | `P07_novel_open.png` | Open 1820s book: left page blank-ish text lines, right page an engraving of a roast turkey at the head of a candle-lit table |
| P08 | `P08_envelope.png` | 1800s folded letter with a red wax seal |
| P09 | `P09_proclamation.png` | 1860s official document: cream paper, blank heading area, neat scribble lines, signature scribble, red ribbon seal |
| P10 | `P10_roast_venison.png` | Roast venison (deer) on a wooden carving board, a few slices cut |
| H01 | `H01_helicopter.png` | The series helicopter (copied, do not repaint) |

## Shot plan (picture · camera · acting)
| Cue | Picture | Camera | Acting (face · pose · gesture) |
|---|---|---|---|
| q | 01, tight on the table center (zoom 1.5), **P01 turkey** on the table. **Title overlay** `WHY DO WE EAT TURKEY` / `ON THANKSGIVING?` (top band, "TURKEY" gold) | first frame already moving: slow push-in 1.5→1.65 | none (the subject) |
| card | 01 wide, **table spot empty** | hard cut; tracking walk-in (zoom 1.0→1.08) | Doug walks in from the left (`walk`, ease `walkAmt` to 0), stops behind the table, `smile` → `hips` on "exactly" |
| ground | 02 wide 1621 + overlay `1621` (gold, top band) and small `≈ 405 YEARS AGO` | **hard cut**, slow push-in 1.0→1.1. `OPENART` (optional): 02 → 5 s clip "slow push-in, smoke drifting from the cooking fires, autumn leaves falling, the ship rocking gently, a few geese flying across the sky, no people" | none |
| feast | 02, pan left (houses + ship, label `PILGRIMS` = "English settlers") → right (forest, label `WAMPANOAG` = "already living here") → center tables, overlay `3 DAYS` (gold) | eased pan, ≈ 1.5 s per stop | none |
| bet | 01 medium on Doug (zoom 1.3). **P01 turkey drops onto the table** with a `pop` on "turkey" | hard cut; then slow push-in 1.3→1.42 on "Honestly?" | Doug `happy`, `tada` on "turkey" → `smirk`, small `nod` on "I'd bet on turkey too" |
| letter | 01 wide, turkey on the table | cut wide | Gary walks in from the right, phone up, `flat` · Doug turns (`look` toward Gary), `smile` |
| winslow | **P02 letter insert** over 01 (blurred/zoomed 1.6), overlay label `EDWARD WINSLOW · 1621` (gold) + small `THE ONLY EYEWITNESS LETTER` | hard cut, letter slides up from the bottom, slow push | none |
| fowling | P02 close (push to the blank band). Overlay in ink-marker: `"…sent four men on fowling…"`, **fowling** gold | push-in 1.0→1.15 | none |
| birds | 02, sky + forest edge (zoom 1.4, pan right). P03 duck, P04 goose, P05 wild turkey **pop in one per word** ("ducks", "geese", "maybe turkey"); small `?` overlay over the turkey | hard cut, slow drift | none |
| deer | 02 tables (zoom 1.3). **Five P06 deer** pop in a row, one per ≈ 0.3 s; counter `5` gold | hard cut, small push | none |
| notice | P02 letter again (same framing as `fowling`), a scan line sweeps the page, overlay `TURKEY` in red with a red strike **✗** | hard cut back to the plant, **hold 1.0 s** | none |
| doubt | 01 two-shot, turkey on the table | cut | Doug `look` down at the turkey, `worried` · Gary `smirk`, `cross` |
| hale | 01, push-in on the turkey (1.3→1.5) | slow push | Doug and Gary both `look` at the turkey; Doug `think` |
| editor | 03 office, push toward the silhouette portrait; overlay `SARAH JOSEPHA HALE` (gold) + small `MAGAZINE EDITOR` | **hard cut** on "editor", push 1.0→1.12 | none |
| novel | 03 desk, **P07 open book** pops onto the desk; overlay `NORTHWOOD · 1827` and small `206 YEARS LATER`; push into the engraving of the turkey | cut, push 1.0→1.25 toward the right page | none |
| letters | 03 desk, **five P08 envelopes** fly out of frame one by one (left → right), counter `1…5 PRESIDENTS` (gold) | hold, slight drift | none |
| lincoln | 04 desk + hat, overlay `1863` and label `ABRAHAM LINCOLN · 16TH U.S. PRESIDENT`; on **"yes"**: P09 proclamation slams onto the desk (2-frame shake), overlay `THANKSGIVING` heading + `YES` (gold) | **hard cut**, slow push; jolt on "yes" | none |
| big | 01 wide, Doug and Gary at the table. **P01 turkey grows** comically (scale 1→1.5 over 1 s) on "feed a crowd" | cut, pull back 1.1→1.0 | Doug `tada`, `happy` · Gary `flat` |
| eggs | 01 medium. **P05 wild turkey pops onto the table** beside the roast; overlay `EGGS` with a red ✗, then `CHEAP` (gold) | hard cut, small push | Gary `shrug`; Doug `blink` at the live turkey |
| today | 01 wide, overlay grid of **10 mini P01 turkeys**: nine fill in gold, overlay `9 IN 10` (gold); the 10th square is **P10 venison** (sets up the ending) | static, slight drift | Doug `smile`, `nod` |
| end | **05 backyard dusk wide**, table set outdoors like 1621 (mirror of `card`) | **hard cut**, tracking walk-in (1.0→1.06) | Doug stands at the head of the table, `smile` → `hips` on "exactly" |
| deerplate | 05, **P10 venison** pops onto the table center | cut medium on Doug | Doug `happy`, `tada` |
| heli | 05 wide. Gary walks in from the right; **P01 turkey** lands on the table next to the venison as he arrives. **Helicopter ending** (§1.12a): `K.helicopter(t, 'heli')`, H01 crosses the top third left → right, ≈ 3.4 s | hold wide | Gary `smirk`, then looks up (`nod` −.35), face `flat` while it passes · Doug glances up, `blink` |
| cta | hold 05 + **+ FOLLOW** pops → cursor tap → **✓ FOLLOWING** | static | Gary `point` at the button · Doug `shrug` |

## Sound (sfx-cues.js, later)
whoosh on every hard cut (`ground`, `winslow`, `editor`, `lincoln`, `end`) · pop on each bird, deer and envelope ·
footsteps on Doug's and Gary's walk-ins · clunk on the turkey landing (`bet`, `heli`) and the proclamation (`lincoln`) ·
`{ at: 'heli', sfx: 'helicopter', gain: .6 }` · click on the follow tap.
