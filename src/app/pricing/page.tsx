"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Check, Zap, ShieldCheck, X, Loader2, ArrowRight, Wallet, Lock } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useEffect, useState } from "react";

interface SelectedPlan {
  offerId: string;
  planName: string;
  price: string;
  period?: string;
}

function EsewaLogo({ className = "w-8 h-8" }: { className?: string }) {
  return (
    <div className={`rounded-xl bg-[#60BB46] flex items-center justify-center text-white font-extrabold shadow-sm ${className}`}>
      <svg viewBox="0 0 48 48" fill="none" className="w-6 h-6" xmlns="http://www.w3.org/2000/svg">
        <rect width="48" height="48" rx="10" fill="#60BB46"/>
        <path d="M24 10C16.268 10 10 16.268 10 24C10 31.732 16.268 38 24 38C31.732 38 38 31.732 38 24C38 16.268 31.732 10 24 10Z" fill="white"/>
        <path d="M24 14C18.477 14 14 18.477 14 24C14 29.523 18.477 34 24 34C29.523 34 34 29.523 34 24H24V14Z" fill="#60BB46"/>
        <circle cx="28" cy="20" r="3" fill="#60BB46"/>
      </svg>
    </div>
  );
}

function KhaltiLogo({ className = "w-8 h-8" }: { className?: string }) {
  return (
    <div className={`rounded-xl bg-[#5C2D91] flex items-center justify-center text-white font-extrabold shadow-sm ${className}`}>
      <svg viewBox="0 0 48 48" fill="none" className="w-6 h-6" xmlns="http://www.w3.org/2000/svg">
        <rect width="48" height="48" rx="10" fill="#5C2D91"/>
        <path d="M14 12V36H20V26.5L28 36H36L26 24L35 12H27.5L20 21.5V12H14Z" fill="white"/>
      </svg>
    </div>
  );
}

