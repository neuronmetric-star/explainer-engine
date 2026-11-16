"""2.5D animation engine for the stickman scenes (no AI video).

Each scene = one 4K still + a spec (anim/scenes.py). Rendering happens in "world" space (the 4K
image), then a virtual camera crops/zooms to 1920x1080. Everything is a pure function of t.

Spec keys (all optional):
  cam     : {'kind': in|out|left|right|up|down|keys, 'z': (z0, z1), 'focus': (x, y), 'keys': [(t, z, x, y)], 'ease': 'io'|'lin'}
  shake   : [(t0, t1, amp_px_out)]
  chars   : [{'head': (x, y, r), 'b': bottom_y, 'breathe': 0.006, 'period': 3.2, 'blink': True,
              'tilt': fn(t)->(deg, dx, dy) or None, 'hair': True, 'look': fn(t)->(ex, ey), 'eyes': [...] }]
  layers  : list of drawable dicts, drawn in order on top of the characters (see LAYERS below)
  under   : same, drawn before the characters
  text    : [{'s': '2003', 'pos': (x, y) screen px, 'size': 74, 't0': 0, 't1': None}]
  sfx     : [(name, t, gain_db, {kwargs})]
"""
import math, os, subprocess, sys, json
import numpy as np, cv2

W4, H4 = 3840, 2160
OW, OH, FPS = 1920, 1080, 30
HERE = os.path.dirname(os.path.abspath(__file__))
EP = os.path.dirname(HERE)
sys.path.insert(0, HERE)
import sfx as SFX

# ------------------------------------------------------------------ easing / helpers
def clamp01(x): return 0.0 if x < 0 else 1.0 if x > 1 else x
def ease(x): x = clamp01(x); return x * x * (3 - 2 * x)
def ease_out(x): x = clamp01(x); return 1 - (1 - x) ** 3
def ease_in(x): x = clamp01(x); return x ** 3
def win(t, a, b): return ease((t - a) / (b - a)) if b > a else float(t >= a)
def pulse(t, a, b): """0 -> 1 -> 0 between a and b"""; return math.sin(math.pi * clamp01((t - a) / (b - a))) if b > a else 0.0
def back_out(x, s=1.70158): x = clamp01(x) - 1; return 1 + x * x * ((s + 1) * x + s)
def spring(t, t0, freq=3.0, damp=4.0):
    """1 - damped cosine from t0: overshoots then settles at 1."""
    if t < t0: return 0.0
    u = t - t0; return 1 - math.exp(-damp * u) * math.cos(2 * math.pi * freq * u)

def keyed(t, keys, k_ease=ease):
    """keys: [(t, value_tuple)], linear segments with easing"""
    if t <= keys[0][0]: return keys[0][1]
    for (ta, va), (tb, vb) in zip(keys, keys[1:]):
        if t <= tb:
            u = k_ease((t - ta) / (tb - ta)) if tb > ta else 1
            return tuple(a + (b - a) * u for a, b in zip(va, vb))
    return keys[-1][1]

def roi_clip(x0, y0, x1, y1, w=W4, h=H4):
    return max(0, int(x0)), max(0, int(y0)), min(w, int(x1)), min(h, int(y1))

def blend(dst, src, a):
    """dst[...] = dst*(1-a) + src*a  (a float HxW or HxWx1), in place on uint8"""
    if a.ndim == 2: a = a[..., None]
    dst[...] = (dst.astype(np.float32) * (1 - a) + src.astype(np.float32) * a + 0.5).astype(np.uint8)

