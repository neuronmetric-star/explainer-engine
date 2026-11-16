# Bible and prompt pack

The user generates every image in ChatGPT (agent mode) from a pack Claude writes. Consistency comes from three things:
1. **One bible** (`bible.json`) where each character, location and prop is described exactly once.
2. **A generator** (`scripts/build_pack.py`) that pastes those descriptions **word for word** into every prompt. Never hand-edit prompts in the pack; edit the bible and rebuild.
3. **Reference images**: every scene prompt names the sheet and plate files to attach, so the image model copies identity and layout instead of re-imagining them.

## Image rules (mandatory, printed at the top of every pack)

- **16:9 landscape**, final file **3840×2160 PNG** (ultra-HD). If the generator outputs smaller, upscale to exactly 3840×2160 with a high-quality AI upscaler before saving. Never stretch or crop to fake 16:9.
- **Exact file names** from the pack (`char_RAY.png`, `loc_STORE.png`, `scene_014.png`…), all in one folder.
- **Order matters**: character sheets, then location plates, then the prop sheet, then scenes, then thumbnails. Later prompts attach earlier files.
- **No text**, logos, watermarks, borders, captions or UI in any image, unless the prompt quotes exact text.
- **Faces are stickman faces** (drawn black lines on a white ball), never realistic. Real historical people appear only as stickmen recognisable by clothes and props.

## Writing the bible (`templates/bible.example.json`)

**`style`**: keep the channel default (in `build_pack.py`) unless the user asks for another look.

**Characters**: one `descriptor` per character, 40-80 words, covering:
- gender and build;
- the ball head (always "smooth glossy white ball head, no ears, no nose, face drawn in flat black lines");
- hair or headwear;
- every garment with its colour;
- accessories (glasses, watch, bag);
- shoes.

Make the colours specific ("mustard-yellow", "dark chocolate-brown"), not "nice jacket". For women, add "slim shoulders, no beard or stubble" and the hairstyle. Era changes of outfit are separate characters (`RAY_1950`, `RAY_2020`) with their own sheets.

**Locations**:
- one `descriptor` per place, written as a fixed set: layout left to right, materials, light, the camera position for the master angle;
- `variants` for eras or times of day: list **only what changes**; everything else stays.

**Props**: anything that appears in more than one scene or must look exact (a product, a bill, a car, a document). 20-40 words each, plus `plural` ("full grocery bags") and `singular` ("full grocery bag"), which are used in count rules.

**Scenes**: one per narration line.
- `line` is the on-screen and caption text, with digits.
- `spoken` is the TTS text, with numbers written as words.
- `chars`, `location`, `props` are IDs. `moment` is one clear action, described literally, mid-motion. `camera` is the shot size and angle.
- `count` (optional): e.g. `{"BAG": 6}`. The generator adds a strict count rule.
- `text` (optional): the exact on-image text, only when the story needs it.
- `animate`: true or false. When true, also `motion` (the action from start to end, in one sentence) and `camera_move` (push-in, orbit left, pan right, locked-off…).

**Thumbnails**: 3 entries, each with a `moment` and an `overlay` (at most 4 words). The overlay is added by the user in a design tool or by ChatGPT as large bold text; it is quoted exactly.

## Review before sending the pack

- Every character in every scene has a sheet.
- Every location has a plate, and every variant attaches its base plate.
- No scene asks for two moments at once.
- Count scenes place objects apart ("standing apart in one row, all fully visible").
- Scene count matches the script, and the numbering matches the lines.
