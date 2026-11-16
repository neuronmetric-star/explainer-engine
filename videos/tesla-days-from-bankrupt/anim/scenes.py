"""Per-scene animation specs (4K pixel coordinates). See engine.py for the keys."""
import math
from engine import ease, ease_in, ease_out, win, pulse, spring, keyed, back_out, clamp01

def ellipse_poly(cx, cy, ax, ay, n=24):
    return [(cx + ax * math.cos(2 * math.pi * k / n), cy + ay * math.sin(2 * math.pi * k / n)) for k in range(n)]

def ticks(t0, t1, every=1.0, g=-14):
    out = []; t = t0; k = 0
    while t < t1: out.append(('tick' if k % 2 == 0 else 'tock', t, g)); t += every; k += 1
    return out

S = {}

# 001 Dec 24th 2008, 6 p.m. Christmas Eve -------------------------------------------------
def _t1(t):
    up = win(t, 1.6, 2.4) - 0.7 * win(t, 4.2, 4.9)
    look = win(t, 1.7, 2.5) - 0.6 * win(t, 4.4, 5.1)
    sag = win(t, 4.2, 4.9)
    return 8 * look - 2 * sag, 0, -6 * up + 6 * sag
def _l1(t):
    look = win(t, 1.7, 2.5) - 0.6 * win(t, 4.4, 5.1); return (-10 * look, -8 * look)
def _hand1(t):
    k = (t - 3.0) / 0.18
    if k < 0: return 0.0
    if k < 1: return 7.5 * ease(k)
    return 6 + 1.5 * math.exp(-3 * (k - 1)) * math.cos(4 * (k - 1))
S[1] = dict(
    cam=dict(kind='in', z=(1.0, 1.10), focus=(1700, 820)),
    chars=[dict(head=(1786, 750, 224), b=1250, tilt=_t1, look=_l1, first_blink=0.7,
                stretch=lambda t: -0.03 * win(t, 4.2, 4.9),
                head_exclude=[ellipse_poly(1774, 1036, 108, 80)])],
    layers=[dict(type='clock', center=(392, 266), len=190, width=9, erase_angle=0, pin=20, tail=14, fn=_hand1),
            dict(type='glow', center=(1150, 470), radius=520, color=(40, 120, 200), squash=0.8,
                 fn=lambda t: 0.10 + 0.03 * math.sin(t * 7.0) * math.sin(t * 3.1))],
    sfx=[('impact', 0.0, -8), ('rumble', 0.0, -20, {'d': 2.5})] + ticks(0.5, 5.8) + [('tick', 3.0, -6), ('heartbeat', 4.3, -10)],
)

# 002 Tesla has almost no money left -----------------------------------------------------
def _coin2(t):
    k = max(0.0, t - 0.15)
    wob = math.exp(-1.6 * k) * math.sin(2 * math.pi * 2.6 * k)
    return dict(rot=5 * wob, sy=1 - 0.10 * abs(wob), dy=-6 * abs(wob))
S[2] = dict(
    cam=dict(kind='in', z=(1.05, 1.42), focus=(1905, 1320)),
    layers=[dict(type='part', ellipse=(1905, 1327, 146, 104), pivot=(1905, 1410), fn=_coin2, pad=200, feather=2.5),
            dict(type='glow', center=(1840, 1290), radius=260, color=(170, 230, 255), power=3,
                 fn=lambda t: 0.5 * pulse(t, 1.2, 1.8))],
    sfx=[('coin_spin', 0.05, -10, {'d': 2.0}), ('sparkle', 1.2, -18, {'d': 0.8, 'k': 4})],
)

# 003 In 2 days, its workers' paychecks would bounce --------------------------------------
def _env(ph, amp=170, f=1.25):
    def fn(t):
        u = (t * f + ph) % 1.0
        h = abs(math.sin(math.pi * u))              # 0 at the "floor", 1 at the top of the bounce
        sq = 1 + 0.12 * max(0, 0.25 - h) * 4         # squash near the floor
        return dict(dy=amp * (0.5 - h), sx=sq, sy=1 / sq, rot=5 * math.sin(2 * math.pi * u))
    return fn
S[3] = dict(
    cam=dict(kind='keys', keys=[(0, 1.06, 1950, 980), (3.6, 1.12, 2100, 900)]),
    chars=[dict(head=(700, 600, 240), b=1840, hair=False, first_blink=1.5, breathe=0.008)],
    layers=[dict(type='part', rect=(1245, 72, 1866, 530), fg=(1180, 40, 1930, 560), pivot=(1555, 300), fn=_env(0.0), grow=9, pad=260, smooth=True),
            dict(type='part', rect=(2168, 357, 2731, 744), fg=(2110, 320, 2790, 780), pivot=(2450, 550), fn=_env(0.33), grow=9, pad=260, smooth=True),
            dict(type='part', rect=(3054, 232, 3641, 633), fg=(2990, 190, 3700, 680), pivot=(3350, 430), fn=_env(0.66), grow=9, pad=260, smooth=True)],
    sfx=[('boing', 0.10, -12), ('boing', 0.37, -14), ('boing', 0.63, -14), ('boing', 0.90, -15), ('boing', 1.17, -15),
         ('boing', 1.43, -16), ('boing', 1.70, -16), ('boing', 1.97, -17), ('boing', 2.23, -17), ('boing', 2.50, -18)],
)

# 004 Its boss has put in nearly everything he owns ---------------------------------------
S[4] = dict(
    cam=dict(kind='in', z=(1.04, 1.16), focus=(2900, 900)),
    chars=[dict(head=(2980, 400, 228), b=2080, blink=False, breathe=0.007,
                tilt=lambda t: (3.0 * math.sin(2 * math.pi * 0.55 * (t - 0.6)) * win(t, 0.6, 1.2) * (1 - win(t, 2.6, 3.2)), 0, 0))],
    sfx=[('uh_oh', 0.9, -14), ('paper', 0.2, -22, {'d': 0.5})],
)

# 005 He says he even borrowed from friends to pay rent -----------------------------------
S[5] = dict(
    cam=dict(kind='keys', keys=[(0, 1.10, 1500, 1000), (3.4, 1.18, 2350, 900)]),
    chars=[dict(head=(1180, 520, 220), b=2080, hair=False, first_blink=0.9),
           dict(head=(2420, 500, 220), b=2080, blink=False,
                tilt=lambda t: (-3.5 * win(t, 1.2, 2.0), 0, 6 * win(t, 1.2, 2.0)))],
    sfx=[('paper', 0.6, -14, {'d': 0.7}), ('paper', 1.6, -18, {'d': 0.5})],
)

# 006 Then, in the last hour, the deal closes ---------------------------------------------
def _pen6(t):
    w = win(t, 0.1, 0.4) * (1 - win(t, 2.4, 2.7))
    lift = win(t, 2.5, 2.9)
    return dict(dx=w * 16 * math.sin(2 * math.pi * 2.3 * t), dy=w * 7 * math.sin(2 * math.pi * 4.6 * t) - 30 * lift, rot=-5 * lift + w * 1.2 * math.sin(2 * math.pi * 2.3 * t))
S[6] = dict(
    cam=dict(kind='in', z=(1.02, 1.12), focus=(2000, 1100)),
    chars=[dict(head=(2060, 640, 328), b=1500, blink=False, breathe=0.004,
                tilt=lambda t: (1.5 * math.sin(2 * math.pi * 1.15 * t) * (1 - win(t, 2.3, 2.6)) - 2.5 * win(t, 2.8, 3.4), 0, -8 * win(t, 2.8, 3.4)))],
    layers=[dict(type='part', poly=[(1560, 1040), (1720, 1040), (1920, 1580), (1880, 1640), (1720, 1590), (1560, 1590), (1500, 1450), (1510, 1300)],
                 pivot=(1600, 1460), fn=_pen6, pad=120, feather=4),
            dict(type='glow', center=(2960, 980), radius=620, color=(60, 160, 255), squash=0.8,
                 fn=lambda t: 0.10 + 0.32 * win(t, 2.9, 3.5))],
    sfx=[('scribble', 0.15, -10, {'d': 2.3}), ('chime_up', 2.95, -10), ('impact', 2.95, -14)],
)

# ======================================================================= batch A: 7-21
GOLD = (70, 200, 255)

# 007 12 years later, Tesla is the most valuable car company on Earth
S[7] = dict(
    cam=dict(kind='in', z=(1.0, 1.16), focus=(1840, 820)),
    chars=[dict(head=(260, 700, 88), b=1300, hair=False), dict(head=(2380, 440, 88), b=1060, hair=False),
           dict(head=(3600, 700, 88), b=1300, hair=False)],
    layers=[dict(type='glow', center=(1840, 700), radius=1000, color=GOLD, squash=1.25, fn=lambda t: 0.38 * win(t, 0.4, 1.4)),
            dict(type='particles', kind='sparkle', n=14, area=(1100, 500, 2600, 1150), size=46, rate=0.9, t0=0.8)],
    sfx=[('whoosh', 0.0, -8, {'d': 0.7}), ('chime_up', 0.5, -8), ('sparkle', 1.0, -14, {'d': 1.4, 'k': 8}), ('applause', 2.4, -20, {'d': 2.6})],
)

