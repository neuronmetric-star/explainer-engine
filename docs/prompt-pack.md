# Prompt pack — 2D worlds for ChatGPT

> **Art standard v2 (Brian, Nov 22 2026):** every prompt is rich and descriptive (PLAYBOOK §4). Short prompts make
> plain pictures. Use the **v2 style bible** and the **v2 templates** below; the old one-line templates are retired.

**How it works:** you make the **worlds and props** in ChatGPT. I add the **3D characters**, the
camera moves, the faces, the captions and the voice in our engine. So the images must have
**no people in them**. Your characters get dropped in afterwards, lit to match.

**Per short (~1:05), expect about** 6–8 backgrounds plus 6–10 props (≈ 12–16 images). A long video needs
roughly 3–4× that. A new picture every 2–3 seconds comes from cutting between those and moving the camera
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
| **No numbers or prices, ever.** Up to 3 short exact words per background for realism ("ELECTRONICS"), always quoted; everything else blank or pictogram icons | The engine draws numbers; short quoted words now render well and make places feel real |
| **Props on solid pure green #00FF00** | I cut the green out automatically |
| **Match the prop's angle to the background** (a side-view car needs a road running LEFT-TO-RIGHT across the frame, "side-scrolling" view) | A side-view car on a road that runs away from the camera looks like it's driving into the houses (electric-car video) |
| **Rich, not plain (v2)**: three depth layers + atmosphere, 10–15 named objects with color + material, 2–4 story details, practical lights, a named palette, texture on every surface | Brian, Nov 22 2026: the old art felt basic and plain. ChatGPT paints what you describe, nothing more |
| **Keep the open floor zone clear and the caption band calm** (60–72% of the height, center) | Characters stand there; captions sit there. Detail goes to the edges and the back |
| **Vary the angles** inside one video (eye-level wide, low hero, high, over-the-counter, close detail) | Five eye-level wides in a row look like a slideshow |
| **Lock recurring objects** (a car, a phone, a bulb that appears in several images) | ChatGPT redesigns them every time. Describe the object in exact detail in START (color, shape, lights, wheels…), make it in the FIRST image, then every later prompt says "the exact car from 01_….png, do not redesign it". If it still drifts, save that first image and **attach it** to the next prompt as the reference |

**File names:** `<video>_<place>_<angle>_<time>.png`, for example `bbd_bank_wide_day.png`.
Send them here in the chat, and I'll save them to `videos/<video>/art/`.

---

## Step 1: lock the style (one ChatGPT chat per video): style bible v2

