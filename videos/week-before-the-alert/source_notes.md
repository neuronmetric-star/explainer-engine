# The Week Before the Alert — source & editorial notes

**Release status: DRAFT. Not public-ready.**

Every playable cut stays labelled DRAFT until all of these are done:
1. Each material claim is sourced (title + URL + the fact it supports, listed below).
2. Every relative date has been checked and replaced with an absolute date.
3. The Jensen Huang line has a verified replacement, or is cut.
4. The dramatized/fictional imagery is clearly labelled on screen and in the post text.

## Blocking: prompt pack not received
`prompt_pack(3).md` was not in the uploads, so none of the narration has been reviewed yet.
After it arrives, `python3 build.py pack "prompt_pack(3).md"` does the following automatically:
- Any line naming **Jensen** or **Huang** is set to `OMIT_UNVERIFIED`. Its voice is muted and its caption removed in every playable cut. The original wording stays in `narration_script.txt`, tagged `[OMIT]`.
- Any line with a relative date (*today, tonight, tomorrow, yesterday, this week, last week, next week, days ago, right now*) is set to `VERIFY`.

Then fill in the table below, one row per line.

## Claim register

| Scene | Line (short) | Type | Status | Source (title + URL) | Notes |
|---|---|---|---|---|---|
| — | *Unverified allegation involving Jensen Huang* | Allegation about a named real person | **OMIT — needs a verified replacement** | — | Never present it as fact. Muted and uncaptioned in all cuts. |
| — | *Each line with "today / tomorrow / last week"* | Relative date | **VERIFY** | — | Replace with absolute dates. A relative date goes stale once the video is published. |
| — | *Each line about a real incident* | Real incident | **NEEDS SOURCE** | — | Name the date, the place and the outlet. |
| — | *Each time-sensitive figure or claim* | Time-sensitive | **NEEDS SOURCE** | — | Record an as-of date. |

### Scenes whose imagery points to a real-world event (inferred from the pictures only, so check against the actual lines)
These are the shots where a viewer is likely to read the picture as documentary. They need a "dramatization" label if the line refers to a real event:
- 008–011 riverboat / ship collision and capsizing, people in the water
- 012 airport departure board (all red)
- 013 national map with network/outage dots
- 014–015 router and ATM with static (outage?)
- 018–019 military base and checkpoint
- 021 object outside an aircraft window
- 022 schoolchildren with police lights
- 023–026 night-vision farm creature and winged creature (archival look and glitch). These are fictional creatures. Never caption or describe them as real footage.

### Cover options (`assets/thumbs/`, not used in the edit)
- **thumb_A**: burned-in text "TOMORROW 2:20". This is a **relative date (VERIFY)**. Once posted, "tomorrow" is wrong
  for every viewer after day one, and it implies a specific predicted event. Before release, use an absolute
  date or drop the date.
- **thumb_B**: "THE LIGHTS GO OUT?" The question form is fine, as long as the video doesn't assert an outage as fact without a source.
- **thumb_C**: "WHAT IS THIS?" The fictional creature must be labelled as a dramatization in the post.

## Framing rule (applies to the whole cut)
The montage puts unrelated events next to each other. The edit must not imply they are
connected. That means no "and then…" captions linking two incidents, and no on-screen claim of cause.
Narration that alleges a connection is an editorial claim and needs its own source.

## Imagery labelling
- Every frame of the draft carries the burned-in label `DRAFT · DRAMATIZATION · NOT FOR RELEASE`.
- For release, keep at least a `DRAMATIZATION` label (the default for a non-draft build), and also state it in the post caption.
- All scenes are AI-generated stills supplied by the owner. None is photographic evidence.

## Sources
*(none yet; add them as `- [title](url): the fact it supports`)*
