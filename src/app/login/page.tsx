"use client";

import Link from "next/link";
import { MoveLeft } from "lucide-react";
import { StuDocuAuthCard } from "@/components/auth/StuDocuAuthCard";

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-50 via-white to-zinc-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md px-4 mb-4">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-zinc-500 hover:text-zinc-900 transition-colors"
        >
          <MoveLeft className="w-3.5 h-3.5" /> Back to Home
        </Link>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md px-4">
        <StuDocuAuthCard initialMode="login" isModal={false} />
      </div>
    </div>
  );
}
