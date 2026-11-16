#!/usr/bin/env python3
"""Build the copy-paste image prompt pack, voice script and line files from a bible.

  python3 build_pack.py videos/<slug>/bible.json

Writes next to the bible:
  prompt_pack.md     paste into ChatGPT (agent) to generate every image, in order
  voice_script.md    TTS-ready narration + voice direction
  lines.txt          display lines (captions), one per scene
  lines_spoken.txt   spoken lines (numbers as words), one per scene
  animate.txt        scenes to animate with their PixVerse motion prompts
  images_expected.json  file names + minimum sizes, used by check_images.py
Descriptors are pasted verbatim everywhere: edit the bible, never the pack.
"""
import json, os, sys

STYLE = ("Stylised 3D animated-film still, soft clay-like 3D render with fine surface detail, warm cinematic "
         "Pixar-short lighting, gentle global illumination, soft ambient occlusion, gentle depth of field. "
         "Characters are 3D stickmen: a perfectly smooth glossy WHITE BALL HEAD with NO ears, NO nose and NO hair, "
         "the face DRAWN on the ball in simple flat black lines (two dot eyes, thin eyebrows, small curved mouth), "
         "never sculpted and never realistic; a thin black stick neck; white mitten hands with 4 fingers; "
         "clothes made of real fabric with visible texture. Ultra-high-definition, razor-sharp, clean, noise-free.")
TAIL = ("16:9 landscape. No text, no letters, no numbers, no logos, no watermark, no border, no captions, "
        "no extra limbs, no realistic human faces.")
UHD = "3840×2160"

def load(p):
    b = json.load(open(p)); base = os.path.dirname(os.path.abspath(p)); return b, base

def idx(items): return {x['id']: x for x in items}

