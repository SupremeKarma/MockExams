# ExamAI — All-Rounder Blueprint

**Notes · Solutions · Past papers · Mock exams · Syllabus · Courses · Teachers**
Version 1.1 · September 2026 · Scope: Purbanchal University BIT first, other programs later

> ## Rule: identifiers are derived, never typed
>
> Every syllabus ID, exit test and prompt example in this document comes from
> the **imported spine** (`examai.syllabus_nodes`). None is hand-written.
>
> Version 1.0 had hand-written examples and they were wrong in a way that
> mattered: it used `bit.s4.bit253co.u7.t3` for "Deadlock detection" and set the
> Phase 0 exit test as *"all topics in Unit 7"*. In the official syllabus
> **Deadlocks is Unit 6**; Unit 7 is Real Time System. The exit test as written
> would have passed against the wrong unit.
>
> To regenerate any ID in this file:
> ```bash
> cd examai-api && python scripts/import_syllabus.py --tree bit.s4.bit253co
> ```
>
> **Corrections applied in 1.1:** §2 IA tree, §3 Reader mock, §5 content format
> example, §9 assembly map, §15 Phase 0 and Phase 2 exit tests.

---

## 0. The five rules this whole system follows

| # | Rule | What it means in practice |
|---|---|---|
| 1 | **One spine** | The official syllabus tree (program → semester → course → unit → topic) is the backbone. Every note section, question, solution, flashcard and mock test links to topic IDs. Nothing floats. |
| 2 | **Write components, not documents** | Content is stored as small reusable pieces. "Documents" such as a notes book or a cheat sheet are *assembled* from pieces. Fix a mistake once and it's fixed everywhere. |
| 3 | **One structure, three uses** | The heading tree of every document powers (a) the outline, (b) deep links and citations, (c) RAG chunks. Built once at publish time. |
| 4 | **Trust ladder** | Every piece shows its trust level: AI draft → code-verified → teacher-verified. Nothing unverified is sold as verified. |
| 5 | **Brains on the server, faces in the app** | Supreme AI owns search, generation, verification and memory. ExamAI is a thin client with great UI. |

---

## 1. Who uses it and what they get

| User | Core jobs | Surfaces |
|---|---|---|
| **Student** | Understand a topic from zero, see every past question on it, practise, sit mock exams, know what to study next | Reader, Practice, Mock exams, Pass planner, Search |
| **Teacher** | Verify solutions, write/fix notes, run classes, assign mock tests, see weak topics | Teacher studio, Class dashboard |
| **Contributor** | Upload papers, report errors, suggest fixes — earn credits | Upload, Errata |
| **Moderator/Admin** | Ingest syllabus and papers, approve content, manage credits and roles | Admin console, Review queues |

---

## 2. Information architecture

```
Program (BIT, Purbanchal University)          bit
└── Semester (1–8)                            bit.s4
    └── Course (BIT253CO Operating System)    bit.s4.bit253co
        ├── Syllabus
        │   └── Unit (6. Deadlocks, 7 Hrs)            bit.s4.bit253co.u6
        │       └── Topic (6.d Deadlock detection
        │                  and recovery)              bit.s4.bit253co.u6.t4
        ├── Notes book            ← assembled from topic sections, in syllabus order
        ├── Past papers           ← each paper = test → groups → items
        │   └── Question → Solution (versions) → Practice variants
        ├── Question bank         ← filterable by topic/year/marks/type
        ├── Flashcards            ← generated from notes + questions, scheduled with FSRS
        ├── Mock tests            ← assembled from the bank using the real paper blueprint
        └── Cheat sheet / Pass pack ← assembled views, not separate content
```

**Stable IDs everywhere.** Each syllabus node has a **UUID** (the only foreign
key) and an **ltree path** (`bit.s4.bit253co.u6.t4`, for tree queries and URLs).
Paths change when a syllabus is renumbered; UUIDs do not, which is why links use
them. See `docs/spine.md`.

Note the topic label shape: Operating System uses **lettered** sub-topics, so the
printed label is `6.d`, not `6.4`. Other courses (Probability and Statistics)
use decimal labels like `1.1`. Both are stored in `code`; the path segment is
always positional `t1..tN`, because an ltree label cannot contain a dot.

---

## 3. The Reader (the "Google Docs outline" experience)

