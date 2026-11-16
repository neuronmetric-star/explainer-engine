"""Self-made 2.5D animation of scene 001 (no AI video): push-in, breathing, blink,
head lift + look toward clock, minute-hand tick, shoulder sag.
usage: python3 anim001.py <start_frame.jpg> <out.mp4> [--still t]"""
import sys, math, subprocess
import numpy as np, cv2

src, out = sys.argv[1], sys.argv[2]
still = float(sys.argv[sys.argv.index('--still') + 1]) if '--still' in sys.argv else None
W, H, FPS, DUR = 1920, 1080, 30, 5.0

img = cv2.imread(src)                       # 1920x1080 BGR
assert img.shape[:2] == (1080, 1920)

def ease(x): x = min(max(x, 0), 1); return x * x * (3 - 2 * x)
def win(t, a, b): return ease((t - a) / (b - a))

# ---------- clean plate: remove eyes, minute hand, and (dilated) head ----------
EYES = [(837, 420), (887, 420)]
eye_mask = np.zeros((H, W), np.uint8)
for (x, y) in EYES: cv2.ellipse(eye_mask, (x, y), (9, 12), 0, 0, 360, 255, -1)
head_clean = cv2.inpaint(img, eye_mask, 5, cv2.INPAINT_TELEA)   # head with blank face (brows kept)

# head layer mask: ball + hair, minus the hands under the chin
HC, HR = (893, 375), 112
head_mask = np.zeros((H, W), np.uint8)
cv2.circle(head_mask, HC, HR, 255, -1)
cv2.ellipse(head_mask, (890, 300), (118, 60), 0, 180, 360, 255, -1)   # hair cap
cv2.fillPoly(head_mask, [np.array([[780, 255], [1005, 255], [1010, 330], [775, 330]])], 255)
hands = np.zeros((H, W), np.uint8)
cv2.ellipse(hands, (887, 517), (52, 38), 0, 0, 360, 255, -1)
head_mask[hands > 0] = 0
head_mask[484:, :] = 0
head_alpha = cv2.GaussianBlur(head_mask, (7, 7), 0).astype(np.float32) / 255

# background behind the head
dil = cv2.dilate(head_mask, np.ones((25, 25), np.uint8))
dil[hands > 0] = 0
plate = cv2.inpaint(img, dil, 9, cv2.INPAINT_TELEA)

# minute hand removal (keep orange centre pin)
CLK = (196, 133)
mh = np.zeros((H, W), np.uint8)
cv2.fillPoly(mh, [np.array([[188, 34], [204, 34], [205, 124], [187, 124]])], 255)
plate = cv2.inpaint(plate, mh, 5, cv2.INPAINT_TELEA)
pin = img[124:143, 186:207].copy()

# body region for breathing / sag (shoulders + arms, above desk)
BODY = (740, 330, 1080, 625)     # x0,y0,x1,y1 ; pivot = bottom edge (desk)
bm = np.zeros((H, W), np.float32)
bm[BODY[1]:BODY[3], BODY[0]:BODY[2]] = 1
bm = cv2.GaussianBlur(bm, (61, 61), 0)
bm[BODY[3] - 5:, :] = 0

def minute_hand(frame, ang_deg):
    S = 4  # supersample
    x0, y0, x1, y1 = 80, 20, 312, 250
    big = cv2.resize(frame[y0:y1, x0:x1], None, fx=S, fy=S, interpolation=cv2.INTER_CUBIC)
    a = math.radians(ang_deg)
    cx, cy = (CLK[0] - x0) * S, (CLK[1] - y0) * S
    def P(r, w):  # point along hand at radius r, side offset w
        return (cx + r * math.sin(a) + w * math.cos(a), cy - r * math.cos(a) + w * math.sin(a))
    L = 96 * S
    poly = [P(-6 * S, -4.5 * S), P(L * 0.55, -4 * S), P(L, -1.2 * S), P(L, 1.2 * S), P(L * 0.55, 4 * S), P(-6 * S, 4.5 * S)]
    cv2.fillPoly(big, [np.array(poly, np.int32)], (28, 26, 26), lineType=cv2.LINE_AA)
    frame[y0:y1, x0:x1] = cv2.resize(big, (x1 - x0, y1 - y0), interpolation=cv2.INTER_AREA)
    frame[124:143, 186:207] = pin

