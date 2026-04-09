const connection = require('../database/connection');

const obterProgressoNutricional = async (usuarioId) => {

  const queryConsumo = `
    SELECT
      COALESCE(SUM(calorias_estimadas), 0) AS calorias_consumidas_hoje
    FROM analises_refeicao
    WHERE usuario_id = ?
      AND DATE(criado_em) = CURDATE()
  `;

  const queryMeta = `
    SELECT calorias
    FROM planos
    WHERE usuario_id = ?
    ORDER BY criado_em DESC
    LIMIT 1
  `;

  const [consumoRows] = await connection.execute(queryConsumo, [usuarioId]);
  const [metaRows] = await connection.execute(queryMeta, [usuarioId]);

  const caloriasConsumidasHoje = Number(consumoRows[0].calorias_consumidas_hoje) || 0;

  const metaDiariaCalorias = metaRows.length > 0
    ? Number(metaRows[0].calorias) || 0
    : 0;

  const percentualAtingido = metaDiariaCalorias > 0
    ? Number(((caloriasConsumidasHoje / metaDiariaCalorias) * 100).toFixed(2))
    : 0;

  const caloriasRestantes = Math.max(metaDiariaCalorias - caloriasConsumidasHoje, 0);

  return {
    calorias_consumidas_hoje: caloriasConsumidasHoje,
    meta_diaria_calorias: metaDiariaCalorias,
    percentual_atingido: percentualAtingido,
    calorias_restantes: caloriasRestantes
  };
};

module.exports = {
  obterProgressoNutricional
};