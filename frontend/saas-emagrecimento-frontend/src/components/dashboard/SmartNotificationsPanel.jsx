"use client";

import {
  Bell,
  Sparkles,
  AlertTriangle,
  CheckCircle2,
  Info,
} from "lucide-react";

function getNotificationStyles(tipo) {
  if (tipo === "positivo") {
    return {
      wrapper:
        "border-emerald-200 bg-emerald-50 dark:border-emerald-500/20 dark:bg-emerald-500/10",
      icon: "text-emerald-600 dark:text-emerald-400",
      title: "text-emerald-900 dark:text-emerald-300",
      text: "text-emerald-700 dark:text-emerald-400",
      action:
        "text-emerald-800 dark:text-emerald-300",
      Icon: CheckCircle2,
    };
  }

  if (tipo === "alerta" || tipo === "atencao") {
    return {
      wrapper:
        "border-amber-200 bg-amber-50 dark:border-amber-500/20 dark:bg-amber-500/10",
      icon: "text-amber-600 dark:text-amber-400",
      title: "text-amber-900 dark:text-amber-300",
      text: "text-amber-700 dark:text-amber-400",
      action:
        "text-amber-800 dark:text-amber-300",
      Icon: AlertTriangle,
    };
  }

  return {
    wrapper:
      "border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-900/70",
    icon: "text-slate-600 dark:text-slate-300",
    title: "text-slate-900 dark:text-white",
    text: "text-slate-600 dark:text-slate-400",
    action: "text-slate-700 dark:text-slate-300",
    Icon: Info,
  };
}

export default function SmartNotificationsPanel({ notificacoes = [] }) {
  if (!notificacoes?.length) return null;

  return (
    <section className="rounded-[28px] border border-slate-200 bg-white p-4 shadow-[0_20px_60px_-35px_rgba(15,23,42,0.25)] transition-colors duration-300 sm:p-6 dark:border-slate-800 dark:bg-slate-950/70">
      <div className="space-y-4">
        <div className="space-y-2">
          <span className="inline-flex items-center gap-2 rounded-full border border-violet-200 bg-violet-50 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-violet-700 dark:border-violet-500/20 dark:bg-violet-500/10 dark:text-violet-300">
            <Sparkles size={12} />
            Notificações
          </span>

          <h3 className="text-base font-semibold text-slate-900 dark:text-white sm:text-xl">
            O que merece sua atenção agora
          </h3>

          <p className="text-sm leading-6 text-slate-600 dark:text-slate-400 sm:leading-7">
            Alertas e lembretes gerados com base no seu comportamento recente dentro do Fitelligence.
          </p>
        </div>

        <div className="space-y-3">
          {notificacoes.map((item) => {
            const styles = getNotificationStyles(item.tipo);
            const Icon = styles.Icon;

            return (
              <div
                key={item.id}
                className={`rounded-[22px] border p-4 transition-colors duration-300 ${styles.wrapper}`}
              >
                <div className="flex items-start gap-3">
                  <div className={`mt-0.5 shrink-0 ${styles.icon}`}>
                    <Icon size={18} />
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <Bell size={14} className={styles.icon} />

                      <p className={`text-sm font-semibold leading-5 ${styles.title}`}>
                        {item.titulo}
                      </p>
                    </div>

                    <p className={`mt-2 text-sm leading-6 ${styles.text}`}>
                      {item.mensagem}
                    </p>

                    {item.acao ? (
                      <button
                        type="button"
                        className={`mt-3 text-xs font-semibold uppercase tracking-[0.12em] ${styles.action}`}
                      >
                        {item.acao}
                      </button>
                    ) : null}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}