"use client";

// ======================================================
// Gráfico de check-ins
// Mostra frequência e regularidade das entradas do usuário
// ======================================================

import {
  CalendarDays,
  RefreshCcw,
  ShieldCheck,
  Repeat,
} from "lucide-react";
import ChartCard from "../ui/ChartCard";

export default function GraficoCheckins() {
  // ====================================================
  // Lista de registros de check-ins
  // No futuro estes dados podem vir da API real
  // ====================================================
  const registros = [];

  // ====================================================
  // Define se o gráfico real deve aparecer
  // ====================================================
  const hasData = registros.length > 0;

  return (
    <ChartCard
      title="Frequência de check-ins"
      subtitle="Visualize a consistência da sua rotina e a frequência das interações registradas no sistema."
      icon={<CalendarDays size={20} />}
      rightContent={
        <div className="rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 text-right shadow-sm">
          <p className="text-[10px] uppercase tracking-[0.18em] text-slate-400">
            Consistência
          </p>
          <p className="mt-1 text-sm font-semibold text-emerald-600">
            {hasData ? "Monitorando" : "Aguardando"}
          </p>
        </div>
      }
    >
      {hasData ? (
        <div className="rounded-3xl border border-slate-200 bg-gradient-to-br from-slate-50 to-white p-4 shadow-inner">
          {/* Cards superiores */}
          <div className="mb-4 grid grid-cols-1 gap-3 md:grid-cols-3">
            <div className="rounded-2xl border border-slate-200 bg-white p-3">
              <p className="text-xs uppercase tracking-[0.16em] text-slate-400">
                Check-ins
              </p>
              <p className="mt-2 text-xl font-bold text-slate-900">--</p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-3">
              <p className="text-xs uppercase tracking-[0.16em] text-slate-400">
                Frequência
              </p>
              <p className="mt-2 text-xl font-bold text-emerald-600">--</p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-3">
              <p className="text-xs uppercase tracking-[0.16em] text-slate-400">
                Regularidade
              </p>
              <p className="mt-2 text-xl font-bold text-slate-900">--</p>
            </div>
          </div>

          {/* Área do gráfico */}
          <div className="flex h-[260px] items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-white text-slate-400">
            Área do gráfico de check-ins
          </div>
        </div>
      ) : (
        <div className="rounded-3xl border border-dashed border-slate-200 bg-gradient-to-br from-slate-50 to-white p-6">
          <div className="flex min-h-[320px] flex-col items-center justify-center text-center">
            <div className="mb-5 flex h-20 w-20 items-center justify-center rounded-[28px] bg-white text-emerald-500 shadow-sm ring-1 ring-slate-100">
              <RefreshCcw size={32} />
            </div>

            <h4 className="text-2xl font-bold text-slate-900">
              Ainda não há check-ins suficientes
            </h4>

            <p className="mt-3 max-w-xl text-sm leading-7 text-slate-500">
              Assim que novos check-ins forem registrados, a frequência aparecerá
              aqui com uma leitura mais visual da sua disciplina, constância e
              comprometimento com a rotina.
            </p>

            <div className="mt-8 grid w-full max-w-3xl grid-cols-1 gap-3 md:grid-cols-3">
              <div className="rounded-2xl border border-slate-200 bg-white p-4 text-left shadow-sm">
                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
                  <CalendarDays size={18} />
                </div>
                <p className="text-sm font-semibold text-slate-900">
                  Frequência semanal
                </p>
                <p className="mt-1 text-sm leading-6 text-slate-500">
                  Acompanhe quantas vezes você interage com o sistema por semana.
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-4 text-left shadow-sm">
                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
                  <Repeat size={18} />
                </div>
                <p className="text-sm font-semibold text-slate-900">
                  Regularidade
                </p>
                <p className="mt-1 text-sm leading-6 text-slate-500">
                  O sistema identificará padrões de continuidade da sua rotina.
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-4 text-left shadow-sm">
                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
                  <ShieldCheck size={18} />
                </div>
                <p className="text-sm font-semibold text-slate-900">
                  Acompanhamento inteligente
                </p>
                <p className="mt-1 text-sm leading-6 text-slate-500">
                  Mais registros geram análises mais confiáveis sobre seu hábito.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </ChartCard>
  );
}