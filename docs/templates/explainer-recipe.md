# The "Why do we X?" explainer recipe (from the yawn video, Nov 26 2026)

Every slot has a job and a budget. Fill the slots, run the follow-through gate, then build. Lines are spoken at 1.2-1.4x (`tools/tighten.js`), so ~175-255 words total.

| # | Slot (cue name) | Job | Words | The picture (one painting per idea) |
|---|---|---|---|---|
| 1 | `hook` | The search phrase, spoken at 0 s ("Why do we yawn?") + on screen from 0.25 s | 5 | the character's problem painting, the strange thing huge, crash-zoom out in 0.55 s |
| 2 | `card` `kept` | The character's PROBLEM, one or two sentences ("See, Doug had a problem. He kept yawning, and he worried something was wrong.") | 15-20 | same room, the character acts the problem |
| 3 | `belief` `bet` | What most people say (STATE IT FIRST), then the narrator's dry bet ("Honestly? I believed that too.") | 20 | a school/everyday painting of the belief |
| 4 | `tested` `o2` `laps` `same` `notair` | The test that breaks the belief (who, when, what they did, what happened) → "So it's not X." | 35-45 | a painting of the test (lab, gym, field) with the real year/number on screen |
| 5 | `rehook` | The question the viewer is now asking ("Then what is it?") | 5 | the hero painting + a big `?` |
| 6 | `idea` `laptop` `fan` `pull` `nodis` | The best idea so far + an everyday comparison that says WHY ("a laptop uses a fan") + the hedge ("Not every scientist agrees.") | 40-50 | a painting of the comparison, then the hero painting showing the mechanism |
| 7 | `people` `hot` `fits` | Evidence 1, with the bridge ("If a yawn is a fan, that makes sense: hot air can't cool you off.") | 30-35 | a painting of the evidence with a live counter |
| 8 | `rats` `drop` | Evidence 2 (a second, different kind), with its "so what" | 20-25 | a painting of the evidence + a prop |
| 9 | `mystery` `spread` `why` | The honest open question ("Nobody knows why.") | 15-20 | a painting of the open question |
| 10 | `mirror` `best` `idk` | Mirror the hook: "So, why do we X? Best guess: ... Nobody's sure." | 15 | the hero painting again |
| 11 | `doug` `probably` `diy` | CLOSE the character's problem WITH a reason ("A yawn isn't a flaw. It may just be your brain's fan. Nothing's wrong with him. Probably."), then the do-it-yourself line ("Next yawn, feel the cool air.") | 20 | the signature city-sunset + helicopter |
| 12 | `cta` | The send line ("Send this to someone who's yawning."): no follow ask | 8 | hold the sunset, slow push |

## Rules that make it work (all in `.claude/skills/*` with their evidence)
- The belief is stated BEFORE anyone reacts to it. Every idea is introduced before it is referred to.
- Every "because" is spoken. If a link doesn't fit the word budget, cut a joke or a side rung, never a "because".
- Hedge the science ("best idea so far", "may", "not every scientist agrees", "nobody's sure"); never invent a number (write "not reported").
- The character's problem is opened in slot 2 and closed, with a reason, in slot 11. The cast appears only there (and in the signature ending).
- One painting per idea; no painting held more than ~12 s (the signature ending excepted). The camera moves in EVERY shot.
- A live number or label on screen at least every 3 s. Colors: red = hot/danger/no, light blue = cool/air, gold = the answer.
- Facts: >= 3 sources in `sources.md`, fiction labeled, no personalized medical/legal/financial advice.
