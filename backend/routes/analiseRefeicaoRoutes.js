const express = require('express');
const router = express.Router();

const analiseRefeicaoController = require('../controllers/analiseRefeicaoController');
const authMiddleware = require('../middlewares/authMiddleware');

router.post('/', authMiddleware, analiseRefeicaoController.criarAnaliseRefeicao);
router.get('/', authMiddleware, analiseRefeicaoController.listarAnalisesRefeicao);

module.exports = router;