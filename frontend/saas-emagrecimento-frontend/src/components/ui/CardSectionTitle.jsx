// Título interno padronizado para blocos menores dentro dos componentes.
// Ajuda a criar hierarquia visual consistente nos cards do dashboard.
export default function CardSectionTitle({
  title,
  description = "",
}) {
  return (
    <div>
      {/* Título do bloco interno */}
      <h4 className="text-base font-semibold tracking-tight text-slate-900">
        {title}
      </h4>

      {/* Descrição opcional do bloco */}
      {description ? (
        <p className="mt-1 text-sm leading-6 text-slate-500">{description}</p>
      ) : null}
    </div>
  );
}