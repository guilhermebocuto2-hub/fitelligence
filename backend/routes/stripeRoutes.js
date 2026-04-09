const express = require("express");
const router = express.Router();

const authMiddleware = require("../middlewares/authMiddleware");
const stripeController = require("../controllers/stripeController");

// ======================================================
// Rota para criar sessão de checkout
// Usuário precisa estar autenticado
// ======================================================
router.post(
  "/create-checkout-session",
  authMiddleware,
  stripeController.criarCheckoutSession
);

// ======================================================
// Rota para consultar sessão de checkout
// ======================================================
router.get(
  "/checkout-session",
  authMiddleware,
  stripeController.buscarCheckoutSession
);

// ======================================================
// Rota para abrir portal do cliente Stripe
// ======================================================
router.post(
  "/create-portal-session",
  authMiddleware,
  stripeController.criarPortalSession
);

module.exports = router;