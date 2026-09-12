import { AlertCircle, CheckCircle2, ShieldCheck } from "lucide-react";

type Level = "ai_draft" | "code_verified" | "teacher_verified";

// The blueprint's trust ladder, made visible on every page.
//
// A student must always be able to tell how much to rely on what they are
// reading. Showing nothing would implicitly claim "checked" for content nobody
// has checked, which is the one claim this system must never make by accident.
const CONFIG: Record<Level, { label: string; hint: string; className: string; Icon: typeof AlertCircle }> = {
  ai_draft: {
    label: "AI draft",
    hint: "Written by AI and not yet reviewed by a teacher. Check anything you plan to memorise.",
    className: "ex-trust ex-trust--draft",
    Icon: AlertCircle,
  },
  code_verified: {
    label: "Code-verified",
    hint: "The numerical answers on this page are recomputed by a test that must pass before it publishes.",
    className: "ex-trust ex-trust--code",
    Icon: CheckCircle2,
  },
  teacher_verified: {
    label: "Teacher-verified",
    hint: "Checked and approved by a verified teacher.",
    className: "ex-trust ex-trust--teacher",
    Icon: ShieldCheck,
  },
};

export function TrustBadge({ level }: { level: Level }) {
  const { label, hint, className, Icon } = CONFIG[level] ?? CONFIG.ai_draft;
  return (
    <p className={className}>
      <Icon className="w-3.5 h-3.5" aria-hidden="true" />
      <strong>{label}</strong>
      <span className="ex-trust__hint">{hint}</span>
    </p>
  );
}
