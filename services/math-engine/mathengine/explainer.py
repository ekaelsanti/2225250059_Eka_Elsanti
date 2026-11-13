"""Teks penjelasan berbahasa Indonesia: kalimat pendek, ramah, satu ide per kalimat."""

from __future__ import annotations

from fractions import Fraction

from .numfmt import format_number, format_quantity, to_fraction
from .schemas import LinearModel, Task

STAGE_HINTS: dict[str, list[str]] = {
    "pahami": [
        "Baca kalimat pertanyaannya dulu. Apa yang dicari?",
        "Garis bawahi angka yang punya satuan. Mana yang dipakai untuk menjawab?",
        "Kata 'setiap' atau 'per' biasanya menunjukkan laju. Kata 'awal' biasanya nilai awal.",
    ],
    "tafsirkan": [
        "Apa arti angka hasil hitunganmu dalam cerita?",
        "Tuliskan jawabanmu dalam satu kalimat lengkap.",
        "Jangan lupa satuannya, misalnya rupiah, km, atau liter.",
    ],
    "periksa": [
        "Apakah hasilnya masuk akal untuk cerita ini?",
        "Masukkan hasilmu kembali ke model. Apakah cocok?",
        "Lihat grafiknya: apakah titik jawabanmu ada di garis?",
    ],
}


def cap(text: str) -> str:
    return text[:1].upper() + text[1:] if text else text


def fn(value: object) -> str:
    return format_number(value)


def fq(value: object, unit: str | None) -> str:
    return format_quantity(value, unit)


def paren(value: object) -> str:
    """Bilangan negatif diberi kurung: -2 -> '(-2)'."""
    s = fn(value)
    return f"({s})" if to_fraction(value) < 0 else s


def rate_phrase(model: LinearModel) -> str:
    """'Rp2.500 per km' atau 'berkurang 1/40 liter per km'."""
    amount = fq(abs(model.m), model.y.unit)
    if model.m < 0:
        return f"berkurang {amount} per {model.x.unit}"
    return f"{amount} per {model.x.unit}"


def known_facts(model: LinearModel) -> list[str]:
    prefix = f"{model.name}: " if model.name else ""
    x, y = model.x, model.y
    if model.source == "points":
        return [f"{prefix}{fq(px, x.unit)} → {fq(py, y.unit)}" for px, py in model.points]
    if model.source == "rise_run":
        assert model.rise is not None and model.run is not None
        return [
            f"{prefix}Tinggi (naik): {fq(model.rise, y.unit)}",
            f"{prefix}Jarak mendatar: {fq(model.run, x.unit)}",
        ]
    facts = []
    if model.c != 0:
        facts.append(f"{prefix}Nilai awal: {fq(model.c, y.unit)}")
    facts.append(f"{prefix}Laju: {rate_phrase(model)}")
    return facts


def task_question(task: Task, models: list[LinearModel]) -> str:
    model = models[task.model]
    x, y = model.x, model.y
    match task.kind:
        case "predict":
            return f"{y.meaning} saat {x.meaning} {fq(task.x, x.unit)}"
        case "inverse":
            return f"{x.meaning} saat {y.meaning} {fq(task.y, y.unit)}"
        case "build_model":
            return "model matematika"
        case "find_rate":
            return "laju (m)"
        case "find_initial":
            return "nilai awal (c)"
        case "intersect":
            return "kapan kedua model bernilai sama"
        case "compare":
            return f"mana yang lebih kecil saat {x.meaning} {fq(task.x, x.unit)}"
        case "steepness":
            return "kemiringan"
        case "parallel":
            return "gradien garis yang sejajar"
        case "perpendicular":
            return "gradien garis yang tegak lurus"
    return task.kind


def variable_hints(model: LinearModel) -> list[str]:
    return [
        "Mana yang mempengaruhi (x)? Mana yang dipengaruhi (y)?",
        f"{cap(model.y.meaning)} bergantung pada {model.x.meaning}.",
        f"x = {model.x.meaning} ({model.x.unit}), y = {model.y.meaning} ({model.y.unit}).",
    ]


def rate_hints(model: LinearModel) -> list[str]:
    if model.source == "points":
        second = "Laju = selisih y dibagi selisih x dari dua data."
    elif model.source == "rise_run":
        second = "Kemiringan = tinggi (naik) dibagi jarak mendatar."
    elif model.m < 0:
        second = f"{cap(model.y.meaning)} berkurang, jadi lajunya negatif."
    else:
        second = "Cari angka yang disertai kata 'setiap' atau 'per'."
    return [
        f"Laju adalah perubahan {model.y.meaning} untuk setiap 1 {model.x.unit}.",
        second,
        f"m = {fn(model.m)}",
    ]


def initial_hints(model: LinearModel) -> list[str]:
    second = (
        "Pakai salah satu data: c = y − m × x."
        if model.source == "points"
        else "Cari kata 'awal', 'mula-mula', atau 'biaya tetap'."
    )
    return [
        f"Nilai awal adalah {model.y.meaning} saat {model.x.meaning} = 0.",
        second,
        f"c = {fn(model.c)}",
    ]


def model_hints(equation: str) -> list[str]:
    return [
        "Bentuk modelnya y = mx + c.",
        "Masukkan laju sebagai m dan nilai awal sebagai c.",
        equation,
    ]


def solve_hints(kind: str, last_line: str) -> list[str]:
    first = {
        "predict": "x sudah diketahui. Substitusikan ke model.",
        "inverse": "y sudah diketahui. Cari x yang membuat model bernilai y itu.",
        "intersect": "Dua model sama besar saat ruas kanannya sama.",
        "compare": "Hitung nilai kedua model untuk x yang sama.",
        "steepness": "Kemiringan = tinggi dibagi jarak mendatar.",
        "parallel": "Garis sejajar memiliki gradien yang sama.",
        "perpendicular": "Gradien dua garis tegak lurus jika dikalikan hasilnya −1.",
    }.get(kind, "Kerjakan selangkah demi selangkah.")
    second = {
        "predict": "Kalikan dulu, lalu tambahkan nilai awal.",
        "inverse": "Pindahkan nilai awal ke ruas kiri, lalu bagi dengan laju.",
        "intersect": "Kumpulkan suku x di kiri dan bilangan di kanan.",
        "compare": "Bandingkan dua hasilnya. Mana yang lebih kecil?",
        "steepness": "Untuk persen, kalikan dengan 100%.",
        "parallel": "m₂ = m₁.",
        "perpendicular": "m₂ = −1 ÷ m₁.",
    }.get(kind, "Periksa tanda negatif dengan teliti.")
    return [first, second, last_line]


def fraction_or_none(value: object | None) -> Fraction | None:
    return None if value is None else to_fraction(value)
