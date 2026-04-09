// ======================================================
// Motor de personalização do dashboard
// Responsável por:
// - ler o perfil do usuário
// - interpretar respostas do onboarding
// - definir título principal do dashboard
// - definir CTA principal
// - definir módulos prioritários
// - orientar a ordem visual dos blocos
// ======================================================

// ======================================================
// Função helper para ler valores de forma segura
// ======================================================
function getResposta(respostas = {}, secao = "", campo = "") {
  return respostas?.[secao]?.[campo] ?? null;
}

// ======================================================
// Monta personalização para usuário final
// ======================================================
function getUsuarioPersonalization(respostas = {}) {
  const objetivoPrincipal = getResposta(
    respostas,
    "objetivo",
    "objetivo_principal"
  );

  const dificuldadeAlimentar = getResposta(
    respostas,
    "alimentacao",
    "dificuldade_alimentar"
  );

  const principalBarreira = getResposta(
    respostas,
    "motivacao",
    "principal_barreira"
  );

  const nivelAtividade = getResposta(
    respostas,
    "rotina",
    "nivel_atividade"
  );

  // ====================================================
  // Config padrão
  // ====================================================
  let heroTitle = "Sua jornada está pronta para evoluir";
  let heroSubtitle =
    "Organize sua rotina, acompanhe resultados e use IA para manter consistência.";
  let primaryCta = "Registrar progresso";
  let priorityModules = ["progresso", "alimentacao", "motivacao", "plano"];
  let spotlight = "constancia";

  // ====================================================
  // Ajustes por objetivo principal
  // ====================================================
  if (objetivoPrincipal === "emagrecimento") {
    heroTitle = "Seu foco agora é emagrecer com constância";
    heroSubtitle =
      "Vamos priorizar alimentação, rotina e evolução semanal para acelerar resultado.";
    primaryCta = "Registrar refeição";
    priorityModules = ["alimentacao", "progresso", "motivacao", "plano"];
    spotlight = "alimentacao";
  }

  if (objetivoPrincipal === "hipertrofia") {
    heroTitle = "Seu foco agora é ganhar massa com estratégia";
    heroSubtitle =
      "Vamos acompanhar rotina, evolução física e consistência alimentar com inteligência.";
    primaryCta = "Registrar treino";
    priorityModules = ["progresso", "plano", "alimentacao", "motivacao"];
    spotlight = "performance";
  }

  if (objetivoPrincipal === "condicionamento") {
    heroTitle = "Seu foco agora é melhorar seu condicionamento";
    heroSubtitle =
      "Seu dashboard vai destacar consistência, rotina e evolução de performance.";
    primaryCta = "Registrar atividade";
    priorityModules = ["progresso", "motivacao", "plano", "alimentacao"];
    spotlight = "rotina";
  }

  // ====================================================
  // Ajuste fino por dificuldade alimentar
  // ====================================================
  if (dificuldadeAlimentar) {
    heroSubtitle =
      "Sua alimentação merece atenção especial. Vamos usar o dashboard para reforçar aderência e clareza no dia a dia.";
    priorityModules = ["alimentacao", "progresso", "motivacao", "plano"];
    spotlight = "alimentacao";
  }

  // ====================================================
  // Ajuste por barreira comportamental
  // ====================================================
  if (principalBarreira) {
    heroSubtitle =
      "Seu dashboard vai te ajudar a vencer barreiras comportamentais com mais clareza, rotina e feedback visual.";
  }

  // ====================================================
  // Ajuste por nível de atividade muito baixo
  // ====================================================
  if (nivelAtividade === "baixo") {
    priorityModules = ["motivacao", "plano", "progresso", "alimentacao"];
    primaryCta = "Começar rotina";
    spotlight = "motivacao";
  }

  return {
    perfilTipo: "usuario",
    heroTitle,
    heroSubtitle,
    primaryCta,
    priorityModules,
    spotlight,
  };
}

