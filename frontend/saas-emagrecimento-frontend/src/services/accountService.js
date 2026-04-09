import { api } from "../lib/api";

export async function deleteMyAccountService() {
  return api.delete("/usuarios/minha-conta");
}
