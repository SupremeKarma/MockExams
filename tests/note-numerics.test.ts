/**
 * Every numeric answer-box in a published note is recomputed here from scratch.
 *
 * The point is not to test the algorithms — it is to test the NOTES. These
 * pages are what a student memorises days before an exam, and a wrong number in
 * an answer-box costs them the marks twice: once for the wrong method and once
 * for having practised it. A model that writes confident arithmetic is exactly
 * the failure this catches.
 *
 * The checks follow the rule in tests/helpers/exam-answers.ts: verify the note's
 * answer is LEGAL, not that it matches one particular implementation. Where an
 * answer genuinely is unique — a total head movement for a stated order, an
 * average waiting time, the set of deadlocked processes — it is checked exactly.
 *
 * An answer-box only earns `verified` when its test here passes.
 */

import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

import {
  answerBoxes,
  assertDeadlockSet,
  expectRejects,
  headMovement,
  isLegalCompletionSequence,
  isLegalShortestJobSchedule,
  isLegalSstfOrder,
  scheduleAverages,
  type Job,
  type ResourceState,
} from "./helpers/exam-answers";

const NOTES = join(process.cwd(), "content", "notes", "bit253co");

function note(file: string): string {
  return readFileSync(join(NOTES, file), "utf-8");
}

// ---------------------------------------------------------------------------
// 6.d Deadlock detection and recovery
// ---------------------------------------------------------------------------

describe("6.d Deadlock detection and recovery", () => {
  const source = note("u6-t4-deadlock-detection-and-recovery.md");

  const allocation = [
    [0, 1, 0], // P0
    [2, 0, 0], // P1
    [3, 0, 3], // P2
    [2, 1, 1], // P3
    [0, 0, 2], // P4
  ];

  const noDeadlock: ResourceState = {
    available: [0, 0, 0],
    allocation,
    demand: [
      [0, 0, 0],
      [2, 0, 2],
      [0, 0, 0],
      [1, 0, 0],
      [0, 0, 2],
    ],
  };

  const deadlocked: ResourceState = {
    ...noDeadlock,
    demand: noDeadlock.demand.map((row, i) => (i === 2 ? [0, 0, 1] : row)),
  };

  it("has exactly the two answer boxes these tests cover", () => {
    expect(answerBoxes(source)).toHaveLength(2);
  });

  it("first example: the sequence the note prints is one an examiner would accept", () => {
    expect(isLegalCompletionSequence(noDeadlock, [0, 2, 3, 1, 4])).toBe(true);
    // A different legal order must also pass, or this is an equality test in
    // disguise.
    expect(isLegalCompletionSequence(noDeadlock, [0, 2, 3, 4, 1])).toBe(true);

    expectRejects(
      (order: number[]) => isLegalCompletionSequence(noDeadlock, order),
      [1, 0, 2, 3, 4],
      "a sequence starting with a process whose request cannot be met"
    );

    assertDeadlockSet(noDeadlock, []);

    const box = answerBoxes(source)[0];
    expect(box).toContain("No deadlock");
    expect(box).toContain("⟨P₀, P₂, P₃, P₁, P₄⟩");
    expect(box).toContain("(7, 2, 6)");
  });

  it("second example: changing P2's request to (0,0,1) deadlocks four processes", () => {
    assertDeadlockSet(deadlocked, [1, 2, 3, 4]);

    expectRejects(
      (order: number[]) => isLegalCompletionSequence(deadlocked, order),
      [0, 1, 2, 3, 4],
      "any complete sequence, since four processes are deadlocked"
    );

    const box = answerBoxes(source)[1];
    expect(box).toContain("Deadlocked");
    expect(box).toContain("P₁, P₂, P₃ and P₄");
  });

  it("the note's Available really is (0,0,0) given its own totals", () => {
    const held = allocation.reduce((acc, row) => acc.map((v, i) => v + row[i]), [0, 0, 0]);
    expect(held).toEqual([7, 2, 6]);
  });
});

