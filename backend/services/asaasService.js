"use strict";

// ======================================================
// Serviço de integração com a API do Asaas
// Responsável por:
// - Criar clientes no Asaas
// - Criar assinaturas (PIX, BOLETO, CREDIT_CARD)
// - Buscar dados de pagamento (QR Code PIX, link boleto)
//
// Variáveis de ambiente necessárias:
//   ASAAS_API_KEY  — chave de acesso da conta Asaas
//   ASAAS_BASE_URL — opcional; padrão: https://api.asaas.com/v3
//                    (sandbox: https://sandbox.asaas.com/api/v3)
// ======================================================

const ASAAS_BASE_URL =
  process.env.ASAAS_BASE_URL || "https://api.asaas.com/v3";

// ======================================================
// Headers padrão enviados em todas as requisições
// ======================================================
function getHeaders() {
  return {
    "Content-Type": "application/json",
    "User-Agent": "Fitelligence/1.0",
    "access-token": process.env.ASAAS_API_KEY || "",
  };
}

// ======================================================
// Wrapper genérico de fetch para a API do Asaas
// Lança erro com mensagem legível em caso de falha
// ======================================================
async function asaasRequest(method, path, body = null) {
  const url = `${ASAAS_BASE_URL}${path}`;

  const options = {
    method,
    headers: getHeaders(),
  };

  if (body) {
    options.body = JSON.stringify(body);
  }

  const res = await fetch(url, options);
  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    const mensagem =
      data?.errors?.[0]?.description ||
      data?.message ||
      `Erro Asaas ${res.status}`;
    const err = new Error(mensagem);
    err.status = res.status;
    err.asaasData = data;
    throw err;
  }

  return data;
}

// ======================================================
// Formata a data de hoje no padrão YYYY-MM-DD
// Usado como nextDueDate da primeira cobrança
// ======================================================
function hojeISO() {
  return new Date().toISOString().slice(0, 10);
}

// ======================================================
// Mapeia ciclo interno para o formato esperado pelo Asaas
// ======================================================
function mapCiclo(billingCycle) {
  if (billingCycle === "anual") return "YEARLY";
  return "MONTHLY";
}

// ======================================================
// Mapeia método de pagamento interno para o Asaas
// ======================================================
function mapBillingType(paymentMethod) {
  const map = {
    pix: "PIX",
    boleto: "BOLETO",
    cartao_nacional: "CREDIT_CARD",
  };
  return map[paymentMethod] || "PIX";
}

// ======================================================
// Retorna o valor em reais com base no ciclo
// ======================================================
function getValor(billingCycle) {
  if (billingCycle === "anual") return 209.9;
  return 29.9;
}

// ======================================================
// Cria ou recupera um cliente no Asaas
//
// Parâmetros:
//   nome     — nome do usuário
//   email    — e-mail do usuário
//   cpfCnpj  — CPF/CNPJ (opcional, mas recomendado)
//
// Retorna o objeto customer do Asaas (com .id)
// ======================================================
async function criarCliente({ nome, email, cpfCnpj }) {
  const body = {
    name: nome || "Cliente Fitelligence",
    email: email || undefined,
  };

  if (cpfCnpj) {
    // Remove formatação (pontos, traços, barras)
    body.cpfCnpj = cpfCnpj.replace(/\D/g, "");
  }

  return asaasRequest("POST", "/customers", body);
}

// ======================================================
// Cria uma assinatura no Asaas
//
// Parâmetros:
//   customerId    — ID do customer no Asaas (cus_xxx)
//   billingType   — "PIX" | "BOLETO" | "CREDIT_CARD"
//   billingCycle  — "mensal" | "anual"
//   usuarioId     — ID interno do usuário (salvo como externalReference)
//
// Retorna o objeto subscription do Asaas
// ======================================================
async function criarAssinatura({
  customerId,
  billingType,
  billingCycle,
  usuarioId,
}) {
  const body = {
    customer: customerId,
    billingType,
    value: getValor(billingCycle),
    nextDueDate: hojeISO(),
    cycle: mapCiclo(billingCycle),
    description: `Fitelligence Premium — ${billingCycle === "anual" ? "Anual" : "Mensal"}`,
    externalReference: String(usuarioId),
  };

  return asaasRequest("POST", "/subscriptions", body);
}