### Layout (desktop)
```
┌──────────────┬──────────────────────────────────┬──────────────────┐
│ COURSE TREE  │  PAGE                            │ ON THIS PAGE     │
│              │                                  │                  │
│ ▸ Unit 5     │  6.d Deadlock detection          │ • Idea in plain  │
│ ▾ Unit 6     │      and recovery                │ • Single instance│
│   6.a ...    │  [AI draft]                      │ • Multi-instance │
│   6.b ...    │                                  │   – Algorithm    │
│   6.c ...    │  ┌ Idea in plain words ─────┐    │   – Example      │
│ ● 6.d ...    │  └──────────────────────────┘    │ • Recovery       │
│   6.e ...    │  Full explanation ...            │                  │
│   6.f ...    │                                  │ ASKED IN         │
│ ▸ Unit 7     │  ┌ Asked in exams ──────────┐    │ (hidden until P2)│
│              │  │ (populated in Phase 2)   │    │                  │
│ Progress 42% │  └──────────────────────────┘    │ [Mark as learned]│
└──────────────┴──────────────────────────────────┴──────────────────┘
```

### Behaviour spec
- **Outline is generated, never hand-written.** Built from H1–H3 at publish time.
  Active heading highlights while scrolling (scroll-spy). Click → smooth scroll +
  URL anchor updates.
- **Left pane = syllabus tree**, not a file tree. Per-topic progress dots.
- **Right pane = page outline + context.** "Asked in" chips come from
  question-topic links and are **hidden while empty** (Phase 2 populates them).
- **Mobile**: left tree becomes a drawer; outline becomes a bottom sheet.
- **Every block is deep-linkable**, and a renamed heading keeps its old anchor
  working via `anchor_aliases`.
- **Reading modes**: Beginner / Revision. Same content, different rendering.
- **Print / PDF**: table of contents, running headers, no tables split across pages.
- **Search inside course**: ⌘K → hybrid search (§7) → opens at the exact anchor.

---

## 4. Content model (the components)

| Component | What it is | Reused in |
|---|---|---|
| **SyllabusNode** | program/semester/course/unit/topic; `uuid`, `path` (ltree), `code`, `title`, `hours`, `syllabus_version`, `status` | Everything |
| **Document** | An ordered set of sections for one topic or purpose | Reader, books |
| **Section** | One heading + its body (derived at publish) | Outline, search, RAG, citations |
| **Question (Item)** | One exam question | Paper view, bank, mock tests |
| **Paper (Test)** | One real exam | Paper view, blueprint for mocks |
| **Solution** | Model answer for a question (versioned) | Paper solutions, reader "asked in" |
| **VariantTemplate** | Generator for new versions of a numerical | Practice |
| **Flashcard** | Front/back recall card | Review (FSRS) |
| **Rubric** | Marking scheme for a written answer | Written-answer grading |
| **MockTest** | Generated test following a paper blueprint | Mock exams |

**Topic links carry meaning, not just a tag.**
`question_topics(question_ref, node_uuid, role, weight, tagged_by)` where `role`
∈ {primary, secondary}.

**`question_topics` accepts any node kind.** Link to the deepest **official**
node: the topic where the syllabus defines topics, the **unit** where it does
not. Database Management System lists its contents as prose and so has 9 units
and 0 topic nodes — a topic-only constraint would make every DBMS question
untaggable.

---

## 5. Content format and publishing

### Source of truth: Markdown with a small, fixed set of blocks

```markdown
---
id: bit253co-u6-t4
type: topic_note
course: BIT253CO
syllabus_path: bit.s4.bit253co.u6.t4
syllabus_code: 6.d
trust: ai_draft
version: 3
---

# Deadlock detection and recovery

:::idea
The OS lets deadlocks happen, checks for them now and then, and breaks them when found.
:::

## Single instance of each resource
...

:::example{title="Detection with Available = (0,0,0)"}
...
:::

:::answer-box
No deadlock. Safe sequence ⟨P0, P2, P3, P1, P4⟩
:::

:::exam-tip
Always write the algorithm steps, then the example. Examiners give marks for both.
:::
```

Allowed blocks (and nothing else): `idea`, `example`, `working`, `answer-box`,
`exam-tip`, `warning`, `diagram`, `formula`, `practice-link`. Unknown blocks fail
validation.

### Publish pipeline (one transaction)
1. **Validate** frontmatter + allowed blocks + heading order (no H3 without H2).
2. **Parse** markdown → syntax tree.
3. **Derive sections**: split at H1–H3, assign stable anchors, build `heading_path`.
4. **Index**: `tsvector` per section now; embedding in Phase 3.
5. **Link**: resolve topic UUIDs, "asked in" back-links, practice links.
6. **Check anchors**: a previously published anchor that disappears without an
   alias **fails the publish**.
