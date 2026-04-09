"use client";

// ======================================================
// Dashboard do Personal Trainer (UX premium)
// Estrutura principal:
// - carrossel de alunos/pacientes
// - metricas gerais
// - alertas inteligentes
// - lista de alunos/pacientes
// ======================================================

import { useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../../../src/context/AuthContext";
import { motion } from "framer-motion";
import {
  AlertTriangle,
  ArrowUpRight,
  BarChart3,
  ShieldAlert,
  Users,
  Sparkles,
  UserCheck,
} from "lucide-react";

import StatusBadge from "../../../../src/components/dashboard/StatusBadge";
import PremiumCard from "../../../../src/components/ui/PremiumCard";
import SectionHeader from "../../../../src/components/ui/SectionHeader";
import HorizontalCarousel from "../../../../src/components/ui/HorizontalCarousel";
import EmptyState from "../../../../src/components/ui/EmptyState";
import { fadeUp, staggerContainer } from "../../../../src/lib/motion";

export default function DashboardPersonalPage() {
  const router = useRouter();
  const { user, loading } = useAuth();

  // ====================================================
  // Protecao da rota:
  // - se nao estiver autenticado, vai para login
  // - se estiver autenticado mas nao for personal,
  //   volta para o dashboard principal
  // ====================================================
  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push("/login");
        return;
      }

      if (user.tipo_usuario !== "personal") {
        router.push("/dashboard");
      }
    }
  }, [user, loading, router]);

  // ====================================================
  // Dados mockados para fase inicial do modulo personal
  // Nao altera backend nesta etapa
  // ====================================================
  const alunos = useMemo(
    () => [
      {
        id: 1,
        nome: "Carlos Henrique",
        progresso: 82,
        status: "bom",
        resumo: "Ganho de forca estavel e aderencia alta.",
      },
      {
        id: 2,
        nome: "Mariana Souza",
        progresso: 46,
        status: "alerta",
        resumo: "Queda de frequencia nos ultimos 7 dias.",
      },
      {
        id: 3,
        nome: "Fernanda Lima",
        progresso: 28,
        status: "critico",
        resumo: "Sem registros recentes de treino e check-in.",
      },
      {
        id: 4,
        nome: "Rafael Mendes",
        progresso: 74,
        status: "bom",
        resumo: "Evolucao consistente com boa resposta corporal.",
      },
      {
        id: 5,
        nome: "Bianca Costa",
        progresso: 51,
        status: "alerta",
        resumo: "Aderencia parcial ao plano semanal.",
      },
    ],
    []
  );

  // ====================================================
  // Ordena por prioridade operacional:
  // critico -> alerta -> bom
  // ====================================================
  const alunosOrdenados = useMemo(() => {
    const prioridadePorStatus = {
      critico: 0,
      alerta: 1,
      bom: 2,
    };

    return [...alunos].sort((a, b) => {
      const prioridadeA = prioridadePorStatus[a.status] ?? 99;
      const prioridadeB = prioridadePorStatus[b.status] ?? 99;

      if (prioridadeA !== prioridadeB) {
        return prioridadeA - prioridadeB;
      }

      // Criterio secundario deterministico para manter previsibilidade.
      return Number(a.progresso || 0) - Number(b.progresso || 0);
    });
  }, [alunos]);

  // ====================================================
  // Metricas gerais calculadas em memoria (mock)
  // ====================================================
  const resumo = useMemo(() => {
    const total = alunos.length;
    const risco = alunos.filter((aluno) => aluno.status === "critico").length;
    const ativos = total - risco;
    const mediaProgresso = total
      ? Math.round(
          alunos.reduce((acc, aluno) => acc + Number(aluno.progresso || 0), 0) /
            total
        )
      : 0;

    return {
      total,
      ativos,
      risco,
      mediaProgresso,
    };
  }, [alunos]);

  // ====================================================
  // Alertas inteligentes mockados para orientar acao
  // ====================================================
  const alertasInteligentes = useMemo(() => {
    const criticos = alunos.filter((aluno) => aluno.status === "critico");
    const emAlerta = alunos.filter((aluno) => aluno.status === "alerta");
    const alertas = [];

    if (criticos.length > 0) {
      alertas.push({
        id: "alerta_critico",
        nivel: "critico",
        titulo: `${criticos.length} paciente(s) em risco critico`,
        descricao: "Priorize contato nas proximas 24h para evitar abandono.",
        acaoLabel: "Ajustar plano",
      });
    }

    if (emAlerta.length > 0) {
      alertas.push({
        id: "alerta_atencao",
        nivel: "alerta",
        titulo: `${emAlerta.length} paciente(s) com aderencia oscilando`,
        descricao: "Reforce rotina minima semanal com micro-metas.",
      });
    }

    alertas.push({
      id: "alerta_oportunidade",
      nivel: "bom",
      titulo: "Oportunidade de escala no acompanhamento",
      descricao:
        "Padronize check-ins para reduzir esforco operacional e ganhar previsibilidade.",
    });

    return alertas;
  }, [alunos]);

  // ====================================================
  // Mapeia status funcional para estilo visual padrao
  // ====================================================
  function getStatusVariant(status) {
    if (status === "bom") return "success";
    if (status === "alerta") return "warning";
    return "danger";
  }

  function getStatusLabel(status) {
    if (status === "bom") return "Bom";
    if (status === "alerta") return "Alerta";
    return "Critico";
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
        {/* HEADER PREMIUM */}
        <motion.section variants={fadeUp}>
          <PremiumCard
            glow
            className="bg-gradient-to-br from-white via-slate-50 to-violet-50/40"
          >
            <SectionHeader
              eyebrow="Dashboard do Personal"
              title="Gestao inteligente da sua carteira de pacientes"
              description="Acompanhe evolucao, consistencia e risco de abandono com visao estrategica."
              action={
                <div className="inline-flex w-fit items-center gap-2 rounded-2xl border border-slate-200 bg-white/90 px-3.5 py-2 text-xs font-semibold text-slate-700 shadow-sm dark:border-slate-800 dark:bg-slate-900/80 dark:text-slate-200 sm:px-4 sm:py-2.5 sm:text-sm">
                  <Sparkles className="h-4 w-4 text-violet-500" />
                  Operacao premium ativa
                </div>
              }
            />
          </PremiumCard>
        </motion.section>

        {/* CARROSSEL DE PACIENTES */}
        <motion.section variants={fadeUp}>
          <PremiumCard>
            <SectionHeader
              eyebrow="Pacientes"
              title="Carteira em foco"
              description="Navegue pelos pacientes com leitura rapida de progresso e status."
            />

            <div className="mt-4 sm:mt-5">
              {alunosOrdenados.length === 0 ? (
                // Empty state para evitar tela vazia quando nao existir base.
                <EmptyState title="Nenhum paciente ainda" />
              ) : (
                <HorizontalCarousel
                  ariaLabel="Carrossel de pacientes do personal"
                  itemClassName="min-w-[82%] sm:min-w-[340px] lg:min-w-[300px]"
                >
                  {alunosOrdenados.map((aluno) => (
                    <PremiumCard
                      key={aluno.id}
                      compact
                      className="h-full"
                      interactive={false}
                    >
                      {/* Card inteiro clicavel para abrir a ficha do paciente. */}
                      <button
                        type="button"
                        // Rota estatica para compatibilidade com output export.
                        onClick={() => router.push(`/paciente?id=${aluno.id}`)}
                        className="w-full space-y-4 text-left"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <h3 className="text-base font-semibold text-slate-900">
                            {aluno.nome}
                          </h3>
                          <StatusBadge variant={getStatusVariant(aluno.status)}>
                            {getStatusLabel(aluno.status)}
                          </StatusBadge>
                        </div>

                        <p className="text-sm leading-6 text-slate-600">
                          {aluno.resumo}
                        </p>

                        <div>
                          <div className="mb-2 flex items-center justify-between text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                            <span>Progresso</span>
                            <span>{aluno.progresso}%</span>
                          </div>
                          <div className="h-2.5 w-full overflow-hidden rounded-full bg-slate-200">
                            <div
                              className="h-full rounded-full bg-gradient-to-r from-violet-600 to-indigo-600"
                              style={{
                                width: `${Math.max(
                                  0,
                                  Math.min(100, aluno.progresso)
                                )}%`,
                              }}
                            />
                          </div>
                        </div>
                      </button>
                    </PremiumCard>
                  ))}
                </HorizontalCarousel>
              )}
            </div>
          </PremiumCard>
        </motion.section>

        {/* METRICAS GERAIS */}
        <motion.section variants={fadeUp}>
          <PremiumCard>
            <SectionHeader
              eyebrow="Panorama"
              title="Metricas gerais"
              description="Leitura rapida da operacao para priorizar acoes do dia."
            />

            <div className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <PremiumCard compact interactive={false}>
                <div className="flex items-center gap-3">
                  <Users className="h-5 w-5 text-slate-600" />
                  <p className="text-2xl font-bold text-slate-900">
                    {resumo.total}
                  </p>
                </div>
                <p className="mt-2 text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                  Total
                </p>
              </PremiumCard>

              <PremiumCard compact interactive={false}>
                <div className="flex items-center gap-3">
                  <UserCheck className="h-5 w-5 text-emerald-600" />
                  <p className="text-2xl font-bold text-slate-900">
                    {resumo.ativos}
                  </p>
                </div>
                <p className="mt-2 text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                  Ativos
                </p>
              </PremiumCard>

              <PremiumCard compact interactive={false}>
                <div className="flex items-center gap-3">
                  <ShieldAlert className="h-5 w-5 text-red-600" />
                  <p className="text-2xl font-bold text-slate-900">
                    {resumo.risco}
                  </p>
                </div>
                <p className="mt-2 text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                  Risco critico
                </p>
              </PremiumCard>

              <PremiumCard compact interactive={false}>
                <div className="flex items-center gap-3">
                  <BarChart3 className="h-5 w-5 text-violet-600" />
                  <p className="text-2xl font-bold text-slate-900">
                    {resumo.mediaProgresso}%
                  </p>
                </div>
                <p className="mt-2 text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                  Media de progresso
                </p>
              </PremiumCard>
            </div>
          </PremiumCard>
        </motion.section>

        {/* ALERTAS INTELIGENTES */}
        <motion.section variants={fadeUp}>
          <PremiumCard>
            <SectionHeader
              eyebrow="Prioridades"
              title="Alertas inteligentes"
              description="Sinais automaticos para reduzir risco de abandono e melhorar retencao."
            />

            <div className="mt-4 space-y-3">
              {alertasInteligentes.map((alerta) => (
                <div
                  key={alerta.id}
                  className="flex items-start justify-between gap-3 rounded-2xl border border-slate-200 bg-slate-50/80 p-4"
                >
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="mt-0.5 h-4 w-4 text-amber-500" />
                    <div>
                      <p className="text-sm font-semibold text-slate-900">
                        {alerta.titulo}
                      </p>
                      <p className="mt-1 text-sm leading-6 text-slate-600">
                        {alerta.descricao}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {/* Conecta o alerta critico a uma acao imediata no fluxo. */}
                    {alerta.nivel === "critico" ? (
                      <button
                        type="button"
                        onClick={() => router.push("/plano-alimentar")}
                        className="inline-flex items-center gap-1 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-xs font-semibold text-red-700 transition hover:bg-red-100 active:scale-[0.98]"
                      >
                        {alerta.acaoLabel || "Ajustar plano"}
                      </button>
                    ) : null}

                    <StatusBadge
                      variant={
                        alerta.nivel === "critico"
                          ? "danger"
                          : alerta.nivel === "alerta"
                            ? "warning"
                            : "success"
                      }
                    >
                      {alerta.nivel}
                    </StatusBadge>
                  </div>
                </div>
              ))}
            </div>
          </PremiumCard>
        </motion.section>

        {/* LISTA DE PACIENTES */}
        <motion.section variants={fadeUp}>
          <PremiumCard>
            <SectionHeader
              eyebrow="Base completa"
              title="Lista de pacientes"
              description="Tabela compacta para decisao rapida e navegacao operacional."
            />

            <div className="mt-4 space-y-3">
              {alunosOrdenados.length === 0 ? (
                <EmptyState title="Nenhum paciente ainda" />
              ) : null}

              {alunosOrdenados.map((aluno) => (
                <div
                  key={aluno.id}
                  className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-slate-900">
                      {aluno.nome}
                    </p>
                    <p className="mt-1 text-sm text-slate-600">
                      {aluno.progresso}% de progresso
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <StatusBadge variant={getStatusVariant(aluno.status)}>
                      {getStatusLabel(aluno.status)}
                    </StatusBadge>

                    <button
                      type="button"
                      // Rota estatica para compatibilidade com output export.
                      onClick={() => router.push(`/paciente?id=${aluno.id}`)}
                      className="inline-flex items-center gap-1 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-50 active:scale-[0.98]"
                    >
                      Ver paciente
                      <ArrowUpRight className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </PremiumCard>
        </motion.section>
      </motion.div>
    </div>
  );
}