// ---------------------------------------------------------------------------
// 5.c Disk scheduling
// ---------------------------------------------------------------------------

describe("5.c Disk scheduling", () => {
  const source = note("u5-t3-disk-scheduling.md");

  const HEAD = 53;
  const MAX_CYLINDER = 199;
  const REQUESTS = [98, 183, 37, 122, 14, 124, 65, 67];

  const below = REQUESTS.filter((r) => r < HEAD).sort((a, b) => b - a); // 37, 14
  const above = REQUESTS.filter((r) => r >= HEAD).sort((a, b) => a - b);

  const boxes = answerBoxes(source);

  it("has one answer box per algorithm covered", () => {
    // FCFS, SSTF, SCAN, LOOK, and C-SCAN/C-LOOK together.
    expect(boxes).toHaveLength(5);
  });

  it("FCFS serves in arrival order for 640 cylinders", () => {
    // Once the order is fixed the total is unique, so this is exact.
    expect(headMovement(HEAD, REQUESTS)).toBe(640);
    expect(boxes[0]).toContain("640");
  });

  it("SSTF: the note's order is legal, and its total matches that order", () => {
    const order = [65, 67, 37, 14, 98, 122, 124, 183];

    // SSTF ties are legal either way, so the ORDER is checked for legality...
    expect(isLegalSstfOrder(HEAD, REQUESTS, order)).toBe(true);
    // ...and the total is then checked against the note's own order.
    expect(headMovement(HEAD, order)).toBe(236);
    expect(boxes[1]).toContain("236");

    expectRejects(
      (o: number[]) => isLegalSstfOrder(HEAD, REQUESTS, o),
      [183, 124, 122, 98, 67, 65, 37, 14],
      "an order that skips past much closer requests"
    );
  });

  it("SCAN runs to the disk end before reversing: 331 cylinders", () => {
    const order = [...above, MAX_CYLINDER, ...below];
    expect(headMovement(HEAD, order)).toBe(331);
    expect(boxes[2]).toContain("331");
  });

  it("LOOK turns at the last request instead: 299 cylinders", () => {
    const order = [...above, ...below];
    expect(headMovement(HEAD, order)).toBe(299);
    expect(boxes[3]).toContain("299");

    // LOOK is never worse than SCAN — it saves the empty run to the disk end.
    expect(headMovement(HEAD, order)).toBeLessThan(
      headMovement(HEAD, [...above, MAX_CYLINDER, ...below])
    );
  });

  it("C-SCAN and C-LOOK count the return jump: 382 and 322", () => {
    const cscan = [...above, MAX_CYLINDER, 0, ...below.slice().reverse()];
    const clook = [...above, ...below.slice().reverse()];

    expect(headMovement(HEAD, cscan)).toBe(382);
    expect(headMovement(HEAD, clook)).toBe(322);

    expect(boxes[4]).toContain("382");
    expect(boxes[4]).toContain("322");

    // The note claims the circular versions move MORE on this queue and buy
    // fairness instead. That claim has to hold.
    expect(headMovement(HEAD, cscan)).toBeGreaterThan(
      headMovement(HEAD, [...above, MAX_CYLINDER, ...below])
    );
  });

  it("SSTF really is the fastest of the six, as the comparison table says", () => {
    const totals = {
      FCFS: headMovement(HEAD, REQUESTS),
      SSTF: headMovement(HEAD, [65, 67, 37, 14, 98, 122, 124, 183]),
      SCAN: headMovement(HEAD, [...above, MAX_CYLINDER, ...below]),
      LOOK: headMovement(HEAD, [...above, ...below]),
      CSCAN: headMovement(HEAD, [...above, MAX_CYLINDER, 0, ...below.slice().reverse()]),
      CLOOK: headMovement(HEAD, [...above, ...below.slice().reverse()]),
    };
    expect(Math.min(...Object.values(totals))).toBe(totals.SSTF);
    expect(Math.max(...Object.values(totals))).toBe(totals.FCFS);
  });
});

