const DailyPlanModel = require("../models/dailyPlanModel");
const UsuarioModel = require("../models/usuarioModel");
const {
  buscarResumoOnboardingPorUsuario,
} = require("./onboardingResumoService");
const {
  generateDailyPlan,
  buildDailyPlanContextHash,
} = require("../utils/dailyPlanGenerator");

function pad2(value) {
  return String(value).padStart(2, "0");
}

// ======================================================
// Usa a data local do servidor para evitar deslocamento
// de dia causado por UTC em toISOString().
// ======================================================
function getDataHoje() {
  const agora = new Date();
  const ano = agora.getFullYear();
  const mes = pad2(agora.getMonth() + 1);
  const dia = pad2(agora.getDate());
  return `${ano}-${mes}-${dia}`;
}

// ======================================================
// Gera um plano diário novo a partir do contexto do usuário
// ======================================================
async function gerarPlanoDoDia(usuario) {
  if (!usuario || !usuario.id) {
    return {
      data: getDataHoje(),
      plano_do_dia: null,
      context_hash: null,
      status: "usuario_nao_encontrado",
      refreshed: false,
    };
  }

  const onboardingResumo = await buscarResumoOnboardingPorUsuario(usuario.id);
  const onboardingRespostas = onboardingResumo?.onboarding_respostas || {};

  const plano = generateDailyPlan({
    usuario,
    onboardingRespostas,
  });

  const contextHash = buildDailyPlanContextHash({
    usuario,
    onboardingRespostas,
  });

  return {
    data: getDataHoje(),
    plano_do_dia: plano,
    context_hash: contextHash,
    status: "gerado",
    refreshed: false,
  };
}

// ======================================================
// Retorna o plano diário existente ou gera um novo.
// Se o contexto-base mudou no mesmo dia, atualiza o
// mesmo registro em vez de criar duplicidade.
// ======================================================
async function obterPlanoDoDia(usuarioId) {
  const data = getDataHoje();
  const usuario = await UsuarioModel.findById(usuarioId);

  if (!usuario) {
    return {
      data,
      plano_do_dia: null,
      context_hash: null,
      status: "usuario_nao_encontrado",
      refreshed: false,
    };
  }

  const onboardingResumo = await buscarResumoOnboardingPorUsuario(usuarioId);
  const onboardingRespostas = onboardingResumo?.onboarding_respostas || {};
  const contextHashAtual = buildDailyPlanContextHash({
    usuario,
    onboardingRespostas,
  });

  const planoExistente = await DailyPlanModel.buscarPorUsuarioEData({
    usuarioId,
    data,
  });

  if (
    planoExistente?.plano_json &&
    planoExistente.context_hash &&
    planoExistente.context_hash === contextHashAtual
  ) {
    return {
      data,
      plano_do_dia: planoExistente.plano_json,
      context_hash: planoExistente.context_hash,
      status: planoExistente.status,
      refreshed: false,
    };
  }

  const planoGerado = generateDailyPlan({
    usuario,
    onboardingRespostas,
  });

  if (!planoExistente) {
    const salvo = await DailyPlanModel.criar({
      usuarioId,
      data,
      planoJson: planoGerado,
      contextHash: contextHashAtual,
      status: "gerado",
    });

    return {
      data,
      plano_do_dia: salvo?.plano_json || planoGerado,
      context_hash: salvo?.context_hash || contextHashAtual,
      status: salvo?.status || "gerado",
      refreshed: false,
    };
  }

  const atualizado = await DailyPlanModel.atualizarPorUsuarioEData({
    usuarioId,
    data,
    planoJson: planoGerado,
    contextHash: contextHashAtual,
    status: "atualizado",
  });

  return {
    data,
    plano_do_dia: atualizado?.plano_json || planoGerado,
    context_hash: atualizado?.context_hash || contextHashAtual,
    status: atualizado?.status || "atualizado",
    refreshed: true,
  };
}

module.exports = {
  gerarPlanoDoDia,
  obterPlanoDoDia,
};