# 008 Worth more than Toyota ... (scale tips toward the white car)
def _beam8(t): return -3.4 * (1 - spring(t, 0.35, 1.6, 3.2))
S[8] = dict(
    cam=dict(kind='out', z=(1.14, 1.0), focus=(1920, 900)),
    layers=[dict(type='part', poly=[(860, 500), (1500, 330), (1780, 170), (2080, 170), (2500, 220), (2950, 40), (3030, 170), (2500, 340), (2080, 400), (1780, 400), (1500, 450), (900, 630)],
                 pivot=(1920, 300), fn=lambda t: dict(rot=_beam8(t)), pad=200, feather=3),
            dict(type='part', poly=[(880, 590), (960, 590), (1570, 1380), (1570, 1650), (230, 1650), (230, 1380)],
                 pivot=(920, 540), fn=lambda t: dict(dy=1000 * math.sin(math.radians(_beam8(t)))), pad=200, feather=3),
            dict(type='part', poly=[(2920, 170), (3000, 170), (3670, 1060), (3670, 1270), (2270, 1270), (2270, 1060)],
                 pivot=(2960, 120), fn=lambda t: dict(dy=-1040 * math.sin(math.radians(_beam8(t)))), pad=200, feather=3)],
    sfx=[('servo', 0.2, -20, {'d': 0.6, 'f0': 300, 'f1': 420}), ('clank', 0.55, -10), ('thud', 0.55, -8), ('clank', 1.1, -18)],
)

# 009 So how does a company 3 days from dying end up on top?
S[9] = dict(
    cam=dict(kind='keys', keys=[(0, 1.3, 1900, 1420), (4.3, 1.3, 1900, 700)]),
    chars=[dict(head=(1880, 940, 120), b=1900, blink=False, breathe=0.008)],
    layers=[dict(type='glow', center=(1900, 120), radius=1100, color=(120, 215, 255), squash=0.7, fn=lambda t: 0.25 + 0.15 * math.sin(t * 2.2)),
            dict(type='particles', kind='dust', n=70, area=(900, 100, 2900, 1900), color=(150, 220, 255), rise=90, drift=30, strength=0.9)],
    sfx=[('riser', 0.3, -12, {'d': 3.6}), ('wind', 0.0, -24, {'d': 4.3})],
)

# 010 And why didn't the man who saved it even start it?
S[10] = dict(
    cam=dict(kind='in', z=(1.02, 1.14), focus=(1900, 700)),
    chars=[dict(head=(1448, 260, 232), b=1920, hair=False, first_blink=1.2,
                tilt=lambda t: (-4 * win(t, 0.8, 1.5), 0, 0)),
           dict(head=(2320, 280, 220), b=1920, first_blink=2.0,
                tilt=lambda t: (4 * win(t, 1.0, 1.7), 0, 0))],
    sfx=[('whip', 0.0, -12), ('pop', 0.9, -16), ('pop', 1.1, -18)],
)

# 011 It starts in a tiny office in California. (2003 stamp)
S[11] = dict(
    cam=dict(kind='right', z=1.14),
    layers=[dict(type='particles', kind='dust', n=110, area=(1900, 0, 3700, 1700), color=(170, 225, 255), rise=14, drift=20, strength=0.7)],
    text=[dict(s='2003', pos=(64, 150), size=78, t0=0.2)],
    sfx=[('whoosh', 0.0, -10, {'d': 0.8}), ('ding', 0.3, -18)],
)

# 012 July 2003. 2 engineers ... start a car company (sketch draws itself)
S[12] = dict(
    cam=dict(kind='keys', keys=[(0, 1.18, 1100, 800), (3.4, 1.18, 1300, 760), (7.2, 1.08, 2100, 900)]),
    chars=[dict(head=(1400, 400, 200), b=1880, hair=False), dict(head=(2680, 420, 208), b=1880, breathe=0.008,
           tilt=lambda t: (3 * math.sin(2 * math.pi * 0.9 * t) * win(t, 2.0, 2.6), 0, 0))],
    layers=[dict(type='reveal', rect=(300, 360, 980, 720), thr=120, t0=0.3, t1=3.0, soft=60),
            dict(type='part', poly=[(860, 330), (1200, 320), (1290, 520), (1120, 620), (880, 570)], pivot=(1150, 560),
                 fn=lambda t: dict(dx=10 * math.sin(2 * math.pi * 2.0 * t) * (1 - win(t, 2.8, 3.1)), dy=6 * math.sin(2 * math.pi * 3.3 * t) * (1 - win(t, 2.8, 3.1))), pad=80, feather=4)],
    text=[dict(s='JULY 2003', pos=(64, 150), size=70, t0=0.1, t1=3.4)],
    sfx=[('scribble', 0.3, -10, {'d': 2.6}), ('pop', 3.1, -14)],
)

# 013 They name it after the inventor Nikola Tesla
S[13] = dict(
    cam=dict(kind='in', z=(1.0, 1.15), focus=(1900, 700)),
    layers=[dict(type='glow', center=(1900, 560), radius=1300, color=(255, 120, 200), squash=0.7,
                 fn=lambda t: 0.18 + 0.12 * abs(math.sin(t * 13.0) * math.sin(t * 5.3))),
            dict(type='arcs', origin=(1900, 540), spread=1000, n=4, ring=260, a0=-178, a1=-2, every=2),
            dict(type='flash', at=[0.05, 1.3, 2.4], strength=0.25, decay=0.08, color=(255, 200, 235))],
    sfx=[('electric_hum', 0.0, -14, {'d': 3.4}), ('zap', 0.05, -6), ('zap', 1.3, -8), ('zap', 2.4, -8)],
)

# 014 Their idea: an electric car that's fast and fun, not slow and boxy
S[14] = dict(
    cam=dict(kind='keys', keys=[(0, 1.12, 1800, 700), (2.6, 1.22, 2350, 560), (6.0, 1.22, 1450, 700)]),
    chars=[dict(head=(1728, 280, 240), b=1940, hair=False, first_blink=1.0)],
    layers=[dict(type='part', poly=[(2090, 200), (2440, 170), (2580, 170), (2840, 210), (2830, 740), (2100, 720)], pivot=(2460, 700),
                 fn=lambda t: dict(dy=-28 * back_out(clamp01((t - 0.4) / 0.6)), rot=1.2 * math.sin(2 * math.pi * 0.8 * t)), pad=120, feather=3),
            dict(type='particles', kind='sparkle', n=8, area=(2150, 260, 2800, 680), size=40, rate=1.1, t0=0.6, t1=3.0, fade_out=0.4),
            dict(type='part', poly=[(1080, 380), (1240, 300), (1460, 380), (1500, 600), (1460, 830), (1100, 830), (1060, 600)], pivot=(1280, 600),
                 fn=lambda t: dict(s=1 - 0.07 * pulse(t, 3.6, 4.0) - 0.07 * pulse(t, 4.1, 4.5), rot=3 * pulse(t, 3.6, 4.5)), pad=120, feather=3, fill=False)],
    sfx=[('pop', 0.45, -14), ('sparkle', 0.6, -16, {'d': 1.6, 'k': 6}), ('engine', 1.0, -18, {'d': 1.3}), ('crumple', 3.55, -8, {'d': 1.0})],
)

# 015 But building cars costs a fortune. They need an investor. (box shaken, nothing falls)
def _box15(t):
    k = win(t, 0.4, 0.6) * (1 - win(t, 2.6, 2.9))
    return dict(rot=2.2 * k * math.sin(2 * math.pi * 6 * t), dy=10 * k * math.sin(2 * math.pi * 12 * t))
S[15] = dict(
    cam=dict(kind='in', z=(1.04, 1.18), focus=(1700, 1000)),
    chars=[dict(head=(1300, 340, 312), b=1700, first_blink=3.2, look=lambda t: (8 * win(t, 0.5, 0.9), 14 * win(t, 0.5, 0.9)))],
    layers=[dict(type='part', poly=[(1220, 900), (1640, 640), (2120, 700), (2220, 1000), (2180, 1660), (1700, 1720), (1240, 1420)], pivot=(1700, 1100), fn=_box15, pad=120, feather=6),
            dict(type='particles', kind='smoke', origin=(1780, 1640), n=6, at=1.8, span=0.3, life=1.6, size=40, speed=60, dir=90, spread=40, rise=-30, density=0.35, color=(200, 205, 210))],
    sfx=[('clank', 0.5, -16), ('clank', 0.75, -18), ('clank', 1.0, -16), ('clank', 1.3, -18), ('clank', 1.6, -16), ('uh_oh', 2.6, -14)],
)

# 016 Early 2004, they pitch a young internet millionaire
S[16] = dict(
    cam=dict(kind='keys', keys=[(0, 1.05, 1700, 900), (4.3, 1.2, 2700, 820)]),
    chars=[dict(head=(1280, 640, 208), b=1800, hair=False, tilt=lambda t: (-3 * math.sin(2 * math.pi * 1.4 * t) * win(t, 0.3, 0.6), 0, 0)),
           dict(head=(1780, 600, 180), b=1800, tilt=lambda t: (2.5 * math.sin(2 * math.pi * 1.6 * t + 1), 0, 0)),
           dict(head=(3100, 620, 200), b=1800, first_blink=2.6)],
    text=[dict(s='2004', pos=(64, 150), size=70, t0=0.1, t1=4.2)],
    sfx=[('whip', 0.0, -12), ('paper', 0.8, -22, {'d': 0.6})],
)

# 017 "We want to make electric cars cool."
S[17] = dict(
    cam=dict(kind='keys', keys=[(0, 1.15, 1500, 800), (4.7, 1.15, 2300, 800)]),
    chars=[dict(head=(1480, 400, 192), b=1720, hair=False, tilt=lambda t: (3 * math.sin(2 * math.pi * 1.2 * t), 0, 0), breathe=0.009),
           dict(head=(3320, 440, 400), b=2160, blink=False, tilt=lambda t: (-3.5 * win(t, 2.4, 3.2), 0, 0))],
    sfx=[('pop', 0.3, -18), ('sparkle', 0.5, -20, {'d': 1.0, 'k': 4})],
)

# 018 "Fast and cool? Then I'm in."
def _arm18(t):
    j = pulse(t, 1.9, 2.25) + 0.8 * pulse(t, 2.3, 2.6)
    return dict(dx=-45 * j, dy=-6 * j)
