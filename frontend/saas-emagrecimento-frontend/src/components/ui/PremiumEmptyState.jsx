// Estado vazio premium para áreas sem dados.
// Deixa o sistema elegante mesmo quando o usuário ainda não gerou conteúdo suficiente.
export default function PremiumEmptyState({
  title = "Ainda não há dados suficientes",
  description = "Continue usando o Fitelligence para gerar mais análises, gráficos e recomendações inteligentes.",
}) {
  return (
    <div className="flex min-h-[240px] flex-col items-center justify-center rounded-[24px] border border-dashed border-slate-300 bg-gradient-to-b from-slate-50 to-white px-6 py-10 text-center">
      {/* Ícone visual abstrato */}
      <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-white shadow-sm ring-1 ring-slate-200">
        <div className="h-6 w-6 rounded-full bg-emerald-100" />
      </div>

      {/* Título do estado vazio */}
      <h4 className="mt-5 text-lg font-semibold tracking-tight text-slate-900">
        {title}
      </h4>

      {/* Descrição orientativa */}
      <p className="mt-2 max-w-md text-sm leading-7 text-slate-500">
        {description}
      </p>
    </div>
  );
}