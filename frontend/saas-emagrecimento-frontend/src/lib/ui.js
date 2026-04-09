// ======================================================
// Biblioteca simples de classes visuais reutilizáveis
// Responsável por padronizar cards, badges e containers
// do Fitelligence.
// ======================================================

export const ui = {
  // ------------------------------------------------------
  // Card principal do sistema
  // Base para quase todos os blocos do dashboard
  // ------------------------------------------------------
  card:
    "rounded-[28px] border border-slate-200 bg-white/90 shadow-[0_10px_30px_rgba(15,23,42,0.06)] backdrop-blur",

  // ------------------------------------------------------
  // Card premium com mais destaque visual
  // Ideal para hero, IA e áreas estratégicas
  // ------------------------------------------------------
  elevatedCard:
    "rounded-[32px] border border-slate-200 bg-white/90 shadow-[0_20px_60px_rgba(15,23,42,0.10)] backdrop-blur",

  // ------------------------------------------------------
  // Badge pequena para labels de seção
  // ------------------------------------------------------
  eyebrow:
    "inline-flex rounded-full border border-slate-200 bg-white px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500 shadow-sm",

  // ------------------------------------------------------
  // Título principal de seção
  // ------------------------------------------------------
  sectionTitle:
    "text-xl font-semibold tracking-tight text-slate-900 md:text-2xl",

  // ------------------------------------------------------
  // Texto secundário
  // ------------------------------------------------------
  muted:
    "text-sm leading-6 text-slate-500",

  // ------------------------------------------------------
  // Botão fantasma premium
  // ------------------------------------------------------
  ghostButton:
    "inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md",
};