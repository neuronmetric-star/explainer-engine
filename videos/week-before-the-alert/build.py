#!/usr/bin/env python3
"""Assemble "The Week Before the Alert" from stills with local FFmpeg only.

Everything is driven by shot_timing.csv (one row per scene, editable in any spreadsheet).

Commands (run from anywhere; paths are relative to this folder):
  python3 build.py pack PROMPT_PACK.md       # pull "Line:" entries + ANIMATED flags into the CSV
  python3 build.py time [--voice voice.mp3]  # (re)compute start/end from the recording, or from a
                                             #   scratch-TTS / estimated read when there is none
  python3 build.py render [--scratch-tts] [--only 5-9] [--allow-missing] [--out NAME.mp4]
  python3 build.py sfx                       # (re)generate the local synthesized effects

CSV columns
  scene      scene file name, e.g. scene_012.png (looked up in assets/scenes/)
  start,end  seconds on the master timeline. Shots must be contiguous (hard cuts).
  narration  exact narration for the scene (original wording, kept even when muted)
  caption    optional override for the burned-in caption; blank = narration
  status     OK | VERIFY (time-sensitive claim, still shown) | PENDING_LINE |
             OMIT_UNVERIFIED (voice muted over the shot, caption removed)
  animated   yes if the prompt pack marks the shot ANIMATED (motion spec should be stronger)
  motion     z=Z0>Z1 f=X0,Y0>X1,Y1   zoom from/to and focus point (0..1 of the image) from/to
  hold       extra seconds after the line so a reveal can read (used by `time`)
  sfx        ;-separated from: rain crt tick water rumble scream
  motion_note  free text for humans
"""
import csv, json, math, os, re, shutil, subprocess, sys, hashlib, wave

HERE = os.path.dirname(os.path.abspath(__file__))
ASSETS = os.path.join(HERE, 'assets')
CSV_PATH = os.path.join(HERE, 'shot_timing.csv')
CACHE = os.path.join(HERE, '.build')
FPS = 30
W, H = 2160, 3840
SR = 48000
FIELDS = ['scene', 'start', 'end', 'narration', 'caption', 'status', 'animated', 'motion', 'hold', 'sfx', 'motion_note']
WPS = 2.45            # restrained dramatic read when nothing better is available
LEAD, TAIL = 0.20, 0.45
PRE_SCREAM_SILENCE = 1.2
FONT = 'Inter'

def sh(cmd, **kw):
    r = subprocess.run(cmd, capture_output=True, text=True, **kw)
    if r.returncode:
        sys.stderr.write(r.stderr[-3000:]); raise SystemExit('command failed: ' + ' '.join(cmd[:6]) + ' ...')
    return r

def probe_dur(path):
    return float(sh(['ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', path]).stdout.strip())

# ------------------------------------------------------------------ CSV
def read_rows():
    with open(CSV_PATH, newline='', encoding='utf-8') as f:
        rows = list(csv.DictReader(f))
    for r in rows:
        for k in FIELDS: r.setdefault(k, '')
    return rows

def write_rows(rows):
    with open(CSV_PATH, 'w', newline='', encoding='utf-8') as f:
        w = csv.DictWriter(f, FIELDS, extrasaction='ignore'); w.writeheader(); w.writerows(rows)

def scene_num(r):
    m = re.search(r'(\d+)', r['scene']); return int(m.group(1)) if m else -1

# ------------------------------------------------------------------ pack
SENSITIVE = re.compile(r'\b(jensen|huang)\b', re.I)
RELATIVE = re.compile(r'\b(today|tonight|tomorrow|yesterday|this (?:week|month|morning)|last (?:week|night|month)|next (?:week|month)|days? ago|right now)\b', re.I)

