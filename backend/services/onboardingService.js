// ======================================================
// Service do onboarding
// Responsável por centralizar a regra de negÃ³cio do fluxo:
// - iniciar onboarding
// - salvar etapas
// - buscar onboarding completo
// - concluir onboarding com validaÃ§Ã£o
// - materializar dados-base em usuarios
// - criar meta inicial automática quando aplicável
// - atualizar etapas especÃ­ficas
// ======================================================

const onboardingModel = require("../models/onboardingModel");
const UsuarioModel = require("../models/usuarioModel");
const MetaModel = require("../models/metaModel");

const {
  validarPerfil,
  resolverPerfilCanonico,
  SECOES_OBRIGATORIAS_POR_PERFIL,
  obterRotaDashboardPorPerfil,
} = require("../utils/onboardingUtils");

// ======================================================
// Mapa de aliases de seÃ§Ã£o
// Responsável por:
// - aceitar nomes em portuguÃªs e inglÃªs
// - evitar quebra no concluirOnboarding
// - padronizar comparaÃ§Ã£o entre seÃ§Ãµes salvas e obrigatÃ³rias
// ======================================================
const MAPA_SECOES = {
alimentacao: "nutricao",
food: "nutricao",
diet: "nutricao",
  perfil: "perfil",
  profile: "perfil",

  objetivo: "objetivo",
  goal: "objetivo",

  "dados-fisicos": "dados-fisicos",
  dados_fisicos: "dados-fisicos",
  body_data: "dados-fisicos",
  "body-data": "dados-fisicos",

  rotina: "rotina",
  routine: "rotina",

  nutricao: "nutricao",
  nutrition: "nutricao",

  motivacao: "motivacao",
  motivation: "motivacao",

  resumo: "resumo",
  summary: "resumo",
};

// ======================================================
// Normaliza texto para comparaÃ§Ã£o de seÃ§Ãµes
// ======================================================
function normalizarTexto(valor) {
  return String(valor || "")
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, "_")
    .replace(/-/g, "_");
}

// ======================================================
// Converte uma seÃ§Ã£o qualquer para a forma canÃ´nica
// ======================================================
function canonicalizarSecao(secao) {
  const chaveNormalizada = normalizarTexto(secao);
  return MAPA_SECOES[chaveNormalizada] || String(secao || "").trim().toLowerCase();
}

// ======================================================
// Retorna lista de seÃ§Ãµes equivalentes para compatibilidade
// temporária entre dados legados e seÃ§Ã£o canÃ´nica
// ======================================================
function obterSecoesEquivalentes(secao) {
  const secaoCanonica = canonicalizarSecao(secao);
  const equivalentes = new Set([secaoCanonica]);

  for (const [alias, canonica] of Object.entries(MAPA_SECOES)) {
    if (canonica !== secaoCanonica) continue;

    const aliasBase = String(alias || "").trim().toLowerCase();
    if (!aliasBase) continue;

    // MantÃ©m variaÃ§Ãµes comuns persistidas historicamente
    equivalentes.add(aliasBase);
    equivalentes.add(aliasBase.replace(/_/g, "-"));
    equivalentes.add(aliasBase.replace(/-/g, "_"));
  }

  return Array.from(equivalentes);
}

// ======================================================
// Busca uma seÃ§Ã£o dentro do objeto agrupado aceitando aliases
// ======================================================
function obterSecao(respostasAgrupadas, nomesPossiveis = []) {
  const chaves = Object.keys(respostasAgrupadas || {});
  const nomesCanonicos = nomesPossiveis.map(canonicalizarSecao);

  for (const chave of chaves) {
    const chaveCanonica = canonicalizarSecao(chave);

    if (nomesCanonicos.includes(chaveCanonica)) {
      return respostasAgrupadas[chave] || {};
    }
  }

  return {};
}

