const express = require("express");
const router = express.Router();

const authMiddleware = require("../middlewares/authMiddleware");
const billingController = require("../controllers/billingController");

// ======================================================
// Rotas autenticadas de billing:
// - /billing/me: status atual da assinatura
// - /billing/mobile/validate: recebimento de payload mobile
// ======================================================
router.get("/me", authMiddleware, billingController.getBillingMe);
router.post("/mobile/validate", authMiddleware, billingController.postMobileValidate);

module.exports = router;
