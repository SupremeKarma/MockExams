# Extraction schema — decisions

`paper.schema.json` is the contract for an extracted past paper. It **extends**
the shape `src/p2_extract.py` already emits; every field that existed is kept.
The additions all exist to make one class of failure impossible: a paper that
looks fine and isn't.

## Files

| File | What it is |
|---|---|
| `paper.schema.json` | The contract. JSON Schema 2020-12. |
| `units.sem6.json` | Generated tagging vocabulary — 5 subjects, 40 units. Do not hand-edit; run `node scripts/dump-syllabus-units.ts 6` from the repo root. |
| `example.BIT351CO_2025_regular.json` | The real 2025 AI paper, hand-transcribed from the scans. Golden reference — all 11 questions, both groups, nested choice. |
| `../validate_papers.py` | Enforces it. `python validate_papers.py` checks `work/extracted/*.json`. |

## What was added, and why

**`coverage` (required), counted in questions per group.** The three files in
`work/extracted/` are demo fixtures written by `demo.py`, and each covers 26-34
marks of an 80-mark paper with `confidence: "high"` on every question and
`extraction_notes` empty. A third of a paper looked exactly like a whole one.

Coverage is counted in **questions per group, not summed marks** — verified
against the real 2025 BIT351CO paper, which reads "Group A: Answer TWO
questions, 2x12=24" over three printed questions and "Group B: Answer SEVEN
questions, 7x8=56" over eight. A *complete* extraction of that paper holds 11
questions carrying 100 marks, while the paper is worth 80. Summed marks would
call a perfect extraction over-extracted; question counts get it right.

Incomplete extraction is expected and fine. Silent incomplete extraction is not.

**`units[]` (required, at least one).** The plan says tag to syllabus unit *at
import, not query time*, and the old schema had nowhere to put a unit. Ids must
exist in `units.sem<N>.json`, which is generated from
`src/data/bitSyllabusData.ts` — the same syllabus the app already shows
students — so the tagging vocabulary cannot drift from it. Multiple units per
question is allowed on purpose: cross-topic questions are precisely the ones
worth predicting, and forcing a single tag would lose them. Each tag carries
its own confidence and a `tagged_by`, because a human tag must not be
overwritten by a re-run.

**`question_type`.** Drives everything downstream, and `numerical` is the
reason it exists: those questions must *not* get a stored solution, because
topics repeat and numbers don't — they get variant generation instead. Storing
a solved numerical answer is how a student memorises the wrong thing.

**`marking_scheme[]`.** Key points and the marks each carries — a checklist,
not a model answer. Grading becomes "which points are present, missing, wrong",
which is how examiners actually work and is far more reliable than asking a
model to score from feeling. The validator checks the points sum to the
question's marks (skipped when any point is `required: false`, i.e. "any four
of the following").

This format is not new to the project: `bulk-imports/BIT/_demo/dbms-written-demo.md`
already writes marking schemes into its `EXPLAIN` field as prose
("2 marks for a correct definition; 1 mark for each advantage…"). This just
gives them structure.

**`needs_review` (required).** Nothing reaches a student while true. Set it
automatically for: confidence below `high`, any low-confidence unit tag, a
marking scheme that doesn't sum, and every question on a non-complete paper.
The build order already calls for reviewing generated solutions by hand; this
is where that review is recorded.

**`groups[]` and `choose`.** Choice is structural in these papers and appears at
two levels. Group level ("Answer SEVEN questions" over eight printed) lives in
`groups[].answer_count`. Within-question level ("Write short notes on Any TWO"
over three options) lives on the question as `choose: 2`, and the sub-part
marks then sum to `choose x` one option, not to all of them.

**`curriculum`.** PU prints "(New Course)" in the paper header, so this is read
off the paper rather than guessed. It matters more than it looks: old- and
new-curriculum papers share subject *names* — Data Mining, AI, MIS all exist in
both — but have different codes and different units. Frequency counts that mix
them are wrong in a way nothing will flag.

**`solution_path` / `source_page`.** The storage split from the plan: solutions
live as markdown (one source of truth for both the AI's context and what the
student reads), and `source_page` indexes into `source_files` so the original
paper layout can be shown beside the text.

## Known divergences in the current extractor

Found by running the validator against `work/extracted/`:

1. **`sub_parts` holds strings**, e.g. `"a) Supervised learning"`, where the
   schema expects nested question objects with their own marks and units. Marks
   for sub-parts are currently unrecoverable.
2. **Subject codes are invented.** The fixtures use `BIT415AI`; semester 6
   Artificial Intelligence is **`BIT351CO`** in the official syllabus. A code
   outside the unit vocabulary is a hard failure — its questions cannot be
   tagged at all.
3. No `coverage`, no `units`, no `question_type`, no `needs_review`.

None of this is surprising: `input/` is empty and `work/pages/` and
`work/clusters/` are empty, so **the pipeline has never run on a real paper**.
The fixtures are illustrations, not output.

## Before the first real run

- Stage actual papers in `examai-ingest/input/` — they are not in this repo.
- `config.py` pins `MODEL = "claude-sonnet-4-6"` ($3/$15 per MTok).
  `claude-sonnet-5` is both newer and cheaper ($2/$10), so that swap costs
  nothing and is not a downgrade. `claude-opus-5` ($5/$25) is the stronger
  choice if extraction accuracy on poor scans turns out to be the bottleneck —
  worth measuring on one hard page rather than assuming.
- Extraction and batch solution-generation are not latency-sensitive, so use
  the **Message Batches API** — same models at 50% cost. This is the "batch
  pre-generation, overnight" line in the plan.
- Use `client.messages.count_tokens` for a real cost estimate before the full
  run rather than guessing from page count.
