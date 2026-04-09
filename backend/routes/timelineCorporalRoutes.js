const express = require('express');
const router = express.Router();

const timelineCorporalController = require('../controllers/timelineCorporalController');
const authMiddleware = require('../middlewares/authMiddleware');

router.get('/', authMiddleware, timelineCorporalController.listarTimelineCorporal);

module.exports = router;