#!/usr/bin/env python3
"""Assemble the OpenArt clips into final.mp4: cuts on the voice cues, engine push/punch-ins, pop-up thought
clouds with the wished-for thing inside, one-word captions (y~1270), follow-button CTA, voice mixed.
Usage: python3 videos/want-what-others-have/assemble.py [--preview t1,t2,...] [--out final.mp4]
"""
import json, math, os, re, subprocess, sys
import numpy as np
from PIL import Image, ImageDraw, ImageFilter, ImageFont

HERE = os.path.dirname(os.path.abspath(__file__))
W, H, FPS = 1080, 1920, 30
FONT = '/usr/share/fonts/opentype/inter/InterDisplay-Black.otf'
GOLD, RED = (255, 206, 46), (255, 59, 48)
TAIL = 1.0  # seconds after the voice ends (follow button settles)

# ---------- voice timing ----------
src = open(os.path.join(HERE, 'data.js')).read()
DATA = json.loads(src[src.index('{'):src.rstrip().rstrip(';').rindex('}') + 1])
WORDS = DATA['words']
AUDIO = DATA['audioLength']
END = AUDIO + TAIL

def parse_tokens(text):
    toks = []
    lines = [l for l in text.split('\n') if not l.strip().startswith('#')]
    for m in re.finditer(r'\[#[^\]]+\]|\{[^}]*\}\S*|\S+', ' '.join(lines)):
        s = m.group(0)
        if s.startswith('[#'): toks.append({'cue': s[2:-1].strip()}); continue
        trail = ''
        if s[0] == '{': i = s.index('}'); trail = s[i + 1:]; s = s[1:i]
        cls = ''
        if s[0] == '*': cls = 'gold'; s = s[1:]
        elif s[0] == '!': cls = 'red'; s = s[1:]
        disp, _, spoken = s.partition('|')
        spoken = spoken or disp
        toks.append({'disp': disp + trail, 'cls': cls, 'n': len((spoken + trail).split())})
    return toks

CAPS, CUES = [], {}
wi = 0
for t in parse_tokens(DATA['script']):
    if 'cue' in t: CUES[t['cue']] = WORDS[wi]['start'] if wi < len(WORDS) else AUDIO; continue
    CAPS.append((WORDS[wi]['start'], t['disp'], t['cls'])); wi += t['n']
def word_t(word, after=0.0):
    for x in WORDS:
        if x['w'] == word and x['start'] >= after: return x['start']
    raise KeyError(word)

# ---------- shots (clip, start, end, push, punch-in time) ----------
C = lambda name: os.path.join(HERE, 'clips', name + '.mp4')
SHOTS = [
    ('IMG:F01_intersection_wide', 0.0, CUES['problem'], None),  # Wan kept turning the light green: painting + push
    ('F02', CUES['problem'], word_t('Lamborghini.'), None),
    ('F03', word_t('Lamborghini.'), word_t('stuck'), None),
    ('F04', word_t('stuck'), CUES['heli'], None),
    ('F05', CUES['heli'], CUES['looks'], None),
    ('F06', CUES['looks'], CUES['nolights'], None),
    ('F07', CUES['nolights'], CUES['gwagon'], None),
    ('F08', CUES['gwagon'], CUES['regular'], word_t('thinking,', CUES['gwagon'])),
    ('F09', CUES['regular'], CUES['doug'], word_t('thinking,', CUES['regular'])),
    ('F10', CUES['doug'], CUES['bet'], word_t('thinking,', CUES['doug'])),
    ('F11', CUES['bet'], CUES['picture'], None),
    ('F12', CUES['picture'], CUES['now'], None),
    ('F13', CUES['now'], CUES['green'], word_t('helicopter.', CUES['now'])),
    ('Xgreen', CUES['green'], word_t('cars', CUES['green'])),
    ('F15', word_t('cars', CUES['green']), CUES['wheel'], None),
    ('F16', CUES['wheel'], CUES['walk'], None),
    ('F17', CUES['walk'], CUES['moral'], None),
    ('F18', CUES['moral'], CUES['end'], word_t('appreciate')),
    ('F19', CUES['end'], CUES['cta'], None),
    ('F20', CUES['cta'], END, None),   # ending: the helicopter flies away (Brian)
]
SHOTS = [s if len(s) == 4 else s + (None,) for s in SHOTS]
# missing clips fall back to a stand-in until Brian's art arrives
FALLBACK = {'F18': 'F11'}
if not os.path.exists(C('F15')):   # no split shot yet: the green-light clip covers "The cars pull away" too
    k = [s[0] for s in SHOTS].index('F15'); g = SHOTS[k - 1]
    SHOTS[k - 1] = (g[0], g[1], SHOTS[k][2], g[3]); del SHOTS[k]
