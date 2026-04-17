"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { getDashboardService } from "../../../src/services/dashboardService";
import {
  listMealAnalysesService,
  uploadMealPhotoService,
} from "../../../src/services/aiVisualService";
import EmptyState from "../../../src/components/ui/EmptyState";
import PremiumCard from "../../../src/components/ui/PremiumCard";
import SectionHeader from "../../../src/components/ui/SectionHeader";
import WellnessDisclaimer from "../../../src/components/ui/WellnessDisclaimer";
import MobileLayout from "../../../src/components/layout/MobileLayout";

// ======================================================
// TODO: migrar rota para /alimentacao no futuro.
// Nesta etapa mantemos /plano-alimentar por compatibilidade.
// ======================================================

const PERIODOS_TIMELINE = [
  { key: "cafe_da_manha", label: "Cafe da manha" },
  { key: "almoco", label: "Almoco" },
  { key: "jantar", label: "Jantar" },
  { key: "lanche", label: "Lanches" },
];

function getFirstFilled(...values) {
  return values.find(
    (value) => value !== null && value !== undefined && value !== ""
  );
}

function toNumber(value, fallback = 0) {
  const n = Number(value);
  return Number.isFinite(n) ? n : fallback;
}

function formatCalorias(value) {
  return `${Math.round(toNumber(value, 0))} kcal`;
}

function normalizeTipoRefeicao(value) {
  const raw = String(value || "")
    .toLowerCase()
    .trim();

  if (raw.includes("cafe")) return "cafe_da_manha";
  if (raw.includes("almoco") || raw.includes("almoço")) return "almoco";
  if (raw.includes("jantar")) return "jantar";
  if (raw.includes("lanche")) return "lanche";
  return "lanche";
}

function getStatusDoDia(percentual) {
  if (percentual >= 100) return "Meta diaria atingida. Mantenha escolhas equilibradas.";
  if (percentual >= 75) return "Dia bem encaminhado. Continue no mesmo ritmo.";
  if (percentual >= 40) return "Bom inicio de dia. Ainda ha espaco para evoluir.";
  return "Comece registrando refeições para ativar insights mais precisos.";
}

function CardRefeicao({ refeicao }) {
  const titulo = refeicao?.descricao || "Refeição sem descricao";
  const classificacao = refeicao?.classificacao || "Sem classificacao";
  const calorias = toNumber(refeicao?.calorias_estimadas, 0);
  const proteinas = toNumber(refeicao?.proteinas, 0);
  const carboidratos = toNumber(refeicao?.carboidratos, 0);
  const gorduras = toNumber(refeicao?.gorduras, 0);

  return (
    <article
      className="
        group rounded-2xl border border-slate-200 bg-white p-4
        shadow-sm transition-all duration-200
        hover:-translate-y-0.5 hover:shadow-md
        active:scale-[0.98]
      "
    >
      {/* Fallback visual de imagem para manter layout estável quando não houver foto */}
      <div className="mb-3 flex h-28 w-full items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-xs font-semibold uppercase tracking-wide text-slate-400">
        {refeicao?.imagem_url ? "Imagem da refeição" : "Sem imagem"}
      </div>

      <h3 className="truncate text-sm font-semibold text-slate-900">{titulo}</h3>

      <p className="mt-1 truncate text-xs text-slate-500">
        {classificacao}
      </p>

      <div className="mt-3 grid grid-cols-2 gap-2 text-xs text-slate-600">
        <p>{formatCalorias(calorias)}</p>
        <p>{proteinas}g prot.</p>
        <p>{carboidratos}g carb.</p>
        <p>{gorduras}g gord.</p>
      </div>
    </article>
  );
}

