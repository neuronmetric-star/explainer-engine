# Slop check

Look at every image and every contact sheet yourself (Read the file). If in doubt, it fails.

## Images from the user (run check_images.py, then look at images_grid.jpg and individual files)

- [ ] Every file is present, 16:9, and **at least 3840×2160**. Ultra-HD is mandatory: list the failures and ask for regeneration or upscaling.
- [ ] **Character sheets**:
  - [ ] the ball head is white and smooth, with no ears, no nose and a drawn face;
  - [ ] outfit and colours match the descriptor;
  - [ ] the outfit is identical in all views;
  - [ ] no text.
- [ ] **Location plates**: no people. Variants keep the same layout and camera as the base plate.
- [ ] **Scenes**:
  - [ ] each character matches its sheet (outfit, colours, hat or hair, accessories);
  - [ ] the location matches its plate;
  - [ ] the props match the prop sheet;
  - [ ] **counts are exact** (zoom in and count);
  - [ ] the scene shows the line literally;
  - [ ] no stray text or garbled letters;
  - [ ] no realistic faces;
  - [ ] no extra limbs;
  - [ ] the bottom 20% is calm enough for captions.
- [ ] Write the user a numbered fix list: scene, problem, and the corrected prompt (rebuild the pack if the bible changed).

## Clips (contact sheet, 18 frames)

- [ ] No extra or merged limbs.
- [ ] The face stays drawn and never turns sculpted.
- [ ] The hat or hair never vanishes or changes colour.
- [ ] No objects pop in or out, and counts stay the same.
- [ ] The camera keeps the subject in frame. Watch for orbits that turn the character's back to the camera for a long time.
- [ ] No hidden cut, flash, sudden lighting change or morph.
- [ ] The action matches the line.
- [ ] If sound effects were on: no speech, singing or music.

## Final edit (10 s windows)

- [ ] Each cut lands on its line, and captions are in sync and readable.
- [ ] Chapter cards appear at chapter starts.
- [ ] No black frames, and no freeze longer than 0.7 s.
- [ ] Stills move (push-in, pull-out or pan), and no two neighbouring stills use the same move.
- [ ] Loudness: voice clear, music under the voice (mean about −20 to −16 dB overall).

## Fix table

| Failure | Fix |
|---|---|
| Wrong count in an image | Ask for the image again with the COUNT RULE, or ask for an empty-counter version, then "add exactly N, apart, all visible" |
| Character drift (outfit or colour) | Re-attach the character sheet and re-paste the descriptor verbatim, plus "match the attached sheet exactly" |
| Third arm or merged limbs in a clip | Add "exactly two arms, hands always visible and separate", simplify the action, use an end frame |
| Back to the camera for too long | Replace an orbit or push-in with "slow push-in, character keeps facing camera" |
| Sudden lighting change or hidden cut | Trim around it with `src_in`/`src_out`, or regenerate with "same lighting throughout" |
| Object pops in or out | List the objects that must stay. Lock the camera |
| Line longer than the clean footage | Split the shot: the clip, then the scene image as a still with a camera move |
