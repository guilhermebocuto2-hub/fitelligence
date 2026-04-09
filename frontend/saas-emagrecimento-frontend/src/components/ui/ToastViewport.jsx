"use client";

// ======================================================
// Área visual global dos toasts
// Responsável por:
// - renderizar toasts ativos
// - mostrar estilo premium por tipo
// - permitir fechar manualmente
// ======================================================

import { AnimatePresence, motion } from "framer-motion";
import {
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Info,
  X,
} from "lucide-react";
import { useToast } from "../../context/ToastContext";

export default function ToastViewport() {
  const { toasts, removeToast } = useToast();

  // ====================================================
  // Estilos visuais por tipo de toast
  // ====================================================
  const toastStyles = {
    success: {
      wrapper: "border-emerald-200 bg-white",
      iconBg: "bg-emerald-50 text-emerald-600",
      icon: CheckCircle2,
    },
    error: {
      wrapper: "border-rose-200 bg-white",
      iconBg: "bg-rose-50 text-rose-600",
      icon: XCircle,
    },
    warning: {
      wrapper: "border-amber-200 bg-white",
      iconBg: "bg-amber-50 text-amber-600",
      icon: AlertTriangle,
    },
    info: {
      wrapper: "border-sky-200 bg-white",
      iconBg: "bg-sky-50 text-sky-600",
      icon: Info,
    },
  };

  return (
    <div className="pointer-events-none fixed right-5 top-5 z-[100] flex w-full max-w-sm flex-col gap-3">
      <AnimatePresence>
        {toasts.map((toast) => {
          const style = toastStyles[toast.type] || toastStyles.info;
          const Icon = style.icon;

          return (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: -18, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -12, scale: 0.96 }}
              transition={{ duration: 0.22, ease: "easeOut" }}
              className={`pointer-events-auto overflow-hidden rounded-[24px] border p-4 shadow-[0_20px_60px_rgba(15,23,42,0.12)] backdrop-blur ${style.wrapper}`}
            >
              <div className="flex items-start gap-3">
                <div
                  className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl ${style.iconBg}`}
                >
                  <Icon className="h-5 w-5" />
                </div>

                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-slate-900">
                    {toast.title}
                  </p>

                  {toast.description ? (
                    <p className="mt-1 text-sm leading-6 text-slate-500">
                      {toast.description}
                    </p>
                  ) : null}
                </div>

                <button
                  type="button"
                  onClick={() => removeToast(toast.id)}
                  className="rounded-xl p-1 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}