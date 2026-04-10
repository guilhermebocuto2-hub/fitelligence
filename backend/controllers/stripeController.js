const getStripe = require("../services/stripeService");
const connection = require("../database/connection");

// ======================================================
// Controller do Stripe
// Responsável por:
// - criar sessão de checkout para assinatura premium
// - permitir plano mensal ou anual
// - criar sessão do portal do cliente
// - consultar sessão concluída
// ======================================================

// ======================================================
// Função auxiliar para recuperar o ID do usuário autenticado
// Compatível com diferentes padrões do authMiddleware
// ======================================================
function getUsuarioIdFromRequest(req) {
  return req.usuario?.id || req.user?.id || req.usuarioId || null;
}

// ======================================================
// Função auxiliar para escolher o Price ID do Stripe
// com base no ciclo de cobrança enviado pelo frontend
//
// billingCycle esperado:
// - "mensal"
// - "anual"
//
// Variáveis esperadas no .env:
// - STRIPE_PRICE_ID_MONTHLY
// - STRIPE_PRICE_ID_YEARLY
// ======================================================
function getStripePriceIdByBillingCycle(billingCycle) {
  if (billingCycle === "anual") {
    return process.env.STRIPE_PRICE_ID_YEARLY;
  }

  return process.env.STRIPE_PRICE_ID_MONTHLY;
}

// ======================================================
// Cria uma Checkout Session em modo subscription
// Aceita mensal ou anual via req.body.billingCycle
// ======================================================
exports.criarCheckoutSession = async (req, res) => {
  try {
    const stripe = getStripe();

    // ====================================================
    // Recupera usuário autenticado
    // ====================================================
    const usuarioId = getUsuarioIdFromRequest(req);

    if (!usuarioId) {
      return res.status(401).json({
        erro: "Usuário não autenticado",
      });
    }

    // ====================================================
    // Lê o ciclo de cobrança enviado pelo frontend
    // Se não vier nada, assume mensal por segurança
    // ====================================================
    const billingCycle = req.body?.billingCycle || "mensal";

    // ====================================================
    // Valida o valor recebido para evitar ciclos inválidos
    // ====================================================
    if (!["mensal", "anual"].includes(billingCycle)) {
      return res.status(400).json({
        erro: "billingCycle inválido. Use 'mensal' ou 'anual'.",
      });
    }

    // ====================================================
    // Seleciona o Price ID correto no Stripe
    // ====================================================
    const selectedPriceId = getStripePriceIdByBillingCycle(billingCycle);

    if (!selectedPriceId) {
      return res.status(500).json({
        erro: `Price ID do Stripe não configurado para o plano ${billingCycle}.`,
      });
    }

    // ====================================================
    // Busca dados do usuário no banco
    // Precisamos do email para vincular ao Stripe
    // ====================================================
    const [usuarios] = await connection.query(
      `
        SELECT
          id,
          nome,
          email,
          plano,
          stripe_customer_id
        FROM usuarios
        WHERE id = ?
        LIMIT 1
      `,
      [usuarioId]
    );

    if (!usuarios.length) {
      return res.status(404).json({
        erro: "Usuário não encontrado",
      });
    }

    const usuario = usuarios[0];

    // ====================================================
    // Reutiliza customer existente se já houver no banco
    // Se não houver, cria novo customer no Stripe
    // ====================================================
    let stripeCustomerId = usuario.stripe_customer_id || null;

    if (!stripeCustomerId) {
      const customer = await stripe.customers.create({
        name: usuario.nome || undefined,
        email: usuario.email || undefined,
        metadata: {
          usuario_id: String(usuario.id),
        },
      });

      stripeCustomerId = customer.id;

      // ==================================================
      // Salva o customer_id no banco para reutilização
      // ==================================================
      await connection.query(
        `
          UPDATE usuarios
          SET stripe_customer_id = ?
          WHERE id = ?
        `,
        [stripeCustomerId, usuario.id]
      );
    }

    // ====================================================
    // Cria a sessão de checkout em modo assinatura
    // ====================================================
    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      customer: stripeCustomerId,

      // ==================================================
      // Produto/preço escolhido com base no billingCycle
      // ==================================================
      line_items: [
        {
          price: selectedPriceId,
          quantity: 1,
        },
      ],

      // ==================================================
      // URLs de retorno do Stripe
      // ==================================================
      success_url: `${process.env.FRONTEND_URL}/checkout/sucesso?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.FRONTEND_URL}/premium`,

      // ==================================================
      // Referência do usuário para facilitar rastreamento
      // ==================================================
      client_reference_id: String(usuario.id),

      // ==================================================
      // Metadata útil para webhook e suporte futuro
      // ==================================================
      metadata: {
        usuario_id: String(usuario.id),
        billing_cycle: billingCycle,
      },
    });

    return res.status(200).json({
      mensagem: "Sessão de checkout criada com sucesso",
      billingCycle,
      priceId: selectedPriceId,
      url: session.url,
      sessionId: session.id,
    });
  } catch (error) {
    console.error("Erro ao criar checkout session:", error);

    return res.status(500).json({
      erro: "Erro interno ao criar sessão de checkout",
      detalhe: error.message,
    });
  }
};

// ======================================================
// Consulta uma sessão de checkout finalizada
// Útil para a página de sucesso mostrar status
// ======================================================
exports.buscarCheckoutSession = async (req, res) => {
  try {
    const stripe = getStripe();
    const { session_id } = req.query;

    if (!session_id) {
      return res.status(400).json({
        erro: "session_id não informado",
      });
    }

    const session = await stripe.checkout.sessions.retrieve(session_id);

    return res.status(200).json({
      mensagem: "Sessão encontrada com sucesso",
      session,
    });
  } catch (error) {
    console.error("Erro ao buscar checkout session:", error);

    return res.status(500).json({
      erro: "Erro interno ao buscar sessão do checkout",
      detalhe: error.message,
    });
  }
};

// ======================================================
// Cria sessão do portal do cliente do Stripe
// Serve para o usuário gerenciar cobrança/assinatura
// ======================================================
exports.criarPortalSession = async (req, res) => {
  try {
    const stripe = getStripe();
    const usuarioId = getUsuarioIdFromRequest(req);

    if (!usuarioId) {
      return res.status(401).json({
        erro: "Usuário não autenticado",
      });
    }

    const [usuarios] = await connection.query(
      `
        SELECT
          id,
          stripe_customer_id
        FROM usuarios
        WHERE id = ?
        LIMIT 1
      `,
      [usuarioId]
    );

    if (!usuarios.length) {
      return res.status(404).json({
        erro: "Usuário não encontrado",
      });
    }

    if (!usuarios[0].stripe_customer_id) {
      return res.status(400).json({
        erro: "Usuário ainda não possui customer vinculado ao Stripe",
      });
    }

    const portalSession = await stripe.billingPortal.sessions.create({
      customer: usuarios[0].stripe_customer_id,
      return_url: `${process.env.FRONTEND_URL}/dashboard`,
    });

    return res.status(200).json({
      mensagem: "Portal criado com sucesso",
      url: portalSession.url,
    });
  } catch (error) {
    console.error("Erro ao criar portal session:", error);

    return res.status(500).json({
      erro: "Erro interno ao criar portal do cliente",
      detalhe: error.message,
    });
  }
};