7. **Version**: new immutable `document_version`; `current_version_uuid` moves
   only after approval. Old versions stay readable for audit.

---

## 6. Data architecture

| Store | Holds | Why |
|---|---|---|
| **Postgres** (schema `examai`, in the Supreme AI database) | Syllabus tree, documents, versions, sections, questions, papers, solutions, topic links, attempts, mastery | Relational links + tree queries + hybrid search in one database |
| **Firebase Auth** | Login | Already built |
| **Firestore** | Live per-user UI state; **credits/entitlements until Phase 6** | Real-time listeners, already built |
| **Cloud Storage** | Original paper images, uploaded PDFs, rendered PDFs, answer-sheet photos | Files |
| **Redis** | Caches, rate limits, job queue | Already in Supreme AI |

ExamAI tables live in the **`examai` schema**, and Supreme AI's
`drizzle.config.ts` states `schemaFilter: ['public']`, so `pnpm db:push` there
can never see or drop them. Proven by dry run — see `docs/decisions/0001`.

**Authorization is enforced by the database**, not by application checks: the
Reader connects as a role with `SELECT` on `published_*` views only.

---

## 7. Search and RAG

1. Keyword leg: `tsvector` match (catches exact terms — `Banker's`, `SSTF`, `BIT253CO`).
2. Meaning leg: `pgvector` nearest sections.
3. Fuse with Reciprocal Rank Fusion (k = 60). Over-fetch ~20–50 per leg, fuse to 10.
4. Always pre-filter by course, optionally `path <@ unit`.
5. Results carry `document_uuid + anchor` → open the Reader exactly there.

**RAG**: child chunks = sections (≈150–400 tokens) for matching; parent H2
section sent to the model for context. Every answer cites anchors.

---

## 8. Ingestion pipelines

| Pipeline | Input | Human check |
|---|---|---|
| **A. Syllabus** | Official course outline PDF | Admin confirms the tree once per course |
| **B. Past papers** | Photos/PDF | Review screen: image left, extracted item right |
| **C. Existing notes** | PDFs / DOCX | Heading/outline review + error flags |
| **D. Teacher authoring** | Editor | Moderator approval for first N posts |
| **E. Student contributions** | Paper uploads, errata | Moderator |

**Scanned syllabus PDFs** (semesters 2, 3, 6 are CamScanner images with no text
layer) import via OCR and land with `status = 'draft'`. Draft nodes are invisible
to the Reader until a human confirms them against the scan.
Priority when OCR is built: **semester 6, then 2, 3; then 7, 8.**

**Dedup rule:** normalize question text → hash → reuse an approved solution.

---

## 9. Generation pipelines (Supreme AI)

| Output | Guardrails |
|---|---|
| **Paper solutions** | Numerical sandbox verification; trust badge; review queue |
| **Topic notes (beginner)** | Must include `idea` block, example, exam-tip; teacher review before "verified" |
| **Practice variants** | Answers only from solver code, never from the model |
| **Flashcards** | Max 1 fact per card; dedupe |
| **Mock tests** | Same group structure and choice rules as the real paper |
| **Books / cheat sheets / pass packs** | No new text generated at assembly time |

**Assembly map example (Pass pack for BIT253CO)** — every id below is a real
spine path:

```yaml
title: OS Pass Pack
course: BIT253CO
include:
  # Disk scheduling is unit 5 (Input/Output), topic 5.c — not unit 6.
  - section: bit.s4.bit253co.u5.t3#method
  - solution: bit253co-2026-q3
  - variant_set: {topic: bit.s4.bit253co.u5.t3, count: 5}
  # SRTF lives under 2.f Process scheduling.
  - section: bit.s4.bit253co.u2.t6#method
  - solution: bit253co-2026-q11
  - topic_top_questions: {by: frequency_x_marks, limit: 8}
```

---

## 10. Learning engine

| Layer | Start simple | Upgrade later |
|---|---|---|
| **Attempts log** | Required from day 1 | — |
| **Topic mastery** | Recency-weighted accuracy | Bayesian Knowledge Tracing |
| **Review scheduling** | FSRS | Per-student parameter tuning |
| **Question difficulty** | % scoring ≥ half marks | IRT calibration |
| **Pass planner** | frequency × marks weight × (1 − mastery) × urgency | Prerequisite-graph path |

---

## 11. Exams

- **Paper view**: original image on top; typed questions below with progressive reveal.
- **Mock exam engine**: timed session in Firestore (resume after disconnect);
  MCQ/numerical auto-graded; written answers typed, photographed or dictated.
