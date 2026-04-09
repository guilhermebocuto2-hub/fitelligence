"use client";

// Ícones para os CTAs secundários.
import { Sparkles, ArrowRight, Brain, LineChart } from "lucide-react";

// Seção complementar de CTA.
// Serve para reforçar navegação, percepção de valor e profundidade do produto.
export default function DashboardCTASection() {
  // Itens de CTA da seção.
  const items = [
    {
      id: "ia",
      title: "Explorar análises da IA",
      description:
        "Aprofunde a leitura automática do Fitelligence e acompanhe sua evolução estratégica.",
      href: "/dashboard",
      icon: Brain,
      badge: "Inteligência",
    },
    {
      id: "progresso",
      title: "Revisar sua evolução física",
      description:
        "Veja seu progresso corporal, consistência e histórico em uma visão mais detalhada.",
      href: "/progresso",
      icon: LineChart,
      badge: "Performance",
    },
    {
      id: "plano",
      title: "Atualizar seu plano alimentar",
      description:
        "Ajuste sua estratégia para manter aderência, melhorar score e evoluir com mais segurança.",
      href: "/plano",
      icon: Sparkles,
      badge: "Estratégia",
    },
  ];

  return (
    <section className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 hover:shadow-md">
      {/* Cabeçalho da seção */}
      <div>
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-emerald-600">
          Explorar mais
        </p>

        <h3 className="mt-2 text-xl font-semibold tracking-tight text-slate-900">
          Continue evoluindo dentro do produto
        </h3>

        <p className="mt-2 max-w-2xl text-sm leading-7 text-slate-500">
          Acesse áreas estratégicas do Fitelligence para aprofundar sua análise,
          revisar progresso e refinar sua jornada.
        </p>
      </div>

      {/* Grade de CTAs */}
      <div className="mt-5 grid grid-cols-1 gap-4 xl:grid-cols-3">
        {items.map((item) => {
          const Icon = item.icon;

          return (
            <a
              key={item.id}
              href={item.href}
              className="group rounded-2xl border border-slate-200 bg-slate-50 p-5 transition-all duration-300 hover:-translate-y-0.5 hover:border-emerald-200 hover:bg-white hover:shadow-sm"
            >
              {/* Linha superior com ícone e badge */}
              <div className="flex items-center justify-between gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white ring-1 ring-slate-200 transition-all duration-300 group-hover:ring-emerald-200">
                  <Icon className="h-5 w-5 text-slate-700" />
                </div>

                <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-semibold text-emerald-700">
                  {item.badge}
                </span>
              </div>

              {/* Título e descrição */}
              <h4 className="mt-4 text-base font-semibold tracking-tight text-slate-900">
                {item.title}
              </h4>

              <p className="mt-2 text-sm leading-7 text-slate-500">
                {item.description}
              </p>

              {/* CTA final */}
              <div className="mt-5 flex items-center gap-2 text-sm font-semibold text-emerald-700">
                <span>Acessar</span>
                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </div>
            </a>
          );
        })}
      </div>
    </section>
  );
}