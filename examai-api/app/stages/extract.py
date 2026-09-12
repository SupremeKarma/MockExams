"""Stage 1 — Extract.

Page images in, a paper document and its questions out. Idempotent: re-running
overwrites the same document ids, so a retry after a failure or a better scan
costs one model call and converges on the same result. Human review work
survives the overwrite (see firebase.write_paper_with_questions).
"""

from __future__ import annotations

import json
import re
from typing import Any

from pydantic import ValidationError

from .. import config, firebase, paths
from ..derive import build_documents
from ..jobs import JobHandle
from ..llm import ImagePart, ProviderError, VisionRequest, get_provider
from ..prompts import known_unit_ids, render_extraction_prompt
from ..schemas import ExtractedPaper, ExtractRequest, now_iso
from ..syllabus import repository as syllabus_repo
from ..syllabus import tagging

# One question showing every field. Kept deliberately small: a full paper here
# would cost tokens on every call and invite copying rather than extracting.
EXTRACTION_SHAPE: dict[str, Any] = {
    "subject_code": "BIT351CO",
    "subject_name": "Artificial Intelligence",
    "semester": 6,
    "year": 2025,
    "exam_type": "regular",
    "curriculum": "new_course",
    "full_marks": 80,
    "pass_marks": 32,
    "duration_hours": 3,
    "extraction_notes": "anything the reviewer should know",
    "groups": [
        {
            "label": "A",
            "questions_printed": 3,
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
            "mark_split": [4, 8],
            "text": "Define agent and show the architecture of an agent. Discuss the types of agent with suitable examples.",
            "question_type": "theory",
            "units": [{"unit_id": "BIT351CO_U02", "confidence": "high"}],
            "topics": ["agent architecture", "agent types"],
            "has_diagram": True,
            "diagram_description": "block diagram of a generic agent",
            "source_page": 1,
            "confidence": "high",
            "sub_parts": [
                {
                    "number": "1a",
                    "group": "A",
                    "marks": 4,
                    "text": "Define agent and show the architecture of an agent.",
                    "question_type": "theory",
                    "units": [{"unit_id": "BIT351CO_U02", "confidence": "high"}],
                    "confidence": "high",
                }
            ],
        }
    ],
}

_FENCE_OPEN = re.compile(r"^```(?:json)?\n?")
_FENCE_CLOSE = re.compile(r"\n?```$")


def _strip_fences(text: str) -> str:
    text = text.strip()
    text = _FENCE_OPEN.sub("", text)
    return _FENCE_CLOSE.sub("", text).strip()


def _load_pages(image_paths: list[str]) -> list[ImagePart]:
    parts: list[ImagePart] = []
    for path in image_paths:
        data = firebase.download_bytes(path)
        media_type = firebase.content_type_of(path)
        if media_type == "application/pdf":
            raise ValueError(
                f"{path} is a PDF. Split it into page images before extraction — "
                "the vision models read pages, and a multi-page PDF sent whole "
                "loses the page boundaries that source_page depends on."
            )
        parts.append(ImagePart(data=data, media_type=media_type))
    return parts


def _call_model(images: list[ImagePart], system: str) -> tuple[str, dict[str, Any], str]:
    provider = get_provider(
        config.MODEL_OCR_PROVIDER,
        config.api_key_for(config.MODEL_OCR_PROVIDER),
        config.MODEL_OCR,
        need="vision",
    )
    request = VisionRequest(
        system=system,
        text=(
            "Extract every question from this exam paper. Return only the JSON "
            "object.\n\nExpected shape:\n"
            f"{json.dumps(EXTRACTION_SHAPE, indent=2)}\n"
        ),
        images=images,
        max_tokens=config.EXTRACT_MAX_TOKENS,
        json_only=True,
    )
    result = provider.complete_vision(request)
    return result.text, result.usage, f"{result.provider}/{result.model}"


def _parse(raw: str) -> ExtractedPaper:
    return ExtractedPaper.model_validate(json.loads(_strip_fences(raw)))


def _sync_topic_links(paper_id: str, removed_ids: list[str], job: JobHandle) -> None:
    """Keep `examai.question_topics` in step with what was just written.

    Reads the questions back from Firestore rather than using the model's
    output directly: `write_paper_with_questions` may have kept an approved
    question as-is or merged in a reviewer's unit tags, and that merged result
    — not the model's raw output — is what the links must describe. A worker
    without Postgres reachable (a laptop with no Docker running) should not
    fail extraction over this, so a connection error is logged and swallowed;
    the paper still extracts, just without spine links until the DB is back.
    """
    try:
        for question_ref in removed_ids:
            syllabus_repo.unlink_question(f"{paper_id}/{question_ref}")

        linked_total = 0
        unresolved_total = 0
        for question in firebase.list_questions(paper_id):
            q_id = question.get("qId")
            if not q_id:
                continue
            outcome = tagging.sync_question_topics(
                f"{paper_id}/{q_id}", question.get("syllabusUnits") or []
            )
            linked_total += outcome["linked"]
            unresolved_total += outcome["unresolved"]

        job.log(
            f"Spine links: {linked_total} linked, {unresolved_total} unresolved "
            "(course/unit not yet in the imported spine)"
        )
    except Exception as exc:  # noqa: BLE001 — a link-sync failure must not fail extraction
        job.log(f"Skipped spine link sync: {exc}", level="warn")


