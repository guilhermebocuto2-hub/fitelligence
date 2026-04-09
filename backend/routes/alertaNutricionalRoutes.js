const express = require('express');
const router = express.Router();

const alertaNutricionalController = require('../controllers/alertaNutricionalController');
const authMiddleware = require('../middlewares/authMiddleware');

router.get('/', authMiddleware, alertaNutricionalController.buscarAlertaNutricional);

module.exports = router;