---
id: bit253co-u2-t4
type: topic_note
course: BIT253CO
syllabus_path: bit.s4.bit253co.u2.t4
syllabus_code: "2.d"
trust: ai_draft
---

# Inter-process communication

:::idea
When two processes share something — a variable, a file, a printer — the order
in which they happen to run can change the result. Run the program twice and get
two different answers. Inter-process communication is the set of tools that stop
that happening: ways to make sure only one process touches the shared thing at a
time.
:::

## Race conditions

A **race condition** is when the outcome depends on the exact timing of two or
more processes. The classic case is two processes incrementing one variable.

`counter = counter + 1` looks like one step, but the CPU does three:

```
    load   counter into a register
    add    1 to the register
    store  the register back into counter
```

A context switch can happen between any two of them.

:::example{title="Two processes, one counter"}
`counter` starts at **5**. Both P1 and P2 run `counter = counter + 1`. The
correct final value is **7**.

But suppose the switches land badly:

| Step | Who | Action | Register | counter |
|---|---|---|---|---|
| 1 | P1 | load | 5 | 5 |
| 2 | P1 | add 1 | 6 | 5 |
| 3 | — | *switch to P2* | — | 5 |
| 4 | P2 | load | 5 | 5 |
| 5 | P2 | add 1 | 6 | 5 |
| 6 | P2 | store | 6 | **6** |
| 7 | — | *switch to P1* | — | 6 |
| 8 | P1 | store | 6 | **6** |

P1 stored a value it computed from a counter that P2 had since changed. One
increment was lost.
:::

:::answer-box
**counter = 6, not 7.** Two increments were performed and one was lost, because
both read 5 before either wrote.
:::

:::warning
The bug is not that the value is 6 — it is that the value is **unpredictable**.
Another interleaving gives the correct 7, so the program passes when you test it
and fails in production. That is what makes race conditions hard, and why the
fix must be structural rather than "add a delay".
:::

## The critical section

The part of a program that touches shared data is its **critical section** (or
critical region). The goal is to make sure **no two processes are in their
critical sections at the same time** — that is **mutual exclusion**.

A correct solution must satisfy four conditions:

1. **Mutual exclusion** — no two processes inside at once.
2. **Progress** — no process outside its critical section may block another.
3. **Bounded waiting** — nobody waits forever.
4. **No assumptions about speed** — it must not depend on how many CPUs there
   are or how fast they run.

:::warning
Condition 4 is why "just disable interrupts" is not a general answer. It works
on a single CPU and does nothing on a multi-core machine, where another core
carries on regardless. Disabling interrupts is also a privileged operation, so a
user process cannot do it anyway.
:::

## Busy waiting solutions

These work but burn CPU while waiting, which is why they are mainly of
historical and exam interest.

**Strict alternation** uses a `turn` variable and processes take it in turns.
It gives mutual exclusion but **violates progress**: if P0 is in its long
non-critical section, P1 cannot enter twice in a row even though P0 is nowhere
near the shared data.

**Peterson's solution** combines a `turn` variable with an `interested[]` array
and satisfies all four conditions in software, with no special hardware.

**TSL (Test and Set Lock)** is the hardware answer: a single indivisible
instruction that reads a lock variable and sets it in one step, so no switch can
occur in the middle. Modern CPUs provide it as compare-and-swap.

:::warning
All of the above **busy wait** — they spin in a loop testing a variable, using
the CPU to do nothing. That also causes the **priority inversion problem**: if a
high-priority process spins waiting for a lock held by a low-priority one, the
low-priority process never gets scheduled to release it, and the system hangs.
:::

## Semaphores

A **semaphore** is an integer with two atomic operations, and it is the first
solution that lets a waiting process *sleep* instead of spinning.

| Operation | Also called | What it does |
|---|---|---|
| `down(S)` | wait, P | If S > 0, decrement it. Otherwise **block**. |
| `up(S)` | signal, V | Increment S. If anyone is blocked, wake one. |

Both must be **atomic** — indivisible — or the semaphore has the very race
condition it exists to prevent.

Two kinds:

- **Binary semaphore (mutex)** — value 0 or 1. Used for mutual exclusion.
- **Counting semaphore** — any value. Used to count available instances of a
  resource.

:::example{title="The producer–consumer problem"}
A producer puts items into a fixed-size buffer; a consumer takes them out. The
producer must wait when the buffer is full, the consumer when it is empty.

Three semaphores:

```
    mutex  = 1   guards the buffer itself
    empty  = N   how many free slots
    full   = 0   how many filled slots

  Producer                  Consumer
    down(empty)               down(full)
    down(mutex)               down(mutex)
      put item                  take item
    up(mutex)                 up(mutex)
    up(full)                  up(empty)
```
:::

:::warning
**The order of the two `down` operations matters, and getting it wrong
deadlocks.** If the producer did `down(mutex)` before `down(empty)` and the
buffer were full, it would hold the mutex while blocking on `empty` — and the
consumer could never get the mutex to make space. Always take the counting
semaphore first and the mutex second.
:::

## Monitors

Semaphores are powerful and easy to misuse: one `down` in the wrong order or one
missing `up` and the program deadlocks, often rarely and unreproducibly.

A **monitor** is a higher-level construct — a collection of procedures and data
in which **only one process can be active at a time**, enforced by the
*compiler* rather than the programmer.

Monitors use **condition variables** with two operations:

- `wait(c)` — block on condition c and **release the monitor** so someone else
  can enter.
- `signal(c)` — wake a process waiting on c.

:::warning
A condition variable is **not** a semaphore. It has no stored value: a `signal`
with nobody waiting is **lost**, whereas an `up` on a semaphore increments it
and is remembered. Programs that assume otherwise hang.
:::

## Message passing

Everything above assumes shared memory, which does not exist between machines.
**Message passing** uses two primitives — `send(destination, message)` and
`receive(source, message)` — and works across a network.

The design questions are whether calls **block**, how destinations are
**named**, and what happens when messages are **lost** (usually acknowledgements
and retransmission).

:::exam-tip
This topic supplies several standard questions. "What is a race condition?" —
define it, then give the counter trace; the trace is worth more than the
definition.

"What are the requirements for a critical-section solution?" — all four
conditions, and say why disabling interrupts fails the fourth.

"Explain semaphores with the producer–consumer problem" — give all three
semaphores with their initial values, both code blocks, and then explain why the
`down` order cannot be swapped. That last explanation is what separates a full
answer from a memorised one.
:::

:::practice-link
Practice variants for this topic arrive in Phase 4.
:::
