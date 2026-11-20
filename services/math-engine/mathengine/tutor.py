"""F-34 Tanya AI: tutor gradien berbasis Claude API (online, opsional).

Disetujui pemilik proyek 18 Nov 2026 (ADR-08 direvisi, lihat ARCHITECTURE §8).
Privasi: hanya teks pertanyaan dan riwayat obrolan singkat yang dikirim. Tidak ada kode
peserta, nama, atau progres siswa. Isi permintaan tidak dicatat di log.
Kunci API dibaca dari env ANTHROPIC_API_KEY atau berkas services/math-engine/.env
(jangan pernah di-commit, jangan pernah dikirim ke aplikasi siswa).
"""

from __future__ import annotations

import os
from pathlib import Path
from typing import Literal

import anthropic
from pydantic import BaseModel, ConfigDict, Field

MODEL = os.getenv("GRADIEKAN_AI_MODEL", "claude-opus-5-5")
MAX_TURNS = 8

SYSTEM_PROMPT = """Kamu adalah Gradi, tutor matematika ramah di aplikasi GradieKAn untuk siswa SMP kelas VIII di Indonesia.

Topik yang kamu bantu: kemiringan (gradien) garis lurus, persamaan garis y = mx + c, garis sejajar dan tegak lurus, koordinat Kartesius, operasi bilangan negatif dan pecahan yang dibutuhkan untuk menghitung gradien, serta memodelkan soal cerita menjadi y = mx + c (laju = m, nilai awal = c).

Cara menjawab:
- Pakai bahasa Indonesia yang sederhana dan hangat. Kalimat pendek, paling banyak sekitar 25 kata per kalimat.
- Jawaban singkat: 2 sampai 6 kalimat, atau langkah bernomor bila perlu. Satu langkah dalam satu baris.
- Jika siswa meminta jawaban soal latihan, jangan langsung beri jawaban akhir. Beri petunjuk bertahap dan satu pertanyaan pancingan, lalu biarkan siswa mencoba.
- Jika siswa sudah mencoba dan menuliskan jawabannya, periksa dan jelaskan letak kesalahannya dengan ramah. Jangan pernah hanya berkata "Salah".
- Tulis rumus dengan teks biasa, mis. m = (y2 - y1) / (x2 - x1). Jangan pakai LaTeX.
- Hitung dengan pecahan eksak, bukan desimal yang dibulatkan. Periksa ulang tanda negatif.
- Ingatkan siswa bahwa hasil bisa dicek di Lab Grafik bila cocok.
- Jika pertanyaan di luar matematika sekolah, tolak dengan sopan dan ajak kembali ke materi gradien.
- Jangan meminta atau menyimpan nama, sekolah, atau data pribadi siswa."""


class ChatTurn(BaseModel):
    model_config = ConfigDict(extra="forbid")
    role: Literal["user", "assistant"]
    content: str = Field(min_length=1, max_length=1500)


class AskRequest(BaseModel):
    model_config = ConfigDict(extra="forbid")
    question: str = Field(min_length=1, max_length=500)
    history: list[ChatTurn] = Field(default_factory=list, max_length=MAX_TURNS * 2)


class AskResponse(BaseModel):
    answer: str
    source: Literal["ai"] = "ai"


class TutorUnavailable(Exception):
    """AI belum diaktifkan (kunci API tidak ada) atau layanan sedang tidak bisa dihubungi."""

    def __init__(self, message: str, status: int = 503) -> None:
        super().__init__(message)
        self.status = status


def _load_key() -> str | None:
    key = os.getenv("ANTHROPIC_API_KEY")
    if key:
        return key
    env_file = Path(__file__).resolve().parent.parent / ".env"
    if env_file.exists():
        for line in env_file.read_text(encoding="utf-8").splitlines():
            name, _, value = line.partition("=")
            if name.strip() == "ANTHROPIC_API_KEY" and value.strip():
                return value.strip().strip('"').strip("'")
    return None


_client: anthropic.Anthropic | None = None


def _get_client() -> anthropic.Anthropic:
    global _client
    if _client is None:
        key = _load_key()
        if not key:
            raise TutorUnavailable(
                "Tanya AI belum diaktifkan oleh guru (kunci API belum dipasang)."
            )
        _client = anthropic.Anthropic(api_key=key, timeout=60.0)
    return _client


def build_messages(req: AskRequest) -> list[dict[str, str]]:
    """Riwayat terakhir (maks MAX_TURNS pasang) + pertanyaan baru; selalu diawali giliran user."""
    turns = [t.model_dump() for t in req.history[-MAX_TURNS * 2 :]]
    while turns and turns[0]["role"] != "user":
        turns.pop(0)
    return [*turns, {"role": "user", "content": req.question}]


def ask(req: AskRequest) -> AskResponse:
    client = _get_client()
    try:
        response = client.beta.messages.create(
            model=MODEL,
            max_tokens=4000,
            output_config={"effort": "low"},
            betas=["server-side-fallback-2026-07-01"],
            fallbacks="default",
            system=SYSTEM_PROMPT,
            messages=build_messages(req),
        )
    except anthropic.AuthenticationError as exc:
        raise TutorUnavailable(
            "Kunci API tidak valid. Minta guru memeriksa pengaturan AI."
        ) from exc
    except anthropic.PermissionDeniedError as exc:
        raise TutorUnavailable(
            "Kunci API tidak punya izin. Minta guru memeriksa pengaturan AI."
        ) from exc
    except anthropic.RateLimitError as exc:
        raise TutorUnavailable("Gradi sedang sibuk. Coba lagi sebentar, ya.", 429) from exc
    except anthropic.APIStatusError as exc:
        raise TutorUnavailable("Layanan AI sedang bermasalah. Coba lagi nanti.", 502) from exc
    except anthropic.APIConnectionError as exc:
        raise TutorUnavailable(
            "Server tidak bisa terhubung ke layanan AI. Periksa internet.", 502
        ) from exc

    if response.stop_reason == "refusal":
        return AskResponse(
            answer="Maaf, Gradi tidak bisa membantu pertanyaan itu. Yuk, tanya seputar gradien!"
        )
    text = "".join(b.text for b in response.content if b.type == "text").strip()
    return AskResponse(
        answer=text
        or "Maaf, Gradi belum menemukan jawabannya. Coba tulis pertanyaanmu dengan kata lain."
    )
