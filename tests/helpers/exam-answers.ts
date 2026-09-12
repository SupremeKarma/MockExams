/**
 * Assertions for verifying the numeric answers inside notes.
 *
 * ## The rule these encode
 *
 * **Check that the note's answer is LEGAL, not that it equals ours.**
 *
 * Most operating-systems numericals are under-specified on purpose. The
 * detection algorithm says "find *an* index i". SJF and SSTF do not say which
 * of two equally-good candidates to pick. Page replacement does not say which
 * of two pages tying on the replacement criterion to evict. Textbooks, lecturers
 * and exam markers all break those ties differently, and every one of them is
 * correct.
 *
 * A test that asserts equality with one particular implementation's output will
 * therefore fail notes that are right. That is worse than useless: it burns a
 * debugging session, and the usual resolution is to "fix" the note to match the
 * test — which quietly teaches a student that one arbitrary tie-break is the
 * rule.
 *
 * So each helper below takes the answer the NOTE prints and asks whether an
 * examiner could accept it. Where ties genuinely cannot arise, the answer is
 * unique and the helper says so.
 *
 * ## The negative control
 *
 * Every "is it legal?" check needs a companion assertion that something
 * illegal is rejected. A predicate that returns true for everything passes just
 * as happily as a correct one. `expectRejects` exists to make that cheap, and
 * the convention is that each note's test uses it at least once.
 */

import { expect } from "vitest";

export type Vector = number[];

export function lessOrEqual(a: Vector, b: Vector): boolean {
  return a.every((value, i) => value <= b[i]);
}

export function addInto(target: Vector, addend: Vector): Vector {
  return target.map((v, i) => v + addend[i]);
}

// ---------------------------------------------------------------------------
// Resource allocation: deadlock detection and Banker's safety
// ---------------------------------------------------------------------------

export interface ResourceState {
  available: Vector;
  allocation: Vector[];
  /**
   * Detection uses the current `Request` matrix; Banker's safety uses `Need`
   * (`Max − Allocation`). The shapes are identical, which is exactly why they
   * get confused — pass whichever the question is actually about.
   */
  demand: Vector[];
}

/**
 * Can every process finish, in the specific order given?
 *
 * This is the assertion for a note that prints a completion or safe sequence.
 * There are usually several valid ones; the note only has to print one that
 * works.
 */
export function isLegalCompletionSequence(state: ResourceState, order: number[]): boolean {
  const { available, allocation, demand } = state;
  if (order.length !== allocation.length) return false;

  let work = [...available];
  const done = new Set<number>();

  for (const i of order) {
    if (i < 0 || i >= allocation.length) return false;
    if (done.has(i)) return false;              // a process cannot finish twice
    if (!lessOrEqual(demand[i], work)) return false;  // it could not have run here
    work = addInto(work, allocation[i]);
    done.add(i);
  }

  return done.size === allocation.length;
}

/** Which processes cannot finish under any order. This answer IS unique. */
export function deadlockedProcesses(state: ResourceState): number[] {
  const { available, allocation, demand } = state;
  let work = [...available];
  const finish = allocation.map((row) => row.every((v) => v === 0));

  let progressed = true;
  while (progressed) {
    progressed = false;
    for (let i = 0; i < allocation.length; i += 1) {
      if (finish[i] || !lessOrEqual(demand[i], work)) continue;
      work = addInto(work, allocation[i]);
      finish[i] = true;
      progressed = true;
    }
  }

  return finish.flatMap((f, i) => (f ? [] : [i]));
}

/**
 * Whether a deadlock exists, and who is in it.
 *
 * Note the asymmetry with the sequence above: WHICH processes are deadlocked is
 * not a matter of tie-breaking — it is the same set whatever order you try — so
 * a note may be checked against it exactly.
 */
export function assertDeadlockSet(state: ResourceState, expected: number[]): void {
  expect(deadlockedProcesses(state).sort()).toEqual([...expected].sort());
}

// ---------------------------------------------------------------------------
// CPU scheduling: SJF, SRTF, FCFS, priority
// ---------------------------------------------------------------------------

export interface Job {
  id: string;
  arrival: number;
  burst: number;
}

export interface ScheduleSlice {
  id: string;
  start: number;
  end: number;
}

/**
 * Is this Gantt chart a legal run of a shortest-job-style policy?
 *
 * Checked as a set of properties rather than by re-simulating, because
 * re-simulating bakes in one tie-break:
 *
 *   - no gap while a job is waiting, and no overlap;
 *   - nothing runs before it arrives;
 *   - every job's slices sum to its burst;
 *   - at each dispatch the chosen job's remaining time is MINIMAL among the
 *     jobs available then — equal remaining times are all acceptable.
 *
 * `preemptive` distinguishes SRTF (a dispatch decision at every arrival) from
 * SJF (decisions only when the CPU frees up).
 */
