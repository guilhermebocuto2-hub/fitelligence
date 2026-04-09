"use client";

// ======================================================
// Header principal do Fitelligence
// Responsável por:
// - contextualizar o usuário autenticado
// - exibir idioma, tema e logout
// - manter visual premium no desktop e mobile
// - funcionar melhor em telas pequenas
// ======================================================

import { LogOut, Sparkles } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useTranslation } from "../../i18n/useTranslation";
import ThemeSwitcher from "../ui/ThemeSwitcher";

export default function Header() {
  const { user, logout } = useAuth();
  const { t, language, setLanguage } = useTranslation();

  // ====================================================
  // Pega só o primeiro nome para deixar a saudação
  // mais amigável e curta no mobile
  // ====================================================
  const primeiroNome = user?.nome?.split(" ")[0] || "User";

  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-slate-950/65 backdrop-blur-2xl">
      <div className="px-4 py-3 sm:px-5 md:px-6 lg:px-8">
        <div className="flex flex-col gap-3">
          {/* ============================================
              Bloco superior do header
             ============================================ */}
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            {/* Bloco esquerdo */}
            <div className="flex items-start gap-3">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500 via-fuchsia-500 to-cyan-400 text-white shadow-[0_10px_25px_rgba(124,58,237,0.35)]">
                <Sparkles className="h-5 w-5" />
              </div>

              <div className="min-w-0">
                <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-violet-300 sm:text-xs">
                  Fitelligence AI OS
                </p>

                <h1 className="mt-1 text-lg font-semibold tracking-tight text-white sm:text-xl md:text-2xl">
                  {t("header.welcome")} {primeiroNome}
                </h1>

                <p className="mt-1 max-w-2xl text-sm text-slate-400">
                  {t("header.subtitle")}
                </p>
              </div>
            </div>

            {/* Bloco direito */}
            <div className="flex flex-wrap items-center gap-2 sm:gap-3 md:justify-end">
              <select
                value={language}
                onChange={(event) => setLanguage(event.target.value)}
                className="h-11 min-w-[92px] rounded-2xl border border-white/10 bg-white/5 px-4 pr-10 text-sm font-medium text-slate-200 outline-none transition-all duration-300 hover:border-white/20 focus:border-violet-400 focus:ring-4 focus:ring-violet-500/10"
              >
                <option value="pt">PT-BR</option>
                <option value="en">EN</option>
                <option value="es">ES</option>
              </select>

              <ThemeSwitcher />

              <button
                type="button"
                onClick={logout}
                className="inline-flex h-11 items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 text-sm font-medium text-slate-200 transition-all duration-300 hover:-translate-y-0.5 hover:border-red-500/30 hover:bg-red-500/10 hover:text-red-300"
              >
                <LogOut className="h-4 w-4" />
                <span>Sair</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
