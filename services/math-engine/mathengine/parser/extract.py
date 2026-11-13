"""Teks soal cerita -> kandidat model linear + tugas.

Alur: pecah kalimat -> ambil besaran (angka + satuan + 'per ...') -> tentukan laju,
nilai awal, atau pasangan data -> tentukan tugas dari kalimat pertanyaan -> skor kepercayaan.
Jika ragu, status 'needs_confirmation' beserta pertanyaan untuk pengguna.
"""

from __future__ import annotations

import re
from dataclasses import dataclass
from fractions import Fraction

from ..linear import with_default_domain
from ..numfmt import format_quantity, to_fraction
from ..schemas import ExtractedQuantity, LinearModel, ParseResult, Task, Variable
from ..units import conversion_factor, dimension, normalize_unit, unit_words
from .lexicon import (
    BUILD_MODEL_RE,
    DECREASE_KEYWORDS,
    INITIAL_KEYWORDS,
    INITIAL_QUESTION_RE,
    NOUN_STOPWORDS,
    QUESTION_STARTS,
    RATE_QUESTION_RE,
    REASONING_ONLY_RE,
    RISE_WORDS,
    RUN_WORDS,
    RUPIAH_WORDS,
    STEEPNESS_RE,
    TWO_MODEL_RE,
    UNIT_PATTERN,
    X_GENERIC_WORDS,
    Y_NAME_HINTS,
    ZERO_RE,
)
from .numbers import NUMBER_RE, WORD_NUMBER_RE, WORD_VALUES, value_of

CONFIDENCE_THRESHOLD = 0.7

_SPLIT_RE = re.compile(r"(?<=[.?!])(?<![Rr]p\.)\s+|\n+")
_MARKER_RE = re.compile(r"^\s*[a-e][.)]\s*", re.IGNORECASE)
_TIME_RE = re.compile(r"\b(?:pukul|jam)\s+\d{1,2}[.:]\d{2}\b", re.IGNORECASE)
_ORDINAL_RE = re.compile(r"\b(?P<unit>minggu|hari|bulan|tahun|jam|menit)\s+ke-?\s*(?P<num>\d+)\b", re.IGNORECASE)
_UNIT_AFTER_RE = re.compile(rf"\s*(?P<unit>{UNIT_PATTERN})(?![a-z])", re.IGNORECASE)
_POST_PER_RE = re.compile(
    rf"\s*(?:[a-z]+\s+){{0,2}}?(?:\bper\b|\bsetiap\b|\btiap\b|/)\s*(?:[a-z]+\s+){{0,2}}?"
    rf"(?:(?P<pnum>\d+(?:[.,]\d+)?)\s*)?(?P<punit>{UNIT_PATTERN})(?![a-z])",
    re.IGNORECASE,
)
_PRE_PER_RE = re.compile(rf"(?:\bper\b|\bsetiap\b|\btiap\b)\s+(?P<punit>{UNIT_PATTERN})(?![a-z])", re.IGNORECASE)
_NOUN_RE = re.compile(r"\s+(?P<noun>[a-z]+)", re.IGNORECASE)
_CLAUSE_SPLIT_RE = re.compile(r";|\bsedangkan\b|\bkemudian\b|\blalu\b|\bdan\b", re.IGNORECASE)


# ------------------------------------------------------------------ kalimat


@dataclass
class Sentence:
    index: int
    start: int
    end: int
    text: str
    is_question: bool


def is_question(text: str) -> bool:
    lowered = _MARKER_RE.sub("", text.strip().lower())
    return "?" in text or lowered.startswith(QUESTION_STARTS)


def split_sentences(text: str) -> list[Sentence]:
    pieces: list[tuple[int, int]] = []
    pos = 0
    for m in _SPLIT_RE.finditer(text):
        pieces.append((pos, m.start()))
        pos = m.end()
    pieces.append((pos, len(text)))
    sentences: list[Sentence] = []
    for start, end in pieces:
        raw = text[start:end]
        if not raw.strip():
            continue
        lead = len(raw) - len(raw.lstrip())
        s, e = start + lead, start + len(raw.rstrip())
        body = text[s:e]
        if _MARKER_RE.fullmatch(body + " "):  # hanya penanda "a." / "b)"
            continue
        sentences.append(Sentence(len(sentences), s, e, body, is_question(body)))
    return sentences


