# Prompt pack — 2D worlds for ChatGPT

**How it works:** you make the **worlds and props** in ChatGPT. I add the **3D characters**, the
camera moves, the faces, the captions and the voice in our engine. So the images must have
**no people in them**. Your characters get dropped in afterwards, lit to match.

**Per 1:30 video, expect about** 5–7 locations × 2–3 camera angles (≈ 12–18 backgrounds) plus 5–10
props. A new picture every 2–3 seconds comes from cutting between those and moving the camera
across them.

---

## Rules for every image

| Rule | Why |
|---|---|
| **Portrait 2:3** (ChatGPT's tall size, 1024×1536) | The video is 9:16; the extra width lets the camera pan |
| **No people, no faces, no hands** | The 3D characters get added in the engine |
| **Clear, flat floor in the lower-middle** | That's where the characters stand |
| **Say where the sun or light comes from** (left / right / behind) | I light the characters to match |
| **Horizon at about 45% from the top** for wide shots | So the 3D characters' feet line up with the floor |
| **No text** unless the prompt says so | AI text is often wrong; I add text where needed |
| **Props on solid pure green #00FF00** | I cut the green out automatically |

**File names:** `<video>_<place>_<angle>_<time>.png`, for example `bbd_bank_wide_day.png`.
Send them here in the chat, and I'll save them to `videos/<video>/art/`.

---

## Step 1: lock the style (one ChatGPT chat per video)

Paste this first, then ask for each image in **the same chat** so the look stays consistent:

```
You are the background artist for a vertical animated explainer series. For every image I ask for, follow this style bible exactly:

STYLE: flat 2D storybook illustration for a modern animated show. Clean, simple shapes with soft painterly gradients, subtle paper grain, bold readable silhouettes, slightly exaggerated cartoon proportions (chunky buildings, rounded trees, oversized props). No outlines on the background, or very thin darker outlines only.
COLOR & LIGHT: rich, saturated but harmonious colors. Always a clear light direction: warm light on lit sides, cool blue or purple in shadows. Gentle atmospheric haze that makes distant things lighter and bluer. Dark scenes are deep blue, never pure black.
COMPOSITION: portrait 2:3. Leave the lower-middle of the frame as an open, flat floor or ground where characters can stand. Keep the top 10% simple (sky, ceiling). Strong depth: something in the foreground, the main subject in the middle, a background far away.
STRICT: no people, no characters, no animals unless asked, no faces, no hands. No text, letters or logos unless I specify exact words.
Reply only with the image.
```

## Step 2: style test (make these 3 first and send them to me)

Make these before anything else, so we can lock the look before you produce a whole set:

```
Location: a small American town main street at golden hour. Wide establishing shot from adult eye level, the street running straight away from the camera to the horizon (horizon about 45% from the top). Two-story shops on both sides with warm glowing windows, a bank with stone columns on the right, trees and lamp posts. Sunlight from the left, long shadows falling to the right. Open empty sidewalk and street in the lower-middle for characters to stand.
```
```
Same location, same light. Medium shot: closer to the bank entrance, stone steps and a big wooden door, ground in the lower third, door and columns filling the upper two thirds. Sunlight from the left.
```
```
Same location, now at night. Same wide angle as the first image. Deep blue sky with stars, windows glowing warm orange, lamp posts lit, soft pools of light on the sidewalk. Moonlight from the left.
```

---

## Templates (fill in the [brackets])

**WIDE (establishing)**
```
Location: [place, era, details]. Wide establishing shot from adult eye level, horizon about 45% from the top, strong depth into the distance. [Time of day] with light from the [left/right/behind]. Open flat ground in the lower-middle for characters to stand. No people.
```
**MEDIUM (where the action happens)**
```
Same location and light as before. Medium shot closer to [the main object/area]: [describe]. Floor in the lower third, the object filling the upper part of the frame. Open space in the lower-middle. No people.
```
**LOW ANGLE (power, drama)**
```
Same location and light. Low-angle shot looking up at [building/object], sky taking the upper half, the object towering. Ground strip along the bottom. No people.
```
**INTERIOR**
```
Interior of [room: bank lobby / office / courtroom / living room], [era and details]. Eye-level wide shot, back wall and windows visible, floor in the lower third with open space in the middle. Light from [windows on the left / lamp on the right]. No people.
```
**TABLETOP / TOP-DOWN (documents, maps, money on a desk)**
```
Top-down view of [desk/table surface] with [items], centered and evenly lit, empty space in the middle third for an object to be placed. No hands, no people.
```
**PROP (cut out and placed into scenes)**
```
A single [object: stack of cash / stock certificate / gold bar / house key / gravestone], in the same storybook style, slightly exaggerated cartoon proportions, soft lighting from the left, centered, on a solid pure green #00FF00 background, no shadow on the background, no text.
```
**PROP WITH EXACT TEXT** (only when words matter)
```
A single [paper document/sign] in the same style, with the exact text "[LOAN — $10,000,000]" in bold clean letters, nothing else written. Centered on a solid pure green #00FF00 background.
```
**FOREGROUND LAYER (for depth when the camera moves)**
```
Only the foreground element for this location: [bushes / fence / desk edge / doorframe], filling the bottom [or left edge] of the frame, on a solid pure green #00FF00 background. Same style and light.
```
**CHANGE THE MOOD** (same chat, same place)
```
Same image, but [at night / in a thunderstorm / in heavy snow / abandoned and dusty]. Keep the exact same layout and camera angle.
```

---

## What happens with your images
1. I cut out the green-screen props and layers.
2. I split each background into depth layers, so camera moves have parallax (near things slide
   faster than far things).
3. I place the 3D characters on the open floor and match the light direction and color.
4. Shots, cuts, faces, gestures and captions get timed to the voiceover, then rendered at 30 fps.

After the style test comes back, I'll send the **exact shot list** (every image you need, with its
filled-in prompt) once the script is approved.

---

## Batch file (for big sets, one per video: `videos/<slug>/art-prompts.md`)

Claude writes this file. Brian opens a **new ChatGPT chat**, pastes **everything from START to the
first BATCH line**, then sends each batch when ChatGPT finishes the last one. All images stay in one
chat, so the style stays consistent.

```
START
You are the background artist for a vertical animated explainer series. [style bible pasted here in full]

HOW TO WORK: I'll send prompts in numbered batches. Make every image in the batch one after another,
in order, portrait 2:3. Above each image write only its file name (e.g. "07_bank_lobby_wide_day.png").
Props go on solid pure green #00FF00. No people in any image. When a batch is done, say "BATCH DONE".

BATCH 1 (backgrounds 01–06)
01_street_wide_day.png: [prompt]
02_street_wide_night.png: Same as 01, now at night. [mood prompt]
...
BATCH 2 (backgrounds 07–12)
...
BATCH 5 (props P01–P06)
P01_prop_receipt.png: [prompt]
...
```

Rules for writing it:
- Batches of **4–6 images**; backgrounds first, then props.
- Use the numbered file names, so Brian saves them straight into `videos/<slug>/art/`.
- "Same as 0X, now…" for mood or angle variants of the same place, in the same batch.
- Every prompt stands alone: place, angle, light direction, open floor, "no people".
