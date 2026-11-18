# The Playbook: how we make every video

One format, any topic. **One narrator's voice. A flat illustrated 2D world. Silent 3D sphere-head
characters. Camera that never sits still. Captions one word at a time.**
**Two lengths, one format:** **long form 8+ minutes** and **short form ≈ 1:30**. **No default:** if Brian didn't
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
| 5b | *(Optional)* AI video inserts in **OpenArt** for shots the engine can't do well (§4.1) | Claude (pre-approved; report credits) | 5–10 s clips → `videos/<slug>/clips/` |
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
| reason or motive | **Why the f\*ck** | Why the f\*ck do pilots dump fuel before landing? |
| identity | **Who the f\*ck** | Who the f\*ck opened the door? (answer: the guard) |
| decisive moment | **When the f\*ck** | When the f\*ck did the Titanic actually become unsinkable? |
| object or event | **What the f\*ck** | What the f\*ck is the white stuff in a bird's poop? |
| process or sequence | **How the f\*ck** | How the f\*ck does a puddle of gasoline move a two-ton car? |

- **Show the subject during the question** (the puddle, the door, the plane).
- **Start the action in sentence two:** "Doug decided to find out by never buying it again."
- *Clean version:* "How the heck / How on earth." Captions display "f\*ck" either way. Note that
  YouTube may limit ads on strong profanity in the opening seconds. Choose per platform.

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

- **"How does X work" topics: the mechanism IS the video.** Explain it in plain numbered steps ("Step one: the switch.
  Step two: the loop. Step three: the bulb."). Build the story around **a broken or misused version of the thing**,
  so the clue is a failure in one of those steps (the snapped filament is the gap in the loop). No side trivia
  (speeds, records, history) unless it IS the answer. Keep it simple: the light-switch race story was rejected
  for this; see `videos/light-switch/script.txt` (mechanism-first rewrite) vs `script-short-v1.txt` (rejected).

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
| **Short** | ~1:30 | 290–310 (~200–215 wpm) | Same format compressed (§1.11): one chain of events, one "until" flip, one callback |

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
- Budget: about **10–15% of the words** go to setup and definitions (≈ 30–45 words in a short, ~150–200 in long form).
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
| 0:00–0:10 | **Coon question + cold open** | "What the f\*ck happened to…?" + the outcome in one line ("…is about to lose everything over a pack of nuts") |
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

### 1.11 Short form (≈ 1:30): the same format, compressed
Everything from §1.9–1.10 applies. Just fewer beats:

| Time (of ~1:30) | Beat (long-form equivalent) |
|---|---|
| 0:00–0:03 | **Coon question + cold-open line** ("What the f\*ck…? See, Doug had a problem.") |
| 0:03–0:10 | **Character card in one sentence** (name + the trait that causes everything) + **one plain line of ground** so a newcomer knows what the thing is (§1.6a) |
| 0:10–0:35 | **"So one day…" + the plan in 2–3 steps** (track the object) |
| 0:35–0:50 | **Apparent success + one number**, and the narrator's bet ("Honestly? I'd have bet on Doug.") |
| 0:50–1:00 | **The observer notices the clue** (planted earlier, visible before it's explained) |
| 1:00–1:15 | **One "until" flip + the mechanism/reveal** (callback to the plant) |
| 1:15–1:30 | **"Bam," the consequence + a deadpan last line**, then the follow CTA (§1.12) |

Xevi's personality stays, scaled down:
- 1–2 performed dialogue exchanges, not 10.
- One running-gag word.
- One aside to the viewer.
- One euphemism or two.

Shots: ≈ 30–35 cuts, 7–12 backgrounds, 6–10 props (one ChatGPT batch file).
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

Use **only the characters the story needs** (usually 2–3). New outfits are added in `OUTFITS` when a
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

### 4.1 OpenArt video inserts (only when they look better or we need them)
Brian has pre-approved OpenArt **video** credits. Use them sparingly, for shots the engine can't sell:
- water, fire, smoke and explosions at scale
- crowds and stampedes
- vehicles crashing or flipping
- transformations and anything that needs real physics or complex motion

Rules:
- **Start from Brian's ChatGPT painting** (image-to-video), so the style matches. Prompt only camera and
  motion ("slow push-in, the wave rises and curls, rain"). **Keep our cast out of AI clips.** Characters
  stay in the engine so they stay consistent and silent.
- **5–10 s per clip**, used as a cut-in. The engine still adds captions, voice and cuts on top.
- **One test clip first**, then the rest. Pick the cheapest model that looks right (e.g. PixVerse V6
  ≈ 50, Wan 3.0 ≈ 100, Veo 3.1 ≈ 120 credits per clip). Check `openart_model_cost` before each run.
- **Budget:** about 3–8 inserts per long video (≈ 300–1,000 credits). Tell Brian the credits spent after each batch.
- Mark them in the shot plan as `OPENART:` with the source image and motion prompt. Templates in the prompt pack: WIDE · MEDIUM · LOW ANGLE · INTERIOR ·
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
- [ ] 290–310 words (short); every claim sourced; fiction labeled
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

## 7. Topic bank (any subject works; pick ones with a hidden mechanism or a twist)

| Topic | Question | Shape | Who gets it wrong / who notices |
|---|---|---|---|
| Why a car needs gas ✅ example | How the f\*ck does a puddle of gas move a two-ton car? | mechanism | Doug fills up with water / Gary watches the tailpipe |
| Why planes dump fuel | Why the f\*ck would a pilot pour fuel into the sky? | mechanism | Passenger panics at the "leak" / pilot knows the landing-weight limit |
| How credit card points are paid for | Who the f\*ck pays for your free flight? | repeated scheme | Doug brags about free trips / a cashier notices the price |
| Why casinos have no clocks | What the f\*ck happened to the time? | mechanism | Doug "just one more hand" / the waitress who's seen it a thousand times |
| How a microwave heats food | How the f\*ck does a box with no fire cook a burrito? | mechanism | Doug thinks it heats from the outside / track one water molecule |
| Why airlines overbook | Why the f\*ck would they sell 110 seats for 100? | repeated scheme | the gate agent sees the same no-shows every week |
| The Titanic's "unsinkable" claim | When the f\*ck did "unsinkable" become a problem? | known disaster | rewind to the confident early voyage |
| How vaccines train the immune system | How the f\*ck does a fake intruder protect you? | mechanism | track one "wanted poster" through the body |

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
