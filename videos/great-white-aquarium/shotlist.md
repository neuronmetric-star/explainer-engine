# Shot list: "Why are there no great white sharks in aquariums?" · one-off (short, ≈ 1:10–1:14)

**Script:** approved Nov 25 2026 (`script.txt`, 233 words). **Voice:** Brian records the CLEAN copy in `voice-direction.md` (no shout: the test);
then `voice-drama.json` (hook punch on the question, "buzz" / "buffet" / "didn't make it" slower, the record run faster) → align → build.
**Search phrase:** "why are there no great white sharks in aquariums" (first spoken sentence, on-screen title at 0–2 s, caption line 1).
**Mode:** true story (reconstruction: Doug stands in for the keepers, Gary for the scientist who found the buzz; see `sources.md`).

**Cast**
- Doug `hoodie`: the aquarium keeper (the fool who thinks "it's just a big fish"). Optional `hat:'hard'` off; plain hoodie.
- Gary `oxford` + glasses: the scientist; holds P05 voltmeter on "buzz" (engine prop on his right hand, or `holdR:'magnifier'` fallback).
- The boss = Victor `suit` (only in `boss`).
- Sharks are 2D props (P01–P04), animated by the engine (swim bob, tail sway via skew, slide). No sharks painted into backgrounds.

**Color script** (warm hope → cold trouble → warm answer)
| Plate | Palette + accent | Mood |
|---|---|---|
| B01 aquarium hall | deep aqua blue, warm brass, cream, accent gold (the empty spot waiting for a star) | hopeful, grand, a little empty |
| B02 1980 round tank room | retro teal, mustard, dim fluorescent green, accent red (the one spot on the wall) | tense, old, buzzing |
| B03 lab lightbox (the cutaway plate) | cool white light, slate blue, accent gold | clear, "here's how it works" |
| B04 ocean map | parchment, deep ocean blue, accent gold (the path) | huge, open |
| B05 boat deck at sea, dawn | peach sky, sea blue, white foam, accent orange (life ring) | relief, freedom |
| E01 city sunset (existing) | warm sunset | the signature goodbye |

**Art (14 new images; E01 + H01 are copied from `docs/assets/`)** → batch file `art-prompts.md`
| File | What | Used in |
|---|---|---|
| B01_aquarium_hall.png | modern aquarium hall, one giant glass tank wall, the tank EMPTY (water, rocks, no fish), open floor | hook, card, boss, 2004 beat (growing set: shark added), diy |
| B02_round_tank_1980.png | 1980 aquarium room around a big ROUND tank, one metal seam on the wall (the clue spot) | round → free1 |
| B03_lab_lightbox.png | aquarium lab with a big glowing lightbox wall, open floor | swim/stop (P04 cutaway on the lightbox), nose |
| B04_ocean_map.png | painted nautical map of the Indian Ocean: Africa left, Australia right, no text | roam / trip / closet |
| B05_boat_deck_sea.png | small research boat deck at dawn, open sea, open deck floor | free1, free2 (releases) |
| P01_great_white_swim.png | THE GREAT WHITE, side view, facing right, mouth closed | many |
| P02_great_white_hungry.png | the same shark, grinning with teeth, a white napkin bib | buffet |
| P03_soupfin_shark.png | smaller slim gray shark (the tank mate), side view facing left | her → two |
| P04_shark_cutaway.png | textbook cutaway of the same shark: mouth, gill slits, nose dots | swim, stop, nose (the diagram) |
| P05_voltmeter.png | 1980 handheld analog meter with two probe wires | gary / buzz |
| P06_bicycle.png | red kid's bike, no rider, leaning | bike |
| P07_phone_buzzing.png | smartphone with a glowing blank screen + buzz lines | phone |
| P08_great_white_sign.png | exhibit sign: big painted open jaws + the words "GREAT WHITE" | hook frame 1, never, diy |
| P09_closet.png | narrow wooden broom closet, door open, mop + bucket | closet |

**OpenArt (optional, ask Brian first, after the art arrives):** `OPENART:` B05 → 5 s image-to-video "gentle swell, foam, sunrise glints,
slow push-in, no people, no animals" for the release beats, if the engine's static sea looks dead. One test clip (cheapest model that
looks right, PixVerse ≈ 50 credits), report credits.