def eyes(layer, dx, dy, blink):
    for (x, y) in EYES:
        x, y = x + dx, y + dy
        if blink > 0.5:
            cv2.ellipse(layer, (int(x), int(y + 3)), (8, 3), 0, 200, 340, (20, 20, 20), 3, cv2.LINE_AA)
        else:
            h = int(11 * (1 - blink * 1.6)) + 1
            cv2.ellipse(layer, (int(x), int(y)), (6, max(h, 2)), 0, 0, 360, (20, 20, 20), -1, cv2.LINE_AA)

def blink_amt(t):
    b = 0
    for tb in (0.55, 4.25):
        d = abs(t - tb)
        if d < 0.09: b = max(b, 1 - d / 0.09)
    return b

def render(t):
    up = win(t, 1.0, 1.7) - 0.75 * win(t, 3.2, 3.9)      # head lift then partial drop
    look = win(t, 1.1, 1.8) - 0.6 * win(t, 3.4, 4.1)
    sag = win(t, 3.2, 3.9)
    breath = math.sin(2 * math.pi * t / 2.6)

    frame = plate.copy()
    # clock tick at 2.35 s with a small overshoot
    k = (t - 2.35) / 0.18
    ang = 0 if k < 0 else 6 * (1 + 0.35 * math.exp(-4 * k) * math.sin(k * 7)) if k < 3 else 6
    if 0 <= k < 1: ang = 6 * ease(k) * 1.25
    minute_hand(frame, ang)

    # body: breathing + sag (vertical scale around the desk line)
    sy = 1 + 0.006 * breath - 0.03 * sag
    sx = 1 + 0.004 * sag
    py = BODY[3]; px = 893
    M = np.float32([[sx, 0, px - sx * px], [0, sy, py - sy * py]])
    body = cv2.warpAffine(img, M, (W, H), flags=cv2.INTER_CUBIC, borderMode=cv2.BORDER_REFLECT)
    m = bm[..., None]
    frame = (frame * (1 - m) + body * m).astype(np.uint8)

    # head: rotate toward the clock (screen-left = counter-clockwise), lift, follow body
    head = head_clean.copy()
    eyes(head, -5 * look, -4 * look, blink_amt(t))
    angle = 8 * look - 2 * sag
    ty = -3 * up + 3 * sag
    R = cv2.getRotationMatrix2D((886, 478), angle, 1.0)
    R[1, 2] += ty; R[0, 2] += 0
    hl = cv2.warpAffine(head, R, (W, H), flags=cv2.INTER_CUBIC)
    ha = cv2.warpAffine(head_alpha, R, (W, H), flags=cv2.INTER_LINEAR)[..., None]
    frame = (frame * (1 - ha) + hl * ha).astype(np.uint8)

    # camera: slow push-in, drifting toward Elon and the clock
    z = 1 + 0.08 * ease(t / DUR)
    cx, cy = 960 - 40 * ease(t / DUR), 520
    Mz = np.float32([[z, 0, 960 - z * cx], [0, z, 540 - z * cy]])
    return cv2.warpAffine(frame, Mz, (W, H), flags=cv2.INTER_CUBIC, borderMode=cv2.BORDER_REPLICATE)

if still is not None:
    cv2.imwrite(out, render(still)); sys.exit()

p = subprocess.Popen(['ffmpeg', '-y', '-loglevel', 'error', '-f', 'rawvideo', '-pix_fmt', 'bgr24',
                      '-s', f'{W}x{H}', '-r', str(FPS), '-i', '-', '-c:v', 'libx264', '-crf', '17',
                      '-preset', 'slow', '-pix_fmt', 'yuv420p', '-movflags', '+faststart', out],
                     stdin=subprocess.PIPE)
for i in range(int(DUR * FPS)):
    p.stdin.write(render(i / FPS).tobytes())
p.stdin.close(); p.wait()
print('wrote', out)