# ------------------------------------------------------------------ besaran


@dataclass
class _Q:
    value: Fraction
    unit: str | None
    start: int
    end: int
    sentence: int
    in_question: bool
    noun: str | None = None
    per_unit: str | None = None
    per_value: Fraction | None = None
    role: str = "unknown"


def _overlaps(start: int, end: int, spans: list[tuple[int, int]]) -> bool:
    return any(start < e and s < end for s, e in spans)


def _extract(text: str, sentences: list[Sentence]) -> list[_Q]:
    skip = [(m.start(), m.end()) for m in _TIME_RE.finditer(text)]
    found: list[_Q] = []
    consumed: list[tuple[int, int]] = []

    for sent in sentences:
        seg = text[sent.start:sent.end]
        candidates: list[tuple[int, int, Fraction, str | None]] = []

        for m in _ORDINAL_RE.finditer(seg):
            candidates.append((sent.start + m.start(), sent.start + m.end(),
                               to_fraction(m.group("num")), normalize_unit(m.group("unit"))))
        ordinal_spans = [(s, e) for s, e, _, _ in candidates]

        for m in NUMBER_RE.finditer(seg):
            s, e = sent.start + m.start(), sent.start + m.end()
            if _overlaps(s, e, skip) or _overlaps(s, e, ordinal_spans):
                continue
            unit = "rupiah" if m.group("rp") else None
            candidates.append((s, e, value_of(m), unit))

        for m in WORD_NUMBER_RE.finditer(seg):
            after = _UNIT_AFTER_RE.match(seg, m.end())
            if after:  # kata bilangan hanya dihitung bila diikuti satuan ("setengah jam")
                s = sent.start + m.start()
                candidates.append((s, s + len(m.group(0)), WORD_VALUES[m.group("word").lower()], None))

        candidates.sort(key=lambda c: c[0])
        prev_end = sent.start
        for s, e, value, unit in candidates:
            if _overlaps(s, e, consumed):
                continue
            q = _Q(value=value, unit=unit, start=s, end=e, sentence=sent.index, in_question=sent.is_question)
            if q.unit is None:
                um = _UNIT_AFTER_RE.match(text, q.end, sent.end)
                if um:
                    q.unit = normalize_unit(um.group("unit"))
                    q.end = um.end()
            nm = _NOUN_RE.match(text, q.end, sent.end)
            if nm and nm.group("noun").lower() not in NOUN_STOPWORDS:
                q.noun = nm.group("noun").lower()

            pm = _POST_PER_RE.match(text, q.end, sent.end)
            if pm:
                q.per_unit = normalize_unit(pm.group("punit"))
                q.per_value = to_fraction(pm.group("pnum")) if pm.group("pnum") else Fraction(1)
                consumed.append((q.end, pm.end()))
            else:
                pre = text[max(prev_end, sent.start):q.start]
                pre_matches = list(_PRE_PER_RE.finditer(pre))
                if pre_matches:
                    q.per_unit = normalize_unit(pre_matches[-1].group("punit"))
                    q.per_value = Fraction(1)
            if q.per_unit is not None and q.per_value == 0:
                q.per_unit, q.per_value = None, None
            found.append(q)
            prev_end = max(prev_end, pm.end() if pm else q.end)
    return found


# ----------------------------------------------------------------- bantuan


def _window(text: str, q: _Q, sentences: list[Sentence], before: int = 40, after: int = 30) -> str:
    sent = sentences[q.sentence]
    return text[max(sent.start, q.start - before):min(sent.end, q.end + after)].lower()


def _has_word(text: str, words: tuple[str, ...] | list[str]) -> bool:
    return any(re.search(rf"(?<![a-z]){re.escape(w)}(?![a-z])", text) for w in words)


