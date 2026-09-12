"""Parse the official Purbanchal University BIT syllabus PDFs into a tree.

Source: bulk-imports/BIT/_syllabus-reference/BIT-*-new-course.pdf — the actual
university documents, not a transcription. That matters: the spine is what every
question, note and mastery score hangs off, so if it disagrees with the printed
syllabus then every downstream "which unit does this belong to" answer is wrong
in the same direction.

These documents are messier than they look, and the parser is shaped by it.

**The printed course codes are not trustworthy.** In the semester IV PDF alone:
Probability and Statistics prints `BIT251H` (truncated), Computer Organization
prints `BIT251CO` where the index table and every other source say `BIT252CO`,
and Programming in JAVA prints no `Course Contents:` heading at all. So the
INDEX TABLE on page 1 is treated as authoritative for code and title, and
content pages are located by TITLE. Matching on the printed code silently lost
four of six courses.

**Three topic formats appear**, and they are handled differently:

  Decimal    1.  Nature and scope of statistics [2Hrs]
             1.1 Definitions of statistics
             1.2 Descriptive and inferential statistics

  Lettered   1. Introduction              [3 Hrs]
             a. Operating system as an extended machine
             b. History and types of operating system

  Prose      1. Introduction              [4 Hrs]
             Definition of database, DBMS, RDBMS, ORDBMS, Types and
             Characteristics of database

Decimal and lettered units yield real topic nodes. Prose units yield a unit with
NO topics, keeping their text verbatim on the unit. Splitting that prose on
commas would manufacture topics the university never defined, and downstream
they would be indistinguishable from real ones — worse than having none. A unit
is a perfectly good link target on its own.
"""

from __future__ import annotations

import re
from dataclasses import dataclass, field

# "1. Introduction [3 Hrs]" / "1.  Nature and scope [2Hrs]" / "1. Intro [12 Hours]".
# The `\.\s+` is load-bearing: it stops this matching a decimal topic like
# "1.1 Definitions", where a digit follows the dot instead of a space.
_UNIT = re.compile(
    r"^(?P<number>\d{1,2})\.\s+(?P<title>.+?)"
    r"\s*(?:\[\s*(?P<hours>\d+(?:\.\d+)?)\s*(?:Hrs?|Hours?)\.?\s*\])?\s*$",
    re.IGNORECASE,
)

# "1.1 Definitions of statistics"
_TOPIC_DECIMAL = re.compile(r"^(?P<unit>\d{1,2})\.(?P<index>\d{1,2})\.?\s+(?P<title>.+?)\s*$")

# "a. Process model, process states"
_TOPIC_LETTER = re.compile(r"^(?P<letter>[a-z])\.\s+(?P<title>.+?)\s*$")

_CONTENTS_START = re.compile(r"^\s*Course\s+Contents?\s*:?\s*$", re.IGNORECASE)
_CONTENTS_END = re.compile(
    r"^\s*(Laboratory\s+Works?|Lab\s+Works?|Reference\s+Books?|Text\s*Books?|"
    r"References?|Evaluation|Tutorials?|Practical\s+Works?)\b",
    re.IGNORECASE,
)

_YEAR_SEM = re.compile(r"Year\s*:?\s*(?P<year>[IVX]+).*?Semester\s*:?\s*(?P<sem>[IVX]+)", re.IGNORECASE | re.DOTALL)

_ROMAN = {"I": 1, "II": 2, "III": 3, "IV": 4, "V": 5, "VI": 6, "VII": 7, "VIII": 8}

_COURSE_CODE = re.compile(r"\b(BIT\d{3}[A-Z]{1,2})\b")
# Index-table row: a full code, then the start of the title.
_INDEX_ROW = re.compile(r"^(?P<code>BIT\d{3}[A-Z]{2})\s*(?P<rest>.*)$")
# "3 3 1 2 6" — the credits/hours row that closes an index entry.
_NUMBER_ROW = re.compile(r"^[\d\s\-.]+$")

# A PDF table cell wrapped mid-word, and extraction rejoined the halves without
# the space — so two words fused and the break landed somewhere else entirely:
# "Network Programming" arrives as "NetworkProgram ming".
#
# The signal is the STRAY SHORT FRAGMENT after the space, not the internal
# capital on its own. That distinction is what keeps genuine titles safe:
# "MicroController" and "WebTechnology" have an internal capital and no trailing
# fragment, so they are left exactly as printed.
_FUSED_TITLE = re.compile(r"([A-Z][a-z]+(?:[A-Z][a-z]*)+)\s+([a-z]{1,4})")

