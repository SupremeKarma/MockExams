"""Validate extracted papers against schema/paper.schema.json.

    python validate_papers.py                    # validate work/extracted/*.json
    python validate_papers.py path/to/paper.json

Checks the JSON Schema, then three things a schema cannot express:

  1. coverage.marks_extracted actually equals the sum of the questions
  2. every unit_id exists in the semester's generated unit vocabulary
  3. marking_scheme point marks sum to the question's marks

Exit code 1 if anything fails. The point is that an incomplete extraction
should be loud: a paper covering a third of its marks must not look the same
as a complete one.
"""

import json
import sys
from pathlib import Path

HERE = Path(__file__).parent
SCHEMA_PATH = HERE / "schema" / "paper.schema.json"
EXTRACTED_DIR = HERE / "work" / "extracted"

try:
    from jsonschema import Draft202012Validator
except ImportError:
    print("jsonschema not installed:  pip install jsonschema")
    sys.exit(2)


def load_units(semester: int):
    """unit_id -> title, for the semester's vocabulary. Empty if not generated."""
    p = HERE / "schema" / f"units.sem{semester}.json"
    if not p.exists():
        return None
    data = json.loads(p.read_text(encoding="utf-8"))
    return {
        u["unit_id"]: u["title"]
        for s in data["subjects"]
        for u in s["units"]
    }


def walk(questions):
    """Yield every question object, including nested sub-parts.

    Skips non-object entries rather than crashing on them: some existing files
    carry `sub_parts` as a list of strings. The schema check reports that
    properly; this walk just must not die first and hide the real report.
    """
    for q in questions or []:
        if not isinstance(q, dict):
            continue
        yield q
        yield from walk(q.get("sub_parts"))


def questions_by_group(questions) -> dict:
    """Count TOP-LEVEL questions per group label.

    Coverage is counted in questions, not marks. PU papers offer choice
    ('Answer SEVEN questions' over eight printed), so a complete Group B holds
    8 questions worth 64 marks while the group is worth 56. Summed marks would
    call that over-extracted; question counts get it right.
    """
    counts: dict[str, int] = {}
    for q in questions or []:
        if not isinstance(q, dict):
            continue
        label = q.get("group")
        if label is None:
            continue
        counts[label] = counts.get(label, 0) + 1
    return counts