def _y_words(y_unit: str | None, y_meaning: str, nouns: list[str]) -> list[str]:
    words = list(unit_words(y_unit)) + nouns + [w for w in y_meaning.split() if len(w) > 2]
    if y_unit == "rupiah":
        words += list(RUPIAH_WORDS)
    return words


def _x_words(x_unit: str | None, nouns: list[str]) -> list[str]:
    return list(unit_words(x_unit)) + nouns + list(X_GENERIC_WORDS)


def _x_meaning(x_unit: str | None, noun: str | None) -> str:
    dim = dimension(x_unit)
    if dim == "panjang":
        return "jarak tempuh"
    if dim == "waktu":
        return "waktu"
    if dim == "massa":
        return "berat"
    if dim == "volume":
        return "volume"
    if noun:
        return f"banyak {noun}"
    return f"banyak {x_unit}" if x_unit else "x"


def _y_meaning(lower: str, y_unit: str | None, decreasing: bool, noun: str | None, has_initial: bool) -> str:
    if y_unit == "rupiah":
        if "tabung" in lower:
            return "jumlah tabungan"
        if "harga" in lower and not has_initial:
            return "harga"
        return "biaya"
    for keyword, name in Y_NAME_HINTS:
        if re.search(rf"(?<![a-z]){keyword}(?![a-z])", lower):
            if decreasing and keyword in ("bensin", "kuota", "pulsa", "air"):
                return f"sisa {name}"
            return name
    if noun:
        return f"sisa {noun}" if decreasing else f"banyak {noun}"
    return f"nilai ({y_unit})" if y_unit else "y"


@dataclass
class _Draft:
    kind: str  # rate | pairs | rise_run
    m: Fraction
    c: Fraction
    x_unit: str | None
    y_unit: str | None
    decreasing: bool = False
    has_initial: bool = False
    points: list[tuple[Fraction, Fraction]] | None = None
    rise: Fraction | None = None
    run: Fraction | None = None
    x_noun: str | None = None
    y_noun: str | None = None
    penalty: float = 0.0


# ------------------------------------------------------------ penyusun model


def _rise_run(text: str, lower: str, sentences: list[Sentence], qs: list[_Q], notes: list[str]) -> _Draft | None:
    if not (_has_word(lower, RISE_WORDS) and _has_word(lower, RUN_WORDS)):
        return None
    rise = run = None
    for q in qs:
        if q.in_question or dimension(q.unit) != "panjang":
            continue
        before = text[max(sentences[q.sentence].start, q.start - 30):q.start].lower()
        last_rise = max((before.rfind(w) for w in RISE_WORDS), default=-1)
        last_run = max((before.rfind(w) for w in RUN_WORDS), default=-1)
        if last_run > last_rise and run is None:
            run, q.role = q, "run"
        elif last_rise > last_run and rise is None:
            rise, q.role = q, "rise"
    if rise is None or run is None:
        return None
    run_value = run.value * conversion_factor(run.unit or "", rise.unit or "") if run.unit != rise.unit else run.value
    if run_value == 0:
        return None
    if run.unit != rise.unit:
        notes.append(f"Jarak mendatar diubah ke {rise.unit} agar satuannya sama.")
    return _Draft(kind="rise_run", m=rise.value / run_value, c=Fraction(0), x_unit=rise.unit,
                  y_unit=rise.unit, rise=rise.value, run=run_value)


