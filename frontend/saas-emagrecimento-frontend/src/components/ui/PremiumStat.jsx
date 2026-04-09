// Pequeno card estatístico premium.
// Serve para destacar indicadores rápidos dentro de seções mais importantes.
export default function PremiumStat({
  label,
  value,
  helper,
  tone = "default",
}) {
  // Mapa de estilos para variar o tom sem duplicar componente.
  // Facilita manutenção e futuras expansões.
  const toneMap = {
    default: "border-slate-200 bg-slate-50 text-slate-900",
    success: "border-emerald-200 bg-emerald-50 text-emerald-900",
    warning: "border-amber-200 bg-amber-50 text-amber-900",
    danger: "border-red-200 bg-red-50 text-red-900",
  };

  const helperMap = {
    default: "text-slate-500",
    success: "text-emerald-700",
    warning: "text-amber-700",
    danger: "text-red-700",
  };

  return (
    <div
      className={`rounded-2xl border p-4 transition-all duration-300 hover:shadow-sm ${toneMap[tone] || toneMap.default}`}
    >
      {/* Label superior do indicador */}
      <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
        {label}
      </p>

      {/* Valor principal */}
      <p className="mt-3 text-2xl font-semibold tracking-tight">{value}</p>

      {/* Texto auxiliar com contexto do indicador */}
      {helper ? (
        <p className={`mt-2 text-sm leading-6 ${helperMap[tone] || helperMap.default}`}>
          {helper}
        </p>
      ) : null}
    </div>
  );
}