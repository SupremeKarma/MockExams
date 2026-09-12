"""Syllabus parsing — the spine's correctness depends entirely on this.

Every note, question, mastery score and planner ranking links to a node id the
parser produced. If a unit is misnumbered or a topic is dropped here, everything
downstream is wrong in the same direction and nothing else in the system can
detect it — the spine is the reference, so there is nothing to check it against.

These run offline against fixture text. The golden test at the bottom runs
against the real university PDF when it is present.
"""

from __future__ import annotations

from pathlib import Path

import pytest

from app.syllabus.parser import (
    CourseIndexEntry,
    CourseSyllabus,
    absolute_semester,
    extract_pages,
    find_course_pages,
    parse_course,
    parse_semester,
    parse_semester_index,
    repair_fused_title,
    roman_to_int,
)
from app.syllabus.spine import InvalidLabel, build_course_nodes, label, program_node

REPO_ROOT = Path(__file__).resolve().parent.parent.parent
SYLLABUS_PDF = (
    REPO_ROOT / "bulk-imports" / "BIT" / "_syllabus-reference" / "BIT-IV-new-course.pdf"
)

INDEX_PAGE = """
Purbanchal University
BACHELOR OF INFORMATION TECHNOLOGY (BIT)
Year:II Semester:II
Course
Code
Course
Title
Credits Lecture
(Hrs.)
BIT251HS Probability and
Statistics
3 3 1  4
BIT252CO Computer
Organization and
Architecture
3 3 1 2 4
BIT253CO Operating System 3 3 1 2 6
BIT256CO Project-IV 2 - - 3 3
 Total 17 15 5 7 29
"""

LETTERED_PAGE = """
Operating System
BIT253CO
        Year: II                       Semester: II
Teaching schedule
Course Contents:
1. Introduction         [3 Hrs]
a. Operating system as an extended machine & resource manager
b. History and types of operating system
6. Deadlocks          [7 Hrs]
a. Introduction
d. Deadlock detection and recovery
f. Banker's Algorithm (Single and multiple resources)
Laboratory Works: There shall be following lab exercises
1. General commands and programming in LINUX
2. Process scheduling
Reference Books:
1. Andrew S. Tanenbaum, "Modern Operating System",  PHI
"""

DECIMAL_PAGE = """
Probability and Statistics
BIT251H
Year II
      Semester:  II
Course Contents:
1.  Nature and scope of statistics [2Hrs]
1.1 Definitions of statistics
1.2 Descriptive and inferential statistics
2.  Data and its collection [2Hrs]
2.1 Primary and secondary data
Reference Books:
"""

PROSE_PAGE = """
Database Management System
BIT254CO
Year: II                   Semester: II
Course Contents:
1. Introduction         [4 Hrs]
Definition of database,  DBMS, RDBMS, ORDBMS,  Definition of database system, Types and
Characteristics of database
2. Relational Model         [4 Hrs]
Introduction to relational databases, Relational algebra
Laboratory Works:
"""

WRAPPED_PAGE = """
Operating System
BIT253CO
Year: II  Semester: II
Course Contents:
2. Processes and Threads        [9 Hrs]
d. Inter- process communication (Multiprogrammning, parallel processing, critical sections, race condition,
mutual exclusion with busy waiting, semaphores, monitors)
e. Preemptive scheduling vs non-preemptive scheduling
Reference Books:
"""

INDEX = [
    CourseIndexEntry("BIT251HS", "Probability and Statistics"),
    CourseIndexEntry("BIT253CO", "Operating System"),
    CourseIndexEntry("BIT254CO", "Database Management System"),
]


def course(page: str, entry: CourseIndexEntry):
    return parse_course([page], entry, INDEX, "fixture")


# ---------------------------------------------------------------------------
# Semester numbering
# ---------------------------------------------------------------------------


def test_year_two_semester_two_is_the_fourth_semester():
    """The PDFs number semesters within a year; everything else uses 1..8."""
    assert absolute_semester(2, 2) == 4
    assert absolute_semester(1, 1) == 1
    assert absolute_semester(4, 2) == 8


