---
id: bit253co-u2-t1
type: topic_note
course: BIT253CO
syllabus_path: bit.s4.bit253co.u2.t1
syllabus_code: "2.a"
trust: ai_draft
---

# Introduction to processes

:::idea
A program is a file sitting on disk — dead text. A process is that program
actually running: the instructions plus everything the machine currently
remembers about it. One program can be running four times at once, and those are
four separate processes that know nothing about each other.
:::

## Program versus process

This distinction is worth getting exactly right, because almost every question
in this unit rests on it.

| | Program | Process |
|---|---|---|
| What it is | A file of instructions | A program in execution |
| State | **Passive** — it just sits there | **Active** — it has a current state |
| Lifetime | Until deleted | From start until it exits |
| Copies | One file | Many processes from one program |
| Contains | Code | Code, data, stack, heap, registers, PC |

:::example{title="One program, three processes"}
Three people are logged into a machine and all three run `gcc` at the same
moment.

There is **one** copy of gcc on disk. There are **three** processes: each has
its own memory, its own position in the code, its own open files, and its own
place in the ready queue. One crashing does not affect the others.
:::

## What a process is made of

A process is more than its instructions. It owns:

- **Text section** — the program code.
- **Data section** — global variables.
- **Heap** — memory allocated while running.
- **Stack** — local variables, parameters, return addresses.
- **Program counter** — the address of the next instruction.
- **Registers** — the CPU's working values.

The last two matter more than they look: they are what must be saved and
restored when the process is stopped and later resumed.

## The illusion of parallelism

A single CPU can only run one instruction stream at a time. Yet a machine
appears to run a browser, a music player and a compiler simultaneously.

The trick is speed. The operating system switches between processes many times a
second, and each runs for a few milliseconds. That is **multiprogramming**, and
the appearance it creates is called **pseudo-parallelism**.

:::warning
Distinguish real from apparent parallelism. **Multiprogramming** is rapid
switching on one CPU — only one process is genuinely executing at any instant.
**Multiprocessing** is several CPUs or cores, where processes really do run at
the same time. Exam answers that use the words interchangeably lose marks.
:::

A consequence worth internalising: **a process's progress is not reproducible.**
Run the same program twice and it may take different amounts of real time,
because it depends on what else was competing for the CPU. A program must never
assume anything about timing.

## How processes are created

Four events create a process:

1. **System initialisation** — the processes started at boot.
2. **A running process makes a system call** to create another.
3. **A user request** — clicking an icon, typing a command.
4. **A batch job** being started.

Background processes that are not associated with any user — handling mail, web
pages, printing — are called **daemons**.

In UNIX, creation is `fork()`, which makes an almost identical **copy** of the
calling process. The copy usually then calls `exec()` to replace its memory with
a different program. Windows does it in one call, `CreateProcess`, which handles
both.

:::warning
`fork()` returns **twice** — once in the parent, with the child's process id,
and once in the child, with 0. That is how the two halves of the same code tell
which one they are. It is a favourite exam question and a genuinely strange idea
the first time you meet it.
:::

## How processes end

- **Normal exit** (voluntary) — the work finished.
- **Error exit** (voluntary) — the process found a problem and quit.
- **Fatal error** (involuntary) — a bug: dividing by zero, bad memory access.
- **Killed by another process** (involuntary) — a `kill` signal.

## The process hierarchy

In UNIX a process and its children form a **process group**, and the whole system
is one tree descending from `init` (or `systemd`), the first process. A signal
sent to a group goes to every member.

Windows has no hierarchy. A parent gets a handle to its child, but that handle
can be passed to another process, so there is no permanent parent-child
relationship.

:::exam-tip
"Differentiate between a program and a process" is a guaranteed 2 to 4 marks.
Give the one-line definition — a process is a program in execution — then the
passive/active contrast and the one-program-many-processes point with an
example.

If the question is longer, add what a process owns (code, data, stack, PC,
registers), the four creation events, and the four termination causes. Naming
`fork`/`exec` for UNIX and `CreateProcess` for Windows shows you know the real
systems and not just the theory.
:::

:::practice-link
Practice variants for this topic arrive in Phase 4.
:::
