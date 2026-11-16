"""Synthesised sound effects (no samples, no licences). All mono float32 at 48 kHz.
python3 sfx.py OUTDIR  -> writes every effect as a wav for listening."""
import sys, os, wave
import numpy as np

SR = 48000
rng = np.random.default_rng(7)

def t_(d): return np.arange(int(d * SR)) / SR

def env(n, a=0.005, r=None, d=None):
    """attack + exponential decay envelope (r = decay time constant)"""
    x = np.ones(n, np.float32)
    na = max(1, int(a * SR)); x[:na] = np.linspace(0, 1, na)
    if r: x[na:] *= np.exp(-np.arange(n - na) / (r * SR))
    return x

def noise(d): return rng.standard_normal(int(d * SR)).astype(np.float32)

def brown(d):
    x = np.cumsum(noise(d)); x -= np.convolve(x, np.ones(2001) / 2001, 'same'); return x / (np.abs(x).max() + 1e-9)

def bandpass(x, lo, hi):
    X = np.fft.rfft(x); f = np.fft.rfftfreq(len(x), 1 / SR)
    m = np.ones_like(f)
    if lo: m *= 1 / (1 + (lo / np.maximum(f, 1)) ** 4)
    if hi: m *= 1 / (1 + (f / hi) ** 4)
    return np.fft.irfft(X * m, len(x)).astype(np.float32)

def sweep_filter(x, c0, c1, q=1.2, shape=None):
    """time-varying band-pass via short FFT frames; centre moves c0->c1 (or follows shape 0..1)."""
    n = len(x); hop = 512; win = np.hanning(2048).astype(np.float32); out = np.zeros(n + 2048, np.float32)
    f = np.fft.rfftfreq(2048, 1 / SR)
    for i in range(0, n, hop):
        seg = np.zeros(2048, np.float32); s = x[i:i + 2048]; seg[:len(s)] = s
        p = i / max(1, n); p = shape(p) if shape else p
        c = c0 * (c1 / c0) ** p
        m = np.exp(-0.5 * (np.log2(np.maximum(f, 1) / c) / q) ** 2)
        out[i:i + 2048] += np.fft.irfft(np.fft.rfft(seg * win) * m, 2048).astype(np.float32) * win
    return out[:n] / 1.5

def norm(x, peak=0.9):
    return (x / (np.abs(x).max() + 1e-9) * peak).astype(np.float32)

def partials(d, freqs, decays, amps=None):
    t = t_(d); y = np.zeros_like(t)
    for i, (f, dc) in enumerate(zip(freqs, decays)):
        a = amps[i] if amps else 1 / (i + 1)
        y += a * np.sin(2 * np.pi * f * t + rng.uniform(0, 6)) * np.exp(-t / dc)
    return y.astype(np.float32)

# ---------------------------------------------------------------- library
def tick(f=3200):
    d = 0.06; y = partials(d, [f, f * 1.51, f * 2.3], [0.012, 0.008, 0.005]) + bandpass(noise(d), 2000, 9000) * env(int(d * SR), 0.0005, 0.004) * 0.6
    return norm(y, 0.7)

def tock(): return tick(2100)

def whoosh(d=0.55, lo=250, hi=2400):
    n = int(d * SR); x = noise(d)
    shape = lambda p: np.sin(np.pi * p) ** 0.8
    y = sweep_filter(x, lo, hi, 1.0, shape)
    e = np.sin(np.pi * np.linspace(0, 1, n)) ** 1.6
    return norm(y * e, 0.8)

def whip(): return whoosh(0.28, 400, 4000)

def pop():
    d = 0.12; t = t_(d); f = 900 * np.exp(-t * 22) + 250
    y = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t / 0.035)
    return norm(y + bandpass(noise(d), 1000, 6000) * env(len(t), 0.0005, 0.003) * 0.5, 0.8)

def boing(d=0.6):
    t = t_(d); f = 180 + 120 * np.exp(-t * 4) * (1 + 0.35 * np.sin(2 * np.pi * 14 * t))
    y = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t / 0.22)
    return norm(y, 0.7)

