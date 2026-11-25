# Viral Task Force plan (Nov 25 2026)

Goal: study what makes educational short-form accounts grow, then turn each finding into a reusable skill (`.claude/commands/`).
Rules from Brian: **educational content creators**; **no Scrape Creators**; study with our own workflow = the **TikTok AI app,
"Coonknows" config** (`docs/workflow.md` Step 1). Claude can't run the app (it's on Brian's PC); Claude picks creators, reads the output, writes the lessons.

## The team (each member = one lane, one deliverable, one skill)
| Lane | Question it answers | Reads | Deliverable | Skill it becomes |
|---|---|---|---|---|
| Scout | Which new educational accounts grew fastest, per niche? | web + Brian's picks | `docs/creators/scout-<date>.md` (ranked handles, why, niche) | `/scout` |
| Hook analyst | What do the first 3 s look/sound like in winners? | app Analysis text | hook patterns table | `/script` hook step |
| Script analyst | Structure, pacing, open loops, plain words, CTA | transcripts | beat templates per mode | `/script` |
| Visual analyst | Art style, cutaways, color code, text cards, cuts per minute | screenshots | visual rules v4 | `/art-prompts` |
| Character/emotion analyst | How faceless casts act: faces, gestures, timing | frames | emotion/acting table | `/acting` |
| Growth analyst | Length, post times, captions, hashtags, covers, comments, series | profile data, Brian's Studio numbers | growth checklist | `/growth` |
| Editor (Claude) | Merge lanes, kill contradictions with `docs/lessons.md`, update PLAYBOOK | all lane files | PLAYBOOK diff + new skills | all |

## Phases
1. **Scout** (web, 0 credits): shortlist ~25 handles across science/how-things-work, history/true stories, money/business, general education. Brian approves.
2. **Run**: Brian adds the approved handles to the Coonknows config and runs it (Max Videos 10, Top K 1, about $1 per run); sends the Analysis + Concepts text.
3. **Analyze**: the lanes above work in parallel on the app output (Claude subagents, one per lane).
4. **Build skills**: one command file per lane, each with a checklist that reads `docs/lessons.md` first.
5. **Test**: run each skill on the next video; Brian's notes go into `docs/lessons.md`.

## Open
- Current creator list in the Coonknows config (Brian pastes it, so we skip repeats).
- Which niche runs first.