def _rate_model(text: str, lower: str, sentences: list[Sentence], qs: list[_Q],
                questions: list[str], notes: list[str]) -> _Draft | None:
    rates = [q for q in qs if q.per_unit is not None]
    if not rates:
        return None
    statements = [q for q in qs if not q.in_question]
    question_text = " ".join(s.text.lower() for s in sentences if s.is_question)
    question_qs = [q for q in qs if q.in_question]
    penalty = 0.0

    def score(r: _Q) -> int:
        s = 0
        if any(o is not r and o.unit == r.unit and _has_word(_window(text, o, sentences), INITIAL_KEYWORDS)
               for o in statements):
            s += 1
        if _has_word(question_text, unit_words(r.per_unit)):
            s += 1
        if _has_word(question_text, unit_words(r.unit)):
            s += 1
        if any(q.unit in (r.unit, r.per_unit) for q in question_qs):
            s += 1
        return s

    rate = rates[0]
    if len(rates) > 1:
        ranked = sorted(rates, key=lambda r: (-score(r), r.start))
        rate = ranked[0]
        if score(ranked[0]) > score(ranked[1]):
            penalty += 0.1
            for other in ranked[1:]:
                notes.append(f"{format_quantity(other.value, other.unit)} per {other.per_unit} "
                             "tampaknya informasi pengecoh (tidak dipakai).")
        else:
            penalty += 0.35
            questions.append("Ada lebih dari satu laju ('per'/'setiap'). Laju mana yang dipakai untuk menjawab?")
    rate.role = "rate"

    y_unit, x_unit = rate.unit, rate.per_unit
    if y_unit is None:
        penalty += 0.3
        questions.append("Apa satuan laju pada soal ini?")
    m = rate.value / (rate.per_value or 1)
    decreasing = _has_word(text[sentences[rate.sentence].start:sentences[rate.sentence].end].lower(),
                           DECREASE_KEYWORDS)
    if decreasing:
        m = -m

    pool = [q for q in statements if q is not rate and q.per_unit is None and q.unit == y_unit]
    with_keyword = [q for q in pool if _has_word(_window(text, q, sentences), INITIAL_KEYWORDS)]
    initial = None
    if len(with_keyword) == 1:
        initial = with_keyword[0]
    elif len(with_keyword) > 1:
        initial = with_keyword[0]
        penalty += 0.35
        questions.append("Ada beberapa angka yang mungkin nilai awal. Angka mana yang merupakan nilai awal?")
    else:
        before = [q for q in pool if q.start < rate.start]
        if len(before) == 1:
            initial = before[0]
            penalty += 0.2
            questions.append(
                f"Apakah {format_quantity(initial.value, initial.unit)} adalah nilai awal "
                "(nilai saat x = 0)?"
            )
    if initial is not None:
        initial.role = "initial"
    for q in pool:
        if q.role == "unknown":
            q.role = "y_value"
    for q in statements:
        if q.role == "unknown" and q.unit == x_unit:
            q.role = "x_value"

    return _Draft(kind="rate", m=m, c=initial.value if initial else Fraction(0), x_unit=x_unit,
                  y_unit=y_unit, decreasing=decreasing, has_initial=initial is not None,
                  x_noun=None, y_noun=(initial.noun if initial else None) or rate.noun, penalty=penalty)


def _xy_order(a: _Q, b: _Q) -> tuple[_Q, _Q, bool]:
    """Kembalikan (x, y, yakin?)."""
    if a.unit == "rupiah":
        return b, a, True
    if b.unit == "rupiah":
        return a, b, True
    if dimension(a.unit) == "waktu":
        return a, b, True
    if dimension(b.unit) == "waktu":
        return b, a, True
    return a, b, False


