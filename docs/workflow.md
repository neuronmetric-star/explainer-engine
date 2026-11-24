# The workflow: from "make video" to posted

Brian, Nov 24 2026: "whenever we start a new chat for a new video we say make video and you ask us questions and help us navigate,
and you're smart and ask me to run the things we did today." This is that workflow. `/make-video` (or just saying "make video")
runs it. Claude leads, asks, and tells Brian exactly what to run on his side at each step.

**Where things live**
- Series tracker (Brian's phone-friendly list of every episode and its next step): https://claude.ai/artifact/SDxLVHHeJEHJ4cyPpiwYgM
- Rules: `CLAUDE.md`, `docs/PLAYBOOK.md`, the scorecard + notes log `docs/lessons.md`, series `docs/series.md`,
  ideas `docs/creators/concept-bank.md`, studies `docs/creators/`, trends `docs/trends/<date>.md`.

## Who does what
| Step | Claude does | Brian does (Claude asks for it at the right moment) |
|---|---|---|
| 0. Start | Asks the 3 start questions (below), reads the lessons, the tracker, today's trend sheet | Answers in one line |
| 1. Study (weekly, or when the topic is new) | Says which creators to add; reads the results Brian sends | Runs the **TikTok AI app** on his PC (steps below) and sends screenshots / pastes the breakdowns |
| 2. Research | Web research, `sources.md` | — |
| 3. Script | Writes it, runs the scorecard, shows narration + scorecard + hook direction | Says "approved" or edits |
| 4. Art | Writes `art-prompts.md` (reusing series art), reviews every image | Paints in **ChatGPT** batch by batch, sends the images |
| 5. Voice | Gives the text and how to shout the hook | Records in **OpenArt/ElevenLabs**, sends the MP3 |
| 6. Build | Tightens + aligns the voice, builds the scene (visual hook first), sound effects | — |
| 7. Preview | Renders stills, checks them against the scorecard, fixes, sends a preview | Says "looks good" or notes |
| 8. Final | Renders, makes the cover and caption, updates the tracker and `docs/series.md`, merges to `main` | Posts (TikTok first, then Reels, Shorts), pins the comment |
| 9. Learn | Adds Brian's notes to `docs/lessons.md`; Sunday review adds the numbers | Sundays: pastes 3-s hold + watched-to-end from TikTok Studio |

## Step 0: the start questions (Claude asks, in one short message)
1. **Which video?** Offer 3 picks, each with its one-line answer: the next episode of a running series (from the tracker),
   the top idea on today's trend sheet, and one from the concept bank. Or Brian's own topic.
2. **Anything new to study first?** If the topic is in a lane we haven't studied in 2+ weeks, ask Brian to run the TikTok AI app
   (step 1) before the script, and say which creators to add.
3. **When do you want to post it?** (sets the deadline and the slot, per `docs/posting-schedule.md`)

## Step 1: running the TikTok AI app (Brian's PC, folder "Claude Code Tiktok Project")
Claude gives these steps every time it asks:
1. Open File Explorer → Desktop → **Claude Code Tiktok Project** → right-click an empty spot → **Open in Terminal**.
2. Type `npm.cmd run dev` and press Enter. Wait for **Ready**. Leave this window open.
3. In the browser open **http://localhost:3000/run**, choose the **Coonknows** config.
4. Advanced settings: **Max Videos per Creator 10**, **Top K 1** (about $1). Press **Run Pipeline** (15–30 min).
5. Click **View New Videos** → open each → send Claude screenshots or paste the **Analysis** and **Concepts** text.
- To change creators: open the Claude window in that folder (`claude --continue`) and ask it, or ask Claude here for the exact message.
- If the page says "can't reach": the terminal window was closed; repeat steps 1–2.

## Step 4: the art in ChatGPT (Brian)
New ChatGPT chat → paste **START** + **BATCH 1** from `videos/<slug>/art-prompts.md` → send Claude the images → Claude checks
them and sends a one-line fix for any plain one → next batch. Series episodes reuse the series' paintings: usually 2–4 new images.

## Step 5: the voice (Brian)
Record the whole narration in OpenArt/ElevenLabs. The first words are **shouted**: "WHAT THE HECK?!", then the question calmly.
Send the MP3 here. Claude tightens it (pauses + 1.2×) and checks it lands at 1:05–1:15.

## After posting
Claude marks the episode **Posted** in the tracker. Sundays (12:47 ET when the scheduled review is set up): the numbers go into
`docs/lessons.md`, the best and worst video each give one new rule, and Brian approves them.