_NOISE_PREFIXES = (
    "purbanchal university",
    "bachelor of information technology",
    "teaching schedule",
    "examination scheme",
    "course objective",
    "objective:",
    "objectives:",
    "hours/week",
    "internal assessment",
    "theory tutorial practical",
    "theory practical",
    "after the completion",
    "course code",
    "course title",
)


@dataclass
class CourseIndexEntry:
    """One row of the semester's index table — the authoritative code and title."""

    code: str
    title: str
    credits: float | None = None
    #: The title exactly as extracted, when it had to be repaired. Kept so the
    #: defect is reported rather than silently corrected.
    title_printed: str | None = None


def repair_fused_title(title: str) -> tuple[str, str | None]:
    """Rejoin a title split by a wrapped table cell.

    Returns `(repaired, original)` — `original` is None when nothing changed.

    Rejoining then splitting at the internal capitals reconstructs the words the
    PDF actually meant: "NetworkProgram ming" -> "NetworkProgramming" ->
    "Network Programming".

    This is a REPAIR, not a rejection. A broken space is a defect in the source
    document, not evidence that the course is fake — dropping it would lose a
    real course exactly as dropping Project-IV did. The repair is recorded and
    the course lands as a draft for a human to confirm.
    """
    match = _FUSED_TITLE.search(title)
    if not match:
        return title, None

    joined = match.group(1) + match.group(2)
    spaced = re.sub(r"(?<=[a-z])(?=[A-Z])", " ", joined)
    repaired = title[: match.start()] + spaced + title[match.end() :]
    repaired = re.sub(r"\s+", " ", repaired).strip()

    return (repaired, title) if repaired != title else (title, None)


@dataclass
class TopicNode:
    """A syllabus topic. `label` is as printed: "1.1" or "a"."""

    label: str
    title: str
    order_index: int


@dataclass
class UnitNode:
    number: int
    title: str
    hours: float | None
    order_index: int
    topics: list[TopicNode] = field(default_factory=list)
    prose: str | None = None

    @property
    def is_prose(self) -> bool:
        return not self.topics and bool(self.prose)


@dataclass
class CourseSyllabus:
    code: str
    title: str
    year: int | None
    semester: int | None
    units: list[UnitNode]
    source_ref: str = ""
    # Set when the page's printed code disagrees with the index table. Recorded
    # rather than silently corrected: it is a defect in the source document and
    # a reviewer should see it.
    printed_code: str | None = None
    # Set when the title had to be rejoined from a wrapped table cell. Same
    # principle as printed_code: repaired, recorded, and shown to a reviewer.
    title_printed: str | None = None

    @property
    def source_defects(self) -> list[str]:
        """Every defect found in the source document for this course.

        One list so the importer reports them uniformly — a wrong code and a
        broken title are the same kind of problem, and a reviewer should see
        them together rather than in two different places.
        """
        defects: list[str] = []
        if self.printed_code:
            defects.append(
                f"the PDF prints code {self.printed_code!r} on this course's page; "
                f"the index table says {self.code!r}"
            )
        if self.title_printed:
            defects.append(
                f"title arrived as {self.title_printed!r} (a table cell wrapped "
                f"mid-word); repaired to {self.title!r}"
            )
        return defects

    @property
    def total_hours(self) -> float:
        return sum(u.hours or 0 for u in self.units)

    @property
    def topic_count(self) -> int:
        return sum(len(u.topics) for u in self.units)


def roman_to_int(value: str) -> int | None:
    return _ROMAN.get(value.strip().upper())


def absolute_semester(year: int | None, semester_in_year: int | None) -> int | None:
    """"Year: II, Semester: II" is the 4th semester overall.

    The PDFs number semesters within a year; everything else in this system —
    the app's syllabus data, paper filenames, course codes — uses 1..8.
    Converting here keeps the mismatch in one place.
    """
    if year is None or semester_in_year is None:
        return None
    return (year - 1) * 2 + semester_in_year


def _clean(line: str) -> str:
    return re.sub(r"[ \t   ]+", " ", line).strip()


def _looks_like_noise(line: str) -> bool:
    if not line:
        return True
    return line.lower().startswith(_NOISE_PREFIXES)


def _normalise_title(value: str) -> str:
    """Fold a title for comparison: lowercase, alphanumerics only.

    The index table says "Project-IV" while the content page says "Computer
    Project-IV", and wrapped table cells arrive with stray spaces. Comparing
    folded forms by containment handles both without a fuzzy-match library.
    """
    return re.sub(r"[^a-z0-9]", "", value.lower())


# ---------------------------------------------------------------------------
# Index table
# ---------------------------------------------------------------------------


