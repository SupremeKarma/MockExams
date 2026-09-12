---
id: bit253co-u2-t6
type: topic_note
course: BIT253CO
syllabus_path: bit.s4.bit253co.u2.t6
syllabus_code: "2.f"
trust: ai_draft
---

# Process scheduling

:::idea
A computer usually has more programs wanting to run than it has processors to
run them on. The scheduler is the part of the operating system that decides who
gets the CPU next, and for how long. Different rules suit different goals —
finishing everything quickly, or keeping a typist's cursor responsive — and
this topic is about the standard rules and how to compare them with numbers.
:::

## The words you need first

Every scheduling question uses the same four quantities. Get these right and
the arithmetic follows.

| Term | Meaning |
|---|---|
| **Arrival time** | When the process became ready to run |
| **Burst time** | How long it needs the CPU for |
| **Completion time** | When it finished |
| **Turnaround time** | Completion − Arrival. Total time in the system. |
| **Waiting time** | Turnaround − Burst. Time spent ready but not running. |

:::formula{title="The two you will be asked to compute"}
Turnaround time = Completion − Arrival
Waiting time = Turnaround − Burst
:::

Two more distinctions matter:

- **Preemptive** scheduling can take the CPU away from a running process.
  **Non-preemptive** scheduling lets it run until it finishes or blocks.
- **Throughput** is processes finished per unit time; **response time** is how
  long before a process first runs. An interactive system cares about response
  time even at the cost of throughput.

## FCFS — first come, first served

The ready queue is a plain queue. Whoever arrives first runs first, to
completion. Non-preemptive.

:::example{title="Four processes"}
| Process | Arrival | Burst |
|---|---|---|
| P1 | 0 | 8 |
| P2 | 1 | 4 |
| P3 | 2 | 9 |
| P4 | 3 | 5 |
:::

:::working
Running in arrival order:

```
 P1        P2      P3          P4
0────────8───────12──────────21──────26
```

| Process | Completion | Turnaround | Waiting |
|---|---|---|---|
| P1 | 8 | 8 − 0 = 8 | 8 − 8 = 0 |
| P2 | 12 | 12 − 1 = 11 | 11 − 4 = 7 |
| P3 | 21 | 21 − 2 = 19 | 19 − 9 = 10 |
| P4 | 26 | 26 − 3 = 23 | 23 − 5 = 18 |

Average waiting = (0 + 7 + 10 + 18) / 4 = 35 / 4
Average turnaround = (8 + 11 + 19 + 23) / 4 = 61 / 4
:::

:::answer-box
**FCFS: average waiting time = 8.75 ms, average turnaround time = 15.25 ms.**
:::

FCFS is simple and never starves anyone. Its weakness has a name:

:::warning
**The convoy effect.** One long process at the front makes every short process
behind it wait. P4 needs the CPU for 5 ms and waits 18. A queue of quick jobs
stuck behind one slow one is the classic FCFS failure.
:::

## SJF — shortest job first

Pick the process with the **smallest burst time** among those that have arrived.
Non-preemptive: once it starts, it runs to completion.

SJF gives the **provably minimum average waiting time** for a given set of
processes. That is its whole reason for existing, and it is a fact worth quoting
in an exam.

The catch is equally quotable:

:::warning
SJF needs the burst time *in advance*, and the operating system does not know
it. Real schedulers estimate it from recent history, usually with an
exponentially weighted average of previous bursts. SJF also **can starve** a
long process if short ones keep arriving.
:::

## SRTF — shortest remaining time first

The preemptive version of SJF. Whenever a process arrives, compare its burst
with the **remaining** time of the running process; if the newcomer is shorter,
it takes over immediately.

:::working
Same four processes.

