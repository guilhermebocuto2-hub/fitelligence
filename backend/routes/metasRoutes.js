const express = require("express");
const MetaController = require("../controllers/metaController");
const authMiddleware = require("../middlewares/authMiddleware");
const asyncHandler = require("../utils/asyncHandler");

const router = express.Router();

// ======================================================
// Todas as rotas de metas são privadas
// ======================================================
router.use(authMiddleware);

// ======================================================
// LISTAR METAS DO USUÁRIO
// GET /metas
// ======================================================
router.get("/", asyncHandler(MetaController.listar));

// ======================================================
// CRIAR META MANUAL
// POST /metas
// ======================================================
router.post("/", asyncHandler(MetaController.criar));

// ======================================================
// ATUALIZAR META
// PUT /metas/:id
// ======================================================
router.put("/:id", asyncHandler(MetaController.atualizar));

// ======================================================
// CONCLUIR META
// PATCH /metas/:id/concluir
// ======================================================
router.patch("/:id/concluir", asyncHandler(MetaController.concluir));

module.exports = router;