// ======================================================
// Extrai dados-base do usuário a partir das respostas
// do onboarding consolidado
//
// REGRA:
// - sobe para usuarios apenas o que Ã© central e reutilizável
// - mantÃ©m o restante no onboarding_respostas
// ======================================================
function extrairDadosBaseDoOnboarding({ perfilTipo, respostasAgrupadas }) {
  const perfil = obterSecao(respostasAgrupadas, ["perfil", "profile"]);
  const objetivo = obterSecao(respostasAgrupadas, ["objetivo", "goal"]);
  const dadosFisicos = obterSecao(respostasAgrupadas, [
    "dados-fisicos",
    "dados_fisicos",
    "body_data",
  ]);
  const rotina = obterSecao(respostasAgrupadas, ["rotina", "routine"]);

  // ====================================================
  // Nome:
  // prioriza nome_completo vindo do onboarding
  // ====================================================
  const nome = perfil?.nome_completo || perfil?.nome || null;

  // ====================================================
  // Idade e gÃªnero:
  // servem para qualquer perfil
  // ====================================================
  const idade = perfil?.idade ? Number(perfil.idade) : null;
  const genero = perfil?.genero || null;

  // ====================================================
  // Altura:
  // O frontend envia em metros (1.75). Normalizamos para cm
  // (175) para compatibilidade com calcularTmb (Mifflin-St Jeor)
  // e com o histórico de dados já salvos em cm no banco.
  // ====================================================
  const alturaRaw = perfil?.altura ? Number(perfil.altura) : null;
  const altura =
    alturaRaw !== null && Number.isFinite(alturaRaw)
      ? alturaRaw < 3
        ? Math.round(alturaRaw * 100) // metros → cm (1.75 → 175)
        : Math.round(alturaRaw)       // já em cm (175), normaliza inteiro
      : null;

  // ====================================================
  // Peso:
  // vem da etapa de dados fÃ­sicos do usuário final
  // ====================================================
  const peso = dadosFisicos?.peso ? Number(dadosFisicos.peso) : null;

  // ====================================================
  // Objetivo e nÃ­vel de atividade:
  // sÃ£o campos importantes para personalizaÃ§Ã£o do produto
  // ====================================================
  const objetivoPrincipal =
    objetivo?.objetivo_principal || objetivo?.objetivo || null;

  const nivelAtividade =
    rotina?.nivel_atividade || rotina?.atividade || null;

  // ====================================================
  // Para profissionais, mantemos apenas os dados-base
  // do cadastro principal no momento
  // ====================================================
  if (perfilTipo === "personal" || perfilTipo === "nutricionista") {
    return {
      nome,
      idade,
      genero,
      altura,
      peso: null,
      objetivo: null,
      nivel_atividade: null,
    };
  }

  // ====================================================
  // Para usuário final, materializamos os dados mais Ãºteis
  // para o restante da jornada
  // ====================================================
  return {
    nome,
    idade,
    genero,
    altura,
    peso,
    objetivo: objetivoPrincipal,
    nivel_atividade: nivelAtividade,
  };
}

function toNumberOrNull(value) {
  const numero = Number(value);
  return Number.isFinite(numero) ? numero : null;
}

function getActivityFactor(nivelAtividade) {
  const nivel = normalizarTexto(nivelAtividade);

  if (nivel === "alto") {
    return 1.55;
  }

  if (nivel === "moderado" || nivel === "medio" || nivel === "média") {
    return 1.4;
  }

  return 1.25;
}

function getTreinoFrequenciaBase(frequenciaTreino, objetivoPrincipal) {
  const frequencia = normalizarTexto(frequenciaTreino);

  if (frequencia === "5_mais") return 5;
  if (frequencia === "3_4") return 4;
  if (frequencia === "1_2") return 2;

  const objetivo = normalizarObjetivo(objetivoPrincipal);

  if (frequencia === "0") {
    if (objetivo === "hipertrofia") return 3;
    if (objetivo === "emagrecimento") return 3;
    if (objetivo === "condicionamento") return 3;
    return 2;
  }

  return objetivo === "hipertrofia" ? 4 : 3;
}

function getNivelUsuario({
  nivelAtividade,
  frequenciaTreino,
  objetivoPrincipal,
}) {
  const nivel = normalizarTexto(nivelAtividade);
  const freq = getTreinoFrequenciaBase(frequenciaTreino, objetivoPrincipal);

  if (nivel === "alto" || freq >= 5) return "avancado";
  if (nivel === "moderado" || nivel === "medio" || nivel === "média" || freq >= 3) {
    return "intermediario";
  }

  return "iniciante";
}

