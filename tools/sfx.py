#!/usr/bin/env python3
"""Synthesize and mix sound effects (no downloads, no credits).
Usage: sfx.py events.json out.wav length_seconds
events.json: [{"t": 1.23, "sfx": "whoosh", "gain": 0.5}, {"t": 5, "file": "clip.wav", "from": 0, "dur": 2.5, "gain": .6}, ...]
Library: ring, whoosh, step, servo, beep, tap, pop, click, plane, hum, clunk."""
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


def ring(d=0.7):  # alarm clock bell: fast hammer on two bright tones
    n = int(SR * d); t = np.arange(n) / SR
    tone = np.sin(2 * np.pi * 2100 * t) + .6 * np.sin(2 * np.pi * 3150 * t) + .3 * np.sin(2 * np.pi * 4400 * t)
    ham = (np.sin(2 * np.pi * 22 * t) > 0).astype(float) * np.exp(-((t * 22) % 1) * 6)
    return tone * ham * env(n, SR * .005, SR * .08) * 0.35


def load_wav(path):  # mono float, resampled naively to SR if needed
    with wave.open(path, 'rb') as w:
        sr, ch, sw = w.getframerate(), w.getnchannels(), w.getsampwidth()
        x = np.frombuffer(w.readframes(w.getnframes()), dtype=np.int16).astype(float) / 32768
    if ch > 1: x = x.reshape(-1, ch).mean(axis=1)
    if sr != SR: x = np.interp(np.arange(int(len(x) * SR / sr)) * sr / SR, np.arange(len(x)), x)
    return x


LIB = dict(ring=ring, whoosh=whoosh, step=step, servo=servo, beep=beep, tap=tap, pop=pop, click=click, plane=plane, hum=hum, clunk=clunk)

if __name__ == '__main__':
    ev_file, out, length = sys.argv[1], sys.argv[2], float(sys.argv[3])
    events = json.load(open(ev_file))
    mixbuf = np.zeros(int(SR * (length + 3)))
    cache = {}
    for e in events:
        k = e.get('sfx')
        if e.get('file'):   # a slice of a recorded track: {file, from, dur, fade}
            if e['file'] not in cache: cache[e['file']] = load_wav(e['file'])
            x = cache[e['file']]; a0 = int(e.get('from', 0) * SR); n = int(e.get('dur', len(x) / SR) * SR)
            s = x[a0:a0 + n].copy(); f = max(1, int(e.get('fade', .03) * SR)); f = min(f, len(s) // 2 or 1)
            s[:f] *= np.linspace(0, 1, f); s[-f:] *= np.linspace(1, 0, f); s *= e.get('gain', 1.0)
        else:
            if k not in LIB: raise SystemExit('unknown sfx ' + str(k))
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
