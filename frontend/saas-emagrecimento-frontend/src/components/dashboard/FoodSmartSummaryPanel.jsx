"use client";

import {
  Brain,
  TrendingUp,
  TrendingDown,
  Minus,
  ShieldAlert,
  Utensils,
  Sparkles,
  ChevronRight,
} from "lucide-react";

// ======================================================
// Função auxiliar para montar metadados visuais da tendência.
// Isso ajuda a manter o componente limpo e facilita futuras
// expansões de status no dashboard.
// ======================================================
function getTrendMeta(trend) {
  const map = {
    melhora: {
      label: "Em melhora",
      icon: TrendingUp,
      badge: "border-emerald-200 bg-emerald-50 text-emerald-700",
    },
    piora: {
      label: "Em piora",
      icon: TrendingDown,
      badge: "border-rose-200 bg-rose-50 text-rose-700",
    },
    estavel: {
      label: "Estável",
      icon: Minus,
      badge: "border-slate-200 bg-slate-50 text-slate-700",
    },
    sem_dados: {
      label: "Sem dados",
      icon: Minus,
      badge: "border-slate-200 bg-slate-50 text-slate-700",
    },
  };

  return map[trend] || map.estavel;
}

// ======================================================
// Função auxiliar para deixar o texto do padrão
// predominante mais elegante na interface.
// ======================================================
function getPatternLabel(pattern) {
  const map = {
    boa: "Predomínio positivo",
    moderada: "Padrão intermediário",
    ruim: "Padrão crítico",
    indefinido: "Indefinido",
  };

  return map[pattern] || "Indefinido";
}

// ======================================================
// Card de métrica reutilizável.
// Estruturado para funcionar bem tanto no desktop quanto
// no mobile, com leitura rápida e hierarquia forte.
// ======================================================
function SummaryMetricCard({ label, value, helper }) {
  return (
    <div className="rounded-[24px] border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
      <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
        {label}
      </p>

      <div className="mt-3 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
        {value}
      </div>

      <p className="mt-2 text-sm leading-6 text-slate-500">
        {helper}
      </p>
    </div>
  );
}

// ======================================================
// Barra visual de distribuição das refeições.
// Mantém uma leitura simples e intuitiva no mobile.
// ======================================================
function DistributionBar({ boas, moderadas, ruins, total }) {
  const safeTotal = total || 1;

  const boasPct = (boas / safeTotal) * 100;
  const moderadasPct = (moderadas / safeTotal) * 100;
  const ruinsPct = (ruins / safeTotal) * 100;

  return (
    <div>
      <div className="mb-4 h-3 w-full overflow-hidden rounded-full bg-slate-100">
        <div className="flex h-full w-full">
          <div
            className="h-full bg-emerald-400"
            style={{ width: `${boasPct}%` }}
          />
          <div
            className="h-full bg-amber-400"
            style={{ width: `${moderadasPct}%` }}
          />
          <div
            className="h-full bg-rose-400"
            style={{ width: `${ruinsPct}%` }}
          />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2 sm:gap-3">
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3">
          <div className="text-sm font-semibold text-emerald-700">Boas</div>
          <div className="mt-1 text-xl font-bold text-emerald-900">{boas}</div>
        </div>

        <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3">
          <div className="text-sm font-semibold text-amber-700">Moderadas</div>
          <div className="mt-1 text-xl font-bold text-amber-900">{moderadas}</div>
        </div>

        <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3">
          <div className="text-sm font-semibold text-rose-700">Ruins</div>
          <div className="mt-1 text-xl font-bold text-rose-900">{ruins}</div>
        </div>
      </div>
    </div>
  );
}

