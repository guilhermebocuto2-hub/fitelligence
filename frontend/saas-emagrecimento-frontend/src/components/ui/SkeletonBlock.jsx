"use client";

// ======================================================
// Bloco base de skeleton loading
// Responsável por padronizar áreas de carregamento
// visuais do sistema com aparência premium.
// ======================================================

export default function SkeletonBlock({
  className = "",
  rounded = "rounded-2xl",
}) {
  return (
    <div
      className={`animate-pulse bg-slate-200/80 ${rounded} ${className}`}
    />
  );
}