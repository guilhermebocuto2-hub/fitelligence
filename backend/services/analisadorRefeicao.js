const normalizarTexto = (texto) => {
  return String(texto || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
};

const detectarTipoRefeicao = (textoBase) => {
  if (
    textoBase.includes("cafe da manha") ||
    textoBase.includes("cafe") ||
    textoBase.includes("pao") ||
    textoBase.includes("bolo") ||
    textoBase.includes("leite")
  ) {
    return "cafe_da_manha";
  }

  if (
    textoBase.includes("almoco") ||
    textoBase.includes("arroz") ||
    textoBase.includes("feijao") ||
    textoBase.includes("frango") ||
    textoBase.includes("carne")
  ) {
    return "almoco";
  }

  if (
    textoBase.includes("jantar") ||
    textoBase.includes("janta") ||
    textoBase.includes("sopa") ||
    textoBase.includes("omelete")
  ) {
    return "jantar";
  }

  if (
    textoBase.includes("lanche") ||
    textoBase.includes("sanduiche") ||
    textoBase.includes("hamburguer")
  ) {
    return "lanche";
  }

  return "refeicao";
};

const analisar = async ({ nomeArquivo, descricao }) => {
  const textoBase = normalizarTexto(`${nomeArquivo || ""} ${descricao || ""}`);

  let calorias_estimadas = 450;
  let proteinas = 20;
  let carboidratos = 45;
  let gorduras = 12;
  let classificacao = "balanceada";
  let observacoes =
    "Analise estimada com base no nome do arquivo e na descricao informada.";
  const detalhes = [];

  if (textoBase.includes("arroz")) {
    calorias_estimadas += 130;
    carboidratos += 28;
    detalhes.push("arroz detectado");
  }

  if (textoBase.includes("feijao")) {
    calorias_estimadas += 90;
    carboidratos += 14;
    proteinas += 6;
    detalhes.push("feijao detectado");
  }

  if (
    textoBase.includes("frango") ||
    textoBase.includes("grelhado") ||
    textoBase.includes("peito de frango")
  ) {
    calorias_estimadas += 160;
    proteinas += 22;
    gorduras += 4;
    detalhes.push("frango detectado");
  }

  if (textoBase.includes("carne")) {
    calorias_estimadas += 180;
    proteinas += 20;
    gorduras += 10;
    detalhes.push("carne detectada");
  }

  if (textoBase.includes("ovo") || textoBase.includes("omelete")) {
    calorias_estimadas += 90;
    proteinas += 8;
    gorduras += 7;
    detalhes.push("ovo detectado");
  }

  if (
    textoBase.includes("salada") ||
    textoBase.includes("alface") ||
    textoBase.includes("tomate") ||
    textoBase.includes("legumes")
  ) {
    calorias_estimadas += 40;
    carboidratos += 5;
    classificacao = "leve";
    detalhes.push("salada/legumes detectados");
  }

  if (
    textoBase.includes("batata frita") ||
    textoBase.includes("fritura") ||
    textoBase.includes("hamburguer") ||
    textoBase.includes("pizza") ||
    textoBase.includes("refrigerante")
  ) {
    calorias_estimadas += 250;
    gorduras += 15;
    carboidratos += 20;
    classificacao = "calorica";
    observacoes =
      "Refeicao com maior densidade calorica e potencial excesso de gorduras.";
    detalhes.push("itens caloricos detectados");
  }

  if (
    textoBase.includes("whey") ||
    textoBase.includes("proteina") ||
    textoBase.includes("atum")
  ) {
    proteinas += 15;
    detalhes.push("fonte extra de proteina detectada");
  }

  if (calorias_estimadas >= 850) {
    classificacao = "calorica";
  } else if (calorias_estimadas <= 350) {
    classificacao = "leve";
  } else if (classificacao !== "calorica" && classificacao !== "leve") {
    classificacao = "balanceada";
  }

  const tipo_refeicao = detectarTipoRefeicao(textoBase);

  const descricaoAnalise =
    detalhes.length > 0
      ? `Itens identificados: ${detalhes.join(", ")}.`
      : "Nao foi possivel identificar claramente os itens da refeicao; analise estimada de forma generica.";

  const sugestao_proximo_passo =
    classificacao === "calorica"
      ? "No proximo passo, priorize agua e uma refeicao mais leve para equilibrar o dia."
      : classificacao === "leve"
        ? "Boa base para o dia. Vale complementar com proteina para melhorar saciedade."
        : "Mantenha esse padrao e tente registrar a proxima refeicao para acompanhar consistencia.";

  return {
    calorias_estimadas,
    proteinas,
    carboidratos,
    gorduras,
    classificacao,
    descricao: descricaoAnalise,
    observacoes,
    tipo_refeicao,
    sugestao_proximo_passo,
  };
};

module.exports = {
  analisar,
  analisarRefeicao: analisar,
};
