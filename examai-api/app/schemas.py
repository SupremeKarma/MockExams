"""Pydantic models — the Python half of the contract in /docs/schema.md.

Two layers on purpose:

  Extracted*  what the MODEL returns. snake_case, lenient, and deliberately
              missing every derived field. The model is not asked how complete
              it was.

  *Doc        what goes into FIRESTORE. camelCase, strict, with coverage and
              `unclear` computed from what was actually extracted.

Keeping them apart is what makes the honesty guarantees structural rather than
a convention someone remembers. There is no field on ExtractedPaper where a
model could claim `coverage: complete`, so it cannot.
"""

from __future__ import annotations

from datetime import datetime, timezone
from typing import Annotated, Any, Literal, Union

from pydantic import BaseModel, ConfigDict, Field, field_validator, model_validator

Confidence = Literal["high", "medium", "low"]
ExamType = Literal["regular", "back", "make_up", "model"]
Curriculum = Literal["new_course", "old_course"]
QuestionType = Literal["theory", "numerical", "short_note", "comparison", "diagram"]
PaperStatus = Literal[
    "uploaded", "extracted", "solving", "review", "published", "failed"
]
JobStage = Literal["extract", "classify", "solve", "verify", "embed", "stats", "render"]
JobStatus = Literal["queued", "running", "succeeded", "failed", "cancelled"]
ReviewStatus = Literal["pending", "approved", "rejected"]


def now_iso() -> str:
    return datetime.now(timezone.utc).isoformat()


def _camel(name: str) -> str:
    head, *tail = name.split("_")
    return head + "".join(word.capitalize() for word in tail)


class DocModel(BaseModel):
    """Base for anything written to Firestore: serialises as camelCase."""

    model_config = ConfigDict(
        alias_generator=_camel,
        populate_by_name=True,
        extra="forbid",
    )

    def to_firestore(self) -> dict[str, Any]:
        return self.model_dump(by_alias=True, mode="json")


# ---------------------------------------------------------------------------
# Layer 1 — what the model returns
# ---------------------------------------------------------------------------


class ExtractedUnitTag(BaseModel):
    model_config = ConfigDict(extra="ignore")

    unit_id: str
    confidence: Confidence = "medium"


# The 17 papers already extracted by examai-ingest use an older, coarser
# vocabulary. Mapping them here rather than at the import script means the
# legacy values are accepted everywhere and normalise identically, instead of
# one code path quietly producing a type no consumer recognises.
#
# `written` -> `theory` is exact. `mcq` -> `theory` is lossy, but PU semester
# papers are entirely descriptive (there are no multiple-choice questions to
# find), so an `mcq` tag on one of these is a mis-tag rather than information
# worth keeping. The importer flags any question it had to remap this way.
LEGACY_QUESTION_TYPES: dict[str, str] = {
    "written": "theory",
    "mcq": "theory",
}


class ExtractedQuestion(BaseModel):
    model_config = ConfigDict(extra="ignore")

    number: str
    group: str = ""
    marks: int | None = None
    mark_split: list[int] | None = None
    text: str | None = None
    question_type: QuestionType = "theory"
    units: list[ExtractedUnitTag] = Field(default_factory=list)
    topics: list[str] = Field(default_factory=list)
    sub_parts: list["ExtractedQuestion"] = Field(default_factory=list)
    choose: int | None = None
    has_diagram: bool = False
    diagram_description: str | None = None
    source_page: int | None = None
    confidence: Confidence = "medium"

    @field_validator("question_type", mode="before")
    @classmethod
    def normalise_legacy_type(cls, v: Any) -> Any:
        if isinstance(v, str):
            return LEGACY_QUESTION_TYPES.get(v.strip().lower(), v)
        return v

    @field_validator("marks")
    @classmethod
    def marks_positive(cls, v: int | None) -> int | None:
        # 0 is rejected rather than coerced to None. A sub-part whose split is
        # not printed must be null; 0 reads as a real value and would sink that
        # question's weight in any marks-based analysis.
        if v is not None and v <= 0:
            raise ValueError("marks must be positive, or null when not printed")
        return v

    @model_validator(mode="after")
    def text_null_is_justified(self) -> "ExtractedQuestion":
        """Null text must mean one of two specific things, never 'we lost it'.

        Allowed: a bare stem whose content lives entirely in sub_parts, or text
        that was genuinely unreadable — and in that second case the model must
        have said so by setting confidence low. Anything else is a dropped
        question wearing a null, and it would otherwise reach a reviewer
        looking like a deliberate choice.
        """
        if self.text is None and not self.sub_parts and self.confidence != "low":
            raise ValueError(
                f"question {self.number!r}: text is null with no sub_parts and "
                f"confidence {self.confidence!r}. Null text is only valid for a "
                "bare stem with sub-parts, or unreadable text at low confidence."
            )
        return self


