"use client";

import {
  CalendarDays,
  Clock3,
  Flame,
  Beef,
  Wheat,
  Droplets,
  Sparkles,
  ChevronRight,
  Utensils,
} from "lucide-react";

// ======================================================
// Função para formatar a classificação da refeição
// em uma versão mais elegante para a interface.
// ======================================================
function formatClassification(classificacao) {
  if (!classificacao) return "Sem classificação";

  const valor = String(classificacao).toLowerCase();

  if (valor.includes("balanceada")) return "Balanceada";
  if (valor.includes("rica")) return "Rica em proteína";
  if (valor.includes("moderada")) return "Moderada";
  if (valor.includes("calórica") || valor.includes("calorica")) return "Calórica";
  if (valor.includes("boa")) return "Boa";
  if (valor.includes("ruim")) return "Ruim";

  return classificacao;
}

// ======================================================
// Função para montar badge visual por classificação.
// ======================================================
function getClassificationStyles(classificacao) {
  const valor = String(classificacao || "").toLowerCase();

  if (
    valor.includes("boa") ||
    valor.includes("balanceada") ||
    valor.includes("rica")
  ) {
    return {
      badge: "border-emerald-200 bg-emerald-50 text-emerald-700",
      dot: "bg-emerald-500",
    };
  }

  if (valor.includes("moderada")) {
    return {
      badge: "border-amber-200 bg-amber-50 text-amber-700",
      dot: "bg-amber-500",
    };
  }

  return {
    badge: "border-rose-200 bg-rose-50 text-rose-700",
    dot: "bg-rose-500",
  };
}

// ======================================================
// Função para formatar tipo da refeição.
// ======================================================
function formatMealType(tipo) {
  if (!tipo) return "Refeição";

  const valor = String(tipo).toLowerCase();

  if (valor.includes("cafe")) return "Café da manhã";
  if (valor.includes("almoco") || valor.includes("almoço")) return "Almoço";
  if (valor.includes("jantar")) return "Jantar";
  if (valor.includes("lanche")) return "Lanche";

  return "Refeição";
}

// ======================================================
// Função para formatar data/hora em pt-BR.
// ======================================================
function formatDateTime(dateValue) {
  if (!dateValue) {
    return {
      date: "Data indisponível",
      time: "--:--",
    };
  }

  const date = new Date(dateValue);

  return {
    date: date.toLocaleDateString("pt-BR"),
    time: date.toLocaleTimeString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
    }),
  };
}