- **Handwriting grading**: transcribe → **student confirms the transcription** →
  rubric grading per criterion → teacher override.

---

## 12. Teachers and community

Verified teacher role, review queue, classes with join codes, markdown authoring,
contributor credits, moderation, attribution.

---

## 13. Business layer

- **Free**: syllabus, paper images, plain-words ideas, limited solutions/day.
- **Credits/paid**: full verified solutions, PDF books, unlimited variants, mock grading, AI tutor.
- **Payments**: Khalti ePayment — always confirm with the server-side lookup API
  before adding credits; never trust the redirect.
- **Ledger**: append-only; balance is computed, never edited. **Moves to Postgres
  at Phase 6, not before** (see `docs/decisions/0001`).

---

## 14. Tech stack

| Layer | Choice |
|---|---|
| Web app | Next.js (App Router) + Tailwind, server-rendered Reader pages |
| Content | Shared TypeScript package: remark/rehype + directive blocks. **One parser, used by admin preview, publish and Reader.** |
| Math | KaTeX |
| Diagrams | Mermaid rendered at publish, cached |
| Search/RAG | Postgres: pgvector + tsvector + ltree |
| Embeddings | Local 768-dim model, batched at publish |
| PDF | WeasyPrint + CSS paged media |
| Spaced repetition | ts-fsrs / py-fsrs |
| Payments | Khalti ePayment |

---

## 15. Roadmap

| Phase | Build | Exit test (must pass) |
|---|---|---|
| **0 — Spine** | `syllabus_nodes` with ltree; import BIT semester 4 | ✅ **Passed.** Tree renders; `descendants('bit.s4.bit253co.u6', kind='topic')` returns the 6 Deadlocks topics via the GiST index |
| **1 — Reader** | Documents, versions, sections, publish pipeline; 3-pane Reader; notes for BIT253CO units 2, 5, 6 | Outline auto-builds; anchors deep-link; mobile drawer + bottom sheet work |
| **2 — Papers & solutions** | Paper ingestion, question-topic links, solutions with verification, "Asked in" chips | OS **2026** paper: 12 items correct; Q3 = 876/360/360/336 ms; Q11 = 6.5/13 ms ⚠️ *blocked: that scan is not in the corpus* |
| **3 — Search & tutor** | Hybrid search + RRF; RAG tutor with anchor citations | "how does OS find stuck processes" returns `bit.s4.bit253co.u6.t4` in the top 3 |
| **4 — Practice & planner** | Attempts, variants, FSRS cards, mastery, pass planner | Variant answers always match solver code; planner ranks `u5.t3` and `u2.t6` top |
| **5 — Mock exams** | Timed engine, auto-grade, rubric grading with transcription confirm | Teacher vs AI marks on 20 samples reviewed; overrides logged |
| **6 — Teachers & community** | Roles, review queue, classes, contributions, credits ledger, Khalti | Teacher verifies solution → badge shows; payment adds credits only after lookup |
| **7 — Books & growth** | Assembly maps, PDF books, Telegram bot, SEO pages | Pass pack PDF builds from IDs with zero new generated text |

**Status:** Phase 0 done. Phase 1 in progress. Phase 2 partially delivered as
**"Phase 2a — extraction + admin review"** on Firestore, before the Postgres
decision.

---

## 16. Risks and how this design handles them

| Risk | Mitigation |
|---|---|
| Wrong AI answers damage trust | Trust ladder, code verification for numericals, teacher review, errata |
| Content drifts out of sync | Components + assembly maps; single source per topic |
| PDF-to-markdown mangles headings | Heading repair using syllabus numbering + human outline review |
| **Hand-written IDs are wrong** | **Every ID derived from the imported spine; never typed** |
| Search misses exact terms | Hybrid keyword + vector, not vector only |
| Costs explode | Batch at publish, dedup by hash, cache, cheap tier for tagging |
| Handwriting grading unfair | Transcription confirmation + rubric criteria + teacher override |
| A code bug leaks unreviewed drafts | Reader connects as a DB role that cannot read drafts at all |
| Supreme AI's Drizzle drops our tables | Separate `examai` schema + `schemaFilter: ['public']`, proven by dry run |
| Solo-builder overload | Strict phases with exit tests |
| Copyright | Official syllabus/papers and own/teacher-written notes |

---

## 17. Standards to stay compatible with (not to implement now)

- **Questions & tests**: shape `papers → groups → items` for later QTI export.
- **Syllabus/competencies**: UUID identifiers with parent/child links, so the
  spine could be published in a CASE-style format later.
