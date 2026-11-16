"""Word timing for captions without a speech model.

For each script line we know the exact spoken words and roughly where the line sits in voice.mp3
(vo/bounds.json). Inside the line we:
  1. find pauses (silences >= 0.12 s) and split the audio into speech chunks;
  2. split the text into phrases at punctuation and pair phrases with chunks (pauses = anchors);
  3. inside each chunk, find syllable nuclei (peaks of the speech-band loudness envelope) and map the
     words' syllables onto them in order.
Then display words (with digits, e.g. "2008") are matched to spoken words ("two thousand eight").

  python3 anim/align.py            -> vo/words.json  [{n, words:[{w, t0, t1}]}]
"""
import json, os, re, subprocess, difflib
import numpy as np

EP = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SR = 16000

def load_voice():
    raw = subprocess.run(['ffmpeg', '-v', 'error', '-i', os.path.join(EP, 'vo', 'voice.mp3'), '-ac', '1', '-ar', str(SR), '-f', 's16le', '-'],
                         capture_output=True, check=True).stdout
    return np.frombuffer(raw, np.int16).astype(np.float32) / 32768

def bandpass(x, lo, hi):
    X = np.fft.rfft(x); f = np.fft.rfftfreq(len(x), 1 / SR)
    return np.fft.irfft(X * ((f > lo) & (f < hi)), len(x))

def envelope(x, hop=0.01):
    h = int(hop * SR); n = len(x) // h
    e = np.sqrt((x[:n * h].reshape(n, h) ** 2).mean(1) + 1e-12)
    k = np.hanning(5); k /= k.sum()
    return np.convolve(e, k, 'same')

def speech_chunks(env, thr, hop=0.01, min_gap=0.12, min_len=0.06):
    on = env > thr; segs = []; i = 0; n = len(on)
    while i < n:
        if on[i]:
            j = i
            while j < n and on[j]: j += 1
            segs.append([i * hop, j * hop]); i = j
        else: i += 1
    out = []
    for s in segs:
        if out and s[0] - out[-1][1] < min_gap: out[-1][1] = s[1]
        else: out.append(s)
    return [s for s in out if s[1] - s[0] >= min_len] or [[0, n * hop]]

def peaks(env, a, b, hop=0.01, min_dist=0.09):
    i0, i1 = int(a / hop), int(b / hop); e = env[i0:i1]
    if len(e) < 3: return [a]
    floor = np.percentile(e, 30)
    cand = [k for k in range(1, len(e) - 1) if e[k] >= e[k - 1] and e[k] > e[k + 1] and e[k] > floor * 1.15]
    cand.sort(key=lambda k: -e[k]); keep = []
    for k in cand:
        if all(abs(k - q) * hop >= min_dist for q in keep): keep.append(k)
    return sorted((i0 + k) * hop for k in keep) or [a]

def syllables(word):
    w = re.sub(r'[^a-z]', '', word.lower())
    if not w: return 1
    if len(w) <= 2: return 1
    g = re.findall(r'[aeiouy]+', w)
    n = len(g)
    if w.endswith('e') and not w.endswith(('le', 'ee', 'ye')) and n > 1: n -= 1
    if w.endswith(('ed',)) and not w.endswith(('ted', 'ded')) and n > 1: n -= 1
    special = {'ceo': 3, 'iou': 3, 'gm': 2, 'nasa': 2, 'u.s.': 2, 'us': 1, 'spacex': 2, 'paypal': 2, 'tesla': 2, 'toyota': 3, 'fremont': 2, 'i-o-u': 3}
    return special.get(word.lower().strip('.,:;?!'), max(1, n))

def split_words(line):
    return [w for w in re.split(r'\s+', line.replace('...', '… ').replace('…', '… ').strip()) if w]

def phrases(words):
    out = [[]]
    for i, w in enumerate(words):
        out[-1].append(i)
        if i == len(words) - 1: continue
        abbr = re.fullmatch(r'(?:[A-Za-z]\.)+', w)
        nxt_cap = words[i + 1][:1].isupper()
        if re.search(r'[,:;?!…]$', w) or (w.endswith('.') and (not abbr or nxt_cap)): out.append([])
    return [p for p in out if p]

