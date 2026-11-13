"""Memeriksa jawaban siswa dan memberi diagnosis kesalahan yang spesifik dan ramah.

Jenis kesalahan mengikuti docs/MODELING_ENGINE.md §7 dan docs/CONTENT_SPEC.md §8.
"""

from __future__ import annotations

import re
from fractions import Fraction

from sympy import Poly, Symbol, expand, nsimplify
from sympy.parsing.sympy_parser import (
    convert_xor,
    implicit_multiplication_application,
    parse_expr,
    standard_transformations,
)

from .numfmt import format_quantity, to_fraction
from .parser.numbers import parse_all_numbers, parse_first_number
from .schemas import Diagnosis, LinearModel
from .units import unit_words

X, Y = Symbol("x"), Symbol("y")
_TRANSFORMS = standard_transformations + (implicit_multiplication_application, convert_xor)
_SAFE_RE = re.compile(r"^[0-9xy+\-*/().=\s^]+$")
_UNIT_FACTORS = [Fraction(k) for k in (10, 100, 1000, 60, 24)] + [Fraction(1, k) for k in (10, 100, 1000, 60, 24)]


class EquationError(ValueError):
    """Teks persamaan tidak dapat dibaca."""


def _normalize_equation(text: str) -> str:
    s = text.lower().strip()
    for a, b in (("−", "-"), ("–", "-"), ("×", "*"), ("·", "*"), ("÷", "/"), (":", "/")):
        s = s.replace(a, b)
    s = re.sub(r"rp\.?\s*", "", s)
    s = re.sub(r"(?<=\d)\.(?=\d{3}(?!\d))", "", s)  # pemisah ribuan
    s = s.replace(",", ".")
    return s


def parse_linear_equation(text: str) -> tuple[Fraction, Fraction]:
    """'y = 2.500x + 4.000' -> (m, c). Bentuk apa pun yang setara diterima."""
    s = _normalize_equation(text)
    if len(s) > 120 or not _SAFE_RE.match(s):
        raise EquationError("Gunakan hanya angka, x, y, +, −, ×, /, kurung, dan =.")
    if s.count("=") != 1:
        raise EquationError("Persamaan harus memuat tepat satu tanda '='.")
    lhs, rhs = s.split("=")
    if not lhs.strip() or not rhs.strip():
        raise EquationError("Kedua ruas persamaan harus terisi.")
    try:
        local = {"x": X, "y": Y}
        expr = parse_expr(lhs, local_dict=local, transformations=_TRANSFORMS) - parse_expr(
            rhs, local_dict=local, transformations=_TRANSFORMS
        )
        expr = expand(nsimplify(expr, rational=True))
        poly = Poly(expr, X, Y)
    except Exception as exc:  # noqa: BLE001 - semua kegagalan parse dilaporkan ramah
        raise EquationError("Persamaan belum dapat dibaca. Contoh penulisan: y = 2500x + 4000") from exc
    if poly.total_degree() > 1:
        raise EquationError("Model harus linear (tanpa x², y², atau x·y).")
    a_y = poly.coeff_monomial(Y)
    if a_y == 0:
        raise EquationError("Persamaan harus memuat y.")
    a_x, k = poly.coeff_monomial(X), poly.coeff_monomial(1)
    return to_fraction(-a_x / a_y), to_fraction(-k / a_y)


def _ok(message: str = "Tepat! 🎉") -> Diagnosis:
    return Diagnosis(correct=True, message=message)


def _bad(error_type: str, message: str) -> Diagnosis:
    return Diagnosis(correct=False, error_type=error_type, message=message)


