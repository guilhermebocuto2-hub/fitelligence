// Componente base para áreas internas de cards.
// Ele serve para padronizar fundo, borda, arredondamento e espaçamento
// de blocos menores dentro dos cards principais do dashboard.
export default function CardSurface({
  children,
  className = "",
  tone = "default",
}) {
  // Mapa de estilos por tom visual.
  // Isso facilita futuras expansões sem precisar duplicar estrutura.
  const toneMap = {
    default: "border-slate-200 bg-slate-50",
    success: "border-emerald-200 bg-emerald-50",
    warning: "border-amber-200 bg-amber-50",
    danger: "border-red-200 bg-red-50",
    white: "border-slate-200 bg-white",
  };

  return (
    <div
      className={`rounded-2xl border p-4 ${toneMap[tone] || toneMap.default} ${className}`}
    >
      {children}
    </div>
  );
}