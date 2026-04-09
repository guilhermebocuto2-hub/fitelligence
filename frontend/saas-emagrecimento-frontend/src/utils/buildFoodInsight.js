// ======================================================
// Função responsável por interpretar os dados da refeição
// e transformar números em leitura inteligente para UI.
//
// Objetivo:
// - gerar headline principal
// - gerar resumo estratégico
// - gerar recomendação prática
// - definir tom visual da análise
//
// Essa função foi pensada para ser:
// - reutilizável
// - escalável
// - fácil de manter
// ======================================================

export function buildFoodInsight(analise) {
  // ====================================================
  // Caso não exista análise, retornamos fallback seguro
  // para evitar quebra de interface no dashboard
  // ====================================================
  if (!analise) {
    return {
      headline: "Nenhuma refeição analisada ainda",
      summary:
        "Assim que o usuário enviar uma foto de refeição, o Fitelligence exibirá aqui a leitura nutricional inteligente.",
      recommendation:
        "Incentive o envio da primeira refeição para começar os insights alimentares.",
      tone: "neutral",
    };
  }

  // ====================================================
  // Extração dos campos com proteção contra null/undefined
  // ====================================================
  const calorias = Number(analise.calorias_estimadas || 0);
  const proteinas = Number(analise.proteinas || 0);
  const carboidratos = Number(analise.carboidratos || 0);
  const gorduras = Number(analise.gorduras || 0);
  const classificacao = String(analise.classificacao || "").toLowerCase();

  // ====================================================
  // Regras heurísticas iniciais para interpretação.
  // Aqui não é IA generativa ainda; é uma camada
  // de inteligência de produto baseada em regras.
  //
  // Vantagem:
  // - rápida
  // - previsível
  // - escalável
  // - fácil de evoluir depois para IA mais avançada
  // ====================================================

  // ----------------------------------------------------
  // Regra: refeição muito proteica
  // ----------------------------------------------------
  const proteinaAlta = proteinas >= 25;

  // ----------------------------------------------------
  // Regra: refeição muito calórica
  // ----------------------------------------------------
  const caloriasAltas = calorias >= 700;

  // ----------------------------------------------------
  // Regra: carboidrato elevado
  // ----------------------------------------------------
  const carboAlto = carboidratos >= 70;

  // ----------------------------------------------------
  // Regra: gordura elevada
  // ----------------------------------------------------
  const gorduraAlta = gorduras >= 30;

  // ====================================================
  // Interpretação principal por classificação
  // ====================================================
  if (classificacao === "boa") {
    if (proteinaAlta && !caloriasAltas) {
      return {
        headline: "Boa escolha alimentar",
        summary:
          "A última refeição apresenta um perfil nutricional equilibrado, com bom suporte para saciedade, recuperação muscular e controle do apetite.",
        recommendation:
          "Mantenha esse padrão nas próximas refeições para favorecer constância e aderência ao plano.",
        tone: "success",
      };
    }

    return {
      headline: "Refeição positiva para o plano",
      summary:
        "A análise indica uma composição alimentar favorável, com boa qualidade geral e baixo sinal de excesso crítico.",
      recommendation:
        "Vale repetir esse padrão alimentar em horários estratégicos do dia, principalmente quando houver mais fome.",
      tone: "success",
    };
  }

  if (classificacao === "moderada") {
    if (carboAlto && !proteinaAlta) {
      return {
        headline: "Boa base, mas com ajuste importante",
        summary:
          "A refeição tem potencial, porém apresenta concentração maior de carboidratos em relação à proteína, o que pode reduzir saciedade e estabilidade alimentar ao longo do dia.",
        recommendation:
          "Uma evolução simples seria aumentar a fonte proteica para tornar a refeição mais completa e estratégica.",
        tone: "warning",
      };
    }

    if (gorduraAlta) {
      return {
        headline: "Refeição moderada com atenção à densidade energética",
        summary:
          "O perfil nutricional mostra sinais de maior concentração calórica, provavelmente influenciada pelo teor de gordura da refeição.",
        recommendation:
          "Reduzir ingredientes muito gordurosos pode melhorar o equilíbrio sem comprometer o sabor.",
        tone: "warning",
      };
    }

    return {
      headline: "Refeição moderada",
      summary:
        "A composição alimentar não está ruim, mas ainda há espaço para melhorar equilíbrio, saciedade e qualidade nutricional.",
      recommendation:
        "Pequenos ajustes na distribuição dos macros já podem elevar bastante a qualidade dessa refeição.",
      tone: "warning",
    };
  }

  if (classificacao === "ruim") {
    if (caloriasAltas && gorduraAlta) {
      return {
        headline: "Alerta de excesso calórico",
        summary:
          "A última refeição apresenta alta densidade energética e maior concentração de gordura, cenário que pode dificultar o progresso quando se repete com frequência.",
        recommendation:
          "O melhor próximo passo é compensar com uma refeição mais leve, rica em proteína e alimentos menos processados.",
        tone: "danger",
      };
    }

    if (!proteinaAlta) {
      return {
        headline: "Baixa qualidade estratégica da refeição",
        summary:
          "A análise sugere uma refeição pouco eficiente para saciedade e composição corporal, especialmente pela menor presença de proteína e pior equilíbrio nutricional.",
        recommendation:
          "Priorizar uma fonte proteica principal nas próximas refeições tende a melhorar bastante a resposta do plano.",
        tone: "danger",
      };
    }

    return {
      headline: "Refeição desalinhada com o objetivo",
      summary:
        "A composição identificada está abaixo do ideal para uma rotina de emagrecimento sustentável e pode reduzir a consistência dos resultados.",
      recommendation:
        "Use essa análise como ajuste de rota, não como fracasso. O foco agora é melhorar a próxima escolha.",
      tone: "danger",
    };
  }

  // ====================================================
  // Fallback para classificações desconhecidas
  // ====================================================
  return {
    headline: "Leitura nutricional gerada",
    summary:
      "A refeição foi analisada com sucesso e já pode ser usada como referência para acompanhamento alimentar.",
    recommendation:
      "Continue registrando refeições para que os insights fiquem cada vez mais precisos.",
    tone: "neutral",
  };
}