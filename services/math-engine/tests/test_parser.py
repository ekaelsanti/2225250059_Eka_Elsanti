"""PY-05: parser soal cerita. Soal Dimas & Pak Wayan adalah soal think-aloud (tidak masuk bank soal)."""

from fractions import Fraction

import pytest

from mathengine.parser import parse, split_sentences
from mathengine.parser.numbers import parse_first_number

DIMAS = """Tarif ojek daring di kota Dimas adalah Rp4.000 untuk biaya awal, ditambah Rp2.500 setiap kilometer. Jarak rumah Dimas ke sekolah 6 km.
a. Tuliskan model matematika yang menyatakan hubungan biaya dengan jarak tempuh.
b. Berapa biaya yang harus dibayar Dimas untuk pergi ke sekolah?
c. Suatu hari Dimas hanya membawa uang Rp24.000. Paling jauh berapa kilometer Dimas dapat naik ojek?"""

WAYAN = """Pukul 07.00 Pak Wayan berangkat dari Denpasar dengan sepeda motor. Saat berangkat, tangki motornya berisi 4 liter bensin. Motor itu menghabiskan 1 liter bensin setiap menempuh 40 km. Harga bensin di Denpasar Rp10.000 per liter.
a. Tuliskan model matematika yang menyatakan sisa bensin terhadap jarak yang ditempuh.
b. Berapa liter sisa bensin setelah Pak Wayan menempuh 100 km?
c. Setelah menempuh berapa kilometer bensinnya habis?
d. Apakah model ini masih dapat dipakai untuk menghitung sisa bensin setelah 200 km? Jelaskan alasanmu."""


def tasks_of(result):
    return [(t.kind, t.x, t.y) for t in result.tasks]


def test_dimas():
    r = parse(DIMAS)
    assert r.status == "ok" and r.type == "T2"
    assert (r.model.m, r.model.c) == (2500, 4000)
    assert (r.model.x.unit, r.model.y.unit) == ("km", "rupiah")
    assert tasks_of(r) == [("build_model", None, None), ("predict", 6, None), ("inverse", None, 24000)]


def test_wayan_with_distractors_and_negative_rate():
    r = parse(WAYAN)
    assert r.status == "ok" and r.type == "T6"
    assert (r.model.m, r.model.c) == (Fraction(-1, 40), 4)
    assert r.model.y.meaning == "sisa bensin"
    assert r.model.domain_max == 160
    assert tasks_of(r) == [("build_model", None, None), ("predict", 100, None),
                           ("inverse", None, 0), ("predict", 200, None)]
    assert any("pengecoh" in n for n in r.notes)
    assert all(q.value != 7 for q in r.quantities), "pukul 07.00 bukan besaran"


@pytest.mark.parametrize(
    "text, ptype, m, c, tasks",
    [
        ("Harga 1 kg beras Rp14.000. Berapa harga 3,5 kg?", "T1", 14000, 0, [("predict", Fraction(7, 2), None)]),
        ("Kuota internet Andi 12 GB. Setiap hari terpakai 0,5 GB. Setelah berapa hari kuotanya habis?",
         "T6", Fraction(-1, 2), 12, [("inverse", None, 0)]),
        ("Rani sudah punya tabungan Rp150.000. Setiap minggu ia menabung Rp25.000. "
         "Setelah berapa minggu tabungannya menjadi Rp400.000?", "T8", 25000, 150000, [("inverse", None, 400000)]),
        ("Biaya mencetak 10 lembar foto Rp35.000, sedangkan biaya mencetak 25 lembar foto Rp72.500. "
         "Berapa biaya tetap? Berapa biaya mencetak 40 lembar foto?", "T3", 2500, 10000,
         [("find_initial", None, None), ("predict", 40, None)]),
        ("Pukul 18.00 suhu udara di Bandung 28 °C. Setelah itu suhu turun 1,5 °C setiap jam. "
         "Berapa suhu udara setelah 4 jam?", "T6", Fraction(-3, 2), 28, [("predict", 4, None)]),
        ("Sebuah mobil melaju 60 km/jam. Berapa jarak yang ditempuh setelah 2,5 jam?", "T1", 60, 0,
         [("predict", Fraction(5, 2), None)]),
        ("Sebuah ramp naik setinggi 50 cm dengan jarak mendatar 6 m. Berapa kemiringan ramp?",
         "T7", Fraction(1, 12), 0, [("steepness", None, None)]),
    ],
)
def test_supported_types(text, ptype, m, c, tasks):
    r = parse(text)
    assert r.status == "ok", (r.notes, r.questions)
    assert r.type == ptype
    assert (r.model.m, r.model.c) == (m, c)
    assert tasks_of(r) == tasks


def test_ambiguous_initial_asks_instead_of_guessing():
    r = parse("Ada dua angka Rp5.000 awal dan Rp3.000 awal, lalu Rp2.000 setiap km. Berapa biaya 4 km?")
    assert r.status == "needs_confirmation"
    assert r.questions


def test_unsupported_cases():
    assert parse("Ani pergi ke pasar membeli sayur.").status == "unsupported"
    two = parse("Paket A Rp50.000 per bulan, paket B Rp40.000 per bulan ditambah Rp20.000 awal. Mana lebih murah?")
    assert two.status == "unsupported"


def test_split_sentences_keeps_rupiah_and_drops_markers():
    sents = split_sentences("Harga Rp. 5.000 per kg.\na. Berapa harga 2 kg?")
    assert [s.text for s in sents] == ["Harga Rp. 5.000 per kg.", "Berapa harga 2 kg?"]
    assert [s.is_question for s in sents] == [False, True]


@pytest.mark.parametrize(
    "text, value",
    [("Rp25.000", 25000), ("-7/3", Fraction(-7, 3)), ("1,5", Fraction(3, 2)), ("2.5", Fraction(5, 2)),
     ("25 ribu", 25000), ("jawabannya − 4", -4), ("tidak tahu", None)],
)
def test_parse_first_number(text, value):
    assert parse_first_number(text) == value