// ---------------------------------------------------------------------------
// 2.f Process scheduling
// ---------------------------------------------------------------------------

describe("2.f Process scheduling", () => {
  const source = note("u2-t6-process-scheduling.md");

  const jobs: Job[] = [
    { id: "P1", arrival: 0, burst: 8 },
    { id: "P2", arrival: 1, burst: 4 },
    { id: "P3", arrival: 2, burst: 9 },
    { id: "P4", arrival: 3, burst: 5 },
  ];

  const boxes = answerBoxes(source);

  it("has one answer box for FCFS and one for SRTF", () => {
    expect(boxes).toHaveLength(2);
  });

  it("FCFS: 8.75 ms waiting, 15.25 ms turnaround", () => {
    const fcfs = [
      { id: "P1", start: 0, end: 8 },
      { id: "P2", start: 8, end: 12 },
      { id: "P3", start: 12, end: 21 },
      { id: "P4", start: 21, end: 26 },
    ];

    // Non-preemptive and in arrival order, so the chart is unique here.
    expect(isLegalShortestJobSchedule(jobs, fcfs, { preemptive: false }).ok).toBe(false);
    // (FCFS is deliberately NOT a shortest-job schedule — that is the point of
    // the convoy effect the note describes. The averages are what matter.)

    expect(scheduleAverages(jobs, fcfs)).toEqual({
      averageWaiting: 8.75,
      averageTurnaround: 15.25,
    });
    expect(boxes[0]).toContain("8.75");
    expect(boxes[0]).toContain("15.25");
  });

  it("SRTF: the note's Gantt chart is a legal preemptive run", () => {
    const srtf = [
      { id: "P1", start: 0, end: 1 },
      { id: "P2", start: 1, end: 5 },
      { id: "P4", start: 5, end: 10 },
      { id: "P1", start: 10, end: 17 },
      { id: "P3", start: 17, end: 26 },
    ];

    expect(isLegalShortestJobSchedule(jobs, srtf, { preemptive: true })).toEqual({ ok: true });

    // Averages are the same for every legal tie-break, so these are exact.
    expect(scheduleAverages(jobs, srtf)).toEqual({
      averageWaiting: 6.5,
      averageTurnaround: 13,
    });

    expect(boxes[1]).toContain("6.5");
    expect(boxes[1]).toContain("13");

    // And the note's comparison with FCFS must be the right way round.
    expect(boxes[1]).toContain("8.75");
  });

  it("rejects a run that lets a long job block a shorter one", () => {
    expectRejects(
      (slices: { id: string; start: number; end: number }[]) =>
        isLegalShortestJobSchedule(jobs, slices, { preemptive: true }),
      [
        { id: "P1", start: 0, end: 8 },
        { id: "P2", start: 8, end: 12 },
        { id: "P3", start: 12, end: 21 },
        { id: "P4", start: 21, end: 26 },
      ],
      "FCFS order presented as SRTF"
    );
  });
});

// ---------------------------------------------------------------------------
// 6.f Banker's Algorithm
// ---------------------------------------------------------------------------

