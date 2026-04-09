import { api } from "../lib/api";

export async function getDailyPlanExecutionService() {
  return api.get("/daily-plan/execution");
}

export async function updateDailyPlanExecutionService(payload) {
  return api.post("/daily-plan/execution", payload);
}
