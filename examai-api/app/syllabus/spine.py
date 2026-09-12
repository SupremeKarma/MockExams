"""Turn a parsed course syllabus into ltree spine nodes.

Path shape:  bit . s4 . bit253co . u6 . t4
             ^     ^     ^          ^    ^
             |     |     |          |    topic (1-based, print order)
             |     |     |          unit number as printed
             |     |     course code, lowercased
             |     semester 1..8
             program

These ids are permanent. Notes, questions, mastery scores, bookmarks and URLs
all point at them, so renumbering a unit after content is linked silently
re-points that content at a different topic. Treat the printed syllabus
numbering as the contract: if the university renumbers, that is a migration,
not an import.
"""

from __future__ import annotations

import re
from dataclasses import dataclass

from .parser import CourseSyllabus, UnitNode

# ltree labels accept [A-Za-z0-9_] only. A hyphen or dot raises a syntax error
# rather than truncating, so this is validated here where the message can be
# useful instead of at the database.
_LABEL = re.compile(r"^[A-Za-z0-9_]+$")


class InvalidLabel(ValueError):
    pass


def label(value: str) -> str:
    """Fold a value into an ltree label.

    Requires at least one alphanumeric character. Substituting punctuation
    alone is not enough: "..." would fold to "___", which ltree accepts happily
    while carrying no information — and every punctuation-only input would
    collide on the same path segment, silently merging two nodes into one.
    """
    cleaned = re.sub(r"[^A-Za-z0-9_]", "_", value.strip().lower())
    if not _LABEL.match(cleaned) or not any(ch.isalnum() for ch in cleaned):
        raise InvalidLabel(
            f"cannot form an ltree label from {value!r}: it has no letters or digits"
        )
    return cleaned


@dataclass
class SpineNode:
    id: str
    path: str
    kind: str
    title: str
    order_index: int
    code: str | None = None
    hours: float | None = None
    official_ref: str | None = None

    @property
    def depth(self) -> int:
        return self.path.count(".") + 1


def program_node(program_code: str, name: str, university: str) -> SpineNode:
    path = label(program_code)
    return SpineNode(
        id=path,
        path=path,
        kind="program",
        title=name,
        order_index=0,
        code=program_code.upper(),
        official_ref=university,
    )


def semester_node(program_code: str, semester: int) -> SpineNode:
    path = f"{label(program_code)}.s{semester}"
    return SpineNode(
        id=path,
        path=path,
        kind="semester",
        title=f"Semester {semester}",
        order_index=semester,
        code=str(semester),
    )


def build_course_nodes(
    syllabus: CourseSyllabus,
    *,
    program_code: str = "BIT",
    semester: int | None = None,
) -> list[SpineNode]:
    """Course, unit and topic nodes for one parsed syllabus, in insert order.

    Insert order matters: the database refuses a node whose parent is absent, so
    ancestors must come first. Returning a flat ordered list rather than a
    nested structure makes that impossible to get wrong at the call site.
    """
    resolved = semester if semester is not None else syllabus.semester
    if resolved is None:
        raise ValueError(
            f"{syllabus.code}: no semester on the parsed syllabus and none supplied. "
            "The spine cannot place a course that belongs to no semester."
        )

    course_path = f"{label(program_code)}.s{resolved}.{label(syllabus.code)}"
    nodes: list[SpineNode] = [
        SpineNode(
            id=course_path,
            path=course_path,
            kind="course",
            title=syllabus.title,
            order_index=0,
            code=syllabus.code.upper(),
            hours=syllabus.total_hours or None,
            official_ref=syllabus.source_ref or None,
        )
    ]

    for unit in syllabus.units:
        nodes.extend(_unit_nodes(unit, course_path, syllabus.source_ref))

    return nodes


def _unit_nodes(unit: UnitNode, course_path: str, source_ref: str) -> list[SpineNode]:
    unit_path = f"{course_path}.u{unit.number}"
    unit_node = SpineNode(
        id=unit_path,
        path=unit_path,
        kind="unit",
        title=unit.title,
        order_index=unit.order_index,
        code=str(unit.number),
        hours=unit.hours,
        # A prose unit keeps its text here rather than inventing topic nodes
        # from it. The unit is still a valid link target; a manufactured topic
        # would be indistinguishable from a real one downstream.
        official_ref=unit.prose or (source_ref or None),
    )

    nodes = [unit_node]
    for index, topic in enumerate(unit.topics, start=1):
        topic_path = f"{unit_path}.t{index}"
        nodes.append(
            SpineNode(
                id=topic_path,
                path=topic_path,
                kind="topic",
                title=topic.title,
                order_index=topic.order_index,
                # The printed label, so a student can find the topic in the
                # university document. Decimal syllabuses already print it
                # fully qualified ("1.1"); lettered ones print a bare "d",
                # which is ambiguous across units and gets its unit prefixed.
                # The path uses positional t1..tN regardless, because ltree
                # cannot hold a dot inside a label.
                code=topic.label if "." in topic.label else f"{unit.number}.{topic.label}",
            )
        )
    return nodes
