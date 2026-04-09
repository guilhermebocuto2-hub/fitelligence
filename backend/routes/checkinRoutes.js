const express = require('express');
const router = express.Router();
const checkinController = require('../controllers/checkinController');
const authMiddleware = require('../middlewares/authMiddleware');

router.post('/', authMiddleware, checkinController.criarCheckin);
router.get('/', authMiddleware, checkinController.listarCheckins);

module.exports = router;