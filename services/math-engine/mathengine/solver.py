"""Menyelesaikan soal cerita linear dan menyusun langkah 5 tahap siklus pemodelan.

Tahap: pahami -> rumuskan -> selesaikan -> tafsirkan -> periksa.
"""

from __future__ import annotations

from collections.abc import Callable
from fractions import Fraction

from . import linear
from .explainer import (
    STAGE_HINTS,
    cap,
    fn,
    fq,
    initial_hints,
    known_facts,
    model_hints,
    paren,
    rate_hints,
    rate_phrase,
    solve_hints,
    task_question,
    variable_hints,
)
from .numfmt import format_approx
from .schemas import Answer, LinearModel, Solution, Step, Task

_HandlerResult = tuple[Step | None, Answer, str, list[str]]


class SolveError(ValueError):
    """Soal tidak dapat diselesaikan (data kurang atau tidak konsisten)."""


# ------------------------------------------------------------------ rumuskan


def _formulate_steps(model: LinearModel, multi: bool) -> list[Step]:
    prefix = f"{model.name}: " if multi and model.name else ""
    x, y = model.x, model.y
    steps = [
        Step(
            stage="rumuskan",
            text=f"{prefix}Tentukan variabel: x = {x.meaning} ({x.unit}), y = {y.meaning} ({y.unit}).",
            hints=variable_hints(model),
        )
    ]

    if model.source == "points":
        (x1, y1), (x2, y2) = model.points[0], model.points[1]
        micro = [
            "m = (y₂ − y₁) / (x₂ − x₁)",
            f"m = ({fn(y2)} − {paren(y1)}) / ({fn(x2)} − {paren(x1)})",
            f"m = {fn(y2 - y1)} / {fn(x2 - x1)}",
            f"m = {fn(model.m)}",
        ]
        rate_text = f"{prefix}Hitung laju (m) dari dua data."
    elif model.source == "rise_run":
        assert model.rise is not None and model.run is not None
        micro = [
            "m = tinggi (naik) / jarak mendatar",
            f"m = {fn(model.rise)} / {fn(model.run)}",
            f"m = {fn(model.m)}",
        ]
        rate_text = f"{prefix}Hitung kemiringan (m)."
    else:
        micro = []
        if model.m < 0:
            micro.append(f"{cap(y.meaning)} berkurang, jadi lajunya negatif.")
        micro.append(f"m = {fn(model.m)}")
        rate_text = f"{prefix}Tentukan laju (m): {rate_phrase(model)}."
    steps.append(Step(stage="rumuskan", text=rate_text, micro_steps=micro, hints=rate_hints(model)))

    if model.source == "points":
        x1, y1 = model.points[0]
        micro = [
            "c = y₁ − m × x₁",
            f"c = {fn(y1)} − {paren(model.m)} × {paren(x1)}",
            f"c = {fn(y1)} − {paren(model.m * x1)}",
            f"c = {fn(model.c)}",
        ]
        text = f"{prefix}Hitung nilai awal (c), yaitu {y.meaning} saat x = 0."
    elif model.c == 0:
        micro = ["c = 0"]
        text = f"{prefix}Tidak ada nilai awal, jadi c = 0."
    else:
        micro = [f"c = {fn(model.c)}"]
        text = f"{prefix}Nilai awal (c) = {fq(model.c, y.unit)}."
    steps.append(Step(stage="rumuskan", text=text, micro_steps=micro, hints=initial_hints(model)))

    equation = linear.format_equation(model.m, model.c)
    steps.append(
        Step(
            stage="rumuskan",
            text=f"{prefix}Susun model: {equation}",
            latex=linear.latex_equation(model.m, model.c),
            hints=model_hints(equation),
        )
    )
    return steps


# ---------------------------------------------------------------- tugas


def _domain_check(model: LinearModel, xv: Fraction, yv: Fraction) -> list[str]:
    if linear.in_domain(model, xv):
        return []
    return [
        f"{cap(model.x.meaning)} {fq(xv, model.x.unit)} di luar batas berlakunya model "
        f"({linear.domain_text(model)}). Hasil {fq(yv, model.y.unit)} tidak wajar, "
        "jadi model tidak dapat dipakai di sini."
    ]


def _need(value: Fraction | None, what: str, kind: str) -> Fraction:
    if value is None:
        raise SolveError(f"Tugas '{kind}' membutuhkan nilai {what}.")
    return value


