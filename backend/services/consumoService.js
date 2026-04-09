const consumoModel = require('../models/consumoModel');
const assinaturaModel = require('../models/assinaturaModel');
const planoSaasModel = require('../models/planoSaasModel');

function mesAtual() {
  const data = new Date();
  return `${data.getFullYear()}-${String(data.getMonth() + 1).padStart(2, '0')}`;
}

async function verificarLimite(usuarioId, recurso) {
  const assinatura = await assinaturaModel.buscarAssinaturaAtiva(usuarioId);

  if (!assinatura) {
    throw new Error('Usuário sem assinatura ativa');
  }

  const plano = await planoSaasModel.buscarPlanoPorId(assinatura.plano_id);

  const mes = mesAtual();

  const consumo = await consumoModel.buscarConsumo(usuarioId, recurso, mes);

  const usado = consumo ? consumo.quantidade : 0;

  let limite;

  if (recurso === 'analise_refeicao') {
    limite = plano.limite_analises_refeicao;
  }

  if (limite === 9999) {
    return true;
  }

  if (usado >= limite) {
    throw new Error('Limite do plano atingido');
  }

  await consumoModel.registrarConsumo(usuarioId, recurso, mes);

  return true;
}

module.exports = {
  verificarLimite
};