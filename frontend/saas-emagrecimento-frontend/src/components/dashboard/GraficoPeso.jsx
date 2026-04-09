"use client";

// ======================================================
// Gráfico de evolução do peso
// Mostra a tendência dos registros do usuário
// ======================================================

import { LineChart, Activity, TrendingDown, Scale } from "lucide-react";
import ChartCard from "../ui/ChartCard";

export default function GraficoPeso() {
  // ====================================================
  // Lista de registros do peso
  // Futuramente este array pode ser substituído pelos
  // dados reais vindos da API
  // ====================================================
  const registros = [];

  // ====================================================
  // Verifica se existem dados suficientes para mostrar
  // o gráfico real
  // ====================================================
  const hasData = registros.length > 0;

  return (
    <ChartCard
      title="Evolução do peso"
      subtitle="Acompanhe visualmente a trajetória do peso ao longo do tempo com uma leitura mais clara da sua evolução."
      icon={<LineChart size={20} />}
      rightContent={
        <div className="rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 text-right shadow-sm">
          <p className="text-[10px] uppercase tracking-[0.18em] text-slate-400">
            Status
          </p>
          <p className="mt-1 text-sm font-semibold text-slate-700">
            {hasData ? "Em análise" : "Sem dados"}
          </p>
        </div>
      }
    >
      {hasData ? (
        // ==================================================
        // Área do gráfico real
        // Aqui depois você pode substituir pelo componente
        // do gráfico verdadeiro mantendo esta moldura visual
        // ==================================================
        <div className="rounded-3xl border border-slate-200 bg-gradient-to-br from-slate-50 to-white p-4 shadow-inner">
          {/* Topo de apoio visual */}
          <div className="mb-4 grid grid-cols-1 gap-3 md:grid-cols-3">
            <div className="rounded-2xl border border-slate-200 bg-white p-3">
              <p className="text-xs uppercase tracking-[0.16em] text-slate-400">
                Último peso
              </p>
              <p className="mt-2 text-xl font-bold text-slate-900">-- kg</p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-3">
              <p className="text-xs uppercase tracking-[0.16em] text-slate-400">
                Variação
              </p>
              <p className="mt-2 text-xl font-bold text-emerald-600">--</p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-3">
              <p className="text-xs uppercase tracking-[0.16em] text-slate-400">
                Tendência
              </p>
              <p className="mt-2 text-xl font-bold text-slate-900">--</p>
            </div>
          </div>

          {/* Área visual do gráfico */}
          <div className="flex h-[260px] items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-white text-slate-400">
            Área do gráfico de peso
          </div>
        </div>
      ) : (
        // ==================================================
        // Estado vazio do gráfico
        // Exibido quando ainda não existem dados suficientes
        // ==================================================
        <div className="rounded-3xl border border-dashed border-slate-200 bg-gradient-to-br from-slate-50 to-white p-6">
          <div className="flex min-h-[320px] flex-col items-center justify-center text-center">
            {/* Ícone principal */}
            <div className="mb-5 flex h-20 w-20 items-center justify-center rounded-[28px] bg-white text-emerald-500 shadow-sm ring-1 ring-slate-100">
              <Activity size={32} />
            </div>

            {/* Título */}
            <h4 className="text-2xl font-bold text-slate-900">
              Ainda não há histórico de peso suficiente
            </h4>

            {/* Texto auxiliar */}
            <p className="mt-3 max-w-xl text-sm leading-7 text-slate-500">
              Conforme novos registros forem adicionados, a evolução do peso
              aparecerá aqui com visual analítico, histórico comparativo e uma
              leitura mais profissional da sua jornada.
            </p>

            {/* Cards auxiliares inferiores */}
            <div className="mt-8 grid w-full max-w-3xl grid-cols-1 gap-3 md:grid-cols-3">
              <div className="rounded-2xl border border-slate-200 bg-white p-4 text-left shadow-sm">
                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
                  <Scale size={18} />
                </div>
                <p className="text-sm font-semibold text-slate-900">
                  Registro inicial
                </p>
                <p className="mt-1 text-sm leading-6 text-slate-500">
                  Cadastre o primeiro peso para iniciar a leitura da evolução.
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-4 text-left shadow-sm">
                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
                  <TrendingDown size={18} />
                </div>
                <p className="text-sm font-semibold text-slate-900">
                  Tendência futura
                </p>
                <p className="mt-1 text-sm leading-6 text-slate-500">
                  O sistema exibirá tendência de ganho, manutenção ou perda.
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-4 text-left shadow-sm">
                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
                  <LineChart size={18} />
                </div>
                <p className="text-sm font-semibold text-slate-900">
                  Visualização analítica
                </p>
                <p className="mt-1 text-sm leading-6 text-slate-500">
                  O gráfico mostrará sua curva de evolução conforme a base crescer.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </ChartCard>
  );
}