// ======================================================
// Painel premium de resumo alimentar inteligente.
//
// Pensado para:
// - desktop
// - tablet
// - mobile
//
// Estratégia mobile-first:
// - score e tendência aparecem cedo
// - cards empilháveis
// - distribuição simples
// - texto estratégico com boa leitura em telas pequenas
// ======================================================
export default function FoodSmartSummaryPanel({ resumo }) {
  const data = resumo || {
    score: 0,
    total_refeicoes: 0,
    boas: 0,
    moderadas: 0,
    ruins: 0,
    tendencia: "sem_dados",
    padrao_predominante: "indefinido",
    principal_alerta: "Sem dados suficientes.",
    resumo_executivo: "Ainda não há dados suficientes para leitura estratégica.",
    recomendacao: "Registre mais refeições para ativar o resumo inteligente.",
  };

  const trendMeta = getTrendMeta(data.tendencia);
  const TrendIcon = trendMeta.icon;

  return (
    <section className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-[0_20px_80px_-35px_rgba(15,23,42,0.35)] sm:p-6 lg:rounded-[32px] lg:p-7">
      {/* ==================================================
          Header do painel
          Mantido compacto para mobile e elegante no desktop
         ================================================== */}
      <div className="mb-6 flex flex-col gap-4 lg:mb-7 xl:flex-row xl:items-start xl:justify-between">
        <div>
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500 sm:text-xs">
            <Sparkles size={14} />
            Resumo alimentar inteligente
          </div>

          <h3 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl md:text-[2rem]">
            Como sua alimentação está se comportando
          </h3>

          <p className="mt-2 max-w-3xl text-sm leading-7 text-slate-500">
            O Fitelligence consolida o histórico de refeições analisadas para identificar padrão, tendência e oportunidades de melhoria alimentar.
          </p>
        </div>

        <div
          className={`inline-flex w-fit items-center gap-2 rounded-2xl border px-4 py-2 text-sm font-semibold ${trendMeta.badge}`}
        >
          <TrendIcon size={16} />
          {trendMeta.label}
        </div>
      </div>

      {/* ==================================================
          Métricas principais
          No mobile: empilhadas
          No tablet/desktop: em grid
         ================================================== */}
      <div className="mb-4 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
        <SummaryMetricCard
          label="Score alimentar"
          value={`${data.score}%`}
          helper="Qualidade consolidada das refeições analisadas."
        />

        <SummaryMetricCard
          label="Refeições analisadas"
          value={data.total_refeicoes}
          helper="Base usada para gerar o resumo estratégico."
        />

        <SummaryMetricCard
          label="Padrão predominante"
          value={getPatternLabel(data.padrao_predominante)}
          helper="Leitura principal do comportamento alimentar recente."
        />
      </div>

      {/* ==================================================
          Grid principal
          No mobile: tudo empilhado
          No desktop: duas colunas
         ================================================== */}
      <div className="flex flex-col gap-4 xl:grid xl:grid-cols-[1.05fr_0.95fr]">
        {/* ================================================
            Coluna esquerda
           ================================================ */}
        <div className="space-y-4">
          <div className="rounded-[24px] border border-slate-200 bg-slate-50 p-4 sm:p-5 lg:rounded-[28px]">
            <div className="mb-4 flex items-center gap-2">
              <Utensils size={18} className="text-slate-600" />
              <h4 className="text-base font-semibold text-slate-900 sm:text-lg">
                Distribuição das refeições
              </h4>
            </div>

            <DistributionBar
              boas={data.boas}
              moderadas={data.moderadas}
              ruins={data.ruins}
              total={data.total_refeicoes}
            />
          </div>

          <div className="rounded-[24px] border border-rose-200 bg-rose-50 p-4 sm:p-5 lg:rounded-[28px]">
            <div className="mb-2 flex items-center gap-2">
              <ShieldAlert size={18} className="text-rose-600" />
              <h4 className="text-base font-semibold text-rose-900">
                Principal alerta
              </h4>
            </div>

            <p className="text-sm leading-6 text-rose-700">
              {data.principal_alerta}
            </p>
          </div>
        </div>

        {/* ================================================
            Coluna direita
           ================================================ */}
        <div className="rounded-[24px] border border-slate-200 bg-gradient-to-br from-slate-900 to-slate-800 p-4 text-white sm:p-6 lg:rounded-[28px]">
          <div className="mb-4 flex items-start gap-3">
            <div className="rounded-2xl bg-white/10 p-3 text-white">
              <Brain size={20} />
            </div>

            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-300 sm:text-xs">
                leitura estratégica
              </p>

              <h4 className="mt-1 text-xl font-bold tracking-tight sm:text-2xl">
                O que o Fitelligence está entendendo
              </h4>
            </div>
          </div>

          <p className="text-sm leading-7 text-slate-300">
            {data.resumo_executivo}
          </p>

          <div className="mt-6 rounded-3xl border border-white/10 bg-white/5 p-4">
            <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-white">
              <ChevronRight size={16} />
              Recomendação prioritária
            </div>

            <p className="text-sm leading-6 text-slate-300">
              {data.recomendacao}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}