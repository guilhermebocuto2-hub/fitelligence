"use client";

// ======================================================
// DashboardHeaderContext
// Responsavel por:
// - exibir o contexto principal do dashboard
// - manter header e spotlight agrupados em um bloco reutilizavel
// - reduzir complexidade da pagina principal
// ======================================================

import { Sparkles } from "lucide-react";
import DashboardPageHeader from "./DashboardPageHeader";
import DashboardSpotlightCard from "./DashboardSpotlightCard";

export default function DashboardHeaderContext({
  heroTitle,
  heroSubtitle,
  ctaSecundario,
  spotlightTitle,
  spotlightDescription,
}) {
  return (
    <div className="space-y-5">
      <div className="overflow-hidden rounded-[28px] border border-slate-200 bg-gradient-to-br from-white via-slate-50 to-violet-50/40 p-5 shadow-[0_20px_60px_-35px_rgba(15,23,42,0.35)] transition-colors duration-300 dark:border-slate-800 dark:from-slate-950 dark:via-slate-950 dark:to-violet-950/20 sm:p-6">
        <DashboardPageHeader
          eyebrow="Evolucao corporal"
          title={heroTitle}
          description={heroSubtitle}
          action={
            <div className="inline-flex w-fit items-center gap-2 rounded-2xl border border-slate-200 bg-white/90 px-3.5 py-2 text-xs font-semibold text-slate-700 shadow-sm transition-all duration-300 dark:border-slate-800 dark:bg-slate-900/80 dark:text-slate-200 sm:px-4 sm:py-2.5 sm:text-sm">
              <Sparkles className="h-4 w-4 text-violet-500" />
              <span className="truncate">{ctaSecundario}</span>
            </div>
          }
        />
      </div>

      <DashboardSpotlightCard
        title={spotlightTitle}
        description={spotlightDescription}
      />
    </div>
  );
}

