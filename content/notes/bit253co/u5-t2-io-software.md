---
id: bit253co-u5-t2
type: topic_note
course: BIT253CO
syllabus_path: bit.s4.bit253co.u5.t2
syllabus_code: "5.b"
trust: ai_draft
---

# Principles of input output software

:::idea
A program that prints should not care whether the printer is USB or network, or
whether the file is on a disk or a memory stick. I/O software is built in
**layers** so that each one hides a little more of the hardware, until the top
layer offers one simple idea: read and write, the same way, to anything.
:::

## What the software is trying to achieve

Four goals shape every design decision below.

**Device independence.** A program should work with any device of the right
kind. `sort < /dev/tty` and `sort < file.txt` should both work.

**Uniform naming.** A name should not depend on the device. UNIX mounts every
device into one file-system tree, so a path is just a path.

**Error handling.** Deal with errors **as close to the hardware as possible**. A
controller should retry a bad disk block itself; only if it truly cannot should
the layer above ever hear about it.

**Buffering.** Data usually cannot go straight from the device to its final
home, because it arrives at the wrong rate or in the wrong size.

Plus one design choice that runs through all of it: **synchronous or
asynchronous**. Physical I/O is asynchronous — the CPU starts it and an
interrupt says it finished — but programs are far easier to write synchronously.
So the operating system blocks the calling process and makes an asynchronous
device look synchronous.

## The four layers

This structure is the answer to most questions on this topic. Learn it as a
stack, top to bottom.

| Layer | Who runs it | What it does |
|---|---|---|
| **User-level I/O software** | The process | Library calls, spooling |
| **Device-independent OS software** | Kernel | Naming, protection, buffering, allocation |
| **Device drivers** | Kernel | Device-specific code |
| **Interrupt handlers** | Kernel | Wake the driver when the device finishes |

### Interrupt handlers — the bottom

Interrupts should be hidden so deeply that almost nobody knows about them. The
usual technique: the driver **blocks** itself after starting an operation, and
the interrupt handler simply **unblocks** it. All the handler does is wake
someone up.

### Device drivers

The only code that knows what the device actually is. A driver accepts abstract
requests — "read block 11 206" — and turns them into the controller's registers
and commands.

A driver must be **reentrant**, because a new request can arrive while it is
still handling the last one.

### Device-independent software

The largest layer and the one that does the real work:

- **Uniform interfacing** for drivers, so a new device needs no changes above.
- **Buffering** (below).
- **Error reporting** for errors the driver could not fix.
- **Allocating and releasing** dedicated devices.
- **Providing a device-independent block size**, so layers above see one size
  even when disks differ.

### User-level software

Library functions like `printf` that format data before calling the kernel, plus
**spooling**.

:::example{title="Spooling, and why it prevents a deadlock"}
If any process could open the printer directly, one could open it and then sit
idle for hours, and nobody else could print.

Instead, a process writes its output to a file in a **spool directory**. A single
**daemon** owns the printer and prints the files one at a time.

This is also deadlock **prevention**: it breaks the mutual-exclusion condition,
because the printer now has exactly one user and everyone else just writes
files.
:::

## Buffering

Buffering is where the marks usually are, because there are four schemes and
each fixes a problem with the one before it.

| Scheme | How it works | Problem |
|---|---|---|
| **Unbuffered** | Device writes straight to user space | A page fault mid-transfer is a disaster; user pages must stay pinned |
| **Single buffer** | Device fills a kernel buffer, then it is copied to the user | Nothing can arrive while that copy happens |
| **Double buffer** | Two buffers: fill one while the other is copied | Still stalls under bursts |
| **Circular buffer** | A ring of buffers, producer and consumer chase each other | The general solution for fast devices |

:::warning
Buffering is not free — every scheme adds a **copy**, and copying is expensive
at network speeds. A rule worth quoting: buffering helps, but too much buffering
hurts, because the extra copy can cost more than the wait it removed. Modern
systems avoid this with "zero-copy" techniques where the data never moves.
:::

:::diagram{title="Double buffering"}
While the device fills buffer B, the kernel copies buffer A to the user. Then
they swap. Neither side has to wait for the other.

```
   device ──▶ [ buffer A ] ──▶ user        (copying)
   device ──▶ [ buffer B ]                 (filling)
                  swap
```
:::

## Blocking, non-blocking and asynchronous

Three ways a program can ask for I/O, and they are easy to confuse:

- **Blocking** — the call returns only when the data is there. Simple; the
  process sleeps.
- **Non-blocking** — the call returns immediately with however much was
  available, possibly nothing.
- **Asynchronous** — the call returns immediately, the transfer continues in the
  background, and the process is notified when it is done.

:::warning
Non-blocking and asynchronous are **not** the same. Non-blocking returns
*partial results now*. Asynchronous returns *nothing now* and delivers the whole
result later. Questions ask for this difference by name.
:::

:::exam-tip
"Explain the layers of I/O software" is the standard question. Draw the four
layers as a stack **top to bottom**, name each, and give one sentence and one
example per layer — spooling for user-level, buffering for device-independent,
"turns read block 11206 into controller commands" for drivers, "unblocks the
driver" for interrupt handlers.

If the question mentions buffering specifically, give all four schemes in order
and say what each fixes. And always name the four goals — device independence,
uniform naming, error handling, buffering — because they are frequently a
sub-question of their own.
:::

:::practice-link
Practice variants for this topic arrive in Phase 4.
:::
