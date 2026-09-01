"use client";

import { Award, Loader2, ArrowRight, Printer, Copy, Check } from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { auth } from "@/lib/firebase";

interface Certificate {
  id: string;
  code: string;
  user_name: string;
  exam_title: string;
  percentage: number;
  issued_at: string;
}

export default function CertificatesPage() {
  const { user, loading: authLoading } = useAuth();
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState<string | null>(null);

  const load = useCallback(async () => {
    const currentUser = auth.currentUser;
    if (!currentUser) return;
    try {
      const token = await currentUser.getIdToken();
      const res = await fetch("/api/me/certificates", {
        headers: { Authorization: `Bearer ${token}` },
        cache: "no-store",
      });
      if (res.ok) setCertificates((await res.json()).certificates ?? []);
    } catch (err) {
      console.error("Certificate load failed:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      setLoading(false);
      return;
    }
    load();
  }, [authLoading, user, load]);

  const copyLink = async (code: string) => {
    try {
      await navigator.clipboard.writeText(`${window.location.origin}/verify/${code}`);
      setCopied(code);
      setTimeout(() => setCopied(null), 2000);
    } catch {
      // Clipboard can be blocked; the code is visible on screen regardless.
    }
  };

  if (loading || authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-50/40">
        <Loader2 className="w-8 h-8 text-primary-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50/40 py-10 px-4 sm:px-6 print:bg-white print:py-0">
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="text-center space-y-2 print:hidden">
          <div className="w-12 h-12 rounded-xl bg-amber-50 border border-amber-200 text-amber-600 flex items-center justify-center mx-auto">
            <Award className="w-5 h-5" />
          </div>
          <h1 className="text-2xl font-bold text-zinc-900">Your certificates</h1>
          <p className="text-sm text-zinc-500 max-w-md mx-auto">
            Earned by scoring 80% or more on an exam. Each carries a code anyone can check —
            no account needed.
          </p>
        </div>

        {!user ? (
          <div className="text-center print:hidden">
            <Link
              href="/login"
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-md bg-primary-600 hover:bg-primary-700 text-white font-semibold text-sm"
            >
              Log in <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        ) : certificates.length === 0 ? (
          <div className="p-8 rounded-xl bg-white border border-zinc-200 text-center space-y-3 print:hidden">
            <p className="text-sm text-zinc-500">
              No certificates yet. Score 80% or above on any exam and one is issued automatically.
            </p>
            <Link
              href="/exams"
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-md bg-primary-600 hover:bg-primary-700 text-white font-semibold text-sm"
            >
              Browse exams <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {certificates.map((certificate) => (
              <div key={certificate.id} className="space-y-2">
                {/* The certificate itself — styled to survive print-to-PDF. */}
                <div className="p-8 sm:p-10 rounded-xl bg-white border-4 border-double border-amber-300 text-center space-y-4 print:break-inside-avoid">
                  <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-amber-700">
                    Certificate of Mastery
                  </p>
                  <p className="text-xs text-zinc-500">This is to certify that</p>
                  <p className="text-2xl font-bold text-zinc-900">{certificate.user_name}</p>
                  <p className="text-xs text-zinc-500">has demonstrated mastery in</p>
                  <p className="text-lg font-semibold text-zinc-800">{certificate.exam_title}</p>
                  <p className="text-sm text-zinc-600">
                    with a score of <strong>{certificate.percentage}%</strong>
                  </p>
                  <div className="pt-4 border-t border-zinc-100 flex flex-col sm:flex-row justify-between gap-2 text-[11px] text-zinc-400">
                    <span>
                      Issued {new Date(certificate.issued_at).toLocaleDateString(undefined, {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </span>
                    <span className="font-mono text-zinc-600">{certificate.code}</span>
                  </div>
                  <p className="text-[10px] text-zinc-400">
                    Verify at mockexams /verify/{certificate.code}
                  </p>
                </div>

                <div className="flex flex-wrap gap-2 justify-center print:hidden">
                  <button
                    onClick={() => window.print()}
                    className="inline-flex items-center gap-1.5 px-3 py-2 rounded-md border border-zinc-200 bg-white text-xs font-semibold text-zinc-700 hover:border-primary-300"
                  >
                    <Printer className="w-3.5 h-3.5" /> Print or save as PDF
                  </button>
                  <button
                    onClick={() => copyLink(certificate.code)}
                    className="inline-flex items-center gap-1.5 px-3 py-2 rounded-md border border-zinc-200 bg-white text-xs font-semibold text-zinc-700 hover:border-primary-300"
                  >
                    {copied === certificate.code ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-600" /> Link copied
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" /> Copy verification link
                      </>
                    )}
                  </button>
                  <Link
                    href={`/verify/${certificate.code}`}
                    className="inline-flex items-center gap-1.5 px-3 py-2 rounded-md border border-zinc-200 bg-white text-xs font-semibold text-zinc-700 hover:border-primary-300"
                  >
                    Check it yourself <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
