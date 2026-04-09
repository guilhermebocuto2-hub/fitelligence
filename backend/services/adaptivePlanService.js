function toNumber(value, fallback = 0) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function gerarAjusteAdaptativo({ dashboard = {}, usuario = {} }) {
  const score = toNumber(dashboard?.score_dia, 0);
  const streak = toNumber(dashboard?.streak_dias, 0);
  const execucao = dashboard?.execucao_plano_do_dia || {};
  const treinoConcluido = Boolean(execucao?.treino_concluido);
  const agua = toNumber(execucao?.agua_consumida_ml, 0);
  const refeicoes = toNumber(execucao?.refeicoes_registradas, 0);
  const passos = toNumber(execucao?.passos_realizados, 0);
  const objetivo = String(usuario?.objetivo || "").toLowerCase();

  let intensidade_recomendada = "moderada";
  let duracao_sugerida_min = 35;
  let foco_proximo_dia = "consistencia geral";

  if (score >= 75 && streak >= 3) {
    intensidade_recomendada = "moderada_alta";
    duracao_sugerida_min = treinoConcluido ? 45 : 40;
    foco_proximo_dia = treinoConcluido
      ? "progressao de treino"
      : "fechar treino e manter ritmo";
  } else if (score < 35) {
    intensidade_recomendada = "leve";
    duracao_sugerida_min = 25;
    foco_proximo_dia =
      agua > 0 || refeicoes > 0 || passos > 0
        ? "acoes simples e repetiveis"
        : "retomada com pequenas acoes";
  }

  if (objetivo.includes("emagrec")) {
    foco_proximo_dia =
      foco_proximo_dia === "consistencia geral"
        ? "consistencia e deficit controlado"
        : foco_proximo_dia;
  }

  return {
    intensidade_recomendada,
    duracao_sugerida_min,
    foco_proximo_dia,
    profundidade:
      String(usuario?.plano || "free").toLowerCase() === "premium"
        ? "premium"
        : "basica",
  };
}

module.exports = {
  gerarAjusteAdaptativo,
};
