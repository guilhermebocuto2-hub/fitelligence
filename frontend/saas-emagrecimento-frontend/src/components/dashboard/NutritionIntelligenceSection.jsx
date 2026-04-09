"use client";

// ======================================================
// NutritionIntelligenceSection
// Responsavel por:
// - agrupar a camada alimentar/IA em uma secao unica
// - manter coesao visual entre score, analise, resumo e timeline
// - reutilizar componentes existentes sem duplicar logica
// ======================================================

import FoodIntelligenceCarousel from "./FoodIntelligenceCarousel";
import FoodAnalysisPanel from "./FoodAnalysisPanel";
import FoodSmartSummaryPanel from "./FoodSmartSummaryPanel";
import FoodTimelinePanel from "./FoodTimelinePanel";

export default function NutritionIntelligenceSection({
  dashboardData,
  ultimaAnaliseRefeicao,
  insightAlimentar,
  resumoAlimentarDashboard,
  historicoRefeicoes,
}) {
  return (
    <div className="space-y-5">
      <FoodIntelligenceCarousel dashboard={dashboardData || {}} />
      <FoodAnalysisPanel
        analise={ultimaAnaliseRefeicao}
        insight={insightAlimentar}
      />
      <FoodSmartSummaryPanel resumo={resumoAlimentarDashboard} />
      <FoodTimelinePanel refeicoes={historicoRefeicoes} />
    </div>
  );
}

