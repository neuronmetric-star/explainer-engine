"""Render animated scene clips.
  python3 anim/render.py 1-6            -> clips/s001.mp4 ...  (4 in parallel)
  python3 anim/render.py 1,3 --stills 0,1.5,3   -> sheets/anim_s001.jpg contact strip of test frames
"""
import sys, os, json, time
from multiprocessing import Pool
HERE = os.path.dirname(os.path.abspath(__file__)); EP = os.path.dirname(HERE)
sys.path.insert(0, HERE)
import numpy as np, cv2
import engine, scenes

DUR = {s['n']: s['dur'] for s in json.load(open(os.path.join(EP, 'timing.json')))['shots']}

def default_spec(n):
    return dict(sfx=[])

def spec(n): return scenes.S.get(n) or default_spec(n)

def parse(a):
    out = []
    for part in a.split(','):
        if '-' in part: x, y = map(int, part.split('-')); out += list(range(x, y + 1))
        elif part: out.append(int(part))
    return out

def job(n):
    t = time.time(); os.makedirs(os.path.join(EP, 'clips'), exist_ok=True)
    engine.render(n, spec(n), DUR[n], os.path.join(EP, 'clips', f's{n:03d}.mp4'))
    return n, time.time() - t

def stills(n, ts):
    sc = engine.Scene(n, spec(n)); fr = [cv2.resize(sc.frame(t, DUR[n]), (640, 360), interpolation=cv2.INTER_AREA) for t in ts]
    for f, t in zip(fr, ts): cv2.putText(f, f'{n:03d} t={t:.1f}', (8, 26), 0, 0.8, (0, 255, 255), 2)
    return np.hstack(fr)

if __name__ == '__main__':
    ns = parse(sys.argv[1])
    if '--stills' in sys.argv:
        ts = [float(x) for x in sys.argv[sys.argv.index('--stills') + 1].split(',')]
        os.makedirs(os.path.join(EP, 'sheets'), exist_ok=True)
        rows = [stills(n, [min(t, DUR[n] - 0.05) for t in ts]) for n in ns]
        out = os.path.join(EP, 'sheets', f'anim_{ns[0]:03d}-{ns[-1]:03d}.jpg'); cv2.imwrite(out, np.vstack(rows), [cv2.IMWRITE_JPEG_QUALITY, 85]); print(out)
    else:
        with Pool(int(os.environ.get('JOBS', 4))) as p:
            for n, dt in p.imap_unordered(job, ns): print(f'scene {n:03d} done in {dt:.0f}s', flush=True)
