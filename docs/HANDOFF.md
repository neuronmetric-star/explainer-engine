# HANDOFF — read this first in a new session

Work branch: `claude/funny-gauss-1bbbss` (PR #2 to main). If main doesn't have `docs/longform/`, check out this branch.

## Two brands in this repo
1. **@coonknows** — vertical Shorts, the Coonverse (CLAUDE.md sections 1–4 apply).
2. **Babytopia** — 16:9 YouTube long-form, "<topic> explained like you're 5", Crayon-Capital-style storytelling.
   No Coon, no @coonknows watermark (`brand:''` until Brian picks a handle), no WTF hook/ending formula.
   Real people appear as recognizable **baby caricatures** (name + signature outfit, not a photoreal face) — Brian
   went ahead with this for baby Mark. Dialogue is dramatized; the description must say so.
   Study + plan: `docs/longform/crayon-capital-nvidia-study.md`, `docs/longform/babytopia-plan.md`.

## NOW: finish `videos/babytopia-facebook-pilot` (Facebook explained like you're 5, ~4 min)
Script approved (`script.txt`, ONE narrator voices everyone; `[@NAME]` tags = whose mouth moves).
Brian has made all images and recorded the voice. Steps:

1. **Images** → `videos/babytopia-facebook-pilot/img/` with the names from `image-prompts.md`:
   `sheet-*`, `set-dorm`, `set-courtyard`, `set-boardroom`, `s01`…`s28`, and the green-screen talking poses
   `zuck-laptop`, `zuck-calm`, `pal-curious`, `pal-shock`, `twins-angry`, `yahoo-offer` (+ each `-open`).
   Key every pose: `python3 tools/keygreen.py in out.png` (closed AND open versions). Check they line up
   (same size/position) — if the open version is offset, crop both to the same box so the mouth flap doesn't jump.
2. **Voice** → `voice.mp3`, then `node tools/voice.js babytopia-facebook-pilot 1.0` (no speed-up, no pad for
   long-form unless it runs slow; 1.05 is fine) — runs exact PocketSphinx alignment.
3. **scene.js** with `format:'wide'`, `brand:''`, `autoWhoosh:true`, chapters on cues `ch1` "The Website Harvard Shut Down",
   `ch2` "The Billion-Dollar No", `ch3` "Free Toys", `ch4` "The Price of Free".
   Panel → cue map (one panel per beat, push-ins/pans every shot; cold open = fast cuts, reuse s10/s11/s25 as teaser):
   - hook s01 · later s02 · tease s21/s11/s25 quick cuts (~0.8 s each) · question s03
   - ch1 s04 · facemash s05 · viral s06 · shutdown s07 · pal1/zuck1 = **set-dorm + pal-curious + zuck-laptop (talk)**
   - launch s08 · pitch/pal2/yep = set-dorm + zuck-laptop + pal-curious (talk) · signups s09 · twins s10
   - twinsline/zuck2 = **set-courtyard + twins-angry + zuck-calm (talk)** · settle/paid s11
   - ch2 cali s12 · thiel s13 · spread s14 · yahoo/offer/no/faint/more = **set-boardroom + yahoo-offer + zuck-calm + pal-shock (talk)** · crazy s15
   - ch3 trick/toy s16 · watch s17 · product s18 · ipo s19 · lunch/insta s20 · bought/email s21 · whatsapp/price s22 · today s23
   - ch4 scandal s24 · uhoh = s24 + pal-shock layer (talk) · fine/month s25 · answer/ads s26 · callback/sellsyou s27 · motto/break s28
   Talking layers: `{ img:'img/zuck-laptop.png', talk:'img/zuck-laptop-open.png', who:'ZUCK', s:[x,y], w, depth:1.3, bob:4 }`
   (who = ZUCK / PAL / TWINS / YAHOO). Facing: Mark faces right, Pal/Yahoo face left — use `flip` if needed.
   Cards (wide screen, `s:[x,y]` in 1920×1080, keep above y≈930 subtitles): 3 billion, $160B, 1,200, $65M, $500K, $1B,
   $104B, 13 employees / 30M users, 450M / $19B, 2B, 87M (red), $5B (red), $164B, 98%.
   SFX: cash on money numbers, slam on "No thanks"/fine gavel, shutter on FaceMash/IPO, riser before chapter cards, hit on "It sells you".
4. **Preview** `node tools/render.js babytopia-facebook-pilot --preview $(node tools/cues.js babytopia-facebook-pilot …)`,
   Read it, fix crops/overlaps/talk alignment, send Brian the preview. Then full render (~15–20 min for 4 min wide).
5. Send the mp4 + YouTube title, description (sources from `sources.md`, timestamps per chapter, "dialogue dramatized,
   simplified for education" disclaimer), tags. Commit + push. Two facts still flagged TODO in sources.md (FaceMash
   details, Thiel amount, WhatsApp primary source) — verify before publishing.

## Also open
- `videos/brush-twice` (@coonknows): script + prompts done, waiting on Brian's scenes + voice. Coon poses ready in
  `docs/characters/ref/poses/` (no shock/nose poses — use shake/flash instead).
- PR #2 (this branch → main) should be merged so new sessions get these rules by default. PR #1 = old engine, don't merge.
