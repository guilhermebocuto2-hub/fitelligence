const express = require('express');
const router = express.Router();

const riscosNutricionaisController = require('../controllers/riscosNutricionaisController');
const authMiddleware = require('../middlewares/authMiddleware');

router.get('/', authMiddleware, riscosNutricionaisController.buscarRiscosNutricionais);

module.exports = router;