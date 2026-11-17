#!/usr/bin/env python3
"""v2: timed to voice.mp3, supermarket panic-buying hook (OpenArt clips), then the explainer cards.

  python3 make_v2.py --preview   -> preview_v2.jpg
  python3 make_v2.py             -> 17-countries-stock-up-v2.mp4

Card times are absolute seconds on the voice timeline (phrase onsets measured from voice.mp3).
"""
import math, os, subprocess, sys
from PIL import Image, ImageDraw
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import make as M   # flags, text layers, background, element drawing
from make import W, H, FPS, ease, back, text_layer, flag, paste, cached, appear, SEVENTEEN, GREY

HERE = os.path.dirname(os.path.abspath(__file__))
A = os.path.join(HERE, 'assets'); B = os.path.join(HERE, '.build')
VOICE = os.path.join(HERE, 'voice.mp3')
CLIPS = {'wide': ('super_wide.mp4', 0.0), 'hands': ('super_hands.mp4', 0.6)}   # file, in-point (s)

# (start, kind/background, elements) — element times are ABSOLUTE seconds
SHOTS = [
    (0.00, ('clip', 'wide'), [('text', -1, 'Why the f*** are *17 *countries / telling people / to *stock *up?', 88, 300)]),
    (4.33, ('clip', 'hands'), [('text', 4.58, "They're preparing / for !something.", 100, 330)]),
    (6.07, 'bg', [('text', 6.07, "It's real.", 100, 330), ('flags', 6.07, SEVENTEEN, 700)]),
    (7.18, 'bg', [('text', 7.40, "But it's !NOT a / !November !17 !shutdown.", 90, 700)]),
    (10.02, 'bg', [('text', 10.25, "Here's what's / *actually going on.", 100, 700)]),
    (12.17, 'bg', [('text', 12.45, 'March 2025: the *EU told / 450 million people:', 70, 380), ('flagone', 12.6, 'EU', 650),
                   ('count', 17.9, 72, 'HOURS', 960), ('text', 18.7, 'of food, water & medicine / at home', 62, 1220),
                   ('src', 0, 'Source: European Commission Preparedness Strategy, Mar 2025')]),
    (21.93, 'bg', [('flagone', 22.1, 'SE', 420), ('text', 22.2, '^Sweden mailed a booklet / to every household:', 70, 640),
                   ('text', 25.05, '"If *Crisis or *War / *Comes"', 96, 900), ('src', 0, 'Source: Swedish civil-defence agency, Nov 2024')]),
    (27.99, 'bg', [('text', 27.99, 'How long they say / to last on your own', 70, 330),
                   ('bars', [('EU', 'EU', 3, '72 hrs', 28.0), ('DE', 'Germany', 10, '10 days', 28.25),
                             ('NO', 'Norway', 7, 'about 1 week', 30.65), ('SE', 'Sweden', 7, 'about 1 week', 30.95)], 620),
                   ('src', 0, 'Source: Newsweek roundup of national guidance')]),
    (32.92, 'bg', [('text', 33.2, 'Why now?', 104, 380), ('text', 34.3, '3 reasons', 60, 540),
                   ('text', 35.55, '1. !War in !Ukraine', 74, 720), ('text', 36.85, '2. !Cyberattacks', 74, 880),
                   ('text', 38.0, '3. Storms knocking / out !power', 74, 1040)]),
    (40.00, 'bg', [('text', 40.3, 'So where does / *"November *17" / come from?', 96, 600)]),
    (43.01, 'bg', [('chips', [('An old WEF / cyber drill', 43.3), ('A phone / alert test', 45.85), ('The 72-hour / advice', 47.5)], 380),
                   ('arrow', 49.2, 1010), ('text', 49.3, 'stitched into / !one !viral !post', 92, 1100)]),
    (50.95, 'bg', [('text', 51.25, "There's no / *\"world *power *grid\" / to switch off.", 92, 520), ('text', 54.0, 'Every country / runs its own.', 76, 1000)]),
    (55.90, 'bg', [('text', 56.25, 'What they actually want / in your closet:', 66, 300),
                   ('check', [('Water', 58.75), ('Canned food', 59.45), ('Radio', 60.55), ('Flashlight', 61.35), ('Cash', 62.55), ('Your meds', 63.35)], 520)]),
    (64.28, 'bg', [('text', 64.55, "They're not preparing / for a !date.", 92, 560), ('text', 66.58, "They're preparing / for a *bad *week.", 92, 940)]),
    (68.78, 'bg', [('text', 69.1, "More of what's really / behind the headlines", 66, 520), ('follow', 69.9, 'FOLLOW', 900)]),
]
TOTAL = 72.6
STARTS = [s[0] for s in SHOTS]

def clip_frame(name, lt):
    f, inp = CLIPS[name]; d = os.path.join(B, name)
    k = int(round((inp + lt) * FPS)) + 1
    p = os.path.join(d, f'{k:04d}.jpg')
    while not os.path.exists(p) and k > 1: k -= 1; p = os.path.join(d, f'{k:04d}.jpg')
    return Image.open(p).convert('RGB')

