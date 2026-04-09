const ChatModel = require("../models/chatModel");
const { gerarRespostaInicialDaIA } = require("../services/chatIAService");
const apiResponse = require("../utils/apiResponse");

function getUsuarioId(req) {
  return req.usuario?.id || req.user?.id || req.usuarioId || null;
}

class ChatController {
  static async criarOuObterConversa(req, res) {
    try {
      const usuarioId = getUsuarioId(req);

      if (!usuarioId) {
        return res.status(401).json({ erro: "Usuário não autenticado" });
      }

      const conversa = await ChatModel.criarOuObterConversaAberta(usuarioId);

      return res.status(200).json(
        apiResponse(true, "Conversa carregada com sucesso", {
          conversa,
        })
      );
    } catch (error) {
      console.error("Erro ao criar ou obter conversa:", error);
      return res.status(500).json({
        erro: "Erro interno ao carregar conversa",
        detalhe: error.message,
      });
    }
  }

  static async obterConversaAtiva(req, res) {
    try {
      const usuarioId = getUsuarioId(req);

      if (!usuarioId) {
        return res.status(401).json({ erro: "Usuário não autenticado" });
      }

      const conversa = await ChatModel.buscarConversaAbertaPorUsuario(usuarioId);

      return res.status(200).json(
        apiResponse(true, "Conversa ativa carregada com sucesso", {
          conversa: conversa || null,
        })
      );
    } catch (error) {
      console.error("Erro ao obter conversa ativa:", error);
      return res.status(500).json({
        erro: "Erro interno ao obter conversa ativa",
        detalhe: error.message,
      });
    }
  }

  static async listarMensagens(req, res) {
    try {
      const usuarioId = getUsuarioId(req);
      const conversaId = req.params?.conversaId;

      if (!usuarioId) {
        return res.status(401).json({ erro: "Usuário não autenticado" });
      }

      const conversa = await ChatModel.buscarConversaPorIdEUsuario(
        conversaId,
        usuarioId
      );

      if (!conversa) {
        return res.status(404).json({
          erro: "Conversa não encontrada para este usuário",
        });
      }

      const mensagens = await ChatModel.listarMensagensPorConversa(conversa.id);

      return res.status(200).json(
        apiResponse(true, "Mensagens carregadas com sucesso", {
          conversa,
          mensagens,
        })
      );
    } catch (error) {
      console.error("Erro ao listar mensagens do chat:", error);
      return res.status(500).json({
        erro: "Erro interno ao listar mensagens",
        detalhe: error.message,
      });
    }
  }

  static async enviarMensagem(req, res) {
    try {
      const usuarioId = getUsuarioId(req);
      const conversaId = req.body?.conversa_id;
      const mensagem = String(req.body?.mensagem || "").trim();

      if (!usuarioId) {
        return res.status(401).json({ erro: "Usuário não autenticado" });
      }

      if (!conversaId || mensagem.length < 2) {
        return res.status(400).json({
          erro: "conversa_id e mensagem válida são obrigatórios",
        });
      }

      if (mensagem.length > 1000) {
        return res.status(400).json({
          erro: "Mensagem muito longa",
        });
      }

      const conversa = await ChatModel.buscarConversaPorIdEUsuario(
        conversaId,
        usuarioId
      );

      if (!conversa) {
        return res.status(404).json({
          erro: "Conversa não encontrada para este usuário",
        });
      }

      const mensagemUsuario = await ChatModel.criarMensagem({
        conversaId: conversa.id,
        remetente: "user",
        mensagem,
        tipo: "texto",
      });

      const respostaIA = gerarRespostaInicialDaIA(mensagem);

      const conversaAtualizada = await ChatModel.atualizarConversa({
        conversaId: conversa.id,
        usuarioId,
        status: respostaIA.statusConversa,
        origem: respostaIA.origemConversa,
      });

      const mensagemIA = await ChatModel.criarMensagem({
        conversaId: conversa.id,
        remetente: respostaIA.categoria === "suporte" ? "sistema" : "ia",
        mensagem: respostaIA.resposta,
        tipo: respostaIA.categoria === "suporte" ? "sistema" : "texto",
      });

      return res.status(201).json(
        apiResponse(true, "Mensagem enviada com sucesso", {
          conversa: conversaAtualizada,
          mensagem_usuario: mensagemUsuario,
          mensagem_ia: mensagemIA,
          categoria: respostaIA.categoria,
        })
      );
    } catch (error) {
      console.error("Erro ao enviar mensagem do chat:", error);
      return res.status(500).json({
        erro: "Erro interno ao enviar mensagem",
        detalhe: error.message,
      });
    }
  }
}

module.exports = ChatController;
