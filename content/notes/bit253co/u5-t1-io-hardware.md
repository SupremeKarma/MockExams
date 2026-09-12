---
id: bit253co-u5-t1
type: topic_note
course: BIT253CO
syllabus_path: bit.s4.bit253co.u5.t1
syllabus_code: "5.a"
trust: ai_draft
---

# Principles of input output hardware

:::idea
A keyboard, a disk and a network card have nothing in common electrically, yet
the operating system has to talk to all of them. It does that through a
**controller** — a small circuit board that speaks the device's language on one
side and a simple set of registers on the other. The operating system only ever
talks to the registers.
:::

## Devices and their controllers

An I/O unit has two parts, and the split is the reason an operating system can
support hardware it was never written for.

| Part | What it is |
|---|---|
| **The device** | The mechanical or electrical thing — platters, keys, a radio |
| **The controller** | A chip or card that drives the device and exposes registers |

The controller hides the messy detail. A disk controller accepts "read sector
11 206 into this buffer" and deals with the serial bit stream, the preamble, the
error-correcting code and the retries itself. The operating system never sees
any of that.

Devices split into two broad kinds, and the distinction runs through the whole
unit:

| Kind | Transfers | Addressable? | Examples |
|---|---|---|---|
| **Block device** | Fixed-size blocks | Yes — each block has an address | Disk, USB drive |
| **Character device** | A stream of characters | No | Keyboard, mouse, printer, network |

:::warning
Clocks fit neither category. A clock is not addressable and delivers no
character stream — it just causes interrupts at intervals. Some textbooks call
it a third kind of device. If a question asks you to classify devices, mention
the exception; it shows you understand the categories rather than reciting them.
:::

## Talking to a controller

Each controller has a few registers: one to be given commands, one to report
status, and usually a data buffer. There are two ways the CPU can reach them.

### Port-mapped I/O

Registers live in a **separate I/O address space**, reached with special
instructions (`IN`, `OUT` on x86). I/O port 0x3F8 and memory address 0x3F8 are
different places.

### Memory-mapped I/O

Registers are mapped into the **normal memory address space**. The CPU reads and
writes them with ordinary load and store instructions.

| | Memory-mapped | Port-mapped |
|---|---|---|
| Instructions needed | Ordinary loads and stores | Special I/O instructions |
| Device drivers | Can be written entirely in C | Usually need assembly |
| Protection | Ordinary page-table protection | Needs a separate mechanism |
| Caching | **Must be disabled for those pages** | Not an issue |

:::warning
The caching problem is the classic memory-mapped catch. If the CPU caches a
device's status register, it will read a **stale** value forever — the device
changed the register, but the CPU keeps returning the cached copy and never
notices the operation finished. The hardware must be told those pages are
uncacheable.
:::

## Three ways to move the data

This is the heart of the topic and the most likely thing to be asked. Each
method is a different answer to "who does the copying?".

### 1. Programmed I/O (polling)

The CPU does everything. It writes a byte, then **loops reading the status
register** until the device says it is ready, then writes the next byte.

Simple, and it wastes the entire CPU on one slow device. Printing a page this
way occupies the processor for the whole page.

### 2. Interrupt-driven I/O

The CPU starts the operation and **blocks the calling process**, then goes and
runs something else. When the device is ready it raises an **interrupt**; the
CPU stops, runs the interrupt handler, transfers the next byte, and returns to
what it was doing.

Far better than polling, but there is still an interrupt **per byte or per
character**, and each one costs a context switch.

### 3. Direct memory access (DMA)

A **DMA controller** is given a memory address, a device address, a count and a
direction — then it moves the whole block itself, without the CPU. Only when the
entire transfer is finished does it raise **one interrupt**.

:::diagram{title="Who copies the bytes"}
```
Programmed I/O    CPU ⟷ controller ⟷ device      CPU busy the whole time
Interrupt-driven  CPU ⟷ controller ⟷ device      one interrupt per byte
DMA               DMA ⟷ controller ⟷ device      one interrupt per block
                   ↕
                 memory
```
:::

| | Programmed | Interrupt-driven | DMA |
|---|---|---|---|
| CPU involvement | Constant | Once per byte | Once per block |
| Interrupts | None | Many | One |
| Extra hardware | None | None | DMA controller |
| Good for | Tiny transfers | Slow character devices | Disks, networks |

:::warning
DMA is not free. The DMA controller and the CPU compete for the memory bus —
**cycle stealing** — so a large transfer slows the CPU down even though it is
not doing the copying. DMA also needs *physical* addresses, which is why a
driver must pin pages in memory before starting a transfer.
:::

## What happens when an interrupt arrives

Worth knowing as a sequence, because questions ask for it directly:

1. The controller raises a signal on the interrupt line.
2. The CPU finishes the current instruction, then saves the program counter and
   status word.
3. It uses the **interrupt vector** to find the handler's address.
4. The handler runs, acknowledges the interrupt, and does the work.
5. State is restored and the interrupted process continues.

**Precise interrupts** leave the machine in a clean state — the program counter
is saved, all instructions before it have completed, none after it has started.
Pipelined and superscalar CPUs make this genuinely hard, and some provide only
*imprecise* interrupts, which pushes the mess into the operating system.

:::exam-tip
"Explain the principles of I/O hardware" is usually 6 to 8 marks and wants three
things: the **device/controller split**, the **two addressing schemes**
(memory-mapped vs port-mapped, with one advantage each), and the **three
transfer methods** with a clear statement of who does the copying.

If you can only remember one comparison, make it programmed vs interrupt-driven
vs DMA, and give the interrupt count for each — that single row is what
demonstrates you understand the progression.
:::

:::practice-link
Practice variants for this topic arrive in Phase 4.
:::
