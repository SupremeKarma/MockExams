#!/usr/bin/env python
"""Import the official PU BIT syllabus into the spine.

Phase 0. Everything downstream — notes, questions, mastery, the pass planner —
links to the node ids this creates, so the ids are permanent from the moment
content references them.

Usage:
  python scripts/import_syllabus.py --dry-run                 # parse and report
  python scripts/import_syllabus.py --semester 4              # import one semester
  python scripts/import_syllabus.py --semester 4 --course BIT253CO
  python scripts/import_syllabus.py --all                     # every PDF present
  python scripts/import_syllabus.py --tree bit.s4.bit253co    # render a subtree
"""

from __future__ import annotations

import argparse
import re
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from app.syllabus.parser import (  # noqa: E402
    CourseSyllabus,
    ScannedPdfError,
    extract_pages,
    parse_semester,
    parse_semester_index,
)
from app.syllabus.spine import (  # noqa: E402
    SpineNode,
    build_course_nodes,
    program_node,
    semester_node,
)

REPO_ROOT = Path(__file__).resolve().parent.parent.parent
SYLLABUS_DIR = REPO_ROOT / "bulk-imports" / "BIT" / "_syllabus-reference"

PROGRAM_CODE = "BIT"
PROGRAM_NAME = "Bachelor of Information Technology"
UNIVERSITY = "Purbanchal University"

# BIT-IV-new-course.pdf -> semester 4. Roman numeral in the filename.
_FILE_SEMESTER = re.compile(r"BIT-([IVX]+)-", re.IGNORECASE)
_ROMAN = {"I": 1, "II": 2, "III": 3, "IV": 4, "V": 5, "VI": 6, "VII": 7, "VIII": 8}


def semester_pdfs() -> dict[int, Path]:
    """Semester number -> PDF. Later files win when two name the same semester."""
    found: dict[int, Path] = {}
    for path in sorted(SYLLABUS_DIR.glob("BIT-*-new-course.pdf")):
        match = _FILE_SEMESTER.search(path.name)
        if not match:
            continue
        number = _ROMAN.get(match.group(1).upper())
        if number:
            found[number] = path
    return found


# Titles that mean the index-table parse latched onto page furniture rather
# than a course name.
_BAD_TITLE = re.compile(
    r"^(year\b|semester\b|teaching\b|total\b|credits?\b|hours?\b|course\s+(code|title))",
    re.IGNORECASE,
)


# Debris from a mis-read index table: leftover column numbers, or a wildcard
# code where a specialisation should be.
_JUNK_TITLE = re.compile(r"BIT\d?\*\*|\s\d+(\s+\d+){2,}|\b\d+\s*$")

# Titles broken by a wrapped table cell are REPAIRED, not rejected — see
# `parser.repair_fused_title`. The repair is recorded on the course and the
# importer lands it as a draft for confirmation.


def rejection_reason(syllabus: CourseSyllabus) -> str | None:
    """Why this parse must not be written to the spine, or None if it is sound.

    Rejection is for PAGE FURNITURE only — text that was never a course. A
    defect in how a real course was printed is repaired and flagged instead
    (see `CourseSyllabus.source_defects`): dropping a course because the PDF
    broke its title is the same mistake as dropping Project-IV because it has
    no units.

    The spine is the reference every other table points at, and a bogus node is
    not self-correcting: once a question is tagged to `bit.s8.bit453co.u3`,
    nothing downstream can tell that unit was never real. Semester VII and VIII
    PDFs use table layouts this parser reads badly — one yields a "course"
    titled "Year: IV Semester: II" — so the guard refuses anything that does
    not look like a genuine course rather than trusting the parse.

    Note what is NOT a rejection reason: having no units. See
    `no_units_reason()`.
    """
    title = syllabus.title.strip()

    if _BAD_TITLE.match(title):
        return f"title {title!r} looks like page furniture, not a course name"

    letters = sum(ch.isalpha() for ch in title)
    if letters < 4:
        return f"title {title!r} has almost no letters"

    if _JUNK_TITLE.search(title):
        return f"title {title!r} still carries index-table debris"

    # A parse that produced units with neither hours nor topics has almost
    # certainly picked up a stray numbered list rather than a syllabus.
    if syllabus.units and syllabus.total_hours == 0 and syllabus.topic_count == 0:
        return "units carry neither hours nor topics — probably not a syllabus"

    return None


