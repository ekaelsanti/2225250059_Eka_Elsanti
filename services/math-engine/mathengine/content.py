"""Membangun bank soal cerita: YAML (ditulis guru/peneliti) -> JSON lengkap untuk aplikasi."""

from __future__ import annotations

import hashlib
import json
import random
import re
from dataclasses import dataclass, field
from fractions import Fraction
from pathlib import Path
from typing import Any

import yaml

from . import __version__
from .linear import predict, resolve_model
from .numfmt import format_number, to_fraction
from .parser import parse, split_sentences
from .schemas import (
    Annotations,
    GlossaryEntry,
    ProblemSource,
    Span,
    Stimulus,
    WordProblem,
)
from .solver import solve

_PLACEHOLDER = re.compile(r"\{(\w+)\}")
_REF = re.compile(r"^\{(\w+)\}$")


class ContentError(ValueError):
    pass


@dataclass
class BuildReport:
    problems: list[WordProblem] = field(default_factory=list)
    warnings: list[str] = field(default_factory=list)


# --------------------------------------------------------------------- muat


def load_sources(src_dir: Path) -> list[dict[str, Any]]:
    raws: list[dict[str, Any]] = []
    for path in sorted(src_dir.glob("*.yaml")):
        data = yaml.safe_load(path.read_text(encoding="utf-8")) or []
        if not isinstance(data, list):
            raise ContentError(f"{path.name}: isi berkas harus berupa daftar soal.")
        for item in data:
            if not isinstance(item, dict):
                raise ContentError(f"{path.name}: setiap soal harus berupa objek.")
            item.setdefault("_file", path.name)
            raws.append(item)
    return raws


def load_glossary(path: Path) -> list[GlossaryEntry]:
    if not path.exists():
        return []
    data = yaml.safe_load(path.read_text(encoding="utf-8")) or []
    return [GlossaryEntry.model_validate(d) for d in data]


# ------------------------------------------------------------------- susun


def _substitute(obj: Any, params: dict[str, Fraction]) -> Any:
    if isinstance(obj, str):
        m = _REF.match(obj.strip())
        if m:
            if m.group(1) not in params:
                raise ContentError(f"Parameter '{m.group(1)}' tidak didefinisikan di 'params'.")
            return params[m.group(1)]
        return obj
    if isinstance(obj, dict):
        return {k: _substitute(v, params) for k, v in obj.items()}
    if isinstance(obj, list):
        return [_substitute(v, params) for v in obj]
    return obj


def _render(template: str, params: dict[str, Fraction]) -> tuple[str, list[Span]]:
    """Isi {nama} dengan angka format Indonesia; catat posisi angka sebagai info 'diketahui'."""
    out: list[str] = []
    spans: list[Span] = []
    pos = 0
    length = 0
    for m in _PLACEHOLDER.finditer(template):
        name = m.group(1)
        if name not in params:
            raise ContentError(f"Teks memakai {{{name}}} tetapi parameter tidak ada.")
        literal = template[pos:m.start()]
        out.append(literal)
        length += len(literal)
        value = format_number(params[name])
        spans.append(Span(start=length, end=length + len(value)))
        out.append(value)
        length += len(value)
        pos = m.end()
    out.append(template[pos:])
    return "".join(out), spans


def _find_spans(text: str, phrases: list[str]) -> list[Span]:
    spans = []
    for phrase in phrases:
        idx = text.find(phrase)
        if idx < 0:
            raise ContentError(f"Frasa pengecoh '{phrase}' tidak ditemukan di teks.")
        spans.append(Span(start=idx, end=idx + len(phrase)))
    return spans


def build_problem(raw: dict[str, Any], params_override: dict[str, Fraction] | None = None,
                  variant_of: str | None = None, suffix: str = "") -> tuple[WordProblem, list[str]]:
    raw = {k: v for k, v in raw.items() if not k.startswith("_")}
    params = {k: to_fraction(v) for k, v in (raw.get("params") or {}).items()}
    if params_override:
        params.update(params_override)
    resolved = dict(raw)
    resolved["params"] = {k: str(v) for k, v in params.items()}
    for key in ("models", "tasks", "stimulus"):
        if key in resolved and resolved[key] is not None:
            resolved[key] = _substitute(resolved[key], params)
    src = ProblemSource.model_validate(resolved)

    models = [resolve_model(m) for m in src.models]
    text, known = _render(src.text, params)
    asked = [Span(start=s.start, end=s.end) for s in split_sentences(text) if s.is_question]
    distractor = _find_spans(text, src.distractors)

    stimulus = None
    if src.stimulus is not None:
        if not 0 <= src.stimulus.model < len(models):
            raise ContentError("Stimulus merujuk model yang tidak ada.")
        model = models[src.stimulus.model]
        stimulus = Stimulus(kind=src.stimulus.kind, model=src.stimulus.model,
                            rows=[(x, predict(model, x)) for x in src.stimulus.x])

    solution = solve(models, src.tasks)
    problem = WordProblem(
        id=src.id + suffix, module=src.module, type=src.type, context=src.context,
        context_level=src.context_level, cognitive_level=src.cognitive_level, title=src.title,
        text=text, stimulus=stimulus,
        annotations=Annotations(known=known, asked=asked, distractor=distractor),
        models=models, tasks=src.tasks, solution=solution,
        reflection_prompt=src.reflection_prompt, glossary=src.glossary, variant_of=variant_of,
    )
    return problem, _cross_check(problem)


