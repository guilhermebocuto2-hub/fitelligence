"use client";

// ======================================================
// Página de Checkout do Fitelligence
// Responsável por:
// - confirmar assinatura premium
// - exibir resumo do plano
// - permitir escolha entre plano mensal e anual
// - preparar integração com Stripe
// - reforçar conversão
// - redirecionar o usuário para o checkout hospedado
// - destacar IA alimentar + IA corporal
// ======================================================

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Crown,
  Check,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  ChevronLeft,
  Brain,
  LineChart,
  Utensils,
  BadgePercent,
} from "lucide-react";

// ======================================================
// Animação padrão de entrada
// ======================================================
const fadeUp = {
  hidden: { opacity: 0, y: 18 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4 },
  },
};

export default function CheckoutPage() {
  const router = useRouter();

  // ====================================================
  // Estado de loading do botão principal
  // ====================================================
  const [loading, setLoading] = useState(false);

  // ====================================================
  // Estado do plano selecionado
  // Pode ser:
  // - mensal
  // - anual
  // ====================================================
  const [billingCycle, setBillingCycle] = useState("anual");

  // ====================================================
  // Benefícios principais do Premium exibidos no checkout
  // ====================================================
  const beneficiosPremium = [
    "IA alimentar completa",
    "IA corporal avançada",
    "Comparação visual corporal inteligente",
    "Resumo alimentar avançado",
    "Score global inteligente",
    "Insights estratégicos",
    "Timeline alimentar completa",
    "Notificações inteligentes avançadas",
  ];

  // ====================================================
  // Destaques visuais do valor do plano
  // ====================================================
  const highlights = [
    {
      icon: Brain,
      title: "Leitura mais inteligente",
      description:
        "O Premium aprofunda a interpretação do comportamento, da evolução e da consistência do usuário.",
    },
    {
      icon: LineChart,
      title: "IA corporal avançada",
      description:
        "Desbloqueie análises mais profundas sobre evolução corporal, progresso visual e leitura comparativa.",
    },
    {
      icon: Utensils,
      title: "IA alimentar completa",
      description:
        "Transforme registros de refeição em padrões, tendências e recomendações mais úteis para decisão.",
    },
  ];

  // ====================================================
  // Informações calculadas do plano selecionado
  // Esses valores visuais podem depois ser alinhados
  // com os valores reais configurados no Stripe
  // ====================================================
  const planoSelecionado = useMemo(() => {
    if (billingCycle === "anual") {
      return {
        id: "anual",
        nome: "Plano Anual",
        precoPrincipal: "R$ 209,90",
        precoSecundario: "/ano",
        descricao:
          "Melhor custo-benefício para quem quer evolução consistente ao longo do ano.",
        economiaLabel: "Economize no anual",
        destaque: true,
      };
    }

    return {
      id: "mensal",
      nome: "Plano Mensal",
      precoPrincipal: "R$ 29,90",
      precoSecundario: "/mês",
      descricao:
        "Ideal para começar agora e desbloquear a camada premium do Fitelligence.",
      economiaLabel: null,
      destaque: false,
    };
  }, [billingCycle]);

  // ====================================================
  // Cria a sessão de checkout real no Stripe
  // O backend retorna a URL do checkout hospedado
  // Também enviamos qual ciclo foi escolhido
  // ====================================================
  async function handleCheckout() {
    try {
      setLoading(true);

      const token = localStorage.getItem("token");

      if (!token) {
        throw new Error("Sessão expirada. Faça login novamente.");
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/stripe/create-checkout-session`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            billingCycle,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data?.erro || "Não foi possível iniciar o checkout no Stripe."
        );
      }

      // ==================================================
      // Redireciona o usuário para o checkout hospedado
      // do Stripe
      // ==================================================
      if (data?.url) {
        window.location.href = data.url;
        return;
      }

      throw new Error("URL do checkout não retornada pelo backend.");
    } catch (error) {
      console.error("Erro no checkout:", error);
      alert(error.message || "Erro ao iniciar checkout.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#0F0F0F]">
      <motion.div
        className="mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-10"
        initial="hidden"
        animate="visible"
        variants={fadeUp}
      >
        {/* ============================================ */}
        {/* TOPO DE NAVEGAÇÃO */}
        {/* ============================================ */}
        <div className="mb-6 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => router.push("/premium")}
            className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 dark:hover:border-slate-700"
          >
            <ChevronLeft className="h-4 w-4" />
            Voltar para Premium
          </button>

          <div className="hidden rounded-full border border-violet-200 bg-violet-50 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.16em] text-violet-700 dark:border-violet-500/20 dark:bg-violet-500/10 dark:text-violet-300 sm:inline-flex">
            Checkout Fitelligence
          </div>
        </div>

        {/* ============================================ */}
        {/* HEADER */}
        {/* ============================================ */}
        <div className="text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-violet-100 px-3 py-1 text-xs font-semibold text-violet-700 dark:bg-violet-500/10 dark:text-violet-300">
            <Sparkles className="h-4 w-4" />
            Checkout Premium
          </div>

          <h1 className="mt-4 text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
            Escolha seu plano premium
          </h1>

          <p className="mx-auto mt-2 max-w-2xl text-sm leading-7 text-slate-600 dark:text-slate-400 sm:text-base">
            Você está a um passo de desbloquear a camada premium do
            Fitelligence com inteligência alimentar, IA corporal e uma leitura
            estratégica muito mais profunda da jornada.
          </p>
        </div>

        {/* ============================================ */}
        {/* CONTEÚDO PRINCIPAL */}
        {/* ============================================ */}
        <div className="mt-8 grid gap-6 lg:grid-cols-[1.02fr_0.98fr]">
          {/* ========================================== */}
          {/* CARD PRINCIPAL DO PLANO */}
          {/* ========================================== */}
          <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-lg dark:border-slate-800 dark:bg-slate-900 sm:p-7">
            {/* TOPO DO PLANO */}
            <div className="flex items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                  Fitelligence Premium
                </h2>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Escolha entre cobrança mensal ou anual
                </p>
              </div>

              <div className="flex items-center gap-2 rounded-full bg-violet-50 px-3 py-1.5 text-violet-700 dark:bg-violet-500/10 dark:text-violet-300">
                <Crown className="h-5 w-5" />
                <span className="font-semibold">Premium</span>
              </div>
            </div>

            {/* ======================================== */}
            {/* SELETOR DE CICLO */}
            {/* ======================================== */}
            <div className="mt-6 grid gap-4">
              {/* MENSAL */}
              <button
                type="button"
                onClick={() => setBillingCycle("mensal")}
                className={`rounded-[24px] border p-4 text-left transition-all duration-300 ${
                  billingCycle === "mensal"
                    ? "border-violet-400 bg-violet-50 shadow-sm dark:border-violet-500 dark:bg-violet-500/10"
                    : "border-slate-200 bg-slate-50/70 hover:border-slate-300 dark:border-slate-800 dark:bg-slate-950/40 dark:hover:border-slate-700"
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-base font-semibold text-slate-900 dark:text-white">
                      Plano Mensal
                    </p>
                    <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
                      Flexível para começar agora
                    </p>
                  </div>

                  <div className="text-right">
                    <p className="text-xl font-bold text-slate-900 dark:text-white">
                      R$ 29,90
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      por mês
                    </p>
                  </div>
                </div>
              </button>

              {/* ANUAL */}
              <button
                type="button"
                onClick={() => setBillingCycle("anual")}
                className={`rounded-[24px] border p-4 text-left transition-all duration-300 ${
                  billingCycle === "anual"
                    ? "border-violet-400 bg-violet-50 shadow-sm dark:border-violet-500 dark:bg-violet-500/10"
                    : "border-slate-200 bg-slate-50/70 hover:border-slate-300 dark:border-slate-800 dark:bg-slate-950/40 dark:hover:border-slate-700"
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="inline-flex items-center gap-2 rounded-full bg-violet-100 px-3 py-1 text-xs font-semibold text-violet-700 dark:bg-violet-500/15 dark:text-violet-300">
                      <BadgePercent className="h-4 w-4" />
                      Mais vantajoso
                    </div>

                    <p className="mt-3 text-base font-semibold text-slate-900 dark:text-white">
                      Plano Anual
                    </p>
                    <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
                      Melhor custo-benefício para evolução contínua
                    </p>
                  </div>

                  <div className="text-right">
                    <p className="text-xl font-bold text-slate-900 dark:text-white">
                      R$ 209,90
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      por ano
                    </p>
                  </div>
                </div>
              </button>
            </div>

            {/* ======================================== */}
            {/* RESUMO DO PLANO SELECIONADO */}
            {/* ======================================== */}
            <div className="mt-6 rounded-3xl border border-violet-100 bg-violet-50/70 p-5 dark:border-violet-500/20 dark:bg-violet-500/10">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-slate-900 dark:text-white">
                    {planoSelecionado.nome}
                  </p>
                  <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                    {planoSelecionado.descricao}
                  </p>
                </div>

                {planoSelecionado.economiaLabel ? (
                  <div className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-violet-700 dark:bg-slate-900 dark:text-violet-300">
                    {planoSelecionado.economiaLabel}
                  </div>
                ) : null}
              </div>

              <div className="mt-4 flex items-end gap-2">
                <p className="text-4xl font-bold text-slate-900 dark:text-white">
                  {planoSelecionado.precoPrincipal}
                </p>
                <span className="pb-1 text-sm text-slate-500 dark:text-slate-400">
                  {planoSelecionado.precoSecundario}
                </span>
              </div>
            </div>

            {/* BENEFÍCIOS */}
            <div className="mt-6">
              <p className="text-sm font-semibold text-slate-900 dark:text-white">
                O que está incluído
              </p>

              <div className="mt-4 space-y-3">
                {beneficiosPremium.map((item) => (
                  <div key={item} className="flex items-center gap-3 text-sm">
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-50 dark:bg-emerald-500/10">
                      <Check className="h-4 w-4 text-emerald-500" />
                    </div>

                    <span className="text-slate-700 dark:text-slate-300">
                      {item}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* SEGURANÇA */}
            <div className="mt-6 flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-xs text-slate-500 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-400">
              <ShieldCheck className="h-4 w-4" />
              Pagamento seguro e protegido via Stripe
            </div>

            {/* BOTÃO */}
            <button
              type="button"
              onClick={handleCheckout}
              disabled={loading}
              className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-600 py-3.5 text-sm font-semibold text-white shadow-lg shadow-violet-500/20 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-70"
            >
              {loading
                ? "Redirecionando..."
                : `Confirmar ${billingCycle === "anual" ? "plano anual" : "plano mensal"}`}
              {!loading ? <ArrowRight className="h-4 w-4" /> : null}
            </button>
          </div>

          {/* ========================================== */}
          {/* COLUNA ESTRATÉGICA DE CONVERSÃO */}
          {/* ========================================== */}
          <div className="space-y-6">
            {/* RESUMO ESTRATÉGICO */}
            <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-7">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">
                Resumo da decisão
              </p>

              <h3 className="mt-3 text-xl font-bold text-slate-900 dark:text-white">
                Você está desbloqueando a camada mais valiosa do Fitelligence
              </h3>

              <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-400">
                O Premium não entrega só mais dados. Ele entrega leitura
                estratégica. Isso significa mais clareza sobre corpo,
                alimentação, consistência, progresso e prioridades de ação.
              </p>
            </div>

            {/* HIGHLIGHTS */}
            <div className="grid gap-4">
              {highlights.map((item) => {
                const Icon = item.icon;

                return (
                  <div
                    key={item.title}
                    className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md dark:border-slate-800 dark:bg-slate-900"
                  >
                    <div className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-violet-100 text-violet-700 dark:bg-violet-500/10 dark:text-violet-300">
                      <Icon className="h-5 w-5" />
                    </div>

                    <h4 className="mt-4 text-base font-semibold text-slate-900 dark:text-white">
                      {item.title}
                    </h4>

                    <p className="mt-2 text-sm leading-7 text-slate-600 dark:text-slate-400">
                      {item.description}
                    </p>
                  </div>
                );
              })}
            </div>

            {/* BLOCO FINAL */}
            <div className="rounded-[28px] border border-slate-200 bg-slate-900 p-6 text-white shadow-[0_20px_70px_-35px_rgba(15,23,42,0.55)] dark:border-slate-800 sm:p-7">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-violet-300">
                Próximo passo
              </p>

              <h3 className="mt-3 text-xl font-bold">
                Clique em confirmar e finalize no Stripe
              </h3>

              <p className="mt-3 text-sm leading-7 text-slate-300">
                Ao clicar no botão, você será redirecionado para o ambiente
                seguro do Stripe para concluir a assinatura premium escolhida.
              </p>

              <button
                type="button"
                onClick={() => router.push("/premium")}
                className="mt-5 inline-flex items-center justify-center rounded-2xl border border-white/15 bg-white/5 px-4 py-3 text-sm font-semibold text-white transition-all duration-300 hover:bg-white/10"
              >
                Revisar benefícios novamente
              </button>
            </div>
          </div>
        </div>

        {/* ============================================ */}
        {/* VOLTAR */}
        {/* ============================================ */}
        <button
          type="button"
          onClick={() => router.push("/premium")}
          className="mt-6 w-full text-sm text-slate-500 transition hover:underline dark:text-slate-400"
        >
          Voltar
        </button>
      </motion.div>
    </div>
  );
}