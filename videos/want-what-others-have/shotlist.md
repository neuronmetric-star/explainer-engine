# Shot list: "Why the heck do people want what others have?" (short, ≈1:15, Brian's script word for word)

**Production mode (Brian's call, 2026-11-20): OpenArt makes the video.** Every shot is an OpenArt
**image-to-video** clip (Wan 3.0, 480p, standard, audio off) animated from a **start frame Brian paints in ChatGPT**
(`art-prompts.md`). The engine then cuts the clips to the voice and adds the one-word captions, the **thought clouds**,
punch-ins inside the longer clips (so something changes every 2–3 s) and the follow button. Image-to-video, not
text-to-video, because the same cars, intersection and cast must look identical in every shot.

**Changed from the usual format:** the cast is painted INTO the start frames (ChatGPT draws them from
`ref/cast_sheet.jpg`), so they appear in the AI clips. Every motion prompt keeps mouths closed (characters never talk).

**Brian's notes (2026-11-20):**
- **Thought clouds:** every time someone wishes for something, a big white cartoon thought cloud POPS up over their
  head with the thing they wish for inside it. The engine draws the cloud (one look for every cloud), pops it on
  the word (scale 0 → 1.1 → 1 in 0.25 s, small trailing circles down to the head), bobs it gently, and holds it
  until the cut. The wished-for thing is a green-screen prop (P01–P07) keyed inside the cloud.
  The cloud sits above the caption band and out of the top 140 px.
- **Traffic:** busy streets with background traffic in every street shot.
- **Same direction the whole time:** every vehicle faces or moves the same way (toward camera and right in front views,
  pointing RIGHT in side views; the helicopter always flies RIGHT). **At the green light they all split:**
  F14 all traffic rolls forward together, F15 overhead: the black SUV turns left, the yellow supercar goes straight,
  the little car turns right.

**Cast** (white glossy sphere head, simple drawn face, black stick neck, white cartoon gloves):
| Role | Who | Look |
|---|---|---|
| Lamborghini owner | **Victor** (`suit`) | navy suit, red tie, gold watch, stocky |
| G-Wagon driver | **Gary** (`oxford`) | pale blue oxford shirt, glasses |
| Regular-car driver | **polo guy** (`polo`) | olive polo |
| Walker | **Doug** (`hoodie`) | mustard hoodie, jeans, white sneakers, paper grocery bag |
| Man in the wheelchair | new: **Walt** (not named in the narration) | same style, gray cardigan, teal scarf, simple manual wheelchair. Calm and dignified, never a punchline |

**Art:** **19 start frames** (F01–F19) + **7 cloud props** (P01–P07) = **26 images**, one ChatGPT chat, 5 batches →
`videos/want-what-others-have/art/`.
**Clips:** 19 clips, ≈ 76 s total → **≈ 1,520 credits** (Wan 3.0, 480p, standard, audio off: 20 credits/s, a 4 s clip = 80).
With the test clip and a few retakes, budget **≈ 1,950**. The cloud props and the CTA still cost 0 credits.
**Frame shape:** ChatGPT paints 2:3, the video is 9:16, so the engine crops about 8% off each side. Keep the action in the middle 80%.

## Thought clouds (engine pop-ups)
| Cue word | Over | Inside the cloud |
|---|---|---|
| "worked really hard to buy his **dream** car" | Victor at his desk (F02) | P02 yellow supercar |
| "Victor looks up and **thinks**" | Victor in the car (F06) | P01 helicopter |
| "the guy next to him in a G-Wagon is **thinking**" | Gary (F08) | P02 yellow supercar |
| "the guy in the regular car is **thinking**" | polo guy (F09) | P03 black SUV |
| "Doug, walking by, is **thinking**" | Doug (F10) | P04 all three cars |
| "used to **picture** himself behind the wheel" | Victor at his desk (F12) | P06 Victor driving the supercar |
| "**picturing** himself in the helicopter" | Victor in the car (F13) | P07 Victor flying the helicopter |
| "watching him walk by, **thinking**" | Walt (F16 → F17) | P05 Walt walking |

## Start frames + clips
| # | Cue | Start frame (ChatGPT) | OPENART motion prompt (Wan 3.0 i2v) | Clip |
|---|---|---|---|---|
| F01 | q | Low wide shot of the busy intersection: red light, three lanes queued, all facing camera-right; supercar (Victor), SUV (Gary), little car (polo guy) in the front row | slow push-in toward the yellow car, the traffic light glows red, heat shimmer, cars idle in place, nobody moves forward | 3 s |
| F02 | problem ("worked really hard") | Victor at a small desk at night under a lamp, piles of papers, tired | Victor types fast and stamps papers, the lamp flickers, mouth still | 3 s |
| F03 | problem ("dream car, a Lamborghini") | Side view, car pointing right: Victor in the supercar, gloves on the wheel, proud smile | slow push-in, Victor settles back proudly and gives a small nod, cars stay still, mouth still | 3 s |
| F04 | light | Close side view, Victor slumped and bored, red light on his head | he slumps lower and drums his glove fingers on the wheel, red light pulses, mouth still | 4 s |
| F05 | heli | Very low angle up past the red light: helicopter in the golden sky | the helicopter flies to the right across the frame right over the camera, rotor blur, camera tilts up to follow | 3 s |
| F06 | looks | Victor through the windshield, head back, looking straight up, wistful | slow push-in on Victor's face as his head tilts back to watch the sky, mouth closed and still | 4 s |
| F07 | nolights | High aerial: helicopter flying right over rooftops, jammed streets far below | the helicopter glides to the right smoothly, camera tracks alongside, tiny cars below stay stuck, clouds drift | 2 s |
| F08 | gwagon | Side view, SUV pointing right: Gary looks across at the supercar in the next lane | Gary slowly turns his head toward the yellow car and leans a little, longing, cars stay still, mouth still | 7 s (punch-in at "thinking") |
| F09 | regular | Side view, little car pointing right: polo guy cranes up at the towering SUV | the polo guy cranes his neck up toward the black SUV, small sigh in his shoulders, cars stay still, mouth still | 6 s (punch-in at "thinking") |
| F10 | doug | Doug on the sidewalk with a grocery bag, looking at the queued traffic | Doug walks slowly along the sidewalk, head turning to look at the cars, the cars stay stopped at the light, camera tracks with him | 6 s (punch-in at "thinking") |
| F11 | bet | Close on Doug, deadpan face | slow push-in on Doug's face, one slow blink, tiny shrug, mouth still | 3 s |
| F12 | picture | Same office as F02: Victor leaning back, dreamy, gazing up | Victor sways dreamily in his chair and smiles, lamp glows, mouth still | 4 s |
| F13 | now | Victor in the supercar at the red light, dreamy, gazing up | Victor sighs and gazes up, red light pulses, mouth still | 4 s |
| F14 | green ("The light turns green.") | Same view as F01, light green, all traffic starting to roll toward camera together | the traffic light is green, all the cars drive forward together toward the camera in the same direction, smooth acceleration | 2 s |
| F15 | green ("The cars pull away.") | High overhead of the intersection: the cars splitting three ways | top-down view, the black SUV turns left, the yellow supercar drives straight ahead, the teal car turns right, the other traffic follows them, long shadows | 3 s |
| F16 | wheel | Sidewalk wide: Doug walking past the bus stop; Walt beside the bench watching him | Doug walks past from left to right, Walt's head slowly follows him, traffic flows by in one direction, mouth still | 5 s |
| F17 | walk | Close on Walt, gentle and wistful | very slow push-in on Walt's face, one slow blink, a small kind smile, mouth closed | 3 s |
| F18 | moral | Doug stopped, looking down at his sneakers, small surprised smile | Doug looks down at his feet, wiggles one sneaker, then looks up with a small smile, traffic flows behind him, mouth still | 7 s (punch-in at "appreciate") |
| F19 | end · cta | Golden-hour wide: Doug waves back at Walt, Walt waves back | Doug waves to Walt and keeps walking, Walt waves back, warm light, gentle push-in, mouths still | 4 s (then a still of the last frame for the CTA) |

## Shot plan (engine assembly, cut on the cue word)
| Cue | Picture | Camera (engine, on top of the clip) | Acting (in the clip) + cloud |
|---|---|---|---|
| q | F01 | already moving at frame 1; scale 1.0→1.06 | — |
| problem | F02 → F03 on "a Lamborghini" | hard cut on "See", hard cut on "Lamborghini" | Victor working, **cloud: supercar** on "dream" → proud in the car |
| light | F04 | hard cut on "And now", 2-frame shake on "red" | slumps, drums fingers |
| heli | F05 | hard cut on "Then" | — |
| looks | F06 | cut on "Victor looks", push | looks up; **cloud: helicopter** on "thinks" |
| nolights | F07 | hard cut on "No" | — |
| gwagon | F08 | cut on "But", punch-in 1.0→1.15 on "thinking" | Gary turns; **cloud: supercar** on "thinking" |
| regular | F09 | cut on "But", punch-in on "thinking" | polo guy cranes up; **cloud: SUV** |
| doug | F10 | cut on "But", punch-in on "thinking" | Doug walks, looks; **cloud: all three cars** |
| bet | F11 | hard cut on "Honestly" | blink + shrug |
| picture | F12 | hard cut on "See", slow push | dreamy; **cloud: Victor driving the supercar** on "picture" |
| now | F13 | hard cut on "Now", punch-in on "helicopter" | **cloud: Victor flying the helicopter** on "picturing" |
| green | F14 → F15 on "The cars" | hard cut on "green", hard cut to overhead | all roll forward together → split three ways |
| wheel · walk | F16 → F17 on "thinking" | cut on "But", then cut to Walt | Walt watches Doug; **cloud: Walt walking** on "thinking" (stays through "again") |
| moral | F18 | cut on "Sometimes", punch-in on "appreciate" | Doug looks at his feet, smiles |
| end | F19 | cut on "What's", slow push | wave and wave back |
| cta | F19 last frame (still) | slow push; **+ FOLLOW** pops, cursor taps → **✓ FOLLOWING** | — |

## Production log (2026-11-20)
- Voice: Brian's OpenArt/ElevenLabs read (83.8 s) → pauses trimmed to ~0.3 s + atempo 1.1 → `voice.mp3` 68.3 s → `align.js`.
- Clips: Wan 3.0 i2v, 480p, standard, audio off, from 9:16 crops of Brian's frames (`art916/`, not committed).
  Credits: 60 test + 1,360 (19 clips incl. one F17 redo) = **1,420**.
- Substitutes (no art yet): F06 = F03 frame animated "looks up"; F13 = F04 frame animated "looks up";
  green light = Victor-side green frame (stretched over F15 until the overhead split arrives); F18 → F11 clip.
- F01: Wan kept flipping the light green (twice), so the opening uses the painting + a 14% engine push.
- F17 v1 had a stray realistic person walk through; regenerated with "no other people".
- Assembly: `python3 videos/want-what-others-have/assemble.py` (preview: `--preview 1.0,7.1`; cover frame: `--frame 16.9`).
- Still wanted from Brian: F15 split overhead, F18 Doug looks down, P05 Walt walking, P07 Victor flying the helicopter.
