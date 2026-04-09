"use client";

// ======================================================
// Pagina placeholder de paciente (rota estatica)
// Responsavel por:
// - manter compatibilidade com output: "export" do Next.js
// - evitar rota dinamica em build estatico do Capacitor
// - receber o paciente por query string: /paciente?id=123
// ======================================================

import { useRouter, useSearchParams } from "next/navigation";

export default function PacienteDetalhePage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // ====================================================
  // Leitura client-side segura do id via query param.
  // Mantemos fallback nulo para evitar undefined na UI.
  // ====================================================
  const pacienteId = searchParams?.get("id")
    ? String(searchParams.get("id"))
    : null;

  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-6 sm:px-6">
      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
          Paciente
        </p>

        <h1 className="mt-2 text-2xl font-semibold text-slate-900">
          Ficha do paciente {pacienteId ? `#${pacienteId}` : ""}
        </h1>

        <p className="mt-3 text-sm leading-6 text-slate-600">
          Esta rota estatica foi adotada para manter o build exportavel do app
          sem quebrar o fluxo existente. A visao completa da ficha pode ser
          evoluida na proxima etapa.
        </p>

        <div className="mt-5 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => router.back()}
            className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 active:scale-[0.98]"
          >
            Voltar
          </button>

          <button
            type="button"
            onClick={() => router.push("/dashboard")}
            className="inline-flex items-center justify-center rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800 active:scale-[0.98]"
          >
            Ir para dashboard
          </button>
        </div>
      </section>
    </div>
  );
}
