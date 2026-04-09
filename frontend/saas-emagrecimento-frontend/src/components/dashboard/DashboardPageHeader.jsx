"use client";

// ======================================================
// Header premium do dashboard
// Responsável por:
// - contextualizar a página atual
// - exibir título, descrição e ação contextual
// - manter visual premium no desktop e no mobile
// - melhorar hierarquia e legibilidade em telas pequenas
// ======================================================

export default function DashboardPageHeader({
  eyebrow = "Módulo",
  title = "Título da página",
  description = "Descrição da página",
  action = null,
}) {
  return (
    <div className="relative overflow-hidden rounded-[28px] border border-slate-200/80 bg-gradient-to-br from-white via-slate-50 to-violet-50/70 p-5 shadow-[0_10px_30px_rgba(15,23,42,0.06)] transition-colors duration-300 sm:rounded-[30px] sm:p-6 md:p-8 dark:border-slate-800/80 dark:bg-[radial-gradient(circle_at_top_right,rgba(139,92,246,0.22),transparent_28%),linear-gradient(to_bottom_right,#0f172a,#111827,#020617)] dark:shadow-[0_18px_40px_rgba(0,0,0,0.38)]">
      {/* Glow decorativo superior */}
      <div className="pointer-events-none absolute -right-12 -top-12 h-36 w-36 rounded-full bg-violet-500/15 blur-3xl dark:bg-violet-500/20 sm:h-40 sm:w-40" />

      {/* Glow decorativo inferior */}
      <div className="pointer-events-none absolute bottom-0 left-1/4 h-28 w-28 rounded-full bg-cyan-500/10 blur-3xl dark:bg-cyan-500/10 sm:h-32 sm:w-32" />

      {/* Conteúdo principal */}
      <div className="relative z-10 flex flex-col gap-4 sm:gap-5 lg:flex-row lg:items-end lg:justify-between">
        {/* Bloco textual */}
        <div className="max-w-3xl">
          <div className="inline-flex items-center rounded-full border border-violet-200 bg-violet-50 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.22em] text-violet-700 transition-colors duration-300 dark:border-violet-500/20 dark:bg-violet-500/10 dark:text-violet-300 sm:text-[11px]">
            {eyebrow}
          </div>

          <h1 className="mt-3 text-[1.75rem] font-semibold leading-tight tracking-tight text-slate-900 transition-colors duration-300 sm:mt-4 sm:text-[2rem] md:text-4xl dark:text-white">
            {title}
          </h1>

          <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-500 transition-colors duration-300 sm:leading-7 md:text-base dark:text-slate-300">
            {description}
          </p>
        </div>

        {/* CTA contextual */}
        {action ? (
          <div className="flex w-full shrink-0 lg:w-auto lg:justify-end">
            {action}
          </div>
        ) : null}
      </div>
    </div>
  );
}