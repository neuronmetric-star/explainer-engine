#!/usr/bin/env python3
"""Assemble the final vertical short from per-shot clips.

  python3 assemble.py plan.json

plan.json (paths are relative to the plan file):
{
  "out": "final.mp4",
  "width": 1080, "height": 1920, "fps": 30,
  "sfx_volume": 0.5,            # clip sound effects
  "vo_volume": 1.0,
  "captions": false,            # true only once the voice-over exists (or force with "captions_from": "estimate")
  "caption_y": 1330, "caption_size": 92, "caption_font": "Inter Display",
  "music": null,                # or {"file": "music.mp3", "volume": 0.12}
  "shots": [
    {"clip": "clips/01.mp4", "dur": 3.2, "text": "The richest family kept its money underwater.",
     "src_in": 0.0, "src_out": null, "sfx": 1.0, "vo": "vo/vo_01.wav"}
  ]
}
Per shot: the clip is cropped/scaled to fill the frame and time-fitted to `dur` (trimmed; if too
short, slowed up to 1.35x, then the last frame is held). `sfx` multiplies sfx_volume for that shot
(0 = mute). A still image (.png/.jpg/.webp) as `clip` gets a slow push-in (`"zoom": 1.10` = end scale). `vo`, if given, is placed at the shot start. Captions: 1-2 words at a time, timed to the
speech inside each vo file (pauses detected), words spread by length.
"""
import json, math, os, re, subprocess, sys, tempfile

def run(cmd):
    r = subprocess.run(cmd, capture_output=True, text=True)
    if r.returncode: sys.exit('ffmpeg failed:\n' + ' '.join(cmd) + '\n' + r.stderr[-3000:])
    return r

def probe(p):
    r = subprocess.run(['ffprobe', '-v', 'error', '-show_entries', 'format=duration:stream=codec_type', '-of', 'json', p], capture_output=True, text=True)
    j = json.loads(r.stdout)
    return float(j['format']['duration']), any(s['codec_type'] == 'audio' for s in j.get('streams', []))

def speech_bounds(p):
    d, _ = probe(p)
    r = subprocess.run(['ffmpeg', '-hide_banner', '-i', p, '-af', 'silencedetect=noise=-35dB:d=0.12', '-f', 'null', '-'], capture_output=True, text=True)
    st, en = 0.0, d
    m = re.findall(r'silence_start: ([\d.]+)|silence_end: ([\d.]+)', r.stderr)
    ev = [(float(a), 's') if a else (float(b), 'e') for a, b in m]
    if ev and ev[0][1] == 's' and ev[0][0] < 0.05 and len(ev) > 1: st = ev[1][0]
    if ev and ev[-1][1] == 's': en = ev[-1][0]
    return st, max(st + 0.2, en)

def chunk_words(text):
    words = text.split(); out = []; i = 0
    while i < len(words):
        w = words[i]
        if i + 1 < len(words) and len(w) + len(words[i + 1]) <= 11 and not re.search(r'[.,!?;:]$', w):
            out.append(w + ' ' + words[i + 1]); i += 2
        else:
            out.append(w); i += 1
    return out

