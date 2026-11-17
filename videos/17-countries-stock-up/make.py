#!/usr/bin/env python3
"""17 Countries Are Telling People to Stock Up — on-screen-text vertical video, built locally.

  python3 make.py            -> 17-countries-stock-up.mp4 (1080x1920, 30 fps, H.264 + AAC)
  python3 make.py --preview  -> preview.jpg (one frame from every shot)

Every frame is a pure function of t. Edit SHOTS to change text/timing.
"""
import math, os, subprocess, sys
from PIL import Image, ImageDraw, ImageFont, ImageFilter

HERE = os.path.dirname(os.path.abspath(__file__))
W, H, FPS = 1080, 1920, 30
F = '/usr/share/fonts/opentype/inter/'
GOLD, RED, WHITE, BLUE, GREEN, GREY = (245, 196, 81), (255, 77, 77), (245, 245, 245), (90, 169, 255), (61, 220, 132), (150, 150, 150)
_fc = {}
def font(size, w='Black'):
    k = (size, w)
    if k not in _fc: _fc[k] = ImageFont.truetype(F + ('InterDisplay-' if w in ('Black', 'ExtraBold') else 'Inter-') + w + '.otf', size)
    return _fc[k]

def ease(x): x = max(0.0, min(1.0, x)); return 1 - (1 - x) ** 3
def back(x):
    x = max(0.0, min(1.0, x)); c = 1.7
    return 1 + (c + 1) * (x - 1) ** 3 + c * (x - 1) ** 2

# ---------------------------------------------------------------- flags (drawn, not images)
def flag(code, w=180, h=120):
    im = Image.new('RGB', (w, h)); d = ImageDraw.Draw(im)
    def hb(*cols, ratios=None):
        r = ratios or [1] * len(cols); s = sum(r); y = 0
        for c, q in zip(cols, r): y2 = y + h * q / s; d.rectangle([0, y, w, y2], fill=c); y = y2
    def vb(*cols):
        for i, c in enumerate(cols): d.rectangle([w * i / len(cols), 0, w * (i + 1) / len(cols), h], fill=c)
    def nordic(bg, cross, inner=None):
        d.rectangle([0, 0, w, h], fill=bg); cx = w * 0.36; t = h * 0.22
        d.rectangle([cx - t / 2, 0, cx + t / 2, h], fill=cross); d.rectangle([0, h / 2 - t / 2, w, h / 2 + t / 2], fill=cross)
        if inner:
            t2 = t * 0.5
            d.rectangle([cx - t2 / 2, 0, cx + t2 / 2, h], fill=inner); d.rectangle([0, h / 2 - t2 / 2, w, h / 2 + t2 / 2], fill=inner)
    if code == 'GB':
        d.rectangle([0, 0, w, h], fill=(1, 33, 105))
        for a, b in (((0, 0), (w, h)), ((0, h), (w, 0))): d.line([a, b], fill=WHITE, width=int(h * 0.2))
        for a, b in (((0, 0), (w, h)), ((0, h), (w, 0))): d.line([a, b], fill=(200, 16, 46), width=int(h * 0.07))
        d.rectangle([w / 2 - h * .17, 0, w / 2 + h * .17, h], fill=WHITE); d.rectangle([0, h / 2 - h * .17, w, h / 2 + h * .17], fill=WHITE)
        d.rectangle([w / 2 - h * .1, 0, w / 2 + h * .1, h], fill=(200, 16, 46)); d.rectangle([0, h / 2 - h * .1, w, h / 2 + h * .1], fill=(200, 16, 46))
    elif code == 'IE': vb((22, 155, 98), WHITE, (255, 136, 62))
    elif code == 'FR': vb((0, 85, 164), WHITE, (239, 65, 53))
    elif code == 'DE': hb((0, 0, 0), (221, 0, 0), (255, 206, 0))
    elif code == 'NL': hb((174, 28, 40), WHITE, (33, 70, 139))
    elif code == 'DK': nordic((200, 16, 46), WHITE)
    elif code == 'NO': nordic((186, 12, 47), WHITE, (0, 32, 91))
    elif code == 'SE': nordic((0, 106, 167), (254, 204, 0))
    elif code == 'FI': nordic(WHITE, (0, 47, 108))
    elif code == 'EE': hb((0, 114, 206), (0, 0, 0), WHITE)
    elif code == 'LV': hb((158, 48, 57), WHITE, (158, 48, 57), ratios=[2, 1, 2])
    elif code == 'LT': hb((253, 185, 19), (0, 106, 68), (193, 39, 45))
    elif code == 'PL': hb(WHITE, (220, 20, 60))
    elif code == 'CZ':
        hb(WHITE, (215, 20, 26)); d.polygon([(0, 0), (w * 0.5, h / 2), (0, h)], fill=(17, 69, 126))
    elif code == 'AT': hb((200, 16, 46), WHITE, (200, 16, 46))
    elif code == 'CH':
        d.rectangle([0, 0, w, h], fill=(218, 41, 28)); s = h * 0.6; t = s * 0.3; cx, cy = w / 2, h / 2
        d.rectangle([cx - t / 2, cy - s / 2, cx + t / 2, cy + s / 2], fill=WHITE); d.rectangle([cx - s / 2, cy - t / 2, cx + s / 2, cy + t / 2], fill=WHITE)
    elif code == 'HR':
        hb((255, 0, 0), WHITE, (23, 23, 150)); s = h * 0.36; x0, y0 = w / 2 - s / 2, h / 2 - s / 2; n = 5
        for i in range(n):
            for j in range(n):
                d.rectangle([x0 + s * i / n, y0 + s * j / n, x0 + s * (i + 1) / n, y0 + s * (j + 1) / n], fill=(255, 0, 0) if (i + j) % 2 == 0 else WHITE)
    elif code == 'EU':
        d.rectangle([0, 0, w, h], fill=(0, 51, 153))
        for k in range(12):
            a = k * math.pi / 6; x, y = w / 2 + h * 0.33 * math.cos(a), h / 2 + h * 0.33 * math.sin(a); r = h * 0.045
            d.regular_polygon((x, y, r * 1.6), 5, fill=(255, 204, 0))
    im = im.convert('RGBA')
    m = Image.new('L', (w, h), 0); ImageDraw.Draw(m).rounded_rectangle([0, 0, w - 1, h - 1], 12, fill=255); im.putalpha(m)
    return im

