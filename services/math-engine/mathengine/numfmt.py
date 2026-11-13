"""Bilangan eksak (Fraction) dan format angka gaya Indonesia.

Aturan penulisan angka Indonesia:
- titik sebagai pemisah ribuan  -> "12.000" = 12000
- koma sebagai pemisah desimal  -> "2,5"    = 5/2
"""

from __future__ import annotations

import re
from fractions import Fraction

_THOUSANDS = re.compile(r"^-?\d{1,3}(\.\d{3})+(,\d+)?$")


def to_fraction(value: object) -> Fraction:
    """Ubah int, str ("3/2", "2,5", "12.000", "-7"), float, atau sympy.Rational ke Fraction."""
    if isinstance(value, Fraction):
        return value
    if isinstance(value, bool):
        raise ValueError("boolean bukan bilangan")
    if isinstance(value, int):
        return Fraction(value)
    if isinstance(value, float):
        return Fraction(str(value))
    if hasattr(value, "p") and hasattr(value, "q"):  # sympy Integer / Rational
        return Fraction(int(value.p), int(value.q))  # type: ignore[attr-defined]
    if isinstance(value, str):
        s = value.strip().replace("−", "-").replace(" ", "")
        if not s:
            raise ValueError("bilangan kosong")
        try:
            if "/" in s:
                num, den = s.split("/", 1)
                return to_fraction(num) / to_fraction(den)
            if _THOUSANDS.match(s):
                s = s.replace(".", "")
            return Fraction(s.replace(",", "."))
        except (ValueError, ZeroDivisionError) as exc:
            raise ValueError(f"bukan bilangan yang valid: {value!r}") from exc
    raise ValueError(f"tipe tidak didukung: {type(value).__name__}")


def frac_str(value: Fraction) -> str:
    """Bentuk mesin: "5/2", "-1/40", "4"."""
    return str(to_fraction(value))


def _group(n: int) -> str:
    return f"{n:,}".replace(",", ".")


def format_number(value: object, max_decimals: int = 2) -> str:
    """Format tampilan Indonesia: 19000 -> "19.000", 3/2 -> "1,5", 1/3 -> "1/3"."""
    f = to_fraction(value)
    sign = "-" if f < 0 else ""
    a = abs(f)
    if a.denominator == 1:
        return sign + _group(a.numerator)
    for k in range(1, max_decimals + 1):
        scaled = a * 10**k
        if scaled.denominator == 1:
            whole, frac = divmod(scaled.numerator, 10**k)
            return f"{sign}{_group(whole)},{str(frac).zfill(k)}"
    return f"{sign}{a.numerator}/{a.denominator}"


def format_approx(value: object, decimals: int = 2) -> str:
    """Pembulatan desimal untuk tampilan, mis. 25/3 -> "8,33"."""
    f = to_fraction(value)
    q = round(f, decimals)
    s = f"{float(q):,.{decimals}f}"
    whole, _, frac = s.partition(".")
    whole = whole.replace(",", ".")
    frac = frac.rstrip("0")
    return f"{whole},{frac}" if frac else whole


def format_quantity(value: object, unit: str | None) -> str:
    """19000 + "rupiah" -> "Rp19.000"; 8 + "km" -> "8 km"; 25 + "%" -> "25%"."""
    f = to_fraction(value)
    sign = "-" if f < 0 else ""
    n = format_number(abs(f))
    if not unit:
        return sign + n
    if unit == "rupiah":
        return f"{sign}Rp{n}"
    if unit == "%":
        return f"{sign}{n}%"
    return f"{sign}{n} {unit}"