S[18] = dict(
    cam=dict(kind='in', z=(1.03, 1.16), focus=(1500, 700)),
    shake=[(1.95, 2.3, 7)],
    chars=[dict(head=(1760, 480, 272), b=2160, blink=False,
                tilt=lambda t: (-3 * pulse(t, 0.2, 1.0) + 4 * pulse(t, 1.8, 2.6), 0, -10 * pulse(t, 1.8, 2.6)))],
    layers=[dict(type='part', poly=[(930, 630), (1310, 650), (1660, 730), (1720, 930), (1320, 900), (1000, 900)], pivot=(1800, 820), fn=_arm18, pad=120, feather=6)],
    sfx=[('whoosh', 1.85, -14, {'d': 0.35}), ('ding', 2.0, -10), ('impact', 2.0, -16)],
)

# 019 He puts in $6.5 million of the first $7.5 million raised
S[19] = dict(
    cam=dict(kind='in', z=(1.05, 1.2), focus=(1900, 1000)),
    chars=[dict(head=(1140, 640, 220), b=1880, hair=False, tilt=lambda t: (4 * win(t, 0.6, 1.0), 0, -8 * win(t, 0.6, 1.0))),
           dict(head=(2720, 580, 200), b=1880, first_blink=2.2)],
    layers=[dict(type='part', rect=(1730, 990, 2210, 1350), pivot=(1960, 1340), fn=lambda t: dict(s=1 + 0.07 * pulse(t, 0.5, 0.9) + 0.05 * pulse(t, 2.6, 3.0)), pad=80, fill=False, feather=3),
            dict(type='particles', kind='sparkle', n=10, area=(1700, 950, 2250, 1350), size=36, rate=1.2, t0=0.5)],
    sfx=[('cash', 0.5, -8), ('paper', 0.2, -18, {'d': 0.5}), ('cash', 2.6, -14)],
)

# 020 He becomes chairman, the head of the board
S[20] = dict(
    cam=dict(kind='in', z=(1.0, 1.18), focus=(1900, 900)),
    chars=[dict(head=(1848, 700, 168), b=1400, tilt=lambda t: (2 * math.sin(2 * math.pi * 1.0 * t), 0, 0)), dict(head=(2960, 820, 188), b=1400, hair=False)],
    layers=[dict(type='glow', center=(1850, 1150), radius=700, color=GOLD, squash=0.6, fn=lambda t: 0.22 * win(t, 0.3, 1.0))],
    sfx=[('chime_up', 0.3, -12)],
)

# 021 But he's not the CEO. Not yet. (spotlight clicks on over the empty chair)
S[21] = dict(
    cam=dict(kind='in', z=(1.0, 1.22), focus=(1920, 960)),
    layers=[dict(type='grade', fn=lambda t: None if t > 0.75 else ((0.3, 0.3, 0.3, 0) if t < 0.3 else ((0.3 + 0.7 * ((int(t * 30) % 3) != 0) * win(t, 0.3, 0.75),) * 3 + (0,))))],
    sfx=[('thud', 0.3, -10, {'f': 90}), ('tick', 0.3, -8), ('riser', 1.2, -18, {'d': 2.0})],
)

# ======================================================================= batch B: 22-40
def drop_in(t0, h=520, land=0.45):
    """object falls from above, lands at t0+land with a squash, invisible before t0"""
    def fn(t):
        if t < t0: return dict(alpha=0.0)
        u = (t - t0) / land
        if u < 1: return dict(dy=-h * (1 - u * u), alpha=min(1, u * 4))
        k = t - t0 - land; sq = 0.07 * math.exp(-9 * k) * math.cos(2 * math.pi * 3 * k)
        return dict(sy=1 - sq, sx=1 + sq * 0.6)
    return fn

# 022 Tesla's first car, the Roadster, starts at $109,000
S[22] = dict(
    cam=dict(kind='keys', keys=[(0, 1.18, 1500, 900), (5.4, 1.06, 1950, 950)]),
    layers=[dict(type='glow', center=(2180, 1050), radius=260, color=(255, 230, 200), fn=lambda t: 0.9 * pulse(t, 0.3, 0.7) + 0.9 * pulse(t, 0.8, 1.2)),
            dict(type='glow', center=(3060, 1010), radius=200, color=(255, 230, 200), fn=lambda t: 0.9 * pulse(t, 0.3, 0.7) + 0.9 * pulse(t, 0.8, 1.2)),
            dict(type='particles', kind='sparkle', n=7, area=(800, 450, 3100, 1300), size=60, rate=0.7, t0=1.4)],
    text=[dict(s='$109,000', pos=(64, 150), size=78, t0=2.4)],
    sfx=[('engine', 0.2, -10, {'d': 1.6}), ('cash', 2.4, -12)],
)

# 023 That's on purpose. Elon writes a "secret master plan."
S[23] = dict(
    cam=dict(kind='in', z=(1.04, 1.22), focus=(2000, 1000)),
    chars=[dict(head=(2032, 780, 248), b=1320, tilt=lambda t: (2.5 * math.sin(2 * math.pi * 0.7 * t), 0, 0))],
    layers=[dict(type='part', poly=[(1640, 1140), (1990, 1140), (2010, 1345), (1640, 1345)], pivot=(1820, 1300),
                 fn=lambda t: dict(dx=9 * math.sin(2 * math.pi * 2.6 * t) * win(t, 1.2, 1.4), dy=4 * math.sin(2 * math.pi * 5.2 * t) * win(t, 1.2, 1.4)), pad=60, feather=4)],
    sfx=[('scribble', 1.2, -10, {'d': 2.8})],
)

# 024 Step 1: build a pricey sports car
S[24] = dict(
    cam=dict(kind='in', z=(1.0, 1.12), focus=(900, 1100)),
    layers=[dict(type='part', rect=(200, 760, 1360, 1362), fg=(150, 700, 1420, 1362), pivot=(780, 1360), fn=drop_in(0.25), grow=7, pad=700),
            dict(type='glow', center=(780, 1000), radius=750, color=GOLD, squash=0.8, fn=lambda t: 0.3 * win(t, 0.8, 1.4))],
    text=[dict(s='STEP 1', pos=(64, 150), size=78, t0=0.1)],
    sfx=[('whoosh', 0.1, -14, {'d': 0.5}), ('thud', 0.7, -8), ('ding', 0.9, -14)],
)

# 025 Step 2: a cheaper car, then an even cheaper one
S[25] = dict(
    cam=dict(kind='keys', keys=[(0, 1.12, 1500, 950), (3.2, 1.12, 2200, 850), (5.7, 1.04, 2100, 950)]),
    layers=[dict(type='part', rect=(1330, 470, 2500, 1032), fg=(1280, 420, 2560, 1032), pivot=(1900, 1030), fn=drop_in(0.2), grow=7, pad=700, rows=True),
            dict(type='part', rect=(2580, 300, 3630, 805), fg=(2520, 250, 3700, 805), pivot=(3100, 790), fn=drop_in(3.2), grow=7, pad=700, rows=True)],
    text=[dict(s='STEP 2', pos=(64, 150), size=78, t0=0.1)],
    sfx=[('whoosh', 0.1, -14, {'d': 0.5}), ('thud', 0.65, -8), ('whoosh', 3.05, -14, {'d': 0.5}), ('thud', 3.65, -8), ('ding', 3.8, -14)],
)

# 026 Like selling fancy lemonade first, to pay for a bigger stand
S[26] = dict(
    cam=dict(kind='in', z=(1.02, 1.18), focus=(1900, 650)),
    chars=[dict(head=(1848, 560, 188), b=1320, tilt=lambda t: (3 * math.sin(2 * math.pi * 0.8 * t), 0, 0))],
    layers=[dict(type='part', poly=[(2140, 560), (2430, 560), (2450, 1090), (2140, 1090)], pivot=(2240, 1060),
                 fn=lambda t: dict(dy=-22 * pulse(t, 0.4, 1.4), rot=-3 * pulse(t, 0.4, 1.4)), pad=60, feather=4),
            dict(type='particles', kind='sparkle', n=6, area=(2180, 600, 2420, 1000), size=34, rate=1.2, t0=0.6)],
    sfx=[('pour', 0.0, -18, {'d': 1.2}), ('coin', 0.9, -16), ('ding', 1.1, -16)],
)

# 027 But building it is much harder than planned
S[27] = dict(
    cam=dict(kind='in', z=(1.0, 1.12), focus=(1500, 900)),
    chars=[dict(head=(740, 500, 152), b=1640, tilt=lambda t: (-3 * win(t, 0.5, 1.0), 0, 0))],
    layers=[dict(type='part', poly=[(470, 270), (730, 270), (750, 530), (480, 570)], pivot=(620, 520),
                 fn=lambda t: dict(dx=8 * math.sin(2 * math.pi * 5 * t), dy=4 * math.sin(2 * math.pi * 10 * t)), pad=40, feather=4)],
    sfx=[('clank', 0.1, -12), ('clank', 1.2, -16), ('uh_oh', 1.6, -14)],
)

# 028 In 2007, the board pushes founder Martin Eberhard out as CEO
S[28] = dict(
    cam=dict(kind='keys', keys=[(0, 1.18, 2300, 1000), (5.5, 1.18, 3000, 1000)]),
    chars=[dict(head=(2920, 600, 220), b=2000, hair=False, breathe=0.0, stretch=lambda t: 0.012 * abs(math.sin(2 * math.pi * 1.0 * t)),
                tilt=lambda t: (-2 + 1.5 * math.sin(2 * math.pi * 1.0 * t), 0, 6))],
    text=[dict(s='2007', pos=(64, 150), size=78, t0=0.1)],
    sfx=[('footsteps', 0.2, -12, {'d': 5.0, 'rate': 2.0}), ('uh_oh', 1.4, -18)],
)