Paste this first (it's also the START block of every batch file), then ask for each image in **the same chat**:

```
You are the lead background painter for a premium vertical animated series. Every image is a finished, cinematic background painting for a high-end 2D animated film, made for a 9:16 phone screen. Follow this style bible exactly:

STYLE: rich 2D storybook painting with feature-film polish. Appealing, slightly exaggerated cartoon shapes (chunky furniture, oversized props, soft rounded silhouettes), but painted with real depth and detail: layered painterly brushwork, soft gradients, subtle paper grain, crisp edges on the hero object, softer edges in the distance. Every place looks lived-in and specific, never empty or generic: dense, organized set dressing, small storytelling details, believable clutter at the edges.
DEPTH: always three layers plus air: a foreground element cropped by the frame edge, the stage and hero in the middle, a deep background, then atmosphere (haze, dust in light shafts, glow). Distant things get lighter, bluer and softer.
LIGHT: cinematic and motivated. A clear key light from the direction I give, plus practical light sources inside the scene (lamps, neon, screens, windows) with colored glow, warm-cool contrast, colored shadows (blue or purple, never gray or black), rim light on edges, reflections on glossy floors. Night is deep blue, never pure black.
COLOR: a harmonious palette with one strong accent color, as I specify per image.
TEXTURE: every surface has a material: wood grain, scuffed tile, brushed metal, fabric weave, cardboard, glass reflections.
COMPOSITION: portrait 2:3. Leave the open floor zone I describe clear and flat for characters to stand (texture and reflections are fine, objects are not). Keep the band at 60-72% of the height, in the center, calm and low-contrast (captions go there). Keep the top 7% and bottom 20% simple.
STRICT: no people, no characters, no animals, no faces, no hands, no feet, no silhouettes of people. No numbers or prices anywhere. No text, letters or logos unless I give the exact words in quotes; all other signs, screens, labels and stickers stay blank or show simple pictogram icons.

HOW TO WORK: I'll send prompts in numbered batches. Make every image in the batch one after another, in order, portrait 2:3. Above each image write only its file name. Props go on a solid pure green #00FF00 background with no shadow on the background. When a batch is done, say "BATCH DONE".
```

## Step 2: style test = the first batch
No separate test anymore: Brian makes **batch 1** of the video's batch file first and sends it. Claude checks it
against the quality gate (PLAYBOOK §4) and sends one-line fix-ups (`Same image, richer: add …, keep the layout and
the open floor`) before the rest are made.

---

## Templates v2 (fill in every [bracket]; aim for 120–180 words per background)

**BACKGROUND v2 (every location, every angle)**
```
[file_name].png: SHOT: [eye-level wide / low hero angle / high angle / over-the-counter / close detail], [lens feel: wide 24mm / normal 35mm / tight 50mm], camera at [knee / chest / eye] height, horizon about [45]% from the top.
PLACE + MOOD: [where, era, time], [the story beat in a few words: "the calm before the Black Friday rush"].
HERO: [the one thing the eye lands on], placed [upper-left third / center back / right third].
FOREGROUND: [an element cropped by the frame edge: shelf corner, hanging banner, plant, counter edge] on the [left/right] edge.
MIDGROUND: [the stage area and the hero, what surrounds them].
BACKGROUND: [deep space: windows, aisles, skyline, doors], softer and hazier.
DRESSING: [10–15 specific objects with color + material, e.g. "chrome wire shelves stacked with boxed blenders in red and teal", "a tangled orange extension cord", "a rolling ladder"].
STORY DETAILS: [2–4 tiny clues or jokes, e.g. "a half-eaten donut on the register", "a lost sneaker in the aisle"].
LIGHT: key light from the [left] — [color temperature + time]; practicals: [neon / TV glow / lamps / string lights + their colors]; [light shafts, dust, haze, steam]; colored shadows ([blue/purple]); reflections on the [glossy floor].
PALETTE: [3–5 colors] with a [accent color] accent.
TEXTURE: [materials: scuffed tile, brushed metal, cardboard, fabric, wood grain].
STAGING: keep a clear, flat [floor/sidewalk/aisle] zone across the lower-middle, about [half] the frame wide, for [two] characters (texture and reflections OK, no objects). Keep the band at 60–72% height calm and low-contrast.
TEXT: [none] / [only the words "ELECTRONICS" on the back wall sign]. No numbers or prices.
STRICT: no people, no faces, no hands, no animals.
```
**MOOD / TIME VARIANT (same chat, same place)**
```
[file_name].png: Same as [0X_file].png: exactly the same layout, camera angle, objects and open floor zone, but [now at night / abandoned and dusty / after the crowd: knocked-over displays, scattered receipts]. Change the light to [ ] and the palette to [ ]. Keep [the recurring object] identical.
```
**DIAGRAM / CUTAWAY PLATE**
```
[file_name].png: SHOT: straight-on, centered. A [giant blank price tag / cutaway of an engine / map] filling the middle half of the frame, [material and detail], on a [backdrop with texture, soft vignette, light rays, floating dust]. Leave [the area where the engine draws numbers] perfectly blank and flat-colored. Light from the left. No text, no numbers, no people.
```
**PROP v2 (cut out and placed into scenes; 50–80 words)**
```
[P0X_file].png: [the object], seen [straight from the front / at a 3/4 angle to match the scene], [size feel: chunky, oversized]. MATERIAL: [glossy cardboard / brushed chrome / crinkled paper] with [wear: a dented corner, a coffee ring, tape bits, a peeling edge]. One personality detail: [ ]. Light from the left with a bright highlight and a soft shadow on the object itself, a thin darker outline around the whole shape. Centered on a solid pure green #00FF00 background, nothing else, no shadow on the background, no text, no numbers.
```
**PROP WITH EXACT TEXT** (only when words matter; never numbers, the engine adds those)
```
[P0X_file].png: A single [paper document/sign] in the same style, with the exact text "[WORDS]" in bold clean letters, nothing else written. [Material and wear.] Centered on a solid pure green #00FF00 background.
```
**FOREGROUND LAYER (for depth when the camera moves)**
```
[file_name].png: Only the foreground element for [location]: [hanging banners / bushes / counter edge / doorframe], richly detailed, filling the [bottom / left edge] of the frame, on a solid pure green #00FF00 background. Same style and light.
```
**FIX-UP (when an image comes back plain)**
```
Same image, richer: add [x, y, z], warmer practical lights, more texture on the floor and walls, deeper colored shadows. Keep the layout, the camera angle and the open floor zone exactly the same.
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
- START = the **v2 style bible** + a **RECURRING OBJECTS** block (exact descriptions) + HOW TO WORK.
- Batches of **3 backgrounds** (long v2 prompts) or **4–8 props**; backgrounds first, then props. Brian sends batch 1 first for review.
- Use the numbered file names, so Brian saves them straight into `videos/<slug>/art/`.
- "Same as 0X, now…" for mood or angle variants of the same place, in the same batch.
- Every prompt stands alone and follows the **v2 template**: shot, place + mood, hero, three layers, 10–15 dressing
  objects, story details, light with practicals, palette (from the shot list's color script), texture, staging, text, strict.
