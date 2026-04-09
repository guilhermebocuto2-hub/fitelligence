// ======================================================
// Model do onboarding
// Responsável por acessar o banco de dados
// e manter o fluxo do onboarding sincronizado com:
// - tabela onboardings
// - tabela onboarding_respostas
// - tabela usuarios
//
// REGRA IMPORTANTE DE ARQUITETURA:
// - Na tabela usuarios, o campo oficial do perfil é tipo_usuario
// - perfil_tipo continua existindo apenas no contexto do onboarding
// ======================================================

const connection = require("../database/connection");

// ======================================================
// Mapa de aliases para seção canônica
// Mantém consistência semântica durante a janela de migração
// ======================================================
const MAPA_SECOES_CANONICAS = {
  alimentacao: "nutricao",
  food: "nutricao",
  diet: "nutricao",

  perfil: "perfil",
  profile: "perfil",

  objetivo: "objetivo",
  goal: "objetivo",

  "dados-fisicos": "dados-fisicos",
  dados_fisicos: "dados-fisicos",
  body_data: "dados-fisicos",
  "body-data": "dados-fisicos",

  rotina: "rotina",
  routine: "rotina",

  nutricao: "nutricao",
  nutrition: "nutricao",

  motivacao: "motivacao",
  motivation: "motivacao",

  resumo: "resumo",
  summary: "resumo",
};

// ======================================================
// Normaliza texto para comparação de seção
// ======================================================
function normalizarTextoSecao(valor) {
  return String(valor || "")
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, "_")
    .replace(/-/g, "_");
}

// ======================================================
// Converte seção para forma canônica
// ======================================================
function canonicalizarSecao(secao) {
  const chaveNormalizada = normalizarTextoSecao(secao);
  return (
    MAPA_SECOES_CANONICAS[chaveNormalizada] ||
    String(secao || "").trim().toLowerCase()
  );
}

// ======================================================
// Indica se a seção já está salva no formato canônico
// ======================================================
function ehSecaoJaCanonica(secaoOriginal, secaoCanonica) {
  return String(secaoOriginal || "").trim().toLowerCase() ===
    String(secaoCanonica || "").trim().toLowerCase();
}

// ======================================================
// Buscar onboarding por usuário
// ======================================================
exports.buscarOnboardingPorUsuario = async (usuarioId) => {
  const [rows] = await connection.execute(
    `
    SELECT *
    FROM onboardings
    WHERE usuario_id = ?
    LIMIT 1
    `,
    [usuarioId]
  );

  return rows[0] || null;
};

// ======================================================
// Criar onboarding
// Responsável por:
// - iniciar o fluxo principal do onboarding
// - salvar perfil escolhido dentro do contexto do onboarding
// - marcar status inicial como em andamento
// ======================================================
exports.criarOnboarding = async ({ usuarioId, perfilTipo }) => {
  const [result] = await connection.execute(
    `
    INSERT INTO onboardings (
      usuario_id,
      perfil_tipo,
      status
    )
    VALUES (?, ?, 'em_andamento')
    `,
    [usuarioId, perfilTipo]
  );

  return result.insertId;
};

// ======================================================
// Atualizar etapa atual do onboarding
// ======================================================
exports.atualizarEtapa = async ({ usuarioId, etapaAtual }) => {
  await connection.execute(
    `
    UPDATE onboardings
    SET
      etapa_atual = ?,
      status = 'em_andamento'
    WHERE usuario_id = ?
    `,
    [etapaAtual, usuarioId]
  );
};

// ======================================================
// Buscar resposta por seção
// ======================================================
exports.buscarRespostaPorSecao = async ({
  onboardingId,
  secao,
  secoesEquivalentes = [],
}) => {
  // ====================================================
  // Compatibilidade temporária:
  // permite buscar seção canônica + aliases legados
  // durante a janela de migração de dados
  // ====================================================
  const secoesBusca = Array.from(
    new Set(
      [secao, ...(Array.isArray(secoesEquivalentes) ? secoesEquivalentes : [])]
        .map((item) => String(item || "").trim().toLowerCase())
        .filter(Boolean)
    )
  );

  // ====================================================
  // Caminho original preservado quando não há equivalentes
  // ====================================================
  if (secoesBusca.length <= 1) {
    const [rows] = await connection.execute(
      `
      SELECT *
      FROM onboarding_respostas
      WHERE onboarding_id = ? AND secao = ?
      LIMIT 1
      `,
      [onboardingId, secao]
    );

    return rows[0] || null;
  }

  const placeholders = secoesBusca.map(() => "?").join(", ");
  const [rows] = await connection.execute(
    `
    SELECT *
    FROM onboarding_respostas
    WHERE onboarding_id = ?
      AND secao IN (${placeholders})
    ORDER BY
      CASE WHEN secao = ? THEN 0 ELSE 1 END,
      id DESC
    LIMIT 1
    `,
    [onboardingId, ...secoesBusca, secao]
  );

  return rows[0] || null;
};

