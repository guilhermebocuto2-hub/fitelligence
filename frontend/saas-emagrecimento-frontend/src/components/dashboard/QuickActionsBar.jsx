"use client";

export default function QuickActionsBar({
  submitting = false,
  onAddWater = null,
  onQuickCheckin = null,
}) {
  return (
    <div className="grid gap-2 sm:grid-cols-2">
      <button
        type="button"
        disabled={submitting}
        onClick={onAddWater}
        className="rounded-2xl bg-sky-50 px-4 py-3 text-sm font-semibold text-sky-900 ring-1 ring-sky-200 transition hover:bg-sky-100 disabled:opacity-60"
      >
        +500ml agua
      </button>

      <button
        type="button"
        disabled={submitting}
        onClick={onQuickCheckin}
        className="rounded-2xl bg-violet-50 px-4 py-3 text-sm font-semibold text-violet-900 ring-1 ring-violet-200 transition hover:bg-violet-100 disabled:opacity-60"
      >
        Check-in rapido
      </button>
    </div>
  );
}
