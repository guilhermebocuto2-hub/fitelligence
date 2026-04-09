// ======================================================
// Gera uma leitura simples para o comparativo corporal
// Responsável por:
// - interpretar existência de fotos
// - reforçar percepção de evolução
// - ajudar o dashboard a parecer mais inteligente
// ======================================================

export function getBodyComparisonInsight(comparacao = null) {
  if (!comparacao) {
    return {
      title: "Comparação corporal ainda indisponível",
      description:
        "Assim que houver fotos suficientes na linha do tempo corporal, o Fitelligence mostrará aqui uma leitura visual da evolução.",
    };
  }

  return {
    title: "Sua evolução visual está pronta para ser acompanhada",
    description:
      "A comparação antes e depois ajuda a transformar percepção subjetiva em clareza visual da jornada corporal.",
  };
}