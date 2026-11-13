"""Satuan dan konversi satuan."""

from __future__ import annotations

from fractions import Fraction

from .numfmt import to_fraction

_ALIASES: dict[str, str] = {
    # panjang
    "kilometer": "km", "km": "km", "meter": "m", "m": "m",
    "sentimeter": "cm", "centimeter": "cm", "cm": "cm", "milimeter": "mm", "mm": "mm",
    # volume
    "liter": "liter", "l": "liter", "mililiter": "ml", "ml": "ml",
    # waktu
    "jam": "jam", "menit": "menit", "detik": "detik", "hari": "hari",
    "minggu": "minggu", "bulan": "bulan", "tahun": "tahun",
    # massa
    "kilogram": "kg", "kg": "kg", "gram": "gram", "g": "gram", "ons": "ons",
    # data
    "gb": "GB", "mb": "MB",
    # uang, persen, suhu
    "rp": "rupiah", "rupiah": "rupiah", "%": "%", "persen": "%",
    "°c": "°C", "° c": "°C", "derajat": "°C", "derajat celsius": "°C",
}

COUNT_UNITS = {"lembar", "buah", "orang", "bungkus", "botol", "kotak", "halaman"}

_DIM: dict[str, tuple[str, Fraction]] = {
    "km": ("panjang", Fraction(1000)), "m": ("panjang", Fraction(1)),
    "cm": ("panjang", Fraction(1, 100)), "mm": ("panjang", Fraction(1, 1000)),
    "liter": ("volume", Fraction(1)), "ml": ("volume", Fraction(1, 1000)),
    "detik": ("waktu", Fraction(1)), "menit": ("waktu", Fraction(60)),
    "jam": ("waktu", Fraction(3600)), "hari": ("waktu", Fraction(86400)),
    "minggu": ("waktu", Fraction(604800)),
    "kg": ("massa", Fraction(1000)), "gram": ("massa", Fraction(1)), "ons": ("massa", Fraction(100)),
    "GB": ("data", Fraction(1024)), "MB": ("data", Fraction(1)),
}


def normalize_unit(unit: str | None) -> str | None:
    if unit is None:
        return None
    u = " ".join(unit.strip().lower().rstrip(".").split())
    return _ALIASES.get(u, u)


def unit_words(unit: str | None) -> list[str]:
    """Semua kata yang dapat menyatakan satuan ini di teks."""
    canon = normalize_unit(unit)
    if canon is None:
        return []
    words = {alias for alias, c in _ALIASES.items() if c == canon and len(alias) > 1}
    words.add(canon.lower())
    return sorted(words, key=len, reverse=True)


def dimension(unit: str | None) -> str | None:
    canon = normalize_unit(unit)
    if canon in _DIM:
        return _DIM[canon][0]
    if canon in COUNT_UNITS:
        return "banyak"
    return None


def conversion_factor(from_unit: str, to_unit: str) -> Fraction:
    a, b = normalize_unit(from_unit), normalize_unit(to_unit)
    if a == b:
        return Fraction(1)
    if a not in _DIM or b not in _DIM or _DIM[a][0] != _DIM[b][0]:
        raise ValueError(f"Satuan {from_unit!r} tidak dapat diubah ke {to_unit!r}")
    return _DIM[a][1] / _DIM[b][1]


def convert(value: object, from_unit: str, to_unit: str) -> Fraction:
    return to_fraction(value) * conversion_factor(from_unit, to_unit)


def can_be_negative(unit: str | None) -> bool:
    """Besaran seperti uang, volume, jarak tidak bernilai negatif dalam soal cerita; suhu bisa."""
    return normalize_unit(unit) == "°C"
