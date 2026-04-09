"use client";

// ======================================================
// Layout das rotas privadas do sistema
// Este arquivo:
// - protege a área autenticada
// - valida sessão ativa
// - valida status do onboarding
// - impede acesso ao dashboard antes do onboarding
// - redireciona para o dashboard correto conforme perfil
// - usa a tabela usuarios como fonte principal de verdade
// - usa o onboarding detalhado apenas como fallback
// ======================================================

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "../../src/context/AuthContext";
import DashboardLayoutShell from "../../src/components/layout/DashboardLayout";
import { buscarOnboardingService } from "../../src/services/onboardingService";

export default function DashboardLayout({ children }) {
  const router = useRouter();
  const pathname = usePathname();

  const { user, loading } = useAuth();
  const [checkingAccess, setCheckingAccess] = useState(true);

  useEffect(() => {
    async function validarAcessoPrivado() {
      try {
        // ================================================
        // Aguarda a autenticação global terminar
        // ================================================
        if (loading) {
          return;
        }

        // ================================================
        // Sem usuário autenticado -> login
        // ================================================
        if (!user) {
          router.replace("/login");
          return;
        }

        // ================================================
        // FONTE PRINCIPAL DE VERDADE:
        // usa primeiro o status salvo em usuarios
        // ================================================
        const onboardingStatus = user?.onboarding_status || null;
        const onboardingConcluidoNoUsuario =
          onboardingStatus === "concluido";

        // ================================================
        // Se o usuário ainda não estiver concluído na
        // tabela usuarios, usamos fallback do onboarding
        // ================================================
        if (!onboardingConcluidoNoUsuario) {
          try {
            const respostaOnboarding = await buscarOnboardingService();

            const payload =
              respostaOnboarding?.onboarding ||
              respostaOnboarding?.dados ||
              respostaOnboarding?.data ||
              respostaOnboarding ||
              {};

            const onboardingConcluidoNoFluxo =
              payload?.concluido === true ||
              payload?.finalizado === true ||
              payload?.status === "concluido";

            if (!onboardingConcluidoNoFluxo) {
              router.replace("/onboarding");
              return;
            }
          } catch (fallbackError) {
            console.error(
              "Erro ao consultar fallback do onboarding:",
              fallbackError
            );

            // ============================================
            // IMPORTANTE:
            // se o fallback falhar, não jogamos para login
            // porque isso não significa sessão inválida
            // ============================================
            router.replace("/onboarding");
            return;
          }
        }

        // ================================================
        // Com onboarding concluído, garante dashboard certo
        // conforme o perfil do usuário
        // ================================================
        // ================================================
        // Fluxo simplificado:
        // todos os tipos legados convergem para o
        // dashboard unico de usuario.
        // ================================================
        const destinoCorreto = "/dashboard";

        // ================================================
        // Corrige rota errada automaticamente
        // ================================================
        if (
          pathname.startsWith("/dashboard/personal") &&
          destinoCorreto !== "/dashboard/personal"
        ) {
          router.replace(destinoCorreto);
          return;
        }

        if (
          pathname.startsWith("/dashboard/nutricionista") &&
          destinoCorreto !== "/dashboard/nutricionista"
        ) {
          router.replace(destinoCorreto);
          return;
        }

        // ================================================
        // Acesso liberado
        // ================================================
        setCheckingAccess(false);
      } catch (error) {
        console.error("Erro ao validar acesso privado:", error);

        // ================================================
        // Só manda para login se realmente não houver user
        // ================================================
        if (!user) {
          router.replace("/login");
          return;
        }

        // ================================================
        // Se já existe usuário autenticado, o problema
        // não é sessão. Mantemos fluxo no onboarding.
        // ================================================
        router.replace("/onboarding");
      }
    }

    validarAcessoPrivado();
  }, [loading, user, router, pathname]);

  // ====================================================
  // Tela de loading premium
  // ====================================================
  if (loading || checkingAccess) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[radial-gradient(circle_at_top,_rgba(124,58,237,0.18),_transparent_35%),linear-gradient(180deg,#0b1020_0%,#11182d_100%)] px-6">
        <div className="w-full max-w-md rounded-[32px] border border-white/10 bg-white/5 p-8 text-center shadow-[0_20px_80px_rgba(0,0,0,0.35)] backdrop-blur-2xl">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500 via-fuchsia-500 to-cyan-500 text-lg font-bold text-white shadow-[0_10px_30px_rgba(124,58,237,0.35)]">
            F
          </div>

          <h2 className="text-xl font-semibold tracking-tight text-white">
            Carregando ambiente inteligente
          </h2>

          <p className="mt-2 text-sm leading-6 text-slate-300">
            Estamos preparando sua experiência premium no Fitelligence.
          </p>

          <div className="mt-6 h-2 w-full overflow-hidden rounded-full bg-white/10">
            <div className="h-full w-1/2 animate-pulse rounded-full bg-gradient-to-r from-violet-500 via-fuchsia-500 to-cyan-400" />
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return <DashboardLayoutShell>{children}</DashboardLayoutShell>;
}