# 029 In 2008, Roadsters are finally built, in an old car dealer's repair bays
S[29] = dict(
    cam=dict(kind='in', z=(1.02, 1.16), focus=(2400, 900)),
    chars=[dict(head=(3020, 540, 148), b=1580, tilt=lambda t: (2 * math.sin(2 * math.pi * 1.5 * t), 0, 0))],
    layers=[dict(type='part', poly=[(2400, 790), (2810, 790), (2830, 1090), (2400, 1090)], pivot=(2390, 900),
                 fn=lambda t: dict(rot=5 * math.sin(2 * math.pi * 1.5 * t)), pad=80, feather=5),
            dict(type='particles', kind='sparkle', n=6, area=(1300, 600, 2700, 1200), size=50, rate=0.8, t0=3.5)],
    text=[dict(s='2008', pos=(64, 150), size=78, t0=0.1)],
    sfx=ticks(0.3, 3.2, 0.33, -14) + [('clank', 3.3, -12), ('ding', 3.6, -14)],
)

# 030 By January 2009, Tesla has delivered just 147 cars (toy cars pop in)
S[30] = dict(
    cam=dict(kind='out', z=(1.12, 1.0), focus=(1920, 800)),
    layers=[dict(type='popin', rect=(150, 20, 3800, 1560), t0=0.3, dt=0.085, row_h=380, min_area=20000, sat=110, dark=80, hull_grow=40, backdrop=260)],
    sfx=[('pop', 0.3 + 0.085 * i, -18 - (i % 3)) for i in range(36)],
)

# 031 And just then, the whole economy crashes (cards fly)
S[31] = dict(
    cam=dict(kind='in', z=(1.0, 1.1), focus=(2200, 1000)),
    shake=[(0.2, 1.4, 14)],
    layers=[dict(type='particles', kind='burst', n=26, origin=(2250, 700), at=0.15, stagger=1.2, dir=25, spread=70, speed=(300, 1200),
                 gravity=900, life=2.2, size=55, colors=[(70, 70, 205), (190, 120, 60), (80, 80, 215)])],
    sfx=[('cards', 0.1, -8, {'d': 1.6}), ('impact', 0.15, -10), ('uh_oh', 1.8, -16)],
)

# 032 Fall 2008. Big banks fail. Even America's biggest carmakers are going broke.
S[32] = dict(
    cam=dict(kind='in', z=(1.0, 1.2), focus=(1900, 900)),
    shake=[(1.3, 2.2, 9)],
    layers=[dict(type='particles', kind='papers', n=34, area=(0, -200, 3840, 2160), speed=160, sway=140, drift=-50, size=48),
            dict(type='grade', fn=lambda t: (1 - 0.18 * win(t, 1.0, 4.0), 1 - 0.15 * win(t, 1.0, 4.0), 1 - 0.1 * win(t, 1.0, 4.0), 0))],
    text=[dict(s='FALL 2008', pos=(64, 150), size=78, t0=0.1)],
    sfx=[('wind', 0.0, -16, {'d': 7.2}), ('rumble', 1.2, -8, {'d': 2.5}), ('paper', 0.5, -20, {'d': 1.0}), ('paper', 3.5, -20, {'d': 1.0})],
)

# 033 Who lends money to a tiny electric-car startup now? Nobody. (door slam)
S[33] = dict(
    cam=dict(kind='keys', keys=[(0, 1.08, 1900, 1000), (2.7, 1.16, 2500, 800), (3.7, 1.2, 2600, 780)]),
    shake=[(2.75, 3.3, 16)],
    chars=[dict(head=(2848, 440, 200), b=1680, hair=False, blink=False, tilt=lambda t: (-4 * win(t, 2.6, 2.85), 0, 0))],
    layers=[dict(type='particles', kind='papers', n=10, area=(0, 600, 2400, 2160), speed=90, sway=160, drift=-40, size=44)],
    sfx=[('wind', 0.0, -18, {'d': 3.7}), ('slam', 2.75, -4)],
)

# 034 Tesla's big fundraising round falls apart (contract torn)
S[34] = dict(
    cam=dict(kind='in', z=(1.02, 1.15), focus=(1900, 800)),
    shake=[(0.3, 0.9, 10)],
    chars=[dict(head=(1912, 400, 200), b=2000, tilt=lambda t: (3 * math.sin(2 * math.pi * 2 * t) * win(t, 0.2, 0.4) * (1 - win(t, 1.2, 1.6)), 0, 0))],
    layers=[dict(type='particles', kind='burst', n=18, origin=(1900, 900), at=0.3, stagger=0.4, dir=-90, spread=150, speed=(400, 1100),
                 gravity=700, life=2.6, size=50, colors=[(238, 240, 242), (225, 228, 232)]),
            dict(type='particles', kind='papers', n=10, area=(800, -200, 3000, 1800), speed=120, sway=120, size=46, t0=0.8)],
    sfx=[('tear', 0.3, -6), ('paper', 0.5, -12, {'d': 1.2}), ('uh_oh', 1.8, -16)],
)

# 035 October 2008: Elon makes himself CEO (punch-in)
S[35] = dict(
    cam=dict(kind='keys', keys=[(0, 1.0, 1920, 900), (1.6, 1.02, 1920, 880), (1.85, 1.2, 1912, 700), (5.1, 1.26, 1912, 680)]),
    shake=[(1.85, 2.3, 8)],
    chars=[dict(head=(1912, 520, 248), b=1580, tilt=lambda t: (0, 0, 10 * pulse(t, 1.7, 2.2)))],
    layers=[dict(type='glow', center=(1912, 900), radius=900, color=GOLD, squash=0.9, fn=lambda t: 0.22 * win(t, 1.85, 2.4))],
    text=[dict(s='OCT 2008', pos=(64, 150), size=78, t0=0.1)],
    sfx=[('whoosh', 1.6, -12, {'d': 0.3}), ('impact', 1.85, -6), ('chime_up', 2.0, -14)],
)

# 036 And his other company is in trouble too (steam at the pad)
S[36] = dict(
    cam=dict(kind='in', z=(1.0, 1.12), focus=(1920, 1000)),
    layers=[dict(type='particles', kind='smoke', origin=(1800, 1520), n=26, span=2.5, life=2.2, size=90, speed=260, dir=180, spread=25, rise=60, density=0.55, color=(240, 240, 242)),
            dict(type='particles', kind='smoke', origin=(2060, 1520), n=26, span=2.5, life=2.2, size=90, speed=260, dir=0, spread=25, rise=60, density=0.55, color=(240, 240, 242))],
    sfx=[('wind', 0.0, -18, {'d': 2.5}), ('rumble', 0.0, -18, {'d': 2.5})],
)

# 037 SpaceX rockets have failed 3 times in a row (lift, sputter, drop)
def _rocket37(t):
    up = 150 * win(t, 0.3, 1.5) * (1 - ease_in(clamp01((t - 1.75) / 0.5)))
    wob = 1.6 * math.sin(2 * math.pi * 3.2 * t) * pulse(t, 0.3, 2.2)
    return dict(dy=-up, rot=wob)
S[37] = dict(
    cam=dict(kind='in', z=(1.05, 1.18), focus=(1920, 900)),
    shake=[(0.2, 1.6, 4), (2.25, 2.8, 14)],
    layers=[dict(type='part', poly=[(1915, 30), (1965, 110), (1985, 1150), (2050, 1290), (2050, 1345), (1780, 1345), (1780, 1290), (1850, 1150), (1865, 110)],
                 pivot=(1920, 1330), fn=_rocket37, pad=300, feather=3),
            dict(type='glow', center=(1920, 1420), radius=320, color=(40, 140, 255),
                 fn=lambda t: (0.7 + 0.3 * math.sin(t * 40)) * (1 - win(t, 1.5, 1.8)) * (1 if int(t * 12) % 4 else 0.3) * win(t, 0.0, 0.2)),
            dict(type='particles', kind='smoke', origin=(1920, 1420), n=40, span=2.0, life=2.0, size=110, speed=380, dir=90, spread=80, rise=80, density=0.6, color=(205, 205, 210)),
            dict(type='particles', kind='smoke', origin=(1920, 1400), n=16, at=2.3, span=0.2, life=1.6, size=150, speed=700, dir=-90, spread=170, rise=40, density=0.7, color=(170, 170, 175))],
    sfx=[('rocket', 0.0, -8, {'d': 1.8}), ('sputter', 1.2, -8, {'d': 1.0}), ('impact', 2.3, -4), ('uh_oh', 2.7, -14)],
)

# 038 In his words, there's money for 1 last launch
S[38] = dict(
    cam=dict(kind='keys', keys=[(0, 1.3, 1100, 1350), (4.2, 1.18, 1900, 800)]),
    chars=[dict(head=(980, 1160, 120), b=2020, blink=False, breathe=0.01)],
    sfx=[('wind', 0.0, -16, {'d': 4.2}), ('heartbeat', 1.0, -10), ('heartbeat', 2.4, -12)],
)

# 039 September 28, 2008: the 4th rocket reaches orbit
S[39] = dict(
    cam=dict(kind='keys', keys=[(0, 1.14, 1900, 900), (5.2, 1.14, 2150, 760)], ease='lin'),
    layers=[dict(type='part', poly=[(1240, 1150), (1720, 790), (2810, 320), (2880, 370), (1890, 1070), (1330, 1300)], pivot=(2000, 800),
                 fn=lambda t: dict(dx=230 * t / 5.2, dy=-124 * t / 5.2), pad=300, feather=4),
            dict(type='particles', kind='sparkle', n=26, area=(0, 0, 3000, 1300), size=12, rate=0.6, color=(255, 255, 255)),
            dict(type='glow', center=(3680, 120), radius=700, color=(80, 180, 255), fn=lambda t: 0.25 + 0.1 * math.sin(t * 3))],
    text=[dict(s='SEP 28, 2008', pos=(64, 150), size=72, t0=0.1)],
    sfx=[('rumble', 0.0, -14, {'d': 5.2, 'lp': 90}), ('chime_up', 2.6, -8), ('sparkle', 2.8, -14, {'d': 1.5, 'k': 8})],
)

