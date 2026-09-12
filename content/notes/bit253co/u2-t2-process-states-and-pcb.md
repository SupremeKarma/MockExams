---
id: bit253co-u2-t2
type: topic_note
course: BIT253CO
syllabus_path: bit.s4.bit253co.u2.t2
syllabus_code: "2.b"
trust: ai_draft
---

# Process model, process states and the PCB

:::idea
At any moment a process is doing one of three things: running, ready to run and
waiting for a turn, or blocked waiting for something else entirely. When the
operating system takes the CPU away, it has to write down everything the process
was doing so it can be resumed exactly where it stopped. That notebook is the
Process Control Block.
:::

## The process model

The model is simple and powerful: each process is an **independent sequential
program with its own virtual CPU**. It behaves as though it has a processor to
itself, and the operating system maintains that illusion by switching the real
CPU between them.

Conceptually, each process has its own program counter. In reality there is one
real program counter, and the OS saves and restores it — which is exactly what
the PCB is for.

## The three states

| State | Meaning |
|---|---|
| **Running** | Actually using the CPU right now |
| **Ready** | Able to run, waiting for the CPU |
| **Blocked** | Cannot run until some external event happens |

:::diagram{title="Transitions between the three states"}
```
                    ┌──────────┐
           ┌───1───▶│ Running  │───2───┐
           │        └──────────┘       │
           │              │            ▼
      ┌────┴────┐         3      ┌──────────┐
      │  Ready  │◀───4───────────│ Blocked  │
      └─────────┘                └──────────┘

  1  scheduler picks this process
  2  scheduler picks another process (quantum expired, or preempted)
  3  process blocks waiting for input
  4  the event it was waiting for has happened
```
:::

Four transitions, and the pairing is what gets tested:

1. **Ready → Running** — the scheduler dispatches it.
2. **Running → Ready** — it was preempted; still perfectly able to run.
3. **Running → Blocked** — it asked for something not yet available.
4. **Blocked → Ready** — the event arrived. Note it becomes **Ready**, not
   Running.

:::warning
Two transitions do **not** exist, and saying they do is a common error.

**Blocked → Running is impossible.** When the awaited event happens the process
becomes Ready and must wait its turn like everyone else — it does not jump
straight onto the CPU.

**Ready → Blocked is impossible.** A process can only block by *asking* for
something, and asking requires running.
:::

## Five states in practice

Most real systems add two more, and exam questions often use the five-state
model:

| State | Meaning |
|---|---|
| **New** | Being created; not yet admitted to the ready queue |
| Ready | |
| Running | |
| Blocked (waiting) | |
| **Terminated** | Finished, but its entry not yet cleaned up |

A process that has terminated but whose parent has not yet collected its exit
status is a **zombie** in UNIX. A process whose parent died before it did is an
**orphan**, and is adopted by `init`.

## The Process Control Block

The PCB — also called the process table entry — is the record the operating
system keeps for each process. It is what makes a context switch possible: save
the PCB, load another, and the CPU resumes a different process exactly where it
left off.

| Group | Contents |
|---|---|
| **Identification** | Process ID, parent PID, user ID |
| **State** | Current state, program counter, registers, stack pointer, program status word |
| **Scheduling** | Priority, queue pointers, time used, time limits |
| **Memory** | Pointers to text, data and stack segments; page or segment tables |
| **File** | Open file descriptors, root and working directory, umask |
| **Accounting** | CPU time used, start time, limits |
| **Signals** | Pending signals, signal handlers, masks |

:::warning
The PCB is stored in **kernel memory**, not in the process's own address space.
If a process could reach its own PCB it could change its priority or its user
ID, and the protection model would be worthless.
:::

## Context switching

A **context switch** is saving one process's state into its PCB and loading
another's.

:::working
What happens, in order:

1. An interrupt or system call moves the CPU into kernel mode.
2. The current process's registers and program counter are saved into its PCB.
3. Its state is changed — to Ready if preempted, to Blocked if waiting.
4. The scheduler chooses the next process.
5. That process's PCB is loaded: registers, program counter, memory map.
6. Its state becomes Running and execution resumes.
:::

:::warning
**A context switch is pure overhead.** No user work happens during it — the
system is only shuffling state. The cost is typically a few microseconds, and it
rises sharply on a machine with virtual memory because the TLB and caches are
full of the old process's entries and must be flushed or reloaded.

This is why the round-robin quantum cannot be tiny: if the quantum is 1 ms and
the switch costs 0.1 ms, roughly 10% of the CPU is spent switching.
:::

:::exam-tip
The state diagram is the most drawn diagram in this unit. Draw **three states
and four labelled transitions**, and label them with the *cause* — "quantum
expired", "waiting for I/O", "I/O completed" — not just numbers. Then say
explicitly that Blocked → Running and Ready → Blocked do not exist; that sentence
often carries its own mark.

For the PCB, group the fields rather than listing them randomly — identification,
state, scheduling, memory, files — because a grouped answer reads as
understanding and an unordered list reads as memorisation.
:::

:::practice-link
Practice variants for this topic arrive in Phase 4.
:::
