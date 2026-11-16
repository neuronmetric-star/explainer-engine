---
name: stickman-explainer
description: End-to-end studio for fact-based 3D stickman explainer videos in 16:9, plus vertical 9:16 Shorts cut from each long episode. Long-form "So Simple a 5-Year-Old Gets It" episodes (6+ min, chaptered, in the storytelling style learned from Crayon Capital) and Shorts (45-70 s, in the hook-and-payoff style learned from Rick's Clips). Claude researches the facts, writes the script, and hands over a copy-paste image prompt pack (character sheets, location plates, prop sheets, every scene keyframe) for the user to generate in ChatGPT, plus a voice script. When the user returns the images and voice, Claude animates the chosen scenes with OpenArt PixVerse, assembles the video with captions, and writes the publishing pack (thumbnail options, titles, caption, at most 5 hashtags). Use when the user picks or sends a story or topic for a video, asks for a long video, a Short, a "so simple a 5-year-old gets it" episode, a prompt pack, a voice script, or sends images or a voice-over for such a video. Also use for follow-ups such as "redo scene 12" or "re-time to my new voice".
---

# Stickman Explainer Studio

One workflow and one look, every time: **3D stickman characters, true stories, 16:9.**

| Who | Does what |
|---|---|
| **Claude** | Research, hook, script, image prompt pack, voice script, animation (OpenArt PixVerse), assembly, publishing pack |
| **User** | Generates every image in ChatGPT from the pack, records the voice, adds or approves music, publishes |

Read before starting:
- `references/format-long.md` (long-form structure) or `references/format-short.md` (Shorts structure);
- `references/prompt-pack.md`, which covers the bible, the pack, and the image rules;
- `references/voice-and-publish.md`, which covers the voice script and publishing pack templates;
- `references/openart.md` and `references/slop-check.md` before animating.

The evidence behind the formats is in `research/creator-study-ricks-clips-crayon-capital.md` (repo root).

## Phase 0 — Intake (one message, ask once)

1. **Type:** Long-form ("So Simple a 5-Year-Old Gets It", 6-10 min) or Short (45-70 s)? Always ask unless the user already said.
2. **Topic or story.** If the user has only a theme, propose 3 angles, each one line with its hook, and let them pick.
3. **Main character(s):** name, gender, and look. Defaults: an original faceless 3D stickman; real historical people are shown as stickman versions, recognisable only by clothes and props.

Settings that never change (from `assets/channel.json`):
- 3D style;
- 16:9 at 1920×1080 output;
- PixVerse V6 at 720p for animation;
- ultra-HD images (3840×2160);
- captions on;
- at most 5 hashtags.

**On Shorts at 16:9:** YouTube treats only square or vertical videos of up to 3 minutes as Shorts. Tell the user once that a 16:9 "Short" uploads as a normal video. Offer a 9:16 crop of the same edit as an option, but don't force it.

## Phase 1 — Research (facts only)

- Use web search. Every number, date, name and quote needs a source in `videos/<slug>/sources.md`: title, URL, and the fact it supports.
- Prefer primary sources: government statistics, court records, filings, archives, original papers. Mark anything secondary or disputed with ⚠ and phrase it with care ("records show…", "historians think…").
- **No fluff.** If a fact can't be sourced, cut it or flag it; never invent one. Dialogue in story scenes is allowed only as clearly dramatised illustration of documented events, never as a fake quote. Real quotes must be sourced.
- Never give personal financial, legal or medical advice. Explain how things work.

## Phase 2 — Story and script (wait for approval)

Write the script with the structure in the matching format file. Show the user:
- the **hook** (and 2 alternatives);
- the **chapter outline** (long-form) or **beat list** (Short);
- the **full script**, one line per scene, with a one-line visual for each;
- the target length and scene count;
- which scenes will be **animated**, and the credit quote for them.

Wait for "approved" (or edits) before Phase 3.

## Phase 3 — Bible, prompt pack and voice script

1. Write `videos/<slug>/bible.json` from `templates/bible.example.json`. It holds:
   - one **style block**;
   - every **character**, **location** (with era or time variants) and **prop**, each with ONE verbatim descriptor;
   - every **scene**: display line, spoken line, characters, location, props, the moment, camera, and `animate` true/false.
2. Run `python3 scripts/build_pack.py videos/<slug>/bible.json`. It writes:
   - `prompt_pack.md`: the copy-paste pack for the ChatGPT agent, in order: rules, character sheets, location plates, prop sheets, scene keyframes, thumbnails. Every prompt repeats the style block and descriptors **word for word**, which is the core of consistency;
   - `voice_script.md`: TTS-ready text (numbers spelled out, a blank line between scenes) plus voice direction;
   - `lines.txt` and `lines_spoken.txt`, for timing and voice alignment;
   - `animate.txt`: the scenes to animate and their motion prompts.
3. Send the user `prompt_pack.md` and `voice_script.md`, and say exactly where the images go: `videos/<slug>/images/`, with the file names given in the pack.

## Phase 4 — Image intake and check

When the user returns images (in chat, or dropped into the folder):

1. Save them to `videos/<slug>/images/` with the names from the pack.
2. Run `python3 scripts/check_images.py videos/<slug>/bible.json`. It reports:
   - missing files;
   - images that aren't 16:9;
   - images under 3840×2160 (ultra-HD is **mandatory**: list them and ask for regenerations, don't silently accept them).

   It also writes `sheets/images_grid.jpg`.
3. **Look** at the grid and at each sheet (`references/slop-check.md` → Images):
   - the same character design in every scene;
   - the same location layout;
   - correct prop counts;
   - no stray text;
   - no realistic faces.

   Send the user a numbered list of the scenes to regenerate, with the reason and a corrected prompt for each.

## Phase 5 — Animation (OpenArt PixVerse V6, 720p)

1. Quote first. `openart_model_cost` for each clip length, then the total against `openart_account_get`, then wait for a go-ahead. At 720p with sound effects off it costs about 14 credits/s; with sound effects on, 18 credits/s (re-check every time).
2. Upload each image marked `animate` (procedure in `references/openart.md`): `python3 scripts/prep_upload.py` makes 1920×1080 JPEG copies, then `openart_upload_sign`, `curl PUT`, `openart_upload_metadata_get`.
3. Submit `openart_generate_video_batch` (up to 8 per call). Use `pixverseV6`, `image2video`, `resolution` 720p, `duration` = the line's speech + 1 s (from `timing.json`, at least 3), and `generateAudio` per `channel.json` (default false for long-form, true for Shorts). Use the motion prompt from `animate.txt`, which follows the LOCK template.
4. Wait with `openart_creation_get`. Download each result to `clips/NN.mp4`, run `contact_sheet.py`, and **look** at it. Then either trim (`src_in`/`src_out`) or regenerate once with a tighter LOCK. Never ship an unchecked clip.

Scenes not animated are your **4K stills**, which `assemble.py` moves with a slow push-in, pull-out or pan. The moves alternate so stills never feel static.

## Phase 6 — Voice and assembly

1. The user records `voice_script.md` (one file, or one file per chapter) and sends it. Save it to `vo/voice.mp3` (or `vo/ch01.mp3`…).
2. Run `python3 scripts/vo_split.py --lines lines_spoken.txt vo/voice.mp3` (or several chapter files in order). It aligns the lines to the recording's pauses, in proportion to the spoken text. **Check** the printed table: each segment's length must roughly match its line. Fix any outliers by hand, listing the pauses with `silencedetect`.
3. `python3 scripts/timing.py lines.txt --from-vo vo/bounds.json`, then write `plan.json`: every scene's clip or still, with `vo`, trims and moves; `captions: true`; 1920×1080; music if provided at 0.10-0.14. Run `python3 scripts/assemble.py plan.json`.
4. Check the whole edit: `contact_sheet.py final.mp4 … --start S --len 10` across the full length, and **look** at every sheet. Check:
   - the cuts land on the lines;
   - captions are readable and in sync;
   - no freeze longer than 0.7 s;
   - no black frames.

   If the user asks for a specific model to do the assembly (e.g. Fable 5.2), delegate this phase to an agent with that model, then review its contact sheets yourself.

## Phase 7 — Publishing pack

Write `videos/<slug>/publish.md` from `references/voice-and-publish.md`:
- **3 thumbnail options:** for each, the concept, a copy-paste 16:9 ultra-HD image prompt using the same style and character descriptors, and overlay text of at most 4 words;
- **3 title options;**
- **the post caption**, 2-4 lines with a sources line;
- **at most 5 hashtags.**

Deliver: `final.mp4`, `publish.md` (and the vertical Shorts from Phase 8 for long-form), and a 3-5 line summary covering what was trimmed or regenerated, the credits spent, and what the user should check by ear.

## Phase 8 — Vertical cut-downs (every long-form episode)

From each finished long-form episode, make **4-6 vertical Shorts of 30-60 s** (1080×1920). They are real YouTube Shorts (vertical, under 3 min) and point viewers to the full episode.

1. **Pick self-contained ranges of scenes** from `plan.json`: a chapter opener through its turn, the turning point, the biggest reveal, the cold open. Each range must:
   - **start on a hook line**: a question, a striking number, or an odd action;
   - **end on a payoff line**.

   Never start mid-thought ("And then…", "But…").
2. **Write a headline for each** (at most 7 words, shown above the picture the whole time). It frames the clip's question, e.g. "WHY $10 BUYS LESS EVERY DECADE".
3. **Run** `python3 scripts/cutdown.py videos/<slug>/plan.json --scenes 12-21 --headline "…" [--end-card "FULL STORY ON THE CHANNEL"]`. It reuses the clips, 4K stills, voice lines and captions, and renders the **framed layout**: the full 16:9 picture centred on a blurred copy of itself, the headline above, captions below and an end card. Output: `shorts/short_NNN-NNN.mp4`.
4. **Check** each Short with `contact_sheet.py` and look at it. Then add to `publish.md`, per Short:
   - the headline/title;
   - a 1-2 line caption that points to the full episode;
   - at most 5 hashtags, including #shorts.

The framed layout keeps 720p animated clips sharp. Never crop a 720p clip to full-screen vertical (it blurs). A full-screen vertical crop is only acceptable for a range made entirely of 4K stills, and only if the user asks.

## Revisions

Change only what was asked.
- **Redo scene N:** give a corrected prompt, re-check, re-animate if needed, re-assemble.
- **New voice:** re-split, re-time, re-assemble. Clips stay.
- **Wrong fact:** fix the script line, the voice line and the caption, and re-assemble.

## Rules

- **Consistency is mandatory:**
  - one style block;
  - one descriptor per character, location and prop, pasted verbatim into every prompt;
  - the same sheets attached as references for every scene;
  - every location has an empty "plate" image that later scenes reference.
- **Counts are shown, not hoped for.** When a scene must show exactly N objects, the prompt says so and places them separately, and the image check confirms it.
- **One scene = one narration line = one clear visual idea.** Something changes every 3-5 s: a cut, a camera move or an animation.
- **No text in images** unless the story needs it (a sign, a date stamp). When it does, spell it out in quotes and check it.
- **Originality:** use general techniques only. Never copy another creator's scripts, catchphrases ("You see,"), title templates ("Explained Like You're 5"), characters, art style or scene sequences.
- **Credits:** quote before every paid batch. The user's own images are free to us; only animation costs credits.
- **Commits:** commit the bible, pack, scripts, plan, sources and contact sheets. Full-res PNGs are git-ignored. Commit the final mp4 only if it is under 50 MB.
