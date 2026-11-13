import pytest
from conftest import load_vectors, make_model

from mathengine.checker import (
    check_interpretation,
    check_model,
    check_number,
    check_variables,
    is_reasonable,
)


@pytest.mark.parametrize("case", load_vectors("model-check.json")["cases"], ids=lambda c: c["input"])
def test_model_check_vectors(case):  # PY-03, VEC-01
    model = make_model(case["m"], case["c"])
    diagnosis = check_model(model, case["input"])
    assert diagnosis.error_type == case["expected"]
    assert diagnosis.correct is (case["expected"] is None)
    assert diagnosis.message


def test_rate_from_total():
    from mathengine.linear import resolve_model
    from mathengine.schemas import SourceModel, Variable

    model = resolve_model(SourceModel(x=Variable(meaning="berat", unit="kg"),
                                      y=Variable(meaning="biaya", unit="rupiah"),
                                      points=[(3, 36000), (5, 56000)]))
    assert check_model(model, "y = 11200x + 6000").error_type == "RATE_FROM_TOTAL"


def test_rejects_unsafe_input(ojek):
    for text in ("y = __import__('os')", "y = x; import os", "y = exp(x)"):
        assert check_model(ojek, text).error_type == "PARSE_ERROR"


@pytest.mark.parametrize(
    "expected, text, error",
    [(19000, "19.000", None), (19000, "Rp19.000", None), ("-7/3", "-7/3", None), ("3/2", "1,5", None),
     (-2, "2", "SIGN_ERROR"), ("2/3", "3/2", "INVERTED_RATIO"), (8, "8000", "UNIT_MISMATCH"),
     (19000, "18000", "ARITH_ERROR"), (5, "lima", "PARSE_ERROR")],
)
def test_check_number(expected, text, error):
    assert check_number(expected, text).error_type == error


def test_interpretation_needs_unit():  # F-29
    assert check_interpretation(19000, "rupiah", "Biaya ke sekolah Rp19.000").correct
    assert check_interpretation(8, "km", "Paling jauh 8 kilometer").correct
    assert check_interpretation(19000, "rupiah", "19000").error_type == "INTERPRET_NO_UNIT"
    assert check_interpretation(19000, "rupiah", "Rp18.000").error_type == "ARITH_ERROR"
    # angka lain di kalimat tidak boleh membuat tafsiran dinilai salah
    assert check_interpretation(1150000, "rupiah", "Total biaya 6 bulan adalah Rp1.150.000").correct
    assert check_interpretation(25000, "rupiah", "Biaya 8 km adalah Rp24.000").error_type == "ARITH_ERROR"


def test_variables(ojek):  # PY-04
    assert check_variables(ojek, "jarak tempuh", "biaya").correct
    assert check_variables(ojek, "biaya", "jarak tempuh").error_type == "VAR_ROLE_SWAP"
    assert check_variables(ojek, "waktu", "biaya").error_type == "WRONG_VARIABLE"


def test_is_reasonable(bensin):
    assert is_reasonable(bensin, 100)
    assert not is_reasonable(bensin, 200)
    assert not is_reasonable(bensin, -1)
