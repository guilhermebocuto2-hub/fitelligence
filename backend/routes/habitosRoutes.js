const express = require('express');
const router = express.Router();
const habitosController = require('../controllers/habitosController');
const authMiddleware = require('../middlewares/authMiddleware');

router.post('/', authMiddleware, habitosController.criarHabito);
router.get('/', authMiddleware, habitosController.listarHabitos);

module.exports = router;