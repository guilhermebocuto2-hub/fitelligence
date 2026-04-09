// Componente visual reutilizável para exibir o nível de prioridade/status
// dos insights da IA, recomendações e alertas do dashboard.
export default function StatusBadge({ status = "info", children }) {
  // Mapa de estilos por tipo de status.
  // Isso facilita manutenção futura, porque outro dev pode adicionar
  // novos estados aqui sem mexer em toda a aplicação.
  const statusMap = {
    danger: "border-red-200 bg-red-50 text-red-700",
    warning: "border-amber-200 bg-amber-50 text-amber-700",
    success: "border-emerald-200 bg-emerald-50 text-emerald-700",
    info: "border-slate-200 bg-slate-50 text-slate-700",
  };

  return (
    <span
      className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold ${statusMap[status] || statusMap.info}`}
    >
      {children}
    </span>
  );
}