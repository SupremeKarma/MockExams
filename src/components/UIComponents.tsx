"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ReactNode } from "react";

// =============================================================================
// CARD COMPONENTS
// =============================================================================

export function BaseCard({
  children,
  className = "",
  gradient = false,
}: {
  children: ReactNode;
  className?: string;
  gradient?: boolean;
}) {
  return (
    <div
      className={`rounded-3xl border border-slate-200 bg-white shadow-sm hover:shadow-md transition-all ${
        gradient ? "bg-gradient-to-br from-slate-50 to-slate-100" : ""
      } ${className}`}
    >
      {children}
    </div>
  );
}

export function StatCard({
  icon,
  label,
  value,
  subValue,
  trend,
}: {
  icon: ReactNode;
  label: string;
  value: string | number;
  subValue?: string;
  trend?: { value: number; direction: "up" | "down" };
}) {
  return (
    <BaseCard className="p-6 space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold text-slate-500 uppercase">{label}</span>
        <div className="p-2.5 rounded-xl bg-slate-100 text-indigo-600">{icon}</div>
      </div>

      <div className="space-y-1">
        <div className="text-3xl font-black text-slate-900">{value}</div>
        <p className="text-xs text-slate-600 font-medium">{subValue}</p>
      </div>

      {trend && (
        <div
          className={`text-xs font-bold flex items-center gap-1 ${
            trend.direction === "up" ? "text-emerald-600" : "text-rose-600"
          }`}
        >
          <span>{trend.direction === "up" ? "↗" : "↘"}</span>
          <span>{Math.abs(trend.value)}% from last week</span>
        </div>
      )}
    </BaseCard>
  );
}

export function FeatureCard({
  icon,
  title,
  description,
  href,
  badge,
  bgGradient,
}: {
  icon: ReactNode;
  title: string;
  description: string;
  href: string;
  badge?: string;
  bgGradient?: string;
}) {
  return (
    <Link href={href}>
      <motion.div
        whileHover={{ scale: 1.05, translateY: -4 }}
        className={`p-6 rounded-3xl border border-slate-200 bg-gradient-to-br ${bgGradient || "from-slate-50 to-slate-100"} cursor-pointer transition-all shadow-sm hover:shadow-md h-full flex flex-col`}
      >
        <div className="flex items-start justify-between mb-3">
          <div className="p-2.5 rounded-2xl bg-white/50 border border-white/50 text-indigo-600">
            {icon}
          </div>
          {badge && (
            <span className="px-2 py-1 rounded-full bg-indigo-600 text-white text-[10px] font-black">
              {badge}
            </span>
          )}
        </div>

        <h3 className="font-bold text-slate-900 text-sm mb-1">{title}</h3>
        <p className="text-xs text-slate-700 leading-relaxed flex-1 mb-3">{description}</p>

        <div className="flex items-center text-indigo-600 font-bold text-xs">
          Explore →
        </div>
      </motion.div>
    </Link>
  );
}

// =============================================================================
// BADGE COMPONENTS
// =============================================================================

export function StatusBadge({
  status,
}: {
  status: "completed" | "in-progress" | "pending" | "weak" | "mastered";
}) {
  const config = {
    completed: { bg: "bg-emerald-50", border: "border-emerald-200", text: "text-emerald-700" },
    "in-progress": { bg: "bg-amber-50", border: "border-amber-200", text: "text-amber-700" },
    pending: { bg: "bg-slate-50", border: "border-slate-200", text: "text-slate-700" },
    weak: { bg: "bg-rose-50", border: "border-rose-200", text: "text-rose-700" },
    mastered: { bg: "bg-emerald-50", border: "border-emerald-200", text: "text-emerald-700" },
  };

  const { bg, border, text } = config[status];

  return (
    <span className={`px-2.5 py-1 rounded-full border text-xs font-bold ${bg} ${border} ${text}`}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
}

export function DifficultyBadge({ difficulty }: { difficulty: "Easy" | "Medium" | "Hard" }) {
  const config = {
    Easy: { bg: "bg-emerald-50", text: "text-emerald-700" },
    Medium: { bg: "bg-amber-50", text: "text-amber-700" },
    Hard: { bg: "bg-rose-50", text: "text-rose-700" },
  };

  const { bg, text } = config[difficulty];

  return (
    <span className={`px-3 py-1 rounded-full text-xs font-bold border ${bg} ${text} ${bg.replace("50", "200")}`}>
      {difficulty}
    </span>
  );
}

// =============================================================================
// BUTTON COMPONENTS
// =============================================================================

export function PrimaryButton({
  children,
  href,
  onClick,
  disabled,
  icon,
}: {
  children: ReactNode;
  href?: string;
  onClick?: () => void;
  disabled?: boolean;
  icon?: ReactNode;
}) {
  const content = (
    <button
      onClick={onClick}
      disabled={disabled}
      className="px-6 py-3 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold text-xs hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2 shadow-md hover:scale-105 active:scale-95"
    >
      {icon}
      {children}
    </button>
  );

  if (href) {
    return <Link href={href}>{content}</Link>;
  }

  return content;
}

export function SecondaryButton({
  children,
  href,
  onClick,
  icon,
}: {
  children: ReactNode;
  href?: string;
  onClick?: () => void;
  icon?: ReactNode;
}) {
  const content = (
    <button
      onClick={onClick}
      className="px-6 py-3 rounded-2xl bg-slate-50 hover:bg-slate-100 text-slate-700 font-bold text-xs border border-slate-200 transition-all flex items-center gap-2"
    >
      {icon}
      {children}
    </button>
  );

  if (href) {
    return <Link href={href}>{content}</Link>;
  }

  return content;
}

// =============================================================================
// PROGRESS COMPONENTS
// =============================================================================

export function ProgressBar({
  percentage,
  label,
  showLabel = true,
}: {
  percentage: number;
  label?: string;
  showLabel?: boolean;
}) {
  return (
    <div className="space-y-1">
      {showLabel && label && (
        <div className="flex justify-between text-xs font-bold text-slate-600">
          <span>{label}</span>
          <span>{percentage}%</span>
        </div>
      )}
      <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden border border-slate-200">
        <motion.div
          className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.5 }}
        />
      </div>
    </div>
  );
}

