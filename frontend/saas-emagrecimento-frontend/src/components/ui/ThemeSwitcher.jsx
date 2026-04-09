"use client";

// ======================================================
// ThemeSwitcher
// Responsável por alternar entre light e dark
// com aparência premium
// ======================================================

import { Moon, Sun } from "lucide-react";
import { useTheme } from "../../context/ThemeContext";

export default function ThemeSwitcher() {
  const { theme, toggleTheme, mounted } = useTheme();

  if (!mounted) {
    return (
      <button
        type="button"
        className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 bg-white/80 text-slate-400 shadow-sm dark:border-slate-800 dark:bg-slate-900/80"
      >
        <div className="h-4 w-4 animate-pulse rounded-full bg-slate-300 dark:bg-slate-700" />
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className="group inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 bg-white/80 text-slate-600 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-violet-300 hover:text-violet-700 hover:shadow-md dark:border-slate-800 dark:bg-slate-900/80 dark:text-slate-300 dark:hover:border-violet-500/30 dark:hover:text-violet-300"
      aria-label={theme === "dark" ? "Ativar modo claro" : "Ativar modo escuro"}
      title={theme === "dark" ? "Ativar modo claro" : "Ativar modo escuro"}
    >
      {theme === "dark" ? (
        <Sun className="h-5 w-5 transition-transform duration-300 group-hover:rotate-12" />
      ) : (
        <Moon className="h-5 w-5 transition-transform duration-300 group-hover:-rotate-12" />
      )}
    </button>
  );
}