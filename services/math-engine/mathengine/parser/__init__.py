"""Parser soal cerita berbasis aturan. Prinsip: lebih baik bertanya daripada menebak."""

from .extract import is_question, parse, split_sentences

__all__ = ["parse", "split_sentences", "is_question"]