class ExtractedGroup(BaseModel):
    model_config = ConfigDict(extra="ignore")

    label: str
    questions_printed: int = Field(ge=1)
    answer_count: int = Field(ge=1)
    marks_each: int = Field(ge=1)
    marks_total: int = Field(ge=1)
    instruction: str = ""


class ExtractedPaper(BaseModel):
    """The model's reply. Note what is absent: coverage, needs_review, unclear."""

    model_config = ConfigDict(extra="ignore")

    subject_code: str
    subject_name: str = ""
    semester: int | None = None
    year: int
    exam_type: ExamType = "regular"
    curriculum: Curriculum | None = None
    full_marks: int = Field(ge=1)
    pass_marks: int | None = None
    duration_hours: float | None = None
    extraction_notes: str = ""
    groups: list[ExtractedGroup] = Field(default_factory=list)
    questions: list[ExtractedQuestion] = Field(min_length=1)


# ---------------------------------------------------------------------------
# Layer 2 — what Firestore stores
# ---------------------------------------------------------------------------


class UnitTagDoc(DocModel):
    unit_id: str
    confidence: Confidence
    tagged_by: Literal["model", "human"] = "model"


class ChoiceRuleDoc(DocModel):
    choose: int = Field(ge=1)


class QuestionDoc(DocModel):
    q_id: str = Field(alias="qId")
    number: str
    group: str
    order_index: int

    marks: int | None
    mark_split: list[int] | None
    choice_rule: ChoiceRuleDoc | None

    text_exact: str | None
    type: QuestionType

    syllabus_unit: str | None
    syllabus_units: list[UnitTagDoc]
    topics: list[str]
    sub_parts: list["QuestionDoc"]

    has_diagram: bool
    diagram_description: str | None
    source_page: int | None

    confidence: Confidence
    unclear: bool
    review_note: str | None

    solution_path: str | None = None
    verified_numerical: Union[bool, Literal["n/a"]] = "n/a"
    review_status: ReviewStatus = "pending"
    reviewer_note: str | None = None
    embedding: list[float] | None = None
    prompt_version: str | None = None
    model_used: str | None = None
    tokens_used: int = 0
    cost_usd: float = 0.0
    generated_at: str | None = None


class GroupCoverageDoc(DocModel):
    label: str
    questions_extracted: int
    questions_printed: int


class CoverageDoc(DocModel):
    by_group: list[GroupCoverageDoc]
    status: Literal["complete", "partial", "over_extracted"]
    missing_ranges: list[str] = Field(default_factory=list)
    notes: str = ""


class PaperGroupDoc(DocModel):
    label: str
    questions_printed: int
    answer_count: int
    marks_each: int
    marks_total: int
    instruction: str


class PaperDoc(DocModel):
    paper_id: str = Field(alias="paperId")
    course_id: str
    program_id: str
    year: int
    exam_type: ExamType
    full_marks: int
    pass_marks: int | None
    time_hours: float | None
    image_paths: list[str]
    groups: list[PaperGroupDoc]
    coverage: CoverageDoc
    status: PaperStatus
    extraction_notes: str
    created_by: str
    created_at: str
    updated_at: str
    published_at: str | None = None
    total_tokens: int = 0
    total_cost_usd: float = 0.0


class JobLogDoc(DocModel):
    at: str
    level: Literal["info", "warn", "error"]
    message: str


class JobProgressDoc(DocModel):
    done: int = 0
    total: int = 0


class JobDoc(DocModel):
    job_id: str = Field(alias="jobId")
    paper_id: str
    stage: JobStage
    status: JobStatus
    attempts: int = 0
    error: str | None = None
    logs: list[JobLogDoc] = Field(default_factory=list)
    progress: JobProgressDoc = Field(default_factory=JobProgressDoc)
    started_at: str | None = None
    finished_at: str | None = None
    created_by: str = ""


# ---------------------------------------------------------------------------
# Request bodies
# ---------------------------------------------------------------------------


class ExtractRequest(BaseModel):
    paper_id: str
    course_id: str
    program_id: str = "BIT"
    year: int
    exam_type: ExamType = "regular"
    image_paths: list[str] = Field(min_length=1)
    created_by: str = ""
    # A re-run overwrites the paper's questions. Human-approved questions and
    # human unit tags survive it — see stages/extract.py.
    force: bool = False


ExtractedQuestion.model_rebuild()
QuestionDoc.model_rebuild()
