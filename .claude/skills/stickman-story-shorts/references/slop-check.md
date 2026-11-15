# Slop check

Look at every image and every contact sheet yourself (Read the file). If in doubt, it fails.

## Sheets
- [ ] The ball head has no ears, no nose bump, and no sculpted features. The face is drawn lines.
- [ ] The limbs are thin sticks, with exactly two arms and two legs per view.
- [ ] Every requested accessory is present in every view.
- [ ] Nothing was copied from the style anchor's own character (clothes, colours).
- [ ] Female characters show no beard or stubble and no male build.
- [ ] No text, labels, extra panels or extra characters.

## Keyframes
- [ ] The character matches the sheet (outfit, colours, accessories, hair or hat).
- [ ] It shows literally what the line says, in one clear moment.
- [ ] Same-location shots: the room, props and light match "THE PLACE".
- [ ] The subject is centred; nothing important sits in the top 8% or the bottom 20%.
- [ ] Any on-screen text is spelled exactly. No stray text or watermark.
- [ ] Faces are stickman faces, never realistic.

## Clips (contact sheet, 18 frames)
- [ ] No extra or third arm, and no merged limbs.
- [ ] The face stays drawn (it never turns sculpted or realistic).
- [ ] No new costume pieces (buttons, a second belt), and the hat or hair never vanishes.
- [ ] Objects stay: nothing pops in or out.
- [ ] The camera move keeps the set in frame (no runaway zoom).
- [ ] No hidden cut, flash or morph inside the clip.
- [ ] Text, if any, stays correct and on the right object.
- [ ] The action matches the line.
- [ ] Sound: no speech, singing or music. If there is any, mute that clip in the plan (`"sfx": 0`).

## Final edit (6 s windows, 27 frames)
- [ ] The cuts land cleanly, with no black or duplicate frames.
- [ ] The trims removed the bad frames.
- [ ] Captions (after the voice-over) are 1-2 words, readable, inside y 1250-1450, and in sync.
- [ ] No frame is frozen for more than about 0.6 s (a hold from time-fitting).

## Fix table

| Failure | Fix |
|---|---|
| Third arm or merged limbs | Add "exactly two arms, hands always visible and separate"; simplify the action; use an endFrame |
| Face goes realistic | Add "the face is flat drawn black lines on a white ball, never sculpted" to the LOCK |
| Hat or hair vanishes | Name it in the LOCK: "{hat} stays on the head the whole time" |
| Object pops in or out | List the objects: "the {x} and {y} remain visible and unchanged"; lock the camera |
| Wrong motion invented | Make an end-state still and pass it as endFrame |
| Zoom throws the set out of frame | Replace with "locked-off camera" or "slow push-in, at most 10%" |
| Hidden cut or morph | Shorten the duration; use one simple action; regenerate |
| Text misspelled | Fix it in the keyframe (nano-banana-pro is strong at text); lock the camera so the text isn't re-rendered |
| Speech or music in the clip | Re-prompt the AUDIO block; or set `"sfx": 0` for that shot |
