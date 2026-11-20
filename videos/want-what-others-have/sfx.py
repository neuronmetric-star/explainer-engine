#!/usr/bin/env python3
"""Synthesise the sound-effects bed for want-what-others-have (no samples, no credits) and remix final.mp4:
voice on top, SFX ducked under it (sidechain), optional music.mp3.
Usage: python3 videos/want-what-others-have/sfx.py   ->  sfx.wav + final.mp4 with the new mix
"""
import os, subprocess, sys, wave
import numpy as np
from scipy.signal import butter, sosfilt

HERE = os.path.dirname(os.path.abspath(__file__)); sys.path.insert(0, HERE)
import assemble as A   # timings: A.CUES, A.word_t, A.CLOUDS, A.END

SR = 44100
N = int(A.END * SR) + SR
OUT = np.zeros((N, 2))
rng = np.random.default_rng(7)
db = lambda d: 10 ** (d / 20)

def filt(x, lo=None, hi=None, order=2):
    if lo and hi: sos = butter(order, [lo, hi], 'band', fs=SR, output='sos')
    elif hi: sos = butter(order, hi, 'low', fs=SR, output='sos')
    else: sos = butter(order, lo, 'high', fs=SR, output='sos')
    return sosfilt(sos, x)
def norm(x): m = np.max(np.abs(x)); return x / m if m > 0 else x
def fade(x, a=0.01, r=0.05):
    n = len(x); e = np.ones(n); na, nr = min(n, int(a * SR)), min(n, int(r * SR))
    if na: e[:na] = np.linspace(0, 1, na)
    if nr: e[-nr:] *= np.linspace(1, 0, nr)
    return x * e
def put(t, x, gain_db=0.0, pan=0.0):
    """place mono x at time t (s); pan -1..1"""
    i = int(t * SR); x = x * db(gain_db)
    if i >= N: return
    x = x[: N - i]
    l, r = np.cos((pan + 1) * np.pi / 4), np.sin((pan + 1) * np.pi / 4)
    OUT[i:i + len(x), 0] += x * l * 1.41; OUT[i:i + len(x), 1] += x * r * 1.41
def put_st(t, l, r, gain_db=0.0):
    i = int(t * SR); n = min(len(l), N - i)
    OUT[i:i + n, 0] += l[:n] * db(gain_db); OUT[i:i + n, 1] += r[:n] * db(gain_db)
tt = lambda d: np.arange(int(d * SR)) / SR

# ---------- sound designers ----------
def city(d):
    n = int(d * SR); w = rng.standard_normal(n)
    bed = norm(filt(w, hi=700)) * 0.6 + norm(filt(rng.standard_normal(n), 300, 2500)) * 0.15
    # distant cars passing: slow swells of band noise
    for k in range(int(d / 2.5)):
        c = rng.uniform(0, d); L = rng.uniform(1.5, 3.0)
        s = int(c * SR); e = min(n, s + int(L * SR))
        if e - s < 10: continue
        sw = norm(filt(rng.standard_normal(e - s), 120, 900)) * np.sin(np.linspace(0, np.pi, e - s)) ** 2
        bed[s:e] += sw * 0.5
    return norm(bed)
def idle(d, f0=31.0):
    t = tt(d); jit = 1 + 0.01 * np.sin(2 * np.pi * 0.7 * t)
    ph = 2 * np.pi * np.cumsum(f0 * jit) / SR
    x = sum(np.sin(k * ph) / k for k in range(1, 9))
    x *= 0.6 + 0.4 * (np.sin(ph * 0.5) > 0)              # firing pulses
    x += filt(rng.standard_normal(len(t)), 60, 400) * 0.6
    return fade(norm(filt(x, hi=500)), 0.3, 0.3)
def rev(d=1.4):
    t = tt(d); f = 35 + 70 * (1 - np.exp(-t * 3)) * np.exp(-np.maximum(0, t - 0.9) * 2)
    ph = 2 * np.pi * np.cumsum(f) / SR
    x = sum(np.sin(k * ph) / k for k in range(1, 12)) + filt(rng.standard_normal(len(t)), 80, 1500) * 0.5
    return fade(norm(filt(x, hi=1800)) * np.minimum(1, t * 6) * np.exp(-np.maximum(0, t - 0.8) * 2.5), 0.02, 0.2)
def heli(d, peak):
    t = tt(d); rate = 11.5
    chop = np.maximum(0, np.sin(2 * np.pi * rate * t)) ** 6
    body = filt(rng.standard_normal(len(t)), 40, 500) * (0.25 + chop)
    thump = np.sin(2 * np.pi * 55 * t) * chop
    whine = np.sin(2 * np.pi * (2400 + 30 * np.sin(2 * np.pi * 0.3 * t)) * t) * 0.04
    x = norm(body + thump * 0.6 + whine)
    env = np.exp(-((t - peak) / (d * 0.32)) ** 2)
    pan = np.clip((t - peak) / (d * 0.4), -1, 1)       # left -> right (it always flies RIGHT)
    l = x * env * np.cos((pan + 1) * np.pi / 4) * 1.41; r = x * env * np.sin((pan + 1) * np.pi / 4) * 1.41
    return l, r
