# Shot list: "Why the heck do people want what others have?" (short, ≈1:15, Brian's script word for word)

**Production mode (Brian's call, 2026-11-20): OpenArt makes the video.** Every shot is an OpenArt
**image-to-video** clip (Wan 3.0, 480p, standard, audio off) animated from a **start frame Brian paints in ChatGPT**
(`art-prompts.md`). The engine then cuts the clips to the voice and adds the one-word captions, punch-ins inside the
longer clips (so something changes every 2–3 s) and the follow button. Image-to-video, not text-to-video, because the
same Lamborghini, intersection and cast must look identical in every shot. Text-to-video redraws them every time.

**Changed from the usual format:** the cast is painted INTO the start frames (ChatGPT draws them from
`ref/cast_sheet.jpg`), so they appear in the AI clips. Every motion prompt keeps mouths closed (characters never talk).

**Cast** (white glossy sphere head, simple drawn face, black stick neck, white cartoon gloves):
| Role | Who | Look |
|---|---|---|
| Lamborghini owner | **Victor** (`suit`) | navy suit, red tie, gold watch, stocky |
| G-Wagon driver | **Gary** (`oxford`) | pale blue oxford shirt, glasses |
| Regular-car driver | **polo guy** (`polo`) | olive polo |
| Walker | **Doug** (`hoodie`) | mustard hoodie, jeans, white sneakers, paper grocery bag |
| Man in the wheelchair | new: **Walt** (not named in the narration) | same style, gray cardigan, teal scarf, simple manual wheelchair. Calm and dignified, never a punchline |

**Locked objects** (described once in START, then referenced): yellow wedge supercar (the "Lamborghini", no logos) ·
black boxy SUV (the "G-Wagon", no logos) · small teal hatchback (the "regular car") · white-and-navy helicopter ·
one city intersection at golden hour · Victor's small night-time office.

**Art:** **18 start frames** (F01–F18), one ChatGPT chat, 4 batches → `videos/want-what-others-have/art/`.
**Clips:** 18 clips, ≈ 74 s total → **≈ 1,480 credits** (Wan 3.0, 480p, standard, audio off: 20 credits/s, a 4 s clip = 80).
With the test clip and a few retakes, budget **≈ 1,900**. The CTA is a still of F18 with an engine push-in: 0 credits.
**Frame shape:** ChatGPT paints 2:3, the video is 9:16, so the engine crops about 8% off each side. Keep the action in the middle 80%.
**Plant → payoff:** F02 shows Victor at his desk with the yellow supercar in a thought bubble (on screen at 0:04);
F12 brings it back ("used to picture himself"), F13 swaps the bubble to the helicopter.

## Start frames + clips
| # | Cue | Start frame (ChatGPT) | OPENART motion prompt (Wan 3.0 i2v) | Clip |
|---|---|---|---|---|
| F01 | q | Low wide shot of the intersection: red light, yellow supercar first in line, black SUV in the left lane, teal hatchback behind; Victor visible through the windshield | slow push-in toward the yellow car, the traffic light glows red, heat shimmer, static otherwise | 3 s |
| F02 | problem ("worked really hard") | Victor at a small desk at night under a lamp, piles of papers, tired, a thought bubble above him with the yellow supercar | Victor types fast and stamps papers, the lamp flickers, the thought bubble gently bobs, mouth still | 3 s |
| F03 | problem ("dream car, a Lamborghini") | Medium through the driver window: Victor in the supercar, gloves on the wheel, proud closed-mouth smile | slow push-in, Victor settles back proudly and gives a small nod, mouth still | 3 s |
| F04 | light | Close on Victor through the side window, slumped, bored, red light reflecting on his head and the yellow paint | he slumps lower and drums his glove fingers on the wheel, red light pulses, mouth still | 4 s |
| F05 | heli | Very low angle from the street up past the red traffic light: the helicopter crossing a golden sky | the helicopter flies across the frame from left to right right over the camera, rotor blur, camera tilts up to follow | 3 s |
| F06 | looks | Victor seen through the windshield from above, head tilted back looking straight up, wistful | slow push-in on Victor's face as his head tilts back to watch the sky, mouth closed and still | 4 s |
| F07 | nolights | High aerial: the helicopter gliding over rooftops, open sky, no traffic lights near it | the helicopter glides forward smoothly, camera tracks alongside, clouds drift | 2 s |
| F08 | gwagon | Gary in the black SUV, turning to look out his window at the yellow supercar | Gary slowly turns his head toward the yellow car and leans a little, longing, mouth still | 7 s (engine punch-in at "thinking") |
| F09 | regular | Polo guy in the teal hatchback, craning up at the tall black SUV beside him | the polo guy cranes his neck up toward the black SUV, small sigh in his shoulders, mouth still | 6 s (punch-in at "thinking") |
| F10 | doug | Doug on the sidewalk with a paper grocery bag, looking at the three cars | Doug walks slowly along the sidewalk, head turning to look at the cars, camera tracks with him | 6 s (punch-in at "thinking") |
| F11 | bet | Close on Doug, deadpan face, bag on his hip | slow push-in on Doug's face, one slow blink, tiny shrug, mouth still | 3 s |
| F12 | picture | Same office as F02 (night, lamp, papers): Victor leaning back in his chair, dreamy smile, big thought bubble of himself driving the yellow supercar | the thought bubble swells and bobs, Victor sways dreamily in his chair, mouth still | 4 s |
| F13 | now | Victor in the yellow supercar at the red light, gazing up, thought bubble of himself flying the helicopter | the thought bubble swells and bobs, the tiny helicopter inside it tilts, Victor sighs, mouth still | 4 s |
| F14 | green | Wide of the intersection: the traffic light is green, the three cars pulling away down the street | the three cars accelerate away from the camera down the street, the green light glows, leaves swirl | 3 s |
| F15 | wheel | Sidewalk wide: Doug walking past the bus stop; Walt in his wheelchair beside the bench, watching Doug go by | Doug walks past from left to right, Walt's head slowly follows him, calm, mouth still | 5 s |
| F16 | walk | Close on Walt, gentle and wistful, warm golden light | very slow push-in on Walt's face, one slow blink, a small kind smile, mouth closed | 3 s |
| F17 | moral | Doug stopped on the sidewalk, looking down at his own sneakers with a small surprised smile | Doug looks down at his feet, wiggles one sneaker, then looks up with a small smile, mouth still | 7 s (punch-in at "appreciate") |
| F18 | end · cta | Golden-hour wide of the sidewalk: Doug walking on, turning to give Walt a small wave; Walt smiling and waving back | Doug waves to Walt and keeps walking, Walt waves back, warm light, gentle push-in, mouths still | 4 s (then a still of the last frame for the CTA) |

## Shot plan (engine assembly, cut on the cue word)
| Cue | Picture | Camera (engine, on top of the clip) | Acting (in the clip) |
|---|---|---|---|
| q | F01 | already moving at frame 1; scale 1.0→1.06 | — |
| problem | F02 → F03 on "dream" | hard cut on "See", hard cut on "dream" | Victor working → proud in the car |
| light | F04 | hard cut on "And now", 2-frame shake on "red" | slumps, drums fingers |
| heli | F05 | hard cut on "Then" | — |
| looks | F06 | cut on "Victor looks", push | looks up, wistful |
| nolights | F07 | hard cut on "No" | — |
| gwagon | F08 | cut on "But", punch-in 1.0→1.15 on "thinking" | Gary turns to the Lambo |
| regular | F09 | cut on "But", punch-in on "thinking" | polo guy cranes up |
| doug | F10 | cut on "But", punch-in on "thinking" | Doug walks, looks |
| bet | F11 | hard cut on "Honestly" | blink + shrug |
| picture | F12 | hard cut on "See", slow push | dreamy Victor, supercar bubble |
| now | F13 | hard cut on "Now", punch-in on "helicopter" | helicopter bubble |
| green | F14 | hard cut on "green" | cars pull away |
| wheel · walk | F15 → F16 on "thinking" | cut on "But", then cut to Walt | Walt watches Doug pass |
| moral | F17 | cut on "Sometimes", punch-in on "appreciate" | Doug looks at his feet, smiles |
| end | F18 | cut on "What's", slow push | wave and wave back |
| cta | F18 last frame (still) | slow push; **+ FOLLOW** pops, cursor taps → **✓ FOLLOWING** | — |
