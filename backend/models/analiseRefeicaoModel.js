const connection = require("../database/connection");

const criar = async ({
  usuario_id,
  imagem_id,
  calorias_estimadas,
  proteinas,
  carboidratos,
  gorduras,
  classificacao,
  descricao,
  observacoes,
  tipo_refeicao,
  sugestao_proximo_passo,
}) => {
  const query = `
    INSERT INTO analises_refeicao (
      usuario_id,
      imagem_id,
      calorias_estimadas,
      proteinas,
      carboidratos,
      gorduras,
      classificacao,
      descricao,
      observacoes,
      tipo_refeicao,
      sugestao_proximo_passo
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  const [result] = await connection.execute(query, [
    usuario_id,
    imagem_id,
    calorias_estimadas ?? null,
    proteinas ?? null,
    carboidratos ?? null,
    gorduras ?? null,
    classificacao ?? null,
    descricao ?? null,
    observacoes ?? null,
    tipo_refeicao ?? null,
    sugestao_proximo_passo ?? null,
  ]);

  return {
    id: result.insertId,
    usuario_id,
    imagem_id,
    calorias_estimadas,
    proteinas,
    carboidratos,
    gorduras,
    classificacao,
    descricao,
    observacoes,
    tipo_refeicao,
    sugestao_proximo_passo,
  };
};

const listarPorUsuario = async (usuario_id) => {
  const query = `
    SELECT
      ar.id,
      ar.usuario_id,
      ar.imagem_id,
      ar.calorias_estimadas,
      ar.proteinas,
      ar.carboidratos,
      ar.gorduras,
      ar.classificacao,
      ar.descricao,
      ar.observacoes,
      ar.tipo_refeicao,
      ar.sugestao_proximo_passo,
      ar.criado_em,
      i.nome_arquivo,
      i.caminho_arquivo
    FROM analises_refeicao ar
    INNER JOIN imagens i ON i.id = ar.imagem_id
    WHERE ar.usuario_id = ?
    ORDER BY ar.id DESC
  `;

  const [rows] = await connection.execute(query, [usuario_id]);
  return rows;
};

module.exports = {
  criar,
  listarPorUsuario,
};