SHAKE = [(word_t('red', CUES['light']), 0.12)]

# ---------- thought clouds: (prop, start, end, head xy in screen px, cloud centre, cloud width) ----------
PROP_FALLBACK = {'P07_victor_flying_helicopter': 'P01_helicopter'}
def P(name):
    f = os.path.join(HERE, 'props', name + '.png')
    if not os.path.exists(f) and name in PROP_FALLBACK: f = os.path.join(HERE, 'props', PROP_FALLBACK[name] + '.png')
    return f
CLOUDS = [
    ('P02_yellow_supercar', word_t('dream'), word_t('Lamborghini.'), (550, 900), (560, 470), 760),
    ('P01_helicopter', word_t('thinks,'), CUES['nolights'], (300, 700), (620, 330), 700),
    ('P02_yellow_supercar', word_t('thinking,', CUES['gwagon']), CUES['regular'], (420, 880), (600, 380), 720),
    ('P03_black_suv', word_t('thinking,', CUES['regular']), CUES['doug'], (280, 1240), (560, 420), 760),
    ('P04_three_cars', word_t('thinking,', CUES['doug']), CUES['bet'], (900, 1230), (520, 430), 800),
    ('P06_victor_driving', word_t('picture'), CUES['now'], (670, 1020), (470, 420), 760),
    ('P07_victor_flying_helicopter', word_t('picturing'), CUES['green'], (320, 900), (620, 330), 720),
    ('P05_walt_walking', CUES['walk'] + 0.2, CUES['moral'], (640, 760), (460, 330), 620),
]

# ---------- helpers ----------
ease = lambda x: 0.5 - 0.5 * math.cos(math.pi * min(1, max(0, x)))
def back(x):  # ease-out-back for pops
    x = min(1, max(0, x)); c = 1.9
    return 1 + (c + 1) * (x - 1) ** 3 + c * (x - 1) ** 2

def cloud_shape(w):
    h = int(w * 0.66)
    img = Image.new('RGBA', (w + 40, h + 40), (0, 0, 0, 0)); d = ImageDraw.Draw(img)
    cx, cy = (w + 40) / 2, (h + 40) / 2
    puffs = []
    for k in range(14):
        a = 2 * math.pi * k / 14
        rx, ry = w * 0.40, h * 0.36
        r = (0.17 + 0.03 * ((k * 7) % 3)) * w
        puffs.append((cx + rx * math.cos(a), cy + ry * math.sin(a), r))
    puffs.append((cx, cy, h * 0.42))
    mask = Image.new('L', img.size, 0); md = ImageDraw.Draw(mask)
    for x, y, r in puffs: md.ellipse((x - r * 0.8, y - r * 0.62, x + r * 0.8, y + r * 0.62), fill=255)
    for x, y, r in puffs: md.ellipse((x - r * 0.8, y - r * 0.62, x + r * 0.8, y + r * 0.62), fill=255)
    return mask

