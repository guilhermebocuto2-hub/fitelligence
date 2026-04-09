const express = require('express');
const router = express.Router();
const recomendacaoController = require('../controllers/recomendacaoController');
const authMiddleware = require('../middlewares/authMiddleware');

router.get('/', authMiddleware, recomendacaoController.buscarRecomendacao);

module.exports = router;