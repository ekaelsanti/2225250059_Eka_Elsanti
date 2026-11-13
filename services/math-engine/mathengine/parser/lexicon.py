"""Kamus kata kunci bahasa Indonesia untuk mengenali peran angka dalam soal cerita."""

UNIT_PATTERN = (
    r"(?:kilometer|km|meter|sentimeter|centimeter|cm|milimeter|mm|m|"
    r"mililiter|ml|liter|l|kilogram|kg|gram|ons|g|"
    r"jam|menit|detik|hari|minggu|bulan|tahun|gb|mb|"
    r"lembar|buah|orang|bungkus|botol|kotak|halaman|rupiah|persen|%|"
    r"°\s?c|derajat(?:\s+celsius)?)"
)

INITIAL_KEYWORDS = (
    "biaya awal", "tarif awal", "harga awal", "mula-mula", "mula mula", "semula", "awal",
    "biaya tetap", "pemasangan", "pendaftaran", "buka pintu", "berisi", "sudah punya",
    "sudah memiliki", "memiliki tabungan", "tabungan awal", "uang muka", "saat berangkat",
    "pada awalnya", "ketinggian awal", "tinggi awal",
)

DECREASE_KEYWORDS = (
    "berkurang", "menghabiskan", "habis", "turun", "menurun", "menyusut", "terpakai",
    "dipakai", "menguap", "bocor", "mencicil", "dicicil", "cicilan", "dikurangi",
)

QUESTION_STARTS = (
    "berapa", "tentukan", "tuliskan", "hitunglah", "hitung", "kapan", "carilah", "cari",
    "apakah", "manakah", "jelaskan", "mengapa", "setelah berapa", "paling jauh",
    "paling lama", "buatlah", "susunlah", "nyatakan",
)

BUILD_MODEL_RE = (
    r"\b(?:tuliskan|tulislah|buat|buatlah|susun|susunlah|tentukan|nyatakan)\b"
    r".*\b(?:model|persamaan|rumus)\b"
)

INITIAL_QUESTION_RE = r"\b(?:biaya tetap|nilai awal|biaya awal|tarif awal|mula-mula)\b"
RATE_QUESTION_RE = r"\b(?:laju|kecepatan|(?:biaya|harga|tarif)\s+(?:per|setiap|tiap)\s+\w+)\b"
STEEPNESS_RE = r"\b(?:kemiringan|kecuraman|curam|gradien|miring)\b"
ZERO_RE = r"\b(?:habis|nol|kosong|lunas)\b"
REASONING_ONLY_RE = r"^(?:jelaskan|mengapa|berikan alasan|beri alasan)"
TWO_MODEL_RE = r"\b(?:paket|perusahaan|toko|ojek|taksi|pilihan)\s+(?:a|b|1|2|pertama|kedua)\b"

RUPIAH_WORDS = ("biaya", "harga", "bayar", "dibayar", "membayar", "uang", "tarif", "rupiah", "total", "tabungan", "tabungannya")
X_GENERIC_WORDS = ("jauh", "lama", "kapan", "jarak", "waktu")

RISE_WORDS = ("setinggi", "ketinggian", "tinggi", "naik")
RUN_WORDS = ("mendatar", "horizontal", "alas", "panjang dasar")

Y_NAME_HINTS = (
    ("suhu", "suhu"),
    ("bensin", "bensin"),
    ("kuota", "kuota"),
    ("pulsa", "pulsa"),
    ("air", "air"),
    ("tinggi", "tinggi"),
)

NOUN_STOPWORDS = {
    "setiap", "per", "tiap", "untuk", "dan", "di", "ke", "yang", "dengan", "sedangkan",
    "lalu", "kemudian", "pada", "dari", "adalah", "ditambah", "sebanyak", "saja", "lagi",
    "sudah", "akan", "jika", "maka", "itu", "ini",
}