GRAD = Image.new('L', (W, H), 0); _g = ImageDraw.Draw(GRAD)
for y in range(0, 1050): _g.line([(0, y), (W, y)], fill=int(235 * (1 - y / 1050) ** 1.1))
BLACK = Image.new('RGB', (W, H), (0, 0, 0))

def draw_el(fr, el, t):
    k = el[0]
    if k == 'text':
        _, t0, s, size, y = el; L = cached(('t', s, size), lambda: text_layer(s, size)); a, dy, sc = appear(t, t0); paste(fr, L, W / 2, y, a, sc, dy)
    elif k == 'flagone':
        _, t0, c, y = el; L = cached(('f1', c), lambda: flag(c, 240, 160)); a, dy, sc = appear(t, t0); paste(fr, L, W / 2, y, a, sc, dy)
    elif k == 'src':
        M.draw_el(fr, el, 1.0)
    elif k == 'count':
        M.draw_el(fr, ('count', el[1], el[2], el[3], el[4]), t)
    elif k == 'flags':
        _, t0, codes, y0 = el; fw, fh, g = 180, 120, 20; lt = t - t0
        for i, c in enumerate(codes):
            r, kk = divmod(i, 5); n = min(5, len(codes) - r * 5)
            x = W / 2 + (kk - (n - 1) / 2) * (fw + g); y = y0 + r * (fh + g); ti = i * 0.05 - 0.15
            if lt < ti: continue
            p = (lt - ti) / 0.25; L = cached(('f', c), lambda c=c: flag(c, fw, fh)); paste(fr, L, x, y, ease(p), back(p))
        cnt = max(1, min(len(codes), int((lt + 0.15) / 0.05) + 1))
        L = cached(('cnt', cnt), lambda: text_layer(f'*{cnt} countries', 52, weight='ExtraBold')); paste(fr, L, W / 2, y0 + 4 * (fh + g) + 10, 1)
    elif k == 'bars':
        _, rows, y0 = el; d = ImageDraw.Draw(fr)
        for i, (code, name, days, lab, ti) in enumerate(rows):
            if t < ti: continue
            y = y0 + i * 190; p = ease((t - ti) / 0.7)
            fl = cached(('fb', code), lambda c=code: flag(c, 120, 80)); paste(fr, fl, 130, y, min(1, (t - ti) / 0.2))
            nm = cached(('bn', name), lambda n=name: text_layer(n, 44, weight='Bold')); fr.alpha_composite(nm, (210, int(y - 6)))
            bw = int(620 * days / 10 * p); d.rounded_rectangle([210, y + 50, 210 + max(bw, 8), y + 100], 12, fill=M.GOLD if days >= 7 else M.WHITE)
            lb = cached(('bl', lab), lambda l=lab: text_layer(l, 46, weight='ExtraBold'))
            if p > 0.6: fr.alpha_composite(lb, (min(W - lb.width - 30, 230 + bw), int(y + 48)))
    elif k == 'chips':
        _, items, y0 = el
        for i, (s, ti) in enumerate(items):
            if t < ti: continue
            a, dy, sc = appear(t, ti); L = cached(('chip', s), lambda s=s: M.chip(s)); paste(fr, L, W / 2, y0 + i * 210, a, sc, dy)
    elif k == 'arrow':
        _, ti, ya = el
        if t < ti: return
        d = ImageDraw.Draw(fr); p = ease((t - ti) / 0.4); yb = ya + 70 * p
        d.line([(W / 2, ya), (W / 2, yb)], fill=M.RED, width=10)
        if p > 0.5: d.polygon([(W / 2 - 30, yb - 20), (W / 2 + 30, yb - 20), (W / 2, yb + 15)], fill=M.RED)
    elif k == 'check':
        _, items, y0 = el; d = ImageDraw.Draw(fr)
        for i, (s, ti) in enumerate(items):
            y = y0 + i * 140; d.rounded_rectangle([170, y, 250, y + 80], 14, outline=(90, 90, 90) if t < ti else M.WHITE, width=5)
            if t < ti: continue
            p = ease((t - ti) / 0.3)
            d.line([(185, y + 42), (205, y + 42 + 22 * p)] + ([(240, y + 14)] if p > 0.5 else []), fill=M.GREEN, width=10)
            L = cached(('ck', s), lambda s=s: text_layer(s, 68, weight='ExtraBold', align='left')); paste(fr, L, 290 + L.width / 2, y, p)
    elif k == 'follow':
        _, ti, _, y = el
        if t < ti: return
        p = back((t - ti) / 0.45); L = cached('follow', M.follow_btn); paste(fr, L, W / 2, y, min(1, (t - ti) / 0.2), p * (1 + 0.04 * math.sin(t * 8)))

