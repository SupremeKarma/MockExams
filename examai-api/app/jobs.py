"""Job records — what the admin screen's progress bar is reading.

One document per paper per stage, with a derived id (`<paperId>__<stage>`) so
that starting a stage twice updates one record instead of producing two rows
that disagree. Resuming is then just "run the stage again": the job document is
overwritten, not appended to.

Logs are capped. An unbounded array on a document that a browser is subscribed
to will eventually exceed Firestore's 1 MiB document limit, and the write that
crosses the line fails — taking the whole job update with it, so the job
appears to hang at whatever progress it last reported.
"""

from __future__ import annotations

import traceback
from contextlib import contextmanager
from typing import Any, Iterator

from .firebase import db
from .schemas import JobStage, now_iso

MAX_LOGS = 200


def job_id(paper_id: str, stage: JobStage) -> str:
    return f"{paper_id}__{stage}"


def _ref(paper_id: str, stage: JobStage):
    return db().collection("jobs").document(job_id(paper_id, stage))


class JobHandle:
    """Live handle to one job document."""

    def __init__(self, paper_id: str, stage: JobStage, created_by: str) -> None:
        self.paper_id = paper_id
        self.stage = stage
        self.created_by = created_by
        self._logs: list[dict[str, str]] = []

    @property
    def id(self) -> str:
        return job_id(self.paper_id, self.stage)

    def log(self, message: str, level: str = "info") -> None:
        """Append a log line and flush it, so the admin sees it as it happens."""
        self._logs.append({"at": now_iso(), "level": level, "message": message[:1000]})
        # Keep the newest. The tail is what explains a failure; the head is
        # usually "started".
        self._logs = self._logs[-MAX_LOGS:]
        _ref(self.paper_id, self.stage).set({"logs": self._logs}, merge=True)

    def progress(self, done: int, total: int) -> None:
        _ref(self.paper_id, self.stage).set(
            {"progress": {"done": done, "total": total}}, merge=True
        )


@contextmanager
def run_job(
    paper_id: str, stage: JobStage, created_by: str = ""
) -> Iterator[JobHandle]:
    """Run a stage, recording start, success, and failure on the job document.

    A failure sets the job to `failed` with the stage and the error, and moves
    the PAPER to `failed` too. Both matter: the job says what to retry, and the
    paper's status is what stops a half-extracted paper being treated as ready.
    """
    ref = _ref(paper_id, stage)
    snap = ref.get()
    attempts = ((snap.to_dict() or {}).get("attempts", 0) if snap.exists else 0) + 1

    handle = JobHandle(paper_id, stage, created_by)
    ref.set(
        {
            "jobId": handle.id,
            "paperId": paper_id,
            "stage": stage,
            "status": "running",
            "attempts": attempts,
            "error": None,
            "logs": [],
            "progress": {"done": 0, "total": 0},
            "startedAt": now_iso(),
            "finishedAt": None,
            "createdBy": created_by,
        }
    )

    try:
        yield handle
    except Exception as exc:  # noqa: BLE001 — recorded, then re-raised
        detail = f"{type(exc).__name__}: {exc}"
        ref.set(
            {
                "status": "failed",
                "error": detail[:1500],
                "finishedAt": now_iso(),
            },
            merge=True,
        )
        handle.log(traceback.format_exc()[-1500:], level="error")
        db().collection("papers").document(paper_id).set(
            {"status": "failed", "updatedAt": now_iso()}, merge=True
        )
        raise
    else:
        ref.set({"status": "succeeded", "finishedAt": now_iso()}, merge=True)


def latest(paper_id: str, stage: JobStage) -> dict[str, Any] | None:
    snap = _ref(paper_id, stage).get()
    return snap.to_dict() if snap.exists else None
