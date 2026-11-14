#!/usr/bin/env python3
"""Exact word timing for a voiceover: forced alignment of the known script against the audio (PocketSphinx, offline).
Usage: python3 tools/forcealign.py <audio.mp3> <words.json in> <timings.json out>
words.json = ["Why","the","fuck",...] (spoken tokens). Output = [{"w","start","end"}] same order (seconds)."""
import sys, json, re, subprocess
from pocketsphinx import Decoder
audio, win, wout = sys.argv[1:4]
toks = json.load(open(win))
pcm = subprocess.run(['ffmpeg', '-loglevel', 'error', '-i', audio, '-ac', '1', '-ar', '16000', '-f', 's16le', '-'], capture_output=True, check=True).stdout

dec = Decoder(lm=None, fsg=None)          # default en-us acoustic model + dictionary
NUM = {'1992': 'nineteen ninety two'}
def norm(t):
    t = t.lower().replace('-', ' ')
    return [w for w in re.sub(r"[^a-z' ]", ' ', t).split() if w]
# map each token -> list of dictionary words; unknown words get a letter-ish fallback via a close dict word
words, owner = [], []
for i, t in enumerate(toks):
    for w in norm(NUM.get(t, t)):
        if not dec.lookup_word(w):
            w2 = w.rstrip("'s") if dec.lookup_word(w.rstrip("'s")) else None
            if w2 is None:
                # crude grapheme fallback: add the word with phones from a similar-sounding known word list
                guess = {'mandel': 'M AE N D AH L', 'stefan': 'S T EH F AA N', 'romanian': 'R OW M EY N IY AH N'}.get(w)
                if guess: dec.add_word(w, guess, True); w2 = w
            if w2 is None: continue
            w = w2
        words.append(w); owner.append(i)
dec.set_align_text(' '.join(words))
dec.start_utt(); dec.process_raw(pcm, full_utt=True); dec.end_utt()
segs = [s for s in dec.seg() if s.word not in ('<s>', '</s>', '<sil>', '[NOISE]') and not s.word.startswith('+')]
fr = 0.01
if len(segs) != len(words):
    print('WARN: aligned', len(segs), 'of', len(words), file=sys.stderr)
out = [None] * len(toks)
for s, o in zip(segs, owner):
    st, en = s.start_frame * fr, (s.end_frame + 1) * fr
    if out[o] is None: out[o] = {'w': toks[o], 'start': round(st, 3), 'end': round(en, 3)}
    else: out[o]['end'] = round(en, 3)
# fill any token that had no dictionary word by interpolation
for i in range(len(out)):
    if out[i] is None:
        prev = next((out[j]['end'] for j in range(i - 1, -1, -1) if out[j]), 0)
        nxt = next((out[j]['start'] for j in range(i + 1, len(out)) if out[j]), prev + .3)
        out[i] = {'w': toks[i], 'start': round(prev, 3), 'end': round(max(prev + .05, nxt), 3)}
json.dump(out, open(wout, 'w'))
print('aligned', len(segs), 'dict words for', len(toks), 'tokens; last word ends at', out[-1]['end'])
