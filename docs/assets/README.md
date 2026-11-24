# Shared assets (used in every video)

| File | What | Rule |
|---|---|---|
| `H01_helicopter.png` | The Lamborghini helicopter: white with a navy-blue stripe, side view facing right, on green | The helicopter ending, every video (PLAYBOOK §1.12a). Copy into `videos/<slug>/art/`. |

| `H00_helicopter_clip_openart.mp4` | The original OpenArt clip from the Lamborghini video (5 s, 480×854): the helicopter flies off into a sunset over the city | Source of truth for how the helicopter looks; also an OpenArt asset |
| `H00_helicopter_reference.png` | A frame from that clip (1.0 s) | Attach it in ChatGPT when painting H01, so it matches |

| `E01_city_sunset_ending.png` | **THE SIGNATURE ENDING** (Brian, Nov 24 2026): the city at sunset from the original helicopter clip, seen from a rooftop where the cast stands; open sky on top for the helicopter | The LAST story shot of every video (PLAYBOOK §1.12a). Copy into `videos/<slug>/art/`. ✅ Painted Nov 24 2026 (first used in Plane Heck ep. 2). Cast spots: Doug (360,1270), Gary (680,1240); plate `hz .45, vx .5, camH 2.0`. |

## E01 prompt (attach `H00_helicopter_reference.png`) (ChatGPT, same style bible as the video batch)

```
E01_city_sunset_ending.png: SHOT: from a rooftop terrace looking out over a big city at sunset, eye level, 24mm lens feel, portrait 2:3, horizon about 48% from the top.
PLACE + MOOD: exactly the city in the attached reference image (H00_helicopter_reference.png): the golden-hour goodbye of our series. Warm, proud, a little dreamy.
HERO: the city skyline under a huge sunset sky: a tall blue glass tower on the LEFT reflecting the sunset, red-brick apartment and office buildings, a long tree-lined avenue full of tiny cars running straight into the hazy distance, more towers fading into pink haze at the horizon.
FOREGROUND: the rooftop terrace the camera stands on: a low parapet wall with a simple metal railing along the bottom edge, a big potted olive tree cropped at the right edge, a strand of warm string lights along the railing.
MIDGROUND: the rooftop floor (warm concrete tiles) runs from the bottom of the frame to the railing, with a couple of wooden outdoor chairs pushed to the left side.
BACKGROUND: the skyline and avenue as in the reference, soft and hazy with distance.
DRESSING: rooftop water tanks and AC units on the nearby buildings, green trees along the avenue, a few birds as tiny specks far away, glowing windows starting to light up.
LIGHT: low golden sun on the LEFT just above the horizon, warm orange glow, long soft shadows, pink and peach clouds, the upper sky turning clear blue.
PALETTE: sunset orange, peach, pink, warm brick red, glass blue, with a deep blue upper sky.
TEXTURE: painterly clouds, brick, glass reflections, concrete tiles.
STAGING: the TOP THIRD of the frame is OPEN SKY with soft clouds and nothing tall in it (a helicopter will fly across). A clear, flat stretch of rooftop floor in the lower-middle, about half the frame wide, for two or three characters to stand (no objects). Keep the band at 60-72% height calm.
TEXT: none. No numbers, no logos, no signs.
STRICT: no people, no characters, no animals, no helicopter, no planes.
```

## H01 prompt (attach `H00_helicopter_reference.png`) (ChatGPT, same style bible as the video batch)

```
H01_helicopter.png: A sleek private helicopter in flight, seen exactly from the side, facing RIGHT, nose tipped slightly down as if cruising forward: exactly the helicopter in the attached reference image: glossy WHITE body with a navy-blue swoosh stripe along the side, big dark tinted windows (no people visible), black landing skids, a slim tail boom ending in a round enclosed tail fan with a navy accent. The main rotor on top drawn as a long, thin, slightly blurred horizontal streak. Flat 2D storybook style with soft painterly gradients, warm light from the left. Centered on a solid pure green #00FF00 background, no shadow, no text, no logos.
```
