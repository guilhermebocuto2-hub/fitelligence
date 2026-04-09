"use strict";

// ======================================================
// Reconciliação real (não destrutiva) de seções onboarding
// Objetivo:
// - corrigir semântica promovendo a linha vencedora para seção canônica
// - NÃO deletar duplicadas nesta etapa
// - gerar fila segura de remoção posterior
//
// Segurança:
// - operações por id + onboarding_id
// - sem update em massa sem WHERE determinístico
// ======================================================

const fs = require("fs");
const path = require("path");
const db = require("../database/connection");

// ======================================================
// Mapa de aliases -> seção canônica
// (alinhado ao dry-run e ao onboarding atual)
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

function normalizarTextoSecao(valor) {
  return String(valor || "")
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, "_")
    .replace(/-/g, "_");
}

function canonicalizarSecao(secao) {
  const chaveNormalizada = normalizarTextoSecao(secao);
  return (
    MAPA_SECOES_CANONICAS[chaveNormalizada] ||
    String(secao || "").trim().toLowerCase()
  );
}

function ehSecaoJaCanonica(secaoOriginal, secaoCanonica) {
  return (
    String(secaoOriginal || "").trim().toLowerCase() ===
    String(secaoCanonica || "").trim().toLowerCase()
  );
}

// ======================================================
// Regra determinística de escolha da vencedora:
// 1) seção já canônica
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

function garantirDiretorioSaida() {
  const reportsDir = path.join(__dirname, "reports");
  fs.mkdirSync(reportsDir, { recursive: true });
  return reportsDir;
}

function escreverFilaSegura(payload) {
  const reportsDir = garantirDiretorioSaida();
  const stamp = new Date().toISOString().replace(/[:.]/g, "-");
  const filePath = path.join(
    reportsDir,
    `onboardingReconciliationQueue_${stamp}.json`
  );
  fs.writeFileSync(filePath, JSON.stringify(payload, null, 2), "utf8");
  return filePath;
}

async function main() {
  let totalRegistros = 0;
  let totalOnboardingsAfetados = 0;
  let totalGruposConflito = 0;
  let totalLinhasAtualizadas = 0;
  let totalLinhasReconciliadas = 0;

  const conflitosProcessados = [];
  const candidatosRemocaoSegura = [];

  try {
    const [rows] = await db.execute(
      `
      SELECT
        r.id,
        r.onboarding_id,
        o.usuario_id,
        r.secao
      FROM onboarding_respostas r
      INNER JOIN onboardings o ON o.id = r.onboarding_id
      ORDER BY r.onboarding_id ASC, r.id DESC
      `
    );

    totalRegistros = rows.length;

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

    const onboardingsAfetados = new Set();
    const secoesStats = new Map();

    // ====================================================
    // Processa apenas grupos em conflito semântico
    // ====================================================
    for (const grupo of grupos.values()) {
      if (!grupo.linhas || grupo.linhas.length <= 1) continue;

      const manter = escolherLinhaMantida(grupo.linhas);
      const reconciliar = grupo.linhas.filter((l) => l.id !== manter.id);

      onboardingsAfetados.add(grupo.onboarding_id);
      totalGruposConflito += 1;
      totalLinhasReconciliadas += reconciliar.length;

      // ==================================================
      // Atualiza apenas a vencedora para forma canônica
      // quando necessário (idempotente e seguro por id)
      // ==================================================
      let vencedoraAtualizada = false;
      if (!manter.ehCanonica) {
        const [result] = await db.execute(
          `
          UPDATE onboarding_respostas
          SET secao = ?
          WHERE id = ?
            AND onboarding_id = ?
          LIMIT 1
          `,
          [grupo.secao_canonica, manter.id, grupo.onboarding_id]
        );

        if (result && result.affectedRows > 0) {
          totalLinhasAtualizadas += 1;
          vencedoraAtualizada = true;
        }
      }

      // ==================================================
      // Não deletar duplicadas agora:
      // adicionar à fila segura de remoção futura
      // ==================================================
      for (const linha of reconciliar) {
        candidatosRemocaoSegura.push({
          onboarding_id: grupo.onboarding_id,
          usuario_id: grupo.usuario_id,
          secao_canonica: grupo.secao_canonica,
          id_linha: linha.id,
          secao_original: linha.secao_original,
          motivo: "duplicidade_semantica",
          linha_vencedora_id: manter.id,
        });
      }

      conflitosProcessados.push({
        onboarding_id: grupo.onboarding_id,
        usuario_id: grupo.usuario_id,
        secao_canonica: grupo.secao_canonica,
        manter: {
          ...manter,
          atualizada_para_canonica: vencedoraAtualizada,
        },
        reconciliar,
      });

      if (!secoesStats.has(grupo.secao_canonica)) {
        secoesStats.set(grupo.secao_canonica, {
          secao: grupo.secao_canonica,
          grupos_conflito: 0,
          linhas_reconciliadas: 0,
        });
      }

      const stat = secoesStats.get(grupo.secao_canonica);
      stat.grupos_conflito += 1;
      stat.linhas_reconciliadas += reconciliar.length;
    }

    totalOnboardingsAfetados = onboardingsAfetados.size;

    const secoesMaisAfetadas = [...secoesStats.values()].sort((a, b) => {
      if (b.linhas_reconciliadas !== a.linhas_reconciliadas) {
        return b.linhas_reconciliadas - a.linhas_reconciliadas;
      }
      return b.grupos_conflito - a.grupos_conflito;
    });

    const payloadFilaSegura = {
      gerado_em: new Date().toISOString(),
      total_candidatos_remocao_segura: candidatosRemocaoSegura.length,
      candidatos_remocao_segura: candidatosRemocaoSegura,
      conflitos_processados: conflitosProcessados,
    };

    const filaPath = escreverFilaSegura(payloadFilaSegura);

    // ====================================================
    // Resumo final da execução real (não destrutiva)
    // ====================================================
    const resumo = {
      mode: "apply_non_destructive",
      total_registros_onboarding_respostas: totalRegistros,
      total_onboardings_afetados: totalOnboardingsAfetados,
      total_grupos_com_conflito: totalGruposConflito,
      total_linhas_atualizadas_para_canonica: totalLinhasAtualizadas,
      total_linhas_reconciliadas_em_fila_segura: totalLinhasReconciliadas,
      secoes_mais_afetadas: secoesMaisAfetadas,
      arquivo_fila_remocao_segura: filaPath,
    };

    console.log(
      `[RECONCILE] linhas atualizadas para canônica: ${resumo.total_linhas_atualizadas_para_canonica}`
    );
    console.log(
      `[RECONCILE] linhas reconciliadas em fila segura: ${resumo.total_linhas_reconciliadas_em_fila_segura}`
    );
    console.log(
      `[RECONCILE] grupos com conflito: ${resumo.total_grupos_com_conflito}`
    );
    console.log(
      `[RECONCILE] onboardings afetados: ${resumo.total_onboardings_afetados}`
    );
    console.log(
      `[RECONCILE] fila segura salva em: ${resumo.arquivo_fila_remocao_segura}`
    );
    console.log(JSON.stringify(resumo, null, 2));
  } catch (error) {
    console.error("[RECONCILE] erro na reconciliação:", error.message);
    process.exitCode = 1;
  } finally {
    try {
      await db.end();
    } catch (error) {
      // encerramento defensivo
    }
  }
}

main();
