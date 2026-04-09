"use client";

import HoverCard from "./HoverCard";

export default function MetricCard({
  title,
  value,
  description,
  badge = null,
  highlight = false,
}) {
  return (
    <HoverCard>
      <div
        className={`rounded-[24px] border p-5 shadow-sm transition-all duration-300 hover:shadow-md ${
          highlight
            ? "border-slate-900 bg-slate-900 text-white"
            : "border-slate-200 bg-white text-slate-900 hover:border-emerald-200"
        }`}
      >
        <div className="flex items-start justify-between gap-3">
          <p
            className={`text-[11px] font-semibold uppercase tracking-[0.18em] ${
              highlight ? "text-slate-300" : "text-slate-400"
            }`}
          >
            {title}
          </p>

          {badge ? (
            <span
              className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${
                highlight
                  ? "bg-white/10 text-white"
                  : "bg-emerald-50 text-emerald-700"
              }`}
            >
              {badge}
            </span>
          ) : null}
        </div>

        <h3 className="mt-4 text-3xl font-semibold tracking-tight">{value}</h3>

        {description ? (
          <p
            className={`mt-2 text-sm leading-6 ${
              highlight ? "text-slate-300" : "text-slate-500"
            }`}
          >
            {description}
          </p>
        ) : null}
      </div>
    </HoverCard>
  );
}