def parse_semester_index(page_text: str) -> list[CourseIndexEntry]:
    """The course list from the semester's first page.

    This is the authoritative source for code and title. The per-course pages
    print codes that are sometimes wrong (BIT251CO for Computer Organization)
    or truncated (BIT251H for Probability and Statistics), and one course prints
    no code on its content page at all.
    """
    entries: list[CourseIndexEntry] = []
    current: dict | None = None

    def close() -> None:
        nonlocal current
        if current and current["title_parts"]:
            title = " ".join(current["title_parts"])
            title = re.sub(r"\s+", " ", title).strip(" .-")
            if title:
                repaired, printed = repair_fused_title(title)
                entries.append(
                    CourseIndexEntry(
                        code=current["code"],
                        title=repaired,
                        credits=current.get("credits"),
                        title_printed=printed,
                    )
                )
        current = None

    for raw in page_text.splitlines():
        line = _clean(raw)
        if not line:
            continue

        row = _INDEX_ROW.match(line)
        if row:
            close()
            current = {"code": row.group("code"), "title_parts": [], "credits": None}
            rest = row.group("rest").strip()
            # "BIT253CO Operating System 3 3 1 2 6" — title and numbers share a line.
            trailing = re.search(r"\s((?:[\d\-]+\s+){2,}[\d\-]+)\s*$", rest)
            if trailing:
                current["credits"] = _first_number(trailing.group(1))
                rest = rest[: trailing.start()].strip()
            if rest:
                current["title_parts"].append(rest)
            continue

        if current is None:
            continue

        if _NUMBER_ROW.match(line) and len(line.split()) >= 2:
            current["credits"] = current["credits"] or _first_number(line)
            close()
            continue

        if _looks_like_noise(line) or line.lower().startswith("total"):
            close()
            continue

        current["title_parts"].append(line)

    close()
    return entries


def _first_number(row: str) -> float | None:
    for token in row.split():
        if token.replace(".", "", 1).isdigit():
            return float(token)
    return None


# ---------------------------------------------------------------------------
# Locating a course's pages
# ---------------------------------------------------------------------------


def _page_starts_course(text: str, title: str) -> bool:
    """Does this page open a course whose header matches `title`?

    Checks the first few non-empty lines only. A title mentioned in passing
    deeper in the page is a cross-reference, not a course heading.
    """
    wanted = _normalise_title(title)
    if not wanted:
        return False

    head = [_clean(line) for line in text.splitlines() if _clean(line)][:6]
    for line in head:
        folded = _normalise_title(line)
        if not folded:
            continue
        if folded == wanted or wanted in folded or folded in wanted:
            return True
    return False


def find_course_pages(pages: list[str], title: str, index: list[CourseIndexEntry]) -> list[int]:
    """Page indexes belonging to one course, in order.

    A course runs from the page whose header matches its title until the page
    that opens a DIFFERENT course from the index. Stopping at the first page
    would drop the OS syllabus's units 8 and 9, which sit on the next page.
    """
    others = [e.title for e in index if _normalise_title(e.title) != _normalise_title(title)]

    start: int | None = None
    for number, text in enumerate(pages):
        if start is None:
            # Skip the index page itself: it names every course.
            if _page_starts_course(text, title) and not _is_index_page(text):
                start = number
            continue
        if any(_page_starts_course(text, other) for other in others):
            return list(range(start, number))

    return [] if start is None else list(range(start, len(pages)))


def _is_index_page(text: str) -> bool:
    return len(set(_COURSE_CODE.findall(text.upper()))) >= 3


# ---------------------------------------------------------------------------
# Parsing one course
# ---------------------------------------------------------------------------


def parse_course(
    pages: list[str],
    entry: CourseIndexEntry,
    index: list[CourseIndexEntry],
    source_ref: str = "",
) -> CourseSyllabus:
    numbers = find_course_pages(pages, entry.title, index)
    if not numbers:
        raise ValueError(f"{entry.code} ({entry.title}): no content pages found")

    text = "\n".join(pages[n] for n in numbers)
    lines = [_clean(line) for line in text.splitlines()]

    year, semester = _year_and_semester(text)
    units = _parse_units(lines)

    printed = _printed_code(lines)

    return CourseSyllabus(
        code=entry.code.upper(),
        title=entry.title,
        title_printed=entry.title_printed,
        year=year,
        semester=semester,
        units=units,
        source_ref=source_ref,
        printed_code=printed if printed and printed != entry.code.upper() else None,
    )


def _printed_code(lines: list[str]) -> str | None:
    for line in lines[:12]:
        match = _COURSE_CODE.search(line.upper())
        if match:
            return match.group(1)
    return None


def _year_and_semester(text: str) -> tuple[int | None, int | None]:
    match = _YEAR_SEM.search(re.sub(r"[ \t ]+", " ", text))
    if not match:
        return None, None
    year = roman_to_int(match.group("year"))
    return year, absolute_semester(year, roman_to_int(match.group("sem")))