SEVENTEEN = ['GB', 'IE', 'FR', 'DE', 'NL', 'DK', 'NO', 'SE', 'FI', 'EE', 'LV', 'LT', 'PL', 'CZ', 'AT', 'CH', 'HR']

# ---------------------------------------------------------------- text
COL = {'*': GOLD, '!': RED, '^': BLUE, '~': GREEN}
def text_layer(markup, size, color=WHITE, maxw=960, weight='Black', align='center', line_gap=1.12):
    """'*gold' '!red' '^blue' '~green' word prefixes; '/' forces a line break."""
    f = font(size, weight); sp = f.getlength(' ')
    words = []
    for tok in markup.split(' '):
        if tok == '/': words.append(('\n', None)); continue
        c = COL.get(tok[:1]); words.append((tok[1:] if c else tok, c or color))
    lines, cur, cw = [], [], 0
    for wd, c in words:
        if wd == '\n': lines.append(cur); cur, cw = [], 0; continue
        L = f.getlength(wd)
        if cur and cw + sp + L > maxw: lines.append(cur); cur, cw = [], 0
        cur.append((wd, c, L)); cw += (sp if len(cur) > 1 else 0) + L
    if cur: lines.append(cur)
    lh = int(size * line_gap); hgt = lh * len(lines) + int(size * 0.3)
    im = Image.new('RGBA', (maxw + 40, hgt + 20), (0, 0, 0, 0)); d = ImageDraw.Draw(im)
    for i, ln in enumerate(lines):
        tw = sum(L for _, _, L in ln) + sp * (len(ln) - 1)
        x = 20 + ((maxw - tw) / 2 if align == 'center' else 0); y = 10 + i * lh
        for wd, c, L in ln:
            d.text((x + 3, y + 4), wd, font=f, fill=(0, 0, 0, 160)); d.text((x, y), wd, font=f, fill=c); x += L + sp
    return im.crop(im.getbbox())

