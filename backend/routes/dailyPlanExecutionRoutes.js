const express = require("express");
const router = express.Router();

const authMiddleware = require("../middlewares/authMiddleware");
const dailyPlanExecutionController = require("../controllers/dailyPlanExecutionController");

// ======================================================
// Execucao do plano do dia:
// - GET carrega a execucao atual
// - POST atualiza parcialmente a execucao atual
// ======================================================
router.get("/", authMiddleware, dailyPlanExecutionController.getExecution);
router.post("/", authMiddleware, dailyPlanExecutionController.postExecution);

module.exports = router;
