# The explainer system: how to replicate the yawn video on ANY new chat

**Open a new chat and say one word: `explainer`** (optionally with a topic: `explainer why do we yawn`). Claude runs `/explainer` (`.claude/commands/explainer.md`), asks 3 short questions, then leads you step by step.
Everything the chat needs is on `main`: this page, the command, the skill, the templates and the tools.

## What you do vs what Claude does
| Step | Claude | You (on your phone) |
|---|---|---|
| 0 Start | reads the lessons, series and tracker; offers 3 topics | answer: topic, post time, character |
| 1-2 Research + script | sources, `script.txt`, `notes.md` (promise ledger, causal chain, retell) | say "approved" or send edits |
| 3 Beats | `beats.json`; the beat → painting table | say "approved" BEFORE painting |
| 4 Art | writes the ChatGPT prompts and pastes them in the chat | paint in ChatGPT; send the images back as ATTACHED FILES |
| 5 Voice | tightens (1.2-1.4x), aligns, drama, sound effects | record the voice from the clean text; send the MP3 |
| 6 Build | generates the scene, previews, measured audit, render | watch the video once |
| 7 Post | cover, `post.md`, tracker | post; later paste the numbers |

## The files in `videos/<slug>/`
`sources.md` · `script.txt` (cues `[#name]`) · `notes.md` (follow-through) · `beats.json` (THE description of the video) · `art/` (paintings, props) · `voice_raw.mp3` → `voice.mp3` · `data.js` (word timings) · `voice-drama.json` · `sfx-cues.js` · `scene.js` (GENERATED) · `final.mp4` (gitignored) · `cover.jpg` · `post.md` · `audit-measured.md`

## The tools
| Tool | What it does |
|---|---|
| `node tools/beats.js check <slug>` | validates beats.json against script.txt and art/ (cues, images, one painting per idea, camera moves) and lists what Brian still has to paint |
| `node tools/beats.js art <slug>` | writes the ChatGPT batch file from beats.json `images` (skips images already painted) |
| `node tools/beats.js shots <slug>` | writes the shot list table |
| `node tools/make-scene.js <slug>` | generates `scene.js` from beats.json with `engine/explainer-scene.js` (never hand-edit scene.js) |
| `node tools/tighten.js <slug> [target s]` | trims silences and picks the 1.2-1.4x tempo so the final lands at 1:05-1:15 |
| `node tools/audit.js <slug>` | MEASURES the video (voice start, search phrase time, re-hook %, length, change gaps, painting holds, static shots, duplicate voice, required files) |
| `align.js` · `voice_drama.js` · `sfx.js` · `render.js` · `cover.js` · `cutout.py` | the existing pipeline |

## Beats file: overlay types (`engine/explainer-scene.js` documents the fields)
`text` · `title` · `counter` (`start`, `value`, `format`) · `steps` · `flow` (arrows between painting pixels) · `prop` (a green-screen prop on the painting) · `bar` · `ripple` · `gauge` (keyframed heat gauge). Actors: a character `stand`s on a painted floor pixel or `lie`s on a bed (fixed solved placement), with events `yawn`, `face`, `gesture`, `lookUp`; plus the signature `helicopter`. Need a new overlay or action? Add a `case` in `engine/explainer-scene.js`, document it there and in this table.
A complete worked example: `docs/templates/beats.example.json` (the yawn video), and `videos/yawn-why/`.

## When something goes wrong (each happened once)
- A painting never arrived: images must be ATTACHED FILES; the audit and `beats.js check` list what is missing.
- A voice file was a copy of another video's: `audit.js` compares checksums.
- A line referred to something not yet explained: the follow-through gate (notes.md) before the script is shown.
- One painting held for 35 s: `beats.js check` warns above ~12 s.
- A character must lie on a bed: solve the placement once against the plate camera and hardcode it in `beats.json` `actors[].placement` (see the yawn beats).
