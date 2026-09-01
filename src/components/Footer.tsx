"use client";

import {
  BookOpen,
  Facebook,
  Twitter,
  Instagram,
  Github,
  Mail,
  MapPin,
  Phone,
} from "lucide-react";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-zinc-50 border-t border-zinc-200 pt-16 pb-8 text-zinc-600">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          <div className="md:col-span-1 space-y-4">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="w-7 h-7 rounded-md bg-primary-600 flex items-center justify-center">
                <BookOpen className="text-white w-4 h-4" />
              </div>
              <span className="text-sm font-bold text-zinc-900 tracking-tight">MockExams</span>
            </Link>
            <p className="text-zinc-500 text-sm leading-relaxed">
              Empowering students worldwide with guided exam preparation and high-quality mock tests.
              Join thousands of successful candidates today.
            </p>
            <div className="flex items-center gap-2 pt-1">
              <SocialIcon icon={<Facebook className="w-3.5 h-3.5" />} />
              <SocialIcon icon={<Twitter className="w-3.5 h-3.5" />} />
              <SocialIcon icon={<Instagram className="w-3.5 h-3.5" />} />
              <SocialIcon icon={<Github className="w-3.5 h-3.5" />} />
            </div>
          </div>

          <div>
            <h4 className="text-xs font-bold text-zinc-900 uppercase tracking-wide mb-4">Learning Tools</h4>
            <ul className="space-y-2.5 text-sm">
              <li><FooterLink href="/dashboard">Dashboard</FooterLink></li>
              <li><FooterLink href="/tutor">AI Tutor</FooterLink></li>
              <li><FooterLink href="/flashcards">FSRS Flashcards</FooterLink></li>
              <li><FooterLink href="/study-plan">Study Planner</FooterLink></li>
              <li><FooterLink href="/notes">Study Materials</FooterLink></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-bold text-zinc-900 uppercase tracking-wide mb-4">Exams &amp; Analytics</h4>
            <ul className="space-y-2.5 text-sm">
              <li><FooterLink href="/exams">Adaptive Exams</FooterLink></li>
              <li><FooterLink href="/analytics">Performance Analytics</FooterLink></li>
              <li><FooterLink href="/leaderboard">Leaderboard</FooterLink></li>
              <li><FooterLink href="/projects">Semester Projects</FooterLink></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-bold text-zinc-900 uppercase tracking-wide mb-4">Contact &amp; Support</h4>
            <ul className="space-y-3 text-sm text-zinc-500">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-3.5 h-3.5 mt-0.5 text-primary-600 shrink-0" />
                <span>Kathmandu, Nepal <br /> Tinkune &amp; New Baneshwor</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-3.5 h-3.5 text-primary-600 shrink-0" />
                <span>support@mockexams.com</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-3.5 h-3.5 text-primary-600 shrink-0" />
                <span>+977 1-4400000</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-6 border-t border-zinc-200 flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-zinc-400">
          <p suppressHydrationWarning>© {new Date().getFullYear()} MockExams Platform. All rights reserved.</p>
          <div className="flex gap-5">
            <Link href="/privacy" className="hover:text-zinc-700">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-zinc-700">Terms of Service</Link>
            <Link href="/cookies" className="hover:text-zinc-700">Cookie Settings</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link href={href} className="text-zinc-500 hover:text-primary-600 transition-colors">
      {children}
    </Link>
  );
}

function SocialIcon({ icon }: { icon: React.ReactNode }) {
  return (
    <div className="w-7 h-7 rounded-md bg-white border border-zinc-200 text-zinc-500 hover:text-primary-600 hover:border-primary-300 flex items-center justify-center cursor-pointer transition-colors">
      {icon}
    </div>
  );
}
