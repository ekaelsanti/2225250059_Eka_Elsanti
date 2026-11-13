"""Mengenali bilangan bergaya Indonesia di teks: "Rp12.000", "2,5", "1,5 juta", "setengah"."""

from __future__ import annotations

import re
from fractions import Fraction

from ..numfmt import to_fraction

NUMBER_RE = re.compile(
    r"(?P<rp>\brp\.?\s*)?"
    r"(?P<num>\d{1,3}(?:\.\d{3})+(?:,\d+)?|\d+(?:,\d+)?)"
    r"(?:\s*(?P<mult>ribu|rb|juta|jt)(?![a-z]))?",
    re.IGNORECASE,
)

WORD_VALUES: dict[str, Fraction] = {
    "setengah": Fraction(1, 2), "seperempat": Fraction(1, 4), "sepertiga": Fraction(1, 3),
    "satu": Fraction(1), "dua": Fraction(2), "tiga": Fraction(3), "empat": Fraction(4),
    "lima": Fraction(5), "enam": Fraction(6), "tujuh": Fraction(7), "delapan": Fraction(8),
    "sembilan": Fraction(9), "sepuluh": Fraction(10), "seratus": Fraction(100),
    "seribu": Fraction(1000),
}

WORD_NUMBER_RE = re.compile(
    r"\b(?P<word>" + "|".join(sorted(WORD_VALUES, key=len, reverse=True)) + r")\b",
    re.IGNORECASE,
)

_MULT = {"ribu": 1000, "rb": 1000, "juta": 10**6, "jt": 10**6}

_FRACTION_INPUT_RE = re.compile(r"-?\s*\d[\d.,]*\s*/\s*-?\s*\d[\d.,]*")
_SIGNED_NUMBER_RE = re.compile(
    r"(?P<neg>-\s*)?(?:rp\.?\s*)?(?P<num>\d{1,3}(?:\.\d{3})+(?:,\d+)?|\d+(?:[.,]\d+)?)"
    r"(?:\s*(?P<mult>ribu|rb|juta|jt)(?![a-z]))?",
    re.IGNORECASE,
)


def value_of(match: re.Match[str]) -> Fraction:
    value = to_fraction(match.group("num"))
    mult = match.group("mult")
    if mult:
        value *= _MULT[mult.lower()]
    return value


_ANY_NUMBER_RE = re.compile(f"{_FRACTION_INPUT_RE.pattern}|{_SIGNED_NUMBER_RE.pattern}", re.IGNORECASE)


def parse_all_numbers(text: str) -> list[Fraction]:
    """Semua bilangan dalam kalimat, berurutan."""
    s = text.replace("−", "-").replace("–", "-")
    out = []
    for m in _ANY_NUMBER_RE.finditer(s):
        value = parse_first_number(m.group(0))
        if value is not None:
            out.append(value)
    return out


def parse_first_number(text: str) -> Fraction | None:
    """Bilangan pertama pada jawaban siswa: "-7/3", "1,5", "Rp25.000", "25 ribu"."""
    s = text.replace("−", "-").replace("–", "-")
    frac = _FRACTION_INPUT_RE.search(s)
    if frac:
        try:
            return to_fraction(frac.group(0).replace(" ", ""))
        except ValueError:
            pass
    m = _SIGNED_NUMBER_RE.search(s)
    if not m:
        return None
    raw = m.group("num")
    # "2.5" (gaya Inggris) diterima sebagai desimal bila bukan pola ribuan.
    if "." in raw and not re.fullmatch(r"\d{1,3}(\.\d{3})+(,\d+)?", raw):
        raw = raw.replace(".", ",")
    value = to_fraction(raw)
    if m.group("mult"):
        value *= _MULT[m.group("mult").lower()]
    return -value if m.group("neg") else value
