---
id: bit253co-u6-t1
type: topic_note
course: BIT253CO
syllabus_path: bit.s4.bit253co.u6.t1
syllabus_code: "6.a"
trust: ai_draft
---

# Introduction to deadlock

:::idea
Two people meet in a narrow corridor. Each steps aside to let the other pass,
but they step the same way, and neither will move until the other does. That is
a deadlock: a set of processes, each holding something the next one needs, all
waiting forever for each other.
:::

## What a deadlock actually is

A set of processes is **deadlocked** when every process in the set is waiting
for an event that only another process in the same set can cause.

The event is almost always the release of a resource. Because every process in
the set is waiting, none of them can run, and because none can run, none can
release anything. Nothing in the set will ever move again without outside
intervention.

:::example{title="The smallest possible deadlock"}
A printer and a scanner. One of each.

- Process A takes the printer, then asks for the scanner.
- Process B takes the scanner, then asks for the printer.

A waits for B to release the scanner. B waits for A to release the printer.
Neither will, because each is blocked before the line where it would.
:::

That is the whole phenomenon. Everything else in this unit is about detecting
it, avoiding it, or getting out of it.

## Resources

A **resource** is anything a process may need and must wait for. The operating
system cares about two kinds:

| Kind | Meaning | Examples |
|---|---|---|
| **Preemptable** | Can be taken away and given back with no harm | CPU, main memory |
| **Non-preemptable** | Taking it away mid-use breaks something | Printer, CD writer, a locked file |

**Deadlock is a problem of non-preemptable resources.** If a resource can simply
be taken back, the system can always break the jam. You cannot take a printer
back halfway through a page.

The normal life of a resource is three steps, and a process can block at the
first one:

1. **Request** — ask for it. Wait if it is not free.
2. **Use** — do the work.
3. **Release** — give it back.

:::warning
Deadlock is not the same as **starvation**. A deadlocked process waits for
something that will *never* happen. A starved process waits for something that
*could* happen at any moment, but the scheduler keeps choosing someone else.
Deadlock is permanent by definition; starvation is a fairness failure. Examiners
ask for this distinction directly.
:::

## The four ways to handle it

Every technique in this unit is one of these, and knowing which is which is
worth marks on its own.

| Strategy | Idea | Covered in |
|---|---|---|
| **Ignore it** | Pretend deadlocks never happen | below |
| **Prevention** | Make one of the four conditions impossible | 6.e |
| **Avoidance** | Refuse any request that could lead to deadlock | 6.e, 6.f |
| **Detection and recovery** | Let it happen, find it, break it | 6.d |

### Ignoring it — the ostrich algorithm

Most general-purpose operating systems, including UNIX and Windows, simply do
nothing. The name comes from the ostrich that supposedly buries its head in the
sand.

That sounds like negligence, and it is a real engineering decision:

- Deadlocks are **rare** on a desktop or phone.
- Preventing them costs every process, all the time.
- A user who does hit one can reboot or kill the process, which is cheap.

The trade-off flips completely for a system where a deadlock is expensive — an
air traffic controller, a payment switch, a database server. Those systems pay
for detection or avoidance because the alternative is unacceptable.

:::exam-tip
"What is deadlock?" is usually 2 to 4 marks and wants three things: the
definition (every process waiting for an event only another in the set can
cause), a concrete two-process example, and the distinction from starvation.
Name the four handling strategies if there is room — it shows you know where
this unit is going, and the list often carries a mark of its own.
:::

:::practice-link
Practice variants for this topic arrive in Phase 4.
:::