export function isLegalShortestJobSchedule(
  jobs: Job[],
  slices: ScheduleSlice[],
  { preemptive }: { preemptive: boolean }
): { ok: true } | { ok: false; reason: string } {
  const byId = new Map(jobs.map((j) => [j.id, j]));
  const remaining = new Map(jobs.map((j) => [j.id, j.burst]));

  const ordered = [...slices].sort((a, b) => a.start - b.start);

  for (let i = 0; i < ordered.length; i += 1) {
    const slice = ordered[i];
    const job = byId.get(slice.id);
    if (!job) return { ok: false, reason: `slice for unknown job ${slice.id}` };
    if (slice.end <= slice.start) return { ok: false, reason: `empty slice for ${slice.id}` };
    if (slice.start < job.arrival) {
      return { ok: false, reason: `${slice.id} runs at ${slice.start} but arrives at ${job.arrival}` };
    }

    const previous = ordered[i - 1];
    if (previous && slice.start < previous.end) {
      return { ok: false, reason: `slices overlap at ${slice.start}` };
    }

    // Was this the shortest remaining job available at dispatch time?
    const availableNow = jobs.filter(
      (j) => j.arrival <= slice.start && (remaining.get(j.id) ?? 0) > 0
    );
    const best = Math.min(...availableNow.map((j) => remaining.get(j.id) ?? Infinity));
    const chosen = remaining.get(slice.id) ?? 0;
    if (availableNow.length > 0 && chosen > best) {
      return {
        ok: false,
        reason: `${slice.id} (remaining ${chosen}) ran at ${slice.start} while a job with ${best} was waiting`,
      };
    }

    // Idle time is only legal when nothing had arrived.
    if (previous && slice.start > previous.end) {
      const waiting = jobs.some(
        (j) => j.arrival <= previous.end && (remaining.get(j.id) ?? 0) > 0
      );
      if (waiting) return { ok: false, reason: `CPU idle at ${previous.end} with work waiting` };
    }

    // A preemptive policy must also react to arrivals DURING a slice, not only
    // at dispatch. Checking dispatch alone accepts plain FCFS as SRTF: nothing
    // shorter exists at t=0, so running one job to completion looks legal even
    // though a shorter job arrived at t=1 and should have taken the CPU.
    if (preemptive) {
      for (const arriving of jobs) {
        if (arriving.id === slice.id) continue;
        if (arriving.arrival <= slice.start || arriving.arrival >= slice.end) continue;
        if ((remaining.get(arriving.id) ?? 0) <= 0) continue;

        const runningLeft = chosen - (arriving.arrival - slice.start);
        if ((remaining.get(arriving.id) ?? 0) < runningLeft) {
          return {
            ok: false,
            reason:
              `${arriving.id} arrived at ${arriving.arrival} needing ` +
              `${remaining.get(arriving.id)} while ${slice.id} had ${runningLeft} left, ` +
              "so it should have preempted",
          };
        }
      }
    }

    const ran = slice.end - slice.start;
    remaining.set(slice.id, chosen - ran);
    if ((remaining.get(slice.id) ?? 0) < 0) {
      return { ok: false, reason: `${slice.id} ran longer than its burst` };
    }

    // A non-preemptive policy must run a job to completion once started.
    if (!preemptive && (remaining.get(slice.id) ?? 0) > 0) {
      return { ok: false, reason: `${slice.id} was preempted under a non-preemptive policy` };
    }
  }

  for (const [id, left] of remaining) {
    if (left !== 0) return { ok: false, reason: `${id} has ${left} units unexecuted` };
  }

  return { ok: true };
}

/**
 * Average waiting and turnaround time.
 *
 * These ARE unique even when the schedule is not: every legal tie-break of SJF
 * or SRTF produces the same averages, which is why exam questions ask for them.
 * So a note's stated averages may be checked exactly.
 */
export function scheduleAverages(
  jobs: Job[],
  slices: ScheduleSlice[]
): { averageWaiting: number; averageTurnaround: number } {
  let waiting = 0;
  let turnaround = 0;

  for (const job of jobs) {
    const mine = slices.filter((s) => s.id === job.id);
    const completion = Math.max(...mine.map((s) => s.end));
    const t = completion - job.arrival;
    turnaround += t;
    waiting += t - job.burst;
  }

  return {
    averageWaiting: waiting / jobs.length,
    averageTurnaround: turnaround / jobs.length,
  };
}