def _predict(models: list[LinearModel], task: Task, key: str) -> _HandlerResult:
    model = models[task.model]
    xv = _need(task.x, "x", task.kind)
    yv = linear.predict(model, xv)
    micro = [f"y = {linear.rhs_text(model.m, model.c)}"]
    product = model.m * xv
    if model.c != 0:
        micro += [
            f"y = {paren(model.m)} × {paren(xv)} + {paren(model.c)}",
            f"y = {fn(product)} + {paren(model.c)}",
        ]
    else:
        micro.append(f"y = {paren(model.m)} × {paren(xv)}")
    micro.append(f"y = {fn(yv)}")
    step = Step(
        stage="selesaikan",
        text=f"Substitusi x = {fn(xv)} ke model.",
        micro_steps=micro,
        hints=solve_hints("predict", f"y = {fn(yv)}"),
    )
    sentence = (
        f"{cap(model.y.meaning)} saat {model.x.meaning} {fq(xv, model.x.unit)} "
        f"adalah {fq(yv, model.y.unit)}."
    )
    answer = Answer(key=key, task="predict", value=yv, unit=model.y.unit, display=fq(yv, model.y.unit))
    return step, answer, sentence, _domain_check(model, xv, yv)


def _mx(model: LinearModel) -> str:
    return linear.rhs_text(model.m, Fraction(0))


def _inverse(models: list[LinearModel], task: Task, key: str) -> _HandlerResult:
    model = models[task.model]
    yv = _need(task.y, "y", task.kind)
    try:
        xv = linear.inverse(model, yv)
    except ValueError as exc:
        raise SolveError(str(exc)) from exc
    micro = [f"{fn(yv)} = {linear.rhs_text(model.m, model.c)}"]
    if model.c != 0:
        micro += [
            f"{fn(yv)} − {paren(model.c)} = {_mx(model)}",
            f"{fn(yv - model.c)} = {_mx(model)}",
        ]
    micro += [f"x = {fn(yv - model.c)} ÷ {paren(model.m)}", f"x = {fn(xv)}"]
    step = Step(
        stage="selesaikan",
        text=f"Cari x saat y = {fn(yv)}.",
        micro_steps=micro,
        hints=solve_hints("inverse", f"x = {fn(xv)}"),
    )
    if yv == 0:
        sentence = f"{cap(model.y.meaning)} menjadi 0 saat {model.x.meaning} {fq(xv, model.x.unit)}."
    else:
        sentence = (
            f"{cap(model.y.meaning)} mencapai {fq(yv, model.y.unit)} saat "
            f"{model.x.meaning} {fq(xv, model.x.unit)}."
        )
    checks = [
        f"Cek: {paren(model.m)} × {paren(xv)} + {paren(model.c)} = {fn(yv)} ✔"
    ] + _domain_check(model, xv, yv)
    answer = Answer(key=key, task="inverse", value=xv, unit=model.x.unit, display=fq(xv, model.x.unit))
    return step, answer, sentence, checks


def _find_rate(models: list[LinearModel], task: Task, key: str) -> _HandlerResult:
    model = models[task.model]
    direction = "berkurang" if model.m < 0 else "bertambah"
    sentence = (
        f"Lajunya {rate_phrase(model)}: setiap {model.x.meaning} bertambah 1 {model.x.unit}, "
        f"{model.y.meaning} {direction} {fq(abs(model.m), model.y.unit)}."
    )
    answer = Answer(key=key, task="find_rate", value=model.m, unit=f"{model.y.unit}/{model.x.unit}",
                    display=rate_phrase(model))
    return None, answer, sentence, []


def _find_initial(models: list[LinearModel], task: Task, key: str) -> _HandlerResult:
    model = models[task.model]
    sentence = (
        f"Nilai awalnya {fq(model.c, model.y.unit)}, yaitu {model.y.meaning} "
        f"saat {model.x.meaning} = 0."
    )
    answer = Answer(key=key, task="find_initial", value=model.c, unit=model.y.unit,
                    display=fq(model.c, model.y.unit))
    return None, answer, sentence, []


def _build_model(models: list[LinearModel], task: Task, key: str) -> _HandlerResult:
    model = models[task.model]
    equation = linear.format_equation(model.m, model.c)
    sentence = (
        f"Model: {equation}, dengan x = {model.x.meaning} ({model.x.unit}) "
        f"dan y = {model.y.meaning} ({model.y.unit})."
    )
    answer = Answer(key=key, task="build_model", display=equation)
    return None, answer, sentence, []


