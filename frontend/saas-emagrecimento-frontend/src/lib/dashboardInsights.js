// ======================================================
// Motor de insights automáticos do dashboard
// Responsável por:
// - interpretar dados do dashboard
// - gerar leitura estratégica
// - adaptar insights por perfil
// - aproximar o produto de um assistente inteligente
// ======================================================

// ======================================================
// Helper para leitura segura de números
// ======================================================
function toNumber(value, fallback = 0) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

// ======================================================
// Gera insights para usuário final
// ======================================================
function getUsuarioInsights(dashboard = {}) {
  const perdaTotal = toNumber(dashboard?.perda_total, 0);
  const scoreAlimentar = toNumber(dashboard?.score_alimentar, 0);
  const scoreConsistencia = toNumber(dashboard?.score_consistencia, 0);
  const totalRegistros = toNumber(dashboard?.total_registros_progresso, 0);

  const insights = [];

  if (totalRegistros <= 1) {
    insights.push({
      titulo: "Base de dados ainda pequena",
      descricao:
        "Ainda existem poucos registros para uma leitura evolutiva realmente confiável. Quanto mais constância nos registros, mais inteligente o sistema fica.",
      tipo: "info",
    });
  }

  if (perdaTotal > 0 && scoreConsistencia >= 60) {
    insights.push({
      titulo: "Sua consistência está sustentando sua evolução",
      descricao:
        "Os dados sugerem que sua constância recente está ajudando seu progresso corporal a acontecer de forma mais sólida.",
      tipo: "success",
    });
  }

  if (scoreAlimentar < 60 && totalRegistros >= 2) {
    insights.push({
      titulo: "A alimentação pode estar limitando seu resultado",
      descricao:
        "Mesmo com acompanhamento ativo, o score alimentar ainda está abaixo do ideal. Melhorar aderência pode acelerar sua evolução.",
      tipo: "warning",
    });
  }

  if (scoreConsistencia < 50) {
    insights.push({
      titulo: "A rotina ainda parece instável",
      descricao:
        "Seu dashboard indica baixa consistência recente. O maior ganho agora pode vir de disciplina operacional, não de complexidade.",
      tipo: "warning",
    });
  }

  if (insights.length === 0) {
    insights.push({
      titulo: "Sua jornada está em construção",
      descricao:
        "Continue registrando progresso, alimentação e comportamento. O Fitelligence vai refinar a leitura automaticamente com mais dados.",
      tipo: "info",
    });
  }

  return insights;
}

// ======================================================
// Gera insights para personal trainer
// ======================================================
function getPersonalInsights(dashboard = {}) {
  const totalCheckins = toNumber(dashboard?.total_checkins, 0);
  const scoreConsistencia = toNumber(dashboard?.score_consistencia, 0);
  const perdaTotal = toNumber(dashboard?.perda_total, 0);

  const insights = [];

  if (totalCheckins < 3) {
    insights.push({
      titulo: "Poucos sinais recentes dos alunos",
      descricao:
        "Com poucos check-ins, fica mais difícil identificar riscos e reforçar valor percebido no acompanhamento.",
      tipo: "warning",
    });
  }

  if (scoreConsistencia < 60) {
    insights.push({
      titulo: "Há espaço para melhorar a rotina de acompanhamento",
      descricao:
        "Os sinais recentes indicam oportunidade para reforçar consistência, controle e visibilidade da evolução dos alunos.",
      tipo: "info",
    });
  }

  if (perdaTotal > 0) {
    insights.push({
      titulo: "Existe evolução para comunicar com mais força",
      descricao:
        "Os dados mostram resultado positivo. Transformar isso em comunicação visual pode aumentar retenção e percepção de valor.",
      tipo: "success",
    });
  }

  if (insights.length === 0) {
    insights.push({
      titulo: "Sua operação está com boa estabilidade",
      descricao:
        "O cenário atual não aponta alertas críticos. Agora o melhor movimento é ganhar clareza, escala e previsibilidade.",
      tipo: "info",
    });
  }

  return insights;
}

// ======================================================
// Gera insights para nutricionista
// ======================================================
function getNutricionistaInsights(dashboard = {}) {
  const scoreAlimentar = toNumber(dashboard?.score_alimentar, 0);
  const totalRefeicoes = toNumber(dashboard?.total_refeicoes_analisadas, 0);
  const totalCheckins = toNumber(dashboard?.total_checkins, 0);

  const insights = [];

  if (totalRefeicoes <= 2) {
    insights.push({
      titulo: "Ainda há pouca leitura alimentar",
      descricao:
        "Com poucas refeições analisadas, a visão de aderência ainda está limitada. Mais dados melhoram muito a leitura clínica.",
      tipo: "info",
    });
  }

  if (scoreAlimentar < 60) {
    insights.push({
      titulo: "Aderência alimentar pede atenção",
      descricao:
        "O score alimentar atual sugere dificuldade de sustentação entre consultas. Esse pode ser o principal ponto de intervenção agora.",
      tipo: "warning",
    });
  }

  if (totalCheckins < 3) {
    insights.push({
      titulo: "Poucos sinais comportamentais recentes",
      descricao:
        "A combinação entre comportamento e alimentação ainda está pouco visível. Reforçar retorno e feedback contínuo pode melhorar a leitura clínica.",
      tipo: "info",
    });
  }

  if (insights.length === 0) {
    insights.push({
      titulo: "Boa base para acompanhamento clínico",
      descricao:
        "Os dados atuais já permitem uma leitura mais consistente da aderência e da rotina alimentar do paciente.",
      tipo: "success",
    });
  }

  return insights;
}

// ======================================================
// Função principal
// ======================================================
export function getDashboardInsights({
  perfilTipo = "usuario",
  dashboard = {},
}) {
  if (perfilTipo === "personal") {
    return getPersonalInsights(dashboard);
  }

  if (perfilTipo === "nutricionista") {
    return getNutricionistaInsights(dashboard);
  }

  return getUsuarioInsights(dashboard);
}