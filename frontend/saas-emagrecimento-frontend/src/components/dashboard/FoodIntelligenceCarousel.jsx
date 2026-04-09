"use client";

// ======================================================
// FoodIntelligenceCarousel
// Responsavel por:
// - extrair dados alimentares de multiplos formatos do dashboard
// - manter compatibilidade com payloads legados/canonicos
// - renderizar carrossel horizontal premium
// - mostrar EmptyState quando nao houver dados
// ======================================================

import SectionHeader from "../ui/SectionHeader";
import HorizontalCarousel from "../ui/HorizontalCarousel";
import EmptyState from "../ui/EmptyState";
import PremiumCard from "../ui/PremiumCard";
import FoodIntelligenceCard from "./FoodIntelligenceCard";

function isFilled(value) {
  return value !== null && value !== undefined && value !== "";
}

function getFirstFilled(...values) {
  // Retorna o primeiro valor valido para suportar formatos diferentes.
  return values.find(isFilled);
}

function toOneDecimal(value) {
  const n = Number(value);
  if (Number.isNaN(n)) return value;
  return Number.isInteger(n) ? n : n.toFixed(1);
}

export default function FoodIntelligenceCarousel({ dashboard }) {
  const safeDashboard = dashboard || {};

  // ====================================================
  // Extracao segura em camadas:
  // 1) raiz do dashboard
  // 2) resumo_alimentar
  // 3) resumo_alimentar_inteligente
  // 4) resumo_alimentar_dashboard (compatibilidade extra)
  // ====================================================
  const resumoAlimentar = safeDashboard?.resumo_alimentar || {};
  const resumoAlimentarInteligente =
    safeDashboard?.resumo_alimentar_inteligente || {};
  const resumoAlimentarDashboard =
    safeDashboard?.resumo_alimentar_dashboard || {};

  const scoreAlimentar = getFirstFilled(
    safeDashboard?.score_alimentar,
    resumoAlimentar?.score_alimentar,
    resumoAlimentarInteligente?.score_alimentar,
    resumoAlimentarDashboard?.score_alimentar,
    resumoAlimentarDashboard?.score
  );

  const caloriasMedias = getFirstFilled(
    safeDashboard?.calorias_medias,
    resumoAlimentar?.calorias_medias,
    resumoAlimentarInteligente?.calorias_medias,
    resumoAlimentarDashboard?.calorias_medias
  );

  const proteinaMedia = getFirstFilled(
    safeDashboard?.proteina_media,
    resumoAlimentar?.proteina_media,
    resumoAlimentarInteligente?.proteina_media,
    resumoAlimentarDashboard?.proteina_media
  );

  const classificacaoPredominante = getFirstFilled(
    safeDashboard?.classificacao_predominante,
    resumoAlimentar?.classificacao_predominante,
    resumoAlimentarInteligente?.classificacao_predominante,
    resumoAlimentarDashboard?.classificacao_predominante,
    resumoAlimentarDashboard?.padrao_predominante
  );

  const hasAnyData =
    isFilled(scoreAlimentar) ||
    isFilled(caloriasMedias) ||
    isFilled(proteinaMedia) ||
    isFilled(classificacaoPredominante);

  return (
    <PremiumCard>
      <SectionHeader
        eyebrow="IA alimentar"
        title="Resumo inteligente da alimentacao"
        description="Leitura rapida das metricas alimentares para decisao no dia a dia."
      />

      <div className="mt-4 sm:mt-5">
        {!hasAnyData ? (
          <EmptyState
            title="Sem dados alimentares ainda"
            description="Assim que houver analises da IA alimentar, os indicadores aparecerao aqui."
            className="min-h-[180px] rounded-2xl"
          />
        ) : (
          <HorizontalCarousel
            ariaLabel="Carrossel de inteligencia alimentar"
            itemClassName="min-w-[78%] sm:min-w-[320px] lg:min-w-[280px]"
          >
            <FoodIntelligenceCard
              type="score"
              title="Score alimentar"
              value={toOneDecimal(scoreAlimentar)}
              suffix="%"
              helper="Qualidade consolidada da alimentacao recente."
            />

            <FoodIntelligenceCard
              type="calorias"
              title="Calorias medias"
              value={toOneDecimal(caloriasMedias)}
              suffix="kcal"
              helper="Media energetica das refeicoes analisadas."
            />

            <FoodIntelligenceCard
              type="proteina"
              title="Proteina media"
              value={toOneDecimal(proteinaMedia)}
              suffix="g"
              helper="Media proteica para suporte de composicao corporal."
            />

            <FoodIntelligenceCard
              type="classificacao"
              title="Classificacao predominante"
              value={classificacaoPredominante}
              helper="Padrao alimentar principal identificado pela IA."
            />
          </HorizontalCarousel>
        )}
      </div>
    </PremiumCard>
  );
}

