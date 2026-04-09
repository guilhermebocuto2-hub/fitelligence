"use client";

// ======================================================
// GoalsAndProgressSection
// Responsavel por:
// - consolidar meta principal + formulario de progresso
// - manter os mesmos handlers e dados da pagina principal
// - preservar comportamento atual sem alterar regras de negocio
// ======================================================

import { CalendarDays, Target } from "lucide-react";
import PremiumPanel from "./PremiumPanel";
import StatusBadge from "./StatusBadge";
import InsightsPanel from "./InsightsPanel";

export default function GoalsAndProgressSection({
  metaAtiva,
  textoMetaPrincipal,
  formatarData,
  pesoAtual,
  progressoMetaPercentual,
  handleSubmit,
  form,
  handleChange,
  saving,
  setForm,
  dashboardPersonalization,
  perdaTotal,
  statusEvolucao,
  pesoInicial,
  cinturaAtual,
  dashboardInsights,
  isPremium,
}) {
  return (
    <div className="space-y-5">
      <PremiumPanel
        title="Meta principal da jornada"
        description="Leitura rapida da meta ativa mais importante do usuario e do progresso atual em relacao a ela."
      >
        <div className="flex gap-4 overflow-x-auto pb-2 lg:grid lg:grid-cols-[1.1fr_0.9fr] lg:overflow-visible">
          <div className="min-w-[88%] flex-shrink-0 rounded-3xl border border-slate-200 bg-slate-50/80 p-5 transition-colors duration-300 dark:border-slate-800 dark:bg-slate-900/80 lg:min-w-0">
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-2">
                <div className="inline-flex items-center gap-2 rounded-full border border-violet-200 bg-violet-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-violet-700 dark:border-violet-900/50 dark:bg-violet-950/40 dark:text-violet-200">
                  <Target className="h-3.5 w-3.5" />
                  Meta ativa
                </div>

                <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                  {metaAtiva?.descricao || "Nenhuma meta ativa no momento"}
                </h3>

                <p className="text-sm leading-7 text-slate-600 dark:text-slate-400">
                  {textoMetaPrincipal}
                </p>
              </div>

              <StatusBadge variant={metaAtiva ? "success" : "neutral"}>
                {metaAtiva ? "Ativa" : "Sem meta"}
              </StatusBadge>
            </div>

            <div className="mt-5 grid gap-3 sm:grid-cols-3">
              <div className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-950/70">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">
                  Peso atual
                </p>
                <p className="mt-2 text-xl font-semibold text-slate-900 dark:text-white">
                  {pesoAtual ? `${pesoAtual.toFixed(1)} kg` : "--"}
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-950/70">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">
                  Meta
                </p>
                <p className="mt-2 text-xl font-semibold text-slate-900 dark:text-white">
                  {metaAtiva?.valor_meta
                    ? `${Number(metaAtiva.valor_meta).toFixed(1)}`
                    : "--"}
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-950/70">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">
                  Inicio
                </p>
                <p className="mt-2 text-xl font-semibold text-slate-900 dark:text-white">
                  {formatarData(metaAtiva?.data_inicio || metaAtiva?.criado_em)}
                </p>
              </div>
            </div>
          </div>

          <div className="min-w-[88%] flex-shrink-0 rounded-3xl border border-slate-200 bg-white p-5 transition-colors duration-300 dark:border-slate-800 dark:bg-slate-950/80 lg:min-w-0">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">
              Progresso da meta
            </p>

            <div className="mt-3 flex items-end gap-3">
              <span className="text-4xl font-bold tracking-tight text-slate-900 dark:text-white">
                {progressoMetaPercentual}%
              </span>

              <span className="pb-1 text-sm text-slate-500 dark:text-slate-400">
                concluido
              </span>
            </div>

            <div className="mt-5 h-3 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800">
              <div
                className="h-full rounded-full bg-gradient-to-r from-violet-600 to-indigo-600 transition-all duration-500"
                style={{
                  width: `${Math.max(0, Math.min(100, progressoMetaPercentual))}%`,
                }}
              />
            </div>

            <p className="mt-4 text-sm leading-7 text-slate-600 dark:text-slate-400">
              {metaAtiva
                ? "Esse percentual considera a meta ativa principal e o progresso corporal disponivel ate agora."
                : "Assim que existir uma meta ativa, este painel mostrara a evolucao de forma automatica."}
            </p>
          </div>
        </div>
      </PremiumPanel>

      <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
        <PremiumPanel
          title="Novo registro de progresso"
          description="Adicione um novo ponto de evolucao para tornar a leitura da jornada mais precisa e confiavel."
        >
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                Peso atual (kg)
              </label>
              <input
                type="number"
                step="0.1"
                name="peso"
                value={form.peso}
                onChange={handleChange}
                placeholder="Ex.: 81.9"
                className="h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm text-slate-700 outline-none transition-all duration-300 placeholder:text-slate-400 focus:border-violet-400 focus:ring-4 focus:ring-violet-500/10 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 dark:placeholder:text-slate-500 dark:focus:border-violet-500"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                Cintura (cm)
              </label>
              <input
                type="number"
                step="0.1"
                name="cintura"
                value={form.cintura}
                onChange={handleChange}
                placeholder="Ex.: 91.0"
                className="h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm text-slate-700 outline-none transition-all duration-300 placeholder:text-slate-400 focus:border-violet-400 focus:ring-4 focus:ring-violet-500/10 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 dark:placeholder:text-slate-500 dark:focus:border-violet-500"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                Data do registro
              </label>
              <div className="relative">
                <CalendarDays className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  type="date"
                  name="data_registro"
                  value={form.data_registro}
                  onChange={handleChange}
                  className="h-12 w-full rounded-2xl border border-slate-200 bg-white pl-11 pr-4 text-sm text-slate-700 outline-none transition-all duration-300 focus:border-violet-400 focus:ring-4 focus:ring-violet-500/10 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 dark:focus:border-violet-500"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                Observacoes
              </label>
              <textarea
                name="observacao"
                value={form.observacao}
                onChange={handleChange}
                placeholder="Ex.: Treinei 3x na semana, mantive boa alimentacao e dormi melhor."
                className="min-h-[120px] w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none transition-all duration-300 placeholder:text-slate-400 focus:border-violet-400 focus:ring-4 focus:ring-violet-500/10 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 dark:placeholder:text-slate-500 dark:focus:border-violet-500"
              />
            </div>

            <div className="flex flex-col gap-3 pt-2 sm:flex-row">
              <button
                type="submit"
                disabled={saving}
                className="inline-flex items-center justify-center rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-violet-500/20 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-70"
              >
                {saving ? "Salvando..." : dashboardPersonalization.primaryCta}
              </button>

              <button
                type="button"
                onClick={() =>
                  setForm({
                    peso: "",
                    cintura: "",
                    observacao: "",
                    data_registro: "",
                  })
                }
                className="inline-flex items-center justify-center rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md dark:border-slate-800 dark:bg-slate-950/70 dark:text-slate-200 dark:hover:border-slate-700 dark:hover:bg-slate-900"
              >
                Limpar campos
              </button>
            </div>
          </form>
        </PremiumPanel>

        <PremiumPanel
          title="Leitura estrategica da evolucao"
          description="Resumo executivo dos dados corporais mais recentes para orientar decisoes, ajustes e intervencoes."
        >
          <div className="space-y-4">
            <div className="rounded-3xl border border-slate-200 bg-slate-50/80 p-4 transition-colors duration-300 dark:border-slate-800 dark:bg-slate-900/80">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">
                    Status da evolucao
                  </p>
                  <h3 className="mt-2 text-lg font-semibold text-slate-900 dark:text-white">
                    {perdaTotal > 0
                      ? "Trajetoria positiva identificada"
                      : perdaTotal < 0
                        ? "Oscilacao detectada"
                        : "Base inicial de acompanhamento"}
                  </h3>
                </div>

                <StatusBadge variant={statusEvolucao}>
                  {perdaTotal > 0
                    ? "Evolucao"
                    : perdaTotal < 0
                      ? "Atencao"
                      : "Neutro"}
                </StatusBadge>
              </div>

              <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-400">
                {perdaTotal > 0
                  ? `Foi identificada uma reducao acumulada de ${perdaTotal.toFixed(1)} kg entre os registros disponiveis.`
                  : perdaTotal < 0
                    ? "O peso atual esta acima da primeira base encontrada. Vale revisar consistencia, habitos e frequencia de acompanhamento."
                    : "Ainda ha poucos dados para leitura evolutiva comparativa."}
              </p>

              <div className="mt-5 grid gap-3 sm:grid-cols-3">
                <div className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-950/70">
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">
                    Peso inicial
                  </p>
                  <p className="mt-2 text-2xl font-semibold text-slate-900 dark:text-white">
                    {pesoInicial ? `${pesoInicial.toFixed(1)} kg` : "--"}
                  </p>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-950/70">
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">
                    Peso atual
                  </p>
                  <p className="mt-2 text-2xl font-semibold text-slate-900 dark:text-white">
                    {pesoAtual ? `${pesoAtual.toFixed(1)} kg` : "--"}
                  </p>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-950/70">
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">
                    Cintura atual
                  </p>
                  <p className="mt-2 text-2xl font-semibold text-slate-900 dark:text-white">
                    {cinturaAtual ? `${cinturaAtual.toFixed(1)} cm` : "--"}
                  </p>
                </div>
              </div>
            </div>

            <InsightsPanel insights={dashboardInsights} isPremium={isPremium} />
          </div>
        </PremiumPanel>
      </div>
    </div>
  );
}

