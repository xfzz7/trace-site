"""Compose the film's original instrumental score as stereo PCM."""
import math
import sys
import wave
from array import array

RATE = 48_000
DURATION = 24
TAU = math.tau
left = array('f', [0]) * (RATE * DURATION)
right = array('f', [0]) * len(left)

def note(start, hold, pitch, level, pan, bell=False):
    frequency = 440 * 2 ** ((pitch - 69) / 12)
    first = round(start * RATE)
    length = min(round(hold * RATE), len(left) - first)
    for offset in range(length):
        t = offset / RATE
        if bell:
            envelope = min(1, t / .024) * math.exp(-3.9*t) * min(1, (hold-t)/.16)
            tone = math.sin(TAU*frequency*t) + .20*math.sin(TAU*2.008*frequency*t)*math.exp(-4.2*t)
        else:
            envelope = min(1, t/.42, (hold-t)/.62) * (.92 + .08*math.sin(TAU*.4*t))
            tone = math.sin(TAU*frequency*t) + .12*math.sin(TAU*2*frequency*t)
        value = level * tone * envelope
        left[first+offset] += value * (1-pan)
        right[first+offset] += value * pan

# D major with suspended and added tones, resolved on the brand frame.
chords = [(50, 57, 61, 66), (47, 54, 57, 61), (43, 50, 54, 57), (45, 52, 57, 62),
          (50, 57, 61, 64), (47, 54, 57, 66), (43, 50, 54, 62), (50, 57, 61, 66)]
starts = [0, 3, 5.7, 8.3, 11.2, 14.0, 17.1, 19.8]
for start, chord in zip(starts, chords):
    for i, pitch in enumerate(chord):
        note(start, 3.6, pitch, .065 if i == 0 else .024, .28+.14*i)
    for i, delay in enumerate((.04, .45, .94, 1.45, 2.15)):
        if start + delay >= 23:
            break
        note(start+delay, 1.14, chord[[2, 1, 3, 2, 1][i]]+12, .10, .36 if i % 2 else .62, True)
        note(start+delay+.23, 1.14, chord[[2, 1, 3, 2, 1][i]]+12, .022, .52 if i % 2 else .28, True)

pcm = array('h')
for i, (l, r) in enumerate(zip(left, right)):
    t = i/RATE
    volume = min(1, t/.045, (DURATION-t)/.85) * 1.26
    pcm.extend((round(l*volume*32767), round(r*volume*32767)))
with wave.open(sys.argv[1], 'wb') as f:
    f.setparams((2, 2, RATE, 0, 'NONE', 'not compressed'))
    f.writeframes(pcm.tobytes())
