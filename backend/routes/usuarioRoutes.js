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
router.get('/me', authMiddleware, asyncHandler(UsuarioController.me));
router.delete('/minha-conta', authMiddleware, asyncHandler(UsuarioController.excluirMinhaConta));

module.exports = router;
