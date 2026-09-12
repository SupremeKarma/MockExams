---
id: bit253co-u5-t3
type: topic_note
course: BIT253CO
syllabus_path: bit.s4.bit253co.u5.t3
syllabus_code: "5.c"
trust: ai_draft
---

# Disks and disk scheduling algorithms

:::idea
A hard disk has an arm that must physically move to reach data. Moving it is
slow — far slower than anything else the computer does. When several programs
are waiting for different parts of the disk, the operating system gets to
choose what order to serve them in, and a good order means much less arm
movement. That choice is all disk scheduling is.
:::

## Why the order matters so much

Reading a block from a hard disk takes three things, and only one of them is
worth optimising.

| Time | What happens | Roughly |
|---|---|---|
| **Seek time** | The arm moves to the right track | milliseconds — the slow part |
| **Rotational latency** | The platter spins until the block is under the head | a few milliseconds |
| **Transfer time** | The data is read | very fast |

**Seek time dominates**, and it is the only one the operating system can
influence by reordering requests. So every algorithm below is really answering
one question: *in what order should we visit the requested cylinders so the arm
travels the shortest distance?*

The measure is **total head movement** — add up the distance travelled between
consecutive cylinders. Fewer cylinders crossed means a faster disk.

:::warning
None of this helps an SSD. A solid-state disk has no arm and no seek time, so
requests are served in whatever order suits its internal controller. Disk
scheduling is about the mechanical disk in the exam question, not the one in a
modern phone.
:::

## The example used throughout

Every algorithm below is worked on the same request queue, so the totals can be
compared honestly.

:::example{title="The request queue"}
A disk with cylinders numbered **0 to 199**.

The head is currently at cylinder **53**, and it arrived there moving
**upwards** (from a lower cylinder). Direction matters for SCAN and LOOK.

Pending requests, in the order they arrived:

`98, 183, 37, 122, 14, 124, 65, 67`
:::

## FCFS — first come, first served

Serve requests in the order they arrived. No reordering at all.

:::working
Start at 53.

53 → 98 → 183 → 37 → 122 → 14 → 124 → 65 → 67

Distances: 45 + 85 + 146 + 85 + 108 + 110 + 59 + 2
:::

:::answer-box
**FCFS total head movement = 640 cylinders.**
:::

It is fair — nobody is starved, because everyone is served in turn — and it is
the worst performer here. The arm swings from 183 down to 37 and back up to 122
purely because that is the order the requests happened to arrive in.

## SSTF — shortest seek time first

Always serve whichever pending request is **closest to where the head is now**.

:::working
Head at 53. Closest is 65 (12 away).

53 → 65 → 67 → 37 → 14 → 98 → 122 → 124 → 183

Distances: 12 + 2 + 30 + 23 + 84 + 24 + 2 + 59
:::

:::answer-box
**SSTF total head movement = 236 cylinders.**
:::

A large improvement on FCFS. But there is a cost:

:::warning
**SSTF can starve a request.** If requests keep arriving near the head's current
position, a request far away may wait indefinitely — the head never has a reason
to travel to it. FCFS cannot starve anyone; SSTF can. Examiners ask for this
trade-off by name.
:::

SSTF also ties. If the head sits at 20 with requests at 10 and 30, both are 10
cylinders away and **either choice is correct**. Say so in an exam rather than
pretending one is required.

## SCAN — the lift algorithm

The head moves in one direction serving everything on the way, reaches the
**end of the disk**, reverses, and serves everything on the way back. It behaves
like a lift, which is why SCAN is also called the elevator algorithm.

Our head is moving upwards, so it goes up first.

:::working
53 → 65 → 67 → 98 → 122 → 124 → 183 → **199** (the end) → 37 → 14

Up: 199 − 53 = 146
Down: 199 − 14 = 185
:::

:::answer-box
**SCAN total head movement = 331 cylinders.**
:::

## LOOK — SCAN without the pointless trip

LOOK is SCAN with one change: instead of travelling to the physical end of the
disk, the head **turns round after the last request in that direction**. It
"looks" ahead to see whether anything is left.

:::working
53 → 65 → 67 → 98 → 122 → 124 → 183 → 37 → 14

Up: 183 − 53 = 130
Down: 183 − 14 = 169
:::

:::answer-box
**LOOK total head movement = 299 cylinders.**
:::

LOOK is never worse than SCAN and usually better, because it saves the empty
run out to cylinder 199 and back. In practice, real systems use LOOK rather than
SCAN for exactly this reason.

## C-SCAN and C-LOOK — one direction only

Under SCAN, the cylinders in the middle get visited twice as often as those at
the edges, because the head passes through the middle on every sweep. The
**circular** versions fix that unfairness: they serve in one direction only, and
then jump straight back to the start without serving anything on the return.

:::working
**C-SCAN** — up to the end, jump to 0, continue up:

53 → 65 → 67 → 98 → 122 → 124 → 183 → **199** → **0** → 14 → 37

146 (up) + 199 (the jump back) + 37 (up again) = 382

**C-LOOK** — up to the last request, jump to the lowest request, continue up:

53 → 65 → 67 → 98 → 122 → 124 → 183 → **14** → 37

130 (up) + 169 (the jump back) + 23 (up again) = 322
:::

:::answer-box
**C-SCAN = 382 cylinders. C-LOOK = 322 cylinders.**
:::

The circular versions move *more* on this queue, and that is the honest answer:
they buy **fairer waiting times**, not less movement. Every cylinder waits at
most one full sweep, whereas under plain SCAN a request just behind the head has
to wait for the arm to go all the way out and come all the way back.

:::warning
**Count the return jump.** The usual convention — and Silberschatz's — counts the
199 → 0 jump as real head movement, which is why C-SCAN totals 382 here. Some
lecturers exclude it. Whichever you use, **state it in your answer**: an
unexplained 183 is a mark lost, while "excluding the return sweep, 183" is not.
:::

## All six together

| Algorithm | Total movement | Starvation possible? | Note |
|---|---|---|---|
| FCFS | 640 | No | Fair, slowest |
| SSTF | **236** | **Yes** | Fastest here |
| SCAN | 331 | No | Goes to the disk end |
| LOOK | 299 | No | Turns at the last request |
| C-SCAN | 382 | No | Uniform waiting time |
| C-LOOK | 322 | No | C-SCAN without the empty ends |

:::exam-tip
Numerical disk-scheduling questions are worth full marks for method plus
arithmetic. Always: (1) write the service order as a chain of arrows, (2) write
the individual distances, (3) add them, (4) state the total with units
("cylinders"). Two details decide many marks — the **starting direction** of the
head, which the question always gives and students often ignore, and whether
you counted the **return jump** in C-SCAN. And if the question asks you to
compare, say that SSTF is fastest *but can starve requests*; the comparison
mark is for the trade-off, not the number.
:::

:::practice-link
Practice variants for this topic arrive in Phase 4.
:::
