"use client";

import { useEffect, useMemo, useState } from "react";
import { getDashboardService } from "../../../src/services/dashboardService";
import {
  createMetaService,
  updateStatusMetaService,
} from "../../../src/services/metasService";
import EmptyState from "../../../src/components/ui/EmptyState";

function formatDate(dateString) {
  if (!dateString) return "Não definida";

  const date = new Date(dateString);

  return date.toLocaleDateString("pt-BR", {
    timeZone: "UTC",
  });
}

function formatTipo(tipo) {
  const tipos = {
    agua: "Água",
    sono: "Sono",
    passos: "Passos",
    peso: "Peso",
    treino: "Treino",
    dieta: "Dieta",
  };

  return tipos[tipo] || tipo;
}

function formatStatus(status) {
  const statusMap = {
    ativa: "Ativa",
    concluida: "Concluída",
    cancelada: "Cancelada",
  };

  return statusMap[status] || status;
}

function formatValorMeta(tipo, valor) {
  const valorNumerico = Number(valor);

  if (Number.isNaN(valorNumerico)) {
    return valor;
  }

  if (tipo === "agua") return `${valorNumerico} ml`;
  if (tipo === "sono") return `${valorNumerico} horas`;
  if (tipo === "passos") return `${valorNumerico} passos`;
  if (tipo === "peso") return `${valorNumerico} kg`;
  if (tipo === "treino") return `${valorNumerico} treinos`;
  if (tipo === "dieta") return `${valorNumerico} kcal`;

  return `${valorNumerico}`;
}

function getMetaPlaceholder(tipo) {
  if (tipo === "agua") return "Ex.: 3000";
  if (tipo === "sono") return "Ex.: 8";
  if (tipo === "passos") return "Ex.: 10000";
  if (tipo === "peso") return "Ex.: 75";
  if (tipo === "treino") return "Ex.: 5";
  if (tipo === "dieta") return "Ex.: 1800";

  return "Ex.: 100";
}

function getMetaUnitLabel(tipo) {
  if (tipo === "agua") return "Unidade: ml por dia";
  if (tipo === "sono") return "Unidade: horas por noite";
  if (tipo === "passos") return "Unidade: passos por dia";
  if (tipo === "peso") return "Unidade: kg";
  if (tipo === "treino") return "Unidade: treinos";
  if (tipo === "dieta") return "Unidade: kcal";

  return "Informe um valor numérico";
}

