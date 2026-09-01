import { CheckCircle2, XCircle, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { verifyCertificate } from "@/lib/certificates";

export const dynamic = "force-dynamic";

// Server component: anyone with the code can check a certificate without an
// account, which is the whole point of issuing one.
export default async function VerifyPage({ params }: { params: Promise<{ code: string }> }) {
  const { code } = await params;
  const result = await verifyCertificate(decodeURIComponent(code));

  return (
    <div className="min-h-screen bg-zinc-50/40 flex items-center justify-center px-4 py-16">
      <div className="max-w-md w-full space-y-6 text-center">
        <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-zinc-100 border border-zinc-200 text-zinc-600 text-[11px] font-bold uppercase tracking-wider">
          <ShieldCheck className="w-3.5 h-3.5" />
          Certificate verification
        </div>

        {result.valid ? (
          <div className="p-6 rounded-xl bg-white border border-emerald-200 space-y-4">
            <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
            <div className="space-y-1">
              <h1 className="text-lg font-bold text-zinc-900">This certificate is genuine</h1>
              <p className="text-sm text-zinc-500">Issued by MockExams</p>
            </div>
            <dl className="text-left space-y-2 pt-2 border-t border-zinc-100">
              <Row label="Awarded to" value={result.holder!} />
              <Row label="Exam" value={result.examTitle!} />
              <Row label="Score" value={`${result.percentage}%`} />
              <Row
                label="Issued"
                value={new Date(result.issuedAt!).toLocaleDateString(undefined, {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              />
            </dl>
          </div>
        ) : (
          <div className="p-6 rounded-xl bg-white border border-red-200 space-y-3">
            <XCircle className="w-10 h-10 text-red-500 mx-auto" />
            <h1 className="text-lg font-bold text-zinc-900">No certificate found</h1>
            <p className="text-sm text-zinc-500">
              The code <span className="font-mono text-zinc-700">{decodeURIComponent(code)}</span> does
              not match any certificate we have issued. Check for typos, or ask the holder to resend
              the link.
            </p>
          </div>
        )}

        <Link href="/" className="inline-block text-xs text-zinc-400 hover:text-primary-600">
          MockExams
        </Link>
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4">
      <dt className="text-xs font-semibold uppercase tracking-wide text-zinc-400">{label}</dt>
      <dd className="text-sm font-medium text-zinc-900 text-right">{value}</dd>
    </div>
  );
}
