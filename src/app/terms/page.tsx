"use client";

import { motion } from "framer-motion";
import { Gavel, Scale, AlertCircle, Bookmark } from "lucide-react";

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-zinc-50/40 py-12 px-4 sm:px-6 max-w-3xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white p-8 sm:p-10 rounded-lg border border-zinc-200"
      >
        <div className="flex items-center gap-3 mb-8 text-primary-600">
          <Scale className="w-8 h-8" />
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900">Terms of Service</h1>
        </div>

        <section className="space-y-6 text-zinc-600 leading-relaxed text-sm">
          <div>
            <h2 className="text-base font-bold text-zinc-900 mb-2 flex items-center gap-2">
              <Gavel className="w-4 h-4 text-primary-600" />
              1. Academic conduct
            </h2>
            <p>
              Users of MockExams agree to uphold the highest standards of academic honesty.
              Any attempt to bypass examination security or manipulate score tracking will result in
              permanent dismissal from the platform.
            </p>
          </div>

          <div>
            <h2 className="text-base font-bold text-zinc-900 mb-2 flex items-center gap-2">
              <Bookmark className="w-4 h-4 text-primary-600" />
              2. Intellectual property
            </h2>
            <p>
              All examination content provided on MockExams is the intellectual property of its respective
              expert authors. Unauthorized distribution or replication of question banks is strictly prohibited
              under international copyright law and institutional regulations.
            </p>
          </div>

          <div>
            <h2 className="text-base font-bold text-zinc-900 mb-2 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-primary-600" />
              3. Service limitations
            </h2>
            <p>
              MockExams is provided as a scholarly tool. While we strive for 100% availability, the platform
              is not liable for any discrepancies arising from server maintenance or local connectivity issues
              during high-stakes mock sessions.
            </p>
          </div>

          <div className="pt-6 border-t border-zinc-100 text-xs text-zinc-400">
            <p>Effective date: April 11, 2026</p>
            <p>MockExams Project | Final Year Submission</p>
          </div>
        </section>
      </motion.div>
    </div>
  );
}
