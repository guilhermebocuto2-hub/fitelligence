"use client";

import PremiumCard from "../ui/PremiumCard";
import WellnessDisclaimer from "../ui/WellnessDisclaimer";

export default function CoachDoDiaCard({ coach = null }) {
  const coachSeguro =
    coach && typeof coach === "object" && !Array.isArray(coach) ? coach : null;

  // ====================================================
  // Evita renderizar card vazio quando o backend envia
  // objeto parcial logo apos onboarding ou em cargas
  // incompletas do dashboard.
  // ====================================================
  if (
    !coachSeguro ||
    (!coachSeguro.titulo &&
      !coachSeguro.mensagem &&
      !coachSeguro.proxima_acao)
  ) {
    return null;
  }

  return (
    <PremiumCard className="rounded-[28px] border-emerald-200 bg-gradient-to-br from-emerald-50 to-white">
      <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-emerald-700">
        Coach do dia
      </p>
      <h3 className="mt-2 text-lg font-bold text-slate-900">
        {coachSeguro.titulo || "Seu próximo passo"}
      </h3>
      <p className="mt-2 text-sm leading-6 text-slate-600">
        {coachSeguro.mensagem ||
          "Seu dashboard continua pronto para acompanhar sua evolução de forma consistente."}
      </p>
      <div className="mt-3 rounded-2xl bg-white px-4 py-3 text-sm font-semibold text-slate-800 ring-1 ring-slate-200">
        Próxima ação: {coachSeguro.proxima_acao || "Registrar a próxima ação importante do dia"}
      </div>
      <WellnessDisclaimer compact className="mt-3" />
    </PremiumCard>
  );
}
