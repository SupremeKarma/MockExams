# 0001 — Moving ExamAI's knowledge layer from Firestore to Postgres

**Status:** accepted, phased
**Date:** 2026-09-11
**Supersedes:** the Firestore data model in `docs/schema.md` (which stays live for
Phase 2a until its phase is migrated)

---

## 1. Premise check

The blueprint's data decision rests on "Supreme AI already runs Postgres". That
was verified rather than assumed, because the whole argument collapses if it is
not true.

| Claim | Verified | Detail |
|---|---|---|
| Postgres exists | ✅ | `C:/SUPREME-AI/docker-compose.postgres.yml`, Drizzle, `drizzle.config.ts` |
| pgvector available | ✅ | image is `pgvector/pgvector:pg16`; `CREATE EXTENSION vector` in migration `0000` |
| ltree available | ⚠️ → ✅ | **Not used anywhere in Supreme AI.** It is standard contrib in that image, so it cost exactly one `CREATE EXTENSION ltree`; confirmed installed at version 1.2 |
| "already **runs**" | ⚠️ | **Provisioned, not running.** That compose file's own header says nothing previously provisioned a Postgres instance and that dev logs showed `[Chat] Session persistence skipped (DB unavailable)`. It had to be started for the first time to do Phase 0. |

The last row does not change the decision; it changes the setup estimate.
"Already runs Postgres" was doing more work in that sentence than the repository
supported.

### Why the move is right anyway

The blueprint argues from Firestore's vector-search limits (2048 dimensions,
1000 results, no inequality pre-filtering). Those are real, but they are not the
strongest argument, and leading with them undersells the case.

**The many-to-many web is the real reason.** `question ↔ topic ↔ note ↔ attempt`
plus "every question under Unit 6" is relational and tree-shaped work. Firestore
makes you denormalise it by hand and keep the copies in step. That wall arrives
at blueprint Phase 3–4 regardless of how search is implemented, so the migration
would have happened later with more built on top of it.

One caveat on the evidence: the cited "62% → 84% retrieval precision" figure is a
single team's report. Hybrid search is still right, but the durable reason is
duller — a keyword leg matches `SSTF` and `Banker's` exactly, where embeddings
blur them.

---

## 2. What survives, what changes, what is lost

Phase 2a (extraction + admin review) was built on Firestore against the earlier
brief. The two-layer split in `examai-api/app/schemas.py` — "what the model
returns" vs "what gets stored" — is what makes this cheap: the boundary was
already in the right place.

### Survives unchanged

Storage-agnostic, no edits needed:

- `app/derive.py` — coverage and `unclear` derivation, including the
  `"Group A"` vs `"A"` normalisation fix. **31 tests still valid.**
- `app/schemas.py` **Layer 1** (`ExtractedPaper`, `ExtractedQuestion`) — the
  model-output contract.
- `prompts/extraction.v1.md`, the provider adapter (`app/llm.py`), the job model,
  prompt versioning.
- **Storage rules lockdown** (`papers/**` deny + signed URLs). The blueprint
  keeps files in Cloud Storage, so this stays correct as-is.
- The admin review screen's shape and the importer's logic.

### Changes

- `app/schemas.py` **Layer 2** (`*Doc`) — camelCase Firestore documents become
  SQL rows. Same field set; a serialisation change, not a redesign.
- `app/firebase.py` writes become Postgres writes.
- `papers/{id}/questions` subcollection becomes `papers` / `paper_items` /
  `questions` / `question_topics`.

### Lost

- `docs/schema.md` needs rewriting against the SQL schema.
- **~16 of the 66 Firestore rules tests** — the ones covering `papers` and their
  `questions` subcollection. Their *intent* is ported, not the tests (see §3).

---

## 3. Authorization plan

This is the part of the move that carries real risk, and it deserves to be
stated plainly: **Firestore rules were a genuine loss, not a wash.**

They gave a declarative, testable statement of "students see published only",
sitting underneath every code path, with 66 passing tests. The obvious Postgres
replacement — checking `status` in application code — **fails open**. One
forgotten `WHERE` clause in one query serves an unreviewed draft, and nothing
anywhere reports an error. The page looks fine. That is strictly worse than what
was replaced.

So the replacement is not application checks.

### Layer 1 — the Reader cannot express the mistake

Two database roles (`migrations/004_roles_views.sql`):

| Role | Can |
|---|---|
| `examai_writer` | full DML on base tables — publishing, imports |
| `examai_reader` | `SELECT` on **four views only**: `published_documents`, `published_sections`, `published_syllabus`, `published_anchor_aliases` |

The Reader connects as `examai_reader`. A bug in its SQL cannot leak a draft
because the draft is **not reachable from that connection** — the answer is
`permission denied`, not an unreviewed page.

The reader role **owns nothing**. Ownership bypasses grants, so a reader that
owned a table would be a reader that could read drafts.

