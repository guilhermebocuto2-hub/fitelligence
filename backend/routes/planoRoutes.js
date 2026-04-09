const express = require('express');
const router = express.Router();
const planoController = require('../controllers/planoController');
const authMiddleware = require('../middlewares/authMiddleware');

router.post('/', authMiddleware, planoController.criarPlano);

module.exports = router;