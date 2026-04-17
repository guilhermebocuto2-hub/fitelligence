"use client";

// ======================================================
// DailyHomeSummary
// Responsavel por montar a Home principal em formato
// hibrido (fixo + carrosseis) com foco mobile-first.
// Estrutura obrigatoria desta tela:
// 1) Resumo do dia (fixo)
// 2) Acao principal (fixo)
// 3) Insights de IA (carrossel)
// 4) Evolucao rapida (carrossel)
// 5) Plano do dia (fixo)
// ======================================================

import {
  Sparkles,
  Utensils,
  ClipboardList,
  TrendingUp,
  Droplets,
  Beef,
  Moon,
  ArrowRight,
} from "lucide-react";
import PremiumCard from "../ui/PremiumCard";
import SectionHeader from "../ui/SectionHeader";
import HorizontalCarousel from "../ui/HorizontalCarousel";

// ======================================================
// Leitura segura de numeros para evitar NaN no UI.
// ======================================================
function toNumber(value, fallback = 0) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

// ======================================================
// Formata data curta para cards de evolucao.
// ======================================================
function formatDate(value) {
  if (!value) return "Sem registro";

  try {
    return new Date(value).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
    });
  } catch {
    return "Sem registro";
  }
}

// ======================================================
// Extrai calorias consumidas e meta diaria com fallback.
// ======================================================
function extractCaloriesSummary(dashboard = {}) {
  const foodSummary =
    dashboard?.resumo_alimentar_dashboard ||
    dashboard?.resumo_alimentar_inteligente ||
    dashboard?.resumo_alimentar ||
    {};

  const consumed = toNumber(
    foodSummary?.calorias_medias ??
      dashboard?.calorias_consumidas ??
      dashboard?.calorias_consumidas_hoje ??
      0
  );

  const target = toNumber(
    dashboard?.meta_calorica ??
      dashboard?.ultimo_plano?.calorias ??
      dashboard?.meta_calorias ??
      dashboard?.meta_calorias_diaria ??
      2000
  );

  return { consumed, target, foodSummary };
}

// ======================================================
// Gera status curto do dia para leitura em segundos.
// ======================================================
function buildDayStatus({ consumed, target }) {
  if (!target || target <= 0) {
    return "Defina uma meta diaria para acompanhar seu progresso com mais clareza.";
  }

  const progress = Math.round((consumed / target) * 100);

  if (progress < 70) {
    return "Voce ainda tem boa margem para fechar o dia com equilibrio.";
  }

  if (progress <= 105) {
    return "Ritmo consistente hoje. Continue assim para sustentar resultado.";
  }

  return "Consumo acima da meta hoje. Ajustes leves no restante do dia ajudam a compensar.";
}

