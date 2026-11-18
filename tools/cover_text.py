#!/usr/bin/env python3
"""Draw the cover headline on a frame. Usage: cover_text.py in.png out.jpg "LINE 1|LINE 2|LINE 3"
First line white, the rest gold, thick black outline, top quarter of the frame (clear of TikTok/Reels buttons)."""
import sys
from PIL import Image, ImageDraw, ImageFont
src, dst, text = sys.argv[1], sys.argv[2], sys.argv[3]
im = Image.open(src).convert('RGB'); W = im.width; d = ImageDraw.Draw(im)
F = ImageFont.truetype('/usr/share/fonts/opentype/inter/InterDisplay-Black.otf', 116)
for i, line in enumerate(text.split('|')):
    size = 116
    while d.textlength(line, font=F) > W - 80 and size > 60:
        size -= 4; F = ImageFont.truetype('/usr/share/fonts/opentype/inter/InterDisplay-Black.otf', size)
    w = d.textlength(line, font=F)
    d.text(((W - w) / 2, 70 + i * 130), line, font=F, fill='white' if i == 0 else (255, 206, 46), stroke_width=14, stroke_fill='black')
    F = ImageFont.truetype('/usr/share/fonts/opentype/inter/InterDisplay-Black.otf', 116)
im.save(dst, quality=92)
