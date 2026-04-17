"use client";

import { useMemo, useState } from "react";
import {
  CalendarClock,
  CheckCircle2,
  Droplets,
  Flame,
  Sparkles,
  Star,
  TrendingUp,
} from "lucide-react";
import PremiumCard from "../ui/PremiumCard";
import SectionHeader from "../ui/SectionHeader";
import { useToast } from "../../context/ToastContext";
import { updateDailyPlanExecutionService } from "../../services/dailyPlanExecutionService";
import QuickActionsBar from "./QuickActionsBar";
import DailyProgressBar from "./DailyProgressBar";
import WorkoutExecution from "./WorkoutExecution";

function toNumber(value, fallback = 0) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function toObject(value) {
  return value && typeof value === "object" && !Array.isArray(value) ? value : {};
}

export default function DailyPlanCard({
  dashboard = {},
  planoDoDia = null,
  onExecutionUpdated = null,
}) {
  const { showToast } = useToast();
  const [submitting, setSubmitting] = useState(false);

  const dashboardSeguro = toObject(dashboard);
  const planoSeguro = toObject(planoDoDia);
  const treino = toObject(planoSeguro.treino);
  const alimentacao = toObject(planoSeguro.alimentacao);
  const habitos = toObject(planoSeguro.habitos);
  const acaoPrincipal = toObject(
    dashboardSeguro.acao_principal_do_dia || planoSeguro.acao_principal
  );
  const execution = toObject(dashboardSeguro.execucao_plano_do_dia);
  const resumoExecucao = toObject(dashboardSeguro.resumo_execucao_diaria);
  const motivacao = toObject(dashboardSeguro.motivacao_do_dia);
  const usuario = toObject(dashboardSeguro.usuario);
  const scoreDia = toNumber(dashboardSeguro.score_dia, 0);
  const streakDias = toNumber(dashboardSeguro.streak_dias, 0);
  const metaCalorica = toNumber(
    dashboardSeguro.meta_calorica,
    toNumber(alimentacao.calorias, 0)
  );
  const metaAgua = toNumber(
    dashboardSeguro.meta_agua,
    toNumber(habitos.agua_ml, 0)
  );
  const metaPassos = toNumber(
    dashboardSeguro.meta_passos,
    toNumber(habitos.passos, 0)
  );
  const aguaHoje = toNumber(
    resumoExecucao.agua_hoje,
    toNumber(execution.agua_consumida_ml, 0)
  );
  const passosHoje = toNumber(
    resumoExecucao.passos_hoje,
    toNumber(execution.passos_realizados, 0)
  );
  const checkinHoje = Boolean(
    resumoExecucao.checkin_realizado_hoje ?? execution.checkin_realizado
  );
  const refeicoes = Array.isArray(alimentacao.refeicoes)
    ? alimentacao.refeicoes
    : [];
  const ehPremium = String(usuario.plano || "free").toLowerCase() === "premium";
  const exerciciosFeitos = useMemo(() => {
    const value = execution?.habitos_concluidos_json?.treino_exercicios_feitos;
    return Array.isArray(value) ? value : [];
  }, [execution]);

  async function atualizarExecucao(payload, sucesso) {
    try {
      setSubmitting(true);
      const data = await updateDailyPlanExecutionService(payload);

      if (typeof onExecutionUpdated === "function") {
        onExecutionUpdated({
          execucao_plano_do_dia: data?.execution || null,
          score_dia: data?.score_dia || 0,
          streak_dias: data?.streak_dias || 0,
          motivacao_do_dia: data?.motivacao_do_dia || null,
          resumo_execucao_diaria: {
            ...(dashboardSeguro.resumo_execucao_diaria || {}),
            agua_hoje: data?.execution?.agua_consumida_ml || 0,
            passos_hoje: data?.execution?.passos_realizados || 0,
            checkin_realizado_hoje: Boolean(data?.execution?.checkin_realizado),
            treino_realizado_hoje: Boolean(data?.execution?.treino_concluido),
          },
        });
      }

      showToast({
        title: "Plano atualizado",
        description: sucesso,
        type: "success",
      });
    } catch (error) {
      showToast({
        title: "Erro ao atualizar plano",
        description:
          error?.message ||
          "Nao foi possivel registrar essa acao agora. Tente novamente.",
        type: "error",
      });
    } finally {
      setSubmitting(false);
    }
  }

  async function handleQuickWater() {
    await atualizarExecucao(
      {
        agua_consumida_ml: toNumber(execution.agua_consumida_ml, 0) + 500,
      },
      "+500ml registrados no seu dia."
    );
  }

  async function handleQuickCheckin() {
    await atualizarExecucao(
      {
        checkin_realizado: true,
      },
      "Check-in rapido marcado com sucesso."
    );
  }

  async function handleStartWorkout() {
    await atualizarExecucao(
      {
        habitos_concluidos_json: {
          ...(execution.habitos_concluidos_json || {}),
          treino_iniciado: true,
          treino_exercicios_feitos: exerciciosFeitos,
        },
      },
      "Treino iniciado."
    );
  }

  async function handleToggleExercise(exercicio) {
    const proximos = exerciciosFeitos.includes(exercicio)
      ? exerciciosFeitos.filter((item) => item !== exercicio)
      : [...exerciciosFeitos, exercicio];

    await atualizarExecucao(
      {
        habitos_concluidos_json: {
          ...(execution.habitos_concluidos_json || {}),
          treino_iniciado: true,
          treino_exercicios_feitos: proximos,
        },
      },
      "Progresso do treino atualizado."
    );
  }

  async function handleFinishWorkout() {
    await atualizarExecucao(
      {
        treino_concluido: true,
        habitos_concluidos_json: {
          ...(execution.habitos_concluidos_json || {}),
          treino_iniciado: true,
          treino_exercicios_feitos: exerciciosFeitos,
          treino_finalizado: true,
        },
      },
      "Treino finalizado com sucesso."
    );
  }

  async function handleRegisterMealLevel(nivel) {
    const caloriasAproximadas =
      nivel === "leve" ? 300 : nivel === "normal" ? 550 : 850;

    await atualizarExecucao(
      {
        refeicoes_registradas: toNumber(execution.refeicoes_registradas, 0) + 1,
        habitos_concluidos_json: {
          ...(execution.habitos_concluidos_json || {}),
          ultima_refeicao_nivel: nivel,
          ultima_refeicao_calorias_aprox: caloriasAproximadas,
        },
      },
      `Refeicao ${nivel} registrada com estimativa de ${caloriasAproximadas} kcal.`
    );
  }

  return (
    <PremiumCard className="rounded-[28px]">
      <SectionHeader
        eyebrow="Plano do dia"
        title="Seu plano diário"
        description="Resumo operacional do dia com foco em treino, calorias, hidratação e execução."
      />

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
          <div className="flex items-center gap-2 text-slate-900">
            <CalendarClock className="h-4 w-4 text-emerald-600" />
            <p className="text-sm font-semibold">Treino do dia</p>
          </div>
          <p className="mt-2 text-lg font-bold text-slate-900">
            {treino.titulo || "Plano leve do dia"}
          </p>
          <p className="mt-1 text-sm text-slate-600">
            {toNumber(treino.duracao_min, 0) || "--"} min •{" "}
            {treino.intensidade || "--"}
          </p>
          <p className="mt-2 text-sm font-medium text-slate-700">
            {execution.treino_concluido ? "Treino concluído hoje" : "Treino pendente"}
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
          <div className="flex items-center gap-2 text-slate-900">
            <Flame className="h-4 w-4 text-amber-500" />
            <p className="text-sm font-semibold">Calorias alvo</p>
          </div>
          <p className="mt-2 text-lg font-bold text-slate-900">
            {metaCalorica} kcal
          </p>
          <p className="mt-1 text-sm text-slate-600">
            {refeicoes.length > 0
              ? `${refeicoes.length} refeições planejadas`
              : "Meta calórica definida a partir do seu onboarding"}
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
          <div className="flex items-center gap-2 text-slate-900">
            <Droplets className="h-4 w-4 text-sky-500" />
            <p className="text-sm font-semibold">Água</p>
          </div>
          <p className="mt-2 text-lg font-bold text-slate-900">
            {aguaHoje} / {metaAgua || "--"} ml
          </p>
          <p className="mt-1 text-sm text-slate-600">
            {toNumber(habitos.passos, 0)} passos • {habitos.sono_horas || "--"}{" "}
            h sono
          </p>
          <p className="mt-2 text-sm font-medium text-slate-700">
            {checkinHoje ? "Check-in do dia realizado" : "Check-in do dia pendente"}
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
          <div className="flex items-center gap-2 text-slate-900">
            <Sparkles className="h-4 w-4 text-violet-500" />
            <p className="text-sm font-semibold">Ação principal</p>
          </div>
          <p className="mt-2 text-lg font-bold text-slate-900">
            {acaoPrincipal.titulo || "Seguir plano do dia"}
          </p>
          <p className="mt-1 text-sm text-slate-600">
            {acaoPrincipal.descricao ||
              "Use este bloco como guia operacional do seu dia com base no estado atual."}
          </p>
        </div>
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-3">
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 transition-all duration-300">
          <div className="flex items-center gap-2 text-emerald-800">
            <Star className="h-4 w-4" />
            <p className="text-sm font-semibold">Score do dia</p>
          </div>
          <p className="mt-2 text-2xl font-bold text-emerald-900">{scoreDia}</p>
          <p className="mt-1 text-sm text-emerald-800">de 100 pontos</p>
        </div>

        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4">
          <div className="flex items-center gap-2 text-amber-800">
            <TrendingUp className="h-4 w-4" />
            <p className="text-sm font-semibold">Streak</p>
          </div>
          <p className="mt-2 text-2xl font-bold text-amber-900">{streakDias}</p>
          <p className="mt-1 text-sm text-amber-800">dias de consistencia</p>
        </div>

        <div className="rounded-2xl border border-violet-200 bg-violet-50 p-4">
          <div className="flex items-center gap-2 text-violet-800">
            <CheckCircle2 className="h-4 w-4" />
            <p className="text-sm font-semibold">Motivacao</p>
          </div>
          <p className="mt-2 text-base font-bold text-violet-900">
            {motivacao.titulo || "Seu dia ainda pode evoluir"}
          </p>
          <p className="mt-1 text-sm text-violet-800">
            {motivacao.mensagem || "Registre a proxima acao importante do seu plano."}
          </p>
        </div>
      </div>

      <div className="mt-4">
        <DailyProgressBar scoreDia={scoreDia} />
      </div>

      <div className="mt-4">
        <QuickActionsBar
          submitting={submitting}
          onAddWater={handleQuickWater}
          onQuickCheckin={handleQuickCheckin}
        />
      </div>

      <div className="mt-4 rounded-2xl border border-slate-200 bg-white p-4">
        <p className="text-sm font-semibold text-slate-900">Refeicao simplificada</p>
        <p className="mt-1 text-sm text-slate-500">
          Registre a carga da refeicao sem sair do plano do dia.
        </p>

        <div className="mt-3 grid gap-2 sm:grid-cols-3">
          <button
            type="button"
            disabled={submitting}
            onClick={() => handleRegisterMealLevel("leve")}
            className="rounded-2xl bg-lime-50 px-4 py-3 text-sm font-semibold text-lime-900 ring-1 ring-lime-200 transition hover:bg-lime-100 disabled:opacity-60"
          >
            Leve
          </button>

          <button
            type="button"
            disabled={submitting}
            onClick={() => handleRegisterMealLevel("normal")}
            className="rounded-2xl bg-amber-50 px-4 py-3 text-sm font-semibold text-amber-900 ring-1 ring-amber-200 transition hover:bg-amber-100 disabled:opacity-60"
          >
            Normal
          </button>

          <button
            type="button"
            disabled={submitting}
            onClick={() => handleRegisterMealLevel("pesada")}
            className="rounded-2xl bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-900 ring-1 ring-rose-200 transition hover:bg-rose-100 disabled:opacity-60"
          >
            Pesada
          </button>
        </div>
      </div>

      <div className="mt-4">
        <WorkoutExecution
          treino={treino}
          execution={execution}
          submitting={submitting}
          onStartWorkout={handleStartWorkout}
          onToggleExercise={handleToggleExercise}
          onFinishWorkout={handleFinishWorkout}
        />
      </div>

      {!ehPremium ? (
        <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 p-4">
          <p className="text-sm font-semibold text-slate-900">
            Continue evoluindo com o Premium
          </p>
          <p className="mt-1 text-sm text-slate-600">
            Desbloqueie plano semanal adaptativo, evolucao completa da semana e
            ajustes automaticos de treino e alimentacao.
          </p>
        </div>
      ) : null}
    </PremiumCard>
  );
}
