#!/usr/bin/env python3
"""Make upload copies of the scenes to animate (1920x1080 JPEG, small and fast to upload).

  python3 prep_upload.py videos/<slug>/bible.json

Writes <slug>/upload/scene_NNN.jpg for every scene with "animate": true and prints, per file,
the size in bytes (needed by openart_upload_sign). The 4K originals stay untouched for the stills.
"""
import json, os, sys
from PIL import Image

def main():
    bp = sys.argv[1]; base = os.path.dirname(os.path.abspath(bp)); b = json.load(open(bp))
    src = os.path.join(base, 'images'); dst = os.path.join(base, 'upload'); os.makedirs(dst, exist_ok=True)
    have = {os.path.splitext(f)[0]: f for f in os.listdir(src)}
    for s in b['scenes']:
        if not s.get('animate'): continue
        stem = f"scene_{int(s['n']):03d}"
        if stem not in have: print(stem, 'MISSING'); continue
        im = Image.open(os.path.join(src, have[stem])).convert('RGB'); im = im.resize((1920, 1080), Image.LANCZOS)
        out = os.path.join(dst, stem + '.jpg'); im.save(out, quality=92)
        print(stem, os.path.getsize(out), out)

if __name__ == '__main__':
    main()
