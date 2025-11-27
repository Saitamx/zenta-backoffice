import React from "react";
import { AlertTriangle, CheckCircle2, Info } from "lucide-react";
import { clsx } from "clsx";

type Tone = "error" | "success" | "info";

const toneMap: Record<
  Tone,
  { icon: React.ReactNode; bg: string; text: string; border: string }
> = {
  error: {
    icon: <AlertTriangle className="text-rose-600" size={18} />,
    bg: "bg-rose-50",
    text: "text-rose-700",
    border: "ring-1 ring-rose-100",
  },
  success: {
    icon: <CheckCircle2 className="text-emerald-600" size={18} />,
    bg: "bg-emerald-50",
    text: "text-emerald-700",
    border: "ring-1 ring-emerald-100",
  },
  info: {
    icon: <Info className="text-sky-600" size={18} />,
    bg: "bg-sky-50",
    text: "text-sky-700",
    border: "ring-1 ring-sky-100",
  },
};

export const Alert: React.FC<{ tone?: Tone; children: React.ReactNode; className?: string }> = ({
  tone = "info",
  children,
  className,
}) => {
  const t = toneMap[tone];
  return (
    <div
      className={clsx("flex items-start gap-2 rounded-md px-3 py-2", t.bg, t.text, t.border, className)}
      role={tone === "error" ? "alert" : "status"}
      aria-live={tone === "error" ? "assertive" : "polite"}
    >
      <div className="mt-0.5">{t.icon}</div>
      <div className="text-sm">{children}</div>
    </div>
  );
};


