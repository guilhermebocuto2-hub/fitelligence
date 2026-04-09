// ======================================================
// Middleware de plano premium
// Responsável por:
// - verificar se o usuário tem acesso premium
// - bloquear rotas específicas
// ======================================================

const AppError = require("../utils/AppError");

function planoPremiumMiddleware(req, res, next) {
  // ====================================================
  // Usuário vem do authMiddleware
  // ====================================================
  const usuario = req.usuario;

  // ====================================================
  // Verifica se é premium
  // ====================================================
  if (!usuario.plano || usuario.plano !== "premium") {
    return next(
      new AppError(
        "Este recurso é exclusivo para usuários premium",
        403
      )
    );
  }

  // ====================================================
  // Se for premium, libera acesso
  // ====================================================
  return next();
}

module.exports = planoPremiumMiddleware;