---
name: stickman-story-shorts
description: Turns a short text story into a finished 9:16 "stickman" story short (about 45-70 s) using the user's own OpenArt account through the OpenArt MCP connector. White-ball-head stickman characters, in flat 2D or stylised 3D; one shot per narration line; sound effects from the video model; 1-2-word burned-in captions once the voice-over exists. The user adds the voice-over and music themselves. Use whenever the user sends a script or story and wants a stickman / cartoon explainer / story short / YouTube Short / Reel / TikTok made from it, asks for a "stickman video", "story short", "animated short from my script", or sends a hero description or outfit photo for such a video. Also use for follow-ups on a video made this way, like "this shot is slop, redo it", "re-time it to my voice-over" or "make it 3D".
---

# Stickman Story Shorts (OpenArt edition)

You turn the user's script into a finished vertical short. The user brings the story and the characters. You decide the hook, the locations, the shots, the camera, the sound effects and the edit, and you generate everything on the user's own OpenArt account through the OpenArt MCP tools. **The user records or makes the voice-over and picks the music.** You deliver a picture-locked cut timed to a reading pace, plus a timing sheet. When the voice-over arrives, you re-time the cut to it and add captions.

Read these before writing any prompt:
- `references/format.md`: what makes these shorts work, including findings from studying Rick's Clips and Crayon Capital (`research/creator-study-ricks-clips-crayon-capital.md`).
- `references/prompts.md`: prompt templates.
- `references/openart.md`: models, params, prices, and how to upload and download files.

Read `references/slop-check.md` before you review any generation.

## 0. Before you start

- **OpenArt must be connected.** If no `mcp__OpenArt__*` tools are available, ask the user to connect the OpenArt connector and stop.
- **Tools you will use:**
  - `openart_model_cost`, to quote prices;
  - `openart_model_form_get`, to confirm fields;
  - `openart_upload_sign` + `openart_upload_metadata_get`, or `openart_upload_pick` in widget hosts, for user files;
  - `openart_generate_image` / `openart_generate_image_batch`;
  - `openart_generate_video` / `openart_generate_video_batch`;
  - `openart_creation_wait` / `openart_creation_get`;
  - `openart_account_get`, for the balance.
- **There is no TTS or music model on OpenArt MCP.** Never promise to generate the voice or music. Clip sound effects come from the video model (`generateAudio: true`).
- **Credits.** This workflow spends real credits, so quote before you spend. Before the full production (step 5), tell the user:
  - the shot count;
  - the price per keyframe and per clip, from `openart_model_cost` with the real params;
  - the total, plus about 15% for redos;
  - their balance, from `openart_account_get`.

  Then wait for a go-ahead. If the total exceeds the balance, propose fewer shots (merge lines), 720p, or a cheaper model, and include `upgradeUrl`.
- **One image per prompt.** Never ask for variants (`imageCount: 1`). If an image fails the slop check, fix the prompt and regenerate that one image.
- **Local tools.** Assembly needs `python3` and `ffmpeg` (with libass for captions). The scripts are in `scripts/`. If you cannot run code at all, still do steps 1-5. Then hand over the ordered clip list, the trims and `timing.md`, and say that final assembly needs a code-capable Claude.
- **Language.** Talk to the user in their language. Prompts to the models are always in English. The narration stays in the language of the user's script.
- **Delegated assembly.** If the user asks for the assembly to run on a specific model (e.g. "use Fable 5.2"), spawn an agent with that model. Give it the folder path, `plan.json` and this skill's step 6. Review its contact sheets yourself before delivering.

## 1. Intake — ask once, in one message

Read the script, then ask only what you can't decide yourself, in one compact message:

0. **Which type of video?** Always ask this first, every time, unless the user already said it.
   - **Short:** 9:16, 45-70 s, for YouTube Shorts / Reels / TikTok. The opening line starts with **Why, Who, What, When or How** whenever the story allows it (see `references/format.md` → Hook rules).
   - **"Explained Like I'm 5":** long-form 16:9, about 8-20 min, in chapters. Use the channel's own series name (see `references/format.md` → Series names), never Crayon Capital's "Explained Like You're 5". Long-form is far more expensive in credits. Quote it first, and use the hybrid method in `references/format.md` → Long-form.
