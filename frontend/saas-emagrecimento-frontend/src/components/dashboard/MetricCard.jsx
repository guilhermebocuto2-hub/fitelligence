"use client";

import { ArrowDownRight, ArrowRight, ArrowUpRight } from "lucide-react";

// ======================================================
// Estilos por tom
// ======================================================
function getToneStyles(tone) {
  switch (tone) {
    case "success":
      return {
        iconWrapper:
          "bg-emerald-100 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400",
        accent:
          "from-emerald-500/20 via-transparent to-transparent dark:from-emerald-500/10",
      };

    case "intelligence":
      return {
        iconWrapper:
          "bg-violet-100 text-violet-600 dark:bg-violet-500/10 dark:text-violet-400",
        accent:
          "from-violet-500/20 via-transparent to-transparent dark:from-violet-500/10",
      };

    case "warning":
      return {
        iconWrapper:
          "bg-amber-100 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400",
        accent:
          "from-amber-500/20 via-transparent to-transparent dark:from-amber-500/10",
      };

    default:
      return {
        iconWrapper:
          "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200",
        accent:
          "from-slate-300/30 via-transparent to-transparent dark:from-slate-700/30",
      };
  }
}

// ======================================================
// Estilos de tendência
// ======================================================
function getTrendStyles(type) {
  switch (type) {
    case "positive":
      return {
        color: "text-emerald-600 dark:text-emerald-400",
        icon: <ArrowUpRight className="h-4 w-4" />,
      };

    case "attention":
      return {
        color: "text-amber-600 dark:text-amber-400",
        icon: <ArrowDownRight className="h-4 w-4" />,
      };

    default:
      return {
        color: "text-slate-500 dark:text-slate-400",
        icon: <ArrowRight className="h-4 w-4" />,
      };
  }
}

// ======================================================
// CARD PRINCIPAL
// ======================================================
export default function MetricCard({
  label = "Métrica",
  value = "--",
  helper = "",
  trend = {
    label: "",
    type: "neutral",
  },
  tone = "default",
  icon = null,
}) {
  const toneStyles = getToneStyles(tone);
  const trendStyles = getTrendStyles(trend?.type);

  return (
    <article
      className="
      relative overflow-hidden rounded-[22px]
      border border-slate-200/80
      bg-white/90
      p-4
      shadow-[0_10px_25px_rgba(15,23,42,0.06)]
      backdrop-blur-xl
      transition-all duration-300

      dark:border-slate-800
      dark:bg-slate-950/70
    "
    >
      {/* Glow */}
      <div
        className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${toneStyles.accent} opacity-70`}
      />

      <div className="relative z-10 space-y-3">
        {/* Top */}
        <div className="flex items-center justify-between">
          <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-500 dark:text-slate-400">
            {label}
          </p>

          <div
            className={`flex h-9 w-9 items-center justify-center rounded-xl ${toneStyles.iconWrapper}`}
          >
            {icon}
          </div>
        </div>

        {/* Valor */}
        <div className="flex items-end justify-between">
          <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
            {value}
          </h3>

          {trend?.label && (
            <div
              className={`flex items-center gap-1 text-xs font-semibold ${trendStyles.color}`}
            >
              {trendStyles.icon}
            </div>
          )}
        </div>

        {/* Helper (menor no mobile) */}
        {helper && (
          <p className="text-xs leading-5 text-slate-500 dark:text-slate-400 line-clamp-2">
            {helper}
          </p>
        )}
      </div>
    </article>
  );
}