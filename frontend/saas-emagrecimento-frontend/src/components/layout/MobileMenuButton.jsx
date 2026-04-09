"use client";

// Ícone do menu mobile.
import { Menu } from "lucide-react";

// Botão de abertura do menu mobile.
// No próximo passo, ele será conectado ao drawer/sidebar mobile.
export default function MobileMenuButton({ onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:border-emerald-200 hover:shadow-md lg:hidden"
      aria-label="Abrir menu"
    >
      <Menu className="h-5 w-5 text-slate-700" />
    </button>
  );
}