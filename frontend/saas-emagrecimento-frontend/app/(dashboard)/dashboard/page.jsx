"use client";

// ======================================================
// Home principal (dashboard) do Fitelligence
// Responsavel por:
// - carregar dados agregados do dashboard
// - manter regra de autenticacao existente
// - organizar a interface em resumo do dia (mobile-first)
// - reduzir poluicao visual sem alterar backend
// ======================================================

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

import DailyHomeSummary from "../../../src/components/dashboard/DailyHomeSummary";
import DailyPlanCard from "../../../src/components/dashboard/DailyPlanCard";
import WeeklyProgressCard from "../../../src/components/dashboard/WeeklyProgressCard";
import StreakHighlight from "../../../src/components/dashboard/StreakHighlight";
import TomorrowPreviewCard from "../../../src/components/dashboard/TomorrowPreviewCard";
import PremiumUpgradeHint from "../../../src/components/dashboard/PremiumUpgradeHint";
import CoachDoDiaCard from "../../../src/components/dashboard/CoachDoDiaCard";
import MobileLayout from "../../../src/components/layout/MobileLayout";

import { useToast } from "../../../src/context/ToastContext";
import { getDashboardInsights } from "../../../src/lib/dashboardInsights";
import { fadeUp, staggerContainer } from "../../../src/lib/motion";
import { useAuth } from "../../../src/context/AuthContext";

function toObject(value) {
  return value && typeof value === "object" && !Array.isArray(value) ? value : {};
}

function toArray(value) {
  return Array.isArray(value) ? value : [];
}

function hasMeaningfulContent(value) {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return false;
  }

  return Object.values(value).some((item) => {
    if (Array.isArray(item)) {
      return item.length > 0;
    }

    if (item && typeof item === "object") {
      return Object.keys(item).length > 0;
    }

    return item !== null && item !== undefined && item !== "";
  });
}

// ====================================================
// Normaliza o payload do dashboard na borda da pagina.
// Isso evita que cada card precise adivinhar formatos
// diferentes logo apos onboarding, refresh ou carga
// parcial da API.
// ====================================================
function normalizeDashboardPayload(rawDashboard) {
  const dashboard = toObject(rawDashboard);
  const usuario = toObject(dashboard.usuario);
  const resumoExecucao = toObject(dashboard.resumo_execucao_diaria);
  const execucaoPlano = toObject(dashboard.execucao_plano_do_dia);
  const planoDoDia = toObject(dashboard.plano_do_dia);
  const ultimoPlano = toObject(dashboard.ultimo_plano);
  const ultimoProgresso = toObject(
    dashboard.ultimo_progresso || dashboard.ultimo_registro
  );
  const motivacaoDoDia = toObject(dashboard.motivacao_do_dia);
  const coachDoDia = toObject(dashboard.coach_do_dia);

  return {
    ...dashboard,
    usuario,
    resumo_execucao_diaria: resumoExecucao,
    execucao_plano_do_dia: execucaoPlano,
    plano_do_dia: hasMeaningfulContent(planoDoDia) ? planoDoDia : null,
    ultimo_plano: hasMeaningfulContent(ultimoPlano) ? ultimoPlano : null,
    ultimo_progresso: hasMeaningfulContent(ultimoProgresso)
      ? ultimoProgresso
      : null,
    ultimo_registro: hasMeaningfulContent(ultimoProgresso)
      ? ultimoProgresso
      : null,
    historico_progresso: toArray(dashboard.historico_progresso),
    historico_execucao_plano: toArray(dashboard.historico_execucao_plano),
    habitos: toArray(dashboard.habitos),
    checkins: toArray(dashboard.checkins),
    metas_ativas: toArray(dashboard.metas_ativas),
    metas_concluidas: toArray(dashboard.metas_concluidas),
    alertas: toArray(dashboard.alertas),
    alertas_alimentares: toArray(dashboard.alertas_alimentares),
    notificacoes_inteligentes: toArray(dashboard.notificacoes_inteligentes),
    historico_refeicoes: toArray(dashboard.historico_refeicoes),
    onboarding_respostas: toObject(dashboard.onboarding_respostas),
    motivacao_do_dia: hasMeaningfulContent(motivacaoDoDia)
      ? motivacaoDoDia
      : null,
    coach_do_dia: hasMeaningfulContent(coachDoDia) ? coachDoDia : null,
  };
}

