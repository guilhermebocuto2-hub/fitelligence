const connection = require('../database/connection');

async function buscarConsumo(usuarioId, recurso, mes) {
  const [rows] = await connection.execute(
    `
    SELECT *
    FROM consumo_recursos
    WHERE usuario_id = ?
    AND recurso = ?
    AND mes_referencia = ?
  `,
    [usuarioId, recurso, mes]
  );

  return rows[0];
}

async function registrarConsumo(usuarioId, recurso, mes) {
  await connection.execute(
    `
    INSERT INTO consumo_recursos (usuario_id, recurso, quantidade, mes_referencia)
    VALUES (?, ?, 1, ?)
    ON DUPLICATE KEY UPDATE quantidade = quantidade + 1
  `,
    [usuarioId, recurso, mes]
  );
}

module.exports = {
  buscarConsumo,
  registrarConsumo
};