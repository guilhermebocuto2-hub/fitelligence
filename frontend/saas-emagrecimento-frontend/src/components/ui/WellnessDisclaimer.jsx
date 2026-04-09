"use client";

export default function WellnessDisclaimer({
  className = "",
  compact = false,
  light = false,
}) {
  return (
    <div
      className={`rounded-2xl px-4 py-3 ${
        light
          ? "border border-white/10 bg-white/5"
          : "border border-amber-200 bg-amber-50/90"
      } ${className}`}
    >
      <p
        className={`text-[11px] font-semibold uppercase tracking-[0.16em] ${
          light ? "text-amber-200" : "text-amber-800"
        }`}
      >
        Aviso de bem-estar
      </p>
      <p
        className={`mt-1 ${
          light ? "text-slate-200" : "text-slate-700"
        } ${compact ? "text-xs leading-5" : "text-sm leading-6"}`}
      >
        O Fitelligence oferece estimativas e orientaÃ§Ãµes gerais de fitness e
        bem-estar. Ele nÃ£o substitui orientaÃ§Ã£o mÃ©dica, nutricional ou
        diagnÃ³stico profissional.
      </p>
    </div>
  );
}
