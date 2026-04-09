const express = require('express');
const router = express.Router();

const progressoNutricionalController = require('../controllers/progressoNutricionalController');
const authMiddleware = require('../middlewares/authMiddleware');

router.get('/', authMiddleware, progressoNutricionalController.buscarProgressoNutricional);

module.exports = router;