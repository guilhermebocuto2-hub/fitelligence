const express = require('express');
const router = express.Router();

const assinaturaController = require('../controllers/assinaturaController');
const authMiddleware = require('../middlewares/authMiddleware');

router.get('/planos', assinaturaController.listarPlanos);

router.post('/assinar',
  authMiddleware,
  assinaturaController.assinarPlano
);

router.get('/minha',
  authMiddleware,
  assinaturaController.minhaAssinatura
);

module.exports = router;