function getIntensidadeTreinoBase({
  nivelAtividade,
  frequenciaTreino,
  objetivoPrincipal,
}) {
  const nivelUsuario = getNivelUsuario({
    nivelAtividade,
    frequenciaTreino,
    objetivoPrincipal,
  });

  if (nivelUsuario === "avancado") return "moderada_alta";
  if (nivelUsuario === "intermediario") return "moderada";
  return "leve";
}

function getTipoTreinoBase(objetivoPrincipal) {
  const objetivo = normalizarObjetivo(objetivoPrincipal);

  if (objetivo === "hipertrofia") return "forca";
  if (objetivo === "emagrecimento") {
    return "caminhada_funcional_forca_basica";
  }
  if (objetivo === "condicionamento") return "cardio_funcional";
  return "mobilidade_caminhada_forca_leve";
}

function calcularTmb({ peso, altura, idade, genero }) {
  if (peso === null || altura === null || idade === null) {
    return null;
  }

  const generoNormalizado = normalizarTexto(genero);

  if (generoNormalizado === "masculino") {
    return Math.round(10 * peso + 6.25 * altura - 5 * idade + 5);
  }

  if (generoNormalizado === "feminino") {
    return Math.round(10 * peso + 6.25 * altura - 5 * idade - 161);
  }

  return null;
}

function derivarMetasOperacionais({ respostasAgrupadas }) {
  const perfil = obterSecao(respostasAgrupadas, ["perfil", "profile"]);
  const objetivo = obterSecao(respostasAgrupadas, ["objetivo", "goal"]);
  const dadosFisicos = obterSecao(respostasAgrupadas, [
    "dados-fisicos",
    "dados_fisicos",
    "body_data",
  ]);
  const rotina = obterSecao(respostasAgrupadas, ["rotina", "routine"]);

  const peso = toNumberOrNull(dadosFisicos?.peso);
  const altura = toNumberOrNull(perfil?.altura);
  const idade = toNumberOrNull(perfil?.idade);
  const genero = perfil?.genero || null;
  const objetivoPrincipal =
    objetivo?.objetivo_principal || objetivo?.objetivo || null;
  const nivelAtividade = rotina?.nivel_atividade || rotina?.atividade || null;
  const frequenciaTreino = rotina?.frequencia_treino || null;

  const tmb = calcularTmb({ peso, altura, idade, genero });
  const gastoEstimado = tmb
    ? Math.round(tmb * getActivityFactor(nivelAtividade))
    : null;

  let metaCalorica = gastoEstimado;
  const objetivoNormalizado = normalizarObjetivo(objetivoPrincipal);

  if (gastoEstimado) {
    if (objetivoNormalizado === "emagrecimento") {
      metaCalorica = Math.round(gastoEstimado * 0.85);
    } else if (objetivoNormalizado === "hipertrofia") {
      metaCalorica = Math.round(gastoEstimado * 1.08);
    } else {
      metaCalorica = Math.round(gastoEstimado * 0.98);
    }
  }

  let metaAgua = null;
  if (peso) {
    metaAgua = Math.round(peso * 35);

    const nivelNormalizado = normalizarTexto(nivelAtividade);
    if (nivelNormalizado === "alto") {
      metaAgua += 500;
    } else if (
      nivelNormalizado === "moderado" ||
      nivelNormalizado === "medio" ||
      nivelNormalizado === "média"
    ) {
      metaAgua += 250;
    }
  }

  let metaPassos = 8000;
  const nivelNormalizado = normalizarTexto(nivelAtividade);
  if (nivelNormalizado === "baixo") metaPassos = 7000;
  if (nivelNormalizado === "alto") metaPassos = 11000;

  const frequenciaTreinoBase = getTreinoFrequenciaBase(
    frequenciaTreino,
    objetivoPrincipal
  );
  const nivelUsuario = getNivelUsuario({
    nivelAtividade,
    frequenciaTreino,
    objetivoPrincipal,
  });
  const intensidadeTreinoBase = getIntensidadeTreinoBase({
    nivelAtividade,
    frequenciaTreino,
    objetivoPrincipal,
  });
  const tipoTreinoBase = getTipoTreinoBase(objetivoPrincipal);

  return {
    meta_calorica: metaCalorica,
    meta_agua: metaAgua,
    meta_passos: metaPassos,
    nivel_usuario: nivelUsuario,
    frequencia_treino_base: frequenciaTreinoBase,
    intensidade_treino_base: intensidadeTreinoBase,
    tipo_treino_base: tipoTreinoBase,
  };
}

