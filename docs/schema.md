# ExamAI shared schema

The single contract shared by three consumers:

| Consumer | Binding |
|---|---|
| Next.js frontend | `src/lib/examai/types.ts` (TypeScript strict) |
| FastAPI worker | `examai-api/app/schemas.py` (Pydantic v2) |
| Firestore | the collection layout below |

Change this file and both bindings in the same commit, or they drift.

---

## Naming: why these collections are camelCase

The live MockExams collections (`exam_attempts`, `solved_papers`) are snake_case.
The ExamAI collections are **camelCase** (`courseId`, `createdBy`, `reviewStatus`).

That is deliberate, not an oversight. These documents are read directly by the
browser through a Firestore listener and land in TypeScript interfaces
unmodified; a snake_case wire format would mean a mapping layer on every read,
and mapping layers are where fields get silently dropped. The older collections
keep their names because renaming live data is a migration, not a cleanup.

The rule going forward: **new ExamAI collections are camelCase, existing
collections are never renamed.**

---

## What this schema inherits from `examai-ingest/schema/paper.schema.json`

The offline pipeline in `examai-ingest/` already extracted 17 real papers, and
its schema encodes three lessons that were paid for in wrong output. They are
carried over here intentionally, because dropping them would reintroduce
failures that have already happened once.

### 1. `coverage` — incomplete extraction must be visible

The original demo fixtures captured 26 of 80 marks with `confidence: "high"` on
every question and no notes. **A third of a paper looked exactly like a whole
one.** `coverage` is computed from what was actually extracted — never
self-reported by the model — so that failure is structurally impossible to hide.

Coverage counts **questions per group, not summed marks.** A real 2025 BIT351CO
paper reads "Group A: Answer TWO questions, 2x12=24" over *three* printed
questions, and "Group B: Answer SEVEN, 7x8=56" over *eight*. A complete
extraction holds 11 questions carrying 100 marks on an 80-mark paper. Summed
marks would call that perfect extraction over-extracted; question counts get it
right.

### 2. Choice lives at two levels, and they are different things

The brief models `choiceRule` on the question. That is only half of it:

- **Group choice** — "Answer SEVEN questions" over eight printed. Lives on
  `papers/{paperId}.groups[].answerCount`. It is a property of the *section*.
- **Within-question choice** — "Write short notes on any TWO:" over three
  options. Lives on the question as `choiceRule.choose`, with the options as
  `subParts`.

Collapsing both into one question-level field makes the paper's mark arithmetic
unreconstructable, and `fullMarks` validation depends on that arithmetic.

### 3. `syllabusUnits` may legitimately be empty

BIT353CO 2026 asks about multilayer feedforward networks versus a single-layer
perceptron. None of that subject's six syllabus units covers neural networks.
Forcing the closest tag would put a wrong question into a frequency count and
make the syllabus look complete. An empty `syllabusUnits` **paired with
`unclear: true`** is the honest answer: it says the vocabulary needs checking.

The validator enforces the pair — empty tags without the flag is rejected.

---

## Collections

### `programs/{programId}`

Scope today is BIT only; the collection exists so other programs are an insert,
not a migration.

```ts
{ id: "BIT", name: "Bachelor in Information Technology",
  university: "Purbanchal University", semesters: 8 }
```

### `courses/{courseId}`

`courseId` is the official subject code, e.g. `BIT351CO`. Using the real code as
the document id means paper ingestion never has to resolve a name to an id.

```ts
{ code: "BIT351CO", name: "Artificial Intelligence", semester: 6,
  programId: "BIT", credits: 3,
  curriculum: "new_course" | "old_course",
  syllabusUnits: [{ unitId: "BIT351CO_U02", title: "Agents: PEAS..." }] }
```

`syllabusUnits` is generated from `src/data/bitSyllabusData.ts` — the same
syllabus the app already shows students — by `scripts/seed-examai-courses.mjs`.
The tagging vocabulary therefore cannot drift from what students see.

**`curriculum` is derived from the subject code, never the printed label.**
Sem-6 `BIT351CO`–`BIT356CO` are `new_course`; older codes (`BIT370CO`,
`BIT371CO`, `BIT376CO`) are `old_course`. A printed "(New Course)" is
unreliable — 2022 old-curriculum papers print it too, because that label was
relative to a still earlier revision. This matters: measured against current
BIT353CO units, the 2022 BIT371CO Data Mining paper fits only 62% clearly, and
six of those fits land on a single unit. Pooling the two would skew that unit
and add nothing elsewhere.

### `papers/{paperId}`

`paperId` = `<COURSE>_<YEAR>_<examType>`, e.g. `BIT351CO_2025_regular`. Stable
and derivable, so re-uploading the same paper is an idempotent overwrite rather
than a duplicate.

