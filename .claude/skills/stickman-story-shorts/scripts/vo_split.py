#!/usr/bin/env python3
"""Split one full voice-over recording into one file per narration line.

  python3 vo_split.py vo/voice.wav lines.txt [--noise -35] [--min-gap 0.18]

Finds the pauses, expects a boundary after each line in proportion to its word count, and cuts at
the longest pause near each expected boundary (in order). Writes vo/vo_NN.wav and vo/bounds.json:
  {"lines":[{"n":1,"file":"vo/vo_01.wav","start":..,"end":..,"speech":..}, ...]}
Listen to a couple of the cuts; if one is off, re-record with a clearer pause between lines.
"""
import argparse, json, os, re, subprocess

def dur(p):
    r = subprocess.run(['ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', p], capture_output=True, text=True)
    return float(r.stdout.strip())

def silences(p, noise, d):
    r = subprocess.run(['ffmpeg', '-hide_banner', '-i', p, '-af', f'silencedetect=noise={noise}dB:d={d}', '-f', 'null', '-'], capture_output=True, text=True)
    out, s0 = [], None
    for line in r.stderr.splitlines():
        m = re.search(r'silence_start: ([\d.]+)', line)
        if m: s0 = float(m.group(1))
        m = re.search(r'silence_end: ([\d.]+)', line)
        if m and s0 is not None: out.append((s0, float(m.group(1)))); s0 = None
    if s0 is not None: out.append((s0, 1e9))
    return out

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('voice'); ap.add_argument('lines')
    ap.add_argument('--noise', type=float, default=-35); ap.add_argument('--min-gap', type=float, default=0.18)
    a = ap.parse_args()
    lines = [l.strip() for l in open(a.lines, encoding='utf8') if l.strip() and not l.strip().startswith('#')]
    D = dur(a.voice); gaps = silences(a.voice, a.noise, a.min_gap)
    s_start = gaps[0][1] if gaps and gaps[0][0] < 0.05 else 0.0
    s_end = gaps[-1][0] if gaps and gaps[-1][1] >= D - 0.05 else D
    inner = [g for g in gaps if g[0] > s_start + 0.05 and g[1] < s_end - 0.05]
    w = [max(1, len(l.split())) for l in lines]; tot = sum(w); acc = 0
    cuts = []; last = s_start
    for i in range(len(lines) - 1):
        acc += w[i]; exp = s_start + (s_end - s_start) * acc / tot
        cand = [g for g in inner if g[0] > last + 0.3 and abs((g[0] + g[1]) / 2 - exp) < 2.0]
        if cand:
            g = max(cand, key=lambda g: (g[1] - g[0]) - 0.15 * abs((g[0] + g[1]) / 2 - exp)); cuts.append(g); last = g[1]
        else:
            cuts.append((exp, exp)); last = exp
            print(f'warning: no pause found after line {i+1}; cut at estimate {exp:.2f}s')
    outdir = os.path.dirname(os.path.abspath(a.voice)); res = []
    starts = [s_start] + [c[1] for c in cuts]; ends = [c[0] for c in cuts] + [s_end]
    for i, (s, e) in enumerate(zip(starts, ends)):
        f = os.path.join(outdir, f'vo_{i+1:02d}.wav')
        subprocess.run(['ffmpeg', '-nostdin', '-v', 'error', '-y', '-ss', f'{max(0, s-0.05):.3f}', '-to', f'{e+0.08:.3f}', '-i', a.voice, '-ac', '1', '-ar', '48000', f], check=True)
        res.append(dict(n=i + 1, file=os.path.relpath(f), start=round(s, 3), end=round(e, 3), speech=round(e - s, 3), text=lines[i]))
        print(f'{i+1:02d} {s:6.2f}-{e:6.2f} ({e-s:4.2f}s) {lines[i][:60]}')
    json.dump(dict(source=a.voice, lines=res), open(os.path.join(outdir, 'bounds.json'), 'w'), indent=1, ensure_ascii=False)

if __name__ == '__main__':
    main()
