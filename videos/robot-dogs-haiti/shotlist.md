# Shot list: "Why are there robot dogs carrying rifles in Haiti?" (short, ~1:10)

**Cast (3D, silent, mouths still):**
- **Doug** = `hoodie`: he thinks it's a robot army.
- **Gary** = `oxford`: Doug's neighbor, the one who says "watch it again."
- **The President** = `president`, with `phone: true`: El Salvador's president. He's a real person, so he stays silent and is only shown doing what he actually did, posting the video.
- **Little brother** = `polo`, scaled to 0.7, for the basement gag only.

**The robot dog is built in 3D in code** (`engine/robodog.js`, written in step 6). It needs walking legs and has to look identical in every shot, so it isn't a ChatGPT prop. Look: a gray boxy body, four thin backward-bent legs, a camera "face" with a glowing lens, and a dark rifle shape mounted on top. **No firing, no muzzle flash, ever.**

**Art:** 8 backgrounds + 5 props = **13 images**, all made in ChatGPT from `art-prompts.md` (3 batches). Save each one under its exact file name in `videos/robot-dogs-haiti/art/`.

**OpenArt video inserts:** none. Nothing here needs real physics, and keeping the robot in the engine keeps it consistent.

**The clue:** **the feet.** Every robot shot frames the robot's legs at the head of the line, ahead of everyone. "Watch the feet" (cue `callback`) cuts back to the same hallway framing.

**Tone:** keep it non-graphic. No gang members, no bodies or remains, and no Haitian people as jokes. All the jokes land on Doug.

## Images
| # | File | What |
|---|---|---|
| 01 | `01_living_room_night.png` | Doug's living room at night: couch, lamp, TV glow, a doorway to the basement stairs on the right |
| 02 | `02_portauprince_wide_day.png` | Port-au-Prince from a hillside: colorful houses on green hills down to a blue bay |
| 03 | `03_stadium_outside_day.png` | A big concrete soccer stadium seen from the empty plaza out front, two olive military trucks parked |
| 04 | `04_stadium_hallway_dim.png` | Concrete stadium corridor running straight away, dim, light pouring in at the far end, open doorways on both sides |
| 05 | `05_stadium_stairs_dim.png` | Concrete stairwell inside the stadium, going up and away from the camera |
| 06 | `06_president_office_day.png` | A presidential office: big desk, a blue-white-blue striped flag on a pole (no coat of arms), tall window |
| 07 | `07_basement_door_night.png` | Doug's basement door seen from the hallway: the door open onto dark stairs going down |
| 08 | `08_basement_dark_night.png` | The basement from the bottom of the stairs, pitch blue-dark, boxes, a water heater, one bare bulb that's off |
| P01 | `P01_phone_vertical.png` | A smartphone held upright, **screen solid green** (the engine plays the robot video in it) |
| P02 | `P02_controller.png` | A rugged handheld robot controller with two joysticks and a **solid-green screen** (the engine shows the robot's camera view in it) |
| P03 | `P03_roomba.png` | A round robot vacuum, three-quarter view, no logos |
| P04 | `P04_cargo_plane.png` | A gray military cargo plane, side view, facing right |
| P05 | `P05_helmet_camera.png` | A kid's bike helmet with a big action camera strapped on top |

## Shot plan (picture · camera · acting)
| Cue | Picture | Camera | Acting (face · pose · gesture) |
|---|---|---|---|
| q | 01 living room + P01 phone filling the frame; **the robot walks down hallway 04 inside the phone screen** | open already moving: slow push-in 1.0→1.12 on the phone | none (Doug's thumb edge only) |
| theory | 01 wide, Doug on the couch | hard cut, low, push-in | Doug `happy`, `tada` on "Robot army", `smirk` + `hips` on "The gangs are done" |
| gary | 01, Gary in the doorway | hard cut, medium | Gary `flat`, `cross`; small head tilt on "again" |
| salvador | 02 Port-au-Prince wide + P04 plane crossing the sky left→right | cut wide, slow pan right with the plane | none |
| fight | 03 stadium outside, trucks | hard cut, low, push-in toward the gate | none |
| video | 06 office | cut medium, push-in | The President `smile`, holding the phone, thumb tap (small `armR` raise), looks up `smirk` |
| robots | 04 hallway + robot dog (3D) walking toward camera | hard cut, low at robot height, slow pull-back | robot gait; **feet in frame** |
| stadium | 03 stadium outside (zoom 1.25 on the gate) | cut, short push-in | none |
| see | 01, Doug medium | hard cut | Doug `point` at the phone, `smirk`; Gary in the background `flat` |
| never | 04 hallway, robot stopped, rifle on top | cut; tight on the rifle, **hold 1.0 s** | robot still; **no flash** |
| what | 01, Doug | hard cut close | Doug `blink` → `think` |
| eyes | 04, robot close-up on its camera face, lens glows | push-in 1.0→1.15 | robot head turns left → right (scanning) |
| operator | P02 controller filling the frame; **screen shows 04 from the robot's height** | insert, slight hand drift | none |
| send | 05 stairs + robot climbing, then into a doorway in 04 | cut, follow from behind and low | robot gait; **feet in frame** |
| brother | 07 basement door + Little Brother (polo 0.7) + P05 helmet camera pops onto his head | hard cut, medium | Doug behind him, `smirk`, nudges (`point` toward the stairs); Little Brother `worried`, looks back |
| mount | 04, robot side profile, rifle on top | cut, slow pan along the robot | robot still |
| unknown | 01, Gary | hard cut, push-in | Gary `shrug`, `flat` |
| callback | **04 exact framing from `robots`**, the robot's feet walking | hard cut back to the plant, low on the feet | robot gait |
| first | 04, the robot walks through the far doorway first, empty hall behind it | hold | robot walks away from camera |
| next | 04, the doorway, robot gone, light flickers | slow push-in on the empty doorway, **hold 1.0 s** | none |
| end | 07 basement door, Doug at the top of the stairs | hard cut | Doug `worried`, `lean` back |
| roomba | 08 basement + P03 Roomba rolling in from the stairs, tiny light | low at floor level, push-in | Doug at the top of the stairs: `happy` → `blink` |
| ask | 04 hallway, empty, two paths: robot standing on the left, Gary standing on the right | static wide, small push-in | Gary `shrug`; robot head tilts |
| cta | hold 04 + **+ FOLLOW** pops in, cursor tap → **✓ FOLLOWING** | static | Gary `point` at the button; the robot's head turns to it |

**Something changes every 2–3 s:** about 24 cuts in ~70 s. The longest holds are `never` and `next` (1.0 s, on purpose).
**Cover idea:** Doug, `surprised`, in front of the robot in hallway 04. Headline: "ROBOT DOGS|WITH RIFLES|IN HAITI?"