def _contents_start_index(lines: list[str]) -> int:
    """Where the unit list begins.

    Usually a "Course Contents:" heading. Programming in JAVA has none, so the
    fallback is the first line that looks like unit 1 with an hours bracket —
    distinctive enough not to collide with prose.
    """
    for index, line in enumerate(lines):
        if _CONTENTS_START.match(line):
            return index + 1

    for index, line in enumerate(lines):
        match = _UNIT.match(line)
        if match and int(match.group("number")) == 1 and match.group("hours"):
            return index

    return -1


def _parse_units(lines: list[str]) -> list[UnitNode]:
    start = _contents_start_index(lines)
    if start < 0:
        return []

    units: list[UnitNode] = []
    current: UnitNode | None = None
    current_topic: TopicNode | None = None
    prose: list[str] = []

    def flush_prose() -> None:
        nonlocal prose
        if current is not None and prose and not current.topics:
            current.prose = " ".join(prose).strip()
        prose = []

    for line in lines[start:]:
        if _CONTENTS_END.match(line):
            break
        if not line or _looks_like_noise(line):
            continue

        decimal = _TOPIC_DECIMAL.match(line)
        if decimal and current is not None and int(decimal.group("unit")) == current.number:
            flush_prose()
            current_topic = TopicNode(
                label=f"{decimal.group('unit')}.{decimal.group('index')}",
                title=decimal.group("title").strip(" .:"),
                order_index=len(current.topics),
            )
            current.topics.append(current_topic)
            continue

        unit = _UNIT.match(line)
        if unit:
            number = int(unit.group("number"))
            # Unit numbers only increase within a course. A number that goes
            # backwards means this is not a unit heading — most often a
            # numbered lab exercise that slipped past the end marker. Ignoring
            # it keeps "1. General commands and programming in LINUX" out of
            # the tree.
            if units and number <= units[-1].number:
                continue

            flush_prose()
            current_topic = None
            current = UnitNode(
                number=number,
                title=unit.group("title").strip(" .:"),
                hours=float(unit.group("hours")) if unit.group("hours") else None,
                order_index=len(units),
            )
            units.append(current)
            continue

        if current is None:
            continue

        letter = _TOPIC_LETTER.match(line)
        if letter:
            flush_prose()
            current_topic = TopicNode(
                label=letter.group("letter"),
                title=letter.group("title").strip(" .:"),
                order_index=len(current.topics),
            )
            current.topics.append(current_topic)
            continue

        # A continuation of whatever came last: a wrapped topic, or prose.
        if current_topic is not None:
            current_topic.title = f"{current_topic.title} {line}".strip()
        else:
            prose.append(line)

    flush_prose()
    return units


# ---------------------------------------------------------------------------
# Whole document
# ---------------------------------------------------------------------------


class ScannedPdfError(ValueError):
    """The PDF has no text layer — it is page images and needs OCR."""


def has_text_layer(pages: list[str], min_chars: int = 200) -> bool:
    """Is there extractable text at all?

    Several of these syllabus PDFs are CamScanner photographs of a printed
    document: `extract_text()` returns empty strings for every page. Without
    this check the failure surfaces as "no course index table", which sends you
    looking for a parsing bug instead of at a file that has nothing to parse.
    """
    return sum(len(p.strip()) for p in pages) >= min_chars


def parse_semester(pages: list[str], source_ref: str = "") -> list[CourseSyllabus]:
    """Every course in one semester PDF, index table first."""
    if not pages:
        return []

    if not has_text_layer(pages):
        raise ScannedPdfError(
            f"{source_ref or 'document'}: no text layer — this is a scanned PDF "
            f"({len(pages)} page images). It needs OCR before it can be parsed; "
            "the vision pipeline in app/stages/extract.py already does this for "
            "question papers."
        )

    index = parse_semester_index(pages[0])
    if not index:
        # The index is normally page 1, but a document with a cover page puts
        # it later. Look a little further before giving up.
        for page in pages[1:4]:
            index = parse_semester_index(page)
            if index:
                break

    if not index:
        raise ValueError(f"{source_ref or 'document'}: no course index table in the first pages")

    out: list[CourseSyllabus] = []
    for entry in index:
        try:
            out.append(parse_course(pages, entry, index, source_ref))
        except ValueError:
            # A course with no locatable pages is reported by the caller against
            # the index, so the gap is visible rather than silently absent.
            continue
    return out


def extract_pages(pdf_path: str) -> list[str]:
    """Page text from a syllabus PDF. Separate so parsing is testable without one."""
    import pypdf

    reader = pypdf.PdfReader(pdf_path)
    return [page.extract_text() or "" for page in reader.pages]
