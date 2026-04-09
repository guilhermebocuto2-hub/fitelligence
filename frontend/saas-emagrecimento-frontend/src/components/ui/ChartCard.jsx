// ======================================================
// Card base premium para gráficos e blocos analíticos
// Este componente padroniza o visual dos cards:
// - título
// - subtítulo
// - ícone opcional
// - área de conteúdo
// ======================================================

export default function ChartCard({
  title,
  subtitle,
  icon,
  children,
  rightContent,
}) {
  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:shadow-md">
      {/* ==================================================
          Cabeçalho do card
         ================================================== */}
      <div className="mb-6 flex items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          {/* Ícone decorativo do card */}
          {icon && (
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
              {icon}
            </div>
          )}

          {/* Título e subtítulo */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-500">
              Análise inteligente
            </p>

            <h3 className="mt-2 text-xl font-bold text-slate-900">
              {title}
            </h3>

            {subtitle && (
              <p className="mt-2 text-sm leading-6 text-slate-500">
                {subtitle}
              </p>
            )}
          </div>
        </div>

        {/* Conteúdo opcional à direita */}
        {rightContent && <div>{rightContent}</div>}
      </div>

      {/* ==================================================
          Área principal do conteúdo do card
         ================================================== */}
      <div>{children}</div>
    </section>
  );
}