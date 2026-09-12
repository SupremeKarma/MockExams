# ExamAI worker

FastAPI service that runs the heavy parts of the past-paper pipeline: OCR,
solution generation, numerical verification and PDF rendering. The Next.js app
never calls a model directly for papers — it uploads scans, then asks this
service to work on them and watches the job document in Firestore.

Implemented so far:

- **Phase 0 — the syllabus spine.** `syllabus_nodes` in Postgres with ltree,
  imported from the official university PDFs. See [/docs/spine.md](../docs/spine.md).
- **Extract.** Paper scans → questions in Firestore. See [/docs/schema.md](../docs/schema.md).

The remaining stages are stubs in the schema and the job model, not code yet.

> **Note on storage.** Extract currently writes to Firestore (built against the
> original brief); the spine is in Postgres (per the blueprint). These are meant
> to converge on Postgres — the two-layer split in `schemas.py` exists so that
> is a serialisation change rather than a rewrite.

## Security model — read this before deploying

This service holds Firebase Admin credentials and can write **any** paper in the
project. It does **not** verify Firebase user tokens. The chain is:

```
browser (Firebase ID token)
  -> Next.js /api/admin/papers/*   verifies the token, checks the staff role
    -> worker  (X-Internal-Key)    trusts the caller, does the work
```

So `EXAMAI_INTERNAL_API_KEY` is equivalent to admin access. Bind the worker to
localhost or an internal network. If it ever needs a public address, put real
authentication in front of it rather than relying on the key alone.

A missing key makes every request fail with 503 rather than running open.

## Running it

```bash
cd examai-api
python -m venv .venv && .venv/Scripts/activate    # Windows
pip install -r requirements.txt
cp .env.example .env                               # then fill in the key
uvicorn app.main:app --host 127.0.0.1 --port 8100 --reload
```

Then in the repo root `.env.local`:

```
EXAMAI_WORKER_URL=http://127.0.0.1:8100
EXAMAI_INTERNAL_API_KEY=<the same value>
```

Check it came up:

```bash
curl http://127.0.0.1:8100/health
```

## The syllabus spine

Needs the Supreme AI Postgres running:

```bash
cd C:/SUPREME-AI && docker compose -f docker-compose.postgres.yml up -d
```

Then:

```bash
cd C:/MockExams/examai-api
python scripts/import_syllabus.py --semester 4 --migrate
python scripts/import_syllabus.py --tree bit.s4.bit253co
```

`DATABASE_URL` defaults to `postgresql://postgres:postgres@localhost:5432/supreme_media`,
matching that compose file. Full detail, including the PDF defects the parser
works around, is in [/docs/spine.md](../docs/spine.md).

## Tests

```bash
cd examai-api && python -m pytest
```

They touch neither Firebase nor any model. Coverage is the derivation rules,
schema validation, syllabus parsing and the auth surface. Two golden tests run
against real source documents when present: the hand-transcribed 2025 BIT351CO
paper in `examai-ingest/schema/`, and the official semester IV syllabus PDF in
`bulk-imports/BIT/_syllabus-reference/`.

Database tests are marked `integration` and **skip themselves** when no Postgres
is reachable, so the suite still runs on a machine without Docker. They use
their own `test.` program root and clean up after themselves, so they never
touch imported BIT data in the same database.

## Importing papers that were already extracted

`examai-ingest/work/extracted/` holds 16 real papers that have already been read
by a vision model and paid for. Import them rather than re-extracting:

```bash
python scripts/import_extracted.py --dry-run     # parse and report
python scripts/import_extracted.py               # write to Firestore
python scripts/import_extracted.py --upload-scans # also upload the page images
```

The importer calls the same `build_documents()` the live extract stage uses, so
imported papers and freshly extracted ones cannot disagree about coverage or
review flags.

## Layout

| File | What it does |
|---|---|
| `app/main.py` | HTTP surface and the internal-key guard |
| `app/schemas.py` | Pydantic models — model output vs. stored documents |
| `app/derive.py` | Coverage and `unclear`, computed rather than trusted |
| `app/stages/extract.py` | The Extract stage |
| `app/llm.py` | Provider adapter (Gemini / Anthropic / DeepSeek) |
| `app/jobs.py` | Job records the admin UI subscribes to |
| `app/firebase.py` | Firestore + Storage, including the human-work-preserving write |
| `app/paths.py` | Storage paths — mirrors `src/lib/examai/paths.ts` |
| `app/prompts.py` | Versioned prompt loading from `/prompts` |

The data contract is `/docs/schema.md`. Change it and both bindings together.
