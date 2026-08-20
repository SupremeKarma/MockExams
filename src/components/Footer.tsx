"use client";

import { BookOpen, Facebook, Twitter, Instagram, Github, Mail, MapPin, Phone } from "lucide-react";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-slate-50 border-t border-slate-200 pt-20 pb-10 text-slate-600">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div className="md:col-span-1 space-y-4">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center">
                <BookOpen className="text-white w-5 h-5" />
              </div>
              <span className="text-lg font-black text-slate-900 tracking-tight">MockExams</span>
            </Link>
            <p className="text-slate-500 text-sm leading-relaxed">
              Empowering students worldwide with guided exam preparation and high-quality mock tests. 
              Join thousands of successful candidates today.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <SocialIcon icon={<Facebook className="w-4 h-4" />} />
              <SocialIcon icon={<Twitter className="w-4 h-4" />} />
              <SocialIcon icon={<Instagram className="w-4 h-4" />} />
              <SocialIcon icon={<Github className="w-4 h-4" />} />
            </div>
          </div>

          <div>
            <h4 className="font-bold text-slate-900 mb-6">Study Hub</h4>
            <ul className="space-y-3 text-sm">
              <li><FooterLink href="/notes">BIT Semester Notes</FooterLink></li>
              <li><FooterLink href="/flashcards">FSRS Flashcards</FooterLink></li>
              <li><FooterLink href="/analytics">Weakness Diagnostics</FooterLink></li>
              <li><FooterLink href="/projects">Semester Projects</FooterLink></li>
              <li><FooterLink href="/syllabus">University Syllabus</FooterLink></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-slate-900 mb-6">Exams & Rankings</h4>
            <ul className="space-y-3 text-sm">
              <li><FooterLink href="/exams">Live Mock Exams</FooterLink></li>
              <li><FooterLink href="/learn">Entrance Masterclass</FooterLink></li>
              <li><FooterLink href="/leaderboard">Global Leaderboard</FooterLink></li>
              <li><FooterLink href="/pricing">Pro Membership</FooterLink></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-slate-900 mb-6">Contact & Support</h4>
            <ul className="space-y-4 text-sm text-slate-500">
              <li className="flex items-start gap-3">
                <MapPin className="w-4 h-4 mt-0.5 text-indigo-600" />
                <span>Kathmandu, Nepal <br /> Tinkune & New Baneshwor</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-indigo-600" />
                <span>support@mockexams.com</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-indigo-600" />
                <span>+977 1-4400000</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-200 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <p>© {new Date().getFullYear()} MockExams Platform. All rights reserved.</p>
          <div className="flex gap-6">
            <Link href="/privacy" className="hover:text-slate-700">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-slate-700">Terms of Service</Link>
            <Link href="/cookies" className="hover:text-slate-700">Cookie Settings</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link href={href} className="text-slate-500 hover:text-indigo-600 transition-colors">
      {children}
    </Link>
  );
}

function SocialIcon({ icon }: { icon: React.ReactNode }) {
  return (
    <div className="w-8 h-8 rounded-lg bg-white border border-slate-200 text-slate-600 hover:text-indigo-600 hover:border-indigo-300 flex items-center justify-center cursor-pointer transition-all shadow-2xs">
      {icon}
    </div>
  );
}
