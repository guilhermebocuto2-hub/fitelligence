"use client";

// ======================================================
// DailyOverview
// Responsavel por:
// - renderizar os indicadores principais do dia
// - priorizar leitura mobile com carrossel horizontal
// - reutilizar os paineis existentes de score e notificacoes
// ======================================================

import PremiumCard from "../ui/PremiumCard";
import SectionHeader from "../ui/SectionHeader";
import HorizontalCarousel from "../ui/HorizontalCarousel";
import ScoreGlobalPanel from "./ScoreGlobalPanel";
import SmartNotificationsPanel from "./SmartNotificationsPanel";

export default function DailyOverview({ scoreGlobal, notificacoesInteligentes }) {
  return (
    <PremiumCard>
      <SectionHeader
        eyebrow="Visao geral"
        title="Resumo do dia"
        description="Acompanhe score global e notificacoes inteligentes em navegacao horizontal."
      />

      <div className="mt-4 sm:mt-5">
        <HorizontalCarousel
          ariaLabel="Metricas principais do dashboard"
          itemClassName="min-w-[92%] sm:min-w-[520px] lg:min-w-[48%]"
        >
          <ScoreGlobalPanel data={scoreGlobal} />
          <SmartNotificationsPanel notificacoes={notificacoesInteligentes} />
        </HorizontalCarousel>
      </div>
    </PremiumCard>
  );
}