def test_roman_numerals():
    assert roman_to_int("IV") == 4
    assert roman_to_int(" ii ") == 2
    assert roman_to_int("XIV") is None


# ---------------------------------------------------------------------------
# The index table is authoritative
# ---------------------------------------------------------------------------


def test_index_table_parses_wrapped_titles():
    entries = parse_semester_index(INDEX_PAGE)
    by_code = {e.code: e.title for e in entries}

    assert by_code["BIT253CO"] == "Operating System"
    # Title wrapped over three lines in the table cell.
    assert by_code["BIT252CO"] == "Computer Organization and Architecture"
    assert by_code["BIT251HS"] == "Probability and Statistics"
    assert "Total" not in by_code.values()


def test_printed_course_code_disagreeing_with_the_index_is_reported_not_silently_used():
    """A real defect: the Statistics page prints `BIT251H`, truncated.

    Trusting the page would file the course under a code that matches no paper,
    no unit vocabulary and no index entry — and it would look fine.
    """
    parsed = course(DECIMAL_PAGE, CourseIndexEntry("BIT251HS", "Probability and Statistics"))

    assert parsed.code == "BIT251HS"          # from the index table
    assert parsed.printed_code == "BIT251H"   # surfaced, not discarded


def test_matching_course_page_by_code_would_have_lost_courses():
    """Locating pages by title is not a stylistic choice.

    Computer Organization prints BIT251CO on its own page while the index says
    BIT252CO. Title matching finds it; code matching does not.
    """
    pages = ["ignored index", DECIMAL_PAGE]
    found = find_course_pages(pages, "Probability and Statistics", INDEX)
    assert found == [1]


# ---------------------------------------------------------------------------
# The three topic formats
# ---------------------------------------------------------------------------


def test_lettered_topics():
    parsed = course(LETTERED_PAGE, CourseIndexEntry("BIT253CO", "Operating System"))

    assert [u.number for u in parsed.units] == [1, 6]
    deadlocks = parsed.units[1]
    assert deadlocks.title == "Deadlocks"
    assert deadlocks.hours == 7
    assert [t.label for t in deadlocks.topics] == ["a", "d", "f"]
    assert deadlocks.topics[1].title == "Deadlock detection and recovery"


def test_decimal_topics():
    parsed = course(DECIMAL_PAGE, CourseIndexEntry("BIT251HS", "Probability and Statistics"))

    assert [u.number for u in parsed.units] == [1, 2]
    assert [t.label for t in parsed.units[0].topics] == ["1.1", "1.2"]
    assert parsed.units[0].topics[0].title == "Definitions of statistics"
    # "[2Hrs]" with no space still reads as hours.
    assert parsed.units[0].hours == 2


def test_prose_units_do_not_invent_topics():
    """Splitting prose on commas would manufacture topics the university never set.

    Downstream they would be indistinguishable from real ones. A unit with no
    topics is still a valid link target; a fabricated topic is a lie.
    """
    parsed = course(PROSE_PAGE, CourseIndexEntry("BIT254CO", "Database Management System"))

    assert len(parsed.units) == 2
    for unit in parsed.units:
        assert unit.topics == []
        assert unit.is_prose
    assert "Definition of database" in parsed.units[0].prose


def test_wrapped_topic_text_is_rejoined():
    parsed = course(WRAPPED_PAGE, CourseIndexEntry("BIT253CO", "Operating System"))
    ipc = parsed.units[0].topics[0]

    assert ipc.label == "d"
    assert ipc.title.endswith("semaphores, monitors)")
    assert "race condition, mutual exclusion" in ipc.title


# ---------------------------------------------------------------------------
# Things that must NOT become units
# ---------------------------------------------------------------------------


def test_lab_exercises_after_the_end_marker_are_not_units():
    """"Laboratory Works: 1. General commands..." must not become unit 1 again."""
    parsed = course(LETTERED_PAGE, CourseIndexEntry("BIT253CO", "Operating System"))

    titles = [u.title for u in parsed.units]
    assert "General commands and programming in LINUX" not in titles
    assert len(parsed.units) == 2


def test_reference_book_list_is_not_units():
    parsed = course(LETTERED_PAGE, CourseIndexEntry("BIT253CO", "Operating System"))
    assert not any("Tanenbaum" in u.title for u in parsed.units)


