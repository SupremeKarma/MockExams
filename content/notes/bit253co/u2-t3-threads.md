---
id: bit253co-u2-t3
type: topic_note
course: BIT253CO
syllabus_path: bit.s4.bit253co.u2.t3
syllabus_code: "2.c"
trust: ai_draft
---

# Threads

:::idea
A process is one worker with its own office. Sometimes you want several workers
sharing one office — same filing cabinet, same desk, but each doing a different
job at their own pace. Those workers are threads. They share the process's
memory, which makes them cheap to create and fast to switch between, and also
means one of them can wreck the work of the others.
:::

## Why threads exist

A word processor could be one process. But it must reformat the document,
respond to typing, and autosave to disk — and if it does those in sequence,
typing freezes while it saves.

Three arguments for threads, and they are the standard answer:

1. **Responsiveness.** One thread can block on disk while another keeps
   handling the keyboard.
2. **Cheapness.** Creating a thread is far faster than creating a process,
   because there is no new address space to build.
3. **Real parallelism.** On a multi-core machine, threads of one process can run
   on different cores at the same time.

## What is shared and what is not

This table is the single most examinable thing in the topic.

| Shared by all threads in a process | Private to each thread |
|---|---|
| Address space (code, data, heap) | **Program counter** |
| Global variables | **Registers** |
| Open files | **Stack** |
| Child processes | **State** (running, ready, blocked) |
| Signals and handlers | |
| Accounting information | |

The rule behind the table: a thread needs its own **execution context** — where
it is and what it is doing — and shares everything else.

:::warning
Each thread needs its **own stack** because each is at a different point in a
different chain of function calls. A shared stack would corrupt immediately.

And because the heap and globals **are** shared, two threads writing the same
variable is a race condition — which is why [2.d](#) exists. Threads buy speed
and pay for it in synchronisation.
:::

:::warning
**There is no protection between threads.** The operating system protects
processes from each other, but threads of one process share memory by design, so
one thread can overwrite another's data. This is not a bug in the design — it is
the point. Threads are meant to cooperate, and the programmer is responsible for
keeping them out of each other's way.
:::

## User-level threads

The kernel knows nothing about them. The whole thread package is a library
inside the process, and each process keeps its own **thread table**.

**Advantages**

- **Very fast switching** — just save and restore registers. No trap into the
  kernel at all, often ten to a hundred times faster.
- **Work on any operating system**, including ones with no thread support.
- Each process can use its **own scheduling algorithm**.

**Disadvantages**

- **A blocking system call blocks the whole process.** The kernel sees one
  thread; if that thread blocks on disk, every thread in the process stops.
- **No true parallelism** — the kernel schedules the process onto one CPU, so
  the threads cannot use several cores.
- A thread that never yields keeps the CPU forever, because there is no clock
  interrupt to preempt it within the process.

## Kernel-level threads

The kernel knows about every thread and keeps the thread table itself.

**Advantages**

- **A blocking call blocks only that thread**; the others keep running.
- **True parallelism** across cores.

**Disadvantages**

- **Switching costs a trap into the kernel** — much slower.
- Creating and destroying threads is more expensive, so systems often recycle
  them through a **thread pool**.

## Side by side

| | User-level | Kernel-level |
|---|---|---|
| Kernel aware? | No | Yes |
| Thread table in | The process | The kernel |
| Switching cost | Very low | Higher (a trap) |
| Blocking call | Blocks **all** threads | Blocks **one** thread |
| Multi-core | No | Yes |
| Scheduling | Per-process, custom | Kernel's algorithm |

## Hybrid implementations

Since each has the other's weakness, systems multiplex **user threads onto kernel
threads**, which gives cheap switching plus real blocking and parallelism.

| Model | Meaning |
|---|---|
| **Many-to-one** | Many user threads on one kernel thread — pure user-level |
| **One-to-one** | Each user thread has a kernel thread — Linux, Windows |
| **Many-to-many** | m user threads onto n kernel threads — the hybrid |

## Two complications worth naming

**`fork()` in a multithreaded process** — does the child get all the threads or
only the one that called fork? Most systems provide both variants, and the
answer depends on whether `exec` follows immediately.

**Signals** — a signal arrives for the *process*, but which thread should handle
it? The usual rule is that each thread has a signal mask and the signal is
delivered to any thread not blocking it.

:::exam-tip
"Differentiate between process and thread" and "compare user-level and
kernel-level threads" are both near-certain questions. For the first, lead with
**threads share an address space, processes do not**, then give the shared/private
table.

For the second, the deciding line is the **blocking system call**: user-level
blocks every thread, kernel-level blocks only one. If you write nothing else,
write that — it is the difference the whole comparison turns on.
:::

:::practice-link
Practice variants for this topic arrive in Phase 4.
:::
