"""Firestore and Cloud Storage access for the worker.

The worker holds Admin SDK credentials, which bypass security rules entirely.
That is why main.py refuses every request without the shared internal key: the
Next.js routes do the Firebase role check, and this service trusts only them.
"""

from __future__ import annotations

import json
from functools import lru_cache
from typing import Any

import firebase_admin
from firebase_admin import credentials, firestore, storage

from . import config


def _credential() -> credentials.Base:
    if config.GOOGLE_APPLICATION_CREDENTIALS:
        return credentials.Certificate(config.GOOGLE_APPLICATION_CREDENTIALS)

    if not (
        config.FIREBASE_PROJECT_ID
        and config.FIREBASE_CLIENT_EMAIL
        and config.FIREBASE_PRIVATE_KEY
    ):
        raise RuntimeError(
            "Firebase credentials are not configured. Set either "
            "GOOGLE_APPLICATION_CREDENTIALS to a service-account JSON path, or "
            "FIREBASE_PROJECT_ID / FIREBASE_CLIENT_EMAIL / FIREBASE_PRIVATE_KEY."
        )

    # The private key arrives from .env with literal \n sequences rather than
    # newlines; the same normalisation the Node side does in
    # src/lib/firebase-admin.ts.
    private_key = config.FIREBASE_PRIVATE_KEY.strip()
    if private_key.startswith('"') and private_key.endswith('"'):
        private_key = private_key[1:-1]
    private_key = private_key.replace("\\n", "\n").replace("\r\n", "\n")

    if "-----BEGIN PRIVATE KEY-----" not in private_key:
        raise RuntimeError(
            "FIREBASE_PRIVATE_KEY is malformed (no PEM header). It must be the "
            "full key including the BEGIN/END lines."
        )

    return credentials.Certificate(
        {
            "type": "service_account",
            "project_id": config.FIREBASE_PROJECT_ID,
            "client_email": config.FIREBASE_CLIENT_EMAIL,
            "private_key": private_key,
            "token_uri": "https://oauth2.googleapis.com/token",
        }
    )


@lru_cache(maxsize=1)
def _app() -> firebase_admin.App:
    if firebase_admin._apps:
        return firebase_admin.get_app()
    options: dict[str, Any] = {}
    if config.FIREBASE_STORAGE_BUCKET:
        options["storageBucket"] = config.FIREBASE_STORAGE_BUCKET
    return firebase_admin.initialize_app(_credential(), options)


def db():
    return firestore.client(_app())


def bucket():
    return storage.bucket(app=_app())


# ---------------------------------------------------------------------------
# Storage helpers
# ---------------------------------------------------------------------------


def download_bytes(path: str) -> bytes:
    blob = bucket().blob(path)
    if not blob.exists():
        raise FileNotFoundError(f"No object at gs://{bucket().name}/{path}")
    return blob.download_as_bytes()


def upload_text(path: str, text: str, content_type: str = "text/markdown") -> None:
    bucket().blob(path).upload_from_string(text, content_type=content_type)


def content_type_of(path: str) -> str:
    blob = bucket().blob(path)
    blob.reload()
    return blob.content_type or "application/octet-stream"


# ---------------------------------------------------------------------------
# Firestore helpers
# ---------------------------------------------------------------------------


def course_syllabus_units(course_id: str) -> set[str]:
    """Unit ids this course actually has, for catching invented tags.

    Falls back to an empty set when the course has not been seeded — an empty
    set means "cannot check", and derive.py treats None as "do not check" so
    the two cases stay distinguishable.
    """
    snap = db().collection("courses").document(course_id).get()
    if not snap.exists:
        return set()
    units = (snap.to_dict() or {}).get("syllabusUnits") or []
    return {u.get("unitId") for u in units if isinstance(u, dict) and u.get("unitId")}


def write_paper_with_questions(
    paper: dict[str, Any],
    questions: list[dict[str, Any]],
    *,
    preserve_human_work: bool = True,
) -> dict[str, int]:
    """Replace a paper's extraction, without destroying human review work.

    A re-extraction is expected — a better scan, an improved prompt — and it
    must be safe to run. The danger is that it silently reverts a reviewer's
    corrections: they approved a question, a re-run overwrote it with the
    model's version, and nothing in the UI says so. That destroys work that
    cost human time, and the reviewer has no way to notice.

    So an approved question is kept as-is, and human unit tags are carried
    forward onto the new document. Everything else is replaced wholesale.
    """
    client = db()
    paper_id = paper["paperId"]
    paper_ref = client.collection("papers").document(paper_id)
    questions_ref = paper_ref.collection("questions")

    existing: dict[str, dict[str, Any]] = {}
    if preserve_human_work:
        existing = {doc.id: doc.to_dict() or {} for doc in questions_ref.stream()}

    kept = 0
    incoming_ids = set()
    batch = client.batch()
    writes = 0

    for question in questions:
        q_id = question["qId"]
        incoming_ids.add(q_id)
        prior = existing.get(q_id)

        if prior and prior.get("reviewStatus") == "approved":
            # Approved: the human's version wins outright.
            kept += 1
            continue

        if prior:
            # Not approved, but human unit tags still outrank the model's.
            human_tags = [
                tag
                for tag in (prior.get("syllabusUnits") or [])
                if isinstance(tag, dict) and tag.get("taggedBy") == "human"
            ]
            if human_tags:
                model_tags = [
                    tag
                    for tag in question["syllabusUnits"]
                    if tag["unitId"] not in {t.get("unitId") for t in human_tags}
                ]
                question = {**question, "syllabusUnits": human_tags + model_tags}
            # A reviewer's note survives too; it is why the question was rejected.
            if prior.get("reviewerNote"):
                question = {**question, "reviewerNote": prior["reviewerNote"]}

        batch.set(questions_ref.document(q_id), question)
        writes += 1
        if writes % 400 == 0:
            batch.commit()
            batch = client.batch()

    # Questions that no longer exist in the new extraction. Deleted, because a
    # stale question from a previous run would otherwise sit in the paper
    # forever with no way for a reviewer to tell it apart.
    removed = 0
    for stale_id in set(existing) - incoming_ids:
        if existing[stale_id].get("reviewStatus") == "approved":
            # Never silently delete approved human work. Flag it instead.
            batch.set(
                questions_ref.document(stale_id),
                {
                    "unclear": True,
                    "reviewNote": (
                        "This approved question did not appear in the latest "
                        "extraction. Check whether it was dropped in error before "
                        "deleting it."
                    ),
                },
                merge=True,
            )
            writes += 1
            continue
        batch.delete(questions_ref.document(stale_id))
        removed += 1
        writes += 1

    batch.commit()
    paper_ref.set(paper, merge=True)

    return {"written": len(questions) - kept, "kept_approved": kept, "removed": removed}
