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
    <div className="max-w-7xl mx-auto px-6 py-20 pb-40">
      <div className="text-center mb-20">
        <h1 className="text-4xl md:text-6xl font-bold mb-6">Simple, Transparent <br /> <span className="text-gradient">Pricing for Students</span></h1>
        <p className="text-slate-400 max-w-2xl mx-auto text-lg">
          Invest in your future. Choose the plan that fits your preparation goals.
          No hidden fees, cancel anytime.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
        {/* Basic Plan */}
        <PricingCard 
          title="Starter"
          price="Free"
          description="Perfect for casual practice and exploring concepts."
          features={[
            "5 Mock Exams per month",
            "Basic performance stats",
            "Public leaderboard access",
            "Email support"
          ]}
          onClick={() => window.location.href = "/dashboard"}
        />

        {/* Pro Plan */}
        <PricingCard 
          title="Pro"
          price="NPR 999"
          period="/month"
          description="Our most popular plan for serious exam candidates."
          features={[
            "Unlimited Mock Exams",
            "AI-powered analytics",
            "Personalized study plans",
            "Priority support",
            "Dark mode exclusive themes",
            "Early access to new features"
          ]}
          popular={true}
          loading={loading === "Pro"}
          onClick={() => handleCheckout("price_PRO_PLAN_ID", "Pro")}
          cta="Upgrade Now"
        />

        {/* Institution Plan */}
        <PricingCard 
          title="Institution"
          price="Contact Us"
          description="Volume licensing for schools and coaching centers."
          features={[
            "Bulk student management",
            "Custom exam creation",
            "Advanced department analytics",
            "Dedicated account manager",
            "API Access",
            "White-label options"
          ]}
          onClick={() => window.location.href = "mailto:sales@examai.com"}
          cta="Contact Sales"
        />
      </div>

      {/* FAQ Preview */}
      <div className="mt-40 max-w-3xl mx-auto">
        <div className="flex items-center gap-2 justify-center mb-10">
          <HelpCircle className="w-6 h-6 text-primary" />
          <h2 className="text-2xl font-bold">Frequently Asked Questions</h2>
        </div>
        
        <div className="space-y-6">
          <FAQItem 
            question="Can I upgrade or downgrade my plan later?"
            answer="Yes, you can change your plan at any time from your account settings. Pro-rated charges will apply."
          />
          <FAQItem 
            question="What payment methods do you accept?"
            answer="We accept Esewa, Khalti, IME Pay, and all major international credit cards via Stripe."
          />
          <FAQItem 
            question="Is there a student discount available?"
            answer="Our Starter plan is free forever, and the Pro plan is already priced competitively for students."
          />
        </div>
      </div>
    </div>
  );
}

interface PricingCardProps {
  title: string;
  price: string;
  period?: string;
  description: string;
  features: string[];
  popular?: boolean;
  cta?: string;
  onClick?: () => void;
  loading?: boolean;
}

function PricingCard({ title, price, period, description, features, popular, cta = "Get Started", onClick, loading }: PricingCardProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
      className={`relative p-8 rounded-3xl flex flex-col h-full ${
        popular 
          ? "glass bg-primary/5 border-primary/50 shadow-2xl shadow-primary/10 scale-105 z-10" 
          : "glass-card border-white/5 hover:border-white/20"
      }`}
    >
      {popular && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-primary text-white text-xs font-bold rounded-full uppercase tracking-widest shadow-lg">
          Recommended
        </div>
      )}

      <div className="mb-8">
        <h3 className="text-xl font-bold mb-2">{title}</h3>
        <div className="flex items-baseline gap-1 mb-4">
          <span className="text-4xl font-extrabold">{price}</span>
          {period && <span className="text-slate-400">{period}</span>}
        </div>
        <p className="text-sm text-slate-400 leading-relaxed">{description}</p>
      </div>

      <div className="space-y-4 mb-10 flex-1">
        {features.map((feature, i) => (
          <div key={i} className="flex items-start gap-3">
            <div className={`mt-0.5 w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${
              popular ? "bg-primary/20 text-primary" : "bg-white/5 text-slate-500"
            }`}>
              <Check className="w-3 h-3" />
            </div>
            <span className="text-sm text-slate-300">{feature}</span>
          </div>
        ))}
      </div>

      <button 
        onClick={onClick}
        disabled={loading}
        className={`w-full py-4 rounded-xl font-bold transition-all flex items-center justify-center gap-2 ${
        popular 
          ? "bg-primary text-white hover:bg-primary-dark shadow-lg shadow-primary/25" 
          : "bg-white/5 text-white hover:bg-white/10"
      } disabled:opacity-50`}>
        {loading && <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />}
        {cta}
      </button>
    </motion.div>
  );
}

function FAQItem({ question, answer }: { question: string, answer: string }) {
  return (
    <div className="glass-card p-6 rounded-2xl">
      <h4 className="font-bold mb-3">{question}</h4>
      <p className="text-slate-400 text-sm leading-relaxed">{answer}</p>
    </div>
  );
}
