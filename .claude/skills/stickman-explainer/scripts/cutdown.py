#!/usr/bin/env python3
"""Make a vertical 9:16 Short from a range of scenes of a finished long-form plan.

  python3 cutdown.py videos/<slug>/plan.json --scenes 12-21 --headline "WHY $10 BUYS LESS" \
      [--end-card "FULL STORY ON THE CHANNEL"] [--out shorts/short_01.mp4] [--no-music]

Reuses the long video's clips, 4K stills, per-line voice files and captions (so cuts land between
sentences), and renders 1080x1920 in the "framed" layout: the full 16:9 picture centred on a blurred
copy of itself, the headline above it, captions below it. Chapter cards inside the range are dropped
(they belong to the long video). Writes the sub-plan next to the main plan as plan_<name>.json.
"""
import argparse, copy, json, os, subprocess, sys

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('plan'); ap.add_argument('--scenes', required=True, help='1-based range, e.g. 12-21 (inclusive)')
    ap.add_argument('--headline', required=True); ap.add_argument('--end-card', default='FULL STORY ON THE CHANNEL')
    ap.add_argument('--out'); ap.add_argument('--no-music', action='store_true')
    a = ap.parse_args()
    base = os.path.dirname(os.path.abspath(a.plan)); P = json.load(open(a.plan))
    s, e = (int(x) for x in a.scenes.split('-'))
    shots = copy.deepcopy(P['shots'][s - 1:e])
    if not shots: sys.exit('empty range')
    for sh in shots: sh.pop('title', None)
    name = os.path.splitext(os.path.basename(a.out or f'short_{s:03d}-{e:03d}.mp4'))[0]
    out = a.out or os.path.join('shorts', name + '.mp4'); os.makedirs(os.path.join(base, os.path.dirname(out) or '.'), exist_ok=True)
    Q = {k: v for k, v in P.items() if k not in ('shots', 'out', 'end_card')}
    Q.update(out=out, layout='framed', headline=a.headline, end_card=a.end_card, captions=True, shots=shots)
    Q.pop('caption_y', None); Q.pop('caption_size', None)
    if a.no_music: Q['music'] = None
    sub = os.path.join(base, f'plan_{name}.json'); json.dump(Q, open(sub, 'w'), indent=1, ensure_ascii=False)
    dur = sum(float(x['dur']) for x in shots)
    print(f'{name}: scenes {s}-{e}, {dur:.1f}s' + ('  (over 60s: fine for Shorts up to 3 min, but tighter is better)' if dur > 60 else ''))
    subprocess.run([sys.executable, os.path.join(os.path.dirname(os.path.abspath(__file__)), 'assemble.py'), sub], check=True)

if __name__ == '__main__':
    main()
