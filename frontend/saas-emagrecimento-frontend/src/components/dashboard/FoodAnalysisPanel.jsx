"use client";

import { Camera, Flame, Beef, Wheat, Droplets, Sparkles, ChevronRight } from "lucide-react";
import { buildFoodInsight } from "../../utils/buildFoodInsight";

// ======================================================
// Painel premium de análise alimentar
//
// Responsável por:
// - exibir a última refeição analisada
// - mostrar calorias e macronutrientes
// - mostrar classificação visual da refeição
// - entregar leitura inteligente em linguagem de produto
//
// Pensado para:
// - dashboard premium
// - alta legibilidade
// - experiência parecida com SaaS global
// ======================================================

function getToneClasses(tone) {
  // ====================================================
  // Define cores e estilos com base no tom da análise
  // ====================================================
  const tones = {
    success: {
      badge: "border-emerald-200 bg-emerald-50 text-emerald-700",
      icon: "bg-emerald-100 text-emerald-600",
      ring: "from-emerald-500/10 to-teal-500/10",
    },
    warning: {
      badge: "border-amber-200 bg-amber-50 text-amber-700",
      icon: "bg-amber-100 text-amber-600",
      ring: "from-amber-500/10 to-orange-500/10",
    },
    danger: {
      badge: "border-rose-200 bg-rose-50 text-rose-700",
      icon: "bg-rose-100 text-rose-600",
      ring: "from-rose-500/10 to-pink-500/10",
    },
    neutral: {
      badge: "border-slate-200 bg-slate-50 text-slate-700",
      icon: "bg-slate-100 text-slate-600",
      ring: "from-slate-500/10 to-slate-400/10",
    },
  };

  return tones[tone] || tones.neutral;
}

function formatClassification(classificacao) {
  // ====================================================
  // Ajusta o texto para exibição mais elegante na UI
  // ====================================================
  if (!classificacao) return "Sem classificação";

  const map = {
    boa: "Boa",
    moderada: "Moderada",
    ruim: "Ruim",
  };

  return map[String(classificacao).toLowerCase()] || classificacao;
}

function MacroCard({ icon: Icon, label, value, unit }) {
  // ====================================================
  // Card pequeno reutilizável para exibir macronutrientes
  // ====================================================
  return (
    <div className="rounded-2xl border border-slate-200 bg-white/80 p-4 shadow-sm backdrop-blur-sm">
      <div className="mb-3 flex items-center gap-2">
        <div className="rounded-xl bg-slate-100 p-2 text-slate-600">
          <Icon size={16} />
        </div>
        <span className="text-sm font-medium text-slate-500">{label}</span>
      </div>

      <div className="flex items-end gap-1">
        <span className="text-2xl font-bold tracking-tight text-slate-900">{value}</span>
        <span className="pb-1 text-xs font-medium text-slate-400">{unit}</span>
      </div>
    </div>
  );
}

