"""Extraction contract tests.

These exist to protect three specific guarantees that have already failed once
in this project's history, and whose failure mode is silence rather than an
error:

  1. A partial extraction must not be able to look complete.
  2. A dropped question must not be able to hide behind a null text.
  3. A re-run must not silently revert a reviewer's work.

Run: cd examai-api && python -m pytest
"""

from __future__ import annotations

import json
from pathlib import Path

import pytest
from pydantic import ValidationError

from app.derive import build_documents, derive_coverage
from app.paths import is_safe_path_segment, original_path, solution_path
from app.schemas import ExtractedPaper, ExtractedQuestion

REPO_ROOT = Path(__file__).resolve().parent.parent.parent
GOLDEN = REPO_ROOT / "examai-ingest" / "schema" / "example.BIT351CO_2025_regular.json"


def paper(**overrides) -> dict:
    """A minimal valid paper, in the shape the model returns."""
    base = {
        "subject_code": "BIT351CO",
        "subject_name": "Artificial Intelligence",
        "semester": 6,
        "year": 2025,
        "exam_type": "regular",
        "full_marks": 24,
        "groups": [
            {
                "label": "A",
                "questions_printed": 2,
                "answer_count": 2,
                "marks_each": 12,
                "marks_total": 24,
                "instruction": "Answer TWO questions.",
            }
        ],
        "questions": [
            {
                "number": "1",
                "group": "A",
                "marks": 12,
                "text": "Define agent.",
                "question_type": "theory",
                "units": [{"unit_id": "BIT351CO_U02", "confidence": "high"}],
                "confidence": "high",
            },
            {
                "number": "2",
                "group": "A",
                "marks": 12,
                "text": "Explain A* search.",
                "question_type": "theory",
                "units": [{"unit_id": "BIT351CO_U03", "confidence": "high"}],
                "confidence": "high",
            },
        ],
    }
    base.update(overrides)
    return base


def build(data: dict, **kwargs):
    extracted = ExtractedPaper.model_validate(data)
    return build_documents(
        extracted,
        paper_id="BIT351CO_2025_regular",
        course_id="BIT351CO",
        program_id="BIT",
        image_paths=["papers/BIT351CO_2025_regular/original/000.jpg"],
        created_by="admin-test",
        **kwargs,
    )


# ---------------------------------------------------------------------------
# 1. Coverage cannot be faked
# ---------------------------------------------------------------------------


def test_complete_extraction_reports_complete():
    doc, questions = build(paper())
    assert doc.coverage.status == "complete"
    assert len(questions) == 2
    assert all(not q.unclear for q in questions)


def test_missing_question_reports_partial_not_complete():
    """The demo-fixture failure: a third of a paper that looked like a whole one."""
    data = paper()
    data["questions"] = data["questions"][:1]  # one of two printed
    doc, questions = build(data)

    assert doc.coverage.status == "partial"
    assert doc.coverage.by_group[0].questions_extracted == 1
    assert doc.coverage.by_group[0].questions_printed == 2
    # And every question on a partial paper is flagged, even the good one.
    assert all(q.unclear for q in questions)
    assert "coverage is partial" in questions[0].review_note


def test_model_cannot_self_report_coverage():
    """There is no field for it. A model claiming completeness is ignored."""
    data = paper()
    data["questions"] = data["questions"][:1]
    data["coverage"] = {"status": "complete", "by_group": []}  # model lying

    extracted = ExtractedPaper.model_validate(data)
    assert not hasattr(extracted, "coverage")
    assert derive_coverage(extracted).status == "partial"


def test_split_question_reports_over_extracted():
    data = paper()
    data["questions"].append(
        {
            "number": "3",
            "group": "A",
            "marks": 12,
            "text": "Extra.",
            "question_type": "theory",
            "units": [{"unit_id": "BIT351CO_U01", "confidence": "high"}],
            "confidence": "high",
        }
    )
    doc, _ = build(data)
    assert doc.coverage.status == "over_extracted"


