const express = require('express');
const router = express.Router();
const comparacaoCorporalController = require('../controllers/comparacaoCorporalController');
const authMiddleware = require('../middlewares/authMiddleware');
const requirePlan = require('../middlewares/requirePlan');

router.get('/', authMiddleware, requirePlan(['premium']), comparacaoCorporalController.buscarComparacaoCorporal);

module.exports = router;