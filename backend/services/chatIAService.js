function normalizeText(value) {
  return String(value || "").trim().toLowerCase();
}

function includesAny(text, terms) {
  return terms.some((term) => text.includes(term));
}

function gerarRespostaInicialDaIA(mensagem = "") {
  const texto = normalizeText(mensagem);

  const falouTreino = includesAny(texto, [
    "treino",
    "exercicio",
    "exercício",
    "academia",
    "cardio",
    "muscul",
    "corrida",
  ]);

  const falouAlimentacao = includesAny(texto, [
    "alimenta",
    "dieta",
    "refeicao",
    "refeição",
    "comida",
    "caloria",
    "calorias",
    "lanche",
  ]);

  const falouMotivacao = includesAny(texto, [
    "desanimo",
    "desânimo",
    "motivacao",
    "motivação",
    "cansado",
    "cansada",
    "desisti",
    "sem vontade",
  ]);

  const falouSuporte = includesAny(texto, [
    "erro",
    "bug",
    "falha",
    "problema",
    "pagamento",
    "cobranca",
    "cobrança",
    "assinatura",
    "travou",
    "nao funciona",
    "não funciona",
  ]);

  if (falouSuporte) {
    return {
      categoria: "suporte",
      statusConversa: "aguardando_suporte",
      origemConversa: "sistema",
      resposta:
        "Entendi. Isso parece um tema de suporte do app. Já deixei a conversa sinalizada e, enquanto isso, vale me dizer em uma frase o que aconteceu para facilitar o próximo atendimento.",
    };
  }

  if (falouTreino) {
    return {
      categoria: "treino",
      statusConversa: "aberta",
      origemConversa: "ia",
      resposta:
        "Vamos simplificar: foque no próximo treino possível, não no treino perfeito. Se quiser, eu posso te ajudar a transformar isso em uma meta pequena e executável para hoje.",
    };
  }

  if (falouAlimentacao) {
    return {
      categoria: "alimentacao",
      statusConversa: "aberta",
      origemConversa: "ia",
      resposta:
        "Boa. Em vez de tentar mudar tudo de uma vez, escolha a próxima refeição e busque um passo simples: mais proteína, mais água ou uma porção mais equilibrada.",
    };
  }

  if (falouMotivacao) {
    return {
      categoria: "motivacao",
      statusConversa: "aberta",
      origemConversa: "ia",
      resposta:
        "Oscilar faz parte. O melhor próximo passo costuma ser o menor possível: água, check-in ou um treino curto. Consistência pequena ainda conta muito.",
    };
  }

  return {
    categoria: "geral",
    statusConversa: "aberta",
    origemConversa: "ia",
    resposta:
      "Estou com você nessa rotina. Me diga se o foco agora é treino, alimentação, motivação ou suporte técnico, e eu respondo de forma mais direta.",
  };
}

module.exports = {
  gerarRespostaInicialDaIA,
};