export default function MetasPage() {
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [updatingId, setUpdatingId] = useState(null);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const [form, setForm] = useState({
    descricao: "",
    tipo: "agua",
    valor_meta: "",
    data_inicio: new Date().toISOString().split("T")[0],
    data_fim: "",
  });

  async function carregarDashboard() {
    try {
      setLoading(true);
      setError("");

      const response = await getDashboardService();
      console.log("RESPOSTA DO DASHBOARD NA PAGINA METAS:", response);

      setDashboard(response.dashboard);
    } catch (err) {
      console.error("Erro ao carregar metas:", err);
      setError("Não foi possível carregar suas metas agora.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    carregarDashboard();
  }, []);

  const metasAtivas = useMemo(() => {
    return dashboard?.metas_ativas || [];
  }, [dashboard]);

  const metasConcluidas = useMemo(() => {
    return dashboard?.metas_concluidas || [];
  }, [dashboard]);

  const resumo = useMemo(() => {
    return {
      total_metas_ativas: dashboard?.metas_ativas?.length || 0,
      total_metas_concluidas_recentes:
        dashboard?.metas_concluidas?.length || 0,
    };
  }, [dashboard]);

  function handleChange(event) {
    const { name, value } = event.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();

    try {
      setSaving(true);
      setError("");
      setSuccessMessage("");

      await createMetaService({
        descricao: form.descricao,
        tipo: form.tipo,
        valor_meta: Number(form.valor_meta),
        data_inicio: form.data_inicio,
        data_fim: form.data_fim || null,
      });

      setSuccessMessage("Meta criada com sucesso.");

      setForm({
        descricao: "",
        tipo: "agua",
        valor_meta: "",
        data_inicio: new Date().toISOString().split("T")[0],
        data_fim: "",
      });

      await carregarDashboard();
    } catch (err) {
      console.error("Erro ao criar meta:", err);
      setError(
        err?.response?.data?.erro || "Não foi possível criar a meta agora."
      );
    } finally {
      setSaving(false);
    }
  }

  async function concluirMeta(id) {
    try {
      setUpdatingId(id);
      setError("");
      setSuccessMessage("");

      await updateStatusMetaService(id, {
        status: "concluida",
      });

      setSuccessMessage("Meta marcada como concluída.");
      await carregarDashboard();
    } catch (err) {
      console.error("Erro ao concluir meta:", err);
      setError(
        err?.response?.data?.erro ||
          "Não foi possível atualizar o status da meta."
      );
    } finally {
      setUpdatingId(null);
    }
  }

  async function cancelarMeta(id) {
    try {
      setUpdatingId(id);
      setError("");
      setSuccessMessage("");

      await updateStatusMetaService(id, {
        status: "cancelada",
      });

      setSuccessMessage("Meta cancelada com sucesso.");
      await carregarDashboard();
    } catch (err) {
      console.error("Erro ao cancelar meta:", err);
      setError(
        err?.response?.data?.erro || "Não foi possível cancelar a meta."
      );
    } finally {
      setUpdatingId(null);
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <p className="text-sm text-slate-500">Carregando metas...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.25em] text-slate-500">
              Planejamento inteligente
            </p>
            <h1 className="mt-2 text-3xl font-semibold text-slate-900">
              Suas metas
            </h1>
            <p className="mt-2 max-w-2xl text-sm text-slate-600">
              Crie metas com clareza, acompanhe seu desempenho e evolua com mais
              consistência.
            </p>
          </div>

          <div className="rounded-2xl border border-cyan-200 bg-cyan-50 px-4 py-3 text-sm text-cyan-700">
            <span className="font-semibold">
              {dashboard?.score_consistencia || 0}
            </span>{" "}
            pontos de consistência
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
              Metas ativas
            </p>
            <p className="mt-3 text-3xl font-semibold text-slate-900">
              {resumo.total_metas_ativas || 0}
            </p>
            <p className="mt-2 text-sm text-slate-500">
              Objetivos em andamento no momento.
            </p>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
              Concluídas recentes
            </p>
            <p className="mt-3 text-3xl font-semibold text-slate-900">
              {resumo.total_metas_concluidas_recentes || 0}
            </p>
            <p className="mt-2 text-sm text-slate-500">
              Metas finalizadas recentemente.
            </p>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
              Alertas ativos
            </p>
            <p className="mt-3 text-3xl font-semibold text-slate-900">
              {dashboard?.alertas?.length || 0}
            </p>
            <p className="mt-2 text-sm text-slate-500">
              Pontos que merecem sua atenção.
            </p>
          </div>
        </div>
      </section>

      <section className="mt-section grid gap-8 xl:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-6">
            <p className="text-sm uppercase tracking-[0.25em] text-emerald-600">
              Nova meta
            </p>
            <h2 className="mt-2 text-2xl font-semibold text-slate-900">
              Criar meta personalizada
            </h2>
            <p className="mt-2 text-sm text-slate-600">
              Defina um objetivo claro para acompanhar sua evolução com mais
              foco.
            </p>
          </div>

          {error ? (
            <div className="mb-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          ) : null}

          {successMessage ? (
            <div className="mb-4 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
              {successMessage}
            </div>
          ) : null}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Descrição da meta
              </label>
              <input
                type="text"
                name="descricao"
                value={form.descricao}
                onChange={handleChange}
                placeholder="Ex.: Beber 3 litros de água por dia"
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-cyan-400"
              />
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Tipo
                </label>
                <select
                  name="tipo"
                  value={form.tipo}
                  onChange={handleChange}
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-cyan-400"
                >
                  <option value="agua">Água</option>
                  <option value="sono">Sono</option>
                  <option value="passos">Passos</option>
                  <option value="peso">Peso</option>
                  <option value="treino">Treino</option>
                  <option value="dieta">Dieta</option>
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Valor da meta
                </label>
                <input
                  type="number"
                  step="0.01"
                  name="valor_meta"
                  value={form.valor_meta}
                  onChange={handleChange}
                  placeholder={getMetaPlaceholder(form.tipo)}
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-cyan-400"
                />
                <p className="mt-2 text-xs text-slate-500">
                  {getMetaUnitLabel(form.tipo)}
                </p>
              </div>
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Data de início
                </label>
                <input
                  type="date"
                  name="data_inicio"
                  value={form.data_inicio}
                  onChange={handleChange}
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Data final
                </label>
                <input
                  type="date"
                  name="data_fim"
                  value={form.data_fim}
                  onChange={handleChange}
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-cyan-400"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={saving}
              className="inline-flex w-full items-center justify-center rounded-2xl bg-cyan-500 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:scale-[1.01] active:scale-[0.98] hover:bg-cyan-400 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {saving ? "Salvando meta..." : "Criar nova meta"}
            </button>
          </form>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-6">
            <p className="text-sm uppercase tracking-[0.25em] text-violet-600">
              Visão rápida
            </p>
            <h2 className="mt-2 text-2xl font-semibold text-slate-900">
              Metas ativas
            </h2>
            <p className="mt-2 text-sm text-slate-600">
              Acompanhe o que está em andamento e conclua com um clique.
            </p>
          </div>

          <div className="space-y-4">
            {metasAtivas.length > 0 ? (
              metasAtivas.map((meta) => (
                <div
                  key={meta.id}
                  className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:shadow-md"
                >
                  <div className="flex flex-col gap-5">
                    <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                          Meta em andamento
                        </p>

                        <h3 className="mt-2 text-xl font-semibold text-slate-900">
                          {meta.descricao}
                        </h3>

                        <div className="mt-4 flex flex-wrap gap-2">
                          <span className="rounded-full border border-cyan-200 bg-cyan-50 px-3 py-1 text-xs font-medium text-cyan-700">
                            Tipo: {formatTipo(meta.tipo)}
                          </span>

                          <span className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700">
                            Meta: {formatValorMeta(meta.tipo, meta.valor_meta)}
                          </span>

                          <span className="rounded-full border border-violet-200 bg-violet-50 px-3 py-1 text-xs font-medium text-violet-700">
                            {formatStatus(meta.status)}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                        <p className="text-xs font-medium uppercase tracking-[0.18em] text-slate-400">
                          Data de início
                        </p>
                        <p className="mt-2 text-sm font-medium text-slate-700">
                          {formatDate(meta.data_inicio)}
                        </p>
                      </div>

                      <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                        <p className="text-xs font-medium uppercase tracking-[0.18em] text-slate-400">
                          Data final
                        </p>
                        <p className="mt-2 text-sm font-medium text-slate-700">
                          {meta.data_fim
                            ? formatDate(meta.data_fim)
                            : "Sem data final"}
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-3">
                      <button
                        type="button"
                        onClick={() => concluirMeta(meta.id)}
                        disabled={updatingId === meta.id}
                        className="inline-flex items-center justify-center rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-700 transition hover:bg-emerald-100 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-70"
                      >
                        {updatingId === meta.id
                          ? "Atualizando..."
                          : "Concluir meta"}
                      </button>

                      <button
                        type="button"
                        onClick={() => cancelarMeta(meta.id)}
                        disabled={updatingId === meta.id}
                        className="inline-flex items-center justify-center rounded-xl border border-red-200 bg-red-50 px-4 py-2 text-sm font-semibold text-red-700 transition hover:bg-red-100 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-70"
                      >
                        {updatingId === meta.id
                          ? "Atualizando..."
                          : "Cancelar meta"}
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <EmptyState
                title="Nenhuma meta ativa"
                description="Você ainda não possui metas ativas."
                className="min-h-[180px] rounded-2xl"
              />
            )}
          </div>
        </div>
      </section>

      <section className="mt-section rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="mb-6">
          <p className="text-sm uppercase tracking-[0.25em] text-amber-600">
            Histórico recente
          </p>
          <h2 className="mt-2 text-2xl font-semibold text-slate-900">
            Metas concluídas recentemente
          </h2>
        </div>

        <div className="space-y-4">
          {metasConcluidas.length > 0 ? (
            metasConcluidas.map((meta) => (
              <div
                key={meta.id}
                className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:shadow-md"
              >
                <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                      Meta finalizada
                    </p>

                    <h3 className="mt-2 text-xl font-semibold text-slate-900">
                      {meta.descricao}
                    </h3>

                    <div className="mt-4 flex flex-wrap gap-2">
                      <span className="rounded-full border border-cyan-200 bg-cyan-50 px-3 py-1 text-xs font-medium text-cyan-700">
                        Tipo: {formatTipo(meta.tipo)}
                      </span>

                      <span className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700">
                        Valor: {formatValorMeta(meta.tipo, meta.valor_meta)}
                      </span>

                      <span className="rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-medium text-amber-700">
                        {formatStatus(meta.status)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <EmptyState
              title="Nenhuma meta concluída recentemente"
              description="Assim que houver metas concluídas, elas aparecerão aqui."
              className="min-h-[180px] rounded-2xl"
            />
          )}
        </div>
      </section>
    </div>
  );
}
