const planoSaasModel = require('../models/planoSaasModel');
const assinaturaModel = require('../models/assinaturaModel');

function adicionarDias(data, dias) {
  const novaData = new Date(data);
  novaData.setDate(novaData.getDate() + dias);
  return novaData;
}

async function listarPlanos() {
  return planoSaasModel.listarPlanosAtivos();
}

async function assinarPlano(usuarioId, planoId) {
  const assinaturaAtiva = await assinaturaModel.buscarAssinaturaAtiva(usuarioId);

  if (assinaturaAtiva) {
    throw new Error('Usuário já possui assinatura ativa');
  }

  const plano = await planoSaasModel.buscarPlanoPorId(planoId);

  if (!plano) {
    throw new Error('Plano não encontrado');
  }

  const dataInicio = new Date();
  const dataFim = adicionarDias(dataInicio, plano.duracao_dias);

  await assinaturaModel.criarAssinatura({
    usuario_id: usuarioId,
    plano_id: planoId,
    data_inicio: dataInicio,
    data_fim: dataFim,
    valor_pago: plano.preco
  });

  return assinaturaModel.buscarUltimaAssinatura(usuarioId);
}

async function minhaAssinatura(usuarioId) {
  return assinaturaModel.buscarUltimaAssinatura(usuarioId);
}

module.exports = {
  listarPlanos,
  assinarPlano,
  minhaAssinatura
};