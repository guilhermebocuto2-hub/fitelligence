// ======================================================
// Gráfico de check-ins
// Exibe energia, motivação e humor com linhas suaves.
// ======================================================

"use client";

import {
  LineChart,
  Line,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Legend,
} from "recharts";

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload || !payload.length) return null;

  return (
    <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-xl">
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
        {label}
      </p>

      <div className="mt-2 space-y-1">
        {payload.map((item) => (
          <p key={item.dataKey} className="text-sm font-medium text-slate-800">
            {item.name}: {item.value}
          </p>
        ))}
      </div>
    </div>
  );
}

export default function CheckinTrendChart({ data = [] }) {
  return (
    <div className="rounded-[28px] border border-slate-200 bg-white/90 p-5 shadow-[0_10px_30px_rgba(15,23,42,0.06)]">
      <div className="mb-5">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
          Comportamento
        </p>
        <h3 className="mt-2 text-lg font-semibold tracking-tight text-slate-900">
          Check-ins e consistência
        </h3>
        <p className="mt-1 text-sm text-slate-500">
          Entenda os sinais emocionais e comportamentais do usuário.
        </p>
      </div>

      <div className="h-[280px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
            <XAxis
              dataKey="label"
              tickLine={false}
              axisLine={false}
              tick={{ fill: "#64748b", fontSize: 12 }}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tick={{ fill: "#64748b", fontSize: 12 }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend />

            <Line
              type="monotone"
              dataKey="energia"
              stroke="#8b5cf6"
              strokeWidth={3}
              dot={false}
              name="Energia"
            />
            <Line
              type="monotone"
              dataKey="motivacao"
              stroke="#10b981"
              strokeWidth={3}
              dot={false}
              name="Motivação"
            />
            <Line
              type="monotone"
              dataKey="humor"
              stroke="#f59e0b"
              strokeWidth={3}
              dot={false}
              name="Humor"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}