def _pairs_model(text: str, sentences: list[Sentence], qs: list[_Q], questions: list[str]) -> _Draft | None:
    pairs: list[tuple[_Q, _Q]] = []
    penalty = 0.0
    for sent in sentences:
        if sent.is_question:
            continue
        bounds = [sent.start] + [sent.start + m.end() for m in _CLAUSE_SPLIT_RE.finditer(sent.text)] + [sent.end]
        for lo, hi in zip(bounds, bounds[1:], strict=False):
            inside = [q for q in qs if q.sentence == sent.index and lo <= q.start < hi and q.unit]
            if len(inside) == 2 and inside[0].unit != inside[1].unit:
                xq, yq, sure = _xy_order(*inside)
                if not sure:
                    penalty += 0.2
                pairs.append((xq, yq))
    if not pairs:
        return None
    x_unit, y_unit = pairs[0][0].unit, pairs[0][1].unit
    pairs = [p for p in pairs if p[0].unit == x_unit and p[1].unit == y_unit]
    for xq, yq in pairs:
        xq.role = yq.role = "data"
    if penalty:
        questions.append(f"Apakah {pairs[0][0].unit} adalah x (yang mempengaruhi) dan {y_unit} adalah y?")
    if len(pairs) >= 2:
        points = [(xq.value, yq.value) for xq, yq in pairs]
        if points[0][0] == points[1][0]:
            return None
        m = (points[1][1] - points[0][1]) / (points[1][0] - points[0][0])
        c = points[0][1] - m * points[0][0]
        return _Draft(kind="pairs", m=m, c=c, x_unit=x_unit, y_unit=y_unit, has_initial=c != 0,
                      points=points, x_noun=pairs[0][0].noun, y_noun=pairs[0][1].noun, penalty=penalty)
    xq, yq = pairs[0]
    if xq.value == 0:
        return None
    penalty += 0.1 if xq.value == 1 else 0.2
    if xq.value != 1:
        questions.append("Apakah hubungannya sebanding (tanpa nilai awal)?")
    xq.role, yq.role = "data", "rate"
    return _Draft(kind="rate", m=yq.value / xq.value, c=Fraction(0), x_unit=x_unit, y_unit=y_unit,
                  x_noun=xq.noun, y_noun=yq.noun, penalty=penalty)


# ------------------------------------------------------------------- tugas


def _tasks(text: str, sentences: list[Sentence], qs: list[_Q], draft: _Draft, y_meaning: str,
           notes: list[str]) -> list[Task]:
    tasks: list[Task] = []
    x_nouns = [q.noun for q in qs if q.unit == draft.x_unit and q.noun]
    y_nouns = [q.noun for q in qs if q.unit == draft.y_unit and q.noun]
    for sent in sentences:
        if not sent.is_question:
            continue
        lt = _MARKER_RE.sub("", sent.text.lower())
        inside = [q for q in qs if q.sentence == sent.index]
        before = len(tasks)

        if draft.kind == "rise_run" and re.search(STEEPNESS_RE, lt):
            tasks.append(Task(kind="steepness"))
            continue
        if re.search(BUILD_MODEL_RE, lt):
            tasks.append(Task(kind="build_model"))
            continue
        if re.search(INITIAL_QUESTION_RE, lt):
            tasks.append(Task(kind="find_initial"))
        if re.search(RATE_QUESTION_RE, lt):
            tasks.append(Task(kind="find_rate"))

        xs = [q for q in inside if q.unit == draft.x_unit and q.role not in ("rate",)]
        ys = [q for q in inside if q.unit == draft.y_unit and q.per_unit is None]
        if xs:
            for q in xs:
                q.role = "x_value"
                tasks.append(Task(kind="predict", x=q.value))
        elif ys:
            for q in ys:
                q.role = "y_value"
                tasks.append(Task(kind="inverse", y=q.value))
        elif re.search(ZERO_RE, lt):
            tasks.append(Task(kind="inverse", y=Fraction(0)))
        elif len(tasks) == before and _has_word(lt, _y_words(draft.y_unit, y_meaning, y_nouns)) \
                and not _has_word(lt, list(unit_words(draft.x_unit)) + ["jauh", "lama", "kapan"]):
            given = [q for q in qs if not q.in_question and q.role == "x_value" and q.start < sent.start]
            if given:
                tasks.append(Task(kind="predict", x=given[-1].value))
            else:
                notes.append(f"Pertanyaan '{sent.text}' butuh nilai x yang tidak ditemukan.")
        elif len(tasks) == before and _has_word(lt, _x_words(draft.x_unit, x_nouns)):
            given = [q for q in qs if not q.in_question and q.role == "y_value" and q.start < sent.start]
            if given:
                tasks.append(Task(kind="inverse", y=given[-1].value))
            else:
                notes.append(f"Pertanyaan '{sent.text}' butuh nilai y yang tidak ditemukan.")
        if len(tasks) == before and not re.search(REASONING_ONLY_RE, lt):
            notes.append(f"Pertanyaan '{sent.text}' belum dapat diubah menjadi tugas.")
    return tasks


