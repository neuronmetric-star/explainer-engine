"""Write plan.json (or plan_preview.json) for assemble.py from timing + bible + rendered clips.
  python3 anim/make_plan.py [first-last] [--out plan_preview.json] [--final-name preview.mp4]"""
import json, os, sys
EP = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
T = json.load(open(os.path.join(EP, 'timing.json')))['shots']
B = {s['n']: s for s in json.load(open(os.path.join(EP, 'bible.json')))['scenes']}
VO = {x['n']: x for x in json.load(open(os.path.join(EP, 'vo', 'bounds.json')))['lines']}
CHAPTER_CARDS = {22: 'Chapter 1: The Rich-Person Toy', 32: 'Chapter 2: Three Days Left',
                 52: 'Chapter 3: The Real Car', 65: 'Chapter 4: Production Hell'}

def main():
    a, b = 1, 88
    if len(sys.argv) > 1 and '-' in sys.argv[1] and not sys.argv[1].startswith('--'):
        a, b = map(int, sys.argv[1].split('-'))
    out = sys.argv[sys.argv.index('--out') + 1] if '--out' in sys.argv else 'plan.json'
    final = sys.argv[sys.argv.index('--final-name') + 1] if '--final-name' in sys.argv else 'final.mp4'
    shots = []
    for s in T:
        n = s['n']
        if not a <= n <= b: continue
        clip = f'clips/s{n:03d}.mp4'
        if not os.path.exists(os.path.join(EP, clip)): clip = f'images/scene_{n:03d}.png'
        sh = dict(clip=clip, dur=round(s['dur'], 3), text=B[n]['line'], vo=VO[n]['file'], sfx=1.0)
        if n in CHAPTER_CARDS: sh['title'] = CHAPTER_CARDS[n]; sh['title_dur'] = 2.0
        shots.append(sh)
    plan = dict(out=final, width=1920, height=1080, fps=30, sfx_volume=0.55, vo_volume=1.7, captions=True, music=None, end_card='FOLLOW FOR MORE', end_card_dur=2.4, shots=shots)
    json.dump(plan, open(os.path.join(EP, out), 'w'), indent=1)
    print(out, len(shots), 'shots', round(sum(x['dur'] for x in shots), 2), 's')

if __name__ == '__main__': main()
