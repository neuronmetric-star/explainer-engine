# The Week Before the Alert — source & editorial notes

**Release status: DRAFT. Not public-ready.** Every cut is labelled DRAFT on screen until all of these are done:
1. Each material claim below is sourced (title + URL + the fact it supports).
2. Every relative date is checked and replaced with an absolute date.
3. The Jensen Huang passage has a verified replacement, or is permanently cut.
4. The dramatized imagery is clearly labelled on screen and in the post text.

**Where the wording comes from:** `prompt_pack(3).md` was not supplied. The narration below was transcribed from the
supplied voiceover (`voice.mp3`, 3:11) with an offline recognizer, then reconstructed by hand. Lines marked
[unclear] could not be made out, and those phrases are uncaptioned. When the prompt pack arrives, replace this wording with the original
and re-check the captions (`phrases.csv`).

## Removed from the playable cut: unverified allegation about a named person
| Recording time | Heard | Action |
|---|---|---|
| 31.4–37.4 s | "Same day, Jensen Huang, the man behind the chips that run AI, walks away from his own company." | **Removed.** |
| 37.8–39.6 s | "[…] suspected Chinese spy." | **Removed** (it directly follows the Huang line and reads as part of the same allegation). |

How it was removed: in `voice_edits.json`, the recording from 31.30 s to 40.38 s is replaced by a 1.6 s silent beat on scene 007 (empty chair and chip).
Neither phrase appears in the captions or the SRT. Mark this slot for a **verified replacement line**, or cut scene 007's beat entirely.
The original audio is still in `voice.mp3`. Don't use the raw recording for any export.

## Relative dates (VERIFY: rewrite as absolute dates before release)
"Tomorrow, 2:20 PM" (001–002, 036) · "Wednesday" (005) · "Thursday" / "Same day" (006–007) · "Friday the 13th" (008) ·
"Three and a half hours later" (012) · "Today" (015, 033) · "Last week" (020) · "Two weeks later" (025) · "In March" (034).
Note: 13 November 2026 is a Friday, so the "week" is probably 11–13 Nov 2026 and "tomorrow" is relative to recording day.
The cover **thumb_A** also carries "TOMORROW 2:20".

## Claim register: each line needs a source or a rewrite
| Scene | Claim (as heard) | Type | Source |
|---|---|---|---|
| 001–004 | A nationwide emergency alert test tomorrow at 2:20 PM, interrupting every TV and radio; "first one in three years" | Time-sensitive | — |
| 005 | Casablanca blackout: a storm takes out four power lines, all four including the backups | Real incident | — |
| 006 | Microsoft email outage worldwide (Thursday) | Real incident | — |
| 008–011 | Friday 13th, 12:30 PM, New Orleans: a tanker's steering locks and it hits a cruise/river boat; it rolls; about 100 people in the Mississippi; nobody died; cause unknown | Real incident | — |
| 012–014 | The FAA stops every departing plane 3.5 hours later, "extraordinary circumstances", 3,500 planes in the air; cause "a router" | Real incident | — |
| 015 | "Today" people couldn't access their bank accounts | Real incident, relative date | — |
| 016–017 | A fake clip of **Donald Trump** saying the power goes out for 90 days; shared by millions | Named person, misinformation | — |
| 018 | The Pentagon is getting bases ready to survive 90 days with no grid | Time-sensitive / military | — |
| 019 | "Why are the people running this country moving into those places?" | **Insinuation, unsupported**: rewrite or source | — |
| 020 | **Marco Rubio** […] last week […] threats, "they won't say what kind" | Named person (wording unclear) | — |
| 021 | Europe: 19 planes hit with bomb threats in one day; fighter jets escorting | Real incident | — |
| 022 | 300 schools in Italy evacuated; no bombs, nobody caught | Real incident | — |
| 023–024 | Mexico [city unclear]: a camera catches a creature (no hair, long fingers, tail) | Viral claim | — |
| 025–026 | Same city two weeks later: video of a "pterodactyl"; experts say a heron; parts of the video faked | Viral claim | — |
| 028 | A light over the Mexico City skyline, then gone | Viral claim | — |
| 029 | Red flashes over France; "people swear they saw tentacles" | Viral claim (likely red sprites; say so if sourced) | — |
| 030–031 | Black shapes past airplane windows "show up before something big happens" | **Insinuation, unsupported** | — |
| 032 | **Donald Trump** says pilots told him something moves three times faster than our jets | Named person, quote | — |
| 033 | **Mayor Zohran Mamdani** shut down the NYPD unit that polices protests ("today") | Named person, relative date | — |
| 034 | In March someone threw homemade bombs outside his house | Named person (by reference), real incident | — |

## Framing rule (applies to the whole cut)
The montage puts unrelated events side by side ("Now look at the week leading up to it") and ends with
"nobody's telling us the whole thing". **The visual sequence is not evidence that these events are connected.**
- Don't add on-screen text, captions or post copy that asserts a connection or a cause.
- If a release version is made, add a line or card such as "Each event has its own explanation. This video is a dramatization."
- The narration's own suggestion of a connection is an editorial claim. It needs sourcing, or a rewrite into an explicitly speculative or hypothetical frame.

## Imagery labelling
- Every frame of the draft carries `DRAFT · DRAMATIZATION · NOT FOR RELEASE`. A release build keeps `DRAMATIZATION`.
- All 39 scenes are AI-generated stills supplied by the owner. None is photographic or archival evidence. That includes the
  "archival" black-and-white rooftop shot (025), the night-vision creature (023–024) and the glitched creature (026), which
  imitate real footage formats and must never be presented as real footage.
- Covers: thumb_A ("TOMORROW 2:20") has a relative date, so VERIFY it. thumb_B ("THE LIGHTS GO OUT?") and thumb_C ("WHAT IS THIS?") are fine
  as questions, but the post must label the creature as a dramatization.

## Sources
*(none yet; add them as `- [title](url): the fact it supports`)*
