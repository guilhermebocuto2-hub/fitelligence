const express = require("express");
const router = express.Router();

const authMiddleware = require("../middlewares/authMiddleware");
const dailyPlanController = require("../controllers/dailyPlanController");

// ======================================================
// Rota principal do plano diário
// ======================================================
router.get("/", authMiddleware, dailyPlanController.getDailyPlan);

module.exports = router;
