import { api } from "../lib/api";

// ======================================================
// Service de comparacao corporal
// Responsavel por:
// - buscar fotos para comparacao antes/depois
// - manter consumo simples e compativel com backend atual
// ======================================================
export async function getComparacaoCorporalService() {
  return api.get("/comparacao-corporal");
}
