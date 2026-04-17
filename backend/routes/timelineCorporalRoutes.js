const express = require('express');
const router = express.Router();

const timelineCorporalController = require('../controllers/timelineCorporalController');
const authMiddleware = require('../middlewares/authMiddleware');
const requirePlan = require('../middlewares/requirePlan');

router.get('/', authMiddleware, requirePlan(['premium']), timelineCorporalController.listarTimelineCorporal);

module.exports = router;