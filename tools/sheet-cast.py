#!/usr/bin/env python3
"""Cut Brian's character sheets (docs/cast/<name>.png) into transparent sprites the engine draws (cast look v2).

Usage:  python3 tools/sheet-cast.py [name ...]        (default: every sheet in docs/cast/)
Output: docs/cast/sprites/<name>/<pose>.png  +  docs/cast/sprites/manifest.js (window.CAST_SPRITES)
Poses:  front, 3q, side, back  ·  point, wave, shrug, cross, think, facepalm, hips, tada  ·  face_<smile|happy|...> (head disc)
        bust_<face> (head + shoulders, for close-ups)
Needs:  pip install rembg onnxruntime scipy pillow   (rembg downloads its isnet model from GitHub once)

Each sheet is a 3-row grid; panel boxes are in LAYOUT (add a new character's sheet there). Labels are dropped as
pieces that sit below the character's feet.
"""
import json, os, sys
import numpy as np
from PIL import Image, ImageFilter
from scipy import ndimage
from rembg import remove, new_session

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
REF = os.path.join(ROOT, 'docs', 'cast')
OUT = os.path.join(ROOT, 'docs', 'cast', 'sprites')
ROWS = [['front', '3q', 'side', 'back'],
        ['point', 'wave', 'shrug', 'cross', 'think', 'facepalm', 'hips', 'tada'],
        ['smile', 'happy', 'surprised', 'smirk', 'worried', 'flat', 'blink']]
session = new_session('isnet-general-use')


def runs(mask, min_len):
    """[start, end) runs of True in a 1-D bool array, at least min_len long."""
    out, s = [], None
    for i, v in enumerate(list(mask) + [False]):
        if v and s is None: s = i
        if not v and s is not None:
            if i - s >= min_len: out.append((s, i))
            s = None
    return out


# Panel layout per sheet (sheet px, measured on Brian's 1323x1189 sheets): row (top, bottom without most of the label),
# then the x positions between panels. A new sheet with the same layout can reuse STD.
STD_X = [[30, 344, 661, 978, 1291], [30, 185, 342, 507, 659, 815, 971, 1128, 1291], [30, 210, 390, 570, 750, 930, 1110, 1291]]
LAYOUT = {
    'doug':      {'y': [(132, 575), (640, 882), (938, 1128)], 'x': STD_X},
    'polo':      {'y': [(131, 568), (633, 884), (940, 1128)], 'x': STD_X},
    'president': {'y': [(130, 582), (642, 892), (947, 1136)], 'x': STD_X},
    'gang':      {'y': [(136, 575), (636, 880), (941, 1132)], 'x': STD_X},
    'gary':      {'y': [(135, 566), (625, 874), (932, 1114)], 'x': STD_X},
    'victor':    {'y': [(111, 558), (624, 868), (934, 1122)],
                  'x': [[21, 345, 661, 980, 1302], [21, 180, 340, 501, 656, 813, 969, 1125, 1302], [21, 206, 391, 575, 757, 937, 1117, 1302]]},
}


def panel_grid(name):
    L = LAYOUT[name]
    return [((y0, y1), [(xs[k], xs[k + 1]) for k in range(len(xs) - 1)], names) for (y0, y1), xs, names in zip(L['y'], L['x'], ROWS)]


def biggest(alpha):
    """Keep the character: the largest piece plus big pieces beside it (a hand); drop labels (pieces below the feet)."""
    m = alpha > 40
    lab, n = ndimage.label(m)
    if n == 0: return alpha
    sizes = ndimage.sum(m, lab, range(1, n + 1)); main = int(np.argmax(sizes)) + 1
    sl = ndimage.find_objects(lab); bottom = sl[main - 1][0].stop
    keep = [i + 1 for i, s in enumerate(sizes) if i + 1 == main or (s > sizes.max() * .03 and sl[i][0].start < bottom - 12)]
    mask = ndimage.binary_dilation(np.isin(lab, keep), iterations=2)
    return (alpha * mask).astype(np.uint8)


