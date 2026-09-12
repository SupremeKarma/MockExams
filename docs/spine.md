# The syllabus spine (Phase 0)

The official Purbanchal University BIT syllabus, stored as a tree in Postgres.
Everything else in ExamAI eventually hangs off it — notes link to topic ids,
questions link to topic ids, mastery is per topic, the pass planner ranks
topics. Blueprint rule 1 is "nothing floats"; this is what nothing floats away
from.

**Status:** semester 4 imported and verified (6 courses, 46 units, 188 topics).
Other semesters are blocked — see [What is not imported](#what-is-not-imported).

---

## Path scheme

```
bit . s4 . bit253co . u6 . t4
^     ^     ^          ^    ^
|     |     |          |    topic, positional within the unit
|     |     |          unit number exactly as printed
|     |     course code, lowercased
|     semester 1..8
program
```

### `uuid` is the only foreign key

Every node has a `uuid` (primary key) and a `path` (unique). The division of
labour is strict:

| | Used for | Never used for |
|---|---|---|
| `uuid` | **every foreign key** — `document_topics`, `question_topics`, `documents.node_uuid`, later `attempts` | tree queries |
| `path` | tree queries (`<@`, `@>`), CLI output, admin URLs | **foreign keys** |

The reason is that paths are human-readable and therefore change. A unit gets
renumbered, a course code is revised — and anything holding
`bit.s4.bit253co.u6` now points at a different topic. Silently, because the new
row is perfectly valid. A uuid cannot do that.

**A node's uuid survives re-import.** The upsert keys on `path`, so re-running
the importer updates rows in place and every link still resolves. This is the
property that makes links durable, and there is a test asserting it.

### `syllabus_version` and `status`

`syllabus_version` is set on **program and course** nodes (everything beneath
inherits it by position) and records which published revision a subtree is —
`new_course` today. Backlog students sit an older syllabus, and when two
revisions must coexist they get **distinct paths**, because the old curriculum
uses different codes (`BIT371CO` where the new one is `BIT353CO`). So `path`
stays unique and a subtree query never mixes revisions.

`status` is `active` | `draft` | `retired`. **OCR'd imports land as `draft`**
and nothing student-facing reads them — the `published_syllabus` view filters on
`status = 'active'`, and the reader database role can only see that view. A
human confirms a draft subtree against the scan, then
`repository.set_status(path, "active")` promotes it.

Import with `--status draft` to exercise this.

### One module owns every spine query

All spine access goes through `app/syllabus/repository.py`. Nothing else builds
SQL against these tables. That is a deliberate constraint, not tidiness: the
blueprint expects the knowledge layer to move into Supreme AI's service, and
confining every query to one module makes that a file move rather than a hunt
for stray SQL.

**Why topics are `t1..tN` rather than their printed label.** ltree labels accept
`[A-Za-z0-9_]` only; a dot is a path separator, so `6.d` cannot be a segment.
The printed label lives in `code` (`"6.d"`, or `"1.1"` for decimal-numbered
courses) and is what a student sees.

### Why ltree rather than `parent_id`

Every query this table exists to serve is an ancestor/descendant one — "every
topic under Unit 6", "which unit does this topic belong to", "all courses in
semester 4". With `parent_id` those need a recursive CTE at each call site. With
ltree they are one indexed operator:

```sql
-- all topics in Unit 6, using the GiST index
SELECT * FROM syllabus_nodes
WHERE path <@ 'bit.s4.bit253co.u6'::ltree AND kind = 'topic';

-- breadcrumbs
SELECT * FROM syllabus_nodes
WHERE path @> 'bit.s4.bit253co.u6.t4'::ltree ORDER BY nlevel(path);
```

Verified using the index:

```
Bitmap Heap Scan on syllabus_nodes
  Recheck Cond: (path <@ 'bit.s4.bit253co.u6'::ltree)
  ->  Bitmap Index Scan on syllabus_nodes_path_gist
```

### Orphan prevention

ltree stores the whole path as one value, so nothing in the type system stops
you inserting `...u99.t1` with no `...u99` row. It would succeed, and the topic
would then be present in the table but unreachable in every rendered tree — a
silent hole. A trigger rejects it:

```
ERROR: syllabus_nodes: bit.s4.bit253co.u99.t1 has no parent at bit.s4.bit253co.u99.
```

This is why `build_course_nodes()` returns a flat list in insert order rather
than a nested structure: ancestors must be written first, and a flat ordered
list makes that impossible to get wrong at the call site.

---

## Parsing the official PDFs

Source: `bulk-imports/BIT/_syllabus-reference/BIT-*-new-course.pdf`. These are
the real university documents, and they are messier than they look.

### The printed course codes are not trustworthy

So the **index table on page 1 is authoritative** for code and title, and
content pages are located by **title**, not code. Matching on the printed code
silently lost four of six courses. Where the two disagree the parse records
`printed_code` and the importer prints a warning every run, so the defect is
never mistaken for our own bug.

### Exact reconciliation of the semester IV import

An earlier summary said "all 6 parse" and "5 imported" without reconciling
them, and said "three wrong codes" while listing two. Both are corrected here;
these are the counts the code actually produces.

| Stage | Count |
|---|---|
| Courses in the page-1 index table | **6** |
| Parsed into a `CourseSyllabus` | **6** |
| Passed the import guard and written | **6** |

**All six are now imported.** An earlier pass dropped `BIT256CO` Project-IV
because it has no units, which was the wrong call: it is a real 2-credit course
in semester 4, and omitting it made the tree claim the university offers five
courses where it offers six — and made every coverage percentage compute against
the wrong denominator.

A course with no units is not a failed parse. It is imported as a **bare course
node** with the reason recorded in `official_ref`:

| Course | Units | Recorded reason |
|---|---|---|
| `BIT256CO` Project-IV | 0 | `project course, no written syllabus` |

Junk parses are still rejected — see [What is not imported](#what-is-not-imported).
The two checks are now separate: `rejection_reason()` asks "is this a real
course?", `no_units_reason()` asks "why does a real course have no units?".

And the defects in the source PDF are **two printed-code errors plus one
missing heading** — three defects, but only two of them are codes:

| # | Course | Defect | Handling |
|---|---|---|---|
| 1 | `BIT251HS` Probability and Statistics | page prints `BIT251H` — truncated | index table wins; `printed_code` recorded |
| 2 | `BIT252CO` Computer Organization | page prints `BIT251CO` — wrong course | index table wins; `printed_code` recorded |
| 3 | `BIT255CO` Programming in JAVA | **no `Course Contents:` heading at all** | fallback: start at the first `1. … [N Hrs]` line |

Defect 3 is not a code error, which is what the earlier "three wrong codes"
phrasing got wrong. All three are detected; none require hand-editing the PDF.

Imported totals: **6 courses, 46 units, 188 topics** (242 nodes including the
program and semester).

### Three topic formats

| Format | Example | Result |
|---|---|---|
| Decimal | `1.1 Definitions of statistics` | topic nodes, `code = "1.1"` |
| Lettered | `a. History and types of operating system` | topic nodes, `code = "1.a"` |
| Prose | `Definition of database, DBMS, RDBMS, ...` | **unit only, no topics** |

Prose units deliberately produce no topic nodes. Splitting that text on commas
would manufacture topics the university never defined, and downstream they would
be indistinguishable from real ones — worse than having none. A unit is a
perfectly good link target on its own; DBMS is currently 9 units with 0 topics
and that is the honest representation.

### Things that must not become units

`Laboratory Works:` is followed by `1. General commands and programming in
LINUX`, which matches the unit pattern exactly. Two guards: an explicit end
marker, and a rule that unit numbers only ever increase within a course.

---

## What is not imported

| Semester | State |
|---|---|
| 4 | ✅ imported — 6 courses, 46 units, 188 topics |
| 2, 3, 6 | ❌ **CamScanner scans, no text layer.** Need OCR. |
| 7, 8 | ❌ table layout the parser reads wrongly — every course rejected |

Nothing junk reaches the spine. `rejection_reason()` refuses a parse whose title:

| Check | Example it catches |
|---|---|
| page furniture | `"Year: IV Semester: II"` (semester VIII) |
| almost no letters | — |
| index-table debris | `"DigitalGovernanc e 3 3 1 4 BIT4** Specialization1"` |
| **words fused by a wrapped table cell** | `"NetworkProgram ming"`, `"ApprenticeProje ct"` |
| units with neither hours nor topics | a stray numbered list read as a syllabus |

The fused-word check earns its place: PDF table cells wrap mid-word and the
extractor rejoins the halves without the space, so two words merge and the break
lands somewhere else entirely. The rule is "a word of 9+ characters with an
internal capital", which leaves `IoT`, `PL/SQL`, `JAVA` and `Project-IV`
untouched.

A rejected course is reported, not written.

The scanned PDFs are the interesting case: the vision pipeline in
`app/stages/extract.py` already reads photographed pages for question papers,
so pointing it at these is a small job rather than a new capability.

**Project courses are imported, not rejected.** `BIT256CO Project-IV` has no
syllabus units by design; it lands as a bare course node carrying the reason, so
the tree is complete and coverage counts against the right denominator.

---

## A correction to the blueprint

The blueprint uses `bit.s4.bit253co.u7.t3` as its example path and sets the
Phase 0 exit test as *"all topics in Unit 7"*, describing Unit 7 as Deadlock.

**In the official syllabus, Deadlocks is Unit 6.** Unit 7 is Real Time System
(2 hours, 2 topics).

```
5 Input/Output        [7 Hrs]   ← disk scheduling lives here (5.c)
6 Deadlocks           [7 Hrs]   ← 6 topics, incl. 6.d Deadlock detection and recovery
7 Real Time System    [2 Hrs]   ← 2 topics
```

There is also no `7.3`-style label in this course — Operating System uses
lettered sub-topics, so the deadlock detection topic is **`6.d`**, at path
`bit.s4.bit253co.u6.t4`.

This matters beyond pedantry: the Phase 2 acceptance test's disk-scheduling
question (Q3) maps to unit **5**, and SRTF (Q11) to unit **2** — not to unit 7.

---

## Usage

```bash
cd C:/SUPREME-AI && docker compose -f docker-compose.postgres.yml up -d
cd C:/MockExams/examai-api

python scripts/import_syllabus.py --semester 4 --migrate
python scripts/import_syllabus.py --all --dry-run        # what would import
python scripts/import_syllabus.py --tree bit.s4.bit253co # render a subtree
python scripts/import_syllabus.py --semester 4 --replace # drop removed units first
```

`--replace` deletes each course's subtree before writing, so units removed from
a revised syllabus do not linger. Without it, re-import is a pure upsert.

**`marks_weight` is never written by the importer.** It holds observed exam
weight computed from real papers; the syllabus says what is *taught*, and
overwriting one with the other would destroy the only signal that makes the pass
planner better than reading the syllabus. There is a test for this.

### API

| Endpoint | Returns |
|---|---|
| `GET /syllabus/courses?semester=4` | courses in a semester |
| `GET /syllabus/tree/{path}` | nested subtree — the Reader's left pane |
| `GET /syllabus/node/{id}` | one node plus breadcrumbs |
| `GET /syllabus/topics/{path}` | every topic beneath any path |

Read-only, and outside the internal-key guard: the syllabus is published
university reference material that the app already shows students.
