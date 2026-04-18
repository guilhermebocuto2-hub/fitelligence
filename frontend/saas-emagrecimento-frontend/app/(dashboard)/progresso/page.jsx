"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Lock, Sparkles, TrendingDown } from "lucide-react";
import { getDashboardService } from "../../../src/services/dashboardService";
import {
  getBodyComparisonService,
  uploadBodyPhotoService,
} from "../../../src/services/aiVisualService";
import EmptyState from "../../../src/components/ui/EmptyState";
import PremiumCard from "../../../src/components/ui/PremiumCard";
import SectionHeader from "../../../src/components/ui/SectionHeader";
import MobileLayout from "../../../src/components/layout/MobileLayout";

function toNumber(value, fallback = 0) {
  const n = Number(value);
  return Number.isFinite(n) ? n : fallback;
}

function formatarData(data) {
  if (!data) return "-";
  const dataObj = new Date(data);
  if (Number.isNaN(dataObj.getTime())) return "-";

  return dataObj.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

function formatarPeso(valor) {
  if (valor === null || valor === undefined || valor === "") return "-";
  return `${toNumber(valor).toFixed(1).replace(".", ",")} kg`;
}

function formatarVariacao(valor) {
  if (valor === null || valor === undefined || Number.isNaN(Number(valor))) {
    return "-";
  }

  const numero = Number(valor);
  const sinal = numero > 0 ? "-" : numero < 0 ? "+" : "";
  return `${sinal}${Math.abs(numero).toFixed(1).replace(".", ",")} kg`;
}

function clampPercent(value) {
  return Math.max(0, Math.min(100, Math.round(toNumber(value, 0))));
}

function getMensagemMotivacional({ perdaTotal, totalRegistros }) {
  if (totalRegistros === 0) {
    return "Comece hoje: o primeiro registro ja inicia sua evolucao.";
  }

  if (perdaTotal > 0) {
    return "Excelente constancia. Sua evolucao corporal esta visivel.";
  }

  if (perdaTotal < 0) {
    return "Ajuste fino no plano pode recolocar sua curva em direcao positiva.";
  }

  return "Voce manteve estabilidade. Pequenas acoes agora geram impacto.";
}

function getInsightProgresso({ perdaTotal, totalRegistros, percentualMeta }) {
  if (totalRegistros >= 5 && perdaTotal > 0) {
    return "Voce manteve consistencia nos ultimos registros e a evolucao esta dentro do esperado.";
  }

  if (percentualMeta >= 70) {
    return "Sua evolucao ja passou de 70% da meta principal. Continue no mesmo ritmo.";
  }

  if (totalRegistros < 3) {
    return "Registre mais atualizacoes para gerar insights de progresso cada vez mais precisos.";
  }

  return "Sua evolucao esta ativa. Mantenha check-ins e rotina para acelerar resultados.";
}

function montarUrlImagem(caminhoArquivo) {
  if (!caminhoArquivo) return "";
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || "";
  const normalized = String(caminhoArquivo).replace(/\\/g, "/");

  if (normalized.startsWith("http://") || normalized.startsWith("https://")) {
    return normalized;
  }

  if (normalized.startsWith("/uploads/")) {
    return `${apiBaseUrl}${normalized}`;
  }

  if (normalized.startsWith("uploads/")) {
    return `${apiBaseUrl}/${normalized}`;
  }

  const marker = normalized.indexOf("/uploads/");
  if (marker >= 0) {
    return `${apiBaseUrl}${normalized.slice(marker)}`;
  }

  return `${apiBaseUrl}/uploads/${normalized.split("/").pop()}`;
}

export default function ProgressoPage() {
  const [dashboard, setDashboard] = useState(null);
  const [comparacaoCorporal, setComparacaoCorporal] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");
  const [uploadingCorpo, setUploadingCorpo] = useState(false);
  const inputCorpoRef = useRef(null);

  useEffect(() => {
    async function carregarDados() {
      try {
        setErro("");
        setCarregando(true);

        // ==================================================
        // Carregamento paralelo:
        // - dashboard (peso/historico/meta/plano)
        // - comparacao corporal (imagens antes/depois)
        // Mantemos fallback seguro se comparacao falhar.
        // ==================================================
        const [dashboardResult, comparacaoResult] = await Promise.allSettled([
          getDashboardService(),
          getBodyComparisonService(),
        ]);

        if (dashboardResult.status !== "fulfilled") {
          throw dashboardResult.reason;
        }

        setDashboard(dashboardResult.value?.dashboard || {});

        if (comparacaoResult.status === "fulfilled") {
          setComparacaoCorporal(comparacaoResult.value?.comparacao || null);
        } else {
          console.warn("[PROGRESSO] comparacao corporal indisponivel no momento.");
          setComparacaoCorporal(null);
        }
      } catch (error) {
        console.error("Erro ao carregar progresso corporal:", error);
        setErro("Nao foi possivel carregar os registros de progresso.");
      } finally {
        setCarregando(false);
      }
    }
    carregarDados();
  }, []);

  const historicoProgresso = useMemo(() => {
    return Array.isArray(dashboard?.historico_progresso)
      ? dashboard.historico_progresso
      : [];
  }, [dashboard]);

  const usuarioPlano = useMemo(() => {
    return String(dashboard?.usuario?.plano || "free").toLowerCase();
  }, [dashboard]);
  const isPremium = usuarioPlano !== "free";

  const primeiroRegistro = useMemo(() => {
    if (!historicoProgresso.length) return null;
    return historicoProgresso[historicoProgresso.length - 1];
  }, [historicoProgresso]);

  const ultimoRegistro = useMemo(() => {
    if (!historicoProgresso.length) return null;
    return historicoProgresso[0];
  }, [historicoProgresso]);

  const pesoAtual = useMemo(() => {
    return getPesoValido(dashboard?.peso_atual, ultimoRegistro?.peso, null);
  }, [dashboard, ultimoRegistro]);

  const perdaTotal = useMemo(() => {
    const perdaFromDashboard = dashboard?.perda_total;
    if (perdaFromDashboard !== null && perdaFromDashboard !== undefined) {
      return Number(perdaFromDashboard);
    }

    const pesoInicial = getPesoValido(primeiroRegistro?.peso, null, null);
    const pesoAtualLocal = getPesoValido(ultimoRegistro?.peso, null, null);
    if (pesoInicial === null || pesoAtualLocal === null) return 0;
    return Number((pesoInicial - pesoAtualLocal).toFixed(1));
  }, [dashboard, primeiroRegistro, ultimoRegistro]);

  const percentualMeta = useMemo(() => {
    const percentualBackend = dashboard?.meta_ativa_progresso_percentual;
    if (percentualBackend !== null && percentualBackend !== undefined) {
      return clampPercent(percentualBackend);
    }

    // Fallback leve para quando nao houver meta ativa calculada.
    return clampPercent(Math.max(0, perdaTotal * 10));
  }, [dashboard, perdaTotal]);

  const mensagemMotivacional = useMemo(() => {
    return getMensagemMotivacional({
      perdaTotal,
      totalRegistros: historicoProgresso.length,
    });
  }, [perdaTotal, historicoProgresso.length]);

  const insightProgresso = useMemo(() => {
    return getInsightProgresso({
      perdaTotal,
      totalRegistros: historicoProgresso.length,
      percentualMeta,
    });
  }, [perdaTotal, historicoProgresso.length, percentualMeta]);

  const historicoExibido = useMemo(() => {
    // ==================================================
    // Base de monetizacao:
    // free ve somente parte do historico; premium ve mais.
    // Sem bloqueio de pagamento nesta etapa.
    // ==================================================
    const limite = isPremium ? 12 : 4;
    return historicoProgresso.slice(0, limite);
  }, [historicoProgresso, isPremium]);

  const houveCorteHistorico = useMemo(() => {
    return !isPremium && historicoProgresso.length > 4;
  }, [historicoProgresso.length, isPremium]);

  const imagemAntes = useMemo(() => {
    const caminho =
      comparacaoCorporal?.antes?.caminho_arquivo ||
      comparacaoCorporal?.antes?.imagem_url ||
      comparacaoCorporal?.antes?.url ||
      "";
    return montarUrlImagem(caminho);
  }, [comparacaoCorporal]);

  const imagemDepois = useMemo(() => {
    const caminho =
      comparacaoCorporal?.depois?.caminho_arquivo ||
      comparacaoCorporal?.depois?.imagem_url ||
      comparacaoCorporal?.depois?.url ||
      "";
    return montarUrlImagem(caminho);
  }, [comparacaoCorporal]);

  const possuiComparacaoCompleta = Boolean(imagemAntes && imagemDepois);

  async function handleUploadCorporal(file) {
    if (!file) return;

    try {
      setUploadingCorpo(true);
      const upload = await uploadBodyPhotoService({ file });
      const refresh = await getBodyComparisonService();

      setComparacaoCorporal(
        refresh?.comparacao || {
          antes: upload?.data?.imagem || null,
          depois: null,
          total_fotos: 1,
          timeline: upload?.data?.imagem ? [upload.data.imagem] : [],
          analise_atual: upload?.data?.analise_corporal || null,
        }
      );
    } catch (error) {
      console.error("Erro ao enviar foto corporal:", error);
    } finally {
      setUploadingCorpo(false);
    }
  }

  if (erro) {
    return (
      <PremiumCard className="border-red-200 bg-red-50" interactive={false}>
        <h1 className="text-lg font-semibold text-red-700">Erro no progresso corporal</h1>
        <p className="mt-2 text-sm text-red-600">{erro}</p>
      </PremiumCard>
    );
  }

  if (carregando) {
    return (
      <div className="space-y-4 pb-20">
        <PremiumCard className="animate-pulse">
          <div className="h-5 w-44 rounded bg-slate-200" />
          <div className="mt-3 h-10 w-48 rounded bg-slate-200" />
          <div className="mt-3 h-4 w-full rounded bg-slate-100" />
        </PremiumCard>
        <PremiumCard className="animate-pulse">
          <div className="h-5 w-36 rounded bg-slate-200" />
          <div className="mt-4 h-2 w-full rounded bg-slate-100" />
          <div className="mt-3 h-4 w-56 rounded bg-slate-100" />
        </PremiumCard>
      </div>
    );
  }

  return (
    <MobileLayout
      title="Progresso"
      subtitle="Sua evolução corporal de forma clara"
      scoreDia={dashboard?.score_dia ?? null}
      streakDias={dashboard?.streak_dias ?? null}
    >
      <div className="mx-auto w-full max-w-3xl space-y-4 sm:space-y-5">
      <PremiumCard>
        <SectionHeader
          eyebrow="IA corporal"
          title="Análise visual por foto"
          description="Registre sua evolução com foco em consistência e linguagem de bem-estar."
        />

        <input
          ref={inputCorpoRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(event) =>
            handleUploadCorporal(event.target.files?.[0] || null)
          }
        />

        <button
          type="button"
          onClick={() => inputCorpoRef.current?.click()}
          className="mt-4 w-full rounded-2xl bg-gradient-to-r from-[#7C3AED] to-[#6D28D9] px-4 py-4 text-sm font-semibold text-white shadow-lg shadow-violet-500/25"
        >
          {uploadingCorpo ? "Analisando foto..." : "Enviar foto corporal"}
        </button>

        {comparacaoCorporal?.analise_atual ? (
          <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-sm font-semibold text-slate-900">
              {comparacaoCorporal.analise_atual.resumo_visual}
            </p>
            <p className="mt-2 text-sm text-slate-600">
              Recomendacao: {comparacaoCorporal.analise_atual.recomendacao_curta}
            </p>
          </div>
        ) : null}

        <p className="text-xs text-[#9CA3AF] mt-2 px-1">* O Fitelligence oferece estimativas gerais. Não substitui orientação médica profissional.</p>
      </PremiumCard>

      {/* =================================================
          1) BLOCO FIXO — RESUMO ATUAL
          ================================================= */}
      <PremiumCard glow>
        <SectionHeader
          eyebrow="Progresso corporal"
          title="Resumo atual"
          description="Leitura rápida da sua evolução com foco em motivação diária."
        />

        <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Peso atual
            </p>
            <p className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
              {formatarPeso(pesoAtual)}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Variação
            </p>
            <p className="mt-2 text-3xl font-bold tracking-tight text-emerald-700">
              {formatarVariacao(perdaTotal)}
            </p>
          </div>
        </div>

        <p className="mt-4 text-sm leading-6 text-slate-600">{mensagemMotivacional}</p>
      </PremiumCard>

      {/* =================================================
          2) BLOCO FIXO — EVOLUCAO SIMPLES
          ================================================= */}
      <PremiumCard>
        <SectionHeader
          eyebrow="Meta de evolução"
          title="Evolução simples"
          description="Sem gráficos complexos: apenas o essencial para foco diário."
        />

        <div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-slate-100">
          <div
            className="h-full rounded-full bg-emerald-500 transition-all duration-300"
            style={{ width: `${percentualMeta}%` }}
          />
        </div>

        <p className="mt-3 text-sm font-medium text-slate-700">
          Voce ja evoluiu <span className="font-semibold text-emerald-700">{percentualMeta}%</span> da sua meta.
        </p>
      </PremiumCard>

      {/* =================================================
          3) BLOCO FIXO — COMPARACAO CORPORAL (ANTES/DEPOIS)
          FREE: visual limitado + bloqueio premium
          PREMIUM: comparacao completa lado a lado
          ================================================= */}
      <PremiumCard>
        <SectionHeader
          eyebrow="Comparação corporal"
          title="Antes e depois"
          description="Percepção visual da sua evolução com estrutura pronta para monetização."
        />

        {!possuiComparacaoCompleta ? (
          <EmptyState
            title="Comparação ainda indisponível"
            description="Envie ao menos duas fotos corporais para liberar a comparação visual."
            className="mt-4 min-h-[160px] rounded-2xl"
          />
        ) : isPremium ? (
          <div className="mt-4 grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Antes</p>
              <div className="relative aspect-[4/5] overflow-hidden rounded-2xl border border-slate-200 bg-slate-100">
                <Image src={imagemAntes} alt="Comparacao corporal antes" fill className="object-cover" />
              </div>
            </div>
            <div className="space-y-2">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Depois</p>
              <div className="relative aspect-[4/5] overflow-hidden rounded-2xl border border-slate-200 bg-slate-100">
                <Image src={imagemDepois} alt="Comparacao corporal depois" fill className="object-cover" />
              </div>
            </div>
          </div>
        ) : (
          <div className="mt-4 grid grid-cols-1 gap-3">
            {/* FREE mostra apenas uma visualizacao limitada */}
            <div className="space-y-2">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Visualização free</p>
              <div className="relative aspect-[4/5] overflow-hidden rounded-2xl border border-slate-200 bg-slate-100">
                <Image src={imagemAntes} alt="Comparacao corporal limitada no plano free" fill className="object-cover" />
              </div>
            </div>

            {/* Overlay premium para preparar monetizacao sem implementar pagamento */}
            <div className="rounded-2xl border border-violet-200 bg-gradient-to-br from-violet-50 via-white to-indigo-50 p-4">
              <div className="flex items-start gap-3">
                <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-violet-100 text-violet-700">
                  <Lock className="h-4 w-4" />
                </span>
                <div>
                  <p className="text-sm font-semibold text-slate-900">
                    Desbloqueie análise completa no plano premium
                  </p>
                  <p className="mt-1 text-xs leading-5 text-slate-600">
                    Compare antes e depois lado a lado e acompanhe todo o histórico visual da evolução corporal.
                  </p>
                  <Link
                    href="/premium"
                    className="mt-3 inline-flex items-center rounded-xl bg-slate-900 px-3 py-2 text-xs font-semibold text-white transition hover:bg-slate-800 active:scale-[0.98]"
                  >
                    Ver Premium
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}
      </PremiumCard>

      {/* =================================================
          4) BLOCO FIXO — HISTORICO DE PESO
          ================================================= */}
      <PremiumCard>
        <SectionHeader
          eyebrow="Histórico"
          title="Últimas atualizações de peso"
          description="Lista simples para leitura rápida, sem gráficos pesados."
        />

        {historicoExibido.length === 0 ? (
          <EmptyState
            title="Nenhum registro de progresso"
            description="Assim que houver atualizações de peso, elas aparecerão aqui."
            className="mt-4 min-h-[160px] rounded-2xl"
          />
        ) : (
          <div className="mt-4 space-y-2">
            {historicoExibido.map((registro, index) => (
              <div
                key={registro.id || index}
                className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3"
              >
                <div>
                  <p className="text-sm font-semibold text-slate-900">
                    {formatarPeso(registro.peso)}
                  </p>
                  <p className="text-xs text-slate-500">
                    {formatarData(registro.data_registro || registro.criado_em)}
                  </p>
                </div>
                <span className="inline-flex items-center gap-1 rounded-full bg-white px-2.5 py-1 text-[11px] font-semibold text-slate-500">
                  #{registro.id || index + 1}
                </span>
              </div>
            ))}
          </div>
        )}

        {houveCorteHistorico ? (
          <div className="mt-3 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3">
            <p className="text-xs font-semibold uppercase tracking-wide text-amber-700">Plano free</p>
            <p className="mt-1 text-xs leading-5 text-amber-700">
              Desbloqueie análise completa no plano premium para ver todo o histórico de progresso.
            </p>
          </div>
        ) : null}
      </PremiumCard>

      {/* =================================================
          5) BLOCO FIXO — INSIGHT DE PROGRESSO
          ================================================= */}
      <PremiumCard>
        <SectionHeader
          eyebrow="Insight inteligente"
          title="Leitura de progresso"
          description="Frase curta para reforcar clareza e motivacao da jornada."
        />
        <div className="mt-4 rounded-2xl border border-emerald-200 bg-emerald-50 p-4">
          <div className="flex items-start gap-3">
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
              {perdaTotal > 0 ? <TrendingDown className="h-4 w-4" /> : <Sparkles className="h-4 w-4" />}
            </span>
            <p className="text-sm leading-6 text-emerald-800">{insightProgresso}</p>
          </div>
        </div>
      </PremiumCard>
      </div>
    </MobileLayout>
  );
}

function getPesoValido(...valores) {
  for (const valor of valores) {
    if (valor === null || valor === undefined || valor === "") continue;
    const n = Number(valor);
    if (Number.isFinite(n)) return n;
  }
  return null;
}
