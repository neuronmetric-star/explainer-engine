---
name: explainer
description: Use when Brian says "explainer" or asks to make a "Why do we X?" / how-it-works explainer video. The repeatable system built from the yawn video: slot-by-slot recipe, a beats file that drives art prompts + the scene, measured audits. Run it through /explainer.
---

# Explainer system (the yawn-video method, Nov 26 2026)

Open with the word **explainer**. Then follow `/explainer` (`.claude/commands/explainer.md`) step by step. This skill is the short version and the rules; the full map is `docs/explainer-system.md`.

## The loop
topic → research (≥ 3 sources, `sources.md`) → script (`script.txt` + `notes.md`) → **approve** → beats (`beats.json`) → **approve BEFORE painting** → art prompts → Brian paints → voice → tighten/align/drama/sfx → `make-scene` → previews → `audit` → render → cover + `post.md` → **Brian says commit**.

## Rules (each has its evidence in the lane skills)
1. **The recipe** (`docs/templates/explainer-recipe.md`): the search phrase at 0 s → the character's problem (≤ 5 s) → the common belief, STATED FIRST → the test that breaks it → the re-hook → the best idea with an everyday comparison that says WHY → two pieces of evidence, each bridged → the honest open question → the mirror line → the character's problem CLOSED with a reason → a do-it-yourself line → the send line. [yawn video; `hook`, `script` skills]
2. **Follow-through gate** before Brian sees a script: promise ledger, every "because" spoken, every analogy bridged, the character's problem resolved, the retell written out (`notes.md`; `tools/audit.js` fails without it). Never cut a "because" for a word count. [`script` skill rules 26-32]
3. **Longer is fine** (≈ 175-255 words): the voice is sped 1.2-1.4x by `tools/tighten.js`; final 1:05-1:15. [Brian, Nov 26]
4. **One painting per idea**, none held > ~12 s (the signature sunset excepted); the camera moves in EVERY shot; something changes at least every 3 s; live numbers/labels; our color code. [`visual` skill]
5. **The cast** appears only in the opening (the problem) and the signature helicopter/city-sunset goodbye; the middle is images only. Emotion is in bodies and props, never dialogue. [`character-emotion` skill; Brian, Nov 26]
6. **The ending** is the share trigger: a send-to-a-friend line, no spoken follow ask; the helicopter + city sunset stays. [`growth` skill; Brian: the signature]
7. **Facts**: hedge unsettled science ("best idea so far", "may", "nobody's sure"); never invent a number; no personalized medical/legal/financial advice.
8. **Measure, don't self-grade**: `node tools/beats.js check <slug>` and `node tools/audit.js <slug>`; a duplicate voice file or a missing image is a FAIL, not a guess.

## Tools (all in `tools/`)
`beats.js check|art|shots` · `make-scene.js` · `tighten.js` · `align.js` · `voice_drama.js` · `sfx.js` · `render.js` · `audit.js` · `cover.js` · `cutout.py`
