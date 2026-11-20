# Shot list: "Why the heck do people want what others have?" (short, ≈1:05)

**Production mode (Brian's call, 2026-11-20): OpenArt makes the video.** Every shot is an OpenArt
**image-to-video** clip (Wan 3.0, 480p, standard, audio off) animated from a **start frame Brian paints in ChatGPT**
(`art-prompts.md`). The engine then cuts the clips to the voice, adds the one-word captions, the push-ins between
cuts and the follow button. Image-to-video, not text-to-video, because the same Lamborghini, intersection and cast
have to look identical in every shot. Text-to-video redraws them every time.

**Changed from the usual format:** the cast is painted INTO the start frames (ChatGPT draws them from our
cast sheet), so they appear in the AI clips. Every motion prompt keeps mouths closed and still (characters never talk).

**Cast** (draw from `ref/cast_sheet.jpg`: white glossy sphere head, simple drawn face, black stick neck, white cartoon gloves):
| Role | Who | Look |
|---|---|---|
| Lamborghini owner | **Victor** (`suit`) | navy suit, red tie, gold watch, stocky |
| G-Wagon driver | **Gary** (`oxford`) | blue oxford shirt, glasses |
| Little-car driver | **polo guy** (`polo`) | olive polo |
| Walker | **Doug** (`hoodie`) | mustard hoodie, jeans, white sneakers, paper grocery bag |
| Man in the wheelchair | new: **Walt** (not named in the narration) | same sphere-head style, gray cardigan, teal scarf, simple manual wheelchair. Calm and dignified, never a punchline |

**Locked objects** (described once in START, then "the exact … from F01"):
yellow wedge supercar (Victor's "Lamborghini", no logos) · black boxy SUV (the "G-Wagon", no logos) ·
small dented teal hatchback (the "little car") · white-and-navy helicopter · Victor's phone on a dash mount ·
one city intersection at golden hour.

**Art:** **18 start frames** (F01–F18), all in one ChatGPT chat from `art-prompts.md` (4 batches) → `videos/want-what-others-have/art/`.
**Clips:** 18 clips, ≈ 57 s total → **≈ 1,140 credits** at 20 credits/s (Wan 3.0, 480p, standard, audio off; 4 s = 80).
Plus the test clip and about 3 retakes ≈ **1,500 credits** in all. The CTA is a still (F18) with an engine push-in: 0 credits.
**Frame shape:** ChatGPT paints 2:3; the video is 9:16, so the engine crops about 8% off each side.
Keep the action in the middle 80% (every prompt says so).
**The clue:** the phone wallpaper (F03, the yellow supercar) is on screen at 0:07, long before the treadmill line explains it.
It pays off at F14 (now a helicopter).

## Start frames + clips
| # | Cue(s) | Start frame (ChatGPT) | OPENART motion prompt (Wan 3.0 i2v) | Clip |
|---|---|---|---|---|
| F01 | q | Low wide shot of the intersection: red traffic light, the yellow supercar first in line, the black SUV in the next lane, the teal hatchback behind; Victor visible through the windshield | slow push-in toward the yellow car, the traffic light glows red, heat shimmer, light city traffic in the distance, static otherwise | 4 s |
| F02 | problem | Medium on Victor in the supercar's driver seat, both gloves on the wheel, proud smile | slow push-in on Victor, he settles back proudly, small head nod, mouth closed and still | 4 s |
| F03 | wallpaper | Insert: the phone on the dash mount, wallpaper = a photo of the same yellow supercar | slight push-in on the phone screen, screen glows softly, nothing else moves | 2 s |
| F04 | light | Close on Victor through the side window, slumped, face `flat`, red light reflecting on the glossy head | he slumps lower and drums his glove fingers on the wheel, red light pulses, mouth still | 3 s |
| F05 | heli | Very low angle from the street up past the traffic light: the helicopter crossing a clear golden sky | the helicopter flies across the frame from left to right, rotor blur, camera tilts up slightly to follow | 3 s |
| F06 | heli (line) | Victor's face through the windshield, looking straight up, longing face (`worried`/wistful) | slow push-in on Victor's face, his head tilts back to watch the sky, mouth closed and still | 2 s |
| F07 | nolights | Above the city: the helicopter gliding over rooftops, no traffic lights anywhere | the helicopter glides forward smoothly over the rooftops, camera tracks alongside, gentle clouds drift | 3 s |
| F08 | gwagon | Gary in the black SUV, glasses, looking sideways out his window at the yellow supercar | Gary slowly turns his head toward the yellow car and leans a little, longing, mouth still | 4 s |
| F09 | little | Polo guy in the teal hatchback, peeking up at the tall black SUV beside him | the polo guy cranes his neck up toward the black SUV, small sigh in his shoulders, mouth still | 3 s |
| F10 | doug | Doug on the sidewalk with a paper grocery bag, looking at all three cars | Doug walks slowly along the sidewalk, head turning to look at the cars, camera tracks with him | 4 s |
| F11 | bet | Close on Doug, deadpan `flat` face, bag on his hip | slow push-in on Doug's face, one slow blink, tiny shrug, mouth still | 2 s |
| F12 | why · compare | Street gag: a giant yellow tape measure stretched between the teal hatchback and the black SUV, the SUV looking huge next to it | the tape measure snaps out between the cars, camera pulls back slightly, cars still | 4 s |
| F13 | minivan | The yellow supercar parked under the hovering helicopter's shadow; the car looks small and plain under it | the helicopter lowers slowly, its shadow grows over the yellow car, dust swirls | 3 s |
| F14 | normal · treadmill | Gag: Victor in his suit running on a gym treadmill in the middle of the street, a photo of the helicopter hanging just out of reach on a stick in front of him | Victor runs steadily on the treadmill, belt moving, he never moves forward, the photo bounces ahead of him, mouth closed | 5 s |
| F15 | callback | Insert: the same phone on the dash mount, wallpaper now = a photo of the helicopter | slight push-in on the screen, the screen glows, nothing else moves | 2 s |
| F16 | wheel | Sidewalk wide: Doug walking past a bus stop; Walt in his wheelchair at the bus stop, watching Doug walk by, soft wistful smile | Doug walks past from left to right, Walt's head slowly follows him, calm, mouth still | 4 s |
| F17 | walk | Close on Walt, gentle, wistful, warm golden light | very slow push-in on Walt's face, one slow blink, a small kind smile, mouth closed | 3 s |
| F18 | moral · end · cta | Doug stopped on the sidewalk, looking down at his own sneakers with a small surprised smile; behind him the light is green and the cars pull away | the cars pull away behind Doug, he looks down at his feet, then up, a small smile, mouth still | 4 s (then a still of the last frame for the CTA) |

## Shot plan (engine assembly, cut on the cue word)
| Cue | Picture | Camera (engine, on top of the clip) | Acting (in the clip) |
|---|---|---|---|
| q | F01 | hard open, already moving; scale 1.0→1.06 | — |
| problem | F02 | hard cut on "See" | Victor proud, nod |
| wallpaper | F03 | hard cut on "wallpaper" | — |
| light | F04 | hard cut on "red", 2-frame shake | Victor slumps, drums fingers |
| heli | F05 → F06 on "Man" | cut, then cut to the face | Victor looks up, longing |
| nolights | F07 | hard cut on "No" | — |
| gwagon | F08 | hard cut on "G-Wagon" | Gary turns to the Lambo |
| little | F09 | hard cut | polo guy cranes up |
| doug | F10 | hard cut on "Doug" | Doug walks, looks |
| bet | F11 | hard cut on "Honestly" | Doug blink + shrug |
| why · compare | F12 | cut on "Why", push 1.0→1.08 | — |
| minivan | F13 | cut on "Next", punch-in on "minivan" | — |
| normal · treadmill | F14 | cut on "Once" | Victor runs in place |
| callback | F15 | hard cut on "wallpaper" | — |
| wheel | F16 | cut on "But" | Doug passes, Walt watches |
| walk | F17 | cut on "I wish", slow push | Walt wistful smile |
| moral · end | F18 | cut on "We're", slow push to the end | Doug looks at his feet, smiles |
| cta | F18 last frame (still) | slow push; **+ FOLLOW** pops, cursor taps → **✓ FOLLOWING** | — |