def test_decimal_topic_is_not_read_as_a_unit():
    """"1.1 Definitions" must not match the unit pattern — the `\\.\\s+` guards it."""
    parsed = course(DECIMAL_PAGE, CourseIndexEntry("BIT251HS", "Probability and Statistics"))
    assert [u.number for u in parsed.units] == [1, 2]
    assert all(not u.title.startswith("Definitions") for u in parsed.units)


# ---------------------------------------------------------------------------
# Spine paths
# ---------------------------------------------------------------------------


def test_labels_are_ltree_safe():
    assert label("BIT253CO") == "bit253co"
    assert label("BIT-253") == "bit_253"
    with pytest.raises(InvalidLabel):
        label("...")


def test_course_nodes_are_ordered_ancestors_first():
    """The database rejects a node whose parent is missing, so order is a contract."""
    parsed = course(LETTERED_PAGE, CourseIndexEntry("BIT253CO", "Operating System"))
    nodes = build_course_nodes(parsed, program_code="BIT", semester=4)

    seen: set[str] = {"bit", "bit.s4"}
    for node in nodes:
        parent = node.path.rsplit(".", 1)[0]
        assert parent in seen, f"{node.path} precedes its parent {parent}"
        seen.add(node.path)


def test_paths_match_the_documented_scheme():
    parsed = course(LETTERED_PAGE, CourseIndexEntry("BIT253CO", "Operating System"))
    nodes = {n.path: n for n in build_course_nodes(parsed, semester=4)}

    assert "bit.s4.bit253co" in nodes
    assert "bit.s4.bit253co.u6" in nodes
    # Topics are positional t1..tN: ltree labels cannot contain a dot, so the
    # printed "6.d" cannot be the path segment.
    assert nodes["bit.s4.bit253co.u6.t2"].code == "6.d"
    assert nodes["bit.s4.bit253co.u6.t2"].title == "Deadlock detection and recovery"


def test_decimal_topic_code_is_not_double_prefixed():
    parsed = course(DECIMAL_PAGE, CourseIndexEntry("BIT251HS", "Probability and Statistics"))
    nodes = {n.path: n for n in build_course_nodes(parsed, semester=4)}

    # Already fully qualified in the source — must stay "1.1", not become "1.1.1".
    assert nodes["bit.s4.bit251hs.u1.t1"].code == "1.1"


def test_course_without_a_semester_is_refused():
    """A course belonging to no semester has nowhere to hang in the spine."""
    parsed = course(LETTERED_PAGE, CourseIndexEntry("BIT253CO", "Operating System"))
    parsed.semester = None
    with pytest.raises(ValueError, match="semester"):
        build_course_nodes(parsed)


def test_program_node():
    node = program_node("BIT", "Bachelor of Information Technology", "Purbanchal University")
    assert node.path == "bit" and node.kind == "program"


# ---------------------------------------------------------------------------
# Golden: the real university PDF
# ---------------------------------------------------------------------------


@pytest.mark.skipif(not SYLLABUS_PDF.exists(), reason="syllabus PDF not present")
def test_real_semester_four_pdf():
    pages = extract_pages(str(SYLLABUS_PDF))
    parsed = {c.code: c for c in parse_semester(pages, SYLLABUS_PDF.name)}

    # Five taught courses; Project-IV has no syllabus units by design.
    assert {"BIT251HS", "BIT252CO", "BIT253CO", "BIT254CO", "BIT255CO"} <= set(parsed)

    os_course = parsed["BIT253CO"]
    assert os_course.title == "Operating System"
    assert os_course.semester == 4
    assert len(os_course.units) == 9
    assert os_course.total_hours == 45

    # Deadlocks is unit SIX in the official syllabus. The blueprint's example
    # path (`...u7.t3`) and its "all topics in Unit 7" exit test both point at
    # Real Time System instead.
    unit_titles = {u.number: u.title for u in os_course.units}
    assert unit_titles[6] == "Deadlocks"
    assert unit_titles[7] == "Real Time System"

    deadlocks = next(u for u in os_course.units if u.number == 6)
    assert len(deadlocks.topics) == 6
    assert any("Deadlock detection" in t.title for t in deadlocks.topics)
    assert any("Banker" in t.title for t in deadlocks.topics)

    # Disk scheduling — the acceptance-test topic — lives in unit 5.
    io_unit = next(u for u in os_course.units if u.number == 5)
    assert any("disk scheduling" in t.title.lower() for t in io_unit.topics)

    # Every 3-credit course is 45 taught hours. A course that parses to some
    # other total has almost certainly lost or gained a unit.
    for code in ("BIT251HS", "BIT252CO", "BIT253CO", "BIT254CO", "BIT255CO"):
        assert parsed[code].total_hours == 45, f"{code} totals {parsed[code].total_hours}h"


