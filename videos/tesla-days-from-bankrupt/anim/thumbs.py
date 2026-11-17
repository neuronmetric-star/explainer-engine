"""Thumbnails / covers from the 4K scene images.
  python3 anim/thumbs.py   -> thumbs/long.jpg (1280x720) + thumbs/short_N.jpg (1080x1920)"""
import os
from PIL import Image, ImageDraw, ImageFont, ImageFilter, ImageEnhance
EP = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
FONT = '/usr/share/fonts/opentype/inter/InterDisplay-Black.otf'
YEL, WHT, RED = (255, 206, 46), (255, 255, 255), (255, 70, 60)

def img(n): return Image.open(os.path.join(EP, 'images', f'scene_{n:03d}.png')).convert('RGB')

def crop(im, cx, cy, w, h):
    x0 = min(max(0, cx - w // 2), im.width - w); y0 = min(max(0, cy - h // 2), im.height - h)
    return im.crop((x0, y0, x0 + w, y0 + h))

def gradient(size, top, bottom, y0, y1):
    """vertical dark band: alpha top..bottom between y0 and y1"""
    w, h = size; g = Image.new('L', (1, h))
    for y in range(h):
        if y < y0: a = top
        elif y > y1: a = bottom
        else: a = top + (bottom - top) * (y - y0) / max(1, y1 - y0)
        g.putpixel((0, y), int(a))
    return g.resize((w, h))

def text_lines(d, lines, x, y, size, anchor='la', stroke=None, gap=0.02):
    """lines: [[(word, color), ...], ...]; returns bottom y"""
    f = ImageFont.truetype(FONT, size); sw = stroke or max(4, size // 11)
    for ln in lines:
        full = ' '.join(w for w, _ in ln); tw = d.textlength(full, font=f)
        cx = x - tw / 2 if anchor == 'ma' else x
        for w, c in ln:
            d.text((cx, y), w, font=f, fill=c, stroke_width=sw, stroke_fill=(0, 0, 0))
            cx += d.textlength(w + ' ', font=f)
        y += int(size * (1 + gap))
    return y

def fit(d, lines, maxw, size):
    while size > 40:
        f = ImageFont.truetype(FONT, size)
        if all(d.textlength(' '.join(w for w, _ in ln), font=f) + size * 0.2 <= maxw for ln in lines): return size
        size -= 4
    return size

def short_cover(n, cx, cy, lines, out, zoom=1.0, tag=None, framed=False, ty=1000):
    im = img(n)
    if framed:
        bg = crop(im, cx, cy, 1215, 2160).resize((1080, 1920), Image.LANCZOS).filter(ImageFilter.GaussianBlur(40))
        c = ImageEnhance.Brightness(bg).enhance(0.6)
        fg = im.resize((1080, 608), Image.LANCZOS); c.paste(fg, (0, 300))
    else:
        h = int(2160 / zoom); w = int(h * 9 / 16)
        c = crop(im, cx, cy, w, h).resize((1080, 1920), Image.LANCZOS)
    c = ImageEnhance.Contrast(c).enhance(1.08); c = ImageEnhance.Color(c).enhance(1.12)
    band = gradient(c.size, 0, 0, 0, 0)
    band = Image.new('L', c.size, 0); bd = ImageDraw.Draw(band)
    for y in range(ty - 140, 1640):
        a_ = 190 * min(1, (y - (ty - 140)) / 140, (1640 - y) / 120); bd.line([(0, y), (1080, y)], fill=int(a_))
    c = Image.composite(Image.new('RGB', c.size, (0, 0, 0)), c, band)
    d = ImageDraw.Draw(c); size = fit(d, lines, 980, 140)
    y = text_lines(d, lines, 540, ty, size, anchor='ma')
    if tag:
        f = ImageFont.truetype(FONT, 46); tw = d.textlength(tag, font=f)
        d.rounded_rectangle([540 - tw / 2 - 26, y + 20, 540 + tw / 2 + 26, y + 100], 18, fill=(0, 0, 0))
        d.text((540 - tw / 2, y + 32), tag, font=f, fill=YEL)
    c.save(out, quality=92)

def long_thumb(out):
    im = img(1); c = crop(im, 1350, 900, 3120, 1755).resize((1280, 720), Image.LANCZOS)
    c = ImageEnhance.Contrast(c).enhance(1.1); c = ImageEnhance.Color(c).enhance(1.15)
    # darken the right-hand text area
    w, h = c.size; m = Image.new('L', (w, 1))
    for x in range(w): m.putpixel((x, 0), int(max(0, min(190, (x - 640) * 0.9))))
    c = Image.composite(Image.new('RGB', c.size, (0, 0, 0)), c, m.resize((w, h)))
    d = ImageDraw.Draw(c)
    L = [[('3 DAYS', YEL)], [('FROM', WHT)], [('DYING', RED)]]; sz = fit(d, L, 1280 - 790 - 30, 150)
    y = text_lines(d, L, 790, 110, sz, gap=-0.02)
    f = ImageFont.truetype(FONT, 40)
    d.rounded_rectangle([790, y + 14, 790 + d.textlength('CHRISTMAS EVE 2008', font=f) + 36, y + 74], 14, fill=(0, 0, 0))
    d.text((808, y + 22), 'CHRISTMAS EVE 2008', font=f, fill=WHT)
    c.save(out, quality=92)

if __name__ == '__main__':
    od = os.path.join(EP, 'thumbs'); os.makedirs(od, exist_ok=True)
    long_thumb(os.path.join(od, 'long.jpg'))
    short_cover(1, 1700, 1080, [[('TESLA WAS', WHT)], [('3 DAYS', YEL)], [('FROM DYING', RED)]], os.path.join(od, 'short_1.jpg'), zoom=1.0, tag='CHRISTMAS EVE 2008')
    short_cover(18, 1450, 1080, [[('ELON', YEL), ("DIDN'T", RED)], [('START', WHT)], [('TESLA', WHT)]], os.path.join(od, 'short_2.jpg'), tag='THE REAL FOUNDERS')
    short_cover(41, 1950, 1080, [[('HIS', WHT), ('LAST', YEL)], [('DOLLAR', YEL)]], os.path.join(od, 'short_3.jpg'), tag='ALL IN ON TESLA')
    short_cover(74, 1250, 1080, [[('PRODUCTION', WHT)], [('HELL', RED)]], os.path.join(od, 'short_4.jpg'), tag='5,000 CARS A WEEK?')
    short_cover(80, 1900, 1080, [[('WORTH', WHT)], [('6X', YEL), ('TOYOTA?', WHT)]], os.path.join(od, 'short_5.jpg'), tag='BUT SELLS 7X FEWER CARS', framed=True)
    print('ok')
