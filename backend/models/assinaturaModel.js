const connection = require('../database/connection');

async function criarAssinatura(data) {
  const {
    usuario_id,
    plano_id,
    data_inicio,
    data_fim,
    valor_pago
  } = data;

  const [result] = await connection.execute(`
    INSERT INTO assinaturas (
      usuario_id,
      plano_id,
      status,
      data_inicio,
      data_fim,
      valor_pago
    )
    VALUES (?, ?, 'ativa', ?, ?, ?)
  `, [
    usuario_id,
    plano_id,
    data_inicio,
    data_fim,
    valor_pago
  ]);

  return result.insertId;
}

async function buscarAssinaturaAtiva(usuarioId) {
  const [rows] = await connection.execute(`
    SELECT a.*, p.nome AS plano_nome, p.slug
    FROM assinaturas a
    JOIN planos_saas p ON p.id = a.plano_id
    WHERE a.usuario_id = ?
      AND a.status = 'ativa'
    LIMIT 1
  `, [usuarioId]);

  return rows[0];
}

async function buscarUltimaAssinatura(usuarioId) {
  const [rows] = await connection.execute(`
    SELECT a.*, p.nome AS plano_nome, p.slug
    FROM assinaturas a
    JOIN planos_saas p ON p.id = a.plano_id
    WHERE a.usuario_id = ?
    ORDER BY a.id DESC
    LIMIT 1
  `, [usuarioId]);

  return rows[0];
}

module.exports = {
  criarAssinatura,
  buscarAssinaturaAtiva,
  buscarUltimaAssinatura
};