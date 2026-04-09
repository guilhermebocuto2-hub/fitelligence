"use client";

// ======================================================
// ThemeContext global do Fitelligence
// Responsável por:
// - controlar o tema atual (light / dark)
// - persistir a escolha no localStorage
// - respeitar preferência do sistema no primeiro acesso
// - adicionar/remover a classe "dark" no <html>
// ======================================================

import { createContext, useContext, useEffect, useMemo, useState } from "react";

// ======================================================
// Criação do contexto
// ======================================================
const ThemeContext = createContext(null);

// ======================================================
// Hook personalizado para consumir o tema
// Facilita o uso nos componentes
// ======================================================
export function useTheme() {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error("useTheme deve ser usado dentro de ThemeProvider");
  }

  return context;
}

// ======================================================
// Provider principal do tema
// ======================================================
export function ThemeProvider({ children }) {
  // ====================================================
  // Estado do tema atual
  // Pode ser "light" ou "dark"
  // ====================================================
  const [theme, setTheme] = useState(() => {
    // Inicializacao lazy evita setState dentro de effect e reduz renders em cascata.
    if (typeof window === "undefined") return "light";

    const storedTheme = window.localStorage.getItem("fitelligence-theme");

    if (storedTheme === "light" || storedTheme === "dark") {
      return storedTheme;
    }

    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    return prefersDark ? "dark" : "light";
  });

  // ====================================================
  // Estado para evitar inconsistência visual
  // na hidratação do Next.js
  // ====================================================
  const mounted = true;

  // ====================================================
  // No primeiro carregamento:
  // 1) tenta pegar do localStorage
  // 2) se não existir, usa preferência do sistema
  // ====================================================


  // ====================================================
  // Sempre que o tema mudar:
  // - salva no localStorage
  // - atualiza a classe "dark" no html
  // ====================================================
  useEffect(() => {
    if (!mounted) return;

    const root = window.document.documentElement;

    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }

    window.localStorage.setItem("fitelligence-theme", theme);
  }, [theme, mounted]);

  // ====================================================
  // Alterna entre light e dark
  // ====================================================
  const toggleTheme = () => {
    setTheme((currentTheme) => (currentTheme === "dark" ? "light" : "dark"));
  };

  // ====================================================
  // useMemo para evitar renders desnecessários
  // ====================================================
  const value = useMemo(
    () => ({
      theme,
      setTheme,
      toggleTheme,
      mounted,
      isDark: theme === "dark",
    }),
    [theme, mounted]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}
