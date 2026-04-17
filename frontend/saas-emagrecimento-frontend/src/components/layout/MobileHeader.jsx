"use client";

import { memo, useState, useEffect } from "react";
import { Flame, LogOut, Moon, Sun, Target } from "lucide-react";
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

  const [isDark, setIsDark] = useState(true);
  useEffect(() => {
    setIsDark(document.documentElement.classList.contains("dark"));
  }, []);
  function toggleTheme() {
    const currentlyDark = document.documentElement.classList.contains("dark");
    if (currentlyDark) {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("fitelligence-theme", "light");
      setIsDark(false);
    } else {
      document.documentElement.classList.add("dark");
      localStorage.setItem("fitelligence-theme", "dark");
      setIsDark(true);
    }
  }

  return (
    <header className="sticky top-0 z-30 border-b border-[var(--border-color)] bg-[var(--bg-primary)]/95 backdrop-blur-xl lg:hidden">
      <div className="px-4 pb-3 pt-[calc(env(safe-area-inset-top)+0.9rem)]">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#7C3AED]">
              Fitelligence
            </p>
            <h1 className="mt-1 text-xl font-bold tracking-tight text-[var(--text-primary)]">
              Ola, {primeiroNome}
            </h1>
            <p className="mt-1 text-sm text-[var(--text-secondary)]">
              {subtitle || title}
            </p>
          </div>

          <div className="flex flex-col items-end gap-2">
              <div className="flex gap-1">
                <button
                  onClick={toggleTheme}
                  className="inline-flex items-center rounded-xl border border-[var(--border-color)] bg-[var(--bg-card)] p-1.5 text-[var(--text-secondary)] hover:text-white"
                >
                  {isDark ? <Sun className="h-3.5 w-3.5" /> : <Moon className="h-3.5 w-3.5" />}
                </button>
                <button
                  onClick={handleLogout}
                  className="inline-flex items-center rounded-xl border border-[var(--border-color)] bg-[var(--bg-card)] p-1.5 text-[var(--text-secondary)] hover:text-[#EF4444]"
                >
                  <LogOut className="h-3.5 w-3.5" />
                </button>
              </div>
            {scoreDia !== null ? (
              <div className="inline-flex items-center gap-2 rounded-2xl border border-[var(--border-color)] bg-[var(--bg-card)] px-3 py-2 text-xs font-semibold text-[#10B981]">
                <Target className="h-4 w-4" />
                <span>{scoreDia} pts</span>
              </div>
            ) : null}

            {streakDias !== null ? (
              <div className="inline-flex items-center gap-2 rounded-2xl border border-[var(--border-color)] bg-[var(--bg-card)] px-3 py-2 text-xs font-semibold text-amber-400">
                <Flame className="h-4 w-4" />
                <span>{streakDias} dias</span>
              </div>
            ) : indicatorLabel ? (
              <div className="inline-flex items-center gap-2 rounded-2xl border border-[var(--border-color)] bg-[var(--bg-card)] px-3 py-2 text-xs font-semibold text-[var(--text-secondary)]">
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
