from fractions import Fraction

import pytest
from conftest import make_model

from mathengine.linear import resolve_model
from mathengine.schemas import SourceModel, Task, Variable
from mathengine.solver import SolveError, solve


def answers(solution):
    return {a.key: a for a in solution.answers}


def test_ojek_predict_and_inverse(ojek):  # PY-02 (T2, T8)
    sol = solve([ojek], [Task(kind="build_model"), Task(kind="predict", x=6), Task(kind="inverse", y=24000)])
    a = answers(sol)
    assert a["t1"].display == "y = 2.500x + 4.000"
    assert a["t2"].value == 19000 and a["t2"].display == "Rp19.000"
    assert a["t3"].value == 8 and a["t3"].display == "8 km"
    assert "Biaya saat jarak tempuh 6 km adalah Rp19.000." in sol.interpretation
    assert "y = 2500x + 4000" in sol.accepted_forms


def test_all_five_stages_present_in_order(ojek):
    sol = solve([ojek], [Task(kind="predict", x=6)])
    stages = [s.stage for s in sol.steps]
    assert stages[0] == "pahami" and stages[-2:] == ["tafsirkan", "periksa"]
    assert stages.index("rumuskan") < stages.index("selesaikan")
    assert all(len(s.hints) == 3 for s in sol.steps)


def test_inverse_micro_steps(ojek):
    sol = solve([ojek], [Task(kind="inverse", y=30000)])
    step = next(s for s in sol.steps if s.stage == "selesaikan")
    assert step.micro_steps == [
        "30.000 = 2.500x + 4.000",
        "30.000 − 4.000 = 2.500x",
        "26.000 = 2.500x",
        "x = 26.000 ÷ 2.500",
        "x = 10,4",
    ]


def test_bensin_domain_flag(bensin):  # PY-02 (T6) + evaluasi domain
    sol = solve([bensin], [Task(kind="predict", x=100), Task(kind="inverse", y=0), Task(kind="predict", x=200)])
    a = answers(sol)
    assert a["t1"].value == Fraction(3, 2) and a["t1"].display == "1,5 liter"
    assert a["t2"].value == 160
    assert a["t3"].value == -1
    assert any("200 km di luar batas" in r and "tidak wajar" in r for r in sol.reasonableness)
    assert not any("100 km di luar batas" in r for r in sol.reasonableness)
    rate_step = next(s for s in sol.steps if "laju" in s.text.lower())
    assert "Sisa bensin berkurang, jadi lajunya negatif." in rate_step.micro_steps


def test_points_model_steps():  # T3
    model = resolve_model(SourceModel(x=Variable(meaning="banyak foto", unit="lembar"),
                                      y=Variable(meaning="biaya", unit="rupiah"),
                                      points=[(10, 35000), (25, 72500)]))
    sol = solve([model], [Task(kind="find_initial"), Task(kind="find_rate"), Task(kind="predict", x=40)])
    a = answers(sol)
    assert (a["t1"].value, a["t2"].value, a["t3"].value) == (10000, 2500, 110000)
    rate_step = next(s for s in sol.steps if s.text.startswith("Hitung laju"))
    assert rate_step.micro_steps[-2:] == ["m = 37.500 / 15", "m = 2.500"]


def test_two_models_intersect_and_compare():  # T9
    a = make_model(2000, 6000, name="Ojek A")
    b = make_model(2500, 3000, name="Ojek B")
    sol = solve([a, b], [Task(kind="intersect"), Task(kind="compare", x=10)])
    ans = answers(sol)
    assert ans["t1"].value == 6
    assert ans["t2"].display == "Ojek A"
    assert "Di atas 6 km, Ojek A lebih kecil" in sol.interpretation[0]


def test_steepness_percent():  # T7
    model = resolve_model(SourceModel(x=Variable(meaning="jarak mendatar", unit="cm"),
                                      y=Variable(meaning="ketinggian", unit="cm"), rise=50, run=600))
    sol = solve([model], [Task(kind="steepness")])
    assert answers(sol)["t1"].value == Fraction(1, 12)
    assert "sekitar 8,33%" in sol.interpretation[0]


def test_parallel_and_perpendicular():  # T10
    model = make_model(Fraction(2, 3), 0)
    sol = solve([model], [Task(kind="parallel"), Task(kind="perpendicular")])
    a = answers(sol)
    assert a["t1"].value == Fraction(2, 3) and a["t2"].value == Fraction(-3, 2)


def test_errors():
    with pytest.raises(SolveError):
        solve([make_model(1, 0)], [Task(kind="predict")])
    with pytest.raises(SolveError):
        solve([make_model(1, 0)], [Task(kind="intersect")])
    with pytest.raises(SolveError):
        solve([make_model(0, 3)], [Task(kind="perpendicular")])
    with pytest.raises(SolveError):
        solve([make_model(0, 3)], [Task(kind="inverse", y=3)])
