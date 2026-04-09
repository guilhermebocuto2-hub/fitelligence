function gerarCoachDoDia({
  scoreDia = 0,
  streakDias = 0,
  objetivo = "",
  barreira = "",
  execucao = {},
}) {
  const objetivoNormalizado = String(objetivo || "").toLowerCase();
  const barreiraNormalizada = String(barreira || "").toLowerCase();

  if (scoreDia >= 75) {
    return {
      titulo: "Voce encaixou bem o dia",
      mensagem:
        "Seu ritmo de hoje esta forte. O melhor proximo passo e repetir esse padrao amanha.",
      proxima_acao:
        streakDias >= 3
          ? "Proteger sua sequencia atual"
          : "Repetir o mesmo ritmo no proximo dia",
    };
  }

  if (
    Boolean(execucao?.treino_concluido) ||
    Number(execucao?.refeicoes_registradas || 0) > 0
  ) {
    return {
      titulo: "Seu dia ja saiu do zero",
      mensagem:
        "Uma ou duas acoes extras hoje ja melhoram muito sua consistencia.",
      proxima_acao: "Fechar agua ou passos antes do fim do dia",
    };
  }

  return {
    titulo: "Comece pelo mais simples",
    mensagem: barreiraNormalizada
      ? `Mesmo com ${barreiraNormalizada}, uma acao pequena agora ja conta.`
      : "Agua, check-in ou treino curto ja mudam o rumo do dia.",
    proxima_acao: objetivoNormalizado.includes("emagrec")
      ? "Priorize a primeira acao do plano"
      : "Retome com uma acao leve",
  };
}

module.exports = {
  gerarCoachDoDia,
};
