const express = require('express');
const router = express.Router();

const resumoNutricionalController = require('../controllers/resumoNutricionalController');
const authMiddleware = require('../middlewares/authMiddleware');

router.get('/', authMiddleware, resumoNutricionalController.buscarResumoNutricional);

module.exports = router;