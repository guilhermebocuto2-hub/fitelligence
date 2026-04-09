"use client";

import EvolutionChart from "./EvolutionChart";
import { analyzeEvolution } from "../../lib/evolutionAnalysis";

export default function EvolutionPanel({ historico = [] }) {
  const data = historico.map((item) => ({
    data: new Date(item.data_registro).toLocaleDateString("pt-BR"),
    peso: Number(item.peso),
  }));

  const analysis = analyzeEvolution(data);

  return (
    <div className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-950/70">
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">
          Tendência de evolução
        </h3>

        <EvolutionChart data={data} />

        <p className="text-sm text-slate-600 dark:text-slate-400">
          {analysis.message}
        </p>
      </div>
    </div>
  );
}