def test_group_label_prefix_does_not_fake_a_partial():
    """Regression: "Group A" on the group vs "A" on the questions.

    The real BIT253CO 2024 extraction mixes the two. Matching them literally
    found zero questions in either group and reported a complete 3-of-3 /
    9-of-9 extraction as `partial` — a warning that fires on a good paper is
    one reviewers learn to click past.
    """
    data = paper()
    data["groups"][0]["label"] = "Group A"  # questions still carry "A"
    doc, questions = build(data)

    assert doc.coverage.status == "complete"
    assert doc.coverage.by_group[0].questions_extracted == 2
    # Both sides are normalised, so the UI never renders "Group Group A".
    assert doc.groups[0].label == "A"
    assert questions[0].group == "A"
    assert questions[0].q_id == "A1"


def test_no_groups_is_never_complete():
    """No groups means nothing to measure against — that is not success."""
    data = paper(groups=[])
    doc, _ = build(data)
    assert doc.coverage.status == "partial"


def test_choice_paper_extracting_every_printed_question_is_complete():
    """Answer SEVEN of eight: 64 marks extracted against a 56-mark group is correct.

    Counting summed marks here would call a perfect extraction over-extracted,
    which is exactly why coverage counts questions per group.
    """
    data = paper(
        full_marks=56,
        groups=[
            {
                "label": "B",
                "questions_printed": 8,
                "answer_count": 7,
                "marks_each": 8,
                "marks_total": 56,
                "instruction": "Answer SEVEN questions.",
            }
        ],
        questions=[
            {
                "number": str(i),
                "group": "B",
                "marks": 8,
                "text": f"Question {i}.",
                "question_type": "theory",
                "units": [{"unit_id": "BIT351CO_U01", "confidence": "high"}],
                "confidence": "high",
            }
            for i in range(1, 9)
        ],
    )
    doc, questions = build(data)
    assert doc.coverage.status == "complete"
    assert sum(q.marks or 0 for q in questions) == 64 > doc.full_marks


# ---------------------------------------------------------------------------
# 2. A dropped question cannot hide behind a null
# ---------------------------------------------------------------------------


def test_null_text_without_subparts_or_low_confidence_is_rejected():
    with pytest.raises(ValidationError, match="text is null"):
        ExtractedQuestion.model_validate(
            {"number": "1", "group": "A", "text": None, "confidence": "high"}
        )


def test_null_text_at_low_confidence_is_allowed():
    q = ExtractedQuestion.model_validate(
        {"number": "1", "group": "A", "text": None, "confidence": "low"}
    )
    assert q.text is None


def test_null_text_on_a_bare_stem_with_subparts_is_allowed():
    q = ExtractedQuestion.model_validate(
        {
            "number": "3",
            "group": "B",
            "text": None,
            "confidence": "high",
            "sub_parts": [
                {"number": "3a", "group": "B", "text": "Part a.", "confidence": "high"}
            ],
        }
    )
    assert q.text is None and len(q.sub_parts) == 1


def test_zero_marks_is_rejected_but_null_is_allowed():
    """0 reads as a real value and would sink the question's weight. Null does not."""
    with pytest.raises(ValidationError):
        ExtractedQuestion.model_validate(
            {"number": "1", "group": "A", "text": "x", "marks": 0, "confidence": "high"}
        )
    assert (
        ExtractedQuestion.model_validate(
            {"number": "1", "group": "A", "text": "x", "marks": None, "confidence": "high"}
        ).marks
        is None
    )


# ---------------------------------------------------------------------------
# 3. Review flags always carry a reason
# ---------------------------------------------------------------------------


@pytest.mark.parametrize(
    "mutate, expected",
    [
        (lambda q: q.update({"confidence": "medium"}), "confidence"),
        (lambda q: q.update({"units": []}), "no syllabus unit"),
        (
            lambda q: q.update({"units": [{"unit_id": "BIT351CO_U02", "confidence": "low"}]}),
            "low-confidence unit tag",
        ),
        (lambda q: q.update({"text": "Explain the [UNCLEAR: two/three?] phase commit."}),
         "unreadable span"),
        (lambda q: q.update({"mark_split": [3, 3]}), "sums to 6"),
    ],
)
def test_every_flag_records_why(mutate, expected):
    data = paper()
    mutate(data["questions"][0])
    _, questions = build(data)

    assert questions[0].unclear is True
    assert questions[0].review_note is not None
    assert expected in questions[0].review_note


