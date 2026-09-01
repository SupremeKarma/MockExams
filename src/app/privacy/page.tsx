"use client";

import { motion } from "framer-motion";
import { Shield, Lock, Eye, FileText } from "lucide-react";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-zinc-50/40 py-12 px-4 sm:px-6 max-w-3xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white p-8 sm:p-10 rounded-lg border border-zinc-200"
      >
        <div className="flex items-center gap-3 mb-8 text-primary-600">
          <Shield className="w-8 h-8" />
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900">Privacy Policy</h1>
        </div>

        <section className="space-y-6 text-zinc-600 leading-relaxed text-sm">
          <div>
            <h2 className="text-base font-bold text-zinc-900 mb-2 flex items-center gap-2">
              <Lock className="w-4 h-4 text-primary-600" />
              1. Information Collection
            </h2>
            <p>
              In accordance with academic integrity standards, MockExams collects basic profile information (name, email, institutional affiliation)
              solely for the purpose of maintaining accurate academic records and performance tracking.
            </p>
          </div>

          <div>
            <h2 className="text-base font-bold text-zinc-900 mb-2 flex items-center gap-2">
              <Eye className="w-4 h-4 text-primary-600" />
              2. Data usage & scholarly purpose
            </h2>
            <p>
              Data collected is utilized for internal benchmarking and individual progress reporting.
              No student data is shared with third-party commercial entities. All analytical metrics are handled
              within secure Firebase infrastructure.
            </p>
          </div>

          <div>
            <h2 className="text-base font-bold text-zinc-900 mb-2 flex items-center gap-2">
              <FileText className="w-4 h-4 text-primary-600" />
              3. Academic sovereignty
            </h2>
            <p>
              Students retain sovereignty over their examination attempts and performance data.
              Requests for data deletion are honored immediately upon verification of the student&apos;s unique identifier.
            </p>
          </div>

          <div className="pt-6 border-t border-zinc-100 text-xs text-zinc-400">
            <p>Last updated: April 11, 2026</p>
            <p>Institutional contact: Department of Computer Engineering, IOE</p>
          </div>
        </section>
      </motion.div>
    </div>
  );
}