def pop():
    t = tt(0.16); f = 260 + 900 * (1 - np.exp(-t * 40))
    x = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 28)
    x[:60] += rng.standard_normal(60) * np.linspace(0.6, 0, 60)
    return fade(x, 0.002, 0.03)
def twinkle():
    t = tt(0.9); x = np.zeros(len(t))
    for k, (f, d) in enumerate(((1568, 0.0), (2093, 0.06), (2637, 0.12))):
        s = int(d * SR); x[s:] += np.sin(2 * np.pi * f * t[: len(t) - s]) * np.exp(-t[: len(t) - s] * 5) * 0.5
    return fade(x, 0.003, 0.2)
def thought_pop(): x = np.zeros(int(0.9 * SR)); p = pop(); x[:len(p)] += p; tw = twinkle(); x[int(0.05 * SR):] += tw[: len(x) - int(0.05 * SR)] * 0.35; return x
def whoosh(d=0.45):
    t = tt(d); n = rng.standard_normal(len(t)); out = np.zeros(len(t)); seg = 512
    for s in range(0, len(t), seg):
        u = s / len(t); fc = 400 + 2600 * np.sin(np.pi * u)
        out[s:s + seg] = filt(n[s:s + seg], max(100, fc * 0.6), min(SR / 2 - 100, fc * 1.6))
    return fade(norm(out) * np.sin(np.pi * t / d) ** 2, 0.01, 0.05)
def honk():
    t = tt(0.42); x = np.sign(np.sin(2 * np.pi * 415 * t)) + np.sign(np.sin(2 * np.pi * 523 * t))
    return fade(norm(filt(x, 300, 2500)), 0.01, 0.06)
def ding():
    t = tt(1.2); x = np.sin(2 * np.pi * 1318 * t) * np.exp(-t * 3.5) + 0.4 * np.sin(2 * np.pi * 2637 * t) * np.exp(-t * 6)
    return fade(x, 0.002, 0.2)
def step():
    t = tt(0.09); x = filt(rng.standard_normal(len(t)), 80, 900) * np.exp(-t * 60) + np.sin(2 * np.pi * 90 * t) * np.exp(-t * 45) * 0.6
    return fade(x, 0.001, 0.02)
def key_click():
    t = tt(0.025); return filt(rng.standard_normal(len(t)), 1800, 7000) * np.exp(-t * 300)
def room(d): return fade(norm(filt(rng.standard_normal(int(d * SR)), hi=220)) + 0.05 * np.sin(2 * np.pi * 60 * tt(d)), 0.2, 0.2)
def birds(d):
    x = np.zeros(int(d * SR))
    for k in range(int(d * 1.2)):
        c = rng.uniform(0, d - 0.3); L = rng.uniform(0.06, 0.14); t = tt(L)
        f = rng.uniform(3000, 5200) + 1500 * np.sin(2 * np.pi * rng.uniform(8, 20) * t)
        ch = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.sin(np.pi * t / L) ** 2
        s = int(c * SR); x[s:s + len(ch)] += ch
    return x
def click():
    t = tt(0.03); return filt(rng.standard_normal(len(t)), 1500, 6000) * np.exp(-t * 200) + np.sin(2 * np.pi * 2200 * t) * np.exp(-t * 150) * 0.5
def chime2():
    x = np.zeros(int(0.9 * SR)); t = tt(0.7)
    for k, f in enumerate((1047, 1568)):
        s = int(k * 0.11 * SR); x[s:s + len(t)] += np.sin(2 * np.pi * f * t) * np.exp(-t * 6)
    return fade(x, 0.002, 0.1)

# ---------- timeline ----------
C, w = A.CUES, A.word_t
street = [(0, C['problem']), (w('Lamborghini.'), C['picture']), (C['now'], A.END)]
office = [(C['problem'], w('Lamborghini.')), (C['picture'], C['now'])]
for a, b in street:
    d = b - a; cb = city(d)
    put_st(a, fade(cb, 0.05, 0.08) * 0.9, fade(np.roll(cb, 3000), 0.05, 0.08) * 0.9, -30)
for a, b in office:
    put(a, room(b - a), -36)
