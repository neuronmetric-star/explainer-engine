"""Frame-exact assembly: one continuous voice track (no per-shot audio joins), SFX regenerated on the
absolute timeline, captions from vo/words.json.

  python3 anim/assemble2.py                              -> final.mp4 (16:9, all 88 scenes)
  python3 anim/assemble2.py --range 1-8 --framed --headline "..." --out shorts/x.mp4
        vertical 1080x1920 Short: 16:9 picture centred on a blurred copy, headline above, captions below,
        end card "FULL STORY ON THE CHANNEL" over a short tail.
"""
import json, os, sys, subprocess, tempfile, re
import numpy as np
HERE = os.path.dirname(os.path.abspath(__file__)); EP = os.path.dirname(HERE); sys.path.insert(0, HERE)
import sfx as SFX, scenes

FPS, W, H = 30, 1920, 1080
VO_GAIN, SFX_GAIN = 1.7, 0.55
CHAPTERS = {22: 'Chapter 1: The Rich-Person Toy', 32: 'Chapter 2: Three Days Left', 52: 'Chapter 3: The Real Car', 65: 'Chapter 4: Production Hell'}

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

def arg(a, k, d=None): return a[a.index(k) + 1] if k in a else d

def main():
    a = sys.argv
    out = os.path.join(EP, arg(a, '--out', 'final.mp4')); os.makedirs(os.path.dirname(out), exist_ok=True)
    lo, hi = map(int, arg(a, '--range', '1-88').split('-'))
    framed = '--framed' in a; headline = arg(a, '--headline')
    end_card = arg(a, '--end-card', 'FULL STORY ON THE CHANNEL' if framed else ('FOLLOW FOR MORE' if hi == 88 else None))
    tail = float(arg(a, '--tail', 1.6 if framed else 0.0))
    VO = json.load(open(os.path.join(EP, 'vo', 'bounds.json')))['lines']
    WORDS = {L['n']: L for L in json.load(open(os.path.join(EP, 'vo', 'words.json')))}
    vdur = dur(os.path.join(EP, 'vo', 'voice.mp3'))
    starts = {v['n']: (0.0 if v['n'] == 1 else v['seg_start']) for v in VO}
    F = {n: round(starts[n] * FPS) for n in starts}; F[89] = round(vdur * FPS)
    TF = round(tail * FPS)
    t_lo, t_hi = F[lo] / FPS, F[hi + 1] / FPS; vtake = t_hi - t_lo; total = vtake + TF / FPS
    td = tempfile.mkdtemp(prefix='asm2_')

    # ---- video: each shot trimmed/padded to an exact frame count (video only)
    segs = []
    for n in range(lo, hi + 1):
        N = F[n + 1] - F[n] + (TF if n == hi else 0); seg = os.path.join(td, f'v{n:03d}.mp4')
        run(['ffmpeg', '-v', 'error', '-y', '-i', os.path.join(EP, 'clips', f's{n:03d}.mp4'), '-an',
             '-vf', f'fps={FPS},tpad=stop_mode=clone:stop_duration=4,trim=end_frame={N},setpts=PTS-STARTPTS',
             '-frames:v', str(N), '-c:v', 'libx264', '-preset', 'veryfast', '-crf', '14', '-pix_fmt', 'yuv420p', '-r', str(FPS), seg])
        segs.append(seg)
    lst = os.path.join(td, 'list.txt'); open(lst, 'w').write(''.join(f"file '{p}'\n" for p in segs))
    joined = os.path.join(td, 'joined.mp4'); run(['ffmpeg', '-v', 'error', '-y', '-f', 'concat', '-safe', '0', '-i', lst, '-c', 'copy', joined])

    # ---- audio: continuous voice + SFX on the absolute timeline
    sfx = np.zeros(int(total * SFX.SR) + SFX.SR, np.float32)
    for n in range(lo, hi + 1):
        d = (F[n + 1] - F[n] + (TF if n == hi else 0)) / FPS
        x = SFX.mix(scenes.S.get(n, {}).get('sfx', []), d) * SFX_GAIN; i = int(round((F[n] / FPS - t_lo) * SFX.SR))
        sfx[i:i + len(x)] += x[:len(sfx) - i]
    sfxw = os.path.join(td, 'sfx.wav'); SFX.write_wav(sfxw, np.clip(sfx[:int(total * SFX.SR)], -1, 1))
    mix = os.path.join(td, 'mix.wav')
    run(['ffmpeg', '-v', 'error', '-y', '-ss', f'{t_lo:.4f}', '-t', f'{vtake:.4f}', '-i', os.path.join(EP, 'vo', 'voice.mp3'), '-i', sfxw,
         '-filter_complex', f'[0:a]aresample=48000,volume={VO_GAIN},afade=t=in:d=0.03,afade=t=out:st={max(0, vtake - 0.06):.3f}:d=0.06,apad[v];'
                            f'[1:a]aresample=48000[s];[v][s]amix=inputs=2:normalize=0:duration=longest,atrim=duration={total:.4f},alimiter=limit=0.95[a]',
         '-map', '[a]', '-ac', '2', '-ar', '48000', mix])

    # ---- captions + cards
    caps = []
    for n in range(lo, hi + 1):
        L = WORDS[n]; ch = chunk_words(L['words'])
        nxt = WORDS[n + 1]['words'][0]['t0'] if n < 88 else vdur
        line_end = min(L['words'][-1]['t1'] + 0.25, nxt - 0.02) if n < hi else L['words'][-1]['t1'] + 0.3
        for k, (t, txt) in enumerate(ch):
            e = ch[k + 1][0] if k + 1 < len(ch) else line_end
            caps.append((t - t_lo, max(t - t_lo + 0.12, e - t_lo), txt))
    caps.sort(); caps = [(s, min(e, caps[i + 1][0]) if i + 1 < len(caps) else e, c) for i, (s, e, c) in enumerate(caps)]
    caps = [(max(0, s), min(e, total), c) for s, e, c in caps]
    titles = [] if framed else [(F[n] / FPS - t_lo + 0.15, F[n] / FPS - t_lo + 2.0, CHAPTERS[n]) for n in CHAPTERS if lo <= n <= hi]
    if end_card: titles.append((total - (TF / FPS + 0.3 if framed else 2.4), total, end_card))
    if framed:
        CW, CH = 1080, 1920; fh = round(CW * H / W)
        csize, y, ty, hy = 84, round(CH / 2 + fh / 2 + 150), round(CH / 2), round(CH / 2 - fh / 2 - 220)
    else:
        CW, CH = W, H; csize, y, ty, hy = round(H * 0.068), round(H * 0.83), round(H * 0.42), 0
    font = 'Inter Display'
    head = ('[Script Info]\nScriptType: v4.00+\nPlayResX: %d\nPlayResY: %d\nWrapStyle: 0\n\n[V4+ Styles]\n'
            'Format: Name, Fontname, Fontsize, PrimaryColour, SecondaryColour, OutlineColour, BackColour, Bold, Italic, Underline, StrikeOut, ScaleX, ScaleY, Spacing, Angle, BorderStyle, Outline, Shadow, Alignment, MarginL, MarginR, MarginV, Encoding\n'
            'Style: C,%s,%d,&H00FFFFFF,&H00FFFFFF,&H00000000,&H80000000,1,0,0,0,100,100,0,0,1,7,2,5,40,40,0,1\n'
            'Style: T,%s,%d,&H00FFFFFF,&H00FFFFFF,&H00000000,&HA0000000,1,0,0,0,100,100,2,0,3,18,0,5,60,60,0,1\n'
            'Style: H,%s,%d,&H0040C8FF,&H0040C8FF,&H00000000,&H80000000,1,0,0,0,100,100,0,0,1,6,2,5,70,70,0,1\n\n'
            '[Events]\nFormat: Layer, Start, End, Style, Name, MarginL, MarginR, MarginV, Effect, Text\n') % (
                CW, CH, font, csize, font, round(csize * (0.9 if framed else 1.25)), font, 84)
    ev = ''.join(f'Dialogue: 0,{ass_time(s)},{ass_time(e)},C,,0,0,0,,{{\\pos({CW // 2},{y})}}{c.upper()}\n' for s, e, c in caps)
    ev += ''.join(f'Dialogue: 1,{ass_time(s)},{ass_time(e)},T,,0,0,0,,{{\\pos({CW // 2},{ty})\\fad(150,150)}}{c.upper()}\n' for s, e, c in titles)
    if headline: ev += f'Dialogue: 2,{ass_time(0)},{ass_time(total)},H,,0,0,0,,{{\\pos({CW // 2},{hy})}}{headline.upper()}\n'
    assf = os.path.join(td, 'caps.ass'); open(assf, 'w', encoding='utf8').write(head + ev)
    if not framed and (lo, hi) == (1, 88):
        json.dump([dict(t0=round(s, 3), t1=round(e, 3), text=c) for s, e, c in caps], open(os.path.join(EP, 'vo', 'captions.json'), 'w'), indent=0)

    if framed:
        vf = (f"[0:v]split[va][vb];[va]scale=1080:1920:force_original_aspect_ratio=increase,crop=1080:1920,boxblur=40:3,"
              f"eq=brightness=-0.18:saturation=0.8[bg];[vb]scale=1080:{fh}[fg];[bg][fg]overlay=0:(H-h)/2,ass='{assf}'[v]")
    else:
        vf = f"[0:v]ass='{assf}'[v]"
    run(['ffmpeg', '-v', 'error', '-y', '-i', joined, '-i', mix, '-filter_complex', vf, '-map', '[v]', '-map', '1:a',
         '-c:v', 'libx264', '-preset', 'medium', '-crf', '20', '-pix_fmt', 'yuv420p', '-r', str(FPS),
         '-c:a', 'aac', '-b:a', '192k', '-shortest', '-movflags', '+faststart', out])
    print('wrote', out, f'{total:.2f}s', len(caps), 'captions')

if __name__ == '__main__': main()
