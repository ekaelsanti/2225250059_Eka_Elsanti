"""Membuat ikon PNG GradieKAn dari desain yang sama dengan apps/web/public/icon.svg.

Hanya memakai pustaka standar Python (tanpa Pillow). Gambar dirender 4x lebih besar
lalu diperkecil (anti-aliasing), kemudian ditulis sebagai PNG.

Jalankan:  python scripts/make_icons.py
"""

from __future__ import annotations

import math
import struct
import zlib
from pathlib import Path

OUT = Path(__file__).resolve().parents[1] / "apps" / "web" / "public"
BASE = 512  # koordinat desain (sama dengan viewBox SVG)
SS = 2048  # resolusi render (supersampling 4x)

BLUE = (29, 78, 216)
WHITE = (255, 255, 255)
YELLOW = (251, 191, 36)

# Desain: (titik-titik polyline, tebal garis, warna, opasitas)
STROKES = [
    ([(96, 400), (416, 400)], 20, WHITE, 0.6),  # sumbu x
    ([(96, 400), (96, 96)], 20, WHITE, 0.6),  # sumbu y
    ([(120, 360), (392, 136)], 36, WHITE, 1.0),  # garis bergradien
    ([(232, 268), (312, 268), (312, 202)], 20, YELLOW, 1.0),  # jalan & naik
]


def _seg_dist(px: float, py: float, ax: float, ay: float, bx: float, by: float) -> float:
    dx, dy = bx - ax, by - ay
    t = max(0.0, min(1.0, ((px - ax) * dx + (py - ay) * dy) / (dx * dx + dy * dy)))
    return math.hypot(px - (ax + t * dx), py - (ay + t * dy))


def _in_round_rect(u: float, v: float, r: float) -> bool:
    cx = min(max(u, r), BASE - r)
    cy = min(max(v, r), BASE - r)
    return (u - cx) ** 2 + (v - cy) ** 2 <= r * r


def render(rounded: bool, content_scale: float) -> list[list[float]]:
    """Render RGBA (float, premultiplied) pada resolusi SS x SS."""
    k = SS / BASE
    px = [[0.0, 0.0, 0.0, 0.0] for _ in range(SS * SS)]

    # latar
    for y in range(SS):
        v = (y + 0.5) / k
        row = y * SS
        for x in range(SS):
            u = (x + 0.5) / k
            if not rounded or _in_round_rect(u, v, 112):
                px[row + x] = [BLUE[0], BLUE[1], BLUE[2], 1.0]

    # goresan (diskalakan terhadap pusat untuk ikon maskable)
    c = BASE / 2
    for points, width, color, alpha in STROKES:
        pts = [(c + (x - c) * content_scale, c + (y - c) * content_scale) for x, y in points]
        half = width * content_scale / 2
        xs = [p[0] for p in pts]
        ys = [p[1] for p in pts]
        x0, x1 = int((min(xs) - half) * k), int((max(xs) + half) * k) + 1
        y0, y1 = int((min(ys) - half) * k), int((max(ys) + half) * k) + 1
        for y in range(max(0, y0), min(SS, y1)):
            v = (y + 0.5) / k
            for x in range(max(0, x0), min(SS, x1)):
                u = (x + 0.5) / k
                if any(_seg_dist(u, v, *pts[i], *pts[i + 1]) <= half for i in range(len(pts) - 1)):
                    p = px[y * SS + x]
                    for ch in range(3):
                        p[ch] = color[ch] * alpha + p[ch] * (1 - alpha)
                    p[3] = alpha + p[3] * (1 - alpha)
    return px


def downsample(px: list[list[float]], size: int) -> bytes:
    """Rata-rata area (premultiplied alpha) ke ukuran target -> baris RGBA 8-bit."""
    scale = SS / size
    out = bytearray()
    for ty in range(size):
        sy0, sy1 = int(ty * scale), max(int(ty * scale) + 1, int((ty + 1) * scale))
        out.append(0)  # filter PNG: none
        for tx in range(size):
            sx0, sx1 = int(tx * scale), max(int(tx * scale) + 1, int((tx + 1) * scale))
            r = g = b = a = 0.0
            n = 0
            for sy in range(sy0, sy1):
                row = sy * SS
                for sx in range(sx0, sx1):
                    p = px[row + sx]
                    r += p[0] * p[3]
                    g += p[1] * p[3]
                    b += p[2] * p[3]
                    a += p[3]
                    n += 1
            if a > 0:
                out += bytes((round(r / a), round(g / a), round(b / a), round(255 * a / n)))
            else:
                out += b"\x00\x00\x00\x00"
    return bytes(out)


def write_png(path: Path, size: int, raw: bytes) -> None:
    def chunk(tag: bytes, data: bytes) -> bytes:
        return struct.pack(">I", len(data)) + tag + data + struct.pack(">I", zlib.crc32(tag + data))

    png = b"\x89PNG\r\n\x1a\n"
    png += chunk(b"IHDR", struct.pack(">IIBBBBB", size, size, 8, 6, 0, 0, 0))
    png += chunk(b"IDAT", zlib.compress(raw, 9))
    png += chunk(b"IEND", b"")
    path.write_bytes(png)
    print(f"  {path.name} ({size}x{size}, {len(png) // 1024} KB)")


def main() -> None:
    OUT.mkdir(parents=True, exist_ok=True)
    print("Merender ikon standar (sudut membulat, latar transparan)...")
    standard = render(rounded=True, content_scale=1.0)
    for size, name in ((192, "icon-192.png"), (512, "icon-512.png")):
        write_png(OUT / name, size, downsample(standard, size))

    print("Merender ikon penuh (iOS) dan maskable (Android)...")
    full = render(rounded=False, content_scale=1.0)
    write_png(OUT / "apple-touch-icon.png", 180, downsample(full, 180))
    maskable = render(rounded=False, content_scale=0.8)  # isi di dalam zona aman 80%
    write_png(OUT / "icon-maskable-512.png", 512, downsample(maskable, 512))


if __name__ == "__main__":
    main()