// ======================================================
// Monta cards curtos de insight inteligente usando dados
// existentes e fallback elegante quando faltar conteudo.
// ======================================================
function buildInsightCards({ dashboard = {}, dashboardInsights = [], insightAlimentar = null, foodSummary = {} }) {
  const cards = [];

  const protein = toNumber(foodSummary?.proteina_media ?? dashboard?.proteina_media ?? 0);
  const consistency = toNumber(dashboard?.score_consistencia ?? 0);
  const hydration = toNumber(dashboard?.agua_media ?? dashboard?.consumo_agua ?? 0);
  const dinner = toNumber(foodSummary?.calorias_jantar ?? dashboard?.calorias_jantar ?? 0);

  if (protein > 0 && protein < 90) {
    cards.push({
      id: "insight_proteina",
      icon: Beef,
      title: "Proteina abaixo da meta",
      message: "Aumentar proteina no almoco e jantar pode melhorar saciedade e recuperacao.",
      tone: "from-amber-500 to-orange-500",
    });
  }

  if (consistency >= 70) {
    cards.push({
      id: "insight_consistencia",
      icon: TrendingUp,
      title: "Boa consistencia recente",
      message: "Seus ultimos registros mostram ritmo estavel. Continue com o mesmo padrao.",
      tone: "from-emerald-500 to-cyan-500",
    });
  }

  if (hydration > 0 && hydration < 1800) {
    cards.push({
      id: "insight_hidratacao",
      icon: Droplets,
      title: "Hidratacao baixa",
      message: "Um ajuste simples de agua ao longo do dia pode melhorar energia e controle de fome.",
      tone: "from-sky-500 to-blue-500",
    });
  }

  if (dinner > 0 && dinner >= 700) {
    cards.push({
      id: "insight_jantar",
      icon: Moon,
      title: "Consumo elevado no jantar",
      message: "Antecipar parte das calorias para o dia pode reduzir exageros no periodo noturno.",
      tone: "from-violet-500 to-indigo-500",
    });
  }

  // ====================================================
  // Reaproveita insights vindos do motor atual do projeto.
  // ====================================================
  dashboardInsights.slice(0, 3).forEach((item, index) => {
    if (!item?.descricao) return;

    cards.push({
      id: `insight_engine_${index}`,
      icon: Sparkles,
      title: item?.titulo || "Insight inteligente",
      message: item.descricao,
      tone: "from-fuchsia-500 to-violet-500",
    });
  });

  if (insightAlimentar?.mensagem || insightAlimentar?.insight) {
    cards.push({
      id: "insight_food_ai",
      icon: Sparkles,
      title: "Leitura alimentar de IA",
      message: insightAlimentar?.mensagem || insightAlimentar?.insight,
      tone: "from-purple-500 to-pink-500",
    });
  }

  // ====================================================
  // Garante que a secao sempre tenha conteudo util.
  // ====================================================
  if (cards.length === 0) {
    cards.push({
      id: "insight_fallback",
      icon: Sparkles,
      title: "Insight do dia",
      message: "Consistencia diaria supera perfeicao. Pequenas decisoes inteligentes geram grande resultado.",
      tone: "from-emerald-500 to-cyan-500",
    });
  }

  return cards.slice(0, 8);
}

// ======================================================
// Monta cards de evolucao rapida em formato curto.
// ======================================================
function buildEvolutionCards({ dashboard = {}, pesoAtual = 0, perdaTotal = 0, progressoMetaPercentual = 0 }) {
  const history = Array.isArray(dashboard?.historico_progresso)
    ? dashboard.historico_progresso
    : Array.isArray(dashboard?.progresso)
      ? dashboard.progresso
      : [];

  const last = dashboard?.ultimo_progresso || history?.[0] || null;
  const previous = history?.[1] || null;

  const weeklyVariation =
    previous?.peso !== undefined && previous?.peso !== null && last?.peso !== undefined && last?.peso !== null
      ? (toNumber(last.peso, 0) - toNumber(previous.peso, 0)).toFixed(1)
      : null;

  const streak = toNumber(
    dashboard?.sequencia_dias_ativos ??
      dashboard?.streak_dias ??
      dashboard?.checkins_semana ??
      dashboard?.total_checkins_semana ??
      0
  );

  const cards = [
    {
      id: "evo_peso",
      label: "Peso atual",
      value: pesoAtual ? `${toNumber(pesoAtual, 0).toFixed(1)} kg` : "--",
      helper: "Baseado no ultimo progresso",
    },
    {
      id: "evo_variacao",
      label: "Variacao semanal",
      value: weeklyVariation !== null ? `${weeklyVariation} kg` : "--",
      helper: weeklyVariation !== null ? "Comparado ao registro anterior" : "Sem historico suficiente",
    },
    {
      id: "evo_meta",
      label: "Progresso da meta",
      value: `${Math.max(0, Math.min(100, Math.round(toNumber(progressoMetaPercentual, 0))))}%`,
      helper: "Percentual da meta ativa",
    },
    {
      id: "evo_streak",
      label: "Dias ativos",
      value: `${streak}`,
      helper: "Sequencia recente de atividade",
    },
    {
      id: "evo_last_update",
      label: "Ultima atualizacao",
      value: formatDate(last?.data_registro || last?.criado_em),
      helper: "Data do ultimo registro corporal",
    },
    {
      id: "evo_total",
      label: "Variacao acumulada",
      value:
        perdaTotal > 0
          ? `-${Math.abs(perdaTotal).toFixed(1)} kg`
          : perdaTotal < 0
            ? `+${Math.abs(perdaTotal).toFixed(1)} kg`
            : "0.0 kg",
      helper: "Leitura acumulada da jornada",
    },
  ];

  return cards;
}