def test_invented_unit_id_is_caught_when_the_vocabulary_is_known():
    """An invented tag passes shape checks then matches nothing downstream."""
    data = paper()
    data["questions"][0]["units"] = [{"unit_id": "BIT351CO_U99", "confidence": "high"}]
    _, questions = build(data, known_units={"BIT351CO_U02", "BIT351CO_U03"})

    assert questions[0].unclear is True
    assert "not in this course's syllabus" in questions[0].review_note


def test_unknown_vocabulary_does_not_flag_everything():
    """None means 'cannot check' — distinct from 'checked and it was wrong'."""
    _, questions = build(paper(), known_units=None)
    assert all(not q.unclear for q in questions)


def test_clean_question_carries_no_review_note():
    _, questions = build(paper())
    assert questions[0].review_note is None


# ---------------------------------------------------------------------------
# Marks arithmetic and paper-level derivation
# ---------------------------------------------------------------------------


def test_group_marks_not_reconciling_is_recorded():
    """The handwritten-correction failure: one figure updated, the other not."""
    data = paper(full_marks=80)  # groups still sum to 24
    doc, _ = build(data)
    assert "MARKS DO NOT RECONCILE" in doc.extraction_notes
    assert "80" in doc.extraction_notes and "24" in doc.extraction_notes


def test_reconciling_marks_leave_notes_clean():
    doc, _ = build(paper())
    assert "RECONCILE" not in doc.extraction_notes


def test_numerical_starts_unverified_not_not_applicable():
    """False means 'not yet verified'; 'n/a' means 'nothing to verify'."""
    data = paper()
    data["questions"][0]["question_type"] = "numerical"
    _, questions = build(data)

    assert questions[0].verified_numerical is False
    assert questions[1].verified_numerical == "n/a"


def test_parent_units_roll_up_from_subparts():
    data = paper()
    data["questions"][0].update(
        {
            "text": None,
            "units": [],
            "sub_parts": [
                {
                    "number": "1a",
                    "group": "A",
                    "marks": 6,
                    "text": "Part a.",
                    "question_type": "theory",
                    "units": [{"unit_id": "BIT351CO_U05", "confidence": "high"}],
                    "confidence": "high",
                },
                {
                    "number": "1b",
                    "group": "A",
                    "marks": 6,
                    "text": "Part b.",
                    "question_type": "theory",
                    "units": [{"unit_id": "BIT351CO_U06", "confidence": "high"}],
                    "confidence": "high",
                },
            ],
        }
    )
    _, questions = build(data)
    tags = {t.unit_id for t in questions[0].syllabus_units}
    assert tags == {"BIT351CO_U05", "BIT351CO_U06"}


def test_within_question_choice_is_kept_separate_from_group_choice():
    data = paper()
    data["questions"][0].update(
        {
            "choose": 2,
            "text": "Write short notes on any TWO:",
            "sub_parts": [
                {
                    "number": f"1{s}",
                    "group": "A",
                    "marks": 6,
                    "text": f"Note {s}.",
                    "question_type": "short_note",
                    "units": [{"unit_id": "BIT351CO_U01", "confidence": "high"}],
                    "confidence": "high",
                }
                for s in "abc"
            ],
        }
    )
    doc, questions = build(data)

    assert questions[0].choice_rule is not None
    assert questions[0].choice_rule.choose == 2
    # Group choice stays on the group, untouched by the question's own rule.
    assert doc.groups[0].answer_count == 2
    assert doc.groups[0].questions_printed == 2


def test_choose_with_too_few_options_is_flagged():
    data = paper()
    data["questions"][0].update(
        {
            "choose": 2,
            "sub_parts": [
                {
                    "number": "1a",
                    "group": "A",
                    "marks": 6,
                    "text": "Only one option.",
                    "question_type": "short_note",
                    "units": [{"unit_id": "BIT351CO_U01", "confidence": "high"}],
                    "confidence": "high",
                }
            ],
        }
    )
    _, questions = build(data)
    assert questions[0].unclear
    assert "only 1 options captured" in questions[0].review_note


