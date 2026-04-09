"use client";

// ======================================================
// Dashboard do Nutricionista
// Responsavel por:
// - exibir visao clinica e estrategica dos pacientes
// - reforcar padrao alimentar, aderencia e alertas
// - proteger acesso apenas para perfil nutricionista
// - manter experiencia premium e mobile-first
// ======================================================

import { useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../../../src/context/AuthContext";
import { motion } from "framer-motion";
import {
  Users,
  Utensils,
  AlertTriangle,
  LineChart,
  Sparkles,
  ArrowRight,
  ArrowUpRight,
} from "lucide-react";

import PremiumPanel from "../../../../src/components/dashboard/PremiumPanel";
import DashboardPageHeader from "../../../../src/components/dashboard/DashboardPageHeader";
import DashboardSpotlightCard from "../../../../src/components/dashboard/DashboardSpotlightCard";
import StatusBadge from "../../../../src/components/dashboard/StatusBadge";
import EmptyState from "../../../../src/components/ui/EmptyState";
import { fadeUp, staggerContainer } from "../../../../src/lib/motion";

export default function DashboardNutricionistaPage() {
  const router = useRouter();
  const { user, loading } = useAuth();

  // ====================================================
  // Protecao da rota:
  // - se nao estiver autenticado, vai para login
  // - se estiver autenticado mas nao for nutricionista,
  //   volta para o dashboard principal
  // ====================================================
  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push("/login");
        return;
      }

      if (user.tipo_usuario !== "nutricionista") {
        router.push("/dashboard");
      }
    }
  }, [user, loading, router]);

  // ====================================================
  // Dados simulados iniciais
  // Depois vamos conectar com backend real
  // ====================================================
  const resumo = {
    pacientesAtivos: 31,
    boaAderencia: 19,
    emRiscoNutricional: 7,
    scoreAlimentarMedio: 71,
  };

  const pacientes = useMemo(
    () => [
      {
        id: 1,
        nome: "Juliana Rocha",
        status: "bom",
        statusLabel: "Boa aderencia",
        resumo:
          "Padrao alimentar consistente com melhora nas ultimas semanas.",
        score: 82,
      },
      {
        id: 2,
        nome: "Rafael Martins",
        status: "alerta",
        statusLabel: "Alerta",
        resumo: "Oscilacao alimentar com aumento de refeicoes moderadas/ruins.",
        score: 48,
      },
      {
        id: 3,
        nome: "Patricia Gomes",
        status: "critico",
        statusLabel: "Critico",
        resumo: "Poucas refeicoes registradas para leitura clinica robusta.",
        score: 36,
      },
    ],
    []
  );

  // ====================================================
  // Ordena por prioridade:
  // critico -> alerta -> bom
  // ====================================================
  const pacientesOrdenados = useMemo(() => {
    const prioridadePorStatus = {
      critico: 0,
      alerta: 1,
      bom: 2,
    };

    return [...pacientes].sort((a, b) => {
      const prioridadeA = prioridadePorStatus[a.status] ?? 99;
      const prioridadeB = prioridadePorStatus[b.status] ?? 99;

      if (prioridadeA !== prioridadeB) {
        return prioridadeA - prioridadeB;
      }

      // Criterio secundario deterministico: menor score primeiro.
      return Number(a.score || 0) - Number(b.score || 0);
    });
  }, [pacientes]);

  const acoes = [
    "Revisar pacientes com score alimentar baixo",
    "Analisar tendencia das refeicoes da semana",
    "Cruzar evolucao corporal com aderencia alimentar",
  ];

  function getStatusVariant(status) {
    if (status === "bom") return "success";
    if (status === "alerta") return "warning";
    return "danger";
  }

  // ====================================================
  // Enquanto valida autenticacao/perfil, nao renderiza
  // a tela para evitar flicker visual.
  // IMPORTANTE:
  // mantido abaixo dos hooks para preservar ordem fixa.
  // ====================================================
  if (loading || !user) {
    return null;
  }

  return (
    <div className="mx-auto w-full max-w-7xl px-3 py-4 sm:px-4 sm:py-5 lg:px-6 lg:py-6">
      <motion.div
        className="space-y-5 px-1 pb-24 sm:space-y-6 lg:space-y-8"
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
      >
        {/* HEADER */}
        <motion.section variants={fadeUp}>
          <div className="overflow-hidden rounded-[28px] border border-slate-200 bg-gradient-to-br from-white via-slate-50 to-violet-50/40 p-5 shadow-[0_20px_60px_-35px_rgba(15,23,42,0.35)] dark:border-slate-800 dark:from-slate-950 dark:via-slate-950 dark:to-violet-950/20 sm:p-6">
            <DashboardPageHeader
              eyebrow="Dashboard do Nutricionista"
              title="Visao inteligente do comportamento alimentar dos pacientes"
              description="Acompanhe aderencia, padrao alimentar e risco clinico com profundidade estrategica."
              action={
                <div className="inline-flex w-fit items-center gap-2 rounded-2xl border border-slate-200 bg-white/90 px-3.5 py-2 text-xs font-semibold text-slate-700 shadow-sm dark:border-slate-800 dark:bg-slate-900/80 dark:text-slate-200 sm:px-4 sm:py-2.5 sm:text-sm">
                  <Sparkles className="h-4 w-4 text-violet-500" />
                  Inteligencia clinica ativa
                </div>
              }
            />
          </div>
        </motion.section>

        {/* SPOTLIGHT */}
        <motion.section variants={fadeUp}>
          <DashboardSpotlightCard
            title="Seu valor aumenta quando voce transforma comportamento em decisao clinica"
            description="O painel do nutricionista facilita leitura de aderencia, padroes alimentares e pontos de intervencao."
          />
        </motion.section>

        {/* KPIs */}
        <motion.section variants={fadeUp}>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <PremiumPanel
              title="Pacientes ativos"
              description="Base clinica atual"
            >
              <div className="flex items-center gap-3">
                <Users className="h-5 w-5 text-violet-500" />
                <p className="text-3xl font-bold text-slate-900 dark:text-white">
                  {resumo.pacientesAtivos}
                </p>
              </div>
            </PremiumPanel>

            <PremiumPanel
              title="Boa aderencia"
              description="Pacientes mais consistentes"
            >
              <div className="flex items-center gap-3">
                <Utensils className="h-5 w-5 text-emerald-500" />
                <p className="text-3xl font-bold text-slate-900 dark:text-white">
                  {resumo.boaAderencia}
                </p>
              </div>
            </PremiumPanel>

            <PremiumPanel title="Em risco" description="Precisam de intervencao">
              <div className="flex items-center gap-3">
                <AlertTriangle className="h-5 w-5 text-amber-500" />
                <p className="text-3xl font-bold text-slate-900 dark:text-white">
                  {resumo.emRiscoNutricional}
                </p>
              </div>
            </PremiumPanel>

            <PremiumPanel
              title="Score medio"
              description="Qualidade nutricional da base"
            >
              <div className="flex items-center gap-3">
                <LineChart className="h-5 w-5 text-cyan-500" />
                <p className="text-3xl font-bold text-slate-900 dark:text-white">
                  {resumo.scoreAlimentarMedio}
                </p>
              </div>
            </PremiumPanel>
          </div>
        </motion.section>

        {/* PACIENTES PRIORITARIOS */}
        <motion.section variants={fadeUp}>
          <PremiumPanel
            title="Pacientes prioritarios"
            description="Leitura rapida dos pacientes que exigem maior atencao clinica agora."
          >
            {pacientesOrdenados.length === 0 ? (
              <EmptyState title="Nenhum paciente ainda" />
            ) : (
              <div className="grid gap-4">
                {pacientesOrdenados.map((paciente) => (
                  <div
                    key={paciente.id}
                    className="rounded-3xl border border-slate-200 bg-white/70 p-5 transition-all duration-300 hover:border-slate-300 hover:shadow-sm dark:border-slate-800 dark:bg-slate-900/60 dark:hover:border-slate-700"
                  >
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                      <div>
                        <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                          {paciente.nome}
                        </h3>
                        <p className="mt-2 text-sm leading-7 text-slate-600 dark:text-slate-400">
                          {paciente.resumo}
                        </p>
                      </div>

                      <div className="flex flex-wrap items-center gap-2">
                        <StatusBadge variant={getStatusVariant(paciente.status)}>
                          {paciente.statusLabel}
                        </StatusBadge>

                        <StatusBadge variant="neutral">
                          Score: {paciente.score}
                        </StatusBadge>

                        {/* Todo card/linha deve permitir avancar para a ficha. */}
                        <button
                          type="button"
                          // Rota estatica para compatibilidade com output export.
                          onClick={() => router.push(`/paciente?id=${paciente.id}`)}
                          className="inline-flex items-center gap-1 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-50 active:scale-[0.98]"
                        >
                          Ver paciente
                          <ArrowUpRight className="h-3.5 w-3.5" />
                        </button>

                        {/* Alerta critico ja ligado a uma acao objetiva. */}
                        {paciente.status === "critico" ? (
                          <button
                            type="button"
                            // Rota estatica para compatibilidade com output export.
                            onClick={() => router.push(`/paciente?id=${paciente.id}`)}
                            className="inline-flex items-center gap-1 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-xs font-semibold text-red-700 transition hover:bg-red-100 active:scale-[0.98]"
                          >
                            Ajustar plano
                          </button>
                        ) : null}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </PremiumPanel>
        </motion.section>

        {/* ACOES */}
        <motion.section variants={fadeUp}>
          <PremiumPanel
            title="Acoes sugeridas"
            description="Prioridades clinicas e operacionais para aumentar aderencia."
          >
            <div className="grid gap-3">
              {acoes.map((acao) => (
                <button
                  key={acao}
                  type="button"
                  onClick={() => router.push("/plano-alimentar")}
                  className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50/80 px-4 py-4 text-left transition hover:bg-slate-100 active:scale-[0.98] dark:border-slate-800 dark:bg-slate-950/60"
                >
                  <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    {acao}
                  </p>

                  <ArrowRight className="h-4 w-4 text-slate-400" />
                </button>
              ))}
            </div>
          </PremiumPanel>
        </motion.section>
      </motion.div>
    </div>
  );
}
