"""F-34 Tanya AI: validasi permintaan, riwayat, dan perilaku tanpa kunci API (tanpa memanggil AI sungguhan)."""

from __future__ import annotations

import pytest
from fastapi.testclient import TestClient

from mathengine import tutor
from mathengine.api import app

client = TestClient(app)


def test_build_messages_keeps_recent_turns_and_starts_with_user() -> None:
    history = [tutor.ChatTurn(role="assistant", content="Halo!")]
    for i in range(12):
        history += [
            tutor.ChatTurn(role="user", content=f"q{i}"),
            tutor.ChatTurn(role="assistant", content=f"a{i}"),
        ]
    req = tutor.AskRequest(question="Apa itu gradien?", history=history[-16:])
    msgs = tutor.build_messages(req)
    assert msgs[0]["role"] == "user"
    assert msgs[-1] == {"role": "user", "content": "Apa itu gradien?"}
    assert len(msgs) <= tutor.MAX_TURNS * 2 + 1


def test_request_rejects_extra_fields_like_participant_code() -> None:
    res = client.post("/v1/ask", json={"question": "gradien?", "participant": "S01"})
    assert res.status_code == 422


def test_request_rejects_too_long_question() -> None:
    res = client.post("/v1/ask", json={"question": "x" * 501})
    assert res.status_code == 422


def test_without_key_returns_friendly_503(monkeypatch: pytest.MonkeyPatch) -> None:
    monkeypatch.setattr(tutor, "_load_key", lambda: None)
    monkeypatch.setattr(tutor, "_client", None)
    assert client.get("/v1/ask/status").json() == {"enabled": False}
    res = client.post("/v1/ask", json={"question": "Apa itu gradien?"})
    assert res.status_code == 503
    assert "belum diaktifkan" in res.json()["detail"]


def test_answer_is_passed_through(monkeypatch: pytest.MonkeyPatch) -> None:
    monkeypatch.setattr(
        tutor, "ask", lambda req: tutor.AskResponse(answer=f"Jawaban untuk: {req.question}")
    )
    res = client.post("/v1/ask", json={"question": "Apa itu gradien?", "history": []})
    assert res.status_code == 200
    assert res.json() == {"answer": "Jawaban untuk: Apa itu gradien?", "source": "ai"}


def test_rmt_context_accepted_and_adds_mediator_role() -> None:
    req = tutor.AskRequest(question="Kenapa?", context={"lesson": "gradien", "phase": "amati"})
    assert "Jalur RMT" in tutor.system_prompt(req.context)
    assert "Jalur RMT" not in tutor.system_prompt(None)
    assert "Jalur RMT" not in tutor.system_prompt(tutor.AskContext(phase="fase-palsu"))


def test_rmt_context_rejects_extra_fields() -> None:
    res = client.post(
        "/v1/ask", json={"question": "q", "context": {"phase": "amati", "student": "S01"}}
    )
    assert res.status_code == 422
