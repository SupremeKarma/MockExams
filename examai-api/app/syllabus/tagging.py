"""Resolve a question's syllabus-unit tags to spine node uuids, and link them.

This bridges two independently-numbered vocabularies:

  * Extraction tags a question with `{SUBJECT}_U{NN}` — a positional id
    generated from `src/data/bitSyllabusData.ts` by
    `scripts/dump-syllabus-units.ts`, where NN is the unit's 1-based position
    in that file's `keyUnits` array.
  * The spine numbers units by what the official syllabus PDF prints — see
    `app/syllabus/parser.py` and `docs/spine.md`.

Both are print order, so `..._U06` and the spine's `u6` agree in practice (this
is verified for BIT253CO — see `docs/spine.md`'s "Unit 6 is Deadlocks" note).
Nothing enforces that they agree, though, so an unresolvable tag is skipped and
reported rather than guessed at: a missing link is a visible gap, a wrong one
would be a silent misattribution — exactly the mistake `docs/spine.md` and
`docs/blueprint.md` both document a prior draft of this project making.
"""

from __future__ import annotations

import re
from typing import Any

from . import repository

_UNIT_ID_RE = re.compile(r"^([A-Za-z0-9]+)_U(\d+)$")


def parse_unit_id(unit_id: str) -> tuple[str, int] | None:
    """`"BIT253CO_U06"` -> `("BIT253CO", 6)`, or `None` if it isn't that shape."""
    match = _UNIT_ID_RE.match(unit_id)
    if match is None:
        return None
    return match.group(1), int(match.group(2))


def resolve_unit_node(unit_id: str) -> dict[str, Any] | None:
    """A unit tag's spine node, or `None` if it cannot be resolved.

    `None` covers three distinct cases the caller does not need to tell apart:
    the id is not the expected shape, the course has not been imported into
    the spine yet, or the course has fewer units than the tag claims.
    """
    parsed = parse_unit_id(unit_id)
    if parsed is None:
        return None
    course_code, unit_number = parsed
    return repository.find_unit_by_number(course_code, unit_number)


def sync_question_topics(question_ref: str, unit_tags: list[dict[str, Any]]) -> dict[str, int]:
    """Make `question_topics` match a question's current `syllabusUnits`.

    Model-tagged links are replaced wholesale (drop then re-insert) so a tag
    the latest extraction no longer produces does not linger. Human-tagged
    links are written too, but never dropped by this call — see
    `repository.unlink_model_tags`.

    The first tag in the list is linked as `primary` and the rest as
    `secondary`, matching how `derive.py` picks `syllabus_unit` (the first
    high-confidence tag, else the first tag) for the same list.
    """
    repository.unlink_model_tags(question_ref)

    linked = 0
    unresolved = 0
    for index, tag in enumerate(unit_tags):
        node = resolve_unit_node(tag["unitId"])
        if node is None:
            unresolved += 1
            continue
        repository.link_question(
            question_ref,
            node["uuid"],
            role="primary" if index == 0 else "secondary",
            tagged_by="human" if tag.get("taggedBy") == "human" else "model",
        )
        linked += 1

    return {"linked": linked, "unresolved": unresolved}
