"""python3 gridcrop.py N x0 y0 x1 y1 step out.jpg  -> crop of scene N with 4K coordinate grid"""
import sys, cv2
n, x0, y0, x1, y1, step = map(int, sys.argv[1:7]); out = sys.argv[7]
img = cv2.imread(f'images/scene_{n:03d}.png')[y0:y1, x0:x1]
s = min(1.0, 1100 / max(x1 - x0, y1 - y0)); img = cv2.resize(img, None, fx=s, fy=s, interpolation=cv2.INTER_AREA)
for g in range((x0 // step + 1) * step, x1, step):
    x = int((g - x0) * s); cv2.line(img, (x, 0), (x, img.shape[0]), (0, 200, 255), 1); cv2.putText(img, str(g), (x + 2, 14), 0, 0.42, (0, 0, 255), 1)
for g in range((y0 // step + 1) * step, y1, step):
    y = int((g - y0) * s); cv2.line(img, (0, y), (img.shape[1], y), (0, 200, 255), 1); cv2.putText(img, str(g), (2, y - 2), 0, 0.42, (0, 0, 255), 1)
cv2.imwrite(out, img)
