const express = require('express');
const router = express.Router();
const alertasController = require('../controllers/alertasController');
const authMiddleware = require('../middlewares/authMiddleware');

router.get('/', authMiddleware, alertasController.buscarAlertas);

module.exports = router;