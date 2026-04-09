import { api } from "../lib/api";

export async function createMetaService(data) {
  return api.post("/metas", data);
}

export async function getMetasService() {
  return api.get("/metas");
}

export async function updateStatusMetaService(id, data) {
  if (data?.status === "concluida") {
    return api.patch(`/metas/${id}/concluir`, data);
  }

  return api.put(`/metas/${id}`, data);
}
