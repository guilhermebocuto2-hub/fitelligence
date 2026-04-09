"use client";

// ======================================================
// BodyEvolutionSection
// Responsavel por:
// - manter a leitura de evolucao corporal
// - exibir comparacao corporal no mesmo contexto
// - preservar componentes existentes sem alteracao de API
// ======================================================

import EvolutionPanel from "./EvolutionPanel";
import BeforeAfterPanel from "./BeforeAfterPanel";

export default function BodyEvolutionSection({
  historicoOrdenado,
  comparacaoCorporal,
  apiBaseUrl,
}) {
  return (
    <div className="space-y-5">
      <EvolutionPanel historico={historicoOrdenado} />
      <BeforeAfterPanel
        comparacao={comparacaoCorporal}
        apiBaseUrl={apiBaseUrl || ""}
      />
    </div>
  );
}

