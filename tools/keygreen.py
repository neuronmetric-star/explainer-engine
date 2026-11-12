#!/usr/bin/env python3
"""Remove a pure-green (#00FF00) background from a ChatGPT character image -> transparent PNG with soft fur edges.
Usage: python3 tools/keygreen.py in.(png|webp|jpg) out.png"""
import sys, numpy as np
from PIL import Image, ImageFilter
src, dst = sys.argv[1], sys.argv[2]
im = np.asarray(Image.open(src).convert('RGB')).astype(np.float32) / 255
r, g, b = im[..., 0], im[..., 1], im[..., 2]
excess = g - np.maximum(r, b)                      # how much greener than the other channels
alpha = 1 - np.clip((excess - 0.05) / 0.25, 0, 1)  # soft ramp: <0.08 opaque, >0.40 transparent
# despill: pull leftover green on edges (fur) back to the max of r/b
g2 = np.where(excess > 0, (r + b) / 2, g)
out = np.dstack([r, g2, b, alpha])
img = Image.fromarray((out * 255).astype(np.uint8), 'RGBA')
a = img.getchannel('A').filter(ImageFilter.MinFilter(3)).filter(ImageFilter.GaussianBlur(0.6))  # shave the green halo, soften
img.putalpha(a)
bbox = img.getchannel('A').point(lambda v: 255 if v > 10 else 0).getbbox()
if bbox: img = img.crop((max(0, bbox[0] - 4), max(0, bbox[1] - 4), min(img.width, bbox[2] + 4), min(img.height, bbox[3] + 4)))
img.save(dst)
print(f'{dst}: {img.width}x{img.height}')