export default function PricingPage() {
  const { user } = useAuth();
  const [loadingProvider, setLoadingProvider] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [selectedPlan, setSelectedPlan] = useState<SelectedPlan | null>(null);

  const openPaymentModal = (offerId: string, planName: string, price: string, period?: string) => {
    if (!user) {
      window.location.href = "/login?redirect=/pricing";
      return;
    }
    setError(null);
    setSelectedPlan({ offerId, planName, price, period });
  };

  const handleCheckout = async (provider: string) => {
    if (!user || !selectedPlan) return;

    setLoadingProvider(provider);
    setError(null);
    try {
      const token = await user.getIdToken();
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ offerId: selectedPlan.offerId, provider }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Could not start checkout. Please try again.");
        setLoadingProvider(null);
        return;
      }

      if (data.url) {
        window.location.href = data.url;
        return;
      }

      if (data.formPost) {
        const form = document.createElement("form");
        form.method = "POST";
        form.action = data.formPost.action;
        Object.entries(data.formPost.fields as Record<string, string>).forEach(([name, value]) => {
          const input = document.createElement("input");
          input.type = "hidden";
          input.name = name;
          input.value = value;
          form.appendChild(input);
        });
        document.body.appendChild(form);
        form.submit();
        return;
      }

      setError("Checkout is unavailable right now.");
      setLoadingProvider(null);
    } catch (err) {
      console.error("Checkout error:", err);
      setError("Could not reach the payment service. Please try again.");
      setLoadingProvider(null);
    }
  };

  return (
    <div className="min-h-screen bg-mesh text-zinc-900 pt-8 pb-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-12">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary-50 border border-primary-200 text-primary-700 text-xs font-bold uppercase tracking-widest">
            <Zap className="w-4 h-4" />
            <span>Student Membership</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-zinc-900 tracking-tight">
            Transparent Pricing <br />
            <span className="text-gradient">For Every Student</span>
          </h1>
          <p className="text-zinc-600 text-sm sm:text-base font-medium">
            Invest in your academic potential. Choose the plan that fits your semester goals.
          </p>
        </div>

        {error && !selectedPlan && (
          <div className="max-w-2xl mx-auto px-4 py-3 rounded-lg bg-red-50 border border-red-200 text-sm text-red-700 text-center">
            {error}
          </div>
        )}

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
            buttonText="Upgrade to Pro"
            onSelect={() => openPaymentModal("pro_monthly", "Pro Scholar", "NPR 499", "/month")}
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
            buttonText="Get Campus Plan"
            onSelect={() => openPaymentModal("campus_semester", "Campus License", "NPR 2,999", "/semester")}
          />
        </div>

        {/* Guarantee Banner */}
        <div className="p-8 rounded-xl bg-white border border-zinc-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6 max-w-4xl mx-auto text-zinc-700">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center flex-shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-zinc-900">100% Satisfaction Guarantee</h4>
              <p className="text-xs text-zinc-500">Cancel or change your plan at any time without extra fees.</p>
            </div>
          </div>
          <Link href="/exams" className="px-6 py-3 rounded-xl bg-zinc-100 hover:bg-zinc-200 text-zinc-900 font-bold text-xs transition-all">
            Try Free Mock Exam
          </Link>
        </div>
      </div>

      {/* Payment Wallet Selection Modal */}
      <AnimatePresence>
        {selectedPlan && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => !loadingProvider && setSelectedPlan(null)}
              className="absolute inset-0 bg-black/65 backdrop-blur-md"
            />

            {/* Dialog Panel */}
            <motion.div
              initial={{ opacity: 0, scale: 0.94, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.94, y: 20 }}
              transition={{ duration: 0.22, ease: "easeOut" }}
              className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-zinc-200 overflow-hidden z-10"
            >
              {/* Top Accent Header */}
              <div className="bg-gradient-to-r from-zinc-950 via-zinc-900 to-slate-900 text-white p-6 sm:p-8 relative">
                <button
                  onClick={() => !loadingProvider && setSelectedPlan(null)}
                  disabled={Boolean(loadingProvider)}
                  className="absolute top-5 right-5 text-zinc-400 hover:text-white p-2 rounded-xl bg-white/5 hover:bg-white/10 transition-colors"
                  aria-label="Close modal"
                >
                  <X className="w-5 h-5" />
                </button>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pr-10">
                  <div>
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-emerald-300 text-[11px] font-bold uppercase tracking-wider mb-2">
                      <Wallet className="w-3.5 h-3.5" />
                      Choose Payment Method
                    </div>
                    <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                      {selectedPlan.planName}
                    </h3>
                    <p className="text-xs sm:text-sm text-zinc-400 mt-0.5">
                      Select your digital wallet to activate instant Pro access
                    </p>
                  </div>

                  <div className="sm:text-right bg-white/5 sm:bg-transparent p-3 sm:p-0 rounded-xl border border-white/10 sm:border-0">
                    <div className="text-2xl sm:text-3xl font-black text-white">
                      {selectedPlan.price}
                    </div>
                    <div className="text-xs text-zinc-400 font-medium">
                      Billed {selectedPlan.period || "one-time"}
                    </div>
                  </div>
                </div>
              </div>

              {/* Body: Big Side-by-Side Cards */}
              <div className="p-6 sm:p-8 space-y-6 bg-zinc-50/50">
                {error && (
                  <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-xs sm:text-sm text-red-700 font-medium text-center">
                    {error}
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  {/* eSewa Big Card */}
                  <motion.button
                    whileHover={{ scale: 1.02, y: -3 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleCheckout("esewa")}
                    disabled={Boolean(loadingProvider)}
                    className="relative group p-6 rounded-2xl bg-white border-2 border-zinc-200 hover:border-[#60BB46] shadow-sm hover:shadow-xl hover:shadow-emerald-500/10 transition-all text-left flex flex-col justify-between min-h-[220px] disabled:opacity-60 overflow-hidden"
                  >
                    <div className="absolute top-0 right-0 left-0 h-1.5 bg-[#60BB46] opacity-0 group-hover:opacity-100 transition-opacity" />
                    
                    <div className="space-y-4">
                      {/* Big eSewa Official Logo Display */}
                      <div className="h-16 flex items-center justify-center p-2 rounded-xl bg-zinc-50 group-hover:bg-emerald-50/50 border border-zinc-100 group-hover:border-emerald-200 transition-colors">
                        <img
                          src="/esewa-logo.svg"
                          alt="eSewa Logo"
                          className="h-12 w-auto max-w-[200px] object-contain transition-transform group-hover:scale-105"
                        />
                      </div>

                      <div>
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-zinc-900 text-base group-hover:text-[#41A124] transition-colors">
                            eSewa Mobile
                          </span>
                          <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                            ePay v2
                          </span>
                        </div>
                        <p className="text-xs text-zinc-500 mt-1">
                          Direct checkout via eSewa account or linked bank accounts
                        </p>
                      </div>
                    </div>

                    <div className="pt-4 mt-4 border-t border-zinc-100 flex items-center justify-between">
                      <span className="text-xs font-bold text-[#41A124] group-hover:underline">
                        Pay with eSewa
                      </span>
                      {loadingProvider === "esewa" ? (
                        <Loader2 className="w-5 h-5 text-[#60BB46] animate-spin" />
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-emerald-50 group-hover:bg-[#60BB46] text-[#60BB46] group-hover:text-white flex items-center justify-center transition-colors">
                          <ArrowRight className="w-4 h-4" />
                        </div>
                      )}
                    </div>
                  </motion.button>

                  {/* Khalti Big Card */}
                  <motion.button
                    whileHover={{ scale: 1.02, y: -3 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleCheckout("khalti")}
                    disabled={Boolean(loadingProvider)}
                    className="relative group p-6 rounded-2xl bg-white border-2 border-zinc-200 hover:border-[#5C2D91] shadow-sm hover:shadow-xl hover:shadow-purple-500/10 transition-all text-left flex flex-col justify-between min-h-[220px] disabled:opacity-60 overflow-hidden"
                  >
                    <div className="absolute top-0 right-0 left-0 h-1.5 bg-[#5C2D91] opacity-0 group-hover:opacity-100 transition-opacity" />

                    <div className="space-y-4">
                      {/* Big Khalti Official Logo Display */}
                      <div className="h-16 flex items-center justify-center p-2 rounded-xl bg-zinc-50 group-hover:bg-purple-50/50 border border-zinc-100 group-hover:border-purple-200 transition-colors">
                        <img
                          src="/khalti-logo.svg"
                          alt="Khalti Logo"
                          className="h-12 w-auto max-w-[200px] object-contain transition-transform group-hover:scale-105"
                        />
                      </div>

                      <div>
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-zinc-900 text-base group-hover:text-[#5C2D91] transition-colors">
                            Khalti Wallet
                          </span>
                          <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-purple-100 text-purple-800">
                            Digital Pay
                          </span>
                        </div>
                        <p className="text-xs text-zinc-500 mt-1">
                          Pay with Khalti balance, mobile banking or Visa/MasterCard
                        </p>
                      </div>
                    </div>

                    <div className="pt-4 mt-4 border-t border-zinc-100 flex items-center justify-between">
                      <span className="text-xs font-bold text-[#5C2D91] group-hover:underline">
                        Pay with Khalti
                      </span>
                      {loadingProvider === "khalti" ? (
                        <Loader2 className="w-5 h-5 text-[#5C2D91] animate-spin" />
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-purple-50 group-hover:bg-[#5C2D91] text-[#5C2D91] group-hover:text-white flex items-center justify-center transition-colors">
                          <ArrowRight className="w-4 h-4" />
                        </div>
                      )}
                    </div>
                  </motion.button>
                </div>

                {/* Footer Security Badges */}
                <div className="pt-2 text-center flex flex-wrap items-center justify-center gap-4 text-xs text-zinc-500">
                  <span className="inline-flex items-center gap-1.5">
                    <Lock className="w-3.5 h-3.5 text-emerald-600" />
                    <span>256-Bit SSL Encrypted</span>
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-primary-600" />
                    <span>Instant Membership Activation</span>
                  </span>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
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
      className={`rounded-xl p-8 flex flex-col justify-between transition-all bg-white border ${
        featured 
          ? "border-primary-600 shadow-lg ring-2 ring-primary-600/20 relative" 
          : "border-zinc-200 shadow-sm"
      }`}
    >
      {featured && (
        <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-primary-600 text-white text-[10px] font-bold uppercase tracking-widest shadow-sm">
          Most Popular
        </div>
      )}

      <div className="space-y-6">
        <div>
          <h3 className="text-xl font-bold text-zinc-900">{title}</h3>
          <p className="text-xs text-zinc-500 mt-1 leading-relaxed">{description}</p>
        </div>

        <div className="flex items-baseline gap-1">
          <span className="text-4xl font-bold text-zinc-900">{price}</span>
          {period && <span className="text-xs font-bold text-zinc-400">{period}</span>}
        </div>

        <div className="space-y-3 pt-4 border-t border-zinc-100">
          <p className="text-[11px] font-bold uppercase tracking-wider text-zinc-400">Included Features</p>
          <ul className="space-y-2.5">
            {features.map((feat: string, idx: number) => (
              <li key={idx} className="flex items-start gap-2.5 text-xs text-zinc-700 font-medium">
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
          className={`w-full py-3.5 rounded-lg font-bold text-xs transition-all shadow-sm ${
            featured
              ? "bg-primary-600 hover:bg-primary-700 text-white shadow-primary-600/20"
              : "bg-zinc-100 hover:bg-zinc-200 text-zinc-900"
          }`}
        >
          {buttonText}
        </button>
      </div>
    </motion.div>
  );
}
