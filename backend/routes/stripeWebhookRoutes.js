const express = require("express");
const router = express.Router();

const stripeWebhookController = require("../controllers/stripeWebhookController");

// ======================================================
// Webhook do Stripe
// Esta rota precisa receber o corpo bruto (raw)
// O express.raw será aplicado no server.js
// ======================================================
router.post("/", stripeWebhookController.handleStripeWebhook);

module.exports = router;