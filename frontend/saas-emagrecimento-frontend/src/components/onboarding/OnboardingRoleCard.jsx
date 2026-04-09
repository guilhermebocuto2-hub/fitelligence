"use client";

// ======================================================
// Card visual de escolha de perfil no onboarding
// Responsável por:
// - exibir cada perfil de forma premium
// - destacar o perfil selecionado
// - deixar a entrada do onboarding mais profissional
// ======================================================

export default function OnboardingRoleCard({
  title,
  subtitle,
  onClick,
  disabled = false,
  selected = false,
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`group w-full rounded-[28px] border px-5 py-5 text-left transition-all duration-200 ${
        selected
          ? "border-violet-400 bg-violet-500/15 shadow-[0_0_0_1px_rgba(167,139,250,0.2)]"
          : "border-white/10 bg-white/5 hover:-translate-y-0.5 hover:border-white/20 hover:bg-white/10"
      } disabled:cursor-not-allowed disabled:opacity-60`}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-2">
          <h3 className="text-base font-semibold text-white md:text-lg">
            {title}
          </h3>

          <p className="text-sm leading-6 text-slate-300">
            {subtitle}
          </p>
        </div>

        <div
          className={`mt-1 flex h-6 w-6 items-center justify-center rounded-full border transition ${
            selected
              ? "border-violet-300 bg-violet-400"
              : "border-white/20 bg-transparent group-hover:border-white/30"
          }`}
        >
          <div
            className={`h-2.5 w-2.5 rounded-full transition ${
              selected ? "bg-white" : "bg-transparent"
            }`}
          />
        </div>
      </div>
    </button>
  );
}