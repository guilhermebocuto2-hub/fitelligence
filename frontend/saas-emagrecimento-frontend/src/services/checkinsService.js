import { api } from "../lib/api";

// ======================================================
// Services de check-ins
// Responsavel por:
// - criar check-in diario
// - listar historico de check-ins do usuario
// ======================================================

export async function createCheckinService(payload) {
  return api.post("/checkins", payload);
}

export async function listCheckinsService() {
  return api.get("/checkins");
}

