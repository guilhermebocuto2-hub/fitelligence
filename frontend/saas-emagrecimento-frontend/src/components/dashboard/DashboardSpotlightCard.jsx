"use client";

// ======================================================
// Card de foco principal do dashboard
// Responsável por:
// - destacar o tema mais importante do momento
// - trazer leitura estratégica da jornada
// - reforçar visual premium no mobile e desktop
// - permitir CTA e bloco visual decorativo
// ======================================================

import { ArrowUpRight, Sparkles } from "lucide-react";

export default function DashboardSpotlightCard({
  title,
  description,
  badge = "Foco atual",
  ctaLabel = "Explorar jornada",
  onCtaClick,
}) {
  return (
    <section className="relative overflow-hidden rounded-[28px] border border-slate-200 bg-gradient-to-br from-white via-slate-50 to-emerald-50/40 p-5 shadow-[0_20px_60px_-35px_rgba(15,23,42,0.28)] transition-colors duration-300 sm:p-6 dark:border-slate-800 dark:bg-[radial-gradient(circle_at_top_right,rgba(16,185,129,0.12),transparent_28%),linear-gradient(to_bottom_right,#0f172a,#111827,#020617)]">
      {/* Glow decorativo */}
      <div className="pointer-events-none absolute -right-10 -top-10 h-28 w-28 rounded-full bg-emerald-500/15 blur-3xl dark:bg-emerald-500/15" />
      <div className="pointer-events-none absolute bottom-0 left-1/4 h-24 w-24 rounded-full bg-cyan-500/10 blur-3xl dark:bg-cyan-500/10" />

      {/* Elementos decorativos premium */}
      <div className="pointer-events-none absolute right-4 top-4 hidden h-24 w-24 rounded-full border border-white/40 bg-white/20 blur-[1px] sm:block dark:border-white/10 dark:bg-white/5" />
      <div className="pointer-events-none absolute bottom-4 right-10 hidden h-12 w-12 rounded-2xl bg-emerald-400/20 blur-xl sm:block" />

      <div className="relative z-10 grid gap-5 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
        {/* Conteúdo textual */}
        <div className="space-y-3 sm:space-y-4">
          <span className="inline-flex w-fit items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-emerald-700 transition-colors duration-300 dark:border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-300">
            <Sparkles className="h-3.5 w-3.5" />
            {badge}
          </span>

          <h3 className="text-[1.35rem] font-semibold leading-tight tracking-tight text-slate-900 dark:text-white sm:text-2xl">
            {title}
          </h3>

          <p className="max-w-3xl text-sm leading-6 text-slate-600 dark:text-slate-400 sm:text-base sm:leading-7">
            {description}
          </p>

          <button
            type="button"
            onClick={onCtaClick}
            className="inline-flex items-center gap-2 rounded-2xl border border-emerald-200 bg-white/80 px-4 py-2.5 text-sm font-semibold text-emerald-700 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md dark:border-emerald-500/20 dark:bg-slate-900/70 dark:text-emerald-300"
          >
            {ctaLabel}
            <ArrowUpRight className="h-4 w-4" />
          </button>
        </div>

        {/* Bloco visual premium */}
        <div className="relative hidden min-h-[180px] overflow-hidden rounded-[28px] border border-white/50 bg-gradient-to-br from-emerald-100/70 via-white/60 to-cyan-100/50 p-5 shadow-[0_10px_35px_rgba(15,23,42,0.08)] lg:block dark:border-white/10 dark:bg-gradient-to-br dark:from-emerald-500/10 dark:via-slate-900/40 dark:to-cyan-500/10">
          <div className="absolute right-4 top-4 h-16 w-16 rounded-full bg-emerald-400/20 blur-2xl" />
          <div className="absolute bottom-6 left-6 h-20 w-20 rounded-full bg-cyan-400/20 blur-2xl" />

          <div className="relative z-10 flex h-full flex-col justify-between">
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-2xl border border-white/50 bg-white/70 p-4 dark:border-white/10 dark:bg-slate-950/40">
                <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500 dark:text-slate-400">
                  Consistência
                </p>
                <p className="mt-2 text-2xl font-bold text-slate-900 dark:text-white">
                  +12%
                </p>
              </div>

              <div className="rounded-2xl border border-white/50 bg-white/70 p-4 dark:border-white/10 dark:bg-slate-950/40">
                <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500 dark:text-slate-400">
                  Energia
                </p>
                <p className="mt-2 text-2xl font-bold text-slate-900 dark:text-white">
                  Boa
                </p>
              </div>
            </div>

            <div className="rounded-2xl border border-white/50 bg-white/70 p-4 dark:border-white/10 dark:bg-slate-950/40">
              <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500 dark:text-slate-400">
                Leitura inteligente
              </p>
              <p className="mt-2 text-sm leading-6 text-slate-700 dark:text-slate-300">
                Seu painel mostra espaço real para crescimento com ajustes pequenos e consistentes.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}