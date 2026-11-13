import json
from pathlib import Path

import pytest

from mathengine.schemas import LinearModel, Variable

ROOT = Path(__file__).resolve().parents[3]
VECTORS = ROOT / "shared" / "test-vectors"


def load_vectors(name: str) -> dict:
    return json.loads((VECTORS / name).read_text(encoding="utf-8"))


def make_model(m, c, x=("jarak tempuh", "km"), y=("biaya", "rupiah"), **kw) -> LinearModel:
    return LinearModel(x=Variable(meaning=x[0], unit=x[1]), y=Variable(meaning=y[0], unit=y[1]), m=m, c=c, **kw)


@pytest.fixture
def ojek():
    return make_model(2500, 4000)


@pytest.fixture
def bensin():
    from mathengine.linear import with_default_domain

    return with_default_domain(make_model("-1/40", 4, y=("sisa bensin", "liter")))