// ======================================================
// Busca respostas já salvas do onboarding e devolve
// agrupadas por seÃ§Ã£o em formato de objeto
// ======================================================
function agruparRespostasDoOnboarding(respostasSalvas) {
  const respostasAgrupadas = {};

  for (const item of respostasSalvas) {
    respostasAgrupadas[item.secao] =
      typeof item.respostas_json === "string"
        ? JSON.parse(item.respostas_json)
        : item.respostas_json;
  }

  return respostasAgrupadas;
}

// ======================================================
// Gera a data atual em YYYY-MM-DD para salvar na tabela metas
// ======================================================
function obterDataAtualMysql() {
  return new Date().toISOString().slice(0, 10);
}

// ======================================================
// Normaliza objetivo principal para comparaÃ§Ã£o segura
// ======================================================
function normalizarObjetivo(objetivo) {
  return normalizarTexto(objetivo);
}

// ======================================================
// Cria meta inicial automática a partir do onboarding
// Responsável por:
// - criar a primeira meta do usuário final
// - evitar duplicaÃ§Ã£o de meta automática
// - respeitar o schema real da tabela metas
// ======================================================
async function criarMetaInicialSeAplicavel({
  usuarioId,
  perfilTipo,
  respostasAgrupadas,
}) {
  // ====================================================
  // Meta automática inicial sÃ³ faz sentido para usuário final
  // ====================================================
  if (perfilTipo !== "usuario") {
    return null;
  }

  const objetivo = obterSecao(respostasAgrupadas, ["objetivo", "goal"]);
  const dadosFisicos = obterSecao(respostasAgrupadas, [
    "dados-fisicos",
    "dados_fisicos",
    "body_data",
  ]);

  const objetivoPrincipal = normalizarObjetivo(
    objetivo?.objetivo_principal || objetivo?.objetivo || null
  );

  const pesoAtual =
    dadosFisicos?.peso !== undefined && dadosFisicos?.peso !== null
      ? Number(dadosFisicos.peso)
      : null;

  const pesoMeta =
    dadosFisicos?.peso_meta !== undefined && dadosFisicos?.peso_meta !== null
      ? Number(dadosFisicos.peso_meta)
      : null;

  // ====================================================
  // Sem peso atual ou peso meta válidos, nÃ£o criamos meta
  // ====================================================
  if (
    pesoAtual === null ||
    pesoMeta === null ||
    Number.isNaN(pesoAtual) ||
    Number.isNaN(pesoMeta)
  ) {
    return null;
  }

  // ====================================================
  // Se peso atual e meta forem iguais, nÃ£o faz sentido criar
  // uma meta automática inicial
  // ====================================================
  if (pesoAtual === pesoMeta) {
    return null;
  }

  // ====================================================
  // Evita duplicar meta automática criada pelo onboarding
  // ====================================================
  const metaAutomaticaExistente = await MetaModel.buscarMetaAutomaticaAtiva({
    usuarioId,
    tipoMeta: "peso",
  });

  if (metaAutomaticaExistente) {
    return metaAutomaticaExistente;
  }

  // ====================================================
  // Valida coerÃªncia da meta conforme o objetivo principal
  // ====================================================
  const ehEmagrecimento =
    objetivoPrincipal === "emagrecimento" ||
    objetivoPrincipal === "perda_de_peso" ||
    objetivoPrincipal === "perder_peso";

  const ehHipertrofia =
    objetivoPrincipal === "hipertrofia" ||
    objetivoPrincipal === "ganho_de_massa" ||
    objetivoPrincipal === "ganhar_massa";

  if (ehEmagrecimento && pesoMeta >= pesoAtual) {
    return null;
  }

  if (ehHipertrofia && pesoMeta <= pesoAtual) {
    return null;
  }

  // ====================================================
  // Caso nÃ£o bata com as regras acima, ainda permitimos criar
  // a meta automática se houver diferenÃ§a de peso
  // porque isso mantÃ©m o fluxo funcional e evita travas
  // ====================================================
  const descricao =
    `Meta criada automaticamente a partir do onboarding: ` +
    `sair de ${pesoAtual}kg para ${pesoMeta}kg.`;

  return await MetaModel.criarMeta({
    usuarioId,
    descricao,
    tipoMeta: "peso",
    valorMeta: pesoMeta,
    status: "ativa",
    dataInicio: obterDataAtualMysql(),
    dataFim: null,
  });
}