def cmd_pack(pack_path):
    text = open(pack_path, encoding='utf-8').read()
    # split on headings that name a scene number
    parts = re.split(r'(?im)^(#{1,6}[^\n]*?\bscene[\s_#-]*0*(\d{1,3})\b[^\n]*)$', text)
    scenes = {}
    for i in range(1, len(parts), 3):
        head, num, body = parts[i], int(parts[i + 1]), parts[i + 2]
        m = re.search(r'(?im)^\s*[-*]?\s*\**line\**\s*:\s*\**\s*(.+)$', body)
        line = m.group(1).strip().strip('*').strip() if m else ''
        line = line.strip('"“”')
        scenes[num] = {'line': line, 'animated': bool(re.search(r'\bANIMATED\b', head + body))}
    if not scenes: raise SystemExit('no scene headings with "Line:" entries found in ' + pack_path)
    old = {scene_num(r): r for r in read_rows()} if os.path.exists(CSV_PATH) else {}
    rows = []
    for n in sorted(scenes):
        s, r = scenes[n], dict(old.get(n, {k: '' for k in FIELDS}))
        r['scene'] = f'scene_{n:03d}.png'; r['narration'] = s['line']
        r['animated'] = 'yes' if s['animated'] else ''
        if SENSITIVE.search(s['line']): r['status'] = 'OMIT_UNVERIFIED'
        elif RELATIVE.search(s['line']): r['status'] = 'VERIFY'
        elif not s['line']: r['status'] = 'PENDING_LINE'
        else: r['status'] = r.get('status') or 'OK'
        if re.search(r'\[\s*SCREAM\s*\]', s['line'], re.I) and 'scream' not in r.get('sfx', ''):
            r['sfx'] = ';'.join(x for x in [r.get('sfx', ''), 'scream'] if x)
        if not r.get('motion'):
            r['motion'] = 'z=1.00>1.12 f=0.50,0.50>0.50,0.45' if s['animated'] else 'z=1.00>1.06 f=0.50,0.50>0.50,0.48'
        rows.append(r)
    write_rows(rows)
    with open(os.path.join(HERE, 'narration_script.txt'), 'w', encoding='utf-8') as f:
        f.write('# The Week Before the Alert — narration (original wording, scene order)\n')
        f.write('# Lines marked [OMIT] are muted/uncaptioned in playable cuts pending a verified replacement.\n\n')
        for r in rows:
            tag = {'OMIT_UNVERIFIED': '[OMIT] ', 'VERIFY': '[VERIFY] '}.get(r['status'], '')
            f.write(f"{r['scene'][:-4]}: {tag}{r['narration']}\n")
    print(f'packed {len(rows)} scenes; missing numbers:', [n for n in range(1, max(scenes) + 1) if n not in scenes])

# ------------------------------------------------------------------ TTS (scratch)
def tts_clip(text, idx):
    os.makedirs(os.path.join(CACHE, 'tts'), exist_ok=True)
    key = hashlib.md5(text.encode()).hexdigest()[:10]
    out = os.path.join(CACHE, 'tts', f'{idx:03d}_{key}.wav')
    if not os.path.exists(out):
        raw = out + '.raw.wav'
        # one consistent, restrained voice: low pitch, slow, small word gaps
        sh(['espeak-ng', '-v', 'en-us+m3', '-s', '138', '-p', '28', '-g', '3', '-a', '170', '-w', raw, text])
        sh(['ffmpeg', '-v', 'error', '-y', '-i', raw, '-af',
            'silenceremove=start_periods=1:start_threshold=-50dB,areverse,silenceremove=start_periods=1:start_threshold=-50dB,areverse,'
            'highpass=f=90,lowpass=f=7000,aecho=0.8:0.5:40:0.12,loudnorm=I=-17:TP=-2:LRA=7',
            '-ar', str(SR), '-ac', '2', out])
        os.remove(raw)
    return out

SCREAM_LEN = 2.4

def speech_offset(r):
    """Seconds from shot start to the first word (words on the scream shot wait for the scream)."""
    return LEAD + (SCREAM_LEN if 'scream' in r['sfx'] and spoken(r) else 0)

def have_tts():
    return shutil.which('espeak-ng') is not None

def spoken(r):
    return '' if r['status'] in ('PENDING_LINE',) else re.sub(r'\[[^\]]*\]', '', r['narration']).strip()

# ------------------------------------------------------------------ timing
def cmd_time(voice=None):
    rows = read_rows()
    if voice:
        return time_from_voice(rows, voice)
    t = 0.0
    for i, r in enumerate(rows):
        txt = spoken(r)
        if r['status'] == 'OMIT_UNVERIFIED': sp = 1.8          # muted line: short visual beat only
        elif have_tts() and txt: sp = probe_dur(tts_clip(txt, scene_num(r)))
        else: sp = max(1.2, len(txt.split()) / WPS) if txt else 2.5
        hold = float(r['hold'] or 0)
        nxt = rows[i + 1] if i + 1 < len(rows) else None
        if nxt and 'scream' in nxt['sfx']: hold = max(hold, PRE_SCREAM_SILENCE)
        if 'scream' in r['sfx']: sp = max(sp, 2.6)
        r['start'] = f'{t:.3f}'; t += speech_offset(r) + sp + TAIL + hold; r['end'] = f'{t:.3f}'
    write_rows(rows)
    print(f'timed {len(rows)} shots, total {t:.2f}s (source: {"scratch TTS" if have_tts() else "estimate"})')

def time_from_voice(rows, voice):
    """Put each shot's start at the pause nearest to where its phrase should begin."""
    dur = probe_dur(voice)
    err = subprocess.run(['ffmpeg', '-hide_banner', '-i', voice, '-af', 'silencedetect=noise=-38dB:d=0.22', '-f', 'null', '-'],
                         capture_output=True, text=True).stderr
    gaps, s0 = [], None
    for line in err.splitlines():
        m = re.search(r'silence_start: ([\d.]+)', line)
        if m: s0 = float(m.group(1))
        m = re.search(r'silence_end: ([\d.]+)', line)
        if m and s0 is not None: gaps.append((s0, float(m.group(1)))); s0 = None
    sp_start = gaps[0][1] if gaps and gaps[0][0] < 0.05 else 0.0
    words = [max(1, len(spoken(r).split())) for r in rows]
    tot, acc, starts = sum(words), 0, []
    sp_end = s0 if s0 is not None else dur
    for i, r in enumerate(rows):
        est = sp_start + (sp_end - sp_start) * acc / tot; acc += words[i]
        if i == 0: starts.append(0.0); continue
        cands = [g for g in gaps if abs(g[1] - est) < 1.5 and g[1] > starts[-1] + 0.6]
        st = (min(cands, key=lambda g: abs(g[1] - est))[1] - 0.08) if cands else est
        starts.append(max(st, starts[-1] + 0.6))
    for i, r in enumerate(rows):
        r['start'] = f'{starts[i]:.3f}'; r['end'] = f'{(starts[i + 1] if i + 1 < len(rows) else dur):.3f}'
    write_rows(rows)
    print(f'aligned {len(rows)} shots to {voice} ({dur:.2f}s, {len(gaps)} pauses). Check every cut by ear; adjust the CSV.')

