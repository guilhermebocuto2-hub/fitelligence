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
    <nav className="fixed inset-x-0 bottom-0 z-50 border-t border-[var(--border-color)] bg-[var(--bg-primary)] px-3 pb-[calc(env(safe-area-inset-bottom)+0.75rem)] pt-3 lg:hidden">
      <div className="mx-auto grid max-w-lg grid-cols-5 gap-1 rounded-[28px] border border-[var(--border-color)] bg-[var(--bg-card)] p-2 shadow-[0_18px_45px_rgba(0,0,0,0.6)]">
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
                    ? "bg-[#7C3AED]/15 text-[#7C3AED]"
                    : "text-[#7C3AED]/70 hover:bg-[#7C3AED]/10 hover:text-[#7C3AED]"
                  : isActive
                  ? "bg-[#7C3AED]/15 text-[#7C3AED]"
                  : "text-[#6B7280] hover:bg-[var(--bg-surface)] hover:text-white"
              }`}
            >
              {isActive ? (
                <span
                  className="absolute inset-x-5 top-1 h-0.5 rounded-full bg-[#7C3AED]/70"
                />
              ) : null}

              <div
                className={`flex h-8 w-8 items-center justify-center rounded-xl transition-all duration-300 ${
                  isPremiumItem
                    ? isActive
                      ? "bg-[#7C3AED]/20 text-[#7C3AED]"
                      : "text-[#7C3AED]/60 group-hover:bg-[#7C3AED]/10 group-hover:text-[#7C3AED]"
                    : isActive
                    ? "bg-[#7C3AED]/20 text-[#7C3AED]"
                    : "text-[#6B7280] group-hover:bg-[var(--bg-surface)] group-hover:text-white"
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
