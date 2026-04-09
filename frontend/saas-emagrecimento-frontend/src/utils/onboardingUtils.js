// ======================================================
// Utilitários centrais do onboarding
// Responsável por:
// - definir perfis válidos do sistema
// - definir seções obrigatórias por perfil
// - definir rota correta de dashboard por perfil
// - centralizar regras reutilizadas no service
// ======================================================

// ======================================================
// Perfis válidos no Fitelligence
// ======================================================
const PERFIS_VALIDOS = ["usuario", "personal", "nutricionista"];
const PERFIL_UNICO_ATIVO = "usuario";

// ======================================================
// Seções obrigatórias do onboarding por perfil
// IMPORTANTE:
// Esses nomes precisam bater exatamente com as seções
// que o frontend salva no onboarding
// ======================================================
const SECOES_OBRIGATORIAS_POR_PERFIL = {
  usuario: [
    "boas-vindas",
    "perfil",
    "objetivo",
    "dados-fisicos",
    "rotina",
    "alimentacao",
    "motivacao",
  ],

  personal: [
    "boas-vindas",
    "perfil",
    "atuacao-profissional",
    "modelo-acompanhamento-personal",
    "ia-corporal",
    "meta-profissional-personal",
  ],

  nutricionista: [
    "boas-vindas",
    "perfil",
    "atuacao-clinica",
    "modelo-acompanhamento-nutri",
    "ia-alimentar",
    "meta-profissional-nutri",
  ],
};

// ======================================================
// Valida se o perfil informado é aceito pelo sistema
// ======================================================
function validarPerfil(perfil) {
  return PERFIS_VALIDOS.includes(perfil);
}

// ======================================================
// Resolve qualquer perfil legado para o perfil unico.
// ======================================================
function resolverPerfilCanonico() {
  return PERFIL_UNICO_ATIVO;
}

// ======================================================
// Retorna a rota correta do dashboard por perfil
// ======================================================
function obterRotaDashboardPorPerfil() {
  // ====================================================
  // Fluxo simplificado do app:
  // todos os perfis convergem para /dashboard.
  // ====================================================
  return "/dashboard";
}

// ======================================================
// Exportações do módulo
// ======================================================
module.exports = {
  PERFIS_VALIDOS,
  PERFIL_UNICO_ATIVO,
  SECOES_OBRIGATORIAS_POR_PERFIL,
  validarPerfil,
  resolverPerfilCanonico,
  obterRotaDashboardPorPerfil,
};
