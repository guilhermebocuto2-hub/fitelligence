"use client";

// Import do componente de status visual.
// Ele será usado para mostrar prioridade da recomendação.
import StatusBadge from "../ui/StatusBadge";

// Card principal da IA.
// Este bloco tem papel estratégico no dashboard:
// mostrar uma recomendação prioritária, com explicação e ações sugeridas.
export default function IARecommendationCard({ dashboard }) {
  // Captura alguns dados do dashboard para dar sensação de análise inteligente.
  // O uso de fallback evita quebrar a UI caso algum campo venha vazio.
  const scoreAlimentar = dashboard?.score_alimentar ?? 0;
  const scoreConsistencia = dashboard?.score_consistencia ?? 0;
  const totalCheckins = dashboard?.total_checkins ?? 0;
  const totalRefeicoes = dashboard?.total_refeicoes_analisadas ?? 0;

  // Lógica simples para montar uma recomendação principal.
  // No futuro isso pode ser substituído por uma resposta real da IA/backend,
  // sem precisar mudar a estrutura visual do componente.
  let titulo = "Seu desempenho está evoluindo bem";
  let descricao =
    "A IA identificou uma boa base de consistência. O próximo passo é consolidar hábitos para acelerar os resultados.";
  let prioridade = "success";
  let rotuloPrioridade = "oportunidade";
  let acoes = [
    "Mantenha os check-ins em dias consecutivos",
    "Continue registrando refeições para melhorar a precisão da IA",
    "Use os insights abaixo para pequenos ajustes semanais",
  ];

  // Regra 1:
  // Se o score alimentar estiver baixo, a recomendação prioriza alimentação.
  if (scoreAlimentar < 60) {
    titulo = "Sua alimentação precisa de ajuste estratégico";
    descricao =
      "A IA detectou que seu score alimentar está abaixo do ideal. Melhorar a qualidade e consistência das refeições pode gerar impacto direto na evolução.";
    prioridade = "danger";
    rotuloPrioridade = "prioridade alta";
    acoes = [
      "Aumente a regularidade das refeições principais",
      "Evite pular horários críticos da rotina alimentar",
      "Registre mais refeições para a IA identificar padrões com mais precisão",
    ];
  }
  // Regra 2:
  // Se a consistência estiver baixa, o foco passa a ser disciplina e engajamento.
  else if (scoreConsistencia < 70 || totalCheckins < 5) {
    titulo = "Sua consistência ainda pode melhorar";
    descricao =
      "A IA percebeu baixa recorrência de check-ins ou consistência abaixo do ideal. Pequenas ações diárias podem aumentar muito a performance do plano.";
    prioridade = "warning";
    rotuloPrioridade = "atenção";
    acoes = [
      "Faça check-ins com mais frequência",
      "Mantenha uma rotina mínima por 3 dias seguidos",
      "Use o dashboard diariamente para reforçar o hábito",
    ];
  }
  // Regra 3:
  // Se quase não há refeições analisadas, a IA incentiva mais dados.
  else if (totalRefeicoes < 3) {
    titulo = "A IA precisa de mais dados alimentares";
    descricao =
      "Seu histórico alimentar ainda está pequeno. Quanto mais refeições forem analisadas, melhores serão os insights e recomendações do Fitelligence.";
    prioridade = "info";
    rotuloPrioridade = "coleta de dados";
    acoes = [
      "Envie mais refeições para análise por imagem",
      "Acompanhe a evolução do score alimentar",
      "Crie o hábito de registrar refeições importantes do dia",
    ];
  }

  return (
    <section className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 hover:shadow-md">
      {/* Cabeçalho do card principal da IA */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="max-w-3xl">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-emerald-600">
            Recomendação principal da IA
          </p>

          <h3 className="mt-2 text-2xl font-semibold tracking-tight text-slate-900">
            {titulo}
          </h3>

          <p className="mt-3 text-sm leading-7 text-slate-500">
            {descricao}
          </p>
        </div>

        {/* Badge lateral para reforçar sensação de prioridade e inteligência */}
        <div className="shrink-0">
          <StatusBadge status={prioridade}>{rotuloPrioridade}</StatusBadge>
        </div>
      </div>

      {/* Bloco de dados resumidos usados pela IA */}
      <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
          <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
            Score alimentar
          </p>
          <p className="mt-2 text-2xl font-semibold text-slate-900">
            {scoreAlimentar}%
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
          <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
            Score de consistência
          </p>
          <p className="mt-2 text-2xl font-semibold text-slate-900">
            {scoreConsistencia}%
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
          <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
            Refeições analisadas
          </p>
          <p className="mt-2 text-2xl font-semibold text-slate-900">
            {totalRefeicoes}
          </p>
        </div>
      </div>

      {/* Lista de ações estratégicas sugeridas pela IA */}
      <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-5">
        <p className="text-sm font-semibold text-slate-900">
          Ações sugeridas para agora
        </p>

        <div className="mt-4 space-y-3">
          {acoes.map((acao, index) => (
            <div
              key={index}
              className="flex items-start gap-3 rounded-2xl bg-white px-4 py-3 ring-1 ring-slate-200"
            >
              {/* Indicador visual de bullet inteligente */}
              <span className="mt-1 h-2.5 w-2.5 rounded-full bg-emerald-500" />

              <p className="text-sm leading-6 text-slate-600">{acao}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}