def run(request: ExtractRequest, job: JobHandle) -> dict[str, Any]:
    """Extract one paper. Returns a summary for the API response."""
    paths.require_safe(request.paper_id, "paperId")

    job.log(f"Loading {len(request.image_paths)} page image(s)")
    images = _load_pages(request.image_paths)
    job.progress(0, 3)

    system, prompt_id = render_extraction_prompt()
    job.log(f"Extracting with {config.MODEL_OCR_PROVIDER}/{config.MODEL_OCR} ({prompt_id})")

    raw, usage, model_label = _call_model(images, system)
    job.progress(1, 3)
    job.log(
        f"{model_label} in={usage.get('input_tokens')} out={usage.get('output_tokens')} "
        f"finish={usage.get('finish_reason')}"
    )

    try:
        extracted = _parse(raw)
    except (json.JSONDecodeError, ValidationError) as first_error:
        # One retry, with the error fed back. Worth exactly one attempt: a
        # schema violation is usually a fixable slip (a stringy sub_part, a
        # missing group), while a second failure means the scan or the prompt is
        # the problem and retrying again just spends money on the same mistake.
        job.log(f"Invalid JSON, retrying once: {first_error}", level="warn")
        retry_system = (
            f"{system}\n\n## Your previous reply was rejected\n\n"
            f"{first_error}\n\nReturn corrected JSON matching the shape exactly."
        )
        raw, usage_retry, model_label = _call_model(images, retry_system)
        usage = {
            "input_tokens": (usage.get("input_tokens") or 0)
            + (usage_retry.get("input_tokens") or 0),
            "output_tokens": (usage.get("output_tokens") or 0)
            + (usage_retry.get("output_tokens") or 0),
            "finish_reason": usage_retry.get("finish_reason"),
        }
        try:
            extracted = _parse(raw)
        except (json.JSONDecodeError, ValidationError) as second_error:
            raise ValueError(
                f"Extraction returned invalid JSON twice. First: {first_error}. "
                f"Second: {second_error}. First 300 chars of the last reply: "
                f"{_strip_fences(raw)[:300]!r}"
            ) from second_error

    job.progress(2, 3)

    # Prefer the seeded course's vocabulary; fall back to the generated files so
    # extraction still validates tags before courses are seeded. `None` means
    # "cannot check", which derive.py treats differently from "checked, empty".
    known = firebase.course_syllabus_units(request.course_id)
    if not known:
        known = set(known_unit_ids(extracted.subject_code))
    checkable = known or None

    if extracted.subject_code.upper() != request.course_id.upper():
        job.log(
            f"Header reads subject {extracted.subject_code!r} but the upload was "
            f"filed under {request.course_id!r}. Storing under the upload's course; "
            "check the scan.",
            level="warn",
        )

    paper, questions = build_documents(
        extracted,
        paper_id=request.paper_id,
        course_id=request.course_id,
        program_id=request.program_id,
        image_paths=request.image_paths,
        created_by=request.created_by,
        known_units=checkable,
    )

    tokens = (usage.get("input_tokens") or 0) + (usage.get("output_tokens") or 0)
    paper.total_tokens = tokens
    paper.total_cost_usd = config.estimate_cost_usd(
        usage.get("input_tokens"), usage.get("output_tokens")
    )

    question_docs = []
    for question in questions:
        question.prompt_version = prompt_id
        question.model_used = model_label
        question.generated_at = now_iso()
        question_docs.append(question.to_firestore())

    result = firebase.write_paper_with_questions(paper.to_firestore(), question_docs)
    job.progress(3, 3)

    _sync_topic_links(request.paper_id, result["removedIds"], job)

    flagged = sum(1 for q in questions if q.unclear)
    job.log(
        f"Extracted {len(questions)} question(s), coverage={paper.coverage.status}, "
        f"{flagged} flagged for review, "
        f"{result['kept_approved']} approved question(s) preserved"
    )
    if paper.coverage.status != "complete":
        job.log(
            "Coverage is not complete: " + "; ".join(paper.coverage.missing_ranges),
            level="warn",
        )

    return {
        "paperId": paper.paper_id,
        "questions": len(questions),
        "flagged": flagged,
        "coverage": paper.coverage.status,
        "tokens": tokens,
        "costUsd": paper.total_cost_usd,
        "promptVersion": prompt_id,
        "model": model_label,
        **result,
    }
