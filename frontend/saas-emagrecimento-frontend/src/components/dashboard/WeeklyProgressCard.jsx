"use client";

import PremiumCard from "../ui/PremiumCard";
import SectionHeader from "../ui/SectionHeader";

function toNumber(value, fallback = 0) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function toObject(value) {
  return value && typeof value === "object" && !Array.isArray(value) ? value : {};
}

function hasCurrentDayActivity(dashboard) {
  const resumo = toObject(dashboard?.resumo_execucao_diaria);
  const execucao = toObject(dashboard?.execucao_plano_do_dia);

  return Boolean(
    execucao?.treino_concluido ||
      toNumber(execucao?.refeicoes_registradas, 0) > 0 ||
      toNumber(execucao?.agua_consumida_ml, 0) > 0 ||
      toNumber(execucao?.passos_realizados, 0) > 0 ||
      execucao?.checkin_realizado ||
      toNumber(resumo?.agua_hoje, 0) > 0 ||
      toNumber(resumo?.passos_hoje, 0) > 0 ||
      resumo?.checkin_realizado_hoje ||
      resumo?.treino_realizado_hoje
  );
}

function buildWeeklySummary(dashboard = {}) {
  const historicoExecucao = Array.isArray(dashboard?.historico_execucao_plano)
    ? dashboard.historico_execucao_plano
    : [];

  const scoreHoje = toNumber(dashboard?.score_dia, 0);
  const streakDias = toNumber(dashboard?.streak_dias, 0);

  // ====================================================
  // Fallback leve:
  // se não houver histórico semanal dedicado no backend,
  // usamos o dia atual e o streak como sinal de atividade.
  // ====================================================
  if (historicoExecucao.length === 0) {
    const ativoHoje = hasCurrentDayActivity(dashboard);
    const diasAtivos = ativoHoje ? Math.max(1, Math.min(streakDias || 1, 7)) : 0;

    return {
      dias_ativos: diasAtivos,
      score_medio: ativoHoje ? scoreHoje : 0,
      melhor_dia: ativoHoje ? "Hoje" : "Sem dados",
      tendencia:
        scoreHoje >= 70 ? "subindo" : scoreHoje >= 35 ? "estavel" : "descendo",
    };
  }

  const ultimosDias = historicoExecucao.slice(0, 7);
  const scores = ultimosDias.map((item) => toNumber(item?.score_dia, 0));
  const diasAtivos = ultimosDias.filter((item) => toNumber(item?.score_dia, 0) > 0).length;
  const scoreMedio =
    scores.length > 0
      ? Math.round(scores.reduce((acc, value) => acc + value, 0) / scores.length)
      : 0;

  const melhorItem = ultimosDias.reduce((best, current) => {
    const scoreBest = toNumber(best?.score_dia, -1);
    const scoreCurrent = toNumber(current?.score_dia, -1);
    return scoreCurrent > scoreBest ? current : best;
  }, null);

  const scoreAtual = toNumber(ultimosDias[0]?.score_dia, 0);
  const scoreAnterior = toNumber(ultimosDias[1]?.score_dia, scoreAtual);

  return {
    dias_ativos: diasAtivos,
    score_medio: scoreMedio,
    melhor_dia: melhorItem?.label || melhorItem?.data || "Hoje",
    tendencia:
      scoreAtual > scoreAnterior ? "subindo" : scoreAtual < scoreAnterior ? "descendo" : "estavel",
  };
}

export default function WeeklyProgressCard({ dashboard = {} }) {
  const resumo = buildWeeklySummary(dashboard);

  return (
    <PremiumCard className="rounded-[28px]">
      <SectionHeader
        eyebrow="Semana"
        title="Seu progresso semanal"
        description="Leitura leve da sua consistencia recente sem exigir navegação extra."
      />

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">
            Dias ativos
          </p>
          <p className="mt-2 text-2xl font-bold text-slate-900">{resumo.dias_ativos}/7</p>
          <p className="mt-1 text-sm text-slate-500">Dias com alguma ação relevante</p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">
            Score médio
          </p>
          <p className="mt-2 text-2xl font-bold text-slate-900">{resumo.score_medio}</p>
          <p className="mt-1 text-sm text-slate-500">Média dos últimos dias disponíveis</p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">
            Melhor dia
          </p>
          <p className="mt-2 text-lg font-bold text-slate-900">{resumo.melhor_dia}</p>
          <p className="mt-1 text-sm text-slate-500">Melhor leitura dentro da semana</p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">
            Tendencia
          </p>
          <p className="mt-2 text-lg font-bold text-slate-900">
            {resumo.tendencia === "subindo"
              ? "Subindo"
              : resumo.tendencia === "descendo"
                ? "Descendo"
                : "Estavel"}
          </p>
          <p className="mt-1 text-sm text-slate-500">Leitura simples da sua semana</p>
        </div>
      </div>
    </PremiumCard>
  );
}