# 040 But Tesla is still bleeding cash (bills slide out)
S[40] = dict(
    cam=dict(kind='in', z=(1.0, 1.12), focus=(2500, 1200)),
    layers=[dict(type='particles', kind='burst', n=16, origin=(2700, 1420), at=0.1, stagger=2.4, dir=25, spread=25, speed=(160, 420),
                 gravity=0, life=2.6, size=46, colors=[(110, 180, 100), (95, 165, 85)])],
    sfx=[('paper', 0.1, -14, {'d': 2.4}), ('uh_oh', 1.0, -16)],
)

# ======================================================================= batch C: 41-60
def bob(amp=10, f=0.6, ph=0.0, rot=0.0):
    return lambda t: dict(dy=amp * math.sin(2 * math.pi * f * t + ph), rot=rot * math.sin(2 * math.pi * f * t + ph + 1))

# 041 So Elon puts in the last of his PayPal money (bundles drop into the box)
S[41] = dict(
    cam=dict(kind='in', z=(1.05, 1.22), focus=(1700, 900)),
    chars=[dict(head=(1800, 460, 228), b=1700, tilt=lambda t: (2 * math.sin(2 * math.pi * 0.8 * t), 0, 8 * pulse(t, 0.4, 1.4)))],
    layers=[dict(type='part', poly=[(1050, 1050), (1360, 1030), (1450, 1220), (1430, 1340), (1120, 1310)], pivot=(1260, 1200),
                 fn=lambda t: dict(dy=60 * ease(clamp01(t / 0.9)) - 10 * pulse(t, 0.9, 1.2), rot=-4 * ease(clamp01(t / 0.9))), pad=100, feather=4),
            dict(type='part', poly=[(1440, 870), (1700, 860), (1760, 1060), (1660, 1180), (1450, 1150)], pivot=(1580, 1050),
                 fn=lambda t: dict(dy=70 * ease(clamp01((t - 0.6) / 0.9)) - 10 * pulse(t, 1.5, 1.8), rot=5 * ease(clamp01((t - 0.6) / 0.9))), pad=100, feather=4)],
    sfx=[('paper', 0.3, -14, {'d': 0.6}), ('thud', 0.9, -14, {'f': 110}), ('paper', 1.0, -16, {'d': 0.5}), ('thud', 1.5, -14, {'f': 110}), ('coin', 1.6, -20)],
)

# 042 He says he didn't even own a house anymore (lonely, bulb flickers)
S[42] = dict(
    cam=dict(kind='out', z=(1.25, 1.0), focus=(1880, 1000)),
    chars=[dict(head=(1872, 790, 88), b=1480, breathe=0.01, period=4.0)],
    layers=[dict(type='glow', center=(2060, 230), radius=500, color=(120, 200, 255),
                 fn=lambda t: 0.25 + 0.1 * math.sin(t * 2) - 0.2 * (1 if 1.3 < t < 1.38 or 1.46 < t < 1.5 else 0))],
    sfx=[('wind', 0.0, -22, {'d': 2.8}), ('electric_hum', 0.0, -26, {'d': 2.8}), ('zap', 1.3, -22)],
)

# 043 Now he needs his investors to chip in too
S[43] = dict(
    cam=dict(kind='keys', keys=[(0, 1.1, 1800, 900), (3.0, 1.18, 2300, 900)]),
    chars=[dict(head=(1600, 480, 220), b=1640, tilt=lambda t: (-3 * pulse(t, 0.3, 1.2) - 3 * pulse(t, 1.5, 2.4), 6 * pulse(t, 0.3, 1.2), 0))],
    sfx=[('thud', 0.35, -14, {'f': 80}), ('thud', 1.55, -16, {'f': 80})],
)

# 044 The deal is an IOU that can later turn into a slice of the company
S[44] = dict(
    cam=dict(kind='keys', keys=[(0, 1.2, 1300, 900), (4.9, 1.1, 1450, 1000)]),
    layers=[dict(type='part', poly=[(440, 300), (1060, 380), (1000, 800), (440, 710)], pivot=(760, 560),
                 fn=lambda t: dict(dy=14 * math.sin(2 * math.pi * 0.7 * t), rot=3 * math.sin(2 * math.pi * 0.5 * t), alpha=1 - 0.6 * win(t, 1.6, 2.6), s=1 - 0.15 * win(t, 1.6, 2.6)), pad=120, feather=4, smooth=True),
            dict(type='part', poly=[(1060, 470), (1400, 280), (1430, 370), (1080, 720)], pivot=(1240, 500),
                 fn=lambda t: dict(dy=14 * math.sin(2 * math.pi * 0.7 * t + 1), rot=-3 * math.sin(2 * math.pi * 0.5 * t), s=0.85 + 0.15 * back_out(clamp01((t - 1.8) / 0.6))), pad=120, feather=4, smooth=True),
            dict(type='particles', kind='sparkle', n=16, area=(700, 300, 1450, 800), size=36, rate=1.4, t0=1.2)],
    sfx=[('sparkle', 1.0, -10, {'d': 1.8, 'k': 12}), ('pop', 2.2, -12)],
)

# 045 The total: about $40 million (pile grows in from the bottom row up)
def _pile45(t):
    k = back_out(clamp01((t - 0.15) / 0.8), 1.4)
    return dict(sy=max(0.02, k), sx=0.9 + 0.1 * k)
S[45] = dict(
    cam=dict(kind='in', z=(1.0, 1.12), focus=(1900, 900)),
    layers=[dict(type='part', rect=(500, 100, 3700, 1640), fg=(400, 60, 3800, 1700), pivot=(1900, 1620), fn=_pile45, grow=7, pad=50, smooth=True, sigma=80),
            dict(type='particles', kind='sparkle', n=14, area=(800, 200, 3400, 1500), size=46, rate=0.9, t0=1.0)],
    text=[dict(s='~$40 MILLION', pos=(64, 150), size=78, t0=0.9)],
    sfx=[('paper', 0.1, -12, {'d': 0.8}), ('cash', 0.9, -8), ('sparkle', 1.2, -16, {'d': 1.4, 'k': 6})],
)

# 046 Reports say one big investor tries to slow it down (paddle waggles)
S[46] = dict(
    cam=dict(kind='in', z=(1.02, 1.2), focus=(2900, 800)),
    chars=[dict(head=(2900, 760, 260), b=1700, tilt=lambda t: (3 * math.sin(2 * math.pi * 0.9 * t), 0, 0))],
    layers=[dict(type='part', poly=[(2400, 250), (2850, 250), (2860, 700), (2700, 760), (2620, 1050), (2540, 1050), (2560, 760), (2400, 700)], pivot=(2600, 1100),
                 fn=lambda t: dict(rot=6 * math.sin(2 * math.pi * 1.6 * t) * win(t, 0.3, 0.6)), pad=150, feather=4)],
    sfx=[('whip', 0.4, -18), ('whip', 1.0, -20), ('uh_oh', 2.0, -16)],
)

# 047 The clock ticks toward Christmas (hands advance)
S[47] = dict(
    cam=dict(kind='in', z=(1.0, 1.25), focus=(1300, 700)),
    layers=[dict(type='clock', center=(1308, 510), len=330, width=13, erase_angle=-10, pin=28, tail=20,
                 fn=lambda t: -10 + 6 * min(int(t / 0.5), 3) + 6 * ease(clamp01((t % 0.5) / 0.12)) * (int(t / 0.5) < 4) if t < 2.0 else 12),
            dict(type='glow', center=(1300, 1800), radius=900, color=(40, 60, 200), squash=0.5, fn=lambda t: 0.15 * win(t, 0.5, 2.6))],
    sfx=ticks(0.0, 2.6, 0.5, -6) + [('heartbeat', 0.2, -12), ('heartbeat', 1.2, -10), ('heartbeat', 2.1, -8)],
)

# 048 6 p.m., December 24th: the deal closes. (relief)
S[48] = dict(
    cam=dict(kind='keys', keys=[(0, 1.05, 1300, 900), (0.8, 1.3, 1200, 620), (2.7, 1.36, 1200, 620)]),
    chars=[dict(head=(1180, 600, 180), b=1300, blink=False, breathe=0.02, period=2.0,
                tilt=lambda t: (-5 * win(t, 0.4, 1.4), 0, 10 * win(t, 0.4, 1.4)))],
    layers=[dict(type='glow', center=(1380, 700), radius=900, color=GOLD, fn=lambda t: 0.25 * win(t, 0.6, 1.6))],
    sfx=[('impact', 0.0, -10), ('chime_up', 0.3, -6), ('sparkle', 0.6, -16, {'d': 1.4, 'k': 6})],
)

# 049 In Elon's words, payroll would have bounced 2 days later (worker relief)
S[49] = dict(
    cam=dict(kind='in', z=(1.02, 1.14), focus=(2400, 700)),
    chars=[dict(head=(2490, 440, 380), b=2160, tilt=lambda t: (3 * math.sin(2 * math.pi * 0.6 * t), 0, 0))],
    layers=[dict(type='part', poly=[(2930, 130), (3340, 50), (3420, 370), (3280, 480), (3020, 520)], pivot=(3200, 400),
                 fn=lambda t: dict(rot=3 * math.sin(2 * math.pi * 1.2 * t), dy=-10 * pulse(t, 0.2, 1.0)), pad=100, feather=4),
            dict(type='glow', center=(3150, 260), radius=500, color=(140, 220, 255), fn=lambda t: 0.3 + 0.1 * math.sin(t * 4))],
    sfx=[('paper', 0.2, -14, {'d': 0.6}), ('chime_up', 0.8, -12)],
)