The `REVOKE ALL ON ALL TABLES ... FROM examai_reader` and
`ALTER DEFAULT PRIVILEGES ... REVOKE` lines matter more than they look: without
them, a table added by a future migration would quietly become readable.

**Verified** — as `examai_web` (granted `examai_reader`):

```
ok    SELECT base table syllabus_nodes:    InsufficientPrivilege
ok    SELECT base table documents:         InsufficientPrivilege
ok    SELECT base table document_versions: InsufficientPrivilege
ok    SELECT base table sections:          InsufficientPrivilege
ok    INSERT into syllabus_nodes:          InsufficientPrivilege
ok    CREATE TABLE in examai:              InsufficientPrivilege
ok    CREATE TABLE in public:              InsufficientPrivilege
ok    view published_syllabus:             readable (241 rows)
```

### Layer 2 — RLS as defence in depth

Row-level security on every base table, for the day someone runs
`GRANT SELECT ON ALL TABLES ... TO examai_reader` to debug something and forgets
to undo it.

**`FORCE ROW LEVEL SECURITY` is the load-bearing word.** Without `FORCE`, RLS
does not apply to a table's *owner* — and the owner is exactly who runs the
publish pipeline. A policy that silently skips the one role doing the writing
gives false confidence rather than protection.

The `published_*` views are `SECURITY INVOKER` (the default), so they execute
with the reader's rights and these policies apply *through* them.

**The service role must not own the tables** it is protected by. Today the
migration runner connects as `postgres` (superuser, bypasses RLS entirely) —
acceptable for local development, and the deployment note is that the writer
login must be a non-superuser owner distinct from the reader.

### Layer 3 — port the intent of the 66 rules tests

The tests themselves do not port; the properties they asserted do. Each becomes
an integration test against the real database:

| Firestore rules test asserted | Postgres integration test |
|---|---|
| student cannot read a non-`published` paper | `examai_reader` sees 0 rows for a draft version |
| student cannot read questions of an unpublished paper | `published_sections` excludes them; base table denied |
| staff can read any status | `examai_writer` sees drafts |
| no client writes at all | reader `INSERT`/`UPDATE`/`CREATE` all denied |
| deny-by-default for new collections | new table is unreadable until granted explicitly |

Exit test 6 of Phase 1 covers the Reader half of this.

---

## 4. Credits stay in Firestore

**Decision: `entitlements/{uid}` stays in Firestore until blueprint Phase 6.
Do not move it opportunistically.**

The blueprint puts `credit_ledger` in Postgres and schedules it at Phase 6. That
placement is right and the design is better — an append-only ledger with a
computed balance beats a mutable `credits` integer.

But this is not a greenfield table. It is **live, money-adjacent data** behind a
working system (`src/lib/entitlements.ts`, real paid plans, eSewa/Khalti
callbacks). Migrating it is a data migration with a correctness bar — a
double-spend or a lost balance during cutover is a refund conversation, not a
bug report.

It is also not on the critical path: nothing in blueprint Phases 1–5 needs
credits to be relational.

**Rule:** touch credits only when Phase 6 is the work being done, with a
migration written on purpose and a reconciliation check that the computed
balance matches the Firestore balance for every user before cutover.

---

## 5. Phase numbering

**The blueprint's Phases 0–7 are canonical from now on.** The earlier brief's
Phases 1–5 are retired as a numbering scheme.

Delivered work is renamed **"Phase 2a: extraction + admin review (Firestore)"** —
a part of blueprint Phase 2, built on the pre-decision storage.

| Earlier brief | Blueprint phase |
|---|---|
| P1 — data model, rules, upload → extract | **P2** |
| P2 — classify + solve, review screen | **P2** |
| P3 — numerical verification sandbox | **P2** |
| P4 — student paper view, variants, PDF, credits | **P2** / **P4** / **P6** / **P7** |
| P5 — embeddings, search, topic stats, cache | **P3** / **P4** |

Status against the canonical numbering:

| Phase | State |
|---|---|
| 0 — Spine | ✅ done, exit test passed |
| 1 — Reader | in progress |
| 2 — Papers & solutions | partial: **2a** done on Firestore; solutions/verification outstanding |
| 3–7 | not started |

---

## 6. Known blocker

**The BIT253CO 2026 Operating System paper is not in the corpus.**

Blueprint Phase 2's exit test names it exactly — 12 items, Q3 = 876/360/360/336 ms,
Q11 = 6.5/13 ms. The corpus holds `BIT253CO_2024_regular` only, and
`examai-ingest/input/` has no 2026 scan.

Owner: user, uploading to `examai-ingest/input/`.
Blocks: Phase 2 exit test only. Phases 0, 1 and 2a are unaffected.

---

## Related

- `docs/spine.md` — the Phase 0 spine, and the blueprint's Unit 7 correction
- `docs/schema.md` — the Firestore model, still live for Phase 2a
- `examai-api/migrations/004_roles_views.sql` — the authorization implementation
