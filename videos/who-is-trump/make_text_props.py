# Engine text overlays for who-is-trump (exact spelling, transparent PNG = *.cut.png, no green keying).
# Run: python3 videos/who-is-trump/make_text_props.py
from PIL import Image, ImageDraw, ImageFont
import os, math
D = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'art')
BLK = '/usr/share/fonts/opentype/inter/InterDisplay-Black.otf'
SER = '/usr/share/fonts/truetype/dejavu/DejaVuSerif-Bold.ttf'
f = lambda p, s: ImageFont.truetype(p, s)
def save(im, n): im.save(os.path.join(D, n + '.cut.png')); print(n, im.size)

def plaque(text, n, w=1100, h=230, size=86, bg=(26, 32, 72), fg=(244, 200, 80), font=SER):
    im = Image.new('RGBA', (w + 24, h + 24), (0, 0, 0, 0)); d = ImageDraw.Draw(im)
    d.rounded_rectangle((12, 18, w + 12, h + 18), 26, fill=(0, 0, 0, 110))
    d.rounded_rectangle((6, 6, w + 6, h + 6), 26, fill=fg)
    d.rounded_rectangle((20, 20, w - 8, h - 8), 18, fill=bg)
    F = f(font, size)
    while d.textlength(text, font=F) > w - 90: size -= 4; F = f(font, size)
    tw = d.textlength(text, font=F); bb = d.textbbox((0, 0), text, font=F)
    d.text(((w + 12 - tw) / 2, (h + 12 - (bb[3] + bb[1])) / 2), text, font=F, fill=fg)
    save(im, n)

def stamp(text, n, col=(220, 30, 40)):
    W, H = 1000, 300; im = Image.new('RGBA', (W, H), (0, 0, 0, 0)); d = ImageDraw.Draw(im)
    d.rounded_rectangle((14, 14, W - 14, H - 14), 30, outline=col + (255,), width=22)
    d.rounded_rectangle((44, 44, W - 44, H - 44), 18, outline=col + (255,), width=8)
    F = f(BLK, 170); tw = d.textlength(text, font=F); bb = d.textbbox((0, 0), text, font=F)
    d.text(((W - tw) / 2, (H - (bb[3] + bb[1])) / 2), text, font=F, fill=col + (255,))
    # worn ink: knock out a few speckles
    import random; random.seed(4)
    for _ in range(260):
        x, y, r = random.randint(0, W), random.randint(0, H), random.randint(2, 7); d.ellipse((x, y, x + r, y + r), fill=(0, 0, 0, 0))
    save(im.rotate(-8, expand=True, resample=Image.BICUBIC), n)

def tag(text, n, fg=(0, 0, 0), bg=(255, 255, 255)):
    F = f(BLK, 110); tmp = ImageDraw.Draw(Image.new('RGBA', (1, 1))); tw = tmp.textlength(text, font=F)
    W, H = int(tw + 120), 190; im = Image.new('RGBA', (W + 16, H + 16), (0, 0, 0, 0)); d = ImageDraw.Draw(im)
    d.rounded_rectangle((10, 14, W + 10, H + 14), 95, fill=(0, 0, 0, 255))
    d.rounded_rectangle((0, 0, W, H), 95, fill=(0, 0, 0, 255)); d.rounded_rectangle((10, 10, W - 10, H - 10), 85, fill=bg)
    bb = d.textbbox((0, 0), text, font=F); d.text(((W - tw) / 2, (H - (bb[3] + bb[1])) / 2), text, font=F, fill=fg)
    save(im, n)

def badge(num, n):
    S = 420; im = Image.new('RGBA', (S, S), (0, 0, 0, 0)); d = ImageDraw.Draw(im)
    for i in range(24):  # starburst rim
        a0 = i * math.pi / 12; pts = [(S/2 + math.cos(a0 + k * math.pi / 24) * (205 if k % 2 == 0 else 175), S/2 + math.sin(a0 + k * math.pi / 24) * (205 if k % 2 == 0 else 175)) for k in range(3)]
        d.polygon(pts + [(S/2, S/2)], fill=(0, 0, 0))
    d.ellipse((24, 24, S - 24, S - 24), fill=(0, 0, 0)); d.ellipse((34, 34, S - 34, S - 34), fill=(255, 210, 58))
    d.ellipse((58, 58, S - 58, S - 58), outline=(170, 120, 20), width=6)
    F = f(BLK, 50); t = 'PRESIDENT'; d.text(((S - d.textlength(t, font=F)) / 2, 92), t, font=F, fill=(0, 0, 0))
    F = f(BLK, 170); t = '#' + num; tw = d.textlength(t, font=F); d.text(((S - tw) / 2, 140), t, font=F, fill=(0, 0, 0))
    save(im, n)

