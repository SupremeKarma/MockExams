"""Versioned prompt loading.

Every prompt lives in /prompts as `<name>.<version>.md` with YAML frontmatter,
and the version that produced a question is stored on that question as
`promptVersion`. That is the only way to answer "why does the 2024 batch look
different from the 2026 batch" months later — without it, a prompt edit
silently splits the corpus into two incompatible halves with no record of when.
"""

from __future__ import annotations

import re
from functools import lru_cache
from pathlib import Path
from typing import NamedTuple

from .config import PROMPTS_DIR, SCHEMA_DIR

_FRONTMATTER = re.compile(r"^---\n(.*?)\n---\n", re.DOTALL)


class Prompt(NamedTuple):
    name: str
    version: str
    body: str

    @property
    def id(self) -> str:
        """What gets stored on the question, e.g. `extraction.v1`."""
        return f"{self.name}.{self.version}"


@lru_cache(maxsize=32)
def load_prompt(name: str, version: str) -> Prompt:
    path = PROMPTS_DIR / f"{name}.{version}.md"
    if not path.exists():
        available = sorted(p.name for p in PROMPTS_DIR.glob(f"{name}.*.md"))
        raise FileNotFoundError(
            f"No prompt {name}.{version} at {path}. Available: {available or 'none'}"
        )

    raw = path.read_text(encoding="utf-8")
    body = _FRONTMATTER.sub("", raw, count=1).strip()
    if not body:
        raise ValueError(f"prompt {path} has frontmatter but no body")
    return Prompt(name=name, version=version, body=body)


@lru_cache(maxsize=1)
def load_unit_vocabulary() -> str:
    """Every generated semester vocabulary, formatted for the prompt.

    All semesters, not one: the semester is not known until the header is read,
    and pinning this to a single semester silently produced untaggable papers
    the moment a scan from another one went through — the model had no valid
    unit_id to choose and correctly left `units` empty. The prompt's
    subject-code prefix rule does the selection instead.
    """
    import json

    lines: list[str] = []
    for path in sorted(SCHEMA_DIR.glob("units.sem*.json")):
        data = json.loads(path.read_text(encoding="utf-8"))
        lines.append(f"--- Semester {data['semester']} ---")
        for subject in data["subjects"]:
            lines.append(f"{subject['subject_code']} — {subject['subject_name']}:")
            for unit in subject["units"]:
                lines.append(f"  {unit['unit_id']}: {unit['title']}")

    if not lines:
        raise FileNotFoundError(
            f"No units.sem*.json in {SCHEMA_DIR}. Generate them with "
            "`node scripts/dump-syllabus-units.ts <semester>` — without a "
            "vocabulary every question comes back untagged."
        )
    return "\n".join(lines)


@lru_cache(maxsize=8)
def known_unit_ids(subject_code: str) -> frozenset[str]:
    """Valid unit ids for one subject, so an invented tag can be caught.

    An invented unit id is worse than no tag: it passes every shape check and
    then silently matches nothing downstream, so the question disappears from
    frequency counts without ever being flagged.
    """
    import json

    ids: set[str] = set()
    for path in sorted(SCHEMA_DIR.glob("units.sem*.json")):
        data = json.loads(path.read_text(encoding="utf-8"))
        for subject in data["subjects"]:
            if subject["subject_code"].upper() == subject_code.upper():
                ids.update(unit["unit_id"] for unit in subject["units"])
    return frozenset(ids)


def render_extraction_prompt(version: str = "v1") -> tuple[str, str]:
    """Return (system_prompt, prompt_id) with the vocabulary substituted in."""
    prompt = load_prompt("extraction", version)
    body = prompt.body.replace("{unit_vocabulary}", load_unit_vocabulary())
    return body, prompt.id
