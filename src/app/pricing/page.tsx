"use client";

import { motion } from "framer-motion";
import { Check, Zap, Star, ShieldCheck, HelpCircle } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useState } from "react";

export default function PricingPage() {
  const { user } = useAuth();
  const [loading, setLoading] = useState<string | null>(null);

  const handleCheckout = async (priceId: string, planName: string) => {
    if (!user) {
      window.location.href = "/login?redirect=/pricing";
      return;
    }

    setLoading(planName);
    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          priceId,
          userId: user.uid,
          email: user.email,
        }),
      });

      const data = await response.json();
      if (data.url) {
        window.location.href = data.url;
      }
    } catch (err) {
      console.error("Checkout error:", err);
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="min-h-screen bg-mesh text-slate-900 pt-28 pb-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-12">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-black uppercase tracking-widest">
            <Zap className="w-4 h-4" />
            <span>Student Membership</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight">
            Transparent Pricing <br />
            <span className="text-gradient">For Every Student</span>
          </h1>
          <p className="text-slate-600 text-sm sm:text-base font-medium">
            Invest in your academic potential. Choose the plan that fits your semester goals.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
          {/* Basic Plan */}
          <PricingCard 
            title="Starter"
            price="Free"
            description="Perfect for casual practice and exploring concepts."
            features={[
              "Unlimited standard BIT notes",
              "10 FSRS flashcards / day",
              "Public exams access",
              "Global leaderboard ranking",
              "Community discord access"
            ]}
            buttonText="Get Started"
            onSelect={() => window.location.href = "/signup"}
          />

          {/* Pro Plan */}
          <PricingCard 
            title="Pro Scholar"
            price="NPR 499"
            period="/month"
            description="Our most popular plan for engineering & entrance mastery."
            features={[
              "Unlimited Mock Exam simulations",
              "Unlimited FSRS v6 active recall cards",
              "Full 8-Semester verified code repository",
              "Deep diagnostic weakness analysis",
              "24/7 Socratic AI Tutor companion",
              "Offline question PDF exports"
            ]}
            featured={true}
            buttonText={loading === "Pro Scholar" ? "Redirecting..." : "Upgrade to Pro"}
            onSelect={() => handleCheckout("price_pro_monthly", "Pro Scholar")}
          />

          {/* Institution Plan */}
          <PricingCard 
            title="Campus License"
            price="NPR 2,999"
            period="/semester"
            description="For study cohorts and affiliated university colleges."
            features={[
              "All Pro features for 10 students",
              "Private cohort exam rooms",
              "Campus-specific leaderboards",
              "Instructor question bank creator",
              "Priority support & syllabus sync"
            ]}
            buttonText="Contact for Campus"
            onSelect={() => window.location.href = "mailto:support@mockexams.com"}
          />
        </div>

        {/* Guarantee Banner */}
        <div className="p-8 rounded-3xl bg-white border border-slate-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6 max-w-4xl mx-auto text-slate-700">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center flex-shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-slate-900">100% Satisfaction Guarantee</h4>
              <p className="text-xs text-slate-500">Cancel or change your plan at any time without extra fees.</p>
            </div>
          </div>
          <Link href="/exams" className="px-6 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-900 font-bold text-xs transition-all">
            Try Free Mock Exam
          </Link>
        </div>
      </div>
    </div>
  );
}

function PricingCard({ 
  title, 
  price, 
  period, 
  description, 
  features, 
  featured, 
  buttonText, 
  onSelect 
}: any) {
  return (
    <motion.div
      whileHover={{ y: -5 }}
      className={`rounded-3xl p-8 flex flex-col justify-between transition-all bg-white border ${
        featured 
          ? "border-indigo-600 shadow-lg ring-2 ring-indigo-600/20 relative" 
          : "border-slate-200 shadow-sm"
      }`}
    >
      {featured && (
        <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-indigo-600 text-white text-[10px] font-black uppercase tracking-widest shadow-sm">
          Most Popular
        </div>
      )}

      <div className="space-y-6">
        <div>
          <h3 className="text-xl font-bold text-slate-900">{title}</h3>
          <p className="text-xs text-slate-500 mt-1 leading-relaxed">{description}</p>
        </div>

        <div className="flex items-baseline gap-1">
          <span className="text-4xl font-black text-slate-900">{price}</span>
          {period && <span className="text-xs font-bold text-slate-400">{period}</span>}
        </div>

        <div className="space-y-3 pt-4 border-t border-slate-100">
          <p className="text-[11px] font-black uppercase tracking-wider text-slate-400">Included Features</p>
          <ul className="space-y-2.5">
            {features.map((feat: string, idx: number) => (
              <li key={idx} className="flex items-start gap-2.5 text-xs text-slate-700 font-medium">
                <Check className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                <span>{feat}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="pt-8">
        <button
          onClick={onSelect}
          className={`w-full py-3.5 rounded-2xl font-bold text-xs transition-all shadow-sm ${
            featured
              ? "bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-600/20"
              : "bg-slate-100 hover:bg-slate-200 text-slate-900"
          }`}
        >
          {buttonText}
        </button>
      </div>
    </motion.div>
  );
}
