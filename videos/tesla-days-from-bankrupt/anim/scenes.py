"""Per-scene animation specs (4K pixel coordinates). See engine.py for the keys."""
import math
from engine import ease, ease_out, win, pulse, spring, keyed, back_out, clamp01

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
    layers=[dict(type='part', rect=(1245, 72, 1866, 530), fg=(1180, 40, 1930, 560), pivot=(1555, 300), fn=_env(0.0), grow=9, pad=260),
            dict(type='part', rect=(2168, 357, 2731, 744), fg=(2110, 320, 2790, 780), pivot=(2450, 550), fn=_env(0.33), grow=9, pad=260),
            dict(type='part', rect=(3054, 232, 3641, 633), fg=(2990, 190, 3700, 680), pivot=(3350, 430), fn=_env(0.66), grow=9, pad=260)],
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
