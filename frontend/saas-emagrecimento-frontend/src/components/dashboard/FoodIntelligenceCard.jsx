"use client";

// ======================================================
// FoodIntelligenceCard
// Responsavel por exibir 1 insight/metrica da IA alimentar.
// - Seguro contra null/undefined
// - Visual premium reutilizavel
// - Largura minima para uso em carrossel horizontal
// ======================================================

import PremiumCard from "../ui/PremiumCard";

function formatSafeValue(value) {
  // Tratamento de seguranca para evitar quebra visual com valor vazio.
  if (value === null || value === undefined || value === "") {
    return "--";
  }
  return value;
}

function getTypeClasses(type) {
  // Mapeia o tipo para reforco visual sem alterar logica de negocio.
  if (type === "score") return "border-violet-200 bg-violet-50 text-violet-700";
  if (type === "calorias") return "border-cyan-200 bg-cyan-50 text-cyan-700";
  if (type === "proteina")
    return "border-emerald-200 bg-emerald-50 text-emerald-700";
  if (type === "classificacao")
    return "border-amber-200 bg-amber-50 text-amber-700";
  return "border-slate-200 bg-slate-50 text-slate-700";
}

export default function FoodIntelligenceCard({
  type = "default",
  title = "",
  value = null,
  suffix = "",
  helper = "",
}) {
  const safeValue = formatSafeValue(value);
  const showSuffix = safeValue !== "--" && suffix;

  return (
    <PremiumCard
      compact
      interactive={false}
      className="h-full min-w-[240px] sm:min-w-[280px]"
    >
      <div className="space-y-4">
        <span
          className={`inline-flex rounded-full border px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] ${getTypeClasses(type)}`}
        >
          {type}
        </span>

        <div>
          <p className="text-sm font-semibold text-slate-900 sm:text-base">
            {title}
          </p>

          <div className="mt-2 flex items-end gap-1">
            <p className="text-3xl font-bold tracking-tight text-slate-900">
              {safeValue}
            </p>
            {showSuffix ? (
              <span className="pb-1 text-xs font-medium text-slate-500">
                {suffix}
              </span>
            ) : null}
          </div>

          {helper ? (
            <p className="mt-2 text-sm leading-6 text-slate-600">{helper}</p>
          ) : null}
        </div>
      </div>
    </PremiumCard>
  );
}

