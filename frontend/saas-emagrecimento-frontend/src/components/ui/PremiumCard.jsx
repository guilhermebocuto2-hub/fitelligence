"use client";

// ======================================================
// PremiumCard
// Base visual premium reutilizável para blocos do dashboard.
// Mantém compatibilidade com as props atuais e adiciona
// opções visuais sem alterar regra de negócio.
// ======================================================
export default function PremiumCard({
  children,
  className = "",
  glow = false,
  as: Component = "section",
  interactive = true,
  compact = false,
}) {
  return (
    <Component
      className={`
        relative overflow-hidden rounded-3xl border border-slate-200/90 bg-white
        ${compact ? "p-4 sm:p-5" : "p-5 sm:p-6"}
        shadow-[0_10px_30px_rgba(15,23,42,0.08)]
        ${interactive ? "transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_16px_40px_rgba(15,23,42,0.12)]" : ""}
        ${glow ? "before:absolute before:right-0 before:top-0 before:h-28 before:w-28 before:rounded-full before:bg-emerald-100/60 before:blur-3xl before:content-['']" : ""}
        ${className}
      `}
    >
      {/* Conteúdo principal do card sempre acima do glow */}
      <div className="relative z-10">{children}</div>
    </Component>
  );
}
