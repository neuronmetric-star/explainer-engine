# OpenArt reference (animation only; the user makes the images)

Prices change, so always quote with `openart_model_cost` using the real params. Checked on 16 Nov 2026 (the 720p no-audio 5 s price was quoted directly; the other no-audio lengths assume the same per-second rate):

| PixVerse V6 image2video | 4 s | 5 s | 6 s | 8 s | per s |
|---|---|---|---|---|---|
| 720p, `generateAudio: false` | 56 | 70 | 84 | 112 | **14** |
| 720p, `generateAudio: true` | 72 | 90 | 108 | 144 | **18** |
| 1080p, no audio / audio | | 150 / – | | 240 / 280 | 30 / 35 |

**Channel default: 720p.** No sound effects for long-form (they're added in the edit); sound effects on for Shorts.

**Budget guide**: a long-form episode with 15-20 animated scenes of about 5 s costs about 1,100-1,500 credits, plus 15% for redos. A fully animated Short of 12-14 clips costs about 900-1,200.

## Fields

`pixverseV6` / `image2video`:
- `prompt` (≤5000 chars);
- `startFrame` `{type:"image", id, label[, url]}`;
- `endFrame` (same shape or null);
- `duration` 1-15;
- `resolution` 360p/540p/720p/1080p;
- `generateAudio`;
- `videoCount`.

There is no aspect field: the output follows the start frame, so 16:9 images give 1280×720 clips at 720p.

## Uploading the user's images (tested, works from the cloud session)

1. Run `python3 scripts/prep_upload.py videos/<slug>/bible.json`. It makes `upload/scene_NNN.jpg` at 1920×1080 and prints the byte size of each.
2. Call `openart_upload_sign` with `{mediaType:"image", contentType:"image/jpeg", filename, size:<bytes>, purpose:"create-video"}`. It returns `signURL`, `accessURL` and `uploadId`.
3. Upload the file: `curl -sS -X PUT -H "Content-Type: image/jpeg" --data-binary @upload/scene_NNN.jpg "<signURL>"`. Expect HTTP 200.
4. Call `openart_upload_metadata_get` with `{mediaUrl: accessURL, mediaType:"image", uploadId}`. It returns `visualReference`; use `{type:"image", id:<uploadId>, url:<accessURL>, label}` as `startFrame`.
5. Record `uploadId` and `accessURL` per scene in `shots.json`, so redos don't re-upload.

## Generating, waiting, downloading

- **Generate**: `openart_generate_video_batch` takes 2-8 items per call. If it is refused for the parallel limit, wait and resubmit only the refused items.
- **Wait**: poll `openart_creation_get(historyId)` until COMPLETED. Clips take about 1-4 min. Don't use `openart_creation_list` with all media types: its output is huge. If you must list, use `limit` 20 so the output is saved to a file, then parse it with Python.
- **Download**: `curl -L -o clips/NN.mp4 <resources[0].url>`. The `cdn.openart.ai` host must be allowed in the environment's network settings (it is in "Explainer Engine").
- **Slop**: check every clip with `contact_sheet.py` before using it. Trim with `src_in`/`src_out`, or regenerate once with a tighter LOCK.
