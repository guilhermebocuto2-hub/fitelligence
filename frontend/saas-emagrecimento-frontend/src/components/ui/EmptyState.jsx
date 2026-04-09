export default function EmptyState({
  title = "Nada para mostrar ainda",
  description = "Assim que houver dados disponíveis, esta área será preenchida automaticamente.",
  className = "",
}) {
  return (
    <div
      className={`flex min-h-[220px] flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-6 py-10 text-center ${className}`}
    >
      <div className="h-12 w-12 rounded-2xl bg-white shadow-sm ring-1 ring-slate-200" />

      <h4 className="mt-4 text-base font-semibold text-slate-900">{title}</h4>

      <p className="mt-2 max-w-md text-sm leading-6 text-slate-500">
        {description}
      </p>
    </div>
  );
}