// ======================================================
// Busca os pagamentos de uma assinatura
// Retorna o primeiro pagamento (mais recente por criação)
// ======================================================
async function buscarPrimeiroPagamento(subscriptionId) {
  const data = await asaasRequest(
    "GET",
    `/subscriptions/${subscriptionId}/payments`
  );

  // A API retorna { data: [...payments] }
  const payments = data?.data || [];
  if (!payments.length) {
    throw new Error("Nenhum pagamento encontrado para esta assinatura.");
  }

  // Primeiro da lista é o mais próximo do vencimento
  return payments[0];
}

// ======================================================
// Busca o QR Code PIX de um pagamento
// Retorna { encodedImage, payload, expirationDate }
// ======================================================
async function buscarPixQrCode(paymentId) {
  return asaasRequest("GET", `/payments/${paymentId}/pixQrCode`);
}

// ======================================================
// Cria uma assinatura PIX e retorna os dados do QR Code
// ======================================================
async function criarAssinaturaComPix({ customerId, billingCycle, usuarioId }) {
  const assinatura = await criarAssinatura({
    customerId,
    billingType: "PIX",
    billingCycle,
    usuarioId,
  });

  const pagamento = await buscarPrimeiroPagamento(assinatura.id);
  const qrCode = await buscarPixQrCode(pagamento.id);

  return {
    subscriptionId: assinatura.id,
    paymentId: pagamento.id,
    pixQrCode: qrCode.payload || null,
    pixQrCodeImage: qrCode.encodedImage || null,
    expirationDate: qrCode.expirationDate || null,
    valor: getValor(billingCycle),
  };
}

// ======================================================
// Cria uma assinatura BOLETO e retorna o link do boleto
// ======================================================
async function criarAssinaturaComBoleto({
  customerId,
  billingCycle,
  usuarioId,
}) {
  const assinatura = await criarAssinatura({
    customerId,
    billingType: "BOLETO",
    billingCycle,
    usuarioId,
  });

  const pagamento = await buscarPrimeiroPagamento(assinatura.id);

  return {
    subscriptionId: assinatura.id,
    paymentId: pagamento.id,
    boletoUrl: pagamento.bankSlipUrl || null,
    boletoLinhaDigitavel: pagamento.identificationField || null,
    nossoNumero: pagamento.nossoNumero || null,
    dueDate: pagamento.dueDate || null,
    valor: getValor(billingCycle),
  };
}

// ======================================================
// Cria uma assinatura CREDIT_CARD via Asaas
// Retorna o link de pagamento hospedado
//
// Obs: Cartão nacional usa o hosted payment do Asaas.
// Cartão internacional continua via Stripe.
// ======================================================
async function criarAssinaturaComCartao({
  customerId,
  billingCycle,
  usuarioId,
}) {
  const assinatura = await criarAssinatura({
    customerId,
    billingType: "CREDIT_CARD",
    billingCycle,
    usuarioId,
  });

  const pagamento = await buscarPrimeiroPagamento(assinatura.id);

  // Link de pagamento do Asaas para o primeiro boleto/cobrança
  const invoiceUrl =
    pagamento.invoiceUrl ||
    pagamento.bankSlipUrl ||
    `https://www.asaas.com/i/${pagamento.id}`;

  return {
    subscriptionId: assinatura.id,
    paymentId: pagamento.id,
    paymentUrl: invoiceUrl,
    valor: getValor(billingCycle),
  };
}

// ======================================================
// Exports
// ======================================================
module.exports = {
  criarCliente,
  criarAssinatura,
  buscarPrimeiroPagamento,
  buscarPixQrCode,
  criarAssinaturaComPix,
  criarAssinaturaComBoleto,
  criarAssinaturaComCartao,
  getValor,
  mapBillingType,
  mapCiclo,
};
