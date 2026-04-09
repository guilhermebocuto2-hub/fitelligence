"use client";

// ======================================================
// Componente client-only da pagina de sucesso
// Responsavel por:
// - ler session_id da URL via useSearchParams
// - acessar localStorage com seguranca no browser
// - consultar sessao de checkout no backend
// - manter comportamento atual da tela
// ======================================================

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function CheckoutSucessoClient() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [loading, setLoading] = useState(true);
  const [sessionData, setSessionData] = useState(null);
  const [erro, setErro] = useState("");

  useEffect(() => {
    async function carregarSessao() {
      try {
        const sessionId = searchParams.get("session_id");
        const token = localStorage.getItem("token");

        if (!sessionId) {
          throw new Error("session_id não encontrado na URL.");
        }

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/stripe/checkout-session?session_id=${sessionId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data?.erro || "Não foi possível confirmar a sessão.");
        }

        setSessionData(data.session);
      } catch (error) {
        console.error("Erro ao carregar sessão de sucesso:", error);
        setErro(error.message || "Erro ao confirmar sessão.");
      } finally {
        setLoading(false);
      }
    }

    carregarSessao();
  }, [searchParams]);

  return (
    <div className="min-h-screen bg-white px-4 py-10 dark:bg-slate-950">
      <div className="mx-auto max-w-2xl rounded-[28px] border border-slate-200 bg-white p-6 shadow-lg dark:border-slate-800 dark:bg-slate-900">
        {loading ? (
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
              Confirmando sua assinatura...
            </h1>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
              Aguarde enquanto validamos os dados do seu checkout.
            </p>
          </div>
        ) : erro ? (
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
              Não foi possível confirmar agora
            </h1>
            <p className="mt-2 text-sm text-red-600 dark:text-red-400">
              {erro}
            </p>

            <button
              type="button"
              onClick={() => router.push("/dashboard")}
              className="mt-6 rounded-2xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white dark:bg-white dark:text-slate-900"
            >
              Voltar ao dashboard
            </button>
          </div>
        ) : (
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
              Assinatura iniciada com sucesso
            </h1>

            <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
              Seu checkout foi concluído. O plano premium será refletido no seu
              acesso assim que o webhook do Stripe concluir a atualização.
            </p>

            <div className="mt-6 rounded-2xl border border-slate-200 p-4 dark:border-slate-800">
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Status do pagamento:
              </p>
              <p className="mt-1 text-lg font-semibold text-slate-900 dark:text-white">
                {sessionData?.payment_status || "não informado"}
              </p>
            </div>

            <button
              type="button"
              onClick={() => router.push("/dashboard")}
              className="mt-6 rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-600 px-5 py-3 text-sm font-semibold text-white"
            >
              Ir para o dashboard
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

