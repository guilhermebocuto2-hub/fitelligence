const express = require('express');
const UsuarioController = require('../controllers/usuarioController');
const authMiddleware = require('../middlewares/authMiddleware');
const asyncHandler = require('../utils/asyncHandler');

const router = express.Router();

// ======================================================
// Rota de cadastro
// Responsável por criar um novo usuário no sistema
// ======================================================
router.post('/', asyncHandler(UsuarioController.criarUsuario));

// ======================================================
// Rota para buscar perfil do usuário autenticado
// ======================================================
router.get('/perfil', async (req, res) => {
  try {
    console.log("Rota /usuarios/perfil acessada");

    res.json({
      message: "Rota /usuarios/perfil funcionando",
      user: null
    });
  } catch (error) {
    console.error("Erro ao buscar perfil:", error);
    res.status(500).json({ error: "Erro interno" });
  }
});

router.get('/me', authMiddleware, asyncHandler(UsuarioController.me));
router.delete('/minha-conta', authMiddleware, asyncHandler(UsuarioController.excluirMinhaConta));

module.exports = router;
