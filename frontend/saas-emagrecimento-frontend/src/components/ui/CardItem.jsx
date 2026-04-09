// Item interno reutilizável para listas dentro dos cards.
// Ele melhora consistência visual em listas de alertas, refeições, insights etc.
export default function CardItem({
  title,
  description,
  rightContent = null,
  tone = "default",
}) {
  // Mapa de estilos por tom.
  const toneMap = {
    default: "border-slate-200 bg-white",
    success: "border-emerald-200 bg-emerald-50/60",
    warning: "border-amber-200 bg-amber-50/60",
    danger: "border-red-200 bg-red-50/60",
  };

  return (
    <div
      className={`rounded-2xl border px-4 py-3 transition-all duration-300 hover:shadow-sm ${toneMap[tone] || toneMap.default}`}
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          {/* Título principal do item */}
          <p className="text-sm font-semibold text-slate-900">{title}</p>

          {/* Descrição secundária */}
          {description ? (
            <p className="mt-1 text-sm leading-6 text-slate-500">
              {description}
            </p>
          ) : null}
        </div>

        {/* Conteúdo opcional do lado direito, como badge, valor, data etc */}
        {rightContent ? <div className="shrink-0">{rightContent}</div> : null}
      </div>
    </div>
  );
}