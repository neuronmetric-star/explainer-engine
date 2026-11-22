# Character library

Brian's reference sheets (Nov 22 2026) are the **look target** for the 3D cast in `engine/characters.js`.
`*_ref.png` = the reference (inspiration, painted). `*_engine.jpg` = what our engine renders today, same layout.
Re-render the engine sheets after any change to the cast:
`node engine/lab/render-lab.js <outDir> --page cast-sheet.html` (shots 0–5 = Doug, Gary, Victor, polo guy, President,
gang member; shot 6 = the lineup), then copy them here as `<name>_engine.jpg`.

| Character | Outfit | Reference | Engine |
|---|---|---|---|
| Doug: the confident everyman who gets it wrong | `hoodie` | `doug_ref.png` | `doug_engine.jpg` |
| Gary: the observer who notices (glasses) | `oxford` | `gary_ref.png` | `gary_engine.jpg` |
| Victor: the rich guy / boss (stocky) | `suit` | `victor_ref.png` | `victor_engine.jpg` |
| Polo guy: the worker | `polo` | (none yet) | `polo_engine.jpg` |
| The President: head of state | `president` | `president_ref.png` | `president_engine.jpg` |
| Gang member: street crew, never armed | `gang` | `gang_ref.png` | `gang_engine.jpg` |

## What the references lock in (cast v2)
- **Heads:** matte warm-white porcelain spheres (soft sheen, not glossy plastic), sitting right on the collar (no neck).
- **Faces:** big and readable: oval eyes about 42% of the head width apart, each with a small white catchlight;
  thin arched brows well above the eyes; a smile about a quarter of the head wide. Seven faces: smile, happy (closed
  eyes, open mouth with tongue), surprised, smirk, worried, flat, blink.
- **Hands (Brian, Nov 22 2026):** one big, smooth, round white mitt with a thumb bump, like the v1 cast, never separate
  fingers (the fingered gloves looked messy). A single index finger slides out only on `point`
  (`pose({handR:'fist'|'relaxed'|'open'|'point'})` overrides).
- **Clothes with real details:** shirt collars, plackets, buttons, chest pocket, cuffs; hoodie hood, kangaroo pocket,
  drawstrings, ribbed hem and cuffs; jeans with seams, back pockets and rolled cuffs; suit with lapels, pocket flaps,
  three buttons, white cuffs, tie knot; bomber with zipper and ribbing; beanie with a folded cuff; bandana with a
  triangle flap and knot. Fabric textures: knit, denim twill, fine suiting, plain weave.
- **Shoes:** chunky sneakers (thick white sole, laces, toe cap) or glossy dress shoes.
- **Proportions:** big head (~30% of the height), short torso, hands reaching mid-thigh.

## Still to do (next upgrade pass)
- Soft cloth folds (wrinkles at elbows and knees) and a subtle outline/rim like the refs.
- A polo-guy reference sheet from Brian; new outfits get a reference sheet first, then the engine build.
