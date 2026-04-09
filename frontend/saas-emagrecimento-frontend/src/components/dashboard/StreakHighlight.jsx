"use client";

import PremiumCard from "../ui/PremiumCard";

function toNumber(value, fallback = 0) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

export default function StreakHighlight({ streakDias = 0 }) {
  const streak = toNumber(streakDias, 0);
  const destaqueForte = streak >= 7;
  const destaqueLeve = streak >= 3;

  return (
    <PremiumCard
      className={`rounded-[28px] ${
        destaqueForte
          ? "border-orange-200 bg-gradient-to-br from-orange-50 to-amber-50"
          : destaqueLeve
            ? "border-amber-200 bg-gradient-to-br from-amber-50 to-yellow-50"
            : "border-slate-200 bg-white"
      }`}
    >
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
            Consistencia
          </p>
          <h3 className="mt-2 text-2xl font-bold text-slate-900">🔥 {streak} dias seguidos</h3>
          <p className="mt-1 text-sm text-slate-600">
            {destaqueForte
              ? "Seu ritmo esta forte. Vale proteger essa sequencia."
              : destaqueLeve
                ? "Boa sequencia. Mais alguns dias e isso vira um novo padrao."
                : "Cada acao do dia ajuda a construir sua constancia."}
          </p>
        </div>

        <div
          className={`rounded-2xl px-4 py-3 text-sm font-semibold ${
            destaqueForte
              ? "bg-orange-100 text-orange-900"
              : destaqueLeve
                ? "bg-amber-100 text-amber-900"
                : "bg-slate-100 text-slate-700"
          }`}
        >
          {destaqueForte ? "Destaque forte" : destaqueLeve ? "Em aquecimento" : "Comecando"}
        </div>
      </div>
    </PremiumCard>
  );
}
