const express = require("express");
const router = express.Router();

// ======================================================
// Middleware de autenticação
// Garante que apenas usuários autenticados acessem o onboarding
// ======================================================
const authMiddleware = require("../middlewares/authMiddleware");

// ======================================================
// Controller do onboarding
// Responsável por receber a requisição e delegar a lógica
// ======================================================
const onboardingController = require("../controllers/onboardingController");

// ======================================================
// Rotas do onboarding
// ======================================================
router.get("/", authMiddleware, onboardingController.buscarOnboarding);
router.post("/start", authMiddleware, onboardingController.iniciarOnboarding);
router.post("/save-step", authMiddleware, onboardingController.salvarEtapa);
router.post("/complete", authMiddleware, onboardingController.concluirOnboarding);
router.put("/update-step/:secao", authMiddleware, onboardingController.atualizarEtapa);

module.exports = router;