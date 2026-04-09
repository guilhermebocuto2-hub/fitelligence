// ======================================================
// Gráfico alimentar
// Mostra distribuição de macronutrientes com aspecto limpo
// e leitura rápida.
// ======================================================

"use client";

import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

const COLORS = ["#10b981", "#8b5cf6", "#f59e0b"];

function CustomTooltip({ active, payload }) {
  if (!active || !payload || !payload.length) return null;

  const item = payload[0];

  return (
    <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-xl">
      <p className="text-sm font-semibold text-slate-900">
        {item.name}: {item.value}g
      </p>
    </div>
  );
}

export default function NutritionBalanceChart({ data = [] }) {
  return (
    <div className="rounded-[28px] border border-slate-200 bg-white/90 p-5 shadow-[0_10px_30px_rgba(15,23,42,0.06)]">
      <div className="mb-5">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
          Nutrição
        </p>
        <h3 className="mt-2 text-lg font-semibold tracking-tight text-slate-900">
          Distribuição alimentar
        </h3>
        <p className="mt-1 text-sm text-slate-500">
          Veja rapidamente o equilíbrio entre proteínas, carboidratos e gorduras.
        </p>
      </div>

      <div className="grid items-center gap-4 md:grid-cols-[1.2fr_0.8fr]">
        <div className="h-[260px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Tooltip content={<CustomTooltip />} />
              <Pie
                data={data}
                dataKey="value"
                nameKey="name"
                innerRadius={70}
                outerRadius={95}
                paddingAngle={4}
                stroke="none"
              >
                {data.map((entry, index) => (
                  <Cell key={entry.name} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="space-y-3">
          {data.map((item, index) => (
            <div
              key={item.name}
              className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50/70 px-4 py-3"
            >
              <div className="flex items-center gap-3">
                <span
                  className="h-3 w-3 rounded-full"
                  style={{ backgroundColor: COLORS[index % COLORS.length] }}
                />
                <span className="text-sm font-medium text-slate-700">
                  {item.name}
                </span>
              </div>

              <span className="text-sm font-semibold text-slate-900">
                {item.value}g
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}