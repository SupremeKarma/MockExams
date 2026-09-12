"""Turn what the model returned into what Firestore stores.

Everything in this module exists so that two specific failures cannot happen
quietly:

  1. A partial extraction that looks complete. Coverage is counted here, from
     the questions that actually came back, never read from the model's reply.

  2. A question that needs a human but does not say so. `unclear` is derived
     from concrete signals, and `review_note` always records which one fired —
     a flag with no reason costs the reviewer the time it was meant to save.
"""

from __future__ import annotations

import re

from .paths import question_id
from .schemas import (
    ChoiceRuleDoc,
    CoverageDoc,
    ExtractedPaper,
    ExtractedQuestion,
    GroupCoverageDoc,
    PaperDoc,
    PaperGroupDoc,
    QuestionDoc,
    UnitTagDoc,
    now_iso,
)

# Sub-part suffixes, so "1" with three parts becomes 1a, 1b, 1c when the model
# did not number them itself.
_SUFFIXES = "abcdefghijklmnop"


def normalise_group_label(label: str) -> str:
    """`"Group A"` and `"A"` are the same group.

    Real extractions mix the two: the BIT253CO 2024 paper came back with
    groups labelled "Group A"/"Group B" while its questions carried "A"/"B".
    Matching them literally found zero questions in either group and reported a
    COMPLETE extraction (3 of 3, 9 of 9) as `partial`.

    That is worth guarding carefully, because a false `partial` is nearly as
    damaging as a false `complete`: the whole point of coverage is that a
    reviewer trusts it, and a warning that fires on good papers is one they
    learn to click past.
    """
    cleaned = label.strip()
    without_prefix = re.sub(r"^(group|section|part)\s+", "", cleaned, flags=re.IGNORECASE)
    return (without_prefix or cleaned).strip().upper()


def derive_coverage(paper: ExtractedPaper) -> CoverageDoc:
    """Count questions per group and compare with what the paper prints.

    Counted in QUESTIONS PER GROUP, not summed marks. On a choice paper
    ("Answer SEVEN of eight, 7x8=56") a complete extraction legitimately holds
    64 marks of questions against a 56-mark group, so summed marks would report
    a perfect run as over-extracted. Question counts get it right.
    """
    counts: dict[str, int] = {}
    for q in paper.questions:
        key = normalise_group_label(q.group)
        counts[key] = counts.get(key, 0) + 1

    by_group: list[GroupCoverageDoc] = []
    status = "complete"
    missing: list[str] = []

    for group in paper.groups:
        label = normalise_group_label(group.label)
        got = counts.get(label, 0)
        by_group.append(
            GroupCoverageDoc(
                label=label,
                questions_extracted=got,
                questions_printed=group.questions_printed,
            )
        )
        if got < group.questions_printed:
            status = "partial"
            missing.append(
                f"Group {label}: {got} of {group.questions_printed} extracted"
            )
        elif got > group.questions_printed and status != "partial":
            status = "over_extracted"
            missing.append(
                f"Group {label}: {got} extracted, {group.questions_printed} printed "
                "(a question was probably split in two)"
            )

    if not paper.groups:
        # No groups read means the header was not understood, which means there
        # is nothing to measure completeness against. That is not "complete".
        status = "partial"
        missing.append("No groups were read from the paper header")

    notes = "Derived from the extraction, not self-reported by the model."
    if status != "complete":
        notes += " Re-shoot or re-run before anything here is published."

    return CoverageDoc(
        by_group=by_group,
        status=status,
        missing_ranges=missing,
        notes=notes,
    )


def _roll_up_units(q: ExtractedQuestion) -> list:
    """A parent's units are the union of its sub-parts'.

    The model reasonably tags the sub-parts of a split question and leaves the
    parent empty. Every question needs at least one unit to be visible to
    frequency counting, and deriving the parent from its children is exact
    rather than a guess.
    """
    for sub in q.sub_parts:
        _roll_up_units(sub)

    if q.units:
        return q.units

    merged: dict[str, object] = {}
    for sub in q.sub_parts:
        for tag in sub.units:
            merged.setdefault(tag.unit_id, tag)
    if merged:
        q.units = list(merged.values())  # type: ignore[assignment]
    return q.units


def _review_reasons(
    q: ExtractedQuestion, coverage_status: str, known_units: set[str] | None
) -> list[str]:
    """Every concrete reason this question needs a human. Empty means clean."""
    reasons: list[str] = []

    if q.confidence != "high":
        reasons.append(f"extraction confidence is {q.confidence!r}")

    if not q.units:
        # Legitimate — BIT353CO 2026 asks about neural networks in a subject
        # whose units stop at clustering — but it always needs checking,
        # because the other cause is a mis-read subject code.
        reasons.append("no syllabus unit tagged (the vocabulary may be incomplete)")

    for tag in q.units:
        if tag.confidence == "low":
            reasons.append(f"low-confidence unit tag {tag.unit_id}")
        if known_units is not None and tag.unit_id not in known_units:
            # An invented unit id is worse than none: it passes shape checks
            # and then silently never matches anything downstream.
            reasons.append(f"unit {tag.unit_id} is not in this course's syllabus")

    if q.text is None and not q.sub_parts:
        reasons.append("text unreadable and no sub-parts captured")

    if q.text and "[UNCLEAR:" in q.text:
        reasons.append("text contains an unreadable span")

    if q.mark_split and q.marks is not None and sum(q.mark_split) != q.marks:
        reasons.append(
            f"mark split {q.mark_split} sums to {sum(q.mark_split)}, "
            f"not the question's {q.marks}"
        )

    if q.choose is not None and len(q.sub_parts) <= q.choose:
        # "Answer any TWO" over two options is not a choice; it means the third
        # option was missed.
        reasons.append(
            f"choose={q.choose} but only {len(q.sub_parts)} options captured"
        )

    if coverage_status != "complete":
        reasons.append(f"paper coverage is {coverage_status}")

    return reasons


