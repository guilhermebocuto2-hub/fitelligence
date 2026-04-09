import { api } from "../lib/api";

// ======================================================
// Serviço do plano diário
// Responsável por carregar o plano gerado no backend
// sem alterar os contratos já existentes do dashboard.
// ======================================================
export async function getDailyPlanService() {
  return api.get("/daily-plan");
}
