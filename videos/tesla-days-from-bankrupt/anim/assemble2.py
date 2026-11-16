"""Frame-exact assembly: one continuous voice track (no per-shot audio joins), SFX regenerated on the
absolute timeline, captions from vo/words.json.
  python3 anim/assemble2.py [--out final.mp4] [--range 1-6]
"""
import json, os, sys, subprocess, tempfile, re
import numpy as np
HERE = os.path.dirname(os.path.abspath(__file__)); EP = os.path.dirname(HERE); sys.path.insert(0, HERE)
import sfx as SFX, scenes

FPS, W, H = 30, 1920, 1080
VO_GAIN, SFX_GAIN = 1.7, 0.55
CHAPTERS = {22: 'Chapter 1: The Rich-Person Toy', 32: 'Chapter 2: Three Days Left', 52: 'Chapter 3: The Real Car', 65: 'Chapter 4: Production Hell'}
END_CARD, END_DUR = 'FOLLOW FOR MORE', 2.4

def run(cmd):
    r = subprocess.run(cmd, capture_output=True, text=True, stdin=subprocess.DEVNULL)
    if r.returncode: sys.exit(' '.join(cmd) + '\n' + r.stderr[-2000:])

def dur(p):
    return float(subprocess.run(['ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', p], capture_output=True, text=True).stdout)

def chunk_words(ws):
    out = []; i = 0
    while i < len(ws):
        w = ws[i]['w']
        if i + 1 < len(ws) and len(w) + len(ws[i + 1]['w']) <= 11 and not re.search(r'[.,!?;:…]$', w):
            out.append((ws[i]['t0'], w + ' ' + ws[i + 1]['w'])); i += 2
        else:
            out.append((ws[i]['t0'], w)); i += 1
    return out

