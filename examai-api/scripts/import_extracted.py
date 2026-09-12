#!/usr/bin/env python
"""Import papers already extracted by examai-ingest into Firestore.

There are 16 of them in examai-ingest/work/extracted/, each one a real paper
that has already been read by a vision model and paid for. Re-extracting them
through the new pipeline would cost 16 more vision calls to produce the same
questions, which is exactly the "cheap-first" rule the plan asks for.

This deliberately reuses build_documents() — the same function the live extract
stage calls — rather than reimplementing the mapping. An import path with its
own derivation would be a second source of truth for coverage and `unclear`,
and the day the two disagree there would be no way to tell which papers came
from which.

Usage:
  cd examai-api
  python scripts/import_extracted.py --dry-run
  python scripts/import_extracted.py
  python scripts/import_extracted.py --only BIT351CO_2025_regular
"""

from __future__ import annotations

import argparse
import json
import sys
from pathlib import Path

# Allow `python scripts/import_extracted.py` from the examai-api directory.
sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from pydantic import ValidationError  # noqa: E402

from app.derive import build_documents  # noqa: E402
from app.paths import original_path  # noqa: E402
from app.schemas import ExtractedPaper  # noqa: E402
from app.syllabus import tagging  # noqa: E402

REPO_ROOT = Path(__file__).resolve().parent.parent.parent
EXTRACTED_DIR = REPO_ROOT / "examai-ingest" / "work" / "extracted"
INPUT_DIR = REPO_ROOT / "examai-ingest" / "input"

LEGACY_TYPES = {"written", "mcq"}


def image_paths_for(paper_id: str, source_files: list[str]) -> list[str]:
    """Storage paths the scans WILL live at once uploaded.

    The extracted JSON records local filenames (`input/BIT351CO_2025_regular_p1.jpg`).
    Those are recorded as the Storage paths they map to, so a re-extraction of an
    imported paper finds its pages where the schema says they are — the actual
    image bytes are uploaded separately by `--upload-scans`.
    """
    paths: list[str] = []
    for index, name in enumerate(source_files):
        ext = Path(name).suffix.lstrip(".").lower() or "jpg"
        if ext == "jpeg":
            ext = "jpg"
        paths.append(original_path(paper_id, index, ext))
    return paths


def local_scan_for(source_file: str) -> Path | None:
    candidate = INPUT_DIR / Path(source_file).name
    return candidate if candidate.exists() else None


def count_legacy_types(raw: dict) -> int:
    """How many questions carried the old `written`/`mcq` vocabulary.

    Reported rather than hidden: `mcq` -> `theory` is a lossy remap, and on
    these papers an `mcq` tag is a mis-tag (PU semester papers are entirely
    descriptive), so it is worth knowing which papers had them.
    """
    total = 0

    def walk(questions: list) -> None:
        nonlocal total
        for q in questions or []:
            if q.get("question_type") in LEGACY_TYPES:
                total += 1
            walk(q.get("sub_parts") or [])

    walk(raw.get("questions") or [])
    return total


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--dry-run", action="store_true", help="parse and report, write nothing")
    parser.add_argument("--only", help="import a single paper_id")
    parser.add_argument(
        "--upload-scans",
        action="store_true",
        help="also upload the page images from examai-ingest/input/ to Storage",
    )
    args = parser.parse_args()

    files = sorted(EXTRACTED_DIR.glob("*.json"))
    if args.only:
        files = [f for f in files if f.stem == args.only]
    if not files:
        print(f"No extracted JSON found in {EXTRACTED_DIR}")
        return 1

    ok = 0
    failed: list[tuple[str, str]] = []
    with_solutions = 0

    # Imported only when actually writing, so --dry-run needs no credentials.
    firebase = None
    if not args.dry_run:
        from app import firebase as firebase_module

        firebase = firebase_module

    for path in files:
        raw = json.loads(path.read_text(encoding="utf-8"))
        paper_id = raw.get("paper_id") or path.stem

        try:
            extracted = ExtractedPaper.model_validate(raw)
        except ValidationError as err:
            failed.append((paper_id, str(err).splitlines()[0]))
            print(f"SKIP {paper_id}: does not validate — {str(err).splitlines()[0]}")
            continue

        source_files = raw.get("source_files") or []
        image_paths = image_paths_for(paper_id, source_files) or [
            original_path(paper_id, 0, "jpg")
        ]

        paper, questions = build_documents(
            extracted,
            paper_id=paper_id,
            course_id=extracted.subject_code,
            program_id="BIT",
            image_paths=image_paths,
            created_by="import:examai-ingest",
            known_units=None,
        )

        legacy = count_legacy_types(raw)
        solutions_ready = sum(1 for q in raw.get("questions") or [] if q.get("solution_path"))
        if solutions_ready:
            with_solutions += 1

        flagged = sum(1 for q in questions if q.unclear)
        print(
            f"{'DRY ' if args.dry_run else ''}{paper_id}: {len(questions)} questions, "
            f"coverage={paper.coverage.status}, {flagged} flagged"
            + (f", {legacy} legacy type(s) remapped" if legacy else "")
            + (f", {solutions_ready} solution(s) on disk" if solutions_ready else "")
        )

        if args.dry_run:
            ok += 1
            continue

        assert firebase is not None
        question_docs = []
        for question in questions:
            question.prompt_version = "examai-ingest.p2_extract"
            question.model_used = "imported"
            question_docs.append(question.to_firestore())

        firebase.write_paper_with_questions(paper.to_firestore(), question_docs)

        try:
            outcome = tagging.sync_paper_topics(paper_id)
            print(
                f"     spine links: {outcome['linked']} linked, "
                f"{outcome['unresolved']} unresolved"
            )
        except Exception as exc:  # noqa: BLE001 — a link-sync failure must not fail the import
            print(f"     spine link sync skipped: {exc}")

        if args.upload_scans:
            for index, source in enumerate(source_files):
                local = local_scan_for(source)
                if local is None:
                    print(f"     no local scan for {source}")
                    continue
                target = image_paths[index]
                blob = firebase.bucket().blob(target)
                blob.upload_from_filename(str(local))
                print(f"     uploaded {local.name} -> {target}")

        ok += 1

    print(f"\n{ok} paper(s) {'checked' if args.dry_run else 'imported'}, {len(failed)} skipped.")
    if with_solutions:
        print(
            f"{with_solutions} paper(s) already have generated solutions on disk "
            "(solutions/). Phase 2 uploads those to Storage rather than regenerating them."
        )
    for paper_id, reason in failed:
        print(f"  {paper_id}: {reason}")

    return 0 if not failed else 1


if __name__ == "__main__":
    raise SystemExit(main())