// ======================================================
// Card individual da timeline alimentar.
// ======================================================
function FoodTimelineCard({ refeicao }) {
  const calorias = Number(refeicao?.calorias_estimadas || 0);
  const proteinas = Number(refeicao?.proteinas || 0);
  const carboidratos = Number(refeicao?.carboidratos || 0);
  const gorduras = Number(refeicao?.gorduras || 0);

  const classificationLabel = formatClassification(refeicao?.classificacao);
  const classificationStyles = getClassificationStyles(refeicao?.classificacao);
  const mealType = formatMealType(refeicao?.tipo_refeicao);
  const { date, time } = formatDateTime(refeicao?.criado_em);

  return (
    <article className="group relative rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm transition duration-300 hover:-translate-y-0.5 hover:shadow-lg sm:p-6">
      {/* Linha lateral visual */}
      <div className="absolute left-0 top-8 hidden h-[calc(100%-4rem)] w-px bg-slate-200 lg:block" />

      <div className="flex flex-col gap-4">
        {/* Header do card */}
        <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
          <div className="flex items-start gap-3">
            <div className="mt-1 flex flex-col items-center">
              <div className={`h-3.5 w-3.5 rounded-full ${classificationStyles.dot}`} />
            </div>

            <div>
              <div className="mb-2 flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                  <Utensils size={12} />
                  {mealType}
                </span>

                <span
                  className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold ${classificationStyles.badge}`}
                >
                  {classificationLabel}
                </span>
              </div>

              <h4 className="text-lg font-bold tracking-tight text-slate-900">
                {calorias} kcal estimadas
              </h4>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
                {refeicao?.descricao ||
                  "Leitura alimentar registrada com sucesso na timeline do usuário."}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 text-xs font-medium text-slate-500">
            <span className="inline-flex items-center gap-2 rounded-full bg-slate-50 px-3 py-1.5">
              <CalendarDays size={14} />
              {date}
            </span>

            <span className="inline-flex items-center gap-2 rounded-full bg-slate-50 px-3 py-1.5">
              <Clock3 size={14} />
              {time}
            </span>
          </div>
        </div>

        {/* Métricas */}
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
            <div className="mb-2 flex items-center gap-2 text-sm text-slate-500">
              <Flame size={15} />
              Calorias
            </div>
            <div className="text-xl font-bold text-slate-900">{calorias} kcal</div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
            <div className="mb-2 flex items-center gap-2 text-sm text-slate-500">
              <Beef size={15} />
              Proteínas
            </div>
            <div className="text-xl font-bold text-slate-900">{proteinas} g</div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
            <div className="mb-2 flex items-center gap-2 text-sm text-slate-500">
              <Wheat size={15} />
              Carboidratos
            </div>
            <div className="text-xl font-bold text-slate-900">{carboidratos} g</div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
            <div className="mb-2 flex items-center gap-2 text-sm text-slate-500">
              <Droplets size={15} />
              Gorduras
            </div>
            <div className="text-xl font-bold text-slate-900">{gorduras} g</div>
          </div>
        </div>

        {/* Observação */}
        {refeicao?.observacoes ? (
          <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3">
            <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-700">
              <ChevronRight size={15} />
              Observação da análise
            </div>

            <p className="text-sm leading-6 text-slate-500">
              {refeicao.observacoes}
            </p>
          </div>
        ) : null}
      </div>
    </article>
  );
}

// ======================================================
// Componente principal da timeline alimentar.
// ======================================================
export default function FoodTimelinePanel({ historico = [] }) {
  const possuiDados = Array.isArray(historico) && historico.length > 0;

  return (
    <section className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-[0_20px_80px_-35px_rgba(15,23,42,0.35)] sm:p-6 lg:rounded-[32px] lg:p-7">
      {/* Header */}
      <div className="mb-6 flex flex-col gap-4 lg:mb-7 xl:flex-row xl:items-start xl:justify-between">
        <div>
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500 sm:text-xs">
            <Sparkles size={14} />
            Timeline alimentar
          </div>

          <h3 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-[2rem]">
            Histórico inteligente das refeições
          </h3>

          <p className="mt-2 max-w-3xl text-sm leading-7 text-slate-500">
            Acompanhe a sequência das refeições analisadas pela IA e observe padrões de alimentação, constância e qualidade nutricional ao longo do tempo.
          </p>
        </div>

        <div className="inline-flex w-fit items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-semibold text-slate-700">
          <Utensils size={16} />
          {historico.length} refeições
        </div>
      </div>

      {/* Estado vazio */}
      {!possuiDados ? (
        <div className="rounded-[28px] border border-dashed border-slate-300 bg-slate-50 px-6 py-10 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-3xl bg-white shadow-sm">
            <Utensils size={24} className="text-slate-500" />
          </div>

          <h4 className="text-lg font-semibold text-slate-900">
            Nenhuma refeição no histórico ainda
          </h4>

          <p className="mx-auto mt-2 max-w-xl text-sm leading-7 text-slate-500">
            Assim que novas refeições forem analisadas, o Fitelligence mostrará aqui uma linha do tempo alimentar inteligente com classificação, macros e contexto nutricional.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {historico.map((refeicao) => (
            <FoodTimelineCard
              key={refeicao.id}
              refeicao={refeicao}
            />
          ))}
        </div>
      )}
    </section>
  );
}