# 050 That same December, NASA hands SpaceX a $1.6 billion contract (cheer)
S[50] = dict(
    cam=dict(kind='out', z=(1.2, 1.02), focus=(1900, 600)),
    shake=[(0.0, 0.6, 6)],
    chars=[dict(head=(1928, 548, 136), b=1940, breathe=0.0, stretch=lambda t: 0.012 * abs(math.sin(2 * math.pi * 1.6 * t)),
                tilt=lambda t: (3 * math.sin(2 * math.pi * 1.6 * t), 0, 0))],
    layers=[dict(type='part', poly=[(820, 0), (1460, 0), (1460, 280), (820, 280)], pivot=(1100, 280),
                 fn=lambda t: dict(dy=-30 * abs(math.sin(2 * math.pi * 1.6 * t))), pad=60, feather=4, smooth=True),
            dict(type='particles', kind='confetti', n=60, area=(0, -200, 3840, 2160), speed=420, size=24, t0=0.3)],
    text=[dict(s='$1.6 BILLION', pos=(64, 150), size=78, t0=0.6)],
    sfx=[('applause', 0.2, -14, {'d': 4.0}), ('chime_up', 0.2, -8), ('cash', 1.0, -10)],
)

# 051 Both companies survive. Barely. (exhausted on the floor)
S[51] = dict(
    cam=dict(kind='out', z=(1.25, 1.04), focus=(3300, 1100)),
    chars=[dict(head=(3288, 900, 92), b=1700, breathe=0.02, period=3.6)],
    layers=[dict(type='glow', center=(1700, 560), radius=500, color=(60, 160, 255), fn=lambda t: 0.15 + 0.03 * math.sin(t * 5))],
    sfx=[('wind', 0.0, -24, {'d': 3.0}), ('heartbeat', 0.6, -14)],
)

# 052 2010: the U.S. government lends Tesla $465 million (big check)
S[52] = dict(
    cam=dict(kind='in', z=(1.0, 1.16), focus=(1900, 700)),
    chars=[dict(head=(1848, 320, 184), b=1900, tilt=lambda t: (2.5 * math.sin(2 * math.pi * 0.9 * t), 0, 0))],
    layers=[dict(type='part', rect=(1290, 610, 2530, 1130), pivot=(1900, 870), fn=lambda t: dict(s=0.9 + 0.1 * back_out(clamp01(t / 0.5)), rot=1.5 * math.sin(2 * math.pi * 0.6 * t)), pad=80, feather=3, fill=False),
            dict(type='particles', kind='sparkle', n=10, area=(1300, 620, 2500, 1120), size=44, rate=1.0, t0=0.4)],
    text=[dict(s='2010 · $465M LOAN', pos=(64, 150), size=72, t0=0.2)],
    sfx=[('whoosh', 0.0, -12, {'d': 0.5}), ('cash', 0.5, -8)],
)

# 053 June 29, 2010: IPO at $17 (bell rings, confetti)
S[53] = dict(
    cam=dict(kind='in', z=(1.04, 1.28), focus=(1800, 600)),
    chars=[dict(head=(1660, 420, 90), b=800, tilt=lambda t: (2 * math.sin(2 * math.pi * 2.4 * t) * (1 - win(t, 3, 4)), 0, 0))],
    layers=[dict(type='part', poly=[(1880, 280), (2120, 280), (2140, 440), (1860, 440)], pivot=(2000, 280),
                 fn=lambda t: dict(rot=12 * math.sin(2 * math.pi * 2.4 * t) * (1 - win(t, 3.0, 4.0))), pad=60, feather=3),
            dict(type='particles', kind='confetti', n=90, area=(0, -200, 3840, 2160), speed=320, size=20,
                 colors=[(60, 200, 255), (255, 180, 70), (60, 210, 255), (240, 240, 240)])],
    text=[dict(s='$17 A SHARE', pos=(64, 150), size=78, t0=1.0)],
    sfx=[('bell', 0.0, -6), ('bell', 0.42, -8), ('bell', 0.84, -8), ('bell', 1.26, -10), ('applause', 0.3, -12, {'d': 6.0})],
)

# 054 That makes the whole company worth about $1.5 billion (pizza spotlight)
S[54] = dict(
    cam=dict(kind='in', z=(1.0, 1.16)),
    layers=[dict(type='grade', fn=lambda t: (0.5 + 0.5 * win(t, 0.2, 0.7),) * 3 + (0,)),
            dict(type='particles', kind='sparkle', n=10, area=(1100, 500, 2800, 1700), size=50, rate=0.9, t0=0.7)],
    text=[dict(s='~$1.5 BILLION', pos=(64, 150), size=78, t0=0.7)],
    sfx=[('thud', 0.2, -12, {'f': 90}), ('chime_up', 0.6, -10)],
)

# 055 Think of a pizza: 1 slice's price times the number of slices (slice lifts)
S[55] = dict(
    cam=dict(kind='keys', keys=[(0, 1.05, 2000, 1000), (4.6, 1.22, 2600, 800)]),
    layers=[dict(type='part', poly=[(2900, 40), (3240, 40), (3400, 300), (3700, 380), (3700, 1050), (3360, 1000), (2900, 400)], pivot=(3000, 700),
                 fn=lambda t: dict(dy=-60 * win(t, 0.3, 1.3), rot=-2 * win(t, 0.3, 1.3)), pad=120, feather=4, fill=False)],
    sfx=[('pop', 0.4, -14), ('sparkle', 1.2, -18, {'d': 0.8, 'k': 4})],
)

# 056 Tesla buys an old car factory in Fremont for $42 million
S[56] = dict(
    cam=dict(kind='right', z=1.15),
    text=[dict(s='$42 MILLION', pos=(64, 150), size=78, t0=2.4)],
    sfx=[('wind', 0.0, -18, {'d': 5.7}), ('cash', 2.4, -10)],
)

# 057 It used to belong to GM and Toyota together (sign comes off)
S[57] = dict(
    cam=dict(kind='in', z=(1.04, 1.25), focus=(2900, 900)),
    chars=[dict(head=(2900, 830, 100), b=1700)],
    layers=[dict(type='part', poly=[(3000, 830), (3360, 830), (3370, 1160), (3000, 1180)], pivot=(3000, 1180),
                 fn=lambda t: dict(rot=-8 * win(t, 1.2, 2.0), dy=12 * win(t, 1.2, 2.0)), pad=100, feather=3)],
    sfx=[('servo', 0.2, -22, {'d': 0.8, 'f0': 900, 'f1': 1200}), ('clank', 1.3, -12), ('clank', 1.9, -18)],
)

# 058 June 2012: the first Model S family cars go to customers (car rolls out, crowd claps)
S[58] = dict(
    cam=dict(kind='out', z=(1.2, 1.0), focus=(2900, 1300)),
    chars=[dict(head=(x, 1050, 60), b=1640, breathe=0.0, blink=False, stretch=(lambda ph: lambda t: 0.015 * abs(math.sin(2 * math.pi * 2.2 * t + ph)))(i * 0.7))
           for i, x in enumerate([980, 1100, 1240, 1390, 1530, 1650, 3600, 3700, 3830])],
    layers=[dict(type='part', poly=[(2830, 1180), (3270, 1160), (3420, 1240), (3420, 1580), (2830, 1580)], pivot=(3100, 1580),
                 fn=lambda t: dict(dx=-180 * ease(clamp01(t / 5.2)), dy=50 * ease(clamp01(t / 5.2)), s=1 + 0.08 * ease(clamp01(t / 5.2))), pad=260, feather=4)],
    text=[dict(s='JUNE 2012', pos=(64, 150), size=78, t0=0.1)],
    sfx=[('applause', 0.0, -10, {'d': 5.2, 'rate': 60}), ('engine', 0.3, -18, {'d': 2.0, 'f0': 50, 'f1': 90})],
)

# 059 2013: Tesla pays back the government loan, 9 years early (check held out, glows "paid")
S[59] = dict(
    cam=dict(kind='keys', keys=[(0, 1.1, 1500, 900), (5.6, 1.16, 1900, 800)]),
    chars=[dict(head=(1080, 300, 188), b=1880, tilt=lambda t: (-3 * win(t, 1.8, 2.6), 0, 0))],
    layers=[dict(type='part', poly=[(1645, 440), (2930, 400), (2930, 970), (1645, 975)], pivot=(1640, 720),
                 fn=lambda t: dict(s=1 + 0.05 * pulse(t, 1.5, 2.4), rot=-1.5 * pulse(t, 1.5, 2.4)), pad=120, fill=False, feather=3),
            dict(type='glow', center=(2280, 690), radius=900, color=(120, 255, 160), squash=0.5, fn=lambda t: 0.35 * pulse(t, 1.6, 3.2)),
            dict(type='particles', kind='sparkle', n=12, area=(1700, 450, 2900, 950), size=50, rate=1.2, t0=1.7)],
    text=[dict(s='2013 · 9 YEARS EARLY', pos=(1100, 150), size=72, t0=0.1)],
    sfx=[('whoosh', 1.5, -12, {'d': 0.5}), ('ding', 1.9, -8), ('chime_up', 2.2, -12)],
)

# 060 Now for step 3 of the plan (blue car lights up)
S[60] = dict(
    cam=dict(kind='in', z=(1.0, 1.2), focus=(3000, 700)),
    layers=[dict(type='glow', center=(3000, 560), radius=900, color=(255, 150, 60), squash=0.6, fn=lambda t: 0.35 * win(t, 0.2, 0.8)),
            dict(type='particles', kind='sparkle', n=10, area=(2600, 300, 3700, 900), size=46, rate=1.1, t0=0.4)],
    text=[dict(s='STEP 3', pos=(64, 150), size=78, t0=0.1)],
    sfx=[('whoosh', 0.0, -14, {'d': 0.5}), ('chime_up', 0.3, -8)],
)

# ======================================================================= batch D: 61-88
RED = (40, 40, 230)

