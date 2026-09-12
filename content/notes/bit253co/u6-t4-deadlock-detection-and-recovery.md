---
id: bit253co-u6-t4
type: topic_note
course: BIT253CO
syllabus_path: bit.s4.bit253co.u6.t4
syllabus_code: "6.d"
trust: ai_draft
---

# Deadlock detection and recovery

:::idea
Some operating systems do not try to stop deadlock happening. They let it
happen, check now and then whether anything is stuck, and break the jam when
they find one. It is the "deal with it when it happens" strategy, as opposed to
preventing or avoiding it in advance.
:::

## Why an OS would choose to allow deadlock

A deadlock is a set of processes that are each waiting for something held by
another process in the same set, so none of them can ever move.

Preventing deadlock costs something. To prevent it you must restrict how
processes ask for resources, and those restrictions slow down every process —
including the overwhelming majority that would never have deadlocked.

Deadlock is also rare in practice. So a system can reasonably decide:

- do nothing special when resources are requested,
- run a **detection algorithm** occasionally,
- **recover** on the rare occasion something is found.

This is the third of the four standard strategies. The others are ignoring the
problem entirely (the "ostrich algorithm"), prevention, and avoidance.

:::warning
Detection is not the same as avoidance. Avoidance (Banker's Algorithm) refuses a
request that *might* lead to deadlock. Detection allows every request and looks
for damage afterwards. Examiners deduct marks when these are mixed up.
:::

## Detection when each resource type has one instance

If there is only one printer, one scanner, one tape drive, the situation is
simple enough to draw.

Build a **wait-for graph**:

- one node per process,
- an edge from P₁ to P₂ meaning "P₁ is waiting for a resource that P₂ holds".

This is derived from the resource-allocation graph by removing the resource
nodes and collapsing the edges through them.

:::diagram
P₁ holds R₁ and wants R₂; P₂ holds R₂ and wants R₁. Collapsing the resource
nodes leaves a two-node cycle.

```
resource-allocation graph        wait-for graph

  P₁ ──request──▶ R₂               P₁ ───▶ P₂
  R₂ ──assign───▶ P₂               ▲        │
  P₂ ──request──▶ R₁               └────────┘
  R₁ ──assign───▶ P₁
```
:::

**A cycle in the wait-for graph means a deadlock.** Every process on the cycle
is waiting for the next one, all the way round, so none can proceed.

The system maintains this graph and periodically runs a cycle-detection
algorithm on it. Detecting a cycle in a graph with *n* nodes costs O(n²) in the
standard algorithm.

## Detection with multiple instances per resource type

When there are three identical printers, a cycle no longer proves deadlock — a
process waiting on a printer might be satisfied by any of the three. So the
graph method does not work and a numerical algorithm is used instead.

### The data structures

| Structure | Size | Meaning |
|---|---|---|
| **Available** | m | how many of each resource type are currently free |
| **Allocation** | n × m | how many of each type each process currently holds |
| **Request** | n × m | how many of each type each process is still asking for |

where *n* is the number of processes and *m* the number of resource types.

:::warning
In the **detection** algorithm the third matrix is **Request** — what a process
is asking for right now. In the **avoidance** algorithm (Banker's) it is
**Need** — the most it could ever still ask for. Writing "Need" in a detection
answer is a common and costly slip.
:::

### The algorithm

1. Let `Work = Available`. For each process, set `Finish[i] = false` if that
   process holds anything, and `true` if it holds nothing at all.
2. Find an index *i* such that `Finish[i] = false` **and** `Request[i] ≤ Work`
   (component by component). If none exists, go to step 4.
3. `Work = Work + Allocation[i]`; `Finish[i] = true`; go back to step 2.
4. If `Finish[i] = false` for some *i*, the system **is deadlocked**, and those
   processes are exactly the deadlocked ones.

The idea behind step 3: if a process's outstanding request can be met from what
is free, it can finish, and when it finishes it gives back everything it holds —
so those resources become available for someone else.

### A worked example

:::example{title="Five processes, three resource types"}
Three resource types A, B, C with 7, 2, 6 instances in total. All of them are
currently allocated, so `Available = (0, 0, 0)`.

| Process | Allocation (A B C) | Request (A B C) |
|---|---|---|
| P₀ | 0 1 0 | 0 0 0 |
| P₁ | 2 0 0 | 2 0 2 |
| P₂ | 3 0 3 | 0 0 0 |
| P₃ | 2 1 1 | 1 0 0 |
| P₄ | 0 0 2 | 0 0 2 |
:::

:::working
Start: `Work = (0, 0, 0)`, nothing finished.

**Step 1.** P₀ requests (0,0,0), which is ≤ (0,0,0). P₀ can finish.
Release its allocation: `Work = (0,0,0) + (0,1,0) = (0,1,0)`.

**Step 2.** P₂ requests (0,0,0) ≤ (0,1,0). P₂ can finish.
`Work = (0,1,0) + (3,0,3) = (3,1,3)`.

**Step 3.** P₃ requests (1,0,0) ≤ (3,1,3). P₃ can finish.
`Work = (3,1,3) + (2,1,1) = (5,2,4)`.

**Step 4.** P₁ requests (2,0,2) ≤ (5,2,4). P₁ can finish.
`Work = (5,2,4) + (2,0,0) = (7,2,4)`.

**Step 5.** P₄ requests (0,0,2) ≤ (7,2,4). P₄ can finish.
`Work = (7,2,4) + (0,0,2) = (7,2,6)`.

Every process finished, so `Finish[i] = true` for all *i*.
:::

:::answer-box
**No deadlock.** A sequence in which all five can complete is
⟨P₀, P₂, P₃, P₁, P₄⟩, ending with `Work = (7, 2, 6)` — every resource returned.
:::

Now change one number: suppose P₂ requests (0, 0, 1) instead of (0, 0, 0).

:::working
`Work = (0,0,0)`. P₀ finishes as before, `Work = (0,1,0)`.

P₂ now needs (0,0,1) but only (0,1,0) is free — C is not available.
P₁ needs (2,0,2) — no. P₃ needs (1,0,0) — no A available. P₄ needs (0,0,2) — no.

Nothing else can proceed.
:::

:::answer-box
**Deadlocked.** P₁, P₂, P₃ and P₄ are deadlocked; only P₀ completed.
:::

### How often should detection run?

There is a trade-off, and examiners like this point:

- **Every time a request cannot be granted** — finds the deadlock instantly and
  identifies exactly which process caused it, but is expensive.
- **At fixed intervals**, say once an hour, or when CPU utilisation drops below
  some threshold — much cheaper, but by the time it runs several cycles may
  exist and there is no way to tell which request caused which.

## Recovery

Detecting a deadlock is useless without breaking it. There are two approaches.

### Recovery through process termination

- **Abort all deadlocked processes.** Always works, and is expensive — every
  process loses all its work.
- **Abort one at a time** until the cycle breaks, re-running detection after
  each. Cheaper in lost work, costlier in detection runs.

Choosing which to abort is a policy decision, usually based on: the process's
priority, how long it has run and how much longer it needs, how many and what
type of resources it holds, how many processes will need terminating, and
whether it is interactive or batch.

### Recovery through resource preemption

Take a resource away from a process and give it to another. Three issues have to
be settled:

1. **Selecting a victim** — which resource from which process, minimising cost.
2. **Rollback** — the victim cannot continue without the resource, so it must be
   rolled back to a safe state and restarted. That requires checkpointing, which
   is expensive. In practice a total rollback (abort and restart) is common.
3. **Starvation** — if the victim is chosen on cost alone, the same cheap
   process may be picked every time and never finish. Include the number of
   rollbacks in the cost so a repeatedly-chosen process eventually stops being
   the cheapest option.

:::exam-tip
For a numerical question, write the algorithm steps first and then apply them
to the table, showing `Work` after each step. Marks are given for both the
method and the arithmetic — a correct final answer with no working loses most of
them. State the completion sequence explicitly, and say *which* processes are
deadlocked rather than only "deadlock exists".
:::

:::practice-link
Practice variants for this topic arrive in Phase 4.
:::
