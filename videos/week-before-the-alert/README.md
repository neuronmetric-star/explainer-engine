# The Week Before the Alert: stills-to-video build

This edit runs entirely on local FFmpeg. It uses no paid generation service.

## Folder
- `assets/scenes/scene_001.png`… (2160×3840). These aren't committed, so re-extract them from the zips.
- `assets/locations/`: location plates and props (loc_FARM, loc_FARM_NV, loc_ROOM_BLACK, loc_ROOM_RED, props)
- `assets/thumbs/`: put thumb_A/B/C.png here. They're kept separate and never used in the edit.
- `assets/sfx/`: effects synthesized locally (rain, crt, tick, water, rumble, scream placeholder).
  A recorded scream dropped in at `assets/sfx/scream.wav` replaces the placeholder automatically.
- `shot_timing.csv`: **the edit**. One row per scene: start, end, narration, caption, status, motion, hold, sfx, note.
- `narration_script.txt`: clean narration in scene order. Written by `build.py pack`.
- `source_notes.md`: claim register and release blockers.
- `build.py`: the build script (`python3 build.py` prints the help).

## Typical runs
Pull the lines out of the prompt pack:
```bash
python3 build.py pack "prompt_pack(3).md"
```
Time the cut. With no `voice.mp3` it times from the scratch TTS read; with one, it aligns to the recording:
```bash
python3 build.py time
```
Render the draft with the scratch espeak-ng narration:
```bash
python3 build.py render --scratch-tts
```
After dropping in a real recording at `voice.mp3`:
```bash
python3 build.py time --voice voice.mp3
```
```bash
python3 build.py render
```

## Current cut: timed to the supplied voiceover
- `voice.mp3` (not committed) is the OpenArt voiceover, 3:11 long.
- `voice_edits.json` removes the unverified Jensen Huang passage (recording 31.30–40.38 s) and puts a 1.6 s silent beat in its place.
  Running `python3 build.py voice-edit` writes `.build/voice_master.wav`, normalised to −16 LUFS. That edited file is the timing master.
- `phrases.csv` has one row per spoken phrase, with:
  - its time in the edited timeline (`start`/`end`) and in the original recording (`rec_*`);
  - what was heard and the caption burned in;
  - a confidence level.

  An empty caption means no caption: those phrases were unclear. Fix wording here, then run `render` again.
- Each shot starts 0.08 s before the first phrase of its scene. Scene 038 holds 1.3 s of silence after the last word, and
  scene 039 starts on the scream.

To swap in a new recording, replace `voice.mp3`, update `voice_edits.json` and the times in `phrases.csv` and `shot_timing.csv`,
then run `voice-edit`, `render` and `check`.

## Editing a cut
Change `start`/`end` in the CSV. Shots must stay contiguous: each start equals the previous end.
Only the shots you change are re-rendered (segments are cached in `.build/`).

Motion syntax: `z=1.00>1.10 f=0.50,0.50>0.62,0.36` means zoom from 1.00 to 1.10 while the frame centre
moves from (0.50, 0.50) to (0.62, 0.36), as fractions of the image's width and height.

## Status values
- `OK`
- `VERIFY`: still shown, but flagged
- `PENDING_LINE`: placeholder caption
- `OMIT_UNVERIFIED`: voice muted over the shot and no caption

## Output
The output is `The-Week-Before-the-Alert-DRAFT.mp4` whenever anything is pending. That covers lines, scenes, the real voice, the
real scream, or VERIFY/OMIT rows.

Spec: 2160×3840, 30 fps, H.264 High, yuv420p, AAC 48 kHz, faststart, plus a matching `.srt`.
