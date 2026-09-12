---
id: bit253co-u6-t6
type: topic_note
course: BIT253CO
syllabus_path: bit.s4.bit253co.u6.t6
syllabus_code: "6.f"
trust: ai_draft
---

# Banker's Algorithm

:::idea
A bank does not lend out every rupee it holds. It keeps enough back that it can
always honour the customers it has already committed to. The Banker's Algorithm
makes the operating system behave the same way: before granting a request for
resources, it checks whether it could still finish every process afterwards. If
it could not, the request waits — even though the resources are sitting free.
:::

## Avoidance, not detection

This is deadlock **avoidance**. The system never enters a deadlock, because it
refuses any request that would put it at risk.

| Strategy | When it acts | What it uses |
|---|---|---|
| Prevention | Design time | Break one of the four conditions |
| **Avoidance (Banker's)** | **Before granting a request** | **Max future need** |
| Detection | After the fact | Current requests |

:::warning
The commonest and most expensive mistake in this topic: **detection uses
`Request`, avoidance uses `Need`.** `Request` is what a process is asking for
right now. `Need` is the most it could *ever* still ask for, and that is what
makes avoidance possible — the bank plans for the worst case, not the current
one. Writing the safety algorithm as the detection algorithm loses most of the
marks even when the arithmetic is right.
:::

The price is that every process must **declare its maximum need in advance**.
That is a strong assumption and the main reason real operating systems do not
use Banker's — but it is exactly what makes it examinable.

## The four data structures

For *n* processes and *m* resource types:

| Structure | Size | Meaning |
|---|---|---|
| **Available** | m | How many of each type are free right now |
| **Max** | n × m | The most each process will ever need |
| **Allocation** | n × m | What each process holds now |
| **Need** | n × m | What each could still ask for |

:::formula{title="The relationship you will use in every question"}
Need[i][j] = Max[i][j] − Allocation[i][j]
:::

Computing the Need matrix is usually the first mark in the question. Do it
before anything else and show it.

## Safe state

A state is **safe** if there is an order in which every process can finish — a
**safe sequence**. Grant the first process everything it still needs, let it
finish and give back what it held, then use the larger free pool for the next
one, and so on.

An unsafe state is not a deadlock. It is a state from which a deadlock has
become *possible*, and Banker's simply refuses to enter one.

## The safety algorithm

1. `Work = Available`. `Finish[i] = false` for every process.
2. Find an *i* with `Finish[i] = false` **and** `Need[i] ≤ Work`.
   If none exists, go to step 4.
3. `Work = Work + Allocation[i]`; `Finish[i] = true`; go back to step 2.
4. If every `Finish[i]` is true, the state is **safe** and the order in which
   you marked them is a safe sequence. Otherwise it is **unsafe**.

Step 3 is the whole idea: a process that can get everything it needs will finish,
and when it does it returns everything it was holding.

## A worked example

:::example{title="Five processes, three resource types"}
Resource types A, B and C, with `Available = (3, 3, 2)`.

| Process | Allocation (A B C) | Max (A B C) |
|---|---|---|
| P0 | 0 1 0 | 7 5 3 |
| P1 | 2 0 0 | 3 2 2 |
| P2 | 3 0 2 | 9 0 2 |
| P3 | 2 1 1 | 2 2 2 |
| P4 | 0 0 2 | 4 3 3 |
:::

First compute Need = Max − Allocation:

| Process | Need (A B C) |
|---|---|
| P0 | 7 4 3 |
| P1 | 1 2 2 |
| P2 | 6 0 0 |
| P3 | 0 1 1 |
| P4 | 4 3 1 |

:::working
`Work = (3, 3, 2)`, nothing finished.

**P0?** Need (7,4,3) ≤ (3,3,2)? No — 7 > 3. Skip.
**P1?** Need (1,2,2) ≤ (3,3,2)? Yes. P1 can finish.
    `Work = (3,3,2) + (2,0,0) = (5,3,2)`

**P2?** Need (6,0,0) ≤ (5,3,2)? No — 6 > 5. Skip.
**P3?** Need (0,1,1) ≤ (5,3,2)? Yes.
    `Work = (5,3,2) + (2,1,1) = (7,4,3)`

**P4?** Need (4,3,1) ≤ (7,4,3)? Yes.
    `Work = (7,4,3) + (0,0,2) = (7,4,5)`

**P0?** Need (7,4,3) ≤ (7,4,5)? Yes.
    `Work = (7,4,5) + (0,1,0) = (7,5,5)`

**P2?** Need (6,0,0) ≤ (7,5,5)? Yes.
    `Work = (7,5,5) + (3,0,2) = (10,5,7)`

All five finished.
:::

:::answer-box
**The state is SAFE.** A safe sequence is ⟨P1, P3, P4, P0, P2⟩.
:::

:::warning
**A safe sequence is not unique.** ⟨P1, P3, P4, P2, P0⟩ also works on this
state. Any order in which each process's Need fits the free pool at its turn is
correct, so do not hunt for one particular answer — show that yours works.
:::

## The resource-request algorithm

When process *i* actually requests resources, three checks run in order:

1. If `Request[i] > Need[i]` — **error**. The process has exceeded the maximum
   it declared.
2. If `Request[i] > Available` — **wait**. The resources are not there.
3. Otherwise **pretend to grant it**:
   ```
   Available = Available − Request[i]
   Allocation[i] = Allocation[i] + Request[i]
   Need[i] = Need[i] − Request[i]
   ```
   Run the safety algorithm on this pretend state. If it is safe, make the grant
   real. If not, **undo it** and make the process wait.

That pretend-then-check is the heart of the algorithm, and step 3's rollback is
the part students most often leave out.

:::example{title="P1 requests (1, 0, 2)"}
Check 1: is (1,0,2) ≤ Need P1 (1,2,2)? Yes.
Check 2: is (1,0,2) ≤ Available (3,3,2)? Yes.

Pretend to grant:

    Available    = (3,3,2) − (1,0,2) = (2,3,0)
    Allocation P1 = (2,0,0) + (1,0,2) = (3,0,2)
    Need P1       = (1,2,2) − (1,0,2) = (0,2,0)
:::

:::working
Run safety on the pretend state, `Work = (2,3,0)`.

**P1?** Need (0,2,0) ≤ (2,3,0)? Yes. `Work = (2,3,0) + (3,0,2) = (5,3,2)`
**P3?** Need (0,1,1) ≤ (5,3,2)? Yes. `Work = (5,3,2) + (2,1,1) = (7,4,3)`
**P4?** Need (4,3,1) ≤ (7,4,3)? Yes. `Work = (7,4,3) + (0,0,2) = (7,4,5)`
**P0?** Need (7,4,3) ≤ (7,4,5)? Yes. `Work = (7,4,5) + (0,1,0) = (7,5,5)`
**P2?** Need (6,0,0) ≤ (7,5,5)? Yes. `Work = (7,5,5) + (3,0,2) = (10,5,7)`

All five finish.
:::

:::answer-box
**The request is GRANTED.** The resulting state is safe, with the safe sequence
⟨P1, P3, P4, P0, P2⟩.
:::

## Single resource type

With only one resource type the matrices collapse to single numbers, and the
safety check is easier to see: sort the processes by remaining need, and check
that the free pool plus what each returns is enough for the next.

The usual single-resource question gives a total number of units, an allocation
per process and a maximum per process, and asks whether the state is safe. The
method is identical — Need = Max − Allocation, then repeatedly find a process
whose Need fits the free pool.

## Limitations worth stating

- Every process must **declare its maximum in advance**, which programs rarely
  can.
- The number of processes and resources must be **fixed**.
- Processes must **return resources in finite time**.
- The safety check is **O(m × n²)** — expensive to run on every request.

Together these are why real operating systems use detection or prevention, or
simply ignore deadlock.

:::exam-tip
Structure a Banker's answer in the same four steps every time: (1) compute and
show the **Need** matrix, (2) state `Work = Available`, (3) walk the processes
showing `Work` after each one finishes, (4) state the safe sequence explicitly
and say "the state is safe".

For a request question, do the **three checks in order** and show the pretend
state before running safety — the marks are for the procedure, not just the
verdict. And write `Need`, never `Request`, in a safety answer; that single word
is what distinguishes avoidance from detection.
:::

:::practice-link
Practice variants for this topic arrive in Phase 4.
:::
