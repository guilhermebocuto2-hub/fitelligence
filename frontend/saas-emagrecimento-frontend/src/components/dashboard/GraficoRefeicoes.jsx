"use client";

// ======================================================
// Gráfico alimentar
// Mostra padrões e distribuição das refeições analisadas
// ======================================================

import {
  PieChart,
  UtensilsCrossed,
  BrainCircuit,
  ScanSearch,
} from "lucide-react";
import ChartCard from "../ui/ChartCard";

export default function GraficoRefeicoes() {
  // ====================================================
  // Lista de registros alimentares
  // No futuro isso pode vir diretamente da API
  // ====================================================
  const registros = [];

  // ====================================================
  // Verifica se já existe base suficiente para gráfico
  // ====================================================
  const hasData = registros.length > 0;

  return (
    <ChartCard
      title="Distribuição alimentar"
      subtitle="Entenda visualmente como a IA está interpretando seu padrão alimentar e sua base de refeições analisadas."
      icon={<PieChart size={20} />}
      rightContent={
        <div className="rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 text-right shadow-sm">
          <p className="text-[10px] uppercase tracking-[0.18em] text-slate-400">
            Leituras
          </p>
          <p className="mt-1 text-sm font-semibold text-slate-700">
            {hasData ? "Disponíveis" : "Sem base"}
          </p>
        </div>
      }
    >
      {hasData ? (
        <div className="rounded-3xl border border-slate-200 bg-gradient-to-br from-slate-50 to-white p-4 shadow-inner">
          {/* Cards de apoio */}
          <div className="mb-4 grid grid-cols-1 gap-3 md:grid-cols-3">
            <div className="rounded-2xl border border-slate-200 bg-white p-3">
              <p className="text-xs uppercase tracking-[0.16em] text-slate-400">
                Refeições
              </p>
              <p className="mt-2 text-xl font-bold text-slate-900">--</p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-3">
              <p className="text-xs uppercase tracking-[0.16em] text-slate-400">
                Classificações
              </p>
              <p className="mt-2 text-xl font-bold text-emerald-600">--</p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-3">
              <p className="text-xs uppercase tracking-[0.16em] text-slate-400">
                Padrão alimentar
              </p>
              <p className="mt-2 text-xl font-bold text-slate-900">--</p>
            </div>
          </div>

          {/* Área principal do gráfico */}
          <div className="flex h-[360px] items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-white text-slate-400">
            Área do gráfico de refeições
          </div>
        </div>
      ) : (
        <div className="rounded-3xl border border-dashed border-slate-200 bg-gradient-to-br from-slate-50 to-white p-6">
          <div className="flex min-h-[420px] flex-col items-center justify-center text-center">
            <div className="mb-5 flex h-20 w-20 items-center justify-center rounded-[28px] bg-white text-emerald-500 shadow-sm ring-1 ring-slate-100">
              <UtensilsCrossed size={32} />
            </div>

            <h4 className="text-2xl font-bold text-slate-900">
              Ainda não há refeições suficientes
            </h4>

            <p className="mt-3 max-w-xl text-sm leading-7 text-slate-500">
              Assim que mais refeições forem analisadas, este gráfico mostrará a
              distribuição do seu padrão alimentar com um visual mais forte,
              inteligente e profissional.
            </p>

            <div className="mt-8 grid w-full max-w-3xl grid-cols-1 gap-3 md:grid-cols-3">
              <div className="rounded-2xl border border-slate-200 bg-white p-4 text-left shadow-sm">
                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
                  <PieChart size={18} />
                </div>
                <p className="text-sm font-semibold text-slate-900">
                  Distribuição visual
                </p>
                <p className="mt-1 text-sm leading-6 text-slate-500">
                  Veja como sua alimentação será separada por categorias e leituras.
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-4 text-left shadow-sm">
                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
                  <BrainCircuit size={18} />
                </div>
                <p className="text-sm font-semibold text-slate-900">
                  Interpretação da IA
                </p>
                <p className="mt-1 text-sm leading-6 text-slate-500">
                  O sistema classificará padrões alimentares com mais precisão.
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-4 text-left shadow-sm">
                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
                  <ScanSearch size={18} />
                </div>
                <p className="text-sm font-semibold text-slate-900">
                  Base analítica
                </p>
                <p className="mt-1 text-sm leading-6 text-slate-500">
                  Mais refeições analisadas aumentam o valor dos insights gerados.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </ChartCard>
  );
}