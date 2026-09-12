---
id: bit253co-u6-t5
type: topic_note
course: BIT253CO
syllabus_path: bit.s4.bit253co.u6.t5
syllabus_code: "6.e"
trust: ai_draft
---

# Deadlock avoidance and prevention

:::idea
Two ways to make sure a deadlock never happens. **Prevention** changes the rules
so one of the four conditions can never hold — a structural fix, applied once.
**Avoidance** keeps the rules but checks every single request before granting
it, refusing any that could lead to trouble. Prevention is blunt and cheap;
avoidance is careful and expensive.
:::

## Prevention: break one of the four

A deadlock needs all four of Coffman's conditions at once, so making any one of
them impossible is enough. Each attack works, and each costs something.

### Break mutual exclusion

Make resources sharable so processes never have to wait.

Usually impossible — a printer cannot serve two jobs at once. The one real
technique is **spooling**: processes write to a spool file instead of the
device, and a single daemon owns the device. Read-only files are naturally
sharable and can never deadlock.

**Cost:** most devices simply cannot be shared. The spool disk can itself fill
up and deadlock.

### Break hold and wait

Never let a process hold one resource while waiting for another. Two ways:

- **Request everything at the start.** A process gets all its resources at once
  or none at all.
- **Release before requesting.** A process must give up everything it holds
  before asking for more.

**Cost:** dreadful utilisation — a process holds a printer for its whole run
even if it prints for one second at the end. And **starvation**: a process
needing several popular resources may never find them all free at once.

### Break no preemption

If a process requests something unavailable, take away everything it currently
holds and restart it later.

**Cost:** only works for resources whose state can be saved and restored — CPU
registers, memory. You cannot preempt a printer mid-page.

### Break circular wait

**Impose a total ordering on all resource types** and require every process to
request in increasing order. A process holding resource *i* may only request
resource *j* if *j > i*.

This is the only one real systems use widely. Operating-system kernels and
database engines assign lock ranks and require code to acquire in rank order,
precisely because it is cheap to enforce and easy to audit.

**Cost:** programs must be written to respect the ordering, which is not always
natural.

:::warning
Why the ordering works: a cycle requires at least one process holding a
higher-numbered resource while requesting a lower-numbered one. If every process
only ever requests upward, no such process exists, so no cycle can form. Say
*why*, not just *what* — the reasoning is usually worth a mark.
:::

## Avoidance: check before granting

Avoidance keeps all four conditions but never lets the system enter a state from
which deadlock could follow. It needs one extra piece of information up front:
**the maximum resources each process will ever need**.

### Safe and unsafe states

A state is **safe** if there is at least one order in which every process can
finish — a **safe sequence**. Give the first process everything it still needs,
let it finish and return what it held, use that larger pool for the next, and so
on.

:::warning
**An unsafe state is not a deadlock.** It is a state from which deadlock has
become possible. The system might still get lucky if processes ask for less than
their maximum. Avoidance simply refuses to gamble.

The relationship is: **deadlock ⊂ unsafe ⊂ all states.** Every deadlocked state
is unsafe; not every unsafe state is deadlocked.
:::

### A single-resource example

:::example{title="Twelve tape drives, three processes"}
A system has **12** tape drives.

| Process | Holds now | Maximum need | Still needs |
|---|---|---|---|
| P0 | 5 | 10 | 5 |
| P1 | 2 | 4 | 2 |
| P2 | 2 | 9 | 7 |

Allocated: 5 + 2 + 2 = 9, so **3 drives are free**.
:::

:::working
Free = 3.

**P1** still needs 2, and 2 ≤ 3. Give it 2, let it finish, get back all 4 it
then holds.
    Free = 3 − 2 + 4 = **5**

**P0** still needs 5, and 5 ≤ 5. Give it 5, let it finish, get back 10.
    Free = 5 − 5 + 10 = **10**

**P2** still needs 7, and 7 ≤ 10. Give it 7, let it finish, get back 9.
    Free = 10 − 7 + 9 = **12**

All three finished, and all 12 drives are back.
:::

:::answer-box
**The state is SAFE.** A safe sequence is ⟨P1, P0, P2⟩.
:::

Now suppose P2 asks for **one more drive** and the system grants it.

:::working
P2 now holds 3 and still needs 6. Allocated = 10, so **free = 2**.

**P0** needs 5 — more than 2. No.
**P1** needs 2, and 2 ≤ 2. Give it 2, let it finish, get back 4.
    Free = 2 − 2 + 4 = **4**

**P0** needs 5 — more than 4. No.
**P2** needs 6 — more than 4. No.

Nothing else can run.
:::

:::answer-box
**Granting that single drive makes the state UNSAFE.** Only P1 could finish;
P0 and P2 would be stuck. Avoidance therefore **refuses the request**, even
though a drive was free.
:::

That refusal is the entire point of avoidance, and it is the part students find
counter-intuitive: the resource was available and the system still said no.

## Comparing the two

| | Prevention | Avoidance |
|---|---|---|
| **When it acts** | Once, by design | Before every request |
| **Needs to know** | Nothing extra | Each process's maximum need |
| **Method** | Break a condition | Keep the state safe |
| **Cost** | Poor utilisation | Expensive check, O(m × n²) |
| **Example** | Resource ordering | Banker's Algorithm |

:::exam-tip
"Differentiate between deadlock prevention and avoidance" is a standard
question. The one-line answer: **prevention removes a necessary condition;
avoidance keeps them all but refuses unsafe requests.** Then give one technique
each — resource ordering, and Banker's.

If the question gives a table of allocations and maximums, it wants the safe
sequence. Compute **still needs = maximum − holds**, state the free pool, and
walk the processes showing the free pool after each. State the sequence
explicitly and say "safe" or "unsafe" in words. And remember that unsafe does
not mean deadlocked — saying so earns the mark that separates the top answers.
:::

:::practice-link
Practice variants for this topic arrive in Phase 4.
:::
