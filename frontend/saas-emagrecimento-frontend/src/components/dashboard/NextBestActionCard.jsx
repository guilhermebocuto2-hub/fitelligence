"use client";

// Badge de status reutilizável do design system.
import StatusBadge from "../ui/StatusBadge";

// Card de "próxima melhor ação".
// Esse bloco aumenta muito a sensação de produto guiado e inteligente.
export default function NextBestActionCard({ dashboard }) {
  // Leitura segura dos dados do dashboard.
  const scoreAlimentar = dashboard?.score_alimentar ?? 0;
  const scoreConsistencia = dashboard?.score_consistencia ?? 0;
  const totalCheckins = dashboard?.total_checkins ?? 0;
  const totalRefeicoes = dashboard?.total_refeicoes_analisadas ?? 0;

  // Valores padrão do banner.
  let title = "Continue no seu ritmo atual";
  let description =
    "Seu desempenho geral está caminhando bem. A melhor ação agora é manter consistência para consolidar a evolução.";
  let ctaLabel = "Abrir check-ins";
  let ctaHref = "/checkins";
  let status = "success";
  let statusText = "bom momento";

  // Regras simples para definir a melhor ação do momento.
  // No futuro, essa lógica pode sair do frontend e vir diretamente do backend/IA.
  if (scoreAlimentar < 60) {
    title = "Sua próxima melhor ação é melhorar sua alimentação";
    description =
      "Seu score alimentar está abaixo do ideal. Registrar novas refeições e corrigir padrões alimentares tende a gerar impacto rápido.";
    ctaLabel = "Enviar refeição";
    ctaHref = "/refeicoes";
    status = "danger";
    statusText = "alta prioridade";
  } else if (scoreConsistencia < 70 || totalCheckins < 5) {
    title = "Sua próxima melhor ação é aumentar a consistência";
    description =
      "A IA percebeu espaço para melhorar o ritmo dos seus registros. Mais consistência gera recomendações mais fortes e maior aderência.";
    ctaLabel = "Fazer check-in";
    ctaHref = "/checkins";
    status = "warning";
    statusText = "atenção";
  } else if (totalRefeicoes < 3) {
    title = "Sua próxima melhor ação é alimentar a IA com mais dados";
    description =
      "O sistema precisa de mais refeições analisadas para aumentar a precisão das recomendações e do score alimentar.";
    ctaLabel = "Registrar refeição";
    ctaHref = "/refeicoes";
    status = "info";
    statusText = "coleta de dados";
  }

  return (
    <section className="relative overflow-hidden rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 hover:shadow-md">
      {/* Glow decorativo do card */}
      <div className="absolute right-0 top-0 h-32 w-32 rounded-full bg-emerald-100/50 blur-3xl" />

      <div className="relative z-10 flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
        {/* Conteúdo principal */}
        <div className="max-w-3xl">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-emerald-600">
            Próxima melhor ação
          </p>

          <h3 className="mt-2 text-2xl font-semibold tracking-tight text-slate-900">
            {title}
          </h3>

          <p className="mt-3 text-sm leading-7 text-slate-500">
            {description}
          </p>

          {/* Área de CTA principal */}
          <div className="mt-5 flex flex-wrap items-center gap-3">
            <a
              href={ctaHref}
              className="inline-flex items-center justify-center rounded-2xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition-all duration-300 hover:bg-slate-800"
            >
              {ctaLabel}
            </a>

            <a
              href="/dashboard"
              className="inline-flex items-center justify-center rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition-all duration-300 hover:border-emerald-200 hover:text-emerald-700"
            >
              Ver visão geral
            </a>
          </div>
        </div>

        {/* Status visual lateral */}
        <div className="shrink-0">
          <StatusBadge status={status}>{statusText}</StatusBadge>
        </div>
      </div>
    </section>
  );
}