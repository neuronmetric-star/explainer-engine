#!/usr/bin/env python3
"""Synthesize a sound-effects track for a 3D-engine video: videos/<slug>/sfx.json -> videos/<slug>/sfx.wav
Usage: python3 tools/sfx.py <slug> [tail_seconds]

sfx.json: [{"at": "clank+0.05", "type": "clank", "gain": 1.0}, {"from": "q", "to": "barriers", "type": "rumble"}, ...]
  "at"/"from"/"to" are cue names with optional +/- seconds (same as scene.js), or plain seconds.
Types: twang (bow string), whoosh (arrow flight, "dur"), clank (arrow into a wooden board), thunk (arrow into a target),
       ding (bright reward chime), pop, rumble (sliding wood, a span), ambience (birds + breeze, a span; default whole video).
       Basketball: bounce (ball on the court), rim (ball clanks off a metal rim), board (ball bangs the backboard),
       swish (ball through the net), buzzer (end-of-clock horn).
The track is normalized to -3 dBFS peak; tools/render.js mixes it UNDER the voice and ducks it while he speaks (mix rule).
"""
import json, re, subprocess, sys, wave, os
import numpy as np

SR = 44100
rng = np.random.default_rng(7)

def env(n, a=0.005, d=0.3):
    t = np.arange(n) / SR
    return np.minimum(1, t / max(a, 1e-4)) * np.exp(-t / d)

def lp(x, k):  # simple low-pass by moving average of width k samples
    if k <= 1: return x
    c = np.cumsum(np.insert(x, 0, 0.0)); y = (c[k:] - c[:-k]) / k
    return np.concatenate([y, np.zeros(k - 1)])

def twang(gain=1):
    n = int(.6 * SR); t = np.arange(n) / SR
    f = 110 * (1 + .04 * np.exp(-t * 30))
    s = sum(np.sin(2 * np.pi * f * h * t) / h for h in (1, 2, 3, 5)) * env(n, .002, .18)
    s += rng.standard_normal(n) * env(n, .0005, .01) * .6       # string snap
    return s * .6 * gain

def whoosh(dur=.5, gain=1):
    n = int(dur * SR); t = np.arange(n) / SR
    x = rng.standard_normal(n); y = np.zeros(n)
    for i, k in enumerate((40, 20, 10, 6)):                       # brightening sweep
        seg = lp(x, k); w = np.clip(1 - abs(t / dur - (i + .5) / 4) * 3, 0, 1); y += seg * w
    return y * np.sin(np.pi * t / dur) ** 2 * .9 * gain

def clank(gain=1):
    n = int(.5 * SR); t = np.arange(n) / SR
    thud = np.sin(2 * np.pi * (95 - 40 * t) * t) * env(n, .001, .09)
    knock = lp(rng.standard_normal(n), 3) * env(n, .0005, .03)
    ring = sum(np.sin(2 * np.pi * f * t) * a for f, a in ((620, .35), (1480, .2), (2350, .12))) * env(n, .001, .12)
    return (thud * 1.1 + knock * .8 + ring) * .8 * gain

def thunk(gain=1):
    n = int(.9 * SR); t = np.arange(n) / SR
    thud = np.sin(2 * np.pi * (75 - 25 * t) * t) * env(n, .001, .12)
    straw = lp(rng.standard_normal(n), 6) * env(n, .001, .05)
    boing = np.sin(2 * np.pi * 180 * t) * (1 + .5 * np.sin(2 * np.pi * 14 * t)) * env(n, .01, .35) * .35
    return (thud * 1.2 + straw * .6 + boing) * .8 * gain

def ding(gain=1):
    n = int(1.2 * SR); t = np.arange(n) / SR
    return sum(np.sin(2 * np.pi * f * t) * a for f, a in ((1568, .5), (2349, .3), (3136, .15))) * env(n, .002, .4) * .5 * gain

def pop(gain=1):
    n = int(.15 * SR); t = np.arange(n) / SR
    return np.sin(2 * np.pi * (600 - 2500 * t) * t) * env(n, .001, .03) * .6 * gain

def rumble(dur, gain=1):
    n = int(dur * SR); t = np.arange(n) / SR
    y = lp(rng.standard_normal(n), 60) * 6 * (1 + .4 * np.sin(2 * np.pi * .8 * t))
    fade = np.minimum(1, np.minimum(t / .3, (dur - t) / .3))
    return y * fade * .25 * gain

def ambience(dur, gain=1):
    n = int(dur * SR); t = np.arange(n) / SR
    breeze = lp(rng.standard_normal(n), 120) * 8 * (1 + .5 * np.sin(2 * np.pi * .07 * t))
    y = breeze * .06
    for start in np.arange(1.0, dur - 1, 3.7):                     # little bird chirps
        st = start + rng.uniform(0, 1.5); m = int(.12 * SR); i0 = int(st * SR)
        if i0 + m >= n: break
        tt = np.arange(m) / SR; f = rng.uniform(2800, 4200) + 2500 * tt / .12
        y[i0:i0 + m] += np.sin(2 * np.pi * f * tt) * np.sin(np.pi * tt / .12) ** 2 * .05
    return y * gain

