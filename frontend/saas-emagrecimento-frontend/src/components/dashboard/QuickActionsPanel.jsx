"use client";

import Link from "next/link";
import {
  Activity,
  Apple,
  ArrowRight,
  ClipboardList,
  ScanSearch,
  Users,
} from "lucide-react";

// ======================================================
// Mapa de ações por perfil
// ======================================================
function getActionsByPerfil(perfilTipo = "usuario") {
  if (perfilTipo === "personal") {
    return [
      {
        title: "Ver alunos",
        description: "Acesse a visão geral dos alunos.",
        href: "/alunos",
        icon: Users,
      },
      {
        title: "Abrir check-ins",
        description: "Veja quem precisa de atenção.",
        href: "/checkins",
        icon: ClipboardList,
      },
      {
        title: "Evolução corporal",
        description: "Compare progresso dos alunos.",
        href: "/progresso",
        icon: Activity,
      },
    ];
  }

  if (perfilTipo === "nutricionista") {
    return [
      {
        title: "Ver aderência",
        description: "Acompanhe consistência alimentar.",
        href: "/dashboard",
        icon: ClipboardList,
      },
      {
        title: "Analisar refeições",
        description: "Leitura alimentar com IA.",
        href: "/alimentacao",
        icon: Apple,
      },
      {
        title: "Revisar pacientes",
        description: "Acesse sua base clínica.",
        href: "/pacientes",
        icon: Users,
      },
    ];
  }

  return [
    {
      title: "Registrar progresso",
      description: "Adicione um novo dado corporal.",
      href: "/progresso",
      icon: Activity,
    },
    {
      title: "Registrar refeição",
      description: "Envie uma refeição para análise.",
      href: "/alimentacao",
      icon: Apple,
    },
    {
      title: "Ver plano atual",
      description: "Revise sua estratégia atual.",
      href: "/dashboard",
      icon: ScanSearch,
    },
  ];
}

// ======================================================
// Componente principal
// ======================================================
export default function QuickActionsPanel({
  perfilTipo = "usuario",
}) {
  const actions = getActionsByPerfil(perfilTipo);

  return (
    <section className="relative overflow-hidden rounded-[28px] border border-slate-200 bg-gradient-to-br from-white via-slate-50 to-violet-50/40 p-5 shadow-[0_20px_60px_-35px_rgba(15,23,42,0.25)] transition-colors duration-300 sm:p-6 dark:border-slate-800 dark:bg-[radial-gradient(circle_at_top_right,rgba(139,92,246,0.15),transparent_28%),linear-gradient(to_bottom_right,#0f172a,#111827,#020617)]">
      
      {/* Glow */}
      <div className="pointer-events-none absolute -right-10 -top-10 h-28 w-28 rounded-full bg-violet-500/15 blur-3xl dark:bg-violet-500/20" />

      <div className="relative z-10 space-y-4">
        
        {/* Header */}
        <div className="space-y-2">
          <span className="inline-flex rounded-full border border-violet-200 bg-violet-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-violet-700 dark:border-violet-500/20 dark:bg-violet-500/10 dark:text-violet-300">
            Ações rápidas
          </span>

          <h3 className="text-lg font-semibold text-slate-900 dark:text-white sm:text-xl">
            Próximos movimentos
          </h3>

          <p className="text-sm leading-6 text-slate-600 dark:text-slate-400 sm:leading-7">
            Atalhos inteligentes para acelerar sua rotina no Fitelligence.
          </p>
        </div>

        {/* Lista */}
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {actions.map((action) => {
            const Icon = action.icon;

            return (
              <Link
                key={action.title}
                href={action.href}
                className="group relative overflow-hidden rounded-[22px] border border-slate-200 bg-white/90 p-4 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-slate-300 hover:shadow-md dark:border-slate-800 dark:bg-slate-950/70 dark:hover:border-slate-700"
              >
                {/* Hover glow */}
                <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100 bg-gradient-to-br from-violet-500/10 via-transparent to-transparent" />

                <div className="relative z-10 flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    
                    {/* Ícone */}
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-violet-100 text-violet-600 shadow-sm dark:bg-violet-500/10 dark:text-violet-400">
                      <Icon className="h-5 w-5" />
                    </div>

                    {/* Texto */}
                    <div className="space-y-1">
                      <p className="text-sm font-semibold text-slate-900 dark:text-white">
                        {action.title}
                      </p>

                      <p className="text-xs leading-5 text-slate-500 dark:text-slate-400 sm:text-sm sm:leading-6">
                        {action.description}
                      </p>
                    </div>
                  </div>

                  {/* Arrow */}
                  <ArrowRight className="h-4 w-4 shrink-0 text-slate-400 transition-transform duration-300 group-hover:translate-x-1 dark:text-slate-500" />
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}