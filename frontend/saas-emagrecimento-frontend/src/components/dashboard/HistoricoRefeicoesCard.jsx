"use client";

// Componentes visuais reutilizáveis do padrão premium.
import CardSurface from "../ui/CardSurface";
import CardSectionTitle from "../ui/CardSectionTitle";
import CardItem from "../ui/CardItem";
import StatusBadge from "../ui/StatusBadge";
import PremiumEmptyState from "../ui/PremiumEmptyState";

// Função auxiliar para formatar data de forma amigável.
// Caso a data venha inválida, retornamos o valor bruto para não quebrar o card.
function formatarData(data) {
  if (!data) return "-";

  const dataConvertida = new Date(data);

  if (Number.isNaN(dataConvertida.getTime())) {
    return String(data);
  }

  return dataConvertida.toLocaleDateString("pt-BR");
}

// Função auxiliar para escolher o status visual da refeição.
function obterStatusRefeicao(classificacao) {
  const texto = String(classificacao || "").toLowerCase();

  if (
    texto.includes("excelente") ||
    texto.includes("ótima") ||
    texto.includes("boa")
  ) {
    return { badgeStatus: "success", badgeLabel: "boa" };
  }

  if (
    texto.includes("moderada") ||
    texto.includes("regular") ||
    texto.includes("mediana")
  ) {
    return { badgeStatus: "warning", badgeLabel: "moderada" };
  }

  if (
    texto.includes("ruim") ||
    texto.includes("baixa") ||
    texto.includes("péssima")
  ) {
    return { badgeStatus: "danger", badgeLabel: "atenção" };
  }

  return { badgeStatus: "info", badgeLabel: "avaliada" };
}

// Card responsável por mostrar o histórico recente de refeições analisadas.
export default function HistoricoRefeicoesCard({ refeicoes = [] }) {
  return (
    <div className="space-y-5">
      {/* Cabeçalho do bloco */}
      <CardSectionTitle
        title="Últimas refeições analisadas"
        description="Veja rapidamente as refeições mais recentes processadas pela IA."
      />

      {/* Estado vazio elegante caso ainda não existam refeições */}
      {refeicoes.length === 0 ? (
        <PremiumEmptyState
          title="Ainda não há refeições registradas"
          description="Assim que refeições forem analisadas, este histórico mostrará os registros mais recentes com classificação e data."
        />
      ) : (
        <CardSurface tone="default">
          <div className="space-y-3">
            {refeicoes.map((refeicao, index) => {
              const descricao =
                refeicao?.descricao ||
                refeicao?.tipo_refeicao ||
                `Refeição ${index + 1}`;

              const classificacao =
                refeicao?.classificacao || "Sem classificação";

              const data =
                refeicao?.data_registro ||
                refeicao?.criado_em ||
                refeicao?.created_at;

              const calorias =
                refeicao?.calorias_estimadas ??
                refeicao?.calorias ??
                null;

              const status = obterStatusRefeicao(classificacao);

              return (
                <CardItem
                  key={refeicao?.id || index}
                  title={descricao}
                  description={`Classificação: ${classificacao} • Data: ${formatarData(data)}`}
                  rightContent={
                    <div className="flex flex-col items-end gap-2">
                      <StatusBadge status={status.badgeStatus}>
                        {status.badgeLabel}
                      </StatusBadge>

                      <span className="text-xs font-medium text-slate-500">
                        {calorias !== null ? `${calorias} kcal` : "-"}
                      </span>
                    </div>
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