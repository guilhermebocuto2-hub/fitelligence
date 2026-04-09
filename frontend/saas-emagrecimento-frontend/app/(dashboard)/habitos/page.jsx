"use client";

import { useEffect, useMemo, useState } from "react";
import { getDashboardService } from "../../../src/services/dashboardService";
import EmptyState from "../../../src/components/ui/EmptyState";

function CardResumo({ titulo, valor, descricao, destaque = false }) {
  return (
    <div className="group relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
      <div className="absolute inset-0 bg-gradient-to-br from-white via-white to-slate-50 pointer-events-none" />

      <div className="relative z-10">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
          {titulo}
        </p>

        <h3
          className={`mt-3 text-3xl font-bold tracking-tight ${
            destaque ? "text-emerald-700" : "text-slate-900"
          }`}
        >
          {valor}
        </h3>

        <p className="mt-4 text-sm leading-6 text-slate-500">{descricao}</p>

        <div
          className={`mt-4 h-1.5 w-16 rounded-full transition-all duration-300 group-hover:w-24 ${
            destaque ? "bg-emerald-500/20" : "bg-slate-900/10"
          }`}
        />
      </div>
    </div>
  );
}

function formatarData(data) {
  if (!data) return "-";

  const dataObj = new Date(data);

  if (Number.isNaN(dataObj.getTime())) return "-";

  return dataObj.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

function formatarAgua(valor) {
  if (valor === null || valor === undefined || valor === "") return "-";
  return `${Math.round(Number(valor))} ml`;
}

function formatarSono(valor) {
  if (valor === null || valor === undefined || valor === "") return "-";
  return `${Number(valor).toFixed(1).replace(".", ",")} h`;
}

function formatarPassos(valor) {
  if (valor === null || valor === undefined || valor === "") return "-";
  return `${Math.round(Number(valor))}`;
}

function formatarTreino(valor) {
  return valor ? "Realizado" : "Não realizado";
}

function BadgeTreino({ treino }) {
  const realizado = !!treino;

  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${
        realizado
          ? "bg-emerald-100 text-emerald-700"
          : "bg-amber-100 text-amber-700"
      }`}
    >
      {realizado ? "Treino realizado" : "Treino não realizado"}
    </span>
  );
}

export default function HabitosPage() {
  const [dashboard, setDashboard] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");

  useEffect(() => {
    async function carregarDados() {
      try {
        setCarregando(true);
        setErro("");

        const resposta = await getDashboardService();
        const dados = resposta?.dashboard || null;

        setDashboard(dados);
      } catch (error) {
        console.error("Erro ao carregar hábitos:", error);
        setErro("Não foi possível carregar os hábitos.");
      } finally {
        setCarregando(false);
      }
    }

    carregarDados();
  }, []);

  const historicoHabitos = useMemo(() => {
    // Normaliza o historico para referencia estavel no useMemo seguinte.
    return Array.isArray(dashboard?.historico_habitos)
      ? dashboard.historico_habitos
      : [];
  }, [dashboard]);

  const resumo = useMemo(() => {
    const total = historicoHabitos.length;
    const ultimo = total ? historicoHabitos[0] : null;

    if (!total) {
      return {
        total: 0,
        ultimo: null,
        mediaAgua: null,
        mediaSono: null,
        mediaPassos: null,
        totalTreinos: 0,
      };
    }

    const somaAgua = historicoHabitos.reduce(
      (acc, item) => acc + Number(item?.agua_ml || 0),
      0
    );

    const somaSono = historicoHabitos.reduce(
      (acc, item) => acc + Number(item?.horas_sono || 0),
      0
    );

    const somaPassos = historicoHabitos.reduce(
      (acc, item) => acc + Number(item?.passos || 0),
      0
    );

    const totalTreinos = historicoHabitos.reduce(
      (acc, item) => acc + (item?.treino_realizado ? 1 : 0),
      0
    );

    return {
      total,
      ultimo,
      mediaAgua: Math.round(somaAgua / total),
      mediaSono: Number((somaSono / total).toFixed(1)),
      mediaPassos: Math.round(somaPassos / total),
      totalTreinos,
    };
  }, [historicoHabitos]);

  if (carregando) {
    return (
      <div className="space-y-6">
        <div className="rounded-3xl border border-slate-200 bg-gradient-to-r from-white via-slate-50 to-emerald-50 p-6 shadow-sm">
          <div className="animate-pulse space-y-4">
            <div className="h-7 w-40 rounded bg-slate-200" />
            <div className="h-10 w-80 rounded bg-slate-200" />
            <div className="h-5 w-full max-w-2xl rounded bg-slate-100" />
          </div>
        </div>
      </div>
    );
  }

  if (erro) {
    return (
      <div className="rounded-3xl border border-red-200 bg-red-50 p-6">
        <h1 className="text-xl font-semibold text-red-700">Erro nos hábitos</h1>
        <p className="mt-2 text-red-600">{erro}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-slate-200 bg-gradient-to-r from-white via-slate-50 to-emerald-50 p-6 shadow-sm">
        <div className="flex flex-col gap-6 xl:flex-row xl:items-center xl:justify-between">
          <div className="flex-1 max-w-3xl">
            <div className="inline-flex items-center rounded-full bg-slate-900 text-white text-xs font-semibold px-3 py-1 mb-4">
              Rotina e consistência
            </div>

            <h1 className="text-3xl xl:text-4xl font-bold text-slate-900 tracking-tight leading-tight">
              Hábitos do usuário
            </h1>

            <p className="text-slate-600 mt-3 max-w-2xl leading-7">
              Acompanhe os registros reais de água, sono, passos e treino do
              usuário em uma visualização mais clara, útil e profissional.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 w-full xl:w-[360px] shrink-0">
            <div className="rounded-2xl border border-white/60 bg-white/80 backdrop-blur p-4 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Registros
              </p>
              <p className="mt-2 text-2xl font-bold text-slate-900">
                {resumo.total}
              </p>
            </div>

            <div className="rounded-2xl border border-white/60 bg-white/80 backdrop-blur p-4 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Último registro
              </p>
              <p className="mt-3 text-sm font-semibold text-slate-900">
                {formatarData(
                  resumo.ultimo?.data_registro || resumo.ultimo?.criado_em
                )}
              </p>
            </div>

            <div className="rounded-2xl border border-white/60 bg-white/80 backdrop-blur p-4 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Treinos
              </p>
              <p className="mt-2 text-2xl font-bold text-emerald-700">
                {resumo.totalTreinos}
              </p>
            </div>

            <div className="rounded-2xl border border-white/60 bg-white/80 backdrop-blur p-4 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Água média
              </p>
              <p className="mt-2 text-2xl font-bold text-slate-900">
                {formatarAgua(resumo.mediaAgua)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Bloco com espaçamento vertical padronizado entre seções */}
      <div className="mt-section grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        <CardResumo
          titulo="Água média"
          valor={formatarAgua(resumo.mediaAgua)}
          descricao="Média de água consumida nos registros de hábitos."
          destaque
        />

        <CardResumo
          titulo="Sono médio"
          valor={formatarSono(resumo.mediaSono)}
          descricao="Média de horas de sono registradas."
        />

        <CardResumo
          titulo="Passos médios"
          valor={formatarPassos(resumo.mediaPassos)}
          descricao="Média de passos informados no histórico."
        />

        <CardResumo
          titulo="Treinos"
          valor={`${resumo.totalTreinos}`}
          descricao="Total de registros com treino realizado."
        />
      </div>

      {/* Seção principal com padrão visual consistente */}
      <section className="mt-section relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="absolute inset-0 bg-gradient-to-br from-white via-white to-slate-50 pointer-events-none" />

        <div className="relative z-10">
          <div className="mb-5">
            <h2 className="text-2xl font-bold tracking-tight text-slate-900">
              Histórico de hábitos
            </h2>
            <p className="text-sm text-slate-500 mt-2 leading-6 max-w-2xl">
              Visualize os registros reais de água, sono, passos e treino.
            </p>
          </div>

          {historicoHabitos.length > 0 ? (
            <div className="space-y-4">
              {historicoHabitos.map((habito, index) => (
                <div
                  key={habito.id || index}
                  className="rounded-3xl border border-slate-200 bg-slate-50 p-5"
                >
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-3 mb-3">
                        <div className="inline-flex items-center rounded-full bg-slate-900 text-white text-xs font-semibold px-3 py-1">
                          Registro #{habito.id || index + 1}
                        </div>

                        <BadgeTreino treino={habito.treino_realizado} />
                      </div>

                      <h3 className="text-lg font-bold text-slate-900">
                        Rotina registrada em{" "}
                        {formatarData(habito.data_registro || habito.criado_em)}
                      </h3>

                      <p className="text-sm text-slate-500 mt-2">
                        Criado em {formatarData(habito.criado_em)}
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-3 lg:w-[360px]">
                      <div className="rounded-2xl border border-slate-200 bg-white px-3 py-3">
                        <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                          Água
                        </p>
                        <p className="mt-2 text-sm font-semibold text-slate-900">
                          {formatarAgua(habito.agua_ml)}
                        </p>
                      </div>

                      <div className="rounded-2xl border border-slate-200 bg-white px-3 py-3">
                        <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                          Sono
                        </p>
                        <p className="mt-2 text-sm font-semibold text-slate-900">
                          {formatarSono(habito.horas_sono)}
                        </p>
                      </div>

                      <div className="rounded-2xl border border-slate-200 bg-white px-3 py-3">
                        <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                          Passos
                        </p>
                        <p className="mt-2 text-sm font-semibold text-slate-900">
                          {formatarPassos(habito.passos)}
                        </p>
                      </div>

                      <div className="rounded-2xl border border-slate-200 bg-white px-3 py-3">
                        <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                          Treino
                        </p>
                        <p className="mt-2 text-sm font-semibold text-slate-900">
                          {formatarTreino(habito.treino_realizado)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
                        <EmptyState
              title="Nenhum hábito encontrado"
              description="Quando houver registros de hábitos, eles aparecerão aqui."
              className="rounded-3xl"
            />
          )}
        </div>
      </section>
    </div>
  );
}


