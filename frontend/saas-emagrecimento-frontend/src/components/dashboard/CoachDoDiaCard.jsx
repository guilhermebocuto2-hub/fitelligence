"use client";

import PremiumCard from "../ui/PremiumCard";
import WellnessDisclaimer from "../ui/WellnessDisclaimer";

export default function CoachDoDiaCard({ coach = null }) {
  if (!coach) return null;

  return (
    <PremiumCard className="rounded-[28px] border-emerald-200 bg-gradient-to-br from-emerald-50 to-white">
      <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-emerald-700">
        Coach do dia
      </p>
      <h3 className="mt-2 text-lg font-bold text-slate-900">{coach.titulo}</h3>
      <p className="mt-2 text-sm leading-6 text-slate-600">{coach.mensagem}</p>
      <div className="mt-3 rounded-2xl bg-white px-4 py-3 text-sm font-semibold text-slate-800 ring-1 ring-slate-200">
        Proxima acao: {coach.proxima_acao}
      </div>
      <WellnessDisclaimer compact className="mt-3" />
    </PremiumCard>
  );
}
