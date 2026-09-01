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
      className={`rounded-lg border border-zinc-200 bg-white shadow-xs hover:shadow-sm transition-shadow ${
        gradient ? "bg-gradient-to-br from-zinc-50 to-zinc-100" : ""
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
    <BaseCard className="p-5 space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-semibold text-zinc-500 uppercase tracking-wider">{label}</span>
        <div className="p-2 rounded-md bg-primary-50 text-primary-600">{icon}</div>
      </div>

      <div className="space-y-0.5">
        <div className="text-2xl font-bold text-zinc-900 tabular-nums">{value}</div>
        {subValue && <p className="text-xs text-zinc-500 font-medium">{subValue}</p>}
      </div>

      {trend && (
        <div
          className={`text-xs font-semibold flex items-center gap-1 ${
            trend.direction === "up" ? "text-emerald-600" : "text-red-600"
          }`}
        >
          <span>{trend.direction === "up" ? "↑" : "↓"}</span>
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
        whileHover={{ y: -2 }}
        transition={{ duration: 0.15 }}
        className="group p-5 rounded-lg border border-zinc-200 bg-white cursor-pointer transition-colors shadow-xs hover:shadow-sm hover:border-primary-300 h-full flex flex-col"
      >
        <div className="flex items-start justify-between mb-3">
          <div className={`p-2.5 rounded-md ${bgGradient || "bg-primary-50 text-primary-600"}`}>
            {icon}
          </div>
          {badge && (
            <span className="px-2 py-0.5 rounded-full bg-primary-600 text-white text-[10px] font-bold uppercase tracking-wide">
              {badge}
            </span>
          )}
        </div>

        <h3 className="font-semibold text-zinc-900 text-sm mb-1">{title}</h3>
        <p className="text-xs text-zinc-500 leading-relaxed flex-1 mb-3">{description}</p>

        <div className="flex items-center text-primary-600 font-semibold text-xs gap-1 group-hover:gap-1.5 transition-all">
          Explore <span aria-hidden>→</span>
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
    pending: { bg: "bg-zinc-50", border: "border-zinc-200", text: "text-zinc-600" },
    weak: { bg: "bg-red-50", border: "border-red-200", text: "text-red-700" },
    mastered: { bg: "bg-emerald-50", border: "border-emerald-200", text: "text-emerald-700" },
  };

  const { bg, border, text } = config[status];

  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full border text-[11px] font-semibold ${bg} ${border} ${text}`}>
      {status.charAt(0).toUpperCase() + status.slice(1).replace("-", " ")}
    </span>
  );
}

export function DifficultyBadge({ difficulty }: { difficulty: "Easy" | "Medium" | "Hard" }) {
  const config = {
    Easy: { bg: "bg-emerald-50", text: "text-emerald-700", border: "border-emerald-200" },
    Medium: { bg: "bg-amber-50", text: "text-amber-700", border: "border-amber-200" },
    Hard: { bg: "bg-red-50", text: "text-red-700", border: "border-red-200" },
  };

  const { bg, text, border } = config[difficulty];

  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold border ${bg} ${text} ${border}`}>
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
      className="px-4 py-2.5 rounded-md bg-primary-600 hover:bg-primary-700 text-white font-semibold text-sm disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2 shadow-button"
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
      className="px-4 py-2.5 rounded-md bg-white hover:bg-zinc-50 text-zinc-700 font-semibold text-sm border border-zinc-200 transition-colors flex items-center justify-center gap-2"
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
    <div className="space-y-1.5">
      {showLabel && label && (
        <div className="flex justify-between text-xs font-semibold text-zinc-600">
          <span>{label}</span>
          <span className="tabular-nums">{percentage}%</span>
        </div>
      )}
      <div className="w-full h-1.5 rounded-full bg-zinc-100 overflow-hidden">
        <motion.div
          className="h-full bg-primary-600 rounded-full"
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
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#e4e4e7"
          strokeWidth="3"
          fill="none"
        />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#4338ca"
          strokeWidth="3"
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 0.5 }}
        />
      </svg>
      <div className="text-center mt-2">
        <div className="text-xl font-bold text-zinc-900 tabular-nums">{percentage}%</div>
        {label && <p className="text-xs text-zinc-500">{label}</p>}
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
    <div className="relative rounded-lg p-6 sm:p-8 overflow-hidden border border-zinc-200 bg-white">
      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex-1 space-y-3">
          {badge && (
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-primary-50 border border-primary-200 text-primary-700 text-[11px] font-bold uppercase tracking-wider w-fit">
              {badge}
            </div>
          )}

          <h1 className="text-2xl md:text-3xl font-bold text-zinc-900 tracking-tight leading-tight">
            {title}
          </h1>

          {subtitle && <p className="text-sm text-zinc-500 leading-relaxed max-w-2xl">{subtitle}</p>}
        </div>

        {actions && <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">{actions}</div>}
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
    <div className="p-10 text-center rounded-lg bg-zinc-50/60 border border-dashed border-zinc-300 space-y-3">
      <div className="flex justify-center text-zinc-400">{icon}</div>
      <div>
        <h3 className="text-sm font-semibold text-zinc-900 mb-1">{title}</h3>
        <p className="text-xs text-zinc-500">{description}</p>
      </div>
      {action && (
        <Link
          href={action.href}
          className="inline-block px-4 py-2 bg-primary-600 text-white rounded-md font-semibold text-xs hover:bg-primary-700 transition-colors"
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
    info: { bg: "bg-sky-50", border: "border-sky-200", text: "text-sky-800", icon_color: "text-sky-600" },
    success: { bg: "bg-emerald-50", border: "border-emerald-200", text: "text-emerald-800", icon_color: "text-emerald-600" },
    warning: { bg: "bg-amber-50", border: "border-amber-200", text: "text-amber-800", icon_color: "text-amber-600" },
    error: { bg: "bg-red-50", border: "border-red-200", text: "text-red-800", icon_color: "text-red-600" },
  };

  const { bg, border, text, icon_color } = config[type];

  return (
    <div className={`p-3.5 rounded-md border ${bg} ${border} ${text}`}>
      <div className="flex items-start gap-3">
        {icon && <div className={`mt-0.5 ${icon_color}`}>{icon}</div>}
        <div className="flex-1">
          <h4 className="font-semibold text-sm">{title}</h4>
          {description && <p className="text-xs mt-0.5 opacity-90">{description}</p>}
        </div>
      </div>
    </div>
  );
}

// =============================================================================
// SECTION / TABLE PRIMITIVES (new — for enterprise data-dense pages)
// =============================================================================

export function SectionCard({
  title,
  description,
  actions,
  children,
  className = "",
}: {
  title?: string;
  description?: string;
  actions?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`rounded-lg border border-zinc-200 bg-white shadow-xs ${className}`}>
      {(title || actions) && (
        <div className="flex items-center justify-between gap-4 px-5 py-4 border-b border-zinc-100">
          <div>
            {title && <h2 className="text-sm font-semibold text-zinc-900">{title}</h2>}
            {description && <p className="text-xs text-zinc-500 mt-0.5">{description}</p>}
          </div>
          {actions && <div className="flex items-center gap-2 shrink-0">{actions}</div>}
        </div>
      )}
      <div className="p-5">{children}</div>
    </div>
  );
}