// ======================================================
// Buscar onboarding completo do usuário
// Responsável por:
// - localizar o onboarding principal
// - buscar respostas salvas
// - agrupar respostas por seÃ§Ã£o
// - devolver objeto pronto para o frontend
// ======================================================
exports.buscarOnboardingCompleto = async (usuarioId) => {
  console.log("[ONBOARDING] buscarOnboardingCompleto iniciado", {
    usuarioId,
  });

  const onboarding = await onboardingModel.buscarOnboardingPorUsuario(usuarioId);

  if (!onboarding) {
    console.log("[ONBOARDING] nenhum onboarding encontrado para o usuário", {
      usuarioId,
    });
    return null;
  }

  console.log("[ONBOARDING] onboarding encontrado", {
    usuarioId,
    onboardingId: onboarding.id,
    etapaAtual: onboarding.etapa_atual || null,
    status: onboarding.status || null,
  });

  const respostasSalvas = await onboardingModel.listarRespostas(onboarding.id);
  const respostasAgrupadas = agruparRespostasDoOnboarding(respostasSalvas);

  return {
    ...onboarding,
    respostas: respostasAgrupadas,
  };
};

// ======================================================
// Iniciar onboarding
// Responsável por:
// - validar perfil
// - verificar se já existe onboarding
// - criar onboarding se necessário
// - atualizar usuário como em andamento
// ======================================================
exports.iniciarOnboarding = async ({ usuarioId, perfilTipo }) => {
  if (perfilTipo && !validarPerfil(perfilTipo)) {
    throw new Error("Perfil de onboarding inválido");
  }

  // ====================================================
  // Fluxo unico:
  // qualquer perfil recebido e canonizado para "usuario"
  // mantendo compatibilidade com payload legado.
  // ====================================================
  const perfilCanonico = resolverPerfilCanonico(perfilTipo);

  const onboardingExistente =
    await onboardingModel.buscarOnboardingPorUsuario(usuarioId);

  if (onboardingExistente) {
    return await exports.buscarOnboardingCompleto(usuarioId);
  }

  await onboardingModel.criarOnboarding({
    usuarioId,
    perfilTipo: perfilCanonico,
  });

  await onboardingModel.atualizarUsuarioEmAndamento({
    usuarioId,
    perfilTipo: perfilCanonico,
  });

  return await exports.buscarOnboardingCompleto(usuarioId);
};

// ======================================================
// Salvar etapa do onboarding
// Responsável por:
// - validar perfil
// - criar onboarding se ainda nÃ£o existir
// - validar consistÃªncia do perfil
// - criar ou atualizar resposta da seÃ§Ã£o
// - atualizar etapa atual
// - marcar usuário como em andamento
// ======================================================
exports.salvarEtapa = async ({
  usuarioId,
  perfilTipo,
  secao,
  etapaAtual,
  respostas,
}) => {
  if (perfilTipo && !validarPerfil(perfilTipo)) {
    throw new Error("Perfil de onboarding inválido");
  }

  const perfilCanonico = resolverPerfilCanonico(perfilTipo);

  if (!secao) {
    throw new Error("A seção do onboarding é obrigatória");
  }

  if (etapaAtual === undefined || etapaAtual === null) {
    throw new Error("A etapa atual do onboarding é obrigatória");
  }

  if (!respostas || typeof respostas !== "object" || Array.isArray(respostas)) {
    throw new Error("As respostas do onboarding devem ser enviadas como objeto");
  }

  let onboarding = await onboardingModel.buscarOnboardingPorUsuario(usuarioId);

  if (!onboarding) {
    const onboardingId = await onboardingModel.criarOnboarding({
      usuarioId,
      perfilTipo: perfilCanonico,
    });

    onboarding = {
      id: onboardingId,
      usuario_id: usuarioId,
      perfil_tipo: perfilCanonico,
    };
  }

  // ====================================================
  // Compatibilidade legado:
  // nao bloqueia salvamento quando onboarding antigo
  // estiver com perfil legado no banco.
  // ====================================================

  // ======================================================
  // Canoniza a seÃ§Ã£o antes de persistir para garantir
  // escrita padronizada no banco (fonte Ãºnica de seÃ§Ã£o)
  // ======================================================
  const secaoCanonica = canonicalizarSecao(secao);
  const secoesEquivalentes = obterSecoesEquivalentes(secaoCanonica);

  const respostaExistente = await onboardingModel.buscarRespostaPorSecao({
    onboardingId: onboarding.id,
    secao: secaoCanonica,
    // Compatibilidade temporária para reaproveitar resposta legado
    // e evitar criar duplicata sem necessidade
    secoesEquivalentes,
  });

  if (respostaExistente) {
    // ====================================================
    // AtualizaÃ§Ã£o determinÃ­stica:
    // usa a linha encontrada por id para evitar no-op
    // e promove secao legado para canÃ´nica no mesmo update
    // ====================================================
    if (!respostaExistente.id) {
      throw new Error("Resposta de onboarding encontrada sem identificador");
    }

    await onboardingModel.atualizarRespostaPorId({
      onboardingId: onboarding.id,
      respostaId: respostaExistente.id,
      secaoCanonica,
      respostasJson: respostas,
    });
  } else {
    await onboardingModel.criarResposta({
      onboardingId: onboarding.id,
      usuarioId,
      perfilTipo: perfilCanonico,
      secao: secaoCanonica,
      respostasJson: respostas,
    });
  }

  await onboardingModel.atualizarEtapa({
    usuarioId,
    etapaAtual,
  });

  await onboardingModel.atualizarUsuarioEmAndamento({
    usuarioId,
    perfilTipo: perfilCanonico,
  });

  return await exports.buscarOnboardingCompleto(usuarioId);
};

