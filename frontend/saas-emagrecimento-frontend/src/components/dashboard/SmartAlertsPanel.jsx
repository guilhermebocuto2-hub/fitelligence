"use client";

// ======================================================
// Painel de alertas inteligentes do dashboard
// Responsável por:
// - interpretar dados principais da jornada
// - mostrar alertas acionáveis
// - reforçar leitura estratégica do sistema
// ======================================================

import { AlertTriangle, Sparkles, ShieldAlert } from "lucide-react";

// ======================================================
// Gera alertas com base nos dados recebidos
// ======================================================
function gerarAlertas({ perfilTipo, dashboard }) {
  const alertas = [];

  const perdaTotal = Number(dashboard?.perda_total ?? 0);
  const totalRegistros = Number(dashboard?.total_registros_progresso ?? 0);
  const totalCheckins = Number(dashboard?.total_checkins ?? 0);
  const scoreConsistencia = Number(dashboard?.score_consistencia ?? 0);
  const scoreAlimentar = Number(dashboard?.score_alimentar ?? 0);
  const totalRefeicoes = Number(dashboard?.total_refeicoes_analisadas ?? 0);

  // ====================================================
  // Alertas gerais
  // ====================================================
  if (totalRegistros <= 1) {
    alertas.push({
      tipo: "warning",
      titulo: "Poucos dados de progresso",
      descricao:
        "Ainda existem poucos registros corporais para uma leitura evolutiva mais confiável.",
    });
  }

  if (scoreConsistencia > 0 && scoreConsistencia < 50) {
    alertas.push({
      tipo: "danger",
      titulo: "Consistência abaixo do ideal",
      descricao:
        "Os hábitos registrados mostram baixa constância. O sistema recomenda reforçar rotina e disciplina operacional.",
    });
  }

  if (totalCheckins > 0 && totalCheckins < 3) {
    alertas.push({
      tipo: "info",
      titulo: "Check-ins ainda são poucos",
      descricao:
        "Quanto mais check-ins forem registrados, mais precisa fica a leitura do comportamento e da evolução.",
    });
  }

  // ====================================================
  // Usuário final
  // ====================================================
  if (perfilTipo === "usuario") {
    if (perdaTotal <= 0 && totalRegistros >= 2) {
      alertas.push({
        tipo: "warning",
        titulo: "Evolução corporal desacelerada",
        descricao:
          "O histórico atual não mostra redução corporal consistente. Vale revisar alimentação, rotina e aderência.",
      });
    }

    if (totalRefeicoes > 0 && scoreAlimentar < 60) {
      alertas.push({
        tipo: "danger",
        titulo: "Score alimentar em atenção",
        descricao:
          "A qualidade média das refeições está abaixo do ideal para sustentar evolução com mais previsibilidade.",
      });
    }
  }

  // ====================================================
  // Personal trainer
  // ====================================================
  if (perfilTipo === "personal") {
    if (scoreConsistencia < 60) {
      alertas.push({
        tipo: "warning",
        titulo: "Acompanhamento pede mais controle",
        descricao:
          "Os sinais da rotina indicam espaço para melhorar consistência, check-ins e leitura de evolução dos alunos.",
      });
    }

    if (perdaTotal <= 0 && totalRegistros >= 2) {
      alertas.push({
        tipo: "info",
        titulo: "Resultado pode estar pouco visível",
        descricao:
          "Vale reforçar acompanhamento e comunicação visual da evolução para aumentar valor percebido pelo aluno.",
      });
    }
  }

  // ====================================================
  // Nutricionista
  // ====================================================
  if (perfilTipo === "nutricionista") {
    if (totalRefeicoes > 0 && scoreAlimentar < 60) {
      alertas.push({
        tipo: "danger",
        titulo: "Aderência alimentar em baixa",
        descricao:
          "Os dados sugerem necessidade de reforçar acompanhamento entre consultas e feedback contínuo.",
      });
    }

    if (totalCheckins < 3) {
      alertas.push({
        tipo: "info",
        titulo: "Poucos sinais comportamentais",
        descricao:
          "Ainda existem poucos sinais recentes de comportamento e rotina para uma leitura clínica mais consistente.",
      });
    }
  }

  return alertas;
}

// ======================================================
// Ícone por tipo de alerta
// ======================================================
function AlertIcon({ tipo }) {
  if (tipo === "danger") {
    return <ShieldAlert className="h-4 w-4" />;
  }

  if (tipo === "warning") {
    return <AlertTriangle className="h-4 w-4" />;
  }

  return <Sparkles className="h-4 w-4" />;
}

export default function SmartAlertsPanel({
  perfilTipo = "usuario",
  dashboard = {},
}) {
  const alertas = gerarAlertas({ perfilTipo, dashboard });

  return (
    <div className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm transition-colors duration-300 dark:border-slate-800 dark:bg-slate-950/70">
      <div className="space-y-4">
        <div className="space-y-2">
          <span className="inline-flex rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-amber-700 dark:border-amber-500/20 dark:bg-amber-500/10 dark:text-amber-300">
            Alertas inteligentes
          </span>

          <h3 className="text-xl font-semibold text-slate-900 dark:text-white">
            O que merece atenção agora
          </h3>

          <p className="text-sm leading-7 text-slate-600 dark:text-slate-400">
            Leitura automática baseada nos dados de progresso, consistência,
            check-ins e alimentação.
          </p>
        </div>

        {alertas.length === 0 ? (
          <div className="rounded-3xl border border-emerald-100 bg-emerald-50/70 p-4 transition-colors duration-300 dark:border-emerald-500/20 dark:bg-emerald-500/10">
            <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-300">
              <Sparkles className="h-4 w-4" />
              <p className="text-sm font-semibold">
                Nenhum alerta crítico no momento
              </p>
            </div>

            <p className="mt-2 text-sm leading-7 text-slate-600 dark:text-slate-400">
              O cenário atual está relativamente estável. Continue alimentando o
              sistema com registros para manter a leitura estratégica precisa.
            </p>
          </div>
        ) : (
          <div className="grid gap-3">
            {alertas.map((alerta, index) => {
              const toneMap = {
                danger:
                  "border-rose-200 bg-rose-50/70 text-rose-700 dark:border-rose-500/20 dark:bg-rose-500/10 dark:text-rose-300",
                warning:
                  "border-amber-200 bg-amber-50/70 text-amber-700 dark:border-amber-500/20 dark:bg-amber-500/10 dark:text-amber-300",
                info:
                  "border-cyan-200 bg-cyan-50/70 text-cyan-700 dark:border-cyan-500/20 dark:bg-cyan-500/10 dark:text-cyan-300",
              };

              return (
                <div
                  key={`${alerta.titulo}-${index}`}
                  className={`rounded-3xl border p-4 transition-colors duration-300 ${
                    toneMap[alerta.tipo] || toneMap.info
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5">
                      <AlertIcon tipo={alerta.tipo} />
                    </div>

                    <div className="space-y-1">
                      <p className="text-sm font-semibold">{alerta.titulo}</p>
                      <p className="text-sm leading-7 opacity-90">
                        {alerta.descricao}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}