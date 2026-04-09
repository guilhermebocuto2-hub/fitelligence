"use client";

// ======================================================
// HealthGrid
// Responsavel por:
// - concentrar os modulos principais do dashboard
// - delegar priorizacao para o componente DashboardModules
// - manter consistencia visual entre mobile e desktop
// ======================================================

import PremiumCard from "../ui/PremiumCard";
import SectionHeader from "../ui/SectionHeader";
import DashboardModules from "./DashboardModules";

export default function HealthGrid({ perfilTipo, dashboard }) {
  return (
    <PremiumCard>
      <SectionHeader
        eyebrow="Panorama"
        title="Modulos principais"
        description="Indicadores-chave organizados para leitura rapida no mobile e no desktop."
      />

      <div className="mt-4 sm:mt-5">
        <DashboardModules perfilTipo={perfilTipo} dashboard={dashboard || {}} />
      </div>
    </PremiumCard>
  );
}

