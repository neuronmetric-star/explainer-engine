#!/usr/bin/env python3
"""Synthesize and mix sound effects (no downloads, no credits).
Usage: sfx.py events.json out.wav length_seconds
events.json: [{"t": 1.23, "sfx": "whoosh", "gain": 0.5}, ...]
Library: whoosh, step, servo, beep, tap, pop, click, plane, hum, clunk."""
import json, sys, wave
import numpy as np

SR = 44100
rng = np.random.default_rng(7)


def env(n, a, r):  # attack/release envelope in samples
    e = np.ones(n)
    a = max(1, int(a)); r = max(1, int(r))
    e[:a] = np.linspace(0, 1, a)
    e[-r:] *= np.linspace(1, 0, r)
    return e


def lowpass(x, k):  # simple moving-average lowpass, k samples
    if k <= 1: return x
    return np.convolve(x, np.ones(k) / k, mode='same')


def noise(n): return rng.standard_normal(n)


def whoosh(d=0.38):
    n = int(SR * d); t = np.arange(n) / SR
    x = noise(n)
    lo = lowpass(x, 40); hi = x - lowpass(x, 6)
    mix = lo * (1 - t / d) + hi * 0.25 * (t / d)       # sweep from dark to bright
    shape = np.sin(np.pi * np.clip(t / d, 0, 1)) ** 2
    return mix * shape * 0.9


def step(d=0.07):  # light metallic foot tap
    n = int(SR * d); t = np.arange(n) / SR
    tick = np.sin(2 * np.pi * 2300 * t) * np.exp(-t * 90) * 0.5
    thud = np.sin(2 * np.pi * 140 * t) * np.exp(-t * 60) * 0.7
    grit = (noise(n) - lowpass(noise(n), 4)) * np.exp(-t * 160) * 0.25
    return tick + thud + grit


def servo(d=0.32):  # robot motor whirr
    n = int(SR * d); t = np.arange(n) / SR
    f = 260 + 140 * (t / d)
    ph = 2 * np.pi * np.cumsum(f) / SR
    saw = 2 * ((ph / (2 * np.pi)) % 1) - 1
    x = lowpass(saw, 6) * (0.75 + 0.25 * np.sin(2 * np.pi * 38 * t)) + noise(n) * 0.05
    return x * env(n, SR * .03, SR * .08) * 0.45


def beep(d=0.22):  # two-tone robot boop
    n = int(SR * d); t = np.arange(n) / SR
    f = np.where(t < d / 2, 880, 1320)
    return np.sin(2 * np.pi * f * t) * env(n, 200, 800) * 0.25


def tap(d=0.04):
    n = int(SR * d); t = np.arange(n) / SR
    return (np.sin(2 * np.pi * 1800 * t) * 0.4 + noise(n) * 0.2) * np.exp(-t * 180)


def pop(d=0.14):
    n = int(SR * d); t = np.arange(n) / SR
    f = 300 + 900 * (t / d)
    return np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 28) * 0.55


def click(d=0.05):
    n = int(SR * d); t = np.arange(n) / SR
    return (np.sin(2 * np.pi * 3200 * t) * 0.35 + noise(n) * 0.15) * np.exp(-t * 220)


def plane(d=2.8):  # propeller drone flying past
    n = int(SR * d); t = np.arange(n) / SR
    base = sum(np.sin(2 * np.pi * 95 * k * t) / k for k in range(1, 6))
    chop = 0.6 + 0.4 * np.sin(2 * np.pi * 22 * t)
    rumble = lowpass(noise(n), 60) * 2.0
    pan = np.sin(np.pi * np.clip(t / d, 0, 1)) ** 1.5      # louder as it passes
    return (base * chop * 0.25 + rumble * 0.4) * pan * 0.6


def hum(d=2.4):  # robot vacuum
    n = int(SR * d); t = np.arange(n) / SR
    x = np.sin(2 * np.pi * 190 * t) * 0.3 + np.sin(2 * np.pi * 380 * t) * 0.1 + (noise(n) - lowpass(noise(n), 3)) * 0.06
    return x * env(n, SR * .25, SR * .4) * 0.5


