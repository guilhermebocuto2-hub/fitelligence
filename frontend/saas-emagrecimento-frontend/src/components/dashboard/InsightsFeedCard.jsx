"use client";

// Badge de status para indicar se o insight é positivo, atenção ou informativo.
import StatusBadge from "../ui/StatusBadge";

// Card que funciona como um feed de inteligência percebida.
// Ele exibe vários pequenos insights automáticos gerados com base
// nos dados já disponíveis no dashboard.
export default function InsightsFeedCard({ dashboard }) {
  // Leitura segura dos dados, para evitar erros se algum campo vier ausente.
  const scoreAlimentar = dashboard?.score_alimentar ?? 0;
  const scoreConsistencia = dashboard?.score_consistencia ?? 0;
  const totalCheckins = dashboard?.total_checkins ?? 0;
  const totalRefeicoes = dashboard?.total_refeicoes_analisadas ?? 0;
  const perdaTotal = Number(dashboard?.perda_total ?? 0);

  // Array de insights montado dinamicamente.
  // No futuro, isso pode vir da API sem mudar a estrutura visual.
  const insights = [];

  // Insight sobre alimentação.
  if (scoreAlimentar >= 80) {
    insights.push({
      titulo: "Seu padrão alimentar está forte",
      descricao:
        "A IA detectou boa qualidade alimentar recente. Continue nesse ritmo para consolidar resultados.",
      status: "success",
      rotulo: "positivo",
    });
  } else if (scoreAlimentar >= 60) {
    insights.push({
      titulo: "Sua alimentação está estável",
      descricao:
        "Existe uma base razoável, mas ainda há espaço para melhorar consistência e qualidade nutricional.",
      status: "warning",
      rotulo: "ajuste fino",
    });
  } else {
    insights.push({
      titulo: "Alimentação em ponto de atenção",
      descricao:
        "O score alimentar está abaixo do ideal. Pequenos ajustes podem gerar ganho rápido de performance.",
      status: "danger",
      rotulo: "atenção",
    });
  }

  // Insight sobre consistência.
  if (scoreConsistencia >= 80) {
    insights.push({
      titulo: "Sua consistência está acima da média",
      descricao:
        "A frequência de hábitos e registros mostra uma boa disciplina operacional.",
      status: "success",
      rotulo: "consistência alta",
    });
  } else {
    insights.push({
      titulo: "Sua rotina ainda oscila",
      descricao:
        "A IA percebeu espaço para melhorar a repetição dos hábitos. Regularidade diária tende a elevar resultados.",
      status: "warning",
      rotulo: "disciplina",
    });
  }

  // Insight sobre volume de dados para IA.
  if (totalRefeicoes < 5) {
    insights.push({
      titulo: "A IA ainda está aprendendo seu padrão alimentar",
      descricao:
        "Mais refeições analisadas aumentam a precisão do score, dos alertas e das recomendações automáticas.",
      status: "info",
      rotulo: "coleta",
    });
  } else {
    insights.push({
      titulo: "A IA já tem base alimentar relevante",
      descricao:
        "Seu histórico alimentar já permite análises mais úteis e comparações de padrão.",
      status: "success",
      rotulo: "dados fortes",
    });
  }

  // Insight sobre engajamento.
  if (totalCheckins < 7) {
    insights.push({
      titulo: "Seu engajamento pode subir",
      descricao:
        "Mais check-ins aumentam a qualidade dos insights e ajudam a identificar padrões reais de evolução.",
      status: "warning",
      rotulo: "engajamento",
    });
  } else {
    insights.push({
      titulo: "Seu engajamento está saudável",
      descricao:
        "A quantidade de check-ins recente favorece análises mais confiáveis sobre energia, motivação e aderência.",
      status: "success",
      rotulo: "bom ritmo",
    });
  }

  // Insight sobre evolução física.
  if (perdaTotal > 0) {
    insights.push({
      titulo: "Há evolução física registrada",
      descricao:
        "Seu histórico mostra progresso acumulado. Agora o foco é manter constância para evitar regressão.",
      status: "success",
      rotulo: "evolução",
    });
  } else {
    insights.push({
      titulo: "Ainda não há perda acumulada relevante",
      descricao:
        "A IA sugere focar primeiro em consistência alimentar e frequência de registro antes de buscar ajustes maiores.",
      status: "info",
      rotulo: "fase inicial",
    });
  }

  return (
    <section className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 hover:shadow-md">
      {/* Cabeçalho do feed de insights */}
      <div>
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-emerald-600">
          Feed de inteligência
        </p>

        <h3 className="mt-2 text-xl font-semibold tracking-tight text-slate-900">
          Insights automáticos do Fitelligence
        </h3>

        <p className="mt-2 text-sm leading-6 text-slate-500">
          Leitura rápida das principais interpretações geradas pela IA com base
          no seu comportamento recente.
        </p>
      </div>

      {/* Lista de insights */}
      <div className="mt-5 space-y-4">
        {insights.map((insight, index) => (
          <div
            key={index}
            className="rounded-2xl border border-slate-200 bg-slate-50 p-4 transition-all duration-300 hover:border-emerald-200 hover:bg-white"
          >
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div className="max-w-2xl">
                <h4 className="text-sm font-semibold text-slate-900">
                  {insight.titulo}
                </h4>

                <p className="mt-2 text-sm leading-6 text-slate-500">
                  {insight.descricao}
                </p>
              </div>

              <div className="shrink-0">
                <StatusBadge status={insight.status}>
                  {insight.rotulo}
                </StatusBadge>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}