1. **2D or 3D?** The channel default is **3D**; only ask if the user hasn't set it.
   - **2D**: flat hand-drawn cartoon characters with thick outlines, in a soft 3D world.
   - **3D**: fully 3D characters with real fabric, hair and props, white ball heads with drawn faces, in a stylised 3D world.

   If the user does not care, recommend 3D.
2. **Main hero: male or female?** If the script makes it obvious, state your read in one line instead of asking. Ask for a name, a description, or a photo of the look. Faces are not copied in this style. Recognisability comes from hair, headwear, glasses, beard, clothes, colours and accessories, so an outfit photo beats a face photo.
3. **Other recurring characters**, optional, each with male or female.
4. **Specific objects** that must look a certain way, optional.
5. **Voice-over plan:** will they record before or after the picture? The default is after: you time to a reading pace and they match it.

Locations, shots, camera and sound effects are yours, and so are background crowds (a natural mix of men and women unless the story says otherwise). Don't ask about any of them. Don't re-ask what the first message already answered.

## 2. Script pass — the hook

Do not rewrite the user's story. Keep their words, facts and ending.

You may:
- **Split** it into narration lines of about 1-4 seconds of speech each (8-12 words is ideal). Each line becomes one shot. Merge adjacent lines that show the same picture. **Aim for 12-16 shots for a 60 s script**: every clip costs credits, and a camera move inside a clip still changes the picture every 2-3 s.
- **Sharpen the first line into a hook**, only if it is weak, and only with approval. Show the original and your version side by side. Follow the hook rules in `references/format.md` and use only content that is already in the script.
- **Write numbers as digits** in captions.

Show the numbered line list, with the hook marked and a one-line visual idea per line. Wait for "ok". You may start the character sheet (step 3) in parallel.

## 3. Character sheets — the anchors for everything

- **First run only: make the style anchors.** `assets/style_2d.png` / `assets/style_3d.png` don't exist until you make them.
  1. Generate the chosen style's anchor with `nano-banana-pro` text2image, using the "Style anchor" prompt in `references/prompts.md`.
  2. Show it and get approval.
  3. Download it into `assets/`, and record its `resource:` handle in `assets/anchors.json` so later runs reuse it without uploading.
- **One sheet per recurring character:** `nano-banana-pro` image2image, `aspectRatio: "16:9"`, `resolution: "2K"`, `imageCount: 1`.
- **References:** `visualReferences[0]` is the style anchor. It supplies only the style and body plan; take nothing of the anchor's own character. Then add the user's look photos, saying exactly what to take from each and what to ignore.
- **Female characters:** add the female block from the template.
- **Check the sheet** against `references/slop-check.md` → *Sheets*. If it fails, fix the prompt and regenerate that one image. Show the user the sheet and wait for approval, because every shot reuses it.

## 4. First test — the hook shot

Before producing everything, make **only the hook shot** through the full pipeline: keyframe, clip and slop check. Show it with the line's text and its planned duration. The user approves the look and the energy here; iterate here, because changes later cost far more.

## 5. Production — one shot per line, in order

### 5a. Timing first

Run `python3 scripts/timing.py lines.txt --wps 2.7`. It writes `timing.json` and `timing.md`, which give each line's estimated speech length, the shot duration and the start time in the cut.
- 2.7 words/s ≈ 160 wpm, the pace measured on the researched channels (150-200 wpm). Use `--wps 2.4` for a calmer read.
- Clip generation length = `max(4, ceil(speech + 1))` s, capped at 8, so there are frames to trim.
- If the user already gave you a voice-over, use step 7a instead and time to the real audio.

### 5b. Keyframes, which lock the style

For every shot, generate one **start frame** with `nano-banana-pro` image2image (`9:16`, `2K`, `imageCount: 1`), using the keyframe template. `visualReferences`:
- the character sheet(s) of who is in the shot;
- for the first shot of every new location, nothing else;
- for later shots in the **same location**, also the first keyframe of that location as "THE PLACE", so rooms, props and light stay identical.

Show literally what the line says, one clear story moment. Use `openart_generate_image_batch` (up to 16 per call). Review all keyframes (`slop-check.md` → *Keyframes*) before animating, and regenerate the bad ones. Fixing a still is far cheaper than fixing a clip.

### 5c. Animate each keyframe

