const express = require('express');
const router = express.Router();
const comparacaoCorporalController = require('../controllers/comparacaoCorporalController');
const authMiddleware = require('../middlewares/authMiddleware');

router.get('/', authMiddleware, comparacaoCorporalController.buscarComparacaoCorporal);

module.exports = router;