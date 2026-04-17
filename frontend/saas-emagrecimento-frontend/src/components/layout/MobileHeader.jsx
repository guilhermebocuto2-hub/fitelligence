"use client";

import { memo } from "react";
import { Flame, LogOut, Target } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../context/AuthContext";

function MobileHeaderComponent({
  title = "Hoje",
  subtitle = "",
  scoreDia = null,
  streakDias = null,
  indicatorLabel = "",
}) {
  const { user, logout } = useAuth();
  const primeiroNome = user?.nome?.split(" ")[0] || "Voce";
  const router = useRouter();
  function handleLogout() { logout(); router.push("/login"); }

  return (
    <header className="sticky top-0 z-30 border-b border-[#2A2A2A] bg-[#0F0F0F]/95 backdrop-blur-xl lg:hidden">
      <div className="px-4 pb-3 pt-[calc(env(safe-area-inset-top)+0.9rem)]">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#7C3AED]">
              Fitelligence
            </p>
            <h1 className="mt-1 text-xl font-bold tracking-tight text-white">
              Ola, {primeiroNome}
            </h1>
            <p className="mt-1 text-sm text-[#9CA3AF]">
              {subtitle || title}
            </p>
          </div>

          <div className="flex flex-col items-end gap-2">
              <button
                onClick={handleLogout}
                className="inline-flex items-center rounded-xl border border-[#2A2A2A] bg-[#1A1A1A] p-1.5 text-[#9CA3AF] hover:text-[#EF4444]"
              >
                <LogOut className="h-3.5 w-3.5" />
              </button>
            {scoreDia !== null ? (
              <div className="inline-flex items-center gap-2 rounded-2xl border border-[#2A2A2A] bg-[#1A1A1A] px-3 py-2 text-xs font-semibold text-[#10B981]">
                <Target className="h-4 w-4" />
                <span>{scoreDia} pts</span>
              </div>
            ) : null}

            {streakDias !== null ? (
              <div className="inline-flex items-center gap-2 rounded-2xl border border-[#2A2A2A] bg-[#1A1A1A] px-3 py-2 text-xs font-semibold text-amber-400">
                <Flame className="h-4 w-4" />
                <span>{streakDias} dias</span>
              </div>
            ) : indicatorLabel ? (
              <div className="inline-flex items-center gap-2 rounded-2xl border border-[#2A2A2A] bg-[#1A1A1A] px-3 py-2 text-xs font-semibold text-[#9CA3AF]">
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
