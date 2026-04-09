"use client";

// ======================================================
// Painel de comparação corporal antes vs depois
// Responsável por:
// - mostrar comparação visual
// - reforçar percepção de evolução
// - adicionar camada premium ao dashboard
// ======================================================

import Image from "next/image";
import { Camera, Sparkles } from "lucide-react";
import { getBodyComparisonInsight } from "../../lib/bodyComparisonInsight";

export default function BeforeAfterPanel({
  comparacao = null,
  apiBaseUrl = "",
}) {
  const insight = getBodyComparisonInsight(comparacao);

  // ====================================================
  // Função para montar URL absoluta da imagem
  // ====================================================
  function montarUrlImagem(caminho) {
    if (!caminho) return "";

    if (caminho.startsWith("http://") || caminho.startsWith("https://")) {
      return caminho;
    }

    return `${apiBaseUrl}${caminho}`;
  }

  const imagemAntes =
    comparacao?.antes?.imagem_url ||
    comparacao?.antes?.url ||
    comparacao?.imagem_antes ||
    null;

  const imagemDepois =
    comparacao?.depois?.imagem_url ||
    comparacao?.depois?.url ||
    comparacao?.imagem_depois ||
    null;

  return (
    <div className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm transition-colors duration-300 dark:border-slate-800 dark:bg-slate-950/70">
      <div className="space-y-5">
        <div className="space-y-2">
          <span className="inline-flex items-center gap-2 rounded-full border border-violet-200 bg-violet-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-violet-700 dark:border-violet-500/20 dark:bg-violet-500/10 dark:text-violet-300">
            <Sparkles className="h-4 w-4" />
            Comparação corporal
          </span>

          <h3 className="text-xl font-semibold text-slate-900 dark:text-white">
            {insight.title}
          </h3>

          <p className="text-sm leading-7 text-slate-600 dark:text-slate-400">
            {insight.description}
          </p>
        </div>

        {imagemAntes && imagemDepois ? (
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-3">
              <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                Antes
              </p>

              <div className="relative aspect-[4/5] overflow-hidden rounded-[24px] border border-slate-200 bg-slate-100 dark:border-slate-800 dark:bg-slate-900">
                <Image
                  src={montarUrlImagem(imagemAntes)}
                  alt="Comparação corporal - antes"
                  fill
                  className="object-cover"
                />
              </div>
            </div>

            <div className="space-y-3">
              <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                Depois
              </p>

              <div className="relative aspect-[4/5] overflow-hidden rounded-[24px] border border-slate-200 bg-slate-100 dark:border-slate-800 dark:bg-slate-900">
                <Image
                  src={montarUrlImagem(imagemDepois)}
                  alt="Comparação corporal - depois"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        ) : (
          <div className="rounded-[24px] border border-dashed border-slate-300 bg-slate-50/80 p-8 text-center transition-colors duration-300 dark:border-slate-700 dark:bg-slate-900/60">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-white shadow-sm dark:bg-slate-950">
              <Camera className="h-5 w-5 text-slate-500 dark:text-slate-400" />
            </div>

            <p className="mt-4 text-base font-semibold text-slate-900 dark:text-white">
              Ainda não há duas imagens para comparar
            </p>

            <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">
              Assim que houver ao menos uma foto inicial e outra mais recente,
              este painel vai mostrar a evolução visual automaticamente.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}