# ------------------------------------------------------------------ SFX (synthesized locally)
SFX_DEFS = {
    # name: (lavfi graph producing stereo 48k, level dB)
    'rain':   ('anoisesrc=c=pink:r=48000:a=0.5,highpass=f=500,lowpass=f=6500,tremolo=f=0.13:d=0.25', -25),
    'crt':    ('anoisesrc=c=white:r=48000:a=0.25,highpass=f=2500,lowpass=f=9000[n];'
               'sine=f=60:r=48000,volume=0.05[h];sine=f=15734:r=48000,volume=0.012[w];[n][h][w]amix=3:normalize=0', -27),
    'tick':   ("aevalsrc='0.8*sin(2*PI*(2600-900*mod(floor(t),2))*t)*exp(-180*mod(t,1))':s=48000", -20),
    'water':  ('anoisesrc=c=brown:r=48000:a=0.6,lowpass=f=700,highpass=f=60,tremolo=f=0.22:d=0.6', -21),
    'rumble': ('anoisesrc=c=brown:r=48000:a=0.8,lowpass=f=110[a];sine=f=38:r=48000,volume=0.5[b];[a][b]amix=2:normalize=0', -16),
    # placeholder scream: gliding, vibrato'd harmonic shriek + breath noise. Replace with a recorded one.
    'scream': ("aevalsrc='(sin(2*PI*(820*t+180*t*t+6*sin(2*PI*6.5*t))) + 0.6*sin(4*PI*(820*t+180*t*t+6*sin(2*PI*6.5*t)))"
               " + 0.35*sin(6*PI*(820*t+180*t*t+6*sin(2*PI*6.5*t))))*min(1,t/0.04)*exp(-0.9*t)':s=48000:d=2.6[v];"
               "anoisesrc=c=pink:r=48000:a=0.35:d=2.6,bandpass=f=2500:w=2000,afade=t=out:st=0.3:d=2.2[n];"
               "[v][n]amix=2:normalize=0,lowpass=f=6000,aecho=0.8:0.6:60|110:0.25|0.15", -1),
}

def sfx_file(name, dur):
    os.makedirs(os.path.join(ASSETS, 'sfx'), exist_ok=True)
    if name == 'scream':
        sup = os.path.join(ASSETS, 'sfx', 'scream.wav')          # a supplied recording wins
        if os.path.exists(sup): return sup, True
        out = os.path.join(ASSETS, 'sfx', 'scream_synth_placeholder.wav')
        if not os.path.exists(out):
            g, _ = SFX_DEFS['scream']
            sh(['ffmpeg', '-v', 'error', '-y', '-filter_complex', g + ',pan=stereo|c0=c0|c1=c0,loudnorm=I=-12:TP=-2,alimiter=limit=0.84',
                '-ar', str(SR), '-t', '2.6', out])
        return out, True
    out = os.path.join(ASSETS, 'sfx', f'{name}.wav')
    if not os.path.exists(out):
        g, _ = SFX_DEFS[name]
        sh(['ffmpeg', '-v', 'error', '-y', '-filter_complex', g + ',aformat=channel_layouts=mono,pan=stereo|c0=c0|c1=c0',
            '-ar', str(SR), '-t', '30', out])
    return out, False

def cmd_sfx():
    for n in SFX_DEFS: print(sfx_file(n, 30)[0])

# ------------------------------------------------------------------ captions
NL = '\\N'   # ASS hard line break

def esc_ass(s):
    return s.replace('\\', '/').replace('{', '(').replace('}', ')')

def wrap2(words, maxc=20):
    """Split a phrase into <=2 lines of <=maxc chars; return None if it doesn't fit."""
    s = ' '.join(words)
    if len(s) <= maxc: return [s]
    best = None
    for k in range(1, len(words)):
        a, b = ' '.join(words[:k]), ' '.join(words[k:])
        if len(a) <= maxc and len(b) <= maxc:
            sc = abs(len(a) - len(b))
            if best is None or sc < best[0]: best = (sc, [a, b])
    return best[1] if best else None

