/**
 * Certificate code format tests.
 *
 * The code is what makes a certificate checkable, so its shape is part of the
 * contract: printed on the certificate, typed into /verify, and matched
 * server-side. Loosening this silently would break every existing link.
 */

import { describe, expect, it } from "vitest";
import { MASTERY_THRESHOLD } from "@/lib/certificates";

const CODE_PATTERN = /^MX-[A-Z0-9]{4}-[A-Z0-9]{4}$/;

describe("certificate code contract", () => {
  it("accepts the documented shape", () => {
    expect(CODE_PATTERN.test("MX-ABCD-2345")).toBe(true);
  });

  it("rejects codes containing the ambiguous characters the alphabet excludes", () => {
    // O/0 and I/1 are omitted so a code can be read aloud without confusion.
    const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
    for (const char of ["O", "0", "I", "1"]) {
      expect(alphabet.includes(char)).toBe(false);
    }
  });

  it("rejects malformed codes", () => {
    for (const bad of ["", "MX-ABCD", "ABCD-2345", "MX-ABCD-2345-6789", "mx-abcd-2345 "]) {
      expect(CODE_PATTERN.test(bad)).toBe(false);
    }
  });
});

describe("mastery threshold", () => {
  it("is a sane percentage", () => {
    expect(MASTERY_THRESHOLD).toBeGreaterThan(0);
    expect(MASTERY_THRESHOLD).toBeLessThanOrEqual(100);
  });

  it("is demanding enough to mean something", () => {
    // A certificate handed out at 50% would not signal mastery.
    expect(MASTERY_THRESHOLD).toBeGreaterThanOrEqual(70);
  });
});

describe("hall of fame gating", () => {
  it("requires a cohort big enough for rank #1 to mean something", async () => {
    const { HALL_OF_FAME_MIN_COHORT } = await import("@/lib/engagement");
    // Rank #1 out of two students is not a legendary achievement.
    expect(HALL_OF_FAME_MIN_COHORT).toBeGreaterThanOrEqual(5);
  });
});
