"use client";

// ======================================================
// Página Premium do Fitelligence
// Responsável por:
// - apresentar o valor do plano premium
// - comparar Free vs Premium
// - reforçar percepção de produto premium
// - exibir CTAs de conversão
// - preparar navegação para checkout
// - destacar IA alimentar + IA corporal
// - manter visual mobile-first e sofisticado
// ======================================================

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  loadAndroidBillingCatalogService,
  startAndroidPurchaseAndValidateService,
} from "../../src/services/mobileBillingService";
import {
  Sparkles,
  Crown,
  Check,
  X,
  Brain,
  LineChart,
  Utensils,
  ShieldCheck,
  ArrowRight,
  Star,
  ChevronLeft,
} from "lucide-react";

// ======================================================
// Variantes simples de animação para entrada suave
// ======================================================
const fadeUp = {
  hidden: { opacity: 0, y: 18 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.45,
      ease: "easeOut",
    },
  },
};

const staggerContainer = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08,
    },
  },
};

// ======================================================
// Estrutura dos planos para o bloco de selecao.
// Mantem a base preparada para integracao de pagamento.
// ======================================================
const PLAN_OPTIONS = {
  monthly: {
    id: "monthly",
    title: "Plano mensal",
    price: "R$ 29,90",
    period: "/mês",
    description: "Comece agora com flexibilidade mensal",
    badge: "",
    helper: "",
    highlighted: false,
  },
  yearly: {
    id: "yearly",
    title: "Plano anual",
    price: "R$ 209,90",
    period: "/ano",
    description: "Melhor custo-benefício para evolução contínua",
    badge: "Mais escolhido",
    helper: "≈ R$ 17,49/mês · Economize ~50%",
    highlighted: true,
  },
};

