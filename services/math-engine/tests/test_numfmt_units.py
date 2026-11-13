from fractions import Fraction

import pytest
from conftest import load_vectors

from mathengine.numfmt import format_approx, format_number, format_quantity, to_fraction
from mathengine.units import convert, dimension, normalize_unit


@pytest.mark.parametrize("case", load_vectors("fraction.json")["cases"], ids=lambda c: c["input"])
def test_fraction_vectors(case):  # VEC-01
    assert str(to_fraction(case["input"])) == case["expected"]


@pytest.mark.parametrize("bad", load_vectors("fraction.json")["invalid"])
def test_fraction_invalid(bad):
    with pytest.raises(ValueError):
        to_fraction(bad)


def test_bool_is_not_a_number():
    with pytest.raises(ValueError):
        to_fraction(True)


@pytest.mark.parametrize(
    "value, expected",
    [(19000, "19.000"), (Fraction(3, 2), "1,5"), (Fraction(-5, 2), "-2,5"), (Fraction(1, 3), "1/3"),
     (Fraction(-1, 40), "-1/40"), (1500000, "1.500.000"), (0, "0"), (Fraction(1, 4), "0,25")],
)
def test_format_number(value, expected):
    assert format_number(value) == expected


def test_format_quantity():
    assert format_quantity(19000, "rupiah") == "Rp19.000"
    assert format_quantity(-2500, "rupiah") == "-Rp2.500"
    assert format_quantity(8, "km") == "8 km"
    assert format_quantity(Fraction(25, 3), None) == "25/3"
    assert format_quantity(25, "%") == "25%"


def test_format_approx():
    assert format_approx(Fraction(25, 3)) == "8,33"
    assert format_approx(Fraction(1234567, 100)) == "12.345,67"


def test_units():
    assert normalize_unit("Kilometer") == "km"
    assert normalize_unit("Rp") == "rupiah"
    assert dimension("menit") == "waktu"
    assert dimension("lembar") == "banyak"
    assert convert(2, "km", "m") == 2000
    assert convert(90, "menit", "jam") == Fraction(3, 2)
    with pytest.raises(ValueError):
        convert(1, "km", "jam")
