const crypto = require("crypto");

// ======================================================
// Motor gerador do plano diário do Fitelligence
// Responsável por:
// - transformar contexto do usuário em um plano leve do dia
// - manter lógica previsível e conservadora
// - gerar uma assinatura estável do contexto-base
// ======================================================

function normalizarTexto(valor) {
  return String(valor || "")
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

function toNumber(value, fallback = null) {
  const numero = Number(value);
  return Number.isFinite(numero) ? numero : fallback;
}

function toObject(value) {
  return value && typeof value === "object" && !Array.isArray(value) ? value : {};
}

// ======================================================
// Serialização estável para montar uma assinatura
// determinística do contexto do plano diário.
// ======================================================
function stableSerialize(value) {
  if (Array.isArray(value)) {
    return `[${value.map((item) => stableSerialize(item)).join(",")}]`;
  }

  if (value && typeof value === "object") {
    const entries = Object.keys(value)
      .sort()
      .map((key) => `${JSON.stringify(key)}:${stableSerialize(value[key])}`);

    return `{${entries.join(",")}}`;
  }

  return JSON.stringify(value);
}

function getTempoDisponivelMin(onboardingRespostas = {}, frequenciaTreinoBase = 3) {
  const respostas = toObject(onboardingRespostas);
  const rotina = toObject(respostas.rotina);

  const tempoBruto =
    rotina.tempo_disponivel_min ??
    rotina.tempo_disponivel ??
    rotina.duracao_treino_min ??
    null;

  const tempoNumerico = toNumber(tempoBruto, null);
  if (tempoNumerico !== null) {
    return Math.max(20, Math.min(90, tempoNumerico));
  }

  if (frequenciaTreinoBase >= 5) return 45;
  if (frequenciaTreinoBase >= 3) return 35;
  return 30;
}

function getSonoHorasSugestao(nivelUsuario) {
  const nivel = normalizarTexto(nivelUsuario);
  if (nivel === "avancado") return 8;
  if (nivel === "intermediario") return 7.5;
  return 7;
}

function getIntensidadeNormalizada(intensidadeTreinoBase) {
  const intensidade = normalizarTexto(intensidadeTreinoBase);
  if (intensidade === "moderada_alta") return "moderada_alta";
  if (intensidade === "moderada") return "moderada";
  return "leve";
}

function getTipoTreinoNormalizado(tipoTreinoBase) {
  const tipo = normalizarTexto(tipoTreinoBase);
  if (tipo === "forca") return "forca";
  if (tipo === "cardio_funcional") return "cardio_funcional";
  if (tipo === "caminhada_funcional_forca_basica") {
    return "caminhada_funcional_forca_basica";
  }
  return "mobilidade_caminhada_forca_leve";
}

function getNivelUsuarioNormalizado(nivelUsuario) {
  const nivel = normalizarTexto(nivelUsuario);
  if (nivel === "avancado") return "avancado";
  if (nivel === "intermediario") return "intermediario";
  return "iniciante";
}

function getTreinoTitulo(tipoTreinoBase) {
  const tipo = getTipoTreinoNormalizado(tipoTreinoBase);
  if (tipo === "forca") return "Treino de forca do dia";
  if (tipo === "cardio_funcional") return "Treino cardio funcional";
  if (tipo === "caminhada_funcional_forca_basica") {
    return "Treino de emagrecimento do dia";
  }
  return "Treino leve de mobilidade e caminhada";
}

function getExerciciosBase({ tipoTreinoBase, nivelUsuario }) {
  const tipo = getTipoTreinoNormalizado(tipoTreinoBase);
  const nivel = getNivelUsuarioNormalizado(nivelUsuario);

  if (tipo === "forca") {
    return nivel === "avancado"
      ? ["Agachamento", "Supino", "Remada", "Desenvolvimento", "Core"]
      : ["Agachamento livre", "Flexao inclinada", "Remada elastico", "Avanco", "Prancha"];
  }

  if (tipo === "cardio_funcional") {
    return ["Caminhada acelerada", "Polichinelos", "Agachamento", "Mountain climber", "Alongamento"];
  }

  if (tipo === "caminhada_funcional_forca_basica") {
    return ["Caminhada", "Agachamento", "Flexao parede", "Elevacao de joelhos", "Prancha curta"];
  }

  return ["Mobilidade articular", "Caminhada leve", "Alongamento", "Respiracao guiada"];
}

function getCaloriasTreinoEstimadas({ duracaoMin, intensidade }) {
  const intensidadeNormalizada = getIntensidadeNormalizada(intensidade);
  const fator =
    intensidadeNormalizada === "moderada_alta"
      ? 8
      : intensidadeNormalizada === "moderada"
        ? 6
        : 4;

  return Math.round(duracaoMin * fator);
}

function getRefeicoesBase(metaCalorica = 2000) {
  const total = toNumber(metaCalorica, 2000) || 2000;

  return [
    { nome: "Cafe da manha", calorias_meta: Math.round(total * 0.25) },
    { nome: "Almoco", calorias_meta: Math.round(total * 0.35) },
    { nome: "Lanche", calorias_meta: Math.round(total * 0.15) },
    { nome: "Jantar", calorias_meta: Math.round(total * 0.25) },
  ];
}

function getAgendaBase({ frequenciaTreinoBase, tempoDisponivelMin }) {
  const treinoHorario = frequenciaTreinoBase >= 4 ? "07:00" : "18:30";
  const jantar = tempoDisponivelMin >= 45 ? "19:30" : "20:00";

  return {
    acordar: "06:30",
    treino: treinoHorario,
    refeicoes: ["07:30", "12:30", "16:30", jantar],
  };
}

function getAcaoPrincipalPlano({ tipoTreinoBase, metaCalorica, metaAgua }) {
  return {
    tipo: "seguir_plano_diario",
    titulo: "Seguir plano do dia",
    descricao:
      "Seu foco hoje e bater a meta calorica, hidratacao e executar o treino sugerido.",
    cta_label: "Ver plano do dia",
    contexto: {
      tipo_treino: getTipoTreinoNormalizado(tipoTreinoBase),
      meta_calorica: toNumber(metaCalorica, null),
      meta_agua: toNumber(metaAgua, null),
    },
  };
}

// ======================================================
// Monta o subconjunto exato do contexto que impacta
// diretamente a geração do plano do dia.
// ======================================================
function buildDailyPlanContextPayload({ usuario = {}, onboardingRespostas = {} }) {
  const usuarioSeguro = toObject(usuario);
  const respostasSeguras = toObject(onboardingRespostas);
  const rotina = toObject(respostasSeguras.rotina);

  return {
    meta_calorica: toNumber(usuarioSeguro.meta_calorica, 2000),
    meta_agua: toNumber(usuarioSeguro.meta_agua, 2500),
    meta_passos: toNumber(usuarioSeguro.meta_passos, 8000),
    nivel_usuario: getNivelUsuarioNormalizado(usuarioSeguro.nivel_usuario),
    frequencia_treino_base: toNumber(usuarioSeguro.frequencia_treino_base, 3),
    intensidade_treino_base: getIntensidadeNormalizada(
      usuarioSeguro.intensidade_treino_base
    ),
    tipo_treino_base: getTipoTreinoNormalizado(usuarioSeguro.tipo_treino_base),
    rotina: {
      tempo_disponivel_min: toNumber(rotina.tempo_disponivel_min, null),
      tempo_disponivel: toNumber(rotina.tempo_disponivel, null),
      duracao_treino_min: toNumber(rotina.duracao_treino_min, null),
    },
  };
}

// ======================================================
// Gera um hash estável do contexto-base do plano.
// ======================================================
function buildDailyPlanContextHash({ usuario = {}, onboardingRespostas = {} }) {
  const payload = buildDailyPlanContextPayload({
    usuario,
    onboardingRespostas,
  });

  return crypto
    .createHash("sha256")
    .update(stableSerialize(payload))
    .digest("hex");
}

function generateDailyPlan({ usuario = {}, onboardingRespostas = {} }) {
  const usuarioSeguro = toObject(usuario);
  const respostasSeguras = toObject(onboardingRespostas);

  const metaCalorica = toNumber(usuarioSeguro.meta_calorica, 2000);
  const metaAgua = toNumber(usuarioSeguro.meta_agua, 2500);
  const metaPassos = toNumber(usuarioSeguro.meta_passos, 8000);
  const nivelUsuario = getNivelUsuarioNormalizado(usuarioSeguro.nivel_usuario);
  const frequenciaTreinoBase = toNumber(usuarioSeguro.frequencia_treino_base, 3);
  const intensidadeTreinoBase = getIntensidadeNormalizada(
    usuarioSeguro.intensidade_treino_base
  );
  const tipoTreinoBase = getTipoTreinoNormalizado(usuarioSeguro.tipo_treino_base);
  const tempoDisponivelMin = getTempoDisponivelMin(
    respostasSeguras,
    frequenciaTreinoBase
  );

  const exercicios = getExerciciosBase({
    tipoTreinoBase,
    nivelUsuario,
  });

  const treino = {
    titulo: getTreinoTitulo(tipoTreinoBase),
    tipo: tipoTreinoBase,
    duracao_min: tempoDisponivelMin,
    intensidade: intensidadeTreinoBase,
    exercicios,
    calorias_estimadas: getCaloriasTreinoEstimadas({
      duracaoMin: tempoDisponivelMin,
      intensidade: intensidadeTreinoBase,
    }),
  };

  const alimentacao = {
    calorias: metaCalorica,
    refeicoes: getRefeicoesBase(metaCalorica),
    horarios: ["07:30", "12:30", "16:30", "20:00"],
  };

  const habitos = {
    agua_ml: metaAgua,
    passos: metaPassos,
    sono_horas: getSonoHorasSugestao(nivelUsuario),
  };

  const agenda = getAgendaBase({
    frequenciaTreinoBase,
    tempoDisponivelMin,
  });

  return {
    alimentacao,
    treino,
    habitos,
    agenda,
    acao_principal: getAcaoPrincipalPlano({
      tipoTreinoBase,
      metaCalorica,
      metaAgua,
    }),
  };
}

module.exports = {
  generateDailyPlan,
  buildDailyPlanContextHash,
};