def bounce(gain=1):
    n = int(.35 * SR); t = np.arange(n) / SR
    thump = np.sin(2 * np.pi * (140 - 70 * t / .35) * t) * env(n, .001, .06)
    slap = lp(rng.standard_normal(n), 4) * env(n, .0005, .012) * .7
    ring = np.sin(2 * np.pi * 420 * t) * env(n, .001, .05) * .25           # hollow ball ping
    return (thump * 1.2 + slap + ring) * .8 * gain

def rim(gain=1):
    n = int(1.1 * SR); t = np.arange(n) / SR
    hit = lp(rng.standard_normal(n), 2) * env(n, .0003, .01)
    ring = sum(np.sin(2 * np.pi * f * t) * a * np.exp(-t / d) for f, a, d in ((523, .5, .35), (1187, .35, .25), (1873, .25, .18), (2671, .15, .12)))
    thud = np.sin(2 * np.pi * 120 * t) * env(n, .001, .05)
    return (hit * .6 + ring * .8 + thud * .6) * .8 * gain

def board(gain=1):
    n = int(.6 * SR); t = np.arange(n) / SR
    bang = lp(rng.standard_normal(n), 3) * env(n, .0004, .03)
    body = sum(np.sin(2 * np.pi * f * t) * a for f, a in ((95, .9), (180, .5), (310, .3))) * env(n, .001, .1)
    rattle = np.sin(2 * np.pi * 740 * t) * (1 + np.sin(2 * np.pi * 31 * t)) * env(n, .002, .15) * .12
    return (bang * .9 + body + rattle) * .8 * gain

def swish(gain=1):
    n = int(.45 * SR); t = np.arange(n) / SR
    x = rng.standard_normal(n); hi = x - lp(x, 6)                            # bright noise = net rustle
    return hi * np.sin(np.pi * np.clip(t / .45, 0, 1)) ** 1.5 * (1 + .4 * np.sin(2 * np.pi * 22 * t)) * .7 * gain

def buzzer(gain=1):
    n = int(1.3 * SR); t = np.arange(n) / SR
    s = np.sign(np.sin(2 * np.pi * 220 * t)) * .5 + np.sign(np.sin(2 * np.pi * 277 * t)) * .3
    s = lp(s, 8) * np.minimum(1, t / .02) * np.minimum(1, (1.3 - t) / .05)
    return s * .55 * gain

def main():
    slug = sys.argv[1]; tail = float(sys.argv[2]) if len(sys.argv) > 2 else 2.6
    root = os.path.join(os.path.dirname(__file__), '..'); vdir = os.path.join(root, 'videos', slug)
    cues = json.loads(subprocess.check_output(['node', os.path.join(root, 'tools', 'cuetimes.js'), slug]))
    def T(x):
        if isinstance(x, (int, float)): return float(x)
        m = re.match(r'^([\w-]+)([+-][\d.]+)?$', x); return cues[m.group(1)] + (float(m.group(2)) if m.group(2) else 0)
    total = cues['_end'] + tail; out = np.zeros(int(total * SR) + SR)
    def add(sig, at):
        i = int(max(0, at) * SR); j = min(len(out), i + len(sig)); out[i:j] += sig[:j - i]
    evs = json.load(open(os.path.join(vdir, 'sfx.json')))
    if not any(e['type'] == 'ambience' for e in evs): evs.append({'type': 'ambience', 'from': 0, 'to': total})
    for e in evs:
        g = e.get('gain', 1); ty = e['type']
        if ty in ('rumble', 'ambience'):
            a, b = T(e.get('from', 0)), T(e.get('to', total)); add((rumble if ty == 'rumble' else ambience)(b - a, g), a)
        elif ty == 'whoosh': add(whoosh(e.get('dur', .5), g), T(e['at']))
        else: add({'twang': twang, 'clank': clank, 'thunk': thunk, 'ding': ding, 'pop': pop, 'bounce': bounce, 'rim': rim, 'board': board, 'swish': swish, 'buzzer': buzzer}[ty](g), T(e['at']))
    out = out[:int(total * SR)]; out = out / max(1e-6, np.abs(out).max()) * 10 ** (-3 / 20)
    with wave.open(os.path.join(vdir, 'sfx.wav'), 'wb') as w:
        w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR); w.writeframes((out * 32767).astype('<i2').tobytes())
    print('sfx ->', os.path.relpath(os.path.join(vdir, 'sfx.wav'), root), f'({total:.1f}s, {len(evs)} events)')

if __name__ == '__main__':
    main()
