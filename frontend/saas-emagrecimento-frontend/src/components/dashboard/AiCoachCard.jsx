"use client";

// ======================================================
// AiCoachCard
// Responsável por:
// - exibir o bloco principal da IA no dashboard
// - apresentar resumo inteligente da jornada
// - mostrar recomendações acionáveis
// - destacar prioridade visual
// - suportar light mode e dark mode premium
// ======================================================

import { Brain, Sparkles, AlertTriangle, ShieldCheck } from "lucide-react";

// ======================================================
// Função auxiliar para escolher aparência da prioridade
// ======================================================
function getPriorityStyles(priority) {
  // ====================================================
  // low = prioridade baixa
  // moderate = prioridade moderada
  // high = prioridade alta
  // ====================================================
  switch (priority) {
    case "high":
      return {
        badge:
          "border-red-200 bg-red-50 text-red-700 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-400",
        icon:
          "bg-red-100 text-red-600 dark:bg-red-500/10 dark:text-red-400",
        label: "Alta prioridade",
      };

    case "moderate":
      return {
        badge:
          "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-500/20 dark:bg-amber-500/10 dark:text-amber-400",
        icon:
          "bg-amber-100 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400",
        label: "Prioridade moderada",
      };

    case "low":
    default:
      return {
        badge:
          "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-400",
        icon:
          "bg-emerald-100 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400",
        label: "Baixa prioridade",
      };
  }
}

export default function AiCoachCard({
  title = "Uma visão mais inteligente da jornada do usuário",
  summary = "A inteligência do Fitelligence está processando os sinais do usuário para gerar interpretações mais estratégicas sobre comportamento, evolução e consistência.",
  recommendations = [],
  priority = "low",
}) {
  // ====================================================
  // Recupera estilos visuais da prioridade atual
  // ====================================================
  const priorityConfig = getPriorityStyles(priority);

  return (
    <section className="relative overflow-hidden rounded-[32px] border border-slate-200/80 bg-gradient-to-br from-slate-900 via-violet-900 to-indigo-900 p-6 text-white shadow-[0_20px_60px_rgba(76,29,149,0.35)] transition-colors duration-300 md:p-8 dark:border-slate-800">
      {/* ==================================================
          Efeitos visuais de profundidade
          Servem para dar sensação premium e tecnológica
         ================================================== */}
      <div className="absolute -right-16 -top-16 h-44 w-44 rounded-full bg-cyan-400/20 blur-3xl" />
      <div className="absolute bottom-0 left-1/3 h-36 w-36 rounded-full bg-violet-400/20 blur-3xl" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.04)_1px,transparent_1px)] bg-[size:32px_32px] opacity-20" />

      <div className="relative z-10">
        {/* ==================================================
            Topo do card
           ================================================== */}
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="max-w-3xl">
            {/* ==============================================
                Selo superior do módulo de IA
               ============================================== */}
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-violet-100 backdrop-blur-md">
              <Sparkles className="h-4 w-4" />
              AI Coach Engine
            </div>

            {/* ==============================================
                Título principal
               ============================================== */}
            <h2 className="text-2xl font-semibold tracking-tight text-white md:text-3xl xl:text-[2rem]">
              {title}
            </h2>

            {/* ==============================================
                Resumo principal
               ============================================== */}
            <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-200 md:text-base">
              {summary}
            </p>
          </div>

          {/* ==============================================
              Bloco lateral de prioridade
             ============================================== */}
          <div className="w-full max-w-sm rounded-3xl border border-white/10 bg-white/10 p-5 backdrop-blur-md">
            <div className="flex items-start gap-4">
              <div
                className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${priorityConfig.icon}`}
              >
                {priority === "high" ? (
                  <AlertTriangle className="h-5 w-5" />
                ) : priority === "moderate" ? (
                  <Brain className="h-5 w-5" />
                ) : (
                  <ShieldCheck className="h-5 w-5" />
                )}
              </div>

              <div className="min-w-0">
                <div
                  className={`inline-flex items-center rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] ${priorityConfig.badge}`}
                >
                  {priorityConfig.label}
                </div>

                <p className="mt-3 text-sm leading-6 text-slate-200">
                  A IA classificou o momento atual da jornada com base em consistência,
                  frequência de registros e qualidade dos sinais comportamentais.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* ==================================================
            Área inferior com recomendações
           ================================================== */}
        <div className="mt-8 grid gap-4 xl:grid-cols-3">
          {recommendations?.length > 0 ? (
            recommendations.slice(0, 3).map((item, index) => (
              <div
                key={`${item}-${index}`}
                className="rounded-3xl border border-white/10 bg-white/10 p-5 backdrop-blur-md transition-transform duration-300 hover:-translate-y-1"
              >
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 text-violet-100">
                  <Brain className="h-5 w-5" />
                </div>

                <p className="text-sm leading-7 text-slate-100">
                  {item}
                </p>
              </div>
            ))
          ) : (
            <div className="xl:col-span-3 rounded-3xl border border-white/10 bg-white/10 p-5 backdrop-blur-md">
              <p className="text-sm leading-7 text-slate-100">
                Ainda não há recomendações suficientes para exibir aqui. Conforme o usuário
                registra progresso, check-ins e alimentação, a IA amplia a profundidade da análise.
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}