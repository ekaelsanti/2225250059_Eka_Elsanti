import random
from fractions import Fraction

import pytest
from conftest import load_vectors, make_model

from mathengine import linear
from mathengine.numfmt import to_fraction
from mathengine.schemas import SourceModel, Variable


@pytest.mark.parametrize("case", load_vectors("slope.json")["cases"])
def test_slope_vectors(case):  # VEC-01
    p1 = tuple(to_fraction(v) for v in case["p1"])
    p2 = tuple(to_fraction(v) for v in case["p2"])
    result = linear.slope_from_points(p1, p2)
    assert (None if result is None else str(result)) == case["expected"]


def _src(**kw):
    return SourceModel(x=Variable(meaning="x", unit="lembar"), y=Variable(meaning="biaya", unit="rupiah"), **kw)


def test_resolve_from_points():  # PY-01
    model = linear.resolve_model(_src(points=[(10, 35000), (25, 72500)]))
    assert (model.m, model.c, model.source) == (2500, 10000, "points")
    assert isinstance(model.m, Fraction)


def test_resolve_rejects_non_collinear():
    with pytest.raises(ValueError):
        linear.resolve_model(_src(points=[(0, 0), (1, 1), (2, 5)]))


def test_resolve_rise_run():
    model = linear.resolve_model(_src(rise=50, run=600))
    assert model.m == Fraction(1, 12) and model.c == 0


def test_default_domain_for_decreasing_quantity(bensin):
    assert bensin.domain_min == 0
    assert bensin.domain_max == 160


def test_no_upper_domain_for_temperature():
    model = linear.with_default_domain(make_model(Fraction(-3, 2), 28, y=("suhu", "°C")))
    assert model.domain_max is None


def test_equation_formatting():
    assert linear.format_equation(Fraction(2500), Fraction(4000)) == "y = 2.500x + 4.000"
    assert linear.format_equation(Fraction(-1, 40), Fraction(4)) == "y = -(1/40)x + 4"
    assert linear.format_equation(Fraction(3, 2), Fraction(-2)) == "y = 1,5x - 2"
    assert linear.format_equation(Fraction(-1), Fraction(0)) == "y = -x"
    assert linear.format_equation(Fraction(0), Fraction(7)) == "y = 7"
    assert linear.format_equation(Fraction(2500), Fraction(4000), plain=True) == "y = 2500x + 4000"
    assert linear.latex_equation(Fraction(-1, 40), Fraction(4)) == r"y = -\frac{1}{40}x + 4"


def test_intersect_and_parallel():
    a, b = make_model(2000, 6000), make_model(2500, 3000)
    assert linear.intersect(a, b) == (6, 18000)
    assert linear.intersect(a, make_model(2000, 1)) is None


def test_inverse_zero_rate():
    with pytest.raises(ValueError):
        linear.inverse(make_model(0, 5), 5)


def _rand_fraction(rng: random.Random, limit: int) -> Fraction:
    return Fraction(rng.randint(-limit, limit), rng.randint(1, 50))


def test_predict_then_inverse_roundtrip():  # PY-08 (property test, 2000 kasus acak ber-seed)
    rng = random.Random(2026)
    for _ in range(2000):
        m = _rand_fraction(rng, 1000) or Fraction(1)
        c, x = _rand_fraction(rng, 10**6), _rand_fraction(rng, 1000)
        model = make_model(m, c)
        assert linear.inverse(model, linear.predict(model, x)) == x
