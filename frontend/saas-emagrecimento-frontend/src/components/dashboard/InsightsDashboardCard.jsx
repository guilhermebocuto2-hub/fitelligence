"use client";

// ======================================================
// Card de leituras complementares do sistema
// Mostra interpretações rápidas e priorização visual
// com uma aparência mais premium e organizada
// ======================================================

import { Lightbulb, Sparkles } from "lucide-react";
import ChartCard from "../ui/ChartCard";

export default function InsightsDashboardCard() {
  // ====================================================
  // Lista de insights complementares do dashboard
  // Cada item representa uma leitura analítica do sistema
  // ====================================================
  const insights = [
    {
      title: "Leitura do score alimentar",
      text: "Seu score alimentar está abaixo do ideal. Ajustes simples na rotina podem elevar rapidamente esse indicador.",
      tag: "prioridade",
      styles: "border-red-200 bg-gradient-to-r from-red-50/80 to-white",
      tagStyles: "border-red-200 bg-red-50 text-red-500",
    },
    {
      title: "Leitura da consistência",
      text: "Sua rotina ainda mostra oscilações. Repetição e frequência tendem a aumentar seus resultados.",
      tag: "atenção",
      styles: "border-amber-200 bg-gradient-to-r from-amber-50/70 to-white",
      tagStyles: "border-amber-200 bg-amber-50 text-amber-600",
    },
    {
      title: "Leitura do progresso físico",
      text: "Ainda não há perda acumulada relevante. O melhor caminho agora é fortalecer consistência e monitoramento.",
      tag: "informativo",
      styles: "border-slate-200 bg-gradient-to-r from-slate-50/80 to-white",
      tagStyles: "border-slate-200 bg-slate-50 text-slate-500",
    },
  ];

  return (
    <ChartCard
      title="Leituras complementares do sistema"
      subtitle="Análises adicionais baseadas no comportamento recente e nos indicadores já processados."
      icon={<Lightbulb size={20} />}
      rightContent={
        <div className="hidden rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 text-right shadow-sm md:block">
          <p className="text-[10px] uppercase tracking-[0.18em] text-slate-400">
            Camada extra
          </p>
          <p className="mt-1 text-sm font-semibold text-slate-700">
            Insights IA
          </p>
        </div>
      }
    >
      <div className="space-y-4">
        {insights.map((item, index) => (
          <div
            key={item.title}
            className={`rounded-2xl border p-5 shadow-sm transition hover:shadow-md ${item.styles}`}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-4">
                {/* Ícone decorativo de cada insight */}
                <div className="mt-1 flex h-11 w-11 items-center justify-center rounded-2xl bg-white text-emerald-600 shadow-sm ring-1 ring-slate-100">
                  <Sparkles size={18} />
                </div>

                {/* Conteúdo textual */}
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                    Insight {index + 1}
                  </p>

                  <h4 className="mt-2 text-base font-bold text-slate-900">
                    {item.title}
                  </h4>

                  <p className="mt-2 max-w-4xl text-sm leading-7 text-slate-500">
                    {item.text}
                  </p>
                </div>
              </div>

              {/* Badge de prioridade */}
              <span
                className={`shrink-0 rounded-full border px-2.5 py-1 text-xs font-medium ${item.tagStyles}`}
              >
                {item.tag}
              </span>
            </div>
          </div>
        ))}
      </div>
    </ChartCard>
  );
}