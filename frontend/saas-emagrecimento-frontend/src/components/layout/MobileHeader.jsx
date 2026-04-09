"use client";

import { memo } from "react";
import { Flame, Sparkles, Target } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

function MobileHeaderComponent({
  title = "Hoje",
  subtitle = "",
  scoreDia = null,
  streakDias = null,
  indicatorLabel = "",
}) {
  const { user } = useAuth();
  const primeiroNome = user?.nome?.split(" ")[0] || "Voce";

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200/80 bg-white/88 backdrop-blur-xl lg:hidden">
      <div className="px-4 pb-3 pt-[calc(env(safe-area-inset-top)+0.9rem)]">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-emerald-600">
              Fitelligence
            </p>
            <h1 className="mt-1 text-xl font-bold tracking-tight text-slate-900">
              Ola, {primeiroNome}
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              {subtitle || title}
            </p>
          </div>

          <div className="flex flex-col gap-2">
            {scoreDia !== null ? (
              <div className="inline-flex items-center gap-2 rounded-2xl bg-emerald-50 px-3 py-2 text-xs font-semibold text-emerald-700 ring-1 ring-emerald-200">
                <Target className="h-4 w-4" />
                <span>{scoreDia} pts</span>
              </div>
            ) : null}

            {streakDias !== null ? (
              <div className="inline-flex items-center gap-2 rounded-2xl bg-amber-50 px-3 py-2 text-xs font-semibold text-amber-700 ring-1 ring-amber-200">
                <Flame className="h-4 w-4" />
                <span>{streakDias} dias</span>
              </div>
            ) : indicatorLabel ? (
              <div className="inline-flex items-center gap-2 rounded-2xl bg-slate-100 px-3 py-2 text-xs font-semibold text-slate-700 ring-1 ring-slate-200">
                <Sparkles className="h-4 w-4" />
                <span>{indicatorLabel}</span>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </header>
  );
}

const MobileHeader = memo(MobileHeaderComponent);

export default MobileHeader;