def inpaint_roi(img, mask, pad=40, radius=7):
    ys, xs = np.nonzero(mask)
    if len(xs) == 0: return img
    x0, y0, x1, y1 = roi_clip(xs.min() - pad, ys.min() - pad, xs.max() + pad, ys.max() + pad)
    s = 2 if (x1 - x0) * (y1 - y0) > 600 * 600 else 1     # big holes: inpaint at half res, then upscale
    roi = img[y0:y1, x0:x1]; m = mask[y0:y1, x0:x1]
    if s == 2:
        small = cv2.resize(roi, ((x1 - x0) // 2, (y1 - y0) // 2), interpolation=cv2.INTER_AREA)
        ms = cv2.resize(m, small.shape[1::-1], interpolation=cv2.INTER_NEAREST)
        fill = cv2.resize(cv2.inpaint(small, ms, radius, cv2.INPAINT_TELEA), (x1 - x0, y1 - y0), interpolation=cv2.INTER_CUBIC)
    else:
        fill = cv2.inpaint(roi, m, radius, cv2.INPAINT_TELEA)
    a = cv2.GaussianBlur((m > 0).astype(np.float32), (0, 0), 2)
    out = img.copy(); r = out[y0:y1, x0:x1]; blend(r, fill, np.maximum(a, (m > 0)))
    return out


def smooth_fill(img, mask, sigma=60, pad=None):
    """fill mask with a smooth multi-scale blend of the surrounding background (plain studio backdrops)."""
    ys, xs = np.nonzero(mask)
    if len(xs) == 0: return img
    pad = pad or int(sigma * 6)
    x0, y0, x1, y1 = roi_clip(xs.min() - pad, ys.min() - pad, xs.max() + pad, ys.max() + pad)
    q = 4; roi = img[y0:y1, x0:x1].astype(np.float32); m = (mask[y0:y1, x0:x1] > 0)
    w = (~m).astype(np.float32); sz = ((x1 - x0) // q, (y1 - y0) // q)
    sm0 = cv2.resize(roi * w[..., None], sz, interpolation=cv2.INTER_AREA); sw0 = cv2.resize(w, sz, interpolation=cv2.INTER_AREA)
    fill = None
    for sg in (sigma * 16, sigma * 8, sigma * 4, sigma * 2, sigma):
        sm = cv2.GaussianBlur(sm0, (0, 0), sg / q); sw = cv2.GaussianBlur(sw0, (0, 0), sg / q)
        f = sm / np.maximum(sw[..., None], 1e-6)
        if fill is None: fill = f
        else: k = np.clip(sw / 0.25, 0, 1)[..., None]; fill = f * k + fill * (1 - k)
    fill = cv2.resize(fill, (x1 - x0, y1 - y0), interpolation=cv2.INTER_CUBIC)
    fill += np.random.default_rng(0).normal(0, 0.8, fill.shape).astype(np.float32)   # keep a hint of grain
    a = cv2.GaussianBlur(m.astype(np.float32), (0, 0), 3)
    a = np.maximum(a, m)[..., None]
    out = img.copy(); out[y0:y1, x0:x1] = np.clip(roi * (1 - a) + fill * a, 0, 255).astype(np.uint8)
    return out

def poly_backdrop(img, exclude, deg=3):
    """least-squares 2D polynomial fit of the backdrop (pixels outside `exclude`), evaluated on the whole frame."""
    q = 16; h, w = img.shape[:2]
    sm = cv2.resize(img, (w // q, h // q), interpolation=cv2.INTER_AREA).astype(np.float32)
    ex = cv2.resize(exclude, (w // q, h // q), interpolation=cv2.INTER_NEAREST) > 0
    yy, xx = np.mgrid[0:h // q, 0:w // q].astype(np.float32); xx /= (w // q); yy /= (h // q)
    terms = [xx ** i * yy ** j for i in range(deg + 1) for j in range(deg + 1 - i)]
    A = np.stack([t[~ex] for t in terms], 1)
    out = np.zeros_like(sm)
    for c in range(3):
        coef, *_ = np.linalg.lstsq(A, sm[..., c][~ex], rcond=None)
        out[..., c] = sum(k * t for k, t in zip(coef, terms))
    return cv2.resize(out, (w, h), interpolation=cv2.INTER_CUBIC)

def row_fill(img, mask):
    """fill each masked run by interpolating between the unmasked pixels left and right of it (keeps horizontal edges)."""
    out = img.copy(); m = mask > 0
    ys = np.nonzero(m.any(1))[0]
    for y in ys:
        row = m[y]; xs = np.nonzero(row)[0]
        runs = np.split(xs, np.nonzero(np.diff(xs) > 1)[0] + 1)
        for r in runs:
            a, b = r[0] - 1, r[-1] + 1
            ca = out[y, max(a, 0)].astype(np.float32) if a >= 0 else None
            cb = out[y, min(b, img.shape[1] - 1)].astype(np.float32) if b < img.shape[1] else None
            if ca is None: ca = cb
            if cb is None: cb = ca
            u = np.linspace(0, 1, len(r) + 2)[1:-1, None]
            out[y, r] = (ca * (1 - u) + cb * u).astype(np.uint8)
    blur = cv2.GaussianBlur(out, (0, 0), 3)
    a = cv2.GaussianBlur(m.astype(np.float32), (0, 0), 2)[..., None]
    return (out * (1 - a) + blur * a).astype(np.uint8)

def poly_mask(shape, pts):
    m = np.zeros(shape[:2], np.uint8); cv2.fillPoly(m, [np.array(pts, np.int32)], 255); return m

def fg_mask(img, rect, tol=26, bg=None):
    """foreground = pixels inside rect that differ from the background colour (plain studio scenes)."""
    x0, y0, x1, y1 = roi_clip(*rect)
    roi = img[y0:y1, x0:x1].astype(np.int16)
    if bg is None:
        border = np.concatenate([roi[0], roi[-1], roi[:, 0], roi[:, -1]])
        bg = np.median(border, axis=0)
    d = np.abs(roi - np.array(bg, np.int16)).sum(2)
    m = (d > tol).astype(np.uint8) * 255
    m = cv2.morphologyEx(m, cv2.MORPH_OPEN, np.ones((5, 5), np.uint8))
    m = cv2.morphologyEx(m, cv2.MORPH_CLOSE, np.ones((15, 15), np.uint8))
    n, lab, st, _ = cv2.connectedComponentsWithStats(m)
    keep = np.zeros_like(m)
    for i in range(1, n):
        if st[i, cv2.CC_STAT_AREA] > 0.01 * m.size: keep[lab == i] = 255
    full = np.zeros(img.shape[:2], np.uint8); full[y0:y1, x0:x1] = keep
    return full

# ------------------------------------------------------------------ eyes
def find_eyes(img, X, Y, R):
    x0, y0, x1, y1 = roi_clip(X - R, Y - R, X + R, Y + R)
    roi = img[y0:y1, x0:x1]
    disk = np.zeros(roi.shape[:2], np.uint8); cv2.circle(disk, (X - x0, Y - y0), int(R * 0.85), 255, -1)
    dark = ((cv2.cvtColor(roi, cv2.COLOR_BGR2GRAY) < 80) & (disk > 0)).astype(np.uint8) * 255
    dc, _ = cv2.findContours(dark, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
    eyes = []
    for d in dc:
        da = cv2.contourArea(d); bx, by, bw, bh = cv2.boundingRect(d)
        if not (R * 0.04) < bh < R * 0.32: continue
        if bh < bw * 0.95 or da < bw * bh * 0.55: continue
        eyes.append([x0 + bx + bw / 2, y0 + by + bh / 2, bw / 2, bh / 2])
    best = None
    for i in range(len(eyes)):
        for j in range(i + 1, len(eyes)):
            a, b = eyes[i], eyes[j]; dx, dy = abs(a[0] - b[0]), abs(a[1] - b[1])
            if dy < R * 0.2 and R * 0.15 < dx < R * 1.0 and 0.6 < a[3] / b[3] < 1.6:
                s = dy + abs(a[3] - b[3]) * 2
                if best is None or s < best[0]: best = (s, sorted([a, b]))
    return [tuple(int(round(v)) for v in e) for e in best[1]] if best else []

def blink_curve(t, seed, first=None):
    """deterministic blinks every ~2.6-4.4 s; returns closedness 0..1"""
    r = np.random.default_rng(seed); tb = first if first is not None else r.uniform(0.5, 1.6); c = 0.0
    while tb < t + 0.5:
        d = abs(t - tb)
        if d < 0.085: c = max(c, 1 - d / 0.085)
        tb += r.uniform(2.6, 4.4)
    return c

# ------------------------------------------------------------------ characters
class Char:
    def __init__(self, sc, spec, idx):
        self.sc = sc; s = spec; self.s = s; img = sc.img
        x, y, r = s['head']; self.x, self.y, self.r = x, y, r
        self.b = s.get('b', y + 4 * r)
        self.amp = s.get('breathe', 0.006); self.period = s.get('period', 3.0 + 0.37 * idx)
        self.phase = idx * 1.3
        self.tilt = s.get('tilt'); self.look = s.get('look'); self.stretch = s.get('stretch')
        self.eyes = s['eyes'] if 'eyes' in s else (find_eyes(img, x, y, r) if s.get('blink', True) else [])
        self.seed = sc.n * 31 + idx; self.first_blink = s.get('first_blink')
        # eyes: precompute blank-face patches and eye colour
        self.eye_patches = []
        if self.eyes:
            m = np.zeros(img.shape[:2], np.uint8)
            for (ex, ey, rx, ry) in self.eyes: cv2.ellipse(m, (ex, ey), (rx + 7, ry + 7), 0, 0, 360, 255, -1)
            self.noeye = inpaint_roi(img, m, pad=30, radius=5)
            for (ex, ey, rx, ry) in self.eyes:
                pr = int(max(rx, ry) * 2.2) + 12
                x0, y0, x1, y1 = roi_clip(ex - pr, ey - pr, ex + pr, ey + pr)
                self.eye_patches.append(((x0, y0, x1, y1), self.noeye[y0:y1, x0:x1].copy()))
            ex, ey, rx, ry = self.eyes[0]
            self.eye_col = tuple(int(v) for v in np.median(img[ey - ry // 2:ey + ry // 2 + 1, ex - rx // 2:ex + rx // 2 + 1].reshape(-1, 3), 0))
        # body rectangle (breathing), whole figure unless the head moves on its own
        top = y + 0.55 * r if self.tilt else y - 1.35 * r
        hw = s.get('body_w', 2.0) * r
        self.body = roi_clip(x - hw, top, x + hw, self.b + 4)
        bx0, by0, bx1, by1 = self.body
        m = np.zeros((by1 - by0, bx1 - bx0), np.float32)
        fe = max(8, int(0.18 * min(bx1 - bx0, by1 - by0)))
        m[fe // 2:, fe // 2:-(fe // 2)] = 1; self.body_mask = cv2.GaussianBlur(m, (0, 0), fe / 3)[..., None]
        if self.tilt: self._prep_head()

    def _prep_head(self):
        sc = self.sc; img = sc.img; x, y, r = self.x, self.y, self.r
        hm = np.zeros(img.shape[:2], np.uint8)
        cv2.circle(hm, (x, y), int(r * 1.03), 255, -1)
        if self.s.get('hair', True):
            cv2.ellipse(hm, (x, int(y - 0.42 * r)), (int(1.2 * r), int(0.86 * r)), 0, 180, 360, 255, -1)
            cv2.ellipse(hm, (x, int(y - 0.2 * r)), (int(1.18 * r), int(0.6 * r)), 0, 0, 360, 255, -1)
        hm[int(y + 0.97 * r):, :] = 0
        for poly in self.s.get('head_exclude', []): cv2.fillPoly(hm, [np.array(poly, np.int32)], 0)
        pr = int(1.6 * r)
        self.hroi = roi_clip(x - pr, y - pr, x + pr, y + pr)
        x0, y0, x1, y1 = self.hroi
        src = img
        self.hpatch = src[y0:y1, x0:x1].copy()
        self.halpha = cv2.GaussianBlur(hm[y0:y1, x0:x1].astype(np.float32) / 255, (0, 0), 2.5)
        dil = cv2.dilate(hm, np.ones((31, 31), np.uint8))
        for poly in self.s.get('head_exclude', []): cv2.fillPoly(dil, [np.array(poly, np.int32)], 0)
        sc.plate = inpaint_roi(sc.plate, dil, pad=50, radius=9)

    def breath(self, t):
        v = 1 + self.amp * (0.5 + 0.5 * math.sin(2 * math.pi * t / self.period + self.phase))
        if self.stretch: v += self.stretch(t)
        return v

    def draw_eyes(self, canvas, t, ox, oy, local=None):
        """paint blink / look onto canvas (world coords offset by ox, oy; local = (x0, y0) if canvas is a patch)"""
        if not self.eyes: return
        c = blink_curve(t, self.seed, self.first_blink)
        lx, ly = self.look(t) if self.look else (0, 0)
        if c < 0.3 and lx == 0 and ly == 0: return
        lx0, ly0 = local or (0, 0)
        for ((x0, y0, x1, y1), patch), (ex, ey, rx, ry) in zip(self.eye_patches, self.eyes):
            px0, py0 = int(x0 + ox - lx0), int(y0 + oy - ly0)
            h, w = patch.shape[:2]
            if px0 < 0 or py0 < 0 or py0 + h > canvas.shape[0] or px0 + w > canvas.shape[1]: continue
            canvas[py0:py0 + h, px0:px0 + w] = patch
            cx, cy = int(ex + ox - lx0 + lx), int(ey + oy - ly0 + ly)
            if c > 0.75:
                th = max(3, int(ry * 0.32))
                cv2.ellipse(canvas, (cx, cy + int(ry * 0.25)), (int(rx * 1.25), int(ry * 0.35)), 0, 200, 340, self.eye_col, th, cv2.LINE_AA)
            else:
                k = 1 - min(1, c / 0.75) * 0.6
                cv2.ellipse(canvas, (cx, cy + int(ry * (1 - k) * 0.4)), (rx, max(2, int(ry * k))), 0, 0, 360, self.eye_col, -1, cv2.LINE_AA)

    def draw(self, frame, t):
        sc = self.sc; s = self.breath(t)
        bx0, by0, bx1, by1 = self.body; piv = self.b
        M = np.float32([[1, 0, 0], [0, s, (piv - by0) * (1 - s)]])
        src = sc.plate[by0:by1, bx0:bx1]
        warped = cv2.warpAffine(src, M, (bx1 - bx0, by1 - by0), flags=cv2.INTER_LINEAR, borderMode=cv2.BORDER_REPLICATE)
        blend(frame[by0:by1, bx0:bx1], warped, self.body_mask)
        head_dy = (piv - self.y) * (1 - s)
        if not self.tilt:
            self.draw_eyes(frame, t, 0, head_dy)
            return
        ang, dx, dy = self.tilt(t)
        x0, y0, x1, y1 = self.hroi
        patch = self.hpatch.copy()
        self.draw_eyes(patch, t, 0, 0, local=(x0, y0))
        pvx, pvy = self.x - x0, self.y + 0.95 * self.r - y0
        R = cv2.getRotationMatrix2D((pvx, pvy), ang, 1.0); R[0, 2] += dx; R[1, 2] += dy + head_dy
        hw, hh = x1 - x0, y1 - y0
        hp = cv2.warpAffine(patch, R, (hw, hh), flags=cv2.INTER_LINEAR, borderMode=cv2.BORDER_REPLICATE)
        ha = cv2.warpAffine(self.halpha, R, (hw, hh), flags=cv2.INTER_LINEAR)
        blend(frame[y0:y1, x0:x1], hp, ha)

# ------------------------------------------------------------------ layers
class Part:
    """cut a region out of the picture and animate it. spec: mask (poly|rect|ellipse|fg), pivot, fn(t)->dict"""
    def __init__(self, sc, s):
        img = sc.img; self.fn = s['fn']; self.sc = sc
        if 'poly' in s: m = poly_mask(img.shape, s['poly'])
        elif 'ellipse' in s:
            m = np.zeros(img.shape[:2], np.uint8); (cx, cy, ax, ay) = s['ellipse']; cv2.ellipse(m, (cx, cy), (ax, ay), 0, 0, 360, 255, -1)
        elif 'rect' in s: x0, y0, x1, y1 = s['rect']; m = np.zeros(img.shape[:2], np.uint8); m[y0:y1, x0:x1] = 255
        if 'fg' in s:  # restrict to foreground pixels inside the region
            f = fg_mask(img, s['fg'], s.get('tol', 26), s.get('bg'))
            m = f if 'poly' not in s and 'ellipse' not in s and 'rect' not in s else (m & f)
        if s.get('grow'): m = cv2.dilate(m, np.ones((s['grow'], s['grow']), np.uint8))
        for e in s.get('exclude', []): cv2.ellipse(m, (e[0], e[1]), (e[2], e[3]), 0, 0, 360, 0, -1)
        ys, xs = np.nonzero(m); pad = s.get('pad', 600)
        self.roi = roi_clip(xs.min() - pad, ys.min() - pad, xs.max() + pad, ys.max() + pad)
        x0, y0, x1, y1 = self.roi
        self.patch = img[y0:y1, x0:x1].copy()
        self.alpha = cv2.GaussianBlur(m[y0:y1, x0:x1].astype(np.float32) / 255, (0, 0), s.get('feather', 2))
        self.pivot = s.get('pivot', ((xs.min() + xs.max()) / 2, (ys.min() + ys.max()) / 2))
        if s.get('fill', True):
            mm = cv2.dilate(m, np.ones((s.get('fill_grow', 21),) * 2, np.uint8))
            sc.plate = row_fill(sc.plate, mm) if s.get('rows') else smooth_fill(sc.plate, mm, s.get('sigma', 60)) if s.get('smooth') else inpaint_roi(sc.plate, mm, pad=60, radius=s.get('fill_radius', 9))

    def draw(self, frame, t):
        p = self.fn(t)
        if p is None: return
        x0, y0, x1, y1 = self.roi
        px, py = self.pivot[0] - x0, self.pivot[1] - y0
        sx = p.get('sx', p.get('s', 1)); sy = p.get('sy', p.get('s', 1)); a = math.radians(p.get('rot', 0))
        ca, sa = math.cos(a), math.sin(a)
        A = np.float32([[sx * ca, sy * sa], [-sx * sa, sy * ca]])
        off = np.float32([px + p.get('dx', 0), py + p.get('dy', 0)]) - A @ np.float32([px, py])
        M = np.hstack([A, off[:, None]]).astype(np.float32)
        hw, hh = x1 - x0, y1 - y0
        im = cv2.warpAffine(self.patch, M, (hw, hh), flags=cv2.INTER_LINEAR, borderMode=cv2.BORDER_REPLICATE)
        al = cv2.warpAffine(self.alpha, M, (hw, hh), flags=cv2.INTER_LINEAR) * p.get('alpha', 1.0)
        blend(frame[y0:y1, x0:x1], im, al)

class ClockHand:
    def __init__(self, sc, s):
        self.s = s; c = s['center']; L = s['len']; w = s['width']
        a0 = math.radians(s['erase_angle'])
        tip = (c[0] + L * math.sin(a0), c[1] - L * math.cos(a0))
        m = np.zeros(sc.img.shape[:2], np.uint8)
        cv2.line(m, (int(c[0]), int(c[1])), (int(tip[0]), int(tip[1])), 255, int(w * 2.6) + 8)
        cv2.circle(m, (int(c[0]), int(c[1])), int(s.get('pin', 0)), 0, -1)
        sc.plate = inpaint_roi(sc.plate, m, pad=30, radius=5)
        pr = int(s.get('pin', 0)) + 2
        self.pin = sc.img[int(c[1]) - pr:int(c[1]) + pr, int(c[0]) - pr:int(c[0]) + pr].copy()
    def draw(self, frame, t):
        s = self.s; c = s['center']; L = s['len']; w = s['width']; a = math.radians(s['fn'](t)); S = 4
        x0, y0, x1, y1 = roi_clip(c[0] - L - 20, c[1] - L - 20, c[0] + L + 20, c[1] + L + 20)
        big = cv2.resize(frame[y0:y1, x0:x1], None, fx=S, fy=S, interpolation=cv2.INTER_LINEAR)
        cx, cy = (c[0] - x0) * S, (c[1] - y0) * S
        def P(r, o): return (cx + r * math.sin(a) + o * math.cos(a), cy - r * math.cos(a) + o * math.sin(a))
        pts = [P(-s.get('tail', 8) * S, -w * S), P(L * 0.55 * S, -w * 0.9 * S), P(L * S, -w * 0.25 * S), P(L * S, w * 0.25 * S), P(L * 0.55 * S, w * 0.9 * S), P(-s.get('tail', 8) * S, w * S)]
        cv2.fillPoly(big, [np.array(pts, np.int32)], s.get('color', (28, 26, 26)), lineType=cv2.LINE_AA)
        frame[y0:y1, x0:x1] = cv2.resize(big, (x1 - x0, y1 - y0), interpolation=cv2.INTER_AREA)
        if self.pin.size:
            h, w_ = self.pin.shape[:2]; px, py = int(c[0]) - h // 2, int(c[1]) - h // 2
            frame[py:py + h, px:px + w_] = self.pin

class Glow:
    """additive radial light. s: center, radius, color (BGR 0-255), fn(t)->intensity 0..1"""
    def __init__(self, sc, s):
        self.s = s; x, y = s['center']; r = s['radius']
        self.roi = roi_clip(x - r, y - r, x + r, y + r); x0, y0, x1, y1 = self.roi
        yy, xx = np.mgrid[y0:y1, x0:x1].astype(np.float32)
        sy = s.get('squash', 1.0)
        d = np.sqrt((xx - x) ** 2 + ((yy - y) / sy) ** 2) / r
        self.g = (np.clip(1 - d, 0, 1) ** s.get('power', 2))[..., None] * np.float32(s['color'])[None, None, :]
    def draw(self, frame, t):
        k = self.s['fn'](t)
        if k <= 0.001: return
        x0, y0, x1, y1 = self.roi; r = frame[y0:y1, x0:x1]
        if self.s.get('mode') == 'mul':      # darken / tint
            r[...] = np.clip(r * (1 - k * self.g / 255), 0, 255).astype(np.uint8)
        else:
            r[...] = np.clip(r + k * self.g, 0, 255).astype(np.uint8)

class Grade:
    """whole-frame colour change: fn(t) -> (gain_b, gain_g, gain_r, add)"""
    def __init__(self, sc, s): self.fn = s['fn']
    def draw(self, frame, t):
        g = self.fn(t)
        if g is None: return
        lut = [np.clip(np.arange(256) * g[i] + g[3], 0, 255).astype(np.uint8) for i in range(3)]
        for i in range(3): frame[..., i] = cv2.LUT(frame[..., i], lut[i])

class Particles:
    """deterministic particle systems. kinds: confetti, dust, sparks, rain, papers, burst, smoke, sparkle, bills"""
    def __init__(self, sc, s):
        self.s = s; k = s['kind']; n = s.get('n', 80); r = np.random.default_rng(s.get('seed', sc.n * 7 + 3))
        x0, y0, x1, y1 = s.get('area', (0, 0, W4, H4)); self.area = (x0, y0, x1, y1)
        self.P = dict(x=r.uniform(x0, x1, n), y=r.uniform(y0, y1, n), u=r.uniform(0, 1, n), v=r.uniform(0, 1, n),
                      w=r.uniform(0, 1, n), c=r.integers(0, 1 << 30, n), ph=r.uniform(0, 6.28, n))
        self.n = n
        self.cols = s.get('colors', [(60, 200, 255), (255, 170, 60), (90, 90, 235), (240, 240, 240), (80, 210, 120)])
    def draw(self, frame, t):
        s = self.s; k = s['kind']; P = self.P; x0, y0, x1, y1 = self.area; H = y1 - y0; Wd = x1 - x0
        t0, t1 = s.get('t0', -1e9), s.get('t1', 1e9)
        if t < t0 or t > t1: return
        fade = s.get('alpha', 1.0) * min(1, (t - t0) / s.get('fade_in', 0.001) if t0 > -1e8 else 1) * (1 - win(t, t1 - s.get('fade_out', 0.0001), t1) if t1 < 1e8 else 1)
        tt = t - (t0 if t0 > -1e8 else 0)
        if k == 'confetti' or k == 'bills' or k == 'papers':
            sp = s.get('speed', 380); sz = s.get('size', 22)
            for i in range(self.n):
                y = y0 + ((P['y'][i] - y0 + sp * (0.6 + 0.8 * P['u'][i]) * tt) % (H + 200)) - 100
                x = P['x'][i] + s.get('sway', 60) * math.sin(tt * (1.5 + 2 * P['v'][i]) + P['ph'][i]) + s.get('drift', 0) * tt
                ang = tt * (2 + 5 * P['w'][i]) + P['ph'][i]
                flip = abs(math.cos(tt * (3 + 4 * P['u'][i]) + P['ph'][i]))
                a = sz * (0.7 + 0.6 * P['w'][i]); b = a * (0.55 if k == 'confetti' else 0.62) * max(0.15, flip)
                if k == 'confetti': col = self.cols[P['c'][i] % len(self.cols)]
                elif k == 'bills': col = (120, 190, 110)
                else: col = (238, 240, 242)
                ca, sa = math.cos(ang), math.sin(ang)
                pts = np.array([[x + ca * a - sa * b, y + sa * a + ca * b], [x - ca * a - sa * b, y - sa * a + ca * b],
                                [x - ca * a + sa * b, y - sa * a - ca * b], [x + ca * a + sa * b, y + sa * a - ca * b]], np.int32)
                if fade >= 0.99: cv2.fillConvexPoly(frame, pts, col, cv2.LINE_AA)
                else:
                    bx0, by0 = pts.min(0) - 2; bx1, by1 = pts.max(0) + 2
                    bx0, by0, bx1, by1 = roi_clip(bx0, by0, bx1, by1)
                    if bx1 <= bx0 or by1 <= by0: continue
                    sub = frame[by0:by1, bx0:bx1]; ov = sub.copy(); cv2.fillConvexPoly(ov, pts - [bx0, by0], col, cv2.LINE_AA)
                    blend(sub, ov, np.full(sub.shape[:2], fade, np.float32))
        elif k == 'dust':
            ov = np.zeros((frame.shape[0] // 4, frame.shape[1] // 4), np.float32)
            for i in range(self.n):
                x = (P['x'][i] + s.get('drift', 25) * tt * (P['u'][i] - 0.3) + 30 * math.sin(tt * 0.7 + P['ph'][i])) / 4
                y = (P['y'][i] - s.get('rise', 12) * tt + 25 * math.sin(tt * 0.5 + P['ph'][i] * 2)) / 4
                a = 0.5 + 0.5 * math.sin(tt * (1 + P['w'][i] * 2) + P['ph'][i])
                cv2.circle(ov, (int(x), int(y)), int(1 + 2.5 * P['v'][i]), a, -1, cv2.LINE_AA)
            ov = cv2.GaussianBlur(ov, (0, 0), 1.2)
            add = cv2.resize(ov, (frame.shape[1], frame.shape[0]), interpolation=cv2.INTER_LINEAR)[..., None] * np.float32(s.get('color', (200, 235, 255)))[None, None] * s.get('strength', 0.55) * fade
            frame[...] = np.clip(frame + add, 0, 255).astype(np.uint8)
        elif k == 'rain':
            ov = np.zeros((frame.shape[0] // 2, frame.shape[1] // 2), np.uint8)
            L = s.get('len', 70); vx, vy = s.get('vel', (-500, 2600))
            for i in range(self.n):
                y = ((P['y'][i] + vy * tt) % (H + 200)) - 100 + y0
                x = ((P['x'][i] + vx * tt - x0) % Wd) + x0
                nx, ny = vx / math.hypot(vx, vy), vy / math.hypot(vx, vy)
                cv2.line(ov, (int(x / 2), int(y / 2)), (int((x - nx * L) / 2), int((y - ny * L) / 2)), int(90 + 120 * P['w'][i]), 1, cv2.LINE_AA)
            add = cv2.resize(ov, (frame.shape[1], frame.shape[0])).astype(np.float32)[..., None] * (s.get('strength', 0.5) * fade / 255.0)
            frame[...] = np.clip(frame * (1 - add * 0.3) + add * 230, 0, 255).astype(np.uint8)
        elif k in ('sparks', 'burst'):
            ex, ey = s['origin']; life = s.get('life', 0.9); g = s.get('gravity', 1800); rate = s.get('rate', 40)
            sp0, sp1 = s.get('speed', (600, 1600)); dirc = s.get('dir', -90); spread = s.get('spread', 70)
            cols = s.get('colors', [(80, 200, 255), (120, 230, 255), (200, 250, 255)])
            ov = frame if k == 'burst' else np.zeros_like(frame)
            for i in range(self.n):
                if k == 'sparks':
                    born = (P['u'][i] * self.n / rate); age = (tt - born) % (self.n / rate)
                    if age > life: continue
                else:
                    age = tt - s.get('at', 0) - P['u'][i] * s.get('stagger', 0.15)
                    if age < 0 or age > life: continue
                ang = math.radians(dirc + spread * (P['v'][i] - 0.5) * 2); spd = sp0 + (sp1 - sp0) * P['w'][i]
                vx, vy = math.cos(ang) * spd, math.sin(ang) * spd
                x, y = ex + vx * age, ey + vy * age + 0.5 * g * age * age
                if k == 'sparks':
                    x2, y2 = x - vx * 0.035, y - (vy + g * age) * 0.035
                    col = cols[P['c'][i] % len(cols)]; f = 1 - age / life
                    cv2.line(ov, (int(x), int(y)), (int(x2), int(y2)), tuple(int(c * f) for c in col), s.get('width', 5), cv2.LINE_AA)
                else:
                    a = s.get('size', 40) * (0.7 + 0.6 * P['w'][i]); b = a * 0.68; rot = age * (4 + 6 * P['u'][i]) + P['ph'][i]
                    ca, sa = math.cos(rot), math.sin(rot); b2 = b * max(0.2, abs(math.cos(age * 6 + P['ph'][i])))
                    pts = np.array([[x + ca * a - sa * b2, y + sa * a + ca * b2], [x - ca * a - sa * b2, y - sa * a + ca * b2],
                                    [x - ca * a + sa * b2, y - sa * a - ca * b2], [x + ca * a + sa * b2, y + sa * a - ca * b2]], np.int32)
                    cv2.fillConvexPoly(ov, pts, cols[P['c'][i] % len(cols)], cv2.LINE_AA)
            if k == 'sparks':
                glow = cv2.GaussianBlur(ov, (0, 0), 6)
                frame[...] = np.clip(frame.astype(np.int16) + ov + glow, 0, 255).astype(np.uint8)
        elif k == 'smoke':
            q = 4; ov = np.zeros((frame.shape[0] // q, frame.shape[1] // q), np.float32)
            ex, ey = s['origin']; life = s.get('life', 2.5); rate = s.get('rate', 10)
            for i in range(self.n):
                born = s.get('at', 0) + P['u'][i] * s.get('span', self.n / rate)
                age = tt - born
                if age < 0 or age > life: continue
                f = age / life
                ang = math.radians(s.get('dir', -90) + s.get('spread', 60) * (P['v'][i] - 0.5) * 2)
                spd = s.get('speed', 300) * (0.5 + P['w'][i]) * (1 - 0.5 * f)
                x = ex + math.cos(ang) * spd * age + s.get('wind', 0) * age
                y = ey + math.sin(ang) * spd * age - s.get('rise', 120) * age
                rad = s.get('size', 90) * (0.6 + 2.2 * f ** 0.6) * (0.7 + 0.6 * P['v'][i])
                cv2.circle(ov, (int(x / q), int(y / q)), max(1, int(rad / q)), (1 - f) ** 1.5 * (0.6 + 0.4 * P['w'][i]), -1, cv2.LINE_AA)
            ov = cv2.GaussianBlur(ov, (0, 0), 3)
            a = np.clip(cv2.resize(ov, (frame.shape[1], frame.shape[0])) * s.get('density', 0.75) * fade, 0, 1)[..., None]
            col = np.float32(s.get('color', (200, 200, 205)))
            frame[...] = (frame * (1 - a) + col * a).astype(np.uint8)
        elif k == 'sparkle':
            ov = np.zeros_like(frame, np.float32)
            for i in range(self.n):
                ph = (tt * s.get('rate', 0.8) + P['u'][i]) % 1.0
                a = math.sin(math.pi * ph) ** 3
                if a < 0.05: continue
                x, y = int(P['x'][i]), int(P['y'][i]); L = int(s.get('size', 40) * (0.6 + P['w'][i]) * a)
                col = tuple(float(c) * a for c in s.get('color', (180, 240, 255)))
                cv2.line(ov, (x - L, y), (x + L, y), col, 3, cv2.LINE_AA); cv2.line(ov, (x, y - L), (x, y + L), col, 3, cv2.LINE_AA)
                cv2.circle(ov, (x, y), max(2, L // 6), col, -1, cv2.LINE_AA)
            ov += cv2.GaussianBlur(ov, (0, 0), 5) * 1.5
            frame[...] = np.clip(frame + ov * fade, 0, 255).astype(np.uint8)

class Arcs:
    """electric arcs from a ring/point to random targets; redraws every 2 frames"""
    def __init__(self, sc, s): self.s = s
    def draw(self, frame, t):
        s = self.s; fi = int(t * FPS) // s.get('every', 2)
        r = np.random.default_rng(1000 + fi); cx, cy = s['origin']; R = s.get('spread', 900)
        x0, y0, x1, y1 = roi_clip(cx - R - 100, cy - R - 100, cx + R + 100, cy + R // 2 + 200)
        ov = np.zeros((y1 - y0, x1 - x0), np.float32)
        for _ in range(s.get('n', 4)):
            a = r.uniform(math.radians(s.get('a0', -170)), math.radians(s.get('a1', -10)))
            L = r.uniform(0.45, 1.0) * R; sx, sy = cx + r.uniform(-s.get('ring', 150), s.get('ring', 150)), cy
            pts = [(sx, sy)]; steps = 12
            for k in range(1, steps + 1):
                f = k / steps; jx = r.normal(0, 40 * (1 - f * 0.3)); jy = r.normal(0, 40)
                pts.append((sx + math.cos(a) * L * f + jx, sy + math.sin(a) * L * f + jy))
            p = np.array([(px - x0, py - y0) for px, py in pts], np.int32)
            cv2.polylines(ov, [p], False, 1.0, s.get('width', 5), cv2.LINE_AA)
        glow = cv2.GaussianBlur(ov, (0, 0), 14)
        col = np.float32(s.get('color', (255, 140, 200)))
        k = s.get('fn', lambda t: 1.0)(t)
        add = (ov[..., None] * np.float32((255, 245, 255)) + glow[..., None] * col * 2.2) * k
        frame[y0:y1, x0:x1] = np.clip(frame[y0:y1, x0:x1] + add, 0, 255).astype(np.uint8)

class Flash:
    def __init__(self, sc, s): self.s = s
    def draw(self, frame, t):
        k = max((math.exp(-(t - a) / self.s.get('decay', 0.12)) if t >= a else 0) for a in self.s['at']) * self.s.get('strength', 0.6)
        if k > 0.01:
            col = np.float32(self.s.get('color', (255, 255, 255)))
            frame[...] = np.clip(frame * (1 - k * 0.5) + col * k, 0, 255).astype(np.uint8)


class Reveal:
    """progressively draw the dark strokes inside rect (whiteboard sketch, signature). wipe left->right."""
    def __init__(self, sc, s):
        self.s = s; x0, y0, x1, y1 = s['rect']; img = sc.img
        g = cv2.cvtColor(img[y0:y1, x0:x1], cv2.COLOR_BGR2GRAY)
        m = (g < s.get('thr', 140)).astype(np.uint8) * 255
        m = cv2.dilate(m, np.ones((5, 5), np.uint8))
        full = np.zeros(img.shape[:2], np.uint8); full[y0:y1, x0:x1] = m
        sc.plate = inpaint_roi(sc.plate, cv2.dilate(full, np.ones((7, 7), np.uint8)), pad=30, radius=5)
        self.patch = img[y0:y1, x0:x1].copy()
        self.alpha = cv2.GaussianBlur(m.astype(np.float32) / 255, (0, 0), 1.2)
        xs = np.arange(x1 - x0, dtype=np.float32)[None, :]
        self.xs = xs
    def draw(self, frame, t):
        s = self.s; x0, y0, x1, y1 = s['rect']
        p = ease(clamp01((t - s['t0']) / (s['t1'] - s['t0'])))
        if p <= 0: return
        front = p * (x1 - x0 + 2 * s.get('soft', 40)) - s.get('soft', 40)
        w = np.clip((front - self.xs) / s.get('soft', 40), 0, 1)
        blend(frame[y0:y1, x0:x1], self.patch, self.alpha * w)

class PopIn:
    """objects (connected foreground blobs inside rect) appear one after another with a springy pop."""
    def __init__(self, sc, s):
        self.s = s; img = sc.img; x0, y0, x1, y1 = s['rect']
        if s.get('sat'):
            x0, y0, x1, y1 = s['rect']; hsv = cv2.cvtColor(img, cv2.COLOR_BGR2HSV)
            m = np.zeros(img.shape[:2], np.uint8)
            sub = ((hsv[y0:y1, x0:x1, 1] > s['sat']) | (hsv[y0:y1, x0:x1, 2] < s.get('dark', 90))).astype(np.uint8) * 255
            sub = cv2.morphologyEx(sub, cv2.MORPH_CLOSE, np.ones((11, 11), np.uint8))
            sub = cv2.morphologyEx(sub, cv2.MORPH_OPEN, np.ones((5, 5), np.uint8))
            m[y0:y1, x0:x1] = sub
        else:
            m = fg_mask(img, s['rect'], s.get('tol', 26), s.get('bg'))
        n, lab, st, cen = cv2.connectedComponentsWithStats(m)
        comps = []; G = s.get('hull_grow', 0); allm = np.zeros_like(m)
        for i in range(1, n):
            if st[i, cv2.CC_STAT_AREA] < s.get('min_area', 4000): continue
            bx, by, bw, bh = st[i, :4]; pad = 12 + G
            bx0, by0, bx1, by1 = roi_clip(bx - pad, by - pad, bx + bw + pad, by + bh + pad)
            cm = (lab[by0:by1, bx0:bx1] == i).astype(np.uint8) * 255
            if G:
                cs, _ = cv2.findContours(cm, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
                cm = np.zeros_like(cm); cv2.fillPoly(cm, [cv2.convexHull(np.vstack(cs))], 255)
                cm = cv2.dilate(cm, np.ones((G, G), np.uint8))
            allm[by0:by1, bx0:bx1] |= cm
            a = cv2.GaussianBlur(cv2.dilate(cm, np.ones((7, 7), np.uint8)).astype(np.float32) / 255, (0, 0), 1.5 + G / 6)
            comps.append(((bx0, by0, bx1, by1), img[by0:by1, bx0:bx1].copy(), a, cen[i]))
        if G: m = allm
        rh = s.get('row_h', 300)
        comps.sort(key=lambda c: (round(c[3][1] / rh), c[3][0]))
        self.comps = comps
        mm = cv2.dilate(m, np.ones((15, 15), np.uint8))
        if s.get('backdrop'):
            bd = poly_backdrop(sc.img, cv2.dilate(m, np.ones((161, 161), np.uint8)))
            area = cv2.GaussianBlur(cv2.dilate(m, np.ones((s['backdrop'], s['backdrop']), np.uint8)).astype(np.float32) / 255, (0, 0), 25)[..., None]
            noise = np.random.default_rng(1).normal(0, 0.8, bd.shape).astype(np.float32)
            sc.plate = np.clip(sc.plate * (1 - area) + (bd + noise) * area, 0, 255).astype(np.uint8)
        else:
            sc.plate = smooth_fill(sc.plate, mm, s.get('sigma', 60)) if s.get('smooth') else inpaint_roi(sc.plate, mm, pad=40, radius=7)
    def draw(self, frame, t):
        s = self.s
        for i, ((x0, y0, x1, y1), patch, a, c) in enumerate(self.comps):
            ta = s['t0'] + i * s['dt']
            if t < ta: continue
            k = back_out(clamp01((t - ta) / s.get('pop', 0.25)), 2.2)
            if k >= 0.999 and t - ta > 0.3:
                blend(frame[y0:y1, x0:x1], patch, a); continue
            w, h = x1 - x0, y1 - y0; px, py = w / 2, h * 0.9
            M = np.float32([[k, 0, px * (1 - k)], [0, k, py * (1 - k)]])
            pw = cv2.warpAffine(patch, M, (w, h), flags=cv2.INTER_LINEAR, borderMode=cv2.BORDER_REPLICATE)
            aw = cv2.warpAffine(a, M, (w, h), flags=cv2.INTER_LINEAR)
            blend(frame[y0:y1, x0:x1], pw, aw)

LAYERS = dict(popin=PopIn, reveal=Reveal, part=Part, clock=ClockHand, glow=Glow, grade=Grade, particles=Particles, arcs=Arcs, flash=Flash)

# ------------------------------------------------------------------ text (screen space)
def text_overlay(s, size=74):
    from PIL import Image, ImageDraw, ImageFont
    font = ImageFont.truetype('/usr/share/fonts/opentype/inter/InterDisplay-Bold.otf' if os.path.exists('/usr/share/fonts/opentype/inter/InterDisplay-Bold.otf') else '/usr/share/fonts/opentype/inter/Inter-Bold.otf', size)
    bb = font.getbbox(s); w, h = bb[2] - bb[0], bb[3] - bb[1]
    padx, pady = int(size * 0.45), int(size * 0.3)
    im = Image.new('RGBA', (w + 2 * padx, h + 2 * pady), (0, 0, 0, 0)); d = ImageDraw.Draw(im)
    d.rounded_rectangle([0, 0, im.width - 1, im.height - 1], radius=int(size * 0.25), fill=(12, 12, 14, 175))
    d.text((padx - bb[0], pady - bb[1]), s, font=font, fill=(255, 214, 92, 255))
    a = np.asarray(im).astype(np.float32)
    return a[..., [2, 1, 0]], a[..., 3:] / 255

# ------------------------------------------------------------------ camera
def camera(spec, t, dur, n):
    c = spec.get('cam', {}); kind = c.get('kind', ['in', 'right', 'out', 'left'][n % 4])
    fx, fy = c.get('focus', (W4 / 2, H4 / 2)); E = ease if c.get('ease', 'io') == 'io' else (lambda x: clamp01(x))
    u = E(t / dur)
    if kind == 'keys':
        z, x, y = keyed(t, [(k[0], k[1:]) for k in c['keys']])
    elif kind in ('in', 'out'):
        z0, z1 = c.get('z', (1.0, 1.12) if kind == 'in' else (1.12, 1.0))
        z = z0 + (z1 - z0) * u
        # move from frame centre towards the focus as we zoom in
        k = (z - 1) / max(1e-6, max(z0, z1) - 1)
        x, y = W4 / 2 + (fx - W4 / 2) * k, H4 / 2 + (fy - H4 / 2) * k
    else:
        z = c.get('z', (1.14,))[0] if isinstance(c.get('z'), tuple) else c.get('z', 1.14)
        span = c.get('span', 1.0)
        mx, my = (W4 - W4 / z) / 2 * span, (H4 - H4 / z) / 2 * span
        d = {'left': (mx, 0, -mx, 0), 'right': (-mx, 0, mx, 0), 'up': (0, my, 0, -my), 'down': (0, -my, 0, my)}[kind]
        x = fx + d[0] + (d[2] - d[0]) * u; y = fy + d[1] + (d[3] - d[1]) * u
    # keep inside the picture
    hw, hh = W4 / 2 / z, H4 / 2 / z
    x = min(max(x, hw), W4 - hw); y = min(max(y, hh), H4 - hh)
    sx = sy = 0.0
    for (a, b, amp) in spec.get('shake', []):
        if a <= t <= b:
            k = amp * (1 - (t - a) / (b - a)) ** 1.5 if spec.get('shake_decay', True) else amp
            sx += k * (math.sin(t * 61.0) + 0.5 * math.sin(t * 97.0)); sy += k * (math.cos(t * 53.0) + 0.5 * math.sin(t * 83.0))
    # tiny hand-held drift so nothing is ever perfectly frozen
    dr = c.get('drift', 1.0)
    sx += dr * 2.2 * math.sin(t * 0.9 + n); sy += dr * 1.6 * math.sin(t * 0.7 + 2 * n)
    return z, x, y, sx, sy

# ------------------------------------------------------------------ scene
class Scene:
    def __init__(self, n, spec, image=None):
        self.n = n; self.spec = spec
        img = cv2.imread(image or os.path.join(EP, 'images', f'scene_{n:03d}.png'))
        assert img.shape[:2] == (H4, W4), img.shape
        self.img = cv2.GaussianBlur(img, (0, 0), 0.55)      # light pre-filter = clean downscale later
        self.plate = self.img.copy()
        self.under = [LAYERS[l['type']](self, l) for l in spec.get('under', [])]
        self.chars = [Char(self, c, i) for i, c in enumerate(spec.get('chars', []))]
        self.layers = [LAYERS[l['type']](self, l) for l in spec.get('layers', [])]
        self.texts = [(text_overlay(tx['s'], tx.get('size', 74)), tx) for tx in spec.get('text', [])]

    def frame(self, t, dur):
        f = self.plate.copy()
        for l in self.under: l.draw(f, t)
        for c in self.chars: c.draw(f, t)
        for l in self.layers: l.draw(f, t)
        z, x, y, sx, sy = camera(self.spec, t, dur, self.n)
        s = OW / W4 * z
        M = np.float32([[s, 0, OW / 2 - s * x + sx], [0, s, OH / 2 - s * y + sy]])
        out = cv2.warpAffine(f, M, (OW, OH), flags=cv2.INTER_LINEAR, borderMode=cv2.BORDER_REFLECT)
        for (rgb, a), tx in self.texts:
            if t < tx.get('t0', 0) or t > tx.get('t1', 1e9): continue
            k = min(1, (t - tx.get('t0', 0)) / 0.25) * (1 - win(t, tx.get('t1', 1e9) - 0.25, tx.get('t1', 1e9)))
            px, py = tx.get('pos', (64, 150)); h, w = rgb.shape[:2]; px = max(40, min(px, OW - w - 40))
            r = out[py:py + h, px:px + w]; blend(r, rgb, a * k)
        return out

def render(n, spec, dur, out_mp4, preview_t=None):
    sc = Scene(n, spec)
    if preview_t is not None:
        cv2.imwrite(out_mp4, sc.frame(preview_t, dur)); return
    tmpv = out_mp4 + '.v.mp4'; tmpa = out_mp4 + '.a.wav'
    p = subprocess.Popen(['ffmpeg', '-y', '-loglevel', 'error', '-f', 'rawvideo', '-pix_fmt', 'bgr24', '-s', f'{OW}x{OH}', '-r', str(FPS),
                          '-i', '-', '-c:v', 'libx264', '-preset', 'medium', '-crf', '16', '-pix_fmt', 'yuv420p', '-threads', '2', tmpv],
                         stdin=subprocess.PIPE)
    nf = int(round(dur * FPS))
    for i in range(nf): p.stdin.write(sc.frame(i / FPS, dur).tobytes())
    p.stdin.close(); p.wait()
    SFX.write_wav(tmpa, SFX.mix(spec.get('sfx', []), dur))
    subprocess.run(['ffmpeg', '-y', '-loglevel', 'error', '-i', tmpv, '-i', tmpa, '-c:v', 'copy', '-c:a', 'aac', '-b:a', '192k',
                    '-ar', '48000', '-shortest', out_mp4], check=True)
    os.remove(tmpv); os.remove(tmpa)