def frame(t):
    i = max(k for k in range(len(SHOTS)) if STARTS[k] <= t + 1e-9); st = STARTS[i]
    en = STARTS[i + 1] if i + 1 < len(SHOTS) else TOTAL; lt = t - st; bgk = SHOTS[i][1]
    if isinstance(bgk, tuple):
        fr = clip_frame(bgk[1], lt); fr = Image.composite(BLACK, fr, GRAD).convert('RGBA')
    else:
        ox = int(120 + 60 * math.sin(t * 0.35)); oy = int((t * 40) % 80)
        fr = M.BG.crop((ox, oy, ox + W, oy + H)); fr = Image.composite(M.DARK, fr, M.VIG).convert('RGBA')
    for el in SHOTS[i][2]: draw_el(fr, el, t)
    z = 1 + 0.03 * lt / max(0.5, en - st)
    cw, ch = W / z, H / z
    fr = fr.crop((int((W - cw) / 2), int((H - ch) / 2), int((W + cw) / 2), int((H + ch) / 2))).resize((W, H), Image.BILINEAR)
    return fr.convert('RGB')

def prep_clips():
    for name, (f, _) in CLIPS.items():
        d = os.path.join(B, name)
        if os.path.isdir(d) and os.listdir(d): continue
        os.makedirs(d, exist_ok=True)
        subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', os.path.join(A, f), '-vf',
                        f'scale={W}:{H}:force_original_aspect_ratio=increase,crop={W}:{H},fps={FPS}', '-q:v', '2', os.path.join(d, '%04d.jpg')], check=True)

def mix(out):
    """voice (lead) + supermarket clip ambience under the hook + low drone bed with cut hits, ducked under the voice."""
    hits = '+'.join(f"0.35*sin(2*PI*55*(t-{s:.3f}))*exp(-6*(t-{s:.3f}))*gte(t,{s:.3f})" for s in STARTS[2:])
    wide, hands = os.path.join(A, CLIPS['wide'][0]), os.path.join(A, CLIPS['hands'][0])
    e1, e2 = STARTS[1], STARTS[2]; hin = CLIPS['hands'][1]
    g = (f"[0:a]aresample=48000,aformat=channel_layouts=stereo,loudnorm=I=-15:TP=-2:LRA=9,asplit[vo][sc];"
         f"[1:a]atrim=0:{e1:.3f},asetpts=PTS-STARTPTS,aresample=48000,aformat=channel_layouts=stereo,volume=-8dB,afade=t=out:st={e1 - 0.1:.3f}:d=0.1[a1];"
         f"[2:a]atrim={hin:.3f}:{hin + e2 - e1:.3f},asetpts=PTS-STARTPTS,aresample=48000,aformat=channel_layouts=stereo,volume=-8dB,afade=t=out:st={e2 - e1 - 0.15:.3f}:d=0.15,adelay={int(e1 * 1000)}|{int(e1 * 1000)}[a2];"
         f"aevalsrc='0.16*sin(2*PI*41.2*t)*(0.7+0.3*sin(2*PI*0.1*t))+0.07*sin(2*PI*61.7*t)+0.04*sin(2*PI*82.4*t+sin(2*PI*0.23*t))+{hits}':s=48000:d={TOTAL:.3f},"
         f"afade=t=in:st={e2 - 0.3:.3f}:d=0.3,afade=t=out:st={TOTAL - 1.2:.3f}:d=1.2,pan=stereo|c0=c0|c1=c0,volume=-6dB[bed];"
         f"[bed][sc]sidechaincompress=threshold=0.03:ratio=5:attack=20:release=300[bedd];"
         f"[vo][a1][a2][bedd]amix=4:normalize=0:duration=longest,apad,atrim=0:{TOTAL:.3f},alimiter=limit=0.8:level=disabled[out]")
    subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', VOICE, '-i', wide, '-i', hands, '-filter_complex', g, '-map', '[out]', '-ar', '48000', out], check=True)

if __name__ == '__main__':
    prep_clips()
    if '--preview' in sys.argv:
        ts = [s + 0.85 * ((STARTS[i + 1] if i + 1 < len(SHOTS) else TOTAL) - s) for i, s in enumerate(STARTS)] + [0.0]
        tiles = [frame(t).resize((270, 480)) for t in ts]
        sheet = Image.new('RGB', (270 * 8, 480 * 2), (40, 40, 40))
        for k, im in enumerate(tiles): sheet.paste(im, ((k % 8) * 270, (k // 8) * 480))
        sheet.save(os.path.join(HERE, 'preview_v2.jpg'), quality=88); print('preview_v2.jpg'); sys.exit()
    wav = os.path.join(B, 'mix.wav'); mix(wav)
    out = os.path.join(HERE, '17-countries-stock-up-v2.mp4')
    p = subprocess.Popen(['ffmpeg', '-v', 'error', '-y', '-f', 'rawvideo', '-pix_fmt', 'rgb24', '-s', f'{W}x{H}', '-r', str(FPS), '-i', '-',
                          '-i', wav, '-c:v', 'libx264', '-preset', 'medium', '-crf', '18', '-pix_fmt', 'yuv420p', '-profile:v', 'high',
                          '-c:a', 'aac', '-b:a', '192k', '-movflags', '+faststart', '-shortest', out], stdin=subprocess.PIPE)
    n = int(round(TOTAL * FPS))
    for k in range(n):
        p.stdin.write(frame(k / FPS).tobytes())
        if k % 300 == 0: print(f'{k}/{n}', flush=True)
    p.stdin.close(); p.wait(); print('wrote', out)
