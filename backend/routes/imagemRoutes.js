const express = require('express');
const router = express.Router();

const imagemController = require('../controllers/imagemController');
const authMiddleware = require('../middlewares/authMiddleware');
const upload = require('../middlewares/upload');
const checkLimitePlano = require('../middlewares/checkLimitePlano');

router.post(
  '/refeicao',
  authMiddleware,
  checkLimitePlano('analise_refeicao'),
  upload.single('imagem'),
  imagemController.enviarImagemRefeicao
);

router.post(
  '/corporal',
  authMiddleware,
  upload.single('imagem'),
  imagemController.enviarImagemCorporal
);

router.get(
  '/',
  authMiddleware,
  imagemController.listarImagens
);

module.exports = router;