// ======================================================
// Monta personalização para personal trainer
// ======================================================
function getPersonalPersonalization(respostas = {}) {
  const numeroAlunos = getResposta(
    respostas,
    "atuacao-profissional",
    "numero_alunos"
  );

  const principalDor = getResposta(
    respostas,
    "modelo-acompanhamento-personal",
    "principal_dor_acompanhamento"
  );

  const interesseIa = getResposta(
    respostas,
    "ia-corporal",
    "interesse_ia_corporal"
  );

  let heroTitle = "Sua operação pode crescer com mais inteligência";
  let heroSubtitle =
    "Organize alunos, check-ins e evolução corporal com uma visão mais estratégica.";
  let primaryCta = "Ver alunos";
  let priorityModules = ["alunos", "checkins", "ia_corporal", "operacao"];
  let spotlight = "operacao";

  if (numeroAlunos === "31_60" || numeroAlunos === "60_mais") {
    heroTitle = "Você já está em fase de escala";
    heroSubtitle =
      "Seu dashboard vai priorizar organização, alunos em atenção e produtividade da operação.";
    primaryCta = "Ver alunos com alerta";
    priorityModules = ["alunos", "operacao", "checkins", "ia_corporal"];
    spotlight = "escala";
  }

  if (principalDor) {
    heroSubtitle =
      "Vamos organizar seu acompanhamento com mais clareza, previsibilidade e percepção de valor para os alunos.";
  }

  if (interesseIa === "muito_alto" || interesseIa === "alto") {
    primaryCta = "Ver evolução corporal";
    priorityModules = ["ia_corporal", "alunos", "checkins", "operacao"];
    spotlight = "ia_corporal";
  }

  return {
    perfilTipo: "personal",
    heroTitle,
    heroSubtitle,
    primaryCta,
    priorityModules,
    spotlight,
  };
}

// ======================================================
// Monta personalização para nutricionista
// ======================================================
function getNutricionistaPersonalization(respostas = {}) {
  const numeroPacientes = getResposta(
    respostas,
    "atuacao-clinica",
    "numero_pacientes"
  );

  const principalDor = getResposta(
    respostas,
    "modelo-acompanhamento-nutri",
    "principal_dor_acompanhamento_nutri"
  );

  const interesseIa = getResposta(
    respostas,
    "ia-alimentar",
    "interesse_ia_alimentar"
  );

  let heroTitle = "Seu acompanhamento pode ser mais contínuo e inteligente";
  let heroSubtitle =
    "Use o dashboard para acompanhar aderência, comportamento alimentar e evolução clínica com mais precisão.";
  let primaryCta = "Ver aderência alimentar";
  let priorityModules = ["aderencia", "refeicoes", "pacientes", "insights"];
  let spotlight = "aderencia";

  if (numeroPacientes === "51_100" || numeroPacientes === "100_mais") {
    heroTitle = "Sua rotina clínica precisa de escala com clareza";
    heroSubtitle =
      "O dashboard vai priorizar aderência, pacientes em risco e inteligência alimentar para facilitar decisão.";
    primaryCta = "Ver pacientes com baixa aderência";
    priorityModules = ["pacientes", "aderencia", "refeicoes", "insights"];
    spotlight = "escala_clinica";
  }

  if (principalDor) {
    heroSubtitle =
      "Vamos transformar acompanhamento entre consultas em algo mais visível, contínuo e profissional.";
  }

  if (interesseIa === "muito_alto" || interesseIa === "alto") {
    primaryCta = "Ver análises alimentares";
    priorityModules = ["refeicoes", "aderencia", "pacientes", "insights"];
    spotlight = "ia_alimentar";
  }

  return {
    perfilTipo: "nutricionista",
    heroTitle,
    heroSubtitle,
    primaryCta,
    priorityModules,
    spotlight,
  };
}

// ======================================================
// Função principal do motor de personalização
// ======================================================
export function getDashboardPersonalization({
  perfilTipo = "",
  respostas = {},
}) {
  if (perfilTipo === "usuario") {
    return getUsuarioPersonalization(respostas);
  }

  if (perfilTipo === "personal") {
    return getPersonalPersonalization(respostas);
  }

  if (perfilTipo === "nutricionista") {
    return getNutricionistaPersonalization(respostas);
  }

  return {
    perfilTipo: "usuario",
    heroTitle: "Bem-vindo ao Fitelligence",
    heroSubtitle:
      "Seu dashboard vai se adaptar ao seu perfil e à sua jornada.",
    primaryCta: "Começar",
    priorityModules: ["progresso", "plano", "alimentacao"],
    spotlight: "geral",
  };
}