describe("6.f Banker's Algorithm", () => {
  const source = note("u6-t6-bankers-algorithm.md");

  const allocation = [
    [0, 1, 0], // P0
    [2, 0, 0], // P1
    [3, 0, 2], // P2
    [2, 1, 1], // P3
    [0, 0, 2], // P4
  ];
  const max = [
    [7, 5, 3],
    [3, 2, 2],
    [9, 0, 2],
    [2, 2, 2],
    [4, 3, 3],
  ];
  const need = max.map((row, i) => row.map((v, j) => v - allocation[i][j]));

  const boxes = answerBoxes(source);

  it("has an answer box for the safety check and one for the request", () => {
    expect(boxes).toHaveLength(2);
  });

  it("the Need matrix the note prints is Max − Allocation", () => {
    // The first mark in every Banker's question.
    expect(need).toEqual([
      [7, 4, 3],
      [1, 2, 2],
      [6, 0, 0],
      [0, 1, 1],
      [4, 3, 1],
    ]);
    for (const row of need) {
      expect(source).toContain(row.join(" "));
    }
  });

  it("the initial state is safe, by the sequence the note gives", () => {
    const state: ResourceState = { available: [3, 3, 2], allocation, demand: need };

    expect(isLegalCompletionSequence(state, [1, 3, 4, 0, 2])).toBe(true);
    // The note explicitly says a safe sequence is not unique, and names this
    // alternative. Both must hold or the note is wrong about its own claim.
    expect(isLegalCompletionSequence(state, [1, 3, 4, 2, 0])).toBe(true);

    expectRejects(
      (order: number[]) => isLegalCompletionSequence(state, order),
      [0, 1, 2, 3, 4],
      "a sequence starting with P0, whose Need (7,4,3) exceeds Available (3,3,2)"
    );

    expect(boxes[0]).toContain("SAFE");
    expect(boxes[0]).toContain("⟨P1, P3, P4, P0, P2⟩");
  });

  it("P1's request for (1,0,2) leaves a safe state, so it is granted", () => {
    const request = [1, 0, 2];

    // Check 1: within P1's declared maximum.
    expect(request.every((v, i) => v <= need[1][i])).toBe(true);
    // Check 2: the resources exist.
    expect(request.every((v, i) => v <= [3, 3, 2][i])).toBe(true);

    // Check 3: pretend to grant, then test safety.
    const pretend: ResourceState = {
      available: [3, 3, 2].map((v, i) => v - request[i]),
      allocation: allocation.map((row, i) =>
        i === 1 ? row.map((v, j) => v + request[j]) : row
      ),
      demand: need.map((row, i) => (i === 1 ? row.map((v, j) => v - request[j]) : row)),
    };

    expect(pretend.available).toEqual([2, 3, 0]);
    expect(pretend.allocation[1]).toEqual([3, 0, 2]);
    expect(pretend.demand[1]).toEqual([0, 2, 0]);

    expect(isLegalCompletionSequence(pretend, [1, 3, 4, 0, 2])).toBe(true);

    expect(boxes[1]).toContain("GRANTED");
    expect(boxes[1]).toContain("⟨P1, P3, P4, P0, P2⟩");
  });

  it("a request beyond a process's declared maximum is an error, not a wait", () => {
    // The note lists this as check 1, and the distinction carries marks.
    const tooMuch = [2, 0, 0];
    expect(tooMuch.every((v, i) => v <= need[1][i])).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// 6.e Deadlock avoidance and prevention
// ---------------------------------------------------------------------------

describe("6.e Deadlock avoidance and prevention", () => {
  const source = note("u6-t5-deadlock-avoidance-and-prevention.md");
  const boxes = answerBoxes(source);

  // Twelve tape drives, one resource type. Modelled as a 1-column matrix so the
  // shared helper applies unchanged.
  const TOTAL = 12;
  const holds = [[5], [2], [2]];
  const maximum = [[10], [4], [9]];
  const stillNeeds = maximum.map((m, i) => [m[0] - holds[i][0]]);
  const free = TOTAL - holds.reduce((n, h) => n + h[0], 0);

  it("has an answer box for the safe state and one for the unsafe one", () => {
    expect(boxes).toHaveLength(2);
  });

  it("the note's arithmetic for free drives and still-needs is right", () => {
    expect(free).toBe(3);
    expect(stillNeeds.map((n) => n[0])).toEqual([5, 2, 7]);
  });

  it("the initial state is safe by the sequence the note gives", () => {
    const state: ResourceState = {
      available: [free],
      allocation: holds,
      demand: stillNeeds,
    };

    expect(isLegalCompletionSequence(state, [1, 0, 2])).toBe(true);
    assertDeadlockSet(state, []);

    // P0 cannot go first: it needs 5 and only 3 are free.
    expectRejects(
      (order: number[]) => isLegalCompletionSequence(state, order),
      [0, 1, 2],
      "a sequence starting with P0, which needs 5 of the 3 free drives"
    );

    expect(boxes[0]).toContain("SAFE");
    expect(boxes[0]).toContain("⟨P1, P0, P2⟩");
  });

  it("granting P2 one more drive makes the state unsafe", () => {
    // This is the whole point of avoidance: a drive IS free and the request is
    // still refused.
    const after: ResourceState = {
      available: [free - 1],
      allocation: holds.map((h, i) => (i === 2 ? [h[0] + 1] : h)),
      demand: stillNeeds.map((n, i) => (i === 2 ? [n[0] - 1] : n)),
    };

    expect(after.available).toEqual([2]);
    expect(after.demand.map((n) => n[0])).toEqual([5, 2, 6]);

    // Only P1 can finish; P0 and P2 are stranded.
    assertDeadlockSet(after, [0, 2]);
    expectRejects(
      (order: number[]) => isLegalCompletionSequence(after, order),
      [1, 0, 2],
      "any complete sequence — the state is unsafe"
    );

    expect(boxes[1]).toContain("UNSAFE");
  });
});

// ---------------------------------------------------------------------------
// 5.d Clocks
// ---------------------------------------------------------------------------

describe("5.d Clocks", () => {
  const source = note("u5-t4-clocks.md");
  const boxes = answerBoxes(source);

  const HZ = 60;

  it("has an answer box for the overflow and one for the quantum", () => {
    expect(boxes).toHaveLength(2);
  });

  it("a 32-bit tick counter at 60 Hz overflows after about 2.27 years", () => {
    const seconds = 2 ** 32 / HZ;
    const days = seconds / 86_400;
    const years = days / 365.25;

    expect(Math.round(seconds)).toBe(71_582_788);
    expect(Number(days.toFixed(1))).toBe(828.5);
    expect(Number(years.toFixed(2))).toBe(2.27);

    expect(boxes[0]).toContain("828");
    expect(boxes[0]).toContain("2.27");
    // The working must show the same figures as the answer.
    expect(source).toContain("71 582 788");
  });

  it("a 100 ms quantum is 6 ticks at 60 Hz", () => {
    const msPerTick = 1000 / HZ;
    expect(Number(msPerTick.toFixed(2))).toBe(16.67);
    expect(Math.round(100 / msPerTick)).toBe(6);

    expect(boxes[1]).toContain("6 clock ticks");
  });
});

// ---------------------------------------------------------------------------
// 2.d Inter-process communication
// ---------------------------------------------------------------------------

describe("2.d Inter-process communication", () => {
  const source = note("u2-t4-interprocess-communication.md");
  const boxes = answerBoxes(source);

  it("has one answer box, for the lost-update trace", () => {
    expect(boxes).toHaveLength(1);
  });

  it("the interleaving the note traces really does lose an increment", () => {
    // Replay the note's table exactly: each process loads, adds, then stores,
    // with a context switch after P1's add and after P2's store.
    let counter = 5;
    let p1 = 0;
    let p2 = 0;

    p1 = counter;      // 1. P1 load        -> 5
    p1 = p1 + 1;       // 2. P1 add         -> 6
    /* switch */       // 3.
    p2 = counter;      // 4. P2 load        -> 5
    p2 = p2 + 1;       // 5. P2 add         -> 6
    counter = p2;      // 6. P2 store       -> 6
    /* switch */       // 7.
    counter = p1;      // 8. P1 store       -> 6

    expect(counter).toBe(6);

    // And the correct answer, had the two not overlapped, is 7 — which is the
    // claim the note makes about what was lost.
    let sequential = 5;
    sequential = sequential + 1;
    sequential = sequential + 1;
    expect(sequential).toBe(7);

    expect(boxes[0]).toContain("counter = 6");
    expect(boxes[0]).toContain("not 7");
  });
});
