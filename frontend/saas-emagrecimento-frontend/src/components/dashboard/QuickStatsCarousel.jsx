"use client";

// ======================================================
// QuickStatsCarousel
// Responsavel por:
// - renderizar atalhos de alta frequencia
// - manter interacao rapida no mobile-first
// - preservar comportamento dos onClick recebidos por props
// ======================================================

import PremiumCard from "../ui/PremiumCard";
import SectionHeader from "../ui/SectionHeader";
import HorizontalCarousel from "../ui/HorizontalCarousel";

export default function QuickStatsCarousel({ quickActions = [] }) {
  return (
    <PremiumCard glow>
      <SectionHeader
        eyebrow="Atalhos"
        title="Acoes rapidas"
        description="Acesse os fluxos mais importantes da jornada sem quebrar o ritmo."
      />

      <div className="mt-4 sm:mt-5">
        <HorizontalCarousel
          ariaLabel="Acoes rapidas do dashboard"
          itemClassName="min-w-[78%] sm:min-w-[320px] lg:min-w-[260px]"
          trackClassName="lg:gap-5"
        >
          {quickActions.map((action) => {
            const Icon = action.icon;

            return (
              <PremiumCard
                key={action.id}
                compact
                className="h-full p-0"
                interactive={false}
              >
                <button
                  type="button"
                  onClick={action.onClick}
                  className="group block w-full rounded-3xl p-4 text-left"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500/15 via-fuchsia-500/10 to-cyan-500/10 text-violet-600 transition-transform duration-300 group-hover:scale-105 dark:text-violet-300">
                    <Icon className="h-5 w-5" />
                  </div>

                  <h3 className="mt-4 text-sm font-semibold text-slate-900 dark:text-white sm:text-base">
                    {action.title}
                  </h3>

                  <p className="mt-1 text-xs leading-5 text-slate-500 dark:text-slate-400 sm:text-sm">
                    {action.description}
                  </p>
                </button>
              </PremiumCard>
            );
          })}
        </HorizontalCarousel>
      </div>
    </PremiumCard>
  );
}

