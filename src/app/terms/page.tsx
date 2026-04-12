"use client";

import { motion } from "framer-motion";
import { Gavel, Scale, AlertCircle, Bookmark } from "lucide-react";

export default function TermsPage() {
  return (
    <div className="min-h-screen py-20 px-6 max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card p-12 rounded-[2.5rem] border-white/10"
      >
        <div className="flex items-center gap-4 mb-10 text-primary">
          <Scale className="w-10 h-10" />
          <h1 className="text-4xl font-black tracking-tight text-white">Terms of Service</h1>
        </div>

        <section className="space-y-8 text-slate-400 leading-relaxed">
          <div>
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <Gavel className="w-5 h-5 text-primary" />
              1. Academic Conduct
            </h2>
            <p>
              Users of MockExams agree to uphold the highest standards of academic honesty. 
              Any attempt to bypass examination security or manipulate score tracking will result in 
              permanent dismissal from the platform.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <Bookmark className="w-5 h-5 text-primary" />
              2. Intellectual Property
            </h2>
            <p>
              All examination content provided on MockExams is the intellectual property of its respective 
              expert authors. Unauthorized distribution or replication of question banks is strictly prohibited 
              under international copyright law and institutional regulations.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-primary" />
              3. Service Limitations
            </h2>
            <p>
              MockExams is provided as a scholarly tool. While we strive for 100% availability, the platform 
              is not liable for any discrepancies arising from server maintenance or local connectivity issues 
              during high-stakes mock sessions.
            </p>
          </div>

          <div className="pt-10 border-t border-white/5 text-sm">
            <p>Effective Date: April 11, 2026</p>
            <p>MockExams Project | Final Year Submission</p>
          </div>
        </section>
      </motion.div>
    </div>
  );
}