**t = 0** — only P1 has arrived. P1 runs.
**t = 1** — P2 arrives needing 4. P1 has 7 left. 4 < 7, so **P2 preempts P1**.
**t = 2** — P3 arrives needing 9. P2 has 3 left. 9 > 3, so P2 keeps running.
**t = 3** — P4 arrives needing 5. P2 has 2 left. 5 > 2, so P2 keeps running.
**t = 5** — P2 finishes. Remaining: P1 has 7, P3 has 9, P4 has 5. **P4 is
shortest**, so P4 runs.
**t = 10** — P4 finishes. P1 has 7, P3 has 9. **P1 runs** to completion.
**t = 17** — P1 finishes. **P3 runs**, finishing at 26.

```
P1   P2      P4        P1            P3
0──1────5──────10────────────17────────────26
```

| Process | Completion | Turnaround | Waiting |
|---|---|---|---|
| P1 | 17 | 17 − 0 = 17 | 17 − 8 = 9 |
| P2 | 5 | 5 − 1 = 4 | 4 − 4 = 0 |
| P3 | 26 | 26 − 2 = 24 | 24 − 9 = 15 |
| P4 | 10 | 10 − 3 = 7 | 7 − 5 = 2 |

Average waiting = (9 + 0 + 15 + 2) / 4 = 26 / 4
Average turnaround = (17 + 4 + 24 + 7) / 4 = 52 / 4
:::

:::answer-box
**SRTF: average waiting time = 6.5 ms, average turnaround time = 13 ms.**

Compare with FCFS on the same processes: 8.75 ms and 15.25 ms.
:::

## Round robin

Every process gets a fixed slice of CPU — the **time quantum** — and then goes
to the back of the ready queue. Preemptive by design.

Round robin is the standard choice for interactive systems, because response
time is bounded: with *n* processes and quantum *q*, nobody waits more than
(n − 1) × q before running.

The quantum is the whole design decision:

| Quantum | Effect |
|---|---|
| Too large | Degenerates into FCFS — a process finishes before its slice ends |
| Too small | Response is excellent, but context-switch overhead dominates |

:::warning
A context switch is not free — saving and restoring registers and memory maps
costs real time. The usual rule of thumb is that the quantum should be large
enough that **80% of bursts finish within one quantum**. A 1 ms quantum with a
0.1 ms switch cost wastes about 10% of the CPU on switching alone.
:::

## Priority scheduling

Each process carries a priority number and the highest priority runs first. SJF
is really priority scheduling where the priority is the inverse of the burst
time.

:::warning
**Starvation and ageing.** A low-priority process may never run if
higher-priority ones keep arriving. The standard fix is **ageing**: gradually
raise the priority of a process the longer it waits, so it eventually runs. Name
both the problem and the fix — a question that asks about priority scheduling is
almost always asking for this pair.
:::

## Real-time scheduling

Real-time systems are judged on **meeting deadlines**, not on average waiting
time.

- **Hard real-time** — a missed deadline is a system failure (a car's airbag).
- **Soft real-time** — a missed deadline degrades quality (a video frame drops).

The two standard algorithms:

- **Rate monotonic** — static priority, shorter period gets higher priority.
- **Earliest deadline first (EDF)** — dynamic priority, whichever deadline is
  nearest runs next.

## Comparison

| Algorithm | Preemptive | Average wait | Starvation | Best for |
|---|---|---|---|---|
| FCFS | No | Poor | No | Simplicity, batch |
| SJF | No | **Optimal** | Yes | Known burst times |
| SRTF | Yes | Optimal, preemptive | Yes | Short jobs arriving |
| Round robin | Yes | Middling | No | Interactive systems |
| Priority | Either | Depends | Yes (use ageing) | Mixed importance |

:::exam-tip
Draw the Gantt chart first — the table of completion times falls straight out of
it, and an examiner can follow your reasoning even if one number slips. Then
compute turnaround before waiting, in that order, because waiting depends on it.

Two traps. **Waiting time is not "time before it first runs"** for a preemptive
algorithm — a preempted process accumulates more waiting afterwards, which is
why the formula is Turnaround − Burst. And when two processes tie on burst time,
**either order is correct**; the averages come out the same, which is exactly
why questions ask for averages rather than the chart.
:::

:::practice-link
Practice variants for this topic arrive in Phase 4.
:::
