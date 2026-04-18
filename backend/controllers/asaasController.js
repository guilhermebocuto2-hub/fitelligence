"use strict";

// ======================================================
// Controller do Asaas
// Responsável por:
// - Criar assinaturas via PIX, BOLETO e CREDIT_CARD nacional
// - Processar webhooks do Asaas para atualizar o plano
// ======================================================

const connection = require("../database/connection");
const asaasService = require("../services/asaasService");

// ======================================================
// Recupera o ID do usuário autenticado
// Compatível com os aliases do authMiddleware
// ======================================================
function getUsuarioId(req) {
  return req.usuario?.id || req.user?.id || req.usuarioId || null;
}

// ======================================================
// Garante que a coluna asaas_customer_id existe
// Executado de forma silenciosa — não quebra se já existir
// ======================================================
async function garantirColunaAsaasCustomerId() {
  try {
    await connection.query(
      `ALTER TABLE usuarios ADD COLUMN asaas_customer_id VARCHAR(255) NULL`
    );
  } catch {
    // Coluna já existe — ignorar erro
  }
}

// Executa na inicialização do módulo
garantirColunaAsaasCustomerId();

// ======================================================
// POST /asaas/create-subscription
//
// Body esperado:
//   billingCycle  — "mensal" | "anual"
//   paymentMethod — "pix" | "boleto" | "cartao_nacional"
//   cpfCnpj       — opcional (CPF/CNPJ sem formatação)
//
// Retorna dados específicos por método:
//   PIX    → pixQrCode, pixQrCodeImage, expirationDate
//   BOLETO → boletoUrl, boletoLinhaDigitavel, dueDate
//   CARTÃO → paymentUrl (redirect)
// ======================================================
exports.criarAssinatura = async (req, res) => {
  try {
    const usuarioId = getUsuarioId(req);

    if (!usuarioId) {
      return res.status(401).json({ success: false, message: "Não autenticado." });
    }

    const { billingCycle = "mensal", paymentMethod = "pix", cpfCnpj } = req.body || {};

    // Valida ciclo
    if (!["mensal", "anual"].includes(billingCycle)) {
      return res.status(400).json({
        success: false,
        message: "billingCycle inválido. Use 'mensal' ou 'anual'.",
      });
    }

    // Valida método
    if (!["pix", "boleto", "cartao_nacional"].includes(paymentMethod)) {
      return res.status(400).json({
        success: false,
        message: "paymentMethod inválido. Use 'pix', 'boleto' ou 'cartao_nacional'.",
      });
    }

    // Busca dados do usuário
    const [rows] = await connection.query(
      `SELECT id, nome, email, plano, asaas_customer_id FROM usuarios WHERE id = ? LIMIT 1`,
      [usuarioId]
    );

    if (!rows.length) {
      return res.status(404).json({ success: false, message: "Usuário não encontrado." });
    }

    const usuario = rows[0];

    // Reutiliza customer existente ou cria novo no Asaas
    let asaasCustomerId = usuario.asaas_customer_id || null;

    if (!asaasCustomerId) {
      const customer = await asaasService.criarCliente({
        nome: usuario.nome,
        email: usuario.email,
        cpfCnpj: cpfCnpj || null,
      });

      asaasCustomerId = customer.id;

      // Salva no banco para reutilização
      await connection.query(
        `UPDATE usuarios SET asaas_customer_id = ? WHERE id = ?`,
        [asaasCustomerId, usuarioId]
      ).catch(() => {}); // Silencia erro se coluna não existir ainda
    }

    // Cria assinatura de acordo com o método escolhido
    let resultado;

    if (paymentMethod === "pix") {
      resultado = await asaasService.criarAssinaturaComPix({
        customerId: asaasCustomerId,
        billingCycle,
        usuarioId,
      });

      return res.status(200).json({
        success: true,
        paymentMethod: "pix",
        billingCycle,
        ...resultado,
      });
    }

    if (paymentMethod === "boleto") {
      resultado = await asaasService.criarAssinaturaComBoleto({
        customerId: asaasCustomerId,
        billingCycle,
        usuarioId,
      });

      return res.status(200).json({
        success: true,
        paymentMethod: "boleto",
        billingCycle,
        ...resultado,
      });
    }

    if (paymentMethod === "cartao_nacional") {
      resultado = await asaasService.criarAssinaturaComCartao({
        customerId: asaasCustomerId,
        billingCycle,
        usuarioId,
      });

      return res.status(200).json({
        success: true,
        paymentMethod: "cartao_nacional",
        billingCycle,
        ...resultado,
      });
    }
  } catch (err) {
    console.error("[Asaas] Erro ao criar assinatura:", err.message, err.asaasData || "");

    return res.status(err.status || 500).json({
      success: false,
      message: err.message || "Erro interno ao criar assinatura Asaas.",
    });
  }
};

// ======================================================
// POST /asaas/webhook
//
// Recebe eventos do Asaas e atualiza o plano do usuário.
// Endpoint público (sem authMiddleware) — o Asaas não envia token.
//
// Eventos tratados:
//   PAYMENT_CONFIRMED / PAYMENT_RECEIVED → plano = 'premium'
//   PAYMENT_OVERDUE                       → plano = 'free'
//   PAYMENT_DELETED / SUBSCRIPTION_DELETED → plano = 'free'
//
// O campo externalReference guarda o usuarioId.
// Fallback: busca por asaas_customer_id se necessário.
// ======================================================
exports.webhook = async (req, res) => {
  try {
    const { event, payment, subscription } = req.body || {};

    // Sempre responde 200 para o Asaas não reenviar
    res.status(200).json({ received: true });

    if (!event) return;

    // Extrai referência do usuário
    const externalReference =
      payment?.externalReference ||
      subscription?.externalReference ||
      null;

    const asaasCustomerId =
      payment?.customer ||
      subscription?.customer ||
      null;

    let usuarioId = externalReference
      ? parseInt(externalReference, 10) || null
      : null;

    // Se não tiver externalReference, tenta buscar pelo customer ID
    if (!usuarioId && asaasCustomerId) {
      try {
        const [rows] = await connection.query(
          `SELECT id FROM usuarios WHERE asaas_customer_id = ? LIMIT 1`,
          [asaasCustomerId]
        );
        if (rows.length) usuarioId = rows[0].id;
      } catch {
        // Coluna pode não existir — ignora
      }
    }

    if (!usuarioId) {
      console.warn("[Asaas Webhook] Evento recebido sem usuário identificável:", event);
      return;
    }

    // Atualiza plano de acordo com o evento
    const eventosAtivacao = ["PAYMENT_CONFIRMED", "PAYMENT_RECEIVED"];
    const eventosCancelamento = [
      "PAYMENT_OVERDUE",
      "PAYMENT_DELETED",
      "SUBSCRIPTION_DELETED",
    ];

    if (eventosAtivacao.includes(event)) {
      await connection.query(
        `UPDATE usuarios SET plano = 'premium' WHERE id = ?`,
        [usuarioId]
      );
      console.log(`[Asaas Webhook] Usuário ${usuarioId} → plano premium (${event})`);
    } else if (eventosCancelamento.includes(event)) {
      await connection.query(
        `UPDATE usuarios SET plano = 'free' WHERE id = ?`,
        [usuarioId]
      );
      console.log(`[Asaas Webhook] Usuário ${usuarioId} → plano free (${event})`);
    } else {
      console.log(`[Asaas Webhook] Evento ignorado: ${event}`);
    }
  } catch (err) {
    console.error("[Asaas Webhook] Erro interno:", err.message);
    // Não retorna erro — 200 já foi enviado
  }
};
