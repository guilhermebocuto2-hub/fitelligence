const express = require("express");
const router = express.Router();

const authMiddleware = require("../middlewares/authMiddleware");
const chatController = require("../controllers/chatController");

// ======================================================
// Chat MVP:
// - conversa ativa do usuário
// - listagem de mensagens com ownership
// - envio de mensagem com resposta inicial da IA
// ======================================================
router.post("/conversa", authMiddleware, chatController.criarOuObterConversa);
router.get("/conversa", authMiddleware, chatController.obterConversaAtiva);
router.get("/mensagens/:conversaId", authMiddleware, chatController.listarMensagens);
router.post("/mensagem", authMiddleware, chatController.enviarMensagem);

module.exports = router;
