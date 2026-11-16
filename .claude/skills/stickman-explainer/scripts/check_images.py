#!/usr/bin/env python3
"""Check the user's images against the pack.

  python3 check_images.py videos/<slug>/bible.json [--images DIR]

Reads images_expected.json (written by build_pack.py) and the images folder (default <slug>/images).
Reports missing files, non-16:9 images and images below 3840x2160 (ultra-HD is mandatory), and
writes sheets/images_grid.jpg (all images, labelled) for the visual consistency review.
Accepts .png/.jpg/.jpeg/.webp with the expected base name. Exit code 1 if anything fails.
"""
import json, os, sys, argparse
from PIL import Image, ImageDraw, ImageFont

def main():
    ap = argparse.ArgumentParser(); ap.add_argument('bible'); ap.add_argument('--images')
    a = ap.parse_args(); base = os.path.dirname(os.path.abspath(a.bible))
    exp = json.load(open(os.path.join(base, 'images_expected.json')))
    d = a.images or os.path.join(base, 'images'); mw, mh = exp['min_w'], exp['min_h']
    found = {os.path.splitext(f)[0]: f for f in os.listdir(d)} if os.path.isdir(d) else {}
    missing, small, ratio, ok = [], [], [], []
    for e in exp['files']:
        stem = os.path.splitext(e['file'])[0]
        if stem not in found: missing.append(e['file']); continue
        p = os.path.join(d, found[stem]); im = Image.open(p); w, h = im.size
        if abs(w / h - 16 / 9) > 0.02: ratio.append(f"{found[stem]} ({w}x{h})")
        if w < mw or h < mh: small.append(f"{found[stem]} ({w}x{h})")
        ok.append((stem, p))
    print(f"images: {len(ok)}/{len(exp['files'])} present")
    for title, lst in (("MISSING", missing), ("NOT 16:9", ratio), (f"BELOW ULTRA-HD {mw}x{mh}", small)):
        if lst: print(f"{title} ({len(lst)}):\n  " + "\n  ".join(lst))
    if ok:
        os.makedirs(os.path.join(base, 'sheets'), exist_ok=True)
        tw, th = 384, 216; cols = 5; rows = (len(ok) + cols - 1) // cols
        g = Image.new('RGB', (cols * tw, rows * (th + 18)), (15, 15, 15)); dr = ImageDraw.Draw(g)
        try: font = ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf', 12)
        except Exception: font = ImageFont.load_default()
        for i, (stem, p) in enumerate(ok):
            im = Image.open(p).convert('RGB'); im.thumbnail((tw, th))
            x, y = (i % cols) * tw, (i // cols) * (th + 18)
            g.paste(im, (x, y + 18)); dr.text((x + 4, y + 2), stem, fill=(255, 220, 90), font=font)
        out = os.path.join(base, 'sheets', 'images_grid.jpg'); g.save(out, quality=85); print('grid:', out)
    sys.exit(1 if (missing or small or ratio) else 0)

if __name__ == '__main__':
    main()
