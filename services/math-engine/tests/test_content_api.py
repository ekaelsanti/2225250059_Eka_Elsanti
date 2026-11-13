"""PY-06 (build-content) dan API-01."""

from pathlib import Path

import pytest
from conftest import ROOT
from fastapi.testclient import TestClient

from mathengine.api import app
from mathengine.content import ContentError, build_all, load_glossary, write_output

SRC = ROOT / "content" / "problems"
GLOSSARY = ROOT / "content" / "glossary.yaml"


def test_bank_builds_without_warnings():
    report = build_all(SRC, load_glossary(GLOSSARY))
    assert len(report.problems) >= 11
    assert report.warnings == []
    for p in report.problems:
        assert p.annotations.asked, f"{p.id} tidak punya kalimat pertanyaan"
        assert all(len(s.hints) == 3 for s in p.solution.steps)
        for span in p.annotations.known:
            assert p.text[span.start:span.end].strip()


def test_variants_have_different_numbers():
    problems = {p.id: p for p in build_all(SRC, load_glossary(GLOSSARY)).problems}
    base, variant = problems["WP-T1-beras"], problems["WP-T1-beras-v1"]
    assert variant.variant_of == "WP-T1-beras"
    assert variant.text != base.text


def test_build_is_deterministic(tmp_path: Path):
    glossary = load_glossary(GLOSSARY)
    first = write_output(build_all(SRC, glossary), glossary, tmp_path / "a")
    second = write_output(build_all(SRC, glossary), glossary, tmp_path / "b")
    assert first == second


def test_bad_source_is_reported(tmp_path: Path):
    (tmp_path / "bad.yaml").write_text(
        "- id: X\n  type: T1\n  context: personal\n  context_level: K-A\n  cognitive_level: pemahaman\n"
        "  title: t\n  text: 'Harga {m} per kg. Berapa?'\n  models: [{x: {meaning: a, unit: kg}, "
        "y: {meaning: b, unit: rupiah}}]\n  tasks: [{kind: build_model}]\n",
        encoding="utf-8",
    )
    with pytest.raises(ContentError):
        build_all(tmp_path, [])


client = TestClient(app)
MODEL = {"x": {"meaning": "jarak tempuh", "unit": "km"}, "y": {"meaning": "biaya", "unit": "rupiah"},
         "m": "2500", "c": "4000"}


def test_health():
    assert client.get("/health").json()["status"] == "ok"


def test_parse_endpoint():
    r = client.post("/v1/parse", json={"text": "Harga 1 kg beras Rp14.000. Berapa harga 3,5 kg?"})
    assert r.status_code == 200
    body = r.json()
    assert body["status"] == "ok" and body["model"]["m"] == "14000"
    assert body["tasks"][0]["x"] == "7/2"


def test_parse_rejects_long_text():
    assert client.post("/v1/parse", json={"text": "a" * 1001}).status_code == 422


def test_parse_rejects_identity_fields():
    r = client.post("/v1/parse", json={"text": "Harga 1 kg Rp1.000.", "participant_code": "S01"})
    assert r.status_code == 422


def test_solve_and_check_endpoints():
    r = client.post("/v1/solve", json={"models": [MODEL], "tasks": [{"kind": "predict", "x": "8"}]})
    assert r.status_code == 200 and r.json()["answers"][0]["display"] == "Rp24.000"
    r = client.post("/v1/check", json={"model": MODEL, "stage": "model", "input": "y = 4000x + 2500"})
    assert r.json()["error_type"] == "RATE_INITIAL_SWAP"
    r = client.post("/v1/check", json={"model": MODEL, "stage": "interpretation", "input": "24000",
                                       "expected": "24000", "unit": "rupiah"})
    assert r.json()["error_type"] == "INTERPRET_NO_UNIT"
    r = client.post("/v1/solve", json={"models": [MODEL], "tasks": [{"kind": "intersect"}]})
    assert r.status_code == 422
