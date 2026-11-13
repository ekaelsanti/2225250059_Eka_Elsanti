"""Operasi model linear y = m x + c dengan aritmetika eksak."""

from __future__ import annotations

from fractions import Fraction

from .numfmt import format_number, to_fraction
from .schemas import LinearModel, SourceModel
from .units import can_be_negative

Point = tuple[Fraction, Fraction]


def slope_from_points(p1: Point, p2: Point) -> Fraction | None:
    """Gradien dua titik; None jika tak terdefinisi (x sama)."""
    (x1, y1), (x2, y2) = p1, p2
    if x1 == x2:
        return None
    return Fraction(y2 - y1) / (x2 - x1)


def initial_from_point(m: Fraction, p: Point) -> Fraction:
    return p[1] - m * p[0]


def predict(model: LinearModel, x: object) -> Fraction:
    return model.m * to_fraction(x) + model.c


def inverse(model: LinearModel, y: object) -> Fraction:
    if model.m == 0:
        raise ValueError("Laju bernilai 0, sehingga x tidak dapat ditentukan dari y.")
    return (to_fraction(y) - model.c) / model.m


def intersect(a: LinearModel, b: LinearModel) -> Point | None:
    """Titik potong dua model; None jika sejajar."""
    if a.m == b.m:
        return None
    x = (b.c - a.c) / (a.m - b.m)
    return x, predict(a, x)


def in_domain(model: LinearModel, x: Fraction) -> bool:
    if model.domain_min is not None and x < model.domain_min:
        return False
    if model.domain_max is not None and x > model.domain_max:
        return False
    return True


def domain_text(model: LinearModel) -> str:
    lo, hi = model.domain_min, model.domain_max
    if lo is not None and hi is not None:
        return f"{format_number(lo)} ≤ x ≤ {format_number(hi)}"
    if lo is not None:
        return f"x ≥ {format_number(lo)}"
    if hi is not None:
        return f"x ≤ {format_number(hi)}"
    return "semua x"


def with_default_domain(model: LinearModel) -> LinearModel:
    """x tidak negatif; untuk besaran yang tidak boleh negatif dan menurun, batas atas = saat y = 0."""
    update: dict[str, Fraction] = {}
    if model.domain_min is None:
        update["domain_min"] = Fraction(0)
    if (
        model.domain_max is None
        and model.m < 0
        and model.c > 0
        and not can_be_negative(model.y.unit)
    ):
        update["domain_max"] = -model.c / model.m
    return model.model_copy(update=update) if update else model


def resolve_model(src: SourceModel) -> LinearModel:
    """Ubah model sumber (m & c, dua titik, atau naik/mendatar) menjadi LinearModel lengkap."""
    points: list[Point] = []
    rise = run = None
    if src.points:
        points = [(to_fraction(a), to_fraction(b)) for a, b in src.points]
        m = slope_from_points(points[0], points[1])
        if m is None:
            raise ValueError("Dua data pertama memiliki x yang sama; laju tidak terdefinisi.")
        c = initial_from_point(m, points[0])
        for x, y in points[2:]:
            if m * x + c != y:
                raise ValueError(f"Data ({x}, {y}) tidak terletak pada garis yang sama.")
        source = "points"
    elif src.rise is not None and src.run is not None:
        if src.run == 0:
            raise ValueError("Jarak mendatar tidak boleh 0.")
        rise, run = src.rise, src.run
        m = rise / run
        c = src.c if src.c is not None else Fraction(0)
        source = "rise_run"
    else:
        assert src.m is not None
        m = src.m
        c = src.c if src.c is not None else Fraction(0)
        source = "direct"
    model = LinearModel(
        name=src.name, x=src.x, y=src.y, m=m, c=c,
        domain_min=src.domain_min, domain_max=src.domain_max,
        source=source, points=points, rise=rise, run=run,
    )
    return with_default_domain(model)


# ------------------------------------------------------------------ penulisan


def _coef(m: Fraction, plain: bool) -> str:
    """Bagian 'mx' tanpa tanda."""
    a = abs(m)
    if a == 1:
        return "x"
    if a.denominator == 1:
        return f"{a.numerator if plain else format_number(a)}x"
    if not plain:
        shown = format_number(a)
        if "/" not in shown:
            return f"{shown}x"
    return f"({a.numerator}/{a.denominator})x"


def _const(c: Fraction, plain: bool) -> str:
    a = abs(c)
    if plain:
        return str(a)
    return format_number(a)


def rhs_text(m: Fraction, c: Fraction, plain: bool = False) -> str:
    """Ruas kanan: '2.500x + 4.000', '-(1/40)x + 4', '3x', '7'."""
    parts: list[str] = []
    if m != 0:
        parts.append(("-" if m < 0 else "") + _coef(m, plain))
    if c != 0 or m == 0:
        if parts:
            parts.append(("- " if c < 0 else "+ ") + _const(c, plain))
        else:
            parts.append(("-" if c < 0 else "") + _const(c, plain))
    return " ".join(parts)


def format_equation(m: Fraction, c: Fraction, plain: bool = False) -> str:
    return f"y = {rhs_text(m, c, plain)}"


def latex_equation(m: Fraction, c: Fraction) -> str:
    def num(v: Fraction) -> str:
        v = abs(v)
        if v.denominator == 1:
            return format_number(v).replace(".", "{.}")
        return rf"\frac{{{v.numerator}}}{{{v.denominator}}}"

    s = "y = "
    if m != 0:
        s += ("-" if m < 0 else "") + ("" if abs(m) == 1 else num(m)) + "x"
        if c != 0:
            s += (" - " if c < 0 else " + ") + num(c)
    else:
        s += ("-" if c < 0 else "") + num(c)
    return s


def accepted_forms(m: Fraction, c: Fraction) -> list[str]:
    """Bentuk persamaan yang diterima (format mesin, tanpa pemisah ribuan)."""
    main = format_equation(m, c, plain=True)
    forms = [main]
    if m != 0 and c != 0:
        mx = ("-" if m < 0 else "") + _coef(m, plain=True)
        cc = str(c)
        forms.append(f"y = {cc} {'-' if m < 0 else '+'} {_coef(m, plain=True)}")
        forms.append(f"y = {mx} + ({cc})" if c < 0 else f"y = {mx} + {cc}")
    return list(dict.fromkeys(forms))
