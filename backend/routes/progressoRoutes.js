const express = require('express');
const router = express.Router();
const progressoController = require('../controllers/progressoController');
const authMiddleware = require('../middlewares/authMiddleware');

router.post('/', authMiddleware, progressoController.criarProgresso);
router.get('/', authMiddleware, progressoController.listarProgresso);

module.exports = router;