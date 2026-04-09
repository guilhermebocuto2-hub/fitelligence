"use client";

import { Trophy, TrendingUp, Sparkles } from "lucide-react";

// ======================================================
// Função para cor baseada no score
// ======================================================
function getScoreColor(score) {
  if (score >= 80) return "text-emerald-600 dark:text-emerald-400";
  if (score >= 60) return "text-cyan-600 dark:text-cyan-400";
  if (score >= 40) return "text-amber-600 dark:text-amber-400";
  return "text-rose-600 dark:text-rose-400";
}

// ======================================================
// Badge textual da classificação
// ======================================================
function getScoreBadge(score) {
  if (score >= 80) {
    return {
      label: "Excelente",
      className:
        "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-300",
    };
  }

  if (score >= 60) {
    return {
      label: "Bom",
      className:
        "border-cyan-200 bg-cyan-50 text-cyan-700 dark:border-cyan-500/20 dark:bg-cyan-500/10 dark:text-cyan-300",
    };
  }

  if (score >= 40) {
    return {
      label: "Intermediário",
      className:
        "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-500/20 dark:bg-amber-500/10 dark:text-amber-300",
    };
  }

  return {
    label: "Atenção",
    className:
      "border-rose-200 bg-rose-50 text-rose-700 dark:border-rose-500/20 dark:bg-rose-500/10 dark:text-rose-300",
  };
}

// ======================================================
// Barra de progresso premium
// ======================================================
function ProgressBar({ value }) {
  return (
    <div className="mt-4 h-2.5 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800">
      <div
        className="h-2.5 rounded-full bg-gradient-to-r from-violet-500 via-indigo-500 to-cyan-500 transition-all duration-700"
        style={{ width: `${Math.min(value || 0, 100)}%` }}
      />
    </div>
  );
}

// ======================================================
// Card pequeno para breakdown
// Responsável por:
// - mostrar os pilares do score
// - manter leitura compacta no mobile
// ======================================================
function BreakdownCard({ label, value }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white/80 px-3 py-3 text-center shadow-sm transition-colors duration-300 dark:border-slate-800 dark:bg-slate-950/60">
      <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-500 dark:text-slate-400">
        {label}
      </p>

      <p className="mt-2 text-lg font-bold text-slate-900 dark:text-white">
        {value ?? 0}
      </p>
    </div>
  );
}

// ======================================================
// Componente principal
// Adaptado para:
// - desktop premium
// - mobile mais compacto e menos "esticado"
// ======================================================
export default function ScoreGlobalPanel({ data }) {
  if (!data) return null;

  const { score = 0, mensagem, breakdown } = data;
  const badge = getScoreBadge(score);

  return (
    <section className="relative overflow-hidden rounded-[28px] border border-slate-200 bg-gradient-to-br from-white via-slate-50 to-violet-50/60 p-4 shadow-[0_20px_60px_-35px_rgba(15,23,42,0.35)] transition-colors duration-300 sm:p-6 dark:border-slate-800 dark:bg-[radial-gradient(circle_at_top_right,rgba(139,92,246,0.18),transparent_28%),linear-gradient(to_bottom_right,#0f172a,#111827,#020617)]">
      {/* Glow decorativo */}
      <div className="pointer-events-none absolute -right-10 -top-10 h-28 w-28 rounded-full bg-violet-500/15 blur-3xl dark:bg-violet-500/20" />
      <div className="pointer-events-none absolute bottom-0 left-1/3 h-20 w-20 rounded-full bg-cyan-500/10 blur-3xl dark:bg-cyan-500/10" />

      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/80 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500 shadow-sm transition-colors duration-300 dark:border-slate-800 dark:bg-slate-950/70 dark:text-slate-300">
              <Sparkles size={12} />
              Score geral
            </div>

            <div className="mt-4 flex items-end gap-2">
              <h2
                className={`text-4xl font-bold leading-none tracking-tight sm:text-6xl ${getScoreColor(
                  score
                )}`}
              >
                {score}
              </h2>

              <div className="pb-1">
                <span
                  className={`inline-flex items-center rounded-full border px-3 py-1 text-[11px] font-semibold ${badge.className}`}
                >
                  {badge.label}
                </span>
              </div>
            </div>

            <p className="mt-3 text-sm leading-6 text-slate-600 transition-colors duration-300 dark:text-slate-300 sm:max-w-2xl sm:text-base sm:leading-7">
              {mensagem}
            </p>
          </div>

          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-slate-200 bg-white/80 text-slate-500 shadow-sm transition-colors duration-300 dark:border-slate-800 dark:bg-slate-950/70 dark:text-slate-300">
            <Trophy size={20} />
          </div>
        </div>

        {/* Barra */}
        <ProgressBar value={score} />

        {/* Meta da barra */}
        <div className="mt-2 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
          <span>0</span>

          <span className="inline-flex items-center gap-1">
            <TrendingUp size={11} />
            Evolução
          </span>

          <span>100</span>
        </div>

        {/* Breakdown */}
        <div className="mt-5 grid grid-cols-3 gap-2 sm:gap-3">
          <BreakdownCard
            label="Alimentação"
            value={breakdown?.alimentacao}
          />
          <BreakdownCard
            label="Consistência"
            value={breakdown?.consistencia}
          />
          <BreakdownCard
            label="Progresso"
            value={breakdown?.progresso}
          />
        </div>
      </div>
    </section>
  );
}