// ---------------------------------------------------------------------------
// Disk scheduling: FCFS, SSTF, SCAN, LOOK
// ---------------------------------------------------------------------------

/** Total head movement for a service order. Unique once the order is fixed. */
export function headMovement(start: number, order: number[]): number {
  let total = 0;
  let at = start;
  for (const cylinder of order) {
    total += Math.abs(cylinder - at);
    at = cylinder;
  }
  return total;
}

/**
 * Is this a legal SSTF service order?
 *
 * SSTF says "closest request next" and is silent on a tie — a head at 20 with
 * requests at 10 and 30 may legally go either way, and the two choices lead to
 * different total movement. So the order is checked for legality, and the
 * note's total is then checked against ITS OWN order.
 */
export function isLegalSstfOrder(start: number, requests: number[], order: number[]): boolean {
  if (order.length !== requests.length) return false;

  const pending = [...requests];
  let at = start;

  for (const next of order) {
    const index = pending.indexOf(next);
    if (index === -1) return false;

    const best = Math.min(...pending.map((r) => Math.abs(r - at)));
    if (Math.abs(next - at) !== best) return false; // a closer request existed

    pending.splice(index, 1);
    at = next;
  }

  return pending.length === 0;
}

// ---------------------------------------------------------------------------
// Page replacement: FIFO, LRU, Optimal
// ---------------------------------------------------------------------------

/**
 * Fault count for a replacement policy.
 *
 * The COUNT is unique for FIFO and LRU. For Optimal it is unique too, even
 * though the victim may not be: when two pages are never used again, evicting
 * either gives the same number of faults. So count the faults exactly, and use
 * `isLegalOptimalVictim` if a note names a specific victim.
 */
export function countFaults(
  references: number[],
  frames: number,
  policy: "fifo" | "lru" | "optimal"
): number {
  const memory: number[] = [];
  const arrival = new Map<number, number>();
  const lastUsed = new Map<number, number>();
  let faults = 0;

  references.forEach((page, time) => {
    if (memory.includes(page)) {
      lastUsed.set(page, time);
      return;
    }

    faults += 1;

    if (memory.length < frames) {
      memory.push(page);
    } else {
      let victim: number;
      if (policy === "fifo") {
        victim = memory.reduce((a, b) => ((arrival.get(a) ?? 0) <= (arrival.get(b) ?? 0) ? a : b));
      } else if (policy === "lru") {
        victim = memory.reduce((a, b) =>
          (lastUsed.get(a) ?? -1) <= (lastUsed.get(b) ?? -1) ? a : b
        );
      } else {
        const nextUse = (p: number) => {
          const i = references.indexOf(p, time + 1);
          return i === -1 ? Infinity : i;
        };
        victim = memory.reduce((a, b) => (nextUse(a) >= nextUse(b) ? a : b));
      }
      memory[memory.indexOf(victim)] = page;
    }

    arrival.set(page, time);
    lastUsed.set(page, time);
  });

  return faults;
}

/**
 * Could Optimal legally evict this page here?
 *
 * Legal when no page currently in memory is used later than the victim — so
 * every page tying on "never used again" is an acceptable answer.
 */
export function isLegalOptimalVictim(
  references: number[],
  memory: number[],
  time: number,
  victim: number
): boolean {
  if (!memory.includes(victim)) return false;

  const nextUse = (page: number) => {
    const index = references.indexOf(page, time + 1);
    return index === -1 ? Infinity : index;
  };

  return nextUse(victim) >= Math.max(...memory.map(nextUse));
}

// ---------------------------------------------------------------------------
// Shared
// ---------------------------------------------------------------------------

/**
 * Assert a predicate rejects something that is genuinely wrong.
 *
 * The companion to every legality check. A predicate that returns true for all
 * input passes a suite exactly as quietly as a correct one, and this is the
 * cheapest way to prove it does not.
 */
export function expectRejects<T>(
  predicate: (value: T) => boolean | { ok: boolean },
  illegal: T,
  why: string
): void {
  const result = predicate(illegal);
  const ok = typeof result === "boolean" ? result : result.ok;
  expect(ok, `predicate should have rejected ${why}`).toBe(false);
}

/** Pull the `:::answer-box` bodies out of a note, in document order. */
export function answerBoxes(source: string): string[] {
  const out: string[] = [];
  const re = /:::answer-box\b[^\n]*\n([\s\S]*?)\n:::/g;
  let match: RegExpExecArray | null;
  while ((match = re.exec(source)) !== null) out.push(match[1].trim());
  return out;
}
