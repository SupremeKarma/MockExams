"""Cloud Storage path construction.

Mirrors src/lib/examai/paths.ts exactly. If these two drift, the worker writes
a solution to one path and the reader fetches another, and the read comes back
"not found" rather than raising anything anyone would notice.
"""

from __future__ import annotations

import re

PAGE_EXTENSIONS = ("jpg", "jpeg", "png", "webp", "pdf")

MIME_TO_EXTENSION = {
    "image/jpeg": "jpg",
    "image/png": "png",
    "image/webp": "webp",
    "application/pdf": "pdf",
}

_SAFE_SEGMENT = re.compile(r"^[A-Za-z0-9_-]{1,64}$")


def is_safe_path_segment(value: str) -> bool:
    """Reject anything that could escape its own prefix.

    paper_id arrives from an HTTP request body. Without this check an id
    containing "../" would write outside the paper's folder — into another
    paper's solutions, or over an export being served. Ids are always
    <CODE>_<YEAR>_<type>, so everything else is rejected rather than sanitised.
    """
    return bool(_SAFE_SEGMENT.match(value))


def require_safe(value: str, label: str = "path segment") -> str:
    if not is_safe_path_segment(value):
        raise ValueError(f"unsafe {label}: {value!r}")
    return value


def paper_root(paper_id: str) -> str:
    return f"papers/{require_safe(paper_id, 'paperId')}"


def original_path(paper_id: str, index: int, ext: str) -> str:
    """Zero-padded because index is reading order: 10.jpg must not sort before 2.jpg."""
    return f"{paper_root(paper_id)}/original/{index:03d}.{ext}"


def solution_path(paper_id: str, q_id: str) -> str:
    return f"{paper_root(paper_id)}/solutions/q{require_safe(q_id, 'qId')}.md"


def export_pdf_path(paper_id: str) -> str:
    return f"{paper_root(paper_id)}/export/full.pdf"


def question_id(group: str, number: str) -> str:
    """`A1`, `B7a`. Stripped of anything that cannot sit in a document id."""
    raw = f"{group}{number}"
    cleaned = re.sub(r"[^A-Za-z0-9_-]", "", raw)
    return cleaned or "Q"