export function CircleProgress({
  percentage,
  size = 120,
  label,
}: {
  percentage: number;
  size?: number;
  label?: string;
}) {
  const radius = size / 2 - 8;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <div className="flex flex-col items-center justify-center">
      <svg width={size} height={size} className="transform -rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#e2e8f0"
          strokeWidth="3"
          fill="none"
        />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="url(#gradient)"
          strokeWidth="3"
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 0.5 }}
        />
        <defs>
          <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#4f46e5" />
            <stop offset="100%" stopColor="#7c3aed" />
          </linearGradient>
        </defs>
      </svg>
      <div className="text-center mt-2">
        <div className="text-2xl font-black text-slate-900">{percentage}%</div>
        {label && <p className="text-xs text-slate-600">{label}</p>}
      </div>
    </div>
  );
}

// =============================================================================
// HEADER COMPONENTS
// =============================================================================

export function PageHeader({
  badge,
  title,
  subtitle,
  actions,
}: {
  badge?: string;
  title: string;
  subtitle?: string;
  actions?: ReactNode;
}) {
  return (
    <div className="relative rounded-3xl p-8 sm:p-12 overflow-hidden border border-slate-200 bg-white shadow-sm">
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 via-transparent to-purple-50 opacity-50" />

      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
        <div className="flex-1 space-y-4">
          {badge && (
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-100 border border-indigo-300 text-indigo-700 text-xs font-black uppercase tracking-widest w-fit">
              {badge}
            </div>
          )}

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-tight">
            {title}
          </h1>

          {subtitle && <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl">{subtitle}</p>}
        </div>

        {actions && <div className="flex flex-col gap-3 w-full md:w-auto">{actions}</div>}
      </div>
    </div>
  );
}

// =============================================================================
// EMPTY STATE COMPONENTS
// =============================================================================

export function EmptyState({
  icon,
  title,
  description,
  action,
}: {
  icon: ReactNode;
  title: string;
  description: string;
  action?: { label: string; href: string };
}) {
  return (
    <div className="p-12 text-center rounded-3xl bg-white border border-dashed border-slate-200 space-y-4">
      <div className="flex justify-center">{icon}</div>
      <div>
        <h3 className="text-lg font-bold text-slate-900 mb-2">{title}</h3>
        <p className="text-sm text-slate-600">{description}</p>
      </div>
      {action && (
        <Link
          href={action.href}
          className="inline-block px-6 py-2.5 bg-indigo-600 text-white rounded-xl font-bold text-xs hover:bg-indigo-700 transition-all"
        >
          {action.label}
        </Link>
      )}
    </div>
  );
}

// =============================================================================
// ALERT COMPONENTS
// =============================================================================

export function Alert({
  type,
  title,
  description,
  icon,
}: {
  type: "info" | "success" | "warning" | "error";
  title: string;
  description?: string;
  icon?: ReactNode;
}) {
  const config = {
    info: { bg: "bg-blue-50", border: "border-blue-200", text: "text-blue-700", icon_color: "text-blue-600" },
    success: { bg: "bg-emerald-50", border: "border-emerald-200", text: "text-emerald-700", icon_color: "text-emerald-600" },
    warning: { bg: "bg-amber-50", border: "border-amber-200", text: "text-amber-700", icon_color: "text-amber-600" },
    error: { bg: "bg-rose-50", border: "border-rose-200", text: "text-rose-700", icon_color: "text-rose-600" },
  };

  const { bg, border, text, icon_color } = config[type];

  return (
    <div className={`p-4 rounded-2xl border ${bg} ${border} ${text} space-y-2`}>
      <div className="flex items-start gap-3">
        {icon && <div className={`mt-0.5 ${icon_color}`}>{icon}</div>}
        <div className="flex-1">
          <h4 className="font-bold text-sm">{title}</h4>
          {description && <p className="text-xs mt-1 opacity-80">{description}</p>}
        </div>
      </div>
    </div>
  );
}
