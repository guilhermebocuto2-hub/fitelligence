const connection = require("../database/connection");

async function registrarEvento(data) {
  const [result] = await connection.execute(
    `
      INSERT INTO subscription_events (
        user_id,
        platform,
        event_type,
        external_id,
        payload_json,
        processed_at
      ) VALUES (?, ?, ?, ?, ?, ?)
    `,
    [
      data.user_id,
      data.platform,
      data.event_type,
      data.external_id || null,
      JSON.stringify(data.payload_json || {}),
      data.processed_at || null,
    ]
  );

  return result.insertId;
}

async function listarEventosPorUsuario(userId, limit = 20) {
  const [rows] = await connection.execute(
    `
      SELECT
        id,
        user_id,
        platform,
        event_type,
        external_id,
        payload_json,
        processed_at,
        created_at
      FROM subscription_events
      WHERE user_id = ?
      ORDER BY created_at DESC, id DESC
      LIMIT ?
    `,
    [userId, Number(limit) || 20]
  );

  return rows.map((row) => ({
    ...row,
    payload_json:
      typeof row.payload_json === "string"
        ? safeJsonParse(row.payload_json)
        : row.payload_json,
  }));
}

function safeJsonParse(value) {
  try {
    return JSON.parse(value);
  } catch {
    return value;
  }
}

module.exports = {
  registrarEvento,
  listarEventosPorUsuario,
};