def caption_cards(text):
    """Phrase-level cards: break at punctuation, then pack words into 2-line cards."""
    phrases = [p.strip() for p in re.split(r'(?<=[.,;:!?—])\s+', text) if p.strip()]
    cards = []
    for p in phrases:
        words = p.split()
        while words:
            n = len(words)
            while n > 1 and wrap2(words[:n]) is None: n -= 1
            cards.append(wrap2(words[:n]) or [words[0]]); words = words[n:]
    return cards

def read_phrases():
    """phrases.csv: one row per spoken phrase on the master timeline (start,end,scene,caption,...)."""
    p = os.path.join(HERE, 'phrases.csv')
    if not os.path.exists(p): return []
    with open(p, newline='', encoding='utf-8') as f: return list(csv.DictReader(f))

def phrase_captions(r, t0, t1, phrases):
    """Cards timed to each measured phrase; long phrases are split by length. Relative to shot start."""
    if r['status'] == 'OMIT_UNVERIFIED': return []
    mine = [p for p in phrases if p['scene'] == r['scene'] and p['caption'].strip() and p.get('status') != 'OMIT_UNVERIFIED']
    out = []
    for i, p in enumerate(mine):
        a, b = float(p['start']) - t0, float(p['end']) - t0
        nxt = float(mine[i + 1]['start']) - t0 if i + 1 < len(mine) else t1 - t0 - 0.05
        b_hold = min(nxt, b + 0.35, t1 - t0 - 0.05)          # linger a moment, never across the cut
        cards = caption_cards(p['caption']); lens = [sum(len(l) for l in c) + 4 for c in cards]; acc = 0
        for c, L in zip(cards, lens):
            ca = a + (b - a) * acc / sum(lens); acc += L
            cb = a + (b - a) * acc / sum(lens) if acc < sum(lens) else b_hold
            out.append((max(0, ca), cb, c, 'Cap'))
    return out

def shot_captions(r, t0, t1, speech_dur):
    """Return [(start,end,lines,style)] relative to shot start."""
    if r['status'] == 'OMIT_UNVERIFIED' or r['caption'].strip() == '-': return []
    if r['status'] == 'PENDING_LINE' and not r['caption']:
        return [(0.15, t1 - t0 - 0.1, [f"LINE PENDING · {r['scene'][:-4]}"], 'Pending')]
    text = re.sub(r'\[[^\]]*\]', '', r['caption'] or r['narration']).strip()
    if not text: return []
    cards = caption_cards(text)
    lens = [sum(len(l) for l in c) + 4 for c in cards]
    s0 = speech_offset(r); span = speech_dur if speech_dur else max(0.8, (t1 - t0) - s0 - TAIL - float(r['hold'] or 0))
    out, acc = [], 0
    for c, L in zip(cards, lens):
        a = s0 + span * acc / sum(lens); acc += L
        b = s0 + span * acc / sum(lens)
        out.append((a, b, c, 'Cap'))
    # last card stays up until shortly before the cut, never past it
    if out: out[-1] = (out[-1][0], min(t1 - t0 - 0.05, out[-1][1] + 0.5), out[-1][2], 'Cap')
    return out

def ass_time(t):
    t = max(0, t); cs = int(round(t * 100))
    return f'{cs // 360000}:{cs // 6000 % 60:02d}:{cs // 100 % 60:02d}.{cs % 100:02d}'

def write_ass(path, events, draft_label):
    hdr = f"""[Script Info]
ScriptType: v4.00+
PlayResX: {W}
PlayResY: {H}
WrapStyle: 2
ScaledBorderAndShadow: yes

[V4+ Styles]
Format: Name, Fontname, Fontsize, PrimaryColour, SecondaryColour, OutlineColour, BackColour, Bold, Italic, Underline, StrikeOut, ScaleX, ScaleY, Spacing, Angle, BorderStyle, Outline, Shadow, Alignment, MarginL, MarginR, MarginV, Encoding
Style: Cap,{FONT},118,&H00FFFFFF,&H00FFFFFF,&H00000000,&H96000000,-1,0,0,0,100,100,0,0,1,9,4,2,300,420,960,1
Style: Pending,{FONT},84,&H00B0B0B0,&H00FFFFFF,&H00000000,&H96000000,0,-1,0,0,100,100,0,0,1,6,3,2,300,420,960,1
Style: Draft,{FONT},52,&H00FFFFFF,&H00FFFFFF,&H00000000,&H80000000,-1,0,0,0,100,100,2,0,3,10,0,7,170,170,330,1

[Events]
Format: Layer, Start, End, Style, Name, MarginL, MarginR, MarginV, Effect, Text
"""
    with open(path, 'w', encoding='utf-8') as f:
        f.write(hdr)
        for a, b, lines, st in events:
            f.write(f'Dialogue: 0,{ass_time(a)},{ass_time(b)},{st},,0,0,0,,{NL.join(esc_ass(l) for l in lines)}\n')
        if draft_label:
            f.write(f'Dialogue: 1,{ass_time(0)},{ass_time(9999)},Draft,,0,0,0,,{draft_label}\n')

def srt_time(t):
    ms = int(round(t * 1000)); return f'{ms // 3600000:02d}:{ms // 60000 % 60:02d}:{ms // 1000 % 60:02d},{ms % 1000:03d}'

