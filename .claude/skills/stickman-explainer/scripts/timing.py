#!/usr/bin/env python3
"""Shot timing from the narration lines.

lines.txt: one narration line per row (blank rows and rows starting with # are ignored).

  python3 timing.py lines.txt [--wps 2.7] [--pad 0.25] [--from-vo vo/bounds.json] [--out DIR]

Writes timing.json (per shot: n, text, words, speech, dur, start, gen) and timing.md, a table the
voice-over artist reads against. Without --from-vo, speech = words / wps (numbers count extra).
With --from-vo, speech comes from the real per-line audio (vo_split.py output).
gen = clip length to request: max(4, ceil(speech + 1)), capped at 8.
"""
import argparse, json, math, os, re

def read_lines(p):
    return [l.strip() for l in open(p, encoding='utf8') if l.strip() and not l.strip().startswith('#')]

def spoken_words(t):
    w = re.findall(r"[\w'’$%.,-]+", t)
    n = 0
    for x in w:
        digits = re.sub(r'\D', '', x)
        n += 1 + (max(0, len(digits) - 1) * 0.6 if digits else 0)  # "1696" is read as several words
    return n

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('lines'); ap.add_argument('--wps', type=float, default=2.7)
    ap.add_argument('--pad', type=float, default=0.25); ap.add_argument('--from-vo')
    ap.add_argument('--out', default=None)
    a = ap.parse_args()
    out = a.out or os.path.dirname(os.path.abspath(a.lines))
    lines = read_lines(a.lines)
    vo = json.load(open(a.from_vo)) if a.from_vo else None
    if vo and len(vo['lines']) != len(lines):
        raise SystemExit(f'{len(lines)} lines but {len(vo["lines"])} voice segments')
    t = 0.0; shots = []
    for i, text in enumerate(lines):
        words = spoken_words(text)
        L = vo['lines'][i] if vo else None
        speech = L['speech'] if vo else words / a.wps
        # with a voice-over, each shot lasts exactly its voice segment (line start to next line start)
        dur = round(L['seg_end'] - L['seg_start'], 3) if (vo and 'seg_end' in L) else round(max(1.2, speech + a.pad), 2)
        gen = int(min(8, max(4, math.ceil(speech + 1))))
        shots.append(dict(n=i + 1, text=text, words=round(words, 1), speech=round(speech, 2), dur=dur, start=round(t, 2), gen=gen))
        t += dur
    json.dump(dict(total=round(t, 2), wps=a.wps, source='vo' if vo else 'estimate', shots=shots),
              open(os.path.join(out, 'timing.json'), 'w'), indent=1, ensure_ascii=False)
    md = ['# Voice-over timing sheet', '',
          f'Total: **{t:.1f} s**. ' + ('Timed to your recording.' if vo else
          f'Estimated at {a.wps} words/s. Read each line so it starts at its time; leave a short pause (~0.3 s) between lines.'),
          '', '| # | Starts | Length | Line |', '|---|---|---|---|']
    for s in shots:
        md.append(f"| {s['n']} | {int(s['start']//60)}:{s['start']%60:05.2f} | {s['dur']:.1f}s | {s['text']} |")
    open(os.path.join(out, 'timing.md'), 'w', encoding='utf8').write('\n'.join(md) + '\n')
    print(f'{len(shots)} shots, {t:.1f}s total ->', os.path.join(out, 'timing.json'))

if __name__ == '__main__':
    main()
