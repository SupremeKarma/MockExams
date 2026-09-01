import { NextRequest, NextResponse } from "next/server";
import { getProvider, getPlanOffer, expiryFromNow } from "@/lib/payments";
import { grantEntitlement } from "@/lib/entitlements";

export const dynamic = "force-dynamic";

// eSewa returns the user here with a base64 `data` blob. Nothing in that blob
// is trusted: the provider re-queries eSewa's status API and checks the amount
// against the transaction we recorded before checkout.
async function handle(providerName: string, payload: Record<string, unknown>, origin: string) {
  const provider = getProvider(providerName);
  if (!provider) {
    return NextResponse.redirect(`${origin}/pricing?payment=unavailable`);
  }

  const verified = await provider.verifyCallback(payload);
  if (!verified) {
    return NextResponse.redirect(`${origin}/pricing?payment=failed`);
  }

  const offer = getPlanOffer(verified.offerId);
  if (!offer) {
    return NextResponse.redirect(`${origin}/pricing?payment=failed`);
  }

  await grantEntitlement(
    verified.userId,
    offer.plan,
    expiryFromNow(offer.durationDays),
    `${provider.name}:${verified.providerRef || verified.transactionId}`
  );

  return NextResponse.redirect(`${origin}/dashboard?payment=success`);
}

function decodeEsewaData(raw: string | null): Record<string, unknown> {
  if (!raw) return {};
  try {
    return JSON.parse(Buffer.from(raw, "base64").toString("utf8"));
  } catch {
    return {};
  }
}

export async function GET(request: NextRequest) {
  const origin = process.env.NEXT_PUBLIC_APP_URL || request.nextUrl.origin;
  const providerName = request.nextUrl.searchParams.get("provider") || "esewa";

  const payload =
    providerName === "esewa"
      ? decodeEsewaData(request.nextUrl.searchParams.get("data"))
      : Object.fromEntries(request.nextUrl.searchParams.entries());

  try {
    return await handle(providerName, payload, origin);
  } catch (err) {
    console.error("Payment callback failed:", err);
    return NextResponse.redirect(`${origin}/pricing?payment=failed`);
  }
}