# ------------------------------------------------------------------ video segments
def parse_motion(spec):
    z0 = z1 = 1.0; fx0 = fy0 = fx1 = fy1 = 0.5
    m = re.search(r'z=([\d.]+)(?:>([\d.]+))?', spec or '')
    if m: z0 = float(m.group(1)); z1 = float(m.group(2) or m.group(1))
    m = re.search(r'f=([\d.]+),([\d.]+)(?:>([\d.]+),([\d.]+))?', spec or '')
    if m:
        fx0, fy0 = float(m.group(1)), float(m.group(2))
        fx1, fy1 = (float(m.group(3)), float(m.group(4))) if m.group(3) else (fx0, fy0)
    return max(1.0, z0), max(1.0, z1), fx0, fy0, fx1, fy1

def render_segment(r, idx, nframes, ass_events, draft_label, allow_missing):
    src = os.path.join(ASSETS, 'scenes', r['scene'])
    missing = not os.path.exists(src)
    if missing and not allow_missing: raise SystemExit(f'missing {src} (use --allow-missing for a labelled slate)')
    z0, z1, fx0, fy0, fx1, fy1 = parse_motion(r['motion'])
    N = max(1, nframes - 1)
    # ease: half linear, half ease-out -> deliberate, settles on the detail
    e = f"(0.5*on/{N}+0.5*(1-pow(1-on/{N},2)))"
    z = f"({z0}+({z1 - z0})*{e})"
    fx = f"({fx0}+({fx1 - fx0})*{e})"; fy = f"({fy0}+({fy1 - fy0})*{e})"
    vf = (f"zoompan=z='{z}':x='max(0,min(iw-iw/zoom,{fx}*iw-iw/zoom/2))':y='max(0,min(ih-ih/zoom,{fy}*ih-ih/zoom/2))'"
          f":d=1:s={W}x{H}:fps={FPS}")
    os.makedirs(os.path.join(CACHE, 'seg'), exist_ok=True)
    ass = os.path.join(CACHE, 'seg', f'{idx:03d}.ass')
    write_ass(ass, ass_events, draft_label)
    key = hashlib.md5(json.dumps([r['scene'], nframes, vf, open(ass).read(), missing,
                                  os.path.getmtime(src) if not missing else 0]).encode()).hexdigest()[:12]
    out = os.path.join(CACHE, 'seg', f'{idx:03d}_{key}.mp4')
    if os.path.exists(out): return out
    if missing:
        inp = ['-f', 'lavfi', '-i', f'color=c=0x101010:s={W}x{H}:r={FPS}']
        vf = (f"drawtext=fontfile=/usr/share/fonts/opentype/inter/Inter-Bold.otf:text='{r['scene']} MISSING':"
              f"fontcolor=0xff5050:fontsize=110:x=(w-tw)/2:y=h*0.4")
    else:
        inp = ['-loop', '1', '-framerate', str(FPS), '-i', src]
    vf += f",subtitles='{ass}':fontsdir=/usr/share/fonts/opentype/inter,format=yuv420p"
    sh(['ffmpeg', '-v', 'error', '-y', *inp, '-frames:v', str(nframes), '-vf', vf,
        '-c:v', 'libx264', '-preset', 'medium', '-crf', '17', '-profile:v', 'high', '-level', '5.2',
        '-pix_fmt', 'yuv420p', '-r', str(FPS), '-video_track_timescale', '15360', '-an', '-f', 'mp4', out + '.part'])
    os.replace(out + '.part', out)          # atomic: an interrupted render never leaves a bad cache entry
    return out