def paper(d=0.6):
    n = int(d * SR); x = bandpass(noise(d), 1800, 9000)
    crack = np.clip(rng.standard_normal(n // 240 + 1), 0, None) ** 2
    e = np.repeat(crack, 240)[:n]; e = np.convolve(e, np.hanning(200) / 100, 'same')
    return norm(x * e * np.sin(np.pi * np.linspace(0, 1, n)) ** 0.5, 0.6)

def tear(d=0.45):
    n = int(d * SR); x = bandpass(noise(d), 900, 7000)
    jag = np.abs(rng.standard_normal(n // 120 + 1)); e = np.repeat(jag, 120)[:n]
    return norm(x * e * np.linspace(1, 0.3, n), 0.75)

def scribble(d=1.0):
    n = int(d * SR); x = bandpass(noise(d), 2500, 6000)
    t = np.arange(n) / SR; e = (0.55 + 0.45 * np.sin(2 * np.pi * 5.5 * t + 2 * np.sin(2 * np.pi * 1.3 * t))) ** 2
    return norm(x * e * env(n, 0.02) * np.linspace(1, 0.8, n), 0.35)

def bell_ring(f=1180, d=1.6):
    y = partials(d, [f, f * 2.76, f * 5.40, f * 8.93], [0.9, 0.5, 0.25, 0.12], [1, 0.6, 0.35, 0.2])
    return norm(y * env(len(y), 0.001), 0.7)

def ding(): return bell_ring(1560, 1.2)

def cash():
    clack = bandpass(noise(0.08), 300, 3000) * env(int(0.08 * SR), 0.001, 0.015)
    b = bell_ring(2100, 1.3) * 0.8
    y = np.zeros(int(1.45 * SR), np.float32); y[:len(clack)] += clack; y[int(0.09 * SR):int(0.09 * SR) + len(b)] += b
    return norm(y, 0.75)

def coin():
    y = partials(0.6, [4200, 6350, 8900, 11200], [0.25, 0.15, 0.08, 0.05])
    return norm(y * env(len(y), 0.0005), 0.55)

def coin_spin(d=2.4):
    y = np.zeros(int(d * SR), np.float32); t = 0.0; gap = 0.16
    while t < d - 0.3:
        c = coin() * (0.4 + 0.6 * (t / d)); i = int(t * SR); y[i:i + len(c)] += c[:len(y) - i]
        t += gap; gap = max(0.035, gap * 0.9)
    return norm(y, 0.6)

def clap():
    d = 0.06; return bandpass(noise(d), 800, 3500) * env(int(d * SR), 0.0008, 0.009)

def applause(d=3.0, rate=38):
    n = int(d * SR); y = np.zeros(n + SR, np.float32)
    k = int(rate * d)
    for tt in np.sort(rng.uniform(0, d, k)):
        c = clap() * rng.uniform(0.3, 1.0); i = int(tt * SR); y[i:i + len(c)] += c
    y = y[:n] * np.minimum(1, np.minimum(np.linspace(0, 6, n), np.linspace(4, 0, n)))
    return norm(y, 0.6)

def rumble(d=2.0, lp=140):
    return norm(bandpass(brown(d), 25, lp) * env(int(d * SR), 0.2), 0.8)

def rocket(d=3.0):
    n = int(d * SR); low = bandpass(brown(d), 25, 200); roar = bandpass(noise(d), 200, 2500) * 0.35
    crackle = (np.abs(rng.standard_normal(n)) > 3.2).astype(np.float32) * rng.standard_normal(n) * 0.6
    return norm((low + roar + bandpass(crackle, 800, 8000)) * np.minimum(1, np.linspace(0, 3, n)), 0.85)

def sputter(d=2.2):
    y = rocket(d); n = len(y); t = np.arange(n) / SR
    gate = (np.sin(2 * np.pi * (3 + 9 * t / d) * t) > -0.2 + 0.9 * t / d).astype(np.float32)
    gate = np.convolve(gate, np.hanning(600) / 300, 'same')
    return norm(y * gate * np.linspace(1, 0.15, n), 0.8)

def thud(f=58):
    d = 0.5; t = t_(d); y = np.sin(2 * np.pi * f * t * (1 - 0.3 * t)) * np.exp(-t / 0.11)
    return norm(y + bandpass(noise(d), 80, 900) * env(len(t), 0.001, 0.03) * 0.5, 0.9)

def slam():
    y = thud(52); m = partials(0.6, [420, 1130, 2350], [0.18, 0.1, 0.06]) * 0.4
    y = np.pad(y, (0, max(0, len(m) - len(y)))); y[:len(m)] += m
    return norm(y, 0.95)

def impact(d=1.6):
    t = t_(d); y = np.sin(2 * np.pi * 42 * t * (1 - 0.25 * t)) * np.exp(-t / 0.45)
    return norm(y + bandpass(brown(d), 30, 300) * np.exp(-t / 0.5) * 0.6, 0.95)

def hum(d=4.0):
    t = t_(d); y = 0.5 * np.sin(2 * np.pi * 60 * t) + 0.3 * np.sin(2 * np.pi * 120 * t) + 0.15 * np.sin(2 * np.pi * 180 * t)
    y = y + bandpass(noise(d), 100, 1500) * 0.25
    return norm(y * (1 + 0.1 * np.sin(2 * np.pi * 0.7 * t)), 0.5)

def servo(d=0.8, f0=520, f1=880):
    t = t_(d); f = f0 + (f1 - f0) * np.sin(np.pi * t / d) ** 2
    ph = 2 * np.pi * np.cumsum(f) / SR
    y = np.sin(ph) + 0.4 * np.sin(2 * ph) + 0.2 * np.sin(3 * ph)
    return norm(y * np.sin(np.pi * t / d) ** 0.6 + bandpass(noise(d), 2000, 6000) * 0.08, 0.45)

def clank():
    y = partials(0.7, [310, 870, 1530, 2650], [0.25, 0.14, 0.09, 0.05])
    return norm(y * env(len(y), 0.0005) + bandpass(noise(0.7), 500, 5000) * env(len(y), 0.0005, 0.01), 0.75)

def rain(d=4.0):
    n = int(d * SR); y = bandpass(noise(d), 1200, 9000) * 0.5
    drops = (rng.random(n) > 0.9985).astype(np.float32) * rng.uniform(0.2, 1, n)
    y += bandpass(drops, 1500, 7000) * 3
    return norm(y * np.minimum(1, np.linspace(0, 4, n)), 0.55)

def thunder(d=3.5):
    t = t_(d); y = bandpass(brown(d), 25, 400) * np.exp(-t / 1.1) * (1 + 0.6 * np.sin(2 * np.pi * 3 * t) * np.exp(-t))
    crack = bandpass(noise(0.25), 500, 6000) * env(int(0.25 * SR), 0.001, 0.05)
    y[:len(crack)] += crack * 0.8
    return norm(y, 0.9)

def zap(d=0.7):
    n = int(d * SR); t = np.arange(n) / SR
    buzz = np.sign(np.sin(2 * np.pi * 120 * t)) * 0.3
    spikes = (rng.random(n) > 0.995).astype(np.float32) * rng.standard_normal(n) * 4
    y = bandpass(spikes, 600, 9000) + buzz * bandpass(noise(d), 200, 4000)
    gate = np.repeat((rng.random(n // 1200 + 1) > 0.35).astype(np.float32), 1200)[:n]
    return norm(y * np.convolve(gate, np.hanning(300) / 150, 'same'), 0.6)

def heartbeat():
    y = np.zeros(int(0.9 * SR), np.float32)
    for off, a in ((0, 1.0), (0.22, 0.7)):
        b = thud(48) * a; i = int(off * SR); y[i:i + len(b)] += b[:len(y) - i]
    return norm(y, 0.8)

def wind(d=4.0):
    n = int(d * SR); t = np.arange(n) / SR
    y = sweep_filter(noise(d), 300, 900, 0.8, lambda p: 0.5 + 0.5 * np.sin(2 * np.pi * 1.7 * p))
    return norm(y * (0.6 + 0.4 * np.sin(2 * np.pi * 0.35 * t)) * np.minimum(1, np.linspace(0, 3, n)), 0.5)

def engine(d=1.6, f0=70, f1=190):
    t = t_(d); f = f0 + (f1 - f0) * (1 - np.exp(-t * 2.2))
    ph = 2 * np.pi * np.cumsum(f) / SR
    saw = sum(np.sin(k * ph) / k for k in range(1, 12))
    y = bandpass(saw.astype(np.float32), 40, 1800) + bandpass(noise(d), 100, 1200) * 0.2
    return norm(y * env(len(t), 0.05), 0.75)

def zoom_by(d=1.4):
    t = t_(d); c = d * 0.45
    f = 140 * (1 + 0.35 * np.tanh((c - t) * 4))
    ph = 2 * np.pi * np.cumsum(f) / SR; saw = sum(np.sin(k * ph) / k for k in range(1, 10))
    e = 1 / (1 + ((t - c) / 0.18) ** 2)
    y = bandpass(saw.astype(np.float32), 40, 2500) * e + whoosh(d, 300, 2500) * 0.5
    return norm(y, 0.85)

def electric_hum(d=4.0):
    t = t_(d); y = np.sign(np.sin(2 * np.pi * 120 * t)) * 0.2 + np.sin(2 * np.pi * 240 * t) * 0.2
    return norm(bandpass(y.astype(np.float32), 80, 3000), 0.4)

def sparkle(d=1.2, k=9):
    y = np.zeros(int(d * SR), np.float32)
    for tt in np.sort(rng.uniform(0, d - 0.3, k)):
        f = rng.uniform(2500, 6500); c = partials(0.3, [f, f * 2.01], [0.06, 0.03]); i = int(tt * SR)
        y[i:i + len(c)] += c[:len(y) - i] * rng.uniform(0.3, 1)
    return norm(y, 0.45)

def riser(d=2.0):
    t = t_(d); n = len(t); y = sweep_filter(noise(d), 300, 4000, 0.7) * np.linspace(0, 1, n) ** 2
    tone = np.sin(2 * np.pi * np.cumsum(200 + 500 * (t / d) ** 2) / SR) * np.linspace(0, 1, n) ** 2 * 0.3
    return norm(y + tone, 0.6)

def cards(d=1.2):
    y = np.zeros(int(d * SR), np.float32); tt = 0.0
    while tt < d - 0.05:
        c = bandpass(noise(0.025), 1500, 7000) * env(int(0.025 * SR), 0.0005, 0.005) * rng.uniform(0.3, 1)
        i = int(tt * SR); y[i:i + len(c)] += c[:len(y) - i]; tt += rng.uniform(0.01, 0.05)
    return norm(y * np.linspace(1, 0.4, len(y)), 0.55)

def crumple(d=0.8): return norm(paper(d) + tear(d) * 0.4, 0.6)

def chime_up():
    y = np.zeros(int(1.0 * SR), np.float32)
    for k, f in enumerate([1046, 1318, 1568]):
        c = bell_ring(f, 0.7) * 0.6; i = int(k * 0.09 * SR); y[i:i + len(c)] += c[:len(y) - i]
    return norm(y, 0.55)

def sad_trombone_free():          # gentle "uh-oh" two-note descending tone (no melody quote)
    y = np.zeros(int(1.1 * SR), np.float32)
    for k, f in enumerate([392, 311]):
        t = t_(0.5); c = np.sin(2 * np.pi * f * t) * np.sin(np.pi * t / 0.5) * 0.5; i = int(k * 0.45 * SR); y[i:i + len(c)] += c
    return norm(y, 0.45)

def pour(d=1.4):
    n = int(d * SR); y = bandpass(noise(d), 400, 3000)
    g = np.repeat(rng.random(n // 300 + 1), 300)[:n]
    return norm(y * (0.5 + 0.5 * g) * np.sin(np.pi * np.linspace(0, 1, n)), 0.4)

def footsteps(d=2.0, rate=2.2):
    y = np.zeros(int(d * SR), np.float32); tt = 0.1
    while tt < d - 0.2:
        s = thud(90) * 0.5 + bandpass(noise(0.1), 300, 3000)[:int(0.1 * SR)].sum() * 0; i = int(tt * SR); y[i:i + len(s)] += s[:len(y) - i]; tt += 1 / rate
    return norm(y, 0.5)

LIB = dict(tick=tick, tock=tock, whoosh=whoosh, whip=whip, pop=pop, boing=boing, paper=paper, tear=tear,
           scribble=scribble, bell=bell_ring, ding=ding, cash=cash, coin=coin, coin_spin=coin_spin, applause=applause,
           rumble=rumble, rocket=rocket, sputter=sputter, thud=thud, slam=slam, impact=impact, hum=hum, servo=servo,
           clank=clank, rain=rain, thunder=thunder, zap=zap, heartbeat=heartbeat, wind=wind, engine=engine,
           zoom_by=zoom_by, electric_hum=electric_hum, sparkle=sparkle, riser=riser, cards=cards, crumple=crumple,
           chime_up=chime_up, uh_oh=sad_trombone_free, pour=pour, footsteps=footsteps)

_cache = {}
def get(name, **kw):
    key = (name, tuple(sorted(kw.items())))
    if key not in _cache: _cache[key] = LIB[name](**kw)
    return _cache[key]

def mix(events, dur):
    """events: [(name, t, gain_db, {kwargs})] -> float32 mono of length dur"""
    out = np.zeros(int(dur * SR) + 1, np.float32)
    for ev in events:
        name, t, g = ev[0], ev[1], ev[2]; kw = ev[3] if len(ev) > 3 else {}
        x = get(name, **kw) * (10 ** (g / 20)); i = int(max(0, t) * SR)
        if i >= len(out): continue
        out[i:i + len(x)] += x[:len(out) - i]
    # gentle fades to avoid clicks at cuts
    f = int(0.015 * SR); out[:f] *= np.linspace(0, 1, f); out[-f:] *= np.linspace(1, 0, f)
    return np.clip(out, -1, 1)

def write_wav(path, x):
    x16 = (np.clip(x, -1, 1) * 32767).astype(np.int16)
    with wave.open(path, 'wb') as w:
        w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR); w.writeframes(x16.tobytes())

if __name__ == '__main__':
    od = sys.argv[1]; os.makedirs(od, exist_ok=True)
    for k in LIB: write_wav(os.path.join(od, k + '.wav'), LIB[k]()); print(k)