export default function PlanoAlimentarPage() {
  const [dashboard, setDashboard] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");
  const [feedbackAcao, setFeedbackAcao] = useState("");
  const [analisesIA, setAnalisesIA] = useState([]);
  const [uploadingIA, setUploadingIA] = useState(false);
  const inputRefeicaoRef = useRef(null);

  useEffect(() => {
    async function carregarDados() {
      try {
        setCarregando(true);
        setErro("");
        setFeedbackAcao("");

        const [resposta, analisesResposta] = await Promise.all([
          getDashboardService(),
          listMealAnalysesService().catch(() => ({ analises: [] })),
        ]);

        setDashboard(resposta?.dashboard || {});
        setAnalisesIA(analisesResposta?.analises || []);
      } catch (error) {
        console.error("Erro ao carregar plano alimentar:", error);
        setErro("Nao foi possivel carregar a area de alimentação.");
      } finally {
        setCarregando(false);
      }
    }

    carregarDados();
  }, []);

  // ====================================================
  // Memorizacao defensiva para reduzir recomputacao
  // em cada render (performance leve e segura).
  // ====================================================
  const resumoAlimentar = useMemo(() => {
    return (
      dashboard?.resumo_alimentar_dashboard ||
      dashboard?.resumo_alimentar_inteligente ||
      dashboard?.resumo_alimentar ||
      {}
    );
  }, [dashboard]);

  const historicoRefeicoes = useMemo(() => {
    if (Array.isArray(dashboard?.historico_refeicoes)) {
      return dashboard.historico_refeicoes;
    }
    if (Array.isArray(dashboard?.ultimas_refeicoes)) {
      return dashboard.ultimas_refeicoes;
    }
    return [];
  }, [dashboard]);

  const metaDiaria = useMemo(() => {
    return toNumber(
      getFirstFilled(dashboard?.ultimo_plano?.calorias, dashboard?.meta_calorica_diaria),
      0
    );
  }, [dashboard]);

  const caloriasConsumidas = useMemo(() => {
    return toNumber(
      getFirstFilled(
        dashboard?.calorias_consumidas_hoje,
        resumoAlimentar?.calorias_consumidas_hoje,
        dashboard?.resumo_nutricional?.total_calorias,
        dashboard?.media_calorias_refeicoes
      ),
      0
    );
  }, [dashboard, resumoAlimentar]);

  const percentualMeta = useMemo(() => {
    if (metaDiaria <= 0) return 0;
    return Math.max(
      0,
      Math.min(100, Math.round((caloriasConsumidas / metaDiaria) * 100))
    );
  }, [caloriasConsumidas, metaDiaria]);

  const statusDoDia = useMemo(() => getStatusDoDia(percentualMeta), [percentualMeta]);

  const insightCurtoIA = useMemo(() => {
    // TODO: insights avancados como feature premium.
    return (
      getFirstFilled(
        dashboard?.insight_alimentar?.recommendation,
        dashboard?.insight_alimentar?.summary,
        resumoAlimentar?.recomendacao,
        resumoAlimentar?.texto,
        dashboard?.resumo_alimentar_inteligente?.recomendacao
      ) ||
      "Continue registrando refeições para melhorar a precisao da análise."
    );
  }, [dashboard, resumoAlimentar]);

  const timeline = useMemo(() => {
    const base = {
      cafe_da_manha: [],
      almoco: [],
      jantar: [],
      lanche: [],
    };

    historicoRefeicoes.forEach((item) => {
      const secao = normalizeTipoRefeicao(item?.tipo_refeicao);
      base[secao].push(item);
    });

    return base;
  }, [historicoRefeicoes]);

  async function handleUploadRefeicao(file) {
    if (!file) return;

    try {
      setUploadingIA(true);
      const resposta = await uploadMealPhotoService({ file });
      const analiseCriada = resposta?.data?.analise || null;

      setAnalisesIA((current) => [analiseCriada, ...current].filter(Boolean));
      setFeedbackAcao("Foto enviada e analisada com sucesso.");
    } catch (error) {
      setFeedbackAcao(
        error?.message || "Nao foi possivel analisar a refeição agora."
      );
    } finally {
      setUploadingIA(false);
    }
  }

  if (carregando) {
    return (
      <div className="space-y-4 pb-20">
        <PremiumCard className="animate-pulse">
          <div className="h-6 w-40 rounded bg-slate-200" />
          <div className="mt-4 h-9 w-56 rounded bg-slate-200" />
          <div className="mt-3 h-3 w-full rounded bg-slate-100" />
        </PremiumCard>
        <PremiumCard className="animate-pulse">
          <div className="h-6 w-32 rounded bg-slate-200" />
          <div className="mt-4 h-11 w-full rounded bg-slate-100" />
        </PremiumCard>
      </div>
    );
  }

  if (erro) {
    return (
      <PremiumCard className="border-red-200 bg-red-50" interactive={false}>
        <h1 className="text-lg font-semibold text-red-700">Erro na alimentação</h1>
        <p className="mt-2 text-sm text-red-600">{erro}</p>
      </PremiumCard>
    );
  }

  return (
    <MobileLayout
      title="Plano"
      subtitle="Sua alimentação organizada para hoje"
      scoreDia={dashboard?.score_dia ?? null}
      streakDias={dashboard?.streak_dias ?? null}
    >
      <div className="mx-auto w-full max-w-3xl space-y-4 sm:space-y-5">
      {/* =================================================
          BLOCO FIXO — RESUMO ALIMENTAR DO DIA
          Mantem leitura critica no topo com progresso simples.
         ================================================= */}
      <PremiumCard glow>
        <SectionHeader
          eyebrow="Alimentacao do dia"
          title="Resumo alimentar"
          description="Leitura rapida para manter consistência diaria sem poluição visual."
        />

        <div className="mt-5">
          <div className="flex items-end justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Consumidas
              </p>
              <p className="mt-1 text-3xl font-bold tracking-tight text-slate-900">
                {formatCalorias(caloriasConsumidas)}
              </p>
            </div>
            <div className="text-right">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Meta diaria
              </p>
              <p className="mt-1 text-lg font-semibold text-slate-900">
                {metaDiaria > 0 ? formatCalorias(metaDiaria) : "Nao definida"}
              </p>
            </div>
          </div>

          <div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-slate-100">
            <div
              className="h-full rounded-full bg-emerald-500 transition-all duration-300"
              style={{ width: `${percentualMeta}%` }}
            />
          </div>

          <p className="mt-3 text-sm leading-6 text-slate-600">{statusDoDia}</p>
        </div>
      </PremiumCard>

      {/* =================================================
          BLOCO FIXO — ACAO PRINCIPAL
          Botao unico com funcao preparada para evolucao futura.
         ================================================= */}
      <PremiumCard>
        <SectionHeader
          eyebrow="IA por foto"
          title="Análise visual da refeição"
          description="Upload rapido com leitura nutricional curta e próximo passo prático."
        />

        <input
          ref={inputRefeicaoRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(event) =>
            handleUploadRefeicao(event.target.files?.[0] || null)
          }
        />

        <button
          type="button"
          onClick={() => inputRefeicaoRef.current?.click()}
          className="mt-4 inline-flex w-full items-center justify-center rounded-2xl bg-gradient-to-r from-[#7C3AED] to-[#6D28D9] px-4 py-4 text-sm font-semibold text-white shadow-lg shadow-violet-500/25 transition-all duration-200 active:scale-[0.97]"
        >
          {uploadingIA ? "Analisando refeição..." : "Enviar foto da refeição"}
        </button>

        {feedbackAcao ? (
          // ==================================================
          // Feedback visual leve da acao principal.
          // Segue o padrao de feedback amigavel usado no check-in.
          // ==================================================
          <div className="mt-3 rounded-2xl border border-emerald-200/80 bg-gradient-to-br from-emerald-50 via-white to-cyan-50 px-4 py-3">
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-emerald-700">
              Próximo passo
            </p>
            <p className="mt-1 text-sm leading-6 text-slate-700">{feedbackAcao}</p>
          </div>
        ) : null}

        {analisesIA[0] ? (
          <div className="mt-4 rounded-2xl border border-emerald-200 bg-emerald-50 p-4">
            <p className="text-sm font-semibold text-slate-900">
              {analisesIA[0].classificacao || "Análise gerada"}
            </p>
            <p className="mt-1 text-sm text-slate-700">
              {analisesIA[0].observacoes ||
                "Leitura nutricional concluida com sucesso."}
            </p>
            <p className="mt-2 text-sm text-emerald-800">
              Próximo passo:{" "}
              {analisesIA[0].sugestao_proximo_passo ||
                "Continue registrando para melhorar a leitura do dia."}
            </p>
          </div>
        ) : null}

        <WellnessDisclaimer className="mt-4" />
      </PremiumCard>

      {/* =================================================
          BLOCO FIXO/LISTA — TIMELINE DO DIA
          Estrutura simples por periodos para leitura rapida.
         ================================================= */}
      <PremiumCard>
        <SectionHeader
          eyebrow="Timeline"
          title="Refeições do dia"
          description="Organizacao clara por periodo para facilitar acompanhamento diario."
        />

        {/* TODO: limitar histórico completo no plano free */}
        <div className="mt-4 space-y-4">
          {PERIODOS_TIMELINE.map((periodo) => {
            const itens = timeline[periodo.key] || [];
            return (
              <section
                key={periodo.key}
                className="rounded-2xl border border-slate-200 bg-slate-50 p-3"
              >
                <div className="mb-3 flex items-center justify-between gap-3">
                  <h3 className="text-sm font-semibold text-slate-900">{periodo.label}</h3>
                  <span className="rounded-full bg-white px-2.5 py-1 text-xs font-semibold text-slate-500">
                    {itens.length}
                  </span>
                </div>

                {itens.length === 0 ? (
                  <div className="rounded-xl border border-dashed border-slate-300 bg-white px-3 py-4 text-xs text-slate-500">
                    Sem registro neste periodo
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    {itens.slice(0, 4).map((refeicao, index) => (
                      <CardRefeicao
                        key={refeicao.id || `${periodo.key}-${index}`}
                        refeicao={refeicao}
                      />
                    ))}
                  </div>
                )}
              </section>
            );
          })}
        </div>
      </PremiumCard>

      {/* =================================================
          BLOCO FIXO — INSIGHT CURTO DE IA
          Sempre exibimos mensagem util com fallback forte.
         ================================================= */}
      <PremiumCard>
        <SectionHeader
          eyebrow="Insight inteligente"
          title="Leitura de IA"
          description="Resumo curto para orientar sua próxima decisao alimentar."
        />
        <div className="mt-4 rounded-2xl border border-emerald-200 bg-emerald-50 p-4">
          {/* TODO: insights avancados como feature premium */}
          <p className="text-sm font-medium leading-6 text-emerald-800">
            {insightCurtoIA}
          </p>
        </div>
      </PremiumCard>

      {/* =================================================
          BLOCO FIXO — PLANO DO DIA
          Mantem a orientação nutricional essencial sem excesso.
         ================================================= */}
      <PremiumCard>
        <SectionHeader
          eyebrow="Plano do dia"
          title="Orientacao nutricional"
          description="Direcionamento simples para manter foco e consistência."
        />

        {dashboard?.ultimo_plano?.dieta ? (
          <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <p className="whitespace-pre-line text-sm leading-6 text-slate-700">
              {dashboard.ultimo_plano.dieta}
            </p>
          </div>
        ) : (
          <EmptyState
            title="Nenhum plano alimentar encontrado"
            description="Assim que existir um plano no backend, ele sera exibido aqui."
            className="mt-4 min-h-[140px] rounded-2xl"
          />
        )}
      </PremiumCard>
      </div>
    </MobileLayout>
  );
}
