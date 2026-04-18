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
  QrCode,
  FileText,
  CreditCard,
  Globe,
  Copy,
  ExternalLink,
  X,
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
  // Estado do plano selecionado: mensal | anual
  // ====================================================
  const [billingCycle, setBillingCycle] = useState("anual");

  // ====================================================
  // Método de pagamento:
  //   pix              — QR Code Pix via Asaas
  //   boleto           — Boleto bancário via Asaas
  //   cartao_nacional  — Cartão nacional via Asaas
  //   cartao_internacional — Cartão internacional via Stripe
  // ====================================================
  const [paymentMethod, setPaymentMethod] = useState("pix");

  // ====================================================
  // Dados retornados após criar assinatura Asaas
  // ====================================================
  const [pixData, setPixData] = useState(null);    // { pixQrCode, pixQrCodeImage }
  const [boletoData, setBoletoData] = useState(null); // { boletoUrl, boletoLinhaDigitavel }
  const [copiado, setCopiado] = useState(false);

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
  // Copia texto para a área de transferência
  // ====================================================
  async function copiarTexto(texto) {
    try {
      await navigator.clipboard.writeText(texto);
      setCopiado(true);
      setTimeout(() => setCopiado(false), 2500);
    } catch {
      // fallback silencioso
    }
  }

  // ====================================================
  // Checkout via Stripe (cartão internacional)
  // ====================================================
  async function handleStripeCheckout() {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("Sessão expirada. Faça login novamente.");

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/stripe/create-checkout-session`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ billingCycle }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data?.erro || "Não foi possível iniciar o checkout no Stripe.");
    }

    if (data?.url) {
      window.location.href = data.url;
      return;
    }

    throw new Error("URL do checkout não retornada pelo backend.");
  }

  // ====================================================
  // Checkout via Asaas (PIX, boleto, cartão nacional)
  // ====================================================
  async function handleAsaasCheckout() {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("Sessão expirada. Faça login novamente.");

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/asaas/create-subscription`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ billingCycle, paymentMethod }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data?.message || "Não foi possível criar a assinatura.");
    }

    if (paymentMethod === "pix") {
      setPixData({
        pixQrCode: data.pixQrCode,
        pixQrCodeImage: data.pixQrCodeImage,
        expirationDate: data.expirationDate,
        valor: data.valor,
      });
      return;
    }

    if (paymentMethod === "boleto") {
      setBoletoData({
        boletoUrl: data.boletoUrl,
        boletoLinhaDigitavel: data.boletoLinhaDigitavel,
        dueDate: data.dueDate,
        valor: data.valor,
      });
      return;
    }

    if (paymentMethod === "cartao_nacional" && data.paymentUrl) {
      window.location.href = data.paymentUrl;
      return;
    }

    throw new Error("Resposta inesperada do servidor.");
  }

  // ====================================================
  // Handler principal — despacha para o gateway certo
  // ====================================================
  async function handleCheckout() {
    try {
      setLoading(true);
      setPixData(null);
      setBoletoData(null);

      if (paymentMethod === "cartao_internacional") {
        await handleStripeCheckout();
      } else {
        await handleAsaasCheckout();
      }
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
            className="inline-flex items-center gap-2 rounded-2xl border border-[#2A2A2A] bg-[#1A1A1A] px-4 py-2.5 text-sm font-semibold text-white transition-all duration-300 hover:bg-[#2A2A2A] active:scale-[0.98]"
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
            {/* SELETOR DE MÉTODO DE PAGAMENTO */}
            {/* ======================================== */}
            <div className="mt-6">
              <p className="mb-3 text-sm font-semibold text-slate-900 dark:text-white">
                Forma de pagamento
              </p>

              <div className="grid grid-cols-2 gap-3">
                {[
                  { id: "pix", label: "Pix", icon: QrCode, desc: "Aprovação imediata" },
                  { id: "boleto", label: "Boleto", icon: FileText, desc: "Vencimento hoje" },
                  { id: "cartao_nacional", label: "Cartão Nacional", icon: CreditCard, desc: "Via Asaas" },
                  { id: "cartao_internacional", label: "Cartão Internacional", icon: Globe, desc: "Via Stripe" },
                ].map(({ id, label, icon: Icon, desc }) => (
                  <button
                    key={id}
                    type="button"
                    onClick={() => { setPaymentMethod(id); setPixData(null); setBoletoData(null); }}
                    className={`rounded-2xl border p-3 text-left transition-all duration-200 ${
                      paymentMethod === id
                        ? "border-violet-400 bg-violet-50 dark:border-violet-500 dark:bg-violet-500/10"
                        : "border-slate-200 bg-slate-50/70 hover:border-slate-300 dark:border-slate-800 dark:bg-slate-950/40 dark:hover:border-slate-700"
                    }`}
                  >
                    <Icon className={`mb-1.5 h-4 w-4 ${paymentMethod === id ? "text-violet-600 dark:text-violet-400" : "text-slate-400"}`} />
                    <p className="text-xs font-semibold text-slate-900 dark:text-white">{label}</p>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400">{desc}</p>
                  </button>
                ))}
              </div>
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
              {paymentMethod === "cartao_internacional"
                ? "Pagamento seguro e protegido via Stripe"
                : "Pagamento seguro e protegido via Asaas"}
            </div>

            {/* BOTÃO */}
            {!pixData && !boletoData ? (
              <button
                type="button"
                onClick={handleCheckout}
                disabled={loading}
                className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[#7C3AED] to-[#6D28D9] py-3.5 text-sm font-semibold text-white shadow-lg shadow-violet-500/25 transition-all duration-300 hover:-translate-y-0.5 active:scale-[0.98] hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-70"
              >
                {loading
                  ? "Processando..."
                  : `Confirmar ${billingCycle === "anual" ? "plano anual" : "plano mensal"}`}
                {!loading ? <ArrowRight className="h-4 w-4" /> : null}
              </button>
            ) : null}

            {/* ======================================== */}
            {/* RESULTADO PIX */}
            {/* ======================================== */}
            {pixData ? (
              <div className="mt-6 rounded-3xl border border-emerald-200 bg-emerald-50 p-5 dark:border-emerald-500/20 dark:bg-emerald-500/10">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold text-slate-900 dark:text-white">
                    QR Code Pix gerado
                  </p>
                  <button
                    type="button"
                    onClick={() => setPixData(null)}
                    className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>

                {pixData.pixQrCodeImage ? (
                  <div className="mt-4 flex justify-center">
                    <img
                      src={`data:image/png;base64,${pixData.pixQrCodeImage}`}
                      alt="QR Code Pix"
                      className="h-48 w-48 rounded-2xl border border-slate-200 bg-white p-2 dark:border-slate-700 dark:bg-slate-900"
                    />
                  </div>
                ) : null}

                {pixData.pixQrCode ? (
                  <div className="mt-4">
                    <p className="mb-2 text-xs text-slate-500 dark:text-slate-400">
                      Ou copie o código Pix Copia e Cola:
                    </p>
                    <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 dark:border-slate-700 dark:bg-slate-900">
                      <p className="flex-1 truncate text-xs font-mono text-slate-700 dark:text-slate-300">
                        {pixData.pixQrCode}
                      </p>
                      <button
                        type="button"
                        onClick={() => copiarTexto(pixData.pixQrCode)}
                        className="flex-shrink-0 rounded-lg bg-violet-100 px-2 py-1 text-xs font-semibold text-violet-700 transition hover:bg-violet-200 dark:bg-violet-500/10 dark:text-violet-300"
                      >
                        {copiado ? "Copiado!" : <Copy className="h-3.5 w-3.5" />}
                      </button>
                    </div>
                  </div>
                ) : null}

                <p className="mt-3 text-center text-xs text-slate-500 dark:text-slate-400">
                  Após o pagamento seu plano será ativado automaticamente
                </p>
              </div>
            ) : null}

            {/* ======================================== */}
            {/* RESULTADO BOLETO */}
            {/* ======================================== */}
            {boletoData ? (
              <div className="mt-6 rounded-3xl border border-blue-200 bg-blue-50 p-5 dark:border-blue-500/20 dark:bg-blue-500/10">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold text-slate-900 dark:text-white">
                    Boleto gerado com sucesso
                  </p>
                  <button
                    type="button"
                    onClick={() => setBoletoData(null)}
                    className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>

                {boletoData.boletoLinhaDigitavel ? (
                  <div className="mt-4">
                    <p className="mb-2 text-xs text-slate-500 dark:text-slate-400">
                      Linha digitável:
                    </p>
                    <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 dark:border-slate-700 dark:bg-slate-900">
                      <p className="flex-1 truncate text-xs font-mono text-slate-700 dark:text-slate-300">
                        {boletoData.boletoLinhaDigitavel}
                      </p>
                      <button
                        type="button"
                        onClick={() => copiarTexto(boletoData.boletoLinhaDigitavel)}
                        className="flex-shrink-0 rounded-lg bg-violet-100 px-2 py-1 text-xs font-semibold text-violet-700 transition hover:bg-violet-200 dark:bg-violet-500/10 dark:text-violet-300"
                      >
                        {copiado ? "Copiado!" : <Copy className="h-3.5 w-3.5" />}
                      </button>
                    </div>
                  </div>
                ) : null}

                {boletoData.boletoUrl ? (
                  <a
                    href={boletoData.boletoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[#7C3AED] to-[#6D28D9] py-3 text-sm font-semibold text-white shadow-sm active:scale-[0.98]"
                  >
                    <ExternalLink className="h-4 w-4" />
                    Abrir boleto
                  </a>
                ) : null}

                <p className="mt-3 text-center text-xs text-slate-500 dark:text-slate-400">
                  Após a compensação do boleto seu plano será ativado (até 3 dias úteis)
                </p>
              </div>
            ) : null}
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
                Escolha o pagamento e confirme
              </h3>

              <p className="mt-3 text-sm leading-7 text-slate-300">
                Pix e boleto são processados pelo Asaas. Cartão internacional
                é processado pelo Stripe. Após a confirmação do pagamento,
                seu plano Premium é ativado automaticamente.
              </p>

              <button
                type="button"
                onClick={() => router.push("/premium")}
                className="mt-5 inline-flex items-center justify-center rounded-2xl border border-white/15 bg-white/5 px-4 py-3 text-sm font-semibold text-white transition-all duration-300 hover:bg-white/10 active:scale-[0.98]"
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
          className="mt-6 w-full rounded-2xl border border-[#2A2A2A] bg-[#1A1A1A] py-3 text-sm font-semibold text-white transition hover:bg-[#2A2A2A] active:scale-[0.98]"
        >
          Voltar
        </button>
      </motion.div>
    </div>
  );
}