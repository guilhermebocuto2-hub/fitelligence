// ======================================================
// Serviço central do Stripe
// Responsável por:
// - inicializar o SDK do Stripe
// - exportar uma instância reutilizável
// ======================================================

const Stripe = require("stripe");

// ======================================================
// Instância oficial do Stripe
// Usa a chave secreta do ambiente
// ======================================================
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

module.exports = stripe;