"use client";

// Ícone usado no botão de notificações.
import { Bell } from "lucide-react";

// Botão de notificações do header.
// Agora ele é visual, mas já deixa a estrutura pronta
// para integrar notificações reais do backend depois.
export default function NotificationButton({ total = 3 }) {
  return (
    <button
      type="button"
      className="relative flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:border-emerald-200 hover:shadow-md"
      aria-label="Notificações"
    >
      {/* Ícone principal */}
      <Bell className="h-5 w-5 text-slate-700" />

      {/* Badge com número de notificações */}
      {total > 0 ? (
        <span className="absolute -right-1 -top-1 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-emerald-500 px-1 text-[10px] font-bold text-white">
          {total}
        </span>
      ) : null}
    </button>
  );
}