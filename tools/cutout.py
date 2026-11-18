#!/usr/bin/env python3
"""Pre-cut a green-screen prop whose subject is itself green (cash, leaves, a bill).
Only green connected to the image border becomes transparent, so green inside the subject survives.
Usage: python3 tools/cutout.py videos/<slug>/art/P08_x.png   ->   P08_x.cut.png (the kit skips keying *.cut.png)"""
import sys
import numpy as np
from PIL import Image, ImageDraw, ImageFilter

src = sys.argv[1]
a = np.asarray(Image.open(src).convert('RGB')).astype(float) / 255
g = a[..., 1] - np.maximum(a[..., 0], a[..., 2])
mask = Image.fromarray(((g > 0.30) * 255).astype(np.uint8)).copy()   # strong green (copy: fromarray buffers are read-only)
H, W = g.shape
for x, y in [(x, 0) for x in range(W)] + [(x, H - 1) for x in range(W)] + [(0, y) for y in range(H)] + [(W - 1, y) for y in range(H)]:
    if mask.getpixel((x, y)) == 255: ImageDraw.floodfill(mask, (x, y), 128)   # green touching the border
bg = np.asarray(Image.fromarray((np.asarray(mask) == 128).astype(np.uint8) * 255).filter(ImageFilter.MaxFilter(5))) > 0  # eat the fringe
alpha = Image.fromarray(((~bg) * 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(1.2))
edge = (np.asarray(alpha) < 250) & (np.asarray(alpha) > 0)
rgb = a.copy(); m = np.maximum(rgb[..., 0], rgb[..., 2])
rgb[..., 1] = np.where(edge, np.minimum(rgb[..., 1], m + 0.05), rgb[..., 1])   # despill edges only
out = Image.fromarray((rgb * 255).astype(np.uint8)); out.putalpha(alpha)
dst = src.rsplit('.', 1)[0] + '.cut.png'; out.save(dst); print(dst)
