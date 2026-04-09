"use client";

// ======================================================
// Card de resumo alimentar automatizado
// Exibe os principais indicadores derivados das análises
// com um visual mais profissional e mais hierarquia visual
// ======================================================

import { BrainCircuit, Sparkles, Salad, BadgeAlert } from "lucide-react";
import ChartCard from "../ui/ChartCard";

export default function ResumoAlimentarCard() {
  return (
    <ChartCard
      title="Resumo nutricional automatizado"
      subtitle="Leitura consolidada da sua alimentação com base nas refeições analisadas pela IA."
      icon={<BrainCircuit size={20} />}
      rightContent={
        <div className="hidden rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 text-right shadow-sm md:block">
          <p className="text-[10px] uppercase tracking-[0.18em] text-slate-400">
            Motor analítico
          </p>
          <p className="mt-1 text-sm font-semibold text-slate-700">
            Resumo IA
          </p>
        </div>
      }
    >
      <div className="space-y-5">
        {/* ==================================================
            BLOCO SUPERIOR DE MÉTRICAS
           ================================================== */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div className="rounded-3xl border border-slate-200 bg-gradient-to-br from-slate-50 to-white p-5 shadow-sm">
            <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-2xl bg-white text-emerald-600 shadow-sm ring-1 ring-slate-100">
              <BadgeAlert size={20} />
            </div>

            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
              Score alimentar
            </p>

            <p className="mt-3 text-4xl font-bold text-slate-900">0%</p>

            <span className="mt-4 inline-flex rounded-full border border-red-200 bg-red-50 px-2.5 py-1 text-xs font-medium text-red-500">
              atenção
            </span>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-gradient-to-br from-slate-50 to-white p-5 shadow-sm">
            <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-2xl bg-white text-emerald-600 shadow-sm ring-1 ring-slate-100">
              <Sparkles size={20} />
            </div>

            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
              Classificação geral
            </p>

            <p className="mt-3 text-2xl font-bold text-slate-900">
              Sem classificação
            </p>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              Interpretação automatizada da qualidade alimentar.
            </p>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-gradient-to-br from-slate-50 to-white p-5 shadow-sm">
            <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-2xl bg-white text-emerald-600 shadow-sm ring-1 ring-slate-100">
              <Salad size={20} />
            </div>

            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
              Refeições analisadas
            </p>

            <p className="mt-3 text-4xl font-bold text-slate-900">0</p>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              Base usada pela IA para compor este resumo.
            </p>
          </div>
        </div>

        {/* ==================================================
            LEITURA PRINCIPAL
           ================================================== */}
        <div className="rounded-3xl border border-slate-200 bg-gradient-to-r from-emerald-50/70 to-white p-6 shadow-sm">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-emerald-600 shadow-sm ring-1 ring-slate-100">
              <BrainCircuit size={22} />
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-500">
                Leitura principal
              </p>

              <h4 className="mt-2 text-lg font-bold text-slate-900">
                Síntese interpretativa do comportamento alimentar recente
              </h4>

              <p className="mt-3 text-sm leading-7 text-slate-500">
                Seu resumo alimentar será refinado conforme mais dados forem
                analisados. Quanto maior a base alimentar, mais precisa será a
                interpretação da IA sobre sua rotina nutricional.
              </p>
            </div>
          </div>
        </div>

        {/* ==================================================
            BLOCOS INFERIORES
           ================================================== */}
        <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
          {/* ----------------------------------------------
              INDICADORES RÁPIDOS
             ---------------------------------------------- */}
          <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5 shadow-sm">
            <h5 className="text-sm font-bold text-slate-900">
              Indicadores rápidos
            </h5>

            <p className="mt-1 text-sm leading-6 text-slate-500">
              Resumo objetivo dos dados mais recentes.
            </p>

            <div className="mt-5 space-y-3">
              <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm font-semibold text-slate-900">
                      Média de calorias
                    </p>
                    <p className="mt-1 text-sm text-slate-500">
                      Estimativa média com base nas refeições registradas.
                    </p>
                  </div>

                  <span className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs text-slate-500">
                    -
                  </span>
                </div>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-sm font-semibold text-slate-900">
                      Qualidade alimentar
                    </p>
                    <p className="mt-1 text-sm text-slate-500">
                      Classificação geral do padrão detectado.
                    </p>
                  </div>

                  <span className="rounded-full border border-red-200 bg-red-50 px-2.5 py-1 text-xs text-red-500">
                    Sem classificação
                  </span>
                </div>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-sm font-semibold text-slate-900">
                      Base de análise
                    </p>
                    <p className="mt-1 text-sm text-slate-500">
                      Quantidade de refeições já processadas pela IA.
                    </p>
                  </div>

                  <span className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs text-slate-500">
                    0 registros
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* ----------------------------------------------
              RECOMENDAÇÃO PRINCIPAL
             ---------------------------------------------- */}
          <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5 shadow-sm">
            <h5 className="text-sm font-bold text-slate-900">
              Recomendação principal
            </h5>

            <p className="mt-1 text-sm leading-6 text-slate-500">
              Ação prioritária sugerida com base no seu padrão atual.
            </p>

            <div className="mt-5 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold text-slate-900">
                    Próximo melhor passo
                  </p>

                  <p className="mt-2 text-sm leading-6 text-slate-500">
                    Continue registrando refeições para gerar análises mais
                    precisas e aumentar a confiabilidade dos insights.
                  </p>
                </div>

                <span className="rounded-full border border-red-200 bg-red-50 px-2.5 py-1 text-xs font-medium text-red-500">
                  IA
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ChartCard>
  );
}