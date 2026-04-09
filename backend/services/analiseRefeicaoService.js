const analiseRefeicaoModel = require('../models/analiseRefeicaoModel');
const analisadorRefeicao = require('./analisadorRefeicao');

const analisarImagemRefeicao = async ({ usuario_id, imagem_id, nome_arquivo, descricao }) => {
  const resultadoAnalise = analisadorRefeicao.analisarRefeicao({
    nomeArquivo: nome_arquivo,
    descricao
  });

  const analiseSalva = await analiseRefeicaoModel.criar({
    usuario_id,
    imagem_id,
    calorias_estimadas: resultadoAnalise.calorias_estimadas,
    proteinas: resultadoAnalise.proteinas,
    carboidratos: resultadoAnalise.carboidratos,
    gorduras: resultadoAnalise.gorduras,
    classificacao: resultadoAnalise.classificacao,
    descricao: resultadoAnalise.descricao,
    observacoes: resultadoAnalise.observacoes,
    tipo_refeicao: resultadoAnalise.tipo_refeicao,
    sugestao_proximo_passo: resultadoAnalise.sugestao_proximo_passo
  });

  return analiseSalva;
};

const listarAnalisesPorUsuario = async (usuario_id) => {
  return await analiseRefeicaoModel.listarPorUsuario(usuario_id);
};

module.exports = {
  analisarImagemRefeicao,
  listarAnalisesPorUsuario
};
