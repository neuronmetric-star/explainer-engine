# Prompt templates

Fill `{…}`. Prompts are always English. Keep the LOCK blocks verbatim. They are what stops drift.

## Style anchor (first run only, text2image, nano-banana-pro, 16:9, 2K)

**3D**
```
Character style reference sheet, single character, plain light-grey studio backdrop.
A stylised 3D stickman: a perfectly smooth glossy WHITE BALL HEAD with NO ears, NO nose, NO hair;
the face is DRAWN on the ball in simple black lines (two dot eyes, thin eyebrows, small curved mouth),
not sculpted. Thin black stick-like limbs and neck, simple mitten hands with 4 fingers, small rounded
torso wearing a plain grey t-shirt and dark trousers, simple shoes. Soft clay-like 3D render,
gentle global illumination, subtle ambient occlusion, Pixar-short lighting.
Show: front view, 3/4 view, side view, back view, plus 3 expressions (happy, shocked, determined).
No text, no labels, no panels borders, no logo.
```

**2D**
```
Character style reference sheet, single character, plain off-white backdrop.
Flat hand-drawn 2D cartoon stickman with thick clean black outlines: a WHITE circle head with NO ears,
face drawn in simple black lines (dot eyes, eyebrows, curved mouth); thin stick limbs, mitten hands,
small torso in a flat grey shirt. Flat colour fills with one soft shadow tone.
Show: front, 3/4, side, back, plus 3 expressions (happy, shocked, determined).
No text, no labels, no panel borders, no logo.
```

## Character sheet (image2image, 16:9, 2K, imageCount 1)

```
Character reference sheet of {NAME}, a {male|female} stickman character.
Image 1 is ONLY a style and body-plan reference: copy its {2D drawing | 3D render} style, the white
ball head with a drawn face and no ears, the thin stick limbs and mitten hands. Take NOTHING else
from Image 1's character (not its clothes, colours or expression set).
{For each user photo: "Image N: take ONLY the {hairstyle | outfit | glasses | colours} from this photo;
ignore the real face, body and background."}
{NAME} wears: {clothes, colours}. Accessories (must be visible in every view): {list}.
Hair/headwear sits ON the ball head; the head stays a smooth white ball with no ears.
Show front, 3/4, side and back views plus happy / shocked / determined expressions,
plain {light-grey | off-white} backdrop, evenly spaced, same scale.
No text, no labels, no extra characters, no panel borders.
```

**Female block (add for female characters):**
```
She is a woman: slimmer shoulders, slightly narrower waist, no beard, no stubble, {hair description}
clearly visible, longer eyelashes drawn on the face. Do not copy any male traits from Image 1.
```

## Keyframe (image2image, 9:16, 2K, imageCount 1)

```
Vertical 9:16 frame from an animated short, {3D stylised | flat 2D in a soft 3D world} style.
CHARACTERS: {NAME} exactly as in the character sheet (Image {k}) — same outfit, colours and accessories,
white ball head with a drawn face, no ears, thin stick limbs. {other characters}.
{If same location: "THE PLACE: Image {p} shows this location — keep the room, props, colours and
lighting identical."}
MOMENT: {exactly what the narration line shows, one action, mid-motion}.
SETTING: {location, era, time of day}. Lighting: {key light, mood}.
CAMERA: {shot size, angle}. Main subject in the middle 60% of the frame; keep the top 8% and the
bottom 20% free of important detail and free of text.
{On-screen text, only if the story needs it: 'the sign reads exactly "{TEXT}"'}
No captions, no subtitles, no watermark, no extra limbs, no realistic human faces.
```

## Animation (pixverseV6 image2video, 1080p, generateAudio true)

```
Animate this frame. LOCK: keep the exact art style, character design, outfit, accessories and set
from the start frame; the head stays a smooth white ball with a drawn face; exactly two arms and two legs;
no objects appear or disappear; no cuts, one continuous shot.
ACTION: {one clear action that matches the line, start → end}.
CAMERA: {slow push-in | gentle orbit left | tracking alongside | tilt up | locked-off static camera}.
AUDIO: sound effects only — {specific sfx: waves, rope creak, coin clink}. No music, no speech,
no voices, no singing.
```

With an `endFrame`, add: `End exactly on the end frame; move smoothly and naturally between the two frames.`

## End-state edit (image2image from the keyframe, 9:16, 2K)

```
Same image, same camera, same lighting and set. Change ONLY: {the end state, e.g. "the stone is now
underwater, sinking, rope snapped"}. Everything else identical.
```