def ass_time(t):
    t = max(0, t); h = int(t // 3600); m = int(t % 3600 // 60); s = t % 60
    return f'{h}:{m:02d}:{s:05.2f}'

def main():
    a = sys.argv
    out = os.path.join(EP, a[a.index('--out') + 1] if '--out' in a else 'final.mp4')
    VO = json.load(open(os.path.join(EP, 'vo', 'bounds.json')))['lines']
    WORDS = {L['n']: L for L in json.load(open(os.path.join(EP, 'vo', 'words.json')))}
    vdur = dur(os.path.join(EP, 'vo', 'voice.mp3'))
    lo, hi = (map(int, a[a.index('--range') + 1].split('-')) if '--range' in a else (1, 88))
    starts = {v['n']: (0.0 if v['n'] == 1 else v['seg_start']) for v in VO}
    F = {n: round(starts[n] * FPS) for n in starts}; F[89] = round(vdur * FPS)
    t_lo, t_hi = F[lo] / FPS, F[hi + 1] / FPS; total = t_hi - t_lo
    td = tempfile.mkdtemp(prefix='asm2_')

    # ---- video: each shot trimmed/padded to an exact frame count, video only
    segs = []
    for n in range(lo, hi + 1):
        N = F[n + 1] - F[n]; seg = os.path.join(td, f'v{n:03d}.mp4')
        run(['ffmpeg', '-v', 'error', '-y', '-i', os.path.join(EP, 'clips', f's{n:03d}.mp4'), '-an',
             '-vf', f'fps={FPS},tpad=stop_mode=clone:stop_duration=3,trim=end_frame={N},setpts=PTS-STARTPTS',
             '-frames:v', str(N), '-c:v', 'libx264', '-preset', 'veryfast', '-crf', '14', '-pix_fmt', 'yuv420p', '-r', str(FPS), seg])
        segs.append(seg)
    lst = os.path.join(td, 'list.txt'); open(lst, 'w').write(''.join(f"file '{p}'\n" for p in segs))
    joined = os.path.join(td, 'joined.mp4'); run(['ffmpeg', '-v', 'error', '-y', '-f', 'concat', '-safe', '0', '-i', lst, '-c', 'copy', joined])

    # ---- audio: continuous voice + SFX on the absolute timeline
    sfx = np.zeros(int(total * SFX.SR) + SFX.SR, np.float32)
    for n in range(lo, hi + 1):
        spec = scenes.S.get(n, {}); d = (F[n + 1] - F[n]) / FPS
        x = SFX.mix(spec.get('sfx', []), d) * SFX_GAIN; i = int(round((F[n] / FPS - t_lo) * SFX.SR))
        sfx[i:i + len(x)] += x[:len(sfx) - i]
    sfxw = os.path.join(td, 'sfx.wav'); SFX.write_wav(sfxw, np.clip(sfx[:int(total * SFX.SR)], -1, 1))
    mix = os.path.join(td, 'mix.wav')
    run(['ffmpeg', '-v', 'error', '-y', '-ss', f'{t_lo:.4f}', '-t', f'{total:.4f}', '-i', os.path.join(EP, 'vo', 'voice.mp3'), '-i', sfxw,
         '-filter_complex', f'[0:a]aresample=48000,volume={VO_GAIN}[v];[1:a]aresample=48000[s];[v][s]amix=inputs=2:normalize=0:duration=first,alimiter=limit=0.95[a]',
         '-map', '[a]', '-ac', '2', '-ar', '48000', mix])

    # ---- captions + cards
    caps = []
    for n in range(lo, hi + 1):
        L = WORDS[n]; ch = chunk_words(L['words'])
        nxt = WORDS[n + 1]['words'][0]['t0'] if n < 88 else vdur
        line_end = min(L['words'][-1]['t1'] + 0.25, nxt - 0.02)
        for k, (t, txt) in enumerate(ch):
            e = ch[k + 1][0] if k + 1 < len(ch) else line_end
            caps.append((t - t_lo, max(t - t_lo + 0.12, e - t_lo), txt))
    caps.sort(); caps = [(s, min(e, caps[i + 1][0]) if i + 1 < len(caps) else e, c) for i, (s, e, c) in enumerate(caps)]
    titles = [(F[n] / FPS - t_lo + 0.15, F[n] / FPS - t_lo + 2.0, CHAPTERS[n]) for n in CHAPTERS if lo <= n <= hi]
    if hi == 88: titles.append((total - END_DUR, total, END_CARD))
    font = 'Inter Display'; csize = round(H * 0.068); y = round(H * 0.83); ty = round(H * 0.42)
    head = ('[Script Info]\nScriptType: v4.00+\nPlayResX: %d\nPlayResY: %d\nWrapStyle: 0\n\n[V4+ Styles]\n'
            'Format: Name, Fontname, Fontsize, PrimaryColour, SecondaryColour, OutlineColour, BackColour, Bold, Italic, Underline, StrikeOut, ScaleX, ScaleY, Spacing, Angle, BorderStyle, Outline, Shadow, Alignment, MarginL, MarginR, MarginV, Encoding\n'
            'Style: C,%s,%d,&H00FFFFFF,&H00FFFFFF,&H00000000,&H80000000,1,0,0,0,100,100,0,0,1,7,2,5,40,40,0,1\n'
            'Style: T,%s,%d,&H00FFFFFF,&H00FFFFFF,&H00000000,&HA0000000,1,0,0,0,100,100,2,0,3,18,0,5,40,40,0,1\n\n'
            '[Events]\nFormat: Layer, Start, End, Style, Name, MarginL, MarginR, MarginV, Effect, Text\n') % (W, H, font, csize, font, round(csize * 1.25))
    ev = ''.join(f'Dialogue: 0,{ass_time(s)},{ass_time(e)},C,,0,0,0,,{{\\pos({W // 2},{y})}}{c.upper()}\n' for s, e, c in caps)
    ev += ''.join(f'Dialogue: 1,{ass_time(s)},{ass_time(e)},T,,0,0,0,,{{\\pos({W // 2},{ty})\\fad(150,150)}}{c.upper()}\n' for s, e, c in titles)
    assf = os.path.join(td, 'caps.ass'); open(assf, 'w', encoding='utf8').write(head + ev)
    json.dump([dict(t0=round(s, 3), t1=round(e, 3), text=c) for s, e, c in caps], open(os.path.join(EP, 'vo', 'captions.json'), 'w'), indent=0)

    run(['ffmpeg', '-v', 'error', '-y', '-i', joined, '-i', mix, '-vf', f"ass='{assf}'", '-map', '0:v', '-map', '1:a',
         '-c:v', 'libx264', '-preset', 'medium', '-crf', '20', '-pix_fmt', 'yuv420p', '-r', str(FPS),
         '-c:a', 'aac', '-b:a', '192k', '-shortest', '-movflags', '+faststart', out])
    print('wrote', out, f'{total:.2f}s', len(caps), 'captions')

if __name__ == '__main__': main()
