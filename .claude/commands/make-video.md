---
description: Research, script, voice, build and render a full teaching video for a topic
argument-hint: <topic, e.g. "how credit card companies make money">
---
Make a teaching video about: **$ARGUMENTS**

Follow CLAUDE.md exactly. Steps:

1. Pick a short slug (lowercase-with-dashes). Copy `videos/_template/` to `videos/<slug>/`.
2. Research with web search. Collect at least 3 solid sources. Write `videos/<slug>/sources.md`.
3. Write `videos/<slug>/script.txt` with the script formula and markup (cues before every visual change).
   Aim for 150–175 spoken words. Then STOP and show me:
   - the hook line,
   - the full spoken script (plain text),
   - a one-line plan for what's on screen in each part.
   Wait for my "approved" (or edits) before continuing.
4. Voice: if ELEVENLABS_API_KEY is set, run `node tools/tts.js <slug>`. If not, give me the plain spoken
   text in a code block to paste into OpenArt, wait for me to add `voice.mp3`, then run `node tools/align.js <slug>`.
5. Build `scene.js` (use buy-borrow-die as the reference for quality and structure). One set per idea.
6. `node tools/render.js <slug> --preview`, Read `preview.jpg`, fix problems, repeat until every frame is clean.
   Send me the preview image.
7. `node tools/render.js <slug>` for the final video. Commit and push. Tell me the file path.
