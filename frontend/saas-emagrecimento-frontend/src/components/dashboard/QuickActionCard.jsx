"use client";

// ======================================================
// QuickActionCard
// Responsável por:
// - exibir ações rápidas do dashboard
// - permitir navegação para fluxos importantes
// - reforçar visual premium do produto
// - suportar light mode e dark mode
// ======================================================

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

// ======================================================
// Estilos do badge por tipo
// Badge ajuda a comunicar a natureza da ação
// ======================================================
function getBadgeStyles(badge) {
  switch (badge) {
    case "IA":
      return "border-violet-200 bg-violet-50 text-violet-700 dark:border-violet-500/20 dark:bg-violet-500/10 dark:text-violet-400";

    case "Vision":
      return "border-cyan-200 bg-cyan-50 text-cyan-700 dark:border-cyan-500/20 dark:bg-cyan-500/10 dark:text-cyan-400";

    case "Smart":
      return "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-400";

    case "Core":
    default:
      return "border-slate-200 bg-slate-50 text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300";
  }
}

export default function QuickActionCard({
  title = "Ação rápida",
  description = "Descrição da ação rápida.",
  href = "/dashboard",
  icon = null,
  badge = "Core",
}) {
  const badgeStyles = getBadgeStyles(badge);

  return (
    <Link
      href={href}
      className="group relative block overflow-hidden rounded-[28px] border border-slate-200/80 bg-white/90 p-5 shadow-[0_10px_30px_rgba(15,23,42,0.06)] backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-slate-300 hover:shadow-[0_18px_40px_rgba(15,23,42,0.08)] dark:border-slate-800 dark:bg-slate-950/70 dark:hover:border-slate-700 dark:shadow-[0_12px_30px_rgba(0,0,0,0.35)] dark:hover:shadow-[0_18px_40px_rgba(0,0,0,0.45)]"
    >
      {/* ==================================================
          Glow decorativo suave no fundo
         ================================================== */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-violet-500/10 via-transparent to-cyan-500/10 opacity-0 transition-opacity duration-300 group-hover:opacity-100 dark:from-violet-500/10 dark:to-cyan-500/10" />

      <div className="relative z-10">
        {/* ================================================
            Topo do card: ícone + badge
           ================================================ */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-700 transition-all duration-300 group-hover:scale-105 group-hover:bg-slate-200 dark:bg-slate-900 dark:text-slate-200 dark:group-hover:bg-slate-800">
            {icon}
          </div>

          <div
            className={`inline-flex items-center rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] ${badgeStyles}`}
          >
            {badge}
          </div>
        </div>

        {/* ================================================
            Conteúdo textual principal
           ================================================ */}
        <div className="mt-5">
          <h3 className="text-base font-semibold tracking-tight text-slate-900 dark:text-white">
            {title}
          </h3>

          <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">
            {description}
          </p>
        </div>

        {/* ================================================
            Rodapé com CTA sutil
           ================================================ */}
        <div className="mt-5 flex items-center justify-between">
          <span className="text-sm font-medium text-slate-600 transition-colors duration-300 group-hover:text-slate-900 dark:text-slate-300 dark:group-hover:text-white">
            Abrir módulo
          </span>

          <div className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 transition-all duration-300 group-hover:-translate-y-0.5 group-hover:border-slate-300 group-hover:text-slate-900 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:group-hover:border-slate-600 dark:group-hover:text-white">
            <ArrowUpRight className="h-4 w-4" />
          </div>
        </div>
      </div>
    </Link>
  );
}