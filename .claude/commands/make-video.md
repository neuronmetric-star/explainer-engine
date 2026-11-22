---
description: Research, script, shot list, voice, build and render a full story-driven explainer video for any topic
argument-hint: <topic, e.g. "why airlines overbook flights">
---
Make a video about: **$ARGUMENTS**

Follow CLAUDE.md and `docs/PLAYBOOK.md` exactly. Example to copy: `videos/gas-vs-water/`.

0. **Length:** always short form (≈ 1:05–1:12, PLAYBOOK §1.11). Don't ask; long form is retired.
0. Default mode is **Trend ride** (PLAYBOOK §1.13) when today's sheet has a meme × topic pair: Doug and Gary act out the
   meme (real sound ≤ 16 s or narrator-performed), then the sourced story, takeaway, mirror line, viewer question, CTA.
1. Write the **payoff** (one sentence the viewer will discover) and pick the question word that it answers.
   Pick a short slug and create `videos/<slug>/`.
2. Research with web search (≥3 solid sources) → `videos/<slug>/sources.md`. Label fiction/reconstructions.
3. Write `videos/<slug>/script.txt` (PLAYBOOK §1 + §1.9 Ray skeleton + §1.10 Xevi personality; short form only: hook → middle → end per §1.11, 175–190 story words + CTA ≈ 1:05 final (never under 1:02); cues before every picture change; zero-knowledge pass per §1.6a: basics first, every term, name and number explained).
   STOP and show me: the narration in one copyable block, then voice direction, the fact list with sources,
   (opening always says "the heck", never "the f*ck"). Wait for "approved" (or edits).
4. Write `videos/<slug>/shotlist.md` (PLAYBOOK §5): cast, numbered background prompts, green-screen prop
   prompts, and the shot plan table (picture · camera · face/pose/gesture per cue). Tell me how many images.
   Also write `videos/<slug>/art-prompts.md` (prompt-pack "Batch file") for Brian to paste into ChatGPT, to **art standard v2**
   (PLAYBOOK §4: rich, descriptive 120–180-word background prompts, color script, varied angles). Review batch 1 before the rest.
   Mark any OpenArt video inserts (PLAYBOOK §4.1) in the shot plan; generate them only after the art arrives,
   one test clip first, and report credits.
5. Voice: if ELEVENLABS_API_KEY is set run `node tools/tts.js <slug>`; otherwise give me the spoken text,
   wait for `voice.mp3`, then run `node tools/align.js <slug>`.
6. When the art is in `videos/<slug>/art/`: build the scene (plates matched per painting, cast, acting,
   camera moves and hard cuts per the shot plan).
7. Render preview stills, Read them, fix problems, repeat until clean. Send me the preview.
8. Render the final 30 fps video with voice. Commit and push. Tell me the file path.
9. Cover + caption: `node tools/cover.js <slug> <seconds> "LINE 1|LINE 2|LINE 3"` on a frame where the character is on
   screen with an expressive face (covers ALWAYS show the character). Write `videos/<slug>/post.md` (TikTok/Reels caption
   + hashtags, YouTube Shorts title). Send me the cover and the caption.