_cloud_cache = {}
def build_cloud(prop, w):
    key = (prop, w)
    if key in _cloud_cache: return _cloud_cache[key]
    mask = cloud_shape(w)
    big = mask.size
    out = Image.new('RGBA', (big[0] + 40, big[1] + 40), (0, 0, 0, 0))
    sh = Image.new('L', out.size, 0); sh.paste(mask, (28, 34)); sh = sh.filter(ImageFilter.GaussianBlur(14))
    out.paste((40, 30, 70, 110), (0, 0), sh)
    edge = mask.filter(ImageFilter.MaxFilter(9))
    out.paste((35, 35, 45, 255), (20, 20), edge)                 # dark outline
    out.paste((255, 255, 255, 255), (20, 20), mask)              # white body
    if os.path.exists(P(prop)):
        im = Image.open(P(prop)).convert('RGB')
        iw = int(w * 0.80); ih = int(iw * im.height / im.width)
        if ih > big[1] * 0.74: ih = int(big[1] * 0.74); iw = int(ih * im.width / im.height)
        im = im.resize((iw, ih), Image.LANCZOS)
        om = Image.new('L', (iw, ih), 0); ImageDraw.Draw(om).ellipse((0, 0, iw, ih), fill=255)
        om = om.filter(ImageFilter.GaussianBlur(min(iw, ih) * 0.06))
        out.paste(im, ((out.width - iw) // 2, (out.height - ih) // 2), om)
    _cloud_cache[key] = out
    return out

def circle(r):
    im = Image.new('RGBA', (2 * r + 10, 2 * r + 10), (0, 0, 0, 0)); d = ImageDraw.Draw(im)
    d.ellipse((1, 1, 2 * r + 7, 2 * r + 7), fill=(35, 35, 45, 255)); d.ellipse((5, 5, 2 * r + 3, 2 * r + 3), fill=(255, 255, 255, 255))
    return im

_font_cache = {}
def font(sz):
    if sz not in _font_cache: _font_cache[sz] = ImageFont.truetype(FONT, sz)
    return _font_cache[sz]
_cap_cache = {}
def caption(text, cls):
    key = (text, cls)
    if key in _cap_cache: return _cap_cache[key]
    sz = 112
    while font(sz).getlength(text) > W - 120 and sz > 60: sz -= 6
    f = font(sz); tw = int(f.getlength(text)) + 60
    im = Image.new('RGBA', (tw, sz + 80), (0, 0, 0, 0)); d = ImageDraw.Draw(im)
    fill = GOLD if cls == 'gold' else RED if cls == 'red' else (255, 255, 255)
    d.text((30 + 4, 20 + 8), text, font=f, fill=(0, 0, 0, 140), stroke_width=16, stroke_fill=(0, 0, 0, 140))
    d.text((30, 20), text, font=f, fill=fill, stroke_width=16, stroke_fill=(0, 0, 0))
    _cap_cache[key] = im
    return im

def follow_button(state):
    w, h = 470, 130
    im = Image.new('RGBA', (w + 20, h + 20), (0, 0, 0, 0)); d = ImageDraw.Draw(im)
    if state == 0:
        d.rounded_rectangle((10, 14, w + 10, h + 14), 34, fill=(0, 0, 0, 120))
        d.rounded_rectangle((10, 10, w + 10, h + 10), 34, fill=(254, 44, 85), outline=(0, 0, 0), width=6)
        t = '+ FOLLOW'; col = (255, 255, 255)
    else:
        d.rounded_rectangle((10, 10, w + 10, h + 10), 34, fill=(245, 245, 245), outline=(0, 0, 0), width=6)
        t = '✓ FOLLOWING'; col = (40, 40, 40)
    f = font(62 if state == 0 else 54)
    tw = f.getlength(t); d.text(((w + 20 - tw) / 2, 10 + (h - 70) / 2), t, font=f, fill=col)
    return im

def cursor():
    im = Image.new('RGBA', (90, 90), (0, 0, 0, 0)); d = ImageDraw.Draw(im)
    pts = [(10, 6), (10, 74), (28, 58), (40, 84), (52, 78), (40, 53), (64, 53)]
    d.polygon(pts, fill=(255, 255, 255), outline=(0, 0, 0)); d.line(pts + [pts[0]], fill=(0, 0, 0), width=5)
    return im
BTN = [follow_button(0), follow_button(1)]; CUR = cursor()

# ---------- clip frames ----------
PUSH = {'IMG:F01_intersection_wide': 0.14}
SKIP = {}   # seconds to skip at a clip's start (e.g. a bad AI moment)
def load_clip(name):
    if name.startswith('IMG:'):
        return np.asarray(Image.open(os.path.join(HERE, 'art916', name[4:] + '.jpg')).convert('RGB'))[None]
    path = C(name)
    if not os.path.exists(path) and name in FALLBACK: path = C(FALLBACK[name])
    if not os.path.exists(path): return None
    raw = subprocess.run(['ffmpeg', '-v', 'error', '-i', path, '-f', 'rawvideo', '-pix_fmt', 'rgb24', '-'], capture_output=True).stdout
    w, h = map(int, subprocess.run(['ffprobe', '-v', 'error', '-select_streams', 'v:0', '-show_entries', 'stream=width,height', '-of', 'csv=p=0', path], capture_output=True, text=True).stdout.strip().split(','))
    n = len(raw) // (w * h * 3)
    fr = np.frombuffer(raw, np.uint8)[: n * w * h * 3].reshape(n, h, w, 3)
    return fr[int(SKIP.get(name, 0) * FPS):]

def frame_at(t):
    for i, (name, a, b, punch) in enumerate(SHOTS):
        if a <= t < b or i == len(SHOTS) - 1: return i
    return len(SHOTS) - 1

def render_frame(t, clips):
    i = frame_at(t); name, a, b, punch = SHOTS[i]
    fr = clips.get(name)
    u = t - a; dur = b - a
    if fr is None:
        base = Image.new('RGB', (W, H), (60, 60, 70))
    else:
        n = len(fr); clipdur = n / FPS
        if name == 'F19' and t >= CUES['cta']:  # CTA: hold the last clip frame
            k = min(n - 1, int((CUES['cta'] - a) * FPS * min(1, clipdur / max(0.01, CUES['cta'] - a))))
        else:
            rate = min(1.0, clipdur / dur) if dur > clipdur else 1.0
            k = min(n - 1, int(u * rate * FPS))
        src = Image.fromarray(fr[k])
        z = 1.0 + PUSH.get(name, 0.04) * ease(u / dur)      # gentle push across every shot
        if punch is not None: z *= 1.0 + 0.13 * ease((t - punch) / 0.35)
        sw, sh = src.size
        # cover-fit 9:16, then zoom about the centre
        scale = max(W / sw, H / sh) * z
        cw, ch = W / scale, H / scale
        box = ((sw - cw) / 2, (sh - ch) / 2, (sw + cw) / 2, (sh + ch) / 2)
        base = src.resize((W, H), Image.LANCZOS, box=box)
    for st, d in SHAKE:
        if st <= t < st + d:
            k = int((t - st) * FPS); dx = (-14, 12, -8, 6)[k % 4]
            base = base.transform(base.size, Image.AFFINE, (1, 0, dx, 0, 1, dx // 2))
    frame = base.convert('RGBA')
    # zoom factor at this moment (to keep cloud tails pointing at the head)
    zf = (1.0 + PUSH.get(name, 0.04) * ease(u / dur)) * ((1.0 + 0.13 * ease((t - punch) / 0.35)) if punch is not None else 1.0)
    for prop, cs, ce, head, cc, cw in CLOUDS:
        if not (cs <= t < ce): continue
        if not os.path.exists(P(prop)): continue
        p = t - cs
        cc = (cc[0], max(cc[1], 150 + build_cloud(prop, cw).height / 2))
        hx = W / 2 + (head[0] - W / 2) * zf; hy = H / 2 + (head[1] - H / 2) * zf
        bob = 6 * math.sin(p * 3.2)
        # trailing circles from head to cloud
        for j, (frac, r) in enumerate(((0.16, 20), (0.34, 30), (0.54, 42))):
            if p < 0.05 * j: continue
            s = back((p - 0.05 * j) / 0.18)
            x = hx + (cc[0] - hx) * frac; y = hy - 40 + (cc[1] - hy + 40) * frac
            c = circle(max(2, int(r * s)))
            frame.alpha_composite(c, (int(x - c.width / 2), int(y - c.height / 2 + bob * frac)))
        s = back((p - 0.12) / 0.28)
        if s <= 0: continue
        cl = build_cloud(prop, cw)
        cc = (cc[0], max(cc[1], 150 + cl.height / 2))   # keep the cloud out of the top 140 px (app UI)
        if abs(s - 1) > 1e-3: cl = cl.resize((max(1, int(cl.width * s)), max(1, int(cl.height * s))), Image.LANCZOS)
        frame.alpha_composite(cl, (int(cc[0] - cl.width / 2), int(cc[1] - cl.height / 2 + bob)))
    # CTA follow button
    if t >= CUES['cta'] + 0.4:
        p = t - CUES['cta'] - 0.4
        tap = 2.1
        btn = BTN[1 if p >= tap else 0]
        s = back(p / 0.3) if p < tap else 1.0 + 0.08 * math.sin(min(1, (p - tap) / 0.25) * math.pi)
        b2 = btn.resize((max(1, int(btn.width * s)), max(1, int(btn.height * s))), Image.LANCZOS) if abs(s - 1) > 1e-3 else btn
        bx, by = W / 2, 560
        frame.alpha_composite(b2, (int(bx - b2.width / 2), int(by - b2.height / 2)))
        if 0.6 < p < tap + 0.7:
            q = ease((p - 0.6) / 1.2); x = 900 + (bx + 60 - 900) * q; y = 1500 + (by + 10 - 1500) * q
            if tap - 0.1 < p < tap + 0.15: x += 4; y += 6
            frame.alpha_composite(CUR, (int(x), int(y)))
    # caption
    cur = None
    for st, disp, cls in CAPS:
        if st <= t: cur = (disp, cls)
        else: break
    if cur and t < AUDIO + 0.2:
        c = caption(*cur)
        frame.alpha_composite(c, (int(W / 2 - c.width / 2), int(1270 - c.height / 2)))
    return frame.convert('RGB')

def main():
    args = sys.argv[1:]
    names = sorted({s[0] for s in SHOTS})
    if '--frame' in args:   # clean frame for the cover: no captions, clouds or follow button
        global CLOUDS, CAPS; CLOUDS, CAPS = [], []
        t = float(args[args.index('--frame') + 1]); CUES['cta'] = 1e9
        img = render_frame(t, {SHOTS[frame_at(t)][0]: load_clip(SHOTS[frame_at(t)][0])})
        out = os.path.join(HERE, '.cover_frame.png'); img.save(out); print(out); return
    if '--preview' in args:
        ts = [float(x) for x in args[args.index('--preview') + 1].split(',')]
        need = {SHOTS[frame_at(t)][0] for t in ts}
        clips = {n: load_clip(n) for n in need}
        ims = [render_frame(t, clips).resize((360, 640)) for t in ts]
        cols = min(6, len(ims)); rows = math.ceil(len(ims) / cols)
        sheet = Image.new('RGB', (cols * 360, rows * 640), 'black')
        for k, im in enumerate(ims): sheet.paste(im, ((k % cols) * 360, (k // cols) * 640))
        out = os.path.join(HERE, 'preview.jpg'); sheet.save(out, quality=88); print(out); return
    out = os.path.join(HERE, args[args.index('--out') + 1] if '--out' in args else 'final.mp4')
    music = os.path.join(HERE, 'music.mp3')
    cmd = ['ffmpeg', '-y', '-v', 'error', '-f', 'rawvideo', '-pix_fmt', 'rgb24', '-s', f'{W}x{H}', '-r', str(FPS), '-i', '-',
           '-i', os.path.join(HERE, 'voice.mp3')]
    if os.path.exists(music):
        cmd += ['-i', music, '-filter_complex', f'[2:a]volume=0.12,atrim=0:{END}[m];[1:a]apad[v];[v][m]amix=inputs=2:duration=first[a]', '-map', '0:v', '-map', '[a]']
    else:
        cmd += ['-filter_complex', '[1:a]apad[a]', '-map', '0:v', '-map', '[a]']
    cmd += ['-t', f'{END:.3f}', '-c:v', 'libx264', '-preset', 'medium', '-crf', '19', '-pix_fmt', 'yuv420p', '-c:a', 'aac', '-b:a', '192k', '-movflags', '+faststart', out]
    enc = subprocess.Popen(cmd, stdin=subprocess.PIPE)
    N = int(round(END * FPS)); cur_shot = None; clips = {}
    for f in range(N):
        t = f / FPS
        name = SHOTS[frame_at(t)][0]
        if name != cur_shot:
            clips = {name: load_clip(name)}; cur_shot = name
        enc.stdin.write(render_frame(t, clips).tobytes())
        if f % 150 == 0: print(f'{t:5.1f}s / {END:.1f}s', flush=True)
    enc.stdin.close(); enc.wait(); print('->', out)
    if out.endswith('final.mp4') and os.path.exists(os.path.join(HERE, 'sfx.py')):   # rebuild the SFX + voice mix
        subprocess.run([sys.executable, os.path.join(HERE, 'sfx.py')], check=True)

if __name__ == '__main__':
    main()