export default function FoodAnalysisPanel({ ultimaAnalise, insightAlimentar }) {
  // ====================================================
  // Monta o insight inteligente com base na análise recebida
  // ====================================================
  const insight = insightAlimentar || buildFoodInsight(ultimaAnalise);

  // ====================================================
  // Define variações visuais conforme tom do insight
  // ====================================================
  const toneClasses = getToneClasses(insight.tone);

  // ====================================================
  // Proteção contra ausência de dados
  // ====================================================
  const calorias = Number(ultimaAnalise?.calorias_estimadas || 0);
  const proteinas = Number(ultimaAnalise?.proteinas || 0);
  const carboidratos = Number(ultimaAnalise?.carboidratos || 0);
  const gorduras = Number(ultimaAnalise?.gorduras || 0);
  const classificacao = formatClassification(ultimaAnalise?.classificacao);

  return (
    <section className="relative overflow-hidden rounded-[28px] border border-slate-200 bg-white p-6 shadow-[0_20px_70px_-35px_rgba(15,23,42,0.35)] lg:p-7">
      {/* ==================================================
          Glow sutil de fundo para visual premium
         ================================================== */}
      <div
        className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${toneClasses.ring}`}
      />

      <div className="relative z-10">
        {/* ================================================
            Header do painel
           ================================================ */}
        <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div>
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
              <Sparkles size={14} />
              IA alimentar
            </div>

            <h3 className="text-2xl font-bold tracking-tight text-slate-900">
              Última refeição analisada
            </h3>

            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-500">
              Transforme fotos de refeições em leitura nutricional inteligente, com interpretação prática para decisões melhores no dia a dia.
            </p>
          </div>

          <div
            className={`inline-flex w-fit items-center gap-2 rounded-2xl border px-4 py-2 text-sm font-semibold ${toneClasses.badge}`}
          >
            <Camera size={16} />
            {classificacao}
          </div>
        </div>

        {/* ================================================
            Estado sem dados
           ================================================ */}
        {!ultimaAnalise ? (
          <div className="rounded-3xl border border-dashed border-slate-300 bg-slate-50 px-6 py-10 text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-white shadow-sm">
              <Camera className="text-slate-500" size={22} />
            </div>

            <h4 className="text-lg font-semibold text-slate-900">
              Nenhuma refeição analisada ainda
            </h4>

            <p className="mx-auto mt-2 max-w-xl text-sm leading-relaxed text-slate-500">
              Assim que o usuário enviar uma foto de refeição, este painel passará a mostrar calorias, macronutrientes, classificação alimentar e recomendações inteligentes.
            </p>
          </div>
        ) : (
          <>
            {/* ============================================
                Bloco principal com destaque da análise
               ============================================ */}
            <div className="mb-6 flex flex-col gap-4 lg:grid lg:grid-cols-[1.25fr_0.95fr]">
              <div className="rounded-3xl border border-slate-200 bg-gradient-to-br from-slate-900 to-slate-800 p-5 text-white shadow-lg sm:p-6">
                <div className="mb-4 flex items-center gap-3">
                  <div className={`rounded-2xl p-3 ${toneClasses.icon}`}>
                    <Flame size={20} />
                  </div>

                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-300">
                      leitura inteligente
                    </p>
                    <h4 className="text-lg font-bold tracking-tight sm:text-xl">
                      {insight.headline}
                    </h4>
                  </div>
                </div>

                <p className="text-sm leading-7 text-slate-300">
                  {insight.summary}
                </p>

                <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-4">
                  <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-white">
                    <ChevronRight size={16} />
                    Recomendação prática
                  </div>

                  <p className="text-sm leading-6 text-slate-300">
                    {insight.recommendation}
                  </p>
                </div>
              </div>

              <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                  Resumo da refeição
                </p>

                <div className="mt-4 flex items-end gap-2">
                  <span className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                    {calorias}
                  </span>
                  <span className="pb-1 text-sm font-medium text-slate-500">
                    kcal estimadas
                  </span>
                </div>

                <div className="mt-6 space-y-3">
                  <div className="flex items-center justify-between rounded-2xl bg-white px-4 py-3 shadow-sm">
                    <span className="text-sm font-medium text-slate-500">Proteínas</span>
                    <span className="text-sm font-bold text-slate-900">{proteinas} g</span>
                  </div>

                  <div className="flex items-center justify-between rounded-2xl bg-white px-4 py-3 shadow-sm">
                    <span className="text-sm font-medium text-slate-500">Carboidratos</span>
                    <span className="text-sm font-bold text-slate-900">{carboidratos} g</span>
                  </div>

                  <div className="flex items-center justify-between rounded-2xl bg-white px-4 py-3 shadow-sm">
                    <span className="text-sm font-medium text-slate-500">Gorduras</span>
                    <span className="text-sm font-bold text-slate-900">{gorduras} g</span>
                  </div>
                </div>
              </div>
            </div>

            {/* ============================================
                Grid com cards menores de macro
               ============================================ */}
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-2 xl:grid-cols-4">
              <MacroCard icon={Flame} label="Calorias" value={calorias} unit="kcal" />
              <MacroCard icon={Beef} label="Proteínas" value={proteinas} unit="g" />
              <MacroCard icon={Wheat} label="Carboidratos" value={carboidratos} unit="g" />
              <MacroCard icon={Droplets} label="Gorduras" value={gorduras} unit="g" />
            </div>
          </>
        )}
      </div>
    </section>
  );
}