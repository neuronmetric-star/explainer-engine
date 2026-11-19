# OpenArt version (Brian's request, 2026-11-19): whole video in Wan 3.0, 480p, 9:16

Instead of the 3D engine, every shot is an AI clip from **Wan 3.0 element-to-video** (OpenArt), using Brian's
ChatGPT character sheets (`docs/cast/ferruccio-sheet.png`, `docs/cast/enzo-sheet.png`) and his paintings as
references. No audio is generated (`audio: false`): Brian's voice, captions and timing are added by
`node tools/assemble.js tractor-vs-ferrari`, which cuts each clip to its cue window.
This overrides the usual rule "no cast in AI clips", at Brian's request for this video.

- Price: about 20 credits per second at 480p standard (8 s = 160 credits). Plan limit: 8 videos at once.
- Upload ids/URLs: `openart-refs.json`; generation ids: `openart-jobs.json`; clip order/timing: `clips.json`.
- Bull badge (P05) wasn't painted, so c14 describes it in the prompt.

| Clip | Cue window | Refs | Shot |
|---|---|---|---|
| c01 | q → before | Ferruccio, 07 | Ferruccio beside the Miura at the trattoria, "ta-da" |
| c02 | before → ferraris | Ferruccio, 01 | walks between the tractors, points, hands on hips (**test clip**) |
| c03 | ferraris → define | Ferruccio, 02, P01 | red Ferrari cruises, then judders |
| c04 | define → louder | 04, P02 | clutch disc rotating on the workbench |
| c05 | louder → shop | Ferruccio, 02, P01 | engine revs, smoke, car barely moves |
| c06 | shop → same | Ferruccio, 03, P02 | mechanic pulls the clutch, looks at the tractor, surprised |
| c07 | same → bet | 04, P02, P03 | two identical discs; small tag vs giant tag |
| c08 | bet → enzo | Ferruccio, 03 | arms crossed, unimpressed |
| c09 | enzo → insult | Enzo, Ferruccio, 05 | Ferruccio walks into Enzo's office |
| c10 | insult → aside | Enzo, 05 | Enzo points, waves him off |
| c11 | aside → fix | Ferruccio, 05 | flat look → determined smirk |
| c12 | fix → company | Ferruccio, 03 | closes the hood, wipes hands, proud |
| c13 | company → horse | Ferruccio, 06 | new factory, "ta-da" |
| c14 | horse → miura | 04, P04 | horse badge, then the bull badge slams down |
| c15 | miura → engine | 07 (start frame) | low push-in on the Miura |
| c16 | engine → dinner | 08 (start frame) | cutaway: V12 behind the seats comes alive |
| c17 | dinner → hear | Ferruccio, 07 | walks to the Miura, opens the door, grins |
| c18 | hear → end | Ferruccio, 02, P06 | Miura races along the road |
| c19 | end → mirror | Enzo, 05 | Enzo alone, worried |
| c20 | mirror → cta | Ferruccio, 07 | leaning on the Miura, arms crossed, smirk |
| c21 | cta → end | 02, P01, P06 | Ferrari and Miura parked side by side |
