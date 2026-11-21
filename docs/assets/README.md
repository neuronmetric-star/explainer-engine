# Shared assets (used in every video)

| File | What | Rule |
|---|---|---|
| `H01_helicopter.png` | The Lamborghini helicopter: white with a navy-blue stripe, side view facing right, on green | The helicopter ending, every video (PLAYBOOK §1.12a). Copy into `videos/<slug>/art/`. |

| `H00_helicopter_clip_openart.mp4` | The original OpenArt clip from the Lamborghini video (5 s, 480×854): the helicopter flies off into a sunset over the city | Source of truth for how the helicopter looks; also an OpenArt asset |
| `H00_helicopter_reference.png` | A frame from that clip (1.0 s) | Attach it in ChatGPT when painting H01, so it matches |

## H01 prompt (attach `H00_helicopter_reference.png`) (ChatGPT, same style bible as the video batch)

```
H01_helicopter.png: A sleek private helicopter in flight, seen exactly from the side, facing RIGHT, nose tipped slightly down as if cruising forward: exactly the helicopter in the attached reference image: glossy WHITE body with a navy-blue swoosh stripe along the side, big dark tinted windows (no people visible), black landing skids, a slim tail boom ending in a round enclosed tail fan with a navy accent. The main rotor on top drawn as a long, thin, slightly blurred horizontal streak. Flat 2D storybook style with soft painterly gradients, warm light from the left. Centered on a solid pure green #00FF00 background, no shadow, no text, no logos.
```
