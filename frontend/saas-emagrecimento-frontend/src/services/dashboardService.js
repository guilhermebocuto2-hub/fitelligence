import { api } from "../lib/api";

export async function getDashboardService() {
  return api.get("/dashboard");
}