// ======================================================
// Concluir onboarding
// Responsável por:
// - validar perfil
// - validar existÃªncia do onboarding
// - validar consistÃªncia do perfil
// - validar seÃ§Ãµes obrigatÃ³rias com aliases
// - materializar dados-base em usuarios
// - criar meta inicial automática quando aplicável
// - marcar onboarding como concluÃ­do
// - atualizar usuário como concluÃ­do
// - devolver rota correta do dashboard
// ======================================================
exports.concluirOnboarding = async ({ usuarioId, perfilTipo }) => {
  if (perfilTipo && !validarPerfil(perfilTipo)) {
    throw new Error("Perfil de onboarding inválido");
  }

  const perfilCanonico = resolverPerfilCanonico(perfilTipo);

  const onboarding = await onboardingModel.buscarOnboardingPorUsuario(usuarioId);

  if (!onboarding) {
    throw new Error("Onboarding não encontrado para este usuário");
  }

  // ====================================================
  // Compatibilidade legado:
  // permite concluir onboarding antigo, mas a finalizacao
  // sempre materializa perfil canonico "usuario".
  // ====================================================

  const respostasSalvas = await onboardingModel.listarRespostas(onboarding.id);

  const secoesRespondidasCanonicas = respostasSalvas.map((item) =>
    canonicalizarSecao(item.secao)
  );

  const secoesObrigatorias =
    SECOES_OBRIGATORIAS_POR_PERFIL[perfilCanonico] || [];

  const secoesObrigatoriasCanonicas = secoesObrigatorias.map((secao) =>
    canonicalizarSecao(secao)
  );

  const secoesFaltantes = secoesObrigatoriasCanonicas.filter(
    (secaoObrigatoria) => !secoesRespondidasCanonicas.includes(secaoObrigatoria)
  );

  if (secoesFaltantes.length > 0) {
    // ====================================================
    // Seções faltantes registradas como aviso mas não
    // bloqueiam a conclusão. O frontend controla o fluxo
    // de steps e falhas de rede mobile causavam 400 falsos.
    // ====================================================
    console.warn(
      "[ONBOARDING] Seções não encontradas no banco, prosseguindo com conclusão:",
      { usuarioId, secoesFaltantes }
    );
  }

  // ======================================================
  // Agrupa respostas por seÃ§Ã£o para extrair os dados-base
  // ======================================================
  const respostasAgrupadas = agruparRespostasDoOnboarding(respostasSalvas);

  // ======================================================
  // Extrai os dados-base que devem subir para usuarios
  // ======================================================
  const dadosBaseUsuario = extrairDadosBaseDoOnboarding({
    perfilTipo: perfilCanonico,
    respostasAgrupadas,
  });
  const metasOperacionais = derivarMetasOperacionais({
    respostasAgrupadas,
  });

  // ======================================================
  // Atualiza a tabela principal de usuários com os dados
  // mais importantes do onboarding
  // ======================================================
  console.log("[ONBOARDING] step: updateDadosBaseFromOnboarding", {
    usuarioId,
    dadosBaseUsuario,
    metasOperacionais,
  });
  await UsuarioModel.updateDadosBaseFromOnboarding({
    usuarioId,
    ...dadosBaseUsuario,
    ...metasOperacionais,
  });
  console.log("[ONBOARDING] step: updateDadosBaseFromOnboarding OK");

  // ======================================================
  // A meta inicial é complementar ao fluxo principal.
  // Se houver falha isolada na infraestrutura de metas,
  // não bloqueamos a conclusão do onboarding.
  // ======================================================
  try {
    await criarMetaInicialSeAplicavel({
      usuarioId,
      perfilTipo: perfilCanonico,
      respostasAgrupadas,
    });
  } catch (error) {
    console.error(
      "Aviso ao criar meta inicial automatica no onboarding:",
      error
    );
  }

  // ======================================================
  // Marca onboarding como concluído
  // ======================================================
  console.log("[ONBOARDING] step: concluirOnboarding (model)", { usuarioId });
  await onboardingModel.concluirOnboarding(usuarioId);
  console.log("[ONBOARDING] step: concluirOnboarding (model) OK");

  // ======================================================
  // Atualiza tabela de usuários com status concluído
  // e perfil final do sistema
  // ======================================================
  console.log("[ONBOARDING] step: atualizarUsuario", { usuarioId, perfilCanonico });
  await onboardingModel.atualizarUsuario({
    usuarioId,
    perfilTipo: perfilCanonico,
  });
  console.log("[ONBOARDING] step: atualizarUsuario OK");

  const onboardingAtualizado = await exports.buscarOnboardingCompleto(usuarioId);

  return {
    onboarding: onboardingAtualizado,
    redirecionarPara: obterRotaDashboardPorPerfil(perfilCanonico),
  };
};
// ======================================================
// Atualizar uma etapa especÃ­fica do onboarding
// Responsável por:
// - encontrar onboarding do usuário
// - validar existÃªncia da seÃ§Ã£o
// - atualizar respostas daquela seÃ§Ã£o
// - devolver onboarding completo atualizado
// ======================================================
exports.atualizarEtapa = async ({ usuarioId, secao, respostas }) => {
  if (!secao) {
    throw new Error("A seção é obrigatória para atualizar a etapa");
  }

  if (!respostas || typeof respostas !== "object" || Array.isArray(respostas)) {
    throw new Error("As respostas da etapa devem ser enviadas como objeto");
  }

  const onboarding = await onboardingModel.buscarOnboardingPorUsuario(usuarioId);

  if (!onboarding) {
    throw new Error("Onboarding não encontrado para este usuário");
  }

  // ======================================================
  // Canoniza a seÃ§Ã£o imediatamente antes da atualizaÃ§Ã£o
  // para manter consistÃªncia de escrita no banco
  // ======================================================
  const secaoCanonica = canonicalizarSecao(secao);
  const secoesEquivalentes = obterSecoesEquivalentes(secaoCanonica);

  const respostaExistente = await onboardingModel.buscarRespostaPorSecao({
    onboardingId: onboarding.id,
    secao: secaoCanonica,
    // Compatibilidade temporária para localizar seÃ§Ã£o legado
    // equivalente durante a migraÃ§Ã£o gradual
    secoesEquivalentes,
  });

  if (!respostaExistente) {
    throw new Error(
      "Não existe resposta salva para essa seção do onboarding"
    );
  }

  // ====================================================
  // AtualizaÃ§Ã£o determinÃ­stica:
  // usa a linha encontrada por id para evitar no-op
  // e promove secao legado para canÃ´nica no mesmo update
  // ====================================================
  if (!respostaExistente.id) {
    throw new Error("Resposta de onboarding encontrada sem identificador");
  }

  await onboardingModel.atualizarRespostaPorId({
    onboardingId: onboarding.id,
    respostaId: respostaExistente.id,
    secaoCanonica,
    respostasJson: respostas,
  });

  return await exports.buscarOnboardingCompleto(usuarioId);
};