# typing while Victor works late
a, b = office[0]; t = a + 0.2
while t < b - 0.2: put(t, key_click(), -20 + rng.uniform(-3, 2), rng.uniform(-0.2, 0.2)); t += rng.uniform(0.07, 0.19)
# engines idling at the red light (car shots)
for a, b in [(0, C['problem']), (w('Lamborghini.'), C['heli']), (C['looks'], C['nolights']), (C['gwagon'], C['bet']), (C['now'], C['green'])]:
    put(a, idle(b - a), -28)
put(w('red', C['light']) + 0.15, honk(), -22, 0.5)                    # "stuck at a red light" + a honk
# helicopter flyover (always flies right) + the aerial shot
d = C['nolights'] + 1.4 - C['heli']; l, r = heli(d, peak=1.6); put_st(C['heli'] - 0.4, l, r, -15)
l, r = heli(C['gwagon'] - C['nolights'] + 0.4, peak=0.7); put_st(C['nolights'], l, r, -17)
put(C['nolights'], filt(rng.standard_normal(int(1.4 * SR)), 200, 1200) * np.hanning(int(1.4 * SR)), -30)  # wind
l, r = heli(2.0, peak=1.0); put_st(-0.0, l, r, -34)                  # the tiny helicopter in the opening shot
# thought clouds: pop + twinkle on each
for prop, cs, ce, head, cc, cw in A.CLOUDS:
    if os.path.exists(A.P(prop)): put(cs + 0.1, thought_pop(), -14, (cc[0] - 540) / 700)
# Doug's footsteps on the sidewalk
for a, b in [(C['doug'], C['bet']), (C['wheel'], C['walk']), (C['end'], C['end'] + 3.2)]:
    t = a + 0.15
    while t < b: put(t, step(), -24 + rng.uniform(-2, 1), 0.3); t += 0.48
# light turns green: ding, rev, whoosh as they pull away
put(C['green'] + 0.25, ding(), -22)
put(w('cars', C['green']) - 0.35, rev(), -16, 0.2)
put(w('cars', C['green']) + 0.1, whoosh(0.7), -20, 0.6)
# whooshes on a few hard cuts
for cue in ('problem', 'heli', 'picture', 'now'):
    put(C[cue] - 0.12, whoosh(0.35), -27)
# calm ending: birds at the bus stop
put(C['wheel'], birds(A.END - C['wheel']), -34, 0.4)
# ending: the helicopter flies away to the right, fading into the distance
l, r = heli(A.END - C['cta'] + 0.5, peak=0.2); put_st(C['cta'] - 0.3, l * np.linspace(1, 0.15, len(l)), r * np.linspace(1, 0.15, len(r)), -18)
# CTA: button pop, tap click, success chime
put(C['cta'] + 0.4, pop(), -14); put(C['cta'] + 0.4 + 2.1, click(), -12); put(C['cta'] + 0.4 + 2.15, chime2(), -18)

OUT = OUT[: int(A.END * SR)]
OUT /= max(1.0, np.max(np.abs(OUT)) / 0.89)
pcm = (np.clip(OUT, -1, 1) * 32767).astype('<i2')
wav = os.path.join(HERE, 'sfx.wav')
with wave.open(wav, 'wb') as f: f.setnchannels(2); f.setsampwidth(2); f.setframerate(SR); f.writeframes(pcm.tobytes())
print('sfx ->', wav, f'{len(OUT) / SR:.1f}s')

# ---------- remix final.mp4 (video copied, audio rebuilt) ----------
fin = os.path.join(HERE, 'final.mp4')
if os.path.exists(fin) and '--no-mix' not in sys.argv:
    tmp = os.path.join(HERE, '.final_mix.mp4')
    music = os.path.join(HERE, 'music.mp3')
    ins = ['-i', fin, '-i', os.path.join(HERE, 'voice.mp3'), '-i', wav]
    fc = ('[1:a]aresample=44100,pan=stereo|c0=c0|c1=c0,apad,asplit=2[v][key];'
          '[2:a]volume=1.8[sx];[sx][key]sidechaincompress=threshold=0.04:ratio=5:attack=15:release=350[s];')
    if os.path.exists(music):
        ins += ['-i', music]; fc += f'[3:a]volume=0.10[m];[v][s][m]amix=inputs=3:duration=first:normalize=0,loudnorm=I=-14:TP=-1.5:LRA=11[a]'
    else:
        fc += '[v][s]amix=inputs=2:duration=first:normalize=0,loudnorm=I=-14:TP=-1.5:LRA=11[a]'
    subprocess.run(['ffmpeg', '-y', '-v', 'error', *ins, '-filter_complex', fc, '-map', '0:v', '-map', '[a]',
                    '-c:v', 'copy', '-c:a', 'aac', '-b:a', '192k', '-t', f'{A.END:.3f}', '-movflags', '+faststart', tmp], check=True)
    os.replace(tmp, fin); print('remixed ->', fin)
