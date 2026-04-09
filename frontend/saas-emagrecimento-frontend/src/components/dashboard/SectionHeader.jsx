"use client";

// ======================================================
// SectionHeader
// Responsável por:
// - organizar visualmente cada seção do dashboard
// - exibir eyebrow, título e descrição
// - reforçar hierarquia visual premium
// - suportar light mode e dark mode
// ======================================================

export default function SectionHeader({
  eyebrow = "Seção",
  title = "Título da seção",
  description = "Descrição da seção",
  align = "left",
}) {
  // ====================================================
  // Controle de alinhamento
  // left   -> alinhado à esquerda
  // center -> centralizado
  // ====================================================
  const alignmentClass =
    align === "center"
      ? "mx-auto max-w-3xl text-center items-center"
      : "items-start text-left";

  return (
    <div className={`mb-5 flex flex-col gap-2 ${alignmentClass}`}>
      {/* ================================================
          Eyebrow
          Pequeno rótulo superior para reforçar contexto
         ================================================ */}
      <div className="inline-flex items-center rounded-full border border-violet-200 bg-violet-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-violet-700 transition-colors duration-300 dark:border-violet-500/20 dark:bg-violet-500/10 dark:text-violet-400">
        {eyebrow}
      </div>

      {/* ================================================
          Título principal da seção
         ================================================ */}
      <h2 className="text-xl font-semibold tracking-tight text-slate-900 transition-colors duration-300 md:text-2xl dark:text-white">
        {title}
      </h2>

      {/* ================================================
          Descrição complementar
         ================================================ */}
      <p className="max-w-3xl text-sm leading-7 text-slate-500 transition-colors duration-300 md:text-[15px] dark:text-slate-400">
        {description}
      </p>
    </div>
  );
}