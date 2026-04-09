const connection = require("../database/connection");

function mapSubscriptionRow(row) {
  if (!row) return null;

  return {
    id: row.id,
    user_id: row.user_id,
    platform: row.platform,
    product_id: row.product_id,
    status: row.status,
    is_premium: Boolean(row.is_premium),
    current_period_start: row.current_period_start,
    current_period_end: row.current_period_end,
    purchase_token: row.purchase_token,
    original_transaction_id: row.original_transaction_id,
    environment: row.environment,
    last_validated_at: row.last_validated_at,
    created_at: row.created_at,
    updated_at: row.updated_at,
  };
}

async function buscarAssinaturaAtivaPorUsuario(userId) {
  // ====================================================
  // Fonte principal para premium:
  // - status ativo ou grace_period
  // - is_premium = 1
  // - período válido (ou sem expiração definida)
  // ====================================================
  const [rows] = await connection.execute(
    `
      SELECT *
      FROM subscriptions
      WHERE user_id = ?
        AND is_premium = 1
        AND status IN ('active', 'grace_period')
        AND (current_period_end IS NULL OR current_period_end >= UTC_TIMESTAMP())
      ORDER BY current_period_end DESC, updated_at DESC
      LIMIT 1
    `,
    [userId]
  );

  return mapSubscriptionRow(rows[0]);
}

async function buscarAssinaturaMaisRecentePorUsuario(userId) {
  const [rows] = await connection.execute(
    `
      SELECT *
      FROM subscriptions
      WHERE user_id = ?
      ORDER BY updated_at DESC, id DESC
      LIMIT 1
    `,
    [userId]
  );

  return mapSubscriptionRow(rows[0]);
}

async function buscarAssinaturasPorUsuario(userId, limit = 20) {
  const [rows] = await connection.execute(
    `
      SELECT *
      FROM subscriptions
      WHERE user_id = ?
      ORDER BY updated_at DESC, id DESC
      LIMIT ?
    `,
    [userId, Number(limit) || 20]
  );

  return rows.map(mapSubscriptionRow);
}

async function criarAssinatura(data) {
  const [result] = await connection.execute(
    `
      INSERT INTO subscriptions (
        user_id,
        platform,
        product_id,
        status,
        is_premium,
        current_period_start,
        current_period_end,
        purchase_token,
        original_transaction_id,
        environment,
        last_validated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `,
    [
      data.user_id,
      data.platform,
      data.product_id,
      data.status,
      data.is_premium ? 1 : 0,
      data.current_period_start || null,
      data.current_period_end || null,
      data.purchase_token || null,
      data.original_transaction_id || null,
      data.environment || "production",
      data.last_validated_at || null,
    ]
  );

  return result.insertId;
}

async function atualizarAssinatura(id, data) {
  // ====================================================
  // Atualização dinâmica segura:
  // apenas campos permitidos entram no update.
  // ====================================================
  const allowedFields = [
    "platform",
    "product_id",
    "status",
    "is_premium",
    "current_period_start",
    "current_period_end",
    "purchase_token",
    "original_transaction_id",
    "environment",
    "last_validated_at",
  ];

  const fields = [];
  const params = [];

  for (const key of allowedFields) {
    if (Object.prototype.hasOwnProperty.call(data, key)) {
      fields.push(`${key} = ?`);
      if (key === "is_premium") {
        params.push(data[key] ? 1 : 0);
      } else {
        params.push(data[key]);
      }
    }
  }

  if (!fields.length) {
    return 0;
  }

  params.push(id);

  const [result] = await connection.execute(
    `
      UPDATE subscriptions
      SET ${fields.join(", ")}
      WHERE id = ?
    `,
    params
  );

  return result.affectedRows;
}

module.exports = {
  buscarAssinaturaAtivaPorUsuario,
  buscarAssinaturaMaisRecentePorUsuario,
  buscarAssinaturasPorUsuario,
  criarAssinatura,
  atualizarAssinatura,
};
