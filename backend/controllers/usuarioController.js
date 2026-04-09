const UsuarioModel = require("../models/usuarioModel");
const AppError = require("../utils/AppError");
const apiResponse = require("../utils/apiResponse");

class UsuarioController {
  // ======================================================
  // Cria um novo usuário
  // Responsável por:
  // - validar dados obrigatórios
  // - verificar se o e-mail já está em uso
  // - criar usuário com valores iniciais seguros
  // - devolver resposta pronta para o frontend
  // ======================================================
  static async criarUsuario(req, res, next) {
    try {
      // ==================================================
      // Log temporário de entrada para debug de cadastro Android
      // - mascara senha
      // ==================================================
      console.log("[CADASTRO-BACKEND] request recebida", {
        method: req.method,
        path: req.originalUrl,
        body: { ...req.body, senha: req.body?.senha ? "***" : undefined },
      });

      // ==================================================
      // Extrai dados enviados pelo frontend / Postman
      // ==================================================
      const {
        nome,
        email,
        senha,
        idade = null,
        peso = null,
        altura = null,
        objetivo = null,
        idioma = "pt-BR",
        timezone = "America/Sao_Paulo",
        nivel_atividade = null,
        genero = null,
        tipo_usuario = "usuario",
        plano = "free",
      } = req.body;

      // ==================================================
      // Validações básicas obrigatórias
      // ==================================================
      if (!nome || !email || !senha) {
        throw new AppError(
          "Nome, e-mail e senha são obrigatórios para criar a conta.",
          400
        );
      }

      // ==================================================
      // Verifica se já existe usuário com o mesmo e-mail
      // ==================================================
      const usuarioExistente = await UsuarioModel.findByEmail(email);

      if (usuarioExistente) {
        throw new AppError("Já existe uma conta com este e-mail.", 409);
      }

      // ==================================================
      // Cria o usuário com defaults seguros para o projeto
      // - tipo_usuario padrão: usuario
      // - plano padrão: free
      // ==================================================
      const novoUsuario = await UsuarioModel.create({
        nome,
        email,
        senha,
        idade,
        peso,
        altura,
        objetivo,
        idioma,
        timezone,
        nivel_atividade,
        genero,
        tipo_usuario,
        plano,
      });

      // ==================================================
      // Log temporário antes da resposta de sucesso
      // ==================================================
      console.log("[CADASTRO-BACKEND] usuario criado com sucesso", {
        id: novoUsuario.id,
        email: novoUsuario.email,
        tipo_usuario: novoUsuario.tipo_usuario || "usuario",
        plano: novoUsuario.plano || "free",
      });

      // ==================================================
      // Resposta de sucesso
      // Não devolvemos a senha por segurança
      // ==================================================
      return res.status(201).json(
        apiResponse(true, "Usuário criado com sucesso", {
          id: novoUsuario.id,
          nome: novoUsuario.nome,
          email: novoUsuario.email,
          idade: novoUsuario.idade || null,
          peso: novoUsuario.peso || null,
          altura: novoUsuario.altura || null,
          objetivo: novoUsuario.objetivo || null,
          idioma: novoUsuario.idioma || "pt-BR",
          timezone: novoUsuario.timezone || "America/Sao_Paulo",
          nivel_atividade: novoUsuario.nivel_atividade || null,
          genero: novoUsuario.genero || null,
          tipo_usuario: novoUsuario.tipo_usuario || "usuario",
          plano: novoUsuario.plano || "free",
        })
      );
    } catch (error) {
      // ==================================================
      // Log temporário de erro completo no cadastro
      // ==================================================
      console.error("[CADASTRO-BACKEND] erro ao criar usuario", {
        message: error?.message,
        stack: error?.stack,
        code: error?.code,
        statusCode: error?.statusCode,
      });

      next(error);
    }
  }

  // ======================================================
  // Retorna o perfil do usuário autenticado
  // Responsável por:
  // - identificar o usuário a partir do authMiddleware
  // - buscar dados atualizados no banco
  // - devolver perfil completo para o frontend
  // ======================================================
  static async me(req, res, next) {
    try {
      // ==================================================
      // Recupera o ID do usuário autenticado
      // Compatível com diferentes formatos do middleware
      // ==================================================
      const usuarioId = req.usuario?.id || req.user?.id || req.usuarioId;

      if (!usuarioId) {
        throw new AppError("Usuário não autenticado", 401);
      }

      // ==================================================
      // Busca usuário no banco
      // ==================================================
      const usuario = await UsuarioModel.findById(usuarioId);

      if (!usuario) {
        throw new AppError("Usuário não encontrado", 404);
      }

      // ==================================================
      // Retorna perfil pronto para frontend
      // ==================================================
      return res.status(200).json(
        apiResponse(true, "Perfil carregado com sucesso", {
          id: usuario.id,
          nome: usuario.nome,
          email: usuario.email,
          idade: usuario.idade,
          peso: usuario.peso,
          altura: usuario.altura,
          objetivo: usuario.objetivo,
          idioma: usuario.idioma,
          timezone: usuario.timezone,
          nivel_atividade: usuario.nivel_atividade,
          genero: usuario.genero,

          // ==============================================
          // Campos fundamentais para a nova arquitetura
          // ==============================================
          tipo_usuario: usuario.tipo_usuario || "usuario",
          plano: usuario.plano || "free",
          stripe_billing_cycle: usuario.stripe_billing_cycle || null,
          onboarding_status: usuario.onboarding_status || null,
          onboarding_concluido_em: usuario.onboarding_concluido_em || null,
      
  
        })
      );
    } catch (error) {
      next(error);
    }
  }

  // ======================================================
  // Exclui a conta do usuÃ¡rio autenticado
  // ResponsÃ¡vel por:
  // - garantir que o usuÃ¡rio sÃ³ remova a prÃ³pria conta
  // - aplicar soft delete sem quebrar relaÃ§Ãµes existentes
  // - devolver resposta clara para o frontend/webview
  // ======================================================
  static async excluirMinhaConta(req, res, next) {
    try {
      const usuarioId = req.usuario?.id || req.user?.id || req.usuarioId;

      if (!usuarioId) {
        throw new AppError("UsuÃ¡rio nÃ£o autenticado", 401);
      }

      const contaExcluida = await UsuarioModel.softDeleteById(usuarioId);

      if (!contaExcluida) {
        throw new AppError("UsuÃ¡rio nÃ£o encontrado", 404);
      }

      return res.status(200).json(
        apiResponse(true, "Conta excluÃ­da com sucesso", {
          conta_excluida: true,
        })
      );
    } catch (error) {
      next(error);
    }
  }
}

module.exports = UsuarioController;
