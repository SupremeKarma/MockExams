/**
 * Payment plumbing tests.
 *
 * A wrong eSewa signature fails silently at the gateway — the user just sees a
 * rejected payment — so the signing is verified here against an independent
 * HMAC implementation rather than against our own helper.
 */

import { createHmac } from "crypto";
import { afterEach, describe, expect, it, vi } from "vitest";
import { signEsewaPayload } from "@/lib/payments/esewa";
import { PLAN_CATALOG, getPlanOffer, expiryFromNow } from "@/lib/payments/plans";

const SECRET = "8gBm/:&EnhH.1/q";

/** eSewa's documented message form, built independently of the helper. */
function referenceSignature(total: string, uuid: string, code: string, secret: string): string {
  const message = `total_amount=${total},transaction_uuid=${uuid},product_code=${code}`;
  return createHmac("sha256", secret).update(message).digest("base64");
}

describe("eSewa signing", () => {
  it("matches an independent HMAC-SHA256 base64 computation", () => {
    const signature = signEsewaPayload("100", "11-201-13", "EPAYTEST", SECRET);
    expect(signature).toBe(referenceSignature("100", "11-201-13", "EPAYTEST", SECRET));
  });

  it("produces valid base64 of a 32-byte digest", () => {
    const signature = signEsewaPayload("499", "abc-123", "EPAYTEST", SECRET);
    expect(signature).toMatch(/^[A-Za-z0-9+/]+=*$/);
    expect(Buffer.from(signature, "base64")).toHaveLength(32);
  });

  it("is deterministic for the same inputs", () => {
    const a = signEsewaPayload("499", "abc-123", "EPAYTEST", SECRET);
    const b = signEsewaPayload("499", "abc-123", "EPAYTEST", SECRET);
    expect(a).toBe(b);
  });

  it("changes when the amount is tampered with", () => {
    // The whole point of the signature: a client cannot lower the price.
    const honest = signEsewaPayload("499", "abc-123", "EPAYTEST", SECRET);
    const tampered = signEsewaPayload("1", "abc-123", "EPAYTEST", SECRET);
    expect(tampered).not.toBe(honest);
  });

  it("changes when the transaction id is swapped", () => {
    const a = signEsewaPayload("499", "txn-a", "EPAYTEST", SECRET);
    const b = signEsewaPayload("499", "txn-b", "EPAYTEST", SECRET);
    expect(a).not.toBe(b);
  });

  it("changes with a different secret", () => {
    const a = signEsewaPayload("499", "abc-123", "EPAYTEST", SECRET);
    const b = signEsewaPayload("499", "abc-123", "EPAYTEST", "another-secret");
    expect(a).not.toBe(b);
  });
});

describe("plan catalog", () => {
  it("resolves known plans and rejects unknown ones", () => {
    expect(getPlanOffer("pro_monthly")?.plan).toBe("pro");
    expect(getPlanOffer("campus_semester")?.plan).toBe("campus");
    // An unknown id must not fall through to a default plan.
    expect(getPlanOffer("free_forever_lol")).toBeNull();
    expect(getPlanOffer("")).toBeNull();
  });

  it("prices every offer as a positive integer amount", () => {
    for (const offer of Object.values(PLAN_CATALOG)) {
      expect(offer.amountNPR).toBeGreaterThan(0);
      // Integers only: decimals break eSewa's signed total_amount string.
      expect(Number.isInteger(offer.amountNPR)).toBe(true);
      expect(offer.durationDays).toBeGreaterThan(0);
    }
  });

  it("keys every offer by its own id", () => {
    for (const [key, offer] of Object.entries(PLAN_CATALOG)) {
      expect(offer.id).toBe(key);
    }
  });
});

