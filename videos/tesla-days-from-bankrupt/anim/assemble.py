#!/usr/bin/env python3
"""Assemble the final vertical short from per-shot clips.

  python3 assemble.py plan.json

plan.json (paths are relative to the plan file):
{
  "out": "final.mp4",
  "width": 1920, "height": 1080, "fps": 30,      # 16:9 default (channel standard)
  "sfx_volume": 0.5,            # clip sound effects
  "vo_volume": 1.0,
  "captions": false,            # true only once the voice-over exists (or force with "captions_from": "estimate")
  "caption_y": auto, "caption_size": auto, "caption_font": "Inter Display",  # auto: 16:9 -> y=0.83H, size=0.068H; 9:16 -> 1330 / 92
  "music": null,                # or {"file": "music.mp3", "volume": 0.12}
  "layout": "full",             # or "framed": 9:16 cut-down (1080x1920) with the 16:9 picture centred on a blurred copy;
                                # framed also takes "headline": "WHY $10 BUYS LESS" shown above the picture
  "shots": [
    {"clip": "clips/01.mp4", "dur": 3.2, "text": "The richest family kept its money underwater.",
     "src_in": 0.0, "src_out": null, "sfx": 1.0, "vo": "vo/vo_01.wav"}
  ]
}
Per shot: the clip is cropped/scaled to fill the frame and time-fitted to `dur` (trimmed; if too
short, slowed up to 1.35x, then the last frame is held). `sfx` multiplies sfx_volume for that shot
(0 = mute). A still image (.png/.jpg/.webp) as `clip` gets a slow camera move: `"move"` in|out|left|right (default alternates), `"zoom"` 1.10. `"title"` shows a chapter card (big centred text, 1.8 s). `vo`, if given, is placed at the shot start. Captions: 1-2 words at a time, timed to the
speech inside each vo file (pauses detected), words spread by length.
"""
import json, math, os, re, subprocess, sys, tempfile

def run(cmd):
    r = subprocess.run(cmd, capture_output=True, text=True, stdin=subprocess.DEVNULL)
    if r.returncode: sys.exit('ffmpeg failed:\n' + ' '.join(cmd) + '\n' + r.stderr[-3000:])
    return r

def probe(p):
    r = subprocess.run(['ffprobe', '-v', 'error', '-show_entries', 'format=duration:stream=codec_type', '-of', 'json', p], capture_output=True, text=True)
    j = json.loads(r.stdout)
    return float(j['format']['duration']), any(s['codec_type'] == 'audio' for s in j.get('streams', []))

def speech_segments(p):
    """Non-silent stretches [(start, end), ...] inside a voice file (pauses >= 0.12 s removed)."""
    d, _ = probe(p)
    r = subprocess.run(['ffmpeg', '-nostdin', '-hide_banner', '-i', p, '-af', 'silencedetect=noise=-35dB:d=0.12', '-f', 'null', '-'], capture_output=True, text=True)
    sil = []; s0 = None
    for a, b in re.findall(r'silence_start: ([\d.]+)|silence_end: ([\d.]+)', r.stderr):
        if a: s0 = float(a)
        elif s0 is not None: sil.append((s0, float(b))); s0 = None
    if s0 is not None: sil.append((s0, d))
    segs = []; t = 0.0
    for a, b in sil:
        if a > t + 0.05: segs.append((t, a))
        t = max(t, b)
    if d > t + 0.05: segs.append((t, d))
    return segs or [(0.0, d)]

def speech_bounds(p):
    segs = speech_segments(p)
    return segs[0][0], max(segs[0][0] + 0.2, segs[-1][1])

