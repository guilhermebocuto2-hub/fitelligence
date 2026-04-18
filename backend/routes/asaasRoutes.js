const express = require("express");
const router = express.Router();

const asaasController = require("../controllers/asaasController");
const authMiddleware = require("../middlewares/authMiddleware");

// POST /asaas/create-subscription — requer autenticação
router.post("/create-subscription", authMiddleware, asaasController.criarAssinatura);

// POST /asaas/webhook — público (Asaas não envia token)
router.post("/webhook", asaasController.webhook);

module.exports = router;
