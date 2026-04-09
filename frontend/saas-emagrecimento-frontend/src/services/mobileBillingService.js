import { api } from "../lib/api";

// ======================================================
// Camada de billing mobile (Android) para Google Play Billing.
// Responsavel por:
// - detectar runtime nativo Android com Capacitor
// - carregar produtos reais da Play Store
// - iniciar compra real
// - enviar purchaseToken/transactionId reais para o backend
// ======================================================

const PLAN_TO_PRODUCT_ID = {
  monthly: "fitelligence_premium_monthly",
  yearly: "fitelligence_premium_yearly",
};

const PRODUCT_ID_TO_PLAN = Object.fromEntries(
  Object.entries(PLAN_TO_PRODUCT_ID).map(([plan, productId]) => [productId, plan])
);

function normalizeEnvironment(value) {
  const raw = String(value || "").trim().toLowerCase();
  if (raw === "production" || raw === "sandbox") {
    return raw;
  }
  return process.env.NODE_ENV === "production" ? "production" : "sandbox";
}

async function loadCapacitorCore() {
  try {
    // Import dinamico para evitar acoplamento em runtime web.
    const mod = await import("@capacitor/core");
    return mod?.Capacitor || null;
  } catch {
    return null;
  }
}

async function getPurchasesPlugin() {
  const Capacitor = await loadCapacitorCore();

  // Evita depender apenas de window.Capacitor.
  // Usamos o runtime oficial quando o pacote estiver disponivel.
  if (!Capacitor || !Capacitor.isNativePlatform()) return null;
  if (Capacitor.getPlatform() !== "android") return null;

  // ====================================================
  // Resolucao segura em runtime sem import estatico.
  // Ordem de fallback:
  // 1) window.CdvPurchase
  // 2) window.cordova?.plugins?.purchase
  // 3) null
  // ====================================================
  if (typeof window === "undefined") return null;

  const runtimePurchasePlugin =
    window.CdvPurchase || window.cordova?.plugins?.purchase || null;

  // ====================================================
  // Importante:
  // Nao validamos contrato de API nesta funcao para evitar
  // bloquear providers validos em runtime.
  // A compatibilidade do provider deve ser validada na
  // camada de uso (catalogo/compra), com tratamento de erro.
  // ====================================================
  return runtimePurchasePlugin;
}

function isCanceledPurchaseError(error) {
  const text = String(error?.message || error?.code || "").toLowerCase();
  return text.includes("cancel") || text.includes("canceled") || text.includes("cancelled");
}

function normalizeCatalog(products = []) {
  const productsByPlan = {};

  Object.entries(PLAN_TO_PRODUCT_ID).forEach(([planId, productId]) => {
    const product = products.find((item) => item?.id === productId);
    productsByPlan[planId] = {
      planId,
      productId,
      displayPrice: product?.displayPrice || null,
      displayName: product?.displayName || null,
      description: product?.description || null,
      currencyCode: product?.currencyCode || null,
      price: typeof product?.price === "number" ? product.price : null,
    };
  });

  return productsByPlan;
}

export async function loadAndroidBillingCatalogService() {
  const Purchases = await getPurchasesPlugin();

  // Web/desktop continuam com fluxo atual.
  if (!Purchases) {
    return {
      mode: "fallback_web",
      productsByPlan: normalizeCatalog(),
    };
  }

  const availability = await Purchases.isAvailable();
  if (!availability?.isAvailable) {
    return {
      mode: "billing_unavailable",
      productsByPlan: normalizeCatalog(),
    };
  }

  const { products = [] } = await Purchases.getProductsByIds({
    productIds: Object.values(PLAN_TO_PRODUCT_ID),
    // API real do plugin: ProductCategory.Subscription => "SUBSCRIPTION".
    productCategory: "SUBSCRIPTION",
  });

  return {
    mode: "native_android",
    productsByPlan: normalizeCatalog(products),
  };
}

export async function startAndroidPurchaseAndValidateService({
  planId,
  environment,
}) {
  const productId = PLAN_TO_PRODUCT_ID[planId];

  if (!productId) {
    throw new Error("Plano invalido para compra mobile.");
  }

  const Purchases = await getPurchasesPlugin();
  if (!Purchases) {
    return {
      mode: "fallback_web",
      reason: "runtime_not_android",
    };
  }

  const availability = await Purchases.isAvailable();
  if (!availability?.isAvailable) {
    return {
      mode: "billing_unavailable",
      reason: "store_unavailable",
    };
  }

  try {
    // Compra real na Play Store.
    const { transaction } = await Purchases.purchaseProduct({ productId });

    if (!transaction?.id) {
      throw new Error("Transacao da Play Store nao retornou identificador.");
    }

    // Envia token real para backend (fonte de verdade do premium).
    const validation = await api.post("/billing/mobile/validate", {
      platform: "android",
      productId,
      purchaseToken: transaction?.token || null,
      transactionId: transaction?.id || null,
      environment: normalizeEnvironment(environment),
    });

    // Finaliza transacao no lado nativo apos envio ao backend.
    await Purchases.finishTransaction({
      transactionId: transaction.id,
    });

    return {
      mode: "native_android",
      status: "purchase_validated_pending",
      planId: PRODUCT_ID_TO_PLAN[productId] || planId,
      productId,
      transactionId: transaction.id,
      purchaseToken: transaction?.token || null,
      validation,
    };
  } catch (error) {
    if (isCanceledPurchaseError(error)) {
      return {
        mode: "native_android",
        status: "purchase_canceled",
      };
    }
    throw error;
  }
}
