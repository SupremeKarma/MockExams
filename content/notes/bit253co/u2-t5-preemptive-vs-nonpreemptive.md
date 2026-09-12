---
id: bit253co-u2-t5
type: topic_note
course: BIT253CO
syllabus_path: bit.s4.bit253co.u2.t5
syllabus_code: "2.e"
trust: ai_draft
---

# Preemptive versus non-preemptive scheduling

:::idea
Once a process has the CPU, does the operating system have the power to take it
away? If yes, the scheduling is preemptive. If no, the process keeps the CPU
until it finishes or blocks of its own accord. That one question decides whether
a system can stay responsive, and whether its shared data needs protecting.
:::

## The two kinds

**Non-preemptive** (also called cooperative): once a process starts running it
keeps the CPU until it either terminates or blocks waiting for I/O. The
scheduler is only consulted when the CPU becomes free.

**Preemptive**: the operating system can stop a running process and give the CPU
to another, typically when its time quantum expires or a higher-priority process
becomes ready.

## Where the scheduler gets involved

Recall the four state transitions from [2.b](#). A scheduling decision happens
when a process:

| # | Transition | Preemptive? |
|---|---|---|
| 1 | Running → Blocked (waits for I/O) | Both |
| 2 | Running → Ready (quantum expired or preempted) | **Preemptive only** |
| 3 | Blocked → Ready (I/O finished) | **Preemptive only** |
| 4 | Terminates | Both |

The rule follows directly: **if scheduling happens only at 1 and 4, it is
non-preemptive. If it also happens at 2 and 3, it is preemptive.** That is the
cleanest definition to give in an exam, because it is precise rather than
descriptive.

## What preemption needs

Preemption is impossible without a **clock**. The timer interrupt is what
returns control to the operating system while a process is still running — see
[5.d](#). Without it, a process that never blocks would own the machine forever.

This is a genuinely useful thing to say in an answer: it connects two units and
shows the mechanism rather than just the behaviour.

## The comparison

| | Non-preemptive | Preemptive |
|---|---|---|
| CPU taken away? | No | Yes |
| Needs a timer? | No | **Yes** |
| Response time | Poor and unpredictable | Good and bounded |
| Context switches | Few | Many |
| Overhead | Low | Higher |
| Shared data | Safe — no switch mid-update | **Needs synchronisation** |
| Starvation | Long jobs can hog the CPU | Low-priority can starve (use ageing) |
| Suits | Batch systems | Interactive and real-time systems |
| Examples | FCFS, SJF, non-preemptive priority | Round robin, SRTF, preemptive priority |

:::warning
The row people forget is **shared data**. Under non-preemptive scheduling a
process cannot be interrupted halfway through updating a shared structure, so
many race conditions simply cannot occur. Preemption reintroduces them, which is
why [2.d](#) matters so much more in a preemptive system. A comparison answer
that mentions this is noticeably stronger than one that only lists response time
and overhead.
:::

## Which algorithms are which

Several algorithms come in both forms, and the pairs are frequently confused:

| Non-preemptive | Preemptive counterpart |
|---|---|
| FCFS | (no preemptive version — it is inherently non-preemptive) |
| **SJF** — shortest job first | **SRTF** — shortest remaining time first |
| Non-preemptive priority | Preemptive priority |
| — | Round robin (only exists preemptively) |

:::example{title="The same processes under both"}
P1 arrives at 0 needing 8 ms; P2 arrives at 1 needing 4 ms.

**Non-preemptive (SJF):** P1 is already running and keeps the CPU. P2 waits
until t = 8. P2's waiting time is 7 ms.

**Preemptive (SRTF):** at t = 1, P2 needs 4 and P1 has 7 left. P2 preempts. P2
finishes at 5 with **0 ms** waiting; P1 resumes and finishes at 12.

Same processes, same algorithm family — the preemption alone turned a 7 ms wait
into none.
:::

Worked fully with four processes and average times, this is exactly the
comparison in [2.f](#), where SRTF gives 6.5 ms average waiting against FCFS's
8.75 ms.

## Choosing between them

**Non-preemptive suits** batch and throughput-oriented systems, where nobody is
waiting at a keyboard and every context switch avoided is CPU saved.

**Preemptive suits** anything interactive — a typist must see the character
appear — and anything real-time, where a deadline must be met regardless of what
is currently running.

General-purpose systems are all preemptive. Early ones were not: Windows 3.x and
classic Mac OS were cooperative, and one badly-written program could freeze the
whole machine. That is the practical argument for preemption in one sentence.

:::exam-tip
"Differentiate between preemptive and non-preemptive scheduling" is a standard
4 to 6 mark question and wants a **table**, not prose. Give at least five rows —
CPU taken away, timer needed, response time, overhead, shared data — and two
example algorithms for each column.

Two things lift the answer: define them by **which state transitions trigger a
scheduling decision**, which is precise rather than vague, and mention that
preemption **requires a clock interrupt**. If there is room, add the shared-data
point, because it is the one most candidates miss.
:::

:::practice-link
Practice variants for this topic arrive in Phase 4.
:::
