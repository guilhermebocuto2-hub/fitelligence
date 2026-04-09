const connection = require("../database/connection");

function parseJsonArray(value) {
  if (!value) return [];
  if (Array.isArray(value)) return value;

  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

const criar = async ({
  usuario_id,
  imagem_id,
  imagem_anterior_id = null,
  resumo_visual = null,
  pontos_de_evolucao = [],
  pontos_de_atencao = [],
  consistencia_percebida = null,
  recomendacao_curta = null,
}) => {
  const [result] = await connection.execute(
    `
    INSERT INTO analises_corporais (
      usuario_id,
      imagem_id,
      imagem_anterior_id,
      resumo_visual,
      pontos_de_evolucao,
      pontos_de_atencao,
      consistencia_percebida,
      recomendacao_curta
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `,
    [
      usuario_id,
      imagem_id,
      imagem_anterior_id,
      resumo_visual,
      JSON.stringify(pontos_de_evolucao || []),
      JSON.stringify(pontos_de_atencao || []),
      consistencia_percebida,
      recomendacao_curta,
    ]
  );

  return {
    id: result.insertId,
    usuario_id,
    imagem_id,
    imagem_anterior_id,
    resumo_visual,
    pontos_de_evolucao,
    pontos_de_atencao,
    consistencia_percebida,
    recomendacao_curta,
  };
};

const listarPorUsuario = async (usuario_id) => {
  const [rows] = await connection.execute(
    `
    SELECT
      id,
      usuario_id,
      imagem_id,
      imagem_anterior_id,
      resumo_visual,
      pontos_de_evolucao,
      pontos_de_atencao,
      consistencia_percebida,
      recomendacao_curta,
      criado_em
    FROM analises_corporais
    WHERE usuario_id = ?
    ORDER BY criado_em DESC, id DESC
    `,
    [usuario_id]
  );

  return rows.map((row) => ({
    ...row,
    pontos_de_evolucao: parseJsonArray(row.pontos_de_evolucao),
    pontos_de_atencao: parseJsonArray(row.pontos_de_atencao),
  }));
};

module.exports = {
  criar,
  listarPorUsuario,
};
