"use client";

import { motion } from "framer-motion";
import { Shield, Lock, Eye, FileText } from "lucide-react";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen py-20 px-6 max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card p-12 rounded-[2.5rem] border-white/10"
      >
        <div className="flex items-center gap-4 mb-10 text-primary">
          <Shield className="w-10 h-10" />
          <h1 className="text-4xl font-black tracking-tight text-white">Privacy Policy</h1>
        </div>

        <section className="space-y-8 text-slate-400 leading-relaxed">
          <div>
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <Lock className="w-5 h-5 text-primary" />
              1. Information Collection
            </h2>
            <p>
              In accordance with academic integrity standards, MockExams collects basic profile information (name, email, institutional affiliation) 
              solely for the purpose of maintaining accurate academic records and performance tracking.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <Eye className="w-5 h-5 text-primary" />
              2. Data Usage & Scholarly Purpose
            </h2>
            <p>
              Data collected is utilized for internal benchmarking and individual progress reporting. 
              No student data is shared with third-party commercial entities. All analytical metrics are handled 
              within the secure Firebase infrastructure.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <FileText className="w-5 h-5 text-primary" />
              3. Academic Sovereignty
            </h2>
            <p>
              Students retain sovereignty over their examination attempts and performance data. 
              Request for data deletion is honored immediately upon verification of the student's unique identifier.
            </p>
          </div>

          <div className="pt-10 border-t border-white/5 text-sm">
            <p>Last Updated: April 11, 2026</p>
            <p>Institutional Contact: Department of Computer Engineering, IOE</p>
          </div>
        </section>
      </motion.div>
    </div>
  );
}
