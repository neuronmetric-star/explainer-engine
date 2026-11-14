#!/usr/bin/env python3
"""Remove a pure-green (#00FF00) background from a ChatGPT character image -> transparent PNG with soft fur edges.
Usage: python3 tools/keygreen.py in.(png|webp|jpg) out.png
       python3 tools/keygreen.py --pair closed.webp open.webp closed.png open.png
         (talking poses: both are cropped to the SAME box so the mouth flap never jumps, and the open frame keeps
          ONLY its mouth(s) pasted onto the closed frame, so the body doesn't shimmer when ChatGPT repaints it)"""
import sys, numpy as np
from PIL import Image, ImageFilter

def key(src):
    im = np.asarray(Image.open(src).convert('RGB')).astype(np.float32) / 255
    r, g, b = im[..., 0], im[..., 1], im[..., 2]
    excess = g - np.maximum(r, b)                      # how much greener than the other channels
    alpha = 1 - np.clip((excess - 0.05) / 0.25, 0, 1)  # soft ramp: <0.08 opaque, >0.40 transparent
    g2 = np.where(excess > 0, (r + b) / 2, g)          # despill: pull leftover green on edges back to max of r/b
    img = Image.fromarray((np.dstack([r, g2, b, alpha]) * 255).astype(np.uint8), 'RGBA')
    a = img.getchannel('A').filter(ImageFilter.MinFilter(3)).filter(ImageFilter.GaussianBlur(0.6))  # shave halo, soften
    img.putalpha(a)
    return img

def bbox(img):
    return img.getchannel('A').point(lambda v: 255 if v > 10 else 0).getbbox()

def crop(img, bb):
    return img.crop((max(0, bb[0] - 4), max(0, bb[1] - 4), min(img.width, bb[2] + 4), min(img.height, bb[3] + 4)))

if sys.argv[1] == '--pair':
    a, b = key(sys.argv[2]), key(sys.argv[3])
    if a.size != b.size: sys.exit('pair images must be the same size')
    ba, bb = bbox(a), bbox(b)
    u = (min(ba[0], bb[0]), min(ba[1], bb[1]), max(ba[2], bb[2]), max(ba[3], bb[3]))
    # mouth-only patch: strongest local differences in the top 45% (faces); handles several mouths (twins)
    d = np.abs(np.asarray(a.convert('RGB')).astype(int) - np.asarray(b.convert('RGB')).astype(int)).sum(2).astype(np.float32)
    d[int(u[1] + (u[3] - u[1]) * .45):] = 0
    m = Image.fromarray(np.clip(d, 0, 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(6))
    m = m.point(lambda v: 255 if v > 45 else 0).filter(ImageFilter.MaxFilter(31)).filter(ImageFilter.GaussianBlur(8))
    b = Image.composite(b, a, m)
    print('mouth patch area:', m.point(lambda v: 255 if v > 128 else 0).getbbox())
    for img, dst in ((a, sys.argv[4]), (b, sys.argv[5])):
        img = crop(img, u); img.save(dst); print(f'{dst}: {img.width}x{img.height}')
else:
    img = key(sys.argv[1]); bb = bbox(img)
    if bb: img = crop(img, bb)
    img.save(sys.argv[2]); print(f'{sys.argv[2]}: {img.width}x{img.height}')
