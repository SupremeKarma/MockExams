/**
 * Tests for the answer-checking helpers.
 *
 * These matter more than they look. Every helper in exam-answers.ts is a
 * predicate the note tests trust, and a predicate that returns `true` for
 * everything passes a suite exactly as quietly as a correct one. The whole
 * point of the "legal, not identical" rule is lost if the legality check is
 * itself broken — so each helper is tested on something it must ACCEPT and
 * something it must REJECT.
 */

import { describe, expect, it } from "vitest";

import {
  countFaults,
  deadlockedProcesses,
  headMovement,
  isLegalCompletionSequence,
  isLegalOptimalVictim,
  isLegalShortestJobSchedule,
  isLegalSstfOrder,
  scheduleAverages,
  type Job,
  type ResourceState,
} from "./helpers/exam-answers";

describe("completion sequences", () => {
  const state: ResourceState = {
    available: [0, 0, 0],
    allocation: [
      [0, 1, 0],
      [2, 0, 0],
      [3, 0, 3],
      [2, 1, 1],
      [0, 0, 2],
    ],
    demand: [
      [0, 0, 0],
      [2, 0, 2],
      [0, 0, 0],
      [1, 0, 0],
      [0, 0, 2],
    ],
  };

  it("accepts more than one order, because the algorithm allows more than one", () => {
    expect(isLegalCompletionSequence(state, [0, 2, 3, 1, 4])).toBe(true);
    expect(isLegalCompletionSequence(state, [0, 2, 3, 4, 1])).toBe(true);
    expect(isLegalCompletionSequence(state, [2, 0, 3, 1, 4])).toBe(true);
  });

  it("rejects a process running before its request can be met", () => {
    expect(isLegalCompletionSequence(state, [1, 0, 2, 3, 4])).toBe(false);
  });

  it("rejects a short sequence, a repeat, and an unknown index", () => {
    expect(isLegalCompletionSequence(state, [0, 2, 3])).toBe(false);
    expect(isLegalCompletionSequence(state, [0, 0, 2, 3, 1])).toBe(false);
    expect(isLegalCompletionSequence(state, [0, 2, 3, 1, 9])).toBe(false);
  });

  it("finds the deadlocked set, which is unique whatever order is tried", () => {
    const stuck: ResourceState = {
      ...state,
      demand: state.demand.map((row, i) => (i === 2 ? [0, 0, 1] : row)),
    };
    expect(deadlockedProcesses(stuck)).toEqual([1, 2, 3, 4]);
    expect(deadlockedProcesses(state)).toEqual([]);
  });
});

describe("shortest-job schedules", () => {
  // The classic SRTF question: P1 0/8, P2 1/4, P3 2/9, P4 3/5.
  const jobs: Job[] = [
    { id: "P1", arrival: 0, burst: 8 },
    { id: "P2", arrival: 1, burst: 4 },
    { id: "P3", arrival: 2, burst: 9 },
    { id: "P4", arrival: 3, burst: 5 },
  ];

  const srtf = [
    { id: "P1", start: 0, end: 1 },
    { id: "P2", start: 1, end: 5 },
    { id: "P4", start: 5, end: 10 },
    { id: "P1", start: 10, end: 17 },
    { id: "P3", start: 17, end: 26 },
  ];

  it("accepts a correct preemptive run", () => {
    expect(isLegalShortestJobSchedule(jobs, srtf, { preemptive: true })).toEqual({ ok: true });
  });

  it("computes the averages, which are the same for every legal tie-break", () => {
    // This is why exam questions ask for averages rather than the chart.
    expect(scheduleAverages(jobs, srtf)).toEqual({
      averageWaiting: 6.5,
      averageTurnaround: 13,
    });
  });

  it("rejects running a longer job while a shorter one waits", () => {
    const greedy = [
      { id: "P1", start: 0, end: 8 },
      { id: "P2", start: 8, end: 12 },
      { id: "P4", start: 12, end: 17 },
      { id: "P3", start: 17, end: 26 },
    ];
    const result = isLegalShortestJobSchedule(jobs, greedy, { preemptive: true });
    expect(result.ok).toBe(false);
  });

  it("rejects a job that runs before it arrives", () => {
    const early = [
      { id: "P4", start: 0, end: 5 },
      { id: "P2", start: 5, end: 9 },
      { id: "P1", start: 9, end: 17 },
      { id: "P3", start: 17, end: 26 },
    ];
    expect(isLegalShortestJobSchedule(jobs, early, { preemptive: true }).ok).toBe(false);
  });

  it("rejects preemption when the policy is non-preemptive", () => {
    expect(isLegalShortestJobSchedule(jobs, srtf, { preemptive: false }).ok).toBe(false);
  });

  it("rejects a schedule that leaves work unexecuted", () => {
    expect(
      isLegalShortestJobSchedule(jobs, srtf.slice(0, 3), { preemptive: true }).ok
    ).toBe(false);
  });
});

describe("disk scheduling", () => {
  it("sums head movement for a fixed order", () => {
    expect(headMovement(50, [60, 40])).toBe(30);
  });

  it("accepts either side of an SSTF tie", () => {
    // Head at 20, requests equidistant at 10 and 30: both choices are correct,
    // and they lead to different totals. This is the exact case that makes an
    // equality test wrong.
    expect(isLegalSstfOrder(20, [10, 30], [10, 30])).toBe(true);
    expect(isLegalSstfOrder(20, [10, 30], [30, 10])).toBe(true);
  });

  it("rejects skipping a closer request", () => {
    expect(isLegalSstfOrder(20, [22, 90], [90, 22])).toBe(false);
  });

  it("rejects an order that misses or invents a request", () => {
    expect(isLegalSstfOrder(20, [10, 30], [10])).toBe(false);
    expect(isLegalSstfOrder(20, [10, 30], [10, 99])).toBe(false);
  });
});

describe("page replacement", () => {
  const references = [7, 0, 1, 2, 0, 3, 0, 4, 2, 3, 0, 3, 2];

  it("counts faults exactly — the count is unique even when the victim is not", () => {
    // Verified independently rather than quoted from a textbook: this is a
    // 13-reference prefix of the usual Silberschatz string, so the familiar
    // figures for the full 20 references do not apply to it.
    expect(countFaults(references, 3, "fifo")).toBe(10);
    expect(countFaults(references, 3, "lru")).toBe(9);
    expect(countFaults(references, 3, "optimal")).toBe(7);
    // Optimal is never worse than the others — a useful sanity property that
    // holds for any reference string.
    expect(countFaults(references, 3, "optimal")).toBeLessThanOrEqual(
      countFaults(references, 3, "lru")
    );
  });

  it("accepts any optimal victim that is not needed sooner than another", () => {
    // At time 3, memory holds 7, 0, 1. Next uses: 7 never, 0 at 4, 1 never.
    // Both 7 and 1 are correct victims.
    expect(isLegalOptimalVictim(references, [7, 0, 1], 3, 7)).toBe(true);
    expect(isLegalOptimalVictim(references, [7, 0, 1], 3, 1)).toBe(true);
  });

  it("rejects evicting a page that is needed sooner", () => {
    expect(isLegalOptimalVictim(references, [7, 0, 1], 3, 0)).toBe(false);
  });

  it("rejects a victim that is not in memory", () => {
    expect(isLegalOptimalVictim(references, [7, 0, 1], 3, 4)).toBe(false);
  });
});