```ts
{ paperId, courseId, programId, year,
  examType: "regular" | "back" | "make_up" | "model",
  fullMarks, passMarks, timeHours,
  imagePaths: string[],            // Storage paths, reading order
  groups: PaperGroup[],            // section choice rules
  coverage: Coverage,              // derived, never model-reported
  status: "uploaded" | "extracted" | "solving" | "review" | "published" | "failed",
  extractionNotes, createdBy, createdAt, updatedAt,
  publishedAt: string | null,
  totalTokens, totalCostUsd }      // rolled up from questions
```

`status` moves `uploaded → extracted → solving → review → published`. A failure
sets `failed` and records the stage and error on the job, so a retry resumes
from that stage rather than restarting the paper.

### `papers/{paperId}/questions/{qId}`

`qId` = `<group><number>`, e.g. `A1`, `B7a`. Ordering in the UI uses `group`
then `orderIndex`, never the document id, because `B10` sorts before `B2`
lexicographically.

```ts
{ qId, number, group, orderIndex,
  marks: number | null,            // null ONLY on an unprinted sub-part split
  markSplit: number[] | null,      // "4+8" printed in the margin
  choiceRule: { choose: number } | null,   // WITHIN-question choice only
  textExact: string | null,        // transcribed verbatim; null only per rules below
  type: "theory" | "numerical" | "short_note" | "comparison" | "diagram",
  syllabusUnit: string | null,     // primary unit, for grouping
  syllabusUnits: UnitTag[],        // all tags, each with its own confidence
  topics: string[],
  subParts: Question[],
  hasDiagram: boolean, diagramDescription: string | null,
  sourcePage: number | null,       // 1-indexed into imagePaths
  confidence: "high" | "medium" | "low",
  unclear: boolean,                // true until a human checks it
  reviewNote: string | null,       // WHY it needs review
  // populated by later phases
  solutionPath: string | null,
  verifiedNumerical: true | false | "n/a",
  reviewStatus: "pending" | "approved" | "rejected", reviewerNote,
  embedding: number[] | null,
  promptVersion, modelUsed, tokensUsed, costUsd, generatedAt }
```

**`marks: null` is meaningful.** It is allowed only on a sub-part whose share is
not printed. Inventing a split would feed fabricated numbers into mark-weight
analysis; `0` would be worse, because it reads as a real value.

**`textExact: null` is allowed in exactly two cases** — a bare stem whose whole
content lives in `subParts`, or text that was genuinely unreadable, and in that
second case `confidence` must be `"low"`. The validator rejects a null text with
neither sub-parts nor low confidence, so null can never quietly mean "we lost
it".

**`unclear` is derived, not asked for.** It is set true automatically when:
confidence is below high, any unit tag is low-confidence, `syllabusUnits` is
empty, text is null with no sub-parts, a mark split does not sum, or the paper's
coverage is not `complete`. `reviewNote` always records which of those fired — a
flag with no reason costs the reviewer the time it was meant to save.

### `topicStats/{courseId}`

```ts
{ courseId,
  topics: { [topic: string]:  { count, years: number[], totalMarks } },
  units:  { [unitId: string]: { count, years: number[], totalMarks } },
  updatedAt }
```

Written by the topic-stats stage (Phase 5). Read by the "likely topics" page.

### `jobs/{jobId}`

```ts
{ jobId, paperId,
  stage: "extract" | "classify" | "solve" | "verify" | "embed" | "stats" | "render",
  status: "queued" | "running" | "succeeded" | "failed" | "cancelled",
  attempts, error: string | null,
  logs: { at, level, message }[],       // capped at 200, newest kept
  progress: { done, total },
  startedAt, finishedAt, createdBy }
```

One job document per paper per stage. The admin screen subscribes to
`jobs where paperId == X` and renders live progress from it.

---

## Cloud Storage layout

```
papers/{paperId}/original/{n}.{ext}      uploaded images / PDF, reading order
papers/{paperId}/solutions/q{qId}.md     ONE source of truth per question
papers/{paperId}/export/full.pdf         cached render, regenerated on change
```

Path construction lives in `src/lib/examai/paths.ts` and
`examai-api/app/paths.py`. Never build these by hand — a path typo writes a
solution somewhere the reader will never look for it, and it fails silently.

---

## Idempotency

Every stage is safe to re-run:

- **Extract** — overwrites `papers/{paperId}` and its questions wholesale.
  Re-running costs one model call and produces the same document set.
- **Reuse cache** — `hash(courseId + normalizedText)`. An approved solution for
  the same hash is reused with no model call, which is how repeated questions
  across years come out free.
- **Human edits are never overwritten by a re-run.** A unit tag with
  `taggedBy: "human"`, and a question with `reviewStatus: "approved"`, survive
  re-extraction; the model's version is discarded, not merged.

That last rule is the one that bites if forgotten: a re-run that silently
reverts a reviewer's corrections destroys work that cost human time, and the
reviewer has no way to notice.
