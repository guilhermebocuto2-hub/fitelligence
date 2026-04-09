"use client";

// Componentes reutilizáveis do design system premium.
import CardSurface from "../ui/CardSurface";
import CardSectionTitle from "../ui/CardSectionTitle";
import CardItem from "../ui/CardItem";
import StatusBadge from "../ui/StatusBadge";
import PremiumEmptyState from "../ui/PremiumEmptyState";

// Função auxiliar para decidir o tom visual do alerta.
function obterTomDoAlerta(alerta) {
  const texto = String(alerta || "").toLowerCase();

  if (
    texto.includes("excesso") ||
    texto.includes("alto") ||
    texto.includes("risco")
  ) {
    return "danger";
  }

  if (
    texto.includes("atenção") ||
    texto.includes("moderado") ||
    texto.includes("ajuste")
  ) {
    return "warning";
  }

  return "info";
}

// Componente que exibe alertas alimentares detectados pela IA.
export default function AlertasAlimentaresCard({ alertas = [] }) {
  return (
    <div className="space-y-5">
      {/* Cabeçalho principal */}
      <CardSectionTitle
        title="Alertas alimentares detectados"
        description="Pontos de atenção identificados automaticamente para ajudar na correção de rota."
      />

      {/* Estado vazio elegante quando não houver alertas */}
      {alertas.length === 0 ? (
        <PremiumEmptyState
          title="Nenhum alerta alimentar no momento"
          description="Isso é um bom sinal. Continue registrando refeições para manter a qualidade da análise automática."
        />
      ) : (
        <CardSurface tone="default">
          <div className="space-y-3">
            {alertas.map((alerta, index) => {
              const tone = obterTomDoAlerta(alerta);

              return (
                <CardItem
                  key={index}
                  title={`Alerta ${index + 1}`}
                  description={alerta}
                  tone={
                    tone === "danger"
                      ? "danger"
                      : tone === "warning"
                        ? "warning"
                        : "default"
                  }
                  rightContent={
                    <StatusBadge
                      status={
                        tone === "danger"
                          ? "danger"
                          : tone === "warning"
                            ? "warning"
                            : "info"
                      }
                    >
                      {tone === "danger"
                        ? "alta prioridade"
                        : tone === "warning"
                          ? "atenção"
                          : "monitorar"}
                    </StatusBadge>
                  }
                />
              );
            })}
          </div>
        </CardSurface>
      )}
    </div>
  );
}