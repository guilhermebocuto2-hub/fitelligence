"use client";

// ======================================================
// Painel visual de insights automáticos
// Responsável por:
// - mostrar leitura estratégica automática
// - reforçar valor da IA no dashboard
// ======================================================

import { Brain, Sparkles, TrendingUp, TriangleAlert } from "lucide-react";

function InsightIcon({ tipo }) {
  if (tipo === "success") {
    return <TrendingUp className="h-4 w-4" />;
  }

  if (tipo === "warning") {
    return <TriangleAlert className="h-4 w-4" />;
  }

  return <Sparkles className="h-4 w-4" />;
}

export default function InsightsPanel({ insights = [] }) {
  return (
    <div className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm transition-colors duration-300 dark:border-slate-800 dark:bg-slate-950/70">
      <div className="space-y-4">
        <div className="space-y-2">
          <span className="inline-flex items-center gap-2 rounded-full border border-fuchsia-200 bg-fuchsia-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-fuchsia-700 dark:border-fuchsia-500/20 dark:bg-fuchsia-500/10 dark:text-fuchsia-300">
            <Brain className="h-4 w-4" />
            Insights automáticos
          </span>

          <h3 className="text-xl font-semibold text-slate-900 dark:text-white">
            O que o Fitelligence está entendendo
          </h3>

          <p className="text-sm leading-7 text-slate-600 dark:text-slate-400">
            Leitura estratégica construída automaticamente com base no seu comportamento e evolução.
          </p>
        </div>

        <div className="grid gap-3">
          {insights.map((insight, index) => {
            const toneMap = {
              success:
                "border-emerald-200 bg-emerald-50/70 text-emerald-700 dark:border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-300",
              warning:
                "border-amber-200 bg-amber-50/70 text-amber-700 dark:border-amber-500/20 dark:bg-amber-500/10 dark:text-amber-300",
              info:
                "border-fuchsia-200 bg-fuchsia-50/70 text-fuchsia-700 dark:border-fuchsia-500/20 dark:bg-fuchsia-500/10 dark:text-fuchsia-300",
            };

            return (
              <div
                key={`${insight.titulo}-${index}`}
                className={`rounded-3xl border p-4 transition-colors duration-300 ${
                  toneMap[insight.tipo] || toneMap.info
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="mt-0.5">
                    <InsightIcon tipo={insight.tipo} />
                  </div>

                  <div className="space-y-1">
                    <p className="text-sm font-semibold">{insight.titulo}</p>
                    <p className="text-sm leading-7 opacity-90">
                      {insight.descricao}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}