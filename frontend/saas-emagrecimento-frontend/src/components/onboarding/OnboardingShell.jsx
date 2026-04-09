"use client";

// ======================================================
// Shell visual do onboarding
// Responsável por:
// - criar o layout premium mobile-first
// - centralizar o conteúdo
// - manter consistência visual da jornada inicial
// ======================================================

export default function OnboardingShell({ children }) {
  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(124,58,237,0.22),_transparent_32%),linear-gradient(180deg,#070b18_0%,#0f172a_100%)] px-4 py-6 text-white sm:px-6">
      <div className="mx-auto flex min-h-screen w-full max-w-md items-center">
        <div className="w-full rounded-[32px] border border-white/10 bg-white/5 p-5 shadow-[0_24px_80px_rgba(0,0,0,0.35)] backdrop-blur-2xl sm:p-6">
          {children}
        </div>
      </div>
    </div>
  );
}