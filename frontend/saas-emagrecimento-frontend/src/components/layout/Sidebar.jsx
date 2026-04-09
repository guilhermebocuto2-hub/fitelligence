"use client";

// ======================================================
// Sidebar principal do dashboard
// Responsável por:
// - navegação principal do produto no desktop
// - reforço de branding
// - contextualização do usuário
// - adaptação visual premium dark
// ======================================================

import Image from "next/image";
import Link from "next/link";
import {
  Activity,
  CircleUserRound,
  ClipboardCheck,
  Home,
  Sparkles,
  UtensilsCrossed,
} from "lucide-react";
import { usePathname } from "next/navigation";
import { useAuth } from "../../context/AuthContext";

const navigation = [
  {
    label: "Home",
    href: "/dashboard",
    icon: Home,
  },
  {
    label: "Alimentacao",
    href: "/plano-alimentar",
    icon: UtensilsCrossed,
  },
  {
    label: "Progresso",
    href: "/progresso",
    icon: Activity,
  },
  {
    label: "Check-in",
    href: "/checkins",
    icon: ClipboardCheck,
  },
  {
    label: "Perfil",
    href: "/perfil",
    icon: CircleUserRound,
  },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { user } = useAuth();

  // ====================================================
  // Extrai apenas o primeiro nome do usuário
  // para deixar o texto mais pessoal
  // ====================================================
  const primeiroNome = user?.nome?.split(" ")[0] || "User";

  return (
    <aside className="hidden min-h-screen w-[300px] shrink-0 border-r border-white/10 bg-slate-950/70 backdrop-blur-2xl lg:flex lg:flex-col">
      {/* ================================================
          Topo da sidebar
         ================================================ */}
      <div className="border-b border-white/10 px-6 py-6">
        <div className="flex items-center gap-4">
          <div className="relative flex h-14 w-14 items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-br from-violet-500 via-fuchsia-500 to-cyan-400 shadow-[0_12px_30px_rgba(124,58,237,0.35)]">
            <Image
              src="/logo-fitelligence.png"
              alt="Fitelligence"
              width={36}
              height={36}
              className="object-contain"
              priority
            />
          </div>

          <div className="space-y-1">
            <h2 className="text-lg font-semibold tracking-tight text-white">
              Fitelligence
            </h2>
            <p className="text-xs uppercase tracking-[0.22em] text-slate-400">
              AI Fitness Platform
            </p>
          </div>
        </div>
      </div>

      {/* ================================================
          Cartão de contexto do usuário
         ================================================ */}
      <div className="px-6 py-6">
        <div className="rounded-[28px] border border-white/10 bg-white/5 p-5 shadow-[0_10px_40px_rgba(0,0,0,0.18)]">
          <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500 via-fuchsia-500 to-cyan-400 text-white shadow-[0_10px_25px_rgba(124,58,237,0.35)]">
            <Sparkles className="h-5 w-5" />
          </div>

          <h3 className="text-base font-semibold text-white">
            Olá, {primeiroNome}
          </h3>

          <p className="mt-2 text-sm leading-6 text-slate-400">
            Seu ecossistema inteligente para evolução física, constância e resultados sustentáveis.
          </p>
        </div>
      </div>

      {/* ================================================
          Navegação principal
         ================================================ */}
      <nav className="flex-1 px-4 pb-6">
        <div className="space-y-2">
          {navigation.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`group flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition-all duration-300 ${
                  isActive
                    ? "bg-gradient-to-r from-violet-500 to-indigo-500 text-white shadow-[0_12px_30px_rgba(124,58,237,0.28)]"
                    : "text-slate-300 hover:bg-white/5 hover:text-white"
                }`}
              >
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-xl transition-all duration-300 ${
                    isActive
                      ? "bg-white/15 text-white"
                      : "bg-white/5 text-slate-400 group-hover:bg-white/10 group-hover:text-white"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                </div>

                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>

      {/* ================================================
          Rodapé da sidebar
         ================================================ */}
      <div className="px-6 pb-6">
        <div className="rounded-[28px] border border-violet-500/20 bg-gradient-to-br from-violet-500/10 via-white/5 to-cyan-400/10 p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-violet-300">
            AI Upgrade
          </p>

          <h4 className="mt-2 text-sm font-semibold text-white">
            Insights mais inteligentes
          </h4>

          <p className="mt-2 text-sm leading-6 text-slate-400">
            Uma base visual premium melhora foco, leitura e percepção de valor do produto.
          </p>
        </div>
      </div>
    </aside>
  );
}
