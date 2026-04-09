const connection = require("../database/connection");
const {
  gerarResumoAlimentarInteligente,
} = require("../services/resumoAlimentarService");
const {
  buscarResumoOnboardingPorUsuario,
} = require("../services/onboardingResumoService");
const dailyPlanService = require("../services/dailyPlanService");
const dailyPlanExecutionService = require("../services/dailyPlanExecutionService");
const { gerarAjusteAdaptativo } = require("../services/adaptivePlanService");
const { gerarCoachDoDia } = require("../services/coachDoDiaService");

// ======================================================
// Função auxiliar para transformar a última análise de
// refeição em um insight curto, estratégico e pronto
// para exibição no dashboard premium.
//
// Objetivo:
// - alimentar o componente FoodAnalysisPanel
// - evitar jogar toda a inteligência no frontend
// - deixar o backend mais preparado para app mobile
//   e outros clientes no futuro
// ======================================================
function gerarInsightAlimentar(analise) {
  // ----------------------------------------------------
  // Fallback seguro caso ainda não exista refeição
  // analisada para o usuário
  // ----------------------------------------------------
  if (!analise) {
    return {
      headline: "Nenhuma refeição analisada ainda",
      summary:
        "Assim que o usuário enviar uma foto de refeição, o Fitelligence exibirá aqui uma leitura nutricional inteligente.",
      recommendation:
        "Envie a primeira refeição para começar os insights alimentares.",
      tone: "neutral",
    };
  }

  // ----------------------------------------------------
  // Normalização dos dados numéricos para evitar null,
  // undefined ou string vinda do MySQL
  // ----------------------------------------------------
  const calorias = Number(analise.calorias_estimadas || 0);
  const proteinas = Number(analise.proteinas || 0);
  const carboidratos = Number(analise.carboidratos || 0);
  const gorduras = Number(analise.gorduras || 0);
  const classificacao = String(analise.classificacao || "").toLowerCase();

  // ----------------------------------------------------
  // Heurísticas simples e escaláveis para interpretação
  // ----------------------------------------------------
  const proteinaAlta = proteinas >= 25;
  const caloriasAltas = calorias >= 700;
  const carboAlto = carboidratos >= 70;
  const gorduraAlta = gorduras >= 30;

  // ----------------------------------------------------
  // Regras por classificação
  // ----------------------------------------------------
  if (
    classificacao.includes("boa") ||
    classificacao.includes("balanceada") ||
    classificacao.includes("rica")
  ) {
    if (proteinaAlta && !caloriasAltas) {
      return {
        headline: "Boa escolha alimentar",
        summary:
          "A última refeição apresenta um perfil equilibrado, com boa presença de proteína e melhor suporte para saciedade.",
        recommendation:
          "Vale manter esse padrão nas próximas refeições para reforçar consistência no plano.",
        tone: "success",
      };
    }

    return {
      headline: "Refeição positiva para o plano",
      summary:
        "A composição geral da refeição foi favorável e mostra alinhamento com uma rotina alimentar mais estratégica.",
      recommendation:
        "Continue usando esse tipo de refeição como referência para boas escolhas ao longo do dia.",
      tone: "success",
    };
  }

  if (classificacao.includes("moderada")) {
    if (carboAlto && !proteinaAlta) {
      return {
        headline: "Boa base, mas com ajuste importante",
        summary:
          "A refeição tem potencial, mas apresenta mais carboidratos do que proteína, o que pode reduzir saciedade.",
        recommendation:
          "Adicionar uma fonte proteica mais forte já melhoraria bastante essa composição.",
        tone: "warning",
      };
    }

    if (gorduraAlta) {
      return {
        headline: "Atenção à densidade calórica",
        summary:
          "A refeição apresenta sinais de maior concentração energética, possivelmente puxada pelo teor de gordura.",
        recommendation:
          "Reduzir ingredientes mais gordurosos pode melhorar o equilíbrio sem perder praticidade.",
        tone: "warning",
      };
    }

    return {
      headline: "Refeição moderada",
      summary:
        "A composição não está ruim, mas ainda há espaço para melhorar equilíbrio nutricional, saciedade e estratégia alimentar.",
      recommendation:
        "Pequenos ajustes nos macros podem elevar bastante a qualidade dessa refeição.",
      tone: "warning",
    };
  }

  if (
    classificacao.includes("ruim") ||
    classificacao.includes("calórica") ||
    classificacao.includes("calorica")
  ) {
    if (caloriasAltas && gorduraAlta) {
      return {
        headline: "Alerta de excesso calórico",
        summary:
          "A refeição apresenta alta densidade energética e maior concentração de gordura, o que pode dificultar o progresso quando esse padrão se repete.",
        recommendation:
          "A melhor correção agora é focar em uma próxima refeição mais leve, com proteína e alimentos menos processados.",
        tone: "danger",
      };
    }

    if (!proteinaAlta) {
      return {
        headline: "Baixa eficiência nutricional",
        summary:
          "A refeição parece pouco eficiente para saciedade e composição corporal, especialmente pela baixa presença de proteína.",
        recommendation:
          "Priorizar uma fonte proteica principal nas próximas refeições tende a melhorar bastante a resposta do plano.",
        tone: "danger",
      };
    }

    return {
      headline: "Refeição desalinhada com o objetivo",
      summary:
        "A composição identificada ficou abaixo do ideal para uma rotina de emagrecimento mais consistente.",
      recommendation:
        "Encare isso como ajuste de rota. A próxima escolha é mais importante do que a última.",
      tone: "danger",
    };
  }

  // ----------------------------------------------------
  // Fallback para classificações não previstas
  // ----------------------------------------------------
  return {
    headline: "Leitura nutricional gerada",
    summary:
      "A refeição foi analisada com sucesso e já pode ser usada como referência para acompanhamento alimentar.",
    recommendation:
      "Continue registrando refeições para que os insights fiquem cada vez mais ricos.",
    tone: "neutral",
  };
}