def ass_time(t):
    t = max(0, t); h = int(t // 3600); m = int(t % 3600 // 60); s = t % 60
    return f'{h}:{m:02d}:{s:05.2f}'

def main():
    plan_path = os.path.abspath(sys.argv[1]); base = os.path.dirname(plan_path)
    P = json.load(open(plan_path)); R = lambda p: os.path.join(base, p)
    W, H, FPS = P.get('width', 1080), P.get('height', 1920), P.get('fps', 30)
    sfxv, vov = P.get('sfx_volume', 0.5), P.get('vo_volume', 1.0)
    td = tempfile.mkdtemp(prefix='asm_'); segs = []; caps = []; t0 = 0.0
    for i, s in enumerate(P['shots']):
        clip = R(s['clip']); dur = float(s['dur'])
        still = clip.lower().endswith(('.png', '.jpg', '.jpeg', '.webp'))
        cdur, has_a = (dur, False) if still else probe(clip)
        a_in = float(s.get('src_in') or 0); a_out = float(s['src_out']) if s.get('src_out') else cdur
        avail = max(0.1, a_out - a_in)
        f = min(1.35, dur / avail) if avail < dur else 1.0
        vf = [f'trim=start={a_in}:end={a_out}', 'setpts=PTS-STARTPTS']
        if f > 1.0: vf.append(f'setpts=PTS*{f:.4f}')
        vf += [f'fps={FPS}', f'scale={W}:{H}:force_original_aspect_ratio=increase', f'crop={W}:{H}', 'setsar=1',
               f'tpad=stop_mode=clone:stop_duration={dur + 1:.2f}', f'trim=duration={dur:.3f}']
        if still:  # slow push-in on a still image (long-form hybrid method)
            n = max(2, int(round(dur * FPS))); z = float(s.get('zoom', 1.10))
            vf = [f'scale={W*2}:{H*2}:force_original_aspect_ratio=increase', f'crop={W*2}:{H*2}',
                  f"zoompan=z='1+({z-1:.3f})*on/{n}':x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':d={n}:s={W}x{H}:fps={FPS}",
                  'setsar=1', f'trim=duration={dur:.3f}']
            f = 1.0; avail = dur
        vol = sfxv * float(s.get('sfx', 1.0))
        inputs = (['-loop', '1', '-t', f'{dur:.3f}', '-i', clip] if still else ['-i', clip]); fc = [f'[0:v]{",".join(vf)}[v]']
        if has_a and vol > 0:
            fc.append(f'[0:a]atrim=start={a_in}:end={a_out},asetpts=PTS-STARTPTS,aresample=48000,volume={vol:.3f},apad,atrim=duration={dur:.3f}[sfx]')
        else:
            inputs += ['-f', 'lavfi', '-t', f'{dur:.3f}', '-i', 'anullsrc=r=48000:cl=stereo']
            fc.append(f'[1:a]atrim=duration={dur:.3f}[sfx]')
        if s.get('vo'):
            k = 1 if (has_a and vol > 0) else 2
            inputs += ['-i', R(s['vo'])]
            fc.append(f'[{k}:a]aresample=48000,volume={vov},apad,atrim=duration={dur:.3f}[vo]')
            fc.append('[sfx][vo]amix=inputs=2:normalize=0:duration=first[a]')
            st, en = speech_bounds(R(s['vo']))
            if P.get('captions'):
                ch = chunk_words(s.get('text', '')); wts = [len(c) + 2 for c in ch]; tot = sum(wts) or 1; acc = 0
                for c, wt in zip(ch, wts):
                    a = t0 + st + (en - st) * acc / tot; acc += wt; b = t0 + st + (en - st) * acc / tot
                    caps.append((a, b, c))
        else:
            fc.append('[sfx]anull[a]')
            if P.get('captions') and P.get('captions_from') == 'estimate':
                ch = chunk_words(s.get('text', '')); wts = [len(c) + 2 for c in ch]; tot = sum(wts) or 1; acc = 0
                for c, wt in zip(ch, wts):
                    a = t0 + 0.1 + (dur - 0.3) * acc / tot; acc += wt; caps.append((a, t0 + 0.1 + (dur - 0.3) * acc / tot, c))
        seg = os.path.join(td, f'seg_{i:03d}.mp4')
        run(['ffmpeg', '-v', 'error', '-y', *inputs, '-filter_complex', ';'.join(fc), '-map', '[v]', '-map', '[a]',
             '-c:v', 'libx264', '-preset', 'medium', '-crf', '18', '-pix_fmt', 'yuv420p', '-r', str(FPS),
             '-c:a', 'aac', '-b:a', '192k', '-ar', '48000', '-ac', '2', '-t', f'{dur:.3f}', seg])
        segs.append(seg); t0 += dur
        print(f'shot {i+1:02d}: {dur:.2f}s  src {a_in:.2f}-{a_out:.2f}  fit x{f:.2f}{"  +hold" if avail * f < dur - 0.05 else ""}')
    lst = os.path.join(td, 'list.txt'); open(lst, 'w').write(''.join(f"file '{p}'\n" for p in segs))
    joined = os.path.join(td, 'joined.mp4')
    run(['ffmpeg', '-v', 'error', '-y', '-f', 'concat', '-safe', '0', '-i', lst, '-c', 'copy', joined])
    vf = 'null'
    if caps:
        assf = os.path.join(td, 'caps.ass'); y = P.get('caption_y', 1330)
        head = ('[Script Info]\nScriptType: v4.00+\nPlayResX: %d\nPlayResY: %d\nWrapStyle: 2\n\n[V4+ Styles]\n'
                'Format: Name, Fontname, Fontsize, PrimaryColour, SecondaryColour, OutlineColour, BackColour, Bold, Italic, Underline, StrikeOut, ScaleX, ScaleY, Spacing, Angle, BorderStyle, Outline, Shadow, Alignment, MarginL, MarginR, MarginV, Encoding\n'
                'Style: C,%s,%d,&H00FFFFFF,&H00FFFFFF,&H00000000,&H80000000,1,0,0,0,100,100,0,0,1,7,2,5,40,40,0,1\n\n'
                '[Events]\nFormat: Layer, Start, End, Style, Name, MarginL, MarginR, MarginV, Effect, Text\n') % (W, H, P.get('caption_font', 'Inter Display'), P.get('caption_size', 92))
        ev = ''.join(f'Dialogue: 0,{ass_time(a)},{ass_time(b)},C,,0,0,0,,{{\\pos({W//2},{y})\\fad(0,0)}}{c.upper()}\n' for a, b, c in caps)
        open(assf, 'w', encoding='utf8').write(head + ev); vf = f"ass='{assf}'"
    out = R(P.get('out', 'final.mp4')); mus = P.get('music')
    cmd = ['ffmpeg', '-v', 'error', '-y', '-i', joined]
    if mus:
        cmd += ['-stream_loop', '-1', '-i', R(mus['file'])]
        af = f'[1:a]volume={mus.get("volume", 0.12)},atrim=duration={t0:.3f},afade=t=out:st={max(0, t0-1.5):.2f}:d=1.5[m];[0:a][m]amix=inputs=2:normalize=0:duration=first[a]'
        cmd += ['-filter_complex', f'[0:v]{vf}[v];{af}', '-map', '[v]', '-map', '[a]']
    else:
        cmd += ['-vf', vf, '-map', '0:v', '-map', '0:a']
    cmd += ['-c:v', 'libx264', '-preset', 'medium', '-crf', '18', '-pix_fmt', 'yuv420p', '-c:a', 'aac', '-b:a', '192k', '-movflags', '+faststart', out]
    run(cmd); print(f'wrote {out}  ({t0:.2f}s, {len(segs)} shots, {len(caps)} captions)')

if __name__ == '__main__':
    main()
