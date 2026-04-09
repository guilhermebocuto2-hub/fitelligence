"use client";

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

export default function DailyProgressBar({ scoreDia = 0 }) {
  const progresso = clamp(Number(scoreDia) || 0, 0, 100);

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-slate-900">Progresso do dia</p>
          <p className="text-sm text-slate-500">
            Seu score diario acompanha a execucao do plano.
          </p>
        </div>

        <p className="text-lg font-bold text-emerald-700">{progresso}%</p>
      </div>

      <div className="mt-3 h-3 overflow-hidden rounded-full bg-slate-100">
        <div
          className="h-full rounded-full bg-gradient-to-r from-emerald-500 via-lime-400 to-amber-400 transition-all duration-500"
          style={{ width: `${progresso}%` }}
        />
      </div>
    </div>
  );
}