describe("expiryFromNow", () => {
  it("returns an ISO date the expected number of days ahead", () => {
    const before = Date.now();
    const expiry = new Date(expiryFromNow(30)).getTime();
    const days = (expiry - before) / (24 * 60 * 60 * 1000);
    expect(days).toBeGreaterThan(29.9);
    expect(days).toBeLessThan(30.1);
  });

  it("is always in the future for a valid plan duration", () => {
    for (const offer of Object.values(PLAN_CATALOG)) {
      expect(new Date(expiryFromNow(offer.durationDays)).getTime()).toBeGreaterThan(Date.now());
    }
  });
});

describe("Khalti amounts", () => {
  it("converts rupees to paisa", async () => {
    const { toPaisa } = await import("@/lib/payments/khalti");
    expect(toPaisa(499)).toBe(49900);
    expect(toPaisa(2999)).toBe(299900);
  });

  it("returns whole paisa for every catalogue price", async () => {
    const { toPaisa } = await import("@/lib/payments/khalti");
    for (const offer of Object.values(PLAN_CATALOG)) {
      const paisa = toPaisa(offer.amountNPR);
      // A fractional paisa would be rejected by Khalti outright.
      expect(Number.isInteger(paisa)).toBe(true);
      expect(paisa).toBeGreaterThan(0);
    }
  });
});

describe("provider registry", () => {
  it("prefers a local rail over Stripe when both are configured", async () => {
    const { getProvider } = await import("@/lib/payments");
    process.env.ESEWA_SECRET_KEY = "test-secret";
    process.env.STRIPE_SECRET_KEY = "sk_test_x";
    expect(getProvider()?.name).toBe("esewa");
    delete process.env.ESEWA_SECRET_KEY;
    delete process.env.STRIPE_SECRET_KEY;
  });

  it("returns null for a provider that is not configured", async () => {
    const { getProvider } = await import("@/lib/payments");
    delete process.env.KHALTI_SECRET_KEY;
    expect(getProvider("khalti")).toBeNull();
  });

  it("returns null for an unknown provider name", async () => {
    const { getProvider } = await import("@/lib/payments");
    expect(getProvider("paypal")).toBeNull();
  });
});

describe("production/test mode guard", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("allows test mode outside production", async () => {
    const { unsafeProviders } = await import("@/lib/payments/guard");
    vi.stubEnv("NODE_ENV", "development");
    expect(unsafeProviders([{ name: "khalti", live: false }])).toEqual([]);
  });

  it("flags a test-mode provider in a production build", async () => {
    const { unsafeProviders } = await import("@/lib/payments/guard");
    vi.stubEnv("NODE_ENV", "production");
    // Real users would pay on the provider's test page and be granted for free.
    expect(unsafeProviders([{ name: "khalti", live: false }])).toEqual(["khalti"]);
  });

  it("allows live providers in production", async () => {
    const { unsafeProviders } = await import("@/lib/payments/guard");
    vi.stubEnv("NODE_ENV", "production");
    expect(unsafeProviders([{ name: "esewa", live: true }])).toEqual([]);
  });

  it("honours the staging escape hatch", async () => {
    const { unsafeProviders } = await import("@/lib/payments/guard");
    vi.stubEnv("NODE_ENV", "production");
    vi.stubEnv("ALLOW_TEST_PAYMENTS_IN_PROD", "true");
    expect(unsafeProviders([{ name: "khalti", live: false }])).toEqual([]);
  });

  it("names every offending provider in the thrown message", async () => {
    const { assertSafeForProduction } = await import("@/lib/payments/guard");
    vi.stubEnv("NODE_ENV", "production");
    expect(() =>
      assertSafeForProduction([
        { name: "esewa", live: false },
        { name: "khalti", live: false },
      ])
    ).toThrow(/esewa, khalti/);
  });

  it("tells the developer exactly which env vars to set", async () => {
    const { assertSafeForProduction } = await import("@/lib/payments/guard");
    vi.stubEnv("NODE_ENV", "production");
    expect(() => assertSafeForProduction([{ name: "khalti", live: false }])).toThrow(
      /KHALTI_ENV=live/
    );
  });
});