S[61] = dict(  # Elon shows the cheaper Model 3
    cam=dict(kind='in', z=(1.0, 1.15), focus=(2200, 900)),
    chars=[dict(head=(1000, 380, 160), b=1560, tilt=lambda t: (-3 * win(t, 0.5, 1.2), 0, 0))],
    layers=[dict(type='glow', center=(3000, 950), radius=360, color=(255, 240, 210), fn=lambda t: 0.8 * pulse(t, 0.6, 1.0) + 0.8 * pulse(t, 1.1, 1.5)),
            dict(type='glow', center=(2400, 1500), radius=1300, color=(255, 200, 140), squash=0.4, fn=lambda t: 0.25 * win(t, 0.2, 1.0)),
            dict(type='particles', kind='sparkle', n=10, area=(1500, 500, 3500, 1500), size=50, rate=0.9, t0=0.8)],
    text=[dict(s='MARCH 31, 2016', pos=(1200, 150), size=72, t0=0.1)],
    sfx=[('applause', 0.4, -16, {'d': 4.6}), ('chime_up', 0.6, -10)],
)
S[62] = dict(  # 325,000 people put down $1,000
    cam=dict(kind='keys', keys=[(0, 1.25, 1100, 1300), (6.5, 1.04, 2000, 800)]),
    chars=[dict(head=(400, 820, 90), b=1600), dict(head=(1140, 660, 100), b=1800)],
    layers=[dict(type='part', poly=[(700, 950), (960, 930), (980, 1100), (720, 1120)], pivot=(840, 1030),
                 fn=lambda t: dict(dx=-30 * pulse(t % 1.6, 0.2, 1.2), dy=-8 * pulse(t % 1.6, 0.2, 1.2)), pad=60, feather=4),
            dict(type='particles', kind='sparkle', n=14, area=(1500, 0, 3700, 1300), size=30, rate=1.0)],
    text=[dict(s='~325,000 PEOPLE', pos=(1250, 150), size=72, t0=1.0)],
    sfx=[('cash', 0.3, -12), ('cash', 1.9, -14), ('cash', 3.5, -16), ('cash', 5.1, -18), ('footsteps', 0.0, -18, {'d': 6.5, 'rate': 3.0})],
)
S[63] = dict(  # empty line, waiting
    cam=dict(kind='in', z=(1.0, 1.3), focus=(2500, 800), ease='lin'),
    sfx=[('hum', 0.0, -18, {'d': 2.5}), ('whoosh', 1.4, -10, {'d': 0.6})],
)
S[64] = dict(  # Elon promises 5,000 a week
    cam=dict(kind='in', z=(1.02, 1.16), focus=(2000, 700)),
    chars=[dict(head=(840, 400, 220), b=2050, tilt=lambda t: (2.5 * math.sin(2 * math.pi * 0.9 * t), 0, 0))],
    layers=[dict(type='glow', center=(2340, 380), radius=900, color=(200, 240, 255), squash=0.4, fn=lambda t: 0.35 * pulse(t, 0.4, 1.4) + 0.15 * win(t, 1.4, 2.0))],
    sfx=[('ding', 0.5, -8), ('hum', 0.0, -22, {'d': 4.4})],
)
S[65] = dict(  # only ~2,200 a week; worker taps wrist
    cam=dict(kind='right', z=1.12, ease='lin'),
    chars=[dict(head=(620, 380, 190), b=1940, tilt=lambda t: (2.5 * math.sin(2 * math.pi * 1.4 * t) * win(t, 2.5, 3.0), 0, 0))],
    text=[dict(s='~2,200 / WEEK  (GOAL 5,000)', pos=(1100, 150), size=64, t0=2.0)],
    sfx=ticks(0.0, 6.8, 0.5, -12) + [('uh_oh', 3.0, -14), ('hum', 0.0, -22, {'d': 6.8})],
)
S[66] = dict(  # robots stuck
    cam=dict(kind='in', z=(1.02, 1.14), focus=(1900, 900)),
    shake=[(0.0, 0.5, 6)],
    chars=[dict(head=(400, 860, 110), b=1900), dict(head=(3040, 900, 100), b=1700), dict(head=(3480, 860, 100), b=1700)],
    layers=[dict(type='glow', center=(2560, 380), radius=500, color=RED, fn=lambda t: 0.6 * (1 if int(t * 4) % 2 == 0 else 0.1)),
            dict(type='flash', at=[0.0], strength=0.2, decay=0.15, color=(80, 80, 255))],
    sfx=[('clank', 0.0, -6), ('servo', 0.0, -14, {'d': 0.5, 'f0': 700, 'f1': 300}), ('zap', 0.3, -14), ('uh_oh', 1.0, -14)],
)
S[67] = dict(  # facepalm
    cam=dict(kind='in', z=(1.04, 1.18), focus=(2200, 800)),
    chars=[dict(head=(2120, 540, 200), b=1980, blink=False, tilt=lambda t: (2 * math.sin(2 * math.pi * 1.2 * t) * pulse(t, 0.3, 2.5), 0, 6 * pulse(t, 0.3, 2.5)))],
    sfx=[('servo', 0.1, -18, {'d': 0.6, 'f0': 600, 'f1': 400}), ('uh_oh', 0.6, -12)],
)
S[68] = dict(  # sleeping in the factory
    cam=dict(kind='in', z=(1.05, 1.18), focus=(1100, 1300)),
    chars=[dict(head=(860, 1160, 200), b=1700, blink=False, breathe=0.03, period=3.0, body_w=3.5)],
    layers=[dict(type='grade', fn=lambda t: (0.88, 0.85, 0.8, 0))],
    sfx=[('hum', 0.0, -26, {'d': 2.9}), ('wind', 0.0, -28, {'d': 2.9})],
)
S[69] = dict(  # tent factory
    cam=dict(kind='in', z=(1.0, 1.16), focus=(2400, 1000)),
    chars=[dict(head=(340, 980, 90), b=1660), dict(head=(600, 1020, 90), b=1660), dict(head=(840, 1020, 90), b=1660), dict(head=(3120, 1040, 80), b=1640)],
    layers=[dict(type='glow', center=(2200, 1100), radius=800, color=(140, 220, 255), squash=0.7, fn=lambda t: 0.2 + 0.08 * math.sin(t * 3)),
            dict(type='particles', kind='dust', n=50, area=(1100, 400, 3400, 1600), color=(170, 230, 255), rise=20, strength=0.5)],
    sfx=[('wind', 0.0, -16, {'d': 4.7}), ('hum', 0.0, -20, {'d': 4.7}), ('servo', 1.5, -20, {'d': 0.8})],
)
S[70] = dict(  # tent up in 2 weeks
    cam=dict(kind='keys', keys=[(0, 1.2, 1600, 1100), (2.8, 1.08, 1900, 900)]),
    shake=[(0.2, 2.6, 3)],
    chars=[dict(head=(1520, 760, 100), b=1700, blink=False), dict(head=(2060, 860, 100), b=1700)],
    text=[dict(s='~2 WEEKS', pos=(1400, 150), size=78, t0=0.5)],
    sfx=[('clank', 0.2, -12), ('clank', 1.0, -14), ('clank', 1.8, -12), ('wind', 0.0, -18, {'d': 2.8})],
)
S[71] = dict(  # 5,031 — celebration
    cam=dict(kind='out', z=(1.2, 1.02), focus=(2000, 700)),
    shake=[(0.0, 0.8, 8)],
    chars=[dict(head=(900, 640, 230), b=2000, breathe=0.0, stretch=lambda t: 0.015 * abs(math.sin(2 * math.pi * 1.7 * t))),
           dict(head=(3020, 540, 200), b=2000, breathe=0.0, stretch=lambda t: 0.015 * abs(math.sin(2 * math.pi * 1.7 * t + 1.5)))],
    layers=[dict(type='glow', center=(1840, 260), radius=800, color=(200, 240, 255), squash=0.5, fn=lambda t: 0.4 * pulse(t, 0.0, 0.8) + 0.15),
            dict(type='particles', kind='confetti', n=80, area=(0, -200, 3840, 2160), speed=420, size=24, t0=0.2)],
    text=[dict(s='JUNE 2018', pos=(64, 150), size=72, t0=0.1, t1=2.5)],
    sfx=[('impact', 0.0, -8), ('applause', 0.0, -8, {'d': 5.6, 'rate': 70}), ('chime_up', 0.2, -8)],
)
S[72] = dict(  # storm
    cam=dict(kind='in', z=(1.0, 1.1)),
    layers=[dict(type='particles', kind='rain', n=500, strength=0.7),
            dict(type='flash', at=[0.5], strength=0.6, decay=0.1, color=(255, 230, 220))],
    shake=[(0.5, 1.2, 6)],
    sfx=[('rain', 0.0, -10, {'d': 1.9}), ('thunder', 0.5, -4)],
)
def _wobble73(t): return dict(rot=3.5 * math.sin(2 * math.pi * 0.9 * t) * (0.6 + 0.4 * math.sin(t * 1.7)))
S[73] = dict(  # a month from bankruptcy (cliff wobble)
    cam=dict(kind='in', z=(1.04, 1.18), focus=(2000, 900)),
    layers=[dict(type='part', poly=[(1300, 40), (2440, 40), (2440, 1100), (2120, 1400), (1720, 1400), (1300, 1100)], fg=(1250, 0, 2500, 1420),
                 pivot=(1960, 1380), fn=_wobble73, pad=200, grow=9, smooth=True, sigma=50),
            dict(type='particles', kind='burst', n=6, origin=(1950, 1420), at=1.0, stagger=1.5, dir=95, spread=20, speed=(100, 250), gravity=1800, life=1.2, size=14, colors=[(60, 80, 110)])],
    sfx=[('wind', 0.0, -12, {'d': 3.4}), ('heartbeat', 0.3, -8), ('heartbeat', 1.4, -8), ('heartbeat', 2.5, -8)],
)
S[74] = dict(  # production hell
    cam=dict(kind='in', z=(1.0, 1.14), focus=(1600, 900)),
    shake=[(0.0, 4.0, 3)],
    shake_decay=False,
    layers=[dict(type='particles', kind='sparks', n=60, origin=(1290, 690), rate=50, life=0.7, speed=(400, 1200), spread=80, dir=-60),
            dict(type='particles', kind='sparks', n=40, origin=(2420, 940), rate=35, life=0.6, speed=(300, 900), spread=80, dir=-110),
            dict(type='particles', kind='smoke', origin=(2200, 1300), n=30, span=4.0, life=3.0, size=200, speed=120, dir=-100, spread=60, rise=80, density=0.35, color=(90, 90, 200)),
            dict(type='glow', center=(1900, 900), radius=2000, color=(30, 30, 200), fn=lambda t: 0.15 + 0.1 * math.sin(t * 6))],
    sfx=[('hum', 0.0, -12, {'d': 4.0}), ('zap', 0.2, -10), ('zap', 1.4, -10), ('zap', 2.6, -10), ('clank', 0.8, -14), ('clank', 2.0, -14), ('rumble', 0.0, -12, {'d': 4.0})],
)
S[75] = dict(  # cars flowing, profits
    cam=dict(kind='left', z=1.14, ease='lin'),
    layers=[dict(type='part', rect=(220, 640, 1680, 1400), pivot=(950, 1400), fn=lambda t: dict(sy=1 - 0.006 * abs(math.sin(2 * math.pi * 1.5 * t))), pad=40, fill=False, feather=6),
            dict(type='particles', kind='sparkle', n=16, area=(200, 500, 3800, 1300), size=40, rate=1.0),
            dict(type='glow', center=(1900, 900), radius=1800, color=GOLD, squash=0.6, fn=lambda t: 0.2 * win(t, 3.5, 5.0))],
    text=[dict(s='4 PROFITABLE QUARTERS IN A ROW', pos=(64, 150), size=60, t0=3.8)],
    sfx=[('hum', 0.0, -18, {'d': 7.5}), ('servo', 0.5, -22, {'d': 0.8}), ('servo', 2.5, -22, {'d': 0.8}), ('cash', 3.8, -10), ('cash', 4.6, -14), ('cash', 5.4, -18)],
)
S[76] = dict(  # passes Toyota
    cam=dict(kind='in', z=(1.0, 1.14), focus=(2400, 700)),
    layers=[dict(type='part', rect=(1820, 260, 3300, 900), pivot=(2560, 900), fn=lambda t: dict(sy=1 + 0.012 * pulse(t, 0.5, 0.9) + 0.012 * pulse(t, 1.0, 1.4)), pad=40, fill=False, feather=6),
            dict(type='glow', center=(2600, 560), radius=300, color=(255, 240, 210), fn=lambda t: 0.9 * pulse(t, 1.6, 1.9) + 0.9 * pulse(t, 2.0, 2.3)),
            dict(type='glow', center=(2560, 600), radius=1100, color=GOLD, squash=0.8, fn=lambda t: 0.4 * win(t, 2.6, 3.2)),
            dict(type='particles', kind='sparkle', n=12, area=(1800, 200, 3300, 900), size=46, rate=1.0, t0=2.8)],
    text=[dict(s='JULY 1, 2020 · ~$209B', pos=(64, 150), size=70, t0=0.2)],
    sfx=[('engine', 0.3, -14, {'d': 1.4}), ('ding', 1.6, -12), ('ding', 2.0, -12), ('chime_up', 2.7, -6), ('applause', 3.0, -16, {'d': 3.5})],
)
S[77] = dict(  # 12 years after Christmas Eve
    cam=dict(kind='in', z=(1.02, 1.18), focus=(1400, 700)),
    chars=[dict(head=(960, 400, 180), b=1820, tilt=lambda t: (-3 * win(t, 0.8, 1.8), 0, 0))],
    layers=[dict(type='glow', center=(2520, 1040), radius=360, color=GOLD, fn=lambda t: 0.3 + 0.2 * math.sin(t * 3)),
            dict(type='particles', kind='sparkle', n=5, area=(2400, 900, 2650, 1150), size=36, rate=1.0)],
    sfx=[('tick', 0.3, -14), ('tock', 1.3, -14), ('chime_up', 2.0, -12)],
)
S[78] = dict(  # $1.5 trillion: giant pizza
    cam=dict(kind='up', z=1.16, ease='io'),
    layers=[dict(type='particles', kind='sparkle', n=14, area=(800, 0, 3700, 1600), size=56, rate=0.8)],
    text=[dict(s='~$1.5 TRILLION', pos=(64, 150), size=84, t0=0.6)],
    sfx=[('riser', 0.0, -12, {'d': 1.2}), ('impact', 1.0, -6), ('cash', 1.1, -10)],
)
S[79] = dict(  # ~1,000x day 1
    cam=dict(kind='out', z=(1.35, 1.0), focus=(1920, 1300)),
    text=[dict(s='~1,000x', pos=(64, 150), size=90, t0=1.2)],
    sfx=[('whoosh', 0.0, -10, {'d': 1.4}), ('impact', 1.2, -8)],
)
S[80] = dict(  # Toyota $253B vs Tesla ~6x
    cam=dict(kind='in', z=(1.0, 1.12), focus=(1900, 1000)),
    layers=[dict(type='part', rect=(160, 1260, 1360, 1960), pivot=(760, 1300), fn=lambda t: dict(dy=14 * (1 - spring(t, 0.3, 1.2, 2.5))), pad=40, fill=False, feather=6),
            dict(type='glow', center=(760, 1500), radius=700, color=GOLD, fn=lambda t: 0.25 * win(t, 1.0, 2.0))],
    text=[dict(s='TOYOTA ~$253B · TESLA ~6x', pos=(64, 150), size=66, t0=0.4)],
    sfx=[('clank', 0.3, -12), ('thud', 0.35, -10), ('chime_up', 3.0, -14)],
)
S[81] = dict(  # Toyota sold 11.3M cars
    cam=dict(kind='up', z=1.15),
    text=[dict(s='TOYOTA 2025: ~11.3M CARS', pos=(64, 150), size=66, t0=0.3)],
    sfx=[('rumble', 0.0, -12, {'d': 2.5}), ('clank', 0.6, -18), ('clank', 1.4, -20)],
)
S[82] = dict(  # Tesla sold 1.6M
    cam=dict(kind='in', z=(1.0, 1.55), focus=(1900, 1450)),
    text=[dict(s='TESLA 2025: ~1.6M', pos=(64, 150), size=72, t0=0.3)],
    sfx=[('pop', 0.3, -12), ('uh_oh', 1.0, -16)],
)
S[83] = dict(  # a bet on tomorrow
    cam=dict(kind='in', z=(1.02, 1.16), focus=(1900, 500)),
    layers=[dict(type='glow', center=(1900, 300), radius=1300, color=(120, 220, 255), squash=0.6, fn=lambda t: 0.25 + 0.15 * math.sin(t * 2)),
            dict(type='particles', kind='sparkle', n=10, area=(400, 0, 3600, 600), size=50, rate=0.8)],
    sfx=[('wind', 0.0, -20, {'d': 3.5}), ('sparkle', 0.5, -14, {'d': 2.0, 'k': 8})],
)
S[84] = dict(  # lemonade stand -> skyscraper shadow (camera follows the shadow up)
    cam=dict(kind='keys', keys=[(0, 1.3, 1450, 1250), (1.2, 1.3, 1500, 1200), (5.3, 1.12, 2700, 700)]),
    layers=[dict(type='glow', center=(2950, 700), radius=1100, color=GOLD, squash=1.3, fn=lambda t: 0.25 * win(t, 1.5, 3.5)),
            dict(type='particles', kind='sparkle', n=8, area=(2500, 100, 3500, 1500), size=46, rate=0.9, t0=2.5)],
    sfx=[('pour', 0.0, -18, {'d': 1.0}), ('riser', 1.0, -12, {'d': 2.6}), ('chime_up', 3.4, -12)],
)
S[85] = dict(  # spinning coin
    cam=dict(kind='in', z=(1.0, 1.2), focus=(1960, 850)),
    layers=[dict(type='part', ellipse=(1975, 850, 300, 680), pivot=(1975, 850),
                 fn=lambda t: dict(sx=0.3 + 0.7 * abs(math.cos(2 * math.pi * 1.6 * t)), dy=8 * math.sin(2 * math.pi * 3.2 * t)), pad=200, feather=18, smooth=True, sigma=50)],
    sfx=[('coin_spin', 0.0, -8, {'d': 3.0})],
)
S[86] = dict(  # last money: pockets out
    cam=dict(kind='in', z=(1.02, 1.16), focus=(1300, 700)),
    chars=[dict(head=(1180, 260, 190), b=2020, tilt=lambda t: (4 * win(t, 0.8, 1.6), 0, -12 * pulse(t, 1.6, 2.6)))],
    sfx=[('paper', 0.3, -16, {'d': 0.5}), ('uh_oh', 1.4, -18)],
)
S[87] = dict(  # "even though I thought we would still fail"
    cam=dict(kind='in', z=(1.0, 1.14), focus=(2900, 800)),
    chars=[dict(head=(2940, 280, 110), b=1720, blink=False, breathe=0.008, period=4.0)],
    layers=[dict(type='particles', kind='sparkle', n=16, area=(3360, 100, 3840, 1150), size=16, rate=0.7, color=(150, 220, 255))],
    sfx=[('wind', 0.0, -24, {'d': 4.0})],
)
def _wave88(t): return dict(rot=7 * math.sin(2 * math.pi * 1.8 * t))
S[88] = dict(  # wave; roadster already blurred past in the picture
    cam=dict(kind='in', z=(1.0, 1.1), focus=(1700, 900)),
    shake=[(0.3, 0.9, 5)],
    layers=[dict(type='part', poly=[(1060, 220), (1350, 200), (1420, 560), (1440, 700), (1300, 720), (1170, 520), (1040, 420)], pivot=(1380, 680), fn=_wave88, pad=150, feather=6, fill=False),
            dict(type='particles', kind='sparkle', n=8, area=(1300, 200, 2200, 900), size=40, rate=0.9, t0=1.0)],
    sfx=[('zoom_by', 0.0, -6, {'d': 1.6}), ('pop', 1.4, -12), ('chime_up', 2.2, -12)],
)