export default function DailyHomeSummary({
  dashboard = {},
  pesoAtual = 0,
  perdaTotal = 0,
  progressoMetaPercentual = 0,
  insightAlimentar = null,
  dashboardInsights = [],
  onAnalisarRefeicao,
  onCheckinHoje,
  onAcompanharMetas,
}) {
  const { consumed, target, foodSummary } = extractCaloriesSummary(dashboard);
  const resumoExecucao = dashboard?.resumo_execucao_diaria || {};
  const acaoPrincipal = dashboard?.acao_principal_do_dia || null;
  const metaAgua = toNumber(dashboard?.meta_agua, 0);
  const metaPassos = toNumber(dashboard?.meta_passos, 0);
  const aguaHoje = toNumber(resumoExecucao?.agua_hoje, 0);
  const passosHoje = toNumber(resumoExecucao?.passos_hoje, 0);
  const metaCaloricaReal = toNumber(dashboard?.meta_calorica, target);

  const dayProgress =
    target > 0
      ? Math.max(0, Math.min(100, Math.round((consumed / target) * 100)))
      : 0;

  const dayStatus = buildDayStatus({ consumed, target });

  const insightCards = buildInsightCards({
    dashboard,
    dashboardInsights,
    insightAlimentar,
    foodSummary,
  });

  const evolutionCards = buildEvolutionCards({
    dashboard,
    pesoAtual,
    perdaTotal,
    progressoMetaPercentual,
  });

  // ====================================================
  // Mantem acao principal fixa no topo.
  // ====================================================
  const mainAction =
    acaoPrincipal?.tipo === "fazer_checkin"
      ? {
          title: acaoPrincipal.titulo,
          description: acaoPrincipal.descricao,
          cta: acaoPrincipal.cta_label,
          onClick: onCheckinHoje,
          icon: ClipboardList,
        }
      : acaoPrincipal?.tipo === "registrar_refeicao"
        ? {
            title: acaoPrincipal.titulo,
            description: acaoPrincipal.descricao,
            cta: acaoPrincipal.cta_label,
            onClick: onAnalisarRefeicao,
            icon: Utensils,
          }
        : {
            title: acaoPrincipal?.titulo || "Continuar jornada",
            description:
              acaoPrincipal?.descricao ||
              "Mantenha seus registros para evoluir com mais consistencia.",
            cta: acaoPrincipal?.cta_label || "Abrir check-in",
            onClick:
              acaoPrincipal?.tipo === "acompanhar_metas"
                ? onAcompanharMetas || onCheckinHoje
                : onCheckinHoje,
            icon:
              acaoPrincipal?.tipo === "registrar_refeicao"
                ? Utensils
                : ClipboardList,
          };

  const dayPlan = dashboard?.ultimo_plano;
  const MainActionIcon = mainAction.icon;
  const dayPlanSummary = dayPlan
    ? `${toNumber(dayPlan?.calorias, 0)} kcal • ${
        toNumber(dayPlan?.proteina, 0) || "--"
      }g proteina • ${toNumber(dayPlan?.carboidrato, 0) || "--"}g carbo`
    : "Sem plano recente identificado. Registre refeições para receber orientações mais personalizadas.";

  return (
    <div className="space-y-4 sm:space-y-5">
      {/* 1) BLOCO FIXO: resumo do dia */}
      <PremiumCard className="rounded-[28px]">
        <SectionHeader
          eyebrow="Resumo do dia"
          title="Seu dia em 30 segundos"
          description="Leitura rapida do consumo atual versus a meta diaria."
        />

        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">
              Calorias consumidas
            </p>
            <p className="mt-2 text-2xl font-bold tracking-tight text-slate-900">
              {consumed} kcal
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">
              Meta diaria
            </p>
            <p className="mt-2 text-2xl font-bold tracking-tight text-slate-900">
              {metaCaloricaReal} kcal
            </p>
          </div>
        </div>

        <div className="mt-4">
          <div className="h-2.5 w-full overflow-hidden rounded-full bg-slate-200">
            <div
              className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-cyan-500 transition-all duration-500"
              style={{ width: `${dayProgress}%` }}
            />
          </div>

          <p className="mt-2 text-sm text-slate-600">{dayStatus}</p>
        </div>
      </PremiumCard>

      {/* 2) BLOCO FIXO: acao principal */}
      <PremiumCard
        glow
        className="rounded-[28px] border-emerald-200/80 bg-gradient-to-br from-emerald-50 via-white to-cyan-50"
      >
        <div className="flex items-start gap-3">
          <div className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700">
            <MainActionIcon className="h-5 w-5" />
          </div>

          <div className="min-w-0">
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-emerald-700">
              Ação principal
            </p>
            <h3 className="mt-1 text-lg font-semibold tracking-tight text-slate-900">
              {mainAction.title}
            </h3>
            <p className="mt-1 text-sm leading-6 text-slate-600">
              {mainAction.description}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={mainAction.onClick}
          className="mt-4 inline-flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[#7C3AED] to-[#6D28D9] px-4 text-sm font-semibold text-white shadow-lg shadow-violet-500/25 transition active:scale-[0.98]"
        >
          {mainAction.cta}
          <ArrowRight className="h-4 w-4" />
        </button>
      </PremiumCard>

      {/* 3) BLOCO FIXO: metas do dia */}
      <PremiumCard className="rounded-[28px]">
        <SectionHeader
          eyebrow="Metas do dia"
          title="Seus objetivos operacionais"
          description="Metas diarias derivadas do seu onboarding para manter consistencia."
        />

        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">
              Agua
            </p>
            <p className="mt-2 text-xl font-bold text-slate-900">
              {aguaHoje} / {metaAgua || "--"} ml
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">
              Passos
            </p>
            <p className="mt-2 text-xl font-bold text-slate-900">
              {passosHoje} / {metaPassos || "--"}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">
              Check-in
            </p>
            <p className="mt-2 text-xl font-bold text-slate-900">
              {resumoExecucao?.checkin_realizado_hoje ? "Feito" : "Pendente"}
            </p>
          </div>
        </div>
      </PremiumCard>

      {/* 4) CARROSSEL HORIZONTAL: insights de IA */}
      <PremiumCard className="rounded-[28px]">
        <SectionHeader
          eyebrow="Insights de IA"
          title="Leituras inteligentes do seu dia"
          description="Mensagens curtas para orientar ajustes com clareza e sem excesso de informacao."
        />

        <div className="mt-4">
          <HorizontalCarousel
            ariaLabel="Insights inteligentes do dia"
            itemClassName="min-w-[86%] sm:min-w-[360px]"
            trackClassName="gap-3 sm:gap-4"
          >
            {insightCards.map((insight) => {
              const Icon = insight.icon;

              return (
                <div
                  key={insight.id}
                  className="rounded-2xl border border-slate-200 bg-slate-50 p-4"
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={`inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${insight.tone} text-white`}
                    >
                      <Icon className="h-4 w-4" />
                    </div>

                    <div>
                      <p className="text-sm font-semibold text-slate-900">{insight.title}</p>
                      <p className="mt-1 text-sm leading-6 text-slate-600">{insight.message}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </HorizontalCarousel>
        </div>
      </PremiumCard>

      {/* 5) CARROSSEL HORIZONTAL: evolucao rapida */}
      <PremiumCard className="rounded-[28px]">
        <SectionHeader
          eyebrow="Evolucao rapida"
          title="Metricas essenciais"
          description="Cartoes curtos para acompanhar progresso sem graficos complexos."
        />

        <div className="mt-4">
          <HorizontalCarousel
            ariaLabel="Metricas de evolucao rapida"
            itemClassName="min-w-[74%] sm:min-w-[260px]"
            trackClassName="gap-3 sm:gap-4"
          >
            {evolutionCards.map((item) => (
              <div
                key={item.id}
                className="rounded-2xl border border-slate-200 bg-slate-50 p-4"
              >
                <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">
                  {item.label}
                </p>
                <p className="mt-2 text-xl font-bold tracking-tight text-slate-900">
                  {item.value}
                </p>
                <p className="mt-1 text-xs leading-5 text-slate-600">{item.helper}</p>
              </div>
            ))}
          </HorizontalCarousel>
        </div>
      </PremiumCard>

      {/* 6) BLOCO FIXO: plano do dia */}
      <PremiumCard className="rounded-[28px]">
        <SectionHeader
          eyebrow="Plano do dia"
          title="Sua orientação de hoje"
          description="Resumo enxuto para facilitar execução sem poluição visual."
        />

        <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 p-4">
          <p className="text-sm leading-6 text-slate-700">{dayPlanSummary}</p>
        </div>
      </PremiumCard>
    </div>
  );
}
