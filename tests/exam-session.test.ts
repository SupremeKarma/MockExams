/**
 * Exam session integrity tests.
 *
 * A bug in the option mapping would silently mark correct answers wrong for
 * every student, with no error anywhere — so the translation from display
 * position back to real option key is tested directly.
 */

import { describe, expect, it } from "vitest";
import {
  resolveOption,
  buildIntegritySignals,
  OPTION_KEYS,
  type ExamSession,
} from "@/lib/exam-session";

const session = (overrides: Partial<ExamSession> = {}): ExamSession => ({
  id: "session-1",
  user_id: "student-1",
  exam_id: "exam-1",
  started_at: new Date().toISOString(),
  expires_at: new Date(Date.now() + 30 * 60 * 1000).toISOString(),
  question_order: ["q1"],
  option_maps: { q1: ["c", "a", "d", "b"] },
  honor_accepted: true,
  submitted: false,
  ...overrides,
});

describe("resolveOption", () => {
  it("maps each display position back to the real option key", () => {
    // Student's A is really C, B is really A, and so on.
    expect(resolveOption(session(), "q1", "a")).toBe("c");
    expect(resolveOption(session(), "q1", "b")).toBe("a");
    expect(resolveOption(session(), "q1", "c")).toBe("d");
    expect(resolveOption(session(), "q1", "d")).toBe("b");
  });

  it("is a bijection — no two positions map to the same option", () => {
    const mapped = OPTION_KEYS.map((key) => resolveOption(session(), "q1", key));
    expect(new Set(mapped).size).toBe(OPTION_KEYS.length);
  });

  it("returns null for an unanswered question", () => {
    expect(resolveOption(session(), "q1", null)).toBeNull();
  });

  it("passes the choice through when the question has no map", () => {
    // Written questions carry no option map.
    expect(resolveOption(session(), "written-q", "a")).toBe("a");
  });

  it("rejects a choice outside the question's real option count", () => {
    // A three-option question: picking D is not a valid answer.
    const threeOptions = session({ option_maps: { q1: ["b", "c", "a"] } });
    expect(resolveOption(threeOptions, "q1", "d")).toBeNull();
    expect(resolveOption(threeOptions, "q1", "c")).toBe("a");
  });

  it("rejects a garbage choice rather than mismarking it", () => {
    expect(resolveOption(session(), "q1", "z")).toBeNull();
    expect(resolveOption(session(), "q1", "")).toBeNull();
  });
});

describe("buildIntegritySignals", () => {
  it("measures elapsed time from the server's start, not the client's claim", () => {
    const startedAt = new Date(Date.now() - 10 * 60 * 1000).toISOString();
    // Client claims 30 seconds; the server saw ten minutes.
    const signals = buildIntegritySignals(session({ started_at: startedAt }), 30, 0, 0);

    expect(signals.serverElapsedSeconds).toBeGreaterThan(590);
    expect(signals.clientReportedSeconds).toBe(30);
    expect(signals.clientTimeMismatch).toBe(true);
  });

  it("tolerates small drift between client and server clocks", () => {
    const startedAt = new Date(Date.now() - 5 * 60 * 1000).toISOString();
    const signals = buildIntegritySignals(session({ started_at: startedAt }), 5 * 60 - 20, 0, 0);
    expect(signals.clientTimeMismatch).toBe(false);
  });

  it("flags a submission arriving after the window closed", () => {
    const expired = session({ expires_at: new Date(Date.now() - 1000).toISOString() });
    expect(buildIntegritySignals(expired, 60, 0, 0).lateSubmission).toBe(true);
  });

  it("does not flag a submission inside the window", () => {
    expect(buildIntegritySignals(session(), 60, 0, 0).lateSubmission).toBe(false);
  });

  it("records focus-loss counts without sanitising them into a verdict", () => {
    const signals = buildIntegritySignals(session(), 60, 3, 42);
    expect(signals.blurCount).toBe(3);
    expect(signals.longestBlurSeconds).toBe(42);
    // There is deliberately no "cheated" or "suspicious" boolean here.
    expect(Object.keys(signals)).not.toContain("suspicious");
  });

  it("clamps nonsense telemetry to zero", () => {
    const signals = buildIntegritySignals(session(), -5, -3, -100);
    expect(signals.blurCount).toBe(0);
    expect(signals.longestBlurSeconds).toBe(0);
    expect(signals.clientReportedSeconds).toBe(0);
  });

  it("carries the honor attestation through from the session", () => {
    expect(buildIntegritySignals(session(), 60, 0, 0).honorAccepted).toBe(true);
    expect(
      buildIntegritySignals(session({ honor_accepted: false }), 60, 0, 0).honorAccepted
    ).toBe(false);
  });
});