def _cross_check(problem: WordProblem) -> list[str]:
    """Bandingkan model penulis dengan hasil parser - menangkap teks yang tidak sesuai model."""
    if problem.type not in ("T1", "T2", "T3", "T6", "T8") or len(problem.models) != 1:
        return []
    result = parse(problem.text)
    expected = problem.models[0]
    if result.model is None:
        return [f"{problem.id}: parser belum mengenali soal ini ({'; '.join(result.notes)})."]
    if (result.model.m, result.model.c) != (expected.m, expected.c):
        return [
            f"{problem.id}: parser membaca m={result.model.m}, c={result.model.c}, "
            f"sedangkan model penulis m={expected.m}, c={expected.c}. Periksa teks soal."
        ]
    return []


def _variant_params(src: dict[str, Any]) -> list[dict[str, Fraction]]:
    vary = {k: [to_fraction(v) for v in vals] for k, vals in (src.get("vary") or {}).items()}
    count = int(src.get("variants") or 0)
    if not vary or count == 0:
        return []
    base = {k: to_fraction(v) for k, v in (src.get("params") or {}).items()}
    rng = random.Random(int(src.get("seed") or 0))
    seen = {tuple(base.get(k) for k in sorted(vary))}
    out: list[dict[str, Fraction]] = []
    for _ in range(count * 30):
        choice = {k: rng.choice(vals) for k, vals in sorted(vary.items())}
        key = tuple(choice[k] for k in sorted(vary))
        if key in seen:
            continue
        seen.add(key)
        out.append(choice)
        if len(out) == count:
            break
    return out


def build_all(src_dir: Path, glossary: list[GlossaryEntry] | None = None) -> BuildReport:
    report = BuildReport()
    terms = {g.term for g in glossary or []}
    ids: set[str] = set()
    for raw in load_sources(src_dir):
        where = f"{raw.get('_file')}:{raw.get('id', '?')}"
        try:
            base, warnings = build_problem(raw)
            items = [(base, warnings)]
            for i, params in enumerate(_variant_params(raw), start=1):
                items.append(build_problem(raw, params, variant_of=base.id, suffix=f"-v{i}"))
        except (ContentError, ValueError) as exc:
            raise ContentError(f"{where}: {exc}") from exc
        for problem, warnings in items:
            if problem.id in ids:
                raise ContentError(f"{where}: id '{problem.id}' ganda.")
            ids.add(problem.id)
            missing = [t for t in problem.glossary if t not in terms]
            if missing:
                raise ContentError(f"{where}: istilah {missing} belum ada di glossary.yaml.")
            report.problems.append(problem)
            report.warnings.extend(warnings)
    report.problems.sort(key=lambda p: p.id)
    return report


# ------------------------------------------------------------------ tulis


def _dump(data: Any) -> str:
    return json.dumps(data, ensure_ascii=False, indent=2) + "\n"


def write_output(report: BuildReport, glossary: list[GlossaryEntry], out_dir: Path) -> dict[str, str]:
    out_dir.mkdir(parents=True, exist_ok=True)
    files: dict[str, str] = {}
    by_module: dict[str, list[dict[str, Any]]] = {}
    for p in report.problems:
        by_module.setdefault(p.module, []).append(p.model_dump(mode="json"))
    for module, items in sorted(by_module.items()):
        files[f"word-problems.{module}.json"] = _dump({"module": module, "problems": items})
    files["glossary.json"] = _dump([g.model_dump(mode="json") for g in glossary])
    manifest = {
        "engine_version": __version__,
        "problem_count": len(report.problems),
        "files": {name: hashlib.sha256(body.encode("utf-8")).hexdigest() for name, body in sorted(files.items())},
    }
    files["manifest.json"] = _dump(manifest)
    for name, body in files.items():
        (out_dir / name).write_text(body, encoding="utf-8", newline="\n")
    return files
