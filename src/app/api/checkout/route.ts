import { NextRequest, NextResponse } from "next/server";
import { adminAuth } from "@/lib/firebase-admin";
import { getProvider, getPlanOffer, configuredProviders } from "@/lib/payments";
import { assertSafeForProduction } from "@/lib/payments/guard";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    // The old route took `userId` from the request body, so anyone could start
    // a checkout on another account. Identity now comes from the ID token.
    const token = request.headers.get("Authorization")?.replace("Bearer ", "");
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    let decoded;
    try {
      decoded = await adminAuth.verifyIdToken(token);
    } catch {
      return NextResponse.json({ error: "Invalid or expired token" }, { status: 401 });
    }
    if (!decoded) {
      return NextResponse.json({ error: "Auth is not configured on the server" }, { status: 503 });
    }

    const body = await request.json().catch(() => ({}));

    // The plan is chosen from our catalog by id; the amount and price id are
    // never taken from the client.
    const offer = getPlanOffer(String(body?.offerId ?? ""));
    if (!offer) {
      return NextResponse.json({ error: "Unknown plan" }, { status: 400 });
    }

    const provider = getProvider(typeof body?.provider === "string" ? body.provider : undefined);
    if (!provider) {
      return NextResponse.json(
        {
          error: "No payment provider is configured",
          hint:
            "Set ESEWA_SECRET_KEY or KHALTI_SECRET_KEY (Nepal), or STRIPE_SECRET_KEY (international).",
          configured: configuredProviders(),
        },
        { status: 503 }
      );
    }

    // Fails fast rather than letting a real user "pay" on a test endpoint.
    try {
      assertSafeForProduction([{ name: provider.name, live: provider.isLiveMode?.() ?? true }]);
    } catch (err) {
      console.error(err);
      return NextResponse.json(
        { error: "Payments are misconfigured on the server. Please contact support." },
        { status: 503 }
      );
    }

    const origin = process.env.NEXT_PUBLIC_APP_URL || request.nextUrl.origin;

    const session = await provider.createCheckout({
      offer,
      userId: decoded.uid,
      email: decoded.email,
      origin,
    });

    return NextResponse.json({
      provider: provider.name,
      transactionId: session.transactionId,
      url: session.redirectUrl,
      formPost: session.formPost,
    });
  } catch (err) {
    console.error("Checkout error:", err);
    return NextResponse.json({ error: "Could not start checkout" }, { status: 500 });
  }
}

// Which rails are usable right now, so the UI offers only wallets that work
// rather than showing a button that 503s.
export async function GET() {
  return NextResponse.json(
    { providers: configuredProviders() },
    { headers: { "Cache-Control": "no-store" } }
  );
}
