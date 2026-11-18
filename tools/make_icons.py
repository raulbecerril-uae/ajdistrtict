"""Generate the PWA icon set from assets/logo.png.

Brand background #0E2B2C with a subtle radial highlight; the transparent
wordmark is centered. Maskable icons keep the logo inside the ~80% safe zone.
Run:  python tools/make_icons.py
"""
from PIL import Image, ImageDraw
import os

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
LOGO = os.path.join(ROOT, 'assets', 'logo.png')
OUT = os.path.join(ROOT, 'icons')

BG_TOP = (24, 74, 75)      # lighter teal at center
BG_EDGE = (14, 43, 44)     # #0E2B2C theme color
LOGO_RGB = (239, 222, 202) # cream fallback if logo missing

def background(size):
    """Radial-gradient brand background, opaque."""
    im = Image.new('RGB', (size, size), BG_EDGE)
    d = ImageDraw.Draw(im)
    cx = cy = size / 2
    maxr = size * 0.75
    for r in range(int(maxr), 0, -2):
        t = r / maxr
        c = tuple(int(BG_EDGE[i] + (BG_TOP[i] - BG_EDGE[i]) * (1 - t) ** 2) for i in range(3))
        d.ellipse([cx - r, cy - r * 0.9, cx + r, cy + r * 0.9], fill=c)
    return im

def logo_layer(size, width_frac):
    logo = Image.open(LOGO).convert('RGBA')
    w = int(size * width_frac)
    h = int(logo.height * w / logo.width)
    logo = logo.resize((w, h), Image.LANCZOS)
    layer = Image.new('RGBA', (size, size), (0, 0, 0, 0))
    layer.alpha_composite(logo, ((size - w) // 2, (size - h) // 2))
    return layer

def render(size, width_frac, path):
    im = background(size).convert('RGBA')
    im.alpha_composite(logo_layer(size, width_frac))
    im.convert('RGB' if path.endswith('.ico') else 'RGBA').save(path)
    print('wrote', os.path.relpath(path, ROOT), im.size)

os.makedirs(OUT, exist_ok=True)

# Android / PWA "any" purpose
render(192, 0.66, os.path.join(OUT, 'icon-192.png'))
render(512, 0.66, os.path.join(OUT, 'icon-512.png'))
render(384, 0.66, os.path.join(OUT, 'icon-384.png'))

# Android adaptive / maskable (safe zone ~80%)
render(192, 0.50, os.path.join(OUT, 'maskable-192.png'))
render(512, 0.50, os.path.join(OUT, 'maskable-512.png'))

# iOS home screen (opaque, iOS applies its own mask)
render(180, 0.62, os.path.join(OUT, 'apple-touch-icon.png'))
render(167, 0.62, os.path.join(OUT, 'apple-touch-icon-167.png'))

# Browser favicon (multi-size .ico + PNG fallbacks)
render(48, 0.70, os.path.join(OUT, 'favicon-48.png'))
render(32, 0.70, os.path.join(OUT, 'favicon-32.png'))
render(16, 0.70, os.path.join(OUT, 'favicon-16.png'))
render(48, 0.70, os.path.join(OUT, 'favicon.ico'))
