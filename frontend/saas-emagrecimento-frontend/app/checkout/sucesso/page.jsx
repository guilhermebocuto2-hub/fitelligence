// ======================================================
// Pagina de sucesso do checkout (casca estatica)
// Responsavel por:
// - manter rota exportavel com output: "export"
// - delegar logica client-only para componente isolado
// ======================================================

import { Suspense } from "react";
import CheckoutSucessoClient from "./CheckoutSucessoClient";

export default function CheckoutSucessoPage() {
  return (
    // ====================================================
    // Suspense garante boundary segura para hooks client
    // como useSearchParams no componente interno.
    // ====================================================
    <Suspense
      fallback={
        <div className="min-h-screen bg-white px-4 py-10 dark:bg-slate-950">
          <div className="mx-auto max-w-2xl rounded-[28px] border border-slate-200 bg-white p-6 shadow-lg dark:border-slate-800 dark:bg-slate-900">
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
              Confirmando sua assinatura...
            </h1>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
              Aguarde enquanto validamos os dados do seu checkout.
            </p>
          </div>
        </div>
      }
    >
      <CheckoutSucessoClient />
    </Suspense>
  );
}

