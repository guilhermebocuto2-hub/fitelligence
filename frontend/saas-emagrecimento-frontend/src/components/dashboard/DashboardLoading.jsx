"use client";

// ======================================================
// Tela de carregamento premium do dashboard
// Responsável por:
// - exibir skeletons consistentes
// - manter a hierarquia visual da página
// - dar sensação de produto premium mesmo carregando
// ======================================================

import SkeletonBlock from "../ui/SkeletonBlock";

export default function DashboardLoading() {
  return (
    <div className="space-y-8">
      {/* ==================================================
          Hero principal
         ================================================== */}
      <div className="rounded-[32px] border border-slate-200 bg-white/90 p-8 shadow-[0_20px_60px_rgba(15,23,42,0.06)]">
        <SkeletonBlock className="h-6 w-44" rounded="rounded-full" />
        <SkeletonBlock className="mt-5 h-12 w-3/4 max-w-[720px]" />
        <SkeletonBlock className="mt-4 h-5 w-full max-w-[820px]" />
        <SkeletonBlock className="mt-3 h-5 w-2/3 max-w-[620px]" />

        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {[1, 2, 3].map((item) => (
            <div
              key={item}
              className="rounded-3xl border border-slate-200 bg-white/80 p-5 shadow-sm"
            >
              <SkeletonBlock className="h-4 w-28" />
              <SkeletonBlock className="mt-4 h-5 w-full" />
              <SkeletonBlock className="mt-3 h-5 w-5/6" />
            </div>
          ))}
        </div>
      </div>

      {/* ==================================================
          Métricas principais
         ================================================== */}
      <section>
        <SkeletonBlock className="h-5 w-40 rounded-full" />
        <SkeletonBlock className="mt-4 h-8 w-80" />
        <SkeletonBlock className="mt-3 h-5 w-full max-w-[680px]" />

        <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {[1, 2, 3, 4].map((item) => (
            <div
              key={item}
              className="rounded-[28px] border border-slate-200 bg-white/90 p-5 shadow-[0_10px_30px_rgba(15,23,42,0.06)]"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="w-full">
                  <SkeletonBlock className="h-4 w-24" />
                  <SkeletonBlock className="mt-5 h-10 w-32" />
                </div>

                <SkeletonBlock className="h-12 w-12" />
              </div>

              <SkeletonBlock className="mt-6 h-5 w-3/4" />
              <SkeletonBlock className="mt-4 h-8 w-24 rounded-full" />
            </div>
          ))}
        </div>
      </section>

      {/* ==================================================
          Ações rápidas
         ================================================== */}
      <section>
        <SkeletonBlock className="h-5 w-28 rounded-full" />
        <SkeletonBlock className="mt-4 h-8 w-56" />
        <SkeletonBlock className="mt-3 h-5 w-full max-w-[700px]" />

        <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {[1, 2, 3, 4].map((item) => (
            <div
              key={item}
              className="rounded-[28px] border border-slate-200 bg-white/90 p-5 shadow-[0_10px_30px_rgba(15,23,42,0.06)]"
            >
              <div className="flex items-start justify-between">
                <SkeletonBlock className="h-12 w-12" />
                <SkeletonBlock className="h-6 w-14 rounded-full" />
              </div>

              <SkeletonBlock className="mt-6 h-5 w-40" />
              <SkeletonBlock className="mt-3 h-5 w-full" />
              <SkeletonBlock className="mt-2 h-5 w-4/5" />
            </div>
          ))}
        </div>
      </section>

      {/* ==================================================
          Área analítica principal
         ================================================== */}
      <section>
        <SkeletonBlock className="h-5 w-32 rounded-full" />
        <SkeletonBlock className="mt-4 h-8 w-72" />
        <SkeletonBlock className="mt-3 h-5 w-full max-w-[760px]" />

        <div className="mt-6 grid gap-6 xl:grid-cols-3">
          <div className="rounded-[28px] border border-slate-200 bg-white/90 p-5 shadow-[0_10px_30px_rgba(15,23,42,0.06)] xl:col-span-2">
            <SkeletonBlock className="h-4 w-32" />
            <SkeletonBlock className="mt-3 h-7 w-48" />
            <SkeletonBlock className="mt-3 h-5 w-64" />
            <SkeletonBlock className="mt-8 h-[260px] w-full rounded-[24px]" />
          </div>

          <div className="rounded-[28px] border border-slate-200 bg-white/90 p-5 shadow-[0_10px_30px_rgba(15,23,42,0.06)]">
            <SkeletonBlock className="h-4 w-24" />
            <SkeletonBlock className="mt-3 h-7 w-44" />
            <SkeletonBlock className="mt-3 h-5 w-56" />
            <SkeletonBlock className="mt-8 h-[260px] w-full rounded-[24px]" />
          </div>
        </div>
      </section>

      {/* ==================================================
          Bloco final
         ================================================== */}
      <section>
        <div className="grid gap-6 xl:grid-cols-[1.35fr_0.65fr]">
          <div className="rounded-[28px] border border-slate-200 bg-white/90 p-5 shadow-[0_10px_30px_rgba(15,23,42,0.06)]">
            <SkeletonBlock className="h-4 w-28" />
            <SkeletonBlock className="mt-3 h-7 w-56" />
            <SkeletonBlock className="mt-3 h-5 w-64" />
            <SkeletonBlock className="mt-8 h-[260px] w-full rounded-[24px]" />
          </div>

          <div className="rounded-[28px] border border-slate-200 bg-white/90 p-5 shadow-[0_10px_30px_rgba(15,23,42,0.06)]">
            <SkeletonBlock className="h-4 w-36" />
            <SkeletonBlock className="mt-3 h-7 w-60" />
            <SkeletonBlock className="mt-3 h-5 w-64" />

            <div className="mt-8 space-y-4">
              {[1, 2, 3].map((item) => (
                <div
                  key={item}
                  className="rounded-3xl border border-slate-200 bg-slate-50/70 p-4"
                >
                  <SkeletonBlock className="h-4 w-24" />
                  <SkeletonBlock className="mt-3 h-5 w-full" />
                  <SkeletonBlock className="mt-2 h-5 w-5/6" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}