const connection = require('../database/connection');

const obterAlertaNutricional = async (usuarioId) => {
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

  if (metaDiariaCalorias <= 0) {
    return {
      calorias_consumidas_hoje: caloriasConsumidasHoje,
      meta_diaria_calorias: 0,
      percentual_atingido: 0,
      status: 'sem_meta',
      mensagem: 'Você ainda não possui uma meta calórica cadastrada.'
    };
  }

  const percentualAtingido = Number(
    ((caloriasConsumidasHoje / metaDiariaCalorias) * 100).toFixed(2)
  );

  const horaAtual = new Date().getHours();

  let status = '';
  let mensagem = '';

  if (percentualAtingido > 100) {
    status = 'acima_da_meta';

    if (horaAtual < 15) {
      mensagem = 'Você já ultrapassou sua meta calórica cedo hoje. Tente equilibrar melhor as próximas refeições.';
    } else {
      mensagem = 'Você ultrapassou sua meta calórica diária. Priorize refeições mais leves no restante do dia.';
    }
  } else if (percentualAtingido < 40 && horaAtual >= 20) {
    status = 'baixo_noite';
    mensagem = 'Seu consumo calórico está muito abaixo da meta neste fim do dia. Verifique se está seguindo seu plano corretamente.';
  } else if (percentualAtingido < 50) {
    status = 'baixo';
    mensagem = 'Seu consumo calórico ainda está abaixo da meta diária. Considere fazer uma refeição equilibrada.';
  } else {
    status = 'dentro_da_meta';
    mensagem = 'Você está dentro do planejado hoje. Continue mantendo o foco na dieta.';
  }

  return {
    calorias_consumidas_hoje: caloriasConsumidasHoje,
    meta_diaria_calorias: metaDiariaCalorias,
    percentual_atingido: percentualAtingido,
    status,
    mensagem
  };
};

module.exports = {
  obterAlertaNutricional
};