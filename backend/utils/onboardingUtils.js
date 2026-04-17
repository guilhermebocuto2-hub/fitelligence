// ======================================================
// Utilitários do onboarding
// Responsável por centralizar:
// - perfis válidos
// - seções obrigatórias por perfil
// - rota de dashboard por perfil
// ======================================================

// ======================================================
// Perfis válidos aceitos pelo sistema
// ======================================================
const PERFIS_VALIDOS = ["usuario", "personal", "nutricionista"];

// ======================================================
// Perfil canonico do produto nesta fase
// ======================================================
const PERFIL_UNICO_ATIVO = "usuario";

// ======================================================
// Seções obrigatórias por perfil
// Essas regras serão usadas na conclusão do onboarding
// ======================================================
const SECOES_OBRIGATORIAS_POR_PERFIL = {
  // ====================================================
  // IDs alinhados com os valores reais enviados pelo
  // frontend (src/data/onboardingConfig.js).
  // Isso evita bloqueio falso de conclusão no passo final.
  // ====================================================
  usuario: ["objetivo", "dados-fisicos", "rotina", "alimentacao", "motivacao"],
  personal: [
    "atuacao-profissional",
    "modelo-acompanhamento-personal",
    "ia-corporal",
    "meta-profissional-personal",
  ],
  nutricionista: [
    "atuacao-clinica",
    "modelo-acompanhamento-nutri",
    "ia-alimentar",
    "meta-profissional-nutri",
  ],
};

// ======================================================
// Validar se o perfil enviado é aceito
// ======================================================
function validarPerfil(perfilTipo) {
  return PERFIS_VALIDOS.includes(perfilTipo);
}

// ======================================================
// Resolve perfil recebido para o perfil canonico ativo.
// Mantem compatibilidade com payload legado sem quebrar
// contratos atuais de rotas.
// ======================================================
function resolverPerfilCanonico(perfilTipo) {
  if (!perfilTipo || !validarPerfil(perfilTipo)) {
    return PERFIL_UNICO_ATIVO;
  }

  return PERFIL_UNICO_ATIVO;
}

// ======================================================
// Retornar rota do dashboard por perfil
// ======================================================
function obterRotaDashboardPorPerfil(perfilTipo) {
  // ====================================================
  // Fluxo unico:
  // qualquer perfil legado redireciona para dashboard
  // principal do usuario.
  // ====================================================
  return "/dashboard";
}

module.exports = {
  PERFIS_VALIDOS,
  PERFIL_UNICO_ATIVO,
  SECOES_OBRIGATORIAS_POR_PERFIL,
  validarPerfil,
  resolverPerfilCanonico,
  obterRotaDashboardPorPerfil,
};
