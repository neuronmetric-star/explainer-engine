# OpenArt reference

Prices change, so **always** quote with `openart_model_cost` and the real params. The figures below were checked on 15 Nov 2026 and are for orientation only.

| Job | Model / mode | Key params | Credits (checked) |
|---|---|---|---|
| Style anchor | `nano-banana-pro` text2image | `aspectRatio 16:9`, `resolution 2K`, `imageCount 1` | ~40 |
| Character sheet | `nano-banana-pro` image2image | `16:9`, `2K`, `visualReferences` | 40 |
| Keyframe / end frame | `nano-banana-pro` image2image | `9:16`, `2K` | 40 |
| Clip (default) | `pixverseV6` image2video | `resolution 1080p`, `generateAudio true`, `duration 4` | 140 |
| Clip (higher fidelity) | `gemini-omni-1-2-flash` image2video | `aspectRatio 9:16`, `resolution 1080p`, `duration 4` | 216 |
| Clip (budget) | `gemini-omni-1-2-flash` image2video | `720p` | 156 |

Field names:
- `pixverseV6`: `prompt`, `startFrame {type:"image", id, label[, url]}`, `endFrame` (same shape or null), `duration` 1-15, `resolution` 360p/540p/720p/1080p, `generateAudio`. There is no aspect field: it follows the start frame, so give it 9:16 keyframes.
- `nano-banana-pro` image2image: `prompt`, `visualReferences[]` (max 14), `aspectRatio`, `resolution`, `imageCount`.

**Rough budget for a 14-shot short:**
- 1 sheet = 40
- 14 keyframes = 560
- 3 end frames = 120
- 14 clips × ~140-180 (4-5 s each) ≈ 2,200
- plus redos

That's **about 3,000-3,300 credits**. Check `openart_account_get` first.

## Handles, uploads, downloads

- **Generation results** are referenced by their `resource:<id>` handle in later calls (keyframe → video, sheet → keyframe). There is no need to download and re-upload them. Record every handle in `shots.json`.
- **User files on a CLI host:**
  1. Call `openart_upload_sign` with mediaType, size, contentType.
  2. `curl -X PUT --data-binary @file -H "Content-Type: …" "<signURL>"`.
  3. Call `openart_upload_metadata_get` with the accessURL and uploadId.

  In widget hosts use `openart_upload_pick`. Stop if the network policy denies the host.
- **Downloading results for assembly:** `openart_creation_wait` / `openart_creation_get` return the output URLs. Save them with `curl -L -o clips/NN.mp4 "<url>"`. If the CDN host is blocked in a cloud session, tell the user which host to allow, or ask them to download the clips and drop them into `clips/`.
- **Parallel limit:** if a batch is refused for the plan's parallel limit, wait for running jobs and resubmit only the refused items.
