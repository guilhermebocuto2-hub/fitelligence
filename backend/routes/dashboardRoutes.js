const express = require("express");
const router = express.Router();

// ======================================================
// Middlewares
// ======================================================
const authMiddleware = require("../middlewares/authMiddleware");
const planoPremiumMiddleware = require("../middlewares/planoMiddleware");

// ======================================================
// Controller do dashboard
// ======================================================
const dashboardController = require("../controllers/dashboardController");

// ======================================================
// Rota principal do dashboard
// Acessível para qualquer usuário autenticado
// ======================================================
router.get("/", authMiddleware, dashboardController.getDashboard);

// ======================================================
// Exemplo de rota premium
// Só deve existir se a função getResumoAvancado realmente
// estiver criada no dashboardController
// ======================================================
// router.get(
//   "/resumo-alimentar-avancado",
//   authMiddleware,
//   planoPremiumMiddleware,
//   dashboardController.getResumoAvancado
// );

module.exports = router;