def bubble(text, n):
    W, H = 760, 300; im = Image.new('RGBA', (W, H + 90), (0, 0, 0, 0)); d = ImageDraw.Draw(im)
    for o, c in ((0, (0, 0, 0)), (10, (255, 255, 255))):
        d.rounded_rectangle((o, o, W - o, H - o), 70 - o, fill=c)
        d.polygon([(150 + o, H - 20), (300 - o, H - 20), (120 + o * 1.5, H + 85 - o * 2.2)], fill=c)
    F = f(BLK, 92); tw = d.textlength(text, font=F); bb = d.textbbox((0, 0), text, font=F)
    d.text(((W - tw) / 2, (H - (bb[3] + bb[1])) / 2), text, font=F, fill=(0, 0, 0))
    for i in range(3): d.ellipse((W - 150 + i * 36, 40, W - 126 + i * 36, 64), fill=(255, 74, 61))
    save(im, n)

def card(n):
    W, H = 980, 250; im = Image.new('RGBA', (W + 16, H + 16), (0, 0, 0, 0)); d = ImageDraw.Draw(im)
    d.rounded_rectangle((10, 14, W + 10, H + 14), 40, fill=(0, 0, 0)); d.rounded_rectangle((0, 0, W, H), 40, fill=(0, 0, 0))
    d.rounded_rectangle((10, 10, W / 2 - 4, H - 10), 32, fill=(255, 210, 58)); d.rounded_rectangle((W / 2 + 4, 10, W - 10, H - 10), 32, fill=(70, 150, 255))
    F = f(BLK, 120)
    for t, cx in (('TOWER', W / 4 - 30), ('TV SHOW', 3 * W / 4 + 30)):
        s = 120; F = f(BLK, s)
        while d.textlength(t, font=F) > W / 2 - 170: s -= 4; F = f(BLK, s)
        bb = d.textbbox((0, 0), t, font=F); d.text((cx - d.textlength(t, font=F) / 2, (H - (bb[3] + bb[1])) / 2), t, font=F, fill=(0, 0, 0))
    S = 150; c = Image.new('RGBA', (S, S), (0, 0, 0, 0)); e = ImageDraw.Draw(c); e.ellipse((0, 0, S, S), fill=(0, 0, 0)); e.ellipse((10, 10, S - 10, S - 10), fill=(255, 255, 255))
    F = f(BLK, 64); e.text(((S - e.textlength('OR', font=F)) / 2, 38), 'OR', font=F, fill=(0, 0, 0))
    im.alpha_composite(c, (int(W / 2 - S / 2), int(H / 2 - S / 2))); save(im, n)

def sparkle(n):
    S = 256; im = Image.new('RGBA', (S, S), (0, 0, 0, 0)); d = ImageDraw.Draw(im); c = S / 2
    d.polygon([(c, 0), (c + 22, c - 22), (S, c), (c + 22, c + 22), (c, S), (c - 22, c + 22), (0, c), (c - 22, c - 22)], fill=(255, 250, 225, 255))
    d.ellipse((c - 30, c - 30, c + 30, c + 30), fill=(255, 255, 255, 255)); save(im, n)

def confetti(n, col):
    im = Image.new('RGBA', (60, 30), col + (255,)); save(im, n)

def dark(n):
    save(Image.new('RGBA', (8, 8), (8, 10, 40, 255)), n)

plaque('THE TRUMP ORGANIZATION', 'T_org')
plaque('GROVER CLEVELAND', 'T_cleveland', w=900, h=170, size=76)
plaque('FOR RENT', 'T_forrent', w=520, h=200, size=110, bg=(255, 255, 255), fg=(200, 30, 40), font=BLK)
plaque('THE APPRENTICE', 'T_apprentice', w=1200, h=700, size=150, bg=(14, 16, 26), fg=(240, 200, 90), font=SER)
stamp('BANKRUPT', 'T_bankrupt')
for y in ('1946', '1983', '2016', '2020', '2024'): tag(y, 'T_' + y)
badge('45', 'T_45'); badge('47', 'T_47')
bubble('Tell me below!', 'T_bubble'); card('T_card'); sparkle('T_spark'); dark('T_dark')
for nm, c in (('red', (230, 40, 50)), ('white', (250, 250, 250)), ('blue', (40, 80, 220)), ('gold', (255, 205, 60))): confetti('C_' + nm, c)