def _to_question_doc(
    q: ExtractedQuestion,
    *,
    order_index: int,
    coverage_status: str,
    known_units: set[str] | None,
    parent_number: str | None = None,
    sub_index: int | None = None,
) -> QuestionDoc:
    number = q.number
    if parent_number and sub_index is not None and not number.startswith(parent_number):
        number = f"{parent_number}{_SUFFIXES[sub_index]}"

    reasons = _review_reasons(q, coverage_status, known_units)

    sub_docs = [
        _to_question_doc(
            sub,
            order_index=i,
            coverage_status=coverage_status,
            known_units=known_units,
            parent_number=number,
            sub_index=i,
        )
        for i, sub in enumerate(q.sub_parts)
    ]

    tags = [
        UnitTagDoc(unit_id=t.unit_id, confidence=t.confidence, tagged_by="model")
        for t in q.units
    ]

    # The primary unit is the first high-confidence tag, else the first tag at
    # all. Used only for grouping in the UI; syllabus_units keeps the full set.
    primary = next((t.unit_id for t in tags if t.confidence == "high"), None)
    if primary is None and tags:
        primary = tags[0].unit_id

    group = normalise_group_label(q.group)
    return QuestionDoc(
        q_id=question_id(group, number),
        number=number,
        group=group,
        order_index=order_index,
        marks=q.marks,
        mark_split=q.mark_split,
        choice_rule=ChoiceRuleDoc(choose=q.choose) if q.choose else None,
        text_exact=q.text,
        type=q.question_type,
        syllabus_unit=primary,
        syllabus_units=tags,
        topics=q.topics,
        sub_parts=sub_docs,
        has_diagram=q.has_diagram,
        diagram_description=q.diagram_description,
        source_page=q.source_page,
        confidence=q.confidence,
        unclear=bool(reasons),
        review_note="; ".join(reasons) if reasons else None,
        # A numerical is "not yet verified", which is a different thing from
        # "nothing to verify". Only Phase 3 may turn this into True.
        verified_numerical=False if q.question_type == "numerical" else "n/a",
    )


def build_documents(
    extracted: ExtractedPaper,
    *,
    paper_id: str,
    course_id: str,
    program_id: str,
    image_paths: list[str],
    created_by: str,
    known_units: set[str] | None = None,
) -> tuple[PaperDoc, list[QuestionDoc]]:
    """The one conversion from model output to stored documents."""
    for q in extracted.questions:
        _roll_up_units(q)

    coverage = derive_coverage(extracted)

    questions = [
        _to_question_doc(
            q,
            order_index=i,
            coverage_status=coverage.status,
            known_units=known_units,
        )
        for i, q in enumerate(extracted.questions)
    ]

    timestamp = now_iso()
    paper = PaperDoc(
        paper_id=paper_id,
        course_id=course_id,
        program_id=program_id,
        year=extracted.year,
        exam_type=extracted.exam_type,
        full_marks=extracted.full_marks,
        pass_marks=extracted.pass_marks,
        time_hours=extracted.duration_hours,
        image_paths=image_paths,
        groups=[
            PaperGroupDoc(
                label=normalise_group_label(g.label),
                questions_printed=g.questions_printed,
                answer_count=g.answer_count,
                marks_each=g.marks_each,
                marks_total=g.marks_total,
                instruction=g.instruction,
            )
            for g in extracted.groups
        ],
        coverage=coverage,
        status="extracted",
        extraction_notes=_extraction_notes(extracted),
        created_by=created_by,
        created_at=timestamp,
        updated_at=timestamp,
    )
    return paper, questions


def _extraction_notes(paper: ExtractedPaper) -> str:
    """The model's notes, plus a mark-arithmetic check it cannot fake.

    full_marks must equal the sum of the groups' marks_total. When it does not,
    the usual cause is a handwritten correction applied to one number and not
    the other — which produces a paper whose totals look plausible in isolation
    and are wrong together.
    """
    notes = paper.extraction_notes.strip()

    if paper.groups:
        group_total = sum(g.marks_total for g in paper.groups)
        if group_total != paper.full_marks:
            warning = (
                f"MARKS DO NOT RECONCILE: groups sum to {group_total} but the header "
                f"reads {paper.full_marks}. Usually a handwritten correction applied "
                "to one figure and not the other — check the scan before publishing."
            )
            notes = f"{notes} | {warning}" if notes else warning

    return notes
