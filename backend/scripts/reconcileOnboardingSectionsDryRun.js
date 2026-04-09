"use strict";

// ======================================================
// DRY-RUN de reconciliação de seções de onboarding
// Objetivo:
// - identificar duplicidades semânticas em onboarding_respostas
// - sugerir linha a manter vs linhas candidatas à reconciliação
// - NÃO modificar dados no banco nesta etapa
// ======================================================

const db = require("../database/connection");

// ======================================================
// Mapa de aliases -> seção canônica
// Mantido alinhado com a regra atual usada no onboarding
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
// Normaliza texto para comparação robusta de seção
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
// Canoniza seção usando o mapa atual de aliases
// ======================================================
function canonicalizarSecao(secao) {
  const chaveNormalizada = normalizarTextoSecao(secao);
  return (
    MAPA_SECOES_CANONICAS[chaveNormalizada] ||
    String(secao || "").trim().toLowerCase()
  );
}

// ======================================================
// Indica se a seção original já está no formato canônico
// ======================================================
function ehSecaoJaCanonica(secaoOriginal, secaoCanonica) {
  return (
    String(secaoOriginal || "").trim().toLowerCase() ===
    String(secaoCanonica || "").trim().toLowerCase()
  );
}

// ======================================================
// Escolhe a linha "vencedora" para manter:
// 1) prioriza seção já canônica
// 2) em empate, maior id
// ======================================================
function escolherLinhaMantida(linhas) {
  const ordenadas = [...linhas].sort((a, b) => {
    if (a.ehCanonica !== b.ehCanonica) {
      return a.ehCanonica ? -1 : 1;
    }
    return Number(b.id || 0) - Number(a.id || 0);
  });
  return ordenadas[0];
}

async function main() {
  const detalhesLimite = Number(process.env.DRY_RUN_LIMIT || 200);

  try {
    // ====================================================
    // Conta total de onboardings para cálculo de percentual
    // ====================================================
    const [onboardingsCountRows] = await db.execute(
      `
      SELECT COUNT(*) AS total_onboardings
      FROM onboardings
      `
    );
    const totalOnboardings = Number(onboardingsCountRows?.[0]?.total_onboardings || 0);

    // ====================================================
    // Leitura de respostas + vínculo com usuário
    // (somente SELECT: sem alteração de dados)
    // ====================================================
    const [rows] = await db.execute(
      `
      SELECT
        r.id,
        r.onboarding_id,
        o.usuario_id,
        r.secao,
        r.respostas_json
      FROM onboarding_respostas r
      INNER JOIN onboardings o ON o.id = r.onboarding_id
      ORDER BY r.onboarding_id ASC, r.id DESC
      `
    );

    // ====================================================
    // Agrupa por onboarding_id + secao canônica
    // ====================================================
    const grupos = new Map();

    for (const row of rows) {
      const secaoCanonica = canonicalizarSecao(row.secao);
      const chaveGrupo = `${row.onboarding_id}::${secaoCanonica}`;

      if (!grupos.has(chaveGrupo)) {
        grupos.set(chaveGrupo, {
          onboarding_id: row.onboarding_id,
          usuario_id: row.usuario_id,
          secao_canonica: secaoCanonica,
          linhas: [],
        });
      }

      grupos.get(chaveGrupo).linhas.push({
        id: row.id,
        secao_original: row.secao,
        ehCanonica: ehSecaoJaCanonica(row.secao, secaoCanonica),
      });
    }

    // ====================================================
    // Filtra conflitos (grupos com múltiplas linhas)
    // e calcula "manter" vs "reconciliar" em dry-run
    // ====================================================
    const conflitos = [];
    const onboardingsAfetados = new Set();
    const secoesStats = new Map();
    let totalLinhasCandidatas = 0;

    for (const grupo of grupos.values()) {
      if (!grupo.linhas || grupo.linhas.length <= 1) continue;

      const manter = escolherLinhaMantida(grupo.linhas);
      const reconciliar = grupo.linhas.filter((l) => l.id !== manter.id);

      conflitos.push({
        onboarding_id: grupo.onboarding_id,
        usuario_id: grupo.usuario_id,
        secao_canonica: grupo.secao_canonica,
        total_linhas_equivalentes: grupo.linhas.length,
        manter,
        reconciliar,
      });

      onboardingsAfetados.add(grupo.onboarding_id);
      totalLinhasCandidatas += reconciliar.length;

      if (!secoesStats.has(grupo.secao_canonica)) {
        secoesStats.set(grupo.secao_canonica, {
          secao: grupo.secao_canonica,
          grupos_conflito: 0,
          linhas_candidatas: 0,
        });
      }

      const stat = secoesStats.get(grupo.secao_canonica);
      stat.grupos_conflito += 1;
      stat.linhas_candidatas += reconciliar.length;
    }

    const secoesMaisAfetadas = [...secoesStats.values()].sort((a, b) => {
      if (b.linhas_candidatas !== a.linhas_candidatas) {
        return b.linhas_candidatas - a.linhas_candidatas;
      }
      return b.grupos_conflito - a.grupos_conflito;
    });

    const percentualAfetado =
      totalOnboardings > 0
        ? (onboardingsAfetados.size / totalOnboardings) * 100
        : 0;

    const resumo = {
      dry_run: true,
      total_onboardings: totalOnboardings,
      percentual_afetado: Number(percentualAfetado.toFixed(2)),
      total_registros_onboarding_respostas: rows.length,
      total_onboardings_afetados: onboardingsAfetados.size,
      total_grupos_com_conflito: conflitos.length,
      total_linhas_candidatas_reconciliacao: totalLinhasCandidatas,
      secoes_mais_afetadas: secoesMaisAfetadas,
      detalhes_limitados_em: detalhesLimite,
      detalhes_total: conflitos.length,
      detalhes: conflitos.slice(0, detalhesLimite),
    };

    // ====================================================
    // Saída principal do diagnóstico
    // ====================================================
    console.log(
      `[DRY-RUN] onboardings afetados: ${resumo.total_onboardings_afetados}`
    );
    console.log(
      `[DRY-RUN] percentual afetado: ${resumo.percentual_afetado}%`
    );
    console.log(
      `[DRY-RUN] grupos com conflito: ${resumo.total_grupos_com_conflito}`
    );
    console.log(
      `[DRY-RUN] linhas candidatas à reconciliação: ${resumo.total_linhas_candidatas_reconciliacao}`
    );
    console.log("[DRY-RUN] seções mais afetadas:");
    for (const item of resumo.secoes_mais_afetadas) {
      console.log(
        `  - ${item.secao}: grupos=${item.grupos_conflito}, candidatos=${item.linhas_candidatas}`
      );
    }

    // ====================================================
    // JSON completo para auditoria (mantidos vs reconciliar)
    // ====================================================
    console.log(JSON.stringify(resumo, null, 2));
  } catch (error) {
    console.error("[DRY-RUN] erro ao gerar diagnóstico:", error.message);
    process.exitCode = 1;
  } finally {
    try {
      await db.end();
    } catch (error) {
      // sem ação: encerramento defensivo
    }
  }
}

main();
