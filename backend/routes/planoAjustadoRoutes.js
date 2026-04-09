const express = require('express');
const router = express.Router();
const planoAjustadoController = require('../controllers/planoAjustadoController');
const authMiddleware = require('../middlewares/authMiddleware');

router.post('/', authMiddleware, planoAjustadoController.gerarPlanoAjustado);

module.exports = router;