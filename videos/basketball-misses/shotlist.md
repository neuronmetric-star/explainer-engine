# Shot list: "Why the heck does the guy who misses the most shots win?" (Brian's script v3, 3D engine)

**Voice:** Brian's `voice_raw.mp3` (1:44) → pauses trimmed to 0.18 s + 1.25× → `voice.mp3` (1:07.6). Words aligned on the raw take and
mapped through the cut (`data.js`).
**Cast (3D, silent):** **Doug** = `hoodie` (holds the ball the whole minute) · **Gary** = `oxford` (shoots).
**Art (Brian, ChatGPT):** 01 court day · 02 behind the shooter · 03 hoop close-up · 04 court dusk · P01 ball · P02 rack · P03 burst.
Made here: `X01–X04_net.png` (front rim + net cut out of each painting, so a made ball drops BEHIND the net),
`P02e_rack_empty.png` (rack with the balls removed; the engine draws the balls, so Gary's rack empties as he shoots).
**Engine:** every shot is a release time + outcome (`in / short / long / left / right / clank`); the ball flies from the shooter's
hands to the rim and bounces with a little deterministic physics, on whichever painting is on screen. Scoreboard (Gary's baskets,
Doug 0, 60-second clock) from "One minute" to the buzzer; shower-knob dial (cold → hot → in between); stat cards at the end.
**Sound:** `sfx.json` → `python3 tools/sfx.py basketball-misses` (bounce, rim, board, swish, buzzer, pops; street ambience), mixed
under the voice and ducked (mix rule).

| Cue | Picture | Camera | Acting |
|---|---|---|---|
| q | 01 wide: Doug + Gary, two racks | slow push | Doug `smirk`, Gary `smile` |
| meet | 01 two-shot | push | Gary `wave` |
| rules | 01 on the hoop, scoreboard pops in (0:60) | push | |
| rack | 01 on the racks | push | |
| whoever | 02 empty court toward the hoop | push-in | |
| doug | 01 on Doug | push | picks a ball off his rack |
| holds | 02 Doug from behind, ball set | push | frozen |
| perfect · stare | 01 Doug close → face | push | `flat` → `surprised`, no blink (cat + laser pointer) |
| gary | 01 Gary | pull back following the ball | grabs, shoots at once |
| short | 02 behind Gary: ball drops short | hold | |
| bet | 01 Doug close | push | `smirk` |
| power | 01 Gary | pull back | leans back, harder shot |
| bang | 03 ball bangs the backboard + burst + shake | hard cut | |
| far | 02 ball bounces back | pull back | |
| less · shower · cold | 01 Gary + shower-knob dial (cold → hot → middle) | push | `think`, `smirk` |
| third | 02 behind Gary, ball in the air | push | |
| swish · straight | 03 ball drops through the net (behind the strings) | push | |
| thinking | 01 wide, Gary shooting fast, Doug holding | slow push | |
| still · left | 02 misses left, right, short (rim clanks) | push on the hoop | |
| change | 01 Gary close | push | `nod`, `smirk` |
| aimright · morepower | 02 miss left → in; short → in | push | |
| dougstill · nothing | 01 Doug close → face, clock goes red | push | `flat` → `worried` |
| buzzer | 01 wide: 0:00 + burst + buzzer, Doug finally shoots | push | Doug `surprised` |
| clank | 03 Doug's ball clanks off the rim + burst + shake | hard cut | |
| score · missed · made | 04 dusk on Gary: 30 SHOTS / 18 MISSED / 12 MADE | push | `happy`, `tada` |
| doug1 · dzero | 04 Doug: 1 SHOT / 0 MADE | push | `worried` |
| final | 04 two-shot: 12 – 0 | push | Gary `tada` |
| ask · answer | 04 Doug turns to Gary; Gary close | push | Doug `surprised`; Gary `smirk`, `shrug` |
| cta · or | 04 wide → Gary close | slow push | Doug still holding his ball; Gary `wave` |
