---
description: Research, script, shot list, voice, build and render a full story-driven explainer video for any topic
argument-hint: <topic, e.g. "why airlines overbook flights">
---
Make a video about: **$ARGUMENTS**

Follow CLAUDE.md, `docs/workflow.md` (who does what) and `docs/PLAYBOOK.md` exactly. Latest worked example: `videos/airplane-window-hole/` (v4).
You LEAD: Brian works from his phone. Keep messages short, ask before spending credits, and at each step tell him exactly what to run
on his side (TikTok AI app, ChatGPT art, recording) with the click-by-click steps from `docs/workflow.md`.

**Start (always):** read `docs/lessons.md`, `docs/series.md`, the tracker (https://claude.ai/artifact/SDxLVHHeJEHJ4cyPpiwYgM, via the
Claude Docs connector) and today's `docs/trends/<date>.md`. Then ask the 3 start questions from `docs/workflow.md` step 0 in ONE message
(skip any the topic above already answers): which video (offer 3 picks: next series episode, top trend, a concept-bank idea), anything new to
study first with the TikTok AI app, and when to post. Mark the episode's status in the tracker as you go (Script → Art → Voice → Building →
Ready to post) with its "Next step", and keep `docs/series.md` in step.

0. **Length:** always short form (≈ 1:05–1:12, PLAYBOOK §1.11). Don't ask; long form is retired.
0. Default mode is **Trend ride** (PLAYBOOK §1.13) when today's sheet has a meme × topic pair: Doug and Gary act out the
   meme (real sound ≤ 16 s or narrator-performed), then the sourced story, takeaway, mirror line, viewer question, CTA.
1. Write the **payoff** (one sentence the viewer will discover) and pick the question word that it answers.
   Pick a short slug and create `videos/<slug>/`.
2. Research with web search (≥3 solid sources) → `videos/<slug>/sources.md`. Label fiction/reconstructions.
3. Write `videos/<slug>/script.txt` (PLAYBOOK §1 + §1.9 Ray skeleton + §1.10 Xevi personality; short form only: hook → middle → end per §1.11, 175–190 story words + CTA ≈ 1:05 final (never under 1:02); cues before every picture change; zero-knowledge pass per §1.6a: basics first, every term, name and number explained).
   **Easy to understand, always (Brian, Nov 24 2026):** plain words a 10-year-old follows (no jargon: "layer", not "pane";
   "pushes", not "pressure"), one idea per sentence, an everyday comparison for every step, the mystery shown in the first 5 s.
   **The HOOK, always:** the first spoken line is about the viewer ("How does YOUR printer work?") + the surprise, per the hook types in `docs/lessons.md`. The shouted **"WHAT THE HECK?!"** opener is on test (dropped on the printer video, Nov 24): check `docs/lessons.md` for the verdict before using it.
   Before showing me, run the scorecard in `docs/lessons.md` and fix every "no". Read `docs/lessons.md` first: never repeat a past note.
   STOP and show me: the narration in one copyable block, the scorecard, voice direction (how to shout the hook),
   the fact list with sources (always "heck", never "the f*ck"). Wait for "approved" (or edits).
4. Write `videos/<slug>/shotlist.md` (PLAYBOOK §5): cast, numbered background prompts, green-screen prop
   prompts, and the shot plan table (picture · camera · face/pose/gesture per cue). Tell me how many images.
   Also write `videos/<slug>/art-prompts.md` (prompt-pack "Batch file") for Brian to paste into ChatGPT, to **art standard v2**
   (PLAYBOOK §4: rich, descriptive 120–180-word background prompts, color script, varied angles). Review batch 1 before the rest.
   Mark any OpenArt video inserts (PLAYBOOK §4.1) in the shot plan; generate them only after the art arrives,
   one test clip first, and report credits.
5. Voice: if ELEVENLABS_API_KEY is set run `node tools/tts.js <slug>`; otherwise give me the spoken text,
   wait for `voice.mp3`, then run `node tools/align.js <slug>`.
6. When the art is in `videos/<slug>/art/`: build the scene (plates matched per painting, cast, acting,
   camera moves per the shot plan). **Open on the VISUAL HOOK** (PLAYBOOK §3.5 #12: the strange thing huge in frame 1,
   crash-zoom out, a cast member reacts big with the `scream` face, shake + sting, `WHAT THE HECK?!` slammed on screen).
   Smooth, not choppy: `SCENE.whip = true`, same-place shots continue the camera, diagrams flow, few words on screen (§3.5 #9–11).
7. Render preview stills, Read them, fix problems, repeat until clean. Send me the preview.
8. Render the final 30 fps video with voice. Commit, push, and merge to `main` (fast-forward). Send me the video.
9. Cover + caption: `node tools/cover.js <slug> <seconds> "LINE 1|LINE 2|LINE 3"` on a frame where the character is on
   screen with an expressive face (covers ALWAYS show the character). Write `videos/<slug>/post.md` (TikTok/Reels caption
   + hashtags, YouTube Shorts title). Send me the cover and the caption.
10. **Improve every time:** add Brian's notes from this video (and, after posting, its 3-second hold and completion numbers)
    to `docs/lessons.md`, turn each note into a rule in the scorecard or the playbook, and commit.
