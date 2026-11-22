#!/usr/bin/env python3
"""Lay each OpenArt clip's own sound under the shots that show that clip (render.js calls this).
Usage: ambience.py segments.json out.wav length_seconds
segments.json: [{"t0": 2.3, "t1": 4.1, "wav": ".../clips/03_trench_day.wav"}, ...]
The clip audio loops by global time (like the picture), 40 ms fades at every cut, normalized to a quiet bed."""
import json, sys, wave
import numpy as np
SR = 44100
segs, out, L = json.load(open(sys.argv[1])), sys.argv[2], float(sys.argv[3])
mix = np.zeros(int(L * SR) + SR)
cache = {}
def load(p):
    if p not in cache:
        with wave.open(p) as w:
            x = np.frombuffer(w.readframes(w.getnframes()), dtype=np.int16).astype(np.float64) / 32768
        rms = np.sqrt(np.mean(x ** 2)) if len(x) else 0
        cache[p] = x * (0.06 / rms if rms > 1e-5 else 0)   # every clip at the same quiet level
    return cache[p]
F = int(.04 * SR)
for s in segs:
    x = load(s['wav'])
    if not len(x): continue
    a, b = int(s['t0'] * SR), min(int(s['t1'] * SR), len(mix))
    if b <= a: continue
    idx = np.arange(a, b) % len(x)
    seg = x[idx].copy()
    f = min(F, len(seg) // 2)
    if f > 0: seg[:f] *= np.linspace(0, 1, f); seg[-f:] *= np.linspace(1, 0, f)
    mix[a:b] += seg
mix = np.clip(mix[:int(L * SR)], -1, 1)
with wave.open(out, 'w') as w:
    w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR)
    w.writeframes((mix * 32767).astype(np.int16).tobytes())
print('ambience ->', out)
