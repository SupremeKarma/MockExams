"""FastAPI worker — all AI, OCR, verification and PDF work runs here.

Trust model, because it is the thing to get wrong: this service holds Firebase
Admin credentials and can write any paper in the project. It does NOT verify
Firebase user tokens. Instead the Next.js API routes verify the caller's
identity and admin role, and then call here with a shared internal key.

That means the internal key is equivalent to admin access, and the service must
never be exposed to the public internet. Bind it to localhost or an internal
network, and if it ever does need a public address, put real authentication in
front of it rather than relying on the key alone.
"""

from __future__ import annotations

import asyncio
import logging
from typing import Any

from fastapi import BackgroundTasks, Depends, FastAPI, Header, HTTPException
from fastapi.responses import JSONResponse

from . import config, jobs
from .routes_syllabus import router as syllabus_router
from .schemas import ExtractRequest
from .stages import extract

logging.basicConfig(level=logging.INFO)
log = logging.getLogger("examai")

app = FastAPI(title="ExamAI worker", version="0.1.0")

# Read-only, and deliberately outside the internal-key guard: the syllabus is
# the university's published reference material, which the app already shows
# students. Nothing under it can mutate the spine — imports run from the CLI.
app.include_router(syllabus_router)

# One stage at a time per process. Extraction is a single large vision call and
# running several concurrently mostly buys rate-limit errors; the limit exists
# so a burst of admin clicks queues rather than fans out.
_stage_semaphore = asyncio.Semaphore(config.STAGE_CONCURRENCY)


async def require_internal_key(
    x_internal_key: str | None = Header(default=None, alias="X-Internal-Key"),
) -> None:
    expected = config.INTERNAL_API_KEY
    if not expected:
        raise HTTPException(
            status_code=503,
            detail=(
                "EXAMAI_INTERNAL_API_KEY is not set on the worker. Refusing every "
                "request rather than running unauthenticated — this service can "
                "write any paper in the project."
            ),
        )
    if x_internal_key != expected:
        raise HTTPException(status_code=401, detail="Bad or missing X-Internal-Key.")


@app.get("/health")
async def health() -> dict[str, Any]:
    """Liveness plus the configuration an operator actually needs to see."""
    return {
        "ok": True,
        "models": {
            "ocr": f"{config.MODEL_OCR_PROVIDER}/{config.MODEL_OCR}",
            "solve": f"{config.MODEL_SOLVE_PROVIDER}/{config.MODEL_SOLVE}",
            "cheap": f"{config.MODEL_CHEAP_PROVIDER}/{config.MODEL_CHEAP}",
        },
        "authConfigured": bool(config.INTERNAL_API_KEY),
    }


def _run_extract(request: ExtractRequest) -> dict[str, Any]:
    with jobs.run_job(request.paper_id, "extract", request.created_by) as job:
        return extract.run(request, job)


@app.post("/stages/extract", dependencies=[Depends(require_internal_key)])
async def start_extract(
    request: ExtractRequest, background: BackgroundTasks
) -> JSONResponse:
    """Queue extraction and return immediately.

    The admin UI does not wait on this response — it subscribes to the job
    document and renders progress from Firestore. Returning 202 rather than
    holding the connection open means a long extraction cannot be killed by a
    proxy timeout halfway through, leaving a paper in `uploaded` with no record
    of why.
    """

    async def task() -> None:
        async with _stage_semaphore:
            try:
                await asyncio.to_thread(_run_extract, request)
            except Exception:  # noqa: BLE001 — already recorded on the job doc
                log.exception("extract failed for %s", request.paper_id)

    background.add_task(task)
    return JSONResponse(
        status_code=202,
        content={
            "accepted": True,
            "paperId": request.paper_id,
            "jobId": jobs.job_id(request.paper_id, "extract"),
        },
    )


@app.get("/jobs/{paper_id}/{stage}", dependencies=[Depends(require_internal_key)])
async def job_status(paper_id: str, stage: str) -> dict[str, Any]:
    """Polling fallback. The admin UI uses a Firestore listener instead."""
    record = await asyncio.to_thread(jobs.latest, paper_id, stage)  # type: ignore[arg-type]
    if record is None:
        raise HTTPException(status_code=404, detail="No job for that paper and stage.")
    return record
