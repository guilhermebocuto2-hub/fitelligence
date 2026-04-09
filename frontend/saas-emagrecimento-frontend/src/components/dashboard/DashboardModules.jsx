"use client";

// ======================================================
// Módulos inteligentes do dashboard
// Responsável por:
// - organizar blocos conforme perfil
// - priorizar o que importa
// - tornar o dashboard dinâmico
// - evitar poluição visual no mobile
// ======================================================

import { useMemo } from "react";
import MetricCard from "./MetricCard";

// ======================================================
// Monta os módulos disponíveis
// ======================================================
function getModules(dashboard = {}) {
  return [
    {
      id: "progresso",
      component: (
        <MetricCard
          label="Perda total"
          value={`${dashboard?.perda_total ?? 0} kg`}
          helper="Evolução corporal acumulada"
          tone="success"
        />
      ),
    },
    {
      id: "alimentacao",
      component: (
        <MetricCard
          label="Score alimentar"
          value={`${dashboard?.score_alimentar ?? 0}%`}
          helper="Qualidade média da alimentação"
          tone="intelligence"
        />
      ),
    },
    {
      id: "motivacao",
      component: (
        <MetricCard
          label="Motivação"
          value={dashboard?.resumo?.motivacaoMedia ?? "--"}
          helper="Baseado nos check-ins"
          tone="warning"
        />
      ),
    },
    {
      id: "plano",
      component: (
        <MetricCard
          label="Plano atual"
          value={dashboard?.ultimo_plano?.calorias ?? "--"}
          helper="Base calórica ativa"
        />
      ),
    },
    {
      id: "checkins",
      component: (
        <MetricCard
          label="Check-ins"
          value={dashboard?.total_checkins ?? 0}
          helper="Interações recentes"
          tone="default"
        />
      ),
    },
    {
      id: "refeicoes",
      component: (
        <MetricCard
          label="Refeições analisadas"
          value={dashboard?.total_refeicoes_analisadas ?? 0}
          helper="Leituras de IA alimentar"
          tone="intelligence"
        />
      ),
    },
  ];
}

// ======================================================
// Define prioridade por perfil
// ======================================================
function getPriority(perfilTipo) {
  if (perfilTipo === "personal") {
    return ["checkins", "progresso", "plano", "motivacao", "alimentacao", "refeicoes"];
  }

  if (perfilTipo === "nutricionista") {
    return ["alimentacao", "refeicoes", "progresso", "plano", "checkins", "motivacao"];
  }

  return ["alimentacao", "progresso", "motivacao", "plano", "checkins", "refeicoes"];
}

export default function DashboardModules({
  perfilTipo = "usuario",
  dashboard = {},
}) {
  const modules = getModules(dashboard);
  const priority = getPriority(perfilTipo);

  const ordered = useMemo(() => {
    return [...modules].sort((a, b) => {
      const indexA = priority.indexOf(a.id);
      const indexB = priority.indexOf(b.id);

      const safeA = indexA === -1 ? 999 : indexA;
      const safeB = indexB === -1 ? 999 : indexB;

      return safeA - safeB;
    });
  }, [modules, priority]);

  // ====================================================
  // No mobile vamos mostrar apenas os 3 módulos
  // mais importantes para evitar excesso visual
  // ====================================================
  const mobileModules = ordered.slice(0, 3);

  return (
    <div>
      {/* MOBILE: somente módulos principais */}
      <div className="flex gap-3 overflow-x-auto pb-2 md:hidden">
        {mobileModules.map((module) => (
          <div key={module.id} className="min-w-[180px] flex-shrink-0">
            {module.component}
          </div>
        ))}
      </div>

      {/* DESKTOP: grid completo */}
      <div className="hidden gap-4 md:grid md:grid-cols-2 xl:grid-cols-3">
        {ordered.map((module) => (
          <div key={module.id}>{module.component}</div>
        ))}
      </div>
    </div>
  );
}