const express = require('express');
const router = express.Router();
const timelineRefeicoesController = require('../controllers/timelineRefeicoesController');
const authMiddleware = require('../middlewares/authMiddleware');

router.get('/', authMiddleware, timelineRefeicoesController.listarTimelineRefeicoes);

module.exports = router;