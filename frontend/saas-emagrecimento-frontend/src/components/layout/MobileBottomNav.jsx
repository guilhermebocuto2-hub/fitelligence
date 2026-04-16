"use client";

// ======================================================
// Navegacao inferior mobile do Fitelligence
// Responsavel por:
// - substituir a sidebar no mobile
// - manter fluxo unico de navegacao para perfil usuario
// - priorizar acessos principais com toque rapido
// ======================================================

import Link from "next/link";
import { memo } from "react";
import { usePathname } from "next/navigation";
import {
  Activity,
  CircleUserRound,
  Crown,
  Home,
  Map,
} from "lucide-react";

const mobileNavigation = [
  {
    label: "Home",
    href: "/dashboard",
    icon: Home,
  },
  {
    label: "Plano",
    href: "/plano",
    icon: Map,
  },
  {
    label: "Progresso",
    href: "/progresso",
    icon: Activity,
  },
  {
    label: "Premium",
    href: "/premium",
    icon: Crown,
  },
  {
    label: "Perfil",
    href: "/perfil",
    icon: CircleUserRound,
  },
];

function MobileBottomNavComponent() {
  const pathname = usePathname();

  return (
    <nav className="fixed inset-x-0 bottom-0 z-50 bg-transparent px-3 pb-[calc(env(safe-area-inset-bottom)+0.75rem)] pt-3 lg:hidden">
      <div className="mx-auto grid max-w-lg grid-cols-5 gap-1 rounded-[28px] border border-slate-200/80 bg-white/92 p-2 shadow-[0_18px_45px_rgba(15,23,42,0.18)] backdrop-blur-2xl">
        {mobileNavigation.map((item) => {
          const Icon = item.icon;

          // ==================================================
          // Mantemos /plano como alias visual do fluxo
          // atual de /plano-alimentar sem quebrar rotas.
          // ==================================================
          const isPlanoGroup =
            item.href === "/plano" &&
            (pathname === "/plano" || pathname === "/plano-alimentar");

          const isActive = pathname === item.href || isPlanoGroup;

          const isPremiumItem = item.href === "/premium";

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`group relative flex flex-col items-center justify-center gap-1.5 rounded-2xl px-1 py-3 text-[11px] font-medium transition-all duration-300 ${
                isPremiumItem
                  ? isActive
                    ? "bg-violet-100 text-violet-700 ring-1 ring-violet-300"
                    : "text-violet-500 hover:bg-violet-50 hover:text-violet-700"
                  : isActive
                  ? "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200"
                  : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
              }`}
            >
              {isActive ? (
                <span
                  className={`absolute inset-x-5 top-1 h-1 rounded-full ${
                    isPremiumItem ? "bg-violet-500/70" : "bg-emerald-500/70"
                  }`}
                />
              ) : null}

              <div
                className={`flex h-8 w-8 items-center justify-center rounded-xl transition-all duration-300 ${
                  isPremiumItem
                    ? isActive
                      ? "bg-violet-200 text-violet-700"
                      : "text-violet-400 group-hover:bg-violet-100 group-hover:text-violet-700"
                    : isActive
                    ? "bg-emerald-100 text-emerald-700"
                    : "text-slate-400 group-hover:bg-slate-100 group-hover:text-slate-900"
                }`}
              >
                <Icon className="h-4 w-4" />
              </div>

              <span className="relative z-10">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

const MobileBottomNav = memo(MobileBottomNavComponent);

export default MobileBottomNav;