# ---------------------------------------------------------------- background (moving grid + vignette)
BG = Image.new('RGB', (W + 240, H + 240), (6, 6, 9)); _d = ImageDraw.Draw(BG)
for x in range(0, W + 240, 80): _d.line([(x, 0), (x, H + 240)], fill=(26, 22, 14))
for y in range(0, H + 240, 80): _d.line([(0, y), (W + 240, y)], fill=(26, 22, 14))
VIG = Image.new('L', (W, H), 0); _v = ImageDraw.Draw(VIG)
for i in range(60):
    r = 1 - i / 60; _v.ellipse([W / 2 - W * 0.9 * r, H / 2 - H * 0.75 * r, W / 2 + W * 0.9 * r, H / 2 + H * 0.75 * r], fill=int(255 * (1 - r) ** 1.4 * 0.0 + 4 * i))
VIG = VIG.filter(ImageFilter.GaussianBlur(60))
DARK = Image.new('RGB', (W, H), (0, 0, 0))

# ---------------------------------------------------------------- shots
# element: (kind, start_offset, payload...) — kinds: text, flags, bars, check, chips, follow, src, big
SHOTS = [
    (4.6, 'hook', [('text', -1, 'Why the f*** are *17 *countries / telling people / to *stock *up?', 90, 280),
                   ('flags', -1, SEVENTEEN, 860)]),
    (2.6, 'n', [('text', 0, "They're preparing / for !something.", 104, 760)]),
    (3.2, 'n', [('text', 0, "It's real.", 110, 620), ('text', 0.9, "But it's !NOT a / !November !17 !shutdown.", 84, 860)]),
    (4.6, 'n', [('text', 0, 'March 2025: the *EU told / 450 million people:', 70, 380), ('flagone', 0.2, 'EU', 640),
                ('count', 0.6, 72, 'HOURS', 960), ('text', 1.6, 'of food, water & medicine / at home', 62, 1220),
                ('src', 0, 'Source: European Commission Preparedness Strategy, Mar 2025')]),
    (4.4, 'n', [('flagone', 0, 'SE', 420), ('text', 0.25, '^Sweden mailed a booklet / to every household:', 70, 640),
                ('text', 1.1, '"If *Crisis or *War / *Comes"', 96, 900), ('src', 0, 'Source: Swedish civil-defence agency, Nov 2024')]),
    (4.8, 'n', [('text', 0, 'How long they say / to last on your own', 70, 330),
                ('bars', 0.4, [('EU', 'EU', 3, '72 hrs'), ('SE', 'Sweden', 7, 'about 1 week'), ('NO', 'Norway', 7, 'about 1 week'), ('DE', 'Germany', 10, '10 days')], 620),
                ('src', 0, 'Source: Newsweek roundup of national guidance')]),
    (4.6, 'n', [('text', 0, 'Why now?', 104, 400), ('text', 0.5, '1. !War in !Ukraine', 74, 700),
                ('text', 1.2, '2. !Cyberattacks', 74, 860), ('text', 1.9, '3. Storms knocking / out !power', 74, 1020)]),
    (2.8, 'n', [('text', 0, 'So where does / *"November *17" / come from?', 96, 600)]),
    (5.4, 'n', [('chips', 0.0, ['An old WEF / cyber drill', 'A phone / alert test', 'The 72-hour / advice'], 380),
                ('text', 2.4, 'stitched into / !one !viral !post', 92, 1100)]),
    (4.2, 'n', [('text', 0, "There's no / *\"world *power *grid\" / to switch off.", 92, 520), ('text', 1.4, 'Every country / runs its own.', 76, 1000)]),
    (5.2, 'n', [('text', 0, 'What they actually want / in your closet:', 66, 300),
                ('check', 0.5, ['Water', 'Canned food', 'Radio', 'Flashlight', 'Cash', 'Your meds'], 520)]),
    (4.4, 'n', [('text', 0, "They're not preparing / for a !date.", 92, 560), ('text', 1.3, "They're preparing / for a *bad *week.", 92, 940)]),
    (3.0, 'n', [('text', 0, "More of what's really / behind the headlines", 66, 520), ('follow', 0.35, 'FOLLOW', 900)]),
]
STARTS = []; _t = 0
for s in SHOTS: STARTS.append(_t); _t += s[0]
TOTAL = _t

