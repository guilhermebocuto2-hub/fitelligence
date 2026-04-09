// ======================================================
// Service responsável por buscar o resumo do onboarding
// para alimentar dashboard, perfil e personalização
// ======================================================

const db = require("../database/connection");
const onboardingModel = require("../models/onboardingModel");

// ======================================================
// Mapeia status canônico para boolean no contrato público
// ======================================================
function mapearStatusParaConcluido(status) {
  // ====================================================
  // Compatibiliza o status canônico do onboarding com o
  // formato esperado atualmente pelo dashboard
  // ====================================================
  return String(status || "").toLowerCase() === "concluido";
}

// ======================================================
// Converte qualquer perfil legado para o perfil unico
// ativo no app, mantendo compatibilidade de contrato.
// ======================================================
function normalizarPerfilTipoParaFluxoUnico() {
  return "usuario";
}

// ======================================================
// Valida se o resumo canônico está utilizável
// para evitar fallback desnecessário
// ======================================================
function ehResumoCanonicoValido(resumoCanonico) {
  if (!resumoCanonico || typeof resumoCanonico !== "object") {
    return false;
  }

  const respostas = resumoCanonico.respostas;
  const respostasValidas =
    respostas &&
    typeof respostas === "object" &&
    !Array.isArray(respostas);

  // ====================================================
  // Estrutura mínima para manter contrato público estável
  // ====================================================
  return (
    "status" in resumoCanonico ||
    "perfil_tipo" in resumoCanonico ||
    "etapa_atual" in resumoCanonico ||
    respostasValidas
  );
}

// ======================================================
// Fallback legado:
// usa tabela singular onboarding apenas quando
// a leitura canônica vier vazia ou inválida
// ======================================================
async function buscarResumoLegadoPorUsuario(usuarioId) {
  // ====================================================
  // Busca o onboarding principal do usuário
  // ====================================================
  const [onboardingRows] = await db.execute(
    `
      SELECT
        id,
        usuario_id,
        perfil_tipo,
        etapa_atual,
        respostas,
        concluido,
        criado_em,
        atualizado_em
      FROM onboarding
      WHERE usuario_id = ?
      LIMIT 1
    `,
    [usuarioId]
  );

  // ====================================================
  // Se não houver onboarding, devolve estrutura padrão
  // para evitar quebra no dashboard
  // ====================================================
  if (!onboardingRows || onboardingRows.length === 0) {
    return {
      perfil_tipo: null,
      onboarding_respostas: {},
      onboarding_concluido: false,
      onboarding_etapa_atual: 0,
    };
  }

  const onboarding = onboardingRows[0];

  // ====================================================
  // Busca respostas das seções do onboarding
  // ====================================================
  const [respostasRows] = await db.execute(
    `
      SELECT
        secao,
        respostas_json
      FROM onboarding_respostas
      WHERE onboarding_id = ?
    `,
    [onboarding.id]
  );

  const respostasAgrupadas = {};

  for (const item of respostasRows) {
    try {
      respostasAgrupadas[item.secao] =
        typeof item.respostas_json === "string"
          ? JSON.parse(item.respostas_json)
          : item.respostas_json || {};
    } catch (error) {
      respostasAgrupadas[item.secao] = {};
    }
  }

  // ====================================================
  // Compatibilidade:
  // se a coluna respostas da tabela onboarding estiver
  // preenchida, usamos como fallback complementar
  // ====================================================
  if (
    (!respostasRows || respostasRows.length === 0) &&
    onboarding.respostas
  ) {
    try {
      const respostasFallback =
        typeof onboarding.respostas === "string"
          ? JSON.parse(onboarding.respostas)
          : onboarding.respostas || {};

      if (
        respostasFallback &&
        typeof respostasFallback === "object" &&
        !Array.isArray(respostasFallback)
      ) {
        Object.assign(respostasAgrupadas, respostasFallback);
      }
    } catch (error) {
      // ==================================================
      // Se não conseguir parsear, mantém objeto vazio
      // sem quebrar o dashboard
      // ==================================================
    }
  }

  return {
    perfil_tipo: normalizarPerfilTipoParaFluxoUnico(),
    onboarding_respostas: respostasAgrupadas,
    onboarding_concluido: Boolean(onboarding.concluido),
    onboarding_etapa_atual: onboarding.etapa_atual || 0,
  };
}

// ======================================================
// Busca resumo do onboarding priorizando leitura canônica
// e preservando contrato público atual
// ======================================================
async function buscarResumoOnboardingPorUsuario(usuarioId) {
  // ====================================================
  // Fonte principal: leitura canônica via onboardingModel
  // ====================================================
  const resumoCanonico =
    await onboardingModel.buscarResumoCanonicoPorUsuario(usuarioId);

  if (ehResumoCanonicoValido(resumoCanonico)) {
    return {
      perfil_tipo: normalizarPerfilTipoParaFluxoUnico(),
      onboarding_respostas: resumoCanonico.respostas || {},
      onboarding_concluido: mapearStatusParaConcluido(resumoCanonico.status),
      onboarding_etapa_atual: resumoCanonico.etapa_atual ?? 0,
    };
  }

  // ====================================================
  // Fallback legado:
  // só executa se leitura canônica vier vazia ou inválida
  // ====================================================
  console.warn(
    "[ONBOARDING] fallback legado acionado para usuario:",
    usuarioId
  );
  return await buscarResumoLegadoPorUsuario(usuarioId);
}

module.exports = {
  buscarResumoOnboardingPorUsuario,
};