# ------------------------------------------------------------------ render
def cmd_render(args):
    rows = read_rows()
    only = next((a.split('=', 1)[1] for a in args if a.startswith('--only=')), None)
    if only:
        lo, hi = (int(x) for x in only.split('-'))
        rows = [r for r in rows if lo <= scene_num(r) <= hi]
    allow_missing = '--allow-missing' in args
    scratch = '--scratch-tts' in args
    voice = next((v for v in (os.path.join(CACHE, 'voice_master.wav'), os.path.join(HERE, 'voice.mp3')) if os.path.exists(v)), None)
    phrases = read_phrases() if voice else []
    # normalise to a contiguous timeline starting at 0
    base = float(rows[0]['start'])
    for i, r in enumerate(rows):
        r['_s'] = float(r['start']) - base; r['_e'] = float(r['end']) - base
        if i and abs(r['_s'] - rows[i - 1]['_e']) > 1e-3: raise SystemExit(f"gap/overlap before {r['scene']}")
    total = rows[-1]['_e']
    pending = [r['scene'] for r in rows if r['status'] in ('PENDING_LINE', 'OMIT_UNVERIFIED', 'VERIFY')]
    missing = [r['scene'] for r in rows if not os.path.exists(os.path.join(ASSETS, 'scenes', r['scene']))]
    is_draft = bool(pending or missing or not voice or only or 'scream_synth' in sfx_file('scream', 3)[0] or '--draft' in args)
    out_name = next((a.split('=', 1)[1] for a in args if a.startswith('--out=')), None) or \
        ('The-Week-Before-the-Alert-DRAFT.mp4' if is_draft else 'The-Week-Before-the-Alert.mp4')
    label = 'DRAFT · DRAMATIZATION · NOT FOR RELEASE' if is_draft else 'DRAMATIZATION'
    if '--no-label' in args: label = ''

    # narration placement
    tts = {}
    if not voice and scratch and have_tts():
        for r in rows:
            if spoken(r) and r['status'] != 'OMIT_UNVERIFIED': tts[r['scene']] = tts_clip(spoken(r), scene_num(r))

    # segments + captions
    segs, srt, frame = [], [], 0
    for i, r in enumerate(rows):
        f0, f1 = round(r['_s'] * FPS), round(r['_e'] * FPS)
        sp = probe_dur(tts[r['scene']]) if r['scene'] in tts else None
        caps = phrase_captions(r, f0 / FPS, f1 / FPS, phrases) if phrases else shot_captions(r, f0 / FPS, f1 / FPS, sp)
        for a, b, lines, st in caps:
            if st == 'Cap': srt.append((f0 / FPS + a, f0 / FPS + b, lines))
        segs.append(render_segment(r, i, f1 - f0, caps, label, allow_missing))
        print(f"  [{i + 1}/{len(rows)}] {r['scene']} {f0 / FPS:7.2f}-{f1 / FPS:7.2f}  {r['status'] or 'OK'}", flush=True)
    write_ass(os.path.join(CACHE, 'captions_full.ass'), [(a, b, l, 'Cap') for a, b, l in srt], '')
    json.dump({'out': out_name, 'cuts': [round(r['_s'] * FPS) for r in rows[1:]], 'total': total,
               'scream_cuts': [round(r['_s'] * FPS) for r in rows if 'scream' in r['sfx']]},
              open(os.path.join(CACHE, 'last_render.json'), 'w'))
    with open(os.path.join(HERE, out_name.replace('.mp4', '.srt')), 'w', encoding='utf-8') as f:
        for n, (a, b, lines) in enumerate(srt, 1):
            f.write(f'{n}\n{srt_time(a)} --> {srt_time(b)}\n' + '\n'.join(lines) + '\n\n')
    lst = os.path.join(CACHE, 'concat.txt')
    with open(lst, 'w') as f:
        for s in segs: f.write(f"file '{s}'\n")
    silent = os.path.join(CACHE, 'video.mp4')
    sh(['ffmpeg', '-v', 'error', '-y', '-f', 'concat', '-safe', '0', '-i', lst, '-c', 'copy', silent])

    # audio
    inputs, chains, voice_lbl, beds, fx = [], [], None, [], []
    def add(path): inputs.extend(["-i", path]); return len(inputs) // 2  # input 0 is the video
    if voice:
        k = add(voice)
        mutes = '+'.join(f"between(t,{r['_s'] + base:.3f},{r['_e'] + base:.3f})" for r in rows if r['status'] == 'OMIT_UNVERIFIED')
        v = f"[{k}:a]atrim=start={base:.3f},asetpts=PTS-STARTPTS,aresample={SR},aformat=channel_layouts=stereo"
        if mutes: v += f",volume=0:enable='{mutes}'"
        chains.append(v + '[vo]'); voice_lbl = 'vo'
    elif tts:
        parts = []
        for r in rows:
            if r['scene'] in tts:
                k = add(tts[r['scene']]); d = int((r['_s'] + speech_offset(r)) * 1000)
                chains.append(f'[{k}:a]adelay={d}|{d}[t{k}]'); parts.append(f'[t{k}]')
        chains.append(''.join(parts) + f'amix={len(parts)}:normalize=0[vo]'); voice_lbl = 'vo'
    for i, r in enumerate(rows):
        nxt = rows[i + 1] if i + 1 < len(rows) else None
        end = r['_e'] - (PRE_SCREAM_SILENCE if nxt and 'scream' in nxt['sfx'] else 0)
        for name in [s.strip() for s in r['sfx'].split(';') if s.strip()]:
            path, is_scream = sfx_file(name, r['_e'] - r['_s'])
            k = add(path); d = int(r['_s'] * 1000); lab = f'x{k}'
            if is_scream:
                chains.append(f'[{k}:a]adelay={d}|{d}[{lab}]'); fx.append(f'[{lab}]')
            else:
                dur = max(0.3, end - r['_s']); lvl = SFX_DEFS[name][1]
                chains.append(f'[{k}:a]atrim=0:{dur:.3f},volume={lvl}dB,afade=t=in:d=0.12,'
                              f'afade=t=out:st={max(0, dur - 0.35):.3f}:d=0.35,adelay={d}|{d}[{lab}]')
                beds.append(f'[{lab}]')
    if beds:
        chains.append(''.join(beds) + f'amix={len(beds)}:normalize=0,apad[bed]')
        if voice_lbl:   # duck effects under the voice
            chains.append(f'[{voice_lbl}]asplit[vo1][vsc]')
            chains.append('[bed][vsc]sidechaincompress=threshold=0.03:ratio=6:attack=20:release=350[bedd]')
            voice_lbl = 'vo1'; bed = '[bedd]'
        else: bed = '[bed]'
    else: bed = ''
    mix = ([f'[{voice_lbl}]'] if voice_lbl else []) + ([bed] if bed else []) + fx
    if not mix:
        chains.append(f'anullsrc=r={SR}:cl=stereo[mix]')
    else:
        chains.append(''.join(mix) + f'amix={len(mix)}:normalize=0:duration=longest[mix]')
    chains.append(f'[mix]apad,atrim=0:{total:.3f},alimiter=limit=0.89:attack=2:release=60:level=disabled,aresample={SR}[aout]')
    out = os.path.join(HERE, out_name)
    sh(['ffmpeg', '-v', 'error', '-y', '-i', silent, *inputs, '-filter_complex', ';'.join(chains),
        '-map', '0:v', '-map', '[aout]', '-c:v', 'copy', '-c:a', 'aac', '-b:a', '192k', '-ar', str(SR),
        '-movflags', '+faststart', '-t', f'{total:.3f}', out])
    print(f'\nwrote {out}  ({total:.2f}s)  draft={is_draft}')
    if missing: print('missing scenes:', ', '.join(missing))
    if pending: print('lines pending/omitted/verify:', ', '.join(pending))