_cache = {}
def cached(key, fn):
    if key not in _cache: _cache[key] = fn()
    return _cache[key]

def paste(fr, layer, cx, top, alpha=1.0, scale=1.0, dy=0):
    if alpha <= 0.01: return
    L = layer
    if abs(scale - 1) > 0.01: L = L.resize((max(1, int(L.width * scale)), max(1, int(L.height * scale))), Image.BICUBIC)
    if alpha < 0.99:
        a = L.getchannel('A').point(lambda v: int(v * alpha)); L = L.copy(); L.putalpha(a)
    fr.alpha_composite(L, (int(cx - L.width / 2), int(top + dy - (L.height - layer.height) / 2)))

def appear(t, t0, dur=0.35):
    """returns (alpha, dy, scale) — t0<0 means already on at frame 1 (hook rule)."""
    if t0 < 0: return 1, 0, 1
    p = (t - t0) / dur
    if p <= 0: return 0, 0, 1
    return ease(p), 40 * (1 - ease(p)), 0.92 + 0.08 * back(p)

def draw_el(fr, el, t):
    kind = el[0]; t0 = el[1]
    if kind == 'text':
        _, _, s, size, y = el; L = cached(('t', s, size), lambda: text_layer(s, size))
        a, dy, sc = appear(t, t0); paste(fr, L, W / 2, y, a, sc, dy)
    elif kind == 'src':
        L = cached(('src', el[2]), lambda: text_layer(el[2], 30, GREY, weight='Medium'))
        paste(fr, L, W / 2, 1470, min(1, t / 0.4))
    elif kind == 'flagone':
        L = cached(('f1', el[2]), lambda: flag(el[2], 240, 160)); a, dy, sc = appear(t, t0); paste(fr, L, W / 2, el[3], a, sc, dy)
    elif kind == 'flags':
        codes, y0 = el[2], el[3]; fw, fh, g = 180, 120, 20
        for i, c in enumerate(codes):
            r, k = divmod(i, 5); n = min(5, len(codes) - r * 5)
            x = W / 2 + (k - (n - 1) / 2) * (fw + g); y = y0 + r * (fh + g)
            ti = i * 0.07 - 0.45; p = (t - ti) / 0.3   # ~7 flags already landing at frame 1
            if t < ti: continue
            L = cached(('f', c), lambda c=c: flag(c, fw, fh))
            # gentle breathing so the hook frame keeps moving
            br = 1 + 0.025 * math.sin(2 * math.pi * (t * 0.6 + i * 0.13))
            paste(fr, L, x, y, ease(p), back(p) * br)
        cnt = max(1, min(len(codes), int((t + 0.45) / 0.07) + 1))
        L = cached(('cnt', cnt), lambda: text_layer(f'*{cnt} countries', 52, weight='ExtraBold'))
        paste(fr, L, W / 2, y0 + 4 * (fh + g) + 10, 1)
    elif kind == 'count':
        _, _, n, unit, y = el; p = ease((t - t0) / 0.9)
        if t < t0: return
        v = int(round(n * p)); L = cached(('c', v, unit), lambda: text_layer(f'*{v} *{unit}', 180))
        paste(fr, L, W / 2, y - 40, min(1, (t - t0) / 0.2), 1 + 0.06 * (1 - ease((t - t0) / 0.4)))
    elif kind == 'bars':
        rows, y0 = el[2], el[3]; d = ImageDraw.Draw(fr)
        for i, (code, name, days, lab) in enumerate(rows):
            ti = t0 + i * 0.35
            if t < ti: continue
            y = y0 + i * 190; p = ease((t - ti) / 0.7)
            fl = cached(('fb', code), lambda c=code: flag(c, 120, 80)); paste(fr, fl, 130, y, min(1, (t - ti) / 0.2))
            nm = cached(('bn', name), lambda n=name: text_layer(n, 44, weight='Bold')); fr.alpha_composite(nm, (210, int(y - 6)))
            bw = int(620 * days / 10 * p); col = GOLD if days >= 7 else WHITE
            d.rounded_rectangle([210, y + 50, 210 + max(bw, 8), y + 100], 12, fill=col)
            lb = cached(('bl', lab), lambda l=lab: text_layer(l, 46, weight='ExtraBold'))
            if p > 0.6: fr.alpha_composite(lb, (min(W - lb.width - 30, 230 + bw), int(y + 48)))
    elif kind == 'chips':
        items, y0 = el[2], el[3]; d = ImageDraw.Draw(fr)
        for i, s in enumerate(items):
            ti = t0 + i * 0.55
            if t < ti: continue
            a, dy, sc = appear(t, ti); L = cached(('chip', s), lambda s=s: chip(s)); paste(fr, L, W / 2, y0 + i * 210, a, sc, dy)
        if t > t0 + 1.9:  # one arrow down into the result
            p = ease((t - t0 - 1.9) / 0.4); ya = y0 + 3 * 210 - 20; yb = ya + 70 * p
            d.line([(W / 2, ya), (W / 2, yb)], fill=RED, width=10)
            if p > 0.5: d.polygon([(W / 2 - 30, yb - 20), (W / 2 + 30, yb - 20), (W / 2, yb + 15)], fill=RED)
    elif kind == 'check':
        items, y0 = el[2], el[3]; d = ImageDraw.Draw(fr)
        for i, s in enumerate(items):
            ti = t0 + i * 0.45
            if t < ti: continue
            y = y0 + i * 140; p = ease((t - ti) / 0.3)
            d.rounded_rectangle([170, y, 250, y + 80], 14, outline=WHITE, width=5)
            if p > 0: d.line([(185, y + 42), (205, y + 42 + 22 * p)] + ([(240, y + 14)] if p > 0.5 else []), fill=GREEN, width=10)
            L = cached(('ck', s), lambda s=s: text_layer(s, 68, weight='ExtraBold', align='left')); paste(fr, L, 290 + L.width / 2, y, p)
    elif kind == 'follow':
        if t < t0: return
        p = back((t - t0) / 0.45); L = cached('follow', follow_btn); paste(fr, L, W / 2, el[3], min(1, (t - t0) / 0.2), p * (1 + 0.04 * math.sin(t * 8)))

