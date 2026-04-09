"use client";

// Ícones usados no menu do usuário.
import { ChevronDown, Settings, User, LogOut } from "lucide-react";
import { useState } from "react";

// Componente de menu do usuário.
// Ele mostra avatar, nome, email e um dropdown simples com ações.
// Neste momento usamos uma lógica local simples.
// Depois, pode ser integrado com autenticação real e logout funcional.
export default function UserMenu({
  userName = "Guilherme",
  userEmail = "guilherme@email.com",
}) {
  // Estado para controlar abertura/fechamento do dropdown.
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      {/* Botão principal do usuário */}
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-3 py-2 shadow-sm transition-all duration-300 hover:border-emerald-200 hover:shadow-md"
      >
        {/* Avatar simples gerado a partir da inicial */}
        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-900 text-sm font-semibold text-white">
          {userName?.charAt(0)?.toUpperCase() || "U"}
        </div>

        {/* Dados do usuário */}
        <div className="hidden text-left sm:block">
          <p className="text-sm font-semibold text-slate-900">{userName}</p>
          <p className="text-xs text-slate-500">{userEmail}</p>
        </div>

        {/* Ícone de seta do menu */}
        <ChevronDown
          className={`h-4 w-4 text-slate-500 transition-transform duration-300 ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* Dropdown do menu */}
      {open ? (
        <div className="absolute right-0 z-50 mt-3 w-64 rounded-2xl border border-slate-200 bg-white p-2 shadow-xl">
          {/* Cabeçalho do dropdown */}
          <div className="rounded-2xl bg-slate-50 p-3">
            <p className="text-sm font-semibold text-slate-900">{userName}</p>
            <p className="mt-1 text-xs text-slate-500">{userEmail}</p>
          </div>

          {/* Lista de ações */}
          <div className="mt-2 space-y-1">
            <a
              href="/perfil"
              className="flex items-center gap-3 rounded-xl px-3 py-2 text-sm text-slate-700 transition-all duration-300 hover:bg-slate-50 hover:text-slate-900"
            >
              <User className="h-4 w-4" />
              <span>Meu perfil</span>
            </a>

            <a
              href="/configuracoes"
              className="flex items-center gap-3 rounded-xl px-3 py-2 text-sm text-slate-700 transition-all duration-300 hover:bg-slate-50 hover:text-slate-900"
            >
              <Settings className="h-4 w-4" />
              <span>Configurações</span>
            </a>

            <button
              type="button"
              className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-left text-sm text-red-600 transition-all duration-300 hover:bg-red-50"
            >
              <LogOut className="h-4 w-4" />
              <span>Sair</span>
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}