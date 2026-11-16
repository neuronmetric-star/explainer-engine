#!/usr/bin/env python3
"""Contact sheet of evenly spaced frames, for slop checks.

  python3 contact_sheet.py clip.mp4 sheet.jpg [N=18] [--start S] [--len L] [--cols C]

Each tile is labelled with its timestamp. Read the resulting image and look at every tile.
"""
import argparse, os, subprocess, tempfile, json
from PIL import Image, ImageDraw, ImageFont

def probe_dur(p):
    r = subprocess.run(['ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of', 'json', p], capture_output=True, text=True)
    return float(json.loads(r.stdout)['format']['duration'])

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('video'); ap.add_argument('out'); ap.add_argument('n', nargs='?', type=int, default=18)
    ap.add_argument('--start', type=float, default=0); ap.add_argument('--len', type=float, default=None)
    ap.add_argument('--cols', type=int, default=6); ap.add_argument('--tile', type=int, default=240)
    a = ap.parse_args()
    dur = probe_dur(a.video); length = a.len if a.len else dur - a.start
    length = min(length, dur - a.start)
    times = [a.start + length * (i + 0.5) / a.n for i in range(a.n)]
    tiles = []
    with tempfile.TemporaryDirectory() as td:
        for i, t in enumerate(times):
            f = os.path.join(td, f'{i:03d}.jpg')
            subprocess.run(['ffmpeg', '-nostdin', '-v', 'error', '-ss', f'{t:.3f}', '-i', a.video, '-frames:v', '1', '-vf', f'scale={a.tile}:-2', '-y', f], check=True)
            tiles.append((t, Image.open(f).convert('RGB')))
    w, h = tiles[0][1].size; cols = a.cols; rows = (len(tiles) + cols - 1) // cols
    sheet = Image.new('RGB', (cols * w, rows * (h + 18)), (20, 20, 20))
    d = ImageDraw.Draw(sheet)
    try: font = ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf', 13)
    except Exception: font = ImageFont.load_default()
    for i, (t, im) in enumerate(tiles):
        x, y = (i % cols) * w, (i // cols) * (h + 18)
        sheet.paste(im, (x, y + 18)); d.text((x + 4, y + 2), f'{t:.2f}s', fill=(255, 220, 90), font=font)
    sheet.save(a.out, quality=88); print('wrote', a.out, f'({len(tiles)} frames, {a.start:.1f}-{a.start+length:.1f}s)')

if __name__ == '__main__':
    main()