def no_units_reason(syllabus: CourseSyllabus) -> str | None:
    """Why a course legitimately has no units, or None if it has some.

    A course with no units is not a failed parse — BIT256CO Project-IV is a real
    2-credit course in semester 4 that simply has no written syllabus. Dropping
    it would make the tree lie: a student looking at semester 4 would see five
    courses where the university offers six, and coverage stats would quietly
    compute against the wrong denominator.

    So the course node is imported with the reason recorded on it, and the
    Reader can say "no syllabus content" rather than pretending the course does
    not exist.
    """
    if syllabus.units:
        return None

    title = syllabus.title.lower()
    if "project" in title or "internship" in title or "apprentice" in title:
        return "project course, no written syllabus"
    return "no syllabus units printed in the source document"


def report(syllabus: CourseSyllabus, indent: str = "  ") -> None:
    prose = sum(1 for u in syllabus.units if u.is_prose)
    print(
        f"{indent}{syllabus.code}  {syllabus.title}\n"
        f"{indent}  units={len(syllabus.units)}  topics={syllabus.topic_count}  "
        f"hours={syllabus.total_hours:g}"
        + (f"  prose_units={prose}" if prose else "")
    )
    # Defects in the university PDF, not in the parse. Surfaced every run so
    # they are never mistaken for our own errors, and reported together —
    # a wrong code and a broken title are the same kind of problem.
    for defect in syllabus.source_defects:
        print(f"{indent}  ! {defect}")

    if prose:
        print(
            f"{indent}  note: {prose} unit(s) list topics as prose, not numbered items. "
            "Kept as units with no topic nodes rather than inventing topics."
        )