def head_circle(alpha):
    """Head = the round top of the silhouette: widest row before the chin narrows."""
    m = alpha > 128; ys = np.where(m.any(axis=1))[0]; top = ys[0]
    widths = []
    for y in range(top, ys[-1]):
        xs = np.where(m[y])[0]; widths.append((xs[-1] - xs[0], (xs[-1] + xs[0]) / 2) if len(xs) else (0, 0))
    w = [x[0] for x in widths]; peak = 0
    for i in range(1, len(w)):
        if w[i] >= w[peak]: peak = i
        elif w[i] < w[peak] * .8 and i > 10: break
    d = w[peak]; cx = widths[peak][1]
    return {'cx': float(cx), 'cy': float(top + d / 2), 'r': float(d / 2)}


def cut(im, box):
    x0, y0, x1, y1 = box
    crop = im.crop(box).convert('RGB')
    rgba = remove(crop, session=session)
    a = np.asarray(rgba).copy(); a[..., 3] = biggest(a[..., 3])
    out = Image.fromarray(a); bb = out.getbbox()
    return out.crop(bb) if bb else out


def build(name):
    im = Image.open(os.path.join(REF, name + '.png'))
    d = os.path.join(OUT, name); os.makedirs(d, exist_ok=True)
    man = {}
    for ri, ((y0, y1), cols, names) in enumerate(panel_grid(name)):
        for (x0, x1), pose in zip(cols, names):
            box = (x0 + 5, y0, x1 - 5, y1)
            spr = cut(im, box)
            if ri < 2:
                spr.save(os.path.join(d, pose + '.png'))
                hc = head_circle(np.asarray(spr)[..., 3])
                man[pose] = {'file': f'{name}/{pose}.png', 'w': spr.width, 'h': spr.height, 'head': hc}
            else:
                spr = spr.crop((0, 0, spr.width, spr.height - 6))                  # drop the panel's bottom edge under the shoulders
                spr.save(os.path.join(d, 'bust_' + pose + '.png'))
                man['bust_' + pose] = {'file': f'{name}/bust_{pose}.png', 'w': spr.width, 'h': spr.height}
                hc = head_circle(np.asarray(spr)[..., 3]); r = hc['r'] * 1.02
                # face disc: the head only, soft round edge, for swapping expressions on the front view
                fx0, fy0 = round(hc['cx'] - r), round(hc['cy'] - r); disc = spr.crop((fx0, fy0, fx0 + round(2 * r), fy0 + round(2 * r)))
                circ = Image.new('L', disc.size, 0); yy, xx = np.mgrid[:disc.height, :disc.width]
                rr = np.hypot(xx - disc.width / 2, yy - disc.height / 2)
                circ = Image.fromarray((np.clip((r - rr) / 2.0, 0, 1) * 255).astype(np.uint8))
                da = np.asarray(disc).copy(); da[..., 3] = np.minimum(da[..., 3], np.asarray(circ)); Image.fromarray(da).save(os.path.join(d, 'face_' + pose + '.png'))
                man['face_' + pose] = {'file': f'{name}/face_{pose}.png', 'w': disc.width, 'h': disc.height}
            print(name, pose if ri < 2 else 'bust/face ' + pose, spr.size)
    return man


if __name__ == '__main__':
    names = sys.argv[1:] or sorted(f[:-4] for f in os.listdir(REF) if f.endswith('.png'))
    mf = os.path.join(OUT, 'manifest.js'); allm = {}
    if os.path.exists(mf):
        txt = open(mf).read(); allm = json.loads(txt[txt.index('{'):txt.rindex('}') + 1])
    for n in names: allm[n] = build(n)
    os.makedirs(OUT, exist_ok=True)
    with open(mf, 'w') as f:
        f.write('// Generated by tools/sheet-cast.py from docs/cast/*.png. Sprite sizes in px; head = circle in sprite px.\n')
        f.write('window.CAST_SPRITES = ' + json.dumps(allm, indent=1) + ';\n')
    print('manifest ->', mf)
