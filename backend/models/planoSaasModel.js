const connection = require('../database/connection');

async function listarPlanosAtivos() {
  const [rows] = await connection.execute(`
    SELECT 
      id,
      nome,
      slug,
      descricao,
      preco,
      duracao_dias,
      limite_planos_alimentares,
      limite_analises_refeicao,
      limite_uploads,
      suporte_prioritario,
      acesso_ia_avancada
    FROM planos_saas
    WHERE ativo = true
    ORDER BY preco ASC
  `);

  return rows;
}

async function buscarPlanoPorId(id) {
  const [rows] = await connection.execute(`
    SELECT * FROM planos_saas
    WHERE id = ?
    LIMIT 1
  `, [id]);

  return rows[0];
}

module.exports = {
  listarPlanosAtivos,
  buscarPlanoPorId
};