def chip(s):
    tl = text_layer(s, 60, weight='ExtraBold'); w, h = 660, tl.height + 70
    im = Image.new('RGBA', (w, h), (0, 0, 0, 0)); d = ImageDraw.Draw(im)
    d.rounded_rectangle([0, 0, w - 1, h - 1], 30, fill=(28, 24, 18, 235), outline=GOLD, width=4)
    im.alpha_composite(tl, ((w - tl.width) // 2, (h - tl.height) // 2)); return im

def follow_btn():
    im = Image.new('RGBA', (560, 150), (0, 0, 0, 0)); d = ImageDraw.Draw(im)
    d.rounded_rectangle([0, 0, 559, 149], 75, fill=RED); tl = text_layer('+ FOLLOW', 70)
    im.alpha_composite(tl, ((560 - tl.width) // 2, (150 - tl.height) // 2)); return im

def frame(t):
    i = max(k for k in range(len(SHOTS)) if STARTS[k] <= t + 1e-9); lt = t - STARTS[i]; dur = SHOTS[i][0]
    ox = int(120 + 60 * math.sin(t * 0.35)); oy = int((t * 40) % 80)
    fr = BG.crop((ox, oy, ox + W, oy + H)); fr = Image.composite(DARK, fr, VIG).convert('RGBA')
    for el in SHOTS[i][2]: draw_el(fr, el, lt)
    # slow push on every shot: something always moves
    z = 1 + 0.035 * lt / dur
    if z > 1.002:
        cw, ch = W / z, H / z; fr = fr.crop((int((W - cw) / 2), int((H - ch) / 2), int((W + cw) / 2), int((H + ch) / 2))).resize((W, H), Image.BILINEAR)
    return fr.convert('RGB')

def audio(out, gain=2):
    """Local sound bed: low drone + a hit on every cut + ticks on the checklist."""
    hits = "+".join(f"0.45*sin(2*PI*55*(t-{s:.3f}))*exp(-6*(t-{s:.3f}))*gte(t,{s:.3f})" for s in STARTS)
    ck = STARTS[10] + 0.5
    ticks = '+'.join(f"0.5*sin(2*PI*1800*(t-{ck + k * 0.45:.3f}))*exp(-60*(t-{ck + k * 0.45:.3f}))*gte(t,{ck + k * 0.45:.3f})" for k in range(6))
    g = (f"aevalsrc='0.18*sin(2*PI*41.2*t)*(0.7+0.3*sin(2*PI*0.1*t))+0.08*sin(2*PI*61.7*t)+0.05*sin(2*PI*82.4*t+sin(2*PI*0.23*t))':s=48000:d={TOTAL:.3f}[dr];"
         f"aevalsrc='{hits}':s=48000:d={TOTAL:.3f}[hi];aevalsrc='{ticks}':s=48000:d={TOTAL:.3f}[tk];"
         f"anoisesrc=c=brown:a=0.08:r=48000:d={TOTAL:.3f},lowpass=f=300[ns];"
         f"[dr][hi][tk][ns]amix=4:normalize=0,afade=t=out:st={TOTAL - 1.2:.3f}:d=1.2,pan=stereo|c0=c0|c1=c0,"
         f"volume={gain}dB,alimiter=limit=0.7:level=disabled")
    subprocess.run(['ffmpeg', '-v', 'error', '-y', '-filter_complex', g, '-ar', '48000', out], check=True)

if __name__ == '__main__':
    if '--preview' in sys.argv:
        tiles = [frame(STARTS[i] + SHOTS[i][0] * 0.8).resize((270, 480)) for i in range(len(SHOTS))]
        sheet = Image.new('RGB', (270 * 7, 480 * 2), (40, 40, 40))
        for k, im in enumerate(tiles): sheet.paste(im, ((k % 7) * 270, (k // 7) * 480))
        sheet.save(os.path.join(HERE, 'preview.jpg'), quality=88); print('preview.jpg', f'{TOTAL:.1f}s'); sys.exit()
    wav = os.path.join(HERE, '.bed.wav'); audio(wav)
    out = os.path.join(HERE, '17-countries-stock-up.mp4')
    p = subprocess.Popen(['ffmpeg', '-v', 'error', '-y', '-f', 'rawvideo', '-pix_fmt', 'rgb24', '-s', f'{W}x{H}', '-r', str(FPS), '-i', '-',
                          '-i', wav, '-c:v', 'libx264', '-preset', 'medium', '-crf', '18', '-pix_fmt', 'yuv420p', '-profile:v', 'high',
                          '-c:a', 'aac', '-b:a', '192k', '-movflags', '+faststart', '-shortest', out], stdin=subprocess.PIPE)
    n = int(round(TOTAL * FPS))
    for k in range(n):
        p.stdin.write(frame(k / FPS).tobytes())
        if k % 150 == 0: print(f'{k}/{n}', flush=True)
    p.stdin.close(); p.wait(); os.remove(wav); print('wrote', out, f'{TOTAL:.1f}s')
