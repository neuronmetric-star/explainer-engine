#!/usr/bin/env python3
"""Make a foreground occluder: the part of a painting that should sit IN FRONT of the 3D cast (a tray table, a counter, a desk).
Cuts the painting to a polygon (the object's real outline, image px) so bodies are never cut by a straight line.

Usage: python3 tools/occluder.py <slug> <painting.png> <out-name> "x,y x,y x,y ..."
  -> videos/<slug>/art/<out-name>.cut.png  (cropped to the polygon's bounding box; prints the center + width for K.prop)
In scene.js: props: { TRAY: '<out-name>.cut.png' }  then each frame after the cast:
  const p = K.img(cx, cy); K.prop('TRAY', { x: p.x, y: p.y, w: width * K.imgScale() });
"""
import sys
from PIL import Image, ImageDraw
slug, src, name, pts = sys.argv[1:5]
poly = [tuple(int(v) for v in p.split(',')) for p in pts.split()]
art = f'videos/{slug}/art/'
im = Image.open(art + src).convert('RGBA'); m = Image.new('L', im.size, 0); ImageDraw.Draw(m).polygon(poly, fill=255)
im.putalpha(m)
x0, y0 = min(p[0] for p in poly), min(p[1] for p in poly); x1, y1 = max(p[0] for p in poly), max(p[1] for p in poly)
im.crop((x0, y0, x1, y1)).save(art + name + '.cut.png')
print(f'{art}{name}.cut.png  center=({(x0 + x1) / 2:.0f},{(y0 + y1) / 2:.0f})  width={x1 - x0}')