def main():
    b, base = load(sys.argv[1])
    style = b.get('style') or STYLE
    C, L, P = idx(b.get('characters', [])), {}, idx(b.get('props', []))
    for loc in b.get('locations', []):
        L[loc['id']] = dict(loc, base=None)
        for v in loc.get('variants', []):
            L[v['id']] = dict(id=v['id'], descriptor=loc['descriptor'], changes=v['changes'], base=loc['id'])
    expected = []; out = []; W = out.append
    title = b.get('title', b.get('slug', 'video'))
    W(f"# Image prompt pack: {title}\n")
    W("## 0. Instructions for the image agent (paste this first)\n")
    W("```\nYou will generate a set of images for a 3D animated explainer video. Follow these rules for EVERY image:\n"
      f"1. Format: 16:9 landscape. Final saved file must be a PNG of at least {UHD} pixels (ultra-HD). If the image model "
      f"outputs smaller, upscale it to exactly {UHD} with a high-quality AI upscaler before saving. Never stretch or crop to fake 16:9.\n"
      "2. Save each image with the EXACT file name given (e.g. char_RAY.png). Keep all files in one folder.\n"
      "3. Work strictly in the order given. When a prompt says ATTACH, attach those exact earlier files as reference images "
      "and copy the character design, outfit, colours, location layout and props from them exactly.\n"
      "4. No text, letters, numbers, logos, watermarks, borders or captions in any image unless the prompt quotes exact text.\n"
      "5. Faces are always flat drawn black lines on a white ball head. Never realistic faces, never ears, noses or hair on the ball.\n"
      "6. If an image breaks a rule (wrong outfit, wrong count, extra limbs, text), regenerate it before moving on.\n"
      "When finished, give me all files as one zip or list.\n```\n")
    W(f"**Style block (pasted into every prompt):** {style}\n")
    n = 0
    W("## 1. Character sheets\n")
    for c in b.get('characters', []):
        n += 1; fn = f"char_{c['id']}.png"; expected.append(dict(file=fn, kind='sheet'))
        W(f"### {n}. `{fn}` ({c.get('name', c['id'])})\n```\n{style}\n"
          f"Character reference sheet of {c.get('name', c['id'])}: {c['descriptor']}\n"
          "Show five full-body views evenly spaced at the same scale on one plain light-grey studio backdrop: front, 3/4, side, back, "
          "and front in a natural action pose. Below them, three head close-ups: happy, shocked, determined. "
          f"Identical outfit and colours in every view. {TAIL}\n```\n")
    W("## 2. Location plates (empty, master camera angle)\n")
    for loc in b.get('locations', []):
        n += 1; fn = f"loc_{loc['id']}.png"; expected.append(dict(file=fn, kind='plate'))
        W(f"### {n}. `{fn}`\n```\n{style}\nEmpty establishing plate of a location, no people: {loc['descriptor']}\n"
          f"Master camera angle, medium-wide, eye level. This exact layout will be reused for many scenes. {TAIL}\n```\n")
        for v in loc.get('variants', []):
            n += 1; fv = f"loc_{v['id']}.png"; expected.append(dict(file=fv, kind='plate'))
            W(f"### {n}. `{fv}`\nATTACH: `{fn}`\n```\n{style}\nThe SAME location as the attached plate, same layout, same camera angle, "
              f"same furniture positions, no people. Change ONLY: {v['changes']}\n{TAIL}\n```\n")
    if b.get('props'):
        n += 1; fn = "props.png"; expected.append(dict(file=fn, kind='sheet'))
        lst = "; ".join(f"({i+1}) {p['descriptor']}" for i, p in enumerate(b['props']))
        W(f"## 3. Prop sheet\n### {n}. `{fn}`\n```\n{style}\nProp reference sheet on a plain light-grey studio backdrop, "
          f"objects evenly spaced at consistent real-world scale: {lst}. {TAIL}\n```\n")
    W("## 4. Scenes (one image per narration line)\n")
    anim = []
    for s in b['scenes']:
        k = int(s['n']); fn = f"scene_{k:03d}.png"; expected.append(dict(file=fn, kind='scene', n=k))
        att = [f"char_{c}.png" for c in s.get('chars', [])]
        loc = L.get(s.get('location')) if s.get('location') else None
        if loc: att.append(f"loc_{loc['id']}.png")
        if s.get('props'): att.append("props.png")
        lines = [style, f"SCENE {k}{(' (' + s['chapter'] + ')') if s.get('chapter') else ''}."]
        for cid in s.get('chars', []):
            c = C[cid]; lines.append(f"CHARACTER {c.get('name', cid)} exactly as in char_{cid}.png: {c['descriptor']}")
        if loc:
            desc = loc['descriptor'] + (f" Variant: {loc['changes']}" if loc.get('changes') else "")
            lines.append(f"LOCATION exactly as in loc_{loc['id']}.png (same layout, same furniture, same light): {desc}")
        for pid in s.get('props', []):
            lines.append(f"PROP {pid} exactly as in props.png: {P[pid]['descriptor']}")
        for pid, cnt in (s.get('count') or {}).items():
            pr = P.get(pid, {}); noun = pr.get('plural') or (pid.lower() + ' objects')
            if int(cnt) == 1: noun = pr.get('singular') or (noun[:-1] if noun.endswith('s') else noun)
            lines.append(f"COUNT RULE: there must be EXACTLY {cnt} {noun} visible, "
                         "standing apart from each other in one row, every one fully visible and countable, none hidden behind anyone.")
        lines.append(f"MOMENT: {s['moment']}")
        lines.append(f"CAMERA: {s.get('camera', 'medium-wide, eye level, subject in the centre third')}. "
                     "Keep the bottom 20% of the frame calm (captions go there).")
        tail = TAIL if not s.get('text') else TAIL.replace("No text, no letters, no numbers, ", f"The only text in the image is exactly \"{s['text']}\"; no other ")
        lines.append(tail)
        W(f"### {n + k}. `{fn}`{'  (ANIMATED)' if s.get('animate') else ''}\nLine: “{s['line']}”\n"
          + (f"ATTACH: {', '.join('`'+a+'`' for a in att)}\n" if att else "") + "```\n" + "\n".join(lines) + "\n```\n")
        if s.get('animate'):
            who = "; ".join(f"{C[c].get('name', c)} keeps the exact same design and outfit" for c in s.get('chars', []))
            anim.append(dict(n=k, line=s['line'], prompt=(
                "Animate this frame. LOCK: keep the exact 3D clay art style, the characters' designs and outfits"
                + (f" ({who})" if who else "") + ", the set and every object exactly as in the start frame; heads stay smooth white balls with "
                "flat drawn faces; exactly two arms and two legs per character; no objects appear or disappear; one continuous shot, no cuts.\n"
                f"ACTION: {s.get('motion', s['moment'])}\nCAMERA: {s.get('camera_move', 'slow push-in')}.\n"
                f"AUDIO: {('sound effects only: ' + s['sfx'] + '. ') if s.get('sfx') else ''}No music, no speech, no voices, no singing.")))
    nn = n + len(b['scenes'])
    if b.get('thumbnails'):
        W("## 5. Thumbnails\n")
        for i, t in enumerate(b['thumbnails']):
            fn = f"thumb_{t.get('id', chr(65 + i))}.png"; expected.append(dict(file=fn, kind='thumb'))
            att = [f"char_{c}.png" for c in t.get('chars', [])] + ([f"loc_{t['location']}.png"] if t.get('location') else [])
            body = [style, "YouTube thumbnail, bold and readable at small size, one clear focal point, strong contrast, saturated colours."]
            for cid in t.get('chars', []): body.append(f"CHARACTER {C[cid].get('name', cid)} exactly as in char_{cid}.png: {C[cid]['descriptor']}")
            body.append(f"MOMENT: {t['moment']}")
            body.append(f"Large bold text overlay, top-left third, exactly: \"{t['overlay']}\" (white letters with a thick black outline). No other text.")
            body.append("16:9 landscape, no watermark, no border.")
            W(f"### {nn + i + 1}. `{fn}`\n" + (f"ATTACH: {', '.join('`'+a+'`' for a in att)}\n" if att else "") + "```\n" + "\n".join(body) + "\n```\n")
    open(os.path.join(base, 'prompt_pack.md'), 'w', encoding='utf8').write("\n".join(out))
    # voice script
    v = b.get('voice', {})
    vs = [f"# Voice script: {title}\n", "## Voice direction (paste into the voice tool's style / instructions box)\n",
          "```\n" + v.get('direction', "Warm, confident male storyteller, documentary pace (about 150 words per minute), clear and "
                                       "friendly, slight curiosity in questions, punchy on numbers. No music, no effects.") + "\n```\n",
          "## Narration (paste as is; keep the blank lines, they become pauses)\n",
          "Generate as ONE file (or one file per chapter for long videos, named ch01.mp3, ch02.mp3…). Do not add or skip words.\n", "```"]
    ch = None
    for s in b['scenes']:
        if s.get('chapter') and s['chapter'] != ch and b.get('type') == 'long':
            ch = s['chapter']; vs.append(f"\n[{ch}]")
        vs.append(s.get('spoken', s['line'])); vs.append("")
    vs.append("```")
    open(os.path.join(base, 'voice_script.md'), 'w', encoding='utf8').write("\n".join(vs))
    open(os.path.join(base, 'lines.txt'), 'w', encoding='utf8').write("\n".join(s['line'] for s in b['scenes']) + "\n")
    open(os.path.join(base, 'lines_spoken.txt'), 'w', encoding='utf8').write("\n".join(s.get('spoken', s['line']) for s in b['scenes']) + "\n")
    with open(os.path.join(base, 'animate.txt'), 'w', encoding='utf8') as f:
        for a in anim: f.write(f"=== scene {a['n']:03d}: {a['line']}\n{a['prompt']}\n\n")
    json.dump(dict(min_w=3840, min_h=2160, files=expected), open(os.path.join(base, 'images_expected.json'), 'w'), indent=1)
    words = sum(len(s.get('spoken', s['line']).split()) for s in b['scenes'])
    print(f"pack: {len(expected)} images ({len(b['scenes'])} scenes, {len(anim)} animated); voice: {words} words "
          f"(~{words / 150:.1f} min at 150 wpm)")

if __name__ == '__main__':
    main()
