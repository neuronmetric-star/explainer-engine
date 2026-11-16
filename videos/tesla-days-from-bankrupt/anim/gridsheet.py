"""python3 gridsheet.py out.jpg N1 N2 ... -> full frames with 4K grid (step 200), 2 per row"""
import sys, cv2, numpy as np
out = sys.argv[1]; ns = [int(x) for x in sys.argv[2:]]; tiles = []
for n in ns:
    img = cv2.resize(cv2.imread(f'images/scene_{n:03d}.png'), (960, 540), interpolation=cv2.INTER_AREA)
    for g in range(200, 3840, 200):
        x = g // 4; cv2.line(img, (x, 0), (x, 540), (0, 220, 255) if g % 1000 == 0 else (0, 140, 255), 1)
        if g % 400 == 0: cv2.putText(img, str(g), (x + 2, 12), 0, 0.4, (0, 0, 255), 1)
    for g in range(200, 2160, 200):
        y = g // 4; cv2.line(img, (0, y), (960, y), (0, 220, 255) if g % 1000 == 0 else (0, 140, 255), 1)
        cv2.putText(img, str(g), (2, y - 2), 0, 0.4, (0, 0, 255), 1)
    cv2.putText(img, f'{n:03d}', (880, 530), 0, 1, (0, 0, 255), 2); tiles.append(img)
while len(tiles) % 2: tiles.append(np.zeros_like(tiles[0]))
cv2.imwrite(out, np.vstack([np.hstack(tiles[i:i + 2]) for i in range(0, len(tiles), 2)]), [cv2.IMWRITE_JPEG_QUALITY, 85])
