"use client";

// ======================================================
// Hero principal personalizado do dashboard
// Responsável por:
// - mostrar título dinâmico
// - mostrar subtítulo dinâmico
// - destacar CTA principal
// - reforçar a proposta premium do app
// ======================================================

import { Sparkles } from "lucide-react";

export default function PersonalizedDashboardHero({
  title,
  subtitle,
  ctaLabel,
  spotlight = "geral",
}) {
  // ====================================================
  // Texto auxiliar por spotlight
  // ====================================================
  const spotlightMap = {
    alimentacao: "Seu foco principal hoje está em alimentação e aderência.",
    performance: "Seu foco principal hoje está em performance e evolução.",
    rotina: "Seu foco principal hoje está em constância e rotina.",
    constancia: "Seu foco principal hoje está em manter consistência.",
    ia_corporal: "Seu foco principal hoje está em leitura corporal inteligente.",
    operacao: "Seu foco principal hoje está em operação e acompanhamento.",
    escala: "Seu foco principal hoje está em escalar com qualidade.",
    aderencia: "Seu foco principal hoje está em aderência alimentar.",
    ia_alimentar: "Seu foco principal hoje está em leitura alimentar inteligente.",
    escala_clinica: "Seu foco principal hoje está em escala clínica com clareza.",
    geral: "Seu dashboard está pronto para acompanhar sua jornada com inteligência.",
  };

  return (
    <section className="overflow-hidden rounded-[32px] border border-slate-200 bg-white p-6 shadow-sm transition-colors duration-300 dark:border-slate-800 dark:bg-slate-950/70 md:p-8">
      <div className="space-y-5">
        <div className="inline-flex items-center gap-2 rounded-full border border-violet-200 bg-violet-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-violet-700 dark:border-violet-500/20 dark:bg-violet-500/10 dark:text-violet-300">
          <Sparkles className="h-4 w-4" />
          Experiência personalizada
        </div>

        <div className="space-y-3">
          <h1 className="max-w-3xl text-3xl font-semibold tracking-tight text-slate-900 dark:text-white md:text-4xl">
            {title}
          </h1>

          <p className="max-w-2xl text-sm leading-7 text-slate-600 dark:text-slate-400 md:text-base">
            {subtitle}
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <button
            type="button"
            className="inline-flex items-center justify-center rounded-2xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg dark:bg-white dark:text-slate-900"
          >
            {ctaLabel}
          </button>

          <p className="text-sm text-slate-500 dark:text-slate-400">
            {spotlightMap[spotlight] || spotlightMap.geral}
          </p>
        </div>
      </div>
    </section>
  );
}