// ======================================================
// Função responsável por consolidar um resumo alimentar
// estratégico a partir do histórico de refeições.
// ======================================================
function gerarResumoAlimentarDashboard(
  analisesRefeicao,
  alertasAlimentares = []
) {
  if (!analisesRefeicao || analisesRefeicao.length === 0) {
    return {
      score: 0,
      total_refeicoes: 0,
      boas: 0,
      moderadas: 0,
      ruins: 0,
      tendencia: "sem_dados",
      padrao_predominante: "indefinido",
      principal_alerta:
        "Ainda não há refeições suficientes para gerar leitura estratégica.",
      resumo_executivo:
        "Assim que mais refeições forem analisadas, o Fitelligence começará a identificar padrões de alimentação.",
      recomendacao:
        "Registre novas refeições para ativar o resumo alimentar inteligente.",
    };
  }

  let boas = 0;
  let moderadas = 0;
  let ruins = 0;

  analisesRefeicao.forEach((item) => {
    const classif = String(item.classificacao || "").toLowerCase();

    if (
      classif.includes("boa") ||
      classif.includes("balanceada") ||
      classif.includes("rica")
    ) {
      boas += 1;
    } else if (classif.includes("moderada")) {
      moderadas += 1;
    } else {
      ruins += 1;
    }
  });

  const totalRefeicoes = analisesRefeicao.length;

  const score = Math.max(
    0,
    Math.min(
      100,
      Math.round(
        ((boas * 1 + moderadas * 0.5 + ruins * 0) / totalRefeicoes) * 100
      )
    )
  );

  let padraoPredominante = "moderada";

  if (boas >= moderadas && boas >= ruins) {
    padraoPredominante = "boa";
  } else if (ruins >= boas && ruins >= moderadas) {
    padraoPredominante = "ruim";
  }

  const pesoClassificacao = (classificacao) => {
    const valor = String(classificacao || "").toLowerCase();

    if (
      valor.includes("boa") ||
      valor.includes("balanceada") ||
      valor.includes("rica")
    ) {
      return 2;
    }

    if (valor.includes("moderada")) {
      return 1;
    }

    return 0;
  };

  let tendencia = "estavel";

  if (totalRefeicoes >= 4) {
    const metade = Math.floor(totalRefeicoes / 2);

    const parteAntiga = analisesRefeicao.slice(metade);
    const parteRecente = analisesRefeicao.slice(0, metade);

    const mediaAntiga =
      parteAntiga.reduce(
        (acc, item) => acc + pesoClassificacao(item.classificacao),
        0
      ) / (parteAntiga.length || 1);

    const mediaRecente =
      parteRecente.reduce(
        (acc, item) => acc + pesoClassificacao(item.classificacao),
        0
      ) / (parteRecente.length || 1);

    if (mediaRecente > mediaAntiga + 0.2) {
      tendencia = "melhora";
    } else if (mediaRecente < mediaAntiga - 0.2) {
      tendencia = "piora";
    }
  }

  const principalAlerta =
    alertasAlimentares.length > 0
      ? alertasAlimentares[0]
      : "Nenhum alerta crítico foi identificado no padrão alimentar recente.";

  let resumoExecutivo =
    "O padrão alimentar mostra comportamento estável, com espaço para evolução na qualidade nutricional.";

  if (padraoPredominante === "boa" && tendencia === "melhora") {
    resumoExecutivo =
      "Seu padrão alimentar mostra evolução positiva, com maior frequência de refeições bem classificadas nas análises mais recentes.";
  } else if (padraoPredominante === "boa") {
    resumoExecutivo =
      "Sua alimentação já apresenta uma base consistente, com predominância de refeições de melhor qualidade.";
  } else if (padraoPredominante === "moderada") {
    resumoExecutivo =
      "Seu padrão alimentar está em nível intermediário, indicando boa base, mas ainda com espaço claro para ajustes estratégicos.";
  } else if (padraoPredominante === "ruim") {
    resumoExecutivo =
      "Seu padrão alimentar recente está abaixo do ideal e pode reduzir previsibilidade nos resultados se esse comportamento se repetir.";
  }

  let recomendacao =
    "Priorize refeições mais equilibradas em proteína, carboidratos e gorduras para melhorar consistência alimentar.";

  if (padraoPredominante === "boa") {
    recomendacao =
      "Mantenha esse padrão e tente repetir a estrutura das refeições mais bem classificadas ao longo da semana.";
  } else if (padraoPredominante === "moderada") {
    recomendacao =
      "O ajuste de maior impacto agora é aumentar proteína e reduzir excessos energéticos em refeições intermediárias.";
  } else if (padraoPredominante === "ruim") {
    recomendacao =
      "O melhor próximo passo é reorganizar as próximas refeições com mais proteína, menos ultraprocessados e menor densidade calórica.";
  }

  return {
    score,
    total_refeicoes: totalRefeicoes,
    boas,
    moderadas,
    ruins,
    tendencia,
    padrao_predominante: padraoPredominante,
    principal_alerta: principalAlerta,
    resumo_executivo: resumoExecutivo,
    recomendacao,
  };
}

