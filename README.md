# Explainer Engine 🎬

Make Richard-style 3D teaching videos (finance, history, science…) with Three.js + Claude Code.
Example: `videos/buy-borrow-die/` (script, scene, voice, sources).

## Make a video (in Claude Code)
Type:
```
/make-video how credit card companies make money
```
Claude researches → writes the script → **waits for your OK** → voice → builds the 3D scene →
checks preview stills → renders `videos/<slug>/final.mp4`.

## First-time setup (Claude Code does this for you — just say "run setup")
```
npm run setup          # installs Three.js, fonts, ffmpeg and a headless browser
```

## Voice options
**A. Exact timing (recommended):** create `.env` in the repo root:
```
ELEVENLABS_API_KEY=your_key_here
```
and put your voice ID in `config.json`. Then Claude runs `node tools/tts.js <slug>`.
*(Never commit `.env` — it's in .gitignore. In Claude Code on the web, add the key as an environment variable instead.)*

**B. OpenArt (no API key):** Claude gives you the spoken text → you generate it in OpenArt →
upload the MP3 as `videos/<slug>/voice.mp3` → Claude runs `node tools/align.js <slug>`.

## Commands Claude uses
| What | Command |
|---|---|
| Exact voice + timing | `node tools/tts.js <slug>` |
| Timing for an MP3 you made | `node tools/align.js <slug>` |
| Preview stills | `node tools/render.js <slug> --preview` |
| Final MP4 | `node tools/render.js <slug>` |
| Faster render on a real computer | add `--gpu` |

Optional: drop a `music.mp3` in the video folder and it's mixed in quietly under the voice.

## Files
- `CLAUDE.md` — the quality rules, script formula, visual rules, engine API
- `engine/` — the shared 3D engine (`kit.js`), page (`stage.html`), script parser
- `tools/` — voice, timing and render scripts
- `videos/<slug>/` — one folder per video: `script.txt`, `scene.js`, `voice.mp3`, `data.js`, `sources.md`, `final.mp4`
- `docs/research.md` — what we learned from @richardknows22 and @playmalo.com