def diagnose_model(model: LinearModel, m: Fraction, c: Fraction) -> Diagnosis:
    """Bandingkan m dan c siswa dengan model yang benar."""
    em, ec = model.m, model.c
    if m == em and c == ec:
        return _ok("Modelmu tepat!")
    if m == ec and c == em and em != ec:
        return _bad("RATE_INITIAL_SWAP",
                    f"Angka yang dikalikan x adalah laju ({model.y.meaning} per {model.x.unit}). "
                    "Nilai awal ditambahkan sekali saja.")
    if m == em and c == 0 and ec != 0:
        return _bad("MISSING_INITIAL", "Ada nilai awal pada cerita. Sudah dimasukkan ke model?")
    if em != 0 and m == -em and c == ec:
        if em < 0:
            return _bad("SIGN_DIRECTION", f"{model.y.meaning.capitalize()} berkurang, jadi lajunya negatif.")
        return _bad("SIGN_DIRECTION", f"{model.y.meaning.capitalize()} bertambah, jadi lajunya positif.")
    if em != 0 and m == 1 / em and c == -ec / em:
        return _bad("VAR_ROLE_SWAP",
                    f"Sepertinya x dan y tertukar. {model.y.meaning.capitalize()} bergantung pada "
                    f"{model.x.meaning}, jadi {model.y.meaning} adalah y.")
    if c == ec and any(m == em * f for f in _UNIT_FACTORS):
        return _bad("UNIT_MISMATCH", "Lajunya sudah hampir benar. Periksa satuannya: apakah sudah disamakan?")
    if model.source == "points" and len(model.points) >= 2 and any(
        px != 0 and m == py / px for px, py in model.points
    ):
        return _bad("RATE_FROM_TOTAL", "Laju dihitung dari selisih dua data, bukan dari satu total.")
    if m == em:
        return _bad("WRONG_INITIAL", "Lajunya sudah benar. Periksa lagi nilai awalnya (y saat x = 0).")
    if c == ec:
        return _bad("WRONG_RATE", "Nilai awalnya sudah benar. Periksa lagi lajunya.")
    return _bad("WRONG_MODEL", "Modelnya belum tepat. Coba tentukan dulu laju dan nilai awalnya.")


def check_model(model: LinearModel, text: str) -> Diagnosis:
    try:
        m, c = parse_linear_equation(text)
    except EquationError as exc:
        return _bad("PARSE_ERROR", str(exc))
    return diagnose_model(model, m, c)


def check_number(expected: object, text: str) -> Diagnosis:
    """Periksa jawaban angka (hasil hitung)."""
    exp = to_fraction(expected)
    got = parse_first_number(text)
    if got is None:
        return _bad("PARSE_ERROR", "Isi dengan angka, ya.")
    if got == exp:
        return _ok("Hitunganmu tepat!")
    if exp != 0 and got == -exp:
        return _bad("SIGN_ERROR", "Hampir! Cek tandanya. Kurang negatif sama dengan tambah.")
    if exp != 0 and got == 1 / exp:
        return _bad("INVERTED_RATIO", "Ingat: naik dibagi jalan. Δy di atas, Δx di bawah.")
    if any(got == exp * f for f in _UNIT_FACTORS):
        return _bad("UNIT_MISMATCH", "Angkanya mirip, tapi satuannya berbeda. Samakan satuannya dulu.")
    return _bad("ARITH_ERROR", "Belum tepat. Coba 🔢 Hitung pelan-pelan.")


def _mentions_unit(text: str, unit: str | None) -> bool:
    lowered = text.lower()
    if unit == "rupiah":
        return bool(re.search(r"\brp|\brupiah\b", lowered))
    if unit == "%":
        return "%" in lowered or "persen" in lowered
    return any(re.search(rf"(?<![a-z]){re.escape(w.lower())}(?![a-z])", lowered) for w in unit_words(unit))


def check_interpretation(expected: object, unit: str | None, text: str) -> Diagnosis:
    """Tafsiran: angka harus benar dan satuan harus disebut. Makna kalimat dinilai rubrik (manusia).

    Kalimat wajar memuat angka lain ("biaya 6 bulan adalah Rp1.150.000"), jadi cukup salah satu cocok.
    """
    target = to_fraction(expected)
    numbers = parse_all_numbers(text)
    if target not in numbers:
        return check_number(target, str(numbers[-1]) if numbers else text)
    if unit and not _mentions_unit(text, unit):
        return _bad("INTERPRET_NO_UNIT",
                    f"Angkanya benar. Tuliskan juga satuannya: {format_quantity(expected, unit)}.")
    return _ok("Tafsiranmu lengkap dengan satuan!")


def check_variables(model: LinearModel, x_meaning: str, y_meaning: str) -> Diagnosis:
    def norm(s: str) -> str:
        return " ".join(s.lower().split())

    x, y = norm(x_meaning), norm(y_meaning)
    ex, ey = norm(model.x.meaning), norm(model.y.meaning)
    if x == ex and y == ey:
        return _ok("Variabelnya tepat!")
    if x == ey and y == ex:
        return _bad("VAR_ROLE_SWAP",
                    f"{model.y.meaning.capitalize()} bergantung pada {model.x.meaning}, "
                    f"jadi {model.y.meaning} adalah y.")
    return _bad("WRONG_VARIABLE", "Coba lagi: apa yang mempengaruhi (x) dan apa yang dipengaruhi (y)?")


def is_reasonable(model: LinearModel, x: object) -> bool:
    """Apakah x berada dalam domain model."""
    xv = to_fraction(x)
    lo, hi = model.domain_min, model.domain_max
    return (lo is None or xv >= lo) and (hi is None or xv <= hi)
