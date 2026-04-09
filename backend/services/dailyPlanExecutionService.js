const UsuarioModel = require("../models/usuarioModel");
const DailyPlanExecutionModel = require("../models/dailyPlanExecutionModel");
const dailyPlanService = require("./dailyPlanService");
const {
  buscarResumoOnboardingPorUsuario,
} = require("./onboardingResumoService");

function pad2(value) {
  return String(value).padStart(2, "0");
}

function getDataHoje() {
  const agora = new Date();
  const ano = agora.getFullYear();
  const mes = pad2(agora.getMonth() + 1);
  const dia = pad2(agora.getDate());
  return `${ano}-${mes}-${dia}`;
}

function formatDateKey(value) {
  if (!value) return null;

  if (value instanceof Date && !Number.isNaN(value.getTime())) {
    return `${value.getFullYear()}-${pad2(value.getMonth() + 1)}-${pad2(
      value.getDate()
    )}`;
  }

  const texto = String(value);
  const match = texto.match(/^(\d{4}-\d{2}-\d{2})/);
  return match ? match[1] : null;
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function toNumber(value, fallback = 0) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function toObject(value) {
  return value && typeof value === "object" && !Array.isArray(value) ? value : {};
}

function debugExecutionPayload(label, payload) {
  if (process.env.NODE_ENV === "production") {
    return;
  }

  console.log(`[DAILY_PLAN_EXECUTION_DEBUG] ${label}`, {
    usuarioId: payload?.usuarioId ?? null,
    data: payload?.data ?? null,
    treinoConcluido: payload?.treinoConcluido ?? null,
    refeicoesRegistradas: payload?.refeicoesRegistradas ?? null,
    aguaConsumidaMl: payload?.aguaConsumidaMl ?? null,
    passosRealizados: payload?.passosRealizados ?? null,
    checkinRealizado: payload?.checkinRealizado ?? null,
    habitosConcluidosJson:
      payload?.habitosConcluidosJson === undefined
        ? "__undefined__"
        : payload?.habitosConcluidosJson === null
          ? null
          : Array.isArray(payload?.habitosConcluidosJson)
            ? "[array]"
            : typeof payload?.habitosConcluidosJson,
    scoreDia: payload?.scoreDia ?? null,
    streakDias: payload?.streakDias ?? null,
  });
}

function hasAcaoRelevante(execution) {
  if (!execution) return false;

  return Boolean(
    execution.treino_concluido ||
      toNumber(execution.refeicoes_registradas, 0) > 0 ||
      toNumber(execution.agua_consumida_ml, 0) > 0 ||
      toNumber(execution.passos_realizados, 0) > 0 ||
      execution.checkin_realizado
  );
}

function calcularScoreDia({ execution, usuario, planoDoDia }) {
  const execucao = toObject(execution);
  const usuarioSeguro = toObject(usuario);
  const planoSeguro = toObject(planoDoDia);

  const metaAgua =
    toNumber(usuarioSeguro.meta_agua, 0) ||
    toNumber(planoSeguro?.habitos?.agua_ml, 2500);
  const metaPassos =
    toNumber(usuarioSeguro.meta_passos, 0) ||
    toNumber(planoSeguro?.habitos?.passos, 8000);
  const metaRefeicoes = Array.isArray(planoSeguro?.alimentacao?.refeicoes)
    ? planoSeguro.alimentacao.refeicoes.length
    : 4;

  const scoreTreino = execucao.treino_concluido ? 30 : 0;
  const scoreRefeicoes = Math.round(
    clamp(
      toNumber(execucao.refeicoes_registradas, 0) / Math.max(metaRefeicoes, 1),
      0,
      1
    ) * 20
  );
  const scoreAgua = Math.round(
    clamp(toNumber(execucao.agua_consumida_ml, 0) / Math.max(metaAgua, 1), 0, 1) *
      20
  );
  const scorePassos = Math.round(
    clamp(
      toNumber(execucao.passos_realizados, 0) / Math.max(metaPassos, 1),
      0,
      1
    ) * 20
  );
  const scoreCheckin = execucao.checkin_realizado ? 10 : 0;

  return clamp(
    scoreTreino + scoreRefeicoes + scoreAgua + scorePassos + scoreCheckin,
    0,
    100
  );
}

function gerarMensagemMotivacional({
  objetivoPrincipal,
  tipoIncentivo,
  principalBarreira,
  scoreDia,
  treinoConcluido,
}) {
  const objetivo = String(objetivoPrincipal || "").toLowerCase();
  const incentivo = String(tipoIncentivo || "").toLowerCase();
  const barreira = String(principalBarreira || "").toLowerCase();

  if (scoreDia >= 75) {
    return {
      titulo: treinoConcluido ? "Dia muito bem executado" : "Boa consistencia hoje",
      mensagem:
        incentivo === "resultado"
          ? "Seu desempenho de hoje reforca que pequenas entregas consistentes geram resultado real."
          : "Voce manteve um ritmo forte hoje. Vale repetir esse padrao no proximo bloco do dia.",
      tom: "reforco",
    };
  }

  if (scoreDia >= 35) {
    return {
      titulo: "Seu dia ainda esta aberto",
      mensagem:
        objetivo.includes("emagrec")
          ? "Voce ja iniciou bem. Fechar agua, passos ou treino hoje pode fazer muita diferenca."
          : "Ainda da tempo de consolidar o dia com mais uma acao importante do seu plano.",
      tom: "incentivo",
    };
  }

  return {
    titulo: barreira ? "Vamos destravar seu dia" : "Comece pelo mais simples",
    mensagem: barreira.includes("tempo")
      ? "Mesmo com pouco tempo, uma acao simples agora ja conta para sua consistencia."
      : "Escolha uma acao pequena agora: agua, check-in, refeicao ou treino. O importante e iniciar.",
    tom: "atencao",
  };
}

async function calcularStreakDias(usuarioId, hoje) {
  const recentes = await DailyPlanExecutionModel.listarRecentesPorUsuario({
    usuarioId,
    limit: 30,
  });

  const mapa = new Map(
    recentes
      .map((item) => [formatDateKey(item.data), item])
      .filter(([dataKey]) => Boolean(dataKey))
  );
  let streak = 0;
  let cursor = new Date(`${hoje}T12:00:00`);

  while (true) {
    const chave = `${cursor.getFullYear()}-${pad2(cursor.getMonth() + 1)}-${pad2(
      cursor.getDate()
    )}`;
    const execucao = mapa.get(chave);

    if (!execucao || !hasAcaoRelevante(execucao)) {
      break;
    }

    streak += 1;
    cursor.setDate(cursor.getDate() - 1);
  }

  return streak;
}

function normalizarPayloadUpdate(payload = {}, atual = {}) {
  const base = toObject(atual);
  const entrada = toObject(payload);

  return {
    treino_concluido:
      entrada.treino_concluido === undefined
        ? Boolean(base.treino_concluido)
        : Boolean(entrada.treino_concluido),
    refeicoes_registradas:
      entrada.refeicoes_registradas === undefined
        ? toNumber(base.refeicoes_registradas, 0)
        : Math.max(0, toNumber(entrada.refeicoes_registradas, 0)),
    agua_consumida_ml:
      entrada.agua_consumida_ml === undefined
        ? toNumber(base.agua_consumida_ml, 0)
        : Math.max(0, toNumber(entrada.agua_consumida_ml, 0)),
    passos_realizados:
      entrada.passos_realizados === undefined
        ? toNumber(base.passos_realizados, 0)
        : Math.max(0, toNumber(entrada.passos_realizados, 0)),
    checkin_realizado:
      entrada.checkin_realizado === undefined
        ? Boolean(base.checkin_realizado)
        : Boolean(entrada.checkin_realizado),
    habitos_concluidos_json:
      entrada.habitos_concluidos_json === undefined
        ? base.habitos_concluidos_json || null
        : entrada.habitos_concluidos_json,
  };
}

async function obterExecucaoDoDia(usuarioId) {
  const hoje = getDataHoje();
  const usuario = await UsuarioModel.findById(usuarioId);

  if (!usuario) {
    return {
      data: hoje,
      execution: null,
      score_dia: 0,
      streak_dias: 0,
      motivacao_do_dia: null,
      status: "usuario_nao_encontrado",
    };
  }

  const plano = await dailyPlanService.obterPlanoDoDia(usuarioId);
  const onboardingResumo = await buscarResumoOnboardingPorUsuario(usuarioId);
  const motivacao = toObject(onboardingResumo?.onboarding_respostas?.motivacao);

  let execucao = await DailyPlanExecutionModel.buscarPorUsuarioEData({
    usuarioId,
    data: hoje,
  });

  if (!execucao) {
    execucao = await DailyPlanExecutionModel.criar({
      usuarioId,
      data: hoje,
    });
  }

  const scoreDia = calcularScoreDia({
    execution: execucao,
    usuario,
    planoDoDia: plano?.plano_do_dia || {},
  });

  const streakDias = await calcularStreakDias(usuarioId, hoje);

  execucao = await DailyPlanExecutionModel.atualizarPorUsuarioEData({
    usuarioId,
    data: hoje,
    treinoConcluido: execucao.treino_concluido,
    refeicoesRegistradas: execucao.refeicoes_registradas,
    aguaConsumidaMl: execucao.agua_consumida_ml,
    passosRealizados: execucao.passos_realizados,
    checkinRealizado: execucao.checkin_realizado,
    habitosConcluidosJson: execucao.habitos_concluidos_json,
    scoreDia,
    streakDias,
  });

  const motivacaoDoDia = gerarMensagemMotivacional({
    objetivoPrincipal: usuario.objetivo,
    tipoIncentivo: motivacao.tipo_incentivo,
    principalBarreira: motivacao.principal_barreira,
    scoreDia,
    treinoConcluido: execucao.treino_concluido,
  });

  return {
    data: hoje,
    execution: execucao,
    score_dia: scoreDia,
    streak_dias: streakDias,
    motivacao_do_dia: motivacaoDoDia,
    status: "ok",
  };
}

async function atualizarExecucaoDoDia(usuarioId, payload = {}) {
  const hoje = getDataHoje();
  const atual = await obterExecucaoDoDia(usuarioId);

  if (atual.status === "usuario_nao_encontrado") {
    return atual;
  }

  const usuario = await UsuarioModel.findById(usuarioId);
  const plano = await dailyPlanService.obterPlanoDoDia(usuarioId);
  const onboardingResumo = await buscarResumoOnboardingPorUsuario(usuarioId);
  const motivacao = toObject(onboardingResumo?.onboarding_respostas?.motivacao);

  const normalizado = normalizarPayloadUpdate(payload, atual.execution);
  const scoreDia = calcularScoreDia({
    execution: normalizado,
    usuario,
    planoDoDia: plano?.plano_do_dia || {},
  });

  debugExecutionPayload("postExecution:update-1", {
    usuarioId,
    data: hoje,
    treinoConcluido: normalizado.treino_concluido,
    refeicoesRegistradas: normalizado.refeicoes_registradas,
    aguaConsumidaMl: normalizado.agua_consumida_ml,
    passosRealizados: normalizado.passos_realizados,
    checkinRealizado: normalizado.checkin_realizado,
    habitosConcluidosJson: normalizado.habitos_concluidos_json,
    scoreDia,
    streakDias: 0,
  });

  const execucaoSalva = await DailyPlanExecutionModel.atualizarPorUsuarioEData({
    usuarioId,
    data: hoje,
    treinoConcluido: normalizado.treino_concluido,
    refeicoesRegistradas: normalizado.refeicoes_registradas,
    aguaConsumidaMl: normalizado.agua_consumida_ml,
    passosRealizados: normalizado.passos_realizados,
    checkinRealizado: normalizado.checkin_realizado,
    habitosConcluidosJson: normalizado.habitos_concluidos_json,
    scoreDia,
    streakDias: 0,
  });

  const streakDias = await calcularStreakDias(usuarioId, hoje);

  debugExecutionPayload("postExecution:update-2", {
    usuarioId,
    data: hoje,
    treinoConcluido: execucaoSalva.treino_concluido,
    refeicoesRegistradas: execucaoSalva.refeicoes_registradas,
    aguaConsumidaMl: execucaoSalva.agua_consumida_ml,
    passosRealizados: execucaoSalva.passos_realizados,
    checkinRealizado: execucaoSalva.checkin_realizado,
    habitosConcluidosJson: execucaoSalva.habitos_concluidos_json,
    scoreDia,
    streakDias,
  });

  const execucaoAtualizada =
    await DailyPlanExecutionModel.atualizarPorUsuarioEData({
      usuarioId,
      data: hoje,
      treinoConcluido: execucaoSalva.treino_concluido,
      refeicoesRegistradas: execucaoSalva.refeicoes_registradas,
      aguaConsumidaMl: execucaoSalva.agua_consumida_ml,
      passosRealizados: execucaoSalva.passos_realizados,
      checkinRealizado: execucaoSalva.checkin_realizado,
      habitosConcluidosJson: execucaoSalva.habitos_concluidos_json,
      scoreDia,
      streakDias,
    });

  const motivacaoDoDia = gerarMensagemMotivacional({
    objetivoPrincipal: usuario.objetivo,
    tipoIncentivo: motivacao.tipo_incentivo,
    principalBarreira: motivacao.principal_barreira,
    scoreDia,
    treinoConcluido: execucaoAtualizada.treino_concluido,
  });

  return {
    data: hoje,
    execution: execucaoAtualizada,
    score_dia: scoreDia,
    streak_dias: streakDias,
    motivacao_do_dia: motivacaoDoDia,
    status: "ok",
  };
}

module.exports = {
  obterExecucaoDoDia,
  atualizarExecucaoDoDia,
};
