"use client";

import PremiumCard from "../ui/PremiumCard";
import SectionHeader from "../ui/SectionHeader";

function toObject(value) {
  return value && typeof value === "object" && !Array.isArray(value) ? value : {};
}

function toNumber(value, fallback = 0) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

export default function TomorrowPreviewCard({ planoDoDia = null, dashboard = {} }) {
  const plano = toObject(planoDoDia);
  const treino = toObject(plano.treino);
  const alimentacao = toObject(plano.alimentacao);
  const usuario = toObject(dashboard?.usuario);

  const foco =
    String(usuario?.objetivo || "").toLowerCase().includes("emagrec")
      ? "Consistencia, treino e saciedade"
      : "Execucao do plano e constancia";

  return (
    <PremiumCard className="rounded-[28px]">
      <SectionHeader
        eyebrow="Amanha"
        title="Preview do proximo dia"
        description="Uma leitura leve para manter expectativa e retorno diario."
      />

      <div className="mt-4 grid gap-3 sm:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">
            Treino estimado
          </p>
          <p className="mt-2 text-lg font-bold text-slate-900">
            {treino?.titulo || "Treino leve do dia"}
          </p>
          <p className="mt-1 text-sm text-slate-500">
            {toNumber(treino?.duracao_min, 0) || "--"} min
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">
            Foco
          </p>
          <p className="mt-2 text-lg font-bold text-slate-900">{foco}</p>
          <p className="mt-1 text-sm text-slate-500">Baseado no seu plano atual</p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">
            Meta calorica
          </p>
          <p className="mt-2 text-lg font-bold text-slate-900">
            {toNumber(alimentacao?.calorias, 0)} kcal
          </p>
          <p className="mt-1 text-sm text-slate-500">Referencia para seu proximo dia</p>
        </div>
      </div>
    </PremiumCard>
  );
}