def _problem_type(draft: _Draft, tasks: list[Task]) -> str:
    if draft.kind == "rise_run":
        return "T7"
    if draft.kind == "pairs":
        return "T3"
    if draft.m < 0:
        return "T6"
    solving = [t for t in tasks if t.kind not in ("build_model", "find_rate", "find_initial")]
    if solving and all(t.kind == "inverse" for t in solving):
        return "T8"
    if not draft.has_initial:
        return "T1"
    return "T2"


# -------------------------------------------------------------------- utama


def parse(text: str) -> ParseResult:
    """Kenali model linear dan tugas dari teks soal cerita berbahasa Indonesia."""
    lower = text.lower()
    sentences = split_sentences(text)
    qs = _extract(text, sentences)
    questions: list[str] = []
    notes: list[str] = []

    def result(status: str, **kw: object) -> ParseResult:
        return ParseResult(
            status=status,  # type: ignore[arg-type]
            quantities=[
                ExtractedQuantity(value=q.value, unit=q.unit, per_unit=q.per_unit, per_value=q.per_value,
                                  role=q.role, start=q.start, end=q.end, in_question=q.in_question)  # type: ignore[arg-type]
                for q in qs
            ],
            questions=questions,
            notes=notes,
            **kw,  # type: ignore[arg-type]
        )

    if not qs:
        notes.append("Tidak ada angka bersatuan yang ditemukan.")
        return result("unsupported", confidence=0.0)
    if re.search(TWO_MODEL_RE, lower):
        notes.append("Soal yang membandingkan dua model (mis. paket A dan B) belum didukung input bebas. "
                     "Kerjakan lewat modul M8.")
        return result("unsupported", confidence=0.0)

    draft = (
        _rise_run(text, lower, sentences, qs, notes)
        or _rate_model(text, lower, sentences, qs, questions, notes)
        or _pairs_model(text, sentences, qs, questions)
    )
    if draft is None:
        notes.append("Belum ditemukan laju (kata 'per'/'setiap') atau dua pasang data. "
                     "Jenis soal yang didukung: T1-T8 (lihat MATH_LITERACY).")
        return result("unsupported", confidence=0.0)

    if draft.kind == "rise_run":
        x = Variable(meaning="jarak mendatar", unit=draft.x_unit or "")
        y = Variable(meaning="ketinggian", unit=draft.y_unit or "")
    else:
        x = Variable(meaning=_x_meaning(draft.x_unit, draft.x_noun), unit=draft.x_unit or "")
        y = Variable(meaning=_y_meaning(lower, draft.y_unit, draft.decreasing, draft.y_noun, draft.has_initial),
                     unit=draft.y_unit or "")
    model = with_default_domain(
        LinearModel(
            x=x, y=y, m=draft.m, c=draft.c,
            source={"rate": "direct", "pairs": "points", "rise_run": "rise_run"}[draft.kind],  # type: ignore[arg-type]
            points=draft.points or [], rise=draft.rise, run=draft.run,
        )
    )
    tasks = _tasks(text, sentences, qs, draft, y.meaning, notes)

    confidence = 1.0 - draft.penalty
    if not draft.x_unit:
        confidence -= 0.3
        questions.append("Apa satuan x (yang mempengaruhi) pada soal ini?")
    if not tasks:
        confidence -= 0.3
        questions.append("Apa yang ditanyakan soal ini?")
    confidence = round(max(0.0, min(1.0, confidence)), 2)
    status = "ok" if confidence >= CONFIDENCE_THRESHOLD and tasks else "needs_confirmation"
    if status == "ok":
        questions.clear()
    return result(status, type=_problem_type(draft, tasks), confidence=confidence, model=model, tasks=tasks)