def cmd_check():
    """Verify the last render: specs, first/last + every cut boundary, caption box, ending audio."""
    info = json.load(open(os.path.join(CACHE, 'last_render.json')))
    out = os.path.join(HERE, info['out']); chk = os.path.join(HERE, 'check'); os.makedirs(chk, exist_ok=True)
    p = json.loads(sh(['ffprobe', '-v', 'error', '-show_streams', '-show_format', '-of', 'json', out]).stdout)
    v = next(x for x in p['streams'] if x['codec_type'] == 'video'); a = next(x for x in p['streams'] if x['codec_type'] == 'audio')
    head = open(out, 'rb').read(1 << 20)
    res = {'width': v['width'], 'height': v['height'], 'codec': v['codec_name'], 'pix_fmt': v['pix_fmt'],
           'fps': v['r_frame_rate'], 'frames': int(v['nb_frames']), 'audio': a['codec_name'], 'sample_rate': a['sample_rate'],
           'duration': float(p['format']['duration']), 'faststart': 0 < head.find(b'moov') < (head.find(b'mdat') if b'mdat' in head else 1 << 30)}
    ok = res['width'] == W and res['height'] == H and res['codec'] == 'h264' and res['pix_fmt'] == 'yuv420p' \
        and res['fps'] == '30/1' and res['audio'] == 'aac' and res['faststart']
    print('SPEC', 'PASS' if ok else 'FAIL', res)
    # frames: first, last, and both sides of every cut -> contact sheets of 8 cuts each
    nf = res['frames']; cuts = info['cuts']
    pairs = [(0, 0)] + [(c - 1, c) for c in cuts] + [(nf - 1, nf - 1)]
    sel = sorted({f for pr in pairs for f in pr})
    tmp = os.path.join(CACHE, 'frames'); shutil.rmtree(tmp, ignore_errors=True); os.makedirs(tmp)
    sh(['ffmpeg', '-v', 'error', '-i', out, '-vf', "select='" + '+'.join(f'eq(n,{f})' for f in sel) + "',scale=216:384",
        '-vsync', '0', os.path.join(tmp, 'f%04d.png')])
    files = sorted(os.listdir(tmp)); fmap = dict(zip(sel, files))
    order = [fmap[f] for pr in pairs for f in pr]
    for k in range(0, len(order), 16):
        lst = os.path.join(tmp, f'l{k}.txt')
        with open(lst, 'w') as f:
            for fn in order[k:k + 16]: f.write(f"file '{os.path.join(tmp, fn)}'\nduration 1\n")
        sh(['ffmpeg', '-v', 'error', '-y', '-f', 'concat', '-safe', '0', '-i', lst, '-vf', 'tile=8x2:padding=6:color=white',
            '-frames:v', '1', os.path.join(chk, f'cuts_{k // 16 + 1:02d}.jpg')])
    # black-frame / duplicate check at each cut: the two sides must differ
    print(f'CUTS {len(cuts)} boundaries + first/last frames -> check/cuts_*.jpg')
    # caption clearance: render captions alone over black and measure the union bounding box
    from PIL import Image
    proc = subprocess.Popen(['ffmpeg', '-v', 'error', '-f', 'lavfi', '-i', f'color=black:s={W}x{H}:r=2:d={res["duration"]:.2f}',
                             '-vf', f"subtitles='{os.path.join(CACHE, 'captions_full.ass')}':fontsdir=/usr/share/fonts/opentype/inter,format=gray",
                             '-f', 'rawvideo', '-'], stdout=subprocess.PIPE)
    boxes = []
    while True:
        buf = proc.stdout.read(W * H)
        if len(buf) < W * H: break
        bb = Image.frombytes('L', (W, H), buf).point(lambda v: 255 if v > 40 else 0).getbbox()
        if bb: boxes.append((bb[0], bb[2], bb[1], bb[3]))
    proc.wait()
    if boxes:
        x1, x2, y1, y2 = min(b[0] for b in boxes), max(b[1] for b in boxes), min(b[2] for b in boxes), max(b[3] for b in boxes)
        print(f'CAPTIONS union box x {x1}-{x2}, y {y1}-{y2}  (bottom clearance {H - y2}px = {100 * (H - y2) / H:.0f}% of height; '
              f'right clearance {W - x2}px)', 'PASS' if H - y2 >= 760 and y1 >= 280 and x1 >= 56 and x2 <= W - 56 else 'FAIL')
    else: print('CAPTIONS none burned in (all lines pending/omitted)')
    # ending audio: silence before the scream cut, onset at the cut, true peak
    st = subprocess.run(['ffmpeg', '-hide_banner', '-nostats', '-i', out, '-vn', '-af', 'ebur128=peak=true', '-f', 'null', '-'],
                        capture_output=True, text=True).stderr
    tp = re.findall(r'Peak:\s+([-\d.]+) dBFS', st); I = re.findall(r'I:\s+([-\d.]+) LUFS', st)
    print(f'AUDIO integrated {I[-1] if I else "?"} LUFS, true peak {tp[-1] if tp else "?"} dBFS', 'PASS' if tp and float(tp[-1]) <= -0.5 else 'CHECK')
    for c in info['scream_cuts']:
        t = c / FPS
        sd = subprocess.run(['ffmpeg', '-hide_banner', '-nostats', '-ss', f'{max(0, t - 3):.3f}', '-t', '4', '-i', out, '-vn',
                             '-af', 'silencedetect=n=-50dB:d=0.25', '-f', 'null', '-'], capture_output=True, text=True).stderr
        ends = [float(x) + max(0, t - 3) for x in re.findall(r'silence_end: ([\d.]+)', sd)]
        starts = [float(x) + max(0, t - 3) for x in re.findall(r'silence_start: ([\d.]+)', sd)]
        onset = min(ends, key=lambda e: abs(e - t)) if ends else None
        gap = (onset - max([s for s in starts if s < (onset or t)], default=onset)) if onset else 0
        print(f'SCREAM cut at {t:.3f}s; audio onset {onset if onset is None else round(onset, 3)}s '
              f'(offset {"?" if onset is None else f"{1000 * (onset - t):+.0f} ms"}); silence before it {gap:.2f}s',
              'PASS' if onset is not None and abs(onset - t) < 0.05 and gap >= 0.8 else 'CHECK')

