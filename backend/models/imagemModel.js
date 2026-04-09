const connection = require('../database/connection');

const criar = async ({
  usuario_id,
  tipo,
  nome_arquivo,
  caminho_arquivo,
  descricao
}) => {
  const query = `
    INSERT INTO imagens (
      usuario_id,
      tipo,
      nome_arquivo,
      caminho_arquivo,
      descricao
    ) VALUES (?, ?, ?, ?, ?)
  `;

  const [result] = await connection.execute(query, [
    usuario_id,
    tipo,
    nome_arquivo,
    caminho_arquivo,
    descricao || null
  ]);

  return {
    id: result.insertId,
    usuario_id,
    tipo,
    nome_arquivo,
    caminho_arquivo,
    descricao: descricao || null
  };
};

const listarPorUsuario = async (usuario_id) => {
  const query = `
    SELECT
      id,
      usuario_id,
      tipo,
      nome_arquivo,
      caminho_arquivo,
      descricao,
      criado_em
    FROM imagens
    WHERE usuario_id = ?
    ORDER BY id DESC
  `;

  const [rows] = await connection.execute(query, [usuario_id]);
  return rows;
};

const buscarPorId = async (id) => {
  const query = `
    SELECT
      id,
      usuario_id,
      tipo,
      nome_arquivo,
      caminho_arquivo,
      descricao,
      criado_em
    FROM imagens
    WHERE id = ?
    LIMIT 1
  `;

  const [rows] = await connection.execute(query, [id]);
  return rows[0] || null;
};

module.exports = {
  criar,
  listarPorUsuario,
  buscarPorId
};