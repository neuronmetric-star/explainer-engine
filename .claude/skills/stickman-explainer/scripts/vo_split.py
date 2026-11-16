#!/usr/bin/env python3
"""Align a voice-over to the script lines and cut one file per line.

  python3 vo_split.py --lines lines_spoken.txt vo/voice.mp3 [vo/ch02.mp3 ...] [--noise -35] [--min-gap 0.15]

Several files (e.g. one per chapter) are joined in order with a 0.6 s gap. The aligner finds every pause,
estimates where each line should end from its share of the spoken text (in speaking time, pauses
excluded), then picks the best set of pauses for ALL boundaries at once (dynamic programming: long
pauses near the expected spot win, order is kept). This is robust to pauses inside lines.

Writes vo/vo_NN.wav (from just before the line's first word to just before the next line, so natural
pauses stay in) and vo/bounds.json. ALWAYS read the printed table: 'ratio' far from 1.0 means a
line probably got cut in the wrong pause; fix those by hand.
"""
import argparse, json, math, os, re, subprocess

def run(cmd): return subprocess.run(cmd, capture_output=True, text=True, stdin=subprocess.DEVNULL)

def dur(p): return float(run(['ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', p]).stdout.strip())

def silences(p, noise, d):
    r = run(['ffmpeg', '-hide_banner', '-i', p, '-af', f'silencedetect=noise={noise}dB:d={d}', '-f', 'null', '-'])
    out, s0 = [], None
    for a, b in re.findall(r'silence_start: ([\d.]+)|silence_end: ([\d.]+)', r.stderr):
        if a: s0 = float(a)
        elif s0 is not None: out.append((s0, float(b))); s0 = None
    if s0 is not None: out.append((s0, 1e9))
    return out

def weight(line):
    return len(re.sub(r'[^A-Za-z0-9]', '', line)) + 6  # spoken characters + a little per line

def main():
    ap = argparse.ArgumentParser(); ap.add_argument('voices', nargs='+'); ap.add_argument('--lines', required=True)
    ap.add_argument('--noise', type=float, default=-35); ap.add_argument('--min-gap', type=float, default=0.15)
    a = ap.parse_args()
    lines = [l.strip() for l in open(a.lines, encoding='utf8') if l.strip() and not l.strip().startswith('#')]
    outdir = os.path.dirname(os.path.abspath(a.voices[0]))
    if len(a.voices) > 1:
        joined = os.path.join(outdir, 'voice_joined.wav'); ins = []; fc = ''
        for i, v in enumerate(a.voices): ins += ['-i', v]; fc += f'[{i}:a]aresample=48000,aformat=channel_layouts=mono,apad=pad_dur=0.6[a{i}];'
        fc += ''.join(f'[a{i}]' for i in range(len(a.voices))) + f'concat=n={len(a.voices)}:v=0:a=1[o]'
        run(['ffmpeg', '-y', *ins, '-filter_complex', fc, '-map', '[o]', joined]); voice = joined
    else:
        voice = a.voices[0]
    D = dur(voice); sil = silences(voice, a.noise, a.min_gap)
    s_start = sil[0][1] if sil and sil[0][0] < 0.05 else 0.0
    s_end = sil[-1][0] if sil and sil[-1][1] >= D - 0.05 else D
    gaps = [g for g in sil if g[0] > s_start + 0.05 and g[1] < s_end - 0.05]
    # speech segments and speaking-time mapping
    segs, t = [], s_start
    for g0, g1 in gaps: segs.append((t, g0)); t = g1
    segs.append((t, s_end)); T = sum(b - a_ for a_, b in segs)
    def wall(st):  # speaking time -> wall time
        for a_, b in segs:
            if st <= b - a_: return a_ + st
            st -= b - a_
        return s_end
    w = [weight(l) for l in lines]; tot = sum(w); N = len(lines)
    exp, acc = [], 0
    for i in range(N - 1): acc += w[i]; exp.append(wall(T * acc / tot))
    avg = T / N
    G = len(gaps); cuts = []
    if G >= N - 1 and N > 1:
        INF = float('inf'); cost = lambda i, j: -math.log(1 + 8 * (gaps[j][1] - gaps[j][0])) + 2.5 * ((((gaps[j][0] + gaps[j][1]) / 2) - exp[i]) / avg) ** 2
        dp = [[INF] * G for _ in range(N - 1)]; bk = [[-1] * G for _ in range(N - 1)]
        for j in range(G): dp[0][j] = cost(0, j)
        for i in range(1, N - 1):
            best, bj = INF, -1
            for j in range(G):
                if j - 1 >= 0 and dp[i - 1][j - 1] < best: best, bj = dp[i - 1][j - 1], j - 1
                if bj >= 0: dp[i][j] = best + cost(i, j); bk[i][j] = bj
        j = min(range(G), key=lambda x: dp[N - 2][x]); sel = []
        for i in range(N - 2, -1, -1): sel.append(j); j = bk[i][j]
        cuts = [gaps[j] for j in reversed(sel)]
    else:
        cuts = [(e, e) for e in exp]; print('warning: fewer pauses than lines; cutting at estimates')
    starts = [s_start] + [c[1] for c in cuts]; ends = [c[0] for c in cuts] + [s_end]
    seg_from = [0.0] + [s - 0.12 for s in starts[1:]]; seg_to = seg_from[1:] + [min(D, s_end + 0.8)]
    res = []
    print(f"{'#':>3} {'start':>7} {'speech':>6} {'expect':>6} {'ratio':>5}  line")
    for i in range(N):
        f = os.path.join(outdir, f'vo_{i + 1:02d}.wav')
        run(['ffmpeg', '-y', '-ss', f'{seg_from[i]:.3f}', '-to', f'{seg_to[i]:.3f}', '-i', voice, '-ac', '1', '-ar', '48000', f])
        sp = ends[i] - starts[i]; ex = T * w[i] / tot; ratio = sp / ex if ex else 0
        flag = '  <-- check' if ratio < 0.6 or ratio > 1.6 else ''
        print(f"{i + 1:>3} {starts[i]:7.2f} {sp:6.2f} {ex:6.2f} {ratio:5.2f}  {lines[i][:55]}{flag}")
        res.append(dict(n=i + 1, file=os.path.relpath(f), start=round(starts[i], 3), end=round(ends[i], 3), speech=round(sp, 3),
                        seg_start=round(seg_from[i], 3), seg_end=round(seg_to[i], 3), text=lines[i]))
    json.dump(dict(source=voice, lines=res), open(os.path.join(outdir, 'bounds.json'), 'w'), indent=1, ensure_ascii=False)

if __name__ == '__main__':
    main()
