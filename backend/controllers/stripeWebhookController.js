const getStripe = require("../services/stripeService");
const connection = require("../database/connection");

// ======================================================
// Webhook do Stripe
// Responsável por:
// - validar a assinatura do webhook
// - atualizar o plano do usuário conforme eventos
// - registrar customer, subscription e billing cycle
// - fazer downgrade para free quando necessário
// ======================================================
exports.handleStripeWebhook = async (req, res) => {
  let event;

  try {
    const stripe = getStripe();

    // ====================================================
    // O Stripe exige o body bruto (raw body) para validar
    // corretamente a assinatura do webhook
    // ====================================================
    const signature = req.headers["stripe-signature"];

    event = stripe.webhooks.constructEvent(
      req.body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (error) {
    console.error("Assinatura do webhook inválida:", error.message);

    return res.status(400).send(`Webhook Error: ${error.message}`);
  }

  try {
    // ====================================================
    // EVENTO 1
    // Checkout finalizado com sucesso
    //
    // Aqui normalmente já recebemos:
    // - customer
    // - subscription
    // - metadata.usuario_id
    // - metadata.billing_cycle
    // ====================================================
    if (event.type === "checkout.session.completed") {
      const session = event.data.object;

      const stripeCustomerId = session.customer || null;
      const stripeSubscriptionId = session.subscription || null;
      const usuarioId =
        session.metadata?.usuario_id || session.client_reference_id || null;
      const billingCycle = session.metadata?.billing_cycle || null;

      if (usuarioId) {
        await connection.query(
          `
            UPDATE usuarios
            SET
              plano = 'premium',
              stripe_customer_id = ?,
              stripe_subscription_id = ?,
              stripe_billing_cycle = ?
            WHERE id = ?
          `,
          [stripeCustomerId, stripeSubscriptionId, billingCycle, usuarioId]
        );
      }
    }

    // ====================================================
    // EVENTO 2
    // Assinatura criada
    //
    // Em alguns fluxos, pode ser útil reforçar o vínculo
    // da subscription com o usuário após a criação
    // ====================================================
    if (event.type === "customer.subscription.created") {
      const subscription = event.data.object;

      const stripeSubscriptionId = subscription.id;
      const stripeCustomerId = subscription.customer;

      // ==================================================
      // Tentamos localizar o usuário pelo customer_id
      // ==================================================
      const [usuarios] = await connection.query(
        `
          SELECT id
          FROM usuarios
          WHERE stripe_customer_id = ?
          LIMIT 1
        `,
        [stripeCustomerId]
      );

      if (usuarios.length > 0) {
        // ================================================
        // Descobre o intervalo da assinatura
        // interval pode vir como:
        // - month
        // - year
        // ================================================
        const interval =
          subscription.items?.data?.[0]?.price?.recurring?.interval || null;

        const billingCycle =
          interval === "year"
            ? "anual"
            : interval === "month"
            ? "mensal"
            : null;

        await connection.query(
          `
            UPDATE usuarios
            SET
              plano = 'premium',
              stripe_subscription_id = ?,
              stripe_billing_cycle = ?
            WHERE id = ?
          `,
          [stripeSubscriptionId, billingCycle, usuarios[0].id]
        );
      }
    }

    // ====================================================
    // EVENTO 3
    // Assinatura atualizada
    //
    // Aqui tratamos:
    // - active
    // - trialing
    // - canceled
    // - unpaid
    // - incomplete_expired
    // ====================================================
    if (event.type === "customer.subscription.updated") {
      const subscription = event.data.object;

      const stripeSubscriptionId = subscription.id;
      const status = subscription.status;

      // ==================================================
      // Descobre o ciclo da assinatura
      // ==================================================
      const interval =
        subscription.items?.data?.[0]?.price?.recurring?.interval || null;

      const billingCycle =
        interval === "year"
          ? "anual"
          : interval === "month"
          ? "mensal"
          : null;

      // ==================================================
      // Se a assinatura estiver ativa ou em trial,
      // mantém premium
      // ==================================================
      if (status === "active" || status === "trialing") {
        await connection.query(
          `
            UPDATE usuarios
            SET
              plano = 'premium',
              stripe_billing_cycle = ?
            WHERE stripe_subscription_id = ?
          `,
          [billingCycle, stripeSubscriptionId]
        );
      }

      // ==================================================
      // Se a assinatura estiver cancelada ou inválida,
      // volta o usuário para free
      // ==================================================
      if (
        status === "canceled" ||
        status === "unpaid" ||
        status === "incomplete_expired"
      ) {
        await connection.query(
          `
            UPDATE usuarios
            SET
              plano = 'free',
              stripe_billing_cycle = NULL
            WHERE stripe_subscription_id = ?
          `,
          [stripeSubscriptionId]
        );
      }
    }

    // ====================================================
    // EVENTO 4
    // Assinatura deletada
    //
    // Quando o Stripe marca a subscription como encerrada,
    // voltamos o usuário para free
    // ====================================================
    if (event.type === "customer.subscription.deleted") {
      const subscription = event.data.object;

      await connection.query(
        `
          UPDATE usuarios
          SET
            plano = 'free',
            stripe_billing_cycle = NULL
          WHERE stripe_subscription_id = ?
        `,
        [subscription.id]
      );
    }

    // ====================================================
    // Resposta final para o Stripe
    // ====================================================
    return res.status(200).json({
      received: true,
    });
  } catch (error) {
    console.error("Erro ao processar webhook do Stripe:", error);

    return res.status(500).json({
      erro: "Erro interno ao processar webhook",
      detalhe: error.message,
    });
  }
};
