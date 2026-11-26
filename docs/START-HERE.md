# START HERE: the command for any new chat

Paste this as your first message in a new Claude Code chat on this repo:

```
explainer. Run the full Explainer Engine system, all 7 skills (topic-scout, scout, hook, script, visual, character-emotion, growth), using Scrape Creators for live topics. Read CLAUDE.md, docs/START-HERE.md, docs/explainer-system.md and docs/lessons.md first. Ask me the 3 start questions, show 3 topics from today's scrape per niche, then lead me step by step: research, script (I approve), art prompts, voice, scene, audit, post kit. Report credits spent. Don't commit or merge until I say so.
```

**Short version (does the same): just type `explainer`.** It scrapes first, shows 3-5 topics, waits for your pick, then runs the whole production.

## What happens
1. `topic-scout`: balance check, niche scrape (body, science, money, history, kitchen/holiday), 3 ranked topics each with search phrase, evidence, format. Writes `docs/trends/<date>.md`.
2. Pick one. Formats: **why-explainer** (yawn, ears) or **build ladder** ("If you X, you have Y. But… so you…", bread-ladder). Rotate (growth rule 18).
3. `hook` + `script` (follow-through gate) → you approve the narration.
4. `visual` beat → painting table, art prompts for ChatGPT, `character-emotion` acting notes.
5. Voice, scene, `tools/audit.js`, render, cover, post kit (`growth`: CTA, caption, slot).
6. Weekly results go in `docs/lessons.md`.

## Current rules in one place
- Length 1:05-1:15 (≈ 175-255 words at 1.2-1.4x). Captions 2-4 word chunks (TEST). Ending: helicopter + city sunset.
- CTA: "Send this to someone who...", then "follow, and watch our <last video> next".
- Scrape Creators is allowed; check credits first, report spent. Commit/merge only when Brian says.