def _two(models: list[LinearModel], kind: str) -> tuple[LinearModel, LinearModel]:
    if len(models) < 2:
        raise SolveError(f"Tugas '{kind}' membutuhkan dua model.")
    return models[0], models[1]


def _name(model: LinearModel, fallback: str) -> str:
    return model.name or fallback


def _intersect(models: list[LinearModel], task: Task, key: str) -> _HandlerResult:
    a, b = _two(models, task.kind)
    na, nb = _name(a, "Model 1"), _name(b, "Model 2")
    point = linear.intersect(a, b)
    if point is None:
        sentence = f"{na} dan {nb} memiliki laju sama, jadi garisnya sejajar dan tidak pernah bernilai sama."
        answer = Answer(key=key, task="intersect", display="tidak berpotongan")
        step = Step(stage="selesaikan", text="Bandingkan laju kedua model.",
                    micro_steps=[f"m₁ = m₂ = {fn(a.m)}"],
                    hints=solve_hints("intersect", "Laju sama: garis sejajar."))
        return step, answer, sentence, []
    xv, yv = point
    micro = [
        f"{linear.rhs_text(a.m, a.c)} = {linear.rhs_text(b.m, b.c)}",
        f"{fn(a.m)}x − {paren(b.m)}x = {fn(b.c)} − {paren(a.c)}",
        f"{fn(a.m - b.m)}x = {fn(b.c - a.c)}",
        f"x = {fn(xv)}",
        f"y = {fn(yv)}",
    ]
    step = Step(stage="selesaikan", text="Samakan kedua model.", micro_steps=micro,
                hints=solve_hints("intersect", f"x = {fn(xv)}"))
    cheaper_after, cheaper_before = (na, nb) if a.m < b.m else (nb, na)
    sentence = (
        f"{na} dan {nb} sama besar saat {a.x.meaning} {fq(xv, a.x.unit)}, yaitu {fq(yv, a.y.unit)}. "
        f"Di atas {fq(xv, a.x.unit)}, {cheaper_after} lebih kecil; di bawahnya, {cheaper_before} lebih kecil."
    )
    answer = Answer(key=key, task="intersect", value=xv, unit=a.x.unit, display=fq(xv, a.x.unit))
    checks = [f"Cek: kedua model menghasilkan {fq(yv, a.y.unit)} saat x = {fn(xv)} ✔"]
    return step, answer, sentence, checks


def _compare(models: list[LinearModel], task: Task, key: str) -> _HandlerResult:
    a, b = _two(models, task.kind)
    na, nb = _name(a, "Model 1"), _name(b, "Model 2")
    xv = _need(task.x, "x", task.kind)
    ya, yb = linear.predict(a, xv), linear.predict(b, xv)
    micro = [
        f"{na}: y = {paren(a.m)} × {paren(xv)} + {paren(a.c)} = {fn(ya)}",
        f"{nb}: y = {paren(b.m)} × {paren(xv)} + {paren(b.c)} = {fn(yb)}",
    ]
    if ya == yb:
        verdict, display = "Keduanya sama besar.", "sama"
    else:
        smaller = na if ya < yb else nb
        verdict, display = f"{smaller} lebih kecil.", smaller
    step = Step(stage="selesaikan", text=f"Hitung kedua model untuk x = {fn(xv)}.", micro_steps=micro,
                hints=solve_hints("compare", verdict))
    sentence = (
        f"Saat {a.x.meaning} {fq(xv, a.x.unit)}, {na}: {fq(ya, a.y.unit)} dan "
        f"{nb}: {fq(yb, b.y.unit)}. {verdict}"
    )
    answer = Answer(key=key, task="compare", display=display)
    return step, answer, sentence, []


def _steepness(models: list[LinearModel], task: Task, key: str) -> _HandlerResult:
    model = models[task.model]
    pct = model.m * 100
    pct_text = fn(pct) if "/" not in fn(pct) else f"≈ {format_approx(pct)}"
    micro = [f"Kemiringan = {fn(model.m)}", f"Persen kemiringan = {fn(model.m)} × 100% = {pct_text}%"]
    step = Step(stage="selesaikan", text="Nyatakan kemiringan sebagai pecahan dan persen.",
                micro_steps=micro, hints=solve_hints("steepness", f"{pct_text}%"))
    sentence = f"Kemiringannya {fn(model.m)}, atau {pct_text.replace('≈ ', 'sekitar ')}%."
    answer = Answer(key=key, task="steepness", value=model.m, display=fn(model.m))
    return step, answer, sentence, []


