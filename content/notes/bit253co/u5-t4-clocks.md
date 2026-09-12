---
id: bit253co-u5-t4
type: topic_note
course: BIT253CO
syllabus_path: bit.s4.bit253co.u5.t4
syllabus_code: "5.d"
trust: ai_draft
---

# Clocks

:::idea
A clock is the simplest device in the machine — it does nothing but tick — and
the operating system could not function without it. Every time-slice that ends,
every alarm that fires, every timestamp on a file, and the very idea that one
process should stop so another can run, all come from those ticks.
:::

## What a clock actually is

A clock has three parts:

| Part | What it does |
|---|---|
| **Crystal oscillator** | Vibrates at a precise frequency when voltage is applied |
| **Counter** | Counts down the oscillations |
| **Holding register** | Holds the value the counter is reloaded with |

When the counter reaches zero it raises an **interrupt** — a *clock tick* — and
reloads from the holding register. Because the reload value is under software
control, the operating system chooses the tick rate.

There are two modes:

- **One-shot** — interrupt once, then stop. Used for a single timeout.
- **Square-wave** — reload automatically and interrupt forever. This is the mode
  that drives normal operation.

:::warning
Do not confuse the **programmable clock** with the **real-time clock** (RTC).
The programmable clock ticks for the OS and stops when the machine is off. The
RTC is battery-backed, keeps the date and time while the power is off, and is
read once at boot. A question about "how does the system know the time after a
reboot" is asking about the RTC.
:::

## What the clock driver does

The driver is short but does a surprising amount:

1. **Maintain the time of day.** Increment a counter every tick.
2. **Stop a process that has run too long.** Decrement its remaining quantum;
   when it hits zero, call the scheduler. **This is what makes preemptive
   scheduling possible.**
3. **Account for CPU usage.** Charge the tick to whichever process is running.
4. **Handle alarms** set by processes and by parts of the kernel.
5. **Provide watchdog timers** for the system itself.
6. **Gather profiling and statistics.**

Point 2 is the one to state first in an exam. Without a clock there is no
preemption, so round robin, SRTF and every quantum-based algorithm in
[2.f](#) become impossible.

## Keeping the time of day

A counter in ticks needs enough bits, and this is where the arithmetic questions
come from.

:::example{title="A 32-bit counter at 60 Hz"}
The clock ticks 60 times a second and the time-of-day counter is 32 bits, so it
can hold 2³² = 4 294 967 296 ticks.
:::

:::working
Seconds before it overflows:

    2³² ÷ 60 = 4 294 967 296 ÷ 60 = 71 582 788 seconds

In days:

    71 582 788 ÷ 86 400 = 828.5 days

In years:

    828.5 ÷ 365.25 ≈ 2.27 years
:::

:::answer-box
**A 32-bit tick counter at 60 Hz overflows after about 828 days — roughly 2.27
years.**
:::

That is far too short, so real systems use one of three fixes:

- A **64-bit** counter.
- Count in **seconds** in one counter and ticks-within-the-second in another.
- Count ticks **since boot** and store the boot time separately.

The third is the usual choice, and it has a neat property: setting the system
clock changes only the stored boot time, so elapsed-time measurements taken from
the tick counter are not disturbed.

## Ticks and the time quantum

:::working
A scheduler wants a 100 ms quantum and the clock runs at 60 Hz.

One tick = 1000 ÷ 60 = 16.67 ms

Ticks per quantum = 100 ÷ 16.67 = **6 ticks**
:::

:::answer-box
**At 60 Hz, a 100 ms quantum is 6 clock ticks.**
:::

The driver loads 6 into the process's counter and decrements it each tick. When
it reaches zero the process has used its slice.

:::warning
The tick rate is a real trade-off, and it is worth stating as one. A **faster**
clock gives finer timing and more responsive preemption, but every tick is an
interrupt, and interrupts cost CPU time. A **slower** clock wastes less but
makes timing coarse. Many modern kernels avoid the choice with a **tickless**
design: instead of ticking constantly, they program a one-shot interrupt for
whenever the next thing is actually due, which lets an idle laptop stop waking
up and saves real battery. [VERIFY: tickless kernels are standard in modern
Linux, but confirm whether your syllabus expects this detail.]
:::

## Soft timers

Many parts of the kernel want a timer, and giving each one its own hardware
timer is impossible. The standard solution is a **single sorted list** of
pending timeouts, each storing the *difference* from the one before it.

:::diagram{title="A difference list of pending timers"}
Three timers due at 4, 7 and 15 ticks from now are stored as 4, 3 and 8. Each
tick decrements only the head of the list.

```
 next signal    ┌───┐   ┌───┐   ┌───┐
   counter ───▶ │ 4 │──▶│ 3 │──▶│ 8 │
                └───┘   └───┘   └───┘
                 T1      T2      T3
```
:::

Storing differences means each tick only has to decrement **one** number, not
walk the whole list. When the head reaches zero its timer fires and the next
becomes the head.

:::exam-tip
Clock questions come in two shapes. **Descriptive**: list the clock driver's
duties — lead with maintaining the time of day and enforcing the quantum,
because those are the two every marking scheme wants.

**Numerical**: they give a tick rate and ask for ticks per quantum or an
overflow time. Show the division, keep the units at every line, and state the
answer in a human unit as well as the raw number — "71 582 788 seconds, about
2.27 years" earns more than the figure alone.
:::

:::practice-link
Practice variants for this topic arrive in Phase 4.
:::