export default function PremiumPage() {
  // ====================================================
  // Hook de navegação do Next.js
  // ====================================================
  const router = useRouter();

  // ====================================================
  // Estado de selecao de plano:
  // - default anual para favorecer conversao
  // - usado no CTA principal e no futuro checkout
  // ====================================================
  const [selectedPlan, setSelectedPlan] = useState("yearly");
  const [catalogLoading, setCatalogLoading] = useState(true);
  const [catalogError, setCatalogError] = useState("");
  const [catalogMode, setCatalogMode] = useState("unknown");
  const [catalogProductsByPlan, setCatalogProductsByPlan] = useState({});
  const [purchaseLoading, setPurchaseLoading] = useState(false);
  const [purchaseFeedback, setPurchaseFeedback] = useState("");

  useEffect(() => {
    let active = true;

    async function loadCatalog() {
      try {
        setCatalogLoading(true);
        setCatalogError("");

        // Busca catalogo real da Play Store quando estiver em Android nativo.
        const result = await loadAndroidBillingCatalogService();
        if (!active) return;

        setCatalogMode(result.mode || "unknown");
        setCatalogProductsByPlan(result.productsByPlan || {});
      } catch (error) {
        if (!active) return;
        console.error("[PREMIUM] erro ao carregar catalogo mobile:", error);
        setCatalogError("Nao foi possivel carregar os produtos da loja no momento.");
        setCatalogMode("catalog_error");
      } finally {
        if (active) {
          setCatalogLoading(false);
        }
      }
    }

    loadCatalog();
    return () => {
      active = false;
    };
  }, []);

  const selectedPlanData = useMemo(() => {
    const basePlan = PLAN_OPTIONS[selectedPlan] || PLAN_OPTIONS.yearly;
    const runtimePlan = catalogProductsByPlan?.[selectedPlan];

    if (!runtimePlan?.displayPrice) {
      return basePlan;
    }

    // Quando o catalogo nativo estiver disponivel, mostramos preco da loja.
    return {
      ...basePlan,
      price: runtimePlan.displayPrice,
      period: "",
      helper: "Preco oficial da Google Play",
    };
  }, [selectedPlan, catalogProductsByPlan]);

  // ====================================================
  // Lista comparativa dos recursos dos planos
  // ====================================================
  const comparativoPlanos = [
    {
      recurso: "Dashboard inteligente",
      free: true,
      premium: true,
    },
    {
      recurso: "Registro de progresso corporal",
      free: true,
      premium: true,
    },
    {
      recurso: "Análise básica de refeições",
      free: true,
      premium: true,
    },
    {
      recurso: "IA corporal avançada",
      free: false,
      premium: true,
    },
    {
      recurso: "Comparação visual corporal inteligente",
      free: false,
      premium: true,
    },
    {
      recurso: "Resumo alimentar inteligente completo",
      free: false,
      premium: true,
    },
    {
      recurso: "Timeline alimentar avançada",
      free: false,
      premium: true,
    },
    {
      recurso: "Notificações inteligentes avançadas",
      free: false,
      premium: true,
    },
    {
      recurso: "Score global com breakdown estratégico",
      free: false,
      premium: true,
    },
    {
      recurso: "Leituras premium com mais profundidade",
      free: false,
      premium: true,
    },
  ];

  // ====================================================
  // Benefícios centrais do premium
  // ====================================================
  const beneficiosPremium = [
    {
      icon: Brain,
      title: "IA mais estratégica",
      description:
        "Receba leituras mais profundas sobre alimentação, progresso e comportamento, com contexto muito mais útil para tomada de decisão.",
    },
    {
      icon: LineChart,
      title: "IA corporal avançada",
      description:
        "Desbloqueie análises mais inteligentes sobre evolução corporal, interpretação visual e leitura comparativa do progresso físico.",
    },
    {
      icon: Utensils,
      title: "Inteligência alimentar completa",
      description:
        "Desbloqueie resumo alimentar executivo, padrões predominantes, tendência nutricional e recomendações prioritárias.",
    },
    {
      icon: ShieldCheck,
      title: "Experiência premium contínua",
      description:
        "Tenha acesso a uma camada mais avançada do Fitelligence, unindo corpo, alimentação e consistência em uma experiência premium real.",
    },
  ];

  // ====================================================
  // Função de upgrade:
  // recebe o plano selecionado e prepara integração futura.
  // Nesta etapa, Android nativo usa compra real + validacao backend.
  // Web continua no checkout atual sem quebrar fluxo existente.
  // ====================================================
  async function handleUpgrade(planId) {
    const targetPlanId = planId || selectedPlan;
    if (purchaseLoading) return;

    try {
      setPurchaseLoading(true);
      setPurchaseFeedback("");

      const result = await startAndroidPurchaseAndValidateService({
        planId: targetPlanId,
        environment: process.env.NEXT_PUBLIC_BILLING_ENV,
      });

      if (result.mode === "fallback_web") {
        router.push("/checkout");
        return;
      }

      if (result.mode === "billing_unavailable") {
        setPurchaseFeedback(
          "A cobranca mobile nao esta disponivel neste dispositivo. Voce pode concluir pelo checkout web."
        );
        return;
      }

      if (result.status === "purchase_canceled") {
        setPurchaseFeedback("Compra cancelada. Quando quiser, voce pode tentar novamente.");
        return;
      }

      setPurchaseFeedback(
        "Compra recebida com sucesso. Estamos validando sua assinatura e liberando o Premium."
      );
    } catch (error) {
      console.error("[PREMIUM] erro ao iniciar compra:", error);
      setPurchaseFeedback(
        error?.message ||
          "Nao foi possivel concluir a compra agora. Tente novamente em instantes."
      );
    } finally {
      setPurchaseLoading(false);
    }

    // TODO: apos validacao definitiva, sincronizar estado premium em AuthContext.
  }

  // ====================================================
  // Função para voltar ao dashboard
  // ====================================================
  function handleGoToDashboard() {
    router.push("/dashboard");
  }

  return (
    <div className="min-h-screen bg-[#0F0F0F] text-white">
      <motion.div
        className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-10"
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
      >
        {/* ================================================== */}
        {/* TOPO DE NAVEGAÇÃO */}
        {/* ================================================== */}
        <motion.section variants={fadeUp}>
          <div className="flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={handleGoToDashboard}
              className="inline-flex items-center gap-2 rounded-2xl border border-[#2A2A2A] bg-[#1A1A1A] px-4 py-2.5 text-sm font-semibold text-white transition-all duration-300 hover:bg-[#2A2A2A] active:scale-[0.98]"
            >
              <ChevronLeft className="h-4 w-4" />
              Voltar ao dashboard
            </button>

            <div className="hidden rounded-full border border-violet-200 bg-violet-50 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.16em] text-violet-700 dark:border-violet-500/20 dark:bg-violet-500/10 dark:text-violet-300 sm:inline-flex">
              Fitelligence Premium
            </div>
          </div>
        </motion.section>

        {/* ================================================== */}
        {/* HERO PRINCIPAL */}
        {/* ================================================== */}
        <motion.section variants={fadeUp}>
          <div className="overflow-hidden rounded-[32px] border border-slate-200 bg-white/90 p-6 shadow-[0_20px_70px_-35px_rgba(15,23,42,0.35)] backdrop-blur-sm transition-colors duration-300 dark:border-slate-800 dark:bg-slate-900/80 sm:p-8 lg:p-10">
            <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full border border-violet-200 bg-violet-50 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-violet-700 dark:border-violet-500/20 dark:bg-violet-500/10 dark:text-violet-300">
                  <Sparkles className="h-4 w-4" />
                  Upgrade Premium
                </div>

                <h1 className="mt-5 text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-4xl lg:text-5xl">
                  Desbloqueie o{" "}
                  <span className="bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">
                    Fitelligence Premium
                  </span>
                </h1>

                <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-600 dark:text-slate-300 sm:text-base">
                  Tenha acesso completo à inteligência do seu corpo, da sua
                  alimentação e do seu comportamento. O Premium libera análises
                  mais profundas de evolução corporal, leitura alimentar e
                  tomada de decisão estratégica.
                </p>

                <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                  <button
                    type="button"
                    onClick={() => handleUpgrade(selectedPlan)}
                    disabled={purchaseLoading}
                    className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[#7C3AED] to-[#6D28D9] px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-violet-500/25 transition-all duration-300 hover:-translate-y-0.5 active:scale-[0.98] hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {purchaseLoading ? "Processando compra..." : "Desbloquear Premium"}
                    {!purchaseLoading ? <ArrowRight className="h-4 w-4" /> : null}
                  </button>

                  <button
                    type="button"
                    onClick={handleGoToDashboard}
                    className="inline-flex items-center justify-center rounded-2xl border border-[#2A2A2A] bg-[#1A1A1A] px-5 py-3 text-sm font-semibold text-white transition-all duration-300 hover:bg-[#2A2A2A] active:scale-[0.98]"
                  >
                    Continuar no plano Free
                  </button>
                </div>

                {/* ==================================================
                    Reforço de contexto e confiança para conversão.
                    Mantém clareza sem poluir o layout.
                   ================================================== */}
                <div className="mt-3 space-y-1">
                  <p className="text-xs font-medium text-slate-600 dark:text-slate-300">
                    Plano selecionado:{" "}
                    <span className="font-semibold text-violet-700 dark:text-violet-300">
                      {selectedPlanData.title} ({selectedPlanData.price}{" "}
                      {selectedPlanData.period})
                    </span>
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Acesso imediato após a confirmação.
                  </p>
                  {purchaseFeedback ? (
                    <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs font-medium text-emerald-700 dark:border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-300">
                      {purchaseFeedback}
                    </div>
                  ) : null}
                </div>

                <div className="mt-6 flex flex-wrap items-center gap-3 text-xs text-slate-500 dark:text-slate-400 sm:text-sm">
                  <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 dark:border-slate-800 dark:bg-slate-900">
                    <Star className="h-4 w-4 text-violet-500" />
                    Mais profundidade analítica
                  </div>

                  <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 dark:border-slate-800 dark:bg-slate-900">
                    <Crown className="h-4 w-4 text-amber-500" />
                    Camada premium do produto
                  </div>
                </div>
              </div>

              {/* ============================================== */}
              {/* CARD DE DESTAQUE PREMIUM */}
              {/* ============================================== */}
              <div className="rounded-[28px] border border-violet-200 bg-gradient-to-br from-violet-600 via-indigo-600 to-slate-900 p-6 text-white shadow-[0_20px_70px_-35px_rgba(79,70,229,0.65)] dark:border-violet-500/20 sm:p-7">
                <div className="flex items-center justify-between gap-3">
                  <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.16em] text-white/90">
                    <Crown className="h-4 w-4" />
                    Premium
                  </div>

                  <div className="rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-medium text-white/90">
                    Melhor experiência
                  </div>
                </div>

                <h2 className="mt-5 text-2xl font-bold">
                  Mais inteligência, mais clareza, mais resultado
                </h2>

                <p className="mt-3 text-sm leading-7 text-white/85">
                  O Premium libera a camada mais estratégica do Fitelligence,
                  com leituras mais avançadas sobre composição visual do
                  progresso, padrão alimentar, score global, evolução corporal e
                  consistência.
                </p>

                <div className="mt-6 grid gap-3">
                  <div className="rounded-2xl border border-white/10 bg-white/10 p-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.14em] text-white/70">
                      Ideal para
                    </p>
                    <p className="mt-2 text-sm text-white/90">
                      Usuários que querem uma leitura mais profunda da jornada e
                      profissionais que desejam uma experiência mais estratégica.
                    </p>
                  </div>

                  <div className="rounded-2xl border border-white/10 bg-white/10 p-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.14em] text-white/70">
                      Benefício central
                    </p>
                    <p className="mt-2 text-sm text-white/90">
                      Não é só ver mais dados. É entender melhor o que os dados
                      realmente querem dizer.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.section>

        {/* ================================================== */}
        {/* BENEFÍCIOS PREMIUM */}
        {/* ================================================== */}
        <motion.section variants={fadeUp}>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {beneficiosPremium.map((item) => {
              const Icon = item.icon;

              return (
                <div
                  key={item.title}
                  className="rounded-[28px] border border-slate-200 bg-white/90 p-5 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md dark:border-slate-800 dark:bg-slate-900/70"
                >
                  <div className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-violet-100 text-violet-700 dark:bg-violet-500/10 dark:text-violet-300">
                    <Icon className="h-5 w-5" />
                  </div>

                  <h3 className="mt-4 text-base font-semibold text-slate-900 dark:text-white">
                    {item.title}
                  </h3>

                  <p className="mt-2 text-sm leading-7 text-slate-600 dark:text-slate-400">
                    {item.description}
                  </p>
                </div>
              );
            })}
          </div>
        </motion.section>

        {/* ================================================== */}
        {/* BLOCO DE PLANOS (NOVO, INCREMENTAL) */}
        {/* - mensal vs anual */}
        {/* - anual destacado e selecionado por padrão */}
        {/* ================================================== */}
        <motion.section variants={fadeUp}>
          <div className="overflow-hidden rounded-[32px] border border-slate-200 bg-white/90 p-5 shadow-sm transition-colors duration-300 dark:border-slate-800 dark:bg-slate-900/70 sm:p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
              Escolha de plano
            </p>
            <h2 className="mt-2 text-2xl font-bold text-slate-900 dark:text-white">
              Selecione seu Premium
            </h2>
            <p className="mt-2 text-sm leading-7 text-slate-600 dark:text-slate-400">
              Opções claras para você decidir com rapidez.
            </p>

            <div className="mt-5 grid gap-3">
              {Object.values(PLAN_OPTIONS).map((plan) => {
                const isSelected = selectedPlan === plan.id;

                return (
                  <button
                    key={plan.id}
                    type="button"
                    onClick={() => setSelectedPlan(plan.id)}
                    className={`
                      w-full rounded-2xl border p-4 text-left transition active:scale-[0.98]
                      ${plan.highlighted ? "border-violet-300 bg-violet-50/60 dark:border-violet-500/30 dark:bg-violet-500/10" : "border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900"}
                      ${isSelected ? "ring-2 ring-violet-500/30" : "hover:border-slate-300 dark:hover:border-slate-600"}
                    `}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-sm font-semibold text-slate-900 dark:text-white">
                          {plan.title}
                        </p>
                        <p className="mt-1 text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                          {plan.price}
                          <span className="ml-1 text-sm font-medium text-slate-500 dark:text-slate-400">
                            {plan.period}
                          </span>
                        </p>
                        <p className="mt-1 text-xs leading-5 text-slate-600 dark:text-slate-400">
                          {plan.description}
                        </p>
                      </div>

                      {plan.badge ? (
                        <span className="inline-flex items-center gap-1 rounded-full border border-violet-200 bg-white px-2.5 py-1 text-[11px] font-semibold text-violet-700 dark:border-violet-500/30 dark:bg-slate-900 dark:text-violet-300">
                          <Crown className="h-3.5 w-3.5" />
                          {plan.badge}
                        </span>
                      ) : null}
                    </div>

                    {plan.helper ? (
                      <p className="mt-2 text-xs font-semibold text-emerald-700 dark:text-emerald-300">
                        {plan.helper}
                      </p>
                    ) : null}

                    {isSelected ? (
                      <p className="mt-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-violet-700 dark:text-violet-300">
                        Plano selecionado
                      </p>
                    ) : null}
                  </button>
                );
              })}
            </div>

          </div>
        </motion.section>

        {/* ================================================== */}
        {/* COMPARAÇÃO DE PLANOS */}
        {/* No mobile:
            - exibe cards por recurso
           No desktop:
            - exibe tabela comparativa em 3 colunas
        */}
        {/* ================================================== */}
        <motion.section variants={fadeUp}>
          <div className="overflow-hidden rounded-[32px] border border-slate-200 bg-white/90 shadow-[0_20px_70px_-35px_rgba(15,23,42,0.22)] transition-colors duration-300 dark:border-slate-800 dark:bg-slate-900/70">
            <div className="border-b border-slate-200 px-5 py-5 dark:border-slate-800 sm:px-6">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
                Comparativo
              </p>
              <h2 className="mt-2 text-2xl font-bold text-slate-900 dark:text-white">
                Free vs Premium
              </h2>
              <p className="mt-2 text-sm leading-7 text-slate-600 dark:text-slate-400">
                O plano free entrega a base. O Premium libera a camada mais
                valiosa da inteligência do produto.
              </p>
            </div>

            {/* ================================================= */}
            {/* MOBILE: cards por recurso */}
            {/* ================================================= */}
            <div className="grid gap-4 p-4 sm:p-5 lg:hidden">
              {comparativoPlanos.map((item) => (
                <div
                  key={item.recurso}
                  className="rounded-[24px] border border-slate-200 bg-slate-50/70 p-4 transition-colors duration-300 dark:border-slate-800 dark:bg-slate-950/40"
                >
                  <h3 className="text-sm font-semibold leading-6 text-slate-900 dark:text-white">
                    {item.recurso}
                  </h3>

                  <div className="mt-4 grid gap-3">
                    <div className="flex items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white px-3 py-3 dark:border-slate-800 dark:bg-slate-900">
                      <span className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500 dark:text-slate-400">
                        Free
                      </span>

                      {item.free ? (
                        <span className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300">
                          <Check className="h-4 w-4" />
                          Incluso
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-500 dark:bg-slate-800 dark:text-slate-400">
                          <X className="h-4 w-4" />
                          Limitado
                        </span>
                      )}
                    </div>

                    <div className="flex items-center justify-between gap-3 rounded-2xl border border-violet-200 bg-violet-50/60 px-3 py-3 dark:border-violet-500/20 dark:bg-violet-500/10">
                      <span className="text-xs font-semibold uppercase tracking-[0.14em] text-violet-700 dark:text-violet-300">
                        Premium
                      </span>

                      {item.premium ? (
                        <span className="inline-flex items-center gap-2 rounded-full bg-violet-100 px-3 py-1 text-xs font-medium text-violet-700 dark:bg-violet-500/15 dark:text-violet-300">
                          <Check className="h-4 w-4" />
                          Incluso
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-500 dark:bg-slate-800 dark:text-slate-400">
                          <X className="h-4 w-4" />
                          Não incluso
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* ================================================= */}
            {/* DESKTOP: tabela em colunas */}
            {/* ================================================= */}
            <div className="hidden lg:grid lg:grid-cols-[1fr_0.95fr_0.95fr]">
              <div className="border-r border-slate-200 px-5 py-5 dark:border-slate-800">
                <div className="mb-4 text-sm font-semibold text-slate-900 dark:text-white">
                  Recursos
                </div>

                <div className="space-y-4">
                  {comparativoPlanos.map((item) => (
                    <div
                      key={item.recurso}
                      className="min-h-[40px] text-sm text-slate-700 dark:text-slate-300"
                    >
                      {item.recurso}
                    </div>
                  ))}
                </div>
              </div>

              <div className="border-r border-slate-200 px-5 py-5 dark:border-slate-800">
                <div className="mb-4">
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                    Plano Free
                  </h3>
                  <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                    Base funcional do acompanhamento
                  </p>
                </div>

                <div className="space-y-4">
                  {comparativoPlanos.map((item) => (
                    <div
                      key={`free-${item.recurso}`}
                      className="flex min-h-[40px] items-center"
                    >
                      {item.free ? (
                        <span className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-sm font-medium text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300">
                          <Check className="h-4 w-4" />
                          Incluso
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1 text-sm font-medium text-slate-500 dark:bg-slate-800 dark:text-slate-400">
                          <X className="h-4 w-4" />
                          Limitado
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-gradient-to-b from-violet-50/70 to-indigo-50/50 px-5 py-5 dark:from-violet-500/10 dark:to-indigo-500/5">
                <div className="mb-4">
                  <div className="inline-flex items-center gap-2 rounded-full border border-violet-200 bg-white px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-violet-700 dark:border-violet-500/20 dark:bg-slate-900 dark:text-violet-300">
                    <Crown className="h-4 w-4" />
                    Mais recomendado
                  </div>

                  <h3 className="mt-3 text-lg font-semibold text-slate-900 dark:text-white">
                    Plano Premium
                  </h3>
                  <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
                    Experiência mais profunda e estratégica
                  </p>
                </div>

                <div className="space-y-4">
                  {comparativoPlanos.map((item) => (
                    <div
                      key={`premium-${item.recurso}`}
                      className="flex min-h-[40px] items-center"
                    >
                      {item.premium ? (
                        <span className="inline-flex items-center gap-2 rounded-full bg-violet-100 px-3 py-1 text-sm font-medium text-violet-700 dark:bg-violet-500/15 dark:text-violet-300">
                          <Check className="h-4 w-4" />
                          Incluso
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1 text-sm font-medium text-slate-500 dark:bg-slate-800 dark:text-slate-400">
                          <X className="h-4 w-4" />
                          Não incluso
                        </span>
                      )}
                    </div>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={() => handleUpgrade(selectedPlan)}
                  disabled={purchaseLoading}
                  className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[#7C3AED] to-[#6D28D9] px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-violet-500/25 transition-all duration-300 hover:-translate-y-0.5 active:scale-[0.98] hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {purchaseLoading ? "Processando compra..." : "Quero desbloquear o Premium"}
                  {!purchaseLoading ? <ArrowRight className="h-4 w-4" /> : null}
                </button>
              </div>
            </div>
          </div>
        </motion.section>

        {/* ================================================== */}
        {/* BLOCO FINAL DE CONVERSÃO */}
        {/* ================================================== */}
        <motion.section variants={fadeUp}>
          <div className="rounded-[32px] border border-slate-200 bg-slate-900 p-6 text-white shadow-[0_20px_70px_-35px_rgba(15,23,42,0.55)] dark:border-slate-800 sm:p-8">
            <div className="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-center">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-violet-300">
                  Próximo passo
                </p>

                <h2 className="mt-3 text-2xl font-bold sm:text-3xl">
                  Transforme o Fitelligence em uma experiência realmente premium
                </h2>

                <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-300 sm:text-base">
                  O plano premium foi pensado para entregar mais clareza, mais
                  retenção e mais valor percebido. Essa é a camada que prepara o
                  produto para monetização forte e expansão global.
                </p>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
                <button
                  type="button"
                  onClick={() => handleUpgrade(selectedPlan)}
                  disabled={purchaseLoading}
                  className="inline-flex items-center justify-center gap-2 rounded-2xl bg-white px-5 py-3 text-sm font-semibold text-slate-900 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg"
                >
                  {purchaseLoading ? "Processando compra..." : "Assinar agora"}
                  {!purchaseLoading ? <ArrowRight className="h-4 w-4" /> : null}
                </button>

                <button
                  type="button"
                  onClick={handleGoToDashboard}
                  className="inline-flex items-center justify-center rounded-2xl border border-white/15 bg-white/5 px-5 py-3 text-sm font-semibold text-white transition-all duration-300 hover:bg-white/10"
                >
                  Continuar no Free
                </button>
              </div>
            </div>
          </div>
        </motion.section>
      </motion.div>
    </div>
  );
}