def _parallel(models: list[LinearModel], task: Task, key: str) -> _HandlerResult:
    model = models[task.model]
    step = Step(stage="selesaikan", text="Garis sejajar memiliki gradien yang sama.",
                micro_steps=["m₂ = m₁", f"m₂ = {fn(model.m)}"],
                hints=solve_hints("parallel", f"m₂ = {fn(model.m)}"))
    sentence = f"Gradien garis yang sejajar adalah {fn(model.m)}."
    answer = Answer(key=key, task="parallel", value=model.m, display=fn(model.m))
    return step, answer, sentence, []


def _perpendicular(models: list[LinearModel], task: Task, key: str) -> _HandlerResult:
    model = models[task.model]
    if model.m == 0:
        raise SolveError("Garis tegak lurus garis mendatar adalah garis tegak; gradiennya tak terdefinisi.")
    m2 = -1 / model.m
    step = Step(stage="selesaikan", text="Gunakan m₁ × m₂ = −1.",
                micro_steps=["m₁ × m₂ = −1", f"m₂ = −1 ÷ {paren(model.m)}", f"m₂ = {fn(m2)}"],
                hints=solve_hints("perpendicular", f"m₂ = {fn(m2)}"))
    sentence = f"Gradien garis yang tegak lurus adalah {fn(m2)}."
    checks = [f"Cek: {paren(model.m)} × {paren(m2)} = −1 ✔"]
    answer = Answer(key=key, task="perpendicular", value=m2, display=fn(m2))
    return step, answer, sentence, checks


_HANDLERS: dict[str, Callable[[list[LinearModel], Task, str], _HandlerResult]] = {
    "predict": _predict,
    "inverse": _inverse,
    "find_rate": _find_rate,
    "find_initial": _find_initial,
    "build_model": _build_model,
    "intersect": _intersect,
    "compare": _compare,
    "steepness": _steepness,
    "parallel": _parallel,
    "perpendicular": _perpendicular,
}


# ---------------------------------------------------------------------- utama


def _generic_checks(models: list[LinearModel]) -> list[str]:
    checks = []
    for model in models:
        if model.source == "rise_run":
            continue
        prefix = f"{model.name}: " if model.name and len(models) > 1 else ""
        checks.append(
            f"{prefix}Jika {model.x.meaning} = 0, maka {model.y.meaning} = "
            f"{fq(model.c, model.y.unit)}. Apakah ini sesuai cerita?"
        )
    return checks


def solve(models: list[LinearModel], tasks: list[Task]) -> Solution:
    if not models:
        raise SolveError("Minimal satu model diperlukan.")
    for task in tasks:
        if not 0 <= task.model < len(models):
            raise SolveError(f"Tugas merujuk model ke-{task.model} yang tidak ada.")
        if task.kind in ("predict", "compare"):
            _need(task.x, "x", task.kind)
        if task.kind == "inverse":
            _need(task.y, "y", task.kind)

    steps: list[Step] = [
        Step(
            stage="pahami",
            text="Pahami soal: cari apa yang ditanyakan dan angka yang penting.",
            micro_steps=[f for m in models for f in known_facts(m)]
            + [f"Ditanya: {task_question(t, models)}" for t in tasks],
            hints=STAGE_HINTS["pahami"],
        )
    ]
    for model in models:
        steps.extend(_formulate_steps(model, multi=len(models) > 1))

    answers: list[Answer] = []
    interpretation: list[str] = []
    reasonableness: list[str] = []
    for i, task in enumerate(tasks, start=1):
        step, answer, sentence, checks = _HANDLERS[task.kind](models, task, f"t{i}")
        if step is not None:
            steps.append(step)
        answers.append(answer)
        interpretation.append(sentence)
        reasonableness.extend(checks)
    reasonableness.extend(_generic_checks(models))

    steps.append(
        Step(
            stage="tafsirkan",
            text="Tafsirkan hasil dalam cerita: tulis artinya lengkap dengan satuan.",
            micro_steps=interpretation,
            hints=STAGE_HINTS["tafsirkan"],
        )
    )
    steps.append(
        Step(
            stage="periksa",
            text="Periksa: apakah hasilnya masuk akal?",
            micro_steps=reasonableness,
            hints=STAGE_HINTS["periksa"],
        )
    )
    forms = [f for m in models for f in linear.accepted_forms(m.m, m.c)]
    return Solution(
        answers=answers,
        steps=steps,
        accepted_forms=list(dict.fromkeys(forms)),
        interpretation=interpretation,
        reasonableness=reasonableness,
    )
