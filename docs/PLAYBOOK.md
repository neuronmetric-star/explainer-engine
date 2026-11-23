# The Playbook: how we make every video

One format, any topic. **One narrator's voice. A flat illustrated 2D world. Silent 3D sphere-head
characters. Camera that never sits still. Captions one word at a time.**
**Every video is short form, ≈ 1:05–1:12** (just over TikTok's 1-minute payout line; §1.11). **Brian's rule (Nov 21 2026):
long form is retired, so never ask about length.** Same story method, Ray's skeleton and Xevi's narrator personality, compressed.
The long-form notes below (§1.9, art counts) stay only as background for how the short form was built.

What it's built from:
- **Story:** the Coon Knows storytelling guide ("write the question from the answer").
- **Pacing and line craft:** our study of @RicksClips3000's 20 most recent Shorts (`docs/ricksclips/study.md`).
- **Long-form structure and narrator personality:** Ray (@realraywilliam) and Xevi (@xeviuniverse) (`docs/creators/ray-xevi-study.md`).
- **Look:** your ChatGPT paintings, art standard v2 since Nov 22 2026 (§4, `docs/prompt-pack.md`) plus the 3D cast in `engine/characters.js`.
- **Camera and compositing:** the plate lab (`engine/lab/plate-lab.html`).
- **Worked example:** `videos/why-cars-need-gas/`.

---

## 0. The whole pipeline on one screen

| # | Step | Who | Output |
|---|---|---|---|
| 0 | Morning trend scrape (§6c): what people search and what's going viral in our lanes | Claude | `docs/trends/<date>.md` (topics + search phrases + stitch picks) |
| 1 | Pick the topic **from the trend sheet**, find the **payoff** and the **search phrase** | Claude (Brian approves topic) | one sentence: what the viewer will discover + the exact phrase people type |
| 2 | Research, every claim sourced | Claude | `videos/<slug>/sources.md` |
| 3 | Script (section 1) | Claude → **Brian approves** | `script.txt` + narration in one copyable block |
| 4 | Shot list + image prompts (section 4) | Claude | `shotlist.md` |
| 5 | Paint the worlds and props in **ChatGPT, always** (Brian), from the batch prompt file `videos/<slug>/art-prompts.md` (**art standard v2**, §4: rich, descriptive prompts) | Brian | short ≈ 6–8 backgrounds + 6–10 props → `videos/<slug>/art/` |
| 5b | *(Optional)* AI video inserts in **OpenArt** for shots the engine can't do well (§4.1) | Claude (pre-approved; report credits) | 5–10 s clips → `videos/<slug>/clips/` |
| 6 | Voiceover (ElevenLabs/OpenArt, or `tools/tts.js` with a key) | Brian / Claude | `voice.mp3` → `node tools/align.js <slug>` |
| 7 | Build the scene: plates, cast, acting, camera (sections 2–3) | Claude | `scene.js` |
| 8 | Preview stills, fix, repeat | Claude | `preview.jpg`, sent to Brian |
| 8b | Sound effects: `videos/<slug>/sfx-cues.js` → `node tools/sfx.js <slug>` → `sfx.wav` (synthesized: whoosh, step, servo, beep, tap, pop, click, plane, hum, clunk) | Claude | mixed under the voice by `render.js` |
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
- **Always "the heck", never "the f\*ck"** (Brian's rule, Nov 2026): spoken and captioned as "heck", so the opening
  seconds stay ad-safe on TikTok, Reels and YouTube. Coon's punchy rhythm stays; only the word changes.
  Older scripts (gas-vs-water etc.) still say "f\*ck"; don't copy that. **Captions too:** the Nov 13–15 posts
  said "Why the f\*ck…" in the TikTok caption. Never again.
- **The question uses the words people search** (§6c): take the topic's search phrase from the morning trend
  sheet (`docs/trends/`) and build the question around it. Search "why is thanksgiving on a thursday" →
  "Why the heck is Thanksgiving on a Thursday?" Keep the keywords (Thanksgiving, Thursday) word for word;
  "the heck" can sit between them. TikTok transcribes the voice, so the first spoken sentence is a search signal.

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

### 1.7a The build-break-fix chain (for "how does X work" explainers; from the storm-drain study, Nov 23 2026)
When the answer is a **system that exists because simpler versions failed** (drains, windows, toilets, fridges), build it
in front of the viewer. Study: `docs/creators/storm-drain-study-2026-11-23.md` (10.9M plays).
- **Doug builds the simplest version → it breaks in a way you can SEE (fog, flood, fountain) → the fix → it breaks again.**
  2–3 rounds in a short. The breaks are our clue: the part that behaves unexpectedly (§1.2).
- **"But… So…" rhythm**: "But then a storm hits." / "So Doug adds a tank." A new twist every 10–12 s.
- **Show it, then name it** ("This is a catch basin"), and use that name every time after (§1.6a).
- **One silly everyday object** the eye can follow through the system (the tennis ball).
- **The reveal is something everyone has seen** (the manhole, the window hole), and the **last line echoes the first**.
- Still our format: "Why the heck…" hook on the search phrase, the narrator's bet, the helicopter, the CTA.
  Example: `videos/airplane-window-hole/`.

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
| **Hook** | 0:00–0:05 | Coon question **built on the search phrase** (§6c), subject on screen, the phrase as on-screen text + "See, Doug had a problem." in one line |
| **Middle** | 0:05–0:50 | One plain line of ground (what the thing is) → the wrong belief or choice → plant the clue on screen → the narrator's bet → the mechanism explained **inside the story**, cause → effect (never "Step one…" or "three steps") |
| **End** | 0:50–1:05 | The clue pays off ("So, the rattle.") → one consequence → a deadpan last line that mirrors a middle line → the follow CTA (§1.12) |

Personality, scaled down: one performed line per character, one aside ("I'mma tell you"), one running gag,
a joke or simile about every 10 s.
**Cut first:** second examples, extra numbers, side trivia, extra characters. **Never cut:** the ground line,
the definitions, the steps, the clue, the mirror line.
**Tightening (Brian's raw voice → `voice.mp3`, keep the original as `voice_raw.mp3`):**
`ffmpeg -i voice_raw.mp3 -af "silenceremove=start_periods=1:start_threshold=-40dB:stop_periods=-1:stop_duration=0.25:stop_threshold=-40dB:stop_silence=0.16,atempo=1.2" -q:a 2 voice.mp3`
(pauses over 0.25 s cut to 0.16 s, then 1.2× speed; dollar-a-second: 1:32 raw → 1:11).
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

### 1.12a The helicopter ending (EVERY video, no matter the topic; Brian's rule, Nov 21 2026)
Our series signature, from the Lamborghini video: Victor finally gets his dream car, a helicopter flies over, and he
wants that instead. **Every video ends with that same helicopter flying across the sky.** Whoever "won" the story looks
up at it: he finally has the thing, and there's already a next thing. Viewers learn to wait for it.

- **When:** it enters on the **last story line** (the mirror line), crosses in ≈ 3.4 s, and is finishing its pass as the
  **+ FOLLOW** button pops (a short overlap is fine: it stays up top). It never replaces the CTA; it hands off to it.
- **Where:** left → right across the **top third** (screen y ≈ 220–380), above the heads, clear of the follow button
  (y ≈ 560–660) and the caption band (y ≈ 1270).
- **Acting:** the winner tips his head up (`nod` ≈ −.35) and his face drops to `flat` (or `worried`) while it passes,
  then back to the CTA gesture. Anyone else in the shot can glance up too. Nobody waves at it.
- **The last background always shows open sky in its top third**, so the helicopter has somewhere to fly. If the story
  ends indoors, end on a window with sky, or cut to an outdoor shot for the last line. Write that into the shot list.
- **Words:** none needed; it's a picture joke and costs no length. (In a lesson chain the helicopter is already in the
  story, so it simply flies over again at the end.)
- **Always the same helicopter:** white with a navy-blue stripe, the one from the Lamborghini video's OpenArt clip
  (`docs/assets/H00_helicopter_clip_openart.mp4`). The sprite `docs/assets/H01_helicopter.png` is painted once to match it
  and copied into every video's `art/`.
  Register it as `H01: 'H01_helicopter.png'` in `SCENE.props` and call **`K.helicopter(t, '<last cue>')`**
  (`engine/plate-kit.js`), which draws the same flight path every time and returns its progress (0..1) for the look-up.
- **Sound:** `{ at: '<last cue>', sfx: 'helicopter', gain: .6 }` in `sfx-cues.js` (rotor whup-whup, swells and fades).
- **Prompt (only if the asset is ever lost; attach `docs/assets/H00_helicopter_reference.png` in ChatGPT):**
  `H01_helicopter.png: A sleek private helicopter in flight, seen exactly from the side, facing RIGHT, nose tipped slightly down as if cruising forward: exactly the helicopter in the attached reference image: glossy WHITE body with a navy-blue swoosh stripe along the side, big dark tinted windows (no people visible), black landing skids, a slim tail boom ending in a round enclosed tail fan with a navy accent. The main rotor on top drawn as a long, thin, slightly blurred horizontal streak. Flat 2D storybook style with soft painterly gradients, warm light from the left. Centered on a solid pure green #00FF00 background, no shadow, no text, no logos.`

### 1.13 Script modes: write the script the topic deserves
Every video uses one of three modes. **Pick the mode from the topic before writing a word**, tell Brian
which mode and why in one line, then follow that mode's template every time. Same narrator, cast, captions,
camera and CTA in all three; only the story engine changes.

| The topic is… | Mode | Engine | Example |
|---|---|---|---|
| how a thing works, where the money goes, a process | **Explainer** (§1.1–1.7, §1.11) | a broken or surprising version of the thing; track one object; mechanism inside the story | how an electric car runs, gas vs water |
| a true event, scheme, person or disaster | **True story** (§1.9 long, §1.11 short) | choice → apparent success → someone notices → consequence | robot dogs in Haiti, Harvard dropouts |
| human behavior, a feeling, a habit, a life truth ("why do people…") | **Lesson chain** (below) | a chain of people, linked by one repeated line, that ends on a flip | why people want what others have |

| a viral meme, sound or joke everyone's repeating this week, paired with a real topic | **Trend ride** (below; **the daily default**) | Doug and Gary act out the trend, then the real story explains why it's funny or true | "he wanna pay full price" → why stores need Black Friday deals (`videos/full-price/`) |

If a topic could fit two modes, pick the one whose ending hits harder, and say so to Brian.
**Daily default (Brian, Nov 22 2026):** every day's main video is a **Trend ride** when the morning sheet has a usable
meme × topic pair (§6c); otherwise use the mode the topic deserves.

#### Lesson chain (Brian's template, Nov 2026)
Short form only for now (≈ 1:05–1:15). Reference script: "Why the heck do people want what others have?"
(`docs/scripts/lesson-chain-reference.txt`). Follow these beats in order:

| # | Beat | Line pattern | From the reference |
|---|---|---|---|
| 1 | **Hook** | "Why the heck do people ___?" (a behavior everybody does) | "Why the heck do people want what others have?" |
| 2 | **Problem with irony** | "See, [cast] had a problem." He finally has the thing, and it still isn't enough | worked hard for his dream Lamborghini… stuck at a red light |
| 3 | **First wish** | something passes by; he looks and thinks the **wish line** | helicopter overhead: "Man, I wish I had that." |
| 4 | **Dry aside** | one short narrator joke | "No red lights up there." |
| 5 | **The chain (3 links)** | the **refrain** + the next person, who wants what the last one has: "But what he doesn't know is that [person] is thinking, '[wish line]'" | G-Wagon guy → regular-car guy → Doug on foot |
| 6 | **Fake ending** | the narrator thinks it's over | "Honestly? I thought it ended with Doug." |
| 7 | **Mirror line** | how the hero used to picture this exact moment vs. what he pictures now | "used to picture himself behind the wheel… now picturing himself in the helicopter" |
| 8 | **Breather** | one plain action beat, short sentences | "The light turns green. The cars pull away." |
| 9 | **The flip (last link)** | the refrain one last time, landing on someone whose wish is something the last person **never even noticed he had** | "But what Doug doesn't know is that a man in a wheelchair… 'I wish I could walk again.'" |
| 10 | **Moral** | one plain sentence, no jargon | "…we forget to appreciate what we already have." |
| 11 | **Comment question** | a personal question to the viewer | "What's one thing you have today that you used to wish for?" |
| 12 | **Follow CTA** | §1.12 | "Still here? …" |

**Rules for lesson chains (keep them consistent):**
- **The refrain is always "But what [he / name] doesn't know is that…"**, word for word. It's the signature;
  never swap in "Meanwhile" or a synonym.
- **One wish line** ("Man, I wish I had that ___"), repeated with only the object changed. The flip link is
  the one place it changes ("I wish I could walk again"), and that change is the punch.
- **The chain moves in one direction** (down the money ladder, down the age ladder, etc.), so each link is
  more ordinary than the last, until the flip jumps to something basic the viewer has right now (walking,
  health, time, family, a home).
- **Three links before the fake ending, one after.** Every link is a new character and a new shot.
- The flip person is shown **with dignity**: calm, watching, never pitiful. The lesson is about what the
  previous character didn't notice, not about feeling sorry for anyone.
- **No numbers, no stats, no research needed.** Plain everyday words. Add `sources.md` only if the script
  states a fact.
- The narrator still has personality: one dry aside, one "Honestly?", the fake ending. No euphemism
  dictionary, and no performed back-and-forth: the characters only *think*.
- **Every line is one picture, and every line break is a cut.** Thinking = the character looks at the
  next thing up the chain, then a push-in on a clear face (`worried`/`flat` while wishing, `smile` only for
  the flip person). The camera passes from one link to the next (whip-pan or tracking move along the
  street), so the chain feels like one continuous place.
- **Length:** ≈ 190–215 words through the comment question, + CTA. Delivered slower than an explainer
  (a beat after every refrain), so check the final is 1:02–1:15.
- The last story line is the moral (not a deadpan joke). The mirror line (#7) still echoes the hook.

**Topic bank for lesson chains:** why people want what others have · why we never feel rich enough · why
we wait until tomorrow · why we care what strangers think · why we stay up scrolling · why we judge people
fast · why we miss the "boring" days.

#### Trend ride (Brian's format, Nov 22 2026; worked example `videos/full-price/`)
Character-led, conversational edutainment: a short-form script that **borrows a viral trend's joke and sound** and
uses it as the doorway into a real, sourced explanation. Ride the trend; teach the topic.

**Understand the meme before you write a word (Brian, Nov 22 2026: "research the trend and understand it before finishing
the script").** Find the original post and creator (Know Your Meme / a meme explainer + the earliest copy), pull 2 transcripts
(the original and the most-viewed copy), and write down in the sheet: the exact original line, what the catchphrase *means*
and how people use it (e.g. "huss" = the hard-breathing sound of grinding, not a dance), who the joke is about, and how the
copies twist it. Never guess a meaning from the word alone (the first "huss" draft made it a dance and had to be rewritten).

**The pairing (picked in the morning scrape, §6c).** A trend is worth riding when (a) it's blowing up *this week*
(rising plays on many creators' copies, a sound with thousands of uses), (b) its catchphrase can be said in our
story without explaining the meme, and (c) it **bridges** to a topic in our lanes (money, history, how things work,
myths, true stories) through the *same idea*, not just the same words. Write the bridge as one sentence:
"He wanna pay full price" (a guy excited to pay full price) → "why stores need Black Friday deals" (nobody wants
full price; they want to *feel* they didn't pay it). No bridge, no ride.

**Beats (≈ 1:05–1:13; ≈ 150–175 story words if a real sound clip plays, 175–190 if the narrator performs it):**
| # | Beat | What happens | full-price example |
|---|---|---|---|
| 1 | **Curiosity hook** (0–3 s) | "Why the heck…" question built on the topic's search phrase; the trend's catchphrase as on-screen text from frame 1 | "Why the heck do stores even need Black Friday deals?" + `HE WANNA PAY FULL PRICE` |
| 2 | **Doug and Gary set the scene** | One line of ground: who, where, what's at stake. Gary is the sales guy / the one in the know, Doug the everyman | Doug's buying a TV marked $599 → $299; Gary slides over a payment plan |
| 3 | **The trend, acted out** (≤ 16 s) | Doug and Gary perform the meme: the **real trending sound** spliced in (rules below) or the narrator performs the lines. Mouths stay still; they gesture on their lines and **dance/celebrate on the catchphrase** | SNL clip: "I'll just pay full price" → "scenario of the best case" → both dance on "He wanna pay full price!" |
| 4 | **The turn** | The narrator (back) says the surprise out loud and plants the clue on screen | "Weird. Doug just got half off. Right?" → he peels the sticker: $299 underneath |
| 5 | **The real story / facts, plain words** | The sourced explanation, told as a true story or mechanism: names, a date, one or two numbers with yardsticks | JCPenney 2012 drops all sales → sales fall a quarter, $4 billion → boss fired → sales come back |
| 6 | **The surprising takeaway** | One sentence that reframes the meme: why the joke is secretly true | "Your brain judges a price by the first number it sees." |
| 7 | **Mirror line + helicopter** | The catchphrase comes back, twisted by what we learned; the helicopter crosses (§1.12a) | "He wanna pay full price. He just doesn't wanna know it." |
| 8 | **Viewer question** | One short question on screen and spoken, easy to answer in a word, to pull comments | "Would you shop at a store with no sales?" |
| 9 | **Follow CTA** (§1.12) | Rotate A–E | C |

**Rules for the trend part**
- **The sound:** get the most-used copy of the trending clip (Scrape Creators `v2_tiktok_video` with `download_media:true`,
  ≈ 11 credits; the file host is in the environment's allow-list), cut **≤ 16 s** around the catchphrase, match its
  loudness to the narration (≈ −5 dB), splice it into `voice.mp3` (narration before + clip + narration after), and put
  its words in `script.txt` as spoken lines under a comment (`# --- TRENDING SOUND …`) so captions show them. Build the
  word timings for the clip from its transcript (`v1_tiktok_video_transcript`). Note the mute risk in `post.md`
  (fallback: add the sound from TikTok's library). Credit the original in `sources.md`.
- **Never imitate accents or mock a group**, even if the original sketch does; the narrator performs lines in his own voice.
- **Doug and Gary carry it:** they *are* the meme's two people (re-cast by role, not by look). The rest of the cast can
  appear in the story part (Victor as the boss, the polo guy as a coworker).
- **The joke never replaces the facts:** the story part is researched and sourced like any video (§1.6a zero-knowledge rules).
- **Timing:** a trend dies in ~7–10 days. Script the same day the sheet flags it; post within 48 h.

### 1.8 Script markup (`script.txt`)
`*word` gold · `!word` red · `{shown|spoken}` e.g. `{*$40|forty bucks}` · `[#cue]` sync point before
every picture change · `#` comment lines. Write numbers as words in the spoken part.

---

## 2. The cast: silent 3D characters

**Look (cast v2, Nov 22 2026):** matte warm-white porcelain sphere head with a big drawn face (oval eyes with a catchlight,
arched brows) sitting right on the collar (no neck), big round white mitt hands (Brian, Nov 22 2026: smooth mitten + thumb bump like the v1 cast, never separate
fingers; a single finger appears only to point), real
clothes with collars, cuffs, pockets, seams and laced shoes. Built in code (`engine/characters.js`). No model files,
renders exactly the same every time. **Look target:** Brian's reference sheets in `docs/characters/` (`*_ref.png`);
our renders of the same sheets sit next to them (`*_engine.jpg`, made with `engine/lab/cast-sheet.html`). Any change
to the cast gets checked against those sheets.

| Character | Outfit (`CHAR.make({outfit})`) | Typical role |
|---|---|---|
| **Doug** | `hoodie`: mustard hoodie, jeans, white sneakers | the confident everyman who gets it wrong |
| **Gary** | `oxford`: blue oxford, glasses, khakis, brown shoes | the observer, neighbor, expert, the one who notices |
| **Victor** | `suit`: navy suit, red tie, gold watch (stocky) | the rich guy, boss, schemer, official |
| **Polo guy** | `polo`: olive polo, khakis, gray sneakers, watch | the worker: tow driver, cashier, guard, mechanic |
| **The President** | `president`: black bomber over a white tee, backwards black cap, blue-white-blue sash; `phone: true` puts a phone in his hand | a head of state (first used for El Salvador's president, `robot-dogs-haiti`). Real people: silent, and only shown doing what they actually did |
| **Gang member** | `gang`: dark hoodie, black jeans, beanie, bandana over nose and mouth (eyes visible); vary with `{shirt, mask}` | street crew / gang (`robot-dogs-haiti`). Never armed, never violent on screen |
| **Robot dog** | `CHAR.robodog({rifle})`: gray four-legged robot, camera head with glowing lenses, optional mounted rifle (never fires) | robots, machines that "go first" (`robot-dogs-haiti`). Walks with a trot gait: `pose({walk, walkAmt, look})` |

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
| `handR` / `handL` | mitt shape: `fist`, `relaxed` (default), `open` (thumb out), `point` (one finger out). Gestures set it; pass one to override |

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

**Characters read big (Brian, Nov 22 2026: "we need to make our characters bigger").** In a wide shot the cast fills at
least ~40% of the frame height; in a medium or two-shot ~55–70%; close-ups crop at the chest, never the head. Get size by
planting them closer to the camera (lower on the painted floor) and lowering the plate's `camH`, then pull the shot's
zoom back so heads stay clear of on-screen text (y ≈ 220–420) and the follow button (y ≈ 560–660).

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

**Art standard v2 (Brian, Nov 22 2026): "our art needs to be more descriptive; it feels basic and plain."** From the
`full-price` video on, every image is a **rich, lived-in, cinematic painting**, not a clean empty room. The old prompts
asked for "a living room with a couch and a whiteboard" and got exactly that: one wall, one hero object, a big bare
floor (see `videos/dollar-a-second/art/04_apartment_whiteboard.png`). The v2 prompts describe every layer, object,
light and detail, so ChatGPT has something to paint. **Short prompts make plain pictures.**

**What "rich" means (every background):**
1. **Three depth layers plus air.** A foreground element cropped by the frame edge (a shelf corner, a plant, a counter
   edge, hanging banners), the stage and hero in the middle, deep background (windows, skyline, aisles going back),
   then atmosphere: haze, dust in light shafts, steam, breath fog, glow.
2. **Dense, specific set dressing: 10–15 named objects**, each with a color and material ("chrome shelves stacked
   with boxed blenders in red and teal", never "shelves").
3. **Story details: 2–4 small clues or jokes** that tell the story without words (a tangled extension cord, a
   spilled coffee by the register, a stack of receipts, a lost sneaker in the aisle). One of them can be the clue.
4. **Cinematic light:** a key light (direction + color temperature + time of day), **1–3 practical lights** in the
   scene (neon, lamps, TV glow, fridge light, string lights) with their colors, colored shadows, a rim or bounce,
   light shafts. Glossy floors reflect them.
5. **A named palette per scene (3–5 colors + one accent tied to the story)**, planned as a **color script** across
   the video: e.g. warm gold while the plan works, colder and grayer when it fails, a warm return for the ending.
6. **Materials and texture** on every surface: wood grain, scuffed tile with reflections, brushed metal, fabric
   weave, cardboard, painterly brush texture and paper grain.
7. **Varied camera angles.** Not every background is an eye-level wide: mix in a low hero angle, a high angle, an
   over-the-counter angle and a close detail. Each location gets its own lens feel.

**What stays the same (the engine needs it):** portrait 2:3 · no people, faces, hands or animals · an **open, flat
floor zone** where the cast stands (say where and how wide; keep it clear of clutter, but it can carry reflections,
light pools, scuffs and texture) · light direction stated · horizon about 45% for wides · **no numbers or prices
ever** (the engine draws them) · props on solid #00FF00 · recurring objects locked (below).
**Keep two bands calm:** detail goes around the edges and in the back, not across the **caption band** (≈ 60–72%
of the height, center) and not in the top 7% / bottom 20% (app UI). Calm means simple shapes and low contrast
there, not empty.
**Text, upgraded:** a background may carry **up to 3 short exact words** for realism (store-section signs like
"ELECTRONICS", "CHECKOUT"), always spelled out in quotes in the prompt. Never numbers, prices or brand names.
Anything else written stays blank or uses simple pictogram icons (a TV icon, a shopping-cart icon).

**The v2 prompt recipe** (every background ≈ 120–180 words, in this order; full template in `docs/prompt-pack.md`):
`SHOT` (angle, height, lens feel, horizon %) → `PLACE + MOOD` (where, era, the story beat in one line) → `HERO`
(the one thing the eye lands on and where in frame) → `FOREGROUND` → `MIDGROUND` → `BACKGROUND` → `DRESSING`
(10–15 specific objects) → `STORY DETAILS` (2–4) → `LIGHT` (key + practicals + atmosphere) → `PALETTE` → `TEXTURE`
→ `STAGING` (the open floor zone, calm caption band) → `TEXT` (exact words or none) → `STRICT` (no people…).
**Props v2** (≈ 50–80 words): the object, its **material and wear**, one personality detail (a dent, a coffee ring,
a peeling corner), the angle it's used at in the scene, light from the left with a highlight and a soft shadow **on
the object only**, a thin darker outline so it cuts out cleanly, solid #00FF00 around it.

**Recurring objects must look identical in every image** (Brian's note, electric-car video: "the car changes every
time"). Lock them: exact visual description in the START block, first image defines it, later prompts reference
that file by name ("the exact car from 01_…, do not redesign it"), and if needed Brian attaches the first image as a
reference. See prompt-pack "Lock recurring objects".

Full prompt pack: `docs/prompt-pack.md`. **Style bible v2** (paste first in a fresh ChatGPT chat for each video,
then make every image in that chat; it's also the START block of every batch file):
```
You are the lead background painter for a premium vertical animated series. Every image is a finished, cinematic background painting for a high-end 2D animated film, made for a 9:16 phone screen. Follow this style bible exactly:

STYLE: rich 2D storybook painting with feature-film polish. Appealing, slightly exaggerated cartoon shapes (chunky furniture, oversized props, soft rounded silhouettes), but painted with real depth and detail: layered painterly brushwork, soft gradients, subtle paper grain, crisp edges on the hero object, softer edges in the distance. Every place looks lived-in and specific, never empty or generic: dense, organized set dressing, small storytelling details, believable clutter at the edges.
DEPTH: always three layers plus air: a foreground element cropped by the frame edge, the stage and hero in the middle, a deep background, then atmosphere (haze, dust in light shafts, glow). Distant things get lighter, bluer and softer.
LIGHT: cinematic and motivated. A clear key light from the direction I give, plus practical light sources inside the scene (lamps, neon, screens, windows) with colored glow, warm-cool contrast, colored shadows (blue or purple, never gray or black), rim light on edges, reflections on glossy floors. Night is deep blue, never pure black.
COLOR: a harmonious palette with one strong accent color, as I specify per image.
TEXTURE: every surface has a material: wood grain, scuffed tile, brushed metal, fabric weave, cardboard, glass reflections.
COMPOSITION: portrait 2:3. Leave the open floor zone I describe clear and flat for characters to stand (texture and reflections are fine, objects are not). Keep the band at 60-72% of the height, in the center, calm and low-contrast (captions go there). Keep the top 7% and bottom 20% simple.
STRICT: no people, no characters, no animals, no faces, no hands, no feet, no silhouettes of people. No numbers or prices anywhere. No text, letters or logos unless I give the exact words in quotes; all other signs, screens, labels and stickers stay blank or show simple pictogram icons.

HOW TO WORK: I'll send prompts in numbered batches. Make every image in the batch one after another, in order, portrait 2:3. Above each image write only its file name. Props go on a solid pure green #00FF00 background with no shadow on the background. When a batch is done, say "BATCH DONE".
```

**Quality gate (Claude, every image, on arrival):** Read each image and check: three layers? 10+ specific objects?
practical lights and atmosphere? story details visible? floor zone clear and flat? caption band calm? recurring
objects match? no garbled text, no numbers, no people? If an image is plain or wrong, send Brian a **one-line
fix-up** for the same chat, e.g. `Same image, richer: add [x, y, z], warmer practical lights, more texture on the
floor and walls. Keep the layout, the camera angle and the open floor exactly the same.`
**First batch is the test:** Brian sends batch 1 first; Claude reviews it before the rest are made.

**Per short video:** ≈ 6–8 backgrounds plus 6–10 props (≈ 12–16 images), in batches of 3 (backgrounds; long
prompts) and 4–8 (props). **Images are always made by Brian in ChatGPT.** Claude writes one batch file per
video, `videos/<slug>/art-prompts.md` (template in `docs/prompt-pack.md` → "Batch file"). Brian pastes it into one
ChatGPT chat and generates the images in order, batch by batch. (Long form, retired: about 30–45 backgrounds.)

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
2. **Color script** (one line per location: palette + accent + mood, warm → cold → warm as the story turns; §4 v2).
3. **Background prompts**, numbered and named, written to the v2 recipe (§4) in `art-prompts.md`; the shot list keeps a one-line summary per image.
4. **Prop prompts** on green (v2: material, wear, one personality detail).
5. **Shot plan table**, one row per cue. The last story row always includes **the helicopter ending** (§1.12a), and
   the last background's prompt asks for open sky in the top third.

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
- [ ] All from one ChatGPT chat with the **v2** style bible (§4); portrait; no people; no numbers
- [ ] **Rich, not plain (v2):** three depth layers + atmosphere, 10–15 specific objects, 2–4 story details,
      practical lights, a named palette that follows the color script, texture on every surface, varied angles
- [ ] Open floor zone clear where characters stand; caption band calm; light direction consistent per location
- [ ] Props: material, wear, one personality detail, thin outline, clean green; exact text only where requested

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
- **Caption:** `post.md` with a TikTok/Reels caption and a YouTube Shorts title (≤ 100 chars, ends with #shorts).
  - **Line 1 = the search phrase, written the way people type it** ("Why is Thanksgiving on a Thursday?"), not a vibe
    ("😧 Thanksgiving Explained"). No emoji before the keywords.
  - Line 2: the curiosity line + one Doug joke.
  - **3–5 niche hashtags** that name the topic and the lane (#thanksgiving #history #learnontiktok #explained).
    Never a caption that is only "#fyp". No swearing (no "f\*ck", no "heck" needed in the caption).
- **On-screen title:** the search phrase on screen in the first 2 s (the hook caption or a title card), so TikTok
  reads it from the picture too. That's the third place (§6c).
- **Length:** the final file is ≥ 1:02, or it earns nothing from Creator Rewards (§1.11).

## 6c. Reach: getting seen by people who don't follow us
Why this section exists (scrape, Nov 20 2026): @coonknows has 12k TikTok followers from old, deleted content. They
don't watch the new videos (≈ 240 views each), so TikTok's first test batch stalls. The videos that broke out were
**timely** (the "17 countries stock up" debunk: 1,564 views, 15 shares) or **true stories about a real person**
(Victor Romero on Instagram: 18,391 views, 78 comments). The fix is to tell TikTok who each video is for and to
borrow other creators' audiences.

1. **Morning trend scrape (Claude, every day).** Scrape Creators: TikTok search suggestions for our openers
   ("why is", "how does", "did", "what happened to", plus seasonal seeds like the next holiday) and this week's
   most-liked videos for "explained", "history facts", "money explained". Write `docs/trends/<YYYY-MM-DD>.md`:
   5–8 topic pitches, each with its **exact search phrase**, its mode (§1.13), why it's timely, and a post-by date;
   plus 3–5 viral videos to stitch with their links. About 10–15 credits a day.
   **Trend rides (meme × topic), the top of every sheet (Brian, Nov 22 2026):** also find what's going viral *outside*
   our lanes this week: the TikTok trending feed and top searches (`v1_tiktok_get_trending_feed`, `v1_tiktok_search_top`,
   `v1_tiktok_search_keyword` sorted most-liked this week for rising catchphrases), plus the sound each meme uses. For the
   2–3 biggest, find the original + a meme explainer and pull 2 transcripts each to learn what the catchphrase means, then pair each with a topic in our lanes
   through a one-sentence **bridge** (§1.13 Trend ride). Sheet section: meme + catchphrase · plays/uses · sound link ·
   the joke in one line · bridge → topic + search phrase · payoff · post-by (≈ 7 days from the meme's start).
   Skip memes that mock a group, involve real tragedies or minors, or need the viewer to already know the meme.
   Budget with this pass: ≈ 20–25 credits a day.
   **Where it lives:** `docs/trends/` on `main`, so any session (and `/topics`) can read it. "Give me today's topics"
   = `/topics`: read today's sheet; scrape first only if it's missing.
2. **Searchable words in three places, every video:** (a) caption line 1, (b) on-screen text in the first 2 s,
   (c) the first spoken sentence. Same keywords in all three, taken from the search suggestion, not invented.
3. **Stitch one viral video a day** in our lanes (history, money, how-it-works, myths): their first 3–5 s, then
   our narrator: "Here's what's actually going on." The stitch is shown to people who watched the original. The
   whole stitch must still run ≥ 1:02. Stitch picks come from the trend sheet. Correct, don't dunk: no mocking the creator.
4. **Comment early on bigger creators (Brian, ≈ 15 min a day).** Within the first hour of a post by a bigger
   history/explainer creator, leave one real, specific comment (a fact they skipped, a funny one-liner in the narrator's
   voice). Top comments send their viewers to our profile. No "check my page", no copy-paste comments.
5. **Posting rules (we post as much as we can, inside these):**
   - Posts at least **3 hours apart** so they don't compete with each other.
   - **A different topic every post.** Never repost the same or a lightly edited video; TikTok can mark it
     unoriginal and limit its reach. A long-form cut-down (§1.11) counts as new only if it's a different story beat.
   - **Every post ≥ 1:02.** No sub-minute series, no "part 2": each video stands alone.
   - Same video goes to TikTok, Instagram Reels and YouTube Shorts (Shorts is free reach we aren't using yet).
   - Schedule: `docs/posting-schedule.md`.
6. **Profile:** bio says what the account is ("How stuff really works, explained dry. New story daily. 📚");
   pin the 3 best (one timely debunk, one true story, one money video). Ignore the old dead followers: once
   strangers respond to a video, TikTok keeps widening who sees it.

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
- **Feet on the floor:** place cast with `K.placeAt(name, ix, iy, ry, scale)`, a pixel on the painted floor, never a guessed z.
  Measure each plate's `hz` from its vanishing lines and `camH` from a door (≈ 2.75 units) so the cast's size matches the room.
  Shoes have rounded soles (no box).
- **Green-screen props:** key with `colorkey=0x00FF00:0.22:0.06` (ffmpeg) or the same distance-to-pure-green
  in a shader. **No despill:** it turns teal/green props blue. Tested clean on `gas-vs-water/P01_car_side.png`.
- **Green subjects (cash, bills, leaves):** the key eats them. Run `python3 tools/cutout.py videos/<slug>/art/<file>.png` → `<file>.cut.png` (only green touching the border is removed) and point `SC.props` at the `.cut.png`; the kit skips keying for `*.cut.png`.
- Chromium needs `--allow-file-access-from-files` to load plates.
- **Status:** the plate and cast system lives in the lab pages. The production pipeline
  (`kit.js`/`stage.html`/`render.js`) still drives the old gold-noir look. Wiring plates, cast and
  gestures into `scene.js` + `render.js` is the next build step, done with the first real video
  (`why-cars-need-gas`).
