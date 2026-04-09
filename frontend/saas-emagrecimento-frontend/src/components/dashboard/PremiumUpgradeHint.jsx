"use client";

import { useRouter } from "next/navigation";
import PremiumCard from "../ui/PremiumCard";

function toNumber(value, fallback = 0) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

export default function PremiumUpgradeHint({ dashboard = {} }) {
  const router = useRouter();
  const scoreDia = toNumber(dashboard?.score_dia, 0);
  const streakDias = toNumber(dashboard?.streak_dias, 0);
  const plano = String(dashboard?.usuario?.plano || "free").toLowerCase();

  const shouldShow = plano !== "premium" && (scoreDia >= 60 || streakDias >= 3);

  if (!shouldShow) {
    return null;
  }

  return (
    <PremiumCard className="rounded-[28px] border-emerald-200 bg-gradient-to-br from-emerald-50 to-lime-50">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-emerald-700">
            Premium
          </p>
          <h3 className="mt-1 text-lg font-bold text-slate-900">
            Desbloqueie seu plano semanal adaptativo
          </h3>
          <p className="mt-1 text-sm text-slate-600">
            Veja sua evolucao completa da semana e receba ajustes automaticos de treino e alimentacao.
          </p>
        </div>

        <button
          type="button"
          onClick={() => router.push("/premium")}
          className="rounded-2xl bg-emerald-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700"
        >
          Ver premium
        </button>
      </div>
    </PremiumCard>
  );
}