def align_line(env, thr, t0, t1, spoken):
    words = split_words(spoken); syl = [syllables(w) for w in words]
    chunks = [[t0 + a, t0 + b] for a, b in speech_chunks(env[int(t0 / 0.01):int(t1 / 0.01) + 1], thr)]
    ph = phrases(words)
    # pair phrases with chunks: merge chunks/phrases until counts match, by syllable share vs duration share
    if len(chunks) > len(ph):
        import itertools
        S = sum(syl); dur = chunks[-1][1] - chunks[0][0]
        cs = np.cumsum([sum(syl[i] for i in p) for p in ph])[:-1] / S
        best = None
        for comb in itertools.combinations(range(len(chunks) - 1), len(ph) - 1):
            sc = 0
            for k, g in enumerate(comb):
                mid = (chunks[g][1] + chunks[g + 1][0]) / 2
                sc += abs((mid - chunks[0][0]) / dur - cs[k]) - 0.6 * (chunks[g + 1][0] - chunks[g][1]) / dur
            if best is None or sc < best[0]: best = (sc, comb)
        cuts = list(best[1]) if best else []
        new = []; st = 0
        for g in cuts + [len(chunks) - 1]:
            new.append([chunks[st][0], chunks[g][1]]); st = g + 1
        chunks = new
    groups = []  # list of (word indices, chunk)
    if len(chunks) == len(ph):
        groups = list(zip(ph, chunks))
    else:  # fewer chunks than phrases: distribute phrases over chunks by cumulative syllables
        tot = sum(syl); cum = 0; cdur = max(1e-6, sum(b - a for a, b in chunks)); bounds = np.cumsum([b - a for a, b in chunks]) / cdur
        assign = [[] for _ in chunks]
        for p in ph:
            mid = (cum + sum(syl[i] for i in p) / 2) / tot; cum += sum(syl[i] for i in p)
            k = int(np.searchsorted(bounds, mid)); assign[min(k, len(chunks) - 1)] += p
        groups = [(a, c) for a, c in zip(assign, chunks) if a]
    times = [None] * len(words)
    for idx, (a, b) in groups:
        pk = peaks(env, a, b)
        S = sum(syl[i] for i in idx); s = 0
        for i in idx:
            # word starts just before the nucleus of its first syllable
            f = s / S; s += syl[i]
            if len(pk) >= 2:
                pos = f * len(pk); k = min(int(pos), len(pk) - 1)
                tn = pk[k] if k == len(pk) - 1 else pk[k] + (pos - k) * (pk[k + 1] - pk[k]) * 0
                prev_edge = a if k == 0 else (pk[k - 1] + pk[k]) / 2
                start = max(prev_edge, tn - 0.07) if k > 0 else a
            else:
                start = a + f * (b - a)
            times[i] = max(a, 0.6 * start + 0.4 * (a + f * (b - a)))
        times[idx[0]] = a
        for q in range(1, len(idx)):  # keep words apart (min 80 ms per syllable of the previous word)
            i, pi = idx[q], idx[q - 1]
            times[i] = min(max(times[i], times[pi] + 0.08 * syl[pi]), b - 0.05 * (len(idx) - q))
    ends = []
    for i in range(len(words)):
        nxt = times[i + 1] if i + 1 < len(words) else t1
        ends.append(nxt)
    return [dict(w=w, t0=round(times[i], 3), t1=round(ends[i], 3)) for i, w in enumerate(words)]

def norm(w): return re.sub(r'[^a-z]', '', w.lower())

def map_display(display, spoken_words):
    dw = split_words(display); sw = [x['w'] for x in spoken_words]
    a = [norm(w) for w in dw]; b = [norm(w) for w in sw]
    sm = difflib.SequenceMatcher(a=a, b=b, autojunk=False); dt = [None] * len(dw)
    for blk in sm.get_matching_blocks():
        for k in range(blk.size):
            if a[blk.a + k]: dt[blk.a + k] = spoken_words[blk.b + k]['t0']
    # unmatched display words (numbers): give each the spoken words it stands for, using punctuation as boundaries
    for op, i1, i2, j1, j2 in sm.get_opcodes():
        if op in ('replace', 'insert') and i2 > i1:
            j = j1
            for i in range(i1, i2):
                dt[i] = spoken_words[j]['t0'] if j < len(sw) else spoken_words[-1]['t1']
                left = i2 - i - 1
                if j >= j2: continue
                p = re.search(r'[,.:;?!…]$', dw[i])
                if p and not re.fullmatch(r'(?:[A-Za-z]\.)+', dw[i]):
                    while j < j2 - left and not sw[j].endswith(p.group(0)): j += 1
                    j += 1
                else:
                    j += max(1, round((j2 - j) / (left + 1)))
                j = min(j, j2 - left) if left else j
    for i in range(len(dw)):
        if dt[i] is None: dt[i] = dt[i - 1] if i else spoken_words[0]['t0']
    for i in range(1, len(dt)): dt[i] = max(dt[i], dt[i - 1] + 0.05)
    end = spoken_words[-1]['t1']
    return [dict(w=w, t0=round(dt[i], 3), t1=round(dt[i + 1] if i + 1 < len(dw) else end, 3)) for i, w in enumerate(dw)]

def main():
    x = load_voice(); env = envelope(bandpass(x, 250, 3800))
    thr = max(np.percentile(env, 25) * 2.5, env.max() * 10 ** (-38 / 20))
    VO = json.load(open(os.path.join(EP, 'vo', 'bounds.json')))['lines']
    spoken = [l.strip() for l in open(os.path.join(EP, 'lines_spoken.txt'), encoding='utf8') if l.strip()]
    disp = {s['n']: s['line'] for s in json.load(open(os.path.join(EP, 'bible.json')))['scenes']}
    out = []
    for v in VO:
        n = v['n']; sw = align_line(env, thr, max(0.0, v['start'] - 0.03), v['end'] + 0.03, spoken[n - 1])
        d = disp[n]
        if '(dramatised)' in d.lower(): d = spoken[n - 1]   # caption the retelling exactly as spoken
        out.append(dict(n=n, spoken=sw, words=map_display(d, sw)))
    json.dump(out, open(os.path.join(EP, 'vo', 'words.json'), 'w'), indent=1)
    print('aligned', len(out), 'lines')

if __name__ == '__main__': main()
