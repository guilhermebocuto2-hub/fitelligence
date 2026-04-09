"use client";

// ======================================================
// PremiumPanel (container visual)
// Responsavel por:
// - exibir titulo e descricao da secao
// - renderizar children sem alterar a estrutura interna
// - manter consistencia visual entre desktop e mobile
//
// CORRECAO IMPORTANTE:
// Este arquivo havia recebido, por engano, a logica de
// DashboardModules (cards de metricas), o que fazia os
// cards aparecerem duplicados em cada <PremiumPanel>.
// Agora ele volta a ser apenas um wrapper de layout.
// ======================================================

export default function PremiumPanel({
  title,
  description,
  children,
  compact = false,
  className = "",
  headerClassName = "",
  contentClassName = "",
}) {
  const containerPadding = compact ? "p-4 sm:p-5" : "p-5 sm:p-6";

  return (
    <section
      className={`rounded-3xl border border-slate-200 bg-white/95 shadow-sm transition-colors duration-300 dark:border-slate-800 dark:bg-slate-950/80 ${containerPadding} ${className}`}
    >
      {(title || description) && (
        <header className={`mb-4 sm:mb-5 ${headerClassName}`}>
          {title ? (
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white sm:text-xl">
              {title}
            </h2>
          ) : null}

          {description ? (
            <p className="mt-1 text-sm leading-6 text-slate-600 dark:text-slate-400">
              {description}
            </p>
          ) : null}
        </header>
      )}

      {/* Renderiza apenas o conteudo recebido da pagina/chamador. */}
      <div className={contentClassName}>{children}</div>
    </section>
  );
}