def check(path: Path, validator: Draft202012Validator) -> list[str]:
    problems: list[str] = []
    try:
        paper = json.loads(path.read_text(encoding="utf-8"))
    except json.JSONDecodeError as e:
        return [f"invalid JSON: {e}"]

    for err in sorted(validator.iter_errors(paper), key=lambda e: list(e.path)):
        loc = "/".join(str(p) for p in err.path) or "(root)"
        problems.append(f"schema: {loc}: {err.message}")

    # Anything below needs the basic shape to be present.
    if "questions" not in paper:
        return problems

    questions = paper["questions"]

    # 0. the printed group arithmetic must be self-consistent
    groups = paper.get("groups") or []
    for g in groups:
        if not isinstance(g, dict):
            continue
        if g.get("answer_count", 0) > g.get("questions_printed", 0):
            problems.append(
                f"group {g.get('label')}: answer_count={g.get('answer_count')} "
                f"exceeds questions_printed={g.get('questions_printed')}"
            )
        expect = (g.get("answer_count") or 0) * (g.get("marks_each") or 0)
        if g.get("marks_total") != expect:
            problems.append(
                f"group {g.get('label')}: marks_total={g.get('marks_total')} but "
                f"{g.get('answer_count')}x{g.get('marks_each')}={expect}"
            )
    if groups and paper.get("full_marks") is not None:
        summed = sum((g.get("marks_total") or 0) for g in groups if isinstance(g, dict))
        if summed != paper["full_marks"]:
            problems.append(
                f"full_marks={paper['full_marks']} but the groups total {summed}"
            )

    # 1. coverage must be honest, counted per group in QUESTIONS
    cov = paper.get("coverage")
    if cov:
        actual = questions_by_group(questions)
        printed = {
            g.get("label"): g.get("questions_printed")
            for g in groups if isinstance(g, dict)
        }
        real_status = "complete"
        for entry in cov.get("by_group") or []:
            label = entry.get("label")
            got = actual.get(label, 0)
            if entry.get("questions_extracted") != got:
                problems.append(
                    f"coverage group {label}: questions_extracted="
                    f"{entry.get('questions_extracted')} but {got} question(s) "
                    f"carry group={label!r}"
                )
            if label in printed and entry.get("questions_printed") != printed[label]:
                problems.append(
                    f"coverage group {label}: questions_printed="
                    f"{entry.get('questions_printed')} disagrees with groups[] "
                    f"({printed[label]})"
                )
            if got < (entry.get("questions_printed") or 0):
                real_status = "partial"
            elif got > (entry.get("questions_printed") or 0) and real_status != "partial":
                real_status = "over_extracted"

        covered_labels = {e.get("label") for e in cov.get("by_group") or []}
        for label in printed:
            if label not in covered_labels:
                problems.append(f"coverage has no entry for group {label!r}")
                real_status = "partial"

        if cov.get("status") != real_status:
            problems.append(
                f"coverage.status={cov.get('status')!r} but the per-group counts "
                f"make it {real_status!r}"
            )
        if real_status != "complete":
            unreviewed = [
                q["question_id"] for q in walk(questions)
                if not q.get("needs_review")
            ]
            if unreviewed:
                problems.append(
                    f"coverage is {real_status} so every question must carry "
                    f"needs_review=true; these do not: {unreviewed[:5]}"
                )

    # 2. unit ids must exist in the generated vocabulary
    units = load_units(paper.get("semester", -1))
    if units is None:
        problems.append(
            f"no unit vocabulary for semester {paper.get('semester')} — run "
            f"`node scripts/dump-syllabus-units.ts {paper.get('semester')}`"
        )
    else:
        subject = paper.get("subject_code", "")
        for q in walk(questions):
            for tag in q.get("units") or []:
                uid = tag.get("unit_id", "")
                if uid not in units:
                    problems.append(
                        f"{q.get('question_id')}: unit_id {uid!r} is not in the "
                        f"semester {paper.get('semester')} vocabulary"
                    )
                elif not uid.startswith(subject + "_"):
                    problems.append(
                        f"{q.get('question_id')}: unit_id {uid!r} belongs to "
                        f"another subject (paper is {subject})"
                    )

    # 3. marking scheme must add up
    for q in walk(questions):
        scheme = q.get("marking_scheme")
        if not scheme:
            continue
        if any(not pt.get("required", True) for pt in scheme):
            continue  # "any four of" — cannot sum meaningfully
        total = sum(pt.get("marks", 0) for pt in scheme)
        expected = q.get("marks") or 0
        if q.get("choose") and q.get("sub_parts"):
            # "Write short notes on any TWO" of three: the scheme covers all
            # three options because the student may pick any of them, so it
            # legitimately totals more than the question is worth. Expect the
            # per-option marks x every option instead.
            options = [x for x in q["sub_parts"] if isinstance(x, dict)]
            per_option = [x.get("marks") for x in options]
            if options and all(m is not None for m in per_option):
                expected = sum(per_option)
        if abs(total - expected) > 1e-6:
            detail = (
                f"question is worth {q.get('marks')}"
                if expected == (q.get("marks") or 0)
                else f"its {len(q.get('sub_parts') or [])} options total {expected}"
            )
            problems.append(
                f"{q.get('question_id')}: marking_scheme sums to {total} but "
                f"{detail}"
            )

    # 3a. an untagged question must be flagged for review
    for q in walk(questions):
        if not (q.get("units") or []) and not q.get("needs_review"):
            problems.append(
                f"{q.get('question_id')}: no syllabus unit tagged and "
                f"needs_review is not set — an untagged question disappears "
                f"from every count, so it must at least be visible"
            )

    # 3b. a null text must be explained by sub-parts or by low confidence
    for q in walk(questions):
        if q.get("text") is not None:
            continue
        has_parts = bool([p for p in (q.get("sub_parts") or []) if isinstance(p, dict)])
        if not has_parts and q.get("confidence") != "low":
            problems.append(
                f"{q.get('question_id')}: text is null with no sub_parts and "
                f"confidence={q.get('confidence')!r} — null must mean 'the text "
                f"is in the sub-parts' or 'it was unreadable', never 'lost'"
            )

    # 4. sub-part marks must reconcile with the parent
    for q in walk(questions):
        parts = [p for p in (q.get("sub_parts") or []) if isinstance(p, dict)]
        if not parts:
            continue
        part_marks = [p.get("marks") for p in parts]
        if any(m is None for m in part_marks):
            # The paper printed no split. Nothing to reconcile, and demanding
            # one would push the extractor into inventing a division.
            continue
        choose = q.get("choose")
        if choose:
            # "Write short notes on Any TWO" — the top `choose` options count.
            expected = sum(sorted(part_marks, reverse=True)[:choose])
            label = f"the {choose} highest of {len(parts)} options"
        else:
            expected = sum(part_marks)
            label = f"all {len(parts)} sub-parts"
        if (q.get("marks") or 0) != expected:
            problems.append(
                f"{q.get('question_id')}: marks={q.get('marks')} but {label} "
                f"sum to {expected}"
            )

    return problems


def main() -> int:
    if not SCHEMA_PATH.exists():
        print(f"missing schema: {SCHEMA_PATH}")
        return 2
    validator = Draft202012Validator(json.loads(SCHEMA_PATH.read_text(encoding="utf-8")))

    args = sys.argv[1:]
    paths = [Path(a) for a in args] if args else sorted(EXTRACTED_DIR.glob("*.json"))
    if not paths:
        print(f"no papers found in {EXTRACTED_DIR}")
        return 0

    failed = 0
    for p in paths:
        problems = check(p, validator)
        if problems:
            failed += 1
            print(f"\nFAIL  {p.name}")
            for msg in problems[:12]:
                print(f"        {msg}")
            if len(problems) > 12:
                print(f"        ... and {len(problems) - 12} more")
        else:
            print(f"OK    {p.name}")

    print(f"\n{len(paths) - failed}/{len(paths)} papers valid")
    return 1 if failed else 0


if __name__ == "__main__":
    sys.exit(main())
