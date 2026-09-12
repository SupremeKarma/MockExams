---
id: bit253co-u6-t2
type: topic_note
course: BIT253CO
syllabus_path: bit.s4.bit253co.u6.t2
syllabus_code: "6.b"
trust: ai_draft
---

# Conditions of deadlock

:::idea
A deadlock cannot happen by accident. Four specific things must all be true at
the same time, and if you can stop any single one of them, deadlock becomes
impossible. These four conditions are the foundation of everything else in this
unit — every prevention technique is just an attack on one of them.
:::

## The four necessary conditions

These are **Coffman's conditions**, and all four must hold **simultaneously**
for a deadlock to occur.

### 1. Mutual exclusion

At least one resource is held in a non-sharable mode. Only one process can use
it at a time; anyone else who wants it must wait.

A printer is the standard example. A read-only file is not — any number of
processes can read it at once, so it can never be part of a deadlock.

### 2. Hold and wait

A process is holding at least one resource **and** waiting to acquire more that
are currently held by others.

The word "and" is the whole condition. A process that holds nothing while it
waits cannot contribute to a cycle.

### 3. No preemption

A resource cannot be taken away from the process holding it. It is released
only voluntarily, when that process has finished with it.

This is why deadlock is a problem of **non-preemptable** resources. The CPU is
preempted constantly and never deadlocks anyone.

### 4. Circular wait

There is a closed chain of waiting processes:

P₀ waits for a resource held by P₁, which waits for one held by P₂, … and Pₙ
waits for one held by P₀.

:::diagram{title="A circular wait between four processes"}
Each arrow means "is waiting for a resource held by".

```
      P0 ───────▶ P1
      ▲            │
      │            ▼
      P3 ◀─────── P2
```
:::

:::warning
**Necessary is not the same as sufficient.** All four conditions can hold and
there may still be no deadlock — a circular wait is only *possible*, not
guaranteed to form. But remove any one condition and deadlock becomes
**impossible**. Getting this backwards is a common and costly slip: do not write
that the four conditions "cause" deadlock.
:::

## Why the fourth is different

Circular wait is not independent of the others. If mutual exclusion, hold and
wait, and no preemption all hold, a circular wait is what completes the trap.
Many textbooks treat the first three as the environment and the fourth as the
event.

That matters in practice: the first three are properties of how resources
*work*, while circular wait is a property of the *order* in which processes
happen to request them. It is usually the easiest one to attack.

## Each condition maps to a prevention technique

This table is the bridge from this topic to 6.e, and it is worth memorising as
a unit.

| Condition | How to break it | What it costs |
|---|---|---|
| **Mutual exclusion** | Make resources sharable; spool them | Impossible for most devices |
| **Hold and wait** | Request everything up front, or release all before requesting more | Poor utilisation; starvation |
| **No preemption** | Take resources back and restart the process later | Needs rollback; loses work |
| **Circular wait** | Number the resources; request only in increasing order | Restricts how programs are written |

The last row is the one real systems actually use. Ordering locks by a fixed
numeric rank is standard practice in kernel and database code, precisely because
it is the cheapest of the four to enforce.

:::example{title="Breaking circular wait by ordering"}
Number the resources: printer = 1, scanner = 2.

Both processes must now request in increasing order. Process B can no longer
take the scanner (2) and then ask for the printer (1) — it must ask for the
printer first.

So one of them gets the printer and proceeds; the other waits for it and then
takes both. The cycle cannot form, because a cycle requires at least one process
to request a lower-numbered resource while holding a higher one.
:::

:::exam-tip
"State and explain the necessary conditions for deadlock" is one of the most
predictable questions in this unit. Name all four **in order**, define each in a
sentence, and give one concrete example. If the question is worth 6 marks or
more, add the prevention column — "break mutual exclusion by spooling, break
circular wait by ordering resources" — because that is what turns a list into an
answer. Write "necessary conditions", not "causes".
:::

:::practice-link
Practice variants for this topic arrive in Phase 4.
:::