export default function DashboardPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const { showToast } = useToast();

  // ====================================================
  // Estados principais da Home
  // ====================================================
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  // ====================================================
  // Carrega dashboard agregado mantendo endpoint atual
  // ====================================================
  useEffect(() => {
    async function carregarDashboard() {
      try {
        if (authLoading) return;
        if (!user) return;

        const token = localStorage.getItem("token");
        if (!token) return;

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/dashboard`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data?.erro ||
              data?.mensagem ||
              "Nao foi possivel carregar o dashboard."
          );
        }

        setDashboardData(normalizeDashboardPayload(data?.dashboard));
      } catch (error) {
        console.error("Erro ao carregar dashboard:", error);

        // ==================================================
        // Mantem a Home renderizavel mesmo quando a API vier
        // parcial ou falhar em um refresh logo apos onboarding.
        // ==================================================
        setDashboardData({});

        showToast({
          title: "Erro ao carregar dashboard",
          description:
            "Nao foi possivel buscar os dados agora. Tente novamente em instantes.",
          type: "error",
        });
      } finally {
        setLoading(false);
      }
    }

    carregarDashboard();
  }, [authLoading, user, showToast]);

  // ====================================================
  // Dados derivados usados na nova Home resumida
  // ====================================================
  // ====================================================
  // Fluxo unico:
  // o dashboard opera exclusivamente com perfil usuario,
  // independentemente de valores legados vindos da API.
  // ====================================================
  const perfilTipo = "usuario";
  const dashboardInsights = useMemo(() => {
    return getDashboardInsights({
      perfilTipo,
      dashboard: dashboardData || {},
    });
  }, [perfilTipo, dashboardData]);

  const insightAlimentar = dashboardData?.insight_alimentar || null;

  const pesoAtual = useMemo(() => {
    const pesoDoUltimoProgresso = dashboardData?.ultimo_progresso?.peso;

    if (pesoDoUltimoProgresso !== null && pesoDoUltimoProgresso !== undefined) {
      return Number(pesoDoUltimoProgresso || 0);
    }

    return Number(dashboardData?.peso_atual || 0);
  }, [dashboardData]);

  const perdaTotal = useMemo(() => {
    return Number(dashboardData?.perda_total || 0);
  }, [dashboardData]);

  const progressoMetaPercentual = useMemo(() => {
    return Number(dashboardData?.meta_ativa_progresso_percentual || 0);
  }, [dashboardData]);

  const motivacaoFallback = useMemo(() => {
    const scoreDia = Number(dashboardData?.score_dia || 0);
    const motivacaoAtual = dashboardData?.motivacao_do_dia;

    if (motivacaoAtual?.titulo || motivacaoAtual?.mensagem) {
      return motivacaoAtual;
    }

    if (scoreDia >= 70) {
      return {
        titulo: "Voce esta muito bem hoje",
        mensagem: "Seu ritmo de hoje vale ser repetido amanha.",
        tom: "reforco",
      };
    }

    if (scoreDia >= 35) {
      return {
        titulo: "Seu dia ainda pode crescer",
        mensagem: "Mais uma acao relevante hoje ja melhora bastante sua consistencia.",
        tom: "incentivo",
      };
    }

    return {
      titulo: "Comece por uma acao simples",
      mensagem: "Água, check-in ou uma refeição registrada já mudam o rumo do dia.",
      tom: "atencao",
    };
  }, [dashboardData]);

  const dashboardComFallback = useMemo(() => {
    return {
      ...normalizeDashboardPayload(dashboardData),
      motivacao_do_dia: motivacaoFallback,
      badges_usuario: [
        Number(dashboardData?.streak_dias || 0) >= 1 ? "primeiro_treino" : null,
        Number(dashboardData?.streak_dias || 0) >= 3 ? "3_dias" : null,
        Number(dashboardData?.streak_dias || 0) >= 7 ? "7_dias" : null,
        Number(dashboardData?.score_dia || 0) >= 90 ? "dia_perfeito" : null,
      ].filter(Boolean),
    };
  }, [dashboardData, motivacaoFallback]);

  // ====================================================
  // Acoes principais da Home resumida
  // ====================================================
  function abrirAnaliseRefeicao() {
    router.push("/plano-alimentar");
  }

  function abrirCheckinHoje() {
    router.push("/checkins");
  }

  function abrirMetasHoje() {
    router.push("/metas");
  }

  function atualizarExecucaoNoDashboard(partial = {}) {
    setDashboardData((current) => ({
      ...(current || {}),
      ...partial,
    }));
  }

  if (loading || authLoading) {
    return (
      <div className="mx-auto flex min-h-[60vh] w-full max-w-7xl items-center justify-center px-4 py-10">
        <div className="text-center">
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
            Carregando resumo inteligente do seu dia...
          </p>
        </div>
      </div>
    );
  }

  return (
    <MobileLayout
      title="Home"
      subtitle="Seu plano diário com execução rápida"
      scoreDia={dashboardComFallback?.score_dia || 0}
      streakDias={dashboardComFallback?.streak_dias || 0}
    >
      <motion.div
        className="mx-auto w-full max-w-3xl space-y-4 overflow-x-hidden sm:space-y-5"
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
      >
        {/* =================================================
            Home principal no formato hibrido final:
            - blocos criticos fixos na vertical
            - secoes complementares em carrossel horizontal
           ================================================= */}
        <motion.section variants={fadeUp}>
          <DailyHomeSummary
            dashboard={dashboardComFallback || {}}
            pesoAtual={pesoAtual}
            perdaTotal={perdaTotal}
            progressoMetaPercentual={progressoMetaPercentual}
            insightAlimentar={insightAlimentar}
            dashboardInsights={dashboardInsights}
            onAnalisarRefeicao={abrirAnaliseRefeicao}
            onCheckinHoje={abrirCheckinHoje}
            onAcompanharMetas={abrirMetasHoje}
          />
        </motion.section>

        <motion.section variants={fadeUp}>
          <DailyPlanCard
            dashboard={dashboardComFallback || {}}
            planoDoDia={dashboardComFallback?.plano_do_dia || null}
            onExecutionUpdated={atualizarExecucaoNoDashboard}
          />
        </motion.section>

        <motion.section variants={fadeUp}>
          <StreakHighlight streakDias={dashboardComFallback?.streak_dias || 0} />
        </motion.section>

        <motion.section variants={fadeUp}>
          <WeeklyProgressCard dashboard={dashboardComFallback || {}} />
        </motion.section>

        <motion.section variants={fadeUp}>
          <TomorrowPreviewCard
            dashboard={dashboardComFallback || {}}
            planoDoDia={dashboardComFallback?.plano_do_dia || null}
          />
        </motion.section>

        <motion.section variants={fadeUp}>
          <PremiumUpgradeHint dashboard={dashboardComFallback || {}} />
        </motion.section>

        <motion.section variants={fadeUp}>
          <CoachDoDiaCard coach={dashboardComFallback?.coach_do_dia || null} />
        </motion.section>
      </motion.div>
    </MobileLayout>
  );
}
