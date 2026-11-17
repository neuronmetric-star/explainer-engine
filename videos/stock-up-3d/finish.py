#!/usr/bin/env python3
"""Join the supermarket hook (from the v2 cut) to the Three.js render and mix the sound.

  node tools/render.js stock-up-3d          # -> final.mp4 (3D, full length)
  python3 videos/stock-up-3d/finish.py      # -> 17-countries-stock-up-3D.mp4
"""
import os, re, subprocess, sys
HERE = os.path.dirname(os.path.abspath(__file__))
V2DIR = os.path.join(HERE, '..', '17-countries-stock-up')
sys.path.insert(0, V2DIR)
import make_v2 as V2   # reuses its sound mix (voice lead + clip ambience + ducked drone bed)

FPS = 30
HOOK_FRAMES = 0                        # 0 = 3D supermarket hook from the render (182 = use the real-footage clips from v2)
HOOK_SRC = os.path.join(V2DIR, '17-countries-stock-up-v2.mp4')
RENDER = os.path.join(HERE, 'final.mp4')
OUT = os.path.join(HERE, '17-countries-stock-up-3D.mp4')

# 3D shot cues (s), from data.js — hits land on every camera cut
CUES = [4.61, 6.30, 7.46, 10.31, 12.50, 17.97, 22.24, 25.08, 28.30, 30.70, 33.26, 35.59, 36.88, 38.08, 40.34, 43.34,
        45.89, 47.17, 49.22, 51.26, 54.06, 56.29, 62.59, 64.58, 66.61, 69.16]
IMPACTS = [7.46 + .6, 49.22 + .4, 64.58 + .5]   # calendar X, viral post, date X
THUNDER = 38.08 + .7

def dur(p):
    return float(subprocess.run(['ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', p], capture_output=True, text=True).stdout)

def main():
    total = dur(RENDER)
    V2.STARTS = [0.0, 4.33, 182 / FPS] + CUES + IMPACTS   # supermarket ambience still plays under the hook
    V2.TOTAL = total
    bed = os.path.join(HERE, '.mix.wav'); V2.mix(bed)
    # thunder crack on the storm, layered under everything
    thunder = os.path.join(HERE, '.thunder.wav')
    subprocess.run(['ffmpeg', '-v', 'error', '-y', '-filter_complex',
                    f"anoisesrc=c=brown:a=0.9:r=48000:d=2.4,lowpass=f=400,afade=t=in:d=0.02,afade=t=out:st=0.3:d=2.1,volume=-6dB,"
                    f"adelay={int(THUNDER * 1000)}|{int(THUNDER * 1000)},pan=stereo|c0=c0|c1=c0,apad,atrim=0:{total:.3f}", thunder], check=True)
    if HOOK_FRAMES:
        vg = (f"[0:v]trim=end_frame={HOOK_FRAMES},setpts=PTS-STARTPTS,fps={FPS},format=yuv420p[h];"
              f"[1:v]trim=start_frame={HOOK_FRAMES},setpts=PTS-STARTPTS,fps={FPS},format=yuv420p[r];[h][r]concat=n=2:v=1:a=0[v];")
    else:
        vg = f"[1:v]fps={FPS},format=yuv420p[v];"
    g = vg + "[2:a][3:a]amix=2:normalize=0,alimiter=limit=0.8:level=disabled[a]"
    subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', HOOK_SRC, '-i', RENDER, '-i', bed, '-i', thunder, '-filter_complex', g,
                    '-map', '[v]', '-map', '[a]', '-c:v', 'libx264', '-preset', 'medium', '-crf', '18', '-profile:v', 'high',
                    '-pix_fmt', 'yuv420p', '-r', str(FPS), '-c:a', 'aac', '-b:a', '192k', '-movflags', '+faststart', '-t', f'{total:.3f}', OUT], check=True)
    for f in (bed, thunder): os.remove(f)
    print('wrote', OUT, f'{dur(OUT):.2f}s')

if __name__ == '__main__':
    main()