def import_semester(
    number: int,
    pdf: Path,
    *,
    only_course: str | None,
    dry_run: bool,
    replace: bool,
    syllabus_version: str = "new_course",
    status: str = "active",
) -> tuple[int, int]:
    print(f"\n=== Semester {number} — {pdf.name} ===")
    pages = extract_pages(str(pdf))

    try:
        parsed = parse_semester(pages, pdf.name)
    except ScannedPdfError as exc:
        # Not a failure of this import so much as a property of the file. Say so
        # and carry on, so one scanned PDF does not abort a whole --all run.
        print(f"  SKIPPED: {exc}")
        return 0, 0
    except ValueError as exc:
        print(f"  SKIPPED: {exc}")
        return 0, 0

    index = parse_semester_index(pages[0]) or []
    by_code = {s.code: s for s in parsed}

    missing = [e.code for e in index if e.code not in by_code]
    if missing:
        print(f"  ! no content pages found for: {', '.join(missing)}")

    nodes: list[SpineNode] = [
        program_node(PROGRAM_CODE, PROGRAM_NAME, UNIVERSITY),
        semester_node(PROGRAM_CODE, number),
    ]
    courses = 0
    rejected = 0
    # Course paths whose title was repaired: imported, but as drafts.
    needs_confirmation: list[str] = []
    for syllabus in parsed:
        if only_course and syllabus.code.upper() != only_course.upper():
            continue

        reason = rejection_reason(syllabus)
        if reason:
            print(f"  {syllabus.code}  {syllabus.title[:50]!r}\n    REJECTED: {reason}")
            rejected += 1
            continue

        # A course whose title had to be repaired is imported, but as a DRAFT —
        # the repair is a guess about what the PDF meant, and a guess belongs in
        # front of a human before it reaches students. Same treatment an OCR'd
        # syllabus gets, for the same reason. Checked before the branch below so
        # it applies whether or not the course has units.
        if syllabus.title_printed:
            needs_confirmation.append(
                f"{PROGRAM_CODE.lower()}.s{number}.{syllabus.code.lower()}"
            )

        empty = no_units_reason(syllabus)
        if empty:
            # A real course with nothing to divide into units. Imported as a
            # bare course node carrying the reason, so the tree is complete and
            # coverage counts against the right denominator — rather than the
            # course silently not existing.
            print(f"  {syllabus.code}  {syllabus.title}\n    no units — {empty}")
            for defect in syllabus.source_defects:
                print(f"    ! {defect}")
            course_path = f"{PROGRAM_CODE.lower()}.s{number}.{syllabus.code.lower()}"
            nodes.append(
                SpineNode(
                    id=course_path,
                    path=course_path,
                    kind="course",
                    title=syllabus.title,
                    order_index=0,
                    code=syllabus.code.upper(),
                    hours=None,
                    official_ref=f"{syllabus.source_ref or pdf.name} — {empty}",
                )
            )
            courses += 1
            continue

        report(syllabus)
        nodes.extend(build_course_nodes(syllabus, program_code=PROGRAM_CODE, semester=number))
        courses += 1

    if rejected:
        print(
            f"\n  {rejected} course(s) rejected — not written. These PDFs need a "
            "different table layout handled, or manual entry."
        )

    if courses == 0:
        # Writing just the program and semester nodes would leave an empty
        # semester in the tree that looks like a real but unpopulated one.
        print("  nothing importable here; wrote nothing.")
        return 0, 0

    if dry_run:
        print(f"\n  --dry-run: {len(nodes)} node(s) would be written for {courses} course(s).")
        return courses, len(nodes)

    from app.syllabus.repository import delete_subtree, upsert_nodes

    if replace:
        for syllabus in parsed:
            if only_course and syllabus.code.upper() != only_course.upper():
                continue
            path = f"{PROGRAM_CODE.lower()}.s{number}.{syllabus.code.lower()}"
            removed = delete_subtree(path)
            if removed:
                print(f"  replaced {syllabus.code}: removed {removed} existing node(s)")

    # Repaired courses are written separately, as drafts. Partitioning by path
    # prefix carries the whole subtree with its course: a unit under an
    # unconfirmed course must not be visible either.
    draft_paths = tuple(needs_confirmation)
    confirmed = [n for n in nodes if not n.path.startswith(draft_paths)] if draft_paths else nodes
    unconfirmed = [n for n in nodes if n.path.startswith(draft_paths)] if draft_paths else []

    written = upsert_nodes(confirmed, syllabus_version=syllabus_version, status=status)
    if unconfirmed:
        written.update(
            upsert_nodes(unconfirmed, syllabus_version=syllabus_version, status="draft")
        )
        print(
            f"\n  {len(needs_confirmation)} course(s) imported as DRAFT because the "
            "source title had to be repaired — confirm against the PDF, then:"
        )
        for path in needs_confirmation:
            print(f"      repository.set_status({path!r}, 'active')")
    print(
        f"\n  wrote {len(written)} node(s) for {courses} course(s)"
        + (
            f" as {status.upper()} — not visible in the Reader until confirmed against the source"
            if status == "draft"
            else "."
        )
    )
    return courses, len(written)


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--semester", type=int, help="semester number, e.g. 4")
    parser.add_argument("--course", help="limit to one course code")
    parser.add_argument("--all", action="store_true", help="every semester PDF present")
    parser.add_argument("--dry-run", action="store_true", help="parse and report, write nothing")
    parser.add_argument(
        "--replace",
        action="store_true",
        help="delete each course's existing subtree first (drops units removed from a revised syllabus)",
    )
    parser.add_argument("--tree", help="render the subtree at this path and exit")
    parser.add_argument("--migrate", action="store_true", help="apply migrations/ first")
    parser.add_argument(
        "--syllabus-version",
        default="new_course",
        help="revision label stored on program/course nodes, e.g. new_course",
    )
    parser.add_argument(
        "--status",
        default="active",
        choices=["active", "draft"],
        help="draft keeps nodes out of the Reader until a human confirms them "
             "against the source (use for OCR'd imports)",
    )
    args = parser.parse_args()

    if args.tree:
        from app.syllabus.repository import render_tree, subtree

        root = subtree(args.tree)
        if root is None:
            print(f"nothing at {args.tree}")
            return 1
        for line in render_tree(root):
            print(line)
        return 0

    if args.migrate and not args.dry_run:
        from app.db import migrate

        print("applied:", ", ".join(migrate()))

    available = semester_pdfs()
    if not available:
        print(f"No syllabus PDFs in {SYLLABUS_DIR}")
        return 1

    if args.all:
        targets = sorted(available.items())
    elif args.semester:
        if args.semester not in available:
            print(
                f"No PDF for semester {args.semester}. Available: "
                f"{', '.join(str(n) for n in sorted(available))}"
            )
            return 1
        targets = [(args.semester, available[args.semester])]
    else:
        print(
            "Pick --semester N or --all. Available semesters: "
            f"{', '.join(str(n) for n in sorted(available))}"
        )
        return 1

    total_courses = total_nodes = 0
    for number, pdf in targets:
        courses, nodes = import_semester(
            number,
            pdf,
            only_course=args.course,
            dry_run=args.dry_run,
            replace=args.replace,
            syllabus_version=args.syllabus_version,
            status=args.status,
        )
        total_courses += courses
        total_nodes += nodes

    print(f"\n{total_courses} course(s), {total_nodes} node(s) total.")

    if not args.dry_run:
        from app.syllabus.repository import counts_by_kind

        counts = counts_by_kind()
        print("spine now holds: " + ", ".join(f"{n} {k}(s)" for k, n in sorted(counts.items())))

    return 0


if __name__ == "__main__":
    raise SystemExit(main())
