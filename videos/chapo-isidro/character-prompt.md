# Character prompt: Chapo Isidro (new outfit `isidro`)

**How to use:** open a fresh ChatGPT chat, **attach `docs/characters/president_ref.png`** (so it copies our cast style
and sheet layout exactly), paste the prompt below. Save the result as `docs/characters/isidro_ref.png`, and I'll build
the 3D version in `engine/characters.js` to match it.

Stylized cartoon, not a portrait: he gets a sphere head like the rest of the cast. What sets him apart is the clothes,
the cap and the mustache. He's never shown with a weapon or celebrating.

```
Make a character reference sheet in EXACTLY the same style, layout and rendering as the attached image (THE PRESIDENT sheet). Same cast, same materials, same lighting, same warm peach background, same rounded-card panels and bold labels. Only the outfit changes.

CHARACTER: "CHAPO ISIDRO". The heading at top left reads exactly: CHAPO ISIDRO
Subtitle lines under it, exactly:
real person · CHAR.make({outfit:'isidro'})
navy cap · red-black plaid western shirt · dark jeans · silver buckle · brown boots

BODY: same toy-like 3D figure as the reference: a matte warm-white porcelain sphere head sitting right on the collar (no neck), big simple drawn face (black oval eyes with a tiny white catchlight, thin arched brows, simple line mouth), big smooth round white mitten hands with a thumb bump (no separate fingers; one finger only on POINT). Slightly shorter and stockier than the President (he is 5'6"), same big-head proportions.
FACE EXTRA: a short, neat black mustache drawn on the face in the same flat line style as the brows, sitting just above the mouth, visible in every view and every expression.
OUTFIT: a plain dark navy baseball cap worn forward with a curved brim (no logo, no text); a long-sleeve western shirt in red-and-black buffalo plaid with pearl snap buttons, pointed collar and two chest pockets with pointed flaps, tucked in; dark indigo straight jeans with visible seams and a slight stack at the ankle; a brown leather belt with a large plain oval silver buckle (no design); pointed brown leather cowboy boots with a low heel. Fabric textures like the reference: flannel weave, denim twill, leather.
NOTHING ELSE: no jewelry, no chains, no rings, no weapons, no holster, no logos, no text on clothes.

LAYOUT (same as the reference):
Row 1, four big panels: FRONT, 3/4, SIDE, BACK (neutral stance, arms at sides).
Row 2, eight panels: POINT, WAVE, SHRUG, CROSS, THINK, FACEPALM, HIPS, TADA (same poses as the reference).
Row 3, seven head-and-shoulders panels: SMILE, HAPPY, SURPRISED, SMIRK, WORRIED, FLAT, BLINK (same expressions as the reference, mustache on all of them).
Extra panel at the end of row 3: HANDCUFFED (full body, wrists together in front of the belt in simple silver handcuffs, head slightly down, FLAT face).
Each label in bold dark capitals under its panel, spelled exactly as written here. No other text.
```

**If it drifts** (in the same chat): `Same sheet, but closer to the attached reference: same porcelain sphere head, same mitten hands, same lighting and background. Keep the plaid shirt, navy cap, mustache and boots.`