// ======================================================
// Função responsável por gerar notificações inteligentes
// ======================================================
function gerarNotificacoesInteligentes({
  scoreGlobal,
  scoreAlimentar,
  scoreConsistencia,
  totalRefeicoesAnalisadas,
  resumoAlimentarDashboard,
  totalCheckins,
}) {
  const notificacoes = [];

  if ((scoreGlobal?.score || 0) < 40) {
    notificacoes.push({
      id: "notif_score_baixo",
      tipo: "atencao",
      titulo: "Seu score geral precisa de atenção",
      mensagem:
        "Seu desempenho atual está abaixo do ideal. Pequenos ajustes em alimentação, consistência e progresso podem melhorar sua evolução rapidamente.",
      acao: "Revisar ações rápidas",
    });
  }

  if ((totalRefeicoesAnalisadas || 0) < 3) {
    notificacoes.push({
      id: "notif_poucas_refeicoes",
      tipo: "lembrete",
      titulo: "Mais refeições melhoram a inteligência do app",
      mensagem:
        "Registrar novas refeições ajuda o Fitelligence a entender melhor seu padrão alimentar e gerar recomendações mais precisas.",
      acao: "Registrar refeição",
    });
  }

  if (resumoAlimentarDashboard?.tendencia === "piora") {
    notificacoes.push({
      id: "notif_tendencia_piora",
      tipo: "alerta",
      titulo: "Sua alimentação mostra sinais de piora",
      mensagem:
        "As análises mais recentes indicam queda na qualidade alimentar. Vale revisar suas últimas escolhas e retomar consistência.",
      acao: "Ver resumo alimentar",
    });
  }

  if ((scoreAlimentar || 0) < 40 && (totalRefeicoesAnalisadas || 0) >= 3) {
    notificacoes.push({
      id: "notif_score_alimentar_baixo",
      tipo: "atencao",
      titulo: "Seu padrão alimentar ainda pode evoluir",
      mensagem:
        "A qualidade média das refeições analisadas ainda está abaixo do ideal. Ajustes simples podem elevar bastante seu desempenho.",
      acao: "Analisar alimentação",
    });
  }

  if ((scoreConsistencia || 0) < 50) {
    notificacoes.push({
      id: "notif_consistencia_baixa",
      tipo: "lembrete",
      titulo: "Sua consistência está abaixo do ideal",
      mensagem:
        "Manter frequência nos hábitos e registros melhora a previsibilidade dos seus resultados e a inteligência do acompanhamento.",
      acao: "Retomar rotina",
    });
  }

  if ((scoreGlobal?.score || 0) >= 75) {
    notificacoes.push({
      id: "notif_score_alto",
      tipo: "positivo",
      titulo: "Ótimo momento da sua jornada",
      mensagem:
        "Seu comportamento atual está bem alinhado com seus objetivos. Continue sustentando esse padrão para manter evolução consistente.",
      acao: "Manter ritmo",
    });
  }

  if ((totalCheckins || 0) < 2) {
    notificacoes.push({
      id: "notif_checkins_baixos",
      tipo: "lembrete",
      titulo: "Mais check-ins melhoram sua leitura comportamental",
      mensagem:
        "Registrar humor, energia e motivação ajuda o Fitelligence a cruzar comportamento com progresso e alimentação.",
      acao: "Fazer check-in",
    });
  }

  if (notificacoes.length === 0) {
    notificacoes.push({
      id: "notif_estado_estavel",
      tipo: "positivo",
      titulo: "Seu painel está equilibrado",
      mensagem:
        "Nenhum alerta crítico foi identificado agora. Continue registrando seus dados para manter o acompanhamento inteligente ativo.",
      acao: "Continuar jornada",
    });
  }

  return notificacoes;
}