@pytest.mark.skipif(not SYLLABUS_PDF.exists(), reason="syllabus PDF not present")
def test_real_pdf_code_defects_are_surfaced():
    pages = extract_pages(str(SYLLABUS_PDF))
    parsed = {c.code: c for c in parse_semester(pages, SYLLABUS_PDF.name)}

    assert parsed["BIT251HS"].printed_code == "BIT251H"
    assert parsed["BIT252CO"].printed_code == "BIT251CO"
    # Operating System's page prints its code correctly, so nothing is flagged.
    assert parsed["BIT253CO"].printed_code is None


# ---------------------------------------------------------------------------
# Repairing titles broken by a wrapped table cell
# ---------------------------------------------------------------------------


@pytest.mark.parametrize(
    "printed, repaired",
    [
        # The three real cases from the semester VII index table.
        ("NetworkProgram ming", "Network Programming"),
        ("DigitalGovernanc e", "Digital Governance"),
        ("ApprenticeProje ct", "Apprentice Project"),
    ],
)
def test_repairs_a_title_split_by_a_wrapped_cell(printed, repaired):
    """A broken space is a PDF defect, not evidence the course is fake.

    Rejecting these lost real courses — the same mistake as dropping Project-IV
    for having no units. Rejoining and re-splitting at the internal capitals
    reconstructs what the document meant.
    """
    assert repair_fused_title(printed) == (repaired, printed)


@pytest.mark.parametrize(
    "title",
    [
        # Genuine titles that happen to carry an internal capital. The signal
        # for a fused title is the STRAY SHORT FRAGMENT after the space, not the
        # capital on its own — without that distinction every one of these would
        # be "repaired" into something the university never wrote.
        "MicroController",
        "WebTechnology",
        "MicroProcessor",
        "JavaScript",
        "DotNet Framework",
        "eCommerce",
        # Ordinary multi-word titles.
        "Operating System",
        "Database Management System",
        "Computer Organization and Architecture",
        "Probability and Statistics",
        "Programming in JAVA",
        "Project-IV",
        "Internship",
        "Data Structure and Algorithm",
        "Object Oriented Programming",
        # Acronyms and mixed forms.
        "Introduction to IoT",
        "SQL and PL/SQL",
        "Numerical Method",
    ],
)
def test_leaves_genuine_titles_untouched(title):
    assert repair_fused_title(title) == (title, None)


def test_repair_is_reported_as_a_source_defect():
    """Repaired, recorded, and shown to a reviewer — never silently corrected."""
    entries = parse_semester_index(
        "BIT401CO NetworkProgram ming\n3 3 1 2 6\n"
    )
    assert entries[0].title == "Network Programming"
    assert entries[0].title_printed == "NetworkProgram ming"


def test_source_defects_gathers_code_and_title_problems_together():
    course = CourseSyllabus(
        code="BIT252CO",
        title="Computer Organization",
        year=2,
        semester=4,
        units=[],
        printed_code="BIT251CO",
        title_printed="ComputerOrganiz ation",
    )
    defects = course.source_defects

    assert len(defects) == 2
    assert any("BIT251CO" in d for d in defects)
    assert any("wrapped mid-word" in d for d in defects)


def test_a_course_with_no_defects_reports_none():
    course = CourseSyllabus(
        code="BIT253CO", title="Operating System", year=2, semester=4, units=[]
    )
    assert course.source_defects == []
