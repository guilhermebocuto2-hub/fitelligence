// ======================================================
// SectionHeader
// Cabeçalho base de seção com foco em leitura mobile-first.
// Mantém as props atuais para evitar quebra de consumo.
// ======================================================
export default function SectionHeader({
  eyebrow,
  title,
  description,
  action = null,
}) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between sm:gap-4">
      <div className="min-w-0">
        {eyebrow ? (
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-emerald-600/90">
            {eyebrow}
          </p>
        ) : null}

        <h2 className="mt-1 text-lg font-semibold tracking-tight text-slate-900 sm:text-xl">
          {title}
        </h2>

        {description ? (
          <p className="mt-1.5 max-w-2xl text-sm leading-6 text-slate-500">
            {description}
          </p>
        ) : null}
      </div>

      {action ? (
        <div className="shrink-0 self-start sm:self-auto">
          {/* Área de ação da seção (ex.: botão, filtro, link) */}
          {action}
        </div>
      ) : null}
    </div>
  );
}