// ======================================================
// Criar resposta de uma seção
// Responsável por salvar o bloco de respostas como JSON
// ======================================================
exports.criarResposta = async ({
  onboardingId,
  usuarioId,
  perfilTipo,
  secao,
  respostasJson,
}) => {
  await connection.execute(
    `
    INSERT INTO onboarding_respostas (
      onboarding_id,
      usuario_id,
      perfil_tipo,
      secao,
      respostas_json
    )
    VALUES (?, ?, ?, ?, ?)
    `,
    [onboardingId, usuarioId, perfilTipo, secao, JSON.stringify(respostasJson)]
  );
};

// ======================================================
// Atualizar resposta de uma seção já existente
// ======================================================
exports.atualizarResposta = async ({
  onboardingId,
  secao,
  respostasJson,
}) => {
  await connection.execute(
    `
    UPDATE onboarding_respostas
    SET respostas_json = ?
    WHERE onboarding_id = ? AND secao = ?
    `,
    [JSON.stringify(respostasJson), onboardingId, secao]
  );
};

// ======================================================
// Atualizar resposta por ID (determinístico)
// Responsável por:
// - evitar no-op silencioso em cenários com aliases legados
// - promover secao legado para secao canônica no mesmo update
// - manter segurança validando onboarding_id + id
//
// IMPORTANTE:
// - método aditivo (não substitui atualizarResposta existente)
// ======================================================
exports.atualizarRespostaPorId = async ({
  onboardingId,
  respostaId,
  secaoCanonica,
  respostasJson,
}) => {
  const [result] = await connection.execute(
    `
    UPDATE onboarding_respostas
    SET
      respostas_json = ?,
      secao = ?
    WHERE id = ?
      AND onboarding_id = ?
    LIMIT 1
    `,
    [
      JSON.stringify(respostasJson),
      secaoCanonica,
      respostaId,
      onboardingId,
    ]
  );

  if (!result || result.affectedRows === 0) {
    throw new Error("Falha ao atualizar resposta do onboarding por id");
  }
};

// ======================================================
// Listar todas as respostas do onboarding
// ======================================================
exports.listarRespostas = async (onboardingId) => {
  const [rows] = await connection.execute(
    `
    SELECT secao, respostas_json
    FROM onboarding_respostas
    WHERE onboarding_id = ?
    `,
    [onboardingId]
  );

  return rows;
};

