const subscriptionModel = require("../../models/subscriptionModel");
const subscriptionEventModel = require("../../models/subscriptionEventModel");

const VALID_PLATFORMS = new Set(["ios", "android"]);
const VALID_ENVIRONMENTS = new Set(["production", "sandbox"]);

function createValidationError(message) {
  const error = new Error(message);
  error.statusCode = 400;
  return error;
}

function normalizeString(value) {
  if (value === null || value === undefined) return null;
  const str = String(value).trim();
  return str.length ? str : null;
}

function normalizePlatform(value) {
  const platform = normalizeString(value)?.toLowerCase();
  if (!platform || !VALID_PLATFORMS.has(platform)) {
    throw createValidationError("platform inválido. Use ios ou android.");
  }
  return platform;
}

function normalizeEnvironment(value) {
  const env = normalizeString(value)?.toLowerCase() || "production";
  if (!VALID_ENVIRONMENTS.has(env)) {
    throw createValidationError("environment inválido. Use production ou sandbox.");
  }
  return env;
}

function normalizeMobileValidationPayload(payload) {
  const platform = normalizePlatform(payload.platform);
  const productId = normalizeString(payload.productId);
  const purchaseToken = normalizeString(payload.purchaseToken);
  const transactionId = normalizeString(payload.transactionId);
  const environment = normalizeEnvironment(payload.environment);

  if (!productId) {
    throw createValidationError("productId é obrigatório.");
  }

  // Pelo menos um identificador externo deve existir.
  if (!purchaseToken && !transactionId) {
    throw createValidationError(
      "Informe purchaseToken ou transactionId para rastreabilidade."
    );
  }

  return {
    platform,
    productId,
    purchaseToken,
    transactionId,
    environment,
  };
}

function formatDateTime(value) {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return date.toISOString();
}

function normalizeBillingResponse(subscription) {
  // ====================================================
  // Contrato público do billing:
  // quando ativo => premium
  // quando ausente/inativo => free
  // ====================================================
  if (!subscription) {
    return {
      plan: "free",
      status: "inactive",
      isPremium: false,
      platform: null,
      productId: null,
      currentPeriodEnd: null,
    };
  }

  const status = subscription.status || "inactive";
  const isPremium =
    Boolean(subscription.is_premium) &&
    (status === "active" || status === "grace_period");

  return {
    plan: isPremium ? "premium" : "free",
    status,
    isPremium,
    platform: subscription.platform || null,
    productId: subscription.product_id || null,
    currentPeriodEnd: formatDateTime(subscription.current_period_end),
  };
}

async function obterResumoAssinaturaPorUsuario(userId) {
  const assinaturaAtiva =
    await subscriptionModel.buscarAssinaturaAtivaPorUsuario(userId);

  if (assinaturaAtiva) {
    return normalizeBillingResponse(assinaturaAtiva);
  }

  // ====================================================
  // Sem assinatura ativa:
  // se houver histórico, refletimos status mais recente;
  // senão, retornamos inactive padrão.
  // ====================================================
  const ultimaAssinatura =
    await subscriptionModel.buscarAssinaturaMaisRecentePorUsuario(userId);
  return normalizeBillingResponse(ultimaAssinatura);
}

async function registrarEventoValidacaoMobile({ userId, payload }) {
  const normalized = normalizeMobileValidationPayload(payload || {});

  // ====================================================
  // Nesta etapa não validamos com Apple/Google.
  // Apenas registramos o evento para processamento futuro.
  // ====================================================
  await subscriptionEventModel.registrarEvento({
    user_id: userId,
    platform: normalized.platform,
    event_type: "mobile_validation_received",
    external_id: normalized.transactionId || normalized.purchaseToken || null,
    payload_json: {
      ...normalized,
      status: "pending_validation",
      received_at: new Date().toISOString(),
    },
    processed_at: null,
  });

  return {
    mensagem: "Evento de validacao recebido com sucesso",
    status: "pending_validation",
  };
}

module.exports = {
  obterResumoAssinaturaPorUsuario,
  registrarEventoValidacaoMobile,
  normalizeMobileValidationPayload,
};
