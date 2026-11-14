---
description: Make a full @coonknows video — research, script, ChatGPT prompts, voice, scene, preview, render
argument-hint: <topic, e.g. "why do we have to brush our teeth twice a day">
---
Make a @coonknows video about: **$ARGUMENTS**

Follow CLAUDE.md exactly (script formula, Coonverse look, pipeline, visual + sound rules). Steps:

1. Pick a slug (lowercase-with-dashes) and create `videos/<slug>/`.
2. Research with web search (3+ solid sources) → `videos/<slug>/sources.md`.
3. Write `videos/<slug>/script.txt`: cold open → "Why/How/When/Where/What the fuck…?" → bridge (spicy only if
   the topic allows) → story with a character + Coon as invisible narrator → real numbers → "And that's why the
   fuck…" + "Share this with <relevant person>." ~200–215 spoken words. Then STOP and show me the script
   (plain text) + a one-line visual plan per beat. Wait for "approved".
4. Write `videos/<slug>/image-prompts.md` and send me, inline in code blocks with full text each:
   new character sheets (if any), new Coon poses on #00FF00 green (if needed), then ~16 scenes (no Coon in them).
   Tell me which reference sheets to attach.
5. Give me the voice text in a code block. When I send images + voice: save images to `videos/<slug>/img/`,
   key green poses with `tools/keygreen.py`, run `node tools/voice.js <slug> 1.15 --pad 1.2`.
6. Build `scene.js` (panels + Coon layers + cards + sfx + autoWhoosh + shakes/flashes + follow).
7. Preview, Read it, fix every problem, send me the preview. Then render, check, send the mp4 with title,
   caption, hashtags and pinned-sources comment. Commit and push after every step.