def cmd_voice_edit():
    """Build .build/voice_master.wav from voice.mp3 using voice_edits.json (spans removed -> short silent gap)."""
    cfg = json.load(open(os.path.join(HERE, 'voice_edits.json')))
    src = os.path.join(HERE, cfg.get('source', 'voice.mp3')); os.makedirs(CACHE, exist_ok=True)
    keep, t = [], 0.0
    for c in sorted(cfg.get('cuts', []), key=lambda c: c['from']):
        keep.append((t, c['from'], c.get('gap', 1.0))); t = c['to']
    keep.append((t, probe_dur(src), 0))
    parts, labels = [], []
    for i, (a, b, gap) in enumerate(keep):
        parts.append(f"[0:a]atrim={a:.3f}:{b:.3f},asetpts=PTS-STARTPTS,aresample={SR},afade=t=in:d=0.02,afade=t=out:st={max(0, b - a - 0.04):.3f}:d=0.04[k{i}]")
        labels.append(f'[k{i}]')
        if gap: parts.append(f"anullsrc=r={SR}:cl=mono,atrim=0:{gap:.3f}[g{i}]"); labels.append(f'[g{i}]')
    parts.append(''.join(labels) + f"concat=n={len(labels)}:v=0:a=1,aformat=channel_layouts=mono,"
                 f"loudnorm=I={cfg.get('loudnorm', -16)}:TP=-2:LRA=9,aresample={SR},pan=stereo|c0=c0|c1=c0[out]")
    out = os.path.join(CACHE, 'voice_master.wav')
    sh(['ffmpeg', '-v', 'error', '-y', '-i', src, '-filter_complex', ';'.join(parts), '-map', '[out]', out])
    print(f'wrote {out} ({probe_dur(out):.2f}s from {probe_dur(src):.2f}s)')

if __name__ == '__main__':
    a = sys.argv[1:]
    if not a: print(__doc__); sys.exit(0)
    if a[0] == 'pack': cmd_pack(a[1])
    elif a[0] == 'time':
        v = a[a.index('--voice') + 1] if '--voice' in a else (os.path.join(HERE, 'voice.mp3') if os.path.exists(os.path.join(HERE, 'voice.mp3')) else None)
        cmd_time(v)
    elif a[0] == 'render': cmd_render(a[1:])
    elif a[0] == 'sfx': cmd_sfx()
    elif a[0] == 'check': cmd_check()
    elif a[0] == 'voice-edit': cmd_voice_edit()
    else: print(__doc__)
