import { NextResponse } from "next/server";
import { verifyCertificate } from "@/lib/certificates";

export const dynamic = "force-dynamic";

// Public on purpose: a certificate nobody can check is worthless. Returns only
// the facts printed on the certificate, never the holder's account details.
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ code: string }> }
) {
  try {
    const { code } = await params;
    return NextResponse.json(await verifyCertificate(code), {
      headers: { "Cache-Control": "no-store" },
    });
  } catch (err) {
    console.error("Certificate verification failed:", err);
    return NextResponse.json({ valid: false }, { status: 500 });
  }
}
