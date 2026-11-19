# The Playbook: how we make every video

One format, any topic. **One narrator's voice. A flat illustrated 2D world. Silent 3D sphere-head
characters. Camera that never sits still. Captions one word at a time.**
**Two lengths, one format:** **long form 8+ minutes** and **short form ≈ 1:05** (just over TikTok's 1-minute payout line). **No default:** if Brian didn't
say which, ask him before doing any research or writing. Both use the same
story method, Ray's skeleton, Xevi's narrator personality, cast, camera and art. Short form is just compressed (§1.11).

What it's built from:
- **Story:** the Coon Knows storytelling guide ("write the question from the answer").
- **Pacing and line craft:** our study of @RicksClips3000's 20 most recent Shorts (`docs/ricksclips/study.md`).
- **Long-form structure and narrator personality:** Ray (@realraywilliam) and Xevi (@xeviuniverse) (`docs/creators/ray-xevi-study.md`).
- **Look:** your ChatGPT paintings (`docs/prompt-pack.md`) plus the 3D cast in `engine/characters.js`.
- **Camera and compositing:** the plate lab (`engine/lab/plate-lab.html`).
- **Worked example:** `videos/why-cars-need-gas/`.

---

## 0. The whole pipeline on one screen

| # | Step | Who | Output |
|---|---|---|---|
| 1 | Pick the topic, find the **payoff** | Claude (Brian approves topic) | one sentence: what the viewer will discover |
| 2 | Research, every claim sourced | Claude | `videos/<slug>/sources.md` |
| 3 | Script (section 1) | Claude → **Brian approves** | `script.txt` + narration in one copyable block |
| 4 | Shot list + image prompts (section 4) | Claude | `shotlist.md` |
| 5 | Paint the worlds and props in **ChatGPT, always** (Brian), from the batch prompt file `videos/<slug>/art-prompts.md` | Brian | long form ≈ 30–45 backgrounds + 20–30 props → `videos/<slug>/art/` |
| 5b | ~~AI video inserts~~: **not used**, everything is animated in the engine (§4.1) | — | 5–10 s clips → `videos/<slug>/clips/` |
| 6 | Voiceover (ElevenLabs/OpenArt, or `tools/tts.js` with a key) | Brian / Claude | `voice.mp3` → `node tools/align.js <slug>` |
| 7 | Build the scene: plates, cast, acting, camera (sections 2–3) | Claude | `scene.js` |
| 8 | Preview stills, fix, repeat | Claude | `preview.jpg`, sent to Brian |
| 9 | Render 30 fps, voice mixed | Claude | `final.mp4`, committed, path sent (software render ≈ 7 min per minute of video (the 1:38 gas-vs-water took 11 min), so ≈ 1 h for 8 min; faster with `--gpu` on a desktop) |

Images (5) and voice (6) can happen at the same time, right after the script is approved.

---

## 1. Story: write the question from the answer

### 1.1 Payoff first, then the first word
Write down what the viewer will discover. Then pick the question word that the ending actually answers:

| The payoff is a… | Open with | Example |
|---|---|---|
| reason or motive | **Why the heck** | Why the heck do pilots dump fuel before landing? |
| identity | **Who the heck** | Who the heck opened the door? (answer: the guard) |
| decisive moment | **When the heck** | When the heck did the Titanic actually become unsinkable? |
| object or event | **What the heck** | What the heck is the white stuff in a bird's poop? |
| process or sequence | **How the heck** | How the heck does a puddle of gasoline move a two-ton car? |

- **Show the subject during the question** (the puddle, the door, the plane).
- **Start the action in sentence two:** "Doug decided to find out by never buying it again."
- **Always "heck", never "f\*ck"** (Brian, 2026-11-19): voice and captions both say "heck". No profanity in
  the opening, so every platform stays ad-safe. "How on earth" is the only alternative.

### 1.2 Build the middle around a choice and its result
1. Give someone a **goal** and a **reason to expect their plan to work** (Doug: "gas is a liquid,
   water is a liquid").
2. **Show the choice** (the hose into the tank).
3. **Stay with the apparent success** long enough to believe it ("The car *started*").
4. Let **another person notice a detail we already saw** (Gary watches the tailpipe puffs shrink).
5. **Follow the consequence back to someone we know** (Doug pays for the tow).

**Adapt the shape to the material:**
| Material | Shape |
|---|---|
| A repeated scheme | Show the first attempt, then jump to the observer who recognizes the pattern |
| A known disaster | Rewind to the early success that encouraged the next decision |
| A disputed account | Attribute the claim right away, then follow the evidence |
| A mechanism | **Track one object** until its motion reveals the hidden cause (one drop of gas) |

### 1.3 The narrator changes their mind in our company
- Speak to **one friend**. Use "I'd have…", "Honestly?".
- **Place your bet early** ("Honestly? I'd have bet on Doug."), and know which detail will make you
  regret it.
- **Stay with the person who still believes it for one more beat.**
- When a new name or term raises a real question, **ask it when the listener would** ("Wait,
  practiced?"), then answer it.
- **Give a costly consequence room to land.** Don't rush the last line.

- **No side bets between characters** ("Five bucks on the line" was cut). The disagreement itself is the stakes;
  a wager adds a prop and a payoff that pull focus from the real answer. Only the narrator "bets", as an opinion.

- **"How does X work" topics: the mechanism IS the video**, told simply, but **woven into the story, never as a
  numbered list.** No "Step one / Step two", no "three steps", no lesson-style signposting: Brian rejected that.
  Explain each part **as the story reaches it** ("When Doug presses the pedal, electricity flows into the motor…"),
  in cause → effect order. Build the story around **a broken, surprising or misused version of the thing**, so the
  clue is the part that behaves unexpectedly (the snapped filament; the battery filling up downhill). No side trivia
  (speeds, records, history) unless it IS the answer. The light-switch race story was rejected as too complicated
  (`videos/light-switch/script-short-v1.txt`); the light-switch "Step one…" structure was then also retired.

### 1.4 Line craft (from the RicksClips study)
- **Concrete, oddly specific numbers** (82 holes, every 39 feet, 15 times its weight in air).
  Precision makes a strange act sound deliberate.
- **A skeptic voices the viewer's doubt as a joke.** Our characters are silent, so the narrator
  says it for them ("His commander basically asked if they were fighting or grating cheese").
- **A comic simile or exaggeration about every 10 seconds** ("a space heater that occasionally goes
  places", "a fish tank with seatbelts").
- **An everyday analogy for the science:** blowing on soup, catching a falling phone. Point at
  something the viewer has already felt.
- **Time markers move the story:** "Next morning…", "By July…", "One block later…". Each marker
  is a new shot.
- **Archetypes over names.** "His neighbor" or "the banker" need no setup. Use a first name only for
  the 1–2 people we follow (Doug, Gary).
- **Hold back the explanation until about 60–75% of the runtime.** The question opens at second 0
  and the answer arrives around second 55–65 of 90.
- **End on the payoff image and a dry final line, then the follow CTA (§1.12).** Best last line: **mirror a line
  from the middle** so it flips ("they're both right" → "Turns out they were both wrong. Netflix wasn't.").

### 1.5 Format and length
**Ask first.** If the request doesn't say "long" or "short", stop and ask Brian which one before research,
script, shot list or anything else. Never assume.

| Format | Runtime | Words (deadpan, ~200–215 wpm) | Structure |
|---|---|---|---|
| **Long** | **8:00–9:30** | **1,300–1,500** (~160–170 wpm, conversational) | Ray's skeleton (§1.9): 6–8 scenes, each with a decision, discovery or setback; 2–3 "until" flips; plant early details and pay them off once the viewer can read them |
| **Short** | ~1:05 (never under 1:02) | 175–190 story words + CTA (≈ 3 words/s after tightening) | Hook, middle, end (§1.11): one chain of events, the mechanism in 2–3 steps, one callback |

Time the read aloud. Leave about 0.5 s after each reveal line.

### 1.6 Script rules
- Every sentence must be **picturable**: a person does something, or an object moves.
- Short sentences. No filler ("so basically", "in today's video").
- **Verify every factual claim** in `sources.md`. **Label invented characters and reconstructions**
  in the sources file. The story can be fictional; the mechanism must be real.
- No personalized financial, legal or medical advice. Explain how things work.
- Deliver the narration in **one clean copyable block**, with timing, direction and sources outside it.

### 1.6a The viewer knows nothing (zero-knowledge rule)
Write for someone who has **never heard of the topic**: smart, but no background. If they'd have to Google
something to follow the next line, the script is broken.
- **Set the ground before the twist.** One plain sentence on what the thing is and how it normally looks or works,
  before we surprise them. ("When you open Netflix, every movie is a little picture called a thumbnail.")
- **Define every term the first time, in the same breath**, with everyday words, and show it on screen.
  No jargon left alone: "algorithm" → "a program that guesses what you'll click". Prefer the everyday word outright.
- **Introduce every name**: people, films, companies, places. "Robin Williams, the comedy legend",
  "Good Will Hunting, a 1997 movie about a janitor who's a math genius". Never assume they know who or what it is.
- **Numbers get a yardstick.** "$1 billion a year: about $1,900 every single minute." "60–90 seconds: less time than microwaving popcorn."
- **Name it once, then use that exact name every time.** Once a term is defined ("thumbnail"), every later mention
  uses the same word: no synonyms ("picture", "poster", "image"). A new word makes a newcomer think it's a new thing.
  Same for characters and objects ("Gary", not "the documentary guy"; "the bill", not "the cash" then "the money").
- **Watch for sneaky new terms**, especially in the last third ("these picks", "the system", "the feed").
  Swap them for a word already defined or for plain words ("what Netflix put in front of them").
- **Define with a joke when you can:** the definition doubles as the 10-second laugh
  ("documentaries, true stories about whales and wars").
- **Explain the mechanism with an if-then example, not an abstract phrase.** Not "based on your viewing history"
  but "Lots of comedies? You get the funny thumbnail. Lots of love stories? You get the kissing thumbnail."
- **Say the surprise out loud** in one short line right after the reveal ("Same movie. Two different thumbnails.").
  Don't trust the viewer to work it out from the picture alone.
- **Every number gets its cause**: say *why* it happens or why it matters
  ("over a billion dollars a year, because people stay instead of canceling").
- **No skipped steps in a mechanism.** If step B needs A, say A. Track one object through every step.
- **One new idea per sentence.** Don't stack two unknowns in one line.
- **Test before showing Brian:** read each line as a 12-year-old who's never seen the thing. Any "wait, what's that?"
  → add a few words or a picture. Simplify; never dumb it down or talk down (the narrator's sarcasm targets the
  characters, never the viewer).
- Budget: about **10–15% of the words** go to setup and definitions (≈ 20–30 words in a short, ~150–200 in long form).
- **Worked example:** `videos/netflix-picks/script-v2.txt` (the Netflix script rewritten with every rule here;
  compare with `script.txt`, the version we produced before this rule existed).

### 1.7 Turning ANY topic into a story (the recipe)
1. **What's the surprising true answer?** That's the payoff.
2. **Who would get it wrong?** Invent a confident fool, or find a real person who did (Doug).
3. **What do they try, and why do they think it'll work?** That's the choice.
4. **What detail exposes it, and who notices?** That's the clue and the observer (Gary, the tailpipe).
5. **What's the one object we can track to show the mechanism?** (one drop, one coin, one email.)
6. **What does it cost them?** That's the consequence, then a dry last line.

### 1.9 Long-form skeleton (from Ray, @realraywilliam)
| Time (of ~8:30) | Beat | Line pattern |
|---|---|---|
| 0:00–0:10 | **Coon question + cold open** | "What the heck happened to…?" + the outcome in one line ("…is about to lose everything over a pack of nuts") |
| 0:10–0:30 | **Character card** | "Now, his name is Doug, and Doug is 34, living in…" + one defining trait |
| 0:30–1:00 | **Desire or flaw** | what they want and why that's a problem |
| 1:00 | **Inciting decision** | "So one day in [year]…" |
| 1:00–2:30 | **Plan mechanics, step by step** | "So here's what they do. First…" (track the object, Coon §1.2) |
| 2:30–3:30 | **Apparent success + a number** | "And this works perfectly." Escalation montage with a bigger number each time |
| 3:30–4:30 | **"Now here's the problem…"** | the observer appears (the person who notices the pattern) |
| 4:30–5:30 | **Near-miss / false ending #1** | "And that's the end of that, right? Right? Wrong." |
| 5:30–7:00 | **Escalation 2, until #2** | "…they're never gonna get caught… until…" (hold a beat of silence) |
| 7:00–8:00 | **Callback payoff** | "Remember how I said…? Well…" + "Bam," then evidence on screen |
| 8:00–8:30 | **Aftermath + verdict** | the cost in numbers, then one dry line ("So good for him."), then the follow CTA (§1.12) |

**Ray's rules:**
- Numbers on every beat.
- Honesty asides ("I actually looked into it…", "allegedly", "I'm speculating here").
- A sarcastic one-liner after each dumb move.
- **Imagined-visual jokes** ("I imagine they look like this"), so we cut to a silly prop.
- Connectors: "So / And so / Now, / Anyway, / Meanwhile,".
- "Meanwhile" cross-cuts to the person who doesn't know yet.

### 1.10 Narrator personality (from Xevi, @xeviuniverse)
- **"See, ___ had a problem."** opens the story, and opens each new character.
- **Perform both sides of every exchange** in quick invented back-and-forth ("They said 'Doug.' He
  said 'huh.' They said…"). On screen, the silent characters act it out with gestures, never mouths.
- **Comic timing inside the dialogue:** a character forgets their own point, a boss says "not you."
- **A euphemism dictionary per topic**, funny and platform-safe (steal = "forever borrow", jail =
  "timeout", police = "the popo", punched = "got bonked"). Plus **one running-gag word** that keeps coming back.
- **Talk straight to the viewer:** "you remember X, right?", "now you're thinking, who's Gary?
  I'mma tell you", "I forgot to tell you…", "listen closely".
- **A self-correction gag** ("actually that's the wrong car, that was the first one he borrowed").
- **The hinge:** "here's where it starts to get wicked" / "but it all comes to a head when…"
- **Sound effects in the voice** ("vroom vroom", "kaboom").
- **End on an understated quote** from the subject, or "the rest is history."
- Keep the slang natural to the narrator voice we cast. Personality, not imitation.

### 1.11 Short form (≈ 1:05): hook, middle, end
**Why this length:** TikTok's Creator Rewards Program only pays for videos **over 1 minute**. So a short is
just past that line: **final video 1:05–1:10, never under 1:02.** That's **≈ 175–190 story words + the CTA**
(our voices run ≈ 3 words/s after the 1.2× tightening). Same narrator, same rules, just tighter.
Every short must be **very clear for someone who has never heard of the topic** (§1.6a).

| Part | Time (of ~1:05) | What happens |
|---|---|---|
| **Hook** | 0:00–0:05 | Coon question with the subject on screen + "See, Doug had a problem." in one line |
| **Middle** | 0:05–0:50 | One plain line of ground (what the thing is) → the wrong belief or choice → plant the clue on screen → the narrator's bet → the mechanism explained **inside the story**, cause → effect (never "Step one…" or "three steps") |
| **End** | 0:50–1:05 | The clue pays off ("So, the rattle.") → one consequence → a deadpan last line that mirrors a middle line → the follow CTA (§1.12) |

Personality, scaled down: one performed line per character, one aside ("I'mma tell you"), one running gag,
a joke or simile about every 10 s.
**Cut first:** second examples, extra numbers, side trivia, extra characters. **Never cut:** the ground line,
the definitions, the steps, the clue, the mirror line.
**Length check:** after `align.js`, the final (voice + tail) must be ≥ 1:02. If it's shorter, tighten the voice
with `atempo=1.1` instead of 1.2, or trim fewer pauses; if it's over 1:15, cut words before recording.
Shots: ≈ 20–25 cuts, 5–8 backgrounds, 4–6 props (≈ 10–12 images, one ChatGPT batch file).
A long-form story can also be **cut down into a short** that ends on its first "until" or its reveal.

### 1.12 The follow CTA (every video, short and long)
**The psychology:** "I showed you something and gave you value, so give me a follow." It's reciprocity,
plus the viewer's own behavior ("you're still here, so you liked it"). After the last story line, a short
beat (about 0.4 s), then the narrator says it in the same voice, about 20–25 words, ≈ 6–8 s, on top of the
story's word count.

**Rotate these so viewers don't hear the same ask every time** (default: C):
| | Line | Lever |
|---|---|---|
| **C (default, Brian's line)** | "Still here? Then that means you enjoyed the video. So follow and like for more." | you stayed, so you enjoyed it |
| A | "If you don't feel like you just wasted a minute of your life, follow. That's the deal. I bring the facts, you bring the follow." | fairness: value for a follow |
| B | "If you're still here, it means you liked this. Don't lie. Follow and like, and I'll keep bringing you videos like this." | you stayed, so you liked it |
| D | "[Smart character] followed. [Fool] didn't, and look what happened to [fool]. If this was worth your minute, follow and like for more." | story callback (adapt names) |
| E | "The algorithm is crazy, you might never see me again. If this was worth your minute, follow for more facts." | scarcity |

For long form, "a minute" → "these eight minutes."

**Picture:** hold the final story image, then the **+ FOLLOW** button pops in, a cursor taps it, and it
becomes **✓ FOLLOWING**. A cast member reacts: the smart one `point`s at the button or `cross` + `smirk`s;
in D, the smart one taps it and the fool `facepalm`s. "follow" and "like" are gold in the captions.

### 1.8 Script markup (`script.txt`)
`*word` gold · `!word` red · `{shown|spoken}` e.g. `{*$40|forty bucks}` · `[#cue]` sync point before
every picture change · `#` comment lines. Write numbers as words in the spoken part.

---

## 2. The cast: silent 3D characters

**Look:** glossy white sphere head with a drawn face, a black stick neck, white cartoon gloves, real
clothes. Built in code (`engine/characters.js`). No model files, renders exactly the same every time.

| Character | Outfit (`CHAR.make({outfit})`) | Typical role |
|---|---|---|
| **Doug** | `hoodie`: mustard hoodie, jeans, white sneakers | the confident everyman who gets it wrong |
| **Gary** | `oxford`: blue oxford, glasses, khakis, brown shoes | the observer, neighbor, expert, the one who notices |
| **Victor** | `suit`: navy suit, red tie, gold watch (stocky) | the rich guy, boss, schemer, official |
| **Polo guy** | `polo`: olive polo, khakis, gray sneakers, watch | the worker: tow driver, cashier, guard, mechanic |
| **Zuckerberg** | `zuck`: gray zip hoodie, jeans, black slide sandals, short curly brown hair (2004 look) | real person: only when the story is about him; acts silently, facts only |
| **Gates** | `gates`: big square brown glasses, sandy mop with side bangs, navy V-neck sweater over light collar, khakis (1975 look) | real person: same rule |

Use **only the characters the story needs** (usually 2–3). **Real people** get a look-alike outfit (signature clothes,
hair, glasses), never a drawn face of their own; like everyone, they never speak, and the narrator only says sourced facts about them.
Preview the cast with `node engine/lab/render-lab.js <out> --page cast-lab.html`. New outfits are added in `OUTFITS` when a
topic needs one (chef, pilot, doctor…).

### 2.1 Acting rules (they never talk)
- **Mouths stay still.** No lip-sync, ever. The narrator alone speaks.
- They act through **gaze, posture, hands and timing**.
- When the narrator performs a line of dialogue (Xevi style), the **speaker gestures on their line**
  and the **listener reacts on the next beat** (look → face → gesture). Cut between them like a conversation.
- **Reaction beat:** look → 0.3 s hold → face change → gesture. Never all at once.
- **Blink** every 3–5 s, plus on emotional beats (0.12 s `blink` face).
- **Hold reveals 1–1.5 s.** Let the viewer recognize the earlier clue in its new context.
- **The one who realizes last** gets the close-up.

### 2.2 The acting toolkit (what the engine can do today)
**Faces** (`ch.face(name)`, swapped on the exact word):
| Face | Use for |
|---|---|
| `smile` | default, confidence, small wins |
| `happy` | big win, celebration (eyes closed, open grin) |
| `surprised` | the reveal hits, "wait, what?" |
| `smirk` | knowing, scheming, "I told you so" |
| `worried` | doubt, the plan is failing |
| `flat` | deadpan, unimpressed |
| `blink` | blink frame, plus comic timing after a dumb idea |

**Body** (`ch.pose({...})`, every value a pure function of time):
| Control | What it does |
|---|---|
| `walk`, `walkAmt` | walk cycle phase (cycles) + strength 0..1. Ease `walkAmt` to stop naturally |
| `look`, `nod`, `tilt` | head turn, nod, tilt (radians). Gaze is the strongest acting tool |
| `lean` | lean forward (interest) or back (shock) |
| `armR / armL: {raise}` | raise an arm, e.g. a fist pump |
| `gesture` + `gw` | blend in a gesture (0→1 over ~0.3 s) |

**Gestures:** `point` · `wave` (animated) · `shrug` · `cross` (arms crossed: skeptic) · `think`
(hand to chin) · `facepalm` · `hips` (hands on hips: impatient, proud) · `tada` (arms out: "behold").

**Recipes:**
| Beat | Acting |
|---|---|
| Confident plan | `smile` + `hips`, small nod |
| Bragging | `happy` + `wave` or `tada` |
| Skeptic watching | `flat` → `smirk`, `cross` |
| Realizing something | `look` toward the clue, hold, `surprised`, `lean` back |
| Plan failing | `worried`, `facepalm` |
| Explaining / pointing at the clue | `point` toward the object, `smirk` |
| "Who, me?" | `shrug` + `flat` |

---

## 3. Camera and editing grammar

The rule: **something changes every 2–3 seconds** (a cut, a camera move, a gesture, an object
arriving). The first frame is already moving. **No fade-ins.**

### 3.1 Shot types
| Shot | How | When |
|---|---|---|
| **Establishing wide, low** | camera at about knee height, horizon around 42%, slow push-in | a new place, the opening question |
| **Tracking walk-in** | character walks toward the camera while it pulls back slightly, then stops | introducing a character or plan |
| **Push-in on reaction** | slow zoom (1.0 → 1.12 over 2–4 s) onto a face | realization, doubt, the clue |
| **Hard cut to close-up** | instant cut on the reveal word | the reveal, the smirk, the punchline |
| **Over-the-shoulder two-shot** | a foreground head or shoulder at the frame edge, the other character facing camera | confrontations, the observer |
| **Insert / prop** | a prop fills the frame (gauge, receipt, $40 pump) | numbers, evidence |
| **Diagram plate** | a cutaway or diagram plate with props animating on it | the mechanism (tracking one object) |

### 3.2 Moves on painted plates
- **Zoom (push-in or pull-back) and pan only.** These keep the 3D characters' feet planted on the
  painting, because the engine crops the plate and the 3D view together.
- **No dolly through a painting.** Real camera travel only happens in full-3D scenes.
- Push-ins: ease in and out, 2–4 s, about 6–14% zoom. Pans: small, eased, to follow action or reveal a clue.
- **Cut, don't dissolve.** Cut on the beat word. A flash plus shake (2–4 frames) sells a BOOM.

### 3.3 Lighting the cast to the painting
Every plate gets a preset: horizon height, eye height, field of view, and **light direction and color
matched to the painting**:
- **Day / golden hour:** warm key from the painted sun side, lavender sky fill, warm bounce,
  shadows tinted purple.
- **Night:** cool moon key, warm point lights at the painted lamps, blue fill.
- **Interior:** key from the painted window or door.

Characters always get a soft front fill so faces read, plus contact shadows on the painted ground.

### 3.4 Captions
One word at a time, white heavy sans with a thick black outline, centered at about y 1270 of 1920.
Gold = key term or win, red = loss or danger. Nothing else ever sits in the caption band. Keep
faces and props out of the top 140 px and the bottom 380 px (app UI).

---

## 4. The world: 2D paintings from ChatGPT

**Recurring objects must look identical in every image** (Brian's note, electric-car video: "the car changes every time"). Lock them: exact visual description in the START block, first image defines it, later prompts reference that file by name ("the exact car from 01_…, do not redesign it"), and if needed Brian attaches the first image as a reference. See prompt-pack "Lock recurring objects".

Full prompt pack: `docs/prompt-pack.md`. The essentials:

**The rules** for every image:
- Portrait 2:3 (1024×1536).
- **No people.**
- A clear, flat floor in the lower-middle where characters can stand.
- State the light direction.
- Horizon about 45% from the top for wide shots.
- No text unless the exact words are given.
- Props on solid **#00FF00** green.

**Style bible.** Paste this first in a fresh ChatGPT chat for each video, then make every image in that chat:
```
You are the background artist for a vertical animated explainer series. For every image I ask for, follow this style bible exactly:

STYLE: flat 2D storybook illustration for a modern animated show. Clean, simple shapes with soft painterly gradients, subtle paper grain, bold readable silhouettes, slightly exaggerated cartoon proportions (chunky buildings, rounded trees, oversized props). No outlines on the background, or very thin darker outlines only.
COLOR & LIGHT: rich, saturated but harmonious colors. Always a clear light direction: warm light on lit sides, cool blue or purple in shadows. Gentle atmospheric haze that makes distant things lighter and bluer. Dark scenes are deep blue, never pure black.
COMPOSITION: portrait 2:3. Leave the lower-middle of the frame as an open, flat floor or ground where characters can stand. Keep the top 10% simple (sky, ceiling). Strong depth: something in the foreground, the main subject in the middle, a background far away.
STRICT: no people, no characters, no animals unless asked, no faces, no hands. No text, letters or logos unless I specify exact words.
Reply only with the image.
```

**Per long-form video (8+ min):** about 12–18 locations × 2–3 angles (≈ 30–45 backgrounds),
plus 1–3 diagram plates, plus 20–30 props (including evidence props: receipts, texts, mugshot-style
cards, headlines, and "imagined" gag props). **Per short video:** ≈ 7–12 backgrounds plus 6–10 props.
**Images are always made by Brian in ChatGPT.** For big sets, Claude writes one batch file per video,
`videos/<slug>/art-prompts.md` (template in `docs/prompt-pack.md` → "Batch file"). Brian pastes it into one
ChatGPT chat and generates the images in order, in batches.

### 4.1 No OpenArt (Brian, 2026-11-19)
**Don't use OpenArt or any AI video generator.** Brian supplies the images (ChatGPT) and the voice; Claude animates
everything in the engine: plate push-ins and pans, prop pops and slides, counters and labels, cast acting.
Shots the engine can't do literally (crowds, water, crashes) are shown with a painting + camera move + a prop or a
big number instead. Only generate with OpenArt if Brian explicitly asks for it in that video.

Prompt templates in the prompt pack: WIDE · MEDIUM · LOW ANGLE · INTERIOR ·
TABLETOP · DIAGRAM/CUTAWAY · PROP · PROP WITH EXACT TEXT · FOREGROUND LAYER · CHANGE THE MOOD
(night, storm, abandoned).

**Tricks that worked:**
- **Vehicles as props with empty, green window openings**, so the 3D character's head shows through.
- **Paint a big object into the plate** when characters interact with it (the car and hose in the
  driveway). Use a cut-out prop when it has to move.
- **Diagram plates leave the moving parts out** (an empty cylinder). The parts come as props and the engine animates them.
- **The same chat, "same image but at night"** gives a mood change with the exact same layout.

File names: `<place>_<angle>_<time>.png` and `prop_<thing>.png`, into `videos/<slug>/art/`.

---

## 5. Shot list format (what Claude hands Brian per video)

`videos/<slug>/shotlist.md` contains:
1. **Cast** for this video (from section 2).
2. **Background prompts**, numbered and named, ready to paste.
3. **Prop prompts** on green.
4. **Shot plan table**, one row per cue:

| Cue | Picture (plate + props) | Camera | Characters (face · pose · gesture) |
|---|---|---|---|
| q | gas station wide | low, slow push-in to the puddle | Doug `flat`, `tilt` .15, staring at the puddle |

---

## 6. Quality checklists

**Script**
- [ ] Payoff written first; the question word matches it
- [ ] Subject on screen during the question; action starts in sentence two
- [ ] A choice, apparent success, a clue seen before it's explained, an observer, a consequence
- [ ] The narrator bets early and changes their mind
- [ ] Zero-knowledge pass (§1.6a): the basics set up first; every term, name and number explained in plain words;
      each term keeps the same name after it's defined (no synonyms, no sneaky new terms)
- [ ] The mechanism told as an if-then example; the surprise said out loud; every number has a yardstick and a cause
- [ ] No side bets between characters; the last line mirrors a line from the middle
- [ ] A simile or joke about every 10 s; a specific number or two; an everyday analogy for the mechanism
- [ ] Short: 175–190 story words + CTA, final 1:05–1:10 (≥ 1:02); every claim sourced; fiction labeled
- [ ] Dry last line, then the follow CTA

**Images**
- [ ] All from one ChatGPT chat with the style bible; portrait; no people
- [ ] Open floor where characters stand; light direction consistent per location
- [ ] Props on clean green; exact text only where requested

**Preview (before the full render)**
- [ ] Feet on the ground, shadows matching the painting's direction
- [ ] Faces readable (front fill), the caption band clear, nothing in the top 140 / bottom 380 px
- [ ] Something changes every 2–3 s; reveals held 1–1.5 s
- [ ] The clue is visible before the narrator mentions it

---

## 6b. Posting kit (every video)
- **Cover:** `node tools/cover.js <slug> <seconds> "LINE 1|LINE 2|LINE 3"` grabs a real frame (no captions, no follow
  button) and adds the headline (line 1 white, the rest gold, thick outline, top quarter). **The cover always shows the
  character** (Brian's rule): pick a moment with the cast on screen and a big, readable reaction (`surprised`, `worried`,
  `shrug`), next to the subject (the empty hood, the dead bulb).
- **Caption:** `post.md` with a TikTok/Reels caption (a curiosity line + the payoff in a few words + one Doug joke,
  6–7 hashtags) and a YouTube Shorts title (≤ 100 chars, ends with #shorts).

## 7. Topic bank (any subject works; pick ones with a hidden mechanism or a twist)

| Topic | Question | Shape | Who gets it wrong / who notices |
|---|---|---|---|
| Why a car needs gas ✅ example | How the heck does a puddle of gas move a two-ton car? | mechanism | Doug fills up with water / Gary watches the tailpipe |
| Why planes dump fuel | Why the heck would a pilot pour fuel into the sky? | mechanism | Passenger panics at the "leak" / pilot knows the landing-weight limit |
| How credit card points are paid for | Who the heck pays for your free flight? | repeated scheme | Doug brags about free trips / a cashier notices the price |
| Why casinos have no clocks | What the heck happened to the time? | mechanism | Doug "just one more hand" / the waitress who's seen it a thousand times |
| How a microwave heats food | How the heck does a box with no fire cook a burrito? | mechanism | Doug thinks it heats from the outside / track one water molecule |
| Why airlines overbook | Why the heck would they sell 110 seats for 100? | repeated scheme | the gate agent sees the same no-shows every week |
| The Titanic's "unsinkable" claim | When the heck did "unsinkable" become a problem? | known disaster | rewind to the confident early voyage |
| How vaccines train the immune system | How the heck does a fake intruder protect you? | mechanism | track one "wanted poster" through the body |

---

## 8. Engine reference (for Claude)

- `engine/characters.js`: `CHAR.make({outfit, envMap})` → `ch.root`, `ch.face(name)`, `ch.pose({...})`.
- `engine/lab/plate-lab.html`: plate compositing.
  - `usePlate(name, zoom, panX, panY)` matches the 3D camera to a painting through `setViewOffset`.
  - Plate presets hold `hz` (horizon fraction), `vx` (vanishing x), `fov0`, `camH`, and a light preset.
  - Uses a shadow catcher plus blob shadows.
  - Colors must be converted sRGB → linear.
- `node engine/lab/render-lab.js <out> --page plate-lab.html [--clip]`: stills or a 30 fps test clip.
- **Caption timing for a voice made outside the API** (ElevenLabs web/OpenArt): `node tools/align.js <slug>` matches
  pauses to punctuation with dynamic programming (good to roughly 0.1–0.2 s). For exact word timing, either set
  `ELEVENLABS_API_KEY` (tts.js) or allow installing Whisper (`faster-whisper`, model from huggingface.co).
- **Green-screen props:** key with `colorkey=0x00FF00:0.22:0.06` (ffmpeg) or the same distance-to-pure-green
  in a shader. **No despill:** it turns teal/green props blue. Tested clean on `gas-vs-water/P01_car_side.png`.
- **Green subjects (cash, bills, leaves):** the key eats them. Run `python3 tools/cutout.py videos/<slug>/art/<file>.png` → `<file>.cut.png` (only green touching the border is removed) and point `SC.props` at the `.cut.png`; the kit skips keying for `*.cut.png`.
- Chromium needs `--allow-file-access-from-files` to load plates.
- **Status:** the plate and cast system lives in the lab pages. The production pipeline
  (`kit.js`/`stage.html`/`render.js`) still drives the old gold-noir look. Wiring plates, cast and
  gestures into `scene.js` + `render.js` is the next build step, done with the first real video
  (`why-cars-need-gas`).
