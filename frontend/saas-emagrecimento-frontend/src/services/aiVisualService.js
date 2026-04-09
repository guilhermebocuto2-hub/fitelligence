import { api } from "../lib/api";

export async function uploadMealPhotoService({ file, descricao = "" }) {
  const form = new FormData();
  form.append("imagem", file);
  form.append("descricao", descricao);
  return api.post("/imagens/refeicao", form);
}

export async function listMealAnalysesService() {
  return api.get("/analises-refeicao");
}

export async function uploadBodyPhotoService({ file, descricao = "" }) {
  const form = new FormData();
  form.append("imagem", file);
  form.append("descricao", descricao);
  return api.post("/imagens/corporal", form);
}

export async function getBodyComparisonService() {
  return api.get("/comparacao-corporal");
}