// ======================================================
// Buscar resumo canônico do onboarding por usuário
// Responsável por:
// - usar apenas as tabelas oficiais (onboardings + onboarding_respostas)
// - expor status, etapa_atual, perfil_tipo, concluido_em
// - devolver respostas agrupadas por secao
//
// IMPORTANTE:
// - método aditivo (não substitui métodos existentes)
// - mantém compatibilidade com o sistema atual
// ======================================================
exports.buscarResumoCanonicoPorUsuario = async (usuarioId) => {
  // ====================================================
  // Busca o onboarding principal mais recente do usuário
  // ====================================================
  const [onboardingRows] = await connection.execute(
    `
    SELECT
      id,
      perfil_tipo,
      etapa_atual,
      status,
      concluido_em
    FROM onboardings
    WHERE usuario_id = ?
    ORDER BY id DESC
    LIMIT 1
    `,
    [usuarioId]
  );

  // ====================================================
  // Sem onboarding, devolve null para o consumidor decidir
  // fallback/estrutura padrão sem quebrar contratos atuais
  // ====================================================
  if (!onboardingRows || onboardingRows.length === 0) {
    return null;
  }

  const onboarding = onboardingRows[0];

  // ====================================================
  // Busca respostas salvas e agrupa por seção
  // ====================================================
  const [respostasRows] = await connection.execute(
    `
    SELECT
      id,
      secao,
      respostas_json
    FROM onboarding_respostas
    WHERE onboarding_id = ?
    ORDER BY id DESC
    `,
    [onboarding.id]
  );

  // ====================================================
  // Agrupa por seção canônica para evitar ambiguidade
  // quando houver legado + canônico para o mesmo significado
  // ====================================================
  const gruposPorSecaoCanonica = {};

  for (const item of respostasRows) {
    const secaoCanonica = canonicalizarSecao(item.secao);
    const chaveGrupo = String(secaoCanonica || "").trim().toLowerCase();

    let respostasParseadas = {};
    try {
      respostasParseadas =
        typeof item.respostas_json === "string"
          ? JSON.parse(item.respostas_json)
          : item.respostas_json || {};
    } catch (error) {
      respostasParseadas = {};
    }

    if (!gruposPorSecaoCanonica[chaveGrupo]) {
      gruposPorSecaoCanonica[chaveGrupo] = [];
    }

    gruposPorSecaoCanonica[chaveGrupo].push({
      id: item.id,
      secaoOriginal: item.secao,
      secaoCanonica,
      ehCanonica: ehSecaoJaCanonica(item.secao, secaoCanonica),
      respostas: respostasParseadas,
    });
  }

  const respostas = {};

  // ====================================================
  // Resolve cada grupo com regra determinística:
  // 1) prioriza linha já canônica
  // 2) em empate, usa id DESC
  // ====================================================
  for (const [secaoCanonica, linhas] of Object.entries(gruposPorSecaoCanonica)) {
    if (!linhas || linhas.length === 0) {
      continue;
    }

    let melhor = linhas[0];

    for (let i = 1; i < linhas.length; i += 1) {
      const atual = linhas[i];

      if (atual.ehCanonica && !melhor.ehCanonica) {
        melhor = atual;
        continue;
      }

      if (atual.ehCanonica === melhor.ehCanonica) {
        if (Number(atual.id || 0) > Number(melhor.id || 0)) {
          melhor = atual;
        }
      }
    }

    respostas[secaoCanonica] = melhor.respostas || {};

    // ==================================================
    // Sinaliza conflito semântico para observabilidade
    // antes da reconciliação em lote
    // ==================================================
    if (linhas.length > 1) {
      console.warn(
        "[ONBOARDING] conflito semântico detectado no resumo canônico:",
        {
          usuarioId,
          onboardingId: onboarding.id,
          secaoCanonica,
          totalLinhasEquivalentes: linhas.length,
          ids: linhas.map((linha) => linha.id),
          secoesOriginais: linhas.map((linha) => linha.secaoOriginal),
        }
      );
    }
  }

  return {
    status: onboarding.status || null,
    etapa_atual: onboarding.etapa_atual ?? null,
    perfil_tipo: onboarding.perfil_tipo || null,
    concluido_em: onboarding.concluido_em || null,
    respostas,
  };
};

// ======================================================
// Marcar onboarding como concluído
// ======================================================
exports.concluirOnboarding = async (usuarioId) => {
  await connection.execute(
    `
    UPDATE onboardings
    SET
      status = 'concluido',
      concluido_em = NOW()
    WHERE usuario_id = ?
    `,
    [usuarioId]
  );
};

// ======================================================
// Atualizar tabela principal de usuários quando o
// onboarding for concluído
//
// IMPORTANTE:
// Aqui usamos tipo_usuario como campo oficial do sistema
// ======================================================
exports.atualizarUsuario = async ({ usuarioId, perfilTipo }) => {
  await connection.execute(
    `
    UPDATE usuarios
    SET
      tipo_usuario = ?,
      onboarding_status = 'concluido',
      onboarding_concluido_em = NOW(),
      updated_at = NOW()
    WHERE id = ?
    `,
    [perfilTipo, usuarioId]
  );
};

// ======================================================
// Atualizar tabela principal de usuários para status
// "em andamento"
//
// IMPORTANTE:
// Também usamos tipo_usuario como campo oficial
// ======================================================
exports.atualizarUsuarioEmAndamento = async ({ usuarioId, perfilTipo }) => {
  await connection.execute(
    `
    UPDATE usuarios
    SET
      tipo_usuario = ?,
      onboarding_status = 'em_andamento',
      updated_at = NOW()
    WHERE id = ?
    `,
    [perfilTipo, usuarioId]
  );
};
