"use client";

import { useMemo } from "react";

function toArray(value) {
  return Array.isArray(value) ? value : [];
}

export default function WorkoutExecution({
  treino = {},
  execution = {},
  submitting = false,
  onStartWorkout = null,
  onToggleExercise = null,
  onFinishWorkout = null,
}) {
  const exercicios = toArray(treino.exercicios);
  const feitos = toArray(execution?.habitos_concluidos_json?.treino_exercicios_feitos);
  const workoutStarted = Boolean(execution?.habitos_concluidos_json?.treino_iniciado);

  const concluidosCount = useMemo(() => {
    return exercicios.filter((item) => feitos.includes(item)).length;
  }, [exercicios, feitos]);

  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-slate-900">Treino executavel</p>
          <p className="text-sm text-slate-500">
            Marque os exercicios feitos sem sair da tela.
          </p>
        </div>

        <p className="text-sm font-semibold text-emerald-700">
          {concluidosCount}/{exercicios.length || 0}
        </p>
      </div>

      <div className="mt-3 space-y-2">
        {exercicios.length > 0 ? (
          exercicios.map((item) => {
            const concluido = feitos.includes(item);

            return (
              <button
                key={item}
                type="button"
                disabled={submitting}
                onClick={() => onToggleExercise?.(item)}
                className={`flex w-full items-center justify-between rounded-2xl px-4 py-3 text-left text-sm transition ${
                  concluido
                    ? "bg-emerald-100 text-emerald-900 ring-1 ring-emerald-200"
                    : "bg-white text-slate-800 ring-1 ring-slate-200 hover:bg-slate-50"
                }`}
              >
                <span className="font-medium">{item}</span>
                <span>{concluido ? "Feito" : "Pendente"}</span>
              </button>
            );
          })
        ) : (
          <p className="text-sm text-slate-500">
            Nenhum exercicio detalhado foi definido para hoje.
          </p>
        )}
      </div>

      <div className="mt-3 grid gap-2 sm:grid-cols-2">
        <button
          type="button"
          disabled={submitting || workoutStarted}
          onClick={onStartWorkout}
          className="rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm font-semibold text-slate-900 transition hover:bg-slate-50 disabled:opacity-60"
        >
          Iniciar treino
        </button>

        <button
          type="button"
          disabled={submitting || execution?.treino_concluido}
          onClick={onFinishWorkout}
          className="rounded-2xl bg-emerald-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:opacity-60"
        >
          Finalizar treino
        </button>
      </div>
    </div>
  );
}
