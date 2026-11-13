"""Model data (Pydantic) - sumber tunggal skema untuk Python dan JavaScript.

Pecahan diserialisasi sebagai string "p/q" (mis. "-1/40") atau bilangan bulat ("2500")
agar tidak ada pembulatan saat berpindah ke JavaScript.
"""

from fractions import Fraction
from typing import Annotated, Literal

from pydantic import (
    BaseModel,
    BeforeValidator,
    ConfigDict,
    Field,
    PlainSerializer,
    WithJsonSchema,
    model_validator,
)

from .numfmt import frac_str, to_fraction

Frac = Annotated[
    Fraction,
    BeforeValidator(to_fraction),
    PlainSerializer(frac_str, return_type=str),
    WithJsonSchema(
        {
            "type": "string",
            "pattern": r"^-?\d+(/\d+)?$",
            "description": "Bilangan rasional eksak: bilangan bulat atau 'p/q'",
        }
    ),
]

Stage = Literal["pahami", "rumuskan", "selesaikan", "tafsirkan", "periksa"]
ProblemType = Literal["T1", "T2", "T3", "T4", "T5", "T6", "T7", "T8", "T9", "T10"]
Context = Literal["personal", "sosial-budaya", "saintifik"]
ContextLevel = Literal["K-A", "K-B", "K-C", "K-D"]
CognitiveLevel = Literal["pemahaman", "penerapan", "penalaran"]
TaskKind = Literal[
    "find_rate", "find_initial", "build_model", "predict", "inverse",
    "intersect", "compare", "steepness", "parallel", "perpendicular",
]
ModelSource = Literal["direct", "points", "rise_run"]


class _Base(BaseModel):
    model_config = ConfigDict(extra="forbid", arbitrary_types_allowed=True)


# --------------------------------------------------------------------------- inti


class Variable(_Base):
    meaning: str = Field(description="Arti variabel, mis. 'jarak tempuh'")
    unit: str = Field(description="Satuan, mis. 'km', 'rupiah'")


class LinearModel(_Base):
    """Model y = m x + c dalam konteks."""

    name: str | None = None
    x: Variable
    y: Variable
    m: Frac = Field(description="Laju perubahan (satuan y per satuan x)")
    c: Frac = Field(description="Nilai awal (y saat x = 0)")
    domain_min: Frac | None = None
    domain_max: Frac | None = None
    source: ModelSource = "direct"
    points: list[tuple[Frac, Frac]] = Field(default_factory=list)
    rise: Frac | None = None
    run: Frac | None = None


class Task(_Base):
    kind: TaskKind
    x: Frac | None = None
    y: Frac | None = None
    model: int = 0


class Step(_Base):
    stage: Stage
    text: str
    latex: str | None = None
    micro_steps: list[str] = Field(default_factory=list)
    hints: list[str] = Field(min_length=3, max_length=3)


class Answer(_Base):
    key: str
    task: TaskKind
    value: Frac | None = None
    unit: str | None = None
    display: str


class Solution(_Base):
    answers: list[Answer]
    steps: list[Step]
    accepted_forms: list[str]
    interpretation: list[str]
    reasonableness: list[str]


class Diagnosis(_Base):
    correct: bool
    error_type: str | None = None
    message: str


# ------------------------------------------------------------------ soal cerita


class Span(_Base):
    start: int
    end: int


class Annotations(_Base):
    known: list[Span] = Field(default_factory=list)
    asked: list[Span] = Field(default_factory=list)
    distractor: list[Span] = Field(default_factory=list)


class Stimulus(_Base):
    kind: Literal["table", "graph"]
    model: int = 0
    rows: list[tuple[Frac, Frac]]


class WordProblem(_Base):
    """Soal cerita lengkap hasil build (dipakai aplikasi JavaScript secara offline)."""

    id: str
    module: Literal["M7", "M8"]
    type: ProblemType
    context: Context
    context_level: ContextLevel
    cognitive_level: CognitiveLevel
    title: str
    text: str
    stimulus: Stimulus | None = None
    annotations: Annotations
    models: list[LinearModel] = Field(min_length=1)
    tasks: list[Task] = Field(min_length=1)
    solution: Solution
    reflection_prompt: str | None = None
    glossary: list[str] = Field(default_factory=list)
    variant_of: str | None = None


# --------------------------------------------------------- sumber YAML (penulis)


class SourceModel(_Base):
    name: str | None = None
    x: Variable
    y: Variable
    m: Frac | None = None
    c: Frac | None = None
    points: list[tuple[Frac, Frac]] | None = None
    rise: Frac | None = None
    run: Frac | None = None
    domain_min: Frac | None = None
    domain_max: Frac | None = None

    @model_validator(mode="after")
    def _enough_information(self) -> "SourceModel":
        has_points = self.points is not None and len(self.points) >= 2
        has_rise_run = self.rise is not None and self.run is not None
        if not (self.m is not None or has_points or has_rise_run):
            raise ValueError("Model butuh 'm', atau minimal dua 'points', atau 'rise' dan 'run'.")
        return self


class StimulusSource(_Base):
    kind: Literal["table", "graph"]
    model: int = 0
    x: list[Frac] = Field(min_length=2)


class ProblemSource(_Base):
    id: str = Field(pattern=r"^[A-Za-z0-9_-]+$")
    module: Literal["M7", "M8"] = "M7"
    type: ProblemType
    context: Context
    context_level: ContextLevel
    cognitive_level: CognitiveLevel
    title: str
    text: str
    params: dict[str, Frac] = Field(default_factory=dict)
    models: list[SourceModel] = Field(min_length=1)
    tasks: list[Task] = Field(min_length=1)
    stimulus: StimulusSource | None = None
    distractors: list[str] = Field(default_factory=list)
    reflection_prompt: str | None = None
    glossary: list[str] = Field(default_factory=list)
    vary: dict[str, list[Frac]] = Field(default_factory=dict)
    variants: int = Field(default=0, ge=0, le=10)
    seed: int = 0


class GlossaryEntry(_Base):
    term: str
    meaning: str = Field(max_length=120)
    role: Literal["laju", "nilai_awal", "x", "y", "lainnya"] = "lainnya"


# ----------------------------------------------------------------------- parser

QuantityRole = Literal["rate", "initial", "x_value", "y_value", "data", "rise", "run", "unknown"]


class ExtractedQuantity(_Base):
    value: Frac
    unit: str | None
    per_unit: str | None = None
    per_value: Frac | None = None
    role: QuantityRole = "unknown"
    start: int
    end: int
    in_question: bool = False


class ParseResult(_Base):
    status: Literal["ok", "needs_confirmation", "unsupported"]
    type: ProblemType | None = None
    confidence: float = Field(ge=0, le=1)
    model: LinearModel | None = None
    tasks: list[Task] = Field(default_factory=list)
    quantities: list[ExtractedQuantity] = Field(default_factory=list)
    questions: list[str] = Field(default_factory=list, description="Pertanyaan konfirmasi untuk pengguna")
    notes: list[str] = Field(default_factory=list)
