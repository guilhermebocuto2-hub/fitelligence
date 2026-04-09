const connection = require("../database/connection");

function parseHabitosJsonSeguro(value) {
  if (!value) return null;
  if (typeof value === "object") return value;

  try {
    return JSON.parse(value);
  } catch (error) {
    console.warn("[DAILY_PLAN_EXECUTION] habitos_concluidos_json invalido:", error.message);
    return null;
  }
}

function toNullableString(value) {
  return value === undefined ? null : value;
}

function toBooleanFlag(value) {
  return Boolean(value) ? 1 : 0;
}

function toSafeInt(value, fallback = 0) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? Math.max(0, Math.round(parsed)) : fallback;
}

function toSafeJson(value) {
  if (value === undefined || value === null) {
    return null;
  }

  if (typeof value === "string") {
    return value;
  }

  if (typeof value === "object") {
    return JSON.stringify(value);
  }

  return null;
}

function normalizeExecutionParams({
  usuarioId,
  data,
  treinoConcluido,
  refeicoesRegistradas,
  aguaConsumidaMl,
  passosRealizados,
  checkinRealizado,
  habitosConcluidosJson,
  scoreDia,
  streakDias,
}) {
  return {
    usuarioId: toNullableString(usuarioId),
    data: toNullableString(data),
    treinoConcluido: toBooleanFlag(treinoConcluido),
    refeicoesRegistradas: toSafeInt(refeicoesRegistradas, 0),
    aguaConsumidaMl: toSafeInt(aguaConsumidaMl, 0),
    passosRealizados: toSafeInt(passosRealizados, 0),
    checkinRealizado: toBooleanFlag(checkinRealizado),
    habitosConcluidosJson: toSafeJson(habitosConcluidosJson),
    scoreDia: toSafeInt(scoreDia, 0),
    streakDias: toSafeInt(streakDias, 0),
  };
}

class DailyPlanExecutionModel {
  // ======================================================
  // Busca a execução diária do usuário para uma data.
  // ======================================================
  static async buscarPorUsuarioEData({ usuarioId, data }) {
    const [rows] = await connection.execute(
      `
      SELECT
        id,
        usuario_id,
        data,
        treino_concluido,
        refeicoes_registradas,
        agua_consumida_ml,
        passos_realizados,
        checkin_realizado,
        habitos_concluidos_json,
        score_dia,
        streak_dias,
        created_at,
        updated_at
      FROM daily_plan_executions
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
      treino_concluido: Boolean(rows[0].treino_concluido),
      checkin_realizado: Boolean(rows[0].checkin_realizado),
      habitos_concluidos_json: parseHabitosJsonSeguro(rows[0].habitos_concluidos_json),
    };
  }

  // ======================================================
  // Cria a execução diária vazia do usuário.
  // ======================================================
  static async criar({
    usuarioId,
    data,
    treinoConcluido = false,
    refeicoesRegistradas = 0,
    aguaConsumidaMl = 0,
    passosRealizados = 0,
    checkinRealizado = false,
    habitosConcluidosJson = null,
    scoreDia = 0,
    streakDias = 0,
  }) {
    const params = normalizeExecutionParams({
      usuarioId,
      data,
      treinoConcluido,
      refeicoesRegistradas,
      aguaConsumidaMl,
      passosRealizados,
      checkinRealizado,
      habitosConcluidosJson,
      scoreDia,
      streakDias,
    });

    await connection.execute(
      `
      INSERT INTO daily_plan_executions (
        usuario_id,
        data,
        treino_concluido,
        refeicoes_registradas,
        agua_consumida_ml,
        passos_realizados,
        checkin_realizado,
        habitos_concluidos_json,
        score_dia,
        streak_dias
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `,
      [
        params.usuarioId,
        params.data,
        params.treinoConcluido,
        params.refeicoesRegistradas,
        params.aguaConsumidaMl,
        params.passosRealizados,
        params.checkinRealizado,
        params.habitosConcluidosJson,
        params.scoreDia,
        params.streakDias,
      ]
    );

    return this.buscarPorUsuarioEData({
      usuarioId: params.usuarioId,
      data: params.data,
    });
  }

  // ======================================================
  // Atualiza a execução diária sem criar duplicidade.
  // ======================================================
  static async atualizarPorUsuarioEData({
    usuarioId,
    data,
    treinoConcluido,
    refeicoesRegistradas,
    aguaConsumidaMl,
    passosRealizados,
    checkinRealizado,
    habitosConcluidosJson,
    scoreDia,
    streakDias,
  }) {
    const params = normalizeExecutionParams({
      usuarioId,
      data,
      treinoConcluido,
      refeicoesRegistradas,
      aguaConsumidaMl,
      passosRealizados,
      checkinRealizado,
      habitosConcluidosJson,
      scoreDia,
      streakDias,
    });

    await connection.execute(
      `
      UPDATE daily_plan_executions
      SET
        treino_concluido = ?,
        refeicoes_registradas = ?,
        agua_consumida_ml = ?,
        passos_realizados = ?,
        checkin_realizado = ?,
        habitos_concluidos_json = ?,
        score_dia = ?,
        streak_dias = ?
      WHERE usuario_id = ? AND data = ?
      `,
      [
        params.treinoConcluido,
        params.refeicoesRegistradas,
        params.aguaConsumidaMl,
        params.passosRealizados,
        params.checkinRealizado,
        params.habitosConcluidosJson,
        params.scoreDia,
        params.streakDias,
        params.usuarioId,
        params.data,
      ]
    );

    return this.buscarPorUsuarioEData({
      usuarioId: params.usuarioId,
      data: params.data,
    });
  }

  // ======================================================
  // Busca execuções recentes para cálculo de streak.
  // ======================================================
  static async listarRecentesPorUsuario({ usuarioId, limit = 30 }) {
    const limitSeguro = Math.min(60, Math.max(1, toSafeInt(limit, 30)));

    const [rows] = await connection.execute(
      `
      SELECT
        data,
        treino_concluido,
        refeicoes_registradas,
        agua_consumida_ml,
        passos_realizados,
        checkin_realizado,
        score_dia,
        streak_dias
      FROM daily_plan_executions
      WHERE usuario_id = ?
      ORDER BY data DESC
      LIMIT ${limitSeguro}
      `,
      [usuarioId]
    );

    return rows.map((row) => ({
      ...row,
      treino_concluido: Boolean(row.treino_concluido),
      checkin_realizado: Boolean(row.checkin_realizado),
    }));
  }
}

module.exports = DailyPlanExecutionModel;
