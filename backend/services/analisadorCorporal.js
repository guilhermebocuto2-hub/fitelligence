function analisarCorpo({ totalFotos = 1, possuiComparacao = false, descricaoAtual = "" }) {
  const descricaoNormalizada = String(descricaoAtual || "").trim().toLowerCase();

  const resumo_visual = possuiComparacao
    ? "Nova foto corporal registrada com base suficiente para leitura comparativa leve."
    : "Primeiro registro corporal salvo com foco em acompanhar evolucao visual ao longo do tempo.";

  const pontos_de_evolucao = possuiComparacao
    ? [
        "Base visual mais consistente para comparar sua evolucao recente",
        "Maior clareza para acompanhar constancia corporal ao longo do tempo",
      ]
    : [
        "Inicio do historico corporal registrado com sucesso",
        "Base criada para comparacoes futuras com mais contexto",
      ];

  const pontos_de_atencao = descricaoNormalizada
    ? ["Mantenha angulo, luz e distancia semelhantes nas proximas fotos"]
    : ["Adicionar uma descricao curta ajuda a contextualizar melhor a evolucao"];

  return {
    resumo_visual,
    pontos_de_evolucao,
    pontos_de_atencao,
    consistencia_percebida: totalFotos >= 3 ? "boa" : "inicial",
    recomendacao_curta:
      "Registre novas fotos em condicoes parecidas para acompanhar sua evolucao com mais clareza.",
  };
}

module.exports = {
  analisarCorpo,
};