def spread(segs, frac):
    """Map 0..1 of speaking time to a real time inside the file, skipping the pauses."""
    total = sum(b - a for a, b in segs); left = frac * total
    for a, b in segs:
        if left <= (b - a) + 1e-9: return a + left
        left -= (b - a)
    return segs[-1][1]

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
    W, H, FPS = P.get('width', 1920), P.get('height', 1080), P.get('fps', 30)
    vertical = H > W; titles = []
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
            mv = s.get('move') or ['in', 'right', 'out', 'left'][i % 4]   # alternate so stills never feel alike
            if mv == 'in': zx, xx = f"1+({z-1:.3f})*on/{n}", "iw/2-(iw/zoom/2)"
            elif mv == 'out': zx, xx = f"{z:.3f}-({z-1:.3f})*on/{n}", "iw/2-(iw/zoom/2)"
            elif mv == 'left': zx, xx = f"{z:.3f}", f"(iw-iw/zoom)*(1-on/{n})"
            else: zx, xx = f"{z:.3f}", f"(iw-iw/zoom)*on/{n}"
            vf = [f'scale={W*2}:{H*2}:force_original_aspect_ratio=increase', f'crop={W*2}:{H*2}',
                  f"zoompan=z='{zx}':x='{xx}':y='ih/2-(ih/zoom/2)':d={n}:s={W}x{H}:fps={FPS}",
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
            if P.get('captions'):
                sg = speech_segments(R(s['vo']))
                ch = chunk_words(s.get('text', '')); wts = [len(c) + 2 + 3 * sum(x.isdigit() for x in c) for c in ch]; tot = sum(wts) or 1; acc = 0
                for c, wt in zip(ch, wts):
                    a = t0 + spread(sg, acc / tot); acc += wt; b = t0 + spread(sg, acc / tot)
                    caps.append((a, min(b, t0 + dur), c))
        else:
            fc.append('[sfx]anull[a]')
            if P.get('captions') and P.get('captions_from') == 'estimate':
                ch = chunk_words(s.get('text', '')); wts = [len(c) + 2 for c in ch]; tot = sum(wts) or 1; acc = 0
                for c, wt in zip(ch, wts):
                    a = t0 + 0.1 + (dur - 0.3) * acc / tot; acc += wt; caps.append((a, t0 + 0.1 + (dur - 0.3) * acc / tot, c))
        if s.get('title'): titles.append((t0 + 0.15, t0 + min(dur, float(s.get('title_dur', 1.8))), s['title']))
        seg = os.path.join(td, f'seg_{i:03d}.mp4')
        run(['ffmpeg', '-v', 'error', '-y', *inputs, '-filter_complex', ';'.join(fc), '-map', '[v]', '-map', '[a]',
             '-c:v', 'libx264', '-preset', 'medium', '-crf', '18', '-pix_fmt', 'yuv420p', '-r', str(FPS),
             '-c:a', 'aac', '-b:a', '192k', '-ar', '48000', '-ac', '2', '-t', f'{dur:.3f}', seg])
        segs.append(seg); t0 += dur
        print(f'shot {i+1:02d}: {dur:.2f}s  src {a_in:.2f}-{a_out:.2f}  fit x{f:.2f}{"  +hold" if avail * f < dur - 0.05 else ""}')
    caps.sort(key=lambda c: c[0])
    caps = [(a, min(b, caps[i + 1][0] - 0.001) if i + 1 < len(caps) else b, c) for i, (a, b, c) in enumerate(caps)]
    lst = os.path.join(td, 'list.txt'); open(lst, 'w').write(''.join(f"file '{p}'\n" for p in segs))
    joined = os.path.join(td, 'joined.mp4')
    run(['ffmpeg', '-v', 'error', '-y', '-f', 'concat', '-safe', '0', '-i', lst, '-c', 'copy', joined])
    if P.get('end_card'): titles.append((max(0, t0 - float(P.get('end_card_dur', 2.2))), t0, P['end_card']))
    framed = P.get('layout') == 'framed'          # vertical 9:16 cut-down: 16:9 picture centred on a blurred copy
    CW, CH = (P.get('canvas_width', 1080), P.get('canvas_height', 1920)) if framed else (W, H)
    fh = round(CW * H / W)                          # height of the 16:9 picture inside the canvas
    vf = 'null'
    headline = P.get('headline')
    if caps or titles or headline:
        assf = os.path.join(td, 'caps.ass')
        if framed:
            y = P.get('caption_y', round(CH / 2 + fh / 2 + 150)); csize = P.get('caption_size', 84)
            ty = round(CH / 2); hy = round(CH / 2 - fh / 2 - 190)
        else:
            y = P.get('caption_y', 1330 if vertical else round(H * 0.83)); csize = P.get('caption_size', 92 if vertical else round(H * 0.068))
            ty = round(H * 0.42); hy = round(H * 0.12)
        font = P.get('caption_font', 'Inter Display')
        head = ('[Script Info]\nScriptType: v4.00+\nPlayResX: %d\nPlayResY: %d\nWrapStyle: 0\n\n[V4+ Styles]\n'
                'Format: Name, Fontname, Fontsize, PrimaryColour, SecondaryColour, OutlineColour, BackColour, Bold, Italic, Underline, StrikeOut, ScaleX, ScaleY, Spacing, Angle, BorderStyle, Outline, Shadow, Alignment, MarginL, MarginR, MarginV, Encoding\n'
                'Style: C,%s,%d,&H00FFFFFF,&H00FFFFFF,&H00000000,&H80000000,1,0,0,0,100,100,0,0,1,7,2,5,40,40,0,1\n'
                'Style: T,%s,%d,&H00FFFFFF,&H00FFFFFF,&H00000000,&HA0000000,1,0,0,0,100,100,2,0,3,18,0,5,40,40,0,1\n'
                'Style: H,%s,%d,&H0040C8FF,&H0040C8FF,&H00000000,&H80000000,1,0,0,0,100,100,0,0,1,6,2,5,70,70,0,1\n\n'
                '[Events]\nFormat: Layer, Start, End, Style, Name, MarginL, MarginR, MarginV, Effect, Text\n') % (
                    CW, CH, font, csize, font, round(csize * 1.25), font, P.get('headline_size', 78))
        ev = ''.join(f'Dialogue: 0,{ass_time(a)},{ass_time(b)},C,,0,0,0,,{{\\pos({CW//2},{y})}}{c.upper()}\n' for a, b, c in caps)
        ev += ''.join(f'Dialogue: 1,{ass_time(a)},{ass_time(b)},T,,0,0,0,,{{\\pos({CW//2},{ty})\\fad(150,150)}}{c.upper()}\n' for a, b, c in titles)
        if headline: ev += f'Dialogue: 2,{ass_time(0)},{ass_time(t0)},H,,0,0,0,,{{\\pos({CW//2},{hy})}}{headline.upper()}\n'
        open(assf, 'w', encoding='utf8').write(head + ev); vf = f"ass='{assf}'"
    if framed:
        vchain = (f"[0:v]split[va][vb];[va]scale={CW}:{CH}:force_original_aspect_ratio=increase,crop={CW}:{CH},boxblur=40:3,"
                  f"eq=brightness=-0.18:saturation=0.8[bg];[vb]scale={CW}:{fh}[fg];[bg][fg]overlay=0:(H-h)/2,{vf}[v]")
    else:
        vchain = f"[0:v]{vf}[v]"
    out = R(P.get('out', 'final.mp4')); mus = P.get('music')
    cmd = ['ffmpeg', '-v', 'error', '-y', '-i', joined]
    if mus:
        cmd += ['-stream_loop', '-1', '-i', R(mus['file'])]
        af = f'[1:a]volume={mus.get("volume", 0.12)},atrim=duration={t0:.3f},afade=t=out:st={max(0, t0-1.5):.2f}:d=1.5[m];[0:a][m]amix=inputs=2:normalize=0:duration=first[a]'
        cmd += ['-filter_complex', f'{vchain};{af}', '-map', '[v]', '-map', '[a]']
    else:
        cmd += ['-filter_complex', vchain, '-map', '[v]', '-map', '0:a']
    cmd += ['-c:v', 'libx264', '-preset', 'medium', '-crf', '18', '-pix_fmt', 'yuv420p', '-c:a', 'aac', '-b:a', '192k', '-movflags', '+faststart', out]
    run(cmd); print(f'wrote {out}  ({t0:.2f}s, {len(segs)} shots, {len(caps)} captions)')

if __name__ == '__main__':
    main()
