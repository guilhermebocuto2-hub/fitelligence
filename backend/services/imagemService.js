const imagemModel = require('../models/imagemModel');

const salvarImagem = async ({
  usuario_id,
  tipo,
  nome_arquivo,
  caminho_arquivo,
  descricao
}) => {
  if (!usuario_id) {
    throw new Error('usuario_id é obrigatório');
  }

  if (!tipo) {
    throw new Error('tipo é obrigatório');
  }

  if (!nome_arquivo) {
    throw new Error('nome_arquivo é obrigatório');
  }

  if (!caminho_arquivo) {
    throw new Error('caminho_arquivo é obrigatório');
  }

  const tiposPermitidos = ['corporal', 'refeicao'];

  if (!tiposPermitidos.includes(tipo)) {
    throw new Error('Tipo de imagem inválido');
  }

  const imagem = await imagemModel.criar({
    usuario_id,
    tipo,
    nome_arquivo,
    caminho_arquivo,
    descricao
  });

  return imagem;
};

const listarImagensUsuario = async (usuario_id) => {
  if (!usuario_id) {
    throw new Error('usuario_id é obrigatório');
  }

  return await imagemModel.listarPorUsuario(usuario_id);
};

const buscarImagemPorId = async (id) => {
  if (!id) {
    throw new Error('id da imagem é obrigatório');
  }

  return await imagemModel.buscarPorId(id);
};

module.exports = {
  salvarImagem,
  listarImagensUsuario,
  buscarImagemPorId
};