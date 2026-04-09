"use client";

// ======================================================
// Pagina de perfil do usuario final
// Responsavel por:
// - oferecer um destino seguro para o item "Perfil"
// - exibir dados basicos sem alterar contratos de API
// - manter compatibilidade com o AuthContext atual
// - concentrar ajustes de conta e privacidade
// ======================================================

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import PremiumCard from "../../../src/components/ui/PremiumCard";
import SectionHeader from "../../../src/components/ui/SectionHeader";
import { useAuth } from "../../../src/context/AuthContext";
import MobileLayout from "../../../src/components/layout/MobileLayout";
import { deleteMyAccountService } from "../../../src/services/accountService";

export default function PerfilPage() {
  const router = useRouter();
  const { user, logout } = useAuth();
  const [deleting, setDeleting] = useState(false);
  const [actionError, setActionError] = useState("");

  const privacyPolicyUrl = process.env.NEXT_PUBLIC_PRIVACY_POLICY_URL || "";

  async function handleDeleteAccount() {
    const confirmed = window.confirm(
      "Tem certeza? Sua conta será excluída e o acesso ao app será encerrado."
    );

    if (!confirmed) {
      return;
    }

    try {
      setDeleting(true);
      setActionError("");
      await deleteMyAccountService();
      logout();
      router.replace("/login");
    } catch (error) {
      setActionError(
        error?.message || "Não foi possível excluir sua conta agora."
      );
    } finally {
      setDeleting(false);
    }
  }

  return (
    <MobileLayout
      title="Perfil"
      subtitle="Seus dados principais em um lugar só"
      indicatorLabel={String(user?.plano || "free").toUpperCase()}
    >
      <div className="mx-auto w-full max-w-3xl space-y-4">
        <SectionHeader
          title="Perfil"
          subtitle="Dados principais da sua conta no Fitelligence."
        />

        <PremiumCard className="space-y-3">
          {/* =================================================
              Exibicao somente leitura para evitar impacto
              de negocio nesta fase de simplificacao.
             ================================================= */}
          <div className="grid gap-3 text-sm text-slate-700">
            <div>
              <p className="text-slate-500">Nome</p>
              <p className="font-medium text-slate-900">
                {user?.nome || "Não informado"}
              </p>
            </div>

            <div>
              <p className="text-slate-500">E-mail</p>
              <p className="font-medium text-slate-900">
                {user?.email || "Não informado"}
              </p>
            </div>

            <div>
              <p className="text-slate-500">Plano</p>
              <p className="font-medium text-slate-900">{user?.plano || "free"}</p>
            </div>

            <div>
              <p className="text-slate-500">Status do onboarding</p>
              <p className="font-medium text-slate-900">
                {user?.onboarding_status || "não iniciado"}
              </p>
            </div>
          </div>
        </PremiumCard>

        <PremiumCard className="space-y-4">
          <SectionHeader
            title="Conta"
            subtitle="Ajustes importantes para privacidade e controle da sua conta."
          />

          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-sm font-semibold text-slate-900">
              Política de privacidade
            </p>
            <p className="mt-1 text-sm leading-6 text-slate-600">
              Consulte como tratamos dados de uso, fotos e informações de bem-estar.
            </p>

            {privacyPolicyUrl ? (
              <Link
                href={privacyPolicyUrl}
                target="_blank"
                rel="noreferrer"
                className="mt-3 inline-flex rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm font-semibold text-slate-900 transition hover:bg-slate-50"
              >
                Abrir política de privacidade
              </Link>
            ) : (
              <p className="mt-3 text-xs text-slate-500">
                Política de privacidade disponível em breve.
              </p>
            )}
          </div>

          <div className="rounded-2xl border border-rose-200 bg-rose-50 p-4">
            <p className="text-sm font-semibold text-rose-900">Excluir conta</p>
            <p className="mt-1 text-sm leading-6 text-rose-800">
              Esta ação encerra seu acesso e remove sua conta do app de forma segura.
            </p>

            {actionError ? (
              <p className="mt-3 text-sm text-rose-700">{actionError}</p>
            ) : null}

            <button
              type="button"
              disabled={deleting}
              onClick={handleDeleteAccount}
              className="mt-3 inline-flex rounded-2xl bg-rose-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-rose-700 disabled:opacity-70"
            >
              {deleting ? "Excluindo conta..." : "Excluir conta"}
            </button>
          </div>
        </PremiumCard>
      </div>
    </MobileLayout>
  );
}
