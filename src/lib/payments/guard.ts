// Guard against shipping to production while still on the providers' test
// endpoints.
//
// The failure is silent and expensive: a student completes a payment on
// test-pay.khalti.com or rc-epay.esewa.com.np, no money moves, and the callback
// still grants Pro. Nothing errors — the revenue just never arrives.
//
// The opposite mistake is self-correcting: live endpoints reject a test key
// outright, so checkout fails loudly.

export interface ProviderMode {
  name: string;
  live: boolean;
}

/** Test-mode providers that would be reachable by real users. */
export function unsafeProviders(modes: ProviderMode[]): string[] {
  if (process.env.NODE_ENV !== "production") return [];
  // Deliberate escape hatch for staging environments that run production
  // builds against the test rails on purpose.
  if (process.env.ALLOW_TEST_PAYMENTS_IN_PROD === "true") return [];
  return modes.filter((m) => !m.live).map((m) => m.name);
}

export function assertSafeForProduction(modes: ProviderMode[]): void {
  const unsafe = unsafeProviders(modes);
  if (unsafe.length === 0) return;

  throw new Error(
    `Refusing to start checkout: ${unsafe.join(", ")} still in TEST mode in a production build. ` +
      `Real users would pay on the provider's test page and be granted access without any money moving. ` +
      `Set ${unsafe.map((n) => `${n.toUpperCase()}_ENV=live`).join(" and ")} with live keys, ` +
      `or set ALLOW_TEST_PAYMENTS_IN_PROD=true if this is a staging environment.`
  );
}
