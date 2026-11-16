"""Propose stickman heads (largest white circles) and eyes (dark tall dots inside) per 4K scene.
usage: python3 detect_faces.py images_dir out.json [overlay_dir]
Candidates are numbered; a human picks the real heads (anim/faces.json)."""
import sys, os, json
import numpy as np, cv2

def white_mask(img, q=4):
    h, w = img.shape[:2]
    small = cv2.resize(img, (w // q, h // q), interpolation=cv2.INTER_AREA)
    hsv = cv2.cvtColor(small, cv2.COLOR_BGR2HSV)
    m = ((hsv[..., 1] < 45) & (hsv[..., 2] > 165)).astype(np.uint8) * 255
    # close small dark features (eyes, mouth, glasses) so the ball stays solid
    return cv2.morphologyEx(m, cv2.MORPH_CLOSE, np.ones((9, 9), np.uint8))

def find_eyes(img, X, Y, R):
    h, w = img.shape[:2]
    x0, y0, x1, y1 = max(0, X - R), max(0, Y - R), min(w, X + R), min(h, Y + R)
    roi = img[y0:y1, x0:x1]
    disk = np.zeros(roi.shape[:2], np.uint8)
    cv2.circle(disk, (X - x0, Y - y0), int(R * 0.82), 255, -1)
    dark = ((cv2.cvtColor(roi, cv2.COLOR_BGR2GRAY) < 75) & (disk > 0)).astype(np.uint8) * 255
    dc, _ = cv2.findContours(dark, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
    eyes = []
    for d in dc:
        da = cv2.contourArea(d); bx, by, bw, bh = cv2.boundingRect(d)
        if not (R * 0.035) < bh < R * 0.3: continue
        if bh < bw * 0.85 or da < bw * bh * 0.5: continue      # solid, taller than wide
        eyes.append([x0 + bx + bw / 2, y0 + by + bh / 2, bw / 2, bh / 2])
    best = None
    for i in range(len(eyes)):
        for j in range(i + 1, len(eyes)):
            a, b = eyes[i], eyes[j]
            dx, dy = abs(a[0] - b[0]), abs(a[1] - b[1])
            if dy < R * 0.18 and R * 0.18 < dx < R * 0.95 and 0.5 < a[3] / b[3] < 2:
                s = dy + abs(a[3] - b[3])
                if best is None or s < best[0]: best = (s, sorted([a, b]))
    return [[round(v) for v in e] for e in best[1]] if best else []

def find(img, q=4, maxn=8):
    m = white_mask(img, q)
    dist = cv2.distanceTransform(m, cv2.DIST_L2, 5)
    out = []
    for _ in range(maxn):
        _, r, _, (x, y) = cv2.minMaxLoc(dist)
        if r < 11: break
        X, Y, R = int(x * q), int(y * q), int(r * q * 1.05)
        out.append({'x': X, 'y': Y, 'r': R, 'eyes': find_eyes(img, X, Y, R)})
        cv2.circle(dist, (int(x), int(y)), int(r * 1.6), 0, -1)
    return out

if __name__ == '__main__':
    src, outp = sys.argv[1], sys.argv[2]
    ov = sys.argv[3] if len(sys.argv) > 3 else None
    if ov: os.makedirs(ov, exist_ok=True)
    res = {}
    for f in sorted(os.listdir(src)):
        if not f.startswith('scene_'): continue
        img = cv2.imread(os.path.join(src, f)); hs = find(img); res[f[6:9]] = hs
        if ov:
            o = img.copy()
            for k, hd in enumerate(hs):
                cv2.circle(o, (hd['x'], hd['y']), hd['r'], (0, 0, 255), 8)
                cv2.putText(o, str(k), (hd['x'] - 40, hd['y'] + 40), 0, 5, (0, 0, 255), 14)
                for e in hd['eyes']: cv2.ellipse(o, (e[0], e[1]), (e[2] + 10, e[3] + 10), 0, 0, 360, (0, 230, 0), 8)
            cv2.imwrite(os.path.join(ov, f[:-4] + '.jpg'), cv2.resize(o, (640, 360), interpolation=cv2.INTER_AREA))
    json.dump(res, open(outp, 'w'), indent=1)
