---
description: Make a "Why do we X?" explainer end to end with the yawn-video system (topic, research, script, beats, art, voice, build, measured audit, post kit)
argument-hint: <topic, e.g. "why do we yawn">
---
Make an explainer about: **$ARGUMENTS** (if empty, offer 3 topics, see step 0)

You LEAD. Brian works from his phone: keep messages short, paste everything he must copy into code blocks, say exactly what he does next, and ask before spending credits.
The method is `docs/explainer-system.md` (read it first) and `docs/templates/explainer-recipe.md` (the slot-by-slot recipe). Load each lane skill with the Skill tool AT ITS STEP
(`.claude/skills/`: scout, hook, script, visual, character-emotion, growth, explainer) and follow it. Never grade your own work by eye: `node tools/audit.js` and `node tools/beats.js check` measure.
Run `git fetch origin` and work on the branch the harness gave you; finished work is merged to `main` only when Brian says so ("commit", "merge to main").

**Step 0. Start (ONE message).** Read `docs/lessons.md`, `docs/series.md`, the tracker (https://claude.ai/artifact/SDxLVHHeJEHJ4cyPpiwYgM via the Claude Docs connector) and today's `docs/trends/<date>.md` if it exists.
Ask: (1) which topic (offer 3 "Why do we X?" picks from the series list / concept bank / trend sheet, each with its one-line answer), (2) when to post, (3) the character (default Doug, Gary as the second friend).
Pick a slug and `mkdir videos/<slug>`. Mark the tracker row "Script".

**Step 1. Research** (≥ 3 solid sources, web search) → `videos/<slug>/sources.md` from `docs/templates/sources.example.md`: label fiction, hedge unsettled science, never invent a number ("not reported").

**Step 2. Script** → `videos/<slug>/script.txt` (from `docs/templates/script.example.txt`, the recipe's slots) and `videos/<slug>/notes.md` (from `docs/templates/notes.example.md`: promise ledger, causal chain, 3-sentence retell).
Skills: hook, script (including the follow-through gate), growth. Longer is fine (≈ 175-255 words; the voice is sped 1.2-1.4x). Show Brian the narration in ONE copyable block + the ledger/retell in 3 lines, and **wait for "approved"**.

**Step 3. Beats** → copy `docs/templates/beats.example.json` to `videos/<slug>/beats.json` and edit it (plates, props, shots, overlays, actors, `images` briefs). Skills: visual, character-emotion.
`node tools/beats.js check <slug>` must PASS. Show Brian the beat → painting table (`node tools/beats.js shots <slug>`) and **wait for "approved" BEFORE any painting**: one painting per idea, none held > ~12 s, the camera moves in every shot, the cast only in the opening and the signature ending.

**Step 4. Art** → `node tools/beats.js art <slug>` writes `art-prompts.md` (only the images not painted yet). PASTE the START block and every batch into the chat for Brian, in code blocks, and tell him: new ChatGPT chat → START → each batch → send the images back as ATTACHED FILES (never pasted into the chat).
On arrival: save each to `videos/<slug>/art/` under its file name, VIEW every image against the quality gate (no text/people/faces on backgrounds, calm caption band, clear staging area), cut props with `python3 tools/cutout.py`, and tell Brian which are missing. An image that did not arrive as a file does not exist.

**Step 5. Voice** → paste the CLEAN narration (no tags, `…` pauses) for Brian to record; he sends `voice_raw.mp3` (never reuse an old file: `tools/audit.js` fails on a duplicate checksum).
`node tools/tighten.js <slug> 68` (picks the 1.2-1.4x tempo) → `node tools/align.js <slug>` → write `voice-drama.json` + `sfx-cues.js` → `node tools/voice_drama.js <slug>` → `node tools/align.js <slug>` → `node tools/sfx.js <slug>`.

**Step 6. Build** → `node tools/make-scene.js <slug>` (generates scene.js from beats.json; never hand-edit scene.js) → `node tools/render.js <slug> --preview t1,t2,…` → READ the stills, fix beats.json, repeat. Then `node tools/audit.js <slug>` (fix every FAIL; explain every WARN) and
`node tools/render.js <slug>` (≈ 9-12 min; run it in the background and wait).

**Step 7. Post kit** → `node tools/cover.js <slug> <sec> "LINE 1|LINE 2|LINE 3"` (a frame with the cast, headline in the top quarter) and `post.md` (caption line 1 = the search phrase, 3-5 niche hashtags, pinned one-word comment, YouTube Shorts title). Send Brian: `final.mp4`, `cover.jpg`, the caption, and the audit (every ❌/⚠️ first).
Update the tracker ("Ready to post", next step) and `docs/series.md`; add Brian's notes to `docs/lessons.md` as rules. Do NOT commit or merge until Brian says.

Failure checklist (all happened once): an image that never arrived as a file · a voice file that was a copy of another video's · "the air thing" referred to before it was explained · the lying-on-a-bed placement (use a fixed solved placement, see the yawn beats) · a painting held for 35 s.