// ======================================================
// Controller principal do dashboard
// ======================================================
exports.getDashboard = async (req, res) => {
  try {
    // ====================================================
    // Identificação flexível do usuário autenticado
    // ====================================================
    const usuario_id = req.usuario?.id || req.user?.id || req.usuarioId;

    if (!usuario_id) {
      return res.status(401).json({
        erro: "Usuário não autenticado",
      });
    }

    // ====================================================
    // Usuário autenticado
    // ====================================================
    const [usuarioRows] = await connection.query(
      `
      SELECT
        id,
        nome,
        email,
        plano,
        objetivo,
        meta_calorica,
        meta_agua,
        meta_passos,
        nivel_usuario,
        frequencia_treino_base,
        intensidade_treino_base,
        tipo_treino_base
      FROM usuarios
      WHERE id = ?
      LIMIT 1
      `,
      [usuario_id]
    );

    const usuarioAtual =
      usuarioRows && usuarioRows.length > 0
        ? {
            id: usuarioRows[0].id,
            nome: usuarioRows[0].nome,
            email: usuarioRows[0].email,
            plano: usuarioRows[0].plano || "free",
            objetivo: usuarioRows[0].objetivo || null,
            meta_calorica: usuarioRows[0].meta_calorica || null,
            meta_agua: usuarioRows[0].meta_agua || null,
            meta_passos: usuarioRows[0].meta_passos || null,
            nivel_usuario: usuarioRows[0].nivel_usuario || null,
            frequencia_treino_base:
              usuarioRows[0].frequencia_treino_base || null,
            intensidade_treino_base:
              usuarioRows[0].intensidade_treino_base || null,
            tipo_treino_base: usuarioRows[0].tipo_treino_base || null,
          }
        : null;

    // ==================================================
    // BLOCO 1 - PROGRESSO CORPORAL
    // ==================================================
    const [progresso] = await connection.query(
      `
      SELECT
        id,
        peso,
        cintura,
        observacao,
        data_registro,
        criado_em
      FROM progresso
      WHERE usuario_id = ?
      ORDER BY data_registro ASC, id ASC
      `,
      [usuario_id]
    );

    // ==================================================
    // BLOCO 1.1 - ÚLTIMO PROGRESSO
    // Facilita leitura direta do frontend
    // ==================================================
    const [ultimoProgressoRows] = await connection.query(
      `
      SELECT
        id,
        peso,
        cintura,
        observacao,
        data_registro,
        criado_em
      FROM progresso
      WHERE usuario_id = ?
      ORDER BY data_registro DESC, id DESC
      LIMIT 1
      `,
      [usuario_id]
    );

    // ==================================================
    // BLOCO 2 - PLANO ATUAL
    // ==================================================
    const [planos] = await connection.query(
      `
      SELECT
        id,
        calorias,
        dieta,
        criado_em
      FROM planos
      WHERE usuario_id = ?
      ORDER BY id DESC
      LIMIT 1
      `,
      [usuario_id]
    );

    // ==================================================
    // BLOCO 3 - HÁBITOS
    // ==================================================
    const [habitos] = await connection.query(
      `
      SELECT
        id,
        agua_ml,
        horas_sono,
        passos,
        treino_realizado,
        data_registro,
        criado_em
      FROM habitos
      WHERE usuario_id = ?
      ORDER BY data_registro DESC, id DESC
      `,
      [usuario_id]
    );

    // ==================================================
    // BLOCO 4 - CHECK-INS
    // ==================================================
    const [checkins] = await connection.query(
      `
      SELECT
        id,
        humor,
        fome,
        energia,
        motivacao,
        observacao,
        data_registro,
        criado_em
      FROM checkins
      WHERE usuario_id = ?
      ORDER BY data_registro DESC, id DESC
      LIMIT 7
      `,
      [usuario_id]
    );

    // ==================================================
    // BLOCO 5 - METAS ATIVAS
    // ==================================================
    const [metasAtivas] = await connection.query(
      `
      SELECT
        id,
        descricao AS titulo,
        descricao,
        tipo,
        valor_meta,
        NULL AS valor_atual,
        status,
        data_inicio,
        data_fim AS prazo,
        criado_em
      FROM metas
      WHERE usuario_id = ?
        AND status = 'ativa'
      ORDER BY id DESC
      `,
      [usuario_id]
    );

    // ==================================================
    // BLOCO 5.1 - META ATIVA PRINCIPAL
    // A primeira meta ativa será usada no dashboard
    // como referência principal
    // ==================================================
    const metaAtivaPrincipal = metasAtivas.length > 0 ? metasAtivas[0] : null;

    // ==================================================
    // BLOCO 6 - METAS CONCLUÍDAS
    // ==================================================
    const [metasConcluidas] = await connection.query(
      `
      SELECT
        id,
        descricao AS titulo,
        descricao,
        tipo,
        valor_meta,
        NULL AS valor_atual,
        status,
        data_inicio,
        data_fim AS prazo,
        criado_em
      FROM metas
      WHERE usuario_id = ?
        AND status = 'concluida'
      ORDER BY id DESC
      LIMIT 5
      `,
      [usuario_id]
    );

    // ==================================================
    // BLOCO 7 - RESUMO DO ONBOARDING
    // ==================================================
    const onboardingResumo =
      await buscarResumoOnboardingPorUsuario(usuario_id);

    // ==================================================
    // BLOCO 7.1 - PLANO DO DIA
    // Gera ou reutiliza um plano isolado do dia atual.
    // Falha aqui nao pode derrubar o dashboard inteiro.
    // ==================================================
    let dailyPlan = null;
    let execucaoPlanoDoDia = null;
    let scoreDia = 0;
    let streakDias = 0;
    let motivacaoDoDia = null;

    try {
      dailyPlan = await dailyPlanService.obterPlanoDoDia(usuario_id);
    } catch (error) {
      console.warn(
        "[DASHBOARD] falha ao obter plano do dia para usuario:",
        usuario_id,
        error.message
      );
    }

    try {
      const executionResumo =
        await dailyPlanExecutionService.obterExecucaoDoDia(usuario_id);

      execucaoPlanoDoDia = executionResumo?.execution || null;
      scoreDia = executionResumo?.score_dia || 0;
      streakDias = executionResumo?.streak_dias || 0;
      motivacaoDoDia = executionResumo?.motivacao_do_dia || null;
    } catch (error) {
      console.warn(
        "[DASHBOARD] falha ao obter execucao do plano do dia para usuario:",
        usuario_id,
        error.message
      );
    }

    // ==================================================
    // BLOCO 8 - ANÁLISES DE REFEIÇÃO
    // ==================================================
    const [analisesRefeicao] = await connection.query(
      `
      SELECT
        id,
        calorias_estimadas,
        proteinas,
        carboidratos,
        gorduras,
        classificacao,
        descricao,
        observacoes,
        tipo_refeicao,
        criado_em
      FROM analises_refeicao
      WHERE usuario_id = ?
      ORDER BY id DESC
      LIMIT 12
      `,
      [usuario_id]
    );

    // ==================================================
    // BLOCO 9 - ALERTAS GERAIS
    // ==================================================
    let alertas = [];

    try {
      const [alertasRows] = await connection.query(
        `
        SELECT
          id,
          titulo,
          mensagem,
          nivel,
          criado_em
        FROM alertas
        WHERE usuario_id = ?
        ORDER BY id DESC
        LIMIT 10
        `,
        [usuario_id]
      );

      alertas = alertasRows;
    } catch (error) {
      // ------------------------------------------------
      // Tabela pode não existir em alguns ambientes
      // Não quebramos o dashboard por isso
      // ------------------------------------------------
      alertas = [];
    }

    // ==================================================
    // BLOCO 10 - PROGRESSO CONSOLIDADO
    // ==================================================
    const historicoProgresso = [...progresso].reverse().map((item) => ({
      id: item.id,
      peso: item.peso,
      cintura: item.cintura,
      observacao: item.observacao || null,
      data_registro: item.data_registro,
      criado_em: item.criado_em,
    }));

    const ultimoRegistro =
      ultimoProgressoRows && ultimoProgressoRows.length > 0
        ? ultimoProgressoRows[0]
        : null;

    const pesoInicial =
      progresso.length > 0 ? Number(progresso[0].peso || 0) : 0;

    const pesoAtual =
      ultimoRegistro && ultimoRegistro.peso !== null
        ? Number(ultimoRegistro.peso || 0)
        : 0;

    const perdaTotal =
      pesoInicial && pesoAtual
        ? Number((pesoInicial - pesoAtual).toFixed(1))
        : 0;

    // ==================================================
    // BLOCO 11 - PLANO MAIS RECENTE
    // ==================================================
    const ultimoPlano = planos && planos.length > 0 ? planos[0] : null;

    // ==================================================
    // BLOCO 12 - HÁBITOS E CONSISTÊNCIA
    // ==================================================
    const totalHabitos = habitos.length;

    const habitosConcluidos = habitos.filter((item) => {
      const agua = Number(item.agua_ml || 0);
      const sono = Number(item.horas_sono || 0);
      const passos = Number(item.passos || 0);
      const treino = Number(item.treino_realizado || 0);

      return agua > 0 || sono > 0 || passos > 0 || treino > 0;
    }).length;

    const scoreConsistencia =
      totalHabitos > 0
        ? Math.max(
            0,
            Math.min(100, Math.round((habitosConcluidos / totalHabitos) * 100))
          )
        : 0;

    const mediaAgua =
      totalHabitos > 0
        ? Math.round(
            habitos.reduce((acc, item) => acc + Number(item.agua_ml || 0), 0) /
              totalHabitos
          )
        : 0;

    const mediaSono =
      totalHabitos > 0
        ? Number(
            (
              habitos.reduce(
                (acc, item) => acc + Number(item.horas_sono || 0),
                0
              ) / totalHabitos
            ).toFixed(1)
          )
        : 0;

    const mediaPassos =
      totalHabitos > 0
        ? Math.round(
            habitos.reduce((acc, item) => acc + Number(item.passos || 0), 0) /
              totalHabitos
          )
        : 0;

    // ==================================================
    // BLOCO 13 - CHECK-INS E LEITURA DE ESTADO
    // ==================================================
    const totalCheckins = checkins.length;

    const historicoCheckins = [...checkins].reverse().map((item) => ({
      id: item.id,
      humor: item.humor,
      fome: item.fome,
      energia: item.energia,
      motivacao: item.motivacao,
      observacao: item.observacao || null,
      data_registro: item.data_registro,
      criado_em: item.criado_em,
    }));

    const mapaNivel = {
      baixa: 1,
      medio: 2,
      média: 2,
      media: 2,
      alta: 3,
      muito_bem: 4,
      bem: 3,
      normal: 2,
      mal: 1,
      muito_mal: 0,
    };

    const calcularMediaNivel = (lista, campo) => {
      if (!lista.length) return null;

      const valoresValidos = lista
        .map((item) => {
          const valor = String(item[campo] || "").toLowerCase();
          return Object.prototype.hasOwnProperty.call(mapaNivel, valor)
            ? mapaNivel[valor]
            : null;
        })
        .filter((valor) => valor !== null);

      if (!valoresValidos.length) return null;

      const media =
        valoresValidos.reduce((acc, valor) => acc + valor, 0) /
        valoresValidos.length;

      return Number(media.toFixed(1));
    };

    const energiaMedia = calcularMediaNivel(checkins, "energia");
    const humorMedio = calcularMediaNivel(checkins, "humor");
    const motivacaoMedia = calcularMediaNivel(checkins, "motivacao");

    // ==================================================
    // BLOCO 14 - PROCESSAMENTO DOS DADOS ALIMENTARES
    // ==================================================
    const totalRefeicoesAnalisadas = analisesRefeicao.length;

    const mediaCaloriasRefeicoes =
      totalRefeicoesAnalisadas > 0
        ? Number(
            (
              analisesRefeicao.reduce(
                (acc, item) => acc + Number(item.calorias_estimadas || 0),
                0
              ) / totalRefeicoesAnalisadas
            ).toFixed(1)
          )
        : 0;

    const mediaProteinas =
      totalRefeicoesAnalisadas > 0
        ? Number(
            (
              analisesRefeicao.reduce(
                (acc, item) => acc + Number(item.proteinas || 0),
                0
              ) / totalRefeicoesAnalisadas
            ).toFixed(1)
          )
        : 0;

    const mediaCarboidratos =
      totalRefeicoesAnalisadas > 0
        ? Number(
            (
              analisesRefeicao.reduce(
                (acc, item) => acc + Number(item.carboidratos || 0),
                0
              ) / totalRefeicoesAnalisadas
            ).toFixed(1)
          )
        : 0;

    const mediaGorduras =
      totalRefeicoesAnalisadas > 0
        ? Number(
            (
              analisesRefeicao.reduce(
                (acc, item) => acc + Number(item.gorduras || 0),
                0
              ) / totalRefeicoesAnalisadas
            ).toFixed(1)
          )
        : 0;

    const ultimaAnaliseRefeicao =
      analisesRefeicao.length > 0 ? analisesRefeicao[0] : null;

    const historicoRefeicoes = [...analisesRefeicao];

    // ==================================================
    // BLOCO 15 - INSIGHT ALIMENTAR
    // ==================================================
    const insightAlimentar = gerarInsightAlimentar(ultimaAnaliseRefeicao);

    // ==================================================
    // BLOCO 16 - RESUMO ALIMENTAR INTELIGENTE
    // ==================================================
    const resumoAlimentarInteligente =
      gerarResumoAlimentarInteligente(analisesRefeicao);

    // ==================================================
    // BLOCO 17 - ALERTAS ALIMENTARES
    // ==================================================
    const alertasAlimentares = [];

    if (totalRefeicoesAnalisadas >= 3 && mediaProteinas < 20) {
      alertasAlimentares.push(
        "Sua média de proteínas nas refeições recentes está abaixo do ideal."
      );
    }

    if (totalRefeicoesAnalisadas >= 3 && mediaCaloriasRefeicoes > 700) {
      alertasAlimentares.push(
        "A média calórica das refeições recentes está elevada."
      );
    }

    if (
      ultimaAnaliseRefeicao &&
      String(ultimaAnaliseRefeicao.classificacao || "")
        .toLowerCase()
        .includes("ruim")
    ) {
      alertasAlimentares.push(
        "A análise alimentar mais recente ficou abaixo do ideal."
      );
    }

    // ==================================================
    // BLOCO 18 - RESUMO ALIMENTAR PARA DASHBOARD
    // ==================================================
    const resumoAlimentarDashboard = gerarResumoAlimentarDashboard(
      analisesRefeicao,
      alertasAlimentares
    );

    const scoreAlimentar = resumoAlimentarDashboard.score || 0;

    // ==================================================
    // BLOCO 19 - META + PROGRESSO
    // Calcula progresso simples da meta principal
    // ==================================================
    let progressoMetaPercentual = 0;

    if (
      metaAtivaPrincipal &&
      metaAtivaPrincipal.tipo === "peso" &&
      pesoAtual > 0 &&
      Number(metaAtivaPrincipal.valor_meta || 0) > 0
    ) {
      const valorMeta = Number(metaAtivaPrincipal.valor_meta || 0);

      // ------------------------------------------------
      // Regra simples para meta de emagrecimento:
      // quanto mais o peso atual se aproxima do peso meta,
      // maior o progresso percentual
      // ------------------------------------------------
      if (pesoInicial > valorMeta && pesoAtual >= valorMeta) {
        const totalNecessario = pesoInicial - valorMeta;
        const jaEvoluiu = pesoInicial - pesoAtual;

        if (totalNecessario > 0) {
          progressoMetaPercentual = Math.max(
            0,
            Math.min(100, Math.round((jaEvoluiu / totalNecessario) * 100))
          );
        }
      } else if (pesoAtual <= valorMeta) {
        progressoMetaPercentual = 100;
      }
    }

    // ==================================================
    // BLOCO 20 - ALERTAS ESTRATÉGICOS
    // ==================================================
    if (!metaAtivaPrincipal && onboardingResumo?.perfil_tipo === "usuario") {
      alertas.push({
        titulo: "Defina uma meta principal",
        mensagem:
          "Usuários com meta ativa tendem a ter um acompanhamento mais claro da evolução.",
        nivel: "atencao",
      });
    }

    if (progresso.length === 0) {
      alertas.push({
        titulo: "Registre seu primeiro progresso",
        mensagem:
          "Sem dados de progresso corporal, o dashboard perde poder de leitura estratégica.",
        nivel: "atencao",
      });
    }

    // ==================================================
    // BLOCO 21 - RESUMO GERAL
    // ==================================================
    const resumo = {
      pesoInicial,
      pesoAtual,
      perdaTotal,
      consistencia: scoreConsistencia,
      energiaMedia,
      humorMedio,
      motivacaoMedia,
      totalCheckins,
      mediaAgua,
      mediaSono,
      mediaPassos,
    };

    const hoje = new Date().toISOString().slice(0, 10);

    const habitoHoje =
      habitos.find(
        (item) => String(item.data_registro || "").slice(0, 10) === hoje
      ) || null;

    const checkinHoje =
      checkins.find(
        (item) => String(item.data_registro || "").slice(0, 10) === hoje
      ) || null;

    const refeicoesHoje = analisesRefeicao.filter(
      (item) => String(item.criado_em || "").slice(0, 10) === hoje
    );

    const caloriasConsumidasHoje = refeicoesHoje.reduce(
      (acc, item) => acc + Number(item.calorias_estimadas || 0),
      0
    );

    let acaoPrincipalDoDia = {
      tipo: "continuar_jornada",
      titulo: "Continuar jornada",
      descricao:
        "Mantenha seus registros para o Fitelligence acompanhar sua evolução.",
      cta_label: "Abrir dashboard",
      cta_destino: "/dashboard",
    };

    if (refeicoesHoje.length === 0) {
      acaoPrincipalDoDia = {
        tipo: "registrar_refeicao",
        titulo: "Registrar refeição",
        descricao: "Sua alimentação de hoje ainda não foi registrada.",
        cta_label: "Registrar refeição",
        cta_destino: "/plano-alimentar",
      };
    } else if (!checkinHoje) {
      acaoPrincipalDoDia = {
        tipo: "fazer_checkin",
        titulo: "Fazer check-in",
        descricao: "Seu check-in de hoje ainda não foi registrado.",
        cta_label: "Fazer check-in",
        cta_destino: "/checkins",
      };
    } else if (!habitoHoje) {
      acaoPrincipalDoDia = {
        tipo: "acompanhar_metas",
        titulo: "Acompanhar metas",
        descricao: "Atualize água, passos e treino para fechar melhor o dia.",
        cta_label: "Ver metas",
        cta_destino: "/metas",
      };
    }

    const resumoExecucaoDiaria = {
      calorias_consumidas_hoje: caloriasConsumidasHoje,
      agua_hoje: Number(
        execucaoPlanoDoDia?.agua_consumida_ml ?? habitoHoje?.agua_ml ?? 0
      ),
      passos_hoje: Number(
        execucaoPlanoDoDia?.passos_realizados ?? habitoHoje?.passos ?? 0
      ),
      checkin_realizado_hoje: Boolean(
        execucaoPlanoDoDia?.checkin_realizado ?? checkinHoje
      ),
      treino_realizado_hoje: Boolean(
        execucaoPlanoDoDia?.treino_concluido ?? habitoHoje?.treino_realizado
      ),
    };

    const usuarioSeguro = usuarioAtual || {};
    const onboardingRespostasSeguras =
      onboardingResumo?.onboarding_respostas || {};
    const barreiraPrincipal =
      onboardingRespostasSeguras?.motivacao?.principal_barreira || "";

    const ajusteAdaptativo = gerarAjusteAdaptativo({
      dashboard: {
        score_dia: scoreDia,
        streak_dias: streakDias,
        execucao_plano_do_dia: execucaoPlanoDoDia || {},
      },
      usuario: usuarioSeguro,
    });

    const coachDoDia = gerarCoachDoDia({
      scoreDia,
      streakDias,
      objetivo: usuarioSeguro?.objetivo || "",
      barreira: barreiraPrincipal,
      execucao: execucaoPlanoDoDia || {},
    });

    // ==================================================
    // BLOCO 21.1 - SCORE GLOBAL DO USUÁRIO
    // ==================================================
    let scoreProgresso = 0;

    if (perdaTotal > 0) {
      scoreProgresso = Math.min(100, perdaTotal * 10);
    }

    if (metaAtivaPrincipal && progressoMetaPercentual > scoreProgresso) {
      scoreProgresso = progressoMetaPercentual;
    }

    const scoreGlobal = Math.round(
      scoreAlimentar * 0.4 +
        scoreConsistencia * 0.3 +
        scoreProgresso * 0.3
    );

    let classificacaoScore = "baixo";
    let mensagemScore =
      "Seu padrão atual ainda precisa de ajustes para gerar resultados consistentes.";

    if (scoreGlobal >= 80) {
      classificacaoScore = "excelente";
      mensagemScore =
        "Excelente consistência. Seu comportamento atual está altamente alinhado com seus objetivos.";
    } else if (scoreGlobal >= 60) {
      classificacaoScore = "bom";
      mensagemScore =
        "Bom progresso. Você já está no caminho certo, com ajustes finos podendo acelerar resultados.";
    } else if (scoreGlobal >= 40) {
      classificacaoScore = "medio";
      mensagemScore =
        "Seu desempenho está intermediário. Melhorias simples já podem gerar impacto significativo.";
    }

    const scoreGlobalData = {
      score: scoreGlobal,
      classificacao: classificacaoScore,
      mensagem: mensagemScore,
      breakdown: {
        alimentacao: scoreAlimentar,
        consistencia: scoreConsistencia,
        progresso: scoreProgresso,
      },
    };

    // ==================================================
    // BLOCO 21.2 - NOTIFICAÇÕES INTELIGENTES
    // ==================================================
    const notificacoesInteligentes = gerarNotificacoesInteligentes({
      scoreGlobal: scoreGlobalData,
      scoreAlimentar,
      scoreConsistencia,
      totalRefeicoesAnalisadas,
      resumoAlimentarDashboard,
      totalCheckins,
    });

    // ==================================================
    // BLOCO 22 - RESPOSTA FINAL
    // ==================================================
    return res.status(200).json({
      mensagem: "Dashboard completo carregado com sucesso",
      usuario: usuarioAtual,
      dashboard: {
        usuario: usuarioAtual,
        meta_calorica: usuarioAtual?.meta_calorica || null,
        meta_agua: usuarioAtual?.meta_agua || null,
        meta_passos: usuarioAtual?.meta_passos || null,
        nivel_usuario: usuarioAtual?.nivel_usuario || null,
        frequencia_treino_base: usuarioAtual?.frequencia_treino_base || null,
        intensidade_treino_base:
          usuarioAtual?.intensidade_treino_base || null,
        tipo_treino_base: usuarioAtual?.tipo_treino_base || null,
        acao_principal_do_dia: acaoPrincipalDoDia,
        resumo_execucao_diaria: resumoExecucaoDiaria,
        plano_do_dia: dailyPlan?.plano_do_dia || null,
        execucao_plano_do_dia: execucaoPlanoDoDia,
        score_dia: scoreDia,
        streak_dias: streakDias,
        motivacao_do_dia: motivacaoDoDia,
        ajuste_adaptativo: ajusteAdaptativo,
        coach_do_dia: coachDoDia,

        score_global: scoreGlobalData,
        notificacoes_inteligentes: notificacoesInteligentes,

        // ==============================================
        // DADOS DO ONBOARDING
        // ==============================================
        perfil_tipo: onboardingResumo?.perfil_tipo || null,
        onboarding_respostas: onboardingResumo?.onboarding_respostas || {},
        onboarding_concluido: onboardingResumo?.onboarding_concluido || false,
        onboarding_etapa_atual:
          onboardingResumo?.onboarding_etapa_atual || null,

        // ==============================================
        // RESUMO GERAL
        // ==============================================
        resumo,

        // ==============================================
        // PROGRESSO CORPORAL
        // ==============================================
        peso_inicial: pesoInicial,
        peso_atual: pesoAtual,
        perda_total: perdaTotal,
        total_registros_progresso: progresso.length,
        ultimo_registro: ultimoRegistro,
        ultimo_progresso: ultimoRegistro,
        historico_progresso: historicoProgresso,

        // ==============================================
        // PLANO
        // ==============================================
        ultimo_plano: ultimoPlano,

        // ==============================================
        // HÁBITOS
        // ==============================================
        habitos,
        total_habitos: totalHabitos,
        habitos_concluidos: habitosConcluidos,
        score_consistencia: scoreConsistencia,

        // ==============================================
        // CHECK-INS
        // ==============================================
        checkins,
        total_checkins: totalCheckins,
        historico_checkins: historicoCheckins,
        energia_media: energiaMedia,
        humor_medio: humorMedio,
        motivacao_media: motivacaoMedia,

        // ==============================================
        // METAS
        // ==============================================
        meta_ativa: metaAtivaPrincipal,
        meta_ativa_progresso_percentual: progressoMetaPercentual,
        metas_ativas: metasAtivas,
        metas_concluidas: metasConcluidas,

        // ==============================================
        // ALERTAS GERAIS
        // ==============================================
        alertas,

        // ==============================================
        // DADOS ALIMENTARES
        // ==============================================
        total_refeicoes_analisadas: totalRefeicoesAnalisadas,
        media_calorias_refeicoes: mediaCaloriasRefeicoes,
        media_proteinas: mediaProteinas,
        media_carboidratos: mediaCarboidratos,
        media_gorduras: mediaGorduras,
        ultima_analise_refeicao: ultimaAnaliseRefeicao,
        historico_refeicoes: historicoRefeicoes,

        // ==============================================
        // BLOCO PARA O FOOD ANALYSIS PANEL
        // ==============================================
        insight_alimentar: insightAlimentar,

        // ==============================================
        // INTELIGÊNCIA ALIMENTAR
        // ==============================================
        score_alimentar: scoreAlimentar,
        alertas_alimentares: alertasAlimentares,
        resumo_alimentar_inteligente: resumoAlimentarInteligente,
        resumo_alimentar_dashboard: resumoAlimentarDashboard,
      },
    });
  } catch (error) {
    console.error("Erro ao buscar dashboard:", error);

    return res.status(500).json({
      erro: "Erro interno ao buscar dashboard",
      detalhe: error.message,
    });
  }
};
