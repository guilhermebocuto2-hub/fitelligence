// ======================================================
// Serviço central do Stripe
// Responsável por:
// - inicializar o SDK do Stripe
// - exportar uma instância reutilizável
// ======================================================

const Stripe = require("stripe");

// ======================================================
// Inicialização resiliente do Stripe
// Evita derrubar o bootstrap se a env ainda não existir
// ======================================================
let stripeInstance = null;

function getStripe() {
  if (stripeInstance) {
    return stripeInstance;
  }

  if (!process.env.STRIPE_SECRET_KEY) {
    const error = new Error("STRIPE_SECRET_KEY não configurada.");
    error.statusCode = 503;
    throw error;
  }

  stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY);
  return stripeInstance;
}

module.exports = getStripe;
