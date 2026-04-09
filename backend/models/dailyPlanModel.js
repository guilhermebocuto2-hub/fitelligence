const connection = require("../database/connection");

function parsePlanoJsonSeguro(planoJson) {
  if (!planoJson) {
    return null;
  }

  if (typeof planoJson === "object") {
    return planoJson;
  }

  try {
    return JSON.parse(planoJson);
  } catch (error) {
    console.warn("[DAILY_PLAN] plano_json invalido ignorado:", error.message);
    return null;
  }
}

class DailyPlanModel {
  // ======================================================
  // Busca o plano diário do usuário para a data informada
  // ======================================================
  static async buscarPorUsuarioEData({ usuarioId, data }) {
    const [rows] = await connection.execute(
      `
      SELECT
        id,
        usuario_id,
        data,
        plano_json,
        context_hash,
        status,
        created_at,
        updated_at
      FROM daily_plans
      WHERE usuario_id = ? AND data = ?
      LIMIT 1
      `,
      [usuarioId, data]
    );

    if (!rows[0]) {
      return null;
    }

    return {
      ...rows[0],
      plano_json: parsePlanoJsonSeguro(rows[0].plano_json),
    };
  }

  // ======================================================
  // Cria um novo plano diário
  // ======================================================
  static async criar({
    usuarioId,
    data,
    planoJson,
    contextHash = null,
    status = "gerado",
  }) {
    await connection.execute(
      `
      INSERT INTO daily_plans (
        usuario_id,
        data,
        plano_json,
        context_hash,
        status
      ) VALUES (?, ?, ?, ?, ?)
      `,
      [
        usuarioId,
        data,
        JSON.stringify(planoJson || {}),
        contextHash,
        status,
      ]
    );

    return this.buscarPorUsuarioEData({ usuarioId, data });
  }

  // ======================================================
  // Atualiza o plano existente do mesmo dia sem criar
  // novo registro, preservando a regra de 1 plano/dia.
  // ======================================================
  static async atualizarPorUsuarioEData({
    usuarioId,
    data,
    planoJson,
    contextHash,
    status = "atualizado",
  }) {
    await connection.execute(
      `
      UPDATE daily_plans
      SET
        plano_json = ?,
        context_hash = ?,
        status = ?
      WHERE usuario_id = ? AND data = ?
      `,
      [
        JSON.stringify(planoJson || {}),
        contextHash || null,
        status,
        usuarioId,
        data,
      ]
    );

    return this.buscarPorUsuarioEData({ usuarioId, data });
  }
}

module.exports = DailyPlanModel;