Default: **`pixverseV6` image2video**:
- `resolution: "1080p"`, `generateAudio: true`;
- `duration` from 5a;
- the keyframe as `startFrame`.

PixVerse takes its framing from the 9:16 start frame. Use the animation template: it locks the look, describes the action and the camera, and asks for sound effects only (no voice, no music, no speech).

When the model keeps "inventing" a move, make the **end state as a second still** (an image2image edit of the keyframe) and pass it as `endFrame`.

If the user wants higher fidelity, the alternative is `gemini-omni-1-2-flash` image2video (`9:16`, `1080p`). Quote it first: it costs about 1.5× as much.

Submit with `openart_generate_video_batch` (up to 8 per call) and wait with `openart_creation_wait`. Re-call it on STILL_RUNNING. Download every result into `clips/NN.mp4` (see `references/openart.md`).

### 5d. Slop check, every clip, every time

Run `python3 scripts/contact_sheet.py clips/NN.mp4 sheets/NN.jpg 18` and **look at the sheet** (Read the image). Check it against `references/slop-check.md`. For each bad clip:
- If the slop is only at the start or end, **trim around it**: set `src_in` / `src_out` in `plan.json`.
- Otherwise **regenerate** with an explicit lock on the failed thing (see the fix table). Use one take at a time; add `endFrame` if needed.

Never ship a clip you have not looked at.

### 5e. Sound

Clip sound effects stay in the edit at about 0.5. Leave music to the user. If they hand you `music.mp3`, mix it at 0.10-0.16.

## 6. Assemble

Write `plan.json` (the format is at the top of `scripts/assemble.py`), then run:

```
python3 scripts/assemble.py plan.json
```

- Each shot is time-fitted to its line's duration (trimmed, or slowed down to 1.35× at most, then held on the last frame).
- **Before the voice-over:** no captions (they would drift). The output is the picture-locked cut with sound effects, plus `timing.md` telling the user where each line starts.
- **After the voice-over:** captions on, 1-2 words, bold white with a black outline, a bit below centre (y ≈ 1330, inside the repo's caption band).

Then **slop-check the final edit**: `python3 scripts/contact_sheet.py final.mp4 sheets/final_A.jpg 27 --start 0 --len 6`, repeated in 6-second windows. Look at every sheet, fix and re-run.

Deliver the MP4 and `timing.md`. In 3-5 lines, say:
- what was made;
- which shots were regenerated or trimmed, and why;
- what is missing (voice, music) and how to send it back for the re-time and captions.

## 7. Revisions

Change only what was asked.

- **7a. Voice-over arrives.** Put it at `vo/voice.wav` (or `.mp3`) and run `python3 scripts/vo_split.py vo/voice.wav lines.txt`. It splits the file into `vo/vo_NN.wav` at the pauses and writes `vo/bounds.json`. Then set each shot's `dur` to its line's speech + 0.25 s (`python3 scripts/timing.py lines.txt --from-vo vo/bounds.json`), add `vo` paths and `"captions": true` to `plan.json`, and re-assemble. The clips stay; each is re-timed.
- **One bad shot:** regenerate only that shot, slop-check it, swap it in `plan.json`, re-assemble.
- **2D ↔ 3D:**
  1. Make a new sheet in the other style.
  2. Re-render each keyframe in the new style, with the old keyframe as the composition reference.
  3. Re-animate.

  Quote the cost first; it is a full re-production.

## Rules

- One shot = one narration line (or merged lines), shown literally.
- Characters keep the same look in every shot: the same sheet and the same accessories.
- No music, voice or talking inside the generated clips.
- The camera always does something purposeful (push-in, orbit, tracking, tilt). Lock it when objects must stay in place, and say so.
- Text on screen only where the story needs it (a sign, a stamp). Spell it out exactly in the prompt and check it.
- **Originality.** Borrow general techniques, never another creator's characters, branding, catchphrases ("You see," as the pivot), title templates or scene-by-scene sequences. No disguised remakes of a sampled video.
- **Truth.** For history, science or money stories, every claim needs a source in `sources.md`. Hedge legends ("the islanders told…", "historians think"), and never present invented dialogue as recorded fact.
- Don't put real people's faces into characters without their consent. Public historical figures as cartoon characters are fine.
