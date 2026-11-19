# OpenArt version: archery-gates (Brian, 2026-11-19): whole video in Wan 3.0 image-to-video, 480p, 9:16

> **Not used (Brian, 2026-11-19): "Just make video using Claude" → built in the 3D engine from his paintings instead (scene.js).**

**Why frame-to-frame (image2video) and not text-to-video:** the gates, target colors and Doug/Gary must stay identical in
every shot, and arrows must land exactly where the narration says (left post, blue ring, bullseye). Text-to-video invents a new
range and new characters every clip. Image2video starts each clip on Brian's ChatGPT frame; where an arrow must END somewhere,
the clip also gets an END frame (same picture + the arrow), so Wan animates the arrow into place.

- Frames: `art-prompts.md` (14 images, made with `docs/cast/doug-sheet.jpg` + `docs/cast/gary-sheet.jpg` attached).
- Price: Wan 3.0 image2video 480p standard = **20 credits/s** (5 s = 100). Duration can be 2–30 s, so each clip is cut to its cue
  window (+0.5 s): about 70 s of video ≈ **1,400 credits** (+100 for the test clip). Balance today: 104,305.
- Every clip: `audio: true` and the prompt ends with "Sound: only sound effects (…), no music, no voices." Then
  `node tools/assemble.js archery-gates` (voice −16 LUFS, SFX ×0.18 ducked under it, captions).
- Test clip first: **c07** (arrow thunks into the post, F07 → F08), report credits, then the rest (8 at a time).

| Clip | Cue window | Start → end frame | Action prompt (short) |
|---|---|---|---|
| c01 | q → meet | F01 | slow push down the lane toward the gates and target; leaves rustle |
| c02 | meet → raise | F02 | Doug smirks, Gary smiles and nods; camera drifts toward the gates |
| c03 | raise → wind | F03 | Doug raises and draws the bow, holds steady |
| c04 | wind → lower | F05 | gust: branches bend, leaves fly, windsock snaps straight |
| c05 | lower → gary | F03 → F04 | leaves blow past; Doug lowers the bow, unimpressed |
| c06 | gary → thunk | F06 | Gary releases at once, string snaps, arrow leaves to the right |
| c07 | thunk → bet | F07 → F08 | **test clip**: an arrow flies in and thunks into the left post, splinters |
| c08 | bet → sees | F02 | Doug smirks and shrugs at Gary |
| c09 | sees → clears | F06 | Gary eyes the post, shifts his aim a little to the right, nods |
| c10 | clears → again | F01 | an arrow flies away through the first gate and glances off the second gate's post |
| c11 | again → blue | F01 | an arrow flies straight through all three gates toward the target |
| c12 | blue → higher | F09 → F10 | the arrow thunks into the blue ring just below center |
| c13 | higher → bull1 | F06 | Gary raises his aim a touch, releases |
| c14 | bull1 → meanwhile | F10 → F11 | arrow hits the yellow bullseye, target shakes |
| c15 | meanwhile → bull2 | F03 | trees completely still; Doug draws slowly and releases |
| c16 | bull2 → leaves | F11 → F12 | second arrow lands in the bullseye beside the first |
| c17 | leaves → buzzer | F03 → F04 | leaves start blowing again; Doug lowers the bow |
| c18 | buzzer → looks | F13 | sunset; Gary celebrates, Doug looks worried |
| c19 | looks → cta | F14 | Doug looks down at his full quiver, slow push-in |
| c20 | cta → end | F13 | slow push; Gary waves, Doug stares at his bow |
