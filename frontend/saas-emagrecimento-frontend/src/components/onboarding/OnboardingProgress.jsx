"use client";

// ======================================================
// Barra de progresso premium do onboarding
// Responsável por:
// - mostrar avanço da jornada
// - reforçar sensação de progresso
// - deixar o visual mais profissional
// ======================================================

export default function OnboardingProgress({
  currentStep = 0,
  totalSteps = 1,
}) {
  // ====================================================
  // Evita divisão por zero e valores quebrados
  // ====================================================
  const total = totalSteps > 0 ? totalSteps : 1;
  const atual = currentStep > 0 ? currentStep : 0;

  // ====================================================
  // Calcula o percentual de forma segura
  // ====================================================
  const progress = Math.round((atual / total) * 100);

  return (
    <div className="space-y-3">
      {/* =================================================
          Cabeçalho da barra de progresso
         ================================================= */}
      <div className="flex items-center justify-between gap-3">
        <span className="text-xs font-medium uppercase tracking-[0.2em] text-slate-400">
          Progresso
        </span>

        <span className="text-sm font-semibold text-white">
          {atual}/{total}
        </span>
      </div>

      {/* =================================================
          Barra principal
         ================================================= */}
      <div className="h-3 w-full overflow-hidden rounded-full bg-white/10">
        <div
          className="h-full rounded-full bg-gradient-to-r from-violet-400 to-fuchsia-400 transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* =================================================
          Percentual textual
         ================================================= */}
      <p className="text-xs text-slate-400">
        {progress}% concluído
      </p>
    </div>
  );
}