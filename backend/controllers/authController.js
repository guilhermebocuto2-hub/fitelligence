const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const UsuarioModel = require("../models/usuarioModel");
const AppError = require("../utils/AppError");
const apiResponse = require("../utils/apiResponse");
const socialAuthService = require("../services/socialAuthService");

function buildAuthPayload(usuario) {
  const token = jwt.sign(
    {
      id: usuario.id,
      email: usuario.email,
      tipo_usuario: usuario.tipo_usuario || "usuario",
    },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRES_IN || "7d",
    }
  );

  return {
    usuario: {
      id: usuario.id,
      nome: usuario.nome,
      email: usuario.email,
      tipo_usuario: usuario.tipo_usuario || "usuario",
      plano: usuario.plano || "free",
      stripe_billing_cycle: usuario.stripe_billing_cycle || null,
    },
    token,
  };
}

class AuthController {
  static async login(req, res, next) {
    try {
      // ==================================================
      // Log temporário de entrada para debug de login Android
      // - mascara senha
      // ==================================================
      console.log("[LOGIN-BACKEND] request recebida", {
        method: req.method,
        path: req.originalUrl,
        body: { ...req.body, senha: req.body?.senha ? "***" : undefined },
      });

      // ==================================================
      // Extrai email e senha do body da requisição
      // ==================================================
      const { email, senha } = req.body;

      // ==================================================
      // Valida campos obrigatórios
      // ==================================================
      if (!email || !senha) {
        throw new AppError("Email e senha são obrigatórios", 400);
      }

      // ==================================================
      // Busca usuário pelo email
      // ==================================================
      const usuario = await UsuarioModel.findByEmail(email);

      if (!usuario) {
        throw new AppError("Email ou senha inválidos", 401);
      }

      // ==================================================
      // Segurança correta:
      // contas sociais puras não podem usar login local.
      // ==================================================
      if (usuario.provider && usuario.provider !== "local") {
        throw new AppError(
          "Esta conta utiliza login social. Use o botão de login com Google ou Apple.",
          401
        );
      }

      // ==================================================
      // Compara senha enviada com hash salvo no banco
      // ==================================================
      const senhaValida = await bcrypt.compare(senha, usuario.senha);

      if (!senhaValida) {
        throw new AppError("Email ou senha inválidos", 401);
      }

      // ==================================================
      // Log temporário antes da resposta de sucesso
      // ==================================================
      console.log("[LOGIN-BACKEND] login validado", {
        id: usuario.id,
        email: usuario.email,
        tipo_usuario: usuario.tipo_usuario || "usuario",
      });

      return res
        .status(200)
        .json(
          apiResponse(
            true,
            "Login realizado com sucesso",
            buildAuthPayload(usuario)
          )
        );
    } catch (error) {
      // ==================================================
      // Log temporário de erro completo no login
      // ==================================================
      console.error("[LOGIN-BACKEND] erro no login", {
        message: error?.message,
        stack: error?.stack,
        code: error?.code,
        statusCode: error?.statusCode,
      });

      next(error);
    }
  }

  static async socialLogin(req, res, next) {
    try {
      // ==================================================
      // Base de auth social:
      // nesta fase recebemos a identidade social
      // normalizada para localizar, vincular ou criar
      // o usuário interno sem quebrar o auth atual.
      // ==================================================
      const usuario = await socialAuthService.findOrCreateFromSocialIdentity(
        req.body || {}
      );

      return res.status(200).json(
        apiResponse(
          true,
          "Login social realizado com sucesso",
          buildAuthPayload(usuario)
        )
      );
    } catch (error) {
      next(error);
    }
  }
}

module.exports = AuthController;
