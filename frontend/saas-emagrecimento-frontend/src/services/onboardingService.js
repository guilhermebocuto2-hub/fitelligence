// ======================================================
// Serviços do onboarding
// Responsáveis por:
// - conversar com as rotas do backend
// - manter compatibilidade com o api.js baseado em fetch
// - retornar o JSON diretamente
// - alinhar payloads com o backend atual
// ======================================================

import { api } from "../lib/api";

// ======================================================
// Busca o estado atual do onboarding do usuário autenticado
// ======================================================
export async function buscarOnboardingService() {
  return api.get("/onboarding");
}

// ======================================================
// Inicia o onboarding para um perfil específico
// Backend espera:
// { perfil_tipo: "usuario" }
// ======================================================
export async function iniciarOnboardingService() {
  // ====================================================
  // Fluxo simplificado:
  // o frontend sempre envia "usuario", mantendo a mesma
  // assinatura para compatibilidade com chamadas legadas.
  // ====================================================
  return api.post("/onboarding/start", {
    perfil_tipo: "usuario",
  });
}

// ======================================================
// Salva uma etapa específica do onboarding
// Backend espera:
// {
//   perfil_tipo,
//   secao,
//   etapa_atual,
//   respostas
// }
// ======================================================
export async function salvarEtapaOnboardingService({
  secao,
  etapaAtual,
  respostas,
}) {
  // ====================================================
  // Mesmo que a chamada antiga envie outro perfil,
  // persistimos sempre como "usuario" no novo fluxo.
  // ====================================================
  return api.post("/onboarding/save-step", {
    perfil_tipo: "usuario",
    secao,
    etapa_atual: etapaAtual,
    respostas,
  });
}

// ======================================================
// Atualiza uma seção já existente do onboarding
// Backend espera:
// { respostas }
// ======================================================
export async function atualizarEtapaOnboardingService(secao, respostas) {
  return api.put(`/onboarding/update-step/${secao}`, {
    respostas,
  });
}

// ======================================================
// Conclui o onboarding
// Backend espera:
// { perfil_tipo }
// ======================================================
export async function concluirOnboardingService() {
  // ====================================================
  // Conclusao do onboarding no perfil unico do produto.
  // ====================================================
  return api.post("/onboarding/complete", {
    perfil_tipo: "usuario",
  });
}
