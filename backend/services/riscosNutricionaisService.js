const connection = require('../database/connection');

const obterRiscosNutricionais = async (usuarioId) => {
  const queryMeta = `
    SELECT calorias
    FROM planos
    WHERE usuario_id = ?
    ORDER BY criado_em DESC
    LIMIT 1
  `;

  const queryUltimos7Dias = `
    SELECT
      DATE(criado_em) AS data,
      COUNT(*) AS total_refeicoes,
      COALESCE(SUM(calorias_estimadas), 0) AS total_calorias
    FROM analises_refeicao
    WHERE usuario_id = ?
      AND DATE(criado_em) >= CURDATE() - INTERVAL 6 DAY
    GROUP BY DATE(criado_em)
    ORDER BY DATE(criado_em) ASC
  `;

  const [metaRows] = await connection.execute(queryMeta, [usuarioId]);
  const [consumoRows] = await connection.execute(queryUltimos7Dias, [usuarioId]);

  const metaDiaria = metaRows.length > 0 ? Number(metaRows[0].calorias) || 0 : 0;

  const hoje = new Date();
  const mapaConsumo = {};

  for (const row of consumoRows) {
    const dataFormatada = new Date(row.data).toISOString().split('T')[0];
    mapaConsumo[dataFormatada] = {
      total_refeicoes: Number(row.total_refeicoes) || 0,
      total_calorias: Number(row.total_calorias) || 0
    };
  }

  const ultimos7Dias = [];

  for (let i = 6; i >= 0; i--) {
    const data = new Date();
    data.setDate(hoje.getDate() - i);

    const chave = data.toISOString().split('T')[0];

    ultimos7Dias.push({
      data: chave,
      total_refeicoes: mapaConsumo[chave]?.total_refeicoes || 0,
      total_calorias: mapaConsumo[chave]?.total_calorias || 0
    });
  }

  const riscos = [];

  if (metaDiaria > 0) {
    let diasAcimaMetaSeguidos = 0;
    let diasBaixoConsumoSeguidos = 0;

    for (const dia of ultimos7Dias) {
      if (dia.total_calorias > metaDiaria) {
        diasAcimaMetaSeguidos++;
        if (diasAcimaMetaSeguidos >= 3) {
          riscos.push({
            tipo: 'excesso_calorico_recorrente',
            mensagem: 'Você ultrapassou sua meta calórica por 3 dias seguidos.'
          });
          break;
        }
      } else {
        diasAcimaMetaSeguidos = 0;
      }
    }

    for (const dia of ultimos7Dias) {
      if (dia.total_calorias > 0 && dia.total_calorias < metaDiaria * 0.5) {
        diasBaixoConsumoSeguidos++;
        if (diasBaixoConsumoSeguidos >= 3) {
          riscos.push({
            tipo: 'baixo_consumo_recorrente',
            mensagem: 'Seu consumo calórico ficou abaixo de 50% da meta por 3 dias seguidos.'
          });
          break;
        }
      } else {
        diasBaixoConsumoSeguidos = 0;
      }
    }

    const caloriasValidas = ultimos7Dias
      .map((dia) => dia.total_calorias)
      .filter((valor) => valor > 0);

    if (caloriasValidas.length >= 3) {
      const menor = Math.min(...caloriasValidas);
      const maior = Math.max(...caloriasValidas);

      if (maior - menor >= 1000) {
        riscos.push({
          tipo: 'oscilacao_alimentar',
          mensagem: 'Seu consumo calórico apresentou grande oscilação nos últimos dias.'
        });
      }
    }
  }

  let diasSemRegistroSeguidos = 0;

  for (let i = ultimos7Dias.length - 1; i >= 0; i--) {
    const dia = ultimos7Dias[i];

    if (dia.total_refeicoes === 0) {
      diasSemRegistroSeguidos++;
      if (diasSemRegistroSeguidos >= 2) {
        riscos.push({
          tipo: 'dias_sem_registro',
          mensagem: 'Você está há 2 dias sem registrar refeições.'
        });
        break;
      }
    } else {
      break;
    }
  }

  return {
    usuario_id: usuarioId,
    meta_diaria_calorias: metaDiaria,
    periodo_analisado: '7_dias',
    riscos,
    resumo:
      riscos.length > 0
        ? `Foram identificados ${riscos.length} risco(s) nutricional(is) recente(s).`
        : 'Nenhum risco nutricional relevante foi identificado nos últimos dias.'
  };
};

module.exports = {
  obterRiscosNutricionais
};