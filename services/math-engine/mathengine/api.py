"""API FastAPI untuk fitur online (F-31 Modelkan Soalku).

Privasi: tidak menerima data identitas siswa dan tidak mencatat isi permintaan.
Jalankan: uvicorn mathengine.api:app --reload
"""

from __future__ import annotations

import os
import time
from collections import defaultdict, deque
from typing import Literal

from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel, ConfigDict, Field

from . import __version__, tutor
from .checker import check_interpretation, check_model, check_number, check_variables
from .parser import parse
from .schemas import Diagnosis, Frac, LinearModel, ParseResult, Solution, Task
from .solver import SolveError, solve

RATE_LIMIT_PER_MINUTE = int(os.getenv("GRADIEKAN_RATE_LIMIT", "60"))
ALLOWED_ORIGINS = [
    o.strip()
    for o in os.getenv("GRADIEKAN_ALLOWED_ORIGINS", "http://localhost:5173,http://127.0.0.1:5173").split(",")
    if o.strip()
]

app = FastAPI(
    title="GradieKAn Math Engine",
    version=__version__,
    description="Parser, solver, dan pemeriksa model soal cerita linear (bahasa Indonesia).",
)
app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_methods=["GET", "POST"],
    allow_headers=["Content-Type"],
)

_hits: dict[str, deque[float]] = defaultdict(deque)


@app.middleware("http")
async def rate_limit(request: Request, call_next):  # type: ignore[no-untyped-def]
    if request.url.path.startswith("/v1/"):
        ip = request.client.host if request.client else "unknown"
        now = time.monotonic()
        window = _hits[ip]
        while window and now - window[0] > 60:
            window.popleft()
        if len(window) >= RATE_LIMIT_PER_MINUTE:
            return JSONResponse(status_code=429, content={"detail": "Terlalu banyak permintaan. Coba lagi sebentar."})
        window.append(now)
    return await call_next(request)


class _Req(BaseModel):
    model_config = ConfigDict(extra="forbid", arbitrary_types_allowed=True)


class ParseRequest(_Req):
    text: str = Field(min_length=1, max_length=1000)


class SolveRequest(_Req):
    models: list[LinearModel] = Field(min_length=1, max_length=2)
    tasks: list[Task] = Field(min_length=1, max_length=10)


class CheckRequest(_Req):
    model: LinearModel
    stage: Literal["variables", "model", "answer", "interpretation"]
    input: str = Field(max_length=300)
    x_meaning: str | None = Field(default=None, max_length=80)
    expected: Frac | None = None
    unit: str | None = Field(default=None, max_length=20)


@app.get("/health")
def health() -> dict[str, str]:
    return {"status": "ok", "version": __version__}


@app.post("/v1/parse", response_model=ParseResult)
def parse_endpoint(req: ParseRequest) -> ParseResult:
    return parse(req.text)


@app.post("/v1/solve", response_model=Solution)
def solve_endpoint(req: SolveRequest) -> Solution:
    try:
        return solve(req.models, req.tasks)
    except SolveError as exc:
        raise HTTPException(status_code=422, detail=str(exc)) from exc


@app.post("/v1/check", response_model=Diagnosis)
def check_endpoint(req: CheckRequest) -> Diagnosis:
    if req.stage == "model":
        return check_model(req.model, req.input)
    if req.stage == "variables":
        if req.x_meaning is None:
            raise HTTPException(status_code=422, detail="x_meaning wajib untuk tahap variables (input = y).")
        return check_variables(req.model, req.x_meaning, req.input)
    if req.expected is None:
        raise HTTPException(status_code=422, detail="expected wajib untuk tahap answer/interpretation.")
    if req.stage == "answer":
        return check_number(req.expected, req.input)
    return check_interpretation(req.expected, req.unit, req.input)


@app.get("/v1/ask/status")
def ask_status() -> dict[str, bool]:
    """F-34: apakah Tanya AI sudah diaktifkan (kunci API terpasang)? Kunci tidak pernah dikirim."""
    return {"enabled": tutor._load_key() is not None}


@app.post("/v1/ask", response_model=tutor.AskResponse)
def ask_endpoint(req: tutor.AskRequest) -> tutor.AskResponse:
    """F-34 Tanya AI. Hanya menerima teks pertanyaan + riwayat singkat, tanpa data siswa."""
    try:
        return tutor.ask(req)
    except tutor.TutorUnavailable as exc:
        raise HTTPException(status_code=exc.status, detail=str(exc)) from exc


@app.post("/v1/explain", response_model=Solution)
def explain_endpoint(req: SolveRequest) -> Solution:
    """Langkah penyelesaian lengkap (sama dengan solve; dipisah agar mudah dibatasi di masa depan)."""
    return solve_endpoint(req)