def test_question_ids_and_order_survive_double_digits():
    """`B10` sorts before `B2` as a string, so orderIndex carries the real order."""
    data = paper(
        full_marks=80,
        groups=[
            {
                "label": "B",
                "questions_printed": 11,
                "answer_count": 10,
                "marks_each": 8,
                "marks_total": 80,
                "instruction": "Answer TEN questions.",
            }
        ],
        questions=[
            {
                "number": str(i),
                "group": "B",
                "marks": 8,
                "text": f"Q{i}.",
                "question_type": "theory",
                "units": [{"unit_id": "BIT351CO_U01", "confidence": "high"}],
                "confidence": "high",
            }
            for i in range(1, 12)
        ],
    )
    _, questions = build(data)

    assert [q.q_id for q in questions][:3] == ["B1", "B2", "B3"]
    assert questions[9].q_id == "B10"
    assert [q.order_index for q in questions] == list(range(11))
    assert sorted(questions, key=lambda q: q.order_index)[10].q_id == "B11"


def test_legacy_question_types_are_normalised():
    """The 17 already-extracted papers use `written`/`mcq`; they must still load."""
    assert (
        ExtractedQuestion.model_validate(
            {"number": "1", "group": "A", "text": "x", "question_type": "written",
             "confidence": "high"}
        ).question_type
        == "theory"
    )
    assert (
        ExtractedQuestion.model_validate(
            {"number": "1", "group": "A", "text": "x", "question_type": "mcq",
             "confidence": "high"}
        ).question_type
        == "theory"
    )
    # `numerical` is never remapped — it is the tag that changes what students see.
    assert (
        ExtractedQuestion.model_validate(
            {"number": "1", "group": "A", "text": "x", "question_type": "numerical",
             "confidence": "high"}
        ).question_type
        == "numerical"
    )


def test_unknown_question_type_is_rejected_not_silently_defaulted():
    with pytest.raises(ValidationError):
        ExtractedQuestion.model_validate(
            {"number": "1", "group": "A", "text": "x", "question_type": "essay",
             "confidence": "high"}
        )


# ---------------------------------------------------------------------------
# Storage paths
# ---------------------------------------------------------------------------


def test_page_index_is_zero_padded_so_reading_order_survives_sorting():
    paths = [original_path("BIT351CO_2025_regular", i, "jpg") for i in (2, 10)]
    assert sorted(paths) == paths  # 002 before 010


def test_path_traversal_is_rejected():
    assert not is_safe_path_segment("../../etc/passwd")
    assert not is_safe_path_segment("a/b")
    assert is_safe_path_segment("BIT351CO_2025_regular")

    with pytest.raises(ValueError, match="unsafe"):
        solution_path("../other-paper", "A1")


# ---------------------------------------------------------------------------
# The golden reference — a real, hand-transcribed paper
# ---------------------------------------------------------------------------


@pytest.mark.skipif(not GOLDEN.exists(), reason="golden reference not present")
def test_golden_paper_validates_and_reports_complete():
    """The real 2025 BIT351CO paper: 11 questions, two groups, nested choice."""
    raw = json.loads(GOLDEN.read_text(encoding="utf-8"))

    # The golden file is in the examai-ingest shape, which carries the derived
    # fields. Strip them: this asserts we re-derive the same answer, rather than
    # reading back what the fixture already claims.
    raw.pop("coverage", None)
    for q in raw.get("questions", []):
        q.pop("needs_review", None)
        q.pop("question_id", None)
        for sub in q.get("sub_parts", []) or []:
            sub.pop("needs_review", None)
            sub.pop("question_id", None)

    doc, questions = build(raw)

    assert len(questions) == 11
    assert doc.coverage.status == "complete"
    assert {g.label for g in doc.groups} == {"A", "B"}
    assert doc.full_marks == 80
    assert sum(g.marks_total for g in doc.groups) == 80
    assert "RECONCILE" not in doc.extraction_notes
