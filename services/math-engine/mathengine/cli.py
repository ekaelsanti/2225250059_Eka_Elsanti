"""Perintah baris: build-content, validate, export-schemas, parse.

Contoh:
    python -m mathengine.cli build-content
    python -m mathengine.cli parse "Harga 1 kg beras Rp14.000. Berapa harga 3,5 kg?"
"""

from __future__ import annotations

import argparse
import json
import sys
from pathlib import Path

from .content import ContentError, build_all, load_glossary, write_output
from .parser import parse
from .schemas import Diagnosis, LinearModel, ParseResult, ProblemSource, Solution, WordProblem

ROOT = Path(__file__).resolve().parents[3]
DEFAULT_SRC = ROOT / "content" / "problems"
DEFAULT_GLOSSARY = ROOT / "content" / "glossary.yaml"
DEFAULT_OUT = ROOT / "apps" / "web" / "src" / "content" / "generated"
DEFAULT_SCHEMAS = ROOT / "shared" / "schemas"


def _build(args: argparse.Namespace, write: bool) -> int:
    glossary = load_glossary(Path(args.glossary))
    try:
        report = build_all(Path(args.src), glossary)
    except ContentError as exc:
        print(f"GAGAL: {exc}", file=sys.stderr)
        return 1
    for w in report.warnings:
        print(f"PERINGATAN: {w}")
    print(f"{len(report.problems)} soal valid.")
    if args.strict and report.warnings:
        print("Mode --strict: ada peringatan, build dihentikan.", file=sys.stderr)
        return 1
    if write:
        files = write_output(report, glossary, Path(args.out))
        print(f"Ditulis ke {args.out}: {', '.join(sorted(files))}")
    return 0


def _export_schemas(args: argparse.Namespace) -> int:
    out = Path(args.out)
    out.mkdir(parents=True, exist_ok=True)
    for name, model in {
        "word-problem": WordProblem, "problem-source": ProblemSource, "linear-model": LinearModel,
        "solution": Solution, "parse-result": ParseResult, "diagnosis": Diagnosis,
    }.items():
        schema = model.model_json_schema(mode="serialization")
        (out / f"{name}.schema.json").write_text(
            json.dumps(schema, ensure_ascii=False, indent=2) + "\n", encoding="utf-8", newline="\n"
        )
    print(f"Skema ditulis ke {out}")
    return 0


def _parse(args: argparse.Namespace) -> int:
    print(parse(args.text).model_dump_json(indent=2))
    return 0


def main(argv: list[str] | None = None) -> int:
    if hasattr(sys.stdout, "reconfigure"):
        sys.stdout.reconfigure(encoding="utf-8", errors="replace")  # type: ignore[union-attr]
        sys.stderr.reconfigure(encoding="utf-8", errors="replace")  # type: ignore[union-attr]
    ap = argparse.ArgumentParser(prog="gradiekan-engine", description="Mesin matematika GradieKAn")
    sub = ap.add_subparsers(dest="cmd", required=True)
    for cmd in ("build-content", "validate"):
        p = sub.add_parser(cmd)
        p.add_argument("--src", default=str(DEFAULT_SRC))
        p.add_argument("--glossary", default=str(DEFAULT_GLOSSARY))
        p.add_argument("--out", default=str(DEFAULT_OUT))
        p.add_argument("--strict", action="store_true", help="Gagal jika ada peringatan")
    p = sub.add_parser("export-schemas")
    p.add_argument("--out", default=str(DEFAULT_SCHEMAS))
    p = sub.add_parser("parse")
    p.add_argument("text")
    args = ap.parse_args(argv)

    if args.cmd == "build-content":
        return _build(args, write=True)
    if args.cmd == "validate":
        return _build(args, write=False)
    if args.cmd == "export-schemas":
        return _export_schemas(args)
    return _parse(args)


if __name__ == "__main__":
    raise SystemExit(main())