**Rules:** visual hook first (§3.5 #12, no voice shout this time), `SCENE.whip = true`, same-plate shots continue the camera, ~18 shots,
color code (light blue = water flowing over the gills, white zigzags = the electric buzz, red = the wall spot / danger / loss,
gold = the answer), few words on screen, numbers as objects (a visitor counter ticking up, a 198-day calendar strip), `THE HECK?` banner.
Ad-safe: no blood, no shark eating on screen ("didn't make it" = the two tank-mate props fade out behind a red X, nothing gory).

## Shot plan (~18 shots)
| Cue | Picture | Camera | Acting / overlays |
|---|---|---|---|
| q | frame 1: P08 sign's open jaws at 5× filling the frame → crash-zoom OUT (0.55 s) to B01: the sign beside the giant EMPTY tank | crash-zoom out, white flash + shake + sting at q+0.28 | Gary (visitor) jumps back `K.hookReact` (`scream`), whole and big by 0.6 s; title `WHY ARE THERE NO` / `GREAT WHITE SHARKS` / `IN AQUARIUMS?` (gold last line) |
| glass / never / tried | B01 continues | slow push to the empty tank | the tank stays EMPTY; on "never" gold dashed outline of a shark appears in the empty tank and blinks out; on "tried" a row of small dates `1955 · 1980 · 2004 · 2016` ticks across the top |
| card / boss | B01 | medium two-shot | Victor (boss) `point`s at the empty tank; Doug `surprised` |
| easy / bet | B01 | push on Doug | Doug `smirk`, `shrug`, P01 shark prop slides in and Doug pats the glass (`gesture:'tada'`); text `JUST A BIG FISH` (white) |
| swim / stop / bike | B03 lab (whip): P04 cutaway on the lightbox | slow push to the mouth + gills | light-blue `K.flow` water running in the mouth and out the gills while P04 bobs forward; on "stop" the flow slows and turns red; P06 bike pops in bottom-right and tips over on "fall over" (rotation), Doug `worried` at the lightbox edge |
| round / sandy | B02 round tank 1980 (whip) | wide, slow orbit-feel pan (panX) | text `1980`; P01 (scaled smaller = young Sandy) circles the tank (x/scale loop, flip at the ends); Doug proud `hips` |
| bonk / spot | B02 | push to the seam spot | Sandy swims into the seam spot: bump + small shake + `bonk` SFX, twice; red ring pulses on the spot (planted on "round" already as a faint seam) |
| gary / buzz | B02 | medium on Gary at the spot | Gary holds P05 voltmeter to the spot, needle wiggles; white zigzag sparks from the spot; red `BUZZ` slam |
| nose / phone | B03 lab (whip) | push to the snout of P04 | white zigzags flow INTO the nose dots (gold glow); on "phone" cut to B02 darkened (vignette), P07 phone buzzing where the spot is |
| free1 | B05 boat deck (whip) | wide, gentle sway | `3 DAYS` (red) calendar strip; Doug + Gary at the rail, small P01 slides off into the water (mask at the waterline), splash SFX |
| big / her / ate / swam | B01 (whip) — the growing set: the giant tank now with P01 swimming + two P03 tank mates | slow push | text `2004`; Doug `happy`; P01 swims across (bob) |
| crowd / record | B01 | punch-in, then pull out | a gold visitor counter ticks to `ALMOST 1,000,000` (numbers as objects: tiny ticket stubs pile up at the bottom edge); calendar strip flips to `198 DAYS` gold; Doug `tada` |
| but / buffet | B01 | slow push to the shark | P01 scales up (growing) over 1 s; swap to P02 hungry + bib on "buffet"; the two P03s swim faster (props have no faces to act) |
| two | B01 | hold | red X over each P03, they fade out; Doug `facepalm`; red `2` small |
| free2 | B05 deck (whip) | wide | P01 slides off the boat into the sea; Doug `flat`, Gary pats his shoulder |
| roam / trip | B04 ocean map (whip) | slow pull out | gold dotted path draws Africa → Australia → back (`K.flow` gold dots); a tiny P01 icon rides the line; text `20,000 KM` gold |
| closet | B04 → hard punch to P09 closet on the map's corner | quick push | P01 squeezed into P09 closet, tail sticking out the door; Doug `shrug` |
| mirror / ocean | B04 map (continue) | zoom out to the whole ocean | gold `A BIG FISH THAT NEEDS THE WHOLE OCEAN`; the empty-tank icon vs the whole map |
| diy / question | **E01 city sunset rooftop** (whip) — the signature goodbye | wide | Doug + Gary on the rooftop; the **helicopter** crosses on `diy` (`K.helicopter(t,'diy')`), Gary looks up; gold `NEXT AQUARIUM TRIP: LOOK`; then `WOULD YOU SWIM WITH ONE?` |
| cta | E01 hold + follow button | static | Doug `point`, Gary `smirk` |

Note: the helicopter rides the last story line. Here the mirror is on B04 and the do-it-yourself line is the last story line, so the whip to E01
lands on `diy` (same as sleep-two-minutes, where the question shot sits on E01).