def clunk(d=0.35):  # light switch / lights going out
    n = int(SR * d); t = np.arange(n) / SR
    return (np.sin(2 * np.pi * 70 * t) * 0.9 + click(d)[:n] * 2) * np.exp(-t * 14) * 0.6


def helicopter(d=3.6):  # the signature ending: rotor "whup-whup" + turbine whine, passing overhead
    n = int(SR * d); t = np.arange(n) / SR
    slap = np.clip(np.sin(2 * np.pi * 5.5 * t), 0, 1) ** 6            # blade slap ~5.5 per second
    thump = lowpass(noise(n), 40) * 3.0 * (0.35 + 0.65 * slap)
    whine = np.sin(2 * np.pi * (620 + 40 * np.sin(2 * np.pi * .3 * t)) * t) * 0.05
    pan = np.sin(np.pi * np.clip(t / d, 0, 1)) ** 1.3                  # swells as it passes, then fades
    return (thump * 0.5 + whine) * pan * 0.7


def _reson(x, f, bw):  # 2-pole resonator (formant filter)
    r = np.exp(-np.pi * bw / SR); c = 2 * r * np.cos(2 * np.pi * f / SR)
    y = np.zeros_like(x); y1 = y2 = 0.0
    for i in range(len(x)):
        v = x[i] + c * y1 - r * r * y2; y[i] = v; y2 = y1; y1 = v
    return y * (1 - r)


def _ha_voice(d, f0, start, nsyl, gap, vowel):  # one person's "ha-ha-ha": glottal pulses through vowel formants + breathy "h"
    n = int(SR * d); out = np.zeros(n)
    for k in range(nsyl):
        t0 = start + k * gap * (1 + 0.15 * rng.standard_normal()); L = int(SR * 0.12)
        i0 = int(SR * t0)
        if i0 + L >= n: break
        tt = np.arange(L) / SR; f = f0 * (1.08 - 0.25 * k / nsyl) * (1 + 0.04 * np.sin(2 * np.pi * 7 * tt))
        ph = np.cumsum(f / SR); src = (np.mod(ph, 1.0) - 0.5) * 2               # sawtooth = buzzy vocal folds
        src = src * env(L, SR * 0.02, SR * 0.05) * (0.9 - 0.4 * k / nsyl)
        h = noise(L) * env(L, SR * 0.005, SR * 0.09) * 0.35                       # breath
        v = sum(_reson(src + h, F, B) * g for F, B, g in vowel)
        out[i0:i0 + L] += v
    return out


def laugh(d=1.7):  # two friends cracking up (synthesized; never a recording)
    a = _ha_voice(d, 190, 0.02, 7, 0.17, [(760, 90, 1.0), (1250, 110, 0.6), (2550, 160, 0.25)])
    b = _ha_voice(d, 260, 0.12, 6, 0.19, [(820, 100, 1.0), (1350, 120, 0.55), (2750, 180, 0.22)])
    x = a + 0.85 * b
    return x / (np.max(np.abs(x)) + 1e-9) * 0.6


LIB = dict(whoosh=whoosh, step=step, servo=servo, beep=beep, tap=tap, pop=pop, click=click, plane=plane, hum=hum, clunk=clunk,
           helicopter=helicopter, laugh=laugh)

if __name__ == '__main__':
    ev_file, out, length = sys.argv[1], sys.argv[2], float(sys.argv[3])
    events = json.load(open(ev_file))
    mixbuf = np.zeros(int(SR * (length + 3)))
    cache = {}
    for e in events:
        k = e['sfx']
        if k not in LIB: raise SystemExit('unknown sfx ' + k)
        if k not in cache: cache[k] = LIB[k]()
        s = cache[k] * e.get('gain', 1.0)
        i = int(max(0, e['t']) * SR)
        j = min(len(mixbuf), i + len(s))
        mixbuf[i:j] += s[:j - i]
    mixbuf = mixbuf[:int(SR * length)]
    peak = np.max(np.abs(mixbuf)) or 1
    if peak > 0.95: mixbuf *= 0.95 / peak
    with wave.open(out, 'wb') as w:
        w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR)
        w.writeframes((mixbuf * 32767).astype(np.int16).tobytes())
    print('sfx ->', out, f'({len(events)} events, {length:.1f}s)')
